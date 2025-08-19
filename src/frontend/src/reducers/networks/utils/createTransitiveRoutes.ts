// Copied from old codebase using latest commit before introducing listings: 8ca3b943a70039d7af1f41a6b825a106f6c5d23c

import slice from "lodash/slice";
import uniq from "lodash/uniq";
import toUpperCase from "lodash/upperCase";

import type {
    Location,
    QualifiedPath,
    RoutableNetwork,
    RouteSegment,
    TransitivePattern,
    TransitiveRoute,
    TransitiveStop,
} from "../types";
import { coordinateToIndex } from "./coordinateToIndex";

export function isLight(hexcolor: string): boolean {
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128;
}

/**
 * Find or throw
 */
function fot(a: any[], find: (arg0: any) => boolean) {
    const ret = a.find(find);
    if (!ret) throw new Error("Value not found in array.");
    return ret;
}

const DEFAULT_ROUTE_COLOR = "0b2b40";
const TYPE_TO_ICON = ["subway", "subway", "train", "bus"];
const PLACE = "PLACE";
const STOP = "STOP";
const TRANSIT = "TRANSIT";
const WALK = "WALK";

export default function createTransitiveRoutesForNetwork(
    network: RoutableNetwork,
    start: Location,
    end: Location
) {
    const td = network.transitive;
    const places = [
        {
            place_id: "from",
            place_name: start.label,
            place_lon: start.position.lon,
            place_lat: start.position.lat,
        },
        {
            place_id: "to",
            place_name: end.label,
            place_lon: end.position.lon,
            place_lat: end.position.lat,
        },
    ];

    // Get the targetPathIndexes
    const baseIndex =
        network.pathsPerTarget * coordinateToIndex(network, end.position);

    // Don't use native slice here as `targets` is a TypedArray and that will force conversion to TypedArray values
    const targetPathIndexes = uniq(
        slice(network.targets, baseIndex, baseIndex + network.pathsPerTarget)
    ).filter(tpi => tpi !== -1); // some destinations will not have any paths

    // Cannot reach the destination
    if (targetPathIndexes.length === 0) {
        return {
            ...td,
            places,
            journeys: [],
            routeSegments: [],
        };
    }

    const pathsData = network.paths;
    const paths = targetPathIndexes.map<QualifiedPath>(tpi =>
        pathsData[tpi]
            // map the pattern ids in each path leg to the actual patterns they contain
            .map(leg => [
                leg[0],
                fot(
                    td.patterns,
                    (p: TransitivePattern) => p.pattern_id === leg[1]
                ), // ensure that we are comparing strings
                leg[2],
            ])
            // map the stop ids to actual stops including their stop index
            .map(([boardStopId, pattern, alightStopId]) => {
                const findStop = (id: string) => ({
                    ...fot(td.stops, (s: TransitiveStop) => s.stop_id === id),
                    stopIndex: pattern.stops.findIndex(
                        (s: TransitiveStop) => s.stop_id === id
                    ),
                });

                return [findStop(boardStopId), pattern, findStop(alightStopId)];
            })
    );

    // Map the paths to transitive journeys
    const journeys = paths.map(path => ({
        journey_id: 0,
        journey_name: 0,
        segments:
            path.length === 0
                ? createWalkOnlyJourney()
                : getTransitiveSegmentsFromPath(path),
    }));

    return {
        ...td,
        journeys,
        places,
        routeSegments: paths.map(path =>
            path.map(leg => {
                const route: TransitiveRoute = fot(
                    td.routes,
                    r => r.route_id === leg[1].route_id
                );
                const seg = {} as RouteSegment;
                const getRouteName = () => toUpperCase(route.route_short_name);
                const color = route.route_color
                    ? `#${route.route_color}`
                    : "#0b2b40";
                seg.name = getRouteName();

                if (leg[1].patterns && leg[1].patterns.length > 0) {
                    const patternNames = leg[1].patterns
                        .map(p =>
                            fot(td.routes, r => r.route_id === p.route_id)
                        )
                        .map(getRouteName);
                    seg.name = uniq(patternNames).join(" / ");
                }

                seg.backgroundColor = color;
                seg.color = isLight(color.substr(1)) ? "#000" : "#fff";
                seg.type = route.route_type
                    ? TYPE_TO_ICON[route.route_type]
                    : DEFAULT_ROUTE_COLOR;

                return seg;
            })
        ),
    };
}

function createWalkOnlyJourney() {
    return [
        {
            type: WALK,
            from: {
                type: PLACE,
                place_id: "from",
            },
            to: {
                type: PLACE,
                place_id: "to",
            },
        },
    ];
}

/**
 * Used to show a transitive route
 */
function getTransitiveSegmentsFromPath(path: QualifiedPath) {
    const initialStopId = path[0][0].stop_id;
    const segments = [];
    let previousStopId = initialStopId;
    for (let i = 0; i < path.length; i++) {
        const leg = path[i];
        const boardStop = leg[0];
        const pattern = leg[1];
        const alightStop = leg[2];

        if (previousStopId !== boardStop.stop_id) {
            // aka there is an on-street transfer
            segments.push({
                type: WALK,
                from: {
                    type: STOP,
                    stop_id: previousStopId,
                },
                to: {
                    type: STOP,
                    stop_id: boardStop.stop_id,
                },
            });
        }

        segments.push({
            type: TRANSIT,
            pattern_id: pattern.pattern_id,
            from_stop_index: boardStop.stopIndex,
            to_stop_index: alightStop.stopIndex,
        });

        previousStopId = alightStop.stop_id;
    }

    return [
        {
            type: WALK,
            from: {
                type: PLACE,
                place_id: "from",
            },
            to: {
                type: STOP,
                stop_id: initialStopId,
            },
        },
        ...segments,
        {
            type: WALK,
            from: {
                type: STOP,
                stop_id: previousStopId,
            },
            to: {
                type: PLACE,
                place_id: "to",
            },
        },
    ];
}
