# Docker Compose Setup

This project now supports separate development and production environments using different Docker Compose files.

## Files Created

- `docker-compose.dev.yml` - Development environment with local PostgreSQL
- `docker-compose.prod.yml` - Production environment using Supabase
- `docker-compose.override.yml` - Development overrides (auto-loaded)

## Development Setup

1. **Create environment files:**

   **Backend (.env):**
   ```bash
   # Database Configuration (Local PostgreSQL)
   DB_USER=admin
   DB_HOST=db
   DB_NAME=testdb
   DB_PASSWORD=admin
   DB_PORT=5432
   DB_SSL=false
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # JWT Secret
   JWT_SECRET=your-jwt-secret-here
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   **Frontend (.env):**
   ```bash
   VITE_API_URL=http://localhost:3000
   ```

2. **Run development environment:**
   ```bash
   # Uses docker-compose.dev.yml + docker-compose.override.yml
   docker-compose -f docker-compose.dev.yml up --build
   
   # Or just (will auto-load override file)
   docker-compose up --build
   ```

## Production Setup

1. **Create production environment files:**

   **Backend (.env.prod):**
   ```bash
   # Database Configuration (Supabase)
   DB_USER=your-supabase-user
   DB_HOST=your-supabase-host.supabase.co
   DB_NAME=postgres
   DB_PASSWORD=your-supabase-password
   DB_PORT=5432
   DB_SSL=true
   
   # Server Configuration
   PORT=3000
   NODE_ENV=production
   
   # JWT Secret (use a secure secret)
   JWT_SECRET=your-secure-jwt-secret
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   **Frontend (.env.prod):**
   ```bash
   VITE_API_URL=https://your-production-api.com
   ```

2. **Run production environment:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

## Key Differences

### Development
- Local PostgreSQL database container
- Hot reloading with volume mounts
- Debug logging enabled
- Development-optimized builds

### Production
- No local database (connects to Supabase)
- Optimized production builds
- No volume mounts for security
- Production logging

## Commands

```bash
# Development
docker-compose up --build                    # Uses dev + override
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose -f docker-compose.prod.yml up --build

# Stop services
docker-compose down
docker-compose -f docker-compose.prod.yml down
```
