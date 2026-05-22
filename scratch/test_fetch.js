const fs = require('fs');

async function run() {
  try {
    const url = 'https://unsplash.com/s/photos/black-couple-keys';
    console.log('Fetching Unsplash search results for black-couple-keys...');
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();
    
    // Find all images with sources starting with images.unsplash.com/photo-
    const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-8_-]+/g;
    const matches = html.match(regex) || [];
    
    // Deduplicate matches
    const uniqueMatches = Array.from(new Set(matches));
    console.log('--- Found Unsplash Image URLs ---');
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
