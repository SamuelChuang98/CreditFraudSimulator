# Credit Fraud Simulator

An interactive fraud detection simulator built to support a capstone research study at Seneca Polytechnic (Business Analytics). It lets users experiment with model type, decision threshold, and SMOTE oversampling and see in real time how those choices trade off between catching fraud and generating false positives.

Built as a proof-of-concept for analysts and decision-makers who need to understand the precision-recall trade-off before locking in a production configuration. The simulator runs on a **synthetic dataset** modelled after Canadian credit card transaction patterns — no real cardholder data is used.

**Live Demo:** https://credit-fraud-simulator.vercel.app/

---

## Purpose

This simulator is designed to answer three research questions about machine learning-based fraud detection:

1. **RQ1** — Which model (Logistic Regression vs. Decision Tree) performs better on this dataset, and does SMOTE help?
2. **RQ2** — Which behavioral features (amount, time of day, spending patterns) are most predictive of fraud?
3. **RQ3** — How do SMOTE oversampling and decision threshold tuning affect model precision, recall, and F1?

---

## Research Questions & Findings

### RQ1 — Model Comparison

| Model | SMOTE | Threshold | Precision | Recall | F1 | Fraud Caught |
|---|---|---|---|---|---|---|
| Logistic Regression | No | 0.50 | 33.3% | 10.0% | 15.4% | 1 / 10 |
| Logistic Regression | No | 0.81 | 100.0% | 10.0% | 18.2% | 1 / 10 |
| Logistic Regression | Yes | 0.50 | 6.7% | 10.0% | 8.0% | 1 / 10 |
| **Logistic Regression** | **Yes** | **0.09 (Optimal)** | **17.5%** | **70.0%** ✓ Best Recall | **28.0%** | **7 / 10** |
| Decision Tree | No | 0.50 | 44.4% | 40.0% | 42.1% | 4 / 10 |
| **Decision Tree** | **No** | **0.20** | **33.3%** | **60.0%** | **42.9%** ✓ Best F1 | **6 / 10** |
| Decision Tree | Yes | 0.50 | 14.3% | 10.0% | 11.8% | 1 / 10 |
| Decision Tree | Yes | 0.05 (Optimal) | 21.1% | 40.0% | 27.6% | 4 / 10 |

**Key Findings:**
- No single model dominates — the best configuration depends on operational priority.
- **DT without SMOTE (t=0.20) achieved the strongest F1 (42.9%)**, catching 6/10 fraud cases with no oversampling required.
- **LR with SMOTE + threshold tuning (t=0.09) caught the most fraud (7/10, recall=70%)**, making it the better choice when minimising missed fraud is the priority.
- SMOTE at the default threshold (t=0.50) hurts both models: LR F1 drops from 15.4% → 8.0%, DT F1 drops from 42.1% → 11.8%.
- **LR requires both SMOTE and aggressive threshold lowering (t=0.09)** to become competitive — neither intervention alone is sufficient.
- SMOTE is not universally beneficial and must be validated per model.

---

### RQ2 — Behavioral Features Most Predictive of Fraud

**Behavioral Feature Means (Fraud vs. Legitimate):**

| Feature | Fraud | Legitimate | Uplift |
|---|---|---|---|
| is_high_amt (% flagged) | 40.4% | 4.6% | 8.7× |
| amt_per_month (avg) | 15.53 | 1.66 | 9.4× |
| is_night (% flagged) | 40.4% | 33.1% | modest |

**Logistic Regression — Top Coefficients (absolute value):**

| Feature | Coefficient |
|---|---|
| amt_log | -5.92 |
| amt (raw) | +4.71 |
| is_high_amt | +1.18 |
| amt_per_month | +1.15 |

**Decision Tree — Feature Importance:**

| Feature | Importance |
|---|---|
| amt (raw) | 64.0% |
| amt_log | 33.1% |
| is_high_amt | — |

**Key Findings:**
- `is_high_amt` (top-5% transaction amounts) is the most discriminating engineered feature — 40.4% of fraud cases are flagged versus just 4.6% of legitimate transactions (8.7× uplift).
- `amt_per_month` shows an even wider gap: fraud cases average 15.53 versus 1.66 for legitimate transactions (9.4×), reflecting that fraud transactions tend to be large relative to typical monthly spend.
- `is_night` shows a directional effect (40.4% vs. 33.1%) but is not individually decisive.
- In LR, `amt_log` carries the largest absolute weight (-5.92), and the engineered features `is_high_amt` and `amt_per_month` rank in the top seven coefficients — confirming behavioral context adds signal beyond raw amount.
- Adding behavioral features pushed LR ROC-AUC from 0.332 to 0.933 — base features alone give LR almost nothing to work with for fraud separation.
- In the DT, raw `amt` (64.0%) and `amt_log` (33.1%) together account for 97.1% of total feature importance.

---

### RQ3 — Class Imbalance & Threshold Effects

**Key Findings:**
- SMOTE produced mixed results depending on the model — it is not a universal fix.
- **For LR**, SMOTE at the default threshold did not improve recall (still 1/10) but increased false positives. The real gain came from combining SMOTE with threshold tuning: dropping the threshold from 0.50 to 0.09 pushed recall from 10% to 70% while precision fell from 33.3% to 17.5%. Without SMOTE, the probability distribution is too skewed for a lower threshold to help — SMOTE is a necessary precondition, not a standalone solution.
- **For DT**, SMOTE actively degraded performance. The baseline DT (no SMOTE, t=0.50) already caught 4/10 fraud cases (F1=0.421), and a slight threshold adjustment to 0.20 improved recall to 6/10 (F1=0.429). Applying SMOTE caused recall to drop to 1/10 (F1=0.118), and even with aggressive threshold tuning to 0.05 the SMOTE-trained DT only recovered to 4/10 — suggesting the tree overfitted to synthetic samples that sit too close to existing fraud points.
- Threshold tuning had a far greater impact on LR than DT. LR produces continuous probability outputs with high granularity; DT produces coarser leaf-node proportions with fewer distinct operating points and less sensitivity to tuning.
- **Bottom line:** if the goal is high-precision detection, DT without SMOTE is the strongest configuration. If the priority is maximum fraud capture, LR with SMOTE + threshold tuning (t=0.09) is superior.

---

## Features

- **Transaction Simulator** — Manually enter or auto-generate Canadian transactions and score them against both models instantly
- **Model Comparison** — Live side-by-side LR vs. DT predictions with confidence bars and verdicts
- **Spatial Velocity Check** — Rule-based override flags physically impossible travel (>900 km/h between transactions)
- **Research Questions Tab** — Visual breakdown of RQ1–RQ3 findings with metrics tables and explanations
- **Analysis Tab** — Deep dive into model internals, feature importances, and threshold curves
- **Transaction Table** — Filterable log of all scored transactions with fraud/legit breakdown

---

## Architecture

### Backend (`fraud_backend_v2.py`)

- **`ModelState`** — thread-safe singleton (`threading.Lock()`) holding both trained models, test sets, cached scores, and status
- **Model loading** — `reload_models()` executes training scripts via `load_and_train()`, capturing stdout and extracting exported variables
- **Feature engineering** — `features_to_record()` converts raw form fields into the 25-column vector both models expect (ordinal encoding, one-hot encoding, behavioral features)
- **Key endpoints:**
  - `POST /predict` — score a transaction against both models
  - `POST /explain` — return top-5 feature importances
  - `GET /test-scores` — cached test set predictions for ROC/PR curves
  - `GET /metrics` — model performance metrics
  - `GET /health` — liveness check (used by UptimeRobot)

### ML Models (`models/`)

| File | Purpose |
|---|---|
| `logistic_regression_analysis.py` | Live LR training script loaded by backend |
| `decision_tree_analysis.py` | Live DT training script loaded by backend |
| `logistic_regression_analysis.ipynb` | Offline notebook with full visualizations |
| `decision_tree_analysis.ipynb` | Offline notebook with full visualizations |

Both live `.py` scripts export: `pipeline`/`dt_model`, `X_test_export`, `y_test_export`, `accuracy`, `precision`, `recall`, `f1`, `cm`.

### Frontend (`frontend/src/App.jsx`)

Single monolithic React component (`ATMFraudSimulator`). All UI, state, and API logic lives here. Three color themes: Blue (LR), Green (DT), Purple (Analysis). Backend URL hardcoded to `http://localhost:8000`.

---

## Dataset

Synthetic Canadian credit card transaction dataset with 5,000 rows. Fraud rate: ~1% (52 fraud cases). No real cardholder data is used — all transactions are synthetically generated to model realistic spending patterns.

**Features used:** transaction amount, timestamp, merchant category, city population, card category, income category, education level, marital status, age, months on book, location (lat/lng).

**Derived behavioral features:** `amt_log`, `is_high_amt`, `is_night`, `is_weekend`, `amt_per_month`, `new_customer`, `amt_income_ratio`, `amt_vs_avg` (per-client spending deviation).

---

## Getting Started

### Backend

```bash
pip install -r requirements.txt
python -m uvicorn fraud_backend_v2:app --reload --port 8000
```

Runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | Python 3.11, FastAPI, Uvicorn |
| ML | scikit-learn, imbalanced-learn (SMOTE) |
| Dataset | Synthetic Canadian credit card fraud (5,000 rows) |
| Hosting | Render (backend), Vercel (frontend) |
| Uptime monitoring | UptimeRobot (pings `/health` every 5 min) |

---

## Project Structure

```
├── fraud_backend_v2.py                    # FastAPI backend
├── requirements.txt
├── models/
│   ├── logistic_regression_analysis.py   # Live LR training script (loaded by backend)
│   ├── decision_tree_analysis.py         # Live DT training script (loaded by backend)
│   ├── logistic_regression_analysis.ipynb # Offline analysis notebook (visualizations)
│   ├── decision_tree_analysis.ipynb      # Offline analysis notebook (visualizations)
│   └── dataset.csv                       # Training dataset
└── frontend/
    ├── src/
    │   └── App.jsx                        # React frontend (single-component simulator)
    ├── package.json
    └── vite.config.js
```

---

## Critical Constraint: Feature Parity

The 25-column feature vector produced by `features_to_record()` in `fraud_backend_v2.py` **must exactly match** what the training scripts produce. If you change feature encoding in either training script, update `features_to_record()` accordingly — and vice versa. Mismatches will silently produce wrong predictions.

---

## Team

| Name | Role |
|---|---|
| **Samuel Chuang** | Simulator development, data Analysis & Interpretation |
| Min Zhang | Industry Review, Literature Review, and Limitations |
| Weiyin Wu | Data Cleaning, Data Collection, and Methodology |
| Yi Zou | Discussion, Conclusion, and Recommendations |

*Capstone project — Business Analytics, Seneca Polytechnic*
