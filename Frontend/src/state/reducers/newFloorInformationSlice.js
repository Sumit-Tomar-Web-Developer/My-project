import { createSlice } from '@reduxjs/toolkit';
const toIntNew = (v) => (Number.isFinite(v) ? Math.trunc(v) : parseInt(`${v ?? 0}`, 10) || 0);
const getFsdIdNew = (obj = {}) =>
toIntNew(obj.FSDMDId);
// Initial state is an array of floor data objects
const initialState = {
  newFloorData: [
    {
      PDNId: 0,
      OwnerID: 0,
      FloorID: '',
      ConstructionType: '',
      TypeOFUse: '',
      GroupId: '',
      ConstructionYear: '',
      NoOfRooms: '',
      CarpetAreaSqFeet: 0,
      CarpetAreaSqMeter: 0,
      BuiltUpSqFt: 0,
      BuiltUpSqMFt: 0,
      Room: 0,
      Registration: false,
      RenterYesNO:false,
      OccupierYesNo: false,
      OccupierName: '',
      OccupierNameMarathi: '',
      RenterName: '',
      RenterNameMarathi: '',
      Rent: 0,
      NonCalculateRent: 0,
      AgreementDate: null,
      AgreementToDate: null
    },
    
  ],
  newFloorFormRedux: {   
    PDNId: 0,
    OwnerID: 0,
    FloorID: '',
    ConstructionType: '',
    TypeOFUse: '',
    GroupId: '',
    ConstructionYear: '',
    NoOfRooms: '',
    CarpetAreaSqFeet: 0,
    CarpetAreaSqMeter: 0,
    BuiltUpSqFt: 0,
    BuiltUpSqMFt: 0,
    Room: '',
    Registration: false,
    RenterYesNO: false,
    OccupierYesNo: false,
    OccupierName: '',
    OccupierNameMarathi: '',
    RenterName: '',
    RenterNameMarathi: '',
    Rent: 0,
    NonCalculateRent: 0,
    AgreementDate: null,
    AgreementToDate: null
  },
  DeletedPDNIds: [],
  DeletedFSDId: [],
 DeletedFSDMDId: [],
  floorSubmissionDetails: [
    // {
    //   OwnerID: 0,
    //   PDNId:0,
    //   FSDId: 0,
    //   Length: 0,
    //   Width: 0,
    //   Height: 0,
    //   Area: 0,
    //   NoOfRooms: 0,   
    //   RoomNo: [],
    //   InnerOuter: 'No',
    //   isMinus: 0,
    //   RoomShapeName: '',
    //   SmallBase: 0,
    //   LargeBase: 0,
    //   Radius: 0,
    //   length_a: 0,
    //   length_b: 0,
    //   length_c: 0,
    //   RoomType:''
    // }
  ],
  floorSubmissionDetailsMinusData: [
    // {
    //   OwnerID: 0,
    //   FSDMDId: 0,
    //   FSDID:0,
    //   Length: 0,
    //   Width: 0,
    //   Height: 0,
    //   Area: 0,
    //   SmallBase: 0,
    //   LargeBase: 0,
    //   Radius: 0,
    //   length_a: 0,
    //   length_b: 0,
    //   length_c: 0,
    //   TotalArea: 0,
    //   RoomType:''
    // }
  ],
  typeOfUseNonTaxable: {
    TypeOFUse: '',
    Description:'',
    Type:''
},
floorMinusDataNewSlice:[],
newFloorData: [],

totalCarpetAreaSqFeet: 0,
totalRenterCarpetAreaSqFeet: 0,
totalRenterRent: 0,
};

const newFloorDetailsSlice = createSlice({
  name: 'newFloorDetails',
  initialState,
  reducers: {
    setNewFloorData: (state, action) => {
      const { index, newData } = action.payload;

      if (Array.isArray(newData)) {
        console.log('Replacing floor data with new array:', newData);
        state.newFloorData = newData; // Replace the entire array
      } else if (typeof index === 'number') {
        console.log(`Updating floor data at index ${index} with:`, newData);
        state.newFloorData[index] = {
          ...state.newFloorData[index],
          ...newData
        };
      } else {
        console.log('Adding new floor data:', newData);
        state.newFloorData.push(newData);
      }
    },
    setNewFloorData: (state, action) => {
      const { index, newData } = action.payload;

      if (Array.isArray(newData)) {
        state.newFloorData = newData; // Replace all rows
      } else if (typeof index === 'number') {
        state.newFloorData[index] = {
          ...state.newFloorData[index],
          ...newData
        };
      } else {
        state.newFloorData.push(newData); // Add new row
      }
    },
    deletePDNId: (state, action) => {
      const { PDNId } = action.payload;
      const index = state.newFloorData.findIndex((item) => item.PDNId === PDNId);
      if (index !== -1) {
        console.log(`Deleting PDNId with ID ${PDNId}`);
        state.newFloorData.splice(index, 1);
      }
      state.DeletedPDNIds.push(PDNId);
    },
    deleteFSDId: (state, action) => {
      const { FSDId } = action.payload;
      const index = state.newFloorData.findIndex((item) => item.FSDId === FSDId);
      if (index !== -1) {
        console.log(`Deleting FSDId with ID ${FSDId}`);
        state.newFloorData.splice(index, 1);
      }
      state.DeletedFSDId.push(FSDId);
    },
    deleteFSDMDId: (state, action) => {
      const { FSDMDId } = action.payload;
      const index = state.newFloorData.findIndex((item) => item.FSDMDId === FSDMDId);
      if (index !== -1) {
        console.log(`Deleting FSDMDId with ID ${FSDMDId}`);
        state.newFloorData.splice(index, 1);
      }
      state.DeletedFSDMDId.push(FSDMDId);
    },

    setFloorSubmissionDetailsNewProperty: (state, action) => {
      const { index, newData } = action.payload;
      console.log(action.payload, "payload to abe added new floor")
      if (Array.isArray(newData)) {
        state.floorSubmissionDetails = newData.map(d => ({ PDNId: d.PDNId ?? 0, ...d }));
        console.log('Replaced floorSubmissionDetails array:', state.floorSubmissionDetails);
      } else if (typeof index === 'number') {
        state.floorSubmissionDetails[index] = {
          ...state.floorSubmissionDetails[index],
          PDNId: newData.PDNId ?? state.floorSubmissionDetails[index].PDNId ?? 0,
          ...newData
        };
        console.log(`Updated floorSubmissionDetails at index ${index}:`, state.floorSubmissionDetails[index]);
      } else {
        state.floorSubmissionDetails.push({ PDNId: newData.PDNId ?? 0, ...newData });
        console.log('Added new floorSubmissionDetails entry:', newData);
      }
    },
    clearFloorSubmissionDetailsNewSlice: (state) => {
      console.log('payload to abe added new slice in redux clear')
      state.floorSubmissionDetailsMinusData = [];
    },
//------------------new slice for room submission------------------///
    setFloorMinusDataNewSlice: (state, action) => {
      const { index, newData } = action.payload;

      console.log(action.payload, "payload to abe added new slice Array")
      const list = state.floorMinusDataNewSlice ?? (state.floorMinusDataNewSlice = []);

      // Helper: upsert a single item by ID
      const upsertById = (item) => {
        const id = getFsdIdNew(item);
        if (!id) {
          // if no usable ID, fall back to push
          list.push(item);
          return;
        }
        const i = list.findIndex((x) => getFsdIdNew(x) === id);
        if (i >= 0) {
          list[i] = { ...list[i], ...item, FSDMDId: id }; // normalize key
        } else {
          list.push({ ...item, FSDMDId: id }); 
        }
      };

      if (Array.isArray(newData)) {
        // Upsert each incoming row by ID (keeps existing rows not mentioned)
        newData.forEach(upsertById);
      } else if (typeof index === 'number') {
        // If ID present, ignore index and upsert by ID. Otherwise update that index.
        const id = getFsdIdNew(newData);
        if (id) {
          upsertById(newData);
        } else {
          list[index] = { ...list[index], ...newData };
        }
      } else {
        // Single add/update by ID or push if no ID
        upsertById(newData);
      }
    },
// setFloorMinusDataNewSlice: (state, action) => {
//   const { index, newData } = action.payload;

//   // Ensure array exists
//   if (!state.floorMinusDataNewSlice) {
//     state.floorMinusDataNewSlice = [];
//   }
//   const list = state.floorMinusDataNewSlice;

//   // Helper to get stable ID
//   const getId = (item) => getFsdIdNew(item);

//   // Helper: upsert or add
//   const upsert = (item) => {
//     const id = getId(item);
//     if (!id) {
//       list.push({ ...item, FSDMDId: Math.floor(Math.random() * 1e9) });
//       return;
//     }
//     const idx = list.findIndex((x) => getId(x) === id);
//     if (idx >= 0) {
//       list[idx] = { ...list[idx], ...item, FSDMDId: id };
//     } else {
//       list.push({ ...item, FSDMDId: id });
//     }
//   };

//   if (Array.isArray(newData)) {
//     // Replace whole table (like saving after add/update)
//     state.floorMinusDataNewSlice = newData.map((d) => ({
//       ...d,
//       FSDMDId: getId(d) || Math.floor(Math.random() * 1e9),
//     }));
//   } else if (typeof index === "number") {
//     // Update by index if no ID
//     const id = getId(newData);
//     if (id) {
//       upsert(newData);
//     } else {
//       list[index] = { ...list[index], ...newData };
//     }
//   } else {
//     // Single object
//     upsert(newData);
//   }
// }

    // ----------------- FloorSubmissionDetailsMinusData -----------------
    
    setFloorSubmissionDetailsMinusNewProperty: (state, action) => {
      const { index, newData } = action.payload;
      console.log(action.payload, "payload to abe added new slice")
      if (Array.isArray(newData)) {
        state.floorSubmissionDetailsMinusData = newData.map(d => ({ FSDMDId: d.FSDMDId ?? 0, ...d }));
        console.log('Replaced floorSubmissionDetailsMinusData array:', state.floorSubmissionDetailsMinusData);
      } else if (typeof index === 'number') {
        state.floorSubmissionDetailsMinusData[index] = {
          ...state.floorSubmissionDetailsMinusData[index],
          FSDMDId: newData.FSDMDId ?? state.floorSubmissionDetailsMinusData[index].FSDMDId ?? 0,
          ...newData
        };
        console.log(`Updated floorSubmissionDetailsMinusData at index ${index}:`, state.floorSubmissionDetailsMinusData[index]);
      } else {
        state.floorSubmissionDetailsMinusData.push({ FSDMDId: newData.FSDMDId ?? 0, ...newData });
        console.log('Added new floorSubmissionDetailsMinusData entry:', newData);
      }
    },
   
    
    setTypeOfUseNonTaxable: (state, action) => {
      state.typeOfUseNonTaxable = action.payload;
    },
    setTotalCarpetAreaSqFeet: (state, action) => {
      console.log("Setting total carpet in reducer:", action.payload);

      state.totalCarpetAreaSqFeet = action.payload;
    },
    setTotalRenterCarpetAreaSqFeet: (state, action) => {
      console.log("Setting renter-only carpet in reducer:", action.payload);
      state.totalRenterCarpetAreaSqFeet = action.payload;
    },
    setTotalRenterRent: (state, action) => {
      state.totalRenterRent = action.payload;
    },
    setNewFloorFormRedux: (state, action) => {
  state.newFloorFormRedux = {
    ...state.newFloorFormRedux,
    ...action.payload
  };
},
resetNewFloorFormRedux: (state) => {
  state.newFloorFormRedux = initialState.newFloorFormRedux;
},

  }
});

export const { setNewFloorData, 

  deletePDNId,setTotalRenterRent,clearFloorSubmissionDetailsNewSlice, setFloorMinusDataNewSlice,setTotalCarpetAreaSqFeet,deleteFSDId,deleteFSDMDId,setTotalRenterCarpetAreaSqFeet,setTypeOfUseNonTaxable ,setFloorSubmissionDetailsMinusNewProperty, setFloorSubmissionDetailsNewProperty,setNewFloorFormRedux,resetNewFloorFormRedux } =

  newFloorDetailsSlice.actions;
export default newFloorDetailsSlice.reducer;
