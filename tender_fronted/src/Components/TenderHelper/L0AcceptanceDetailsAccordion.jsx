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

export default function L0AcceptanceDetailsAccordion({ projectID }) {
    const { toastMessage } = useToast();
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

    useEffect(() => {
        getL0AcceptanceDetails();
    }, []);

    const getL0AcceptanceDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_L0_ACCEPTANCE_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setLZeroDetailsObj({
                        BGNumber: res.data.data.BGNumber || '',
                        BGFileName: res.data.data.BGFileName || '',
                        BGguid: res.data.data.BGguid || '',
                        BGAmount: res.data.data.BGAmount || '',
                        serialNumber: res.data.data.serialNumber || '',
                        dateOfIssue: formatDateForInput(res.data.data.dateOfIssue) || '',
                        dateOfExpiry: formatDateForInput(res.data.data.dateOfExpiry) || '',
                        dateOfClaimMax: formatDateForInput(res.data.data.dateOfClaimMax) || '',
                        nameAddressOfApplicant: res.data.data.nameAddressOfApplicant || '',
                        isAddBGRequired: res.data.data.isAddBGRequired,
                        addBGAmount: res.data.data.addBGAmount || '',
                        addBGguid: res.data.data.addBGguid || '',
                        addBGFileName: res.data.data.addBGFileName || '',
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

    if (lZeroDetailsObj.updatedAt === '' && lZeroDetailsObj.updatedBy === '') {
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
                        L0 Acceptance Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="BGNumber"
                                label="Bank Gurantee No"
                                name="BGNumber"
                                value={lZeroDetailsObj.BGNumber}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 9 }}>
                            <Stack direction="row" spacing={1} alignItems={"center"}>
                                <Typography variant="subtitle2" gutterBottom>Uploaded Bank Gurantee Format :</Typography>
                                {lZeroDetailsObj.BGFileName === '' ? 'NO FILES UPLOADED' : (
                                    <CustomFileDownload guid={lZeroDetailsObj.BGguid} isedit={false}
                                        fileName={lZeroDetailsObj.BGFileName} projectID={projectID} />
                                )}
                            </Stack>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="BGAmount"
                                label="BG Amount"
                                name="BGAmount"
                                value={lZeroDetailsObj.BGAmount}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="serialNumber"
                                label="Numbering Sheet Serial Number"
                                name="serialNumber"
                                value={lZeroDetailsObj.serialNumber}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 6 }} />
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                type="date"
                                id="dateOfIssue"
                                label="Date of Issue"
                                name="dateOfIssue"
                                value={lZeroDetailsObj.dateOfIssue}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                type="date"
                                id="dateOfExpiry"
                                label="BG Expiry Date"
                                name="dateOfExpiry"
                                value={lZeroDetailsObj.dateOfExpiry}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                type="date"
                                id="dateOfClaimMax"
                                label="Claim Period Available up to"
                                name="dateOfClaimMax"
                                value={lZeroDetailsObj.dateOfClaimMax}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="nameAddressOfApplicant"
                                label="Name & Address of Applicant"
                                name="nameAddressOfApplicant"
                                multiline
                                rows={4}
                                value={lZeroDetailsObj.nameAddressOfApplicant}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                select
                                fullWidth
                                id="isAddBGRequired"
                                label="Is Additional BG Required"
                                name="isAddBGRequired"
                                value={lZeroDetailsObj.isAddBGRequired}
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
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        id="addBGAmount"
                                        label="Additional BG amount"
                                        name="addBGAmount"
                                        value={lZeroDetailsObj.addBGAmount}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 9 }}>
                                    <Stack direction="row" spacing={1} alignItems={"center"}>
                                        <Typography variant="subtitle2" gutterBottom>Uploaded Additional Bank Gurantee Format :</Typography>
                                        {lZeroDetailsObj.addBGFileName === '' ? 'NO FILES UPLOADED' : (
                                            <CustomFileDownload guid={lZeroDetailsObj.addBGguid} isedit={false}
                                                fileName={lZeroDetailsObj.addBGFileName} projectID={projectID} />
                                        )}
                                    </Stack>
                                </Grid2>
                            </>
                        )}
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

L0AcceptanceDetailsAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};