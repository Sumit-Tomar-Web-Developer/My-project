import { API_BASE_URL } from '../../constants';
export const SEARCH_PROPERTY = `${API_BASE_URL}/search-property-offline-payment`;
export const MINOR_INFO = `${API_BASE_URL}/minor-info-by-id`;
export const CURRENT_BALANCE_OFFLINE_PAYMENT = `${API_BASE_URL}/current-balance-year-wise`;
export const PENDING_BALANCE_OFFLINE_PAYMENT = `${API_BASE_URL}/pending-balance-year-wise`;
export const ORDERED_TAX_ALIASES = `${API_BASE_URL}/ordered-tax-aliases`;
export const OWENER_ID=`${API_BASE_URL}/OwnerInfoByWdPropPartNo`;
export const WARD_SELECTION_URL=`${API_BASE_URL}/ward-base-properties`;
export const BILL_BOOK_NO_LIST=`${API_BASE_URL}/billbook-numbers`;
export const SAVE_MINOR_INFO =`${API_BASE_URL}/save-minor-info`;
export const PROCESS_PAYMENT=`${API_BASE_URL}/save-payment-details`;
export const CURRENT_PENALTY=`${API_BASE_URL}/calculate-current-penalty`;
export const PENDING_PENALTY=`${API_BASE_URL}/calculate-pending-penalty`;
export const GENERATE_INVOICE_URL=`${API_BASE_URL}/generate-invoice-no`;
export const GET_OFFLINE_RECEIPT=`${API_BASE_URL}/get-offline-receipt`;
export const GET_DISCOUNT_PERCENTAGE=`${API_BASE_URL}/get-discount-percentage`;

export const GET_PAYMENT_MODES=`${API_BASE_URL}/get-payment-modes`;
export const GET_BANK_LIST=`${API_BASE_URL}/get-bank-names`;



export const GET_OLD_WARD_LIST=`${API_BASE_URL}/old-wards`;
export const GET_OLD_PROPERTY_NO_LIST=`${API_BASE_URL}/old-properties-by-old-ward`;






