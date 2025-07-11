import {
    Meter as AriaMeter,
    Label as AriaLabel,
    type MeterProps as AriaMeterProps,
} from "react-aria-components";

import { meterStyles } from "./Meter.styles";

type MeterStatus = "Low" | "Below Avg" | "Average" | "Above Avg" | "High";

interface CustomMeterProps extends AriaMeterProps {
    label: string;
    showCategory?: boolean;
}

const getStatusFromValue = (value: number): MeterStatus => {
    if (value <= 20) return "Low";
    if (value <= 40) return "Below Avg";
    if (value <= 60) return "Average";
    if (value <= 80) return "Above Avg";
    return "High";
};

const Meter = ({ label, showCategory = false, ...props }: CustomMeterProps) => {
    const status = getStatusFromValue(props.value ?? 0);
    const { root, labelContainer, mainLabel, valueLabel, track, fill, thumb } =
        meterStyles({ status });

    return (
        <AriaMeter {...props} className={root()}>
            {({ percentage }) => (
                <>
                    <div className={labelContainer()}>
                        <AriaLabel className={mainLabel()}>{label}</AriaLabel>
                        {showCategory && (
                            <AriaLabel className={valueLabel()}>
                                {status}
                            </AriaLabel>
                        )}
                    </div>
                    <div className="relative">
                        <div className={track()}></div>
                        <div
                            className={fill()}
                            style={{ width: `${percentage}%`, minWidth: "6px" }}
                        />
                        <div className={thumb()} />
                    </div>
                </>
            )}
        </AriaMeter>
    );
};

export default Meter;
