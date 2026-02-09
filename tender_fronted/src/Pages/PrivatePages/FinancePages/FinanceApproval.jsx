import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid2, MenuItem, Stack, Typography } from '@mui/material';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS } from '../../../AppApis/APIUrls';
import { getRequest, postRequest } from '../../../AppApis/ApiFunctions';
import { API_STATUS, PAYMENT_MODES } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import CustomAccordion from '../../../Components/Common/CustomAccordion';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';
import StampDetailsAccordion from '../../../Components/TenderHelper/StampDetailsAccordion';
import EmdFeeAccordion from '../../../Components/TenderHelper/EmdFeeAccordion';
import TenderFeeAccordion from '../../../Components/TenderHelper/TenderFeeAccordion';
import SaveIcon from '@mui/icons-material/Save';
import CustomFileUpload from '../../../Components/Common/CustomFileUpload';
import CustomFileDownload from '../../../Components/Common/CustomFileDownload';


export default function FinanceApproval() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: '',
        paymentMode: '',
    });

    const [uploadDocsDetailsObj, setUploadDocsDetailsObj] = useState({
        paymentReceiptFileName: '',
        paymentReceiptGuid: '',
        offlinePaymentDetails: '',
        UTRNumber: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        paymentReceiptFileName: '',
        paymentReceiptGuid: '',
        offlinePaymentDetails: '',
        UTRNumber: ''
    });

    useEffect(() => {
        getBasicDetails();
    }, []);


    const handleValidations = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'paymentReceiptFileName':
                errorMessage = value.trim() === '' ? 'File is required.' : '';
                break;
            case 'offlinePaymentDetails':
                errorMessage = value.trim() === '' ? 'OfflinePayment Details is required.' : '';
                break;
            case 'UTRNumber':
                if (value.trim() === '') {
                    errorMessage = 'UTR No is required.';
                } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                    errorMessage = 'UTR No must be alphanumeric.';
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


    const handleFileUnselect = (e, name) => {
        e.preventDefault();
        setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, paymentReceiptFileName: '', paymentReceiptGuid: '' });
    };

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'offlinePaymentDetails':
                setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, offlinePaymentDetails: value });
                handleValidations(name, value)
                break;
            case 'UTRNumber':
                setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, UTRNumber: value });
                handleValidations(name, value)
                break;
            default:
                break;
        }
    };

    const saveDocsDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_FA_APPROVAL}`;

        let uploadDataObj = {
            paymentReceiptGuid: uploadDocsDetailsObj.paymentReceiptGuid,
            paymentReceiptFileName: uploadDocsDetailsObj.paymentReceiptFileName,
            offlinePaymentDetails: uploadDocsDetailsObj.offlinePaymentDetails,
            UTRNumber: uploadDocsDetailsObj.UTRNumber
        }
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

    const onhandleSave = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!handleValidations('paymentReceiptFileName', uploadDocsDetailsObj.paymentReceiptFileName)) {
            isValid = false;
        }
        
        if (basicDetailsObj.paymentMode !== 'Online' && !handleValidations('offlinePaymentDetails', uploadDocsDetailsObj.offlinePaymentDetails)) {
            isValid = false;
        }

        if (!handleValidations('UTRNumber', uploadDocsDetailsObj.UTRNumber)) {
            isValid = false;
        }

        if (isValid) {
            saveDocsDetails();
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
                        paymentMode: res.data.data.paymentMode || '',
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

    const saveUploadedFiles = (sFiles) => {
        setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, paymentReceiptFileName: sFiles.fileName, paymentReceiptGuid: sFiles.guid });
        if (sFiles.fileName !== "") {
            setErrorTexts({
                ...errorTexts, paymentReceiptFileName: ''
            })
        }
        else {
            setErrorTexts({
                ...errorTexts, paymentReceiptFileName: 'File is required'
            })
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Finance Approval' />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <CustomAccordion
                        isedit={false}
                        panelIndex={0}
                        handleSaveLater={() => { }}
                        handleBackClick={() => { }}
                        isLoading={isLoading}
                    >
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
                        </Grid2>
                    </CustomAccordion>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <TenderFeeAccordion
                        key={2}
                        panelIndex={2}
                        isedit={false}
                        projectID={projectId}
                        handlePanelChange={() => { }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <EmdFeeAccordion
                        key={3}
                        panelIndex={3}
                        isedit={false}
                        projectID={projectId}
                        handlePanelChange={() => { }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <StampDetailsAccordion
                        key={6}
                        panelIndex={6}
                        isedit={false}
                        projectID={projectId}
                        handlePanelChange={() => { }}
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <Accordion expanded={true} disableGutters={true}>
                        <AccordionSummary
                            aria-controls="Mode of Payment-content"
                            id="Mode of Payment-header"
                            sx={(theme) => ({ bgcolor: theme.palette.secondary.main })}
                        >
                            <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }} >
                                Mode of Payment
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ marginTop: 1 }}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        select
                                        fullWidth
                                        id="paymentMode"
                                        label="Payment Mode"
                                        name="paymentMode"
                                        value={basicDetailsObj.paymentMode}
                                    >
                                        {PAYMENT_MODES.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </CustomTextField>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                    <CustomTextField
                                        isedit={true}
                                        size="small"
                                        fullWidth
                                        id="UTRNumber"
                                        label="UTR No"
                                        name="UTRNumber"
                                        value={uploadDocsDetailsObj.UTRNumber}
                                        onChange={onHandleChange}
                                        error={errorTexts.UTRNumber !== ''}
                                        helperText={errorTexts.UTRNumber}
                                    />
                                </Grid2>
                                {basicDetailsObj.paymentMode !== 'Online' &&
                                    <Grid2 size={{ xs: 12, sm: 8, md: 9 }}>
                                        <CustomTextField
                                            isedit={true}
                                            size="small"
                                            fullWidth
                                            id="offlinePaymentDetails"
                                            label="Offline Payment Details"
                                            name="offlinePaymentDetails"
                                            value={uploadDocsDetailsObj.offlinePaymentDetails}
                                            onChange={onHandleChange}
                                            error={errorTexts.offlinePaymentDetails !== ''}
                                            helperText={errorTexts.offlinePaymentDetails}
                                        />
                                    </Grid2>
                                }
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <Accordion expanded={true} disableGutters={true}>
                        <AccordionSummary
                            aria-controls="Upload Document-content"
                            id="Upload Document-header"
                            sx={(theme) => ({ bgcolor: theme.palette.secondary.main })}
                        >
                            <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }} >
                                Upload Receipt
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ marginTop: 1 }}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                    <Stack spacing={2} direction="row">
                                        <CustomFileUpload
                                            projectID={projectId}
                                            buttonName="Select Receipt File"
                                            saveUploadedFiles={saveUploadedFiles}
                                            errorText={errorTexts.paymentReceiptFileName}
                                        />
                                        {uploadDocsDetailsObj.paymentReceiptFileName !== '' && (
                                            <CustomFileDownload
                                                guid={uploadDocsDetailsObj.paymentReceiptGuid}
                                                isedit={true}
                                                fileName={uploadDocsDetailsObj.paymentReceiptFileName}
                                                projectID={projectId}
                                                handleFileUnselect={handleFileUnselect}
                                            />
                                        )}
                                    </Stack>
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <CustomButton
                        variant="contained"
                        endIcon={<SaveIcon />}
                        onClick={onhandleSave}
                        color="success"
                        loading={isLoading}
                    >
                        Save
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Box >
    )
}