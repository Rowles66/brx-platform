# Extracted Frontend Auth - Deletion Review

## Files Already Deleted ✅
- `scraped_brx_content/` - Moved to brx-app-replica/scraped_reference/
- `autonomous_app/` - Moved to brx-app-replica/dev_tools/ai_workflow_from_auth_extract/

## Files Unique to extracted_frontend_auth

### 1. Workout Pages (NOT in brx-app-replica)
- `src/app/workouts/page.tsx` - Full workouts list with filtering
- `src/app/workouts/[id]/page.tsx` - Individual workout detail page  
- `src/app/workout-plans/page.tsx` - Workout plans browser

**Value**: These pages have complete implementations with:
- Status filtering (scheduled/completed/missed)
- Exercise previews
- Proper routing
- Clean UI with BRX colors

### 2. API Routers (Different in brx-app-replica)
- `src/server/api/routers/workout.ts` - Full workout CRUD operations
- `src/server/api/routers/user.ts` - User profile management

**Note**: brx-app-replica has `workouts.ts` (plural) but might be different implementation

### 3. App Configuration
- `src/app/providers.tsx` - tRPC providers setup
- `tailwind.config.ts` - TypeScript version (brx has .js)
- `postcss.config.js` - JavaScript version (brx has .mjs)

### 4. Other Files
- `brx-sitemap-interactive.html` - Interactive sitemap visualization
- `API_TESTING.md` - API testing documentation
- `PROJECT_ARCHITECTURE.md` - Architecture documentation

## Recommendation

Before deleting extracted_frontend_auth entirely, consider:

1. **Copy the workout pages** - They provide functionality not in brx-app-replica
2. **Review API routers** - May have different/better implementations
3. **Keep documentation** - API_TESTING.md and PROJECT_ARCHITECTURE.md

## Quick Actions

To preview what would be deleted:
```bash
# Show all source files
find src -type f -name "*.ts*" | grep -v node_modules

# Show all documentation
find . -name "*.md" -maxdepth 1
```

To copy valuable files before deletion:
```bash
# Copy workout pages
cp -r src/app/workouts ../brx-app-replica/src/app/
cp src/app/workout-plans ../brx-app-replica/src/app/

# Copy documentation
cp API_TESTING.md PROJECT_ARCHITECTURE.md ../brx-app-replica/docs/
``` 