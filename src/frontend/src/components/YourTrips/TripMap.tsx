import { useEffect, useRef, useState } from "react";
import {
    Layer,
    Map as MapContainer,
    Source,
    type MapRef,
} from "react-map-gl/maplibre";
import bbox from "@turf/bbox";

import { useAppSelector } from "store/store";
import { selectNeighborhoodRouteGeoJsons } from "src/reducers/neighborhoods/neighborhoodsSlice";
import type { Destination } from "src/reducers/userProfile/types";

import baseMapDetailStyle from "pages/NeighborhoodDetail/Map/baseMapDetailStyle.json";
import { routeWalkStyle, routeTransitStyle } from "./tripLayerStyles";
import { yourTripsStyles } from "./YourTrips.styles";
const TripMap = ({
    start,
    className,
}: {
    start: Destination;
    className?: string;
}) => {
    const styles = yourTripsStyles();
    const mapRef = useRef<MapRef>(null);
    const [loaded, setLoaded] = useState(false);

    const routeGeoJSONsByDestination = useAppSelector(
        selectNeighborhoodRouteGeoJsons
    );

    // TODO refactor for compare page to get for any neighborhood
    // Right now assumes start always destination
    // and end is always active neighborhood
    const routeGeoJSON =
        routeGeoJSONsByDestination &&
        routeGeoJSONsByDestination[start.location.label];

    if (!routeGeoJSON) {
        return (
            <div className={`${className} relative h-[250px]`}>
                <div className={styles.loadingWrapper()}>
                    <div className={styles.loadingSpinner()} />
                </div>
            </div>
        );
    }

    const [minLng, minLat, maxLng, maxLat] = bbox(routeGeoJSON, {});

    useEffect(() => {
        if (loaded && mapRef.current) {
            mapRef.current.fitBounds([minLng, minLat, maxLng, maxLat], {
                padding: { top: 50, right: 50, bottom: 50, left: 50 },
            });
        }
    }, [loaded]);

    useEffect(() => {
        mapRef.current?.fitBounds([minLng, minLat, maxLng, maxLat], {
            padding: { top: 50, right: 50, bottom: 50, left: 50 },
        });
    }, [minLng, minLat, maxLng, maxLat]);

    return (
        <div className={`${className} relative h-[250px] w-full`}>
            <MapContainer
                ref={mapRef}
                initialViewState={{
                    bounds: [minLng, minLat, maxLng, maxLat],
                }}
                onLoad={() => setLoaded(true)}
                interactive={false}
                // @ts-ignore
                mapStyle={baseMapDetailStyle}
            >
                <Source
                    id="neighborhood-trip-geojson"
                    type="geojson"
                    data={routeGeoJSON}
                >
                    {/* @ts-ignore */}
                    <Layer {...routeWalkStyle} />
                    {/* @ts-ignore */}
                    <Layer {...routeTransitStyle} />
                </Source>
            </MapContainer>
        </div>
    );
};

export default TripMap;
