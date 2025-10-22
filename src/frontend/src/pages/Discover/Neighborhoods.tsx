import { useEffect, useState } from "react";

import NeighborhoodList from "components/NeighborhoodsList/NeighborhoodsList";
import {
    selectIsRankCalculating,
    selectRankedNeighborhoodsLists,
} from "reducers/neighborhoods/neighborhoodsSlice";
import selectNeighborhoodZipcodeMap from "reducers/neighborhoods/selectors/selectNeighborhoodZipcodeMap";
import { selectAllNetworksDataReady } from "reducers/networks/networksSlice";
import { selectActiveDestination } from "reducers/userProfile/userSlice";
import SearchList from "src/components/SearchList";
import { useAppSelector } from "store/store";
import discoverStyles from "./Discover.styles";

const NEIGHBORHOOD_CARD_PER_PAGE = 10;

const Neighborhoods = ({
    mobile,
    listDisplay = false,
}: {
    mobile: boolean;
    listDisplay?: boolean;
}) => {
    const [showTooFar, setShowTooFar] = useState(false);
    const {
        recoContainer,
        recoContainerHeader,
        subTitleContainer,
        subTitle,
        description,
        swatch,
        recoList,
        recoTitleContainer,
        recoTitle,
        recoDescription,
        loadingWrapper,
        loadingSpinner,
    } = discoverStyles({
        isMobile: mobile,
        mobileListDisplay: mobile ? listDisplay : true,
    });

    const networksReady = useAppSelector(selectAllNetworksDataReady);
    const isRankCalculating = useAppSelector(selectIsRankCalculating);
    const isLoading = isRankCalculating || !networksReady;
    const neighborhoodDetailsMap = useAppSelector(selectNeighborhoodZipcodeMap);
    const {
        groupedTopTen: topTen,
        groupedRecommended: recommended,
        groupedTooFar: tooFar,
    } = useAppSelector(selectRankedNeighborhoodsLists);
    const activeDestination = useAppSelector(selectActiveDestination) ?? "";

    // Only show the tooFar list if there are no recommendations
    // or if all recommendations have been displayed.
    // The last page of the recommendations list triggers
    // a callback to set showTooFar to true.
    useEffect(() => {
        if (isLoading) {
            return;
        }
        setShowTooFar(recommended.length < NEIGHBORHOOD_CARD_PER_PAGE);
    }, [isLoading, recommended]);

    return (
        <div className={recoContainer()}>
            <div className={recoContainerHeader()}>
                <SearchList isMobile={mobile} />
                {/* Sub-title */}
                <div className={subTitleContainer()}>
                    <p className={subTitle()}>Discover Neighborhoods</p>
                    <p className={description()}>
                        Recommendations are based on your profile and selected
                        trip
                    </p>
                </div>
                {isLoading && (
                    <div className={loadingWrapper()}>
                        <div className={loadingSpinner()} />
                    </div>
                )}
            </div>

            {/* Top 10 list */}
            {topTen.length > 0 && (
                <div className={recoList()}>
                    <div>
                        <div className={recoTitleContainer()}>
                            <p className={recoTitle()}>Top 10</p>
                            <div
                                className={swatch({
                                    swatchColor: "topTen",
                                })}
                            ></div>
                        </div>
                        <p className={recoDescription()}>
                            Highest-ranked recommendations
                        </p>
                    </div>
                    <NeighborhoodList
                        neighborhoodList={topTen}
                        neighborhoodDetailsMap={neighborhoodDetailsMap}
                        activeDestination={activeDestination}
                        isMobile
                        isTopTen
                    />
                </div>
            )}

            {/* Recommended list */}
            {recommended.length > 0 && (
                <div className={recoList()}>
                    <div>
                        <div className={recoTitleContainer()}>
                            <p className={recoTitle()}>Recommended</p>
                            <div
                                className={swatch({
                                    swatchColor: "recommended",
                                })}
                            ></div>
                        </div>
                        <p className={recoDescription()}>
                            Other recommended neighborhoods
                        </p>
                    </div>
                    <NeighborhoodList
                        neighborhoodList={recommended}
                        neighborhoodDetailsMap={neighborhoodDetailsMap}
                        activeDestination={activeDestination}
                        lastPageCallback={() => setShowTooFar(true)}
                        isMobile
                    />
                </div>
            )}

            {/* Too far list */}
            {showTooFar && tooFar.length > 0 && (
                <div className={recoList()}>
                    <div>
                        <div className={recoTitleContainer()}>
                            <p className={recoTitle()}>Not a match</p>
                            <div
                                className={swatch({ swatchColor: "tooFar" })}
                            ></div>
                        </div>
                        <p className={recoDescription()}>
                            These neighborhoods are out of reach with your
                            selected transit option, meaning commute times
                            exceeding 1 hour
                        </p>
                    </div>
                    <NeighborhoodList
                        neighborhoodList={tooFar}
                        neighborhoodDetailsMap={neighborhoodDetailsMap}
                        activeDestination={activeDestination}
                        isMobile
                    />
                </div>
            )}
        </div>
    );
};

export default Neighborhoods;
