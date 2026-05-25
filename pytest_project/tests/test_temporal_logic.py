import pytest
from validators.temporal_validator import validate_date_not_in_future
from datetime import datetime, timedelta

future_date = (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d")

@pytest.mark.temporal
@pytest.mark.parametrize("record", [
    {"id": "TC-9", "date": "2023-01-01", "expected": True},
    {"id": "TC-10", "date": future_date, "expected": False},
    {"id": "TC-11", "date": "invalid-date", "expected": False},
], ids=lambda r: r["id"])
def test_date_not_in_future(record):
    """Validates that temporal constraints are respected (no future dates)."""
    assert validate_date_not_in_future(record["date"]) is record["expected"]
