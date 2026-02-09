import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  SnackbarContent,
  Typography
} from '@mui/material';
import { CheckCircleOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import {
  Button,
  Box,
  Stack,
  InputLabel,
  Grid,
  TextField,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';

import * as Yup from 'yup';
import {
  deleteActiveTaxes,
  getActiveMasterList,
  saveAndUpdateActiveTaxes
} from 'services/masterServices/active-taxes-services/active-taxes-service.js';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function ActiveTaxes() {
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [hideNewtaxHead, setHideNewTaxHead] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeTaxList, setActiveTaxesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);
  const [newTaxData, setNewTaxData] = useState({
    TaxNameID: 0,
    TaxName: '',
    TaxNameAlias: '',
    Status: 1,
    TaxNameOrder: null,
    ActiveTaxHeadsOnly: 0
  });
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeTaxList.slice(indexOfFirstItem, indexOfLastItem);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Active Taxes';
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
      console.log(access, 'assigned access');
      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true); // Show dialog for No Access or View Only
      } else {
        setShowAccessDialog(false);
      }
    }
  }, [permissionAccess]);

  useEffect(() => {
    const fetchActiveTaxesList = async () => {
      try {
        const fetchedActiveTaxes = await getActiveMasterList();

        console.log(fetchedActiveTaxes, 'list of taxes');
        setActiveTaxesList(fetchedActiveTaxes);
        console.log(activeTaxList, 'listttt');
      } catch (error) {
        console.error('Error fetching zone list:', error);
        setActiveTaxesList([]);
      }
    };
    fetchActiveTaxesList();
  }, []);

  // activeTaxes checkbox
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = currentItems.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, currentItems]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const toggle = () => {
    setIsOpen(!isOpen);
    setHideNewTaxHead(!hideNewtaxHead);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = Yup.object().shape({
    TaxName: Yup.string().required('Tax Name is required'),
    TaxNameAlias: Yup.string().required('Tax Name Alias is required'),
    Status: Yup.string().required('Status is required')
  });

  const handleRowClick = (tax) => {
    console.log('📌 ROW CLICKED:', tax); // <-- ADD THIS
    console.log('📌 ActiveTaxHeadsOnly From Row:', tax.ActiveTaxHeadsOnly);
    setSelectedRow(tax);
    setNewTaxData({
      ...tax,
      ActiveTaxHeadsOnly: Number(tax.ActiveTaxHeadsOnly)
    });
    setIsOpen(true);
    setSelectedStatus(tax.selectedStatus || '');
  };

  const handleCancle = () => {
    // setHideNewTaxHead(true);
    // setIsOpen(false);
    setNewTaxData({
      TaxNameID: 0,
      TaxName: '',
      TaxNameAlias: '',
      Status: 1,
      TaxNameOrder: '',
      ActiveTaxHeadsOnly: 0
    });
    setSelectedRow(null);
    setErrors({});
  };

  const handleSave = async () => {
    try {
      const taxDataToSave = {
        ...newTaxData,
        TaxNameOrder: newTaxData.TaxNameOrder || null,
        TaxNameID: newTaxData.TaxNameID || 0,
        TaxNameOrder: newTaxData.TaxNameOrder || 1,
        ActiveTaxHeadsOnly: Number(newTaxData.ActiveTaxHeadsOnly)
      };

      console.log(taxDataToSave, 'data to be save or update');

      await validationSchema.validate(taxDataToSave, { abortEarly: false });
      let response;

      console.log(taxDataToSave.TaxNameID, 'id');

      if (taxDataToSave.TaxNameID === 0) {
        response = await saveAndUpdateActiveTaxes(taxDataToSave);
        console.log(response, 'save response');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage('Active Taxes saved successfully');
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Active Taxes saved successfully');
          setSnackbarOpen(true);
          setActiveTaxesList((activeTaxesList) => [...activeTaxesList, response.res.data.ActiveTaxesInfo]);
          handleCancle();
          // setHideNewTaxHead(true);
          // setIsOpen(false);
        } else {
          setReceivedMessage(response.message || 'An error occurred while saving tax data');
          setSnackbarSeverity('error');
          setSnackbarMessage(response.message || 'An error occurred while saving tax data');
          setSnackbarOpen(true);
        }
      } else {
        response = await saveAndUpdateActiveTaxes(taxDataToSave);
        console.log(response, 'update response');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage('Taxes updated successfully');
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Taxes updated successfully');
          setSnackbarOpen(true);
          // setActiveTaxesList((activeTaxesList) =>
          //   activeTaxesList.map((tax) =>
          //     tax.TaxNameID === response.res.data.ActiveTaxesInfo.TaxNameID ? response.res.data.ActiveTaxesInfo : tax
          //   )
          // );
          // setHideNewTaxHead(true);
          // setIsOpen(false);
          setActiveTaxesList((activeTaxesList) =>
            activeTaxesList.map((tax) =>
              Number(tax.TaxNameID) === Number(response.res.data.ActiveTaxesInfo.TaxNameID) ? response.res.data.ActiveTaxesInfo : tax
            )
          );
          handleCancle();
          setIsOpen(false);
        } else {
          setReceivedMessage(response.message || 'An error occurred while updating tax data');
          setSnackbarSeverity('error');
          setSnackbarMessage(response.message || 'An error occurred while updating tax data');
          setSnackbarOpen(true);
        }
      }
      handleCancle();
    } catch (validationErrors) {
      if (validationErrors.inner && validationErrors.inner.length > 0) {
        const formattedErrors = validationErrors.inner.reduce((acc, err) => {
          return { ...acc, [err.path]: err.message };
        }, {});
        setErrors(formattedErrors);
      } else {
        console.error('Validation Error:', validationErrors);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const alphabetRegex = /^[A-Za-z\s]*$/;

    if (alphabetRegex.test(value)) {
      setNewTaxData((prevState) => ({
        ...prevState,
        [name]: name === 'Status' ? (value === 'Active' ? 1 : 0) : value
      }));

      // Clear error message when valid input is entered
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Only alphabets are allowed'
      }));
    }
  };

  // const handleDeleteActiveTaxes = async () => {
  //   try {
  //     await deleteActiveTaxes(newTaxData.TaxNameID);
  //     setActiveTaxesList(activeTaxList.filter((tax) => tax.TaxNameID !== selectedRow.TaxNameID));
  //     setReceivedMessage('Taxes deleted successfully');
  //     setSnackbarSeverity('error');
  //     setSnackbarMessage('Taxes deleted successfully');
  //     setSnackbarOpen(true);
  //     // setHideNewTaxHead(true);
  //     // setIsOpen(false);
  //     handleCancle();
  //   } catch (error) {
  //     console.error('Error deleting taxes:', error);
  //     setReceivedMessage('Error deleting taxes');
  //     setSnackbarSeverity('error');
  //     setSnackbarMessage('Error deleting taxes');
  //     setSnackbarOpen(true);
  //   }
  // };

  const handleDeleteActiveTaxes = async () => {
    if (selectedRows.length === 0) {
      setReceivedMessage('Please select at least one tax to delete.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    setOpenDeleteDialog(true);
  };

  // useEffect(() => {
  //   if (newTaxData && newTaxData.Status !== undefined) {
  //     setSelectedStatus(setNewTaxData.Status);
  //   }
  // }, [newTaxData]);
  // useEffect(() => {
  //   if (newTaxData && newTaxData.Status !== undefined) {
  //     setSelectedStatus(newTaxData.Status);
  //   }
  // }, [newTaxData]);

  const handleSelectChange = (name, value) => {
    setNewTaxData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  //checkbox
  const handleCheckboxChange = (event, tax) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, tax]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((row) => row.TaxNameID !== tax.TaxNameID));
    }
  };

  // handleSelectAll function
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(currentItems);
    } else {
      setSelectedRows([]);
    }
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      // const IDsToDelete = selectedRows.map((row) => row.TaxNameID);
      const IDsToDelete = selectedRows.map((row) => row.TaxNameID).filter((id) => Number.isInteger(id) && id > 0);

      console.log('Deleting TaxNameIDs:', IDsToDelete);

      if (IDsToDelete.length > 0) {
        console.log('Deleting TaxNameIDs:', IDsToDelete, typeof IDsToDelete[0], Array.isArray(IDsToDelete));

        const response = await deleteActiveTaxes(IDsToDelete);

        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setOpenDeleteDialog(false);

        setActiveTaxesList((prevTaxesDataList) => prevTaxesDataList.filter((tax) => !IDsToDelete.includes(tax.TaxNameID)));

        setSelectedRows([]);
        handleCancle();
      }
    } catch (error) {
      console.error('Error deleting taxes :', error);
      setSnackbarOpen(true);
      setReceivedMessage('Error deleting taxes details');
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting taxes details');
      handleCancle();
    }
  };

  const navigate = useNavigate();
  const ShowTaxTable = () => {
    return (
      <Grid container spacing={3} justifyContent="center" mt={3}>
        <Grid item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card>
            <CardContent>
              <Box sx={{ mb: '1vw', overflowX: 'auto', height: '400px', textAlign: 'center' }}>
                <Table stickyHeader>
                  <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                    <TableRow>
                      <TableCell sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                        <Checkbox
                          checked={allChecked}
                          indeterminate={indeterminate}
                          onChange={handleSelectAll}
                          disabled={accessLevel < 3}
                        />
                      </TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Tax Name</TableCell>
                      <TableCell>Tax Name Alias</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Tax Order</TableCell>
                      <TableCell>Active Tax Head</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((tax) => (
                      <TableRow key={tax.TaxNameID}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.some((row) => row.TaxNameID === tax.TaxNameID)}
                            onChange={(event) => handleCheckboxChange(event, tax)}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRowClick(tax)} disabled={accessLevel < 3}>
                            <EditTwoTone />
                          </IconButton>
                        </TableCell>
                        <TableCell>{tax.TaxName}</TableCell>
                        <TableCell>{tax.TaxNameAlias}</TableCell>
                        <TableCell>{tax.Status === 1 ? 'Active' : 'DeActive'}</TableCell>
                        <TableCell>{tax.TaxNameOrder}</TableCell>
                        <TableCell>{tax.ActiveTaxHeadsOnly === 1 ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
            <Pagination
              count={Math.ceil(activeTaxList.length / itemsPerPage)}
              page={currentPage}
              onChange={handleChangePage}
              variant="outlined"
              color="primary"
              sx={{ ml: '33vw', mb: '0.5vw' }}
            />
          </Card>
        </Grid>
      </Grid>
    );
  };
  const handleRedirect = () => {
    setShowAccessDialog(false);
    navigate('/payment/dashboard');
  };

  const taxOrderList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
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
        <MainCard>
          {/* {hideNewtaxHead && NewTaxHead()} */}
          {/* {isOpen && ( */}

          <MainCard title="Active Taxes Master ">
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
                            <InputLabel style={{ fontWeight: 'bold' }}>Tax Name</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField
                              name="TaxName"
                              value={newTaxData.TaxName}
                              onChange={handleInputChange}
                              error={!!errors.TaxName}
                              helperText={errors.TaxName}
                              FormHelperTextProps={{ style: { color: 'red' } }}
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
                              name="TaxNameAlias"
                              value={newTaxData.TaxNameAlias}
                              onChange={handleInputChange}
                              error={!!errors.TaxNameAlias}
                              helperText={errors.TaxNameAlias}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              disabled={accessLevel < 3}
                            />
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
                              autoComplete="family-name"
                              placeholder="Enter Ref. Tax Table:"
                              value={newTaxData.Status}
                              name="Status"
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

                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={3.3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>Tax Order</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <Select
                              required
                              fullWidth
                              value={newTaxData.TaxNameOrder}
                              name="TaxNameOrder"
                              disabled={accessLevel < 3}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    width: 90
                                  }
                                }
                              }}
                              onChange={(e) =>
                                setNewTaxData({
                                  ...newTaxData,
                                  TaxNameOrder: e.target.value
                                })
                              }
                            >
                              {taxOrderList.map((id) => (
                                <MenuItem key={id} value={id}>
                                  {id}
                                </MenuItem>
                              ))}
                            </Select>
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={3.3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>Active Tax Head</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <Select
                              required
                              fullWidth
                              autoComplete="family-name"
                              placeholder="Enter Ref. Tax Table:"
                              value={newTaxData.ActiveTaxHeadsOnly}
                              onChange={(e) =>
                                setNewTaxData({
                                  ...newTaxData,
                                  ActiveTaxHeadsOnly: Number(e.target.value)
                                })
                              }
                              // onChange={(event) => {
                              //   setSelectedStatus(event.target.value);
                              //   handleSelectChange('Status', event.target.value);
                              // }}
                              disabled={accessLevel < 3}
                            >
                              <MenuItem value={1}>Yes</MenuItem>
                              <MenuItem value={0}>No</MenuItem>
                            </Select>
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                          <Grid container spacing={1} justifyContent="center">
                            <Stack spacing={2} direction={'row'} marginTop={2} marginLeft={12}>
                              <Button variant="contained" color="success" onClick={handleSave} disabled={accessLevel < 3}>
                                Save
                              </Button>

                              <Button variant="contained" color="secondary" onClick={handleCancle} disabled={accessLevel < 3}>
                                Clear
                              </Button>

                              <Button variant="contained" color="error" onClick={handleDeleteActiveTaxes} disabled={accessLevel < 4}>
                                Delete
                              </Button>
                              <Dialog open={openDeleteDialog} maxWidth="xs" fullWidth>
                                <DialogContent>
                                  <Typography variant="body1">Are you sure you want to delete?</Typography>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleConfirmDelete} color="error" variant="contained">
                                    Yes
                                  </Button>
                                  <Button onClick={handleCancelDelete} color="primary" variant="outlined">
                                    No
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            {/* )}
        {!isOpen && ShowTaxTable()} */}
            {ShowTaxTable()}
          </MainCard>
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
    </>
  );
}

export default ActiveTaxes;
