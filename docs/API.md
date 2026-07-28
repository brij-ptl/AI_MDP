# Nidaan+ — API Reference

> Complete reference for all backend API endpoints.
> Base URL: `http://localhost:8000/api/v1`
> Interactive docs: `/api/docs` (Swagger UI) | `/api/redoc` (ReDoc)

---

## Authentication

All protected endpoints require a valid JWT access token delivered as an **HttpOnly cookie** (`access_token`). The frontend must send requests with `credentials: "include"`. A `Bearer` token in the `Authorization` header is also accepted as a fallback.

### Response Format

**Success:**
```json
{ "success": true, "message": "...", "data": { ... } }
```

**Error:**
```json
{ "success": false, "error_code": "UNAUTHORIZED", "message": "...", "details": {} }
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 401 | Unauthorized (no or invalid token) |
| 402 | Payment Required (prediction quota exhausted) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (e.g. email already registered) |
| 422 | Validation Error |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

---

## Auth Endpoints

**Prefix:** `/auth`

### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200` — Sets `access_token` and `refresh_token` cookies.
```json
{
  "success": true,
  "message": "Registration successful.",
  "user": {
    "id": "uuid",
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "is_email_verified": false
  }
}
```

---

### POST /auth/login

Authenticate a user.

**Request:**
```json
{ "email": "jane@example.com", "password": "SecurePass123!" }
```

**Response:** `200` — Sets `access_token` and `refresh_token` cookies.

---

### POST /auth/logout

Clear authentication cookies. No request body needed.

**Response:** `200`

---

### GET /auth/me

Get the currently authenticated user.

**Auth:** Required

**Response:**
```json
{
  "id": "uuid",
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user",
  "is_email_verified": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### POST /auth/forgot-password

Request a password reset link.

**Request:** `{ "email": "jane@example.com" }`

**Response:** `200` — Always returns success (to prevent email enumeration)

---

### POST /auth/reset-password

Reset password using a reset token.

**Request:** `{ "token": "...", "new_password": "NewPass123!" }`

---

### POST /auth/refresh

Refresh the access token using the refresh cookie. No body needed.

---

## User Endpoints

**Prefix:** `/users` | **Auth:** Required

### GET /users/me

Get current user profile.

### PUT /users/me

Update name and/or phone number.

**Request:** `{ "full_name": "Jane Smith", "phone": "+91 9999999999" }`

---

### POST /users/me/change-password

**Request:** `{ "current_password": "...", "new_password": "..." }`

---

### GET /users/me/medical-profile

Fetch the user's medical profile (age, gender, blood group, height, weight, lifestyle data).

**Response:** `200` or `404` if not yet created.

---

### PUT /users/me/medical-profile

Save or update medical profile.

**Request:**
```json
{
  "age": 35,
  "gender": "female",
  "blood_group": "B+",
  "height_cm": 162.0,
  "weight_kg": 65.0,
  "smoking": "never",
  "alcohol": "occasional",
  "physical_activity": "moderate",
  "family_history": "Diabetes",
  "existing_conditions": "None"
}
```

---

### POST /users/me/feedback

Submit feedback on a prediction.

**Request:** `{ "prediction_id": "uuid", "rating": 4, "comment": "Useful!", "category": "prediction" }`

---

## Dashboard Endpoints

**Prefix:** `/dashboard` | **Auth:** Required

### GET /dashboard/overview

Returns the user's dashboard summary: prediction token balance, subscription plan, recent activity counts.

---

## Disease Prediction Endpoints

**Prefix:** `/prediction` | **Auth:** Required (except disease catalogue)

### GET /prediction/diseases

Public catalogue of all 16 disease modules. Returns name, slug, category, icon, short description, feature schema.

---

### GET /prediction/diseases/{slug}

Full details for a specific disease module including feature schema and model metadata.

---

### POST /prediction/{slug}

Run a prediction for the specified disease.

**Request:** Dynamic based on disease feature schema. Example for `heart`:
```json
{
  "age": 55,
  "sex": 1,
  "cp": 2,
  "trestbps": 130,
  "chol": 250,
  "fbs": 0,
  "restecg": 1,
  "thalach": 160,
  "exang": 0,
  "oldpeak": 1.5,
  "slope": 2,
  "ca": 0,
  "thal": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prediction complete.",
  "data": {
    "id": "uuid",
    "disease_slug": "heart",
    "risk_level": "Moderate",
    "probability": 0.62,
    "explanation": "...",
    "top_risk_factors": [...],
    "recommendations": [...],
    "warnings": [...],
    "created_at": "..."
  }
}
```

> Returns `402` if prediction quota is exhausted.

---

### GET /prediction/history/list

List the user's prediction history.

**Query params:** `disease` (optional slug), `limit` (default 50), `offset` (default 0)

---

### GET /prediction/{prediction_id}/detail

Get full details of a specific prediction.

---

## AI Symptom Checker Endpoints

**Prefix:** `/symptom-checker` | **Auth:** Required

### POST /symptom-checker/analyze

Analyze free-text symptoms.

**Request:** `{ "text": "I have been experiencing chest pain and shortness of breath for 3 days" }`

**Response:** Possible conditions, risk indicators, and recommendations.

> Returns `402` if symptom check quota is exhausted.

---

## OCR Upload Endpoints

**Prefix:** `/ocr` | **Auth:** Required

### POST /ocr/upload

Upload a medical lab report for OCR extraction.

**Request:** `multipart/form-data`
- `file`: PDF, PNG, JPG, or JPEG (max 10 MB)
- `disease` (optional): Disease slug to filter parameter extraction (e.g. `"diabetes"`)

**Response:**
```json
{
  "success": true,
  "message": "Document processed. Please review the extracted values before predicting.",
  "data": {
    "raw_text": "...",
    "parameters": { "glucose": 126.0, "bmi": 28.5 },
    "notes": ["Could not find 'insulin' in the document; please enter it manually."]
  }
}
```

---

## Reports Endpoints

**Prefix:** `/reports` | **Auth:** Required

### POST /reports/generate/{prediction_id}

Generate a PDF clinical report for a prediction.

**Response:** Report metadata including download URL.

---

### GET /reports/

List all generated reports for the current user.

---

### GET /reports/{report_id}/download

Download a PDF report. Returns the file directly (`application/pdf`).

---

## History Endpoints

**Prefix:** `/history` | **Auth:** Required

### GET /history/

Returns the user's full prediction and symptom-check history.

---

## Notification Endpoints

**Prefix:** `/notifications` | **Auth:** Required

### GET /notifications/

List all notifications for the current user.

---

### POST /notifications/{id}/read

Mark a notification as read.

---

## Subscription Endpoints

**Prefix:** `/subscription` | **Auth:** Required

### GET /subscription/me

Get the current user's subscription status, plan, expiry date, and prediction token balance.

---

## Payment Endpoints

**Prefix:** `/payment` | **Auth:** Required

### POST /payment/create-order

Create a Razorpay payment order for a subscription plan.

**Request:** `{ "plan": "starter" }` — Plans: `starter`, `care_plus`, `family`, `annual`

**Response:** Razorpay order ID, amount, currency, and Razorpay key ID.

---

### POST /payment/verify

Verify a Razorpay payment after checkout completion.

**Request:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_string"
}
```

---

### GET /payment/history

List all payments made by the current user.

---

### POST /payment/webhook

Razorpay webhook endpoint. Validates `X-Razorpay-Signature` header. Not included in Swagger schema.

---

## Admin Endpoints

**Prefix:** `/admin` | **Auth:** Admin role required

### GET /admin/users

List all users with pagination.

**Query params:** `limit` (default 50), `offset` (default 0)

---

### POST /admin/users/{user_id}/suspend

Suspend a user account.

---

### POST /admin/users/{user_id}/reactivate

Reactivate a suspended user account.

---

### GET /admin/prediction-tokens

Search users for token management.

**Query params:** `query` (optional search string), `limit`

---

### POST /admin/prediction-tokens/{user_id}

Modify a user's prediction token balance.

**Request:**
```json
{
  "operation": "add",
  "amount": 10,
  "reason": "Manual grant for support case"
}
```

Operations: `add`, `remove`, `set`, `reset`

---

### GET /admin/prediction-tokens/{user_id}/history

View token modification history for a user.

---

### GET /admin/diseases

List all 16 disease modules with their status.

---

### POST /admin/diseases/{slug}/disable

Disable a disease module for all users.

---

### POST /admin/diseases/{slug}/enable

Re-enable a disease module.

---

### GET /admin/models/accuracy-reports

Fetch model accuracy metrics for all 16 disease modules.

---

### GET /admin/payments

List all platform payment transactions.

---

### GET /admin/feedback

List user feedback submissions.

**Query params:** `status` (optional filter)

---

### POST /admin/feedback/{feedback_id}/status

Update the moderation status of a feedback entry.

---

### GET /admin/logs

View admin action audit log.

**Query params:** `limit` (default 100)

---

### GET /analytics/platform

Platform-wide analytics. Returns total users, predictions, revenue, active subscriptions.

---

## Health Endpoints

### GET /

Root health check. Returns API status and docs URL.

### GET /health

Liveness check. Returns `{ "status": "healthy" }`.
