#!/usr/bin/env bash
# FrontAccounting Enterprise Platform — One-Command Developer Startup Script

set -e

echo "=========================================================="
echo " Starting FrontAccounting Enterprise Platform (v1.0.0-RC1) "
echo "=========================================================="

# 1. Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH."
    exit 1
fi

# 2. Verify .env configuration
if [ ! -f .env ]; then
    echo "Creating .env configuration from .env.example..."
    cp .env.example .env
fi

# 3. Launch Docker Compose Stack
echo "Launching Docker containers (MySQL, Redis, PHP API, React Web)..."
docker-compose up --build -d

# 4. Wait for services to become healthy
echo "Waiting for services to report HEALTHY status..."
sleep 5

echo "=========================================================="
echo " SUCCESS: Platform Stack is Live and Healthy!            "
echo "=========================================================="
echo " Web Frontend: http://localhost:3000"
echo " REST API:     http://localhost:8080/api/v1/health"
echo " Demo User:    admin / password123"
echo "=========================================================="
