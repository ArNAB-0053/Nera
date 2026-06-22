<div align="center">
   <img width="300" height="142" alt="ascii-art-text (4)" src="https://github.com/user-attachments/assets/b6afad42-8a19-4724-8f22-5a3c5c5cc706" />
</div>

## Project Overview

Nera is a secure, full-stack file management system. It allows users to store, organize, search, and manage files through a clean, modern user interface. The system ensures data privacy by encrypting files before storing them in an S3-compatible object storage layer, while metadata and folder hierarchies are tracked in a relational database.

## Features

- **User Authentication:** Secure registration and login using encrypted passwords and HTTP-only JWT cookies.
- **Secure Storage:** Files are automatically encrypted before being uploaded to the object storage backend. Storage limits are enforced for all user accounts.
- **File Management:** Upload, download, delete, search, and sort files by name, creation date, or size. Filter file listings by specific types (e.g., images, documents).
- **Folder Organization:** Create and manage nested folders for intuitive file structuring.

## Architecture

Nera follows a decoupled, modular monorepo architecture:

- **Frontend:** A Next.js web application that manages the user interface, routing, and state. It communicates with the backend via REST APIs.
- **Backend:** A Node.js and Fastify server that handles core business logic, database transactions, authentication, and file encryption/decryption.
- **Storage Layer:** PostgreSQL is used as the primary database for accounts, file metadata, and folder trees. Minio (S3-compatible) serves as the blob storage for encrypted files.

## Workflow

### Authentication
1. The user provides credentials (email/username and password) to register or log in.
2. The backend securely hashes or verifies the password using `bcrypt`.
3. Upon success, an access token and a refresh token are generated.
4. Tokens are returned and stored in the user's browser as secure, HTTP-only cookies.

### File Upload
1. The user selects a file from the UI and chooses a destination folder.
2. The frontend sends the file as `multipart/form-data` to the backend.
3. The backend validates the file type and ensures the user has sufficient storage quota.
4. The file data is encrypted in memory.
5. The encrypted blob is uploaded to the Minio object storage.
6. The file metadata (including encryption keys and path) is saved to the PostgreSQL database, and the user's storage quota is updated.

### File Retrieval
1. The user initiates a file download from the UI.
2. The frontend calls the download API endpoint with the requested file's ID.
3. The backend verifies access permissions and fetches the file's metadata.
4. The encrypted file blob is streamed from Minio storage.
5. The backend decrypts the stream in memory and serves the raw file back to the user with its original filename and MIME type.

## Tech Stack

- **Frontend:** React, Next.js, Tailwind CSS, TanStack React Query, Radix UI.
- **Backend:** Node.js, Fastify, Prisma ORM, Zod, bcrypt.
- **Database:** PostgreSQL.
- **Object Storage:** Minio (S3-compatible).

## Setup Instructions

### Prerequisites
- Node.js (v20+)
- pnpm
- PostgreSQL (running locally or via Docker)
- Minio (running locally or via Docker)

### Installation
1. Clone the repository and navigate to the project directory.
2. Install dependencies across the monorepo:
   ```bash
   pnpm install
   ```

### Environment Variables
Set up the required environment variables in the respective application directories:

**Backend (`apps/backend/.env`):**
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/nera
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
JWT_SECRET=your_secure_jwt_secret
```

**Frontend (`apps/frontend/.env.local`):**
```env
NEXT_PUBLIC_BACKEND_API=http://localhost:4000
```

### Running the Project
1. Run the database migrations to configure the schema:
   ```bash
   pnpm --filter nera-backend run db:migrate
   ```
2. Start the backend development server:
   ```bash
   pnpm --filter nera-backend run dev
   ```
3. Start the frontend development server:
   ```bash
   pnpm --filter nera run dev
   ```

## Project Structure

- `apps/frontend/`: The Next.js web application, containing UI components, hooks, and API services.
- `apps/backend/`: The Fastify API server, containing modular routes, controllers, and storage logic.
- `packages/db/`: Prisma schemas, migrations, and generated database clients.
- `packages/schemas/`: Shared Zod validation schemas.
- `packages/ui/`: Reusable UI components.
- `packages/http/`: Shared HTTP utilities and error definitions.
- `packages/types/`: Shared TypeScript type definitions.

---

### Note on Upcoming Version
Version 2 (v2) is currently in development. It will focus on stronger security architecture and more advanced encryption methodologies.
