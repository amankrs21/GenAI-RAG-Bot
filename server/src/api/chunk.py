import os
import shutil
from fastapi.responses import JSONResponse
from fastapi import APIRouter, File, UploadFile, Form, HTTPException

# local imports
from src.services.chunk_service import process_and_store_file, collection


chunk_router = APIRouter()


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@chunk_router.post("/upload")
async def upload_file(file: UploadFile = File(...), description: str = Form(...)):
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".pdf", ".txt"]:
        raise HTTPException(status_code=400, detail="Only .pdf and .txt files are supported")

    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    metadata = process_and_store_file(file_path, filename, description)
    return JSONResponse(content={"message": "File uploaded and processed", "metadata": metadata})


@chunk_router.get("/files")
async def get_files():
    all_meta = collection.get(include=["metadatas"])["metadatas"]
    file_map = {}
    for meta in all_meta:
        fid = meta["file_id"]
        if fid not in file_map:
            file_map[fid] = {
                "file_id": fid,
                "filename": meta["filename"],
                "description": meta["description"],
                "last_updated": meta["last_updated"]
            }
    return list(file_map.values())


@chunk_router.get("/file/{file_id}")
async def get_chunks(file_id: str):
    results = collection.get(
        where={"file_id": file_id},
        include=["metadatas", "documents"]
    )
    return [
        {
            "chunk_id": id_,
            "chunk": doc,
            "index": meta["chunk_index"]
        }
        for id_, doc, meta in zip(results["ids"], results["documents"], results["metadatas"])
    ]


@chunk_router.delete("/file/{file_id}")
async def delete_file(file_id: str):
    try:
        # Delete all chunks associated with the file_id
        collection.delete(where={"file_id": file_id})
        # Optionally, delete the file from the filesystem if needed
        file_path = os.path.join(UPLOAD_DIR, file_id)
        if os.path.exists(file_path):
            os.remove(file_path)
        return {"message": "File and associated chunks deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@chunk_router.put("/chunk/{chunk_id}")
async def update_chunk(chunk_id: str, payload: dict):
    try:
        new_text = payload.get("new_text")
        if not new_text:
            raise HTTPException(status_code=400, detail="new_text is required in the request body")

        # ChromaDB doesn't support direct updates. We simulate it.
        old = collection.get(ids=[chunk_id])
        meta = old["metadatas"][0]
        collection.delete(ids=[chunk_id])
        collection.add(documents=[new_text], ids=[chunk_id], metadatas=[meta])
        return {"message": "Chunk updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@chunk_router.delete("/chunk/{chunk_id}")
async def delete_chunk(chunk_id: str):
    try:
        collection.delete(ids=[chunk_id])
        return {"message": "Chunk deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
