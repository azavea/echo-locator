import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import TouchPromptIcon from "assets/icons/touch-prompt.svg?react";
import Button from "components/base/Button/Button";
import neighborhoodDetailStyles from "pages/NeighborhoodDetail/styles/NeighborhoodDetail.styles";
import { setIsEditTripsWizardOpen } from "reducers/modalsDisplay/modalsDisplaySlice";
import { selectUseTransit } from "reducers/networks/networksSlice";
import type { Destination } from "reducers/userProfile/types";
import { selectUserProfile } from "reducers/userProfile/userSlice";
import { useAppSelector } from "store/store";
import CommuteGroup from "./CommuteGroup";
import type { TripType } from "./types";
import { yourTripsStyles } from "./YourTrips.styles";

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
    const dispatch = useDispatch();
    const sharedStyles = neighborhoodDetailStyles({
        isMobile: isMobile,
    });
    const styles = yourTripsStyles({
        isMobile: isMobile,
    });

    const { destinations, loading } = useAppSelector(selectUserProfile);
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
            {loading ? (
                <div className={styles.loadingWrapper()}>
                    <div className={styles.loadingSpinner()} />
                </div>
            ) : (
                <CommuteGroup
                    trips={
                        isTripToNeighborhood
                            ? tripsByDestination
                            : tripsByNeighborhood
                    }
                    isMobile={isMobile}
                    isTransit={useTransit}
                />
            )}
            <Button
                variant="outline"
                size="medium"
                className={styles.editButton()}
                isDisabled={loading}
                onPress={() => dispatch(setIsEditTripsWizardOpen(true))}
            >
                {t("yourTrips.editTrips")}
            </Button>
        </div>
    );
};

export default YourTrips;
