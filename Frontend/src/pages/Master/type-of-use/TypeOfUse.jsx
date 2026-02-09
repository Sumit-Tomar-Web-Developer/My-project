import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { LockOutlined, LinkOutlined } from '@ant-design/icons';
// material-ui
import {
  Grid,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Tab,
  Tabs,
  Button,
  IconButton,
  Typography,
  Select,
  Snackbar,
  MenuItem,
  Checkbox,
  SnackbarContent,
  Divider,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  RadioGroup,
  Radio,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Alert
} from '@mui/material';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';

import * as Yup from 'yup';

import { DeleteOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';
import {
  deleteOldTypeOfUse,
  deleteTypeOfUse,
  getOldTypeOfUseList,
  getTypeOfUseList,
  saveAndUpdateOldTypeOfUse,
  saveAndUpdateTypeOfUse
} from 'services/masterServices/typeOfUseServices/typeOfUse.service.js';
import { fetchPrimeTypeOfUseList } from 'services/masterServices/prime-type-of-use-services/prime-type-of-use.services.js';
import { useNavigate } from 'react-router';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';
import { fetchGroupList, fetchTypeDescByGroupId } from 'services/assessmentService/DataEntryService/dataEntryService';

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

function TypeOfUse() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarMessages, setSnackbarMessages] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [value, setValue] = useState(0);
  const [typesOfUse, setTypesOfUse] = useState([]);
  const [typeofusePrimeList, setTypeofusePrimeList] = useState([]);
  const [typeOfUseList, setTypeOfUseList] = useState([])

  const [oldTypesOfUse, setOldTypesOfUse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOldRow, setSelectedOldRow] = useState(null);

  const [selectedCheckboxesNew, setSelectedCheckboxesNew] = useState([]);
  const [indeterminateNew, setIndeterminateNew] = useState(false);
  const [allCheckedNew, setAllCheckedNew] = useState(false);

  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // 'new' or 'old'
  const [typeOfUseData, setTypeOfUseData] = useState({
    ID: 0,
    Type: 'Select Type of Use',
    Description: '',
    GroupId: 0,
    GroupDescription: '',
    TypeOfUseID: ''
  });

  const [oldTypeOfUseData, setOldTypeOfUseData] = useState({
    ID: 0,
    OldType: '',
    OldDescription: '',
    OldTypeOfUseID: ''
  });

  useEffect(() => {
    fetchTypesOfUse();
  }, []);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Type of Use';
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
      console.log(access, 'assigned access to Type of Use Page');
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
  //   const fetchTypeOfUse = async () => {
  //     try {
  //       const fetchedTypeOfUse = await fetchPrimeTypeOfUseList();
  //       console.log(fetchedTypeOfUse, 'type list');
  //       setTypeOfUseData(fetchedTypeOfUse);
  //     } catch (error) {
  //       console.error('Error fetching type of use:', error);
  //       setTypeOfUseData([]);
  //     }
  //   };
  //   fetchTypeOfUse();
  // }, []);
  useEffect(() => {
    const fetchTypeOfUse = async () => {
      try {
        const fetchedTypeOfUse = await fetchPrimeTypeOfUseList();
        console.log(fetchedTypeOfUse, 'type list');
        setTypeofusePrimeList(fetchedTypeOfUse);
      } catch (error) {
        console.error('Error fetching type of use:', error);
        setTypeofusePrimeList([]);
      }
    };
    fetchTypeOfUse();
  }, []);
  useEffect(() => {
    if (typeOfUseData.GroupId && typeOfUseData.GroupId !== '0') {
      fetchTypeDescByGroupId(typeOfUseData.GroupId).then(setTypeOfUseList);
    }
  }, [typeOfUseData.GroupId]);
  const [selectedRowsNew, setSelectedRowsNew] = useState([]);
  //checkbox new
  useEffect(() => {
    const totalSelected = selectedRowsNew.length;
    const totalCheckboxes = typesOfUse.length;
    setAllCheckedNew(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminateNew(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRowsNew, typesOfUse]);

  //checkbox old
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = oldTypesOfUse.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, oldTypesOfUse]);

  const fetchTypesOfUse = async () => {
    try {
      const data = await getTypeOfUseList();
      setTypesOfUse(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch types of use:', error);
      setLoading(false);
    }
  };
  //1st excel for type of use
  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(typesOfUse);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Type of Use List');
    XLSX.writeFile(wb, 'TypeOfUse_List.xlsx');
  };
  //2nd excel for old type of use
  const handleExportToExcelOld = () => {
    const ws = XLSX.utils.json_to_sheet(oldTypesOfUse);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Old Type of Use List');
    XLSX.writeFile(wb, 'OldTypeOfUse_List.xlsx');
  };

  //old
  useEffect(() => {
    fetchOldTypesOfUse();
  }, []);

  const fetchOldTypesOfUse = async () => {
    try {
      const data = await getOldTypeOfUseList();
      setOldTypesOfUse(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch old types of use:', error);
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSelectedRow(null);
    setTypeOfUseData({
      ID: 0,
      Type: 'Select Type of Use',
      GroupId: '0',
      Description: '',
      GroupDescription: '',
      TypeOfUseID: ''
    });
    setErrors({});
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = Yup.object().shape({
    Type: Yup.string().required('Type is required'),
    Description: Yup.string()
    .matches(/^[\u0900-\u097F\s\-]+$|.+/, 'Description is required') // allows Marathi + spaces + dash + any text
    .required('Description is required'),   
     GroupDescription: Yup.string().required('GroupDescription is required'),
    TypeOfUseID: Yup.string().required('TypeOfUseID is required')
  });

  const oldValidationSchema = Yup.object().shape({
    OldType: Yup.string().required('Old Type is required'),
    OldDescription: Yup.string()
    .matches(/[\u0900-\u097F\s\-]+$|.+/, 'Old Description is required') // allows Marathi + any text
    .required('Old Description is required'),
        OldTypeOfUseID: Yup.string().required('Old Type Of Use ID is required')
  });
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    fetchGroupList().then(setGroupList).catch((err) => {
      console.error('Error fetching group list:', err);
    });
  }, []);
//   const handleSaveClick = async () => {
//     try {
//       const TypeDataToSave = {
//         ...typeOfUseData,
//         ID: typeOfUseData.ID || 0,
//         GroupId: typeOfUseData.GroupId,
//         GroupDescription: typeOfUseData.GroupDescription  
//           };
//       await validationSchema.validate(TypeDataToSave, { abortEarly: false });
//       const newTypeInfo = response.res.data.TypeInfo;
//       if (TypeDataToSave.ID === 0) {
//         response = await saveAndUpdateTypeOfUse(TypeDataToSave);
//         console.log(response, 'success  year saved');
//         if (response.status === 200 || response.status === 201 || response.status === 202) {
//           setReceivedMessage('Type Of Use saved successfully');
//           setSnackbarSeverity('success');
//           setSnackbarMessage(response.message || 'Type Of Use saved successfully');
//           setSnackbarOpen(true);
//                   setTypesOfUse((prev) => [...prev, newTypeInfo]);

//         } else {
//           throw new Error(response.message || 'An error occurred while saving Type Of Use');
//         }
//       } else {
//         response = await saveAndUpdateTypeOfUse(TypeDataToSave);
//         console.log(response, 'updated reponse');
//         if (response.status === 200 || response.status === 201 || response.status === 202) {
//           setReceivedMessage('Type Of Use updated successfully');
//           setSnackbarSeverity('success');
//           setSnackbarMessage(response.message || 'Type Of Use updated successfully');
//           setSnackbarOpen(true);
//   setTypesOfUse((prev) =>
//   prev.map((type) => (type.ID === newTypeInfo.ID ? newTypeInfo : type))
// );
//         } else {
//           throw new Error(response.message || 'An error occurred while updating Type Of Use data');
//         }
//       }
//       clearForm();
//     } catch (validationErrors) {
//       if (validationErrors.inner && validationErrors.inner.length > 0) {
//         const formattedErrors = validationErrors.inner.reduce((acc, err) => {
//           return { ...acc, [err.path]: err.message };
//         }, {});
//         setErrors(formattedErrors);
//       } else {
//         console.error('Validation Error:', validationErrors);
//       }
//     }
//   };
  
const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in constr  page');
  }, [userData])

const handleSaveClick = async () => {
  try {
    const TypeDataToSave = {
      ...typeOfUseData,
      ID: typeOfUseData.ID || 0,
      GroupId: typeOfUseData.GroupId,
      GroupDescription: typeOfUseData.GroupDescription,
      UserID: userData?.UserID || 1

    };

    // Validate before saving
    await validationSchema.validate(TypeDataToSave, { abortEarly: false });

    const response = await saveAndUpdateTypeOfUse(TypeDataToSave);

    if ([200, 201, 202].includes(response.status)) {
      const newTypeInfo = response.res.data.TypeInfo;

      if (TypeDataToSave.ID === 0) {
        // Add new item
        setTypesOfUse((prev) => [...prev, newTypeInfo]);
        setReceivedMessage('Type Of Use saved successfully'); // <-- use receivedMessage
      } else {
        // Update existing item
        setTypesOfUse((prev) =>
          prev.map((type) => (type.ID === newTypeInfo.ID ? newTypeInfo : type))
        );
        setReceivedMessage('Type Of Use updated successfully'); // <-- use receivedMessage
      }

      // Show success snackbar
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Highlight the newly added/edited row
      setTypeOfUseData(newTypeInfo);

      // Clear the form fields
      clearForm();
    } else {
      throw new Error(response.message || 'An error occurred while saving/updating Type Of Use');
    }
  } catch (validationErrors) {
    if (validationErrors.inner && validationErrors.inner.length > 0) {
      const formattedErrors = validationErrors.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      setErrors(formattedErrors);
    } else {
      console.error('Validation Error:', validationErrors);
      setReceivedMessage('An unexpected error occurred'); // <-- error message
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }
};

  
  const handleOldInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === 'Description') {
   const regex = /^[A-Za-z\u0900-\u097F\s\-]*$/;           if (!regex.test(value)) {
        updatedValue = '';
      }
    }

    setOldTypeOfUseData((prevState) => ({
      ...prevState,
      [name]: updatedValue
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === 'Description') {
      const regex = /^[A-Za-z\u0900-\u097F\s\-]*$/; 
           if (!regex.test(value)) {
        updatedValue = '';
      }
    }

    setTypeOfUseData((prevState) => ({
      ...prevState,
      [name]: updatedValue
    }));
  };

  const handleRowClick = (type) => {
    console.log('Row clicked:', type);
    setSelectedRow(type);
    setTypeOfUseData({
      ID: type.ID,
      TypeOfUseID: type.TypeOfUseID,
      Description: type.Description,
      Type: type.Type,
      GroupId: type.GroupID || 0,
      GroupDescription: type.GroupDescription || ''
    });
  };
  

  const clearOldForm = () => {
    setSelectedOldRow(null);
    setOldTypeOfUseData({
      ID: 0,
      OldType: '',
      OldDescription: '',
      OldTypeOfUseID: ''
    });
  };

  const handleOldSaveClick = async () => {
    try {
      const OldTypeDataToSave = {
        ...oldTypeOfUseData,
        ID: oldTypeOfUseData.ID || 0,
        UserID: userData?.UserID || 1

      };

      // Validate data before proceeding
      await oldValidationSchema.validate(OldTypeDataToSave, { abortEarly: false });

      let response;
      // For creating new Old Type Of Use
      if (OldTypeDataToSave.ID === 0) {
        response = await saveAndUpdateOldTypeOfUse(OldTypeDataToSave);
        console.log(response, 'success year saved');

        // Handle successful save response
        if ([200, 201, 202].includes(response.status)) {
          setReceivedMessage('Old Type Of Use saved successfully');
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Old Type Of Use saved successfully');
          setSnackbarOpen(true);
          clearOldForm();
          // Add the new saved data to the list
          setOldTypesOfUse((oldTypesOfUse) => [...oldTypesOfUse, response.res.data.TypeInfo]);
        } else {
          throw new Error(response.message || 'An error occurred while saving Old Type Of Use');
        }
      }
      // For updating existing Old Type Of Use
      else {
        response = await saveAndUpdateOldTypeOfUse(OldTypeDataToSave);
        console.log(response, 'updated response');

        // Handle successful update response
        if ([200, 201, 202].includes(response.status)) {
          setReceivedMessage('Old Type Of Use updated successfully');
          setSnackbarSeverity('success');
          setSnackbarMessage(response.message || 'Old Type Of Use updated successfully');
          setSnackbarOpen(true);
          clearOldForm();
          // Update the existing list with new data
          setOldTypesOfUse((oldTypesOfUse) => {
            if (!Array.isArray(oldTypesOfUse)) return oldTypesOfUse; // Safeguard to ensure oldTypesOfUse is an array

            return oldTypesOfUse.map((type) => {
              // Ensure IDs are available before comparison
              if (!type?.ID || !response?.res?.data?.Factor?.ID) return type;

              // Replace the old data with the updated one
              return type.ID === response.res.data.Factor.ID ? response.res.data.Factor : type;
            });
          });
        } else {
          throw new Error(response.message || 'An error occurred while updating Old Type Of Use data');
        }
      }

      // Clear form data after successful save or update
      clearForm();
    } catch (validationErrors) {
      // Handle validation errors
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

  const handleOldRowClick = (type) => {
    setSelectedOldRow(type);
    setOldTypeOfUseData({
      ID: type.ID,
      OldTypeOfUseID: type.OldTypeOfUseID,
      OldDescription: type.OldDescription,
      OldType: type.OldType
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDeleteTypeOfUse = async () => {
    try {
      const IDsToDelete = selectedRowsNew.map((row) => row.ID);

      if (IDsToDelete.length > 0) {
        const response = await deleteTypeOfUse(IDsToDelete);
        console.log(response, 'deleted new type of use');
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarMessage(receivedMessage);
        setSnackbarOpen(true);

        setTypesOfUse((prevTypes) => prevTypes.filter((type) => !IDsToDelete.includes(type.ID)));
        setSelectedRows([]);
      }
    } catch (error) {
      console.error('Error deleting old type information:', error);
      setSnackbarOpen(true);
      setReceivedMessage('Error deleting old type details');
      setSnackbarSeverity('error');
    }
  };

  const handleDeleteOldTypeOfUse = async () => {
    try {
      const IDsToDelete = selectedRows.map((row) => row.ID);

      if (IDsToDelete.length > 0) {
        const response = await deleteOldTypeOfUse(IDsToDelete);
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setOldTypesOfUse((prevOldTypes) => prevOldTypes.filter((type) => !IDsToDelete.includes(type.ID)));
        setSelectedRows([]);
      }
    } catch (error) {
      console.error('Error deleting old type information:', error);
      setSnackbarOpen(true);
      setReceivedMessage('Error deleting old type details');
      setSnackbarSeverity('error');
    }
  };

  //checkbox new
  const handleNewCheckboxChange = (event, newtype) => {
    if (event.target.checked) {
      setSelectedRowsNew((prevSelected) => [...prevSelected, newtype]);
    } else {
      setSelectedRowsNew((prevSelected) => prevSelected.filter((selectedNewType) => selectedNewType.ID !== newtype.ID));
    }
  };

  const handleSelectAllNew = (event) => {
    if (event.target.checked) {
      setSelectedRowsNew(typesOfUse);
    } else {
      setSelectedRowsNew([]);
    }
  };

  //checkbox old
  const handleOldCheckboxChange = (event, type) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, type]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((selectedOldType) => selectedOldType.ID !== type.ID));
    }
  };

  //checkbox old
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(oldTypesOfUse);
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <>
      {' '}
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
        <MainCard title="Type Of Use Master">
          <Grid item xs={2}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="New Type of Use" {...a11yProps(0)} />
                <Tab label="Old Type of Use" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
             
              <Grid container spacing={3}>
                <Grid item xs={12} mt={2}>
                  <Grid container spacing={2} alignItems="center">
                    {/* <Grid xs={12} lg={1.5}></Grid> */}
                    <Grid item xs={12} lg={3} mt={2}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                          <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' }, fontWeight: 'bolder' }}>Type of Use </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={9} lg={8} mb={2}>
                          <TextField
                            value={typeOfUseData.TypeOfUseID}
                            fullWidth
                            // onChange={(e) => setTypeOfUseData({ ...typeOfUseData, TypeOfUseID: e.target.value })}
                            onChange={handleInputChange}
                            error={!!errors.TypeOfUseID}
                            helperText={errors.TypeOfUseID}
                            FormHelperTextProps={{ style: { color: 'red' } }}
                            name="TypeOfUseID"
                            disabled={accessLevel < 3}
                          />
                          {/* <FormHelperText>Please enter your full name</FormHelperText> */}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} lg={3} mt={2}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                          <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' }, fontWeight: 'bolder' }}>Description </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={9} lg={8} mb={2}>
                          <TextField
                            value={typeOfUseData.Description}
                            fullWidth
                            onChange={handleInputChange}
                            error={!!errors.Description}
                            helperText={errors.Description}
                            FormHelperTextProps={{ style: { color: 'red' } }}
                            name="Description"
                            disabled={accessLevel < 3}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* </Grid> */}
                    {/* <Grid container spacing={2} alignItems="center"> */}
                    {/* <Grid xs={12} lg={1.5}></Grid> */}
                    <Grid item xs={12} lg={3}>
  <Grid container spacing={2} alignItems="center">
    {/* Label on the left */}
    <Grid item xs={12} sm={3} lg={4}>
      <Typography
        sx={{
          fontWeight: 'bold',
          textAlign: { xs: 'left', sm: 'right' },
          pr: 1
        }}
      >
        Group
      </Typography>
    </Grid>

    {/* Dropdown on the right */}
    <Grid item xs={12} sm={9} lg={8}>
    <Select
  value={typeOfUseData.GroupId || ''} // prefill GroupId
  onChange={(e) =>
    setTypeOfUseData({
      ...typeOfUseData,
      GroupId: e.target.value,
      GroupDescription: groupList.find(g => g.GroupID === e.target.value)?.GroupDescription || ''
    })
  }
  name="GroupId"
  sx={{ width: '100%', height: 50, fontSize: '1rem' }}
  disabled={accessLevel < 3}
>
  {/* Default placeholder option */}
  <MenuItem value="" disable>Select Group</MenuItem>

  {/* Map the rest of the groups */}
  {groupList.map((group) => (
    <MenuItem key={group.GroupID} value={group.GroupID}>
      {group.GroupDescription}
    </MenuItem>
  ))}
</Select>
    


  {errors.GroupDescription && (
    <Typography sx={{ color: 'red', mt: 0.5 }}>
      {errors.GroupDescription}
    </Typography>
  )}
</Grid>

  </Grid>
</Grid>

                    <Grid item xs={12} lg={3} mt={2}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                          <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' }, fontWeight: 'bolder' }}>Type </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={9} lg={8} mb={2}>
                          <Select
                            fullWidth
                            sx={{ minWidth: '10vw' }}
                            labelId="type-of-use"
                            id="type-of-use"
                            value={typeOfUseData.Type}
                            onChange={(e) => setTypeOfUseData({ ...typeOfUseData, Type: e.target.value })}
                            name="type"
                            disabled={accessLevel < 3}
                          >
                            <MenuItem value=" " disable>
                              Select Type of Use
                            </MenuItem>
                           
                            {typeofusePrimeList.map((type) => (
                    <MenuItem key={type.ID}
                      value={type.Type} >
                      {type.Description} </MenuItem>))}
                          </Select>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
                <Grid item>
                  <Button variant="contained" color="success" onClick={handleSaveClick} disabled={accessLevel < 3}>
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={clearForm} disabled={accessLevel < 3}>
                    Clear
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setDeleteTarget('new'); // mark that new type is being deleted
                      setDeleteDialogOpen(true);
                    }}                    // disabled={!selectedRow}
                    disabled={accessLevel < 4}
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="warning" onClick={handleExportToExcel} disabled={accessLevel < 3}>
                    Excel
                  </Button>
                </Grid>
              </Grid>
              <TableContainer sx={{ mt: 3, height: '250px' ,overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow  sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
        <TableCell sx={{ width: '1vw' }}>
                        <Checkbox
                          indeterminate={indeterminateNew}
                          checked={allCheckedNew}
                          onChange={handleSelectAllNew}
                          disabled={accessLevel < 3}
                        />
                      </TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Type Of Use</TableCell>
                      <TableCell>Type Of Use Description</TableCell>
                      <TableCell>Group</TableCell>
                     <TableCell>Type</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
  {typesOfUse
    .filter((type) => type && type.ID !== undefined)
    .map((type) => (
      <TableRow key={type.ID}>
        <TableCell>
          <Checkbox
            checked={selectedRowsNew.includes(type)}
            onChange={(event) => handleNewCheckboxChange(event, type)}
            disabled={accessLevel < 3}
          />
        </TableCell>
        <TableCell>
          <IconButton
            color={typeOfUseData.ID === type.ID ? 'success' : 'primary'}
            onClick={() => handleRowClick(type)}
            disabled={accessLevel < 3}
          >
            {typeOfUseData.ID === type.ID ? <SendOutlined /> : <EditTwoTone />}
          </IconButton>
        </TableCell>
        <TableCell>{type.TypeOfUseID}</TableCell>
        <TableCell>{type.Description}</TableCell>
       {/* <TableCell>{type.GroupDescription}</TableCell> */}
       <TableCell>{type.GroupID}</TableCell>

        <TableCell>{type.Type}</TableCell>

      </TableRow>
    ))}
</TableBody>

                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Grid display={'flex'} justifyContent={'center'} mt={3}>
                <Grid item xs={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Type Of Use</InputLabel>
                </Grid>
                <Grid item xs={1} ml={2}>
                  <TextField
                    value={oldTypeOfUseData.OldTypeOfUseID}
                    onChange={handleOldInputChange}
                    error={!!errors.OldTypeOfUseID}
                    helperText={errors.OldTypeOfUseID}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    name="OldTypeOfUseID"
                    disabled={accessLevel < 3}
                  />
                </Grid>
                <Grid item xs={3} ml={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Description</InputLabel>
                </Grid>
                <Grid item xs={3} ml={2}>
                  <TextField
                    value={oldTypeOfUseData.OldDescription}
                    onChange={handleOldInputChange}
                    error={!!errors.OldDescription}
                    helperText={errors.OldDescription}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    name="OldDescription"
                    disabled={accessLevel < 3}
                  />
                </Grid>
                <Grid item xs={3} ml={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Type</InputLabel>
                </Grid>
                <Grid item xs={3} ml={2}>
                  <TextField
                    value={oldTypeOfUseData.OldType}
                    onChange={handleOldInputChange}
                    error={!!errors.OldType}
                    helperText={errors.OldType}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    name="OldType"
                    disabled={accessLevel < 3}
                  />
                </Grid>
              </Grid>

              <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
                <Grid item>
                  <Button variant="contained" color="success" onClick={handleOldSaveClick} disabled={accessLevel < 3}>
                    Save
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={clearOldForm} disabled={accessLevel < 3}>
                    Clear
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="error" 
 onClick={() => {
  setDeleteTarget('old'); // mark that old type is being deleted
  setDeleteDialogOpen(true);
}}                  disabled={accessLevel < 4}>
                    Delete
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="warning" onClick={handleExportToExcelOld} disabled={accessLevel < 3}>
                    Export
                  </Button>
                </Grid>
              </Grid>

              <TableContainer sx={{ mt: 3, height: '250px' ,overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                      <TableCell sx={{ width: '1vw' }}>
                        <Checkbox
                          indeterminate={indeterminate}
                          checked={allChecked}
                          onChange={handleSelectAll}
                          disabled={accessLevel < 3}
                        />
                      </TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Type Of Use</TableCell>
                      <TableCell>Type Of Use Description</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {oldTypesOfUse.map((type) => (
                      <TableRow key={type.ID}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(type)}
                            onChange={(event) => handleOldCheckboxChange(event, type)}
                            disabled={accessLevel < 3}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color={oldTypeOfUseData.ID === type.ID ? 'success' : 'primary'}
                            onClick={() => handleOldRowClick(type)}
                            disabled={accessLevel < 3}
                          >
                            {oldTypeOfUseData.ID === type.ID ? <SendOutlined /> : <EditTwoTone />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{type.OldTypeOfUseID}</TableCell>
                        <TableCell>{type.OldDescription}</TableCell>
                        <TableCell>{type.OldType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </Grid>
        </MainCard>
      )}

<Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete?</Typography>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setDeleteDialogOpen(false)}
      style={{ backgroundColor: "black", color: "#fff"  }}    >
      Cancel
    </Button>
    <Button
      onClick={() => {
        if (deleteTarget === 'new') handleDeleteTypeOfUse();
        if (deleteTarget === 'old') handleDeleteOldTypeOfUse();
        setDeleteDialogOpen(false);
      }}
      style={{ backgroundColor: "red", color: "#fff"  }}    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

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
  );
}

export default TypeOfUse;
