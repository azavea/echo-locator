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
