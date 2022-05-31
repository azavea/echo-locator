#
# RDS resources
#
resource "aws_db_subnet_group" "default" {
  name        = var.rds_database_identifier
  description = "Private subnets for the RDS instances"
  subnet_ids  = aws_subnet.private.*.id

  tags = {
    Name        = "dbsngDatabaseServer"
  }
}

resource "aws_db_instance" "postgresql" {
  allocated_storage          = var.rds_allocated_storage
  engine_version             = var.rds_engine_version
  instance_class             = var.rds_instance_type
  storage_type               = var.rds_storage_type
  engine                     = "postgres"
  identifier                 = var.rds_database_identifier
  db_name                    = var.rds_database_name
  username                   = var.rds_database_username
  password                   = var.rds_database_password
  backup_retention_period    = var.rds_backup_retention_period
  backup_window              = var.rds_backup_window
  maintenance_window         = var.rds_maintenance_window
  auto_minor_version_upgrade = var.rds_auto_minor_version_upgrade
  final_snapshot_identifier  = var.rds_final_snapshot_identifier
  skip_final_snapshot        = var.rds_skip_final_snapshot
  copy_tags_to_snapshot      = var.rds_copy_tags_to_snapshot
  multi_az                   = var.rds_multi_az
  storage_encrypted          = var.rds_storage_encrypted
  vpc_security_group_ids     = [aws_security_group.postgresql.id]
  db_subnet_group_name       = aws_db_subnet_group.default.name
  deletion_protection        = var.rds_deletion_protection
}

#
# Security group resources
#
resource "aws_security_group" "postgresql" {
  vpc_id = aws_vpc.default.id

  tags = {
    Name        = "sgDatabaseServer",
  }
}


#
# CloudWatch resources
#
resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  alarm_name          = "alarm${var.environment}DatabaseServerCPUUtilization-${var.rds_database_identifier}"
  alarm_description   = "Database server CPU utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = var.rds_cpu_threshold_percent

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgresql.id
  }

  alarm_actions             = [aws_sns_topic.global.arn]
  ok_actions                = [aws_sns_topic.global.arn]
  insufficient_data_actions = [aws_sns_topic.global.arn]
}

resource "aws_cloudwatch_metric_alarm" "database_disk_queue" {
  alarm_name          = "alarm${var.environment}DatabaseServerDiskQueueDepth-${var.rds_database_identifier}"
  alarm_description   = "Database server disk queue depth"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "DiskQueueDepth"
  namespace           = "AWS/RDS"
  period              = "60"
  statistic           = "Average"
  threshold           = var.rds_disk_queue_threshold

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgresql.id
  }

  alarm_actions             = [aws_sns_topic.global.arn]
  ok_actions                = [aws_sns_topic.global.arn]
  insufficient_data_actions = [aws_sns_topic.global.arn]
}

resource "aws_cloudwatch_metric_alarm" "database_disk_free" {
  alarm_name          = "alarm${var.environment}DatabaseServerFreeStorageSpace-${var.rds_database_identifier}"
  alarm_description   = "Database server free storage space"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "60"
  statistic           = "Average"
  threshold           = var.rds_free_disk_threshold_bytes

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgresql.id
  }

  alarm_actions             = [aws_sns_topic.global.arn]
  ok_actions                = [aws_sns_topic.global.arn]
  insufficient_data_actions = [aws_sns_topic.global.arn]
}

resource "aws_cloudwatch_metric_alarm" "database_memory_free" {
  alarm_name          = "alarm${var.environment}DatabaseServerFreeableMemory-${var.rds_database_identifier}"
  alarm_description   = "Database server freeable memory"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FreeableMemory"
  namespace           = "AWS/RDS"
  period              = "60"
  statistic           = "Average"
  threshold           = var.rds_free_memory_threshold_bytes

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgresql.id
  }

  alarm_actions             = [aws_sns_topic.global.arn]
  ok_actions                = [aws_sns_topic.global.arn]
  insufficient_data_actions = [aws_sns_topic.global.arn]
}

resource "aws_cloudwatch_metric_alarm" "database_cpu_credits" {
  // This results in 1 if instance_type starts with "db.t", 0 otherwise.
  count = substr(var.rds_instance_type, 0, 3) == "db.t" ? 1 : 0

  alarm_name          = "alarm${var.environment}DatabaseCPUCreditBalance-${var.rds_database_identifier}"
  alarm_description   = "Database CPU credit balance"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "CPUCreditBalance"
  namespace           = "AWS/RDS"
  period              = "60"
  statistic           = "Average"
  threshold           = var.rds_cpu_credit_balance_threshold

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgresql.id
  }

  alarm_actions             = [aws_sns_topic.global.arn]
  ok_actions                = [aws_sns_topic.global.arn]
  insufficient_data_actions = [aws_sns_topic.global.arn]
}