# Home Library Service

## Description

Users can create, read, update, delete data about Artists, Tracks and Albums, add them to Favorites in their own Home Library!

## Technologies

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript and JavaScript with migrations support
- **PostgreSQL** - Powerful, open source object-relational database
- **Docker** - Containerization platform

## Recent Updates (December 2025)

- ✅ **Migrations**: TypeORM migrations automatically run on container startup
- ✅ **Hot Reload**: Application automatically restarts on file changes in `src/` directory
- ✅ **Security**: Added `npm audit` script for vulnerability scanning
- ✅ **Docker**: Builds from source instead of pulling old Docker Hub images
- ✅ **Environment**: All hardcoded values replaced with environment variables
- ✅ **Async/Await**: All controllers properly await database operations
- ✅ **Database Dockerfile**: Custom PostgreSQL Dockerfile for database service
- ✅ **Auto-sync Disabled**: Using migrations instead of `synchronize: true`

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
docker-compose up --build -d
```

This command will:
- Build the application image from source code
- Build PostgreSQL image from custom Dockerfile
- Create a custom network
- Start both containers
- Wait for PostgreSQL to be healthy before starting the app
- **Automatically run database migrations on startup**

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

**Note**: Migrations run automatically on container startup, so you don't need to run them manually.

## Running locally (without Docker)

### 1. Install dependencies
```bash
npm install
```

### 2. Start PostgreSQL
You need a running PostgreSQL instance. Update `.env` with your database credentials:
```env
POSTGRES_HOST=localhost  # Use 'localhost' for local, 'postgres' for Docker
```

### 3. Run database migrations
```bash
npm run migration:run
```

### 4. Start the application
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Database Migrations

This project uses TypeORM migrations for database schema management.

### Available Commands

```bash
# Run all pending migrations
npm run migration:run

# Revert the most recent migration
npm run migration:revert

# Generate a new migration based on entity changes
npm run migration:generate -- src/database/migrations/MigrationName

# Create an empty migration file
npm run migration:create -- src/database/migrations/MigrationName
```

### First Time Setup

**Local Development:**
```bash
npm install
npm run migration:run
npm run start:dev
```

**Docker (migrations run automatically):**
```bash
docker-compose up --build -d
# Migrations are applied automatically on container startup!
```

**Note:** 
- `synchronize` is set to `false` in TypeORM config
- All schema changes must be done through migrations
- In Docker, migrations run automatically via `start.sh` script
- For local development, you need to run migrations manually

See [MIGRATIONS.md](MIGRATIONS.md) for detailed documentation.

## Testing

```bash
# Run all tests
npm test

# Run tests with auth
npm run test:auth

# Run refresh token tests
npm run test:refresh
```

## Development Tools

### Hot Reload
The application automatically restarts when you modify files in the `src/` directory:
```bash
npm run start:dev
```

### Linting
```bash
# Check and auto-fix code style issues
npm run lint
```

### Security Scanning
```bash
# Scan for vulnerabilities in dependencies
npm run audit
```

### Code Formatting
```bash
# Format all TypeScript files
npm run format
```

## Docker Images

### Building from Source

The `docker-compose.yml` is configured to build both application and database images from source:

```bash
# Clone repository
git clone <repository-url>
cd nodejs2025Q2-service

# Build and start containers
docker-compose up --build -d

# Run migrations
docker-compose exec app npm run migration:run

# Check status
docker-compose ps

# Test API
curl http://localhost:4000
```

### Application Image
- **Built from:** `./Dockerfile` (multi-stage build)
- **Base:** `node:22-alpine`
- **Size:** ~384 MB
- **Platform:** linux/amd64

### Database Image
- **Built from:** `./database/Dockerfile`
- **Base:** `postgres:16-alpine`
- **Custom:** Includes custom configuration
- **Size:** ~395 MB

### Docker Hub Images (Legacy)
Previous versions are available on Docker Hub:
- **Repository:** https://hub.docker.com/r/sergurr/home-library-app
- **Note:** `docker-compose.yml` now builds from source instead of pulling from Docker Hub

### Manual Image Management

```bash
# Pull images manually (legacy)
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

### Switching to Docker Hub Image

If you want to use a pre-built application image from Docker Hub instead of building locally (e.g., for testing or review):

1. Open the `docker-compose.yml` file
2. In the `app` section, uncomment the line:
   ```
   image: sergurr/home-library-app:latest
   ```
3. Comment out the `build` section:
   ```
   # build:
   #   context: .
   #   dockerfile: Dockerfile
   ```
4. Pull the image:
   ```
   docker-compose pull app
   ```
5. Start the containers:
   ```
   docker-compose up -d
   ```

**Note:** Ensure the `sergurr/home-library-app:latest` image is available on Docker Hub. To revert to local builds, undo the changes in `docker-compose.yml`.

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

All configuration is managed through `.env` file. See `.env.example` for reference.

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| PORT | Application port | 4000 | - |
| POSTGRES_HOST | PostgreSQL host | localhost | Use `localhost` for local dev, `postgres` for Docker |
| POSTGRES_PORT | PostgreSQL port | 5432 | - |
| POSTGRES_USER | PostgreSQL user | postgres | - |
| POSTGRES_PASSWORD | PostgreSQL password | postgres | Change in production |
| POSTGRES_DB | PostgreSQL database name | home_library | - |
| CRYPT_SALT | Bcrypt salt rounds | 10 | - |
| JWT_SECRET_KEY | JWT secret key | secret123123 | **Must change in production** |
| JWT_SECRET_REFRESH_KEY | JWT refresh secret | secret123123 | **Must change in production** |
| TOKEN_EXPIRE_TIME | Access token expiration | 1h | - |
| TOKEN_REFRESH_EXPIRE_TIME | Refresh token expiration | 24h | - |

**Note:** The docker-compose.yml file reads all values from `.env`, ensuring no hardcoded credentials.

## Project Structure

```
src/
├── user/           # User management
├── artist/         # Artist management
├── album/          # Album management
├── track/          # Track management
├── favorites/      # Favorites management
├── database/       # Database configuration and migrations
│   ├── data-source.ts       # TypeORM CLI configuration
│   └── migrations/          # Database migration files
└── app.module.ts   # Main application module

database/
└── Dockerfile      # Custom PostgreSQL image

docker-compose.yml  # Docker services configuration
```

## Database Schema

The application uses PostgreSQL with TypeORM. Tables are created through migrations (see [MIGRATIONS.md](MIGRATIONS.md)).

Tables:
- `user` - User accounts
- `artist` - Music artists
- `album` - Music albums
- `track` - Music tracks
- `favorite_artist` - Favorite artists
- `favorite_album` - Favorite albums
- `favorite_track` - Favorite tracks

**Note:** `synchronize` is disabled in production. Use migrations for schema changes.

## Troubleshooting

### PostgreSQL Authentication Issues
If you encounter `password authentication failed for user "postgres"`:
```bash
# Quick fix (Windows)
.\fix-postgres-clean.ps1

# Or see detailed guide
cat POSTGRES_QUICK_FIX.md
```

### Migration Issues
If migrations fail to run:
```bash
# Revert last migration
npm run migration:revert

# Or reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up --build -d
docker-compose exec app npm run migration:run
```

### Hot Reload Not Working
Make sure you're using the development script:
```bash
npm run start:dev  # NOT npm start
```

### Tests Failing
Ensure database is running and migrations are applied:
```bash
# For Docker
docker-compose exec app npm run migration:run
docker-compose exec app npm test

# For local
npm run migration:run
npm test
```

## Additional Documentation

- **[MIGRATIONS.md](MIGRATIONS.md)** - Database migration guide
- **[FIXES_SUMMARY.md](FIXES_SUMMARY.md)** - Recent fixes and improvements
- **[CHECKLIST.md](CHECKLIST.md)** - Development checklist
- **[POSTGRES_QUICK_FIX.md](POSTGRES_QUICK_FIX.md)** - PostgreSQL troubleshooting
- **[doc/api.yaml](doc/api.yaml)** - OpenAPI specification

## Contributing

1. Ensure all tests pass: `npm test`
2. Check code style: `npm run lint`
3. Format code: `npm run format`
4. Scan for vulnerabilities: `npm run audit`
5. Create migration for entity changes: `npm run migration:generate`

## License

This project is licensed under the UNLICENSED license.
