import { createSlice } from "@reduxjs/toolkit";

type initialStateProps = {
  newReviewAlertState: boolean;
};

const initialState: initialStateProps = {
  newReviewAlertState: false,
};

const newReviewAlertSlice = createSlice({
  name: "newReviewAlert",
  initialState,
  reducers: {
    addNewReviewAlertHandler: (state) => {
      state.newReviewAlertState = !state.newReviewAlertState;
    },
  },
});

export default newReviewAlertSlice;
export const { addNewReviewAlertHandler } = newReviewAlertSlice.actions;
