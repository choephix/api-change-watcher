import fetch from 'node-fetch';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { Command } from 'commander';

// Load environment variables from .env file
dotenv.config();

// CLI configuration
const program = new Command();

program
  .name('uslugi-watcher')
  .description('Monitor uslugi.io news API for new items')
  .version('1.0.0')
  .requiredOption('-u, --url <url>', 'API URL to monitor')
  .requiredOption('-f, --id-field <field>', 'Field name to use for comparing items (e.g., id_news)', 'id_news')
  .requiredOption('-b, --body <json>', 'Request body as JSON string (e.g., \'{"reception":"garden"}\')')
  .option('-i, --interval <seconds>', 'Check interval in seconds', '10')
  .option('-v, --verbose', 'Enable verbose logging')
  .helpOption('-h, --help', 'Display help information')
  .parse();

const options = program.opts();

// Configuration from CLI options
const API_URL = options.url;
const CHECK_INTERVAL = parseInt(options.interval) * 1000; // Convert to milliseconds
const ID_FIELD = options.idField;
const REQUEST_BODY = JSON.parse(options.body); // Parse JSON from CLI argument

// Webhook configuration
const WEBHOOK_URL = process.env.IFTTT_WEBHOOK_URL;

// File tracking configuration
const DATA_DIR = 'data';
const DATA_FILE = 'latest_news.json';

// State tracking
let lastSeenId = null;
let itemsCount = 0;
let isFirstRun = true;

// Console colors for better visibility
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}${colors.bright}[${timestamp}]${colors.reset} ${message}`);
};

const logAlert = (message) => {
  const alert = `
${colors.red}${colors.bright}
╔══════════════════════════════════════════════════════════════╗
║                        🚨 ALERT! 🚨                        ║
╠══════════════════════════════════════════════════════════════╣
║                    ${message.padEnd(50)} ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`;
  console.log(alert);
};

const callWebhook = async (newItems, previousCount, currentCount, previousId, currentId) => {
  try {
    const webhookData = {
      value1: `New news items detected!`,
      value2: `Count: ${previousCount} → ${currentCount} (+${currentCount - previousCount})`,
      value3: `Latest ID: ${previousId} → ${currentId}`
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (response.ok) {
      log(`🌐 Webhook sent successfully`, 'green');
    } else {
      log(`⚠️  Webhook failed with status: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ Webhook error: ${error.message}`, 'red');
  }
};

const saveToFile = (data, timestamp) => {
  try {
    // Create data directory if it doesn't exist
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    const filePath = join(DATA_DIR, DATA_FILE);
    
    const fileData = {
      lastUpdated: timestamp,
      apiUrl: API_URL,
      fetchCount: data.length,
      news: data
    };

    writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
    log(`💾 Updated ${DATA_FILE}`, 'cyan');
  } catch (error) {
    log(`❌ Error saving to file: ${error.message}`, 'red');
  }
};

const fetchNews = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'text/plain',
        'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Chrome OS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      body: JSON.stringify(REQUEST_BODY)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.news || [];
  } catch (error) {
    log(`❌ Error fetching news: ${error.message}`, 'red');
    return [];
  }
};

const checkForNewItems = async () => {
  const timestamp = new Date().toISOString();
  const news = await fetchNews();
  
  // Save every fetch result to file (overwriting the same file)
  saveToFile(news, timestamp);
  
  if (news.length === 0) {
    log('⚠️  No news items received', 'yellow');
    return;
  }

  const currentItemsCount = news.length;
  const latestItem = news[0]; // First item is the most recent
  const latestId = latestItem[ID_FIELD];

  // First run - just initialize tracking
  if (isFirstRun) {
    lastSeenId = latestId;
    itemsCount = currentItemsCount;
    log(`🚀 Initialized tracking - Latest ID: ${latestId}, Total items: ${currentItemsCount}`, 'green');
    isFirstRun = false;
    return;
  }

  // Check if we have new items
  if (latestId !== lastSeenId) {
    const newItemsCount = currentItemsCount - itemsCount;
    
    if (newItemsCount > 0) {
      logAlert(`NEW ITEMS DETECTED! 🎉`);
      log(`📊 Previous count: ${itemsCount} → Current count: ${currentItemsCount}`, 'cyan');
      log(`🆕 New items found: ${newItemsCount}`, 'green');
      log(`🆔 Latest ID changed: ${lastSeenId} → ${latestId}`, 'yellow');
      
      // Show details of new items
      const newItems = news.slice(0, newItemsCount);
      newItems.forEach((item, index) => {
        log(`📰 New item ${index + 1}: ${item.title} (ID: ${item[ID_FIELD]}, Date: ${item.data})`, 'magenta');
      });

      // Call webhook with alert data
      await callWebhook(newItems, itemsCount, currentItemsCount, lastSeenId, latestId);
    } else {
      log(`🔄 Items reordered - Latest ID changed: ${lastSeenId} → ${latestId}`, 'blue');
    }
    
    lastSeenId = latestId;
    itemsCount = currentItemsCount;
  } else {
    log(`✅ No new items - Latest ID: ${latestId}, Total items: ${currentItemsCount}`, 'green');
  }
};

const startMonitoring = () => {
  log('🔍 Starting uslugi.io news monitor...', 'cyan');
  log(`⏰ Checking every ${CHECK_INTERVAL / 1000} seconds`, 'blue');
  log(`🌐 API endpoint: ${API_URL}`, 'blue');
  log(`🔑 ID field: ${ID_FIELD}`, 'blue');
  log(`📤 Request body: ${JSON.stringify(REQUEST_BODY)}`, 'blue');
  log(`📁 Data will be saved to ${DATA_DIR}/${DATA_FILE}`, 'blue');
  
  if (WEBHOOK_URL) {
    log(`🔗 Webhook enabled: ${WEBHOOK_URL}`, 'blue');
  }
  
  // Initial check
  checkForNewItems();
  
  // Set up periodic checking
  setInterval(checkForNewItems, CHECK_INTERVAL);
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('🛑 Shutting down monitor...', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('🛑 Shutting down monitor...', 'yellow');
  process.exit(0);
});

// Start the application
startMonitoring();
