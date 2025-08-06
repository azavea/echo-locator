import { combineReducers } from '@reduxjs/toolkit';
import neighborhoodsReducer from '../features/neighborhoods/neighborhoodsSlice';

const rootReducer = combineReducers({
  neighborhoods: neighborhoodsReducer
});

export default rootReducer;
