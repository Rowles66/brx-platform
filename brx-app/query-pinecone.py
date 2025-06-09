#!/usr/bin/env python3
"""
Query Claude Code conversation from Pinecone
Use this script in Cursor to retrieve relevant context
"""

import os
from typing import List, Dict
from pinecone import Pinecone
from openai import OpenAI

def setup_clients():
    """Setup Pinecone and OpenAI clients"""
    pinecone_api_key = os.getenv('PINECONE_API_KEY') or input("Enter Pinecone API Key: ")
    openai_api_key = os.getenv('OPENAI_API_KEY') or input("Enter OpenAI API Key: ")
    
    pc = Pinecone(api_key=pinecone_api_key)
    openai_client = OpenAI(api_key=openai_api_key)
    
    return pc, openai_client

def query_conversation(query: str, top_k: int = 5) -> List[Dict]:
    """Query the conversation for relevant context"""
    
    pc, openai_client = setup_clients()
    index = pc.Index("claude-code-conversations")
    
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
    
    # Format results
    relevant_chunks = []
    for match in results.matches:
        relevant_chunks.append({
            'score': match.score,
            'text': match.metadata.get('text', ''),
            'chunk_index': match.metadata.get('chunk_index', 0),
            'timestamp': match.metadata.get('timestamp', ''),
            'word_count': match.metadata.get('word_count', 0)
        })
    
    return relevant_chunks

def main():
    """Interactive query interface"""
    print("🔍 Claude Code Conversation Query Tool")
    print("Type 'exit' to quit\\n")
    
    while True:
        query = input("Enter your query: ").strip()
        
        if query.lower() in ['exit', 'quit', 'q']:
            break
            
        if not query:
            continue
            
        print(f"\\n🔍 Searching for: '{query}'...")
        
        try:
            results = query_conversation(query, top_k=3)
            
            if not results:
                print("No relevant results found.")
                continue
                
            print(f"\\n📋 Found {len(results)} relevant chunks:\\n")
            
            for i, result in enumerate(results, 1):
                print(f"--- Result {i} (Score: {result['score']:.3f}) ---")
                print(f"Chunk: {result['chunk_index']}")
                print(f"Words: {result['word_count']}")
                print(f"Text: {result['text'][:500]}...")
                print()
                
        except Exception as e:
            print(f"Error: {e}")
        
        print("-" * 50)

if __name__ == "__main__":
    main()