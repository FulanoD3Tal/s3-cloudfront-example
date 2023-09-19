import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

const client = new S3Client({ region: process.env.AWS_REGION });

export async function uploadFile(command: PutObjectCommandInput) {
  const response: PutObjectCommandOutput = await client.send(
    new PutObjectCommand(command)
  );
  return response;
}
