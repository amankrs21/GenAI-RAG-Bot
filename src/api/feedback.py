import uuid
import json
from pathlib import Path
from datetime import datetime
from fastapi import APIRouter, Request, HTTPException, Depends

# local imports
from src.services.auth_service import get_current_user


feedback_router = APIRouter()


# Path to the feedback data file
FEEDBACK_FILE = Path("chroma_db/feedback_data.jsonl")


@feedback_router.post("/dislike")
async def chat(request: Request):
    try:
        body = await request.json()
        comment = body.get('comment')
        user_message = body.get('userMessage')
        bot_response = body.get('botResponse')
        
        if not comment or not user_message or not bot_response:
            return HTTPException(status_code=400, detail="Invalid feedback data")
        
        feedback = {
            "id": str(uuid.uuid4()),
            "comment": comment,
            "userMessage": user_message,
            "botResponse": bot_response,
            "createdAt": datetime.now().isoformat()
        }
        
        with FEEDBACK_FILE.open("a", encoding="utf-8") as f:
            f.write(json.dumps(feedback) + "\n")
        
    except Exception as e:
        print(f"Error processing feedback: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return {"message": "Feedback received successfully"}



@feedback_router.get("")
async def get_feedback(user=Depends(get_current_user)):
    try:
        feedback_list = []
        with FEEDBACK_FILE.open("r", encoding="utf-8") as f:
            for line in f:
                feedback = json.loads(line)
                feedback_list.append(feedback)
        
        return feedback_list
    
    except Exception as e:
        print(f"Error retrieving feedback: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@feedback_router.delete("/{feedback_id}")
async def delete_feedback(feedback_id: str, user=Depends(get_current_user)):
    try:
        feedback_list = []
        feedback_found = False
        
        with FEEDBACK_FILE.open("r", encoding="utf-8") as f:
            for line in f:
                feedback = json.loads(line)
                if feedback["id"] == feedback_id:
                    feedback_found = True
                else:
                    feedback_list.append(feedback)
        
        if not feedback_found:
            raise HTTPException(status_code=404, detail="Feedback not found")
        
        with FEEDBACK_FILE.open("w", encoding="utf-8") as f:
            for feedback in feedback_list:
                f.write(json.dumps(feedback) + "\n")
        
    except Exception as e:
        print(f"Error deleting feedback: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return {"message": "Feedback deleted successfully"}
