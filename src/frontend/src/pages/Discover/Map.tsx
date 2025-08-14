import { Map as MapContainer } from "react-map-gl/maplibre";

import discoverStyles from "./Discover.styles";

const Map = () => {
    const { map } = discoverStyles({ isMobile: false });

    return (
        <div className={map()}>
            <MapContainer
                initialViewState={{
                    longitude: -98.35,
                    latitude: 39.5,
                    zoom: 2,
                }}
                mapStyle="https://demotiles.maplibre.org/style.json"
            />
        </div>
    );
};

export default Map;
