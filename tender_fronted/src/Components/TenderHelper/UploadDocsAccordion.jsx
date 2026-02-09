import { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid2, Typography } from '@mui/material';
import CustomAccordion from '../Common/CustomAccordion';
import { useToast } from '../../Providers/ToastProvider';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';
import CustomFileDownload from '../Common/CustomFileDownload';
import CustomMultipleFileUpload from "../Common/CustomMultipleFileUpload";

export default function UploadDocsAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [uploadDocsDetailsObj, setUploadDocsDetailsObj] = useState({
        fileList: [],
        govtLink: ''
    });

    const [errorTexts, setErrorTexts] = useState({
        fileList: '',
        govtLink: '',
    });

    useEffect(() => {
        getDocsDetails();
    }, []);

    const handleValidations = () => {
        let errorMessage = '';
        if (uploadDocsDetailsObj.fileList.length === 0) {
            errorMessage = 'Please Select atleast One Tender Document.';
        }
        else if(uploadDocsDetailsObj.govtLink === ''){
            errorMessage = 'Please enter the Goverment site link.';
        }
        setErrorTexts({ ...errorTexts, fileList: errorMessage });
        return errorMessage === '';
    };

    const handleFileUnselect = (e, name) => {
        e.preventDefault();
        let currentFiles = [...uploadDocsDetailsObj.fileList];
        let updatedFileList = currentFiles.filter((file) => {
            return file.fileName !== name;
        });
        setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, fileList: updatedFileList });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUploadDocsDetailsObj({ ...uploadDocsDetailsObj, [name]: value });
    };

    const getDocsDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_DOCS_DETAILS}`;
        setIsLoading(true);

        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setUploadDocsDetailsObj({
                        fileList: res.data.data.fileList || [],
                        govtLink: res.data.data.govtLink || ''
                    });
                } else {
                    toastMessage.error(res.data.message);
                }
            } else {
                toastMessage.error('Error in fetching data!');
            }
        }).catch((error) => {
            // To handle if data is not saved yet and user is trying to edit the data
            if (isedit && error.status === 404) {
                return;
            }

            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error('Error in fetching data!');
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const saveDocsDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_DOCS_DETAILS}`;

        let uploadDataObj = {
            fileList: uploadDocsDetailsObj.fileList,
            govtLink: uploadDocsDetailsObj.govtLink
        }
        console.log('Saving data:', uploadDataObj);
        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, uploadDataObj)
            .then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        toastMessage.success(res.data.message);
                        handlePanelChange(panelIndex + 1);
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

    const handleSaveLater = (e) => {
        e.preventDefault();

        // Perform validation
        if (handleValidations()) {
            saveDocsDetails();
            return;

        }
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        handlePanelChange(panelIndex - 1);
    };

    const saveUploadedFiles = (sFiles) => {
        if (sFiles.fileList.length > 5) {
            setErrorTexts({
                ...errorTexts, fileList: 'Max 5 files are only allowed!!'
            })
            return;
        }

        setUploadDocsDetailsObj({
            ...uploadDocsDetailsObj, fileList: sFiles.fileList
        });
        if (sFiles.fileList.length > 0) {
            setErrorTexts({
                ...errorTexts, fileList: ''
            })
        }
        else {
            setErrorTexts({
                ...errorTexts, fileList: 'Please Select atleast One Tender File.'
            })
        }
    }

    return (
        <CustomAccordion
            isedit={isedit}
            panelIndex={panelIndex}
            handleSaveLater={handleSaveLater}
            handleBackClick={handleBackClick}
            isLoading={isLoading}
        >
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 8, md: 9 }}>
                    <CustomTextField
                        isedit={isedit}
                        size="small"
                        required
                        fullWidth
                        id="govtLink"
                        label="Gov Site Link"
                        name="govtLink"
                        value={uploadDocsDetailsObj.govtLink}
                        onChange={handleChange}
                        error={errorTexts.govtLink !== ''}
                        helperText={errorTexts.govtLink}
                    />
                </Grid2>
                {isedit && (
                    <Fragment>
                        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomMultipleFileUpload
                                    buttonName="Select Tender Documents"
                                    errorText={errorTexts.fileList}
                                    projectID={projectID}
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
                                            isedit={isedit}
                                            fileName={file.fileName}
                                            projectID={projectID}
                                            handleFileUnselect={handleFileUnselect}
                                        />
                                    ))
                                )}
                            </Grid2>
                    </Fragment>
                )}
            </Grid2>

            {!isedit && (
                <Fragment>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12 }} mt={2}>
                        <Typography variant="subtitle2"> Tender Documents :</Typography>
                    </Grid2>
                    {uploadDocsDetailsObj.fileList.length === 0 && <Typography variant="subtitle2"> NO FILES UPLOADED</Typography>}
                    {uploadDocsDetailsObj.fileList.length > 0 &&
                        uploadDocsDetailsObj.fileList.map((file, index) => (
                            <Grid2 key={index} size={{ xs: 12, sm: 12, md: 12 }}>
                                <CustomFileDownload guid={file.guid} isedit={false}
                                    fileName={file.fileName} projectID={projectID} />
                            </Grid2>
                        )
                    )}
                </Fragment>
            )}
        </CustomAccordion>
    );
}

UploadDocsAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};