"""
Decision Tree — Fraud Detection Model Script
Loaded by fraud_backend_v2.py at startup.
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (confusion_matrix, accuracy_score,
                             f1_score, precision_score, recall_score)
from imblearn.over_sampling import SMOTE

# ── 1. Load data ───────────────────────────────────────────────────────────────
df = pd.read_csv('dataset.csv')

# ── 2. Behavioral Feature Engineering ─────────────────────────────────────────
overall_avg          = df['amt'].mean()
df['amt_vs_avg']     = df['amt'] / overall_avg
df['spending_spike'] = (df['amt_vs_avg'] > 2).astype(int)
df['off_hour']       = df['trans_hour'].between(0, 5).astype(int)
df['impossible_travel'] = 0

# ── 3. Split ───────────────────────────────────────────────────────────────────
X = df.drop(columns=['is_fraud', 'client_id'])
y = df['is_fraud']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── 4. SMOTE ───────────────────────────────────────────────────────────────────
smote = SMOTE(random_state=42)
X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)

# ── 5. Train ───────────────────────────────────────────────────────────────────
model = DecisionTreeClassifier(max_depth=5, random_state=42)
model.fit(X_train_sm, y_train_sm)

# ── 6. Threshold sweep ─────────────────────────────────────────────────────────
y_proba  = model.predict_proba(X_test)[:, 1]
sweep    = np.arange(0.05, 0.96, 0.01)
sweep_f1 = [f1_score(y_test, (y_proba >= t).astype(int),
                     pos_label=1, zero_division=0) for t in sweep]
best_t      = sweep[int(np.argmax(sweep_f1))]
y_pred_best = (y_proba >= best_t).astype(int)

# ── 7. Exports — variable names must match what fraud_backend_v2.py reads ──────
X_test_export = X_test
y_test_export = y_test

accuracy  = float(accuracy_score(y_test, y_pred_best))
precision = float(precision_score(y_test, y_pred_best, pos_label=1, zero_division=0))
recall    = float(recall_score(y_test,    y_pred_best, pos_label=1, zero_division=0))
f1        = float(f1_score(y_test,        y_pred_best, pos_label=1, zero_division=0))
cm        = confusion_matrix(y_test, y_pred_best)

best_threshold = float(best_t)

print(f"[DT] best_t={best_t:.2f}  Accuracy={accuracy:.4f}  Precision={precision:.4f}  Recall={recall:.4f}  F1={f1:.4f}")
