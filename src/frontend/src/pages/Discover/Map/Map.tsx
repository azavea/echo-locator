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
import { useAppSelector, type RootState } from "store/store";

import Top10Tour from "components/Top10Tour/Top10Tour";
import Top10TourButton from "components/Top10Tour/Top10TourButton";
import CustomControlOverlay from "components/YourTrips/CustomMapControl";
import type { FilterSpecification } from "maplibre-gl";
import baseMapStyle from "./baseMapStyle.json";
import { BOUNDS } from "./constants";
import DestinationMarker from "./DestinationMarker";
import Legend from "./Legend";
import mapStyles from "./Map.styles";
import {
    neighborhoodsBordersStyle,
    neighborhoodsFilteredStyle,
    neighborhoodsHoverStyle,
    neighborhoodsSelectedStyle,
    neighborhoodsStyle,
} from "./mapLayerStyles";
import MapSearch from "./MapSearch";
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
    const [outsideTourStopTriggered, setOutsideTourStopTriggered] =
        useState(false);
    const [neighborhoodMobilePreview, setNeighborhoodMobilePreview] = useState<
        string | null
    >(null);
    const [neighborhoodDesktopPreview, setNeighborhoodDesktopPreview] =
        useState<DetailPreviewPopupProps | null>(null);
    const hasViewedInstructions = useAppSelector(
        selectUserHasViewedStartInstructions
    );
    const { neighborhoodBounds } = useAppSelector(
        ({ neighborhoods }: RootState) => neighborhoods
    );
    // filteredNeighborhoodBounds used for map styling/fit bounds on filter change
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

    // Account for bottom neighborhood preview card display on mobile
    const SELECT_BOUNDS_PADDING = isMobile
        ? { top: 100, bottom: 225, left: 100, right: 100 }
        : 100;

    const filteredBounds: [number, number, number, number] = useMemo(() => {
        let [minLng, minLat, maxLng, maxLat] = BOUNDS;
        if (
            isFiltered &&
            filteredNeighborhoodBounds &&
            filteredNeighborhoodBounds.features.length
        ) {
            [minLng, minLat, maxLng, maxLat] = bbox(filteredNeighborhoodBounds);
        }
        return [minLng, minLat, maxLng, maxLat];
    }, [isFiltered, filteredNeighborhoodBounds]);

    // Open top ten tour on start
    useEffect(() => {
        !isTop10TourOpen && !hasViewedInstructions && setIsTop10TourOpen(true);
    }, [isTop10TourOpen, hasViewedInstructions]);

    useEffect(() => {
        // Reset Top 10 tour on filter change
        setOutsideTourStopTriggered(true);
        // If text search filter, style as if clicked.
        // All filters, fit bounds to filtered neighborhoods.
        if (mapRef.current) {
            let filter: FilterSpecification = ["==", ["id"], ""];
            if (filters.textSearch?.trim() && filteredNeighborhoodBounds) {
                const filteredZipCodes =
                    filteredNeighborhoodBounds.features.map(
                        f => f.properties.id
                    );
                filter = ["in", "id", ...filteredZipCodes];
            }

            mapRef.current
                ?.getMap()
                .setFilter("neighborhoods-borders-filtered", filter);
            const [minLng, minLat, maxLng, maxLat] = filteredBounds;
            mapRef.current.fitBounds(
                [
                    [minLng, minLat],
                    [maxLng, maxLat],
                ],
                { padding: 20, duration: 1000 }
            );
        }
    }, [filters, filteredNeighborhoodBounds]);

    // Display all neighborhood features on map
    const neighborhoodsRanked = useMemo(() => {
        if (!neighborhoodBounds) return null;
        return {
            ...neighborhoodBounds,
            features: neighborhoodBounds.features.map(feature => {
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
    }, [neighborhoodBounds, topTen, recommended]);

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
            { padding: SELECT_BOUNDS_PADDING, duration: 1000 }
        );

        // Open neighborhood details preview card.
        // Pauses Top 10 Tour if opened to view preview
        if (isMobile) {
            if (isTop10TourOpen) {
                setOutsideTourStopTriggered(true);
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

        const feature = neighborhoodBounds?.features.find(
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
            : filteredBounds;
        mapRef.current.fitBounds(
            [
                [minLng, minLat],
                [maxLng, maxLat],
            ],
            { padding: feature ? SELECT_BOUNDS_PADDING : 0, duration: 1000 }
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
                outsideTourStopTriggered={outsideTourStopTriggered}
                setOutsideTourStopTriggered={setOutsideTourStopTriggered}
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
                    bounds: filteredBounds,
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
                        {/* @ts-ignore */}
                        <Layer {...neighborhoodsFilteredStyle} />
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
                <CustomControlOverlay
                    position={isMobile ? "top-right" : "top-left"}
                >
                    <MapSearch />
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
