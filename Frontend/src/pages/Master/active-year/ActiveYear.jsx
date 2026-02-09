import { Checkbox, IconButton, MenuItem, Select, Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import {
  Button,
  Box,
  Stack,
  InputLabel,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { deleteActiveYear, getActiveYear, saveAndUpdateActiveYear } from 'services/masterServices/active-yearServices/active-year.services';
import * as Yup from 'yup';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function ActiveYear() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarMessages, setSnackbarMessages] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');

  const [active, setActive] = useState('');
  const [selectedOption, setSelectedOption] = useState('Pending Demand Tax Table');
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);

  const [alias, setAlias] = useState('');
  const [description, setDescription] = useState('');
  const [tableData, setTableData] = useState([]);

  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  //backend
  const [isOpen, setIsOpen] = useState(false);
  const [activeYearList, setActiveYearList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [activeYearData, setActiveYearData] = useState({
    ActiveYear: '',
    Name: '',
    ActiveYearID: '0',
    Description: '',
    TaxTable: 'Pending Demand Tax Table',
    Status: 1
  });

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Active Year';
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
      console.log(access, 'assigned access to Active Year Page');
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
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeYearList.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchActiveYearList = async () => {
      try {
        const fetchedActive = await getActiveYear();
        setActiveYearList(fetchedActive);
      } catch (error) {
        console.error('Error fetching active Year list:', error);
        setActiveYearList([]);
      }
    };
    fetchActiveYearList();
  }, []);

  useEffect(() => {
    if (activeYearData && activeYearData.Status !== undefined) {
      setSelectedStatus(activeYearData.Status);
    }
  }, [activeYearData]);

  // Active Year checkbox
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = currentItems.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, currentItems]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = Yup.object().shape({
    ActiveYear: Yup.string()
      .required('Active Year is required')
      .matches(/^\d{4}$/, 'Active Year must be a 4-digit number'),
    Name: Yup.string().required('Name is required'),
    Description: Yup.string().required('Description is required'),
    TaxTable: Yup.string().required('TaxTable is required'),
    Status: Yup.string().required('Status is required')
  });

  // const toggle = () => {
  //   setIsOpen(!isOpen);
  //   handleClear();
  // }

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
    setSelectedOption(rowData.TaxTable || 'Pending Demand Tax Table');
    setSelectedStatus(rowData.Status || 1);
    setActiveYearData(rowData);
    setIsOpen(true);
  };

  const handleClear = () => {
    setActiveYearData({
      ActiveYear: '',
      Name: '',
      ActiveYearID: '0',
      Description: '',
      TaxTable: 'Pending Demand Tax Table',
      Status: 1
    });
    setSelectedRow(null);
    setSelectedOption('Pending Demand Tax Table');
    setSelectedStatus(1);
    setErrors({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Check if the field is 'Name', then filter out non-alphabet characters
    if (name === 'Name') {
      const filteredValue = value.replace(/[^A-Za-z]/g, '');
      setActiveYearData({ ...activeYearData, [name]: filteredValue });
    } else if (name === 'ActiveYear' && (value.length > 4 || !/^\d{0,4}$/.test(value))) {
      return;
    } else {
      setActiveYearData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // const handleSave = async () => {
  //   const financeYearInt = parseInt(activeYearData.ActiveYear, 10);

  //   if (isNaN(financeYearInt) || financeYearInt <= 0 || activeYearData.ActiveYear.length !== 4) {
  //     setErrors({ ActiveYear: "Active Year must be a 4-digit number" });
  //     return;
  //   }

  //   try {
  //     await validationSchema.validate(activeYearData, { abortEarly: false });
  //     let response;
  //     console.log('Before calling saveAndUpdateActiveYear:', activeYearData);
  //     if (activeYearData.ActiveYearID === '0') {
  //       // New entry
  //       response = await saveAndUpdateActiveYear(activeYearData);
  //       console.log('After calling saveAndUpdateActiveYear (create):', response);
  //       if (response.status === 200 || response.status === 201) {
  //         setReceivedMessage('Active Year created successfully');
  //         setSnackbarSeverity('success');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage(response.message || 'Active Year saved successfully');

  //         setIsOpen(false);
  //         setActiveYearList((activeYearList) => [...activeYearList, response.res.data.ActiveYearInfo]);
  //         handleClear();
  //       } else {
  //         setReceivedMessage(response.message || 'An error occurred while creating the Active Year');
  //         setSnackbarSeverity('error');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage(response.message || 'An error occurred while saving Year data');

  //         setIsOpen(false);
  //       }
  //     } else {
  //       response = await saveAndUpdateActiveYear(activeYearData);
  //       console.log('After calling saveAndUpdateActiveYear (update):', response);
  //       if (response.status === 200 || response.status === 201) {
  //         setReceivedMessage('Active Year updated successfully');
  //         setSnackbarSeverity('success');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage(response.message || 'Year updated successfully');

  //         setIsOpen(false)
  //         setActiveYearList((prevList) =>
  //           prevList.map((activeY) =>
  //             activeY.ActiveYearID === activeYearData.ActiveYearID ? response.res.data.ActiveYearInfo : activeY
  //           )

  //         );

  //       } else {
  //         setReceivedMessage(response.message || 'An error occurred while updating the Active Year');
  //         setSnackbarSeverity('error');
  //         setSnackbarMessage(response.message || 'An error occurred while updating Year data');

  //         setSnackbarOpen(true);
  //         setIsOpen(false);
  //       }
  //     }
  //     handleClear();
  //   } catch (validationErrors) {
  //     console.error('Validation Errors:', validationErrors);
  //     const formattedErrors = validationErrors.inner.reduce((acc, err) => {
  //       return { ...acc, [err.path]: err.message };
  //     }, {});
  //     setErrors(formattedErrors);
  //   }
  // };
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in taxes  page');
  }, [userData])
  
  const handleSave = async () => {
    const financeYearInt = parseInt(activeYearData.ActiveYear, 10);

    if (isNaN(financeYearInt) || financeYearInt <= 0 || activeYearData.ActiveYear.length !== 4) {
      setErrors({ ActiveYear: 'Active Year must be a 4-digit number' });
      return;
    }

    const isDuplicate = activeYearList.some(
      (year) => year.ActiveYear === activeYearData.ActiveYear && year.ActiveYearID !== activeYearData.ActiveYearID
    );

    if (isDuplicate) {
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setReceivedMessage('Duplicate Active Year is not allowed');
      handleClear();
      return;
    }

    try {
      await validationSchema.validate(activeYearData, { abortEarly: false });
      
      const payload = {
        ...activeYearData,
        UserID: userData?.UserID || 0 
      };

      let response;
      console.log('Sending data to backend with UserID:', payload);

      if (activeYearData.ActiveYearID === '0' || !activeYearData.ActiveYearID) {
        response = await saveAndUpdateActiveYear(payload); 
        
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage('Active Year created successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setSnackbarMessage(response.message || 'Active Year saved successfully');
          setIsOpen(false);
          setActiveYearList((prevList) => [...prevList, response.res.data.ActiveYearInfo]);
          handleClear();
        } else {
          setReceivedMessage(response.message || 'Error occurred while creating');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setIsOpen(false);
        }
      } else {
        response = await saveAndUpdateActiveYear(payload); 
        
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage('Active Year updated successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setSnackbarMessage(response.message || 'Year updated successfully');
          setIsOpen(false);
          setActiveYearList((prevList) =>
            prevList.map((activeY) => 
              activeY.ActiveYearID === activeYearData.ActiveYearID ? response.res.data.ActiveYearInfo : activeY
            )
          );
        } else {
          setReceivedMessage(response.message || 'Error occurred while updating');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setIsOpen(false);
        }
      }
      handleClear();
    } catch (validationErrors) {
      console.error('Validation Errors:', validationErrors);
      if (validationErrors.inner) {
        const formattedErrors = validationErrors.inner.reduce((acc, err) => {
          return { ...acc, [err.path]: err.message };
        }, {});
        setErrors(formattedErrors);
      }
    }
  };

  const handleSelectChange = (name, value) => {
    setActiveYearData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDeleteActiveYear = async () => {
    try {
      const IDsToDelete = selectedRows.map((row) => row.ActiveYearID);

      if (IDsToDelete.length > 0) {
        const response = await deleteActiveYear(IDsToDelete);

        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        setActiveYearList((activeYearList) => activeYearList.filter((bank) => !IDsToDelete.includes(bank.ActiveYearID)));

        setSelectedRows([]);
        handleClear(); // Optionally clear the form after deletion
      }
    } catch (error) {
      console.error('Error deleting bank information:', error);
      setSnackbarOpen(true);
      setReceivedMessage('Error Active master details');
      setSnackbarSeverity('error');
      setSnackbarMessage('Error Active master details');
      handleClear();
    }
  };

  // const handleCheckboxChange = (e, active) => {
  //   const isChecked = e.target.checked;
  //   setSelectedRows((prevSelectedRows) => (isChecked ? [...prevSelectedRows, active] : prevSelectedRows.filter((row) => row.ActiveYearID !== active.ActiveYearID)));
  // };

  //checkbox
  const handleCheckboxChange = (event, active) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, active]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((selectedBank) => selectedBank.ActiveYearID !== active.ActiveYearID));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(currentItems);
    } else {
      setSelectedRows([]);
    }
  };

  //pagination
  const handleChangePage = (event, newPage) => {
    console.log(newPage, 'pagination');
    setCurrentPage(newPage);
  };

  return (
    <>
      {' '}
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
        <MainCard title="Active Master">
          <MainCard>
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* <Button variant="contained" color="info" onClick={toggle}>
  <span style={{ fontSize: '1.7rem', marginRight: '0.5rem' }}>+</span> Active Year Details
</Button> */}
            </Stack>

            {/* {isOpen && ( */}
            <Grid
              container
              spacing={2.2}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
            >
              <Grid item xs={12} sm={9}>
                <Box className="card">
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={3.3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>Active Year:</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField
                              required
                              fullWidth
                              autoComplete="family-name"
                              placeholder="Enter Active Year:"
                              value={activeYearData.ActiveYear}
                              onChange={handleInputChange}
                              error={!!errors.ActiveYear}
                              helperText={errors.ActiveYear}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              name="ActiveYear"
                              // onChange={(event) => setActive(event.target.value)}
                              disabled={accessLevel < 3}
                            />
                          </Stack>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={3.3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>Alias:</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField
                              required
                              fullWidth
                              autoComplete="family-name"
                              placeholder="Enter Alias:"
                              value={activeYearData.Name}
                              //  onChange={(event) => setAlias(event.target.value)}
                              onChange={handleInputChange}
                              error={!!errors.Name}
                              helperText={errors.Name}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              name="Name"
                              disabled={accessLevel < 3}
                            />
                          </Stack>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={3.3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>Description:</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField
                              required
                              fullWidth
                              autoComplete="family-name"
                              placeholder="Enter Description:"
                              onChange={handleInputChange}
                              error={!!errors.Description}
                              helperText={errors.Description}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              value={activeYearData.Description}
                              name="Description"
                              //  onChange={(event) =>  setDescription(event.target.value)}
                              disabled={accessLevel < 3}
                            />
                          </Stack>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={3.3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>Ref. Tax Table:</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <Select
                              required
                              fullWidth
                              value={selectedOption}
                              name="TaxTable"
                              onChange={(event) => {
                                setSelectedOption(event.target.value);
                                handleSelectChange('TaxTable', event.target.value);
                              }}
                              disabled={accessLevel < 3}
                            >
                              <MenuItem value={'Pending Demand Tax Table'}>Pending Demand Tax Table</MenuItem>
                              <MenuItem value={'Current Demand Tax Table'}>Current Demand Tax Table</MenuItem>
                            </Select>
                          </Stack>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={3.3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>Status:</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <Select
                              required
                              fullWidth
                              name="Status"
                              value={selectedStatus}
                              onChange={(event) => {
                                setSelectedStatus(event.target.value);
                                handleSelectChange('Status', event.target.value);
                              }}
                              disabled={accessLevel < 3}
                            >
                              <MenuItem value={1}>Active</MenuItem>
                              <MenuItem value={0}>DeActive</MenuItem>
                            </Select>
                          </Stack>
                        </Grid>
                      </Grid>

                      <Grid container spacing={3} ml={{ xs: 0, sm: 8 }}>
                        <Grid item xs={12} sm={6}>
                          <Grid container spacing={1} ml={{ xs: 0, sm: 9 }}>
                            <Grid item xs={12} sm={4} mb={1} container justifyContent="center">
                              <Button variant="contained" color="success" onClick={handleSave} disabled={accessLevel < 3}>
                                Save
                              </Button>
                            </Grid>
                            <Grid item xs={12} sm={4} mb={1} container justifyContent="center">
                              <Button variant="contained" color="secondary" onClick={handleClear} disabled={accessLevel < 3}>
                                Clear
                              </Button>
                            </Grid>
                            <Grid item xs={12} sm={4} mb={1} container justifyContent="center">
                              <Button variant="contained" color="error"
  onClick={() => setShowDeleteDialog(true)}
  disabled={accessLevel < 4}>
                                Delete
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            {/* )} */}
            {/* {!isOpen && ( */}
            <Grid container spacing={3} justifyContent="center">
              <Grid container spacing={3} justifyContent="center" mt={3}>
                <Grid item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Card>
                    <CardContent>
                      <Box sx={{ overflowX: 'auto', height: '400px', textAlign: 'center' }}>
                        <Table stickyHeader>
                          <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                            <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                              <TableCell>
                                <Checkbox
                                  checked={allChecked}
                                  indeterminate={indeterminate}
                                  onChange={handleSelectAll}
                                  disabled={accessLevel < 3}
                                />
                              </TableCell>
                              <TableCell>Edit</TableCell>
                              <TableCell>Active Tax Year</TableCell>
                              <TableCell>Year Alias</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Taxable</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {currentItems.map((active) => (
                              <TableRow key={active.ActiveYearID}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedRows.includes(active)}
                                    onChange={(event) => handleCheckboxChange(event, active)}
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={accessLevel < 3}
                                  />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    color={activeYearData.ActiveYearID === active.ActiveYearID ? 'success' : 'primary'}
                                    onClick={() => handleRowClick(active)}
                                    disabled={accessLevel < 3}
                                  >
                                    {activeYearData.ActiveYearID === active.ActiveYearID ? <SendOutlined /> : <EditTwoTone />}
                                  </IconButton>
                                </TableCell>
                                <TableCell>{active.ActiveYear}</TableCell>
                                <TableCell>{active.Name}</TableCell>
                                <TableCell>{active.Description}</TableCell>
                                <TableCell>{active.TaxTable}</TableCell>
                                <TableCell>{active.Status}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'right', mt: 1 }}>
                        <Pagination
                          count={Math.ceil(activeYearList.length / itemsPerPage)}
                          page={currentPage}
                          onChange={handleChangePage}
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {/* )} */}
            </Grid>
            {/* )} */}
          </MainCard>
          <Dialog
  open={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete?</Typography>

      <Box sx={{ mt: 2 }}>
        {selectedRows.map((row) => (
          <Typography key={row.ActiveYearID}>• {row.ActiveYear}</Typography>
        ))}
      </Box>
    
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowDeleteDialog(false)} color="primary">
      Cancel
    </Button>
    <Button
      onClick={() => {
        handleDeleteActiveYear(); // Call your delete function
        setShowDeleteDialog(false); // Close dialog after delete
      }}
      color="error"
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete?</Typography>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setShowDeleteDialog(false)}
      style={{ backgroundColor: "black", color: "#fff"  }}    >
      Cancel
    </Button>
    <Button
      onClick={() => {
       handleDeleteActiveYear();
        setShowDeleteDialog(false);
      }}
      style={{ backgroundColor: "red", color: "#fff"  }}    >
      Delete
    </Button>
  </DialogActions>
</Dialog>
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
        </MainCard>
      )}
    </>
  );
}

export default ActiveYear;
