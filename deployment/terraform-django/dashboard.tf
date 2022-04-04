#
# CloudWatch Dashboard resources
#
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "dash${local.short}"
  dashboard_body = templatefile("${path.module}/dashboards/main.json.tmpl", {
    lb_arn_suffix = aws_lb.app.arn_suffix

    db_instance_id = aws_db_instance.postgresql.id

    ecs_service_name = aws_ecs_service.app.name
    ecs_cluster_name = aws_ecs_cluster.app.name

    cdn_distribution_id = aws_cloudfront_distribution.cdn.id
  })
}
