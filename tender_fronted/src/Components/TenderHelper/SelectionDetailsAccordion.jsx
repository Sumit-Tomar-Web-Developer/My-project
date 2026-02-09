import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Grid2, MenuItem, Typography } from '@mui/material';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, TENDER_GOV_STATUS, YES_NO_OPTIONS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { ExpandMore } from '@mui/icons-material';

export default function SelectionDetailsAccordion({ projectID }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [tenderDetailsObj, setTenderDetailsObj] = useState({
        govStatus: '',
        technicalSelected: '',
        financialSelected: '',
        tenderAllocatedCompany: '',
        remarks: '',
        updatedBy: '',
        updatedAt: ''
    });


    useEffect(() => {
        getSelectionDetails();
    }, []);

    const getSelectionDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_SELECTION_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setTenderDetailsObj({
                        govStatus: res.data.data.govStatus || '',
                        technicalSelected: res.data.data.technicalSelected || '',
                        financialSelected: res.data.data.financialSelected || '',
                        tenderAllocatedCompany: res.data.data.tenderAllocatedCompany || '',
                        remarks: res.data.data.remarks || '',
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

    if (tenderDetailsObj.govStatus === '' && tenderDetailsObj.technicalSelected === '' &&
        tenderDetailsObj.financialSelected === '' && tenderDetailsObj.tenderAllocatedCompany === '' &&
        tenderDetailsObj.remarks === '') {
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
                        Tender Status Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                select
                                fullWidth
                                id="govStatus"
                                label="Govt Status"
                                name="govStatus"
                                value={tenderDetailsObj.govStatus}
                            >
                                {TENDER_GOV_STATUS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                select
                                fullWidth
                                id="technicalSelected"
                                label="Technical Selected"
                                name="technicalSelected"
                                value={tenderDetailsObj.technicalSelected}
                            >
                                {YES_NO_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                select
                                fullWidth
                                id="financialSelected"
                                label="Financial Selected"
                                name="financialSelected"
                                value={tenderDetailsObj.financialSelected}
                            >
                                {YES_NO_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="tenderAllocatedCompany"
                                label="Company Name to which Tender Allocated"
                                name="tenderAllocatedCompany"
                                value={tenderDetailsObj.tenderAllocatedCompany}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                fullWidth
                                id="remarks"
                                label="Remarks"
                                name="remarks"
                                multiline
                                rows={4}
                                value={tenderDetailsObj.remarks}
                            />
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
                                value={tenderDetailsObj.updatedBy}
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
                                value={tenderDetailsObj.updatedAt}
                            />
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

SelectionDetailsAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};