provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project
    }
  }
}

terraform {
  backend "s3" {
    region  = "us-east-1"
    encrypt = "true"
  }
}
