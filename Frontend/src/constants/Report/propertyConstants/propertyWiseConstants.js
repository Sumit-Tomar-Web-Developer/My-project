import { API_BASE_URL } from '../../constants';
//constants to show coulmns in autocomplete
export const PROPERTY_MAST_COLUMNS = `${API_BASE_URL}/property-columns`;
export const OLD_PROPERTY_MAST_COLUMNS = `${API_BASE_URL}/old-property-columns`;
export const PROPERTY_DETAILS_NEW_COLUMNS = `${API_BASE_URL}/property-details-new-columns`; 
export const APPEAL_MAST_COLUMNS = `${API_BASE_URL}/appeal-mast-columns`;
export const BILL_BOOK_COLUMNS = `${API_BASE_URL}/bill-book-columns`;
export const TRANS_MAST_COLUMNS = `${API_BASE_URL}/trans-mast-columns`; 
export const TAX_PENDING_COLUMNS = `${API_BASE_URL}/tax-pending-columns`;
export const FETCH_PROPERTY_MAST_COLUMNS_BY_OWNER = `${API_BASE_URL}/get-property-mast-coulmns`;

//to fetch ownerid on which demanad to be applied
export const OWNERID_LIST_FOR_REPORT_GEN = `${API_BASE_URL}/ownerid-list-for-report-gen`;

//constants to fetch data from backend based on ownerid independent of demand type
export const FETCH_APPEAL_DATA = `${API_BASE_URL}/fetch-appeal-data`;
export const FETCH_OLD_PROPERTY_DATA = `${API_BASE_URL}/fetch-old-property-data`;
export const FETCH_PROPERTY_DETAILS_NEW_DATA = `${API_BASE_URL}/fetch-property-details-new-data`;

//select demanad type constants
export const FETCH_CURRENT_DEMAND = `${API_BASE_URL}/get-current-demand`;
export const FETCH_PENDING_DEMAND = `${API_BASE_URL}/get-pending-demand`;
export const FETCH_TOTAL_DEMAND = `${API_BASE_URL}/get-total-demand`;
export const FETCH_CURRENT_COLLECTION = `${API_BASE_URL}/get-current-collection`;
export const FETCH_PENDING_COLLECTION = `${API_BASE_URL}/get-pending-collection`;
export const FETCH_TOTAL_COLLECTION = `${API_BASE_URL}/get-total-collection`;
export const FETCH_OUTSTANDING_CURRENT_BALANCE = `${API_BASE_URL}/get-outstanding-current-balance`;
export const FETCH_OUTSTANDING_PENDING_BALANCE = `${API_BASE_URL}/get-outstanding-pending-balance`;
export const FETCH_OUTSTANDING_TOTAL_BALANCE = `${API_BASE_URL}/get-outstanding-total-balance`;
export const FETCH_GHOSEHWARA = `${API_BASE_URL}/get-ghosehwara`;
export const FETCH_ADVANCE_COLLECTION = `${API_BASE_URL}/get-advance-collection`;
export const FETCH_MISCELLANEOUS_FEE = `${API_BASE_URL}/get-miscellaneous-fee`;



