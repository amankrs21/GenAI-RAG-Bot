import os
import re
import bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, Request


# Local imports
from src.services.jwt_handler import create_access_token, decode_access_token


# Load environment variables
load_dotenv()
MONGO_URL = os.getenv('MONGO_URL')
JWT_SECRET = os.getenv('JWT_SECRET')
if not MONGO_URL or not JWT_SECRET:
    raise ValueError('Mongo URL or JWT secret not found.')


# MongoDB connection
def connect_mongodb():
    client = MongoClient(MONGO_URL, retryWrites=False)
    db = client['GenAIBot']
    return db['users']


# Email validation
def is_valid_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


# Register user
def register_user(name: str, email: str, password: str):
    if not all([name, email, password]):
        raise HTTPException(status_code=400, detail="All fields are required")
    
    if not is_valid_email(email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    users = connect_mongodb()
    if users.find_one({'email': email}):
        raise HTTPException(status_code=400, detail="User already exists!")

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user = {
        'name': name.strip(),
        'email': email.lower(),
        'password': hashed_password,
        'created_at': datetime.now(timezone.utc)
    }

    result = users.insert_one(user)
    if not result.acknowledged:
        raise HTTPException(status_code=500, detail="Failed to create user")

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


# Login user
def login_user(email: str, password: str):
    if not all([email, password]):
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    users = connect_mongodb()
    user = users.find_one({'email': email.lower()})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {
        "sub": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }

    access_token = create_access_token(token_data)
    return {
        "message": "Login successful",
        "access_token": access_token
    }


# Get current user
def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization token missing")

    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    users = connect_mongodb()
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }
