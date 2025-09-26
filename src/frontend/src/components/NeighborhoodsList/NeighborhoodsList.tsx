import { useState } from "react";

import type { NeighborhoodDetails } from "reducers/neighborhoods/types";
import formatNeighborhoodDataByViewType from "libs/formatNeighborhoodDataByCard";
import Button from "components/base/Button/Button";

import { listStyles } from "./NeighborhoodsList.styles";
import ClickableNeighborhoodCard from "../NeighborhoodCard/ClickableNeighborhoodCard";

interface Props {
    neighborhoodDetailsMap: NeighborhoodDetails;
    neighborhoodList: (string | string[])[];
    activeDestination: string;
    lastPageCallback?: () => void;
    isTopTen?: boolean;
    isMobile?: boolean;
    isGroup?: boolean;
}

const NeighborhoodList = ({
    neighborhoodDetailsMap,
    neighborhoodList,
    activeDestination,
    lastPageCallback,
    isTopTen,
    isMobile,
    isGroup,
}: Props) => {
    const {
        root,
        listContainer,
        groupContainer,
        groupTitle,
        groupCount,
        button,
    } = listStyles({ isMobile: isMobile, isGroup: isGroup });

    // Display 10 Neighborhood cards per page.
    // If it's a grouped-by-neighborhood-name list,
    // only show 2 per "page" to preserve space.
    const OFFSET = isGroup ? 2 : 10;
    const [page, setPage] = useState(1);
    const listToDisplay = neighborhoodList.slice(0, OFFSET * page);
    const groupName =
        neighborhoodDetailsMap[neighborhoodList[0].toString()]?.town;

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        if (OFFSET * nextPage >= neighborhoodList.length && lastPageCallback) {
            lastPageCallback();
        }
    };

    return (
        <div className={root()}>
            {isGroup && (
                <div className={groupContainer()}>
                    <p className={groupTitle()}>{groupName}</p>
                    <p className={groupCount()}>
                        {neighborhoodList.length} zip codes
                    </p>
                </div>
            )}
            <div className={listContainer()}>
                {listToDisplay.map((zipcodeOrGroup, i) => {
                    if (Array.isArray(zipcodeOrGroup)) {
                        return (
                            <NeighborhoodList
                                key={i}
                                neighborhoodDetailsMap={neighborhoodDetailsMap}
                                neighborhoodList={zipcodeOrGroup}
                                activeDestination={activeDestination}
                                isTopTen={isTopTen}
                                isMobile={isMobile}
                                isGroup
                            />
                        );
                    } else {
                        const data = formatNeighborhoodDataByViewType(
                            neighborhoodDetailsMap[zipcodeOrGroup],
                            activeDestination,
                            !!isTopTen
                        );
                        return (
                            <ClickableNeighborhoodCard
                                key={i}
                                {...data.cardFull}
                                listViewStyling={{ listView: true }}
                                isMobile={isMobile}
                            />
                        );
                    }
                })}
                {neighborhoodList.length > OFFSET * page && (
                    <Button
                        variant="outline"
                        size="small"
                        className={button()}
                        onClick={handleLoadMore}
                    >
                        Load More
                    </Button>
                )}
            </div>
        </div>
    );
};

export default NeighborhoodList;
