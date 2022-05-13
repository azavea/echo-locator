// @flow
import lonlat from "@conveyal/lonlat";
import memoize from "lodash/memoize";

import createTransitiveRoutes from "../utils/create-transitive-routes";
import createDirectRoutes from "../utils/create-direct-routes";
/**
 * This assumes loaded query, paths, and targets.
 */
export const memoizedTransitiveRoutes = memoize(
  (n, i, s, e, car) => (car ? createDirectRoutes(n, s, e) : createTransitiveRoutes(n, s, e)),
  (n, i, s, e, car) =>
    `${n.name}-${i}-${n.originPoint.x}-${n.originPoint.y}-${lonlat.toString(e.position)}-car-${car}`
);
