import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newSocialData: {
    OwnerID: 0,
    NoOfWaterConnectionNo: null,
    WaterConnectionType: '',
    IsWaterMeter: false,
    WaterMeterStatus: '',
    WaterBillAreaName: '',
    WaterBillConnectionNo1: null,
    WaterBillMeterNo: null,
    WaterBillCustomerNo: '',
    ConnectionNo2: null,
    MeterNo2: null,
    ConnectionNo3: null,
    MeterNo3: null,
    ConnectionNo4: null,
    MeterNo4: null,
    ConnectionNo5: null,
    MeterNo5: null,
    IsTubeWell: false,
    NoOfTubeWell: null,
    IsBoar: false,
    NoOfBoar: null,
    IsWell: false,
    NoOfWell: null,
    IsHandPump: false,
    NoOfHandPump: null,
    IsSolar: false,
    NoOfSolar: null,
    IsLift: false,
    NoOfLift: null,
    IsFireSafety: false,
    NoOfFireSafety: null,
    ToiletSeatCountResidential: null,
    ToiletSeatCountNonResidential: null,
    NoOfTrees: null,
    NoOfSepticTank: null,
    IsSepticTank: false,
    IsWastewaterOutlet: false,
    IsEtpStp: false,
    IsHomeComposting: false,
    IsVermicompost: false,
    IsECharging: false,
    IsUndergroundSewage: false,
    IsUndergroundTank: false,
    IsBoosterPump: false,
    IsBuildingPermission: false,
    IsOcIssued: false,
    OcNo: null,
    IsRainwaterharvesting: false,
    RoadWidth: null,
    NoOfWaterConnection: null,
    IsWaterConn: false,
      WaterRemark:"",
  ParkingRemark:"",
  BorewellRemark:"",
  CCNumber: null,
    WaterConnSize: '',
    DirectionEast: '',
    DirectionWest: '',
    DirectionNorth: '',
    DirectionSouth: ''
  },
  newRToiletCTolet: {
    rToilet: 0,
    cToilet: 0
  },
    
  hasErrors: false,    
  fieldErrors: {}          
};

const socialDetailsSlice = createSlice({
  name: 'socialDetails',
  initialState,
  reducers: {
    setSocialData: (state, action) => {
      console.log('Dispatching setSocialData with:', action.payload);
      state.newSocialData = {
        ...state.newSocialData,
        ...action.payload
      };
    },
    setRToiletCToilet: (state, action) => {
      console.log('Dispatching setRToiletCToilet with:', action.payload);
      state.newRToiletCTolet = {
        ...state.newRToiletCTolet,
        ...action.payload
      };
    },
// ✅ New reducer to set validation state
    setSocialErrors: (state, action) => {
      state.hasErrors = action.payload.hasErrors;
      state.fieldErrors = action.payload.fieldErrors;
    }
  }
});
export const { setSocialData, setRToiletCToilet,setSocialErrors } = socialDetailsSlice.actions;
export default socialDetailsSlice.reducer;
