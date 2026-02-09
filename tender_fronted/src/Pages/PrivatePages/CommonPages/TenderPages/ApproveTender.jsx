import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Grid2, Stepper, Step, StepLabel, Typography, Stack, StepIcon } from '@mui/material';
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
import { useAuth } from '../../../../Providers/AuthProvider';
import { TENDER_APPROVAL_STATUS, USER_ROLES } from '../../../../Utils/Constants';
import PdfViewComponent from '../../../../Components/TenderHelper/PdfViewComponent';
import TenderApproveRejectDialog from '../../../../Components/TenderHelper/TenderApproveRejectDialog';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import TenderApprovalAccordion from '../../../../Components/TenderHelper/TenderApprovalAccordion';


export default function ApproveTender() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { projectId } = useParams();

    const [isOpen, setIsOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [projectID, setProjectID] = useState(projectId || null);

    useEffect(() => {
        if (projectId) {
            setProjectID(projectId);
        }
    }, [projectId]);

    const handlePanelChange = (panelIndex) => {
        console.log(panelIndex);
    };

    const handleReject = (e) => {
        e.preventDefault();
        setActionType(TENDER_APPROVAL_STATUS.REJECTED.name);
        setIsOpen(true);
    }

    const handleApprove = (e) => {
        e.preventDefault();
        setActionType(TENDER_APPROVAL_STATUS.APPROVED.name);
        setIsOpen(true);
    }

    const handleClose = (e, isRedirect) => {
        e.preventDefault();
        setIsOpen(false);
        setActionType('');
        if (isRedirect === true) {
            navigate('/dashboard');
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
                <PdfViewComponent isedit={false}
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
                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                        <TenderApprovalAccordion projectID={projectID} />
                    </Grid2>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 12, md: 5, lg: 5 }} >
                    {getViewPdfComponent()}
                </Grid2>
            </Grid2>
        )
    }

    const getPreviewButtons = () => {
        if (user.role === USER_ROLES.DIRECTOR.id || user.role === USER_ROLES.TECH_TEAM.id) {
            return (
                <Grid2 paddingTop={1} size={{ xs: 12, sm: 12, md: 12, lg: 12 }} >
                    <Stack direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}>
                        <CustomButton onClick={handleReject}
                            variant='contained' color='error'
                            position="end"
                            endIcon={<RemoveDoneIcon small="size" color="white" />}
                        >
                            REJECT
                        </CustomButton>
                        < CustomButton onClick={handleApprove}
                            variant='contained' color='success'
                            position="end"
                            endIcon={<DoneAllIcon small="size" color="white" />}
                        >
                            APPROVE
                        </CustomButton>
                    </Stack>
                </Grid2>)
        }
    }

    return (
        <Box>
            {isOpen && <TenderApproveRejectDialog open={isOpen} projectId={projectId} actionType={actionType} handleClose={handleClose} />}
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                    <CustomPageTitle title='Project Approval' />
                </Grid2>
                <Grid2 sx={{ display: { xs: 'none', md: 'block' } }} size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
                    {getPreviewButtons()}
                </Grid2>

                {/* Accordion Content */}
                {getViewComponent()}

                {getPreviewButtons()}
            </Grid2>
        </Box >
    )
}