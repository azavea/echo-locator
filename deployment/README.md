# Deployment

* [AWS Credentials](#aws-credentials)
* [Terraform](#terraform)
* [Taui](#taui)

## AWS Credentials

Using the AWS CLI, create an AWS profile named `echo-locator`:

```bash
$ vagrant ssh
vagrant@vagrant-ubuntu-trusty-64:~$ aws --profile echo-locator configure
AWS Access Key ID [****************F2DQ]:
AWS Secret Access Key [****************TLJ/]:
Default region name [us-east-1]: us-east-1
Default output format [None]:
```

You will be prompted to enter your AWS credentials, along with a default region. These credentials will be used to authenticate calls to the AWS API when using Terraform and the AWS CLI.

## Terraform

To deploy this project's core infrastructure, use the `infra` wrapper script to lookup the remote state of the infrastructure and assemble a plan for work to be done:

```bash
vagrant@vagrant-ubuntu-trusty-64:~$ export ECHOLOCATOR_SETTINGS_BUCKET="echo-locator-staging-config-us-east-1"
vagrant@vagrant-ubuntu-trusty-64:~$ export AWS_PROFILE="echo-locator"
vagrant@vagrant-ubuntu-trusty-64:~$ docker-compose -f docker-compose.ci.yml run --rm terraform ./scripts/infra plan
```

Once the plan has been assembled, and you agree with the changes, apply it:

```bash
vagrant@vagrant-ubuntu-trusty-64:~$ docker-compose -f docker-compose.ci.yml run --rm terraform ./scripts/infra apply
```

This will attempt to apply the plan assembled in the previous step using Amazon's APIs. In order to change specific attributes of the infrastructure, inspect the contents of the environment's configuration file in Amazon S3.

## Taui

The Taui frontend is deployed separately from core Terraform infrastructure, but
it relies on S3 and CloudFront resources to have already been deployed by Terraform.
If you're trying to wire up a new instance of Taui, or if you've created a 
new S3 bucket or CloudFront distribution that you want to use for the app,
you'll need to point Taui to your new resources.

After Terraform creates a new S3 bucket or CloudFront distribution, it should
output the IDs of both resources. Take these IDs and put them in the
`settings.yml` file that corresponds to the relevant environment. For example,
if you're deploying a staging instance of Taui, edit
`taui/configurations/staging/settings.yml` and update the `cloudfront` and
`s3bucket` properties to point to your new resources.
