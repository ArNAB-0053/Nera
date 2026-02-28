# Nera

Nera is an encrypted, disaster-ready document storage system designed
with client-side encryption, secure object storage, and versioned
metadata management.

The goal of Nera is to provide secure, distributed document storage that
remains accessible even in disaster scenarios while ensuring that only
the user can decrypt their files.

------------------------------------------------------------------------

## 🚀 Tech Stack

### Backend

-   Fastify (Node.js)
-   TypeScript

### Frontend

-   Next.js (React)
-   TanStack Query

### Infrastructure

-   PostgreSQL (Docker)
-   MinIO (S3-compatible object storage)
-   Docker Compose
-   pnpm (Monorepo)

------------------------------------------------------------------------

## 🏗 Project Structure

    nera/
    │
    ├── apps/
    │   ├── backend/          # Fastify API
    │   └── frontend/         # Next.js frontend
    │
    ├── packages/
    │   └── types/            # Shared TypeScript types
    │
    ├── docker/               # Docker infrastructure (Postgres + MinIO)
    │
    ├── package.json
    ├── pnpm-workspace.yaml
    ├── pnpm-lock.yaml
    ├── README.md
    ├── CHANGELOG.md
    └── LICENSE

------------------------------------------------------------------------

## 🐳 Running Infrastructure

Start PostgreSQL and MinIO:

``` bash
cd docker
docker compose up -d
```

### Services

  Service      URL / Port
  ------------ -------------------------
  PostgreSQL   `localhost:5432`
  MinIO API    `http://localhost:9000`
  MinIO UI     `http://localhost:9001`

------------------------------------------------------------------------

## 🖥 Running Backend

``` bash
cd apps/backend
pnpm dev
```

Backend runs at:

http://localhost:4000

Health check endpoint:

http://localhost:4000/health

------------------------------------------------------------------------

## 🌐 Running Frontend

``` bash
cd apps/frontend
pnpm dev
```

Frontend runs at:

http://localhost:3000

------------------------------------------------------------------------

## 🧩 Architecture Overview

    Browser
       ↓
    Frontend (Next.js)
       ↓
    Backend (Fastify API)
       ↓
    PostgreSQL (metadata)
       ↓
    MinIO (encrypted file blobs)

-   Files are encrypted client-side.
-   Backend stores only encrypted blobs.
-   Metadata and version history stored in PostgreSQL.
-   MinIO provides S3-compatible object storage.

------------------------------------------------------------------------

## 📦 Monorepo

This project uses **pnpm workspaces**.

Workspace configuration is defined in:

pnpm-workspace.yaml

Internal packages (e.g., `@nera/types`) are linked using:

"workspace:\*"

------------------------------------------------------------------------

## 📌 Versioning

Nera follows Semantic Versioning.

See `CHANGELOG.md` for project milestones and updates.

------------------------------------------------------------------------

## 🛡 Security Goals

-   Client-side encryption
-   Zero-knowledge backend
-   Versioned storage
-   Disaster recovery readiness

------------------------------------------------------------------------

## 📄 License

See `LICENSE` file for details.
