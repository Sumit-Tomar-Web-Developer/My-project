import axios from 'axios';
import { GET_PROPERTY_IMAGES_FOR_DOWNLOAD } from '../../../constants/Utility/imageDownloader/imageDownloader';




//Fetch property images for Imagedownloader based on the given range (FromPropertyNo to ToPropertyNo)
export const fetchPropertyImages = async (ward, fromPropertyNo, toPropertyNo) => {
  try {
    console.log("fetchPropertyImages requested data", ward, fromPropertyNo, toPropertyNo);
    const response=await axios.get(GET_PROPERTY_IMAGES_FOR_DOWNLOAD,
      { params: { ward, fromPropertyNo, toPropertyNo }});
      console.log("Fetch property images for Imagedownloader",response.data);
     return { status: response.status, data: response.data };


  } catch (error) {
    console.error("fetchPropertyImages error",error);
    throw error;
  }
};
