import express from "express";
import { addTaxes, addTaxesFromTo, fetchFinanceYearProperty, getMiscellaneouseFromTo, removeTaxes, updateAdvanceDeductionFromProperty, updateAdvanceDeduction ,getPropertiesForAdvanceDeduction,getFinanceYearList} from "../../controllers/utility/addTaxes.js";



const router = express.Router();
router.get('/financeYearProperty', fetchFinanceYearProperty);
router.post('/addTaxes', addTaxes);
router.post('/removeTaxes', removeTaxes)
router.post('/updateAdvanceDeduction', updateAdvanceDeduction);
router.get('/getPropertiesForAdvanceDeduction', getPropertiesForAdvanceDeduction);

router.post('/addTaxesFromTo', addTaxesFromTo);
router.post('/updateAdvanceDeductionFromProperty', updateAdvanceDeductionFromProperty);
router.get('/miscellaneouseProperty', getMiscellaneouseFromTo);
router.get('/getFinanceYearList',getFinanceYearList)



export default router;