import { configureStore, combineReducers } from '@reduxjs/toolkit';
import modalSlice from 'store/modalSlice';
import movieSlice from 'store/movieSlice';
import userTicketSlice from 'store/userTicketSlice';

const rootReducers = combineReducers({
  modal: modalSlice.reducer,
  movieData: movieSlice.reducer,
  userTicket: userTicketSlice.reducer,
});

const store = configureStore({
  reducer: rootReducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
