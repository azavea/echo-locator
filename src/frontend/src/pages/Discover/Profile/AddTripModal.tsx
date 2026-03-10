import { useState } from "react";
import { GridList, GridListItem, type Selection } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type { Destination } from "reducers/userProfile/types";
import { type PlaceKey } from "src/enums";

import AddressAutocomplete from "components/AddressAutocomplete";
import buttonStyles from "components/base/Button/Button.styles";
import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import WizardStep from "components/Wizard/WizardStep";
import type { Suggestion } from "src/components/base/Autocomplete/Autocomplete";
import { purposesMap } from "src/constants";

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
}: {
    isModalOpen: boolean;
    isModalOpenChangeCallback: (b: boolean) => void;
    handleBack: () => void;
    handleNext: (d: Destination) => void;
}) => {
    const { t } = useTranslation();
    const [destination, setDestination] =
        useState<Destination>(EMPTY_DESTINATION);

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

    const handleLocationSelection = (selection: Suggestion) => {
        if (!selection.geometry) return;
        const location = {
            label: selection.name,
            position: {
                lat: selection.geometry.coordinates[1],
                lon: selection.geometry.coordinates[0],
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
            location: EMPTY_DESTINATION.location,
        });
    };

    return (
        <ModalOverlay
            isDismissable
            isMobile
            isOpen={isModalOpen}
            onOpenChange={isOpen => {
                setDestination(EMPTY_DESTINATION);
                isModalOpenChangeCallback(isOpen);
            }}
        >
            <Modal size="small" className="flex flex-col p-5">
                <WizardStep
                    question={t("userTrip.wizard.addNewTripModal.question")}
                    buttonText={t("userTrip.wizard.addNewTripModal.finish")}
                    handleBack={() => {
                        setDestination(EMPTY_DESTINATION);
                        handleBack();
                    }}
                    handleNext={() => {
                        setDestination(EMPTY_DESTINATION);
                        handleNext(destination);
                    }}
                    disableNext={
                        !destination.purpose || !destination.location.label
                    }
                >
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-bold text-black">
                            {t("userTrip.wizard.addNewTripModal.purposeLabel")}
                        </h2>
                        <GridList
                            aria-label={t(
                                "userTrip.wizard.addNewTripModal.purposeLabel"
                            )}
                            items={purposesMap}
                            selectionMode="single"
                            selectedKeys={[destination.purpose]}
                            onSelectionChange={handlePurposeSelection}
                            className="grid grid-cols-2 gap-3 list-none w-full max-w-88 self-center"
                        >
                            {item => (
                                <GridListItem
                                    id={item.id}
                                    textValue={item.name}
                                >
                                    {({ isSelected }) => (
                                        <div
                                            className={`${buttonStyles({ variant: "outline" })} w-full h-full rounded-lg !p-4 justify-items-center ${isSelected ? "border-2 border-teal-600" : "border-2 border-gray-300"}`}
                                        >
                                            <p className="text-md font-bold text-black">
                                                {t([
                                                    "destinationPurposes." +
                                                        item.name,
                                                ])}
                                            </p>
                                        </div>
                                    )}
                                </GridListItem>
                            )}
                        </GridList>
                    </div>
                    <div className="flex flex-col -mb-6">
                        <h2 className="text-lg font-bold text-black mb-3">
                            {t("userTrip.wizard.addNewTripModal.locationLabel")}
                        </h2>
                        <AddressAutocomplete
                            placeholder={t(
                                "userTrip.wizard.addNewTripModal.locationPlaceholder"
                            )}
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
