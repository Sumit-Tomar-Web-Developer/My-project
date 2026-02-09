import { createSlice } from '@reduxjs/toolkit';

const accessLevelSlice = createSlice({
  name: 'accessLevel',
  initialState: {
    value: null // 2 (view-only), 3 (edit), etc.
  },
  reducers: {
    setAccessLevelToRedux: (state, action) => {
      state.value = action.payload;
    },
    resetAccessLevel: (state) => {
      state.value = null;
    }
  }
});

export const { setAccessLevelToRedux, resetAccessLevel } = accessLevelSlice.actions;
export default accessLevelSlice.reducer;
