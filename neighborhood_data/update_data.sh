#!/bin/bash
# Run the scripts in this directory to regenerate data and copy it into the app.
set -e

pip3 install -r requirements.txt
python3 add_zcta_centroids.py
python3 fetch_images.py
python3 generate_neighborhood_json.py

# optimize downloaded images
optimize-images ./images/

cp neighborhoods.json neighborhood_bounds.json ../src/frontend/src/data/

mkdir -p ../src/frontend/public/neighborhoods/
cp images/* ../src/frontend/public/neighborhoods/

echo 'All done updating app data! Use scripts/imagepublish to publish the downloaded images.'
