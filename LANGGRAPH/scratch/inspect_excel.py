import pandas as pd
import os

docs_dir = r"c:\Users\PALLAVI N\OneDrive\Documents"
excel_files = ["Consolidation(Final).xlsx", "consolidation.xlsx", "testcase.xlsx"]

for file in excel_files:
    path = os.path.join(docs_dir, file)
    if os.path.exists(path):
        print(f"\n==================================================")
        print(f"Inspecting Excel: {file}")
        print(f"==================================================")
        try:
            # Read first row or sheet headers
            df = pd.read_excel(path, nrows=2)
            print(f"Sheet Name/Shape: {df.shape}")
            cols = list(df.columns)
            print(f"Total Columns found: {len(cols)}")
            print("First 15 Columns:")
            for index, col in enumerate(cols[:15], 1):
                print(f"  {index}. {col}")
        except Exception as e:
            print(f"Error reading {file}: {e}")
