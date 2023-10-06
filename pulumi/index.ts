import * as aws from '@pulumi/aws';

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.BucketV2('images-bucket');
const BucketOwnershipControls = new aws.s3.BucketOwnershipControls(
  'image-bucket-ownerShip',
  {
    bucket: bucket.id,
    rule: {
      objectOwnership: 'BucketOwnerPreferred',
    },
  }
);

const bucketACL = new aws.s3.BucketAclV2(
  'image-bucket-acl',
  {
    bucket: bucket.id,
    acl: 'private',
  },
  {
    dependsOn: [BucketOwnershipControls],
  }
);

const bucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock(
  'image-bucket-public-access-block',
  {
    bucket: bucket.id,
    blockPublicAcls: false,
    ignorePublicAcls: false,
    blockPublicPolicy: false,
    restrictPublicBuckets: false,
  }
);

const bucketPolicy = new aws.s3.BucketPolicy(
  'image-bucket-policy',
  {
    bucket: bucket.bucket,
    policy: bucket.bucket.apply((bucketName: string) => {
      return JSON.stringify({
        Version: '2012-10-17',
        Id: 'AllowGetObjects',
        Statement: [
          {
            Sid: 'AllowPublic',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/**`],
          },
        ],
      });
    }),
  },
  {
    dependsOn: [bucketPublicAccessBlock],
  }
);

const cloudFront = new aws.cloudfront.Distribution('image-cdn', {
  enabled: true,
  origins: [
    {
      domainName: bucket.bucketDomainName,
      originId: bucket.id,
      originShield: {
        enabled: true,
        originShieldRegion: 'us-east-1',
      },
    },
  ],
  defaultCacheBehavior: {
    targetOriginId: bucket.id,
    compress: true,
    viewerProtocolPolicy: 'redirect-to-https',
    allowedMethods: ['GET', 'HEAD'],
    cachedMethods: ['GET', 'HEAD'],
    cachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
  },
  restrictions: {
    geoRestriction: {
      restrictionType: 'none',
    },
  },
  viewerCertificate: {
    cloudfrontDefaultCertificate: true,
  },
});

// Export the name of the bucket
export const bucketName = bucket.id;
export const cdnUrl = cloudFront.domainName;
