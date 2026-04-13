"""
=============================================================================
LOGISTIC REGRESSION — FRAUD DETECTION ANALYSIS
Canadian Fraud Dataset
=============================================================================
Research Questions:
  RQ1: LR vs DT — which gives the better balance between detection & FP reduction?
  RQ2: Do behavioral features (transaction frequency, spending patterns) improve performance?
  RQ3: How do class imbalance handling (SMOTE) and threshold tuning affect effectiveness?
=============================================================================
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    f1_score, accuracy_score, precision_score, recall_score
)
from imblearn.over_sampling import SMOTE
import warnings
warnings.filterwarnings('ignore')

# ── Load Data ────────────────────────────────────────────────────────────────
df = pd.read_csv('canadian_fraud_cleaned.csv')
print("=" * 70)
print("LOGISTIC REGRESSION — FRAUD DETECTION ANALYSIS")
print("=" * 70)
print(f"\nDataset shape: {df.shape}")
print(f"Fraud distribution:\n{df['is_fraud'].value_counts()}")
print(f"Fraud rate: {df['is_fraud'].mean():.4%}")


# =============================================================================
# RQ2: BEHAVIORAL FEATURE ENGINEERING
# Investigates whether behavioral features (transaction frequency, spending
# patterns) improve fraud detection performance.
# =============================================================================
print("\n" + "=" * 70)
print("RQ2 — BEHAVIORAL FEATURE ENGINEERING")
print("=" * 70)

# --- Transaction amount-based behavioral features ---
df['amt_log'] = np.log1p(df['amt'])                          # log-scaled amount (reduces skew)
df['is_high_amt'] = (df['amt'] > df['amt'].quantile(0.95)).astype(int)  # top-5% flag

# --- Time-based behavioral features ---
df['is_night'] = df['trans_hour'].apply(lambda h: 1 if h <= 5 or h >= 22 else 0)  # night transactions (10pm–5am)
df['is_weekend'] = df['trans_day_of_week'].apply(lambda d: 1 if d >= 5 else 0)      # weekend flag

# --- Customer tenure interaction ---
df['amt_per_month'] = df['amt'] / (df['Months_on_book'] + 1)  # spending intensity relative to tenure
df['new_customer'] = (df['Months_on_book'] < 12).astype(int)   # new customer flag (< 1 year)

# --- Spending pattern relative to income ---
# Income_Category is ordinal (0=lowest, higher=more income)
df['amt_income_ratio'] = df['amt'] / (df['Income_Category'] + 2)  # spending relative to income tier (+2 to handle -1 category)

print("\nNew behavioral features created:")
behavioral_features = ['amt_log', 'is_high_amt', 'is_night', 'is_weekend',
                       'amt_per_month', 'new_customer', 'amt_income_ratio']
for feat in behavioral_features:
    print(f"  • {feat}")

# Quick look at behavioral feature distributions by fraud status
print("\nBehavioral feature means — Fraud vs Legit:")
print(df.groupby('is_fraud')[behavioral_features].mean().round(4).to_string())


# =============================================================================
# PREPARE FEATURE SETS (for RQ2 comparison)
# =============================================================================

# Base features (original columns only, no behavioral engineering)
base_feature_cols = [c for c in df.columns if c not in
                     ['is_fraud'] + behavioral_features]

# Full features (base + behavioral)
full_feature_cols = [c for c in df.columns if c != 'is_fraud']

X_base = df[base_feature_cols]
X_full = df[full_feature_cols]
y = df['is_fraud']

# Train/test split (same random state for fair comparison)
X_base_train, X_base_test, y_train, y_test = train_test_split(
    X_base, y, test_size=0.2, random_state=42, stratify=y
)
X_full_train, X_full_test, _, _ = train_test_split(
    X_full, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features (important for Logistic Regression)
scaler_base = StandardScaler()
X_base_train_sc = scaler_base.fit_transform(X_base_train)
X_base_test_sc = scaler_base.transform(X_base_test)

scaler_full = StandardScaler()
X_full_train_sc = scaler_full.fit_transform(X_full_train)
X_full_test_sc = scaler_full.transform(X_full_test)

print(f"\nTrain set: {X_base_train.shape[0]} samples | Test set: {X_base_test.shape[0]} samples")
print(f"Train fraud rate: {y_train.mean():.4%} | Test fraud rate: {y_test.mean():.4%}")


# =============================================================================
# RQ3 (Part A): BEFORE SMOTE — BASELINE LOGISTIC REGRESSION
# Analyzes how class imbalance affects model effectiveness before any
# resampling is applied.
# =============================================================================
print("\n" + "=" * 70)
print("RQ3 (Part A) — BEFORE SMOTE: BASELINE LR ON IMBALANCED DATA")
print("=" * 70)

# --- Baseline LR (no SMOTE, full features) ---
lr_baseline = LogisticRegression(max_iter=1000, random_state=42)
lr_baseline.fit(X_full_train_sc, y_train)

y_pred_baseline = lr_baseline.predict(X_full_test_sc)
y_prob_baseline = lr_baseline.predict_proba(X_full_test_sc)[:, 1]

print("\n--- Baseline LR (No SMOTE, default threshold=0.5) ---")
print(f"Accuracy:  {accuracy_score(y_test, y_pred_baseline):.4f}")
print(f"Precision: {precision_score(y_test, y_pred_baseline, zero_division=0):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred_baseline, zero_division=0):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred_baseline, zero_division=0):.4f}")
print(f"ROC-AUC:   {roc_auc_score(y_test, y_prob_baseline):.4f}")

print("\nClassification Report (Before SMOTE):")
print(classification_report(y_test, y_pred_baseline, target_names=['Legit', 'Fraud'], zero_division=0))

print("Confusion Matrix (Before SMOTE):")
cm_baseline = confusion_matrix(y_test, y_pred_baseline)
print(cm_baseline)
tn, fp, fn, tp = cm_baseline.ravel()
print(f"  TN={tn}  FP={fp}  FN={fn}  TP={tp}")
print(f"  False Positive Rate: {fp/(fp+tn):.4f}")
print(f"  Missed Frauds: {fn} out of {fn+tp}")


# =============================================================================
# RQ3 (Part B): AFTER SMOTE — LOGISTIC REGRESSION ON RESAMPLED DATA
# Demonstrates how SMOTE resampling changes model behavior on the
# minority (fraud) class.
# =============================================================================
print("\n" + "=" * 70)
print("RQ3 (Part B) — AFTER SMOTE: LR ON RESAMPLED DATA")
print("=" * 70)

smote = SMOTE(random_state=42)

# Apply SMOTE to full feature set
X_full_train_sm, y_train_sm = smote.fit_resample(X_full_train_sc, y_train)
print(f"\nBefore SMOTE — Train: {y_train.value_counts().to_dict()}")
print(f"After SMOTE  — Train: {pd.Series(y_train_sm).value_counts().to_dict()}")

lr_smote = LogisticRegression(max_iter=1000, random_state=42)
lr_smote.fit(X_full_train_sm, y_train_sm)

y_pred_smote = lr_smote.predict(X_full_test_sc)
y_prob_smote = lr_smote.predict_proba(X_full_test_sc)[:, 1]

print("\n--- LR with SMOTE (default threshold=0.5) ---")
print(f"Accuracy:  {accuracy_score(y_test, y_pred_smote):.4f}")
print(f"Precision: {precision_score(y_test, y_pred_smote, zero_division=0):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred_smote, zero_division=0):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred_smote, zero_division=0):.4f}")
print(f"ROC-AUC:   {roc_auc_score(y_test, y_prob_smote):.4f}")

print("\nClassification Report (After SMOTE):")
print(classification_report(y_test, y_pred_smote, target_names=['Legit', 'Fraud'], zero_division=0))

print("Confusion Matrix (After SMOTE):")
cm_smote = confusion_matrix(y_test, y_pred_smote)
print(cm_smote)
tn, fp, fn, tp = cm_smote.ravel()
print(f"  TN={tn}  FP={fp}  FN={fn}  TP={tp}")
print(f"  False Positive Rate: {fp/(fp+tn):.4f}")
print(f"  Missed Frauds: {fn} out of {fn+tp}")

# --- Before vs After SMOTE comparison ---
print("\n--- SMOTE Impact Summary (LR) ---")
print(f"{'Metric':<20} {'Before SMOTE':>15} {'After SMOTE':>15} {'Change':>15}")
print("-" * 65)
metrics_before = {
    'Accuracy': accuracy_score(y_test, y_pred_baseline),
    'Precision': precision_score(y_test, y_pred_baseline, zero_division=0),
    'Recall': recall_score(y_test, y_pred_baseline, zero_division=0),
    'F1 Score': f1_score(y_test, y_pred_baseline, zero_division=0),
    'ROC-AUC': roc_auc_score(y_test, y_prob_baseline),
}
metrics_after = {
    'Accuracy': accuracy_score(y_test, y_pred_smote),
    'Precision': precision_score(y_test, y_pred_smote, zero_division=0),
    'Recall': recall_score(y_test, y_pred_smote, zero_division=0),
    'F1 Score': f1_score(y_test, y_pred_smote, zero_division=0),
    'ROC-AUC': roc_auc_score(y_test, y_prob_smote),
}
for metric in metrics_before:
    before = metrics_before[metric]
    after = metrics_after[metric]
    change = after - before
    print(f"{metric:<20} {before:>15.4f} {after:>15.4f} {change:>+15.4f}")


# =============================================================================
# RQ2: BEHAVIORAL FEATURES IMPACT — BASE vs FULL FEATURE SET
# Compares LR performance with and without behavioral features (both
# using SMOTE) to isolate the effect of feature engineering.
# =============================================================================
print("\n" + "=" * 70)
print("RQ2 — BEHAVIORAL FEATURES IMPACT: BASE vs FULL FEATURE SET")
print("=" * 70)

# Apply SMOTE to base feature set
X_base_train_sm, y_base_train_sm = smote.fit_resample(X_base_train_sc, y_train)

lr_base_smote = LogisticRegression(max_iter=1000, random_state=42)
lr_base_smote.fit(X_base_train_sm, y_base_train_sm)

y_pred_base = lr_base_smote.predict(X_base_test_sc)
y_prob_base = lr_base_smote.predict_proba(X_base_test_sc)[:, 1]

print("\n--- LR + SMOTE: Base Features Only ---")
print(f"Accuracy:  {accuracy_score(y_test, y_pred_base):.4f}")
print(f"Precision: {precision_score(y_test, y_pred_base, zero_division=0):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred_base, zero_division=0):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred_base, zero_division=0):.4f}")
print(f"ROC-AUC:   {roc_auc_score(y_test, y_prob_base):.4f}")

print("\n--- LR + SMOTE: Full Features (with behavioral) ---")
print(f"Accuracy:  {accuracy_score(y_test, y_pred_smote):.4f}")
print(f"Precision: {precision_score(y_test, y_pred_smote, zero_division=0):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred_smote, zero_division=0):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred_smote, zero_division=0):.4f}")
print(f"ROC-AUC:   {roc_auc_score(y_test, y_prob_smote):.4f}")

print("\n--- Feature Engineering Impact (LR + SMOTE) ---")
print(f"{'Metric':<20} {'Base Features':>15} {'+ Behavioral':>15} {'Change':>15}")
print("-" * 65)
metrics_base_feat = {
    'Accuracy': accuracy_score(y_test, y_pred_base),
    'Precision': precision_score(y_test, y_pred_base, zero_division=0),
    'Recall': recall_score(y_test, y_pred_base, zero_division=0),
    'F1 Score': f1_score(y_test, y_pred_base, zero_division=0),
    'ROC-AUC': roc_auc_score(y_test, y_prob_base),
}
for metric in metrics_base_feat:
    base_val = metrics_base_feat[metric]
    full_val = metrics_after[metric]
    change = full_val - base_val
    print(f"{metric:<20} {base_val:>15.4f} {full_val:>15.4f} {change:>+15.4f}")

# --- Feature importance (coefficients) ---
print("\n--- Top 15 LR Feature Coefficients (SMOTE, Full Features) ---")
coef_df = pd.DataFrame({
    'Feature': full_feature_cols,
    'Coefficient': lr_smote.coef_[0]
}).sort_values('Coefficient', key=abs, ascending=False)
print(coef_df.head(15).to_string(index=False))


# =============================================================================
# RQ3 (Part C): THRESHOLD TUNING — OPTIMIZING CLASSIFICATION CUTOFF
# Analyzes how adjusting the classification threshold (away from
# default 0.5) influences precision, recall, and F1.
# =============================================================================
print("\n" + "=" * 70)
print("RQ3 (Part C) — THRESHOLD TUNING: LR + SMOTE")
print("=" * 70)

# Test a range of thresholds
thresholds = np.arange(0.05, 0.96, 0.01)
threshold_results = []

for thresh in thresholds:
    y_pred_t = (y_prob_smote >= thresh).astype(int)
    threshold_results.append({
        'Threshold': thresh,
        'Precision': precision_score(y_test, y_pred_t, zero_division=0),
        'Recall': recall_score(y_test, y_pred_t, zero_division=0),
        'F1': f1_score(y_test, y_pred_t, zero_division=0),
        'FPR': (confusion_matrix(y_test, y_pred_t).ravel()[1] /
                (confusion_matrix(y_test, y_pred_t).ravel()[0] +
                 confusion_matrix(y_test, y_pred_t).ravel()[1]))
    })

thresh_df = pd.DataFrame(threshold_results)
print("\nThreshold Analysis:")
print(thresh_df.to_string(index=False, float_format='%.4f'))

# Find optimal threshold by F1
best_row = thresh_df.loc[thresh_df['F1'].idxmax()]
print(f"\nOptimal Threshold (by F1): {best_row['Threshold']:.2f}")
print(f"  Precision: {best_row['Precision']:.4f}")
print(f"  Recall:    {best_row['Recall']:.4f}")
print(f"  F1 Score:  {best_row['F1']:.4f}")
print(f"  FPR:       {best_row['FPR']:.4f}")

# Apply optimal threshold
optimal_thresh = best_row['Threshold']
y_pred_optimal = (y_prob_smote >= optimal_thresh).astype(int)

print(f"\n--- LR + SMOTE at Optimal Threshold ({optimal_thresh:.2f}) ---")
print("\nClassification Report:")
print(classification_report(y_test, y_pred_optimal, target_names=['Legit', 'Fraud'], zero_division=0))

print("Confusion Matrix:")
cm_optimal = confusion_matrix(y_test, y_pred_optimal)
print(cm_optimal)
tn, fp, fn, tp = cm_optimal.ravel()
print(f"  TN={tn}  FP={fp}  FN={fn}  TP={tp}")


# =============================================================================
# RQ3 (Part D): THRESHOLD TUNING — NO SMOTE BASELINE
# Sweeps thresholds on the no-SMOTE model to find its own optimal cutoff,
# enabling a fair 4-way cross-comparison with the SMOTE model.
# =============================================================================
print("\n" + "=" * 70)
print("RQ3 (Part D) — THRESHOLD TUNING: LR WITHOUT SMOTE")
print("=" * 70)

threshold_results_baseline = []

for thresh in thresholds:
    y_pred_t = (y_prob_baseline >= thresh).astype(int)
    cm_t = confusion_matrix(y_test, y_pred_t)
    tn_t, fp_t, fn_t, tp_t = cm_t.ravel()
    threshold_results_baseline.append({
        'Threshold': thresh,
        'Precision': precision_score(y_test, y_pred_t, zero_division=0),
        'Recall': recall_score(y_test, y_pred_t, zero_division=0),
        'F1': f1_score(y_test, y_pred_t, zero_division=0),
        'FPR': fp_t / (fp_t + tn_t)
    })

thresh_df_baseline = pd.DataFrame(threshold_results_baseline)
print("\nThreshold Analysis (No SMOTE):")
print(thresh_df_baseline.to_string(index=False, float_format='%.4f'))

# Find optimal threshold for no-SMOTE by F1
best_row_baseline = thresh_df_baseline.loc[thresh_df_baseline['F1'].idxmax()]
optimal_thresh_baseline = best_row_baseline['Threshold']
y_pred_optimal_baseline = (y_prob_baseline >= optimal_thresh_baseline).astype(int)

print(f"\nOptimal Threshold — No SMOTE (by F1): {optimal_thresh_baseline:.2f}")
print(f"  Precision: {best_row_baseline['Precision']:.4f}")
print(f"  Recall:    {best_row_baseline['Recall']:.4f}")
print(f"  F1 Score:  {best_row_baseline['F1']:.4f}")
print(f"  FPR:       {best_row_baseline['FPR']:.4f}")

print(f"\n--- LR (No SMOTE) at Optimal Threshold ({optimal_thresh_baseline:.2f}) ---")
print("\nClassification Report:")
print(classification_report(y_test, y_pred_optimal_baseline, target_names=['Legit', 'Fraud'], zero_division=0))

print("Confusion Matrix:")
cm_optimal_baseline = confusion_matrix(y_test, y_pred_optimal_baseline)
print(cm_optimal_baseline)
tn, fp, fn, tp = cm_optimal_baseline.ravel()
print(f"  TN={tn}  FP={fp}  FN={fn}  TP={tp}")


# =============================================================================
# RQ1: MODEL PERFORMANCE SUMMARY FOR CROSS-MODEL COMPARISON
# Full 4-way comparison: SMOTE/no-SMOTE × default-t/optimal-t.
# Captures final LR metrics for comparison against the Decision Tree model.
# =============================================================================
print("\n" + "=" * 70)
print("RQ1 — LOGISTIC REGRESSION FINAL SUMMARY (for LR vs DT comparison)")
print("=" * 70)

print(f"\n{'Configuration':<45} {'Prec':>8} {'Recall':>8} {'F1':>8} {'AUC':>8} {'FPR':>8}")
print("-" * 85)

configs = {
    'No SMOTE (t=0.50)': (y_pred_baseline, y_prob_baseline),
    f'No SMOTE + Optimal (t={optimal_thresh_baseline:.2f})': (y_pred_optimal_baseline, y_prob_baseline),
    'SMOTE (t=0.50)': (y_pred_smote, y_prob_smote),
    f'SMOTE + Optimal (t={optimal_thresh:.2f})': (y_pred_optimal, y_prob_smote),
}

best_f1 = -1
best_config_name = ''
for name, (y_p, y_pr) in configs.items():
    cm = confusion_matrix(y_test, y_p)
    tn, fp, fn, tp = cm.ravel()
    f1_val = f1_score(y_test, y_p, zero_division=0)
    marker = ' <-- BEST F1' if f1_val > best_f1 else ''
    best_f1 = max(best_f1, f1_val)
    best_config_name = name if marker else best_config_name
    print(f"{name:<45} "
          f"{precision_score(y_test, y_p, zero_division=0):>8.4f} "
          f"{recall_score(y_test, y_p, zero_division=0):>8.4f} "
          f"{f1_val:>8.4f} "
          f"{roc_auc_score(y_test, y_pr):>8.4f} "
          f"{fp/(fp+tn):>8.4f}"
          f"{marker}")

print(f"\n>>> Best configuration by F1: {best_config_name}")


# =============================================================================

# =============================================================================
# EXPORTS — consumed by fraud_backend_v2.py
# =============================================================================
from sklearn.pipeline import Pipeline as _Pipeline

# Wrap scaler + model so the backend can call predict_proba on raw (unscaled) data
pipeline = _Pipeline([('preprocessor', scaler_full), ('classifier', lr_smote)])

# Test set (unscaled — the pipeline applies scaling internally)
X_test_export = X_full_test
y_test_export = y_test

# Metrics at optimal threshold (matching the numbers printed above)
accuracy       = accuracy_score(y_test, y_pred_optimal)
precision      = precision_score(y_test, y_pred_optimal, zero_division=0)
recall         = recall_score(y_test, y_pred_optimal, zero_division=0)
f1             = f1_score(y_test, y_pred_optimal, zero_division=0)
cm             = confusion_matrix(y_test, y_pred_optimal)
best_threshold = float(optimal_thresh)

# No-SMOTE baseline scores (for frontend threshold slider)
no_smote_scores = y_prob_baseline.tolist()
no_smote_labels = y_test.tolist()
