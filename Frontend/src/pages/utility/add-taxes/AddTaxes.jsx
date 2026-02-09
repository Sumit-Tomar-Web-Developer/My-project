import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Tab,
  Tabs,
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
// import { handlerActiveItem, useGetMenuMaster } from 'api/menu';
// import { ContainerOutlined, FileTextOutlined } from '@ant-design/icons';
//model
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
import {
  fetchFinanceYearProperty,
  saveAddTaxButton,
  //fetchAdvance,
  saveAddTaxButtonFromTo,
  RemoveTax,
  //fetchAdvanceFromTo,
  getMiscellaneouseFromTo,
  updateAdvanceFromTo,
  updateAdvance,
  getFinanceYear
} from 'services/utlilityService/AddTaxService/AddTaxService';

// assets
import worldMap from 'assets/images/addTaxes/interest.png';

// material-ui
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { BookOutlined } from '@ant-design/icons';

// ==============================|| TAB PANEL ||============================== //

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

// material-ui   old coding
import { fetchWardList } from 'services/data-entry.services';
import { Grid, InputLabel, Stack, TextField } from '@mui/material';
import PaymentAdvance from '../PaymentAdvance/PaymentAdvance';
import { fetchFinancialYear } from 'services/appeal.services';
import { getPropertyRangeFromAndTo } from 'services/utlilityService/updatePropertyDetailsService/updatePropertyDetailsService';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { Dropdown } from '@mui/base';

import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

import { es } from 'date-fns/locale';
import { useSelector } from 'react-redux';

// import { noConflict } from 'lodash';

// ==============================|| SAMPLE PAGE ||============================== //

function AddTaxes() {
  //model
  const [wardList, setWardList] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [levelname, setLevelName] = useState('');
  const [password, setLevelPassword] = useState('');

  const [financeYearPropertyList, setFinancialYearPropertyList] = useState([]);
  const [financialYear, setFinancialYear] = useState('');

  const [paymentAdvance, setPaymentAdvance] = useState(true);

  const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const [propertyNoListFrom, setpropertyNoListFrom] = useState([]);
  const [selectedPropertyNoTo, setSelectedPropertyNoTo] = useState('');
  const [showError, setShowError] = useState(false);

  const [propertyList, setPropertyList] = useState([]);
  const [error, setError] = useState(false);
  const [withInterest, setWithInterest] = useState(false);

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Add Taxes';
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

  const [message, setMessage] = useState('');
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [alertColor, setAlertColor] = useState('success');
  const [successTrigger, setSuccessTrigger] = useState(false);
  const [failedOwnerIds, setFailedOwnerIds] = useState([]);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    if (permissionAccess?.AccessID) {
      const access = permissionAccess.AccessID;
      console.log(access, 'assigned access to Add Taxes Page');
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

  useEffect(() => {
    const fetchWardNoList = async () => {
      try {
        const wardList = await fetchWardList();
        console.log('wardList', wardList);

        const wardNumbers = wardList
          .map((item) => Number(item.NewWardNo))
          .filter((num) => !isNaN(num)) // optional: filter out non-numbers
          .sort((a, b) => a - b);

        setWardList(wardNumbers);
      } catch (error) {
        console.error('Error in fetching ward list:', error);
      }
    };

    fetchWardNoList();
  }, []);


  useEffect(() => {
    setWithInterest(false);
    console.log(selectedWard);
  }, [selectedWard]);

  const handleClickDialog = (type) => {
    console.log(financialYear);
    if (financialYear.length < 4) {
      setMessage('Please enter a valid financial year');
      setAlertColor('error');
      setSnackbarOpen(true);
      return;
    } else {
      if (selectedTab === 1) {
        if (selectedPropertyNoFrom === '' || selectedPropertyNoTo === '') {
          setMessage('Please enter a valid range for properties');
          setAlertColor('error');
          setSnackbarOpen(true);
        } else {
          if (!showError) {
            setActionType(type);
            setOpenDialog(true);
            return;
          }
        }
      } else {
        if (setSelectedWard.length <= 0) {
          setMessage('Please Select a  Ward');
          setAlertColor('error');
          setSnackbarOpen(true);
        } else {
          setActionType(type);
          setOpenDialog(true);
          return;
        }
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setLevelPassword('');
  };

  const handleAction = async () => {
    console.log(selectWards);
    {
      try {
        console.log(password, 'password');
        const IsPasswordValid = await levelPassword(levelname, password);
        if (IsPasswordValid.response.status === 200) {
          handleCloseDialog();
          setLevelPassword('');
          if (actionType === 'addTax') {
            console.log('addTax');
            const result = await saveAddTaxButton(selectWards, financialYear, withInterest);
            if (result.response.status === 200) {
              setMessage('Tax added successfully');
              setAlertColor('success');
              setSnackbarOpen(true);
              setSuccessTrigger((prev) => !prev);
              setSelectWards([]);
              setFinancialYear('');
              setWithInterest(false);
              if (result.response.data.failedOwnerIds) {
                setFailedOwnerIds(result.response.data.failedOwnerIds);
                console.log('Failed Owner IDs:', failedOwnerIds);
                setShowGrid(true);
              }
            } else {
              setMessage('Failed to add tax');
              setAlertColor('error');
              setSnackbarOpen(true);
            }

            console.log(result.response);
          } else if (actionType === 'removeTax') {
            console.log('removeTax');
            const result = await RemoveTax(financialYear);
            if (result.status === 200) {
              console.log('Tax removed successfully');
              setMessage('Tax removed successfully');
              setAlertColor('success');
              setSnackbarOpen(true);
              setSelectWards([]);
              setSelectedWard('');
              setSelectedPropertyNoFrom('');
              setSelectedPropertyNoTo('');
              setFinancialYear('');
              setWithInterest(false);
              setSuccessTrigger((prev) => !prev);
            } else {
              setMessage('Failed to Remove  tax');
              setAlertColor('error');
              setSnackbarOpen(true);
            }
          } else if (actionType === 'advanceDeduction') {
            console.log('advanceDeduction');
            console.log(selectWards, 'selectedWard');
            const result = await updateAdvance(selectWards, financialYear);
            console.log(result, 'result');
            if (result.response.status === 200) {
              setMessage('Advance deduction applied successfully');
              setAlertColor('success');
              setSnackbarOpen(true);
              setSuccessTrigger((prev) => !prev);
              setSelectWards([]);
              setFinancialYear('');
              setWithInterest(false);
            } else {
              setMessage('Failed to apply advance deduction');
              setAlertColor('error');
              setSnackbarOpen(true);
            }
          } else if (actionType === 'addTaxFromProperty') {
            console.log('addTaxFromProperty');
            const result = await saveAddTaxButtonFromTo(
              selectedWard,
              financialYear,
              selectedPropertyNoFrom,
              selectedPropertyNoTo,
              withInterest
            );
            if (result.response.status === 200) {
              setMessage('Tax added successfully');
              setAlertColor('success');
              setSnackbarOpen(true);
              setSuccessTrigger((prev) => !prev);
              setSelectedWard('');
              setSelectedPropertyNoFrom('');
              setSelectedPropertyNoTo('');
              setFinancialYear('');
              setWithInterest(false);
              if (result.response.data.failedOwnerIds) {
                setFailedOwnerIds(result.response.data.failedOwnerIds);
                console.log('Failed Owner IDs:', failedOwnerIds);
                setShowGrid(true);
              }
            } else {
              setMessage('Failed to add tax');
              setAlertColor('error');
              setSnackbarOpen(true);
            }
            console.log(result.response);
          } else if (actionType === 'advanceDeductionFromProperty') {
            console.log('advanceDeduction');
            const result = await updateAdvanceFromTo(selectedWard, financialYear, selectedPropertyNoFrom, selectedPropertyNoTo);
            if (result.response.status === 200) {
              setMessage('Advance deduction applied successfully');
              setAlertColor('success');
              setSnackbarOpen(true);
              setSuccessTrigger((prev) => !prev);
              setSelectedWard('');
              setSelectedPropertyNoFrom('');
              setSelectedPropertyNoTo('');
              setFinancialYear('');
              setWithInterest(false);
            } else {
              setMessage('Failed to apply advance deduction');
              setAlertColor('error');
              setSnackbarOpen(true);
            }
          }
        } else {
          console.log('Wrong Password');
        }
      } catch { }
    }
  };
  useEffect(() => {
    const fetchFinanceYearPropertyDetails = async () => {
      const result = await fetchFinanceYearProperty();
      setFinancialYearPropertyList(result);
    };
    fetchFinanceYearPropertyDetails();
  }, [successTrigger]);

  //taxmodel

  const [selectWards, setSelectWards] = useState([]);

  const handleSelectWard = (wardNo) => {
    setSelectWards((prevSelected) => {
      // If the user clicked "Select All", toggle between select all and none
      if (wardNo === 'All') {
        return prevSelected.length === wardList.length ? [] : wardList;
      }

      // If a single ward is selected/deselected
      if (prevSelected.includes(wardNo)) {
        return prevSelected.filter((selectedWard) => selectedWard !== wardNo); // Deselect the ward
      } else {
        return [...prevSelected, wardNo]; // Select the ward
      }
    });
  };

  useEffect(() => {
    console.log(withInterest, 'wihtInterest');
  }, [withInterest]);

  useEffect(() => {
    setWithInterest(false);
    console.log(selectWards);
  }, [selectWards]);
  //navigate

  const handleButtonClick = async () => {
    console.log(selectWards);
    setPaymentAdvance(!paymentAdvance);
    console.log(selectWards);
  };


  let selectedTab = 0;

  const [value, setValue] = useState(selectedTab);
  // console.log(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Backend

  //taxfinace  2nd tab

  // useEffect(() => {

  //   fetchFinancialYear()
  //     .then((yearList) => {
  //       setFinancialYearList(yearList);
  //       setYearList(yearList);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching financial years:', err);
  //     });

  //   fetchWardList()
  //     .then((finList) => {
  //       // Sort the ward list in ascending order (assuming the field to sort by is "wardNo")
  //       const sortedWardList = finList.sort((a, b) => a.NewWardNo - b.NewWardNo); // If sorting by ward number
  //       setwardList(sortedWardList);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching Ward list:', error);
  //     });
  // }, []);
  //first tab

  //first tab

  //2nd Tab
  //ward

  //ward tab2
  // const handleWardChanges = async (event) => {
  //   const ward = event.target.value;
  //   setSelectedWard(ward);

  //   try {
  //     const propertyRange = await fetchPropertyRangeByWard(ward);
  //     console.log('propertyRange:', propertyRange);
  //     setpropertyNoListTo(propertyRange.properties);
  //     setpropertyNoListFrom(propertyRange.properties);
  //   } catch (error) {
  //     console.error('Failed to fetch propertyRange:', error);
  //   }
  // };
  //proeprty tab2
  useEffect(() => {
    if (selectedPropertyNoTo !== '' && selectedPropertyNoFrom !== '') {
      const [ToBase, ToPartRaw] = selectedPropertyNoTo.split('-');
      const [fromBase, fromPartRaw] = selectedPropertyNoFrom.split('-');

      const ToPart = ToPartRaw || '0';
      const fromPart = fromPartRaw || '0';

      if (Number(ToBase) < Number(fromBase)) {
        setShowError(true);
      } else if (Number(ToBase) === Number(fromBase)) {
        const isToPartNumeric = !isNaN(ToPart);
        const isFromPartNumeric = !isNaN(fromPart);

        if (isToPartNumeric && isFromPartNumeric) {
          setShowError(Number(ToPart) < Number(fromPart));
        } else {
          // Fallback to string comparison
          setShowError(ToPart < fromPart);
        }
      } else {
        setShowError(false);
      }
    }
  }, [selectedPropertyNoFrom, selectedPropertyNoTo]);
  const [financeYearList, setFinanceYearList] = useState([])
  useEffect(() => {
    const financeYear = async () => {
      const result = await getFinanceYear()

      console.log(result, 'financeYearList')
      setFinanceYearList(result)
    }
    financeYear()
  }, [])
  useEffect(() => {
    console.log(financeYearList, 'yearList')
  }, [financeYearList])

  const handlePropertyChangeFrom = (e) => {
    const selectedValue = e.target.value;
    console.log(selectedValue);
    setSelectedPropertyNoFrom(selectedValue);
    console.log(selectedPropertyNoFrom);
  };

  const handlePropertyChangeTo = (e) => {
    const selectedValue = e.target.value;
    setSelectedPropertyNoTo(selectedValue);
    console.log(selectedPropertyNoTo);
  };

  useEffect(() => {
    if (!showError) {
      if (snackbaropen) {
        const timer = setTimeout(() => {
          setSnackbarOpen(false);
        }, 3000); // Close snackbar after 3 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount or when snackbaropen changes
      }
    }
  }, [snackbaropen]);

  const handleWardChanges = async (event) => {
    const ward = event.target.value;
    setSelectedWard(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      const propertyList = propertyRange.properties;
      const propertyMap = new Map();


      propertyList.forEach((p) => {
        const baseNo = p.NewPropertyNo;
        const partition = p.NewPartitionNo;


        if (!propertyMap.has(baseNo)) {
          propertyMap.set(baseNo, []);
        }

        if (partition) {
          propertyMap.get(baseNo).push(partition);
        } else {
          propertyMap.get(baseNo); // Ensure baseNo is recorded even without partition
        }
      });

      const sortedList = [];

      Array.from(propertyMap.entries())
        .sort((a, b) => Number(a[0]) - Number(b[0])) // Sort base property numbers numerically
        .forEach(([baseNo, partitions]) => {
          sortedList.push(baseNo); // Add base number first

          partitions
            .sort((p1, p2) => {
              const n1 = isNaN(p1) ? p1 : Number(p1);
              const n2 = isNaN(p2) ? p2 : Number(p2);
              return typeof n1 === 'number' && typeof n2 === 'number' ? n1 - n2 : String(n1).localeCompare(String(n2));
            })
            .forEach((part) => {
              sortedList.push(`${baseNo}-${part}`);
            });
        });

      console.log(sortedList, 'Final Sorted Properties');
      setpropertyNoListFrom(sortedList);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };

  // useEffect(() => {
  //   if (selectedPropertyNoFrom < selectedPropertyNoTo) {
  //     setShowError(!showError)
  //     return
  //   }

  // }, [selectedPropertyNoFrom, selectedPropertyNoTo])

  const handleShowButton = async () => {
    console.log(selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);
    const result = await getMiscellaneouseFromTo(selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);

    const originalList = result.response;

    // Sort the property objects directly
    const sorted = originalList.sort((a, b) => {
      const propA = Number(a.NewPropertyNo);
      const propB = Number(b.NewPropertyNo);
      if (propA !== propB) return propA - propB;

      const partA = isNaN(a.NewPartitionNo) ? a.NewPartitionNo : Number(a.NewPartitionNo);
      const partB = isNaN(b.NewPartitionNo) ? b.NewPartitionNo : Number(b.NewPartitionNo);

      if (typeof partA === 'number' && typeof partB === 'number') return partA - partB;
      return String(partA).localeCompare(String(partB));
    });

    console.log(sorted, 'Final Sorted Property Objects');
    setPropertyList(sorted); // <- Keep original object shape for the table
  };

  useEffect(() => {
    setSelectedPropertyNoFrom('');
    setSelectedPropertyNoTo('');
  }, [selectedWard]);

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
      ) : paymentAdvance ? (
        <MainCard>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="AddTaxes" icon={<BookOutlined />} iconPosition="start" {...a11yProps(0)} />
                <Tab label="AddTaxes From-To Properties" icon={<BookOutlined />} iconPosition="start" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <Snackbar
              open={snackbaropen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert
                onClose={() => setSnackbarOpen(false)}
                severity={alertColor}
                sx={{
                  width: '100%',
                  backgroundColor: alertColor === 'success' ? 'green' : 'red',
                  color: 'white',
                  fontWeight: 500,
                }}
              >
                {message}
              </Alert>
            </Snackbar>
            <Snackbar
              open={showGrid && failedOwnerIds.length > 0}
              autoHideDuration={null} // Keeps it open until closed manually
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              onClose={() => {
                setShowGrid(false);
                setFailedOwnerIds([]);
              }}
            >
              <Alert
                severity="error"
                variant="filled"
                onClose={() => {
                  setShowGrid(false);
                  setFailedOwnerIds([]);
                }}
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  backgroundColor: '#ffebee',
                  color: '#b71c1c',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  🚫 Some OwnerIDs failed to process
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Please check the data for following OwnerIDs:
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                  {failedOwnerIds.map((item, index) => (
                    <li key={index}>
                      <Typography variant="body2">
                        <strong>{item.ownerId}</strong>
                      </Typography>
                    </li>
                  ))}
                </Box>
              </Alert>
            </Snackbar>

            <TabPanel value={value} index={0}>
              <Typography variant="h6">
                {/* title */}
                <MainCard title="Add Taxes" style={{ color: 'blue', fontWeight: 'bold' }}>
                  {/* <div className='subtitle' style={{ color: 'blue', fontWeight: 'bold', marginBottom: '9px' }}>Add Taxes:</div> */}

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={5} lg={4}>
                      {/* <MainCard> */}

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Stack spacing={1}>
                            <InputLabel id="finance-year-label">Financial Year</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                labelId="finance-year-label"
                                id="finance-year-select"
                                value={financialYear}
                                onChange={(e) => setFinancialYear(e.target.value)}
                                displayEmpty
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 150,

                                    }
                                  }
                                }}
                              >

                                {financeYearList.map((value, index) => (
                                  <MenuItem key={index} value={value}>{value.FinanceYear}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>

                        <Grid item xs={6} sm={6}>
                          <Stack spacing={1}>
                            <InputLabel id="ward-select-label">Ward</InputLabel>
                            <FormControl fullWidth>
                              <Select
                                multiple
                                value={selectWards}
                                renderValue={(selected) => selected.join(',')}
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
                                  <FormControlLabel
                                    label="Select All"
                                    control={<Checkbox checked={selectWards.length === wardList.length} />}
                                  />
                                </MenuItem>

                                {wardList.map((wardNo) => (
                                  <MenuItem key={wardNo} value={selectWards} onClick={() => handleSelectWard(wardNo)}>
                                    <FormControlLabel label={wardNo} control={<Checkbox checked={selectWards.includes(wardNo)} />} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Grid>
                      </Grid>
                      <Typography sx={{ mb: 2, mt: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                        Taxes Already Added For Below Years{' '}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12}>
                          <div className="card" style={{ marginTop: '6px' }}>
                            <Card>
                              <CardContent>
                                <Box sx={{ overflowX: 'auto', height: '250px' }}>
                                  {/* Table */}
                                  <Table>
                                    {/* Table Header */}
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Year</TableCell>
                                        <TableCell>Properties</TableCell>
                                      </TableRow>
                                    </TableHead>

                                    {/* Table Body */}
                                    <TableBody>
                                      {financeYearPropertyList.map((row) => (
                                        <TableRow key={row.FinanceYear}>
                                          <TableCell component="th" scope="row">
                                            {row.FinanceYear}
                                          </TableCell>
                                          <TableCell>{row.OwnerCount}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </CardContent>
                            </Card>
                          </div>
                        </Grid>
                      </Grid>

                      {/* </MainCard> */}
                    </Grid>

                    {/* //2nd button */}
                    <Grid item xs={12} md={6} lg={3} mt={6}>
                      <Box boxShadow={4}>
                        <MainCard>
                          <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={6} sm={7} mt={4}>
                              <Stack spacing={1}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      value={withInterest}
                                      onChange={() => setWithInterest((prev) => !prev)}
                                      disabled={accessLevel < 3}
                                    />
                                  }
                                  label="With Interest"
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={9} mt={1}>
                              <Stack spacing={1}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={(e) => {
                                    handleClickDialog('addTax');
                                    setLevelName('L2');
                                  }}
                                  disabled={accessLevel < 3}
                                >
                                  Add Tax
                                </Button>
                                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                                  <DialogTitle id="alert-dialog-title">{levelname}</DialogTitle>
                                  <DialogContent>
                                    <Stack marginBottom={2}>
                                      <DialogContentText id="alert-dialog-description">Enter Security Password</DialogContentText>
                                    </Stack>
                                    <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      type="password"
                                      value={password}
                                      onChange={(e) => setLevelPassword(e.target.value)}
                                      autoComplete="new-password"   // ⛔ prevent browser autofill
                                      inputProps={{
                                        autoSave: 'off',            // 🔒 disable auto-save
                                        form: {
                                          autoComplete: 'off',
                                        },
                                      }}
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <Button variant="contained" color="success" onClick={handleAction} autoFocus>
                                      Ok
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                                      Cancel
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={9}>
                              <Stack spacing={1}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => {
                                    handleClickDialog('removeTax'), setLevelName('L1');
                                  }}
                                  disabled={accessLevel < 3}
                                >
                                  Remove Add Tax
                                </Button>
                                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                                  <DialogTitle id="alert-dialog-title">{levelname}</DialogTitle>
                                  <DialogContent>
                                    <Stack marginBottom={2}>
                                      <DialogContentText id="alert-dialog-description">Enter Security Password</DialogContentText>
                                    </Stack>
                                    <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      type="password"
                                      disabled={accessLevel < 3}
                                      value={password}
                                      onChange={(e) => setLevelPassword(e.target.value)}
                                      autoComplete="new-password"   // ⛔ prevent browser autofill
                                      inputProps={{
                                        autoSave: 'off',            // 🔒 disable auto-save
                                        form: {
                                          autoComplete: 'off',
                                        },
                                      }}
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <Button variant="contained" color="success" onClick={handleAction} autoFocus>
                                      Ok
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                                      Cancel
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={9}>
                              <Stack spacing={1}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    handleClickDialog('advanceDeduction');
                                    setLevelName('L1');
                                  }}
                                  disabled={accessLevel < 3}
                                >
                                  Advance Deduction
                                </Button>
                                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                                  <DialogTitle id="alert-dialog-title">{levelname}</DialogTitle>
                                  <DialogContent>
                                    <Stack marginBottom={2}>
                                      <DialogContentText id="alert-dialog-description">Enter Security Password</DialogContentText>
                                    </Stack>
                                    <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      type="password"
                                      disabled={accessLevel < 3}
                                      value={password}
                                      onChange={(e) => setLevelPassword(e.target.value)}
                                      autoComplete="new-password"   // ⛔ prevent browser autofill
                                      inputProps={{
                                        autoSave: 'off',            // 🔒 disable auto-save
                                        form: {
                                          autoComplete: 'off',
                                        },
                                      }}
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <Button variant="contained" color="success" onClick={handleAction} autoFocus>
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
                        </MainCard>
                      </Box>
                    </Grid>

                    {/*  */}
                    <Grid item xs={12} md={5} lg={5} mt={4}>
                      <Grid mt={2}>
                        <Box
                          sx={{
                            width: { xs: 320, sm: 320, md: 500, lg: 600 },
                            opacity: accessLevel < 3 ? 0.5 : 1,
                            pointerEvents: accessLevel < 3 ? 'none' : 'auto',
                            cursor: accessLevel < 3 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <img
                            src={worldMap}
                            alt="world-map"
                            onClick={handleButtonClick}
                            style={{
                              width: '100%'
                            }}
                          //disabled={accessLevel < 3}
                          />
                          <Grid item xs={12} sm={12} disabled={accessLevel < 3}>
                            <Link onClick={handleButtonClick} style={{ fontSize: '100%', color: 'blue' }}>
                              {' '}
                              Check Properties For Advance Deduction For Selected Ward
                            </Link>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </MainCard>
              </Typography>
            </TabPanel>

            {/* //2nd page tab */}

            <TabPanel value={value} index={1}>
              <Typography variant="h6">
                {/* <MainCard title="Search Properties" style={{ color: 'blue', fontWeight: 'bold' }}> */}
                <MainCard>
                  <Box mb={2}>
                    <div className="subtitle" style={{ color: 'blue', fontWeight: 'bold', marginBottom: '4px' }}>
                      Search Properties:
                    </div>

                    <Grid
                      container
                      spacing={7}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <Grid item xs={12} sm={2.2}>
                        <Stack spacing={1}>
                          <InputLabel id="finance-year-label">Financial Year</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              labelId="finance-year-label"
                              id="finance-year-select"
                              value={financialYear}
                              onChange={(e) => setFinancialYear(e.target.value)}
                              displayEmpty
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                            >

                              {financeYearList.map((value, index) => (
                                <MenuItem key={index} value={value}>{value.FinanceYear}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2.2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">Ward</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="ward-select"
                              placeholder="ward no"
                              value={selectedWard}
                              onChange={handleWardChanges}
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
                              {wardList.map((wardNo, index) => (
                                <MenuItem key={index} value={wardNo}>
                                  {wardNo}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={2.2}>
                        <Stack spacing={1}>
                          <InputLabel id="property-no-from-label">From Property No</InputLabel>
                          <Select
                            labelId="property-no-from-label"
                            id="property-no-from-select"
                            placeholder="Select Property No"
                            value={selectedPropertyNoFrom}
                            onChange={handlePropertyChangeFrom}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                            fullWidth
                            disabled={accessLevel < 3}
                          >
                            {propertyNoListFrom?.length > 0 ? (
                              propertyNoListFrom.map((property, index) => (
                                <MenuItem key={index} value={property}>
                                  {property}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>No properties available</MenuItem>
                            )}
                          </Select>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={2.2}>
                        <Stack spacing={1}>
                          <InputLabel>To Property No</InputLabel>
                          <Select
                            id="ward-select"
                            placeholder="ward no"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                            disabled={accessLevel < 3}
                            value={selectedPropertyNoTo}
                            // error={!!error.selectedPropertyNoTo}
                            // helperText={error.selectedPropertyNoTo}
                            // FormHelperTextProps={{ style: { color: 'red' } }}
                            onChange={handlePropertyChangeTo}
                            error={showError}
                          >
                            {propertyNoListFrom.map((property, index) => (
                              <MenuItem key={index} value={property}>
                                {' '}
                                {/* Use the correct property name */}
                                {property}
                              </MenuItem>
                            ))}
                          </Select>
                          <Snackbar open={showError} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                            <Alert
                              severity="error"
                              s
                              sx={{
                                width: '100%',
                                backgroundColor: 'red',
                                color: 'white',
                                fontWeight: 500
                              }}
                            >
                              To Property cannot be less than From Property.
                            </Alert>
                          </Snackbar>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2.2} mt={4}>
                        <Stack spacing={1}>
                          <Button
                            onClick={handleShowButton}
                            variant="contained"
                            color="info"
                            disabled={showError && accessLevel < 3}

                          >
                            Show
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </MainCard>

                <Grid container spacing={2.5} mt={1}>
                  <Grid item xs={12} md={5} lg={4}>
                    {/* <MainCard> */}


                    <Typography variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                      Taxes Already Added For Below Years{' '}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12}>
                        <div className="card" style={{ marginTop: '6px' }}>
                          <Card>
                            <CardContent>
                              <Box sx={{ overflowX: 'auto', height: '250px' }}>
                                {/* Table */}
                                <Table>
                                  {/* Table Header */}
                                  <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                    <TableRow>
                                      <TableCell>Year</TableCell>
                                      <TableCell>Properties</TableCell>
                                    </TableRow>
                                  </TableHead>

                                  {/* Table Body */}
                                  <TableBody>
                                    {financeYearPropertyList.map((row) => (
                                      <TableRow key={row.FinanceYear}>
                                        <TableCell component="th" scope="row">
                                          {row.FinanceYear}
                                        </TableCell>
                                        <TableCell>{row.OwnerCount}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </CardContent>
                          </Card>
                        </div>
                      </Grid>
                    </Grid>

                    {/* </MainCard> */}
                  </Grid>

                  {/* //2nd button */}
                  <Grid item xs={12} md={6} lg={3} mt={4}>
                    <Box boxShadow={4}>
                      <MainCard>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                          <Grid item xs={6} sm={7} mt={2}>
                            <Stack spacing={1}>
                              <FormControlLabel control={<Checkbox />} disabled={accessLevel < 3} label="With Interest" />
                            </Stack>
                          </Grid>
                          <Grid item xs={6} sm={9} mt={1}>
                            <Stack spacing={1}>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  handleClickDialog('addTaxFromProperty');
                                  setLevelName('L2');
                                }}
                                disabled={accessLevel < 3}
                              >
                                Add Tax
                              </Button>
                              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                                <DialogTitle id="alert-dialog-title">{levelname}</DialogTitle>
                                <DialogContent>
                                  <Stack marginBottom={2}>
                                    <DialogContentText id="alert-dialog-description">Enter Security Password</DialogContentText>
                                  </Stack>
                                  <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      type="password"
                                      disabled={accessLevel < 3}
                                      value={password}
                                      onChange={(e) => setLevelPassword(e.target.value)}
                                      autoComplete="new-password"   // ⛔ prevent browser autofill
                                      inputProps={{
                                        autoSave: 'off',            // 🔒 disable auto-save
                                        form: {
                                          autoComplete: 'off',
                                        },
                                      }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                  <Button variant="contained" color="success" onClick={handleAction} autoFocus>
                                    Ok
                                  </Button>
                                  <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                                    Cancel
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Stack>
                          </Grid>
                          <Grid item xs={6} sm={9}>
                            <Stack spacing={1}>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  handleClickDialog('removeTax');
                                  setLevelName('L1');
                                }}
                                disabled={accessLevel < 3}
                              >
                                Remove Add Tax
                              </Button>
                              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                                <DialogTitle id="alert-dialog-title">{levelname}</DialogTitle>
                                <DialogContent>
                                  <Stack marginBottom={2}>
                                    <DialogContentText id="alert-dialog-description">Enter Security Password</DialogContentText>
                                  </Stack>
                                  <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      type="password"
                                      disabled={accessLevel < 3}
                                      value={password}
                                      onChange={(e) => setLevelPassword(e.target.value)}
                                      autoComplete="new-password"   // ⛔ prevent browser autofill
                                      inputProps={{
                                        autoSave: 'off',            // 🔒 disable auto-save
                                        form: {
                                          autoComplete: 'off',
                                        },
                                      }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                  <Button variant="contained" color="success" onClick={handleAction} autoFocus>
                                    Ok
                                  </Button>
                                  <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                                    Cancel
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Stack>
                          </Grid>
                          <Grid item xs={6} sm={9}>
                            <Stack spacing={1}>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  handleClickDialog('advanceDeductionFromProperty');
                                  setLevelName('L1');
                                }}
                                disabled={accessLevel < 3}
                              >
                                Advance Deduction
                              </Button>
                              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                                <DialogTitle id="alert-dialog-title">{levelname}</DialogTitle>
                                <DialogContent>
                                  <Stack marginBottom={2}>
                                    <DialogContentText id="alert-dialog-description">Enter Security Password</DialogContentText>
                                  </Stack>
                                  <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      type="password"
                                      disabled={accessLevel < 3}
                                      value={password}
                                      onChange={(e) => setLevelPassword(e.target.value)}
                                      autoComplete="new-password"   // ⛔ prevent browser autofill
                                      inputProps={{
                                        autoSave: 'off',            // 🔒 disable auto-save
                                        form: {
                                          autoComplete: 'off',
                                        },
                                      }}
                                    />
                                </DialogContent>
                                <DialogActions>
                                  <Button variant="contained" color="success" onClick={handleAction} autoFocus>
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
                      </MainCard>
                    </Box>
                  </Grid>
                  <Snackbar
                    open={snackbaropen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <Alert
                      onClose={() => setSnackbarOpen(false)}
                      severity={alertColor}
                      sx={{
                        width: '100%',
                        backgroundColor: alertColor === 'success' ? 'green' : 'red',
                        color: 'white',
                        fontWeight: 500,
                      }}
                    >
                      {message}
                    </Alert>
                  </Snackbar>
                  <Snackbar
                    open={showGrid && failedOwnerIds.length > 0}
                    autoHideDuration={null} // Keeps it open until closed manually
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={() => {
                      setShowGrid(false);
                      setFailedOwnerIds([]);
                    }}
                  >
                    <Alert
                      severity="error"
                      variant="filled"
                      onClose={() => {
                        setShowGrid(false);
                        setFailedOwnerIds([]);
                      }}
                      sx={{
                        width: '100%',
                        maxWidth: 600,
                        backgroundColor: '#ffebee',
                        color: '#b71c1c',
                        borderRadius: 2,
                        boxShadow: 3,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        🚫 Some OwnerIDs failed to process
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Please check the following OwnerIDs:
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                        {failedOwnerIds.map((item, index) => (
                          <li key={index}>
                            <Typography variant="body2">
                              <strong>{item.ownerId}</strong>
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    </Alert>
                  </Snackbar>

                  {/*  */}
                  <Grid item xs={12} md={5} lg={5} mt={2.9}>
                    <div className="card" style={{ marginTop: '6px' }}>
                      <Card>
                        <CardContent>
                          <Box sx={{ overflowX: 'auto', height: '330px' }}>
                            {/* Table */}
                            <Table>
                              {/* Table Header */}
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell>Ward No</TableCell>
                                  <TableCell>Properties No</TableCell>
                                  <TableCell>Partition No</TableCell>
                                </TableRow>
                              </TableHead>

                              {/* Table Body */}
                              <TableBody>
                                {propertyList.length > 0 ? (
                                  propertyList.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.NewWardNo}</TableCell>
                                      <TableCell>{item.NewPropertyNo}</TableCell>
                                      <TableCell>{item.NewPartitionNo}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={3} align="center">
                                      No properties found
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid>
                </Grid>

                {/* </MainCard> */}
              </Typography>
            </TabPanel>
          </Box>
        </MainCard>
      ) : (
        <PaymentAdvance PaymentAdvance={handleButtonClick} selectWards={selectWards} financialYear={financialYear} />
      )}
    </>
  );
}

export default AddTaxes;
