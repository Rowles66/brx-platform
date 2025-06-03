# BRX Performance API Testing Guide

## Overview
This guide demonstrates how to test the tRPC API endpoints of the BRX Performance app.

## Base URL
- Development: `http://localhost:3000/api/trpc`

## Available Endpoints

### Authentication

#### Sign In
```bash
curl -X POST http://localhost:3000/api/trpc/auth.signIn \
  -H "Content-Type: application/json" \
  -d '{
    "0": {
      "json": {
        "email": "test@example.com",
        "password": "password123",
        "rememberMe": true
      }
    }
  }'
```

Expected Response:
```json
{
  "result": {
    "data": {
      "json": {
        "user": {
          "id": "226676",
          "email": "test@example.com",
          "name": "Test User",
          "role": "athlete"
        },
        "authToken": "MjI2Njc2OjE3NDg1NDczMjEwMDA="
      }
    }
  }
}
```

### Workout Endpoints

#### Get Workouts
```bash
curl -X POST http://localhost:3000/api/trpc/workout.getWorkouts \
  -H "Content-Type: application/json" \
  -d '{
    "0": {
      "json": {
        "page": 1,
        "perPage": 10,
        "status": "all"
      }
    }
  }'
```

#### Get Single Workout
```bash
curl -X POST http://localhost:3000/api/trpc/workout.getWorkout \
  -H "Content-Type: application/json" \
  -d '{
    "0": {
      "json": {
        "id": "1"
      }
    }
  }'
```

#### Get Exercises
```bash
curl -X POST http://localhost:3000/api/trpc/workout.getExercises \
  -H "Content-Type: application/json" \
  -d '{
    "0": {
      "json": {
        "search": "bench",
        "category": "Chest"
      }
    }
  }'
```

## Testing in Browser Console

You can also test the API directly from the browser console when on the app:

```javascript
// Get the tRPC client from the window (if exposed)
// Or use fetch directly:

// Test authentication
fetch('http://localhost:3000/api/trpc/auth.signIn', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "0": {
      "json": {
        "email": "test@example.com",
        "password": "password123"
      }
    }
  })
})
.then(res => res.json())
.then(data => console.log(data));

// Get workouts
fetch('http://localhost:3000/api/trpc/workout.getWorkouts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "0": {
      "json": {
        "page": 1,
        "perPage": 10
      }
    }
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Testing with Postman/Insomnia

1. **Base URL**: `http://localhost:3000/api/trpc`
2. **Method**: POST for all endpoints
3. **Headers**: 
   - `Content-Type: application/json`
4. **Body Format**: tRPC batch format
   ```json
   {
     "0": {
       "json": {
         // Your input parameters here
       }
     }
   }
   ```

## Common Test Scenarios

### 1. User Authentication Flow
1. Sign in with test credentials
2. Store the authToken
3. Use token for protected endpoints

### 2. Workout Management Flow
1. Get list of workouts
2. View individual workout details
3. Complete a workout with notes

### 3. User Profile Flow
1. Get current user info
2. Update profile details
3. Check required items

## Error Responses

### Invalid Credentials
```json
{
  "error": {
    "message": "Invalid email or password",
    "code": "UNAUTHORIZED"
  }
}
```

### Not Authenticated
```json
{
  "error": {
    "message": "UNAUTHORIZED",
    "code": "UNAUTHORIZED"
  }
}
```

### Resource Not Found
```json
{
  "error": {
    "message": "Workout not found"
  }
}
```

## Mock Data Reference

### Test User
- Email: `test@example.com`
- Password: `password123`
- ID: `226676`
- Role: `athlete`

### Sample Workouts
1. Upper Body Strength (ID: 1)
2. Lower Body Power (ID: 2)
3. HIIT Cardio (ID: 3)

### Sample Exercises
- Bench Press (Chest)
- Squats (Legs)
- Deadlifts (Back)
- Pull-ups (Back)
- Dips (Chest) 