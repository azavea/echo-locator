import { useTranslation } from "react-i18next";

import WizardStep from "components/Wizard/WizardStep";
import type { Destination } from "src/reducers/userProfile/types";
import type { BaseProps } from "./types";

const StepTrips = ({
    buffer,
    setProfileBuffer,
    handleBack,
    handleNext,
}: BaseProps) => {
    const { t } = useTranslation();

    const onRemoveDestination = (destinationIndex: number) => {
        const updatedDestinations = [...buffer.destinations];
        updatedDestinations.splice(destinationIndex, 1);
        setProfileBuffer(state => ({
            ...state,
            destinations: updatedDestinations,
        }));
    };

    const onAddDestination = (destination: Destination) => {
        setProfileBuffer(state => ({
            ...state,
            destinations: [...buffer.destinations, destination],
        }));
    };

    return (
        <WizardStep
            question={t("userTrip.wizard.stepAddTrip.question")}
            description={t("userTrip.wizard.stepAddTrip.description")}
            buttonText={t("userTrip.wizard.button.finish")}
            handleBack={handleBack}
            handleNext={handleNext}
            disableNext={!buffer.destinations.length}
        >
            <p className=" text-gray-600">
                Step 4. The "Add trip" logic goes here
            </p>
        </WizardStep>
    );
};

export default StepTrips;
