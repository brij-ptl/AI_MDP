"""Grid-search hyperparameter tuning helper, used ad-hoc when improving a disease model."""
from sklearn.model_selection import GridSearchCV

RF_GRID = {
    "classifier__n_estimators": [100, 200, 300],
    "classifier__max_depth": [4, 6, 8, 12],
    "classifier__min_samples_leaf": [1, 2, 4],
}

LOGREG_GRID = {
    "classifier__C": [0.01, 0.1, 1.0, 10.0],
    "classifier__penalty": ["l2"],
}


def tune(pipeline, X, y, algorithm: str, cv: int = 5, scoring: str = "roc_auc"):
    grid = RF_GRID if algorithm == "random_forest" else LOGREG_GRID
    search = GridSearchCV(pipeline, grid, cv=cv, scoring=scoring, n_jobs=-1)
    search.fit(X, y)
    return search.best_estimator_, search.best_params_, search.best_score_
