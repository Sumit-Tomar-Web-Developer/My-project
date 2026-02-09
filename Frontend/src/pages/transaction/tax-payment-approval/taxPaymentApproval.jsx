// material-ui
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  SnackbarContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions

} from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { approvePayment, disapprovePayment, fetchPendingPayments, getPaymentProof, getfilterPaymentList } from '../../../services/transaction/taxPaymentApproval/taxPaymentApproval';
import { getFinanceYear } from 'services/utlilityService/AddTaxService/AddTaxService';

// project import
import MainCard from 'components/MainCard';
import { set } from 'lodash';
const labelStyle = {
  fontSize: "Medium",
  fontWeight: 'bold',
  color: 'red'
};

const valueStyle = {
  fontSize: 14,
  fontWeight: 500
};

function TaxPaymentApproval() {
  /* -------------------- STATE -------------------- */

  const [filterPaymentDetails, setFilterPaymentDetails] = useState({
    status: 'Pending',
    financeYearForFilter: '',
    fromDate: null,
    toDate: null,
    wardNo: '',
    propertyNo: ''
  });
  const [financeYearList, setFinanceYearList] = useState([]);
  const [showPaymentApproval, setShowPaymentApproval] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [pendingPaymentList, setPendingPaymentList] = useState([]);
  const [originalPendingPaymentList, setOriginalPendingPaymentList] = useState([]);
  const [taxesDetailsList, setTaxesDetailsList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [openDisapproveDialog, setOpenDisapproveDialog] = useState(false);
  const [disapproveRemark, setDisapproveRemark] = useState('');
  const [remarkError, setRemarkError] = useState(false);
  const [proofUrl, setProofUrl] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [openProofDialog, setOpenProofDialog] = useState(false);

  useEffect(() => {

  }, [
    taxesDetailsList,
    pendingPaymentList,
    selectedRow,
    showPaymentApproval
  ]);
  useEffect(() => {
    const fetchFinanceYears = async () => {
      const years = await getFinanceYear();
      setFinanceYearList(years);
    };
    fetchFinanceYears();
  }, []);
  /* -------------------- HANDLERS -------------------- */

  const handleSearchDetails = async () => {
    try {
      const res = await getfilterPaymentList(filterPaymentDetails);
      if (res.status === 200) {
        setPendingPaymentList(res.data || []);
      } else {
        setPendingPaymentList([]);
      }
    } catch (err) {
      console.error('Error fetching pending payments:', err);
    }


  };

  const handleClearDetails = () => {
    setFilterPaymentDetails({
      status: 'Pending',
      fromDate: null,
      toDate: null,
      wardNo: '',
      propertyNo: ''
    });
    setPendingPaymentList(originalPendingPaymentList);
  };

  /* -------------------- OPTIONAL AUTO LOAD -------------------- */
  useEffect(() => {
    const pendingPayments = async () => {
      const res = await fetchPendingPayments();
      console.log('Pending Payments Response:', res);
      if (res.status === 200) {
        setPendingPaymentList(res.data || []);
        setOriginalPendingPaymentList(res.data || [])
      } else {
        setPendingPaymentList([]);
      }
    }

    pendingPayments();
  }, []);
  const handleRefreshList = async () => {

    const res = await fetchPendingPayments();
    console.log('Pending Payments Response:', res);
    if (res.status === 200) {
      setPendingPaymentList(res.data || []);
      setOriginalPendingPaymentList(res.data || [])
    } else {
      setPendingPaymentList([]);
    }

  }

  useEffect(() => {
    if (selectedRow && Object.keys(selectedRow).length > 0) {
      const getPaymentProofDetails = async () => {
        const res = await getPaymentProof(selectedRow.MerchantTxnRefNumber);
        setProofUrl(res?.url);
        setMimeType(res?.mimeType);

      }
      getPaymentProofDetails();
    }
  }, [selectedRow]);
  const renderProof = () => {
    if (!proofUrl) return null;

    if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={proofUrl}
          width="100%"
          height="500px"
          style={{ border: 'none' }}
        />
      );
    }

    if (mimeType.startsWith('image/')) {
      return (
        <img
          src={proofUrl}
          alt="Payment Proof"
          style={{
            maxWidth: '100%',
            maxHeight: '500px',
            objectFit: 'contain'
          }}
        />
      );
    }

    return <Typography>Unsupported file type</Typography>;
  };


  const handleEditClick = (row) => {
    const filteredTaxesDetails = pendingPaymentList.filter(tax => tax.MerchantTxnRefNumber === row.MerchantTxnRefNumber);
    console.log('Filtered Taxes Details:', filteredTaxesDetails);
    setTaxesDetailsList(filteredTaxesDetails);
    setSelectedRow(row);
    setShowPaymentApproval(true);

  }

  const handleApprovePayment = async () => {

    try {
      const res = await approvePayment(selectedRow);
      if (res.status === 200) {
        setSnackbarSeverity('success');
        setReceivedMessage('Payment approved successfully');
        setSnackbarOpen(true);
        handleBackToList();
      } else {
        setSnackbarSeverity('error');
        setReceivedMessage('Failed to approve payment');
        setSnackbarOpen(true);
      }

    } catch (error) {
      console.error('Error approving payment', error);
    }
  }

  const handleDisApprovePayment = async () => {
    setSelectedRow((prev) => ({
      ...prev,
      RemarkForDisApproved: disapproveRemark
    }));
    try {
      const res = await disapprovePayment(selectedRow);
      if (res.status === 200) {
        setSnackbarSeverity('success');
        setReceivedMessage('Payment disapproved successfully');
        setSnackbarOpen(true);
        handleBackToList();
      } else {
        setSnackbarSeverity('error');
        setReceivedMessage('Failed to disapprove payment');
        setSnackbarOpen(true);
      }

    } catch (error) {
      console.error('Error disapproving payment', error);
    }
  }
  /* -------------------- UI -------------------- */
  const handleBackToList = () => {
    if (selectedRow?.Status !== 'Approved' && selectedRow?.Status !== 'Disapproved') {
      handleRefreshList();
    }
    setShowPaymentApproval(false);
    setSelectedRow(null);

  }

  return (
    <MainCard title="Tax Payment Approval">
      <Typography variant="h4" sx={{ mb: 3, color: 'blue', fontWeight: 'bold' }}>
        Payments For Approval
      </Typography>

      <Grid container spacing={3}>
        {/* LEFT */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Status</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <Select
                fullWidth
                value={filterPaymentDetails.status}
                onChange={(e) =>
                  setFilterPaymentDetails((p) => ({ ...p, status: e.target.value }))
                }
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Disapproved">Disapproved</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={4}>
              <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Ward No</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                size="small"
                value={filterPaymentDetails.wardNo}
                onChange={(e) =>
                  setFilterPaymentDetails((p) => ({ ...p, wardNo: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={4}>
              <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>From Date</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={
                    filterPaymentDetails.fromDate
                      ? dayjs(filterPaymentDetails.fromDate)
                      : null
                  }
                  onChange={(newValue) =>
                    setFilterPaymentDetails((p) => ({
                      ...p,
                      fromDate: newValue ? newValue.format('YYYY-MM-DD') : null
                    }))
                  }
                  maxDate={dayjs()}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

          </Grid>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Year</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <Select
                fullWidth
                value={filterPaymentDetails.financeYearForFilter}
                onChange={(e) => setFilterPaymentDetails((p) => ({ ...p, financeYearForFilter: e.target.value }))}
                menuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
              >
                {financeYearList.map((year) => (
                  <MenuItem key={year.FinanceYear} value={year.FinanceYear}>
                    {year.FinanceYear}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={4}>
              <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>Property No</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                size="small"
                value={filterPaymentDetails.propertyNo}
                onChange={(e) =>
                  setFilterPaymentDetails((p) => ({
                    ...p,
                    propertyNo: e.target.value
                  }))
                }
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel sx={{ mt: 1, fontWeight: 'bold' }}>To Date</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={
                    filterPaymentDetails.toDate
                      ? dayjs(filterPaymentDetails.toDate)
                      : null
                  }
                  onChange={(newValue) =>
                    setFilterPaymentDetails((p) => ({
                      ...p,
                      toDate: newValue ? newValue.format('YYYY-MM-DD') : null
                    }))
                  }
                  maxDate={dayjs()}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="center" mt={3} gap={3}>
        <Button variant="contained" onClick={handleSearchDetails}>
          Search
        </Button>
        <Button variant="contained" color="secondary" onClick={handleClearDetails}>
          Clear
        </Button>
      </Box>

      {!showPaymentApproval ? (
        <TableContainer sx={{ mt: 3, maxHeight: 400, overflowY: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead >
              <TableRow>

                <TableCell align="center"><b>OwnerID</b></TableCell>
                <TableCell align="center"><b>BillBookNo</b></TableCell>
                <TableCell align="center"><b>InvoiceNo</b></TableCell>
                <TableCell align="center"><b>MerchantTxnRefNumber</b></TableCell>
                <TableCell align="center"><b>FinanceYear</b></TableCell>
                <TableCell align="center"><b>PendingYear</b></TableCell>
                <TableCell align="center"><b>Transaction Date</b></TableCell>
                <TableCell align="center"><b>Amount</b></TableCell>
                <TableCell align="center"><b>Status</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody >
              {pendingPaymentList.length > 0 ? (
                pendingPaymentList.map((row, index) => (
                  <TableRow key={index} onClick={() => handleEditClick(row)} style={{ cursor: 'pointer' }}>

                    <TableCell align="center">{row?.OwnerID}</TableCell>
                    <TableCell align="center">{row?.BillBookNo}</TableCell>
                    <TableCell align="center">{row?.InvoiceNo}</TableCell>
                    <TableCell align="center">{row?.MerchantTxnRefNumber}</TableCell>
                    <TableCell align="center">{row?.FinanceYear}</TableCell>
                    <TableCell align="center">{row?.PendingYear}</TableCell>
                    <TableCell align="center">
                      {row?.TransactionDate
                        ? new Date(row.TransactionDate).toLocaleDateString()
                        : ''}
                    </TableCell>
                    <TableCell align="center">{row?.Amount}</TableCell>
                    <TableCell align="center">{row?.Status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>) : <>
        <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
          <Typography variant="h5" mb={2}>
            Owner Details
          </Typography>

          <Grid container spacing={4}>

            {/* ===== Transaction ID (Top – Separate) ===== */}
            <Grid item xs={4} display="flex" justifyContent="center">
              <TextField
                label="OwnerID"
                value={selectedRow?.OwnerID || ''}
                fullWidth

              />
            </Grid>

            {/* ===== Ward / Property / Partition (One Line) ===== */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4} display="flex" justifyContent="center">
                  <TextField
                    label="Ward No"
                    value={selectedRow?.propertymast.NewWardNo || ''}
                    fullWidth

                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label="Property No"
                    value={selectedRow?.propertymast.NewPropertyNo || ''}
                    fullWidth

                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label="Partition No"
                    value={selectedRow?.propertymast.NewPartitionNo || ''}
                    fullWidth

                  />
                </Grid>
              </Grid>
            </Grid>

            {/* ===== Tax Payer / Renter Name ===== */}
            <Grid item xs={6}>
              <TextField
                label="Tax Payer Name"
                value={selectedRow?.combinedownerrentername?.OwnerName || ''}
                fullWidth

              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Renter Name"
                value={selectedRow?.combinedownerrentername?.RenterName || ''}
                fullWidth

              />
            </Grid>

            {/* ===== Email / Mobile No ===== */}
            <Grid item xs={6}>
              <TextField
                label="Email"
                value={selectedRow?.propertymast?.EmailID || ''}
                fullWidth

              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Mobile No"
                value={selectedRow?.propertymast?.MobileNo || ''}
                fullWidth

              />
            </Grid>
            <Typography variant="h5" ml={4} mt={2} >
              Payment Details
            </Typography>


            <Box
              sx={{
                m: 4,
                display: 'grid',
                justifyContent: 'center',
                gap: 4,
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(7, 1fr)'
                },
                textAlign: 'center'
              }}
            >
              {[
                { label: 'Reference No', value: selectedRow?.MerchantTxnRefNumber },
                { label: 'Amount', value: selectedRow?.Amount },
                {
                  label: 'Transaction Date',
                  value: selectedRow?.TransactionDate
                    ? new Date(selectedRow.TransactionDate).toLocaleString()
                    : '-'
                },
                { label: 'BillBook No', value: selectedRow?.BillBookNo },
                { label: 'Invoice No', value: selectedRow?.InvoiceNo },
                { label: 'Payment Mode', value: selectedRow?.PaymentMode },
                { label: 'Payment Resource', value: selectedRow?.PaymentResource }
              ].map((item, index) => (
                <Box key={index}>
                  <InputLabel sx={labelStyle}>{item.label}</InputLabel>
                  <InputLabel sx={valueStyle}>{item.value || '-'}</InputLabel>
                </Box>
              ))}

              {/* VIEW PROOF BUTTON */}
              <Box
                sx={{
                  gridColumn: { xs: 'span 2', sm: 'span 3', md: 'span 4', lg: 'span 7' },
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => { setOpenProofDialog(true) }}
                >
                  View Payment Proof
                </Button>
              </Box>
            </Box>

            <Dialog open={openProofDialog} maxWidth="md" fullWidth>
              <DialogTitle>Payment Proof</DialogTitle>

              <DialogContent dividers>
                {renderProof()}
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpenProofDialog(false)}>Close</Button>
                <Button
                  onClick={() => window.open(proofUrl, '_blank')}
                  variant="contained"
                >
                  Open in New Tab
                </Button>
              </DialogActions>
            </Dialog>




          </Grid>
          <Typography variant="h5" mb={2}>
            Taxes Details
          </Typography>

          <TableContainer sx={{ mt: 3, maxHeight: 400, overflowY: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead >
                <TableRow>

                  <TableCell>Prop</TableCell>
                  <TableCell>Edu</TableCell>
                  <TableCell>Sp.Edu</TableCell>
                  <TableCell>Emp</TableCell>
                  <TableCell>Tree</TableCell>
                  <TableCell>Fire</TableCell>
                  <TableCell>Light</TableCell>
                  <TableCell>Drain</TableCell>
                  <TableCell>Road</TableCell>
                  <TableCell>Sanitation</TableCell>
                  <TableCell>W.Cess</TableCell>
                  <TableCell>W.Ben.</TableCell>
                  <TableCell>W.Bill</TableCell>
                  <TableCell>M Build</TableCell>
                  <TableCell>Sewage</TableCell>
                  <TableCell>Tax1</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Fin Year</TableCell>
                  <TableCell>Pend Year</TableCell>
                </TableRow>
              </TableHead>

              <TableBody >
                {taxesDetailsList.length > 0 ? (
                  taxesDetailsList.map((row, index) => (
                    <TableRow key={index} >

                      <TableCell align="center">{row.PropertyTax || 0}</TableCell>
                      <TableCell align="center">{row.EducationTax || 0}</TableCell>
                      <TableCell align="center">{row.SpEducationTax || 0}</TableCell>
                      <TableCell align="center">{row.EmploymentTax || 0}</TableCell>
                      <TableCell align="center">{row.TreeCess || 0}</TableCell>
                      <TableCell align="center">{row.FireCess || 0}</TableCell>
                      <TableCell align="center">{row.LightCess || 0}</TableCell>
                      <TableCell align="center">{row.DrainCess || 0}</TableCell>
                      <TableCell align="center">{row.RoadCess || 0}</TableCell>
                      <TableCell align="center">{row.Sanitation || 0}</TableCell>
                      <TableCell align="center">{row.SpWaterCess || 0}</TableCell>
                      <TableCell align="center">{row.WaterBenefit || 0}</TableCell>
                      <TableCell align="center">{row.WaterBill || 0}</TableCell>
                      <TableCell align="center">{row.MajorBuilding || 0}</TableCell>
                      <TableCell align="center">{row.SewageDisposalCess || 0}</TableCell>
                      <TableCell align="center">{row.Tax1 || 0}</TableCell>
                      <TableCell align="center">{row.Interest || 0}</TableCell>
                      <TableCell align="center">{row.TaxTotal || 0}</TableCell>
                      <TableCell align="center">{row.FinanceYear}</TableCell>
                      <TableCell align="center">{row.PendingYear}</TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>


          <Box display="flex" justifyContent="center" mt={3} gap={2}>

            <Button
              color='success'
              variant="contained"
              onClick={handleApprovePayment}
              disabled={selectedRow?.Status === 'Approved' || selectedRow?.Status === 'Disapproved'}
            >
              Approve
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => setOpenDisapproveDialog(true)}
              disabled={selectedRow?.Status === 'Approved' || selectedRow?.Status === 'Disapproved'}
            >
              Disapprove
            </Button>
            <Dialog
              open={openDisapproveDialog}
              onClose={() => setOpenDisapproveDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Enter Remark For Disapprove Payment</DialogTitle>

              <DialogContent>
                <TextField
                  label="Remark"
                  placeholder="Enter reason for disapproval"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  value={disapproveRemark}
                  error={remarkError}
                  helperText={remarkError ? 'Remark is required' : ''}
                  onChange={(e) => {
                    setDisapproveRemark(e.target.value);
                    setRemarkError(false);
                  }}
                />
              </DialogContent>

              <DialogActions>


                <Button
                  color="error"
                  variant="contained"
                  onClick={() => {
                    if (!disapproveRemark.trim()) {
                      setRemarkError(true);
                      return;
                    }

                    handleDisApprovePayment(disapproveRemark); // 👈 pass remark
                    setOpenDisapproveDialog(false);
                    setDisapproveRemark('');
                  }}
                >
                  Disapprove
                </Button>
                <Button
                  onClick={() => {
                    setOpenDisapproveDialog(false);
                    setDisapproveRemark('');
                    setRemarkError(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>


            <Button
              variant="contained"
              onClick={handleBackToList}
            >
              Back to List
            </Button>
          </Box>
        </Box>
      </>}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
          }}
          message={receivedMessage}
        />
      </Snackbar>

    </MainCard >


  );
}

export default TaxPaymentApproval;
