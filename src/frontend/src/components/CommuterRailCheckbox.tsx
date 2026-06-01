import { useTranslation } from "react-i18next";

import Checkbox from "components/base/Checkbox/Checkbox";
import type { UserProfileSliceState } from "reducers/userProfile/types";

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
            variant="default"
            isDisabled={buffer.hasVehicle}
        >
            {t("userProfile.wizard.stepTravelMode.checkboxLabel")}
        </Checkbox>
    );
};

export default CommuterRailCheckbox;
