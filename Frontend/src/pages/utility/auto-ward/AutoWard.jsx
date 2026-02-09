import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Tab, Tabs, Button, Grid, Typography, Stack, InputLabel, TextField, Snackbar, SnackbarContent, Autocomplete, CircularProgress } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { BookOutlined } from '@ant-design/icons';
import { getPropertyListByWard, saveAndUpdateAutoWard, saveAndUpdateOblique } from 'services/utlilityService/autoWardService/autoWard.service';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';

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

function AutoWard() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarMessages, setSnackbarMessages] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [wardLoading, setWardLoading] = useState(false);
  const [obliqueLoading, setObliqueLoading] = useState(false);
  const [passwordOblique, setPasswordOblique] = useState('');
  const [passwordWard, setPasswordWard] = useState('');

  const [value, setValue] = useState(0);

  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user');
  }, [userData]);


  const [wardData, setWardData] = useState({
    NewWardNo: '',
    FromProperty: '',
    ToProperty: ''
  });

  // Update state for oblique data
  const [obliqueData, setObliqueData] = useState({
    NewWardNo: '',
    FromOblique: '',
    ToOblique: '',
    PropertyNo: ''
  });

  // Update validation schema to include PropertyNo
  const obliqueValidationSchema = Yup.object().shape({
    NewWardNo: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .typeError("Ward No must be a number")
      .required("Ward No is required"),
    FromOblique: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .typeError("From Oblique must be a number")
      .required("From Oblique is required"),
    ToOblique: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .typeError("To Oblique must be a number")
      .required("To Oblique is required"),
    PropertyNo: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .typeError("Property No must be a number")
      .required("Property No is required"),
  });
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Auto Ward';
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
// fetch property list when ward changes oblique tab 2
const [propertyOptions, setPropertyOptions] = useState([]);

useEffect(() => {
  if (obliqueData?.NewWardNo) {
    getPropertyListByWard(obliqueData.NewWardNo)
      .then((data) => setPropertyList(data))
      .catch((err) => console.error("Error fetching property list:", err));
  }
}, [obliqueData?.NewWardNo]);

const [propertyList, setPropertyList] = useState([]);

useEffect(() => {
  if (wardData.NewWardNo) {
    getPropertyListByWard(wardData.NewWardNo).then((data) => {
      setPropertyList(data);
    });
  }
}, [wardData.NewWardNo]);


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
      console.log(access, 'assigned access to Auto Ward Page');
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

  const handleObliqueInputChange = (event) => {
    const { name, value } = event.target;
    setObliqueData({
      ...obliqueData,
      [name]: value
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWardData({
      ...wardData,
      [name]: value
    });
    // setObliqueData({
    //   ...obliqueData,
    //   [name]: value
    // });
  };
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleClickDialog = () => {

    setOpenDialog(true);
  };
  const [openDialogWard, setOpenDialogWard] = useState(false);
  const handleCloseDialogWard = () => {
    setOpenDialogWard(false);
  };
  const handleClickDialogWard = () => {

    setOpenDialogWard(true);
  };
 const handleSaveOblique = async () => {
  console.log('Oblique data before validation:', obliqueData);

  try {
    await obliqueValidationSchema.validate(obliqueData, { abortEarly: false });
  } catch (err) {
    if (err.inner) {
      const validationErrors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      console.log('Oblique validation errors:', validationErrors);
    }
    return;
  }

  const { FromOblique, ToOblique, NewWardNo, PropertyNo } = obliqueData;
  const parsedFromOblique = parseInt(FromOblique, 10);
  const parsedToOblique = parseInt(ToOblique, 10);
  const parsedWardNo = parseInt(NewWardNo, 10);
  const parsedPropertyNo = parseInt(PropertyNo, 10);

  const obliqueRange = [];
  for (let i = parsedFromOblique; i <= parsedToOblique; i++) {
    obliqueRange.push(i);
  }

  const payload = {
    NewWardNo: parsedWardNo,
    NewPropertyNo: parsedPropertyNo,
    partitions: obliqueRange.map((num) => ({ NewPartitionNo: num })),
    user: userData

  };

  console.log('🚀 Payload before API call:', payload);

  if (!passwordOblique) {
    setSnackbarSeverity('error');
    setSnackbarMessage('Please enter password!');
    setSnackbarOpen(true);
    return;
  }

  const levelname = 'Admin';

  try {
    setObliqueLoading(true);

    // ✅ Password check first
    const passwordCheckResponse = await levelPassword(levelname, passwordOblique);
    if (passwordCheckResponse.status !== 200) {
      throw new Error('Invalid password');
    }

    // ✅ API call
    const response = await saveAndUpdateOblique(payload);
    console.log('API Response:', response);

    let finalMessage = response.data?.message || 'Oblique properties saved successfully';
    
    // ✅ Include skipped partitions if any
    if (response.data?.skipped?.length) {
      finalMessage += ` Skipped partitions: ${response.data.skipped.join(", ")}`;
    }

    setReceivedMessage(response.message);
    setSnackbarSeverity('success');
    setSnackbarMessage(response.message);
    setSnackbarOpen(true);

    handleClearOblique();
    setOpenDialog(false);
    setValue(0);
    setPasswordOblique("");
  } catch (error) {
    console.error('❌ Error during save operation:', error);

    const errMsg = error.response?.data?.message || error.message || 'An error occurred while saving oblique data';
    setReceivedMessage(errMsg);
    setSnackbarSeverity('error');
    setSnackbarMessage(errMsg);
    setSnackbarOpen(true);

  } finally {
    setObliqueLoading(false);
  }
};

  
  

  const handleClearOblique = () => {
    setObliqueData({
      NewWardNo: '',
      FromOblique: '',
      ToOblique: '',
      PropertyNo: ''
    });
  };

  const validateInputs = () => {
    const { FromProperty, ToProperty } = wardData;
    if (parseInt(FromProperty, 10) > parseInt(ToProperty, 10)) {
      alert('From Property No must be less than or equal to To Property No');
      return false;
    }
    return true;
  };


  const validationSchema = Yup.object().shape({
    NewWardNo: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .typeError("Ward No must be a number")
      .required("Ward No is required"),
    FromProperty: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .typeError("From Property must be a number")
      .required("From Property is required"),
    ToProperty: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .typeError("To Property must be a number")
      .required("To Property is required")
  });
  
  

  const handleSave = async () => {
    try {
      await validationSchema.validate(wardData, { abortEarly: false });
    } catch (err) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        console.log('Validation errors:', validationErrors);
      }
      return;
    }

    if (!validateInputs()) return;

    const { FromProperty, ToProperty, NewWardNo } = wardData;
    const parsedFromProperty = parseInt(FromProperty, 10);
    const parsedToProperty = parseInt(ToProperty, 10);

    const propertyRange = [];
    for (let i = parsedFromProperty; i <= parsedToProperty; i++) {
      propertyRange.push(i);
    }

    const payload = {
      NewWardNo: parseInt(NewWardNo, 10),
      PropertyRange: propertyRange,
        user: userData

    };

    console.log('Submitting ward data:', payload);
    if (!passwordWard) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Please enter password!');
      setSnackbarOpen(true);
      return;
    }

    const levelname = 'Admin'; 
    try {
      setWardLoading(true);
      const passwordCheckResponse = await levelPassword(levelname, passwordWard);
      if (passwordCheckResponse.status !== 200) {
        throw new Error('Invalid password');
      }
      const response = await saveAndUpdateAutoWard(payload);
     
      if (response.status === 200 || response.status === 201) {
        const skipped = response.data?.skipped?.length
        ? ` Skipped properties: ${response.data.skipped.join(", ")}`
        : "";

      const finalMessage = `${response.data?.message || "Auto Ward saved successfully."}${skipped}`;

        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setSnackbarMessage(response.message || 'Auto Ward saved successfully');
        handleClear();
        setOpenDialogWard(false);
        setValue(0); 
          setPasswordWard("");

      } else {
        setReceivedMessage(response.message || 'An error occurred while creating the Auto Ward');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setSnackbarMessage(response.message || 'An error occurred while saving Auto Ward data');
        handleClear();
      }
    } catch (error) {
      console.error('Error during save operation:', error);
      setReceivedMessage(error.response?.data?.message || 'An error occurred while updating the Auto Ward');
      setSnackbarSeverity('error');
      setSnackbarMessage(error.response?.data?.message || 'An error occurred while updating Auto Ward data');
      setSnackbarOpen(true);
    }finally {
      setWardLoading(false); // 🔹 Stop loading after API call finishes
    }
  };

  const handleClear = () => {
    setWardData({
      NewWardNo: '',
      FromProperty: '',
      ToProperty: ''
    });
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
        <MainCard title="Auto Ward Entry">
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Ward Entry For Main Properties" icon={<BookOutlined />} iconPosition="start" {...a11yProps(0)} />
                <Tab label="Ward Entry For Oblique Properties" icon={<BookOutlined />} iconPosition="start" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <MainCard title="Ward Entry For Main Properties" style={{ color: 'blue', fontWeight: 'bold' }}>
                <Grid container spacing={1.5}>
                {wardLoading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent overlay
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <CircularProgress size={60} />
            <Typography
              variant="h6"
              sx={{ mt: 2, color: 'red', fontWeight: 'bold', textAlign: 'center' }}
            >
              Please wait...
            </Typography>
          </Box>
        )}
                  <Grid item xs={12} md={10}>
                    <Box marginTop={2}>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6} sm={3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>Ward Entry For Main Properties </InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField
                              placeholder="Enter Ward No"
                              type="number"
                              name="NewWardNo"
                              value={wardData.NewWardNo}
                              onChange={handleInputChange}
                              disabled={accessLevel < 3}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6} sm={3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>From Property No</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField
                              placeholder="Enter From Property No"
                              type="number"
                              name="FromProperty"
                              value={wardData.FromProperty}
                              onChange={handleInputChange}
                              disabled={accessLevel < 3}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6} sm={3}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>To Property No</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={4.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField
                              placeholder="Enter To Property No"
                              type="number"
                              name="ToProperty"
                              value={wardData.ToProperty}
                              onChange={handleInputChange}
                              disabled={accessLevel < 3}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={10} sm={2} mt={3}>
                    <Stack spacing={0}>
                      <Button variant="contained" color="success" onClick={handleClickDialogWard} disabled={wardLoading ||accessLevel < 3} startIcon={wardLoading ? <CircularProgress size={18} /> : null}>
                       
                        {wardLoading ? "Saving..." : "Create"}

                      </Button>
                    </Stack>
                  </Grid>
                  <Grid item xs={10} sm={2} mt={3}>
                    <Stack spacing={0}>
                      <Button variant="contained" color="secondary" onClick={handleClear}  >
                        Clear
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
            </TabPanel>
            <TabPanel value={value} index={1}>

              <MainCard title="Ward Entry For Oblique Properties" style={{ color: 'blue', fontWeight: 'bold' }}>
                <Grid container spacing={2.5}>
                {obliqueLoading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent overlay
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <CircularProgress size={60} />
            <Typography
              variant="h6"
              sx={{ mt: 2, color: 'red', fontWeight: 'bold', textAlign: 'center' }}
            >
              Please wait...
            </Typography>
          </Box>
        )}
                  <Grid item xs={12} md={10} lg={6}>
                    {/* <Box marginTop={2}> */}
                    <Grid container spacing={3} justifyContent="center">
                      <Grid item xs={6} sm={3}>
                        <Stack sx={{ mt: 1 }} spacing={1}>
                          <InputLabel style={{ fontWeight: 'bold' }}>Ward No. </InputLabel>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={5.3} mb={1}>
                        <Stack spacing={1}>
                          <TextField
                            placeholder="Enter Ward No"
                            type="number"
                            name="NewWardNo"
                            value={obliqueData.NewWardNo}
                            onChange={handleObliqueInputChange}
                            disabled={accessLevel < 3}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                    {/* <Box marginTop={2}> */}

                    <Grid container spacing={3} justifyContent="center">
                      <Grid item xs={6} sm={3}>
                        <Stack sx={{ mt: 1 }} spacing={1}>
                          <InputLabel style={{ fontWeight: 'bold' }}>From Oblique No</InputLabel>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={5.3} mb={1}>
                        <Stack spacing={1}>
                          <TextField
                            placeholder="Enter From Oblique No"
                            type="number"
                            name="FromOblique"
                            value={obliqueData.FromOblique}
                            onChange={handleObliqueInputChange}
                            disabled={accessLevel < 3}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3} justifyContent="center">
                      <Grid item xs={6} sm={3}>
                        <Stack sx={{ mt: 1 }} spacing={1}>
                          <InputLabel style={{ fontWeight: 'bold' }}>To Oblique No</InputLabel>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={5.3} mb={1}>
                        <Stack spacing={1}>
                          <TextField
                            placeholder="Enter To Oblique No"
                            type="number"
                            name="ToOblique"
                            value={obliqueData.ToOblique}
                            onChange={handleObliqueInputChange}
                            disabled={accessLevel < 3}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={10} lg={6}>
                    <Grid container spacing={3} justifyContent="center">
                      <Grid item xs={6} sm={3}>
                        <Stack sx={{ mt: 1 }} spacing={1}>
                          <InputLabel style={{ fontWeight: 'bold' }}>Property No.</InputLabel>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={5.3} mb={1}>
                      <Stack spacing={1}>
                      {/* <Autocomplete
  options={
    Array.isArray(propertyList)
      ? propertyList.map((p) =>
          p.NewPartitionNo
            ? `${p.NewPropertyNo}-${p.NewPartitionNo}`
            : `${p.NewPropertyNo}`
        )
      : []
  }
  value={
    obliqueData.PropertyNo
      ? obliqueData.PartitionNo
        ? `${obliqueData.PropertyNo}-${obliqueData.PartitionNo}`
        : `${obliqueData.PropertyNo}`
      : ""
  }
  onChange={(e, newValue) => {
    if (newValue) {
      const [propertyNo, partitionNo] = newValue.split("-");
      setObliqueData({
        ...obliqueData,
        PropertyNo: propertyNo,
        PartitionNo: partitionNo || "", 
      });
    } else {
      setObliqueData({
        ...obliqueData,
        PropertyNo: "",
        PartitionNo: "",
      });
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder="Select Property No."
      disabled={accessLevel < 3}
    />
  )}
/> */}
<Autocomplete
  options={
    Array.isArray(propertyList)
      ? propertyList
          .map((p) =>
            p.NewPartitionNo
              ? `${p.NewPropertyNo}-${p.NewPartitionNo}`
              : `${p.NewPropertyNo}`
          )
          .sort((a, b) => {
            // Split to handle "PropertyNo-PartitionNo" format
            const [aProp, aPart] = a.split("-").map(Number);
            const [bProp, bPart] = b.split("-").map(Number);

            // Compare property numbers first, then partition numbers
            if (aProp !== bProp) return aProp - bProp;
            return (aPart || 0) - (bPart || 0);
          })
      : []
  }
  value={
    obliqueData.PropertyNo
      ? obliqueData.PartitionNo
        ? `${obliqueData.PropertyNo}-${obliqueData.PartitionNo}`
        : `${obliqueData.PropertyNo}`
      : ""
  }
  onChange={(e, newValue) => {
    if (newValue) {
      const [propertyNo, partitionNo] = newValue.split("-");
      setObliqueData({
        ...obliqueData,
        PropertyNo: propertyNo,
        PartitionNo: partitionNo || "",
      });
    } else {
      setObliqueData({
        ...obliqueData,
        PropertyNo: "",
        PartitionNo: "",
      });
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      placeholder="Select Property No."
      disabled={accessLevel < 3}
    />
  )}
/>


  
</Stack>


                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={10} sm={2} mt={3}>
                    <Stack spacing={0}>
                      <Button variant="contained" color="success"  disabled={obliqueLoading || accessLevel < 3}  onClick={handleClickDialog} startIcon={obliqueLoading ? <CircularProgress size={18} /> : null}
 >
                                        {obliqueLoading ? "Saving..." : "Create"}

                      </Button>
                    </Stack>
                  </Grid>
                  <Grid item xs={10} sm={2} mt={3}>
                    <Stack spacing={0}>
                      <Button variant="contained" color="secondary" onClick={handleClearOblique} disabled={accessLevel < 3}>
                        Clear
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
          </TabPanel>
          </Box>
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

          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
            <DialogTitle id="alert-dialog-title" color="error" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Save Oblique
            </DialogTitle>

            <DialogContent>
              <Stack marginBottom={2}>
                <DialogContentText id="alert-dialog-description">Enter Admin Password</DialogContentText>
              </Stack>
              <TextField
                label="Enter Password"
                type="password"
                value={passwordOblique}
                onChange={(e) => setPasswordOblique(e.target.value)}
                fullWidth
                required
              />{' '}
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="success" onClick={handleSaveOblique} autoFocus>
                Ok
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDialogWard} onClose={handleCloseDialogWard} fullWidth maxWidth="xs">
            <DialogTitle id="alert-dialog-title" color="error" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Save Ward
            </DialogTitle>

            <DialogContent>
              <Stack marginBottom={2}>
                <DialogContentText id="alert-dialog-description">Enter Admin Password</DialogContentText>
              </Stack>
              <TextField
                label="Enter Password"
                type="password"
                value={passwordWard}
                onChange={(e) => setPasswordWard(e.target.value)}
                fullWidth
                required
              />{' '}
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="success" onClick={handleSave} autoFocus>
                Ok
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCloseDialogWard} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </MainCard>
      )}
    </>
  );
}

export default AutoWard;
