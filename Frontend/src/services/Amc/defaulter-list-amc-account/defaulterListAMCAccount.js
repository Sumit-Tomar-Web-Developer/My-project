import axios from 'axios';
import { fetch_Get_Properties, Send_To_All, Send_To_Selected, Import_From_Excel, Export_To_Excel } from 'constants/Amc/defaulter-list-amc-account/defaulterListAMCAccountConstants';

export const fetchGetProperties = async (data) => {
    try {
        const response = await axios.post(fetch_Get_Properties,  data );
        console.log('Axios response:', response.data);
        return response.data;
       
    } catch (error) {
        console.error('Error fetching get properties');
        throw error;
    }
}
export const sendToAll = async () => {
    try {
        const response = await axios.post(Send_To_All, {
            data: {}
        });
        console.log('Axios response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error While Sending To All Please Try Again');
        throw error;
    }
}
export const sendToSelected = async () => {
    try {
        const response = await axios.post(Send_To_Selected, {
            data: {}
        });
        console.log('Axios response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error Wjile Sending');
        throw error;
    }
}
export const importFromExcel = async () => {
    try {
        const response = await axios.get(Import_From_Excel, {
            data: {}
        });
        console.log('Axios response:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error While Importing Data From Excel');
        throw error;
    }
}
export const exportToExcel = async () => {
    try {
        const response = await axios.post(Export_To_Excel, {
            data: {}
        });
        console.log('Axios response:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error While Exporting');
        throw error;
    }
}
