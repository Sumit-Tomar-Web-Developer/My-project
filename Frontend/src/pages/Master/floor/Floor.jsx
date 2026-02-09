import {
  Grid,
  IconButton,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Tab,
  Tabs,
  Button,
  Snackbar,
  Alert,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import {
  createNewFloor,
  createOldFloor,
  deleteNewFloor,
  fetchNewFloor,
  fetchOldFloor,
  deleteOldFloor
} from 'services/floorMaster.service.js';
import { useNavigate } from 'react-router';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function Floor() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOldRow, setSelectedOldRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [newFloorList, setNewFloorList] = useState([]);
  const [oldFloorList, setOldFloorList] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedRowsNew, setSelectedRowsNew] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const [selectedCheckboxesNew, setSelectedCheckboxesNew] = useState([]);
  const [indeterminateNew, setIndeterminateNew] = useState(false);
  const [allCheckedNew, setAllCheckedNew] = useState(false);

  const [selectedRowsOld, setSelectedRowsOld] = useState([]);
  const [newFloorData, setNewFloorData] = useState({
    FMId: 0,
    FloorID: '',
    Description: ''
  });

  const [oldFloorData, setOldFloorData] = useState({
    ID: 0,
    OldFloorID: '',
    OldDescription: ''
  });
  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Floor';
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

      console.log(access, 'assigned access to floor Page');

      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true);
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

  // Validation schemas
  const newFloorSchema = Yup.object().shape({
    FloorID: Yup.string().required('Floor Name is required'),
    Description: Yup.string().required('Description is required')
  });

  const oldFloorSchema = Yup.object().shape({
    OldFloorID: Yup.string().required('Floor Name is required'),
    OldDescription: Yup.string().required('OldDescription is required')
  });

  const handleNewFloorCheckboxChange = (e, floor) => {
    const isChecked = e.target.checked;
    setSelectedRowsNew((prevSelectedRows) =>
      isChecked ? [...prevSelectedRows, floor] : prevSelectedRows.filter((row) => row.FMId !== plotRate.FMId)
    );
  };

  

  const handleOldFloorCheckboxChange = (e, floor) => {
    const isChecked = e.target.checked;
    setSelectedRowsOld((prevSelectedRows) =>
      isChecked ? [...prevSelectedRows, floor] : prevSelectedRows.filter((row) => row.ID !== floor.ID)
    );
  };



  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const fetchedFloors = await fetchNewFloor();
        setNewFloorList(fetchedFloors.floorList || []);
      } catch (error) {
        console.error('Error fetching Floor:', error);
        setNewFloorList([]);
      }
    };
    fetchFloors();
  }, []);

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const fetchedFloors = await fetchOldFloor();
        setOldFloorList(fetchedFloors.floors || []);
      } catch (error) {
        console.error('Error fetching Floor:', error);
        setOldFloorList([]);
      }
    };
    fetchFloors();
  }, []);

  //checkbox old
  useEffect(() => {
    const totalSelected = selectedCheckboxes.length;
    const totalCheckboxes = oldFloorList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedCheckboxes, oldFloorList]);

  //checkbox new
  useEffect(() => {
    const totalSelected = selectedCheckboxesNew.length;
    const totalCheckboxes = newFloorList.length;
    setAllCheckedNew(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminateNew(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedCheckboxesNew, newFloorList]);
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in offline paymrebt page');
  }, [userData])
  const handleNewSaveClick = async () => {
    try {
      const floorDataToSave = {
        ...newFloorData,
        FMId: newFloorData.FMId || 0,
        UserID: userData?.UserID || 1


      };

      await newFloorSchema.validate(floorDataToSave, { abortEarly: false });
      let response;

      console.log(floorDataToSave.FMId, 'id');
      if (floorDataToSave.FMId === 0) {
        response = await createNewFloor(floorDataToSave);

        console.log(response, 'success new fllor saved');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Floor saved successfully');
          setSnackbarOpen(true);
          setNewFloorList([...newFloorList, response.res.data.floor]);
          handleClearClick();
        } else {
          throw new Error(response.message || 'An error occurred while saving new floor');
        }
      } else {
        response = await createNewFloor(floorDataToSave);

        console.log(response, 'floor  updating ');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'floor updated successfully');
          setSnackbarOpen(true);
          const updatedList = newFloorList.map((floor) => (floor.FMId === response.res.data.floor.FMId ? response.res.data.floor : floor));
          setNewFloorList(updatedList);
          handleClearClick();
        } else {
          throw new Error(response.message || 'An error occurred while updating floor');
        }
      }
    } catch (error) {
      if (error.response) {
        setSnackbarOpen(true);
        setReceivedMessage(error.response.message || 'Cannot enter duplicate floor Id');
        setSnackbarSeverity('error');
        setSnackbarMessage(error.response.message || 'Cannot enter duplicate floor Id');
      } else if (error.inner && error.inner.length > 0) {
        // Handle validation errors
        const formattedErrors = error.inner.reduce((acc, err) => {
          return { ...acc, [err.path]: err.message };
        }, {});
        setErrors(formattedErrors);
      } else {
        // Handle other errors
        console.error('Error:', error);
      }
    }
  };

  const handleOldSaveClick = async () => {
    try {
      const floorDataToSave = {
        ...oldFloorData,
        ID: oldFloorData.ID || 0,
        UserID: userData?.UserID || 1

      };

      await oldFloorSchema.validate(floorDataToSave, { abortEarly: false });
      let response;

      if (floorDataToSave.ID === 0) {
        response = await createOldFloor(floorDataToSave);

        console.log(response, 'success old fllor saved');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'old Floor saved successfully');
          setSnackbarOpen(true);
          setOldFloorList([...oldFloorList, response.res.data.floor]);
          handleOldClearClick();
        } else {
          throw new Error(response.message || 'An error occurred while saving old floor');
        }
      } else {
        response = await createOldFloor(floorDataToSave);

        console.log(response, 'floor old updating ');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'floor updated successfully');
          setSnackbarOpen(true);
          const updatedList = oldFloorList.map((floor) => (floor.ID === response.res.data.floor.ID ? response.res.data.floor : floor));
          setOldFloorList(updatedList);
          handleOldClearClick();
        } else {
          throw new Error(response.message || 'An error occurred while updating old floor');
        }
      }
    } catch (error) {
      if (error.response) {
        setSnackbarOpen(true);
        setReceivedMessage(error.response.message || 'Cannot enter duplicate old floor Id');
        setSnackbarSeverity('error');
        setSnackbarMessage(error.response.message || 'Cannot enter duplicate old floor Id');
      } else if (error.inner && error.inner.length > 0) {
        // Handle validation errors
        const formattedErrors = error.inner.reduce((acc, err) => {
          return { ...acc, [err.path]: err.message };
        }, {});
        setErrors(formattedErrors);
      } else {
        // Handle other errors
        console.error('Error:', error);
      }
    }
  };

  const handleRowClick = (floor) => {
    setNewFloorData({
      FMId: floor.FMId,
      FloorID: floor.FloorID,
      Description: floor.Description
    });
  };

  const handleOldRowClick = (floor) => {
    setOldFloorData({
      ID: floor.ID,
      OldFloorID: floor.OldFloorID,
      OldDescription: floor.OldDescription
    });
  };

  const handleClearClick = () => {
    setNewFloorData({
      FMId: '',
      FloorID: '',
      Description: ''
    });
    setErrors({});
  };

  const handleOldClearClick = () => {
    setOldFloorData({
      ID: '',
      OldFloorID: '',
      OldDescription: ''
    });
    setErrors({});
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;

    setNewFloorData({ ...newFloorData, [name]: value });
    setErrors({});
  };

  const handleOldInputChange = (e) => {
    const { name, value } = e.target;

    setOldFloorData({ ...oldFloorData, [name]: value });
    setErrors({});
  };

  //checkbox old
  const handleOldCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedCheckboxes((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedCheckboxes((prevSelected) => prevSelected.filter((selectedId) => selectedId !== id));
    }
  };
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = oldFloorList.map((floor) => floor.ID);
      setSelectedCheckboxes(allIds);
    } else {
      setSelectedCheckboxes([]);
    }
  };

  //checkbox new
  const handleNewCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedCheckboxesNew((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedCheckboxesNew((prevSelected) => prevSelected.filter((selectedId) => selectedId !== id));
    }
  };

  const handleSelectAllNew = (event) => {
    if (event.target.checked) {
      const allIds = newFloorList.map((floor) => floor.FMId);
      setSelectedCheckboxesNew(allIds);
    } else {
      setSelectedCheckboxesNew([]);
    }
  };






const handleDeleteOldFloor = async () => {
    try {
      if (selectedCheckboxes.length === 0) {
        setSnackbarMessage('No items selected for deletion');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }
      // Delete all selected IDs
      const responses = await Promise.all(
        selectedCheckboxes.map((id) => deleteOldFloor(id))
      );
      // :white_check_mark: Only successfully deleted IDs
      const successIds = responses
        .map((res, index) => (res.status === 200 ? selectedCheckboxes[index] : null))
        .filter(Boolean);
      // Update UI
      setOldFloorList(oldFloorList.filter(item => !successIds.includes(item.ID)));
      // Snackbar messages
      if (successIds.length === selectedCheckboxes.length) {
        setReceivedMessage('Floor Id deleted successfully');
        setSnackbarSeverity('success');
      } else if (successIds.length > 0) {
        setReceivedMessage('Some Floor IDs deleted, some failed');
        setSnackbarSeverity('warning');
      } else {
        setReceivedMessage(responses[0]?.message || 'Error deleting selected items');
        setSnackbarSeverity('error');
      }
      setSnackbarMessage(receivedMessage);
      setSnackbarOpen(true);
      setSelectedCheckboxes([]); // Clear selected checkboxes
    } catch (error) {
      console.error('Delete Error:', error.response ? error.response.data : error.message);
      setReceivedMessage('Error deleting selected items');
      setSnackbarMessage('Error deleting selected items');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

const handleDeleteNewFloor = async () => {
    try {
      if (selectedCheckboxesNew.length === 0) {
        setSnackbarMessage('No items selected for deletion');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }
      const responses = await Promise.all(
        selectedCheckboxesNew.map((id) => deleteNewFloor(id))
      );
      // :white_check_mark: get only successfully deleted IDs
      const successIds = responses
        .map((res, index) => (res.status === 200 ? selectedCheckboxesNew[index] : null))
        .filter(Boolean);
      // :white_check_mark: update UI only for successful deletes
      setNewFloorList((prev) =>
        prev.filter((item) => !successIds.includes(item.FMId))
      );
      // Snackbar handling
      if (successIds.length === selectedCheckboxesNew.length) {
        setReceivedMessage('Floor Id deleted successfully');
        setSnackbarSeverity('success');
      } else if (successIds.length > 0) {
        setReceivedMessage('Some Floor IDs deleted, some failed');
        setSnackbarSeverity('warning');
      } else {
        setReceivedMessage(responses[0]?.message || 'Error deleting selected items');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      setSelectedCheckboxesNew([]);
    } catch (error) {
      console.error('Delete Error:', error);
      setReceivedMessage('Error deleting selected items');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
        <MainCard title="Floor Info">
          <Grid item xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="New Floor Info" {...a11yProps(0)} />
                <Tab label="Old Floor Info" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Grid display={'flex'} justifyContent={'center'} mt={3}>
                <Grid item xs={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Floor Name</InputLabel>
                </Grid>
                <Grid item xs={1} ml={2}>
                  <TextField
                    name="FloorID"
                    value={newFloorData.FloorID}
                    onChange={handleNewInputChange}
                    error={!!errors.FloorID}
                    helperText={errors.FloorID}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Grid>
                <Grid item xs={3} ml={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Description</InputLabel>
                </Grid>
                <Grid item xs={3} ml={2}>
                  <TextField
                    name="Description"
                    value={newFloorData.Description}
                    onChange={handleNewInputChange}
                    error={!!errors.Description}
                    helperText={errors.Description}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Grid>
              </Grid>
              <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
                <Grid item>
                  <Button variant="contained" color="success" onClick={handleNewSaveClick} disabled={accessLevel < 3}>
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleClearClick} disabled={accessLevel < 3}>
                    Clear
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="error" onClick={handleDeleteNewFloor} disabled={accessLevel < 4}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TableContainer sx={{ mt: 3, width: '60%', height: '200px',overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                        <TableCell sx={{ width: '1vw' }}>
                          <Checkbox
                            indeterminate={indeterminateNew}
                            checked={allCheckedNew}
                            onChange={handleSelectAllNew}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>{' '}
                        <TableCell>Edit</TableCell>
                        <TableCell>Floor</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {newFloorList &&
                        newFloorList.map((floor) => (
                          <TableRow key={floor.FMId}>
                            <TableCell>
                              <Checkbox
                                checked={selectedCheckboxesNew.includes(floor.FMId)}
                                onChange={(event) => handleNewCheckboxChange(event, floor.FMId)}
                                disabled={accessLevel < 3}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color={newFloorData.FMId === floor.FMId ? 'success' : 'primary'}
                                onClick={() => handleRowClick(floor)}
                                disabled={accessLevel < 3}
                              >
                                {newFloorData.FMId === floor.FMId ? <SendOutlined /> : <EditTwoTone />}
                              </IconButton>
                            </TableCell>
                            <TableCell>{floor.FloorID}</TableCell>
                            <TableCell>{floor.Description}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid display={'flex'} justifyContent={'center'} mt={3}>
                <Grid item xs={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Floor Name</InputLabel>
                </Grid>
                <Grid item xs={1} ml={2}>
                  <TextField
                    name="OldFloorID"
                    value={oldFloorData.OldFloorID}
                    onChange={handleOldInputChange}
                    error={!!errors.OldFloorID}
                    helperText={errors.OldFloorID}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Grid>
                <Grid item xs={3} ml={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Description</InputLabel>
                </Grid>
                <Grid item xs={3} ml={2}>
                  <TextField
                    name="OldDescription"
                    value={oldFloorData.OldDescription}
                    onChange={handleOldInputChange}
                    error={!!errors.OldDescription}
                    helperText={errors.OldDescription}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Grid>
              </Grid>
              <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
                <Grid item>
                  <Button variant="contained" color="success" onClick={handleOldSaveClick} disabled={accessLevel < 3}>
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleOldClearClick} disabled={accessLevel < 3}>
                    Clear
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="error" onClick={handleDeleteOldFloor} disabled={accessLevel < 4}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TableContainer sx={{ mt: 3, width: '60%', height: '200px',overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow  sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                        <TableCell sx={{ width: '1vw' }}>
                          <Checkbox
                            indeterminate={indeterminate}
                            checked={allChecked}
                            onChange={handleSelectAll}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>{' '}
                        <TableCell>Edit</TableCell>
                        <TableCell sx={{ pl: 3 }}>Floor</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {oldFloorList &&
                        oldFloorList.map((floor) => (
                          <TableRow key={floor.ID}>
                            <TableCell>
                              <Checkbox
                                checked={selectedCheckboxes.includes(floor.ID)}
                                onChange={(event) => handleOldCheckboxChange(event, floor.ID)}
                                disabled={accessLevel < 3}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color={oldFloorData.ID === floor.ID ? 'success' : 'primary'}
                                onClick={() => handleOldRowClick(floor)}
                                disabled={accessLevel < 3}
                              >
                                {oldFloorData.ID === floor.ID ? <SendOutlined /> : <EditTwoTone />}
                              </IconButton>
                            </TableCell>
                            <TableCell>{floor.OldFloorID}</TableCell>
                            <TableCell>{floor.OldDescription}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>
          </Grid>
        </MainCard>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} sx={{ width: '100%' }} severity={snackbarSeverity} variant="filled">
          {receivedMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Floor;
