// @flow
import fetch from "@conveyal/woonerf/fetch";

import cacheURL from "../utils/cache-url";

export function loadDataFromJSON(url: string, type: string) {
  return fetch({
    url: cacheURL(url),
    next: (response) => ({
      type,
      payload: typeof response.value === "string" ? JSON.parse(response.value) : response.value,
    }),
  });
}
