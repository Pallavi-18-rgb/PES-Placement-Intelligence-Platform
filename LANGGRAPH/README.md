# LANGGRAPH Monorepo

This repository is organized as a single monorepo with separate layers for frontend, backend, and orchestration.

## Project Layout

```text
LANGGRAPH/
├── frontend/
│   ├── package.json
│   ├── src/
│   └── Dockerfile
│
├── backend/
│   ├── requirements.txt
│   ├── app/
│   └── Dockerfile
│
├── orchestration/
│   ├── agents/
│   ├── workflows/
│   ├── requirements.txt
│   ├── run.py
│   └── Dockerfile
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

## Getting Started

1. Copy `.env.example` to `.env` and fill in the secret values.
2. Run the full stack with Docker Compose:

```bash
cd LANGGRAPH
cp .env.example .env
# Edit .env with your real secrets before running

docker compose up --build
```

## Services

- `backend`: FastAPI service exposing the agent orchestration API on `http://localhost:8000`
- `frontend`: Vite React web application served on `http://localhost`
- `orchestration`: agent/workflow runner container for multi-agent orchestration

## Jenkins Pipeline

The `Jenkinsfile` defines the following pipeline stages:

- Front-end pipeline:
  - `npm ci`
  - `npm run build`
  - `npm test`
  - Docker image build
- Back-end pipeline:
  - `pip install -r requirements.txt`
  - `pytest -q`
  - Docker image build using `backend/Dockerfile`
- Agentic orchestration pipeline:
  - `docker build -t langgraph_orchestration ./orchestration`
  - `docker compose build`
  - `docker compose up -d`

## Deployment Notes

- Do not commit `.env`.
- Add secrets to Jenkins credentials as a secret file with ID `ENV`.
- Use `.env.example` as the template for local development.
