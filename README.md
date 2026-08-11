# Government Primary School Pethgam Wagoora — School ERP

A mobile-first Next.js + TypeScript + Prisma school ERP starter package with:

- Dynamic student roll upload from XLSX/CSV
- RBAC roles: HOI_ADMIN, TEACHER, SCHOOL_AAYA, SCHOOL_COOK
- Student and staff attendance
- PM-POSHAN meal and inventory tracking
- CCE formative/summative grades
- Scheme distribution ledger
- HOI executive dashboard
- Offline-first browser queue using IndexedDB
- SQLite by default, with Prisma-compatible PostgreSQL configuration
- Printable report-card and roll-statement views

## Important security note

This repository is a functional application foundation, not a substitute for a government-approved student information system. Do not store Aadhaar/APaar or other sensitive identifiers in an unsecured browser cache. For production, use HTTPS, strong authentication, server-side authorization, encrypted backups, audit logs, retention controls, and a compliant hosting environment.

## Quick start

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

The demo login is intentionally simple for local development. Replace it with a real identity provider before production.

## Database

Default:

```env
DATABASE_URL="file:./dev.db"
```

For PostgreSQL, change the Prisma datasource provider to `postgresql` and use a PostgreSQL connection string.

## Demo users

- Mohammad Ashraf Rather — HOI_ADMIN
- Mohammad Iqbal Rather — TEACHER
- Zamrooda Bano — TEACHER
- Masrat Begum — SCHOOL_AAYA
- Shaheena Bano — SCHOOL_COOK

The demo UI uses a role selector instead of real passwords. This is only for local prototyping.

## Roll upload columns

Supported aliases include:

- Roll_No
- Student_Name
- Class
- Gender
- Category
- BPL_Status
- Aadhaar_APAAR_ID
- Parent_Name
- Contact_Number
- CWSN_Status

The uploader validates classes 1–5, required names, duplicate roll numbers within a class, and normalizes common boolean values.

## Offline-first

`src/lib/offlineQueue.ts` stores pending mutation payloads in IndexedDB. The browser queues failed mutations and attempts to replay them when the connection returns. For production, add authenticated server-side idempotency keys and conflict resolution.

## Production hardening checklist

1. Replace demo authentication with NextAuth/Auth.js, Entra ID, Google Workspace, or another approved identity provider.
2. Enforce authorization in every API route/server action — never trust UI role state.
3. Add audit log records for sensitive operations.
4. Encrypt database and backups.
5. Restrict access to Aadhaar/APaar data and minimize what is stored.
6. Add CSRF/session protections and rate limits.
7. Add automated backups and restore testing.
8. Add school-specific data isolation if this becomes multi-school.
9. Add official J&K SCERT grading rules after confirming the current academic-year circular.
10. Deploy behind HTTPS and monitor errors.

## Useful commands

```bash
npm run dev
npm run typecheck
npm run build
npm run db:studio
npm run db:seed
```
