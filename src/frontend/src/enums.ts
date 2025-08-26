export const Language = {
    EN: "en",
    ES: "es",
    ZH: "zh",
};

export type LanguageKey = (typeof Language)[keyof typeof Language];

export const Place = {
    Work: "Work",
    School: "School",
    Daycare: "Daycare",
    FriendsFamily: "Friends/Family",
    Doctor: "Doctor",
    Other: "Other",
};

export type PlaceKey = (typeof Place)[keyof typeof Place];

const NetworkModeOptionKeys = {
    peak: "peak",
    offPeak: "offPeak",
    peakNoExpress: "peakNoExpress",
    offPeakNoExpress: "offPeakNoExpress",
    car: "car",
} as const;

export const NetworkModeOptionLabels = {
    [NetworkModeOptionKeys.peak]: "Peak",
    [NetworkModeOptionKeys.offPeak]: "Off Peak",
    [NetworkModeOptionKeys.peakNoExpress]: "Peak No Express",
    [NetworkModeOptionKeys.offPeakNoExpress]: "Off Peak No Express",
    [NetworkModeOptionKeys.car]: "Car",
};

export const NetworkModeOptions = {
    [NetworkModeOptionKeys.peak]: "peak",
    [NetworkModeOptionKeys.offPeak]: "off-peak",
    [NetworkModeOptionKeys.peakNoExpress]: "peak-no-express",
    [NetworkModeOptionKeys.offPeakNoExpress]: "off-peak-no-express",
    [NetworkModeOptionKeys.car]: "car",
};

export type NetworkModeOptionKeys = typeof NetworkModeOptionKeys;
export type NetworkModeOptionKey = keyof NetworkModeOptionKeys;
