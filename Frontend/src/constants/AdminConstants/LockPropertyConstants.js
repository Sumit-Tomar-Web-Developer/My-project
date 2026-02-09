import { API_BASE_URL } from '../constants';

export const GET_LOCKED_UNLOCKED_PROPERTIES = `${API_BASE_URL}/get-locked-properties`;
export const LOCK_PROPERTIES_BY_OWNERID = `${API_BASE_URL}/ownerIds-to-be-locked`;
export const UNLOCK_PROPERTIES_BY_OWNERID = `${API_BASE_URL}/ownerIds-to-be-unlocked`;
