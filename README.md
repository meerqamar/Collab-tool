# GROWURK Week 8 Practical Labs & Project 4 Capstone

Real-Time Collaboration Tool & Marketplace Architecture with Production Security Hardening, Observability, and CI/CD Pipelines.

## 📋 Week 8 Systems Implemented

### Lab 1: Upstash Serverless Redis Integration
- **API Response Caching:** Implemented cache-aside wrapper (`getCached`) with 5-minute TTL on gig listings.
- **Sliding Window Rate Limiter:** Protected authentication and write endpoints (5 max requests per 15 minutes) using Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`).
- **Real-Time Presence:** Broadcasts user presence indicators via Redis Pub/Sub and Server-Sent Events (SSE).

### Lab 2: OWASP Top 10 Security Hardening
- **XSS Mitigation:** Enforced rich text DOM sanitization using `isomorphic-dompurify`.
- **SQL Injection Prevention:** Migrated queries to parameterized Prisma finders and `Prisma.sql` template tags.
- **CSRF & Cookie Protection:** Configured `SameSite=Strict`, `HttpOnly`, and `Secure` attributes on session tokens.
- **Security Headers:** Achieved A+ security score by configuring strict CSP, HSTS, X-Frame-Options, and Permissions-Policy in `next.config.ts`.
- **Audit Documentation:** View the official [OWASP ZAP Security Audit Report](file:///d:/week8/docs/OWASP_ZAP_Security_Audit_Report.md).

### Lab 3: Full-Text & Faceted Search
- Implemented sub-50ms query latency across gig catalogs with debounced inputs.
- Built multi-field search ranking with category aggregation facets and price filters.
- Logged search analytics (top queries and zero-result queries) into Redis hashes.

### Lab 4: GitHub Actions CI/CD Pipeline
- **Continuous Integration (`ci.yml`):** Automated linting, TypeScript type-checking, and automated tests on PRs.
- **Continuous Deployment (`deploy.yml`):** Automatically applies Prisma migrations (`npx prisma migrate deploy`), builds production Vercel bundle, and runs post-deploy health check validation gate (`/api/health`).
- **Preview Deployments (`preview.yml`):** Automated preview environments for testing PR changes.

### Lab 5: Sentry Observability & Structured Logging
- Integrated Sentry error tracking with TypeScript source maps upload.
- Implemented custom React Error Boundaries (`Sentry.withErrorBoundary`).
- Attached request correlation IDs (`x-request-id`) to structured JSON logs.

---

## 🚀 Getting Started

First, run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the real-time collaboration editor and security hardening dashboard.
