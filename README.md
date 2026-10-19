# Wantace Assignment — Vardhan Steelware

A sample order-management project containing an Express/MongoDB API, a React dashboard, and the requested assignment deliverables. Operational details in the written deliverables are illustrative placeholders: verify them with the business before presenting them as factual.

## Requirements

- Node.js 18.18+ (Node.js 20 LTS recommended) and npm 9+
- MongoDB 6+ running locally, or an accessible MongoDB connection string

## Setup

1. Install Node.js and MongoDB if they are not already installed.
2. From the project root, install all workspace dependencies:

   ```sh
   npm install
   ```

3. Copy `src/backend/.env.example` to `src/backend/.env`. Adjust `MONGODB_URI` if MongoDB is not running locally. The default is:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/vardhansteelware
   PORT=5000
   ```

4. Start the API and frontend together:

   ```sh
   npm run dev
   ```

   - Dashboard: <http://localhost:3000>
   - API: <http://localhost:5000/api/orders>
   - Health check: <http://localhost:5000/health>

The API waits for MongoDB before listening. If MongoDB is unavailable, it prints a startup error and exits rather than silently running without persistence.

## Other commands

```sh
npm test                 # order input validation tests
npm run build            # production frontend build
npm start                # start only the API (after configuring MongoDB)
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/orders` | List orders, newest first |
| `GET` | `/api/orders/:id` | Get one order |
| `POST` | `/api/orders` | Create an order |
| `PUT` | `/api/orders/:id` | Update supplied order fields |

Example request:

```json
{
  "party": "Northwind Traders",
  "item": "Stainless steel tumbler",
  "qty": 24,
  "unit": "pcs",
  "rate": 125.5,
  "status": "pending",
  "remarks": "Pack in cartons of 12"
}
```

Valid statuses: `pending`, `dispatched`, `hold`, `return`. Quantity must be greater than zero; rate must be non-negative. Invalid input receives a `400` JSON response. The frontend uses the Vite development proxy for `/api` and `/health`.

## Project structure

```text
PartA_Audit/               Audit, business context, and sample register
PartB_RequirementDoc/      Requirements and data/process diagrams
PartC_HandoffNote/         Implementation and deployment handoff
PartD_Content/             Draft social content and creative mock
PartE_VideoAndAINote/      Video-link placeholder and AI-use disclosure
src/backend/               Express API, Mongoose model, and validation
src/frontend/              React dashboard and Vite setup
src/tests/                 Node.js built-in test suite
```

## Assignment deliverables

- **Part A:** audit notes, sample process map, illustrative register image, and business information.
- **Part B:** requirements document, order data model, and process map.
- **Part C:** handoff, setup, verification, and known limitations.
- **Part D:** draft LinkedIn post, draft Meta ad, and illustrative creative mock.
- **Part E:** video-link placeholder and AI-use note.

Replace all illustrative business assumptions and the video placeholder with confirmed, authorized material before submission or publication. The images are illustrative diagrams/mockups, not evidence of an actual audit or product photography.
