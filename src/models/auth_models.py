from pydantic import BaseModel, EmailStr, Field

class RegisterModel(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=8)

class LoginModel(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
