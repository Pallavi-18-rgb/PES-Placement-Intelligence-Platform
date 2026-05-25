def validate_hierarchy(record: dict) -> bool:
    """Ensures that a subsidiary has a valid parent company defined."""
    if record.get("company_type") == "Subsidiary":
        return bool(record.get("parent_company"))
    return True
