# BRX Platform Migration Strategy

## Current State Analysis

### Production Environment (online.brxperformance.com)

- **Backend**: Exercise.com Platform (not Firebase or Rails)
- **Authentication**: Bearer token + API keys
- **Hosting**: Google Cloud Platform (Exercise.com's infrastructure)
- **Analytics**: Google Analytics + custom tracking
- **Database**: Exercise.com's managed database

### Local Development Environment

- **Frontend**: Next.js 15 with App Router
- **Database Schema**: Prisma ORM configured
- **API**: tRPC ready for implementation
- **Authentication**: Supabase Auth prepared

## Key Discovery: Exercise.com Platform!

Your production site uses **Exercise.com's proprietary platform** (not Firebase or Rails). This means:

1. ✅ No Firebase migration needed
2. ✅ API-based data extraction via Exercise.com's v3/v4 endpoints
3. ✅ Need Exercise.com's cooperation for webhooks/integrations

## Migration Options

### Option 1: Hybrid Architecture (Recommended) ⭐

Keep Rails backend, add modern frontend.

**Pros:**

- Zero downtime for existing users
- Gradual migration path
- Keep all business logic intact
- Add HubSpot integration to Rails

**Cons:**

- Maintain two codebases temporarily
- Rails hosting costs continue

**Implementation:**

1. Rails API mode for backend
2. Next.js consumes Rails API
3. Gradually move features to Supabase
4. HubSpot webhook integration in Rails

### Option 2: Full Migration to Supabase

Complete rewrite using your existing Next.js + Supabase setup.

**Pros:**

- Single modern codebase
- Lower long-term costs
- Better performance
- Native real-time features

**Cons:**

- High migration risk
- Potential data loss
- Business logic rebuild needed
- 3-6 month timeline

### Option 3: Rails + Supabase Hybrid

Use Supabase for new features, keep Rails for existing.

**Pros:**

- Best of both worlds
- Incremental migration
- Low risk

**Cons:**

- Complex data sync
- Two databases to manage

## Recommended Action Plan

### Phase 1: Data Extraction (Week 1)

```bash
# 1. Export Rails data
rails console
User.all.to_json > users.json
Workout.all.to_json > workouts.json
# ... export all models

# 2. Transform to Prisma schema
npm run db:import-brx
```

### Phase 2: API Integration (Week 2)

```javascript
// Create Rails API wrapper in Next.js
// app/lib/rails-api.ts
export async function getRailsData(endpoint: string) {
  return fetch(`https://online.brxperformance.com/api/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.RAILS_API_TOKEN}`,
    },
  });
}
```

### Phase 3: HubSpot Integration (Week 3)

```ruby
# In Rails: app/controllers/webhooks_controller.rb
class WebhooksController < ApplicationController
  def hubspot
    # Sync user data to HubSpot
    user = User.find_by(email: params[:email])
    HubspotClient.update_contact(user)
  end
end
```

### Phase 4: Progressive Migration (Weeks 4-8)

1. Authentication: Rails sessions → Supabase Auth
2. User profiles: Rails → Supabase
3. Workouts: Rails → Supabase
4. Analytics: Ahoy → Supabase + HubSpot

## Next Immediate Steps

1. **Fix Docker credentials** (run the script)
2. **Extract Rails schema** using Hyperbrowser
3. **Map Rails models** to Prisma schema
4. **Create data migration scripts**
5. **Test HubSpot webhook** integration

## Cost Analysis

### Current (Rails)

- Hosting: ~$200/month (Google Cloud)
- Database: ~$100/month
- Total: ~$300/month

### Future (Supabase)

- Supabase: $25/month (Pro plan)
- Vercel: $20/month
- Total: ~$45/month

**Savings: $255/month ($3,060/year)**

## Risk Mitigation

1. **Parallel running**: Keep Rails live during migration
2. **Feature flags**: Toggle between Rails/Supabase
3. **Data validation**: Automated testing of migrated data
4. **Rollback plan**: Keep Rails backup for 6 months

## Timeline

- Week 1: Data extraction and analysis
- Week 2: API integration layer
- Week 3: HubSpot setup
- Week 4-6: Core feature migration
- Week 7-8: Testing and cutover
- Week 9-12: Rails shutdown and optimization

## Decision Required

Do you want to:

1. 🚀 **Hybrid approach** - Start immediately, low risk
2. 🔄 **Full migration** - Longer timeline, clean architecture
3. 🤔 **More analysis** - Use Hyperbrowser for deeper Rails inspection

The hybrid approach gets you HubSpot integration within 2 weeks while maintaining stability.
