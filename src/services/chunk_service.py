import os
import uuid
import pdfplumber
from typing import List
from chromadb import PersistentClient
from datetime import datetime, timezone


# Setup ChromaDB client
chroma_client = PersistentClient(path="chroma_data")
collection = chroma_client.get_or_create_collection(name="file_chunks")


def clean_text(text: str) -> str:
    return ' '.join(text.split())  # removes extra spaces, newlines


def chunk_text(text: str, max_chunk_size: int = 500) -> List[str]:
    words = text.split()
    chunks = [' '.join(words[i:i + max_chunk_size]) for i in range(0, len(words), max_chunk_size)]
    return chunks


def extract_text(file_path: str, file_ext: str) -> str:
    if file_ext == ".pdf":
        with pdfplumber.open(file_path) as pdf:
            return "\n".join([page.extract_text() or "" for page in pdf.pages])
    elif file_ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        raise ValueError("Unsupported file type")


def process_and_store_file(file_path: str, filename: str, description: str):
    ext = os.path.splitext(file_path)[1].lower()
    raw_text = extract_text(file_path, ext)
    cleaned_text = clean_text(raw_text)
    chunks = chunk_text(cleaned_text)

    file_id = str(uuid.uuid4())
    metadata = {
        "file_id": file_id,
        "filename": filename,
        "description": description,
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

    for i, chunk in enumerate(chunks):
        chunk_id = str(uuid.uuid4())
        collection.add(
            documents=[chunk],
            ids=[chunk_id],
            metadatas=[{**metadata, "chunk_index": i}]
        )

    return metadata
