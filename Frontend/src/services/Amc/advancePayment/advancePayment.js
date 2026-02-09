import axios from "axios";
import { GET_CURRENT_TAXES, SAVE_ADVANCE_PAYMENT } from "constants/Amc/advancePayment/advancePaymentConstant";

export const getCurrentTaxes = async (ownerId, year) => {
    try {
        console.log('Axios ownerId', ownerId);
        const response = await axios.post(GET_CURRENT_TAXES,
            {
                ownerId: ownerId,
                year: year
            })
        console.log('Axios response', response.data);
        return response.data;
    } catch (error) {
        console.log('Axios Error Fetching Current Taxes', error);
    }

}
export const saveAdvancePayment = async (combinedData) => {
    try {
        const response = await axios.post(SAVE_ADVANCE_PAYMENT, combinedData);
        return {response:response.data , status:response.status};
    } catch (error) {
        console.error('Error saving advance payment:', error);
        throw error;
    }
}