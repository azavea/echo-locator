import type { Key } from "react-aria-components";

import Button from "components/base/Button/Button";
import {
    ToggleButton,
    ToggleButtonGroup,
} from "components/base/ToggleButton/ToggleButton";

import FamilyIcon from "assets/icons/family.svg?react";
import TransitIcon from "assets/icons/transit.svg?react";
import CarIcon from "assets/icons/car.svg?react";
import ArrowFullRightIcon from "assets/icons/arrow-full-right.svg?react";
import { useEffect, useState } from "react";

export const Places = {
    Work: "Work",
    School: "School",
    Daycare: "Daycare",
    FriendsFamily: "Friends/Family",
    Doctor: "Doctor",
    Other: "Other",
};

type PlaceKeys = (typeof Places)[keyof typeof Places];

type Mode = "transit" | "car";
type Size = "small" | "medium" | "large";

interface Props {
    size?: Size;
    mode: Mode;
    place: PlaceKeys;
}

interface MobileProps extends Props {
    display: "map" | "list";
}

const getModeIcon = (mode: Mode, size: Size) =>
    mode === "transit" ? (
        <TransitIcon className={getIconStyle(size)} />
    ) : (
        <CarIcon className={getIconStyle(size)} />
    );

const getIconStyle = (size: Size) =>
    size === "small"
        ? "font-normal text-gray-500 w-[13px]"
        : "font-normal text-gray-500 w-[17px]";

export const UserProfileSubheaderMobile = ({
    mode,
    place,
    size = "medium",
    display = "map",
}: MobileProps) => {
    const [displayOption, setDisplayOption] = useState(new Set<Key>([display]));

    useEffect(() => {
        setDisplayOption(new Set<Key>([display]));
    }, [display]);

    const onChangeDisplayOption = (keys: Set<Key>) => {
        if (keys.size === 0) {
            setDisplayOption(displayOption);
            return;
        }
        setDisplayOption(keys);
    };

    return (
        <div className="flex flex-column items-center gap-3">
            <Button
                variant="outline"
                size={size}
                label="You"
                leftIcon={<FamilyIcon className={getIconStyle(size)} />}
            />
            <Button
                variant="outline"
                size={size}
                label={place}
                leftIcon={
                    <div className="flex items-center gap-3">
                        {getModeIcon(mode, size)}
                        <ArrowFullRightIcon className="font-normal fill-gray-400 w-[10px] -ml-1" />
                    </div>
                }
            />
            <ToggleButtonGroup
                selectionMode="single"
                selectedKeys={displayOption}
                onSelectionChange={onChangeDisplayOption}
            >
                <ToggleButton id="map" size={size}>
                    Map
                </ToggleButton>
                <ToggleButton id="list" size={size}>
                    List
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export const UserProfileSubheader = ({
    mode,
    place,
    size = "medium",
}: Props) => {
    return (
        <div className="flex flex-col gap-3 w-[360px]">
            <Button
                variant="outline"
                size={size}
                label="Your Profile"
                leftIcon={<FamilyIcon className={getIconStyle(size)} />}
                info="2br・public transit"
            />
            <Button
                variant="outline"
                size={size}
                label={place}
                leftIcon={getModeIcon(mode, size)}
                info="122 Address St, Cambridge"
            />
        </div>
    );
};
