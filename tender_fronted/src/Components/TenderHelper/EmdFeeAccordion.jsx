import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Grid2, MenuItem } from '@mui/material';
import CustomAccordion from '../Common/CustomAccordion';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, YES_NO_OPTIONS } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';

export default function EmdFeeAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [emdFeeDetailsObj, setEmdFeeDetailsObj] = useState({
        emdAmount: '',
        exemptionEmd: '',
    });

    const [errorTexts, setErrorTexts] = useState({
        emdAmount: '',
        exemptionEmd: '',
    });

    useEffect(() => {
        getEmdFeeDetails();
    }, []);

    const handleValidations = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'emdAmount':
                if (value === '') {
                    errorMessage = 'EMD Amount is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) < 0) {
                    errorMessage = 'EMD Amount must be a positive number with up to 2 decimal places.';
                }
                break;
            case 'exemptionEmd':
                errorMessage = value === '' ? 'EMD Exemption selection is required.' : '';
                break;
            default:
                break;
        }
        setErrorTexts((prev) => ({ ...prev, [name]: errorMessage }));
        return errorMessage === '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmdFeeDetailsObj({ ...emdFeeDetailsObj, [name]: value });
        handleValidations(name, value);
    };

    const getEmdFeeDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_EMD_FEE_DETAILS}`;
        setIsLoading(true);

        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setEmdFeeDetailsObj({
                        emdAmount: res.data.data.emdAmount || '',
                        exemptionEmd: res.data.data.exemptionEmd
                    });
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in fetching data!!");
            }
        }
        ).catch((error) => {
            // To handle if data is not saved yet and user is trying to edit the data
            if (isedit && error.status === 404) {
                return;
            }

            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in fetching data!!");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const saveEmdDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_EMD_FEE_DETAILS}`;

        console.log('Saving data:', emdFeeDetailsObj);
        setIsLoading(true);

        postRequest(baseTenderUrl, emdFeeDetailsObj).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    toastMessage.success(res.data.message);
                    handlePanelChange(panelIndex + 1);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in saving data!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in saving data!!");
            }
        }).finally(() => {
            setIsLoading(false);
        });

    };

    const handleSaveLater = (e) => {
        e.preventDefault();

        // Perform validation for all fields
        let isValid = true;

        Object.keys(emdFeeDetailsObj).forEach((key) => {
            if (!handleValidations(key, emdFeeDetailsObj[key])) {
                isValid = false;
            }
        });

        // If all validations pass, save the data
        if (isValid) {
            saveEmdDetails();
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
                        id="emdAmount"
                        label="EMD Amount in Rs"
                        name="emdAmount"
                        value={emdFeeDetailsObj.emdAmount}
                        onChange={handleChange}
                        error={errorTexts.emdAmount !== ''}
                        helperText={errorTexts.emdAmount}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="exemptionEmd"
                        label="EMD Exemption"
                        name="exemptionEmd"
                        value={emdFeeDetailsObj.exemptionEmd}
                        onChange={handleChange}
                        error={errorTexts.exemptionEmd !== ''}
                        helperText={errorTexts.exemptionEmd}
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

EmdFeeAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};