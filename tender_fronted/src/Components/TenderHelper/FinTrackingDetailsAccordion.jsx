import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Grid2, InputAdornment, Typography } from '@mui/material';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { ExpandMore } from '@mui/icons-material';

export default function FinTrackingDetailsAccordion({ projectID }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getFinTrackingDetails();
    }, []);

    const [finProgressDetailsObj, setFinProgressDetailsObj] = useState({
        clientName: '',
        clientAddress: '',
        issuingAuthorityName: '',
        clientGSTNumber: '',
        clientPAN: '',
        billSubmittedAmount: '',
        billPaymentReceived: '',
        amountVarianceReason: '',
        updatedBy: '',
        updatedAt: ''
    });

    const getFinTrackingDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_FIN_TRACKING_DETAILS}`;
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
                            amountVarianceReason: res.data.data.amountVarianceReason || '',
                            updatedBy: res.data.data.updatedBy || '',
                            updatedAt: res.data.data.updatedAt || ''
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


    if (finProgressDetailsObj.clientName === '' &&
        finProgressDetailsObj.clientAddress === '' &&
        finProgressDetailsObj.issuingAuthorityName === '' &&
        finProgressDetailsObj.clientGSTNumber === '' &&
        finProgressDetailsObj.clientPAN === '' &&
        finProgressDetailsObj.billSubmittedAmount === '' &&
        finProgressDetailsObj.billPaymentReceived === '' &&
        finProgressDetailsObj.amountVarianceReason === '') {
        return ""; // No data to display
    }
    else {
        return (
            <Accordion defaultExpanded disableGutters={true}>
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                    aria-controls="Document Submission Receipt -content"
                    id="Document Submission Receipt-header"
                    sx={(theme) => ({ bgcolor: theme.palette.secondary.main })}
                >
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }} >
                        Financial Tracking Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="clientName"
                                label="Client Name"
                                name="clientName"
                                value={finProgressDetailsObj.clientName}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="clientGSTNumber"
                                label="Client GST Number"
                                name="clientGSTNumber"
                                value={finProgressDetailsObj.clientGSTNumber}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="clientPAN"
                                label="Client PAN Number"
                                name="clientPAN"
                                value={finProgressDetailsObj.clientPAN}
                            />
                        </Grid2>
                        <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="issuingAuthorityName"
                                label="Issuing Authority Name"
                                name="issuingAuthorityName"
                                value={finProgressDetailsObj.issuingAuthorityName}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 8, md: 9 }} />
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                multiline
                                rows={3}
                                id="clientAddress"
                                label="Client Address"
                                name="clientAddress"
                                value={finProgressDetailsObj.clientAddress}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                type="number"
                                id="billSubmittedAmount"
                                label="Bill Submitted Amount"
                                name="billSubmittedAmount"
                                value={finProgressDetailsObj.billSubmittedAmount}
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
                                label="Bill Payment Received"
                                name="billPaymentReceived"
                                value={finProgressDetailsObj.billPaymentReceived}
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
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                multiline
                                rows={2}
                                id="amountVarianceReason"
                                label="Reason for Amount Variance"
                                name="amountVarianceReason"
                                value={finProgressDetailsObj.amountVarianceReason}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedBy"
                                label="Tracking Updated By"
                                name="updatedBy"
                                value={finProgressDetailsObj.updatedBy}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedAt"
                                label="Tracking Updated On"
                                name="updatedAt"
                                value={finProgressDetailsObj.updatedAt}
                            />
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

FinTrackingDetailsAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};