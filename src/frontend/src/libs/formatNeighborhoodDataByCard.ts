import type { NeighborhoodDetail } from "src/reducers/neighborhoods/types";

const formatNeighborhoodDataByCard = (
    neighborhoodDetail: NeighborhoodDetail,
    activeDestination: string,
    isTopTen: boolean
) => {
    const neighborhood = {
        name: neighborhoodDetail.town,
        zip: neighborhoodDetail.zipcode,
    };

    const image = {
        imageUrl: neighborhoodDetail.street_image,
    };

    const tags = {
        isTopTen: isTopTen,
        hasECC: neighborhoodDetail.ecc,
    };

    const stats = {
        schools: {
            label: "Schools",
            value: neighborhoodDetail.education_percentile ?? undefined,
            showCategory: true,
        },
        safety: {
            label: "Safety",
            value: neighborhoodDetail.crime_percentile ?? undefined,
            showCategory: true,
        },
        commute: {
            label: "Commute",
            start: neighborhoodDetail.commutes[activeDestination].commuteMin,
            end: neighborhoodDetail.commutes[activeDestination].commuteMax,
        },
    };

    return {
        cardFull: {
            ...neighborhood,
            ...image,
            ...tags,
            stats,
        },
        cardNoImageNoTag: {
            ...neighborhood,
            stats,
        },
        cardImageOnly: {
            ...neighborhood,
            ...image,
        },
        cardNoImage: {
            ...neighborhood,
            ...tags,
            stats,
        },
    };
};

export default formatNeighborhoodDataByCard;
