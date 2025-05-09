from fastapi.responses import StreamingResponse
from fastapi import APIRouter, Request, HTTPException, Depends

# local imports
from src.services.auth_service import get_current_user
from src.services.chat_service import genai_agent_chat


chat_router = APIRouter()


@chat_router.post("/mistral")
async def chat(request: Request, payload: dict, user=Depends(get_current_user)):
    query = payload.get("query")
    if not query:
        raise HTTPException(status_code=400, detail="query is required in the request body")
    # Generate or reuse a session ID (you can later link this to user auth if needed)
    session_id = request.headers.get("X-Session-ID", "default-session")
    
    response_stream = genai_agent_chat(query, session_id)
    
    return StreamingResponse(response_stream, media_type="text/plain")
