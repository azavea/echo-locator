locals {
  logs_bucket_name = lower("${var.project}-${var.environment}-logs-${var.aws_region}")
}

data "aws_canonical_user_id" "current" {}

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