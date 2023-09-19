import { listFiles } from '@/repository/s3';
import { NextResponse } from 'next/server';

async function GET() {
  try {
    const { Contents } = await listFiles({ Bucket: process.env.BUCKET_NAME });
    const baseUrl = process.env.CDN_URL;
    const fileList = Contents?.map((obj) => `https://${baseUrl}/${obj.Key}`);
    return NextResponse.json(fileList);
  } catch (error) {
    return NextResponse.json(
      { message: 'There was and error' },
      { status: 500 }
    );
  }
}

export { GET };
