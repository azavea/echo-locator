import { useEffect, useState } from "react";

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
import { Place } from "src/enums";
import {
    setActiveDestination,
    setDestinations,
} from "src/reducers/userProfile/userSlice";
import { useParams } from "react-router";

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
    const { destinations } = useAppSelector(
        ({ userProfile }: RootState) => userProfile
    );
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // TODO: Refactor below following login and user profile
    // Exists to kick-off ranking/routing with static origin
    // --------------------------------------
    useEffect(() => {
        // Fetch initial neighborhoods data
        const isNeighborhoodDataEmpty =
            !neighborhoods?.features || !neighborhoodBounds?.features;
        // TODO: Refactor on adding login workflow
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
        if (neighborhoods && networks) {
            // 700 Boylston St
            dispatch(
                setDestinations([
                    {
                        location: {
                            label: "700 Boylston St",
                            position: { lon: -71.078711, lat: 42.349319 },
                        },
                        primary: true,
                        purpose: Place.Work,
                    },
                    {
                        location: {
                            label: "Harvard Square",
                            position: { lon: -71.12015, lat: 42.37257 },
                        },
                        primary: false,
                        purpose: Place.School,
                    },
                    {
                        location: {
                            label: "John F. Kennedy Presidential Library",
                            position: { lon: -71.0342146, lat: 42.316274 },
                        },
                        primary: false,
                        purpose: Place.Other,
                    },
                ])
            );
            dispatch(setActiveDestination("700 Boylston St"));
        }
    }, [neighborhoods, networks]);

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

    return isDesktop ? (
        <Desktop
            isDetailModalOpen={isDetailModalOpen}
            setIsDetailModalOpen={setIsDetailModalOpen}
        />
    ) : (
        <Mobile
            isDetailModalOpen={isDetailModalOpen}
            setIsDetailModalOpen={setIsDetailModalOpen}
        />
    );
};

export default Discover;
