# Credit Fraud Simulator

A school capstone project for Business Analytics at Seneca Polytechnic.

This fraud detection simulator runs real transactions through trained Logistic Regression and Decision Tree models side-by-side, exploring how transaction features influence fraud scores in real time.

---

## Features

- **Transaction Simulator** — Manually enter or auto-generate transactions and score them instantly against both models
- **Model Comparison (RQ1)** — Compare Logistic Regression vs. Decision Tree across precision, recall, F1, and accuracy with adjustable decision thresholds
- **Behavioral Feature Analysis (RQ2)** — Explore how transaction amount, time of day, and spending patterns relate to fraud rates
- **Imbalance & Threshold Analysis (RQ3)** — Visualize how SMOTE oversampling and threshold tuning affect model performance
- **Transaction Table** — Per-transaction breakdown with filters by fraud/legit, model agreement, and outcome; sortable by amount and scores
- **Hot-reload Models** — Modify model scripts and the backend automatically retrains on save

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | Python, FastAPI |
| Models | scikit-learn, imbalanced-learn |
| Dataset | Canadian credit card fraud dataset |

---

## Getting Started

### Backend

```bash
pip install -r requirements.txt
python -m uvicorn fraud_backend_v2:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and connects to the backend at `http://localhost:8000`.

---

## Project Structure

```
├── fraud_backend_v2.py        # FastAPI backend — model loading, prediction, feature engineering
├── requirements.txt
├── models/
│   ├── logistic_regression_analysis.py   # LR training script
│   ├── decision_tree_analysis.py         # DT training script
│   └── dataset.csv                       # Training dataset
└── frontend/
    └── src/
        └── App.jsx            # React frontend (single-component simulator)
```

---

## Models

Both models are trained on a held-out 80/20 stratified split with `random_state=42`.

- **Logistic Regression** — StandardScaler → SMOTE → `LogisticRegression`. Uses behavioral features with threshold sweep to maximize F1.
- **Decision Tree** — SMOTE → `DecisionTreeClassifier(max_depth=5)`. Uses full feature set with threshold sweep.

Features include: transaction amount, time of day, day of week, location (lat/lng), business type, card category, income category, education level, marital status, age, and months on book.
