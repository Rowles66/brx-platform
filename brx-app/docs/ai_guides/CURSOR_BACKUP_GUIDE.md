# Cursor Chat Backup System - Quick Reference Guide

## ✅ Setup Complete!
Your Cursor chat history is now being automatically backed up daily to both local storage and iCloud.

## 📍 Backup Locations
- **Local Backups**: `~/CursorChatBackups/`
- **iCloud Backups**: `~/Library/Mobile Documents/com~apple~CloudDocs/CursorChatBackups/`
- **Accessible from**: All your Apple devices (iPhone, iPad, other Macs)

## 🔧 Manual Backup Commands
```bash
# Full backup (database + all export formats)
python3 cursor_chat_backup.py backup

# Export only chat conversations to JSON
python3 cursor_chat_backup.py export

# Create readable Markdown version
python3 cursor_chat_backup.py markdown
```

## 👁️ View Your Chat History
1. Open the viewer: `open cursor_chat_viewer.html`
2. Click "Load Chat Export"
3. Select any `cursor_chats_export_*.json` file from your backups

## 🤖 Automatic Backup Status
```bash
# Check if auto-backup is running
launchctl list | grep cursor

# Stop auto-backup
launchctl unload ~/Library/LaunchAgents/com.cursor.chat.backup.plist

# Start auto-backup
launchctl load ~/Library/LaunchAgents/com.cursor.chat.backup.plist
```

## 📁 What Gets Backed Up
1. **Database Backup** (`.vscdb`) - Complete database copy
2. **JSON Export** (`.json`) - Structured chat data for viewing/processing
3. **Markdown Export** (`.md`) - Human-readable text format
4. **Individual Conversations** - Separate files for each chat session

## 💡 Tips
- Backups run automatically every 24 hours
- All backups are timestamped (YYYYMMDD_HHMMSS format)
- The viewer works offline - no internet needed
- Search works across all conversations in the viewer
- Your existing chat history has already been backed up!

## 🚨 Troubleshooting
If Cursor doesn't show chat history:
1. Your chats ARE saved (check backups)
2. Use the viewer to access them
3. This is a known Cursor UI issue

## 📱 Access from Other Devices
Your chats sync via iCloud to:
- Other Macs: Same paths
- iPhone/iPad: Files app → iCloud Drive → CursorChatBackups

---
Created: 2025-05-30
Scripts: cursor_chat_backup.py, cursor_chat_viewer.html 