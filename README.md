# Uslugi.io News Watcher

A Node.js application that monitors the uslugi.io news API every 10 seconds and alerts when new items are found.

## Features

- 🔍 Monitors news API every 10 seconds
- 📊 Tracks item count and latest item ID
- 🚨 Big console alerts when new items are detected
- 🎨 Color-coded console output for easy reading
- 📱 Graceful shutdown handling
- ⚡ Real-time monitoring with detailed logging
- 🔧 **Flexible URL configuration** via command line arguments
- 💾 **File tracking** - saves latest fetch result to a single JSON file

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

### Start the monitor with default URL:
```bash
npm start
```

### Start with custom URL:
```bash
node index.js https://your-api-endpoint.com/api/news
```

### Start with example server:
```bash
npm run start:example
```

### Development mode (with auto-restart):
```bash
npm run dev
```

## Command Line Arguments

The app accepts an optional URL as the first command line argument:

- **No arguments**: Uses default URL (`https://dg.uslugi.io/lv/api/news`)
- **With URL**: Uses the provided URL for monitoring

Examples:
```bash
# Use default URL
node index.js

# Use custom URL
node index.js https://api.example.com/news

# Use example server
npm run start:example
```

## File Tracking

Every API fetch result is automatically saved to a single JSON file (`data/latest_news.json`), overwriting the previous data. This allows you to:

- 📈 **Track current state** - always see the latest news data
- 🔍 **Monitor changes** - see when the file was last updated
- 📊 **Quick access** - single file to check current news status
- 💾 **Version control** - track changes in your git repository

### File Structure

The app maintains a single file: `data/latest_news.json`

Each update overwrites the file with:
```json
{
  "lastUpdated": "2025-01-27T10:30:00.000Z",
  "apiUrl": "https://dg.uslugi.io/lv/api/news",
  "fetchCount": 13,
  "news": [
    {
      "id_news": "130",
      "data": "11.08.2025",
      "title": "На вниманието на родителите"
    }
    // ... more news items
  ]
}
```

### Data Directory

The app automatically creates a `data/` directory in your project folder. The `latest_news.json` file is continuously updated with each fetch, so you always have the most current data.

## How it works

1. **Initialization**: On first run, the app records the current latest news item ID and total count
2. **Monitoring**: Every 10 seconds, it fetches the latest news from the API
3. **File Saving**: Each fetch result overwrites the `latest_news.json` file
4. **Detection**: Compares the latest ID with the previously seen ID
5. **Alerting**: When new items are found, displays a prominent console alert with details
6. **Tracking**: Updates the tracking state to monitor for future changes

## Console Output

- 🚀 **Green**: Initialization and successful operations
- ✅ **Green**: No new items found
- 🚨 **Red**: Big alert box for new items
- 📊 **Cyan**: Statistics and counts
- 📰 **Magenta**: New item details
- ⚠️ **Yellow**: Warnings and reordering events
- ❌ **Red**: Errors
- 🔍 **Cyan**: Startup information
- 📝 **Yellow**: Custom URL usage notification
- 💾 **Cyan**: File update confirmations
- 📁 **Blue**: Data file information

## API Details

- **Default Endpoint**: `https://dg.uslugi.io/lv/api/news`
- **Method**: POST
- **Body**: `{"reception":"garden"}`
- **Response**: JSON with news array containing `id_news`, `data`, and `title` fields

## Stopping the Monitor

Press `Ctrl+C` to gracefully stop the monitoring process.

## Example Alert Output

When new items are detected, you'll see a prominent alert box like:

```
╔══════════════════════════════════════════════════════════════╗
║                        🚨 ALERT! 🚨                        ║
╠══════════════════════════════════════════════════════════════╣
║                    NEW ITEMS DETECTED! 🎉                   ║
║
╚══════════════════════════════════════════════════════════════╝
```
