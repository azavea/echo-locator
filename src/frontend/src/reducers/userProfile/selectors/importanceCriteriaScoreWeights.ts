// Refactored from old codebase using latest commit before introducing listings: 8ca3b94
// Copied from neighborhoods-sorted-with-routes selector
import get from "lodash/get";

import {
    DEFAULT_ACCESSIBILITY_IMPORTANCE,
    DEFAULT_CRIME_IMPORTANCE,
    DEFAULT_SCHOOLS_IMPORTANCE,
    MAX_IMPORTANCE,
} from "../../../constants";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "store/store";
import type { CriteriaScoreWeights } from "../types";

// stored profile importance is offset by one from MAX_IMPORTANCE
const PROFILE_MAX_IMPORTANCE = MAX_IMPORTANCE - 1;
// extra constant weighting always given to travel time over the other two factors
const EXTRA_ACCESS_WEIGHT = 2;

export default createSelector(
    [(state: RootState) => get(state, "userProfile")],
    (profile): CriteriaScoreWeights => {
        const criteriaScoreWeights = {
            accessibilityImportance: 0,
            crimeImportance: 0,
            schoolsImportance: 0,
            totalImportance: 0,
        };
        let accessibilityImportance = profile.importanceAccessibility
            ? parseInt(profile.importanceAccessibility) - 1
            : DEFAULT_ACCESSIBILITY_IMPORTANCE;
        let crimeImportance = profile.importanceViolentCrime
            ? parseInt(profile.importanceViolentCrime) - 1
            : DEFAULT_CRIME_IMPORTANCE;
        let schoolsImportance = profile.importanceSchools
            ? parseInt(profile.importanceSchools) - 1
            : DEFAULT_SCHOOLS_IMPORTANCE;

        // If everything is unimportant, rank all factors equally.
        // If at least one factor has greater than the minimum importance, other factors will be
        // instead effectively turned off by setting them to minimum importance.
        if (
            accessibilityImportance + crimeImportance + schoolsImportance ===
            0
        ) {
            accessibilityImportance = crimeImportance = schoolsImportance = 1;
        }

        if (accessibilityImportance === PROFILE_MAX_IMPORTANCE) {
            // if set to very important, add more extra weight to travel time
            accessibilityImportance += 1;
        }

        // Always give accessibility (travel time) some extra weighting
        accessibilityImportance += EXTRA_ACCESS_WEIGHT;

        criteriaScoreWeights["accessibilityImportance"] =
            accessibilityImportance;
        criteriaScoreWeights["crimeImportance"] = crimeImportance;
        criteriaScoreWeights["schoolsImportance"] = schoolsImportance;
        criteriaScoreWeights["totalImportance"] =
            accessibilityImportance + crimeImportance + schoolsImportance;
        return criteriaScoreWeights;
    }
);
