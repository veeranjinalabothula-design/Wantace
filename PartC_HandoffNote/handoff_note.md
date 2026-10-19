# Part C — Developer handoff

## Delivered

- Express API under `src/backend`, using MongoDB/Mongoose.
- React dashboard under `src/frontend`, served in development by Vite.
- Node's built-in tests under `src/tests`.
- Assignment documentation, illustrative process/data diagrams, and draft marketing content.

## Run locally

1. Install Node.js 18.18+ (20 LTS recommended), npm, and MongoDB.
2. From the repository root, run `npm install`.
3. Copy `src/backend/.env.example` to `src/backend/.env` and verify `MONGODB_URI`.
4. Run `npm run dev`; open <http://localhost:3000>.
5. Run `npm test` and `npm run build` to verify the code.

The API deliberately does not start if MongoDB cannot be reached. The frontend proxy routes `/api` and `/health` to port 5000.

## Main paths

- `src/backend/server.js`: API startup and JSON error handling.
- `src/backend/routes/orders.js`: order HTTP endpoints.
- `src/backend/lib/validateOrder.js`: input allowlist and validation.
- `src/backend/models/Order.js`: MongoDB schema.
- `src/frontend/src/components/Dashboard.jsx`: order list, status filter, and create form.

## Before production

- Add authentication and role-based authorization; restrict CORS/network access.
- Add status-change audit history, request rate limiting, CSRF strategy if cookie auth is added, and structured monitoring.
- Set up TLS, managed MongoDB, least-privilege database credentials, secret storage, backups, restore testing, and retention policy.
- Confirm units, currency, invoice linkage, return rules, and customer-data handling with the business.
- Add integration tests against a disposable database and accessibility/browser testing.
- Replace all sample copy/assets with approved company material and verify the actual deployed video URL.

## Limitations

- No login, authorization, deletion, pagination, search, or production deployment pipeline.
- No migration or seed data is included.
- The audit, business information, diagrams, marketing copy, and creative are illustrative assignment materials, not evidence of field research or approved public claims.
- `video_link.txt` is intentionally a placeholder until a real video has been created and hosted.
