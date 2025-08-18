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
import { BOUNDS, top, last, destinations } from "./constants";
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

interface Props {
    isMobile?: boolean;
}

const Map = ({ isMobile = true }: Props) => {
    const { neighborhoodBounds } = useAppSelector(
        ({ neighborhoods }: RootState) => neighborhoods
    );
    const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<
        string | number | undefined
    >(undefined);
    const mapRef = useRef<MapRef>(null);
    const { mapContainer } = mapStyles({ isMobile });

    // TODO: read rankings from store
    const neighborhoodsRanked = useMemo(() => {
        if (!neighborhoodBounds) return null;
        return {
            ...neighborhoodBounds,
            features: neighborhoodBounds.features.map(feature => {
                let category = "recommended";
                if (top.includes(feature.properties.id)) {
                    category = "top";
                }
                if (last.includes(feature.properties.id)) {
                    category = "unreachable";
                }
                return {
                    ...feature,
                    properties: { ...feature.properties, category },
                    id: feature.properties.id,
                };
            }),
        };
    }, [neighborhoodBounds]);

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

    return neighborhoodsRanked ? (
        <div className={mapContainer()}>
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
                {/* TODO: read destinations from user profile */}
                {destinations.map(destination => (
                    <Marker
                        key={`marker-${destination.id}`}
                        longitude={destination.longitude}
                        latitude={destination.latitude}
                    >
                        <DestinationMarker isDefault={destination.isDefault} />
                    </Marker>
                ))}
                <Source
                    id="neighborhoods-geojson"
                    type="geojson"
                    data={neighborhoodsRanked}
                >
                    {/* @ts-ignore */}
                    <Layer {...neighborhoodsStyle} />
                    {/* @ts-ignore */}
                    <Layer {...neighborhoodsBordersStyle} />
                    {/* @ts-ignore */}
                    <Layer {...neighborhoodsHoverStyle} />
                    {/* @ts-ignore */}
                    <Layer {...neighborhoodsSelectedStyle} />
                </Source>
            </MapContainer>
            <Legend isMobile={isMobile} />
        </div>
    ) : (
        <></>
    );
};

export default Map;
