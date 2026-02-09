import { API_BASE_URL } from "constants/constants";

export const GET_COMBINED_OWNERDETAILS=`${API_BASE_URL}/combinedOwnerDetails`;
export const GET_PENDING_TAXES = `${API_BASE_URL}/pending-taxes`;
export const GET_INTEREST_AMOUNT = `${API_BASE_URL}/getInterestAmounts`;
export const SAVE_TAX_PAYMENT = `${API_BASE_URL}/save-tax-payment`;
export const GET_BALANCESHEET_DATA=`${API_BASE_URL}/balancesheet-data`;
export const CANCEL_INVOICE_NO=`${API_BASE_URL}/cancel-invoice`;
export const CHECK_INVOICE_STATUS=`${API_BASE_URL}/invoice-status`;
export const CHECK_DUPLICATE_INVOICE=`${API_BASE_URL}/duplicate-invoice`;
export const FETCH_PAYMENT_DETAILS=`${API_BASE_URL}/payment-details`;
export const UPDATE_TAX_PAYMENT=`${API_BASE_URL}/update-tax-payment`;
export const DELETE_TAX_PAYMENT=`${API_BASE_URL}/delete-tax-payment`;
export const FETCH_ALL_BANKS=`${API_BASE_URL}/fetchAllBanks`;
export const FETCH_BILLBOOK_ENTRIES=`${API_BASE_URL}/bill-book-entries`;
export const SEND_FOR_APPROVAL=`${API_BASE_URL}/send-for-approval`;
