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
