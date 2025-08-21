// Source code copied from latest Taui v3
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import { toPixel } from "@conveyal/lonlat";
import type { originPoint } from "../types";

/**
 *
 * Project a coordinate to it's pixel coordinate and find the appropriate point
 * associated with it.
 */
function coordinateToPoint(
    coordinate: originPoint,
    zoom: number,
    west: number,
    north: number
) {
    const pixel = toPixel(coordinate, zoom);

    return {
        x: (pixel.x - west) | 0,
        y: (pixel.y - north) | 0,
    };
}

export function coordinateToIndex(network: any, coordinate: originPoint) {
    const originPoint = coordinateToPoint(
        coordinate,
        network.zoom,
        network.west,
        network.north
    );
    return originPoint.x + originPoint.y * network.width;
}
