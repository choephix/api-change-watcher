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

### Test with a sample API:
```bash
npm run test
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

# Use test URL
npm run test
```

## How it works

1. **Initialization**: On first run, the app records the current latest news item ID and total count
2. **Monitoring**: Every 10 seconds, it fetches the latest news from the API
3. **Detection**: Compares the latest ID with the previously seen ID
4. **Alerting**: When new items are found, displays a prominent console alert with details
5. **Tracking**: Updates the tracking state to monitor for future changes

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
╚══════════════════════════════════════════════════════════════╝
```
