import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  Snackbar,
  Alert,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  InputLabel,
  Radio,
  Stack,
  TextField,
  Typography,
  RadioGroup,
  IconButton,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import React, { useState, useEffect } from 'react';

// project import
import MainCard from 'components/MainCard';
import { deletePolicyFactor, getFactorList, saveAndUpdatePolicyFactors } from 'services/factor_policy_master.service';
import { DeleteOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
// ==============================|| SAMPLE PAGE ||============================== //

function RetainPolicyFactor() {
  //Desci Select

  const [factorList, setFactorList] = useState([]);
  const [factorYearList, setFactorYearList] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState('retainPolicyFactor');
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedYearRow, setSelectedYearRow] = useState(null);

  // radio
  const [selectedValue, setSelectedValue] = useState();

  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [hideNewtaxHead, setHideNewTaxHead] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  const [selectedRowsYr, setSelectedRowsYr] = useState([]);
  const [indeterminateYr, setIndeterminateYr] = useState(false);
  const [allCheckedYr, setAllCheckedYr] = useState(false);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Retain Policy Factor';
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
      console.log(access, 'assigned access to Retain policy factor Page');
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchfactorlist = async () => {
      try {
        const fetched_factorlist = await getFactorList();
        setFactorList(fetched_factorlist);
        setFactorYearList(fetched_factorlist);
      } catch (error) {
        console.error('Error fetching Floor:', error);
        setFactorList([]);
      }
    };
    fetchfactorlist();
  }, []);

  //checkbox range
  useEffect(() => {
    const totalSelected = selectedRowsYr.length;
    const totalCheckboxes = factorYearList.length;
    setAllCheckedYr(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminateYr(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRowsYr, factorYearList]);

  //checkbox
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = factorList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, factorList]);

  const [factorData, setFactorData] = useState({
    FacterID: 0,
    FromFactor: '',
    ToFactor: '',
    FactorValue: ''
  });

  const [factorYearData, setFactorYearData] = useState({
    FacterID: 0,
    FromYear: '',
    ToYear: '',
    FactorValue: ''
  });

  // Validation schemas
  const factorSchema = Yup.object().shape({
    FromFactor: Yup.number().required('Factor From is required'),
    ToFactor: Yup.number().required('Factor To is required'),
    FactorValue: Yup.number().required('Factor Value is required')
  });

  const yearSchema = Yup.object().shape({
    FromYear: Yup.number().required('YearFrom is required'),
    ToYear: Yup.number().required('YearTo is required'),
    FactorValue: Yup.number().required('Factor Value is required')
  });

  const handleDeleteFactor = async () => {
    setOpenDeleteDialog(true);
  };

  const handleYearDeleteFactor = async () => {
  setOpenDeleteDialogYear(true);
  };

  const handleRadioChange = (e) => {
    const radioId = e.target.id;
    if (radioId === 'retainPolicyFactor') {
      setSelectedOverlay('retainPolicyFactor');
    } else if (radioId === 'retainPolicyYear') {
      setSelectedOverlay('retainPolicyYear');
    } else {
      setSelectedOverlay(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    const isNumeric = (val) => !isNaN(val);
    const isFloatOrInt = (val) => !isNaN(val) && (Number.isInteger(parseFloat(val)) || val.toString().indexOf('.') !== -1);
    const isFourDigits = (val) => /^\d{4}$/.test(val);

    if (selectedOverlay === 'retainPolicyFactor') {
      switch (name) {
        case 'FromFactor':
          if (!isNumeric(value)) {
            error = 'Only Numbers are allowed';
          } else if (parseFloat(value) >= parseFloat(factorData.ToFactor)) {
            error = 'Factor From should be less than To';
          }
          break;
        case 'ToFactor':
          if (!isNumeric(value)) {
            error = 'Only Numbers are allowed';
          } else if (parseFloat(value) <= parseFloat(factorData.FromFactor)) {
            error = 'Factor To should be greater than From';
          }
          break;
        case 'FactorValue':
          if (!isFloatOrInt(value)) {
            error = 'Only Numbers are allowed.';
          }
          break;
        default:
          break;
      }

      setFactorData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    } else if (selectedOverlay === 'retainPolicyYear') {
      switch (name) {
        case 'FromYear':
          if (!isNumeric(value) || !isFourDigits(value)) {
            error = 'Only 4 digit numbers are allowed';
          } else if (parseInt(value) >= parseInt(factorYearData.ToYear)) {
            error = 'Year Range From should be less than Year Range To';
          }
          break;
        case 'ToYear':
          if (!isNumeric(value) || !isFourDigits(value)) {
            error = 'Only 4 digit numbers are allowed';
          } else if (parseInt(value) <= parseInt(factorYearData.FromYear)) {
            error = 'Year Range To should be greater than Year Range From';
          }
          break;
        case 'FactorValue':
          if (!isFloatOrInt(value)) {
            error = 'Only Numbers are allowed ';
          }
          break;
        default:
          break;
      }

      setFactorYearData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleCancel = (e) => {
    if (selectedOverlay === 'retainPolicyFactor') {
      setFactorData({
        FromFactor: '',
        ToFactor: '',
        FactorValue: ''
      });
    } else if (selectedOverlay === 'retainPolicyYear') {
      setFactorYearData({
        FactorValue: '',
        FromYear: '',
        ToYear: ''
      });
    }
    setErrors({});
  };

  // const handleSaveFactor = async () => {
  //   try {
  //     const factorDataToSave = {
  //       ...factorData,
  //       FacterID: factorData.FacterID || 0
  //     };

  //     await factorSchema.validate(factorDataToSave, { abortEarly: false });
  //     let response;

  //     if (factorDataToSave.FacterID === 0) {
  //       response = await saveAndUpdatePolicyFactors(factorDataToSave);

  //       console.log(response, 'success factor saved');
  //       if (response.status === 200 || response.status === 201) {
  //         setReceivedMessage(response.message);
  //         setSnackbarSeverity('success');
  //         setSnackbarMessage(response.message || 'Factor saved successfully');
  //         setSnackbarOpen(true);
  //         setFactorList((factorList) => [...factorList, response.res.data.factInfo]);
  //         handleCancel();
  //       } else {
  //         throw new Error(response.message || 'An error occurred while saving factor');
  //       }
  //     } else {
  //       response = await saveAndUpdatePolicyFactors(factorDataToSave);

  //       console.log(response, 'success updating factor');
  //       if (response.status === 200 || response.status === 201) {
  //         setReceivedMessage(response.message);
  //         setSnackbarSeverity('success');
  //         setSnackbarMessage(response.message || 'Factor updated successfully');
  //         setSnackbarOpen(true);
  //         setFactorList((factorList) =>
  //           factorList.map((factor) => (factor.FacterID === response.res.data.Factor.FacterID ? response.res.data.Factor : factor))
  //         );
  //         handleCancel();
  //       } else {
  //         throw new Error(response.message || 'An error occurred while updating factor data');
  //       }
  //     }
  //     handleCancel(); // Reset form data
  //   } catch (validationErrors) {
  //     if (validationErrors.inner && validationErrors.inner.length > 0) {
  //       const formattedErrors = validationErrors.inner.reduce((acc, err) => {
  //         return { ...acc, [err.path]: err.message };
  //       }, {});
  //       setErrors(formattedErrors);
  //     } else {
  //       console.error('Validation Error:', validationErrors);
  //     }
  //   }
  // };

  const handleSaveFactor = async () => {
    try {
      const factorDataToSave = {
        ...factorData,
        FacterID: factorData.FacterID || 0
      };

      // Validate the form data against the schema
      await factorSchema.validate(factorDataToSave, { abortEarly: false });

      // Check for duplicate factors or overlapping ranges
      const isDuplicate = factorList.some(
        (factor) =>
          factor.FacterID !== factorDataToSave.FacterID &&
          factor.FromFactor === factorDataToSave.FromFactor &&
          factor.ToFactor === factorDataToSave.ToFactor
      );

      const isOverlapping = factorList.some(
        (factor) =>
          factor.FacterID !== factorDataToSave.FacterID &&
          ((factorDataToSave.FromFactor >= factor.FromFactor && factorDataToSave.FromFactor <= factor.ToFactor) ||
            (factorDataToSave.ToFactor >= factor.FromFactor && factorDataToSave.ToFactor <= factor.ToFactor) ||
            (factorDataToSave.FromFactor <= factor.FromFactor && factorDataToSave.ToFactor >= factor.ToFactor))
      );

      if (isDuplicate) {
        setSnackbarSeverity('error');
        setReceivedMessage('This factor range already exists.');
        setSnackbarOpen(true);
        return;
      }

      if (isOverlapping) {
        setSnackbarSeverity('error');
        setReceivedMessage('The factor range overlaps with an existing factor.');
        setSnackbarOpen(true);
        return;
      }

      // Save or update factor
      let response;
      if (factorDataToSave.FacterID === 0) {
        response = await saveAndUpdatePolicyFactors(factorDataToSave);
        console.log(response, 'success factor saved');
      } else {
        response = await saveAndUpdatePolicyFactors(factorDataToSave);
        console.log(response, 'success updating factor');
      }

      if (response.status === 200 || response.status === 201) {
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarMessage(response.message || `Factor ${factorDataToSave.FacterID === 0 ? 'saved' : 'updated'} successfully`);
        setSnackbarOpen(true);

        if (factorDataToSave.FacterID === 0) {
          setFactorList((factorList) => [...factorList, response.res.data.factInfo]);
        } else {
          setFactorList((factorList) =>
            factorList.map((factor) => (factor.FacterID === response.res.data.Factor.FacterID ? response.res.data.Factor : factor))
          );
        }
        handleCancel(); // Reset form data
      } else {
        throw new Error(response.message || 'An error occurred while saving/updating factor');
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

  const handleYearFactor = async () => {
    try {
      const factorDataToSave = {
        ...factorYearData,
        FacterID: factorYearData.FacterID || 0
      };

      await yearSchema.validate(factorDataToSave, { abortEarly: false });
      let response;

      // Check for duplicate factors or overlapping ranges
      const isDuplicate = factorYearList.some(
        (factor) =>
          factor.FacterID !== factorDataToSave.FacterID &&
          factor.FromYear === factorDataToSave.FromYear &&
          factor.ToYear === factorDataToSave.ToYear
      );

      const isOverlapping = factorYearList.some(
        (factor) =>
          factor.FacterID !== factorDataToSave.FacterID &&
          ((factorDataToSave.FromYear >= factor.FromYear && factorDataToSave.FromYear <= factor.ToYear) ||
            (factorDataToSave.ToYear >= factor.FromYear && factorDataToSave.ToYear <= factor.ToYear) ||
            (factorDataToSave.FromYear <= factor.FromFactor && factorDataToSave.ToYear >= factor.ToYear))
      );

      if (isDuplicate) {
        setSnackbarSeverity('error');
        setReceivedMessage('This year range already exists.');
        setSnackbarOpen(true);
        return;
      }

      if (isOverlapping) {
        setSnackbarSeverity('error');
        setReceivedMessage('The year range overlaps with an existing factor.');
        setSnackbarOpen(true);
        return;
      }

      if (factorDataToSave.FacterID === 0) {
        response = await saveAndUpdatePolicyFactors(factorDataToSave);
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Factor year saved successfully');
          setSnackbarOpen(true);
          setFactorYearList((factorYearList) => [...factorYearList, response.res.data.factInfo]);
          handleCancel();
        } else {
          throw new Error(response.message || 'An error occurred while saving factor year');
        }
      } else {
        response = await saveAndUpdatePolicyFactors(factorDataToSave);
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Factor year updated successfully');
          setSnackbarOpen(true);
          setFactorYearList((factorYearList) =>
            factorYearList.map((factor) => (factor.FacterID === response.res.data.Factor.FacterID ? response.res.data.Factor : factor))
          );
          handleCancel();
        } else {
          throw new Error(response.message || 'An error occurred while updating factor year data');
        }
      }
      //handleYearCancelClick(); // Reset form data
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

  //edit
  const handleRowClick = (factor) => {
    setFactorData({
      FacterID: factor.FacterID,
      FromFactor: factor.FromFactor,
      ToFactor: factor.ToFactor,
      FactorValue: factor.FactorValue
    });
  };

  const handleRowClickYears = (factor) => {
    setFactorYearData({
      FacterID: factor.FacterID,
      FromYear: factor.FromYear,
      ToYear: factor.ToYear,
      FactorValue: factor.FactorValue
    });
  };

  const handleCheckboxChange = (event, factor) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, factor]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((selectedFactor) => selectedFactor.FacterID !== factor.FacterID));
    }
  };
  const handleCheckboxChangeYr = (event, factor) => {
    if (event.target.checked) {
      setSelectedRowsYr((prevSelected) => [...prevSelected, factor]);
    } else {
      setSelectedRowsYr((prevSelected) => prevSelected.filter((selectedFactor) => selectedFactor.FacterID !== factor.FacterID));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(factorList);
    } else {
      setSelectedRows([]);
    }
  };
  const handleSelectAllYr = (event) => {
    if (event.target.checked) {
      setSelectedRowsYr(factorYearList);
    } else {
      setSelectedRowsYr([]);
    }
  };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
        const [openDeleteDialogYear, setOpenDeleteDialogYear] = useState(false);

const handleCancelDelete = () => {
  setOpenDeleteDialog(false);
};

const handleCancelDeleteYear = () => {
  setOpenDeleteDialogYear(false);
};


const handleConfirmDeleteYear = async () => {
    try {
      const IDsToDelete = selectedRowsYr.map((row) => Number(row.FacterID)).filter((id) => Number.isInteger(id) && id > 0);

      if (IDsToDelete.length > 0) {
        const response = await deletePolicyFactor(IDsToDelete);
        setFactorYearList((factorYearList) => factorYearList.filter((factor) => !IDsToDelete.includes(factor.FacterID)));
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCancel();
        setSelectedRowsYr([]);
        setOpenDeleteDialogYear(false);
      } else {
        console.log('No valid IDs to delete');
        setReceivedMessage('No valid factors selected for deletion');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting factor:', error);
      setReceivedMessage(error.response?.data?.message || 'An error occurred');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  
}


const handleConfirmDelete = async () => {
   console.log('Delete Factor');
    try {
      console.log('Selected Rows:', selectedRows);
      const IDsToDelete = selectedRows.map((row) => Number(row.FacterID)).filter((id) => Number.isInteger(id) && id > 0);
      console.log('Mapped and Filtered IDs:', IDsToDelete);

      if (IDsToDelete.length > 0) {
        console.log('IDsToDelete:', IDsToDelete);
        const response = await deletePolicyFactor(IDsToDelete);
        console.log('API Response:', response);
        setFactorList((factorList) => factorList.filter((factor) => !IDsToDelete.includes(factor.FacterID)));
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCancel();
        setSelectedRows([]);
        setOpenDeleteDialog(false);
      } else {
        console.log('No valid IDs to delete');
        setReceivedMessage('No valid factors selected for deletion');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting factor:', error);
      setReceivedMessage(error.response?.data?.message || 'An error occurred');
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
        <MainCard title="Retain Taxes">
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1}>
                    <RadioGroup value={selectedValue} onChange={handleRadioChange} row>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={selectedOverlay === 'retainPolicyFactor'}
                            value="retainPolicyFactor"
                            name="propertyType"
                            id="retainPolicyFactor"
                          />
                        }
                        label="Retain Policy Factor"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            name="propertyType"
                            checked={selectedOverlay === 'retainPolicyYear'}
                            id="retainPolicyYear"
                            value="retainPolicyYear"
                          />
                        }
                        label="Retain Policy Year"
                      />
                    </RadioGroup>
                  </Stack>
                </Grid>
                {selectedOverlay === 'retainPolicyFactor' && (
                  <>
                    <Grid item xs={12} md={5} lg={7}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                        Add Factor
                      </Typography>
                      <Grid container spacing={1} alignItems="flex-start"  mt={2}>
                       
                          <Grid item xs={12} sm={4}>
                            <Stack spacing={1}>
                              <InputLabel>Factor Range From</InputLabel>
                              <FormControl sx={{ width: '100%' }}>
                                <TextField
                                  placeholder="Factor Range From"
                                  name="FromFactor"
                                  value={factorData.FromFactor}
                                  onChange={handleInputChange}
                                  error={!!errors.FromFactor}
                                  helperText={errors.FromFactor}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  disabled={accessLevel < 3}
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Stack spacing={1}>
                              <InputLabel>Factor Range To</InputLabel>
                              <FormControl sx={{ width: '100%' }}>
                                <TextField
                                  placeholder="Factor Range To"
                                  name="ToFactor"
                                  value={factorData.ToFactor}
                                  onChange={handleInputChange}
                                  error={!!errors.ToFactor}
                                  helperText={errors.ToFactor}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  disabled={accessLevel < 3}
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Stack spacing={1}>
                              <InputLabel>Factor Value</InputLabel>
                              <FormControl sx={{ width: '100%' }}>
                                <TextField
                                  placeholder="Factor Value"
                                  name="FactorValue"
                                  value={factorData.FactorValue}
                                  onChange={handleInputChange}
                                  error={!!errors.FactorValue}
                                  helperText={errors.FactorValue}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  disabled={accessLevel < 3}
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Box marginTop={4}>
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
                              <Grid item xs={12} sm={8}>
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <Button variant="contained" color="success" onClick={handleSaveFactor} disabled={accessLevel < 3}>
                                    Save
                                  </Button>
                                  <Button variant="contained" color="secondary" onClick={handleCancel} disabled={accessLevel < 3}>
                                    Clear
                                  </Button>
                                  <Button variant="contained" color="error" onClick={handleDeleteFactor} disabled={accessLevel < 4}>
                                    Delete
                                  </Button>
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
                                </Stack>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                     
                    </Grid>
                    {/* after6 */}
                    <Grid item xs={12} md={5} lg={5}>
                      <Box boxShadow={3} padding>
                        <Card>
                          <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                              Factor List
                            </Typography>
                            <Box sx={{ overflowX: 'auto', height: '230px',overflow: 'auto' }}>
                              {/* Table */}
                              <Table stickyHeader>
                                {/* Table Header */}
                                <TableHead>
                                  <TableRow sx={{ 
                                 width: '1vw', 
                                   position: 'sticky', 
                                   top: 0, 
                                   zIndex: 10 
                                  }}>
                                    <TableCell>
                                      <Checkbox
                                        checked={allChecked}
                                        indeterminate={indeterminate}
                                        onChange={handleSelectAll}
                                        disabled={accessLevel < 3}
                                      />
                                    </TableCell>
                                    <TableCell>Edit</TableCell>
                                    <TableCell> Factor From</TableCell>
                                    <TableCell> Factor To</TableCell>
                                    <TableCell> Factor Value</TableCell>
                                  </TableRow>
                                </TableHead>

                                {/* Table Body */}
                                <TableBody>
                                  {factorList.map((factor, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <Checkbox
                                          checked={selectedRows.includes(factor)}
                                          onChange={(event) => handleCheckboxChange(event, factor)}
                                          onClick={(e) => e.stopPropagation()}
                                          disabled={accessLevel < 3}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <IconButton
                                          color={selectedRow && selectedRow.FacterID === factor.FacterID ? 'success' : 'primary'}
                                          onClick={() => handleRowClick(factor)}
                                          disabled={accessLevel < 3}
                                        >
                                          {selectedRow && selectedRow.FacterID === factor.FacterID ? <SendOutlined /> : <EditTwoTone />}
                                        </IconButton>
                                      </TableCell>

                                      <TableCell>{factor.FromFactor}</TableCell>
                                      <TableCell>{factor.ToFactor}</TableCell>
                                      <TableCell>{factor.FactorValue}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>
                  </>
                )}

                {selectedOverlay === 'retainPolicyYear' && (
                  <>
                    <Grid item xs={12} md={5} lg={7}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                        Add Year
                      </Typography>
                      <Grid container spacing={1} alignItems="flex-start"  mt={2}>
                      {/* <Grid container justifyContent="center" alignItems="center" mt={2}> */}
                      
                          <Grid item xs={12} sm={4}>
                            <Stack spacing={1}>
                              <InputLabel>Year Range From</InputLabel>
                              <FormControl sx={{ width: '100%' }}>
                                <TextField
                                  placeholder="Year Range From"
                                  name="FromYear"
                                  value={factorYearData.FromYear}
                                  onChange={handleInputChange}
                                  error={!!errors.FromYear}
                                  helperText={errors.FromYear ||""}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  disabled={accessLevel < 3}
                                   inputProps={{ maxLength: 4 }} 
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Stack spacing={1}>
                              <InputLabel>Year Range To</InputLabel>
                              <FormControl sx={{ width: '100%' }}>
                                <TextField
                                  placeholder="Year Range To"
                                  name="ToYear"
                                  value={factorYearData.ToYear}
                                  onChange={handleInputChange}
                                  error={!!errors.ToYear}
                                  helperText={errors.ToYear ||""}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  disabled={accessLevel < 3}
                                   inputProps={{ maxLength: 4 }} 
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Stack spacing={1}>
                              <InputLabel>Factor Value</InputLabel>
                              <FormControl sx={{ width: '100%' }}>
                                <TextField
                                  name="FactorValue"
                                  placeholder="Factor Value"
                                  value={factorYearData.FactorValue}
                                  onChange={handleInputChange}
                                  error={!!errors.FactorValue}
                                  helperText={errors.FactorValue ||""}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  disabled={accessLevel < 3}
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Box marginTop={4}>
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
                              <Grid item xs={12} sm={8}>
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <Button variant="contained" color="success" onClick={handleYearFactor} disabled={accessLevel < 3}>
                                    Save
                                  </Button>
                                  <Button variant="contained" color="secondary" onClick={handleCancel} disabled={accessLevel < 3}>
                                    Clear
                                  </Button>
                                  <Button variant="contained" color="error" onClick={handleYearDeleteFactor} disabled={accessLevel < 4}>
                                    Delete
                                  </Button>
                                      <Dialog open={openDeleteDialogYear} maxWidth="xs" fullWidth>
                                                          <DialogContent>
                                                            <Typography variant="body1">Are you sure you want to delete?</Typography>
                                                          </DialogContent>
                                                          <DialogActions>
                                                            <Button  onClick={handleConfirmDeleteYear} color="error" variant="contained">
                                                              Yes
                                                            </Button>
                                                            <Button onClick={handleCancelDeleteYear} color="primary" variant="outlined">
                                                              No
                                                            </Button>
                                                          </DialogActions>
                                                        </Dialog>
                                 
                                </Stack>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      
                    </Grid>
                    {/* after6 */}
                    <Grid item xs={12} md={5} lg={5}>
                      <Box boxShadow={3} padding>
                        <Card>
                          <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                              Factor List
                            </Typography>
                            <Box sx={{ overflowX: 'auto', height: '230px',overflow: 'auto' }}>
                              {/* Table */}
                              <Table stickyHeader>
                                {/* Table Header */}
                                <TableHead>
                                  <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                                    <TableCell>
                                      <Checkbox
                                        checked={allCheckedYr}
                                        indeterminate={indeterminateYr}
                                        onChange={handleSelectAllYr}
                                        disabled={accessLevel < 3}
                                      />
                                    </TableCell>
                                    <TableCell>Edit</TableCell>

                                    <TableCell>Year From</TableCell>
                                    <TableCell>Year To</TableCell>
                                    <TableCell> Factor Value</TableCell>
                                  </TableRow>
                                </TableHead>

                                {/* Table Body */}
                                <TableBody>
                                  {factorYearList.map((factor, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <Checkbox
                                          checked={selectedRowsYr.includes(factor)}
                                          onChange={(event) => handleCheckboxChangeYr(event, factor)}
                                          onClick={(e) => e.stopPropagation()}
                                          disabled={accessLevel < 3}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <IconButton
                                          color={selectedYearRow && selectedYearRow.FacterID === factor.FacterID ? 'success' : 'primary'}
                                          onClick={() => handleRowClickYears(factor)}
                                          disabled={accessLevel < 3}
                                        >
                                          {selectedYearRow && selectedYearRow.FacterID === factor.FacterID ? (
                                            <SendOutlined />
                                          ) : (
                                            <EditTwoTone />
                                          )}
                                        </IconButton>
                                      </TableCell>

                                      <TableCell>{factor.FromYear}</TableCell>
                                      <TableCell>{factor.ToYear}</TableCell>
                                      <TableCell>{factor.FactorValue}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
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

export default RetainPolicyFactor;
