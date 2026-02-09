import axios from "axios";
import { GET_PAYMENT_GATEWAY_TRANSACTION_DETAILS, GET_PAYMENT_GATEWAY_ALL_TRANSACTION_DETAILS,APPROVE_TRANSACTION,DISAPPROVE_TRANSACTION } from "constants/Transaction/approvalOnlineTransaction/approvalOnlineTransaction";

export const getPaymentGatewayDetails = async (financeYear) => {
    try {
        const response = await axios.post(`${GET_PAYMENT_GATEWAY_TRANSACTION_DETAILS}`, { financeYear });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching payment gateway details:", error);
        return [];
    }
};
export const getAllTransactionPaymentGatewayDetails = async (financeYear) => {
    try {
        const response = await axios.post(`${GET_PAYMENT_GATEWAY_ALL_TRANSACTION_DETAILS}`, { financeYear });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching payment gateway details:", error);
        return [];
    }
}

export const approveTransaction = async (selectedRow) => {
    try {
        const response = await axios.post(`${APPROVE_TRANSACTION}`, { selectedRow });
        return response;
    } catch (error) {
        console.log("error in approving transaction");
        return
    }
}
export const disApproveTransaction = async (selectedRow) => {
    try {
        const response = await axios.post(`${DISAPPROVE_TRANSACTION}`, { selectedRow });
        return response;
    } catch (error) {
        console.log("error in approving transaction");
        return
    }
}