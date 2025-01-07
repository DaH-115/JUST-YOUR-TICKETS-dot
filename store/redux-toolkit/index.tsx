import { configureStore, combineReducers } from "@reduxjs/toolkit";
import newReviewAlertSlice from "store/redux-toolkit/slice/newReviewAlertSlice";
import userSlice from "store/redux-toolkit/slice/userSlice";

const rootReducers = combineReducers({
  newReviewAlert: newReviewAlertSlice.reducer,
  user: userSlice.reducer,
});

const store = configureStore({
  reducer: rootReducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
