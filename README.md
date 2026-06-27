# Synapse Studio — Real-Time Collaborative Architecture & Cloud Marketplace

A production-ready Next.js 16 (Turbopack) enterprise platform featuring real-time collaborative document editing, sub-50ms faceted search, cloud-native PostgreSQL data persistence, Upstash serverless Redis caching, strict OWASP security hardening, automated CI/CD deployment pipelines, and full-stack Sentry observability.

---

## ⚡ Key Architectural Highlights

### 🛡️ Production Security Hardening (OWASP Top 10)
- **XSS Prevention:** Strict rich-text DOM sanitization using `isomorphic-dompurify`.
- **SQL Injection Defense:** Fully parameterized queries via Prisma ORM (`findMany`, `upsert`, and typed raw SQL queries).
- **Session & Cookie Protection:** Session tokens hardened with `SameSite=Strict`, `HttpOnly`, and `Secure` cookie attributes.
- **A+ Security Headers:** Configured strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options, and Permissions-Policy in `next.config.ts`.
- **Audit Compliance:** Documented verified security test results in the [OWASP ZAP Audit Report](file:///d:/week8/docs/OWASP_ZAP_Security_Audit_Report.md).

### 🚀 High-Performance Cloud Database & Caching
- **Supabase PostgreSQL:** Cloud-native transactional connection pooling (`DATABASE_URL` on port 6543) coupled with direct session routing (`DIRECT_URL` on port 5432) for zero-downtime Prisma schema migrations.
- **Resilient Fallback Rendering:** Server Components implement resilient `try...catch` query fallbacks guaranteeing seamless user experience even during transient connectivity timeouts.
- **Upstash Serverless Redis:**
  - **API Caching:** Cache-aside pattern wrappers (`getCached`) with a 5-minute TTL on marketplace catalogs.
  - **Sliding-Window Rate Limiting:** Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`) restricting sensitive endpoints to 5 requests per 15 minutes.
  - **Live Presence Tracking:** Real-time presence indicators via Server-Sent Events (SSE) and Redis Pub/Sub.

### 🔍 Sub-50ms Full-Text & Faceted Search
- Multi-field ranking and debounced query execution across enterprise product catalogs.
- Instantaneous category aggregation filtering and responsive glassmorphic UI cards.

### 📈 Full-Stack Observability & CI/CD
- **Sentry Telemetry:** Real-time exception capture, React component error boundaries, source map integration, and distributed trace ID headers (`x-request-id`).
- **Automated CI/CD Workflows (`.github/workflows`):**
  - **Continuous Integration (`ci.yml`):** Automated TypeScript compilation and ESLint verification on pull requests.
  - **Continuous Deployment (`deploy.yml`):** Automatic cloud migration push (`npx prisma db push`), Vercel production deployment, and post-deployment HTTP 200 health check validation gates (`/api/health`).

---

## 💻 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Server Components)
- **Language:** TypeScript 5
- **ORM & Database:** Prisma Client 5 + Supabase PostgreSQL
- **Caching & Rate Limiting:** Upstash Redis Serverless
- **Styling & UI:** Tailwind CSS 4, Lucide React Icons, Glassmorphism Design System
- **Monitoring & Observability:** Sentry Next.js SDK

---

## 🛠️ Getting Started Locally

1. **Clone & Install Dependencies:**
   ```powershell
   git clone https://github.com/meerqamar/Collab-tool.git
   cd Collab-tool
   npm install
   ```

2. **Configure Environment Variables (`.env.local`):**
   ```env
   DATABASE_URL="postgresql://postgres.[user]:[password]@aws-0-pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[user]:[password]@aws-0-pooler.supabase.com:5432/postgres"
   UPSTASH_REDIS_REST_URL="https://[endpoint].upstash.io"
   UPSTASH_REDIS_REST_TOKEN="[your-redis-token]"
   SENTRY_DSN="https://[your-sentry-dsn]"
   ```

3. **Sync Database & Populate Seed Data:**
   ```powershell
   npx prisma db push
   npx prisma db seed
   ```

4. **Launch Development Server:**
   ```powershell
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to experience the live platform!
