import { API_BASE_URL } from "constants/constants";

export const GET_PENDING_PAYMENTS = `${API_BASE_URL}/getPendingPayments`;
export const APPROVE_PAYMENT = `${API_BASE_URL}/approvePayment`;
export const DISAPPROVE_PAYMENT = `${API_BASE_URL}/disapprovePayment`;
export const PAYMENT_PROOF = `${API_BASE_URL}/getPaymentProof`;
export const GET_FILTERED_PAYMENT_LIST = `${API_BASE_URL}/getFilteredPaymentList`;