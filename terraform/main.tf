terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.15.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "s3" {
  bucket_prefix = "images-bucket-"
}

resource "aws_s3_bucket_ownership_controls" "s3_controls" {
  bucket = aws_s3_bucket.s3.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "s3_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.s3_controls]
  bucket     = aws_s3_bucket.s3.id
  acl        = "private"
}

resource "aws_s3_bucket_public_access_block" "s3_access" {
  bucket = aws_s3_bucket.s3.id

  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.s3.id

  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "AllowGetObjects"
    Statement = [
      {
        Sid       = "AllowPublic"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.s3.arn}/**"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.s3_access]
}

resource "aws_cloudfront_distribution" "cloudfront" {
  enabled = true
  origin {
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

output "cloudfront" {
  value = aws_cloudfront_distribution.cloudfront.domain_name
}

output "s3" {
  value = aws_s3_bucket.s3.bucket_domain_name
}

