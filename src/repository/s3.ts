import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3';

const client = new S3Client({ region: process.env.AWS_REGION });

export async function uploadFile(command: PutObjectCommandInput) {
  const response: PutObjectCommandOutput = await client.send(
    new PutObjectCommand(command)
  );
  return response;
}

export async function listFiles(command: ListObjectsV2CommandInput) {
  const response: ListObjectsV2CommandOutput = await client.send(
    new ListObjectsV2Command(command)
  );
  return response;
}
