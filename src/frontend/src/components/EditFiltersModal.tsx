import { useEffect, useState } from "react";
import {
    CheckboxGroup as AriaCheckboxGroup,
    Dialog,
    Heading,
    Link,
} from "react-aria-components";
import { useTranslation } from "react-i18next";

import {
    selectIsEditFiltersOpen,
    setIsEditFiltersOpen,
} from "reducers/modalsDisplay/modalsDisplaySlice";
import {
    selectNeighborhoodFilters,
    setNeighborhoodFilters,
} from "reducers/neighborhoods/neighborhoodsSlice";
import { getRankedNeighborhoodLists } from "reducers/neighborhoods/neighborhoodsThunk";
import type { FiltersState } from "reducers/neighborhoods/types";
import { useAppDispatch, useAppSelector } from "store/store";

import ArrowIcon from "assets/icons/arrow-full-right.svg?react";
import Button from "components/base/Button/Button";
import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import { BHA_URL, NEIGHBORHOOD_REGIONS, PROTONK_URL } from "src/constants";
import { selectActiveMode } from "src/reducers/networks/networksSlice";
import { selectUserBedroomCount } from "src/reducers/userProfile/userSlice";
import Checkbox from "./base/Checkbox/Checkbox";
import { LicensedImage } from "./CCLicensedImage";
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

const modalHeadingClassName = "text-lg font-bold text-gray-900";

const EditFiltersModal = ({ isMobile }: { isMobile?: boolean }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const modalOpen = useAppSelector(selectIsEditFiltersOpen);
    const bedrooms = useAppSelector(selectUserBedroomCount);
    const mode = useAppSelector(selectActiveMode);
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
            <Modal size="medium" className="p-5 max-h-full overflow-y-scroll">
                <Dialog className="flex flex-col gap-6">
                    <Heading slot="title" className={modalHeadingClassName}>
                        {t("filterModal.dialogHeading")}
                    </Heading>
                    <ModalCloseButton onPress={() => onOpenChange(false)} />
                    <div className=" flex flex-col gap-2">
                        <h2 className={modalHeadingClassName}>
                            {t("filterModal.profileEditHeading")}
                        </h2>
                        <div className="w-full flex flex-row justify-between p-4 py-3 rounded-2xl items-center bg-gray-100">
                            <p>
                                {bedrooms} {t("filterModal.bedroom")}・
                                {t(`transitModesSimple.${mode}`)}
                            </p>
                            <Button
                                variant="outline"
                                size="small"
                                className="font-normal text-gray-800"
                                onPress={() => {
                                    /* TODO: Open edit trips */
                                }}
                            >
                                {t("filterModal.edit")}
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className={modalHeadingClassName}>
                                {t("filterModal.regionsFilterHeading")}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {t("filterModal.regionsFilterSubHeading")}
                            </p>
                        </div>
                        <LicensedImage
                            image={
                                isMobile
                                    ? "/regions-map-mobile.png"
                                    : "/regions-map-desktop.png"
                            }
                            customImageClassName="w-full"
                            customCaption={
                                <>
                                    CC BY-SA 3.0. $
                                    {t("filterModal.regionMapCaption")}{" "}
                                    <Link
                                        href={PROTONK_URL}
                                        target="_blank"
                                        className="underline"
                                    >
                                        Protonk.
                                    </Link>
                                </>
                            }
                        />
                        <AriaCheckboxGroup
                            defaultValue={filtersBuffer.regions}
                            aria-label={t("filterModal.regionsFilterLabel")}
                            className="flex flex-col gap-5"
                        >
                            {NEIGHBORHOOD_REGIONS.map((name, index) => (
                                <Checkbox
                                    value={name}
                                    onChange={isSelected =>
                                        regionsFilterSelected(isSelected, name)
                                    }
                                    key={index}
                                    size="small"
                                    variant="ghost"
                                >
                                    <div className="flex flex-row gap-3">
                                        <div
                                            className="rounded-full flex w-6 h-6 flex-col items-center text-sm font-bold justify-around"
                                            style={{
                                                backgroundColor:
                                                    REGION_KEY_STYLING[name]
                                                        .keyColor,
                                                color: REGION_KEY_STYLING[name]
                                                    .keyTextColor,
                                            }}
                                        >
                                            {REGION_KEY_STYLING[name].keyLabel}
                                        </div>
                                        <p>{name}</p>
                                    </div>
                                </Checkbox>
                            ))}
                        </AriaCheckboxGroup>
                    </div>
                    <div className="flex flex-col gap-5">
                        <h2 className={modalHeadingClassName}>
                            {t("filterModal.otherFilterHeading")}
                        </h2>
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
                                footer={
                                    <Link
                                        href={BHA_URL}
                                        className="text-sm text-gray-600 flex flex-row gap-2 items-center"
                                    >
                                        {t("filterModal.echoLink")}
                                        <ArrowIcon className="text-xs text-gray-400 font-light" />
                                    </Link>
                                }
                                size="small"
                                variant="ghost"
                            >
                                <h3 className="text-[17px] font-normal">
                                    {t("filterModal.eccFilter")}
                                </h3>
                            </Checkbox>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export default EditFiltersModal;
