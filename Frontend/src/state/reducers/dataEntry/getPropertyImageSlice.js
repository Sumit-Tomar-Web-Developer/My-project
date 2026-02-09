import { createSlice } from '@reduxjs/toolkit';

const imageSlice = createSlice({
  name: 'propertyImage',
  initialState: { data: null },
  reducers: {
    setImageData: (state, action) => {
      state.data = action.payload; // ✅ Store API data in Redux
    }
  }
});

export const { setImageData } = imageSlice.actions;
export default imageSlice.reducer;
