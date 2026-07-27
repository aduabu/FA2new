# FrontAccounting Enterprise Platform — Localhost Developer Setup Guide

This guide provides instructions for launching, configuring, and testing the entire FrontAccounting ERP Platform (`v1.0.0-RC1`) in a local development environment.

---

## 1. Prerequisites

Make sure the following tools are installed on your machine:
- **Docker Desktop** (v24.0+) with Docker Compose enabled
- **Node.js** (v18+ or v20+) & `npm`
- **Git**

---

## 2. One-Command Rapid Startup

To launch the complete application stack (MySQL, Redis, PHP API Gateway, and React SPA):

### On Linux / macOS / Bash:
```bash
./scripts/start-dev.sh
```

### On Windows PowerShell:
```powershell
.\scripts\start-dev.ps1
```

### Alternatively via Docker Compose directly:
```bash
docker-compose up --build -d
```

---

## 3. Container Services & Local Ports

| Service | Container Name | Local Host URL / Port | Purpose |
|---|---|---|---|
| **React 19 SPA** | `fa-enterprise-web` | [http://localhost:3000](http://localhost:3000) | Vite + TypeScript Frontend UI |
| **PHP REST API Gateway** | `fa-enterprise-api` | [http://localhost:8080](http://localhost:8080) | PHP 8.2 Apache Gateway Router |
| **MySQL 8.0 Database** | `fa-enterprise-mysql` | `localhost:3306` | InnoDB Database (`0_` Table Prefix) |
| **Redis 7 Cache** | `fa-enterprise-redis` | `localhost:6379` | Cache & Background Worker Queues |

---

## 4. Demo Login Credentials

Use these credentials to log in to the application at `http://localhost:3000`:

| Username | Password | Role | Permissions |
|---|---|---|---|
| `admin` | `password123` | System Administrator | Full Enterprise System Access |
| `demouser` | `password123` | Financial Controller | Accounting, Transactions & Reporting |

---

## 5. Health Check Endpoints

Verify that all services are healthy by fetching these endpoints:

- **API Health Check**: `http://localhost:8080/api/v1/health`
- **OpenAPI 3.0 Specs**: `http://localhost:8080/api/v1/system/openapi.json`
- **Trial Balance API**: `http://localhost:8080/api/v1/reports/trial-balance`
- **Platform Health**: `http://localhost:8080/api/v1/admin/platform-health`

---

## 6. Database Reset & Re-seeding

If you need to reset the local database back to fresh demo seed state:

```bash
docker-compose exec mysql mysql -ufa_user -pfa_password frontacct < docker/init_demo_db.sql
```

---

## 7. Stopping Services

To stop all running services:

```bash
docker-compose down
```
