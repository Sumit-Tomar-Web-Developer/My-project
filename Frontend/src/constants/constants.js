   export const API_BASE_URL = 'http://newntis.coreproject.in:80/Tax_Assessment_NTIS_Backend';
// export const API_BASE_URL = 'http://localhost:4000';

export const USER_ADMIN_ENDPOINT = `${API_BASE_URL}/user-admin`;
export const PROPERTY_DESC = `${API_BASE_URL}/property-desc-list`;
export const PROPERTY_MAST = `${API_BASE_URL}/property-columns`;
export const JOINT_OWNER_DETAILS = `${API_BASE_URL}/joint-owner`;
export const GET_PROPERTY_BY_OLD_WARD = `${API_BASE_URL}/getPropertyByOldWardNo`

// Appeal constants

export const POLICIES_INFO = `${API_BASE_URL}/policiesInfo`;
export const FINANCEYEAR = `${API_BASE_URL}/financialYear`;
export const RETAINFACTORS = `${API_BASE_URL}/retainFactors`;
export const ALLAPPEALINFO = `${API_BASE_URL}/appealInfoAll`;
export const TAXNAME = `${API_BASE_URL}/taxName`;
export const GETWARDLIST = `${API_BASE_URL}/ward`;
export const GETPROPERTYFROMWARD = `${API_BASE_URL}/prop-part`;
export const GETOWNERINFO = `${API_BASE_URL}/OwnerInfoByWdPropPartNo`;
export const APPLY_POLICIES_INFO = `${API_BASE_URL}/applyProliciesInfo`;
export const FETCH_OWNER_DETAILS = `${API_BASE_URL}/OwnerDetailsByWdAndProp`
export const FETCH_GET_NET_RV = `${API_BASE_URL}/getNetValuation`;
export const FETCH_GET_TOTAL_NET_RV = `${API_BASE_URL}/rv`;
export const FETCH_GET_TAX_RATE = `${API_BASE_URL}/getRate`;
export const FETCH_GET_APPLY_MAST = `${API_BASE_URL}/ownerTaxes`;
export const FETCH_GET_PROPERTY_OWNER=`${API_BASE_URL}/fetchPropertyOwner`;
export const DELETE_APPEAL_POLICE=`${API_BASE_URL}/resetAppeal`;
export const FETCH_HEARING_RV=`${API_BASE_URL}/hearingRv`;
export const FETCH_COURT_RV=`${API_BASE_URL}/courtRv`;
export const FETCH_RETAIN_RV=`${API_BASE_URL}/RetainRv`;
export const FETCH_APPEAL_RV=`${API_BASE_URL}/appealRv`;


//Mutation Api
export const WARD_NO = `${API_BASE_URL}/ward`;
export const WARD_NO_SELECTION = `${API_BASE_URL}/ward-selection`;
export const JOINT_OWNER_SELECTED_LIST = `${API_BASE_URL}/mutation-details-history`;
export const MUTATION_TRANSFER_DETAILS = `${API_BASE_URL}/mutation-transfer-details`;
export const MUTATION_DETAILS_DATA_POST = `${API_BASE_URL}/mutation-details-new-data`;
export const MUTATION_DETAILS_UPDATED_DATA_POST = `${API_BASE_URL}/mutation-updated-details`;
export const UPDATE_JOINT_OWNER_DETAIL_AND_PROPERTYMAST = `${API_BASE_URL}/mutation-update-joint-owner-propertymast`;
export const UPLOAD_MUTATION_DOCUMENT = `${API_BASE_URL}/mutation-upload`;
export const GET_NP_TITLE = `${API_BASE_URL}/npTitle`;

//Master Api

//apply tax
export const WARD_LIST = `${API_BASE_URL}/ward`;
export const PROPERTY_RANGE = `${API_BASE_URL}/property-range`;
export const APPLIED_TAX_OWNER_ID = `${API_BASE_URL}/applied-tax-owner-id`;
export const APPLY_TAXES_TO_ALL = `${API_BASE_URL}/apply-taxes`;
export const GET_ALL_OWNER_IDS = `${API_BASE_URL}/all-owner-ids`;
export const SAVE_ALL_WARD_TAX = `${API_BASE_URL}/ward-all`;
export const FETCH_ALL_WARD_TAX = `${API_BASE_URL}/fetch-apply-taxes`;

//assessment rule constants
export const ADD_ASSESSMENT_RULES = `${API_BASE_URL}/add-assessment-rules`;
export const GENERATE_ASSESSNO_NO = `${API_BASE_URL}/save-npprefix`;
export const GET_ASSESSMENT_RULES = `${API_BASE_URL}/get-assessment-rules`;
//floor constants
export const SAVE_NEW_FLOOR_INFO = `${API_BASE_URL}/floor-master-new`;
export const GET_NEW_FLOOR_INFO = `${API_BASE_URL}/floors-new`;
export const DELETE_NEW_FLOOR_INFO = `${API_BASE_URL}/floors-new-delete`;
export const SAVE_OLD_FLOOR_INFO = `${API_BASE_URL}/floor-master-old`;
export const GET_OLD_FLOOR_INFO = `${API_BASE_URL}/floors-old`;
export const DELETE_OLD_FLOOR_INFO = `${API_BASE_URL}/floors-old-delete`;

//construction type constants
export const SAVE_NEW_CONSTRUCTION_INFO = `${API_BASE_URL}/construction-type-master`;
export const GET_NEW_CONSTRUCTION_INFO = `${API_BASE_URL}/fetch-constructions`;
export const DELETE_NEW_CONSTRUCTION_INFO = `${API_BASE_URL}/delete-new-construction`;
export const SAVE_OLD_CONSTRUCTION_INFO = `${API_BASE_URL}/old-construction-type`;
export const GET_OLD_CONSTRUCTION_INFO = `${API_BASE_URL}/old-constructions`;
export const DELETE_OLD_CONSTRUCTION_INFO = `${API_BASE_URL}/delete-old-construction`;

//ACTIVE YEAR Constant
export const SAVE_AND_UPDATE_ACTIVE_YEAR = `${API_BASE_URL}/saveActiveYear`;
export const GET_ACTIVE_YEAR= `${API_BASE_URL}/fetchActiveYear`;
export const DELETE_ACTIVE_YEAR= `${API_BASE_URL}/deleteActiveYear`;

// Bank Master Constant
export const SAVE_AND_UPDATE_BANK_MASTER = `${API_BASE_URL}/saveBankInfo`;
export const GET_BANK_MASTER = `${API_BASE_URL}/fetchBankInfo`;
export const DELETE_BANK_MASTER = `${API_BASE_URL}/deleteBankInfo`;

// Factor policy Constant
export const SAVE_AND_UPDATE_POLICY_FACTORS = `${API_BASE_URL}/savefactorInfo`;
export const GET_FACTOR_LIST = `${API_BASE_URL}/factorinfolist`;
export const DELETE_POLICY_FACTOR = `${API_BASE_URL}/deletefactorInfo`;

// Report
export const GET_ADMIN_REPORT_DATA = `${API_BASE_URL}/getAdminReportData`;
export const GET_MUTATION_HISTORY_REPORT_DATA = `${API_BASE_URL}/getMutationHistoryData`;
export const GET_DAILY_COLLECTION_REPORT_DATA = `${API_BASE_URL}/getDailyCollectionData`;
