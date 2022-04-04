# Deployment

- [AWS Credentials](#aws-credentials)
- [Publish Container Images](#publish-container-images)
- [Terraform](#terraform)
- [Bastion](#bastion)
  - [PostgreSQL Client](#postgresql-client)

## AWS Credentials

```bash
$ aws configure --profile echo-locator
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]:
```

You will be prompted to enter your AWS credentials, along with a default region. These credentials will be used to authenticate calls to the AWS API when using Terraform and the AWS CLI.

## Publish Container Images

Before we can deploy this project's core infrastructure, we will need to build a container image and publish it somewhere accessible to Amazon's services.

AWS Elastic Container Registry (ECR) is a good candidate because ECR authentication with AWS Elastic Container Service (ECS) is handled transparently.

To do this, we can use the `cibuild` and `cipublish` scripts:

```bash
$ ./scripts/cibuild
...
Successfully built cc2b35ef78c4
Successfully tagged echolocator:latest
export AWS_PROFILE=echo-locator
$ ./scripts/cipublish
...
```

It defaults to push to export ECHOLOCATOR_ENVIRONMENT="stgdjango".


## Terraform

First, we need to make sure there is a `terraform.tfvars` file in the project settings bucket on S3. The `.tfvars` file is where we can change specific attributes of the project's infrastructure, not defined in the `variables.tf` file.

Here is an example `terraform.tfvars` for this project:

```hcl
project     = "echo"
environment = "stgdjango"
aws_region  = "us-east-1"

aws_key_name = "echo-stg"

r53_private_hosted_zone = "echo.internal"

external_access_cidr_block = "127.0.0.1/32"

bastion_ami           = "ami-0a887e401f7654935"
bastion_instance_type = "t3.nano"
bastion_ebs_optimized = true

rds_database_identifier = stgdjango
rds_database_name       = echo
rds_database_username   = echo
rds_database_password   = echo
```

This file lives at `s3://echo-locator-staging-django-config-us-east-1`.

To deploy this project's core infrastructure, use the `infra` wrapper script to lookup the remote state of the infrastructure and assemble a plan for work to be done:

```bash
$ docker-compose -f docker-compose.ci.yml run --rm terraform
$ export ECHOLOCATOR_SETTINGS_BUCKET=echo-locator-stgdjango-config-us-east-1
$ ./scripts/infra plan
```

Once the plan has been assembled, and you agree with the changes, apply it:

```bash
$ ./scripts/infra apply
```

This will attempt to apply the plan assembled in the previous step using Amazon's APIs.