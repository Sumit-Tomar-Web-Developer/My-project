import express from "express";
import { getAddressMobileByWard, getAppealCommitteeList, getAppealCurrentListByReason, getAppealValueAppealReport, getBillBookListByYear, getBillBookNoByYear, getCanceledInvoiceList, getCombinedPropertiesByWard, getCommTaxZeroReport, getCommercialUCReport, getCommercialZeroEmploymentReport, getCompareReport, getConstructionAR, getConstructionListByWard, getDataEntryGapReport, getDefaultPropertyList, getDuplicatePropertyByWard, getDuplicatePropertyFloor, getEmployeeTax, getFlatSystemUniqueProperties, getHearingList, getHighTaxPropertiesReport, getHolderByWard, getHolderByWardExact, getMissingBuildingShopNameList, getMissingGisPropertyImagesList, getMissingInvoiceList, getMissingOwnerList, getMissingPhotoPlanList, getMissingPlotAreaList, getMissingToiletData, getMissingZeroTaxBuildingNameList, getMutationListByDate, getNoTaxZeroRVOldPropertie, getNonTaxableTotalTaxReport, getNonTaxableZeroTaxReport, getOldPropertyGreaterOldTaxByWard, getOldRVHasValueButNetTaxZero, getOldTax, getOldTaxGreaterOldRvByWard, getOldTaxGreaterThanRvReport, getOldTaxHigherReport, getOldTaxZeroBothByWard, getOldTaxZeroByWard, getOldVsNewRVComparisonReport, getOldVsNewRVPercentageReport, getOpenPlotProperties, getOpenPlotPropertiesByWard, getOpenPlotWithoutDetails, getOuterPropertiesReport, getPropertiesByDescription, getPropertiesOldTaxNewTaxMissing, getPropertiesWithRenterHavingRent, getPropertiesWithZeroOldTax, getPropertiesWithoutRenter, getPropertyObliqueReport, getPropertyReportMismatch, getPropertyTaxRangeReport, getPropertyWithNetTaxByWard, getProposedNewRvNetZeroTaxReport, getReducedTaxReport, getRenterPropertyReport, getSpecialPropertyWithoutRent, getTaxAppliedTaxZeroReport, getTransListByWard, getUnderConstructionReport, getUtilityMismatchReport, getWardWiseOwnerSocialDetails, getWardWisePropertyReport, getWardWiseZeroCarpetOwners, getWardWiseZeroRentOccupierList, getWardWiseZoneReport } from "../../../controllers/report/autoQC/qualityControl.js";



const router = express.Router();

router.post('/missing-photo',getMissingPhotoPlanList);
router.post('/missing-plan',getTransListByWard);
router.post('/defaultproperty',getDefaultPropertyList);
router.post('/construction',getConstructionListByWard);
router.post('/holder',getHolderByWard);
router.post('/greTax',getOldPropertyGreaterOldTaxByWard);
router.post('/greRv',getOldTaxGreaterOldRvByWard);
router.post('/zeroTax',getOldTaxZeroBothByWard);
router.post('/noTaxZeroRV',getNoTaxZeroRVOldPropertie);
router.post('/missPropertyNew',getMissingOwnerList);
router.post('/hearing',getHearingList);
router.post('/appeal',getAppealCommitteeList);
router.post('/currentReason',getAppealCurrentListByReason);
router.post('/zeroCarpert',getWardWiseZeroCarpetOwners);
router.post('/toilet',getWardWiseOwnerSocialDetails);
router.post('/zeroRent',getWardWiseZeroRentOccupierList);
router.post('/oldZeroPropTotalTax',getOldTaxZeroByWard);
router.post('/duplicateProperty',getDuplicatePropertyByWard);
router.post('/OldRVHasValueButNetTaxZero',getOldRVHasValueButNetTaxZero);
router.post('/propertiesWithoutRenter',getPropertiesWithoutRenter);
router.post('/openPlotProperties',getOpenPlotWithoutDetails);
router.post('/combineProperties',getCombinedPropertiesByWard);
router.post('/addressMobile',getAddressMobileByWard)
router.post('/duplicateFloor',getDuplicatePropertyFloor)
router.post('/netTax',getPropertyWithNetTaxByWard)
router.post('/missInvoice',getMissingInvoiceList)
router.post('/billbookno',getBillBookListByYear)
router.post('/newOldFloorType',getRenterPropertyReport)
router.post('/renterHavingRent',getPropertiesWithRenterHavingRent)
router.post('/cancelbillbookno',getCanceledInvoiceList)
router.post('/openPlotYes',getOpenPlotPropertiesByWard)
router.post('/missingFloor',getOpenPlotProperties)
router.post('/missingToilet',getMissingToiletData)
router.post('/billbooknos',getBillBookNoByYear)
router.post('/oldAndNewRvPer',getCommercialUCReport)
router.post('/underConstruction',getUnderConstructionReport)
router.post('/propMismatch',getPropertyReportMismatch)
router.post('/totalTaxGr',getHighTaxPropertiesReport)
router.post('/totalTaxRange',getPropertyTaxRangeReport)
router.post('/oldRvOldTax',getPropertiesWithZeroOldTax)
router.post('/oldTaxMissing',getPropertiesOldTaxNewTaxMissing)
router.post('/plotAreaMissing',getMissingPlotAreaList)
router.post('/zeroTaxOpenPlot',getMissingZeroTaxBuildingNameList)
router.post('/shopName',getMissingBuildingShopNameList)
router.post('/pdesc',getPropertiesByDescription)
router.post('/bankTowerRent',getSpecialPropertyWithoutRent)
router.post('/gisImage',getMissingGisPropertyImagesList)
router.post('/oldNewRvCompare',getOldVsNewRVComparisonReport)
router.post('/netTotalTaxLess',getOldTaxHigherReport)
router.post('/totalTaxLessOld',getReducedTaxReport)
router.post('/comparison',getCompareReport)
router.post('/employeeTax',getEmployeeTax)
router.post('/zeroCemployee',getCommercialZeroEmploymentReport)
router.post('/newHolder',getHolderByWardExact)
router.post('/outer',getOuterPropertiesReport)
router.post('/oldTax',getOldTax)
router.post('/actualValueAppeal',getAppealValueAppealReport)
router.post('/oblique',getPropertyObliqueReport)

router.post('/propRvNetTax',getProposedNewRvNetZeroTaxReport)
router.post('/dataEntryGap',getDataEntryGapReport)
router.post('/utilityMismatch',getUtilityMismatchReport)
router.post('/taxAppliedZero',getTaxAppliedTaxZeroReport)
router.post('/mutation',getMutationListByDate)
router.post('/propertyChart',getWardWisePropertyReport)
router.post('/zoining',getWardWiseZoneReport)
router.post('/nonTaxable',getNonTaxableTotalTaxReport)
router.post('/nonZeroTaxable',getNonTaxableZeroTaxReport)
router.post('/flatWards',getFlatSystemUniqueProperties)
router.post('/constAR',getConstructionAR)
router.post('/oldpropGrRv',getOldTaxGreaterThanRvReport)
router.post('/commEduZero',getCommTaxZeroReport)
router.post('/percentage',getOldVsNewRVPercentageReport)



export default router;