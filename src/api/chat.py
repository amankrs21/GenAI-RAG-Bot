from fastapi import APIRouter, Form, Request
from fastapi.responses import StreamingResponse

# local imports
from src.services.chat_service import genai_agent_chat


chat_router = APIRouter()


@chat_router.post("/mistral")
async def chat(request: Request, query: str = Form(...)):
    # Generate or reuse a session ID (you can later link this to user auth if needed)
    session_id = request.headers.get("X-Session-ID", "default-session")
    
    response_stream = genai_agent_chat(query, session_id)
    
    return StreamingResponse(response_stream, media_type="text/plain")
