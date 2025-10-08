import { useTranslation } from "react-i18next";

import Button from "components/base/Button/Button";
import { yourTripsStyles } from "./YourTrips.styles";
import { useAppSelector } from "src/store/store";
import { selectUseTransit } from "src/reducers/networks/networksSlice";
import neighborhoodDetailStyles from "src/pages/NeighborhoodDetail/styles/NeighborhoodDetail.styles";
import TouchPromptIcon from "assets/icons/touch-prompt.svg?react";
import CommuteGroup from "./CommuteGroup";
import type { TripType } from "./types";
import { selectUserDestinations } from "src/reducers/userProfile/userSlice";
import type { Destination } from "src/reducers/userProfile/types";
import { useMemo } from "react";

const YourTrips = ({
    isMobile,
    subheadingText,
    activeNeighborhood,
}: {
    isMobile?: boolean;
    subheadingText?: string;
    activeNeighborhood?: string;
}) => {
    const { t } = useTranslation();
    const sharedStyles = neighborhoodDetailStyles({
        isMobile: isMobile,
    });
    const styles = yourTripsStyles({
        isMobile: isMobile,
    });

    const destinations = useAppSelector(selectUserDestinations);
    const isTripToNeighborhood = !!activeNeighborhood;
    // TODO: Implement for compare page
    const favoritedNeighborhoods: string[] = [];
    const useTransit = useAppSelector(selectUseTransit);

    const tripsByDestination = useMemo(() => {
        return destinations.reduce(
            (tripsFromDest: TripType[], dest: Destination) => [
                ...tripsFromDest,
                {
                    title: dest.purpose,
                    subtitle: dest.location.label,
                    neighborhoodZipcode: activeNeighborhood ?? "",
                    destination: dest,
                    isTripToNeighborhood: !!isTripToNeighborhood,
                },
            ],
            []
        );
    }, [destinations]);

    const tripsByNeighborhood = favoritedNeighborhoods.reduce(
        /* @ts-ignore */
        (tripsFromZip, zip) => {
            // TODO: Implement for compare page
            return [];
        },
        []
    );

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
            <CommuteGroup
                trips={
                    isTripToNeighborhood
                        ? tripsByDestination
                        : tripsByNeighborhood
                }
                isMobile={isMobile}
                isTransit={useTransit}
            />
            <Button
                variant="outline"
                size="medium"
                className={styles.editButton()}
            >
                {t("yourTrips.editTrips")}
            </Button>
        </div>
    );
};

export default YourTrips;
