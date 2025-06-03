# 🗺️ BRX Performance Admin Portal - Visual Site Map
*Interactive hierarchical visualization of discovered navigation structure*

## 🌳 Main Site Architecture

```
BRX Performance Admin Portal (online.brxperformance.com/ex4/)
│
├── 🔐 Authentication Layer
│   ├── /login                          # Main login page
│   ├── /sign-up                        # Registration
│   ├── /reset-password/                # Password recovery
│   └── /terms-of-service               # Legal terms
│
├── 📊 Dashboard Hub (/embed/dashboard/)
│   ├── /trainer-dashboard/             # 🏠 MAIN ADMIN DASHBOARD
│   │   ├── Client Stats (50 new, 21K+ inactive)
│   │   ├── Recent Activity Feed
│   │   ├── Today's Schedule Preview
│   │   ├── Financial Overview
│   │   └── Quick Actions Panel
│   │
│   ├── /trainer/business/              # 💼 Business Analytics
│   │   ├── Revenue Dashboard
│   │   ├── /charges/                   # Payment History
│   │   ├── Subscription Analytics
│   │   └── Financial Reports
│   │
│   └── /reports                        # 📈 Comprehensive Reports
│
├── 👥 Client Management System
│   ├── /embed/dashboard/clients/       # 📋 Client List/Overview
│   │   ├── /new/                       # Add New Client Form
│   │   ├── ?customStatus=new_clients   # Filter: New (50)
│   │   ├── ?customStatus=not_logged_workout # Filter: Inactive (21,268)
│   │   ├── ?customStatus=expiring_package   # Filter: Expiring (302)
│   │   ├── ?customStatus=birthday_today     # Filter: Birthdays (225)
│   │   └── [10+ other status filters]
│   │
│   ├── /dashboard/trainer/clients/{id}/ # 👤 Individual Client Profiles
│   │   ├── /1002354/ (Daphne Wolff)
│   │   ├── /853994/  (Michael Lee)
│   │   ├── /1871258/ (Bryce Szymuszkiewicz)
│   │   ├── /1739393/ (Caleb Cox)
│   │   ├── /1227118/ (Dyllan Pugliese)
│   │   └── [100+ other client profiles]
│   │
│   └── Client Analytics
│       ├── /dashboard/snapshot/?user_id={id}    # Performance Snapshot
│       ├── /dashboard/performance/?user_id={id} # Detailed Analytics
│       └── /journal/{user_id}?date={timestamp}  # Workout History
│
├── 💪 Workout & Exercise Management
│   ├── /workout-plans                  # 📝 Plan Templates
│   │   ├── Plan Library
│   │   ├── Custom Plan Builder
│   │   └── Plan Assignment Interface
│   │
│   ├── /exercises                      # 🏋️ Exercise Database
│   │   ├── /dynamic-series
│   │   ├── /glute-bridge-isometric-brx
│   │   ├── /bird-dog-brx
│   │   ├── /countermovement-jump-brx
│   │   ├── /trap-bar-deadlift-{id}
│   │   ├── /arm-care-band-series
│   │   ├── /kneeling-er-throws-brx
│   │   └── [500+ exercise variations]
│   │
│   ├── /dashboard/exercises/           # Exercise Management
│   ├── /dashboard/workout-plans/       # Plan Administration
│   └── /dashboard/workouts/            # Workout Logs & History
│
├── 👥 Group & Program Management
│   ├── /groups                         # 🎯 Group Sessions
│   │   ├── Group Creation Interface
│   │   ├── Member Assignment
│   │   └── Group Progress Tracking
│   │
│   └── /dashboard/groups/              # Group Administration
│       ├── Active Groups List
│       ├── Attendance Tracking
│       └── Group Performance Analytics
│
├── 📅 Scheduling & Booking System (/embed/fbm/)
│   ├── /schedule                       # 📆 Master Calendar
│   │   ├── Daily Schedule View
│   │   ├── Weekly/Monthly Views
│   │   ├── Trainer Availability
│   │   └── Session Booking Interface
│   │
│   ├── /visits                         # 🏃 Visit Tracking
│   │   ├── Check-in/Check-out System
│   │   ├── Visit History
│   │   └── Attendance Analytics
│   │
│   ├── /scheduled-members              # 🔄 Recurring Bookings
│   │   ├── Regular Session Management
│   │   ├── Auto-booking Rules
│   │   └── Membership Scheduling
│   │
│   ├── /services                       # 🛠️ Service Offerings
│   │   ├── Training Session Types
│   │   ├── Assessment Services
│   │   ├── Specialized Programs
│   │   └── Service Pricing
│   │
│   ├── /packages                       # 📦 Package Management
│   │   ├── Training Packages
│   │   ├── Membership Tiers
│   │   ├── Package Pricing
│   │   └── Package Analytics
│   │
│   ├── /locations                      # 📍 Facility Management
│   │   ├── Training Locations
│   │   ├── Equipment Inventory
│   │   └── Space Utilization
│   │
│   └── /schedules                      # ⏰ Availability Management
│       ├── Trainer Schedules
│       ├── Facility Hours
│       └── Holiday/Exception Rules
│
├── 💬 Communication Center
│   ├── /messages                       # 📧 Message Hub
│   │   ├── Inbox Management
│   │   ├── Client Conversations
│   │   ├── Broadcast Messaging
│   │   └── Message Templates
│   │
│   ├── /dashboard/ask/                 # 🤝 Coach Messaging
│   │   ├── Q&A Interface
│   │   ├── Expert Consultation
│   │   └── Knowledge Base
│   │
│   └── /embed/dashboard/me/messages/   # 📱 Message Management
│       ├── Message Organization
│       ├── Response Templates
│       └── Communication Analytics
│
├── 🤖 Automation & Advanced Tools
│   ├── /embed/dashboard/automations/   # ⚙️ Workflow Automation
│   │   ├── Automated Responses
│   │   ├── Progress Triggers
│   │   ├── Billing Automations
│   │   └── Custom Workflows
│   │
│   ├── /lifecycle                      # 📊 Client Lifecycle
│   │   ├── Onboarding Sequences
│   │   ├── Progress Milestones
│   │   ├── Retention Analytics
│   │   └── Lifecycle Automation
│   │
│   └── /emails                         # 📬 Email Management
│       ├── Email Templates
│       ├── Campaign Management
│       ├── Automated Sequences
│       └── Email Analytics
│
└── ⚙️ Administration & Settings
    ├── Business Configuration
    │   ├── /me/profile                 # 🏢 Business Profile
    │   ├── /embed/dashboard/trainer/custom # 🎨 Platform Customization
    │   ├── /embed/dashboard/trainer/trainers # 👨‍💼 Staff Management
    │   └── /products                   # 🛍️ Product Catalog
    │
    ├── System Management
    │   ├── /embed/dashboard/me/apps    # 🔗 Connected Apps
    │   ├── /embed/dashboard/trainer/assessments # 📋 Assessment Tools
    │   ├── /embed/dashboard/trainer/resources # 📚 Resource Library
    │   ├── /embed/dashboard/trainer/tags # 🏷️ Tag Management
    │   ├── /embed/dashboard/trainer/links # 🔗 Link Management
    │   ├── /embed/dashboard/me/events # 📅 Event Management
    │   ├── /embed/dashboard/trainer/support # 🆘 Support Center
    │   └── /embed/dashboard/trainer/videos # 🎥 Video Library
    │
    └── Analytics & Reporting
        ├── /embed/dashboard/trainer/health/reports # 📊 Health Reports
        ├── /dashboard/activity/        # 📈 Activity Feed
        ├── /dashboard/health/          # 🏥 Health Data
        └── /time-tracking             # ⏱️ Time Management
```

---

## 🎯 Crawling Priority Heat Map

```
🔥🔥🔥 HIGH PRIORITY (Core Business Functions)
├── 📊 Main Dashboard (/trainer-dashboard/)     [CRITICAL - Start Here]
├── 👥 Client List (/clients/)                  [CRITICAL - Core Data]
├── 💪 Workout Plans (/workout-plans)           [CRITICAL - Core Product]
├── 📅 Schedule System (/fbm/schedule)          [CRITICAL - Operations]
└── 💰 Business Dashboard (/trainer/business/)  [CRITICAL - Revenue]

🔥🔥 MEDIUM PRIORITY (Operations & Management)
├── 👤 Individual Client Pages (/clients/{id}/) [HIGH - User Profiles]
├── 🏋️ Exercise Database (/exercises/)         [HIGH - Content Library]
├── 📧 Communication (/messages, /ask/)         [HIGH - User Engagement]
├── 🤖 Automations (/automations/)             [MEDIUM - Efficiency]
└── ⚙️ Settings Pages (/trainer/*)             [MEDIUM - Configuration]

🔥 LOW PRIORITY (Supporting Content)
├── 📈 Analytics Pages (/reports, /activity/)   [LOW - Insights]
├── 🎥 Media Content (/videos/, /resources/)    [LOW - Content]
├── 📋 Individual Exercise Pages               [LOW - Detailed Content]
└── 🔐 Public Pages (/terms, /help/)          [LOW - Static Content]
```

---

## 🎨 Data Structure Visualization

```
📊 BRX Performance Data Architecture

┌─────────────────────────────────────────────────────────────┐
│                    🏠 DASHBOARD HUB                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │📈 Analytics │ │💰 Financial │ │📅 Schedule  │            │
│  │• 50 New     │ │• Charges    │ │• Today's    │            │
│  │• 21K+ Stats │ │• Revenue    │ │• Bookings   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼───────┐ ┌───▼───┐ ┌──────▼──────┐
        │👥 CLIENTS     │ │💪 WORKOUTS│ │📅 SCHEDULING│
        │               │ │          │ │             │
        │┌─────────────┐│ │┌────────┐│ │┌───────────┐│
        ││Individual   ││ ││Plans   ││ ││Calendar   ││
        ││Profiles     ││ ││Library ││ ││Management ││
        │└─────────────┘│ │└────────┘│ │└───────────┘│
        │┌─────────────┐│ │┌────────┐│ │┌───────────┐│
        ││Performance  ││ ││Exercise││ ││Bookings   ││
        ││Analytics    ││ ││Database││ ││& Visits   ││
        │└─────────────┘│ │└────────┘│ │└───────────┘│
        │┌─────────────┐│ │┌────────┐│ │┌───────────┐│
        ││Workout      ││ ││Progress││ ││Resources  ││
        ││History      ││ ││Tracking││ ││& Staff    ││
        │└─────────────┘│ │└────────┘│ │└───────────┘│
        └───────────────┘ └──────────┘ └─────────────┘
                │              │              │
        ┌───────▼───────┐ ┌────▼────┐ ┌──────▼──────┐
        │💬 COMMUNICATION│ │🤖 AUTO   │ │⚙️ ADMIN     │
        │• Messages     │ │• Workflows│ │• Settings   │
        │• Notifications│ │• Triggers │ │• Staff Mgmt │
        │• Support      │ │• Lifecyle │ │• Integrations│
        └───────────────┘ └─────────┘ └─────────────┘
```

---

## 🔍 Pattern Analysis

### URL Structure Patterns
```
🔗 Authentication Paths:
   /ex4/login, /ex4/sign-up, /ex4/reset-password/

🔗 Dashboard Paths:
   /ex4/embed/dashboard/{area}/
   Examples: /trainer-dashboard/, /clients/, /automations/

🔗 Business Management:
   /ex4/dashboard/trainer/{function}/
   Examples: /business/, /trainers/, /custom/

🔗 Scheduling System:
   /ex4/embed/fbm/{feature}
   Examples: /schedule, /visits, /packages

🔗 Individual Records:
   /ex4/dashboard/trainer/clients/{client_id}/
   /ex4/exercises/{exercise_slug}
   /ex4/journal/{user_id}?date={timestamp}

🔗 Filtered Views:
   /ex4/dashboard/clients/?customStatus={filter}&end_date={date}
   Examples: new_clients, expiring_package, birthday_today
```

### Data Relationship Map
```
           👤 CLIENT
              │
    ┌─────────┼─────────┐
    │         │         │
  📊 STATS  📝 PLANS  📅 SCHEDULE
    │         │         │
    ├─Performance    ├─Workouts    ├─Bookings
    ├─Progress       ├─Exercises   ├─Visits  
    ├─Analytics      ├─Templates   ├─Sessions
    └─History        └─Progress    └─Resources
```

---

## 🚀 Systematic Crawling Strategy

### Phase 1: Core Infrastructure (Day 1)
```
1. 🔐 Authentication Setup
   • Test login flow with credentials
   • Verify session persistence
   • Capture authentication headers

2. 📊 Main Dashboard Discovery
   • Scrape /trainer-dashboard/ for navigation
   • Extract all navigation links
   • Map out sidebar/menu structure
   • Identify dynamic content areas
```

### Phase 2: Data Collection (Day 2-3)
```
3. 👥 Client Management Deep Dive
   • Scrape client list pages
   • Extract client IDs and metadata
   • Crawl sample individual profiles
   • Map client status filter system

4. 💪 Workout System Analysis
   • Crawl workout plan templates
   • Extract exercise database structure
   • Map workout-to-client relationships
   • Capture progress tracking interfaces
```

### Phase 3: Operations & Features (Day 4-5)
```
5. 📅 Scheduling System Mapping
   • Crawl calendar interfaces
   • Extract booking system logic
   • Map service/package structures
   • Analyze time/resource management

6. 🤖 Advanced Features
   • Automation workflow interfaces
   • Communication system structure
   • Analytics and reporting pages
   • Administrative configuration
```

---

## 📱 Mobile App Integration Points

```
📱 iOS App: https://itunes.apple.com/us/app/brx-performance/id1308361552?mt=8
🤖 Android: https://play.google.com/store/apps/details?id=com.brxperformance.online.store&hl=en

Integration APIs:
├── 🔄 Data Sync Endpoints
├── 📊 Progress Tracking APIs  
├── 📅 Schedule Synchronization
├── 💬 Push Notification System
└── 📈 Real-time Analytics Feed
```

---

## 🎯 Success Metrics for Crawling

| Phase | Target Pages | Key Data Points | Success Criteria |
|-------|-------------|-----------------|------------------|
| **Phase 1** | 5-10 core pages | Navigation structure, auth flow | ✅ Can navigate entire admin panel |
| **Phase 2** | 50+ client/workout pages | User profiles, exercise data | ✅ Can replicate core functionality |
| **Phase 3** | 100+ feature pages | Scheduling, automation, analytics | ✅ Can build comprehensive replica |
| **Complete** | 500+ total pages | Full business logic, UI patterns | ✅ Production-ready application |

---

*This visual site map provides the roadmap for systematically crawling and understanding the complete BRX Performance admin portal architecture.*

