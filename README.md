# BRX Platform & Application Guide

## Introduction

Welcome to the `brx-platform` repository! This monorepo houses the BRX Performance platform, a modern, AI-powered fitness business solution aimed at enabling strength coaches to deliver superior training outcomes.

This document serves as the main guide to the platform, its structure, and the primary application (`brx-app`).

### Key Project Documents

For a complete understanding of the project, please refer to the following key documents:

*   **Project Charter & Vision**: See [`BRX_App_Migration_Project_Overview_README.md`](./BRX_App_Migration_Project_Overview_README.md) for the mission, strategic objectives, and high-level migration plan.
*   **Application Architecture & Technical Plan**: See [`Project_Plan_BRX_Performance_App.md`](./Project_Plan_BRX_Performance_App.md) for a detailed technical dive into the `brx-app` (the main Next.js application).

## 🏗️ Repository Structure After Merge

```
brx-platform/
├── brx-app/                    # 🚀 Main Next.js Application (NEW)
│   ├── src/                    # Application source code
│   ├── prisma/                 # Database schema and migrations
│   ├── public/                 # Static assets
│   ├── tests/                  # E2E and unit tests
│   └── docs/                   # Application documentation
│
├── brx-core/                   # Core platform components
│   ├── api-docs/               # API documentation and test results
│   ├── app-replica/            
│   │   └── brx-app-replica-legacy/  # 📦 Archived old version
│   │       ├── data_analysis/       # API analysis results
│   │       ├── scripts/             # Data collection tools
│   │       └── swagger.yaml         # API specification
│   └── custom-dev/             # Custom development tools
│
├── brand-guidelines/           # Brand assets and guidelines
└── workspace-config/           # Workspace configuration

```

## 🎯 Quick Navigation

### Primary Development Location
**`/brx-app`** - This is where all new development happens. It's the Next.js application using:
- Next.js 13.4+ with App Router
- tRPC for type-safe APIs
- Prisma ORM with PostgreSQL
- Tailwind CSS for styling
- TypeScript throughout

### Legacy Resources
**`/brx-core/app-replica/brx-app-replica-legacy`** - Contains valuable analysis and tools:
- API analysis from Exercise.com migration
- Data collection scripts
- Swagger documentation (136 endpoints)
- UI/API mapping files

## 🚀 Getting Started with Development

```bash
# Navigate to the main application
cd brx-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API credentials

# Set up database
npm run db:push

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📋 Key Commands

### In `/brx-app` directory:

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio

# Testing
npm run test:e2e        # Run Playwright tests
npm run storybook       # Start Storybook

# Deployment
npm run vercel:dev      # Test Vercel deployment locally
```

## 🔄 Migration Status

### Completed ✅
- Modern tech stack implementation (Next.js + tRPC + Prisma)
- Repository restructuring for cleaner architecture
- Legacy content preservation
- Development environment setup

### In Progress 🚧
- Feature migration from Exercise.com
- AI integration implementation
- Authentication system
- Core workout management features

### Next Steps 📋
1. Complete authentication implementation
2. Build coach dashboard
3. Implement workout builder
4. Add client management features

## 📚 Important Resources

### Documentation
- `/brx-app/docs/` - Current application documentation
- `/brx-core/app-replica/brx-app-replica-legacy/data_analysis/` - API analysis
- `BRX App Project Plan README.md` - Original project charter
- `project-overview.md` - Technical architecture decisions

### Data & Analysis
- Swagger spec: `/brx-core/app-replica/brx-app-replica-legacy/swagger.yaml`
- API mapping: `/brx-core/app-replica/brx-app-replica-legacy/ui_api_mapping_*.json`

## 🛠️ Development Tips

1. **Use AI Tools**: This project is optimized for Cursor IDE and Claude
2. **Type Safety**: Leverage tRPC for end-to-end type safety
3. **Database Changes**: Always use Prisma migrations
4. **Testing**: Write E2E tests for critical user flows
5. **Documentation**: Update docs as you build features

## 🤝 Contributing

1. Create feature branches from `main`
2. Follow the existing code structure
3. Write tests for new features
4. Update documentation
5. Submit PRs with clear descriptions

---

*Last Updated: January 2025*
*Platform Migration from Exercise.com to Independent Solution* 