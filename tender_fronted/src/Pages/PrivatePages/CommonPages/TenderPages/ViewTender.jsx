import { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid2, Stack } from '@mui/material';
import { useToast } from '../../../../Providers/ToastProvider';
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
import TenderApprovalAccordion from '../../../../Components/TenderHelper/TenderApprovalAccordion';
import FinanceApprovalAccordion from '../../../../Components/TenderHelper/FinanceApprovalAccordion';
import DATenderDocsAccordion from '../../../../Components/TenderHelper/DATenderDocsAccordion';
import DADocSubmittedAccordion from '../../../../Components/TenderHelper/DADocSubmittedAccordion';
import SelectionDetailsAccordion from '../../../../Components/TenderHelper/SelectionDetailsAccordion';
import L1ApprovalDetailsAccordion from '../../../../Components/TenderHelper/L1ApprovalDetailsAccordion';
import PhyTrackingDetailsAccordion from '../../../../Components/TenderHelper/PhyTrackingDetailsAccordion';
import FinTrackingDetailsAccordion from '../../../../Components/TenderHelper/FinTrackingDetailsAccordion';
import FinClosureDetailsAccordion from '../../../../Components/TenderHelper/FinClosureDetailsAccordion';
import FinalClosureDetailsAccordion from '../../../../Components/TenderHelper/FinalClosureDetailsAccordion';
import { API_STATUS, TENDER_STATUS } from '../../../../Utils/Constants';
import { API_URLS } from '../../../../AppApis/APIUrls';
import { getRequest } from '../../../../AppApis/ApiFunctions';
import { getTenderStatusName } from '../../../../Utils/UtilityFunctions';
import L0AcceptanceDetailsAccordion from '../../../../Components/TenderHelper/L0AcceptanceDetailsAccordion';

export default function ViewTender() {
    const { projectId } = useParams();
    const { toastMessage } = useToast();
    const [projectID, setProjectID] = useState(projectId || null);
    const [tenderStatus, setTenderStatus] = useState('');

    useEffect(() => {
        if (projectId) {
            setProjectID(projectId);
            getTenderStatusDetails();
        }
    }, [projectId]);

    const getTenderStatusDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_TENDER_STATUS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setTenderStatus(res.data.data.currentStatus || TENDER_STATUS.Draft.id);
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

        });
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

    const handlePanelChange = (panelIndex) => {
        console.log(`Panel changed to: ${panelIndex}`);
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
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    {getViewFormComponent()}
                    {tenderStatus >= TENDER_STATUS.TechnicalApprovalDone.id &&
                        <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                            <TenderApprovalAccordion projectID={projectID} />
                        </Grid2>
                    }
                    {(tenderStatus !== TENDER_STATUS.TechnicalRejectDone.id && tenderStatus !== TENDER_STATUS.DirectorRejectDone.id) && (
                        <Fragment>
                            {tenderStatus >= TENDER_STATUS.FinanceApprovalDone.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <FinanceApprovalAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.PhysicalDocumentUploaded.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <DATenderDocsAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.PhysicalDocumentUploaded.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <DADocSubmittedAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.L1ApprovalReceived.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <SelectionDetailsAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.L0Acceptance.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <L0AcceptanceDetailsAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.L1ApprovalDone.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <L1ApprovalDetailsAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.TrackingInProgress.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <PhyTrackingDetailsAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.TrackingInProgress.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <FinTrackingDetailsAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.FinancialClosed.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <FinClosureDetailsAccordion projectID={projectID} />
                                </Grid2>
                            }
                            {tenderStatus >= TENDER_STATUS.ProjectCompleted.id &&
                                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }} paddingBottom={2}>
                                    <FinalClosureDetailsAccordion projectID={projectID} />
                                </Grid2>
                            }
                        </Fragment>
                    )}
                </Grid2>
            </Grid2>
        )
    }

    return (
        <Box>
            <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    <Stack spacing={1} direction={"row"}>
                        <CustomPageTitle title='View Project' />
                        <CustomPageTitle title={`(${getTenderStatusName(tenderStatus) || ''})`} />
                    </Stack>
                </Grid2>

                {/* Accordion Content */}
                {getViewComponent()}

            </Grid2>
        </Box >
    )
}