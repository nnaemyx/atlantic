import fs from 'fs';
import path from 'path';

// Parse .env.local manually
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
} catch (e) {
  console.error('Failed to parse .env.local:', e);
}

import connectDB from '../lib/db';
import { SiteContent } from '../models';

async function run() {
  try {
    await connectDB();
    console.log('Connected to DB');
    const contents = await SiteContent.find({}).lean();
    console.log('--- Site Contents ---');
    console.log(JSON.stringify(contents, null, 2));
    console.log('---------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
