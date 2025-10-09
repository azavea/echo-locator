import type { Feature, FeatureCollection, MultiPolygon, Point } from "geojson";

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
    street_image: string;
    school_image: string;
    town_square_image: string;
    open_space_or_landmark_image: string | null;
    street_license: string;
    school_license: string;
    town_square_license: string;
    open_space_or_landmark_license: string;
    street_license_url: string;
    school_license_url: string;
    town_square_license_url: string;
    open_space_or_landmark_license_url: string;
    street_description: string;
    school_description: string;
    town_square_description: string;
    open_space_or_landmark_description: string;
    street_artist: string;
    school_artist: string;
    town_square_artist: string;
    open_space_or_landmark_artist: string;
    street_username: string;
    school_username: string;
    town_square_username: string;
    open_space_or_landmark_username: string;
    family_move_count: number;
    region: string | null;
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

export type Neighborhood = Feature<Point, NeighborhoodProperties>;
export type Neighborhoods = FeatureCollection<Point, NeighborhoodProperties>;

export type NeighborhoodBounds = FeatureCollection<
    MultiPolygon,
    NeighborhoodBoundsProperties
>;

export interface FiltersState {
    ecc?: boolean;
    regions?: string[];
    textSearch?: string;
}

export interface RankedNeighborhoodsLists {
    topTen: string[];
    recommended: string[];
    tooFar: string[];
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
    filters: FiltersState;
    rankCalculating: boolean;
    rankedNeighborhoodsLists: RankedNeighborhoodsLists;
}
