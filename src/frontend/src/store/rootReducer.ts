import { combineReducers } from "@reduxjs/toolkit";
import neighborhoodsReducer from "reducers/neighborhoods/neighborhoodsSlice";
import networksReducer from "reducers/networks/networksSlice";

const rootReducer = combineReducers({
    neighborhoods: neighborhoodsReducer,
    networks: networksReducer,
});

export default rootReducer;
