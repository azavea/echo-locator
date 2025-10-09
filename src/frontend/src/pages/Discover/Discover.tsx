import { useEffect, useState } from "react";
import { useParams } from "react-router";

import {
    getNeighborhoodsAndBounds,
    getRankedNeighborhoodLists,
} from "reducers/neighborhoods/neighborhoodsThunk";
import { useAppDispatch, useAppSelector, type RootState } from "store/store";
import useMediaQuery from "hooks/useMediaQuery";
import Desktop from "./Desktop";
import Mobile from "./Mobile";
import {
    getNetworks,
    getAllTimesAndPathsData,
} from "reducers/networks/networksThunk";
import { selectAllNetworksDataReady } from "reducers/networks/networksSlice";
import { getUserProfile } from "reducers/userProfile/userProfileThunk";
import Profile from "./Profile/Profile";
import discoverStyles from "./Discover.styles";

const Discover = () => {
    const { zipcode } = useParams();
    const dispatch = useAppDispatch();
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
    const {
        destinations,
        loading: userProfileLoading,
        error: userProfileError,
    } = useAppSelector(({ userProfile }: RootState) => userProfile);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const { loadingWrapper, loadingSpinner } = discoverStyles({
        isMobile: !isDesktop,
    });

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
        if (destinations && neighborhoods && networks && !timesAndRoutesData) {
            dispatch(getAllTimesAndPathsData(destinations));
        }
    }, [destinations, neighborhoods, networks, timesAndRoutesData]);

    const networksDataIsReady = useAppSelector(selectAllNetworksDataReady);
    useEffect(() => {
        if (networksDataIsReady) {
            dispatch(getRankedNeighborhoodLists());
        }
    }, [networksDataIsReady]);
    // --------------------------------------

    useEffect(() => {
        setIsDetailModalOpen(!!zipcode);
    }, [zipcode]);

    return userProfileLoading ? (
        <div className={loadingWrapper()}>
            <div className={loadingSpinner()} />
        </div>
    ) : destinations.length ? (
        isDesktop ? (
            <Desktop
                isDetailModalOpen={isDetailModalOpen}
                setIsDetailModalOpen={setIsDetailModalOpen}
            />
        ) : (
            <Mobile
                isDetailModalOpen={isDetailModalOpen}
                setIsDetailModalOpen={setIsDetailModalOpen}
            />
        )
    ) : (
        <Profile />
    );
};

export default Discover;
