import { useEffect, useState } from "react";
import type { Key } from "react-aria-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { NetworkModeOptions, type NetworkModeOptionKey } from "src/enums";
import {
    setIsEditFiltersOpen,
    setIsEditTripsOpen,
} from "src/reducers/modalsDisplay/modalsDisplaySlice";
import { selectActiveMode } from "src/reducers/networks/networksSlice";
import {
    selectActiveDestinationDetails,
    selectUserBedroomCount,
} from "src/reducers/userProfile/userSlice";
import { useAppSelector } from "src/store/store";

import ArrowFullRightIcon from "assets/icons/arrow-full-right.svg?react";
import FiltersIcon from "assets/icons/bars-filter.svg?react";
import CarIcon from "assets/icons/car.svg?react";
import TransitIcon from "assets/icons/transit.svg?react";
import Button from "components/base/Button/Button";
import {
    ToggleButton,
    ToggleButtonGroup,
} from "components/base/ToggleButton/ToggleButton";

type Size = "small" | "medium" | "large";

interface Props {
    size?: Size;
}

interface MobileProps extends Props {
    display: string;
    callback?: (key: string) => void;
}

const getModeIcon = (mode: NetworkModeOptionKey, size: Size) =>
    mode !== NetworkModeOptions.car ? (
        <TransitIcon className={getIconStyle(size)} />
    ) : (
        <CarIcon className={getIconStyle(size)} />
    );

const getIconStyle = (size: Size) =>
    size === "small"
        ? "font-normal text-gray-500 w-[13px]"
        : "font-normal text-gray-500 w-[17px]";

export const UserProfileSubheaderMobile = ({
    size = "medium",
    display = "map",
    callback,
}: MobileProps) => {
    const [displayOption, setDisplayOption] = useState(new Set<Key>([display]));
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mode = useAppSelector(selectActiveMode);
    const destination = useAppSelector(selectActiveDestinationDetails);

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
                leftIcon={<FiltersIcon className={getIconStyle(size)} />}
                onPress={() => dispatch(setIsEditFiltersOpen(true))}
            >
                {t("filtersButton")}
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
                onPress={() => dispatch(setIsEditTripsOpen(true))}
            >
                {t(`destinationPurposes.${destination?.purpose}`)}
            </Button>
            <ToggleButtonGroup
                selectionMode="single"
                selectedKeys={displayOption}
                onSelectionChange={onChangeDisplayOption}
            >
                <ToggleButton id="map" size={size}>
                    {t("map")}
                </ToggleButton>
                <ToggleButton id="list" size={size}>
                    {t("list")}
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export const UserProfileSubheader = ({ size = "medium" }: Props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const bedrooms = useAppSelector(selectUserBedroomCount);
    const destination = useAppSelector(selectActiveDestinationDetails);
    const mode = useAppSelector(selectActiveMode);

    return (
        <div className="flex flex-col gap-3 w-full">
            <Button
                variant="outline"
                size={size}
                leftIcon={<FiltersIcon className={getIconStyle(size)} />}
                info={`${bedrooms}br・${t(`transitModesSimple.${mode}`)}`}
                onPress={() => dispatch(setIsEditFiltersOpen(true))}
            >
                {t("filtersButton")}
            </Button>
            <Button
                variant="outline"
                size={size}
                leftIcon={getModeIcon(mode, size)}
                info={destination?.location.label}
                onPress={() => dispatch(setIsEditTripsOpen(true))}
            >
                {t(`destinationPurposes.${destination?.purpose}`)}
            </Button>
        </div>
    );
};
