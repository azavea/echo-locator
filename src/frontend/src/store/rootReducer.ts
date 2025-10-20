import { combineReducers } from "@reduxjs/toolkit";
import neighborhoodsReducer from "reducers/neighborhoods/neighborhoodsSlice";
import networksReducer from "reducers/networks/networksSlice";
import userProfileReducer from "reducers/userProfile/userSlice";
import authReducer from "reducers/auth/authSlice";
import modalsDisplayReducer from "reducers/modalsDisplay/modalsDisplaySlice";

const rootReducer = combineReducers({
    neighborhoods: neighborhoodsReducer,
    networks: networksReducer,
    userProfile: userProfileReducer,
    auth: authReducer,
    modalsDisplay: modalsDisplayReducer,
});

export default rootReducer;
