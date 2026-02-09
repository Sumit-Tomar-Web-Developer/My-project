import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Typography, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import { deleteTaxList, getTaxList, postUpdateTaxList } from 'services/masterServices/tax-name-master-services/tax-name-master.services';
import * as Yup from 'yup';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function TaxName() {
  const [taxList, setTaxList] = useState([]);
  const [selectedTax, setSelectedTax] = useState({ ID: 0, TaxName: '', AliseName: '', Status: '' });
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [errors, setErrors] = useState({ TaxName: false, AliseName: false });
  const [reloadPage, setReloadPage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [receivedStatus, setReceivedStatus] = useState('');
  const [disableDeleteButton, setDisableDeleteButton] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Tax Name';
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
      console.log(access, 'assigned access to tax name Page');
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
    getTaxList().then((res) => setTaxList(res.data));
    setReloadPage(false);
  }, [reloadPage]);

  const handleRowClick = (tax) => {
    const isSelected = selectedRows.includes(tax.ID);
    const newSelectedRows = isSelected ? selectedRows.filter((id) => id !== tax.ID) : [...selectedRows, tax.ID];

    setSelectedRows(newSelectedRows);
    setSelectedTax(isSelected ? { ID: 0, TaxName: '', AliseName: '', Status: '' } : tax);
    setIsSaveEnabled(newSelectedRows.length > 0);
    setDisableDeleteButton(newSelectedRows.length === 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTax({ ...selectedTax, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    setIsSaveEnabled(true);
  };

  const handleSave = async () => {
    setDisableDeleteButton(true);
    if (selectedTax.TaxName && selectedTax.AliseName) {
      const { message, status } = await postUpdateTaxList(selectedTax);
      setReceivedStatus(status);
      setReceivedMessage(message);
      setReloadPage(true);
      setSelectedTax({ ID: 0, TaxName: '', AliseName: '', Status: '' });
      setIsSaveEnabled(false);
      setSnackbarSeverity(status === 200 ? 'success' : 'error');
      setSnackbarOpen(true);
    } else {
      setErrors({
        TaxName: selectedTax.TaxName === '',
        AliseName: selectedTax.AliseName === ''
      });
    }
  };

  const handleDelete = async () => {
    setDisableDeleteButton(true);
    try {
      const res = await deleteTaxList({ IDs: selectedRows });
      setReceivedStatus(res.status);
      setReceivedMessage('Items deleted successfully');
      setReloadPage(true);
      setSnackbarOpen(true);
      handleClear();
    } catch (error) {
      console.error('Error In deleting Tax Names');
      setReceivedStatus(500);
      setSnackbarSeverity('error');
    }
  };

  const handleClear = () => {
    setSelectedTax({ ID: 0, TaxName: '', AliseName: '', Status: '' });
    setErrors('');
    setIsSaveEnabled(false);
    setDisableDeleteButton(true);
    setSelectedRows([]);
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
        <MainCard title="Tax Name Master">
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Add Tax Name:
          </Typography>
          <Grid display={'flex'} justifyContent={'center'} mt={3}>
            <Grid item xs={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Tax Name</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <TextField
                name="TaxName"
                value={selectedTax.TaxName}
                onChange={handleInputChange}
                required
                error={errors.TaxName}
                helperText={errors.TaxName && 'Tax Name is required'}
                disabled={accessLevel < 3}
              />
            </Grid>
            <Grid item xs={3} ml={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Alias Name</InputLabel>
            </Grid>
            <Grid item xs={3} ml={2}>
              <TextField
                name="AliseName"
                value={selectedTax.AliseName}
                onChange={handleInputChange}
                required
                error={errors.AliseName}
                helperText={errors.AliseName && 'Alias Name is required'}
                disabled={accessLevel < 3}
              />
            </Grid>
            <Grid item xs={3} mt={1.5} ml={3}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Status</InputLabel>
            </Grid>
            <Grid item xs={1} ml={3}>
              <Select
                name="Status"
                value={selectedTax.Status || 0}
                onChange={handleInputChange}
                sx={{ minWidth: '12vw' }}
                required
                disabled={accessLevel < 3}
              >
                <MenuItem value={1}>True</MenuItem>
                <MenuItem value={0}>False</MenuItem>
              </Select>
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
          </Grid>
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Tax Name List:
          </Typography>
          <TableContainer sx={{ mt: 3, height: 300, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{
                  width: '1vw',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}>
                
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.length > 0 && selectedRows.length === taxList.length}
                        indeterminate={selectedRows.length > 0 && selectedRows.length < taxList.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(taxList.map((tax) => tax.ID));
                          } else {
                            setSelectedRows([]);
                          }
                        }}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Tax Name</TableCell>
                    <TableCell>Alias Name</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {taxList.map((tax) => (
                  <TableRow key={tax.ID}>
                    <TableCell>
                      <Checkbox checked={selectedRows.includes(tax.ID)} onChange={() => handleRowClick(tax)} disabled={accessLevel < 3} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color={selectedTax.ID === tax.ID ? 'success' : 'primary'}
                        onClick={() => handleRowClick(tax)}
                        disabled={accessLevel < 3}
                      >
                        {selectedTax.ID === tax.ID ? <SendOutlined /> : <EditTwoTone />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{tax.TaxName}</TableCell>
                    <TableCell>{tax.AliseName}</TableCell>
                    <TableCell>
                      {tax.Status == 1 ? (
                        <div
                          style={{
                            width: '80px',
                            height: '30px',
                            borderRadius: '5%',
                            backgroundColor: 'green',
                            color: 'white',
                            fontWeight: 'bolder',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          TRUE
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '80px',
                            height: '30px',
                            borderRadius: '5%',
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bolder',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          FALSE
                        </div>
                      )}
                    </TableCell>
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
              severity={receivedStatus === 200 || receivedStatus === 201 ? 'success' : receivedStatus === 202 ? 'info' : 'error'}
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

export default TaxName;
