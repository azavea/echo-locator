import { rangeStyles } from "./Range.styles";

const MIN_DEFAULT = 0;
const MAX_DEFAULT = 120;

interface RangeDisplayProps {
    label: string;
    rangeText: string;
    start: number;
    end: number;
    className?: string;
    min?: number;
    max?: number;
}

const Range = ({
    label,
    rangeText,
    start,
    end,
    className,
    min = MIN_DEFAULT,
    max = MAX_DEFAULT,
}: RangeDisplayProps) => {
    const { root, labelContainer, mainLabel, rangeLabel, track, fill } =
        rangeStyles();

    const isPoints = start === end;
    const totalRange = max - min;
    const startPercentage = ((start - min) / totalRange) * 100;
    const widthPercentage = ((end - start) / totalRange) * 100 || 8;

    return (
        <div className={root({ className })}>
            <div className={labelContainer()}>
                <span className={mainLabel()}>{label}</span>
                <span className={rangeLabel()}>{rangeText}</span>
            </div>
            <div className="relative">
                <div className={track()}></div>
                <div
                    className={isPoints ? fill({ variant: "point" }) : fill()}
                    style={{
                        left: isPoints
                            ? `calc(${startPercentage}% - 4px)`
                            : `${startPercentage}%`,
                        width: `${widthPercentage}%`,
                    }}
                />
            </div>
        </div>
    );
};

export default Range;
