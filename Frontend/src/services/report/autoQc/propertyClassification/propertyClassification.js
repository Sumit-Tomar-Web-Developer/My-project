import axios from "axios";
import {
    GET_PROPERTY_COUNT_BY_DESCRIPTION,
    GET_PROPERTY_CLASSIFICATION
} from '../../../../constants/Report/autoQC/propertyClassification/propertyClassification'

export const fetchPropertyCountByDescription = async (selectedDescriptions, selectedWard) => {
    try {

        const response = await axios.post(GET_PROPERTY_COUNT_BY_DESCRIPTION, { selectedDescriptions, selectedWard })
        return response

    } catch (error) {
        console.log(error.message, 'Axios error in fetching property county by property description')
    }

}
export const getPropertyClassificationData = async (selectedWard, selectedYear, selectedDescriptions, isCurrentChecked, isPendingChecked) => {
    try {

        const response = await axios.post(GET_PROPERTY_CLASSIFICATION, { selectedWard, selectedYear, selectedDescriptions, isCurrentChecked, isPendingChecked })
        return response

    } catch (error) {
        console.log(error.message, 'Axios error in fetching property classification')
    }
}
