#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Set API keys
export PINECONE_API_KEY="pcsk_4FqHCo_RfNySaXptYARhdsP2sfnWA1bdtVJHEcF8cFibuRSqCMLmmKikhgjiwrx65rYLJX"

# You'll need to provide OpenAI key when prompted
echo "📋 Pinecone Upload Script"
echo "========================"
echo ""
echo "Please ensure you have:"
echo "1. Copied the entire Claude Code conversation"
echo "2. Pasted it into conversation-export.txt"
echo ""
echo "You'll be prompted for your OpenAI API key next."
echo ""

# Run the upload script
python upload-to-pinecone.py