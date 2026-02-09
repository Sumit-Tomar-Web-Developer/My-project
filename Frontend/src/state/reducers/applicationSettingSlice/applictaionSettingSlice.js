import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otpLoginEnabled: false };

const applicationSettingSlice = createSlice({
  name: 'appSetting',
  initialState,
  reducers: {
    setAppSetting: (state, action) => {
      state.otpLoginEnabled = action.payload.otpLoginEnabled;
    }
  }
});

export const { setAppSetting } = applicationSettingSlice.actions;
export default applicationSettingSlice.reducer;
