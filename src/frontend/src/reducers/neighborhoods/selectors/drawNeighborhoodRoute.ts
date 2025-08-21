// Refactored from old codebase using latest commit before introducing listings: 8ca3b943a70039d7af1f41a6b825a106f6c5d23c
// Follow latest Taui conventions to support routes with MapLibre

import findIndex from "lodash/findIndex";
import get from "lodash/get";
import selectNeighborhoodRoutes from "../../networks/selectors/networkNeighborhoodRoutes";
import { createSelector } from "@reduxjs/toolkit";
import type { Feature } from "geojson";
import type { RootState } from "store/store";
import type {
    NeighborhoodRouteLeg,
    NeighborhoodRoutePath,
    NeighborhoodTransitStop,
} from "reducers/networks/types";
import { selectAllNetworksDataReady } from "src/reducers/networks/networksSlice";

export default createSelector(
    [
        (state: RootState) => get(state, "neighborhoods.activeNeighborhood"),
        selectNeighborhoodRoutes,
        selectAllNetworksDataReady,
    ],
    (
        activeNeighborhood: string | null,
        neighborhoodRoutes = [],
        networksReady
    ) => {
        if (!neighborhoodRoutes || !networksReady || !activeNeighborhood) {
            return null;
        }
        const index = findIndex(
            neighborhoodRoutes,
            route => route.id === activeNeighborhood
        );
        if (index === -1) {
            return null;
        }
        const transitive = neighborhoodRoutes[index];
        // Don't draw alternative routes
        const allSegments: NeighborhoodRoutePath = get(
            transitive,
            "segments[0]",
            []
        );
        const segments = [...allSegments];
        const start = transitive.start;
        const end = transitive.end;

        // Taui
        // Convert to [lon, lat] coordinates
        const startCoords = [start.position.lon, start.position.lat];
        const endCoords = [end.position.lon, end.position.lat];

        if (segments.length === 0) {
            return {
                type: "FeatureCollection",
                features: [createWalkFeature([startCoords, endCoords])],
            };
        }

        const firstStop = segments[0].fromStop;
        const lastStop = segments[segments.length - 1].toStop;

        return {
            type: "FeatureCollection",
            features:
                firstStop && lastStop
                    ? [
                          createWalkFeature([
                              startCoords,
                              firstStop.coordinates,
                          ]),
                          ...segments.reduce<Feature[]>(
                              (features, s) => [
                                  ...features,
                                  ...createSegmentFeatures(s),
                              ],
                              []
                          ),
                          // Exclude final walk to neighborhood center to match old UI
                          // createWalkFeature([lastStop.coordinates, endCoords]),
                      ]
                    : [],
        };
    }
);

function createSegmentFeatures(segment: NeighborhoodRouteLeg) {
    if (segment.mode === "WALK") {
        return [createWalkFeature(segment.coordinates)];
    }

    return segment.toStop && segment.fromStop
        ? [
              createStopFeature(segment.fromStop),
              {
                  type: "Feature",
                  properties: {
                      mode: segment.mode,
                      name: segment.name,
                      patternId: segment.patternId,
                      routeColor: segment.routeColor,
                      routeId: segment.routeId,
                  },
                  geometry: {
                      type: "LineString",
                      coordinates: segment.coordinates,
                  },
              } as Feature,
              createStopFeature(segment.toStop),
          ]
        : [];
}

function createStopFeature(stop: NeighborhoodTransitStop) {
    return {
        type: "Feature",
        properties: {
            name: stop.name,
            stopId: stop.stopId,
        },
        geometry: {
            type: "Point",
            coordinates: stop.coordinates,
        },
    } as Feature;
}

function createWalkFeature(coordinates: number[][]) {
    return {
        type: "Feature",
        properties: {
            mode: "WALK",
        },
        geometry: {
            type: "LineString",
            coordinates,
        },
    } as Feature;
}
