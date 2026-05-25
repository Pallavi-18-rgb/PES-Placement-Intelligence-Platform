def validate_row(row):
    expected = str(row.get("Expected Result", "")).lower()
    if "fail" in expected or "error" in expected:
        raise ValueError("Validation failed")
    return True
