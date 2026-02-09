import {
  Grid,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Radio,
  Button,
  RadioGroup,
  TextField,
  FormControlLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import { useState } from 'react';

function QualityControlReports() {
  const [report, setReport] = useState(0);
  const [fromWardNo, setFromWardNo] = useState(0);
  const [toWardNo, setToWardNo] = useState(0);
  const [wardNo, setWardNo] = useState(0);
  // current-pending radio
  const [selectedValue, setSelectedValue] = useState('Current and Pending');
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [isMissingInvoiceTableVisible, setIsMissingInvoiceTableVisible] = useState(false);
  const [amount, setAmount] = useState('');
  //invoice radio
  const [invoice, setInvoice] = useState('Offline');

  //with-without interest
  const [interest, setInterest] = useState('Without Interest');
  const [fromPropertyOptions, setFromPropertyOptions] = useState([]);
  const [toPropertyOptions, setToPropertyOptions] = useState([]);
  const [year, setYear] = useState(0);

  const handleWardChange = (event) => {
    const selectedWard = event.target.value;
    setWardNo(selectedWard);

    if (selectedWard === 'All') {
      setFromPropertyOptions([]);
      setToPropertyOptions([]);
    } else {
      const options = [...Array(1498).keys()].map((key) => key + 1);
      setFromPropertyOptions(options);
      setToPropertyOptions(options);

      setFromWardNo(options[0]);
      setToWardNo(options[0]);
    }
  };
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleInterestChange = (event) => {
    setInterest(event.target.value);
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const handleInvoiceChange = (event) => {
    setInvoice(event.target.value);
  };

  const handleReportChange = (event) => {
    const selectedReport = event.target.value;
    setReport(selectedReport);
  };

  const exportTableToExcel = () => {
    if (isTableVisible) {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      // Convert table data to worksheet
      const ws = XLSX.utils.table_to_sheet(document.getElementById('reporttable'));
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      // Convert the workbook to an array buffer
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      // Save the workbook as an Excel file
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table_data.xlsx');
    }
  };

  const exportInvoiceTableToExcel = () => {
    // Check if the table is visible before exporting
    if (isMissingInvoiceTableVisible) {
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      // Convert table data to worksheet
      const ws = XLSX.utils.table_to_sheet(document.getElementById('invoicetable'));
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      // Convert the workbook to an array buffer
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      // Save the workbook as an Excel file
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table_data.xlsx');
    }
  };

  const handleShowChange = () => {
    let errorMessage = '';

    // Check if from property is selected
    if (fromWardNo === 0 && toWardNo === 0) {
      errorMessage = 'Please Select Ward ';
    }

    // Show error message if any
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    // If all conditions are met, set the table visibility
    setIsTableVisible(true);
  };
  const handleMissingInvoiceShowChange = () => {
    if (year === 0) {
      alert('Please select a year.');
      return;
    }

    // Check if the invoice type is 'Tab'
    if (invoice === 'Tab') {
      setIsMissingInvoiceTableVisible(false);
    } else {
      // If the invoice type is not 'Tab', show the table
      setIsMissingInvoiceTableVisible(true);
    }
  };

  const handleCancelChange = () => {
    setReport(0); // Resetting the report to 0 to show the select report component
  };

  const ShowSelectReportComponent = () => {
    return (
      <MainCard>
        <Grid container spacing={2}>
          <Typography sx={{ color: '#1677ff', fontWeight: 'bold', fontSize: '15px' }}>Reports</Typography>
        </Grid>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12} sm={8}>
            <Stack spacing={2}>
              <Typography>Select Reports</Typography>

              <Select value={report} onChange={handleReportChange}>
                <MenuItem value={0}>---Select---</MenuItem>
                <MenuItem value={1}>Defaulter Reports</MenuItem>
                <MenuItem value={2}>Missing Invoice</MenuItem>
              </Select>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    );
  };

  const ShowMissingInvoiceData = () => {
    return (
      <MainCard>
        <Grid container spacing={2}>
          <Typography sx={{ color: '#1677ff', fontWeight: 'bold', fontSize: '15px' }}>Missing Invoice Data</Typography>
        </Grid>

        <Grid container spacing={2} marginTop={5}>
          <Grid item xs={12} sm={4}>
            <Stack spacing={2}>
              <Typography>Select year</Typography>

              <Select value={year} onChange={handleYearChange}>
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>2024-25</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={8} sx={{ marginTop: '15px' }}>
            <RadioGroup value={invoice} onChange={handleInvoiceChange}>
              <Grid container spacing={2} marginTop={1}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel value="Offline" control={<Radio />} label="Offline" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel value="Tab" control={<Radio />} label="Tab" />
                </Grid>
              </Grid>
            </RadioGroup>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" alignItems="center" marginTop={5}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="success" onClick={handleMissingInvoiceShowChange}>
              Show
            </Button>
            <Button variant="contained" color="warning" onClick={handleCancelChange}>
              Cancel
            </Button>
            <Button variant="contained" color="info" onClick={exportInvoiceTableToExcel}>
              Export
            </Button>
          </Stack>
        </Grid>
        {isMissingInvoiceTableVisible && (
          <Grid container spacing={2} marginTop={5}>
            {ShowMissingInvoiceTable()}
          </Grid>
        )}
      </MainCard>
    );
  };
  const ShowTable = () => {
    return (
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Table id="reporttable" style={{ width: '100%', overflowX: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell>वॉर्ड नं</TableCell>
                <TableCell>मालमत्ता नं</TableCell>
                <TableCell>भाग क्र:</TableCell>
                <TableCell>मालमत्ता धारकाचे नाव</TableCell>
                <TableCell>भोगवट धारकाचे नाव</TableCell>
                <TableCell>मालमत्ता धारकाचा पत्ता</TableCell>
                <TableCell>दूरध्वनी क्र</TableCell>
                <TableCell> चालू कर</TableCell>
                <TableCell>थकीत कर</TableCell>
                <TableCell>शास्ती</TableCell>
                <TableCell>एकूण कर</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>5 </TableCell>
                <TableCell></TableCell>
                <TableCell>सरकारी . जागा</TableCell>
                <TableCell>**</TableCell>
                <TableCell>शिरुर, स.जा/706, कैकाडी आळी, शिरुर</TableCell>
                <TableCell>**</TableCell>
                <TableCell>328</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>428</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>5 </TableCell>
                <TableCell></TableCell>
                <TableCell>सरकारी . जागा</TableCell>
                <TableCell>अशोक अप्पा सातभाई</TableCell>
                <TableCell>शिरुर, स.जा/706, कैकाडी आळी, शिरुर</TableCell>
                <TableCell>9822777466</TableCell>
                <TableCell>328</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>393</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>5 </TableCell>
                <TableCell></TableCell>
                <TableCell>सरकारी . जागा</TableCell>
                <TableCell>**</TableCell>
                <TableCell>शिरुर, स.जा/706, कैकाडी आळी, शिरुर</TableCell>
                <TableCell>9822777466</TableCell>
                <TableCell>270</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>1439</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>5 </TableCell>
                <TableCell></TableCell>
                <TableCell>सरकारी . जागा</TableCell>
                <TableCell>**</TableCell>
                <TableCell>शिरुर, स.जा/706, कैकाडी आळी, शिरुर</TableCell>
                <TableCell>**</TableCell>
                <TableCell>328</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>1260</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </MainCard>
    );
  };

  const ShowMissingInvoiceTable = () => {
    return (
      <MainCard>
        <Box sx={{ height: '300px', overflowY: 'auto' }}>
          <Table id="invoicetable" style={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>Sr_No </TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Bill Book No</TableCell>
                <TableCell>Receipt No From</TableCell>
                <TableCell>Receipt No To</TableCell>
                <TableCell>Cancle Receipt</TableCell>
                <TableCell>From Used Invoice </TableCell>
                <TableCell>To Used Invoice</TableCell>
                <TableCell>From Unused Invoice</TableCell>
                <TableCell>To Unused Invoice</TableCell>
                <TableCell>Total Unsed Invoice</TableCell>
                <TableCell>Signature</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Administrator </TableCell>
                <TableCell> admin</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1</TableCell>
                <TableCell>100</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
                <TableCell>100</TableCell>
                <TableCell>98</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Administrator </TableCell>
                <TableCell> admin</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1</TableCell>
                <TableCell>100</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
                <TableCell>100</TableCell>
                <TableCell>98</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>vinod gangaram ubale </TableCell>
                <TableCell> vinod.u</TableCell>
                <TableCell>2023-SHR1</TableCell>
                <TableCell>1</TableCell>
                <TableCell>4000</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>1</TableCell>
                <TableCell>4000</TableCell>
                <TableCell>4000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell>pramod balkrushn pawar </TableCell>
                <TableCell> pramod.p</TableCell>
                <TableCell>2023-SHR2</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>1</TableCell>
                <TableCell>2000</TableCell>
                <TableCell>2000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>amrut bhavar </TableCell>
                <TableCell> amrut.b</TableCell>
                <TableCell>2023-SHR3</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>1</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>1000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </MainCard>
    );
  };

  const ShowDefaulterReportComponent = () => {
    return (
      <MainCard>
        <Grid container spacing={2}>
          <Typography sx={{ color: '#1677ff', fontWeight: 'bold', fontSize: '15px' }}>Select Data</Typography>
        </Grid>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12} sm={4}>
            <Stack spacing={2}>
              <Typography>Select wards</Typography>

              <Select value={wardNo} onChange={handleWardChange}>
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack spacing={2}>
              <Typography>From Property</Typography>

              <Select value={fromWardNo} onChange={(e) => setFromWardNo(e.target.value)}>
                {fromPropertyOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack spacing={2}>
              <Typography>To Property</Typography>

              <Select value={toWardNo} onChange={(e) => setToWardNo(e.target.value)}>
                {toPropertyOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={4} marginTop={2} marginLeft={1}>
          <RadioGroup value={selectedValue} onChange={handleRadioChange}>
            <Grid container spacing={2} marginTop={1}>
              <Grid item xs={6}>
                <FormControlLabel value="Current and Pending" control={<Radio />} label="Current and Pending" />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel value="Current" control={<Radio />} label="Current" />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel value="Pending" control={<Radio />} label="Pending" />
              </Grid>
            </Grid>
          </RadioGroup>
        </Grid>
        <Grid container spacing={2} marginTop={2} marginLeft={1}>
          <Grid item xs={12} sm={6}>
            <RadioGroup value={interest} onChange={handleInterestChange}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel value="With Interest" control={<Radio />} label="With Interest" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel value="Without Interest" control={<Radio />} label="Without Interest" />
                </Grid>
              </Grid>
            </RadioGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction={'row'}>
              <Stack>
                <Typography style={{ width: '100px', marginTop: '5px' }}>Enter Amount</Typography>
              </Stack>
              <Stack>
                <TextField
                  fullWidth
                  required
                  style={{ width: '230px', marginLeft: '2px' }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="center" alignItems="center" marginTop={2}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="success" onClick={handleShowChange}>
              Show
            </Button>
            <Button variant="contained" color="warning" onClick={handleCancelChange}>
              Cancel
            </Button>
            <Button variant="contained" color="info" onClick={exportTableToExcel}>
              Export
            </Button>
          </Stack>
        </Grid>

        {isTableVisible && (
          <Grid container spacing={2} marginTop={2}>
            <ShowTable />
          </Grid>
        )}
      </MainCard>
    );
  };

  return (
    <MainCard title="Reports">
      {report !== 1 && report !== 2 && <ShowSelectReportComponent />}
      {report === 1 && <ShowDefaulterReportComponent />}
      {report === 2 && <ShowMissingInvoiceData />}
    </MainCard>
  );
}

export default QualityControlReports;
