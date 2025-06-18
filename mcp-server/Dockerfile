FROM node:18-alpine

WORKDIR /app

# Install 1Password CLI
RUN apk add --no-cache curl \
    && curl -sSfL https://cache.agilebits.com/dist/1P/op2/pkg/v2.31.1/op_linux_amd64_v2.31.1.zip -o op.zip \
    && unzip op.zip \
    && mv op /usr/local/bin/ \
    && rm op.zip \
    && chmod +x /usr/local/bin/op

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# The MCP server needs to run on stdio, so we'll use a wrapper script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# MCP servers communicate via stdio, not network ports
ENTRYPOINT ["./docker-entrypoint.sh"]