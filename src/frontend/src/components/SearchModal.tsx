import { useEffect, useState } from "react";
import { Dialog, Heading } from "react-aria-components";
import { useTranslation } from "react-i18next";

import {
    selectIsSearchModalOpen,
    setIsSearchModalOpen,
} from "reducers/modalsDisplay/modalsDisplaySlice";
import {
    selectNeighborhoodFilters,
    selectNeighborhoodFilterSuggestions,
    setNeighborhoodFilters,
} from "reducers/neighborhoods/neighborhoodsSlice";
import { getRankedNeighborhoodLists } from "reducers/neighborhoods/neighborhoodsThunk";
import type { FiltersState } from "reducers/neighborhoods/types";
import { useAppDispatch, useAppSelector } from "store/store";

import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import ModalCloseButton from "./ModalCloseButton";
import {
    Autocomplete,
    type Suggestion,
} from "./base/Autocomplete/Autocomplete";

const SearchModal = ({ isMobile = false }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const modalOpen = useAppSelector(selectIsSearchModalOpen);
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

    // Reset & recalculate ranking on clear to get new list of suggestions
    useEffect(() => {
        if (
            filtersBuffer &&
            filters.textSearch?.length &&
            !filtersBuffer.textSearch?.length
        ) {
            dispatch(setNeighborhoodFilters(filtersBuffer));
            dispatch(getRankedNeighborhoodLists());
        }
    }, [filtersBuffer]);

    if (!filtersBuffer) {
        return <></>;
    }

    const handleSearch = (s: Suggestion) =>
        setFiltersBuffer({
            ...filtersBuffer,
            textSearch: s.name,
        });

    const handleClearSearch = () =>
        setFiltersBuffer({
            ...filtersBuffer,
            textSearch: "",
        });

    const onOpenChange = (isOpen: boolean) => {
        dispatch(setNeighborhoodFilters(filtersBuffer));
        dispatch(setIsSearchModalOpen(isOpen));
        // Recalculate ranking on filters close
        if (
            isOpen == false &&
            filters.textSearch !== filtersBuffer.textSearch
        ) {
            dispatch(getRankedNeighborhoodLists());
        }
    };

    return (
        <ModalOverlay
            isDismissable
            isMobile={isMobile}
            isOpen={modalOpen}
            onOpenChange={onOpenChange}
        >
            <Modal
                size="medium"
                className="p-5 max-h-full overflow-y-scroll -translate-y-32"
            >
                <Dialog className="flex flex-col gap-6">
                    <Heading
                        slot="title"
                        className="text-gray-900 text-xl font-bold"
                    >
                        {t("searchModal")}
                    </Heading>
                    <ModalCloseButton onPress={() => onOpenChange(false)} />
                    <div className="flex flex-col gap-3">
                        <h2 className="text-gray-900 text-lg font-bold">
                            {t("searchModalDescription")}
                        </h2>
                        <Autocomplete
                            placeholder={t("searchModalPlaceholder")}
                            value={filters.textSearch ?? undefined}
                            suggestions={neighborhoodSuggestions}
                            onSuggestionCallback={handleSearch}
                            onClearCallback={handleClearSearch}
                            allowFuzzySearch
                        />
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default SearchModal;
