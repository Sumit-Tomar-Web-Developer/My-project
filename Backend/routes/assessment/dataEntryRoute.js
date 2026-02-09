import express from 'express';
import {
  getAllOwnerIDs,
  getAllTablesDataByOwnerID,
  getJointOwnerList,
  getPropertyMast,
  getPropertyTypeMaster,
  savePropertyInfo,
  deletePropertyDetails,
  getFloorNoOfRoomList,
  getAllRoomShapeNames,
  getAllRoomTypes,
  getTypeOfUseByGroup,
  getAllUseGroups,
  getTapSizes,
  getValuationData,

  getRetainData,
  checkPDNIdForGeneratingNew,
  checkFSDIdForGeneratingNew,
  checkFSDMDIdForGeneratingNew,
getConvertedImg,
  permissionForSubmission,
  addCombinedProperties,
  insertOwnerTaxChange,
  savePropertyAmcInfo,
  createDataEntrySendToApproval

} from '../../controllers/assessment/dataEntryController.js';


const router = express.Router();
router.get('/property-desc-list', getPropertyTypeMaster);
router.get('/property-mast', getPropertyMast);
router.get('/joint-owner', getJointOwnerList);
router.get('/ownerid-list', getAllOwnerIDs);
router.post('/post-data-entry', savePropertyInfo);
router.post('/post-data-entry-amc', savePropertyAmcInfo);

router.post('/delete-property', deletePropertyDetails);
router.post('/all-table-property-data', getAllTablesDataByOwnerID);
router.get('/floorRooms', getFloorNoOfRoomList);
router.get('/roomShapes', getAllRoomShapeNames);
//router.post('/propertyImage', getImageByOwnerId)
router.get('/roomType', getAllRoomTypes);
router.get('/getTypeDescByGroupId', getTypeOfUseByGroup);
router.get('/getTypeGroup', getAllUseGroups);
router.get('/getTapSizes', getTapSizes);
router.post('/valuation-data', getValuationData);

router.post('/retention-data', getRetainData);

router.post('/pdnid-check', checkPDNIdForGeneratingNew);
router.post('/fsdid-check', checkFSDIdForGeneratingNew);
router.post('/fsdmdid-check', checkFSDMDIdForGeneratingNew);

router.post('/add-combined-properties', addCombinedProperties);

router.get('/permission-for-submission', permissionForSubmission);
router.post('/getConvertedImg',getConvertedImg)
router.post('/saveLastRow',insertOwnerTaxChange)
router.post('/insert-data-entry-approval', createDataEntrySendToApproval);

export default router;

