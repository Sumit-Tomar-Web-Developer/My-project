import axios from "axios";
import { GET_ACTAUL_VALUE_APPEAL, GET_ADDRESS_MOBILE, GET_APPEAL_COMMITTEE_MAST, GET_APPEAL_CURRENT_REASON, GET_BANK_TOWER_WITHOUT_RENT, GET_BILL_BOOK_BY_YEAR, GET_BILL_BOOK_NO_BY_YEAR, GET_CANCEL_BILL_BOOK, GET_COMBINE_PROPERTIES, GET_COMM_EDU_ZERO, GET_COMPARISON, GET_CONSTRUCTION_AR, GET_CONSTRUCTION_LIST, GET_DATA_ENTRY_GAP, GET_DUPLICATE_FLOOR, GET_DUPLICATE_PROPERTY, GET_EMPLOYEE_TAX, GET_FLAT_WARDS, GET_GIS_IMAGE, GET_HEARING_MAST, GET_HIGH_TAX_PROPERTIES, GET_HOLDER, GET_MISSING_BUILDING_SHOP_NAME, GET_MISSING_PHOTOS_PLAN, GET_MISSING_PLAN_LIST,  GET_MISSING_PLOT_AREA,  GET_MISSING_PROPERTY_NEW,  GET_MISSION_INVOICE,  GET_MISSION_TOILET,  GET_MUTATION,  GET_NEW_PROPERTIES,  GET_OBLIQUE,  GET_OLD_NEW_RV_COMPARE,  GET_OLD_PROPERTY_GR_RV,  GET_OLD_RV_HAS_VALUE_BUT_NET_TAX,  GET_OLD_RV_HAS_VALUE_BUT_NET_TAX_ZERO,  GET_OLD_TAX_GREATER_OLD_RV,  GET_OLD_TAX_Gret,  GET_OLD_TAX_HIGHER,  GET_OLD_TAX_ZERO_WARD,  GET_OPEN_PLOT_PROPERTIES,  GET_OPEN_PLOT_WITHOUT_DETAILS,  GET_OUTER_PROPERTIES,  GET_PERCENTEAGE,  GET_PROPERTIES_DESCRPITION,  GET_PROPERTIES_HAVING_NEW_RV_NET_TAX_ZERO,  GET_PROPERTIES_OLD_TAX_NEW,  GET_PROPERTIES_WITHOUT_RENTER,  GET_PROPERTIES_WITH_ZERO_OLD_TAX,  GET_PROPERTY_DESCRIPTION,  GET_PROPERTY_TAX_GREATER_OLD_TAX, GET_Property_CHART, GET_REDUCER_TAX_REPORT, GET_RENTER_HAVING_RENT, GET_SOCIAL_DETAILS, GET_TAXABLE_TOTAL_TAX, GET_TAXABLE_TOTAL_TAX_ZERO, GET_TAX_APPLIED_TAX, GET_TOTAL_TAX_RANGE, GET_UNDER_CONSTRUCTION, GET_UTILITY_MISMATCH, GET_ZERO_CARPET, GET_ZERO_COMMER_EMPLOYEE, GET_ZERO_RENT, GET_ZERO_TAX, GET_ZERO_TAX_OPEN_PLOT, GET_ZOINING } from "constants/Report/autoQC/qualityControlConstant.js/qualityControlConstant";
import { GET_DEFAULT_PROPERTY } from "../../../../constants/Report/autoQC/qualityControlConstant.js/qualityControlConstant";

export const fetchMissingPhotoPlanList = async (wardNos) => {
  try {
    const response = await axios.post(GET_MISSING_PHOTOS_PLAN, { wardNos });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching Missing Photo/Plan List:", error);
    throw error;
  }
};
export const fetchMissingPlanList = async (wardNos) => {
  try {
    const response = await axios.post(GET_MISSING_PLAN_LIST, { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};

export const fetchDefaultProperty = async (wardNos) => {
  try {
    const response = await axios.post(GET_DEFAULT_PROPERTY, { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching default property List:", error);
    throw error;
  }
};

export const fetchHolderList = async (wardNos) => {
  try {
    const response = await axios.post(GET_HOLDER
      , { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};
export const fetchPropertyTaxGreaterThanOldTax = async (wardNos) => {
  try {
    const response = await axios.post(GET_PROPERTY_TAX_GREATER_OLD_TAX
      , { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};
export const fetchOldTaxGreaterThanOldRv = async (wardNos) => {
  try {
    const response = await axios.post(GET_OLD_TAX_GREATER_OLD_RV
      , { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};
export const fetchZeroOldTax = async (wardNos) => {
  try {
    const response = await axios.post(GET_ZERO_TAX
      , { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};
export const fetchMissingPropertyNew = async (wardNos) => {
  try {
    const response = await axios.post(GET_MISSING_PROPERTY_NEW
      , { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};
export const fetchHearingMast = async (wardNos) => {
  try {
    const response = await axios.post(GET_HEARING_MAST
      , { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};
export const fetchAppealCommitteeMast = async (wardNos) => {
  try {
    const response = await axios.post(GET_APPEAL_COMMITTEE_MAST
      , { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};
export const fetchAppealCurrentReasonMast = async (wardNos) => {
  try {
    const response = await axios.post(GET_APPEAL_CURRENT_REASON
      , { wardNos });
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching Missing Plan List:", error);
    throw error;
  }
};
export const getConstructionList = async (wards) => {
  try {
    // 👇 Correct key
    const response = await axios.post(GET_CONSTRUCTION_LIST, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching construction list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in get Construction List:', error);
    throw error;
  }
};

//zero carpet
export const fetchZeroCarpetList = async (wards) => {
  try {
    // 👇 Correct key
    const response = await axios.post(GET_ZERO_CARPET, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Carpet list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Carpet:', error);
    throw error;
  }
};

export const getSocialDetailsList = async (wards) => {
  try {
    const response = await axios.post(GET_SOCIAL_DETAILS, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Social list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Social:', error);
    throw error;
  }
};
export const getZeroRentList = async (wards) => {
  try {
    const response = await axios.post(GET_ZERO_RENT, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Zero Rent list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Zero Rent:', error);
    throw error;
  }
};
export const getOldTaxZeroList = async (wards) => {
  try {
    const response = await axios.post(GET_OLD_TAX_ZERO_WARD, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Old Tax Zero  list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Old Tax Zero :', error);
    throw error;
  }
};
export const getDuplicatePropertyList = async (wards) => {
  try {
    const response = await axios.post(GET_DUPLICATE_PROPERTY, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Duplicate Property  list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Duplicate Property :', error);
    throw error;
  }
};
export const getOldRvHasValueButNetTaxZeroList = async (wards) => {
  try {
    const response = await axios.post(GET_OLD_RV_HAS_VALUE_BUT_NET_TAX_ZERO, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Duplicate Old Rv Has Value But Net Tax Zero  list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Old Rv Has Value But Net Tax Zero :', error);
    throw error;
  }
};

export const getPropertiesWithoutRenterList = async (wards) => {
  try {
    const response = await axios.post(GET_PROPERTIES_WITHOUT_RENTER, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Properties Without Renter  list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Properties Without Renter :', error);
    throw error;
  }
};
export const getOpenPlotWithoutDetailsList = async (wards) => {
  try {
    const response = await axios.post(GET_OPEN_PLOT_WITHOUT_DETAILS, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Open Plot Without Details list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Open Plot Without Details :', error);
    throw error;
  }
};

export const getCombinePropertiesList = async (wards) => {
  try {
    const response = await axios.post(GET_COMBINE_PROPERTIES, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Open Plot Without Details list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Open Plot Without Details :', error);
    throw error;
  }
};
export const getAddressMobileList = async (wards) => {
  try {
    const response = await axios.post(GET_ADDRESS_MOBILE, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching Open Plot Without Details list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in Open Plot Without Details :', error);
    throw error;
  }
};
export const getOldRvHasValueButNetTax = async (wards) => {
  try {
    const response = await axios.post(GET_OLD_RV_HAS_VALUE_BUT_NET_TAX, { wardNos: wards });

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error('Error fetching net tax Without Details list:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('API Error in net tax Without Details :', error);
    throw error;
  }
};

//bill book
export const getMissingInvoiceService = async (reqBody) => {
  try {
    const response = await axios.post(GET_MISSION_INVOICE, reqBody);
    return response.data;
  } catch (error) {
    console.error("Missing Invoice Service Error:", error);
    throw error;
  }
};
export const fetchBillBookByYear = async (year) => {
  try {
    const response = await axios.post(GET_BILL_BOOK_BY_YEAR, { year });
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching Bill Book List:", error);
    return [];
  }
};
export const fetchBillBookNoByYear = async (year) => {
    try {
      const response = await axios.post(GET_BILL_BOOK_NO_BY_YEAR, { Year: year });
  
      return response.data["BillBook List"] || []; 
    } catch (error) {
      console.error("Error fetching Bill Book List:", error);
      return [];
    }
  };
  
export const getDuplicateFloor = async (wardNos) => {
  try {
    const response = await axios.post(GET_DUPLICATE_FLOOR, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in duplicate floor:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getMissionToilet = async (wardNos) => {
  try {
    const response = await axios.post(GET_MISSION_TOILET, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in miss toilet floor:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getRenterHavingRent = async (wardNos) => {
  try {
    const response = await axios.post(GET_RENTER_HAVING_RENT, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in renter having rent:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getCancelBillBookInvoiceService = async (reqBody) => {
  try {
    const response = await axios.post(GET_CANCEL_BILL_BOOK, reqBody);
    return response.data;
  } catch (error) {
    console.error("Missing Invoice Service Error:", error);
    throw error;
  }
};
export const getOpenPlotProperties = async (wardNos) => {
  try {
    const response = await axios.post(GET_OPEN_PLOT_PROPERTIES, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in renter having rent:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getObliqueProperties = async (wardNos) => {
  try {
    const response = await axios.post(GET_OBLIQUE, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in oblique having rent:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getUnderConstructionProperties = async (wardNos) => {
  try {
    const response = await axios.post(GET_UNDER_CONSTRUCTION, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in oblique having rent:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getPropDescMismatchProperties = async (wardNos) => {
  try {
    const response = await axios.post(GET_PROPERTY_DESCRIPTION, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Property Description Mismatch :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getBankTowelWithoutRent = async (wardNos) => {
  try {
    const response = await axios.post(GET_BANK_TOWER_WITHOUT_RENT, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Property Description Mismatch :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const fetchTotalTaxRangeReport = async (propertyTypeID, fromProperty, toProperty) => {
  try {
    const payload = {
      PropertyTypeID: propertyTypeID,  
      fromProperty,                     
      toProperty                        
    };

    const response = await axios.post(GET_TOTAL_TAX_RANGE, payload);

    if (response.data.success) {
      return response.data.data;        
    } else {
      console.error("Error:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("API Error (TotalTaxRange):", error);
    return [];
  }
};
export const getTotalTaxGrter = async (wardNos) => {
  try {
    const response = await axios.post(GET_HIGH_TAX_PROPERTIES, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in oblique having rent:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};

export const getPropertiesoldTaxOldRVzero = async (wardNos) => {
  try {
    const response = await axios.post(GET_PROPERTIES_WITH_ZERO_OLD_TAX, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Properties old Tax Old RV zero having rent:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getOldTaxNetTZero = async (wardNos) => {
  try {
    const response = await axios.post(GET_PROPERTIES_OLD_TAX_NEW, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Properties old Tax Old RV zero having rent:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getMissingPlotArea = async (wardNos) => {
  try {
    const response = await axios.post(GET_MISSING_PLOT_AREA, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Missing Plot Area:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getZeroTaxOpenPlot = async (wardNos) => {
  try {
    const response = await axios.post(GET_ZERO_TAX_OPEN_PLOT, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Zero tax Open Plot :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getMissingShop = async (wardNos) => {
  try {
    const response = await axios.post(GET_MISSING_BUILDING_SHOP_NAME, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Missing shop :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getMissingGIS = async (wardNos) => {
  try {
    const response = await axios.post(GET_GIS_IMAGE, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Missing Gis :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const fetchPropertyDescriptionReport = async (PropertyDescription) => {
  try {
    console.log("🔥 API CALLED: /pdesc");
    console.log("📨 PAYLOAD SENDING:", { PropertyDescription });

    const response = await axios.post(GET_PROPERTIES_DESCRPITION, {
      PropertyDescription,
    });

    console.log("📥 API RESPONSE:", response.data);

    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("❌ API Error (pd):", error);
    return [];
  }
};




export const getTotalTax10times = async (wardNos) => {
  try {
    const response = await axios.post(GET_OLD_NEW_RV_COMPARE, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Missing Gis :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getTotalTax3times = async (wardNos) => {
  try {
    const response = await axios.post(GET_OLD_TAX_HIGHER, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Missing Gis :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getTotalTaxReducer = async (wardNos) => {
  try {
    const response = await axios.post(GET_REDUCER_TAX_REPORT, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Missing Gis :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getComparision = async (wardNos) => {
  try {
    const response = await axios.post(GET_COMPARISON, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Missing Gis :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getEmployeeTAx = async (wardNos) => {
  try {
    const response = await axios.post(GET_EMPLOYEE_TAX, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Missing Gis :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getCommercialReport = async (wardNos) => {
  try {
    const response = await axios.post(GET_ZERO_COMMER_EMPLOYEE, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Commercial  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getNewProperty = async (wardNos) => {
  try {
    const response = await axios.post(GET_NEW_PROPERTIES, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in new property  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getOuterProperty = async (wardNos) => {
  try {
    const response = await axios.post(GET_OUTER_PROPERTIES, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in new property  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getOldTaxGrtProperty = async (wardNos) => {
  try {
    const response = await axios.post(GET_OLD_TAX_Gret, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in new property  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getActualValueAppeal = async (wardNos) => {
  try {
    const response = await axios.post(GET_ACTAUL_VALUE_APPEAL, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in new property  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getPropertiesHavingNewRvNetTax= async (wardNos) => {
  try {
    const response = await axios.post(GET_PROPERTIES_HAVING_NEW_RV_NET_TAX_ZERO, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in new property  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getDataEntryGap= async (wardNos) => {
  try {
    const response = await axios.post(GET_DATA_ENTRY_GAP, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in new property  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getUtilityMismatch= async (wardNos) => {
  try {
    const response = await axios.post(GET_UTILITY_MISMATCH, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Utility Mismatch  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getTaxAppliedTaxZero= async (wardNos) => {
  try {
    const response = await axios.post(GET_TAX_APPLIED_TAX, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Utility Mismatch  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getMutationListByDateService = async (fromDate, toDate) => {
  try {
    const response = await axios.post(GET_MUTATION, {
      fromDate,
      toDate,
    });

    return response.data;

  } catch (error) {
    console.error("❌ Error in getMutationListByDateService:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong!",
    };
  }
};
export const getPropertyChart= async (wardNos) => {
  try {
    const response = await axios.post(GET_Property_CHART, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Utility Mismatch  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getZoningList= async (wardNos) => {
  try {
    const response = await axios.post(GET_ZOINING, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Utility Mismatch  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getTaxableTotalTax= async (wardNos) => {
  try {
    const response = await axios.post(GET_TAXABLE_TOTAL_TAX, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Utility Mismatch  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getTaxableTotalTaxZero= async (wardNos) => {
  try {
    const response = await axios.post(GET_TAXABLE_TOTAL_TAX_ZERO, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Utility Mismatch  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const fetchFlatSystemData = async (wardNos, fromPropertyNo, toPropertyNo, bhk) => {
  try {
    const payload = {
      wardNos,
      fromPropertyNo,
      toPropertyNo,
      bhk,
    };

    console.log("📤 Sending Flat System Request:", payload);

    const res = await axios.post(GET_FLAT_WARDS, payload);

    console.log("📥 Flat System Response:", res.data);

    return res.data.success ? res.data.data : [];
    
  } catch (error) {
    console.error("❌ Flat System API Error:", error);
    return [];
  }
};
export const getConstructionAR= async (wardNos) => {
  try {
    const response = await axios.post(GET_CONSTRUCTION_AR, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Construction AR  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};

export const getOldPropertyGRRv= async (wardNos) => {
  try {
    const response = await axios.post(GET_OLD_PROPERTY_GR_RV, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in old property AR  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const getCommercialEduZero= async (wardNos) => {
  try {
    const response = await axios.post(GET_COMM_EDU_ZERO, {
      wardNos,
    });
    return response.data;
  } catch (error) {
    console.error("Error in Commercial Education Zero  :", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
export const fetchOldVsNewRVPercentage = async (percent) => {
  try {
    const res = await axios.post(GET_PERCENTEAGE, {
      percent,
    });

    return res.data.success ? res.data.data : [];
  } catch (err) {
    console.error("RV Percentage API Error:", err);
    return [];
  }
};
