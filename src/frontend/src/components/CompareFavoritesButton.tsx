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
    return (
        <ButtonGroup>
            <GroupedButton
                aria-label="Remove from favorites"
                size={size}
                leftIcon={
                    <StarSolidIcon className="w-[18px] fill fill-orange-800" />
                }
            />
            <GroupedButton
                size={size}
                label="Compare favorites"
                rightIcon={
                    <ArrowFullRightIcon className="w-[13px] fill fill-orange-900/60" />
                }
            />
        </ButtonGroup>
    );
};

export default CompareFavoritesButton;
