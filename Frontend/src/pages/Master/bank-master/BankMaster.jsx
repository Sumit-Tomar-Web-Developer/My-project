import { CheckCircleOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Card,
  CardContent,
  Snackbar,
  SnackbarContent,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions
} from '@mui/material';
import MainCard from 'components/MainCard';
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { deleteBankInfo, getBankInfo, saveOrUpdateBankInfo } from 'services/masterServices/bank-masterServices/bank-master.services';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function BankMaster() {
  const [bankDataList, setBankDataList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [bankData, setBankData] = useState({
    BankName: '',
    Address: '',
    BankID: '0',
    Phone: ''
  });

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Bank Master';
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
      console.log(access, 'assigned access to Bank Master Page');
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
    fetchBankList();
  }, []);

  // bank checkbox
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = bankDataList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, bankDataList]);

  const fetchBankList = async () => {
    try {
      const fetchedBankList = await getBankInfo();
      setBankDataList(fetchedBankList);
      console.log('Bank List:', fetchedBankList);
    } catch (error) {
      console.error('Error fetching Bank list:', error);
      setBankDataList([]);
    }
  };

  const handleClearClick = () => {
    setBankData({
      BankName: '',
      Address: '',
      BankID: '0',
      Phone: ''
    });
    setSelectedRow(null);
  };

  const handleRowClick = (bank) => {
    setBankData(bank);
    setSelectedRow(bank);
  };

  const validationSchema = Yup.object().shape({
    BankName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Bank Name should only contain alphabets and spaces')
      .required('Bank Name is required'),
    Address: Yup.string().required('Address is required'),
    Phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone No. should be exactly 10 digits')
      .required('Phone is required')
  });
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in constr  page');
  }, [userData])
  // const handleSave = async () => {
  //   try {
  //     await validationSchema.validate(bankData, { abortEarly: false });
  //     console.log(bankData, 'dataResponse');

  //     let response;
  //     if (bankData.BankID === '0') {
  //       response = await saveOrUpdateBankInfo(bankData);
  //       if (response.status === 200 || response.status === 201) {
  //         console.log(response, 'id fetch');

  //         setReceivedMessage('Bank created successfully');
  //         setSnackbarSeverity('success');
  //         setSnackbarOpen(true);
  //         console.log(bankData, 'data Response');
  //         setBankDataList((bankDataList) => [...bankDataList, response.res.data.BankMasterInfo]);
  //         setSnackbarMessage(response.message || '  Bank master saved successfully');

  //         // setBankDataList([...bankDataList, response.res.data.BankMasterInfo]);
  //       } else {
  //         setReceivedMessage(response.message || 'An error occurred while creating the bank');
  //         setSnackbarSeverity('success');
  //         setSnackbarOpen(true);
  //       }
  //     } else {
  //       response = await saveOrUpdateBankInfo(bankData);
  //       if (response.status === 200 || response.status === 201) {
  //         setReceivedMessage('Bank updated successfully');
  //         setSnackbarSeverity('success');
  //         setSnackbarOpen(true);
  //         setBankDataList(
  //           bankDataList.map((bank) => (bank.BankID === response.res.data.BankMasterInfo.BankID ? response.res.data.BankMasterInfo : bank))
  //         );
  //       } else {
  //         setReceivedMessage(response.message || 'An error occurred while updating the bank');
  //         setSnackbarSeverity('success');
  //         setSnackbarOpen(true);
  //       }
  //     }
  //     fetchBankList();
  //     handleClearClick();
  //   } catch (validationErrors) {
  //     const formattedErrors = validationErrors.inner.reduce((acc, err) => {
  //       return { ...acc, [err.path]: err.message };
  //     }, {});
  //     setErrors(formattedErrors);
  //   }
  // };
  const handleSave = async () => {
    try {
      // 1. Payload with UserID
      const payload = {
        ...bankData,
        UserID: userData?.UserID || 0 
      };
  
      // 2. Validation
      await validationSchema.validate(bankData, { abortEarly: false });
      
      let response;
      // 3. API Call
      if (bankData.BankID === '0' || !bankData.BankID) {
        response = await saveOrUpdateBankInfo(payload); 
        if (response.status === 200 || response.status === 201) {
          setSnackbarSeverity('success'); 
          setReceivedMessage('Bank Master created successfully');
          setSnackbarOpen(true);
          setBankDataList((prevList) => [...prevList, response.res.data.BankMasterInfo]);
        } else {
          setSnackbarSeverity('success'); 
          setReceivedMessage(response.message || 'Error creating bank');
          setSnackbarOpen(true);
        }
      } else {
        response = await saveOrUpdateBankInfo(payload);
        if (response.status === 200 || response.status === 201) {
          setSnackbarSeverity('success'); // ✅ Update success green
          setReceivedMessage('Bank Master updated successfully');
          setSnackbarOpen(true);
          setBankDataList(prev => prev.map(b => b.BankID === response.res.data.BankMasterInfo.BankID ? response.res.data.BankMasterInfo : b));
        } else {
          setSnackbarSeverity('success');
          setReceivedMessage(response.message || 'Error updating bank/Duplicated entry');
          setSnackbarOpen(true);
        }
      } 
      
  
      fetchBankList();
      handleClearClick();
  
    } catch (validationErrors) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please fill all required fields correctly');
      setSnackbarOpen(true);
  
      if (validationErrors.inner) {
        const formattedErrors = validationErrors.inner.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {});
        setErrors(formattedErrors);
      }
    }
  };
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setBankData({
  //     ...bankData,
  //     [name]: value
  //   });
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Depending on the field name, apply specific validation
    switch (name) {
      case 'BankName':
        // Allow only alphabets and spaces
        const bankNameValue = value.replace(/[^A-Za-z\s]/g, '');
        setBankData({
          ...bankData,
          [name]: bankNameValue
        });
        break;
        break;
      case 'Address':
        // Allow any characters including symbols
        setBankData({
          ...bankData,
          [name]: value
        });
        break;
      case 'Phone':
        // Allow only digits and limit to 10 characters
        const phoneValue = value.replace(/\D/g, '').slice(0, 10);
        setBankData({
          ...bankData,
          [name]: phoneValue
        });
        break;
      default:
        setBankData({
          ...bankData,
          [name]: value
        });
        break;
    }
  };

  //checkbox
  const handleCheckboxChange = (event, bank) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, bank]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((selectedBank) => selectedBank.BankID !== bank.BankID));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(bankDataList);
    } else {
      setSelectedRows([]);
    }
  };

  //clear
  const handleDeleteBankMaster = async () => {
    try {
      const IDsToDelete = selectedRows.map((row) => row.BankID);

      if (IDsToDelete.length > 0) {
        const response = await deleteBankInfo(IDsToDelete);

        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        // setSnackbarMessage('Bank details deleted successfully');
        setSnackbarOpen(true);

        // Filter out deleted banks from the current bankDataList
        setBankDataList((prevBankDataList) => prevBankDataList.filter((bank) => !IDsToDelete.includes(bank.BankID)));

        setSelectedRows([]);
        handleClearClick(); // Optionally clear the form after deletion
      }
    } catch (error) {
      console.error('Error deleting bank information:', error);
      setSnackbarOpen(true);
      setReceivedMessage('Error deleting bank details');
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting bank details');
      handleClearClick();
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
        <MainCard title="Bank Master">
          <MainCard title="Bank Registration">
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6} sm={2.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Bank Name:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField
                        required
                        fullWidth
                        autoComplete="family-name"
                        placeholder="Enter Bank Name"
                        value={bankData.BankName}
                        name="BankName"
                        onChange={handleInputChange}
                        error={!!errors.BankName}
                        helperText={errors.BankName}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
                </Grid>

                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6} sm={2.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Address:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField
                        required
                        fullWidth
                        autoComplete="family-name"
                        placeholder="Enter Address"
                        value={bankData.Address}
                        onChange={handleInputChange}
                        name="Address"
                        error={!!errors.Address}
                        helperText={errors.Address}
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
                </Grid>

                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6} sm={2.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Phone No.:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField
                        required
                        fullWidth
                        autoComplete="family-name"
                        placeholder="Enter Phone No."
                        value={bankData.Phone}
                        name="Phone"
                        onChange={handleInputChange}
                        error={!!errors.Phone}
                        helperText={errors.Phone}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
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
                
                <Grid item xs={12} sm={2}  mb={1} container justifyContent="center" >
                  <Stack spacing={0}>
                    <Button variant="contained" color="success" onClick={handleSave} sx={{ mr: 3 }} disabled={accessLevel < 3}>
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
                </Grid>
                
                <Grid item xs={12} sm={2}  mb={1} container justifyContent="center">
                  <Stack spacing={2}>
                    <Button variant="contained" color="secondary" onClick={handleClearClick} disabled={accessLevel < 3}>
                      Clear
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={2}  mb={1} container justifyContent="center">
                  <Stack spacing={0}>
                    <Button variant="contained" color="error"
  onClick={() => setDeleteDialogOpen(true)}
  disabled={accessLevel < 4}>
                      Delete
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>

          <Box mb={3}></Box>

          <MainCard title="Bank Details">
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card>
                  <CardContent>
                    <Box sx={{ overflowX: 'auto', height: '400px', width: '750px', textAlign: 'center' }}>
                      <Table stickyHeader>
                        <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                          <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                            <TableCell>
                              <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={handleSelectAll} />
                            </TableCell>{' '}
                            <TableCell>Edit</TableCell>
                            <TableCell>Bank Name</TableCell>
                            <TableCell>Phone No.</TableCell>
                            <TableCell>Address</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bankDataList.map((bank) => (
                            <TableRow key={bank.BankID}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedRows.includes(bank)}
                                  onChange={(event) => handleCheckboxChange(event, bank)}
                                  onClick={(e) => e.stopPropagation()}
                                  disabled={accessLevel < 3}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  color={bankData.BankID === bank.BankID ? 'success' : 'primary'}
                                  onClick={() => handleRowClick(bank)}
                                  disabled={accessLevel < 3}
                                >
                                  {bankData.BankID === bank.BankID ? <SendOutlined /> : <EditTwoTone />}
                                </IconButton>
                              </TableCell>
                              <TableCell>{bank.BankName}</TableCell>
                              <TableCell>{bank.Phone}</TableCell>
                              <TableCell>{bank.Address}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </MainCard>
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
        handleDeleteBankMaster();
        setDeleteDialogOpen(false);
      }}
      style={{ backgroundColor: "red", color: "#fff"  }}    >
      Delete
    </Button>
  </DialogActions>
</Dialog>
        </MainCard>
      )}
    </>
  );
}

export default BankMaster;
