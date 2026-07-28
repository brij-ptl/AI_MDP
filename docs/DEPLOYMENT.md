# Nidaan+ — Production Deployment Guide

> Step-by-step guide for deploying Nidaan+ to a production Linux server.
> Docker and Nginx configuration will be covered in separate phases.
> This guide covers manual server deployment.

---

## Table of Contents

- [System Requirements](#system-requirements)
- [Server Setup](#server-setup)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Tesseract Installation](#tesseract-installation)
- [Environment Configuration](#environment-configuration)
- [Razorpay Configuration](#razorpay-configuration)
- [Running in Production](#running-in-production)
- [Pre-Launch Checklist](#pre-launch-checklist)
- [Monitoring](#monitoring)

---

## System Requirements

### Minimum Recommended Server Specs

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 2 cores | 4 cores |
| RAM | 2 GB | 4 GB |
| Storage | 10 GB | 20 GB |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### Required Software

| Software | Version | Purpose |
|---|---|---|
| Python | 3.11 | Backend runtime |
| Node.js | 20 LTS | Frontend build |
| Tesseract-OCR | 5.x | OCR feature |
| MySQL or PostgreSQL | 8.0 / 15 | Production database |
| Nginx | Latest | Reverse proxy (Phase 6) |

---

## Server Setup

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Python 3.11
sudo apt-get install -y python3.11 python3.11-venv python3.11-dev

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install system dependencies
sudo apt-get install -y git build-essential tesseract-ocr tesseract-ocr-eng poppler-utils
```

---

## Database Setup

### MySQL (Recommended)

```bash
# Install MySQL
sudo apt-get install -y mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p <<EOF
CREATE DATABASE nidaan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nidaan'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON nidaan_db.* TO 'nidaan'@'localhost';
FLUSH PRIVILEGES;
EOF
```

Update your `.env`:
```
DATABASE_URL=mysql+pymysql://nidaan:STRONG_PASSWORD_HERE@localhost:3306/nidaan_db
```

Install the MySQL driver:
```bash
pip install pymysql
```

### PostgreSQL (Alternative)

```bash
sudo apt-get install -y postgresql postgresql-contrib

sudo -u postgres psql <<EOF
CREATE DATABASE nidaan_db;
CREATE USER nidaan WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE nidaan_db TO nidaan;
EOF
```

Update your `.env`:
```
DATABASE_URL=postgresql+psycopg2://nidaan:STRONG_PASSWORD_HERE@localhost:5432/nidaan_db
```

Install the PostgreSQL driver:
```bash
pip install psycopg2-binary
```

---

## Backend Deployment

```bash
# Clone repository
git clone https://github.com/your-org/AI_MDP.git /opt/nidaan
cd /opt/nidaan/backend

# Create virtual environment
python3.11 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install database driver (MySQL or PostgreSQL, see above)

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Train ML models
python -m app.ml.training.train_all

# Initialize database and seed
python -m app.database.seed
```

---

## Frontend Deployment

```bash
cd /opt/nidaan/frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# The built application is in .next/
# To serve: npm run start (listens on port 7000)
```

---

## Tesseract Installation

```bash
# Ubuntu/Debian (already covered in Server Setup)
sudo apt-get install -y tesseract-ocr tesseract-ocr-eng

# Verify installation
tesseract --version

# Tesseract is auto-detected in PATH; no .env configuration needed
# If installed in a custom path, set:
# TESSERACT_CMD=/custom/path/to/tesseract
```

---

## Environment Configuration

Edit `backend/.env` with the following production values:

```ini
# Application
APP_ENV=production
DEBUG=False
APP_NAME=Nidaan+ Healthcare Platform

# Database (replace with your actual connection string)
DATABASE_URL=mysql+pymysql://nidaan:PASSWORD@localhost:3306/nidaan_db

# Security - CRITICAL: generate with: python -c "import secrets; print(secrets.token_hex(64))"
JWT_SECRET_KEY=REPLACE_WITH_64_CHAR_RANDOM_STRING

# Cookies - must be True behind HTTPS
COOKIE_SECURE=True
COOKIE_SAMESITE=lax

# CORS - your actual frontend domain only
CORS_ORIGINS=["https://yourdomain.com"]

# Razorpay Production Keys
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Email
EMAIL_ENABLED=True
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=no-reply@yourdomain.com

# Rate limiting
RATE_LIMIT_PER_MINUTE=60
```

---

## Razorpay Configuration

1. Create a [Razorpay account](https://dashboard.razorpay.com)
2. In Razorpay Dashboard → Settings → API Keys, generate live keys
3. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`
4. In Razorpay Dashboard → Webhooks, create a webhook:
   - URL: `https://yourdomain.com/api/v1/payment/webhook`
   - Events: `payment.captured`, `payment.failed`
   - Secret: set a strong random string, copy to `RAZORPAY_WEBHOOK_SECRET` in `.env`

---

## Running in Production

### Backend (using systemd)

Create `/etc/systemd/system/nidaan-backend.service`:

```ini
[Unit]
Description=Nidaan+ FastAPI Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/nidaan/backend
Environment="PATH=/opt/nidaan/backend/.venv/bin"
ExecStart=/opt/nidaan/backend/.venv/bin/uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 4 \
    --no-access-log
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable nidaan-backend
sudo systemctl start nidaan-backend
sudo systemctl status nidaan-backend
```

### Frontend (using systemd)

Create `/etc/systemd/system/nidaan-frontend.service`:

```ini
[Unit]
Description=Nidaan+ Next.js Frontend
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/nidaan/frontend
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable nidaan-frontend
sudo systemctl start nidaan-frontend
```

---

## Pre-Launch Checklist

### Security
- [ ] `DEBUG=False`
- [ ] `APP_ENV=production`
- [ ] Strong `JWT_SECRET_KEY` (64+ chars, cryptographically random)
- [ ] `COOKIE_SECURE=True`
- [ ] `CORS_ORIGINS` set to your exact frontend domain only
- [ ] Admin password changed from `Admin@12345`

### Infrastructure
- [ ] MySQL or PostgreSQL configured (not SQLite)
- [ ] Database backup scheduled
- [ ] Tesseract installed and verified (`tesseract --version`)
- [ ] Poppler installed for scanned PDF support
- [ ] All 16 ML models trained and present in `trained_models/`

### Payments
- [ ] Razorpay production keys configured
- [ ] Razorpay webhook URL configured and secret set
- [ ] Test payment completed in production environment

### Email
- [ ] SMTP credentials configured
- [ ] `EMAIL_ENABLED=True`
- [ ] Test email verified

### Networking
- [ ] Backend accessible on port 8000
- [ ] Frontend accessible on port 7000
- [ ] Nginx reverse proxy configured (Phase 6)
- [ ] SSL certificate installed

---

## Monitoring

### Log Files

Backend logs are written to stdout (captured by systemd journald):

```bash
sudo journalctl -u nidaan-backend -f
```

### Health Check Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /` | Basic API status check |
| `GET /health` | Liveness check — returns `{ "status": "healthy" }` |

Configure your uptime monitoring service (UptimeRobot, Pingdom, etc.) to poll `GET /health` every 60 seconds.

### Database Backup

```bash
# MySQL backup cron (daily at 2 AM)
0 2 * * * mysqldump -u nidaan -pPASSWORD nidaan_db > /backups/nidaan_$(date +%F).sql
```
