# Nidaan+ — ML Pipeline

> How machine learning models are trained, stored, and used for disease prediction.

---

## Table of Contents

- [Overview](#overview)
- [Data Sources](#data-sources)
- [Training Pipeline](#training-pipeline)
- [Model Storage](#model-storage)
- [Inference Pipeline](#inference-pipeline)
- [Explainability](#explainability)
- [Adding a New Disease Module](#adding-a-new-disease-module)
- [Honest Disclosure](#honest-disclosure)

---

## Overview

Nidaan+ uses a **config-driven, generic ML engine**. Every disease module is defined by a `config.json` file and a corresponding trained model. The prediction engine reads the config, loads the model, and runs inference — the same code path is used for all 16 diseases.

---

## Data Sources

Each disease's `config.json` declares a `data_source` field:

### `public_dataset`

Real, published clinical datasets sourced from public repositories:

| Disease | Dataset | Source |
|---|---|---|
| Heart Disease | UCI Cleveland Heart Disease Dataset | GitHub CSV mirror |
| Diabetes | Pima Indians Diabetes Database | GitHub CSV mirror |
| Breast Cancer | Wisconsin Diagnostic Breast Cancer | scikit-learn bundled (`load_breast_cancer`) |

### `synthetic_demo`

For the remaining 13 diseases, no suitable public dataset was available. A synthetic dataset is generated using:
- Medically-informed feature ranges (min/max from `config.json`)
- Risk-factor weightings (`synthetic_weights` in config)
- A target base prevalence rate (`synthetic_base_rate`)
- Calibrated logistic intercept via bisection so the generated prevalence matches real-world rates

```python
# Simplified from train_all.py
logit = sum(weight * feature_value for each weighted feature)
intercept = calibrate_to_base_rate(logit, base_rate)
prob = sigmoid(logit + intercept) + small_noise
target = (random < prob).astype(int)
```

This produces internally consistent models that give plausible, explainable predictions, but they are **not trained on real patient records**.

---

## Training Pipeline

### Running Training

```bash
# Train all 16 diseases
cd backend
python -m app.ml.training.train_all

# Train a single disease
python -m app.ml.training.train_all --disease heart
```

### Pipeline Steps

For each disease:

```
1. Load config.json
2. Load dataset
   |- public_dataset: download CSV from dataset_url
   |   (falls back to synthetic if download fails)
   `- synthetic_demo: generate_synthetic_dataset()
3. Normalize target column to binary 0/1
4. Validate all expected feature columns exist
5. clean_dataframe() -> drop rows with >50% nulls, impute remainder
6. train_test_split (80/20, stratified)
7. build_column_transformer()
   |- numeric features: StandardScaler
   `- categorical features: OneHotEncoder
8. Build classifier
   |- "random_forest": RandomForestClassifier(n_estimators=200, max_depth=8)
   `- "logistic_regression": LogisticRegression(max_iter=2000)
9. Pipeline(preprocess + classifier).fit(X_train, y_train)
10. Evaluate on test set -> accuracy, F1, ROC-AUC, confusion matrix
11. Save pipeline to trained_models/{slug}/model.joblib
12. Save metadata to trained_models/{slug}/metadata.json
```

### Algorithm Selection

The `config.json` declares `"algorithm": "random_forest"` or `"algorithm": "logistic_regression"` per disease. No algorithm is hardcoded — the training script reads the config.

---

## Model Storage

Trained models are stored in `backend/trained_models/`:

```
trained_models/
 heart/
  model.joblib        <- Full sklearn Pipeline object
  metadata.json       <- Accuracy metrics + training info
 diabetes/
  model.joblib
  metadata.json
 ... (one folder per disease)
```

### metadata.json Structure

```json
{
  "slug": "heart",
  "algorithm": "random_forest",
  "data_source": "public_dataset",
  "trained_at": "2024-01-01T00:00:00Z",
  "n_samples": 303,
  "n_features": 13,
  "model_version": "1.0.0",
  "metrics": {
    "accuracy": 0.84,
    "f1_score": 0.83,
    "roc_auc": 0.91,
    "confusion_matrix": [[45, 8], [7, 40]]
  }
}
```

This metadata is surfaced in the Admin Panel "AI Models" section and included in every prediction's `warnings` (so users know if a synthetic model was used).

---

## Inference Pipeline

When a user submits a prediction:

```
1. Load disease config from registry cache (config.json)
2. Validate input features via Pydantic schema
3. Load Pipeline from model registry cache
   (model.joblib loaded on first request, cached in memory)
4. X = pd.DataFrame([input_features]) in correct column order
5. probability = pipeline.predict_proba(X)[0][1]
6. risk_level determined by probability thresholds:
   - 0.00 - 0.35: "Low"
   - 0.35 - 0.65: "Moderate"
   - 0.65 - 1.00: "High"
7. feature_importances from classifier.feature_importances_
   (or coef_ for logistic regression)
8. Top 5 features sorted by importance -> top_risk_factors
9. Doctor-voice explanation built from template + feature data
10. Recommendations pulled from config.json
11. Warning added if data_source == "synthetic_demo"
12. Prediction saved to database
13. User's prediction_tokens decremented by 1
```

### Model Cache

```python
# app/ml/registry/model_loader.py
_model_cache: dict[str, Pipeline] = {}

def load_model(slug: str) -> Pipeline:
    if slug not in _model_cache:
        path = MODELS_DIR / slug / MODEL_FILE_NAME
        _model_cache[slug] = joblib.load(path)["pipeline"]
    return _model_cache[slug]
```

Models are never reloaded during a server session.

---

## Explainability

### Always-On: Feature Importance

Every prediction computes feature importances synchronously:
- **Random Forest:** `classifier.feature_importances_` (Gini importance)
- **Logistic Regression:** `abs(classifier.coef_[0])` normalized

Results are stored in `predictions.top_risk_factors` and displayed in the prediction result UI.

### Optional: SHAP and LIME

For the Admin Panel "AI Model Monitoring" screen, deeper SHAP and LIME explanations are available if the optional packages are installed (`shap==0.46.0`, `lime==0.2.0.1` — both included in `requirements.txt`).

---

## Adding a New Disease Module

To add disease #17:

### 1. Create config.json

```bash
mkdir backend/app/ml/diseases/new_disease
```

Create `backend/app/ml/diseases/new_disease/config.json`:

```json
{
  "slug": "new_disease",
  "name": "New Disease",
  "category": "Metabolic",
  "icon": "activity",
  "short_description": "Brief description",
  "overview": "Longer overview...",
  "data_source": "public_dataset",
  "dataset_url": "https://raw.githubusercontent.com/.../dataset.csv",
  "target": "target_column_name",
  "positive_value": 1,
  "algorithm": "random_forest",
  "feature_schema": [
    {
      "name": "feature_1",
      "label": "Feature 1 Label",
      "type": "numeric",
      "min": 0,
      "max": 100,
      "default": 50,
      "unit": "mg/dL",
      "ocr_aliases": ["feature 1", "feat1"]
    }
  ],
  "risk_factors": ["Risk factor 1"],
  "common_symptoms": ["Symptom 1"],
  "recommended_specialist": "Specialist type",
  "recommended_tests": ["Test 1"]
}
```

### 2. Train the Model

```bash
cd backend
python -m app.ml.training.train_all --disease new_disease
```

### 3. Seed the Database

```bash
python -m app.database.seed
```

The new disease will appear in the disease catalogue automatically.

---

## Honest Disclosure

| Module | Data Source | Clinically Validated? |
|---|---|---|
| `heart` | Real (UCI Cleveland) | Research dataset; not FDA-approved |
| `diabetes` | Real (Pima Indians) | Research dataset; not FDA-approved |
| `breast_cancer` | Real (Wisconsin) | Research dataset; not FDA-approved |
| All others (13) | Synthetic | **No — demo only** |

**This platform must not be used for actual clinical diagnosis.** All predictions should be reviewed by a qualified healthcare professional. The system is designed as a screening and awareness tool, not a diagnostic instrument.

Every prediction response includes a `warnings` field that explicitly identifies whether a synthetic model was used.
