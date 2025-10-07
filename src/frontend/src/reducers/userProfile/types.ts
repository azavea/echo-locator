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

interface UserProfileBase {
    destinations: Destination[];
    favorites: string[];
    hasVehicle: boolean;
    useCommuterRail: boolean;
}

export interface UserProfileSliceState extends UserProfileBase {
    loading: boolean;
    error: string | null;
    activeDestination?: string; // Location label
    importanceAccessibility: string;
    importanceSchools: string;
    importanceViolentCrime: string;
    rooms: number;
}

export interface UserProfile extends UserProfileBase {
    importanceAccessibility: number;
    importanceSchools: number;
    importanceViolentCrime: number;
    voucherRooms: number | null;
}
