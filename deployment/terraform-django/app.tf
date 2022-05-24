#
# Security group resources
#
resource "aws_security_group" "alb" {
  name   = "sg${local.short}AppLoadBalancer"
  vpc_id = aws_vpc.default.id

  tags = {
    Name        = "sg${local.short}AppLoadBalancer"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_security_group" "app" {
  name   = "sg${local.short}AppEcsService"
  vpc_id = aws_vpc.default.id

  tags = {
    Name        = "sg${local.short}AppEcsService",
    Project     = var.project
    Environment = var.environment
  }
}

#
# ALB Resources
#
resource "aws_lb" "app" {
  name            = "alb${local.short}App"
  security_groups = [aws_security_group.alb.id]
  subnets         = aws_subnet.public.*.id

  tags = {
    Name        = "alb${local.short}App"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_lb_target_group" "app" {
  name = "tg${local.short}App"
  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    matcher             = "200"
    protocol            = "HTTP"
    timeout             = "3"
    path                = "/health-check/"
    unhealthy_threshold = "2"
  }

  port     = "80"
  protocol = "HTTP"
  vpc_id   = aws_vpc.default.id

  target_type = "ip"

  tags = {
    Name        = "tg${local.short}App"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.app.id
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    target_group_arn = aws_lb_target_group.app.id
    type             = "forward"
  }
}

#
# ECS resources
#
resource "aws_ecs_cluster" "app" {
  name = "ecs${local.short}Cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

locals {
  django_container_name = "django"
  django_container_port = 8085
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${local.short}App"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_app_cpu
  memory                   = var.fargate_app_memory

  task_role_arn      = aws_iam_role.ecs_task_role.arn
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = templatefile("${path.module}/task-definitions/app.json.tmpl", {
    name  = local.django_container_name
    image = "${aws_ecr_repository.default.repository_url}:${var.image_tag}"

    postgres_host     = aws_route53_record.database.fqdn
    postgres_port     = aws_db_instance.postgresql.port
    postgres_user     = var.rds_database_username
    postgres_password = var.rds_database_password
    postgres_db       = var.rds_database_name

    # See: https://docs.gunicorn.org/en/stable/design.html#how-many-workers
    gunicorn_workers = ceil((2 * (var.fargate_app_cpu / 1024)) + 1)

    django_secret_key      = var.django_secret_key
    default_from_email     = var.default_from_email
    django_log_level       = var.django_log_level
    r53_public_hosted_zone = var.r53_public_hosted_zone

    rollbar_access_token = var.rollbar_access_token

    port = local.django_container_port

    short       = local.short
    project     = var.project
    environment = var.environment
    aws_region  = var.aws_region
  })

  tags = {
    Name        = "${local.short}App",
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_ecs_service" "app" {
  name            = "${local.short}App"
  cluster         = aws_ecs_cluster.app.id
  task_definition = aws_ecs_task_definition.app.arn

  desired_count                      = var.fargate_app_desired_count
  deployment_minimum_healthy_percent = var.fargate_app_deployment_min_percent
  deployment_maximum_percent         = var.fargate_app_deployment_max_percent

  launch_type          = "FARGATE"
  platform_version     = var.fargate_platform_version
  enable_execute_command = true
  force_new_deployment = true

  network_configuration {
    security_groups = [aws_security_group.app.id]
    subnets         = aws_subnet.private.*.id
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = local.django_container_name
    container_port   = local.django_container_port
  }

  depends_on = [
    aws_lb_listener.app,
  ]
}

resource "aws_ecs_task_definition" "app_cli" {
  family                   = "${local.short}AppCLI"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_app_cli_cpu
  memory                   = var.fargate_app_cli_memory

  task_role_arn      = aws_iam_role.ecs_task_role.arn
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = templatefile("${path.module}/task-definitions/app_cli.json.tmpl", {
    name  = local.django_container_name
    image = "${aws_ecr_repository.default.repository_url}:${var.image_tag}"

    postgres_host     = aws_route53_record.database.fqdn
    postgres_port     = aws_db_instance.postgresql.port
    postgres_user     = var.rds_database_username
    postgres_password = var.rds_database_password
    postgres_db       = var.rds_database_name

    django_secret_key      = var.django_secret_key
    default_from_email     = var.default_from_email
    django_log_level       = var.django_log_level
    r53_public_hosted_zone = var.r53_public_hosted_zone

    rollbar_access_token = var.rollbar_access_token

    short       = local.short
    project     = var.project
    environment = var.environment
    aws_region  = var.aws_region
  })

  tags = {
    Name        = "${local.short}AppCLI",
    Project     = var.project
    Environment = var.environment
  }
}

#
# CloudWatch resources
#
resource "aws_cloudwatch_log_group" "app" {
  name              = "log${local.short}App"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "app_cli" {
  name              = "log${local.short}AppCLI"
  retention_in_days = 30
}
