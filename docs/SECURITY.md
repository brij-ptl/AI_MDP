# Nidaan+ — Security Architecture

> Overview of security controls implemented in the platform.

---

## Table of Contents

- [Authentication Security](#authentication-security)
- [Authorization and RBAC](#authorization-and-rbac)
- [Password Security](#password-security)
- [Transport Security](#transport-security)
- [API Security](#api-security)
- [Input Validation](#input-validation)
- [File Upload Security](#file-upload-security)
- [Payment Security](#payment-security)
- [Cookie Security](#cookie-security)
- [CORS Policy](#cors-policy)
- [Rate Limiting](#rate-limiting)
- [Secrets Management](#secrets-management)
- [Production Hardening Checklist](#production-hardening-checklist)

---

## Authentication Security

### JWT Implementation

- Algorithm: **HS256** (HMAC-SHA256)
- Access token lifetime: **30 minutes**
- Refresh token lifetime: **7 days**
- Tokens are stored exclusively in **HttpOnly cookies**
- JavaScript cannot access `access_token` or `refresh_token` cookies, eliminating XSS-based token theft

### Cookie Security Flags

| Flag | Development | Production |
|---|---|---|
| `HttpOnly` | Yes | Yes |
| `Secure` | No (`COOKIE_SECURE=False`) | **Yes** (`COOKIE_SECURE=True`) |
| `SameSite` | `lax` | `lax` (or `none` for cross-origin) |

> `COOKIE_SECURE=True` must be set in production behind HTTPS. Without it, cookies will be sent over plain HTTP.

### Token Validation

Every protected endpoint calls `get_current_user()` which:
1. Reads token from cookie (or `Authorization: Bearer` header fallback)
2. Decodes JWT and verifies the signature against `JWT_SECRET_KEY`
3. Checks `"type" == "access"` claim (prevents refresh tokens being used as access tokens)
4. Queries the user from the database to verify the account is active
5. Returns `401 Unauthorized` if any check fails

---

## Authorization and RBAC

Two roles are implemented: `user` and `admin`.

### Enforcement

- **`get_current_user`** — validates authentication; all protected user endpoints use this
- **`get_current_admin`** — extends `get_current_user` and additionally checks `user.role == "admin"`; returns `403 Forbidden` otherwise

All admin routes (`/api/v1/admin/*` and `/api/v1/analytics/*`) use `get_current_admin`. There is no way for a regular user to access admin endpoints.

The frontend additionally enforces role separation in the admin layout (`admin/layout.tsx`), which redirects to `/dashboard` if the authenticated user's role is not `admin`. This is UI-layer defense-in-depth; the real enforcement is at the API level.

---

## Password Security

- Passwords are hashed using **bcrypt** (via `passlib[bcrypt]`)
- Raw passwords are never stored, logged, or returned in any API response
- The default bcrypt work factor provides adequate brute-force resistance
- Password reset uses a signed token with expiry (`password_reset_expires` column)
- `POST /users/me/change-password` requires the current password before setting a new one

---

## Transport Security

- All cookies are `HttpOnly` to prevent JavaScript access
- In production, `COOKIE_SECURE=True` ensures cookies are only sent over HTTPS
- HTTPS termination is handled by the reverse proxy (Nginx — Phase 6)
- The FastAPI application itself runs over plain HTTP internally; TLS is terminated at the proxy level

---

## API Security

### Rate Limiting

- **60 requests per minute** per IP address (configurable via `RATE_LIMIT_PER_MINUTE`)
- Returns `HTTP 429 Too Many Requests` on breach
- Implemented in `app/middleware/rate_limit.py`

**Limitation:** The current implementation is in-memory and does not share state across multiple uvicorn workers. For production multi-worker deployments, replace with a Redis-backed rate limiter.

### Error Response Sanitization

- All exceptions are handled by `app/core/exceptions.py`
- Internal Python tracebacks are never exposed in API responses
- Production error responses return only: `error_code`, `message`, and `details`
- `DEBUG=True` mode may expose additional context in development

---

## Input Validation

All request bodies and query parameters are validated using **Pydantic v2** schemas:

- Types, lengths, and constraints are enforced automatically
- Unknown fields are ignored (`extra="ignore"` on Settings)
- Email addresses in registration are validated via `EmailStr`
- Pydantic returns structured `422 Unprocessable Entity` responses for validation failures, not raw Python errors

---

## File Upload Security

File uploads (OCR endpoint) are validated for:

1. **File extension** — only `.pdf`, `.png`, `.jpg`, `.jpeg` are accepted
2. **File size** — maximum `MAX_UPLOAD_SIZE_MB` (default 10 MB)
3. Files are saved to `app/uploads/` as temporary storage
4. File contents are read into memory for processing; temporary files are not persisted permanently

**Known gap:** MIME type is not independently verified against the file header (magic bytes). Extension validation is the current check. For production hardening, add `python-magic` or similar to verify the actual file type.

---

## Payment Security

### Razorpay Signature Verification

After the user completes payment, `POST /payment/verify` receives:
- `razorpay_order_id`
- `razorpay_payment_id`
- `razorpay_signature`

The backend verifies:

```python
expected = hmac.new(
    key=RAZORPAY_KEY_SECRET.encode(),
    msg=f"{order_id}|{payment_id}".encode(),
    digestmod=hashlib.sha256
).hexdigest()
assert expected == razorpay_signature
```

A mismatch raises a `400 Bad Request`. Payment is never credited without signature verification.

### Webhook Security

The Razorpay webhook endpoint (`POST /payment/webhook`) verifies the `X-Razorpay-Signature` header using `RAZORPAY_WEBHOOK_SECRET`. Webhook events without a valid signature are rejected.

---

## CORS Policy

- Allowed origins are explicitly listed via `CORS_ORIGINS` env var
- `allow_credentials=True` is required for cookie-based auth
- Default development origins: `http://localhost:3000`, `http://127.0.0.1:3000`, `http://localhost:7000`, `http://127.0.0.1:7000`
- **In production:** narrow `CORS_ORIGINS` to your exact frontend domain only

A wildcard (`*`) origin must never be used with `allow_credentials=True` — this is correctly avoided in the implementation.

---

## Secrets Management

### Development

Secrets are stored in `backend/.env`. This file is listed in `.gitignore` and must never be committed to version control.

### Production Recommendations

- Use environment variables injected by your deployment platform (e.g. AWS Secrets Manager, GCP Secret Manager, Kubernetes secrets, Docker secrets)
- Never bake secrets into Docker images
- Rotate `JWT_SECRET_KEY` and Razorpay secrets regularly

### Secrets That Must Change Before Production

| Secret | Default | Risk if unchanged |
|---|---|---|
| `JWT_SECRET_KEY` | Weak hardcoded string | Anyone can forge JWT tokens |
| `RAZORPAY_KEY_SECRET` | Test key | Payments will not process |
| `RAZORPAY_WEBHOOK_SECRET` | `CHANGE_ME` | Webhooks cannot be verified |
| Admin password | `Admin@12345` | Public knowledge from seed.py |

---

## Rate Limiting

| Scenario | Limit | Code |
|---|---|---|
| Any API endpoint | 60 req/min per IP | 429 |
| Free predictions | 2 total | 402 |
| Free symptom checks | 2 total | 402 |

---

## Production Hardening Checklist

- [ ] `DEBUG=False`
- [ ] `APP_ENV=production`
- [ ] Strong, unique `JWT_SECRET_KEY` (64+ characters, cryptographically random)
- [ ] `COOKIE_SECURE=True`
- [ ] HTTPS via Nginx with valid SSL certificate
- [ ] `CORS_ORIGINS` narrowed to exact frontend domain
- [ ] Real Razorpay production keys configured
- [ ] `RAZORPAY_WEBHOOK_SECRET` set to a strong random value
- [ ] Admin password changed from `Admin@12345`
- [ ] `EMAIL_ENABLED=True` with real SMTP credentials
- [ ] Database switched from SQLite to MySQL/PostgreSQL
- [ ] Redis-backed rate limiting for multi-worker deployments
- [ ] File upload MIME type verification added
- [ ] Regular database backups configured
- [ ] Structured logging to a log aggregation service
- [ ] Health check endpoints connected to uptime monitoring
