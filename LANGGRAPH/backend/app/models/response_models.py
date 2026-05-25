from pydantic import BaseModel
from typing import Optional, Dict, Any

class RunResponse(BaseModel):
    run_id: str
    status: str
    message: str

class StatusResponse(BaseModel):
    run_id: str
    status: str
    progress: int
    stage: str
    company_name: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    execution_time: Optional[float] = None
