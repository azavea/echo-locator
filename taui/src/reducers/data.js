// @flow
import {handleActions} from 'redux-actions'

export default handleActions(
  {
    'clear data' (state) {
      return {
        ...state,
        grids: [],
        networks: []
      }
    },
    'set grid' (state, action) {
      const grids = [...state.grids]
      const gridIndex = grids.findIndex(g => g.name === action.payload.name)

      if (gridIndex > -1) {
        grids[gridIndex] = {...grids[gridIndex], ...action.payload}
      } else {
        grids.push(action.payload)
      }

      return {
        ...state,
        grids
      }
    },
    'set network' (state, action) {
      const networks = [...state.networks]
      const networkIndex = networks.findIndex(
        n => n.name === action.payload.name
      )

      if (networkIndex > -1) {
        networks[networkIndex] = {...networks[networkIndex], ...action.payload}
      } else {
        networks.push(action.payload)
      }

      return {
        ...state,
        networks
      }
    },
    'set active neighborhood' (state, action) {
      return {
        ...state,
        activeNeighborhood: action.payload
      }
    },
    'set active network' (state, action) {
      const networks = [...state.networks]

      return {
        ...state,
        networks: networks.map(
          n => Object.assign({}, n, {active: n.name === action.payload})
        )
      }
    },
    'set points of interest' (state, action) {
      return {
        ...state,
        pointsOfInterest: action.payload
      }
    },
    'set neighborhoods' (state, action) {
      return {
        ...state,
        neighborhoods: action.payload
      }
    },
    'set neighborhood bounds' (state, action) {
      return {
        ...state,
        neighborhoodBounds: action.payload
      }
    },
    'set origin' (state, action) {
      return {
        ...state,
        origin: action.payload
      }
    },
    'set profile loading' (state, action) {
      return {
        ...state,
        profileLoading: action.payload,
        userProfile: null
      }
    },
    'set profile' (state, action) {
      return {
        ...state,
        profileLoading: false,
        userProfile: action.payload
      }
    },
    'set show details' (state, action) {
      return {
        ...state,
        showDetails: !!action.payload
      }
    }
  },
  {
    grids: [],
    networks: [],
    neighborhoods: {},
    neighborhoodBounds: {},
    profileLoading: true,
    showDetails: false,
    userProfile: null
  }
)
