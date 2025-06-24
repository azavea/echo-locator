import {
    ButtonGroup,
    GroupedButton,
} from "components/base/ButtonGroup/ButtonGroup";

import StarSolidIcon from "assets/icons/star-solid.svg?react";
import ArrowFullRightIcon from "assets/icons/arrow-full-right.svg?react";

interface Props {
    size?: "small" | "medium" | "large";
}
const CompareFavoritesButton = ({ size = "medium" }: Props) => {
    const iconClassName =
        size === "large"
            ? "h-[17px] w-[17px] fill fill-orange-800"
            : "h-[14px] w-[14px] fill fill-orange-800";
    return (
        <ButtonGroup>
            <GroupedButton
                aria-label="Add to favorites"
                size={size}
                leftIcon={<StarSolidIcon className={iconClassName} />}
            />
            <GroupedButton
                size={size}
                label="Compare favorites"
                rightIcon={<ArrowFullRightIcon className={iconClassName} />}
            />
        </ButtonGroup>
    );
};

export default CompareFavoritesButton;
