import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid2, MenuItem } from '@mui/material';
import CustomAccordion from '../Common/CustomAccordion';
import { useToast } from '../../Providers/ToastProvider';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, YES_NO_OPTIONS } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { formatDateTimeForInput, isValidDateTimeFormat } from '../../Utils/UtilityFunctions';

export default function WorkItemAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [workItemDetailsObj, setWorkItemDetailsObj] = useState({
        title: '',
        productCategory: '',
        location: '',
        preBidAddress: '',
        preBidDate: null,
        isPreBidding: '',
        isPreBiddingSite: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        title: '',
        productCategory: '',
        location: '',
        preBidAddress: '',
        preBidDate: '',
        isPreBidding: '',
        isPreBiddingSite: ''
    });

    useEffect(() => {
        getWorkItemDetails();
    }, [])



    const handleValidations = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'title':
                errorMessage = value.trim() === '' ? 'Title is required.' : '';
                break;
            case 'productCategory':
                errorMessage = value.trim() === '' ? 'Tender Category is required.' : '';
                break;
            case 'location':
                errorMessage = value.trim() === '' ? 'Location is required.' : '';
                break;
            case 'preBidAddress':
                errorMessage = value.trim() === '' ? 'Pre Bid Meeting Address is required.' : '';
                break;
            case 'preBidDate':
                if (value === null || value === '') {
                    errorMessage = 'Pre Bid Meeting Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Date must be in DD/MM/YYYY HH:MM format.';
                }
                break;
            case 'isPreBidding':
                errorMessage = value === '' ? 'Pre Bidding Meeting Field is required.' : '';
                if(value === false){
                    setWorkItemDetailsObj((prev) => ({ 
                        ...prev, 
                        preBidDate: null,
                        preBidAddress: '',
                        isPreBiddingSite: false
                    }));
                }
                break;
             case 'isPreBiddingSite':
                errorMessage = value === '' ? 'Pre Bidding Site Visit Compulsion Field is required.' : '';
                break;
            default:
                break;
        }
        setErrorTexts((prev) => ({ ...prev, [name]: errorMessage }));
        return errorMessage === "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorkItemDetailsObj({ ...workItemDetailsObj, [name]: value });
        handleValidations(name, value);
    };

    const getWorkItemDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_WORK_ITEM_DETAILS}`;

        setIsLoading(true);

        // Simulate API call
        getRequest(baseTenderUrl)
            .then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        setWorkItemDetailsObj({
                            title: res.data.data.title || '',
                            productCategory: res.data.data.productCategory || '',
                            location: res.data.data.location || '',
                            preBidAddress: res.data.data.preBidAddress || '',
                            preBidDate: formatDateTimeForInput(res.data.data.preBidDate),
                            isPreBidding: res.data.data.isPreBidding,
                            isPreBiddingSite: res.data.data.isPreBiddingSite
                        });
                    } else {
                        toastMessage.error(res.data.message);
                    }
                } else {
                    toastMessage.error('Error in fetching Work Item details!');
                }
            })
            .catch((error) => {
                // To handle if data is not saved yet and user is trying to edit the data
                if (isedit && error.status === 404) {
                    return;
                }

                if (error.data && error.data.message) {
                    toastMessage.error(error.data.message);
                } else {
                    toastMessage.error('Error in fetching Work Item details!');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const saveWorkItemDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_WORK_ITEM_DETAILS}`;

        console.log('Saving data:', workItemDetailsObj);
        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, workItemDetailsObj)
            .then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        toastMessage.success(res.data.message);
                        handlePanelChange(panelIndex + 1);
                    } else {
                        toastMessage.error(res.data.message);
                    }
                } else {
                    toastMessage.error('Error in saving data!');
                }
            })
            .catch((error) => {
                if (error.data && error.data.message) {
                    toastMessage.error(error.data.message);
                } else {
                    toastMessage.error('Error in saving data!');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSaveLater = (e) => {
        e.preventDefault();

        // Perform validation for all fields
        let isValid = true;

        Object.keys(workItemDetailsObj).forEach((key) => {
            if(workItemDetailsObj.isPreBidding === false && 
                (key === 'preBidDate' || key === 'preBidAddress' || key === 'isPreBiddingSite')){
                return;
            }
            if (!handleValidations(key, workItemDetailsObj[key])) {
                isValid = false;
            }
        });

        console.log(workItemDetailsObj);

        // If all validations pass, save the data
        if (isValid) {
            saveWorkItemDetails();
            return;
        }
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        handlePanelChange(panelIndex - 1);
    };


    return (
        <CustomAccordion
            isedit={isedit}
            panelIndex={panelIndex}
            handleSaveLater={handleSaveLater}
            handleBackClick={handleBackClick}
            isLoading={isLoading}
        >
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        value={workItemDetailsObj.title}
                        onChange={handleChange}
                        error={errorTexts.title !== ''}
                        helperText={errorTexts.title}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="productCategory"
                        label="Tender Category"
                        name="productCategory"
                        value={workItemDetailsObj.productCategory}
                        onChange={handleChange}
                        error={errorTexts.productCategory !== ''}
                        helperText={errorTexts.productCategory}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 8, md: 9 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="location"
                        label="Location"
                        name="location"
                        value={workItemDetailsObj.location}
                        onChange={handleChange}
                        error={errorTexts.location !== ''}
                        helperText={errorTexts.location}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="isPreBidding"
                        label="Pre Bidding Meeting"
                        name="isPreBidding"
                        value={workItemDetailsObj.isPreBidding}
                        onChange={handleChange}
                        error={errorTexts.isPreBidding !== ''}
                        helperText={errorTexts.isPreBidding}
                    >
                        {YES_NO_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                {workItemDetailsObj.isPreBidding &&
                    <Grid2 size={{ xs: 12, sm: 8, md: 3 }}>
                        <CustomTextField
                            isedit={isedit}
                            size="small"
                            required
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                            type="datetime-local"
                            id="preBidDate"
                            label="Pre Bid Meeting Date"
                            name="preBidDate"
                            value={(workItemDetailsObj.preBidDate || '')}
                            onChange={handleChange}
                            error={errorTexts.preBidDate !== ''}
                            helperText={errorTexts.preBidDate}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid2>
                }
                <Grid2 sx={{display: {xs: "none", md: "block"}}} size={{ md: 6 }}></Grid2>
                {workItemDetailsObj.isPreBidding &&
                    <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                        <CustomTextField
                            isedit={isedit}
                            size="small"
                            select
                            required
                            fullWidth
                            id="isPreBiddingSite"
                            label="Site Visit Compulsion"
                            name="isPreBiddingSite"
                            value={workItemDetailsObj.isPreBiddingSite}
                            onChange={handleChange}
                            error={errorTexts.isPreBiddingSite !== ''}
                            helperText={errorTexts.isPreBiddingSite}
                        >
                            {YES_NO_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    </Grid2>
                }
                {workItemDetailsObj.isPreBidding &&
                    <Grid2 size={{ xs: 12, sm: 8, md: 9 }}>
                        <CustomTextField
                            isedit={isedit}
                            size="small"
                            required
                            fullWidth
                            id="preBidAddress"
                            label="Pre Bid Meeting Address"
                            name="preBidAddress"
                            value={workItemDetailsObj.preBidAddress}
                            onChange={handleChange}
                            error={errorTexts.preBidAddress !== ''}
                            helperText={errorTexts.preBidAddress}
                        />
                    </Grid2>
                }
            </Grid2>
        </CustomAccordion>
    );
}

WorkItemAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};