// @flow
// Returns a link to Google Directions.
// https://developers.google.com/maps/documentation/urls/guide#directions-action
const GOOGLE_DIRECTIONS_BASE_URL = 'https://www.google.com/maps/dir/?api=1'
export default function getGoogleDirectionsLink (origin, destination, isDriving) {
  const travelmode = isDriving ? 'driving' : 'transit'
  return GOOGLE_DIRECTIONS_BASE_URL +
    ('&travelmode=' + encodeURIComponent(travelmode)) +
    (origin ? '&origin=' + origin : '') +
    (destination ? '&destination=' + destination : '')
}
