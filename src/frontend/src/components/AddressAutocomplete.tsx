import { throttle } from "lodash";
import { useCallback, useRef } from "react";
import { useParams } from "react-router";

import { getAddressSuggestions } from "api/addressSearch";
import {
    Autocomplete,
    type Suggestion,
} from "components/base/Autocomplete/Autocomplete";
import type { Point } from "geojson";
import { Language, type LanguageKey } from "src/enums";

const RATE_LIMIT = 500;

const AddressAutocomplete = ({
    placeholder,
    onClearCallback,
    onSuggestionCallback,
}: {
    placeholder: string;
    onClearCallback: () => void;
    onSuggestionCallback: (suggestion: Suggestion) => void;
}) => {
    const { lang } = useParams<{ lang: LanguageKey | undefined }>();
    const abortRef = useRef<AbortController | null>(null);
    const cacheRef = useRef<Record<string, Suggestion[]>>({});

    // When autocomplete is enabled in forward geocoding query,
    // each user keystroke counts as one request to the Geocoding API.
    // Implement strategies from old site to reduce requests.
    // https://github.com/azavea/echo-locator/blob/master/taui/src/components/geocoder.js#L81-L105
    const fetchSuggestions = useCallback(
        async (query: string, signal: AbortSignal) => {
            if (!query.trim()) return [];
            // Return cached result if available
            if (cacheRef.current[query]) {
                return cacheRef.current[query];
            }

            // Abort previous request
            if (abortRef.current) {
                abortRef.current.abort();
            }

            const controller = new AbortController();
            abortRef.current = controller;

            const { features } = await getAddressSuggestions(
                query,
                signal,
                lang ?? Language.EN
            );
            return features
                .map(f => {
                    if (!f.properties && f.geometry.type !== "Point")
                        return null;
                    return {
                        name: f.properties?.full_address,
                        geometry: f.geometry as Point,
                    };
                })
                .filter(f => f !== null);
        },
        []
    );

    const throttledFetch = throttle(fetchSuggestions, RATE_LIMIT);

    return (
        <Autocomplete
            placeholder={placeholder}
            loadAsyncSuggestions={throttledFetch}
            onClearCallback={onClearCallback}
            onSuggestionCallback={onSuggestionCallback}
        />
    );
};

export default AddressAutocomplete;
