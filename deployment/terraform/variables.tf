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