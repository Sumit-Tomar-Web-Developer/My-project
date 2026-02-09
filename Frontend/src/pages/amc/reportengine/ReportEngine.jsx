import { Grid, InputLabel, Stack, TextField, Select, MenuItem, Box, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { showReport } from 'services/Amc/report-engine/reportEngineService';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import dayjs from 'dayjs';
import { fetchOwnerDetails } from 'services/appeal.services';
import { getBillBookList } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import { fetchWardList } from 'services/data-entry.services';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function ReportEngine() {
  const [selectReport, setSelectReport] = useState(0);
  const [wardList, setWardList] = useState([]);
  const [wardNo, setWardNo] = useState('');
  const [propertyList, setPropertyList] = useState([]);
  const [property, setProperty] = useState('');
  const [partitionList, setPartitionList] = useState([]);
  const [partition, setPartition] = useState('');
  const [financeyearList, setFinanceYearList] = useState([]);
  const [year, setFinanceYear] = useState('');
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [ownerName, setOwnerName] = useState('');
  const [billBookNoList, setBillBookNoList] = useState([]);
  const [billBookNo, setBillBookNo] = useState('');
  const [invoiceNoList, setInvoiceNoList] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Report Engine';
      try {
        const fetchedPageID = await getPageIDByPageName(pageName);
        console.log(fetchedPageID, 'fetchedPageID' + ` ${pageName}`);
        setPageID(fetchedPageID);
      } catch (error) {
        console.error('Error fetching page ID:', error);
      }
    };
    getPageID();
  }, []);

  // Get permissions for this page for logged in user from Redux
  const permissions = useSelector((state) => {
    const p = state.newUserDetails.permissions;
    return Array.isArray(p) ? p : [];
  });

  //get permission for current page
  const permissionAccess = permissions.find((perm) => perm.PageID === Number(pageID.PageID));

  useEffect(() => {
    if (permissionAccess?.AccessID) {
      const access = permissionAccess.AccessID;
      console.log(access, 'assigned access to Report Engine Page');
      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true); // Show dialog for No Access or View Only
      } else {
        setShowAccessDialog(false);
      }
    }
  }, [permissionAccess]);

  const navigate = useNavigate();
  const handleRedirect = () => {
    setShowAccessDialog(false);
    navigate('/payment/dashboard');
  };

  const handleReportChange = (ev) => {
    setSelectReport(ev.target.value);
  };
  const handleWardChange = async (ev) => {
    setWardNo(ev.target.value);
    console.log(wardNo);
    try {
      const propertyRange = await fetchPropertyRangeByWard(wardNo);
      console.log('propertyRange:', propertyRange.properties);
      if (propertyRange.properties.length > 0) {
        setPropertyList(propertyRange.properties);
      }
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };
  const handlePropertyChange = async (ev) => {
    const propertyNo = ev.target.value;
    setProperty(propertyNo);
    console.log('Selected PropertyNo:', propertyNo);

    // Filter propertyList based on selected propertyNo
    const filteredPartitions = propertyList
      .filter((property) => property.NewPropertyNo === propertyNo)
      .map((partition) => partition.NewPartitionNo);

    console.log('Filtered Partitions:', filteredPartitions);

    // Update state
    setPartitionList(filteredPartitions);
  };
  const handlePartitionChange = (ev) => {
    const partitionNo = ev.target.value;
    console.log(partitionNo);
    setPartition(partitionNo);
    console.log('partitionNo', partition);
  };

  const handleFinanceYearChange = (ev) => {
    setFinanceYear(ev.target.value);
  };

  //render UI on selected MenuItem
  const renderMainCard = () => {
    switch (selectReport) {
      case 1:
        return renderCounterWise();
      case 2:
        return renderReceipt();
      case 3:
        return renderChalan();
      case 4:
        return renderTransactionReport();
      default:
        return null;
    }
  };
  const handleBillBookNo = (e) => {
    setBillBookNo(e.target.value);
  };
  const handleInvoiceNo = (e) => {
    setInvoiceNo(e.target.value);
  };

  const handleShowReport = async () => {
    try {
      const result = await showReport();
      console.log(result);
    } catch (error) {
      console.log('Error Fetching Reports');
      throw error;
    }
  };

  // Debug: Use useEffect to check updated state
  useEffect(() => {
    const getOwnerName = async () => {
      try {
        const owner = await fetchOwnerDetails(wardNo, property);
        const name = owner.length > 0 ? owner[0].OwnerName : '';
        setOwnerName(name);
      } catch (error) {
        console.error('Error fetching owner details:', error);
      }
    };

    getOwnerName();
    return () => {
      setOwnerName(null); // Reset state on unmount if needed
    };
  }, [property, partition]);
  useEffect(() => {
    return setOwnerName(''), setProperty(''), setPartition(''), setPropertyList([]), setPartitionList([]);
  }, [wardNo]);
  useEffect(() => {
    const fetchWardNoList = async () => {
      try {
        const wardList = await fetchWardList();
        const wardNumbers = wardList.map((item) => item.NewWardNo);
        setWardList(wardNumbers);
      } catch (error) {
        console.error('Error in fetching ward list:', error);
      }
    };
    fetchWardNoList();
  }, []);
  useEffect(() => {
    const fetchBillBookEntries = async () => {
      try {
        const data = await getBillBookList(); // Fetch data from API
        console.log('Fetched bill book entry list:', data); // Log the fetched data
        const yearList = data.map((entry) => entry.Year);
        setFinanceYearList(yearList);
        console.log('year', year);
        const filteredBillBooks = data
          .filter((entry) => entry.Year === year) // Filter by selected year
          .map((entry) => entry.BillBookNo); // Extract BillBookNo
        setBillBookNoList(filteredBillBooks);
        console.log(financeyearList);
        const filteredInvoiceNo = data
          .filter((entry) => entry.BillBookNo === billBookNo)
          .map((entry) => ({
            ReceiptNoFrom: entry.ReceiptNoFrom,
            ReceiptNoTo: entry.ReceiptNoTo
          }));
        if (filteredInvoiceNo.length > 0) {
          const { ReceiptNoFrom, ReceiptNoTo } = filteredInvoiceNo[0]; // Take the first match
          const numberRange = Array.from({ length: ReceiptNoTo - ReceiptNoFrom + 1 }, (_, i) => ReceiptNoFrom + i);
          setInvoiceNoList(numberRange);
          console.log('invoice list:', invoiceNoList);
        } else {
          setInvoiceNoList([]); // Reset if no match
        }

        console.log('invoice list:', invoiceNoList);
      } catch (error) {
      } finally {
      }
    };

    fetchBillBookEntries(); // Call the fetch function
  }, [year, billBookNo]);
  const renderCounterWise = () => {
    return (
      <>
        {showAccessDialog ? (
          <Dialog open={true} maxWidth="xs" fullWidth>
            <DialogTitle>{accessLevel === 1 ? 'No Access' : 'View Only Access'}</DialogTitle>
            <DialogContent>
              <Typography>
                {accessLevel === 1
                  ? 'You do not have permission to access this page.'
                  : 'You have view-only access. Editing or saving changes is not allowed.'}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  if (accessLevel === 1) {
                    handleRedirect();
                  } else {
                    setShowAccessDialog(false);
                  }
                }}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Stack spacing={3} direction={'row'} alignItems="center" marginTop={1}>
                <Stack spacing={1} sx={{ width: '120px' }}>
                  <InputLabel>Financial Year</InputLabel>
                </Stack>
                <Stack spacing={1}>
                  <Select
                    id="year-select"
                    value={year}
                    onChange={handleFinanceYearChange}
                    disabled={accessLevel < 3}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                  >
                    {financeyearList.map((year, index) => (
                      <MenuItem key={index} value={year}>
                        {year}-{year + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Stack spacing={3} direction={'row'} alignItems="center" marginTop={1}>
                <Stack spacing={1} sx={{ width: '120px' }}>
                  <InputLabel>From Date</InputLabel>
                </Stack>
                <Stack spacing={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker value={fromDate} onChange={(newValue) => setFr(newValue)} />
                    </DemoContainer>
                  </LocalizationProvider>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Stack spacing={3} direction={'row'} alignItems="center" marginTop={1}>
                <Stack spacing={1} sx={{ width: '120px' }}>
                  <InputLabel>To Date</InputLabel>
                </Stack>
                <Stack spacing={1}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker value={toDate} onChange={(newValue) => setToDate(newValue)} />
                    </DemoContainer>
                  </LocalizationProvider>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        )}
      </>
    );
  };

  //receipt UI
  const renderReceipt = () => {
    return (
      <>
        <Box justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Ward No:</InputLabel>
                <Select
                  id="ward-select"
                  value={wardNo}
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
                  {wardList.map((ward, index) => (
                    <MenuItem key={index} value={ward}>
                      {ward}
                    </MenuItem>
                  ))}
                  <MenuItem key="B1" value="B1">
                    B1
                  </MenuItem>
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Property No</InputLabel>
                <Select
                  id="property-select"
                  value={property}
                  onChange={handlePropertyChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                >
                  {propertyList.map((propertyNo, index) => (
                    <MenuItem key={index} value={propertyNo.NewPropertyNo}>
                      {propertyNo.NewPropertyNo}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Partition No:</InputLabel>
                <Select
                  id="partition-select"
                  value={partition}
                  onChange={handlePartitionChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                >
                  {partitionList.map((partitionNo, index) => (
                    <MenuItem key={index} value={partitionNo}>
                      {partitionNo}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={4} marginTop={1}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Owner Name:</InputLabel>
                <TextField required value={ownerName} />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Finacial Year:</InputLabel>
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
                  {financeyearList.map((year, index) => (
                    <MenuItem key={index} value={year}>
                      {year}-{year + 1}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={5}>
              <Stack spacing={1}>
                <InputLabel>From Date</InputLabel>
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker value={fromDate} onChange={(newValue) => setFromDate(newValue)} />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Stack spacing={1}>
                <InputLabel>To Date</InputLabel>
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker value={toDate} onChange={(newValue) => setToDate(newValue)} />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid container spacing={4} marginTop={1}>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1}>
                <InputLabel>Bill Book No</InputLabel>
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

            <Grid item xs={12} sm={4}>
              <Stack spacing={1}>
                <InputLabel>Invoice No</InputLabel>
                <Select
                  id="invoce-select"
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
        </Box>
      </>
    );
  };

  //Chalan UI
  const renderChalan = () => {
    return (
      <>
        <Box justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Ward No:</InputLabel>
                <Select
                  id="ward-select"
                  value={wardNo}
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
                  {wardList.map((ward, index) => (
                    <MenuItem key={index} value={ward}>
                      {ward}
                    </MenuItem>
                  ))}
                  <MenuItem key="B1" value="B1">
                    B1
                  </MenuItem>
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Property No</InputLabel>
                <Select
                  id="property-select"
                  value={property}
                  onChange={handlePropertyChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                >
                  {propertyList.map((propertyNo, index) => (
                    <MenuItem key={index} value={propertyNo.NewPropertyNo}>
                      {propertyNo.NewPropertyNo}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Partition No:</InputLabel>
                <Select
                  id="partition-select"
                  value={partition}
                  onChange={handlePartitionChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                >
                  {partitionList.map((partitionNo, index) => (
                    <MenuItem key={index} value={partitionNo}>
                      {partitionNo}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={4} marginTop={1}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Owner Name:</InputLabel>
                <TextField required value={ownerName} />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Finacial Year:</InputLabel>
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
                  {financeyearList.map((year, index) => (
                    <MenuItem key={index} value={year}>
                      {year}-{year + 1}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={5}>
              <Stack spacing={1}>
                <InputLabel>From Date</InputLabel>
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker value={fromDate} onChange={(newValue) => setFromDate(newValue)} />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Stack spacing={1}>
                <InputLabel>To Date</InputLabel>
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker value={toDate} onChange={(newValue) => setToDate(newValue)} />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid container spacing={4} marginTop={1}>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1}>
                <InputLabel>Bill Book No</InputLabel>

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

            <Grid item xs={12} sm={4}>
              <Stack spacing={1}>
                <InputLabel>Invoice No</InputLabel>
                <Select
                  id="invoce-select"
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
                  {invoiceNoList.map((invoiceNo) => (
                    <MenuItem key={invoiceNo} value={invoiceNo}>
                      {invoiceNo}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  //Transaction Report
  const renderTransactionReport = () => {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Stack spacing={3} direction={'row'} alignItems="center" marginTop={1}>
              <Stack spacing={1} sx={{ width: '120px' }}>
                <InputLabel>Financial Year</InputLabel>
              </Stack>
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
                  {financeyearList.map((year, index) => (
                    <MenuItem key={index} value={year}>
                      {year}-{year + 1}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Stack spacing={3} direction={'row'} alignItems="center" marginTop={1}>
              <Stack spacing={1} sx={{ width: '120px' }}>
                <InputLabel>From Date</InputLabel>
              </Stack>
              <Stack spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker value={fromDate} onChange={(newValue) => setFr(newValue)} />
                  </DemoContainer>
                </LocalizationProvider>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Stack spacing={3} direction={'row'} alignItems="center" marginTop={1}>
              <Stack spacing={1} sx={{ width: '120px' }}>
                <InputLabel>To Date</InputLabel>
              </Stack>
              <Stack spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker value={toDate} onChange={(newValue) => setToDate(newValue)} />
                  </DemoContainer>
                </LocalizationProvider>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <MainCard title="Report Engine">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <MainCard title="Select Report" style={{ color: '#1677ff' }}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel>Select Report</InputLabel>

                <Select id="report" value={selectReport} onChange={handleReportChange} disabled={accessLevel < 3}>
                  <MenuItem value={1}>Counter Wise Collection</MenuItem>
                  <MenuItem value={2}>Receipt</MenuItem>
                  <MenuItem value={3}>Chalan</MenuItem>
                  <MenuItem value={4}>Transaction Report</MenuItem>
                </Select>
              </Stack>
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6}>
          <MainCard>
            {selectReport !== null && (
              <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                {renderMainCard()}
              </Box>
            )}

            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" color="info" onClick={handleShowReport} disabled={accessLevel < 3}>
                Show Report
              </Button>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default ReportEngine;
