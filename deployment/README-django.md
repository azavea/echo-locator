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

## Env File

A .env file should exist at the root of the source directory.  That must be filled in with mapbox details before running cibuild so that the Django container can access external resources.  The bootstrap script tries to get the correct .env for your environment from S3 but otherwise the .env file in S3 is not used.

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

It defaults to push to export ECHOLOCATOR_ENVIRONMENT="stgdjango".  For production `export ECHOLOCATOR_ENVIRONMENT=prddjango` before cipublish.

## Terraform

### New Environment

First, we need to make sure there is a `terraform.tfvars` file in the project settings bucket on S3. The `.tfvars` file is where we can change specific attributes of the project's infrastructure, not defined in the `variables.tf` file.

Here is an example `terraform.tfvars` for this project:

```hcl
project     = "echo"
environment = "prddjango"
aws_region  = "us-east-1"

r53_private_hosted_zone = "echo.internal"
r53_public_hosted_zone  = "app.echosearch.org"

rds_database_identifier = "echo-prddjango"
rds_database_name       = "echo"
rds_database_username   = "echo"
rds_database_password   =

fargate_app_cpu        = 1024
fargate_app_memory     = 2048
fargate_app_cli_cpu    = 256
fargate_app_cli_memory = 1024

rollbar_access_token =
django_secret_key =

default_from_email = "noreply@app.echosearch.org"
aws_s3_photo_bucket="echo-locator-production-site-us-east-1"
```

There are a few manual steps for a brand new environment
 * Make NS Record with values from sub.domain.org in domain.org.
 * Manually Verify AWS Generated Cert by DNS method.

### Current Environment

The following are possible ECHOLOCATOR_SETTINGS_BUCKET values:
```
export ECHOLOCATOR_SETTINGS_BUCKET=echo-locator-stgdjango-config-us-east-1  # Staging
export ECHOLOCATOR_SETTINGS_BUCKET=echo-locator-prddjango-config-us-east-1  # Production
```

To deploy this project's core infrastructure, use the `infra` wrapper script to lookup the remote state of the infrastructure and assemble a plan for work to be done:

```bash
$ docker-compose -f docker-compose.ci.yml run --rm terraform
$ export ECHOLOCATOR_SETTINGS_BUCKET line from above.
$ ./scripts/infra plan
```

Once the plan has been assembled, and you agree with the changes, apply it:

```bash
$ ./scripts/infra apply
```

This will attempt to apply the plan assembled in the previous step using Amazon's APIs.

## Migrations

### Staging

1. Ensure you are setup with AWS CLI credentials and have the correct profile set with `export AWS_PROFILE=echo-locator `
2. Install the [Session Manager plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) for the AWS CLI.
3. Use the following commands to get the cluster name/task id or use the AWS console to select the most recent running task for the ECS [django staging cluster](https://us-east-1.console.aws.amazon.com/ecs/home?region=us-east-1#/clusters/ecsechostgdjangoCluster/tasks))

```bash
$ aws ecs list-clusters
...
......cluster/ecsechostgdjangoCluster
...
$ aws ecs list-tasks  --cluster ecsechostgdjangoCluster
...
......task/ecsechostgdjangoCluster/523612e9652b40dfae4e91e6e157c17b
...
```

4. Run the following command:

```bash
$ aws ecs execute-command --cluster <name-of-django-staging-cluster> --task <current-task-id> --container django --command "/bin/bash" --interactive
```

5. You should see something similar to the following to initiate the start of a session:

```
The Session Manager plugin was installed successfully. Use the AWS CLI to start a session.


Starting session with SessionId: ecs-execute-command-08e2295045096200d
root@ip-10-0-3-195:/usr/local/src/backend#
```

6. Run `python manage.py showmigrations`
7. Confirm migrations are up to date.
8. Run `python manage.py migrate`
9. Run `exit` to exit the session.
10. Monitor the log output of the current task and confirm staging functions as expected.
