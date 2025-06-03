#!/usr/bin/env python3
"""
Cursor Chat Backup System
Automatically backs up Cursor chat history locally and to cloud storage
"""

import sqlite3
import json
import os
import shutil
from datetime import datetime
from pathlib import Path
import sys
import argparse
import schedule
import time
import subprocess

# Cloud storage configurations
CLOUD_PROVIDERS = {
    'icloud': {
        'path': Path.home() / 'Library' / 'Mobile Documents' / 'com~apple~CloudDocs' / 'CursorChatBackups',
        'available': sys.platform == 'darwin'
    },
    'dropbox': {
        'path': Path.home() / 'Dropbox' / 'CursorChatBackups',
        'available': (Path.home() / 'Dropbox').exists()
    },
    'google_drive': {
        'path': Path.home() / 'Google Drive' / 'CursorChatBackups',
        'available': (Path.home() / 'Google Drive').exists()
    },
    'onedrive': {
        'path': Path.home() / 'OneDrive' / 'CursorChatBackups',
        'available': (Path.home() / 'OneDrive').exists()
    }
}

class CursorChatBackup:
    def __init__(self, backup_dir=None, cloud_provider=None):
        self.cursor_db_path = self._get_cursor_db_path()
        self.backup_dir = Path(backup_dir) if backup_dir else Path.home() / 'CursorChatBackups'
        self.cloud_provider = cloud_provider
        self.cloud_path = None
        
        if cloud_provider and cloud_provider in CLOUD_PROVIDERS:
            if CLOUD_PROVIDERS[cloud_provider]['available']:
                self.cloud_path = CLOUD_PROVIDERS[cloud_provider]['path']
                self.cloud_path.mkdir(parents=True, exist_ok=True)
            else:
                print(f"Warning: {cloud_provider} is not available on this system")
        
        self.backup_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_cursor_db_path(self):
        """Get the path to Cursor's state database"""
        home = Path.home()
        db_path = home / "Library" / "Application Support" / "Cursor" / "User" / "globalStorage" / "state.vscdb"
        if not db_path.exists():
            raise FileNotFoundError(f"Cursor database not found at {db_path}")
        return db_path
    
    def backup_database(self):
        """Create a timestamped backup of the entire database"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f"cursor_db_backup_{timestamp}.vscdb"
        local_backup_path = self.backup_dir / backup_filename
        
        # Copy the database file
        shutil.copy2(self.cursor_db_path, local_backup_path)
        print(f"Database backed up to: {local_backup_path}")
        
        # Copy to cloud if configured
        if self.cloud_path:
            cloud_backup_path = self.cloud_path / backup_filename
            shutil.copy2(local_backup_path, cloud_backup_path)
            print(f"Database backed up to cloud: {cloud_backup_path}")
        
        return local_backup_path
    
    def export_chats_json(self):
        """Export all chats to JSON format"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        conversations = self._extract_conversations()
        
        # Save full export
        export_filename = f"cursor_chats_export_{timestamp}.json"
        local_export_path = self.backup_dir / export_filename
        
        with open(local_export_path, 'w', encoding='utf-8') as f:
            json.dump(conversations, f, indent=2, ensure_ascii=False)
        
        print(f"Chats exported to: {local_export_path}")
        
        # Copy to cloud if configured
        if self.cloud_path:
            cloud_export_path = self.cloud_path / export_filename
            shutil.copy2(local_export_path, cloud_export_path)
            print(f"Chats exported to cloud: {cloud_export_path}")
        
        # Also save individual conversation files
        self._save_individual_conversations(conversations, timestamp)
        
        return local_export_path
    
    def _extract_conversations(self):
        """Extract all conversations from the database"""
        conn = sqlite3.connect(self.cursor_db_path)
        cursor = conn.cursor()
        
        conversations = {}
        
        try:
            # Get composer data
            cursor.execute("""
                SELECT key, value 
                FROM cursorDiskKV 
                WHERE key LIKE 'composerData:%' 
                ORDER BY key
            """)
            
            for key, value in cursor.fetchall():
                if not value:
                    continue
                try:
                    data = json.loads(value)
                    composer_id = key.split(':')[1]
                    
                    if 'fullConversationHeadersOnly' in data and data['fullConversationHeadersOnly']:
                        conversations[composer_id] = {
                            'composer_id': composer_id,
                            'created_at': data.get('createdAt', 'Unknown'),
                            'last_updated': datetime.now().isoformat(),
                            'bubbles': data['fullConversationHeadersOnly'],
                            'messages': [],
                            'context': data.get('context', {})
                        }
                except json.JSONDecodeError:
                    continue
            
            # Get message content
            for composer_id, conversation in conversations.items():
                for bubble_info in conversation['bubbles']:
                    bubble_id = bubble_info.get('bubbleId')
                    if bubble_id:
                        bubble_key = f'bubbleId:{composer_id}:{bubble_id}'
                        cursor.execute("SELECT value FROM cursorDiskKV WHERE key = ?", (bubble_key,))
                        result = cursor.fetchone()
                        
                        if result and result[0]:
                            try:
                                bubble_data = json.loads(result[0])
                                conversation['messages'].append({
                                    'bubble_id': bubble_id,
                                    'type': 'user' if bubble_data.get('type') == 1 else 'assistant',
                                    'data': bubble_data
                                })
                            except json.JSONDecodeError:
                                continue
        
        finally:
            conn.close()
        
        return conversations
    
    def _save_individual_conversations(self, conversations, timestamp):
        """Save each conversation as a separate file"""
        conv_dir = self.backup_dir / f"conversations_{timestamp}"
        conv_dir.mkdir(exist_ok=True)
        
        for composer_id, conversation in conversations.items():
            if conversation['messages']:
                created_at = conversation.get('created_at', 'Unknown')
                if isinstance(created_at, (int, float)):
                    date_str = datetime.fromtimestamp(created_at / 1000).strftime('%Y%m%d_%H%M%S')
                else:
                    date_str = 'unknown'
                
                filename = f"conversation_{date_str}_{composer_id[:8]}.json"
                filepath = conv_dir / filename
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(conversation, f, indent=2, ensure_ascii=False)
        
        # Copy to cloud if configured
        if self.cloud_path:
            cloud_conv_dir = self.cloud_path / f"conversations_{timestamp}"
            shutil.copytree(conv_dir, cloud_conv_dir, dirs_exist_ok=True)
    
    def create_markdown_export(self):
        """Export chats in readable Markdown format"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        conversations = self._extract_conversations()
        
        md_filename = f"cursor_chats_{timestamp}.md"
        local_md_path = self.backup_dir / md_filename
        
        with open(local_md_path, 'w', encoding='utf-8') as f:
            f.write("# Cursor Chat History Export\n\n")
            f.write(f"Exported on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"Total conversations: {len(conversations)}\n\n")
            f.write("---\n\n")
            
            for composer_id, conv in sorted(conversations.items(), 
                                          key=lambda x: x[1].get('created_at', 0), 
                                          reverse=True):
                if conv['messages']:
                    created_at = conv.get('created_at', 'Unknown')
                    if isinstance(created_at, (int, float)):
                        date = datetime.fromtimestamp(created_at / 1000).strftime('%Y-%m-%d %H:%M:%S')
                    else:
                        date = str(created_at)
                    
                    f.write(f"## Conversation: {composer_id[:8]}...\n")
                    f.write(f"**Date:** {date}\n")
                    f.write(f"**Messages:** {len(conv['messages'])}\n\n")
                    
                    for i, msg in enumerate(conv['messages'], 1):
                        msg_type = msg['type']
                        f.write(f"### Message {i} ({msg_type})\n\n")
                        
                        # Extract and write message content
                        msg_data = msg.get('data', {})
                        if 'text' in msg_data and msg_data['text']:
                            f.write(f"{msg_data['text']}\n\n")
                        elif 'richText' in msg_data:
                            f.write(f"[Rich text content - see JSON export for details]\n\n")
                        
                        # Add relevant files if any
                        relevant_files = msg_data.get('relevantFiles', [])
                        if relevant_files:
                            f.write(f"**Relevant files:** {', '.join(relevant_files)}\n\n")
                        
                        f.write("---\n\n")
        
        print(f"Markdown export created: {local_md_path}")
        
        # Copy to cloud if configured
        if self.cloud_path:
            cloud_md_path = self.cloud_path / md_filename
            shutil.copy2(local_md_path, cloud_md_path)
            print(f"Markdown exported to cloud: {cloud_md_path}")
        
        return local_md_path
    
    def setup_auto_backup(self, interval='daily'):
        """Set up automatic backups"""
        backup_script = self.backup_dir / 'auto_backup.sh'
        
        script_content = f"""#!/bin/bash
# Cursor Chat Auto-Backup Script

python3 {__file__} backup --cloud {self.cloud_provider or 'none'} --dir {self.backup_dir}
"""
        
        with open(backup_script, 'w') as f:
            f.write(script_content)
        
        os.chmod(backup_script, 0o755)
        
        if sys.platform == 'darwin':
            # Create launchd plist for macOS
            plist_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.cursor.chat.backup</string>
    <key>ProgramArguments</key>
    <array>
        <string>{backup_script}</string>
    </array>
    <key>StartInterval</key>
    <integer>{86400 if interval == 'daily' else 3600}</integer>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>"""
            
            plist_path = Path.home() / 'Library' / 'LaunchAgents' / 'com.cursor.chat.backup.plist'
            with open(plist_path, 'w') as f:
                f.write(plist_content)
            
            print(f"Auto-backup configured. To activate, run:")
            print(f"launchctl load {plist_path}")
        else:
            print("Auto-backup script created at:", backup_script)
            print("Add to cron for automatic execution")

def main():
    parser = argparse.ArgumentParser(description='Cursor Chat Backup Tool')
    parser.add_argument('action', choices=['backup', 'export', 'markdown', 'auto'], 
                       help='Action to perform')
    parser.add_argument('--cloud', choices=['icloud', 'dropbox', 'google_drive', 'onedrive', 'none'],
                       default='icloud', help='Cloud storage provider')
    parser.add_argument('--dir', help='Local backup directory')
    parser.add_argument('--interval', choices=['hourly', 'daily'], default='daily',
                       help='Backup interval for auto mode')
    
    args = parser.parse_args()
    
    # Check available cloud providers
    if args.cloud != 'none':
        available_providers = [p for p, info in CLOUD_PROVIDERS.items() if info['available']]
        if available_providers:
            print(f"Available cloud providers: {', '.join(available_providers)}")
            if args.cloud not in available_providers:
                args.cloud = available_providers[0]
                print(f"Using {args.cloud} as cloud provider")
        else:
            print("No cloud storage providers detected")
            args.cloud = None
    else:
        args.cloud = None
    
    backup = CursorChatBackup(backup_dir=args.dir, cloud_provider=args.cloud)
    
    if args.action == 'backup':
        backup.backup_database()
        backup.export_chats_json()
        backup.create_markdown_export()
    elif args.action == 'export':
        backup.export_chats_json()
    elif args.action == 'markdown':
        backup.create_markdown_export()
    elif args.action == 'auto':
        backup.setup_auto_backup(args.interval)

if __name__ == "__main__":
    main() 