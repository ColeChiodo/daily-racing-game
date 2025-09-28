#!/bin/bash

# Usage: ./start.sh [--reset-db]

RESET_DB=false

# Check for reset flag
if [ "$1" == "--v" ]; then
    RESET_DB=true
fi

echo "Starting project..."

# Step 1: Stop and remove existing containers
if [ "$RESET_DB" = true ]; then
    echo "Resetting database and removing all containers..."
    docker compose down -v --remove-orphans  # Stops containers, removes volumes & orphans
else
    echo "Stopping containers..."
    docker compose down --remove-orphans      # Stops containers but keeps volumes
fi

# Step 2: Build all services from scratch
echo "Building all services..."
docker compose build --no-cache

# Step 3: Start DB first
echo "Starting database..."
docker compose up -d db

# Wait for DB to be ready
echo "Waiting for database to be ready..."
# Adjust container name if needed
DB_CONTAINER=$(docker compose ps -q db)
until docker exec "$DB_CONTAINER" pg_isready -U admin >/dev/null 2>&1; do
    sleep 1
done
echo "Database is ready ✅"

# Step 4: Run migrations
echo "Running backend migrations..."
docker compose run --rm backend npm run migrate

# Step 5: Start backend and frontend
echo "Starting backend and frontend..."
docker compose up -d backend frontend

echo "All services are up! 🎉"
