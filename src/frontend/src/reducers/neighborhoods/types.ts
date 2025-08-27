import type { FeatureCollection, MultiPolygon, Point } from "geojson";

export interface NeighborhoodProperties {
    crime_percentile: number | null;
    ecc: boolean;
    education_percentile: number;
    education_percentile_quintile: number;
    house_number_symbol: number;
    id: string; // same as zipcode; unique
    lat_lon_category: number;
    max_rent_0br: number | null;
    max_rent_1br: number | null;
    max_rent_2br: number | null;
    max_rent_3br: number | null;
    max_rent_4br: number | null;
    max_rent_5br: number | null;
    max_rent_6br: number | null;
    open_space_or_landmark: string;
    school: string;
    school_choice: boolean;
    street: string;
    total_mapc: number;
    town: string; // the label
    town_area: string; // zip code grouping (Boston, Cambridge, or blank)
    town_link: string;
    town_square: string;
    town_website_description: string;
    violentcrime_quintile: number | null;
    wikipedia: string;
    wikipedia_link: string;
    zipcode: string;
}

export interface Commutes {
    [key: string]: { purpose: string; commuteMin: number; commuteMax: number };
}

export interface NeighborhoodDetail extends NeighborhoodProperties {
    commutes: Commutes;
}

export interface NeighborhoodDetails {
    [key: string]: NeighborhoodDetail;
}

interface NeighborhoodBoundsProperties {
    id: string; //zipcode
    town: string;
    zipcode: string;
}

export type Neighborhoods = FeatureCollection<Point, NeighborhoodProperties>;

export type NeighborhoodBounds = FeatureCollection<
    MultiPolygon,
    NeighborhoodBoundsProperties
>;

export interface RankedNeighborhoodsLists {
    topTen: string[];
    groupedTopTen: (string | string[])[];
    groupedRecommended: (string | string[])[];
    groupedTooFar: (string | string[])[];
}

export interface NeighborhoodsSliceState {
    neighborhoods: Neighborhoods | null;
    neighborhoodBounds: NeighborhoodBounds | null;
    activeNeighborhood: string | null;
    loading: boolean;
    error: string | null;
    rankedNeighborhoodsLists: RankedNeighborhoodsLists;
}
