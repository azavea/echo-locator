import { Label as AriaLabel, Link } from "react-aria-components";
import { useTranslation } from "react-i18next";

import ExternalLinkIcon from "assets/icons/external-link.svg?react";
import Meter, { type MeterProps } from "components/base/Meter/Meter";
import {
    BOSTON_SCHOOL_CHOICE_LINK,
    CAMBRIDGE_SCHOOL_CHOICE_LINK,
} from "src/constants";
import { meterStyles } from "./base/Meter/Meter.styles";

export interface SchoolMeterProps extends MeterProps {
    isSchoolChoice?: boolean;
    isBoston?: boolean;
    isDetailPage?: boolean;
}

const SchoolMeter = ({
    isSchoolChoice = false,
    isBoston = false,
    isDetailPage = false,
    ...props
}: SchoolMeterProps) => {
    const { t } = useTranslation();
    const { labelContainer, mainLabel } = meterStyles();
    const schoolChoiceLink = isBoston
        ? BOSTON_SCHOOL_CHOICE_LINK
        : CAMBRIDGE_SCHOOL_CHOICE_LINK;
    return isSchoolChoice ? (
        <div className="flex flex-col gap-2 w-full">
            <div className={labelContainer()}>
                <AriaLabel className={mainLabel()}>{props.label}</AriaLabel>
            </div>
            <Link
                href={schoolChoiceLink}
                target="_blank"
                aria-label={`Open ${isBoston ? "Boston" : "Cambridge"} School Choice Information`}
                className={`${isDetailPage ? "text-sm" : "text-[11px]"}`}
            >
                <span>
                    <p className="inline">
                        {t("neighborhoodDetail.schoolChoice")}{" "}
                    </p>
                    <ExternalLinkIcon
                        className={`inline fill-gray-800 align-baseline ${isDetailPage ? "h-3" : "h-[8px]"}`}
                    />
                </span>
            </Link>
        </div>
    ) : (
        <Meter {...props} />
    );
};

export default SchoolMeter;
