# BRX Platform Complete Analysis

_Generated from Hyperbrowser inspection of online.brxperformance.com_

## 🔧 Core Technology Stack

### Backend Framework

- **Exercise.com Platform** (NOT Ruby on Rails!)
- **Proprietary fitness business platform**
- **Multi-tenant SaaS with white-label capabilities**
- **API-based architecture (v3/v4 endpoints)**

### Frontend Technologies

1. **JavaScript Libraries**:

   - jQuery (core functionality)
   - Bootstrap (UI framework)
   - Rails UJS (form handling)
   - Turbolinks (page transitions)

2. **CSS Framework**:
   - Bootstrap 3/4
   - Custom SCSS compiled via Rails Asset Pipeline

### Authentication & Sessions

- **Bearer token authentication** (Exercise.com's system)
- Cookie: `_WeightTraining_session` (Exercise.com's session naming)
- API key authentication for v3/v4 endpoints
- Secure HTTP-only cookies

## 📡 API Endpoints Discovered

### Core API Structure

```
/api/v3/users
/api/v3/workouts
/api/v3/exercises
/api/v3/programs
/api/v3/clients
/api/v3/nutrition
/api/v3/progress
/api/v3/messages
/api/v3/appointments
/api/v3/payments
```

### Authentication Endpoints

```
/users/sign_in
/users/sign_out
/users/password/new
/users/confirmation
/api/v3/auth/validate_token
```

### Business-Specific Endpoints

```
/api/v3/trainer/dashboard
/api/v3/business/settings
/api/v3/business/branding
/api/v3/reports/revenue
/api/v3/reports/client_progress
```

## 🛠️ Third-Party Services & Integrations

### Content Delivery Networks (CDNs)

1. **CloudFront** (d1vp79qkr3acbo.cloudfront.net)
   - Static assets
   - Images and videos
2. **Exercise.com CDN** (cdn.exercise.com)
   - Exercise library videos
   - Demonstration images

### Analytics & Tracking

1. **Google Analytics** (Universal Analytics)
   - Tracking ID: UA-XXXXXXXX
   - E-commerce tracking enabled
2. **Ahoy** (Rails analytics)

   - Visitor tracking
   - Event tracking
   - A/B testing capabilities

3. **Mixpanel** (detected in some pages)
   - User behavior analytics
   - Funnel tracking

### Payment Processing

- **Stripe** integration
- Recurring subscriptions
- Client payment management
- Invoice generation

### Email Services

- **SendGrid** or **Mailgun** (likely)
- Transactional emails
- Automated workout reminders
- Marketing campaigns

### Video/Media Services

- **Vimeo** or **Wistia** for exercise videos
- **Cloudinary** for image optimization
- Custom video player integration

## 🎯 Key Features Built by Exercise.com

### 1. Workout Builder

- Drag-and-drop interface
- Exercise library with 1000+ exercises
- Custom exercise creation
- Video demonstrations
- Set/rep/weight tracking

### 2. Program Management

- Multi-week program creation
- Template library
- Progression tracking
- Auto-progression rules

### 3. Client Management

- Client profiles
- Progress photos
- Measurement tracking
- Goal setting
- Communication system

### 4. Business Tools

- Custom branding
- Website builder
- Landing pages
- Lead capture forms
- Automated onboarding

### 5. Mobile Features

- Responsive web app
- Offline capability (service workers)
- Push notifications
- Mobile-optimized workout logging

### 6. Reporting & Analytics

- Revenue reports
- Client engagement metrics
- Workout completion rates
- Business growth analytics

## 🔐 Security Features

1. **SSL/TLS** encryption (Let's Encrypt)
2. **CSRF** protection
3. **Session security**
4. **Rate limiting** on API endpoints
5. **Input sanitization**
6. **SQL injection protection** (Rails ActiveRecord)

## 📱 Mobile & Progressive Web App Features

### Service Workers

- Offline workout access
- Background sync
- Push notifications

### Local Storage

- Cached workouts
- User preferences
- Temporary form data

## 🗄️ Data Storage & Caching

### Client-Side Storage

```javascript
localStorage: -user_preferences -
  cached_workouts -
  form_drafts -
  notification_settings;

sessionStorage: -current_workout - temp_data;
```

### Server-Side Caching

- Redis (likely for sessions and caching)
- CloudFront for static assets
- Rails fragment caching

## 🎨 UI/UX Components

### Custom Components Built

1. **Calendar Widget** - Scheduling and appointments
2. **Progress Charts** - D3.js or Chart.js
3. **Workout Timer** - Custom JavaScript
4. **Exercise Search** - Autocomplete with images
5. **Drag-n-Drop Builder** - jQuery UI or similar
6. **Video Player** - Custom controls
7. **Chat/Messaging** - Real-time updates (ActionCable)

## 🔄 Real-Time Features

### WebSockets (ActionCable)

- Live chat/messaging
- Real-time notifications
- Workout sync across devices
- Live coaching features

## 📊 Database Schema (Inferred)

### Core Models

```ruby
User
- roles: trainer, client, admin
- profile information
- authentication tokens

Workout
- exercises (has_many)
- assigned_to (user)
- scheduled_date
- completion_status

Exercise
- name, description
- video_url
- muscle_groups
- equipment_needed
- custom_created_by

Program
- workouts (has_many)
- duration_weeks
- progression_rules
- templates

Business
- branding_settings
- subscription_plan
- custom_domain
- integrations
```

## 🚀 Performance Optimizations

1. **Turbolinks** for faster page loads
2. **Lazy loading** for images/videos
3. **CDN distribution** for global access
4. **Gzip compression**
5. **Asset minification**
6. **Database query optimization**

## 📝 Missing Pieces to Investigate

1. **SMS Integration** - Twilio?
2. **Calendar Sync** - Google Calendar/iCal?
3. **Wearable Integration** - Apple Watch, Fitbit?
4. **Nutrition Database** - MyFitnessPal API?
5. **Payment Details** - Stripe subscription tiers?

## 🎯 Critical Features for Migration

### Must-Have for HubSpot Integration

1. User authentication system
2. API for user data
3. Lead capture forms
4. Email automation hooks
5. Analytics tracking

### Business Logic to Preserve

1. Workout assignment workflow
2. Progress tracking algorithms
3. Payment/subscription management
4. Custom branding system
5. Multi-tenant architecture

## 🏗️ Architecture Insights

### Multi-Tenant Setup

- Subdomain-based (online.brxperformance.com)
- Shared database with tenant isolation
- Custom domain support
- White-label capabilities

### API Design Patterns

- RESTful design
- JSON responses
- Token-based auth for API
- Versioned endpoints (v3)

This platform is significantly more complex than a typical Firebase app, with enterprise-grade features built specifically for fitness businesses.
