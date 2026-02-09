import { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, Grid2, IconButton, MenuItem, Stack, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CustomAccordion from '../Common/CustomAccordion';
import { useToast } from '../../Providers/ToastProvider';
import { API_URLS } from '../../AppApis/APIUrls';
import { API_STATUS } from '../../Utils/Constants';
import { getAllUserListApi, getRequest, postRequest } from '../../AppApis/ApiFunctions';
import CustomTextField from '../Common/CustomTextField';

export default function AdditionalDetailsAccordion({ isedit, projectID, panelIndex, handlePanelChange }) {
    const { toastMessage } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [additionalDetailsObj, setAdditionalDetailsObj] = useState({
        referencedBy: '',
        additionalFieldDict: { list: [{ fieldName: '', fieldValue: '' }] },
    });

    const [userList, setUserList] = useState([]);
    const [inputUserId, setInputUserId] = useState("");

    const [errorTexts, setErrorTexts] = useState({
        referencedBy: '',
        additionalFieldDict: { list: [{ fieldName: '', fieldValue: '' }] },
    });

    useEffect(() => {
        getUserList();
        getAdditionalDetails();
    }, []);

    const handleValidations = (name, value, index = null) => {
        let errorMessage = '';
        switch (name) {
            case 'referencedBy':
                if (value === null || value === '') {
                    errorMessage = 'Project Referenced By is required.';
                }
                break;
            case 'fieldName':
                errorMessage = value.trim() === '' ? 'Field Name is required.' : '';
                break;
            case 'fieldValue':
                errorMessage = value.trim() === '' ? 'Field Value is required.' : '';
                break;
            default:
                break;
        }

        if (index !== null) {
            const updatedFieldListErrors = [...errorTexts.additionalFieldDict.list];
            updatedFieldListErrors[index][name] = errorMessage;
            setErrorTexts((prev) => ({ ...prev, additionalFieldDict: { list: updatedFieldListErrors } }));
        } else {
            setErrorTexts((prev) => ({ ...prev, [name]: errorMessage }));
        }
        return errorMessage === '';
    };

    const handleChange = (name, value) => {
        setAdditionalDetailsObj({ ...additionalDetailsObj, [name]: value });
        handleValidations(name, value);
    };

    const handleChangeList = (e, index) => {
        const { name, value } = e.target;
        const updatedFieldList = [...additionalDetailsObj.additionalFieldDict.list];
        updatedFieldList[index][name] = value;
        setAdditionalDetailsObj({ ...additionalDetailsObj, additionalFieldDict: { list: updatedFieldList } });
        handleValidations(name, value, index);
    };

    const handleAddToList = () => {
        const updatedFieldList = [...additionalDetailsObj.additionalFieldDict.list, { fieldName: '', fieldValue: '' }];
        const updatedErrorList = [...errorTexts.additionalFieldDict.list, { fieldName: '', fieldValue: '' }];
        setAdditionalDetailsObj({ ...additionalDetailsObj, additionalFieldDict: { list: updatedFieldList } });
        setErrorTexts({ ...errorTexts, additionalFieldDict: { list: updatedErrorList } });
    };

    const handleDeleteFromList = (index) => {
        const updatedFieldList = [...additionalDetailsObj.additionalFieldDict.list];
        const updatedErrorList = [...errorTexts.additionalFieldDict.list];
        updatedFieldList.splice(index, 1);
        updatedErrorList.splice(index, 1);
        setAdditionalDetailsObj({ ...additionalDetailsObj, additionalFieldDict: { list: updatedFieldList } });
        setErrorTexts({ ...errorTexts, additionalFieldDict: { list: updatedErrorList } });
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        handlePanelChange(panelIndex - 1);
    };

    const getUserList = () => {
        // Make API call to fetch new data from USER Table
        getAllUserListApi({}).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    let tempUserList = res.data.data.userList.map((user) => {
                        if (isedit) {
                            if (user.isActive) {
                                return user.userId;
                            }
                        }
                        else {
                            return user.userId;
                        }
                    })
                    setUserList(tempUserList);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Expense List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Expense List!!");
            }
        })
    }

    const getAdditionalDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.GET.GET_ADDITIONAL_DETAILS}`;
        setIsLoading(true);
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setAdditionalDetailsObj(
                        {
                            referencedBy: res.data.data.referencedBy || '',
                            additionalFieldDict: {
                                list: res.data.data.additionalFieldDict.list.map((field) => ({
                                    fieldName: field.fieldName || '',
                                    fieldValue: field.fieldValue || '',
                                })),
                            }
                        }
                    );
                    setErrorTexts({
                        referencedBy: '',
                        additionalFieldDict: {
                            list: res.data.data.additionalFieldDict.list.map(() => ({
                                fieldName: '',
                                fieldValue: ''
                            })),
                        }
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
            if (isedit && error.status === 404) {
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

    const saveAdditionalDetails = () => {
        const baseTenderUrl = `/tenders/${projectID}/${API_URLS.POST.SAVE_ADDITIONAL_DETAILS}`;

        console.log('Saving data:', additionalDetailsObj);
        setIsLoading(true);
        let updatedAdditionalDetailsObj = { ...additionalDetailsObj };
        if (updatedAdditionalDetailsObj.additionalFieldDict.list.length === 1) {
            // 1st additional Field is not mandatory so remove if empty
            if (!(updatedAdditionalDetailsObj.additionalFieldDict.list[0].fieldName === '' ||
                updatedAdditionalDetailsObj.additionalFieldDict.list[0].fieldValue)) {
                updatedAdditionalDetailsObj.additionalFieldDict.list = [];
            }
        }

        // Simulate API call
        postRequest(baseTenderUrl, updatedAdditionalDetailsObj)
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

        let isValid = true;

        // Validate `referencedBy`
        if (!handleValidations('referencedBy', additionalDetailsObj.referencedBy)) {
            isValid = false;
        }

        // Validate `fieldList`
        if (additionalDetailsObj.additionalFieldDict.list.length === 1) {
            // 1st additional Field is not mandatory
            if (!(additionalDetailsObj.additionalFieldDict.list[0].fieldName === '' ||
                additionalDetailsObj.additionalFieldDict.list[0].fieldValue)) {
                additionalDetailsObj.additionalFieldDict.list.map((field, index) => {
                    if (!handleValidations('fieldName', field.fieldName, index) ||
                        !handleValidations('fieldValue', field.fieldValue, index)) {
                        isValid = false;
                    }
                });
            }
        }
        else {
            additionalDetailsObj.additionalFieldDict.list.map((field, index) => {
                if (!handleValidations('fieldName', field.fieldName, index) ||
                    !handleValidations('fieldValue', field.fieldValue, index)) {
                    isValid = false;
                }
            });
        };

        // If all validations pass, save the data
        if (isValid) {
            saveAdditionalDetails();
        }
    };

    return (
        <CustomAccordion
            isedit={isedit}
            panelIndex={panelIndex}
            handleSaveLater={handleSaveLater}
            handleBackClick={handleBackClick}
            isLoading={isLoading}
        >
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    {isedit ? (
                        <Autocomplete
                            disablePortal
                            value={additionalDetailsObj.referencedBy}
                            inputValue={inputUserId}
                            onChange={(e, newVal) => handleChange('referencedBy', newVal)}
                            onInputChange={(event, newInputValue) => {
                                setInputUserId(newInputValue);
                            }}
                            size="small"
                            id="referencedBy"
                            fullWidth
                            getOptionLabel={(option) => String(option) || ""}
                            options={userList}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    size="small"
                                    label="Project Referenced By"
                                    error={errorTexts.referencedBy !== ''}
                                    helperText={errorTexts.referencedBy}
                                />}
                        />) : (
                        <CustomTextField
                            isedit={isedit}
                            size="small"
                            required
                            fullWidth
                            id="referencedBy"
                            label="Project Referenced By"
                            name="referencedBy"
                            value={additionalDetailsObj.referencedBy}
                        >
                            {userList.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </CustomTextField>
                    )}
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 8, md: 9 }}></Grid2>
                {additionalDetailsObj.additionalFieldDict.list.map((fieldData, index) => (
                    <Fragment key={index}>
                        <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                            <CustomTextField
                                isedit={isedit}
                                size="small"
                                fullWidth
                                id="fieldName"
                                label="Field Name"
                                name="fieldName"
                                value={fieldData.fieldName}
                                onChange={(e) => handleChangeList(e, index)}
                                error={errorTexts.additionalFieldDict.list[index]?.fieldName !== ''}
                                helperText={errorTexts.additionalFieldDict.list[index]?.fieldName}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 5, md: 7.5 }}>
                            <CustomTextField
                                isedit={isedit}
                                size="small"
                                fullWidth
                                id="fieldValue"
                                label="Field Value"
                                name="fieldValue"
                                value={fieldData.fieldValue}
                                onChange={(e) => handleChangeList(e, index)}
                                error={errorTexts.additionalFieldDict.list[index]?.fieldValue !== ''}
                                helperText={errorTexts.additionalFieldDict.list[index]?.fieldValue}
                            />
                        </Grid2>
                        {isedit &&
                            <Grid2 size={{ xs: 12, sm: 3, md: 1.5 }}>
                                <Stack direction="row" spacing={1}>
                                    {additionalDetailsObj.additionalFieldDict.list.length > 1 && (
                                        <IconButton color="primary" onClick={() => handleDeleteFromList(index)}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                    {index === additionalDetailsObj.additionalFieldDict.list.length - 1 && (
                                        <IconButton color="primary" onClick={handleAddToList}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Grid2>
                        }
                    </Fragment>
                ))}
            </Grid2>
        </CustomAccordion>
    );
}

AdditionalDetailsAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    projectID: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handlePanelChange: PropTypes.func.isRequired,
};