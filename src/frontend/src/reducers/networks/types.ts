import type { NetworkModeOptionKey, PlaceKey } from "src/enums";

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

/**
 * Route data types from old codebase
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
    stop_name: string;
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
/**
 * End of old types
 */

export interface PopulatedPath {
    fromStop: TransitiveStop;
    pattern: TransitivePattern;
    route: TransitiveRoute;
    toStop: TransitiveStop;
}

export interface NeighborhoodTransitStop {
    coordinates: number[];
    name: string;
    stopId: string;
}

export interface NeighborhoodRouteLeg {
    mode: string;
    coordinates: number[][];
    fromStop?: NeighborhoodTransitStop;
    name?: string;
    patternId?: string;
    routeColor?: string;
    routeId?: string;
    toStop?: NeighborhoodTransitStop;
}

export type NeighborhoodRoutePath = NeighborhoodRouteLeg[];

// Includes primary and alternative routes for a neighborhood
export type NeighborhoodRoutePaths = NeighborhoodRoutePath[];

export interface NeighborhoodRoute {
    id: string;
    label: string;
    start: Location;
    end: Location;
    segments: NeighborhoodRoutePaths;
}

export type NeighborhoodRoutes = NeighborhoodRoute[];

export interface ParsedPathsData extends Partial<PathsData> {
    pathsPerTarget?: number;
}

export interface RoutableParsedPathsData extends PathsData {
    pathsPerTarget: number;
}

export interface TimesAndPathsData {
    name: NetworkModeOptionKey;
    timesAndRoutesDataReady: boolean;
    routesByNeighborhood: NeighborhoodRoutes;
    travelTimesByNeighborhood: number[];
}

export type TimesAndPathsByNetwork = {
    [key in NetworkModeOptionKey]: TimesAndPathsData;
};

export type TimesAndPathsByPlace = {
    [key in PlaceKey]: TimesAndPathsByNetwork;
};

// Partial types for response from request.json
// Large response, so including as needed in frontend
type NetworkRequestJSONType = {
    ready: boolean;
    width: number;
    zoom: number;
    west: number;
    north: number;
};

export interface Network extends NetworkRequestJSONType {
    transitive: TransitiveData;
}

export interface NetworkAndTimeAndPathsData
    extends Network,
        RoutableParsedPathsData {
    name: NetworkModeOptionKey;
    travelTimeSurface: TravelTimeSurface;
}

export type Networks = {
    [key in NetworkModeOptionKey]: Network;
};

export interface NetworksSliceState {
    networks: Networks | null;
    timesAndRoutesData: TimesAndPathsByPlace | null;
    activeMode: NetworkModeOptionKey;
    loading: boolean;
    error: string | null;
}
