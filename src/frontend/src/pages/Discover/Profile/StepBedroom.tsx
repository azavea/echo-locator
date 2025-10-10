import { useTranslation } from "react-i18next";

import InputNumber from "components/InputNumber";
import WizardStep from "components/Wizard/WizardStep";
import type { BaseProps } from "./types";

const StepBedroom = ({
    buffer,
    setProfileBuffer,
    handleBack,
    handleNext,
}: BaseProps) => {
    const { t } = useTranslation();

    const onChange = (rooms: number) =>
        setProfileBuffer(state => ({
            ...state,
            rooms,
        }));

    return (
        <WizardStep
            question={t("userProfile.wizard.stepBedroom.question")}
            description={t("userProfile.wizard.stepBedroom.description")}
            buttonText={t("userProfile.wizard.button.continue")}
            handleBack={handleBack}
            handleNext={handleNext}
            disableNext={!buffer.rooms}
            disableBack
        >
            <InputNumber
                label="Number of bedrooms"
                value={buffer.rooms}
                onChange={onChange}
            />
        </WizardStep>
    );
};

export default StepBedroom;
