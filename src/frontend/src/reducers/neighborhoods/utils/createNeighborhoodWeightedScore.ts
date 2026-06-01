// Copied from old codebase neighborhoods-sorted-with-routes at commit 6f17e33

import type { Feature, Point } from "geojson";
import type { NeighborhoodProperties } from "../types";
import type { CriteriaScoreWeights } from "reducers/userProfile/types";
import {
    DEFAULT_CRIME_QUINTILE,
    DEFAULT_EDUCATION_QUINTILE,
    MAX_QUINTILE,
    MAX_TRAVEL_TIME,
    MIN_QUINTILE,
    PROFILE_MAX_IMPORTANCE,
} from "src/constants";

// Map value from one range to another
const scale = (
    num: number,
    startMin: number,
    startMax: number,
    rangeMin: number,
    rangeMax: number
) => {
    return (
        ((num - startMin) * (rangeMax - rangeMin)) / (startMax - startMin) +
        rangeMin
    );
};

export const createNeighborhoodWeightedScore = (
    n: Feature<Point, NeighborhoodProperties>,
    userScoreWeights: CriteriaScoreWeights,
    time: number
) => {
    const {
        accessibilityImportance,
        crimeImportance,
        schoolsImportance,
        totalImportance,
    } = userScoreWeights;

    let accessibilityPercent = accessibilityImportance / totalImportance;
    let crimePercent = crimeImportance / totalImportance;
    let schoolPercent = schoolsImportance / totalImportance;

    const properties: NeighborhoodProperties = n.properties;
    // Routable neighborhoods outside the max travel time window filtered into separate list.
    // Smaller travel time is better; larger timeWeight is better (reverse range).
    const timeWeight =
        time < MAX_TRAVEL_TIME ? scale(time, 0, MAX_TRAVEL_TIME, 1, 0) : 0;
    // Weight schools either by percentile binned into quarters if given max importance,
    // or otherwise weight by quintile.
    let educationWeight;
    if (schoolsImportance === PROFILE_MAX_IMPORTANCE) {
        // "very important": instead of quintiles, group percentile ranking into quarters
        const edPercent = properties.education_percentile
            ? properties.education_percentile
            : (DEFAULT_EDUCATION_QUINTILE - 1) * 20;
        let edPercentQuarter = Math.round(scale(edPercent, 0, 100, 3, 0));
        // Treat all schools not in the top quarter as being in the bottom quarter
        // to strongly prioritize the top quarter
        if (edPercentQuarter > 0) {
            edPercentQuarter = 3;
        }
        educationWeight = scale(edPercentQuarter, 0, 3, 1, 0);
    } else if (schoolsImportance > 0) {
        // For "somewhat important", prioritize quintile 2 and below
        // For "important", quintile 3 and below (lower is better)
        const prioritizeQuintile = schoolsImportance === 1 ? 2 : 3;
        let educationQuintile = properties.education_percentile_quintile
            ? properties.education_percentile_quintile
            : DEFAULT_EDUCATION_QUINTILE;
        // Treat all quintiles above the maximum to prioritize as being in the worst quintile
        if (educationQuintile > prioritizeQuintile) {
            educationQuintile = MAX_QUINTILE;
        }
        // Lowest education quintile is best (reverse range).
        educationWeight = scale(
            educationQuintile,
            MIN_QUINTILE,
            MAX_QUINTILE,
            1,
            0
        );
    } else {
        educationWeight = 0; // Not important
    }
    let crimeWeight = 0;
    // Handle missing values (zero in spreadsheet) by re-assigning crime weight
    // evenly to the other two factors. Also do so if crime set as unimportant.
    if (properties.violentcrime_quintile === 0 || crimeImportance === 0) {
        const halfCrimePercent = crimePercent / 2;
        schoolPercent += halfCrimePercent;
        accessibilityPercent += halfCrimePercent;
        crimePercent = 0;
    } else {
        let crimeQuintile = properties.violentcrime_quintile
            ? properties.violentcrime_quintile
            : DEFAULT_CRIME_QUINTILE;
        // Treat lowest two (safest) violent crime quintiles equally
        if (crimeQuintile === 2) {
            crimeQuintile = 1;
        }
        if (crimeImportance === 1 && crimeQuintile < 5) {
            // somewhat important; treat all but worst quintile the same
            crimeQuintile = 1;
        } else if (crimeImportance === 2 && crimeQuintile < 4) {
            // "important"; treat all but worst two quintiles the same
            crimeQuintile = 1;
        } else if (
            crimeImportance === PROFILE_MAX_IMPORTANCE &&
            crimeQuintile > 3
        ) {
            // "very important"; push results for worst two quintiles to bottom
            // by reassigning weights for those quintiles to be 90% crime
            crimePercent = 0.9;
            schoolPercent /= 10;
            accessibilityPercent /= 10;
        }
        // Lowest crime quintile is best (reverse range).
        crimeWeight = scale(crimeQuintile, MIN_QUINTILE, MAX_QUINTILE, 1, 0);
    }

    // Calculate weighted overall score from the percentages. Larger score is better.
    const score =
        timeWeight * accessibilityPercent +
        crimeWeight * crimePercent +
        educationWeight * schoolPercent;
    return {
        score: score,
        timeWeight: timeWeight,
        crimeWeight: crimeWeight,
        educationWeight: educationWeight,
    };
};
