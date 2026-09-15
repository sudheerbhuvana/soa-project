# HarborFlow Frontend

Next.js 14 dashboard for HarborFlow port operations. Uses shadcn-style
components (Radix UI primitives + Tailwind) for a clean ops-console feel.

## Setup

```bash
npm install
cp .env.local.example .env.local   # point at the API gateway
npm run dev
```

Open http://localhost:3000.

## Smart API client

`lib/api.ts` first tries the gateway configured via `NEXT_PUBLIC_API_BASE`.
If unreachable (backend not running), it transparently falls back to the
Next.js mock routes under `app/api/*`. The mock signs HS256 JWTs with the same
secret as the backend so the swap is seamless.

## Pages

- `/` — public landing with service registry table
- `/login` — operator sign-in / register
- `/docs` — public API reference with Swagger UI links per service
- `/dashboard` — authenticated overview
- `/dashboard/carriers` — CRUD
- `/dashboard/containers` — CRUD + status workflow
- `/dashboard/yard` — slot grid + place/release
- `/dashboard/gate` — transaction log
- `/dashboard/services` — service registry + Swagger links
