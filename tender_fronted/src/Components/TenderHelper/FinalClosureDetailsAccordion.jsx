import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Grid2, Typography, CircularProgress, Box } from '@mui/material';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { ExpandMore } from '@mui/icons-material';

export default function FinalClosureDetailsAccordion({ projectID }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getFinalClosureDetails();
    }, []);

    const [finalClosureDetailsObj, setFinalClosureDetailsObj] = useState({
        closureRemark: '',
        lessonsLearnt: '',
        updatedBy: '',
        updatedAt: ''
    });

    const getFinalClosureDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_FINAL_CLOSURE_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setFinalClosureDetailsObj({
                        closureRemark: res.data.data.closureRemark || '',
                        lessonsLearnt: res.data.data.lessonsLearnt || '',
                        updatedBy: res.data.data.updatedBy || '',
                        updatedAt: res.data.data.updatedAt
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

    if(isLoading){
        <Fragment>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        </Fragment>
    }
    else if (finalClosureDetailsObj.closureRemark === '' &&
        finalClosureDetailsObj.lessonsLearnt === '') {
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
                        Project Closure Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                multiline
                                rows={3}
                                id="closureRemark"
                                label="Closure Remark"
                                name="closureRemark"
                                value={finalClosureDetailsObj.closureRemark}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                multiline
                                rows={3}
                                id="lessonsLearnt"
                                label="Lessons Learned"
                                name="lessonsLearnt"
                                value={finalClosureDetailsObj.lessonsLearnt}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedBy"
                                label="Project Closed By"
                                name="updatedBy"
                                value={finalClosureDetailsObj.updatedBy}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedAt"
                                label="Project Closed On"
                                name="updatedAt"
                                value={finalClosureDetailsObj.updatedAt}
                            />
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

FinalClosureDetailsAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};