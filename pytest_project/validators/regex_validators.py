import re

def validate_company_name(name: str) -> bool:
    """Validates legal company names including allowed special characters."""
    if not name:
        return False
    pattern = re.compile(r"^[\w\s&.,\-()'\u00C0-\u017F]+$")
    return bool(pattern.match(name))
