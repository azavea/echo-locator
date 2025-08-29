import { useMemo } from "react";
import { rangeStyles } from "./Range.styles";
import DotIcon from "assets/icons/dots.svg?react";

const MIN_DEFAULT = 0;
const MAX_DEFAULT = 120;

export interface RangeProps {
    label: string;
    start: number;
    end: number;
    className?: string;
    min?: number;
    max?: number;
}

const Range = ({
    label,
    start,
    end,
    className,
    min = MIN_DEFAULT,
    max = MAX_DEFAULT,
}: RangeProps) => {
    const { root, labelContainer, mainLabel, rangeLabel, track, fill, dots } =
        rangeStyles();

    const isPoint = start === end;
    const totalRange = max - min;
    const startPercentage = ((start - min) / totalRange) * 100;
    const widthPercentage =
        ((Math.min(end, MAX_DEFAULT) - start) / totalRange) * 100 || 8;

    const rangeText = useMemo(() => {
        if (start >= MAX_DEFAULT) return "Over 2 hr";
        if (isPoint) return `${start} min`;
        return `${start}-${end > MAX_DEFAULT ? `${MAX_DEFAULT}+` : end} min`;
    }, [start, end]);

    return (
        <div className={root({ className })}>
            <div className={labelContainer()}>
                <span className={mainLabel()}>{label}</span>
                <span className={rangeLabel()}>{rangeText}</span>
            </div>
            <div className="relative">
                <div className={track()}></div>
                {start < MAX_DEFAULT && (
                    <div
                        className={fill()}
                        style={{
                            left:
                                startPercentage === 0
                                    ? "0px"
                                    : isPoint
                                      ? `calc(${startPercentage}% - 4px)`
                                      : end >= MAX_DEFAULT
                                        ? `min(calc(100% - 12px), ${startPercentage}%)`
                                        : `${startPercentage}%`,
                            width: `${widthPercentage}%`,
                            minWidth: end >= MAX_DEFAULT ? "12px" : "6px",
                        }}
                    >
                        {!isPoint && end >= MAX_DEFAULT && (
                            <span className={dots()}>
                                <DotIcon />
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Range;
