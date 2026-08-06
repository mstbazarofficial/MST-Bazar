# Setup

```bash
# Clone
git clone <repo-url>
cd <project-name>

# Install dependencies
npm install

# Configure environment
cp .env
NODE_ENV=development
BETTER_AUTH_SECRET=NnaXhjrdQG8eKD6NRAby95yXwZSatafi
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://neondb_owner:npg_WOaJ9fv5HBxG@ep-restless-field-azgbillw.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=pwtf7rqj
# Update .env values

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
