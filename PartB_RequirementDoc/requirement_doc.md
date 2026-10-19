# Part B — Order tracking requirements

## 1. Purpose

Provide a lightweight internal dashboard for recording customer orders and reviewing or updating their operational status. This is a starter implementation for a local demo, not a production-ready multi-user business system.

## 2. Users and goals

| User | Goal |
| --- | --- |
| Order desk staff | Record a complete order once and find it later |
| Dispatch staff | See pending work and update the order status |
| Supervisor | Review the overall order queue and identify holds |

## 3. Scope

### Included

- Create an order with party, item, quantity, unit, rate, and optional remarks.
- List orders with newest entries first.
- Filter the dashboard by status.
- Update order status from the register.
- Validate required fields and show API errors.
- Persist records in MongoDB.

### Not included

- Authentication, role management, audit history, invoicing, payments, inventory, customer notifications, file uploads, reporting exports, or deployment configuration.
- No real customer information should be entered into this demo without a privacy/security review.

## 4. Functional requirements

1. The API shall create an order only when party, item, quantity, unit, and rate are valid.
2. Quantity shall be a finite number greater than zero; rate shall be finite and non-negative.
3. Status shall be one of `pending`, `dispatched`, `hold`, or `return`; new orders default to `pending`.
4. The API shall return all orders sorted by creation date, newest first.
5. Staff shall be able to update one or more allowed order fields; clients shall not overwrite system-managed IDs or timestamps.
6. The dashboard shall show loading, empty, and error states and allow filtering by status.
7. Invalid IDs shall return `400`; missing orders shall return `404`; unexpected storage errors shall return a non-success response.

## 5. Data model

| Field | Type | Required | Constraints / notes |
| --- | --- | --- | --- |
| `_id` | MongoDB ObjectId | Yes (generated) | System-managed primary key |
| `party` | String | Yes | Trimmed; 1–120 characters |
| `item` | String | Yes | Trimmed; 1–120 characters |
| `qty` | Number | Yes | Greater than zero |
| `unit` | String | Yes | Trimmed; 1–20 characters (e.g. pcs, kg) |
| `rate` | Number | Yes | Non-negative; currency is not assumed |
| `status` | Enum string | Yes | pending / dispatched / hold / return |
| `remarks` | String | No | Up to 500 characters; defaults to empty |
| `createdAt` | Date | Yes | Set automatically |
| `updatedAt` | Date | Yes | Set automatically |

The data model diagram is in [data_model.png](./data_model.png).

## 6. API contract

| Method and path | Success | Validation / not found |
| --- | --- | --- |
| `GET /api/orders` | `200` and array | `500` on storage failure |
| `GET /api/orders/:id` | `200` and order | `400` invalid ID; `404` missing |
| `POST /api/orders` | `201` and created order | `400` invalid body; `500` unexpected failure |
| `PUT /api/orders/:id` | `200` and updated order | `400` invalid ID/body; `404` missing |
| `GET /health` | `200` when API is listening | Does not assert database health |

## 7. Quality and operational requirements

- Use server-side validation; the browser is not a trust boundary.
- Do not log submitted order content or customer data.
- Keep the MongoDB URI in an environment file excluded from version control.
- Configure database access controls, TLS, backups, authentication, and monitoring before any production deployment.
- Support a narrow responsive layout and accessible form labels.

## 8. Acceptance checks

- `npm test` passes all order-validation tests.
- `npm run build` produces the frontend bundle.
- With MongoDB available and configured, `npm run dev` serves the app at port 3000 and API at port 5000.
- A valid order appears in the register after creation; invalid values produce a visible error and are not persisted.
- Updating a status changes its displayed badge and summary count.

## 9. Assumptions / open decisions

- A single trusted local operator is assumed for the prototype; no authentication is implemented.
- Currency, tax rules, unit catalogue, order numbering, retention, and return workflow need stakeholder decisions.
- The starter model does not keep status-change history. Add immutable event/audit records before using the system for regulated or financially consequential operations.
