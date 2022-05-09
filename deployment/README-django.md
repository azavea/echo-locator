# Deployment

- [AWS Credentials](#aws-credentials)
- [Publish Container Images](#publish-container-images)
- [Terraform](#terraform)
- [Migrations](#migrations)

## AWS Credentials

```bash
$ aws configure --profile echo-locator
AWS Access Key ID [None]: <your aws key>
AWS Secret Access Key [None]: <your aws secret>
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
$ export AWS_PROFILE=echo-locator
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

## Migrations

### Staging

1. Ensure you are setup with AWS CLI credentials.
2. Install the [Session Manager plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) for the AWS CLI.
3. Run the following command (the task ID can be found by logging into the AWS console and selecting the most recent running task for the ECS [django staging cluster](https://us-east-1.console.aws.amazon.com/ecs/home?region=us-east-1#/clusters/ecsechostgdjangoCluster/tasks)):
```bash
$ aws ecs execute-command --region us-east-1 --cluster <name-of-django-staging-cluster> --task <current-task-id> --container django --command "/bin/bash" --interactive
```
4. You should see something similar to the following to initiate the start of a session:
```
The Session Manager plugin was installed successfully. Use the AWS CLI to start a session.


Starting session with SessionId: ecs-execute-command-08e2295045096200d
root@ip-10-0-3-195:/usr/local/src/backend#
```
5. Run `python manage.py showmigrations`
6. Confirm migrations are up to date.
7. Run `python manage.py migrate`
8. Run `exit` to exit the session.
9. Monitor the log output of the current task and confirm staging functions as expected.
