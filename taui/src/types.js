// @flow

/**
 * Map data
 */
export type Coordinate = [number, number]
export type Coordinates = Coordinate[]

export type LatLng = {
  lat: number,
  lng: number
}

export type LonLat = {lat: number, lon: number}
export type Point = {x: number, y: number}

export type Location = {
  label: string,
  position: LonLat
}

export type PartialLocation = {
  label: string | void,
  position: LonLat | void
}

export type Grid = {
  contains: (number, number) => boolean,
  data: Int32Array,
  height: number,
  north: number,
  valueAtPoint: (number, number) => number,
  west: number,
  width: number,
  zoom: number
}

export type Query = {
  height: number,
  north: number,
  west: number,
  width: number,
  zoom: number
}

/**
 * Voucher holder account profile
 */

export type AccountAddress = {
  location: Location,
  primary: boolean,
  purpose: string
}

export type AccountProfile = {
  destinations: Array<AccountAddress>,
  favorites: Array<string>,
  hasVehicle: boolean,
  headOfHousehod: string,
  key: string,
  rooms: number,
  voucherNumber: string
}

/**
 * Neighborhood GeoJSON properties.
 * Should correspond to the column definitions in generate_neighborhood_json.py.
 */

export type NeighborhoodProperties = {
  education_percentile: number,
  education_percentile_quintile: number,
  has_t_stop: boolean,
  id: string, // same as zipcode; unique
  near_park: number,
  near_railstation: number,
  near_t_stop: number,
  overall_affordability_quintile: number, // rental affordability
  percentage_college_graduates: number,
  town: string, // the label
  violentcrime_quintile: number,
  zipcode: string,
  zipcode_population: number
}

/**
 * Path data
 */

export type Leg = [string, string, string] // boardStopId, patternId, alightStopId
export type Path = Leg[]

export type PathsData = {
  paths: Path[],
  targets: number[] // path index
}

export type TransitiveStop = {
  geometry: string,
  stopIndex: number,
  stop_id: string,
  stop_lat: number,
  stop_lon: number
}

export type TransitivePattern = {
  pattern_id: string,
  patterns?: TransitivePattern[],
  route_id: string,
  stops: TransitiveStop[]
}

export type TransitiveRoute = {
  route_id: string,
  route_short_name: string
}

export type TransitiveData = {
  patterns: TransitivePattern[],
  routes: TransitiveRoute[],
  stops: TransitiveStop[]
}

export type QualifiedLeg = [TransitiveStop, TransitivePattern, TransitiveStop] // [boardStopId, Pattern, alightStopId]
export type QualifiedPath = QualifiedLeg[]

/**
 * GeoJSON
 */
export type GeometryType =
  | 'Point'
  | 'LineString'
  | 'Polygon'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'MultiPolygon'

export type Feature = {
  geometry: {
    coordinates: Coordinate | Coordinates,
    type: GeometryType
  },
  key: string,
  properties: any,
  type: 'Feature'
}

export type PointFeature = {
  geometry: {
    coordinates: Coordinate,
    type: 'Point'
  },
  properties: any,
  type: 'Feature'
}

export type MapboxFeature = {
  id: string,
  place_name: string
} & PointFeature

/**
 * Store
 */
export type LogItem = {
  createdAt: Date,
  level?: string,
  text: string
}

export type LogItems = LogItem[]

export type Accessibility =
  | 'accessibility-is-empty'
  | 'accessibility-is-loading'
  | {
      [key: string]: number
    }

export type Option = {
  label: string,
  value: string
}

export type GeocoderBoundary = {
  country: string,
  rect: {
    maxLat: number,
    maxLon: number,
    minLat: number,
    minLon: number
  }
}

export type PointsOfInterest = Array<{
  feature: PointFeature,
  label: string,
  value: Coordinate
}>

export type GeocoderStore = {
  boundary: void | GeocoderBoundary,
  end: void | Location,
  focusLatlng: void | LatLng,
  pointsOfInterest: void | PointsOfInterest,
  start: void | Location
}

export type MapStore = {
  centerCoordinates: string,
  zoom: number
}

export type NetworkStore = any

export type UIStore = {
  fetches: number,
  showLog: boolean
}

export type Store = {
  actionLog: LogItems,
  geocoder: GeocoderStore,
  map: MapStore,
  network: NetworkStore,
  timeCutoff: {
    selected: number
  },
  ui: UIStore
}

export type InputEvent = Event & {
  currentTarget: HTMLInputElement
}

export type MapEvent = {
  latlng?: Coordinate,
  target: {
    _latlng: Coordinate,
    _zoom: number
  }
}
