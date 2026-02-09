// material-ui
import {
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Snackbar,
  SnackbarContent,
  FormControl,
  ListItemText,
  FormHelperText,
  CircularProgress,
  Backdrop
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  fetchZoneList,
  fetchZoneWiseWardList,
  fetchPaymentResourceList,
  saveDiscountSlabEntries
} from '../../../services/AdminServices/discountSlabMaster/discountSlabMaster.js';
import Zone from 'pages/Master/zone/Zone.jsx';
// ==============================|| SAMPLE PAGE ||============================== //

function DiscountSlabMaster() {
  const [zoneList, setZoneList] = useState([]);
  const [zoneNo, setZoneNo] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [wardNo, setWardNo] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  const [selectedTaxType, setSelectedTaxType] = useState([]);
  const [paymentResourceList, setPaymentResourceList] = useState([]);
  const [selectedResource, setSelectedResource] = useState([]);
  const [percentage, setPercentage] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [tableData, setTableData] = useState([]);
  const [tableShow, setTableShow] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  //Datepicker state
  const [value, setValue] = useState(null);
  const currentYear = new Date().getFullYear();
  // If year is "2025"
  const minDate = dayjs(`01/01/${currentYear}`); // Jan 1st, 2025
  const maxDate = dayjs(`03/31/${Number(currentYear) + 1}`); // March 31st, 2026
  console.log('currentYear', currentYear);
  const taxTypeList = [
    'PropertyTax',
    'EducationTax',
    'EmploymentTax',
    'TreeCess',
    'SpEducationTax',
    'Sanitation',
    'DrainCess',
    'SpWaterCess',
    'RoadCess',
    'FireCess',
    'LightCess',
    'WaterBenefit',
    'MajorBuilding',
    'SewageDisposalCess',
    'WaterBill',
    'Tax1',
    'Tax2',
    'Tax3',
    'Tax4',
    'Tax5'
  ];
  const paymentTypeList = ['Current', 'Pending'];

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleZoneChange = async (event) => {
    const value = event.target.value;

    if (value.includes('All')) {
      if (zoneNo.length === zoneList.length) {
        setZoneNo([]); // unselect all
      } else {
        setZoneNo(zoneList); // select all
      }
    } else {
      setZoneNo(value);
    }
  };
  const handleWardChange = (event) => {
    const value = event.target.value;

    // If Select All clicked
    if (value.includes('All')) {
      setWardNo(wardNo.length === wardList.length ? [] : wardList);
    } else {
      setWardNo(value);
    }
  };

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

  const handleTaxTypeChange = (event) => {
    const value = event.target.value;

    if (value.includes('All')) {
      // If already all selected → unselect all
      if (selectedTaxType.length === taxTypeList.length) {
        setSelectedTaxType([]);
      } else {
        setSelectedTaxType(taxTypeList);
      }
    } else {
      setSelectedTaxType(value);
    }
  };

  const handlePaymentTypeChange = (event) => {
    const value = event.target.value;

    if (value.includes('All')) {
      // If already all selected → unselect all
      if (paymentType.length === paymentTypeList.length) {
        setPaymentType([]);
      } else {
        setPaymentType(paymentTypeList);
      }
    } else {
      setPaymentType(value);
    }
  };

  // Handle From Date change
  const handleFromDateChange = (newValue) => {
    if (!newValue) {
      setFromDate(null);
      return;
    }
    // Check if From Date is after today
    if (dayjs(newValue).isAfter(dayjs(), 'day')) {
      setFromDate(null);
      setSnackbarSeverity('error');
      setReceivedMessage("From Date cannot be greater than today's date");
      setSnackbarOpen(true);
      return;
    }
    setFromDate(dayjs(newValue));
  };

  // Handle To Date change
  const handleToDateChange = async (newValue) => {
    if (!newValue) {
      setToDate(null);
      return;
    }

    // Check if To Date is after today
    if (dayjs(newValue).isAfter(dayjs(), 'day')) {
      setToDate(null);
      setSnackbarSeverity('error');
      setReceivedMessage("To Date cannot be greater than today's date");
      setSnackbarOpen(true);
      return;
    }

    // Check if To Date is before From Date
    if (fromDate && dayjs(newValue).isBefore(fromDate, 'day')) {
      setTimeout(() => setToDate(null), 0);
      setSnackbarSeverity('error');
      setReceivedMessage('To Date should be greater than From Date');
      setSnackbarOpen(true);
      return;
    }

    // Set valid To Date
    setToDate(dayjs(newValue));
  };

  const handleSaveDiscount = async () => {
    if (zoneNo.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select at least one Zone No.');
      setSnackbarOpen(true);
      return;
    }
    if (wardNo.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select at least one ward No.');
      setSnackbarOpen(true);
      return;
    }
    if (paymentType.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select at least one Payment Type.');
      setSnackbarOpen(true);
      return;
    }
    if (selectedTaxType.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select at least one Tax Type.');
      setSnackbarOpen(true);
      return;
    }
    if (selectedResource.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select at least one Payment Resource.');
      setSnackbarOpen(true);
      return;
    }
    if (!percentage) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter percentage value.');
      setSnackbarOpen(true);
      return;
    }
    if (!fromDate || !toDate) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select both from and To Date.');
      setSnackbarOpen(true);
      return;
    }
    const discountData = {
      zoneNo,
      wardNo,
      paymentType,
      selectedResource,
      selectedTaxType,
      percentage,
      currentYear,
      fromDate,
      toDate
    };
    console.log('DiscountData body', discountData);
    try {
      const { data, status } = await saveDiscountSlabEntries(discountData);
      console.log('discountslab data', data);
      if (status === 200) {
        if (data.totalInserted > 0 && data.totalDuplicates === 0) {
          // ✅ All new records
          setSnackbarSeverity('success');
          setReceivedMessage(data.message);
          setTableData(data.insertedRecords);
          setTableShow(true);
        } else if (data.totalInserted > 0 && data.totalDuplicates > 0) {
          // ⚠️ Partial duplicates
          setSnackbarSeverity('warning');
          setReceivedMessage(data.message);
          setTableData(data.insertedRecords);
          setTableShow(true);
        } else if (data.totalInserted === 0 && data.totalDuplicates > 0) {
          // ❌ All duplicates
          setSnackbarSeverity('error');
          setReceivedMessage('Duplicate entries found. No data saved.');
          setTableData([]);
          setTableShow(false);
        } else {
          // ❌ Nothing happened
          setSnackbarSeverity('error');
          setReceivedMessage('No records were saved.');
          setTableData([]);
          setTableShow(false);
        }

        setSnackbarOpen(true);
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to Save Discount Master Entries';
      setSnackbarSeverity('error');
      setReceivedMessage(message);
      setSnackbarOpen(true);
      setTableData([]);
      setTableShow(false);
    }
  };

  //table columns
  const tableColumns = [
    { label: 'Zone No', key: 'ZoneSectionNo' },
    { label: 'Ward No', key: 'Ward' },
    { label: 'From Date', key: 'DiscountFromDate' },
    { label: 'To Date', key: 'DiscountToDate' },
    { label: 'Finance Year', key: 'DiscountFinanceYear' },
    { label: 'Pending Year', key: 'DiscountPendingYear' },
    { label: 'Payment Type', key: 'PaymentType' },
    { label: 'Payment Resource', key: 'PaymentResource' },
    { label: 'Discount Percentage', key: 'DiscountPercentage' }
  ];

  const handleClear = () => {
    setTableShow(false);
    setTableData([]);
    setZoneNo([]);
    setWardNo([]);
    setSelectedResource([]);
    setPaymentType([]);
    setSelectedTaxType([]);
    setPercentage('');
    setFromDate(null);
    setToDate(null);
  };
  const headers = [
    { label: 'Zone', key: 'zone' },
    { label: 'Ward', key: 'ward' },
    { label: 'From date', key: 'fromDate' },
    { label: 'To Date', key: 'toDate' },
    { label: 'Year Type', key: 'yearType' },
    { label: 'Head Type ', key: 'headType ' },
    { label: 'Percentage(%)', key: 'percentage' }
  ];

  // 2nf tab 1st table data
  const data = [
    {
      zone: 'Zone 1',
      ward: 'All',
      fromDate: '01-04-2024',
      toDate: '30-06-2024',
      yearType: 'Current',
      headType: 'Interest	',
      percentage: '10'
    },
    {
      zone: 'Zone 2',
      ward: 'W1,W2,W3,W4,W5',
      fromDate: '01-04-2024',
      toDate: '30-06-2024',
      yearType: 'All',
      headType: 'Property Tax	',
      percentage: '2'
    },
    {
      zone: 'Zone 1',
      ward: 'All',
      fromDate: '01-04-2024',
      toDate: '30-06-2024',
      yearType: 'Current',
      headType: 'Education Tax',
      percentage: '5'
    },
    { zone: 'All', ward: 'All', fromDate: '01-07-2024', toDate: '30-09-2024', yearType: 'Current', headType: 'Total', percentage: '2' }
  ];

  //fetch zone list
  useEffect(() => {
    const zoneList = async () => {
      try {
        const { data, status } = await fetchZoneList();
        if (status === 200) {
          const sortedZones = [...data].sort((a, b) =>
            a.localeCompare(b, undefined, {
              numeric: true,
              sensitivity: 'base'
            })
          );
          setZoneList(sortedZones);
        }
      } catch (error) {
        console.error('Error in fetching zone list:', error);
      }
    };
    zoneList();
  }, []);

  //Fetch ward list
  useEffect(() => {
    if (zoneNo.length > 0) {
      const fetchWardNoList = async () => {
        try {
          const { data, status } = await fetchZoneWiseWardList(zoneNo);
          console.log('wardList', data);
          if (status === 200) {
            const wards = Array.from(
              new Set(
                data
                  .filter((v) => v != null)
                  .map((v) => String(v).trim())
                  .filter((v) => v.length > 0)
              )
            );

            // Natural, locale-aware sort (handles "2" < "10", "A2" < "A10", Marathi, etc.)
            const collator = new Intl.Collator('mr-IN', { numeric: true, sensitivity: 'base' });
            const wardNumbers = wards.sort(collator.compare);
            setWardList(wardNumbers);
          }
        } catch (error) {
          console.error('Error in fetching ward list:', error);
        }
      };
      fetchWardNoList();
    } else {
      setWardNo([]);
    }
  }, [zoneNo]);

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

  useEffect(() => {
    if (zoneNo.length === 0) {
      setWardNo([]);
    }
  }, [zoneNo]);
  useEffect(() => {
    console.log('zonelist', zoneList);
    console.log('wardlist', wardList);
    console.log('paymentResourceList', paymentResourceList);
  }, [zoneList, wardList, paymentResourceList]);

  return (
    <>
      <MainCard title="Discount Slab Master">
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={10} lg={6}>
            <Box marginTop={2}>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Zone </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <FormControl fullWidth>
                      <Select
                        id="zone-select"
                        value={zoneNo}
                        placeholder="zone no"
                        multiple
                        renderValue={(selected) => selected.join(', ')}
                        onChange={handleZoneChange}
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
                          <Checkbox checked={zoneList.length > 0 && zoneNo.length === zoneList.length} />
                          <ListItemText primary="Select All" />
                        </MenuItem>

                        {zoneList.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            <Checkbox checked={zoneNo.includes(option)} />
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Payment Type </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <Select
                      multiple
                      value={paymentType}
                      onChange={handlePaymentTypeChange}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflowY: 'auto'
                          }
                        }
                      }}
                    >
                      <MenuItem value="All">
                        <Checkbox checked={paymentType.length === paymentTypeList.length} />
                        <ListItemText primary="All" />
                      </MenuItem>

                      {paymentTypeList.map((label) => (
                        <MenuItem key={label} value={label}>
                          <Checkbox checked={paymentType.includes(label)} />
                          <ListItemText primary={label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Payment Resource</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
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
                          <Checkbox checked={paymentResourceList.length > 0 && selectedResource.length === paymentResourceList.length} />
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

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>From Date</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3}>
                  <Stack spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker value={fromDate} onChange={handleFromDateChange} maxDate={maxDate} minDate={minDate} />
                    </LocalizationProvider>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={10} lg={6}>
            <Box marginTop={2}>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Ward</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <FormControl fullWidth>
                      <Stack spacing={1}>
                        <FormControl fullWidth>
                          <Select
                            multiple
                            value={wardNo}
                            onChange={handleWardChange}
                            displayEmpty
                            renderValue={(selected) => (selected && selected.length > 0 ? selected.join(', ') : '')}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                            disabled={!zoneNo || zoneNo.length === 0}
                          >
                            <MenuItem value="All">
                              <Checkbox
                                checked={wardList.length > 0 && wardNo.length === wardList.length}
                                indeterminate={wardNo.length > 0 && wardNo.length < wardList.length}
                              />
                              <ListItemText primary="Select All" />
                            </MenuItem>

                            {/* Individual wards */}
                            {wardList.map((ward) => (
                              <MenuItem key={ward} value={ward}>
                                <Checkbox checked={wardNo.includes(ward)} />
                                <ListItemText primary={ward} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Tax Type</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <Select
                      multiple
                      value={selectedTaxType}
                      onChange={handleTaxTypeChange}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflowY: 'auto'
                          }
                        }
                      }}
                    >
                      <MenuItem value="All">
                        <Checkbox checked={selectedTaxType.length === taxTypeList.length} />
                        <ListItemText primary="Select All" />
                      </MenuItem>

                      {taxTypeList.map((label) => (
                        <MenuItem key={label} value={label}>
                          <Checkbox checked={selectedTaxType.includes(label)} />
                          <ListItemText primary={label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Percentage </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField
                      required
                      Width
                      autoComplete="family-name"
                      
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      InputProps={{
                        endAdornment: '%'
                      }}
                    />{' '}
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>To Date </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3}>
                  <Stack spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={toDate}
                        onChange={handleToDateChange}
                        //maxDate={dayjs()}
                        //minDate={fromDate || undefined}
                        maxDate={maxDate}
                        minDate={fromDate ? fromDate : minDate || undefined}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid item xs={10} sm={2} mt={3}>
            <Stack spacing={0}>
              <Button variant="contained" color="success" onClick={handleSaveDiscount}>
                Save
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={10} sm={2} mt={3}>
            <Stack spacing={0}>
              <Button variant="contained" color="secondary" onClick={handleClear}>
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
      {/* table */}
      <Box mt={2}></Box>
      <MainCard>
        {/* table */}
        <Grid
          container
          spacing={2.2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          {/* table2 */}
          <Grid item xs={12} sm={12}>
            <Box className="card" style={{ marginTop: '20px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
                    Tax Name List{' '}
                  </Typography>
                  <Grid sx={{ marginLeft: '65vw' }}></Grid>

                  {/* Show table when tableData has data */}
                  {tableShow && (
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
                            {tableColumns.map((col) => (
                              <TableCell key={col.key}>{col.label}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {tableData.map((row, i) => (
                            <TableRow key={i}>
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
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </MainCard>
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
    </>
  );
}

export default DiscountSlabMaster;
