import type { Destination } from "src/reducers/userProfile/types";

export interface TripType {
    title: string;
    subtitle: string;
    neighborhoodZipcode: string;
    destination: Destination;
    tripToNeighborhood: boolean;
}
