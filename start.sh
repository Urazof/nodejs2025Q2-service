#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running migrations..."
npm run migration:run || echo "Migrations failed or already applied"

echo "Starting application..."
exec node dist/main.js

