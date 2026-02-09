import { API_BASE_URL } from "constants/constants";

export const SEND_TO_APPROVAL_MUTATION = `${API_BASE_URL}/approval-version`;
export const GET_PENDING_REQUESTS = `${API_BASE_URL}/get-pending-requests`;

export const GET_COMPARISION_DATA = `${API_BASE_URL}/mutation-comparision`;
export const SAVE_FERFAR_DOCUMENTS = `${API_BASE_URL}/upload-ferfar-mutation-doc`;

export const SAVE_APPROVED_REQUEST = `${API_BASE_URL}/approved-request`;

export const SAVE_DISAPPROVED_REQUEST= `${API_BASE_URL}/disapproved-request`;

export const SEARCH_MUTATION_REQUEST= `${API_BASE_URL}/search-mutation-request`;

export const DOCUMENT_OWNERID_WISE=  `${API_BASE_URL}/get-ferfar-documents`;



