from fastapi import APIRouter, BackgroundTasks, HTTPException
from typing import Dict
from app.models.request_models import CompanyRequest
from app.models.response_models import RunResponse, StatusResponse
from app.service import run_company_research, get_run_status, get_all_runs

router = APIRouter(
    prefix="/v1/agent",
    tags=["Agent"]
)

@router.post("/generate", response_model=RunResponse)
def generate(request: CompanyRequest, background_tasks: BackgroundTasks):
    run_id = run_company_research(request.company_name, background_tasks)
    return RunResponse(
        run_id=run_id,
        status="queued",
        message=f"Research task for {request.company_name} has been queued."
    )

@router.get("/status", response_model=Dict[str, StatusResponse])
def get_all_status():
    runs = get_all_runs()
    return {
        run_id: StatusResponse(
            run_id=run_id,
            **run_data
        ) for run_id, run_data in runs.items()
    }

@router.get("/status/{run_id}", response_model=StatusResponse)
def get_status(run_id: str):
    run_data = get_run_status(run_id)
    if not run_data:
        raise HTTPException(status_code=404, detail="Run not found")
    
    return StatusResponse(
        run_id=run_id,
        **run_data
    )
