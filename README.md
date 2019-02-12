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

On your host machine you need to set up an `echolocator` profile for the AWS account using the following command:
```bash
$ aws configure --profile echolocator
```

Finally, use the `server` script to build container images, compile frontend assets,
and run a development server:

```
$ ./scripts/server
```

Navigate to http://localhost:9966 to view the development environment.

## Data

In the `nieghborhood_data` directory are data sources and management scripts.

The `neighborhoods.csv` file is the source file for data on the neighborhoods, organized by zip code. The `add_zcta_centroids.py` script downloads Census Zip Code Tabulation Area (ZCTA) data, looks up the zip codes from `neighborhoods.csv`, and writes two files. One is `neighborhood_centroids.csv`, which is the input file content with two new columns added for the coordiates of the matching ZCTA's centroid (approximate center). The other is `neighborhood_bounds.json`, a GeoJSON file of the bounds of the ZCTAs marked as ECC in `neighborhoods.csv`.

To run the script to get ZCTA centroids and bounds:

 - `cd neighborhood_data`
 - `pip install -r requirements.txt`
 - `./add_zcta_centroids.py`


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
