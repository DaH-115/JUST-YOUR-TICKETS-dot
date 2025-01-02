import { configureStore, combineReducers } from "@reduxjs/toolkit";
import newReviewAlertSlice from "store/newReviewAlertSlice";
import userSlice, { fetchUser } from "store/userSlice";
import { isAuth } from "firebase-config";

const rootReducers = combineReducers({
  newReviewAlert: newReviewAlertSlice.reducer,
  user: userSlice.reducer,
});

const store = configureStore({
  reducer: rootReducers,
});

store.dispatch(fetchUser(isAuth));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
