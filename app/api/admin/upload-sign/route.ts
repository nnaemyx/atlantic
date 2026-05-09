import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

    if (!apiSecret || !uploadPreset) {
      console.error('Missing Cloudinary config:', {
        hasSecret: !!apiSecret,
        hasPreset: !!uploadPreset,
      });
      return NextResponse.json({ error: 'Cloudinary configuration missing on server' }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, upload_preset: uploadPreset },
      apiSecret
    );

    return NextResponse.json({ signature, timestamp, upload_preset: uploadPreset });
  } catch (error: any) {
    console.error('Signature generation error:', error);
    return NextResponse.json({ error: 'Failed to generate signature', detail: error?.message }, { status: 500 });
  }
}
