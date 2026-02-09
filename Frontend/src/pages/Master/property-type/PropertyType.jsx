import { DeleteOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';
import {
  Grid,
  SnackbarContent,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Snackbar,
  Stack,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Typography, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import { property } from 'lodash';
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchPrimeTypeOfUseList } from 'services/masterServices/prime-type-of-use-services/prime-type-of-use.services.js';
import {
  deletePropertyMaster,
  getPropertyList,
  saveAndUpdatePropertyMaster
} from 'services/masterServices/property-typeService/property-type-master.service.js';
import * as XLSX from 'xlsx';

import * as Yup from 'yup';
import PropertyTypeTax from '../property-type-tax/PropertyTypeTax';
import { useNavigate } from 'react-router';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';
//
function PropertyType() {
  const [propertyList, setPropertyList] = useState([]);
  const [typeofusePropertyList, setTypeofusePropertyList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [propertyData, setPropertyData] = useState({
    PropertyDescription: '',
    PropertyTypeGroupID: '',
    PropertyTypeID: '0',
    Type: 0,
    Tax: ''
  });

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Property Type';
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

      console.log(access, 'assigned access to Property Type Page');

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
  //backend
  useEffect(() => {
    const fetchPropertylist = async () => {
      try {
        const fetched_Property_list = await getPropertyList();
        setPropertyList(fetched_Property_list);
        console.log('Property List', fetched_Property_list);
      } catch (error) {
        console.error('Error fetching property list:', error);
        setPropertyList([]);
      }
    };
    fetchPropertylist();
  }, []);
  // propertyType checkbox
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = propertyList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, propertyList]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  //Type fetching
  useEffect(() => {
    const fetchTypeOfUse = async () => {
      try {
        const fetchedTypeOfUse = await fetchPrimeTypeOfUseList();
        console.log(fetchedTypeOfUse, 'type list');
        setTypeofusePropertyList(fetchedTypeOfUse);
      } catch (error) {
        console.error('Error fetching type of use:', error);
        setTypeofusePropertyList([]);
      }
    };
    fetchTypeOfUse();
  }, []);

  const handelClearClick = () => {
    setPropertyData({
      PropertyDescription: '',
      PropertyTypeGroupID: '',
      PropertyTypeID: '',
      Type: 0,
      Tax: ''
    });
  };

  const validationSchema = Yup.object().shape({
    PropertyDescription: Yup.string().required('Property Description is required'),
    Type: Yup.string().required('type is required'),
    Tax: Yup.string().required('Tax is required')
  });

  // const handleCheckboxChange = (e, property) => {
  //   const isChecked = e.target.checked;
  //   setSelectedRows((prevSelectedRows) =>
  //     isChecked ? [...prevSelectedRows, property] : prevSelectedRows.filter((row) => row.PropertyTypeID !== property.PropertyTypeID)
  //   );
  // };

  // const handleDeleteProperty = async () => {
  //   try {
  //     for (const row of selectedRows) {

  //     const response = await deletePropertyMaster(row.PropertyTypeID);
  //     setPropertyList((propertyList) =>
  //     propertyList.filter((property) => !selectedRows.some((selected) => selected.PropertyTypeID === property.PropertyTypeID))
  //   );
  //     setReceivedMessage(response.message);
  //     setSnackbarSeverity('error');
  //     setSnackbarMessage('Property Type deleted successfully');
  //     setSnackbarOpen(true);
  //      setSelectedRows([]);

  //     handelClearClick();
  //   } }catch (error) {
  //     console.error('Error deleting property Type:', error);
  //     setSnackbarSeverity('error');
  //     setSnackbarMessage('Error deleting property Type');
  //     setSnackbarOpen(true);
  //     handleClearClick();
  //   }
  // };

  const handleDeleteProperty = async () => {
    try {
      // Collect all selected PropertyTypeIDs
      const idsToDelete = selectedRows.map((row) => row.PropertyTypeID);

      const response = await deletePropertyMaster(idsToDelete); // Pass array of IDs

      setPropertyList((propertyList) =>
        propertyList.filter((property) => !selectedRows.some((selected) => selected.PropertyTypeID === property.PropertyTypeID))
      );

      setReceivedMessage(response.message);
      setSnackbarSeverity('success'); // 'error' was incorrect for success messages
      setSnackbarOpen(true);
      setSelectedRows([]);

      handelClearClick();
    } catch (error) {
      console.error('Error deleting property Type:', error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      handleClearClick();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow alphabets (English + Marathi/Devanagari) for PropertyTypeGroupID and Type
  const alphabeticRegex = /^[\u0900-\u097Fa-zA-Z\s]*$/;
  if ((name === 'PropertyTypeGroupID' || name === 'Type') && !alphabeticRegex.test(value)) {
    return;
  }

    // Allow only numeric values for Tax field
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    if (name === 'Tax' && !numericRegex.test(value)) {
      return;
    }

    setPropertyData({
      ...propertyData,
      [name]: value
    });
  };

  const handleRowClick = (property) => {
    setSelectedRow(property);
    setPropertyData({
      PropertyDescription: property.PropertyDescription,
      PropertyTypeID: property.PropertyTypeID,
      Type: property.Type,
      Tax: property.Tax
    });
  };
  //id
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in constr  page');
  }, [userData])
  const handleSaveProperty = async () => {
    try {
      const propertyDataToSave = { 
        ...propertyData, 
        UserID: userData?.UserID || 1
      };
  
      await validationSchema.validate(propertyDataToSave, { abortEarly: false });
  
      console.log("Sending Property Data with Audit Info:", propertyDataToSave);
  
      const result = await saveAndUpdatePropertyMaster(propertyDataToSave);
      
      if (result.status === 200 || result.status === 201) {
        const newOrUpdatedRecord = result.response.data.PropertyTypeInfo;
  
        setReceivedMessage(result.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
  
        if (propertyData.PropertyTypeID === '0' || propertyData.PropertyTypeID === 0) {
          /* --- INSERT CASE --- */
          setPropertyList((prevList) => [...prevList, newOrUpdatedRecord]);
        } else {
          setPropertyList((prevList) =>
            prevList.map((item) =>
              item.PropertyTypeID === newOrUpdatedRecord.PropertyTypeID ? newOrUpdatedRecord : item
            )
          );
        }
  
        handelClearClick(); 
      } else {
        setReceivedMessage(result.message || 'Error');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Save Error:", error);
      if (error.inner) {
        const formattedErrors = error.inner.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {});
        setErrors(formattedErrors);
      }
    }
  };
  // const handleSaveProperty = async () => {
  //   try {
  //     const propertyDataToSave = { ...propertyData };
  //     await validationSchema.validate(propertyDataToSave, { abortEarly: false });
  
  //     const result = await saveAndUpdatePropertyMaster(propertyDataToSave);
      
  //     if (result.status === 200 || result.status === 201) {
        
  //       const newOrUpdatedRecord = result.response.data.PropertyTypeInfo;
  
  //       setReceivedMessage(result.message);
  //       setSnackbarSeverity('success');
  //       setSnackbarOpen(true);
  
  //       if (propertyDataToSave.PropertyTypeID === '0' || propertyDataToSave.PropertyTypeID === 0) {
  //         /* --- INSERT CASE --- */
  //         setPropertyList((prevList) => [...prevList, newOrUpdatedRecord]);
  //       } else {
  //         /* --- UPDATE CASE --- */
  //         setPropertyList((prevList) =>
  //           prevList.map((item) =>
  //             item.PropertyTypeID === newOrUpdatedRecord.PropertyTypeID ? newOrUpdatedRecord : item
  //           )
  //         );
  //       }
  
  //       handelClearClick(); 
  //     } else {
  //       setReceivedMessage(result.message || 'Error');
  //       setSnackbarSeverity('error');
  //       setSnackbarOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Save Error:", error);
  //   }
  // };
  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(propertyList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Property List');
    XLSX.writeFile(wb, 'Property_List.xlsx');
  };
  useEffect(() => {
    setAllChecked(selectedRows.length === propertyList.length && selectedRows.length > 0);
    setIndeterminate(selectedRows.length > 0 && selectedRows.length < propertyList.length);
  }, [selectedRows, propertyList]);

  //checkbox
  const handleCheckboxChange = (event, property) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, property]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((property) => property.PropertyTypeID !== property.PropertyTypeID));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(propertyList);
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
        <MainCard title="Property Description">
       <Grid container spacing={3} mt={3} justifyContent="center">
  <Grid item xs={12} md={10}>
    <Grid container spacing={2} alignItems="center">
      {/* Property Description */}
      <Grid item xs={12} sm={4}>
        <Stack spacing={1}>
          <InputLabel sx={{ fontWeight: 'bolder' }}>Property Description</InputLabel>
          <TextField
            name="PropertyDescription"
            value={propertyData.PropertyDescription}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.PropertyDescription}
            helperText={errors.PropertyDescription}
            FormHelperTextProps={{ style: { color: 'red' } }}
            disabled={accessLevel < 3}
          />
        </Stack>
      </Grid>

      {/* Type */}
      <Grid item xs={12} sm={4}>
        <Stack spacing={1}>
          <InputLabel sx={{ fontWeight: 'bolder' }}>Type</InputLabel>
          <Select
            labelId="type-of-use"
            id="type-of-use"
            value={propertyData.Type}
            onChange={(e) => setPropertyData({ ...propertyData, Type: e.target.value })}
            name="Type"
            fullWidth
            error={!!errors.Type}
            helperText={errors.Type}
            FormHelperTextProps={{ style: { color: 'red' } }}
            disabled={accessLevel < 3}
          >
            <MenuItem value="" disabled>
              Select Type of Use
            </MenuItem>
            {typeofusePropertyList.map((type) => (
              <MenuItem key={type.ID} value={type.Type}>
                {type.Description}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Grid>

      {/* Tax */}
      <Grid item xs={12} sm={4}>
        <Stack spacing={1}>
          <InputLabel sx={{ fontWeight: 'bolder' }}>Tax</InputLabel>
          <TextField
            name="Tax"
            value={propertyData.Tax}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.Tax}
            helperText={errors.Tax}
            FormHelperTextProps={{ style: { color: 'red' } }}
            disabled={accessLevel < 3}
          />
        </Stack>
      </Grid>
    </Grid>
  </Grid>
</Grid>


          <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
            <Grid item>
              <Button variant="contained" color="success" onClick={handleSaveProperty} disabled={accessLevel < 3}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handelClearClick} disabled={accessLevel < 3}>
                Clear
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={handleDeleteProperty} disabled={accessLevel < 4}>
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="warning" onClick={handleExportToExcel} disabled={accessLevel < 3}>
                Excel
              </Button>
            </Grid>
          </Grid>
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Rate List:
          </Typography>
          <TableContainer
            sx={{ mt: 3, height: '300px' ,overflow: 'auto',position: 'relative'}}
            style={{ backgroundColor: handleRowClick?.PropertyTypeGroupID === handleRowClick.PropertyTypeGroupID ? 'inherit' : '#D3D3D3' }}
          >
<Table stickyHeader>
<TableHead >
  <TableRow 
  sx={{ 
    width: '1vw', 
    position: 'sticky', 
    top: 0, 
    zIndex: 10 
  }}
  >
    <TableCell>
      <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={handleSelectAll} />
    </TableCell>
    <TableCell>Edit</TableCell>
    <TableCell>Property Type Id</TableCell>
    <TableCell>Property Description</TableCell>
    <TableCell>Type Description</TableCell>
    <TableCell>Tax</TableCell>
  </TableRow>
</TableHead>

              <TableBody>
                {propertyList.map((property, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(property)}
                        onChange={(event) => handleCheckboxChange(event, property)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton
                        color={propertyData.PropertyTypeID === property.PropertyTypeID ? 'success' : 'primary'}
                        onClick={() => handleRowClick(property)}
                        disabled={accessLevel < 3}
                      >
                        {propertyData.PropertyTypeID === property.PropertyTypeID ? <SendOutlined /> : <EditTwoTone />}
                      </IconButton>
                    </TableCell>
                    {/* <TableCell>
  {typeofusePropertyList.find((type) => type.Type === property.Type)?.ID}
</TableCell> */}
<TableCell>
          {property.PropertyTypeID}
        </TableCell>
                    <TableCell>{property.PropertyDescription}</TableCell>
                    <TableCell>{typeofusePropertyList.find((type) => type.Type === property.Type)?.Type}</TableCell>
                    <TableCell>{property.Tax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
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
        </MainCard>
      )}
    </>
  );
}

export default PropertyType;
