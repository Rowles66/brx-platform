#!/bin/bash

# MCP Server Startup Script

# Create server directory if it doesn't exist
mkdir -p server

# Download server jar if it doesn't exist
if [ ! -f "server/server.jar" ]; then
    echo "Downloading server jar..."
    curl -o server/server.jar https://piston-data.mojang.com/v1/objects/8dd1a28015f51b1803213892b50b7b4fc76e594d/server.jar
fi

# Create server.properties if it doesn't exist
if [ ! -f "server/server.properties" ]; then
    echo "Creating server.properties..."
    cat > server/server.properties << EOL
server-port=25565
max-players=20
gamemode=survival
difficulty=normal
spawn-protection=16
view-distance=10
simulation-distance=10
motd=Welcome to MCP Server
EOL
fi

# Create eula.txt if it doesn't exist
if [ ! -f "server/eula.txt" ]; then
    echo "Creating eula.txt..."
    echo "eula=true" > server/eula.txt
fi

# Start the server
cd server
java -Xmx2G -Xms2G -jar server.jar nogui 