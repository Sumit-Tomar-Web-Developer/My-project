import { Grid, InputLabel, Select, Stack, Snackbar, SnackbarContent, TextField, MenuItem, Button, Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';

import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import {
  getBillBookYearRange,
  getInvoiceStatusWithYear,
  getYearRangeWiseReceiptBillNo,
  insertSetRemarkInvoice
} from 'services/Amc/SetRemarkInvoiceService/setReamarkInvoiceService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function SetRemarkForInvoice() {
  const [receivedMessage, setReceivedMessage] = useState('');
  const [yearOptions, setYearOptions] = useState([]);
  const [billBookOptions, setBillBookOptions] = useState([]);
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [previousStatus, setPreviousStatus] = useState('Not Set');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [remarkInvoice, setRemarkInvoice] = useState({
    Year: '',
    billBookNo: '',
    invoice: '',
    status: '',
    reason: ''
  });

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Set Remark For Invoice';
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
      console.log(access, 'assigned access to Set Remark For Invoice Page');
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
  const fetchYear = async () => {
    try {
      const response = await getBillBookYearRange();
      setYearOptions(response);
    } catch (error) {
      console.error('Error fetching year list:', error);
      setYearOptions([]);
    }
  };

  useEffect(() => {
    fetchYear();
  }, []);

  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    setRemarkInvoice((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));

    if (name === 'Year' && value) {
      try {
        const response = await getYearRangeWiseReceiptBillNo(value);
        setBillBookOptions(response.map((item) => item.BillBookNo));
        setInvoiceOptions(
          response.flatMap((item) => Array.from({ length: item.ReceiptNoTo - item.ReceiptNoFrom + 1 }, (_, i) => item.ReceiptNoFrom + i))
        );
      } catch (error) {
        console.error('Error fetching bill book options:', error);
      }
    }

    if (name === 'invoice' && value) {
      try {
        const prevStatus = await getInvoiceStatusWithYear(value, remarkInvoice.Year);
        setPreviousStatus(prevStatus?.Status === true ? 'Active' : prevStatus?.Status === false ? 'Cancel' : 'Not Set');
      } catch (error) {
        console.error('Error fetching previous status:', error);
        setPreviousStatus('Error fetching status');
      }
    }

    if (name === 'status') {
      setPreviousStatus(value === 1 ? 'Cancel' : 'Active');
    }
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!remarkInvoice.Year) tempErrors.Year = 'Please select a financial year.';
    if (!remarkInvoice.billBookNo) tempErrors.billBookNo = 'Please select a bill book number.';
    if (!remarkInvoice.invoice) tempErrors.invoice = 'Please select an invoice number.';
    if (remarkInvoice.status === '') tempErrors.status = 'Please select a status.';
    if (!remarkInvoice.reason) tempErrors.reason = 'Please provide a reason for canceling the invoice.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in constr  page');
  }, [userData])
  const handleSave = async () => {
    if (!validateFields()) return;

    const invoiceData = {
      Year: remarkInvoice.Year,
      BillBookNo: remarkInvoice.billBookNo,
      InvoiceNo: remarkInvoice.invoice,
      Status: remarkInvoice.status,
      Reason: remarkInvoice.reason,
      PreviousReason: previousStatus,
      UserID: userData?.UserID || 1

    };

    try {
      const response = await insertSetRemarkInvoice(invoiceData);
      setSnackbarSeverity('success');
      setSnackbarMessage(response?.message || 'Invoice saved successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarSeverity('error');
      console.error('Error saving invoice:', err);
      setSnackbarMessage(err?.response?.data?.error || 'An unexpected error occurred. Please try again.');
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
        <MainCard title="Set Remark for Invoice">
          <Box justifyContent="center">
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>Financial Year</InputLabel>
                  <Select
                    value={remarkInvoice.Year || ''}
                    onChange={handleInputChange}
                    name="Year"
                    required
                    error={!!errors.Year}
                    disabled={accessLevel < 3}
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

              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>Bill Book No</InputLabel>
                  <Select
                    required
                    name="billBookNo"
                    value={remarkInvoice.billBookNo || ''}
                    onChange={handleInputChange}
                    error={!!errors.billBookNo}
                    disabled={accessLevel < 3}
                  >
                    <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    {billBookOptions.map((bill) => (
                      <MenuItem key={bill} value={bill}>
                        {bill}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>Invoice No</InputLabel>
                  <Select
                    required
                    name="invoice"
                    value={remarkInvoice.invoice || ''}
                    onChange={handleInputChange}
                    error={!!errors.invoice}
                    disabled={accessLevel < 3}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 5, 
                          width: 250
                        }
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    {invoiceOptions.map((invoice) => (
                      <MenuItem key={invoice} value={invoice}>
                        {invoice}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    id="remark-select"
                    value={remarkInvoice.status}
                    onChange={handleInputChange}
                    name="status"
                    error={!!errors.status}
                    disabled={accessLevel < 3}
                  >
                    <MenuItem value={0}>Active</MenuItem>
                    <MenuItem value={1}>Cancel</MenuItem>
                  </Select>
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={1} justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={4}>
                <Stack spacing={1}>
                  <InputLabel>Reason for Cancel Invoice</InputLabel>
                  <TextField
                    required
                    name="reason"
                    value={remarkInvoice.reason}
                    onChange={handleInputChange}
                    error={!!errors.reason}
                    disabled={accessLevel < 3}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Stack spacing={1}>
                  <InputLabel>Previous Invoice Status</InputLabel>
                  <Typography variant="body2" style={{ color: 'red' }}>
                    {previousStatus}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent="center" marginTop={2}>
              <Grid item sm={2}>
                <Button variant="contained" color="success" onClick={handleSave} disabled={accessLevel < 3}>
                  Set
                </Button>
              </Grid>
              <Grid item sm={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setRemarkInvoice({
                      Year: '',
                      billBookNo: '',
                      invoice: '',
                      status: '',
                      reason: ''
                    });
                    setPreviousStatus('Not Set');
                    setErrors({});
                  }}
                  disabled={accessLevel < 3}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>

            {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <SnackbarContent
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}

            style={{ backgroundColor: snackbarSeverity === 'error' ? 'red' : 'green' }}
          />
        </Snackbar> */}

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
                message={snackbarMessage}
              />
            </Snackbar>
          </Box>
        </MainCard>
      )}
    </>
  );
}

export default SetRemarkForInvoice;
