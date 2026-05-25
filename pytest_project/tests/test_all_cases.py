import pytest
import pandas as pd
from validators.validator import validate_row

df_dict = pd.read_excel("data/testcase.xlsx", sheet_name=None)
test_data = []
for sheet_name, df in df_dict.items():
    # Keep track of sheet name for better debugging if needed
    for row in df.to_dict(orient="records"):
        # You can also add sheet name to the row if needed: row["_sheet_name"] = sheet_name
        test_data.append(row)

@pytest.mark.parametrize("row", test_data, ids=[r["Test ID"] for r in test_data])

def test_all_cases(row):
    expected = str(row["Expected Result"]).lower()

    if "fail" in expected or "error" in expected:
        with pytest.raises(Exception):
            validate_row(row)
    else:
        assert validate_row(row) == True