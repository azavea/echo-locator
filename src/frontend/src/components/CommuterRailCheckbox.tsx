import { useTranslation } from "react-i18next";

import type { UserProfileSliceState } from "reducers/userProfile/types";
import Checkbox from "components/base/Checkbox/Checkbox";

interface Props {
    buffer: UserProfileSliceState;
    handleChange: (keys: boolean) => void;
}

const CommuterRailCheckbox = ({ buffer, handleChange }: Props) => {
    const { t } = useTranslation();

    return (
        <Checkbox
            isSelected={buffer.useCommuterRail}
            onChange={(value: boolean) => handleChange(value)}
            description={t(
                "userProfile.wizard.stepTravelMode.checkboxDescription"
            )}
            isDisabled={buffer.hasVehicle}
        >
            {t("userProfile.wizard.stepTravelMode.checkboxLabel")}
        </Checkbox>
    );
};

export default CommuterRailCheckbox;
