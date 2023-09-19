# Next image porfolio

Demo of how to use `s3 bucket` with `cloudfront` to deliver fast and cache image response

## Configuration

create a `.env`or `.env.local`file in the root folder

```bash
# The name of the bucket
BUCKET_NAME=
#the aws region
AWS_REGION=
#the cloudfront domain
CDN_URL=
```

This example use `terraform` to create the `AWS resources` so if you want it, you fill the .env variables with the output from the `apply` command

## Frontend

The front end is a `Next.js` application

```tsx
export default function Home() {
  return (
    <main className='p-24'>
      <section className='mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Image portfolio</h1>
        //The form to upload files
        <ImageForm />
        <hr className='flex w-1/2 my-4' />
      </section>
      <section>
        //A list with the images
        <ImageList />
      </section>
    </main>
  );
}
```

## Backend

With the `api route handler` of `Next.js` we create and api in order to avoid to use `s3 command` from the web browser

```markdown
.
├── app
│ ├── api
│ │ ├── image
│ │ │ └── route.ts (+)
│ │ └── upload-image
│ │ └── route.ts (+)
...
```

### AWS SDK

In order to upload and list files from a `s3 bucket` we need the `AWS SDK Version 3`

In the file `/src/repository/s3.ts` is the abstraction in order to use the library

```ts
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3';

// Creating the client
const client = new S3Client({ region: process.env.AWS_REGION });

// Upload a file
export async function uploadFile(command: PutObjectCommandInput) {
  const response: PutObjectCommandOutput = await client.send(
    new PutObjectCommand(command)
  );
  return response;
}
// Get a list of element
export async function listFiles(command: ListObjectsV2CommandInput) {
  const response: ListObjectsV2CommandOutput = await client.send(
    new ListObjectsV2Command(command)
  );
  return response;
}
```

## The cloudfront resource

```hcl
resource "aws_cloudfront_distribution" "cloudfront" {
  enabled = true
  origin {
    # Here is where we connect the s3 with the cloudfront
    domain_name = aws_s3_bucket.s3.bucket_domain_name
    origin_id   = aws_s3_bucket.s3.bucket
    origin_shield {
      enabled              = true
      origin_shield_region = var.aws_region
    }
  }
  default_cache_behavior {
    target_origin_id       = aws_s3_bucket.s3.bucket
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    # use a recommended cache policy when using the console
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  price_class = "PriceClass_200"
}
```
