import MainCard from 'components/MainCard';
import {
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Button,
  Typography,
  Stack,
  Select,
  MenuItem,
  Box,
  Checkbox,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText
} from '@mui/material';
import { fetchPrimeTypeOfUseList } from 'services/masterServices/prime-type-of-use-services/prime-type-of-use.services';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import {
  deleteOpenPlotRate,
  getOpenPlotRateList,
  saveAndUpdateOpenPlotRate
} from 'services/masterServices/open-plot-rate-services.js/open-plot-rate-services';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getZoneMasterList } from 'services/masterServices/zone-master-services.js/zone-master-services';

function OpenPlotRate() {
  const [typeOfUseList, setTypeOfUseList] = useState([]);
  const [openPlotRateList, setOpenPlotRateList] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const [plotData, setPlotData] = useState({
    ID: 0,
    year: '',
    zoneNo: '',
    rate: '',
    typeOfUse: 0,
    onRVOrALV: 0
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);// When clicking Delete button
  const [zoneList, setZoneList] = useState([]);

 useEffect(() => {
    const fetchZoneList = async () => {
      try {
        const fetchedzones = await getZoneMasterList();
        console.log(fetchedzones, 'zone list');
        setZoneList(fetchedzones.zoneList || []);
      } catch (error) {
        console.error('Error fetching zone list:', error);
        setZoneList([]);
      }
    };
    fetchZoneList();
  }, []);

const handleDeleteClick = () => {
  if (selectedRows.length === 0) {
    setReceivedMessage("Please select at least one record to delete");
    setSnackbarSeverity("warning");
    setSnackbarOpen(true);
    return;
  }
  setOpenDeleteDialog(true);
};






  const validationSchema = Yup.object().shape({
    year: Yup.string()
    .required('Year is required')
    .matches(/^\d{4}$/, 'Year must be exactly 4 digits'),
    zoneNo: Yup.string().required('Zone No. is required'),
    rate: Yup.string().required('Rate is required'),
    typeOfUse: Yup.string().required('Type of Use is required'),
    onRVOrALV: Yup.string().required('ALV / RV is required')
  });

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Open Plot Rate';
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

      console.log(access, 'assigned access to Opwn Plot Rate Page');

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation logic
    let error = '';
   if (name === 'year') {
  if (!/^\d{4}$/.test(value)) {
    error = 'Year must be exactly 4 digits';
  }
}
 else if (name === 'rate') {
      if (!/^\d*\.?\d*$/.test(value)) {
        error = 'Rate must be a number with no spaces or special characters';
      }
    } else if (name === 'zoneNo') {
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        error = 'Zone No. must be alphanumeric with no spaces or special characters';
      }
    }

    setPlotData({
      ...plotData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleRowClick = (plotRate) => {
    setPlotData({
      ID: plotRate.ID,
      year: plotRate.Year,
      zoneNo: plotRate.ZoneNo,
      rate: plotRate.RateSquareMeter,
      typeOfUse: plotRate.TypeOfUse,
      onRVOrALV: plotRate.OnRVOrALV
    });
  };

  const handelCancelClick = () => {
    setPlotData({
      ID: 0,
      year: '',
      zoneNo: '',
      rate: '',
      typeOfUse: 0,
      onRVOrALV: 0
    });
    setErrors({});
  };

  const handleSavePlotInfo = async () => {
    try {
      await validationSchema.validate(plotData, { abortEarly: false });
      let response;
      const plotRateData = {
        ID: plotData.ID,
        Year: parseInt(plotData.year),
        ZoneNo: plotData.zoneNo,
        RateSquareMeter: parseInt(plotData.rate),
        TypeOfUse: plotData.typeOfUse,
        OnRVOrALV: plotData.onRVOrALV
      };

      if (plotRateData.ID === 0) {
        // Create new plot rate data
        response = await saveAndUpdateOpenPlotRate(plotRateData);

        console.log(response, 'msg');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setOpenPlotRateList((openPlotRateList) => [...openPlotRateList, response.res.data.OpenPlotRateInfo]);
          handelCancelClick();
        } else {
          setReceivedMessage(response.message || 'An error occurred while adding plot rate');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } else {
        // Update existing plot rate data
        response = await saveAndUpdateOpenPlotRate(plotRateData);
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          const updatedList = openPlotRateList.map((plot) =>
            plot.ID === response.res.data.OpenPlotRate.ID ? response.res.data.OpenPlotRate : plot
          );
          setOpenPlotRateList(updatedList);
          handelCancelClick();
        } else {
          setReceivedMessage(response.message);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
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
  useEffect(() => {
    const fetchTypeOfUse = async () => {
      try {
        const fetchedTypeOfUse = await fetchPrimeTypeOfUseList();
        console.log(fetchedTypeOfUse, 'type list');
        setTypeOfUseList(fetchedTypeOfUse);
      } catch (error) {
        console.error('Error fetching type of use:', error);
        setTypeOfUseList([]);
      }
    };
    fetchTypeOfUse();
  }, []);

  //fetch openplotratelist from openplot table
  useEffect(() => {
    const fetchOpenPlotRateRateList = async () => {
      try {
        const fetchedOpenPlotRateList = await getOpenPlotRateList();
        // Extract the Description field from each object
        setOpenPlotRateList(fetchedOpenPlotRateList);
        console.log(fetchedOpenPlotRateList, ' open plot rate list');
      } catch (error) {
        console.error('Error fetching plot rate list:', error);
        setOpenPlotRateList([]);
      }
    };
    fetchOpenPlotRateRateList();
  }, []);

  // open plot checkbox
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = openPlotRateList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, openPlotRateList]);




// confirm delete (Yes button)
const handleConfirmDelete = async () => {
  try {
    const IDsToDelete = selectedRows.map((row) => row.ID);

    if (IDsToDelete.length > 0) {
      const response = await deleteOpenPlotRate(IDsToDelete);

      setReceivedMessage(response.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setOpenPlotRateList((prev) =>
        prev.filter((plotRate) => !IDsToDelete.includes(plotRate.ID))
      );

      setSelectedRows([]);
      handelCancelClick();
    }
  } catch (error) {
    console.error("Error deleting plot rate:", error);
    setReceivedMessage("Error deleting plot rate details");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
    handelCancelClick();
  }
  setOpenDeleteDialog(false);
};

// cancel delete (No button)
const handleCancelDelete = () => {
  setOpenDeleteDialog(false);
};

// actual delete logic (unchanged except remove snackbar duplication)
const handleDeleteOpenPlotRate = async () => {
  setOpenDeleteDialog(true);
};

  //checkbox
  const handleCheckboxChange = (event, plotRate) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, plotRate]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((selectedID) => selectedID.ID !== plotRate.ID));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(openPlotRateList);
    } else {
      setSelectedRows([]);
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
        <MainCard title="Open Plot Rate Master">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={3} mb={2}>
              <Stack spacing={1}>
                <InputLabel>Type of Use</InputLabel>
                <Select
                  labelId="type-of-use"
                  id="type-of-use"
                  name="typeOfUse"
                  value={plotData.typeOfUse}
                  onChange={(e) => setPlotData({ ...plotData, typeOfUse: e.target.value })}
                  disabled={accessLevel < 3}
                >
                 
                  {typeOfUseList.map((type) => (
                    <MenuItem key={type.ID} value={type.Type}>
                      {type.Description}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3} mb={1}>
              <Stack spacing={1}>
                <InputLabel>ALV / RV</InputLabel>
                <Select
                  labelId="alv-rv"
                  id="alv-rv"
                  name="onRVOrALV"
                  value={plotData.onRVOrALV}
                  onChange={handleInputChange}
                  disabled={accessLevel < 3}
                >
                
                  <MenuItem value="ALV">ALV</MenuItem>
                  <MenuItem value="RV">RV</MenuItem>
                </Select>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} sm={3} mb={2}>
              <Stack spacing={1}>
                <InputLabel>Year</InputLabel>
                <TextField
                  required
                  placeholder="Enter Year"
                  fullWidth
                  name="year"
                  value={plotData.year}
                  onChange={handleInputChange}
                  error={!!errors.year}
                  helperText={errors.year}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  disabled={accessLevel < 3}
                   inputProps={{ maxLength: 4 }}
                />
              </Stack>
            </Grid>
            <Grid item xs={6} sm={3} mb={1}>
              <Stack spacing={1}>
                <InputLabel>Rate</InputLabel>
                <TextField
                  required
                  placeholder="Enter Rate"
                  fullWidth
                  name="rate"
                  value={plotData.rate}
                  onChange={handleInputChange}
                  error={!!errors.rate}
                  helperText={errors.rate}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} sm={3} mb={2}>
              
             
                <Stack spacing={1}>
  <InputLabel>Zone No.</InputLabel>
  <Select
    required
    fullWidth
    name="zoneNo"
    value={plotData.zoneNo}
    onChange={handleInputChange}
    error={!!errors.zoneNo}
    disabled={accessLevel < 3}
  >
    {zoneList.map((zone) => (
      <MenuItem key={zone.ID} value={zone.ZoneNo}>
        {zone.ZoneNo}
      </MenuItem>
    ))}
  </Select>
  {errors.zoneNo && (
    <FormHelperText style={{ color: 'red' }}>{errors.zoneNo}</FormHelperText>
  )}

              </Stack>
            </Grid>
            <Grid item xs={6} sm={3} mb={2}>
              <Stack spacing={1}>
                <InputLabel></InputLabel>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <Button variant="contained" color="success" onClick={handleSavePlotInfo} disabled={accessLevel < 3}>
                  {' '}
                  Save
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <Button variant="contained" color="secondary" onClick={handelCancelClick} disabled={accessLevel < 3}>
                  {' '}
                  Clear
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <Button variant="contained" color="error" onClick={handleDeleteOpenPlotRate} disabled={accessLevel < 4}>
                  {' '}
                  Delete
                </Button>
              </Stack>
            </Grid>
                <Dialog open={openDeleteDialog} maxWidth="xs" fullWidth>
                        <DialogContent>
                          <Typography variant="body1">Are you sure you want to delete?</Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button  onClick={handleConfirmDelete} color="error" variant="contained">
                            Yes
                          </Button>
                          <Button onClick={handleCancelDelete} color="primary" variant="outlined">
                            No
                          </Button>
                        </DialogActions>
                      </Dialog>
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
      <MainCard>
        <Box />
        <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
          Rate List:
        </Typography>
        <TableContainer sx={{ mt: 3,overflow: 'auto',height: '300px'}}>
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
                <TableCell>Year</TableCell>
                <TableCell>Zone No</TableCell>
                <TableCell>RateSquareMeter</TableCell>
                <TableCell>Type Description</TableCell>
                <TableCell>OnRV/ALV</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {openPlotRateList.map((rate, index) => (
                <TableRow key={index} disabled={accessLevel < 3}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.some((selected) => selected.ID === rate.ID)}
                      onChange={(event) => handleCheckboxChange(event, rate)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={accessLevel < 3}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color={plotData.ID === rate.ID ? 'success' : 'primary'}
                      onClick={() => handleRowClick(rate)}
                      disabled={accessLevel < 4}
                    >
                      {plotData.ID === rate.ID ? <SendOutlined /> : <EditTwoTone />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{rate.Year}</TableCell>
                  <TableCell>{rate.ZoneNo}</TableCell>
                  <TableCell>{rate.RateSquareMeter}</TableCell>
                  <TableCell>{typeOfUseList.find((type) => type.Type === rate.TypeOfUse)?.Type}</TableCell>
                  <TableCell>{rate.OnRVOrALV}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </>
  );
}

export default OpenPlotRate;
