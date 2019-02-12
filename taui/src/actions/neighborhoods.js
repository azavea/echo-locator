// @flow
import fetch from '@conveyal/woonerf/fetch'

import cacheURL from '../utils/cache-url'

export function loadNeighborhoods (url: string) {
  return fetch({
    url: cacheURL(url),
    next: response => ({
      type: 'set neighborhoods',
      payload: typeof response.value === 'string'
        ? JSON.parse(response.value)
        : response.value
    })
  })
}
