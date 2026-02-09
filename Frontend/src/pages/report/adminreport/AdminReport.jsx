// material-ui
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Box,
  Button,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  AlertTitle,
  Snackbar,
  SnackbarContent
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as XLSX from 'xlsx';
import { getUserNames } from 'services/utlilityService/wardAllocations/wardAllocationService';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getAdminReportData, getUserLoginHistory } from 'services/report/admin-report-service/adminReportService';
import dayjs from 'dayjs';
// ==============================|| ADMIN PAGE ||============================== //

function AdminReport() {
  const [selectedOption, setSelectedOption] = useState('');
  const [showSearch, setShowSearch] = useState('');
  const [srchVal, setsrchVal] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [user, setUser] = useState('');
  const [userList, setUserList] = useState([]);
  const [isPrime, setIsPrime] = useState([false, false]);
  const [password, setPassword] = useState('');
  const [reportList, setReportList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const [state, setState] = useState({
    snackbarOpen: false,
    snackbarSeverity: 'success',
    receivedMessage: '',
    errors: {}
  });

  const updateState = (updates) => {
    setState((prevState) => ({
      ...prevState,
      ...updates
    }));
  };
  const handleCloseSnackbar = () => {
    updateState({ snackbarOpen: false });
  };
  const handleFromDate = (e) => {
    const fromDate = e.target.value;
    console.log(fromDate, 'fromdate');
    setFromDate(e);
  };

  const handleToDate = (e) => {
    setToDate(e);
  };
  //model
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState('');
  const [selectedScreenFilter, setSelectedScreenFilter] = useState('');

  const screenNameList = [
    'PropertyMast',
    'JoinOwnerDetails',
    'PropertySocialDetails',
    'OldPropertyMast',
    'ApplyTaxesMaster',
    'RetentionTax',
    'PropertyAppeal',
    'NewPropertyDetails',
    'OldTaxes',
    'TaxPendingDetails'
  ];
  const handleClickDialog = () => {
    if (!validateDates()) return;
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPassword('');
  };
  // const validateDates = () => {
  //   if (!fromDate || !toDate) {
  //     updateState({
  //       snackbarOpen: true,
  //       snackbarSeverity: 'error',
  //       receivedMessage: 'From Date & To Date both are required.'
  //     });
  //     return false;
  //   }

  //   const fDate = dayjs(fromDate).format('YYYY-MM-DD');
  //   const tDate = dayjs(toDate).format('YYYY-MM-DD');

  //   if (dayjs(tDate).isBefore(dayjs(fDate))) {
  //     updateState({
  //       snackbarOpen: true,
  //       snackbarSeverity: 'error',
  //       receivedMessage: 'To Date cannot be earlier than From Date.'
  //     });
  //     return false;
  //   }

  //   return true; // Valid
  // };
  const validateDates = () => {
    // Basic presence
    if (!fromDate || !toDate) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'From Date & To Date both are required.'
      });
      return false;
    }

    // Normalize to startOf('day') to avoid time-of-day issues
    const fDay = dayjs(fromDate).startOf('day');
    const tDay = dayjs(toDate).startOf('day');
    const today = dayjs().startOf('day');

    // To Date cannot be earlier than From Date
    if (tDay.isBefore(fDay)) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'To Date cannot be earlier than From Date.'
      });
      return false;
    }

    // To Date cannot be in the future (after today)
    if (tDay.isAfter(today)) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'To Date cannot be later than today.'
      });
      return false;
    }

    // Optional: Prevent From Date > today as well (usually desirable)
    if (fDay.isAfter(today)) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'From Date cannot be later than today.'
      });
      return false;
    }

    return true;
  };

  const handleShowReport = async () => {
    setOpenDialog(false);

    if (!password) return;

    const levelname = 'L1';

    try {
      // Check password
      const passwordCheckResponse = await levelPassword(levelname, password);
      if (passwordCheckResponse.status !== 200) {
        updateState({
          snackbarOpen: true,
          snackbarSeverity: 'error',
          receivedMessage: 'Invalid Password'
        });
        return;
      }

      // ✅ Case 1: Data Entry History
      if (selectedOption === 'Data Entry History') {
        const requestParam = {
          dataFor: selectedOption,
          userId: user,
          fromDate: dayjs(fromDate).format('YYYY-MM-DD'),
          toDate: dayjs(toDate).format('YYYY-MM-DD')
        };

        if (requestParam.fromDate && requestParam.toDate && requestParam.toDate >= requestParam.fromDate) {
          const reportInfo = await getAdminReportData(requestParam);
          const resp = reportInfo.Response;

          console.log('All keys from API:', Object.keys(resp[0]));
          console.log('Sample row:', resp[0]);
          setReportList(resp);
          setFilteredList(resp);

          updateState({
            snackbarOpen: true,
            snackbarSeverity: 'success',
            receivedMessage: 'Records fetched successfully.'
          });
        } else {
          updateState({
            snackbarOpen: true,
            snackbarSeverity: 'error',
            receivedMessage: 'From Date & To Date both are required and To Date must not be less than From Date.'
          });
        }
      }

      // ✅ Case 2: User Login - Logout
      else if (selectedOption === 'User Login-Logout') {
        const loginRequest = {
          UserID: user,
          StartDate: dayjs(fromDate).format('YYYY-MM-DD'),
          EndDate: dayjs(toDate).format('YYYY-MM-DD')
        };

        const resp = await getUserLoginHistory(loginRequest);

        console.log(resp, 'login-logout response');

        setFilteredList(
          (resp.sessions || [])
            .filter((row) => row.LogOutTime !== '-')
            .map((row) => ({
              UserName: resp.summary.Name,
              LoginDateTime: row.LoginDateTime,
              LogoutDateTime: row.LogOutTime,
              TotalTimeSpent: row.SessionDuration
            }))
        );
        updateState({
          snackbarOpen: true,
          snackbarSeverity: 'success',
          receivedMessage: 'Login-Logout Records fetched successfully.'
        });

        setPassword('');
        return;
      }

      setPassword('');
    } catch (error) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'An error occurred: ' + error
      });
      setPassword('');
    }
  };

  const handleDataEntryChange = (event) => {
    setSelectedOption(event.target.value);
    setReportList([]);
    setFilteredList([]);
  };

  const columns = reportList.length > 0 ? Object.keys(reportList[0]) : [];

  const formattedFilteredList = filteredList.map((row) => columns.map((col) => row[col]));
  // Handle radio button change
  // const handleSearchChange = (e) => {
  //   setShowSearch(e.target.value);
  //   setsrchVal('');
  //   setFilteredList(reportList);
  // };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setShowSearch(searchText);

    // reset filters
    setsrchVal('');
    setSelectedUserFilter('');
    setSelectedScreenFilter('');
    setFilteredList(reportList);
  };
  // Map display labels to actual field keys
  const searchKeyMap = {
    'Ward No.': 'WardNo',
    'Property No.': 'PropertyNo',
    'Owner Name': 'OwnerName',
    'User Name': 'UserName',
    'Screen Name': 'ScreenName',
    'Owner Name Marathi': 'मालकाचे नाव'
  };

  // Handle search input
  // const handleSearchVal = (e) => {
  //   const value = e.target.value;
  //   setsrchVal(value);

  //   if (showSearch && value.trim() !== '') {
  //     const key = searchKeyMap[showSearch]; // 🔑 Get actual key
  //     if (!key) {
  //       setFilteredList(reportList);
  //       return;
  //     }

  //     const filteredData = reportList.filter((row) =>
  //       String(row[key] || '')
  //         .toLowerCase()
  //         .includes(value.toLowerCase())
  //     );

  //     setFilteredList(filteredData);
  //   } else {
  //     setFilteredList(reportList);
  //   }
  // };
  const handleSearchVal = (e) => {
    const value = e.target.value;
    setsrchVal(value);
    if (showSearch === 'Owner Name Marathi') {
      const value = e.target.value;
      setsrchVal(value);

      const filtered = reportList.filter((row) =>
        String(row['मालकाचे नाव'] || '')
          .toLowerCase()
          .includes(value.toLowerCase())
      );

      setFilteredList(filtered);
      return;
    }

    if (showSearch && value.trim() !== '') {
      const key = searchKeyMap[showSearch];

      if (!key) {
        setFilteredList(reportList);
        return;
      }

      const filteredData = reportList.filter((row) => {
        let rowValue = String(row[key] || '');
        let inputValue = value;

        // Avoid lowercasing Marathi text
        if (key !== 'OwnerNameMarathi') {
          rowValue = rowValue.toLowerCase();
          inputValue = inputValue.toLowerCase();
        }

        return rowValue.includes(inputValue);
      });

      setFilteredList(filteredData);
    } else {
      setFilteredList(reportList);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await getUserNames();
      console.log(response, 'user names response');
      if (response && response.data) {
        setUserList(response.data);
        // setUser('');
      }
    };
    getUser();
  }, []);

  const titleRow = Array(columns.length).fill('');
  const titleIndex = Math.floor(columns.length / 2);
  titleRow[titleIndex] = 'AdminReport'.trim();
  //exoprt
  const handleExportButtonClick = () => {
    if (formattedFilteredList.length > 0) {
      const data1 = [
        titleRow, // Title row
        columns, // Header row
        ...formattedFilteredList // Data rows
      ];

      const ws1 = XLSX.utils.aoa_to_sheet(data1);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws1, 'AdminReport');

      XLSX.writeFile(wb, 'AdminReport.xlsx');
    } else {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'No records found for exporting'
      });
    }
  };

  //to show on click of Data entry option
  const DataEntryHistory = () => {
    return (
      <MainCard>
        <Grid container spacing={2}>
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

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={1}>
              <Button variant="contained" color="info" onClick={handleClickDialog}>
                Show
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    );
  };

  const [searchValue, setSearchValue] = useState('');

  const [hideSearch, setHideSearch] = useState(false);

  const filterTableByUser = (name) => {
    if (!name) {
      setFilteredList(reportList);
      return;
    }
    setFilteredList(reportList.filter((row) => String(row.UserName || '').toLowerCase() === name.toLowerCase()));
  };

  const filterTableByScreen = (screen) => {
    if (!screen) {
      setFilteredList(reportList);
      return;
    }
    setFilteredList(reportList.filter((row) => String(row.ScreenName || '').toLowerCase() === screen.toLowerCase()));
  };

  //to show on click of login-logout user option
  const UserDataEntryHistory = () => {
    return (
      <MainCard>
        <Grid container spacing={1} direction="row">
          <Grid item xs={12} sm={2.5}>
            <Stack spacing={1}>
              <InputLabel>Select User</InputLabel>
              <Select id="user-select" value={user} onChange={(e) => setUser(e.target.value)}>
                <MenuItem value="">Select Option</MenuItem>
                {userList &&
                  userList.length > 0 &&
                  userList.map((user) => (
                    <MenuItem key={user.UserID} value={user.UserID}>
                      {user.name}
                    </MenuItem>
                  ))}
              </Select>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4.7}>
            <Stack spacing={1}>
              <InputLabel>From Date</InputLabel>
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker value={fromDate} onChange={(newValue) => setFromDate(newValue)} />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={4.7}>
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
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Stack spacing={1}>
            <Button variant="contained" color="info" onClick={handleClickDialog}>
              Show
            </Button>
          </Stack>
        </Grid>
      </MainCard>
    );
  };

  return (
    <MainCard title="Admin Reports">
      <Grid container spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <MainCard>
              <Grid item xs={12} sm={12}>
                <Stack>
                  <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>
                    {' '}
                    Choose Report
                  </Typography>
                </Stack>
                <FormControl>
                  <RadioGroup row id="user" value={selectedOption} onChange={handleDataEntryChange}>
                    <Box>
                      <FormControlLabel value={'Data Entry History'} control={<Radio />} label="Data Entry History" />
                    </Box>
                    <Box>
                      <FormControlLabel value={'User Login-Logout'} control={<Radio />} label="User Login-Logout" />
                    </Box>
                  </RadioGroup>
                </FormControl>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={7}>
            {selectedOption === 'Data Entry History' && <DataEntryHistory />}
            {selectedOption === 'User Login-Logout' && <UserDataEntryHistory />}
          </Grid>
        </Grid>
        {selectedOption === 'Data Entry History' && (
          <Grid container spacing={1}>
            <Grid item xs={12} sm={7}>
              <MainCard>
                <Grid item xs={12} sm={12}>
                  <Stack>
                    <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>
                      {' '}
                      Search On
                    </Typography>
                  </Stack>
                  <Stack direction={'row'}>
                    <FormControl>
                      <RadioGroup row id="search" value={showSearch} onChange={handleSearchChange}>
                        <FormControlLabel value="Ward No." control={<Radio />} label="Ward No." />
                        <FormControlLabel value="Property No." control={<Radio />} label="Property No." />
                        <FormControlLabel value="Owner Name" control={<Radio />} label="Owner Name" />
                        <FormControlLabel value="Owner Name Marathi" control={<Radio />} label="Owner Name Marathi" />
                        <FormControlLabel value="User Name" control={<Radio />} label="User Name" />
                        <FormControlLabel value="Screen Name" control={<Radio />} label="Screen Name" />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                </Grid>
              </MainCard>
            </Grid>

            <Grid item xs={12} sm={5}>
              <MainCard>
                <Grid item xs={12} sm={8}>
                  {/* <Stack spacing={1}>
                    <InputLabel>Enter Search Text</InputLabel>
                    <TextField required placeholder=" Enter Search " value={srchVal} onChange={handleSearchVal} disabled={!showSearch} />
                  </Stack> */}
                  <Stack spacing={1}>
                    <InputLabel>Enter Search Text</InputLabel>
                    {/* <TextField
                      placeholder=" Enter Search "
                      value={srchVal}
                      onChange={handleSearchVal}
                      disabled={!showSearch || showSearch === 'User Name' || showSearch === 'Screen Name'}
                    /> */}
                    {showSearch !== 'User Name' && showSearch !== 'Screen Name' && (
                      <TextField placeholder=" Enter Search " value={srchVal} onChange={handleSearchVal} disabled={!showSearch} />
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={8} sx={{ mt: '10px' }}>
                  {/* USER NAME DROPDOWN */}
                  {showSearch === 'User Name' && (
                    <Select
                      value={selectedUserFilter}
                      onChange={(e) => {
                        setSelectedUserFilter(e.target.value);
                        filterTableByUser(e.target.value);
                      }}
                      fullWidth
                    >
                      <MenuItem value="">All Users</MenuItem>
                      {userList.map((u) => (
                        <MenuItem key={u.UserID} value={u.name}>
                          {u.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Grid>
                <Grid item xs={12} sm={8} sx={{ mt: '10px' }}>
                  {/* SCREEN NAME DROPDOWN */}
                  {showSearch === 'Screen Name' && (
                    <Select
                      value={selectedScreenFilter}
                      onChange={(e) => {
                        setSelectedScreenFilter(e.target.value);
                        filterTableByScreen(e.target.value);
                      }}
                      fullWidth
                    >
                      <MenuItem value="">All Screens</MenuItem>
                      {screenNameList.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
        )}
        <Box marginTop={2} sx={{ textAlign: 'center' }}>
          <div style={{ width: '100%', borderBottom: '1px solid gray', margin: '10px auto' }} />
        </Box>
        <Grid item xs={12}>
          <MainCard>
            <Box width="100%" height="250px" overflow="auto">
              <TableContainer>
                {selectedOption === 'Data Entry History' && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columns.map((col, index) => (
                          <TableCell key={index}>{col}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredList.length > 0 ? (
                        filteredList.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {columns.map((col, colIndex) => (
                              <TableCell key={colIndex}>{row[col]}</TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} align="center">
                            No results found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}

                {selectedOption === 'User Login-Logout' && (
                  <MainCard>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>User Name</TableCell>
                            <TableCell>Login Date-Time</TableCell>
                            <TableCell>Logout Date-Time</TableCell>
                            <TableCell>Total Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredList.length > 0 ? (
                            filteredList.map(
                              (row, idx) => (
                                console.log(row, 'rowdata'),
                                (
                                  <TableRow key={idx}>
                                    <TableCell>{row.UserName}</TableCell>
                                    <TableCell>{row.LoginDateTime}</TableCell>
                                    <TableCell>{row.LogoutDateTime}</TableCell>
                                    <TableCell>{row.TotalTimeSpent}</TableCell>
                                  </TableRow>
                                )
                              )
                            )
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                No Data
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </MainCard>
                )}
              </TableContainer>
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Stack spacing={1}>
            <Button variant="contained" color="info" onClick={handleExportButtonClick}>
              Export
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
              <DialogTitle id="alert-dialog-title" color="error" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Admin Report
              </DialogTitle>

              <DialogContent>
                <Stack marginBottom={2}>
                  <DialogContentText id="alert-dialog-description">Enter L1 Password</DialogContentText>
                </Stack>
                <TextField
                  label="Enter Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="success" onClick={handleShowReport} autoFocus>
                  Ok
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={state.snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: state.snackbarSeverity === 'success' ? 'green' : 'red'
          }}
          message={state.receivedMessage}
        />
      </Snackbar>
    </MainCard>
  );
}

export default AdminReport;
