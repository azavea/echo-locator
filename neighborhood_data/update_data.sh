#!/bin/bash
# Run the scripts in this directory to regenerate data and copy it into the app.
set -e

pip install -r requirements.txt
python add_non_ecc.py
python add_zcta_centroids.py
python fetch_images.py
python generate_neighborhood_json.py

cp neighborhoods.json neighborhood_bounds.json ../taui/

mkdir -p ../taui/assets/neighborhoods/
cp images/* ../taui/assets/neighborhoods/

echo 'All done updating app data! Use scripts/imagepublish to publish the downloaded images.'
