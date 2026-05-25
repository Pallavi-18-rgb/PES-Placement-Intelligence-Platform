from typing import TypedDict, Optional, Dict, Any

class GraphState(TypedDict):
    company_name: str
    research_output: Optional[Dict[str, Any]]
    consolidated_output: Optional[Any]
    validation_status: bool
    retry_count: int
