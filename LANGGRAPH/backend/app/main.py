from fastapi import FastAPI
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
