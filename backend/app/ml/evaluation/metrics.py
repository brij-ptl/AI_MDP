"""Re-exports common metrics; kept separate from ml/common/metrics.py so admin-facing
evaluation reports can evolve independently of the training-time metrics contract."""
from app.ml.common.metrics import full_report  # noqa: F401
