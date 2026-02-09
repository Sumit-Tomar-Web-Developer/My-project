import { configureStore } from '@reduxjs/toolkit';

import socialDetailsSlice from '../reducers/socialDetailsSlice.js';
import additionalDetailsSlice from '../reducers/additionlPropertyDataSlice.js';
import newFloorDetailsSlice from '../reducers/newFloorInformationSlice.js';
import formDataEntrySlice from '../reducers/dataEntry/formDataEntryJointOwnerSlice.js';
import propertyMastFormDataSlice from '../reducers/dataEntry/formDataPropertyMast.js';

import combinedDataEntrySlice from '../reducers/ExistingPropertySlice.js';
import capitalValueSlice from '../reducers/totalValution/capitalValueAssessment.js';
import setPoliciesSlice from '../reducers/setAssessmentRules/setPoliciesSlice.js';

import fileUploadReducer from '../reducers/dataEntry/uploadPhotoPlanSlice.js';
import imageReducer from '../reducers/dataEntry/getPropertyImageSlice.js';

import pageLockSlice from '../reducers/lockProperty/lockPropertySlice.js';
import newUserDetailsSlice from '../reducers/newUser/newUserSlice.js';
import accessLevelSlice from '../reducers/dataEntry/accessLevelDataEntrySlice.js';
import RetentionTaxDataSlice from '../reducers/dataEntry/retainTaxesSlice.js'
import mutationOwnerSlice from '../reducers/MutationSlice.js';
//Store propertyImages for Imagedownloader based on the given range (FromPropertyNo to ToPropertyNo)
import imageDownloaderReducer from '../reducers/imageDownloaderSlice.js';
//application seeting
import applicationSettingSlice from '../reducers/applicationSettingSlice/applictaionSettingSlice.js'
// import dataEntryApprovalSlice from '../reducers/dataEntryApprovalAssessment.js';


const store = configureStore({
  reducer: {
    socialDetails: socialDetailsSlice,
    additionalDetails: additionalDetailsSlice,
    newFloorDetails: newFloorDetailsSlice,
    formDataDetails: formDataEntrySlice,
    propertyMastDetails: propertyMastFormDataSlice,
    combinedDataEntry: combinedDataEntrySlice,
    capitalValue: capitalValueSlice,
    setPolicies: setPoliciesSlice,
    pageLock: pageLockSlice,
    newUserDetails: newUserDetailsSlice,
    fileUpload: fileUploadReducer,
    image: imageReducer,
    accessLevel: accessLevelSlice,
    retentionTaxData:RetentionTaxDataSlice,
    mutationOwner:mutationOwnerSlice,
    imageDownloader:imageDownloaderReducer,
    appSetting: applicationSettingSlice,
    // dataEntryApproval: dataEntryApprovalSlice,



  }
});

export default store;
