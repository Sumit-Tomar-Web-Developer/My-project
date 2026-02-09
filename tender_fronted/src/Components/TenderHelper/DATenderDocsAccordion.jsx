import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../Providers/ToastProvider';
import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid2, Typography } from '@mui/material';
import { API_URLS, TOOL_API_URL } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getRequest } from '../../AppApis/ApiFunctions';
import { ExpandMore } from '@mui/icons-material';
import CustomTextField from '../Common/CustomTextField';
import CustomFileDownload from '../Common/CustomFileDownload';

export default function DATenderDocsAccordion({ projectID }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [uploadDocsDetailsObj, setUploadDocsDetailsObj] = useState({
        fileList: [],
        updatedBy: '',
        updatedAt: ''
    });

    useEffect(() => {
        getDaUploadedDocsDetails();
    }, []);

    const getDaUploadedDocsDetails = () => {
        let baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_DA_UPLOADED_DOCS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setUploadDocsDetailsObj({
                        fileList: res.data.data.fileList || [],
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

    if (uploadDocsDetailsObj.fileList.length === 0) {
        return "";
    }
    else {
        return (
            <Accordion defaultExpanded disableGutters={true}>
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'white' }} />}
                    aria-controls=" Finance Payment -content"
                    id=" Finance Payment -header"
                    sx={(theme) => ({ bgcolor: theme.palette.secondary.main })}
                >
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }} >
                        DA Uploaded Tender Documents
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: 1 }}>
                    <Grid2 container spacing={1}>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                            <Typography variant="subtitle2"> Tender Documents :</Typography>
                        </Grid2>
                        {uploadDocsDetailsObj.fileList.length === 0 && 'NO FILES UPLOADED'}
                        {uploadDocsDetailsObj.fileList.length > 0 &&
                            uploadDocsDetailsObj.fileList.map((file, index) => (
                                <Grid2 key={index} size={{ xs: 12, sm: 12, md: 12 }}>
                                    <CustomFileDownload guid={file.guid} isedit={false}
                                        fileName={file.fileName} projectID={projectID} />
                                </Grid2>
                            )
                            )}
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedBy"
                                label="Document Uploaded By"
                                name="updatedBy"
                                value={uploadDocsDetailsObj.updatedBy}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <CustomTextField
                                isedit={false}
                                size="small"
                                required
                                fullWidth
                                id="updatedAt"
                                label="Document Uploaded On"
                                name="updatedAt"
                                value={uploadDocsDetailsObj.updatedAt}
                            />
                        </Grid2>
                    </Grid2>
                </AccordionDetails>
            </Accordion>
        );
    }
}

DATenderDocsAccordion.propTypes = {
    projectID: PropTypes.number.isRequired
};