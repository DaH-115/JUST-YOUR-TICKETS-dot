import { configureStore, combineReducers } from "@reduxjs/toolkit";
import modalSlice from "store/modalSlice";
import movieSlice from "store/movieSlice";
import userTicketSlice from "store/userTicketSlice";
import newReviewAlertSlice from "store/newReviewAlertSlice";
import userSlice, { fetchUser } from "./userSlice";
import { isAuth } from "firebase-config";

const rootReducers = combineReducers({
  modal: modalSlice.reducer,
  movieData: movieSlice.reducer,
  userTicket: userTicketSlice.reducer,
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
