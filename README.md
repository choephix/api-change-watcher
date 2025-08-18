# API Change Watcher

A robust Node.js tool for monitoring APIs and detecting new items in real-time. Perfect for news feeds, content updates, or any API that returns lists of items.

*This project was born out of necessity when I needed to track kindergarten openings on a government website. For some ungodly reason, the system works like this: parents wait in line all night (and often all day the previous day) outside the building to keep their spot. Then everyone manually refreshes the page constantly to know when to go in — and whether there are openings at all. There is no notification system.*

*This tool does not fix the underlying systemic and bureaucratic issues that force people to queue-camp, but it does eliminate the need for manual checking. By repeatedly polling the website's API, it tracks when new information appears and alerts me immediately. Now I know as soon as possible when to enter the building — or it's time to go home.*

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

```bash
git clone <repository-url>
cd api-change-watcher
npm install
```

## 🔧 Configuration

## 🎯 Usage

### Basic Command Structure

```bash
node index.js -u <API_URL> -f <ID_FIELD> -b <REQUEST_BODY_JSON> [-w <WEBHOOK_URL>]
```

### CLI Options

| Option | Short | Required | Description | Example |
|--------|-------|----------|-------------|---------|
| `--url` | `-u` | ✅ | API URL to monitor | `https://api.example.com/news` |
| `--id-field` | `-f` | ✅ | Field name for comparing items | `id_news`, `uuid`, `article_id` |
| `--body` | `-b` | ✅ | Request body as JSON string | `'{"reception":"garden"}'` |
| `--webhook` | `-w` | ❌ | Webhook URL for notifications | `https://maker.ifttt.com/trigger/...` |
| `--interval` | `-i` | ❌ | Check interval in seconds (default: 10) | `30` |
| `--verbose` | `-v` | ❌ | Enable verbose logging | |
| `--help` | `-h` | ❌ | Show help information | |
| `--version` | `-V` | ❌ | Show version | |

## 🌟 Perfect Example: uslugi.io News Monitor

This tool was specifically designed for monitoring the uslugi.io news API. Here's the complete working example:

### Quick Start (Copy & Run)

```bash
# Clone and setup
git clone git@github.com:choephix/api-change-watcher.git
cd api-change-watcher
npm install

# Start monitoring uslugi.io news (10-second intervals)
node index.js \
  -u https://dg.uslugi.io/lv/api/news \
  -f id_news \
  -b '{"reception":"garden"}'

# Start monitoring with webhook notifications
node index.js \
  -u https://dg.uslugi.io/lv/api/news \
  -f id_news \
  -b '{"reception":"garden"}' \
  # (optionally add ifttt webhook for realtime alerting)
  -w https://maker.ifttt.com/trigger/your_webhook/with/key/your_key 
```

### What This Does

1. **Monitors** the uslugi.io news API every 10 seconds
2. **Detects** new news items by comparing `id_news` field values
3. **Saves** all data to `data/latest_news.json`
4. **Sends** webhook notifications when new items are found
5. **Logs** everything with beautiful, color-coded output

### Expected API Response Format

The tool expects the API to return data in this format:

```json
{
  "news": [
    {
      "id_news": 131,
      "title": "News Title",
      "data": "2025-08-18",
      "content": "News content..."
    }
  ]
}
```

### Monitor with Custom Headers

The tool uses standard headers, but you can modify the `fetchNews` function in `index.js` to add custom headers if needed.

### Data Files

All fetched data is saved to `data/latest_news.json` with this structure:

```json
{
  "lastUpdated": "2025-08-18T13:29:01.035Z",
  "apiUrl": "https://dg.uslugi.io/lv/api/news",
  "fetchCount": 14,
  "news": [...]
}
```

## 🔗 Webhook Integration

When new items are detected, the tool sends webhook notifications to IFTTT with:

- **value1**: Alert message
- **value2**: Count change information
- **value3**: ID change details

## 🚦 Scripts

### NPM Scripts

```bash
# Start monitoring uslugi.io news
npm start

# Start monitoring with webhook notifications
npm run start:webhook

# Start with custom parameters
npm run start:example

# Development mode with file watching
npm run dev

# Start example server (if available)
npm run serve:example
```

### Custom Scripts

You can create your own scripts in `package.json`:

```json
{
  "scripts": {
    "monitor-blog": "node index.js -u https://blog.example.com/api/posts -f post_id -b '{\"status\":\"published\"}' -i 60",
    "monitor-shop": "node index.js -u https://shop.example.com/api/products -f sku -b '{\"category\":\"electronics\"}' -i 300"
  }
}
```

## 🛑 Graceful Shutdown

The tool handles `SIGINT` (Ctrl+C) and `SIGTERM` signals gracefully, ensuring clean shutdown.
