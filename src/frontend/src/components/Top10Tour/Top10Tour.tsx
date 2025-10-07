import { useState } from "react";
import { StartTourModal } from "./StartTourModal";
import { useSearchParams } from "react-router";
import NeighborhoodCard from "../NeighborhoodCard/NeighborhoodCard";
import { useAppSelector } from "src/store/store";
import { selectRankedNeighborhoodsLists } from "src/reducers/neighborhoods/neighborhoodsSlice";
import selectNeighborhoodZipcodeMap from "src/reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { top10TourStyles } from "./top10Tour.styles";

interface Props {
    isTop10TourOpen: boolean;
    setIsTop10TourOpen: (b: boolean) => void;
}

const Top10Tour = ({ isTop10TourOpen, setIsTop10TourOpen }: Props) => {
    const [_, setRouterParams] = useSearchParams();
    const [tourStep, setTourStep] = useState(-1);
    const { root } = top10TourStyles({ isOpen: isTop10TourOpen });
    const { topTen } = useAppSelector(selectRankedNeighborhoodsLists);
    const neighborhoodDetailsMap = useAppSelector(selectNeighborhoodZipcodeMap);

    const skipTourCallback = () => {
        setRouterParams({ display: "list" });
        setIsTop10TourOpen(false);
    };

    const startTourCallback = () => setTourStep(0);

    return (
        <div className={root()}>
            <StartTourModal
                isOpen={isTop10TourOpen && tourStep < 0}
                startTourCallback={startTourCallback}
                skipTourCallback={skipTourCallback}
            />
            {tourStep > -1 && (
                <NeighborhoodCard
                    zip={topTen[tourStep]}
                    name=""
                    {...neighborhoodDetailsMap[topTen[tourStep]]}
                    onClose={() => {}}
                    onPrev={() => {}}
                    onDetails={() => {}}
                    onNext={() => {}}
                />
            )}
        </div>
    );
};

export default Top10Tour;
