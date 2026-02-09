import {
  Button,
  Grid,
  InputLabel,
  SnackbarContent,
  MenuItem,
  Select,
  Stack,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import {
  SaveAssessmentRules,
  GenerateAssesmentNo,
  getAssessmentData
} from 'services/masterServices/assessment-rule-services/assessment-rule.services';
import { setPolicies } from 'state/reducers/setAssessmentRules/setPoliciesSlice';
import { selectCapitalValue, setCapitalValue } from 'state/reducers/totalValution/capitalValueAssessment.js';

function AssessmentRule() {
  const dispatch = useDispatch();
  // const capitalValue = useSelector(selectCapitalValue);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackAssNo, setOpenSnackAssNo] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    minRV: false,
    minRvOldRvZero: false,
    asPerOldForNewProperty: false,
    appealPolicyRuleWise: false,
    asPerOld: false,
    mixassessment: false,
    policyApplicable: false,
    retention: false,
    isRetention: false,
    capitalValue: false,
    historyLock: false,
    utilityLock: false,
    applyDiscount: false,
    dataEntryLock: false,
    drainTaxFlat: false,
    postingDeleted: false,
    newPropertyRemark: false,
    appealMaxDisc: 0,
    lockPropertyEditional: false,
    showPhotosAndPlan: false,
    minusPendingTax: false,
    photoPlanDB: false,
    restrictWrongFloor: false,
    restrictDuplicateEntry: false,
    plotTaxable: false,
    isHearing: false,
    plotTaxApplicable: false,
    isReasonLock: false,
    calfloorRenterRent: false,
    calcombineRenterRent: false,
    isAppealCommity: false,
    opEduEmpTax: false,
    isRemission: false,
    Deviation: 0,
    dataEntryScreen: false,
    meter: false,
    invoiceAutoGnerated: false,
    pendingDemandPay: false,
    reportImagePath: false,
    discountOnInterestBill: false,
    otpEnabled: false,
    wardAllocation: false,
    applyDiscountforExtended: false,
    ownerIdForReportName: false,
    languageEnabled: false,
    rentalValidity: false,
    qrCode: false,
    receiptPrint: false,
    hearingMaxDisc: 0,
    currentBalance: false,
    pendingBalance: false,
    activeInterest2: false,
    dbForAMC: false,
    assesmentCompleted: false,
    allowSMS: false,
    policyLock: false,
    dukanGalaMaintenance: false,
    penaltyMonthly: false
  });
  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Assessment Rule';
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

      console.log(access, 'assigned access to Assessment Rule Page');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAssessmentData();
        console.log('Fetched assessment data:', response);

        const mappedData = {
          minRV: response.IsMinimumRV,
          minRvOldRvZero: response.IsMinimumRVForOldRVZero,
          asPerOldForNewProperty: response.IsAsPerOldForNewProperty,
          appealPolicyRuleWise: response.IsAppealPolicyRuleWise,
          asPerOld: response.IsAsPerOld,
          mixassessment: response.IsMixAssessment,
          policyApplicable: response.IsPolicyApplicable,
          retention: response.IsRetention,
          isRetention: response.IsRetention,
          capitalValue: response.iscv,
          historyLock: response.AddHistoryLock,
          utilityLock: response.UtilityLockInBuiltUpArea,
          applyDiscount: response.IsApplyDiscount,
          dataEntryLock: response.DataEntryLock,
          drainTaxFlat: response.IsApplyFlatRateDrain,
          postingDeleted: response.isBillTransactionEntryDeleted,
          newPropertyRemark: response.IsDisplayNewPropRemark,
          appealMaxDisc: response.AppealMaxDiscount,
          lockPropertyEditional: response.lockPropertyEditional,
          showPhotosAndPlan: response.isShowPlansAndPhoto,
          minusPendingTax: response.AcceptMinusPendingTaxes,
          photoPlanDB: response.isPhotoPlanFromDb,
          restrictWrongFloor: response.IsWrongFloorSequence,
          restrictDuplicateEntry: response.isDuplicateEntryRestricted,
          plotTaxable: response.IsPlotTaxable,
          isHearing: response.IsHearing,
          plotTaxApplicable: response.IsPlotTaxApplicable,
          isReasonLock: response.IsReasonLock,
          calfloorRenterRent: response.IsCalOnRenterRent,
          calcombineRenterRent: response.IsCalOnSingleRenterRent,
          isAppealCommity: response.IsAppealCommittee,
          opEduEmpTax: response.IsOPEduEmpTaxZeroForGovEduProp,
          isRemission: response.IsRemission,
          Deviation: response.Daviation,
          dataEntryScreen: response.IsSubOnDataEntry,
          meter: response.IsSubOnMeter,
          invoiceAutoGnerated: response.IsInvoiceAutoGenerated,
          pendingDemandPay: response.IsPendingDemandPayFirst,
          reportImagePath: response.IsReportImageFromPath,
          discountOnInterestBill: response.IsDiscountOnIntNMbuild,
          otpEnabled: response.IsOTPEnable,
          wardAllocation: response.IsWardAllocation,
          applyDiscountforExtended: response.IsApplyDiscountForExtended,
          ownerIdForReportName: response.IsSpecificFormatReportSaveByOwnerID,
          languageEnabled: response.LanguageEnabled,
          rentalValidity: response.IsRentValidity,
          qrCode: response.IsQRcode,
          receiptPrint: response.IsPrintDuplicate,
          hearingMaxDisc: response.HearingMaxDiscount,
          currentBalance: response.CurrentBalance,
          pendingBalance: response.PendingBalance,
          activeInterest2: response.IsActiveInterest2,
          dbForAMC: response.isDBForAMC,
          assesmentCompleted: response.isAssessmentCompleted,
          allowSMS: response.IsAllowSMS,
          policyLock: response.PolicyLock,
          dukanGalaMaintenance: response.IsMaintainanceApply,
          penaltyMonthly: response.IsPenaltyMonthaly
        };
        setFormData(mappedData);
        // Dispatch the mapped data to Redux
        dispatch(setPolicies(mappedData));
      } catch (error) {
        console.log('Error fetching data');
      }
    };

    fetchData();
  }, []);

  // const handleInputChange = (key) => (e) => {
  //   let value;
  //   if (e.target.type === 'number') {
  //     value = parseInt(e.target.value);
  //   } else {
  //     value = e.target.value === 'Yes';
  //     dispatch(setCapitalValue(value));
  //   }
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [key]: value
  //   }));
  // };
  const handleInputChange = (key) => (e) => {
    let value;

    // Check the input type and set value accordingly
    if (e.target.type === 'number') {
      // value = parseInt(e.target.value, 10);
          value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    } else {
      value = e.target.value === 'Yes'; // Convert 'Yes' to true and 'No' to false
    }

    // Dispatch the value to Redux store if the key is 'capitalValue'
    if (key === 'capitalValue') {
      dispatch(setCapitalValue(value)); // Update the global state (Redux) for capitalValue
    }

    // Update local formData state
    setFormData((prevData) => ({
      ...prevData,
      [key]: value
    }));
    // Dispatch the value to Redux store
    dispatch(setPolicies({ [key]: value }));
  };

  const handleSaveClick = async () => {
    try {
      const response = await SaveAssessmentRules(formData);
      if (response.status === 200 || response.status === 201) {
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarMessage(response.message || 'Assessment Rules saved successfully');
        setSnackbarOpen(true);
      } else {
        setReceivedMessage(response.message || 'An error occurred while saving council details');
        setSnackbarSeverity('error');
        setSnackbarMessage(response.message || 'An error occurred while saving council details');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error in adding rules:', error);
    }
    setOpen(true);
  };

  const handleCancelClick = async () => {
    setFormData({
      minRV: false,
      minRvOldRvZero: false,
      asPerOldForNewProperty: false,
      appealPolicyRuleWise: false,
      asPerOld: false,
      mixassessment: false,
      policyApplicable: false,
      retention: false,
      isRetention: false,
      capitalValue: false,
      historyLock: false,
      utilityLock: false,
      applyDiscount: false,
      dataEntryLock: false,
      drainTaxFlat: false,
      postingDeleted: false,
      newPropertyRemark: false,
      appealMaxDisc: 0,
      lockPropertyEditional: false,
      showPhotosAndPlan: false,
      minusPendingTax: false,
      photoPlanDB: false,
      restrictWrongFloor: false,
      restrictDuplicateEntry: false,
      plotTaxable: false,
      isHearing: false,
      plotTaxApplicable: false,
      isReasonLock: false,
      calfloorRenter: false
    });
  };

  //to close snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleSanckAssNoClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackAssNo(false);
  };

  const handleChange = (panel) => (event, newExpanded) => {
    console.log('event - ', event, newExpanded);
    setExpanded(newExpanded ? panel : false);
  };

  // const handleGenerateNoClick = async () => {
  //   try {
  //     const response = GenerateAssesmentNo();
  //     console.log('generate', response);

  //     if (response.status === 200 || response.status === 201) {
  //       setReceivedMessage(response.message);
  //       setSnackbarSeverity('success');
  //       setSnackbarMessage(response.message || 'Assessment Rules saved successfully');
  //       setOpenSnackAssNo(true);
  //       handleCancelClick();
  //     } else {
  //       setReceivedMessage(response.message || 'An error occurred while saving council details');
  //       setSnackbarSeverity('error');
  //       setSnackbarMessage(response.message || 'An error occurred while saving council details');
  //       setOpenSnackAssNo(true);
  //     }
  //   } catch (err) {
  //     console.log('An error occurred', err.error);
  //   }
  // };

  const handleGenerateNoClick = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      const response = await GenerateAssesmentNo();
      console.log('Gener', response);

      if (response.status === 200 || response.status === 201) {
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarMessage(response.message || 'Assessment No generated successfully');
        setOpenSnackAssNo(true);
        handleCancelClick();
      } else {
        setReceivedMessage(response.message || 'An error occurred while generating Assessment No');
        setSnackbarSeverity('error');
        setSnackbarMessage(response.message || 'An error occurred while generating  Assessment No');
        setOpenSnackAssNo(true);
      }
    } catch (err) {
      console.log('An error occurred', err);
      setReceivedMessage('An error occurred');
      setSnackbarSeverity('error');
      setSnackbarMessage('An error occurred while generating assessment number');
      setSnackbarOpen(true);
      setOpenSnackAssNo(true);
    } finally {
      setIsLoading(false);
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
        <MainCard title="Assessment Rules">
          <Grid item xs={2}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography variant="h6">Appeal Policies</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'} justifyContent={'space-evenly'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>As Per Old</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.asPerOld ? 'Yes' : 'No'}
                        onChange={handleInputChange('asPerOld')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Min RV For Old RV Zero</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        style={{ height: '5vh', width: '15vw' }}
                        value={formData.minRvOldRvZero ? 'Yes' : 'No'}
                        onChange={handleInputChange('minRvOldRvZero')}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Appeal Policy Rule Wise</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.appealPolicyRuleWise ? 'Yes' : 'No'}
                        onChange={handleInputChange('appealPolicyRuleWise')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>As Per Old For New Property</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.asPerOldForNewProperty ? 'Yes' : 'No'}
                        onChange={handleInputChange('asPerOldForNewProperty')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Mix Assessment</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.mixassessment ? 'Yes' : 'No'}
                        onChange={handleInputChange('mixassessment')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Policy Applicable</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.policyApplicable ? 'Yes' : 'No'}
                        onChange={handleInputChange('policyApplicable')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Minimum RV</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.minRV ? 'Yes' : 'No'}
                        onChange={handleInputChange('minRV')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Retention </InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.retention ? 'Yes' : 'No'}
                        onChange={handleInputChange('retention')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Capital Value</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.capitalValue ? 'Yes' : 'No'}
                        onChange={handleInputChange('capitalValue')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography variant="h6">Locks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'} justifyContent={'space-evenly'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Policy Lock</InputLabel>

                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.policyLock ? 'Yes' : 'No'}
                        onChange={handleInputChange('policyLock')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>History Lock</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.historyLock ? 'Yes' : 'No'}
                        onChange={handleInputChange('historyLock')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Utility Lock</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.utilityLock ? 'Yes' : 'No'}
                        onChange={handleInputChange('utilityLock')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Apply Discount</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.applyDiscount ? 'Yes' : 'No'}
                        onChange={handleInputChange('applyDiscount')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Data Entry Lock</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.dataEntryLock ? 'Yes' : 'No'}
                        onChange={handleInputChange('dataEntryLock')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Drain Tax Flat</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.drainTaxFlat ? 'Yes' : 'No'}
                        onChange={handleInputChange('drainTaxFlat')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Posting Deleted</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.postingDeleted ? 'Yes' : 'No'}
                        onChange={handleInputChange('postingDeleted')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Display Property Remark</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.newPropertyRemark ? 'Yes' : 'No'}
                        onChange={handleInputChange('newPropertyRemark')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Lock Property Edition</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.lockPropertyEditional ? 'Yes' : 'No'}
                        onChange={handleInputChange('lockPropertyEditional')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Show Photos & Plan</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.showPhotosAndPlan ? 'Yes' : 'No'}
                        onChange={handleInputChange('showPhotosAndPlan')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Accept Minus Pending Tax</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.minusPendingTax ? 'Yes' : 'No'}
                        onChange={handleInputChange('minusPendingTax')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Photo Plan From DB</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.photoPlanDB ? 'Yes' : 'No'}
                        onChange={handleInputChange('photoPlanDB')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Restrict Wrong Floor Sequence</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.restrictWrongFloor ? 'Yes' : 'No'}
                        onChange={handleInputChange('restrictWrongFloor')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Restrict Duplicate Entry</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.restrictDuplicateEntry ? 'Yes' : 'No'}
                        onChange={handleInputChange('restrictDuplicateEntry')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <Typography variant="h6">Open Plot Policies</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'} justifyContent={'space-evenly'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Plot Taxable</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.plotTaxable ? 'Yes' : 'No'}
                        onChange={handleInputChange('plotTaxable')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Is Hearing</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.isHearing ? 'Yes' : 'No'}
                        onChange={handleInputChange('isHearing')}
                        style={{ height: '5vh', width: '100%' }}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Plot Tax Applicable</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.plotTaxApplicable ? 'Yes' : 'No'}
                        onChange={handleInputChange('plotTaxApplicable')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Is Reason Lock</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.isReasonLock ? 'Yes' : 'No'}
                        onChange={handleInputChange('isReasonLock')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Calc On All Floor Renters Rent</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.calfloorRenterRent ? 'Yes' : 'No'}
                        onChange={handleInputChange('calfloorRenterRent')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Calc On Combined Renters Rent</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.calcombineRenterRent ? 'Yes' : 'No'}
                        onChange={handleInputChange('calcombineRenterRent')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Is Appeal Committee</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.isAppealCommity ? 'Yes' : 'No'}
                        onChange={handleInputChange('isAppealCommity')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>OpEduEmpTaxZeroForGovtEduProp</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.opEduEmpTax ? 'Yes' : 'No'}
                        onChange={handleInputChange('opEduEmpTax')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Is Retention</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.isRetention ? 'Yes' : 'No'}
                        onChange={handleInputChange('isRetention')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Is Remission</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.isRemission ? 'Yes' : 'No'}
                        onChange={handleInputChange('isRemission')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid mt={4}>
                    <Stack spacing={1}>
                      <InputLabel>Deviation</InputLabel>
                     <TextField
  type="number"
  value={formData.Deviation ?? ''}   // show DB value or empty if null
  onChange={handleInputChange('Deviation')}
  disabled={accessLevel < 3}
/>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                <Typography variant="h6">Submissions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Data Entry Screen</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.dataEntryScreen ? 'Yes' : 'No'}
                        onChange={handleInputChange('dataEntryScreen')}
                        style={{ height: '5vh', width: '10vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid ml={5}>
                    <Stack spacing={1}>
                      <InputLabel>Meter</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.meter ? 'Yes' : 'No'}
                        onChange={handleInputChange('meter')}
                        style={{ height: '5vh', width: '10vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
              <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                <Typography variant="h6">AMC Flags</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'} justifyContent={'space-evenly'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Invoice Auto Generated</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.invoiceAutoGnerated ? 'Yes' : 'No'}
                        onChange={handleInputChange('invoiceAutoGnerated')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Pending Demand Pay First</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.pendingDemandPay ? 'Yes' : 'No'}
                        onChange={handleInputChange('pendingDemandPay')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Report Image From Path</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.reportImagePath ? 'Yes' : 'No'}
                        onChange={handleInputChange('reportImagePath')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Discount On Interest MBuild</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.discountOnInterestBill ? 'Yes' : 'No'}
                        onChange={handleInputChange('discountOnInterestBill')}
                        style={{ height: '5vh', width: '15vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
              <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                <Typography variant="h6">Is Enabled</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'} justifyContent={'space-evenly'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>OTP Enabled</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.otpEnabled ? 'Yes' : 'No'}
                        onChange={handleInputChange('otpEnabled')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Ward Allocation</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.wardAllocation ? 'Yes' : 'No'}
                        onChange={handleInputChange('wardAllocation')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Apply Discount for Extended</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.applyDiscountforExtended ? 'Yes' : 'No'}
                        onChange={handleInputChange('applyDiscountforExtended')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>OwnerId Use For Report Name</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.ownerIdForReportName ? 'Yes' : 'No'}
                        onChange={handleInputChange('ownerIdForReportName')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Language Enable</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.languageEnabled ? 'Yes' : 'No'}
                        onChange={handleInputChange('languageEnabled')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Rent Validity</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.rentalValidity ? 'Yes' : 'No'}
                        onChange={handleInputChange('rentalValidity')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>QR Code</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.qrCode ? 'Yes' : 'No'}
                        onChange={handleInputChange('qrCode')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Receipt Print</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.receiptPrint ? 'Yes' : 'No'}
                        onChange={handleInputChange('receiptPrint')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
              <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                <Typography variant="h6">Appeal Discount Variables</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Hearing Max Discount</InputLabel>
                      <TextField
                        type="number"
                        value={formData.hearingMaxDisc ?? ''}
                        onChange={handleInputChange('hearingMaxDisc')}
                        disabled={accessLevel < 3}
                      ></TextField>
                    </Stack>
                  </Grid>
                  <Grid ml={5}>
                    <Stack spacing={1}>
                      <InputLabel>Appeal Max Discount</InputLabel>
                      <TextField
                        type="number"
                        value={formData.appealMaxDisc ?? ''}
                        onChange={handleInputChange('appealMaxDisc')}
                        disabled={accessLevel < 3}
                      ></TextField>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
              <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                <Typography variant="h6">Advance Payment ON</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Current Balance</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.currentBalance ? 'Yes' : 'No'}
                        onChange={handleInputChange('currentBalance')}
                        style={{ height: '5vh', width: '10vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid ml={5}>
                    <Stack spacing={1}>
                      <InputLabel>Pending Balance</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.pendingBalance ? 'Yes' : 'No'}
                        onChange={handleInputChange('pendingBalance')}
                        style={{ height: '5vh', width: '10vw' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
              <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                <Typography variant="h6">Others</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid display={'flex'} justifyContent={'space-evenly'}>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Active Interest 2</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.activeInterest2 ? 'Yes' : 'No'}
                        onChange={handleInputChange('activeInterest2')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>DB For AMC</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.dbForAMC ? 'Yes' : 'No'}
                        onChange={handleInputChange('dbForAMC')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Assessment Completed</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.assesmentCompleted ? 'Yes' : 'No'}
                        onChange={handleInputChange('assesmentCompleted')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Allow SMS</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.allowSMS ? 'Yes' : 'No'}
                        onChange={handleInputChange('allowSMS')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid>
                    <Stack spacing={1}>
                      <InputLabel>Apply Maintainance On Dukan Gale</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.dukanGalaMaintenance ? 'Yes' : 'No'}
                        onChange={handleInputChange('dukanGalaMaintenance')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>

                      <InputLabel>Penalty Monthly</InputLabel>
                      <Select
                        labelId="registration-label"
                        id="registration-select"
                        value={formData.penaltyMonthly ? 'Yes' : 'No'}
                        onChange={handleInputChange('penaltyMonthly')}
                        style={{ height: '5vh', width: '100%' }}
                        disabled={accessLevel < 3}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid display="flex" justifyContent={'center'} mt={2}>
            <Stack>
              <Button variant="contained" color="success" onClick={handleSaveClick} disabled={accessLevel < 3}>
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
            <Stack ml={2}>
              <Button variant="contained" onClick={handleGenerateNoClick} disabled={accessLevel < 3}>
                Generate Assessment No
              </Button>
              {isLoading && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '20vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1000,
                    padding: '10px 0'
                  }}
                >
                  <CircularProgress color="success" />
                  <span style={{ marginLeft: 10 }}>Please wait while generating assessment number...</span>
                </div>
              )}
              {/* <Backdrop open={isLoading} style={{ zIndex: 1 }}>
            <CircularProgress color="inherit" />
            <span>Please wait while generating assessment number...</span>
          </Backdrop> */}
              <Snackbar
                open={openSnackAssNo}
                autoHideDuration={6000}
                onClose={handleSanckAssNoClose}
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
            <Stack ml={2}>
              <Button variant="contained" color="secondary" onClick={handleCancelClick} disabled={accessLevel < 3}>
                Cancel
              </Button>
            </Stack>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

export default AssessmentRule;
