import time
from langchain_core.messages import HumanMessage, SystemMessage

# local imports
from src.utils.agent_setup import mistral
from src.utils.agent_role import agent_role_message
from src.services.chunk_service import setup_chromadb, embedding_model


# Constants
TOP_K = 5
THRESHOLD = 1.2
SESSION_DATA = {}


# Initialize collection once
collection = setup_chromadb()


# Session data to track user interactions
def clean_sessions():
    current_time = time.time()
    expired = [
        session_id for session_id, data in SESSION_DATA.items()
        if current_time - data["start_time"] > 6 * 60 * 60
    ]
    for sid in expired:
        del SESSION_DATA[sid]


# Function to retrieve context from ChromaDB
def retrieve_context_from_chromadb(user_query: str) -> str:
    try:
        query_embedding = embedding_model.embed_query(user_query)
        results = collection.query(
            query_embeddings=query_embedding,
            n_results=TOP_K,
            include=["documents", "metadatas", "distances"]
        )

        documents = results.get("documents", [[]])[0]
        distances = results.get("distances", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]

        # Filter docs by distance threshold and ensure content is not empty
        filtered_docs = [
            (doc, metadata) for doc, score, metadata in zip(documents, distances, metadatas)
            if score < THRESHOLD and doc.strip()
        ]
        
        print(f"[ChromaDB] Distances: {distances}")

        if filtered_docs:
            context = "\n\n".join([
                f"- {doc.strip()} (source: {metadata['filename']}, updated: {metadata['last_updated']})"
                for doc, metadata in filtered_docs
            ])
            return context

    except Exception as e:
        print(f"[ChromaDB Error] {e}")
        
    return ""



# Function to handle chat interactions
def genai_agent_chat(user_query: str, session_id: str):
    if not user_query.strip():
        return "Hmm... You didn’t type anything! Try again with a query."

    clean_sessions()

    if session_id not in SESSION_DATA:
        SESSION_DATA[session_id] = {
            "messages": [],
            "count": 0,
            "start_time": time.time(),
        }

    retrieved_context = retrieve_context_from_chromadb(user_query)
    
    # If no context is retrieved, return the message immediately
    if not retrieved_context.strip():
        return "🤖 Sorry, I couldn’t find any relevant information in my Data Source. Please connect with the Admin Department"

    # If context is found, include it in the prompt
    context_prefix = f"{retrieved_context}\n\nUser Query: {user_query}"
    
    # print(f"===> Retrieved Context: \n\n{retrieved_context}")

    messages = [
        SystemMessage(content=agent_role_message),
        *SESSION_DATA[session_id]["messages"],
        HumanMessage(content=context_prefix)
    ]

    def generate_stream():
        full_response = ""
        try:
            for chunk in mistral.stream(messages):
                content = chunk.content
                full_response += content
                yield content
                
        except Exception as e:
            print(f"[Stream Error] {e}")
            yield "Something went wrong while processing your request."

        # Update session with new messages
        SESSION_DATA[session_id]["messages"].extend([
            HumanMessage(content=user_query),
            HumanMessage(content=full_response)
        ])
        SESSION_DATA[session_id]["messages"] = SESSION_DATA[session_id]["messages"][-5:]
        SESSION_DATA[session_id]["count"] += 1

        if SESSION_DATA[session_id]["count"] >= 5:
            SESSION_DATA[session_id]["start_time"] = time.time()

    return generate_stream()
