import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Grid2,
    Stack,
    Paper,
    Divider
} from "@mui/material";
import CustomPageTitle from "../../../Components/Common/CustomPageTitle";
import CustomButton from "../../../Components/Common/CustomButton";
import { API_STATUS } from "../../../Utils/Constants";
import { useToast } from "../../../Providers/ToastProvider";
import { postRequest, getRequest } from "../../../AppApis/ApiFunctions";
import { isValidDate } from "../../../Utils/UtilityFunctions";
import { API_URLS } from "../../../AppApis/APIUrls";
import CustomTextField from "../../../Components/Common/CustomTextField";
import SaveIcon from '@mui/icons-material/Save';
import CustomFileUpload from "../../../Components/Common/CustomFileUpload";
import CustomFileDownload from "../../../Components/Common/CustomFileDownload";

export default function DocumentSubmission() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const [uploadDocsDetailsObj, setUploadDocsDetailsObj] = useState({
        fileName: '',
        guid: '',
        openingDate: '',
    });

    const [errorTexts, setErrorTexts] = useState({
        fileName: '',
        openingDate: '',
    });

    useEffect(() => {
        getBasicDetails();
    }, []);

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case 'fileName':
                errorMessage = value.trim() === '' ? 'File is required.' : '';
                break;
            case 'openingDate':
                if (value.trim() === '') {
                    errorMessage = 'Tentative Opening Date is required.';
                } else if (!isValidDate(value)) {
                    errorMessage = 'Tentative Opening Date must be in YYYY-MM-DD format.';
                }
                break;
            default:
                break;
        }
        setErrorTexts(prevErr => {
            return { ...prevErr, [name]: errorMessage }
        });
        return errorMessage === '';
    };

    const handleFileUnselect = (e, name) => {
        e.preventDefault();
        setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, fileName: '', guid: '' });
    };

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'openingDate':
                setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, openingDate: value });
                handleValidations(name, value)
                break;
            default:
                break;
        }
    };

    const saveDocsDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.DA_DOC_SUBMISSION}`;

        let uploadDataObj = {
            fileName: uploadDocsDetailsObj.fileName,
            guid: uploadDocsDetailsObj.guid,
            openingDate: uploadDocsDetailsObj.openingDate
        }
        console.log('Saving data:', uploadDataObj);
        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, uploadDataObj)
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
    };

    const onHandleSave = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!handleValidations('fileName', uploadDocsDetailsObj.fileName)) {
            isValid = false;
        }

        if (!handleValidations('openingDate', uploadDocsDetailsObj.openingDate)) {
            isValid = false;
        }

        if (isValid) {
            saveDocsDetails();
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    const getBasicDetails = () => {
        let baseTenderUrl = `/tenders/${projectId}/${API_URLS.GET.GET_BASIC_DETAILS}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setBasicDetailsObj({
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

    const saveUploadedFiles = (sFiles) => {
        setUploadDocsDetailsObj({
            ...uploadDocsDetailsObj, fileName: sFiles.fileName,
            guid: sFiles.guid
        });
        if (sFiles.fileName !== "") {
            setErrorTexts({
                ...errorTexts, fileName: ''
            })
        }
        else {
            setErrorTexts({
                ...errorTexts, fileName: 'File is required'
            })
        }
    }

    return (
        <Box>
            <CustomPageTitle title="Document Submission" />
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                    <Paper elevation={3} sx={{ padding: "1rem" }}>
                        <Grid2 container size={{ xs: 12, sm: 12, md: 12 }} spacing={3}>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }} >
                                <CustomTextField
                                    isedit={false}
                                    size="small"
                                    fullWidth
                                    id="projectId"
                                    label="Project ID"
                                    name="projectId"
                                    value={projectId}
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
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Divider>Document Submission Details</Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                                <CustomTextField
                                    isedit={true}
                                    size="small"
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    type="date"
                                    id="openingDate"
                                    label="Tentative Opening Date"
                                    name="openingDate"
                                    value={uploadDocsDetailsObj.openingDate}
                                    onChange={onHandleChange}
                                    error={errorTexts.openingDate !== ''}
                                    helperText={errorTexts.openingDate}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack spacing={2} direction="row">
                                    <CustomFileUpload projectID={projectId} buttonName="Upload Receipt of Document Submission"
                                        saveUploadedFiles={saveUploadedFiles}
                                        errorText={errorTexts.fileName} />
                                    {uploadDocsDetailsObj.fileName !== '' && (
                                        <CustomFileDownload
                                            guid={uploadDocsDetailsObj.guid}
                                            isedit={true}
                                            fileName={uploadDocsDetailsObj.fileName}
                                            projectID={projectId}
                                            handleFileUnselect={handleFileUnselect}
                                        />
                                    )}
                                </Stack>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <CustomButton
                                        id="save_button"
                                        onClick={onHandleSave}
                                        variant="contained"
                                        sx={{
                                            marginLeft: "1rem"
                                        }}
                                        endIcon={<SaveIcon />}
                                        color="success"
                                        position="end"
                                        loading={isLoading}
                                    >
                                        Save
                                    </CustomButton>
                                </Stack>
                            </Grid2>
                        </Grid2>
                    </Paper>
                </Grid2>
            </Grid2>
        </Box >
    );
};
