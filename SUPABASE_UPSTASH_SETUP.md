# 🚀 BRX Platform Database Setup Guide

This guide will help you set up Supabase and Upstash for the BRX Platform project, continuing from where we left off.

## 1. Set Up Supabase

1. **Create or access your Supabase project**:
   - Go to [supabase.com](https://supabase.com) and sign in
   - Create a new project or use your existing one
   - Once created, go to Project Settings > API to get your credentials

2. **Get your Supabase credentials**:
   - **Project URL**: `https://[YOUR-PROJECT-ID].supabase.co`
   - **API Keys**: Copy both the `anon` public key and the `service_role` key
   - **Database Connection**: From the Database settings, get your PostgreSQL connection string

## 2. Set Up Upstash Redis

1. **Create an Upstash Redis database**:
   - Go to [console.upstash.com](https://console.upstash.com/) and sign up/in
   - Create a new Redis database
   - Choose a name (e.g., `brx-cache`) and select the region closest to your users
   - Select the free tier for development

2. **Get your Upstash credentials**:
   - After creating the database, go to the "REST API" section
   - Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

## 3. Configure Environment Variables

Run the setup script to create the `.env.local` file in the v0-recreate-visual-design directory:

```bash
./setup-env.sh
```

Then edit the `.env.local` file in the v0-recreate-visual-design directory to add your actual credentials:

```
# Supabase (Primary Database)
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Upstash Redis (Caching & Queues)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXXXa"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 4. Install Dependencies

Navigate to the v0-recreate-visual-design directory and install the required dependencies:

```bash
cd ../v0-recreate-visual-design
npm install @supabase/supabase-js @upstash/redis prisma @prisma/client tsx --legacy-peer-deps
```

## 5. Set Up the Database

Generate the Prisma client:

```bash
cd ../v0-recreate-visual-design
npx prisma generate
```

Push the schema to your Supabase database:

```bash
npx prisma db push
```

Seed the database with initial data:

```bash
npx tsx prisma/seed.ts
```

## 6. Start the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application with the integrated database.

## 7. Verify Integration

Check that your application is correctly connected to Supabase and Upstash:

1. Navigate to the dashboard page
2. Verify that the stats are loading from the database
3. Check the browser console for any connection errors

## Next Steps

1. Implement authentication using Supabase Auth
2. Create API endpoints for Exercise.com data
3. Set up caching for frequently accessed data using Upstash
4. Implement real-time features using Supabase subscriptions

If you encounter any issues during setup, please check the Supabase and Upstash documentation or reach out for assistance. 