import axios from "axios";
import { Show_Report } from "constants/Amc/reportEngine/reportEngineConstants";

export const showReport =async(data)=>{
    try{
        const response = await axios.post(Show_Report,data);
        console.log('Axios Response:', response.data);
        return response.data;

    }catch(error){
        console.error('Error While Fetching Report');
        throw error;
    }

}