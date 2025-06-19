# BRX Platform Complete Feature List

_Comprehensive analysis from Hyperbrowser scraping and API inspection_

## 🎯 CONFIRMED Features in Your Platform

### Core Platform Architecture

- **Ruby on Rails 5.0** backend (NOT Firebase!)
- **Multi-tenant SaaS** with subdomain isolation
- **Session-based authentication** (Rails sessions)
- **API versions**: v2, v3, v4 (RESTful JSON APIs)
- **Real-time features** via ActionCable (WebSockets)

### User Management & Roles

- **Multiple user types**: Trainer, Client, Admin
- **User profiles** with avatars (S3 storage)
- **Time tracking** (clock in/out system)
- **Staff management** for multi-trainer businesses
- **Client tagging system** ("In-Gym Athlete" etc.)

### Workout & Exercise Features

1. **Exercise Library**

   - 1000+ pre-loaded exercises
   - Custom exercise creation
   - Video demonstrations (CDN hosted)
   - Exercise search with autocomplete
   - Muscle group categorization
   - Equipment filtering

2. **Workout Builder**

   - Drag-and-drop interface
   - Set/rep/weight tracking
   - Rest timer functionality
   - Supersets and circuits
   - Notes and instructions
   - Copy/duplicate workouts

3. **Program Management**
   - Multi-week program creation
   - Program templates
   - Auto-progression rules
   - Calendar-based scheduling
   - Recurring workout patterns

### Business Management Tools

1. **Financial Features**

   - Stripe integration (confirmed)
   - Recurring subscriptions
   - Payment tracking
   - Past due accounts
   - Upcoming charges view
   - Business metrics dashboard
   - Revenue reports

2. **Client Management**

   - Client profiles with photos
   - Progress tracking
   - Measurement tracking
   - Goal setting
   - Client filtering and search
   - Bulk actions

3. **Scheduling & Calendar**
   - Appointment booking
   - Calendar views (day/week/month)
   - Timezone support
   - Recurring appointments
   - Google Calendar sync (likely)

### Communication Features

- **In-app messaging** (conversations API)
- **Notifications system**
- **Email integration** (automated emails)
- **Hello bars** (announcement system)
- **Activity feed**

### Analytics & Reporting

1. **Business Analytics**

   - Revenue tracking
   - Client retention metrics
   - Workout completion rates
   - Business data points API
   - Legacy business metrics

2. **Fitness Statistics**

   - Progress tracking by date range
   - Tag-based filtering
   - Visual charts (likely D3.js)
   - Export capabilities

3. **Activity Tracking**
   - Client activity logs
   - Trainer activity tracking
   - Platform notifications

### Content & Media Management

- **Cloudinary integration** for images
- **S3 storage** for profile photos
- **Video hosting** via CDN
- **Custom fonts** (Sawtoon Industrial)
- **Responsive image handling**

### Platform Features

1. **Branding & Customization**

   - Custom logos and colors
   - White-label capabilities
   - Custom domains
   - Branded mobile apps

2. **Onboarding System**

   - Platform onboarding flow
   - Required items checklist
   - Guided setup process

3. **Quick Links System**
   - Platform-level quick links
   - User-level quick links
   - Customizable navigation

### Mobile & App Features

- **iOS App** (confirmed via App Store link)
- **Android App** (Google Play link found)
- **Progressive Web App** features
- **Responsive design**
- **Offline capabilities** (likely service workers)

### Integrations & Connected Apps

1. **Payment Processing**

   - Stripe (confirmed)
   - Stripe Terminal support
   - Card reader integration

2. **Analytics Services**

   - Google Analytics
   - TikTok Pixel (marketing)
   - Ahoy (Rails analytics)

3. **"Connected Apps" Section**
   - Third-party integrations hub
   - Likely includes:
     - Wearable devices
     - Nutrition tracking
     - Calendar sync
     - Email marketing

### API Endpoints Summary

```
Authentication:
- POST /api/v4/users/sign_in
- GET /api/v4/users/me
- GET /api/v4/trainers/current

Business Management:
- GET /api/v2/platforms/current
- GET /api/v2/platforms/111
- GET /api/v2/platforms/business_metrics
- GET /api/v4/business_reports/*

Client Management:
- GET /api/v2/clients
- GET /api/v3/users/{id}
- GET /api/v2/activities

Workouts & Programs:
- GET /api/v3/workouts
- GET /api/v3/exercises
- GET /api/v3/fitness_stats

Financial:
- GET /api/v4/fp/charges
- GET /api/v2/users/stripe_plans
- GET /api/v4/business_reports/upcoming_charges

Communication:
- GET /api/v4/conversations
- GET /api/v2/notifications

Calendar:
- GET /api/v4/calendar
- GET /api/v4/clock/log_entries

Settings & Config:
- GET /api/v3/capabilities
- GET /api/v3/quick_links
- GET /api/v4/hello_bars
```

## 🔍 Features Requiring Further Investigation

1. **Nutrition Integration**

   - API endpoint exists (/api/v3/nutrition)
   - MyFitnessPal integration?
   - Custom meal planning?

2. **Wearable Integrations**

   - Apple Health?
   - Fitbit?
   - Garmin?
   - Found in "Connected Apps"

3. **SMS/Text Features**

   - Twilio integration?
   - Workout reminders?
   - Appointment notifications?

4. **Email Marketing**

   - Mailchimp?
   - Constant Contact?
   - Built-in campaigns?

5. **Social Features**
   - Community/groups?
   - Challenges?
   - Leaderboards?

## 🚨 Critical for Migration

### Must Preserve:

1. All user data and relationships
2. Workout/program structures
3. Payment/subscription data
4. Historical analytics
5. Client progress data
6. Custom branding settings

### API Compatibility:

- Need to maintain v3/v4 API structure
- Session-based auth migration
- Preserve webhook integrations
- Maintain mobile app compatibility

### Business Logic:

1. Multi-tenant isolation
2. Subscription billing cycles
3. Workout assignment workflow
4. Progress tracking algorithms
5. Notification triggers
6. Report generation

This is a MASSIVE enterprise platform - much more than a simple Firebase app!
