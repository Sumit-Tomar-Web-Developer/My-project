// material-ui
import {
  Grid,
  Stack,
  TableCell,
  TextField,
  Tab,
  Tabs,
  TableBody,
  Box,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  Paper,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  SnackbarContent
} from '@mui/material';
import PropTypes from 'prop-types';

// project import
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { UndoOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getBillBookList, getTransYear } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import dayjs from 'dayjs';
import { fetchCollectionApprovalData, deleteCollectionEntries } from 'services/transaction/collectionApproval/collectionApproval';
import { set } from 'lodash';

// ==============================|| SAMPLE PAGE ||============================== //
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function CollectionApproval() {
  const [yearTrans, setYearTransList] = useState([]);
  const [year, setFinanceYear] = useState('');
  const [billBookNoList, setBillBookNoList] = useState([]);
  const [billBookNo, setBillBookNo] = useState('');
  const [allBillBookData, setAllBillBookData] = useState({});
  const [invoiceNo, setInvoiceNo] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [cancelHistoryData, setCancelHistoryData] = useState([]);
  const [cancelReason, setCancelReason] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [showCancelTable, setShowCancelTable] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  let selectedTab = 0;
  const [tabValue, setTabValue] = useState(selectedTab);
  // If year is "2025"
  const minDate = dayjs(`01/01/${year}`); // Jan 1st, 2025
  const maxDate = dayjs(`12/31/${year}`); // Dec 31st, 2025

  const tableColumns = [
    { label: 'New Ward No', key: 'NewWardNo' },
    { label: 'New Property No', key: 'NewPropertyNo' },
    { label: 'New Partition No', key: 'NewPartitionNo' },
    { label: 'Bill Book No', key: 'BillBookNo' },
    { label: 'Invoice No', key: 'InvoiceNo' },
    { label: 'Finance Year', key: 'FinanceYear' },
    {
      label: 'Transaction Date',
      key: 'TransactionDate',
      render: (value) => new Date(value).toLocaleString()
    },
    { label: 'Amount', key: 'Amount' }
  ];

 
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    setOpenCancelDialog(false);
  };

  //Financial year change
  const handleFinanceYearChange = (ev) => {
    if (yearTrans) {
      setFinanceYear(ev.target.value);
    } else {
      setFinanceYear('');
    }
  };
  //Handle to change BillBookNo
  const handleBillBookNo = (e) => {
    setBillBookNo(e.target.value);
  };

  // Handle From Date change
  const handleFromDateChange = (newValue) => {
    if (!newValue) {
      setFromDate(null);
      return;
    }

    const selectedDate = dayjs(newValue);
    const today = dayjs();

    // Future date check
    if (selectedDate.isAfter(today, 'day')) {
      setTimeout(() => setFromDate(null), 0);
      setSnackbarSeverity('error');
      setReceivedMessage("From Date cannot be greater than today's date");
      setSnackbarOpen(true);
      return;
    }

    setFromDate(selectedDate.startOf('day'));
  };

  // Handle To Date change
  const handleToDateChange = (newValue) => {
    if (!newValue) {
      setToDate(null);
      return;
    }

    const selectedDate = dayjs(newValue);
    const today = dayjs();

    // Future date check
    if (selectedDate.isAfter(today, 'day')) {
      setTimeout(() => setToDate(null), 0);
      setSnackbarSeverity('error');
      setReceivedMessage("To Date cannot be greater than today's date");
      setSnackbarOpen(true);
      return;
    }

    // From Date check
    if (fromDate && selectedDate.isBefore(fromDate, 'day')) {
      setTimeout(() => setToDate(null), 0);
      setSnackbarSeverity('error');
      setReceivedMessage('To Date should be greater than From Date');
      setSnackbarOpen(true);
      return;
    }

    setToDate(selectedDate.endOf('day'));
  };

  //handle serach
  const handleSearch = async () => {
    if (!year) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select year first');
      setSnackbarOpen(true);
      return;
    }
    if (!billBookNo) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Billbook No. first');
      setSnackbarOpen(true);
      return;
    }

    if ((invoiceNo === undefined || invoiceNo === null || invoiceNo === '') && (!fromDate || !toDate)) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please provide invoice no or fromDate and toDate');
      setSnackbarOpen(true);
      return;
    }
    const selectedData = {
      year,
      billBookNo,
      invoiceNo,
      fromDate,
      toDate,
      tabValue
    };
    try {
      const { data, status } = await fetchCollectionApprovalData(selectedData);
      console.log('fetch data', data);
      if (status === 200 && data.length > 0) {
        if (tabValue == 0) {
          setCollectionData(data);
          setShowTable(true);
        } else if (tabValue == 1) {
          setCancelHistoryData(data);
          setShowCancelTable(data);
        }
      } else if (status === 200 && data.length === 0) {
        setSnackbarSeverity('error');
        setReceivedMessage('Transaction not found selected criteria');
        setSnackbarOpen(true);
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to Search Collection Data';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  // Helper function to compare rows including milliseconds
  const isSameRow = (r, row) =>
    r.InvoiceNo === row.InvoiceNo &&
    r.BillBookNo === row.BillBookNo &&
    new Date(r.CreatedDate).getTime() === new Date(row.CreatedDate).getTime() &&
    new Date(r.UpdatedDate).getTime() === new Date(row.UpdatedDate).getTime();

  // Handle checkbox changes
  const handleCheckboxChange = (event, row) => {
    const isChecked = event.target.checked;

    // Find all rows in collectionData that match InvoiceNo, BillBookNo, CreatedDate, UpdatedDate
    const matchedRows = collectionData.filter(
      (r) =>
        r.InvoiceNo === row.InvoiceNo &&
        r.BillBookNo === row.BillBookNo &&
        new Date(r.CreatedDate).getTime() === new Date(row.CreatedDate).getTime() &&
        new Date(r.UpdatedDate).getTime() === new Date(row.UpdatedDate).getTime()
    );

    if (isChecked) {
      // Add all matched rows that are not already selected
      setSelectedRows((prev) => [...prev, ...matchedRows.filter((r) => !prev.some((s) => isSameRow(s, r)))]);
    } else {
      // Remove all matched rows from selectedRows
      setSelectedRows((prev) => prev.filter((r) => !matchedRows.some((m) => isSameRow(m, r))));
    }
  };

  //handle clear
  const handleClear = () => {
    setShowTable(false);
    setCollectionData([]);
    setSelectedRows([]);
    setFinanceYear('');
    setBillBookNo('');
    setInvoiceNo('');
    setFromDate(null);
    setToDate(null);
  };

  //handle cancel reason dialogbox open
  const handleOpenDialog = () => {
    setOpen(true);
  };

  //handle cancel reason dialogbox close
  const handleCloseDialog = () => {
    setOpen(false);
  };

  // handle delete selected collection entries
  const handleDelete = async () => {
    //setOpenCancelDialog(true);
    const deleteData = selectedRows.map((r) => ({
      BTId: r.BTId,
      OwnerID: r.OwnerID,
      BillBookNo: r.BillBookNo,
      InvoiceNo: r.InvoiceNo,
      FinanceYear: r.FinanceYear,
      PaymentType: r.PaymentType,
      CreatedDate: r.CreatedDate,
      UpdatedDate: r.UpdatedDate
    }));

    if (deleteData.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data selected for cancellation');
      setSnackbarOpen(true);
      return;
    }
    if (!cancelReason) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter cancellation reason');
      setSnackbarOpen(true);
      return;
    }
    try {
      const { data, status } = await deleteCollectionEntries(deleteData, cancelReason);
      console.log('delete data', data);
      if (status === 200 && data.success) {
        setSnackbarSeverity('success');
        setReceivedMessage(`${data.message}`);
        setSnackbarOpen(true);

        // Refresh the collection data after deletion
        setSelectedRows([]);
        setCancelReason('');
        try {
          const selectedData = {
            year,
            billBookNo,
            invoiceNo,
            fromDate,
            toDate,
            tabValue
          };
          const { data, status } = await fetchCollectionApprovalData(selectedData);
          console.log('fetch data', data);
          if (status === 200) {
            setCollectionData(data);
          }
        } catch (error) {
          const status = error.response?.status;
          const message = error.response?.data?.message || 'Failed to Search Collection Data';

          if (status === 400) {
            setSnackbarSeverity('error');
          } else if (status === 404) {
            setSnackbarSeverity('error');
          } else {
            setSnackbarSeverity('error');
          }

          setReceivedMessage(message);
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to delete Collection data entries';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }

    setOpen(false);
  };

  const handleCancelClose = () => {
    setTabValue(0); // Switch to the first tab
    setFromDate(null);
    setToDate(null);
    setShowCancelTable(false);
  };

  //year fetch
  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await getTransYear();
        console.log(response, 'API Response');
        const fetchedYearList = response || [];
        const sortedYearList = [...fetchedYearList].sort((a, b) => b.FinanceYear - a.FinanceYear);
        setYearTransList(sortedYearList);
      } catch (error) {
        console.error('Error fetching year list:', error);
        setYearTransList([]);
      }
    };
    fetchYear();
  }, []);

  //Bill book data fetch
  useEffect(() => {
    const fetchBillBookEntries = async () => {
      try {
        const data = await getBillBookList();
        console.log('getBillBookList', data);
        setAllBillBookData(data);
      } catch (error) {
        console.error('Error fetching bill book entries:', error);
      }
    };

    fetchBillBookEntries();
  }, []);

  //Filter and set BillBookNoList
  useEffect(() => {
    if (!year || allBillBookData.length === 0) {
      setBillBookNoList([]);
      setBillBookNo('');
      setFromDate(null);
      setToDate(null);
      return;
    }
    const filteredBillBooks = allBillBookData.filter((entry) => entry.Year === year).map((entry) => entry.BillBookNo);

    setBillBookNoList([...new Set(filteredBillBooks)]);
  }, [year, allBillBookData]);

  useEffect(() => {
    console.log('Selected Rows:', selectedRows);
    console.log('tabvalue:', tabValue);
    console.log('cancelHistoryData:', cancelHistoryData);
  }, [selectedRows, tabValue, cancelHistoryData]);

  return (
    <MainCard title="Collection Approval" style={{ color: '#1677ff' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
          <Tab label="Collection Cancellation Process" icon={<DeliveredProcedureOutlined />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Cancel History" icon={<UndoOutlined />} iconPosition="start" {...a11yProps(1)} />
        </Tabs>

        {/* //1st tab */}
        <TabPanel value={tabValue} index={0}>
          <MainCard title="Collection Cancellations" style={{ color: '#1677ff' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MainCard>
                  <Grid container spacing={2}>
                    <Grid item xs={1} sm={1.5}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>*</span>Year
                        </InputLabel>
                        <Select
                          id="year-select"
                          value={year}
                          onChange={handleFinanceYearChange}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {yearTrans.map((financeYear, index) => (
                            <MenuItem key={index} value={financeYear.FinanceYear}>
                              {financeYear.FinanceYear}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>*</span> Bill Book No
                        </InputLabel>
                        <Select
                          id="billBook-select"
                          value={billBookNo}
                          onChange={handleBillBookNo}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          {billBookNoList.length === 0 ? (
                            <MenuItem disabled>
                              <Typography noWrap sx={{ maxWidth: 200 }}>
                                {year ? (
                                  <>
                                    No Bill Book Numbers <br /> found for this year
                                  </>
                                ) : (
                                  'Select a financial year first'
                                )}
                              </Typography>
                            </MenuItem>
                          ) : (
                            billBookNoList.map((billBookNo, index) => (
                              <MenuItem key={index} value={billBookNo}>
                                {billBookNo}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <Typography>Invoice No </Typography>
                        <TextField
                          required
                          value={invoiceNo}
                          type="number"
                          onChange={(e) => setInvoiceNo(e.target.value)}
                          placeholder="Enter invoice No"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3.25}>
                      <Stack spacing={1}>
                        <InputLabel>From Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={fromDate}
                            onChange={handleFromDateChange}
                            maxDate={maxDate && dayjs()}
                            minDate={minDate}
                            sx={{
                              '& .MuiInputBase-input': {
                                color: '#00599c'
                              },
                              '& .MuiInput-underline:before': {
                                borderBottomColor: fromDate ? 'green' : 'transparent'
                              }
                            }}
                            disabled={!year}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3.25}>
                      <Stack spacing={1}>
                        <InputLabel>To Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={toDate}
                            onChange={handleToDateChange}
                            maxDate={maxDate && dayjs()}
                            minDate={fromDate ? fromDate : minDate || undefined}
                            sx={{
                              '& .MuiInputBase-input': { color: '#00599c' },
                              '& .MuiInput-underline:before': { borderBottomColor: fromDate ? 'green' : 'transparent' }
                            }}
                            disabled={!year}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>

            <Grid container justifyContent="center">
              <Grid item xs={12} sm={4} display="flex" justifyContent="center" mt={2}>
                <Button variant="contained" color="success" size="large" onClick={handleSearch}>
                  Search
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12} marginTop={2}>
              {/* Conditionally render the table based on the showTable state */}
              {showTable && (
                <MainCard>
                  <Box
                    sx={{
                      width: '100%',

                      overflowX: 'auto',
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <TableContainer component={Paper} style={{ width: '100%', maxHeight: '300px' }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff' }}>
                            <TableCell>Select</TableCell>
                            {tableColumns.map((col) => (
                              <TableCell key={col.key}>{col.label}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {collectionData.map((row) => (
                            <TableRow key={row.OwnerID}>
                              <TableCell>
                                <Checkbox
                                  onChange={(e) => handleCheckboxChange(e, row)}
                                  checked={selectedRows.some((r) => isSameRow(r, row))}
                                />
                              </TableCell>

                              {tableColumns.map((col) => (
                                <TableCell key={col.key}>{col.render ? col.render(row[col.key]) : row[col.key] ?? '-'}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Grid container marginTop={2} justifyContent="center">
                    <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                      <Stack spacing={1} direction={'row'}>
                        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                          Cancel Collection
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleClear}>
                          Clear
                        </Button>
                      </Stack>
                    </Grid>
                    <Dialog open={open} onClose={handleCloseDialog} PaperProps={{ sx: { width: '300px' } }}>
                      <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid gray', backgroundColor: '#92c2f2' }}
                      >
                        <Grid item>
                          <DialogTitle>Enter Details For Cancellation</DialogTitle>
                        </Grid>
                      </Grid>

                      <DialogContent>
                        <Grid marginTop={2}>
                          <Grid item xs={12} sm={8}>
                            <Stack spacing={1}>
                              <Typography>Enter Reason</Typography>
                              <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="reason"
                                type="text"
                                // multiline
                                fullWidth
                                variant="outlined"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                sx={{ width: '260px' }}
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                      </DialogContent>

                      <DialogActions>
                        <Button variant="contained" color="success" onClick={() => handleDelete(cancelReason)} autoFocus>
                          Yes
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                          No
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {/* Snackbar component */}
                    <Snackbar open={openCancelDialog} autoHideDuration={6000} onClose={handleClose}>
                      <Alert onClose={handleClose} severity="success" sx={{ width: '100%', backgroundColor: 'green', color: 'white' }}>
                        Report cancelled successfully.
                      </Alert>
                    </Snackbar>
                  </Grid>
                </MainCard>
              )}
            </Grid>
          </MainCard>
        </TabPanel>

        {/* 2nd tab */}
        <TabPanel value={tabValue} index={1}>
          <MainCard title="Cancellations History" style={{ color: '#1677ff' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MainCard>
                  <Grid container spacing={2}>
                    <Grid item xs={1} sm={1.5}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>*</span>Year
                        </InputLabel>
                        <Select
                          id="year-select"
                          value={year}
                          onChange={handleFinanceYearChange}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {yearTrans.map((financeYear, index) => (
                            <MenuItem key={index} value={financeYear.FinanceYear}>
                              {financeYear.FinanceYear}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>*</span> Bill Book No
                        </InputLabel>
                        <Select
                          id="billBook-select"
                          value={billBookNo}
                          onChange={handleBillBookNo}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          {billBookNoList.length === 0 ? (
                            <MenuItem disabled>
                              <Typography noWrap sx={{ maxWidth: 200 }}>
                                {year ? (
                                  <>
                                    No Bill Book Numbers <br /> found for this year
                                  </>
                                ) : (
                                  'Select a financial year first'
                                )}
                              </Typography>
                            </MenuItem>
                          ) : (
                            billBookNoList.map((billBookNo, index) => (
                              <MenuItem key={index} value={billBookNo}>
                                {billBookNo}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <Typography>Invoice No </Typography>
                        <TextField
                          required
                          value={invoiceNo}
                          type="number"
                          onChange={(e) => setInvoiceNo(e.target.value)}
                          placeholder="Enter invoice No"
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3.25}>
                      <Stack spacing={1}>
                        <InputLabel>From Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={fromDate}
                            onChange={handleFromDateChange}
                            maxDate={maxDate && dayjs()}
                            minDate={minDate}
                            sx={{
                              '& .MuiInputBase-input': {
                                color: '#00599c'
                              },
                              '& .MuiInput-underline:before': {
                                borderBottomColor: fromDate ? 'green' : 'transparent'
                              }
                            }}
                            disabled={!year}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3.25}>
                      <Stack spacing={1}>
                        <InputLabel>To Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={toDate}
                            onChange={handleToDateChange}
                            maxDate={maxDate && dayjs()}
                            minDate={fromDate ? fromDate : minDate || undefined}
                            sx={{
                              '& .MuiInputBase-input': { color: '#00599c' },
                              '& .MuiInput-underline:before': { borderBottomColor: fromDate ? 'green' : 'transparent' }
                            }}
                            disabled={!year}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>

            <Grid container justifyContent="center">
              <Grid item xs={12} sm={4} display="flex" justifyContent="center" mt={2}>
                <Button variant="contained" color="success" size="large" onClick={handleSearch}>
                  Search
                </Button>
              </Grid>
            </Grid>
            {/*second table*/}

            <Grid item xs={12} marginTop={2}>
              {/* Conditionally render the table based on the showTable state */}
              {showCancelTable && (
                <MainCard>
                  <Box
                    sx={{
                      width: '100%',

                      overflowX: 'auto',
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <TableContainer component={Paper} style={{ width: '100%', maxHeight: '300px' }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff' }}>
                            {tableColumns.map((col) => (
                              <TableCell key={col.key}>{col.label}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {cancelHistoryData.map((row) => (
                            <TableRow key={row.OwnerID}>
                              {tableColumns.map((col) => (
                                <TableCell key={col.key}>{col.render ? col.render(row[col.key]) : row[col.key] ?? '-'}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Grid container marginTop={2} justifyContent="center">
                    <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                      <Stack spacing={1} direction={'row'}>
                        <Button variant="contained" color="success" onClick={handleCancelClose}>
                          Close
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              )}
            </Grid>
          </MainCard>
        </TabPanel>
      </Box>
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
  );
}

export default CollectionApproval;
