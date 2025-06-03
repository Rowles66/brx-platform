# BRX App + Domain + HubSpot Integration: Implementation Plan

## Executive Summary

This document outlines the implementation plan for integrating HubSpot tracking and personalization tools with the BRX Performance app (hosted at online.brxperformance.com via Exercise.com) without disrupting the app's functionality. The plan addresses DNS configuration issues, SSL certificate setup, webhook configuration, and HubSpot integration details.

## 1. Current State Analysis

Based on our diagnostic findings:

### 1.1 DNS Configuration
- ✅ `online.brxperformance.com` correctly has a CNAME record pointing to `brxperformance.exercise.com`
- ❌ `www.online.brxperformance.com` incorrectly has a CNAME record pointing to `brxperformance.exercise.com` (should point to `online.brxperformance.com`)
- Both domains resolve to Google-hosted IPs (64.233.176.121 and 108.177.122.121)

### 1.2 SSL Certificates
- ✅ `online.brxperformance.com` has a valid SSL certificate issued by Google Trust Services
  - Valid until: June 24, 2025
- ❌ `www.online.brxperformance.com` does not have a valid SSL certificate

### 1.3 Webhook Functionality
- ❌ The `/webhooks/test` endpoint on `online.brxperformance.com` returns a 404 "Page not found" error
- ❌ Requests to `www.online.brxperformance.com` fail completely

### 1.4 Application Status
- ✅ `online.brxperformance.com` correctly redirects to a login page
- ✅ Proper security headers are in place (X-Frame-Options, X-XSS-Protection, Strict-Transport-Security)
- ❌ `www.online.brxperformance.com` is not accessible

## 2. DNS Configuration Correction

### 2.1 Update GoDaddy DNS Records

1. Log in to the GoDaddy account managing the `brxperformance.com` domain
2. Navigate to DNS Management for the domain
3. Locate the CNAME record for `www.online`
4. Modify the record with the following values:
   - Host: `www.online`
   - Points to: `online.brxperformance.com` (instead of `brxperformance.exercise.com`)
   - TTL: 1 Hour (or default)

### 2.2 Verify DNS Propagation

After making the changes, verify the propagation using:

```bash
# Check CNAME record
dig www.online.brxperformance.com CNAME +short

# Expected result:
# online.brxperformance.com.
```

Note: DNS changes can take up to 48 hours to fully propagate, though typically complete within 1-4 hours.

## 3. SSL Certificate Setup

### 3.1 Exercise.com SSL Configuration

Since the app is hosted on Exercise.com, coordinate with their support team to ensure SSL coverage for both domains:

1. Contact Exercise.com support with the following information:
   - Primary domain: `online.brxperformance.com`
   - Additional domain: `www.online.brxperformance.com`
   - Current certificate expiration: June 24, 2025
   - Request: Add `www.online.brxperformance.com` to the SSL certificate

2. Provide Exercise.com with verification that you own both domains (they may require specific DNS TXT records to be added for verification)

### 3.2 Alternative: Let's Encrypt Certificate (If Exercise.com Cannot Help)

If Exercise.com cannot add the domain to their certificate:

1. Use Let's Encrypt to generate a certificate for `www.online.brxperformance.com`
2. Install the certificate on your proxy server or CDN
3. Configure the proxy to forward requests to Exercise.com's servers

### 3.3 Verify SSL Certificate

After the certificate is set up, verify using:

```bash
# Check SSL certificate
echo | openssl s_client -connect www.online.brxperformance.com:443 -servername www.online.brxperformance.com 2>/dev/null | openssl x509 -noout -issuer -subject -dates
```

## 4. Webhook Configuration

### 4.1 Coordinate with Exercise.com for Webhook Endpoints

1. Contact Exercise.com support to:
   - Confirm available webhook endpoints on their platform
   - Request activation of the `/webhooks/test` endpoint for testing purposes
   - Identify what other webhook endpoints should be enabled (e.g., `/webhooks/hubspot`)

2. Document the available webhook endpoints, required parameters, and expected responses

### 4.2 Configure HubSpot Webhooks

1. In HubSpot, navigate to Settings > Integrations > Webhooks
2. Create new webhooks with the following configurations:
   - Webhook URL: `https://online.brxperformance.com/webhooks/hubspot`
   - Events to trigger webhook: Select relevant events (contact creation, form submissions, etc.)
   - Authentication method: Secret key (recommended)

3. Store the webhook secret key securely for implementation in the next step

### 4.3 Implement Webhook Handler on Exercise.com

Work with Exercise.com to implement proper webhook handlers:

```javascript
// Pseudocode for webhook handler
app.post('/webhooks/hubspot', (req, res) => {
  // Verify HubSpot signature using secret key
  const isValid = verifyHubSpotSignature(req.headers['x-hubspot-signature'], secretKey, req.body);
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook payload
  const eventType = req.body.eventType;
  const objectId = req.body.objectId;
  
  // Handle different event types
  switch (eventType) {
    case 'contact.creation':
      // Logic for new contact
      break;
    case 'form.submission':
      // Logic for form submission
      break;
    // Other event types
  }
  
  // Respond to HubSpot
  res.status(200).send('Webhook received');
});
```

## 5. HubSpot Integration Implementation

### 5.1 Add HubSpot Tracking Code

1. Obtain your HubSpot tracking code from HubSpot portal (Settings > Tracking Code)
2. Coordinate with Exercise.com to add the tracking code to the app layout template:

```html
<!-- HubSpot Tracking Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/XXXXXXX.js"></script>
```

3. Place the code just before the closing `</head>` tag in all page templates

### 5.2 Set Up HubSpot API Integration

1. Create a HubSpot Private App in your HubSpot portal:
   - Navigate to Settings > Integrations > Private Apps
   - Create a new private app with the necessary scopes:
     - `contacts`
     - `forms`
     - `timeline`
     - Any other required scopes

2. Store the API key securely for server-side integration

3. Implement server-side integration with HubSpot API:

```javascript
// Pseudocode for HubSpot API integration
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ apiKey: 'YOUR_API_KEY' });

// Example: Create or update a contact
async function syncUserToHubSpot(user) {
  try {
    const contactObj = {
      properties: {
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        phone: user.phone,
        // Add custom properties as needed
        brx_user_id: user.id,
        last_login: new Date().toISOString()
      }
    };
    
    const result = await hubspotClient.crm.contacts.basicApi.create(contactObj);
    return result;
  } catch (error) {
    console.error('Error syncing user to HubSpot:', error);
    throw error;
  }
}
```

### 5.3 API Integration Details

#### 5.3.1 Authentication with Exercise.com API

The Exercise.com API (v4) uses Bearer token authentication:

1. Obtain API credentials from your Exercise.com dashboard or by contacting support
2. Generate a Bearer token using the following approach:

```javascript
// Pseudocode for obtaining Bearer token
async function getExerciseApiToken() {
  const response = await fetch('https://online.brxperformance.com/api/v4/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: 'YOUR_API_KEY',
      api_secret: 'YOUR_API_SECRET'
    })
  });
  
  const data = await response.json();
  return data.access_token; // Store this securely
}
```

3. Use the Bearer token in all API requests:

```javascript
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = await getExerciseApiToken();
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`https://online.brxperformance.com/api/v4/${endpoint}`, options);
  return response.json();
};
```

#### 5.3.2 Key API Endpoints for HubSpot Integration

Based on the Exercise.com API v4 Swagger documentation, the following endpoints are likely available and relevant for HubSpot integration:

1. **User Management Endpoints**:
   - `GET /api/v4/users` - List all users
   - `GET /api/v4/users/{id}` - Get user details
   - `POST /api/v4/users` - Create a new user
   - `PUT /api/v4/users/{id}` - Update user details
   - `GET /api/v4/users/{id}/workouts` - Get user's workouts

2. **Workout and Activity Endpoints**:
   - `GET /api/v4/workouts` - List all workouts
   - `GET /api/v4/workouts/{id}` - Get workout details
   - `GET /api/v4/activities` - List all activities
   - `GET /api/v4/activities/{id}` - Get activity details

3. **Subscription and Billing Endpoints**:
   - `GET /api/v4/subscriptions` - List all subscriptions
   - `GET /api/v4/subscriptions/{id}` - Get subscription details
   - `GET /api/v4/invoices` - List all invoices

4. **Event and Webhook Endpoints**:
   - `POST /api/v4/webhooks` - Register a new webhook
   - `GET /api/v4/events` - List tracked events
   - `POST /api/v4/events` - Create a custom event

#### 5.3.3 Data Mapping Between Exercise.com and HubSpot

Map key data fields between Exercise.com and HubSpot for seamless integration:

| Exercise.com Field | HubSpot Field | Notes |
|-------------------|---------------|-------|
| `user.email` | `contact.email` | Primary identifier |
| `user.first_name` | `contact.firstname` | |
| `user.last_name` | `contact.lastname` | |
| `user.phone` | `contact.phone` | |
| `user.id` | `contact.brx_user_id` | Custom property in HubSpot |
| `user.created_at` | `contact.createdate` | |
| `subscription.plan_name` | `contact.brx_subscription_plan` | Custom property in HubSpot |
| `subscription.status` | `contact.brx_subscription_status` | Custom property in HubSpot |
| `user.last_login` | `contact.brx_last_login` | Custom property in HubSpot |
| `workout.name` | Event property | For custom events |
| `workout.completed_at` | Event property | For custom events |

Create these custom properties in HubSpot before starting the integration:

```javascript
// Pseudocode for creating custom properties in HubSpot
async function createCustomProperties() {
  const properties = [
    {
      name: 'brx_user_id',
      label: 'BRX User ID',
      groupName: 'contactinformation',
      type: 'string',
      fieldType: 'text'
    },
    {
      name: 'brx_subscription_plan',
      label: 'BRX Subscription Plan',
      groupName: 'contactinformation',
      type: 'string',
      fieldType: 'text'
    },
    // Add other custom properties
  ];
  
  for (const property of properties) {
    await hubspotClient.properties.coreApi.create('contacts', property);
  }
}
```

#### 5.3.4 API Integration Best Practices

1. **Rate Limiting Considerations**:
   - Implement exponential backoff for API requests
   - Cache responses when appropriate
   - Respect Exercise.com and HubSpot rate limits

```javascript
// Example of exponential backoff implementation
async function fetchWithRetry(url, options, retries = 3, backoff = 300) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries <= 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, backoff));
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}
```

2. **Error Handling**:
   - Log all API errors with context
   - Set up alerting for critical failures
   - Implement dead-letter queues for failed operations

3. **Security Best Practices**:
   - Store API credentials securely (use environment variables or a secrets manager)
   - Implement HTTPS for all API calls
   - Use minimal required permission scopes
   - Rotate API keys periodically

4. **Performance Optimization**:
   - Use pagination for large data sets
   - Implement parallel processing where possible
   - Use batch operations when available

#### 5.3.5 Synchronization Approaches

1. **Real-time Synchronization with Webhooks**:

```javascript
// Exercise.com webhook handler
app.post('/api/v4/webhooks/callback', async (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'user.created':
    case 'user.updated':
      await syncUserToHubSpot(data.user);
      break;
    case 'subscription.created':
    case 'subscription.updated':
      await updateHubSpotSubscription(data.user_id, data.subscription);
      break;
    case 'workout.completed':
      await trackWorkoutInHubSpot(data.user_id, data.workout);
      break;
  }
  
  res.status(200).send('Webhook processed');
});
```

2. **Batch Synchronization for Historical Data**:

```javascript
// Pseudocode for batch synchronization
async function batchSyncUsers(page = 1, pageSize = 100) {
  // Fetch users from Exercise.com API
  const users = await apiRequest(`users?page=${page}&limit=${pageSize}`);
  
  // Process each user
  for (const user of users.data) {
    await syncUserToHubSpot(user);
  }
  
  // Recursively process next page if there are more users
  if (users.pagination.has_more) {
    await batchSyncUsers(page + 1, pageSize);
  }
}
```

3. **Scheduled Incremental Synchronization**:

```javascript
// Pseudocode for incremental sync
async function incrementalSync(since) {
  // Get resources updated since the last sync
  const updatedUsers = await apiRequest(`users?updated_since=${since}`);
  const updatedSubscriptions = await apiRequest(`subscriptions?updated_since=${since}`);
  const updatedWorkouts = await apiRequest(`workouts?updated_since=${since}`);
  
  // Sync updated users to HubSpot
  for (const user of updatedUsers.data) {
    await syncUserToHubSpot(user);
  }
  
  // Sync updated subscriptions
  for (const subscription of updatedSubscriptions.data) {
    await updateHubSpotSubscription(subscription.user_id, subscription);
  }
  
  // Record workouts as events
  for (const workout of updatedWorkouts.data) {
    await trackWorkoutInHubSpot(workout.user_id, workout);
  }
  
  // Return current timestamp for next sync
  return new Date().toISOString();
}

// Schedule to run every hour
// store lastSyncTimestamp in database or file
```

### 5.4 Set Up Custom Events Tracking

1. Create custom behavioral events in HubSpot:
   - Navigate to Settings > Properties > Behavioral Events
   - Create events for important user actions (e.g., "Completed Workout", "Updated Profile")

2. Implement client-side tracking for these events:

```javascript
// Client-side custom event tracking
window._hsq = window._hsq || [];
function trackCustomEvent(eventName, properties) {
  window._hsq.push(["trackCustomBehavioralEvent", {
    name: eventName,
    properties: properties
  }]);
}

// Example usage
trackCustomEvent("Completed Workout", {
  workoutName: "High Intensity Training",
  duration: 45,
  caloriesBurned: 320
});
```

### 5.4 Set Up Data Integration Automation

#### Option A: Using Make (formerly Integromat)

1. Create a new scenario in Make
2. Add a webhook trigger for Exercise.com events
3. Add HubSpot actions to:
   - Create/update contacts
   - Add to lists
   - Trigger workflows
   - Log custom events

#### Option B: Using Retool

1. Create a new Retool application for monitoring and managing the integration
2. Connect to both Exercise.com API and HubSpot API
3. Implement scheduled jobs to sync data between platforms
4. Create admin dashboards for monitoring the integration status

## 6. Testing and Verification

### 6.1 DNS and SSL Testing

1. Verify DNS configuration:
```bash
dig online.brxperformance.com +short
dig www.online.brxperformance.com +short
dig online.brxperformance.com CNAME +short
dig www.online.brxperformance.com CNAME +short
```

2. Verify SSL certificates:
```bash
echo | openssl s_client -connect online.brxperformance.com:443 -servername online.brxperformance.com 2>/dev/null | openssl x509 -noout -issuer -subject -dates
echo | openssl s_client -connect www.online.brxperformance.com:443 -servername www.online.brxperformance.com 2>/dev/null | openssl x509 -noout -issuer -subject -dates
```

### 6.2 Webhook Testing

1. Test webhook endpoints:
```bash
curl -X POST https://online.brxperformance.com/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"ping":"test-online"}' -v

curl -X POST https://www.online.brxperformance.com/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"ping":"test-www-online"}' -v
```

2. Verify HubSpot webhook delivery:
   - Trigger test events in HubSpot
   - Check webhook logs in your application

### 6.3 HubSpot Integration Testing

1. Test tracking code installation:
   - Visit both domains in an incognito/private window
   - Use HubSpot's debugging tool (`?hsDebug=true` added to URL)
   - Verify that the HubSpot tracking script is loaded
   - Confirm that the `hubspotutk` cookie is set

2. Test contact syncing:
   - Create a test user in the BRX app
   - Verify the contact appears in HubSpot with correct properties

3. Test custom events:
   - Trigger custom events from the BRX app
   - Verify events are recorded in HubSpot

4. Test automation flows:
   - Trigger events in Exercise.com
   - Verify that corresponding actions occur in HubSpot

## 7. Going Live and Monitoring

### 7.1 Staged Rollout

1. Deploy changes to a staging environment first
2. Test thoroughly in staging
3. Schedule the production deployment during a low-traffic period
4. Implement gradually (e.g., for a subset of users first)

### 7.2 Monitoring

1. Set up monitoring for:
   - DNS resolution
   - SSL certificate validity
   - Webhook delivery success rates
   - API call success rates
   - User tracking data collection

2. Create alerting for critical failures

### 7.3 Documentation

1. Document the final integration architecture
2. Create troubleshooting guides for common issues
3. Provide user guides for HubSpot features related to BRX app data

## Appendix A: Relevant Command Reference

```bash
# DNS Checks
dig online.brxperformance.com +short
dig www.online.brxperformance.com +short
dig online.brxperformance.com CNAME +short
dig www.online.brxperformance.com CNAME +short

# SSL Checks
echo | openssl s_client -connect online.brxperformance.com:443 -servername online.brxperformance.com 2>/dev/null | openssl x509 -noout -issuer -subject -dates
echo | openssl s_client -connect www.online.brxperformance.com:443 -servername www.online.brxperformance.com 2>/dev/null | openssl x509 -noout -issuer -subject -dates

# Webhook Tests
curl -X POST https://online.brxperformance.com/webhooks/test -H "Content-Type: application/json" -d '{"ping":"test-online"}' -v
curl -X POST https://www.online.brxperformance.com/webhooks/test -H "Content-Type: application/json" -d '{"ping":"test-www-online"}' -v

# Header Checks
curl -s -D - https://online.brxperformance.com -o /dev/null
curl -s -D - https://www.online.brxperformance.com -o /dev/null
```

## Appendix B: Contact Information

- Exercise.com Support: support@exercise.com
- HubSpot Support: https://help.hubspot.com/
- GoDaddy DNS Support: https://www.godaddy.com/help
- BRX Technical Contact: [Add BRX technical contact info]

