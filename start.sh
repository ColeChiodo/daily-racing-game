#!/bin/bash

# Usage: ./start.sh [--reset-db] [--no-cache] [--init-db] [--prod]
# --reset-db: Reset database and remove all volumes
# --no-cache: Build all images without using Docker cache
# --init-db: Run database initialization (migrations)
# --prod: Start production environment (uses Supabase)

RESET_DB=false
NO_CACHE=false
INIT_DB=false
PROD_MODE=false
COMPOSE_FILE="docker-compose.dev.yml"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --reset-db)
            RESET_DB=true
            shift
            ;;
        --no-cache)
            NO_CACHE=true
            shift
            ;;
        --init-db)
            INIT_DB=true
            shift
            ;;
        --prod)
            PROD_MODE=true
            COMPOSE_FILE="docker-compose.prod.yml"
            shift
            ;;
        *)
            echo "Unknown option $1"
            echo "Usage: ./start.sh [--reset-db] [--no-cache] [--init-db] [--prod]"
            exit 1
            ;;
    esac
done

# Mode indicator
if [ "$PROD_MODE" = true ]; then
    echo "🚀 Starting PRODUCTION environment..."
    echo "⚠️  Make sure you have .env files configured for Supabase!"
else
    echo "🛠️  Starting DEVELOPMENT environment..."
fi

# Step 1: Stop and remove containers
if [ "$RESET_DB" = true ]; then
    echo "Resetting database and removing all containers..."
    docker compose -f "$COMPOSE_FILE" down -v --remove-orphans
else
    echo "Stopping containers..."
    docker compose -f "$COMPOSE_FILE" down --remove-orphans
fi

# Step 2: Build services
echo "Building all services..."
if [ "$NO_CACHE" = true ]; then
    echo "🧱 Building with --no-cache..."
    docker compose -f "$COMPOSE_FILE" build --no-cache
else
    docker compose -f "$COMPOSE_FILE" build
fi

# Step 3: Database handling
if [ "$PROD_MODE" = false ]; then
    # Development mode: local PostgreSQL
    echo "Starting local PostgreSQL database..."
    docker compose -f "$COMPOSE_FILE" up -d db

    echo "Waiting for database to be ready..."
    DB_CONTAINER=$(docker compose -f "$COMPOSE_FILE" ps -q db)
    until docker exec "$DB_CONTAINER" pg_isready -U admin >/dev/null 2>&1; do
        sleep 1
    done
    echo "Database is ready ✅"

    # Only run migrations if requested or reset
    if [ "$INIT_DB" = true ] || [ "$RESET_DB" = true ]; then
        echo "Running backend migrations..."
        docker compose -f "$COMPOSE_FILE" run --rm backend npm run migrate
    fi
else
    # Production mode
    if [ "$INIT_DB" = true ]; then
        echo "Running production migrations..."
        docker compose -f "$COMPOSE_FILE" run --rm backend npm run migrate
    fi
fi

# Step 4: Start all services
echo "Starting all services..."
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo "🎉 All services are up!"
if [ "$PROD_MODE" = false ]; then
    echo "📱 Frontend: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:3000"
    echo "🗄️  Database: localhost:5432"
else
    echo "📱 Frontend: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:3000"
    echo "🗄️  Database: Supabase"
fi
echo ""
echo "📋 View logs: docker compose -f $COMPOSE_FILE logs -f"
echo "🛑 Stop: docker compose -f $COMPOSE_FILE down"
