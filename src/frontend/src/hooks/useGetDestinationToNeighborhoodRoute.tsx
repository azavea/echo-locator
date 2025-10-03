import { useMemo } from "react";
import type { FeatureCollection } from "geojson";
import { useAppSelector } from "src/store/store";
import type { Destination } from "src/reducers/userProfile/types";
import { makeSelectRouteToNeighborhood } from "src/reducers/neighborhoods/selectors/drawNeighborhoodRoutes";

export const useGetDestinationToNeighborhoodRoute = (
    destination: Destination,
    neighborhoodZipcode: string
): FeatureCollection | null => {
    const selectDestinationToNeighborhoodRoute = useMemo(
        () => makeSelectRouteToNeighborhood(destination, neighborhoodZipcode),
        [destination, neighborhoodZipcode]
    );

    const routeGeoJson = useAppSelector(selectDestinationToNeighborhoodRoute);
    return routeGeoJson;
};
