import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "store/redux-toolkit/slice/userSlice";
import watchlistReducer from "store/redux-toolkit/slice/watchlistSlice";

const rootReducers = combineReducers({
  userData: userReducer,
  watchlist: watchlistReducer,
});

const store = configureStore({
  reducer: rootReducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
