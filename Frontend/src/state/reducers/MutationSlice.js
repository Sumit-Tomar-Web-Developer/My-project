import { createSlice } from "@reduxjs/toolkit";

const mutationOwnerSlice = createSlice({
  name: "mutationOwner",
  initialState: {
    mutationOwnerList: [],
  },
  reducers: {
    addMutationOwner: (state, action) => {
      state.mutationOwnerList.push(action.payload);
    },

  },
  
});

export const { addMutationOwner, clearMutationOwners } = mutationOwnerSlice.actions;
export default mutationOwnerSlice.reducer;
