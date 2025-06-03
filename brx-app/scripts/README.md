# Scripts Directory

This directory contains utility scripts for development and automation.

## Schema Generation

### generate-unified-schema.js

**Purpose**: Automated Prisma schema generation from multiple data sources

**Sources Analyzed**:
- UI form components (`src/components/scraped/*.tsx`)
- tRPC API router schemas (`src/server/api/routers/*.ts`)
- Existing Prisma schema (`prisma/schema.prisma`)

**Features**:
- TypeScript interface parsing
- Zod schema analysis
- Form field pattern recognition
- Relationship inference
- Source tracking and comments

**Usage**:
```bash
# Generate unified schema
node scripts/generate-unified-schema.js

# Or use npm scripts
npm run schema:generate
npm run schema:analyze
```

**Output**: `prisma/unified-schema.prisma`

**Type Mappings**:
- `string` → `String`
- `number` → `Int`
- `boolean` → `Boolean`
- `Date` → `DateTime`
- `email` input → `String @unique`
- `password` input → `String`

**Auto-Generated Fields**:
- `id: String @id @default(cuid())`
- `createdAt: DateTime @default(now())`
- `updatedAt: DateTime @updatedAt`

## FireCrawl Automation

### extract_with_firecrawl.py

**Purpose**: Extracts content from configured websites using the FireCrawl API

**Features**:
- Configurable extraction targets
- Error handling and retry logic
- Structured JSON output
- 1Password integration for secure API key management

**Usage**:
```bash
op run -- python3 scripts/extract_with_firecrawl.py
```

### run-nightly-firecrawl.sh

**Purpose**: Orchestrates the complete nightly FireCrawl snapshot process

**Features**:
- Automated git branch creation and management
- Date-based branching (`frontend_sources/firecrawl/<date>`)
- Comprehensive error handling and cleanup
- Integration with 1Password for secure credentials
- Extraction result validation and reporting

**Usage**:
```bash
# Run for today's date
./scripts/run-nightly-firecrawl.sh

# Run for specific date
./scripts/run-nightly-firecrawl.sh --date 2024-01-15

# Show help
./scripts/run-nightly-firecrawl.sh --help
```

### test-firecrawl-setup.sh

**Purpose**: Validates that all FireCrawl components are properly configured

**Features**:
- Dependency checking
- Configuration validation
- Syntax testing
- Setup guidance

**Usage**:
```bash
./scripts/test-firecrawl-setup.sh
```

## Setup and Requirements

### Python Dependencies
```bash
pip install -r scripts/requirements.txt
```

### 1Password Configuration
1. Install 1Password CLI
2. Sign in: `op signin`
3. Store your FireCrawl API key in 1Password with the name `FIRECRAWL_API_KEY`

### Permissions
```bash
chmod +x scripts/*.sh scripts/*.py
```

## Automation

The FireCrawl extraction process is fully automated through GitHub Actions:

- **Schedule**: Runs nightly at 2:00 AM UTC
- **Trigger**: Can also be manually triggered
- **Output**: Creates dated branches with extraction results
- **Notifications**: Sends Slack alerts on success/failure
- **Artifacts**: Uploads extraction results as GitHub artifacts

See `.github/workflows/nightly-firecrawl.yml` for the complete automation setup.

