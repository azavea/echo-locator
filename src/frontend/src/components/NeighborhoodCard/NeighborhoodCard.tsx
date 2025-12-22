import { selectUserProfile } from "reducers/userProfile/userSlice";
import { useAppSelector } from "store/store";

import ArrowLeftIcon from "assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "assets/icons/arrow-right.svg?react";
import FlagIcon from "assets/icons/flag.svg?react";
import SquareDollarIcon from "assets/icons/square-dollar.svg?react";
import StarSolidIcon from "assets/icons/star-solid.svg?react";
import TimesIcon from "assets/icons/times.svg?react";
import Button from "components/base/Button/Button";
import Meter from "components/base/Meter/Meter";
import Range from "components/base/Range/Range";
import SchoolMeter from "components/SchoolMeter";
import type { Stats } from "src/libs/formatNeighborhoodDataByCard";
import { cardStyles } from "./NeighborhoodCard.styles";

export interface NeighborhoodCardProps {
    name: string;
    zip: string;
    imageUrl?: string;
    isTopTen?: boolean;
    hasECC?: boolean;
    stats?: Stats;
    listViewStyling?: { [key: string]: string | boolean };
    onClose?: () => void;
    onPrev?: () => void;
    onDetails?: () => void;
    onNext?: () => void;
    isPopup?: boolean;
}

const NeighborhoodCard = ({
    imageUrl = "",
    name,
    zip,
    isTopTen = false,
    hasECC = false,
    stats,
    listViewStyling,
    onClose,
    onPrev,
    onDetails,
    onNext,
    isPopup,
}: NeighborhoodCardProps) => {
    const {
        root,
        image,
        closeButton,
        closeIcon,
        content,
        header,
        title,
        zip: zipStyle,
        tagsContainer,
        tag,
        statsContainer,
        statItem,
        navContainer,
    } = cardStyles({ hasImage: !!imageUrl, ...listViewStyling });

    const hasTag = isTopTen || hasECC;
    const { favorites } = useAppSelector(selectUserProfile);
    const isFavorited = favorites.includes(zip);
    const hasAction = !!onPrev || !!onDetails || !!onNext;

    return (
        <div className={root()}>
            <div className="relative">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={`View of ${name}`}
                        className={image()}
                    />
                )}
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={closeButton()}
                        onPress={onClose}
                        aria-label="Close"
                        leftIcon={<TimesIcon className={closeIcon()} />}
                    />
                )}
            </div>
            <div className={content()}>
                <div className={header()}>
                    {isFavorited && (
                        <StarSolidIcon className="w-[18px] fill fill-orange-700 self-center mr-2" />
                    )}
                    <h3
                        className={`${title()} ${isPopup ? "popup-title" : ""}`}
                    >
                        {name}
                    </h3>
                    <p
                        className={`${zipStyle()} ${isPopup ? "popup-zipcode" : ""}`}
                    >
                        {zip}
                    </p>
                </div>
                {hasTag && (
                    <div className={tagsContainer()}>
                        {isTopTen && (
                            <div className={tag()}>
                                <FlagIcon className="h-4 w-4 fill-[#50935D]" />
                                <span>Top 10</span>
                            </div>
                        )}
                        {hasECC && (
                            <div className={tag()}>
                                <SquareDollarIcon className="h-[13px] w-[13px] -ml-[1px] mr-[1px] fill-[#50935D]" />
                                <span>ECC Benefits</span>
                            </div>
                        )}
                    </div>
                )}
                {!!stats && (
                    <div className={statsContainer()}>
                        <div className={statItem()}>
                            <SchoolMeter {...stats.schools} />
                        </div>
                        <div className={statItem()}>
                            <Meter {...stats.safety} />
                        </div>
                        <div className={statItem()}>
                            <Range {...stats.commute} />
                        </div>
                    </div>
                )}
            </div>
            {hasAction && (
                <div className={navContainer()}>
                    {onPrev && (
                        <Button
                            variant="outline"
                            className="flex-1"
                            onPress={onPrev}
                            leftIcon={
                                <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                            }
                        >
                            Prev
                        </Button>
                    )}
                    {onDetails && (
                        <Button
                            variant="outline"
                            className="flex-1"
                            onPress={onDetails}
                        >
                            Details
                        </Button>
                    )}
                    {onNext && (
                        <Button
                            variant="outline"
                            className="flex-1"
                            onPress={onNext}
                            rightIcon={
                                <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                            }
                        >
                            Next
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default NeighborhoodCard;
