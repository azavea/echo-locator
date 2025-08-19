import { toPixel } from "@conveyal/lonlat";
import type { originPoint } from "../types";

/**
 * * Copied from Taui: https://github.com/conveyal/taui/blob/dev/src/utils/coordinate-to-point.js
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

// Copied from Taui: https://github.com/conveyal/taui/blob/dev/src/services/network.js
export function coordinateToIndex(network: any, coordinate: originPoint) {
    const originPoint = coordinateToPoint(
        coordinate,
        network.zoom,
        network.west,
        network.north
    );
    return originPoint.x + originPoint.y * network.width;
}
