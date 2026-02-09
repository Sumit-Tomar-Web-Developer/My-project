import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Grid2,
    Stack,
    Paper,
    Chip,
    Button,
    Divider
} from "@mui/material";
import CustomPageTitle from "../../../Components/Common/CustomPageTitle";
import CustomButton from "../../../Components/Common/CustomButton";
import { API_STATUS } from "../../../Utils/Constants";
import { useToast } from "../../../Providers/ToastProvider";
import { uploadDocsApi, postRequest, getRequest } from "../../../AppApis/ApiFunctions";
import { API_URLS, TOOL_API_URL } from "../../../AppApis/APIUrls";
import { CloudUpload } from "@mui/icons-material";
import CustomTextField from "../../../Components/Common/CustomTextField";
import VisuallyHiddenInput from "../../../Components/Common/VisuallyHiddenInput";
import SaveIcon from '@mui/icons-material/Save';
import CustomMultipleFileUpload from "../../../Components/Common/CustomMultipleFileUpload";
import CustomFileDownload from "../../../Components/Common/CustomFileDownload";

export default function UpdateTenderDocs() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const { projectId } = useParams();

    const [basicDetailsObj, setBasicDetailsObj] = useState({
        tenderIdText: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const [uploadDocsDetailsObj, setUploadDocsDetailsObj] = useState({
        fileList: []
    });

    const [errorTexts, setErrorTexts] = useState({
        fileList: ""
    });

    useEffect(() => {
        getBasicDetails();
    }, []);

    const handleFileUnselect = (e, name) => {
        e.preventDefault();
        let currentFiles = [...uploadDocsDetailsObj.fileList];
        let updatedFileList = currentFiles.filter((file) => {
            return file.fileName !== name;
        });
        setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, fileList: updatedFileList });
    };

    const saveDocsDetails = () => {
        const baseTenderUrl = `/tenders/${projectId}/${API_URLS.POST.DA_DOC_UPLOAD}`;

        let uploadDataObj = {
            fileList: uploadDocsDetailsObj.fileList,
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

        if (uploadDocsDetailsObj.fileList.length > 0) {
            saveDocsDetails();
        }
        else {
            setErrorTexts({ fileList: "Please Select atleast One File." });
            toastMessage.error("Please Select atleast One File.");
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
        setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, fileList: sFiles.fileList });
        if (sFiles.fileList.length > 0) {
            setErrorTexts({
                ...errorTexts, fileList: ''
            })
        }
        else {
            setErrorTexts({
                ...errorTexts, fileList: 'Please Select atleast One File.'
            })
        }
    }

    return (
        <Box>
            <CustomPageTitle title="Upload Tender Documents" />
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
                                <Divider>Upload Tender Documents</Divider>
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomMultipleFileUpload
                                    buttonName="Select Tender Documents"
                                    errorText={errorTexts.fileList}
                                    projectID={projectId}
                                    saveUploadedFiles={saveUploadedFiles}
                                    fileList={uploadDocsDetailsObj.fileList}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                {uploadDocsDetailsObj.fileList.length > 0 && (
                                    uploadDocsDetailsObj.fileList.map((file) => (
                                        <CustomFileDownload
                                            key={file.fileName}
                                            guid={file.guid}
                                            isedit={true}
                                            fileName={file.fileName}
                                            projectID={projectId}
                                            handleFileUnselect={handleFileUnselect}
                                        />
                                    ))
                                )}
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
                                        Submit
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
