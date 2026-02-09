import axios from 'axios';
import {
  GET_PROPERTIES_FOR_ADVANCE_DEDUCTION,
  GET_FETCHING_ADVANCE_AMOUNT_FROM_TO_PROPERTY,
  GET_FETCHING_FINANCE_YEAR_PROPERTY, GET_FETCHING_FINANCE_YEAR_PROPERTY_FROM_TO_PROPERTY,
  GET_FETCHING_MISCELLANEOUS_AMOUNT, GET_FETCHING_MISCELLANEOUS_AMOUNT_FROM_TO_PROPERTY,
  REMOVE_ADD_TAX, SAVE_ADD_TAX, SAVE_ADD_TAX_FROM_TO_PROPERTY,
  UPDATE_ADD_TAX_FROM_TO_PROPERTY, UPDATE_ADVANVCE_ADD_TAX,
  GET_FINANCE_YEAR
} from '../../../constants/Utility/AddTaxConstant/addTaxConstant';



//finance year properties
export const fetchFinanceYearProperty = async (wardNo) => {
  try {
    const response = await axios.get(`${GET_FETCHING_FINANCE_YEAR_PROPERTY}`, { wardNo });
    console.log(response.data, 'ttpResponse');
    return response.data;
  } catch (error) {
    console.error('Error fetching year:', error);
    throw error;
  }
};
//save add Tax
export const saveAddTaxButton = async (ward, financeYear, withInterest) => {
  console.log('axios');
  console.log(ward, financeYear, withInterest, 'ward, financeYear, withInterest');
  try {
    const response = await axios.post(`${SAVE_ADD_TAX}`, {
      data: { ward, financeYear, withInterest }
    });
    console.log('axios');
    console.log(response, 'Property Response');
    const message = response.data.message;
    const status = response.status;
    return { message, status, response };
  } catch (error) {
    console.error('Error in copying add taxes ', error);
    throw error;
  }
};
//remove Add tax
export const RemoveTax = async (financialYear) => {
  try {
    console.log('Removing tax for financial year axios:', financialYear);
    const response = await axios.post(`${REMOVE_ADD_TAX}`, { financialYear });
    console.log('Delete API response:', response.data);

    // Return relevant information for the caller
    const message = response.data.message;
    const status = response.status;
    return { message, status, response };
  } catch (error) {
    console.error('Error In Deleting Tax:', error);
    throw error;
  }
};
//update advance
export const updateAdvance = async (selectWards, financialYear) => {
  console.log('Updating advance for ward:', selectWards, 'and financial year:', financialYear);
  try {
    console.log('before fetch');
    const response = await axios.post(`${UPDATE_ADVANVCE_ADD_TAX}`, {
      data: { ward: selectWards, financeYear: financialYear }
    });
    console.log('Advance Update API response:', response.data);

    // Return relevant information for the caller
    const message = response.data.message;
    const status = response.status;
    return { message, status, response };
  } catch (error) {
    console.error('Error In Updating Advance:', error);
    throw error;
  }
};
export const getPropertiesForAdvanceDeduction = async (selectWards, financialYear) => {
  console.log('axios Fetching Ward Details for Advance Deduction:', selectWards, financialYear);
  try {
    console.log('BEFORE API Call For Advance Deduction');
    const response = await axios.get(`${GET_PROPERTIES_FOR_ADVANCE_DEDUCTION}`, {
      params: {
        wardNo: selectWards,
        financeYear: financialYear
      }
    });
    console.log('Ward Details API response:', response.data);

    // Return relevant information for the caller
    return {
      message: response.data.message,
      status: response.status,
      response: response.data,
    };
  } catch (error) {
    console.error('Error In Fetching Ward Details:', error);

  }
}
//fetch advance
// export const fetchAdvance = async (ward, financialYear) => {
//   try {
//     const response = await axios.get(`${GET_FETCHING_ADVANCE_AMOUNT}/${advanceId}`);
//     console.log('Advance Fetch API response:', response.data);

//     // Return relevant information for the caller
//     return {
//       message: response.data.message,
//       status: response.status,
//       response: response.data,
//     };
//   } catch (error) {
//     console.error('Error In Fetching Advance:', error);
//     throw error;
//   }
// };
//miscellaneouse


//Add Tax From To Property
//finance year properties
// export const fetchFinanceYearPropertyFromTo = async (wardNo) => {
//   try {
//     const response = await axios.get(`${GET_FETCHING_FINANCE_YEAR_PROPERTY_FROM_TO_PROPERTY}`, { wardNo });
//     console.log(response, 'ttpResponse');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching year:', error);
//     throw error;
//   }
// };
//save add Tax
export const saveAddTaxButtonFromTo = async (selectedWard, financialYear, propertyNoListFrom, propertyNoListTo, withInterest) => {
  try {
    console.log('before fetch')
    const response = await axios.post(`${SAVE_ADD_TAX_FROM_TO_PROPERTY}`, {
      data: {

        ward: selectedWard,
        financeYear: financialYear,
        fromPropertyNo: propertyNoListFrom,
        toPropertyNo: propertyNoListTo,
        withInterest: withInterest
      }
    })
    console.log(response.data, 'Property Response');
    const message = response.data.message;
    const status = response.status;
    return { message, status, response };
  } catch (error) {
    console.error('Error in copying add taxes ', error);

  }
};

//update advance
export const updateAdvanceFromTo = async (selectedWard, financialYear, propertyNoListFrom, propertyNoListTo, withInterest) => {
  console.log('axios Updating advance for ward:', selectedWard, 'and financial year:', financialYear);
  try {
    const response = await axios.post(`${UPDATE_ADD_TAX_FROM_TO_PROPERTY}`, {
      data: {

        ward: selectedWard,
        financeYear: financialYear,
        fromPropertyNo: propertyNoListFrom,
        toPropertyNo: propertyNoListTo,
        withInterest: withInterest
      }
    });
    console.log('Advance Update API response:', response.data);
    console.log('Advance Update API response:', response.status);
    // Return relevant information for the caller
    const message = response.data.message;
    const status = response.status;
    return { message, status, response };
  } catch (error) {
    console.error('Error In Updating Advance:', error);
    throw error;
  }
};


//fetch advance
// export const fetchAdvanceFromTo = async (advanceId) => {
//   try {
//     const response = await axios.get(`${GET_FETCHING_ADVANCE_AMOUNT_FROM_TO_PROPERTY}/${advanceId}`);
//     console.log('Advance Fetch API response:', response.data);

//     // Return relevant information for the caller
//     return {
//       message: response.data.message,
//       status: response.status,
//       response: response.data,
//     };
//   } catch (error) {
//     console.error('Error In Fetching Advance:', error);
//     throw error;
//   }
// };




//Show Button functionality 
export const getMiscellaneouseFromTo = async (selectedWard, propertyNoListFrom, propertyNoListTo) => {
  try {

    const response = await axios.get(`${GET_FETCHING_MISCELLANEOUS_AMOUNT_FROM_TO_PROPERTY}`, {
      params: {
        wardNo: selectedWard,
        fromPropertyNo: propertyNoListFrom,
        toPropertyNo: propertyNoListTo
      }
    });
    console.log('Ward Details API response:', response.data);

    // Return relevant information for the caller
    return {
      message: response.data.message,
      status: response.status,
      response: response.data,
    };
  } catch (error) {
    console.error('Error In Fetching Ward Details:', error);
    throw error;
  }
};

export const getFinanceYear = async() =>{
try{
  const response = await axios.get(`${GET_FINANCE_YEAR}`,{})
  return response.data;

}catch(error){
  console.log(error.message)
  throw error;
}
}