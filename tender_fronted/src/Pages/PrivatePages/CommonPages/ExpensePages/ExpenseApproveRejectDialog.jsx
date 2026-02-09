import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import { useToast } from '../../../../Providers/ToastProvider';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid2, TextField } from '@mui/material';
import { API_STATUS, TENDER_APPROVAL_STATUS } from "../../../../Utils/Constants";
import { submitExpenseActionApi } from "../../../../AppApis/ApiFunctions";
// import CustomButton from '../../../../Common/CustomButton';
import CloseIcon from '@mui/icons-material/Close';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CustomButton from '../../../../Components/Common/CustomButton';
import { getUserActionName } from '../../../../Utils/UtilityFunctions';

export default function ExpenseApproveRejectDialog(props) {
    const { toastMessage } = useToast();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState("");

    const [errors, setErrors] = useState({
        reason: "",
    });

    const validateField = (field, value) => {
        switch (field) {
            case "reason":
                return value ? "" : "Reason is required.";
            default:
                return "";
        }
    };

    const validateAllFields = () => {
        const newErrors = {
            reason: validateField("reason", reason)
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const sendAction = (e, requestData) => {
        // Make API call to save the user data
        setIsLoading(true);

        submitExpenseActionApi(requestData).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    toastMessage.success(res.data.message);
                    props.handleClose(e, true);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Somenthing went wrong!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Somenthing went wrong!!");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const onHandleActionClick = (e) => {
        e.preventDefault();

        if (!validateAllFields()) {
            return;
        };

        let requestData = {
            expenseId: props.expenseId,
            reason: reason,
            action: props.actionType
        };

        if (props.actionData) {
            requestData = { ...requestData, ...props.actionData };
        };

        sendAction(e, requestData);
    }

    return (
        <Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="approve-reject-dialog-title"
            >
                <DialogTitle id="approve-reject-dialog-title" color="white"
                    sx={{ bgcolor: props.actionType === TENDER_APPROVAL_STATUS.REJECTED.name ? '#d32f2f' : '#2e7d32' }}>
                    {getUserActionName(props.actionType) + " Expense ID : " + props.expenseId}
                </DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 size={10} paddingTop={2}>
                            Please enter the {getUserActionName(props.actionType)} reason below:
                        </Grid2>
                        <Grid2 size={10}>
                            <TextField
                                multiline
                                minRows={3}
                                maxRows={10}
                                value={reason}
                                required
                                margin="dense"
                                id="reason"
                                name="reason"
                                label={getUserActionName(props.actionType) + " reason"}
                                fullWidth
                                size="small"
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setErrors({ reason: validateField("reason", e.target.value) });
                                }}
                                autoFocus
                                error={!!errors.reason}
                                helperText={errors.reason}
                            />
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions >
                    <CustomButton onClick={props.handleClose} variant='contained'
                        position="end"
                        endIcon={<CloseIcon small="size" color="white" />}
                    >
                        Close
                    </CustomButton>
                    {props.actionType === TENDER_APPROVAL_STATUS.REJECTED.name ? (
                        <CustomButton loading={isLoading}
                            position="end"
                            endIcon={<RemoveDoneIcon small="size" color="white" />} onClick={onHandleActionClick}
                            variant='contained' color='error'>
                            {getUserActionName(props.actionType)}
                        </CustomButton>) : (
                        <CustomButton loading={isLoading}
                            position="end"
                            endIcon={<DoneAllIcon small="size" color="white" />} onClick={onHandleActionClick}
                            variant='contained' color='success'>
                            {getUserActionName(props.actionType)}
                        </CustomButton>
                    )}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

ExpenseApproveRejectDialog.prototype = {
    open: PropTypes.bool.isRequired,
    expenseId: PropTypes.number.isRequired,
    actionType: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired
}