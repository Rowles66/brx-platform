#!/usr/bin/env python3
"""
Cursor Chat History Extractor
Extracts chat conversations from Cursor's SQLite database
"""

import sqlite3
import json
import os
from datetime import datetime
from pathlib import Path
import sys

def get_cursor_db_path():
    """Get the path to Cursor's state database"""
    home = Path.home()
    db_path = home / "Library" / "Application Support" / "Cursor" / "User" / "globalStorage" / "state.vscdb"
    if not db_path.exists():
        print(f"Error: Cursor database not found at {db_path}")
        sys.exit(1)
    return db_path

def extract_conversations(db_path):
    """Extract all conversations from the database"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    conversations = {}
    
    try:
        # First, get all composer data entries to find conversations
        cursor.execute("""
            SELECT key, value 
            FROM cursorDiskKV 
            WHERE key LIKE 'composerData:%' 
            ORDER BY key
        """)
        
        composer_data = cursor.fetchall()
        
        for key, value in composer_data:
            if not value:  # Skip if value is None
                continue
            try:
                data = json.loads(value)
                composer_id = key.split(':')[1]
                
                # Extract conversation headers
                if 'fullConversationHeadersOnly' in data and data['fullConversationHeadersOnly']:
                    conversations[composer_id] = {
                        'composer_id': composer_id,
                        'created_at': data.get('createdAt', 'Unknown'),
                        'bubbles': data['fullConversationHeadersOnly'],
                        'messages': []
                    }
            except json.JSONDecodeError:
                continue
        
        # Now get the actual message content for each bubble
        for composer_id, conversation in conversations.items():
            for bubble_info in conversation['bubbles']:
                bubble_id = bubble_info.get('bubbleId')
                if bubble_id:
                    # Get bubble data
                    bubble_key = f'bubbleId:{composer_id}:{bubble_id}'
                    cursor.execute(
                        "SELECT value FROM cursorDiskKV WHERE key = ?",
                        (bubble_key,)
                    )
                    bubble_result = cursor.fetchone()
                    
                    if bubble_result:
                        try:
                            bubble_data = json.loads(bubble_result[0])
                            message_type = 'user' if bubble_data.get('type') == 1 else 'assistant'
                            
                            # Extract relevant files and other context
                            message_info = {
                                'bubble_id': bubble_id,
                                'type': message_type,
                                'relevant_files': bubble_data.get('relevantFiles', []),
                                'attached_folders': bubble_data.get('attachedFolders', []),
                                'deleted_files': bubble_data.get('deletedFiles', []),
                                'tool_results': bubble_data.get('toolResults', []),
                                'is_agentic': bubble_data.get('isAgentic', False),
                                'supported_tools': bubble_data.get('supportedTools', [])
                            }
                            
                            # Try to get message text from various possible fields
                            message_text = ''
                            
                            # Check for text in different possible locations
                            if 'text' in bubble_data:
                                message_text = bubble_data['text']
                            elif 'richText' in bubble_data:
                                try:
                                    rich_text_data = json.loads(bubble_data['richText']) if isinstance(bubble_data['richText'], str) else bubble_data['richText']
                                    # Extract text from rich text format
                                    if isinstance(rich_text_data, dict) and 'root' in rich_text_data:
                                        message_text = extract_text_from_rich_text(rich_text_data)
                                except:
                                    message_text = str(bubble_data['richText'])
                            
                            message_info['text'] = message_text
                            conversation['messages'].append(message_info)
                            
                        except json.JSONDecodeError:
                            continue
    
    finally:
        conn.close()
    
    return conversations

def extract_text_from_rich_text(rich_text_data):
    """Extract plain text from Cursor's rich text format"""
    text_parts = []
    
    def traverse_node(node):
        if isinstance(node, dict):
            if 'text' in node:
                text_parts.append(node['text'])
            if 'children' in node:
                for child in node['children']:
                    traverse_node(child)
    
    if 'root' in rich_text_data:
        traverse_node(rich_text_data['root'])
    
    return ' '.join(text_parts)

def format_conversation(conversation):
    """Format a conversation for display"""
    output = []
    
    # Convert timestamp to readable format
    timestamp = conversation.get('created_at', 'Unknown')
    if isinstance(timestamp, (int, float)):
        date = datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')
    else:
        date = str(timestamp)
    
    output.append(f"=== Conversation ID: {conversation['composer_id']} ===")
    output.append(f"Created: {date}")
    output.append(f"Messages: {len(conversation['messages'])}")
    output.append("")
    
    for i, msg in enumerate(conversation['messages'], 1):
        output.append(f"--- Message {i} ({msg['type']}) ---")
        
        if msg.get('text'):
            output.append(f"Text: {msg['text']}")
        
        if msg.get('relevant_files'):
            output.append(f"Relevant files: {', '.join(msg['relevant_files'])}")
        
        if msg.get('attached_folders'):
            output.append(f"Attached folders: {msg['attached_folders']}")
        
        if msg.get('deleted_files'):
            output.append(f"Deleted files: {[f.get('relativeWorkspacePath', '') for f in msg['deleted_files']]}")
        
        if msg.get('is_agentic'):
            output.append("Mode: Agentic (with tools)")
        
        output.append("")
    
    return '\n'.join(output)

def save_conversations(conversations, output_dir):
    """Save conversations to files"""
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Save individual conversations
    for composer_id, conversation in conversations.items():
        if conversation['messages']:  # Only save conversations with messages
            timestamp = conversation.get('created_at', 'Unknown')
            if isinstance(timestamp, (int, float)):
                date_str = datetime.fromtimestamp(timestamp / 1000).strftime('%Y%m%d_%H%M%S')
            else:
                date_str = 'unknown_date'
            
            filename = f"conversation_{date_str}_{composer_id[:8]}.txt"
            filepath = output_path / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(format_conversation(conversation))
            
            print(f"Saved: {filename}")
    
    # Save summary
    summary_file = output_path / "conversations_summary.txt"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("=== Cursor Chat History Summary ===\n\n")
        f.write(f"Total conversations found: {len(conversations)}\n")
        f.write(f"Conversations with messages: {sum(1 for c in conversations.values() if c['messages'])}\n\n")
        
        for composer_id, conversation in sorted(conversations.items(), 
                                               key=lambda x: x[1].get('created_at', 0), 
                                               reverse=True):
            if conversation['messages']:
                timestamp = conversation.get('created_at', 'Unknown')
                if isinstance(timestamp, (int, float)):
                    date = datetime.fromtimestamp(timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')
                else:
                    date = str(timestamp)
                
                f.write(f"ID: {composer_id[:8]}... | Date: {date} | Messages: {len(conversation['messages'])}\n")
    
    print(f"\nSummary saved to: {summary_file}")

def main():
    print("Cursor Chat History Extractor")
    print("=============================\n")
    
    # Get database path
    db_path = get_cursor_db_path()
    print(f"Found Cursor database at: {db_path}")
    
    # Extract conversations
    print("\nExtracting conversations...")
    conversations = extract_conversations(db_path)
    
    # Filter out empty conversations
    non_empty_conversations = {k: v for k, v in conversations.items() if v['messages']}
    
    print(f"Found {len(conversations)} total conversations")
    print(f"Found {len(non_empty_conversations)} conversations with messages")
    
    if not non_empty_conversations:
        print("\nNo conversations with messages found in the database.")
        print("This might mean:")
        print("1. Chat history is stored in a different format")
        print("2. Chat history has been cleared")
        print("3. The extraction method needs to be updated")
        return
    
    # Save conversations
    output_dir = "cursor_chat_history"
    print(f"\nSaving conversations to: {output_dir}/")
    save_conversations(non_empty_conversations, output_dir)
    
    print("\nExtraction complete!")

if __name__ == "__main__":
    main() 