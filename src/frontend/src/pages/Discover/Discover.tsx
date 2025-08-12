import { useEffect } from "react";

import { getNeighborhoodsAndBounds } from "reducers/neighborhoods/neighborhoodsThunk";
import { useAppDispatch, useAppSelector, type RootState } from "store/store";
import useMediaQuery from "hooks/useMediaQuery";
import Desktop from "./Desktop";
import Mobile from "./Mobile";
import { getNetworks } from "src/reducers/networks/networksThunk";

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
    } = useAppSelector(({ networks }: RootState) => networks);
    const isDesktop = useMediaQuery("(min-width: 768px)");

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

    return isDesktop ? <Desktop /> : <Mobile />;
};

export default Discover;
