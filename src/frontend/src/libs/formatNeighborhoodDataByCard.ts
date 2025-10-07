import type { NeighborhoodDetail } from "src/reducers/neighborhoods/types";

interface Stats {
    schools: {
        label: string;
        value: number;
        showCategory: boolean;
    };
    safety: {
        label: string;
        value: number | undefined;
        showCategory: boolean;
    };
    commute: {
        label: string;
        start: number;
        end: number;
    };
}

interface BaseCardData {
    name: string;
    zip: string;
}

interface CardOnlyImage extends BaseCardData {
    imageUrl: string;
}

interface CardNoImageOrTags extends BaseCardData {
    stats: Stats;
}

export interface CardNoImage extends CardNoImageOrTags {
    isTopTen: boolean;
    hasECC: boolean;
}

interface CardFull extends CardNoImage {
    imageUrl: string;
}

interface NeighborhoodDataByCardType {
    cardFull: CardFull;
    cardNoImageNoTag: CardNoImageOrTags;
    cardImageOnly: CardOnlyImage;
    cardNoImage: CardNoImage;
}

const formatNeighborhoodDataByCard = (
    neighborhoodDetail: NeighborhoodDetail,
    activeDestination: string,
    isTopTen: boolean
): NeighborhoodDataByCardType => {
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
