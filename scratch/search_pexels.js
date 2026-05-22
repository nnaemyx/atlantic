const fs = require('fs');

async function run() {
  try {
    const url = 'https://www.pexels.com/search/black%20couple%20keys/';
    console.log('Fetching Pexels search results...');
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();
    
    // Find all images with sources starting with images.pexels.com/photos/
    const regex = /https:\/\/images\.pexels\.com\/photos\/[0-9]+\/pexels-photo-[0-9]+\.jpeg[?a-zA-Z0-9=&_-]*/g;
    const matches = html.match(regex) || [];
    
    const uniqueMatches = Array.from(new Set(matches.map(m => m.split('?')[0])));
    console.log('--- Found Pexels Image URLs ---');
    uniqueMatches.slice(0, 15).forEach((url, i) => {
      console.log(`${i + 1}: ${url}`);
    });
    console.log('---------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
