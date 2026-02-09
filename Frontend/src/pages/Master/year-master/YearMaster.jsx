import React from 'react';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import {
  Alert,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { Typography, Button } from '@mui/material';
import MainCard from '../../../components/MainCard';
import { useState, useEffect } from 'react';
import {
  deleteYearMaster,
  getYearMaster,
  saveAndUpdateYearMaster
} from '../../../services/masterServices/yearMasterService/yearMaster.service';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';

function YearMaster() {
  const [yearList, setYearList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [yearData, setYearData] = useState({ FinanceYear: '' });
  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Year Master';
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
      console.log(access, 'assigned access to Year master Page');
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
  useEffect(() => {
    const fetchYearList = async () => {
      try {
        const fetchedActive = await getYearMaster();
        setYearList(fetchedActive);
      } catch (error) {
        console.error('Error fetching active Year list:', error);
        setYearList([]);
      }
    };
    fetchYearList();
  }, []);
  //checkbox
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = yearList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, yearList]);

  const handleRowClick = (year) => {
    setSelectedRow(year);
    setYearData(year);
  };
  const handleClear = () => {
    setSelectedRow(null);
    setErrors({});
    setYearData({ FinanceYear: '' });
    setSelectedRows([])
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (/^\d{0,4}$/.test(value)) {
      setYearData({ ...yearData, [name]: value });
    }
  };

  const validationSchema = Yup.object().shape({
    FinanceYear: Yup.string().required('Finance Year is required')
  });
//d
const userData = useSelector((state) => state.newUserDetails.initialUserData);

useEffect(() => {
  console.log(userData, 'logged in user in constr  page');
}, [userData])

  const handleSave = async () => {
    const financeYearInt = parseInt(yearData.FinanceYear, 10);

    if (isNaN(financeYearInt) || financeYearInt <= 0 || yearData.FinanceYear.length !== 4) {
      setErrors({ FinanceYear: 'Finance Year must be a 4-digit number' });
      return;
    }

    try {
      await validationSchema.validate(yearData, { abortEarly: false });

      const response = await saveAndUpdateYearMaster({ FinanceYear: financeYearInt ,        UserID: userData?.UserID || 1
      });
      const updatedYearInfo = response.res.data.YearInfo;

      if (response.status === 200) {
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setYearList([...yearList, updatedYearInfo]);
        setYearData({ FinanceYear: '' });
        setErrors({});
      } else if (response.status === 202) {
        setReceivedMessage(response.message);
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        setYearList(yearList.map((year) => (year.FinanceYear === updatedYearInfo.FinanceYear ? updatedYearInfo : year)));
      }
    } catch (error) {
      console.error('Failed to save year info:', error);
    }
  };

  const handleDelete = async () => {
    const financeYearsToDelete = selectedRows
      .map((row) => parseInt(row.FinanceYear, 10))
      .filter((financeYear) => !isNaN(financeYear) && financeYear > 0);

    if (financeYearsToDelete.length === 0) {
      alert('Please select valid years to delete.');
      return;
    }

    try {
      const response = await deleteYearMaster(financeYearsToDelete);
      setYearList((yearList) => yearList.filter((year) => !financeYearsToDelete.includes(year.FinanceYear)));

      setReceivedMessage(response.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSelectedRows([]);
      handleClear();
    } catch (error) {
      console.error('Error deleting year information:', error);
      setSnackbarOpen(true);
      setReceivedMessage('Error deleting year details');
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting year details');
      handleClear();
    }
  };

  const handleCheckboxChange = (event, year) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, year]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((selectedYear) => selectedYear.ID !== year.ID));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(yearList);
    } else {
      setSelectedRows([]);
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
        <MainCard title="Year Master">
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Add New Year:
          </Typography>
          <Grid display={'flex'} justifyContent={'center'} mt={3}>
            <Grid item xs={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Financial Year</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2} mr={12}>
              <TextField
                placeholder="Year"
                name="FinanceYear"
                value={yearData.FinanceYear}
                onChange={handleInputChange}
                error={!!errors.FinanceYear}
                helperText={errors.FinanceYear}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
            <Grid item>
              <Button variant="contained" color="success" onClick={handleSave} disabled={accessLevel < 3}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handleClear} disabled={accessLevel < 3}>
                Clear
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error"   onClick={() => setShowDeleteDialog(true)}
 disabled={accessLevel < 4}>
                Delete
              </Button>
            </Grid>
            <Grid mt={3}></Grid>
          </Grid>
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Year List:
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TableContainer sx={{ mt: 3, width: '60%', height: '300px' ,overflow: 'auto'}}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                    <TableCell>
                      <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={handleSelectAll} />
                    </TableCell>
                    {/* <TableCell sx={{ pl: 3 }}>Edit</TableCell> */}
                    <TableCell sx={{ pl: 3 }}>Financial Year</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {yearList.map((year) => (
                    <TableRow key={year.ID}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(year)}
                          onChange={(event) => handleCheckboxChange(event, year)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      {/* <TableCell >
                  <IconButton color={yearData.ID === year.ID ? 'success' : 'primary'} onClick={() => handleRowClick(year)}>
                    {yearData.ID === year.ID ?  <EditTwoTone /> :<SendOutlined /> }
                  </IconButton>
                </TableCell> */}
                      <TableCell>{year.FinanceYear ?? 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Dialog
  open={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <Typography>
    <Typography>Are you sure you want to delete?</Typography>
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowDeleteDialog(false)} 
      style={{ backgroundColor: "black", color: "#fff"  }}    >
      Cancel
    </Button>
    <Button
      onClick={() => {
        handleDelete(); // Call your delete function
        setShowDeleteDialog(false); // Close dialog after delete
      }}
      style={{ backgroundColor: "red", color: "#fff"  }}    
    >
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
            <Alert onClose={handleCloseSnackbar} sx={{ width: '100%' }} severity={snackbarSeverity} variant="filled">
              {receivedMessage}
            </Alert>
          </Snackbar>
        </MainCard>
      )}
    </>
  );
}

export default YearMaster;
