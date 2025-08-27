import { useEffect } from "react";

import {
    getNeighborhoodsAndBounds,
    getRankedNeighborhoodLists,
} from "reducers/neighborhoods/neighborhoodsThunk";
import { useAppDispatch, useAppSelector, type RootState } from "store/store";
import useMediaQuery from "hooks/useMediaQuery";
import Desktop from "./Desktop";
import Mobile from "./Mobile";
import {
    getAllTimesAndPaths,
    getNetworks,
} from "reducers/networks/networksThunk";
import {
    selectAllNetworksDataReady,
    setOrigin,
} from "reducers/networks/networksSlice";

const Discover = () => {
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
        origin,
    } = useAppSelector(({ networks }: RootState) => networks);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // TODO: Refactor below following login and user profile
    // Exists to kick-off ranking/routing with static origin
    // --------------------------------------
    useEffect(() => {
        // Fetch initial neighborhoods data
        const isNeighborhoodDataEmpty =
            !neighborhoods?.features || !neighborhoodBounds?.features;
        // TODO: Refactor on adding login workflow
        const testAuthToken = import.meta.env.VITE_AUTHTOKEN;
        if (
            !neighborhoodsLoading &&
            !neighborhoodsError &&
            isNeighborhoodDataEmpty &&
            testAuthToken
        ) {
            dispatch(getNeighborhoodsAndBounds(testAuthToken));
        }
    }, []);

    useEffect(() => {
        // Fetch initial networks data
        if (!networksLoading && !networksError && !networks) {
            dispatch(getNetworks());
        }
    }, []);

    useEffect(() => {
        if (neighborhoods && networks) {
            // 700 Boylston St
            dispatch(setOrigin({ lon: -71.078711, lat: 42.349319 }));
        }
    }, [neighborhoods, networks]);

    useEffect(() => {
        const initialTimesAndPathsDataSet =
            networks &&
            Object.values(networks).every(n => n.timesAndPathsDataReady);
        if (
            neighborhoods &&
            networks &&
            origin &&
            !networksLoading &&
            !networksError &&
            !initialTimesAndPathsDataSet
        ) {
            dispatch(getAllTimesAndPaths(origin));
        }
    }, [neighborhoods, networks, origin]);

    const networksDataIsReady = useAppSelector(selectAllNetworksDataReady);
    useEffect(() => {
        if (networksDataIsReady) {
            dispatch(getRankedNeighborhoodLists());
        }
    }, [networksDataIsReady]);
    // --------------------------------------

    return isDesktop ? <Desktop /> : <Mobile />;
};

export default Discover;
