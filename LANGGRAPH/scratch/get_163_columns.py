import pandas as pd
import os
import json

docs_dir = r"c:\Users\PALLAVI N\OneDrive\Documents"
excel_path = os.path.join(docs_dir, "consolidation.xlsx")

try:
    df = pd.read_excel(excel_path, nrows=1)
    cols = list(df.columns)
    print(f"Total columns in consolidation.xlsx: {len(cols)}")
    
    # Extract columns excluding company_id
    excel_parameters = [c for c in cols if c != "company_id"]
    print(f"Total research parameters: {len(excel_parameters)}")
    
    # Save the parameters list as a Python file to inspect
    with open("scratch/excel_columns.json", "w", encoding="utf-8") as f:
        json.dump(excel_parameters, f, indent=2)
        
    print("\n--- AUTHORITATIVE 163 PARAMETERS ---")
    for index, col in enumerate(excel_parameters, 1):
        print(f"{index}. {col}")
        
except Exception as e:
    print(f"Error reading consolidation.xlsx: {e}")
