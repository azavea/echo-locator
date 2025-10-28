import bbox from "@turf/bbox";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-aria-components";
import { useTranslation } from "react-i18next";
import {
    AttributionControl,
    Layer,
    Map as MapContainer,
    Source,
    type MapRef,
} from "react-map-gl/maplibre";

import type { Destination } from "reducers/userProfile/types";

import StartIcon from "assets/icons/start.png";
import { useGetDestinationToNeighborhoodRoute } from "hooks/useGetDestinationToNeighborhoodRoute";
import { createGoogleDirectionsURL } from "libs/getLinkURLs";
import { BOUNDS } from "pages/Discover/Map/constants";
import baseMapTripStyle from "pages/NeighborhoodDetail/Map/baseMapTripStyle.json";
import CustomControlOverlay from "./CustomMapControl";
import TransitDirections from "./TransitDirections";
import {
    routeEndPointStyle,
    routeStartPointStyle,
    routeTransitStyle,
    routeWalkStyle,
} from "./tripLayerStyles";
import { yourTripsStyles } from "./YourTrips.styles";

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
            padding: {
                top: 75,
                right: 50,
                bottom: 50,
                left: 50,
            },
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
                        padding: {
                            top: 75,
                            bottom: 50,
                            right: 50,
                            left: 50,
                        },
                    },
                }}
                onLoad={() => setLoaded(true)}
                interactive={false}
                // baseMapTripStyle builds off of baseMapStyle
                // and includes expanded transit layers: buses + bus stops.
                // Differs from baseMapDetailStyle in that transit layers
                // display at same levels as baseMapStyle.
                // @ts-ignore
                mapStyle={baseMapTripStyle}
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
