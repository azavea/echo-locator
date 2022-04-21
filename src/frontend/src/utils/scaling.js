// @flow
import get from "lodash/get";

// Labels for meter shading CSS categories
const METER_TIERS = ["low", "med", "high"];

// Inclusive ranges for the 'med' tier, keyed by chart category.
const BREAKS = {
  crime: [21, 40],
  school: [46, 65],
  rental: [3, 3],
};

// Map value from one range to another
export default function scale(num, startMin, startMax, rangeMin, rangeMax) {
  return ((num - startMin) * (rangeMax - rangeMin)) / (startMax - startMin) + rangeMin;
}

// Return CSS label for meter shading. Chart coloring breaks vary by `category`.
export function getTier(value, category) {
  const midBreak = get(BREAKS, category);
  if (!midBreak) {
    console.error("Could not find chart breaks for chart category " + category);
    return METER_TIERS[1];
  }
  if (value < midBreak[0]) {
    return METER_TIERS[0];
  } else if (value <= midBreak[1]) {
    return METER_TIERS[1];
  } else {
    return METER_TIERS[2];
  }
}
