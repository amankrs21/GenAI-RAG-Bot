import os
import uuid
import pdfplumber
from typing import List
from chromadb import PersistentClient
from datetime import datetime, timezone
from sentence_transformers import SentenceTransformer


# Constants
CHUNK_SIZE = 500
CHROMA_DB_PATH = "chroma_db"
CHROMA_COLLECTION_NAME = "file_chunks"


# Initialize embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


# Setup ChromaDB client
chroma_client = PersistentClient(path=CHROMA_DB_PATH)
collection = chroma_client.get_or_create_collection(name=CHROMA_COLLECTION_NAME)


# cleaning function to remove extra spaces
def clean_text(text: str) -> str:
    return ' '.join(text.split())


# function to chunk text into smaller pieces
def chunk_text(text: str, max_chunk_size: int = CHUNK_SIZE) -> List[str]:
    words = text.split()
    return [' '.join(words[i:i + max_chunk_size]) for i in range(0, len(words), max_chunk_size)]


# function to extract text from PDF or TXT files
def extract_text(file_path: str, file_ext: str) -> str:
    if file_ext == ".pdf":
        with pdfplumber.open(file_path) as pdf:
            return "\n".join([page.extract_text() or "" for page in pdf.pages])
    elif file_ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        raise ValueError("Unsupported file type")


# function to process and store file in ChromaDB
def process_and_store_file(file_path: str, filename: str, description: str):
    ext = os.path.splitext(file_path)[1].lower()
    raw_text = extract_text(file_path, ext)
    cleaned_text = clean_text(raw_text)
    chunks = chunk_text(cleaned_text)
    
    # Check if file already exists
    existing = collection.get(where={"filename": filename})
    if existing and existing.get("metadatas"):
        existing_file_ids = {metadata["file_id"] for metadata in existing["metadatas"]}
        for file_id in existing_file_ids:
            collection.delete(where={"file_id": file_id})

    # New file metadata
    file_id = str(uuid.uuid4())
    metadata = {
        "file_id": file_id,
        "filename": filename,
        "description": description,
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

    for i, chunk in enumerate(chunks):
        chunk_id = str(uuid.uuid4())
        vector = embedding_model.encode(chunk).tolist()

        collection.add(
            documents=[chunk],
            ids=[chunk_id],
            metadatas=[{**metadata, "chunk_index": i}],
            embeddings=[vector],
        )

    print(f"[EmbeddingService] Stored {len(chunks)} embeddings.")
    return metadata
