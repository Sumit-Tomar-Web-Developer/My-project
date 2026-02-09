import axios from "axios";

import { GET_PENDING_PAYMENTS, APPROVE_PAYMENT, DISAPPROVE_PAYMENT, PAYMENT_PROOF,GET_FILTERED_PAYMENT_LIST } from "../../../constants/Transaction/taxPaymentApproval/taxPaymentApprovalConstant";

export const fetchPendingPayments = async () => {
    try {
        const response = await axios.get(GET_PENDING_PAYMENTS);
        return response;
    }
    catch (error) {
        console.error('Error fetching pending payments', error);
        // Handle backend errors
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message || 'Failed to fetch pending payments',
                status: error.response.status
            };
        }
        // Network or unknown errors
        return {
            success: false,
            message: 'Network error or server unreachable',
            status: null
        };
    }
};

export const approvePayment = async (selectedRow) => {
    try {
        const response = await axios.post(APPROVE_PAYMENT, { selectedRow });
        return response;
    } catch (error) {
        console.error('Error approving payment', error);
        // Handle backend errors
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message || 'Failed to approve payment',
                status: error.response.status
            };
        }
        // Network or unknown errors
        return {
            success: false,
            message: 'Network error or server unreachable',
            status: null
        };
    }
};
export const disapprovePayment = async (selectedRow) => {
    try {
        const response = await axios.post(DISAPPROVE_PAYMENT, { selectedRow });
        return response;
    }
    catch (error) {
        console.error('Error rejecting payment', error);

        // Handle backend errors
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message || 'Failed to reject payment',
                status: error.response.status
            };
        }
        // Network or unknown errors
        return {
            success: false,
            message: 'Network error or server unreachable',
            status: null
        };
    }
};

export const getPaymentProof = async (merchantTxnRefNumber) => {
    try {
        const response = await axios.post(
            PAYMENT_PROOF,
            { merchantTxnRefNumber }, // body
            { responseType: 'blob' }  // ✅ config goes here
        );

        const mimeType = response.headers['content-type'];
        const blob = new Blob([response.data], { type: mimeType });
        const url = URL.createObjectURL(blob);

        return { url, mimeType };

    } catch (error) {
        console.error('Error fetching payment proof', error);
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message || 'Failed to fetch payment proof',
                status: error.response.status
            };
        }
        return {
            success: false,
            message: 'Network error or server unreachable',
            status: null
        };
    }
};

export const getfilterPaymentList = async (filterPaymentDetails) => {
    try {
        const response = await axios.post(GET_FILTERED_PAYMENT_LIST, { filterPaymentDetails });
        return response;
    } catch (error) {
        console.error('Error fetching filtered payment list', error);
        // Handle backend errors
        if (error.response && error.response.data) {
            return {
                success: false,
                message: error.response.data.message || 'Failed to fetch filtered payment list',
                status: error.response.status
            };
        }
        // Network or unknown errors
        return {
            success: false,
            message: 'Network error or server unreachable',
            status: null
        };
    }
};
