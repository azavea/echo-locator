import axios from "axios";
import type { FeatureCollection } from "geojson";

import { BOUNDS } from "pages/Discover/Map/constants";
import { MAPBOX_GEOCODING_API_BASE_URL } from "src/constants";
import type { LanguageKey } from "src/enums";

// Mapbox Geocoding API endpoint for forward geocoding with search text input
export const getAddressSuggestions = async (
    address: string,
    signal: AbortSignal,
    language: LanguageKey
): Promise<FeatureCollection> => {
    const params = new URLSearchParams({
        q: address,
        autocomplete: "true",
        limit: "5",
        bbox: BOUNDS.join(","),
        types: "address",
        language: language,
        access_token: import.meta.env.VITE_MAPBOX_API_TOKEN,
    });

    const response = await axios.get(
        `${MAPBOX_GEOCODING_API_BASE_URL}?${params.toString()}`,
        { signal }
    );

    return response.data;
};
