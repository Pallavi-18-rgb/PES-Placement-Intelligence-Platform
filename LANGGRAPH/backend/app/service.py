import uuid
import time
import json
from orchestration.workflows.graph import graph

active_runs = {}

NODE_PROGRESS = {
    "research_agent": {"stage": "researching", "progress": 40},
    "consolidation_agent": {"stage": "consolidating", "progress": 70},
    "save_validation_agent": {"stage": "validating and saving", "progress": 90},
}

def execute_graph_task(run_id: str, company_name: str):
    start = time.time()
    initial_state = {
        "company_name": company_name,
        "research_output": {},
        "consolidated_output": "",
        "validation_status": False,
        "retry_count": 0
    }
    
    try:
        final_state = initial_state.copy()
        for output in graph.stream(initial_state):
            for node_name, state_update in output.items():
                if node_name in NODE_PROGRESS:
                    active_runs[run_id]["stage"] = NODE_PROGRESS[node_name]["stage"]
                    active_runs[run_id]["progress"] = NODE_PROGRESS[node_name]["progress"]
                final_state.update(state_update)

        result_data = None
        if final_state.get("consolidated_output"):
            try:
                result_data = json.loads(final_state["consolidated_output"])
            except:
                result_data = {"raw": final_state["consolidated_output"]}

        active_runs[run_id].update({
            "status": "completed",
            "progress": 100,
            "stage": "completed",
            "result": result_data or {"message": "Golden Record Generated"},
            "execution_time": round(time.time() - start, 2)
        })
        
    except Exception as e:
        active_runs[run_id].update({
            "status": "failed",
            "progress": 0,
            "error": str(e),
            "execution_time": round(time.time() - start, 2)
        })

def run_company_research(company_name: str, background_tasks):
    run_id = str(uuid.uuid4())
    active_runs[run_id] = {
        "status": "running",
        "progress": 10,
        "stage": "initializing",
        "company_name": company_name,
        "result": None,
        "error": None,
        "execution_time": None
    }
    
    background_tasks.add_task(execute_graph_task, run_id, company_name)
    
    return run_id

def get_run_status(run_id: str):
    return active_runs.get(run_id)

def get_all_runs():
    return active_runs
