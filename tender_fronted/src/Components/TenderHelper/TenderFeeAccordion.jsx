import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid2, MenuItem } from '@mui/material';
import CustomAccordion from '../Common/CustomAccordion';
import { useToast } from '../../Providers/ToastProvider';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, YES_NO_OPTIONS } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';

export default function TenderFeeAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [tenderFeeDetailsObj, setTenderFeeDetailsObj] = useState({
        tenderFee: '',
        processingFee: '',
        exemptionTenderFee: '',
    });

    const [errorTexts, setErrorTexts] = useState({
        tenderFee: '',
        processingFee: '',
        exemptionTenderFee: '',
    });

    useEffect(() => {
        getTenderFeeDetails();
    }, []);


    const handleValidations = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'tenderFee':
                if (value === '') {
                    errorMessage = 'Tender Fee is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) < 0) {
                    errorMessage = 'Tender Fee must be a positive number with up to 2 decimal places.';
                }
                break;
            case 'processingFee':
                if (value === '') {
                    errorMessage = 'Processing Fee is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) < 0) {
                    errorMessage = 'Processing Fee must be a positive number with up to 2 decimal places.';
                }
                break;
            case 'exemptionTenderFee':
                errorMessage = value === '' ? 'Tender Fee Exemption selection is required.' : '';
                break;
            default:
                break;
        }
        setErrorTexts((prev) => ({ ...prev, [name]: errorMessage }));
        return errorMessage === '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTenderFeeDetailsObj({ ...tenderFeeDetailsObj, [name]: value });
        handleValidations(name, value);
    };

    const getTenderFeeDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_TENDER_FEE_DETAILS}`;
        setIsLoading(true);

        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setTenderFeeDetailsObj({
                        tenderFee: res.data.data.tenderFee || '',
                        processingFee: res.data.data.processingFee || '',
                        exemptionTenderFee: res.data.data.exemptionTenderFee,
                    });
                } else {
                    toastMessage.error(res.data.message);
                }
            } else {
                toastMessage.error('Error in fetching data!');
            }
        }).catch((error) => {
            // To handle if data is not saved yet and user is trying to edit the data
            if (isedit && error.status === 404) {
                return;
            }

            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error('Error in fetching data!');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const saveTenderFeeDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_TENDER_FEE_DETAILS}`;

        console.log('Saving data:', tenderFeeDetailsObj);
        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, tenderFeeDetailsObj)
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

        Object.keys(tenderFeeDetailsObj).forEach((key) => {
            if (!handleValidations(key, tenderFeeDetailsObj[key])) {
                isValid = false;
            }
        });

        // If all validations pass, save the data
        if (isValid) {
            saveTenderFeeDetails();
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
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="tenderFee"
                        label="Tender Fee in Rs"
                        name="tenderFee"
                        value={tenderFeeDetailsObj.tenderFee}
                        onChange={handleChange}
                        error={errorTexts.tenderFee !== ''}
                        helperText={errorTexts.tenderFee}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="processingFee"
                        label="Processing Fee in Rs"
                        name="processingFee"
                        value={tenderFeeDetailsObj.processingFee}
                        onChange={handleChange}
                        error={errorTexts.processingFee !== ''}
                        helperText={errorTexts.processingFee}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="exemptionTenderFee"
                        label="Tender Fee Exemption"
                        name="exemptionTenderFee"
                        value={tenderFeeDetailsObj.exemptionTenderFee}
                        onChange={handleChange}
                        error={errorTexts.exemptionTenderFee !== ''}
                        helperText={errorTexts.exemptionTenderFee}
                    >
                        {YES_NO_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
            </Grid2>
        </CustomAccordion>
    );
}

TenderFeeAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};