# 🤖 GENAI-RAG-BOT

A production-ready Generative AI Assistant built with Retrieval-Augmented Generation (RAG) architecture using **FastAPI**, **ChromaDB**, and **LLMs** (e.g., Mistral). This bot answers domain-specific queries using a vector store and never hallucinates — it only replies using relevant documents from its database.

---

## 🚀 Features

* 🔍 **Context-aware Retrieval** via [ChromaDB](https://www.trychroma.com/)
* 📚 **LangChain Integration**: Seamlessly chains LLM calls with retrieval, enabling advanced workflows like summarization, Q&A, and document parsing. 
* 📚 **Document Embeddings**: Store and retrieve documents in vector format using cohere (embed-english-v3.0)
* 🧠 **LLM-Powered Responses** (e.g., Mistral via `mistral.ai`)
* 🔐 Strict: Only responds using data retrieved from vector store
* 💾 Source-aware: Supports citation-style responses
* 🧼 Clean **FastAPI** backend with CORS support
* ⚙️ Ready for deployment on Azure App Service
* 📦 Modular Router + Configured Error Handlers + Health Endpoint

---

## 🧠 How It Works

1. **User query** → `/api/chat`
2. **Query embedding** → Compare with ChromaDB document embeddings
3. **Retrieve top-k chunks** → Pass to the LLM as context
4. **Generate response** → Only if relevant chunks exist
5. **No relevant data?** → “Sorry, I don’t have any information about this.”

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=your-port
HOST=http://localhost:5000
CORS_URL=http://localhost:5173
JWT_SECRET=your-secret
MONGO_URL=your-mongo-url
MISTRAL_MODEL_NAME=your-model-name
MISTRAL_API_KEY=your-mistral-api-key
COHERE_API_KEY=your-cohere-api-key
```

---

## 💻 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/amankrs21/GENAI-RAG-BOT.git
cd GENAI-RAG-BOT

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server
uvicorn main:app --reload
```

Then visit: [http://localhost:5000/health](http://localhost:5000/health)

---

## 🛡️ Agent Behavior

This bot **does not hallucinate**.

> It only replies based on retrieved chunks from the ChromaDB vector store.
> If nothing relevant is found, it replies:
> *“Sorry, I don’t have any information about this.”*

---

## 📦 Requirements

* Python 3.9+
* FastAPI
* Uvicorn
* ChromaDB
* Requests
* Uplinks for Mistral/LLM calls

(See `requirements.txt` for full list)

---

## 📄 License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.

---

## 🙋‍♂️ Author

Built with ❤️ by [**@amankrs21**](https://github.com/amankrs21)

---

## ✨ Want to Contribute?

PRs are welcome! This is just the beginning of RAG-native GenAI tooling.
