import type { Key } from "react-aria-components";
import { useTranslation } from "react-i18next";

import CommuterRailCheckbox from "components/CommuterRailCheckbox";
import TravelModeToggle from "components/TravelModeToggle";
import WizardStep from "components/Wizard/WizardStep";
import type { BaseProps } from "./types";

const StepTravelMode = ({
    buffer,
    setProfileBuffer,
    handleBack,
    handleNext,
}: BaseProps) => {
    const { t } = useTranslation();

    const onChangeToggle = (keys: Set<Key>) =>
        setProfileBuffer(state => {
            const result = {
                ...state,
                hasVehicle: keys.has("car"),
            };
            if (keys.has("car")) {
                return {
                    ...result,
                    useCommuterRail: false,
                };
            }
            return result;
        });

    const onChangeCheckbox = (value: boolean) =>
        setProfileBuffer(buffer => ({
            ...buffer,
            useCommuterRail: value,
        }));

    return (
        <WizardStep
            question={t("userProfile.wizard.stepTravelMode.question")}
            buttonText={t("userProfile.wizard.button.continue")}
            handleBack={handleBack}
            handleNext={handleNext}
        >
            {/* This toggle sets the hasVehicle field:
                - If toggle to car, hasVehicle is true;
                - If toggle to transit, hasVehicle is false.
            */}
            <TravelModeToggle buffer={buffer} handleChange={onChangeToggle} />
            {/* This checkbox sets the useCommuterRail field:
                -  If checked, useCommuterRail is true
                -  If not checked, useCommuterRail is false
            */}
            <CommuterRailCheckbox
                buffer={buffer}
                handleChange={onChangeCheckbox}
            />
        </WizardStep>
    );
};

export default StepTravelMode;
