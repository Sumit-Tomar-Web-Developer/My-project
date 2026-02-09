import { Grid, Stack, Button, InputLabel, TextField, Card, CardContent, Typography, Table, TableRow, TableCell, TableHead, TableBody, MenuItem, Select, Checkbox, FormControlLabel, TableContainer, Paper, Snackbar, SnackbarContent, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { addTaxRow, deleteDocumentFile,
    setPolicy,
    setAction,
    setFinanceYear,  
    updateDocumentFile,
    setAssessment,
    addDocument} from 'state/reducers/ExistingPropertySlice';
import { getBillBookYearRange } from 'services/Amc/SetRemarkInvoiceService/setReamarkInvoiceService';
import { fetchPropertyMast } from 'services/data-entry.services';
import { fetchValuationData, saveOwnerTaxChange } from 'services/assessmentService/DataEntryService/dataEntryService';
import { OwnerIdWiseWard } from 'services/assessmentService/zoning.service';
import { applyPolicyDetails, removeAllAppealsDetails, removeAppealCommitteeDetails, removeHearingDetails, removeRemissionDetails, removeRetentionDetails } from 'services/assessmentService/TotalValuation/totalValuation';
import { fetchAllApplyTaxes, saveAppliedTaxes } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { saveAddTaxButton } from 'services/utlilityService/AddTaxService/AddTaxService';
import { copyTransMastYear, sendDataEntryForApproval, uploadDataEntryChangesDocument } from 'services/transaction/dataentryApprovalService/dataEntryApprovalService';
// import { addTaxRow,updateDocumentFile,
    // deleteDocumentFile,
    // setPolicy,
    // setAction,
    // setFinanceYear } from 'state/reducers/dataEntryApprovalAssessment';
    // const { propertyMast } = useSelector((state) => state.combinedDataEntry);

    const DataEntryApprovalAssessment = ({ isNewProperty, selectedOwnerID }) => {
      const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user check data entry page');
  }, [userData]);

  const {
    remark,
    documents,
    policy,
    action,
    financeYear,
    assessment   ,
    propertyMast       
  } = useSelector((state) => state.combinedDataEntry);
  const [taxRows, setTaxRows] = useState([]);
//   const [remark, setRemark] = useState('');
const [yearOptions, setYearOptions] = useState([]);

const fetchYear = async () => {
    try {
      const response = await getBillBookYearRange();
      setYearOptions(response);
    } catch (error) {
      console.error('Error fetching year list:', error);
      setYearOptions([]);
    }
  };
  const { propertyId } = useParams(); 
  useEffect(() => {
    fetchYear();
  }, []);
  useEffect(() => {
    console.log('propertyId from URL:', propertyId);
    console.log('propertyMast from Redux:', propertyMast);
  
    if (!propertyMast && propertyId) {
      dispatch(fetchPropertyMast(propertyId));
    }
  }, [propertyMast, propertyId, dispatch]);
  

  



  const handleDownload = (doc) => {
    if (!doc.file) return;
  
    const url = URL.createObjectURL(doc.file);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.file.name;   // ✅ original file name
    document.body.appendChild(a);
    a.click();
  
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleDelete = (id) => {
    dispatch(deleteDocumentFile(id));
  };
  // const handleFileChange = (id, file) => {
  //   console.log('Uploading file:', id, file);
  //   dispatch(updateDocumentFile({ id, file }));
  // };
  const handleFileChange = async (docId, file) => {
    if (!file) return;
  
    const doc = documents.find((d) => d.id === docId || d.DocumentID === docId);
    if (!doc) return;
  
    const wardTag =  assessment.NewWardNo ||
      ownerWardProperties[0]?.NewWardNo ||
      propertyMast?.NewWardNo;
    const newFileName = `${docId}__${wardTag}_${selectedOwnerID}__${file.name}`;
  
    const renamedFile = new File([file], newFileName, {
      type: file.type
    });
  
    console.log("📤 Uploading Document:", {
      docId: docId,
      originalFileName: file.name,
      renamedFile: newFileName
    });
  
    const formData = new FormData();
    formData.append("file", renamedFile);
    formData.append("OwnerID", selectedOwnerID);
    formData.append("DocumentName", doc.documentType || doc.name);
  
    try {
      // API Call (Ensure karein ki ye service import hai)
      const data = await uploadDataEntryChangesDocument(formData);
  
      if (!data.success) {
        throw new Error("Upload failed");
      }
  
      const uploadedFilePath = data.files ? data.files[0].filePath : '';
  
      // ✅ Redux State Update
      // Hum updateDocumentFile action ka use karenge jo aapne pehle define kiya tha
      dispatch(
        updateDocumentFile({
          id: docId,
          file: renamedFile,
          uploadedFilePath: uploadedFilePath,
          fileName: newFileName
        })
      );
  
      setReceivedMessage(`"${doc.documentType || 'File'}" uploaded successfully`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setReceivedMessage("Upload failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const handlePrint = async () => {
    // 🖨️ Print
    window.print();
  
    dispatch(
      addDocument({
        id: 10,
        name: 'वाढघट कागदपत्र',
        file: null
      })
    );
  };
  
const canPrint = documents.some(
  d => d.id >= 1 && d.id <= 9 && d.file
);
const isDataEntryDocsUploaded = documents.some(
  d => d.id === 10 && d.file
);

  const handleAssessmentChange = (field) => (e) => {
    dispatch(setAssessment({ [field]: e.target.value }));
  };

  const handleKeyDownSocial = (event) => {
    if (event.key === 'Escape') {
      navigate('/assessment/data-entry');
    } else if (event.key === 'backspace') {
      navigate('false');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownSocial);

    return () => {
      window.removeEventListener('keydown', handleKeyDownSocial);
    };
  });

  //total valaution
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
  const [remissionTaxes, setRemissionTaxes] = useState({
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
  const [openApplyTax, setApplyTax] = useState(false);
  const handleApplyTax = () => {
    setApplyTax(false);
  };
   const handleOldInformation = () => {
    setOldInformation(false);
  };
  const [retainReason, setRetainReason] = useState('');
  const [retainRV, setRetainRV] = useState('');
  const [hearingRV, setHearingRV] = useState('');
  const [hearingReason, setHearingReason] = useState('');
  const [appealRV, setAppealRV] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [remissionRV, setRemissionRV] = useState('');
  const [remissionReason, setRemissionReason] = useState('');
  const [openTotalValuation, setOpenTotalValuation] = useState(false);
const [totalValuationData, setTotalValuationData] = useState(null);
const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
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
const [oldDetails, setOldDetails] = useState({
  OldALV: null,
  OldRV: null,
  OldTotalTax: null
});
const [totalRV, setTotalRV] = useState(0);
  const [databaseRows, setDatabaseRows] = useState([]);

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
const [applicalePolicy, setApplicablePolicy] = useState('');

useEffect(() => {
  if (propertyPartitionRange.length > 0) {
  }
}, [propertyPartitionRange]);


useEffect(() => {
  const fetchTotalValuationData = async () => {
    try {
      if (!selectedOwnerID) return;

      const result = await fetchValuationData(selectedOwnerID);
      console.log("API Result 👉", result);

      /* ================= NET TAX (COMMON) ================= */
      const netTaxesRow = result?.[0]?.[0]?.[0] ?? {};
      console.log("Net Taxes Row 👉", netTaxesRow);

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
      const retain = result?.[1]?.[0] ?? {};
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
      const hearing = result?.[2]?.[0] ??{};
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
      const appeal = result?.[3]?.[0] ??{};
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
      const remission = result?.[4]?.[0] ??{};
      if (remission.length > 0) {
        setRemissionReason(remission[0]?.Reason || '');
        setRemissionRV(remission[0]?.RentalValue || '');
        setRemissionTaxes({
          PropertyTax: remission[0]?.PropertyTax,
          EducationTax: remission[0]?.EducationTax,
          SpEducationTax: remission[0]?.SpEducationTax,
          EmploymentTax: remission[0]?.EmploymentTax,
          TreeCess: remission[0]?.TreeCess,
          FireCess: remission[0]?.FireCess,
          LightCess: remission[0]?.LightCess,
          DrainCess: remission[0]?.DrainCess,
          RoadCess: remission[0]?.RoadCess,
          Sanitation: remission[0]?.Sanitation,
          SpWaterCess: remission[0]?.SpWaterCess,
          WaterBenefitTax: remission[0]?.WaterBenefitTax,
          WaterBill: remission[0]?.WaterBill || 0,
          MajorBuildingTax: remission[0]?.MajorBuildingTax,
          SewageDispCess: remission[0]?.SewageDispCess,
          Tax1: remission[0]?.Tax1,
          Total: remission[0]?.Total

        });
      }
      /* ================= OLD PROPERTY ONLY ================= */
      if (!isNewProperty) {
        const oldData = result?.[4]?.[0] || {};
        console.log("Old Property Details 👉", oldData);

        setOldDetails({
          OldALV: result?.[4]?.[0]?.OldALV || null,
            OldRV: result?.[4]?.[0]?.OldRV || null,
            OldTotalTax: result?.[4]?.[0]?.OldTotalTax || null
       
        });
      }
      setDatabaseRows(result?.[5] || []);

    } catch (error) {
      console.error("❌ Valuation Error", error);
    }
  };

  fetchTotalValuationData();
}, [selectedOwnerID, isNewProperty]);
//wardno
const [ownerWardProperties, setOwnerWardProperties] = useState([]);
  
useEffect(() => {
  const fetchOwnerWard = async () => {
    if (!selectedOwnerID) return;

    try {
      const response = await OwnerIdWiseWard({ OwnerID: selectedOwnerID });
      const data = response.res?.data || [];
      console.log("Owner-wise ward/property:", data);

      // Save to local state
      setOwnerWardProperties(data);

      // ✅ Set the first WardNo in Redux
      if (data.length > 0) {
        dispatch(setAssessment({ NewWardNo: data[0].NewWardNo }));
      }

    } catch (error) {
      console.error("Error fetching owner-wise ward/property:", error);
      setOwnerWardProperties([]);
    }
  };

  fetchOwnerWard();
}, [selectedOwnerID, dispatch]);
//policy,action
const isFirstRender = useRef(true);
useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }

  if (!action || !selectedOwnerID) return;

  console.log("Selected action 👉", action);

  const runAction = async () => {
    try {
      let response;

      switch (action) {
        case 1:
          response = await applyPolicyDetails(
            selectedOwnerID,
            applicalePolicy
          );
          break;

        case 2:
          response = await removeRetentionDetails(selectedOwnerID);
          break;

        case 3:
          response = await removeAppealCommitteeDetails(selectedOwnerID);
          break;

        case 4:
          response = await removeRemissionDetails(selectedOwnerID);
          break;

        case 5:
          response = await removeAllAppealsDetails(selectedOwnerID);
          break;

        case 6:
          response = await removeHearingDetails(selectedOwnerID);
          break;

        default:
          return;
      }

      if (response?.status === 200) {
        setReceivedMessage("Action completed successfully");
        setSnackbarSeverity("success");
      } else {
        setReceivedMessage(response?.data?.message || "Action failed");
        setSnackbarSeverity("error");
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error("Action error ❌", error);
      setReceivedMessage("Something went wrong");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setAction(''); // 👈 LAST me reset
    }
  };

  runAction();
}, [action, selectedOwnerID]);

// useEffect(() => {
//   if (isFirstRender.current) {
//     return;
//   }
//   console.log('Selected action:', action);
//   // perform action based on value
//   const runAction = async () => {
//     switch (action) {
//       case 1:
//         console.log("Apply clicked");
//         const applyPolicy = async () => {
//           try {
//             const response = await applyPolicyDetails(selectedOwnerID, applicalePolicy)
//             if (response && response.status === 200) {
//               console.log("Policy applied successfully");
//               setReceivedMessage('Policy applied successfully');
//               setSnackbarSeverity("success");
//               setSnackbarOpen(true);
//             } else {
//               console.error("Failed to apply policy, response status:", response.status);
//               setReceivedMessage('Failed to apply policy');
//               setSnackbarSeverity("error");
//               setSnackbarOpen(true);
//             }
//           } catch (error) {
//             console.error("Failed to apply policy, response status:", response.status);
//             setReceivedMessage('Failed to apply policy');
//             setSnackbarSeverity("error");
//             setSnackbarOpen(true);
//           }
//         }
//         applyPolicy();

//         break;
//       case 2:
//         console.log("Remove Retention clicked");
//         const removeRetention = async () => {
//           try {
//             const response = await removeRetentionDetails(selectedOwnerID)
//             if (response && response.status === 200) {
//               console.log("Retention removed successfully");
//               setSnackbarOpen(true);
//               // setSnackbarMessage("Retention removed successfully");
//               setReceivedMessage('Retention removed successfully');
//               setSnackbarSeverity("success");
//             }
//             else {
//               console.error("Failed to remove retention, response status:", response.status);
//               setSnackbarOpen(true);
//               // setSnackbarMessage("Failed to remove retention");
//               setReceivedMessage('Failed to remove retention');
//               setSnackbarSeverity("error");
//             }
//           } catch (error) {
//             console.error("Error removing retention:", error);
//           }
//         };
//         removeRetention();
//         break;
//       case 3:
//         console.log("Remove Appeal Committee clicked");
//         const removeAppealCommittee = async () => {
//           try {
//             const response = await removeAppealCommitteeDetails(selectedOwnerID)
//             if (response && response.status === 200) {
//               console.log("Appeal committee removed successfully");
//               setSnackbarOpen(true);
//               // setSnackbarMessage("Appeal committee removed successfully");
//               setReceivedMessage('Appeal committee removed successfully');
//               setSnackbarSeverity("success");
//             }
//             else {
//               console.error("Failed to remove appeal committee, response status:", response.status);
//               setSnackbarOpen(true);
//               // setSnackbarMessage("Failed to remove appeal committee");
//               setReceivedMessage('Failed to remove appeal committee');
//               setSnackbarSeverity("error");
//             }
//           } catch (error) {
//             console.error("Error removing appeal committee:", error);
//           }
//         };
//         removeAppealCommittee();
//         break;
//       case 4:
//         console.log("Remove Remission clicked");
//         const removeRemission = async () => {
//           try {
//             const response = await removeRemissionDetails(selectedOwnerID)
//             if (response && response.status === 200) {
//               console.log("Remission removed successfully");
//               setSnackbarOpen(true);
//               // setSnackbarMessage("Remission removed successfully");
//               setReceivedMessage('Remission removed successfully');
//               setSnackbarSeverity("success");
//             }
//             else {
//               console.error("Failed to remove remission, response status:", response.status);
//               setSnackbarOpen(true);
//               // setSnackbarMessage("Failed to remove remission");
//               setReceivedMessage('Failed to remove remission');
//               setSnackbarSeverity("error");
//             }
//           } catch (error) {
//             console.error("Error removing remission:", error);
//           }
//         };
//         removeRemission();
//         break;
//       case 5:
//         console.log("Remove All Appeals clicked");
//         const removeAllAppeals = async () => {
//           try {
//             const response = await removeAllAppealsDetails(selectedOwnerID)
//             console.log('Response from removeAllAppealsDetails:', response);
//             if (response && response.status === 200) {
//               console.log("All appeals removed successfully");
//               setSnackbarOpen(true);
//               // setSnackbarMessage("All appeals removed successfully");
//               setReceivedMessage('All appeals removed successfully');
//               setSnackbarSeverity("success");
//             }
//             else {
//               console.error("Failed to remove all appeals, response status:", response.status);
//               setSnackbarOpen(true);
//               // setSnackbarMessage("Failed to remove all appeals");
//               setReceivedMessage('Failed to remove all appeals');
//               setSnackbarSeverity("error");
//             }

//           } catch (error) {
//             console.error("Error removing all appeals:", error);
//           }
//         };
//         removeAllAppeals();
//         break;
//       case 6:
//         console.log("Remove Hearing clicked");
//         const removeHearing = async () => {
//           try {
//             const response = await removeHearingDetails(selectedOwnerID)
//             console.log('Response from removeHearingDetails:', response);
//             if (response && response.status === 200) {
//               console.log(" hearings removed successfully");
//               setSnackbarOpen(true);
//               // setSnackbarMessage("All hearings removed successfully");
//               setReceivedMessage(' Hearings removed successfully');
//               setSnackbarSeverity("success");
//             }
//             else {
//               console.error("Failed to remove  Hearings, response status:", response.status);
//               setSnackbarOpen(true);
//               // setSnackbarMessage("Failed to remove all hearings");
//               setReceivedMessage('Failed to remove  Hearings');
//               setSnackbarSeverity("error");
//             }

//           } catch (error) {
//             console.error("Error removing all hearings:", error);
//           }
//         };
//         removeHearing();
//         break;
//       default:
//         break;
//     }
//   };
//   setNewDetails((pre) => ({ ...pre, propertyNo: newDetails.propertyNo }));
//   setAction('')
//   runAction();
// }, [action]);

useEffect(() => { }, [applicalePolicy])
//save last row


///apply taxes
const [openApplyTaxDialog, setOpenApplyTaxDialog] = useState(false);
const [appliedTaxes, setAppliedTaxes] = useState({
  PropertyTax: 0,
  EducationTax: 0,
  TreeCess: 0,
  EmploymentTax: 0,
  SpEducationTax: 0,
  FireCess: 0,
  RoadCess: 0,
  LightCess: 0,
  SewageCess: 0,
  SanitationCess: 0,
  DrainCess: 0,
  SpWaterCess: 0,
  WaterBenefits: 0,
  MajorBuilding: 0,
  WaterBill: 0,
  Tax1: 0,
  Tax2: 0,
  Tax3: 0,
  Tax4: 0,
  Tax5: 0,
  IsTaxForPlot: 0,
  IsPolicyApplicable: 0
});
// Add a new state for loading
const [savingTaxes, setSavingTaxes] = useState(false);

const handleSaveTaxes = async () => {
  try {
    // Show loader
    setSavingTaxes(true);

    // Ensure NewWardNo is set
    const wardNo = assessment.NewWardNo || ownerWardProperties[0]?.NewWardNo || propertyMast?.NewWardNo;

    if (!wardNo) {
      setReceivedMessage("Ward number is missing. Cannot apply taxes.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSavingTaxes(false);
      return;
    }

    const payload = {
      selectedWard: Number(wardNo),
      selectAll: false,
      propertyTax: Number(appliedTaxes.PropertyTax || 0),
      educationTax: Number(appliedTaxes.EducationTax || 0),
      employmentTax: Number(appliedTaxes.EmploymentTax || 0),
      spEducationTax: Number(appliedTaxes.SpEducationTax || 0),
      drainCess: Number(appliedTaxes.DrainCess || 0),
      roadCess: Number(appliedTaxes.RoadCess || 0),
      treeCess: Number(appliedTaxes.TreeCess || 0),
      sewageDisposalCess: Number(appliedTaxes.SewageCess || 0),
      sanitation: Number(appliedTaxes.SanitationCess || 0),
      waterBenefit: Number(appliedTaxes.WaterBenefits || 0),
      spWaterCess: Number(appliedTaxes.SpWaterCess || 0),
      majorBuilding: Number(appliedTaxes.MajorBuilding || 0),
      fireCess: Number(appliedTaxes.FireCess || 0),
      lightCess: Number(appliedTaxes.LightCess || 0),
      tax1: Number(appliedTaxes.Tax1 || 0),
      tax2: Number(appliedTaxes.Tax2 || 0),
      tax3: Number(appliedTaxes.Tax3 || 0),
      tax4: Number(appliedTaxes.Tax4 || 0),
      tax5: Number(appliedTaxes.Tax5 || 0),
      waterBill: Number(appliedTaxes.WaterBill || 0),
      isTaxForPlot: Number(appliedTaxes.IsTaxForPlot || 0),
      isPolicyApplicable: Number(appliedTaxes.IsPolicyApplicable || 0),
    };

    console.log("SAVE TAXES 👉", payload);

    const res = await saveAppliedTaxes(payload);

    if (res?.status === 200) {
      setReceivedMessage("Taxes updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenApplyTaxDialog(false);
    }
  } catch (err) {
    console.error("Save error", err);
    setReceivedMessage("Failed to save taxes");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    // Hide loader
    setSavingTaxes(false);
  }
};




const handleTaxChange = (field) => (e) => {
  let value = e.target.value;

  // allow empty string while typing/backspace
  if (value === '') {
    setAppliedTaxes(prev => ({ ...prev, [field]: '' }));
    return;
  }

  // only allow 0 or 1
  if (value === '0' || value === '1') {
    setAppliedTaxes(prev => ({ ...prev, [field]: Number(value) }));
  }
};

//fetch taxes -apply taxes
const fetchApplyTaxes = async () => {
  try {
    const result = await fetchAllApplyTaxes(selectedOwnerID);

    console.log('Apply Taxes API Result 👉', result);

    if (result?.status === true) {
      const d = result.data;

      setAppliedTaxes({
        PropertyTax: d.PropertyTax ?? 0,
        EducationTax: d.EducationTax ?? 0,
        TreeCess: d.TreeCess ?? 0,
        EmploymentTax: d.EmploymentTax ?? 0,
        SpEducationTax: d.SpEducationTax ?? 0,
        FireCess: d.FireCess ?? 0,
        RoadCess: d.RoadCess ?? 0,
        LightCess: d.LightCess ?? 0,

        SewageCess: d.SewageDisposalCess ?? 0, // mapping
        SanitationCess: d.Sanitation ?? 0,
        DrainCess: d.DrainCess ?? 0,

        WaterBenefits: d.WaterBenefit ?? 0,
        SpWaterCess: d.SpWaterCess ?? 0,
        WaterBill: d.WaterBill ?? 0,
        MajorBuilding: d.MajorBuilding ?? 0,

        Tax1: d.Tax1 ?? 0,
        Tax2: d.Tax2 ?? 0,
        Tax3: d.Tax3 ?? 0,
        Tax4: d.Tax4 ?? 0,
        Tax5: d.Tax5 ?? 0,

        IsTaxForPlot: d.IsTaxForPlot ?? 0,
        IsPolicyApplicable: d.IsPolicyApplicable ?? 0
      });
    }
  } catch (err) {
    console.error('Failed to load applied taxes', err);
  }
};


const openApplyTaxDialogHandler = () => {
  setOpenApplyTaxDialog(true);
  fetchApplyTaxes();
};

const closeApplyTaxDialogHandler = () => {
  setOpenApplyTaxDialog(false);
};
useEffect(() => {
  console.log('Applied Taxes State:', appliedTaxes);
}, [appliedTaxes]);
{/* save last row Tax */}
const [savedLastRow, setSavedLastRow] = useState(null);
const [showSavedRow, setShowSavedRow] = useState(false);
const [savingLastRow, setSavingLastRow] = useState(false);
const [showOnlySavedRow, setShowOnlySavedRow] = useState(false);



const calculateTotal = (row) => {
  const fields = [
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
    "SpWaterCess",
    "WaterBenefit",
    "WaterBill",
    "Interest",
    "SewageDisposalCess",
    "Tax1"
  ];

  return fields.reduce((sum, key) => {
    return sum + Number(row?.[key] || 0);
  }, 0);
};
const handleSaveToLastRow = async () => {
  try {
    if (!selectedOwnerID || !financeYear) {
      alert("Please select Owner and Finance Year first");
      return;
    }

    const selectedYear = Number(financeYear.split('-')[0]);

    const payload = {
      OwnerID: selectedOwnerID,     
      SourceYear: selectedYear+1 , 
      FinanceYear: selectedYear,
      CreatedBy: userData?.UserID || 1           
    };

    console.log("Sending Payload:", payload); 

    const res = await copyTransMastYear(payload);

    if (res.success) {
      setReceivedMessage(res.message || "Last row saved successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setReceivedMessage(res.message || 'Failed to save last row');
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  } catch (err) {
    console.error("Error in handleSaveToLastRow:", err);
    alert(err.message || 'Server error');
  }
};
const handleSaveLastRow = async () => {
  try {
    setSavingLastRow(true);

    const payload = {
      OwnerID: selectedOwnerID,
      Year: Number(financeYear.split('-')[0]),
      CreatedBy: assessment?.UserID || 1
    };

    console.log("SAVE LAST ROW PAYLOAD 👉", payload);

    const res = await saveOwnerTaxChange(payload);

    console.log("SAVE LAST ROW RESPONSE 👉", res);

    setSavedLastRow(res.afterRow);
    setShowSavedRow(true);
    setShowOnlySavedRow(true); 
    setReceivedMessage(res.message || "Last row saved & updated");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

  } catch (err) {
    console.error("Save Last Row Error", err);
    setReceivedMessage("Failed to save last row");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setSavingLastRow(false);
  }
};
//add tax without approval
const [withInterest, setWithInterest] = useState(false);
const [loading, setLoading] = useState(false);

const handleAddTaxWithoutApproval = async () => {
  try {
    setLoading(true);

    const wardNo =
      assessment.NewWardNo ||
      ownerWardProperties[0]?.NewWardNo ||
      propertyMast?.NewWardNo;

    if (!wardNo || !financeYear) {
      setReceivedMessage("Ward or Finance Year missing");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // "2025-2026" -> 2025
    const startYear = Number(financeYear.split("-")[0]);

    const ward = {
      selectedWard: Number(wardNo),
      withInterest: withInterest
    };

    const financeYearObj = {
      FinanceYear: startYear
    };

    console.log("WARD 👉", ward);
    console.log("FINANCE YEAR 👉", financeYearObj);

    // 🔥 IMPORTANT: 3 params pass karo
    const res = await saveAddTaxButton(
      ward,
      financeYearObj,
      withInterest
    );

    if (res?.status === 200) {
      setReceivedMessage(res.message || "Tax added successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  } catch (err) {
    console.error("Add Tax Error ❌", err);
    setReceivedMessage("Failed to add tax");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
  }
};
//save to approval

// const handleSendToApproval = async () => {
//   try {
//     setLoading(true); // Loading start

//     if (!selectedOwnerID) {
//       setReceivedMessage("Owner not selected");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//       return;
//     }

//     const wardNo =
//       assessment.NewWardNo ||
//       ownerWardProperties[0]?.NewWardNo ||
//       propertyMast?.NewWardNo;

//     if (!wardNo) {
//       setReceivedMessage("Ward number is missing");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//       return;
//     }

//     const user = {
//       UserID: userData?.UserID || 1,
//       name: userData?.name || "Unknown"
//     };

//     // 🔹 Call service
//     const result = await sendDataEntryForApproval(selectedOwnerID, wardNo, user);

//     console.log("Approval Sent:", result);

//     // 🔹 Success snackbar
//     setReceivedMessage(`Sent successfully. Display No: ${result.wadhGhatDisplayNo}`);
//     setSnackbarSeverity("success");
//     setSnackbarOpen(true);

//   } catch (err) {
//     console.error("Send to Approval Error ❌", err);

//     setReceivedMessage(err.message || "Failed to send for approval");
//     setSnackbarSeverity("error");
//     setSnackbarOpen(true);
//   } finally {
//     setLoading(false); // Loading end
//   }
// };
const handleSendToApproval = async () => {
  try {
    setLoading(true); // Loading start

    if (!selectedOwnerID) {
      setReceivedMessage("Owner not selected");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const wardNo =
      assessment?.NewWardNo ||
      ownerWardProperties?.[0]?.NewWardNo ||
      propertyMast?.NewWardNo;

    if (!wardNo) {
      setReceivedMessage("Ward number is missing");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const user = {
      UserID: userData?.UserID || 1,
      name: userData?.name || "Unknown"
    };

    // ✅ Single object payload (BEST PRACTICE)
    const approvalPayload = {
      OwnerID: selectedOwnerID,
      WardNo: wardNo,
      User: user,

      assessment,
      remark,
      documents,
      policy,
      propertyMast
    };

    console.log("FINAL APPROVAL PAYLOAD 👉", approvalPayload);

    // 🔹 Call service
    const result = await sendDataEntryForApproval(approvalPayload);

    // 🔹 Success snackbar
    setReceivedMessage(
      `Sent successfully. Display No: ${result?.wadhGhatDisplayNo || "N/A"}`
    );
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

  } catch (err) {
    console.error("Send to Approval Error ❌", err);

    setReceivedMessage(
      err?.message || err?.message || "Failed to send for approval"
    );
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setLoading(false); // Loading end
  }
};


  return (
    <MainCard title="dataEntryApproval">
        
        <>
        <MainCard>  

        <Grid
    container
    alignItems="center"
    justifyContent="space-between"
    sx={{ mb: 2 }}
  >
    {/* LEFT : Title */}
   

<Grid item sx={{ width: { xs: '100%', sm: 420 } }}>
  <Stack
    direction="row"
    alignItems="center"   
  >
    {/* LABEL */}
    <InputLabel
      sx={{
        fontWeight: 600,
        whiteSpace: 'nowrap',
        minWidth: 90
      }}
    >
वार्ड क्र. :
    </InputLabel>

    {/* TEXTBOX */}
    <Typography
      variant="body1"
      sx={{
        minWidth: 100,
        color: 'blue',
        fontWeight: 600,
      }}
    >
      {/* Show Redux value if available, otherwise first from ownerWardProperties */}
      {assessment.NewWardNo || ownerWardProperties[0]?.NewWardNo || propertyMast?.NewWardNo || ''}
    </Typography>


  </Stack>
</Grid> 
<Grid item sx={{ width: { xs: '100%', sm: 300 } }}>
  <Stack
    direction="row"
    alignItems="center"   
  >
    {/* LABEL */}
    <InputLabel
      sx={{
        fontWeight: 600,
        whiteSpace: 'nowrap',
        minWidth: 90
      }}
    >
मालमत्ता क्र. :
    </InputLabel>

    <Typography
      variant="body1"
      sx={{
        minWidth: 100,
        color: 'blue',
        fontWeight: 600,
      }}
    >
      {assessment.NewPropertyNo || ownerWardProperties[0]?.NewPropertyNo || propertyMast?.NewPropertyNo || ''}
    </Typography>

  </Stack>
</Grid>
<Grid item sx={{ width: { xs: '100%', sm: 400  } }}>
  <Stack
    direction="row"
    alignItems="center"  
    spacing={2} 
  >
    {/* LABEL */}
    <InputLabel
      sx={{
        fontWeight: 600,
        whiteSpace: 'nowrap',
        minWidth: 90
      }}
    >
प्राथमिक कर धारकाचे नाव :    </InputLabel>

    {/* TEXTBOX */}
    <Typography
      variant="body1"
      sx={{
        minWidth: 100,
        color: 'blue',  
        fontWeight: 600,    }}
    >
      {assessment.OwnerNameMarathi || ownerWardProperties[0]?.OwnerNameMarathi || propertyMast?.OwnerNameMarathi || ''}
    </Typography>
  </Stack>
</Grid>

  </Grid>  </MainCard>

        {/* //add tax */}
        <Grid
    container
    alignItems="center"
    justifyContent="space-between"
    sx={{ mb: 2 , mt: 2}}

  >
    {/* LEFT : Title */}
    <Grid item>
      <Typography variant="h5" fontWeight={600}>
        Add Taxes & Final Submit
      </Typography>
    </Grid>

    <Grid item sx={{ width: { xs: '100%', sm: 420 } }}>
  <Stack
    direction="row"
    alignItems="center"   
  >
    {/* LABEL */}
    <InputLabel
  sx={{
    fontWeight: 700,
    whiteSpace: 'nowrap',
    minWidth: 80,
    color: 'red'
  }}
>
  वाढघट शेरा
</InputLabel>


    {/* TEXTBOX */}
    <TextField
      size="small"
      placeholder="वाढघट शेरा"
      multiline
      rows={2}
      fullWidth
    />
  </Stack>
</Grid>

   
  </Grid>
      <Grid container spacing={1}     sx={{ mb: 2 , mt: 2}}
>
<Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
  <Stack spacing={1}>
    <InputLabel>Old RV</InputLabel>
    <TextField
      required
      id="OldRV"
      name="OldRV"
      fullWidth
      autoComplete="given-name"
      
      value={oldDetails.OldRV}   
            
    />
  </Stack>
</Grid>

        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Old ALV</InputLabel>
            <TextField required id="FullNameBasic" name="FullName"
             fullWidth autoComplete="given-name" 
             value={oldDetails.OldALV}/>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Old Tax</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" 
            value={oldDetails.OldTotalTax}></TextField>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>New ALV</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" 
            fullWidth autoComplete="given-name"  value={totalAnnualRentalValue}
           />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Net RV</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name"
           value={totalRV}
 />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Ret.RV</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name"
              value={retainRV}
                />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Ret.Reason</InputLabel>
            <TextField required id="FullNameBasic" 
            name="FullName" 
            fullWidth autoComplete="given-name" 
            value={retainReason}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Hear.RV</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name"
                        value={hearingRV}
                       />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Hear.Reason</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name"
           value={hearingReason}
             />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>App Comm.RV</InputLabel>
            <TextField required id="FullNameBasic" 
            name="FullName" fullWidth autoComplete="given-name" 
            value={appealRV}
           />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>App Comm.Reason</InputLabel>
            <TextField required id="FullNameBasic" 
            name="FullName"
             autoComplete="given-name"
             value={appealReason}
                
             />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Rem.RV</InputLabel>
            <TextField required id="FullNameBasic"
             name="FullName" 
             fullWidth autoComplete="given-name"
             value={remissionRV}
                     
          ></TextField>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Rem.Reason</InputLabel>
            <TextField required id="FullNameBasic" 
            name="FullName"
             fullWidth autoComplete="given-name"
             value={remissionReason}
                        ></TextField>
          </Stack>
        </Grid>
   
      </Grid>
{/* table */}
      <Grid item xs={12} sm={12} mt={6}>
                
                    <Box sx={{ overflowX: 'auto', height: '300px' }}>
                      <Table>
                        <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                          <TableRow>
                            <TableCell>Property</TableCell>
                            <TableCell>Edu.</TableCell>
                            <TableCell>Sp.Edu.</TableCell>
                            <TableCell>Emp.</TableCell>
                             <TableCell>Tree</TableCell>
                            <TableCell>Fire</TableCell>
                            <TableCell>Light</TableCell>
                            <TableCell>Drain</TableCell>
                            <TableCell>Road</TableCell>
                            <TableCell>Sanitation</TableCell>
                            <TableCell>W.Cess</TableCell>
                            <TableCell>W.benefit</TableCell>
                            <TableCell>W.Bill</TableCell>
                            <TableCell>Old Int.</TableCell>
                            <TableCell>Sewage</TableCell>
                            <TableCell>Tax1</TableCell>
                            <TableCell>Total</TableCell>

                          </TableRow>
                        </TableHead>

                        <TableBody>
                        {showOnlySavedRow && savedLastRow && (
    <TableRow hover sx={{ backgroundColor: '#e8f5e9' }}>
      <TableCell align="center">{Number(savedLastRow.PropertyTax || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.EducationTax || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.SpEducationTax || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.EmploymentTax || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.TreeCess || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.FireCess || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.LightCess || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.DrainCess || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.RoadCess || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.Sanitation || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.SpWaterCess || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.WaterBenefit || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.WaterBill || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.Interest || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.SewageDisposalCess || 0).toFixed(2)}</TableCell>
      <TableCell align="center">{Number(savedLastRow.Tax1 || 0).toFixed(2)}</TableCell>
      {/* <TableCell align="center">
        {Number(savedLastRow.NetTotal || savedLastRow.PropertyTax || 0).toFixed(2)}
      </TableCell> */}
      <TableCell align="center">
  {calculateTotal(savedLastRow).toFixed(2)}
</TableCell>

    </TableRow>
  )}
{/* NET TAX ROW */}
{!showOnlySavedRow && (
<>
<TableRow hover>
  {Object.values(netTaxes).map((value, index) => (
    <TableCell key={index} align="center">
      {Number(value).toFixed(2)}
    </TableCell>
  ))}
</TableRow>

{/* RETAIN ROW */}
<TableRow hover>
  {netTaxes.Total < oldDetails.OldTotalTax ? (
    <TableCell colSpan={17} sx={{ textAlign: 'center', color: 'blue' }}>
      Applicable : As per Old
    </TableCell>
  ) : retainOwnerID === '' ? (
    <TableCell colSpan={17} sx={{ textAlign: 'center', color: 'blue' }}>
      Applicable for : does not set policies
    </TableCell>
  ) : (
    Object.values(retainTaxes).map((value, index) => (
      <TableCell key={index} align="center">
        {Number(value).toFixed(2)}
      </TableCell>
    ))
  )}
</TableRow>

{/* HEARING ROW */}
<TableRow hover>
  {Object.values(hearingTaxes).map((value, index) => (
    <TableCell key={index} align="center">
      {Number(value).toFixed(2)}
    </TableCell>
  ))}
</TableRow>

{/* APPEAL ROW */}
<TableRow hover>
  {Object.values(appealTaxes).map((value, index) => (
    <TableCell key={index} align="center">
      {Number(value).toFixed(2)}
    </TableCell>
  ))}
</TableRow>
{/* court ROW */}
<TableRow hover>
  {Object.values(remissionTaxes).map((value, index) => (
    <TableCell key={index} align="center">
      {Number(value).toFixed(2)}
    </TableCell>
  ))}
</TableRow>

</>)}
</TableBody>



                      </Table>
                    </Box>
                 
            </Grid>
            <MainCard>
            <Typography sx={{ color: 'red' }}>
  Apply policy (Save last row transaction from below)
</Typography>
<Grid
    container
    alignItems="center"
    justifyContent="space-between"
    sx={{ mt: 2 }}
  >
    {/* LEFT : Title */}
   
    <Grid item sx={{ width: { xs: '100%', sm: 360 } }}>
  <Stack direction="row" alignItems="center" spacing={1}>
    
    {/* LABEL */}
    <InputLabel
      sx={{
        fontWeight: 600,
        whiteSpace: 'normal',   // ✅ nowrap काढा
        minWidth: 160,          // ✅ label साठी पुरेशी width
        lineHeight: 1.2,
        textAlign: 'left'
      }}
    >Policy :
    </InputLabel>

    {/* DROPDOWN */}
    <Select
      size="small"
      fullWidth
      displayEmpty
      value={policy}
      onChange={(e) => dispatch(setPolicy(e.target.value))}
    >
     <MenuItem value={"As Per Old"}>As Per Old</MenuItem>
                <MenuItem value={"Minimum RV"}>Minimum RV</MenuItem>
                <MenuItem value={"Mix Assessment"}>Mix Assessment</MenuItem>
              
    </Select>

  </Stack>
</Grid>

<Grid item sx={{ width: { xs: '100%', sm: 300 } }}>
  <Stack direction="row" alignItems="center" spacing={1}>
    
    {/* LABEL */}
    <InputLabel
      sx={{
        fontWeight: 600,
        whiteSpace: 'nowrap',
        minWidth: 90,
      }}
    >Action :
    </InputLabel>

    {/* DROPDOWN */}
    <Select
      size="small"
      fullWidth
      displayEmpty
      value={action}
      onChange={(e) => dispatch(setAction(e.target.value))}
    >
       <MenuItem value={1}>Apply</MenuItem>
                  <MenuItem value={2}>Remove Retention</MenuItem>
                  <MenuItem value={6}>Remove Hearing</MenuItem>
                  <MenuItem value={3}>Remove Appeal Committee</MenuItem>
                  <MenuItem value={4}>Remove Remission</MenuItem>
                  <MenuItem value={5}>Remove All Appeals</MenuItem>
    </Select>

  </Stack>
</Grid>
<Grid item sx={{ width: { xs: '100%', sm: 420 } }}>
  <Button
    variant="contained"
    sx={{
      backgroundColor: 'green',
      '&:hover': {
        backgroundColor: 'darkgreen',
      },
    }}
    onClick={openApplyTaxDialogHandler}  >
    Apply Taxes
  </Button>
</Grid>


  </Grid>
  <Dialog open={openApplyTaxDialog}   onClose={() => setOpenApplyTaxDialog(false)}
 maxWidth="xl">
<Grid container>
  <Grid item xs={12} md={6} lg={6}>
    <DialogTitle>Apply Taxes</DialogTitle>
  </Grid>
  <Grid item xs={12} md={6} lg={6}>
    <DialogActions style={{ justifyContent: 'flex-end' }}>
      {/* <IconButton onClick={handleOldInformation} color="error">
        <CloseOutlined />
      </IconButton> */}
    </DialogActions>
  </Grid>
</Grid>
<DialogContent>
  <MainCard sx={{ background: '#e3f2fd' }}>
    <MainCard title="Apply Taxes">
      <Grid container spacing={0.2} mt={1} justifyContent="center">
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Property</InputLabel>
            <TextField required fullWidth
              inputProps={{ min: 0, max: 1 }}
              value={appliedTaxes.PropertyTax}
  onChange={handleTaxChange('PropertyTax')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Education</InputLabel>
            <TextField required fullWidth      
                     inputProps={{ min: 0, max: 1 }}
 value={appliedTaxes.EducationTax}
  onChange={handleTaxChange('EducationTax')}/>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tree</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }}
  value={appliedTaxes.TreeCess}
  onChange={handleTaxChange('TreeCess')}/>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Employment</InputLabel>
            <TextField required fullWidth  inputProps={{ min: 0, max: 1 }} value={appliedTaxes.EmploymentTax}
  onChange={handleTaxChange('EmploymentTax')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sp.Edu</InputLabel>
            <TextField required fullWidth  inputProps={{ min: 0, max: 1 }}  value={appliedTaxes.SpEducationTax}
  onChange={handleTaxChange('SpEducationTax')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Fire</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }} value={appliedTaxes.FireCess}
  onChange={handleTaxChange('FireCess')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Road</InputLabel>
            <TextField required fullWidth  value={appliedTaxes.RoadCess}
  onChange={handleTaxChange('RoadCess')}  />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Light</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }} value={appliedTaxes.LightCess}
  onChange={handleTaxChange('LightCess')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sewage</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }} value={appliedTaxes.SewageCess}
  onChange={handleTaxChange('SewageCess')}/>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Saniation</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }}  value={appliedTaxes.SanitationCess}
  onChange={handleTaxChange('SanitationCess')}/>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Drain</InputLabel>
            <TextField required fullWidth  value={appliedTaxes.DrainCess}
  onChange={handleTaxChange('DrainCess')}  />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sp.W.Cess</InputLabel>
            <TextField required fullWidth   inputProps={{ min: 0, max: 1 }} value={appliedTaxes.SpWaterCess}
  onChange={handleTaxChange('SpWaterCess')} />
          </Stack>
        </Grid>
      </Grid>
      <Grid container spacing={0.2} mt={1} justifyContent="center">
        {/* <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Cess</InputLabel>
            <TextField required fullWidth value={applyTaxes?.WaterBenefit}/>
          </Stack>
        </Grid> */}
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Benfits</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }} value={appliedTaxes.WaterBenefits}
  onChange={handleTaxChange('WaterBenefits')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>M.Build</InputLabel>
            <TextField required fullWidth   value={appliedTaxes.MajorBuilding}
  onChange={handleTaxChange('MajorBuilding')}  />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Bill</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }} value={appliedTaxes.WaterBill}
  onChange={handleTaxChange('WaterBill')}  />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax1</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }}  value={appliedTaxes.Tax1}
  onChange={handleTaxChange('Tax1')}/>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax2</InputLabel>
            <TextField required fullWidth  inputProps={{ min: 0, max: 1 }} value={appliedTaxes.Tax2}
  onChange={handleTaxChange('Tax2')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax3</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }} value={appliedTaxes.Tax3}
  onChange={handleTaxChange('Tax3')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax4</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }} value={appliedTaxes.Tax4}
  onChange={handleTaxChange('Tax4')}  />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax5</InputLabel>
            <TextField required inputProps={{ min: 0, max: 1 }}  value={appliedTaxes.Tax5}
  onChange={handleTaxChange('Tax5')}  />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Is Tax For Plot</InputLabel>
            <TextField required fullWidth  value={appliedTaxes.EducaIsTaxForPlottionTax}
  onChange={handleTaxChange('IsTaxForPlot')} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1.3}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Is Policy Applicable</InputLabel>
            <TextField required fullWidth inputProps={{ min: 0, max: 1 }}  value={appliedTaxes.IsPolicyApplicable}
  onChange={handleTaxChange('IsPolicyApplicable')}/>
          </Stack>
        </Grid>
        <Grid item>
          <Stack spacing={1} mt={3.8}>
          <Button
  variant="contained"
  color="success"
  sx={{ padding: '7px' }}
  onClick={handleSaveTaxes}
  disabled={savingTaxes}   // disable while loading
>
  {savingTaxes ? <CircularProgress size={24} color="inherit" /> : "Save"}
</Button>
          </Stack>
        </Grid>
        <Grid item>
          <Stack spacing={1} mt={3.8}>
          <Button
  variant="contained"
  color="success"
  sx={{ padding: '7px' }}
  onClick={closeApplyTaxDialogHandler}
   // disable while loading
>Cancel
</Button>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  
  </MainCard>
</DialogContent>
</Dialog>
  <Grid
    container
    alignItems="center"
    justifyContent="space-between"
    sx={{ mt: 2 }}
  >
    {/* LEFT : Title */}
   
    <Grid item sx={{ width: { xs: '100%', sm: 360 } }}>
  <Stack direction="row" alignItems="center" spacing={1}>

    <InputLabel
      sx={{
        fontWeight: 600,
        whiteSpace: 'normal',   
        minWidth: 160,          
        lineHeight: 1.2,
        textAlign: 'left'
      }}
    >
      Select Finance Year :
    </InputLabel>

    <Select
      size="small"
      fullWidth
      displayEmpty
      value={financeYear}
      onChange={(e) => dispatch(setFinanceYear(e.target.value))}
    >
     <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    {yearOptions.map((financeYear) => (
                      <MenuItem key={financeYear.FinanceYearRange} value={financeYear.FinanceYearRange}>
                        {financeYear.FinanceYearRange}
                      </MenuItem>
                    ))}
    </Select>

  </Stack>
</Grid>


<Grid item sx={{ width: { xs: '100%', sm: 200 } }}>
<Button
  variant="contained"
  sx={{
    backgroundColor: 'blue',
    '&:hover': { backgroundColor: 'darkblue' }
  }}
  disabled={savingLastRow}
  onClick={handleSaveToLastRow }
>
  {savingLastRow ? <CircularProgress size={20} color="inherit" /> : "Save Last Row"}
</Button>

</Grid>
{/* <Grid item sx={{ width: { xs: '100%', sm: 200 } }}>
  <Button
    variant="contained"
    sx={{
      backgroundColor: 'red',
      '&:hover': {
        backgroundColor: 'darkred',
      },
    }}
  >
Refresh Taxes </Button>
</Grid> */}
<Grid item sx={{ width: { xs: '100%', sm: 200 } }}>
  <FormControlLabel
  control={
    <Checkbox
      checked={withInterest}
      onChange={(e) => setWithInterest(e.target.checked)}
      color="error"        // 🔴 RED checkbox
    />  
    }
      label="With Interest"
    />

</Grid>
<Grid item sx={{ width: { xs: '100%', sm: 220 } }}>
  <Button
    variant="contained"
    sx={{
      backgroundColor: 'orange',
      '&:hover': {
        backgroundColor: 'darkorange',
      },
    }}
    onClick={handleAddTaxWithoutApproval}
    disabled={loading}
    color="error"

  >
  {loading ? 'Processing...' : 'Add Tax (Without Approval)'}
</Button>
</Grid>
{/* //upload table */}
<Grid
    container
    alignItems="center"
    justifyContent="center"
    sx={{ mt: 2 }}
  >
 <Box
    sx={{
      width: '80%',          
      maxWidth: 1000,        
      height: 300,
    //   overflowY: 'auto',
      border: '1px solid #ccc'
    }}
  >
  <TableContainer component={Paper} sx={{ maxHeight: 300 }}> {/* <-- fixed height */}
  <Table size="small" stickyHeader>
    <TableHead>
      <TableRow sx={{ backgroundColor: '#64a8f5' }}>
        <TableCell>No</TableCell>
        <TableCell>Document Name</TableCell>
        <TableCell>Upload Status</TableCell>
        <TableCell>Delete</TableCell>
        <TableCell>Upload</TableCell>
        <TableCell>Download</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {documents.map((doc, index) => (
        <TableRow key={doc.id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{doc.name}</TableCell>
          <TableCell>{doc.file ? 'Yes' : 'No'}</TableCell>

          {/* DELETE */}
          <TableCell>
            {doc.file && (
              <Button
                color="error"
                size="small"
                onClick={() => handleDelete(doc.id)}
              >
                ❌
              </Button>
            )}
          </TableCell>

          {/* UPLOAD */}
          <TableCell>
            <input
              type="file"
              id={`file-${doc.id}`}
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() => document.getElementById(`file-${doc.id}`).click()}
            >
              📄
            </Button>
          </TableCell>

          {/* DOWNLOAD */}
          <TableCell>
            {doc.file && (
              <Button
                size="small"
                onClick={() => handleDownload(doc)}
              >
                ⬇️
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
</Box>
</Grid>

  </Grid>
  
            </MainCard>
            {/* <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>

<Grid item >
                  <Button variant="contained" color="success" onClick={handleSaveLastRow}   
 >
                    Save
                  </Button>
                </Grid>

                <Grid item >
                  <Button variant="contained" color="primary"
                    onClick={handlePrint}  
                     disabled={!canPrint } 
>
                    Print
                  </Button>
                </Grid>

                <Grid item >
                  <Button variant="contained" color="warning" 

                  disabled={!isDataEntryDocsUploaded }
                  onClick={() => {
                    console.log("🟡 SEND TO APPROVAL CLICKED");
                    handleSendToApproval();
                  }}                  >
                    Send to approval
                  </Button>
                </Grid>
                </Grid> */}
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
      </>
    </MainCard>
  );
};

export default DataEntryApprovalAssessment;
