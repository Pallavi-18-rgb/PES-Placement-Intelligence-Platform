import pytest
from validators.structural_validator import validate_hierarchy

@pytest.mark.dependency
@pytest.mark.parametrize("record", [
    {"id": "TC-12", "company_type": "Headquarters", "parent_company": None, "expected": True},
    {"id": "TC-13", "company_type": "Subsidiary", "parent_company": "Acme Global", "expected": True},
    {"id": "TC-14", "company_type": "Subsidiary", "parent_company": None, "expected": False},
], ids=lambda r: r["id"])
def test_company_hierarchy(record):
    """Validates structural dependencies in the organizational hierarchy."""
    assert validate_hierarchy(record) is record["expected"]
