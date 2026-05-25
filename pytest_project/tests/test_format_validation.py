import pytest
from validators.regex_validators import validate_company_name

@pytest.mark.format
@pytest.mark.parametrize("record", [
    {"id": "TC-1", "company_name": "Microsoft Corporation", "expected": True},
    {"id": "TC-2", "company_name": "AT&T Inc.", "expected": True},
    {"id": "TC-3", "company_name": "<Script>Malicious", "expected": False}
], ids=lambda r: r["id"])
def test_company_name_format(record):
    """Verifies that the company name strictly follows the allowed regex pattern."""
    if record["expected"]:
        assert validate_company_name(record["company_name"]) is True
    else:
        assert validate_company_name(record["company_name"]) is False
