import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  minRV: false,
  minRvOldRvZero: false,
  asPerOldForNewProperty: false,
  appealPolicyRuleWise: false,
  asPerOld: false,
  mixassessment: false,
  policyApplicable: false,
  retention: false,
  isRetention: false,
  capitalValue: false,
  historyLock: false,
  utilityLock: false,
  applyDiscount: false,
  dataEntryLock: false,
  drainTaxFlat: false,
  postingDeleted: false,
  newPropertyRemark: false,
  appealMaxDisc: 0,
  lockPropertyEditional: false,
  showPhotosAndPlan: false,
  minusPendingTax: false,
  photoPlanDB: false,
  restrictWrongFloor: false,
  restrictDuplicateEntry: false,
  plotTaxable: false,
  isHearing: false,
  plotTaxApplicable: false,
  isReasonLock: false,
  calfloorRenterRent: false,
  calcombineRenterRent: false,
  isAppealCommity: false,
  opEduEmpTax: false,
  isRemission: false,
  Deviation: 0,
  dataEntryScreen: false,
  meter: false,
  invoiceAutoGnerated: false,
  pendingDemandPay: false,
  reportImagePath: false,
  discountOnInterestBill: false,
  otpEnabled: false,
  wardAllocation: false,
  applyDiscountforExtended: false,
  ownerIdForReportName: false,
  languageEnabled: false,
  rentalValidity: false,
  qrCode: false,
  receiptPrint: false,
  hearingMaxDisc: 0,
  currentBalance: false,
  pendingBalance: false,
  activeInterest2: false,
  dbForAMC: false,
  assesmentCompleted: false,
  allowSMS: false,
  policyLock: false,
  dukanGalaMaintenance: false,
  penaltyMonthly: false
};

const setPoliciesSlice = createSlice({
  name: 'Policies',
  initialState,
  reducers: {
    setPolicies(state, action) {
      console.log('Before state:', state);
      console.log('Action payload:', action.payload);
      return { ...state, ...action.payload };
    }
  }
});

export const { setPolicies } = setPoliciesSlice.actions;

export default setPoliciesSlice.reducer;
