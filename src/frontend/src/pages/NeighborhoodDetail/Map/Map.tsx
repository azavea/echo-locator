import { useMemo, useRef } from "react";
import {
    Layer,
    Map as MapContainer,
    Marker,
    Source,
    type MapRef,
} from "react-map-gl/maplibre";
import bbox from "@turf/bbox";

import { useAppSelector } from "store/store";
import { BOUNDS } from "pages/Discover/Map/constants";
import DestinationMarker from "pages/Discover/Map/DestinationMarker";
import baseMapDetailStyle from "./baseMapDetailStyle.json";
import { selectActiveNeighborhoodBounds } from "src/reducers/neighborhoods/neighborhoodsSlice";
import {
    selectActiveDestination,
    selectUserDestinations,
} from "src/reducers/userProfile/userSlice";

const activeNeighborhoodsBoundsStyle = {
    id: "active-neighborhood-borders",
    type: "line",
    source: "active-neighborhood-geojson",
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
};

const Map = () => {
    const activeNeighborhoodBounds = useAppSelector(
        selectActiveNeighborhoodBounds
    );
    const mapRef = useRef<MapRef>(null);

    const destinations = useAppSelector(selectUserDestinations);
    const activeDestination = useAppSelector(selectActiveDestination);

    const bounds: [number, number, number, number] = useMemo(() => {
        if (activeNeighborhoodBounds) {
            const [minLng, minLat, maxLng, maxLat] = bbox(
                activeNeighborhoodBounds.geometry,
                {}
            );
            return [minLng, minLat, maxLng, maxLat];
        }
        return BOUNDS;
    }, [activeNeighborhoodBounds]);

    return (
        <div className="relative h-full w-full">
            <MapContainer
                ref={mapRef}
                initialViewState={{
                    bounds: bounds,
                    fitBoundsOptions: {
                        padding: { top: 50, bottom: 50, right: 50, left: 50 },
                    },
                }}
                interactive={false}
                // baseMapDetailStyle builds off of baseMapStyle
                // and includes expanded transit layers: buses + bus stops
                // @ts-ignore
                mapStyle={baseMapDetailStyle}
            >
                {destinations.map((destination, i) => (
                    <Marker
                        key={`marker-${i}`}
                        longitude={destination.location.position.lon}
                        latitude={destination.location.position.lat}
                    >
                        <DestinationMarker
                            isDefault={
                                destination.location.label === activeDestination
                            }
                        />
                    </Marker>
                ))}
                {activeNeighborhoodBounds && (
                    <Source
                        id="active-neighborhood-geojson"
                        type="geojson"
                        data={activeNeighborhoodBounds}
                    >
                        {/* @ts-ignore */}
                        <Layer {...activeNeighborhoodsBoundsStyle} />
                    </Source>
                )}
            </MapContainer>
        </div>
    );
};

export default Map;
