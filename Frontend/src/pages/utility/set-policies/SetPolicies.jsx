// material-ui
import {
  Grid,
  Box,
  Stack,
  TextField,
  Accordion,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  AccordionSummary,
  Checkbox,
  Typography,
  Button,
  Radio,
  FormControl,
  FormGroup,
  Snackbar,
  SnackbarContent,
  ListItemText,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
// project import
import MainCard from 'components/MainCard';

//Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import RetainPolicyFactor from 'pages/utility/RetaintionPolicyFactorWiseMaster/RetaintionPolicyFactorWiseMaster';
import { useSelector } from 'react-redux';
import { getFactorInfo, setMinRVParameter, funApplyPolicy } from 'services/utlilityService/setPoliciesService/setPoliciesService';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { set } from 'lodash';
import { getAssessmentData } from 'services/masterServices/assessment-rule-services/assessment-rule.services';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';

// ==============================|| AutoAppeal ||=============================/= //

function AutoAppeal() {
  //dialog
  const [openDialog, setOpenDialog] = useState(false);
  //to property
  const [selectedValue, setSelectedValue] = useState();
  //base Type handleType
  const [selectedTypes, setselectedTypes] = useState();
  // State to control the disabled state of the checkbox
  const [isCheckboxDisabledasPerOld, setIsCheckboxDisabledasPerOld] = useState(true);
  const [isCheckboxDisabledMinRv, setIsCheckboxDisabledMinRv] = useState(true);
  const [isCheckboxDisabledRetention, setIsCheckboxDisabledRetention] = useState(true);
  const [isCheckboxDisabledMixAssessment, setIsCheckboxDisabledMixAssessment] = useState(true);
  const [isCheckboxDisabledNewPropertyAsPerOld, setIsCheckboxDisabledNewPropertyAsPerOld] = useState(true);
  const [isCheckboxDisabledMinRvOldRvZero, setIsCheckboxDisabledMinRvOldRvZero] = useState(true);
  const [selectedWard, setSelectedWard] = useState([]);
  const [propertyNoListTo, setpropertyNoListTo] = useState([]);
  const [propertyNoListFrom, setpropertyNoListFrom] = useState([]);
  const [selectedPropertyNoTo, setSelectedPropertyNoTo] = useState('');
  const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const [error, seterror] = useState({});
  const [wardList, setwardList] = useState([]);
  // Access state using the selectors
  const asPerOldForNewProperty = useSelector((state) => state.setPolicies.asPerOldForNewProperty);
  const minRv = useSelector((state) => state.setPolicies.minRV);
  const asPerOld = useSelector((state) => state.setPolicies.asPerOld);
  const retention = useSelector((state) => state.setPolicies.retention);
  const mixassessment = useSelector((state) => state.setPolicies.mixassessment);
  const minRvOldRvZero = useSelector((state) => state.setPolicies.minRvOldRvZero);

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);
  const [snackbar, setSnackbar] = useState(false)
  const [snackbarType, setSnackbarType] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [password, setPassword] = useState('')




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAssessmentData();
        console.log('Fetched assessment data:', response);

        setIsCheckboxDisabledMinRv(!response.IsMinimumRV);
        setIsCheckboxDisabledMinRvOldRvZero(!response.IsMinimumRVForOldRVZero);
        setIsCheckboxDisabledasPerOld(!response.IsAsPerOld);
        setIsCheckboxDisabledMixAssessment(!response.IsMixAssessment);
        setIsCheckboxDisabledNewPropertyAsPerOld(!response.IsAsPerOldForNewProperty);
        setIsCheckboxDisabledRetention(!response.IsRetention);
        setIsCheckboxDisabledMinRvOldRvZero(!response.IsMinimumRVForOldRVZero);


      } catch (error) {
        console.log('Error fetching data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {

  }, [isCheckboxDisabledasPerOld,
    isCheckboxDisabledMinRv,
    isCheckboxDisabledRetention,
    isCheckboxDisabledMixAssessment,
    isCheckboxDisabledNewPropertyAsPerOld,
    isCheckboxDisabledMinRvOldRvZero]);



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(false);
  };
  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Set Policies';
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
      console.log(access, 'assigned access to Set Policies Page');
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

  // useEffect(() => {
  //   // Enable or disable checkbox for "As Per Old"
  //   setIsCheckboxDisabledasPerOld(!asPerOld);
  // }, [asPerOld]);

  const [policyfactorInfo, setPolicyFactorInfo] = useState([]);
  useEffect(() => {
    const fetchWardList = async () => {
      try {
        const wardlist = await fetchWards();
        const sortedWardList = wardlist.sort((a, b) => a.NewWardNo - b.NewWardNo); // Sort by NewWardNo in ascending order
        console.log('Sorted wardList:', sortedWardList);
        setwardList(sortedWardList);
        //setwardListProperty(sortedWardList);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchWardList();
  }, []);
  // Fetching data using useEffect
  useEffect(() => {
    const fetchFactorInfo = async () => {
      try {
        const response = await getFactorInfo(); // Make sure the URL is correct
        setPolicyFactorInfo(response.FactorDetails); // Assuming the data is under FactorDetails
      } catch (error) {
        console.error('Error fetching factor info:', error);
      }
    };

    fetchFactorInfo();
  }, []);
  // useEffect(() => {
  //   // Enable or disable checkbox for "Minimum RV"
  //   setIsCheckboxDisabledMinRv(!minRv);
  // }, [minRv]);

  // useEffect(() => {
  //   // Enable or disable checkbox for "Retention"
  //   setIsCheckboxDisabledRetention(!retention);
  // }, [retention]);

  // useEffect(() => {
  //   // Enable or disable checkbox for "Mix Assessment"
  //   setIsCheckboxDisabledMixAssessment(!mixassessment);
  // }, [mixassessment]);

  // useEffect(() => {
  //   // Enable or disable checkbox for "New Property As Per Old"
  //   setIsCheckboxDisabledNewPropertyAsPerOld(!asPerOldForNewProperty);
  // }, [asPerOldForNewProperty]);

  // useEffect(() => {
  //   // Enable or disable checkbox for "Minimum RV For Old RV Zero"
  //   setIsCheckboxDisabledMinRvOldRvZero(!minRvOldRvZero);
  // }, [minRvOldRvZero]);
  useEffect(() => {
    const propList = async () => {
      console.log(selectedWard)
      if (selectedWard.length == 1) {

        try {
          const propertyRange = await fetchPropertyRangeByWard(selectedWard);
          console.log('propertyRange:', propertyRange);

          setpropertyNoListTo(propertyRange.properties || []);
          setpropertyNoListFrom(propertyRange.properties || []);
        } catch (error) {
          console.error('Failed to fetch propertyRange:', error);
        }
      }
    }
    propList()
  }, [selectedWard]);

  const handleClickDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAction = async () => {
    try {
      if (selectedWard.length === 0) {
        setSnackbarType('error')
        setSnackbarMessage('Please select Ward No.')
        setSnackbar(true)
        return
      }
      if (selectedWard.length === 1 && (selectedPropertyNoFrom === '' || selectedPropertyNoTo === '')) {
        // Show error message or handle the case when property numbers are missing
        setSnackbarType('error')
        setSnackbarMessage('Please select both From Property and To Property Numbers.')
        setSnackbar(true)
        return;
      }
      console.log(password, 'password');
      const levelname = 'L1'
      const IsPasswordValid = await levelPassword(levelname, password);
      if (IsPasswordValid.response.status === 200) {
        setPassword('')
        try {

          const payload = {
            // OwnerID: OwnerID,         
            ApplyPolicy: applyPolicy,
            WardNo: selectedWard,
            FromPropertyNo: selectedPropertyNoFrom,
            ToPropertyNo: selectedPropertyNoTo
          }


          const response = await funApplyPolicy(payload)

          if (response.status == 200 || response.status) {
            setSnackbarType('success')
            setSnackbarMessage(response.data.message || 'Policy Applied Successfully')
            setSnackbar(true)
          }
        } catch (error) {
          console.log(error, 'Error in save and procced function')
        }
      } else {
        console.log('else part')


      }
      setOpenDialog(false);
    } catch (error) {
      setSnackbarType('error')
      setSnackbarMessage('Invalid Password')
      setSnackbar(true)
    }
  }
  const handlePropertyChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedPropertyNoFrom(e.target.value);
  };
  const handlePropertyChangeTo = async (e) => {
    setSelectedPropertyNoTo(e.target.value);
  };
  //navigate
  // const navigate = useNavigate();
  const [retaintionPolicy, setRetaintionPolicy] = useState(true);

  const handleButtonClick = () => {
    // navigate('/utility/retaintion-policy-factor-wise-master');
    setRetaintionPolicy(!retaintionPolicy);
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };
  //from property
  const [selectedValuef, setSelectedValuef] = useState();

  const handleSelectChangef = (event) => {
    setSelectedValuef(event.target.value);
  };

  const handleType = (event) => {
    setselectedTypes(event.target.value);
  };

  const handleWardChange = async (event) => {
    const {
      target: { value },
    } = event;

    // If "Select All" clicked
    if (value.includes('ALL')) {
      if (selectedWard.length === wardList.length) {
        // Unselect all
        setSelectedWard([]);
      } else {
        // Select all
        setSelectedWard(wardList.map((w) => w.NewWardNo));
      }
      return;
    }

    setSelectedWard(value);


  };

  const [minRV, setMinRV] = useState('')
  const [maxYear, setMaxYear] = useState('')
  useEffect(() => {
    console.log(minRV, maxYear, 'minRV,maxYear')
  }, [minRV, maxYear])
  const handleSaveAppealParameters = async () => {
    const data = { minRV, maxYear }
    try {
      const response = await setMinRVParameter(data)
      if (response.status === 200 || response.status === 'OK') {

        setSnackbarType('success')
        setSnackbarMessage('Parameter Added Successfully')
        setSnackbar(true)
        setMinRV('')
        setMaxYear('')
      }
      else {
        setSnackbarType('error')
        setSnackbarMessage('Error in saving parameter')
        setSnackbar(true)
      }
    } catch (error) {
      console.log(error, 'error in saving Min RV parameter')
    }

  };

  const [applyPolicy, setApplyPolicy] = useState({
    asPerOld: false,
    minRv: false,
    retention: false,
    mixAssessment: false,
    newPropertyAsPerOld: false,
    minRvOldRvZero: false
  });

  const handlePolicyChange = useCallback(
    (key) => (_event, checked) => {
      setApplyPolicy((prev) => {
        const next = {};

        // set all keys to false
        Object.keys(prev).forEach((k) => {
          next[k] = false;
        });

        // set only the selected key
        next[key] = checked;

        return next;
      });
    },
    []
  );


  useEffect(() => {

  }, [applyPolicy])
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
      ) : retaintionPolicy ? (
        <MainCard title="Set Policies">
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={5} lg={6}>
              <Box boxShadow={3} padding>
                <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Set Policies
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <MainCard>
                      <Accordion>
                        <AccordionSummary
                          aria-controls="panel1-content"
                          id="panel1-header"
                          sx={{ fontWeight: 'bolder' }}
                          disabled={accessLevel < 3}
                        >
                          Select Base Type
                        </AccordionSummary>
                        <AccordionDetails sx={{ flexDirection: 'column' }}>
                          <Grid container spacing={3}>
                            <Grid item xs={6} sm={11}>
                              <Stack spacing={1}>
                                <InputLabel>Calculation Base Type</InputLabel>
                                <Select id="year-select" value={selectedTypes || 0} onChange={handleType} placeholder="year">

                                  <MenuItem value={1}>Rateable Value</MenuItem>
                                  <MenuItem value={2}>Capital Value</MenuItem>
                                </Select>
                              </Stack>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </MainCard>

                    <Box mb={3}></Box>
                    <MainCard>
                      <Accordion>
                        <AccordionSummary
                          aria-controls="panel1-content"
                          id="panel1-header"
                          sx={{ fontWeight: 'bolder' }}
                          disabled={accessLevel < 3}
                        >
                          Select Polices
                        </AccordionSummary>
                        <AccordionDetails sx={{ flexDirection: 'column' }}>
                          <AccordionDetails>
                            <FormGroup>
                              <Stack direction="column" spacing={0.5}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={applyPolicy.asPerOld}
                                      onChange={handlePolicyChange("asPerOld")}
                                      disabled={isCheckboxDisabledasPerOld}
                                    />
                                  }
                                  label="As Per Old"
                                />

                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={applyPolicy.minRv}
                                      onChange={handlePolicyChange("minRv")}
                                      disabled={isCheckboxDisabledMinRv}
                                    />
                                  }
                                  label="Minimum RV"
                                />

                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={applyPolicy.retention}
                                      onChange={handlePolicyChange("retention")}
                                      disabled={isCheckboxDisabledRetention}
                                    />
                                  }
                                  label="Retention"
                                />

                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={applyPolicy.mixAssessment}
                                      onChange={handlePolicyChange("mixAssessment")}
                                      disabled={isCheckboxDisabledMixAssessment}
                                    />
                                  }
                                  label="Mix Assessment"
                                />

                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={applyPolicy.newPropertyAsPerOld}
                                      onChange={handlePolicyChange("newPropertyAsPerOld")}
                                      disabled={isCheckboxDisabledNewPropertyAsPerOld}
                                    />
                                  }
                                  label="New Property As Per Old"
                                />

                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={applyPolicy.minRvOldRvZero}
                                      onChange={handlePolicyChange("minRvOldRvZero")}
                                      disabled={isCheckboxDisabledMinRvOldRvZero}
                                    />
                                  }
                                  label="Minimum RV For Old RV Zero"
                                />
                              </Stack>
                            </FormGroup>
                          </AccordionDetails>

                          <FormControlLabel control={<Radio checked={applyPolicy.retention} />} label="Rentain Factor Case Wise" />
                        </AccordionDetails>
                      </Accordion>
                    </MainCard>

                    <Box mb={3}></Box>
                    <MainCard>
                      <Accordion>
                        <AccordionSummary
                          aria-controls="panel1-content"
                          id="panel1-header"
                          sx={{ fontWeight: 'bolder' }}
                          disabled={accessLevel < 3}
                        >
                          Select Property Range
                        </AccordionSummary>
                        <AccordionDetails sx={{ flexDirection: 'column' }}>
                          {/* <Grid container spacing={2} sx={{ marginTop: 0.1 }}> */}
                          {/* <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                              <FormControl sx={{ width: '100%' }}>
                                <InputLabel>Ward No.</InputLabel>
                                <Select id="ward-no" placeholder="Ward No." onChange={handleSelectChange}>
                                  <MenuItem value={0}>Select</MenuItem>
                                  <MenuItem value={1}>1</MenuItem>
                                  <MenuItem value={2}>2</MenuItem>
                                  <MenuItem value={3}>3</MenuItem>
                                  <MenuItem value={4}>4</MenuItem>
                                  <MenuItem value={5}>5</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                              <FormControl sx={{ width: '100%' }}>
                                <InputLabel>From Property No.</InputLabel>
                                <Select id="from-property" placeholder="From Property No." onChange={handleSelectChange}>
                                  <MenuItem value={0}>Select</MenuItem>
                                  <MenuItem value={1}>1</MenuItem>
                                  <MenuItem value={2}>2</MenuItem>
                                  <MenuItem value={3}>3</MenuItem>
                                  <MenuItem value={4}>4</MenuItem>
                                  <MenuItem value={5}>5</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                              <FormControl sx={{ width: '100%' }}>
                                <InputLabel>To Property No.</InputLabel>
                                <Select id="to-property" placeholder="To Property No." onChange={handleSelectChange}>
                                  <MenuItem value={0}>Select</MenuItem>
                                  <MenuItem value={1}>1</MenuItem>
                                  <MenuItem value={2}>2</MenuItem>
                                  <MenuItem value={3}>3</MenuItem>
                                  <MenuItem value={4}>4</MenuItem>
                                  <MenuItem value={5}>5</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid> */}
                          <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
                            <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                              <Stack spacing={1}>
                                <InputLabel>Ward No</InputLabel>

                                <Select
                                  multiple
                                  sx={{ maxWidth: 150, minWidth: 150 }}
                                  value={selectedWard}
                                  onChange={handleWardChange}
                                  renderValue={(selected) => selected.join(', ')}
                                  MenuProps={{
                                    PaperProps: {
                                      sx: {
                                        maxHeight: 100
                                        // 👈 set max width here
                                      },
                                    },
                                  }}
                                >
                                  {/* SELECT ALL */}
                                  <MenuItem value="ALL">
                                    <Checkbox
                                      checked={wardList.length > 0 && selectedWard.length === wardList.length}
                                      indeterminate={
                                        selectedWard.length > 0 &&
                                        selectedWard.length < wardList.length
                                      }
                                    />
                                    <ListItemText primary="Select All" />
                                  </MenuItem>

                                  {/* WARD OPTIONS */}
                                  {wardList.map((ward) => (
                                    <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                      <Checkbox checked={selectedWard.includes(ward.NewWardNo)} />
                                      <ListItemText primary={ward.NewWardNo} />
                                    </MenuItem>
                                  ))}
                                </Select>

                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                              <Stack spacing={1}>
                                <InputLabel id="demo-number-select-label">From Properties</InputLabel>
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
                                  value={selectedPropertyNoFrom}
                                  error={!!error.selectedPropertyNoFrom}
                                  disabled={selectedWard.length !== 1}
                                  helperText={error.selectedPropertyNoFrom}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  onChange={handlePropertyChangeFrom}
                                  sx={{ width: '150px' }}
                                >
                                  {propertyNoListFrom.map((property, index) => (
                                    <MenuItem key={index} value={property.NewPropertyNo}>
                                      {property.NewPropertyNo}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                              <Stack spacing={1}>
                                <InputLabel id="demo-number-select-label">To Properties</InputLabel>
                                <FormControl fullWidth>
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
                                    sx={{ width: '150px' }}
                                    disabled={selectedWard.length !== 1}
                                    value={selectedPropertyNoTo}
                                    error={!!error.selectedPropertyNoTo}
                                    helperText={error.selectedPropertyNoTo}
                                    FormHelperTextProps={{ style: { color: 'red' } }}
                                    onChange={handlePropertyChangeTo}
                                  >
                                    {propertyNoListTo.map((property, index) => (
                                      <MenuItem key={index} value={property.NewPropertyNo}>
                                        {' '}
                                        {/* Use the correct property name */}
                                        {property.NewPropertyNo}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Stack>
                            </Grid>
                            <Grid container justifyContent="center" alignItems="center" mt={2}>
                              <Grid item xs={12} sm={4}>
                                <Stack spacing={1}>
                                  <Button variant="contained" color="success" onClick={handleClickDialog}>
                                    Save & Procced
                                  </Button>

                                  <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                                    <DialogTitle id="alert-dialog-title">L1</DialogTitle>
                                    <DialogContent>
                                      <Stack marginBottom={2}>
                                        <DialogContentText id="alert-dialog-description">Enter Security Password</DialogContentText>
                                      </Stack>
                                      <TextField
                                        required
                                        fullWidth
                                        maxWidth="sm"
                                        type="password"
                                        disabled={accessLevel < 3}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"   // ⛔ prevent browser autofill
                                        inputProps={{
                                          autoSave: 'off',            // 🔒 disable auto-save
                                          form: {
                                            autoComplete: 'off',
                                          },
                                        }}
                                      />
                                    </DialogContent>
                                    <DialogActions>
                                      <Button variant="contained" color="success" onClick={handleAction} autoFocus>
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
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </MainCard>

                    <Box mb={3}></Box>
                    <MainCard>
                      <Accordion>
                        <AccordionSummary
                          aria-controls="panel1-content"
                          id="panel1-header"
                          sx={{ fontWeight: 'bolder' }}
                          disabled={accessLevel < 3}
                        >
                          Set Appeal Parameters
                        </AccordionSummary>
                        <AccordionDetails sx={{ flexDirection: 'column' }}>
                          <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
                            <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                              <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>Min RV</InputLabel>
                                <TextField required value={minRV} onChange={(e) => {
                                  const val = e.target.value;

                                  if (/^\d{0,10}$/.test(val)) {
                                    setMinRV(val);
                                  }

                                }}
                                  inputProps={{

                                    inputMode: 'numeric', // mobile numeric keyboard
                                    pattern: '[0-9]*'     // allow only digits
                                  }}
                                  fullWidth type="text" />
                              </Stack>
                            </Grid>

                            <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                              <Stack spacing={1}>
                                <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>Max Year</InputLabel>
                                <TextField required value={maxYear} onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only 0 to 4 digits
                                  if (/^\d{0,4}$/.test(value)) {
                                    setMaxYear((pre) => value)

                                    // Update error status on change too


                                  }

                                }
                                }
                                  fullWidth type="text" />
                              </Stack>
                            </Grid>
                            <Grid container justifyContent="center" alignItems="center" mt={2}>
                              <Grid item xs={12} sm={4}>
                                <Stack spacing={1}>
                                  <Button variant="contained" color="success" onClick={handleSaveAppealParameters}>
                                    Save
                                  </Button>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </MainCard>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} lg={6}>
              <Card>
                <CardContent>
                  <Box sx={{ overflowX: 'auto', height: '400px' }}>
                    {/* Table */}
                    <Table>
                      {/* Table Header */}
                      <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                        <TableRow>
                          <TableCell>From Factor</TableCell>
                          <TableCell>To Factor</TableCell>
                          <TableCell>Factor Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {policyfactorInfo.length > 0 ? (
                          policyfactorInfo.map((item) => (
                            <TableRow key={item.FacterID}>
                              <TableCell>{item.FromFactor}</TableCell>
                              <TableCell>{item.ToFactor}</TableCell>
                              <TableCell>{item.FactorValue}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3}>No factor information available</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </CardContent>
              </Card>
              <Grid container justifyContent="center" alignItems="center" mt={2}>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1} sx={{ textAlign: 'center' }}>
                    <Button variant="contained" color="success" onClick={handleButtonClick} disabled={accessLevel < 3}>
                      Change Factor
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      ) : (
        <RetainPolicyFactor RetainPolicyFactor={handleButtonClick} />
      )}
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarType}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AutoAppeal;
