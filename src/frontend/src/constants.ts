import { Language } from "./enums";
import type { NetworkModeOptions } from "./reducers/networks/types";

export const languageToLabel = {
    [Language.EN]: "English",
    [Language.ES]: "Español",
    [Language.ZH]: "中文",
};

export const networks = {
    ["peak" as NetworkModeOptions]: {
        label: "Peak",
        commuter: true,
    },
    ["off-peak" as NetworkModeOptions]: {
        label: "Off Peak",
        commuter: true,
    },
    ["peak-no-express" as NetworkModeOptions]: {
        label: "Peak No Express",
        commuter: false,
    },
    ["off-peak-no-express" as NetworkModeOptions]: {
        label: "Off Peak No Express",
        commuter: false,
    },
    ["car" as NetworkModeOptions]: {
        label: "Car",
        commuter: null,
    },
};
