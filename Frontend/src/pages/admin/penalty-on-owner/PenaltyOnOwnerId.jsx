// material-ui
import {
  Grid,
  InputLabel,
  TextField,
  Stack,
  Box,
  FormControl,
  Table,
  TableBody,
  SnackbarContent,
  Checkbox,
  TableCell,
  Card,
  CardContent,
  Button,
  Typography,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project import
import MainCard from 'components/MainCard';
import { getYearMaster } from 'services/masterServices/yearMasterService/yearMaster.service';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchSearchedProperties, savePenaltyByOwnerId } from 'services/AdminServices/penaltyOwnerIdWise/penalltyOwnerIdWiseServices';
import { format, isValid } from 'date-fns';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
// ==============================|| SAMPLE PAGE ||============================== //

function PenaltyOnOwnerId() {
  const [isOpen, setIsOpen] = useState(false);
  const [yearList, setYearList] = useState([]);
  const [ownerIds, setOwnerIds] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const [selectedPropertyNoTo, setSelectedPropertyNoTo] = useState('');
  const [error, setError] = useState({});
  const [propertyNoFromList, setPropertyNoFromList] = useState([]);
  const [propertyNoToList, setPropertyNoToList] = useState([]);
  const [searchedProperties, setSearchedProperties] = useState([]);
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [penaltyChecks, setPenaltyChecks] = useState({
    IsValidateDate: false,
    PropertyTax: false,
    EducationTax: false,
    WaterCess: false,
    TreeCess: false,
    EmploymentTax: false,
    SpEducationTax: false,
    WaterBenefit: false,
    FireCess: false,
    RoadCess: false,
    LightCess: false,
    SewageDisposalCess: false,
    Sanitation: false,
    DrainCess: false,
    WaterBill: false,
    Tax1: false,
    Tax2: false,
    Tax3: false,
    Tax4: false,
    Tax5: false
  });
  const [dates, setDates] = useState({
    billGenerationDate: null,
    startFullOnCurrent: null,
    startFullOnPending: null,
    startHalfOnCurrent: null,
    endFullOnCurrent: null,
    endFullOnPending: null,
    endHalfOnCurrent: null
  });

  const [currentRate, setCurrentRate] = useState('');
  const [pendingRate, setPendingRate] = useState('');

  const handleDateChange = (field, newValue) => {
    if (newValue) {
      setDates((prevDates) => ({
        ...prevDates,
        [field]: newValue
      }));
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPenaltyChecks((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  useEffect(() => {
    const fetchYearList = async () => {
      try {
        const fetchedActive = await getYearMaster();
        console.log(fetchedActive, 'yyrr');
        setYearList(fetchedActive);
      } catch (error) {
        console.error('Error fetching active Year list:', error);
        setYearList([]);
      }
    };
    fetchYearList();
  }, []);

  function toggle(e) {
    setIsOpen((isOpen) => !isOpen);
    e.preventDefault();
  }

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        const wardlist = await fetchWards();
        const sortedWardList = wardlist.sort((a, b) => a.NewWardNo - b.NewWardNo);
        setWardList(sortedWardList);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchWardList();
  }, []);

  const handleWardChange = async (event) => {
    const ward = event.target.value;
    console.log('Selected Ward:', ward);
    setSelectedWard(ward);

    setError((prevErrors) => ({
      ...prevErrors,
      selectedWard: ''
    }));
    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);

      const properties = propertyRange.properties;

      setPropertyNoFromList(properties);
      setPropertyNoToList(properties);

      setSelectedPropertyNoFrom('');
      setSelectedPropertyNoTo('');
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };
  const handleSearchClick = async () => {
    if (!selectedWard || !selectedPropertyNoFrom || !selectedPropertyNoTo) {
      console.error('Please select Ward, From, and To values');
      return;
    }

    try {
      const data = await fetchSearchedProperties(selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);
      console.log('Fetched Properties:', data);
      setSearchedProperties(data.properties);
      setIsOpen(true);
      const ownerIds = data.properties.map((property) => property.OwnerID);
      setOwnerIds(ownerIds);
      console.log('Owner IDs:', ownerIds);
    } catch (error) {
      console.error('Error fetching searched properties:', error);
    }
  };

  const handleSaveClick = () => {
    setOpenDialog(true);
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleCloseDialog = async () => {
    setOpenDialog(false);
    try {
      const formattedDates = Object.keys(dates).reduce((acc, key) => {
        acc[key] = dates[key] ? format(dates[key], 'yyyy-MM-dd') : null;
        return acc;
      }, {});
      const penaltyData = {
        selectedYear,
        ...penaltyChecks,
        currentRate,
        pendingRate,
        ownerIds,
        ...formattedDates
      };
      console.log('Penalty data:', penaltyData);

      const levelname = 'L1';
      // Validate password
      const passwordCheckResponse = await levelPassword(levelname, password);
      console.log(passwordCheckResponse, 'pass');
      if (passwordCheckResponse.status !== 200) {
        throw new Error('Invalid password');
      }
      const properties = await savePenaltyByOwnerId(penaltyData);
      console.log('Saved properties:', properties);
      if (properties.status === 200) {
        setSnackbarSeverity('success');
        setReceivedMessage(properties.data.message);
        setSnackbarMessage(receivedMessage);
        setSnackbarOpen(true);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to save penalty. Please check if you have entered valid data.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error saving penalty:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to save penalty. Please try again.');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <MainCard title="Penalty Master Owner ID Wise" style={{ color: 'blue', fontWeight: 'bold' }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={10} lg={6}>
            <Box>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Year </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <Select
                      labelId="select-criteria"
                      id="select-criteria"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      {yearList.map((year, index) => (
                        <MenuItem key={index} value={year.FinanceYear}>
                          {year.FinanceYear}
                        </MenuItem>
                      ))}
                    </Select>{' '}
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>From Property No</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <Select
                      labelId="select-criteria"
                      id="select-criteria"
                      value={selectedPropertyNoFrom}
                      onChange={(e) => setSelectedPropertyNoFrom(e.target.value)}

                      MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 200,
        minWidth: 80,
        width: "auto",
      },
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
  }}
                    >
                      {propertyNoFromList.map((property, index) => (
                        <MenuItem key={index} value={property.NewPropertyNo}>
                          {property.NewPropertyNo}
                        </MenuItem>
                      ))}
                    </Select>{' '}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={10} lg={6}>
            <Box>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Ward No.</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <Select labelId="select-criteria" id="select-criteria" value={selectedWard} onChange={handleWardChange} MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 200,
        minWidth: 80,
        width: "auto",
      },
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
  }}>
                      {wardList.map((ward, index) => (
                        <MenuItem key={index} value={ward.NewWardNo}>
                          {ward.NewWardNo}
                        </MenuItem>
                      ))}
                    </Select>{' '}
                  </Stack>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>To Property No</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <Select
                      labelId="select-criteria"
                      id="select-criteria"
                      value={selectedPropertyNoTo}
                      onChange={(e) => setSelectedPropertyNoTo(e.target.value)}
                    MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 200,
        minWidth: 80,
        width: "auto",
      },
    }, 
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
  }}
                    >
                      {propertyNoToList.map((property, index) => (
                        <MenuItem key={index} value={property.NewPropertyNo}>
                          {property.NewPropertyNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid item xs={10} sm={2} mt={1} mb={2}>
            <Stack spacing={0}>
              <Button variant="contained" color="info" onClick={handleSearchClick}>
                Search
              </Button>
            </Stack>
          </Grid>
        </Grid>
        {isOpen && (
          <Grid
            container
            spacing={2.2}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            {/* table */}

            {/* table2 */}
            <Grid item xs={12} sm={9}>
              <Box className="card">
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
                      Ward List
                    </Typography>

                    <Box sx={{ overflowX: 'auto', height: '250px', width: '750px', margin: '0 auto' }} marginTop={2}>
                      {/* Table */}
                      <Table>
                        {/* Table Header */}
                        <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                          <TableRow>
                            <TableCell>Ward Name</TableCell>
                            <TableCell>Property No.</TableCell>
                            <TableCell>Partition No.</TableCell>
                          </TableRow>
                        </TableHead>
                        {/* Table Body */}
                        <TableBody>
                          {searchedProperties.map((row) => (
                            <TableRow key={row.WardName}>
                              <TableCell>{row.NewWardNo}</TableCell>
                              <TableCell>{row.NewPropertyNo}</TableCell>
                              <TableCell>{row.NewPartitionNo}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        )}
        <Box mb={1}></Box>
        <Grid item xs={12} md={12} lg={12}>
          <MainCard>
            <Typography variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
              Taxes
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack mt={1}>
                  <FormGroup aria-label="position" column>
                    <FormControlLabel
                      control={<Checkbox onChange={handleCheckboxChange} name="IsValidateDate" />}
                      label="IsValidateDate"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['IsValidateDate'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleCheckboxChange} name="PropertyTax" />}
                      label="PropertyTax"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['PropertyTax'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleCheckboxChange} name="EducationTax" />}
                      label="EducationTax"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['EducationTax'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox onChange={handleCheckboxChange} name="WaterCess" />}
                      label="WaterCess"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['WaterCess'] || false}
                    />
                  </FormGroup>
                </Stack>
                <Stack mt={1}>
                  <FormGroup aria-label="position" column>
                    <FormControlLabel
                      control={<Checkbox name="TreeCess" onChange={handleCheckboxChange} />}
                      label="TreeCess"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['TreeCess'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="EmploymentTax" onChange={handleCheckboxChange} />}
                      label="EmploymentTax"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['EmploymentTax'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="SpEducationTax" onChange={handleCheckboxChange} />}
                      label="SpEducationTax"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['SpEducationTax'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="WaterBenefit" onChange={handleCheckboxChange} />}
                      label="W. Benefit"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['WaterBenefit'] || false}
                    />
                  </FormGroup>
                </Stack>
                <Stack mt={1}>
                  <FormGroup aria-label="position" column>
                    <FormControlLabel
                      control={<Checkbox name="FireCess" onChange={handleCheckboxChange} />}
                      label="FireCess"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['FireCess'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="RoadCess" onChange={handleCheckboxChange} />}
                      label="RoadCess"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['RoadCess'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="LightCess" onChange={handleCheckboxChange} />}
                      label="LightCess"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['LightCess'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="SewageDisposalCess" onChange={handleCheckboxChange} />}
                      label="SewageDisposalCess"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['SewageDisposalCess'] || false}
                    />
                  </FormGroup>
                </Stack>
                <Stack mt={1}>
                  <FormGroup aria-label="position" column>
                    <FormControlLabel
                      control={<Checkbox name="Sanitation" onChange={handleCheckboxChange} />}
                      label="Sanitation"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['Sanitation'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="DrainCess" onChange={handleCheckboxChange} />}
                      label="DrainCess"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['DrainCess'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="WaterBill" onChange={handleCheckboxChange} />}
                      label="WaterBill"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['WaterBill'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="Tax1" onChange={handleCheckboxChange} />}
                      label="Tax1"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['Tax1'] || false}
                    />
                  </FormGroup>
                </Stack>
                <Stack mt={1}>
                  <FormGroup aria-label="position" column>
                    <FormControlLabel
                      control={<Checkbox name="Tax2" onChange={handleCheckboxChange} />}
                      label="Tax2"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['Tax2'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="Tax3" onChange={handleCheckboxChange} />}
                      label="Tax3"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['Tax3'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="Tax4" onChange={handleCheckboxChange} />}
                      label="Tax4"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['Tax4'] || false}
                    />
                    <FormControlLabel
                      control={<Checkbox name="Tax5" onChange={handleCheckboxChange} />}
                      label="Tax5"
                      labelPlacement="end"
                      sx={{ ml: 1 }}
                      checked={penaltyChecks['Tax5'] || false}
                    />
                  </FormGroup>
                </Stack>

                <Stack></Stack>
              </Grid>
            </Box>
          </MainCard>
        </Grid>
        <Box mb={1}></Box>

        <MainCard>
          {/* date */}

          <Grid
            container
            spacing={2.2}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            {/* table2 */}
            <Grid container spacing={2} ml={1}>
              <Grid item xs={12} md={12} lg={4}>
                <Box>
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={0}>
                        <InputLabel> Bill Generation Date</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={0}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dates.billGenerationDate}
                            onChange={(newValue) => handleDateChange('billGenerationDate', newValue)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel> Start Full On Current</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dates.startFullOnCurrent}
                            onChange={(newValue) => handleDateChange('startFullOnCurrent', newValue)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel> Start Full On Pending</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dates.startFullOnPending}
                            onChange={(newValue) => handleDateChange('startFullOnPending', newValue)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <Box>
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={0}>
                        <InputLabel> Start Half On Current</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dates.startHalfOnCurrent}
                            onChange={(newValue) => handleDateChange('startHalfOnCurrent', newValue)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel> End Full On Current</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dates.endFullOnCurrent}
                            onChange={(newValue) => handleDateChange('endFullOnCurrent', newValue)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel> End Full On Pending</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dates.endFullOnPending}
                            onChange={(newValue) => handleDateChange('endFullOnPending', newValue)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={12} lg={4}>
                <Box>
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel> End Half On Current</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={1}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dates.endHalfOnCurrent}
                            onChange={(newValue) => handleDateChange('endHalfOnCurrent', newValue)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel> Current Rate</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={1}>
                        <TextField name="Current Rate" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)}></TextField>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item xs={6} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel> Pending Rate</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={7} mb={1}>
                      <Stack spacing={1}>
                        <TextField name="Pending Rate" value={pendingRate} onChange={(e) => setPendingRate(e.target.value)}></TextField>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={3}
            justifyContent="center"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            <Grid item xs={10} sm={2} mt={1}>
              <Stack spacing={0}>
                <Button variant="contained" color="success" onClick={handleSaveClick}>
                  Save{' '}
                </Button>
              </Stack>
              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                <DialogTitle id="alert-dialog-title">L1 LEVEL </DialogTitle>
                <DialogContent>
                  <Stack marginBottom={2}>
                    <DialogContentText id="alert-dialog-description">Submit the password</DialogContentText>
                  </Stack>

                  <TextField
                    required
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    maxWidth="sm"
                  ></TextField>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="success" onClick={handleCloseDialog} autoFocus>
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
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
                message={receivedMessage}
              />
            </Snackbar>
            <Grid item xs={10} sm={2} mt={1}>
              <Stack spacing={0}>
                <Button variant="contained" color="secondary">
                  Clear
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </MainCard>
    </>
  );
}

export default PenaltyOnOwnerId;
