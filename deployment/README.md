# Deployment

* [AWS Credentials](#aws-credentials)
* [Terraform](#terraform)
* [Taui](#taui)
* [Amplify](#amplify)

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
$ export ECHOLOCATOR_SETTINGS_BUCKET="echo-locator-staging-config-us-east-1"
$ export AWS_PROFILE="echo-locator"
$ docker-compose -f docker-compose.yml -f docker-compose.ci.yml \
    run --rm terraform ./scripts/infra plan
```

Once the plan has been assembled, and you agree with the changes, apply it:

```bash
$ docker-compose -f docker-compose.yml -f docker-compose.ci.yml \
    run --rm terraform ./scripts/infra apply
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

Taui requires one secret configuration file, `env.yml`, to be stored in remote
state. CI will pull down this configuration file when it builds a bundle
for a given environment. When standing up a new stack, remember to create
an `env.yml` file based on the template in `taui/configurations/default/env.yml.tmp`
and push it up to the remote state bucket under the path `/taui/env.yml`.

## Amplify

User authentication resources are provisioned using the [AWS Amplify
CLI](https://aws-amplify.github.io/docs/cli/concept). We don't anticipate
that these resources will change frequently (if at all), but if you'd like
to update existing categories or add new categories to the stack, use the
following instructions.

Run a container with the Amplify CLI installed:

```
$ ./scripts/amplify-cli
```

You should see two environments, one for production and one for staging:

```
root@02d45a6c06c1:/usr/local/src# ls -a .
.  ..  Dockerfile  production  staging
```

Change into the directory corresponding to the environment you'd like to update
and run the relevant Amplify CLI command (such as `amplify add` to add a
new category, or `amplify push` to push any new changes you've made to the
CloudFormation stacks). For more information on the CLI workflow, see the
[Amplify CLI
documentation](https://aws-amplify.github.io/docs/cli/concept#typical-cli-workflow).

If you've updated the staging stack and you'd like to see your changes reflected
in local development, remember to move the Amplify configuration file into
the Taui source directory on your host machine. This is required in case you
add new resources or change the IDs of existing resources:

```
$ cp deployment/amplify/staging/aws-exports.js taui/src/aws-exports.js
```

(Note that CI will properly bundle the appropriate Amplify configuration file
during deployment depending on the environment.)
