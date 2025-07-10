import { useMemo } from "react";
import { rangeStyles } from "./Range.styles";
import DotIcon from "assets/icons/dots.svg?react";

const MIN_DEFAULT = 0;
const MAX_DEFAULT = 120;

interface RangeDisplayProps {
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
}: RangeDisplayProps) => {
    const { root, labelContainer, mainLabel, rangeLabel, track, fill } =
        rangeStyles();

    const isPoint = start === end;
    const totalRange = max - min;
    const startPercentage = ((start - min) / totalRange) * 100;
    const widthPercentage =
        ((Math.min(end, MAX_DEFAULT) - start) / totalRange) * 100 || 8;

    const rangeText = useMemo(() => {
        if (start >= 120) return "Over 2 hr";
        if (isPoint) return `${start} min`;
        return `${start}-${end} min`;
    }, [start, end]);

    return (
        <div className={root({ className })}>
            <div className={labelContainer()}>
                <span className={mainLabel()}>{label}</span>
                <span className={rangeLabel()}>{rangeText}</span>
            </div>
            <div className="relative">
                <div className={track()}></div>
                {start < 120 && (
                    <div
                        className={fill()}
                        style={{
                            left:
                                startPercentage === 0
                                    ? "0px"
                                    : isPoint
                                      ? `calc(${startPercentage}% - 4px)`
                                      : `${startPercentage}%`,
                            width: `${widthPercentage}%`,
                            minWidth: "6px",
                        }}
                    >
                        {/* TODO: Add and style the dots icon here */}
                        {/* {!isPoint && end >= 120 && (
                            <DotIcon />
                        )} */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Range;
