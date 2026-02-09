import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newOwnerData: [],    
  DeletedJODIds: []
};

const formDataEntrySlice = createSlice({
  name: 'formDataDetails',
  initialState,
  reducers: {
 setNewPropertyJoinData: (state, action) => {
      const { index, newData } = action.payload;

      console.log('🟢 Reducer called → setNewPropertyJoinData');
      console.log('📥 Payload:', action.payload);

      if (Array.isArray(newData)) {
        console.log('📌 Replacing newOwnerData with an ARRAY of length:', newData.length);
        state.newOwnerData = newData;
      } else if (typeof index === 'number') {
        console.log(`✏️ Updating row at index ${index}`, newData);
        state.newOwnerData[index] = { ...state.newOwnerData[index], ...newData };
      } else {
        console.log('➕ Adding new single row:', newData);
        state.newOwnerData.push(newData);
      }

      console.log('📊 Updated state.newOwnerData:', JSON.parse(JSON.stringify(state.newOwnerData)));
    },





    deleteJOD: (state, action) => {
      const { JODId } = action.payload;
      const index = state.newOwnerData.findIndex((item) => item.JODId === JODId);
      if (index !== -1) {
        state.newOwnerData.splice(index, 1);
      }
      state.DeletedJODIds.push(JODId);
    },

    resetNewPropertyJoinData: (state) => {
      state.newOwnerData = [];
      state.DeletedJODIds = [];
    }
  }
});

export const { setNewPropertyJoinData, deleteJOD, resetNewPropertyJoinData } = formDataEntrySlice.actions;
export default formDataEntrySlice.reducer;

