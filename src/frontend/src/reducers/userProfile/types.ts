import type { PlaceKey } from "src/enums";
import type { Location } from "../networks/types";

export interface CriteriaScoreWeights {
    accessibilityImportance: number;
    crimeImportance: number;
    schoolsImportance: number;
    totalImportance: number;
}

export interface Destination {
    location: Location;
    primary: boolean;
    purpose: PlaceKey;
}

export interface UserProfileSliceState {
    activeDestination?: string; // Location label
    destinations: Destination[];
    favorites: string[];
    hasVehicle: boolean;
    importanceAccessibility: string;
    importanceSchools: string;
    importanceViolentCrime: string;
    rooms: number;
    useCommuterRail: boolean;
}
