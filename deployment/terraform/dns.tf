resource "aws_route53_zone" "external" {
  name = var.r53_public_hosted_zone_name

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_route53_record" "site" {
  zone_id = aws_route53_zone.external.id
  name    = var.r53_public_hosted_zone_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "site_ipv6" {
  zone_id = aws_route53_zone.external.id
  name    = var.r53_public_hosted_zone_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}



# Switch to Django / RDS



#
# Private DNS resources
#

resource "aws_route53_zone" "internal" {
  name = local.short

  vpc {
    vpc_id     = aws_vpc.default.id
    vpc_region = var.aws_region
  }

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_route53_record" "database" {
  zone_id = aws_route53_zone.internal.zone_id
  name    = "database.service.${local.short}"
  type    = "CNAME"
  ttl     = "10"
  records = [aws_db_instance.default.address]
}


