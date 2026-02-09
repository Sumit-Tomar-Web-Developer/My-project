import React, { useEffect, useState } from 'react';
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Button,
  Select,
  MenuItem,
  Checkbox,
  Snackbar,
  SnackbarContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';

// Import MainCard if it's a custom component; otherwise, you might need to adjust this
import MainCard from 'components/MainCard';

// Use DataGrid from MUI
import { DataGrid } from '@mui/x-data-grid';
import { getUserRole } from 'services/Amc/user-role-services/userRoleService';
import {
  fetchZoneSectionDetailsList,
  fetchZoneSectionMasterList
} from 'services/masterServices/zone-section-master-services/zone-section-master.services';
import { createOrUpdateBillBookEntry, getBillBookList, getTransYear } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';

function BillBookEntry() {
  const [zoneList, setZoneList] = useState([]);
  const [errors, setErrors] = useState({});
  const [roleList, setRoleList] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const [year, setYear] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [status, setStatus] = useState([]);
  const [yearTrans, setYearTransList] = useState([]);
  const [reloadPage, setReloadPage] = useState(false);
  const [zoneSectionDetails, setZoneSectionDetailsList] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');

  const [Type, setType] = useState([]);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Bill Book Entry';
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
      console.log(access, 'assigned access to Bill Book Entry Page');
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

  const handleStatusChange = (event) => {
    const { value } = event.target;
    setBillBookData((prevData) => ({
      ...prevData,
      status: value 
    }));
  };

  const handleBillTypeChange = (event) => {
    const { value } = event.target;
    setBillBookData((prevData) => ({
      ...prevData,
      BillBookType: value // Update the BillBookType in BillBookData
    }));
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  //  data for the table

  const [rows, setRows] = useState([]); // State to hold the rows
  const [loading, setLoading] = useState(true); // State for loading indicator
  // ///////////backend////////////////

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchBillBookEntries = async () => {
      try {
        setLoading(true); // Set loading state to true
        const data = await getBillBookList(); // Fetch data from API
        console.log('Fetched bill book entry list:', data); // Log the fetched data

        // Transform the data to match the DataGrid's expected format
        const formattedData = data.map((entry, index) => ({
          id: entry.id || index + 1,
          userName: entry.EmpName,
          regZone: entry.ZoneNo,
          regWard: entry.WardNo,
          BillBookNo: entry.BillBookNo,
          fromReceipt: entry.ReceiptNoFrom,
          toReceipt: entry.ReceiptNoTo,
          date: new Date(entry.Date).toLocaleDateString(),
          year: entry.Year,
          remark: entry.Remark,
          status: entry.Status,
          BillBookType: entry.BillBookType
        }));
        console.log('Formatted data:', formattedData); // Log the formatted data
        setRows(formattedData); // Set the transformed data to rows state
      } catch (error) {
        console.error('Failed to fetch bill book entries:', error);
        setErrors('Error fetching data'); // Handle errors
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchBillBookEntries(); // Call the fetch function
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'userName', headerName: 'USER NAME', width: 160 },
    { field: 'regZone', headerName: 'ZONE NO.', width: 110 },
    { field: 'regWard', headerName: ' WARD NO.', width: 110 },
    { field: 'BillBookNo', headerName: 'BILL BOOK NO.', width: 110 },
    { field: 'fromReceipt', headerName: 'FROM RECEIPT', width: 110 },
    { field: 'toReceipt', headerName: 'TO RECEIPT', width: 110 },
    { field: 'date', headerName: 'DATE', width: 110 },
    {
      field: 'year',
      headerName: 'Year',
      width: 110,
      filterable: true // Enables built-in filtering for the 'Year' column
    },
    { field: 'remark', headerName: 'REMARK', width: 100 },
    { field: 'status', headerName: 'STATUS', width: 100 },
    { field: 'BillBookType', headerName: 'BILL BOOK TYPE', width: 100 }
  ];

  const formattedDate = format(startDate, 'yyyy-MM-dd');
  const parsedDate = parseISO(formattedDate);
  const [BillBookData, setBillBookData] = useState({
    ZoneNo: 0,
    Role: 0,
    date: format(startDate, 'yyyy-MM-dd'), // Format date for submission
    IssueByName: '',
    // financeYear: '',
    Year: '',
    status: null,
    BillBookNo: '',
    fromReceipt: '',
    toReceipt: '',
    remark: '',
    BillBookType: '',
    WardNos: '',
    UserID: ''
  });

  const handleCancel = () => {
    setBillBookData({
      ZoneNo: 0,
      Role: 0,
      date: format(startDate, 'yyyy-MM-dd'), // Format date for submission
      IssueByName: '',
      // financeYear: '',
      Year: '',
      status: '',
      BillBookNo: '',
      fromReceipt: '',
      toReceipt: '',
      remark: '',
      BillBookType: '',
      WardNos: '',
      UserID: ''
    });
    setSelectedWards([]);
    //  handleSelectedWardInZone();
    setErrors([]);
  };
  //zone

  useEffect(() => {
    fetchZoneSectionMasterList().then((res) => setZoneList(res.data));
    setReloadPage(false);
  }, [reloadPage]);
  //ward
  useEffect(() => {
    fetchZoneSectionDetailsList().then((res) => setZoneSectionDetailsList(res.data));
    setReloadPage(false);
  }, [filteredWards]);

  const [selectedWards, setSelectedWards] = useState([]);

  const handleSelectedWardInZone = (index) => {
    if (index === 'all') {
      // If 'All' is selected
      if (selectedWards.length === filteredWards.length) {
        // Deselect all wards
        setSelectedWards([]);
        setBillBookData((prev) => ({ ...prev, WardNos: [] })); // Clear the wards in BillBookData
      } else {
        // Select all wards
        const allWards = filteredWards.map((_, i) => i);
        setSelectedWards(allWards);
        setBillBookData((prev) => ({ ...prev, WardNos: filteredWards })); // Update BillBookData with all ward names
      }
    } else {
      // Handle individual ward selection
      setSelectedWards((prevSelectedWards) => {
        let updatedWards;
        if (prevSelectedWards.includes(index)) {
          // If the ward is already selected, remove it
          updatedWards = prevSelectedWards.filter((selectedIndex) => selectedIndex !== index);
        } else {
          // If not selected, add it
          updatedWards = [...prevSelectedWards, index];
        }

        const updatedWardNames = updatedWards.map((i) => filteredWards[i]);
        setBillBookData((prev) => ({ ...prev, WardNos: updatedWardNames })); // Update BillBookData with the selected ward names
        return updatedWards;
      });
    }
  };

  // Check if 'All' should be checked (when all wards are selected)
  const isAllSelected = filteredWards.length > 0 && selectedWards.length === filteredWards.length;

  const handleZoneChange = (event) => {
    const selectedZoneNo = event.target.value;

    // Set the selected zone in the state
    setSelectedZone(selectedZoneNo);

    // Filter wards based on the selected zone
    const wards = zoneSectionDetails.filter((zone) => zone.ZoneSectionNo === selectedZoneNo).map((zone) => zone.Ward);

    setFilteredWards(wards);

    // Update the BillBookData object with the selected ZoneNo
    setBillBookData((prevData) => ({
      ...prevData,
      ZoneNo: selectedZoneNo
    }));
  };

  //role
  const fetchRoleUser = async () => {
    try {
      const response = await getUserRole();
      console.log(response, 'API Response');
      const fetchedRoleList = response; // Assuming API returns an array of roles directly
      setRoleList(fetchedRoleList); // Update the roleList state
    } catch (error) {
      console.error('Error fetching role list:', error);
      setRoleList([]); // Set empty array if there's an error
    }
  };

  useEffect(() => {
    fetchRoleUser();
  }, []);

  //year fetch
  const fetchYear = async () => {
    try {
      const response = await getTransYear();
      console.log(response, 'API Response');
      const fetchedYearList = response; // Assuming API returns an array of roles directly
      setYearTransList(fetchedYearList); // Update the roleList state
    } catch (error) {
      console.error('Error fetching year list:', error);
      setYearTransList([]);
    }
  };

  useEffect(() => {
    fetchYear();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setBillBookData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value
      };

      if (name === 'Role') {
        const selectedRole = roleList.find((role) => role.role === value);

        if (selectedRole) {
          updatedData.IssueByName = selectedRole.name;
          updatedData.UserID = selectedRole.UserID;
          console.log('Updated IssueByName and UserID:', updatedData.IssueByName, updatedData.UserID);

        } else {
          updatedData.IssueByName = '';
          updatedData.UserID = ''; // Reset UserID if no role is found
        }
      }

      if (name === 'Year') {
        updatedData.Year = value;
      }

      return updatedData;
    });
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!BillBookData.Role) newErrors.Role = 'Role is required';
    if (!BillBookData.IssueByName) newErrors.IssueByName = 'Issue By is required'; // Validation for Issue By field

    if (!BillBookData.ZoneNo) newErrors.ZoneNo = 'Zone is required';
    if (!BillBookData.Year) newErrors.Year = 'Year is required';
    if (!BillBookData.BillBookNo) newErrors.BillBookNo = 'Bill Book No. is required';
    if (!BillBookData.fromReceipt) newErrors.fromReceipt = 'From Receipt is required';
    if (!BillBookData.toReceipt) newErrors.toReceipt = 'To Receipt is required';
    if (!BillBookData.date) newErrors.date = 'Date is required';
    if (!BillBookData.remark) newErrors.remark = 'Remark is required';
    if (!BillBookData.BillBookType) newErrors.BillBookType = 'Bill Book Type is required';
    if (typeof BillBookData.status !== 'boolean') {
      newErrors.status = 'Status is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // const handleSave = async () => {
  //   if (!validateFields()) return;

  //   setLoading(true);
  //   try {
  //     const response = await createOrUpdateBillBookEntry(BillBookData);
  //     console.log('Response from API:', response);
  //     setReceivedMessage(response.message);
  //     setSnackbarSeverity('success');
  //     setSnackbarMessage(receivedMessage);
  //     setSnackbarOpen(true);
  //   } catch (err) {
  //     const validationErrors = {};

  //     // Check if the error has inner validation errors
  //     if (err.inner) {
  //       err.inner.forEach((error) => {
  //         validationErrors[error.path] = error.message;
  //       });
  //       setErrors(validationErrors);
  //     } else {
  //       // Handle unexpected errors and set a generic message
  //       setSnackbarSeverity('error');
  //       console.log('Duplicate Year and Bill Book No.');
  //       setReceivedMessage('Duplicate Bill BOOK Entry');
  //       setSnackbarMessage(receivedMessage || 'An unexpected error occurred. Please try again.');
  //       setSnackbarOpen(true);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSave = async () => {
    if (!validateFields()) return;
  
    setLoading(true);
    try {
      const response = await createOrUpdateBillBookEntry(BillBookData);
      console.log('Response from API:', response);
  
      // Show snackbar
      setReceivedMessage(response.message);
      setSnackbarSeverity('success');
      setSnackbarMessage(response.message);
      setSnackbarOpen(true);
  
      // Add new entry to rows for DataGrid
      const newRow = {
        id: rows.length + 1, // or response.id if backend returns ID
        userName: BillBookData.IssueByName,
        regZone: BillBookData.ZoneNo,
        regWard: BillBookData.WardNos.join(', '),
        BillBookNo: BillBookData.BillBookNo,
        fromReceipt: BillBookData.fromReceipt,
        toReceipt: BillBookData.toReceipt,
        date: BillBookData.date,
        year: BillBookData.Year,
        remark: BillBookData.remark,
        status: BillBookData.status ? 'Active' : 'Deactive',
        BillBookType: BillBookData.BillBookType,
        UserID: BillBookData.UserID 
      };
  
      setRows((prevRows) => [...prevRows, newRow]); // Add new row to table
  
      handleCancel(); // Reset form fields
    } catch (err) {
      // existing error handling...
    } finally {
      setLoading(false);
    }
  };
  
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
        <MainCard title="Bill Book Entry">
          <Grid container spacing={2}>
            {/* Left Side Fields */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={1} mb={1}>
                {/* Role Dropdown */}
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Role</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3}>
                  <Stack spacing={1}>
                    <Select
                      sx={{ minWidth: '100px' }}
                      value={BillBookData.Role || 0} // Default to 0 if Role is not set
                      onChange={handleInputChange}
                      name="Role"
                      error={!!errors.Role}
                      helperText={errors.Role}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    >
                      <MenuItem value={0} disabled>
                        Select
                      </MenuItem>
                      {roleList.length > 0 ? (
                        // Get unique roles to display in dropdown
                        [...new Set(roleList.map((role) => role.role))].map((roleName, index) => (
                          <MenuItem key={index} value={roleName}>
                            {roleName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No roles available</MenuItem>
                      )}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
              {/* 2nd field */}
              <Grid container spacing={0} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Zone Section</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3}>
                  <Stack spacing={1}>
                    <Select
                      sx={{ minWidth: '100px' }}
                      value={BillBookData.ZoneNo || 0}
                      disabled={accessLevel < 3}
                      onChange={(event) => {
                        console.log('Selected Zone:', event.target.value);
                        handleZoneChange(event);
                      }}
                      name="ZoneNo"
                      error={!!errors.ZoneNo}
                      helperText={errors.ZoneNo}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                    >
                      <MenuItem value={0} disabled>
                        Select
                      </MenuItem>
                      {zoneList.length > 0 ? (
                        // zoneList.map((role) => (
                        [...new Set(zoneList.map((role) => role.ZoneSectionNo))].map((ZoneSectionNo, index) => (
                          <MenuItem key={index} value={ZoneSectionNo}>
                            {ZoneSectionNo}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No zones available</MenuItem>
                      )}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Side Fields */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={1} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Issue By:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3}>
                  <Stack spacing={1}>
                    <Select
                      sx={{ minWidth: '100px' }}
                      value={BillBookData.IssueByName || ''} // Default to empty if Issue By is not set
                      onChange={handleInputChange}
                      name="IssueByName"
                      error={!!errors.IssueByName}
                      helperText={errors.IssueByName}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    >
                      <MenuItem value="" disabled>
                        Select
                      </MenuItem>

                      {/* Filter and show names based on the selected role */}
                      {roleList
                        .filter((role) => role.role === BillBookData.Role) // Match selected role
                        .map((role) => (
                          <MenuItem key={role.id} value={role.name}>
                            {role.name}
                          </MenuItem>
                        ))}

                      {/* If no matching role is selected, show a disabled message */}
                      {!roleList.some((role) => role.role === BillBookData.Role) && (
                        <MenuItem disabled>No Issue By Name Available</MenuItem>
                      )}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={1} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Select Ward No:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3}>
                  <Stack spacing={1}>
                    <Box
                      style={{
                        maxHeight: '130px',
                        overflowY: 'auto',
                        border: '2px solid #ccc',
                        color: '#1677ff'
                      }}
                    >
                      {/* "Select All" Checkbox */}
                      <Box className="form-check">
                        <label htmlFor="wardNoAll">
                          <Checkbox
                            id="wardNoAll"
                            checked={isAllSelected}
                            onChange={() => handleSelectedWardInZone('all')}
                            disabled={accessLevel < 3}
                          />
                          All
                        </label>
                      </Box>

                      {/* Individual ward selection checkboxes */}
                      {filteredWards.map((label, wardIndex) => (
                        <Box key={wardIndex} className="form-check">
                          <label htmlFor={`wardNo${wardIndex}`}>
                            <Checkbox
                              id={`wardNo${wardIndex}`}
                              checked={selectedWards.includes(wardIndex)}
                              onChange={() => handleSelectedWardInZone(wardIndex)}
                              disabled={accessLevel < 3}
                            />
                            {label}
                          </label>
                        </Box>
                      ))}
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {/* Left Side Fields */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={0} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Bill Book No:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3}>
                  <Stack spacing={1}>
                    <TextField
                      placeholder="Bill Book No"
                      name="BillBookNo"
                      label="Bill Book No."
                      value={BillBookData.BillBookNo}
                      onChange={handleInputChange}
                      error={!!errors.BillBookNo}
                      helperText={errors.BillBookNo}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                </Grid>
              </Grid>
              {/* 2nd field */}
              <Grid container spacing={0} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Date:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3}>
                  <Stack spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <DatePicker
                          label="Date"
                          value={startDate}
                          disabled={accessLevel < 3}
                          onChange={(newValue) => {
                            setStartDate(newValue);
                            setBillBookData((prevData) => ({
                              ...prevData,
                              date: format(newValue, 'yyyy-MM-dd')
                            }));
                          }}
                          renderInput={(params) => <TextField {...params} error={!!errors.date} helperText={errors.date} />}
                        />{' '}
                      </Stack>
                    </LocalizationProvider>
                  </Stack>
                </Grid>
              </Grid>
              {/* 3rd field */}
              <Grid container spacing={2} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Finance Year:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={2.9}>
                  <Stack spacing={1}>
                    <Select
                      value={BillBookData.Year || ''}
                      onChange={handleInputChange}
                      name="Year"
                      error={!!errors.Year} // Shows red border if there's an error
                      helperText={errors.Year}
                      disabled={accessLevel < 3}
                    >
                      <MenuItem value={0} disabled>
                        Select
                      </MenuItem>
                      {yearTrans.map((financeYear) => (
                        <MenuItem value={financeYear.FinanceYear}>{financeYear.FinanceYear}</MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={1.5}>
                  <Stack sx={{ mt: 1.5 }}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Status</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={2.9}>
                  <Stack spacing={1}>
                    <Select
                      value={BillBookData.status}
                      error={!!errors.status} 
                      helperText={errors.status}
                      onChange={handleStatusChange}
                      placeholder="status"
                      disabled={accessLevel < 3}
                    >
                     <MenuItem value={true}>Active</MenuItem>
  <MenuItem value={false}>Deactive</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Side Fields */}
            <Grid item xs={12} sm={6}>
              <Grid container spacing={1} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Receipt No:</InputLabel>
                  </Stack>
                </Grid>

                <Grid item xs={6} sm={3.7}>
                  <Stack spacing={1}>
                    <TextField
                      placeholder="From"
                      name="fromReceipt"
                      label="From Receipt"
                      type="number"
                      value={BillBookData.fromReceipt}
                      onChange={handleInputChange}
                      error={!!errors.fromReceipt}
                      helperText={errors.fromReceipt}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={6} sm={3.7}>
                  <Stack spacing={1}>
                    <TextField
                      placeholder="To"
                      name="toReceipt"
                      label="To Receipt"
                      value={BillBookData.toReceipt}
                      type="number"
                      onChange={handleInputChange}
                      error={!!errors.toReceipt}
                      helperText={errors.toReceipt}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={1} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Remark:</InputLabel>
                  </Stack>
                </Grid>{' '}
                <Grid item xs={6} sm={7.3}>
                  <Stack spacing={1}>
                    <TextField
                      placeholder="Remark"
                      name="remark"
                      label="Remark"
                      value={BillBookData.remark}
                      onChange={handleInputChange}
                      error={!!errors.remark}
                      helperText={errors.remark}
                      disabled={accessLevel < 3}
                    />{' '}
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={1} mb={1}>
                <Grid item xs={6} sm={3}>
                  <Stack sx={{ mt: 1.5 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Bill Book Type</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3} spacing={2}>
                  <Stack spacing={1}>
                    <Select
                      value={BillBookData.BillBookType}
                      onChange={handleBillTypeChange}
                      placeholder="Bill Book Type"
                      error={!!errors.BillBookType} // Shows red border if there's an error
                      helperText={errors.BillBookType}
                      disabled={accessLevel < 3}
                    >
                      <MenuItem value="Counter">Counter</MenuItem>
                      <MenuItem value="Manual">Manual</MenuItem>
                    </Select>{' '}
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Buttons */}
          <Grid container spacing={2} marginTop={2} justifyContent="center">
            <Grid item xs={12} sm={2}>
              <Button variant="contained" color="success" fullWidth onClick={handleSave} disabled={accessLevel < 3}>
                Save
              </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" color="secondary" fullWidth onClick={handleCancel} disabled={accessLevel < 3}>
                Cancel
              </Button>
            </Grid>
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
          </Grid>
          {/* Table */}
          <Box marginTop={2}>
            <div style={{ height: 330, width: '100%' }}>
              <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} disableSelectionOnClick />
            </div>
          </Box>
        </MainCard>
      )}
    </>
  );
}

export default BillBookEntry;
