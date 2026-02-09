import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid2, Stepper, Step, StepLabel, Typography, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CustomPageTitle from '../../../../Components/Common/CustomPageTitle';
import BasicDetailsAccordion from '../../../../Components/TenderHelper/BasicDetailsAccordion';
import CoverDetailsAccordion from '../../../../Components/TenderHelper/CoverDetailsAccordion';
import TenderFeeAccordion from '../../../../Components/TenderHelper/TenderFeeAccordion';
import EmdFeeAccordion from '../../../../Components/TenderHelper/EmdFeeAccordion';
import WorkItemAccordion from '../../../../Components/TenderHelper/WorkItemAccordion';
import CriticalDatesAccordion from '../../../../Components/TenderHelper/CriticalDatesAccordion';
import StampDetailsAccordion from '../../../../Components/TenderHelper/StampDetailsAccordion';
import EligibilityCriteriaAccordion from '../../../../Components/TenderHelper/EligibilityCriteriaAccordion';
import AdditionalDetailsAccordion from '../../../../Components/TenderHelper/AdditionalDetailsAccordion';
import UploadDocsAccordion from '../../../../Components/TenderHelper/UploadDocsAccordion';
import CustomButton from '../../../../Components/Common/CustomButton';
import { API_URLS } from '../../../../AppApis/APIUrls';
import { useAuth } from '../../../../Providers/AuthProvider';
import { useToast } from '../../../../Providers/ToastProvider';
import { postRequest } from '../../../../AppApis/ApiFunctions';
import { API_STATUS, USER_ROLES } from '../../../../Utils/Constants';
import PdfViewComponent from '../../../../Components/TenderHelper/PdfViewComponent';

export default function EditTender() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();
    const { user } = useAuth();
    const { projectId } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [projectID, setProjectID] = useState(projectId || null);

    useEffect(() => {
        if (projectId) {
            setProjectID(projectId);
        }
    }, [projectId]);

    const handlePanelChange = (panelIndex) => {
        console.log(panelIndex);
        setExpandedIndex(panelIndex);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.role === USER_ROLES.DIRECTOR.id || user.role === USER_ROLES.TECH_TEAM.id) {
            toastMessage.success("Tender Details Saved Successfully!!");
            navigate('/dashboard');
        }
        else if (user.role === USER_ROLES.DATA_APPLICANT.id) {
            let baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SUBMIT_TENDER}`;
            setIsLoading(true);
            postRequest(baseTenderUrl, {}).then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        toastMessage.success(res.data.message);
                        navigate('/dashboard');
                    }
                    else {
                        toastMessage.error(res.data.message);
                    }
                }
                else {
                    toastMessage.error("Error in saving data!!");
                }
            }).catch((error) => {
                if (error.data && error.data.message) {
                    toastMessage.error(error.data.message);
                }
                else {
                    toastMessage.error("Error in saving data!!");
                }
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }

    const accordions = [
        { component: BasicDetailsAccordion, panelIndex: 0, title: 'Basic Details' },
        { component: CoverDetailsAccordion, panelIndex: 1, title: 'Cover Details' },
        { component: TenderFeeAccordion, panelIndex: 2, title: 'Tender Fee Details' },
        { component: EmdFeeAccordion, panelIndex: 3, title: 'EMD Fee Details' },
        { component: WorkItemAccordion, panelIndex: 4, title: 'Work/Item Details' },
        { component: CriticalDatesAccordion, panelIndex: 5, title: 'Critical Dates' },
        { component: StampDetailsAccordion, panelIndex: 6, title: 'Stamp Details' },
        { component: EligibilityCriteriaAccordion, panelIndex: 7, title: 'Eligibility Criteria' },
        { component: AdditionalDetailsAccordion, panelIndex: 8, title: 'Additional Details' },
        { component: UploadDocsAccordion, panelIndex: 9, title: 'Upload Documents' },
    ];

    const getViewPdfComponent = () => {
        return (
            <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ position: 'sticky', top: 60 }}>
                <PdfViewComponent isedit={true}
                    projectID={projectID} />
            </Grid2>
        )
    }

    const getViewFormComponent = () => {
        // In view/preview mode, render all accordions 
        return accordions.map(({ component: AccordionComponent, panelIndex }) => (
            <Grid2 key={panelIndex} size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                <AccordionComponent
                    key={panelIndex}
                    panelIndex={panelIndex}
                    isedit={false}
                    projectID={projectID}
                    handlePanelChange={handlePanelChange}
                />
            </Grid2>
        ))
    }

    const getViewComponent = () => {
        return (
            <Grid2 container size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Grid2 size={{ xs: 12, sm: 12, md: 7, lg: 7 }}>
                    {getViewFormComponent()}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 5, lg: 5 }} >
                    {getViewPdfComponent()}
                </Grid2>
            </Grid2>
        )
    }

    const getEditComponent = () => {
        // In edit mode, render only the expanded accordion
        return accordions
            .filter(({ panelIndex }) => panelIndex === expandedIndex)
            .map(({ component: AccordionComponent, panelIndex }) => (
                <AccordionComponent
                    key={panelIndex}
                    panelIndex={panelIndex}
                    isedit={true}
                    projectID={projectID}
                    handlePanelChange={handlePanelChange}
                />
            ))
    }

    const getComponentByMode = () => {
        if (expandedIndex === accordions.length) {
            // In preview mode, render all accordions  
            return getViewComponent()
        }
        else {
            if (user.role === USER_ROLES.DIRECTOR.id || user.role === USER_ROLES.TECH_TEAM.id) {
                return (
                    <Grid2 container size={{ xs: 12, sm: 12, md: 9, lg: 10 }}>
                        <Grid2 size={{ xs: 12, sm: 12, md: 7, lg: 7 }}>
                            {getEditComponent()}
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 12, md: 5, lg: 5 }}>
                            {getViewPdfComponent()}
                        </Grid2>
                    </Grid2>
                )
            }
            else if (user.role === USER_ROLES.DATA_APPLICANT.id) {
                // In edit mode, render only the expanded accordion
                return (
                    <Grid2 size={{ xs: 12, sm: 12, md: 9, lg: 10 }} paddingBottom={2}>
                        {getEditComponent()}
                    </Grid2 >
                )
            }

        }
    }

    const getPreviewButtons = () => {
        if (expandedIndex === accordions.length) {
            return (
                <Grid2 paddingTop={1} size={{ xs: 12, sm: 12, md: 12, lg: 12 }} >
                    <Stack direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}>
                        <CustomButton onClick={(e) => handlePanelChange(expandedIndex - 1)}
                            variant='contained' color='error'
                            position="end"
                            endIcon={<CloseIcon small="size" color="white" />}
                        >
                            Cancel
                        </CustomButton>
                        < CustomButton onClick={handleSubmit}
                            variant='contained' color='success'
                            position="end"
                            loading={isLoading}
                            endIcon={<SaveIcon small="size" color="white" />}
                        >
                            Submit
                        </CustomButton>
                    </Stack>
                </Grid2>
            )
        }
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title={expandedIndex === accordions.length ? 'Pre-View Project' : 'Edit Project'} />
                </Grid2>
                <Grid2 sx={{ display: { xs: 'none', md: 'block' } }} size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
                    {getPreviewButtons()}
                </Grid2>
                {/* List of Accordion Titles */}
                {expandedIndex !== accordions.length && (
                    <Grid2 sx={{ display: { xs: 'none', md: 'block' } }} size={{ xs: 0, sm: 0, md: 3, lg: 2 }}>
                        <Stepper activeStep={expandedIndex} orientation="vertical">
                            {accordions.map(({ title, panelIndex }) => (
                                <Step key={panelIndex}
                                    sx={{
                                        '& .MuiStepIcon-root.Mui-completed': {
                                            color: (theme) => theme.palette.success.main, // circle color (COMPLETED)
                                        },
                                    }}>
                                    <StepLabel>{title}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid2>
                )}

                {expandedIndex === accordions.length && (
                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                        <Typography color='error'>
                            NOTE: Please click 'SUBMIT' after verifying all the details are correct, else click 'CANCEL' to edit
                        </Typography>
                    </Grid2>
                )}

                {/* Accordion Content */}
                {getComponentByMode()}

                {getPreviewButtons()}
            </Grid2>
        </Box >
    )
}