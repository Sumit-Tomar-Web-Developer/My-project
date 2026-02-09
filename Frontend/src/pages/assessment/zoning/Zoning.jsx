


import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Stack,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  SnackbarContent
} from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import MainCard from 'components/MainCard';
import { getZoneMasterList } from 'services/masterServices/zone-master-services.js/zone-master-services';
import { fetchPropertyRange, fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { postWardSelection } from 'services/wardnumber.services';
import { updateYearWiseZone, updateZone } from 'services/assessmentService/zoning.service';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

const Zoning = () => {
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');

  const [zoneList, setZoneList] = useState([]);
  const [zoneYearList, setZoneYearList] = useState([]);
  const [yearWardNo, setYearWardNo] = useState([]);

  const [NewWardList, setNewWardList] = useState([]);
  const [NewPropertyNo, setNewPropertyNo] = useState([]);
  const [NewPropertyTo, setNewPropertyTo] = useState([]);
  const [propertyRangeTable, setPropertyRangeTable] = useState([]);
  const [zoneRangeValues, setZoneRangeValues] = useState([]);

  // const [zoneList, setZoneList] = useState([]);
  const loggedInUserName = useSelector(
    (state) => state.newUserDetails.initialUserData.name
  );
  console.log(loggedInUserName)

  const loggedInUserID = useSelector(
    (state) => state.newUserDetails.initialUserData.UserID
  );
  const [propertyRange, setPropertyRange] = useState([]);

  const [zoningData, setZoningData] = useState({
    ZoneNo: 0,
    WardNo: '',
    FromProperty: '',
    ToProperty: ''
  });

  const [yearData, setYearData] = useState({
    Year: '',
    ZoneNos: '',
    MainZoneNo: '',
    WardNos: '',
    MinValue: '',
    MaxValue: ''
  });

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Zoning';
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
      console.log(access, 'assigned access to Zoning Page');
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

  const fetchZoneMaster = async () => {
    try {
      const response = await getZoneMasterList();
      console.log(response, 'response');
      const fetchedZoneList = response.zoneList;
      console.log(fetchedZoneList, 'zone');
      setZoneList(fetchedZoneList);
      setZoneYearList(fetchedZoneList);
    } catch (error) {
      console.error('Error fetching Zone Master:', error);
      setZoneList([]);
    }
  };

  useEffect(() => {
    fetchZoneMaster();
  }, []);

  useEffect(() => {
    fetchWards()
      .then((wards) => {
        setNewWardList(wards);
        setYearWardNo(wards);
      })
      .catch((error) => {
        console.error('Error fetching wards:', error);
      });
  }, []);
  //validation
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validationSchema = Yup.object().shape({
    ZoneNo: Yup.string().required('Zone No is required'),
    WardNo: Yup.string().required(' Ward No is required'),
    FromProperty: Yup.string().required('From Property is required'),
    ToProperty: Yup.string().required('To Property is required')
  });

  const handleInputChange = async (event) => {
    const { name, value } = event.target;

    // Update zoning data with the new value
    setZoningData((prevData) => ({
      ...prevData,
      [name]: name === 'FromProperty' || name === 'ToProperty' ? parseInt(value) : value
    }));

    if (name === 'FromProperty' || name === 'ToProperty') {
      const fromValue = name === 'FromProperty' ? parseInt(value) : zoningData.FromProperty;
      const toValue = name === 'ToProperty' ? parseInt(value) : zoningData.ToProperty;

      if (fromValue && toValue && fromValue > toValue) {
        alert('From Property must be less than or equal to To Property');
      }
    }

    if (name === 'WardNo') {
      try {
        const response = await postWardSelection(value);
        const properties = response.properties;

        if (Array.isArray(properties) && properties.length > 0) {
          const newPropertyNos = properties.map((prop) => ({
            NewPropertyNo: prop.NewPropertyNo,
            NewPropertyTo: prop.NewPropertyNo
          }));
          setNewPropertyNo(newPropertyNos);
          setNewPropertyTo(newPropertyNos);
        } else {
          setNewPropertyNo([]);
          setNewPropertyTo([]);
        }
      } catch (error) {
        console.error('Error posting ward No.:', error);
        setNewPropertyNo([]);
        setNewPropertyTo([]);
      }
    }
  };
 
  
  // const handleSave = async () => {
  //   const range = [
  //     {
  //       ZoneNo: zoningData.ZoneNo,
  //       NewWardNo: zoningData.WardNo,
  //       FromProperty: parseInt(zoningData.FromProperty),
  //       ToProperty: parseInt(zoningData.ToProperty)
  //     }
  //   ];
  
  //   try {
  //     // Validate zoning data
  //     await validationSchema.validate(zoningData, { abortEarly: false });
  
  //     // Call API to update zone
  //     const response = await updateZone({
  //       ...zoningData,
  //       UserID: loggedInUserID // pass current logged-in user ID
  //     });
  
  //     if (response.status === 200 || response.status === 201) {
  //       // Show success message
  //       setReceivedMessage(response.message || 'Zone No saved successfully');
  //       setSnackbarSeverity('success');
  //       setSnackbarOpen(true);
  
  //       // Update table data with Role and previousZone
  //       const updatedRange = range.map((item) => ({
  //         ...item,
  //         role: loggedInUserName || '', // show logged-in user name
  //         previousZone: '' // you can set previousZone if needed
  //       }));
  
  //       setPropertyRangeTable(updatedRange);
  
  //       // Reset form
  //       setZoningData({
  //         ZoneNo: '',
  //         WardNo: '',
  //         FromProperty: '',
  //         ToProperty: ''
  //       });
  //       setErrors({});
  //     } else {
  //       setReceivedMessage(response.message || 'An error occurred while updating Zone No');
  //       setSnackbarSeverity('error');
  //       setSnackbarOpen(true);
  //     }
  //   } catch (validationErrors) {
  //     if (validationErrors.inner && validationErrors.inner.length > 0) {
  //       const formattedErrors = validationErrors.inner.reduce((acc, err) => ({
  //         ...acc,
  //         [err.path]: err.message
  //       }), {});
  //       setErrors(formattedErrors);
  //     } else {
  //       console.error('Validation Error:', validationErrors);
  //     }
  //   }
  // };
  
  

  
  // const handleSave = async () => {
  //   const range = [
  //     {
  //       ZoneNo: zoningData.ZoneNo,
  //       NewWardNo: zoningData.WardNo,
  //       FromProperty: parseInt(zoningData.FromProperty),
  //       ToProperty: parseInt(zoningData.ToProperty)
  //     }
  //   ];

  //   setPropertyRangeTable(range);
  //   console.log(range, 'propertyRangeTable');

  //   try {
  //     await validationSchema.validate(zoningData, { abortEarly: false });

  //     const response = await updateZone(zoningData);

  //     console.log('Zone updated successfully:', response);
  //     if (response.status === 200 || response.status === 201) {
  //       setReceivedMessage(response.message);
  //       setSnackbarSeverity('success');
  //       setSnackbarOpen(true);
  //       setSnackbarMessage(response.message || 'Zone No saved successfully');

  //       setZoningData({
  //         ZoneNo: '',
  //         WardNo: '',
  //         FromProperty: '',
  //         ToProperty: ''
  //       });
  //       setErrors({});
  //     } else {
  //       setReceivedMessage(response.message || 'An error occurred while creating the Zone No');
  //       setSnackbarSeverity('error');
  //       setSnackbarOpen(true);
  //       setSnackbarMessage(response.message || 'An error occurred while saving Zone Data');
  //       setErrors({});

  //       setZoningData({
  //         ZoneNo: '',
  //         WardNo: '',
  //         FromProperty: '',
  //         ToProperty: ''
  //       });
  //     }
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
  const handleSave = async () => {
    try {
      // Validate zoning data
      await validationSchema.validate(zoningData, { abortEarly: false });
  
      // Store previous ZoneNo for table
      const previousZone = propertyRangeTable.length > 0 
        ? propertyRangeTable[propertyRangeTable.length - 1].ZoneNo 
        : '';
  
      // Call API to update zone
      const response = await updateZone({
        ...zoningData,
        UserID: loggedInUserID // pass logged-in user ID
      });
  
      if (response.status === 200 || response.status === 201) {
        // Show success message
        setReceivedMessage(response.message || 'Zone No saved successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
  
        // Update table data with Role and Previous Zone
        const updatedRange = [
          ...propertyRangeTable,
          {
            ZoneNo: zoningData.ZoneNo,
            NewWardNo: zoningData.WardNo,
            FromProperty: parseInt(zoningData.FromProperty),
            ToProperty: parseInt(zoningData.ToProperty),
            role: loggedInUserName || '',
            previousZone: previousZone
          }
        ];
  
        setPropertyRangeTable(updatedRange);
  
        // Reset form
        setZoningData({
          ZoneNo: '',
          WardNo: '',
          FromProperty: '',
          ToProperty: ''
        });
        setErrors({});
      } else {
        setReceivedMessage(response.message || 'An error occurred while updating Zone No');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (validationErrors) {
      if (validationErrors.inner && validationErrors.inner.length > 0) {
        const formattedErrors = validationErrors.inner.reduce((acc, err) => ({
          ...acc,
          [err.path]: err.message
        }), {});
        setErrors(formattedErrors);
      } else {
        console.error('Validation Error:', validationErrors);
      }
    }
  };
  
  const handleClear = () => {
    setZoningData({
      ZoneNo: '',
      WardNo: '',
      FromProperty: '',
      ToProperty: ''
    });
    setPropertyRangeTable([]);
  };
  const handleExport = () => {
    const tableData = propertyRangeTable.map(row => [
      row.role,
      row.previousZone,
      row.ZoneNo,
      row.NewWardNo,
      row.FromProperty,
      row.ToProperty
    ]);
  
    // Worksheet create
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Ward Wise Zoning"], // Title
      ["User Name","Previous Zone","Zone No", "Ward No", "From Property", "To Property"], // Headers
      ...tableData
    ]);
  
    // Merge cells for title
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } } // Merge A1:D1
    ];
  
    // Title cell styling (center + bold)
    if (!worksheet['A1'].s) worksheet['A1'].s = {};
    worksheet['A1'].s = {
      font: { bold: true, sz: 25, color: { rgb: "0000FF" } },
      alignment: { horizontal: "center",vertical: "center" }
    };
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ward Wise Zoning");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Ward_Wise_Zoning.xlsx");
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
        <MainCard title="Zoning">
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={5} lg={6}>
              <MainCard>
                <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Ward Wise Zoning
                </Typography>
                <List sx={{ p: 0 }}>
                  <ListItem divider>
                    <ListItemText primary="Zone No." />
                    <Select
                      sx={{ minWidth: '100px' }}
                      value={zoningData.ZoneNo}
                      onChange={handleInputChange}
                      name="ZoneNo"
                      error={!!errors.ZoneNo}
                      helperText={errors.ZoneNo}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                      }}
                    >
                      <MenuItem value={0} disabled>
                        Select
                      </MenuItem>
                      {zoneList.map((zone, index) => (
                        <MenuItem key={index} value={zone.ZoneNo}>
                          {zone.ZoneNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </ListItem>
                  <ListItem divider>
                    <ListItemText primary="Ward No." />
                    <Select
                      sx={{ minWidth: '100px' }}
                      value={zoningData.WardNo}
                      onChange={handleInputChange}
                      name="WardNo"
                      error={!!errors.WardNo}
                      helperText={errors.WardNo}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, 
                          },
                        },
                      }}
                    >
                     {[...NewWardList]
  .sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo))
  .map((ward, index) => (
    <MenuItem key={index} value={ward.NewWardNo}>
      {ward.NewWardNo}
    </MenuItem>
))}

                    </Select>
                  </ListItem>
                  <ListItem divider>
                    <ListItemText primary="Property No." />
                    <Select
                      sx={{ minWidth: '100px' }}
                      value={zoningData.FromProperty}
                      onChange={handleInputChange}
                      name="FromProperty"
                      error={!!errors.FromProperty}
                      helperText={errors.FromProperty}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                       MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 200,
      },
    },
  }}
                    >
                      {NewPropertyNo.map((property, index) => (
                        <MenuItem key={index} value={property.NewPropertyNo}>
                          {property.NewPropertyNo}
                        </MenuItem>
                      ))}
                    </Select>
                    <span style={{ margin: '10px' }}>To</span>
                    <Select
                      sx={{ minWidth: '100px' }}
                      value={zoningData.ToProperty}
                      onChange={handleInputChange}
                      name="ToProperty"
                      error={!!errors.ToProperty}
                      helperText={errors.ToProperty}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      disabled={accessLevel < 3}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,                          },
                        },
                      }}
                    >
                      {NewPropertyTo.map((property, index) => (
                        <MenuItem key={index} value={property.NewPropertyNo}>
                          {property.NewPropertyNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </ListItem>
                </List>
                <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                    <Button variant="contained" onClick={handleSave} disabled={accessLevel < 3}>
                      Update
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleClear} disabled={accessLevel < 3}>
                      Clear
                    </Button>
                    <Button variant="contained"   onClick={handleExport}
disabled={accessLevel < 3}>
                       Export
                     </Button>
                  </Stack>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={6}>
              <MainCard>
                <TableContainer style={{ height: '34vh', overflow: 'auto', marginTop: 20 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User Name</TableCell>
                        <TableCell>Previous Zone</TableCell>
                        <TableCell>Zone</TableCell>
                        <TableCell>Ward</TableCell>
                        <TableCell>From Property</TableCell>
                        <TableCell>To Property</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {propertyRangeTable.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>{row.role}</TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>{row.previousZone}</TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>{row.ZoneNo}</TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>{row.NewWardNo}</TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>{row.FromProperty}</TableCell>
                          <TableCell align="center" sx={{ verticalAlign: 'middle' }}>{row.ToProperty}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </MainCard>
            </Grid>
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
              message={receivedMessage}
            />
          </Snackbar>
        </MainCard>
      )}
    </>
  );
};

export default Zoning;