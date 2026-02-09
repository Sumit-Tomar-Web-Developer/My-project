import { useState, Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../Providers/ToastProvider';
import { useTheme } from '@mui/material/styles';
import { Autocomplete, Grid2, MenuItem, Stack, TextField } from '@mui/material';
import { API_STATUS, TENDER_STATUS } from "../../../Utils/Constants";
import CustomButton from '../../../Components/Common/CustomButton';
import SaveIcon from '@mui/icons-material/Save';
import { API_URLS } from '../../../AppApis/APIUrls';
import { postRequest, getExpenseTypeList, getSearchFiltersApi } from '../../../AppApis/ApiFunctions';
import CustomTextField from '../../../Components/Common/CustomTextField';
import CustomFileUpload from '../../../Components/Common/CustomFileUpload';
import CustomFileDownload from '../../../Components/Common/CustomFileDownload';
import CustomPageTitle from '../../../Components/Common/CustomPageTitle';


export default function AddExpense() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();

    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [tenderIdList, setTenderIdList] = useState([]);
    const [inputTenderId, setInputTenderId] = useState("");
    const [expenseData, setExpenseData] = useState({
        expenseamount: '',
        invoicenumber: '',
        tenderId: '',
        expenseDetails: '',
        expenseTypeId: '',
        expenseSubTypeId: '',
        receiptFileName: '',
        receiptGuid: ''
    })

    const [errorTexts, setErrorTexts] = useState({
        expenseamount: '',
        invoicenumber: '',
        tenderId: '',
        expenseDetails: '',
        expenseTypeId: '',
        expenseSubTypeId: '',
        receiptFileName: '',
        receiptGuid: ''
    });

    useEffect(() => {
        getExpenseTypeData();
        fetchFilters();
    }, [])

    const isFilteredValue = (currStatus) => {
        let isValid = false;
        if (currStatus < TENDER_STATUS.ProjectCompleted.id) {
            isValid = true;
        }
        return isValid;
    }

    const getFilteredMap = (locTenderMap) => {
        let filteredTenderMap = {};
        //  filterMap: { department1: { name: departmentName1, locDict: {location1 : {tenderId: currentStatus, ....} ... } ...} ...}
        Object.entries(locTenderMap).forEach(([dep, depdict]) => {
            Object.entries(depdict.locDict).forEach(([loc, tdict]) => {
                Object.entries(tdict).forEach(([tId, currStatus]) => {
                    let isValid = isFilteredValue(currStatus);
                    if (isValid) {
                        if (!(tId in filteredTenderMap)) {
                            filteredTenderMap[tId] = currStatus;
                        }
                    }
                })
            })
        })

        return filteredTenderMap;
    }

    // Fetch filters from API
    const fetchFilters = () => {
        setIsLoading(true);
        getSearchFiltersApi({}).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    // In fetchLocations, after setfilterMap:
                    if (res.data.data.filterMap) {
                        //  filterMap: { department1: { name: departmentName1, locDict: {location1 : {tenderId: currentStatus, ....} ... } ...} ...}
                        let filteredMap = getFilteredMap(res.data.data.filterMap);
                        let allTenderIds = [];

                        Object.keys(filteredMap).map((tId) => {
                            allTenderIds.push(tId);
                        })

                        allTenderIds = allTenderIds.sort();
                        setTenderIdList(allTenderIds);
                    }
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Location List!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Location List!!");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const getExpenseTypeData = () => {
        getExpenseTypeList({}).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setExpenseTypes(res.data.data.expenseTypeList);
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

    const handleValidations = (name, value) => {
        let errorMessage = '';
        value = String(value);
        switch (name) {
            case "expenseTypeId":
                if (value === '') {
                    errorMessage = 'Expense Category is required.';
                }
                break;
            case "expenseSubTypeId":
                if (value === '') {
                    errorMessage = 'Expense SubCategory is required.';
                }
                break;
            case "expenseDetails":
                if (value.trim() === '') {
                    errorMessage = 'Expense Details is required.';
                }
                break;
            case "expenseamount":
                if (value === '') {
                    errorMessage = "Expense Amount is required.";
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = "Expense Amount must be a positive number with up to 2 decimal places.";
                } else if (Number(value) > 200000) {
                    errorMessage = "Expense Amount cannot exceed 2,00,000.";
                }
                break;
            case "receiptFileName":
                if (value.trim() === '') {
                    errorMessage = 'Receipt is required.';
                }
                break;
            case "tenderId":
                if (value.trim() === '') {
                    errorMessage = 'Project ID is required.';
                }
                break;
            case "invoicenumber":
                if (value.trim() === '') {
                    errorMessage = 'Invoice No. is required.';
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
        setExpenseData({ ...expenseData, [name]: value });
        handleValidations(name, value);
    };

    const onHandleTenderChange = (name, value) => {
        setExpenseData({ ...expenseData, [name]: value });
        handleValidations(name, value);
    }

    const handleFileUnselect = (e, name) => {
        e.preventDefault();
        setExpenseData({ ...expenseData, receiptFileName: '', receiptGuid: '' });
    };

    const saveExpenseData = (e) => {
        const baseTenderUrl = `/tenders/${API_URLS.POST.SAVE_EXPENSE}`;

        setIsLoading(true);

        // Simulate API call
        postRequest(baseTenderUrl, expenseData)
            .then((res) => {
                if (res.data) {
                    if (res.data.type === API_STATUS.SUCCESS) {
                        toastMessage.success(res.data.message);
                        navigate('/dashboard');
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
        Object.keys(expenseData).forEach((key) => {
            if (!handleValidations(key, expenseData[key])) {
                isValid = false;
            }
        });

        if (isValid) {
            saveExpenseData(e);
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    const saveUploadedFiles = (sFiles) => {
        setExpenseData({ ...expenseData, receiptFileName: sFiles.fileName, receiptGuid: sFiles.guid });
        if (sFiles.fileName !== "") {
            setErrorTexts({
                ...errorTexts, receiptFileName: ''
            })
        }
        else {
            setErrorTexts({
                ...errorTexts, receiptFileName: 'File is required'
            })
        }
    }

    return (
        <Fragment>
            <CustomPageTitle title="Add New Expenses" />
            <Grid2 container spacing={2} marginTop={2}>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <Autocomplete
                        disablePortal
                        value={expenseData.tenderId}
                        inputValue={inputTenderId}
                        onChange={(e, newVal) => onHandleTenderChange("tenderId", newVal)}
                        onInputChange={(event, newInputValue) => {
                            setInputTenderId(newInputValue);
                        }}
                        size="small"
                        id="tenderId"
                        fullWidth
                        getOptionLabel={(option) => String(option) || ""}
                        options={tenderIdList}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                size="small"
                                label="Project ID"
                                error={errorTexts.tenderId !== ''}
                                helperText={errorTexts.tenderId}
                            />}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4.5 }}>
                    <CustomTextField
                        isedit={true}
                        size="small"
                        fullWidth
                        id="expenseTypeId"
                        label="Expense Category"
                        name="expenseTypeId"
                        select
                        value={expenseData.expenseTypeId}
                        onChange={onHandleChange}
                        error={errorTexts.expenseTypeId !== ''}
                        helperText={errorTexts.expenseTypeId}
                    >
                        {expenseTypes.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.expenseType}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 4.5 }}>
                    <CustomTextField
                        isedit={true}
                        size="small"
                        fullWidth
                        id="expenseSubTypeId"
                        label="Expense Sub Category"
                        name="expenseSubTypeId"
                        select
                        value={expenseData.expenseSubTypeId}
                        onChange={onHandleChange}
                        error={errorTexts.expenseSubTypeId !== ''}
                        helperText={errorTexts.expenseSubTypeId}
                    >
                        {expenseTypes.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.expenseType}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <CustomTextField
                        isedit={true}
                        size="small"
                        required
                        fullWidth
                        type="number"
                        id="expenseamount"
                        label="Expense Amount"
                        name="expenseamount"
                        value={expenseData.expenseamount}
                        onChange={onHandleChange}
                        error={errorTexts.expenseamount !== ''}
                        helperText={errorTexts.expenseamount}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4, md: 3 }}>
                    <CustomTextField
                        isedit={true}
                        size="small"
                        required
                        fullWidth
                        id="invoicenumber"
                        label="Invoive No."
                        name="invoicenumber"
                        value={expenseData.invoicenumber}
                        onChange={onHandleChange}
                        error={errorTexts.invoicenumber !== ''}
                        helperText={errorTexts.invoicenumber}
                    />
                </Grid2>
                <Grid2 size={12}>
                    <CustomTextField
                        isedit={true}
                        size="small"
                        required
                        fullWidth
                        multiline
                        rows={3}
                        id="expenseDetails"
                        label="Expense Details"
                        name="expenseDetails"
                        value={expenseData.expenseDetails}
                        onChange={onHandleChange}
                        error={errorTexts.expenseDetails !== ''}
                        helperText={errorTexts.expenseDetails}
                    />
                </Grid2>
                {expenseData.tenderId &&
                    <Grid2 size={12}>
                        <Stack spacing={2} direction="row">
                            <CustomFileUpload
                                projectID={expenseData.tenderId}
                                buttonName="Upload Invoice"
                                saveUploadedFiles={saveUploadedFiles}
                                errorText={errorTexts.receiptFileName}
                            />
                            {expenseData.receiptFileName !== '' && (
                                <CustomFileDownload
                                    guid={expenseData.receiptGuid}
                                    isedit={true}
                                    fileName={expenseData.receiptFileName}
                                    projectID={expenseData.tenderId}
                                    handleFileUnselect={handleFileUnselect}
                                />
                            )}
                        </Stack>
                    </Grid2>
                }
                <Grid2 size={12}>
                    <CustomButton loading={isLoading}
                        position="end"
                        endIcon={<SaveIcon small="size" color="white" />} onClick={onhandleSave}
                        variant='contained' color='success'>
                        Submit
                    </CustomButton>
                </Grid2>
            </Grid2>
        </Fragment>
    );
}
