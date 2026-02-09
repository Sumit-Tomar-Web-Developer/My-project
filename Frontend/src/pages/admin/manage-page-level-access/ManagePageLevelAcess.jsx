// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  Box,
  FormControl,
  Table,
  TableBody,
  OutlinedInput,
  Checkbox,
  TableCell,
  Card,
  CardContent,
  Button,
  Typography,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  SnackbarContent,
  Snackbar
} from '@mui/material';
import { useEffect, useState } from 'react';
// project import
import MainCard from 'components/MainCard';
import { EditOutlined } from '@ant-design/icons';
import { getSecurityLayer } from 'services/AdminServices/pageLevelAccess/PageLevelAccessService';
import { fetchPageNames } from 'services/AdminServices/pageNameMaster/PageNameMasterService';
import {
  getAccessLevels,
  getSavedPermissions,
  savePagesPermissions
} from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { setLayerID, setNewUserData } from 'state/reducers/newUser/newUserSlice';
import { useDispatch } from 'react-redux';

// ==============================|| Manage User Page Access ||============================== //

function ManagePageLevelAccess() {
  const [securityLevelList, setSecurityLevelList] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [accessLevels, setAccessLevels] = useState([]);
  const [existingPermissions, setExistingPermissions] = useState([]);
  const [selectedSecurityLayer, setSelectedSecurityLayer] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarMessages, setSnackbarMessages] = useState('');

  useEffect(() => {
    const layerList = async () => {
      const layerList = await getSecurityLayer();
      console.log(layerList, 'layer data fetched');
      setSecurityLevelList(layerList.LayerData);
    };
    layerList();
  }, []);

  useEffect(() => {
    const getPageNames = async () => {
      try {
        const response = await fetchPageNames();
        console.log('Raw page data:', response.data);
        const validPages = response.data
          .filter((page) => page.PageAlias && page.PageAlias.trim() !== '')
          .sort((a, b) => a.PageAlias.localeCompare(b.PageAlias));
        setPageList(validPages);
      } catch (err) {
        console.error('Error fetching page names', err);
      }
    };
    getPageNames();
  }, []);

  useEffect(() => {
    const fetchAccessLevels = async () => {
      try {
        const levels = await getAccessLevels();
        console.log('Access Levels:', levels);
        setAccessLevels(levels || []);
      } catch (err) {
        console.error('Error fetching access levels', err);
      }
    };
    fetchAccessLevels();
  }, []);

  useEffect(() => {
    const fetchSavedPermissions = async () => {
      if (!selectedSecurityLayer) return;
      console.log('Fetching permissions for LayerID:', selectedSecurityLayer);
      try {
        const permissions = await getSavedPermissions(selectedSecurityLayer);
        console.log('Fetched Permissions:', permissions);
        setExistingPermissions(permissions || []);
      } catch (err) {
        console.error('Error fetching access levels', err);
      }
    };

    fetchSavedPermissions();
  }, [selectedSecurityLayer]);

  //fetch saved permission for admin layer ID with full controll access
  useEffect(() => {
    if (securityLevelList.length > 0 && selectedSecurityLayer == null) {
      const adminLayer = securityLevelList.find((layer) => layer.LayerName === 'Admin');
      if (adminLayer) {
        setSelectedSecurityLayer(adminLayer.LayerID);
      } else {
        setSelectedSecurityLayer(securityLevelList[0]?.LayerID ?? null);
      }
    }
  }, [securityLevelList, selectedSecurityLayer]);

  // Run when `existingPermissions` is updated
  useEffect(() => {
    if (existingPermissions.length > 0) {
      const updatedPermissionsState = {};
      existingPermissions.forEach(({ PageID, AccessID }) => {
        updatedPermissionsState[PageID] = AccessID;
      });
      setPermissionsState(updatedPermissionsState);
    }
  }, [existingPermissions]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleSaveClick = async () => {
    try {
      if (!selectedSecurityLayer) {
        alert('Please select a Security Layer before saving.');
        return;
      }

      // Extract checked permissions from the table
      const permissionsData = pageList
        .map((page) => {
          const selectedAccessID = permissionsState[page.PageID];

          if (selectedAccessID) {
            return {
              LayerID: selectedSecurityLayer,
              PageID: page.PageID,
              AccessID: selectedAccessID
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      console.log(permissionsData, 'permissions data to be send');

      if (permissionsData.length === 0) {
        alert('No permissions selected to save.');
        return;
      }

      // Save the data to the backend
      const response = await savePagesPermissions(permissionsData);
      setSnackbarOpen(true);
      setReceivedMessage(response.message);
      setSnackbarSeverity('success');
      setSnackbarMessages(receivedMessage);
    } catch (error) {
      console.error('Error saving permissions', error);
      setSnackbarOpen(true);
      setReceivedMessage(response.message);
      setSnackbarSeverity('error');
      setSnackbarMessages(receivedMessage);
    }
  };

  //hold permission of each page
  const [permissionsState, setPermissionsState] = useState({});

  const handleCheckboxChange = (pageID, accessID) => {
    setPermissionsState((prevState) => ({
      ...prevState,
      [pageID]: accessID
    }));
  };
  const dispatch = useDispatch();

  const handleLayerChange = (event) => {
    const selectedLayer = event.target.value;
    setSelectedSecurityLayer(selectedLayer);
    // Close dropdown before state change (trick)
    setTimeout(() => {
      setSelectedSecurityLayer(selectedLayer);
      dispatch(setLayerID(selectedLayer));
    }, 0);
  };

  return (
    <MainCard title="Manage Page Level Access ">
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <MainCard>
            <Typography sx={{ mb: 4 }} variant="h4" style={{ color: 'blue', fontWeight: 'bold' }}>
              Form and Access Rights
            </Typography>
            <Box marginTop={2}>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6} sm={2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Select Security Level</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={2} mb={1}>
                    <Stack spacing={1}>
                      <Select
                        value={selectedSecurityLayer}
                        onChange={(e) => {
                          handleLayerChange(e);
                        }}
                        fullWidth
                      >
                        {securityLevelList.map((layer) => (
                          <MenuItem key={layer.LayerID} value={layer.LayerID}>
                            {layer.LayerName}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <div className="card" style={{ marginTop: '6px' }}>
                  <Card>
                    <CardContent>
                      <Box sx={{ overflowX: 'auto', height: '300px' }}>
                        <Table>
                          <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                            <TableRow>
                              <TableCell style={{ width: `${100 / (accessLevels.length + 1)}%` }}>Page Name</TableCell>
                              {accessLevels && accessLevels.length > 0 ? (
                                accessLevels.map((access) => (
                                  <TableCell key={access.AccessID} style={{ width: `${100 / (accessLevels.length + 1)}%` }}>
                                    {access.AccessName}
                                  </TableCell>
                                ))
                              ) : (
                                <TableCell>Loading...</TableCell>
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pageList && pageList.length > 0 ? (
                              pageList.map((page) => (
                                <TableRow key={page.PageID}>
                                  <TableCell style={{ width: `${100 / (accessLevels.length + 1)}%` }}>{page.PageAlias}</TableCell>
                                  {accessLevels && accessLevels.length > 0 ? (
                                    accessLevels.map((access) => (
                                      <TableCell key={access.AccessID} style={{ width: `${100 / (accessLevels.length + 1)}%` }}>
                                        <Checkbox
                                          checked={permissionsState[page.PageID] === access.AccessID}
                                          onChange={() => handleCheckboxChange(page.PageID, access.AccessID)}
                                        />
                                      </TableCell>
                                    ))
                                  ) : (
                                    <TableCell>Loading...</TableCell>
                                  )}
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={accessLevels.length + 1} align="center">
                                  No pages found
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
          </MainCard>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        <Grid item xs={12} sm={2} mt={3}>
          <Stack spacing={1}>
            <Button variant="contained" color="success" onClick={handleSaveClick}>
              Save
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
        <Grid item xs={12} sm={2} mt={3}>
          <Stack spacing={1}>
            <Button variant="contained" color="secondary">
              clear
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default ManagePageLevelAccess;
