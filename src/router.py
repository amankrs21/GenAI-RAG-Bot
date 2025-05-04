from fastapi import APIRouter

# local imports
from src.api.auth import auth_router
from src.api.chat import chat_router
from src.api.chunk import chunk_router


# router for the main API
router = APIRouter()


# Auth routes
router.include_router(auth_router, prefix="/auth", tags=["auth"])

# Source routes
router.include_router(chunk_router, prefix="/source", tags=["source"])

# Chat routes
router.include_router(chat_router, prefix="/chat", tags=["chat"])
