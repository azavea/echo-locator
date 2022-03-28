provider "aws" {
  region  = var.aws_region
  version = "~> 3.0.0"
}

provider "template" {
  version = "~> 2.1.2"
}

terraform {
  backend "s3" {
    region  = "us-east-1"
    encrypt = "true"
  }
}

