# Home Library Service

> **⚠️ ВАЖНО**: Если при запуске Docker возникает ошибка `password authentication failed for user "postgres"`,
> используйте автоматическое исправление: `.\fix-postgres-clean.ps1` или смотрите [POSTGRES_QUICK_FIX.md](POSTGRES_QUICK_FIX.md)

## Description

Users can create, read, update, delete data about Artists, Tracks and Albums, add them to Favorites in their own Home Library!

## Technologies

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript and JavaScript
- **PostgreSQL** - Powerful, open source object-relational database
- **Docker** - Containerization platform

## Prerequisites

- Docker Desktop installed and running
- Docker Compose version 3.8+
- Node.js 22+ (for local development)

## Running with Docker (Recommended)

### 1. Clone the repository
```bash
git clone <repository-url>
cd nodejs2025Q2-service
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and adjust if needed:
```bash
cp .env.example .env
```

### 3. Build and start containers
```bash
docker-compose up -d
```

This command will:
- Download the application image from Docker Hub (`sergurr/home-library-app:latest`)
- Pull PostgreSQL image (`postgres:16-alpine`)
- Create a custom network
- Start both containers
- Wait for PostgreSQL to be healthy before starting the app

### 4. Access the application
The application will be available at: `http://localhost:4000`

### 5. View logs
```bash
# View app logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres
```

### 6. Stop containers
```bash
docker-compose down
```

To stop and remove volumes (database data):
```bash
docker-compose down -v
```

### 7. Rebuild after code changes
```bash
docker-compose up -d --build
```

## Running locally (without Docker)

### 1. Install dependencies
```bash
npm install
```

### 2. Start PostgreSQL
You need a running PostgreSQL instance. Update `.env` with your database credentials.

### 3. Start the application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Testing

```bash
# Run all tests
npm test

# Run tests with auth
npm run test:auth

# Run refresh token tests
npm run test:refresh
```

## Docker Images

The application images are published on Docker Hub and ready for use:

### Application Image
- **Repository:** https://hub.docker.com/r/sergurr/home-library-app
- **Latest version:** `sergurr/home-library-app:latest`
- **Version 1.0.0:** `sergurr/home-library-app:1.0.0`
- **Size:** ~384 MB
- **Platform:** linux/amd64

### Database Image
- **Official PostgreSQL:** `postgres:16-alpine`
- **Repository:** https://hub.docker.com/_/postgres
- **Size:** ~395 MB

### Quick Start with Docker Hub Images

The `docker-compose.yml` is already configured to use published images from Docker Hub:

```bash
# Clone repository
git clone <repository-url>
cd nodejs2025Q2-service

# Start containers (images will be downloaded automatically)
docker-compose up -d

# Check status
docker-compose ps

# Test API
curl http://localhost:4000
```

### Manual Image Management

```bash
# Pull images manually
docker pull sergurr/home-library-app:latest
docker pull postgres:16-alpine

# View local images
docker images sergurr/home-library-app

# Run container manually
docker run -p 4000:4000 sergurr/home-library-app:latest
```

### Publishing Updates

To publish new versions of the application image:

```bash
# Build new image
docker build -t sergurr/home-library-app:latest .

# Tag with version
docker tag sergurr/home-library-app:latest sergurr/home-library-app:1.1.0

# Push to Docker Hub
docker push sergurr/home-library-app:latest
docker push sergurr/home-library-app:1.1.0
```

## API Documentation

API documentation is available in `doc/api.yaml` (OpenAPI 3.0 format).

Main endpoints:
- `POST /signup` - Register a new user
- `POST /login` - Login and get JWT token
- `GET /users` - Get all users
- `GET /artists` - Get all artists
- `GET /albums` - Get all albums
- `GET /tracks` - Get all tracks
- `GET /favs` - Get favorites

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Application port | 4000 |
| POSTGRES_HOST | PostgreSQL host | postgres |
| POSTGRES_PORT | PostgreSQL port | 5432 |
| POSTGRES_USER | PostgreSQL user | postgres |
| POSTGRES_PASSWORD | PostgreSQL password | postgres |
| POSTGRES_DB | PostgreSQL database name | home_library |
| CRYPT_SALT | Bcrypt salt rounds | 10 |
| JWT_SECRET_KEY | JWT secret key | - |
| JWT_SECRET_REFRESH_KEY | JWT refresh secret | - |
| TOKEN_EXPIRE_TIME | Access token expiration | 1h |
| TOKEN_REFRESH_EXPIRE_TIME | Refresh token expiration | 24h |

## Project Structure

```
src/
├── user/           # User management
├── artist/         # Artist management
├── album/          # Album management
├── track/          # Track management
├── favorites/      # Favorites management
└── app.module.ts   # Main application module
```

## Database Schema

The application uses PostgreSQL with TypeORM. Tables are created automatically on first run (synchronize: true in development).

Tables:
- `users` - User accounts
- `artists` - Music artists
- `albums` - Music albums
- `tracks` - Music tracks
- `favorite_artists` - Favorite artists
- `favorite_albums` - Favorite albums
- `favorite_tracks` - Favorite tracks
