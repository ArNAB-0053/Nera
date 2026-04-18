# Nera

## Project Overview

Nera is a secure, zero-knowledge file management system. It provides a robust platform for users to store, organize, and manage files with privacy as a priority. By utilizing client-side encryption, Nera ensures that file contents are never visible to the server, providing a true zero-knowledge experience.

## Features

- **Zero-Knowledge Architecture:** Files are encrypted and decrypted exclusively on the client side. The server only stores encrypted blobs and necessary metadata.
- **Authentication:** Secure registration and login with JWT-based session management and HTTP-only cookies.
- **Two-Factor Authentication (2FA):** Enhanced account security using TOTP-based 2FA.
- **Recovery System:** Account recovery via a secure recovery key system.
- **File Handling:** Upload and download files with automated client-side encryption/decryption using the Web Crypto API (AES-GCM).
- **Organization:** Manage files within a nested folder hierarchy.
- **Search and Sorting:** Efficiently find and organize files by name, size, or date.

## Architecture

Nera is built on a decoupled architecture that separates security responsibilities between the client and the server.

### Client Responsibilities
- **Key Derivation:** Generating encryption keys from user passwords using PBKDF2.
- **Encryption/Decryption:** Performing AES-GCM encryption on files before upload and decryption after download.
- **Vault Management:** Managing the local security context and recovery keys.

### Server Responsibilities
- **Metadata Management:** Storing file references, folder structures, and encrypted metadata (IV, salt, auth tag).
- **Object Storage:** Hosting encrypted file blobs in S3-compatible storage.
- **Session Management:** Handling user authentication, refresh tokens, and 2FA verification.
- **Resource Enforcement:** Managing storage quotas and access controls.

## Workflow

### Authentication
1. User provides credentials for registration or login.
2. The server verifies identity using salted password hashes and optional 2FA.
3. Upon successful authentication, a secure session is established via JWT.

### File Upload Flow (Client-Side Encryption)
1. User selects a file and provides their vault password.
2. The client derives a unique encryption key using PBKDF2 and a random salt.
3. The file is encrypted using AES-GCM (generating an IV and an authentication tag).
4. The client uploads the encrypted blob along with the IV, salt, and tag to the server.
5. The server stores the blob in object storage and the metadata in the database.

### File Download Flow (Client-Side Decryption)
1. User requests a file download.
2. The server streams the encrypted blob and provides the stored metadata (IV, salt, tag).
3. The client receives the stream and uses the vault password to derive the original encryption key.
4. The client decrypts the file in-memory using AES-GCM and provides the file for use.

## Tech Stack

- **Backend:** Node.js, Fastify, Prisma ORM, PostgreSQL.
- **Frontend:** Next.js, React, Tailwind CSS, Web Crypto API.
- **Database:** PostgreSQL for relational data and metadata.
- **Storage:** Minio (S3-compatible) for encrypted file blobs.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- pnpm
- PostgreSQL instance
- Minio (or S3-compatible storage)

### Installation
1. Clone the repository.
2. Install dependencies: `pnpm install`.
3. Run migrations: `pnpm --filter nera-backend run db:migrate`.

### Environment Variables
**Backend (`apps/backend/.env`):**
- `DATABASE_URL`: PostgreSQL connection string.
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`: Storage configuration.
- `JWT_SECRET`: Secret for token signing.

**Frontend (`apps/frontend/.env.local`):**
- `NEXT_PUBLIC_BACKEND_API`: URL of the backend service.

### Running the Project
- Start the backend: `pnpm --filter nera-backend run dev`.
- Start the frontend: `pnpm --filter nera run dev`.

## Project Structure

- `apps/frontend/`: Next.js application containing the encryption logic and file manager UI.
- `apps/backend/`: Fastify server handling file metadata and storage orchestration.
- `packages/db/`: Prisma schema and database client generation.
- `packages/schemas/`: Shared validation schemas (Zod).
- `packages/ui/`: Shared component library.

---

### Note on Architecture
This version of Nera introduces a zero-knowledge architecture. Security has been shifted to the client, ensuring that the server never possesses the keys required to decrypt user files.
