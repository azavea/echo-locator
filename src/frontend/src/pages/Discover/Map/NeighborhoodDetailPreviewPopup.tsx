import { type PopupOptions } from "maplibre-gl";

import formatNeighborhoodDataByViewType from "libs/formatNeighborhoodDataByCard";
import { useNavigate } from "react-router";
import selectNeighborhoodZipcodeMap from "reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { selectActiveDestination } from "reducers/userProfile/userSlice";
import NeighborhoodCard from "src/components/NeighborhoodCard/NeighborhoodCard";
import { selectRankedNeighborhoodsLists } from "src/reducers/neighborhoods/neighborhoodsSlice";
import { useAppSelector } from "store/store";

export interface DetailPreviewPopupProps extends PopupOptions {
    zipcode?: string | null;
    longitude: number;
    latitude: number;
}

const NeighborhoodDetailPreviewPopup = ({
    zipcode,
}: DetailPreviewPopupProps) => {
    const navigate = useNavigate();
    const { topTen } = useAppSelector(selectRankedNeighborhoodsLists);
    const neighborhoodDetailsMap = useAppSelector(selectNeighborhoodZipcodeMap);
    const activeDestination = useAppSelector(selectActiveDestination);

    if (!activeDestination || !zipcode) {
        return <></>;
    }

    const { cardNoImage: neighborhoodCardData } =
        formatNeighborhoodDataByViewType(
            neighborhoodDetailsMap[zipcode],
            activeDestination,
            topTen.includes(zipcode)
        );

    const detailClick = () => {
        navigate(`${location.pathname}/${zipcode}?display=map`, {
            replace: true,
        });
    };

    return (
        <NeighborhoodCard
            {...neighborhoodCardData}
            onDetails={detailClick}
            isPopup
        />
    );
};

export default NeighborhoodDetailPreviewPopup;
