import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  capitalValue: false,
};

const capitalValueSlice = createSlice({
  name: 'capitalValue',
  initialState,
  reducers: {
    setCapitalValue(state, action) {
      console.log(action.payload)

      state.capitalValue = action.payload;
    },
  },
});

export const { setCapitalValue } = capitalValueSlice.actions;

export const selectCapitalValue = (state) => state.capitalValue.capitalValue;

export default capitalValueSlice.reducer;
