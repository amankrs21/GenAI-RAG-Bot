import os
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI


# Load .env and fetch API Key
load_dotenv()


# Constants
TOP_P = 0.95
TEMPERATURE = 0.1
MODEL_NAME = "mistral-large-latest"
API_KEY = os.getenv("MISTRAL_API_KEY")

if not API_KEY:
    raise ValueError("Mistral API key not found.")


# Initialize Mistral Agent
mistral = ChatMistralAI(
    api_key=API_KEY,
    model=MODEL_NAME,
    temperature=TEMPERATURE,
    top_p=TOP_P,
    max_retries=2,
)
