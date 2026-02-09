// material-ui
import { Grid, InputLabel, Stack, Button, Table, Box, TableContainer, TableHead, TableBody, TableRow, TableCell,Snackbar,
  SnackbarContent } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { getDailyCollectionReportData } from 'services/report/daily-collection-service/dailyCollectionService';

// ==============================|| Daily Collection PAGE ||============================== //

function DailyCollectionReport() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reportList, setReportList] = useState([]);
  const [state, setState] = useState({
    snackbarOpen: false,
    snackbarSeverity: "success",
    receivedMessage: "",
    errors: {}
  });

  const updateState = (updates) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };
  const handleCloseSnackbar = () => {
    updateState({ snackbarOpen: false })
  };
  //export
  const columns = reportList.length > 0 ? Object.keys(reportList[0]) : [];

  const titleRow = Array(columns.length).fill('');
  const titleIndex = Math.floor(columns.length / 2);
  titleRow[titleIndex] = 'Daily Collection Report'.trim();
  //exoprt
  const handleExportButtonClick = () => {
    try {

      if (reportList.length > 0) {

        const data = [titleRow,  // Title row
          columns,  // Header row
          ...reportList  // Data rows
        ];

        const ws1 = XLSX.utils.aoa_to_sheet(data);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws1, 'DailyCollectionReport');

        XLSX.writeFile(wb, 'DailyCollectionReport.xlsx');
      }
    }
    catch (error) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'An error occured while fetching report, error - ' + error
      })
    }
  };
  const handleShow = () => {
    try {
      if (!fromDate && !toDate && toDate > fromDate) {
        const requestParam = {
          FromDate: fromDate ? fromDate.format('YYYY-MM-DD') : null,
          ToDate: toDate ? toDate.format('YYYY-MM-DD') : null
        }

        getDailyCollectionReportData(requestParam)
          .then((reportInfo) => {
            const resp = reportInfo.Response;
            setReportList(resp);
          });
        updateState({
          snackbarOpen: true,
          snackbarSeverity: 'success',
          receivedMessage: 'Records fetched successfully.'
        })
      }
      else {
        updateState({
          snackbarOpen: true,
          snackbarSeverity: 'error',
          receivedMessage: 'From Date & To Date both are compulsory or To Date must be less than From Date.'
        })
      }
    } catch (error) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'An error occured while fetching report, error - ' + error
      })
    }
  }
  return (
    <MainCard title="Daily Collection Report">
      <MainCard sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>From Date</InputLabel>
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker value={fromDate} onChange={(newValue) => setFromDate(newValue)} />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel>To Date</InputLabel>
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker value={toDate} onChange={(newValue) => setToDate(newValue)} />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10PX' }}>
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <Button variant="contained" color="info" onClick={handleShow}>
                Show
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4.5}>
            <Stack spacing={1}>
              <Button variant="contained" color="info" onClick={handleExportButtonClick}>
                Export to Excel
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
      <MainCard>
        <Box width="100%" height="500px" overflow="auto">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableCell key={index}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportList.length > 0 ? (
                  reportList.map((row, rowIndex) => (
                    <TableRow key={rowIndex} align="center" style={{ textAlign: 'center' }} >
                      {columns.map((col, colIndex) => (
                        <TableCell key={colIndex}>
                          {row[col]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </MainCard>
      <Snackbar
        open={state.snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: state.snackbarSeverity === 'success' ? 'green' : 'red'
          }}
          message={state.receivedMessage}
        />
      </Snackbar>
    </MainCard>
  );
}

export default DailyCollectionReport;
