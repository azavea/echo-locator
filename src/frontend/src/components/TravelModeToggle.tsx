import type { Key } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type { UserProfileSliceState } from "reducers/userProfile/types";
import {
    ToggleButton,
    ToggleButtonGroup,
} from "components/base/ToggleButton/ToggleButton";

interface Props {
    buffer: UserProfileSliceState;
    handleChange: (keys: Set<Key>) => void;
}

const TravelModeToggle = ({ buffer, handleChange }: Props) => {
    const { t } = useTranslation();

    return (
        <ToggleButtonGroup
            selectionMode="single"
            className="w-full"
            selectedKeys={new Set([buffer.hasVehicle ? "car" : "transit"])}
            onSelectionChange={(keys: Set<Key>) =>
                keys.size === 1 && handleChange(keys)
            }
        >
            <ToggleButton id="car" size="large" className="w-full">
                {t("userProfile.wizard.stepTravelMode.toggleCar")}
            </ToggleButton>
            <ToggleButton id="transit" size="large" className="w-full">
                {t("userProfile.wizard.stepTravelMode.toggleTransit")}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default TravelModeToggle;
