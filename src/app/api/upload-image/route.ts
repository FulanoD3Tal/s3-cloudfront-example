import { uploadFile } from '@/repository/s3';
import { NextRequest, NextResponse } from 'next/server';

async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('image-file') as unknown as File;
  if (!file)
    return NextResponse.json({ message: 'image required' }, { status: 404 });

  const arrayBuffer = await file.arrayBuffer();
  try {
    await uploadFile({
      Bucket: process.env.BUCKET_NAME,
      Key: file.name,
      Body: arrayBuffer as any,
      ContentType: 'image/png',
    });
    return NextResponse.json({ message: 'image uploaded' });
  } catch (error) {
    return NextResponse.json(
      { message: 'error uploading the image' },
      { status: 500 }
    );
  }
}

export { POST };
