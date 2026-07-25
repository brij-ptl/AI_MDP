class MLException(Exception):
    pass


class ModelNotFoundError(MLException):
    pass


class InvalidFeatureSchemaError(MLException):
    pass


class DatasetUnavailableError(MLException):
    pass
