import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
  policy: '',         // Apply policy dropdown
  action: '',         // Action dropdown
  financeYear: '',    // Selected finance year
  hasErrors: false,
  fieldErrors: {}
};

const dataEntryApprovalSlice = createSlice({
  name: 'dataEntryApproval',
  initialState,
  reducers: {
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
      const { id, file } = action.payload;
      state.documents = state.documents.map(doc =>
        doc.id === id ? { ...doc, file } : doc
      );
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
    }
  }
});

export const {
  addTaxRow,
  updateTaxRow,
  removeTaxRow,
  setRemark,
  updateDocumentFile,
  deleteDocumentFile,
  setPolicy,
  setAction,
  setFinanceYear,
  setErrors,
  resetDataEntryApproval
} = dataEntryApprovalSlice.actions;

export default dataEntryApprovalSlice.reducer;
