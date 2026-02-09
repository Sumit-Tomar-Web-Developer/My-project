import express from "express";
import {
  getMissingData,
  getMissingPhotos,
  getMissingPropertyNo,
  getToiletData,
  getNonTaxableData,
  getTaxableData,
  getZeroCarpetAreaProps,
  getConstructionRent,
  getDupPropertyFloor,
  getOldRVNoNetTax,
  getPropertiesRent,
  getOldTaxGreaterThanOldRV,
  getWithoutTaxRVOldProperties,
  getZeroTaxAndRVOldProperties,
  getoldTaxNetZero,
  getpropertyDescMismatch,
  getEmpTaxResidential,
  getEmpTaxExemptCommercial,
  getEduTaxExemptResidential,
  getEduTaxExemptCommercial,
  zeroTaxPropertyList,
  getHolderList,
  getMutationList,
  getPropertiesChart,
  getZoningList,
  getCurrentAppealStatus,
  getAutoAppealCommittee,
  getAutoHearingList,
  getOpenPlotProperties,
  getObliqueProperties,
  constructionProperties,
  getTotalTaxInRange,
  getNewTaxLessOldTax,
  getpropertyDescMatch,
  getNewTaxGreaterOldTax,
  getDataEntryGap,

  //flat functions
  getFlatDetails,
  getRoomCarpetComparison,
  getToiletAreaComparison,
  getSqFtComparison,

//submission functions
  getSubmissionAreaMismatch,
  getSubmissionRoomNoMismatch,
  getSubmissionMissing,
  getRoomNoRepeat,
  getLengthZeroAreaGtZero,
  getLengthWidthZeroAreaGtZero,
  getAreaTotalIsMinusYes,
  getUtilityRoomCount,
  getInvoiceReport,
  getTransactionReport,
  getAdvanceAndBillBookReport
} from "../../../controllers/report/autoQC/qcController.js";

const router = express.Router();
//Missing Details
router.post("/missing-photo-plan", getMissingPhotos);
router.post("/missing-data", getMissingData);
router.post("/missing-property-no", getMissingPropertyNo);
router.post("/missing-toilet", getToiletData);
//Non Taxable List
router.post("/nontaxable-property", getNonTaxableData);
router.post("/taxable-property", getTaxableData);
//Auto QC
router.post("/zero-carpetArea-properties", getZeroCarpetAreaProps);
router.post("/construction-rent", getConstructionRent);
router.post("/duplicate-property-floor", getDupPropertyFloor);
router.post("/oldRV-NoNetTax",getOldRVNoNetTax)
router.post("/properties-rent", getPropertiesRent);
router.post("/oldtax-gt-oldrv", getOldTaxGreaterThanOldRV);
router.post("/old-without-tax-rv", getWithoutTaxRVOldProperties);
router.post("/zero-tax-rv-old-properties", getZeroTaxAndRVOldProperties);
router.post("/old-tax-present-net-zero", getoldTaxNetZero);
router.post("/property-desc-mismatch", getpropertyDescMismatch);
router.post("/emp-tax-residential", getEmpTaxResidential);
router.post("/emp-tax-exempt-commercial", getEmpTaxExemptCommercial);
router.post("/edu-tax-exempt-residential", getEduTaxExemptResidential);
router.post("/edu-tax-exempt-commercial", getEduTaxExemptCommercial);
//Recommended By MC
router.post("/zero-tax-property-list", zeroTaxPropertyList);
router.post("/holder-list", getHolderList);
router.post("/mutation-list", getMutationList);
router.post("/properties-chart", getPropertiesChart);
router.post("/zoning-list", getZoningList);
router.post("/current-appeal-status", getCurrentAppealStatus);
router.post("/auto-appeal-committee", getAutoAppealCommittee);
router.post("/auto-hearing-list", getAutoHearingList);

//Assessment QC List
router.post("/open-plot-properties", getOpenPlotProperties);
router.post("/oblique-properties", getObliqueProperties);
router.post("/construction-properties", constructionProperties);
router.post("/get-list-by-tax-range", getTotalTaxInRange);
router.post("/new-tax-less-old-tax", getNewTaxLessOldTax);
router.post("/property-desc-match", getpropertyDescMatch);
router.post("/new-tax-greater-old-tax", getNewTaxGreaterOldTax);
router.post("/data-entry-gap", getDataEntryGap);

//flat checks routes
router.post("/get-flat-details", getFlatDetails);
router.post("/get-room-carpet-comparison", getRoomCarpetComparison);
router.post("/get-toilet-area-comparison", getToiletAreaComparison);
router.post("/get-sq-ft-comparison", getSqFtComparison);

//submission checks routes
router.post("/submission-area-mismatch", getSubmissionAreaMismatch);
router.post("/submission-room-no-mismatch", getSubmissionRoomNoMismatch);
router.post("/submission-missing", getSubmissionMissing);
router.post("/room-no-repeat", getRoomNoRepeat);
router.post("/length-zero-area-gt-zero", getLengthZeroAreaGtZero);
router.post("/length-width-zero-area-gt-zero", getLengthWidthZeroAreaGtZero);
router.post("/area-total-is-minus-yes", getAreaTotalIsMinusYes);
router.post("/utility-room-count", getUtilityRoomCount);

//AMC 
router.post("/invoice-report", getInvoiceReport);
router.post("/transaction-report", getTransactionReport);
router.post("/advance-and-billbook-report", getAdvanceAndBillBookReport);
export default router;