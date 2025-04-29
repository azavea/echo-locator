resource "aws_acm_certificate" "cert" {
  domain_name       = var.r53_public_hosted_zone
  validation_method = "DNS"
  key_algorithm     = "RSA_2048"

  lifecycle {
    create_before_destroy = true
  }
}
