import json
import re

# 1. Load Excel columns
with open("scratch/excel_columns.json", "r", encoding="utf-8") as f:
    excel_parameters = json.load(f)

print(f"Total parameters in Excel: {len(excel_parameters)}")

# 2. Parse keys from graph/schema.py
schema_path = r"graph/schema.py"
schema_keys = []
with open(schema_path, "r", encoding="utf-8") as f:
    in_keys = False
    for line in f:
        if "COMPANY_SCHEMA_KEYS = [" in line:
            in_keys = True
            continue
        if in_keys and "]" in line:
            in_keys = False
            break
        if in_keys:
            m = re.search(r'"([^"]+)"', line)
            if m:
                schema_keys.append(m.group(1))

print(f"Total parameters in Python schema: {len(schema_keys)}")

# 3. Find missing keys in Python schema
missing_in_python = [k for k in excel_parameters if k not in schema_keys]
print(f"\n--- {len(missing_in_python)} KEYS MISSING IN PYTHON PIPELINE ---")
for index, key in enumerate(missing_in_python, 1):
    print(f"{index}. {key}")

# 4. Find keys in Python schema that are not in Excel (if any)
extra_in_python = [k for k in schema_keys if k not in excel_parameters]
print(f"\n--- {len(extra_in_python)} EXTRA KEYS IN PYTHON PIPELINE (NOT IN EXCEL) ---")
for index, key in enumerate(extra_in_python, 1):
    print(f"{index}. {key}")
