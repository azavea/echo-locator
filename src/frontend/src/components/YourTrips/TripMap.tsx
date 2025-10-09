import { useEffect, useMemo, useRef, useState } from "react";
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

import type { Destination } from "reducers/userProfile/types";
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
import { createGoogleDirectionsURL } from "libs/getLinkURLs";
import { useGetDestinationToNeighborhoodRoute } from "hooks/useGetDestinationToNeighborhoodRoute";
import { BOUNDS } from "pages/Discover/Map/constants";
import TransitDirections from "./TransitDirections";

const TripMap = ({
    start,
    end,
    isTransit,
    className,
}: {
    start: Destination;
    end: string;
    isTransit?: boolean;
    className?: string;
}) => {
    const { t } = useTranslation();
    const styles = yourTripsStyles();
    const mapRef = useRef<MapRef>(null);
    const [loaded, setLoaded] = useState(false);

    if (!isTransit) {
        return <></>;
    }

    const routeGeoJSON = useGetDestinationToNeighborhoodRoute(start, end);

    if (!routeGeoJSON) {
        return (
            <div className={`${className} relative h-[250px]`}>
                <div className={styles.loadingWrapper()}>
                    <div className={styles.loadingSpinner()} />
                </div>
            </div>
        );
    }

    const bounds: [number, number, number, number] = useMemo(() => {
        if (routeGeoJSON) {
            const [minLng, minLat, maxLng, maxLat] = bbox(routeGeoJSON, {});
            return [minLng, minLat, maxLng, maxLat];
        }
        return BOUNDS;
    }, [routeGeoJSON, start, end]);

    useEffect(() => {
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
        mapRef.current?.fitBounds(bounds, {
            padding: { top: 50, right: 50, bottom: 50, left: 50 },
        });
    }, [bounds]);

    return (
        <div
            className={`${className} relative h-[250px] w-full rounded-md overflow-clip border-gray-300 border sm:mb-0.5`}
        >
            <MapContainer
                ref={mapRef}
                initialViewState={{
                    bounds: bounds,
                    fitBoundsOptions: {
                        padding: { top: 50, bottom: 50, right: 50, left: 50 },
                    },
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
                <CustomControlOverlay position="top-left">
                    <TransitDirections start={start} end={end} />
                </CustomControlOverlay>
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
