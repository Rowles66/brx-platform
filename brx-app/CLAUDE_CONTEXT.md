# Claude Code Session Context

## Project Status Summary
**BRX Performance App** - Reverse engineering project at ~70% completion

### Recent Work Completed:
1. ✅ **Repository consolidation** - Removed 45MB+ duplicates, cleaned 21k+ lines
2. ✅ **Deployment to Vercel** - https://brx-app-replica.vercel.app
3. ✅ **Visual confirmation** - App loads but styling issues identified
4. 🔧 **Current Issue**: Tailwind CSS not compiling properly - app looks like plain HTML

### WarpPreview Enhancements Added:
- **Next.js 15.3.3** upgrade from 13.4.19
- **Tailwind CSS v4** upgrade (causing current styling issues)
- **AI-powered visual audit system** with OpenAI integration
- **Enhanced testing infrastructure** (Playwright, visual regression)
- **File validation system** for scraped content

### Current Problem:
The deployed app at https://brx-app-replica.vercel.app renders as unstyled HTML because:
1. WarpPreview upgraded to Tailwind CSS v4 with new `@import "tailwindcss"` syntax
2. PostCSS config was incompatible 
3. I downgraded to Tailwind v3.4.14 and fixed the config, but cache may not have updated

### Files Recently Modified:
- `postcss.config.mjs` - Fixed Tailwind PostCSS plugin configuration
- `src/app/globals.css` - Changed from `@import "tailwindcss"` to `@tailwind` directives
- `package.json` - Downgraded tailwindcss to 3.4.14

### Next Steps Needed:
1. Verify Tailwind CSS is now compiling properly
2. Test visual appearance after cache refresh
3. Continue with remaining 30% of app development

### Key Architecture:
- **Next.js 14 App Router** with TypeScript
- **tRPC** for type-safe APIs  
- **Prisma ORM** with PostgreSQL
- **Tailwind CSS** for styling
- **Lucide React** icons
- **Vercel** deployment

### Environment:
- Working directory: `/Users/joshrowles/github/brx-platform/brx-app`
- Production URL: https://brx-app-replica.vercel.app
- Main branch: `main`