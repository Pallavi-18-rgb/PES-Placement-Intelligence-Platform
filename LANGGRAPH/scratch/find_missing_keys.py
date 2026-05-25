import re

# 1. Parse keys from TypeScript company.ts (only the main Company interface)
ts_path = r"c:\Users\PALLAVI N\OneDrive\Documents\placement-intel-core-main\src\types\company.ts"
ts_keys = []
with open(ts_path, "r", encoding="utf-8") as f:
    in_interface = False
    for line in f:
        if "export interface Company {" in line:
            in_interface = True
            continue
        if in_interface and line.strip() == "}":
            in_interface = False
            break
        if in_interface:
            # Match property: type pattern, e.g. "name: string;"
            match = re.match(r"\s+([a-zA-Z0-9_]+)\??\s*:", line)
            if match:
                ts_keys.append(match.group(1))

if "id" in ts_keys:
    ts_keys.remove("id")

print(f"Total TS Keys in Company (excluding id): {len(ts_keys)}")

# 2. Parse keys from graph/schema.py
schema_path = r"c:\Users\PALLAVI N\OneDrive\Documents\LANGGRAPH\graph\schema.py"
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

print(f"Total Schema Keys in Python: {len(schema_keys)}")

# 3. Find the missing keys
missing_keys = [k for k in ts_keys if k not in schema_keys]
print("\n--- EXACT MISSING KEYS ---")
for index, key in enumerate(missing_keys, 1):
    print(f"{index}. {key}")
