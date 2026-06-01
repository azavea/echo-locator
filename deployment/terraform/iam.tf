#
# ECS IAM resources
#
data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole",
    ]
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs${local.short}TaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

resource "aws_iam_role" "ecs_task_role" {
  name                = "ecs${local.short}TaskRole"
  assume_role_policy  = data.aws_iam_policy_document.ecs_assume_role.json
  managed_policy_arns = [aws_iam_policy.enable_execute_into.arn, "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"]
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = var.aws_ecs_task_execution_role_policy_arn
}

data "aws_iam_policy_document" "scoped_email_sending" {
  statement {
    effect = "Allow"

    actions = ["ses:SendEmail", "ses:SendRawEmail"]

    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "scoped_email_sending" {
  name   = "ses${var.environment}ScopedEmailSendingPolicy"
  role   = aws_iam_role.ecs_task_role.name
  policy = data.aws_iam_policy_document.scoped_email_sending.json
}

resource "aws_iam_policy" "enable_execute_into" {
  name = "ses${var.environment}EnableExecuteInto"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ],
        Resource = "*"
      },
    ]
  })

}
