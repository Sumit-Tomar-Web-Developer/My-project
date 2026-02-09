import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Grid2,
    Stack,
    Paper,
    Divider,
    MenuItem
} from "@mui/material";
import CustomPageTitle from "../../../Components/Common/CustomPageTitle";
import CustomButton from "../../../Components/Common/CustomButton";
import { API_STATUS, YES_NO_OPTIONS } from "../../../Utils/Constants";
import { useToast } from "../../../Providers/ToastProvider";
import { postRequest, getRequest } from "../../../AppApis/ApiFunctions";
import { isValidDate } from "../../../Utils/UtilityFunctions";
import { API_URLS } from "../../../AppApis/APIUrls";
import CustomTextField from "../../../Components/Common/CustomTextField";
import SaveIcon from '@mui/icons-material/Save';
import CustomFileUpload from "../../../Components/Common/CustomFileUpload";
import CustomFileDownload from "../../../Components/Common/CustomFileDownload";

export default function L1ApprovalPage() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: '',
        location: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const [l1ApprovalDetailsObj, setL1ApprovalDetailsObj] = useState({
        loiReceived: '',
        workOrderCost: '',
        securityDepositAmount: '',
        completedByDate: '',
        agreementStampRequired: '',
        stampDutyAmount: '',
        registrationFees: '',
        physicalStampRequired: '',
        numOfStampsRequired: '',
        eSBTRRequired: '',
        panNo: '',
        gstNo: '',
        otherPartyName: '',
        otherDutyPayerId: '',
        l1FileName: '',
        l1Guid: '',
        loiFileName: '',
        loiGuid: '',
        agreementFileName: '',
        agreementGuid: '',
        workOrderFileName: '',
        workOrderGuid: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        loiReceived: '',
        workOrderCost: '',
        securityDepositAmount: '',
        completedByDate: '',
        agreementStampRequired: '',
        stampDutyAmount: '',
        registrationFees: '',
        physicalStampRequired: '',
        numOfStampsRequired: '',
        eSBTRRequired: '',
        panNo: '',
        gstNo: '',
        otherPartyName: '',
        otherDutyPayerId: '',
        l1FileName: '',
        l1Guid: '',
        loiFileName: '',
        loiGuid: '',
        agreementFileName: '',
        agreementGuid: '',
        workOrderFileName: '',
        workOrderGuid: ''
    });

    useEffect(() => {
        getBasicDetails();
    }, []);

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'loiReceived':
                errorMessage = value.trim() === '' ? 'LOI Received is required.' : '';
                break;
            case 'workOrderCost':
                if (value === '') {
                    errorMessage = 'Work Order Cost is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = 'Work Order Cost must be a positive number upto 2 decimal points.';
                }
                break;
            case 'securityDepositAmount':
                if (value === '') {
                    errorMessage = 'Security Deposit Amount is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = 'Security Deposit Amount must be a positive number upto 2 decimal points.';
                }
                break;
            case 'completedByDate':
                if (value.trim() === '') {
                    errorMessage = 'Complete by Date is required.';
                } else if (!isValidDate(value)) {
                    errorMessage = 'Complete by Date must be in YYYY-MM-DD format.';
                }
                break;
            case 'agreementStampRequired':
                errorMessage = value.trim() === '' ? 'Agreement stamp required field is required.' : '';
                break;
            case 'stampDutyAmount':
                if (value === '') {
                    errorMessage = 'Stamp Duty Amount is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = 'Stamp Duty Amount must be a positive number upto 2 decimal points.';
                }
                break;
            case 'registrationFees':
                if (value === '') {
                    errorMessage = 'Registration Fees is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = 'Registration Fees must be a positive number upto 2 decimal points.';
                }
                break;
            case 'physicalStampRequired':
                errorMessage = value.trim() === '' ? 'Physical Stamp required field is required.' : '';
                break;
            case 'numOfStampsRequired':
                if (value === '') {
                    errorMessage = 'Number Of Stamps Field is required.';
                } else if (!/^[0-9]\d*$/.test(value)) {
                    errorMessage = 'Number Of Stamps must be a postive integer.';
                }
                break;
            case 'eSBTRRequired':
                errorMessage = value.trim() === '' ? 'e-SBTR required field is required.' : '';
                break;
            case 'panNo':
                if (l1ApprovalDetailsObj.eSBTRRequired === YES_NO_OPTIONS[0].value) {
                    if (value.trim() === '') {
                        errorMessage = 'PAN Number is required.';
                    } else if (/\s/.test(value)) {
                        errorMessage = 'PAN Number must not contain spaces.';
                    }
                }
                break;
            case 'gstNo':
                if (l1ApprovalDetailsObj.eSBTRRequired === YES_NO_OPTIONS[0].value) {
                    if (value.trim() === '') {
                        errorMessage = 'GST Number is required.';
                    } else if (/\s/.test(value)) {
                        errorMessage = 'GST Number must not contain spaces.';
                    }
                }
                break;
            case 'otherPartyName':
                errorMessage = value.trim() === '' ? 'Other Party Name is required.' : '';
                break;
            case 'otherDutyPayerId':
                errorMessage = value.trim() === '' ? 'Other Duty Payer Id is required.' : '';
                break;
            case 'l1FileName':
                errorMessage = value.trim() === '' ? 'L1 Doc is required.' : '';
                break;
            case 'loiFileName':
                errorMessage = value.trim() === '' ? 'LOI Doc is required.' : '';
                break;
            case 'agreementFileName':
                errorMessage = value.trim() === '' ? 'Agreement Doc is required.' : '';
                break;
            case 'workOrderFileName':
                errorMessage = value.trim() === '' ? 'Work Order Doc is required.' : '';
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
        if (fileType === 'l1') {
            setL1ApprovalDetailsObj({ ...l1ApprovalDetailsObj, l1FileName: '', l1Guid: '' });
        } else if (fileType === 'loi') {
            setL1ApprovalDetailsObj({ ...l1ApprovalDetailsObj, loiFileName: '', loiGuid: '' });
        } else if (fileType === 'agreement') {
            setL1ApprovalDetailsObj({ ...l1ApprovalDetailsObj, agreementFileName: '', agreementGuid: '' });
        } else if (fileType === 'workOrder') {
            setL1ApprovalDetailsObj({ ...l1ApprovalDetailsObj, workOrderFileName: '', workOrderGuid: '' });
        }
    };

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setL1ApprovalDetailsObj({ ...l1ApprovalDetailsObj, [name]: value });
        handleValidations(name, value)
    };

    const saveL1ApprovalDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_L1_APPROVAL_DETAILS}`;

        let uploadDataObj = Object.assign({}, l1ApprovalDetailsObj);

        console.log('Saving data:', uploadDataObj);
        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, uploadDataObj)
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

    const onHandleSave = (e) => {
        e.preventDefault();
        let isValid = true;

        Object.entries(l1ApprovalDetailsObj).forEach(([key, value]) => {
            if (!handleValidations(key, value)) {
                isValid = false;
            }
        });

        if (isValid) {
            saveL1ApprovalDetails();
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
                        tenderIdText: res.data.data.tenderIdText || '',
                        location: res.data.data.location || ''
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
        if (fileType === 'l1') {
            fileKey = "l1FileName";
            guidKey = "l1Guid";
        } else if (fileType === 'loi') {
            fileKey = "loiFileName";
            guidKey = "loiGuid";
        } else if (fileType === 'agreement') {
            fileKey = "agreementFileName";
            guidKey = "agreementGuid";
        } else if (fileType === 'workOrder') {
            fileKey = "workOrderFileName";
            guidKey = "workOrderGuid";
        }
        setL1ApprovalDetailsObj({ ...l1ApprovalDetailsObj, [fileKey]: sFiles.fileName, [guidKey]: sFiles.guid });
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
            <CustomPageTitle title="L1 Approval" />
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                    <Paper elevation={3} sx={{ padding: "1rem" }}>
                        <Grid2 container size={{ xs: 12, sm: 12, md: 12 }} spacing={3}>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }} >
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
                                <Divider>L1 Approval Details</Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    select
                                    required
                                    fullWidth
                                    id="loiReceived"
                                    label="LOI Received"
                                    name="loiReceived"
                                    value={l1ApprovalDetailsObj.loiReceived}
                                    onChange={onHandleChange}
                                    error={errorTexts.loiReceived !== ''}
                                    helperText={errorTexts.loiReceived}
                                >
                                    {YES_NO_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    type="number"
                                    id="workOrderCost"
                                    label="Work Order Cost"
                                    name="workOrderCost"
                                    value={l1ApprovalDetailsObj.workOrderCost}
                                    onChange={onHandleChange}
                                    error={errorTexts.workOrderCost !== ''}
                                    helperText={errorTexts.workOrderCost}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    type="number"
                                    id="securityDepositAmount"
                                    label="Security Deposit"
                                    name="securityDepositAmount"
                                    value={l1ApprovalDetailsObj.securityDepositAmount}
                                    onChange={onHandleChange}
                                    error={errorTexts.securityDepositAmount !== ''}
                                    helperText={errorTexts.securityDepositAmount}
                                />
                            </Grid2>
                            <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    select
                                    required
                                    fullWidth
                                    id="agreementStampRequired"
                                    label="Agreement Stamp Required"
                                    name="agreementStampRequired"
                                    value={l1ApprovalDetailsObj.agreementStampRequired}
                                    onChange={onHandleChange}
                                    error={errorTexts.agreementStampRequired !== ''}
                                    helperText={errorTexts.agreementStampRequired}
                                >
                                    {YES_NO_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    type="number"
                                    id="stampDutyAmount"
                                    label="Stamp Duty Amount"
                                    name="stampDutyAmount"
                                    value={l1ApprovalDetailsObj.stampDutyAmount}
                                    onChange={onHandleChange}
                                    error={errorTexts.stampDutyAmount !== ''}
                                    helperText={errorTexts.stampDutyAmount}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="completedByDate"
                                    label="Completed By Date"
                                    name="completedByDate"
                                    value={l1ApprovalDetailsObj.completedByDate}
                                    onChange={onHandleChange}
                                    error={errorTexts.completedByDate !== ''}
                                    helperText={errorTexts.completedByDate}
                                />
                            </Grid2>
                            <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    select
                                    required
                                    fullWidth
                                    id="physicalStampRequired"
                                    label="Physical Stamp Required"
                                    name="physicalStampRequired"
                                    value={l1ApprovalDetailsObj.physicalStampRequired}
                                    onChange={onHandleChange}
                                    error={errorTexts.physicalStampRequired !== ''}
                                    helperText={errorTexts.physicalStampRequired}
                                >
                                    {YES_NO_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    type="number"
                                    id="numOfStampsRequired"
                                    label="Number Of Stamps Required"
                                    name="numOfStampsRequired"
                                    value={l1ApprovalDetailsObj.numOfStampsRequired}
                                    onChange={onHandleChange}
                                    error={errorTexts.numOfStampsRequired !== ''}
                                    helperText={errorTexts.numOfStampsRequired}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    type="number"
                                    id="registrationFees"
                                    label="Registration Fees"
                                    name="registrationFees"
                                    value={l1ApprovalDetailsObj.registrationFees}
                                    onChange={onHandleChange}
                                    error={errorTexts.registrationFees !== ''}
                                    helperText={errorTexts.registrationFees}
                                />
                            </Grid2>
                            <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    select
                                    required
                                    fullWidth
                                    id="eSBTRRequired"
                                    label="e-SBTR Required"
                                    name="eSBTRRequired"
                                    value={l1ApprovalDetailsObj.eSBTRRequired}
                                    onChange={onHandleChange}
                                    error={errorTexts.eSBTRRequired !== ''}
                                    helperText={errorTexts.eSBTRRequired}
                                >
                                    {YES_NO_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                {l1ApprovalDetailsObj.eSBTRRequired === YES_NO_OPTIONS[0].value && (
                                    <CustomTextField
                                        isedit={true}
                                        size="small"
                                        required
                                        fullWidth
                                        id="panNo"
                                        label="PAN Number"
                                        name="panNo"
                                        value={l1ApprovalDetailsObj.panNo}
                                        onChange={onHandleChange}
                                        error={errorTexts.panNo !== ''}
                                        helperText={errorTexts.panNo}
                                    />
                                )}
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                {l1ApprovalDetailsObj.eSBTRRequired === YES_NO_OPTIONS[0].value && (
                                    <CustomTextField
                                        isedit={true}
                                        size="small"
                                        required
                                        fullWidth
                                        id="gstNo"
                                        label="GST Number"
                                        name="gstNo"
                                        value={l1ApprovalDetailsObj.gstNo}
                                        onChange={onHandleChange}
                                        error={errorTexts.gstNo !== ''}
                                        helperText={errorTexts.gstNo}
                                    />
                                )}
                            </Grid2>
                            <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 9 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    id="otherPartyName"
                                    label="Other Party Name"
                                    name="otherPartyName"
                                    value={l1ApprovalDetailsObj.otherPartyName}
                                    onChange={onHandleChange}
                                    error={errorTexts.otherPartyName !== ''}
                                    helperText={errorTexts.otherPartyName}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 9 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    id="otherDutyPayerId"
                                    label="Other Duty Payer ID"
                                    name="otherDutyPayerId"
                                    value={l1ApprovalDetailsObj.otherDutyPayerId}
                                    onChange={onHandleChange}
                                    error={errorTexts.otherDutyPayerId !== ''}
                                    helperText={errorTexts.otherDutyPayerId}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack spacing={2} direction="row">
                                    <CustomFileUpload
                                        projectID={projectId}
                                        buttonName="Select L1 Document"
                                        saveUploadedFiles={(fileObj) => saveUploadedFiles(fileObj, 'l1')}
                                        errorText={errorTexts.l1FileName}
                                    />
                                    {l1ApprovalDetailsObj.l1FileName !== '' && (
                                        <CustomFileDownload
                                            guid={l1ApprovalDetailsObj.l1Guid}
                                            isedit={true}
                                            fileName={l1ApprovalDetailsObj.l1FileName}
                                            projectID={projectId}
                                            handleFileUnselect={(e, fileName) => handleFileUnselect(e, fileName, 'l1')}
                                        />
                                    )}
                                </Stack>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack spacing={2} direction="row">
                                    <CustomFileUpload
                                        projectID={projectId}
                                        buttonName="Select LOI Document"
                                        saveUploadedFiles={(fileObj) => saveUploadedFiles(fileObj, 'loi')}
                                        errorText={errorTexts.loiFileName}
                                    />
                                    {l1ApprovalDetailsObj.loiFileName !== '' && (
                                        <CustomFileDownload
                                            guid={l1ApprovalDetailsObj.loiGuid}
                                            isedit={true}
                                            fileName={l1ApprovalDetailsObj.loiFileName}
                                            projectID={projectId}
                                            handleFileUnselect={(e, fileName) => handleFileUnselect(e, fileName, 'loi')}
                                        />
                                    )}
                                </Stack>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack spacing={2} direction="row">
                                    <CustomFileUpload
                                        projectID={projectId}
                                        buttonName="Select Agreement Document"
                                        saveUploadedFiles={(fileObj) => saveUploadedFiles(fileObj, 'agreement')}
                                        errorText={errorTexts.agreementFileName}
                                    />
                                    {l1ApprovalDetailsObj.agreementFileName !== '' && (
                                        <CustomFileDownload
                                            guid={l1ApprovalDetailsObj.agreementGuid}
                                            isedit={true}
                                            fileName={l1ApprovalDetailsObj.agreementFileName}
                                            projectID={projectId}
                                            handleFileUnselect={(e, fileName) => handleFileUnselect(e, fileName, 'agreement')}
                                        />
                                    )}
                                </Stack>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack spacing={2} direction="row">
                                    <CustomFileUpload
                                        projectID={projectId}
                                        buttonName="Select Work Order Document"
                                        saveUploadedFiles={(fileObj) => saveUploadedFiles(fileObj, 'workOrder')}
                                        errorText={errorTexts.workOrderFileName}
                                    />
                                    {l1ApprovalDetailsObj.workOrderFileName !== '' && (
                                        <CustomFileDownload
                                            guid={l1ApprovalDetailsObj.workOrderGuid}
                                            isedit={true}
                                            fileName={l1ApprovalDetailsObj.workOrderFileName}
                                            projectID={projectId}
                                            handleFileUnselect={(e, fileName) => handleFileUnselect(e, fileName, 'workOrder')}
                                        />
                                    )}
                                </Stack>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <CustomButton
                                        id="save_button"
                                        onClick={onHandleSave}
                                        variant="contained"
                                        sx={{
                                            marginLeft: "1rem"
                                        }}
                                        endIcon={<SaveIcon />}
                                        color="success"
                                        position="end"
                                        loading={isLoading}
                                    >
                                        Save L1 Details
                                    </CustomButton>
                                </Stack>
                            </Grid2>
                        </Grid2>
                    </Paper>
                </Grid2>
            </Grid2>
        </Box >
    );
};
