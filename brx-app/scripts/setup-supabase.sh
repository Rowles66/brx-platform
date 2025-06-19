#!/bin/bash

echo "🚀 Setting up Supabase for BRX Platform Data Storage"
echo "================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

echo ""
echo "📋 Next Steps:"
echo "1. Create a Supabase account at https://supabase.com"
echo "2. Create a new project"
echo "3. Go to Project Settings → Database"
echo "4. Copy your connection string"
echo "5. Update your .env file with:"
echo "   DATABASE_URL=\"postgresql://postgres.[your-ref]:[your-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true\""
echo ""
echo "6. Then run these commands:"
echo "   npm run db:push     # Create tables in Supabase"
echo "   npm run db:seed     # Add demo data"
echo "   npm run db:import-brx  # Import your collected BRX data"
echo ""
echo "🔗 Useful Supabase Commands:"
echo "   npm run db:studio   # Open Prisma Studio to view data"
echo "   supabase dashboard  # Open Supabase dashboard"
echo ""

# Check if .env exists and has DATABASE_URL
if [ -f .env ]; then
    if grep -q "DATABASE_URL.*supabase" .env; then
        echo "✅ Supabase connection string detected in .env"
        echo ""
        echo "🎯 Ready to sync database schema:"
        echo "   npm run db:push"
    else
        echo "⚠️  Please update DATABASE_URL in .env with your Supabase connection string"
    fi
else
    echo "⚠️  .env file not found. Please create one with your Supabase DATABASE_URL"
fi

echo ""
echo "📊 Your BRX data will be imported from:"
echo "   - Platform configuration (navigation, features, settings)"
echo "   - User profiles and metrics"
echo "   - 100+ measurement types (speed, power, throwing velocity, etc.)"
echo "   - Client/exercise/service tags"
echo ""
echo "🔄 Migration benefits:"
echo "   ✅ Real data from your existing BRX platform"
echo "   ✅ Production-ready Postgres database"
echo "   ✅ No vendor lock-in (full data ownership)"
echo "   ✅ Modern API with tRPC + Prisma"
echo ""