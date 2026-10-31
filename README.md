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

# Database Changes

`.env` points at the live database, so never run `prisma db push`, `prisma migrate dev` or `prisma migrate reset` with it. They can change the schema without a migration or wipe data.

```bash
# 1. Edit prisma/schema.prisma, then create the migration folder (use today's date and a short name)
mkdir prisma/migrations/20261031120000_add_promo_codes

# 2. Write the SQL. This only reads the database
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script -o prisma/migrations/20261031120000_add_promo_codes/migration.sql

# 3. Read the SQL. Stop if it drops a column or table you meant to keep

# 4. Apply it before deploying the code that needs it
npm run db:deploy

# 5. Confirm, then commit and deploy
npm run db:status
```

The Docker image does not include the Prisma CLI, so migrations run from a machine with `DIRECT_URL` set, not from the container.
