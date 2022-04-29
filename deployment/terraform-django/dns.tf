#
# Private DNS resources
#
resource "aws_route53_zone" "internal" {
  name = var.r53_private_hosted_zone

  vpc {
    vpc_id     = module.vpc.id
    vpc_region = var.aws_region
  }

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_route53_record" "database" {
  zone_id = aws_route53_zone.internal.zone_id
  name    = "database.service.${var.r53_private_hosted_zone}"
  type    = "CNAME"
  ttl     = "10"
  records = [aws_db_instance.postgresql.address]
}

#
# Public DNS resources
#
resource "aws_route53_zone" "external" {
  name = var.r53_public_hosted_zone
}

resource "aws_route53_record" "bastion" {
  zone_id = aws_route53_zone.external.zone_id
  name    = "bastion.${var.r53_public_hosted_zone}"
  type    = "CNAME"
  ttl     = "300"
  records = [module.vpc.bastion_hostname]
}

resource "aws_route53_record" "site" {
  zone_id = aws_route53_zone.external.zone_id
  name    = var.r53_public_hosted_zone
  type    = "A"

  alias {
    name                   = aws_lb.app.dns_name
    zone_id                = aws_lb.app.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "ses_verification" {
  zone_id = aws_route53_zone.external.zone_id
  name    = "_amazonses.${var.r53_public_hosted_zone}"
  type    = "TXT"
  ttl     = "300"
  records = [aws_ses_domain_identity.app.verification_token]
}

resource "aws_route53_record" "ses_dkim" {
  count = 3

  zone_id = aws_route53_zone.external.zone_id
  name    = "${aws_ses_domain_dkim.app.dkim_tokens[count.index]}._domainkey.${var.r53_public_hosted_zone}"
  type    = "CNAME"
  ttl     = "300"
  records = ["${aws_ses_domain_dkim.app.dkim_tokens[count.index]}.dkim.amazonses.com"]
}
