resource "aws_acm_certificate" "cert" {
  domain_name               = var.r53_public_hosted_zone
  subject_alternative_names = ["*.${var.r53_public_hosted_zone}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}
