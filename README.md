```markdown
# ContractLens

**AI-powered Contract Analysis System**

ContractLens is a full-stack RAG (Retrieval-Augmented Generation) application that allows users to upload legal contracts (PDF) and ask natural language questions about them. The system retrieves relevant clauses and generates accurate, grounded answers using local LLMs.

---

## Features

- Upload PDF contracts
- Automatic text extraction, chunking, and embedding
- Ask questions about any uploaded contract
- Source citations (page number + excerpt)
- Multi-turn conversations with history
- Like / Dislike feedback on answers
- Regenerate responses
- Support for English and Persian contracts
- Fully local stack (Ollama + Chroma) — no external API keys required

---

## Tech Stack

| Layer        | Technology                                      |
|--------------|--------------------------------------------------|
| Backend      | Django  + Django REST Framework                 |
| Frontend     | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| RAG          | LangChain, ChromaDB, Ollama                     |
| Embeddings   | Ollama Embeddings                               |
| LLM          | Ollama (Qwen or any compatible model)           |
| PDF Parsing  | PyPDF                                           |

---

## Architecture Overview

```
User uploads PDF
       ↓
PDF Service extracts text
       ↓
Chunk Service splits documents (with Persian support)
       ↓
Embedding Service stores vectors in Chroma (filtered by contract_id)
       ↓
User asks a question
       ↓
Retriever (MMR) finds relevant chunks
       ↓
LLM generates answer grounded only in the retrieved context
       ↓
Answer + Sources returned to frontend
```

---

## Project Structure

```
contractlens/
├── backend/                 # Django project settings
├── apps/
│   └── contracts/           # Main application
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       └── services/        # Business logic
│           ├── pdf_service.py
│           ├── chunk_service.py
│           ├── embedding_service.py
│           ├── rag_service.py
│           ├── contract_service.py
│           ├── conversation_service.py
│           └── message_service.py
├── frontend/                # Next.js application
├── manage.py
└── requirements.txt
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.com) installed and running
- A local embedding model and LLM pulled in Ollama

```bash
# Example models (you can change them in settings)
ollama pull nomic-embed-text
ollama pull qwen2.5:7b
```

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/amirhassanadeli/contractlens.git
cd contractlens

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the Django server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## Environment Variables

Create a `.env.local` file in the project root (or configure in Django settings):

```env
LLM_MODEL=qwen2.5:7b
EMBEDDING_MODEL=nomic-embed-text
TEMPERATURE=0.1
CHUNK_SIZE=800
CHUNK_OVERLAP=150
TOP_K=5
FETCH_K=20
CHROMA_DIR=./chroma_db
```

---

## API Overview

| Method | Endpoint                                      | Description                    |
|--------|-----------------------------------------------|--------------------------------|
| POST   | `/api/contracts/`                             | Upload a new contract          |
| GET    | `/api/contracts/`                             | List contracts                 |
| POST   | `/api/contracts/{id}/chat/`                   | Ask a question about a contract|
| GET    | `/api/conversations/?contract_id=`            | List conversations             |
| POST   | `/api/conversations/`                         | Create a conversation          |
| GET    | `/api/conversations/{id}/messages/`           | Get message history            |
| POST   | `/api/conversations/{id}/messages/`           | Send a new message             |
| PATCH  | `/api/messages/{id}/feedback/`                | Like / Dislike a message       |
| POST   | `/api/messages/{id}/regenerate/`              | Regenerate an answer           |

---

## How the RAG Pipeline Works

1. **Ingestion**
   - PDF is loaded page by page
   - Text is split using `RecursiveCharacterTextSplitter` with Persian-aware separators
   - Chunks are embedded and stored in Chroma with `contract_id` metadata

2. **Retrieval**
   - Question is embedded
   - MMR search is performed with a filter on `contract_id`
   - Top relevant chunks are returned

3. **Generation**
   - A strict system prompt forces the model to answer **only** from the provided context
   - If the answer is not in the context, the model replies `"I don't know."`
   - Sources (filename, page, excerpt) are returned alongside the answer

---

## Current Limitations & Roadmap

- [ ] Asynchronous document processing (currently synchronous)
- [ ] Conversation history is not yet injected into the LLM context
- [ ] No authentication / multi-user support
- [ ] No Docker / docker-compose setup
- [ ] Limited evaluation of answer quality
- [ ] No hybrid search (BM25 + vector)
- [ ] No reranker

These items are planned for future iterations.

---

## Screenshots

> *Add screenshots of the UI here (upload page, chat interface, sources panel)*

---

## Author

**Amirhassan Adeli**  
AI & Data Science Engineer

- LinkedIn: [linkedin.com/in/amirhassanadeli](https://www.linkedin.com/in/amirhassanadeli)
- GitHub: [github.com/amirhassanadeli](https://github.com/amirhassanadeli)
- Website: [amirhassanadeli.com](https://amirhassanadeli.com)