// Refactored from old codebase at latest commit before introducing listings: 8ca3b94
// New code copied from latest Taui v3 to support routes with MapLibre
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import findIndex from "lodash/findIndex";
import get from "lodash/get";
import { createSelector } from "@reduxjs/toolkit";
import type { Feature, FeatureCollection } from "geojson";
import type { RootState } from "store/store";
import type {
    NeighborhoodRouteLeg,
    NeighborhoodRoutePath,
    NeighborhoodTransitStop,
} from "reducers/networks/types";
import { selectAllNetworksDataReady } from "src/reducers/networks/networksSlice";
import type { Destination } from "src/reducers/userProfile/types";

export const makeSelectRouteToNeighborhood = (
    destination: Destination,
    neighborhoodZipcode: string
) => {
    return createSelector(
        [
            (state: RootState) => get(state, "networks.activeMode"),
            (state: RootState) => get(state, "networks.timesAndRoutesData"),
            selectAllNetworksDataReady,
        ],
        (activeNetworkMode, travelTimesAndRoutes, networksReady) => {
            if (
                !travelTimesAndRoutes ||
                !networksReady ||
                !neighborhoodZipcode ||
                !destination
            ) {
                return null;
            }

            const { routesByNeighborhood } =
                travelTimesAndRoutes[destination.location.label][
                    activeNetworkMode
                ];

            const index = findIndex(
                routesByNeighborhood,
                route => route.id === neighborhoodZipcode
            );
            if (index === -1) {
                return {
                    type: "FeatureCollection",
                    features: [],
                } as FeatureCollection;
            }
            const transitive = routesByNeighborhood[index];
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
                    features: [
                        createAnchorFeature(startCoords, "start"),
                        createWalkFeature([startCoords, endCoords]),
                        createAnchorFeature(endCoords, "end"),
                    ],
                } as FeatureCollection;
            }

            const firstStop = segments[0].fromStop;
            const lastStop = segments[segments.length - 1].toStop;

            return {
                type: "FeatureCollection",
                features:
                    firstStop && lastStop
                        ? [
                              createAnchorFeature(startCoords, "start"),
                              createWalkFeature([
                                  startCoords,
                                  firstStop.coordinates,
                              ]),
                              ...segments.reduce<Feature[]>(
                                  (features, s, i) => {
                                      const endAnchor =
                                          i === segments.length - 1 && s.toStop
                                              ? [
                                                    createAnchorFeature(
                                                        s.toStop.coordinates,
                                                        "end"
                                                    ),
                                                ]
                                              : [];

                                      return [
                                          ...features,
                                          ...createSegmentFeatures(s),
                                          ...endAnchor,
                                      ];
                                  },
                                  []
                              ),
                              // Exclude final walk to neighborhood center to match old UI
                              // createWalkFeature([lastStop.coordinates, endCoords]),
                          ]
                        : [],
            } as FeatureCollection;
        }
    );
};

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

function createAnchorFeature(coordinates: number[], pointType: string) {
    return {
        type: "Feature",
        properties: {
            name: pointType,
        },
        geometry: {
            type: "Point",
            coordinates: coordinates,
        },
    } as Feature;
}
