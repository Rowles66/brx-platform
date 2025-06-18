FROM node:20-alpine

# Install required tools including 1Password CLI and jq
RUN apk add --no-cache \
    bash \
    jq \
    curl \
    git

# Install 1Password CLI
RUN curl -sSfo op.zip https://cache.agilebits.com/dist/1P/op2/pkg/v2.26.0/op_linux_amd64_v2.26.0.zip \
    && unzip -d /usr/local/bin op.zip \
    && rm op.zip \
    && chmod +x /usr/local/bin/op

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# The MCP server needs to run on stdio, so we'll use a wrapper script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Create a script to handle 1Password authentication
COPY op-connect.sh /app/
RUN chmod +x /app/op-connect.sh

# MCP servers communicate via stdio, not network ports
ENTRYPOINT ["/app/docker-entrypoint.sh"]