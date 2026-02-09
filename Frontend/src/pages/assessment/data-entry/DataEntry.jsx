import { useEffect, useState } from 'react';
import {
  InputLabel,
  SnackbarContent,
  Button,
  Step,
  Stepper,
  StepLabel,
  Stack,
  Typography,
  Grid,
  TextField,
  Fab,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import FormDataEntry from './FormDataEntry';
import NewFloorInformation from './NewFloorInformation.jsx';
import AdditionalPropertyInformation from './AdditionalPropertyInformation';
import UploadPhotoAndPlan from './UploadPhotoAndPlan.jsx';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { PlusOutlined } from '@ant-design/icons';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import OldInformation from './OldInformation';
import SocialDetails from './SocialDetails';
import { deleteProperty, fetchAllTableInfo, fetchOwnerIDs, savePropertyInfo, savePropertyInfoAmc } from 'services/data-entry.services';
import { addCombineProperties, saveOwnerTaxChange } from 'services/assessmentService/DataEntryService/dataEntryService';
import DataEntryApprovalAssessment from './dataEntryApproval.jsx'
import { useDispatch, useSelector } from 'react-redux';

import { postWardSelection } from 'services/wardnumber.services';
import {
  resetJointOwnerDetails,
  setCombinedDataEntry,
  setFloorSubmissionDetailsInitialData,
  setFloorSubmissionDetailsMinusData,
  setOldPropertyMast,
  setPropertyDetailsNew,
  setOldTaxesReducer,
  setPendingTaxesReducer,
  setPropertyDetailsOld,
  addDocument
} from 'state/reducers/ExistingPropertySlice';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup';

import { fetchRetentionData, fetchValuationData, getPropertyImage } from 'services/assessmentService/DataEntryService/dataEntryService';

import { setImageData } from '../../../state/reducers/dataEntry/getPropertyImageSlice';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { setAccessLevelToRedux } from 'state/reducers/dataEntry/accessLevelDataEntrySlice';

import { clearUploadedFiles } from 'state/reducers/dataEntry/uploadPhotoPlanSlice';
import { selectCapitalValue } from 'state/reducers/totalValution/capitalValueAssessment';
import { setAdditionalData, setAdditionalErrors } from 'state/reducers/additionlPropertyDataSlice';
import { setNewPropertyMast } from 'state/reducers/dataEntry/formDataPropertyMast';
import { setRetentionData, resetRetentionData } from 'state/reducers/dataEntry/retainTaxesSlice';
import { setSocialErrors } from 'state/reducers/socialDetailsSlice';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
import { resetNewPropertyJoinData, setNewPropertyJoinData } from 'state/reducers/dataEntry/formDataEntryJointOwnerSlice';
import { sendDataEntryForApproval } from 'services/transaction/dataentryApprovalService/dataEntryApprovalService';

const DataEntry = () => {
  const uploadedFiles = useSelector((state) => state.combinedDataEntry.combinedData.propertyImageMast);
  const propertyDetailsOld = useSelector((state) => state.combinedDataEntry.combinedData.propertyDetailsOld);
  const oldPropertyMast = useSelector((state) => state.combinedDataEntry.combinedData.oldPropertyMast);
  const pendingTaxes = useSelector((state) => state.combinedDataEntry.combinedData.pendingTaxes);
  const oldTaxes = useSelector((state) => state.combinedDataEntry.combinedData.oldTaxes);
  const deletePropertyOldInfo = useSelector((state) => state.combinedDataEntry.DeletedPDOIdsExistingProperty);
  const PropertyMastInitialData = useSelector((state) => state.combinedDataEntry.combinedData.propertyMast);

  const [activeStep, setActiveStep] = useState(0);
  const [showPropertyButtons, setShowPropertyButtons] = useState(true);
  const [showSaveCancelButtons, setShowSaveCancelButtons] = useState(false);
  const [open, setOpen] = useState(false);
  const [UpdateDetailsOpen, setUpdateDetailsOpen] = useState(false);
  const [ownerIDs, setOwnerIDs] = useState([]);
  const [selectedOwnerID, setSelectedOwnerID] = useState('');
  const [openUpdateRetainTax, setOpenUpdateRetainTax] = useState(false);
  const [openOldInformation, setOpenOldInformation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openCombineProperty, setOpenCombineProperty] = useState(false);
  const [openTotalValuation, setOpenTotalValuation] = useState(false);
  const [mainPropertyData, setMainPropertyData] = useState([]);
  const [pageValue, setPageValue] = useState(1);
  const [openPlotState, setOpenPlotState] = useState(false);
  const [updateRetainTax, setUpdateRetainTax] = useState({
    OwnerID: 0,
    RentalValue: '',
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
    Tax2: '',
    WaterBill: '',
    MajorBuilding: '',
    WaterBenefit: '',
    SewageDisposalCess: '',
    Tax1: '',
    TaxTotal: ''
  });

  const [showZones, setShowZones] = useState(false);
  const [showWardNo, setShowWardNo] = useState(false);
  const [showPropertyNo, setShowPropertyNo] = useState(false);
  const [hideZone, setHideZone] = useState(true);
  const [hideWardNo, setHideWardNo] = useState(true);
  const [hidePropertyNo, setHidePropertyNo] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [stepperState, setStepperState] = useState({
    isNewProperty: false
  });

  const [pageID, setPageID] = useState('');

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Data Entry';
      try {
        const fetchedPageID = await getPageIDByPageName(pageName);
        setPageID(fetchedPageID);
      } catch (error) {}
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

  const [accessLevel, setAccessLevel] = useState(null);
  useEffect(() => {
    if (permissionAccess?.AccessID) {
      const access = permissionAccess.AccessID;

      setAccessLevel(access);
      dispatch(setAccessLevelToRedux(access));
    }
  }, [permissionAccess]);

  // redux states for new property insertion
  const additionalData = useSelector((state) => state.additionalDetails.newAdditionalData);
  const FlatRate = useSelector((state) => state.additionalDetails.newDrainFlatRate);
  const socialsData = useSelector((state) => state.socialDetails.newSocialData);
  const RCtoilet = useSelector((state) => state.socialDetails.newRToiletCTolet);
  const newFloorData = useSelector((state) => state.combinedDataEntry.combinedData.propertyDetailsNew);
  const newOwnerData = useSelector((state) => state.formDataDetails.newOwnerData);
  const newPropertyData = useSelector((state) => state.propertyMastDetails.newPropertyData);
  const deleteJdoIds = useSelector((state) => state.formDataDetails.deleteJdoIds);
  const deletePDNIds = useSelector((state) => state.newFloorDetails.deletePDNId);

  const deleteFsdIDs = useSelector((state) => state.combinedDataEntry.DeletedFloorSubmisionExistingProperty);
  const deleteFsdMIDs = useSelector((state) => state.combinedDataEntry.DeletedFloorSubmisionMinusExistingProperty);

  const floorSubmissionDetails = useSelector((state) => state.combinedDataEntry.combinedData.floorSubmissionDetails);
  const floorSubmissionDetailsMinus = useSelector((state) => state.combinedDataEntry.combinedData.floorSubmissionDetailsMinusData);

  const retentionTaxes = useSelector((state) => state.retentionTaxData.retentionTaxes);

  const typeOfUseNonTaxable = useSelector((state) => state.newFloorDetails.typeOfUseNonTaxable);
  //const capitalValue = useSelector(selectCapitalValue);typeOfUseNonTaxable
  const assessment =
  useSelector((state) => state.combinedDataEntry.assessment);
  console.log("🟢 Approval Assessment from Redux:", assessment);
// Redux state se financeYear 
const financeYearFromRedux = useSelector((state) => state.combinedDataEntry.financeYear);
console.log("🟢 Approval Assessment from Redux:", financeYearFromRedux);

  const navigate = useNavigate();
  const location = useLocation();
  const fromTotalValuation = location.state?.fromTotalValuation || false;

  const [newAdditionalPropertyData, setNewAdditionalPropertyData] = useState({
    MobileNo: '',
    PanCardNo: '',
    EmailID: '',
    AdharCardNo: '',
    PropertyRemark: '',
    CombPropRemark: '',
    PlotTaxableAreaSqFt: null,
    HearingObjNo: '',
    AppealCommObjNo: '',
    WadhGhatRemarkOne: '',
    WadhGhatRemarkTwo: '',
    WadhGhatRemarkThree: '',
    PropertyChange: '',
    FlatSystemRemark: '',
    BHK: null
  });

  const initialSocialDetailsState = {
    OwnerID: 0,
    NoOfWaterConnection: null,
    WaterConnectionType: '',
    IsWaterMeter: false,
    MeterStatus: '',
    WaterBillAreaName: '',
    WaterBillConnectionNo1: null,
    WaterBillMeterNo: null,
    WaterBillCustomerNo: null,
    ConnectionNo2: null,
    MeterNo2: null,
    ConnectionNo3: null,
    MeterNo3: null,
    ConnectionNo4: null,
    MeterNo4: null,
    ConnectionNo5: null,
    MeterNo5: null,
    IsTubeWell: false,
    NoOfTubeWell: null,
    IsBoar: false,
    NoOfBoar: null,
    IsWell: false,
    NoOfWell: null,
    IsHandPump: false,
    NoOfHandPump: null,
    IsSolar: false,
    NoOfSolar: null,
    IsLift: false,
    NoOfLift: null,
    IsFireSafety: false,
    NoOfFireSafety: null,
    ToiletSeatCountResidential: null,
    ToiletSeatCountNonResidential: null,
    NoOfTrees: null,
    IsWastewaterOutlet: false,
    IsEtpStp: false,
    IsHomeComposting: false,
    IsVermicompost: false,
    IsECharging: false,
    IsUndergroundSewage: false,
    IsUndergroundTank: false,
    IsBoosterPump: false,
    IsBuildingPermission: false,
    IsOcIssued: false,
    OcNo: null,
    IsRainwaterharvesting: false,
    RoadWidth: null,
    IsWaterConn: false,

    WaterConnSize: '',
    DirectionEast: '',
    DirectionWest: '',
    DirectionNorth: '',
    DirectionSouth: ''
  };
  const [newSocialDetailsData, setNewSocialDetailsData] = useState(initialSocialDetailsState);
  const hasNewSocialErrors = useSelector((state) => state.socialDetails.hasErrors);
  const hasNewAdditionalErrors = useSelector((state) => state.additionalDetails.hasErrors);

  //new property save
  const handleSave = async () => {
    setLoading(true);

    // 1️⃣ ---------- VALIDATION ----------
    const validationErrors = {};

    // --- old property tax validation ---
    if (oldPropertyMast) {
      if (
        oldPropertyMast.OldRV !== '' &&
        oldPropertyMast.OldPropertyTax !== '' &&
        oldPropertyMast.OldRV !== null &&
        oldPropertyMast.OldPropertyTax !== null
      ) {
        if (Number(oldPropertyMast.OldRV) <= Number(oldPropertyMast.OldPropertyTax)) {
          setSnackbarMessage('Old Property Tax must be lesser than old RV');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      } else if (
        oldPropertyMast.OldTotalTax !== '' &&
        oldPropertyMast.OldTotalTax !== null &&
        oldPropertyMast.OldPropertyTax !== '' &&
        oldPropertyMast.OldPropertyTax !== null
      ) {
        if (Number(oldPropertyMast.OldTotalTax) < Number(oldPropertyMast.OldPropertyTax)) {
          setSnackbarMessage('Old Property Tax must be ≤ Old Total Tax');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      }
    }

    // --- new property required fields ---
    if (!NewPropertyFields.NewZoneNo) validationErrors.NewZoneNo = 'Zone No is required';
    if (!NewPropertyFields.NewWardNo) validationErrors.NewWardNo = 'Ward No is required';
    if (!NewPropertyFields.NewPropertyNo) validationErrors.NewPropertyNo = 'Property No is required';
    if (!NewPropertyFields.PropertyTypeID) validationErrors.PropertyTypeID = 'Property Type is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const allMessages = Object.values(validationErrors).join(', ');
      setSnackbarMessage(`Please fix: ${allMessages}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    if (hasNewSocialErrors) {
      setSnackbarMessage('Please fix errors in Social Details');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    if (hasNewAdditionalErrors) {
      setSnackbarMessage('Please fix errors in Additional Details');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      await validationSchema.validate(NewPropertyFields, { abortEarly: false });
    } catch (error) {
      if (error.inner?.length) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
          setSnackbarMessage(err.message);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
        });
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // --- primary owner check ---
    const hasPrimeOwner = Array.isArray(newOwnerData) && newOwnerData.some((owner) => owner.isPrime === true);

    if (!hasPrimeOwner) {
      setSnackbarMessage('Please select a Primary Owner (isPrime must be true)');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    // 2️⃣ ---------- SAVE TO BACKEND ----------
    try {
      setLoading(true);
      console.log('🟠 handleSave() triggered');

      setShowPropertyButtons(true);
      setShowSaveCancelButtons(false);

      const mergedNewPropertyInfo = { ...newPropertyData, ...additionalData, ...RCtoilet };

      const response = await savePropertyInfo({
        PropertyInfo: {
          propertyMast: mergedNewPropertyInfo,
          propertyDetailsNew: newFloorData,
          propertyDetailsOld,
          jointOwnerDetails: newOwnerData,
          propertySocialDetails: socialsData,
          floorSubmissionDetails,
          floorSubmissionDetailsMinusData: floorSubmissionDetailsMinus,
          typeOfUseNonTaxable,
          drainFlatRate: FlatRate,
          oldPropertyMast,
          oldTaxes,
          pendingTaxes,
          retentionTaxData: retentionTaxes,
          DeletePropertyDetailsNew: deletePDNIds,
          DeleteJointOwnerDetails: deleteJdoIds,
          assessment:assessment,
          user: userData
        },
        uploadedFiles
      });

      console.log('✅ Response from savePropertyInfo:', response);

      const newOwnerID = response?.response?.data?.OwnerID;
      console.log('🎯 Extracted newOwnerID:', newOwnerID);

      if (!newOwnerID) {
        // no new owner -> skip rest
      } else {
        // 1) Switch to existing mode early so child components choose existing-mode paths
        handleUpdateStepper({ isNewProperty: false });
        setShowPropertyButtons(true);
        setShowSaveCancelButtons(false);
        setShowWardNo(false);
        setShowPropertyNo(false);
        setShowZones(false);
        setHideWardNo(true);
        setHidePropertyNo(true);
        setHideZone(true);

        // 3️⃣ ---------- FETCH FRESH PROPERTY INFO ----------
        const res = await fetchAllTableInfo(newOwnerID);
        console.log('📗 res after save (full property info):', res);

        if (res?.PropertyInfo) dispatch(setCombinedDataEntry(res.PropertyInfo));

        // const remotePM = res?.PropertyInfo?.propertyMast || {};
        //  setNewPropertyFields((prev) => ({
        //   ...prev,
        //   OwnerID: remotePM.OwnerID ?? prev.OwnerID,
        //   NewZoneNo: remotePM.NewZoneNo ?? prev.NewZoneNo,
        //   NewWardNo: remotePM.NewWardNo ?? prev.NewWardNo,
        //   NewPropertyNo: remotePM.NewPropertyNo ?? prev.NewPropertyNo,
        //   NewPartitionNo: remotePM.NewPartitionNo ?? prev.NewPartitionNo,
        //    PropertyTypeID: remotePM.PropertyTypeID ?? prev.PropertyTypeID,
        //   PlotTaxableAreaSqFt: remotePM.PlotTaxableAreaSqFt ?? prev.PlotTaxableAreaSqFt,
        // }));

        // 4️⃣ ---------- PAGINATION REFRESH ----------
        try {
          const DEFAULT_LIMIT = 1000;
          console.log('🟡 [STEP 1] Starting pagination refresh after save...');

          await new Promise((r) => setTimeout(r, 800)); // wait for DB commit
          console.log('🕒 [STEP 1.1] Delay complete — fetching first chunk');

          const firstChunk = await fetchOwnerIDs(1, DEFAULT_LIMIT);
          console.log('📦 [STEP 1.2] First chunk data:', firstChunk);

          const total = firstChunk.totalOwnerIDs;
          const totalChunks = firstChunk.totalPages;
          console.log('📊 [STEP 1.3] Derived totals → totalOwners:', total, '| totalChunks:', totalChunks);

          setTotalOwners(total);
          setTotalPages(totalChunks);

          const lastChunk = totalChunks;
          console.log('🟢 [STEP 2] Fetching last chunk → page:', lastChunk);

          const lastChunkData = await fetchOwnerIDs(lastChunk, DEFAULT_LIMIT);
          console.log('📦 [STEP 2.1] Last chunk data loaded →', lastChunkData);
          console.log('🔍 [STEP 2.1a] lastChunkData.ownerIDs.length:', lastChunkData?.ownerIDs?.length);
          console.log('🔍 [STEP 2.1b] lastChunkData.lastOwnerID:', lastChunkData?.ownerIDs?.[lastChunkData?.ownerIDs?.length - 1]);

          const lastOwnerId = lastChunkData?.ownerIDs?.[lastChunkData.ownerIDs.length - 1] ?? null;
          console.log('🎯 [STEP 2.2] Last OwnerID resolved →', lastOwnerId);

          console.log('⚙️ [STEP 3] Updating pagination states...');
          if (lastOwnerId) {
            setOwnerIDs(lastChunkData.ownerIDs);
            setSelectedOwnerID(lastOwnerId); // ✅ correctly placed here
            setPageValue(lastChunk);
            setCurrentPage(total);
            console.log('✅ [STEP 3.1] Pagination state updated successfully → currentPage:', total);
            console.log('🔍 [STEP 3.2] After set states:', {
              selectedOwnerID: lastOwnerId,
              pageValue: lastChunk,
              currentPage: total,
              totalOwners: total
            });
          } else {
            console.warn('⚠️ [STEP 3.2] No lastOwnerId found!');
          }

          // if (lastOwnerId) {
          //   console.log('🔄 [STEP 4] Fetching full property info for OwnerID:', lastOwnerId);
          //   const finalRes = await fetchAllTableInfo(lastOwnerId);
          //   console.log('📗 [STEP 4.1] Full property info fetched →', finalRes);

          //   if (finalRes?.PropertyInfo) {
          //     dispatch(setCombinedDataEntry(finalRes.PropertyInfo));
          //     console.log('📘 [STEP 4.2] Redux updated for lastOwnerId:', lastOwnerId);
          //   }
          // }

          console.log('🎉 [STEP 5] Pagination refresh completed → Total Owners:', total);
        } catch (err) {
          console.error('❌ [ERROR] Pagination refresh failed:', err);
        }

        // 5️⃣ ---------- SUCCESS SNACKBAR ----------
        if (response.status === 200 || response.status === 201) {
          setSnackbarMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(response.message || 'An error occurred while saving info');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
        }

        // 6️⃣ ---------- UI RESET ----------
        dispatch(clearUploadedFiles());
        setOpen(true);
        setActiveStep(0);
      }
    } catch (error) {
      console.error('❌ handleSave error:', error);
      setSnackbarMessage('An error occurred while saving');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    setFromPartitionNo('');
    setToPartitionNo('');
    if (!stepperState.isNewProperty) {
      fetchAllTableInfo(selectedOwnerID).then((res) => {
        dispatch(setCombinedDataEntry(res.PropertyInfo));
        // Assuming the images are part of the PropertyInfo object

        //setUpdateRetainTax(res.PropertyInfo.tranMast || {});
      });
    } else dispatch(setCombinedDataEntry());
  }, [stepperState.isNewProperty, selectedOwnerID]);

  const handleUpdateStepper = (data) => {
    setStepperState((prevStepperState) => {
      const newState = { ...prevStepperState, ...data };
      return newState;
    });
  };
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user');
  }, [userData]);

  // const steps = [
  //   'Data Entry',
  //   'Old Floor Information',
  //   openPlotState ? 'Open Plot Details' : 'New Floor Information',
  //   'Social Details',
  //   'Additional Property Information ',
  //   'Upload Photo and Plan',
  //   'Data Entry Approval'
  // ];
  //approval
const loggedInUserRole = useSelector(
  (state) => state.newUserDetails.initialUserData.role
);
// const isAMCUser = userData?.RoleName === 'Admin';
const isAMCUser =loggedInUserRole?.startsWith('AMC'); 
console.log("AMC user?", isAMCUser);
const baseSteps = [
  'Data Entry',
  'Old Floor Information',
  openPlotState ? 'Open Plot Details' : 'New Floor Information',
  'Social Details',
  'Additional Property Information',
  'Upload Photo and Plan'
];

const steps = isAMCUser
  ? [...baseSteps, 'Data Entry Approval']
  : baseSteps;

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <FormDataEntry
            setSelectedOwnerID={setSelectedOwnerID}
            selectedOwnerID={selectedOwnerID}
            //onOpenPlotChange={handleOpenPlotChange}
            showZones={showZones}
            showWardNo={showWardNo}
            showPropertyNo={showPropertyNo}
            isNewProperty={stepperState.isNewProperty}
            hideZone={hideZone}
            hideWardNo={hideWardNo}
            hidePropertyNo={hidePropertyNo}
            NewPropertyFields={NewPropertyFields}
            setNewPropertyFields={setNewPropertyFields}
            errors={errors}
            setErrors={setErrors}
            // newOwnerDetails={newOwnerDetails}
            // setNewOwnerDetails={setNewOwnerDetails}
          />
        );
      case 1:
        return <OldInformation isNewProperty={stepperState.isNewProperty} />;
      case 2:
        return (
          <NewFloorInformation
            openPlotState={openPlotState}
            showZones={showZones}
            showWardNo={showWardNo}
            showPropertyNo={showPropertyNo}
            isNewProperty={stepperState.isNewProperty}
            selectedOwnerID={selectedOwnerID}
            // newPropertiesFloorDetails={newPropertiesFloorDetails}
            // setNewPropertiesFloorDetails={setNewPropertiesFloorDetails}
            // errors={errors}
            // setErrors={setErrors}
          />
        );
      case 3:
        return (
          <SocialDetails
            isNewProperty={stepperState.isNewProperty}
            newSocialDetailsData={newSocialDetailsData}
            setNewSocialDetailsData={setNewSocialDetailsData}
            errors={errors}
            setErrors={setErrors}
          />
        );

      case 4:
        return (
          <AdditionalPropertyInformation
            isNewProperty={stepperState.isNewProperty}
            newAdditionalPropertyData={newAdditionalPropertyData}
            setNewAdditionalPropertyData={setNewAdditionalPropertyData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 5:
        return <UploadPhotoAndPlan mainPropertyData={mainPropertyData} />;
  //       case 6:
  // return isAMCUser ? (
  //   <DataEntryApprovalAssessment isNewProperty={stepperState.isNewProperty}/>
  // ) : (
  //   <Typography color="error" sx={{ p: 9 }}>
  //     You are not authorized to view this page.
  //   </Typography>
  // );
  case 6:
  return isAMCUser ? (
    <DataEntryApprovalAssessment
      isNewProperty={stepperState.isNewProperty}
            selectedOwnerID={selectedOwnerID}
        />
  ) : (
    <Typography color="error" sx={{ p: 9 }}>
      You are not authorized to view this page.
    </Typography>
  );

        
      default:
        throw new Error('Unknown step');
    }
  }

  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setUpdateDetailsOpen(false);
  };

  const handleOpenPlotChange = (newOpenPlotValue) => {
    setOpenPlotState(newOpenPlotValue);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validationSchema = Yup.object().shape({
    NewZoneNo: Yup.string().required('Zone No is required'),
    NewWardNo: Yup.string().required('Ward No is required'),
    NewPropertyNo: Yup.string().required('Property No is required'),
    //NewPartitionNo: Yup.string().required('Partition No is required'),
    // OpenPlot: Yup.boolean(),
    // NewCityServeyNo: Yup.string().required('CSN No is required'),
    // NewPlotNo: Yup.string().required('Partition No is required'),

    PropertyTypeID: Yup.string().required('Property Type is required')
    //PlotTaxableAreaSqFt: Yup.string().required('Plot Taxable Area is required')
    //CarpetAreaSqFeet: Yup.string().required('Carpet Area is required')
  });
  const [NewPropertyFields, setNewPropertyFields] = useState({
    OwnerID: null,
    NewZoneNo: '',
    NewWardNo: '',
    NewPropertyNo: '',
    NewPartitionNo: '',
    NewCityServeyNo: '',
    NewPlotNo: '',
    PropertyTypeID: null,
    PlotTaxableAreaSqFt: null
  });

  const emptyNewPropertyFields = {
    OwnerID: null,
    NewZoneNo: '',
    NewWardNo: '',
    NewPropertyNo: '',
    NewPartitionNo: '',
    NewCityServeyNo: '',
    NewPlotNo: '',
    PropertyTypeID: null,
    PlotTaxableAreaSqFt: null
  };

  const emptyNewAdditional = {
    MobileNo: '',
    PanCardNo: '',
    EmailID: '',
    AdharCardNo: '',
    PropertyRemark: '',
    CombPropRemark: '',
    PlotTaxableAreaSqFt: null,
    HearingObjNo: '',
    AppealCommObjNo: '',
    WadhGhatRemarkOne: '',
    WadhGhatRemarkTwo: '',
    WadhGhatRemarkThree: '',
    PropertyChange: '',
    FlatSystemRemark: '',
    BHK: null,
    OpenPlotLength: null,
    OpenPlotWidth: null
  };

  const initialRetentionTaxState = {
    OwnerID: 0,
    RentalValue: '',
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
    Tax2: '',
    WaterBill: '',
    MajorBuilding: '',
    SewageDisposalCess: '',
    Tax1: '',
    TaxTotal: '',
    SpWaterCess: '',
    WaterBenefit: ''
  };

  const handleNewPropertyClick = () => {
    handleUpdateStepper({
      isNewProperty: true
    });

    dispatch(
      setSocialErrors({
        hasErrors: false,
        fieldErrors: {} // clears all previous errors
      })
    );

    dispatch(
      setAdditionalErrors({
        hasErrors: false,
        fieldErrors: {} // clears all previous errors for additional property
      })
    );
    // clear local
    setUpdateRetainTax({});
    setRetainErrors({});
    setRetainChanged(false);

    // clear redux
    dispatch(resetRetentionData());

    // Reset only existing property owners
    dispatch(resetJointOwnerDetails());
    dispatch(resetNewPropertyJoinData()); // new property
    // Reset social details data
    setNewSocialDetailsData(initialSocialDetailsState);
    setNewAdditionalPropertyData(emptyNewAdditional);
    dispatch(setAdditionalData(emptyNewAdditional));
    dispatch(setNewPropertyMast(emptyNewPropertyFields));
    setUpdateRetainTax({ ...initialRetentionTaxState }); // <-- Clear Retain Tax form

    //setOpenPlotState(false);
    setSelectedOwnerID(0);

    setShowPropertyButtons(false);
    setShowSaveCancelButtons(true);
    setShowPropertyNo(true);
    setShowWardNo(true);
    setShowZones(true);
    setHidePropertyNo(false);
    setHideWardNo(false);
    setHideZone(false);
  };

  const handleCancel = () => {
    let ownerId = ownerIDs[0];
    setSelectedOwnerID(ownerId);
    setShowPropertyButtons(true);
    setShowSaveCancelButtons(false);
    setShowPropertyNo(false);
    setShowWardNo(false);
    setShowZones(false);
    setHidePropertyNo(true);
    setHideWardNo(true);
    setHideZone(true);
    handleUpdateStepper({
      isNewProperty: false
    });
    setErrors({});
  };

  const validationNewFloorPropertiesDetails = () => {
    return Yup.object().shape({
      NewFloorNo: Yup.string().required('Floor No is required'),
      NewFloorType: Yup.string().required('Floor Type is required'),
      NewFloorAreaSqFeet: Yup.number().required('Floor Area is required'),
      NewFloorDescription: Yup.string().required('Floor Description is required')
    });
  };
  const UpdateDetails = () => {
    setUpdateDetailsOpen(true);
  };

  //Update Retain Tax Alt + 2

  const handleKeyDown = (event) => {
    if (event.altKey && event.key === '2') {
      setOpenUpdateRetainTax(true);
    } else if (event.key === 'Escape') {
      setOpenUpdateRetainTax(false);
    }
  };

  // const handleCloseDialog = () => {
  //   setOpenUpdateRetainTax(false);
  // };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const [openDelete, setOpenDelete] = useState(false);

  const handleYes = async () => {
    setOpenDelete(false);
    setOpenDialogPassword(true);
  };

  const handleNo = () => {
    setOpenDelete(false);
  };

  const deletePropertybyOwnerId = async () => {
    setOpenDelete(true);
  };

  // Old Information Alt + 3
  const handleKeyOldInformation = (event) => {
    if (event.altKey && event.key === '3') {
      setOpenOldInformation(true);
    } else if (event.key === 'Escape') {
      setOpenOldInformation(false);
    }
  };

  //Total Valuation Alt + 4
  const handleKeyTotalValuation = (event) => {
    if (event.altKey && event.key === '6') {
      setOpenTotalValuation(true);
    } else if (event.key === 'Escape') {
      setOpenTotalValuation(false);
    }
  };

  const handleTotalValuation = () => {
    setOpenTotalValuation(false);
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyTotalValuation);

    return () => {
      window.removeEventListener('keydown', handleKeyTotalValuation);
    };
  });
  const [totalOwners, setTotalOwners] = useState(0);
  //Combine Property Alt + 5
  const handleKeyCombineProperty = (event) => {
    if (event.altKey && event.key === '5') {
      setOpenCombineProperty(true);
    } else if (event.key === 'Escape') {
      setOpenCombineProperty(false);
    }
  };

  useEffect(() => {}, [stepperState.isNewProperty]);

  const DEFAULT_LIMIT = 1000;
  //fetch list of OwnerIDs from database
  useEffect(() => {
    const loadOwnerIDs = async () => {
      const data = await fetchOwnerIDs(pageValue, DEFAULT_LIMIT); // chunk number
      setOwnerIDs(data.ownerIDs);
      setTotalOwners(data.totalOwnerIDs); // real total count
      setTotalPages(data.totalPages); // chunk count

      setSelectedOwnerID((prev) => (prev ? prev : data.ownerIDs[0]));
    };
    loadOwnerIDs();
  }, [pageValue]);

  // removed totalPages from deps
  const [pageInput, setPageInput] = useState(String(currentPage)); // store as string

  const handlePageChange = async (ownerNumber, forceLast = false) => {
    if (isNaN(ownerNumber) || ownerNumber < 1 || ownerNumber > totalOwners) return;

    const chunk = Math.floor((ownerNumber - 1) / 1000) + 1;
    const indexInChunk = (ownerNumber - 1) % 1000;

    const data = await fetchOwnerIDs(chunk);
    if (!data?.ownerIDs?.length) {
      console.warn('⚠️ No owners found for chunk', chunk);
      return;
    }

    const targetOwnerId = forceLast ? data.ownerIDs[data.ownerIDs.length - 1] : data.ownerIDs[indexInChunk];

    // ✅ Enhanced console log for verification
    console.log('📗 handlePageChange():');
    console.log(`   → chunk: ${chunk}`);
    console.log(`   → ownerNumber: ${ownerNumber}`);
    console.log(`   → totalOwners: ${totalOwners}`);
    console.log(`   → indexInChunk: ${indexInChunk}`);
    console.log(`   → data.ownerIDs.length: ${data.ownerIDs.length}`);
    console.log(`   → pickedOwnerID: ${targetOwnerId}`);
    console.log(`   → forceLast: ${forceLast}`);
    console.log('-------------------------------------------------------');

    setOwnerIDs(data.ownerIDs);
    setSelectedOwnerID(targetOwnerId);
    setPageValue(chunk);
    setCurrentPage(forceLast ? totalOwners : ownerNumber);
  };

  const handleCombineProperty = () => {
    setOpenCombineProperty(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyCombineProperty);

    return () => {
      window.removeEventListener('keydown', handleKeyCombineProperty);
    };
  });

  const newPPData = useSelector((state) => state.propertyMastDetails.newPropertyData);

  // Retrieve OpenPlot value from Redux
  const PP = useSelector((state) => state.combinedDataEntry.combinedData.propertyMast);
  // Normalize and set openPlotState based on Redux value
  // // UseEffect to update the openPlotState once PP is available
  useEffect(() => {
    if (PP) {
      // Ensure PP is not null or undefined

      if (PP.OpenPlot !== undefined) {
        setOpenPlotState(Boolean(PP.OpenPlot)); // Convert string "true" to boolean true
      } else {
      }
    } else {
    }
  }, [PP]);

  const [password, setPassword] = useState('');

  const [openDialogPassword, setOpenDialogPassword] = useState(false);
  const handleCloseDialogPassword = async () => {
    setOpenDialogPassword(false);
    try {
      const levelname = 'L4';
      // Validate password
      const passwordCheckResponse = await levelPassword(levelname, password);

      if (passwordCheckResponse.status !== 200) {
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setSnackbarMessage('Invalid password');

        throw new Error('Invalid password');
      }

      const { message, status } = await deleteProperty({ OwnerID: selectedOwnerID });
      if (status === 200 || status === 201) {
        setReceivedMessage(message);
        setSnackbarSeverity('success');
        setSnackbarMessage(message);
        setSnackbarOpen(true);

        // re-fetch the first page of owner IDs
        const data = await fetchOwnerIDs(1);
        setOwnerIDs(data.ownerIDs);
        if (data.ownerIDs.length > 0) {
          setSelectedOwnerID(data.ownerIDs[0]);
          setCurrentPage(1);
          setPageValue(1);
        }
      }
    } catch (error) {
      setReceivedMessage('Error in Posting Owner ID');
      setSnackbarSeverity('error');
      setSnackbarMessage('Error in Posting Owner ID');
      setSnackbarOpen(true);
    }
  };

  const handleCancelDialogPassword = async () => {
    setOpenDialogPassword(false);
  };
  //   //carpet from new floor
  //   const totalCarpet = useSelector(
  //     (state) => state.newFloorDetails.totalCarpetAreaSqFeet
  //   );
  // console.log(totalCarpet, "totalCarpet form data entry")

  // UseEffect to dynamically set openPlotState
  useEffect(() => {
    const currentPPData = stepperState.isNewProperty ? newPPData : PP;
    if (currentPPData) {
      if (currentPPData.OpenPlot !== undefined) {
        setOpenPlotState(currentPPData.OpenPlot);
      } else {
      }
    } else {
    }
  }, [newPPData, PP, stepperState.isNewProperty]);

  //lock the data entry page from admin lock property page
  const isPageLocked = useSelector((state) => state.pageLock.isPageLocked);

  //update value from redux for existing property
  const rToiletInitialData = useSelector((state) => state.combinedDataEntry?.combinedData?.propertyMast?.NewToiletNo || 0);
  const cToiletInitialData = useSelector((state) => state.combinedDataEntry?.combinedData?.propertyMast?.commToiletNo || 0);
  const socialDataInitial = useSelector((state) => state.combinedDataEntry.combinedData.propertySocialDetails);
  const propertymastFormDataInitial = useSelector((state) => state.combinedDataEntry.combinedData.propertyMast);
  const jointOwnerDataInitial = useSelector((state) => state.combinedDataEntry.combinedData.jointOwnerDetails);
  let newFloorDataInitial = useSelector((state) => state.combinedDataEntry.combinedData.propertyDetailsNew);
  const additionalDataInitial = useSelector((state) => state.combinedDataEntry.combinedData.propertyMast);
  const drainFlatRateDataInitial = useSelector((state) => state.combinedDataEntry.combinedData.drainFlatRate);
  const deletePropertyListInitial = useSelector((state) => state.combinedDataEntry.DeletedPDNIdsExistingProperty);

  //const deleteJointOwnerListInitial = useSelector((state) => state.combinedDataEntry.combinedData.DeletedJODIdsExistingProperty);
  const deleteJointOwnerListInitial = useSelector((state) => state.combinedDataEntry.DeletedJODIdsExistingProperty);

  let newFloorSubmissionListInitial = useSelector((state) => state.combinedDataEntry.combinedData.floorSubmissionDetails);
  let newFloorSubmissionMinusListInitial = useSelector((state) => state.combinedDataEntry.combinedData.floorSubmissionDetailsMinusData);

  const newTypeOfUseNonTaxableInitial = useSelector((state) => state.combinedDataEntry.combinedData.typeOfUseNonTaxable);

  // const resetDataEntry = (state) => state.combinedDataEntry.resetDataEntry;

  const hasSocialErrors = useSelector((state) => state.socialDetails.hasErrors);

  const hasAdditionalErrors = useSelector((state) => state.additionalDetails.hasErrors);

  //handle save function for existing property save
  
//success team
  const handleSavePropertyInfo = async () => {
    // --- Start Loader ---
    setLoading(true);

    // --- Frontend Validation Checks ---
    if (oldPropertyMast) {
      if (
        oldPropertyMast.OldRV !== '' &&
        oldPropertyMast.OldPropertyTax !== '' &&
        oldPropertyMast.OldRV !== null &&
        oldPropertyMast.OldPropertyTax !== null
      ) {
        if (Number(oldPropertyMast.OldRV) <= Number(oldPropertyMast.OldPropertyTax)) {
          setSnackbarMessage('Old Property Tax must be lesser than old RV');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      } else if (
        oldPropertyMast.OldTotalTax !== '' &&
        oldPropertyMast.OldTotalTax !== null &&
        oldPropertyMast.OldPropertyTax !== '' &&
        oldPropertyMast.OldPropertyTax !== null
      ) {
        if (Number(oldPropertyMast.OldTotalTax) < Number(oldPropertyMast.OldPropertyTax)) {
          setSnackbarMessage('Old Property Tax must be lesser than or equal to Old Total Tax');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      }
    }
    if (!propertymastFormDataInitial?.PropertyTypeID) {
      setErrors((prev) => ({
        ...prev,
        PropertyTypeID: "Property Type is required"
      }));
    
      setSnackbarMessage("Property Type is required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    // --- Redux / Validation Flags ---
    if (hasSocialErrors) {
      setSnackbarMessage('Please fix errors in Social Details before saving.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    if (hasAdditionalErrors) {
      setSnackbarMessage('Please fix errors in Additional Details before saving.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    const hasPrimeOwner = Array.isArray(jointOwnerDataInitial) && jointOwnerDataInitial.some((owner) => owner.isPrime === true);

    if (!hasPrimeOwner) {
      setSnackbarMessage('Please select a Primary Owner (isPrime must be true)');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    // --- If reached here, all validations passed ---
    try {
      setLoading(true); // ensure loader is active before backend call

      const updatedPropertyMast = {
        ...propertymastFormDataInitial,
        NewToiletNo: rToiletInitialData,
        commToiletNo: cToiletInitialData
      };

      const mergedPropertyMast = {
        ...propertymastFormDataInitial,
        ...additionalDataInitial,
        ...updatedPropertyMast
      };

      const newPropertyDetailsOld = [...propertyDetailsOld, deletePropertyOldInfo];

      console.log(mergedPropertyMast,'mergedPropertyMast')
      // handle open plot reset
       if (mergedPropertyMast.OpenPlot) {
        console.log('Open plot detected, resetting floor data');
        newFloorDataInitial = [];
        newFloorSubmissionListInitial = [];
        newFloorSubmissionMinusListInitial = [];
        dispatch(setPropertyDetailsNew({ floorDetails: [] }));
        dispatch(setFloorSubmissionDetailsInitialData({ floorSubmissionDetails: [] }));
        dispatch(setFloorSubmissionDetailsMinusData({ floorSubmissionMinusDetails: [] }));
        console.log(newFloorDataInitial, newFloorSubmissionListInitial, newFloorSubmissionMinusListInitial, 'After Reset');
      }

      const response = await savePropertyInfo({
        PropertyInfo: {
          propertyMast: mergedPropertyMast,
          propertyDetailsNew: newFloorDataInitial,
          propertyDetailsOld: newPropertyDetailsOld,
          jointOwnerDetails: jointOwnerDataInitial,
          propertySocialDetails: socialDataInitial,
          drainFlatRate: drainFlatRateDataInitial,
          oldPropertyMast: oldPropertyMast,
          oldTaxes: oldTaxes,
          pendingTaxes: pendingTaxes,
          floorSubmissionDetails: newFloorSubmissionListInitial,
          floorSubmissionDetailsMinusData: newFloorSubmissionMinusListInitial,
          typeOfUseNonTaxableList: typeOfUseNonTaxable,
          typeOfUseNonTaxable: newTypeOfUseNonTaxableInitial,
          retentionTaxData: retentionTaxes,
          DeletePropertyDetailsNew: deletePropertyListInitial,
          DeleteJointOwnerDetails: deleteJointOwnerListInitial,
          DeleteFloorSubmissionDetails: deleteFsdIDs,
          DeleteFloorSubmissionMinusDetails: deleteFsdMIDs,
          assessment:assessment,
          user: userData
        },
        uploadedFiles
      });

      if (response.status === 200 || response.status === 201) {
        setSnackbarMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleUpdateStepper({ isNewProperty: false });

        dispatch(setPropertyDetailsOld({ clear: true }));
        dispatch(setOldPropertyMast({}));
        dispatch(setPendingTaxesReducer({ clear: true }));
        dispatch(clearUploadedFiles());

        navigate(fromTotalValuation ? '/assessment/total-valuation' : '/assessment/data-entry');
      } else {
        setSnackbarMessage(response.message || 'An error occurred while saving info');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error(err);
      setSnackbarMessage('Unexpected error occurred.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };
  //sucss amc
  // const handleSavePropertyInfoAmc = async () => {
  
  //   setLoading(true);
  
  //   if (oldPropertyMast) {
  //     if (
  //       oldPropertyMast.OldRV !== '' &&
  //       oldPropertyMast.OldPropertyTax !== '' &&
  //       oldPropertyMast.OldRV !== null &&
  //       oldPropertyMast.OldPropertyTax !== null
  //     ) {
  //       if (Number(oldPropertyMast.OldRV) <= Number(oldPropertyMast.OldPropertyTax)) {
  //         setSnackbarMessage('Old Property Tax must be lesser than old RV');
  //         setSnackbarSeverity('error');
  //         setSnackbarOpen(true);
  //         setLoading(false);
  //         return;
  //       }
  //     } else if (
  //       oldPropertyMast.OldTotalTax !== '' &&
  //       oldPropertyMast.OldTotalTax !== null &&
  //       oldPropertyMast.OldPropertyTax !== '' &&
  //       oldPropertyMast.OldPropertyTax !== null
  //     ) {
  //       if (Number(oldPropertyMast.OldTotalTax) < Number(oldPropertyMast.OldPropertyTax)) {
  //         setSnackbarMessage('Old Property Tax must be lesser than or equal to Old Total Tax');
  //         setSnackbarSeverity('error');
  //         setSnackbarOpen(true);
  //         setLoading(false);
  //         return;
  //       }
  //     }
  //   }
  
  //   if (!propertymastFormDataInitial?.PropertyTypeID) {
  //     setErrors((prev) => ({ ...prev, PropertyTypeID: 'Property Type is required' }));
  //     setSnackbarMessage('Property Type is required');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //     setLoading(false);
  //     return;
  //   }
  
  //   // Validations for Social and Additional Details
  //   if (hasSocialErrors || hasAdditionalErrors) {
  //     setSnackbarMessage('Please fix errors in details before saving.');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //     setLoading(false);
  //     return;
  //   }
  
  //   const hasPrimeOwner = Array.isArray(jointOwnerDataInitial) && jointOwnerDataInitial.some((owner) => owner.isPrime === true);
  //   if (!hasPrimeOwner) {
  //     setSnackbarMessage('Please select a Primary Owner');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //     setLoading(false);
  //     return;
  //   }
  
  //   // --- Save Process ---
  //   try {
  //     setLoading(true);
  
  //     const mergedPropertyMast = {
  //       ...propertymastFormDataInitial,
  //       ...additionalDataInitial,
  //       NewToiletNo: rToiletInitialData,
  //       commToiletNo: cToiletInitialData
  //     };
  
  //     const newPropertyDetailsOld = [...propertyDetailsOld, deletePropertyOldInfo];
  
  //     // 1️⃣ Step: Save Main Property Info
  //     const response = await savePropertyInfoAmc({
  //       PropertyInfo: {
  //         propertyMast: mergedPropertyMast,
  //         propertyDetailsNew: newFloorDataInitial,
  //         propertyDetailsOld: newPropertyDetailsOld,
  //         jointOwnerDetails: jointOwnerDataInitial,
  //         propertySocialDetails: socialDataInitial,
  //         drainFlatRate: drainFlatRateDataInitial,
  //         oldPropertyMast: oldPropertyMast,
  //         oldTaxes: oldTaxes,
  //         pendingTaxes: pendingTaxes,
  //         floorSubmissionDetails: newFloorSubmissionListInitial,
  //         floorSubmissionDetailsMinusData: newFloorSubmissionMinusListInitial,
  //         typeOfUseNonTaxable: newTypeOfUseNonTaxableInitial,
  //         retentionTaxData: retentionTaxes,
  //         DeletePropertyDetailsNew: deletePropertyListInitial,
  //         DeleteJointOwnerDetails: deleteJointOwnerListInitial,
  //         DeleteFloorSubmissionDetails: deleteFsdIDs,
  //         DeleteFloorSubmissionMinusDetails: deleteFsdMIDs,
  //         assessment: assessment,
  //         user: userData
  //       },
  //       uploadedFiles
  //     });
  // console.log(response,"dataentry approavallllll")
  //     if (response.status === 200 || response.status === 201) {
        
  //       const savedOwnerID = response?.response?.data?.OwnerID || response?.data?.OwnerID || mergedPropertyMast.OwnerID;
       
  //       const savedUPID =   response?.response?.data?.versionId ;
  //   console.log('✅ Version ID for Approval:', savedUPID);
  //       let finalYear = financeYearFromRedux || assessment?.FinanceYear || mergedPropertyMast.Year;
  
  //       const sanitizedYear = parseInt(finalYear);
  
  //       if (savedOwnerID && !isNaN(sanitizedYear)) {
  //         try {
  //           console.log('🚀 Calling saveOwnerTaxChange with Year:', sanitizedYear);
  //           await saveOwnerTaxChange({
  //             OwnerID: savedOwnerID,
  //             Year: sanitizedYear,
  //             CreatedBy: userData?.UserID || 0
  //           });
  //         } catch (taxError) {
  //           console.error('⚠️ Tax Change Service failed:', taxError);
  //         }
  //       } else {
  //         console.warn('❌ Could not call saveOwnerTaxChange: Invalid OwnerID or Year (NaN)', { savedOwnerID, finalYear });
  //       }
  
  //       // Success Actions
  //       setSnackbarMessage(response.message || "Data Saved Successfully");
  //       setSnackbarSeverity('success');
  //       setSnackbarOpen(true);
        
  //       // Cleanup
  //       dispatch(setPropertyDetailsOld({ clear: true }));
  //       dispatch(setOldPropertyMast({}));
  //       dispatch(setPendingTaxesReducer({ clear: true }));
  //       dispatch(clearUploadedFiles());
  
  //       setTimeout(() => {
  //         navigate(fromTotalValuation ? '/assessment/total-valuation' : '/assessment/data-entry');
  //       }, 1000);
  //       return response.data || response;
  //     } else {
  //       setSnackbarMessage(response.message || 'An error occurred while saving info');
  //       setSnackbarSeverity('error');
  //       setSnackbarOpen(true);
  //     }
  //   } catch (err) {
  //     console.error('Error in handleSavePropertyInfo:', err);
  //     setSnackbarMessage(err.message || 'Unexpected error occurred.');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //   } finally {
  //     setLoading(false);
  //     setOpen(true);
  //   }
  // };
  
  
const[versionId,SetVersionId]= useState("");
  const handleSavePropertyInfoAmc = async () => {
  
    setLoading(true);
  
    if (oldPropertyMast) {
      if (
        oldPropertyMast.OldRV !== '' &&
        oldPropertyMast.OldPropertyTax !== '' &&
        oldPropertyMast.OldRV !== null &&
        oldPropertyMast.OldPropertyTax !== null
      ) {
        if (Number(oldPropertyMast.OldRV) <= Number(oldPropertyMast.OldPropertyTax)) {
          setSnackbarMessage('Old Property Tax must be lesser than old RV');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      } else if (
        oldPropertyMast.OldTotalTax !== '' &&
        oldPropertyMast.OldTotalTax !== null &&
        oldPropertyMast.OldPropertyTax !== '' &&
        oldPropertyMast.OldPropertyTax !== null
      ) {
        if (Number(oldPropertyMast.OldTotalTax) < Number(oldPropertyMast.OldPropertyTax)) {
          setSnackbarMessage('Old Property Tax must be lesser than or equal to Old Total Tax');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
      }
    }
  
    if (!propertymastFormDataInitial?.PropertyTypeID) {
      setErrors((prev) => ({ ...prev, PropertyTypeID: 'Property Type is required' }));
      setSnackbarMessage('Property Type is required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
  
    // Validations for Social and Additional Details
    if (hasSocialErrors || hasAdditionalErrors) {
      setSnackbarMessage('Please fix errors in details before saving.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
  
    const hasPrimeOwner = Array.isArray(jointOwnerDataInitial) && jointOwnerDataInitial.some((owner) => owner.isPrime === true);
    if (!hasPrimeOwner) {
      setSnackbarMessage('Please select a Primary Owner');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
  
    // --- Save Process ---
    try {
      setLoading(true);
  
      const mergedPropertyMast = {
        ...propertymastFormDataInitial,
        ...additionalDataInitial,
        NewToiletNo: rToiletInitialData,
        commToiletNo: cToiletInitialData
      };
  
      const newPropertyDetailsOld = [...propertyDetailsOld, deletePropertyOldInfo];
  
      // 1️⃣ Step: Save Main Property Info
      const response = await savePropertyInfoAmc({
        PropertyInfo: {
          propertyMast: mergedPropertyMast,
          propertyDetailsNew: newFloorDataInitial,
          propertyDetailsOld: newPropertyDetailsOld,
          jointOwnerDetails: jointOwnerDataInitial,
          propertySocialDetails: socialDataInitial,
          drainFlatRate: drainFlatRateDataInitial,
          oldPropertyMast: oldPropertyMast,
          oldTaxes: oldTaxes,
          pendingTaxes: pendingTaxes,
          floorSubmissionDetails: newFloorSubmissionListInitial,
          floorSubmissionDetailsMinusData: newFloorSubmissionMinusListInitial,
          typeOfUseNonTaxable: newTypeOfUseNonTaxableInitial,
          retentionTaxData: retentionTaxes,
          DeletePropertyDetailsNew: deletePropertyListInitial,
          DeleteJointOwnerDetails: deleteJointOwnerListInitial,
          DeleteFloorSubmissionDetails: deleteFsdIDs,
          DeleteFloorSubmissionMinusDetails: deleteFsdMIDs,
          assessment: assessment,
          user: userData
        },
        uploadedFiles
      });
  console.log(response,"dataentry approavallllll")
      if (response.status === 200 || response.status === 201) {
        
        const savedOwnerID = response?.response?.data?.OwnerID || response?.data?.OwnerID || mergedPropertyMast.OwnerID;
       
        const savedUPID =   response?.response?.data?.versionId ;

    console.log('✅ Version ID for Approval:', savedUPID);
    SetVersionId(savedUPID);
        let finalYear = financeYearFromRedux || assessment?.FinanceYear || mergedPropertyMast.Year;
  
        const sanitizedYear = parseInt(finalYear);
  
        if (savedOwnerID && !isNaN(sanitizedYear)) {
          try {
            console.log('🚀 Calling saveOwnerTaxChange with Year:', sanitizedYear);
            await saveOwnerTaxChange({
              OwnerID: savedOwnerID,
              Year: sanitizedYear,
              CreatedBy: userData?.UserID || 0
            });
          } catch (taxError) {
            console.error('⚠️ Tax Change Service failed:', taxError);
          }
        } else {
          console.warn('❌ Could not call saveOwnerTaxChange: Invalid OwnerID or Year (NaN)', { savedOwnerID, finalYear });
        }
  
        // Success Actions
        setSnackbarMessage(response.message || "Data Saved Successfully");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Cleanup
        dispatch(setPropertyDetailsOld({ clear: true }));
        dispatch(setOldPropertyMast({}));
        dispatch(setPendingTaxesReducer({ clear: true }));
        dispatch(clearUploadedFiles());
  
        setTimeout(() => {
          navigate(fromTotalValuation ? '/assessment/total-valuation' : '/assessment/data-entry');
        }, 1000);
        return response.data || response;
      } else {
        setSnackbarMessage(response.message || 'An error occurred while saving info');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Error in handleSavePropertyInfo:', err);
      setSnackbarMessage(err.message || 'Unexpected error occurred.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const [oldDetails, setOldDetails] = useState({
    OldALV: null,
    OldRV: null,
    OldTotalTax: null
  });
  const [netTaxes, setNetTaxes] = useState({
    Propertytax: '',
    EducationTax: '',
    SpEducationTax: '',
    EmploymentTax: '',
    TreeCess: '',
    FireCess: '',
    LightCess: '',
    DrainCess: '',
    RoadCess: '',
    Sanitation: '',
    SpWaterCess: '',
    WaterBenefitTax: '',
    WaterBill: '',
    MajorBuildingTax: '',
    SewageDispCess: '',
    Tax1: '',
    Total: ''
  });
  const [retainOwnerID, setRetainOwnerID] = useState('');
  const [retainTaxes, setRetainTaxes] = useState({
    Propertytax: '',
    EducationTax: '',
    SpEducationTax: '',
    EmploymentTax: '',
    TreeCess: '',
    FireCess: '',
    LightCess: '',
    DrainCess: '',
    RoadCess: '',
    Sanitation: '',
    SpWaterCess: '',
    WaterBenefitTax: '',
    WaterBill: '',
    MajorBuildingTax: '',
    SewageDispCess: '',
    Tax1: '',
    Total: ''
  });
  const [hearingTaxes, setHearingTaxes] = useState({
    Propertytax: '',
    EducationTax: '',
    SpEducationTax: '',
    EmploymentTax: '',
    TreeCess: '',
    FireCess: '',
    LightCess: '',
    DrainCess: '',
    RoadCess: '',
    Sanitation: '',
    SpWaterCess: '',
    WaterBenefitTax: '',
    WaterBill: '',
    MajorBuildingTax: '',
    SewageDispCess: '',
    Tax1: '',
    Total: ''
  });
  const [appealTaxes, setAppealTaxes] = useState({
    Propertytax: '',
    EducationTax: '',
    SpEducationTax: '',
    EmploymentTax: '',
    TreeCess: '',
    FireCess: '',
    LightCess: '',
    DrainCess: '',
    RoadCess: '',
    Sanitation: '',
    SpWaterCess: '',
    WaterBenefitTax: '',
    WaterBill: '',
    MajorBuildingTax: '',
    SewageDispCess: '',
    Tax1: '',
    Total: ''
  });
  const [retainReason, setRetainReason] = useState('');
  const [retainRV, setRetainRV] = useState('');
  const [hearingRV, setHearingRV] = useState('');
  const [hearingReason, setHearingReason] = useState('');
  const [appealRV, setAppealRV] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [databaseRows, setDatabaseRows] = useState([]);
  const [totalRV, setTotalRV] = useState(0);
  const [totalAnnualRentalValue, setTotalAnnualRentalValue] = useState(0);
  useEffect(() => {
    let totalRV = 0;
    let totalARV = 0;
    const transformed = databaseRows.map((row, index) => {
      const rv = Number(row.RateableValue).toFixed(2);
      const annualRentalValue = Number(row.AnnualRentalValue).toFixed(2);

      totalRV += Number(rv);
      totalARV += Number(annualRentalValue);
    });

    setTotalRV(Number(totalRV).toFixed(2));
    setTotalAnnualRentalValue(Number(totalARV).toFixed(2));
  }, [databaseRows]);
  const [propertyPartitionRange, setPropertyPartitionRange] = useState([]);
  const [allPropertyDetails, setAllPropertyDetails] = useState([]);
  useEffect(() => {
    const fetchTotalValuationData = async () => {
      try {
        if (selectedOwnerID) {
          const result = await fetchValuationData(selectedOwnerID);

          const netTaxesRow = result?.[0]?.[0] || [];

          setNetTaxes({
            Propertytax: netTaxesRow[0]?.PropertyTax || 0,
            EducationTax: netTaxesRow[0]?.EducationTax || 0,
            SpEducationTax: netTaxesRow[0]?.SpEducationTax || 0,
            EmploymentTax: netTaxesRow[0]?.EmploymentTax || 0,
            TreeCess: netTaxesRow[0]?.TreeCess || 0,
            FireCess: netTaxesRow[0]?.FireCess || 0,
            LightCess: netTaxesRow[0]?.LightCess || 0,
            DrainCess: netTaxesRow[0]?.DrainCess || 0,
            RoadCess: netTaxesRow[0]?.RoadCess || 0,
            Sanitation: netTaxesRow[0]?.Sanitation || 0,
            SpWaterCess: netTaxesRow[0]?.SpWaterCess || 0,
            WaterBenefitTax: netTaxesRow[0]?.WaterBenefitTax || 0,
            WaterBill: netTaxesRow[0]?.WaterBill || 0,
            MajorBuildingTax: netTaxesRow[0]?.MajorBuildingTax || 0,
            SewageDispCess: netTaxesRow[0]?.SewageDispCess || 0,
            Tax1: netTaxesRow[0]?.Tax1 || 0,
            Total: netTaxesRow[0]?.Total || 0
          });
          const retain = result?.[1] || [];
          setRetainOwnerID(retain[0]?.OwnerID || '');
          setRetainReason(retain[0]?.Reason || '');
          setRetainRV(retain[0]?.RV || '');
          setRetainTaxes({
            Propertytax: retain[0]?.PropertyTax || 0,
            EducationTax: retain[0]?.EducationTax || 0,
            SpEducationTax: retain[0]?.SpEducationTax || 0,
            EmploymentTax: retain[0]?.EmploymentTax || 0,
            TreeCess: retain[0]?.TreeCess || 0,
            FireCess: retain[0]?.FireCess || 0,
            LightCess: retain[0]?.LightCess || 0,
            DrainCess: retain[0]?.DrainCess || 0,
            RoadCess: retain[0]?.RoadCess || 0,
            Sanitation: retain[0]?.Sanitation || 0,
            SpWaterCess: retain[0]?.SpWaterCess || 0,
            WaterBenefitTax: retain[0]?.WaterBenefitTax || 0,
            WaterBill: retain[0]?.WaterBill || 0,
            MajorBuildingTax: retain[0]?.MajorBuildingTax || 0,
            SewageDispCess: retain[0]?.SewageDispCess || 0,
            Tax1: retain[0]?.Tax1 || 0,
            Total: retain[0]?.Total || 0
          });
          const hearing = result?.[2] || [];
          setHearingReason(hearing[0]?.Reason || '');
          setHearingRV(hearing[0]?.RV || '');
          setHearingTaxes({
            Propertytax: hearing[0]?.PropertyTax || 0,
            EducationTax: hearing[0]?.EducationTax || 0,
            SpEducationTax: hearing[0]?.SpEducationTax || 0,
            EmploymentTax: hearing[0]?.EmploymentTax || 0,
            TreeCess: hearing[0]?.TreeCess || 0,
            FireCess: hearing[0]?.FireCess || 0,
            LightCess: hearing[0]?.LightCess || 0,
            DrainCess: hearing[0]?.DrainCess || 0,
            RoadCess: hearing[0]?.RoadCess || 0,
            Sanitation: hearing[0]?.Sanitation || 0,
            SpWaterCess: hearing[0]?.SpWaterCess || 0,
            WaterBenefitTax: hearing[0]?.WaterBenefitTax || 0,
            WaterBill: hearing[0]?.WaterBill || 0,
            MajorBuildingTax: hearing[0]?.MajorBuildingTax || 0,
            SewageDispCess: hearing[0]?.SewageDispCess || 0,
            Tax1: hearing[0]?.Tax1 || 0,
            Total: hearing[0]?.Total || 0
          });
          const appeal = result?.[3] || [];
          setAppealReason(appeal[0]?.Reason || '');
          setAppealRV(appeal[0]?.RV || '');
          setAppealTaxes({
            Propertytax: appeal[0]?.PropertyTax || 0,
            EducationTax: appeal[0]?.EducationTax || 0,
            SpEducationTax: appeal[0]?.SpEducationTax || 0,
            EmploymentTax: appeal[0]?.EmploymentTax || 0,
            TreeCess: appeal[0]?.TreeCess || 0,
            FireCess: appeal[0]?.FireCess || 0,
            LightCess: appeal[0]?.LightCess || 0,
            DrainCess: appeal[0]?.DrainCess || 0,
            RoadCess: appeal[0]?.RoadCess || 0,
            Sanitation: appeal[0]?.Sanitation || 0,
            SpWaterCess: appeal[0]?.SpWaterCess || 0,
            WaterBenefitTax: appeal[0]?.WaterBenefitTax || 0,
            WaterBill: appeal[0]?.WaterBill || 0,
            MajorBuildingTax: appeal[0]?.MajorBuildingTax || 0,
            SewageDispCess: appeal[0]?.SewageDispCess || 0,
            Tax1: appeal[0]?.Tax1 || 0,
            Total: appeal[0]?.Total || 0
          });
          setOldDetails({
            OldALV: result?.[4]?.[0]?.OldALV || null,
            OldRV: result?.[4]?.[0]?.OldRV || null,
            OldTotalTax: result?.[4]?.[0]?.OldTotalTax || null
          });
          const rows = result?.[5] || [];

          setDatabaseRows(rows);
        }
      } catch (error) {}
    };
    setPropertyPartitionRange([]);

    fetchTotalValuationData();
  }, [selectedOwnerID]);

  useEffect(() => {
    if (selectedOwnerID) {
      const fetchPropertyRange = async () => {
        const propertyRange = await postWardSelection(PP.NewWardNo);

        const range = Array.isArray(propertyRange?.properties)
          ? propertyRange.properties.filter(
              (prop) => String(prop.NewPropertyNo) === String(PP?.NewPropertyNo) && String(prop.NewWardNo) === String(PP?.NewWardNo)
            )
          : [];
        setAllPropertyDetails(range);
        const partitionNumbers = range.map((item) => item.NewPartitionNo);
        setPropertyPartitionRange((prevRange) => {
          const merged = [...prevRange, ...partitionNumbers];
          return [...new Set(merged)]; // removes duplicates
        });
      };

      fetchPropertyRange();
    }
  }, [PP]);

  useEffect(() => {
    const fetchExistingRetentionData = async () => {
      try {
        if (selectedOwnerID && selectedOwnerID !== 0) {
          const result = await fetchRetentionData(selectedOwnerID);

          if (result && Object.keys(result).length > 0) {
            setUpdateRetainTax(result.retain);

            if (!stepperState.isNewProperty) {
              // ✅ Existing property validation
              const newErrors = {};
              if (!result.retain.RentalValue || result.retain.RentalValue === '') {
                newErrors.RentalValue = 'Rental Value is required';
              }
              if (!result.retain.TaxTotal || result.retain.TaxTotal === '') {
                newErrors.TaxTotal = 'Total Tax is required';
              }
              setRetainErrors(newErrors);
            } else {
              // ✅ New property → no errors initially
              setRetainErrors({});
            }
          } else {
            // No data from DB → reset to blank state
            setUpdateRetainTax({ ...initialRetentionTaxState });

            if (!stepperState.isNewProperty) {
              // ✅ Existing property but missing values → force error
              setRetainErrors({
                RentalValue: 'Rental Value is required',
                TaxTotal: 'Total Tax is required'
              });
            } else {
              // ✅ Fresh new property → no errors
              setRetainErrors({});
            }
          }
        } else {
          // No owner selected → treat same as no data
          setUpdateRetainTax({ ...initialRetentionTaxState });

          if (!stepperState.isNewProperty) {
            setRetainErrors({
              RentalValue: 'Rental Value is required',
              TaxTotal: 'Total Tax is required'
            });
          } else {
            setRetainErrors({});
          }
        }
      } catch (error) {}
    };

    fetchExistingRetentionData();
  }, [selectedOwnerID, stepperState.isNewProperty]);

  const [fromPartitionNo, setFromPartitionNo] = useState('');
  const [toPartitionNo, setToPartitionNo] = useState('');
  useEffect(() => {
    if (propertyPartitionRange.length > 0) {
    }
  }, [propertyPartitionRange]);

  const handleCombinePropertyButton = async () => {
    if (fromPartitionNo !== '' && toPartitionNo !== '') {
      try {
        const OwnerIDs = Array.isArray(allPropertyDetails)
          ? allPropertyDetails.filter((item) => item.NewPartitionNo >= fromPartitionNo && item.NewPartitionNo <= toPartitionNo)
          : [];
        const IDs = OwnerIDs.map((item) => item.OwnerID);

        const response = await addCombineProperties(IDs, selectedOwnerID);

        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message);
          setSnackbarOpen(true);
          setOpenDialogRV(false); // Close the dialog after successful combination
          // Optionally, you can reset the input fields
          setFromPartitionNo('');
          setToPartitionNo('');
        } else {
          setReceivedMessage(response.message || 'An error occurred while combining properties');
          setSnackbarSeverity('error');
          setSnackbarMessage(response.message || 'An error occurred while combining properties');
          setSnackbarOpen(true);
        }
      } catch (error) {}
    } else {
      setReceivedMessage('Please enter valid From and To Partition Numbers');
      setSnackbarSeverity('error');
      setSnackbarMessage('Please enter valid From and To Partition Numbers');
      setSnackbarOpen(true);
    }
  };

  const [openDialogRV, setOpenDialogRV] = useState(false);

  const handleButtonNetRVClick = () => {
    setOpenDialogRV(true); // Open the dialog
  };
  const handleCloseNetRVDialog = () => {
    setOpenDialogRV(false); // Close the dialog
  };

  const [retainChanged, setRetainChanged] = useState(false);

  const [retainSnackbarOpen, setRetainSnackbarOpen] = useState(false);
  const [retainSnackbarMessage, setRetainSnackbarMessage] = useState('');
  const [retainSnackbarSeverity, setRetainSnackbarSeverity] = useState('error');

  const SaveRetentionTaxes = async () => {
    const rentalValue = parseFloat(updateRetainTax.RentalValue || 0);
    const taxTotal = parseFloat(updateRetainTax.TaxTotal || 0);

    const errors = [];

    // 🔹 Cross-field validation only on save
    if (rentalValue > 0 && taxTotal === 0) {
      errors.push('Total Tax is required.');
    }
    if (taxTotal > 0 && rentalValue === 0) {
      errors.push('RV is required.');
    }

    // 🔹 Business rules (check only when both have values)
    if (rentalValue > 0 && taxTotal > 0) {
      const taxTotalError = getTaxTotalError();
      if (taxTotalError) {
        errors.push(taxTotalError);
      }
    }

    if (errors.length > 0) {
      setRetainSnackbarMessage(errors.join(' '));
      setRetainSnackbarSeverity('error');
      setRetainSnackbarOpen(true);
      return; // 🚫 stop save if any error
    }

    // ✅ Only if no errors
    const payload = {
      ...updateRetainTax,
      OwnerID: selectedOwnerID
    };

    dispatch(setRetentionData(payload));
    setOpenUpdateRetainTax(false);
  };

  const [unsavedChangesSnackbarOpen, setUnsavedChangesSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setUnsavedChangesSnackbarOpen(false);
  };

  const handleCloseDialog = (event, reason) => {
    if (retainChanged) {
      setUnsavedChangesSnackbarOpen(true);
      return; // prevent closing
    }

    setOpenUpdateRetainTax(false);
  };

  const handleOpenDialog = () => {
    setRetainChanged(false);
    setOpenUpdateRetainTax(false);
  };

  const [retainErrors, setRetainErrors] = useState({});

  const handleRetainChange = (e) => {
    const { name, value } = e.target;

    setUpdateRetainTax((prev) => {
      let updatedValue = value;

      if (name === 'RentalValue') {
        // 🔹 Only allow digits
        if (!/^\d*$/.test(value)) {
          // value contains non-numeric characters
          setRetainErrors((prevErrors) => ({
            ...prevErrors,
            RentalValue: 'Rental Value must be a number'
          }));
        } else {
          updatedValue = value; // valid integer
          setRetainErrors((prevErrors) => {
            if (updatedValue && updatedValue.trim() !== '') {
              const { RentalValue, ...rest } = prevErrors;
              return rest; // clear error
            }
            return { ...prevErrors, RentalValue: 'Rental Value is required' };
          });
        }
      }

      const updated = { ...prev, [name]: updatedValue };

      // 🔹 Calculate total tax (unchanged)
      const taxFields = [
        'PropertyTax',
        'EducationTax',
        'SpEducationTax',
        'EmploymentTax',
        'TreeCess',
        'FireCess',
        'LightCess',
        'DrainCess',
        'RoadCess',
        'Sanitation',
        'Tax2',
        'WaterBill',
        'SpWaterCess',
        'WaterBenefit',
        'MajorBuilding',
        'SewageDisposalCess',
        'Tax1'
      ];

      let total = 0;
      taxFields.forEach((field) => {
        const val = parseFloat(updated[field]);
        if (!isNaN(val)) total += val;
      });

      const finalData = { ...updated, TaxTotal: total.toFixed(2) };
      dispatch(setRetentionData(finalData));

      return finalData;
    });

    setRetainChanged(true);
  };

  // const getTaxTotalError = () => {
  //   const taxTotal = parseFloat(updateRetainTax.TaxTotal || 0);
  //   const propertyTax = parseFloat(updateRetainTax.PropertyTax || 0);
  //   const rentalValue = parseFloat(updateRetainTax.RentalValue || 0);

  //   if (taxTotal < propertyTax) {
  //     return 'Total Tax must be greater than or equal to Property Tax';
  //   }
  //   if (taxTotal >= rentalValue) {
  //     return 'Total Tax must be less than Rental Value';
  //   }
  //   return '';
  // };

  const getTaxTotalError = () => {
    const rentalValue = parseFloat(updateRetainTax.RentalValue || 0);
    const taxTotal = parseFloat(updateRetainTax.TaxTotal || 0);

    // 🔹 If new property and both are empty → don't show any error
    if (stepperState.isNewProperty && rentalValue === 0 && taxTotal === 0) {
      return '';
    }

    // 🔹 Only validate if both > 0
    if (rentalValue > 0 && taxTotal > 0) {
      if (taxTotal >= rentalValue) {
        return 'Total Tax must be less than Rental Value';
      }
    }

    return '';
  };

  const [passwordSnackbarOpen, setPasswordSnackbarOpen] = useState(false);
  const [passwordSnackbarMessage, setPasswordSnackbarMessage] = useState('');
  const [passwordSnackbarSeverity, setPasswordSnackbarSeverity] = useState('success');

  const handleSaveAndApprove = async () => {
    setLoading(true); // Loader on
    try {
     // const saveRes = await handleSavePropertyInfoAmc();
      // console.log(saveRes?.versionId)
      // console.log( saveRes?.data?.versionId)
      // console.log( saveRes?.response?.data?.versionId);
      //   // Files filter logic
      const wardNo = assessment?.NewWardNo || selectedWard || 1;
   // const sharedUUID = saveRes?.versionId || saveRes?.data?.versionId || saveRes?.response?.data?.versionId;
      // Files filter logic
      const uploadedFiles = documents
        .filter(d => d.uploadedFilePath && (d.id === 1 || d.id === 10))
        .map(d => d.uploadedFilePath);
  
      const combinedPaths = uploadedFiles.join(', ');
  
      const payload = {
        OwnerID: selectedOwnerID,
        WardNo: Number(wardNo),
        user: {
          UserID: userData?.UserID || 4,
          name: userData?.name || 'Amc'
        },
        WardghatDocument: combinedPaths,
        FerfarDocument: null,
        documentsArray: documents
          .filter(d => d.uploadedFilePath)
          .map(d => d.name)
          .join(', '),
        ApplicationPageSource: "OPDataEntry",
        ApprovalRemark: "Sent to approval",
        UpdVersionID: versionId,
      };
  
      const res = await sendDataEntryForApproval(payload);
      
      if (res.success) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Documents saved and sent for approval successfully!'); 
        setSnackbarOpen(true);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(res.message || 'Failed to send for approval');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Server Error: Message not sent');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); 
    }
  };
  // const handleSaveAndApprove = async () => {
  //   setLoading(true); // Loader on
  //   try {
  //     const saveRes = await handleSavePropertyInfoAmc();
  //     console.log(saveRes,"save respinse uuid" );
  //     const finalOwnerID = saveRes?.OwnerID || saveRes?.data?.OwnerID || selectedOwnerID;
  //     const wardNo = assessment?.NewWardNo  || 1;
  //     const sharedUUID = saveRes?.versionId || saveRes?.data?.versionId || saveRes?.response?.data?.versionId;
  //     // const sharedUUID = saveRes?.response?.data?.versionId || saveRes?.data?.versionId || saveRes?.versionId  || saveRes?.response?.response?.data?.versionId;    //        if (!sharedUUID) {
  //   //     setSnackbarSeverity('error');
  //   //     setSnackbarMessage('Error: Transaction ID (Version ID) Fail.');
  //   //     setSnackbarOpen(true);
  //   //     setLoading(false);
  //   //     return; 
  //   // }
  //     const uploadedFiles = documents
  //       .filter(d => d.uploadedFilePath && (d.id === 1 || d.id === 10))
  //       .map(d => d.uploadedFilePath);
  
  //     const combinedPaths = uploadedFiles.join(', ');
  
  //     const payload = {
  //       OwnerID: finalOwnerID,
  //       WardNo: Number(wardNo),
  //       user: {
  //         UserID: userData?.UserID || 4,
  //         name: userData?.name || 'Amc'
  //       },
  //       WardghatDocument: combinedPaths,
  //       FerfarDocument: null,
  //       documentsArray: documents
  //         .filter(d => d.uploadedFilePath)
  //         .map(d => d.name)
  //         .join(', '),
  //       ApplicationPageSource: "OPDataEntry",
  //       ApprovalRemark: "Sent to approval",
  //       UpdVersionID: sharedUUID,
  //     };
  
  //     const res = await sendDataEntryForApproval(payload);
      
  //     if (res.success) {
  //       setSnackbarSeverity('success');
  //       setSnackbarMessage('Documents saved and sent for approval successfully!'); 
  //       setSnackbarOpen(true);
  //     } else {
  //       setSnackbarSeverity('error');
  //       setSnackbarMessage(res.message || 'Failed to send for approval');
  //       setSnackbarOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setSnackbarSeverity('error');
  //     setSnackbarMessage('Server Error: Message not sent');
  //     setSnackbarOpen(true);
  //   } finally {
  //     setLoading(false); 
  //   }
  // };
 
 

const {
  
  documents,
  
} = useSelector((state) => state.combinedDataEntry);
const handlePrint = async () => {
  try {
    window.print();

  dispatch(
      addDocument({
        id: 10,
        name: 'वाढघट कागदपत्र',
        file: null
      })
    );

    // Optional: Success message
    setReceivedMessage("Print triggered and document row added.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    
  } catch (error) {
    console.error("Print Error:", error);
  }
};
const canPrint = documents.some(
  d => d.id >= 1 && d.id <= 9 && d.file
);

  return (
    <MainCard>
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
      {showPropertyButtons && (
        <Grid container spacing={10} display={'flex'} justifyContent={'flex-end'}>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Fab
                color="success"
                aria-label="add"
                style={{ borderRadius: '3%', width: '10vw', height: '3vh', fontSize: '0.9rem' }}
                onClick={handleNewPropertyClick}
              >
                <PlusOutlined style={{ marginRight: '0.5vw' }} />
                NEW PROPERTY
              </Fab>
            </Stack>
          </Grid>
        </Grid>
      )}
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              onClick={() => setActiveStep(index)}
              style={{ cursor: 'pointer', fontWeight: 'normal', transition: 'font-weight 0.3s ease' }}
              sx={{
                '&:hover': {
                  fontWeight: 'bold'
                }
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div style={{ height: '65vh', overflowY: 'auto' }}>
        {activeStep === steps.length ? (
          <Typography style={{ color: 'green' }} variant="h5" gutterBottom>
            Form has been successfully submitted.
          </Typography>
        ) : (
          getStepContent(activeStep)
        )}
      </div>
      <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'} sx={{ mt: 3, mr: 3 }}>
        {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}
        <AnimateButton>
          {activeStep !== steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </AnimateButton>
      </Stack>
      {isPageLocked && (
        <Grid
          item
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '0',
            width: '100%',
            padding: '10px',
            textAlign: 'center',
            zIndex: 1000
          }}
        >
          <InputLabel
            style={{
              color: 'red',
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Property is Locked.
          </InputLabel>
        </Grid>
      )}
      {showPropertyButtons && (
        <Grid container xs={12} spacing={2} marginTop={5} alignItems="center">
          <Grid
            item
            xs={5.5}
            direction={'row'}
            display="flex"
            justifyContent="flex-start"
            gap={2}
            sx={{
              // backgroundColor: "#f0f4ff",// light blue shade
              padding: 2,
              marginLeft: 7,
              borderRadius: 2
            }}
          >
            <Grid item xs={1.5}>
              <Stack spacing={1}>
                <Button variant="contained" color="success" sx={{ padding: '8px' }} onClick={() => handlePageChange(1)}>
                  First
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ padding: '8px' }}
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                >
                  &lt;&lt; Previous
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={1.5}>
              <Stack spacing={1}>
                <TextField
                  value={currentPage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCurrentPage(e.target.value);
                    if (!isNaN(val) && val > 0 && val <= totalOwners) {
                      handlePageChange(val);
                    }
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={1.5}>
              <Stack spacing={1}>
                <Button variant="outlined" color="secondary" sx={{ padding: '8px' }}>
                  {totalOwners}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={1.5}>
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ padding: '8px' }}
                  onClick={(e) => handlePageChange(Math.min(totalOwners, currentPage + 1))}
                >
                  Next &gt;&gt;
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={1.5}>
              <Stack spacing={1}>
                <Button variant="contained" color="success" sx={{ padding: '8px' }} onClick={() => handlePageChange(totalOwners, true)}>
                  Last
                </Button>
              </Stack>
            </Grid>
          </Grid>
          {loading && (
            <div
              style={{
                position: 'fixed', // absolute ki jagah fixed, poore viewport pe
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1500,
                backgroundColor: 'rgba(255,255,255,0.6)', // transparent overlay
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'all' // poora area block kare
              }}
            >
              <CircularProgress color="primary" size={70} thickness={5} />
              <Typography variant="h6" sx={{ mt: 2, color: 'black' }}>
                Saving Property Information...
              </Typography>
            </div>
          )}

          <Grid
            item
            xs={4.5}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap={3} // 👈 This gives equal spacing between Save & Delete
            sx={{
              padding: 2,
              marginRight: 3,
              marginLeft: 15,
              borderRadius: 2
            }}
          >
            {/* <Button
              variant="contained"
              color="success"
              sx={{ width: '100px' }}
              onClick={handleSavePropertyInfo}
              disabled={loading} // ✅ disable while saving
            >
              {loading ? 'Saving...' : 'Save'}
            </Button> */}
            <Button
  variant="contained"
  color="success"
  sx={{ width: '100px' }}
  onClick={loggedInUserRole?.startsWith('AMC') ? handleSavePropertyInfoAmc : handleSavePropertyInfo}
  disabled={loading}
>
  {loading ? 'Saving...' : 'Save'}
</Button>
{isAMCUser && (
  <Button
    variant="contained"
    color="success"
    onClick={handlePrint}
    disabled={!canPrint}
  >
Print  </Button>
)}
            {isAMCUser && (
  <Button
    variant="contained"
    color="success"
    sx={{ length: '100px' }}

    onClick={handleSaveAndApprove}
  >
    Save & Approval
  </Button>
)}
            <Button variant="contained" color="error" sx={{ width: '100px' }} onClick={deletePropertybyOwnerId}>
              Delete
            </Button>
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
          <Dialog open={openDelete} maxWidth="xs" fullWidth>
            <DialogContent>
              <Typography variant="body1">Are you sure you want to delete?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleYes} color="error" variant="contained">
                Yes
              </Button>
              <Button onClick={handleNo} color="primary" variant="outlined">
                No
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDialogPassword} onClose={handleCloseDialogPassword} fullWidth maxWidth="xs">
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
              <Button variant="contained" color="success" onClick={handleCloseDialogPassword} autoFocus>
                Submit
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCancelDialogPassword} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      )}
      {showSaveCancelButtons && (
        <Grid container spacing={2} marginTop={5} display={'flex'} justifyContent={'center'}>
          <Grid item xs={12} sm={1}>
            <Stack spacing={1}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                disabled={loading} 
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
              {/* //approval */}

              {isAMCUser && (
    <Button
      variant="contained"
      color="success"
      onClick={handleSaveAndApprove}
      disabled={loading}
    >
      Save & Approval
    </Button>
  )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Stack spacing={1}>
              <Button variant="contained" color="error" onClick={handleCancel}>
                Cancel
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          Form Submitted Successfully
        </Alert>
      </Snackbar> */}
      <Snackbar
        open={UpdateDetailsOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          Details Updated Successfully
        </Alert>
      </Snackbar>
      {/* Update Retain Tax */}
      <Dialog open={openUpdateRetainTax} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Grid container>
          <Grid item xs={12} md={6} lg={6}>
            {/* <DialogTitle>Update Retain Tax</DialogTitle> */}
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DialogActions style={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={handleCloseDialog} color="error">
                <CloseOutlined />
              </IconButton>
            </DialogActions>
          </Grid>
        </Grid>
        <DialogContent>
          <MainCard title="Update Retain Taxes">
            <Grid container spacing={2}>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>RV</InputLabel>
                  <TextField
                    name="RentalValue"
                    onChange={handleRetainChange}
                    value={updateRetainTax.RentalValue ?? ''}
                    error={!!retainErrors.RentalValue}
                    helperText={retainErrors.RentalValue}
                  />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Property</InputLabel>
                  <TextField name="PropertyTax" onChange={handleRetainChange} value={updateRetainTax.PropertyTax ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Edu.</InputLabel>
                  <TextField name="EducationTax" onChange={handleRetainChange} value={updateRetainTax.EducationTax ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Spl Edu.</InputLabel>
                  <TextField name="SpEducationTax" onChange={handleRetainChange} value={updateRetainTax.SpEducationTax ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Emp</InputLabel>
                  <TextField name="EmploymentTax" onChange={handleRetainChange} value={updateRetainTax.EmploymentTax ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Tree</InputLabel>
                  <TextField name="TreeCess" onChange={handleRetainChange} value={updateRetainTax.TreeCess ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Fire</InputLabel>
                  <TextField name="FireCess" onChange={handleRetainChange} value={updateRetainTax.FireCess ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Light</InputLabel>
                  <TextField name="LightCess" onChange={handleRetainChange} value={updateRetainTax.LightCess ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Drain</InputLabel>
                  <TextField name="DrainCess" onChange={handleRetainChange} value={updateRetainTax.DrainCess ?? ''} />
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Road</InputLabel>
                  <TextField name="RoadCess" onChange={handleRetainChange} value={updateRetainTax.RoadCess ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Sanitation</InputLabel>
                  <TextField name="Sanitation" onChange={handleRetainChange} value={updateRetainTax.Sanitation ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>W.Cess</InputLabel>
                  <TextField name="SpWaterCess" onChange={handleRetainChange} value={updateRetainTax.SpWaterCess ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>W.Ben</InputLabel>
                  <TextField name="WaterBenefit" onChange={handleRetainChange} value={updateRetainTax.WaterBenefit ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>W.Bill</InputLabel>
                  <TextField name="WaterBill" onChange={handleRetainChange} value={updateRetainTax.WaterBill ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>M.Build</InputLabel>
                  <TextField name="MajorBuilding" onChange={handleRetainChange} value={updateRetainTax.MajorBuilding ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Sewage</InputLabel>
                  <TextField name="SewageDisposalCess" onChange={handleRetainChange} value={updateRetainTax.SewageDisposalCess ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Tax1</InputLabel>
                  <TextField name="Tax1" onChange={handleRetainChange} value={updateRetainTax.Tax1 ?? ''} />
                </Stack>
              </Grid>
              <Grid item xs={1.3}>
                <Stack spacing={1}>
                  <InputLabel>Total Tax</InputLabel>
                  <TextField
                    name="TaxTotal"
                    onChange={handleRetainChange}
                    value={updateRetainTax.TaxTotal ?? ''}
                    InputProps={{ readOnly: true }}
                    error={Boolean(getTaxTotalError())} // 🔴 turns border red if error
                    helperText={getTaxTotalError() || ''}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Grid container justifyContent="center" alignItems="center" mt={2}>
              <Grid item xs={12} sm={1}>
                <Stack spacing={1} sx={{ textAlign: 'center' }}>
                  <Button variant="contained" color="success" onClick={SaveRetentionTaxes}>
                    Save
                  </Button>
                </Stack>
              </Grid>
              <Snackbar
                open={retainSnackbarOpen}
                autoHideDuration={4000}
                onClose={() => setRetainSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert
                  onClose={() => setRetainSnackbarOpen(false)}
                  severity={retainSnackbarSeverity} // "success" | "error"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {retainSnackbarMessage}
                </Alert>
              </Snackbar>
            </Grid>
          </MainCard>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={unsavedChangesSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="warning" variant="filled" sx={{ width: '100%' }}>
          You have unsaved changes. Please save before closing.
        </Alert>
      </Snackbar>
      ;{/* Update Retain Tax */}
      <Dialog open={openCombineProperty} onClose={handleCombineProperty}>
        <Grid container>
          <Grid item xs={12} md={6} lg={6}>
            <DialogTitle>Combine Property</DialogTitle>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DialogActions style={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={handleCombineProperty} color="error">
                <CloseOutlined />
              </IconButton>
            </DialogActions>
          </Grid>
        </Grid>
        <DialogContent>
          <Stack spacing={2} direction={'row'}>
            <Stack display={'flex'} alignItems={'center'}>
              <InputLabel>Property</InputLabel>
              <TextField label="New Property No" value={!stepperState.isNewProperty ? PP?.NewPropertyNo : ''} disabled fullWidth />
            </Stack>
            <Stack display={'flex'} alignItems={'center'}>
              <InputLabel>From Partition</InputLabel>
              <Select
                variant="outlined"
                sx={{ minWidth: '80px', '& .MuiInputBase-input': { padding: '7px 0' } }}
                value={!stepperState.isNewProperty ? fromPartitionNo : ''}
                disabled={stepperState.isNewProperty}
                onChange={(e) => setFromPartitionNo(e.target.value)}
              >
                {propertyPartitionRange.map((partition, index) => (
                  <MenuItem key={index} value={partition}>
                    {partition}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack display={'flex'} alignItems={'center'}>
              <InputLabel>To Partition</InputLabel>
              <Select
                variant="outlined"
                sx={{ minWidth: '80px', '& .MuiInputBase-input': { padding: '7px 0' } }}
                value={!stepperState.isNewProperty ? toPartitionNo : ''}
                onChange={(e) => setToPartitionNo(e.target.value)}
                disabled={stepperState.isNewProperty}
              >
                {propertyPartitionRange.map((partition, index) => (
                  <MenuItem key={index} value={partition}>
                    {partition}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>
          <Grid display={'flex'} justifyContent={'center'} mt={2}>
            <Button variant="contained" onClick={handleCombinePropertyButton} disabled={stepperState.isNewProperty}>
              Combine Property
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Total Valuation  */}
      <Dialog open={openTotalValuation} onClose={handleTotalValuation} maxWidth="xl">
        <Grid container>
          <Grid item xs={12} md={6} lg={6}>
            <DialogTitle>Total Valuation</DialogTitle>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DialogActions style={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={handleTotalValuation} color="error">
                <CloseOutlined />
              </IconButton>
            </DialogActions>
          </Grid>
        </Grid>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old RV</InputLabel>
                <TextField required fullWidth value={oldDetails.OldRV} />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old ALV</InputLabel>
                <TextField required fullWidth value={oldDetails.OldALV} />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old Tax</InputLabel>
                <TextField required fullWidth value={oldDetails.OldTotalTax} />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>New ALV</InputLabel>
                <TextField value={totalAnnualRentalValue} required fullWidth />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Net RV</InputLabel>
                <TextField value={totalRV} required fullWidth onClick={handleButtonNetRVClick} />
              </Stack>
            </Grid>
            <Dialog open={openDialogRV} onClose={handleCloseNetRVDialog}>
              <DialogTitle
                sx={{
                  fontSize: '1rem', // Adjust font size
                  color: '#d32f2f' // Set text color (error red in Material-UI)
                }}
              >
                RV Calculations:
              </DialogTitle>
              <DialogContent>
                {/* Input box */}
                <MainCard>
                  <Grid container spacing={2} mb={1} justifyContent="center">
                    {/* First Label and TextField */}
                    <Grid item xs={12} sm={3} mt={1}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <InputLabel sx={{ minWidth: '10px', fontWeight: 'bolder' }}>RV Calculations:</InputLabel>
                      </Stack>
                    </Grid>

                    {/* Second Label and TextField */}
                    <Grid item xs={12} sm={4}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <InputLabel sx={{ minWidth: '30px', fontWeight: 'bolder' }}>RV</InputLabel>
                        <TextField required fullWidth autoComplete="family-name" value="179096.23" />
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Table to display data */}
                  <TableContainer sx={{ marginTop: 1, height: 220 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Floor ID</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Const Year</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Const Type</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Type Of Use</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>NET ALV</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>NET RV</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>NET PERCENTAGE</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>CALCULATED ALV</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>CALCULATED RV</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>CALC percentage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Sample data rows */}
                        <TableRow>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                          <TableCell>0.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MainCard>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseNetRVDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Retain Reason</InputLabel>
                <TextField required fullWidth value={retainReason} />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Retain RV</InputLabel>
                <TextField required fullWidth value={retainRV} />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Hearing RV</InputLabel>
                <TextField required fullWidth value={hearingRV} />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Hearing Reason</InputLabel>
                <TextField required fullWidth value={hearingReason} />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>App Committee RV</InputLabel>
                <TextField required fullWidth value={appealRV} />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.7}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>App Committee Reason</InputLabel>
                <TextField required fullWidth value={appealReason} />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Remission RV</InputLabel>
                <TextField required fullWidth />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.6}>
              <Stack spacing={1}>
                <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Remission Reason</InputLabel>
                <TextField required fullWidth />
              </Stack>
            </Grid>
          </Grid>
          <Grid mt={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Ed.</TableCell>
                    <TableCell>Sp. Edu.</TableCell>
                    <TableCell>Emp.</TableCell>
                    <TableCell>tree</TableCell>
                    <TableCell>Fire</TableCell>
                    <TableCell>light</TableCell>
                    <TableCell>Drain</TableCell>
                    <TableCell>Road</TableCell>
                    <TableCell>Sanitation</TableCell>
                    <TableCell>W.Cess</TableCell>
                    <TableCell>W Benefit</TableCell>
                    <TableCell>Water Bill</TableCell>
                    <TableCell>Major Build</TableCell>
                    <TableCell>Sewage</TableCell>
                    <TableCell>Tax1</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>Net</TableCell>
                    {Object.values(netTaxes).map((value, index) => (
                      <TableCell alignItems="Centre" key={index}>
                        {Number(value).toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow hover>
                    <TableCell>Retain</TableCell>

                    {netTaxes.Total < oldDetails.OldTotalTax ? (
                      <TableCell colSpan={18} sx={{ pl: 3, color: 'blue', textTransform: 'none', backgroundColor: 'white' }}>
                        <Typography>Applicable : As per Old</Typography>
                      </TableCell>
                    ) : retainOwnerID === '' ? (
                      <TableCell colSpan={18} sx={{ pl: 3, color: 'blue', textTransform: 'none', backgroundColor: 'white' }}>
                        Applicable for : does not set policies
                      </TableCell>
                    ) : (
                      Object.values(retainTaxes).map((value, index) => (
                        <TableCell alignItems="Centre" key={index}>
                          {Number(value).toFixed(2)}
                        </TableCell>
                      ))
                    )}
                  </TableRow>

                  <TableRow hover>
                    <TableCell>Hearing</TableCell>
                    {Object.values(hearingTaxes).map((value, index) => (
                      <TableCell alignItems="Centre" key={index}>
                        {Number(value).toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow hover>
                    <TableCell>App. Comi.</TableCell>
                    {Object.values(appealTaxes).map((value, index) => (
                      <TableCell alignItems="Centre" key={index}>
                        {Number(value).toFixed(2)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </DialogContent>
      </Dialog>
    </MainCard>
  );
};

export default DataEntry;
