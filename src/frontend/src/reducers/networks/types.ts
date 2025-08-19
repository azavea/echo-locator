export type NetworkModeOptions =
    | "peak"
    | "off-peak"
    | "peak-no-express"
    | "off-peak-no-express"
    | "car";

interface TravelTimeSurface {
    data: Int32Array<ArrayBuffer>;
    depth: number;
    height: number;
    north: number;
    version: number;
    west: number;
    width: number;
    zoom: number;
}

export type originPoint = { lon: number; lat: number };

/**
 * Path data
 */
export type LonLat = { lat: number; lon: number };

export type Location = {
    label: string;
    position: LonLat;
};

export type Leg = [string, string, string]; // boardStopId, patternId, alightStopId
export type Path = Leg[];

export type PathsData = {
    paths: Path[];
    targets: Int32Array<ArrayBuffer>; // path index
};

export type TransitiveStop = {
    geometry: string;
    stopIndex: number;
    stop_id: string;
    stop_lat: number;
    stop_lon: number;
};

export type TransitivePattern = {
    pattern_id: string;
    patterns?: TransitivePattern[];
    route_id: string;
    stops: TransitiveStop[];
};

export type TransitiveRoute = {
    route_id: string;
    route_short_name: string;
    route_color?: string;
    route_type?: number;
};

export type TransitiveData = {
    patterns: TransitivePattern[];
    routes: TransitiveRoute[];
    stops: TransitiveStop[];
};

export type QualifiedLeg = [TransitiveStop, TransitivePattern, TransitiveStop]; // [boardStopId, Pattern, alightStopId]
export type QualifiedPath = QualifiedLeg[];

export interface RouteSegment {
    name?: string;
    backgroundColor?: string;
    color?: string;
    type?: string;
}

export interface JourneySegmentLocation {
    type: string;
    place_id?: string;
    stop_id?: string;
}

export interface JourneySegment {
    type: string;
    from: JourneySegmentLocation;
    to: JourneySegmentLocation;
    pattern_id?: string;
    from_stop_index?: number;
    to_stop_index?: number;
}

export interface Journey {
    journey_id: number;
    journey_name: number;
    segments: JourneySegment[];
}
/**
 * End of path data types
 */

export interface ParsedPathsData extends Partial<PathsData> {
    pathsPerTarget?: number;
}

export interface RoutableParsedPathsData extends PathsData {
    pathsPerTarget: number;
}

export interface TimesAndPathsData extends ParsedPathsData {
    name: NetworkModeOptions;
    travelTimeSurface?: TravelTimeSurface;
}

export type TimesAndPathsByNetwork = {
    [key in NetworkModeOptions]: TimesAndPathsData;
};

export interface Network extends TimesAndPathsData {
    ready: boolean;
    timesAndPathsDataReady: boolean;
    transitive: TransitiveData;
}

export interface RoutableNetwork extends RoutableParsedPathsData {
    name: NetworkModeOptions;
    travelTimeSurface: TravelTimeSurface;
    ready: boolean;
    timesAndPathsDataReady: boolean;
    transitive: TransitiveData;
}

export type Networks = {
    [key in NetworkModeOptions]: Network;
};

export interface NetworksSliceState {
    networks: Networks | null;
    origin: originPoint | null;
    activeMode: NetworkModeOptions;
    loading: boolean;
    error: string | null;
}


export interface NeighborhoodRoute extends TransitiveData {
    id: string;
    label: string;
    journeys: any[];
    places: any[];
    routeSegments: RouteSegment[][];
}

