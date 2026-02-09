// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  FormControl,
  Select,
  Box,
  Button,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControlLabel,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress


} from '@mui/material';
import dayjs from 'dayjs';

// project import
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  fetchGetProperties,
  sendToAll,
  sendToSelected,
  importFromExcel,

} from 'services/Amc/defaulter-list-amc-account/defaulterListAMCAccount';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
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
function DefaulterListAmcAccount() {
  const [tableData, setTableData] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectWards, setSelectWards] = useState([]);
  const [propertyNoListFrom, setpropertyNoListFrom] = useState([]);
  const [propertyNoListTo, setpropertyNoListTo] = useState([]);
  const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const [selectedPropertyNoTo, setSelectedPropertyNoTo] = useState('');
  const [financeYearList, setFinanceYearList] = useState([]);
  const [year, setYear] = useState('');
  const [penalty, setPenalty] = useState({
    currentPenalty: false,
    pendingPenalty: false
  });
  const [propertyDesc, setPropertyDesc] = useState([]);
  const [topProperty, setTopProperty] = useState();
  const [taxTotalGreater, setTaxTotalGreater] = useState();
  const [penaltyDate, setPenaltyDate] = useState(dayjs());
  const [ignoreFields, setIgnoreFields] = useState({
    mobileNo: true,
    emailId: true
  });
  const [moreinfo, setMoreInfo] = useState([]);
  const MoreInfo = [
    'OwnerName',
    'MarathiOwnerName',
    'RenterName',
    'MarathiRenterName',
    'Property Description',
    'OccupierName',
    'MarathiOccupierName',
    'BuildingOrShopName',
    'BuildingOrShopNameMarathi',
    'Address',
    'Shop No(English)',

    'All Taxes(Head Wise)C',
    'All Taxes(Head Wise)P'
  ];

  const propertyDescArray = [
    'निवासी',
    'खाजगी शाळा',
    ' न. प. शाळा',
    'शासकीय शाळा',
    'डिस्पेन्सरी',
    'खाजगी रुग्णालय',
    'शासकीय रुग्णालय',
    'प्राथमिक आरोग्य केंद्र'
  ];

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);
  const [openDialog, setOpenDialog] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [receivedStatus, setReceivedStatus] = useState(null)
  const [receivedMessage, setReceivedMessage] = useState('')
  const [openloader, setOpenLoader] = useState(false);


  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Defaulter List Amc Account';
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
      console.log(access, 'assigned access to Defaulter List Amc Account Page');
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

  const handleSelectWard = async (wardNo) => {
    setSelectWards((prevSelected) => {
      // If the user clicked "Select All", toggle between select all and none
      if (wardNo === 'All') {
        return prevSelected.length === wardList.length ? [] : wardList;
      }

      // If a single ward is selected/deselected
      if (prevSelected.includes(wardNo)) {
        return prevSelected.filter((selectedWard) => selectedWard !== wardNo); // Deselect the ward
      } else {
        return [...prevSelected, wardNo];
      }
    });
  };
  useEffect(() => {
    const fetchWardNoList = async () => {
      try {
        const wardList = await fetchWardList();
        const wardNumbers = wardList.map(item => item.NewWardNo);

        // Sort: numeric first → then alpha, both ascending
        wardNumbers.sort((a, b) => {
          const isNumA = !isNaN(a);
          const isNumB = !isNaN(b);

          if (isNumA && !isNumB) return -1; // A before B
          if (!isNumA && isNumB) return 1;  // B before A

          // If both numbers
          if (isNumA && isNumB) return Number(a) - Number(b);

          // If both strings/letters
          return a.localeCompare(b);
        });

        setWardList(wardNumbers);

      } catch (error) {
        console.error('Error in fetching ward list:', error);
      }
    };

    fetchWardNoList();
  }, []);
  useEffect(() => {
    const propertyRange = async () => {
      try {
        if (selectWards.length === 1) {
          const propertyRange = await fetchPropertyRangeByWard(selectWards);
          console.log('propertyRange:', propertyRange.properties);
          setpropertyNoListTo(propertyRange.properties);
          setpropertyNoListFrom(propertyRange.properties);
        }
      } catch (error) {
        console.log('Error Fetching Property Range:', error);
        throw error;
      }
    };
    propertyRange();
  }, [selectWards]);
  const handlePropertyChangeFrom = (e) => {
    console.log('handlePropertyChangeFrom');
    const selectedValue = Number(e.target.value); // Ensure numerical comparison
    if (selectedPropertyNoTo && selectedValue > selectedPropertyNoTo) {
      alert('From Property cannot be greater than To Property.');
      return;
    }
    console.log('handlePropertyChangeFrom2');
    console.log(selectedValue);
    setSelectedPropertyNoFrom(selectedValue);
    console.log(selectedPropertyNoFrom);
  };

  const handlePropertyChangeTo = (e) => {
    console.log('handlePropertyChangeto');
    const selectedValue = Number(e.target.value); // Ensure numerical comparison
    if (selectedPropertyNoFrom && selectedValue < selectedPropertyNoFrom) {
      setReceivedMessage('From Property Can Not Be Greater Than To Property')
      setReceivedStatus(500)
      setSnackbarOpen(true)
      return

    }
    console.log('handlePropertyChangeto2');
    setSelectedPropertyNoTo(selectedValue);
    console.log(selectedPropertyNoTo);
  };

  const handleYearChange = (event) => {
    const value = event.target.value;
    setYear(value);
  };

  useEffect(() => {
    const fetchBillBookEntries = async () => {
      try {
        const data = await getBillBookList(); // Fetch data from API
        console.log('Fetched bill book entry list:', data); // Log the fetched data
        const yearList = data.map((entry) => entry.Year);
        setFinanceYearList(yearList);
      } catch (error) {
        console.error('Error in fetching Financial year ', error);
        throw error;
      }
    };
    fetchBillBookEntries();
  }, []);
  const handlePenaltyFields = (event) => {
    setPenalty({
      ...penalty,
      [event.target.name]: event.target.checked
    });
  };

  const handleMoreInfoChange = (event) => {
    const value = event.target.value;
    setMoreInfo(value);
  };

  //for property description select
  const HandlePropertyDescChange = (propertyindex) => {
    const updatedSelectedDesc = [...propertyDesc];

    // Check if the clicked checkbox is already selected
    const currentIndex = updatedSelectedDesc.indexOf(propertyindex);

    // If it's not selected, add it to the selected checkboxes array
    // If it's already selected, remove it from the selected checkboxes array
    if (currentIndex === -1) {
      updatedSelectedDesc.push(propertyindex);
    } else {
      updatedSelectedDesc.splice(currentIndex, 1);
    }

    setPropertyDesc(updatedSelectedDesc);
  };
  const handleTopProperty = (e) => {
    const topPropertyRange = e.target.value;
    setTopProperty(topPropertyRange);
  };

  useEffect(() => {

  }, [topProperty, openloader, taxTotalGreater, penaltyDate, propertyDesc, ignoreFields, penalty, financeYearList, year, moreinfo]);


  const handleTaxTotalGreater = (e) => {
    const taxTotal = e.target.value;
    setTaxTotalGreater(taxTotal);
  };

  const handlePenaltyDate = (newDate) => {
    setPenaltyDate(newDate);
  };

  useEffect(() => {
    console.log('tableData changed:', tableData);
  }, [tableData, snackbarOpen]);
  const handleFetchGetProperties = async () => {
    if (!year) {
      setReceivedMessage('Please select year')
      setReceivedStatus(500)
      setSnackbarOpen(true)
      return
    }
    if (!selectWards) {
      setReceivedMessage('Please select ward')
      setReceivedStatus(500)
      setSnackbarOpen(true)
      return

    }
    const data = { selectWards, selectedPropertyNoFrom, selectedPropertyNoTo, year, penalty, topProperty, taxTotalGreater, penaltyDate, ignoreFields, moreinfo }
    try {
      setOpenLoader(true);
      const result = await fetchGetProperties(data);
      console.log(result, 'result from get properties')
      const ownerDetails = result.data.ownerDetails || [];
      const currentBalanceDetails = result.data.currentBalanceDetails || [];
      const pendingBalanceDetails = result.data.pendingBalanceDetails || [];
      const totalBalanceDetails = result.data.totalBalanceDetails || [];
      const penaltyCurrent = result.data.penaltyCurrent || [];
      const penaltyPending = result.data.penaltyPending || [];
      const prevPendingInterestList = result.data.prevPendingInterestList || [];
      const netTotal = result.data.netTotal || [];
      const ownerIds = result.data.ownerIds || [];
      const propertyDetails = result.data.propertyDetails || [];
      const allFieldsCurrentRaw = result.data.allFieldsCurrent;
      const allFieldsPendingRaw = result.data.allFieldsPending;
      const rowWiseData = ownerIds.map((owner, index) => {
        const property = propertyDetails[index] || {};
        const {
          NewWardNo,
          NewPropertyNo,
          NewPartitionNo,
          ...restProperty
        } = property;

        const prefixKeys = (obj, prefix) => {
          const newObj = {};
          for (const key in obj) {
            newObj[`${prefix}${key}`] = obj[key];
          }
          return newObj;
        };

        let allFieldsCurrent = {};
        let allFieldsPending = {};

        // ✅ For current fields

        if (allFieldsCurrentRaw && typeof allFieldsCurrentRaw[0] === 'object') {
          const obj = allFieldsCurrentRaw[0];
          console.log(obj, 'obj')
          const arr = Object.values(obj); // converts {0:{…},1:{…}} → [{…},{…}]
          const matched = arr.find(o => Number(o.OwnerID) == Number(owner.OwnerID));
          console.log(matched, 'matched')

          if (matched) {
            allFieldsCurrent = Object.fromEntries(
              Object.entries(matched)
                .filter(([key]) => key !== 'OwnerID') // skip OwnerID
                .map(([key, value]) => [`Current_${key}`, value])
            );
            console.log(allFieldsCurrent, 'allFieldsCurrent');
          }
        }

        // ✅ Handle allFieldsPendingRaw
        if (allFieldsPendingRaw && typeof allFieldsPendingRaw[0] === 'object') {
          const obj = allFieldsPendingRaw[0];
          console.log(obj, 'pending obj');

          const arr = Object.values(obj); // converts {0:{…},1:{…}} → [{…},{…}]
          const matched = arr.find(o => Number(o.OwnerID) === Number(owner.OwnerID));
          console.log(matched, 'matched pending');

          if (matched) {
            allFieldsPending = Object.fromEntries(
              Object.entries(matched)
                .filter(([key]) => key !== 'OwnerID') // skip OwnerID
                .map(([key, value]) => [`Pending_${key}`, value])
            );
            console.log(allFieldsPending, 'allFieldsPending');
          }
        }
        return {
          // OwnerId: ownerIds[index]?.OwnerID || '',
          NewWardNo: NewWardNo || '',
          NewPropertyNo: NewPropertyNo || '',
          NewPartitionNo: NewPartitionNo || '',
          ...owner,
          ...restProperty,
          ...allFieldsPending,
          ...allFieldsCurrent,
          pendingBalance: pendingBalanceDetails[index]?.TotalTax || 0,
          currentBalance: currentBalanceDetails[index]?.TotalTax || 0,
          totalBalance: totalBalanceDetails[index]?.TotalBalance || 0,
          prevInterest: prevPendingInterestList[index] || 0,
          pendingInterest: penaltyPending[index] || 0,
          currentInterest: penaltyCurrent[index] || 0,
          grandTotal: netTotal[index]?.GrandTotal || 0
        };
      });
      console.log(rowWiseData, 'rowWiseData')
      setTableData(rowWiseData);
      setOpenLoader(false);
    } catch (error) {
      console.error('Error while fetching');
      setOpenLoader(false);
      throw error;
    }
  };
  const headers = tableData && tableData.length > 0
    ? Object.keys(tableData[0])
    : [];
  const handleSendToAll = async () => {
    try {
      const result = await sendToAll();
    } catch (error) {
      console.error('Error while fetching');
      throw error;
    }
  };
  const handleSendToSelected = async () => {
    try {
      const result = await sendToSelected();
    } catch (error) {
      console.error('Error while fetching');
      throw error;
    }
  };
  const handleImportFromExcel = async () => {
    try {
      const result = await importFromExcel();
    } catch (error) {
      console.error('Error while fetching');
      throw error;
    }
  };
  useEffect(() => {

  }, [openDialog, snackbarOpen, receivedMessage, receivedStatus])


  const handleExportToExcel = async (type) => {
    setOpenDialog(false)
    try {
      if (!tableData || tableData.length === 0) return;

      const workbook = new ExcelJS.Workbook();


      if (type == 'All Wards') {
        // 🟢 Single Sheet
        const worksheet = workbook.addWorksheet('All Properties');

        const headers = Object.keys(tableData[0]);
        worksheet.columns = headers.map(key => ({
          header: key,
          key: key,
          width: 20
        }));

        tableData.forEach(row => worksheet.addRow(row));
      }

      if (type == 'Ward Wise') {
        // 🟡 Ward Wise Multiple Sheets
        // Group data by ward
        const groupedByWard = tableData.reduce((acc, row) => {
          const ward = row.NewWardNo || 'Unknown Ward';
          if (!acc[ward]) acc[ward] = [];
          acc[ward].push(row);
          return acc;
        }, {});

        Object.entries(groupedByWard).forEach(([ward, rows]) => {
          const worksheet = workbook.addWorksheet(`Ward ${ward}`);

          const headers = Object.keys(rows[0]);
          worksheet.columns = headers.map(key => ({
            header: key,
            key: key,
            width: 20
          }));

          rows.forEach(row => worksheet.addRow(row));
        });
      }

      // 4️⃣ Download the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, type === 'all' ? 'AllProperties.xlsx' : 'WardWiseProperties.xlsx');
      setSnackbarOpen(true);
      setReceivedStatus(200)
      setReceivedMessage('Downlading Started')


    } catch (error) {
      console.error('Error exporting Excel:', error);
    }


  };
  const handleClear = () => {
    setSelectWards([]);
    setpropertyNoListFrom([]);
    setpropertyNoListTo([]);
    setSelectedPropertyNoFrom(null);
    setSelectedPropertyNoTo(null);
    setYear('');
    setPenalty({
      currentPenalty: false,
      pendingPenalty: false
    });
    setPropertyDesc([]);
    setTopProperty('');
    setTaxTotalGreater('');
    setPenaltyDate(dayjs());
    setIgnoreFields({
      mobileNo: false,
      emailId: false
    });
    setMoreInfo([]);
  };
  const handleCloseLoader = () => {
    setOpenLoader(false);
  }

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
        <MainCard title="Defaulter List">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
                <InputLabel>Ward No</InputLabel>
                <FormControl fullWidth>
                  <InputLabel>Select Ward</InputLabel>
                  <Select
                    multiple
                    value={selectWards}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    disabled={accessLevel < 3}
                  >
                    <MenuItem value="All Selected" onClick={() => handleSelectWard('All')}>
                      <FormControlLabel label="Select All" control={<Checkbox checked={selectWards.length === wardList.length} />} />
                    </MenuItem>

                    {wardList.map((wardNo) => (
                      <MenuItem key={wardNo} value={wardList} onClick={() => handleSelectWard(wardNo)}>
                        <FormControlLabel label={wardNo} control={<Checkbox checked={selectWards.includes(wardNo)} />} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={2.2}>
              <Stack spacing={1}>
                <InputLabel>From Property No</InputLabel>
                <Select
                  id="ward-select"
                  placeholder="ward no"
                  disabled={selectWards.length > 1 || accessLevel < 3}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                  value={selectedPropertyNoFrom}
                  onChange={handlePropertyChangeFrom}
                >
                  {propertyNoListFrom.map((property, index) => (
                    <MenuItem key={index} value={property.NewPropertyNo}>
                      {property.NewPropertyNo}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={2.2}>
              <Stack spacing={1}>
                <InputLabel>To Property No</InputLabel>
                <Select
                  id="ward-select"
                  placeholder="ward no"
                  disabled={selectWards.length > 1 || accessLevel < 3}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                  value={selectedPropertyNoTo}
                  // error={!!error.selectedPropertyNoTo}
                  // helperText={error.selectedPropertyNoTo}
                  // FormHelperTextProps={{ style: { color: 'red' } }}
                  onChange={handlePropertyChangeTo}
                >
                  {propertyNoListTo.map((property, index) => (
                    <MenuItem key={index} value={property.NewPropertyNo}>
                      {' '}
                      {/* Use the correct property name */}
                      {property.NewPropertyNo}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
                <InputLabel>Financial Year</InputLabel>
                <FormControl fullWidth>
                  <Select
                    value={year}
                    onChange={handleYearChange}
                    id="year-select"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    disabled={accessLevel < 3}
                  >
                    {financeYearList.map((year, index) => (
                      <MenuItem key={index} value={year}>
                        {year}-{year + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2.5}>
              <Typography variant="h5" style={{ color: '#1677ff', fontWeight: 'bold' }} sx={{ paddingLeft: 1 }} disabled={accessLevel < 3}>
                Penalty
              </Typography>
              <Stack spacing={2} direction={'row'} alignItems="center" marginTop={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="currentPenalty"
                      checked={penalty.currentPenalty}
                      onChange={handlePenaltyFields}
                      disabled={accessLevel < 3}
                    />
                  }
                  label={<Box fontWeight="bold">Current</Box>}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="pendingPenalty"
                      checked={penalty.pendingPenalty}
                      onChange={handlePenaltyFields}
                      disabled={accessLevel < 3}
                    />
                  }
                  label={<Box fontWeight="bold">Pending</Box>}
                />
              </Stack>
            </Grid>
            {/* 
            <Grid item xs={12} sm={2.2}>
              <Stack spacing={1}>
                <InputLabel>Property Description</InputLabel>
                <Box
                  style={{
                    maxHeight: '130px',
                    overflowY: 'auto',
                    border: '2px solid #ccc',
                    color: '#1677ff'
                  }}
                >
                  {propertyDescArray.map((label, propertyindex) => (
                    <Box key={propertyindex} className="form-check">
                      <label htmlFor={`propertyDesc${propertyindex}`}>
                        <Checkbox
                          id={`propertyDesc${propertyindex}`}
                          checked={propertyDesc.includes(propertyindex)}
                          onChange={() => HandlePropertyDescChange(propertyindex)}
                          disabled={accessLevel < 3}
                        />
                        {label}
                      </label>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Grid>*/}
          </Grid>

          <Grid container marginTop={4}>
            <Grid item xs={12} sm={4.5}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5.2}>
                  <Typography variant="h5" style={{ color: '#1677ff', fontWeight: 'bold' }} marginBottom={2}>
                    Condition
                  </Typography>
                  <Stack spacing={1}>
                    <InputLabel>Top Property</InputLabel>
                    <TextField
                      value={topProperty}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow only digits (no decimal)
                        if (/^\d*$/.test(val)) {
                          handleTopProperty(e);
                        }
                      }}
                      required
                      disabled={accessLevel < 3}
                    />

                  </Stack>
                </Grid>
                <Grid item xs={12} sm={5.2} marginTop={5}>
                  <Stack spacing={1}>
                    <InputLabel>Tax Total Greater</InputLabel>
                    <TextField value={taxTotalGreater} onChange={(e) => {
                      const val = e.target.value;
                      // Allow only digits (no decimal)
                      if (/^\d*$/.test(val)) {
                        handleTaxTotalGreater(e);
                      }
                    }} required disabled={accessLevel < 3} />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={2.5} marginTop={5} sx={{ paddingRight: 4 }}>
              <Stack spacing={1}>
                <InputLabel>Penalty Date</InputLabel>
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker value={penaltyDate} onChange={handlePenaltyDate} disabled={accessLevel < 3} />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3} marginTop={4} sx={{ paddingLeft: 2 }}>
              <Typography variant="h5" style={{ color: '#1677ff', fontWeight: 'bold' }} sx={{ paddingLeft: 1 }}>
                Ignore Existence
              </Typography>

              <Stack spacing={1} direction={'row'} marginTop={2}>
                <FormControlLabel
                  control={
                    <Checkbox name="mobileNo" checked={ignoreFields.mobileNo} disabled={accessLevel < 3} />
                  }
                  label={<Box fontWeight="bold">Mobile No.</Box>}
                />
                <FormControlLabel
                  control={
                    <Checkbox name="emailId" checked={ignoreFields.emailId} disabled={accessLevel < 3} />
                  }
                  label={<Box fontWeight="bold">Email Id</Box>}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={2} marginTop={4} sx={{ paddingRight: 2 }}>
              <Stack spacing={1}>
                <InputLabel>Also Include</InputLabel>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={moreinfo}
                    onChange={handleMoreInfoChange}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    disabled={accessLevel < 3}
                  >
                    {MoreInfo.map((info) => (
                      <MenuItem key={info} value={info}>
                        <Checkbox checked={moreinfo.indexOf(info) !== -1} />
                        <ListItemText primary={info} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={2} marginTop={5}>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <Button variant="contained" color="success" onClick={handleFetchGetProperties} disabled={accessLevel < 3}>
                  Get Properties
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <Button variant="contained" color="warning" onClick={handleSendToAll} disabled={accessLevel < 3}>
                  Send To All
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <Button variant="contained" color="info" onClick={handleSendToSelected} disabled={accessLevel < 3}>
                  Send To Selected
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <Button variant="contained" color="info" onClick={handleImportFromExcel} disabled={accessLevel < 3}>
                  Import From Excel
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <Button variant="contained" color="warning" onClick={() => setOpenDialog(true)} disabled={accessLevel < 3}>
                  Export To Excel
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <Button variant="contained" color="success" onClick={handleClear} disabled={accessLevel < 3}>
                  Clear All
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Box marginTop={4} sx={{ textAlign: 'center' }}>
            <div style={{ width: '100%', borderBottom: '1px solid gray', margin: '10px auto' }} />
          </Box>
          <Box sx={{ overflowX: 'auto', height: '300px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      {header.replace(/([A-Z])/g, ' $1').trim()} {/* Format header nicely */}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header) => (
                      <TableCell key={header}>
                        {row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </MainCard>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle >Dowload List According to :</DialogTitle>
        <DialogContent>


        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={() => handleExportToExcel('All Wards')} autoFocus>
            All Wards
          </Button>
          <Button variant="contained" color="success" onClick={() => handleExportToExcel('Ward Wise')} autoFocus>
            Ward Wise
          </Button>

          <Button variant="contained" color="error" onClick={() => setOpenDialog(false)} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={receivedStatus == 200 || receivedStatus == 201 ? 'success' : receivedStatus == 202 ? 'info' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {receivedMessage}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openloader}
      // onClick={handleCloseLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default DefaulterListAmcAccount;
