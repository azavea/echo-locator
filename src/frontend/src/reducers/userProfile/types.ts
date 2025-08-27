export interface CriteriaScoreWeights {
    accessibilityImportance: number;
    crimeImportance: number;
    schoolsImportance: number;
    totalImportance: number;
}

interface Destination {
    location: Location;
    primary: boolean;
    purpose: string;
}

export interface UserProfileSliceState {
    destinations: Destination[];
    favorites: string[];
    hasVehicle: boolean;
    importanceAccessibility: string;
    importanceSchools: string;
    importanceViolentCrime: string;
    rooms: number;
    useCommuterRail: boolean;
}
