import {
  Box,
  Grid,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';

import {
  deleteZoneMasterById,
  getZoneMasterList,
  saveOrUpdateZoneMaster
} from 'services/masterServices/zone-master-services.js/zone-master-services';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

function Zone() {
  const [zoneList, setZoneList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user');
  }, [userData]);

  const [zoneData, setZoneData] = useState({
    ID: 0,
    ZoneNo: '',
    ZoneType: '',
    Remark: '',
    user: userData
  });

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Zone';
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
      console.log(access, 'assigned access to Zone Page');
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
    const fetchZoneList = async () => {
      try {
        const fetchedzones = await getZoneMasterList();
        setZoneList(fetchedzones.zoneList || []);
      } catch (error) {
        console.error('Error fetching zone list:', error);
        setZoneList([]);
      }
    };
    fetchZoneList();
  }, []);

  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = zoneList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, zoneList]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = Yup.object().shape({
    ZoneNo: Yup.string().required('Zone No is required'),
    ZoneType: Yup.string().required('Zone Type is required')
  });

  const handleSaveZone = async () => {
    try {
      // Validate inputs
      await validationSchema.validate(zoneData, { abortEarly: false });

      // Check for duplicate ZoneNo
      const isDuplicate = zoneList.some(
        (zone) => zone.ZoneNo === zoneData.ZoneNo && zone.ID !== zoneData.ID
      );
      if (isDuplicate) {
        setReceivedMessage('Duplicate Zone No.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      // Prepare payload to send to backend
      const payload = {
        ...zoneData,
        UserID: userData?.UserID, // Use UserID directly from Redux
      };

      if (!payload.UserID) {
        setReceivedMessage('User is not logged in.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      // Save or update
      const response = await saveOrUpdateZoneMaster(payload);

      if (response.status === 200 || response.status === 201) {
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        if (zoneData.ID === 0) {
          // Add new zone to list
          setZoneList((zoneList) => [...zoneList, response.res.data.zone]);
        } else {
          // Update existing zone in list
          setZoneList((zoneList) =>
            zoneList.map((zone) =>
              zone.ID === response.res.data.zone.ID ? response.res.data.zone : zone
            )
          );
        }

        handleClear();
      } else {
        setReceivedMessage(response.message || 'Failed to save zone');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
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


  const validateZoneNo = (value) => {
    // Only numbers
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(value)) {
      return 'Zone No must contain only alphanumeric characters with no spaces or special characters';
    }
    return '';
  };

  const validateZoneType = (value) => {
    // Only alphanumeric characters
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(value)) {
      return 'Zone Type must contain only alphanumeric characters with no spaces or special characters';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let error = '';
    if (name === 'ZoneNo') {
      error = validateZoneNo(value);
    } else if (name === 'ZoneType') {
      error = validateZoneType(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));

    setZoneData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClear = () => {
    setZoneData({
      ID: 0,
      ZoneNo: '',
      ZoneType: '',
      Remark: ''
    });
    setErrors({});
    setSelectedRow(null);
  };

  const handleRowClick = (zone) => {
    setSelectedRow(zone);
    setZoneData(zone);
  };

  const handleDeleteZone = async () => {
    if (selectedRows.length === 0) {
      setReceivedMessage('Please select at least one zone to delete.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    setOpenDeleteDialog(true);
  };

  const handleCheckboxChange = (event, zone) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, zone]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((selectedZone) => selectedZone.ID !== zone.ID));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(zoneList);
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
      const IDsToDelete = selectedRows.map((row) => row.ID);

      if (IDsToDelete.length > 0) {
        const response = await deleteZoneMasterById(IDsToDelete);
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setOpenDeleteDialog(false);

        // Filter out deleted zones from the current zoneList
        setZoneList((zoneList) => zoneList.filter((zone) => !IDsToDelete.includes(zone.ID)));

        setSelectedRows([]);
        // Optionally clear the form after deletion
        handleClear();
      }
    } catch (error) {
      console.error('Error deleting zone information:', error);
      setSnackbarOpen(true);
      setReceivedMessage('Error deleting zone details');
      setSnackbarSeverity('error');
      handleClear();
    }

  }

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
        <MainCard title="Zone Master">
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Add Zone:
          </Typography>
          <Grid display={'flex'} justifyContent={'center'} mt={3}>
            <Grid item xs={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Zone No</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2} mr={12}>
              <TextField
                placeholder="Zone No"
                name="ZoneNo"
                value={zoneData.ZoneNo}
                onChange={handleInputChange}
                error={!!errors.ZoneNo}
                helperText={errors.ZoneNo}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3}
              />
            </Grid>
            <Grid item xs={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Zone Type</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2} mr={12}>
              <TextField
                placeholder="Zone Type"
                name="ZoneType"
                value={zoneData.ZoneType}
                onChange={handleInputChange}
                error={!!errors.ZoneType}
                helperText={errors.ZoneType}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3}
              />
            </Grid>
            <Grid item xs={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Remark</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2} mr={12}>
              <TextField
                placeholder="Remark"
                name="Remark"
                value={zoneData.Remark}
                onChange={handleInputChange}
                disabled={accessLevel < 3}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
            <Grid item>
              <Button variant="contained" color="success" onClick={handleSaveZone} disabled={accessLevel < 3}>
                Save
              </Button>
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
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handleClear} disabled={accessLevel < 3}>
                Clear
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={handleDeleteZone} disabled={accessLevel < 4}>
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
            </Grid>
          </Grid>
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Zone List:
          </Typography>
          
            <TableContainer sx={{ mt: 3, height: 400, overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{
                    width: '1vw',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    <TableCell>
                      <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={handleSelectAll} disabled={accessLevel < 3} />
                    </TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Zone Number</TableCell>
                    <TableCell>Zone Type</TableCell>
                    <TableCell>Remark</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {zoneList.map((zone) => (
                    <TableRow key={zone.ID}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(zone)}
                          onChange={(event) => handleCheckboxChange(event, zone)}
                          onClick={(e) => e.stopPropagation()}
                          disabled={accessLevel < 3}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color={zoneData.ID === zone.ID ? 'success' : 'primary'}
                          onClick={() => handleRowClick(zone)}
                          disabled={accessLevel < 3}
                        >
                          {zoneData.ID === zone.ID ? <SendOutlined /> : <EditTwoTone />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{zone.ZoneNo ?? 'N/A'}</TableCell>
                      <TableCell>{zone.ZoneType ?? 'N/A'}</TableCell>
                      <TableCell>{zone.Remark ?? 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        
        </MainCard>
      )}
    </>
  );
}

export default Zone;
