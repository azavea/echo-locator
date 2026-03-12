import {
    Label as AriaLabel,
    Meter as AriaMeter,
    type MeterProps as AriaMeterProps,
} from "react-aria-components";

import { useTranslation } from "react-i18next";
import { meterStyles } from "./Meter.styles";

type MeterStatus = "Low" | "Below Avg" | "Average" | "Above Avg" | "High";

export interface MeterProps extends AriaMeterProps {
    labelKey: string;
    showCategory?: boolean;
}

const getStatusFromValue = (value: number): MeterStatus => {
    if (value <= 20) return "Low";
    if (value <= 40) return "Below Avg";
    if (value <= 60) return "Average";
    if (value <= 80) return "Above Avg";
    return "High";
};

const Meter = ({ labelKey, showCategory = false, ...props }: MeterProps) => {
    const { t } = useTranslation();
    const status = getStatusFromValue(props.value ?? 0);
    const { root, labelContainer, mainLabel, valueLabel, track, fill, thumb } =
        meterStyles({ status });

    const translatableLabelKey = status.split(" ")[0].toLowerCase();

    return (
        <AriaMeter {...props} className={root()}>
            {({ percentage }) => (
                <>
                    <div className={labelContainer()}>
                        <AriaLabel className={mainLabel()}>
                            {t([
                                "neighborhoodDetail.schoolsSafetyCard." +
                                    labelKey,
                            ])}
                        </AriaLabel>
                        {showCategory && (
                            <AriaLabel className={valueLabel()}>
                                {t([
                                    "neighborhoodDetail." +
                                        "schoolsSafetyCard." +
                                        translatableLabelKey,
                                ])}
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
