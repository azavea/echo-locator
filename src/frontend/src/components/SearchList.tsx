import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    selectNeighborhoodFilters,
    selectNeighborhoodFilterSuggestions,
    setNeighborhoodFilters,
} from "reducers/neighborhoods/neighborhoodsSlice";
import { getRankedNeighborhoodLists } from "reducers/neighborhoods/neighborhoodsThunk";
import type { FiltersState } from "reducers/neighborhoods/types";
import { useAppDispatch, useAppSelector } from "store/store";

import {
    Autocomplete,
    type Suggestion,
} from "./base/Autocomplete/Autocomplete";

const SearchList = ({ isMobile = false }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const neighborhoodSuggestions = useAppSelector(
        selectNeighborhoodFilterSuggestions
    );
    const filters = useAppSelector(selectNeighborhoodFilters);
    const [filtersBuffer, setFiltersBuffer] = useState<FiltersState | null>(
        null
    );

    useEffect(() => {
        setFiltersBuffer({ ...filters });
    }, [filters]);

    // Recalculate ranking on clear or selection event
    useEffect(() => {
        if (!filtersBuffer) return;
        if (filters.textSearch !== filtersBuffer.textSearch) {
            dispatch(setNeighborhoodFilters(filtersBuffer));
            dispatch(getRankedNeighborhoodLists());
        }
    }, [filtersBuffer]);

    if (!filtersBuffer || !isMobile) {
        return <></>;
    }

    const handleSelect = (s: Suggestion) => {
        setFiltersBuffer({
            ...filtersBuffer,
            textSearch: s.name,
        });
    };

    const handleClearSearch = () =>
        setFiltersBuffer({
            ...filtersBuffer,
            textSearch: "",
        });

    return (
        <Autocomplete
            placeholder={t("searchModalPlaceholder")}
            value={filters.textSearch ?? undefined}
            suggestions={neighborhoodSuggestions}
            onSuggestionCallback={handleSelect}
            onClearCallback={handleClearSearch}
            allowFuzzySearch
        />
    );
};

export default SearchList;
