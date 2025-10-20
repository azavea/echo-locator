import { NEIGHBORHOOD_REGIONS } from "src/constants";
import type { FiltersState, NeighborhoodProperties } from "../types";

// Filter out neighborhoods from ranked list using user selections.
// Filtered neighborhoods then grouped for list display
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

    const filterList = (zipList: string[]) =>
        zipList.filter(zip => {
            const passesEccFilter =
                !filters.ecc || neighborhoodPropsByZipcode[zip].ecc;
            const passesRegionFilter =
                filters.regions.length === NEIGHBORHOOD_REGIONS.length ||
                filters.regions.includes(
                    neighborhoodPropsByZipcode[zip].region ?? ""
                );
            const textSearchString =
                filters.textSearch?.trim().toLowerCase() ?? "";
            const passesTextSearchFilter =
                textSearchString.length === 0 ||
                zip.includes(textSearchString) ||
                neighborhoodPropsByZipcode[zip].town.includes(textSearchString);

            return (
                passesEccFilter && passesRegionFilter && passesTextSearchFilter
            );
        });

    return {
        recommended: filterList(neighborhoodsList.recommended),
        tooFar: filterList(neighborhoodsList.tooFar),
    };
};

export default filterNeighborhoodList;
