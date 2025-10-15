import bbox from "@turf/bbox";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Layer,
    Map as MapContainer,
    Marker,
    NavigationControl,
    Popup,
    Source,
    type MapLayerMouseEvent,
    type MapRef,
} from "react-map-gl/maplibre";

import {
    selectAreFiltersApplied,
    selectFilterableNeighborhoodBounds,
    selectNeighborhoodFilters,
    selectRankedNeighborhoodsLists,
} from "reducers/neighborhoods/neighborhoodsSlice";
import {
    selectActiveDestination,
    selectUserDestinations,
    selectUserHasViewedStartInstructions,
} from "reducers/userProfile/userSlice";
import { useAppSelector } from "store/store";

import Top10Tour from "components/Top10Tour/Top10Tour";
import Top10TourButton from "components/Top10Tour/Top10TourButton";
import CustomControlOverlay from "components/YourTrips/CustomMapControl";
import baseMapStyle from "./baseMapStyle.json";
import { BOUNDS } from "./constants";
import DestinationMarker from "./DestinationMarker";
import Legend from "./Legend";
import mapStyles from "./Map.styles";
import {
    neighborhoodsBordersStyle,
    neighborhoodsHoverStyle,
    neighborhoodsSelectedStyle,
    neighborhoodsStyle,
} from "./mapLayerStyles";
import NeighborhoodDetailPreviewCard from "./NeighborhoodDetailPreviewCard";
import NeighborhoodDetailPreviewPopup, {
    type DetailPreviewPopupProps,
} from "./NeighborhoodDetailPreviewPopup";

interface Props {
    isMobile?: boolean;
    mapDisplay?: boolean;
}

const Map = ({ isMobile = true, mapDisplay = true }: Props) => {
    const [isTop10TourOpen, setIsTop10TourOpen] = useState(false);
    const [neighborhoodMobilePreview, setNeighborhoodMobilePreview] = useState<
        string | null
    >(null);
    const [neighborhoodDesktopPreview, setNeighborhoodDesktopPreview] =
        useState<DetailPreviewPopupProps | null>(null);
    const hasViewedInstructions = useAppSelector(
        selectUserHasViewedStartInstructions
    );
    const filteredNeighborhoodBounds = useAppSelector(
        selectFilterableNeighborhoodBounds
    );
    const filters = useAppSelector(selectNeighborhoodFilters);
    const isFiltered = useAppSelector(selectAreFiltersApplied);
    const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<
        string | number | undefined
    >(undefined);
    const mapRef = useRef<MapRef>(null);
    const { mapContainer } = mapStyles({ isMobile, mapDisplay });

    const rankedNeighborhoodsLists = useAppSelector(
        selectRankedNeighborhoodsLists
    );
    const { topTen, recommended } = rankedNeighborhoodsLists;
    const destinations = useAppSelector(selectUserDestinations);
    const activeDestination = useAppSelector(selectActiveDestination);

    // Open top ten tour on start
    useEffect(() => {
        !isTop10TourOpen && !hasViewedInstructions && setIsTop10TourOpen(true);
    }, [isTop10TourOpen, hasViewedInstructions]);

    useEffect(() => {
        if (mapRef.current) {
            let [minLng, minLat, maxLng, maxLat] = BOUNDS;
            if (
                isFiltered &&
                filteredNeighborhoodBounds &&
                filteredNeighborhoodBounds.features.length
            ) {
                [minLng, minLat, maxLng, maxLat] = bbox(
                    filteredNeighborhoodBounds
                );
            }
            mapRef.current.fitBounds(
                [
                    [minLng, minLat],
                    [maxLng, maxLat],
                ],
                { duration: 1000 }
            );
        }
    }, [filters, filteredNeighborhoodBounds]);

    const neighborhoodsRanked = useMemo(() => {
        if (!filteredNeighborhoodBounds) return null;
        return {
            ...filteredNeighborhoodBounds,
            features: filteredNeighborhoodBounds.features.map(feature => {
                let category = "unreachable";
                if (topTen.includes(feature.properties.id)) {
                    category = "top";
                }
                if (recommended.includes(feature.properties.id)) {
                    category = "recommended";
                }
                return {
                    ...feature,
                    properties: { ...feature.properties, category },
                    id: feature.properties.id,
                };
            }),
        };
    }, [filteredNeighborhoodBounds, topTen, recommended]);

    const onMapClick = (event: MapLayerMouseEvent) => {
        if (!mapRef.current) return;

        const map = mapRef.current?.getMap();
        const feature = event.features && event.features[0];

        if (!feature) {
            if (map && selectedNeighborhoodId) {
                setSelectedNeighborhoodId(undefined);
                map.setFilter("neighborhoods-borders-selected", [
                    "==",
                    ["id"],
                    "",
                ]);
            }
            return;
        }

        // highlight neighborhood
        const currentId = feature.id;
        if (currentId && currentId === selectedNeighborhoodId) {
            setSelectedNeighborhoodId(undefined);
            map.setFilter("neighborhoods-borders-selected", ["==", ["id"], ""]);
            return;
        }
        if (currentId) {
            setSelectedNeighborhoodId(currentId);
            map.setFilter("neighborhoods-borders-selected", [
                "==",
                ["id"],
                currentId,
            ]);
        }

        // zoom to neighborhood
        const [minLng, minLat, maxLng, maxLat] = bbox(feature.geometry);
        mapRef.current.fitBounds(
            [
                [minLng, minLat],
                [maxLng, maxLat],
            ],
            { padding: 100, duration: 1000 }
        );

        // Open neighborhood details preview card.
        // Pauses Top 10 Tour if opened to view preview
        if (isMobile) {
            if (isTop10TourOpen) {
                setIsTop10TourOpen(false);
            }
            setNeighborhoodMobilePreview(feature.properties.zipcode);
        }
    };

    // Desktop-only: highlight neighborhood on hover &
    // display neighborhood detail preview popup anchored at cursor
    const onMouseMove = (event: MapLayerMouseEvent) => {
        if (isMobile) return;
        const map = mapRef.current?.getMap();
        const { features, lngLat } = event;
        const feature = features && features[0];
        if (map && feature?.id) {
            map.setFilter("neighborhoods-borders-hover", [
                "==",
                ["id"],
                feature?.id,
            ]);
            setNeighborhoodDesktopPreview({
                longitude: lngLat.lng,
                latitude: lngLat.lat,
                zipcode: feature?.properties.zipcode,
            });
        }
    };

    // Desktop-only: highlight neighborhood on hover &
    // remove neighborhood detail preview popup
    const onMouseLeave = () => {
        if (isMobile) return;
        const map = mapRef.current?.getMap();
        if (map) {
            map.setFilter("neighborhoods-borders-hover", ["==", ["id"], ""]);
            setNeighborhoodDesktopPreview(null);
        }
    };

    const manualSelectCallback = (neighborhoodId?: string) => {
        if (!mapRef.current) return;
        const map = mapRef.current?.getMap();

        const feature = filteredNeighborhoodBounds?.features.find(
            b => b.properties.id === neighborhoodId
        );

        if (map && neighborhoodId) {
            setSelectedNeighborhoodId(neighborhoodId);
            map.setFilter("neighborhoods-borders-selected", [
                "==",
                ["get", "id"],
                neighborhoodId,
            ]);
        } else {
            setSelectedNeighborhoodId(undefined);
            map.setFilter("neighborhoods-borders-selected", ["==", ["id"], ""]);
        }

        // zoom to neighborhood or reset on tour exit
        const [minLng, minLat, maxLng, maxLat] = feature
            ? bbox(feature.geometry)
            : BOUNDS;
        mapRef.current.fitBounds(
            [
                [minLng, minLat],
                [maxLng, maxLat],
            ],
            { padding: feature ? 100 : 0, duration: 1000 }
        );
    };

    // On mobile preview card close:
    // Remove neighborhood detail preview card & reset map bounds
    const handleNeighborhoodPreviewClose = () => {
        manualSelectCallback();
        setNeighborhoodMobilePreview(null);
    };

    return (
        <div className={mapContainer()}>
            <Top10Tour
                isTop10TourOpen={isMobile && isTop10TourOpen}
                setIsTop10TourOpen={setIsTop10TourOpen}
                tourStopCallback={manualSelectCallback}
                showInstructions={!hasViewedInstructions}
            />
            <NeighborhoodDetailPreviewCard
                isPreviewOpen={isMobile && !!neighborhoodMobilePreview}
                onPreviewOpenChange={handleNeighborhoodPreviewClose}
                zipcode={neighborhoodMobilePreview}
            />
            <MapContainer
                ref={mapRef}
                initialViewState={{
                    bounds: BOUNDS,
                }}
                onClick={onMapClick}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                interactiveLayerIds={["neighborhoods", "neighborhoods-borders"]}
                cursor="pointer"
                // @ts-ignore
                mapStyle={baseMapStyle}
            >
                <NavigationControl
                    position={isMobile ? "top-right" : "top-left"}
                    showCompass={false}
                />
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
                {neighborhoodsRanked !== null && (
                    <Source
                        id="neighborhoods-geojson"
                        type="geojson"
                        data={neighborhoodsRanked}
                    >
                        {/* The parameter beforeId takes the ID of an existing layer to
                    insert the new layer before, resulting in the new layer
                    appearing visually beneath the existing layer. */}
                        {/* @ts-ignore */}
                        <Layer {...neighborhoodsStyle} beforeId="water" />
                        {/* @ts-ignore */}
                        <Layer
                            {...neighborhoodsBordersStyle}
                            beforeId="water_name"
                        />
                        {/* @ts-ignore */}
                        <Layer {...neighborhoodsHoverStyle} />
                        {/* @ts-ignore */}
                        <Layer {...neighborhoodsSelectedStyle} />
                    </Source>
                )}
                <CustomControlOverlay position="top-left">
                    <Top10TourButton
                        isVisible={
                            isMobile && !isTop10TourOpen && !!topTen.length
                        }
                        onClickCallback={() => {
                            setIsTop10TourOpen(true);
                            setNeighborhoodMobilePreview(null);
                        }}
                    />
                </CustomControlOverlay>
                {neighborhoodDesktopPreview && (
                    <Popup
                        longitude={neighborhoodDesktopPreview.longitude}
                        latitude={neighborhoodDesktopPreview.latitude}
                        closeButton={false}
                        closeOnClick={false}
                        anchor="bottom-left"
                        className="map-popup-style-override"
                    >
                        <NeighborhoodDetailPreviewPopup
                            {...neighborhoodDesktopPreview}
                        />
                    </Popup>
                )}
            </MapContainer>
            <Legend isMobile={isMobile} />
        </div>
    );
};

export default Map;
