# BRX Platform Docker Setup

## Overview

The BRX Platform consists of two main components:

1. **BRX App** - A Next.js application (the main web application)
2. **MCP Server** - Model Context Protocol server with 1Password integration

## GitHub Actions Workflow

The `.github/workflows/build.yml` workflow automatically builds and pushes Docker images for both components when:

- Code is pushed to the `main` branch
- Pull requests are created (builds only, no push)

### Workflow Features:

- **Multi-architecture builds**: Supports both `linux/amd64` and `linux/arm64`
- **Docker Buildx Cloud**: Uses cloud builders for faster builds
- **Smart tagging**: Creates tags based on branch, commit SHA, and PR numbers
- **Cache optimization**: Uses GitHub Actions cache for faster subsequent builds
- **Conditional push**: Only pushes images on main branch, not on PRs

### Required GitHub Secrets and Variables:

- `secrets.DOCKER_PAT` - Docker Hub Personal Access Token
- `vars.DOCKER_USER` - Docker Hub username
- `vars.NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `vars.NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Local Development

### Using Docker Compose

1. Create a `.env` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OP_SESSION=your_1password_session_token
```

2. Build and run all services:

```bash
docker-compose up --build
```

3. Access the application:

- BRX App: http://localhost:3000
- MCP Server: Runs in background (stdio communication)

### Individual Container Commands

Build the BRX App:

```bash
docker build -t brx-app:latest ./brx-app
```

Build the MCP Server:

```bash
docker build -t brx-mcp-server:latest ./mcp-server
```

## Production Deployment

The GitHub Actions workflow will automatically build and push images to Docker Hub with the following tags:

- `<username>/brx-app:latest` - Latest main branch build
- `<username>/brx-app:main-<sha>` - Specific commit build
- `<username>/brx-mcp-server:latest` - Latest MCP server build
- `<username>/brx-mcp-server:main-<sha>` - Specific MCP server commit build

### Deploying to Production

1. Pull the latest images:

```bash
docker pull <username>/brx-app:latest
docker pull <username>/brx-mcp-server:latest
```

2. Run with production environment variables:

```bash
# BRX App
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_SUPABASE_URL=<url> \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=<key> \
  --name brx-app \
  <username>/brx-app:latest

# MCP Server
docker run -d \
  -e NODE_ENV=production \
  -e OP_SESSION_my=<token> \
  --name brx-mcp-server \
  <username>/brx-mcp-server:latest
```

## Troubleshooting

### Build Failures

- Ensure all required secrets and variables are set in GitHub
- Check that Docker Hub credentials are valid
- Verify that the Buildx cloud endpoint is accessible

### Local Development Issues

- Make sure all environment variables are set in `.env`
- Check Docker daemon is running
- Verify port 3000 is not already in use

### Next.js Specific

- The app uses standalone output mode for optimized Docker images
- Static files are served from the `.next/static` directory
- Public files are copied to the container
