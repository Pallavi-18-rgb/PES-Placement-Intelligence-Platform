import pytest
from validators.completeness_validator import validate_required_fields

@pytest.mark.completeness
@pytest.mark.parametrize("record, required, expected", [
    ({"name": "Acme Corp", "status": "Active"}, ["name", "status"], True),
    ({"name": "Acme Corp", "status": ""}, ["name", "status"], False),
    ({"name": "Acme Corp"}, ["name", "status"], False),
], ids=["complete", "empty_string", "missing_key"])
def test_completeness(record, required, expected):
    """Validates schema completeness and required field presence."""
    assert validate_required_fields(record, required) is expected
