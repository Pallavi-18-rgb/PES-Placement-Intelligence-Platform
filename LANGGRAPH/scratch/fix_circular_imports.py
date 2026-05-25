import os
import shutil

base_dir = r"c:\Users\PALLAVI N\OneDrive\Documents\LANGGRAPH"
app_dir = os.path.join(base_dir, "app")
agents_dir = os.path.join(app_dir, "agents")

# 1. Move schema.py
old_schema = os.path.join(base_dir, "graph", "schema.py")
new_schema = os.path.join(app_dir, "models", "schema.py")
if os.path.exists(old_schema):
    shutil.copy(old_schema, new_schema)

# 2. Fix imports in agents
for filename in os.listdir(agents_dir):
    if filename.endswith(".py"):
        filepath = os.path.join(agents_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace imports
        content = content.replace("from graph.schema import", "from app.models.schema import")
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

print("Schema moved and imports fixed.")
