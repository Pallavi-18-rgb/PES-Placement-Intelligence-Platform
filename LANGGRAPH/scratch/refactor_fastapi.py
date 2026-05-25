import os
import shutil

base_dir = r"c:\Users\PALLAVI N\OneDrive\Documents\LANGGRAPH"
app_dir = os.path.join(base_dir, "app")

# 1. Create directories
dirs = [
    "routes", "models", "agents", "prompts", "utils", "config", "storage"
]
for d in dirs:
    os.makedirs(os.path.join(app_dir, d), exist_ok=True)

# 2. Move existing agents, prompts, utils
for d in ["agents", "prompts", "utils"]:
    src = os.path.join(base_dir, d)
    dst = os.path.join(app_dir, d)
    if os.path.exists(src):
        for item in os.listdir(src):
            s = os.path.join(src, item)
            d_item = os.path.join(dst, item)
            if not os.path.exists(d_item):
                shutil.move(s, d_item)

if os.path.exists(os.path.join(base_dir, "config.py")):
    shutil.move(os.path.join(base_dir, "config.py"), os.path.join(app_dir, "config", "config.py"))

# 3. Create app/state.py (preserving original schema but following the requested TypedDict structure)
state_content = """from typing import TypedDict, Optional

class GraphState(TypedDict):
    company_name: str
    chatgpt_output: Optional[str]
    grok_output: Optional[str]
    perplexity_output: Optional[str]
    consolidated_output: Optional[str]
    validation_status: bool
    retry_count: int
"""
with open(os.path.join(app_dir, "state.py"), "w", encoding="utf-8") as f:
    f.write(state_content)

# 4. Create app/graph.py
graph_content = """from langgraph.graph import StateGraph, END, START
from app.state import GraphState
from app.agents.research_agent import research_agent
from app.agents.consolidation_agent import consolidation_agent
from app.agents.save_validation_agent import save_validation_agent

workflow = StateGraph(GraphState)

workflow.add_node("research_agent", research_agent)
workflow.add_node("consolidation_agent", consolidation_agent)
workflow.add_node("save_validation_agent", save_validation_agent)

workflow.set_entry_point("research_agent")

workflow.add_edge("research_agent", "consolidation_agent")
workflow.add_edge("consolidation_agent", "save_validation_agent")

def check_validation_routing(state):
    if state.get("validation_status", False):
        return "success"
    
    retries = state.get("retry_count", 0)
    if retries >= 3:
        return "success"
        
    return "retry"

workflow.add_conditional_edges(
    "save_validation_agent",
    check_validation_routing,
    {
        "success": END,
        "retry": "research_agent"
    }
)

graph = workflow.compile()
"""
with open(os.path.join(app_dir, "graph.py"), "w", encoding="utf-8") as f:
    f.write(graph_content)

# 5. Create app/service.py
service_content = """import uuid
import time
from app.graph import graph

active_runs = {}

def run_company_research(company_name: str):
    run_id = str(uuid.uuid4())
    active_runs[run_id] = {
        "status": "running",
        "progress": 0,
        "company_name": company_name
    }
    
    start = time.time()
    
    try:
        initial_state = {
            "company_name": company_name,
            "chatgpt_output": "",
            "grok_output": "",
            "perplexity_output": "",
            "consolidated_output": "",
            "validation_status": False,
            "retry_count": 0
        }
        
        # In a real async scenario, this would be an background task
        # We will run it synchronously here to return the result immediately for now
        result = graph.invoke(initial_state)
        
        active_runs[run_id] = {
            "status": "completed",
            "progress": 100,
            "result": "Golden Record Generated!",
            "execution_time": round(time.time() - start, 2)
        }
        
        return active_runs[run_id]
        
    except Exception as e:
        active_runs[run_id] = {
            "status": "failed",
            "error": str(e)
        }
        return active_runs[run_id]
"""
with open(os.path.join(app_dir, "service.py"), "w", encoding="utf-8") as f:
    f.write(service_content)

# 6. Create app/models/request_models.py
req_models_content = """from pydantic import BaseModel

class CompanyRequest(BaseModel):
    company_name: str
"""
with open(os.path.join(app_dir, "models", "request_models.py"), "w", encoding="utf-8") as f:
    f.write(req_models_content)

# 7. Create app/routes/agent.py
agent_router_content = """from fastapi import APIRouter
from app.models.request_models import CompanyRequest
from app.service import run_company_research

router = APIRouter(
    prefix="/v1/agent",
    tags=["Agent"]
)

@router.post("/generate")
def generate(request: CompanyRequest):
    return run_company_research(request.company_name)
"""
with open(os.path.join(app_dir, "routes", "agent.py"), "w", encoding="utf-8") as f:
    f.write(agent_router_content)

# 8. Create app/main.py
main_content = """from fastapi import FastAPI
from app.routes.agent import router

app = FastAPI(
    title="Placement Intelligence API",
    version="1.0.0",
    description="Production-grade FastAPI orchestrator for LangGraph Company Research"
)

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "healthy", "service": "Placement Intelligence Engine"}
"""
with open(os.path.join(app_dir, "main.py"), "w", encoding="utf-8") as f:
    f.write(main_content)

print("Project successfully restructured into a FastAPI application!")
