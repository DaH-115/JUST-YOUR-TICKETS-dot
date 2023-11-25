import { createSlice } from '@reduxjs/toolkit';

interface initialStateProps {
  signAlertState: boolean;
  errorAlertState: boolean;
  loadingState: boolean;
}

const initialState: initialStateProps = {
  signAlertState: false,
  errorAlertState: false,
  loadingState: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    signAlertIsOpen: (state) => {
      state.signAlertState = true;
    },
    errorAlertIsOpen: (state) => {
      state.errorAlertState = true;
    },
    loadingIsOpen: (state) => {
      state.loadingState = true;
    },
    modalIsClose: (state) => {
      state.signAlertState = false;
      state.errorAlertState = false;
      state.loadingState = false;
    },
  },
});

export default modalSlice;
export const {
  signAlertIsOpen,
  errorAlertIsOpen,
  loadingIsOpen,
  modalIsClose,
} = modalSlice.actions;
