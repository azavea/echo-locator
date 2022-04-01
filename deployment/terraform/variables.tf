locals {
  short = lower("${var.project}${var.environment}")
}

variable "project" {
  default = "ECHOLocator"
}

variable "environment" {
  default = "Staging"
}

variable "aws_region" {
  default = "us-east-1"
}

variable "r53_public_hosted_zone_name" {
    type = string
}

// RDS Database
variable "rds_allocated_storage" {
  default = 32
  type    = number
}

variable "rds_engine_version" {
  default = 13
  type    = number
}

variable "rds_instance_class" {
  default = "db.t3.micro"
  type    = string
}

variable "rds_storage_type" {
  default = "gp2"
  type    = string
}

variable "rds_database_password" {
  default = "testing123"
  type = string
}

variable "rds_backup_retention_period" {
  default = 20
  type    = number
}

variable "rds_backup_window" {
  default = "04:00-04:30"
  type    = string
}

variable "rds_maintenance_window" {
  default = "sun:04:30-sun:05:30"
  type    = string
}

variable "cidr_block" {
  default = "10.0.0.0/16"
  type    = string
}

variable "private_subnet_cidr_blocks" {
  default = ["10.0.1.0/24", "10.0.3.0/24"]
  type    = list(string)
}

variable "public_subnet_cidr_blocks" {
  default = ["10.0.0.0/24", "10.0.2.0/24"]
  type    = list(string)
}


variable "image_tag" {
  default = "latest"
  type = string
}

variable "fargate_platform_version" {
  default = "LATEST"
  type    = string
}

variable "fargate_app_desired_count" {
  default = 1
  type    = number
}

variable "fargate_app_deployment_min_percent" {
  default = 100
  type    = number
}

variable "fargate_app_deployment_max_percent" {
  default = 200
  type    = number
}

variable "fargate_app_cpu" {
  default = 256
  type = number
}

variable "fargate_app_memory" {
  default = 1024
  type = number
}

variable "django_log_level" {
  default = "WARNING"
  type = string
}


variable "aws_ecs_task_execution_role_policy_arn" {
  default = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  type    = string
}

variable "aws_cloudfront_canonical_user_id" {
  default = "c4c1ede66af53448b93c283ce9448c4ba468c9432aa01d700d3878632f77d2d0"
  type    = string
}