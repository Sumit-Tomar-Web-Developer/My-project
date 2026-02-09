import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploadedFiles: {} // Stores { fileKey: { url, name, type, size, lastModified } }
};

const uploadPhotoPlanSlice = createSlice({
  name: 'uploadPhotoPlan',
  initialState,
  reducers: {
    setUploadedFiles: (state, action) => {
      state.uploadedFiles = action.payload; // Save file URLs and metadata
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = []; // 👈 reset to empty array
    },
  }
});

export const { setUploadedFiles,clearUploadedFiles } = uploadPhotoPlanSlice.actions;
export default uploadPhotoPlanSlice.reducer;
