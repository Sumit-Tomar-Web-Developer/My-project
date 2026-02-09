import axios from 'axios';
import { SAVE_PHOTO_AND_PLAN, GET_PHOTO_AND_PLAN, DELETE_PHOTO_AND_PLAN } from '../../../constants/Utility/uploadPhotoAndPlanConstants/uploadPhotoAndPlanConstants';


const saveImageFromFolder = async (files) => {

    console.log("Files to be uploaded:", files);
    try {
        const response = await axios.post(SAVE_PHOTO_AND_PLAN, { files });
        return response;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
const getImagesForRange = async (ownerIDsToFetch) => {


    try {
        const response = await axios.post(GET_PHOTO_AND_PLAN, ownerIDsToFetch);
        return response;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
const deleteSelectedImages = async (idsToDelete, imagesToDelete) => {

    const data ={
        idsToDelete, 
        imagesToDelete
    }
    try {
        const response = await axios.post(DELETE_PHOTO_AND_PLAN, data);
        return response;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}
export { saveImageFromFolder, getImagesForRange, deleteSelectedImages };

