import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Divider, Grid2, InputAdornment, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS } from '../../../AppApis/APIUrls';
import { getRequest, postRequest } from '../../../AppApis/ApiFunctions';
import { API_STATUS } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';

export default function FinancialTrackingProgress(props) {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    useEffect(() => {
        getBasicDetails();
        if (props.isSetup === false) {
            getFinTrackingDetails();
        }
    }, [props.isSetup, projectId]);

    const [isLoading, setIsLoading] = useState(false);
    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: '',
        location: ''
    })

    const [finProgressDetailsObj, setFinProgressDetailsObj] = useState({
        clientName: '',
        clientAddress: '',
        issuingAuthorityName: '',
        clientGSTNumber: '',
        clientPAN: '',
        billSubmittedAmount: '',
        billPaymentReceived: '',
        amountVarianceReason: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        clientName: '',
        clientAddress: '',
        issuingAuthorityName: '',
        clientGSTNumber: '',
        clientPAN: '',
        billSubmittedAmount: '',
        billPaymentReceived: '',
        amountVarianceReason: ''
    });

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'clientName':
                errorMessage = value.trim() === '' ? 'Client Name is required.' : '';
                break;
            case 'clientAddress':
                errorMessage = value.trim() === '' ? 'Client Address is required.' : '';
                break;
            case 'issuingAuthorityName':
                errorMessage = value.trim() === '' ? 'Issuing Authority Name is required.' : '';
                break;
            case 'clientGSTNumber':
                if (value.trim() === '') {
                    errorMessage = 'Client GST Number is required.';
                } else if (/\s/.test(value)) {
                    errorMessage = 'Client GST Number must not contain spaces.';
                }
                break;
            case 'clientPAN':
                if (value.trim() === '') {
                    errorMessage = 'Client PAN Number is required.';
                } else if (/\s/.test(value)) {
                    errorMessage = 'Client PAN  Number must not contain spaces.';
                }
                break;
            case 'billSubmittedAmount':
                if (value === '') {
                    errorMessage = 'Bill Submitted Amount is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = 'Bill Submitted Amount must be a positive number upto 2 decimal points.';
                }
                else if (finProgressDetailsObj.billPaymentReceived !== '' && (
                    Number(finProgressDetailsObj.billPaymentReceived) > Number(value)
                )) {
                    errorMessage = 'Bill Submitted Amount cannot be less than Bill Payment Received Amount';
                }
                break;
            case 'billPaymentReceived':
                if (value === '') {
                    errorMessage = 'Bill Payment Received is required.';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = 'Bill Payment Received must be a positive number upto 2 decimal points.';
                }
                else if (finProgressDetailsObj.billSubmittedAmount !== '' && (
                    Number(value) > Number(finProgressDetailsObj.billSubmittedAmount)
                )) {
                    errorMessage = 'Bill Payment Received Amount cannot be less than Bill Submitted Amount';
                }
                break;
            case 'amountVarianceReason':
                errorMessage = value.trim() === '' ? 'Amount Variance Reason is required.' : '';
                break;
            default:
                break;
        }
        setErrorTexts(prevErr => {
            return { ...prevErr, [name]: errorMessage }
        });
        return errorMessage === '';
    };

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setFinProgressDetailsObj({ ...finProgressDetailsObj, [name]: value });
        handleValidations(name, value);
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

    const getFinTrackingDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_FIN_TRACKING_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    if (res.data.data !== null) {
                        setFinProgressDetailsObj({
                            clientName: res.data.data.clientName || '',
                            clientAddress: res.data.data.clientAddress || '',
                            issuingAuthorityName: res.data.data.issuingAuthorityName || '',
                            clientGSTNumber: res.data.data.clientGSTNumber || '',
                            clientPAN: res.data.data.clientPAN || '',
                            billSubmittedAmount: res.data.data.billSubmittedAmount || '',
                            billPaymentReceived: res.data.data.billPaymentReceived || '',
                            amountVarianceReason: res.data.data.amountVarianceReason || ''
                        });
                    }
                }
                else {
                    console.log(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in getting deatils!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                console.log(error.data.message);
            }
            else {
                toastMessage.error("Error in getting deatils!!");
            }

        });
    }

    const saveFinTrackingProgressDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_FIN_TRACKING_PROGRESS}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, finProgressDetailsObj)
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
        Object.entries(finProgressDetailsObj).forEach(([key, value]) => {
            if (!handleValidations(key, value)) {
                isValid = false;
            }
        });

        if (isValid) {
            saveFinTrackingProgressDetails();
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title={props.isSetup === true ? 'Financial Tracking Setup' : 'Financial Track Progress'} />
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
                                <Divider>Financial Track Progress Details</Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    id="clientName"
                                    label="Client Name"
                                    name="clientName"
                                    value={finProgressDetailsObj.clientName}
                                    onChange={onHandleChange}
                                    error={errorTexts.clientName !== ''}
                                    helperText={errorTexts.clientName}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    id="clientGSTNumber"
                                    label="Client GST Number"
                                    name="clientGSTNumber"
                                    value={finProgressDetailsObj.clientGSTNumber}
                                    onChange={onHandleChange}
                                    error={errorTexts.clientGSTNumber !== ''}
                                    helperText={errorTexts.clientGSTNumber}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    id="clientPAN"
                                    label="Client PAN Number"
                                    name="clientPAN"
                                    value={finProgressDetailsObj.clientPAN}
                                    onChange={onHandleChange}
                                    error={errorTexts.clientPAN !== ''}
                                    helperText={errorTexts.clientPAN}
                                />
                            </Grid2>
                            <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    id="issuingAuthorityName"
                                    label="Issuing Authority Name"
                                    name="issuingAuthorityName"
                                    value={finProgressDetailsObj.issuingAuthorityName}
                                    onChange={onHandleChange}
                                    error={errorTexts.issuingAuthorityName !== ''}
                                    helperText={errorTexts.issuingAuthorityName}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 8, md: 9 }} />
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="clientAddress"
                                    label="Client Address"
                                    name="clientAddress"
                                    value={finProgressDetailsObj.clientAddress}
                                    onChange={onHandleChange}
                                    error={errorTexts.clientAddress !== ''}
                                    helperText={errorTexts.clientAddress}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    type="number"
                                    id="billSubmittedAmount"
                                    label="Bill Submitted Amount"
                                    name="billSubmittedAmount"
                                    value={finProgressDetailsObj.billSubmittedAmount}
                                    onChange={onHandleChange}
                                    error={errorTexts.billSubmittedAmount !== ''}
                                    helperText={errorTexts.billSubmittedAmount}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    type="number"
                                    id="billPaymentReceived"
                                    label="Bill Payment Received"
                                    name="billPaymentReceived"
                                    value={finProgressDetailsObj.billPaymentReceived}
                                    onChange={onHandleChange}
                                    error={errorTexts.billPaymentReceived !== ''}
                                    helperText={errorTexts.billPaymentReceived}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    required
                                    fullWidth
                                    type="number"
                                    id="billPaymentReceived"
                                    label="% of bills submitted vs received"
                                    name="billPaymentReceived"
                                    value={((Number(finProgressDetailsObj.billPaymentReceived) / Number(finProgressDetailsObj.billSubmittedAmount)) * 100).toFixed(2) || 0}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                />
                            </Grid2>
                            <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id="amountVarianceReason"
                                    label="Reason for Amount Variance"
                                    name="amountVarianceReason"
                                    value={finProgressDetailsObj.amountVarianceReason}
                                    onChange={onHandleChange}
                                    error={errorTexts.amountVarianceReason !== ''}
                                    helperText={errorTexts.amountVarianceReason}
                                />
                            </Grid2>
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
                        {props.isSetup ? "Save Financial Setup" : "Save Financial Progress"}
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Box >
    )
}