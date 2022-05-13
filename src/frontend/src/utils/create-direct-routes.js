// @flow
import type { Location, Path } from "../types";

type Network = {
  paths: Path[],
  targets: number[],
};

const PLACE = "PLACE";
const CAR = "CAR";

export default function createDirectRoutesForNetwork(
  network: Network,
  start: Location,
  end: Location
) {
  const td = network.transitive;
  const places = [
    {
      place_id: "from",
      place_name: start.label,
      place_lon: start.position.lon,
      place_lat: start.position.lat,
    },
    {
      place_id: "to",
      place_name: end.label,
      place_lon: end.position.lon,
      place_lat: end.position.lat,
    },
  ];

  // Map the paths to transitive journeys
  const journeys = [
    {
      journey_id: 0,
      journey_name: 0,
      segments: [
        {
          type: CAR,
          from: {
            type: PLACE,
            place_id: "from",
          },
          to: {
            type: PLACE,
            place_id: "to",
          },
        },
      ],
    },
  ];

  return {
    ...td,
    journeys,
    places,
    routeSegments: [
      [
        {
          backgroundColor: "#0b2b40",
          color: "#fff",
          name: "Car",
          type: "CAR",
        },
      ],
    ],
  };
}
