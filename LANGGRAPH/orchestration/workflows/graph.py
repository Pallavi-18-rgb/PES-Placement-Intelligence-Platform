from langgraph.graph import StateGraph, END
from app.state import GraphState
from agents.research_agent import research_agent
from agents.consolidation_agent import consolidation_agent
from agents.save_validation_agent import save_validation_agent

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
app = graph
