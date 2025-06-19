# BRX Platform Project Roadmap & AI Memory

**Project**: Independent Fitness Platform Migration from Exercise.com  
**Goal**: Enable strength coaches to earn $100K+ annually through AI-powered automation  
**Current Status**: Phase 2A Complete - FBM Core Business Tables (55% API coverage)

## 🎯 **Project Context for AI/Cursor**

### **What This Monorepo Contains**
```
brx-platform/
├── brx-app/                    # Main Next.js application (Phase 2 target)
├── brx-core/                   # API analysis & migration tools  
├── mcp-server/                 # MCP server for AI integrations
├── v0-recreate-visual-design/  # UI design system (legacy)
└── scripts/                    # Automation and utility scripts
```

### **Current Architecture Stack**
- **Frontend**: Next.js 15 + Tailwind CSS (consolidated)
- **Backend**: tRPC + Prisma + Supabase PostgreSQL  
- **Authentication**: NextAuth planned (currently mock)
- **AI Integration**: Claude Code + MCP server
- **Deployment**: Vercel production environment
- **Secrets**: 1Password CLI integration

## 📊 **Database Migration Status (JUST COMPLETED)**

### **✅ Phase 1 Accomplished (June 19, 2025)**
- **Supabase Connected**: Production database live
- **Schema Extended**: 15 tables with BRX-specific models
- **Data Imported**: Real BRX platform configuration + user data
- **API Spec Updated**: Fresh download of 66+ endpoints (245KB spec)

### **Current Tables (21/47 needed)**
```sql
-- Core fitness functionality ✅
User, Exercise, UserExercise, Workout, WorkoutExercise
Program, UserSession, Message

-- BRX-specific data ✅  
MeasurementType (139 types), UserMeasurement, PlatformConfig
Tag (166 tags), Service

-- FBM Business Tables ✅ (NEW)
FbmService, FbmLocation, FbmAppointment, FbmVisit
FbmPackage, PaymentOption, FbmSchedule
FbmServiceLocation, FbmPackageService, FbmPackagePurchase, FbmPackageVisit

-- Enums: WorkoutStatus, ProgramStatus, MessageType, MessagePriority
-- FBM Enums: ServiceCategory, AppointmentStatus, VisitStatus, PaymentStatus, PackageType, PaymentType
```

### **🚧 Remaining: Enhanced Business Tables (26 tables)**
Additional functionality for complete BRX API parity

## 🛠 **AI/Cursor Organization Recommendations**

### **1. Context Management System**
```markdown
# For each major work session, update:
- /CURRENT_FOCUS.md (what we're working on now)  
- /COMPLETED_FEATURES.md (what's done)
- /NEXT_PRIORITIES.md (what's next)
- /brx-app/CLAUDE.md (technical context)
```

### **2. Structured Documentation**
```
docs/
├── api/                    # API analysis and specifications
├── architecture/           # System design and decisions  
├── progress/              # Migration progress tracking
├── ai-guides/             # AI workflow and context
└── deployment/            # Production deployment guides
```

### **3. AI Memory Persistence**
- **Pinecone Integration**: Already configured for conversation history
- **Context Files**: Key decisions and progress in markdown
- **Component Documentation**: In-code context for complex logic
- **Migration Logs**: Detailed change tracking

## 🎯 **Immediate Next Steps (Priority Order)**

### **Phase 2A: FBM Core Business ✅ COMPLETE**
```typescript
// ✅ DEPLOYED to production Supabase
model FbmService { ... }      // Service offerings
model FbmLocation { ... }     // Business locations  
model FbmAppointment { ... }  // Booking system
model FbmVisit { ... }        // Visit tracking
model FbmPackage { ... }      // Revenue packages
model PaymentOption { ... }   // Payment processing
// Plus 5 additional relationship tables
```

### **Phase 2B: UI Components & Integration (Current Priority)**
```typescript  
// Frontend components for FBM functionality
ServiceManagementUI          // Service creation and editing
LocationManagementUI         // Multi-location setup
AppointmentBookingUI         // Client booking interface
VisitTrackingUI             // Check-in/out system
PackageShopUI               // Package sales interface
StripeIntegration           // Payment processing
```

### **Phase 2C: Enhanced Features (1-2 months)**
```typescript
model Conversation { ... }   // Communication
model Resource { ... }       // Content management
model Group { ... }          // Team features
model Calendar { ... }       // Advanced scheduling
```

## 🤖 **AI Workflow Optimization**

### **Context Loading Strategy**
1. **Start each session** by reading this file + SUPABASE_MIGRATION_SUMMARY.md
2. **Reference current schema** via `brx-app/prisma/schema.prisma`
3. **Check API spec** at `brx-core/api-docs/swagger_latest.yaml`
4. **Update progress** in this file after major changes

### **Decision Documentation**
```markdown
# When making architectural decisions:
1. Document WHY in /docs/architecture/decisions/
2. Update affected component README files
3. Add context to CLAUDE.md if complex
4. Update this roadmap with progress
```

### **Code Organization Principles**
- **Feature-based** directory structure (not type-based)
- **Single source of truth** for all components
- **Consolidated styling** (Tailwind only, MUI removed)
- **Type safety** throughout (Prisma + tRPC + TypeScript)

## 📈 **Success Metrics & Validation**

### **Technical Milestones**
- [ ] 47/47 tables implemented (currently 21/47 - 45% complete)
- [ ] All BRX API endpoints covered (currently ~55%)
- ✅ FBM tRPC router parity complete
- ✅ End-to-end type safety established
- ✅ Production deployment optimized

### **Business Milestones**  
- [ ] Coach onboarding flow
- [ ] Service booking system
- [ ] Payment processing (Stripe)
- [ ] Client management workflow
- [ ] Revenue tracking dashboard

### **Performance Targets**
- [ ] Build time < 30 seconds
- [ ] Page load < 2 seconds  
- [ ] 95%+ test coverage
- [ ] Zero TypeScript errors
- [ ] Production monitoring

## 🔄 **Maintenance & Updates**

### **Regular Tasks**
- **Weekly**: Update API spec via `update-api-docs.sh`
- **Monthly**: Review and consolidate context files
- **Per Feature**: Update this roadmap with progress
- **Major Changes**: Update CLAUDE.md with new patterns

### **AI Memory Refresh**
- **Key Files**: This file + SUPABASE_MIGRATION_SUMMARY.md
- **Schema Reference**: Always check current Prisma schema
- **Progress Tracking**: Update completion percentages
- **Context Preservation**: Maintain decision history

---

**This file serves as the central AI memory and project organization hub. Update it regularly to maintain context across sessions and enable efficient AI-assisted development.**

**Last Updated**: June 19, 2025 - Post Supabase Migration Phase 1