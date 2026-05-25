def validate_revenue_not_null(revenue) -> bool:
    """Ensures critical financial fields are not null or strictly zero."""
    if revenue is None or str(revenue).strip() in ["", "0", "null", "None"]:
        raise ValueError("Revenue cannot be null or zero for active entities.")
    return True
