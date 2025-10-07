import { useMemo, useRef, useState } from "react";
import {
    Layer,
    Map as MapContainer,
    Marker,
    NavigationControl,
    Source,
    type MapLayerMouseEvent,
    type MapRef,
} from "react-map-gl/maplibre";
import bbox from "@turf/bbox";

import { useAppSelector, type RootState } from "store/store";
import { BOUNDS } from "./constants";
import Legend from "./Legend";
import DestinationMarker from "./DestinationMarker";
import baseMapStyle from "./baseMapStyle.json";
import mapStyles from "./Map.styles";
import {
    neighborhoodsStyle,
    neighborhoodsBordersStyle,
    neighborhoodsHoverStyle,
    neighborhoodsSelectedStyle,
} from "./mapLayerStyles";
import { selectRankedNeighborhoodsLists } from "reducers/neighborhoods/neighborhoodsSlice";
import {
    selectActiveDestination,
    selectUserDestinations,
} from "reducers/userProfile/userSlice";
import Top10Tour from "src/components/Top10Tour/Top10Tour";

interface Props {
    isMobile?: boolean;
    mapDisplay?: boolean;
}

const Map = ({ isMobile = true, mapDisplay = true }: Props) => {
    const [isTop10TourOpen, setIsTop10TourOpen] = useState(true);
    const { neighborhoodBounds } = useAppSelector(
        ({ neighborhoods }: RootState) => neighborhoods
    );
    const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<
        string | number | undefined
    >(undefined);
    const mapRef = useRef<MapRef>(null);
    const { mapContainer } = mapStyles({ isMobile, mapDisplay });

    const { topTen, recommended } = useAppSelector(
        selectRankedNeighborhoodsLists
    );
    const destinations = useAppSelector(selectUserDestinations);
    const activeDestination = useAppSelector(selectActiveDestination);

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
            { padding: 100, duration: 1000 }
        );
    };

    // Desktop-only: highlight neighborhood on hover
    const onMouseMove = (event: MapLayerMouseEvent) => {
        if (isMobile) return;
        const map = mapRef.current?.getMap();
        const feature = event.features && event.features[0];
        if (map && feature?.id) {
            map.setFilter("neighborhoods-borders-hover", [
                "==",
                ["id"],
                feature?.id,
            ]);
        }
    };

    // Desktop-only: highlight neighborhood on hover
    const onMouseLeave = () => {
        if (isMobile) return;
        const map = mapRef.current?.getMap();
        if (map) {
            map.setFilter("neighborhoods-borders-hover", ["==", ["id"], ""]);
        }
    };

    return (
        <div className={mapContainer()}>
            <Top10Tour
                isTop10TourOpen={
                    !!isMobile &&
                    mapDisplay &&
                    isTop10TourOpen &&
                    !!topTen.length
                }
                setIsTop10TourOpen={setIsTop10TourOpen}
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
            </MapContainer>
            <Legend isMobile={isMobile} />
        </div>
    );
};

export default Map;
