from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rag_pipeline import answer_query

app = FastAPI(title="PlaceVerse Agent Service")

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "agent-service"}

@app.post("/api/agent/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        if not request.query:
            raise HTTPException(status_code=400, detail="Query string is required")
        
        answer = answer_query(request.query)
        return ChatResponse(response=answer)
    except Exception as e:
        print(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating response")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
