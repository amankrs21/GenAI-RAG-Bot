import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Local imports
from src.router import router


# Load environment variables
load_dotenv()


# Setup FastAPI app
app = FastAPI()


# CORS Configuration
cors_urls = os.getenv("CORS_URL", "*")
allowed_origins = cors_urls.split(",") if cors_urls != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API routes
app.include_router(router, prefix="/api", tags=["api"])


# create a health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}


# Error handler: 404
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    return JSONResponse({"error": "Not found"}, status_code=404)


# Error handler: 500
@app.exception_handler(Exception)
async def server_error_handler(request: Request, exc: Exception):
    return JSONResponse({"error": "Internal server error"}, status_code=500)



# Run the app
if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host=host, port=port, reload=False)
