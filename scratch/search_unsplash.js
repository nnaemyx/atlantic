const fs = require('fs');

async function run() {
  try {
    const query = 'black couple keys';
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=10`;
    console.log(`Fetching Unsplash API results for "${query}"...`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const data = await response.json();
    
    console.log('--- Unsplash Search Results ---');
    if (data.results && data.results.length > 0) {
      data.results.forEach((photo, i) => {
        console.log(`${i + 1}: ID: ${photo.id}`);
        console.log(`   Description: ${photo.description || photo.alt_description}`);
        console.log(`   URL: https://images.unsplash.com/photo-${photo.id}`);
        console.log('---');
      });
    } else {
      console.log('No results found.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
