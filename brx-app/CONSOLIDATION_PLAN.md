# BRX App Consolidation Plan

## Overview
This document tracks the consolidation of all BRX-related repositories into the primary `brx-app-replica` repository.

## Repository Analysis

### 1. extracted_frontend_auth
**Status**: To be merged/integrated
**Location**: `/Users/joshrowles/github/extracted_frontend_auth`

**Key Contents**:
- Complete authentication flow (login, sign-up)
- Dashboard, profile, progress, schedule pages
- tRPC API setup with auth/user/workout routers
- Scraped BRX content (API calls, HTML, screenshots)
- Mock authentication system

**Unique Assets to Keep**:
- [ ] `/scraped_brx_content/` - Original scraped data from BRX site
- [ ] `/autonomous_app/` - AI workflow documentation
- [ ] API router implementations in `/src/server/api/routers/`
- [ ] Page implementations that might have better features

**Action Items**:
1. Compare page implementations with brx-app-replica versions
2. Move scraped_brx_content to brx-app-replica
3. Merge any superior features from pages
4. Document AI workflow learnings

### 2. extracted_frontend
**Status**: Can be deleted
**Location**: `/Users/joshrowles/github/extracted_frontend`

**Key Contents**:
- Only scraped assets (HTML, CSS, JS, API calls)
- No actual application code
- Appears to be duplicate/subset of extracted_frontend_auth scraped content

**Action Items**:
- [x] Analyzed - contains only scraped content
- [ ] Can be safely deleted after verifying no unique assets

### 3. brx-platform
**Status**: Complex - needs careful review
**Location**: `/Users/joshrowles/github/brx-platform`

**Key Contents**:
- `/brand-guidelines/` - Brand assets and guidelines
- `/brx-core/api-docs/` - API documentation
- `/brx-core/app-replica/brx-app-replica/` - Another app instance with server folder
- `/brx-core/custom-dev/` - Custom development files
- `/financial-models/` - Business/financial modeling
- `/workspace-config/` - Configuration files

**Important Finding**: Contains ANOTHER brx-app-replica nested inside!

**Unique Assets to Review**:
- [ ] Brand guidelines - might have official colors, logos, style guides
- [ ] API documentation - could be valuable reference
- [ ] Financial models - business logic that might need integration
- [ ] Server implementation in nested brx-app-replica

**Action Items**:
1. Extract brand guidelines to brx-app-replica/docs/brand/
2. Review API documentation for missing endpoints
3. Check if nested brx-app-replica has unique server code
4. Evaluate financial models for integration needs

### 4. Other directories to review:
- `brx-backup/`
- `_archive/`
- `_management/`

## Questions for Later Review

### Authentication System
**Question**: Do you want to keep the mock authentication system from extracted_frontend_auth, or implement a real auth system?
- Current mock: localStorage-based with test@example.com
- Alternatives: NextAuth, Clerk, Supabase Auth

### Scraped Content
**Question**: How should we organize the scraped BRX content?
- Option 1: Keep in `/scraped_reference/` (current in brx-app-replica)
- Option 2: Create `/docs/original_site_reference/`
- Option 3: Move to cloud storage and reference

### API Structure
**Question**: Which API pattern do you prefer?
- tRPC (currently in extracted_frontend_auth)
- REST API routes
- GraphQL

## Consolidation Steps

### Phase 1: Analysis (Current)
- [x] Analyze extracted_frontend_auth
- [x] Analyze extracted_frontend
- [x] Analyze brx-platform
- [ ] Review other directories

### Actions Completed
- [x] Moved scraped_brx_content to brx-app-replica/scraped_reference/auth_extract_scraped_content
- [x] Moved autonomous_app AI docs to brx-app-replica/dev_tools/ai_workflow_from_auth_extract
- [x] Created review_later directory structure
- [x] Created auth system review questions
- [x] Created brand colors review questions

### Phase 2: Planning
- [ ] Identify duplicate files
- [ ] Determine best implementations
- [ ] Create migration checklist

### Phase 3: Execution
- [ ] Move unique assets
- [ ] Merge superior implementations
- [ ] Update imports and dependencies
- [ ] Test functionality

### Phase 4: Cleanup
- [ ] Delete redundant repositories
- [ ] Update documentation
- [ ] Create backup of deleted repos 