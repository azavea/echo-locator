// @flow
import { handleActions } from "redux-actions";

export default handleActions(
  {
    "clear data"(state) {
      return {
        ...state,
        grids: [],
        networks: [],
        page: 0,
        showDetails: false,
        showFavorites: false,
        showBHAListings: false,
        showRealtorListings: false
      };
    },
    "set grid"(state, action) {
      const grids = [...state.grids];
      const gridIndex = grids.findIndex((g) => g.name === action.payload.name);

      if (gridIndex > -1) {
        grids[gridIndex] = { ...grids[gridIndex], ...action.payload };
      } else {
        grids.push(action.payload);
      }

      return {
        ...state,
        grids,
      };
    },
    "set network"(state, action) {
      const networks = [...state.networks];
      const networkIndex = networks.findIndex((n) => n.name === action.payload.name);

      if (networkIndex > -1) {
        networks[networkIndex] = { ...networks[networkIndex], ...action.payload };
      } else {
        networks.push(action.payload);
      }

      return {
        ...state,
        networks,
      };
    },
    "set active listing"(state, action) {
      return {
        ...state,
        activeListing: action.payload,
      };
    },
    "set active neighborhood"(state, action) {
      return {
        ...state,
        activeNeighborhood: action.payload,
      };
    },
    "set active network"(state, action) {
      const networks = [...state.networks];

      return {
        ...state,
        networks: networks.map((n) => Object.assign({}, n, { active: n.name === action.payload })),
      };
    },
    "set BHA listings"(state, action) {
      return {
        ...state,
        bhaListings: action.payload,
      };
    },
    "set points of interest"(state, action) {
      return {
        ...state,
        pointsOfInterest: action.payload,
      };
    },
    "set neighborhoods"(state, action) {
      return {
        ...state,
        neighborhoods: action.payload,
      };
    },
    "set neighborhood bounds"(state, action) {
      return {
        ...state,
        neighborhoodBounds: action.payload,
      };
    },
    "set origin"(state, action) {
      return {
        ...state,
        origin: action.payload,
      };
    },
    "set page"(state, action) {
      return {
        ...state,
        page: action.payload,
      };
    },
    "set profile loading"(state, action) {
      return {
        ...state,
        profileLoading: action.payload,
        userProfile: null,
      };
    },
    "set profile"(state, action) {
      return {
        ...state,
        profileLoading: false,
        userProfile: action.payload,
      };
    },
    "set Realtor listings"(state, action) {
      return {
        ...state,
        realtorListings: action.payload,
      };
    },
    "set show details"(state, action) {
      return {
        ...state,
        showDetails: !!action.payload,
      };
    },
    "set show favorites"(state, action) {
      return {
        ...state,
        showFavorites: !!action.payload,
      };
    },
    "set show BHA listing"(state, action) {
      return {
        ...state,
        showBHAListings: !!action.payload,
      };
    },
    "set show Realtor listing"(state, action) {
      return {
        ...state,
        showRealtorListings: !!action.payload,
      };
    },
    "set auth token"(state, action) {
      return {
        ...state,
        authToken: action.payload,
      };
    },
    "set login message"(state, action) {
      return {
        ...state,
        loginMessage: action.payload,
      };
    },
  },
  {
    grids: [
      {
        name: "home locations",
        icon: "home",
        url: "https://d2z7d5345ccuw9.cloudfront.net/5c9bdffa37ed813dbe27f8f1/Workers_with_earnings_1250_per_month_or_less.grid",
        showOnMap: true,
      },
    ],
    networks: [
      {
        name: "Peak",
        url: "https://d2z7d5345ccuw9.cloudfront.net/5c9bdffa37ed813dbe27f8f1",
        commuter: true,
      },
      {
        name: "Off Peak",
        url: "https://d2z7d5345ccuw9.cloudfront.net/5c9be04737ed813dbe27f8f3",
        commuter: true,
      },
      {
        name: "Peak No Express",
        url: "https://d2z7d5345ccuw9.cloudfront.net/5cb8ebc037ed813dbe29182e",
        commuter: false,
      },
      {
        name: "Off Peak No Express",
        url: "https://d2z7d5345ccuw9.cloudfront.net/5cb8ebe437ed813dbe291830",
        commuter: false,
      },
    ],
    neighborhoods: {},
    neighborhoodBounds: {},
    page: 0,
    profileLoading: true,
    showBHAListings: false,
    showDetails: false,
    showFavorites: false,
    showRealtorListings: false,
    userProfile: null,
  }
);
