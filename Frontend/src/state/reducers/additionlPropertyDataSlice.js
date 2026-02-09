import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newAdditionalData: {
    MobileNo: '',
    PanCardNo: '',
    EmailID: '',
    AdharCardNo: '',
    PropertyRemark: '',
    CombPropRemark: '',
    PlotTaxableAreaSqFt: null,
    HearingObjNo: '',
    AppealCommObjNo: '',
    WadhGhatRemarkOne: '',
    WadhGhatRemarkTwo: '',
    WadhGhatRemarkThree: '',
    PropertyChange: '',
    FlatSystemRemark: '',
    BHK: null,
    OpenPlotLength: null,
    OpenPlotWidth: null,
  },
  newDrainFlatRate: {
    drainFlatRate: ''
  },
   hasErrors: false,
  fieldErrors: {}
};

const additionalDetailsSlice = createSlice({
  name: 'additionalDetails',
  initialState,
  reducers: {
    setAdditionalData: (state, action) => {
        console.log("✅ setAdditionalData reducer called with:", action.payload); // 👈 ADD THIS
      state.newAdditionalData = {
        ...state.newAdditionalData,
        ...action.payload
      };
    },

    setFlatRate: (state, action) => {
      state.newDrainFlatRate = {
        ...state.newDrainFlatRate,
        ...action.payload
      };
    },
      setAdditionalErrors: (state, action) => {
    state.hasErrors = action.payload.hasErrors;
    state.fieldErrors = action.payload.fieldErrors;
  },
  }
});

export const { setAdditionalData, setFlatRate ,setAdditionalErrors} = additionalDetailsSlice.actions;
export default additionalDetailsSlice.reducer;
