//material - ui;
import {
  Grid,
  MenuItem,
  Snackbar,
  SnackbarContent,
  InputLabel,
  Select,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material';

import { Formik } from 'formik';
import * as yup from 'yup';
import UploadAvatar from 'components/third-party/dropzone/Avatar';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import translateText from 'utils/translator.js';

import { getCouncilList, saveAndUpdateCouncilDetails } from 'services/masterServices/council-details/council-details-service';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

// ==============================|| SAMPLE PAGE ||============================== //

function CouncilDetails() {
  const [councilList, setCouncliList] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [errors, setErrors] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);





  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user');
  }, [userData]);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Council Details';
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

      console.log(access, 'assigned access to Council Details Page');

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

  const validationSchema = yup.object().shape({
    NPTitle: yup.string().required('Council Name is required.'),
    NPAddress: yup.string().required('NPAddress is required.'),
    // NPEmail: yup.string().required('Email is required.'),
    NPEmail: yup.string().email('Invalid email format').required('Email is required'),
    NPContactNo: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Contact Number must be exactly 10 digits')
      .required('Contact Number is required.'),
    NPRemark: yup.string().required('Remark is required.'),
    NPWebsite: yup.string().required('NPWebsite is required.'),

    FromYear: yup
      .string()
      .matches(/^\d{4}$/, 'Year must be exactly 4 digits')
      .required('Year is required'),

    ToYear: yup
      .string()
      .matches(/^\d{4}$/, 'Year must be exactly 4 digits')
      .required('Year is required')
      .test('is-greater', 'ToYear must be greater than FromYear', function (value) {
        const { FromYear } = this.parent;
        return parseInt(value) > parseInt(FromYear);
      }),
    MaxYear: yup
      .string()
      .matches(/^\d{4}$/, 'Year must be exactly 4 digits')
      .required('Year is required'),

    MinRV: yup.string().required('Min RV is required.'),
    ThirdPartyName: yup.string().required('Party Name is required.'),
    ThirdPartyAddress: yup.string().required('Party Address is required.'),
    ThirdPartyContact: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Contact Number must be exactly 10 digits')
      .required('Contact Number is required.'),
    ThirdPartyWebSite: yup.string().required('NPWebsite is required.'),

    //ThirdPartyEmail: yup.string().email('Invalid email format').required('Email is required'),
    //ThirdPartyRemark: yup.string().required('Remark is required.'),
    ThirdPartyCopyRight: yup.string().required('Copyright is required.')
  });

  const handleClear = () => {
    setCouncilData({
      NPTitle: '',
      NPTitleMarathi: '',
      NPAddress: '',
      NPAddressInMarathi: '',
      NPEmail: '',
      NPContactNo: '',
      NPRemark: '',
      NPWebsite: '',
      NPImage: null,
      NPImageFile: [],  
      NPcon: null,
      NPIcon: null,
      MinRV: '',
      MaxYear: '',
      FromYear: '',
      ToYear: '',
      ThirdPartyWebSite: '',
      ThirdPartyName: '',
      ThirdPartyAddress: '',
      ThirdPartyContact: '',
      ThirdPartyRemark: '',
      ActiveStatus: '',
      ThirdPartyIcon: null,
      ThirdPartyImage: null,
      ThirdPartyCopyRight: '',
      PartyNameInMarathi: '',
      ThirdPartyEmail: '',
      PartyAddressInMarathi: ''
    });
    setErrors([]);
  };

  const [councilData, setCouncilData] = useState({
    AssessmentID: 0,
    NPTitle: '',
    NPTitleMarathi: '',
    NPAddress: '',
    NPAddressInMarathi: '',
    NPEmail: '',
    NPContactNo: '',
    NPRemark: '',
    NPWebsite: '',
    NPImage: null,
    NPImageFile: [],
    NPIcon: null,
      NPIconFile: [], 
    MinRV: '',
    MaxYear: '',
    FromYear: '',
    ToYear: '',
    ThirdPartyWebSite: '',
    ThirdPartyName: '',
    ThirdPartyAddress: '',
    ThirdPartyContact: '',
    ThirdPartyRemark: '',
    ActiveStatus: '',
    ThirdPartyIcon: null,
      ThirdPartyIconFile: [],
    ThirdPartyImage: null,
     ThirdPartyImageFile: [], 
    ThirdPartyCopyRight: '',
    PartyNameInMarathi: '',
    ThirdPartyEmail: '',
    PartyAddressInMarathi: ''
  });


useEffect(() => {
  const loadCouncilInfo = async () => {
    try {
      const data = await getCouncilList(); // fetch from backend
      console.log("📥 Raw fetchedCouncilList:", data);

  const bufferOrStringToFile = (value, fieldName) => {
  if (!value) return [];

  let fileName = "unknown.png";
  let preview = "";

  if (typeof value === "string") {
    fileName = value.split("/").pop() || fileName;
    preview = value.startsWith("http") ? value : `${BASE_URL}${value}`;
  } else if (value?.data) {
    const pathString = value.data.map(c => String.fromCharCode(c)).join("");
    fileName = pathString.split("/").pop() || fileName;
    preview = `${BASE_URL}${pathString}`;
  }

  const file = new File([new Blob()], fileName, { type: "image/png", lastModified: Date.now() });
  file.preview = preview;
  file.isUrl = true; 

  return [file];
};

      setCouncilData(prev => ({
        ...prev,
        ...data,
        NPImageFile: bufferOrStringToFile(data.NPImage, "NPImage"),
        NPIconFile: bufferOrStringToFile(data.NPIcon, "NPIcon"),
        ThirdPartyImageFile: bufferOrStringToFile(data.ThirdPartyImage, "ThirdPartyImage"),
        ThirdPartyIconFile: bufferOrStringToFile(data.ThirdPartyIcon, "ThirdPartyIcon"),
      }));

      console.log("✅ All files normalized for UploadAvatar");
    } catch (err) {
      console.error("❌ Error loading council info:", err);
    }
  };

  loadCouncilInfo();
}, []);

const updateFile = (url, prevFile, fieldName) => {
  if (!url) return prevFile?.[0] || null;

  const cleanUrl = url.startsWith(BASE_URL) ? url : `${BASE_URL}${url}`;

  if (prevFile?.[0]?.preview === cleanUrl) return prevFile[0];

  const file = new File([new Blob()], url.split("/").pop(), {
    type: "image/png",
    lastModified: Date.now(),
  });
  file.preview = cleanUrl;
  file.isUrl = true;

  return file;
};

const BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:4000" 
  : "http://newntis.coreproject.in/Tax_Assessment_NTIS_Backend";
  
const normalizeUrl = (url) => {

  console.log(url,"url images")
  if (!url) return null;         
  if (typeof url !== 'string') return String(url); 
  if (url.startsWith(BASE_URL)) return url;
  if (url.startsWith('http://localhost:4000')) return url.replace('http://localhost:4000', BASE_URL);
  return `${BASE_URL}${url}`;
};

const mergeUpdatedFile = (prevFiles, newUrl, fieldName) => {
  if (!newUrl) return prevFiles || [];

  const updatedFile = updateFile(normalizeUrl(newUrl), prevFiles, fieldName);

  // If prevFiles exist, replace file with same preview OR add if not present
  if (!prevFiles || prevFiles.length === 0) return [updatedFile];

  // Check if the updatedFile already exists in prevFiles
  const existingIndex = prevFiles.findIndex(f => f.preview === updatedFile.preview);
  if (existingIndex !== -1) return prevFiles; // already present, keep all

  // Replace first file (uploaded) and keep rest
  return [updatedFile, ...prevFiles.filter(f => f.preview !== updatedFile.preview)];
};

const handleSave = async () => {
  try {
    const formData = new FormData();

    Object.entries(councilData).forEach(([key, value]) => {
      if (!['NPImageFile', 'NPIconFile', 'ThirdPartyImageFile', 'ThirdPartyIconFile'].includes(key)) {
        formData.append(key, value ?? '');
      }
    });


    if (userData?.UserID) {
      formData.append("UserID", userData.UserID);
    }

    // Append only new files
    const appendFileIfNew = (fileArray, fieldName) => {
      const fileObj = fileArray?.[0];
      if (fileObj && !fileObj.isUrl) formData.append(fieldName, fileObj);
    };

    appendFileIfNew(councilData.NPImageFile, 'NPImage');
    appendFileIfNew(councilData.NPIconFile, 'NPIcon');
    appendFileIfNew(councilData.ThirdPartyImageFile, 'ThirdPartyImage');
    appendFileIfNew(councilData.ThirdPartyIconFile, 'ThirdPartyIcon');

    const response = await saveAndUpdateCouncilDetails(formData);
    const councilInfo = response.res?.data?.CouncilInfo;

    console.log(response,"ressoo");
    console.log(councilInfo,"ressoo councilInfo");


    // <-- THIS IS WHERE YOU CALL IT -->
    setCouncilData(prev => ({
      ...prev,
      NPImageFile: mergeUpdatedFile(prev.NPImageFile, councilInfo?.NPImage, "NPImage"),
      NPIconFile: mergeUpdatedFile(prev.NPIconFile, councilInfo?.NPIcon, "NPIcon"),
      ThirdPartyImageFile: mergeUpdatedFile(prev.ThirdPartyImageFile, councilInfo?.ThirdPartyImage, "ThirdPartyImage"),
      ThirdPartyIconFile: mergeUpdatedFile(prev.ThirdPartyIconFile, councilInfo?.ThirdPartyIcon, "ThirdPartyIcon"),
    }));

    setSnackbarSeverity('success');
    setReceivedMessage(response?.res?.data?.message || 'Council details saved/Updated successfully')
    setSnackbarMessage(receivedMessage);
    setSnackbarOpen(true);
  } catch (error) {
    console.error("❌ Error saving council info:", error);
    setSnackbarSeverity('error');
    setReceivedMessage(error,error)
    setSnackbarMessage('Failed to save council info');
    setSnackbarOpen(true);
  }
};

const handleInputChange = (e) => {
    const { name, value } = e.target;

    const digitOnlyPattern = /^[0-9]*$/;
    const alphanumericPattern = /^[a-zA-Z ]*$/;
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    switch (name) {
      case 'FromYear':
      case 'ToYear':
      case 'MaxYear':
        // Restrict to 4 digits and only numeric values
        if (value === '' || (digitOnlyPattern.test(value) && value.length <= 4)) {
          setCouncilData((prevState) => {
            const newCouncilData = { ...prevState, [name]: value };

            // Validate 'ToYear' must be greater than or equal to 'FromYear'
            if (name === 'ToYear') {
              const fromYear = parseInt(newCouncilData.FromYear, 10);
              const toYear = parseInt(value, 10);

              if (fromYear > toYear && !isNaN(fromYear) && !isNaN(toYear)) {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  ToYear: 'ToYear should be greater than FromYear'
                }));
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  ToYear: ''
                }));
              }
            }

            return newCouncilData;
          });
        }
        break;
      case 'NPTitle':
      case 'ThirdPartyName':
        // Allow only alphabets and spaces
        if (alphanumericPattern.test(value)) {
          setCouncilData((prevState) => ({
            ...prevState,
            [name]: value
          }));

          // Call translateText function for NPTitle and ThirdPartyName
          translateText(value)
            .then((translated) => {
              setCouncilData((prevState) => ({
                ...prevState,
                [name === 'NPTitle' ? 'NPTitleMarathi' : 'PartyNameInMarathi']: translated
              }));
            })
            .catch((err) => {
              console.error('Error:', err);
            });
        }
        break;

      case 'NPAddress':
      case 'ThirdPartyAddress':
        // Allow only alphabets, spaces, and numbers for addresses
        if (alphanumericPattern.test(value) || value === '') {
          setCouncilData((prevState) => ({
            ...prevState,
            [name]: value
          }));

          // Call translateText function for NPAddress and ThirdPartyAddress
          translateText(value)
            .then((translated) => {
              setCouncilData((prevState) => ({
                ...prevState,
                [name === 'NPAddress' ? 'NPAddressInMarathi' : 'PartyAddressInMarathi']: translated
              }));
            })
            .catch((err) => {
              console.error('Error:', err);
            });
        }
        break;

      case 'NPContactNo':
      case 'ThirdPartyContact':
        // Allow only digits and restrict to 10 characters
        if (digitOnlyPattern.test(value) && value.length <= 10) {
          setCouncilData((prevState) => ({
            ...prevState,
            [name]: value
          }));
        }
        break;

      default:
        // For other fields, simply update the state with the new value
        setCouncilData((prevState) => ({
          ...prevState,
          [name]: value
        }));
        break;
    }
};

  const handleSelectChange = (name, value) => {
    setCouncilData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
console.log("📦 UploadAvatar file prop:", councilData.NPImageFile);

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
        <MainCard title="Council Information">
          <MainCard title="Council Basic Details">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <Stack spacing={1} alignItems={'flex-start'}>
                  <InputLabel>Council Name</InputLabel>
                  <TextField
                    placeholder="NPTitle"
                    name="NPTitle"
                    value={councilData.NPTitle}
                    onChange={handleInputChange}
                    error={!!errors.NPTitle}
                    helperText={errors.NPTitle}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>NPAddress</InputLabel>
                  <TextField
                    placeholder="NPAddress"
                    name="NPAddress"
                    value={councilData.NPAddress}
                    onChange={handleInputChange}
                    error={!!errors.NPAddress}
                    helperText={errors.NPAddress}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>Contact Number</InputLabel>
                  <TextField
                    placeholder="NPContactNo"
                    name="NPContactNo"
                    value={councilData.NPContactNo}
                    onChange={handleInputChange}
                    error={!!errors.NPContactNo}
                    helperText={errors.NPContactNo}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>NPWebsite</InputLabel>
                  <TextField
                    placeholder="NPWebsite"
                    name="NPWebsite"
                    value={councilData.NPWebsite}
                    onChange={handleInputChange}
                    error={!!errors.NPWebsite}
                    helperText={errors.NPWebsite}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Stack spacing={1} alignItems={'flex-start'}>
                  <InputLabel>Council Name (Marathi)</InputLabel>
                  <TextField
                    placeholder="NPTitleMarathi"
                    name="NPTitleMarathi"
                    value={councilData.NPTitleMarathi}
                    onChange={handleInputChange}
                    // error={!!errors.NPTitleMarathi}
                    // helperText={errors.NPTitleMarathi}
                    // FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>NPAddress (Marathi)</InputLabel>
                  <TextField
                    placeholder="NPAddressInMarathi"
                    name="NPAddressInMarathi"
                    value={councilData.NPAddressInMarathi}
                    onChange={handleInputChange}
                    // error={!!errors.NPAddressInMarathi}
                    // helperText={errors.NPAddressInMarathi}
                    // FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    placeholder="NPEmail"
                    name="NPEmail"
                    value={councilData.NPEmail}
                    onChange={handleInputChange}
                    error={!!errors.NPEmail}
                    helperText={errors.NPEmail}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>NPRemark</InputLabel>
                  <TextField
                    placeholder="NPRemark"
                    name="NPRemark"
                    value={councilData.NPRemark}
                    onChange={handleInputChange}
                    error={!!errors.NPRemark}
                    helperText={errors.NPRemark}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <Stack spacing={1} alignItems={'flex-start'}>
                  <InputLabel>From Year</InputLabel>
                  <TextField
                    placeholder="FromYear"
                    name="FromYear"
                    value={councilData.FromYear}
                    onChange={handleInputChange}
                    error={!!errors.FromYear}
                    helperText={errors.FromYear}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>Min RV.</InputLabel>
                  <TextField
                    placeholder="MinRV"
                    name="MinRV"
                    value={councilData.MinRV}
                    onChange={handleInputChange}
                    type="number"
                    error={!!errors.MinRV}
                    helperText={errors.MinRV}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>Active Status</InputLabel>
                  <Select
                    sx={{ minWidth: '11.5vw' }}
                    value={councilData.ActiveStatus}
                    name="ActiveStatus"
                    onChange={(event) => {
                      handleSelectChange('ActiveStatus', event.target.value);
                    }}
                    disabled={accessLevel < 3}
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </Stack>
                <Stack mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack alignItems="center">
                        <Stack spacing={1.5} alignItems="center">
                       
<UploadAvatar
  file={councilData.NPImageFile || []}  // show preview
  setFieldValue={(name, value) => {
    console.log("🖼 UploadAvatar changed value (raw):", value);

    if (value && value.length > 0) {
      const updatedFile = value[0];

      // ✅ Always normalize
      if (!updatedFile.isUrl) {
        updatedFile.preview = updatedFile.preview || URL.createObjectURL(updatedFile);
        updatedFile.isUrl = false;
      }

      setCouncilData(prev => {
        const updated = {
          ...prev,
          NPImageFile: [updatedFile],
          NPImage: updatedFile.preview,   // ✅ always use preview
        };

        console.log("✅ NPImage updated in state:", updated.NPImage);
        console.log("📦 NPImageFile updated in state:", updated.NPImageFile);
        return updated;
      });
    } else {
      setCouncilData(prev => ({
        ...prev,
        NPImageFile: [],
        NPImage: null,
      }));
    }
  }}
/>


                        </Stack>
                        <InputLabel>Image</InputLabel>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <Stack spacing={1} alignItems={'flex-start'}>
                  <InputLabel>To Year</InputLabel>
                  <TextField
                    placeholder="ToYear"
                    name="ToYear"
                    value={councilData.ToYear}
                    onChange={handleInputChange}
                    error={!!errors.ToYear}
                    helperText={errors.ToYear}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                  <InputLabel>Max Year</InputLabel>
                  <TextField
                    placeholder="MaxYear"
                    name="MaxYear"
                    value={councilData.MaxYear}
                    onChange={handleInputChange}
                    error={!!errors.MaxYear}
                    helperText={errors.MaxYear}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    disabled={accessLevel < 3}
                  ></TextField>
                </Stack>
                <Stack mt={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack alignItems="center">
                        <Stack spacing={1.5} alignItems="center" name="NPIcon" value={councilData.NPIcon}>
                         <UploadAvatar
  file={councilData.NPIconFile || []}
  setFieldValue={(name, value) => {
    if (value && value.length > 0) {
      const updatedFile = value[0];
      if (!updatedFile.isUrl) {
        updatedFile.preview = updatedFile.preview || URL.createObjectURL(updatedFile);
        updatedFile.isUrl = false;
      }
      setCouncilData(prev => ({
        ...prev,
        NPIconFile: [updatedFile],
        NPIcon: updatedFile.preview,
      }));
    } else {
      setCouncilData(prev => ({ ...prev, NPIconFile: [], NPIcon: null }));
    }
  }}
/>
                        </Stack>
                        <InputLabel mt={1}>Icon</InputLabel>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
          <Grid mt={2}>
            <MainCard title="Provider Basic Details">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
                  <Stack spacing={1} alignItems={'flex-start'}>
                    <InputLabel>Party Name</InputLabel>
                    <TextField
                      placeholder="ThirdPartyName"
                      name="ThirdPartyName"
                      value={councilData.ThirdPartyName}
                      onChange={handleInputChange}
                      error={!!errors.ThirdPartyName}
                      helperText={errors.ThirdPartyName}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                  <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                    <InputLabel>Party Address</InputLabel>
                    <TextField
                      placeholder="ThirdPartyAddress"
                      name="ThirdPartyAddress"
                      value={councilData.ThirdPartyAddress}
                      onChange={handleInputChange}
                      error={!!errors.ThirdPartyAddress}
                      helperText={errors.ThirdPartyAddress}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                  <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                    <InputLabel>Contact Number</InputLabel>
                    <TextField
                      placeholder="ThirdPartyContact"
                      name="ThirdPartyContact"
                      value={councilData.ThirdPartyContact}
                      onChange={handleInputChange}
                      error={!!errors.ThirdPartyContact}
                      helperText={errors.ThirdPartyContact}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                  <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                    <InputLabel>NPWebsite</InputLabel>
                    <TextField
                      placeholder="ThirdPartyWebSite"
                      name="ThirdPartyWebSite"
                      value={councilData.ThirdPartyWebSite}
                      onChange={handleInputChange}
                      error={!!errors.ThirdPartyWebSite}
                      helperText={errors.ThirdPartyWebSite}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <Stack spacing={1} alignItems={'flex-start'}>
                    <InputLabel>Party Name (Marathi)</InputLabel>
                    <TextField
                      placeholder="PartyNameInMarathi"
                      name="PartyNameInMarathi"
                      value={councilData.PartyNameInMarathi}
                      onChange={handleInputChange}
                      // error={!!errors.PartyNameInMarathi}
                      // helperText={errors.PartyNameInMarathi}
                      // FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                  <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                    <InputLabel>NPAddress (Marathi)</InputLabel>
                    <TextField
                      placeholder="PartyAddressInMarathi"
                      name="PartyAddressInMarathi"
                      value={councilData.PartyAddressInMarathi}
                      onChange={handleInputChange}
                      // error={!!errors.PartyAddressInMarathi}
                      // helperText={errors.PartyAddressInMarathi}
                      // FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                  <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                    <InputLabel>Email</InputLabel>
                    <TextField
                      placeholder="ThirdPartyEmail"
                      name="ThirdPartyEmail"
                      value={councilData.ThirdPartyEmail}
                      onChange={handleInputChange}
                      error={!!errors.ThirdPartyEmail}
                      helperText={errors.ThirdPartyEmail}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                  <Stack spacing={1} alignItems={'flex-start'} mt={1}>
                    <InputLabel>Remark</InputLabel>
                    <TextField
                      placeholder="ThirdPartyRemark"
                      name="ThirdPartyRemark"
                      value={councilData.ThirdPartyRemark}
                      onChange={handleInputChange}
                      error={!!errors.ThirdPartyRemark}
                      helperText={errors.ThirdPartyRemark}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <Stack spacing={1} alignItems={'flex-start'}>
                    <InputLabel>Copyright</InputLabel>
                    <TextField
                      rows={4}
                      multiline
                      sx={{ minWidth: '22vw' }}
                      name="ThirdPartyCopyRight"
                      value={councilData.ThirdPartyCopyRight}
                      onChange={handleInputChange}
                      error={!!errors.ThirdPartyCopyRight}
                      helperText={errors.ThirdPartyCopyRight}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                    ></TextField>
                  </Stack>
                  <Stack mt={2} direction={'row'}>
                    <Stack ml={3.9}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Stack alignItems="center">
                            <Stack spacing={1.5} alignItems="center">
                            <UploadAvatar
  file={councilData.ThirdPartyImageFile || []}
  setFieldValue={(name, value) => {
    if (value && value.length > 0) {
      const updatedFile = value[0];
      if (!updatedFile.isUrl) {
        updatedFile.preview = updatedFile.preview || URL.createObjectURL(updatedFile);
        updatedFile.isUrl = false;
      }
      setCouncilData(prev => ({
        ...prev,
        ThirdPartyImageFile: [updatedFile],
        ThirdPartyImage: updatedFile.preview,
      }));
    } else {
      setCouncilData(prev => ({ ...prev, ThirdPartyImageFile: [], ThirdPartyImage: null }));
    }
  }}
/>
                            </Stack>
                            <InputLabel mt={1}>Image</InputLabel>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Stack>
                    <Stack ml={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Stack alignItems="center">
                            <Stack spacing={1.5} alignItems="center">
                              {/* <UploadAvatar
  file={councilData.ThirdPartyIconFile || []}
  setFieldValue={(name, value) => {
    if (value && value.length > 0) {
      const updatedFile = value[0];
      if (!updatedFile.isUrl) {
        updatedFile.preview = updatedFile.preview || URL.createObjectURL(updatedFile);
        updatedFile.isUrl = false;
      }
      setCouncilData(prev => ({
        ...prev,
        ThirdPartyIconFile: [updatedFile],
        ThirdPartyIcon: updatedFile.preview,
      }));
    } else {
      setCouncilData(prev => ({ ...prev, ThirdPartyIconFile: [], ThirdPartyIcon: null }));
    }
  }}
/> */}
<UploadAvatar
  file={councilData.ThirdPartyIconFile || []}
  setFieldValue={(name, value) => {
    console.log("📦 UploadAvatar setFieldValue called:", { name, value });

    if (value && value.length > 0) {
      const updatedFile = value[0];

      if (!updatedFile.isUrl) {
        updatedFile.preview = updatedFile.preview || URL.createObjectURL(updatedFile);
        updatedFile.isUrl = false;
      }

      console.log("🖼 Updated file object before saving to state:", updatedFile);

      setCouncilData(prev => ({
        ...prev,
        ThirdPartyIconFile: [updatedFile],
        ThirdPartyIcon: updatedFile.preview,
      }));
    } else {
      console.log("⚠️ UploadAvatar cleared file for", name);
      setCouncilData(prev => ({ ...prev, ThirdPartyIconFile: [], ThirdPartyIcon: null }));
    }
  }}
/>

                            </Stack>
                            <InputLabel mt={1}>Icon</InputLabel>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
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
            <Grid container display="flex" justifyContent="center" alignItems="center" spacing={2} mt={1}>
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleSave} disabled={accessLevel < 3}>
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="error" onClick={handleClear} disabled={accessLevel < 3}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

export default CouncilDetails;