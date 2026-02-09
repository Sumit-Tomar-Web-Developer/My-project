import React, { useEffect, useState } from 'react';
import {
  Grid,
  SnackbarContent,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Box,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  Autocomplete,
  Snackbar,
  FormHelperText,
  Typography
} from '@mui/material';
import MainCard from 'components/MainCard';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { fetchFinancialYear, fetchWardList } from 'services/appeal.services';

import { getCustomTaxesByOwnerID, getPendingTaxStatusByYear, saveCustomTax } from 'services/Amc/set-cutom-taxes/setCustomTaxesServices';
import * as Yup from 'yup';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';

const SetCustomTax = () => {
  const [financialYearList, setFinancialYearList] = useState([]);

  const [financialYear, setFinancialYear] = useState('');
  const [wardList, setwardList] = useState([]);
  

  const [errors, setErrors] = useState({});
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [ward, setward] = useState('');
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [propList, setPropList] = useState([]);

  const [selectedOwnerID, setSelectedOwnerID] = useState('');
  const [TPDID, setTPDID] = useState('');
  const [propNo, setPropNo] = useState('');
  const [partNo, setPartNo] = useState('');
  const [currentTaxes, setCurrentTaxes] = useState({});
  const [pendingTaxes, setPendingTaxes] = useState({});
  const [taxType, setTaxType] = useState('pending');
  const [taxStatus, setTaxStatus] = useState('');
  const [ownerDetails, setOwnerDetails] = useState({
    OwnerName: '',
    RenterName: '',
    OccupierName: ''
  });
  const [taxDetails, setTaxDetails] = useState({
    PropertyTax: '',
    EducationTax: '',
    SpEducationTax: '',
    EmploymentTax: '',
    TreeCess: '',
    FireCess: '',
    LightCess: '',
    DrainCess: '',
    RoadCess: '',
    Sanitation: '',
    WaterBenefit: '',
    WaterBill: '',
    SewageDisposalCess: '',
    Tax1: '',
    Tax2: '',
    Tax3: '',
    Tax4: '',
    MajorBuilding: '',
    TaxTotal: 0,
    TPDID: 0,
    Interest: 0,
    Remark: '',
    IsInterestRuntime: false
  });
  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Set Custom Tax';
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
      console.log(access, 'assigned access to Bill Book Entry Page');
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



const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  const newValue =
    type === "checkbox"
      ? checked
      : [
          "PropertyTax",
          "EducationTax",
          "SpEducationTax",
          "EmploymentTax",
          "TreeCess",
          "FireCess",
          "LightCess",
          "DrainCess",
          "RoadCess",
          "Sanitation",
          "WaterBenefit",
          "WaterBill",
          "SewageDisposalCess",
          "Tax1",
          "Tax2",
          "Tax3",
          "Tax4",
          "MajorBuilding",
          "Interest",
        ].includes(name)
      ? Number(value)
      : value;

  setTaxDetails((prev) => {
    const updated = { ...prev, [name]: newValue };
    const TAX_FIELDS = [
      "PropertyTax",
      "EducationTax",
      "SpEducationTax",
      "EmploymentTax",
      "TreeCess",
      "FireCess",
      "LightCess",
      "DrainCess",
      "RoadCess",
      "Sanitation",
      "WaterBenefit",
      "WaterBill",
      "SewageDisposalCess",
      "Tax1",
      "Tax2",
      "Tax3",
      "Tax4",
      "MajorBuilding",
    ];

    let sum = TAX_FIELDS.reduce((acc, field) => acc + (parseFloat(updated[field]) || 0), 0);

    // Include Interest if present
    if (updated.Interest) sum += parseFloat(updated.Interest) || 0;

    return { ...updated, TaxTotal: sum };
  });
};

  const handleTaxTypeChange = (event) => {
    setTaxType(event.target.value);
  };

  const handleClickDialog = async () => {
    const dataToValidate = {
      financialYear,
      ward,
      selectedOwnerID
    };

    console.log(dataToValidate);
    try {
      await validationSchema.validate(dataToValidate, { abortEarly: false });
      setOpenDialog(true);
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      console.error('Validation Error:', validationErrors);
    }
  };

  // Validation schema
  const validationSchema = Yup.object({
    financialYear: Yup.string().required('One of the Year must be selected'),
    ward: Yup.string().required('One of the Ward must be selected')
  });


const handleWardChange = async (event) => {
  const selectedWard = event.target.value;
  setward(selectedWard);
  setPropNo('');
  setPartNo('');
  setSelectedOwnerID(null);
  try {
    const response = await fetchPropertyRangeByWard(selectedWard);
    const propertyRange = response.properties; // <- use .properties array
    if (!Array.isArray(propertyRange)) throw new Error("Invalid property range");

    // Sort: main property first, then partitions
    const sortedProps = propertyRange.sort((a, b) => {
      const propA = parseInt(a.NewPropertyNo, 10);
      const propB = parseInt(b.NewPropertyNo, 10);

      if (propA !== propB) return propA - propB;

      const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
      const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;
      return partA - partB;
    });

    setPropList(sortedProps);
  } catch (error) {
    console.error('Error fetching property range:', error);
  }

  setErrors((prevErrors) => ({ ...prevErrors, ward: undefined }));
};


  useEffect(() => {
    if (taxType === 'current' && currentTaxes) {
      setTaxDetails(currentTaxes);
    } else if (taxType === 'pending' && pendingTaxes) {
      setTaxDetails(pendingTaxes);
    }
  }, [taxType, currentTaxes, pendingTaxes]);

  useEffect(() => {
    fetchFinancialYear()
      .then((yearList) => {
console.log(yearList, 'API Response');
        setFinancialYearList(yearList);
      })
      .catch((err) => {
        console.error('Error fetching financial years:', err);
      });

    fetchWardList()
      .then((finList) => {
        const sortedWardList = finList.sort((a, b) => a.NewWardNo - b.NewWardNo); 
        setwardList(sortedWardList);
      })
      .catch((error) => {
        console.error('Error fetching Ward list:', error);
      });
  }, []);


  useEffect(() => {
  const fetchDetails= async () => {
    if (selectedOwnerID) {
      try {
        const response = await getCustomTaxesByOwnerID(selectedOwnerID);
        console.log('Taxes:', response);
        setOwnerDetails(response.ownerDetails || {});
        setTaxDetails(response.pendingTaxes || {});
        setCurrentTaxes(response.currentTaxes);
        setPendingTaxes(response.pendingTaxes);
        //setTPDID(response.pendingTaxes.TPDID || 0);
      } catch (error) {
        console.error('Error fetching custom taxes:', error);
        setOwnerDetails({});
        setTaxDetails({});
        setCurrentTaxes({});
        setPendingTaxes({});
        //setTPDID(0);
      }
    }
  };

  fetchDetails();


}, [selectedOwnerID]);

// Sync taxDetails only if data exists, otherwise clear
useEffect(() => {
  if (taxType === 'current' && currentTaxes && Object.keys(currentTaxes).length > 0) {
    setTaxDetails(currentTaxes);
  } else if (taxType === 'pending' && pendingTaxes && Object.keys(pendingTaxes).length > 0) {
    setTaxDetails(pendingTaxes);
  } else {
    // clear all fields
    setTaxDetails({
      PropertyTax: '',
      EducationTax: '',
      SpEducationTax: '',
      EmploymentTax: '',
      TreeCess: '',
      FireCess: '',
      LightCess: '',
      DrainCess: '',
      RoadCess: '',
      Sanitation: '',
      WaterBenefit: '',
      WaterBill: '',
      SewageDisposalCess: '',
      Tax1: '',
      Tax2: '',
      Tax3: '',
      Tax4: '',
      MajorBuilding: '',
      TaxTotal: 0,
      TPDID: 0,
      Interest: 0,
      Remark: '',
      IsInterestRuntime: false
    });
  }
}, [taxType, currentTaxes, pendingTaxes]);



  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClear = () => {
    setFinancialYear('');
    setward('');
    setPropNo('');
    setPartNo('');
    setSelectedOwnerID(null);
    setOwnerDetails({
      RenterName: '',
      OccupierName: '',
      OwnerName:''
    });
    setTaxStatus('');
    setTaxDetails({
    PropertyTax: '',
    EducationTax: '',
    SpEducationTax: '',
    EmploymentTax: '',
    TreeCess: '',
    FireCess: '',
    LightCess: '',
    DrainCess: '',
    RoadCess: '',
    Sanitation: '',
    WaterBenefit: '',
    WaterBill: '',
    SewageDisposalCess: '',
    Tax1: '',
    Tax2: '',
    Tax3: '',
    Tax4: '',
    MajorBuilding: '',
    TaxTotal: 0,
    TPDID: 0,
    Interest: 0,
    Remark: '',
    IsInterestRuntime: false
    });
  };


const handleCloseDialog = async () => {
  setOpenDialog(false);
  try {
    const levelname = 'L4';
    // Validate password
    const passwordCheckResponse = await levelPassword(levelname, password);
    console.log(passwordCheckResponse, 'pass');
    if (passwordCheckResponse.status !== 200) {
      throw new Error('Invalid password');
    }

    // Save the tax
    const response = await saveCustomTax(taxDetails, selectedOwnerID, taxType, financialYear);

    // Show snackbar immediately with the response
    setSnackbarSeverity('success');

     setSnackbarOpen(true);
     setReceivedMessage(response.message)
     setSnackbarMessage(receivedMessage); 

    // Clear the form
    handleClear();
    setPassword('');

  } catch (error) {
    console.error('Error during API call:', error);

    const errorMessage =
      error?.response?.data?.error || 'Failed to proceed. Please try again.';

    setSnackbarSeverity('error');
    setSnackbarMessage(errorMessage);
    setSnackbarOpen(true);

    // Optionally update error state
    setErrors((prevErrors) => ({
      ...prevErrors,
      apiError: errorMessage
    }));
  }
};

 


  const handleChangeYear = async (event) => {
    setFinancialYear(event.target.value);
  };


  useEffect(() => {
    const fetchTaxStatus = async () => {
      const { message } = await getPendingTaxStatusByYear(financialYear, selectedOwnerID);
      console.log(message);
      setTaxStatus(message);
    };

    if (financialYear) {
      fetchTaxStatus();
      setErrors((prevErrors) => ({ ...prevErrors, financialYear: undefined }));
    }
  }, [financialYear, selectedOwnerID]);





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
        <MainCard title="Custom Tax">
          <MainCard>
            <Box mb={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2.1}>
                  <Stack spacing={1}>
                    <InputLabel>Financial Year</InputLabel>
                    <Select onChange={handleChangeYear} value={financialYear} disabled={accessLevel < 3}>
                      <MenuItem value="" disabled>
                        Select Option
                      </MenuItem>
                      {financialYearList.map((fin) => (
                        <MenuItem key={fin.FinanceYearRange} value={fin.FinanceYearRange}>
                          {fin.FinanceYearRange}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.financialYear && <FormHelperText style={{ color: 'red' }}>{errors.financialYear}</FormHelperText>}
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={2.1}>
                  <Stack spacing={1}>
                    <InputLabel>Ward No</InputLabel>
                    <Select
                      onChange={handleWardChange}
                      fullWidth
                      value={ward}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflowY: 'auto'
                          }
                        }
                      }}
                      disabled={accessLevel < 3}
                    >
                      <MenuItem value="" disabled>
                        Select Option
                      </MenuItem>
                      {wardList.map((wd) => (
                        <MenuItem key={wd.NewWardNo} value={wd.NewWardNo}>
                          {wd.NewWardNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.ward && <FormHelperText style={{ color: 'red' }}>{errors.ward}</FormHelperText>}
                  </Stack>
                </Grid>
               <Grid item xs={6} sm={2.5}>
  <Stack spacing={1}>
    <InputLabel>Property No.</InputLabel>
<Autocomplete
  options={propList}
  value={propList.find((x) => String(x.OwnerID) === String(selectedOwnerID)) || null}
  onChange={(_, selectedOption) => {
    if (!selectedOption) {
      setSelectedOwnerID(null);
      setPropNo('');
      setPartNo('');
      console.log('OwnerID cleared');
      return;
    }

    setPropNo(selectedOption.NewPropertyNo);
    setPartNo(selectedOption.NewPartitionNo || '');
    setSelectedOwnerID(selectedOption.OwnerID);

    // ✅ Log the selected OwnerID immediately
    console.log('Selected OwnerID:', selectedOption.OwnerID);
  }}
  inputValue={propNo}
  onInputChange={(_, newInput) => {
    setPropNo(newInput);
  }}
  isOptionEqualToValue={(a, b) => a?.OwnerID === b?.OwnerID}
  getOptionLabel={(o) => o.NewPartitionNo ? `${o.NewPropertyNo}_${o.NewPartitionNo}` : o.NewPropertyNo}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      placeholder="Property No"
      fullWidth
      disabled={accessLevel < 3}
    />
  )}
/>





  </Stack>
</Grid>

<Grid item xs={6} sm={2}>
  <Stack spacing={1}>
    <InputLabel>Partition No.</InputLabel>
    <TextField
      required
      placeholder="Partition No."
      fullWidth
      value={partNo} // shows partition number
      autoComplete="given-name"
      disabled={accessLevel < 3}
    />
  </Stack>
</Grid>

              </Grid>
            </Box>
          </MainCard>
          <MainCard>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3.5}>
                <Stack spacing={1}>
                  <InputLabel>Owner Name</InputLabel>
                  <TextField
                    name="OwnerName"
                    value={ownerDetails?.OwnerName || ''}
                    variant="outlined"
                    error={!!errors.OwnerName}
                    helperText={errors.OwnerName}
                    //onChange={handleOwnerDetailsChange}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3.5}>
                <Stack spacing={1}>
                  <InputLabel>Renter Name</InputLabel>
                  <TextField
                    value={ownerDetails?.RenterName || ''}
                    variant="outlined"
                    name="RenterName"
                    error={!!errors.RenterName}
                    helperText={errors.RenterName}
                    //onChange={handleOwnerDetailsChange}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3.5}>
                <Stack spacing={1}>
                  <InputLabel>Occupier Name</InputLabel>
                  <TextField
                    value={ownerDetails?.OccupierName || ''}
                    name="OccupierName"
                    error={!!errors.OccupierName}
                    helperText={errors.OccupierName}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    variant="outlined"
                    //onChange={handleOwnerDetailsChange}
                    disabled={accessLevel < 3}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={2.6}>
                <Stack>
                  <InputLabel>Tax Type:</InputLabel>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-label="color"
                      name="color"
                      id="color"
                      value={taxType}
                      onChange={handleTaxTypeChange}
                      disabled={accessLevel < 3}
                    >
                      <Box marginTop={1.8}>
                        <FormControlLabel value="current" control={<Radio />} label="Current" disabled={accessLevel < 3} />
                      </Box>
                      <Box ml={2.5} marginTop={1.8}>
                        <FormControlLabel value="pending" control={<Radio color="error" />} label="Pending" disabled={accessLevel < 3} />
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={2.3}>
                <Stack>
                  <InputLabel>Owner Id</InputLabel>
                </Stack>
                <Stack spacing={1} marginTop={1}>
                  <TextField
                    required
                    fullWidth
                    value={selectedOwnerID}
                    name="selectedOwnerID"
                    error={!!errors.selectedOwnerID}
                    //onChange={handleChangeOwnerId}
                    helperText={errors.selectedOwnerID}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3 || taxType === 'pending'||taxType === 'current'}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Stack>
                  <InputLabel sx={{ color: 'red', mt: 4, fontSize: '1.2rem', fontWeight: 'bold' }}>{taxStatus}</InputLabel>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
          <MainCard>
            <Box marginTop={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Property</InputLabel>
                    <TextField
                      required
                      name="PropertyTax"
                      value={taxDetails.PropertyTax}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.PropertyTax}
                      helperText={errors.PropertyTax}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Education</InputLabel>
                    <TextField
                      required
                      name="EducationTax"
                      value={taxDetails.EducationTax}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.EducationTax}
                      helperText={errors.EducationTax}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Sp.Educ</InputLabel>
                    <TextField
                      required
                      name="SpEducationTax"
                      value={taxDetails.SpEducationTax}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.SpEducationTax}
                      helperText={errors.SpEducationTax}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Emp</InputLabel>
                    <TextField
                      required
                      name="EmploymentTax"
                      value={taxDetails.EmploymentTax}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.EmploymentTax}
                      helperText={errors.EmploymentTax}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Tree</InputLabel>
                    <TextField
                      required
                      name="TreeCess"
                      value={taxDetails.TreeCess}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.TreeCess}
                      helperText={errors.TreeCess}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Fire</InputLabel>
                    <TextField
                      required
                      name="FireCess"
                      value={taxDetails.FireCess}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.FireCess}
                      helperText={errors.FireCess}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Light</InputLabel>
                    <TextField
                      required
                      name="LightCess"
                      value={taxDetails.LightCess}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.LightCess}
                      helperText={errors.LightCess}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.4}>
                  <Stack spacing={1}>
                    <InputLabel>Drain</InputLabel>
                    <TextField
                      required
                      name="DrainCess"
                      value={taxDetails.DrainCess}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.DrainCess}
                      helperText={errors.DrainCess}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Road</InputLabel>
                    <TextField
                      required
                      name="RoadCess"
                      value={taxDetails.RoadCess}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.RoadCess}
                      helperText={errors.RoadCess}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Sanitation</InputLabel>
                    <TextField
                      required
                      name="Sanitation"
                      value={taxDetails.Sanitation}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.Sanitation}
                      helperText={errors.Sanitation}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>W.Cess</InputLabel>
                    <TextField
                      required
                      name="WaterBenefit"
                      value={taxDetails.WaterBenefit}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.WaterBenefit}
                      helperText={errors.WaterBenefit}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>W.Ben</InputLabel>
                    <TextField
                      required
                      name="WaterBill"
                      value={taxDetails.WaterBill}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.WaterBill}
                      helperText={errors.WaterBill}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Sewage</InputLabel>
                    <TextField
                      required
                      name="SewageDisposalCess"
                      value={taxDetails.SewageDisposalCess}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.SewageDisposalCess}
                      helperText={errors.SewageDisposalCess}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Tax1</InputLabel>
                    <TextField
                      required
                      name="Tax1"
                      value={taxDetails.Tax1}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.Tax1}
                      helperText={errors.Tax1}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>M Build</InputLabel>
                    <TextField
                      required
                      name="MajorBuilding"
                      value={taxDetails.MajorBuilding}
                      onChange={handleChange}
                      InputProps={{ readOnly: taxType === 'current' }}
                      error={!!errors.MajorBuilding}
                      helperText={errors.MajorBuilding}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </MainCard>
          <MainCard>
            <Box marginTop={2}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={2.2}>
                  <Stack spacing={1}>
                    <InputLabel>Interest</InputLabel>
                    <TextField
                      required
                      value={taxDetails.Interest}
                      name="Interest"
                      onChange={handleChange}
                      error={!!errors.Interest}
                      helperText={errors.Interest}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={2.5}>
                  <Stack spacing={1} marginTop={4}>
                    <FormControlLabel
                      control={<Checkbox checked={taxDetails.IsInterestRuntime}  name="IsInterestRuntime" onChange={handleChange} />}
                      label={<Box fontWeight="bold">With runtime interest</Box>}
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Stack spacing={1}>
                    <InputLabel>Remark</InputLabel>
                    <TextField required value={taxDetails.Remark} name="Remark"  onChange={handleChange} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={2.2}>
                  <Stack spacing={1}>
                    <InputLabel>Total</InputLabel>
                    <TextField value={taxDetails.TaxTotal} required disabled={accessLevel < 3} />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            <Box marginTop={4} display="flex">
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="info" onClick={handleClickDialog} disabled={accessLevel < 3}>
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
                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                      <DialogTitle id="alert-dialog-title">L4 LEVEL </DialogTitle>
                      <DialogContent>
                        <Stack marginBottom={2}>
                          <DialogContentText id="alert-dialog-description">Submit the password</DialogContentText>
                        </Stack>

                        <TextField
                          required
                          value={password}
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                          fullWidth
                          maxWidth="sm"
                        ></TextField>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" color="success" onClick={handleCloseDialog} autoFocus>
                          Submit
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="secondary" disabled={accessLevel < 3}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </MainCard>
        </MainCard>
      )}
    </>
  );

};

export default SetCustomTax;
