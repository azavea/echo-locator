module "origin" {
  source = "github.com/azavea/terraform-aws-s3-origin?ref=2.0.0"

  bucket_name      = "echo-locator-${lower(var.environment)}-site-${var.aws_region}"
  logs_bucket_name = "echo-locator-${lower(var.environment)}-logs-${var.aws_region}"

  cors_allowed_headers = ["Authorization"]
  cors_allowed_methods = ["GET"]
  cors_allowed_origins = ["*"]
  cors_max_age_seconds = "3000"

  project     = var.project
  environment = var.environment
}

