import express from 'express';
import readline from 'readline';

const app = express();
const PORT = 3000;

// Dummy news data with same shape as the real API
let dummyNews = [
  {
    "id_news": "130",
    "data": "11.08.2025",
    "title": "На вниманието на родителите"
  },
  {
    "id_news": "129",
    "data": "28.07.2025",
    "title": "СВОБОДНИ МЕСТА ЗА ДЕЦА, ПОДЛЕЖАЩИ НА ЗАДЪЛЖИТЕЛНО ПРЕДУЧИЛИЩНО ОБРАЗОВАНИЕ"
  },
  {
    "id_news": "128",
    "data": "27.06.2025",
    "title": "На вниманието на родителите"
  },
  {
    "id_news": "127",
    "data": "12.05.2025",
    "title": "Свободни места в общинските детски градини и детски градини с яслени групи"
  },
  {
    "id_news": "126",
    "data": "28.04.2025",
    "title": "Свободни места в общинските детски градини и детски градини с яслени групи 28.04.2025 г."
  }
];

let nextId = 131; // Next ID to use

// Sample titles for random generation
const sampleTitles = [
  "На вниманието на родителите",
  "СВОБОДНИ МЕСТА ЗА ДЕЦА, ПОДЛЕЖАЩИ НА ЗАДЪЛЖИТЕЛНО ПРЕДУЧИЛИЩНО ОБРАЗОВАНИЕ",
  "Свободни места в общинските детски градини и детски градини с яслени групи",
  "Важна информация за всички родители",
  "Нови правила за детските градини",
  "Специални програми за децата",
  "Обновления в образователната система",
  "Празнични събития в градината",
  "Здравни мерки и препоръки",
  "Сътрудничество с родителската общност"
];

// Sample dates for random generation
const sampleDates = [
  "15.08.2025",
  "20.08.2025",
  "25.08.2025",
  "01.09.2025",
  "05.09.2025",
  "10.09.2025",
  "15.09.2025",
  "20.09.2025",
  "25.09.2025",
  "01.10.2025"
];

// Function to generate random news item
const generateRandomNews = () => {
  const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
  const randomDate = sampleDates[Math.floor(Math.random() * sampleDates.length)];
  
  return {
    "id_news": nextId.toString(),
    "data": randomDate,
    "title": randomTitle
  };
};

// Function to add new news item
const addNewsItem = () => {
  const newItem = generateRandomNews();
  dummyNews.unshift(newItem); // Add to beginning (most recent)
  nextId++;
  
  console.log(`\n🚀 Added new news item:`);
  console.log(`   ID: ${newItem.id_news}`);
  console.log(`   Date: ${newItem.data}`);
  console.log(`   Title: ${newItem.title}`);
  console.log(`   Total items: ${dummyNews.length}`);
  console.log(`\nPress any key to add another item, or Ctrl+C to exit...`);
};

// Setup keypress listener
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Disable line buffering to get immediate keypresses
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log('🎯 Example News Server Started!');
console.log('📡 Server running on http://localhost:3000');
console.log('🔑 Press any key to add a new news item');
console.log('⏹️  Press Ctrl+C to exit\n');

// Keypress handler
process.stdin.on('data', (key) => {
  // Check for Ctrl+C
  if (key === '\u0003') {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
  }
  
  // Add new news item on any other keypress
  addNewsItem();
});

// API endpoint that matches the real uslugi.io API
app.post('/api/news', express.json(), (req, res) => {
  console.log(`📥 API request received at ${new Date().toISOString()}`);
  console.log(`   Request body:`, req.body);
  
  res.json({
    news: dummyNews
  });
});

// GET endpoint for easy testing
app.get('/api/news', (req, res) => {
  console.log(`📥 GET request received at ${new Date().toISOString()}`);
  
  res.json({
    news: dummyNews
  });
});

// Root endpoint with instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>🎯 Example News Server</h1>
    <p>This server provides dummy news data for testing the uslugi-watcher app.</p>
    
    <h2>Endpoints:</h2>
    <ul>
      <li><strong>POST /api/news</strong> - Main endpoint (matches real API)</li>
      <li><strong>GET /api/news</strong> - Easy testing endpoint</li>
    </ul>
    
    <h2>Usage:</h2>
    <p>Run the watcher with: <code>node index.js http://localhost:3000/api/news</code></p>
    
    <h2>Current News Count:</h2>
    <p><strong>${dummyNews.length}</strong> items available</p>
    
    <h2>Latest Items:</h2>
    <ul>
      ${dummyNews.slice(0, 5).map(item => 
        `<li><strong>ID ${item.id_news}</strong> (${item.data}): ${item.title}</li>`
      ).join('')}
    </ul>
    
    <p><em>Press any key in the server console to add new items!</em></p>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌐 Server listening on http://localhost:${PORT}`);
  console.log(`📊 Initial news count: ${dummyNews.length}`);
  console.log(`🔑 Press any key to add news items...\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});
