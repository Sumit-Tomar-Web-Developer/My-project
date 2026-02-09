import { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../../../Providers/ToastProvider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid2, MenuItem } from '@mui/material';
import { USER_ROLES } from '../../../Utils/Constants';
import { API_STATUS } from "../../../Utils/Constants";
import { updateUserDataApi, addUserDataApi } from "../../../AppApis/ApiFunctions";
import CustomButton from '../../../Components/Common/CustomButton';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from '../../../Components/Common/CustomTextField';


export default function AddEditUserDialog(props) {
    const { toastMessage } = useToast();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [isLoading, setIsLoading] = useState(false);
    const [userID, setUserID] = useState("");
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [department, setDepartment] = useState("");
    const [userType, setUserType] = useState("");
    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState({
        userID: "",
        name: "",
        contact: "",
        department: "",
        userType: "",
        email: ""
    });

    useEffect(() => {
        if (props.isEdit) {
            setUserID(props.data.userId);
            setName(props.data.name);
            setContact(parseInt(props.data.contactInfo));
            setDepartment(props.data.department);
            setUserType(props.data.userRoleId);
            setEmail(props.data.email);
        }
        else {
            setUserID("");
            setName("");
            setContact("");
            setDepartment("");
            setUserType("");
            setEmail("");
        }

    }, [props.isEdit, props.data]);

    const validateField = (field, value) => {
        switch (field) {
            case "userID":
                return value ? /^[a-zA-Z0-9]+$/.test(value)
                    ? ""
                    : "User ID must be alphanumeric."
                    : "User ID is required.";
            case "name":
                return value ? "" : "Name is required.";
            case "contact":
                return value && /^[0-9]{10}$/.test(value)
                    ? ""
                    : "Contact number must be a valid 10-digit number.";
            case "department":
                return value ? "" : "Department is required.";
            case "userType":
                return value && Object.values(USER_ROLES).some((role) => role.id === value)
                    ? ""
                    : "User Role must be valid.";
            case "email":
                return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Valid email is required.";
            default:
                return "";
        }
    };

    const validateAllFields = () => {
        const newErrors = {
            userID: validateField("userID", userID),
            name: validateField("name", name),
            contact: validateField("contact", contact),
            department: validateField("department", department),
            userType: validateField("userType", userType),
            email: validateField("email", email)
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === "");
    };

    const onhandleSave = (e) => {
        e.preventDefault();
        // Make API call to save the user data
        setIsLoading(true);
        let requestData = {
            userRoleId: userType
        };

        let paramData = {
            id: userID
        }
        updateUserDataApi(requestData, paramData).then((res) => {
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
                toastMessage.error("Error in saving Employee data!!");
            }
        }).catch((error) => {
            if (error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in saving Employee data!!");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const onhandleCreate = (e) => {
        e.preventDefault();

        if (!validateAllFields()) {
            return;
        };

        // Make API call to save the user data
        setIsLoading(true);
        let requestData = {
            userId: userID,
            name: name,
            userRoleId: userType,
            contactInfo: contact,
            department: department,
            email: email
        }

        addUserDataApi(requestData).then((res) => {
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
                toastMessage.error("Error in saving Employee data!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in saving Employee data!!");
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
                aria-labelledby="add-edit-dialog-title"
            >
                <DialogTitle id="add-edit-dialog-title">
                    {props.isEdit ? "EDIT USER" : "ADD USER"}
                </DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={!props.isEdit}
                                value={userID}
                                margin="dense"
                                id="userID"
                                name="userID"
                                label="Employee ID"
                                fullWidth
                                size="small"
                                onChange={(e) => {
                                    setUserID(e.target.value);
                                    setErrors({ ...errors, userID: validateField("userID", e.target.value) });
                                }}
                                autoFocus={!props.isEdit}
                                error={!!errors.userID}
                                helperText={errors.userID}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={!props.isEdit}
                                value={name}
                                margin="dense"
                                id="name"
                                name="name"
                                label="Employee Name"
                                fullWidth
                                size="small"
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors({ ...errors, name: validateField("name", e.target.value) });
                                }}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={!props.isEdit}
                                value={contact}
                                type="tel"
                                margin="dense"
                                id="contact"
                                name="contact"
                                label="Employee Contact"
                                fullWidth
                                size="small"
                                onChange={(e) => {
                                    setContact(e.target.value);
                                    setErrors({ ...errors, contact: validateField("contact", e.target.value) });
                                }}
                                error={!!errors.contact}
                                helperText={errors.contact}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={!props.isEdit}
                                value={email}
                                type="email"
                                margin="dense"
                                id="email"
                                name="email"
                                label="Employee Email"
                                fullWidth
                                size="small"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors({ ...errors, email: validateField("email", e.target.value) });
                                }}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={!props.isEdit}
                                value={department}
                                margin="dense"
                                id="department"
                                name="department"
                                label="Department"
                                fullWidth
                                size="small"
                                select
                                onChange={(e) => {
                                    setDepartment(e.target.value);
                                    setErrors({ ...errors, department: validateField("department", e.target.value) });
                                }}
                                error={!!errors.department}
                                helperText={errors.department}
                            >
                                {props.departmentList.map((dep) => (
                                    <MenuItem size="small" key={dep.id} value={dep.id}>{dep.departmentname}</MenuItem>
                                ))}
                            </CustomTextField>
                        </Grid2>
                        <Grid2 size={10}>
                            <CustomTextField
                                isedit={true}
                                fullWidth
                                value={userType}
                                autoFocus={props.isEdit}
                                required
                                id="userType" name="userType" label="User Type"
                                onChange={(e) => {
                                    setUserType(e.target.value);
                                    setErrors({ ...errors, userType: validateField("userType", e.target.value) });
                                }}
                                size="small"
                                select
                                error={!!errors.userType}
                                helperText={errors.userType}
                            >
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
                        endIcon={<SaveIcon small="size" color="white" />} onClick={props.isEdit ? onhandleSave : onhandleCreate}
                        variant='contained' color='primary'>
                        Save
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

AddEditUserDialog.prototype = {
    open: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired
}