import pytest

@pytest.mark.dependency
@pytest.mark.parametrize("record", [
    {"id": "TC-6", "status": "Active", "end_date": None, "valid": True},
    {"id": "TC-7", "status": "Terminated", "end_date": "2024-01-01", "valid": True},
    {"id": "TC-8", "status": "Terminated", "end_date": None, "valid": False},
], ids=lambda r: r["id"])
def test_status_date_dependency(record):
    """Validates structural dependencies: Terminated status requires an end_date."""
    is_terminated = record["status"] == "Terminated"
    has_end_date = bool(record["end_date"])
    
    is_valid = (is_terminated and has_end_date) or (not is_terminated)
    assert is_valid == record["valid"]
