# Changelog

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

## [0.1.0] - 2026-02-28

### Added
- Monorepo setup using pnpm workspaces
- Backend scaffold using Fastify + TypeScript
- Frontend scaffold
- Shared types package (@nera/types)
- Docker setup with PostgreSQL
- Docker setup with MinIO
- README documentation