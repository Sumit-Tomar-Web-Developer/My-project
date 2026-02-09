import express from 'express';
import {
  getJointOwnerList,
  getOwnerNamesByPropertyNoRange,
  getPropertiesRangeFromAndTo,
  postCommonRemark,
  postOwnerAddress,
  postOwnerNameSameAs,
  postPropertyDescriptionDetails,
  postRoadWidth,
  postShopDetails,
  postWadhGhatRemark,
  updateCombinedOwnerNames,
} from '../../controllers/utility/UpdatePropertDetailsController.js';

const router = express.Router();

router.post('/propertyNoRange', getPropertiesRangeFromAndTo);
router.post('/getOwnerNamesByPropertyNoRange', getOwnerNamesByPropertyNoRange);
router.post('/getJointDetailsByOwnerId', getJointOwnerList);
router.post('/saveMultipleOwnerNamesByID', updateCombinedOwnerNames);
router.post('/saveNewOwnerName', postOwnerNameSameAs);
router.post('/saveOwnerAddressByID', postOwnerAddress);
router.post('/saveRoadWidth', postRoadWidth);

router.post('/savePropertyDescription', postPropertyDescriptionDetails);
router.post('/saveShop', postShopDetails);
router.post('/saveCommonREmark', postCommonRemark);
router.post('/saveWadhGhatRemark', postWadhGhatRemark);
export default router;
