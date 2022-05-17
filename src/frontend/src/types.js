// @flow

/**
 * Map data
 */
export type Coordinate = [number, number];
export type Coordinates = Coordinate[];

export type LatLng = {
  lat: number,
  lng: number,
};

export type LonLat = { lat: number, lon: number };
export type Point = { x: number, y: number };

export type Location = {
  label: string,
  position: LonLat,
};

export type PartialLocation = {
  label: string | void,
  position: LonLat | void,
};

export type Grid = {
  contains: (number, number) => boolean,
  data: Int32Array,
  height: number,
  north: number,
  valueAtPoint: (number, number) => number,
  west: number,
  width: number,
  zoom: number,
};

export type Query = {
  height: number,
  north: number,
  west: number,
  width: number,
  zoom: number,
};

/**
 * Voucher holder account profile
 */

export type AccountAddress = {
  location: Location,
  primary: boolean,
  purpose: string,
};

export type AccountProfile = {
  clientAccountConfirmed: boolean,
  clientEmail: string,
  clientInviteSent: boolean,
  destinations: Array<AccountAddress>,
  favorites: Array<string>,
  hasVehicle: boolean,
  hasVoucher: Boolean,
  headOfHousehold: string,
  hideNonECC: boolean,
  importanceAccessibility: number,
  importanceSchools: number,
  importanceViolentCrime: number,
  nonVoucherBudget: number,
  nonVoucherRooms: number,
  useCommuterRail: boolean,
  voucherNumber?: string,
  voucherRooms: number,
};

/**
 * Neighborhood GeoJSON properties.
 * See the column definitions in generate_neighborhood_json.py.
 */

export type NeighborhoodProperties = {
  crime_percentile: number,
  ecc: boolean,
  education_percentile: number,
  education_percentile_quintile: number,
  house_number_symbol: number,
  id: string, // same as zipcode; unique
  lat_lon_category: number,
  max_rent_0br: number,
  max_rent_1br: number,
  max_rent_2br: number,
  max_rent_3br: number,
  max_rent_4br: number,
  max_rent_5br: number,
  max_rent_6br: number,
  open_space_or_landmark: string,
  school: string,
  school_choice: boolean,
  street: string,
  total_mapc: number,
  town: string, // the label
  town_area: string, // zip code grouping (Boston, Cambridge, or blank)
  town_link: string,
  town_square: string,
  town_website_description: string,
  violentcrime_quintile: number,
  wikipedia: string,
  wikipedia_link: string,
  zipcode: string,
  zipcode_population: number,
  zviolentcrimeflip: number,
};

/**
 * Derived, formatted, user-presentable values for `NeighborhoodProperties`
 * calcualted in `utils/neighborhood-properties.js`.
 */
export type NeighborhoodLabels = {
  education: string,
  population: string,
  violentCrime: string,
};

/**
 * Neighborhood image metadata derived from `NeighborhoodProperties`
 */
export type NeighborhoodImageMetadata = {
  attribution: string,
  description: string,
  imageLink: string,
  license: string,
  licenseUrl: string,
  thumbnail: string,
  userName: string,
};

/**
 * Path data
 */

export type Leg = [string, string, string]; // boardStopId, patternId, alightStopId
export type Path = Leg[];

export type PathsData = {
  paths: Path[],
  targets: number[], // path index
};

export type TransitiveStop = {
  geometry: string,
  stop_id: string,
  stop_lat: number,
  stop_lon: number,
  stopIndex: number,
};

export type TransitivePattern = {
  pattern_id: string,
  patterns?: TransitivePattern[],
  route_id: string,
  stops: TransitiveStop[],
};

export type TransitiveRoute = {
  route_id: string,
  route_short_name: string,
};

export type TransitiveData = {
  patterns: TransitivePattern[],
  routes: TransitiveRoute[],
  stops: TransitiveStop[],
};

export type QualifiedLeg = [TransitiveStop, TransitivePattern, TransitiveStop]; // [boardStopId, Pattern, alightStopId]
export type QualifiedPath = QualifiedLeg[];

/**
 * GeoJSON
 */
export type GeometryType =
  | "Point"
  | "LineString"
  | "Polygon"
  | "MultiPoint"
  | "MultiLineString"
  | "MultiPolygon";

export type Feature = {
  geometry: {
    coordinates: Coordinate | Coordinates,
    type: GeometryType,
  },
  key: string,
  properties: any,
  type: "Feature",
};

export type PointFeature = {
  geometry: {
    coordinates: Coordinate,
    type: "Point",
  },
  properties: any,
  type: "Feature",
};

export type MapboxFeature = {
  id: string,
  place_name: string,
} & PointFeature;

/**
 * Store
 */
export type LogItem = {
  createdAt: Date,
  level?: string,
  text: string,
};

export type LogItems = LogItem[];

export type Accessibility =
  | "accessibility-is-empty"
  | "accessibility-is-loading"
  | {
      [key: string]: number,
    };

export type Option = {
  label: string,
  value: string,
};

export type GeocoderBoundary = {
  country: string,
  rect: {
    maxLat: number,
    maxLon: number,
    minLat: number,
    minLon: number,
  },
};

export type PointsOfInterest = Array<{
  feature: PointFeature,
  label: string,
  value: Coordinate,
}>;

export type GeocoderStore = {
  boundary: void | GeocoderBoundary,
  end: void | Location,
  focusLatlng: void | LatLng,
  pointsOfInterest: void | PointsOfInterest,
  start: void | Location,
};

export type MapStore = {
  centerCoordinates: string,
  zoom: number,
};

export type NetworkStore = any;

export type UIStore = {
  fetches: number,
  showLog: boolean,
};

export type Store = {
  actionLog: LogItems,
  geocoder: GeocoderStore,
  map: MapStore,
  network: NetworkStore,
  timeCutoff: {
    selected: number,
  },
  ui: UIStore,
};

export type InputEvent = Event & {
  currentTarget: HTMLInputElement,
};

export type MapEvent = {
  latlng?: Coordinate,
  target: {
    _latlng: Coordinate,
    _zoom: number,
  },
};

export type Listing = { pending: true } | { data: Array } | { error: String };

export type ListingQuery = { budget: Number, rooms: string | Number, zipcode: Number | string };

export type ActiveListing = {
  id: String,
  lat: Number,
  lon: Number,
  type: String,
} | null;

export type ActiveListingDetail = {
  id: String,
  lat: Number,
  lon: Number,
  segments: [],
  time: number,
  timeWeight: number,
} | null;

/**
 * Woonerf increment/decrement fetch action event
 */
export interface FetchState {
  allowChangeConfig: Boolean;
  fetches: Number;
  showLink: Boolean;
  showLog: Boolean;
}

export interface InnerPayload {
  id: Number;
  options: Object;
  type: "__FETCH__";
  url: String;
}

export interface IncrementPayload {
  payload: InnerPayload;
  type: "increment outstanding fetches";
}

export interface DecrementPayload {
  payload: InnerPayload;
  type: "decrement outstanding fetches";
}
