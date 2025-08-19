// Copied from old codebase using latest commit before introducing listings: 8ca3b943a70039d7af1f41a6b825a106f6c5d23c

import polyline from "@mapbox/polyline";
import findIndex from "lodash/findIndex";
import get from "lodash/get";

import { STOP_STYLE, TRANSIT_STYLE, WALK_STYLE } from "../../../constants";

import selectNeighborhoodRoutes from "../../networks/selectors/networkNeighborhoodRoutes";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "store/store";
import type {
    JourneySegment,
    JourneySegmentLocation,
    NeighborhoodRoute,
} from "reducers/networks/types";
import { selectAllNetworksDataReady } from "src/reducers/networks/networksSlice";

/**
 * NB: All positions are [latitude, longitude] as they go directly to Leaflet
 */
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
        if (!neighborhoodRoutes || !networksReady) {
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
        const applyStyle = { opacity: 1, fillOpacity: 1 };
        const walkStyle = { ...WALK_STYLE, ...applyStyle };
        const transitStyle = { ...TRANSIT_STYLE, ...applyStyle };
        const stopStyle = { ...STOP_STYLE, ...applyStyle };
        const allSegments = get(transitive, "journeys[0].segments", []);
        // Remove final walk leg
        const segments = [...allSegments];
        segments.pop();
        return {
            index,
            id: transitive.id,
            label: transitive.label,
            segments: segments.map(s => getSegmentPositions(s, transitive)),
            stops: segments
                .filter(s => s.type === "TRANSIT")
                .reduce(
                    (stops, s) => [
                        ...stops,
                        getStopPositions(
                            s.pattern_id,
                            s.from_stop_index,
                            transitive
                        ),
                        getStopPositions(
                            s.pattern_id,
                            s.to_stop_index,
                            transitive
                        ),
                    ],
                    []
                ),
            stopStyle,
            transitStyle,
            walkStyle,
        };
    }
);

function getSegmentPositions(
    segment: JourneySegment,
    transitive: NeighborhoodRoute
) {
    if (segment.type === "WALK") return getWalkPositions(segment, transitive);
    return getTransitPositions(segment, transitive);
}

function getWalkPositions(
    segment: JourneySegment,
    transitive: NeighborhoodRoute
) {
    function ll(l: JourneySegmentLocation) {
        if (l.place_id) {
            const p = transitive.places.find(p => p.place_id === l.place_id);
            return [p.place_lat, p.place_lon];
        }
        const s = transitive.stops.find(s => s.stop_id === l.stop_id)!;
        return [s.stop_lat, s.stop_lon];
    }
    return {
        type: "WALK",
        positions: [ll(segment.from), ll(segment.to)],
    };
}

function getTransitPositions(
    segment: JourneySegment,
    transitive: NeighborhoodRoute
) {
    const p = transitive.patterns.find(
        p => segment.pattern_id === p.pattern_id
    )!;
    const stops = p.stops.slice(segment.from_stop_index, segment.to_stop_index);
    const route = transitive.routes.find(r => p.route_id === r.route_id);
    const routeColor = get(route, "route_color"); // could be null
    return {
        color: `#${routeColor || "333"}`,
        type: "TRANSIT",
        positions: stops.reduce<[number, number][]>(
            (lls, s) => [...lls, ...polyline.decode(s.geometry)],
            []
        ),
    };
}

function getStopPositions(
    pid: string,
    sindex: number,
    transitive: NeighborhoodRoute
) {
    const p = transitive.patterns.find(p => pid === p.pattern_id)!;
    const sid = p.stops[sindex].stop_id;
    const stop = transitive.stops.find(s => sid === s.stop_id)!;
    return [stop.stop_lat, stop.stop_lon];
}
