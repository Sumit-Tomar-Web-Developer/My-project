import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  retentionTaxes: {
    OwnerID: 0,
    RentalValue: '',
    PropertyTax: '',
    EducationTax: '',
    SpEducationTax: '',
    EmploymentTax: '',
    TreeCess: '',
    FireCess: '',
    LightCess: '',
    DrainCess: '',
    RoadCess: '',
    Sanitation: '',
    Tax2: '',
    WaterBill: '',
    SpWaterCess: '',
    WaterBenefit: '',
    MajorBuilding: '',
    SewageDisposalCess: '',
    Tax1: '',
    TaxTotal: ''
  }
};

const RetentionTaxDataSlice = createSlice({
  name: 'retentionTaxData',
  initialState,
   reducers: {
    setRetentionData: (state, action) => {
      console.log('Dispatching setRetentionData with:', action.payload);
      state.retentionTaxes = {
        ...state.retentionTaxes,
        ...action.payload
      };
    },

    resetRetentionData: (state) => {
      state.retentionTaxes = { ...initialState.retentionTaxes };
    }
  }
});

export const { setRetentionData,resetRetentionData } = RetentionTaxDataSlice.actions;
export default RetentionTaxDataSlice.reducer;
