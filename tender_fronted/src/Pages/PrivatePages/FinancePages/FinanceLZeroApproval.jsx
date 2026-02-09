import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Divider, Grid2, MenuItem, Paper, Stack } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS, TOOL_API_URL } from '../../../AppApis/APIUrls';
import { getRequest, postRequest, uploadDocsApi } from '../../../AppApis/ApiFunctions';
import { API_STATUS, YES_NO_OPTIONS } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';
import VisuallyHiddenInput from '../../../Components/Common/VisuallyHiddenInput';
import { CloudUpload } from '@mui/icons-material';
import { isValidDate } from '../../../Utils/UtilityFunctions';
import CustomFileUpload from '../../../Components/Common/CustomFileUpload';
import CustomFileDownload from '../../../Components/Common/CustomFileDownload';


export default function FinanceLZeroApproval() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: ''
    });

    useEffect(() => {
        getBasicDetails();
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [lZeroDetailsObj, setLZeroDetailsObj] = useState({
        BGNumber: '',
        BGFileName: '',
        BGguid: '',
        BGAmount: '',
        serialNumber: '',
        dateOfIssue: '',
        dateOfExpiry: '',
        dateOfClaimMax: '',
        nameAddressOfApplicant: '',
        isAddBGRequired: '',
        addBGAmount: '',
        addBGguid: '',
        addBGFileName: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        BGNumber: '',
        BGFileName: '',
        BGAmount: '',
        serialNumber: '',
        dateOfIssue: '',
        dateOfExpiry: '',
        dateOfClaimMax: '',
        nameAddressOfApplicant: '',
        isAddBGRequired: '',
        addBGAmount: '',
        addBGFileName: ''
    });

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'BGNumber':
                if (value.trim() === '') {
                    errorMessage = 'Bank Guarantee Number is required.';
                } else if (/\s/.test(value)) {
                    errorMessage = 'Bank Guarantee Number cannot contain spaces.';
                }
                break;
            case 'BGFileName':
                errorMessage = value.trim() === '' ? 'Bank Gurantee Format is required.' : '';
                break;
            case 'BGAmount':
                if (value === '') {
                    errorMessage = 'Bank Gurantee Amount is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = 'Bank Gurantee Amount must be a positive number with up to 2 decimal places.';
                }
                break;
            case 'serialNumber':
                if (value.trim() === '') {
                    errorMessage = 'Numbering Sheet Serial Number is required.';
                } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                    errorMessage = 'Numbering Sheet Serial Number must be alphanumeric.';
                }
                break;
            case 'dateOfIssue':
                if (value === '') {
                    errorMessage = 'Date of Issue is required.';
                } else if (!isValidDate(value)) {
                    errorMessage = 'Date of Issue must be in YYYY-MM-DD format.';
                }
                break;
            case 'dateOfExpiry':
                if (value === '') {
                    errorMessage = 'Date of Expiry is required.';
                } else if (!isValidDate(value)) {
                    errorMessage = 'Date of Expiry must be in YYYY-MM-DD format.';
                } else if (lZeroDetailsObj.dateOfIssue && new Date(value) < new Date(lZeroDetailsObj.dateOfIssue)) {
                    errorMessage = 'Date of Expiry must be later than Date of Issue.';
                }
                break;
            case 'dateOfClaimMax':
                if (value === '') {
                    errorMessage = 'Claim Period is required.';
                } else if (!isValidDate(value)) {
                    errorMessage = 'Claim Period must be in YYYY-MM-DD format.';
                } else if (lZeroDetailsObj.dateOfExpiry && new Date(value) < new Date(lZeroDetailsObj.dateOfExpiry)) {
                    errorMessage = 'Claim Period must be later than Date of Expiry.';
                }
                break;
            case 'nameAddressOfApplicant':
                errorMessage = value.trim() === '' ? 'Name and Address are required.' : '';
                break;
            case 'isAddBGRequired':
                errorMessage = value === '' ? 'Additional BG field is required.' : '';
            case 'addBGNumber':
                if (lZeroDetailsObj.isAddBGRequired === YES_NO_OPTIONS[0].value) {
                    if (value.trim() === '') {
                        errorMessage = 'Additional Bank Guarantee Number is required.';
                    } else if (/\s/.test(value)) {
                        errorMessage = 'Additional Bank Guarantee Number cannot contain spaces.';
                    }
                }
                break;
            case 'addBGFileName':
                if (lZeroDetailsObj.isAddBGRequired === YES_NO_OPTIONS[0].value) {
                    errorMessage = value.trim() === '' ? 'Additional Bank Gurantee Format is required.' : '';
                }
                break;
            case 'addBGAmount':
                if (lZeroDetailsObj.isAddBGRequired === YES_NO_OPTIONS[0].value) {
                    if (value === '') {
                        errorMessage = 'Additional Bank Gurantee Amount is required.';
                    } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                        errorMessage = 'Additional Bank Gurantee Amount must be a positive number with up to 2 decimal places.';
                    }
                }
                break;
            default:
                break;
        }
        setErrorTexts(prevErr => {
            return { ...prevErr, [name]: errorMessage }
        });
        return errorMessage === '';
    };

    const handleFileUnselect = (e, name, fileType) => {
        e.preventDefault();
        if (fileType === 'BG') {
            setLZeroDetailsObj({ ...lZeroDetailsObj, BGFileName: '', BGguid: '' });
        }
        else if (fileType === 'addBG') {
            setLZeroDetailsObj({ ...lZeroDetailsObj, addBGFileName: '', addBGguid: '' });
        }
    };

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setLZeroDetailsObj({ ...lZeroDetailsObj, [name]: value });
        handleValidations(name, value);
    };

    const saveLZeroDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_LZERO_DETAILS}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, lZeroDetailsObj)
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

        // Validate all fields in lZeroDetailsObj
        Object.keys(lZeroDetailsObj).forEach((key) => {
            if (!handleValidations(key, lZeroDetailsObj[key])) {
                isValid = false;
            }
        });


        if (isValid) {
            saveLZeroDetails();
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    const getBasicDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_BASIC_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setBasicDetailsObj({
                        tenderIdText: res.data.data.tenderIdText || ''
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

    const saveUploadedFiles = (sFiles, fileType) => {
        let fileKey = '';
        let guidKey = '';
        if (fileType === 'BG') {
            fileKey = "BGFileName";
            guidKey = "BGguid";
        } else if (fileType === 'addBG') {
            fileKey = "addBGFileName";
            guidKey = "addBGguid";
        }
        setLZeroDetailsObj({ ...lZeroDetailsObj, [fileKey]: sFiles.fileName, [guidKey]: sFiles.guid });
        if (sFiles.fileName !== "") {
            setErrorTexts({
                ...errorTexts, [fileKey]: ''
            })
        } else {
            setErrorTexts({
                ...errorTexts, [fileKey]: 'File is required'
            })
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Finance L0 Details' />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <Paper elevation={3} sx={{ padding: "1rem" }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    id="projectId"
                                    label="Project ID"
                                    name="projectId"
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
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Divider>L0 Details</Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    fullWidth
                                    id="BGNumber"
                                    label="Bank Gurantee No"
                                    name="BGNumber"
                                    value={lZeroDetailsObj.BGNumber}
                                    onChange={onHandleChange}
                                    error={errorTexts.BGNumber !== ''}
                                    helperText={errorTexts.BGNumber}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 9 }}>
                                <Stack spacing={2} direction="row">
                                    <CustomFileUpload
                                        projectID={projectId}
                                        buttonName="Select Bank Gurantee Format"
                                        saveUploadedFiles={(sFiles) => saveUploadedFiles(sFiles, 'BG')}
                                        errorText={errorTexts.BGFileName}
                                    />
                                    {lZeroDetailsObj.BGFileName !== '' && (
                                        <CustomFileDownload
                                            guid={lZeroDetailsObj.BGguid}
                                            isedit={true}
                                            fileName={lZeroDetailsObj.BGFileName}
                                            projectID={projectId}
                                            handleFileUnselect={(e, fileName) => handleFileUnselect(e, fileName, 'BG')}
                                        />
                                    )}
                                </Stack>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    fullWidth
                                    id="BGAmount"
                                    label="BG Amount"
                                    name="BGAmount"
                                    value={lZeroDetailsObj.BGAmount}
                                    onChange={onHandleChange}
                                    error={errorTexts.BGAmount !== ''}
                                    helperText={errorTexts.BGAmount}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    fullWidth
                                    id="serialNumber"
                                    label="Numbering Sheet Serial Number"
                                    name="serialNumber"
                                    value={lZeroDetailsObj.serialNumber}
                                    onChange={onHandleChange}
                                    error={errorTexts.serialNumber !== ''}
                                    helperText={errorTexts.serialNumber}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 6 }} />
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="dateOfIssue"
                                    label="Date of Issue"
                                    name="dateOfIssue"
                                    value={lZeroDetailsObj.dateOfIssue}
                                    onChange={onHandleChange}
                                    error={errorTexts.dateOfIssue !== ''}
                                    helperText={errorTexts.dateOfIssue}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="dateOfExpiry"
                                    label="BG Expiry Date"
                                    name="dateOfExpiry"
                                    value={lZeroDetailsObj.dateOfExpiry}
                                    onChange={onHandleChange}
                                    error={errorTexts.dateOfExpiry !== ''}
                                    helperText={errorTexts.dateOfExpiry}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="dateOfClaimMax"
                                    label="Claim Period Available up to"
                                    name="dateOfClaimMax"
                                    value={lZeroDetailsObj.dateOfClaimMax}
                                    onChange={onHandleChange}
                                    error={errorTexts.dateOfClaimMax !== ''}
                                    helperText={errorTexts.dateOfClaimMax}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    fullWidth
                                    id="nameAddressOfApplicant"
                                    label="Name & Address of Applicant"
                                    name="nameAddressOfApplicant"
                                    multiline
                                    rows={4}
                                    value={lZeroDetailsObj.nameAddressOfApplicant}
                                    onChange={onHandleChange}
                                    error={errorTexts.nameAddressOfApplicant !== ''}
                                    helperText={errorTexts.nameAddressOfApplicant}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    select
                                    fullWidth
                                    id="isAddBGRequired"
                                    label="Is Additional BG Required"
                                    name="isAddBGRequired"
                                    value={lZeroDetailsObj.isAddBGRequired}
                                    onChange={onHandleChange}
                                    error={errorTexts.isAddBGRequired !== ''}
                                    helperText={errorTexts.isAddBGRequired}
                                >
                                    {YES_NO_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 8, md: 9 }}></Grid2>
                            {lZeroDetailsObj.isAddBGRequired === YES_NO_OPTIONS[0].value && (
                                <>
                                    <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                        <CustomTextField
                                            isedit={true}
                                            size="small"
                                            fullWidth
                                            id="addBGAmount"
                                            label="Additional BG amount"
                                            name="addBGAmount"
                                            value={lZeroDetailsObj.addBGAmount}
                                            onChange={onHandleChange}
                                            error={errorTexts.addBGAmount !== ''}
                                            helperText={errorTexts.addBGAmount}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, sm: 12, md: 9 }}>
                                        <Stack spacing={2} direction="row">
                                            <CustomFileUpload
                                                projectID={projectId}
                                                buttonName="Select Additional Bank Gurantee Format"
                                                saveUploadedFiles={(sFiles) => saveUploadedFiles(sFiles, 'addBG')}
                                                errorText={errorTexts.addBGFileName}
                                            />
                                            {lZeroDetailsObj.addBGFileName !== '' && (
                                                <CustomFileDownload
                                                    guid={lZeroDetailsObj.addBGguid}
                                                    isedit={true}
                                                    fileName={lZeroDetailsObj.addBGFileName}
                                                    projectID={projectId}
                                                    handleFileUnselect={(e, fileName) => handleFileUnselect(e, fileName, 'addBG')}
                                                />
                                            )}
                                        </Stack>
                                    </Grid2>
                                </>
                            )}
                            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ display: 'flex', justifyContent: 'end' }}>
                                <CustomButton
                                    variant="contained"
                                    startIcon={<DoneAllIcon />}
                                    onClick={onhandleSave}
                                    color="success"
                                    loading={isLoading}
                                >
                                    Submit
                                </CustomButton>
                            </Grid2>
                        </Grid2>
                    </Paper>
                </Grid2>

            </Grid2>
        </Box >
    )
}