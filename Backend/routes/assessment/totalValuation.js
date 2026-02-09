import express from "express";
import { getpropertyDataFromNewDetails, 
    getpropertyDataFromOldDetails, 
    removeAllAppealsDetails, 
    removeAppealCommitteeDetails, 
    removeRemissionDetails, 
    removeHearingDetails, 
    removeRetentionDetails, 
    saveLastRow,
    applyPolicyDetails,
    detailsForShortKeys,
    applyTaxes
 } from "../../controllers/assessment/totalValuation.js";



const router = express.Router();

router.post('/propertydatafromnewdetails', getpropertyDataFromNewDetails);
router.post('/propertydatafromolddetails', getpropertyDataFromOldDetails);
router.post('/removeallappealsdetails', removeAllAppealsDetails);
router.post('/removeappealcommitteedetails', removeAppealCommitteeDetails);
router.post('/removeremissiondetails', removeRemissionDetails);
router.post('/removeretentiondetails', removeRetentionDetails);
router.post('/removehearingdetails', removeHearingDetails);
router.post('/savelastrow', saveLastRow);
router.post('/applypolicydetails', applyPolicyDetails);
router.post('/detailsForShortKeys', detailsForShortKeys)
router.post('/applyTaxes', applyTaxes)
applyTaxes

export default router;
















