import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Grid2, Stack, Typography } from '@mui/material';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { ExpandMore } from '@mui/icons-material';
import CustomFileDownload from '../Common/CustomFileDownload';

export default function FinanceApprovalAccordion({ projectID }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [approvalDetailsObj, setApprovalDetailsObj] = useState({
        paymentReceiptFileName: '',
        paymentReceiptGuid: '',
        offlinePaymentDetails: '',
        UTRNumber: '',
        updatedBy: '',
        updatedAt: ''
    });

    useEffect(() => {
        getFinanceApprovalDetails();
    }, []);

    const getFinanceApprovalDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_BASIC_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setApprovalDetailsObj({
                        paymentReceiptFileName: res.data.data.paymentReceiptFileName || '',
                        paymentReceiptGuid: res.data.data.paymentReceiptGuid || '',
                        offlinePaymentDetails: res.data.data.offlinePaymentDetails || '',
                        UTRNumber: res.data.data.UTRNumber || '',
                        updatedBy: res.data.data.updatedBy || '',
                        updatedAt: res.data.data.updatedAt || ''
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
            if (error.status === 404) {
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

    if (approvalDetailsObj.paymentReceiptFileName === '' &&
        approvalDetailsObj.offlinePaymentDetails === '' &&
        approvalDetailsObj.UTRNumber === '') {
        return ''; // Return null if no data is available
    }
    else {
        return (
            <Accordion defaultExpanded disableGutters={true}>
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                    aria-controls=" Finance Payment -content"
                    id=" Finance Payment -header"
                    sx={(theme) => ({ bgcolor: theme.palette.secondary.main })}
                >
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }} >
                        Finance Payment Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="UTRNumber"
                                label="UTR No"
                                name="UTRNumber"
                                value={approvalDetailsObj.UTRNumber}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 8, md: 9 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="offlinePaymentDetails"
                                label="Offline Payment Details"
                                name="offlinePaymentDetails"
                                value={approvalDetailsObj.offlinePaymentDetails}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Stack direction="row" spacing={1} alignItems={"center"}>
                                <Typography variant="subtitle2" gutterBottom> Payment Receipt :</Typography>
                                {approvalDetailsObj.paymentReceiptFileName === '' ? 'NO FILES UPLOADED' : (
                                    <CustomFileDownload guid={approvalDetailsObj.paymentReceiptGuid} isedit={false}
                                        fileName={approvalDetailsObj.paymentReceiptFileName} projectID={projectID} />
                                )}
                            </Stack>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedBy"
                                label="Updated By"
                                name="updatedBy"
                                value={approvalDetailsObj.updatedBy}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedAt"
                                label="Updated On"
                                name="updatedAt"
                                value={approvalDetailsObj.updatedAt}
                            />
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

FinanceApprovalAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};