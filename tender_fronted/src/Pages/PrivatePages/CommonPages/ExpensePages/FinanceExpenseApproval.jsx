import { useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import { Divider, Grid2, Stack } from '@mui/material';
import { useToast } from '../../../../Providers/ToastProvider';
import { API_STATUS, TENDER_APPROVAL_STATUS } from "../../../../Utils/Constants";
import CustomButton from '../../../../Components/Common/CustomButton';
import { API_URLS } from '../../../../AppApis/APIUrls';
import CustomTextField from '../../../../Components/Common/CustomTextField';
import CustomFileUpload from '../../../../Components/Common/CustomFileUpload';
import CustomFileDownload from '../../../../Components/Common/CustomFileDownload';
import CustomPageTitle from '../../../../Components/Common/CustomPageTitle';
import { getRequest, submitExpenseActionApi } from '../../../../AppApis/ApiFunctions';
import { isValidDate, toLocalTimeString } from '../../../../Utils/UtilityFunctions';
import ViewExpense from './ViewExpense';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import ExpenseApproveRejectDialog from './ExpenseApproveRejectDialog';


export default function FinanceExpenseApproval() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();
    const { expenseId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [actionType, setActionType] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [tenderId, setTenderId] = useState('');
    const [expenseData, setExpenseData] = useState({
        FinancePaidAmount: '',
        FinanceTDSAmount: '',
        paymentProofFileGuid: '',
        paymentProofFileName: '',
        paymentDate: toLocalTimeString(new Date()).split('T')[0]
    })

    const [errorTexts, setErrorTexts] = useState({
        FinancePaidAmount: '',
        FinanceTDSAmount: '',
        expenseAmount: '',
        paymentProofFileGuid: '',
        paymentProofFileName: '',
        paymentDate: ''
    });

    useEffect(() => {
        getExpenseDetails();
    }, [])

    const handleValidations = (name, value) => {
        let errorMessage = '';
        let expenseTotalError = false;
        value = String(value);
        switch (name) {
            case "FinancePaidAmount":
                if (value === '') {
                    errorMessage = "Paid Amount is required.";
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = "Paid Amount must be a positive number with up to 2 decimal places.";
                } else if (Number(value) > 200000) {
                    errorMessage = "Paid Amount cannot exceed 2,00,000.";
                }
                expenseTotalError = true;
                break;
            case "FinanceTDSAmount":
                if (value === '') {
                    errorMessage = "TDS Amount is required.";
                } else if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    errorMessage = "TDS Amount must be a positive number with up to 2 decimal places.";
                } else if (Number(value) > 200000) {
                    errorMessage = "TDS Amount cannot exceed 2,00,000.";
                }
                expenseTotalError = true;
                break;
            case "paymentProofFileName":
                if (value.trim() === '') {
                    errorMessage = 'Receipt is required.';
                }
                break;
            case 'paymentDate':
                if (value.trim() === '') {
                    errorMessage = 'Payment Date is required.';
                } else if (!isValidDate(value)) {
                    errorMessage = 'Payment Date must be in YYYY-MM-DD format.';
                }
                break;
            default:
                break;
        }
        if (expenseTotalError) {
            setErrorTexts(prevErr => {
                return {
                    ...prevErr, [name]: errorMessage,
                    expenseAmount: ""
                }
            });
        }
        else {
            setErrorTexts(prevErr => {
                return {
                    ...prevErr, [name]: errorMessage
                }
            });
        }

        return errorMessage === '';
    };

    const onHandleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData({ ...expenseData, [name]: value });
        handleValidations(name, value);
    };

    const handleFileUnselect = (e, name) => {
        e.preventDefault();
        setExpenseData({ ...expenseData, paymentProofFileName: '', paymentProofFileGuid: '' });
    };

    const handleReject = (e) => {
        e.preventDefault();
        setActionType(TENDER_APPROVAL_STATUS.REJECTED.name);
        setIsOpen(true);
    }

    const handleSave = (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate all fields in expenseData
        Object.keys(expenseData).forEach((key) => {
            if (!handleValidations(key, expenseData[key])) {
                isValid = false;
            }
        });

        if (getTotalAmount() !== parseFloat(parseFloat(expenseAmount).toFixed(2))) {
            setErrorTexts(prevErr => {
                return {
                    ...prevErr,
                    FinancePaidAmount: "Paid Amount + TDS Amount should be equal to Expense Amount",
                    FinanceTDSAmount: "Paid Amount + TDS Amount should be equal to Expense Amount",
                    expenseAmount: "Paid Amount + TDS Amount should be equal to Expense Amount"
                }
            });
            isValid = false;
        }

        if (isValid) {
            setActionType(TENDER_APPROVAL_STATUS.APPROVED.name);
            setIsOpen(true);
        }
        else {
            toastMessage.error("Please correct the errors before saving.");
        }
    }

    const handleClose = (e, isRedirect) => {
        e.preventDefault();
        setIsOpen(false);
        setActionType('');
        if (isRedirect === true) {
            navigate('/dashboard');
        }
    }

    const saveUploadedFiles = (sFiles) => {
        setExpenseData({ ...expenseData, paymentProofFileName: sFiles.fileName, paymentProofFileGuid: sFiles.guid });
        if (sFiles.fileName !== "") {
            setErrorTexts({
                ...errorTexts, paymentProofFileName: ''
            })
        }
        else {
            setErrorTexts({
                ...errorTexts, paymentProofFileName: 'File is required'
            })
        }
    }

    const getExpenseDetails = () => {
        let baseTenderUrl = `/tenders/${expenseId}/${API_URLS.GET.GET_EXPENSE_DATA}`;
        getRequest(baseTenderUrl).then((res) => {
            if (res.data) {
                if (res.data.type === API_STATUS.SUCCESS) {
                    setExpenseAmount(res.data.data.expenseamount);
                    setTenderId(res.data.data.tenderId);
                }
                else {
                    toastMessage.error(res.data.message);
                }
            }
            else {
                toastMessage.error("Error in Fetching Expense details!!");
            }
        }).catch((error) => {
            if (error.data && error.data.message) {
                toastMessage.error(error.data.message);
            }
            else {
                toastMessage.error("Error in Fetching Expense details!!");
            }
        })
    }

    const getTotalAmount = () => {
        let totalAmount = 0;
        if (expenseData.FinanceTDSAmount !== '') {
            totalAmount += parseFloat(parseFloat(expenseData.FinanceTDSAmount).toFixed(2));
        }
        if (expenseData.FinancePaidAmount !== '') {
            totalAmount += parseFloat(parseFloat(expenseData.FinancePaidAmount).toFixed(2));
        }
        return totalAmount;
    }

    return (
        <Fragment>
            {isOpen && <ExpenseApproveRejectDialog actionData={expenseData} open={isOpen} expenseId={expenseId}
                actionType={actionType} handleClose={handleClose} />}
            <CustomPageTitle title="Finance Expense Approval" />
            <ViewExpense expenseId={expenseId} />

            <Grid2 container spacing={2} marginTop={2}>
                <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
                    <Divider>Finance Approval </Divider>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={true}
                        size="small"
                        required
                        fullWidth
                        id="FinancePaidAmount"
                        label="Paid Amount"
                        name="FinancePaidAmount"
                        value={expenseData.FinancePaidAmount}
                        onChange={onHandleChange}
                        error={errorTexts.FinancePaidAmount !== ''}
                        helperText={errorTexts.FinancePaidAmount}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={true}
                        size="small"
                        required
                        fullWidth
                        id="FinanceTDSAmount"
                        label="TDS Amount"
                        name="FinanceTDSAmount"
                        value={expenseData.FinanceTDSAmount}
                        onChange={onHandleChange}
                        error={errorTexts.FinanceTDSAmount !== ''}
                        helperText={errorTexts.FinanceTDSAmount}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
                    <CustomTextField
                        isedit={false}
                        size="small"
                        fullWidth
                        id="expenseAmount"
                        label="Total Amount"
                        name="expenseAmount"
                        value={getTotalAmount()}
                        error={errorTexts.expenseAmount !== ''}
                        helperText={errorTexts.expenseAmount}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <CustomTextField
                        isedit={true}
                        size="small"
                        required
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        type="date"
                        id="paymentDate"
                        label="Payment Date"
                        name="paymentDate"
                        value={expenseData.paymentDate}
                        onChange={onHandleChange}
                        error={errorTexts.paymentDate !== ''}
                        helperText={errorTexts.paymentDate}
                    />
                </Grid2>
                <Grid2 size={12}>
                    <Stack spacing={2} direction="row">
                        <CustomFileUpload
                            projectID={tenderId}
                            buttonName="Upload Payment Receipt"
                            saveUploadedFiles={saveUploadedFiles}
                            errorText={errorTexts.paymentProofFileName}
                        />
                        {expenseData.paymentProofFileName !== '' && (
                            <CustomFileDownload
                                guid={expenseData.paymentProofFileGuid}
                                isedit={true}
                                fileName={expenseData.paymentProofFileName}
                                projectID={tenderId}
                                handleFileUnselect={handleFileUnselect}
                            />
                        )}
                    </Stack>
                </Grid2>
                <Grid2 paddingTop={1} size={{ xs: 12, sm: 12, md: 12, lg: 12 }} >
                    <Stack direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}>
                        <CustomButton onClick={handleReject}
                            variant='contained' color='error'
                            position="end"
                            endIcon={<RemoveDoneIcon small="size" color="white" />}
                        >
                            REJECT
                        </CustomButton>
                        < CustomButton onClick={handleSave}
                            variant='contained' color='success'
                            position="end"
                            endIcon={<SaveIcon small="size" color="white" />}
                        >
                            SUBMIT
                        </CustomButton>
                    </Stack>
                </Grid2>
            </Grid2>
        </Fragment>
    );
}
