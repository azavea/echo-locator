import { useMemo } from "react";
import { useAppSelector } from "src/store/store";
import type { Destination } from "src/reducers/userProfile/types";
import { makeSelectPathToNeighborhood } from "src/reducers/neighborhoods/selectors/selectNeighborhoodRouteData";
import type { NeighborhoodRouteLeg } from "src/reducers/networks/types";

export const useGetDestinationToNeighborhoodPath = (
    destination: Destination,
    neighborhoodZipcode: string
): NeighborhoodRouteLeg[] => {
    const selectDestinationToNeighborhoodSegments = useMemo(
        () => makeSelectPathToNeighborhood(destination, neighborhoodZipcode),
        [destination, neighborhoodZipcode]
    );

    return useAppSelector(selectDestinationToNeighborhoodSegments);
};
