import {
    ButtonGroup,
    GroupedButton,
} from "components/base/ButtonGroup/ButtonGroup";

import ArrowFullRightIcon from "assets/icons/arrow-full-right.svg?react";
import StarSolidIcon from "assets/icons/star-solid.svg?react";

interface Props {
    unfavoriteCallback: () => void;
    compareCallback: () => void;
    isDisabled?: boolean;
    size?: "small" | "medium" | "large";
}
const CompareFavoritesButton = ({
    unfavoriteCallback,
    compareCallback,
    isDisabled = false,
    size = "medium",
}: Props) => {
    return (
        <ButtonGroup className="min-w-[230px]" isDisabled={isDisabled}>
            <GroupedButton
                aria-label="Remove from favorites"
                size={size}
                leftIcon={
                    <StarSolidIcon className="w-[18px] fill fill-orange-800" />
                }
                onPress={unfavoriteCallback}
            />
            <GroupedButton
                size={size}
                label="View favorites"
                rightIcon={
                    <ArrowFullRightIcon className="w-[13px] fill fill-orange-900/60" />
                }
                onPress={compareCallback}
                className="w-full justify-between"
            />
        </ButtonGroup>
    );
};

export default CompareFavoritesButton;
