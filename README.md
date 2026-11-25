# Setup

```bash
# Clone
git clone <repo-url>
cd <project-name>

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev
```

# Daily Workflow

```bash
# Get latest changes
git pull origin main

# Start the project
npm run dev
```

### If `package.json` changed

```bash
npm install
```

### If `prisma/schema.prisma` changed

```bash
npx prisma generate
```

# Database Connection

- **Live site:** PostgreSQL on the VPS, which only listens on the server itself. The server `.env` points at `127.0.0.1:5432`.
- **Local development:** your local `.env` points at Neon, a separate copy of the data taken on 2026-11-25. Changes there never reach the live site.

To look at the live database from your PC, open an SSH tunnel in a separate terminal and connect to `127.0.0.1:5433` with the server's credentials:

```bash
ssh -N -L 5433:127.0.0.1:5432 root@77.37.47.219
```

Backups run daily at 03:30 (server time) via `/usr/local/bin/backup-mstbazar`: 14 days are kept in `/root/backups/daily` on the server, and every dump is also uploaded to the Cloudflare R2 bucket set in the server `.env`. To restore one: `pg_restore --clean --no-owner -d "$(cat /root/.mstbazar-db-url)" <file.dump>`.

# Database Changes

Never run `prisma db push`, `prisma migrate dev` or `prisma migrate reset` against a database that holds real data. They can change the schema without a migration or wipe data.

```bash
# 1. Edit prisma/schema.prisma, then create the migration folder (use today's date and a short name)
mkdir prisma/migrations/20261031120000_add_promo_codes

# 2. Write the SQL. This only reads the database
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script -o prisma/migrations/20261031120000_add_promo_codes/migration.sql

# 3. Read the SQL. Stop if it drops a column or table you meant to keep

# 4. Apply it to your local (Neon) database and test
npm run db:deploy
npm run db:status

# 5. Commit and push, then run ./deploy.sh on the server: it applies the migration to the live database before building
```

# Deploying (VPS)

The site runs on the VPS with PM2 behind Caddy, without Docker. On the server, inside the project folder:

```bash
./deploy.sh
```

It pulls the code, installs dependencies, generates the Prisma client, applies migrations (`prisma migrate deploy`), builds, and starts or restarts the app in PM2 on port 3000. The server's `.env` must set `DATABASE_URL` and `DIRECT_URL`.
