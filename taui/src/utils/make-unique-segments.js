// @flow
/* Return unique route segments, used for displaying segments
on map for listing and neighborhood routes
*/
const routeToString = s =>
  s.map(s => `${s.name}-${s.backgroundColor}-${s.type}`).join('-')

export default function uniqueSegments (routeSegments) {
  const foundKeys = {}
  return (routeSegments || []).reduce((uniqueRoutes, route) => {
    const key = routeToString(route)
    if (!foundKeys[key]) {
      foundKeys[key] = true
      return [...uniqueRoutes, route]
    }
    return uniqueRoutes
  }, [])
}
