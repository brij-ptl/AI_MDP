from app.core.exceptions import ConflictException, UnauthorizedException, NotFoundException


class EmailAlreadyRegisteredException(ConflictException):
    def __init__(self):
        super().__init__("An account with this email already exists.", error_code="EMAIL_EXISTS")


class InvalidCredentialsException(UnauthorizedException):
    def __init__(self):
        super().__init__("Invalid email or password.", error_code="INVALID_CREDENTIALS")


class InvalidOrExpiredTokenException(UnauthorizedException):
    def __init__(self):
        super().__init__("This link is invalid or has expired.", error_code="INVALID_TOKEN")


class AccountDeactivatedException(UnauthorizedException):
    def __init__(self):
        super().__init__("This account has been deactivated. Contact support.", error_code="ACCOUNT_DEACTIVATED")
