import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid2 } from '@mui/material';
import { useToast } from '../../Providers/ToastProvider';
import CustomAccordion from '../Common/CustomAccordion';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { formatDateForInput, formatDateTimeForInput, isValidDateTimeFormat } from '../../Utils/UtilityFunctions';

export default function CriticalDatesAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const [criticalDatesDetailsObj, setCriticalDatesDetailsObj] = React.useState({
        publishDate: null,
        bidOpeningDate: null,
        downloadStartDate: null,
        downloadEndDate: null,
        clarificationStartDate: null,
        clarificationEndDate: null,
        submissionStartDate: null,
        submissionEndDate: null,
        extensionDate: null,
    });

    const [errorTexts, setErrorTexts] = React.useState({
        publishDate: '',
        bidOpeningDate: '',
        downloadStartDate: '',
        downloadEndDate: '',
        clarificationStartDate: '',
        clarificationEndDate: '',
        submissionStartDate: '',
        submissionEndDate: '',
        extensionDate: '',
    });

    useEffect(() => {
        getCriticalDatesDetails();
    }, []);

    const handleValidations = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'publishDate':
                if (value == null || value.trim() === '') {
                    errorMessage = 'Publish Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Publish Date must be in DD/MM/YYYY HH:MM format.';
                } else if (criticalDatesDetailsObj.submissionEndDate && new Date(value) > new Date(criticalDatesDetailsObj.submissionEndDate)) {
                    errorMessage = 'Publish Date must be before Bid Submission End Date.';
                }
                break;
            case 'bidOpeningDate':
                if (value == null || value.trim() === '') {
                    errorMessage = 'Bid Opening Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Bid Opening Date must be in DD/MM/YYYY HH:MM format.';
                } else if (criticalDatesDetailsObj.publishDate && new Date(value) < new Date(criticalDatesDetailsObj.publishDate)) {
                    errorMessage = 'Bid Opening Date must be after Publish Date.';
                } else if (criticalDatesDetailsObj.submissionEndDate && new Date(value) < new Date(criticalDatesDetailsObj.submissionEndDate)) {
                    errorMessage = 'Bid Opening Date must be after Bid Submission End Date.';
                }
                break;
            case 'downloadStartDate':
                if (value == null || value.trim() === '') {
                    errorMessage = 'Sale Start Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Sale Start Date must be in DD/MM/YYYY HH:MM format.';
                } else if (criticalDatesDetailsObj.downloadEndDate && new Date(value) > new Date(criticalDatesDetailsObj.downloadEndDate)) {
                    errorMessage = 'Sale Start Date must be before Sale End Date.';
                } else if (criticalDatesDetailsObj.publishDate && new Date(value) < new Date(criticalDatesDetailsObj.publishDate)) {
                    errorMessage = 'Sale Start Date must be after Publish Date.';
                } else if (criticalDatesDetailsObj.submissionEndDate && new Date(value) > new Date(criticalDatesDetailsObj.submissionEndDate)) {
                    errorMessage = 'Sale Start Date must be before Bid Submission End Date.';
                }
                break;
            case 'downloadEndDate':
                if (value == null || value.trim() === '') {
                    errorMessage = 'Sale End Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Sale End Date must be in DD/MM/YYYY HH:MM format.';
                } else if (criticalDatesDetailsObj.downloadStartDate && new Date(value) < new Date(criticalDatesDetailsObj.downloadStartDate)) {
                    errorMessage = 'Sale End Date must be after Sale Start Date.';
                } else if (criticalDatesDetailsObj.publishDate && new Date(value) < new Date(criticalDatesDetailsObj.publishDate)) {
                    errorMessage = 'Sale End Date must be after Publish Date.';
                } else if (criticalDatesDetailsObj.submissionEndDate && new Date(value) > new Date(criticalDatesDetailsObj.submissionEndDate)) {
                    errorMessage = 'Sale End Date must be before Bid Submission End Date.';
                }
                break;
            case 'clarificationStartDate':
                if (value == null || value.trim() === '') {
                    // errorMessage = 'Clarification Start Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Clarification Start Date must be in DD/MM/YYYY HH:MM format.';
                } else if (criticalDatesDetailsObj.publishDate && new Date(value) < new Date(criticalDatesDetailsObj.publishDate)) {
                    errorMessage = 'Clarification Start Date must be after Publish Date.';
                } else if (criticalDatesDetailsObj.submissionEndDate && new Date(value) > new Date(criticalDatesDetailsObj.submissionEndDate)) {
                    errorMessage = 'Clarification Start Date must be before Bid Submission End Date.';
                }
                break;
            case 'clarificationEndDate':
                if (value == null ||  value.trim() === '') {
                    // errorMessage = 'Clarification End Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Clarification End Date must be in DD/MM/YYYY HH:MM format.';
                } else if (criticalDatesDetailsObj.clarificationStartDate && new Date(value) < new Date(criticalDatesDetailsObj.clarificationStartDate)) {
                    errorMessage = 'Clarification End Date must be later than Clarification Start Date.';
                } else if (criticalDatesDetailsObj.publishDate && new Date(value) < new Date(criticalDatesDetailsObj.publishDate)) {
                    errorMessage = 'Clarification End Date must be after Publish Date.';
                } else if (criticalDatesDetailsObj.submissionEndDate && new Date(value) > new Date(criticalDatesDetailsObj.submissionEndDate)) {
                    errorMessage = 'Clarification End Date must be before Bid Submission End Date.';
                }
                break;
            case 'submissionStartDate':
                if (value == null || value.trim() === '') {
                    errorMessage = 'Bid Submission Start Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Bid Submission Start Date must be in DD/MM/YYYY HH:MM format.';
                } else if (criticalDatesDetailsObj.publishDate && new Date(value) < new Date(criticalDatesDetailsObj.publishDate)) {
                    errorMessage = 'Bid Submission Start Date must be after Publish Date.';
                } else if (criticalDatesDetailsObj.submissionEndDate && new Date(value) > new Date(criticalDatesDetailsObj.submissionEndDate)) {
                    errorMessage = 'Bid Submission Start Date must be before Bid Submission End Date.';
                } 
                break;
            case 'submissionEndDate':
                if (value == null || value.trim() === '') {
                    errorMessage = 'Bid Submission End Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Bid Submission End Date must be in DD/MM/YYYY HH:MM format.';
                } else if (criticalDatesDetailsObj.submissionStartDate && new Date(value) < new Date(criticalDatesDetailsObj.submissionStartDate)) {
                    errorMessage = 'Bid Submission End Date must be later than Bid Submission Start Date.';
                } else if (criticalDatesDetailsObj.publishDate && new Date(value) < new Date(criticalDatesDetailsObj.publishDate)) {
                    errorMessage = 'Bid Submission End Date must be after Publish Date.';
                }
                break;
            case 'extensionDate':
                if (value == null || value.trim() === '') {
                    errorMessage = 'Extension Date is required.';
                } else if (!isValidDateTimeFormat(value)) {
                    errorMessage = 'Extension Date must be in DD/MM/YYYY HH:MM format.';
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
        if(value === '') {
            setCriticalDatesDetailsObj({ ...criticalDatesDetailsObj, [name]: null });
        }
        else
        {
            setCriticalDatesDetailsObj({ ...criticalDatesDetailsObj, [name]: value });
        }
        handleValidations(name, value);
    };

    const getCriticalDatesDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_CRITICAL_DATES}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setCriticalDatesDetailsObj({
                        publishDate: formatDateTimeForInput(res.data.data.publishDate),
                        bidOpeningDate: formatDateTimeForInput(res.data.data.bidOpeningDate),
                        downloadStartDate: formatDateTimeForInput(res.data.data.downloadStartDate),
                        downloadEndDate: formatDateTimeForInput(res.data.data.downloadEndDate),
                        clarificationStartDate: formatDateTimeForInput(res.data.data.clarificationStartDate),
                        clarificationEndDate: formatDateTimeForInput(res.data.data.clarificationEndDate),
                        submissionStartDate: formatDateTimeForInput(res.data.data.submissionStartDate),
                        submissionEndDate: formatDateTimeForInput(res.data.data.submissionEndDate),
                        extensionDate: formatDateTimeForInput(res.data.data.extensionDate),
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
            };
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            } else {
                toastMessage.error('Error in fetching data!!');
            };
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const saveCriticalDates = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_CRITICAL_DATES}`;

        console.log('Saving data:', criticalDatesDetailsObj);
        setIsLoading(true);

        postRequest(baseTenderUrl, criticalDatesDetailsObj).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    toastMessage.success(res.data.message);
                    handlePanelChange(panelIndex + 1);
                } else {
                    toastMessage.error(res.data.message);
                }
            } else {
                toastMessage.error('Error in saving data!!');
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            } else {
                toastMessage.error('Error in saving data!!');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const handleSaveLater = (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate all fields using handleValidations
        Object.keys(criticalDatesDetailsObj).forEach((key) => {
            if (!handleValidations(key, criticalDatesDetailsObj[key])) {
                isValid = false;
            }
        });

        if (isValid) {
            saveCriticalDates();
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
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="publishDate"
                        label="Publish Date"
                        name="publishDate"
                        value={criticalDatesDetailsObj.publishDate}
                        onChange={handleChange}
                        error={errorTexts.publishDate !== ''}
                        helperText={errorTexts.publishDate}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="bidOpeningDate"
                        label="Bid Opening Date"
                        name="bidOpeningDate"
                        value={criticalDatesDetailsObj.bidOpeningDate}
                        onChange={handleChange}
                        error={errorTexts.bidOpeningDate !== ''}
                        helperText={errorTexts.bidOpeningDate}
                    />
                </Grid2>
                <Grid2 size={{ md: 6 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="downloadStartDate"
                        label="Sale Start Date"
                        name="downloadStartDate"
                        value={criticalDatesDetailsObj.downloadStartDate}
                        onChange={handleChange}
                        error={errorTexts.downloadStartDate !== ''}
                        helperText={errorTexts.downloadStartDate}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="downloadEndDate"
                        label="Sale End Date"
                        name="downloadEndDate"
                        value={criticalDatesDetailsObj.downloadEndDate}
                        onChange={handleChange}
                        error={errorTexts.downloadEndDate !== ''}
                        helperText={errorTexts.downloadEndDate}
                    />
                </Grid2>
                <Grid2 size={{ md: 6 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="clarificationStartDate"
                        label="Clarification Start Date"
                        name="clarificationStartDate"
                        value={criticalDatesDetailsObj.clarificationStartDate}
                        onChange={handleChange}
                        error={errorTexts.clarificationStartDate !== ''}
                        helperText={errorTexts.clarificationStartDate}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="clarificationEndDate"
                        label="Clarification End Date"
                        name="clarificationEndDate"
                        value={criticalDatesDetailsObj.clarificationEndDate}
                        onChange={handleChange}
                        error={errorTexts.clarificationEndDate !== ''}
                        helperText={errorTexts.clarificationEndDate}
                    />
                </Grid2>
                <Grid2 size={{ md: 6 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="submissionStartDate"
                        label="Bid Submission Start Date"
                        name="submissionStartDate"
                        value={criticalDatesDetailsObj.submissionStartDate}
                        onChange={handleChange}
                        error={errorTexts.submissionStartDate !== ''}
                        helperText={errorTexts.submissionStartDate}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="submissionEndDate"
                        label="Bid Submission End Date"
                        name="submissionEndDate"
                        value={criticalDatesDetailsObj.submissionEndDate}
                        onChange={handleChange}
                        error={errorTexts.submissionEndDate !== ''}
                        helperText={errorTexts.submissionEndDate}
                    />
                </Grid2>
                <Grid2 size={{ md: 6 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="datetime-local"
                        id="extensionDate"
                        label="Bid Extension Date"
                        name="extensionDate"
                        value={criticalDatesDetailsObj.extensionDate}
                        onChange={handleChange}
                        error={errorTexts.extensionDate !== ''}
                        helperText={errorTexts.extensionDate}
                    />
                </Grid2>
            </Grid2>
        </CustomAccordion>
    );
}

CriticalDatesAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};