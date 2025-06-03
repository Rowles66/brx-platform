# API Router Review

## Routers from extracted_frontend_auth

These routers were copied from extracted_frontend_auth because they might have different implementations than what's in brx-app-replica.

### Files to Review:
1. **workout_from_extracted.ts** 
   - Original: extracted_frontend_auth/src/server/api/routers/workout.ts
   - Compare with: brx-app-replica/src/server/api/routers/workouts.ts (plural)
   - Contains: Full CRUD operations for workouts

2. **user_from_extracted.ts**
   - Original: extracted_frontend_auth/src/server/api/routers/user.ts  
   - Compare with: brx-app-replica/src/server/api/routers/users.ts (plural)
   - Contains: User profile management operations

## Key Differences to Check:
- Naming conventions (workout vs workouts, user vs users)
- Method implementations
- Data structures
- Authentication handling

## Decision Needed:
- [ ] Keep brx-app-replica versions (delete these)
- [ ] Replace with these versions
- [ ] Merge best parts of both
- [ ] Keep both with different names 