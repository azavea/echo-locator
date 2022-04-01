resource "aws_db_instance" "default" {
  allocated_storage            = var.rds_allocated_storage
  backup_window                = var.rds_backup_window
  backup_retention_period      = var.rds_backup_retention_period
  engine                       = "postgres"
  engine_version               = "13"
  identifier                   = lower("${var.project}-${var.environment}")
  name                         = lower("$var.project")
  username                     = lower("$var.project")
  password                     = var.rds_database_password
  skip_final_snapshot          = false
  performance_insights_enabled = true
  maintenance_window           = var.rds_maintenance_window
  instance_class           = var.rds_instance_class

  tags = {
    Project     = var.project
    Environment = var.environment
  }

}