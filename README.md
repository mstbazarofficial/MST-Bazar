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

# .env.local

NEXT_PUBLIC_CONTACT_NUMBER="+8801581172773"

NEXT_PUBLIC_WHATSAPP_NUMBER="+8801581172773"

NEXT_PUBLIC_CONTACT_EMAIL="mstbazarofficial@gmail.com"

NEXT_PUBLIC_CONTACT_ADDRESS="Aftab nagar,Dhaka"

NEXT_PUBLIC_BKASH_NUMBER="01850347720"

NEXT_PUBLIC_ROCKET_NUMBER=""

NEXT_PUBLIC_NAGAD_NUMBER="01850347720"

NEXT_PUBLIC_FACEBOOK_URL="https://www.facebook.com/share/1PwdtnMRjc/"

NEXT_PUBLIC_INSTAGRAM_URL="https://www.instagram.com/mstbazar?igsi=MXE4NTRqYnBqNnJkOA=="

NEXT_PUBLIC_YOUTUBE_URL="https://youtube.com/@mstbazar?si=O-g8hhp1NYgiuW0t"

NEXT_PUBLIC_APP_URL=http://localhost:3000
