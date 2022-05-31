locals {
  site_bucket_name = lower("${var.project}-${var.environment}-tiles-${var.aws_region}")
  logs_bucket_name = lower("${var.project}-${var.environment}-logs-${var.aws_region}")
}

data "aws_canonical_user_id" "current" {}

#
# S3 resources
#
data "aws_iam_policy_document" "read_only_bucket_policy" {
  policy_id = "S3AnonymousReadOnlyPolicy"

  statement {
    sid = "S3ReadOnly"

    effect = "Allow"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::${local.site_bucket_name}/*",
    ]
  }
}

resource "aws_s3_bucket" "site" {
  bucket = local.site_bucket_name
}

resource "aws_s3_bucket_cors_configuration" "site" {
  bucket = aws_s3_bucket.site.bucket

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_policy" "read_only_bucket" {
  bucket = aws_s3_bucket.site.bucket
  policy = data.aws_iam_policy_document.read_only_bucket_policy.json
}

resource "aws_s3_bucket" "logs" {
  bucket = local.logs_bucket_name
}

resource "aws_s3_bucket_acl" "logs" {
  bucket = local.logs_bucket_name
  access_control_policy {
    grant {
      grantee {
        id   = data.aws_canonical_user_id.current.id
        type = "CanonicalUser"
      }
      permission = "FULL_CONTROL"
    }

    owner {
      id = data.aws_canonical_user_id.current.id
    }
  }
}

#
# ECR resources
#
resource "aws_ecr_repository" "default" {
  name = local.short
} 