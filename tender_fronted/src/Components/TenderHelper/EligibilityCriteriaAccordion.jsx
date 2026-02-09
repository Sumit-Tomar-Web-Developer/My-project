import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Grid2, MenuItem } from '@mui/material';
import CustomAccordion from '../Common/CustomAccordion';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, YES_NO_OPTIONS } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';

export default function EligibilityCriteriaAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [eligibilityCriteriaObj, setEligibilityCriteriaObj] = useState({
        technicalEligible: '',
        technical: '',
        financialEligible: '',
        financial: '',
        jointVenture: '',
        jointVenturePartner: '',
        // preBidExtension: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        technicalEligible: '',
        technical: '',
        financialEligible: '',
        financial: '',
        jointVenture: '',
        jointVenturePartner: '',
        // preBidExtension: ''
    });

    useEffect(() => {
        getEligibilityCriteria();
    }, []);

    const handleValidations = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'technicalEligible':
                errorMessage = value === '' ? 'Technical Eligibility is required.' : '';
                break;
            // case 'technical':
            //     errorMessage = value.trim() === '' ? 'Technical details are required.' : '';
            //     break;
            case 'financialEligible':
                errorMessage = value === '' ? 'Financial Eligibility is required.' : '';
                break;
            // case 'financial':
            //     errorMessage = value.trim() === '' ? 'Financial details are required.' : '';
            //     break;
            case 'jointVenture':
                errorMessage = value === '' ? 'Joint Venture selection is required.' : '';
                break;
            case 'jointVenturePartner':
                if (eligibilityCriteriaObj.jointVenture === YES_NO_OPTIONS[0].value && value.trim() === '') {
                    errorMessage = 'Name of Joint Venture Partner is required.';
                }
                break;
            // case 'preBidExtension':
            //     errorMessage = value.trim() === '' ? 'Pre-Bid Extension is required.' : '';
            //     break;
            default:
                break;
        }
        setErrorTexts((prev) => ({ ...prev, [name]: errorMessage }));
        return errorMessage === '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEligibilityCriteriaObj({ ...eligibilityCriteriaObj, [name]: value });
        handleValidations(name, value);
    };

    const getEligibilityCriteria = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_ELIGIBILITY_DETAILS}`;
        setIsLoading(true);

        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setEligibilityCriteriaObj({
                        technicalEligible: res.data.data.technicalEligible,
                        technical: res.data.data.technical || '',
                        financialEligible: res.data.data.financialEligible,
                        financial: res.data.data.financial || '',
                        jointVenture: res.data.data.jointVenture,
                        jointVenturePartner: res.data.data.jointVenturePartner || '',
                        // preBidExtension: res.data.data.preBidExtension || ''
                    });
                } else {
                    toastMessage.error(res.data.message);
                }
            } else {
                toastMessage.error("Error in fetching data!!");
            }
        }).catch((error) => {
            // To handle if data is not saved yet and user is trying to edit the data
            if (isedit && error.status === 404) {
                return;
            }

            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            } else {

                toastMessage.error("Error in fetching data!!");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const saveEligibilityCriteria = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_ELIGIBILITY_DETAILS}`;

        console.log('Saving data:', eligibilityCriteriaObj);
        setIsLoading(true);

        postRequest(baseTenderUrl, eligibilityCriteriaObj).then((res) => {
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

        let isValid = true;

        // Validate all fields using handleValidations
        Object.keys(eligibilityCriteriaObj).forEach((key) => {
            if (!handleValidations(key, eligibilityCriteriaObj[key])) {
                isValid = false;
            }
        });

        // If all validations pass, save the data
        if (isValid) {
            saveEligibilityCriteria();
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
                <Grid2 size={{ xs: 12, sm: 3, md: 2 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="technicalEligible"
                        label="Technical Eligible"
                        name="technicalEligible"
                        value={eligibilityCriteriaObj.technicalEligible}
                        onChange={handleChange}
                        error={errorTexts.technicalEligible !== ''}
                        helperText={errorTexts.technicalEligible}
                    >
                        {YES_NO_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 9, md: 10 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        // required
                        fullWidth
                        id="technical"
                        label="Technical"
                        name="technical"
                        value={eligibilityCriteriaObj.technical}
                        onChange={handleChange}
                        error={errorTexts.technical !== ''}
                        helperText={errorTexts.technical}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 3, md: 2 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="financialEligible"
                        label="Financial Eligible"
                        name="financialEligible"
                        value={eligibilityCriteriaObj.financialEligible}
                        onChange={handleChange}
                        error={errorTexts.financialEligible !== ''}
                        helperText={errorTexts.financialEligible}
                    >
                        {YES_NO_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 9, md: 10 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        // required
                        fullWidth
                        id="financial"
                        label="Financial"
                        name="financial"
                        value={eligibilityCriteriaObj.financial}
                        onChange={handleChange}
                        error={errorTexts.financial !== ''}
                        helperText={errorTexts.financial}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 3, md: 2 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="jointVenture"
                        label="Joint Venture"
                        name="jointVenture"
                        value={eligibilityCriteriaObj.jointVenture}
                        onChange={handleChange}
                        error={errorTexts.jointVenture !== ''}
                        helperText={errorTexts.jointVenture}
                    >
                        {YES_NO_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                {eligibilityCriteriaObj.jointVenture === YES_NO_OPTIONS[0].value && (
                    <Grid2 size={{ xs: 12, sm: 9, md: 10 }}>
                        <CustomTextField
                            isedit={isedit}
                            size="small"
                            required
                            fullWidth
                            id="jointVenturePartner"
                            label="Name of Joint Venture Partner"
                            name="jointVenturePartner"
                            value={eligibilityCriteriaObj.jointVenturePartner}
                            onChange={handleChange}
                            error={errorTexts.jointVenturePartner !== ''}
                            helperText={errorTexts.jointVenturePartner}
                        />
                    </Grid2>
                )}
                {/* <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="preBidExtension"
                        label="Pre-Bid Extension"
                        name="preBidExtension"
                        value={eligibilityCriteriaObj.preBidExtension}
                        onChange={handleChange}
                        error={errorTexts.preBidExtension !== ''}
                        helperText={errorTexts.preBidExtension}
                    />
                </Grid2> */}
            </Grid2>
        </CustomAccordion>
    );
}

EligibilityCriteriaAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};