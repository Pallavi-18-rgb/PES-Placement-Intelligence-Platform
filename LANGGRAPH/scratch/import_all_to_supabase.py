import os
import json
import httpx
import re

# Parse COMPANY_SCHEMA_KEYS directly from app/models/schema.py using regex to prevent python path errors
schema_path = r"app/models/schema.py"
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

print(f"Parsed {len(schema_keys)} schema keys from schema.py.")

supabase_url = "https://kpkshvhdsiudkawbayeu.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwa3Nodmhkc2l1ZGthd2JheWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NDg4NTAsImV4cCI6MjA5NDAyNDg1MH0.hQVJoHVFyARlXu-Bx9Yy7k5EBnDcjZmz7g_mfnNTMxg"

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

output_dir = "outputs"
files = [f for f in os.listdir(output_dir) if f.endswith(".json")]

print(f"Detected {len(files)} JSON records in {output_dir}/")

# 1. Safely clear old rows in Supabase to guarantee no ID conflicts or duplication
try:
    print("[SUPABASE] Resetting table to guarantee pristine state...")
    # Delete all rows where company_id is greater than 0
    delete_url = f"{supabase_url}/rest/v1/companies?company_id=gt.0"
    del_res = httpx.delete(delete_url, headers=headers)
    print(f"[SUPABASE] Reset response: Status {del_res.status_code}")
except Exception as e:
    print(f"[SUPABASE WARNING] Table reset failed: {e}")

# 2. Upload all files sequentially with all parameters fully aligned
db_columns = ['company_id'] + list(schema_keys) + ['vision_statement', 'mission_statement', 'carbon_footprint']
success_count = 0
failed_count = 0

print("\n--- STARTING PARAMETER INSERTION ---")
for index, file_name in enumerate(sorted(files), 1001):
    file_path = os.path.join(output_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Align payload to all target database columns
    payload = {
        "company_id": index
    }
    
    for col in db_columns:
        if col == "company_id":
            continue
            
        val = data.get(col)
        # Handle backward compatibility keys
        if val is None or val == "":
            if col == "name":
                val = data.get("company")
            elif col == "category":
                val = data.get("industry")
            elif col == "employee_size":
                val = data.get("employees")
            elif col == "website_url":
                val = data.get("website")
            elif col == "overview_text":
                val = data.get("description")

        # Clean/Format types
        if val is None or val == "":
            if col == "incorporation_year":
                payload[col] = None
            else:
                payload[col] = ""
        else:
            if col == "incorporation_year":
                try:
                    payload[col] = str(int(float(val)))
                except:
                    payload[col] = str(val)
            else:
                payload[col] = str(val)

    # Send POST to Supabase REST API
    try:
        post_url = f"{supabase_url}/rest/v1/companies"
        res = httpx.post(post_url, headers=headers, json=payload)
        if res.status_code in [200, 201, 204]:
            print(f"[{success_count+1}/{len(files)}] [+] Successfully uploaded: {payload['name']} (ID: {index})")
            success_count += 1
        else:
            if "column" in res.text.lower():
                print(f"[-] Failed to upload {payload['name']}: Column mismatch. Did you run the SQL migration on Supabase dashboard? Error: {res.text}")
            else:
                print(f"[-] Failed to upload {payload['name']}: Status {res.status_code} - {res.text}")
            failed_count += 1
    except Exception as e:
        print(f"[-] Error uploading {payload['name']}: {e}")
        failed_count += 1

print("\n============================================================")
print(f"Sync Complete! Success: {success_count} | Failed: {failed_count}")
print("============================================================")
