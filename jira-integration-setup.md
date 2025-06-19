# Jira Integration Setup for BRX Platform

## 🎯 **Jira Project Structure**

### **Project Configuration**
```
Project Name: BRX Platform Migration
Project Key: BRX
Project Type: Software Development
Template: Kanban
```

### **Epic Structure**
```
Epic 1: Database Foundation (COMPLETE ✅)
├── BRX-1: Supabase Connection Setup
├── BRX-2: Schema Extension (15 tables)
├── BRX-3: Data Import Pipeline
└── BRX-4: API Documentation Update

Epic 2: FBM Business Tables (IN PROGRESS 🚧)
├── BRX-5: FbmService Implementation
├── BRX-6: FbmLocation & Scheduling
├── BRX-7: FbmAppointment System
├── BRX-8: FbmVisit Tracking
├── BRX-9: FbmPackage Management
└── BRX-10: Payment Integration

Epic 3: Enhanced Workout System
├── BRX-11: WorkoutBlock Implementation
├── BRX-12: Equipment Management
├── BRX-13: Advanced Exercise Sets
└── BRX-14: Program Planning

Epic 4: Communication & Social
├── BRX-15: Conversation System
├── BRX-16: Group Management
├── BRX-17: Resource Sharing
└── BRX-18: Notification System
```

### **Custom Fields**
```
- Database Table (Single Select)
- API Endpoint (Text)
- Prisma Model (Text) 
- tRPC Router (Text)
- Frontend Component (Text)
- BRX API Coverage (Number: 0-100%)
- Revenue Impact (Select: High, Medium, Low)
- Implementation Complexity (Story Points: 1-13)
```

### **Issue Types**
```
- Epic: Major feature areas
- Story: User-facing functionality
- Task: Technical implementation
- Bug: Issues and fixes
- Spike: Research and investigation
```

### **Workflow States**
```
Open → In Progress → Code Review → Testing → Done
            ↓
        Blocked (if dependencies not ready)
```

## 🔧 **Jira Integration Tools**

### **1. Jira CLI (Recommended)**
```bash
# Install Jira CLI
npm install -g jira-cli

# Configure
jira config

# Create issues from command line
jira create story "Implement FbmService model" \
  --project BRX \
  --assignee josh.rowles \
  --priority High \
  --components "Database,API"
```

### **2. Git Integration**
```bash
# Smart commits for automatic updates
git commit -m "BRX-5 Add FbmService Prisma model

- Define service schema with pricing
- Add relationships to locations
- Include availability scheduling
- Add service category enum

#time 2h #comment Model implementation complete"
```

### **3. GitHub Integration**
```yaml
# .github/workflows/jira-integration.yml
name: Jira Integration
on:
  pull_request:
    types: [opened, closed]
jobs:
  update-jira:
    runs-on: ubuntu-latest
    steps:
      - name: Update Jira Issue
        uses: atlassian/gajira-transition@v2
        with:
          issue: ${{ github.event.pull_request.title }}
          transition: "In Review"
```

## 📋 **Pre-populated Backlog**

### **High Priority (Sprint 1)**
```
BRX-5: Implement FbmService Prisma Model
Story Points: 5
Description: Create core service offering model with pricing, scheduling, and location relationships

BRX-6: Build FbmAppointment Booking System  
Story Points: 8
Description: Appointment creation, scheduling, and client assignment functionality

BRX-7: Add FbmVisit Tracking
Story Points: 5
Description: Visit status management and billing integration
```

### **Medium Priority (Sprint 2)**
```
BRX-8: FbmPackage Management System
Story Points: 8
Description: Service packages, membership tiers, and visit allowances

BRX-9: Payment Option Integration
Story Points: 13
Description: Stripe Connect integration for coach revenue
```

### **Sprint Planning**
```
Sprint Duration: 2 weeks
Velocity Target: 20-25 story points
Focus: FBM core revenue-generating features

Sprint 1 Goal: Basic service booking functional
Sprint 2 Goal: Package sales and payments operational
Sprint 3 Goal: Full FBM workflow complete
```

## 🤖 **Automation & AI Integration**

### **1. Automated Issue Creation**
```javascript
// Create Jira issues from schema analysis
const jiraApi = require('jira-client');

// Generate issues for each missing table
missingTables.forEach(table => {
  jiraApi.addNewIssue({
    fields: {
      project: { key: 'BRX' },
      summary: `Implement ${table.name} Prisma Model`,
      description: table.description,
      issuetype: { name: 'Task' },
      priority: { name: table.priority },
      components: [{ name: 'Database' }]
    }
  });
});
```

### **2. Progress Tracking**
```javascript
// Update progress based on git commits
const completedTables = await prismaAnalyzer.getCompletedTables();
const progressPercent = (completedTables / 47) * 100;

await jiraApi.updateIssue('BRX-1', {
  fields: {
    customfield_10001: progressPercent // Database Progress field
  }
});
```

### **3. AI Context Integration**
```markdown
Jira Description Template:
---
## Technical Context
- Prisma Model: [Model Name]
- API Endpoints: [List endpoints]
- Dependencies: [Other tables/features]
- BRX API Reference: [Swagger section]

## Acceptance Criteria
- [ ] Prisma model defined with all fields
- [ ] Database migration successful
- [ ] tRPC router endpoints created
- [ ] Basic CRUD operations tested
- [ ] Integration with existing models verified

## AI Context Files
- Reference: PROJECT_ROADMAP.md
- Technical: brx-app/CLAUDE.md
- Schema: prisma/schema.prisma
```

## 📊 **Jira Dashboard Configuration**

### **1. Sprint Board**
- Columns: Open, In Progress, Code Review, Testing, Done
- Swimlanes: By Epic or Assignee
- Quick filters: By component, priority

### **2. Burndown Charts**
- Sprint progress tracking
- Velocity over time
- Scope changes visualization

### **3. Custom Dashboard**
```
Widgets:
- Database Progress (47 tables) - Pie chart
- Current Sprint Status - Burndown
- Epic Progress - Progress bars  
- Recent Activity - Activity stream
- Blocked Issues - Filter results
```

## 🔄 **Daily Workflow**

### **Morning Standup**
```
1. Check Jira board for today's priorities
2. Update issue statuses from yesterday
3. Log time spent on tasks
4. Flag any blockers or dependencies
```

### **Development Workflow**
```
1. Move issue to "In Progress"
2. Create feature branch: feature/BRX-5-fbm-service
3. Implement changes
4. Commit with issue key: "BRX-5 Add FbmService model"
5. Create PR with Jira link
6. Move to "Code Review" when PR ready
```

### **End of Day**
```
1. Log time in Jira issues
2. Update progress estimates
3. Add comments on blockers
4. Plan tomorrow's priorities
```

## 🎯 **Recommendation: Notion vs Jira**

### **Choose Notion if:**
- Need flexible project documentation
- Want stakeholder-friendly views
- Prefer rich text and database features
- Building comprehensive knowledge base

### **Choose Jira if:**
- Following formal Agile/Scrum processes
- Need detailed sprint planning
- Want advanced reporting and analytics
- Integrating with enterprise tools

### **Hybrid Approach:**
```
Jira: Sprint planning and task tracking
Notion: Documentation and knowledge management
GitHub: Code and technical implementation
```

**For BRX Platform: Recommend starting with Notion** for flexibility, then migrating to Jira if team grows or formal processes needed.