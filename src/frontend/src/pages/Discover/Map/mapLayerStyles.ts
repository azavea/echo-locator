export const neighborhoodsStyle = {
    id: "neighborhoods",
    type: "fill",
    source: "neighborhoods-geojson",
    minzoom: 6,
    layout: { visibility: "visible" },
    paint: {
        "fill-color": [
            "match",
            ["get", "category"], // Get the value of the "class" property
            "unreachable",
            "rgba(255, 255, 255, 0)", // If it's "unreachable", use this color
            "top",
            "rgba(161, 192, 37, 0.75)", // If it's "top", use this color
            "rgba(168, 196, 54, 0.51)", // The default/"recommended" color
        ],
        "fill-opacity": 1,
    },
};

export const neighborhoodsBordersStyle = {
    id: "neighborhoods-borders",
    type: "line",
    source: "neighborhoods-geojson",
    layout: { visibility: "visible" },
    paint: {
        "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            0.25, // At zoom 7, width is 0.25
            14,
            2, // At zoom 14, width is 2
        ],
        "line-color": [
            "match",
            ["get", "category"], // Check the value of the "class" property
            "top",
            "#688600",
            "unreachable",
            "rgba(0, 0, 0, 0.2)",
            "rgba(115, 139, 37, 1)", // Default value
        ],
    },
};

export const neighborhoodsHoverStyle = {
    id: "neighborhoods-borders-hover",
    type: "line",
    source: "neighborhoods-geojson",
    paint: {
        "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            1, // At zoom 7, width is 1
            14,
            4, // At zoom 14, width is 4
        ],
        "line-color": "#435500",
    },
    // Initially, show no features. Update dynamically on hover
    filter: ["==", ["id"], ""],
};

export const neighborhoodsSelectedStyle = {
    id: "neighborhoods-borders-selected",
    type: "line",
    source: "neighborhoods-geojson",
    paint: {
        "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            1, // At zoom 7, width is 1
            14,
            4, // At zoom 14, width is 4
        ],
        "line-color": "#435500",
    },
    filter: ["==", ["id"], ""], // Initially shows no features
};
