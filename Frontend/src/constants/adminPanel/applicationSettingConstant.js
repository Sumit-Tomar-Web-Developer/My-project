import { API_BASE_URL } from "constants/constants";

export const GET_OTP = `${API_BASE_URL}/send-otp`;
export const GET_OTP_VERIFY = `${API_BASE_URL}/verify-otp`;
export const GET_OTP_RESEND = `${API_BASE_URL}/resend-otp`;
export const GET_APPLICATION_SETTING = `${API_BASE_URL}/getApplication`;
export const UPSERT_APPLICATION_SETTING = `${API_BASE_URL}/upsertApplication`;

