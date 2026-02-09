import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Grid2, Typography } from '@mui/material';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { ExpandMore } from '@mui/icons-material';

export default function TenderApprovalAccordion({ projectID }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [approvalDetails, setApprovalDetailsObj] = useState({
        TechLeadApproval: '',
        TechLeadComments: '',
        TechLeadApprover: '',
        TechLeadApprovedAt: '',
        DirectorApproval: '',
        DirectorComments: '',
        DirectorApprover: '',
        DirectorApprovedAt: '',
    });

    useEffect(() => {
        getTenderApprovalDetails();
    }, []);

    const getTenderApprovalDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_TENDER_APPROVAL_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setApprovalDetailsObj({
                        TechLeadApproval: res.data.data.TechLeadApproval,
                        TechLeadComments: res.data.data.TechLeadComments,
                        TechLeadApprover: res.data.data.TechLeadApprover,
                        TechLeadApprovedAt: res.data.data.TechLeadApprovedAt,
                        DirectorApproval: res.data.data.DirectorApproval,
                        DirectorComments: res.data.data.DirectorComments,
                        DirectorApprover: res.data.data.DirectorApprover,
                        DirectorApprovedAt: res.data.data.DirectorApprovedAt
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

    if (approvalDetails.TechLeadApprover || approvalDetails.DirectorApprover) {
        return (
            <Accordion defaultExpanded disableGutters={true}>
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                    aria-controls="Project Status-content"
                    id="Project Status-header"
                    sx={(theme) => ({ bgcolor: theme.palette.secondary.main })}
                >
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }} >
                        Project Approval Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={2}>
                        {approvalDetails.TechLeadApprover && (
                            <>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }}>
                                        Tech Lead Approval Status
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        id="TechLeadApproval"
                                        label="Status"
                                        name="TechLeadApproval"
                                        value={approvalDetails.TechLeadApproval}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        id="TechLeadApprover"
                                        label={`${approvalDetails.TechLeadApproval} By`}
                                        name="TechLeadApprover"
                                        value={approvalDetails.TechLeadApprover}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        id="TechLeadApprovedAt"
                                        label={`${approvalDetails.TechLeadApproval} On`}
                                        name="TechLeadApprovedAt"
                                        value={approvalDetails.TechLeadApprovedAt}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        id="TechLeadComments"
                                        label={`${approvalDetails.TechLeadApproval} Comment`}
                                        name="TechLeadComments"
                                        value={approvalDetails.TechLeadComments}
                                    />
                                </Grid2>
                            </>
                        )}

                        {approvalDetails.DirectorApprover && (
                            <>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }}>
                                        Director Approval Status
                                    </Typography>
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        id="DirectorApproval"
                                        label="Status"
                                        name="DirectorApproval"
                                        value={approvalDetails.DirectorApproval}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        id="DirectorApprover"
                                        label={`${approvalDetails.DirectorApproval} By`}
                                        name="DirectorApprover"
                                        value={approvalDetails.DirectorApprover}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        id="DirectorApprovedAt"
                                        label={`${approvalDetails.DirectorApproval} On`}
                                        name="DirectorApprovedAt"
                                        value={approvalDetails.DirectorApprovedAt}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        id="DirectorComments"
                                        label={`${approvalDetails.DirectorApproval} Comment`}
                                        name="DirectorComments"
                                        value={approvalDetails.DirectorComments}
                                    />
                                </Grid2>
                            </>
                        )}
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
    else {
        return ('');
    }
}

TenderApprovalAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};