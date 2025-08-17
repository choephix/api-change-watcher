# Example News Server

A test server that provides dummy news data matching the format of the real uslugi.io API.

## Features

- 🎯 **Identical API format** - Matches the real uslugi.io news API exactly
- 🔑 **Interactive keypress** - Press any key to add new news items
- 📊 **Real-time updates** - See news count increase as you add items
- 🌐 **Web interface** - View current data at http://localhost:3000
- 🧪 **Perfect for testing** - Test your watcher app without hitting the real API

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the example server:**
   ```bash
   npm run serve:example
   ```

3. **Test with the watcher:**
   ```bash
   npm run start:example
   ```

## How It Works

### 🎮 **Interactive Mode**
- **Press any key** → Adds a new random news item
- **Ctrl+C** → Shuts down the server
- **Real-time feedback** → See new items being added

### 📡 **API Endpoints**
- **POST /api/news** - Main endpoint (matches real API format)
- **GET /api/news** - Easy testing endpoint
- **GET /** - Web interface showing current data

### 📊 **Data Generation**
- **Auto-incrementing IDs** - Each new item gets the next available ID
- **Random titles** - Uses realistic Bulgarian news titles
- **Realistic dates** - Future dates in DD.MM.YYYY format
- **Same structure** - Identical to the real API response

## Testing Your Watcher

1. **Start the example server:**
   ```bash
   npm run serve:example
   ```

2. **In another terminal, run your watcher:**
   ```bash
   npm run start:example
   ```

3. **Add news items** by pressing keys in the server terminal

4. **Watch the alerts** in your watcher terminal

## Example Session

```
🎯 Example News Server Started!
📡 Server running on http://localhost:3000
🔑 Press any key to add a new news item
⏹️  Press Ctrl+C to exit

🌐 Server listening on http://localhost:3000
📊 Initial news count: 5
🔑 Press any key to add news items...

🚀 Added new news item:
   ID: 131
   Date: 15.08.2025
   Title: Важна информация за всички родители
   Total items: 6

Press any key to add another item, or Ctrl+C to exit...
```

## Perfect for Development

- **No rate limiting** - Test as fast as you want
- **Predictable data** - Know exactly what to expect
- **Easy debugging** - See all requests in the server console
- **Realistic testing** - Same data structure as production

## Web Interface

Visit http://localhost:3000 to see:
- Current news count
- Latest news items
- API usage instructions
- Real-time updates

This makes it easy to verify the data without using the terminal!
