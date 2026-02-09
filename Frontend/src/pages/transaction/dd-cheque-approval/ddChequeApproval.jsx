// material-ui
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  SnackbarContent,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  
  TextField
} from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { fetchChequeData, fetchDDChequeHistory, fetchWardByZone, fetchZoneSectionList, saveDDChequeHistory, updateChequeStatus } from 'services/transaction/ddChequeApproval/ddChequeApprovalService';

function DdChequeApproval() {
  const [value, setValue] = useState('1');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [zoneList, setZoneList] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
const [wardList, setWardList] = useState([]);
const [selectedWard, setSelectedWard] = useState('');
const [fromDate, setFromDate] = useState('');
const [toDate, setToDate] = useState('');
const [chequeNo, setChequeNo] = useState('');
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [receivedMessage, setReceivedMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 

const showSnackbar = (message, severity = 'success') => {
  setReceivedMessage(message);
  setSnackbarSeverity(severity);
  setSnackbarOpen(true);
};

const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') return;
  setSnackbarOpen(false);
};

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
 
  
  
  const handleSave = async () => {
    if (!selectedStatus) {
      showSnackbar('Please select Cheque Status');
      return;
    }
  
    const selectedChequeNos = rows
      .filter(row => row.selected)
      .map(row => row.DDChequeNo);
  
    if (selectedChequeNos.length === 0 && !(fromDate && toDate)) {
      alert('Please select at least one cheque OR provide From & To date');
      return;
    }
  
    try {
      const payload = {
        chequeStatus: selectedStatus,
        ...(selectedChequeNos.length > 0 ? { chequeNos: selectedChequeNos } : {}),
        ...(fromDate && toDate ? { fromDate, toDate } : {}),
        ...(selectedZone ? { zoneNo: selectedZone } : {}),
        ...(selectedWard ? { ward: selectedWard } : {})
      };
  
      const res = await updateChequeStatus(payload);
  
      if (res.success) {
        showSnackbar(res.message);
  
        setRows(prevRows =>
          prevRows.map(row => {
            const updatedRow = res.data.find(r => r.DDChequeNo === row.DDChequeNo);
            return updatedRow ? { ...row, ChequeStatus: updatedRow.ChequeStatus, selected: false } : row;
          })
        );
  
        setSelectedStatus('');
      } else {
        showSnackbar(res.message);
      }
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to update cheque status');
    }
  };
  
  
  
  
  const [rows, setRows] = useState([]);
  useEffect(() => {
    loadZones();
  }, []);
  //zone
  const loadZones = async () => {
    try {
      const res = await fetchZoneSectionList();
      if (res.success) {
        setZoneList(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  //zone based ward
  const handleZoneChange = async (e) => {
    const zoneNo = e.target.value;
    setSelectedZone(zoneNo);
    setSelectedWard('');
    setWardList([]);
  
    if (!zoneNo) return;
  
    try {
      const res = await fetchWardByZone(zoneNo);
      if (res.success) {
        setWardList(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  


  const handleSelectRow = (id) => {
    setRows(prev =>
      prev.map(row =>
        row.id === id
          ? { ...row, selected: !row.selected }
          : row
      )
    );
  };
 const handleSearch = async () => {
  if (!chequeNo && !(fromDate && toDate)) {
    showSnackbar("Please enter Cheque No OR select From & To date", 'error');
    return;
  }

  let payload = {};
  if (chequeNo) {
    const chequeArray = chequeNo.split(",").map(ch => ch.trim()).filter(ch => ch !== "");
    payload.chequeNos = chequeArray.length === 1 ? [chequeArray[0]] : chequeArray;
  } else {
    payload.fromDate = fromDate;
    payload.toDate = toDate;
  }

  if (selectedZone) payload.zoneNo = selectedZone;
  if (selectedWard) payload.ward = selectedWard;

  try {
    const res = await fetchChequeData(payload);

    if (res.success) {
      if (res.data.length === 0) {
        showSnackbar('No records found', 'info');
      }
      setRows(res.data);
    } else {
      showSnackbar(res.message, 'error');
    }
  } catch (err) {
    console.error(err);
    showSnackbar("Failed to fetch cheque data", 'error');
  }
};
  
  const handleExportExcel = () => {
    if (rows.length === 0) {
      alert("No data to export");
      return;
    }
  
    // Prepare data for Excel
    const excelData = rows.map(row => ({
      "Ward No": row.wardNo,
      "Property No": row.propertyNo,
      "Partition No": row.partitionNo,
      "Bill Book No": row.BillBookNo,
      "Invoice No": row.InvoiceNo,
      "DD/Cheque No": row.DDChequeNo,
      "DD/Cheque Date": row.DDChequeDate,
      "Bank Name": row.BankName,
      "Transaction Date": row.TransactionDate,
      "Finance Year": row.FinanceYear,
      "Amount": row.Amount,
      "Cheque Status": row.ChequeStatus,
      "Payment Resource": row.PaymentResource
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DD_Cheque_Approval");
  
    // Write workbook and save
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "DD_Cheque_Approval.xlsx");
  };
  ///2nd tab
  const [historyChequeNo, setHistoryChequeNo] = useState('');
const [historyFromDate, setHistoryFromDate] = useState('');
const [historyToDate, setHistoryToDate] = useState('');
const [historyRows, setHistoryRows] = useState([]);
  
const handleHistorySearch = async () => {
  if (!historyChequeNo && !(historyFromDate && historyToDate)) {
    alert("Please enter Cheque No OR select From & To date");
    return;
  }

  let payload = {};

  if (historyChequeNo) {
    const chequeArray = historyChequeNo
      .split(",")
      .map(ch => ch.trim())
      .filter(ch => ch !== "");

    payload.chequeNo = chequeArray.length === 1 ? chequeArray[0] : chequeArray;
  } else {
    payload.fromDate = historyFromDate;
    payload.toDate = historyToDate;
  }

  try {
    const res = await fetchDDChequeHistory(payload);
    if (res.success) {
      setHistoryRows(res.data);
    } else {
      alert(res.message);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to fetch cheque data");
  }
};
  


  return (
    <MainCard title="DD / ChequeApproval">
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Approval Process" value="1" />
              <Tab label="Approval History" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
           <Grid justifyContent={'center'}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={2}>
                <Stack spacing={1} display={'flex'} alignItems={'center'}>
                  <InputLabel>Cheque No.</InputLabel>
                  <TextField
  size="small"
  fullWidth
  value={chequeNo}
  onChange={(e) => setChequeNo(e.target.value)}
/>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Stack spacing={1} display={'flex'} alignItems={'center'}>
                  <InputLabel>Zone No.</InputLabel>
                  <Select
  fullWidth
  size="small"
  value={selectedZone}
  onChange={handleZoneChange}
>
  <MenuItem value="">
    <em>Select Zone</em>
  </MenuItem>

  {zoneList.map((z, index) => (
    <MenuItem key={index} value={z.ZoneSectionNo}>
      {z.ZoneSectionNo}
    </MenuItem>
  ))}
</Select>
      </Stack>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Stack spacing={1} display={'flex'} alignItems={'center'}>
                  <InputLabel>Ward No.</InputLabel>
                  <Select
  fullWidth
  size="small"
  value={selectedWard}
  onChange={(e) => setSelectedWard(e.target.value)}
  disabled={!selectedZone}
>
  <MenuItem value="">
    <em>Select Ward</em>
  </MenuItem>

  {wardList.map((w, index) => (
    <MenuItem key={index} value={w.Ward}>
      {w.Ward}
    </MenuItem>
  ))}
</Select>
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={2}>
                <Stack spacing={1} display={'flex'} alignItems={'center'}>
                  <InputLabel>Cheque Status</InputLabel>
                  <Select
  fullWidth
  size="small"
  value={selectedStatus}
  onChange={(e) => setSelectedStatus(e.target.value)}
>
  <MenuItem value="">
    <em>Select</em>
  </MenuItem>
  <MenuItem value="InProcess">InProcess</MenuItem>
  <MenuItem value="Cleared">Cleared</MenuItem>
  <MenuItem value="NotCleared">Not Cleared</MenuItem>
</Select>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={2}>
  <Stack spacing={1} display={'flex'} alignItems={'center'}>
    <InputLabel>From Date</InputLabel>
    <TextField
      type="date"
      size="small"
      fullWidth
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
    />
  </Stack>
</Grid>
<Grid item xs={12} sm={2}>
  <Stack spacing={1} display={'flex'} alignItems={'center'}>
    <InputLabel>To Date</InputLabel>
    <TextField
      type="date"
      size="small"
      fullWidth
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
    />
  </Stack>
</Grid>

           
             
            </Grid>
            <Grid container spacing={2}  justifyContent="center">
            <Grid item xs={12} sm={1.5} mt={3.8}>
                <Stack spacing={1}>
                  <Button variant="contained" onClick={handleSearch }>Search</Button>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={1.5} mt={3.8}>
                <Stack spacing={1}>
                <Button variant="contained" color="success" onClick={handleExportExcel}>
  Generate Excel
</Button>
                </Stack>
              </Grid>
              </Grid>
              </Grid>
            <Table sx={{ mt: 4 }}>
            <TableHead>
  <TableRow>
    <TableCell>Select</TableCell>
    <TableCell>Ward No.</TableCell>
    <TableCell>Property No.</TableCell>
    <TableCell>Partition No.</TableCell>
    <TableCell>Bill Book No.</TableCell>
    <TableCell>Invoice No.</TableCell>
    <TableCell>DD/Cheque No.</TableCell>
    <TableCell>DD/Cheque Date</TableCell>
    <TableCell>Bank Name</TableCell>
    <TableCell>Transaction Date</TableCell>
    <TableCell>Finance Year</TableCell>
    <TableCell>Amount</TableCell>
 <TableCell>Cheque Status</TableCell>
    <TableCell>Payment Resource</TableCell>
  

  </TableRow>
</TableHead>

              {/* Table Body */}
              <TableBody>
  {rows.map((row) => (
    <TableRow key={row.id}>
      <TableCell>
        <Checkbox
          checked={row.selected}
          onChange={() => handleSelectRow(row.id)}
        />
      </TableCell>
      <TableCell>{row.wardNo}</TableCell>
      <TableCell>{row.propertyNo}</TableCell>
      <TableCell>{row.partitionNo}</TableCell>
      <TableCell>{row.BillBookNo}</TableCell>
      <TableCell>{row.InvoiceNo}</TableCell>
      <TableCell>{row.DDChequeNo}</TableCell>
      <TableCell>{row.DDChequeDate}</TableCell>
      <TableCell>{row.BankName}</TableCell>
      <TableCell>{row.TransactionDate}</TableCell>
      <TableCell>{row.FinanceYear}</TableCell>
      <TableCell>{row.Amount}</TableCell>
      <TableCell>{row.ChequeStatus}</TableCell>
      <TableCell>{row.PaymentResource}</TableCell>
      

    </TableRow>
  ))}
</TableBody>

            </Table>
            <Grid display={'flex'} justifyContent={'center'} mt={2}>
            <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </TabPanel>
          <TabPanel value="2">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1}>
                  <InputLabel>Cheque No:</InputLabel>
                  <TextField
        size="small"
        fullWidth
        value={historyChequeNo}
        onChange={(e) => setHistoryChequeNo(e.target.value)}
      />                </Stack>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>From Date:</InputLabel>
                  <TextField
        type="date"
        size="small"
        fullWidth
        value={historyFromDate}
        onChange={(e) => setHistoryFromDate(e.target.value)}
      />                </Stack>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>To Date:</InputLabel>
                  <TextField
        type="date"
        size="small"
        fullWidth
        value={historyToDate}
        onChange={(e) => setHistoryToDate(e.target.value)}
      />                </Stack>
              </Grid>
              <Grid item xs={12} sm={1} mt={3.8}>
              <Button variant='contained' onClick={handleHistorySearch}>Search</Button>
              </Grid>
            </Grid>
            <Table sx={{ mt: 4 }}>
            <TableHead>
      <TableRow>
      <TableCell>Ward No.</TableCell>
    <TableCell>Property No.</TableCell>
    <TableCell>Partition No.</TableCell>
    <TableCell>Bill Book No.</TableCell>
    <TableCell>Invoice No.</TableCell>
    <TableCell>DD/Cheque No.</TableCell>
    <TableCell>DD/Cheque Date</TableCell>
    <TableCell>Bank Name</TableCell>
    <TableCell>Transaction Date</TableCell>
    <TableCell>Finance Year</TableCell>
    <TableCell>Amount</TableCell>
 <TableCell>Cheque Status</TableCell>
    <TableCell>Payment Resource</TableCell>
      </TableRow>
    </TableHead>

              {/* Table Body */}
              <TableBody>
      {historyRows.length > 0 ? (
        historyRows.map((row, index) => (
          <TableRow key={index}>
           <TableCell>{row.wardNo}</TableCell>
      <TableCell>{row.propertyNo}</TableCell>
      <TableCell>{row.partitionNo}</TableCell>
      <TableCell>{row.BillBookNo}</TableCell>
      <TableCell>{row.InvoiceNo}</TableCell>
      <TableCell>{row.DDChequeNo}</TableCell>
      <TableCell>{row.DDChequeDate}</TableCell>
      <TableCell>{row.BankName}</TableCell>
      <TableCell>{row.TransactionDate}</TableCell>
      <TableCell>{row.FinanceYear}</TableCell>
      <TableCell>{row.Amount}</TableCell>
      <TableCell>{row.ChequeStatus}</TableCell>
      <TableCell>{row.PaymentResource}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={11} align="center">
            No records found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
            </Table>
          </TabPanel>
        </TabContext>
      </Box>
      <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {receivedMessage}
      </Alert>
    </Snackbar>
    </MainCard>
  );
}



export default DdChequeApproval;
