# BRX Platform Analysis

## Overview
The `brx-platform` repository contains brand assets, API documentation, and another nested brx-app-replica. Since this repo is used in other projects, we'll only copy relevant files without deleting anything.

## Valuable Assets to Consider

### 1. Brand Guidelines ⚠️
**Location**: `/brand-guidelines/`

**Key Files**:
- `assets/colors.json` - Contains conflicting colors:
  - Primary Red: #FF6363 (vs #fe3f00 from scraped site)
  - Background Dark 1: #151515
  - Background Dark 2: #202123
- Logo files (SVG format)
- Wordmark files

**Conflict**: These colors differ from the live BRX site. Need decision on which is official.

### 2. API Documentation 📚
**Location**: `/brx-core/api-docs/`

**Valuable Files**:
- `specs/v3/openapi.yaml` - OpenAPI specification
- `docs/v4/swagger.yaml` - Swagger documentation
- `swagger_latest.yaml` - Latest API spec
- `brx_integration_plan.md` - Integration planning document
- Multiple API test results directories

**Value**: These could help understand the actual BRX API structure and endpoints.

### 3. Nested BRX App Replica 🔄
**Location**: `/brx-core/app-replica/brx-app-replica/`

**Notable**:
- Has a `server/` directory with Express.js setup
- Contains middleware and routes
- Has its own package.json and dependencies
- Different architecture than the Next.js app

**Decision Needed**: This appears to be a different implementation (Express vs Next.js).

### 4. Financial Models 💰
**Location**: `/financial-models/`

**Contains**:
- DBT (Data Build Tool) models
- Financial analysis notebooks
- Stripe integration models
- CFO prompts and reporting

**Value**: Business logic and financial calculations that might be needed in the app.

### 5. Custom Development
**Location**: `/brx-core/custom-dev/`

**Contains**:
- App functions
- Extensions
- Webhooks

## Recommendations

### High Priority to Copy:
1. **API Documentation** - Essential for understanding BRX API
2. **Financial Models** (if needed) - Business logic

### Needs Review:
1. **Brand Colors** - Conflict needs resolution
2. **Express Server** - Different architecture, might have unique endpoints

### Lower Priority:
1. **Workspace Config** - Likely project-specific
2. **Test Results** - Historical data

## Copy Commands (if needed)

```bash
# Copy API documentation
cp -r brx-platform/brx-core/api-docs/specs ../brx-app-replica/docs/api-specs/
cp brx-platform/brx-core/api-docs/*.yaml ../brx-app-replica/docs/api-specs/
cp brx-platform/brx-core/api-docs/brx_integration_plan.md ../brx-app-replica/docs/

# Copy brand assets for review
cp brx-platform/brand-guidelines/assets/colors.json ../brx-app-replica/review_later/brand_assets/colors_from_platform.json
```

## Note
Do NOT delete anything from brx-platform as it's used in other projects.

## ✅ What Was Copied

### API Documentation
- `/docs/api-specs/v3/` - OpenAPI v3 specifications
- `/docs/api-specs/swagger_latest.yaml` - Latest Swagger spec
- `/docs/api-specs/brx_integration_plan.md` - Integration planning

### Brand Assets
- `/public/brand/` - Logo and wordmark SVG files
- `/review_later/brand_assets/colors_from_platform.json` - Conflicting color definitions

### Not Copied
- Express server (empty implementation)
- Financial models (not needed yet)
- Firecrawl extractions (duplicate scraped content)
- Test results (historical data)

## Summary
The most valuable assets from brx-platform were the API specifications and brand assets. The Express server implementation was empty, and the firecrawl extractions appear to be duplicates of content we already have. 