import { combineReducers } from "@reduxjs/toolkit";
import neighborhoodsReducer from "../reducers/neighborhoods/neighborhoodsSlice";

const rootReducer = combineReducers({
    neighborhoods: neighborhoodsReducer,
});

export default rootReducer;
