import { API_BASE_URL } from '../../constants';

//Add Tax
export const SAVE_ADD_TAX= `${API_BASE_URL}/addTaxes`;
export const REMOVE_ADD_TAX= `${API_BASE_URL}/removeTaxes`;
export const UPDATE_ADVANVCE_ADD_TAX= `${API_BASE_URL}/updateAdvanceDeduction`;
export const GET_FETCHING_FINANCE_YEAR_PROPERTY= `${API_BASE_URL}/financeYearProperty`;

//advance & MisCellaneous
export const GET_PROPERTIES_FOR_ADVANCE_DEDUCTION = `${API_BASE_URL}/getPropertiesForAdvanceDeduction`;
export const GET_FETCHING_MISCELLANEOUS_AMOUNT = `${API_BASE_URL}/`;

//Add Tax From - To property
export const SAVE_ADD_TAX_FROM_TO_PROPERTY= `${API_BASE_URL}/addTaxesFromTo`;
export const UPDATE_ADD_TAX_FROM_TO_PROPERTY= `${API_BASE_URL}/updateAdvanceDeductionFromProperty`;
export const GET_FETCHING_FINANCE_YEAR_PROPERTY_FROM_TO_PROPERTY= `${API_BASE_URL}/`;

//advance & MisCellaneous
export const GET_FETCHING_ADVANCE_AMOUNT_FROM_TO_PROPERTY = `${API_BASE_URL}/`;
export const GET_FETCHING_MISCELLANEOUS_AMOUNT_FROM_TO_PROPERTY = `${API_BASE_URL}/miscellaneouseProperty`;

//fetchFinanceYearList

export const GET_FINANCE_YEAR =`${API_BASE_URL}/getFinanceYearList`

