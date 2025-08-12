import { useEffect, useState } from "react";
import type { Key } from "react-aria-components";

import Button from "components/base/Button/Button";
import {
    ToggleButton,
    ToggleButtonGroup,
} from "components/base/ToggleButton/ToggleButton";
import type { PlaceKey } from "src/enums";

import FamilyIcon from "assets/icons/family.svg?react";
import TransitIcon from "assets/icons/transit.svg?react";
import CarIcon from "assets/icons/car.svg?react";
import ArrowFullRightIcon from "assets/icons/arrow-full-right.svg?react";

type Mode = "transit" | "car";
type Size = "small" | "medium" | "large";

interface Props {
    size?: Size;
    mode: Mode;
    place: PlaceKey;
}

interface MobileProps extends Props {
    display: string;
    callback?: (key: string) => void;
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
    callback,
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
        if (callback) {
            const keyArr = [...keys];
            if (keyArr.length && typeof keyArr[0] === "string")
                callback(keyArr[0]);
        }
    };

    return (
        <div className="flex flex-column items-center justify-between w-full">
            <Button
                variant="outline"
                size={size}
                leftIcon={<FamilyIcon className={getIconStyle(size)} />}
            >
                You
            </Button>
            <Button
                className="w-[127px] justify-start"
                variant="outline"
                size={size}
                leftIcon={
                    <div className="flex items-center gap-3">
                        {getModeIcon(mode, size)}
                        <ArrowFullRightIcon className="font-normal fill-gray-400 w-[10px] -ml-1" />
                    </div>
                }
            >
                {place}
            </Button>
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
        <div className="flex flex-col gap-3 w-full">
            <Button
                variant="outline"
                size={size}
                leftIcon={<FamilyIcon className={getIconStyle(size)} />}
                info="2br・public transit"
            >
                Your Profile
            </Button>
            <Button
                variant="outline"
                size={size}
                leftIcon={getModeIcon(mode, size)}
                info="122 Address St, Cambridge"
            >
                {place}
            </Button>
        </div>
    );
};
