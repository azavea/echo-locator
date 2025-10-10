import { useEffect, useState } from "react";
import {
    CheckboxGroup as AriaCheckboxGroup,
    Dialog,
    Heading,
} from "react-aria-components";

import {
    selectIsEditFiltersOpen,
    setIsEditFiltersOpen,
} from "src/reducers/modalsDisplay/modalsDisplaySlice";
import {
    selectNeighborhoodFilters,
    setNeighborhoodFilters,
} from "src/reducers/neighborhoods/neighborhoodsSlice";
import { getRankedNeighborhoodLists } from "src/reducers/neighborhoods/neighborhoodsThunk";
import type { FiltersState } from "src/reducers/neighborhoods/types";
import { useAppDispatch, useAppSelector } from "store/store";

import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import { NEIGHBORHOOD_REGIONS } from "src/constants";
import Checkbox from "./base/Checkbox/Checkbox";
import ModalCloseButton from "./ModalCloseButton";

const REGION_KEY_STYLING: Record<string, Record<string, string>> = {
    "North Shore": {
        keyColor: "#0977D7",
        keyLabel: "A",
        keyTextColor: "white",
    },
    "Metro West": { keyColor: "#D81B60", keyLabel: "B", keyTextColor: "white" },
    "Boston and Greater Boston": {
        keyColor: "#431307",
        keyLabel: "C",
        keyTextColor: "white",
    },
    "South Shore": {
        keyColor: "#FFC107",
        keyLabel: "D",
        keyTextColor: "black",
    },
};

const EditFiltersModal = () => {
    const dispatch = useAppDispatch();
    const modalOpen = useAppSelector(selectIsEditFiltersOpen);
    const [filtersBuffer, setFiltersBuffer] = useState<FiltersState | null>(
        null
    );

    const filters = useAppSelector(selectNeighborhoodFilters);

    useEffect(() => {
        setFiltersBuffer({ ...filters });
    }, []);

    if (!filtersBuffer) {
        return <></>;
    }

    const regionsFilterSelected = (isSelected: boolean, region: string) => {
        const updatedRegionsFilter = filtersBuffer.regions
            ? [...filtersBuffer.regions]
            : [];
        if (isSelected) {
            updatedRegionsFilter.push(region);
        } else {
            const regionIndex = updatedRegionsFilter.indexOf(region);
            if (regionIndex > -1) {
                updatedRegionsFilter.splice(regionIndex, 1);
            }
        }
        setFiltersBuffer({
            ...filtersBuffer,
            regions: updatedRegionsFilter,
        });
    };

    const onOpenChange = (isOpen: boolean) => {
        dispatch(setNeighborhoodFilters(filtersBuffer));
        dispatch(setIsEditFiltersOpen(isOpen));
        // Recalculate ranking on filters close
        if (
            isOpen == false &&
            (filters.ecc !== filtersBuffer.ecc ||
                filters.regions.length !== filtersBuffer.regions.length)
        ) {
            dispatch(getRankedNeighborhoodLists());
        }
    };

    return (
        <ModalOverlay
            isDismissable
            isMobile
            isOpen={modalOpen}
            onOpenChange={onOpenChange}
        >
            <Modal size="large">
                <Dialog>
                    <Heading slot="title">Profile</Heading>
                    <ModalCloseButton onPress={() => onOpenChange(false)} />
                    <div>
                        <AriaCheckboxGroup defaultValue={filtersBuffer.regions}>
                            {NEIGHBORHOOD_REGIONS.map((name, index) => (
                                <Checkbox
                                    value={name}
                                    onChange={isSelected =>
                                        regionsFilterSelected(isSelected, name)
                                    }
                                    description={`Select to include neighborhoods in the ${name} region`}
                                    key={index}
                                >
                                    <div>
                                        <div>
                                            {REGION_KEY_STYLING[name].keyLabel}
                                        </div>
                                        <p>{name}</p>
                                    </div>
                                </Checkbox>
                            ))}
                        </AriaCheckboxGroup>
                    </div>
                    <div>
                        <Checkbox
                            isSelected={filtersBuffer.ecc}
                            onChange={isSelected =>
                                setFiltersBuffer({
                                    ...filtersBuffer,
                                    ecc: isSelected,
                                })
                            }
                            description={`Select to only recommend neighborhoods that are Expanded Choice Communities (ECC)`}
                        >
                            ecc
                        </Checkbox>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default EditFiltersModal;
