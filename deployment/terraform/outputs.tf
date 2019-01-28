output "cdn_id" {
  value = "${aws_cloudfront_distribution.cdn.id}"
}

output "s3_bucket" {
  value = "echo-locator-${lower(var.environment)}-site-${var.aws_region}"
}
