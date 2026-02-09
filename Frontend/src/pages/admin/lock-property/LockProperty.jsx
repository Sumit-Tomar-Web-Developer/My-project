// material-ui
import {
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Snackbar,
  SnackbarContent,
  FormHelperText,
  FormControl,
  Autocomplete
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import {
  getLockedUnlockedProperties,
  saveLockedProperties,
  saveUnLockedProperties
} from 'services/AdminServices/lockProperty/lockPropertyService';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { setPageLock } from 'state/reducers/lockProperty/lockPropertySlice.js';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
// ==============================|| SAMPLE PAGE ||============================== //

function LockProperty() {
  const [lockedPropertyList, setLockedPropertyList] = useState([]);
  const [unlockedPropertyList, setUnlockedPropertyList] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const [selectedPropertyNoTo, setSelectedPropertyNoTo] = useState('');
  const [wardList, setWardList] = useState([]);
  const [propertyNoFromList, setPropertyNoFromList] = useState([]);
  const [propertyNoToList, setPropertyNoToList] = useState([]);
  const [unLockedOwnerIds, setUnLockedOwnerIds] = useState([]);
  const [lockedOwnerIds, setLockedOwnerIds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [error, setError] = useState({});

    const [selectedOwnerID, setSelectedOwnerID] = useState('');
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const dispatch = useDispatch();
const normalizePropertyNo = (value) => value?.split('_')[0] ?? '';

  const handleShowClick = async () => {
    try {
      setError({});
      await validationSchema.validate({ selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo }, { abortEarly: false });

      console.log('Selected values lock property page:', selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);

      // remove _partition
    const from = normalizePropertyNo(selectedPropertyNoFrom);
    const to = normalizePropertyNo(selectedPropertyNoTo);
      if (selectedWard && selectedPropertyNoFrom && selectedPropertyNoTo) {

        const propertyRange = await getLockedUnlockedProperties(selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);

        console.log('Fetched Property Range:', propertyRange);
        setUnLockedOwnerIds(propertyRange.unlockedOwnerIds);
        setLockedOwnerIds(propertyRange.lockedOwnerIds);

        if (propertyRange.lockedOwnerIds.length > 0) {
          dispatch(setPageLock(true));
        } else {
          dispatch(setPageLock(false));
        }

        if (propertyRange?.lockedProperties && propertyRange?.unlockedProperties) {
          setLockedPropertyList(propertyRange.lockedProperties);
          setUnlockedPropertyList(propertyRange.unlockedProperties);
        } else {
          console.warn('Property Range does not contain locked/unlocked properties');
          setLockedPropertyList([]);
          setUnlockedPropertyList([]);
        }
      } else {
        console.warn('Incomplete selection for fetching properties');
        setLockedPropertyList([]);
        setUnlockedPropertyList([]);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const formattedErrors = {};
        error.inner.forEach((err) => {
          formattedErrors[err.path] = err.message;
        });

        setError(formattedErrors);
      } else {
        console.error('Failed to fetch properties:', error);
      }
    }
  };

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        const wardlist = await fetchWards();
        const sortedWardList = wardlist.sort((a, b) => a.NewWardNo - b.NewWardNo);
        setWardList(sortedWardList);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchWardList();
  }, []);

  const handleUnLockClick = async () => {
    try {
      if (lockedOwnerIds.length === 0) {
        console.warn('No lockedOwnerIds selected for unlocking.');
        return;
      }
const from = normalizePropertyNo(selectedPropertyNoFrom);
    const to = normalizePropertyNo(selectedPropertyNoTo);
      const response = await saveUnLockedProperties({
        selectedWard,
        from,
        to,
        lockedOwnerIds
      });

      console.log('Unlock Response:', response);

      if (response.status === 201) {
        setSnackbarSeverity('success');
        setReceivedMessage(response.data.message);
        setSnackbarMessage(receivedMessage);
      } else {
        setSnackbarSeverity('error');
        setReceivedMessage(response.data.message);
        setSnackbarMessage(receivedMessage || 'An error occurred while unlocking the property.');
      }

      setSnackbarOpen(true);

      setLockedPropertyList([]);
      setUnlockedPropertyList(response.data.updatedProperties);

      setLockedOwnerIds((prevLockedOwnerIds) => {
        const updatedLockedOwnerIds = prevLockedOwnerIds.filter(
          (id) => !response.data.updatedProperties.map((p) => p.OwnerID).includes(id)
        );

        console.log(updatedLockedOwnerIds, 'updated locked ids after unlock');

        if (updatedLockedOwnerIds.length > 0) {
          dispatch(setPageLock(true));
        } else {
          dispatch(setPageLock(false));
        }

        return updatedLockedOwnerIds;
      });

      // Update unlockedOwnerIds
      setUnLockedOwnerIds((prevUnLockedOwnerIds) => {
        const updatedUnLockedOwnerIds = [...new Set([...prevUnLockedOwnerIds, ...response.data.updatedProperties.map((p) => p.OwnerID)])];
        console.log(updatedUnLockedOwnerIds, 'new unlocked ids');
        return updatedUnLockedOwnerIds;
      });
    } catch (error) {
      console.error('Failed to unlock properties:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to unlock properties.');
      setSnackbarOpen(true);
    }
  };

  const handleLockClick = async () => {
    try {
      if (unLockedOwnerIds.length === 0) {
        console.warn('No OwnerIDs selected for locking.');
        return;
      }
          // remove _partition
    const from = normalizePropertyNo(selectedPropertyNoFrom);
    const to = normalizePropertyNo(selectedPropertyNoTo);

      const response = await saveLockedProperties({
        selectedWard,
        from,
        to,
        unLockedOwnerIds
      });

      console.log(response, 'data');

      if (response.status === 201) {
        setSnackbarSeverity('success');
        setReceivedMessage(response.data.message);
        setSnackbarMessage(receivedMessage || 'Operation successful.');
      } else {
        setSnackbarSeverity('error');
        setReceivedMessage(response.data.message);
        setSnackbarMessage(receivedMessage || 'An error occurred.');
      }

      setSnackbarOpen(true);

      // Move unlocked properties from locked list to locked list
      setLockedPropertyList((prevLocked) => [...prevLocked, ...response.data.updatedProperties]);

      // Correctly update lockedOwnerIds
      setLockedOwnerIds((prevLockedOwnerIds) => {
        const updatedLockedOwnerIds = [...new Set([...prevLockedOwnerIds, ...response.data.updatedProperties.map((p) => p.OwnerID)])];
        console.log(updatedLockedOwnerIds, 'new locked ids');
        if (updatedLockedOwnerIds.length > 0) {
          dispatch(setPageLock(true));
        }
        return updatedLockedOwnerIds;
      });

      // Remove locked properties from the unlocked list
      setUnlockedPropertyList([]);
    } catch (error) {
      console.error('Failed to unlock properties:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to lock properties.');
      setSnackbarOpen(true);
    }
  };

  // const handleWardChange = async (event) => {
  //     const ward = event.target.value;
  //   console.log('Selected Ward:', ward);
  //   setSelectedWard(ward);
  //   // Clear errors related to these fields
  //   setError((prevErrors) => ({
  //     ...prevErrors,
  //     selectedWard: ''
  //   }));
  //   try {
  //     const response = await fetchPropertyRangeByWard(ward);
  //     console.log('propertyRange:', propertyRange);

  //     // Ensure that propertyNoFromList and propertyNoToList are being set
  //     const propertyRange = propertyRange.properties;

  //       // Sort: main property first, then partitions
  //     const sortedProps = propertyRange.sort((a, b) => {
  //       const propA = parseInt(a.NewPropertyNo, 10);
  //       const propB = parseInt(b.NewPropertyNo, 10);

  //       if (propA !== propB) return propA - propB;

  //       const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
  //       const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;
  //       return partA - partB;
  //     });
  //     setPropertyNoFromList(sortedProps);
  //     setPropertyNoToList(sortedProps);

  //     // Optionally reset the selected property numbers when the ward is changed
  //     setSelectedPropertyNoFrom('');
  //     setSelectedPropertyNoTo('');
  //   } catch (error) {
  //     console.error('Failed to fetch propertyRange:', error);
  //   }
  // };

  const handleWardChange = async (event) => {
  const ward = event.target.value;

  setSelectedWard(ward);

  setError((prev) => ({
    ...prev,
    selectedWard: ''
  }));

  try {
    const response = await fetchPropertyRangeByWard(ward);

    // response.properties should contain property list
    const propertyRange = response.properties || [];

    // Sort
    const sortedProps = propertyRange.sort((a, b) => {
      const propA = parseInt(a.NewPropertyNo, 10);
      const propB = parseInt(b.NewPropertyNo, 10);

      if (propA !== propB) return propA - propB;

      const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
      const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;

      return partA - partB;
    });

    setPropertyNoFromList(sortedProps);
    setPropertyNoToList(sortedProps);

    setSelectedPropertyNoFrom('');
    setSelectedPropertyNoTo('');
  } catch (err) {
    console.error('Failed to fetch propertyRange:', err);
  }
};

  const validationSchema = Yup.object({
    selectedWard: Yup.string().required('Ward is required'),
    selectedPropertyNoFrom: Yup.string().required('From Property is required'),
    selectedPropertyNoTo: Yup.string().required('To Property is required')
  });

  const handlePropertyNoToChange = (event) => {
    const value = event.target.value;

    if (selectedPropertyNoFrom && Number(value) < Number(selectedPropertyNoFrom)) {
      setError((prevErrors) => ({
        ...prevErrors,
        selectedPropertyNoTo: 'To Property cannot be less than From Property'
      }));
    } else {
      setError((prevErrors) => ({
        ...prevErrors,
        selectedPropertyNoTo: ''
      }));
      setSelectedPropertyNoTo(value);
    }
  };

  const handlePropertyNoFromChange = (event) => {
    const value = event.target.value;
    setSelectedPropertyNoFrom(value);

    // Clear the error for selectedPropertyNoFrom
    setError((prevErrors) => ({
      ...prevErrors,
      selectedPropertyNoFrom: ''
    }));
  };

  const handlePropertyNoToKeyDown = (event) => {
    const value = event.target.value;

    // Validation check: Ensure 'To Property' is not less than 'From Property'
    if (selectedPropertyNoFrom && Number(value) < Number(selectedPropertyNoFrom)) {
      setError((prevErrors) => ({
        ...prevErrors,
        selectedPropertyNoTo: 'To Property cannot be less than From Property'
      }));
    } else {
      // Clear error if validation passes
      setError((prevErrors) => ({
        ...prevErrors,
        selectedPropertyNoTo: ''
      }));
    }
  };
  return (
    <MainCard title="Lock Ward Wise Property" style={{ color: 'blue', fontWeight: 'bold' }}>
      <Typography sx={{ mb: 1 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
        Property Search{' '}
      </Typography>
      <Grid
        container
        spacing={2.2}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        <Grid item xs={12} sm={2}>
          <InputLabel>Ward</InputLabel>
          <FormControl error={!!error.selectedWard} fullWidth >
            <Select value={selectedWard} onChange={handleWardChange} MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 200,
          minWidth: 80,
          width: 'auto',
        },
      },
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "left",
      },
    }}>
              {wardList.map((ward) => (
                <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                  {ward.NewWardNo}
                </MenuItem>
              ))}
            </Select>
            {error.selectedWard && <FormHelperText>{error.selectedWard}</FormHelperText>}
          </FormControl>
        </Grid>

                          <Grid item xs={2}>
                            <Stack spacing={1}>
                              <InputLabel>Property No.</InputLabel>
                              {/* <Autocomplete
                                options={propertyNoFromList}
                                value={propertyNoFromList.find((x) => x.OwnerID === selectedOwnerID) || null}
                                onChange={(_, selectedOption) => {
                                  if (!selectedOption) {
                                    setSelectedOwnerID(null);
                                    setPropertyNoFromList('');
                                    setPropertyNoToList('');
                                    return;
                                  }
        
                                  console.log('Selected raw option:', selectedOption);
        
                                  // Set main property number
                                  setPropertyNoFromList(selectedOption.NewPropertyNo);
        
                                  
        
                                  // Set OwnerID
                                  setSelectedOwnerID(selectedOption.OwnerID);
        
                                  
                                }}
                                inputValue={propertyNoFromList} // ✅ controls what is displayed in the input
                                onInputChange={(_, newInput) => {
                                  setSelectedPropertyNoFrom(newInput);
                                }}
                                isOptionEqualToValue={(a, b) => a?.OwnerID === b?.OwnerID}
                                getOptionLabel={(o) =>
                                  o.NewPartitionNo
                                    ? `${o.NewPropertyNo}_${o.NewPartitionNo}` // show in dropdown
                                    : o.NewPropertyNo
                                }
                                renderOption={(props, option) => (
                                  <li {...props} key={option.OwnerID}>
                                    {option.NewPartitionNo ? `${option.NewPropertyNo}_${option.NewPartitionNo}` : option.NewPropertyNo}
                                  </li>
                                )}
                                renderInput={(params) => (
                                  <TextField {...params} variant="outlined" placeholder="Property No" fullWidth disabled={accessLevel < 3} />
                                )}
                                ListboxProps={{ style: { maxHeight: 150, overflowY: 'auto' } }}
                              /> */}
                              <Autocomplete
  options={propertyNoFromList}

  // VALUE MUST BE OBJECT
  value={
    propertyNoFromList.find(
      (o) => 
        (o.NewPartitionNo
          ? `${o.NewPropertyNo}_${o.NewPartitionNo}`
          : o.NewPropertyNo
        ) === selectedPropertyNoFrom
    ) || null
  }

  // INPUT VALUE MUST BE STRING
  inputValue={selectedPropertyNoFrom}

  onChange={(_, option) => {
    if (!option) {
      setSelectedPropertyNoFrom('');
      return;
    }

    setSelectedPropertyNoFrom(
      option.NewPartitionNo
        ? `${option.NewPropertyNo}_${option.NewPartitionNo}`
        : option.NewPropertyNo
    );
  }}

  onInputChange={(_, value) => {
    setSelectedPropertyNoFrom(value);
  }}

  getOptionLabel={(o) =>
    o?.NewPartitionNo
      ? `${o.NewPropertyNo}_${o.NewPartitionNo}`
      : o?.NewPropertyNo || ''
  }

  renderInput={(params) => (
    <TextField {...params}  />
  )}
/>

                            </Stack>
                          </Grid>
        {/* <Grid item xs={12} sm={2}>
          <InputLabel>From Property</InputLabel>
          <FormControl error={!!error.selectedPropertyNoFrom} fullWidth>
            <Select value={selectedPropertyNoFrom} onChange={handlePropertyNoFromChange} MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 200,
          minWidth: 80,
          width: 'auto',
        },
      },
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "left",
      },
    }}>
              {propertyNoFromList.map((property, index) => (
                <MenuItem key={index} value={property.NewPropertyNo}>
                  {property.NewPropertyNo}
                </MenuItem>
              ))}
            </Select>

            {error.selectedPropertyNoFrom && <FormHelperText>{error.selectedPropertyNoFrom}</FormHelperText>}
          </FormControl>
        </Grid> */}
        <Grid item xs={12} sm={2}>
          {' '}
          <InputLabel>To Property</InputLabel>
          {/* <FormControl error={!!error.selectedPropertyNoTo} fullWidth>
            <Select value={selectedPropertyNoTo} onChange={handlePropertyNoToChange} MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 200,
          minWidth: 80,
          width: 'auto',
        },
      },
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "left",
      },
    }}>
              {propertyNoToList.map((property, index) => (
                <MenuItem key={index} value={property.NewPropertyNo}>
                  {property.NewPropertyNo}
                </MenuItem>
              ))}
            </Select>
            {error.selectedPropertyNoTo && <FormHelperText>{error.selectedPropertyNoTo}</FormHelperText>}
          </FormControl> */}
          <Autocomplete
  options={propertyNoToList}

  // VALUE MUST BE OBJECT
  value={
    propertyNoToList.find(
      (o) =>
        (o.NewPartitionNo
          ? `${o.NewPropertyNo}_${o.NewPartitionNo}`
          : o.NewPropertyNo
        ) === selectedPropertyNoTo
    ) || null
  }

  // STRING STATE
  inputValue={selectedPropertyNoTo}

  onChange={(_, option) => {
    if (!option) {
      setSelectedPropertyNoTo('');
      return;
    }

    setSelectedPropertyNoTo(
      option.NewPartitionNo
        ? `${option.NewPropertyNo}_${option.NewPartitionNo}`
        : option.NewPropertyNo
    );
  }}

  onInputChange={(_, value) => {
    setSelectedPropertyNoTo(value);
  }}

  getOptionLabel={(o) =>
    o?.NewPartitionNo
      ? `${o.NewPropertyNo}_${o.NewPartitionNo}`
      : o?.NewPropertyNo || ''
  }

  renderInput={(params) => (
    <TextField {...params}  />
  )}
/>

        </Grid>

        <Grid item xs={12} sm={1} mt={3}>
          <Stack spacing={1}>
            <Button variant="contained" color="success" onClick={handleShowClick}>
              Show
            </Button>{' '}
          </Stack>
        </Grid>
      </Grid>

      <Box mb={1} mt={2}>
        <hr />
      </Box>
      {/* table */}
      <MainCard>
        <Typography sx={{ mb: 1 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
          Lock Property List{' '}
        </Typography>

        <Grid
          container
          spacing={2.2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid container spacing={2}>
            {/* Locked Properties Table */}
            <Grid item xs={12} sm={5}>
              <div className="card" style={{ marginTop: '6px' }}>
                <Card>
                  <CardContent>
                    <Typography sx={{ mb: 1 }} variant="h5" style={{ fontWeight: 'bold' }}>
                      Locked Properties
                    </Typography>

                    <Grid item xs={10} sm={2} sx={{ mb: 1 }}>
                      <Stack spacing={0}>
                        <Button variant="contained" color="info" onClick={handleUnLockClick}>
                          Unlock
                        </Button>
                      </Stack>
                    </Grid>

                    <Box sx={{ overflowX: 'auto', height: '350px' }}>
                      <Table>
                        {/* Table Header */}
                        <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                          <TableRow>
                            <TableCell>Ward No.</TableCell>
                            <TableCell>Property No.</TableCell>
                            <TableCell>Partition No.</TableCell>
                            <TableCell>Lock Status</TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                          {lockedPropertyList.length > 0 ? (
                            lockedPropertyList.map((property) => {
                              console.log('Rendering Property:', property);
                              console.log('Type of isPropertyLock:', typeof property.isPropertyLock); // Debugging log
                              return (
                                <TableRow key={property.NewWardNo}>
                                  <TableCell>{property.NewWardNo}</TableCell>
                                  <TableCell>{property.NewPropertyNo}</TableCell>
                                  <TableCell>{property.NewPartitionNo}</TableCell>
                                  <TableCell>{property.isPropertyLock ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                No properties locked.
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

            {/* Unlocked Properties Table */}
            <Grid item xs={12} sm={5}>
              <div className="card" style={{ marginTop: '6px' }}>
                <Card>
                  <CardContent>
                    <Typography sx={{ mb: 1 }} variant="h5" style={{ fontWeight: 'bold' }}>
                      Unlocked Properties
                    </Typography>

                    <Grid item xs={10} sm={2} sx={{ mb: 1 }}>
                      <Stack spacing={0}>
                        <Button variant="contained" color="warning" onClick={handleLockClick}>
                          Lock
                        </Button>
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
                      </Stack>
                    </Grid>

                    <Box sx={{ overflowX: 'auto', height: '350px' }}>
                      <Table>
                        {/* Table Header */}
                        <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                          <TableRow>
                            <TableCell>Ward No.</TableCell>
                            <TableCell>Property No.</TableCell>
                            <TableCell>Partition No.</TableCell>
                            <TableCell>Lock Status</TableCell>
                          </TableRow>
                        </TableHead>
                        {/* Table Body */}
                        <TableBody>
                          {unlockedPropertyList.map((property) => (
                            <TableRow key={property.propertyNo}>
                              <TableCell>{property.NewWardNo}</TableCell>
                              <TableCell>{property.NewPropertyNo}</TableCell>
                              <TableCell>{property.NewPartitionNo}</TableCell>
                              <TableCell>{property.isPropertyLock ? 'Yes' : 'No'}</TableCell>
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
        </Grid>

        {/* table */}
      </MainCard>
    </MainCard>
  );
}

export default LockProperty;
