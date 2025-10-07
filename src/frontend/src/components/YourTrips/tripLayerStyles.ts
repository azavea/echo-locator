// Trip segment styling from latest Taui v3: "https://github.com/conveyal/taui/blob/dev/src/map/geojson-routes.js
// ATTR: Taui by Conveyal, included under the MIT license (https://github.com/conveyal/taui/blob/dev/LICENSE)

export const routeWalkStyle = {
    id: "route-walk",
    type: "line",
    source: "neighborhood-trip-geojson",
    paint: {
        "line-color": "#000",
        "line-dasharray": [1, 1],
        "line-width": 5,
        "line-opacity": 0.6,
    },
    filter: ["==", "mode", "WALK"],
};

export const routeTransitStyle = {
    id: "route-transit",
    type: "line",
    source: "neighborhood-trip-geojson",
    paint: {
        "line-color": ["get", "routeColor"],
        "line-width": 10,
        "line-opacity": 0.6,
    },
    filter: ["all", ["!=", "mode", "WALK"], ["==", "$type", "LineString"]],
};

export const routeStartPointStyle = {
    id: "point-start",
    type: "symbol",
    source: "neighborhood-trip-geojson",
    filter: ["==", ["get", "name"], "start"],
    layout: {
        "icon-image": "point-start-icon",
        "icon-size": 0.5,
        "icon-anchor": "bottom",
        "icon-allow-overlap": true,
    },
};

export const routeEndPointStyle = {
    id: "point-end",
    type: "circle",
    source: "neighborhood-trip-geojson",
    filter: ["==", ["get", "name"], "end"],
    paint: {
        "circle-radius": 7,
        "circle-color": "#000000",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#FFFFFF",
    },
};
