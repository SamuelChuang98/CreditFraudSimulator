# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fraud Simulator 3 is an interactive fraud detection demo system. A Python FastAPI backend loads and hot-reloads scikit-learn models, exposing a REST API; a React + Vite frontend provides an ATM transaction simulator that compares Logistic Regression vs Decision Tree predictions side-by-side.

## Running the Project

**Backend** (runs on http://localhost:8000):
```bash
pip install -r requirements.txt
python -m uvicorn fraud_backend_v2:app --reload --port 8000
```

**Frontend** (runs on http://localhost:5173):
```bash
cd frontend
npm install
npm run dev
```

## Frontend Commands

```bash
cd frontend
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

### Backend (`fraud_backend_v2.py`)

- **`ModelState`** — thread-safe singleton (using `threading.Lock()`) that holds both trained models, test sets, cached `predict_proba` scores, and status.
- **Model loading** — `reload_models()` dynamically executes Python scripts in `models/` via `load_and_train()`, which captures stdout and extracts exported variables (`pipeline`, `dt_model`/`model`, `X_test_export`, `y_test_export`, metrics).
- **File watcher** — background thread (`watch_models()`) checks file MD5 hashes every 2 seconds and automatically retrains when `logistic_regression.py` or `decision_tree.py` changes.
- **Feature engineering** — `features_to_record()` converts raw transaction form fields into the exact 25-column format the models expect (ordinal encoding, one-hot encoding, derived behavioral features: `amt_vs_avg`, `spending_spike`, `off_hour`). **This must stay in sync with the training scripts.**
- **Key endpoints**: `POST /predict`, `POST /explain` (returns top-5 feature importances), `POST /batch-predict`, `GET /test-scores`, `GET /metrics`, `GET /dataset-sample`, `GET /health`, `POST /retrain`.

### ML Models (`models/`)

Both scripts must export: `pipeline` or `dt_model`/`model` (trained sklearn object), `X_test_export`, `y_test_export`, and scalar metrics (`accuracy`, `precision`, `recall`, `f1`, `cm`).

- **`logistic_regression.py`** — StandardScaler → SMOTE → `LogisticRegression(C=10, max_iter=1000)`. Uses per-client average for `amt_vs_avg`. Threshold swept to maximize F1.
- **`decision_tree.py`** — No scaling → SMOTE → `DecisionTreeClassifier(max_depth=5)`. Uses overall dataset average for `amt_vs_avg`. Default 0.5 threshold.

Both use 80/20 stratified split with `random_state=42`.

### Frontend (`frontend/src/App.jsx`)

Single monolithic component `ATMFraudSimulator` (~2,350 lines). All UI, state, and API logic lives here — no separate component files.

- **Themes** — Three color schemes: `BLUE` (Logistic Regression), `GREEN` (Decision Tree), `PURPLE` (Analysis tab). Passed via `THEMES` object; all styling is inline.
- **Internal components** — `Field`, `Inp`, `ScoreBar`, `Verdict`, `DetailDrawer`, `RqAnalysisTab` are defined as functions inside the file above the main export.
- **API calls** — Backend URL is hardcoded to `http://localhost:8000`. Health-check polling runs every 5 seconds via `useEffect`.
- **Transaction generation** — `makeLegitTransaction()`, `makeFraudTransaction()`, `makeTransaction()` generate synthetic Canadian transactions using `MERCHANTS`, `CANADIAN_CITIES`, `CLIENT_STATS`, and `PROVINCES` constants.
- **Tabs** — `simulator`, `research_questions`, `analysis`.

## Critical Constraint: Feature Engineering Parity

The 25-column feature vector produced by `features_to_record()` in the backend **must exactly match** what the training scripts produce. If you change feature encoding in `logistic_regression.py` or `decision_tree.py`, update `features_to_record()` accordingly, and vice versa.
