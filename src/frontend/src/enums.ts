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

export const NetworkModeOptions = {
    peak: "peak",
    offPeak: "offPeak",
    peakNoExpress: "peakNoExpress",
    offPeakNoExpress: "offPeakNoExpress",
    car: "car",
};

export const NetworkModeOptionLabels = {
    [NetworkModeOptions.peak]: "Peak",
    [NetworkModeOptions.offPeak]: "Off Peak",
    [NetworkModeOptions.peakNoExpress]: "Peak No Express",
    [NetworkModeOptions.offPeakNoExpress]: "Off Peak No Express",
    [NetworkModeOptions.car]: "Car",
};

export const NetworkModeOptionPaths = {
    [NetworkModeOptions.peak]: "peak",
    [NetworkModeOptions.offPeak]: "off-peak",
    [NetworkModeOptions.peakNoExpress]: "peak-no-express",
    [NetworkModeOptions.offPeakNoExpress]: "off-peak-no-express",
    [NetworkModeOptions.car]: "car",
};

export type NetworkModeOptionKey = keyof typeof NetworkModeOptions;

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
