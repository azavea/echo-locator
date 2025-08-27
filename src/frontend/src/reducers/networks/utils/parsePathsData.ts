// Refactored from latest Taui v3 parsePathsData to support new paths data format
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

import type { Leg, ParsedPathsData } from "../types";

const PATHS_GRID_TYPE = "PATHGRID";
const PATHS_GRID_VERSION_HEADER = "_VER";
const PATHS_GRID_VERSION = 1;

/**
 * Parse the ArrayBuffer of a `*_paths.dat` file for a point in a network.
 */
export function parsePathsData(ab: ArrayBuffer): ParsedPathsData {
    const header = String.fromCharCode(
        ...new Int8Array(ab, 0, PATHS_GRID_TYPE.length)
    );
    const versionHeader = String.fromCharCode(
        ...new Int8Array(
            ab,
            PATHS_GRID_TYPE.length,
            PATHS_GRID_VERSION_HEADER.length
        )
    );

    if (
        header !== PATHS_GRID_TYPE ||
        versionHeader !== PATHS_GRID_VERSION_HEADER
    ) {
        throw new Error(
            `Retrieved grid header is invalid. Expected "${PATHS_GRID_TYPE}" and "${PATHS_GRID_VERSION_HEADER}". Please check your data.`
        );
    }

    // Paths data now includes two single-byte integers for the access and egress modes
    // Use a DataView to correctly handle the mixed-type binary data
    const dataView = new DataView(ab);
    let byteOffset = PATHS_GRID_TYPE.length + PATHS_GRID_VERSION_HEADER.length;

    const version = dataView.getInt32(byteOffset, true);
    byteOffset += Int32Array.BYTES_PER_ELEMENT;

    if (version !== PATHS_GRID_VERSION) {
        throw new Error(
            `Unsupported path grid version: ${version}. Expected version: ${PATHS_GRID_VERSION}.`
        );
    }

    const nTargets = dataView.getInt32(byteOffset, true);
    byteOffset += Int32Array.BYTES_PER_ELEMENT;

    const pathsPerTarget = dataView.getInt32(byteOffset, true);
    byteOffset += Int32Array.BYTES_PER_ELEMENT;

    const nDistinctPaths = dataView.getInt32(byteOffset, true);
    byteOffset += Int32Array.BYTES_PER_ELEMENT;

    const distinctPaths = [];
    for (let i = 0; i < nDistinctPaths; i++) {
        const nLegs = dataView.getInt32(byteOffset, true);
        byteOffset += Int32Array.BYTES_PER_ELEMENT;

        // Offset by two to account for access & egress modes
        // each is a single byte
        byteOffset += 2;

        const legList = [] as Leg[];
        for (let j = 0; j < nLegs; j++) {
            const boardStopId = dataView.getInt32(byteOffset, true);
            byteOffset += Int32Array.BYTES_PER_ELEMENT;
            const patternId = dataView.getInt32(byteOffset, true);
            byteOffset += Int32Array.BYTES_PER_ELEMENT;
            const alightStopId = dataView.getInt32(byteOffset, true);
            byteOffset += Int32Array.BYTES_PER_ELEMENT;
            legList.push([
                boardStopId.toString(),
                patternId.toString(),
                alightStopId.toString(),
            ]);
        }
        distinctPaths.push(legList);
    }

    // Process the delta-encoded path indexes
    const targetPathIndexes = new Int32Array(nTargets * pathsPerTarget);
    let previousValue = 0;

    for (let i = 0; i < nTargets * pathsPerTarget; i++) {
        const delta = dataView.getInt32(byteOffset, true);
        byteOffset += Int32Array.BYTES_PER_ELEMENT;
        const pathIndex = previousValue + delta;
        targetPathIndexes[i] = pathIndex;
        previousValue = pathIndex;
    }

    return {
        paths: distinctPaths,
        pathsPerTarget: pathsPerTarget,
        targets: targetPathIndexes,
    };
}
