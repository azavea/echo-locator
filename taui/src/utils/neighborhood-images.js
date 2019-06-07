// @flow
import message from '@conveyal/woonerf/message'
import find from 'lodash/find'

import {IMAGE_FIELDS} from '../constants'
import type {NeighborhoodImageMetadata, NeighborhoodProperties} from '../types'

// Returns metadata for the first image field found that is available, or null if there are none
export function getFirstNeighborhoodImage (properties: NeighborhoodProperties): NeighborhoodImageMetadata {
  if (!properties) {
    return null
  }
  // Look for an available image to use as the summary
  const imageField = find(IMAGE_FIELDS, field => {
    return !!properties[field + '_thumbnail']
  })
  return getNeighborhoodImage(properties, imageField)
}

// Returns metadata for a given image field, or null if unavailable
export default function getNeighborhoodImage (properties: NeighborhoodProperties,
  imageField: string): NeighborhoodImageMetadata {
  if (!imageField) {
    return null
  }
  if (!IMAGE_FIELDS.includes(imageField)) {
    console.error(imageField + ' is not a neighborhood image field')
    return null
  }
  // All images that have the thumbnail hotlink field set should exist as files in assets
  if (!properties || !properties[imageField + '_thumbnail']) {
    return null
  }

  const description = properties[imageField + '_description']
  const license = properties[imageField + '_license']
  const licenseUrl = properties[imageField + '_license_url']
  const imageLink = properties[imageField]
  // Get the extension for the image from the link
  const ext = imageLink.toLowerCase().split('.').pop()
  const thumbnail = 'assets/neighborhoods/' + properties['id'] + '_' + imageField + '.' + ext
  const userName = properties[imageField + '_username']

  let attribution = userName + ' [' + license
  if (licenseUrl) {
    attribution += ' (' + licenseUrl + ')'
  }
  attribution += '], ' + message('NeighborhoodDetails.WikipediaAttribution')

  const image: NeighborhoodImageMetadata = {
    attribution,
    description,
    imageLink,
    license,
    licenseUrl,
    thumbnail,
    userName
  }
  return image
}
