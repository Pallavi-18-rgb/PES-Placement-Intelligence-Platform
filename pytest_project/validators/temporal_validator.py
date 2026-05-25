from datetime import datetime

def validate_date_not_in_future(date_str: str) -> bool:
    """Ensures a given date is not in the future."""
    if not date_str:
        return True
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        return date_obj <= datetime.now()
    except ValueError:
        return False
