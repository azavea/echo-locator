import {
    Meter as AriaMeter,
    Label as AriaLabel,
    type MeterProps as AriaMeterProps,
} from "react-aria-components";

import { meterStyles } from "./Meter.styles";

type MeterStatus = "low" | "belowAvg" | "average" | "aboveAvg" | "high";

interface CustomMeterProps extends AriaMeterProps {
    label: string;
    category?: string;
}

const getStatusFromValue = (value: number): MeterStatus => {
    if (value <= 20) return "low";
    if (value <= 40) return "belowAvg";
    if (value <= 60) return "average";
    if (value <= 80) return "aboveAvg";
    return "high";
};

const Meter = ({ label, category, ...props }: CustomMeterProps) => {
    const status = getStatusFromValue(props.value ?? 0);
    const { root, labelContainer, mainLabel, valueLabel, track, fill, thumb } =
        meterStyles({ status });

    return (
        <AriaMeter {...props} className={root()}>
            {({ percentage }) => (
                <>
                    <div className={labelContainer()}>
                        <AriaLabel className={mainLabel()}>{label}</AriaLabel>
                        {category && (
                            <AriaLabel className={valueLabel()}>
                                {category}
                            </AriaLabel>
                        )}
                    </div>
                    <div className="relative">
                        <div className={track()}></div>
                        <div
                            className={fill()}
                            style={{ width: `${percentage}%` }}
                        />
                        <div className={thumb()} />
                    </div>
                </>
            )}
        </AriaMeter>
    );
};

export default Meter;
