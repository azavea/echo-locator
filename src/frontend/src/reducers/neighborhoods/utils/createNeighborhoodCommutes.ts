import { NetworkModeOptions, type NetworkModeOptionKey } from "src/enums";
import type { TimesAndPathsByPlace } from "src/reducers/networks/types";
import type { Destination } from "src/reducers/userProfile/types";
import type { Commutes } from "../types";

/**
 * Calculates a neighborhood's commute time range to each user destination.
 * Travel times are accessed by neighborhood index for each transportaion network mode.
 * Compiling commute time ranges follows the below rules:
 * CAR (i.e. useTransit is false):
 *  - Only index a travel time from the "car" network analysis
 *  - No traffic congestion included in analysis, so min and max are the same
 * COMMUTER TRANSIT (i.e. useCommuterRail is true):
 *  - All transit network modes used to compile range
 *  - Commute range min is quickest commute time between all transit network modes
 *  - Commute range max is longest commute time between all transit network modes
 * LOCAL TRANSIT (i.e. useCommuterRail is false):
 *  - Only "Peak" and "Off-Peak" transit network modes used to compile range
 *  - Commute range min is quickest commute time between "Peak" and "Off-Peak" modes
 *  - Commute range max is longest commute time between "Peak" and "Off-Peak" modes
 */
export const createNeighborhoodCommutes = (
    neighborhoodIndex: number,
    travelTimesAndRoutes: TimesAndPathsByPlace,
    destinations: Destination[],
    useTransit: boolean,
    useCommuterRail: boolean
) =>
    Object.values(destinations).reduce((trips, place) => {
        let commuteMin = null;
        let commuteMax = null;
        const placeIdentifier = place.location.label;
        const timeAndPathsByNetwork = travelTimesAndRoutes[placeIdentifier];

        if (useTransit) {
            // Find min/max travel time between all transit modes
            if (useCommuterRail) {
                commuteMin = Object.entries(timeAndPathsByNetwork).reduce(
                    (min, [key, network]) => {
                        if (
                            key !== NetworkModeOptions.car &&
                            (min === 0 ||
                                network.travelTimesByNeighborhood[
                                    neighborhoodIndex
                                ] < min)
                        ) {
                            min =
                                network.travelTimesByNeighborhood[
                                    neighborhoodIndex
                                ];
                        }
                        return min;
                    },
                    0
                );
                commuteMax = Object.entries(timeAndPathsByNetwork).reduce(
                    (max, [key, network]) => {
                        if (
                            key !== NetworkModeOptions.car &&
                            (max === 0 ||
                                network.travelTimesByNeighborhood[
                                    neighborhoodIndex
                                ] > max)
                        ) {
                            max =
                                network.travelTimesByNeighborhood[
                                    neighborhoodIndex
                                ];
                        }
                        return max;
                    },
                    0
                );
            }
            // Find min/max travel time for bus/train, no express
            else {
                const peakTravelTime =
                    timeAndPathsByNetwork[
                        NetworkModeOptions.peakNoExpress as NetworkModeOptionKey
                    ].travelTimesByNeighborhood[neighborhoodIndex];
                const offPeakTravelTime =
                    timeAndPathsByNetwork[
                        NetworkModeOptions.offPeakNoExpress as NetworkModeOptionKey
                    ].travelTimesByNeighborhood[neighborhoodIndex];
                commuteMin =
                    peakTravelTime < offPeakTravelTime
                        ? peakTravelTime
                        : offPeakTravelTime;
                commuteMax =
                    peakTravelTime > offPeakTravelTime
                        ? peakTravelTime
                        : offPeakTravelTime;
            }
        } else {
            const neighborhoodTravelTimes =
                timeAndPathsByNetwork[
                    NetworkModeOptions.car as NetworkModeOptionKey
                ].travelTimesByNeighborhood;
            commuteMin = neighborhoodTravelTimes[neighborhoodIndex];
            commuteMax = neighborhoodTravelTimes[neighborhoodIndex];
        }

        trips[placeIdentifier] = {
            purpose: place.purpose,
            commuteMin: commuteMin,
            commuteMax: commuteMax,
        };
        return trips;
    }, {} as Commutes);
