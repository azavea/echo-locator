# ECHOLocator

Website to explore Choice Neighborhoods in the Boston area.

[![Build Status](https://travis-ci.com/azavea/echo-locator.svg?branch=develop)](https://travis-ci.com/azavea/echo-locator)

## Requirements

* Docker Engine 17.06+
* Docker Compose 1.6+

## Development

To start developing, create a set of Taui environment variables for development:

```
$ cp taui/configurations/default/env.yml.tmp taui/configurations/default/env.yml
```

Make sure to edit `env.yml` to set the appropriate secrets for development.

Finally, use the `server` script to build container images, compile frontend assets,
and run a development server:

```
$ ./scripts/server
```

Navigate to http://localhost:9966 to view the development environment.

## Testing

Run linters and tests with the `test` script:

```
$ ./scripts/test
```

## Deployment

CI will deploy frontend assets to staging on commits to the `develop` branch,
and will deploy to production on commits to the `master` branch.

For instructions on how to update core infrastructure, see the [README in the
deployment directory](./deployment/README.md).
