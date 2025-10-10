import { useTranslation } from "react-i18next";
import Slider from "./base/Slider/Slider";

export const Factor = {
    Commute: "importanceAccessibility",
    School: "importanceSchools",
    Safety: "importanceViolentCrime",
};

export type FactorKeys = (typeof Factor)[keyof typeof Factor];

type FactorType = { [key: FactorKeys]: number };

interface Props {
    factor: FactorType;
    handleChange: (value: number, factor: FactorKeys) => void;
}

const ImportanceSliders = ({ factor, handleChange }: Props) => {
    const { t } = useTranslation();

    const onChange = (value: number | number[], factor: FactorKeys) => {
        // base on React Aria, value is of type number | number[],
        // in reality we only pass number to value,
        // adding the following line to make TypeScript happy,
        if (Array.isArray(value)) {
            if (value.length) {
                handleChange(value[0], factor);
            }
            return;
        }
        handleChange(value, factor);
    };

    return (
        <div className="flex flex-col gap-8">
            <Slider
                step={1}
                minValue={1}
                maxValue={4}
                label={t("userProfile.wizard.stepImportance.commuteTime")}
                minValLabel={t(
                    "userProfile.wizard.stepImportance.notImportant"
                )}
                maxValLabel={t(
                    "userProfile.wizard.stepImportance.veryImportant"
                )}
                value={factor[Factor.Commute]}
                onChange={value => onChange(value, Factor.Commute)}
            />
            <Slider
                step={1}
                minValue={1}
                maxValue={4}
                label={t("userProfile.wizard.stepImportance.schoolQuality")}
                minValLabel={t(
                    "userProfile.wizard.stepImportance.notImportant"
                )}
                maxValLabel={t(
                    "userProfile.wizard.stepImportance.veryImportant"
                )}
                value={factor[Factor.School]}
                onChange={value => onChange(value, Factor.School)}
            />
            <Slider
                step={1}
                minValue={1}
                maxValue={4}
                label={t("userProfile.wizard.stepImportance.publicSafety")}
                minValLabel={t(
                    "userProfile.wizard.stepImportance.notImportant"
                )}
                maxValLabel={t(
                    "userProfile.wizard.stepImportance.veryImportant"
                )}
                value={factor[Factor.Safety]}
                onChange={value => onChange(value, Factor.Safety)}
            />
        </div>
    );
};

export default ImportanceSliders;
