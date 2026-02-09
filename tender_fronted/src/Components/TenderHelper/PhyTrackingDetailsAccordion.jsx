import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Grid2, InputAdornment, Typography, Box,
    Stack, CircularProgress } from '@mui/material';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import { ExpandMore } from '@mui/icons-material';
import CircularProgressWithLabel from '../Common/CircularProgressWithLabel';
import CustomFileDownload from '../Common/CustomFileDownload';

export default function PhyTrackingDetailsAccordion({ projectID }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getPhyTrackingDetails();
    }, []);

    const [phySetupDetailsObj, setPhySetupDetailsObj] = useState({
        physicalTrackingSetUp: []
    });

    const [phyProgressDetailsObj, setPhyProgressDetailsObj] = useState({
        physicalTrackingProgress: [],
        fileName: '',
        guid: '',
        updatedBy: '',
        updatedAt: ''
    });

    const getPhyTrackingDetails = () => {
        setIsLoading(true);
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_PHY_TRACKING_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    let physicalTrackingSetUp = res.data.data.physicalTrackingSetUp || [];
                    let physicalTrackingProgress = res.data.data.physicalTrackingProgress || [];
                    let fileName = res.data.data.fileName || '';
                    let guid = res.data.data.guid || '';
                    let updatedAt = res.data.data.updatedAt || '';
                    let updatedBy = res.data.data.updatedBy || '';
                    for (let i = 0; i < physicalTrackingSetUp.length; i++) {
                        if (physicalTrackingSetUp.length !== physicalTrackingProgress.length) {
                            physicalTrackingProgress.push({ fieldValue: 0 });
                        }
                    }

                    setPhyProgressDetailsObj({ physicalTrackingProgress: physicalTrackingProgress, fileName: fileName, guid: guid,  updatedAt, updatedBy });
                    setPhySetupDetailsObj({ physicalTrackingSetUp: physicalTrackingSetUp });
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
        }).finally(() => {
            setIsLoading(false);
        })
    }

    if(isLoading){
        <Fragment>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        </Fragment>
    }
    else if (phySetupDetailsObj.physicalTrackingSetUp.length === 0) {
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
                        Physical Tracking Details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={2}>
                        {phySetupDetailsObj.physicalTrackingSetUp.map((phyObj, index) => (
                            <Fragment key={index}>
                                <Grid2 size={{ xs: 12, sm: 3, md: 3 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        required
                                        fullWidth
                                        id="fieldValue"
                                        label={phyObj.fieldName}
                                        name="fieldValue"
                                        value={phyProgressDetailsObj.physicalTrackingProgress[index].fieldValue}
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">{phyObj.measureUnit}</InputAdornment>,
                                            },
                                        }}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 3, md: 3 }}>
                                    <CustomTextField
                                        isedit={false}
                                        size="small"
                                        required
                                        fullWidth
                                        type="number"
                                        id="targetValue"
                                        label="Target Value"
                                        name="targetValue"
                                        value={phyObj.targetValue}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                                    <CircularProgressWithLabel
                                        value={phyProgressDetailsObj.physicalTrackingProgress[index].fieldValue ?
                                            (phyProgressDetailsObj.physicalTrackingProgress[index].fieldValue / phyObj.targetValue) * 100 : 0} />
                                </Grid2>
                            </Fragment>
                        ))}
                        {phyProgressDetailsObj.fileName !== '' && (
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack direction="row" spacing={1} alignItems={"center"}>
                                    <Typography variant="subtitle2" gutterBottom> Work Completion Certificate :</Typography>
                                    {phyProgressDetailsObj.fileName === '' ? 'NO FILES UPLOADED' : (
                                        <CustomFileDownload guid={phyProgressDetailsObj.guid} isedit={false}
                                            fileName={phyProgressDetailsObj.fileName} projectID={projectID} />
                                    )}
                                </Stack>
                            </Grid2>
                        )}
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedBy"
                                label="Tracking Updated By"
                                name="updatedBy"
                                value={phyProgressDetailsObj.updatedBy}
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
                                value={phyProgressDetailsObj.updatedAt}
                            />
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

PhyTrackingDetailsAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};