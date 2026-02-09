// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
  Checkbox,
  CardContent,
  Card,
  FormGroup,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router';

// project import
import MainCard from 'components/MainCard';
import { CurrentTaxes, FetchImage, SaveApprovalStatusForDEA, SaveDISApprovalStatusForDEA, ShowDocumentsByOwnerIDForDEA, getOldPropertyMastDataHistory, getOwnerDetailsDataHistory, getPropertyMastDataHistory, getSocialDataHistory, getTaxPendingDataHistory } from 'services/transaction/dataentryApprovalService/dataEntryApprovalService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { saveOwnerTaxChange } from 'services/assessmentService/DataEntryService/dataEntryService';

// ==============================|| SAMPLE PAGE ||============================== //

function PendingDataEntry({ PendingButton,selectedOwnerID,selectedVersionID}) {
  //navigate
  // const navigate = useNavigate();
  // const handleButtonClick = () => {
  //   navigate('/transaction/data-entry-approval');
  // };

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  //changes img hover
  const [hoveredItems, setHoveredItems] = useState(null);

  const handleMouseEnters = (indexs) => {
    setHoveredItems(indexs);
  };

  const handleMouseLeaves = () => {
    setHoveredItems(null);
  };
  const handleDownloadPDF = () => {
    const pdfURL = 'path/to/your/pdf.pdf';
    const anchor = document.createElement('a');
    anchor.href = pdfURL;
    anchor.download = 'C:UsersDELLDownloadsफेरफार_कागदपत्र.pdf';
    anchor.click();
  };

  //show img
  const [isOpen, setIsOpen] = useState(false);

  function toggle(e) {
    setIsOpen((isOpen) => !isOpen);
    e.preventDefault();
  }

//backend
  //navigate
  const navigate = useNavigate();
  const userData = useSelector((state) => state.newUserDetails.initialUserData);
//property mast
  useEffect(() => {
    console.log(userData, 'logged in user');
  }, [userData]);
const [historyData, setHistoryData] = useState({ before: {}, after: {} });
const [ownerHistory, setOwnerHistory] = useState({ before: [], after: [] });

//userdata
useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("🔵 SelectedOwnerID:", selectedOwnerID);

      const payload = { OwnerID: selectedOwnerID ,versionId:selectedVersionID};
      console.log("🟡 Payload Sent:", payload);

      const response = await getPropertyMastDataHistory(payload);
      console.log("🟢 API Response:", response);

      if (response?.success) {
        console.log("🟣 Before Data:", response.data?.before);
        console.log("🟣 After Data:", response.data?.after);

        setHistoryData({
          before: response.data?.before?.[0] || {},
          after: response.data?.after?.[0] || {}
        });
      } else {
        console.warn("⚠️ API returned success=false:", response);
      }
    } catch (error) {
      console.error("❌ Error fetching history:", error);
    }
  };

  if (selectedOwnerID) {
    fetchData();
  } else {
    console.warn("⚠️ selectedOwnerID is empty, API not called");
  }
}, [selectedOwnerID,selectedVersionID]);

  // Helper function to handle null/undefined values
  const getValue = (val) => (val !== null && val !== undefined ? val : '');
//owner details
useEffect(() => {
  const fetchOwnerDetails = async () => {
    try {
      if (selectedOwnerID) {
        const payload = { OwnerID: selectedOwnerID ,versionId:selectedVersionID};
        const response = await getOwnerDetailsDataHistory(payload);
        
        if (response?.success) {
          setOwnerHistory({
            before: response.data?.before || [],
            after: response.data?.after || []
          });
        }
      }
    } catch (error) {
      console.error("Error fetching owner details:", error);
    }
  };

  fetchOwnerDetails();
}, [selectedOwnerID,selectedVersionID]);
//old 
const [oldHistory, setOldHistory] = useState({
  before: [],
  after: []
});

const getBeforeOld = () => oldHistory.before?.[0] || {};
const getAfterOld = () => oldHistory.after?.[0] || {};

useEffect(() => {
  const fetchOldPropertyHistory = async () => {
    try {
      if (!selectedOwnerID) return;

      const payload = { OwnerID: selectedOwnerID ,versionId:selectedVersionID};
      const res = await getOldPropertyMastDataHistory(payload);

      if (res?.success) {
        setOldHistory({
          before: res.data?.before || [],
          after: res.data?.after || []
        });
      }
    } catch (err) {
      console.error("Old Property History Error:", err);
    }
  };

  fetchOldPropertyHistory();
}, [selectedOwnerID,selectedVersionID]);
//pending taxes
const [taxHistory, setTaxHistory] = useState({
  before: [],
  after: []
});
useEffect(() => {
  const fetchPendingTaxHistory = async () => {
    try {
      if (!selectedOwnerID) return;

      const payload = { OwnerID: selectedOwnerID ,versionId:selectedVersionID};
      const res = await getTaxPendingDataHistory(payload);

      if (res?.success) {
        setTaxHistory({
          before: res.data?.before || [],
          after: res.data?.after || []
        });
      }
    } catch (err) {
      console.error("Pending tax history error:", err);
    }
  };

  fetchPendingTaxHistory();
}, [selectedOwnerID,selectedVersionID]);
const getBeforeTax = () => taxHistory.before?.[0] || {};
const getAfterTax = () => taxHistory.after?.[0] || {};
const DiffCell = ({ field }) => (
  <TableCell
    sx={{
      backgroundColor:
        getBeforeTax()[field] !== getAfterTax()[field]
          ? "#ff8a80"
          : "transparent"
    }}
  >
    {getValue(getAfterTax()[field])}
  </TableCell>
);
//currnet taxes
const [transHistory, setTransHistory] = useState({
  before: [],
  after: []
});
useEffect(() => {
  const fetchTransTaxHistory = async () => {
    try {
      if (!selectedOwnerID) return;

      const currentMonth = new Date().getMonth(); // 0-11
      const currentYear = new Date().getFullYear();
      const dynamicYear = currentMonth >= 3 ? (currentYear + 1).toString() : currentYear.toString();

      const payload = { 
        OwnerID: selectedOwnerID,
        Year: dynamicYear, 
        CreatedBy: 4 ,
        versionId:selectedVersionID

      };

      const res = await saveOwnerTaxChange(payload);

      if (res?.success) {
        setTransHistory({
          before: res.data?.before ? [res.data.before] : [],
          after: res.data?.after ? [res.data.after] : []
        });
      }
    } catch (err) {
      console.error("trans tax history error:", err);
    }
  };

  fetchTransTaxHistory();
}, [selectedOwnerID,selectedVersionID]);
const getBeforeTrans = () => transHistory.before?.[0] || {};
const getAfterTans = () => transHistory.after?.[0] || {};
const DiffCellTrans = ({ field }) => (
  <TableCell
    sx={{
      backgroundColor:
        getBeforeTax()[field] !== getAfterTans()[field]
          ? "#ff8a80"
          : "transparent"
    }}
  >
    {getValue(getAfterTans()[field])}
  </TableCell>
);
//social
const [socialHistory, setSocialHistory] = useState({ before: [], after: [] });

useEffect(() => {
  const fetchSocialHistory = async () => {
    try {
      if (selectedOwnerID) {
        const res = await getSocialDataHistory({ OwnerID: selectedOwnerID, versionId:selectedVersionID
        });
        if (res.success) {
          setSocialHistory({
            before: res.data.before || [],
            after: res.data.after || []
          });
        }
      }
    } catch (err) {
      console.error("Social history fetch error:", err);
    }
  };
  fetchSocialHistory();
}, [selectedOwnerID,selectedVersionID]);
const getBeforeSocial = () => socialHistory.before?.[0] || {};
const getAfterSocial = () => socialHistory.after?.[0] || {};
const DiffCellSocial = ({ field }) => (
  <TableCell
    sx={{
      backgroundColor:
        getBeforeTax()[field] !== getAfterSocial()[field]
          ? "#ff8a80"
          : "transparent"
    }}
  >
    {getValue(getAfterSocial()[field])}
  </TableCell>
);
//chekcbox
const SocialCheckboxField = ({ field, label, isAfter = false }) => {
  const beforeVal = !!getBeforeSocial()[field]; 
  const afterVal = !!getAfterSocial()[field];
  const isChanged = beforeVal !== afterVal;

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        p: 0.5,
        borderRadius: 1,
        backgroundColor: isAfter && isChanged ? "#ff8a80" : "transparent",
      }}
    >
      <Checkbox 
        checked={isAfter ? afterVal : beforeVal} 
        disabled 
        size="small" 
      />
      <Box sx={{ fontWeight: 'bold' }}>
        {label}
      </Box>
    </Box>
  );
};
//images
const DOCUMENT_MASTER = {
  1: 'स्थळपाहणी अहवाल',
  2: 'पावती पुस्तक',
  3: 'नोटशीट',
  4: 'अर्ज',
  5: 'सूचना पत्रक',
  6: 'जुनी टॅक्स पावती',
  7: 'जुने डिमांड बिल',
  8: 'रजिस्ट्री',
  9: 'दुरुस्ती पत्रक',
  10: 'वाढघट कागदपत्र',
};

const getDocNameFromFile = (fileName) => {
  const docId = Number(fileName.split("__")[0]);
  return DOCUMENT_MASTER[docId] || "Unknown Document";
};


const extractDocuments = (documents = []) => {
  if (!documents.length || !documents[0]) return [];

  return documents[0]
    .split(",")
    .map(fileName => {
      const [docId] = fileName.split("__"); // extract ID

      return {
        docId: Number(docId),
        docName: DOCUMENT_MASTER[docId] || "Unknown Document",
        fileName,
        fileUrl: `/uploadDataEntryApproval/wadhghat-dataEntryApproval/${fileName}`

      };
    });
};

// const BASE_URL = "http://localhost:4000"; 
const BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:4000/Tax_Assessment_NTIS_Backend" 
  : "http://newntis.coreproject.in/Tax_Assessment_NTIS_Backend";
  
  const handleViewDocument = (fileUrl) => {

    console.log("fileUrl",fileUrl);

  if (!fileUrl) {
    console.error("❌ File URL missing");
    return;
  }

  const finalUrl = fileUrl.startsWith("http")
    ? fileUrl
    : `${BASE_URL}${fileUrl}`;

  console.log("📄 Opening document:", finalUrl);

  window.open(finalUrl, "_blank", "noopener,noreferrer");
};
const [docs, setDocs] = useState([]);

useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const res = await ShowDocumentsByOwnerIDForDEA(selectedOwnerID,selectedVersionID);
      console.log("📄 API Docs:", res);

      const records = res?.documents;

      if (Array.isArray(records)) {
        console.log("✅ Recordssss:", records);
        setDocs(records);
      } else {
        setDocs([]);
      }
    } catch (err) {
      console.error("❌ Fetch failed", err);
      setDocs([]);
    }
  };

  if (selectedOwnerID,selectedVersionID) fetchDocuments();
}, [selectedOwnerID,selectedVersionID]);
//approval button
const [remark, setRemark] = useState('');
const [snackbar, setSnackbar] = useState({
  open: false,
  message: '',
  severity: 'success', // success | error | warning | info
});
const handleButtonClickApproval = async () => {
  try {
    const payload = {
      OwnerID: selectedOwnerID,
      user: userData,
      remark,
      selectedVersionID,
    };

    const result = await SaveApprovalStatusForDEA(payload);

    console.log("Approval response:", result);

    // ✅ backend success check
    if (result?.success) {
      setSnackbar({
        open: true,
        message: result.message || 'Request approved successfully!',
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: result?.message || 'Approval failed',
        severity: 'error',
      });
    }

  } catch (error) {
    console.error("Error approving request:", error);

    setSnackbar({
      open: true,
      message:
        error?.response?.data?.message ||
        error.message ||
        'Failed to approve request',
      severity: 'error',
    });
  }
};

//disapproval
const handleButtonClickDisApproval = async () => {
  try {
    const payload = {
      OwnerID: selectedOwnerID,
      user: userData,
      remark,
      selectedVersionID
    };

    const result = await SaveDISApprovalStatusForDEA(payload);

    console.log("disApproval response:", result);

    // ✅ Snackbar success
    setSnackbar({
      open: true,
      message: 'Request disapproved successfully!',
      severity: 'success'
    });

  } catch (error) {
    console.error("Error disapproving request:", error);

    // ❌ Snackbar failure
    setSnackbar({
      open: true,
      message: 'Failed to disapprove request.',
      severity: 'error'
    });
  }
};

//current tax
const [CurrenttaxHistory, setCurrentTaxHistory] = useState({
  before: null,
  after: null
});
useEffect(() => {
  const fetchTaxData = async () => {
    try {
      if (!selectedOwnerID || !selectedVersionID) return;

      const payload = { 
        OwnerID: selectedOwnerID, 
        versionId: selectedVersionID 
      };
      
      const res = await CurrentTaxes(payload);

      if (res?.success) {
        setCurrentTaxHistory({
          before: res.data?.before,
          after: res.data?.after
        });
      }
    } catch (err) {
      console.error("Tax History Fetch Error:", err);
    }
  };

  fetchTaxData();
}, [selectedOwnerID, selectedVersionID]);
//image
// DataEntry.jsx mein 
const [propertyImages, setPropertyImages] = useState(null);
const oldPhotos = [
  propertyImages?.PropertyPathA,
  propertyImages?.PropertyPathB,
  propertyImages?.PropertyPathC,
  propertyImages?.PropertyPathD,
  propertyImages?.PlanPath 
];
const loadImages = async (ownerId) => {
  try {
    const response = await FetchImage({ ownerid: ownerId }); 
    if (response.success) {
      setPropertyImages(response.data);
    }
  } catch (error) {
    console.error("Images loading error :", error);
  }
};

useEffect(() => {
  if (selectedOwnerID) {
    loadImages(selectedOwnerID);
  }
}, [selectedOwnerID]);



return (
    <>
      <MainCard title="PendingDataEntry">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'blue', fontWeight: 'bold', marginRight: 'auto', marginBottom: '2vw' }}>
            प्राथमिक कर धारकाची माहिती
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: 'red', fontWeight: 'bold', marginLeft: 'auto', marginBottom: '2vw' }}>
            Show Info
          </Typography>
        </Box>
        <Grid container spacing={2.5} mb={'1vw'}>
          <Grid item xs={12} md={10} lg={3}>
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
              <Grid item xs={6} sm={3}>
                <Stack spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>वार्ड क्र. </InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={5.3} mb={1}>
                <Stack spacing={1}>
                <TextField fullWidth 
value={getValue(historyData.before?.NewWardNo)}
/>                            </Stack>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10} lg={4}>
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
              <Grid item xs={6} sm={3}>
                <Stack spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता क्र.</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={6.3} mb={1}>
                <Stack spacing={1}>
                <TextField fullWidth 
value={getValue(historyData.before?.NewPropertyNo)}
/>                                 </Stack>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10} lg={5}>
            <Grid
              container
              spacing={0}
              justifyContent="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <Grid item xs={6} sm={4.5}>
                <Stack spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>प्राथमिक कर धारकाचे नाव </InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={6.2} mb={1}>
                <Stack spacing={0}>
                <TextField fullWidth 
value={getValue(historyData.before?.OwnerNameMarathi)}
/>                             </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* 2nd heading*/}
        <Grid container spacing={1.5} mb={'1vw'} justifyContent="center">
          <Grid item xs={12} md={10} lg={4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '4px',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' // Adding box shadow
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: 'blue', fontWeight: 'bold', textAlign: 'center', margin: 'auto', marginBottom: '1vw' }}
              >
                New Property Created: (PENDING)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 3rd accord */}
        <Grid container spacing={1.5} mb={2.9}>
          <Grid item xs={12} md={10} lg={6}>
            <Typography
              variant="h5"
              style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#8c9eff', padding: '0.6vw' }}
            >
              Old Data
            </Typography>
            <Box>
              <Accordion>
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ fontWeight: 'bolder' }}
                >
                  Property Details
                </AccordionSummary>
                <AccordionDetails sx={{ flexDirection: 'column' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Zone No.</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.NewZoneNo)}
/>                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Open Plot</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.OpenPlot)}
 />                                    </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Property Description</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.PropertyTypeID)}
 />                                            </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>CSN</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.NewCityServeyNo)}
 />                                           
  </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel> Plot No</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.NewPlotNo)}
 />                                            </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Plot Area SqFt</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.PlotArea)}
 />                                            </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Plot Area SqMtr</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.PlotAreaSqMtr)}
 />                                             </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>BuiltUpArea</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'172.8'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>CarpetArea</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>R.Toilet</InputLabel>
                        <TextField fullWidth 
value={getValue(getBeforeSocial().ToiletSeatCountResidential)}
 />                                           </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>C.Toilet</InputLabel>
                        <TextField fullWidth 
                        value={getValue(getBeforeSocial().ToiletSeatCountNonResidential)}

 />                                           </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel></InputLabel>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Category</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.Category)}
 />                                            </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Part Type</InputLabel>
                        <TextField fullWidth 
value={getValue(historyData.before?.Type)}
 />                                            </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}></Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>

          {/* 3rd 2nd */}
          <Grid item xs={12} md={10} lg={6}>
            <Typography
              variant="h5"
              style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#82b1ff', padding: '0.6vw' }}
            >
              New Changed Data
            </Typography>
            <Box>
              <Accordion>
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ fontWeight: 'bolder' }}
                >
                  Property Details
                </AccordionSummary>
                <AccordionDetails sx={{ flexDirection: 'column' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Zone No.</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.NewZoneNo)}
      sx={{ 
        backgroundColor: historyData.before?.NewZoneNo !== historyData.after?.NewZoneNo ? '#ff8a80' : 'transparent' 
      }}
    />                  </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Open Plot</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.OpenPlot)}
      sx={{ 
        backgroundColor: historyData.before?.OpenPlot !== historyData.after?.OpenPlot ? '#ff8a80' : 'transparent' 
      }}
    />                                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Property Description</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.PropertyTypeID)}
      sx={{ 
        backgroundColor: historyData.before?.PropertyTypeID !== historyData.after?.PropertyTypeID ? '#ff8a80' : 'transparent' 
      }}
    />                                  </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>CSN</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.NewCityServeyNo)}
      sx={{ 
        backgroundColor: historyData.before?.NewCityServeyNo !== historyData.after?.NewCityServeyNo ? '#ff8a80' : 'transparent' 
      }}
    />                                     </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel> Plot No</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.NewPlotNo)}
      sx={{ 
        backgroundColor: historyData.before?.NewPlotNo !== historyData.after?.NewPlotNo ? '#ff8a80' : 'transparent' 
      }}
    />                              </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Plot Area SqFt</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.PlotArea)}
      sx={{ 
        backgroundColor: historyData.before?.PlotArea !== historyData.after?.PlotArea ? '#ff8a80' : 'transparent' 
      }}
    />                              </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Plot Area SqMtr</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.PlotAreaSqMtr)}
      sx={{ 
        backgroundColor: historyData.before?.PlotAreaSqMtr !== historyData.after?.PlotAreaSqMtr ? '#ff8a80' : 'transparent' 
      }}
    />                                       </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>BuiltUpArea</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'172.8'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>CarpetArea</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>R.Toilet</InputLabel>
                        <TextField 
  fullWidth 
  size="small"
  value={getAfterSocial().ToiletSeatCountResidential || 0}
  sx={{ 
    backgroundColor: 
      getBeforeSocial().ToiletSeatCountResidential !== getAfterSocial().ToiletSeatCountResidential 
      ? '#ff8a80' 
      : 'transparent' 
  }}
/>                          </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>C.Toilet</InputLabel>
     
        <TextField 
  fullWidth 
  size="small"
  value={getAfterSocial().ToiletSeatCountNonResidential || 0}
  sx={{ 
    backgroundColor: 
      getBeforeSocial().ToiletSeatCountNonResidential !== getAfterSocial().ToiletSeatCountNonResidential 
      ? '#ff8a80' 
      : 'transparent' 
  }}
/>                                                     </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel></InputLabel>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Category</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.Category)}
      sx={{ 
        backgroundColor: historyData.before?.Category !== historyData.after?.Category ? '#ff8a80' : 'transparent' 
      }}
    />                               </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Part Type</InputLabel>
                        <TextField 
      fullWidth 
      value={getValue(historyData.after?.Type)}
      sx={{ 
        backgroundColor: historyData.before?.Type !== historyData.after?.Type ? '#ff8a80' : 'transparent' 
      }}
    />                               </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}></Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
        </Grid>

        <Box mb={1.9}>
          <hr></hr>
        </Box>
        {/* 1st table - BEFORE DATA */}
        <MainCard>
  <Grid container spacing={2} mb={1}>
    {/* 1st table - BEFORE DATA */}
    <Grid item xs={12} lg={6}>
      <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '10px' }}>
        Owner details (Before)
      </Typography>
      <TableContainer sx={{ maxHeight: 450, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1200 }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>isPrime</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title(Marathi)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name(Marathi)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Occupier(Marathi)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address(Marathi)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shop/Build.Name(M)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shop/Flat.No(M)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Occupier Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shop/Build.Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shop/Flat.No</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ownerHistory?.before?.length > 0 ? (
              ownerHistory.before.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell align="center">
                    <Checkbox checked={row?.isPrime === 1 || row?.IsPrime === 1} disabled />
                  </TableCell>
                  <TableCell>{row?.OwnerTitleMarathi || '-'}</TableCell>
                  <TableCell>{row?.OwnerNameMarathi || '-'}</TableCell>
                  <TableCell>{row?.OccupierNameMarathi || '-'}</TableCell>
                  <TableCell>{row?.OwnerPatta || '-'}</TableCell>
                  <TableCell>{row?.BuildingOrShopNameMarathi || '-'}</TableCell>
                  <TableCell>{row?.BuildingOrFlatNoMarathi || '-'}</TableCell>
                  <TableCell>{row?.OwnerTitle || '-'}</TableCell>
                  <TableCell>{row?.OwnerName || '-'}</TableCell>
                  <TableCell>{row?.OccupierName || '-'}</TableCell>
                  <TableCell>{row?.Address || '-'}</TableCell>
                  <TableCell>{row?.BuildingOrShopName || '-'}</TableCell>
                  <TableCell>{row?.BuildingOrFlatNo || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} align="center">No History Records Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>

    {/* 2nd table - AFTER DATA (Yellow Background) */}
    <Grid item xs={12} lg={6}>
      <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '10px' }}>
        Owner details (After)
      </Typography>
      <TableContainer sx={{ maxHeight: 450, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1200 }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>isPrime</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title(Marathi)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name(Marathi)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Occupier(Marathi)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address(Marathi)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shop/Build.Name(M)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shop/Flat.No(M)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Occupier Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shop/Build.Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shop/Flat.No</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ownerHistory?.after?.length > 0 ? (
              ownerHistory.after.map((row, index) => (
                <TableRow key={index} sx={{ backgroundColor: '#fff9c4' }} hover> {/* Soft Yellow */}
                  <TableCell align="center">
                    <Checkbox checked={row?.isPrime === 1 || row?.IsPrime === 1} disabled />
                  </TableCell>
                  <TableCell>{row?.OwnerTitleMarathi || '-'}</TableCell>
                  <TableCell>{row?.OwnerNameMarathi || '-'}</TableCell>
                  <TableCell>{row?.OccupierNameMarathi || '-'}</TableCell>
                  <TableCell>{row?.OwnerPatta || '-'}</TableCell>
                  <TableCell>{row?.BuildingOrShopNameMarathi || '-'}</TableCell>
                  <TableCell>{row?.BuildingOrFlatNoMarathi || '-'}</TableCell>
                  <TableCell>{row?.OwnerTitle || '-'}</TableCell>
                  <TableCell>{row?.OwnerName || '-'}</TableCell>
                  <TableCell>{row?.OccupierName || '-'}</TableCell>
                  <TableCell>{row?.Address || '-'}</TableCell>
                  <TableCell>{row?.BuildingOrShopName || '-'}</TableCell>
                  <TableCell>{row?.BuildingOrFlatNo || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} align="center">No Updated Records Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  </Grid>
</MainCard>

        {/* 4th renter Deatils */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                mb={1}
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}
              >
                Renter Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Plot Area Type</InputLabel>
                    <TextField fullWidth 
value={getValue(historyData.before?.OpenPlotType)}
 />                                    </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>खुल्या भूखंडाच्या भो. नाव </InputLabel>
                    <TextField fullWidth 
value={getValue(historyData.before?.OpenPlotRenterName)}
 />                                     </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Wadh Ghat Remark</InputLabel>
                    <TextField fullWidth 
value={getValue(historyData.before?.WadhGhatRemarkOne)}
 />                                    </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                
              
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Plot Taxable Area(SqFt)</InputLabel>
                    <TextField fullWidth 
value={getValue(historyData.before?.PlotTaxableAreaSqFt)}
 />                                    </Stack>
                </Grid>
                <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>WadhGhatDocument</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Occupier Name (OP) </InputLabel>
                    <TextField fullWidth 
value={getValue(historyData.before?.OpenPlotOccupierName)}
 />                                    </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
               
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>भोगवाटदाराचे नाव(OP)</InputLabel>
                    <TextField fullWidth 
value={getValue(historyData.before?.OpenPlotOccupierMarathiName)}
 />                                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for 4nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                mb={1}
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Plot Area Type</InputLabel>
                    <TextField 
      fullWidth 
      value={getValue(historyData.after?.OpenPlotType)}
      sx={{ 
        backgroundColor: historyData.before?.OpenPlotType !== historyData.after?.OpenPlotType ? '#ff8a80' : 'transparent' 
      }}
    />                                 </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                  <InputLabel>खुल्या भूखंडाच्या भो. नाव </InputLabel>
                    <TextField 
      fullWidth 
      value={getValue(historyData.after?.OpenPlotRenterName)}
      sx={{ 
        backgroundColor: historyData.before?.OpenPlotRenterName !== historyData.after?.OpenPlotRenterName ? '#ff8a80' : 'transparent' 
      }}
    />                             </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Wadh Ghat Remark</InputLabel>
                    <TextField 
      fullWidth 
      value={getValue(historyData.after?.WadhGhatRemarkOne)}
      sx={{ 
        backgroundColor: historyData.before?.WadhGhatRemarkOne !== historyData.after?.WadhGhatRemarkOne ? '#ff8a80' : 'transparent' 
      }}
    />              
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                
               
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Plot Taxable Area(SqFt)</InputLabel>
                    <TextField 
      fullWidth 
      value={getValue(historyData.after?.PlotTaxableAreaSqFt)}
      sx={{ 
        backgroundColor: historyData.before?.PlotTaxableAreaSqFt !== historyData.after?.PlotTaxableAreaSqFt ? '#ff8a80' : 'transparent' 
      }}
    />                            </Stack>
                </Grid>
                <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>WadhGhatDocument</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'अर्ज'} style={{ backgroundColor: '#ff8a80' }}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Occupier Name (OP) </InputLabel>
                    <TextField 
      fullWidth 
      value={getValue(historyData.after?.OpenPlotOccupierName)}
      sx={{ 
        backgroundColor: historyData.before?.OpenPlotOccupierName !== historyData.after?.OpenPlotOccupierName ? '#ff8a80' : 'transparent' 
      }}
    />                            </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>भोगवाटदाराचे नाव(OP)</InputLabel>
                    <TextField 
      fullWidth 
      value={getValue(historyData.after?.OpenPlotOccupierMarathiName)}
      sx={{ 
        backgroundColor: historyData.before?.OpenPlotOccupierMarathiName !== historyData.after?.OpenPlotOccupierMarathiName ? '#ff8a80' : 'transparent' 
      }}
    />                            </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>

        {/* 5th Old Information deatils */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Old information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Ward</InputLabel>
                    <TextField
  required
  fullWidth
  maxWidth="sm"
  value={getValue(getBeforeOld().OldWardNo)}
/>                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property No</InputLabel>
                    <TextField
  required
  fullWidth
  maxWidth="sm"
  value={getValue(getBeforeOld().OldPropertyNo)}
/>                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>PartitionNo</InputLabel>
                    <TextField
  required
  fullWidth
  maxWidth="sm"
  value={getValue(getBeforeOld().OldPartitionNo)}
/>                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>City Servey No</InputLabel>
                    <TextField
  required
  fullWidth
  maxWidth="sm"
  value={getValue(getBeforeOld().OldCityServeyNo)}
/>                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>RV</InputLabel>
                    <TextField
  required
  fullWidth
  maxWidth="sm"
  value={getValue(getBeforeOld().OldRV)}
/>                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>ALV</InputLabel>
                    <TextField
  required
  fullWidth
  maxWidth="sm"
  value={getValue(getBeforeOld().OldALV)}
/>                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property No</InputLabel>
                    <TextField
  required
  fullWidth
  maxWidth="sm"
  value={getValue(getBeforeOld().OldPropertyTax)}
/>                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Tax Total</InputLabel>
                    <TextField
  required
  fullWidth
  maxWidth="sm"
  value={getValue(getBeforeOld().OldTotalTax)}
/>                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Ward</InputLabel>
                    <TextField 
  fullWidth 
  value={getValue(getAfterOld().OldWardNo)}
  sx={{ 
    backgroundColor:
      getBeforeOld().OldWardNo !== getAfterOld().OldWardNo
        ? '#ff8a80'
        : 'transparent'
  }}
/>
                    </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property No</InputLabel>
                    <TextField 
  fullWidth 
  value={getValue(getAfterOld().OldPropertyNo)}
  sx={{ 
    backgroundColor:
      getBeforeOld().OldPropertyNo !== getAfterOld().OldPropertyNo
        ? '#ff8a80'
        : 'transparent'
  }}
/>                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>PartitionNo</InputLabel>
                    <TextField 
  fullWidth 
  value={getValue(getAfterOld().OldPartitionNo)}
  sx={{ 
    backgroundColor:
      getBeforeOld().OldPartitionNo !== getAfterOld().OldPartitionNo
        ? '#ff8a80'
        : 'transparent'
  }}
/>                                </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>City Servey No</InputLabel>
                    <TextField 
  fullWidth 
  value={getValue(getAfterOld().OldCityServeyNo)}
  sx={{ 
    backgroundColor:
      getBeforeOld().OldCityServeyNo !== getAfterOld().OldCityServeyNo
        ? '#ff8a80'
        : 'transparent'
  }}
/>                                </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>RV</InputLabel>
                    <TextField 
  fullWidth 
  value={getValue(getAfterOld().OldRV)}
  sx={{ 
    backgroundColor:
      getBeforeOld().OldRV !== getAfterOld().OldRV
        ? '#ff8a80'
        : 'transparent'
  }}
/>                                </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>ALV</InputLabel>
                    <TextField 
  fullWidth 
  value={getValue(getAfterOld().OldALV)}
  sx={{ 
    backgroundColor:
      getBeforeOld().OldALV !== getAfterOld().OldALV
        ? '#ff8a80'
        : 'transparent'
  }}
/>                                </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property No</InputLabel>
                    <TextField 
  fullWidth 
  value={getValue(getAfterOld().OldPropertyTax)}
  sx={{ 
    backgroundColor:
      getBeforeOld().OldPropertyTax !== getAfterOld().OldPropertyTax
        ? '#ff8a80'
        : 'transparent'
  }}
/>                                </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Tax Total</InputLabel>
                    <TextField 
  fullWidth 
  value={getValue(getAfterOld().OldTotalTax)}
  sx={{ 
    backgroundColor:
      getBeforeOld().OldTotalTax !== getAfterOld().OldTotalTax
        ? '#ff8a80'
        : 'transparent'
  }}
/>                                </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>

        {/* 6th Property new Information  */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Property New info
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>New ALV</InputLabel>
                    <TextField fullWidth value={CurrenttaxHistory.before?.ALV || '0.00'}  />
                                      </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>New RV</InputLabel>
                    <TextField fullWidth value={CurrenttaxHistory.before?.RateableValue || '0.00'}  />
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property Tax</InputLabel>
                    <TextField fullWidth value={CurrenttaxHistory.before?.PropertyTax || '0.00'}  />
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Tax Total</InputLabel>
                    <TextField fullWidth value={CurrenttaxHistory.before?.TaxTotal || '0.00'}  />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>New ALV</InputLabel>
                    <TextField 
          fullWidth 
          value={CurrenttaxHistory.after?.ALV || '0.00'} 
          style={{ 
            backgroundColor: CurrenttaxHistory.after?.ALV !== CurrenttaxHistory.before?.ALV ? '#ff8a80' : 'transparent' 
          }} 
           
        />                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>New RV</InputLabel>
                    <TextField 
          fullWidth 
          value={CurrenttaxHistory.after?.RateableValue || '0.00'} 
          style={{ 
            backgroundColor: CurrenttaxHistory.after?.RateableValue !== CurrenttaxHistory.before?.RateableValue ? '#ff8a80' : 'transparent' 
          }} 
        />                    </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property Tax</InputLabel>
                    <TextField 
          fullWidth 
          value={CurrenttaxHistory.after?.PropertyTax || '0.00'} 
          style={{ 
            backgroundColor: CurrenttaxHistory.after?.PropertyTax !== CurrenttaxHistory.before?.PropertyTax ? '#ff8a80' : 'transparent' 
          }} 
        />                    </Stack>
                </Grid>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Tax Total</InputLabel>
                    <TextField 
          fullWidth 
          value={CurrenttaxHistory.after?.TaxTotal || '0.00'} 
          style={{ 
            backgroundColor: CurrenttaxHistory.after?.TaxTotal !== CurrenttaxHistory.before?.TaxTotal ? '#ff8a80' : 'transparent' 
          }} 
        />                    </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
        {/* 7th Pending Tax Details table*/}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Pending tax details
              </Typography>
              <Box sx={{ overflowX: 'auto', height: '164px' }}>
                 <TableContainer >
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
  <TableHead>
         <TableRow>
           <TableCell className="font-weight-bold">Pending Year</TableCell>
           <TableCell className="font-weight-bold">	Property Tax</TableCell>
           <TableCell className="font-weight-bold">Education Tax</TableCell>
           <TableCell className="font-weight-bold">Sp. Education Tax		</TableCell>
           <TableCell className="font-weight-bold">Employment Tax</TableCell>
           <TableCell className="font-weight-bold">	Tree Cess</TableCell>
           <TableCell className="font-weight-bold">Fire Cess</TableCell>
           <TableCell className="font-weight-bold">Light Cess</TableCell>
           <TableCell className="font-weight-bold">Drain Cess</TableCell>
           <TableCell className="font-weight-bold">Road Cess</TableCell>
           <TableCell className="font-weight-bold">Sanitation</TableCell>
           <TableCell className="font-weight-bold">Sp. Water Cess</TableCell>
           <TableCell className="font-weight-bold">Water Benefit	</TableCell>
           <TableCell className="font-weight-bold">Water Bill	</TableCell>
           <TableCell className="font-weight-bold">Major Building</TableCell>
           <TableCell  className="font-weight-bold">Sewage Disposal Cess</TableCell>
           <TableCell  className="font-weight-bold">Tax1</TableCell>
           <TableCell  className="font-weight-bold">TaxTotal</TableCell>
           <TableCell  className="font-weight-bold">Interest</TableCell>
           <TableCell  className="font-weight-bold">Net Total</TableCell>
           <TableCell  className="font-weight-bold">Remark</TableCell>
         
         </TableRow>
       </TableHead>
      
        
         <TableBody >
         <TableRow>
  <TableCell>{getValue(getBeforeTax().PendingYear)}</TableCell>
  <TableCell>{getValue(getBeforeTax().PropertyTax)}</TableCell>
  <TableCell>{getValue(getBeforeTax().EducationTax)}</TableCell>
  <TableCell>{getValue(getBeforeTax().SpEducationTax)}</TableCell>
  <TableCell>{getValue(getBeforeTax().EmploymentTax)}</TableCell>
  <TableCell>{getValue(getBeforeTax().TreeCess)}</TableCell>
  <TableCell>{getValue(getBeforeTax().FireCess)}</TableCell>
  <TableCell>{getValue(getBeforeTax().LightCess)}</TableCell>
  <TableCell>{getValue(getBeforeTax().DrainCess)}</TableCell>
  <TableCell>{getValue(getBeforeTax().RoadCess)}</TableCell>
  <TableCell>{getValue(getBeforeTax().Sanitation)}</TableCell>
  <TableCell>{getValue(getBeforeTax().SpWaterCess)}</TableCell>
  <TableCell>{getValue(getBeforeTax().WaterBenefit)}</TableCell>
  <TableCell>{getValue(getBeforeTax().WaterBill)}</TableCell>
  <TableCell>{getValue(getBeforeTax().MajorBuilding)}</TableCell>
  <TableCell>{getValue(getBeforeTax().SewageDisposalCess)}</TableCell>
  <TableCell>{getValue(getBeforeTax().Tax1)}</TableCell>
  <TableCell>{getValue(getBeforeTax().TaxTotal)}</TableCell>
  <TableCell>{getValue(getBeforeTax().Interest)}</TableCell>
  <TableCell>{getValue(getBeforeTax().NetTotal)}</TableCell>
  <TableCell>{getValue(getBeforeTax().Remark)}</TableCell>
</TableRow>


        
       </TableBody>
  </Table>
</TableContainer> 
              </Box>
            </Grid>

            {/* table 6th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <TableContainer >
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
  <TableHead>
  <TableRow>
           <TableCell className="font-weight-bold">Pending Year</TableCell>
           <TableCell className="font-weight-bold">	Property Tax</TableCell>
           <TableCell className="font-weight-bold">Education Tax</TableCell>
           <TableCell className="font-weight-bold">Sp. Education Tax		</TableCell>
           <TableCell className="font-weight-bold">Employment Tax</TableCell>
           <TableCell className="font-weight-bold">	Tree Cess</TableCell>
           <TableCell className="font-weight-bold">Fire Cess</TableCell>
           <TableCell className="font-weight-bold">Light Cess</TableCell>
           <TableCell className="font-weight-bold">Drain Cess</TableCell>
           <TableCell className="font-weight-bold">Road Cess</TableCell>
           <TableCell className="font-weight-bold">Sanitation</TableCell>
           <TableCell className="font-weight-bold">Sp. Water Cess</TableCell>
           <TableCell className="font-weight-bold">Water Benefit	</TableCell>
           <TableCell className="font-weight-bold">Water Bill	</TableCell>
           <TableCell className="font-weight-bold">Major Building</TableCell>
           <TableCell  className="font-weight-bold">Sewage Disposal Cess</TableCell>
           <TableCell  className="font-weight-bold">Tax1</TableCell>
           <TableCell  className="font-weight-bold">TaxTotal</TableCell>
           <TableCell  className="font-weight-bold">Interest</TableCell>
           <TableCell  className="font-weight-bold">Net Total</TableCell>
           <TableCell  className="font-weight-bold">Remark</TableCell>
         
         </TableRow>
       </TableHead>
      
        
         <TableBody >
         <TableRow>
  <DiffCell field="PendingYear" />
  <DiffCell field="PropertyTax" />
  <DiffCell field="EducationTax" />
  <DiffCell field="SpEducationTax" />
  <DiffCell field="EmploymentTax" />
  <DiffCell field="TreeCess" />
  <DiffCell field="FireCess" />
  <DiffCell field="LightCess" />
  <DiffCell field="DrainCess" />
  <DiffCell field="RoadCess" />
  <DiffCell field="Sanitation" />
  <DiffCell field="SpWaterCess" />
  <DiffCell field="WaterBenefit" />
  <DiffCell field="WaterBill" />
  <DiffCell field="MajorBuilding" />
  <DiffCell field="SewageDisposalCess" />
  <DiffCell field="Tax1" />
  <DiffCell field="TaxTotal" />
  <DiffCell field="Interest" />
  <DiffCell field="NetTotal" />
  <DiffCell field="Remark" />
</TableRow>

       </TableBody>
  </Table>
</TableContainer> 
            </Grid>
          </Grid>
        </MainCard>
        {/* 8th current Tax Details table*/}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Current tax details
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Finance Year</TableCell>
                      <TableCell className="font-weight-bold"> Property Tax</TableCell>
                      <TableCell className="font-weight-bold">Education Tax</TableCell>
                      <TableCell className="font-weight-bold">Sp. Education Tax </TableCell>
                      <TableCell className="font-weight-bold">Employment Tax</TableCell>
                      <TableCell className="font-weight-bold"> Tree Cess</TableCell>
                      <TableCell className="font-weight-bold">Fire Cess</TableCell>
                      <TableCell className="font-weight-bold">Light Cess</TableCell>
                      <TableCell className="font-weight-bold">Drain Cess</TableCell>
                      <TableCell className="font-weight-bold">Road Cess</TableCell>
                      <TableCell className="font-weight-bold">Sanitation</TableCell>
                      <TableCell className="font-weight-bold">Sp. Water Cess</TableCell>
                      <TableCell className="font-weight-bold">Water Benefit </TableCell>
                      <TableCell className="font-weight-bold">Water Bill </TableCell>
                      <TableCell className="font-weight-bold">Major Building</TableCell>
                      <TableCell className="font-weight-bold">Sewage Disposal Cess</TableCell>
                      <TableCell className="font-weight-bold">Tax1</TableCell>
                      <TableCell className="font-weight-bold">TaxTotal</TableCell>
                      <TableCell className="font-weight-bold">Interest</TableCell>
                      <TableCell className="font-weight-bold">Remark</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody >
         <TableRow>
  <TableCell>{getValue(getBeforeTrans().FinanceYear)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().PropertyTax)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().EducationTax)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().SpEducationTax)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().EmploymentTax)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().TreeCess)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().FireCess)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().LightCess)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().DrainCess)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().RoadCess)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().Sanitation)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().SpWaterCess)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().WaterBenefit)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().WaterBill)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().MajorBuilding)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().SewageDisposalCess)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().Tax1)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().TaxTotal)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().Interest)}</TableCell>
  <TableCell>{getValue(getBeforeTrans().Remark)}</TableCell>
</TableRow>


        
       </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <Box sx={{ overflowX: 'auto', height: '164px' }}>
                <TableContainer >
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
  <TableHead>
  <TableRow>
           <TableCell className="font-weight-bold">Finance Year</TableCell>
           <TableCell className="font-weight-bold">	Property Tax</TableCell>
           <TableCell className="font-weight-bold">Education Tax</TableCell>
           <TableCell className="font-weight-bold">Sp. Education Tax		</TableCell>
           <TableCell className="font-weight-bold">Employment Tax</TableCell>
           <TableCell className="font-weight-bold">	Tree Cess</TableCell>
           <TableCell className="font-weight-bold">Fire Cess</TableCell>
           <TableCell className="font-weight-bold">Light Cess</TableCell>
           <TableCell className="font-weight-bold">Drain Cess</TableCell>
           <TableCell className="font-weight-bold">Road Cess</TableCell>
           <TableCell className="font-weight-bold">Sanitation</TableCell>
           <TableCell className="font-weight-bold">Sp. Water Cess</TableCell>
           <TableCell className="font-weight-bold">Water Benefit	</TableCell>
           <TableCell className="font-weight-bold">Water Bill	</TableCell>
           <TableCell className="font-weight-bold">Major Building</TableCell>
           <TableCell  className="font-weight-bold">Sewage Disposal Cess</TableCell>
           <TableCell  className="font-weight-bold">Tax1</TableCell>
           <TableCell  className="font-weight-bold">TaxTotal</TableCell>
           <TableCell  className="font-weight-bold">Interest</TableCell>
           <TableCell  className="font-weight-bold">Remark</TableCell>
         
         </TableRow>
       </TableHead>
      
        
         <TableBody >
         <TableRow>
  <DiffCellTrans field="FinanceYear" />
  <DiffCellTrans field="PropertyTax" />
  <DiffCellTrans field="EducationTax" />
  <DiffCellTrans field="SpEducationTax" />
  <DiffCellTrans field="EmploymentTax" />
  <DiffCellTrans field="TreeCess" />
  <DiffCellTrans field="FireCess" />
  <DiffCellTrans field="LightCess" />
  <DiffCellTrans field="DrainCess" />
  <DiffCellTrans field="RoadCess" />
  <DiffCellTrans field="Sanitation" />
  <DiffCellTrans field="SpWaterCess" />
  <DiffCellTrans field="WaterBenefit" />
  <DiffCellTrans field="WaterBill" />
  <DiffCellTrans field="MajorBuilding" />
  <DiffCellTrans field="SewageDisposalCess" />
  <DiffCellTrans field="Tax1" />
  <DiffCellTrans field="TaxTotal" />
  <DiffCellTrans field="Interest" />
  <DiffCellTrans field="Remark" />
</TableRow>
       </TableBody>
  </Table>
</TableContainer> 
              </Box>
            </Grid>
          </Grid>
        </MainCard>

        {/* 9 Appeal Taxes table*/}
        
        {/* 10th Water Connection Mast */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Water Connection Mast
              </Typography>
              <Box sx={{ overflowX: 'auto', height: '200px' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-weight-bold"> Water Connection</TableCell>
                        <TableCell className="font-weight-bold">Water Size </TableCell>
                        <TableCell className="font-weight-bold">Water connection type </TableCell>
                        <TableCell className="font-weight-bold">Water meter</TableCell>
                        <TableCell className="font-weight-bold"> Meter Status </TableCell>
                        <TableCell className="font-weight-bold">Water Bill Area Name </TableCell>
                        <TableCell className="font-weight-bold">Water Bill Meter No.1 </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                    <TableRow>
                <TableCell>{getValue(getBeforeSocial().NoOfWaterConnection)}</TableCell>
                <TableCell>{getValue(getBeforeSocial().WaterConnSize)}</TableCell>
                <TableCell>{getValue(getBeforeSocial().WaterConnectionType)}</TableCell>
                <TableCell>{getValue(getBeforeSocial().IsWaterMeter)}</TableCell>
                <TableCell>{getValue(getBeforeSocial().MeterStatus)}</TableCell>
                <TableCell>{getValue(getBeforeSocial().WaterBillAreaName)}</TableCell>
                <TableCell>{getValue(getBeforeSocial().WaterBillMeterNo)}</TableCell>
              </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <Box sx={{ overflowX: 'auto', height: '200px' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                      <TableCell className="font-weight-bold"> Water Connection</TableCell>
                        <TableCell className="font-weight-bold">Water Size </TableCell>
                        <TableCell className="font-weight-bold">Water connection type </TableCell>
                        <TableCell className="font-weight-bold">Water meter</TableCell>
                        <TableCell className="font-weight-bold"> Meter Status </TableCell>
                        <TableCell className="font-weight-bold">Water Bill Area Name </TableCell>
                        <TableCell className="font-weight-bold">Water Bill Meter No.1 </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                    <TableRow>
                <DiffCellSocial field="NoOfWaterConnection" />
                <DiffCellSocial field="WaterConnSize" />
                <DiffCellSocial field="WaterConnectionType" />
                <DiffCellSocial field="IsWaterMeter" />
                <DiffCellSocial field="MeterStatus" />
                <DiffCellSocial field="WaterBillAreaName" />
                <DiffCellSocial field="WaterBillMeterNo" />
              </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
        </MainCard>
        {/* 11 checkbox */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Special Discount Original
              </Typography>

              <Grid item xs={12} md={10} lg={6}>
 

  <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
    <Stack spacing={1} direction={'row'} marginTop={2}>
      <SocialCheckboxField field="IsSolar" label="IsSolar" />
      <SocialCheckboxField field="IsRainwaterharvesting" label="IsRainWaterHarvesting" />
      <SocialCheckboxField field="IsGarbageSegrigation" label="IsGarbageSegregation" />
    </Stack>
  </Grid>
</Grid>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack spacing={1} direction={'row'} marginTop={2}>
                  <Box display="flex" alignItems="center">
                    <Grid item><SocialCheckboxField field="IsEBill" label="IsEBill" /></Grid>                  </Box>
                  <Box display="flex" alignItems="center">
                  <Grid item><SocialCheckboxField field="ISGarbageDisposal" label="IsGarbageDisposal" /></Grid>                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
              <Grid container justifyContent="space-between">
          <SocialCheckboxField field="IsSolar" label="IsSolar" isAfter={true} />
          <SocialCheckboxField field="IsRainwaterharvesting" label="IsRainWaterHarvesting" isAfter={true} />
          <SocialCheckboxField field="IsGarbageSegrigation" label="IsGarbageSegregation" isAfter={true} />
        </Grid>
              </Grid>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack spacing={1} direction={'row'} marginTop={2}>
                  <Box display="flex" alignItems="center">
                    <Grid item><SocialCheckboxField field="IsEBill" label="IsEBill" isAfter={true} /></Grid>                  </Box>
                  <Box display="flex" alignItems="center">
                  <Grid item><SocialCheckboxField field="ISGarbageDisposal" label="IsGarbageDisposal" isAfter={true} /></Grid>                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
        {/* 12 Images */}

        <MainCard>
          <Grid container spacing={5} mb={1}>
            {/* <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Uploaded Images
              </Typography>
            </Grid> */}

            {/* table 12th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#b2dfdb', padding: '0.2vw' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginRight: 'auto' }}>
                  Uploaded Document
                </Typography>
                <Button variant="contained" onClick={toggle} color="primary" size="small">
                  Show Image
                </Button>
              </Box>

              {isOpen && (
                <Grid
                  container
                  spacing={2.2}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {/* table */}

                  {/* table2 */}
                  <Grid item xs={12} sm={9}>
                    <Box className="card">
                      <Card>
                        <CardContent>
                          {/* <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
          Ward List
          </Typography> */}

                          <Box sx={{ overflowX: 'auto', height: '280px' }}>
                            {/* Table */}
                            <Table>
                              {/* Table Header */}
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell>Document Name</TableCell>
                                  <TableCell>Show</TableCell>
                                </TableRow>
                              </TableHead>
                              {/* Table Body */}
                              <TableBody>
  {docs.length === 0 ? (
    <TableRow>
      <TableCell colSpan={2} align="center">
        No Documents
      </TableCell>
    </TableRow>
  ) : (
    docs.map((doc, index) => (
      <TableRow key={index}>
        <TableCell>
          {getDocNameFromFile(doc.fileName)}
        </TableCell>

        <TableCell>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleViewDocument(doc.fileUrl)}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </MainCard>

        {/* 13 Old Images */}

         <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                mb={1}
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}
              >
                Old Plan Photo
              </Typography>
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12} md={6} lg={3}>
                  {[0, 1].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        border: '2px solid #ccc',
                        padding: '30px',
                        borderRadius: '19px',
                        marginBottom: '0.4vw',
                        transition: 'transform 0.1s ease',
                        transform: hoveredItem === index ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
<img 
              //   src={oldPhotos[index] 
              //     ? `http://localhost:4000/NTIS_Images/${String(oldPhotos[index]).replace(/\\/g, '/')}` 
              //     : 'https://placehold.jp/150x100.png?text=No+Data'} 
              //   alt="Property" 
              //   style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
              //   onError={(e) => {
              //     e.target.src = 'https://placehold.jp/24/cc0000/ffffff/150x100.png?text=Not+Found';
              //   }}
              // />     
              src={oldPhotos[index] 
                ? `${BASE_URL}/NTIS_Images/${String(oldPhotos[index]).replace(/\\/g, '/').split('NTIS_Images/').pop()}` 
                : 'https://placehold.jp/150x100.png?text=No+Photo'} 
              alt="Old Plan"
              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://placehold.jp/150x100.png?text=Not+Found';
              }}
            />       
              </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  {[2, 3].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        border: '2px solid #ccc',
                        padding: '30px',
                        borderRadius: '19px',
                        marginBottom: '0.4vw',
                        transition: 'transform 0.1s ease',
                        transform: hoveredItem === index ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
<img 
                // src={oldPhotos[index] 
                //   ? `http://localhost:4000/NTIS_Images/${String(oldPhotos[index]).replace(/\\/g, '/')}` 
                //   : 'https://placehold.jp/150x100.png?text=No+Data'} 
                // alt="Property" 
                // style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                // onError={(e) => {
                //   e.target.src = 'https://placehold.jp/24/cc0000/ffffff/150x100.png?text=Not+Found';
                // }}
                src={oldPhotos[index] 
                  ? `${BASE_URL}/NTIS_Images/${String(oldPhotos[index]).replace(/\\/g, '/').split('NTIS_Images/').pop()}` 
                  : 'https://placehold.jp/150x100.png?text=No+Photo'} 
                alt="Old Plan"
                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.jp/150x100.png?text=Not+Found';
                }}
/>                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <Box
                    sx={{
                      border: '2px solid #ccc',
                      padding: '100px',
                      borderRadius: '19px',
                      marginBottom: '0.4vw',
                      marginRight: '-8vw',
                      transition: 'transform 0.1s ease',
                      transform: hoveredItem === 4 ? 'scale(1.3)' : 'scale(1)'
                    }}
                    onMouseEnter={() => handleMouseEnter(4)}
                    onMouseLeave={handleMouseLeave}
                  >
<img 
                // src={oldPhotos[4] 
                //   ? `http://localhost:4000/NTIS_Images/${String(oldPhotos[4]).replace(/\\/g, '/')}` 
                //   : 'https://placehold.jp/150x100.png?text=No+Data'} 
                // alt="Property" 
                // style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                // onError={(e) => {
                //   e.target.src = 'https://placehold.jp/24/cc0000/ffffff/150x100.png?text=Not+Found';
                // }}
                src={oldPhotos[4] 
                  ? `${BASE_URL}/NTIS_Images/${String(oldPhotos[4]).replace(/\\/g, '/').split('NTIS_Images/').pop()}` 
                  : 'https://placehold.jp/150x100.png?text=No+Photo'} 
                alt="Old Plan"
                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.jp/150x100.png?text=Not+Found';
                }}
/>                    </Box>
                </Grid>
              </Grid>
            </Grid>


            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                mb={1}
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}
              >
                Changed Plan Photo
              </Typography>
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12} md={6} lg={3}>
                  {[0, 1].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        border: '2px solid #ccc',
                        padding: '30px',
                        borderRadius: '19px',
                        marginBottom: '0.4vw',
                        transition: 'transform 0.1s ease',
                        transform: hoveredItem === index ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
<img 
              //   src={oldPhotos[index] 
              //     ? `http://localhost:4000/NTIS_Images/${String(oldPhotos[index]).replace(/\\/g, '/')}` 
              //     : 'https://placehold.jp/150x100.png?text=No+Data'} 
              //   alt="Property" 
              //   style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
              //   onError={(e) => {
              //     e.target.src = 'https://placehold.jp/24/cc0000/ffffff/150x100.png?text=Not+Found';
              //   }}
              // />     
              src={oldPhotos[index] 
                ? `${BASE_URL}/NTIS_Images/${String(oldPhotos[index]).replace(/\\/g, '/').split('NTIS_Images/').pop()}` 
                : 'https://placehold.jp/150x100.png?text=No+Photo'} 
              alt="Old Plan"
              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://placehold.jp/150x100.png?text=Not+Found';
              }}
            />       
              </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  {[2, 3].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        border: '2px solid #ccc',
                        padding: '30px',
                        borderRadius: '19px',
                        marginBottom: '0.4vw',
                        transition: 'transform 0.1s ease',
                        transform: hoveredItem === index ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
<img 
                // src={oldPhotos[index] 
                //   ? `http://localhost:4000/NTIS_Images/${String(oldPhotos[index]).replace(/\\/g, '/')}` 
                //   : 'https://placehold.jp/150x100.png?text=No+Data'} 
                // alt="Property" 
                // style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                // onError={(e) => {
                //   e.target.src = 'https://placehold.jp/24/cc0000/ffffff/150x100.png?text=Not+Found';
                // }}
                src={oldPhotos[index] 
                  ? `${BASE_URL}/NTIS_Images/${String(oldPhotos[index]).replace(/\\/g, '/').split('NTIS_Images/').pop()}` 
                  : 'https://placehold.jp/150x100.png?text=No+Photo'} 
                alt="Old Plan"
                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.jp/150x100.png?text=Not+Found';
                }}
/>                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <Box
                    sx={{
                      border: '2px solid #ccc',
                      padding: '100px',
                      borderRadius: '19px',
                      marginBottom: '0.4vw',
                      marginRight: '-8vw',
                      transition: 'transform 0.1s ease',
                      transform: hoveredItem === 4 ? 'scale(1.3)' : 'scale(1)'
                    }}
                    onMouseEnter={() => handleMouseEnter(4)}
                    onMouseLeave={handleMouseLeave}
                  >
<img 
                // src={oldPhotos[4] 
                //   ? `http://localhost:4000/NTIS_Images/${String(oldPhotos[4]).replace(/\\/g, '/')}` 
                //   : 'https://placehold.jp/150x100.png?text=No+Data'} 
                // alt="Property" 
                // style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                // onError={(e) => {
                //   e.target.src = 'https://placehold.jp/24/cc0000/ffffff/150x100.png?text=Not+Found';
                // }}
                src={oldPhotos[4] 
                  ? `${BASE_URL}/NTIS_Images/${String(oldPhotos[4]).replace(/\\/g, '/').split('NTIS_Images/').pop()}` 
                  : 'https://placehold.jp/150x100.png?text=No+Photo'} 
                alt="Old Plan"
                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://placehold.jp/150x100.png?text=Not+Found';
                }}
/>                    </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard> 

        {/* last */}
        <MainCard>
          <Grid item xs={12} sm={12}>
            <Typography
              variant="h5"
              mb={1}
              style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}
            >
              Data Entry Changes Approve/Disapprove
            </Typography>
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
              <Grid item xs={6} sm={1.2}>
                <Stack spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>वाढ-घट शेरा: </InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={5.3} mb={1} mt={1}>
                <Stack spacing={1}>
                <TextField
                required
                Width
                autoComplete="family-name"
                    value={remark}
      onChange={(e) => setRemark(e.target.value)}

                sx={{ mt: 3}}              />                </Stack>
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
              <Grid item xs={6} sm={2.2}>
                <Stack spacing={0}>
                <Button variant="contained" color="info" onClick={handleButtonClickApproval}>
                    Approval All{' '}
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={2.2}>
                <Stack spacing={0}>
                  <Button variant="contained" color="error" onClick={handleButtonClickDisApproval}>
                    Discard All{' '}
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={2.2}>
                <Stack spacing={0}>
                  <Button variant="contained" color="warning" onClick={PendingButton}>
                    Back To Search
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
        <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.severity}
    sx={{
      width: '100%',
      fontWeight: 600,
      color: '#fff',
      backgroundColor:
        snackbar.severity === 'success'
          ? '#2e7d32'
          : snackbar.severity === 'error'
          ? '#d32f2f'
          : snackbar.severity === 'warning'
          ? '#ed6c02'
          : '#0288d1',
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

      </MainCard>
    </>
  );
}

export default PendingDataEntry;
