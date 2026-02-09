import { createSlice } from '@reduxjs/toolkit';
const toInt = (v) => (Number.isFinite(v) ? Math.trunc(v) : parseInt(`${v ?? 0}`, 10) || 0);
const getFsdId = (obj = {}) =>
  toInt(obj.FSDMDId);
const initialState = {
  combinedData: {
    propertyMast: {},
    drainFlatRate: null,
    propertyDetailsNew: [],
    propertyImageMast: [],
    propertySocialDetails: {},
    jointOwnerDetails: [],
    propertyDetailsOld: [],
    oldPropertyMast: [],
    oldTaxes: [],
    floorSubmissionDetails: [],
    floorSubmissionDetailsMinusData: [],
    pendingTaxes: [],
    propertyDetailsNewFormRedux: {
      OwnerID: 0,
      PDNId: 0,
      FloorID: '',
      ConstructionType: '',
      TypeOFUse: '',
      GroupId: '0',
      ConstructionYear: '',
      NoOfRooms: '',
      CarpetAreaSqFeet: '',
      CarpetAreaSqMeter: '',
      BuiltUpSqFt: '',
      BuiltUpSqMFt: '',
      Room: '',
      Registration: 0,
      RenterYesNO: 0,
      OccupierYesNo: null,
      OccupierName: '',
      OccupierNameMarathi: '',
      RenterName: '',
      RenterNameMarathi: '',
      Rent: 0,
      NonCalculateRent: 0,
      AgreementDate: null,
      AgreementToDate: null
    },
  },
  DeletedJODIdsExistingProperty: [],
  DeletedPDNIdsExistingProperty: [],
  DeletedPDOIdsExistingProperty: [],
  DeletedFloorSubmisionExistingProperty: [],
  DeletedFloorSubmisionMinusExistingProperty: [],
  propertyInfo: {
    wardNo: '',
    propertyNo: '',
    ownerName: ''
  },

  // 🧮 ASSESSMENT / RV DETAILS
  assessment: {
    oldRV: '',
    oldALV: '',
    oldTax: '',
    newALV: '',
    netRV: '',
    retentionRV: '',
    retentionReason: '',
    hearingRV: '',
    hearingReason: '',
    appealRV: '',
    appealReason: '',
    remissionRV: '',
    remissionReason: ''
  },
taxRows: [],       
remark: '',        
documents: [      
{ id: 1, name: 'स्थळपाहणी अहवाल', file: null },
{ id: 2, name: 'पावती पुस्तक', file: null },
{ id: 3, name: 'नोटशीट', file: null },
{ id: 4, name: 'अर्ज', file: null },
{ id: 5, name: 'सूचना पत्रक', file: null },
{ id: 6, name: 'जुनी टॅक्स पावती', file: null },
{ id: 7, name: 'जुने डिमांड बिल', file: null },
{ id: 8, name: 'रजिस्ट्री', file: null },
{ id: 9, name: 'दुरुस्ती पत्रक', file: null },
],
policy: '',         
action: '',         
financeYear: '',    
hasErrors: false,
fieldErrors: {}
};



const combinedDataEntrySlice = createSlice({
  name: 'combinedDataEntry',
  initialState,
  reducers: {
    setCombinedDataEntry: (state, action) => {
      if (!action.payload || Object.keys(action.payload).length === 0) state.combinedData = initialState;
      else {
        state.combinedData = {
          ...state.combinedData,
          ...action.payload
        };
      }
    },
    setPropertyMastFormDataEntry: (state, action) => {
      state.combinedData.propertyMast = action.payload;
      if (state.combinedData.propertyMast) {
        state.combinedData.propertyMast = {
          ...state.combinedData.propertyMast,
          ...action.payload
        };
      } else {
        console.warn('propertyMast is not defined');
      }
    },

    setPropertyDetailsNewFormRedux: (state, action) => {
      console.log("✅ Redux Dispatch Triggered: setPropertyDetailsNewFormRedux", action.payload);

      state.combinedData.propertyDetailsNewFormRedux = {
        ...state.combinedData.propertyDetailsNewFormRedux,
        ...action.payload
      };

      console.log("📦 Updated Redux Form State:", state.combinedData.propertyDetailsNewFormRedux);
    },


    setJointOwnerDetails: (state, action) => {
      const { index, newData } = action.payload;
      if (Array.isArray(newData)) {
        state.combinedData.jointOwnerDetails = newData;
      } else if (typeof index === 'number') {
        state.combinedData.jointOwnerDetails[index] = {
          ...state.combinedData.jointOwnerDetails[index],
          ...newData
        };
      } else {
        state.combinedData.jointOwnerDetails.push(newData);
      }
    },
    resetJointOwnerDetails: (state) => {
      state.combinedData.jointOwnerDetails = [];

    },

    setRToiletInitialData: (state, action) => {
      if (state.combinedData.propertyMast) {
        state.combinedData.propertyMast = {
          ...state.combinedData.propertyMast,
          NewToiletNo: action.payload
        };
      } else {
        console.warn('propertyMast is not defined');
      }
    },

    setCToiletInitialData: (state, action) => {
      if (state.combinedData.propertyMast) {
        state.combinedData.propertyMast = {
          ...state.combinedData.propertyMast,
          commToiletNo: action.payload
        };
      } else {
        console.warn('propertyMast is not defined');
      }
    },

    setInitialDrainData: (state, action) => {
      state.combinedData.drainFlatRate = {
        DrainFlatRate: action.payload
      };
    },
    setPropertyAdditionalDetails: (state, action) => {
      state.combinedData.propertyMast = {
        ...state.combinedData.propertyMast,
        ...action.payload
      };
    },

    setPropertyDetailsNew: (state, action) => {
      const { index, newData } = action.payload ?? {};

      // ensure the array exists
      state.combinedData = state.combinedData || {};
      state.combinedData.propertyDetailsNew = state.combinedData.propertyDetailsNew || [];

      const list = state.combinedData.propertyDetailsNew;

      // helper to upsert a single item by PDNId
      const upsertByPdnId = (item) => {
        const id = item?.PDNId;
        if (id === undefined || id === null || id === "") {
          // no PDNId — push as-is (could decide to ignore instead)
          list.push(item);
          return;
        }
        const i = list.findIndex(x => String(x?.PDNId) === String(id));
        if (i >= 0) {
          // merge with existing item
          list[i] = { ...list[i], ...item };
        } else {
          // add new item
          list.push({ ...item });
        }
      };

      if (Array.isArray(newData)) {
        // Upsert each incoming row by PDNId (keeps existing rows not mentioned)
        newData.forEach(item => upsertByPdnId(item));
      } else if (newData && typeof newData === 'object') {
        // single object
        const id = newData?.PDNId;
        if (id !== undefined && id !== null && id !== "") {
          upsertByPdnId(newData);
        } else if (typeof index === 'number' && list[index]) {
          // fallback: update by numeric index when PDNId is not present
          list[index] = { ...list[index], ...newData };
        } else {

          list.push({ ...newData });
        }
      } else if (typeof index === 'number') {

        if (!list[index]) list[index] = {};
      }
    },
    deletePropertyDetailsNew: (state, action) => {
      console.log('deletePRopertyDetailsNew called');

      const { id } = action.payload || {};
      if (id === undefined || id === null) return;

      console.log(state.combinedData.propertyDetailsNew, 'before removal');

      const filter =
        (state.combinedData.propertyDetailsNew).filter(
          item => String((item.PDNId)) !== String(id)
        );
        console.log(filter);
      state.combinedData.propertyDetailsNew = filter;
      console.log(state.combinedData.propertyDetailsNew, 'after removal');
    },


    setPropertyImageMast: (state, action) => {
      state.combinedData.propertyImageMast = action.payload;
    },
    setPropertySocialDetails: (state, action) => {
      state.combinedData.propertySocialDetails = {
        ...state.combinedData.propertySocialDetails,
        ...action.payload
      };
    },

    setPropertyDetailsOld: (state, action) => {
      const payload = action?.payload;

      // Ensure path exists
      if (!state.combinedData) state.combinedData = {};
      if (!Array.isArray(state.combinedData.propertyDetailsOld)) {
        state.combinedData.propertyDetailsOld = [];
      }

      const list = state.combinedData.propertyDetailsOld;
      const { index, newData, clear, reset } = payload || {};

      // -------- CLEAR RULES --------
      // Clear if:
      //  - explicit clear/reset flag, or
      //  - payload is null/undefined, or
      //  - newData is [], or
      //  - newData is {} (and no index merge requested)
      const isPlainObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
      const isEmptyObj = (v) => isPlainObj(v) && Object.keys(v).length === 0;

      if (
        clear === true ||
        reset === true ||
        payload == null ||
        (Array.isArray(newData) && newData.length === 0) ||
        (isEmptyObj(newData) && typeof index !== 'number')
      ) {
        state.combinedData.propertyDetailsOld = [];
        return;
      }

      // -------- VALIDATION --------
      const isValidRow = (row) =>
        isPlainObj(row) && Object.keys(row).length > 0;

      // -------- REPLACE LIST --------
      if (Array.isArray(newData)) {
        state.combinedData.propertyDetailsOld = newData.filter(isValidRow);
        return;
      }

      // -------- MERGE EXISTING INDEX --------
      if (typeof index === 'number') {
        if (!Number.isInteger(index) || index < 0 || index >= list.length) return;
        if (!isValidRow(newData)) return;
        list[index] = { ...(list[index] || {}), ...newData };
        return;
      }

      // -------- APPEND --------
      if (isValidRow(newData)) {
        list.push(newData);
      }
    },


    setOldPropertyMast: (state, action) => {
      // state.combinedData.oldPropertyMast = action.payload;
      state.combinedData.oldPropertyMast = {
        ...state.combinedData.oldPropertyMast,
        ...action.payload
      };
    },
    setOldTaxesReducer: (state, action) => {
      state.combinedData.oldTaxes = action.payload;
    },

    setFloorSubmissionDetailsInitialData: (state, action) => {
      const { index, newData } = action.payload;

      console.log(action.payload, "payload to abe added")

      if (Array.isArray(newData)) {
        // Replace the entire array
        state.combinedData.floorSubmissionDetails = newData;
      } else if (typeof index === 'number') {
        // Update specific index
        state.combinedData.floorSubmissionDetails[index] = {
          ...state.combinedData.floorSubmissionDetails[index],
          ...newData
        };
      } else {
        // Push a new entry if index is not provided
        state.combinedData.floorSubmissionDetails?.push(newData);
      }
    },
    setDeletedFloorSubmisionMinusExistingProperty: (state, action) => {
      const { FSDMDId } = action.payload;
    
      if (!Array.isArray(state.DeletedFloorSubmisionMinusExistingProperty)) {
        state.DeletedFloorSubmisionMinusExistingProperty = [];
      }
    
      if (!state.DeletedFloorSubmisionMinusExistingProperty.includes(FSDMDId)) {
        state.DeletedFloorSubmisionMinusExistingProperty.push(FSDMDId);
      }
    
      console.log('🗑️ Marked minus for backend delete:', state.DeletedFloorSubmisionMinusExistingProperty);
    },
    setDeletedFloorSubmisionExistingProperty: (state, action) => {
      const { FSDId } = action.payload;
    
      if (!Array.isArray(state.DeletedFloorSubmisionExistingProperty)) {
        state.DeletedFloorSubmisionExistingProperty = [];
      }
    
      if (!state.DeletedFloorSubmisionMinusExistingProperty.includes(FSDId)) {
        state.DeletedFloorSubmisionExistingProperty.push(FSDId);
      }
    
      console.log('🗑️ Marked minus for backend delete:', state.DeletedFloorSubmisionExistingProperty);
    },
    
    
    deletefloorSubmissionDetailsInitialData: (state, action) => {
      console.log('deletefloorSubmissionDetails called');

      const { id } = action.payload || {};
      if (id === undefined || id === null) return;

      console.log(state.combinedData.floorSubmissionDetails, 'before removal');

      const filter =
        (state.combinedData.floorSubmissionDetails).filter(
          item => String((item.FSDId)) !== String(id)
        );
        console.log(filter);
      state.combinedData.floorSubmissionDetails = filter;
      console.log(state.combinedData.floorSubmissionDetails, 'after removal');
    },
    clearFloorSubmissionDetailsMinusData: (state, action) => {
     

      const { id } = action.payload || {};
      if (id === undefined || id === null) return;

   

      const filter =
        (state.combinedData.floorSubmissionDetailsMinusData).filter(
          item => String(item.FSDId) !== String(id)
        );
        console.log(filter);
      state.combinedData.floorSubmissionDetailsMinusData = filter;
      
    },


    setFloorSubmissionDetailsMinusData: (state, action) => {
      const { index, newData } = action.payload;

      console.log(action.payload, "payload to abe added")
      const list = state.combinedData.floorSubmissionDetailsMinusData ?? (state.combinedData.floorSubmissionDetailsMinusData = []);

      // Helper: upsert a single item by ID
      const upsertById = (item) => {
        const id = getFsdId(item);
        if (!id) {
          // if no usable ID, fall back to push
          list.push(item);
          return;
        }
        const i = list.findIndex((x) => getFsdId(x) === id);
        if (i >= 0) {
          list[i] = { ...list[i], ...item, FSDMDId: id }; // normalize key
        } else {
          list.push({ ...item, FSDMDId: id }); // normalize key
        }
      };

      if (Array.isArray(newData)) {
        // Upsert each incoming row by ID (keeps existing rows not mentioned)
        newData.forEach(upsertById);
      } else if (typeof index === 'number') {
        // If ID present, ignore index and upsert by ID. Otherwise update that index.
        const id = getFsdId(newData);
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
    deletefloorSubmissionDetailsMinusData: (state, action) => {
      console.log('deletefloorSubmissionDetailsMinusData called');

      const { id } = action.payload || {};
      if (id === undefined || id === null) return;

      console.log(state.combinedData.floorSubmissionDetailsMinusData, 'before removal');

      const filter =
        (state.combinedData.floorSubmissionDetailsMinusData).filter(
          item => String(getFsdId(item)) !== String(id)
        );
        console.log(filter);
      state.combinedData.floorSubmissionDetailsMinusData = filter;
      console.log(state.combinedData.floorSubmissionDetailsMinusData, 'after removal');
    },




    setPendingTaxesReducer: (state, action) => {
      const payload = action?.payload;

      // ensure path exists
      if (!state.combinedData) state.combinedData = {};
      if (!Array.isArray(state.combinedData.pendingTaxes)) {
        state.combinedData.pendingTaxes = [];
      }

      const list = state.combinedData.pendingTaxes;
      const { index, newData, clear, reset } = payload || {};

      const isPlainObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
      const isEmptyObj = (v) => isPlainObj(v) && Object.keys(v).length === 0;

      // --- CLEAR RULES ---
      if (
        clear === true ||
        reset === true ||
        payload == null ||
        (Array.isArray(newData) && newData.length === 0) ||
        (isEmptyObj(newData) && typeof index !== 'number')
      ) {
        state.combinedData.pendingTaxes = [];
        return;
      }

      const isValidRow = (row) => isPlainObj(row) && Object.keys(row).length > 0;

      // --- REPLACE WHOLE LIST ---
      if (Array.isArray(newData)) {
        state.combinedData.pendingTaxes = newData.filter(isValidRow);
        return;
      }

      // --- MERGE INTO INDEX ---
      if (typeof index === 'number') {
        if (!Number.isInteger(index) || index < 0 || index >= list.length) return;
        if (!isValidRow(newData)) return;
        list[index] = { ...(list[index] || {}), ...newData };
        return;
      }

      // --- APPEND ---
      if (isValidRow(newData)) {
        list.push(newData);
      }
    },

    setDeletedPDNIdsExistingProperty: (state, action) => {
      const { PDNId } = action.payload;

      // Initialize if not array
      if (!Array.isArray(state.DeletedPDNIdsExistingProperty)) {
        state.DeletedPDNIdsExistingProperty = [];
      }

      // Add to deleted list if not already there
      if (!state.DeletedPDNIdsExistingProperty.includes(PDNId)) {
        state.DeletedPDNIdsExistingProperty.push(PDNId);
      }

      console.log('🗑️ Marked for backend delete:', state.DeletedPDNIdsExistingProperty);
    },
    setDeletedPDOIdsExistingProperty: (state, action) => {
      const { pdoId } = action.payload;
      console.log(pdoId, 'State PDOId')
      const index = state.combinedData.propertyDetailsOld.findIndex((item) => item.PDOId === pdoId);
      if (index !== -1) {
        console.log(`Deleting PDOId with ID ${pdoId}`);
        state.DeletedPDOIdsExistingProperty.splice(index, 1);
      }
      state.DeletedPDOIdsExistingProperty.push(pdoId);
    },

    setdeleteJODExistingProperty: (state, action) => {
      const { JODId } = action.payload;
      console.log(JODId, 'id to be stored in jointowner redux.');

      const index = state.combinedData.jointOwnerDetails.findIndex((item) => item.JODId === JODId);
      console.log(index, 'jdoiddddd index');

      if (index !== -1) {
        console.log(`Deleting JOD with ID ${JODId}`);
        state.combinedData.jointOwnerDetails.splice(index, 1);
      }

      if (!Array.isArray(state.DeletedJODIdsExistingProperty)) {
        console.warn('DeletedJODIdsExistingProperty was null. Reinitializing to empty array.');
        state.DeletedJODIdsExistingProperty = [];
      }

      state.DeletedJODIdsExistingProperty.push(JODId);
      console.log(state.DeletedJODIdsExistingProperty, 'All Deleted JOD IDs');
    },

    setDeletedFloorSubmisionExistingProperty: (state, action) => {
      const { FSDId } = action.payload;

      // Initialize if not array
      if (!Array.isArray(state.DeletedFloorSubmisionExistingProperty)) {
        state.DeletedFloorSubmisionExistingProperty = [];
      }

      // Add to deleted list if not already there
      if (!state.DeletedFloorSubmisionExistingProperty.includes(FSDId)) {
        state.DeletedFloorSubmisionExistingProperty.push(FSDId);
      }

      console.log('🗑️ Marked for backend delete:', state.DeletedFloorSubmisionExistingProperty);
    },



    resetPropertyDetailsNewFormRedux: (state) => {
      state.combinedData.propertyDetailsNewFormRedux = {
        ...initialState.combinedData.propertyDetailsNewFormRedux,
      };
    },



    setPropertyNewDetails: (state, action) => {
      const { index, newData } = action.payload;

      if (Array.isArray(newData)) {
        state.combinedData.propertyDetailsNew = newData;
      } else if (typeof index === 'number') {
        state.combinedData.propertyDetailsNew[index] = {
          ...state.combinedData.propertyDetailsNew[index],
          ...newData
        };
      } else {
        state.combinedData.propertyDetailsNew.push(newData);
      }
    } ,
    setPropertyInfo: (state, action) => {
      state.propertyInfo = {
        ...state.propertyInfo,
        ...action.payload
      };
    },
    setAssessment: (state, action) => {
      state.assessment = {
        ...state.assessment,
        ...action.payload
      };
    },
       // ➕ ADD DOCUMENT (used after print)
addDocument: (state, action) => {
  const { id, name, file = null } = action.payload;

  const exists = state.documents.some(doc => doc.id === id);
  if (!exists) {
    state.documents.push({ id, name, file });
  }
},
   
  // 💰 TAX ROWS
  addTaxRow: (state, action) => {
    state.taxRows.push(action.payload);
  },
  updateTaxRow: (state, action) => {
    const { id, data } = action.payload;
    state.taxRows = state.taxRows.map(row => row.id === id ? { ...row, ...data } : row);
  },
  removeTaxRow: (state, action) => {
    const id = action.payload;
    state.taxRows = state.taxRows.filter(row => row.id !== id);
  },
  setRemark: (state, action) => {
    state.remark = action.payload;
  },

  // 📄 DOCUMENTS
updateDocumentFile: (state, action) => {
  const { id, file, uploadedFilePath, fileName } = action.payload;

  state.documents = state.documents.map((doc) =>
    doc.id === id 
      ? { ...doc, file, uploadedFilePath, fileName } 
      : doc
  );

  console.log("✅ Redux State Updated with Path:", uploadedFilePath);

  const firstNineUploaded = state.documents
    .filter(doc => doc.id >= 1 && doc.id <= 9)
    .every(doc => doc.file !== null || doc.uploadedFilePath);

  const hasWardghat = state.documents.some(doc => doc.id === 10);

  if (firstNineUploaded && !hasWardghat) {
    state.documents.push({ 
      id: 10, 
      name: 'वाढघट दस्तऐवज (Wardghat Document)', 
      file: null,
      uploadedFilePath: "",
      fileName: ""
    });
  }
},
  deleteDocumentFile: (state, action) => {
    const id = action.payload;
    state.documents = state.documents.map(doc =>
      doc.id === id ? { ...doc, file: null } : doc
    );
  },

  // ⚙ POLICY / ACTION / FINANCE YEAR
  setPolicy: (state, action) => {
    state.policy = action.payload;
  },
  setAction: (state, action) => {
    state.action = action.payload;
  },
  setFinanceYear: (state, action) => {
    state.financeYear = action.payload;
  },

  // 🚨 ERRORS
  setErrors: (state, action) => {
    state.hasErrors = action.payload.hasErrors;
    state.fieldErrors = action.payload.fieldErrors;
  },

  // 🔄 RESET ALL (if needed)
  resetDataEntryApproval: (state) => {
    state.taxRows = [];
    state.remark = '';
    state.documents = state.documents.map(doc => ({ ...doc, file: null }));
    state.policy = '';
    state.action = '';
    state.financeYear = '';
    state.hasErrors = false;
    state.fieldErrors = {};
  },

    resetCombinedDataEntry: () => initialState
  }
});

export const {
  resetPropertyDetailsNewFormRedux,
  setCombinedDataEntry,
  resetCombinedDataEntry,
  setPropertyMastFormDataEntry,
  setDeletedPDNIdsExistingProperty,
  setdeleteJODExistingProperty,
  setDeletedPDOIdsExistingProperty,
  setDrainFlatRate,
  setPropertyDetailsNew,
  
  setPropertyImageMast,
  setPropertySocialDetails,
  setJointOwnerDetails,
  setPropertyDetailsOld,
  setOldPropertyMast,
  setOldTaxesReducer,
  setFloorSubmissionDetailsInitialData,
  setFloorSubmissionDetailsMinusData,
  setPendingTaxesReducer,
  setRToiletInitialData,
  setCToiletInitialData,
  setPropertyAdditionalDetails,
  setInitialDrainData,
  resetJointOwnerDetails,
  setDeletedFloorSubmisionMinusExistingProperty,
  setDeletedFloorSubmisionExistingProperty,
  setPropertyDetailsNewFormRedux,
  deletePropertyDetailsNew,
  clearFloorSubmissionDetailsMinusData,
  deletefloorSubmissionDetailsMinusData,
  deletefloorSubmissionDetailsInitialData,
  addTaxRow,
  updateTaxRow,
  removeTaxRow,
  setRemark,
  updateDocumentFile,
  deleteDocumentFile,
  setPolicy,
  setAction,
  addDocument,

  setFinanceYear,
  setErrors,
  resetDataEntryApproval,
  setAssessment,
  setPropertyInfo,
} = combinedDataEntrySlice.actions;

export default combinedDataEntrySlice.reducer;
