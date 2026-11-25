#!/usr/bin/env bash
# Update and restart the site on the VPS.
# Usage (on the server, inside the project folder): ./deploy.sh
# First run starts the app; later runs restart it.
set -euo pipefail

APP_NAME="${APP_NAME:-mst-bazar}"
PORT="${PORT:-3000}"

cd "$(dirname "$0")"

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Installing dependencies"
npm ci

echo "==> Generating Prisma client"
npx prisma generate

echo "==> Applying database migrations"
npx prisma migrate deploy

echo "==> Building"
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--max-old-space-size=2560" npm run build

echo "==> Preparing standalone output"
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp .env .next/standalone/.env

echo "==> Starting / restarting with PM2"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  PORT="$PORT" HOSTNAME=127.0.0.1 pm2 start .next/standalone/server.js \
    --name "$APP_NAME" --max-memory-restart 600M
fi
pm2 save

echo "==> Done: $APP_NAME on port $PORT"
