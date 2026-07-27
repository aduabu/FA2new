# FrontAccounting Enterprise Platform — 1-Minute Quickstart

Get the ERP application running locally in **1 minute**:

```bash
# 1. Clone the repository
git clone https://github.com/aduabu/FA2new.git
cd FA2new

# 2. Launch the entire application stack
docker-compose up --build -d

# 3. Open your browser
# Web UI: http://localhost:3000
# Login: admin / password123
```

Done! All services (MySQL, Redis, PHP API Gateway, and React SPA) will start automatically and seed demo data.
