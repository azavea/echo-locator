// Refactored from old codebase at latest commit before introducing listings: 8ca3b94
// New code copied from latest Taui v3 to support routes with MapLibre
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import polyline from "@mapbox/polyline";
import slice from "lodash/slice";
import uniq from "lodash/uniq";
import toUpperCase from "lodash/upperCase";

import type {
    Location,
    NeighborhoodRoutePaths,
    Path,
    PopulatedPath,
    RoutableNetwork,
    TransitiveStop,
} from "../types";
import { coordinateToIndex } from "./coordinateToIndex";
import { find, uniqBy } from "lodash";

const DEFAULT_ROUTE_COLOR = "0b2b40";
const TYPE_TO_ICON = ["subway", "subway", "train", "bus"];
const WALK = "WALK";

export default function createTransitiveRoutesForNetwork(
    network: RoutableNetwork,
    _start: Location,
    end: Location
): NeighborhoodRoutePaths {
    const td = network.transitive;
    // Get the targetPathIndexes
    const baseIndex =
        network.pathsPerTarget * coordinateToIndex(network, end.position);

    // Don't use native slice here as `targets` is a TypedArray and that will force conversion to TypedArray values
    const targetPathIndexes = uniq(
        slice(network.targets, baseIndex, baseIndex + network.pathsPerTarget)
    ).filter(tpi => tpi !== -1); // some destinations will not have any paths

    // Cannot reach the destination
    if (targetPathIndexes.length === 0) {
        return [];
    }

    // Find stop
    const findStop = (stopId: string) => find(td.stops, ["stop_id", stopId]);

    // Convert to [stop, pattern, stop] arrays
    const allPaths = targetPathIndexes.map(index => network.paths[index]);

    // Populate each path leg with it's stops, pattern, and route
    const populatePath = (path: Path): PopulatedPath[] =>
        path
            .map(([fromStopId, patternId, toStopId]) => {
                const pattern = find(td.patterns, ["pattern_id", patternId]);
                const route = pattern
                    ? find(td.routes, ["route_id", pattern.route_id])
                    : null;
                const fromStop = findStop(fromStopId);
                const toStop = findStop(toStopId);
                return pattern && route && fromStop && toStop
                    ? {
                          fromStop: fromStop,
                          pattern,
                          route,
                          toStop: toStop,
                      }
                    : null;
            })
            .filter(p => p !== null);

    // Collect pattern and route information
    const populatedPaths = allPaths.map(populatePath).map(addDataToPaths);

    // Filter non-unique route combinations
    return uniqBy(populatedPaths, r => r.map(s => s.name).join("-"));
}

/**
 * Used to show a transitive route
 */
function addDataToPaths(path: PopulatedPath[]) {
    const segments = [];
    let previousStop = path[0].fromStop;
    for (let i = 0; i < path.length; i++) {
        const leg = path[i];
        const boardStop = leg.fromStop;
        const pattern = leg.pattern;
        const alightStop = leg.toStop;

        // If there is an on-street transfer
        if (previousStop.stop_id !== boardStop.stop_id) {
            segments.push({
                mode: WALK,
                coordinates: [
                    [previousStop.stop_lon, previousStop.stop_lat],
                    [boardStop.stop_lon, boardStop.stop_lat],
                ],
            });
        }

        const findStopIndex = (stop: TransitiveStop) =>
            pattern.stops.findIndex(s => s.stop_id === stop.stop_id);

        const subSegments = pattern.stops.slice(
            findStopIndex(boardStop),
            findStopIndex(alightStop)
        );
        const latLons = subSegments.reduce<[number, number][]>(
            (lls, s) => [...lls, ...polyline.decode(s.geometry)],
            []
        );

        leg.route.route_type &&
            segments.push({
                fromStop: {
                    coordinates: [boardStop.stop_lon, boardStop.stop_lat],
                    name: boardStop.stop_name,
                    stopId: boardStop.stop_id,
                },
                coordinates: latLons.map(([lat, lon]) => [lon, lat]), // reverse coords
                mode: TYPE_TO_ICON[leg.route.route_type],
                name: toUpperCase(leg.route.route_short_name),
                patternId: leg.pattern.pattern_id,
                routeColor:
                    "#" + (leg.route.route_color || DEFAULT_ROUTE_COLOR),
                routeId: leg.route.route_id,
                toStop: {
                    coordinates: [alightStop.stop_lon, alightStop.stop_lat],
                    name: alightStop.stop_name,
                    stopId: alightStop.stop_id,
                },
            });

        previousStop = alightStop;
    }

    return segments;
}
