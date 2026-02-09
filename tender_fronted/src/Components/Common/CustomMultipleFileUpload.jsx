import { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid2, Button, FormControl, FormHelperText } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useToast } from '../../Providers/ToastProvider';
import { API_STATUS } from '../../Utils/Constants';
import { uploadDocsApi } from '../../AppApis/ApiFunctions';
import VisuallyHiddenInput from '../Common/VisuallyHiddenInput';

export default function CustomMultipleFileUpload(props) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleFilesUpload = (e) => {
        setIsLoading(true);

        let updatedFileList = [...props.fileList];
        let uploadfiles = e.target.files;
        let requestList = []
        for (const uploadfile of Object.values(uploadfiles)) {
            let fileIndex = updatedFileList.findIndex((f) => f.fileName === uploadfile.name);
            if (fileIndex > -1) {
                updatedFileList.splice(fileIndex, 1);
            }
            let formData = new FormData();
            formData.append('file', uploadfile);
            requestList.push(uploadDocsApi(formData, props.projectID));
        }
        if (uploadfiles.length > 0) {
            Promise.all(requestList)
                .then(async (resList) => {
                    for (let i = 0; i < resList.length; i++) {
                        let res = resList[i];
                        if (res.data) {
                            if (res.data.type === API_STATUS.SUCCESS) {
                                updatedFileList.push({
                                    fileName: uploadfiles[i].name,
                                    guid: res.data.data.guid
                                });
                            }
                        }
                    }
                    props.saveUploadedFiles({ fileList: updatedFileList });
                })
                .catch(error => {
                    console.log(error);
                    toastMessage.error("Failed to upload files.");
                    props.saveUploadedFiles({ fileList: updatedFileList });
                }).finally(() => {
                    setIsLoading(false);
                });
        }
        else {
            props.saveUploadedFiles({ fileList: updatedFileList });
        }
    };

    return (
        <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
            <FormControl>
                <Button
                    loading={isLoading}
                    component="label"
                    variant="contained"
                    color={props.errorText !== '' ? 'error' : 'primary'}
                    startIcon={<CloudUpload />}
                >
                    {props.buttonName}
                    <VisuallyHiddenInput
                        type="file"
                        accept=".pdf"
                        multiple
                        onChange={handleFilesUpload}
                        onClick={(e) => { e.target.value = null }} // this is done to allow same file to be selected again
                    />
                </Button>
                {props.errorText !== '' && (
                    <FormHelperText error={props.errorText !== ''}>
                        {props.errorText}
                    </FormHelperText>)}
            </FormControl>
        </Grid2>
    );
}

CustomMultipleFileUpload.propTypes = {
    projectID: PropTypes.number.isRequired,
    buttonName: PropTypes.string.isRequired,
    saveUploadedFiles: PropTypes.func.isRequired,
    isError: PropTypes.bool.isRequired,
    fileList: PropTypes.array.isRequired,
};