import React, { useEffect, useState } from 'react';

import MainCard from '../../../components/MainCard';
import {
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Button,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import * as yup from 'yup';
import {
  fetchMaintenanceList,
  updateMaintenanceList,
  deleteMaintenanceList
} from 'services/masterServices/maintenance-services/maintenance.services';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import set from 'date-fns/esm/set';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

const validationSchema = yup.object({
  year: yup
    .string()
    .required('Year is required')
    .matches(/^\d{4}$/, 'Year must be exactly 4 digits'),
  rate: yup.number().required('Rate is required').typeError('Rate must be a number')
});

function Maintenance() {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [selectedYear, setSelectedYear] = useState({
    ID: 0,
    year: '',
    rate: ''
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [errors, setErrors] = useState({});
  const [reloadPage, setReloadPage] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [receivedStatus, setReceivedStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchMaintenanceList()
      .then((response) => {
        setMaintenanceList(response);
        setReloadPage(false);
      })
      .catch((error) => {
        console.log('Error in fetching List', error);
      });
  }, [reloadPage]);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Maintenance';
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

      console.log(access, 'assigned access to Maintenance Page');

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

  const handleRowClick = (row) => {
    const isSelected = selectedRows.includes(row.ID);
    const newSelectedRows = isSelected ? selectedRows.filter((id) => id !== row.ID) : [...selectedRows, row.ID];

    setSelectedRows(newSelectedRows);

    if (!isSelected) {
      setSelectedYear({
        ID: row.ID,
        year: row.year,
        rate: row.rate
      });
    } else {
      setSelectedYear({
        ID: 0,
        year: '',
        rate: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If field is 'year', allow only digits and up to 4 digits
    if (name === 'year') {
      const onlyDigits = value.replace(/\D/g, ''); // remove non-digits
      const trimmed = onlyDigits.slice(0, 4);      // max 4 digits
      setSelectedYear((prevState) => ({
        ...prevState,
        [name]: trimmed
      }));
    } else {
      // for other fields, set normally
      setSelectedYear((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }

    setIsSaveDisabled(false);
  };

  const handleClear = () => {
    setSelectedYear({
      ID: 0,
      year: '',
      rate: ''
    });
    setErrors({});
    setSelectedRows([]);
  };

  const handleSave = async () => {
    try {
      await validationSchema.validate(selectedYear, { abortEarly: false });
      const { message, status } = await updateMaintenanceList(selectedYear);
      setReceivedMessage(message);
      setReceivedStatus(status);
      setSnackbarOpen(true);
      handleClear();
      setReloadPage(true);
    } catch (validationErrors) {
      const formattedErrors = validationErrors.inner.reduce((acc, err) => {
        return { ...acc, [err.path]: err.message };
      }, {});
      setErrors(formattedErrors);
    }
  };

  const handleDelete = async () => {
   if(selectedRows.length > 0){ try {
      await deleteMaintenanceList(selectedRows);
      setReceivedMessage('Maintenance master record deleted successfully');
      setReceivedStatus(200);
      setSnackbarOpen(true);
      setReloadPage(true);
      handleClear();
    } catch (error) {
      console.log('Error in deleting items', error);
      setReceivedMessage('Error deleting items');
      setReceivedStatus(500);
      setSnackbarOpen(true);
    }}
    else{
      setReceivedStatus(500);
      setReceivedMessage('Select at least one record to delete');
      setSnackbarOpen(true);
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
        <MainCard title="Maintenance Master">
          <Grid display={'flex'} justifyContent={'center'} mt={3}>
            <Grid item xs={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Year</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <TextField
                name="year"
                value={selectedYear.year}
                onChange={handleInputChange}
                error={!!errors.year}
                helperText={errors.year}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3}
              />
            </Grid>
            <Grid item xs={3} ml={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Rate</InputLabel>
            </Grid>
            <Grid item xs={3} ml={2}>
              <TextField
                name="rate"
                value={selectedYear.rate}
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^\d{0,2}(\.\d{0,2})?$/.test(value)) {
                    setSelectedYear((prev) => ({ ...prev, rate: value }));
                  }
                }}
                error={!!errors.rate}
                helperText={errors.rate}
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
              <Button variant="contained" color="error" onClick={handleDelete} disabled={accessLevel < 4}>
                Delete
              </Button>
            </Grid>
            <Grid mt={3}></Grid>
          </Grid>
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Rate List:
          </Typography>
          <TableContainer sx={{ mt: 3 }}>
            <Table style={{ margin: '0 auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '1vw' }}>
                    <Checkbox
                      checked={selectedRows.length > 0 && selectedRows.length === maintenanceList.length}
                      indeterminate={selectedRows.length > 0 && selectedRows.length < maintenanceList.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(maintenanceList.map((row) => row.ID));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                      disabled={accessLevel < 3}
                    />
                  </TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenanceList.map((row) => (
                  <TableRow key={row.ID} onClick={() => handleRowClick(row)}>
                    <TableCell>
                      <Checkbox checked={selectedRows.includes(row.ID)} onChange={() => handleRowClick(row)} disabled={accessLevel < 3} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color={selectedYear?.ID === row.ID ? 'success' : 'primary'}
                        onClick={() => handleRowClick(row)}
                        disabled={accessLevel < 3}
                      >
                        {selectedYear?.ID === row.ID ? <SendOutlined /> : <EditTwoTone />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.rate}</TableCell>
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
            <Alert
              onClose={handleCloseSnackbar}
              severity={receivedStatus == 200 || receivedStatus == 201 ? 'success' : receivedStatus == 202 ? 'info' : 'error'}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {receivedMessage}
            </Alert>
          </Snackbar>
        </MainCard>
      )}
    </>
  );
}

export default Maintenance;
