# Frontend Sources

This directory contains extracted content and data sources for the frontend application.

## Structure

### firecrawl/

Contains content extracted using the FireCrawl API through automated nightly snapshots.

- **Schedule**: Automated extractions run nightly at 2:00 AM UTC
- **Format**: JSON files with structured extraction results
- **Naming**: `firecrawl_extraction_YYYY-MM-DD.json`
- **Branches**: Each extraction creates a branch `frontend_sources/firecrawl/YYYY-MM-DD`

#### File Structure

Each extraction file contains:

```json
{
  "timestamp": "ISO-8601 timestamp",
  "version": "1.0",
  "extractions": [
    {
      "name": "site_identifier",
      "url": "source_url",
      "description": "extraction_description",
      "status": "success|failed|error",
      "data": { /* extracted content */ },
      "extracted_at": "timestamp",
      "error": "error_message_if_failed"
    }
  ]
}
```

#### Usage

These extracted sources can be used in the frontend application for:

- Dynamic content updates
- Content aggregation
- Data analysis
- Content comparison over time

#### Automated Workflow

The extraction process is fully automated:

1. **Trigger**: GitHub Actions runs nightly or manual trigger
2. **Extraction**: FireCrawl API extracts content from configured sources
3. **Storage**: Results saved to dated JSON files
4. **Version Control**: New branch created for each extraction
5. **Review**: Pull request created for review and merging
6. **Notification**: Slack alerts sent on success/failure

#### Configuration

Extraction targets are configured in `scripts/extract_with_firecrawl.py`.
To add new sources, modify the `targets` array in the script.

## Integration

To use this data in your frontend application:

```javascript
// Example: Load latest FireCrawl extraction
const loadLatestExtraction = async () => {
  const response = await fetch('/api/firecrawl/latest');
  const data = await response.json();
  return data;
};
```

## Maintenance

- **Cleanup**: Old extractions should be archived or removed periodically
- **Monitoring**: Check GitHub Actions for extraction failures
- **Updates**: Modify extraction targets as needed
- **Validation**: Review extraction results for quality and accuracy

