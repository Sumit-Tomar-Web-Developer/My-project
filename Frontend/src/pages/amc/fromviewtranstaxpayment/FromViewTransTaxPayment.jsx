// material-ui
import {
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  Snackbar,
  SnackbarContent
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { fetchPaymentDetails } from 'services/Amc/taxPayment/taxPayment.js';
import { getTransYear } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import FromTranField from '../fromtranfield/FromTranField.jsx';
// ==============================|| SAMPLE PAGE ||============================== //

function FromViewTransTaxPayment({ ViewButton, ownerData, allBillBookData,totalPaid,setTotalPaid }) {
  //const [financeYear, setFinanceYear] = useState(0);
  const [ownerID, setOwnerID] = useState(ownerData.ownerID);
  const [yearTrans, setYearTransList] = useState([]);
  const [selectedRow, setSelectedRow] = useState({
    InvoiceNo: '',
    BillBookNo: '',
    CreatedDate: '',
    UpdatedDate: '',
    matchedRows: []
  });

  const [filters, setFilters] = useState({
    yearWise: '',
    payMentType: ''
  });

  const [paymentList, setPaymentList] = useState([]);

  const [editableTaxDetails, setEditableTaxDetails] = useState([]);
  const [showViewTransaction, setShowViewTransaction] = useState(true);
  const [showTranFeild, setShowTranFeild] = useState(true);

  //snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const columnOrder = [
    'Year',
    'Payment Type',
    'Bill Book No',
    'Invoice No',
    'Transaction Date',
    'Bill No',
    'Bill Date',
    'Property Tax',
    'Education Tax',
    'Employment Tax',
    'Tree Cess',
    'Sp. Water Cess',
    'Sanitation',
    'Drain Cess',
    'Road Cess',
    'Fire Cess',
    'Light Cess',
    'Water Benefit',
    'Major Building',
    'Sewage Disposal Cess',
    'Sp. Education Tax',
    'Water Bill',
    'Tax1',
    'Tax2',
    'Tax3',
    'Tax4',
    'Tax5',
    'Tax Total',
    'Interest',
    'Discount',
    'Notice Fee',
    'Extra Charges',
    'NetTotal',
    'Payment Mode',
    'DD/Cheque No',
    'Payee Name',
    'Bank Name',
    'Branch Name',
    'Cheque Status',
    'DD/Cheque Date',
    'Expiry Date',
    'IFSC No',
    'Amount',
    'Transaction ID'
  ];
  const currentYear = new Date().getFullYear();
  console.log(currentYear);

  // Generate a filtered list from paymentList based on selected filters (year and payment type)
  const filteredList = Array.isArray(paymentList)
    ? paymentList
        .filter((row) => row && typeof row === 'object')
        .filter((row) => {
          const financeYear = row['Finance Year'];
          const pendingYear = row['Pending Year'];
          const yearRange = financeYear == pendingYear ? financeYear : pendingYear;

          const yearCheck = !filters.yearWise || yearRange == filters.yearWise;
          const typeCheck =
            !filters.payMentType?.length || filters.payMentType.includes('All') || filters.payMentType.includes(row['Payment Type']);
          return yearCheck && typeCheck;
        })
    : [];

  //Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  //Navigate to TaxPayment
  const handleNavigateToViewTransaction = () => {
    setShowViewTransaction(!showViewTransaction);
    setShowTranFeild(!showTranFeild);
  };
  //Handle financial year change
  const handleFinanceYearChange = async (ev) => {
    if (yearTrans) {
      console.log('year selected', ev.target.value);
      setFilters({ ...filters, yearWise: ev.target.value });
    } else {
      setFilters({ ...filters, yearWise: '' });
    }
  };
  //Handle payment type chnage
  const handlePaymentTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      payMentType: type
    }));
  };
  // Handle row selection to edit tax payment entry and navigate to From AMC Transaction page.
  const handleAction = (row) => {
    // Unselect if same group clicked again
    if (selectedRow.InvoiceNo === row['Invoice No'] && selectedRow.BillBookNo === row['Bill Book No']) {
      setSelectedRow({
        InvoiceNo: '',
        BillBookNo: '',
        CreatedDate: '',
        UpdatedDate: '',
        matchedRows: []
      });
      return;
    }

    // Allow only current year
    if (row['Finance Year'] !== currentYear) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Transaction does not match with Finance Year.Access Denied...');
      return;
    }

    // Find all matching rows (InvoiceNo, BillBookNo, CreatedDate, UpdatedDate)
    const matchedRows = filteredList.filter(
      (r) =>
        r['Invoice No'] === row['Invoice No'] &&
        r['Bill Book No'] === row['Bill Book No'] &&
        new Date(r.CreatedDate).toISOString().slice(0, 19) === new Date(row.CreatedDate).toISOString().slice(0, 19) &&
        new Date(r.UpdatedDate).toISOString().slice(0, 19) === new Date(row.UpdatedDate).toISOString().slice(0, 19)
    );

    setSelectedRow({
      InvoiceNo: row['Invoice No'],
      BillBookNo: row['Bill Book No'],
      CreatedDate: row.CreatedDate,
      UpdatedDate: row.UpdatedDate,
      matchedRows
    });
    setEditableTaxDetails(matchedRows);
    setShowTranFeild(!showTranFeild);
    setShowViewTransaction(!showViewTransaction);
  };

  //year fetch
  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await getTransYear();
        console.log(response, 'API Response');
        const fetchedYearList = response || []; // Assuming API returns an array of roles directly
        const sortedYearList = [...fetchedYearList].sort((a, b) => b.FinanceYear - a.FinanceYear);
        console.log('sorted year list', sortedYearList);
        setYearTransList(sortedYearList); // Update the roleList state
      } catch (error) {
        console.error('Error fetching year list:', error);
        setYearTransList([]);
      }
    };
    fetchYear();
  }, []);

  //tax-payment paid details fetch
  useEffect(() => {
    const fetchTaxDetails = async () => {
      try {
        if (ownerID) {
          const response = await fetchPaymentDetails(ownerID);
          console.log('fetchTaxDetails response:', response);

          // Normalize response to always be an array
          let dataArray = [];

          if (Array.isArray(response)) {
            dataArray = response;
          } else if (typeof response === 'object' && response !== null) {
            dataArray = Object.values(response);
          }

          setPaymentList(dataArray);
          console.log('Set paymentList successfully:', dataArray);
        }
      } catch (error) {
        console.error('Error fetching tax details:', error);
        setPaymentList([]); // reset on error
      }
    };

    fetchTaxDetails();
  }, [ownerID, showTranFeild]);

  return (
    <>
      {showViewTransaction ? (
        <MainCard title="From View Transaction">
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Grid item xs={12} sm={8} marginTop={1}>
                  <Stack spacing={1}>
                    <InputLabel>Financial Year</InputLabel>
                    <TextField value={ownerData.FinancialYear} />
                  </Stack>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid item xs={12} sm={8}>
                  <Stack spacing={1}>
                    <InputLabel><span style={{ color: 'red' }}>* </span>Ward No.</InputLabel>
                    <TextField required value={ownerData.NewWardNo} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={8} marginTop={1}>
                  <Stack spacing={1}>
                    <InputLabel><span style={{ color: 'red' }}>* </span>Property No.</InputLabel>
                    <TextField value={ownerData.NewPropertyNo} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={8} marginTop={1}>
                  <Stack spacing={1}>
                    <InputLabel><span style={{ color: 'red' }}>* </span>PartitionNo.</InputLabel>
                    <TextField value={ownerData.NewPartitionNo} />
                  </Stack>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1}>
                    <InputLabel>Owner Name</InputLabel>
                    <TextField value={ownerData.OwnerName} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} marginTop={1}>
                  <Stack spacing={1}>
                    <InputLabel>Occupier Name</InputLabel>
                    <TextField value={ownerData.OccupierName} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} marginTop={1}>
                  <Stack spacing={1}>
                    <InputLabel>Renter Name</InputLabel>
                    <TextField value={ownerData.RenterName} />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel> Finance Year</InputLabel>
                  <Select
                    id="year-select"
                    value={filters.yearWise}
                    onChange={handleFinanceYearChange}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {yearTrans.map((financeYear, index) => (
                      <MenuItem key={index} value={financeYear.FinanceYear}>
                        {financeYear.FinanceYear}-{financeYear.FinanceYear + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={8}>
                <Stack spacing={1}>
                  <InputLabel>Payment Type</InputLabel>
                </Stack>
                <Grid item xs={12} sm={10} marginTop={1}>
                  <FormControl>
                    <RadioGroup
                      row
                      value={filters.payMentType} // should be a string, e.g., "Current"
                      onChange={(e) => handlePaymentTypeChange(e.target.value)}
                    >
                      <FormControlLabel value="Current" control={<Radio />} label="Current" sx={{ mb: 1 }} />
                      <FormControlLabel value="Pending" control={<Radio />} label="Pending" sx={{ mb: 1 }} />
                      <FormControlLabel value="All" control={<Radio />} label="All" sx={{ mb: 1 }} />
                      <FormControlLabel value="Advance" control={<Radio />} label="Advance" sx={{ mb: 1 }} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
          <MainCard sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                {/* Table Header */}
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    {columnOrder.map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                  {(filteredList || []).map((row, index) => {
                    if (!row) return null; // skip invalid

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            onChange={() => handleAction(row)}
                            checked={
                              !!selectedRow.matchedRows?.some(
                                (r) =>
                                  r?.['Invoice No'] === row?.['Invoice No'] &&
                                  r?.['Bill Book No'] === row?.['Bill Book No'] &&
                                  new Date(r?.CreatedDate).toISOString().slice(0, 19) ===
                                    new Date(row?.CreatedDate).toISOString().slice(0, 19) &&
                                  new Date(r?.UpdatedDate).toISOString().slice(0, 19) ===
                                    new Date(row?.UpdatedDate).toISOString().slice(0, 19)
                              )
                            }
                          />
                        </TableCell>

                        {columnOrder.map((col) => (
                          <TableCell key={col}>
                            {col === 'Year'
                              ? row?.['Finance Year'] === row?.['Pending Year']
                                ? `${row?.['Finance Year']}-${Number(row?.['Finance Year']) + 1}`
                                : `${row?.['Pending Year']}-${row?.['Finance Year']}`
                              : ['Transaction Date', 'Bill Date', 'DD/Cheque Date', 'Expiry Date'].includes(col)
                                ? row?.[col]
                                  ? new Date(row?.[col]).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric'
                                    })
                                  : ''
                                : row?.[col] ?? ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </MainCard>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <SnackbarContent
              sx={{
                backgroundColor: snackbarSeverity === 'success' ? 'green' : snackbarSeverity === 'warning' ? 'grey' : 'red'
              }}
              message={receivedMessage}
            />
          </Snackbar>

          <Grid item sm={2}>
            <Stack spacing={2} alignItems={'center'} marginTop={4}>
              <Button variant="contained" color="secondary" onClick={ViewButton}>
                Close
              </Button>
            </Stack>
          </Grid>
        </MainCard>
      ) : null}
      {showTranFeild ? null : (
        <FromTranField
          CloseButton={handleNavigateToViewTransaction}
          EditableTaxDetails={editableTaxDetails}
          setEditableTaxDetails={setEditableTaxDetails}
          ownerData={ownerData}
          allBillBookData={allBillBookData}
          totalPaid={totalPaid}
          setTotalPaid={setTotalPaid}
        />
      )}
    </>
  );
}

export default FromViewTransTaxPayment;
