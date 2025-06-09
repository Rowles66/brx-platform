#!/usr/bin/env python3
"""
Query the BRX Claude Code conversation from Pinecone
"""

import os
from pinecone import Pinecone
from openai import OpenAI

def query_brx_conversation(query: str, top_k: int = 3):
    """Query the conversation for relevant context"""
    
    # Get API keys from environment variables
    PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    if not PINECONE_API_KEY:
        print("Error: PINECONE_API_KEY environment variable not set")
        return
    
    if not OPENAI_API_KEY:
        print("Error: OPENAI_API_KEY environment variable not set")
        return
    
    pc = Pinecone(api_key=PINECONE_API_KEY)
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    index = pc.Index("brx-claude-conversations")
    
    # Generate embedding for query
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=[query]
    )
    query_embedding = response.data[0].embedding
    
    # Search Pinecone
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    print(f"🔍 Query: '{query}'")
    print(f"📋 Found {len(results.matches)} relevant chunks:\\n")
    
    for i, match in enumerate(results.matches, 1):
        score = match.score
        text = match.metadata.get('text', match.id)
        chunk_idx = match.metadata.get('chunk_index', 'unknown')
        
        print(f"--- Result {i} (Score: {score:.3f}, Chunk: {chunk_idx}) ---")
        print(f"{text[:500]}...")
        print()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python query-conversation.py 'your query here'")
        print("\\nExample queries:")
        print("  python query-conversation.py 'Tailwind CSS issue'")
        print("  python query-conversation.py 'WarpPreview changes'")
        print("  python query-conversation.py 'deployment to Vercel'")
        print("  python query-conversation.py 'Pinecone upload'")
        sys.exit(1)
    
    query = ' '.join(sys.argv[1:])
    query_brx_conversation(query)