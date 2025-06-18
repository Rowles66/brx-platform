# Base image with Node.js
FROM node:20-slim

# Install system dependencies and development tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    build-essential \
    python3 \
    python3-pip \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -s /bin/bash ubuntu && \
    echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Switch to the non-root user
USER ubuntu

# Set working directory to user's home
WORKDIR /home/ubuntu

# Install global Node.js tools that might be needed
RUN npm install -g \
    typescript \
    @types/node \
    eslint \
    prettier \
    nodemon

# Set up Python environment (if needed for scripts)
RUN pip3 install --user \
    requests \
    pandas \
    python-dotenv

# Ensure npm/yarn caches are in the home directory
ENV NPM_CONFIG_CACHE=/home/ubuntu/.npm
ENV YARN_CACHE_FOLDER=/home/ubuntu/.cache/yarn

# The code will be cloned by the agent, so we don't copy it here
# This Dockerfile only sets up the development environment
