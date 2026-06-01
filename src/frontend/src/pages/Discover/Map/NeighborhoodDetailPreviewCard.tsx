import { useLocation, useNavigate } from "react-router";

import selectNeighborhoodZipcodeMap from "reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { selectActiveDestination } from "reducers/userProfile/userSlice";
import { useAppSelector } from "store/store";

import NeighborhoodCard from "components/NeighborhoodCard/NeighborhoodCard";
import { top10TourStyles } from "components/Top10Tour/top10Tour.styles";
import formatNeighborhoodDataByViewType from "libs/formatNeighborhoodDataByCard";

const NeighborhoodDetailPreviewCard = ({
    isPreviewOpen,
    onPreviewOpenChange,
    zipcode,
}: {
    isPreviewOpen: boolean;
    onPreviewOpenChange: () => void;
    zipcode: string | null;
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const sharedStyles = top10TourStyles();
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

    const detailClick = () => {
        onPreviewOpenChange();
        navigate(`${location.pathname}/${zipcode}?display=map`, {
            replace: true,
        });
    };

    return (
        <div
            className={sharedStyles.root({
                isOpen: isPreviewOpen,
            })}
        >
            <NeighborhoodCard
                {...neighborhoodCardData}
                onClose={onPreviewOpenChange}
                onDetails={detailClick}
            />
        </div>
    );
};

export default NeighborhoodDetailPreviewCard;
