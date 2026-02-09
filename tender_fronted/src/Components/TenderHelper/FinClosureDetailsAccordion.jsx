import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Grid2, MenuItem, Typography } from '@mui/material';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS, YES_NO_OPTIONS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { ExpandMore } from '@mui/icons-material';

export default function FinClosureDetailsAccordion({ projectID }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getFinClosureDetails();
    }, []);

    const [finClosureDetailsObj, setFinClosureDetailsObj] = useState({
        emdAmountReceived: '',
        sdAmountReceived: '',
        comments: '',
        updatedBy: '',
        updatedAt: ''
    });

    const getFinClosureDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_FIN_CLOSURE_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setFinClosureDetailsObj({
                        emdAmountReceived: res.data.data.emdAmountReceived || '',
                        sdAmountReceived: res.data.data.sdAmountReceived || '',
                        comments: res.data.data.comments || '',
                        updatedBy: res.data.data.updatedBy || '',
                        updatedAt: res.data.data.updatedAt || ''
                    });
                }
                else {
                    toastMessage.error("Error in getting deatils!!");
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

        }).finally(() => {
            setIsLoading(false);
        });
    }

    if (finClosureDetailsObj.emdAmountReceived === '' &&
        finClosureDetailsObj.sdAmountReceived === '' &&
        finClosureDetailsObj.comments === '') {
        return "";
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
                        Financial Closure Details
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
                                select
                                id="emdAmountReceived"
                                label="EMD Amount Received"
                                name="emdAmountReceived"
                                value={finClosureDetailsObj.emdAmountReceived}
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
                                select
                                id="sdAmountReceived"
                                label="SD Amount Received"
                                name="sdAmountReceived"
                                value={finClosureDetailsObj.sdAmountReceived}
                            >
                                {YES_NO_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4, md: 6 }}></Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                multiline
                                rows={3}
                                id="comments"
                                label="Comments"
                                name="comments"
                                value={finClosureDetailsObj.comments}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedBy"
                                label="Financial Closed By"
                                name="updatedBy"
                                value={finClosureDetailsObj.updatedBy}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedAt"
                                label="Financial Closed On"
                                name="updatedAt"
                                value={finClosureDetailsObj.updatedAt}
                            />
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

FinClosureDetailsAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};