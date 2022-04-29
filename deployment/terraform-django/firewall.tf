#
# App ALB security group resources
#
resource "aws_security_group_rule" "alb_http_ingress" {
  type             = "ingress"
  from_port        = 80
  to_port          = 80
  protocol         = "tcp"
  cidr_blocks      = ["0.0.0.0/0"]
  ipv6_cidr_blocks = ["::/0"]

  security_group_id = aws_security_group.alb.id
}

resource "aws_security_group_rule" "alb_https_ingress" {
  type             = "ingress"
  from_port        = 443
  to_port          = 443
  protocol         = "tcp"
  cidr_blocks      = ["0.0.0.0/0"]
  ipv6_cidr_blocks = ["::/0"]

  security_group_id = aws_security_group.alb.id
}

resource "aws_security_group_rule" "alb_ecs_egress" {
  type      = "egress"
  from_port = local.django_container_port
  to_port   = local.django_container_port
  protocol  = "tcp"

  security_group_id        = aws_security_group.alb.id
  source_security_group_id = aws_security_group.app.id
}

#
# RDS security group resources
#
resource "aws_security_group_rule" "rds_ecs_ingress" {
  type      = "ingress"
  from_port = aws_db_instance.postgresql.port
  to_port   = aws_db_instance.postgresql.port
  protocol  = "tcp"

  security_group_id        = aws_security_group.postgresql.id
  source_security_group_id = aws_security_group.app.id
}

#
# ECS security group resources
#
resource "aws_security_group_rule" "ecs_https_egress" {
  type        = "egress"
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]

  security_group_id = aws_security_group.app.id
}

resource "aws_security_group_rule" "ecs_rds_egress" {
  type      = "egress"
  from_port = aws_db_instance.postgresql.port
  to_port   = aws_db_instance.postgresql.port
  protocol  = "tcp"

  security_group_id        = aws_security_group.app.id
  source_security_group_id = aws_security_group.postgresql.id
}

resource "aws_security_group_rule" "ecs_alb_ingress" {
  type      = "ingress"
  from_port = local.django_container_port
  to_port   = local.django_container_port
  protocol  = "tcp"

  security_group_id        = aws_security_group.app.id
  source_security_group_id = aws_security_group.alb.id
}
