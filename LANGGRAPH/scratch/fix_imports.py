import os

app_dir = r"c:\Users\PALLAVI N\OneDrive\Documents\LANGGRAPH\app"
agents_dir = os.path.join(app_dir, "agents")

for filename in os.listdir(agents_dir):
    if filename.endswith(".py"):
        filepath = os.path.join(agents_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace imports
        content = content.replace("from config import", "from app.config.config import")
        content = content.replace("from graph.state import", "from app.state import")
        content = content.replace("from utils.prompt_utils import", "from app.utils.prompt_utils import")
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

print("Imports updated in agents.")
