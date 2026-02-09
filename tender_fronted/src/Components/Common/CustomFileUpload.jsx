import { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid2, Button, FormControl, FormHelperText } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useToast } from '../../Providers/ToastProvider';
import { API_STATUS } from '../../Utils/Constants';
import { uploadDocsApi } from '../../AppApis/ApiFunctions';
import VisuallyHiddenInput from '../Common/VisuallyHiddenInput';

export default function CustomFileUpload(props) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleFilesUpload = (e) => {
        if (e.target.files.length > 0) {
            saveUploadDocsDetails(e.target.files[0]);
        }
        else {
            props.saveUploadedFiles({ fileName: '', guid: '' });
        }
    };

    const saveUploadDocsDetails = (fileObj) => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('file', fileObj)

        uploadDocsApi(formData, props.projectID)
            .then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        props.saveUploadedFiles({
                            fileName: fileObj.name, guid: res.data.data.guid
                        });
                    } else {
                        props.saveUploadedFiles({ fileName: '', guid: '' });
                        toastMessage.error(res.data.message);
                    }
                } else {
                    props.saveUploadedFiles({ fileName: '', guid: '' });
                    toastMessage.error('Error in saving data!');
                }
            })
            .catch((error) => {
                props.saveUploadedFiles({ fileName: '', guid: '' });
                if (error.data && error.data.message) {
                    toastMessage.error(error.data.message);
                } else {
                    toastMessage.error('Error in saving data!');
                }
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    return (
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
                    onChange={handleFilesUpload}
                    onClick={(e) => { e.target.value = null }} // this is done to allow same file to be selected again
                />
            </Button>
            {props.errorText !== '' && (
                <FormHelperText error={props.errorText !== ''}>
                    {props.errorText}
                </FormHelperText>)}
        </FormControl>
    );
}

CustomFileUpload.propTypes = {
    projectID: PropTypes.number.isRequired,
    buttonName: PropTypes.string.isRequired,
    saveUploadedFiles: PropTypes.func.isRequired,
    isError: PropTypes.bool.isRequired
};