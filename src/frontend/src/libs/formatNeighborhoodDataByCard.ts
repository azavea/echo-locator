import type { MeterProps } from "src/components/base/Meter/Meter";
import type { RangeProps } from "src/components/base/Range/Range";
import type { SchoolMeterProps } from "src/components/SchoolMeter";
import { BOSTON_TOWN_AREA } from "src/constants";
import type { NeighborhoodDetail } from "src/reducers/neighborhoods/types";

export interface Stats {
    schools: SchoolMeterProps;
    safety: MeterProps;
    commute: RangeProps;
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

export const isNeighborhoodBostonTownArea = (town_area: string) =>
    town_area === BOSTON_TOWN_AREA;

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
        imageUrl:
            neighborhoodDetail.street_image ??
            neighborhoodDetail.town_square_image ??
            neighborhoodDetail.school_image ??
            neighborhoodDetail.open_space_or_landmark_image,
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
            isBoston: isNeighborhoodBostonTownArea(
                neighborhoodDetail.town_area
            ),
            isSchoolChoice: neighborhoodDetail.school_choice,
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
