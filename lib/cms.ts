import connectDB from '@/lib/db';
import { SiteContent } from '@/models';

export async function getCMS(key: string, fallback: string) {
  try {
    await connectDB();
    const content = await SiteContent.findOne({ key }).lean();
    if (content && content.value) {
      return content.value;
    }
    return fallback;
  } catch (error) {
    console.error(`CMS Fetch Error for key ${key}:`, error);
    return fallback;
  }
}

export async function getAllCMS() {
  try {
    await connectDB();
    const contents = await SiteContent.find({}).lean();
    const map: Record<string, string> = {};
    for (const c of contents) {
      map[c.key] = c.value;
    }
    return map;
  } catch (error) {
    return {};
  }
}
