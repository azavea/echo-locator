import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { selectRankedNeighborhoodsLists } from "reducers/neighborhoods/neighborhoodsSlice";
import selectNeighborhoodZipcodeMap from "reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import {
    selectActiveDestination,
    setHasViewedStartInstructions,
} from "reducers/userProfile/userSlice";
import { useAppSelector } from "store/store";

import formatNeighborhoodDataByViewType, {
    type CardNoImage,
} from "libs/formatNeighborhoodDataByCard";
import NeighborhoodCard from "../NeighborhoodCard/NeighborhoodCard";
import { StartTourModal } from "./StartTourModal";
import { top10TourStyles } from "./top10Tour.styles";

interface Props {
    isTop10TourOpen: boolean;
    setIsTop10TourOpen: (b: boolean) => void;
    tourStopCallback: (n?: string) => void;
    outsideTourStopTriggered: boolean;
    setOutsideTourStopTriggered: (b: boolean) => void;
    showInstructions: boolean;
}

const MIN_STEP = 0;

const Top10Tour = ({
    isTop10TourOpen,
    setIsTop10TourOpen,
    tourStopCallback,
    outsideTourStopTriggered,
    setOutsideTourStopTriggered,
    showInstructions,
}: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setRouterParams] = useSearchParams();
    const isMap = searchParams.get("display") === "map";
    const dispatch = useDispatch();

    const [tourStep, setTourStep] = useState(-1);
    const [neighborhood, setNeighborhood] = useState<CardNoImage | null>(null);
    const { root } = top10TourStyles({
        isOpen: isTop10TourOpen,
    });
    const { topTen } = useAppSelector(selectRankedNeighborhoodsLists);
    const neighborhoodDetailsMap = useAppSelector(selectNeighborhoodZipcodeMap);
    const activeDestination = useAppSelector(selectActiveDestination);
    const MAX_STEP = topTen.length - 1; // MAX 9

    const skipTourCallback = (showList?: boolean) => {
        dispatch(setHasViewedStartInstructions(true));
        setIsTop10TourOpen(false);
        showList && setRouterParams({ display: "list" });
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

    useEffect(() => {
        if (outsideTourStopTriggered) {
            endTourCallback();
            // reset
            setOutsideTourStopTriggered(false);
        }
    }, [outsideTourStopTriggered]);

    return (
        <div className={root()}>
            <StartTourModal
                isOpen={
                    isTop10TourOpen &&
                    !neighborhood &&
                    showInstructions &&
                    isMap
                }
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
