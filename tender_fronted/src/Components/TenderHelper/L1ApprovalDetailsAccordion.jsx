import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Grid2, MenuItem, Stack, Typography } from '@mui/material';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, YES_NO_OPTIONS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { ExpandMore } from '@mui/icons-material';
import { formatDateForInput } from '../../Utils/UtilityFunctions';
import CustomFileDownload from '../Common/CustomFileDownload';

export default function L1ApprovalDetailsAccordion({ projectID }) {
    const { toastMessage } = useToast();
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
        workOrderGuid: '',
        updatedBy: '',
        updatedAt: ''
    });


    useEffect(() => {
        getL1ApprovalDetails();
    }, []);

    const getL1ApprovalDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_L1_APPROVAL_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setL1ApprovalDetailsObj({
                        loiReceived: res.data.data.loiReceived || '',
                        workOrderCost: res.data.data.workOrderCost || '',
                        securityDepositAmount: res.data.data.securityDepositAmount || '',
                        completedByDate: res.data.data.completedByDate ? formatDateForInput(res.data.data.completedByDate) : '',
                        agreementStampRequired: res.data.data.agreementStampRequired || '',
                        stampDutyAmount: res.data.data.stampDutyAmount || '',
                        registrationFees: res.data.data.registrationFees || '',
                        physicalStampRequired: res.data.data.physicalStampRequired || '',
                        numOfStampsRequired: res.data.data.numOfStampsRequired || '',
                        eSBTRRequired: res.data.data.eSBTRRequired || '',
                        panNo: res.data.data.panNo || '',
                        gstNo: res.data.data.gstNo || '',
                        otherPartyName: res.data.data.otherPartyName || '',
                        otherDutyPayerId: res.data.data.otherDutyPayerId || '',
                        l1FileName: res.data.data.l1FileName || '',
                        l1Guid: res.data.data.l1Guid || '',
                        loiFileName: res.data.data.loiFileName || '',
                        loiGuid: res.data.data.loiGuid || '',
                        agreementFileName: res.data.data.agreementFileName || '',
                        agreementGuid: res.data.data.agreementGuid || '',
                        workOrderFileName: res.data.data.workOrderFileName || '',
                        workOrderGuid: res.data.data.workOrderGuid || '',
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

    if (l1ApprovalDetailsObj.l1FileName === '' &&
        l1ApprovalDetailsObj.loiFileName === '' &&
        l1ApprovalDetailsObj.agreementFileName === '' &&
        l1ApprovalDetailsObj.workOrderFileName === '') {
        return ""; // Return null if no data is available
    }
    else {
        return (
            <Accordion defaultExpanded disableGutters={true}>
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                    aria-controls="L1 Approval -content"
                    id="L1 Approval-header"
                    sx={(theme) => ({ bgcolor: theme.palette.secondary.main })}
                >
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }} >
                        L1 Approval Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                select
                                required
                                fullWidth
                                id="loiReceived"
                                label="LOI Received"
                                name="loiReceived"
                                value={l1ApprovalDetailsObj.loiReceived}
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
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                type="number"
                                id="workOrderCost"
                                label="Work Order Cost"
                                name="workOrderCost"
                                value={l1ApprovalDetailsObj.workOrderCost}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                type="number"
                                id="securityDepositAmount"
                                label="Security Deposit"
                                name="securityDepositAmount"
                                value={l1ApprovalDetailsObj.securityDepositAmount}
                            />
                        </Grid2>
                        <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                select
                                required
                                fullWidth
                                id="agreementStampRequired"
                                label="Agreement Stamp Required"
                                name="agreementStampRequired"
                                value={l1ApprovalDetailsObj.agreementStampRequired}
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
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                type="number"
                                id="stampDutyAmount"
                                label="Stamp Duty Amount"
                                name="stampDutyAmount"
                                value={l1ApprovalDetailsObj.stampDutyAmount}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                type="date"
                                id="completedByDate"
                                label="Completed By Date"
                                name="completedByDate"
                                value={l1ApprovalDetailsObj.completedByDate}
                            />
                        </Grid2>
                        <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                select
                                required
                                fullWidth
                                id="physicalStampRequired"
                                label="Physical Stamp Required"
                                name="physicalStampRequired"
                                value={l1ApprovalDetailsObj.physicalStampRequired}
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
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                type="number"
                                id="numOfStampsRequired"
                                label="Number Of Stamps Required"
                                name="numOfStampsRequired"
                                value={l1ApprovalDetailsObj.numOfStampsRequired}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                type="number"
                                id="registrationFees"
                                label="Registration Fees"
                                name="registrationFees"
                                value={l1ApprovalDetailsObj.registrationFees}
                            />
                        </Grid2>
                        <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                select
                                required
                                fullWidth
                                id="eSBTRRequired"
                                label="e-SBTR Required"
                                name="eSBTRRequired"
                                value={l1ApprovalDetailsObj.eSBTRRequired}
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
                                    isedit={false}
                                    size="small"
                                    required
                                    fullWidth
                                    id="panNo"
                                    label="PAN Number"
                                    name="panNo"
                                    value={l1ApprovalDetailsObj.panNo}
                                />
                            )}
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            {l1ApprovalDetailsObj.eSBTRRequired === YES_NO_OPTIONS[0].value && (
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    required
                                    fullWidth
                                    id="gstNo"
                                    label="GST Number"
                                    name="gstNo"
                                    value={l1ApprovalDetailsObj.gstNo}
                                />
                            )}
                        </Grid2>
                        <Grid2 size={{ md: 3 }} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}></Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 9 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="otherPartyName"
                                label="Other Party Name"
                                name="otherPartyName"
                                value={l1ApprovalDetailsObj.otherPartyName}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 9 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="otherDutyPayerId"
                                label="Other Duty Payer ID"
                                name="otherDutyPayerId"
                                value={l1ApprovalDetailsObj.otherDutyPayerId}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Stack direction="row" spacing={1} alignItems={"center"}>
                                <Typography variant="subtitle2" gutterBottom>L1 Document :</Typography>
                                {l1ApprovalDetailsObj.l1FileName === '' ? 'NO FILES UPLOADED' : (
                                    <CustomFileDownload guid={l1ApprovalDetailsObj.l1Guid} isedit={false}
                                        fileName={l1ApprovalDetailsObj.l1FileName} projectID={projectID} />
                                )}
                            </Stack>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Stack direction="row" spacing={1} alignItems={"center"}>
                                <Typography variant="subtitle2" gutterBottom>LOI Document :</Typography>
                                {l1ApprovalDetailsObj.loiFileName === '' ? 'NO FILES UPLOADED' : (
                                    <CustomFileDownload guid={l1ApprovalDetailsObj.loiGuid} isedit={false}
                                        fileName={l1ApprovalDetailsObj.loiFileName} projectID={projectID} />
                                )}
                            </Stack>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Stack direction="row" spacing={1} alignItems={"center"}>
                                <Typography variant="subtitle2" gutterBottom>Agreement Document :</Typography>
                                {l1ApprovalDetailsObj.agreementFileName === '' ? 'NO FILES UPLOADED' : (
                                    <CustomFileDownload guid={l1ApprovalDetailsObj.agreementGuid} isedit={false}
                                        fileName={l1ApprovalDetailsObj.agreementFileName} projectID={projectID} />
                                )}
                            </Stack>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Stack direction="row" spacing={1} alignItems={"center"}>
                                <Typography variant="subtitle2" gutterBottom>Work Order Document :</Typography>
                                {l1ApprovalDetailsObj.workOrderFileName === '' ? 'NO FILES UPLOADED' : (
                                    <CustomFileDownload guid={l1ApprovalDetailsObj.workOrderGuid} isedit={false}
                                        fileName={l1ApprovalDetailsObj.workOrderFileName} projectID={projectID} />
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
                                label="L1 Approval By"
                                name="updatedBy"
                                value={l1ApprovalDetailsObj.updatedBy}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedAt"
                                label="L1 Approval On"
                                name="updatedAt"
                                value={l1ApprovalDetailsObj.updatedAt}
                            />
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

L1ApprovalDetailsAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};