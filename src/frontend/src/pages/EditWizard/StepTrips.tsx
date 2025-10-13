import { useTranslation } from "react-i18next";

import WizardStep from "src/components/Wizard/WizardStep";
import type { BaseProps } from "../Discover/Profile/types";

const EditTripsWizardSteps = ({
    buffer,
    setProfileBuffer,
    handleBack,
    handleNext,
}: BaseProps) => {
    const { t } = useTranslation();

    if (!buffer || !setProfileBuffer || !handleBack || !handleNext) {
        return <></>;
    }

    {
        /* TODO: Your trip steps */
    }
    return (
        <WizardStep
            question={t("userTrip.wizard.stepAddTrip.question")}
            description={t("userTrip.wizard.stepAddTrip.description")}
            buttonText={t("userTrip.wizard.button.finish")}
            handleBack={handleBack}
            handleNext={handleNext}
        >
            <p className=" text-gray-600">
                Step 4. The "Add trip" logic goes here
            </p>
        </WizardStep>
    );
};

export default EditTripsWizardSteps;
