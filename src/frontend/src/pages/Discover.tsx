import { useEffect } from "react";
import { useAppDispatch, useAppSelector, type RootState } from "../store/store";
import { getNeighborhoodsAndBounds } from "reducers/neighborhoods/neighborhoodsThunk";

const Discover = () => {
    const dispatch = useAppDispatch();
    const { loading, error, neighborhoods, neighborhoodBounds } =
        useAppSelector(({ neighborhoods }: RootState) => neighborhoods);

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

    return <></>;
};

export default Discover;
