import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid2, MenuItem, } from '@mui/material';
import CustomAccordion from '../Common/CustomAccordion';
import { useToast } from '../../Providers/ToastProvider';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, YES_NO_OPTIONS } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';


export default function StampDetailsAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [stampDetailsObj, setStampDetailsObj] = useState({
        stampRequired: '',
        stampDetails: '',
        qty100: '',
        qty500: '',
        qty1000: '',
    });

    const [errorTexts, setErrorTexts] = useState({
        stampRequired: '',
        stampDetails: '',
        qty100: '',
        qty500: '',
        qty1000: '',
    });

    useEffect(() => {
        getStampDetails();
    }, []);


    const handleValidations = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'stampRequired':
                errorMessage = value === '' ? 'Stamp Required selection is required.' : '';
                break;
            case 'stampDetails':
                errorMessage = value.trim() === '' ? 'Stamp Detail is required.' : '';
                break;
            case 'qty100':
                if (stampDetailsObj.stampRequired === YES_NO_OPTIONS[0].value) {
                    if (value === '') {
                        errorMessage = `Rs ${name.replace('qty', '')} Stamp Amount is required.`;
                    } else if (!/^[0-9]\d*$/.test(value)) {
                        errorMessage = `Rs ${name.replace('qty', '')} Stamp Amount must be an Positive number.`;
                    }
                    else if(value%100 !== 0){
                        errorMessage = `Value must be multiple of 100.`;
                    }
                }
                break;
            case 'qty500':
                if (stampDetailsObj.stampRequired === YES_NO_OPTIONS[0].value) {
                    if (value === '') {
                        errorMessage = `Rs ${name.replace('qty', '')} Stamp Amount is required.`;
                    } else if (!/^[0-9]\d*$/.test(value)) {
                        errorMessage = `Rs ${name.replace('qty', '')} Stamp Amount must be an Positive number.`;
                    }
                    else if(value%500 !== 0){
                        errorMessage = `Value must be multiple of 500.`;
                    }
                }
                break;
            case 'qty1000':
                if (stampDetailsObj.stampRequired === YES_NO_OPTIONS[0].value) {
                    if (value === '') {
                        errorMessage = `Rs ${name.replace('qty', '')} Stamp Amount is required.`;
                    } else if (!/^[0-9]\d*$/.test(value)) {
                        errorMessage = `Rs ${name.replace('qty', '')} Stamp Amount must be an Positive number.`;
                    }
                    else if(value%1000 !== 0){
                        errorMessage = `Value must be multiple of 1000.`;
                    }
                }
                break;
            default:
                break;
        }
        setErrorTexts((prev) => ({ ...prev, [name]: errorMessage }));
        return errorMessage === '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'stampRequired' && value === YES_NO_OPTIONS[1].value) {
            // If "No" is selected, reset the quantities to empty strings
            setStampDetailsObj({ ...stampDetailsObj, [name]: value, qty100: '', qty500: '', qty1000: '' });
        }
        else {
            setStampDetailsObj({ ...stampDetailsObj, [name]: value });
        }
        handleValidations(name, value);
    };

    const getStampDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_STAMP_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setStampDetailsObj({
                        stampRequired: res.data.data.stampRequired,
                        stampDetails: res.data.data.stampDetails || '',
                        qty100: res.data.data.qty100,
                        qty500: res.data.data.qty500,
                        qty1000: res.data.data.qty1000,
                    });
                } else {
                    toastMessage.error(res.data.message);
                }
            } else {
                toastMessage.error('Error in fetching data!!');
            }
        }).catch((error) => {
            // To handle if data is not saved yet and user is trying to edit the data
            if (isedit && error.status === 404) {
                return;
            }

            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            } else {
                toastMessage.error('Error in fetching data!!');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };


    const saveStampDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_STAMP_DETAILS}`;

        console.log('Saving data:', stampDetailsObj);
        setIsLoading(true);

        let tempStampDetailsObj = {
            stampRequired: stampDetailsObj.stampRequired,
            stampDetails: stampDetailsObj.stampDetails
        }

        if (tempStampDetailsObj.stampRequired === YES_NO_OPTIONS[0].value) {
            tempStampDetailsObj.qty100 = stampDetailsObj.qty100;
            tempStampDetailsObj.qty500 = stampDetailsObj.qty500;
            tempStampDetailsObj.qty1000 = stampDetailsObj.qty1000;
        }

        // Simulate API call
        postRequest(baseTenderUrl, tempStampDetailsObj)
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

        Object.keys(stampDetailsObj).forEach((key) => {
            if (!handleValidations(key, stampDetailsObj[key])) {
                isValid = false;
            }
        });

        // If all validations pass, save the data
        if (isValid) {
            saveStampDetails();
            return;

        }
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        handlePanelChange(panelIndex - 1);
    };

    const getTotalStampValue = () => {
        let totalStampValue = 0;
        if(errorTexts.qty100 === ''){
            totalStampValue += Number(stampDetailsObj.qty100);
        }
        if(errorTexts.qty500 === ''){
            totalStampValue += Number(stampDetailsObj.qty500);
        }
        if(errorTexts.qty1000 === ''){
            totalStampValue += Number(stampDetailsObj.qty1000);
        }
        return totalStampValue;
    }

    return (
        <CustomAccordion
            isedit={isedit}
            panelIndex={panelIndex}
            handleSaveLater={handleSaveLater}
            handleBackClick={handleBackClick}
            isLoading={isLoading}
        >
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4, md: 2 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="stampRequired"
                        label="Stamp Required"
                        name="stampRequired"
                        value={stampDetailsObj.stampRequired}
                        onChange={handleChange}
                        error={errorTexts.stampRequired !== ''}
                        helperText={errorTexts.stampRequired}
                    >
                        {YES_NO_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 8, md: 10 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="stampDetails"
                        label="Stamp Detail"
                        name="stampDetails"
                        value={stampDetailsObj.stampDetails}
                        onChange={handleChange}
                        error={errorTexts.stampDetails !== ''}
                        helperText={errorTexts.stampDetails}
                    />
                </Grid2>
                {stampDetailsObj.stampRequired === YES_NO_OPTIONS[0].value && (
                    <>
                        <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                            <CustomTextField
                                isedit={isedit}
                                size="small"
                                required
                                fullWidth
                                id="qty100"
                                label="Rs 100 Stamp Amount"
                                name="qty100"
                                value={stampDetailsObj.qty100}
                                onChange={handleChange}
                                error={errorTexts.qty100 !== ''}
                                helperText={errorTexts.qty100}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                            <CustomTextField
                                isedit={isedit}
                                size="small"
                                required
                                fullWidth
                                id="qty500"
                                label="Rs 500 Stamp Amount"
                                name="qty500"
                                value={stampDetailsObj.qty500}
                                onChange={handleChange}
                                error={errorTexts.qty500 !== ''}
                                helperText={errorTexts.qty500}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                            <CustomTextField
                                isedit={isedit}
                                size="small"
                                required
                                fullWidth
                                id="qty1000"
                                label="Rs 1000 Stamp Amount"
                                name="qty1000"
                                value={stampDetailsObj.qty1000}
                                onChange={handleChange}
                                error={errorTexts.qty1000 !== ''}
                                helperText={errorTexts.qty1000}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="totalStamp"
                                label="Total Stamp AMOUNT"
                                name="qty1000"
                                value={getTotalStampValue()}
                            />
                        </Grid2>
                    </>
                )}
            </Grid2>
        </CustomAccordion>
    );
}

StampDetailsAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};