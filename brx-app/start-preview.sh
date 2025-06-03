#!/bin/bash

# Store the current directory
CURRENT_DIR=$(pwd)

# Function to cleanup processes
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

echo "Starting preview environment..."
echo "--------------------------------"

# Start Next.js in the background
echo "Starting Next.js development server..."
npm run dev &
nextjs_pid=$!

# Wait for Next.js to be ready
echo "Waiting for Next.js to start..."
while ! curl -s http://localhost:3000 >/dev/null; do
    sleep 1
done

# Start browser-sync
echo "Starting browser-sync preview..."
npx browser-sync start --config preview.config.js &
browsersync_pid=$!

# Wait for browser-sync to start
sleep 3

# Open browsers
echo "Opening preview in browser..."
open http://localhost:3000 http://localhost:3001

echo -e "\nPreview environment is running!"
echo "--------------------------------"
echo "Local Next.js app: http://localhost:3000"
echo "Preview comparison: http://localhost:3001"
echo -e "\nPress Ctrl+C to stop all servers\n"

# Wait for any process to exit
wait
