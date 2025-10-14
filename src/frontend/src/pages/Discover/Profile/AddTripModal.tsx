import { useState } from "react";
import { GridList, GridListItem, type Selection } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type { Destination } from "reducers/userProfile/types";
import { Place, type PlaceKey } from "src/enums";

import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import WizardStep from "components/Wizard/WizardStep";
import { Autocomplete } from "src/components/base/Autocomplete/Autocomplete";

// TODO: Remove following async Mapbox Search API Fetch
// Example from autocomplete suggestions docs: https://docs.mapbox.com/api/search/search-box/#example-request-get-suggested-results
const MAPBOX_EMPTY_SUGGESTIONS = {
    suggestions: [
        {
            name: "Michigan Stadium",
            mapbox_id: "Example ID",
            feature_type: "poi",
            address: "1201 S Main St",
            full_address:
                "1201 S Main St, Ann Arbor, Michigan 48104, United States of America",
            place_formatted:
                "Ann Arbor, Michigan 48104, United States of America",
            context: {
                country: {
                    name: "United States of America",
                    country_code: "US",
                    country_code_alpha_3: "USA",
                },
                region: {
                    name: "Michigan",
                    region_code: "MI",
                    region_code_full: "US-MI",
                },
                postcode: { name: "48104" },
                place: { name: "Ann Arbor" },
                neighborhood: { name: "South Main" },
                street: { name: "s main st" },
            },
            language: "en",
            maki: "marker",
            poi_category: ["track", "sports"],
            poi_category_ids: ["track", "sports"],
            external_ids: {
                safegraph: "Example ID",
                foursquare: "Example ID",
            },
            metadata: {},
        },
    ],
    attribution:
        "© 2023 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service. (https://www.mapbox.com/about/maps/)",
};

const EMPTY_DESTINATION = {
    location: {
        label: "",
        position: {
            lat: 0,
            lon: 0,
        },
    },
    primary: false,
    purpose: "",
};

// AddTripsModal is stylistically a wizard step,
// but functionally a modal only called within the StepTrips component.
// Custom handleBack and handleNext does not affect edit trips wizard progess.
const AddTripModal = ({
    isModalOpen,
    isModalOpenChangeCallback,
    handleBack,
    handleNext,
    isPrimary = false,
}: {
    isModalOpen: boolean;
    isModalOpenChangeCallback: (b: boolean) => void;
    handleBack: () => void;
    handleNext: (d: Destination) => void;
    isPrimary: boolean;
}) => {
    const initialDestination = {
        ...EMPTY_DESTINATION,
        primary: isPrimary,
    };
    const { t } = useTranslation();
    const [destination, setDestination] =
        useState<Destination>(initialDestination);

    const handlePurposeSelection = (keys: Selection) => {
        if (keys !== "all") {
            if (keys.size > 0) {
                const purposeKey = [...keys][0];
                setDestination({
                    ...destination,
                    purpose: purposeKey as PlaceKey,
                });
            } else {
                setDestination({ ...destination, purpose: "" });
            }
        }
    };

    const purposesMap = Object.values(Place).map(value => ({
        id: value,
        name: value,
    }));

    const handleLocationSelection = (selection: {
        name: string;
        address?: string;
        mapbox_id?: string;
        [key: string]: any;
    }) => {
        // TODO: Use Mapbox search API to retrieve if id available.
        // Use Mapbox forward geocoding API if only address
        // Use address if available, else name
        const label = selection.address ?? selection.name;
        const EXAMPLE_COORDS_RES = {
            longitude: -71.117229,
            latitude: 42.4063342,
        };

        const location = {
            label: label,
            position: {
                lat: EXAMPLE_COORDS_RES.latitude,
                lon: EXAMPLE_COORDS_RES.longitude,
            },
        };

        setDestination({
            ...destination,
            location: location,
        });
    };

    const handleLocationClear = () => {
        setDestination({
            ...destination,
            location: initialDestination.location,
        });
    };

    return (
        <ModalOverlay
            isDismissable
            isMobile
            isOpen={isModalOpen}
            onOpenChange={isOpen => {
                setDestination(initialDestination);
                isModalOpenChangeCallback(isOpen);
            }}
        >
            <Modal size="small" className="flex flex-col gap-6 p-5">
                <WizardStep
                    question={t("userTrip.wizard.addNewTripModal.question")}
                    buttonText={t("userTrip.wizard.addNewTripModal.finish")}
                    handleBack={() => {
                        setDestination(initialDestination);
                        handleBack();
                    }}
                    handleNext={() => handleNext(destination)}
                    disableNext={
                        !destination.purpose || !destination.location.label
                    }
                >
                    <div>
                        <h2>
                            {t("userTrip.wizard.addNewTripModal.purposeLabel")}
                        </h2>
                        <GridList
                            aria-label="Places to select"
                            items={purposesMap}
                            selectionMode="single"
                            selectedKeys={[destination.purpose]}
                            onSelectionChange={handlePurposeSelection}
                            className="grid grid-cols-2 gap-3 list-none"
                        >
                            {item => (
                                <GridListItem
                                    id={item.id}
                                    textValue={item.name}
                                >
                                    {({ isSelected }) => (
                                        <div
                                            className={`w-full h-full ${isSelected ? "border-2 border-teal-600" : "border-2 border-transparent"}`}
                                        >
                                            {item.name}
                                        </div>
                                    )}
                                </GridListItem>
                            )}
                        </GridList>
                    </div>
                    <div>
                        <h2>
                            {t("userTrip.wizard.addNewTripModal.locationLabel")}
                        </h2>
                        <Autocomplete
                            placeholder={t(
                                "userTrip.wizard.addNewTripModal.locationPlaceholder"
                            )}
                            suggestions={MAPBOX_EMPTY_SUGGESTIONS.suggestions}
                            onClearCallback={handleLocationClear}
                            onSuggestionCallback={s =>
                                handleLocationSelection(s)
                            }
                        />
                    </div>
                </WizardStep>
            </Modal>
        </ModalOverlay>
    );
};

export default AddTripModal;
