#!/bin/bash

# Setup script for BRX Platform environment variables

# Define the path to the v0-recreate-visual-design directory
V0_DIR="../v0-recreate-visual-design"

# Check if the directory exists
if [ ! -d "$V0_DIR" ]; then
  echo "Error: $V0_DIR directory not found."
  exit 1
fi

# Create .env.local file
cat > "$V0_DIR/.env.local" << EOL
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
EOL

echo "Created .env.local file in $V0_DIR"
echo "Please edit the file and replace the placeholder values with your actual credentials."

# Install dependencies
echo "Installing dependencies..."
cd "$V0_DIR" && npm install @supabase/supabase-js @upstash/redis prisma @prisma/client tsx --legacy-peer-deps

echo "Setup complete! Next steps:"
echo "1. Edit $V0_DIR/.env.local with your actual credentials"
echo "2. Run 'cd $V0_DIR && npx prisma generate' to generate the Prisma client"
echo "3. Run 'cd $V0_DIR && npx prisma db push' to push the schema to your database" 