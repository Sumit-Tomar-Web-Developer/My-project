import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Divider, Grid2, InputAdornment, Paper, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS } from '../../../AppApis/APIUrls';
import { getRequest, postRequest } from '../../../AppApis/ApiFunctions';
import { API_STATUS } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';
import CircularProgressWithLabel from '../../../Components/Common/CircularProgressWithLabel';
import CustomFileUpload from '../../../Components/Common/CustomFileUpload';
import CustomFileDownload from '../../../Components/Common/CustomFileDownload';

export default function PhysicalTrackingProgress() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    useEffect(() => {
        getBasicDetails();
        getPhyTrackingDetails();
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: '',
        location: ''
    })

    const [phySetupDetailsObj, setPhySetupDetailsObj] = useState({
        physicalTrackingSetUp: []
    });

    const [phyProgressDetailsObj, setPhyProgressDetailsObj] = useState({
        physicalTrackingProgress: [],
        fileName: '',
        guid: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        physicalTrackingProgress: [],
        fileName: ''
    });

    const [isProjCompleted, setIsProjCompleted] = useState(false);

    const handleFileValidation = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'fileName':
                errorMessage = value.trim() === '' ? 'Work Completion Certificate is required.' : '';
                break;
            default:
                break;
        }
        setErrorTexts(prevErr => {
            return { ...prevErr, [name]: errorMessage }
        });
        return errorMessage === '';
    };

    const handleValidations = (name, value, index) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'fieldValue':
                if (value === '') {
                    errorMessage = 'Field Value is required.';
                }
                else {
                    if (Number(value) < 0 || Number(value) > phySetupDetailsObj.physicalTrackingSetUp[index].targetValue) {
                        errorMessage = 'Field Value should be between 0 to ' + phySetupDetailsObj.physicalTrackingSetUp[index].targetValue;
                    }
                }
                break;
            default:
                break;
        }
        const updatedErrors = [...errorTexts.physicalTrackingProgress];
        updatedErrors[index][name] = errorMessage;
        setErrorTexts(prevErr => {
            return { ...prevErr, physicalTrackingProgress: updatedErrors }
        });
        return errorMessage === '';
    };

     const handleFileUnselect = (e, name) => {
        e.preventDefault();
        setPhyProgressDetailsObj({ ...phyProgressDetailsObj, fileName: '', guid: '' });
    };

    const isPhyTrackingCompleted = (progessDetails, targetDetails ) => {
        let isCompleted = true;
        for (let i = 0; i < targetDetails.length; i++) {
            if (progessDetails && progessDetails.length > i) {
              if (Number(targetDetails[i].targetValue) !== Number(progessDetails[i].fieldValue)) {
                isCompleted = false;
                break;
              }
            }
            else {
              isCompleted = false;
              break;
            }
        }
        return isCompleted;
    }

    const handleChangeList = (e, index) => {
        const { name, value } = e.target;
        const updatedList = [...phyProgressDetailsObj.physicalTrackingProgress];
        updatedList[index][name] = value;
        setPhyProgressDetailsObj({ ...phyProgressDetailsObj, physicalTrackingProgress: updatedList });
        handleValidations(name, value, index);
        setIsProjCompleted(isPhyTrackingCompleted(phyProgressDetailsObj.physicalTrackingProgress, phySetupDetailsObj.physicalTrackingSetUp))
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

    const getPhyTrackingDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_PHY_TRACKING_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    let physicalTrackingSetUp = res.data.data.physicalTrackingSetUp || [];
                    let physicalTrackingProgress = res.data.data.physicalTrackingProgress || [];
                    let fileName = res.data.data.fileName || '';
                    let guid = res.data.data.guid || '';
                    for (let i = 0; i < physicalTrackingSetUp.length; i++) {
                        if (physicalTrackingSetUp.length !== physicalTrackingProgress.length) {
                            physicalTrackingProgress.push({ fieldValue: '' });
                        }
                        errorTexts.physicalTrackingProgress.push({ fieldValue: '' });
                    }

                    setPhyProgressDetailsObj({ physicalTrackingProgress: physicalTrackingProgress, fileName: fileName, guid: guid });
                    setPhySetupDetailsObj({ physicalTrackingSetUp: physicalTrackingSetUp });
                    setIsProjCompleted(isPhyTrackingCompleted(physicalTrackingProgress, physicalTrackingSetUp));
                    
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

    const savePhyTrackingProgressDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_PHY_TRACKING_PROGRESS}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, phyProgressDetailsObj)
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
        phyProgressDetailsObj.physicalTrackingProgress.forEach((phy, index) => {
            if (!handleValidations('fieldValue', phy.fieldValue, index)) {
                isValid = false;
            }
        });

        if(isProjCompleted){
            if (!handleFileValidation('fileName', phyProgressDetailsObj.fileName)) {
                isValid = false;
            }
        }

        if (isValid) {
            savePhyTrackingProgressDetails();
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    const saveUploadedFiles = (sFiles) => {
        setPhyProgressDetailsObj({
            ...phyProgressDetailsObj, fileName: sFiles.fileName,
            guid: sFiles.guid
        });
        if (sFiles.fileName !== "") {
            setErrorTexts({
                ...errorTexts, fileName: ''
            })
        }
        else {
            setErrorTexts({
                ...errorTexts, fileName: 'File is required'
            })
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Physical Track Progress' />
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
                                <Divider>Physical Track Progress Details</Divider>
                            </Grid2>
                            {phySetupDetailsObj.physicalTrackingSetUp.map((phyObj, index) => (
                                <Fragment key={index}>
                                    <Grid2 size={{ xs: 12, sm: 3, md: 3 }}>
                                        <CustomTextField
                                            isedit={true}
                                            size="small"
                                            required
                                            fullWidth
                                            id="fieldValue"
                                            label={phyObj.fieldName}
                                            name="fieldValue"
                                            value={phyProgressDetailsObj.physicalTrackingProgress[index].fieldValue}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <InputAdornment position="end">{phyObj.measureUnit}</InputAdornment>,
                                                },
                                            }}
                                            onChange={(e) => handleChangeList(e, index)}
                                            error={errorTexts.physicalTrackingProgress[index]?.fieldValue !== ''}
                                            helperText={errorTexts.physicalTrackingProgress[index]?.fieldValue}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, sm: 3, md: 3 }}>
                                        <CustomTextField
                                            isedit={false}
                                            size="small"
                                            required
                                            fullWidth
                                            type="number"
                                            id="targetValue"
                                            label="Target Value"
                                            name="targetValue"
                                            value={phyObj.targetValue}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                                        <CircularProgressWithLabel
                                            value={phyProgressDetailsObj.physicalTrackingProgress[index].fieldValue ?
                                                (phyProgressDetailsObj.physicalTrackingProgress[index].fieldValue / phyObj.targetValue) * 100 : 0} />
                                    </Grid2>
                                </Fragment>
                            ))}
                            {isProjCompleted && (
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack spacing={2} direction="row">
                                    <CustomFileUpload projectID={projectId} buttonName="Upload Work Completion Certificate"
                                        saveUploadedFiles={saveUploadedFiles} errorText={errorTexts.fileName} />

                                    {phyProgressDetailsObj.fileName !== '' && (
                                        <CustomFileDownload
                                            guid={phyProgressDetailsObj.guid} isedit={true}
                                            fileName={phyProgressDetailsObj.fileName} projectID={projectId}
                                            handleFileUnselect={handleFileUnselect}
                                        />
                                    )}
                                </Stack>
                            </Grid2>
                            )}
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
                        Save Physical Progress
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Box >
    )
}