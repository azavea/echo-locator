// @flow

// Labels for meter shading CSS categories
const METER_TIERS = ['low', 'med', 'high']

// Map value from one range to another
export default function scale (num, startMin, startMax, rangeMin, rangeMax) {
  return (num - startMin) * (rangeMax - rangeMin) / (startMax - startMin) + rangeMin
}

// Return CSS label for meter shading
export function getTier (percentage) {
  // Convert percentange to third to find shading tier
  return METER_TIERS[Math.round(scale(percentage, 0, 1, 0, 2))]
}
