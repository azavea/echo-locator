import type {
    FiltersState,
    NeighborhoodProperties,
    Neighborhoods,
} from "../types";

// Filter out neighborhoods from ranked list using user selections.
// Filtered neighborhoods then grouped for list display
const filterNeighborhoodList = (
    neighborhoodsList: {
        recommended: string[];
        tooFar: string[];
    },
    neighborhoods: Neighborhoods,
    filters: FiltersState
) => {
    if (!Object.keys(filters).length) {
        return neighborhoodsList;
    }

    const neighborhoodPropsByZipcode = neighborhoods.features.reduce(
        (neighborhoodPropsMap, neighborhood) => ({
            ...neighborhoodPropsMap,
            [neighborhood.properties.zipcode]: neighborhood.properties,
        }),
        {} as Record<string, NeighborhoodProperties>
    );

    let { recommended: filteredRecommended, tooFar: filteredTooFar } = {
        ...neighborhoodsList,
    };

    const filterEccOnly = (zipList: string[]) =>
        zipList.filter(zip => neighborhoodPropsByZipcode[zip].ecc);
    const filterByRegions = (zipList: string[], regions: string[]) =>
        zipList.filter(
            zip =>
                neighborhoodPropsByZipcode[zip].region &&
                regions.includes(neighborhoodPropsByZipcode[zip].region)
        );

    if (filters.ecc) {
        filteredRecommended = filterEccOnly(filteredRecommended);
        filteredTooFar = filterEccOnly(filteredTooFar);
    }
    if (filters.regions) {
        filteredRecommended = filterByRegions(
            filteredRecommended,
            filters.regions
        );
        filteredTooFar = filterByRegions(filteredTooFar, filters.regions);
    }
    if (filters.textSearch) {
        if (filters.textSearch.trim() !== "") {
            // TODO: Apply text search
        }
    }

    return {
        recommended: filteredRecommended,
        tooFar: filteredTooFar,
    };
};

export default filterNeighborhoodList;
