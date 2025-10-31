import { useEffect } from "react";
import { useParams } from "react-router";

import useMediaQuery from "hooks/useMediaQuery";
import {
    setIsEditTripsWizardOpen,
    setIsNeighborhoodDetailsOpen,
} from "reducers/modalsDisplay/modalsDisplaySlice";
import {
    getNeighborhoodsAndBounds,
    getRankedNeighborhoodLists,
} from "reducers/neighborhoods/neighborhoodsThunk";
import {
    selectActiveMode,
    selectAllNetworksDataReady,
    selectInvalidTimesAndPathsData,
} from "reducers/networks/networksSlice";
import {
    getAllTimesAndPathsData,
    getNetworks,
} from "reducers/networks/networksThunk";
import { getUserProfile } from "reducers/userProfile/userProfileThunk";
import EditTripsWizard from "src/components/EditWizard/EditTripsWizard";
import { useAppDispatch, useAppSelector, type RootState } from "store/store";
import Desktop from "./Desktop";
import discoverStyles from "./Discover.styles";
import Mobile from "./Mobile";
import Profile from "./Profile/Profile";

const Discover = () => {
    const { zipcode } = useParams();
    const dispatch = useAppDispatch();
    const {
        loading: neighborhoodsLoading,
        error: neighborhoodsError,
        neighborhoods,
        neighborhoodBounds,
    } = useAppSelector(({ neighborhoods }: RootState) => neighborhoods);
    const {
        loading: networksLoading,
        error: networksError,
        networks,
        timesAndRoutesData,
    } = useAppSelector(({ networks }: RootState) => networks);
    const userProfile = useAppSelector(
        ({ userProfile }: RootState) => userProfile
    );
    const {
        destinations,
        loading: userProfileLoading,
        error: userProfileError,
    } = userProfile;
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // TODO: Refactor below following login and user profile
    // Exists to kick-off ranking/routing with static origin
    // --------------------------------------
    useEffect(() => {
        // Fetch initial neighborhoods data
        const isNeighborhoodDataEmpty =
            !neighborhoods?.features || !neighborhoodBounds?.features;
        if (
            !neighborhoodsLoading &&
            !neighborhoodsError &&
            isNeighborhoodDataEmpty
        ) {
            dispatch(getNeighborhoodsAndBounds());
        }
    }, []);

    useEffect(() => {
        // Fetch initial networks data
        if (!networksLoading && !networksError && !networks) {
            dispatch(getNetworks());
        }
    }, []);

    useEffect(() => {
        if (!userProfileLoading && !userProfileError) {
            dispatch(getUserProfile());
        }
    }, []);

    useEffect(() => {
        if (
            destinations.length &&
            neighborhoods &&
            networks &&
            !timesAndRoutesData
        ) {
            dispatch(getAllTimesAndPathsData(destinations));
        }
    }, [destinations, neighborhoods, networks, timesAndRoutesData]);

    const networksDataIsReady = useAppSelector(selectAllNetworksDataReady);
    const invalidData = useAppSelector(selectInvalidTimesAndPathsData);
    const showHandleInvalidData =
        !userProfileLoading && destinations.length && invalidData?.length;
    const activeMode = useAppSelector(selectActiveMode);
    useEffect(() => {
        if (
            networksDataIsReady &&
            activeMode &&
            !userProfileLoading &&
            !userProfileError
        ) {
            dispatch(getRankedNeighborhoodLists());
        }
    }, [networksDataIsReady, activeMode, userProfile]);

    useEffect(() => {
        if (showHandleInvalidData) dispatch(setIsEditTripsWizardOpen(true));
    }, [showHandleInvalidData]);
    // --------------------------------------

    useEffect(() => {
        dispatch(setIsNeighborhoodDetailsOpen(!!zipcode));
    }, [zipcode]);

    const { loadingWrapper, loadingSpinner } = discoverStyles({
        isMobile: !isDesktop,
        isLoading: !networksDataIsReady && !showHandleInvalidData,
    });

    // Separate loading states between loading data and loading data + user profile.
    // Handling the load state of initial data outside of child components prevents
    // screen-wide loading spinner during small user profile updates like favoriting.
    return !networksDataIsReady &&
        (userProfileLoading || destinations.length) ? (
        <div className={loadingWrapper()}>
            <div className={loadingSpinner()} />
            <EditTripsWizard />
        </div>
    ) : destinations.length ? (
        isDesktop ? (
            <Desktop />
        ) : (
            <Mobile />
        )
    ) : (
        <Profile />
    );
};

export default Discover;
