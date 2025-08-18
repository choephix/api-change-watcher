#  Api Watcher

A Node.js application that monitors any JSON API endpoint every 10 seconds and alerts when new items are found.

*This project was born out of necessity when I needed to track kindergarten openings on a government website. For some ungodly reason, the system works like this: parents wait in line all night (and often all day the previous day) outside the building to keep their spot. Then everyone manually refreshes the page constantly to know when to go in — and whether there are openings at all. There is no notification system.*

*This tool does not fix the underlying systemic and bureaucratic issues that force people to queue-camp, but it does eliminate the need for manual checking. By repeatedly polling the website’s API, it tracks when new information appears and alerts me immediately. Now I know as soon as possible when to enter the building — or it’s time to go home.*

## Installation

1. Install dependencies:
```bash
npm install
```

2. **Optional**: Configure webhook notifications:
   ```bash
   cp env.example .env
   # Edit .env with your webhook URL
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

## Webhook Notifications

The app can send webhook notifications when new items are detected. This is perfect for:
- 📱 **Push notifications** via IFTTT
- 💬 **Slack/Discord messages**
- 📧 **Email alerts**
- 🔔 **SMS notifications**

### Configuration

Set the `IFTTT_WEBHOOK_URL` environment variable:

```bash
# Option 1: Environment variable
export IFTTT_WEBHOOK_URL="https://your-webhook-url.com/endpoint"

# Option 2: .env file
echo "IFTTT_WEBHOOK_URL=https://your-webhook-url.com/endpoint" > .env

# Option 3: Use default (built-in IFTTT webhook)
# No configuration needed
```

### Webhook Data

When new items are detected, the webhook receives:

```json
{
  "value1": "New news items detected!",
  "value2": "Count: 13 → 14 (+1)",
  "value3": "Latest ID: 130 → 131"
}
```

### IFTTT Integration

The default webhook is configured for IFTTT. You can:
1. **Use the default** - Works out of the box
2. **Customize** - Set your own webhook URL in `.env`
3. **Disable** - Set `IFTTT_WEBHOOK_URL=` (empty) to disable

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
6. **Webhook**: Sends notification to configured webhook endpoint
7. **Tracking**: Updates the tracking state to monitor for future changes

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
- 🔗 **Blue**: Webhook configuration information
- 🌐 **Green**: Webhook success confirmations

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

And webhook confirmation:
```
🌐 Webhook sent successfully
```
