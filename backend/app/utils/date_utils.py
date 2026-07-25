from datetime import datetime, timedelta


def add_days(dt: datetime, days: int) -> datetime:
    return dt + timedelta(days=days)


def is_expired(expiry: datetime | None) -> bool:
    if expiry is None:
        return False
    return expiry < datetime.utcnow()


def format_date(dt: datetime, fmt: str = "%d %b %Y") -> str:
    return dt.strftime(fmt)
