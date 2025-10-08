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

export const NetworkModeOptionKeys = {
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

export const NetworkModeOptionPaths = {
    [NetworkModeOptionKeys.peak]: "peak",
    [NetworkModeOptionKeys.offPeak]: "off-peak",
    [NetworkModeOptionKeys.peakNoExpress]: "peak-no-express",
    [NetworkModeOptionKeys.offPeakNoExpress]: "off-peak-no-express",
    [NetworkModeOptionKeys.car]: "car",
};

export type NetworkModeOptionKey = keyof typeof NetworkModeOptionKeys;

export const NeighborhoodCardViewType = {
    cardFull: "cardFull",
    cardNoImageNoTag: "cardNoImageNoTag",
    cardImageOnly: "cardImageOnly",
    cardNoImage: "cardNoImage",
};

export type NeighborhoodCardViewTypeKey = keyof typeof NeighborhoodCardViewType;

export const unitSiteLabel = {
    craigslist: "Craigslist",
    zillow: "Zillow",
    ah: "AffordableHomes.com",
};

export type UnitSitesKeyType = keyof typeof unitSiteLabel;
