import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Divider, Grid2, IconButton, MenuItem, Paper, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS } from '../../../AppApis/APIUrls';
import { getRequest, postRequest } from '../../../AppApis/ApiFunctions';
import { API_STATUS } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';

export default function PhysicalTrackingSetup() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    const MEASURE_BY = [
        { label: "%", value: "%" },
        { label: "Number", value: "Number" }
    ]

    useEffect(() => {
        getBasicDetails();
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: '',
        location: ''
    })

    const [phySetupDetailsObj, setPhySetupDetailsObj] = useState({
        physicalTrackingSetUp: [{
            fieldName: '',
            measureUnit: '',
            targetValue: ''
        }]
    });

    const [errorTexts, setErrorTexts] = useState({
        physicalTrackingSetUp: [{
            fieldName: '',
            measureUnit: '',
            targetValue: ''
        }]
    });

    const handleValidations = (name, value, index) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'fieldName':
                if (value.trim() === '') {
                    errorMessage = 'Field Name is required.';
                }
                break;
            case 'measureUnit':
                errorMessage = value === '' ? 'Measure Unit is required.' : '';
                break;
            case 'targetValue':
                errorMessage = value === '' ? 'Target value is required.' : '';
                if (phySetupDetailsObj.physicalTrackingSetUp[index].measureUnit === MEASURE_BY[0].value) {
                    if (Number(value) < 0 || Number(value) > 100) {
                        errorMessage = 'Target value should be between 0 to 100.';
                    }
                }
                break;
            default:
                break;
        }
        const updatedErrors = [...errorTexts.physicalTrackingSetUp];
        updatedErrors[index][name] = errorMessage;
        setErrorTexts(prevErr => {
            return { ...prevErr, physicalTrackingSetUp: updatedErrors }
        });
        return errorMessage === '';
    };

    const handleChangeList = (e, index) => {
        const { name, value } = e.target;
        const updatedList = [...phySetupDetailsObj.physicalTrackingSetUp];
        updatedList[index][name] = value;
        setPhySetupDetailsObj({ ...phySetupDetailsObj, physicalTrackingSetUp: updatedList });
        handleValidations(name, value, index);
    };

    const handleAddToList = () => {
        const updatedList = [...phySetupDetailsObj.physicalTrackingSetUp, { fieldName: '', measureUnit: '', targetValue: '' }];
        const updatedErrorList = [...errorTexts.physicalTrackingSetUp, { fieldName: '', measureUnit: '', targetValue: '' }];
        setPhySetupDetailsObj({ ...phySetupDetailsObj, physicalTrackingSetUp: updatedList });
        setErrorTexts({ ...errorTexts, physicalTrackingSetUp: updatedErrorList });
    };

    const handleDeleteFromList = (index) => {
        const updatedList = [...phySetupDetailsObj.physicalTrackingSetUp];
        const updatedErrorList = [...errorTexts.physicalTrackingSetUp];
        updatedList.splice(index, 1);
        updatedErrorList.splice(index, 1);
        setPhySetupDetailsObj({ ...phySetupDetailsObj, physicalTrackingSetUp: updatedList });
        setErrorTexts({ ...errorTexts, physicalTrackingSetUp: updatedErrorList });
    };

    const getBasicDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_BASIC_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setBasicDetailsObj({
                        tenderIdText: res.data.data.tenderIdText || '',
                        location: res.data.data.location || '',
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
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in getting deatils!!");
            }

        });
    }

    const savePhyTrackingSetupDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_PHY_TRACKING_SETUP}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, phySetupDetailsObj)
            .then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        toastMessage.success(res.data.message);
                        navigate('/worklist');
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

    const onhandleSave = (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate all fields in tenderDetailsObj
        phySetupDetailsObj.physicalTrackingSetUp.map((phy, index) => {
            if (!handleValidations('fieldName', phy.fieldName, index) ||
                !handleValidations('measureUnit', phy.measureUnit, index) ||
                !handleValidations('targetValue', phy.targetValue, index)) {
                isValid = false;
            }
        });

        if (isValid) {
            savePhyTrackingSetupDetails();
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Physical Tracking Setup' />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <Paper elevation={3} sx={{ padding: "1rem" }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    id="tenderId"
                                    label="Project ID"
                                    name="tenderId"
                                    value={projectId}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    id="tenderIdText"
                                    label="Tender ID"
                                    name="tenderIdText"
                                    value={basicDetailsObj.tenderIdText}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    id="location"
                                    label="Location"
                                    name="location"
                                    value={basicDetailsObj.location}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Divider>Physical Tracking Details</Divider>
                            </Grid2>
                            {phySetupDetailsObj.physicalTrackingSetUp.map((phyObj, index) => (
                                <Fragment key={index}>
                                    <Grid2 size={{ xs: 12, sm: 3, md: 3 }}>
                                        <CustomTextField
                                            isedit={true}
                                            size="small"
                                            required
                                            fullWidth
                                            id="fieldName"
                                            label="Field Name"
                                            name="fieldName"
                                            value={phyObj.fieldName}
                                            onChange={(e) => handleChangeList(e, index)}
                                            error={errorTexts.physicalTrackingSetUp[index]?.fieldName !== ''}
                                            helperText={errorTexts.physicalTrackingSetUp[index]?.fieldName}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, sm: 3, md: 3 }}>
                                        <CustomTextField
                                            isedit={true}
                                            size="small"
                                            required
                                            select
                                            fullWidth
                                            id="measureUnit"
                                            label="Measure Unit"
                                            name="measureUnit"
                                            value={phyObj.measureUnit}
                                            onChange={(e) => handleChangeList(e, index)}
                                            error={errorTexts.physicalTrackingSetUp[index]?.measureUnit !== ''}
                                            helperText={errorTexts.physicalTrackingSetUp[index]?.measureUnit}
                                        >
                                            {MEASURE_BY.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, sm: 3, md: 3 }}>
                                        <CustomTextField
                                            isedit={true}
                                            size="small"
                                            required
                                            fullWidth
                                            type="number"
                                            id="targetValue"
                                            label="Target Value"
                                            name="targetValue"
                                            value={phyObj.targetValue}
                                            onChange={(e) => handleChangeList(e, index)}
                                            error={errorTexts.physicalTrackingSetUp[index]?.targetValue !== ''}
                                            helperText={errorTexts.physicalTrackingSetUp[index]?.targetValue}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, sm: 3, md: 3 }}>
                                        <Stack direction="row" spacing={1}>
                                            {phySetupDetailsObj.physicalTrackingSetUp.length > 1 && (
                                                <IconButton color="primary" onClick={() => handleDeleteFromList(index)}>
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                            )}
                                            {index === phySetupDetailsObj.physicalTrackingSetUp.length - 1 && (
                                                <IconButton color="primary" onClick={handleAddToList}>
                                                    <AddCircleOutlineIcon />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </Grid2>
                                </Fragment>
                            ))}
                        </Grid2>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <CustomButton
                        variant="contained"
                        endIcon={<SaveIcon />}
                        onClick={onhandleSave}
                        color="success"
                        loading={isLoading}
                    >
                        Submit
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Box >
    )
}