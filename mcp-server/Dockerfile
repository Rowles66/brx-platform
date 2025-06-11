FROM node:18-alpine

WORKDIR /app

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