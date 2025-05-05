from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

# Local imports
from src.models.auth_models import RegisterModel, LoginModel
from src.services.auth_service import register_user, login_user, get_current_user


auth_router = APIRouter()


@auth_router.post("/register")
def register(user: RegisterModel):
    return register_user(user.name, user.email, user.password)


@auth_router.post("/login")
def login(user: LoginModel):
    response = login_user(user.email, user.password)
    res = JSONResponse(content={"message": response["message"]})
    res.set_cookie(
        key="access_token",
        value=response["access_token"],
        httponly=True,
        max_age=3600,
        secure=True,
        samesite="lax"
    )
    return res


@auth_router.get("/validate")
def validate(user=Depends(get_current_user)):
    return user


@auth_router.post("/logout")
async def logout():
    resp = JSONResponse(content={"message": "Logged out successfully"})
    resp.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return resp
