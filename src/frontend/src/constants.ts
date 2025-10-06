import { Language, type NetworkModeOptionKey } from "./enums";

export const languageToLabel = {
    [Language.EN]: "English",
    [Language.ES]: "Español",
    [Language.ZH]: "中文",
};

export const networks: Record<NetworkModeOptionKey, any> = {
    peak: {
        label: "Peak",
        commuter: true,
    },
    offPeak: {
        label: "Off Peak",
        commuter: true,
    },
    peakNoExpress: {
        label: "Peak No Express",
        commuter: false,
    },
    offPeakNoExpress: {
        label: "Off Peak No Express",
        commuter: false,
    },
    car: {
        label: "Car",
        commuter: null,
    },
};

// Network colors
export const NETWORK_COLORS = [
    "#2389c9", // conveyal blue
    "#c92336", // red
    "#c96323", // orange
    "#36c923", // green
    "#6323c9", // violet
];

export const COLORS_RGB = [
    [31, 137, 201],
    [201, 99, 35],
];

export const WALK_STYLE = {
    color: "#555",
    dashArray: "12, 8",
    lineCap: "butt",
    lineMeter: "miter",
    weight: 4,
};

export const TRANSIT_STYLE = {
    color: "#555",
    weight: 4,
};

export const STOP_STYLE = {
    color: "#333",
    fill: true,
    fillColor: "#fff",
    radius: 3,
    weight: 2,
};

/*
 * Neighborhood scoring & sorting constants
 */
export const MAX_TRAVEL_TIME = 120;
// Account profile defaults for weight importance
export const MAX_IMPORTANCE = 4;
export const DEFAULT_ACCESSIBILITY_IMPORTANCE = 2;
export const DEFAULT_SCHOOLS_IMPORTANCE = 1;
export const DEFAULT_CRIME_IMPORTANCE = 1;

// Place in the top results for boosted downtown results
export const BOOST_DOWNTOWN_RESULT_PLACE = 3;
// Include at least one downtown result in this many of the top results
export const RESULTS_WITH_DOWNTOWN = 6;
// Value in `town_area` column of source data for grouping zip codes in Boston
export const BOSTON_TOWN_AREA = "Boston";
// `town-area`s considered to be downtown, for special boosting in results
export const DOWNTOWN_AREAS = [BOSTON_TOWN_AREA];

export const MIN_QUINTILE = 1;
export const MAX_QUINTILE = 5;

// default to worst, if unknown
export const DEFAULT_EDUCATION_QUINTILE = 5;
export const DEFAULT_CRIME_QUINTILE = 5;
// stored profile importance is offset by one from MAX_IMPORTANCE
export const PROFILE_MAX_IMPORTANCE = MAX_IMPORTANCE - 1;
/*
 */

export const LOCAL_STORAGE_TOKEN_KEY = "apiToken";
