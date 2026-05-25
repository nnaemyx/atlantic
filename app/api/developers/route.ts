import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getDeveloperKey, normalizeDeveloperName } from '@/lib/developers';
import { Developer } from '@/models';

function parseUnits(units: unknown) {
  if (units === '' || units === null || units === undefined) {
    return 0;
  }

  const parsed = Number(units);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 11000
  );
}

export async function GET() {
  try {
    await connectDB();
    const developers = await Developer.find({}).sort({ name: 1 }).lean();
    return NextResponse.json(developers || []);
  } catch (error: unknown) {
    console.error('Fetch Developers Error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const name = normalizeDeveloperName(body.name || '');

    if (!name) {
      return NextResponse.json({ error: 'Developer name is required' }, { status: 400 });
    }

    const developer = await Developer.create({
      name,
      nameKey: getDeveloperKey(name),
      logo: body.logo || '',
      bio: body.bio || '',
      units: parseUnits(body.units),
    });

    return NextResponse.json(developer, { status: 201 });
  } catch (error: unknown) {
    console.error('Create Developer Error:', error);
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { error: 'A developer with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create developer', detail: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
