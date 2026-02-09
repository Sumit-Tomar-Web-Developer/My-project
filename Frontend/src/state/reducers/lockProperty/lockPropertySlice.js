import { createSlice } from '@reduxjs/toolkit';

const pageLockSlice = createSlice({
  name: 'pageLock',
  initialState: {
    isPageLocked: false
  },
  reducers: {
    setPageLock: (state, action) => {
      state.isPageLocked = action.payload;
    }
  }
});

export const { setPageLock } = pageLockSlice.actions;
export default pageLockSlice.reducer;
