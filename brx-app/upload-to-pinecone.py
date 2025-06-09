#!/usr/bin/env python3
"""
Upload Claude Code conversation to Pinecone for knowledge retrieval
"""

import os
import re
from datetime import datetime
from typing import List, Dict
import hashlib

# Install required packages:
# pip install pinecone-client openai python-dotenv

from pinecone import Pinecone
from openai import OpenAI

def setup_clients():
    """Setup Pinecone and OpenAI clients"""
    pinecone_api_key = os.getenv('PINECONE_API_KEY') or input("Enter Pinecone API Key: ")
    openai_api_key = os.getenv('OPENAI_API_KEY') or input("Enter OpenAI API Key: ")
    
    pc = Pinecone(api_key=pinecone_api_key)
    openai_client = OpenAI(api_key=openai_api_key)
    
    return pc, openai_client

def chunk_conversation(text: str, chunk_size: int = 1000) -> List[Dict]:
    """Split conversation into meaningful chunks"""
    
    # Split by major sections and tool calls
    chunks = []
    
    # Split by Human/Assistant exchanges
    sections = re.split(r'\n(Human:|Assistant:)', text)
    
    current_chunk = ""
    chunk_id = 0
    
    for i, section in enumerate(sections):
        if section.strip() in ['Human:', 'Assistant:']:
            continue
            
        # If adding this section would exceed chunk size, save current chunk
        if len(current_chunk + section) > chunk_size and current_chunk:
            chunks.append({
                'id': f'chunk_{chunk_id}',
                'text': current_chunk.strip(),
                'metadata': {
                    'chunk_index': chunk_id,
                    'timestamp': datetime.now().isoformat(),
                    'source': 'claude_code_session',
                    'word_count': len(current_chunk.split())
                }
            })
            current_chunk = section
            chunk_id += 1
        else:
            current_chunk += section
    
    # Add final chunk
    if current_chunk.strip():
        chunks.append({
            'id': f'chunk_{chunk_id}',
            'text': current_chunk.strip(),
            'metadata': {
                'chunk_index': chunk_id,
                'timestamp': datetime.now().isoformat(),
                'source': 'claude_code_session',
                'word_count': len(current_chunk.split())
            }
        })
    
    return chunks

def get_embeddings(texts: List[str], openai_client: OpenAI) -> List[List[float]]:
    """Generate embeddings for text chunks"""
    print(f"Generating embeddings for {len(texts)} chunks...")
    
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    
    return [data.embedding for data in response.data]

def upload_to_pinecone(chunks: List[Dict], embeddings: List[List[float]], pc: Pinecone):
    """Upload chunks and embeddings to Pinecone"""
    
    # Create or connect to index
    index_name = "claude-code-conversations"
    
    # Check if index exists, create if not
    existing_indexes = [index.name for index in pc.list_indexes()]
    
    if index_name not in existing_indexes:
        print(f"Creating new index: {index_name}")
        pc.create_index(
            name=index_name,
            dimension=1536,  # text-embedding-3-small dimension
            metric='cosine'
        )
    
    index = pc.Index(index_name)
    
    # Prepare vectors for upload
    vectors = []
    for chunk, embedding in zip(chunks, embeddings):
        vectors.append({
            'id': chunk['id'],
            'values': embedding,
            'metadata': {
                **chunk['metadata'],
                'text': chunk['text'][:1000]  # Pinecone metadata limit
            }
        })
    
    # Upload in batches
    batch_size = 100
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        print(f"Uploading batch {i//batch_size + 1}/{(len(vectors) + batch_size - 1)//batch_size}")
        index.upsert(vectors=batch)
    
    print(f"Successfully uploaded {len(vectors)} chunks to Pinecone!")
    return index

def main():
    """Main function to process and upload conversation"""
    
    # Read conversation file
    conversation_file = "/Users/joshrowles/Desktop/Terminal Saved Output.txt"
    
    if not os.path.exists(conversation_file):
        print(f"Error: {conversation_file} not found!")
        print("Please copy your conversation text to this file first.")
        return
    
    with open(conversation_file, 'r', encoding='utf-8') as f:
        conversation_text = f.read()
    
    if len(conversation_text.strip()) < 100:
        print("Error: Conversation file appears to be empty or too short.")
        print("Please paste your Claude Code conversation into conversation-export.txt")
        return
    
    print(f"Processing conversation ({len(conversation_text)} characters)...")
    
    # Setup clients
    pc, openai_client = setup_clients()
    
    # Chunk the conversation
    chunks = chunk_conversation(conversation_text)
    print(f"Created {len(chunks)} chunks")
    
    # Generate embeddings
    chunk_texts = [chunk['text'] for chunk in chunks]
    embeddings = get_embeddings(chunk_texts, openai_client)
    
    # Upload to Pinecone
    index = upload_to_pinecone(chunks, embeddings, pc)
    
    print("\\n✅ Upload complete!")
    print(f"Index name: claude-code-conversations")
    print(f"Total chunks: {len(chunks)}")
    print("\\nYou can now query this conversation using the query script.")

if __name__ == "__main__":
    main()