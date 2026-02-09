import axios from 'axios';
import {
  MISSING_PHOTO_PLAN,
  MISSING_DATA,
  MISSING_PROPERTY_NO,
  MISSING_TOILET_DATA,
  NONTAXABLE_PROPERTY,
  TAXABLE_PROPERTY,
  DUPLICATE_PROPERTY_FLOOR,
  ZERO_CARPETAREA_PROPERTIES,
  CONSTRUCTION_RENT,
  OLDRV_HAVING_ZERO_NETTAX,
  PROPERTIES_RENT,
  OLDTAX_GT_OLDRV,
  ZERO_TAX_RV_OLD_PROPERTIES,
  OLD_WITHOUT_TAX_RV,
  OLD_TAX_PRESENT_NETZERO,
  PROPERTY_DESC_MISMATCH,
  EMP_TAX_RESIDENTIAL,
  EMP_TAX_EXEMPT_COMMERCIAL,
  EDU_TAX_EXEMPT_RESIDENTIAL,
  EDU_TAX_EXEMPT_COMMERCIAL,
  ZERO_TAX_PROPERTY_LIST,
  HOLDER_LIST,
  MUTATION_LIST,
  PROPERTIES_CHART,
  ZONING_LIST,
  CURRENT_APPEAL_STATUS,
  AUTO_APPEAL_COMMITTEE,
  AUTO_HEARING_LIST,
  OPEN_PLOT_PROPERTIES,
  OBLIQUE_PROPERTIES,
  CONSTRUCTION_PROPERTIES,
  GET_LIST_BY_TAX_RANGE,
  GET_NEW_TAX_LESS_OLD_TAX,
  PROPERTY_DESC_MATCH,
  GET_NEW_TAX_GREATER_OLD_TAX,
  DATA_ENTRY_GAP,
  GET_FLAT_DETAILS,
  GET_ROOM_COMPARISION_DETAILS,
  GET_TOILET_AREA_COMPARISION_DETAILS,
  GET_SQ_FT_COMPARISION_DETAILS,
  SUBMISSION_AREA_MISMATCH,
  SUBMISSION_ROOM_NO_MISMATCH,
  SUBMISSION_MISSING,
  ROOM_NO_REPEAT,
  LENGTH_ZERO_AREA_GT_ZERO,
  LENGTH_WIDTH_ZERO_AREA_GT_ZERO,
  AREA_TOTAL_IS_MINUS_YES,
  UTILITY_ROOM_COUNT,
  INVOICE_REPORT,
  TRANSACTION_REPORT,
  ADVANCE_AND_BILLBOOK_REPORT

} from '../../../constants/Report/autoQC/qc';

export const getMissingPhotos = async (selectedData) => {
  try {
    console.log('before fetching', selectedData);
    const response = await axios.post(MISSING_PHOTO_PLAN, selectedData);
    console.log('after fetching ');
    console.log('axios Missing Photos', response.data);
    return { data: response.data, status: response.status }; // Returns the list of properties with missing photos
  } catch (error) {
    console.error('Error fetching Missing Photos:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchMissingData = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(MISSING_DATA, selectedFilters);
    console.log('after fetching');
    console.log('axios missing data:', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching missing data:', error.response?.data || error.message);
    console.error('An error occurred while fetching the data. Please try again later.');
    throw error;
  }
};
export const missingPropertyNo = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(MISSING_PROPERTY_NO, selectedFilters);
    console.log('after fetching');
    console.log('axios missing PropertyNo', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching missing PropertyNo:', error.response?.data || error.message);
    throw error;
  }
};
export const missingToiletData = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(MISSING_TOILET_DATA, selectedFilters);
    console.log('after fetching', response);
    console.log('axios missing toilet data', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching missing toilet data:', error.response?.data || error.message);
    throw error;
  }
};

export const nontaxableProperty = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(NONTAXABLE_PROPERTY, selectedFilters);
    console.log('after fetching');
    console.log('axios nontaxableProperty', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching non taxable Property:', error.response?.data || error.message);
    throw error;
  }
};
export const dupPropertyFloor = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(DUPLICATE_PROPERTY_FLOOR, selectedFilters);
    console.log('after fetching');
    console.log('axios dupPropertyFloor', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching dupPropertyFloor:', error.response?.data || error.message);
    throw error;
  }
};
export const taxableProperty = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(TAXABLE_PROPERTY, selectedFilters);
    console.log('after fetching');
    console.log('axios taxableProperty', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching taxableProperty:', error.response?.data || error.message);
    throw error;
  }
};
export const zeroCarpetAreaProps = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(ZERO_CARPETAREA_PROPERTIES, selectedFilters);
    console.log('after fetching');
    console.log('axios zeroCarpetAreaProps', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching zeroCarpetAreaProps:', error.response?.data || error.message);
    throw error;
  }
};

export const constructionRent = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(CONSTRUCTION_RENT, selectedFilters);
    console.log('after fetching');
    console.log('axios constructionRent', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching constructionRent:', error.response?.data || error.message);
    throw error;
  }
};

export const oldRVHavingNoNetTax = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(OLDRV_HAVING_ZERO_NETTAX, selectedFilters);
    console.log('after fetching');
    console.log('axios oldRV having NoNetTax', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching oldRV having NoNetTax:', error.response?.data || error.message);
    throw error;
  }
};

export const propertiesRent = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(PROPERTIES_RENT, selectedFilters);
    console.log('after fetching');
    console.log('axios properties Rent', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching properties rent:', error.response?.data || error.message);
    throw error;
  }
};

export const oldTaxGrthanOldRV = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(OLDTAX_GT_OLDRV, selectedFilters);
    console.log('after fetching');
    console.log('axios oldTax Greater than OldRV', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching oldTax Greater than OldRV:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchOldWithoutTaxRV = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(OLD_WITHOUT_TAX_RV, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchOldWithoutTaxRV', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchOldWithoutTaxRV:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchZeroTaxRVOldProperties = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(ZERO_TAX_RV_OLD_PROPERTIES, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchZeroTaxRVOldProperties', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchZeroTaxRVOldProperties:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchOldTaxPresentNetZero = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(OLD_TAX_PRESENT_NETZERO, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchOldTaxPresentNetZero', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchOldTaxPresentNetZero:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchPropertyDescMismatch = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(PROPERTY_DESC_MISMATCH, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchPropertyDescMismatch', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchPropertyDescMismatch:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchEmpTaxResidential = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(EMP_TAX_RESIDENTIAL, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchEmpTaxResidential', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchEmpTaxResidential:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchEmpTaxExemptCommercial = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(EMP_TAX_EXEMPT_COMMERCIAL, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchEmpTaxExemptCommercial', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchEmpTaxExemptCommercial:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchEduTaxExemptCommercial = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(EDU_TAX_EXEMPT_COMMERCIAL, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchEduTaxExemptCommercial', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchEduTaxExemptCommercial:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchEduTaxExemptResidential = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(EDU_TAX_EXEMPT_RESIDENTIAL, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchEduTaxExemptResidential', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchEduTaxExemptResidential:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchZeroTaxPropertyList = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(ZERO_TAX_PROPERTY_LIST, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchZeroTaxPropertyList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchZeroTaxPropertyList:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchHolderList = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(HOLDER_LIST, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchHolderList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchHolderList:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchMutationList = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(MUTATION_LIST, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchMutationList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchMutationList:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchPropertiesChart = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(PROPERTIES_CHART, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchPropertiesChart', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchPropertiesChart:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchZoningList = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(ZONING_LIST, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchZoningList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchZoningList:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchCurrentAppealStatus = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(CURRENT_APPEAL_STATUS, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchCurrentAppealStatus', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchCurrentAppealStatus:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchAutoAppealCommittee = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(AUTO_APPEAL_COMMITTEE, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchAutoAppealCommittee', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchAutoAppealCommittee:', error.response?.data || error.message);
    throw error;
  }
};


export const fetchAutoHearingList = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(AUTO_HEARING_LIST, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchAutoHearingList', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchAutoHearingList:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchOpenPlotProperties = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(OPEN_PLOT_PROPERTIES, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchOpenPlotProperties', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchOpenPlotProperties:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchObliqueProperties = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(OBLIQUE_PROPERTIES, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchObliqueProperties', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchObliqueProperties:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchConstructionProperties = async (selectedFilters) => {
  try {
    console.log('before fetching');
    console.log(selectedFilters);
    const response = await axios.post(CONSTRUCTION_PROPERTIES, selectedFilters);
    console.log('after fetching');
    console.log('axios fetchConstructionProperties', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchConstructionProperties:', error.response?.data || error.message);
    throw error;
  }
};
export const getListByTaxRange = async (selectedWards, selectedDesc, taxRange) => {
  try {
    console.log('before fetching getListByTaxRange');
    const requestData = await axios.post(GET_LIST_BY_TAX_RANGE, {
      selectedWards, selectedDesc, taxRange
    })
    console.log('after fetching getListByTaxRange');
    console.log('axios getListByTaxRange', requestData.data);
    return { data: requestData.data, status: requestData.status };
  } catch (error) {
    console.error('Error fetching getListByTaxRange:', error.response?.data || error.message);
    throw error;
  }
};
export const getNewTaxLessOldTax = async (selectedWards, compareValue, xValue) => {
  try {
    console.log('before fetching getListByTaxRange');
    const requestData = await axios.post(GET_NEW_TAX_LESS_OLD_TAX, {
      selectedWards, compareValue, xValue
    })
    console.log('after fetching getListByTaxRange');
    console.log('axios getListByTaxRange', requestData.data);
    return { data: requestData.data, status: requestData.status };
  } catch (error) {
    console.error('Error fetching getListByTaxRange:', error.response?.data || error.message);
    throw error;
  }
};
export const getListByPropertyDesc = async (selectedWards, selectedTypes) => {
  try {
    console.log('before fetching getListByPropertyDesc');
    const requestData = await axios.post(PROPERTY_DESC_MATCH, {
      selectedWards, selectedTypes
    })
    console.log('after fetching getListByPropertyDesc');
    console.log('axios getListByPropertyDesc', requestData.data);
    return { data: requestData.data, status: requestData.status };
  } catch (error) {
    console.error('Error fetching getListByPropertyDesc:', error.response?.data || error.message);
    throw error;
  }
};


export const getNewTaxGreaterOldTax = async (selectedWards, compareValue, xValue) => {
  try {
    console.log('before fetching getListByTaxRange');
    const requestData = await axios.post(GET_NEW_TAX_GREATER_OLD_TAX, {
      selectedWards, compareValue, xValue
    })
    console.log('after fetching getListByTaxRange');
    console.log('axios getListByTaxRange', requestData.data);
    return { data: requestData.data, status: requestData.status };
  } catch (error) {
    console.error('Error fetching getListByTaxRange:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchDataEntryGap = async (selectedFilters) => {
  try {
    console.log('before fetching fetchDataEntryGap');
    const response = await axios.post(DATA_ENTRY_GAP, selectedFilters);
    console.log('after fetching fetchDataEntryGap');
    console.log('axios fetchDataEntryGap', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching fetchDataEntryGap:', error.response?.data || error.message);
    throw error;
  }
}
export const getFlatDetails = async (flatChecks, activePanel) => {
  try {
    console.log('before fetching getFlatDetails');
    const response = await axios.post(GET_FLAT_DETAILS, { flatChecks, activePanel });
    console.log('after fetching getFlatDetails');
    console.log('axios getFlatDetails', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching getFlatDetails:', error.response?.data || error.message);
    throw error;
  }
}
export const getRoomCarpetComparison = async (roomNoRepeatChecks, selectedWards) => {
  try {
    console.log('before fetching getRoomCarpetComparison');
    const response = await axios.post(GET_ROOM_COMPARISION_DETAILS, { roomNoRepeatChecks, selectedWards });
    console.log('after fetching getRoomCarpetComparison');
    console.log('axios getRoomCarpetComparison', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching getRoomCarpetComparison:', error.response?.data || error.message);
    throw error;
  }
}
export const getToiletAreaComparison = async (toiletAreaComparison, selectedWards) => {
  try {
    console.log('before fetching getToiletAreaComparison');
    const response = await axios.post(GET_TOILET_AREA_COMPARISION_DETAILS, { toiletAreaComparison, selectedWards });
    console.log('after fetching getToiletAreaComparison');
    console.log('axios getToiletAreaComparison', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    throw error;
  }
}
export const getSqFtComparison = async (selectedWards, percent) => {
  try {
    console.log('before fetching getSqFtComparison');
    const response = await axios.post(GET_SQ_FT_COMPARISION_DETAILS, { selectedWards, percent });
    console.log('after fetching getSqFtComparison');
    console.log('axios getSqFtComparison', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching getSqFtComparison:', error.response?.data || error.message);
    throw error;
  }
}
export const submissionAreaMismatch = async (selectedFilters) => {
  try {
    console.log('before fetching submissionAreaMismatch');
    const response = await axios.post(SUBMISSION_AREA_MISMATCH, selectedFilters);
    console.log('after fetching submissionAreaMismatch');
    console.log('axios submissionAreaMismatch', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching submissionAreaMismatch:', error.response?.data || error.message);
    throw error;
  }
};
export const submissionRoomNoMismatch = async (selectedFilters) => {
  try {
    console.log('before fetching submissionRoomNoMismatch');
    const response = await axios.post(SUBMISSION_ROOM_NO_MISMATCH,  selectedFilters );
    console.log('after fetching submissionRoomNoMismatch');
    console.log('axios submissionRoomNoMismatch', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching submissionRoomNoMismatch:', error.response?.data || error.message);
    throw error;
  }
};

export const submissionMissing = async (selectedFilters) => {
  try {
    console.log('before fetching submissionMissing');
    const response = await axios.post(SUBMISSION_MISSING,  selectedFilters );
    console.log('after fetching submissionMissing');
    console.log('axios submissionMissing', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching submissionMissing:', error.response?.data || error.message);
    throw error;
  }
};

export const roomNoRepeat = async (selectedFilters) => {
  try {
    console.log('before fetching roomNoRepeat');
    const response = await axios.post(ROOM_NO_REPEAT, selectedFilters);
    console.log('after fetching roomNoRepeat');
    console.log('axios roomNoRepeat', response.data);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error('Error fetching roomNoRepeat:', error.response?.data || error.message);
    throw error;
  }
};

export const lengthZeroAreaGtZero = async (selectedFilters) => {
  try {
    console.log('before fetching lengthZeroAreaGtZero');
    const response = await axios.post(LENGTH_ZERO_AREA_GT_ZERO, selectedFilters);
    console.log('after fetching lengthZeroAreaGtZero');
    console.log('axios lengthZeroAreaGtZero', response.data);
    return { data: response.data, status: response.status };
  }
  catch (error) {
    console.error('Error fetching lengthZeroAreaGtZero:', error.response?.data || error.message);
    throw error;
  }
};
export const lengthWidthZeroAreaGtZero = async (selectedFilters) => {
  try {
    console.log('before fetching lengthWidthZeroAreaGtZero');
    const response = await axios.post(LENGTH_WIDTH_ZERO_AREA_GT_ZERO, selectedFilters);
    console.log('after fetching lengthWidthZeroAreaGtZero');
    console.log('axios lengthWidthZeroAreaGtZero', response.data);
    return { data: response.data, status: response.status };
  }
  catch (error) {
    console.error('Error fetching lengthWidthZeroAreaGtZero:', error.response?.data || error.message);
    throw error;
  }
};

export const areaTotalIsMinusYes = async (selectedFilters) => {
  try {
    console.log('before fetching areaTotalIsMinusYes');
    const response = await axios.post(AREA_TOTAL_IS_MINUS_YES, selectedFilters);
    console.log('after fetching areaTotalIsMinusYes');
    console.log('axios areaTotalIsMinusYes', response.data);
    return { data: response.data, status: response.status };
  }
  catch (error) {
    console.error('Error fetching areaTotalIsMinusYes:', error.response?.data || error.message);
    throw error;
  }
};

export const utilityRoomCount = async (selectedFilters) => {
  try {
    console.log('before fetching utilityRoomCount');
    const response = await axios.post(UTILITY_ROOM_COUNT, selectedFilters);
    console.log('after fetching utilityRoomCount');
    console.log('axios utilityRoomCount', response.data);
    return { data: response.data, status: response.status };
  }
  catch (error) {
    console.error('Error fetching utilityRoomCount:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchInvoiceReport = async (selectedFilters) => {
  try {
    console.log('before fetching fetchMissingInvoice');
    const response = await axios.post(INVOICE_REPORT, selectedFilters);
    console.log('after fetching fetchMissingInvoice');
    console.log('axios fetchMissingInvoice', response.data);
    return { data: response.data, status: response.status };
  }
  catch (error) {
    console.error('Error fetching fetchMissingInvoice:', error.response?.data || error.message);
    throw error;
  }
}
export const fetchTransactionReport=async(selectedFilters)=>{
try {
    console.log('before fetching TransactionReport');
    const response = await axios.post(TRANSACTION_REPORT, selectedFilters);
    console.log('after fetching TransactionReport');
    console.log('axios TransactionReport', response.data);
    return { data: response.data, status: response.status };
  }
  catch (error) {
    console.error('Error fetching TransactionReport:', error.response?.data || error.message);
    throw error;
  }
}

export const advanceAndBillBookReport=async(selectedFilters)=>{
try {
    console.log('before fetching TransactionReport');
    const response = await axios.post(ADVANCE_AND_BILLBOOK_REPORT, selectedFilters);
    console.log('after fetching advanceAndBillBookReport');
    console.log('axios advanceAndBillBookReport', response.data);
    return { data: response.data, status: response.status };
  }
  catch (error) {
    console.error('Error fetching advanceAndBillBookReport:', error.response?.data || error.message);
    throw error;
  }
}