// @flow
import awsmobile from './aws-exports'

export const ACCESSIBILITY_IS_EMPTY = 'accessibility-is-empty'
export const ACCESSIBILITY_IS_LOADING = 'accessibility-is-loading'

export const ANONYMOUS_USERNAME = 'ANONYMOUS'

export const AMPLIFY_API_NAME = awsmobile['aws_cloud_logic_custom'][0].name

// https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
// eslint-disable-next-line no-useless-escape
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Neighborhood image fields
export const IMAGE_FIELDS = [
  'town_square',
  'open_space_or_landmark',
  'school',
  'street'
]

// Value in `town_area` column of source data for grouping zip codes in Boston
export const BOSTON_TOWN_AREA = 'Boston'

// `town-area`s considered to be downtown, for special boosting in results
export const DOWNTOWN_AREAS = [BOSTON_TOWN_AREA]
// Include at least one downtown result in this many of the top results
export const RESULTS_WITH_DOWNTOWN = 6
// Place in the top results for boosted downtown results
export const BOOST_DOWNTOWN_RESULT_PLACE = 6

export const BOSTON_SCHOOL_CHOICE_LINK = 'https://discover.bostonpublicschools.org/'
export const CAMBRIDGE_SCHOOL_CHOICE_LINK = 'https://www.cpsd.us/'

// Allow clicking links in tooltips by delaying hide/update
export const TOOLTIP_HIDE_DELAY_MS = 150

// Maximum number of destinations that may be added to a user profile
export const MAX_ADDRESSES = 3

// Round travel times to nearest five minutes
export const ROUND_TRIP_MINUTES = 5

// Maximum number of rooms for user profile
export const MAX_ROOMS = 6

// Number of neighborhood suggestions to show at a time
export const SIDEBAR_PAGE_SIZE = 3

// Cognito account UserAttribute for client voucher number
export const CUSTOM_VOUCHER_KEY = 'custom:voucher'

// Account profile destination types.
// Each of these should have a translatable string label in `messages.yml`,
// defined under `TripPurpose`.
export const DEFAULT_PROFILE_DESTINATION_TYPE = 'Work'
export const PROFILE_DESTINATION_TYPES = [
  'Work',
  'Daycare',
  'Family',
  'Friends',
  'Worship',
  'Doctor',
  'Other'
]

// Account profile defaults for weight importance
export const MAX_IMPORTANCE = 4
export const DEFAULT_ACCESSIBILITY_IMPORTANCE = 2
export const DEFAULT_SCHOOLS_IMPORTANCE = 1
export const DEFAULT_CRIME_IMPORTANCE = 1

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
  color: '#555',
  dashArray: '12, 8',
  lineCap: 'butt',
  lineMeter: 'miter',
  weight: 4
}

export const TRANSIT_STYLE = {
  color: '#555',
  weight: 4
}

export const NEIGHBORHOOD_NONROUTABLE_COLOR = '#85929e'
export const NEIGHBORHOOD_ROUTABLE_COLOR = '#15379d'
export const NEIGHBORHOOD_ACTIVE_COLOR = '#128d31'

export const NEIGHBORHOOD_ACTIVE_BOUNDS_STYLE = {
  stroke: true,
  weight: 3,
  color: NEIGHBORHOOD_ACTIVE_COLOR,
  opacity: 0.8,
  fill: true,
  fillColor: NEIGHBORHOOD_ACTIVE_COLOR,
  fillOpacity: 0.08
}

export const NEIGHBORHOOD_ROUTABLE_BOUNDS_STYLE = {
  stroke: true,
  weight: 1,
  color: NEIGHBORHOOD_ROUTABLE_COLOR,
  opacity: 0.08,
  fill: true,
  fillColor: NEIGHBORHOOD_ROUTABLE_COLOR,
  fillOpacity: 0.1
}

export const NEIGHBORHOOD_BOUNDS_STYLE = {
  stroke: true,
  weight: 1,
  color: '#fff',
  opacity: 0.1,
  fill: false,
  fillColor: NEIGHBORHOOD_NONROUTABLE_COLOR,
  fillOpacity: 0.1
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

export const SELECT_OPTION_HEIGHT = 38

export const SELECT_WRAPPER_STYLE = {
  'height': '4rem',
  'boxShadow': 'none',
  'border': '1px solid #bdbdbd'
}
