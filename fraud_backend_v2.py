"""
ATM Fraud Detection Simulator - Backend v2
==========================================
Drop your model .py files into the models/ folder.
The backend executes them, extracts the trained pipeline,
and stores a proper train/test split for reproducible evaluation.

Start with:
    python -m uvicorn fraud_backend_v2:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import importlib.util
import threading
import traceback
import hashlib
import logging
import time
import sys
import io
import os
import math
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split

# ─── Config ───────────────────────────────────────────────────────────────────

MODELS_DIR   = os.path.join(os.path.dirname(__file__), "models")
LR_FILE      = os.path.join(MODELS_DIR, "logistic_regression_analysis.py")
DT_FILE      = os.path.join(MODELS_DIR, "decision_tree_analysis.py")
DATASET_FILE = os.path.join(MODELS_DIR, "dataset.csv")

os.makedirs(MODELS_DIR, exist_ok=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")
log = logging.getLogger(__name__)

app = FastAPI(title="Fraud Simulator Backend v2", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ─── Model State ──────────────────────────────────────────────────────────────

class ModelState:
    def __init__(self):
        self.lr_trained  = None
        self.dt_trained  = None
        self.lr_error    = None
        self.dt_error    = None
        self.lr_status   = "not loaded"
        self.dt_status   = "not loaded"
        self.lr_metrics     = None
        self.dt_metrics     = None
        self.dataset_md5    = None
        self.lock           = threading.Lock()
        self.X_test         = None
        self.y_test         = None
        self.X_test_lr      = None
        self.y_test_lr      = None
        self.X_test_dt      = None
        self.y_test_dt      = None
        self.test_size      = 0.3
        self.lr_test_scores    = None
        self.dt_test_scores    = None
        self.lr_no_smote_scores = None
        self.lr_no_smote_labels = None
        self.dt_no_smote_scores = None
        self.dt_no_smote_labels = None

state = ModelState()

# ─── Spatial Velocity State ───────────────────────────────────────────────────

_client_history: dict = {}   # client_id → {lat, lng, dt}
_history_lock = threading.Lock()

# ─── Spatial Velocity Helpers ────────────────────────────────────────────────

def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.asin(math.sqrt(min(a, 1.0)))


def check_spatial_velocity(f: dict) -> tuple:
    """
    Returns (impossible_travel: bool, speed_kmh: float | None).
    Updates _client_history with this transaction.
    Overrides to True when computed speed > 900 km/h.
    """
    client_id = str(f.get('client_id', '') or '')
    lat = float(f.get('lat', 0) or 0)
    lng = float(f.get('lng', 0) or 0)
    date_s = f.get('date', '') or ''
    time_s = f.get('time', '12:00') or '12:00'
    txn_dt = None
    try:
        txn_dt = datetime.strptime(f"{date_s} {time_s}", '%Y-%m-%d %H:%M')
    except Exception:
        pass

    impossible, speed_kmh = False, None

    if client_id and lat and lng and txn_dt:
        with _history_lock:
            prev = _client_history.get(client_id)
            if prev:
                dist = haversine_km(prev['lat'], prev['lng'], lat, lng)
                hours = abs((txn_dt - prev['dt']).total_seconds()) / 3600
                if hours > 0:
                    speed_kmh = dist / hours
                    impossible = speed_kmh > 900
            _client_history[client_id] = {'lat': lat, 'lng': lng, 'dt': txn_dt}

    return impossible, speed_kmh


# ─── Module Loader ────────────────────────────────────────────────────────────

def load_and_train(filepath: str, module_name: str):
    try:
        spec = importlib.util.spec_from_file_location(module_name, filepath)
        module = importlib.util.module_from_spec(spec)

        old_stdout = sys.stdout
        old_stderr = sys.stderr
        sys.stdout = io.StringIO()
        captured_err = io.StringIO()
        sys.stderr = captured_err
        old_cwd = os.getcwd()
        os.chdir(MODELS_DIR)

        try:
            log.info(f"Executing and training {module_name}...")
            spec.loader.exec_module(module)
        finally:
            os.chdir(old_cwd)
            sys.stdout = old_stdout
            sys.stderr = old_stderr
            err_output = captured_err.getvalue()
            if err_output.strip():
                log.warning(f"{module_name} stderr:\n{err_output}")

        trained_model = getattr(module, 'pipeline',
                        getattr(module, 'dt_model',
                        getattr(module, 'model', None)))

        if trained_model is None:
            return None, None, None, None, "No variable named 'pipeline', 'dt_model', or 'model' found."

        X_test = getattr(module, 'X_test_export', None)
        y_test = getattr(module, 'y_test_export', None)

        # Capture metrics computed by the script itself
        cm_raw = getattr(module, 'cm', None)
        acc  = getattr(module, 'accuracy',  None)
        prec = getattr(module, 'precision', None)
        rec  = getattr(module, 'recall',    None)
        f1v  = getattr(module, 'f1',        None)
        thr  = getattr(module, 'best_threshold', None)

        log.info(f"{module_name} module vars — accuracy={acc}, precision={prec}, recall={rec}, f1={f1v}, cm={'yes' if cm_raw is not None else 'no'}")

        # Only store metrics if the script actually computed them
        if acc is not None:
            metrics = {
                "accuracy":  float(acc),
                "precision": float(prec) if prec is not None else None,
                "recall":    float(rec)  if rec  is not None else None,
                "f1":        float(f1v)  if f1v  is not None else None,
                "cm":        cm_raw.tolist() if cm_raw is not None else None,
                "threshold": float(thr) if thr is not None else 0.5,
            }
            log.info(f"{module_name} metrics captured: acc={acc:.4f}")
        else:
            metrics = None
            log.warning(f"{module_name} did not expose accuracy/precision/recall/f1 variables")

        no_smote_scores = getattr(module, 'no_smote_scores', None)
        no_smote_labels = getattr(module, 'no_smote_labels', None)
        if metrics is not None and no_smote_scores is not None:
            metrics['no_smote_scores'] = no_smote_scores
            metrics['no_smote_labels'] = no_smote_labels

        return trained_model, X_test, y_test, metrics, None

    except Exception:
        return None, None, None, None, traceback.format_exc()

def file_md5(filepath: str) -> Optional[str]:
    try:
        with open(filepath, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except Exception:
        return None

def reload_models(reason: str = "manual", test_size: float = 0.3):
    log.info(f"Reloading models ({reason}), test_size={test_size}")

    if not os.path.exists(DATASET_FILE):
        with state.lock:
            state.lr_status = state.dt_status = "Waiting for dataset.csv"
        return

    # ── Do all slow work OUTSIDE the lock ──────────────────────────────────────

    # Train LR
    lr_model = lr_Xte = lr_yte = lr_metrics = lr_err = None
    if os.path.exists(LR_FILE):
        lr_model, lr_Xte, lr_yte, lr_metrics, lr_err = load_and_train(LR_FILE, "logistic_regression")

    # Train DT
    dt_model = dt_Xte = dt_yte = dt_metrics = dt_err = None
    if os.path.exists(DT_FILE):
        dt_model, dt_Xte, dt_yte, dt_metrics, dt_err = load_and_train(DT_FILE, "decision_tree")

    # Pre-compute test scores outside lock (slow predict_proba calls)
    lr_scores = lr_labels = dt_scores = dt_labels = None
    X_test_lr = X_test_dt = y_test_lr = y_test_dt = None

    if lr_Xte is not None:
        X_test_lr = lr_Xte.reset_index(drop=True)
        y_test_lr = lr_yte.reset_index(drop=True)
    if dt_Xte is not None:
        X_test_dt = dt_Xte.reset_index(drop=True)
        y_test_dt = dt_yte.reset_index(drop=True)

    try:
        if lr_model is not None and X_test_lr is not None:
            lr_scores = lr_model.predict_proba(X_test_lr)[:, 1].tolist()
            lr_labels = y_test_lr.tolist()
            log.info(f"LR test scores computed: {len(lr_scores)} rows")
        if dt_model is not None and X_test_dt is not None:
            dt_scores = dt_model.predict_proba(X_test_dt)[:, 1].tolist()
            dt_labels = y_test_dt.tolist()
            log.info(f"DT test scores computed: {len(dt_scores)} rows")
    except Exception as e:
        log.warning(f"Could not precompute test scores: {e}")

    # ── Commit everything atomically under lock (fast) ─────────────────────────
    with state.lock:
        if lr_model is not None or os.path.exists(LR_FILE):
            state.lr_trained = lr_model
            state.lr_error   = lr_err
            state.lr_status  = "load error" if lr_err else ("logistic_regression_analysis.py not found" if not os.path.exists(LR_FILE) else "trained successfully")
            state.lr_metrics = lr_metrics
        if dt_model is not None or os.path.exists(DT_FILE):
            state.dt_trained = dt_model
            state.dt_error   = dt_err
            state.dt_status  = "load error" if dt_err else ("decision_tree_analysis.py not found" if not os.path.exists(DT_FILE) else "trained successfully")
            state.dt_metrics = dt_metrics

        if X_test_lr is not None:
            state.X_test_lr      = X_test_lr
            state.y_test_lr      = y_test_lr
            state.lr_test_scores = lr_scores
            state.lr_test_labels = lr_labels
            log.info(f"LR test split: {len(y_test_lr)} rows ({int(y_test_lr.sum())} fraud)")

        if X_test_dt is not None:
            state.X_test_dt      = X_test_dt
            state.y_test_dt      = y_test_dt
            state.dt_test_scores = dt_scores
            state.dt_test_labels = dt_labels
            log.info(f"DT test split: {len(y_test_dt)} rows ({int(y_test_dt.sum())} fraud)")

        # Canonical test set for dataset-sample
        state.X_test = state.X_test_dt if X_test_dt is not None else state.X_test_lr
        state.y_test = state.y_test_dt if X_test_dt is not None else state.y_test_lr
        state.test_size   = test_size
        state.dataset_md5 = file_md5(DATASET_FILE)

# ─── File Watcher ─────────────────────────────────────────────────────────────

def watch_models():
    tracked = {
        LR_FILE:      file_md5(LR_FILE),
        DT_FILE:      file_md5(DT_FILE),
        DATASET_FILE: file_md5(DATASET_FILE),
    }
    while True:
        time.sleep(2)
        changed, reason_parts = False, []
        for path, old_hash in list(tracked.items()):
            new_hash = file_md5(path)
            if new_hash != old_hash:
                tracked[path] = new_hash
                changed = True
                reason_parts.append(f"{os.path.basename(path)} changed")
        if changed:
            reload_models(reason=", ".join(reason_parts), test_size=state.test_size)

# ─── Row / Batch Builders ─────────────────────────────────────────────────────

def features_to_record(f: dict) -> dict:
    """
    Converts raw transaction features into the 31-column format that the
    analysis models were trained on (matching canadian_fraud_cleaned.csv +
    behavioral features from logistic_regression_analysis.py /
    decision_tree_analysis.py).
    """
    # ── Derive age ────────────────────────────────────────────────────────────
    try:
        bday = datetime.strptime(f.get('birthday', '1980-01-01'), '%Y-%m-%d')
        dt_str = f"{f.get('date', '2026-01-01')} {f.get('time', '12:00')}"
        txn_dt = datetime.strptime(dt_str, '%Y-%m-%d %H:%M')
        age = (txn_dt - bday).days / 365.25
    except Exception:
        age = 40.0

    # ── Derive trans_hour and trans_day_of_week ───────────────────────────────
    try:
        dt_str = f"{f.get('date', '2026-01-01')} {f.get('time', '12:00')}"
        txn_dt = datetime.strptime(dt_str, '%Y-%m-%d %H:%M')
        trans_hour        = txn_dt.hour
        trans_day_of_week = txn_dt.weekday()
    except Exception:
        trans_hour        = 12
        trans_day_of_week = 0

    # ── Ordinal encode Education_Level ────────────────────────────────────────
    edu_map = {'Unknown': -1, 'Uneducated': 0, 'High School': 1,
               'College': 2, 'Graduate': 3, 'Post-Graduate': 4, 'Doctorate': 5}
    edu = edu_map.get(f.get('education_level', 'Unknown'), -1)

    # ── Ordinal encode Income_Category ───────────────────────────────────────
    inc_map = {'Unknown': -1, 'Less than $40K': 0, '$40K - $60K': 1,
               '$60K - $80K': 2, '$80K - $120K': 3, '$120K +': 4}
    inc = inc_map.get(f.get('income_category', 'Unknown'), -1)

    # ── Ordinal encode Card_Category ─────────────────────────────────────────
    card_map = {'Unknown': -1, 'Blue': 0, 'Silver': 1, 'Gold': 2, 'Platinum': 3}
    card = card_map.get(f.get('card_category', 'Unknown'), -1)

    # ── One-hot encode Marital_Status ─────────────────────────────────────────
    ms = f.get('marital_status', 'Unknown')
    ms_divorced = int(ms == 'Divorced')
    ms_married  = int(ms == 'Married')
    ms_single   = int(ms == 'Single')
    ms_unknown  = int(ms == 'Unknown')

    # ── One-hot encode business_type ──────────────────────────────────────────
    bt = f.get('business_type', 'Unknown')
    bt_types = ['Big Box Retail', 'E-commerce', 'Electronics',
                'Food & Beverage', 'Gas Station', 'Grocery',
                'Pharmacy/Retail', 'Subscription', 'Transportation']
    bt_ohe = {f'business_type_{t}': int(bt == t) for t in bt_types}

    amt          = float(f.get('amount', 0.0) or 0.0)
    months       = int(f.get('months_on_book', 0) or 0)

    # ── Behavioral features — must match analysis scripts exactly ─────────────
    # amt_log: log-scaled amount
    amt_log = math.log1p(amt)
    # is_high_amt: top-5% flag — 95th percentile from training dataset = 188.233
    is_high_amt = int(amt > 188.233)
    # is_night: transactions 10pm–5am
    is_night = int(trans_hour <= 5 or trans_hour >= 22)
    # is_weekend: Saturday=5, Sunday=6
    is_weekend = int(trans_day_of_week >= 5)
    # amt_per_month: spending intensity relative to tenure
    amt_per_month = amt / (months + 1)
    # new_customer: less than 1 year on book
    new_customer = int(months < 12)
    # amt_income_ratio: spending relative to income tier (+2 to handle -1 category)
    amt_income_ratio = amt / (inc + 2)

    row = {
        'Education_Level':          edu,
        'Income_Category':          inc,
        'Card_Category':            card,
        'Months_on_book':           months,
        'amt':                      amt,
        'latitude':                 float(f.get('lat', 0.0) or 0.0),
        'longitude':                float(f.get('lng', 0.0) or 0.0),
        'age':                      age,
        'trans_hour':               trans_hour,
        'trans_day_of_week':        trans_day_of_week,
        'Marital_Status_Divorced':  ms_divorced,
        'Marital_Status_Married':   ms_married,
        'Marital_Status_Single':    ms_single,
        'Marital_Status_Unknown':   ms_unknown,
        **bt_ohe,
        'amt_log':                  amt_log,
        'is_high_amt':              is_high_amt,
        'is_night':                 is_night,
        'is_weekend':               is_weekend,
        'amt_per_month':            amt_per_month,
        'new_customer':             new_customer,
        'amt_income_ratio':         amt_income_ratio,
    }
    return row

def build_row(features: dict) -> pd.DataFrame:
    return pd.DataFrame([features_to_record(features)])

# ─── Feature Importance ───────────────────────────────────────────────────────

def get_top_features(model, df_row: pd.DataFrame, top_n: int = 5) -> list:
    try:
        # Determine if model is a Pipeline or a plain estimator
        has_pipeline = hasattr(model, 'named_steps')

        if has_pipeline:
            preprocessor = model.named_steps.get('preprocessor')
            classifier   = model.named_steps.get('classifier')
            if preprocessor is None or classifier is None:
                return []
            X_transformed = preprocessor.transform(df_row)
            try:
                feature_names = preprocessor.get_feature_names_out()
            except Exception:
                feature_names = df_row.columns.tolist()
        else:
            # Plain estimator (e.g. DecisionTreeClassifier) — use df_row directly
            classifier    = model
            X_transformed = df_row.values
            feature_names = df_row.columns.tolist()

        def clean_name(name):
            name = str(name)
            is_numeric = name.startswith("num__")
            for prefix in ["num__", "cat__", "remainder__"]:
                if name.startswith(prefix):
                    name = name[len(prefix):]
            if is_numeric:
                return name
            parts = name.split("_", 1)
            if len(parts) == 2 and not parts[0].isdigit():
                return f"{parts[0]}: {parts[1]}"
            return name

        clean_names = [clean_name(n) for n in feature_names]
        x = np.array(X_transformed).flatten()

        if hasattr(classifier, 'coef_'):
            coef = classifier.coef_[0]
            contributions = coef * x
            pairs = sorted(zip(clean_names, contributions), key=lambda p: abs(p[1]), reverse=True)
            return [{"feature": name, "contribution": round(float(val), 4)}
                    for name, val in pairs[:top_n] if abs(val) > 0.001]

        elif hasattr(classifier, 'tree_'):
            tree = classifier.tree_
            node = 0
            path_features = []
            while tree.feature[node] != -2:
                feat_idx  = tree.feature[node]
                thresh    = tree.threshold[node]
                val       = x[feat_idx] if feat_idx < len(x) else 0
                went_left = val <= thresh
                n_node    = tree.n_node_samples[node]
                child     = tree.children_left[node] if went_left else tree.children_right[node]
                n_child   = tree.n_node_samples[child]
                impurity_drop = tree.impurity[node] - (n_child / n_node) * tree.impurity[child]
                feat_name = clean_names[feat_idx] if feat_idx < len(clean_names) else f"feature_{feat_idx}"
                direction = "≤" if went_left else ">"
                path_features.append({
                    "feature":      f"{feat_name} {direction} {thresh:.2f}",
                    "contribution": round(float(impurity_drop), 4),
                })
                node = child
            path_features.sort(key=lambda p: p["contribution"], reverse=True)
            return path_features[:top_n]

        return []
    except Exception as e:
        log.warning(f"Feature importance extraction failed: {e}")
        return []

# ─── Schemas ──────────────────────────────────────────────────────────────────

class TransactionFeatures(BaseModel):
    client_id:       Optional[str]   = None
    amount:          Optional[float] = None
    merchant:        Optional[str]   = None
    business_type:   Optional[str]   = None
    date:            Optional[str]   = None
    time:            Optional[str]   = None
    province:        Optional[str]   = None
    lat:             Optional[float] = None
    lng:             Optional[float] = None
    nearest_city:    Optional[str]   = None
    card_category:   Optional[str]   = None
    income_category: Optional[str]   = None
    education_level: Optional[str]   = None
    marital_status:  Optional[str]   = None
    birthday:        Optional[str]   = None
    months_on_book:  Optional[int]   = None

class PredictRequest(BaseModel):
    model_type: str
    features:   TransactionFeatures

# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    reload_models("startup")
    threading.Thread(target=watch_models, daemon=True).start()
    log.info("File watcher started")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "lr": {"status": state.lr_status, "has_error": bool(state.lr_error)},
        "dt": {"status": state.dt_status, "has_error": bool(state.dt_error)},
    }

@app.get("/metrics")
def get_metrics():
    """Returns accuracy, precision, recall, f1, and confusion matrix directly from the model scripts."""
    with state.lock:
        return {
            "lr": state.lr_metrics,
            "dt": state.dt_metrics,
        }


@app.get("/dataset-sample")
def dataset_sample(test_size: float = 0.3):
    """
    Returns the exact held-out test rows from the model scripts —
    identical to what the terminal evaluates on.
    test_size param is accepted for UI compatibility but the split
    comes from the model scripts themselves (random_state=42).
    """
    with state.lock:
        X_test = state.X_test
        y_test = state.y_test

    if X_test is None or y_test is None:
        raise HTTPException(status_code=503, detail="Test split not available. Is dataset.csv present and models loaded?")

    rows = X_test.copy()
    rows['is_fraud'] = y_test.values
    return {
        "rows":      rows.to_dict(orient="records"),
        "n_fraud":   int(y_test.sum()),
        "n_legit":   int((y_test == 0).sum()),
        "test_size": round(len(y_test) / (len(y_test) + (5000 - len(y_test))), 2),
        "total":     len(y_test),
    }


@app.get("/test-scores")
def test_scores():
    """Returns pre-computed predict_proba scores for each model's own test set."""
    with state.lock:
        if state.lr_test_scores is None or state.dt_test_scores is None:
            raise HTTPException(status_code=503, detail="Test scores not available yet.")
        lr_ns = (state.lr_metrics or {}).get('no_smote_scores')
        lr_nl = (state.lr_metrics or {}).get('no_smote_labels')
        dt_ns = (state.dt_metrics or {}).get('no_smote_scores')
        dt_nl = (state.dt_metrics or {}).get('no_smote_labels')
        return {
            "lr_scores": state.lr_test_scores,
            "lr_labels": getattr(state, 'lr_test_labels', state.y_test.tolist() if state.y_test is not None else []),
            "dt_scores": state.dt_test_scores,
            "dt_labels": getattr(state, 'dt_test_labels', state.y_test.tolist() if state.y_test is not None else []),
            "lr_no_smote_scores": lr_ns,
            "lr_no_smote_labels": lr_nl,
            "dt_no_smote_scores": dt_ns,
            "dt_no_smote_labels": dt_nl,
        }


@app.post("/predict")
def predict(req: PredictRequest):
    with state.lock:
        trained = state.lr_trained if req.model_type == "logistic_regression" else state.dt_trained
        err     = state.lr_error   if req.model_type == "logistic_regression" else state.dt_error

    if trained is None:
        raise HTTPException(status_code=503, detail=f"Model not loaded. {err or ''}")

    try:
        f    = req.features.model_dump()
        impossible, speed_kmh = check_spatial_velocity(f)
        df   = build_row(f)
        prob = float(trained.predict_proba(df)[0][1])
        if impossible:
            prob = 1.0
        return {
            "score": round(prob, 4),
            "trained": True,
            "error": None,
            "impossible_travel": impossible,
            "speed_kmh": round(speed_kmh, 1) if speed_kmh is not None else None,
        }
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())

@app.post("/explain")
def explain(req: PredictRequest):
    """On-demand feature importance — called only when user opens a drawer."""
    with state.lock:
        trained = state.lr_trained if req.model_type == "logistic_regression" else state.dt_trained
        err     = state.lr_error   if req.model_type == "logistic_regression" else state.dt_error

    if trained is None:
        raise HTTPException(status_code=503, detail=f"Model not loaded. {err or ''}")

    try:
        f            = req.features.model_dump()
        impossible, speed_kmh = check_spatial_velocity(f)
        df           = build_row(f)
        prob         = float(trained.predict_proba(df)[0][1])
        if impossible:
            prob = 1.0
        top_features = get_top_features(trained, df, top_n=5)
        return {
            "score": round(prob, 4),
            "top_features": top_features,
            "impossible_travel": impossible,
            "speed_kmh": round(speed_kmh, 1) if speed_kmh is not None else None,
        }
    except Exception:
        raise HTTPException(status_code=500, detail=traceback.format_exc())

@app.post("/batch-predict")
def batch_predict(req: dict):
    """Score all rows in one predict_proba() call — same as terminal."""
    rows = req.get("rows", [])
    if not rows:
        return {"lr_scores": [], "dt_scores": []}

    with state.lock:
        lr_model = state.lr_trained
        dt_model = state.dt_trained

    if lr_model is None or dt_model is None:
        raise HTTPException(status_code=503, detail="One or both models not loaded.")

    try:
        df = pd.DataFrame([features_to_record(f) for f in rows])
        log.info(f"Batch predict df columns: {df.columns.tolist()}")
        log.info(f"LR model feature names: {getattr(lr_model, 'feature_names_in_', 'none')}")
        lr_scores = lr_model.predict_proba(df)[:, 1].tolist()
        dt_scores = dt_model.predict_proba(df)[:, 1].tolist()
        return {
            "lr_scores": [round(s, 4) for s in lr_scores],
            "dt_scores": [round(s, 4) for s in dt_scores],
        }
    except Exception:
        err = traceback.format_exc()
        log.error(f"Batch predict error:\n{err}")
        raise HTTPException(status_code=500, detail=err)

@app.post("/retrain")
def retrain(test_size: float = 0.3):
    reload_models("manual retrain request", test_size=test_size)
    return {
        "lr":        state.lr_status,
        "dt":        state.dt_status,
        "test_size": state.test_size,
        "n_test":    len(state.y_test) if state.y_test is not None else 0,
        "n_fraud":   int(state.y_test.sum()) if state.y_test is not None else 0,
    }
