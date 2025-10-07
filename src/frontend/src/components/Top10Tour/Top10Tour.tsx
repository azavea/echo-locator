import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useAppSelector } from "src/store/store";
import { selectRankedNeighborhoodsLists } from "src/reducers/neighborhoods/neighborhoodsSlice";
import selectNeighborhoodZipcodeMap from "src/reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";

import formatNeighborhoodDataByViewType, {
    type CardNoImage,
} from "libs/formatNeighborhoodDataByCard";
import { top10TourStyles } from "./top10Tour.styles";
import { StartTourModal } from "./StartTourModal";
import NeighborhoodCard from "../NeighborhoodCard/NeighborhoodCard";
import {
    selectActiveDestination,
    setHasViewedStartInstructions,
} from "src/reducers/userProfile/userSlice";
import { useDispatch } from "react-redux";

interface Props {
    isTop10TourOpen: boolean;
    setIsTop10TourOpen: (b: boolean) => void;
    tourStopCallback: (n?: string) => void;
    showInstructions: boolean;
}

const MIN_STEP = 0;
const MAX_STEP = 9;

const Top10Tour = ({
    isTop10TourOpen,
    setIsTop10TourOpen,
    tourStopCallback,
    showInstructions,
}: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [_, setRouterParams] = useSearchParams();
    const dispatch = useDispatch();

    const [tourStep, setTourStep] = useState(-1);
    const [neighborhood, setNeighborhood] = useState<CardNoImage | null>(null);
    const { root } = top10TourStyles({
        isOpen: isTop10TourOpen,
    });
    const { topTen } = useAppSelector(selectRankedNeighborhoodsLists);
    const neighborhoodDetailsMap = useAppSelector(selectNeighborhoodZipcodeMap);
    const activeDestination = useAppSelector(selectActiveDestination);

    const skipTourCallback = () => {
        dispatch(setHasViewedStartInstructions(true));
        setRouterParams({ display: "list" });
        setIsTop10TourOpen(false);
    };

    const startTourCallback = () => {
        dispatch(setHasViewedStartInstructions(true));
        setTourStep(MIN_STEP);
    };

    const endTourCallback = () => {
        setIsTop10TourOpen(false);
        setTourStep(-1);
    };

    const detailClick = () => {
        endTourCallback();
        navigate(`${location.pathname}/${neighborhood?.zip}`, {
            replace: true,
        });
    };

    useEffect(() => {
        if (tourStep < MIN_STEP) {
            setNeighborhood(null);
            tourStopCallback();
        } else if (tourStep > MAX_STEP) {
            endTourCallback();
        } else if (activeDestination) {
            tourStopCallback(neighborhoodDetailsMap[topTen[tourStep]]?.id);
            const cardData = formatNeighborhoodDataByViewType(
                neighborhoodDetailsMap[topTen[tourStep]],
                activeDestination,
                true
            );
            setNeighborhood(cardData.cardNoImage as CardNoImage);
        }
    }, [tourStep]);

    useEffect(() => {
        if (!showInstructions && isTop10TourOpen && !neighborhood) {
            startTourCallback();
        }
    }, [isTop10TourOpen]);

    return (
        <div className={root()}>
            <StartTourModal
                isOpen={isTop10TourOpen && !neighborhood && showInstructions}
                startTourCallback={startTourCallback}
                skipTourCallback={skipTourCallback}
            />
            {neighborhood && (
                <NeighborhoodCard
                    {...neighborhood}
                    onClose={endTourCallback}
                    onPrev={
                        tourStep > MIN_STEP
                            ? () => setTourStep(tourStep - 1)
                            : undefined
                    }
                    onDetails={detailClick}
                    onNext={
                        tourStep < MAX_STEP
                            ? () => setTourStep(tourStep + 1)
                            : undefined
                    }
                />
            )}
        </div>
    );
};

export default Top10Tour;
