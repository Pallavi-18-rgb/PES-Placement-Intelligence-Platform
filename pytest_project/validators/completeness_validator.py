def validate_required_fields(record: dict, required_fields: list) -> bool:
    """Ensures all required fields are present and not empty."""
    for field in required_fields:
        val = record.get(field)
        if val is None or str(val).strip() == "":
            return False
    return True
