# CLAUDE.md - BRX Platform Development Context

## 🎯 **Current Project Status** 
**Date**: June 19, 2025  
**Phase**: Phase 2A Complete - FBM Core Business Tables Deployed  
**Next Focus**: FBM UI Components & Frontend Integration

## ✅ **Just Completed - Phase 2A: FBM Business Tables**

### **Revenue-Critical Infrastructure Deployed**
- **21 Total Tables**: Expanded from 15 to 21 production tables
- **6 Core FBM Tables**: Service, Location, Appointment, Visit, Package, PaymentOption
- **5 Relationship Tables**: Complex business logic support
- **Complete Type Safety**: All models, enums, and relationships properly typed

### **Working Commands**
```bash
npm run db:generate        # Generate Prisma client
npm run db:push            # Deploy schema changes  
npm run db:seed            # Seed with BRX measurement types
npm run db:import-brx      # Import collected API data
npm run db:studio          # Browse data via Prisma Studio
```

### **Critical Files Created/Updated**
- `prisma/schema.prisma` - Extended with BRX models (User, MeasurementType, PlatformConfig, etc.)
- `scripts/import-brx-data.ts` - BRX API data import pipeline
- `../brx-core/api-docs/swagger_latest.yaml` - Fresh API specification
- `.env` - Supabase connection string configured

## 🚧 **Immediate Next Priority: FBM Tables**

### **Missing Business-Critical Tables (32 of 47 total)**
```sql
-- PRIORITY 1: Revenue Generation (Coach $100K+ target)
FbmService           # Service offerings (classes, training)
FbmLocation          # Business locations  
FbmAppointment       # Individual appointments
FbmVisit             # Client visit tracking
FbmPackage           # Service packages/memberships
PaymentOption        # Stripe payment processing
```

### **Implementation Strategy**
1. **Extend prisma/schema.prisma** with FBM models
2. **Run npm run db:push** to deploy schema
3. **Create tRPC routers** for FBM endpoints
4. **Build UI components** for booking/scheduling
5. **Test with real data** from BRX API

## 🛠 **Development Context & Conventions**

### **Tech Stack**
- **Database**: Supabase PostgreSQL + Prisma ORM
- **API**: tRPC for type-safe endpoints
- **Frontend**: Next.js 15 + Tailwind CSS (consolidated, no MUI)
- **Auth**: Mock auth (NextAuth planned)
- **Deployment**: Vercel production

### **Code Organization**
- **Components**: Feature-based organization (`components/dashboard/`, `components/workouts/`)
- **API Routes**: tRPC routers in `src/server/api/routers/`
- **Database**: Prisma schema with BRX-specific extensions
- **Styling**: Tailwind only (MUI legacy removed)

### **Data Sources**
- **BRX API Data**: Imported from `scraped_reference/auth_assets_from_auth_extract/`
- **Platform Config**: Complete BRX settings (navigation, features, business metrics)
- **Measurement Types**: 139 performance metrics (speed, power, throwing, recovery)
- **Tags**: 166 categorization tags (client, exercise, service)

## 📊 **Current Database Schema (15/47 tables)**

### **Core Tables** ✅
```sql
User                 # BRX-enhanced user profiles
Exercise             # Exercise library
Workout              # Workout sessions  
Program              # Training programs
Message              # Communication
```

### **BRX-Specific Tables** ✅
```sql
MeasurementType      # 139 performance metrics
UserMeasurement      # Time-series performance data
PlatformConfig       # Complete BRX platform settings
Tag                  # 166 categorization tags
Service              # Basic service model
```

### **Relationships** ✅
```sql
UserExercise         # User-exercise connections
WorkoutExercise      # Workout-exercise sets
UserSession          # Authentication sessions
```

## 🎯 **FBM Schema Extension Required**

### **Business Operations**
```typescript
model FbmService {
  id              String @id @default(cuid())
  name            String
  description     String?
  duration        Int?    // minutes
  price           Float?
  isActive        Boolean @default(true)
  maxCapacity     Int?
  // Relationships to locations, schedules, visits
}

model FbmAppointment {
  id              String @id @default(cuid())
  serviceId       String
  locationId      String  
  trainerId       String
  clientId        String?
  scheduledAt     DateTime
  status          AppointmentStatus
  // Payment and visit tracking
}
```

### **Revenue Management**
```typescript
model FbmPackage {
  id              String @id @default(cuid())
  name            String
  serviceIds      String[] // Services included
  visitCount      Int?     // Number of visits
  price           Float
  validityDays    Int?     // Expiration
  isActive        Boolean @default(true)
}
```

## 🔄 **Development Workflow**

### **Schema Changes**
1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` (accepts data loss for dev)
3. Regenerate client with `npm run db:generate`
4. Update seed script if needed
5. Test with `npm run db:studio`

### **API Development**
1. Create tRPC router in `src/server/api/routers/`
2. Add to root router in `src/server/api/root.ts`
3. Build React components with tRPC hooks
4. Test end-to-end functionality

### **Data Import**
1. Enhance `scripts/import-brx-data.ts` for new models
2. Map BRX API responses to new schema
3. Handle relationships and foreign keys
4. Validate imported data integrity

## 🚨 **Important Constraints**

### **Business Logic Requirements**
- **Visit Tracking**: Complex state machine (reserved → registered → completed)
- **Package Management**: Remaining visits, expiration handling
- **Booking Restrictions**: Time windows, capacity limits, trainer availability
- **Payment Processing**: Stripe integration for coach revenue

### **Data Relationships**
- **Services ↔ Locations**: Many-to-many (services offered at multiple locations)
- **Appointments ↔ Visits**: One-to-many (appointment can have multiple client visits)
- **Users ↔ Packages**: Many-to-many through visit tracking
- **Schedules ↔ Services**: Complex availability matrix

## 📝 **AI Assistant Guidelines**

### **When Working on This Project**
1. **Always check** current schema in `prisma/schema.prisma`
2. **Reference** the latest API spec at `../brx-core/api-docs/swagger_latest.yaml`
3. **Follow** existing patterns in tRPC routers and components
4. **Update** this file when making significant architecture changes
5. **Test changes** with `npm run db:studio` and live data

### **Code Quality Standards**
- **Type Safety**: Strict TypeScript throughout
- **Single Source**: No duplicate implementations
- **Feature Organization**: Group by business function, not technical type
- **Minimal Comments**: Self-documenting code preferred
- **Tailwind Only**: No MUI or other CSS frameworks

### **Key Files for Context**
- This file (`CLAUDE.md`) - Technical context
- `PROJECT_ROADMAP.md` - Overall project status
- `SUPABASE_MIGRATION_SUMMARY.md` - Migration details
- `prisma/schema.prisma` - Current database schema
- `../brx-core/api-docs/swagger_latest.yaml` - BRX API specification

---

**This file provides technical context for AI-assisted development. Update it when making significant changes to architecture, patterns, or development workflow.**

**Last Updated**: June 19, 2025 - Post Supabase Migration Phase 1