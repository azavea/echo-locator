// @flow
export const ACCESSIBILITY_IS_EMPTY = 'accessibility-is-empty'
export const ACCESSIBILITY_IS_LOADING = 'accessibility-is-loading'

export const ANONYMOUS_USERNAME = 'ANONYMOUS'

// Maximum number of neighborhood suggestions to show
export const NEIGHBORHOOD_RESULTS_COUNT = 3

// Account profile destination types.
// Each of these should have a translatable string label in `messages.yml`,
// defined under `TripPurpose`.
export const DEFAULT_PROFILE_DESTINATION_TYPE = 'Work'
export const PROFILE_DESTINATION_TYPES = [
  'Work',
  'Daycare',
  'Other'
]

// URLS
export const MAPBOX_GEOCODING_URL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places'

// Network colors
export const NETWORK_COLORS = [
  '#2389c9', // conveyal blue
  '#c92336', // red
  '#c96323', // orange
  '#36c923', // green
  '#6323c9' // violet
]

export const COLORS_RGB = [
  [31, 137, 201],
  [201, 99, 35]
]

export const WALK_STYLE = {
  color: '#333',
  dashArray: '5, 5',
  lineCap: 'butt',
  lineMeter: 'miter',
  weight: 5
}

export const TRANSIT_STYLE = {
  color: 'green',
  weight: 5
}

export const STOP_STYLE = {
  color: '#333',
  fill: true,
  fillColor: '#fff',
  fillOpacity: 1,
  radius: 3,
  weight: 2
}

// browser local storage keys
export const TAUI_CONFIG_KEY = 'taui-config'
export const PROFILE_CONFIG_KEY = 'echolocator-profile'
