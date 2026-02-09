// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   initialUserData: {
//     UserID: 0,
//     role: '',
//     name: '',
//     email: '',
//     contact_no: '',
//     address: '',
//     startDate: null,
//     active: '',
//     userlevel: '',
//     LayerID: 0
//   },
//   permissions: {}
// };

// const newUserSlice = createSlice({
//   name: 'newUserDetails',
//   initialState,
//   reducers: {
//     setNewUserData: (state, action) => {
//       state.initialUserData = {
//         ...state.initialUserData,
//         ...action.payload
//       };
//     },
//     setPermissions: (state, action) => {
//       state.permissions = action.payload;
//     },
//     setUserID: (state, action) => {
//       state.initialUserData.UserID = action.payload;
//     },
//     setLayerID: (state, action) => {
//       state.initialUserData.LayerID = action.payload;
//     }
//   }
// });

// export const { setNewUserData, setPermissions, setUserID, setLayerID } = newUserSlice.actions;
// export default newUserSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  initialUserData: {
    UserID: 0,
    role: '',
    name: '',
    email: '',
    contact_no: '',
    address: '',
    dob: null,
    startDate: null,
    active: '',
    userlevel: '',
    isfirstlogin: false,
    LayerID: 0
  },
  permissions: {},
  pageList: []
};

const newUserSlice = createSlice({
  name: 'newUserDetails',
  initialState,
  reducers: {
    setNewUserData: (state, action) => {
      console.log('✅ setNewUserData triggered', action.payload);
      state.initialUserData = {
        ...state.initialUserData,
        ...action.payload
      };
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    setPageNameList: (state, action) => {
      state.pageList = action.payload;
    }
  }
});

export const { setNewUserData, setPermissions, setLayerID, setPageNameList } = newUserSlice.actions;
export default newUserSlice.reducer;
