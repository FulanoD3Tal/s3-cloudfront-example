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

output "s3" {
  value = aws_s3_bucket.s3.bucket_domain_name
}
