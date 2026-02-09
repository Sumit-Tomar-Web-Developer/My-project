// material-ui
import {
  Grid,
  Snackbar,
  IconButton,
  Checkbox,
  Alert,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Box, Tab, Tabs, Typography, Button } from '@mui/material';
import { useEffect } from 'react';
import {
  createNewConstruction,
  createOldConstruction,
  deleteNewConstructionInfo,
  deleteOldConstructionInfo,
  fetchConstructionType,
  fetchOldConstructionTypes
} from 'services/construction.services.js';
import * as Yup from 'yup';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

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

function ConstructionType() {
  const [value, setValue] = useState(0);
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in constr  page');
  }, [userData])
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //backend
  const [ConstructionId, setConstructionId] = useState('');
  const [Description, setDescription] = useState('');
  const [constructionTypeList, setConstructionTypeList] = useState([]);
  const [OldConstructionId, setOldConstructionId] = useState('');
  const [OldDescription, setOldDescription] = useState('');
  const [oldconstructionTypeList, setOldConstructionTypeList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [errors, setErrors] = useState({});
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedRowsNew, setSelectedRowsNew] = useState([]);
  const [selectedRowsOld, setSelectedRowsOld] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openOldDeleteDialog, setOpenOldDeleteDialog] = useState(false);

  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const [selectedCheckboxesNew, setSelectedCheckboxesNew] = useState([]);
  const [indeterminateNew, setIndeterminateNew] = useState(false);
  const [allCheckedNew, setAllCheckedNew] = useState(false);
  const [newConstructionData, setNewConstructionData] = useState({
    ConstructionId: '',
    Description: '',
    CTMId: 0
  });
  const [OldConstructionData, setOldConstructionData] = useState({
    OldConstructionId: '',
    OldDescription: '',
    OldID: 0
  });

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Construction Type';
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

      console.log(access, 'assigned access to Prime Apply Taxes Page');

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

  //new Construction
  useEffect(() => {
    const fetchConstructions = async () => {
      try {
        const fetchConstTypes = await fetchConstructionType();
        setConstructionTypeList(fetchConstTypes.data);
        console.log('new Construction List', fetchConstTypes);
      } catch (error) {
        console.error('Error fetching Construction List:', error);
      }
    };
    fetchConstructions();
  }, []);
  // old construction
  useEffect(() => {
    const fetchOldConstructions = async () => {
      try {
        const fetchConstTypes = await fetchOldConstructionTypes();
        setOldConstructionTypeList(fetchConstTypes.data);
        console.log('old Construction List', fetchConstTypes);
      } catch (error) {
        console.error('Error fetching Construction List:', error);
      }
    };
    fetchOldConstructions();
  }, []);
  //checkbox old
  useEffect(() => {
    const totalSelected = selectedCheckboxes.length;
    const totalCheckboxes = oldconstructionTypeList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedCheckboxes, oldconstructionTypeList]);

  //checkbox new
  useEffect(() => {
    const totalSelected = selectedCheckboxesNew.length;
    const totalCheckboxes = constructionTypeList.length;
    setAllCheckedNew(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminateNew(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedCheckboxesNew, constructionTypeList]);

  // Validation schemas
  const newConstructionSchema = Yup.object().shape({
    ConstructionId: Yup.string().required('Construction Id is required'),
    Description: Yup.string().required('Description is required')
  });

  const handleRowClick = (construction) => {
    setSelectedRow(construction);
    setNewConstructionData({
      CTMId: construction.CTMId,

      ConstructionId: construction.ConstructionId,
      Description: construction.Description
    });
  };

  // Function to handle adding a new construction

  const handleNewSaveClick = async () => {
    try {
      const ConstructionDataToSave = {
        ...newConstructionData,
        CTMId: newConstructionData.CTMId || 0,
        UserID: userData?.UserID || 1
      };
      console.log(ConstructionDataToSave.CTMId, 'before id');

      // Validate the data before attempting to save
      await newConstructionSchema.validate(ConstructionDataToSave, { abortEarly: false });

      let response;

      if (ConstructionDataToSave.CTMId === 0) {
        // Creating a new construction
        console.log(ConstructionDataToSave.CTMId, 'id');
        response = await createNewConstruction(ConstructionDataToSave);
        console.log(response, 'success new Construction saved');
        if (response.status === 200 || response.status === 201) {
          // Successful creation
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Construction saved successfully');
          setSnackbarOpen(true);
          setConstructionTypeList([...constructionTypeList, response.res.data.construction]);

          handleClearClick();
        } else {
          // Handle error response from server
          throw new Error(response.message || 'An error occurred while saving new construction');
        }
      } else {
        // Updating an existing construction
        response = await createNewConstruction(ConstructionDataToSave);
        console.log(response, 'success Construction updated');
        if (response.status === 200 || response.status === 201) {
          // Successful update
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Construction updated successfully');
          setSnackbarOpen(true);
          // Update local list with updated construction
          const updatedList = constructionTypeList.map((con) =>
            con.CTMId === response.res.data.construction.CTMId ? response.res.data.construction : con
          );
          setConstructionTypeList(updatedList);
          handleClearClick();
        } else {
          // Handle error response from server
          throw new Error(response.message || 'An error occurred while updating construction');
        }
      }
    } catch (error) {
      if (error.response) {
        setSnackbarOpen(true);
        setReceivedMessage(error.response.message || 'Cannot enter duplicate construction Id');
        setSnackbarSeverity('error');
        setSnackbarMessage(error.response.message || 'Cannot enter duplicate construction Id');
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
  const handleDeleteClick = () => {
    if (selectedCheckboxesNew.length === 0) {
      setSnackbarMessage('No items selected for deletion');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    // Open the confirmation dialog
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = async () => {
    try {
      const responses = await Promise.all(selectedCheckboxesNew.map((id) => deleteNewConstructionInfo(id)));

      const updatedList = constructionTypeList.filter((item) => !selectedCheckboxesNew.includes(item.CTMId));
      setConstructionTypeList(updatedList);

      if (responses.every((response) => response.status === 200)) {
        setReceivedMessage('Construction type deleted successfully');
        setSnackbarMessage('Construction type deleted successfully');
        setSnackbarSeverity('success');
      } else {
        const failedResponses = responses.filter((response) => response.status !== 200);
        setReceivedMessage(failedResponses[0]?.message || 'Error deleting selected items');
        setSnackbarMessage(failedResponses[0]?.message || 'Error deleting selected items');
        setSnackbarSeverity('error');
      }

      setSelectedCheckboxesNew([]);
      setOpenDeleteDialog(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Delete Error:', error.response ? error.response.data : error.message);
      setReceivedMessage('Error deleting selected items');
      setSnackbarMessage('Error deleting selected items');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
    }
  };

  // const handleDeleteClick = async () => {
  //   try {
  //     if (selectedCheckboxesNew.length === 0) {
  //       setSnackbarMessage('No items selected for deletion');
  //       setSnackbarSeverity('warning');
  //       setSnackbarOpen(true);
  //       return;
  //     }

  //     // Create an array of promises with each promise resolving to the response message and status
  //     const responses = await Promise.all(selectedCheckboxesNew.map((id) => deleteNewConstructionInfo(id)));

  //     const updatedList = constructionTypeList.filter((item) => !selectedCheckboxesNew.includes(item.CTMId));
  //     setConstructionTypeList(updatedList);

  //     // Determine the snackbar message and severity based on responses
  //     if (responses.every((response) => response.status === 200)) {
  //       setReceivedMessage('Construction type deleted successfully');
  //       setSnackbarMessage('Construction type deleted successfully');
  //       setSnackbarSeverity('success');
  //     } else {
  //       const failedResponses = responses.filter((response) => response.status !== 200);
  //       if (failedResponses.length > 0) {
  //         setReceivedMessage(failedResponses[0].message);
  //         setSnackbarMessage(failedResponses[0].message);
  //         setSnackbarSeverity('error');
  //       } else {
  //         setReceivedMessage('Error deleting selected items');
  //         setSnackbarMessage('Error deleting selected items');
  //         setSnackbarSeverity('error');
  //       }
  //     }

  //     setSnackbarOpen(true);
  //     setSelectedCheckboxesNew([]);
  //   } catch (error) {
  //     console.error('Delete Error:', error.response ? error.response.data : error.message);
  //     setReceivedMessage('Error deleting selected items');
  //     setSnackbarMessage('Error deleting selected items');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //   }
  // };
  const protectedConstructionIds = ['A', 'B', 'C', 'D', 'E', 'OP', 'F'];

  //clear
  const handleClearClick = () => {
    setNewConstructionData({
      ConstructionId: '',
      Description: '',
      CTMId: '0'
    });
    setErrors({});
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;

    setNewConstructionData({ ...newConstructionData, [name]: value });
    setErrors({});
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Function to handle adding a old construction

  const oldConstructionSchema = Yup.object().shape({
    OldConstructionId: Yup.string().required('Old Construction Id is required'),
    OldDescription: Yup.string().required('Old Description is required')
  });

  const handleOldSaveClick = async () => {
    try {
      const DataToSave = {
        ...OldConstructionData,
        OldID: OldConstructionData.OldID || 0,
        UserID: userData?.UserID || 1

      };

      // Validate the data before attempting to save
      await oldConstructionSchema.validate(DataToSave, { abortEarly: false });
      let response;

      if (DataToSave.OldID === 0) {
        response = await createOldConstruction(DataToSave);

        console.log(response, 'success old construction saved');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Old construction saved successfully');
          setSnackbarOpen(true);
          setOldConstructionTypeList([...oldconstructionTypeList, response.res.data.construction]);
          handleOldClearClick();
        } else {
          throw new Error(response.message || 'An error occurred while saving old construction');
        }
      } else {
        response = await createOldConstruction(DataToSave);

        console.log(response, 'old construction updating');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Old construction updated successfully');
          setSnackbarOpen(true);
          const updatedList = oldconstructionTypeList.map((construction) =>
            construction.OldID === response.res.data.construction.OldID ? response.res.data.construction : construction
          );
          setOldConstructionTypeList(updatedList);
          handleOldClearClick();
        } else {
          throw new Error(response.message || 'An error occurred while updating old construction');
        }
      }
    } catch (error) {
      if (error.response) {
        setSnackbarOpen(true);
        setReceivedMessage(error.response.message || 'Cannot enter duplicate old construction Id');
        setSnackbarSeverity('error');
        setSnackbarMessage(error.response.message || 'Cannot enter duplicate old construction Id');
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

  const handleOldInputChange = (e) => {
    const { name, value } = e.target;
    setOldConstructionData({ ...OldConstructionData, [name]: value });
    setErrors({});
  };

  const handleOldClearClick = () => {
    setOldConstructionData({
      OldConstructionId: '',
      OldDescription: '',
      OldID: 0
    });
    setErrors({});
  };

  const handleOldRowClick = (construction) => {
    setSelectedRow(construction);
    setOldConstructionData({
      OldID: construction.OldID,
      OldConstructionId: construction.OldConstructionId,
      OldDescription: construction.OldDescription
    });
  };
  // const handleOldDeleteClick = async () => {
  //   try {
  //     if (selectedCheckboxes.length === 0) {
  //       setSnackbarMessage('No items selected for deletion');
  //       setSnackbarSeverity('warning');
  //       setSnackbarOpen(true);
  //       return;
  //     }

  //     const responses = await Promise.all(selectedCheckboxes.map(id => deleteOldConstructionInfo(id)));
  //     const updatedList = oldConstructionTypeList.filter(item => !selectedCheckboxes.includes(item.OldID));

  //     setOldConstructionTypeList(updatedList);

  //     if (responses.every(response => response.status === 200)) {
  //       setReceivedMessage('Old Construction type deleted successfully');
  //       setSnackbarMessage('Construction type deleted successfully');
  //       setSnackbarSeverity('success');
  //     } else {
  //       const failedResponses = responses.filter(response => response.status !== 200);
  //       if (failedResponses.length > 0) {
  //         setReceivedMessage(failedResponses[0].message);
  //         setSnackbarMessage(failedResponses[0].message);
  //         setSnackbarSeverity('error');
  //       } else {
  //         setReceivedMessage('Error deleting selected items');

  //         setSnackbarMessage('Error deleting selected items');
  //         setSnackbarSeverity('error');
  //       }
  //     }

  //     setSnackbarOpen(true);
  //     setSelectedCheckboxes([]);
  //   } catch (error) {
  //     console.error('Delete Error:', error.response ? error.response.data : error.message);
  //     setSnackbarMessage('Error deleting selected items');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //   }
  // };

  //checkbox old

  const handleOldDeleteClick = () => {
    if (selectedCheckboxes.length === 0) {
      setSnackbarMessage('No items selected for deletion');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    // Open confirmation dialog
    setOpenOldDeleteDialog(true);
  };

  const handleConfirmOldDelete = async () => {
    try {
      const responses = await Promise.all(
        selectedCheckboxes.map((id) => deleteOldConstructionInfo(id))
      );

      const updatedList = oldconstructionTypeList.filter(
        (item) => !selectedCheckboxes.includes(item.OldID)
      );
      setOldConstructionTypeList(updatedList);

      setSnackbarMessage('Selected old construction types deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setSelectedCheckboxes([]);
      setOpenOldDeleteDialog(false);
    } catch (error) {
      console.error('Delete Error:', error);
      setSnackbarMessage('Error deleting selected items');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setOpenOldDeleteDialog(false);
    }
  };

  const handleOldCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedCheckboxes((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedCheckboxes((prevSelected) => prevSelected.filter((selectedId) => selectedId !== id));
    }
  };

  //checkbox old
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = oldconstructionTypeList.map((construction) => construction.OldID);
      setSelectedCheckboxes(allIds);
    } else {
      setSelectedCheckboxes([]);
    }
  };

  //checkbox new
  // const handleNewCheckboxChange = (event, id) => {
  //   if (event.target.checked) {
  //     setSelectedCheckboxesNew((prevSelected) => [...prevSelected, id]);
  //   } else {
  //     setSelectedCheckboxesNew((prevSelected) => prevSelected.filter((selectedId) => selectedId !== id));
  //   }
  // };

  // const handleSelectAllNew = (event) => {
  //   if (event.target.checked) {
  //     const allIds = constructionTypeList.map((construction) => construction.CTMId);
  //     setSelectedCheckboxesNew(allIds);
  //   } else {
  //     setSelectedCheckboxesNew([]);
  //   }
  // };
  //checkbox new
  const handleNewCheckboxChange = (event, ctmId, constructionId) => {
    if (protectedConstructionIds.includes(constructionId)) {
      setSnackbarMessage("You can't delete this row");
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return; // Prevent selection
    }

    if (event.target.checked) {
      setSelectedCheckboxesNew(prev => [...prev, ctmId]);
    } else {
      setSelectedCheckboxesNew(prev => prev.filter(id => id !== ctmId));
    }
  };




  const handleSelectAllNew = (event) => {
    if (event.target.checked) {
      const allIds = constructionTypeList
        .filter(construction => !protectedConstructionIds.includes(construction.ConstructionId))
        .map(construction => construction.CTMId);
      setSelectedCheckboxesNew(allIds);
    } else {
      setSelectedCheckboxesNew([]);
    }
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
        <MainCard title="Construction Type">
          <Grid item xs={2}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="New Construction Type" iconPosition="end" {...a11yProps(0)} />
                <Tab label="Old Construction Type" />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Grid display={'flex'} justifyContent={'center'} mt={3}>
                <Grid item xs={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Construction ID</InputLabel>
                </Grid>
                <Grid item xs={1} ml={2}>
                  <TextField
                    value={newConstructionData.ConstructionId}
                    name="ConstructionId"
                    error={!!errors.ConstructionId}
                    helperText={errors.ConstructionId}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    onChange={handleNewInputChange}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Grid>
                <Grid item xs={3} ml={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Description</InputLabel>
                </Grid>
                <Grid item xs={3} ml={2}>
                  <TextField
                    value={newConstructionData.Description}
                    name="Description"
                    error={!!errors.Description}
                    helperText={errors.Description}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    onChange={handleNewInputChange}
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
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteClick}
                    disabled={selectedCheckboxesNew.some(
                      id => protectedConstructionIds.includes(
                        constructionTypeList.find(c => c.CTMId === id)?.ConstructionId
                      )
                    )}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TableContainer sx={{ mt: 3, width: '50%', height: '200px', overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{
                        width: '1vw',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10   
                      }}>
                        <TableCell >
                          <Checkbox
                            indeterminate={indeterminateNew}
                            checked={allCheckedNew}
                            onChange={handleSelectAllNew}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell >Edit</TableCell>
                        <TableCell sx={{
                          pl: 3,

                        }}>Construction Id</TableCell>
                        <TableCell >Description</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {constructionTypeList.map((construction) => (
                        <TableRow key={construction.CTMId}>
                          {/* <TableCell>
                            <Checkbox
                              checked={selectedRowsNew.some((row) => row.CTMId === construction.CTMId)}
                              onChange={(e) => handleNewFloorCheckboxChange(e, construction)}
                            />
                          </TableCell> */}
                          <TableCell>
                            <Checkbox
                              checked={selectedCheckboxesNew.includes(construction.CTMId)}
                              onChange={(event) =>
                                handleNewCheckboxChange(event, construction.CTMId, construction.ConstructionId)
                              }
                              disabled={accessLevel < 3} // allow click for showing snackbar
                            />


                          </TableCell>
                          <TableCell>
                            <IconButton
                              color={newConstructionData.CTMId === construction.CTMId ? 'success' : 'primary'}
                              onClick={() => handleRowClick(construction)}
                              disabled={accessLevel < 3}
                            >
                              {newConstructionData.CTMId === construction.CTMId ? <SendOutlined /> : <EditTwoTone />}
                            </IconButton>
                          </TableCell>
                          <TableCell>{construction.ConstructionId}</TableCell>
                          <TableCell>{construction.Description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                  <DialogTitle>    <Typography color="error">Confirm Deletion</Typography>
                  </DialogTitle>
                  <DialogContent>
                    <Typography>Are you sure you want to delete?</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button style={{ backgroundColor: "black", color: "#fff" }} onClick={() => setOpenDeleteDialog(false)} color="secondary">
                      Cancel
                    </Button>
                    <Button style={{ backgroundColor: "red", color: "#fff" }} onClick={handleConfirmDelete} color="error">
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>

              </Box>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Grid display={'flex'} justifyContent={'center'} mt={3}>
                <Grid item xs={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Construction ID</InputLabel>
                </Grid>
                <Grid item xs={1} ml={2}>
                  <TextField
                    value={OldConstructionData.OldConstructionId}
                    name="OldConstructionId"
                    error={!!errors.OldConstructionId}
                    helperText={errors.OldConstructionId}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    onChange={handleOldInputChange}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Grid>
                <Grid item xs={3} ml={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Description</InputLabel>
                </Grid>
                <Grid item xs={3} ml={2}>
                  <TextField
                    value={OldConstructionData.OldDescription}
                    name="OldDescription"
                    error={!!errors.OldDescription}
                    helperText={errors.OldDescription}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    onChange={handleOldInputChange}
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
                  <Button variant="contained" color="error" onClick={handleOldDeleteClick} disabled={accessLevel < 4}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TableContainer sx={{ mt: 3, width: '50%', height: '200px', overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead >
                      <TableRow sx={{
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
                        </TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell sx={{ pl: 3 }}>Construction Id</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {oldconstructionTypeList.map((construction) => (
                        <TableRow key={construction.OldID}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCheckboxes.includes(construction.OldID)}
                              onChange={(event) => handleOldCheckboxChange(event, construction.OldID)}
                              disabled={accessLevel < 3}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color={OldConstructionData.OldID === construction.OldID ? 'success' : 'primary'}
                              onClick={() => handleOldRowClick(construction)}
                              disabled={accessLevel < 3}
                            >
                              {OldConstructionData.OldID === construction.OldID ? <SendOutlined /> : <EditTwoTone />}
                            </IconButton>
                          </TableCell>
                          <TableCell>{construction.OldConstructionId}</TableCell>
                          <TableCell>{construction.OldDescription}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* New Construction Delete Dialog */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogContent>
                    <Typography>Are you sure you want to delete selected construction types?</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Old Construction Delete Dialog */}
                <Dialog open={openOldDeleteDialog} onClose={() => setOpenOldDeleteDialog(false)}>
                  <DialogTitle>

                    <Typography color="error">Confirm Deletion</Typography>
                  </DialogTitle>
                  <DialogContent>
                    <Typography>Are you sure you want to delete?</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button style={{ backgroundColor: "black", color: "#fff" }} onClick={() => setOpenOldDeleteDialog(false)} color="secondary">
                      Cancel
                    </Button>
                    <Button style={{ backgroundColor: "red", color: "#fff" }} onClick={handleConfirmOldDelete} >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>

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
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ConstructionType;




