#!/usr/bin/env python3
"""
Upload Claude Code conversation to Pinecone - Simplified version
"""

import os
import re
from datetime import datetime
from typing import List, Dict
from pinecone import Pinecone
from openai import OpenAI

# Get API keys
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not PINECONE_API_KEY:
    print("❌ Error: PINECONE_API_KEY environment variable not set!")
    print("\nTo fix this, run:")
    print("export PINECONE_API_KEY='your-api-key-here'")
    print("\nThen run this script again.")
    exit(1)

if not OPENAI_API_KEY:
    print("❌ Error: OPENAI_API_KEY environment variable not set!")
    print("\nTo fix this, run:")
    print("export OPENAI_API_KEY='your-api-key-here'")
    print("\nThen run this script again.")
    exit(1)

def chunk_conversation(text: str, chunk_size: int = 2000) -> List[Dict]:
    """Split conversation into meaningful chunks"""
    chunks = []
    
    # Simple chunking by character count
    words = text.split()
    current_chunk = []
    chunk_id = 0
    
    for word in words:
        current_chunk.append(word)
        if len(' '.join(current_chunk)) > chunk_size:
            chunk_text = ' '.join(current_chunk[:-1])  # Exclude last word
            chunks.append({
                'id': f'brx_conversation_chunk_{chunk_id}',
                'text': chunk_text,
                'metadata': {
                    'chunk_index': chunk_id,
                    'timestamp': datetime.now().isoformat(),
                    'source': 'claude_code_brx_session',
                    'project': 'brx-platform',
                    'word_count': len(chunk_text.split())
                }
            })
            current_chunk = [word]  # Start new chunk with excluded word
            chunk_id += 1
    
    # Add final chunk
    if current_chunk:
        chunk_text = ' '.join(current_chunk)
        chunks.append({
            'id': f'brx_conversation_chunk_{chunk_id}',
            'text': chunk_text,
            'metadata': {
                'chunk_index': chunk_id,
                'timestamp': datetime.now().isoformat(),
                'source': 'claude_code_brx_session',
                'project': 'brx-platform',
                'word_count': len(chunk_text.split())
            }
        })
    
    return chunks

def main():
    print("🚀 BRX Claude Code Conversation Upload")
    print("=" * 40)
    
    # Initialize clients
    pc = Pinecone(api_key=PINECONE_API_KEY)
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    
    # Read conversation
    conversation_file = "/Users/joshrowles/Desktop/Terminal Saved Output.txt"
    print(f"📖 Reading conversation from: {conversation_file}")
    
    with open(conversation_file, 'r', encoding='utf-8') as f:
        conversation_text = f.read()
    
    print(f"📊 Loaded {len(conversation_text):,} characters")
    
    # Chunk the conversation
    print("🔪 Chunking conversation...")
    chunks = chunk_conversation(conversation_text)
    print(f"✅ Created {len(chunks)} chunks")
    
    # Generate embeddings
    print("🧠 Generating embeddings...")
    chunk_texts = [chunk['text'] for chunk in chunks]
    
    embeddings = []
    batch_size = 20  # Process in smaller batches
    
    for i in range(0, len(chunk_texts), batch_size):
        batch = chunk_texts[i:i + batch_size]
        print(f"  Processing batch {i//batch_size + 1}/{(len(chunk_texts) + batch_size - 1)//batch_size}")
        
        response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=batch
        )
        embeddings.extend([data.embedding for data in response.data])
    
    # Create or connect to index
    index_name = "brx-claude-conversations"
    
    existing_indexes = [idx.name for idx in pc.list_indexes()]
    
    if index_name not in existing_indexes:
        print(f"📦 Creating new index: {index_name}")
        from pinecone import ServerlessSpec
        pc.create_index(
            name=index_name,
            dimension=1536,
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )
    
    print(f"🔗 Connecting to index: {index_name}")
    index = pc.Index(index_name)
    
    # Upload vectors
    print("📤 Uploading to Pinecone...")
    vectors = []
    
    for chunk, embedding in zip(chunks, embeddings):
        vectors.append({
            'id': chunk['id'],
            'values': embedding,
            'metadata': chunk['metadata']
        })
    
    # Upload in batches
    batch_size = 50
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        print(f"  Uploading batch {i//batch_size + 1}/{(len(vectors) + batch_size - 1)//batch_size}")
        index.upsert(vectors=batch)
    
    print("\n✅ Upload complete!")
    print(f"📊 Total chunks uploaded: {len(vectors)}")
    print(f"🔍 Index name: {index_name}")
    print("\n💡 You can now query this conversation using query-pinecone.py")

if __name__ == "__main__":
    main()