import { NextRequest, NextResponse } from 'next/server';

async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('image-file') as unknown as File;
  if (!file)
    return NextResponse.json({ message: 'image required' }, { status: 404 });
  return NextResponse.json({ filePath: file.name });
}

export { POST };
