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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const developer = await Developer.findById(id);

    if (!developer) {
      return NextResponse.json({ error: 'Developer not found' }, { status: 404 });
    }

    return NextResponse.json(developer);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch developer', detail: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const name = normalizeDeveloperName(body.name || '');

    if (!name) {
      return NextResponse.json({ error: 'Developer name is required' }, { status: 400 });
    }

    const developer = await Developer.findByIdAndUpdate(
      id,
      {
        name,
        nameKey: getDeveloperKey(name),
        logo: body.logo || '',
        bio: body.bio || '',
        units: parseUnits(body.units),
      },
      { new: true, runValidators: true }
    );

    if (!developer) {
      return NextResponse.json({ error: 'Developer not found' }, { status: 404 });
    }

    return NextResponse.json(developer);
  } catch (error: unknown) {
    console.error('Update Developer Error:', error);
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { error: 'A developer with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update developer', detail: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const developer = await Developer.findByIdAndDelete(id);

    if (!developer) {
      return NextResponse.json({ error: 'Developer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: id });
  } catch (error: unknown) {
    console.error('Delete Developer Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete developer', detail: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
