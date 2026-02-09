import { createSlice } from "@reduxjs/toolkit";


// Store property images for ImageDownloader based on the given range (FromPropertyNo to ToPropertyNo)
const initialState = {
    propertyImages: {}
};


const imageDownloaderSlice = createSlice({
    name: 'imageDownloader',
    initialState,
    reducers: {
        setPropertyImages: (state, action) => {
            state.propertyImages = action.payload;
        }
    }
});


export const { setPropertyImages} = imageDownloaderSlice.actions;
export default imageDownloaderSlice.reducer;
