import { cardStyles } from "./NeighborhoodCard.styles";
import Button from "components/base/Button/Button";
import Meter, { type MeterProps } from "components/base/Meter/Meter";
import Range, { type RangeProps } from "components/base/Range/Range";

import TimesIcon from "assets/icons/times.svg?react";
import FlagIcon from "assets/icons/flag.svg?react";
import SquareDollarIcon from "assets/icons/square-dollar.svg?react";
import ArrowLeftIcon from "assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "assets/icons/arrow-right.svg?react";

export interface NeighborhoodCardProps {
    name: string;
    zip: string;
    imageUrl?: string;
    isTopTen?: boolean;
    hasECC?: boolean;
    stats?: {
        schools: MeterProps;
        safety: MeterProps;
        commute: RangeProps;
    };
    listViewStyling?: { [key: string]: string | boolean };
    onClose?: () => void;
    onPrev?: () => void;
    onDetails?: () => void;
    onNext?: () => void;
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
                    <h3 className={title()}>{name}</h3>
                    <p className={zipStyle()}>{zip}</p>
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
                            <Meter
                                label={stats.schools.label}
                                value={stats.schools.value}
                                showCategory={stats.schools.showCategory}
                            />
                        </div>
                        <div className={statItem()}>
                            <Meter
                                label={stats.safety.label}
                                value={stats.safety.value}
                                showCategory={stats.safety.showCategory}
                            />
                        </div>
                        <div className={statItem()}>
                            <Range
                                label={stats.commute.label}
                                start={stats.commute.start}
                                end={stats.commute.end}
                            />
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
