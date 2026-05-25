import pytest
from validators.business_validators import validate_revenue_not_null

@pytest.mark.business
@pytest.mark.parametrize("record", [
    {"id": "TC-4", "revenue": "500000", "should_raise": False},
    {"id": "TC-5", "revenue": "null", "should_raise": True},
], ids=lambda r: r["id"])
def test_revenue_mandatory_field(record):
    """Ensures business-critical fields enforce NOT NULL constraints."""
    if record["should_raise"]:
        with pytest.raises(ValueError, match="Revenue cannot be null"):
            validate_revenue_not_null(record["revenue"])
    else:
        assert validate_revenue_not_null(record["revenue"]) is True
