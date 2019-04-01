// @flow
export const ACCESSIBILITY_IS_EMPTY = 'accessibility-is-empty'
export const ACCESSIBILITY_IS_LOADING = 'accessibility-is-loading'

export const ANONYMOUS_USERNAME = 'ANONYMOUS'

// Maximum number of destinations that may be added to a user profile
export const MAX_ADDRESSES = 3

// Number of neighborhood suggestions to show at a time
export const SIDEBAR_PAGE_SIZE = 3

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

export const NEIGHBORHOOD_NONROUTABLE_COLOR = '#85929E'
export const NEIGHBORHOOD_ROUTABLE_COLOR = '#15369d'

export const NEIGHBORHOOD_BOUNDS_STYLE = {
  stroke: false,
  fill: true,
  fillColor: '#15369d',
  fillOpacity: 0.1
}

export const NEIGHBORHOOD_STYLE = {
  color: '#333',
  opacity: 0.7,
  fill: false,
  fillColor: '#333',
  radius: 5,
  stroke: true,
  weight: 3
}

export const STOP_STYLE = {
  color: '#333',
  fill: true,
  fillColor: '#fff',
  radius: 3,
  weight: 2
}

// browser local storage keys
export const TAUI_CONFIG_KEY = 'taui-config'
export const PROFILE_CONFIG_KEY = 'echolocator-profile'

// react-select styles
export const SELECT_STYLE = {
  'height': '3.8rem'
}

export const SELECT_WRAPPER_STYLE = {
  'height': '4rem',
  'marginBottom': '0.8rem',
  'boxShadow': 'none',
  'border': '1px solid #bdbdbd'
}
