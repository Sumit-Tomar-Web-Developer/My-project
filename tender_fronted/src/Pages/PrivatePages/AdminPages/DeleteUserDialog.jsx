import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DialogContentText, Grid2, MenuItem, TextField, Typography } from '@mui/material';
import { USER_ROLES } from '../../../Utils/Constants';
import { API_STATUS } from "../../../Utils/Constants";
import { deleteUserDataApi } from "../../../AppApis/ApiFunctions";
import CustomButton from '../../../Components/Common/CustomButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useToast } from '../../../Providers/ToastProvider';
import CustomTextField from '../../../Components/Common/CustomTextField';

export default function DeleteUserDialog(props) {
    const { toastMessage } = useToast();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [isLoading, setIsLoading] = useState(false);

    const { userId, name, contactInfo, department, userRoleId } = props.data;

    const onhandleDelete = (e) => {
        e.preventDefault();

        setIsLoading(true);

        let requestData = {
            id: userId
        };

        deleteUserDataApi(requestData).then((res) => {
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
                toastMessage.error("Error in Deleting Employee Data!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Deleting Employee data!!");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                {"DELETE USER"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="subtitle1" color="error" sx={{ marginBottom: '1em' }}>
                            Are you sure you want to <strong>DELETE</strong> below Employee Details ?<br />
                        </Typography>
                    </DialogContentText>
                    <Grid2 container spacing={1} paddingTop={1}>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={false}
                                value={userId}
                                margin="dense"
                                id="userId"
                                name="userId"
                                label="Employee ID"
                                fullWidth
                                size="small"
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={false}
                                value={name}
                                margin="dense"
                                id="name"
                                name="name"
                                label="Employee Name"
                                fullWidth
                                size="small"
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={false}
                                value={contactInfo}
                                margin="dense"
                                id="contactInfo"
                                name="contactInfo"
                                label="Employee Contact"
                                fullWidth
                                size="small"
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={false}
                                value={department}
                                margin="dense"
                                id="department"
                                name="department"
                                label="Department"
                                fullWidth
                                select
                                size="small"
                            >
                                {props.departmentList.map((dep) => (
                                    <MenuItem size="small" key={dep.id} value={dep.id}>{dep.departmentname}</MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={false}
                                value={userRoleId}
                                fullWidth
                                margin="dense"
                                id="userRoleId" name="userRoleId" label="User Type"
                                size="small"
                                select>
                                {Object.entries(USER_ROLES).map(([key, role]) => (
                                    <MenuItem size="small" key={key} value={role.id}>{role.roleName}</MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions sx={{ marginTop: '2em',marginBottom: '1em',marginRight: '1em' }}>
                    <CustomButton onClick={props.handleClose} variant='contained' color="inherit"
                        position="end"
                        endIcon={<CloseIcon small="size" color="white" />}
                    >
                        Close
                    </CustomButton>
                    <CustomButton loading={isLoading}
                        position="end"
                        endIcon={<DeleteIcon small="size" color="white" />} onClick={onhandleDelete}
                        variant='contained' color='error'>
                        Delete
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

DeleteUserDialog.prototype = {
    open: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired
}