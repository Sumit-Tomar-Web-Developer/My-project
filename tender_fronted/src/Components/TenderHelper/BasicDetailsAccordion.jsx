import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { useAuth } from '../../Providers/AuthProvider';
import { Grid2, MenuItem } from '@mui/material';
import CustomAccordion from '../Common/CustomAccordion';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, DEPARTMENT_TYPES, PAYMENT_MODES } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';


export default function BasicDetailsAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);
    const getDepartmentTypesDict = (dep) => {
        let depTypeDict = {};
        for (const [key, value] of Object.entries(DEPARTMENT_TYPES)) {
            if(Number(key) === Number(dep)){
                depTypeDict = value;
                break;
            }
        }
        return depTypeDict;
    }

    const [departmentTypeDict, setDepartmentTypeDict] = React.useState(getDepartmentTypesDict(user.department));

    const [basicDetailsObj, setBasicDetailsObj] =
        React.useState({
            location: '',
            referenceNumber: '',
            tenderIdText: '',
            paymentMode: '',
            department: '',
            departmentType: '',
            otherDepartmentType: ''
        });

    const [errorTexts, setErrorTexts] = React.useState({
        location: '',
        referenceNumber: '',
        tenderIdText: '',
        paymentMode: '',
        department: '',
        departmentType: '',
        otherDepartmentType: ''
    });

    useEffect(() => {
        getBasicDetails();
    }, [user.department]);

    const handleValidations = (name, value) => {
        // Validation logic
        let errorMessage = '';
        switch (name) {
            case 'location':
                errorMessage = value.trim() === '' ? 'Organization Location is required.' : '';
                break;
            case 'referenceNumber':
                if (value.trim() === '') {
                    errorMessage = 'Tender Reference Number is required.';
                }
                break;
            case 'tenderIdText':
                if (value.trim() === '') {
                    errorMessage = 'Tender ID is required.';
                }
                break;
            case 'paymentMode':
                errorMessage = value.trim() === '' ? 'Payment Mode is required.' : '';
                break;
            case 'departmentType':
                errorMessage = value.trim() === '' ? 'Department Type is required.' : '';
                break;
            case 'otherDepartmentType':
                if (basicDetailsObj.departmentType === departmentTypeDict?.OTHER?.value) {
                    errorMessage = value.trim() === '' ? 'Other Department Type is required.' : '';
                }
                break;
            default:
                break;
        }
        return errorMessage;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const errorMessage = handleValidations(name, value);
        setBasicDetailsObj({ ...basicDetailsObj, [name]: value });
        setErrorTexts({ ...errorTexts, [name]: errorMessage });
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        handlePanelChange(panelIndex - 1);
    }

    const getBasicDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_BASIC_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    let tempDepType = res.data.data.departmentType || '';
                    let tempOtherDepType = '';
                    const isValidDepartmentType = Object.values(departmentTypeDict).some(dep => dep.value === tempDepType);

                    if (!isValidDepartmentType) {
                        tempOtherDepType = tempDepType;
                        tempDepType = departmentTypeDict?.OTHER?.value;
                    }
                    setBasicDetailsObj({
                        location: res.data.data.location || '',
                        referenceNumber: res.data.data.referenceNumber || '',
                        tenderIdText: res.data.data.tenderIdText || '',
                        paymentMode: res.data.data.paymentMode || '',
                        department: res.data.data.department || '',
                        departmentType: tempDepType,
                        otherDepartmentType: tempOtherDepType
                    });
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in getting deatils!!");
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
                toastMessage.error("Error in getting deatils!!");
            }

        }).finally(() => {
            setIsLoading(false);
        });
    }

    const saveBasicDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_BASIC_DETAILS}`;
        setIsLoading(true);
        let tempBasicDetailsObj = { ...basicDetailsObj };
        if (tempBasicDetailsObj.departmentType === departmentTypeDict?.OTHER?.value) {
            tempBasicDetailsObj.departmentType = tempBasicDetailsObj.otherDepartmentType;
        }

        delete tempBasicDetailsObj.otherDepartmentType; // Remove otherDepartmentType before sending

        postRequest(baseTenderUrl, tempBasicDetailsObj).then((res) => {
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
    }

    const handleSaveLater = (e) => {
        e.preventDefault();
        const newErrorTexts = Object.keys(basicDetailsObj).reduce((acc, key) => {
            acc[key] = handleValidations(key, basicDetailsObj[key]);
            return acc;
        }, {});
        setErrorTexts(newErrorTexts);
        const hasErrors = Object.values(newErrorTexts).some((error) => error !== '');

        if (!hasErrors) {
            saveBasicDetails();
        }
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
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="departmentType"
                        label="Type"
                        name="departmentType"
                        value={basicDetailsObj.departmentType}
                        onChange={handleChange}
                        error={errorTexts.departmentType !== ''}
                        helperText={errorTexts.departmentType}
                    >
                        {Object.values(departmentTypeDict).map((dep) => (
                            <MenuItem key={dep.value} value={dep.value}>
                                {dep.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                    {basicDetailsObj.departmentType === departmentTypeDict?.OTHER?.value && (
                        <CustomTextField
                            isedit={isedit}
                            size="small"
                            required
                            fullWidth
                            id="otherDepartmentType"
                            label="Other Type"
                            name="otherDepartmentType"
                            value={basicDetailsObj.otherDepartmentType}
                            onChange={handleChange}
                            error={errorTexts.otherDepartmentType !== ''}
                            helperText={errorTexts.otherDepartmentType}
                        />
                    )
                    }
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}></Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="referenceNumber"
                        label="Tender Ref No."
                        name="referenceNumber"
                        value={basicDetailsObj.referenceNumber}
                        onChange={handleChange}
                        error={errorTexts.referenceNumber !== ''}
                        helperText={errorTexts.referenceNumber}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="tenderIdText"
                        label="Tender ID"
                        name="tenderIdText"
                        value={basicDetailsObj.tenderIdText}
                        onChange={handleChange}
                        error={errorTexts.tenderIdText !== ''}
                        helperText={errorTexts.tenderIdText}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        select
                        required
                        fullWidth
                        id="paymentMode"
                        label="Payment Mode"
                        name="paymentMode"
                        value={basicDetailsObj.paymentMode}
                        onChange={handleChange}
                        error={errorTexts.paymentMode !== ''}
                        helperText={errorTexts.paymentMode}
                    >
                        {PAYMENT_MODES.map((mode) => (
                            <MenuItem key={mode.value} value={mode.value}>
                                {mode.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="location"
                        label="Organization Location"
                        name="location"
                        value={basicDetailsObj.location}
                        onChange={handleChange}
                        error={errorTexts.location !== ''}
                        helperText={errorTexts.location}
                    />
                </Grid2>
            </Grid2>
        </CustomAccordion>
    );
}

BasicDetailsAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired
};