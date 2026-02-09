import React, { useEffect, useState } from 'react';
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Snackbar,
  SnackbarContent
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';
import { getFactorInfo, saveFactorInfo } from 'services/utlilityService/setPoliciesService/setPoliciesService';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';

function RetaintionPolicyFactorWiseMaster({ RetainPolicyFactor }) {
  const [factorInfo, setFactorInfo] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  // Fetching data using useEffect
  useEffect(() => {
    const fetchFactorInfo = async () => {
      try {
        const response = await getFactorInfo();
        console.log(response, 'getFactorInfo');
        // Make sure the URL is correct
        setFactorInfo(response.FactorDetails);
      } catch (error) {
        console.error('Error fetching factor info:', error);
      }
    };

    fetchFactorInfo();
  }, []);
  // navigate
  const navigate = useNavigate(); // corrected usage

  // State to store the selected row data
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedFactorRow, setSelectedFactorRow] = useState('');
  // Function to handle row selection
  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
  };

  // Function to handle double-click event on table cell
  const handleCellDoubleClick = (rowData) => {
    setSelectedRow(rowData);
  };

  // Function to handle changes in the input fields
  const handleInputChange = (event, fieldName) => {
    setSelectedRow({ ...selectedRow, [fieldName]: event.target.value });
  };

  // Function to handle button click
  const handleButtonClick = () => {
    navigate('/utility/auto-appeal');
  };

  const handleEditRow = (factor) => {
    setSelectedFactorRow(factor);
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleUpdateClick = async () => {
    try {
      if (!selectedFactorRow || !selectedFactorRow.FacterID) {
        console.error('No factor selected for update.');
        return;
      }

      // Prepare the data for the API call
      const factorData = {
        FacterID: selectedFactorRow.FacterID,
        FromFactor: selectedFactorRow.FromFactor,
        ToFactor: selectedFactorRow.ToFactor,
        FactorValue: selectedFactorRow.FactorValue
      };
      // Call the service function
      const response = await saveFactorInfo(factorData);
      if (response.status === 200) {
        setSnackbarSeverity('success');
        setSnackbarMessage(response.responseData?.message || 'Factor info updated successfully');
        setSnackbarOpen(true);
        setSelectedFactorRow('');
        setFactorInfo((prevFactorInfo) =>
          prevFactorInfo.map((factor) => (factor.FacterID === selectedFactorRow.FacterID ? selectedFactorRow : factor))
        );
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(response.responseData?.message || 'Failed to update factor details.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating factor:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to update factor details.');
      setSnackbarOpen(true);
    }
  };

  return (
    <MainCard title="Retaintion Policy Factor Wise Master">
      <Box mb={2}>
        <Grid
          container
          spacing={7}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid item xs={12} sm={2.2}>
            <Stack spacing={1}>
              <InputLabel>From Range</InputLabel>
              <TextField
                required
                fullWidth
                autoComplete="family-name"
                value={selectedFactorRow ? selectedFactorRow.FromFactor : ''}
                placeholder="Enter From Range"
                onChange={(e) =>
                  setSelectedFactorRow({
                    ...selectedFactorRow,
                    FromFactor: e.target.value
                  })
                }
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2.2}>
            <Stack spacing={1}>
              <InputLabel>To Range</InputLabel>
              <TextField
                required
                fullWidth
                autoComplete="family-name"
                value={selectedFactorRow ? selectedFactorRow.ToFactor : ''}
                placeholder="Enter To Factor"
                onChange={(e) =>
                  setSelectedFactorRow({
                    ...selectedFactorRow,
                    ToFactor: e.target.value
                  })
                }
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2.2}>
            <Stack spacing={1}>
              <InputLabel>Factor Value</InputLabel>
              <TextField
                required
                fullWidth
                autoComplete="family-name"
                value={selectedFactorRow ? selectedFactorRow.FactorValue : ''}
                placeholder="Enter Factor Value"
                onChange={(e) =>
                  setSelectedFactorRow({
                    ...selectedFactorRow,
                    FactorValue: e.target.value
                  })
                }
              />
            </Stack>
          </Grid>

          {/* <Grid item xs={12} sm={2} mt={3}>
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="success">
                Save
              </Button>
            </Stack>
          </Grid> */}
        </Grid>
      </Box>

      {/* table */}
      <Box className="card" style={{ marginTop: '6px' }}>
        <Card>
          <CardContent>
            {/* Heading */}
            <Box sx={{ overflowX: 'auto', height: '200px' }}>
              {/* Table */}
              <Table>
                {/* Table Header */}
                <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                  <TableRow>
                    <TableCell>Edit</TableCell>
                    <TableCell>From Factor</TableCell>
                    <TableCell>To Factor</TableCell>
                    <TableCell>Factor Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {factorInfo.length > 0 ? (
                    factorInfo.map((item) => (
                      <TableRow key={item.FacterID}>
                        <IconButton
                          color={selectedFactorRow && selectedFactorRow.FacterID === item.FacterID ? 'success' : 'primary'}
                          onClick={() => handleEditRow(item)}
                        >
                          {selectedFactorRow && selectedFactorRow.FacterID === item.FacterID ? <SendOutlined /> : <EditTwoTone />}
                        </IconButton>
                        <TableCell>{item.FromFactor}</TableCell>
                        <TableCell>{item.ToFactor}</TableCell>
                        <TableCell>{item.FactorValue}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>No factor information available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* BUTTON */}
      <Box marginTop={4}>
        <Grid
          container
          spacing={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid item xs={12} sm={2}>
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                Update
              </Button>
            </Stack>
          </Grid>
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
          {/* <Grid item xs={12} sm={2}>
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleRowClick({ fromFactor: '1', toFactor: '99998', factorValue: '1.2' })}
              >
                To Edit Click On Row
              </Button>
            </Stack>
          </Grid> */}
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <Button variant="contained" color="secondary" onClick={RetainPolicyFactor}>
                Return To Auto Appeal
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}

export default RetaintionPolicyFactorWiseMaster;
