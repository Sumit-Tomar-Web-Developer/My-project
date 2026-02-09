import { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../../Providers/ToastProvider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid2 } from '@mui/material';
import { API_STATUS } from "../../../Utils/Constants";
import CustomButton from '../../../Components/Common/CustomButton';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { API_URLS } from '../../../AppApis/APIUrls';
import { isValidDate } from '../../../Utils/UtilityFunctions';
import { postRequest } from '../../../AppApis/ApiFunctions';
import CustomTextField from '../../../Components/Common/CustomTextField';


export default function AddCorrigendumDialog(props) {
    const { toastMessage } = useToast();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [isLoading, setIsLoading] = useState(false);
    const [corrigendumData, setCorrigendumData] = useState({
        corrigendumReceivedDate: '',
        changes: '',
        tenderExtendDate: ''
    })

    const [errorTexts, setErrorTexts] = useState({
        corrigendumReceivedDate: '',
        changes: '',
        tenderExtendDate: ''
    });

    useEffect(() => {
        setCorrigendumData({
            corrigendumReceivedDate: '',
            changes: '',
            tenderExtendDate: ''
        })
    }, [props.projectId]);

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case "corrigendumReceivedDate":
                if (value === '') {
                    errorMessage = 'Corrigendum Received Date is required.';
                } else if (!isValidDate(value)) {
                    errorMessage = 'Corrigendum Received Date must be in YYYY-MM-DD format.';
                }
                break;
            case "changes":
                errorMessage = value.trim() ? "" : "Changes are required.";
                break;
            case "tenderExtendDate":
                if (value === '') {
                    errorMessage = 'Tender Extend Date is required.';
                } else if (!isValidDate(value)) {
                    errorMessage = 'Tender Extend Date must be in YYYY-MM-DD format.';
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

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setCorrigendumData({ ...corrigendumData, [name]: value });
        handleValidations(name, value);
    };

    const saveCorrigendumData = (e) => {
        const baseTenderUrl = `/tenders/${props.projectId}/${API_URLS.POST.SAVE_CORRIGENDUM}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, corrigendumData)
            .then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        toastMessage.success(res.data.message);
                        props.handleClose(e, true);
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

    const onhandleSave = (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate all fields in corrigendumData
        Object.keys(corrigendumData).forEach((key) => {
            if (!handleValidations(key, corrigendumData[key])) {
                isValid = false;
            }
        });

        if (isValid) {
            saveCorrigendumData(e);
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    return (
        <Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                aria-labelledby="add-dialog-title"
            >
                <DialogTitle id="add-dialog-title">
                    Add Corrigendum
                </DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={2} marginTop={2}>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={true}
                                size="small"
                                required
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                type="date"
                                id="corrigendumReceivedDate"
                                label="Corrigendum Received Date"
                                name="corrigendumReceivedDate"
                                value={corrigendumData.corrigendumReceivedDate}
                                onChange={onHandleChange}
                                error={errorTexts.corrigendumReceivedDate !== ''}
                                helperText={errorTexts.corrigendumReceivedDate}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={true}
                                size="small"
                                required
                                fullWidth
                                slotProps={{ inputLabel: { shrink: true } }}
                                type="date"
                                id="tenderExtendDate"
                                label="Tender Extend Date"
                                name="tenderExtendDate"
                                value={corrigendumData.tenderExtendDate}
                                onChange={onHandleChange}
                                error={errorTexts.tenderExtendDate !== ''}
                                helperText={errorTexts.tenderExtendDate}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={true}
                                size="small"
                                fullWidth
                                id="changes"
                                label="Changes"
                                name="changes"
                                multiline
                                rows={4}
                                value={corrigendumData.changes}
                                onChange={onHandleChange}
                                error={errorTexts.changes !== ''}
                                helperText={errorTexts.changes}
                            />
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions >
                    <CustomButton onClick={props.handleClose} variant='contained' color='error'
                        position="end"
                        endIcon={<CloseIcon small="size" color="white" />}
                    >
                        Close
                    </CustomButton>
                    <CustomButton loading={isLoading}
                        position="end"
                        endIcon={<SaveIcon small="size" color="white" />} onClick={onhandleSave}
                        variant='contained' color='success'>
                        Save
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

AddCorrigendumDialog.prototype = {
    open: PropTypes.bool.isRequired,
    projectId: PropTypes.number.isRequired,
    handleClose: PropTypes.func.isRequired
}