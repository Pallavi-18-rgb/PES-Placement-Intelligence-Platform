import os
import sys
import json
import time
import re
from json_repair import repair_json

# Add project root to python path to import config
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

from groq import Groq
from config import GROQ_API_KEY
from langsmith import traceable

groq_client = Groq(api_key=GROQ_API_KEY, timeout=30.0)

@traceable(name="enrich_company_missing_fields", run_type="llm")
def call_groq_enrichment(prompt):
    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
        temperature=0.2,
        response_format={"type": "json_object"}
    )
    return chat_completion.choices[0].message.content.strip()

output_dir = "outputs"
files = [f for f in os.listdir(output_dir) if f.endswith(".json")]

# The 21 new parameters to enrich
NEW_KEYS = [
    "vision_statement",
    "mission_statement",
    "core_values",
    "sales_motion",
    "customer_acquisition_cost",
    "customer_lifetime_value",
    "cac_ltv_ratio",
    "churn_rate",
    "net_promoter_score",
    "customer_concentration_risk",
    "exit_strategy_history",
    "carbon_footprint",
    "ethical_sourcing",
    "benchmark_vs_peers",
    "industry_associations",
    "case_studies",
    "company_maturity",
    "brand_value",
    "client_quality",
    "sustainability_csr",
    "crisis_behavior"
]

print(f"Loaded {len(files)} files to check for 163-parameter alignment using Groq Llama-3.1...")

success_count = 0
skipped_count = 0
failed_count = 0

for index, file_name in enumerate(sorted(files), 1):
    file_path = os.path.join(output_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Determine if we need to enrich this company
    missing_keys = [k for k in NEW_KEYS if k not in data or data[k] in [None, "", "null", "N/A"]]
    
    if not missing_keys:
        print(f"[{index}/{len(files)}] [SKIP] {file_name} already has all 163 parameters populated!")
        skipped_count += 1
        continue

    company_name = data.get("company", data.get("name", file_name.replace(".json", "")))
    print(f"[{index}/{len(files)}] [ENRICH] {company_name} is missing {len(missing_keys)} fields. Researching via Groq...")

    # 2. Build the targeted prompt to research only the missing keys
    prompt = f"""You are a senior investment and corporate intelligence analyst.
For the company "{company_name}", research and provide the authoritative data for exactly these {len(missing_keys)} parameters:

{json.dumps(missing_keys, indent=2)}

### INSTRUCTIONS:
1. Return ONLY a valid JSON object matching the requested keys.
2. Provide concise, professional, factual, and non-empty answers for each field.
3. Do not include markdown code block syntax (like ```json) or any conversational text.
"""

    # 3. Call Groq (traced via LangSmith)
    try:
        text = call_groq_enrichment(prompt)
        
        # Parse and repair JSON if needed
        repaired = repair_json(text)
        new_data = json.loads(repaired)

        # Merge the new keys into existing data
        for key in missing_keys:
            data[key] = new_data.get(key, "N/A")

        # Save back to file
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        print(f"  [+] Successfully enriched {company_name} with all 163 parameters!")
        success_count += 1
        
        # Guard rails for Groq RPM limits (sleep 3.5s)
        time.sleep(3.5)

    except Exception as e:
        print(f"  [-] Failed to enrich {company_name}: {e}")
        failed_count += 1
        time.sleep(5.0)

print("\n============================================================")
print(f"Enrichment Complete! Successfully Updated: {success_count} | Skipped: {skipped_count} | Failed: {failed_count}")
print("============================================================")
