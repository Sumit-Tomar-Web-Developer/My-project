import {
  Button,
  Grid,
  InputLabel,
  Stack,
  Checkbox,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  MenuItem,
  Select,
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import IconButton from '@mui/material/IconButton';

import MainCard from 'components/MainCard';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { getFinanceYear } from 'services/utlilityService/AddTaxService/AddTaxService';
import { getPaymentGatewayDetails, getAllTransactionPaymentGatewayDetails, approveTransaction, disApproveTransaction } from 'services/transaction/approvalOnlineTransaction/approvalOnlineTransaction';
import { toDate } from 'date-fns';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}


const labelStyle = {
  fontSize: "Medium",
  fontWeight: 'bold',
  color: 'red'
};

const valueStyle = {
  fontSize: 14,
  fontWeight: 500
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function ApproveOnlineTransaction() {
  const [value, setValue] = useState(0);                                   // For selecting Tab
  const [financeYearList, setFinanceYearList] = useState([]);                // Year List
  const [financeYear, setFinanceYear] = useState('');                        // For First Tab
  const [financeYearForAll, setFinanceYearForAll] = useState('');              // For Second Tab 
  const [paymentGatewayDetailsList, setPaymentGatewayDetailsList] = useState([]);
  const [allTransactionList, setAllTransactionList] = useState([]);
  const [showInitiatedDetails, setShowInitiatedDetails] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [transactionID, setTransactionID] = useState('');
  const [orginalTransactionList, setOrginalTransactionList] = useState([]);
  const [orginalAllTransactionList, setOrginalAllTransactionList] = useState([])
  const [filterInitiatedDetails, setFilterInitiatedDetails] = useState({
    fromDate: '',
    toDate: '',
    wardNo: '',
    propertyNo: ''
  });
  const [filterAllTransactionDetails, setFilterAllTransactionDetails] = useState({
    status: 'All',
    fromDate: '',
    toDate: '',
    wardNo: '',
    propertyNo: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarSeverity, setSnackbarSeverity] = useState('')
  const [receivedMessage, setReceivedMessage] = useState('')

  const handleMoreDetails = (row) => {
    setSelectedRow(row);
    setShowInitiatedDetails(true);
  };
  const handleSearchInitiatedDetails = () => {

    let filteredList = orginalTransactionList;

    if (filterInitiatedDetails.fromDate) {
      const fromDate = new Date(filterInitiatedDetails.fromDate);
      filteredList = filteredList.filter((item) => new Date(item.TransactionDate) >= fromDate);
    }
    if (filterInitiatedDetails.toDate) {
      const toDate = new Date(filterInitiatedDetails.toDate);
      filteredList = filteredList.filter((item) => new Date(item.TransactionDate) <= toDate);
    }
    if (filterInitiatedDetails.wardNo) {
      filteredList = filteredList.filter((item) => item.propertymast?.NewWardNo == filterInitiatedDetails.wardNo);
    }
    if (filterInitiatedDetails.propertyNo) {
      filteredList = filteredList.filter((item) => item.propertymast?.NewPropertyNo == filterInitiatedDetails.propertyNo);
    }
    console.log('Filtered List:', filteredList);
    setPaymentGatewayDetailsList(filteredList);

  };
  const handleClearInitiatedDetails = () => {
    setFilterInitiatedDetails({
      fromDate: '',
      toDate: '',
      wardNo: '',
      propertyNo: ''
    });
    setPaymentGatewayDetailsList(orginalTransactionList);
  };
  const handleApproveTransaction = async () => {
    try {
      if (transactionID == null || transactionID == "") {
        setSnackbarSeverity('error')
        setReceivedMessage('Please Fill Transaction ID')
        setSnackbarOpen(true)
        return
      }
      selectedRow.TxnID = transactionID
      const result = await approveTransaction(selectedRow)
      console.log(result, 'result')
      if (result.status = 201 || result.statusText == 'created') {
        setSnackbarSeverity('success')
        setReceivedMessage('Transaction Approved Successfully')
        setSnackbarOpen(true)
      }
      else {
        setSnackbarSeverity('error')
        setReceivedMessage('Transaction Not Approved ')
        setSnackbarOpen(true)
      }
      setTransactionID('')
      setShowInitiatedDetails(false)
    } catch (error) {
      console.log(error, "error in approving transaction")
    }

  }
  const handleDisApproveTransaction = async () => {
    try {
      if (transactionID == null || transactionID == "") {
        setSnackbarSeverity('error')
        setReceivedMessage('Please Fill Transaction ID')
        setSnackbarOpen(true)
        return
      }
      selectedRow.TxnID = transactionID
      const result = await disApproveTransaction(selectedRow)
      if (result.status = 200 || result.statusText == 'ok') {
        setSnackbarSeverity('success')
        setReceivedMessage('Transaction DisApproved Successfully')
        setSnackbarOpen(true)
      }
      else {
        setSnackbarSeverity('error')
        setReceivedMessage('Transaction Not DisApproved ')
        setSnackbarOpen(true)
      }
      setTransactionID('')
      setShowInitiatedDetails(false)
    } catch (error) {
      console.log(error, "error in disapproving transaction")
    }

  }
  const handleSearchAllDetails = () => {

    let filteredList = orginalAllTransactionList;
    if (filterAllTransactionDetails.status != "All") {
      filteredList = filteredList.filter((item) => item?.TxnStatus == filterAllTransactionDetails.status)
    }
    if (filterAllTransactionDetails.fromDate) {
      const fromDate = new Date(filterAllTransactionDetails.fromDate);
      filteredList = filteredList.filter((item) => new Date(item.TransactionDate) >= fromDate);
    }
    if (filterAllTransactionDetails.toDate) {
      const toDate = new Date(filterAllTransactionDetails.toDate);
      filteredList = filteredList.filter((item) => new Date(item.TransactionDate) <= toDate);
    }
    if (filterAllTransactionDetails.wardNo) {
      filteredList = filteredList.filter((item) => item.propertymast?.NewWardNo == filterAllTransactionDetails.wardNo);
    }
    if (filterAllTransactionDetails.propertyNo) {
      filteredList = filteredList.filter((item) => item.propertymast?.NewPropertyNo == filterAllTransactionDetails.propertyNo);
    }
    console.log('Filtered List:', filteredList);
    setAllTransactionList(filteredList);

  };
  const handleClearAllDetails = () => {
    setFilterInitiatedDetails({
      status: 'All',
      fromDate: '',
      toDate: '',
      wardNo: '',
      propertyNo: ''
    });
    setAllTransactionList(orginalAllTransactionList);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  useEffect(() => {
    const financeYear = async () => {
      const result = await getFinanceYear();

      setFinanceYearList(result);

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;

      // Financial year logic (India)
      const currentFY =
        currentMonth >= 4
          ? `${currentYear}-${currentYear + 1}`
          : `${currentYear - 1}-${currentYear}`;

      // Check if current FY exists in API list
      const matchedFY = result.find(
        (item) => item.FinanceYear == currentYear
      );

      console.log('matchedFY', matchedFY);
      if (matchedFY) {
        setFinanceYear(matchedFY.FinanceYear);
        setFinanceYearForAll(matchedFY.FinanceYear)
      } else {
        // fallback
        setFinanceYear(result[0]?.FinanceYear);
        setFinanceYearForAll(result[0]?.FinanceYear)
      }
    };

    financeYear();
  }, []);
  useEffect(() => {
    const getTransactionDetails = async () => {
      const result = await getPaymentGatewayDetails(financeYear);
      console.log('Payment Gateway Details:', result);
      setPaymentGatewayDetailsList(result);
      setOrginalTransactionList(result);
    }
    getTransactionDetails()


  }, [financeYear, showInitiatedDetails]);

  useEffect(() => {
    const getAllTransactionDetails = async () => {
      const result = await getAllTransactionPaymentGatewayDetails(financeYearForAll);
      console.log('All Payment Gateway Details:', result);
      setAllTransactionList(result);
      setOrginalAllTransactionList(result);
    }
    getAllTransactionDetails()
  }, [financeYearForAll])
  useEffect(() => {
    console.log('Payment Gateway Details List Updated:', selectedRow);
  }, [paymentGatewayDetailsList, selectedRow, transactionID]);

  return (
    <MainCard title="Payment Transaction Status">
      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={(e, v) => setValue(v)}>
          <Tab label="Initiated Transaction Details" {...a11yProps(0)} />
          <Tab label="All Transaction Details" {...a11yProps(1)} />
        </Tabs>

        {/* TAB 1 */}
        <TabPanel value={value} index={0}>
          <Typography variant="h4" sx={{ mb: 3, color: 'blue', fontWeight: 'bold' }}>
            Initiated Transaction Details
          </Typography>

          <Grid container spacing={3} mb={2}>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 2, fontWeight: 'bold' }}>Year</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <Select sx={{ minWidth: 120 }} defaultValue={financeYear}
                    value={financeYear} onChange={(e) => setFinanceYear(e.target.value)}>
                    {financeYearList && financeYearList.map((year) => (
                      <MenuItem key={year.FinanceYear} value={year.FinanceYear}>
                        {year.FinanceYear}
                      </MenuItem>
                    ))}

                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>From Date</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={
                        filterInitiatedDetails.fromDate
                          ? dayjs(filterInitiatedDetails.fromDate, "MM/DD/YYYY")
                          : null
                      }
                      onChange={(newValue) =>
                        setFilterInitiatedDetails((p) => ({
                          ...p,
                          fromDate: newValue ? newValue.format("MM/DD/YYYY") : null
                        }))
                      }
                      minDate={dayjs(`${financeYear}-01-01`)} // ✅ correct
                      maxDate={dayjs()}                                    // ✅ today
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: { width: 195 },
                          inputProps: { readOnly: true }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Ward No</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField value={filterInitiatedDetails.wardNo} onChange={(e) => setFilterInitiatedDetails({ ...filterInitiatedDetails, wardNo: e.target.value })} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>To Date</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={
                        filterInitiatedDetails.toDate
                          ? dayjs(filterInitiatedDetails.toDate, "MM/DD/YYYY")
                          : null
                      }
                      onChange={(newValue) =>
                        setFilterInitiatedDetails((p) => ({
                          ...p,
                          toDate: newValue ? newValue.format("MM/DD/YYYY") : null
                        }))
                      }
                      minDate={dayjs(`${financeYear}-01-01`)} // ✅ correct
                      maxDate={dayjs()}                                    // ✅ today
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: { width: 195 },
                          inputProps: { readOnly: true }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Property No</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField value={filterInitiatedDetails.propertyNo} onChange={(e) => setFilterInitiatedDetails({ ...filterInitiatedDetails, propertyNo: e.target.value })} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" mt={3} gap={3}>
            <Button variant="contained" onClick={handleSearchInitiatedDetails}>Search</Button>
            <Button variant="contained" color="secondary" onClick={handleClearInitiatedDetails}>Clear</Button>
            <Button variant="contained" color="success">Save To File</Button>
          </Box>

          {!showInitiatedDetails ? (
            /* ================= TABLE VIEW ================= */
            <TableContainer sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><b>Ward No</b></TableCell>
                    <TableCell align="center"><b>Property No</b></TableCell>
                    <TableCell align="center"><b>Partition No</b></TableCell>
                    <TableCell align="center"><b>Tax Payer Name</b></TableCell>
                    <TableCell align="center"><b>BillBook No</b></TableCell>
                    <TableCell align="center"><b>Invoice No</b></TableCell>
                    <TableCell align="center"><b>Payment Type</b></TableCell>
                    <TableCell align="center"><b>Transaction Date</b></TableCell>
                    <TableCell align="center"><b>Amount</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paymentGatewayDetailsList?.length > 0 ? (
                    paymentGatewayDetailsList.map((row, index) => (
                      <TableRow
                        key={index}
                        hover
                        onClick={() => handleMoreDetails(row)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell align="center">{row?.propertymast?.NewWardNo}</TableCell>
                        <TableCell align="center">{row?.propertymast?.NewPropertyNo}</TableCell>
                        <TableCell align="center">{row?.propertymast?.NewPartitionNo}</TableCell>
                        <TableCell align="center">{row?.PayeeName}</TableCell>
                        <TableCell align="center">{row?.BillBookNo}</TableCell>
                        <TableCell align="center">{row?.InvoiceNo}</TableCell>
                        <TableCell align="center">{row?.PaymentType}</TableCell>
                        <TableCell align="center">
                          {row?.TransactionDate
                            ? new Date(row.TransactionDate).toLocaleDateString()
                            : ""}
                        </TableCell>
                        <TableCell align="center">{row?.Amount}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>


              </Table>
            </TableContainer>
          ) : (
            /* ================= INITIATED TRANSACTION DETAILS ================= */
            <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
              <Typography variant="h5" mb={2}>
                Initiated Transaction Detail
              </Typography>

              <Grid container spacing={4}>

                {/* ===== Transaction ID (Top – Separate) ===== */}
                <Grid item xs={12} display="flex" >
                  <TextField
                    label="Transaction ID"
                    value={transactionID}
                    sx={{ width: '50%' }}
                    onChange={(e) => setTransactionID(e.target.value)}
                  />
                </Grid>

                {/* ===== Ward / Property / Partition (One Line) ===== */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={4} display="flex" justifyContent="center">
                      <TextField
                        label="Ward No"
                        value={selectedRow?.propertymast.NewWardNo || ''}
                        fullWidth

                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        label="Property No"
                        value={selectedRow?.propertymast.NewPropertyNo || ''}
                        fullWidth

                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        label="Partition No"
                        value={selectedRow?.propertymast.NewPartitionNo || ''}
                        fullWidth

                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* ===== Tax Payer / Renter Name ===== */}
                <Grid item xs={6}>
                  <TextField
                    label="Tax Payer Name"
                    value={selectedRow?.PayeeName || ''}
                    fullWidth

                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Renter Name"
                    value={selectedRow?.combinedownerrentername?.RenterName || ''}
                    fullWidth

                  />
                </Grid>

                {/* ===== Email / Mobile No ===== */}
                <Grid item xs={6}>
                  <TextField
                    label="Email"
                    value={selectedRow?.Email || ''}
                    fullWidth

                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Mobile No"
                    value={selectedRow?.MobileNumber || ''}
                    fullWidth

                  />
                </Grid>

                <Box
                  sx={{
                    m: 4,
                    display: 'grid',
                    justifyContent: 'center',
                    gap: 4,
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',  // mobile
                      sm: 'repeat(3, 1fr)',  // tablet
                      md: 'repeat(4, 1fr)',  // laptop
                      lg: 'repeat(7, 1fr)'   // desktop
                    },
                    textAlign: 'center'
                  }}
                >
                  {[
                    { label: 'Reference No', value: selectedRow?.MerchantTxnRefNumber || '' },
                    { label: 'Amount', value: selectedRow?.Amount || '' },
                    { label: 'Transaction Date', value: new Date(selectedRow?.TransactionDate).toLocaleString() || '' },
                    { label: 'BillBook No', value: selectedRow?.BillBookNo || '' },
                    { label: 'Invoice No', value: selectedRow?.InvoiceNo || '' },
                    { label: 'Payment Mode', value: selectedRow?.PaymentMode || '' },
                    { label: 'Payment Resource', value: selectedRow?.PaymentResource }
                  ].map((item, index) => (
                    <Box key={index}>
                      <InputLabel sx={labelStyle}>{item.label}</InputLabel>
                      <InputLabel sx={valueStyle}>{item.value || '-'}</InputLabel>
                    </Box>
                  ))}
                </Box>


              </Grid>


              <Box display="flex" justifyContent="center" mt={3} gap={2}>

                <Button
                  color='success'
                  variant="contained"
                  onClick={handleApproveTransaction}
                >
                  Approve
                </Button>
                <Button
                  color='error'
                  variant="contained"
                  onClick={handleDisApproveTransaction}
                >
                  Disapprove
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setShowInitiatedDetails(false);
                    setSelectedRow(null);
                  }}
                >
                  Back to List
                </Button>
              </Box>
            </Box>
          )}


        </TabPanel>

        {/* TAB 2 */}
        <TabPanel value={value} index={1}>
          <Typography variant="h4" sx={{ mb: 3, color: 'blue', fontWeight: 'bold' }}>
            All Transactions Details
          </Typography>



          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}> Status</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <Select sx={{ minWidth: 120 }} defaultValue={filterAllTransactionDetails.status}
                    value={filterAllTransactionDetails.status}
                    onChange={(e) => setFilterAllTransactionDetails((p) => ({ ...p, status: e.target.value }))}>
                    <MenuItem value='All'>All</MenuItem>
                    <MenuItem value='Success'>Success</MenuItem>
                    <MenuItem value='Failed'>Failed</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>From Date</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={
                        filterAllTransactionDetails.fromDate
                          ? dayjs(filterAllTransactionDetails.fromDate, "MM/DD/YYYY")
                          : null
                      }
                      onChange={(newValue) =>
                        setFilterAllTransactionDetails((p) => ({
                          ...p,
                          fromDate: newValue ? newValue.format("MM/DD/YYYY") : null
                        }))
                      }
                      minDate={dayjs(`${financeYearForAll}-01-01`)} // ✅ correct
                      maxDate={dayjs()}                                    // ✅ today
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: { width: 195 },
                          inputProps: { readOnly: true }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Ward No</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField value={filterAllTransactionDetails.wardNo} onChange={(e) => setFilterAllTransactionDetails((p) => ({ ...p, wardNo: e.target.value }))} />
                </Grid>
              </Grid>
            </Grid>


            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Year</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <Select sx={{ minWidth: 120 }} defaultValue={financeYearForAll}
                    value={financeYearForAll} onChange={(e) => setFinanceYearForAll(e.target.value)}>
                    {financeYearList && financeYearList.map((year) => (
                      <MenuItem key={year.FinanceYear} value={year.FinanceYear}>
                        {year.FinanceYear}
                      </MenuItem>
                    ))}

                  </Select>
                </Grid>
                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>To Date</InputLabel>
                </Grid>

                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker

                      value={
                        filterAllTransactionDetails.toDate
                          ? dayjs(filterAllTransactionDetails.toDate, "MM/DD/YYYY")
                          : null
                      }
                      onChange={(newValue) =>
                        setFilterAllTransactionDetails((p) => ({
                          ...p,
                          toDate: newValue ? newValue.format("MM/DD/YYYY") : null
                        }))
                      }
                      minDate={dayjs(`${financeYearForAll}-01-01`)} // ✅ correct
                      maxDate={dayjs()}                                    // ✅ today
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: { width: 195 },
                          inputProps: { readOnly: true }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={4}>
                  <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Property No</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <TextField value={filterAllTransactionDetails.propertyNo} onChange={(e) => setFilterAllTransactionDetails((p) => ({ ...p, propertyNo: e.target.value }))} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" mt={3} gap={3}>
            <Button variant="contained" onClick={handleSearchAllDetails}>Search</Button>
            <Button variant="contained" color="secondary" onClick={handleClearAllDetails}>Clear</Button>
          </Box>
          <TableContainer sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b>Ward No</b></TableCell>
                  <TableCell align="center"><b>Property No</b></TableCell>
                  <TableCell align="center"><b>Partition No</b></TableCell>
                  <TableCell align="center"><b>Tax Payer Name</b></TableCell>
                  <TableCell align="center"><b>BillBook No</b></TableCell>
                  <TableCell align="center"><b>Invoice No</b></TableCell>
                  <TableCell align="center"><b>Payment Type</b></TableCell>
                  <TableCell align="center"><b>Transaction Date</b></TableCell>
                  <TableCell align="center"><b>Amount</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {allTransactionList?.length > 0 ? (
                  allTransactionList.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="center">{row?.propertymast?.NewWardNo}</TableCell>
                      <TableCell align="center">{row?.propertymast?.NewPropertyNo}</TableCell>
                      <TableCell align="center">{row?.propertymast?.NewPartitionNo}</TableCell>
                      <TableCell align="center">{row?.PayeeName}</TableCell>
                      <TableCell align="center">{row?.BillBookNo}</TableCell>
                      <TableCell align="center">{row?.InvoiceNo}</TableCell>
                      <TableCell align="center">{row?.PaymentType}</TableCell>
                      <TableCell align="center">
                        {row?.TransactionDate
                          ? new Date(row.TransactionDate).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell align="center">{row?.Amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>


            </Table>
          </TableContainer>
        </TabPanel>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
          }}
          message={receivedMessage}
        />
      </Snackbar>
    </MainCard >

  );
}

export default ApproveOnlineTransaction;

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};
