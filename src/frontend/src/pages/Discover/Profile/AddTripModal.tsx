import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Destination } from "reducers/userProfile/types";
import { Place, type PlaceKey } from "src/enums";

import { Modal, ModalOverlay } from "components/base/Modal/Modal";
import WizardStep from "components/Wizard/WizardStep";

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
    const { t } = useTranslation();

    const TEMP_NEW_DEST = {
        location: {
            label: "1234 Address Ave Boston 12345",
            position: {
                lat: 1,
                lon: 2,
            },
        },
        primary: false,
        purpose: "Daycare",
    };

    const [destination, setDestination] = useState<Destination>({
        ...EMPTY_DESTINATION,
        primary: isPrimary,
    });

    return (
        <ModalOverlay
            isDismissable
            isMobile
            isOpen={isModalOpen}
            onOpenChange={isModalOpenChangeCallback}
        >
            <Modal size="small" className="flex flex-col gap-6 p-5">
                <WizardStep
                    question={t("userTrip.wizard.addNewTripModal.question")}
                    buttonText={t("userTrip.wizard.addNewTripModal.finish")}
                    handleBack={handleBack}
                    handleNext={() => handleNext(TEMP_NEW_DEST)}
                >
                    <div>
                        <h2>
                            {t("userTrip.wizard.addNewTripModal.purposeLabel")}
                        </h2>
                    </div>
                    <div>
                        <h2>
                            {t("userTrip.wizard.addNewTripModal.locationLabel")}
                        </h2>
                    </div>
                </WizardStep>
            </Modal>
        </ModalOverlay>
    );
};

export default AddTripModal;
