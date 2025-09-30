import { useTranslation, Trans } from "react-i18next";

import Button from "components/base/Button/Button";
import { yourTripsStyles } from "./YourTrips.styles";
import { useAppSelector } from "src/store/store";
import { selectUseTransit } from "src/reducers/networks/networksSlice";
import neighborhoodDetailStyles from "src/pages/NeighborhoodDetail/styles/NeighborhoodDetail.styles";
import TouchPromptIcon from "assets/icons/touch-prompt.svg?react";

const YourTrips = ({
    isMobile,
    subheadingText,
}: {
    isMobile?: boolean;
    subheadingText?: string;
}) => {
    const { t } = useTranslation();
    const sharedStyles = neighborhoodDetailStyles({
        isMobile: isMobile,
    });
    const styles = yourTripsStyles({
        isMobile: isMobile,
    });

    const useTransit = useAppSelector(selectUseTransit);

    return (
        <div className={styles.root()}>
            <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-3">
                    <h2 className={sharedStyles.bodySectionHeading()}>
                        {t("yourTrips.heading")}
                    </h2>
                    <div className={styles.travelModePill()}>
                        {useTransit
                            ? t("yourTrips.busAndTrain")
                            : t("yourTrips.car")}
                    </div>
                </div>
                {subheadingText && <h4>{subheadingText}</h4>}
                <div className={sharedStyles.iconWithTextWrapper()}>
                    <TouchPromptIcon className={sharedStyles.inlineIcon()} />
                    <p className="text-gray-600 text-sm self-center">
                        {t("yourTrips.touchPrompt")}
                    </p>
                </div>
            </div>
            <Button
                variant="outline"
                size="large"
                className={styles.editButton()}
            >
                {t("yourTrips.editTrips")}
            </Button>
        </div>
    );
};

export default YourTrips;
