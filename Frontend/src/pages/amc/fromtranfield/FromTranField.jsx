// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Snackbar,
  SnackbarContent,
  Autocomplete,
  DialogContentText
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// eslint-disable-next-line no-restricted-imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  saveUpdatedTaxPayment,
  deleteTaxPayment,
  fetchAllBanks,
  checkInvoiceStatus,
  checkDuplicateInvoice
} from 'services/Amc/taxPayment/taxPayment.js';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
// ==============================|| AMC Transction PAGE ||============================== //

function FromTranField({ CloseButton, EditableTaxDetails, setEditableTaxDetails, ownerData, allBillBookData,totalPaid,setTotalPaid }) {
  const [currentTax, setCurrentTax] = useState({});
  const [pendingTax, setPendingTax] = useState({});
  const [isCurrent, setIsCurrent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [billBookNo, setBillBookNo] = useState('');
  const [billBookNoList, setBillBookNoList] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceNoList, setInvoiceNoList] = useState([]);
  const [empName, setEmpName] = useState('');
  const [bankList, setBankList] = useState([]);
  const [checkFormData, setFormData] = useState({
    chequeNo: '',
    name: '',
    bankName: '',
    branchName: '',
    ifsc: '',
    date: null,
    expiryDate: null
  });
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [paymentsToSaveOnDup, setPaymentsToSaveOnDup] = useState([]);
  const [dupInvoiceDialog, setDupInvoiceDialog] = useState(false);
  const [allowDupInvoice, setAllowDupInvoice] = useState(false);
  const [levelname, setLevelName] = useState('');
  const [password, setPassword] = useState('');

  //snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const paymentLabels = {
    1: 'Cash',
    2: 'Cheque',
    3: 'DD',
    4: 'UPI',
    5: 'NEFT',
    6: 'RIGS',
    7: 'Card'
  };
  const columnOrder = [
    'Property Tax',
    'Education Tax',
    'Employment Tax',
    'Tree Cess',
    'Sp. Water Cess',
    'Sanitation',
    'Drain Cess',
    'Road Cess',
    'Fire Cess',
    'Light Cess',
    'Water Benefit',
    'Major Building',
    'Sewage Disposal Cess',
    'Sp. Education Tax',
    'Water Bill',
    'Tax1',
    'Tax2',
    'Tax3',
    'Tax4',
    'Tax5',
    'Tax Total',
    'Interest',
    'Discount',
    'Notice Fee',
    'Extra Charges',
    'NetTotal',
    'Amount',
    'Payment Type'
  ];
  console.log('Editable tax details', EditableTaxDetails);
  console.log('owner data prop', ownerData);

  console.log('currentTax 3rd tab', currentTax);
  console.log('pendingTax 3rd tab', pendingTax);
  const isCurrentPending = isCurrent && isPending;
  console.log('isCurrentPending', isCurrentPending);
  //year
  const year = isCurrent ? currentTax['Finance Year'] : pendingTax['Finance Year'];
  //total amount
  const totalAmount = isCurrentPending
    ? Number(currentTax.Amount || 0) + Number(pendingTax.Amount || 0)
    : isCurrent
      ? Number(currentTax.Amount || 0)
      : isPending
        ? Number(pendingTax.Amount || 0)
        : 0;

  //Payment Type label
  const paymentTypeLabel = isCurrentPending
    ? `${currentTax['Payment Type']}-${pendingTax['Payment Type']}`
    : isCurrent
      ? currentTax['Payment Type']
      : pendingTax['Payment Type'] || '';

  // DD/check/NEFT/RIGS formdata disable for below paymentMode
  const isDisabled = paymentMode === 'Cash' || paymentMode === 'UPI' || paymentMode === '';

  // Enable if paymentMode is UPI
  const isUPI = paymentMode === 'UPI';

  /**Payment Details */
  const isFormValid = () => {
    const { chequeNo, bankName, date, expiryDate } = checkFormData;
    console.log('checkformData', checkFormData);
    return chequeNo.trim() !== '' && bankName.trim() !== '' && date !== null && expiryDate !== null;
  };

  //Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  //Payment mode change function
  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value); // store label directly
    console.log('paymentMode selected:', event.target.value);
  };

  //Invoice No change function
  const handleInvoiceNo = async (e) => {
    const value = e.target.value;
    if (value) {
      const res = await checkInvoiceStatus(year, billBookNo, value);
      if (res.status === 409) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(`${res.message}` || `Invoice No ${invoiceNo} is not active for BillBook No ${billBookNo}`);
        setInvoiceNo('');
        return;
      } else {
        setInvoiceNo(value);
      }
    }
  };

  // Open dialog box to edit tax payment entry
  const handleOpenDialog = () => {
    setOpen(true);
  };

  //Close dialog box to edit tax payment entry
  const handleCloseDialog = () => {
    setOpen(false);
  };

  //Handle function for TransactionId
  const handleTransactionId = (e) => {
    const value = e.target.value;
    const validPattern = /^[A-Za-z0-9._-]*$/;
    if (validPattern.test(value) || value === '') {
      setTransactionId(value);
    }
  };
  //Handle function for BillBookNo
  const handleBillBookNo = (e) => {
    setBillBookNo(e.target.value);
  };

  //Handle function for DD/check/NEFT/RIGS formdata
  const handleCheckData = async (eventOrValue, fieldName = null) => {
    let name, value;

    if (typeof eventOrValue === 'string') {
      // Case: Autocomplete or manual call
      name = fieldName;
      value = eventOrValue;
    } else {
      // Case: Normal input
      name = eventOrValue.target.name;
      value = eventOrValue.target.value;
    }

    const alphabetOnlyFields = ['name', 'branchName', 'bankName'];
    if (alphabetOnlyFields.includes(name) && !/^[a-zA-Z\s]*$/.test(value)) return;

    if (name === 'chequeNo' && !/^\d{0,6}$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle Close Password dialog box
  const handleClosePassDialog = async () => {
    setAllowDupInvoice(false);
    setPassword('');
  };
  // Handle Password Check
  const handleCheckPassword = async () => {
    try {
      const res = await levelPassword(levelname, password);
      console.log('verify password', res);
      if (res.response.status === 200) {
        // Password valid → close dialog & proceed to save
        handleClosePassDialog();
        await saveUpdates(paymentsToSaveOnDup);
        setPaymentsToSaveOnDup([]);
      } else {
        // Invalid password
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Invalid Password! Please try again.');
      }
    } catch (error) {
      console.log('Error verifying password.', error);
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Error verifying password.');
    }
  };

  //Prepares data for updating tax payment records
  const handleSaveTaxUpdates = async () => {
    try {
      if (ownerData.ownerID == '') {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Ownerid is missing, Please go to Tax Payment tab and select Property');
        return;
      }
      if (!billBookNo) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select Bill book No');
        return;
      }
      if (!invoiceNo) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select invoice number');
        return;
      }
      if (paymentMode == 'UPI' && transactionId == '') {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please fill the TransactionID of UPI payment');
        return;
      }
      if (
        (paymentMode == 'Cheque' || paymentMode == 'DD' || paymentMode == 'NEFT' || paymentMode == 'RIGS' || paymentMode == 'Card') &&
        !isFormValid()
      ) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(`Please fill the ${paymentMode}required fields`);
        return;
      }

      const commonData = {
        ownerID: ownerData.ownerID,
        year,
        BillBookNo: billBookNo,
        invoiceNo,
        PaymentMode: paymentMode,
        ...checkFormData,
        transactionId
      };
      const paymentsToProcess = [];

      if (isCurrent) {
        paymentsToProcess.push({
          ...commonData,
          paymentType: 'Current',
          pendingYear: year
        });
      }
      if (isPending) {
        paymentsToProcess.push({
          ...commonData,
          paymentType: 'Pending',
          pendingYear: year - 1
        });
      }
      console.log('paymentsToProcess', paymentsToProcess);

      try {
        //Check Duplicate Invoice
        const res = await checkDuplicateInvoice(paymentsToProcess);
        console.log('duplicate data', res);

        if (res.status === 409) {
          // Duplicate found → show warning dialog
          setDupInvoiceDialog(true);
          setPaymentsToSaveOnDup(paymentsToProcess);
          return;
        } else if (res.status === 200) {
          // No duplicate → directly save
          await saveUpdates(paymentsToProcess);
          setOpen(false);
        } else {
          // Other status codes
          console.warn('Unexpected response:', res.message);
        }
      } catch (error) {
        // Network or unknown error
        console.error('Error while checking duplicate invoice:', error);
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(error.message || 'Network error. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error saving tax payment:', error);
      const message = error.response?.data?.message || 'Unexpected error occurred. Please try again.';
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage(message);
    }
  };

  //Function to updating tax payment records
  const saveUpdates = async (paymentsToProcess) => {
    console.log('save update payment reach', paymentsToProcess);
    const { data, status } = await saveUpdatedTaxPayment(paymentsToProcess);
    console.log('handleSaveTaxUpdates tax payment', data, status);
    if (status == 200 && data.success) {
      // ✅ Update EditableTaxDetails in frontend
      if (isDisabled) {
        setFormData({
          chequeNo: '',
          name: '',
          bankName: '',
          branchName: '',
          ifsc: '',
          date: null,
          expiryDate: null
        });
      }
      if (!isUPI) {
        setTransactionId('');
      }
      const updatedEditable = EditableTaxDetails.map((item) => {
        if (item['Payment Type'] == 'Current' && isCurrent) {
          return {
            ...item,
            'Payment Mode': paymentsToProcess[0].PaymentMode,
            'Bill Book No': paymentsToProcess[0].BillBookNo,
            'Invoice No': paymentsToProcess[0].invoiceNo,
            'DD/Cheque No': checkFormData.chequeNo || null,
            'Payee Name': checkFormData.name || null,
            'Bank Name': checkFormData.bankName || null,
            'Branch Name': checkFormData.branchName || null,
            'DD/Cheque Date': checkFormData.date ? new Date(checkFormData.date) : null,
            'Expiry Date': checkFormData.expiryDate ? new Date(checkFormData.expiryDate) : null,
            'IFSC No': checkFormData.ifsc || null,
            'Transaction ID': transactionId || null
          };
        } else if (item['Payment Type'] == 'Pending' && isPending) {
          return {
            ...item,
            'Payment Mode': paymentsToProcess[0].PaymentMode,
            'Bill Book No': paymentsToProcess[0].BillBookNo,
            'Invoice No': paymentsToProcess[0].invoiceNo,
            'DD/Cheque No': checkFormData.chequeNo || null,
            'Payee Name': checkFormData.name || null,
            'Bank Name': checkFormData.bankName || null,
            'Branch Name': checkFormData.branchName || null,
            'DD/Cheque Date': checkFormData.date ? new Date(checkFormData.date) : null,
            'Expiry Date': checkFormData.expiryDate ? new Date(checkFormData.expiryDate) : null,
            'IFSC No': checkFormData.ifsc || null,
            'Transaction ID': transactionId || null
          };
        }
        return item;
      });

      setEditableTaxDetails(updatedEditable);
      console.log('✅ Updated EditableTaxDetails:', updatedEditable);
      setBillBookNo('');
      setInvoiceNo('');
      setPaymentMode('');
      setTransactionId('');
      setFormData({
        chequeNo: '',
        name: '',
        bankName: '',
        branchName: '',
        ifsc: '',
        date: null,
        expiryDate: null
      });
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setReceivedMessage(data.message);
    } else {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage(data.message || 'Error saving tax payment updates');
      setOpen(false);
      return;
    }
  };

  //Handle function to delete tax payment entry
  const handleDeleteTaxPayment = async () => {
    try {
      const selectedTax = isCurrent ? currentTax : pendingTax;

      const paymentData = {
        OwnerID: ownerData.ownerID,
        FinanceYear: selectedTax?.['Finance Year'] || year,
        BillBookNo: selectedTax?.['Bill Book No'] || '',
        InvoiceNo: selectedTax?.['Invoice No'] || '',
        PendingYear: selectedTax?.['Pending Year'] || '',
        PaymentType: paymentTypeLabel
      };

      const { data, status } = await deleteTaxPayment(paymentData);
      console.log('delete transaction', data, status);
      if (status == 200 && data.success == true) {
        setSnackbarOpen(true);
        setSnackbarSeverity('success');
        setReceivedMessage(data.message || 'Tax payment entry deleted successfully');
        setCurrentTax({});
        setPendingTax({});
        setIsCurrent(false);
        setIsPending(false);
        setEditableTaxDetails([]);
        setTotalPaid([]);
        setOpenDeleteDialog(false);
      } else {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(data.message || 'Failed to delete tax payment entry.');
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error('Unexpected error deleting tax payment:', error);
      const message = error.response?.data?.message || 'Unexpected error occurred. Please try again.';
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage(message);
    }
  };

  //useEffect to set current and pending tax for changing prop val EditableTaxDetails
  useEffect(() => {
    const current = EditableTaxDetails.find((item) => item['Payment Type'] === 'Current') || {};
    const pending = EditableTaxDetails.find((item) => item['Payment Type'] === 'Pending') || {};

    setCurrentTax(current);
    setPendingTax(pending);

    setIsCurrent(EditableTaxDetails.some((item) => item['Payment Type'] === 'Current'));
    setIsPending(EditableTaxDetails.some((item) => item['Payment Type'] === 'Pending'));

    console.log('currentTax 3rd tab', current);
    console.log('pendingTax 3rd tab', pending);
  }, [EditableTaxDetails]);

  //useEffect to set billBookList
  useEffect(() => {
    if (!year || allBillBookData.length === 0) return;

    const filteredBillBooks = allBillBookData.filter((entry) => entry.Year === year).map((entry) => entry.BillBookNo);

    setBillBookNoList([...new Set(filteredBillBooks)]);
  }, [year, allBillBookData, EditableTaxDetails]);

  //to set emp name when Edit
  useEffect(() => {
    if (allBillBookData.length == 0) return;
    let billBookNoforEdit, empId;

    if (isCurrent) {
      billBookNoforEdit = currentTax['Bill Book No'];
      empId = currentTax.EmpID;
    } else {
      billBookNoforEdit = pendingTax['Bill Book No'];
      empId = pendingTax.EmpID;
    }

    // Find the editable tax record for the same empId (if any)
    const editableEntry = allBillBookData.filter(
      (entry) => entry.Year == year && entry.BillBookNo == billBookNoforEdit && entry.UserID == empId
    );

    // Set employee name (priority: editable entry → first match)
    if (editableEntry.length > 0) {
      const { EmpName } = editableEntry[0];
      setEmpName(EmpName);
    }
    console.log('match record', billBookNoforEdit, empId, editableEntry);
  }, [allBillBookData, isCurrent, isPending]);

  //useEffect to set InvoiceNoList
  useEffect(() => {
    if (!billBookNo || !year || allBillBookData.length === 0) return;
    // Filter all entries for the selected year and bill book number
    const filteredEntries = allBillBookData.filter((entry) => entry.Year === year && entry.BillBookNo === billBookNo);
    if (filteredEntries.length > 0) {
      const { ReceiptNoFrom, ReceiptNoTo, EmpName } = filteredEntries[0];
      const numberRange = Array.from({ length: ReceiptNoTo - ReceiptNoFrom + 1 }, (_, i) => ReceiptNoFrom + i);

      setInvoiceNoList(numberRange);
      setEmpName(EmpName);
    } else {
      setInvoiceNoList([]);
      setEmpName('');
    }
  }, [billBookNo, year, billBookNoList, EditableTaxDetails]);

  //fetch all bank names
  const fetchAllBankNames = async () => {
    try {
      const res = await fetchAllBanks();
      console.log('Banks record', res);
      setBankList(res);
    } catch (error) {
      console.error('Error to fetch banks', error);
    }
  };
  useEffect(() => {
    fetchAllBankNames();
  }, []);
  useEffect(() => {
    console.log('PaymentData To process', paymentsToSaveOnDup);
  }, [paymentsToSaveOnDup]);
  return (
    <MainCard title="From AMC Transaction ">
      <MainCard>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <InputLabel>Finacial Year</InputLabel>
              <TextField required value={isCurrent ? currentTax['Finance Year'] : pendingTax['Finance Year']} />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <InputLabel>
                <span style={{ color: 'red' }}>* </span>Ward No.
              </InputLabel>
              <TextField required value={ownerData.NewWardNo} />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <InputLabel>
                <span style={{ color: 'red' }}>* </span>Property No.
              </InputLabel>
              <TextField value={ownerData.NewPropertyNo} required />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <InputLabel>
                <span style={{ color: 'red' }}>* </span>Partition No.
              </InputLabel>
              <TextField required value={ownerData.NewPartitionNo} />
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Stack spacing={1}>
              <InputLabel>Owner Name</InputLabel>
              <TextField value={ownerData.OwnerName} />
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={1}>
              <InputLabel>Renter Name</InputLabel>
              <TextField required value={ownerData.RenterName} />
            </Stack>
          </Grid>
        </Grid>
      </MainCard>

      {/* <Box marginTop={2} sx={{ textAlign: 'center' }}>
        <div style={{ width: '100%', borderBottom: '1px solid gray', margin: '10px auto' }} />
      </Box> */}

      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <MainCard>
              <Grid container spacing={2} marginTop={1}>
                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <InputLabel>Payment Mode</InputLabel>
                    <TextField
                      id="payment-select"
                      value={isCurrent ? currentTax['Payment Mode'] : isPending ? pendingTax['Payment Mode'] : ''}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <InputLabel>Payment Type</InputLabel>
                    <TextField required value={paymentTypeLabel} />
                  </Stack>
                </Grid>
                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <InputLabel>Amount</InputLabel>
                    <TextField required value={totalAmount} />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={2} marginTop={1}>
                <Grid item xs={3.5}>
                  <Stack spacing={1}>
                    <InputLabel>Bill Book No.</InputLabel>
                    <TextField required value={isCurrent ? currentTax['Bill Book No'] : isPending ? pendingTax['Bill Book No'] : ''} />
                  </Stack>
                </Grid>
                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice No.</InputLabel>
                    <TextField required value={isCurrent ? currentTax['Invoice No'] : isPending ? pendingTax['Invoice No'] : ''} />
                  </Stack>
                </Grid>
                <Grid item xs={5.5}>
                  <Stack spacing={1}>
                    <InputLabel>Transaction Date</InputLabel>
                    <TextField
                      required
                      value={
                        isCurrent
                          ? dayjs(currentTax['Transaction Date']).format('MM/DD/YYYY')
                          : isPending
                            ? dayjs(pendingTax['Transaction Date']).format('MM/DD/YYYY')
                            : ''
                      }
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2} marginTop={1}>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel>Recieved By</InputLabel>
                    <TextField required value={empName} />
                  </Stack>
                </Grid>

                <Grid item xs={3}>
                  <Stack spacing={1}>
                    <InputLabel>Bill No.</InputLabel>
                    <TextField required value={isCurrent ? currentTax['Bill No'] : isPending ? pendingTax['Bill No'] : ''} />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={1} marginTop={1}>
                <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Cheque/DD Details
                </Typography>
                <Grid container spacing={2} marginTop={1}>
                  <Grid item xs={3}>
                    <Stack spacing={1}>
                      <InputLabel>DD No.</InputLabel>
                      <TextField
                        required
                        value={
                          isCurrent
                            ? currentTax['DD/Cheque No']
                              ? currentTax['DD/Cheque No']
                              : ''
                            : pendingTax['DD/Cheque No']
                              ? pendingTax['DD/Cheque No']
                              : ''
                        }
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={5}>
                    <Stack spacing={1}>
                      <InputLabel>Date</InputLabel>
                      <TextField
                        required
                        value={
                          isCurrent
                            ? currentTax['DD/Cheque Date']
                              ? dayjs(currentTax['DD/Cheque Date']).format('MM/DD/YYYY')
                              : ''
                            : pendingTax['DD/Cheque Date']
                              ? dayjs(pendingTax['DD/Cheque Date']).format('MM/DD/YYYY')
                              : ''
                        }
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>Cheque/DD ExpireDate</InputLabel>
                      <TextField
                        required
                        value={
                          isCurrent
                            ? currentTax['Expiry Date']
                              ? dayjs(currentTax['Expiry Date']).format('MM/DD/YYYY')
                              : ''
                            : pendingTax['Expiry Date']
                              ? dayjs(pendingTax['Expiry Date']).format('MM/DD/YYYY')
                              : ''
                        }
                        InputProps={{
                          readOnly: true
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2} marginTop={1}>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Payee Name</InputLabel>
                      <TextField
                        required
                        value={
                          isCurrent
                            ? currentTax['Payee Name']
                              ? currentTax['Payee Name']
                              : ''
                            : pendingTax['Payee Name']
                              ? pendingTax['Payee Name']
                              : ''
                        }
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Bank Name</InputLabel>
                      <TextField
                        required
                        value={
                          isCurrent
                            ? currentTax['Bank Name']
                              ? currentTax['Bank Name']
                              : ''
                            : pendingTax['Bank Name']
                              ? pendingTax['Payee Name']
                              : ''
                        }
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2} marginTop={1}>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel>Branch Name</InputLabel>
                      <TextField
                        required
                        value={
                          isCurrent
                            ? currentTax['Branch Name']
                              ? currentTax['Branch Name']
                              : ''
                            : pendingTax['Branch Name']
                              ? pendingTax['Branch Name']
                              : ''
                        }
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>Bank IFSC No.</InputLabel>
                      <TextField
                        required
                        value={
                          isCurrent
                            ? currentTax['IFSC No']
                              ? currentTax['IFSC No']
                              : ''
                            : pendingTax['IFSC No']
                              ? pendingTax['IFSC No']
                              : ''
                        }
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={1} marginTop={1}>
                <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', mt: 2, fontWeight: 'bold' }}>
                  Online Payment Details
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <Stack spacing={1}>
                      <InputLabel>Transaction Id:</InputLabel>
                      <TextField
                        required
                        name="transaction-id"
                        value={
                          isCurrent
                            ? currentTax['Transaction ID']
                              ? currentTax['Transaction ID']
                              : ''
                            : pendingTax['Transaction ID']
                              ? pendingTax['Transaction ID']
                              : ''
                        }
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MainCard>
              <Box sx={{ overflowX: 'auto', height: '725px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type Of Taxes</TableCell>
                      {currentTax && <TableCell>Current</TableCell>}
                      {pendingTax && <TableCell>Pending</TableCell>}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {EditableTaxDetails?.length > 0 &&
                      columnOrder.map((col) => (
                        <TableRow key={col}>
                          <TableCell>{col}</TableCell>

                          {currentTax && <TableCell>{currentTax[col] ?? '-'}</TableCell>}

                          {pendingTax && <TableCell>{pendingTax[col] ?? '-'}</TableCell>}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
              <Grid container spacing={2} marginTop={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="success" onClick={handleOpenDialog} >
                      Edit
                    </Button>

                    {/* ✅ Single Dialog Box */}
                    <Dialog
                      open={open}
                      onClose={handleCloseDialog}
                      PaperProps={{
                        sx: {
                          width: '800px', // increased width
                          height: 'auto',
                          maxHeight: '110vh'
                        }
                      }}
                    >
                      <DialogTitle>Edit Bill Details</DialogTitle>

                      <DialogContent>
                        {/* --- Common Fields --- */}
                        <Grid container spacing={2} marginTop={1}>
                          {/* Bill Book No */}
                          <Grid item xs={12} sm={8}>
                            <Stack spacing={1}>
                              <InputLabel>
                                <span style={{ color: 'red' }}>*</span> Bill Book No
                              </InputLabel>
                              <Select
                                id="billBook-select"
                                value={billBookNo}
                                onChange={handleBillBookNo}
                                MenuProps={{
                                  PaperProps: { style: { maxHeight: 150, overflowY: 'auto' } }
                                }}
                              >
                                {billBookNoList.map((billBookNo, index) => (
                                  <MenuItem key={index} value={billBookNo}>
                                    {billBookNo}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                          </Grid>

                          {/* Invoice No */}
                          <Grid item xs={12} sm={8}>
                            <Stack spacing={1}>
                              <InputLabel>
                                <span style={{ color: 'red' }}>*</span> Invoice No.
                              </InputLabel>
                              <Select
                                id="invoice-select"
                                value={invoiceNo}
                                onChange={handleInvoiceNo}
                                MenuProps={{
                                  PaperProps: { style: { maxHeight: 150, overflowY: 'auto' } }
                                }}
                              >
                                {invoiceNoList.map((invoiceNo, index) => (
                                  <MenuItem key={index} value={invoiceNo}>
                                    {invoiceNo}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                          </Grid>

                          {/* Payment Mode */}
                          <Grid item xs={12} sm={8}>
                            <Stack spacing={1}>
                              <InputLabel>Payment Mode</InputLabel>
                              <Select
                                id="payment-select"
                                value={paymentMode}
                                onChange={handlePaymentModeChange}
                                MenuProps={{
                                  PaperProps: { style: { maxHeight: 150, overflowY: 'auto' } }
                                }}
                              >
                                {Object.values(paymentLabels).map((label) => (
                                  <MenuItem key={label} value={label}>
                                    {label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                          </Grid>

                          {/* --- Conditional Fields --- */}
                          {paymentMode === 'UPI' && (
                            <Grid item xs={12} sm={3}>
                              <Stack spacing={1}>
                                <InputLabel>Transaction ID</InputLabel>
                                <TextField
                                  required
                                  name="transaction-id"
                                  value={transactionId}
                                  onChange={handleTransactionId}
                                  disabled={!isUPI}
                                  inputProps={{
                                    maxLength: 20,
                                    inputMode: 'text',
                                    pattern: '[A-Za-z0-9._-]*',
                                    title: 'Only letters, numbers, dots, underscores, or hyphens allowed'
                                  }}
                                />
                              </Stack>
                            </Grid>
                          )}

                          {(paymentMode === 'Cheque' ||
                            paymentMode === 'DD' ||
                            paymentMode === 'NEFT' ||
                            paymentMode === 'RIGS' ||
                            paymentMode === 'Card') && (
                            <MainCard title="DD/Cheque Details">
                              <Grid container spacing={2}>
                                {/* Cheque No */}
                                <Grid item xs={12} sm={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>
                                      <span style={{ color: 'red' }}>* </span>DD/Cheque No.
                                    </InputLabel>
                                    <TextField
                                      required
                                      type="number"
                                      name="chequeNo"
                                      value={checkFormData.chequeNo}
                                      onChange={handleCheckData}
                                      disabled={isDisabled}
                                      inputProps={{
                                        min: 0,
                                        pattern: '[0-9]*',
                                        inputMode: 'numeric',
                                        maxLength: 6
                                      }}
                                    />
                                  </Stack>
                                </Grid>

                                {/* Name */}
                                <Grid item xs={12} sm={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>Name</InputLabel>
                                    <TextField
                                      required
                                      name="name"
                                      value={checkFormData.name}
                                      onChange={handleCheckData}
                                      disabled={isDisabled}
                                      inputProps={{ pattern: '[a-zA-Zs]*' }}
                                    />
                                  </Stack>
                                </Grid>

                                {/* Bank Name */}
                                <Grid item xs={12} sm={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>
                                      <span style={{ color: 'red' }}>* </span>Bank Name
                                    </InputLabel>
                                    <Autocomplete
                                      freeSolo
                                      options={bankList.map((b) => b.BankName)}
                                      value={checkFormData.bankName || ''}
                                      onInputChange={(e, newValue) => handleCheckData(newValue, 'bankName')}
                                      disabled={isDisabled}
                                      renderInput={(params) => <TextField {...params} required />}
                                    />
                                  </Stack>
                                </Grid>

                                {/* Branch Name */}
                                <Grid item xs={12} sm={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>Branch Name</InputLabel>
                                    <TextField
                                      required
                                      name="branchName"
                                      value={checkFormData.branchName}
                                      onChange={handleCheckData}
                                      disabled={isDisabled}
                                      inputProps={{ pattern: '[a-zA-Zs]*' }}
                                    />
                                  </Stack>
                                </Grid>

                                {/* IFSC */}
                                <Grid item xs={12} sm={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>Bank IFSC No.</InputLabel>
                                    <TextField
                                      required
                                      name="ifsc"
                                      value={checkFormData.ifsc}
                                      onChange={handleCheckData}
                                      disabled={isDisabled}
                                    />
                                  </Stack>
                                </Grid>

                                {/* Date */}
                                <Grid item xs={12} sm={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>
                                      <span style={{ color: 'red' }}>* </span>Date
                                    </InputLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        value={checkFormData.date ? dayjs(checkFormData.date) : null}
                                        onChange={(newValue) => setFormData({ ...checkFormData, date: newValue })}
                                        disabled={isDisabled}
                                      />
                                    </LocalizationProvider>
                                  </Stack>
                                </Grid>

                                {/* Expiry Date */}
                                <Grid item xs={12} sm={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>
                                      <span style={{ color: 'red' }}>* </span>Expiry Date
                                    </InputLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        value={checkFormData.expiryDate ? dayjs(checkFormData.expiryDate) : null}
                                        onChange={(newValue) =>
                                          setFormData({
                                            ...checkFormData,
                                            expiryDate: newValue
                                          })
                                        }
                                        disabled={isDisabled}
                                      />
                                    </LocalizationProvider>
                                  </Stack>
                                </Grid>

                              </Grid>
                            </MainCard>
                          )}
                        </Grid>
                      </DialogContent>

                      <DialogActions>
                        <Button variant="contained" color="success" onClick={handleSaveTaxUpdates}>
                          Save
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseDialog}>
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                </Grid>
                {/* DUPLICATE INVOICE WARNING */}
                <Dialog
                  open={dupInvoiceDialog}
                  onClose={() => setDupInvoiceDialog(false)}
                  PaperProps={{ sx: { width: 300, height: 200, overflow: 'hidden' } }}
                >
                  <DialogContent>
                    <p>⚠️ Warning! Duplicate Invoice No. Found. Continue?</p>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        setLevelName('L2');
                        setDupInvoiceDialog(false);
                        setAllowDupInvoice(true); // show password dialog
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setDupInvoiceDialog(false);
                        setAllowDupInvoice(false);
                      }}
                    >
                      No
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* PASSWORD DIALOG */}
                <Dialog open={allowDupInvoice} onClose={handleClosePassDialog} fullWidth maxWidth="xs">
                  <DialogTitle>{levelname}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Enter Security Password</DialogContentText>
                    <TextField
                      required
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={async () => {
                        await handleCheckPassword();
                      }}
                    >
                      Ok
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleClosePassDialog}>
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
                {/* Other Buttons */}
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="secondary" onClick={CloseButton}>
                      Close
                    </Button>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="error" onClick={() => setOpenDeleteDialog(true)}>
                      Delete
                    </Button>

                    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                      <DialogContent>
                        <p>Do you want to Delete Bill Transaction Entry?</p>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleDeleteTaxPayment} color="primary">
                          Confirm
                        </Button>
                        <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                </Grid>
              </Grid>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <SnackbarContent
                  sx={{
                    backgroundColor: snackbarSeverity === 'success' ? 'green' : snackbarSeverity === 'warning' ? 'grey' : 'red'
                  }}
                  message={receivedMessage}
                />
              </Snackbar>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </MainCard>
  );
}

export default FromTranField;
