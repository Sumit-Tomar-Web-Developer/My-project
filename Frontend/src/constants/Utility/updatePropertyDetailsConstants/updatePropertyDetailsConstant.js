import { API_BASE_URL } from '../../constants';
//utility constants
export const GET_PROPERTY_RANGE_FROM_AND_TO = `${API_BASE_URL}/propertyNoRange`;
export const GET_OWNER_NAMES = `${API_BASE_URL}/getOwnerNamesByPropertyNoRange`;
export const SAVE_OWNER_NAMES = `${API_BASE_URL}/saveNewOwnerName`;

export const GET_JOINT_OWNER_DETAILS = `${API_BASE_URL}/getJointDetailsByOwnerId`;

// address
export const SAVE_ADDRESS_DETAILS = `${API_BASE_URL}/saveOwnerAddressByID`;
//road
export const SAVE_ROAD_DETAILS = `${API_BASE_URL}/saveRoadWidth`;
//property Descrption 
export const SAVE_PROPERTY_DESCRPITION_DETAILS = `${API_BASE_URL}/savePropertyDescription`;
//Shop tab 
export const SAVE_SHOP_DETAILS = `${API_BASE_URL}/saveShop`;
//common remark
export const SAVE_COMMON_REMARK_DETAILS = `${API_BASE_URL}/saveCommonREmark`;

//wadhGhat
export const SAVE_WADH_GHAT_DETAILS = `${API_BASE_URL}/saveWadhGhatRemark`;

