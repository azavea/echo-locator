import { NEIGHBORHOOD_REGIONS } from "src/constants";
import type { FiltersState, NeighborhoodProperties } from "../types";

// Filter neighborhoods from ranked list using user selections.
// Neighborhoods that don't meet criteria moved to "tooFar" list.
// Filtered neighborhoods then grouped for list display.
const filterNeighborhoodList = (
    neighborhoodsList: {
        recommended: string[];
        tooFar: string[];
    },
    filters: FiltersState,
    isFiltered: boolean,
    neighborhoodPropsByZipcode: Record<string, NeighborhoodProperties>
) => {
    if (!isFiltered) {
        return neighborhoodsList;
    }

    const { recommended: unfilteredRecommended, tooFar: unfilteredTooFar } =
        neighborhoodsList;

    const { recommended, tooFar } = unfilteredRecommended.reduce(
        (
            filteredNeighborhoods: {
                recommended: string[];
                tooFar: string[];
            },
            zip
        ) => {
            const passesEccFilter =
                !filters.ecc || neighborhoodPropsByZipcode[zip].ecc;
            const passesRegionFilter =
                filters.regions.length === NEIGHBORHOOD_REGIONS.length ||
                filters.regions.includes(
                    neighborhoodPropsByZipcode[zip].region ?? ""
                );
            if (passesEccFilter && passesRegionFilter) {
                filteredNeighborhoods.recommended.push(zip);
            } else {
                filteredNeighborhoods.tooFar.push(zip);
            }
            return filteredNeighborhoods;
        },
        {
            recommended: [],
            tooFar: [],
        }
    );

    return {
        recommended: recommended,
        tooFar: [...tooFar, ...unfilteredTooFar],
    };
};

export default filterNeighborhoodList;
