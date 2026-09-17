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
