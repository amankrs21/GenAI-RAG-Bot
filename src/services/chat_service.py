import time
from langchain_core.messages import HumanMessage, SystemMessage

# local imports
from src.utils.agent_setup import mistral
from src.utils.agent_role import agent_role_message
from src.services.chunk_service import collection


# In-memory session tracking
session_data = {}


# Clean old sessions
def clean_sessions():
    current_time = time.time()
    expired = [
        session_id for session_id, data in session_data.items()
        if current_time - data["start_time"] > 6 * 60 * 60
    ]
    for sid in expired:
        del session_data[sid]
        print(f"[Session Cleanup] Removed expired session: {sid}")


def retrieve_context_from_chromadb(user_query: str) -> str:
    try:
        results = collection.query(
            query_texts=[user_query],
            n_results=3
        )
        # print(f"[ChromaDB] Retrieved {len(results.get('documents', [[]])[0])} documents.")
        # print(f"[ChromaDB] Results: {results}")
        docs = results.get("documents", [[]])[0]
        context = "\n\n".join([f"- {doc.strip()}" for doc in docs if doc.strip()])
        if context:
            return f"Relevant info retrieved from your documents:\n\n{context}"
    except Exception as e:
        print(f"[ChromaDB Error] {e}")
    return ""


def genai_agent_chat(user_query: str, session_id: str):
    if not user_query.strip():
        return "Hmm... You didn’t type anything! Try again with a query."

    # Clean sessions
    clean_sessions()

    # Init session if new
    if session_id not in session_data:
        session_data[session_id] = {
            "messages": [],
            "count": 0,
            "start_time": time.time(),
        }

    if session_data[session_id]["count"] >= 5:
        return "You’ve reached the 5-message limit. Try again after 6 hours!"

    # Retrieve vector-based context
    retrieved_context = retrieve_context_from_chromadb(user_query)
    context_prefix = (
        f"{retrieved_context}\n\nUser Query: {user_query}" if retrieved_context
        else user_query
    )

    # Combine system, past memory, and current query
    messages = [
        SystemMessage(content=agent_role_message)
    ] + session_data[session_id]["messages"] + [
        HumanMessage(content=context_prefix)
    ]

    def generate_stream():
        full_response = ""

        try:
            for chunk in mistral.stream(messages):
                content = chunk.content
                full_response += content
                # print(content, end="", flush=True)
                yield content
        except Exception as e:
            print(f"[Stream Error] {e}")
            yield "⚠️ Something went wrong while processing your request."

        # Save memory
        session_data[session_id]["messages"].extend([
            HumanMessage(content=user_query),
            HumanMessage(content=full_response)
        ])
        session_data[session_id]["messages"] = session_data[session_id]["messages"][-5:]
        session_data[session_id]["count"] += 1

        if session_data[session_id]["count"] >= 5:
            session_data[session_id]["start_time"] = time.time()

    return generate_stream()
