import { useTranslation } from "react-i18next";

import ImportanceSliders, {
    Factor,
    type FactorKeys,
} from "components/ImportanceSliders";
import WizardStep from "components/Wizard/WizardStep";
import type { BaseProps } from "../Discover/Profile/types";

const StepImportance = ({
    buffer,
    setProfileBuffer,
    handleBack,
    handleNext,
}: BaseProps) => {
    const { t } = useTranslation();

    if (!buffer || !setProfileBuffer || !handleBack || !handleNext) {
        return <></>;
    }

    const onChange = (value: number, factor: FactorKeys) =>
        setProfileBuffer(state => ({
            ...state,
            [factor]: value.toString(),
        }));

    return (
        <WizardStep
            question={t("userProfile.wizard.stepImportance.question")}
            buttonText={t("userProfile.wizard.button.continue")}
            handleBack={handleBack}
            handleNext={handleNext}
        >
            <ImportanceSliders
                factor={{
                    [Factor.Commute]: parseInt(buffer.importanceAccessibility),
                    [Factor.Safety]: parseInt(buffer.importanceViolentCrime),
                    [Factor.School]: parseInt(buffer.importanceSchools),
                }}
                handleChange={onChange}
            />
        </WizardStep>
    );
};

export default StepImportance;
