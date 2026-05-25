import httpx

supabase_url = "https://kpkshvhdsiudkawbayeu.supabase.co"
supabase_key = "sb_publishable_NvgmeRxPEWf_j9oTz9YR0A_HkvZLVRG"

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json"
}

try:
    print("Querying single company from Supabase...")
    response = httpx.get(
        f"{supabase_url}/rest/v1/companies?limit=1",
        headers=headers
    )
    if response.status_code == 200:
        records = response.json()
        if records:
            columns = list(records[0].keys())
            print(f"\nTotal Columns in Supabase table: {len(columns)}")
            print("\n--- COLUMNS IN DATABASE ---")
            for index, col in enumerate(sorted(columns), 1):
                print(f"{index}. {col}")
        else:
            print("No records found in table.")
    else:
        print(f"Error: {response.status_code} - {response.text}")
except Exception as e:
    print("Error querying columns:", e)
