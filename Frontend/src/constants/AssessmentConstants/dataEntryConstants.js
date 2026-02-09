import { API_BASE_URL } from 'constants/constants';

export const GET_WARD_LIST = `${API_BASE_URL}/ward`;

export const GET_ALL_PROPERTY_TYPES = `${API_BASE_URL}/property-desc-list`;
export const FETCH_PROPERTY_RANGE = `${API_BASE_URL}/prop-part`;
export const GET_ALL_OWNER_IDS = `${API_BASE_URL}/ownerid-list`;
export const GET_ALL_TABLE_DATA_BY_OWNER_ID = `${API_BASE_URL}/all-table-property-data`;
export const SAVE_DATA_ENTRY_PROPERTIES = `${API_BASE_URL}/post-data-entry`;
export const SAVE_DATA_ENTRY_PROPERTIES_AMC = `${API_BASE_URL}/post-data-entry-amc`;

export const DELETE_PROPERTY_ENTRY = `${API_BASE_URL}/delete-property`;
export const FLOOR_NO_OF_ROOM = `${API_BASE_URL}/floorRooms`;
export const ROOM_SHAPES = `${API_BASE_URL}/roomShapes`;
export const GET_PROPERTY_IMAGE = `${API_BASE_URL}/propertyImage`;
export const SAVE_TAXABLE_NEW_PROPERTY = `${API_BASE_URL}/typeOfUseNonTaxable`;
export const FETCH_ROOM_TYPE_MASTER = `${API_BASE_URL}/roomType`;
export const FETCH_TYPE_BASED_ON_DESCRIPTION = `${API_BASE_URL}/getTypeDescByGroupId`;
export const FETCH_GROUP_OF_ID = `${API_BASE_URL}/getTypeGroup`;
export const FETCH_TAP_SIZES = `${API_BASE_URL}/getTapSizes`;
export const FETCH_VALUATION_DATA = `${API_BASE_URL}/valuation-data`;

export const FETCH_RETENTION_DATA = `${API_BASE_URL}/retention-data`;

export const ADD_COMBINED_PROPERTIES = `${API_BASE_URL}/add-combined-properties`;


export const GET_PERMISSION_FOR_SUBMISSION = `${API_BASE_URL}/permission-for-submission`;
export const PDNID_CHECK = `${API_BASE_URL}/pdnid-check`;
export const FSDID_CHECK = `${API_BASE_URL}/fsdid-check`;
export const FSDMDID_CHECK = `${API_BASE_URL}/fsdmdid-check`;

export const GET_CONVERTED_IMG = `${API_BASE_URL}/getConvertedImg`;
export const SAVE_LAST_ROW_APPEAL = `${API_BASE_URL}/saveLastRow`;
export const DEA_INSERT_DATA_ENTRY_APPROVAL_UUID = `${API_BASE_URL}/insert-data-entry-approval`;
