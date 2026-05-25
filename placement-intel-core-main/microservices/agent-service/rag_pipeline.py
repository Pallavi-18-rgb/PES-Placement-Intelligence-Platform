import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# Mocked vector database / RAG logic for initial setup
# In a full implementation, you would initialize ChromaDB, embed the query,
# fetch relevant chunks, and inject them into the prompt context.

def answer_query(query: str) -> str:
    """
    Mock RAG implementation. If Gemini API key is missing, returns a mock response.
    Otherwise, sends a basic prompt to Gemini.
    """
    if not api_key:
        return "This is a mocked Agent response. To use AI, set GEMINI_API_KEY in agent-service/.env."

    try:
        # 1. (Mock) Retrieve context from Vector DB (Chroma)
        context = "Google requires a minimum CGPA of 8.0 and does not allow active backlogs."

        # 2. Construct Prompt
        system_prompt = (
            "You are a placement assistant. Answer ONLY using the provided context. "
            "If the answer is not in the context, reply 'I do not have enough information to answer that'."
        )
        full_prompt = f"{system_prompt}\n\nContext:\n{context}\n\nUser Query:\n{query}"

        # 3. Generate response using Gemini
        model = genai.GenerativeModel('gemini-pro')
        
        # Temperature 0.1 for factual, deterministic responses as per spec
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(temperature=0.1)
        )
        
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Sorry, I am currently unable to process your request."
