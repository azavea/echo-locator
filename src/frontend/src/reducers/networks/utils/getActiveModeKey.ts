import { NetworkModeOptions, type NetworkModeOptionKey } from "src/enums";

const getActiveModeKey = (
    isPeak: boolean,
    hasVehicle: boolean,
    useCommuterRail: boolean
): NetworkModeOptionKey =>
    hasVehicle
        ? (NetworkModeOptions.car as NetworkModeOptionKey)
        : useCommuterRail
          ? isPeak
              ? (NetworkModeOptions.peak as NetworkModeOptionKey)
              : (NetworkModeOptions.offPeak as NetworkModeOptionKey)
          : isPeak
            ? (NetworkModeOptions.peakNoExpress as NetworkModeOptionKey)
            : (NetworkModeOptions.offPeakNoExpress as NetworkModeOptionKey);

export default getActiveModeKey;
