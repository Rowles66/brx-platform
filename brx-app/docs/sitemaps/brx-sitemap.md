# BRX Performance Admin Portal - Site Map
*Generated from authenticated dashboard navigation - May 29, 2025*

## 🎯 Primary Navigation Areas

### 📊 Dashboard & Overview
- `/ex4/embed/dashboard/trainer-dashboard/` - Main admin dashboard
- `/ex4/embed/dashboard/trainer/business/` - Business dashboard
- `/ex4/reports` - Reports section

### 👥 Client Management
- `/ex4/embed/dashboard/clients/` - Client list/management
- `/ex4/embed/dashboard/clients/new/` - Add new client
- `/ex4/dashboard/clients/` - Alternative client view
- `/ex4/dashboard/trainer/clients/{id}/` - Individual client pages

### 💪 Workout & Exercise Management
- `/ex4/workout-plans` - Workout plans
- `/ex4/exercises` - Exercise library
- `/ex4/dashboard/exercises/` - Exercise management
- `/ex4/dashboard/workout-plans/` - Plan management
- `/ex4/dashboard/workouts/` - Workout logs

### 👥 Groups & Programs
- `/ex4/groups` - Group management
- `/ex4/dashboard/groups/` - Group dashboard

### 💬 Communication
- `/ex4/messages` - Message center
- `/ex4/dashboard/ask/` - Coach messaging
- `/ex4/embed/dashboard/me/messages/` - Message management

### 🤖 Automation & Tools
- `/ex4/embed/dashboard/automations/` - Automation settings
- `/ex4/lifecycle` - Lifecycle management
- `/ex4/emails` - Email management

## 📅 Scheduling & Booking

### 📋 Schedule Management
- `/ex4/embed/fbm/schedule` - Calendar view
- `/ex4/fbm/schedule/` - Schedule dashboard
- `/ex4/embed/fbm/visits` - Visit tracking
- `/ex4/embed/fbm/scheduled-members` - Recurring members
- `/ex4/embed/fbm/services` - Service offerings
- `/ex4/embed/fbm/packages` - Package management
- `/ex4/fbm/locations` - Location management
- `/ex4/embed/fbm/schedules` - Availability schedules

## 🏢 Business Management

### 💰 Financial & Billing
- `/ex4/dashboard/trainer/business/charges/` - Charge history
- `/ex4/dashboard/trainer/business/` - Business overview
- `/ex4/products` - Product catalog

### ⚙️ Account & Settings
- `/ex4/me/profile` - Business info/profile
- `/ex4/embed/dashboard/trainer/custom` - Platform customization
- `/ex4/embed/dashboard/me/apps` - Connected apps
- `/ex4/embed/dashboard/trainer/trainers` - Staff management
- `/ex4/embed/dashboard/trainer/assessments` - Assessment tools
- `/ex4/embed/dashboard/trainer/resources` - Resource library
- `/ex4/embed/dashboard/trainer/tags` - Tag management
- `/ex4/embed/dashboard/trainer/links` - Link management
- `/ex4/embed/dashboard/me/events` - Event management
- `/ex4/embed/dashboard/trainer/support` - Support center
- `/ex4/embed/dashboard/trainer/videos` - Video library

### 📊 Analytics & Reports
- `/ex4/embed/dashboard/trainer/health/reports` - Health/measurement reports
- `/ex4/dashboard/activity/` - Activity feed
- `/ex4/dashboard/health/` - Health data
- `/ex4/time-tracking` - Time card tracking

## 🔗 Individual Client Pages
*Pattern: `/ex4/dashboard/trainer/clients/{client_id}/`*

### Recently Active Clients (from dashboard)
- `/ex4/dashboard/trainer/clients/1002354/` - Daphne Wolff
- `/ex4/dashboard/trainer/clients/853994/` - Michael Lee
- `/ex4/dashboard/trainer/clients/1871258/` - Bryce Szymuszkiewicz
- `/ex4/dashboard/trainer/clients/1739393/` - Caleb Cox
- `/ex4/dashboard/trainer/clients/1227118/` - Dyllan Pugliese
- `/ex4/dashboard/trainer/clients/413625/` - Tobey Bassett
- `/ex4/dashboard/trainer/clients/736507/` - Jacob Pardalis
- `/ex4/dashboard/trainer/clients/224049/` - Parker Jensen
- `/ex4/dashboard/trainer/clients/1195947/` - Connor Hamilton
- `/ex4/dashboard/trainer/clients/177981/` - Cameron Perdreau

## 📋 Client Tracking & Analytics
*Pattern: `/ex4/dashboard/{view}/?user_id={id}`*

### Performance Tracking
- `/ex4/dashboard/snapshot/?user_id={id}` - Client snapshot
- `/ex4/dashboard/performance/?user_id={id}` - Performance analytics

### Workout Journals
*Pattern: `/ex4/journal/{user_id}?date={timestamp}`*
- Individual workout logs with timestamps

## 🏃‍♂️ Exercise Database
*Pattern: `/ex4/exercises/{exercise_name}`*

### Sample Exercise Pages (from activity feed)
- `/ex4/exercises/dynamic-series`
- `/ex4/exercises/glute-bridge-isometric-brx`
- `/ex4/exercises/bird-dog-brx`
- `/ex4/exercises/bodyweight-split-squat-isometric`
- `/ex4/exercises/countermovement-jump-brx`
- `/ex4/exercises/trap-bar-deadlift-{id}`
- `/ex4/exercises/yoke-bar-bulgarian-pin-squat`
- `/ex4/exercises/arm-care-band-series`
- `/ex4/exercises/kneeling-er-throws-brx`

## 🔍 Client Status Filters
*Pattern: `/ex4/dashboard/clients/?customStatus={status}&end_date={timestamp}`*

### Available Filters
- `new_clients` - New clients (50)
- `not_logged_workout` - No logged workout (21,268)
- `expiring_package` - Expiring packages (302)
- `expiring_card` - Expiring payment methods (3)
- `completed_assessment` - Completed assessments (283)
- `birthday_today` - Birthdays (225)
- `no_visit` - No recent visits (21,514)
- `calendar_plan_ending` - Plan ending (229)
- `new_uploads` - New uploads (54)
- `new_messages` - New messages (2)
- `calendar_ending` - Calendar ending (1,263)

## 📱 Mobile App Links
- iOS App: `https://itunes.apple.com/us/app/brx-performance/id1308361552?mt=8`
- Android App: `https://play.google.com/store/apps/details?id=com.brxperformance.online.store&hl=en`

## 🔐 Authentication & Public Pages
- `/ex4/login` - Login page
- `/ex4/sign-up` - Registration
- `/ex4/reset-password/` - Password reset
- `/ex4/terms-of-service` - Terms of service

## 📊 Priority Crawling Order

### High Priority (Core Functionality)
1. **Dashboard Pages** - Main admin interfaces
2. **Client Management** - Individual client profiles and lists
3. **Workout/Exercise Pages** - Core business functionality
4. **Schedule/Booking** - Calendar and appointment system

### Medium Priority (Business Operations)
5. **Financial Pages** - Billing and payment tracking
6. **Settings/Configuration** - Platform customization
7. **Reports/Analytics** - Business intelligence

### Low Priority (Supporting Content)
8. **Individual Exercise Pages** - Detailed exercise instructions
9. **Historical Data** - Old workout logs and archives
10. **Public/Marketing Pages** - Terms, help, etc.

---

## 🤖 Crawling Strategy

### Authenticated Crawling Required
- All `/ex4/` paths require login authentication
- Use the same FireCrawl login sequence established previously
- Credential: `info@brxperformance.com` / `Topher@1969@2069`

### Systematic Approach
1. **Start with navigation pages** to discover dynamic client/exercise IDs
2. **Extract ID patterns** from client and exercise lists
3. **Crawl individual pages** using discovered ID patterns
4. **Capture data formats** for each page type
5. **Map relationships** between entities (clients → workouts → exercises)

### Data Extraction Focus
- **UI Components** - Navigation, forms, tables, modals
- **Data Structures** - Client profiles, workout templates, exercise libraries
- **Business Logic** - Scheduling rules, billing cycles, progress tracking
- **Visual Design** - Layout patterns, styling, responsive behavior

---

*This site map provides the foundation for systematically crawling and replicating the BRX Performance admin portal functionality.*

