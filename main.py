import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from starlette.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse

# Local imports
from src.router import router
from src.utils.build_ui import build_react


# Load environment variables
load_dotenv()


# Setup FastAPI app
app = FastAPI()


# Mount static React frontend
STATIC_FOLDER = "client/dist"
app.mount("/static", StaticFiles(directory=STATIC_FOLDER, html=True), name="static")


# CORS Configuration
cors_url = os.getenv("CORS_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[cors_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API routes
app.include_router(router, prefix="/api", tags=["api"])


# Serve React SPA for non-API routes
@app.get("/{path_name:path}", include_in_schema=False)
async def serve_react(path_name: str, request: Request):
    if request.url.path.startswith("/api/"):
        return JSONResponse({"error": "API route not found"}, status_code=404)
    index_path = os.path.join(STATIC_FOLDER, "index.html")
    return FileResponse(index_path)


# Error handler: 500
@app.exception_handler(Exception)
async def server_error_handler(request: Request, exc: Exception):
    return JSONResponse({"error": "Internal server error"}, status_code=500)



# Run setup tasks
if __name__ == "__main__":
    if not os.path.exists(STATIC_FOLDER):
        build_react()

    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
    