import { type PopupOptions } from "maplibre-gl";

import formatNeighborhoodDataByViewType from "libs/formatNeighborhoodDataByCard";
import selectNeighborhoodZipcodeMap from "reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { selectActiveDestination } from "reducers/userProfile/userSlice";
import NeighborhoodCard from "src/components/NeighborhoodCard/NeighborhoodCard";
import { useAppSelector } from "store/store";

export interface DetailPreviewPopupProps extends PopupOptions {
    zipcode?: string | null;
    longitude: number;
    latitude: number;
}

const NeighborhoodDetailPreviewPopup = ({
    zipcode,
}: DetailPreviewPopupProps) => {
    const neighborhoodDetailsMap = useAppSelector(selectNeighborhoodZipcodeMap);
    const activeDestination = useAppSelector(selectActiveDestination);

    if (!activeDestination || !zipcode) {
        return <></>;
    }

    const { cardNoImage: neighborhoodCardData } =
        formatNeighborhoodDataByViewType(
            neighborhoodDetailsMap[zipcode],
            activeDestination,
            true
        );

    return <NeighborhoodCard {...neighborhoodCardData} isPopup />;
};

export default NeighborhoodDetailPreviewPopup;
