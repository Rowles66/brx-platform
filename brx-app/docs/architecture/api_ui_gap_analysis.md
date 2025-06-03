# API-UI Gap Analysis Report

## Overview
This report identifies features that appear in the API documentation but lack UI evidence, and vice versa, providing actionable insights for MVP development prioritization.

## Gap Categories

### 🔴 High-Risk API-Only Features
**Features with API endpoints but no corresponding UI evidence**

| Feature | API Endpoints | Risk Level | Recommendation | Action Required |
|---------|---------------|------------|----------------|------------------|
| **Legacy Workout Components** | `/api/v3/workout_exercise_sets`<br>`/api/v3/plan_blocks`<br>`/api/v3/plan_exercises` | HIGH | Investigate if deprecated or if UI needed | Audit with dev team |
| **User Plan Management** | `/api/v4/user_plans/*` (5 endpoints) | MEDIUM | Determine if admin-only or missing UI | Check user workflows |
| **Platform Information** | `/api/v2/platforms/current` | LOW | System-level, likely no UI needed | No action |

#### Detailed API-Only Analysis:

**1. Legacy v3 Endpoints (High Priority Investigation)**
- `POST /api/v3/workout_exercise_sets` - Create workout exercise sets
- `PUT /api/v3/workout_exercise_sets/{id}` - Update workout exercise sets  
- `DELETE /api/v3/workout_exercise_sets/{id}` - Delete workout exercise sets
- `POST /api/v3/plan_blocks` - Create plan blocks
- `PUT /api/v3/plan_blocks/{id}` - Update plan blocks
- `DELETE /api/v3/plan_blocks/{id}` - Delete plan blocks
- `POST /api/v3/plan_exercises` - Create plan exercises
- `PUT /api/v3/plan_exercises/{id}` - Update plan exercises
- `DELETE /api/v3/plan_exercises/{id}` - Delete plan exercises

**Risk Assessment**: These may be legacy endpoints that are being replaced by v4 equivalents, or they may be missing critical UI components.

**Recommendation**: 
1. Check if v4 equivalents exist for all functionality
2. Verify if these are admin-only features
3. Determine deprecation timeline

**2. User Plans Management (Medium Priority)**
- `GET /api/v4/user_plans` - List user plans
- `POST /api/v4/user_plans` - Create user plan
- `GET /api/v4/user_plans/{id}` - Show user plan
- `PUT /api/v4/user_plans/{id}` - Update user plan
- `DELETE /api/v4/user_plans/{id}` - Delete user plan
- `POST /api/v4/user_plans/{id}/pause` - Pause user plan
- `GET /api/v4/user_plans/{id}/next_workout` - Get next workout

**Risk Assessment**: Full CRUD operations exist but no UI evidence found. This could be a significant missing feature.

**Recommendation**:
1. Check if this is admin-only functionality
2. Verify if UI exists under different URL patterns
3. Assess if this should be high-priority MVP feature

### 🟢 Positive Validation: No UI-Only Features
**All identified UI features have corresponding API endpoints**

This is a positive finding indicating:
- Good alignment between frontend and backend development
- No orphaned UI components without API support
- Strong evidence that scraped UI features are implementable

### 🟡 Features Requiring Deeper Investigation

| Feature Category | Issue | Investigation Needed |
|------------------|-------|---------------------|
| **API Version Consistency** | Mixed v3/v4 usage in workout features | Verify migration strategy |
| **Business Management Complexity** | 40+ endpoints for FBM features | Break into smaller MVP components |
| **Runtime vs Documentation** | Only 4 runtime calls vs 136 documented APIs | Validate which APIs are actively used |

## Gap Impact on RICE Scoring

### Confidence Score Adjustments

| Evidence Type | Original Confidence | Weight Applied | Final Confidence | Rationale |
|---------------|-------------------|----------------|------------------|------------|
| API + UI + Runtime | 6-7 | 1.5x | 9 | Highest validation |
| API + UI | 5-6 | 1.3x | 7-8 | Strong validation |
| API Only | 4-5 | 0.8x | 3-4 | Reduced confidence |
| UI Only | 4-5 | 0.8x | 3-4 | Reduced confidence |
| Runtime Only | 7-8 | 1.0x | 7-8 | Baseline |

### Impact on Feature Prioritization

**Features Promoted** (due to strong API+UI evidence):
- Authentication (RICE: 405)
- User Management (RICE: 149)
- Workout Management (RICE: 146)

**Features Demoted** (due to API-only evidence):
- Legacy "Other" features (RICE: 15)
- User Plans (needs investigation)

## Recommendations by Priority

### Immediate Actions (This Sprint)
1. **Audit Legacy v3 Endpoints**
   - Meet with backend team to understand v3 vs v4 strategy
   - Identify which endpoints are deprecated
   - Plan migration timeline if needed

2. **Investigate User Plans Feature**
   - Check if UI exists under different URLs
   - Verify if this is admin-only functionality
   - Assess MVP importance based on user workflows

### Short-term Actions (Next 2-4 Weeks)
1. **Validate Runtime API Usage**
   - Expand network request capture to more user flows
   - Compare documented APIs vs actually used APIs
   - Identify most critical endpoints for MVP

2. **Break Down Complex Features**
   - Split Business Management into smaller components
   - Prioritize appointment scheduling over complex location management
   - Focus on core workflows for MVP

### Long-term Actions (Future Sprints)
1. **Complete API-UI Mapping**
   - Add UI evidence for any missing user plan interfaces
   - Implement high-priority features lacking UI
   - Modernize v3 endpoints to v4 where appropriate

## Quality Assurance Checklist

Before implementing any feature, verify:
- [ ] API endpoints exist and are documented
- [ ] UI mockups or existing pages identified
- [ ] Runtime network requests confirm actual usage
- [ ] API version consistency (prefer v4 over v3)
- [ ] CRUD operations are complete
- [ ] Authentication requirements are clear

## Success Metrics

### Gap Reduction Targets
- **Eliminate all high-risk API-only gaps** within 2 sprints
- **Validate or implement user plan UI** within 1 month  
- **Achieve 95% API-UI correlation** for MVP features
- **Modernize all v3 endpoints** to v4 within 3 months

### Evidence Strength Goals
- **80% of MVP features** should have API + UI + Runtime evidence
- **No features with RICE < 50** should be in Phase 1 MVP
- **All Phase 1 features** should have confidence scores ≥ 8

---

*This gap analysis is based on ui_api_mapping_matrix.csv and should be updated as new evidence emerges from development and testing.*

