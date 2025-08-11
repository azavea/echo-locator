import { useEffect } from "react";

import { getNeighborhoodsAndBounds } from "reducers/neighborhoods/neighborhoodsThunk";
import { useAppDispatch, useAppSelector, type RootState } from "store/store";
import useMediaQuery from "hooks/useMediaQuery";
import Desktop from "./Desktop";
import Mobile from "./Mobile";

const Discover = () => {
    const dispatch = useAppDispatch();
    const { loading, error, neighborhoods, neighborhoodBounds } =
        useAppSelector(({ neighborhoods }: RootState) => neighborhoods);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        // Fetch initial neighborhoods data
        const isNeighborhoodDataEmpty =
            !neighborhoods?.features || !neighborhoodBounds?.features;
        // TODO: Refactor on adding login workflow
        const testAuthToken = import.meta.env.VITE_AUTHTOKEN;
        if (!loading && !error && isNeighborhoodDataEmpty && testAuthToken) {
            dispatch(getNeighborhoodsAndBounds(testAuthToken));
        }
    }, []);

    return isDesktop ? <Desktop /> : <Mobile />;
};

export default Discover;
