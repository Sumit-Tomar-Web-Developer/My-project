import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid2 } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CustomTextField from '../../../Components/Common/CustomTextField';
import { API_URLS } from '../../../AppApis/APIUrls';
import { getRequest, postRequest, TLAuthorizeTenderApi } from '../../../AppApis/ApiFunctions';
import { API_STATUS } from '../../../Utils/Constants';
import { useToast } from '../../../Providers/ToastProvider';
import { formatDateForInput } from '../../../Utils/UtilityFunctions';
import CustomAccordion from '../../../Components/Common/CustomAccordion';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';
import CustomButton from '../../../Components/Common/CustomButton';
import DATenderDocsAccordion from '../../../Components/TenderHelper/DATenderDocsAccordion';


export default function TechTenderApproval() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    useEffect(() => {
        getBasicDetails();
        getCriticalDatesDetails();
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderId: '',
        tenderIdText: ''
    })

    const [criticalDatesDetailsObj, setCriticalDatesDetailsObj] = useState({
        submissionStartDate: '',
        submissionEndDate: '',
        downloadStartDate: '',
        downloadEndDate: '',
    })

    const handleApprove = (e) => {
        e.preventDefault();

        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.SAVE_TL_AUTHORIZE}`;
        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, {})
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

        setIsLoading(true);
    }

    const getBasicDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_BASIC_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setBasicDetailsObj({
                        tenderId: projectId,
                        tenderIdText: res.data.data.tenderIdText || ''
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

    const getCriticalDatesDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_CRITICAL_DATES}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setCriticalDatesDetailsObj({
                        downloadStartDate: formatDateForInput(res.data.data.downloadStartDate),
                        downloadEndDate: formatDateForInput(res.data.data.downloadEndDate),
                        submissionStartDate: formatDateForInput(res.data.data.submissionStartDate),
                        submissionEndDate: formatDateForInput(res.data.data.submissionEndDate),
                    });
                } else {
                    toastMessage.error(res.data.message);
                }
            } else {
                toastMessage.error('Error in fetching data!!');
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            } else {
                toastMessage.error('Error in fetching data!!');
            };
        });
    };

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Project Approval' />
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
                                    id="tenderId"
                                    label="Project ID"
                                    name="tenderId"
                                    value={basicDetailsObj.tenderId}
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
                    <CustomAccordion
                        isedit={false}
                        panelIndex={5}
                        handleSaveLater={() => { }}
                        handleBackClick={() => { }}
                        isLoading={isLoading}
                    >
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="submissionStartDate"
                                    label="Bid Submission Start Date"
                                    name="submissionStartDate"
                                    value={criticalDatesDetailsObj.submissionStartDate}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="submissionEndDate"
                                    label="Bid Submission End Date"
                                    name="submissionEndDate"
                                    value={criticalDatesDetailsObj.submissionEndDate}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="downloadStartDate"
                                    label="Document Download Start Date"
                                    name="downloadStartDate"
                                    value={criticalDatesDetailsObj.downloadStartDate}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    required
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="downloadEndDate"
                                    label="Document Download End Date"
                                    name="downloadEndDate"
                                    value={criticalDatesDetailsObj.downloadEndDate}
                                />
                            </Grid2>
                        </Grid2>
                    </CustomAccordion>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                    <DATenderDocsAccordion projectID={projectId} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <CustomButton
                        variant="contained"
                        startIcon={<DoneAllIcon />}
                        onClick={handleApprove}
                        color="success"
                        loading={isLoading}
                    >
                        I Authorize
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Box >
    )
}