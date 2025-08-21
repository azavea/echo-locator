import { combineReducers } from "@reduxjs/toolkit";
import neighborhoodsReducer from "reducers/neighborhoods/neighborhoodsSlice";
import networksReducer from "reducers/networks/networksSlice";
import userProfileReducer from "reducers/userProfile/userSlice";

const rootReducer = combineReducers({
    neighborhoods: neighborhoodsReducer,
    networks: networksReducer,
    userProfile: userProfileReducer,
});

export default rootReducer;
