# GitHub Workflows

This directory contains GitHub Actions workflows for automated processes.

## Workflows

### nightly-firecrawl.yml

Automated nightly FireCrawl content extraction workflow that:

- Runs every night at 2:00 AM UTC
- Extracts content using FireCrawl API
- Creates dated branches (`frontend_sources/firecrawl/<date>`)
- Pushes results and creates pull requests
- Sends notifications to Slack on success/failure
- Includes caching for Python dependencies

#### Manual Triggers

The workflow can be manually triggered with optional parameters:
- `date`: Custom date for extraction (YYYY-MM-DD)
- `force_run`: Force run even if branch already exists

#### Required Secrets

- `OP_SERVICE_ACCOUNT_TOKEN`: 1Password service account token for accessing FireCrawl API key

#### Optional Variables

- `SLACK_WEBHOOK_URL`: Slack webhook URL for notifications (if not set, notifications are skipped)

#### Features

- **Caching**: Python dependencies are cached for faster runs
- **Error Handling**: Comprehensive error handling with cleanup
- **Notifications**: Slack alerts for both success and failure
- **Artifacts**: Upload extraction results as artifacts
- **Pull Requests**: Automatic PR creation for successful extractions
- **Branch Management**: Automatic cleanup on failures

### playwright.yml

End-to-end testing workflow using Playwright.

## Setup Instructions

### 1Password Configuration

1. Create a service account in 1Password
2. Add the service account token as `OP_SERVICE_ACCOUNT_TOKEN` secret in GitHub
3. Ensure your FireCrawl API key is stored in 1Password with the name `FIRECRAWL_API_KEY`

### Slack Notifications (Optional)

1. Create a Slack webhook in your workspace
2. Add the webhook URL as `SLACK_WEBHOOK_URL` variable in GitHub repository settings

### Manual Testing

To test the workflow manually:

1. Go to Actions tab in GitHub
2. Select "Nightly FireCrawl Snapshots" workflow
3. Click "Run workflow"
4. Optionally specify a custom date or force run

