// material-ui
import {
  Grid,
  InputLabel,
  Button,
  Stack,
  Select,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Typography,
  TableContainer,Snackbar,
  SnackbarContent,
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { fetchOwnerId } from 'services/appeal.services';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { getMutationHistoryReportData } from 'services/report/mutation-history/mutationHistoryServices';
import { postWardSelection } from 'services/wardnumber.services';
import * as XLSX from 'xlsx';

// ==============================|| Mutation History PAGE ||============================== //

function MutationHistory() {
  const [wardNo, setWardNo] = useState('');
  const [fromProperty, setFromProperty] = useState('');
  const [wardList, setWardList] = useState([]);
  const [propList, setPropList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [partNo, setPartNo] = useState();
  const [ownerId, setOwnerId] = useState(0);
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
  useEffect(() => {
    fetchWards()
      .then((wards) => {
        setWardList(wards);
      })
      .catch((error) => {
        console.error('Error fetching wards:', error);
      });
  }, []);
  // Handle Ward Select Change
  const handleWardChange = async (event) => {
    setWardNo(event.target.value);
    try {
      const response = await postWardSelection(event.target.value);
      const properties = response.properties;

      if (Array.isArray(properties) && properties.length > 0) {
        const newPropertyNos = properties.map((prop) => ({
          NewPropertyNo: prop.NewPropertyNo
        }));
        setPropList(newPropertyNos);
      } else {
        setPropList([]);
      }
    } catch (error) {
      setPropList([]);
    }
  };

  // Handle Properties Select Change
  const handlePropertyChange = (event) => {
    setFromProperty(event.target.value);
    const prop_no = event.target.value;
    FetchOwnerIdFromWardPropNo(wardNo, prop_no, partNo == undefined ? '' : partNo);
  };
  const handlePartNo = (e) => {
    setPartNo(e.target.value);
    const part_no = e.target.value;
    FetchOwnerIdFromWardPropNo(wardNo, fromProperty, part_no);

  };
  const handleShowReport = async () => {
    try {
      if (ownerId > 0) {
        const requestParam = {
          OwnerID: ownerId
        }

        getMutationHistoryReportData(requestParam)
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
          receivedMessage: 'Property Not found.'
        })
      }
    } catch (error) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'Unable to fetch report due to technical error, ' + error
      })
    }
  };
  const columns = reportList.length > 0 ? Object.keys(reportList[0]) : [];

  function FetchOwnerIdFromWardPropNo(wdNo, propNo, partNo) {
    fetchOwnerId(wdNo, propNo, partNo)
      .then((res) => {
        const owner_Id = res.OwnerId;
        setOwnerId(owner_Id);
      })
      .catch((error) => {
        updateState({
          snackbarOpen: true,
          snackbarSeverity: 'error',
          receivedMessage: 'Unable to fetch Owner_ID due to technical error, ' + error
        })
      });
  };
  const titleRow = Array(columns.length).fill('');
  const titleIndex = Math.floor(columns.length / 2);
  titleRow[titleIndex] = 'AdminReport'.trim();
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
        XLSX.utils.book_append_sheet(wb, ws1, 'MutationHistoryReport');

        XLSX.writeFile(wb, 'MutationHistoryReport.xlsx');
      }
    }
    catch (error) {
      updateState({
        snackbarOpen: true,
        snackbarSeverity: 'error',
        receivedMessage: 'An error occured while exporting report, error - ' + error
      })
    }
  };


  return (
    <MainCard title="Mutation History">
      <MainCard>
        <Grid container spacing={4} justifyContent={'center'} alignItems={'center'}>
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Ward</InputLabel>
              <Select
                id="ward-select"
                value={wardNo}
                onChange={handleWardChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      overflowY: 'auto'
                    }
                  }
                }}
              >
                {wardList.map((ward, index) => (
                  <MenuItem key={index} value={ward.NewWardNo}>
                    {ward.NewWardNo}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Property No.</InputLabel>
              <Select
                id="ward-select"
                value={fromProperty}
                onChange={handlePropertyChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      overflowY: 'auto'
                    }
                  }
                }}
              >
                {propList.map((property, index) => (
                  <MenuItem key={index} value={property.NewPropertyNo}>
                    {property.NewPropertyNo}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Partition No.</InputLabel>
              <TextField required type="number" value={partNo} onChange={handlePartNo}></TextField>
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10PX' }}>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Button variant="contained" color="primary" onClick={handleShowReport} autoFocus>
                Show
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Button variant="contained" color="secondary" autoFocus>
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
      <MainCard>
        <Box width="100%" height="250px" overflow="auto">
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

      <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10PX' }}>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <Button variant="contained" color="primary" onClick={handleExportButtonClick}>
              Export
            </Button>
          </Stack>
        </Grid>
      </Grid>
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

export default MutationHistory;
