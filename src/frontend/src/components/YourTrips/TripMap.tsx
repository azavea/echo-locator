import { useEffect, useRef, useState } from "react";
import {
    Layer,
    Map as MapContainer,
    Source,
    type MapRef,
    AttributionControl,
} from "react-map-gl/maplibre";
import bbox from "@turf/bbox";
import { useTranslation } from "react-i18next";
import { Link } from "react-aria-components";

import { useAppSelector } from "store/store";
import { selectNeighborhoodRouteGeoJsons } from "src/reducers/neighborhoods/neighborhoodsSlice";
import type { Destination } from "src/reducers/userProfile/types";
import StartIcon from "assets/icons/start.png";
import CustomControlOverlay from "./CustomMapControl";

import baseMapDetailStyle from "pages/NeighborhoodDetail/Map/baseMapDetailStyle.json";
import {
    routeWalkStyle,
    routeTransitStyle,
    routeStartPointStyle,
    routeEndPointStyle,
} from "./tripLayerStyles";
import { yourTripsStyles } from "./YourTrips.styles";
import { createGoogleDirectionsURL } from "src/libs/getLinkURLs";

const TripMap = ({
    start,
    end,
    className,
}: {
    start: Destination;
    end: string;
    className?: string;
}) => {
    const { t } = useTranslation();
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
            mapRef.current?.fitBounds([minLng, minLat, maxLng, maxLat], {
                padding: { top: 50, right: 50, bottom: 50, left: 50 },
            });
        }
        const loadAndAddImage = async () => {
            if (mapRef.current) {
                const { data: image } =
                    await mapRef.current.loadImage(StartIcon);
                mapRef.current.addImage("point-start-icon", image);
            }
        };
        if (mapRef.current && !mapRef.current.hasImage("point-start-icon")) {
            loadAndAddImage();
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
                attributionControl={false}
            >
                <AttributionControl position="bottom-left" compact={true} />
                <Source
                    id="neighborhood-trip-geojson"
                    type="geojson"
                    data={routeGeoJSON}
                >
                    {/* @ts-ignore */}
                    <Layer {...routeWalkStyle} />
                    {/* @ts-ignore */}
                    <Layer {...routeTransitStyle} />
                    {/* @ts-ignore */}
                    <Layer {...routeStartPointStyle} />
                    {/* @ts-ignore */}
                    <Layer {...routeEndPointStyle} />
                </Source>
                <CustomControlOverlay position="bottom-right">
                    <Link
                        href={createGoogleDirectionsURL(end, start, true, true)}
                        target="_blank"
                        className={styles.directionsLink()}
                        aria-label="Open Google Directions"
                    >
                        {t("yourTrips.openInGoogle")}
                    </Link>
                </CustomControlOverlay>
            </MapContainer>
        </div>
    );
};

export default TripMap;
