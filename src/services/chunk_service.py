import os
import uuid
import logging
import chromadb
import pdfplumber
from chromadb.config import Settings
from datetime import datetime, timezone
from langchain.embeddings.base import Embeddings
from sentence_transformers import SentenceTransformer
from langchain_experimental.text_splitter import SemanticChunker
from langchain.text_splitter import RecursiveCharacterTextSplitter


# Suppress warnings from pdfminer
logging.getLogger("pdfminer").setLevel(logging.ERROR)


# Constants
CHUNK_OVERLAP = 1.5
CHROMA_DB_PATH = "chroma_db"
CHROMA_COLLECTION_NAME = "file_chunks"


# Embedding model wrapper
class SentenceTransformerEmbeddings(Embeddings):
    def __init__(self, model_name: str = 'sentence-transformers/all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        return self.model.encode(texts, convert_to_numpy=True).tolist()

    def embed_query(self, text):
        return self.model.encode(text, convert_to_numpy=True).tolist()


# Initialize embedding model and text splitter
embedding_model = SentenceTransformerEmbeddings()
# text_splitter = SemanticChunker(
#     embeddings=embedding_model,
#     breakpoint_threshold_type="standard_deviation",     # or "percentile"
#     breakpoint_threshold_amount=CHUNK_OVERLAP
# )
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=50,
)


# Setup ChromaDB client
def setup_chromadb():
    client = chromadb.PersistentClient(
        path=CHROMA_DB_PATH,
        settings=Settings(anonymized_telemetry=False)
    )
    return client.get_or_create_collection(name=CHROMA_COLLECTION_NAME)


# Initialize collection once
collection = setup_chromadb()


# cleaning function to remove extra spaces
def clean_text(text: str) -> str:
    return ' '.join(text.split())


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

    # Split using SemanticChunker
    docs = text_splitter.create_documents([cleaned_text])
    chunks = [doc.page_content for doc in docs]

    # Check if file already exists
    existing = collection.get(where={"filename": filename})
    if existing and existing.get("metadatas"):
        existing_file_ids = {metadata["file_id"] for metadata in existing["metadatas"]}
        for file_id in existing_file_ids:
            collection.delete(where={"file_id": file_id})
        print(f"[EmbeddingService] Removed previous entries for '{filename}'.")

    # New file metadata
    file_id = str(uuid.uuid4())
    metadata = {
        "file_id": file_id,
        "filename": filename,
        "description": description,
        "last_updated": datetime.now(timezone.utc).isoformat()
    }
    
    # Batch embed all chunks at once
    vectors = embedding_model.embed_documents(chunks)

    for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
        chunk_id = str(uuid.uuid4())
        collection.add(
            documents=[chunk],
            ids=[chunk_id],
            metadatas=[{**metadata, "chunk_index": i}],
            embeddings=[vector],
        )

    print(f"[EmbeddingService] Stored {len(chunks)} semantic chunks for '{filename}'.")
    return metadata
