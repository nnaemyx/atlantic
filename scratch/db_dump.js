const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Parse .env.local manually
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    const lines = envConfig.split(/\r?\n/); // Split on both \r\n and \n
    for (const line of lines) {
      if (line.trim().startsWith('#') || !line.includes('=')) continue;
      const index = line.indexOf('=');
      const key = line.substring(0, index).trim();
      let value = line.substring(index + 1).trim();
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
} catch (e) {
  console.error('Failed to parse .env.local:', e);
}

console.log('Using MONGODB_URI:', process.env.MONGODB_URI);

const SiteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  type: { type: String, default: 'text' },
  section: { type: String, required: true },
  label: { type: String, required: true },
});

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set!');
    }
    await mongoose.connect(uri);
    console.log('Connected to DB successfully');
    const contents = await SiteContent.find({}).lean();
    console.log('--- Site Contents ---');
    console.log(JSON.stringify(contents, null, 2));
    console.log('---------------------');
    process.exit(0);
  } catch (error) {
    console.error('Connection/Query error:', error);
    process.exit(1);
  }
}

run();
