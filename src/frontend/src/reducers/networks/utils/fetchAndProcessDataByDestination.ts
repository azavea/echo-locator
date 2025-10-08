// Refactored from old codebase loadDataset and fetchAllTimesAndPathsForCoordinate at commit 6f17e33
// New source code copied from latest Taui v3
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import type { NetworkModeOptionKey } from "src/enums";
import type { Destination } from "reducers/userProfile/types";
import type { RootState } from "store/store";
import type {
    NetworkAndTimeAndPathsData,
    ParsedPathsData,
    TimesAndPathsData,
} from "../types";
import { coordinateToIndex } from "./coordinateToIndex";
import { fetchPathsData, fetchTimesData } from "api/networks";
import { parsePathsData } from "./parsePathsData";
import { parseTimesData } from "./parseTimesData";
import createNetworkNeighborhoodTravelTimes from "./createNetworkNeighborhoodTravelTimes";
import createNetworkNeighborhoodRoutes from "./createNetworkNeighborhoodRoutes";

export async function fetchAndProcessDataByDestination(
    destination: Destination,
    state: RootState
): Promise<{
    label: string;
    data: { [key in NetworkModeOptionKey]: TimesAndPathsData };
}> {
    const neighborhoods = state.neighborhoods.neighborhoods;
    const networks = state.networks.networks;
    const {
        location: { label, position: origin },
    } = destination;

    if (!neighborhoods || !networks) {
        throw new Error(
            "Required state (neighborhoods or networks) is missing."
        );
    }

    const allParsedTimeAndPathData = await Promise.all(
        Object.keys(networks).map(async networkKeyString => {
            const network = networkKeyString as NetworkModeOptionKey;
            const networkDetails =
                state.networks.networks && state.networks.networks[network];
            if (!networkDetails) {
                throw new ErrorEvent(
                    `Network analysis details not available for ${network}`
                );
            }
            const index = coordinateToIndex(networkDetails, origin);

            // Car paths not generated in analysis,
            // only time surface with no congestion data
            const pathsFetchPromise =
                network === "car"
                    ? Promise.resolve(null)
                    : fetchPathsData(network, index);
            const timesFetchPromise = fetchTimesData(network, index);
            const [pathsResponse, timesResponse] = await Promise.all([
                pathsFetchPromise,
                timesFetchPromise,
            ]);

            const pathsData = pathsResponse
                ? parsePathsData(pathsResponse.value)
                : ({} as ParsedPathsData);

            const travelTimeSurface = parseTimesData(timesResponse.value);

            const routableNetwork = {
                ...networkDetails,
                name: network as NetworkModeOptionKey,
                ...pathsData,
                travelTimeSurface,
            } as NetworkAndTimeAndPathsData;

            // derive neighborhood routes by place and network mode
            const networkRoutesByNeighborhood = createNetworkNeighborhoodRoutes(
                routableNetwork,
                origin,
                neighborhoods
            );
            // get travel times by place and network mode
            const networkTravelTimesByNeighborhood =
                createNetworkNeighborhoodTravelTimes(
                    routableNetwork,
                    neighborhoods
                );

            return {
                name: network as NetworkModeOptionKey,
                routesByNeighborhood: networkRoutesByNeighborhood,
                travelTimesByNeighborhood: networkTravelTimesByNeighborhood,
                timesAndRoutesDataReady: true,
            };
        })
    );
    return {
        // TODO: Once we have user profile from backend, use
        // destination ID in place of string label for identifier
        label: label,
        data: allParsedTimeAndPathData.reduce(
            (dataByNetwork, data) => {
                dataByNetwork[data.name] = data;
                return dataByNetwork;
            },
            {} as {
                [key in NetworkModeOptionKey]: TimesAndPathsData;
            }
        ),
    };
}
