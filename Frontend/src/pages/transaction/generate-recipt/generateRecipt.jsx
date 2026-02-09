import {
  Box,
  Button,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  SnackbarContent,
  Checkbox,
  ListItemText,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Autocomplete,
  DialogActions,
  Backdrop
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { fetchWardList } from 'services/data-entry.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { getTransYear } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import { fetchYearlyBillBookList, fetchInvoiceList, transactionReceipt } from 'services/transaction/generateReceipt/generateReceipt';
import { fetchPaymentResourceList } from '../../../services/AdminServices/discountSlabMaster/discountSlabMaster.js';
function GenerateRecipt() {
  const [wardList, setWardList] = useState([]);
  const [wardNo, setWardNo] = useState('');
  const [allProperties, setAllProperties] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [property, setProperty] = useState('');
  const [partitionList, setPartitionList] = useState([]);
  const [partition, setPartition] = useState('');
  const [yearTrans, setYearTransList] = useState([]);
  const [year, setFinanceYear] = useState('');
  const [billBookNoList, setBillBookNoList] = useState([]);
  const [billBookNo, setBillBookNo] = useState('');
  const [invoiceNoList, setInvoiceNoList] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [tableData, setTableData] = useState([]);
  const [tableShow, setTableShow] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [paymentResourceList, setPaymentResourceList] = useState([]);
  const [selectedResource, setSelectedResource] = useState([]);
  //Payment Mode list hardcoded
  const paymentLabels = ['Cash', 'Cheque', 'DD', 'UPI', 'NEFT', 'RIGS', 'Card'];

  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleWardChange = async (e) => {
    setWardNo(e.target.value);
  };

  //label as propertyNo-partitionNo
  const label = (o) => {
    const prop = parseInt(o?.NewPropertyNo, 10) || 0;
    const part = parseInt(o?.NewPartitionNo || 0, 10);
    return part > 0 ? `${prop}-${part}` : `${prop}`;
  };

  //handle function for Property change
  const handlePropertyChange = (_, selected) => {
    console.log('handlePropertyChange', selected);
    if (!selected || propertyList.length === 0) {
      setProperty('');
      setPartition('');
      return;
    }

    // Option 1: Use NewPropertyNo and NewPartitionNo from the object
    setProperty(selected.NewPropertyNo);
    setPartition(selected.NewPartitionNo || '');
  };


  //Financial year change
  const handleFinanceYearChange = (ev) => {
    if (yearTrans) {
      setFinanceYear(ev.target.value);
    } else {
      setFinanceYear('');
    }
  };

  //Handle payment mode change
  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
    console.log('paymentMode selected:', event.target.value);
  };

  //Handle payment resource change
  // const handlePaymentResourceChange = (event) => {
  //   const value = event.target.value;

  //   if (value.includes('All')) {
  //     // If already all selected → unselect all
  //     if (paymentResource.length === paymentResourceLabels.length) {
  //       setPaymentResource([]);
  //     }
  //     // Otherwise select all
  //     else {
  //       setPaymentResource(paymentResourceLabels);
  //     }
  //   } else {
  //     setPaymentResource(value);
  //   }
  // };
  const handlePaymentResourceChange = (event) => {
    const value = event.target.value;

    if (value.includes('All')) {
      if (selectedResource.length === paymentResourceList.length) {
        setSelectedResource([]); // unselect all
      } else {
        setSelectedResource(paymentResourceList); // select all
      }
    } else {
      setSelectedResource(value);
    }
  };

  //handle invoice no change
  const handleInvoiceNo = async (e) => {
    const value = e.target.value;
    setInvoiceNo(value);
  };

  //Handle to change BillBookNo
  const handleBillBookNo = (e) => {
    setBillBookNo(e.target.value);
  };


//Handle Generate receipt data
  const handleGetPropertyData = async () => {
    let missingPropertyFields = [];
    let missingBillFields = [];

    // Validate Property details
    if (!wardNo) missingPropertyFields.push('Ward No');
    if (!property) missingPropertyFields.push('Property No');

    // Validate Bill details
    if (!year) missingBillFields.push('Year');
    if (!billBookNo) missingBillFields.push('Bill Book No');
    if (!invoiceNo) missingBillFields.push('Invoice No');

    // Check if at least one group is fully provided
    const isPropertyComplete = missingPropertyFields.length === 0;
    const isBillComplete = missingBillFields.length === 0;

    if (!isPropertyComplete && !isBillComplete) {
      // Neither Property nor Bill is fully provided
      setSnackbarSeverity('error');
      if (missingPropertyFields.length > 0 && missingBillFields.length === 3) {
        setReceivedMessage(`Property details incomplete. Missing: ${missingPropertyFields.join(', ')}`);
      } else if (missingBillFields.length > 0 && missingPropertyFields.length === 2) {
        setReceivedMessage(`Bill details incomplete. Missing: ${missingBillFields.join(', ')}`);
      } else {
        setReceivedMessage(`Please provide either complete Property details (Ward, Property)\n
         or complete Bill details(Finance Year, BillBook, Invoice No.)`);
      }
      setSnackbarOpen(true);
      return;
    }

    // Prepare filters
    const filters = { wardNo, property, partition, selectedResource, paymentMode, year, billBookNo, invoiceNo };

    setOpenLoader(true);
    setTableShow(false);

    try {
      const { data, status } = await transactionReceipt(filters);

      if (status === 200 && Array.isArray(data) && data.length > 0) {
        setTableData(data);
        setTableShow(true);
      } else {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('No data found for given filters');
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage(error?.response?.data?.message || 'Failed to Search Collection Data');
    } finally {
      setOpenLoader(false);
    }
  };

  //table columns
  const tableColumns = [
    { label: 'Owner Name', key: 'OwnerName' },
    { label: 'ReceiptID', key: 'ReceiptID' },
    { label: 'BillBook No.', key: 'BillBookNo' },
    { label: 'Invoice No.', key: 'InvoiceNo' },
    { label: 'Amount', key: 'Amount' },
    {
      label: 'Transaction Date',
      key: 'TransactionDate',
      render: (row) => (row.TransactionDate ? new Date(row.TransactionDate).toLocaleString() : '-')
    },
    { label: 'Payment Resource', key: 'PaymentResource' },
    { label: 'Cheque Status', key: 'ChequeStatus' },
    { label: 'Finance Year', key: 'FinanceYear' }
  ];

  // Generate Excel sheet
  const handlegenerateReceipt = async () => {
    if (!tableData.length) return;

    // Create Workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Generate Receipt');

    // Dynamic headers from the first object
    const headers = Object.keys(tableData[0]);

    // Add header row
    sheet.addRow(headers);

    // Add data rows
    tableData.forEach((row) => {
      const rowData = headers.map((h) => row[h] ?? '');
      sheet.addRow(rowData);
    });

    // Auto column width
    sheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Export as file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Generate_Receipt.xlsx');
  };

  const handleClear = async () => {
    setSelectedResource([]);
    setPaymentMode('');
    setWardNo('');
    setProperty('');
    setFinanceYear('');
    setPartition('');
    setBillBookNo('');
    setInvoiceNo('');
    setTableShow(false);
    setTableData([]);
  };

  //Fetch ward list
  useEffect(() => {
    const fetchWardNoList = async () => {
      try {
        const wardList = await fetchWardList();
        console.log('wardList', wardList);
        const wards = Array.from(
          new Set(
            wardList
              .map((x) => x?.NewWardNo)
              .filter((v) => v != null)
              .map((v) => String(v).trim())
              .filter((v) => v.length > 0)
          )
        );

        // Natural, locale-aware sort (handles "2" < "10", "A2" < "A10", Marathi, etc.)
        const collator = new Intl.Collator('mr-IN', { numeric: true, sensitivity: 'base' });
        const wardNumbers = wards.sort(collator.compare);
        setWardList(wardNumbers);
      } catch (error) {
        console.error('Error in fetching ward list:', error);
      }
    };
    fetchWardNoList();
  }, []);

  //Fetch Property Range by Ward
  useEffect(() => {
    console.log(wardNo);
    if (wardNo != '') {
      const propertyRange = async () => {
        try {
          setProperty('');
          setPartition('');
          const propertyRange = await fetchPropertyRangeByWard(wardNo);
          console.log('propertyRange:', propertyRange.properties);
          if (propertyRange.properties.length > 0) {
            // Sort by NewPropertyNo, then by NewPartitionNo
            const sortedProperties = [...propertyRange.properties].sort((a, b) => {
              const propA = parseInt(a.NewPropertyNo, 10) || 0;
              const propB = parseInt(b.NewPropertyNo, 10) || 0;
              if (propA !== propB) return propA - propB;

              const partA = parseInt(a.NewPartitionNo, 10) || 0;
              const partB = parseInt(b.NewPartitionNo, 10) || 0;
              return partA - partB;
            });

            setPropertyList(sortedProperties);
          }
        } catch (error) {
          console.error('Failed to fetch propertyRange:', error);
        }
      };

      propertyRange();
    } else {
      setPropertyList([]);
      setProperty('');
      setPartition('');
    }
  }, [wardNo]);

  //year fetch
  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await getTransYear();
        console.log(response, 'API Response');
        const fetchedYearList = response || []; // Assuming API returns an array of roles directly
        const sortedYearList = [...fetchedYearList].sort((a, b) => b.FinanceYear - a.FinanceYear);
        setYearTransList(sortedYearList); // Update the roleList state
      } catch (error) {
        console.error('Error fetching year list:', error);
        setYearTransList([]);
      }
    };
    fetchYear();
  }, []);

  //bill book no fetch based on year
  useEffect(() => {
    if (!year) {
      setBillBookNoList([]);
      setBillBookNo('');
      return;
    }

    const fetchBillBookNo = async () => {
      try {
        const { data, status } = await fetchYearlyBillBookList(year);

        if (status === 200 && data?.billBooks) {
          console.log('Bill Book No List:', data.billBooks);
          setBillBookNoList(data.billBooks);
        } else {
          setBillBookNoList([]);
          setBillBookNo('');
        }
      } catch (error) {
        console.error('Failed to fetch Bill Book No List:', error);
        setBillBookNoList([]);
        setBillBookNo('');
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(error.response?.data?.message || 'Failed to fetch bill book list');
      }
    };

    fetchBillBookNo();
  }, [year]);

  //invoice no fetch based on bill book no
  useEffect(() => {
    if (!billBookNo) {
      setInvoiceNoList([]);
      setInvoiceNo('');
      return;
    }

    const fetchInvoiceNo = async () => {
      try {
        const { data, status } = await fetchInvoiceList(billBookNo);

        if (status === 200 && data?.invoices) {
          console.log('Invoice No List:', data.invoices);
          setInvoiceNoList(data.invoices);
        } else {
          setInvoiceNo('');
          setInvoiceNoList([]);
        }
      } catch (error) {
        console.error('Failed to fetch Invoice No List:', error);
        setInvoiceNo('');
        setInvoiceNoList([]);
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(error.response?.data?.message || 'Failed to fetch Invoice No list');
      }
    };

    fetchInvoiceNo();
  }, [billBookNo]);

  //fetch Payment resource list
  useEffect(() => {
    const PaymentResourceList = async () => {
      try {
        const { data, status } = await fetchPaymentResourceList();
        if (status === 200) {
          setPaymentResourceList(data);
        } else {
          setPaymentResourceList([]);
        }
      } catch (error) {
        setPaymentResourceList([]);
        setSnackbarSeverity('error');
        setReceivedMessage(error.response?.data?.message || 'Failed to fetch payment resource list');
        setSnackbarOpen(true);
        console.error('Error in fetching zone list:', error);
      }
    };
    PaymentResourceList();
  }, []);

  return (
    <>
      <MainCard style={{ backgroundColor: '#e3f2fd' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          <span>Generate Receipt</span>
        </Typography>
      </MainCard>
      <MainCard>
        <Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={10} lg={6}>
              <Box>
                <Box>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={6} sm={4.7}>
                      <Stack sx={{ mt: 1 }} spacing={1}>
                        <InputLabel style={{ fontWeight: 'bold' }}>Ward No.:</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7.3} mb={1}>
                      <Stack spacing={1}>
                        <FormControl fullWidth>
                          <Select
                            id="ward-select"
                            value={wardNo}
                            placeholder="ward no"
                            onChange={handleWardChange}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                          >
                            {wardList.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={6} sm={4.6}>
                      <Stack sx={{ mt: 1 }} spacing={1}>
                        <InputLabel style={{ fontWeight: 'bold' }}> Partition No.:</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7.3} mb={1}>
                      <Stack spacing={1}>
                        <TextField
                          value={partition ? partition : ''}
                          variant="outlined"
                          InputProps={{
                            readOnly: true
                          }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={6} sm={4.6}>
                      <Stack sx={{ mt: 1 }} spacing={1}>
                        <InputLabel style={{ fontWeight: 'bold' }}> Bill Book No.:</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7.3} mb={1}>
                      <Stack spacing={1}>
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
                          {billBookNoList.map((billBookNo, index) => (
                            <MenuItem key={index} value={billBookNo}>
                              {billBookNo}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={6} sm={4.7}>
                      <Stack sx={{ mt: 1 }} spacing={1}>
                        <InputLabel style={{ fontWeight: 'bold' }}>Payment Resource:</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7.3} mb={1}>
                      <Stack spacing={1}>
                        <FormControl fullWidth>
                          <Select
                            id="resource-select"
                            value={selectedResource}
                            placeholder="Payment Resource"
                            multiple
                            renderValue={(selected) => selected.join(', ')}
                            onChange={handlePaymentResourceChange}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                          >
                            {/* Select All */}
                            <MenuItem value="All">
                              <Checkbox
                                checked={paymentResourceList.length > 0 && selectedResource.length === paymentResourceList.length}
                              />
                              <ListItemText primary="Select All" />
                            </MenuItem>

                            {paymentResourceList.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                <Checkbox checked={selectedResource.includes(option)} />
                                <ListItemText primary={option} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={10} lg={6}>
              <Box>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={6} sm={4.7}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Property No.:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <Stack spacing={1}>
                        <Autocomplete
                          options={propertyList}
                          getOptionLabel={(option) => String(option?.NewPropertyNo ?? ' ')}
                          //isOptionEqualToValue={(a, b) => a.NewPropertyNo === b.NewPropertyNo}
                          value={propertyList.find((p) => p.NewPropertyNo === property) || null}
                          onChange={handlePropertyChange}
                          // open automatically on focus and via the dropdown icon
                          forcePopupIcon
                          openOnFocus
                          // keep Autocomplete uncontrolled for input & popup;
                          // we still filter by the user's typed text
                          filterOptions={(options, state) => {
                            const q = String(state.inputValue ?? '').trim();
                            if (!q) return options; // show all when empty
                            return options.filter((o) => String(o?.NewPropertyNo ?? '').startsWith(q));
                          }}
                          renderOption={(props, option) => {
                            props.key = option.NewWardNo;
                            return <li {...props}>{label(option)}</li>;
                          }}
                          renderInput={(params) => <TextField {...params} variant="outlined" />}
                          ListboxProps={{ style: { maxHeight: 150, overflowY: 'auto' } }}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={6} sm={4.6}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Finance Year:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
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
                </Grid>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={6} sm={4.6}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Invoice No.:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <Select
                        id="invoice-select"
                        value={invoiceNo}
                        onChange={handleInvoiceNo}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: 'auto'
                            }
                          }
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
                </Grid>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={6} sm={4.6}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}> Payment Mode:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <Select
                        id="payment-select"
                        value={paymentMode}
                        onChange={handlePaymentModeChange}
                        MenuProps={{
                          PaperProps: {
                            style: { maxHeight: 150, overflowY: 'auto' }
                          }
                        }}
                      >
                        {paymentLabels.map((label) => (
                          <MenuItem key={label} value={label}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Box marginTop={1} sx={{ mb: 0.5 }}>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <Button variant="contained" color="success" onClick={() => handleGetPropertyData()}>
                    Get Property
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <Button variant="contained" color="secondary" onClick={handleClear}>
                    Clear
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {tableShow && (
          <MainCard style={{ marginTop: '10px', height: '450px' }}>
            <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem' }}>Property Record Found</Typography>
            <Box
              sx={{
                display: 'flex',

                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                backgroundColor: '#f0f0f0'
              }}
            >
              {/* Show table when tableData has data */}
              {tableData?.length > 0 && (
                <Box
                  sx={{
                    width: '100%',
                    maxHeight: 350,
                    overflowX: 'auto',
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Table sx={{ minWidth: 1200 }}>
                    <TableHead>
                      <TableRow sx={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff' }}>
                        <TableCell>Generate Receipt</TableCell>
                        <TableCell>2 Inch Receipt</TableCell>
                        <TableCell>3 Inch Receipt</TableCell>

                        {tableColumns.map((col) => (
                          <TableCell key={col.key}>{col.label}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {tableData.map((row) => (
                        <TableRow key={row.OwnerID}>
                          {/* Action Buttons */}
                          <TableCell>
                            <Button variant="contained" size="small" onClick={() => handlegenerateReceipt(row, 'A4')}>
                              Generate Receipt
                            </Button>
                          </TableCell>

                          <TableCell>
                            <Button variant="contained" size="small" onClick={() => handlegenerateReceipt(row, '2INCH')}>
                              2 Inch Receipt
                            </Button>
                          </TableCell>

                          <TableCell>
                            <Button variant="contained" size="small" onClick={() => handlegenerateReceipt(row, '3INCH')}>
                              3 Inch Receipt
                            </Button>
                          </TableCell>

                          {/* Data Columns */}
                          {tableColumns.map((col) => (
                            <TableCell key={col.key}>{col.render ? col.render(row) : row[col.key] ?? '-'}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Box>
          </MainCard>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
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
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openLoader}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </MainCard>
    </>
  );
}

export default GenerateRecipt;
