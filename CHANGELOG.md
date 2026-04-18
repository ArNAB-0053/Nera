# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-04-18

### Added
- **Zero-Knowledge Architecture:** Full implementation of client-side encryption and decryption.
- **Client-Side Crypto:** New encryption utility using Web Crypto API (AES-GCM) with PBKDF2 key derivation.
- **Two-Factor Authentication:** Added TOTP-based 2FA support using `speakeasy`.
- **Account Recovery:** New recovery key system allowing users to reset passwords while maintaining vault access.
- **Enhanced File Metadata:** Support for storing `iv`, `authTag`, and `salt` in the database to facilitate client-side decryption.

### Changed
- **Security Model Shift:** Moved all file encryption and decryption logic from the server to the client.
- **API Updates:** Updated upload and download endpoints to handle encrypted blobs and associated cryptographic metadata.
- **Prisma Schema:** Refactored `File` model to replace legacy encryption fields with standardized client-side metadata fields.
- **User Schema:** Added `recoveryKeyHash` and 2FA configuration fields to the `User` model.
- **Storage Logic:** The server now handles files as opaque binary blobs (`application/octet-stream`).

### Removed
- **Server-Side Encryption:** Removed legacy `crypto.service.js` from the backend.
- **Legacy Metadata:** Removed `encryptionIv` and `encryptionTag` fields from the database schema.

### Security
- Introduced a zero-knowledge model where the server has no access to raw file contents or encryption keys.
- Implemented secure vault key derivation on the client using user passwords and random salts.
- Hardened authentication with optional 2FA and secure recovery flows.

---

## [1.0.0] - 2026-04-18

### Added
- User authentication with JWT (access + refresh tokens stored in HTTP-only cookies)
- File upload, download, and deletion functionality
- Folder-based file organization with nested structure
- File search, sorting (name, date, size), and type-based filtering
- Storage quota enforcement per user
- File encryption before uploading to object storage (Minio)

### Infrastructure
- Integration with PostgreSQL for metadata and folder hierarchy
- Integration with Minio (S3-compatible) for file storage
- Prisma ORM setup for database access
- Monorepo structure with shared packages (db, schemas, types, ui, http)

### Improvements
- Modular backend architecture (services, repositories, controllers)
- Frontend data fetching using React Query
- Input validation using Zod schemas

---

## [0.1.0] - 2026-04-18

### Added
- Monorepo setup using pnpm workspaces
- Backend scaffold using Fastify + TypeScript
- Frontend scaffold
- Shared types package (@nera/types)
- Docker setup with PostgreSQL
- Docker setup with MinIO
- README documentation
