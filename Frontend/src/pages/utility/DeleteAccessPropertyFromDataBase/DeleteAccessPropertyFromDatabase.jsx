// material-ui
import {
  Checkbox,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  Stack,
  TextField,
  Typography,
  RadioGroup,
  Snackbar,
  SnackbarContent,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@mui/material';
import React, { useEffect, useState } from 'react';
// project import
import MainCard from 'components/MainCard';

import { fetchPropertyRange } from 'services/appeal.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import {
  getOwnerNames,
  getPropertyRangeFromAndTo
} from 'services/utlilityService/updatePropertyDetailsService/updatePropertyDetailsService';
import { deleteAccessProperty } from 'services/deleteAccessProperty/deleteAccessPropertyService';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

// ==============================|| SAMPLE PAGE ||============================== //

function DeleteAccessPropertyFromDatabase() {
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Delete Excess Property';
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
      console.log(access, 'assigned access to Delete Access Property Page');
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
  // ward
  const [selectedValue, setSelectedValue] = useState();

  // const handleSelectChange = (event) => {
  //   setSelectedValue(event.target.value);

  // };
  //select proeprty
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const handleNumberChange = (event) => {
    setSelectedNumbers(event.target.value);
  };
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  //select proeprty
  const [selectedNumbersProp, setSelectedNumbersProp] = useState([]);

  const handleNumberChangeProp = (event) => {
    setSelectedNumbersProp(event.target.value);
  };
  // const numbersProp = [1, 2, 3, 4, 5,6,7,8,9];
  //model
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickDialog = () => {
    if (!validateInputs()) {
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //
  const [selectedWard, setSelectedWard] = useState(0);

  const [selectedOverlay, setSelectedOverlay] = useState(null);

  const handleRadioChange = (e) => {
    const radioId = e.target.id;
    if (radioId === 'singleProperty') {
      setSelectedOverlay('singleProperty');
    } else if (radioId === 'propertyRange') {
      setSelectedOverlay('propertyRange');
    } else {
      setSelectedOverlay(null);
    }
  };

  // backend

  const [wardList, setwardList] = useState([]);
  const [propertyNoListTo, setpropertyNoListTo] = useState([]);
  const [propertyNoList, setPropertyNoList] = useState([]);
  const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const [propertyNoListFrom, setpropertyNoListFrom] = useState([]);
  const [selectedPropertyNoFroms, setSelectedPropertyNoFroms] = useState('');
  const [propertyNoListFroms, setpropertyNoListFroms] = useState([]);
  const [selectedPropertyNoTos, setSelectedPropertyNoTos] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [password, setPassword] = useState('');
  const [propertyRangeList, setpropertyRangeList] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  useEffect(() => {
    if (propertyRangeList.length === 0) {
      setSelectAll(false);
    }
  }, [propertyRangeList]);

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        const wardlist = await fetchWards();
        const sortedWardList = wardlist.sort((a, b) => a.NewWardNo - b.NewWardNo); // Sort by NewWardNo in ascending order
        console.log('Sorted wardList:', sortedWardList);
        setwardList(sortedWardList);
        setwardListProperty(sortedWardList);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchWardList();
  }, []);

  useEffect(() => {
    const fetchOwnerNames = async () => {
      if (selectedWard && selectedPropertyNoFrom) {
        try {
          const response = await getOwnerNames(selectedWard, selectedPropertyNoFrom);
          console.log('Fetched owner names:', response);
        } catch (error) {
          console.error('Failed to fetch owner names:', error);
        }
      }
    };

    fetchOwnerNames();
  }, [selectedWard, selectedPropertyNoFrom]);

  useEffect(() => {
    const fetchOwnerNames = async () => {
      try {
        const response = getOwnerNames(selectedWard, selectedPropertyNoFroms, selectedPropertyNoTos);
        console.log('Sorted wardList:', response);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchOwnerNames();
  }, []);

  //select ALl
  // useEffect(() => {
  //   const fetchPropertyRangeList = async () => {
  //     try {
  //       if (selectedWard && selectedPropertyNoFroms && selectedPropertyNoTos) {
  //         const propertyRange = await getPropertyRangeFromAndTo(selectedWard, selectedPropertyNoFroms, selectedPropertyNoTos);
  //         setpropertyRangeList(propertyRange);
  //       } else {
  //         setpropertyRangeList([]);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch propertyRange:', error);
  //     }
  //   };

  //   fetchPropertyRangeList();
  // }, [selectedWard, selectedPropertyNoFroms, selectedPropertyNoTos]);
  useEffect(() => {
    const fetchPropertyRangeList = async () => {
      try {
        if (selectedWard && selectedPropertyNoFroms && selectedPropertyNoTos) {
          const propertyRange = await getPropertyRangeFromAndTo(
              selectedWard,
              selectedPropertyNoFroms,
              selectedPropertyNoTos
          );
          
          // Sort ascending by NewPropertyNo
          const sortedRange = propertyRange.slice().sort((a, b) => a.NewPropertyNo - b.NewPropertyNo);
          setpropertyRangeList(sortedRange);
        } else {
          setpropertyRangeList([]);
        }
      } catch (error) {
        console.error('Failed to fetch propertyRange:', error);
      }
    };

    fetchPropertyRangeList();
}, [selectedWard, selectedPropertyNoFroms, selectedPropertyNoTos]);

  // const handleWardChange = async (event) => {
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
  const handleWardChange = async (event) => {
    const ward = event.target.value;
    setSelectedWard(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);

      // Sort ascending by NewPropertyNo
      const sortedFrom = propertyRange.properties.slice().sort((a, b) => a.NewPropertyNo - b.NewPropertyNo);
      const sortedTo = propertyRange.properties.slice().sort((a, b) => a.NewPropertyNo - b.NewPropertyNo);

      setpropertyNoListFrom(sortedFrom);
      setpropertyNoListTo(sortedTo);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
};

  const ClearWard = () => {
    setSelectedWard('');
    setSelectedPropertyNoFrom(''), setSelectedPropertyNoFroms(''), setSelectedPropertyNoTos('');
  };

  const handlePropertyChangeFrom = (e) => {
    const selectedValue = e.target.value;
    console.log('Selected NewPropertyNo:', selectedValue);

    setSelectedPropertyNoFrom(selectedValue);

    const selectedProperty = propertyNoListFrom.find((property) => property.NewPropertyNo === selectedValue);

    console.log('Selected Property:', selectedProperty);

    if (selectedProperty) {
      setOwnerIds((prevOwnerIds) => {
        if (!prevOwnerIds.includes(selectedProperty.OwnerID)) {
          console.log('Updating ownerIds with:', selectedProperty.OwnerID);
          return [selectedProperty.OwnerID];
        }
        return prevOwnerIds;
      });
    }
  };

  const handlePropertyChangeFroms = (e) => {
    const selectedValue = e.target.value;
    console.log('Selected NewPropertyNo:', selectedValue);

    setSelectedPropertyNoFroms(selectedValue);

    const selectedProperty = propertyNoListFrom.find((property) => property.NewPropertyNo === selectedValue);

    console.log('Selected Property:', selectedProperty);

    if (selectedProperty) {
      setOwnerIds((prevOwnerIds) => {
        if (!prevOwnerIds.includes(selectedProperty.OwnerID)) {
          console.log('Updating ownerIds with:', selectedProperty.OwnerID);
          return [selectedProperty.OwnerID];
        }
        return prevOwnerIds;
      });
    }
  };

  const handlePropertyChangeTo = async (e) => {
    setSelectedPropertyNoTos(e.target.value);
  };
  const [ownerIds, setOwnerIds] = useState([]);
  useEffect(() => {
    if (ownerIds.length > 0) {
      handleDelete();
    }
  }, [ownerIds]);

  //select all
  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    if (checked) {
      // When "Select All" is checked, add all property owner IDs to the array
      const allOwnerIds = propertyRangeList.map((property) => property.OwnerID);
      setOwnerIds(allOwnerIds); // Update ownerIds to include all properties
    } else {
      // If "Select All" is unchecked, clear the ownerIds array
      setOwnerIds([]);
    }
  };

  const handlePropertySelectChange = (event, property) => {
    const checked = event.target.checked;
    const propertyOwnerId = property.OwnerID;
    console.log(property.OwnerID, 'ownerid');
    // Use the previous state when updating ownerIds to ensure correct updates
    setOwnerIds((prevOwnerIds) => {
      let newOwnerIds = [...prevOwnerIds];
      if (checked) {
        // Add the selected property's OwnerID to the ownerIds array if checked
        newOwnerIds.push(propertyOwnerId);
      } else {
        // Remove the OwnerID from the ownerIds array if unchecked
        newOwnerIds = newOwnerIds.filter((id) => id !== propertyOwnerId);
      }

      // If all items are selected, set Select All to true
      if (newOwnerIds.length === propertyRangeList.length) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }

      return newOwnerIds;
    });
  };

  //delete
 ;
  
  //validation
  const validateInputs = () => {
    const newErrors = {};
    if (selectedOverlay === 'singleProperty') {
      if (!selectedPropertyNoFrom) {
        newErrors.selectedPropertyNoFrom = 'Property From is required.';
      }
    }
    if (selectedOverlay === 'propertyRange') {
      if (!selectedPropertyNoFroms) {
        newErrors.selectedPropertyNoFroms = 'Property From is required.';
      }
      if (!selectedPropertyNoTos) {
        newErrors.selectedPropertyNoTos = 'Property To is required.';
      }
    }

    setErrors(newErrors); // Ensure `errors` is properly updated in state
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = async () => {
    setOpenDialog(false);

    if (!password) {
      return;
    }

    const levelname = 'L5';

    try {
      // Validate password
      const passwordCheckResponse = await levelPassword(levelname, password);
      if (passwordCheckResponse.status !== 200) {
        throw new Error('Invalid password');
      }

      // Proceed with delete
      const deleteResponse = await deleteAccessProperty(ownerIds);
      if (deleteResponse.status === 200) {
        setSnackbarSeverity('success');
        setSnackbarMessage(deleteResponse?.message || 'Delete Property successfully!');
        setSnackbarOpen(true);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(deleteResponse?.message || 'Failed to delete property.');
        setSnackbarOpen(true);
      }
      setPassword('');
    } catch (error) {
      console.error('Error during delete operation:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(error.message || 'An unexpected error occurred.');
      setSnackbarOpen(true);
      setPassword('');
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
        <MainCard title="Delete Access Property From Database">
          <Box sx={{ textAlign: 'center', marginBottom: '1rem', color: 'blue' }}>
            <h3 style={{ margin: 0 }}>Prime Information</h3>
          </Box>
          <Box mb={2}>
            <Grid
              container
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <Grid item xs={12} sm={3}>
                <InputLabel sx={{ display: 'flex', justifyContent: 'center' }}>Ward No.</InputLabel>
                <Box mt={1}>
                  <FormControl sx={{ width: '100%', mt: '2' }}>
                    <InputLabel> Select Ward No.</InputLabel>

                    <Select
                      id="ward-select"
                      placeholder="ward no"
                      value={selectedWard}
                      onChange={handleWardChange}
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
                      {wardList.map((ward) => (
                        <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                          {ward.NewWardNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={1} mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Stack spacing={1}>
                  <Button variant="contained" color="secondary" onClick={ClearWard} disabled={accessLevel < 3}>
                    Clear
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          {/* 2nd level */}
          {selectedWard !== 0 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={5} lg={6}>
                <Box boxShadow={3} padding>
                  <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                    Properties Range
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={6} sm={11}>
                          <Stack spacing={1}>
                            <RadioGroup value={selectedValue} onChange={handleRadioChange}>
                              <FormControlLabel
                                control={<Radio value="Single Property" name="propertyType" id="singleProperty" />}
                                label="Single Property"
                              />
                              <FormControlLabel
                                control={<Radio name="propertyType" id="propertyRange" value="Property Range" />}
                                label="Property Range"
                              />
                              {/* <FormControlLabel
                            control={<Radio name="propertyType" id="selectedPropertyFromRange" value="Selected Property From Range" />}
                            label="Selected Property From Range"
                          /> */}
                            </RadioGroup>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {selectedOverlay === 'singleProperty' && (
                <Grid item xs={12} md={5} lg={6}>
                  <Box boxShadow={3} padding>
                    <Grid container justifyContent="center" alignItems="center">
                      <Grid
                        container
                        spacing={1}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        <Grid item xs={12} sm={4} mb={9}>
                          <Stack spacing={1}>
                            <InputLabel>Enter Property No</InputLabel>
                            <FormControl fullWidth error={Boolean(errors.selectedPropertyNoFrom)}>
                              <Select
                                id="ward-select"
                                placeholder="Ward No"
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
                              {errors.selectedPropertyNoFrom && <FormHelperText>{errors.selectedPropertyNoFrom}</FormHelperText>}
                            </FormControl>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              {selectedOverlay === 'propertyRange' && (
                <Grid item xs={12} md={5} lg={6}>
                  <Box boxShadow={3} padding>
                    <Grid container justifyContent="center" alignItems="center">
                      <Grid
                        container
                        spacing={1}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        <Grid item xs={12} sm={4} mb={9}>
                          <Stack spacing={1}>
                            <InputLabel>From</InputLabel>
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
                              value={selectedPropertyNoFroms}
                              error={!!errors.selectedPropertyNoFroms} // Error prop
                              onChange={handlePropertyChangeFroms}
                            >
                              {propertyNoListFrom.map((property, index) => (
                                <MenuItem key={index} value={property.NewPropertyNo}>
                                  {property.NewPropertyNo}
                                </MenuItem>
                              ))}
                            </Select>
                            {/* Display error message below the Select component */}
                            {errors.selectedPropertyNoFroms && <FormHelperText error>{errors.selectedPropertyNoFroms}</FormHelperText>}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={4} mb={9}>
                          <Stack spacing={1}>
                            <InputLabel>Till</InputLabel>
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
                              value={selectedPropertyNoTos}
                              onChange={handlePropertyChangeTo}
                              error={!!errors.selectedPropertyNoTos}
                            >
                              {propertyNoListTo.map((property, index) => (
                                <MenuItem key={index} value={property.NewPropertyNo}>
                                  {' '}
                                  {/* Use the correct property name */}
                                  {property.NewPropertyNo}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.selectedPropertyNoTos && <FormHelperText error>{errors.selectedPropertyNoTos}</FormHelperText>}
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={4} mb={9}>
                          <Stack spacing={1}>
                            <Box
                              style={{
                                maxHeight: '130px',
                                overflowY: 'auto',
                                marginTop: '29px',
                                border: '1px solid #ccc'
                              }}
                            >
                              <Box className="form-check">
                                <label htmlFor="select-all">
                                  <Checkbox id="select-all" checked={selectAll} onChange={handleSelectAllChange} />
                                  All
                                </label>
                              </Box>
                              {propertyRangeList &&
                                propertyRangeList.length > 0 && // Check if the array has items
                                propertyRangeList.map((property, index) => (
                                  <Box key={index} className="form-check">
                                    <label htmlFor={`property-${index}`}>
                                      <Checkbox
                                        id={`property-${index}`}
                                        value={property}
                                        checked={ownerIds.includes(property.OwnerID)} // Check if the property is selected
                                        onChange={(event) => handlePropertySelectChange(event, property)} // Update the ownerIds on change
                                      />
                                      {property.NewPropertyNo.toString()}
                                    </label>
                                  </Box>
                                ))}
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12} md={5} lg={12}>
                <Grid container justifyContent="center" alignItems="center">
                  <Stack spacing={1} sx={{ textAlign: 'center' }}>
                    <Button variant="contained" color="error" onClick={handleClickDialog}>
                      Delete Properties
                    </Button>
                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                      <DialogTitle id="alert-dialog-title" color="error" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        Delete Properties
                      </DialogTitle>

                      <DialogContent>
                        <Stack marginBottom={2}>
                          <DialogContentText id="alert-dialog-description">Enter L5 Password</DialogContentText>
                        </Stack>
                        <TextField
                          label="Enter Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          fullWidth
                          required
                        />{' '}
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" color="success" onClick={handleDelete} autoFocus>
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
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <SnackbarContent
                  sx={{
                    backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
                  }}
                  message={snackbarMessage}
                />
              </Snackbar>
            </Grid>
          )}
        </MainCard>
      )}
    </>
  );
}

export default DeleteAccessPropertyFromDatabase;
