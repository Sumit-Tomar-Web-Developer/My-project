import { createSlice } from '@reduxjs/toolkit';

// Define the expected types for each field
const fieldTypes = {
  OwnerID: 'number',
  NewZoneNo: '',
  NewWardNo: '',
  NewPropertyNo: '',
  NewPartitionNo: '',
  OpenPlot: 'boolean',
  NewCityServeyNo: '',
  NewPlotNo: 'number',
  PropertyTypeID: 'number',
  PlotTaxableAreaSqFt: 'number'
};

// Normalize input based on type
const normalizeValue = (key, value) => {
  const type = fieldTypes[key];
  // if (type === 'number') {
  //   return value === '' ? null : Number(value); // ✅ DO THIS
  // }
  if (type === 'number') {
    if (value === '' || value === null || value === undefined) return null;

    const num = Number(value);
    return isNaN(num) ? null : num;
  }
  if (type === 'boolean') {
    return value === 'true' || value === true;
  }
  return value; // for any future string fields
};

const initialState = {
  newPropertyData: {
    OwnerID: 0,
    NewZoneNo: '',
    NewWardNo: '',
    NewPropertyNo: '',
    NewPartitionNo: '',
    OpenPlot: false,
    NewCityServeyNo: '',
    NewPlotNo: '',
    PropertyTypeID: null,
    PlotTaxableAreaSqFt: null
  }
};

const propertyMastFormDataSlice = createSlice({
  name: 'propertyMastDetails',
  initialState,
  reducers: {
    setNewPropertyMast: (state, action) => {
      const cleanedPayload = {};

      for (const key in action.payload) {
        if (Object.prototype.hasOwnProperty.call(fieldTypes, key)) {
          cleanedPayload[key] = normalizeValue(key, action.payload[key]);
        } else {
          cleanedPayload[key] = action.payload[key]; // fallback if key not defined
        }
      }

      console.log('Dispatching Property Mast with cleaned data:', cleanedPayload);
      state.newPropertyData = {
        ...state.newPropertyData,
        ...cleanedPayload
      };
    },
    setNewClearPropertyMast: (state) => {
      state.newPropertyData = initialState.newPropertyData; // reset to default
    }
  }
});

export const { setNewPropertyMast, setNewClearPropertyMast } = propertyMastFormDataSlice.actions;
export default propertyMastFormDataSlice.reducer;
