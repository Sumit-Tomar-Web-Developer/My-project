// material-ui
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Button,
  MenuItem,
  Select,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  InputLabel,
  TextField,
  Snackbar,
  SnackbarContent
} from '@mui/material';
import { CSVExport } from 'components/third-party/react-table';


// project import
import MainCard from 'components/MainCard';
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
// assets
import { BookOutlined } from '@ant-design/icons';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import {
  applyAppealService,
  getDemandAnalysisData,
  getOwnersForAutoHearingAppComm,
  applyAppealRatioWise
} from 'services/AdminServices/autoHearingAppealComm/autoHearingAppealCommService';
import { getConstructionTypes } from 'services/masterServices/depreciationservices/depreciation.services.js';
import { getTypeOfUseList } from 'services/masterServices/typeOfUseServices/typeOfUse.service.js';
import { useSelector } from 'react-redux';


// ==============================||AutoHearingAppealComm ||============================== //

function AutoHearingAppealComm() {
  let selectedTab = 0;
  const loggedInUserRole = useSelector(
    (state) => state.newUserDetails.initialUserData.role
  );
  const [isConstructionType, setIsConstructionType] = useState(true);
  const [isTypeOfUse, setIsTypeOfUse] = useState(false);
  const [tableNewDmdAnalysis, setTableNewDmdAnalysis] = useState([]);
  const [tableOldDmdAnalysis, setTableOldDmdAnalysis] = useState([]);
  const [value, setValue] = useState(selectedTab);
  const [wardNoList, setWardNoList] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [appealType, setAppealType] = useState('');
  const [ownerIDs, setOwnerIDs] = useState([]);
  const [constructionsList, setConstructionsList] = useState([]);
  const [constructionPercentages, setConstructionPercentages] = useState({});
  const [typeOfUsePercentages, setTypeOfUsePercentages] = useState({});
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [selectedCriteria, setSelectedCriteria] = useState('0'); // Default: Construction Type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([])
  const [data2, setData2] = useState([])
  const [appealTable, setAppealTable] = useState('')
  const [snackbarMessage, setSnacbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarSeverity, setSnackbarSeverity] = useState('')



  // Handle Select Change
  const handleCriteriaChange = (event) => {
    setSelectedCriteria(event.target.value);
    if (event.target.value === '1') {
      setIsConstructionType(false);
      setIsTypeOfUse(true);
    }
    if (event.target.value === '0') {
      setIsConstructionType(true);
      setIsTypeOfUse(false);
    }
  };
  const headers = [
    { label: 'Reason', key: 'reason' },
    { label: 'Property', key: 'property' },
    { label: 'Old RV', key: 'oldRv' },
    { label: 'Old Prop Demand', key: 'oldPropDemand' },
    { label: 'Old Total Demand', key: 'oldTotalDemand' },
    { label: 'New RV ', key: 'newRv ' },
    { label: 'New Prop Demand', key: 'newPropDemand' },
    { label: 'New Total Demand', key: 'newTotalDemand' },
    { label: 'Discount', key: 'discount' },
    { label: 'Final Property Demand', key: 'finalPropertyDemand' },
    { label: 'Final Total Demand', key: 'finalTotalDemand' }
  ];


  const headers2 = [
    { label: 'Reason', key: 'reason' },
    { label: 'Property', key: 'property' },
    { label: 'Old RV', key: 'oldRv' },
    { label: 'Old Prop Demand', key: 'oldPropDemand' },
    { label: 'Old Total Demand', key: 'oldTotalDemand' },
    { label: 'New RV ', key: 'newRv ' },
    { label: 'New Prop Demand', key: 'newPropDemand' },
    { label: 'New Total Demand', key: 'newTotalDemand' },
    { label: 'Discount', key: 'discount' },
    { label: 'Final Property Demand', key: 'PropertyDemand' },
    { label: 'Final Total Demand', key: 'TotalDemand' }
  ];

  // 2nf tab 1st table data

  //tab





  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderValue = (selected) => {
    if (selected.length === 0) {
      return <em>None</em>;
    }
    if (selectAll) {
      return 'ALL';
    }
    return selected.join(', ');
  };

  // ✅ Separate function for handling checkbox changes
  const handleCheckboxChange = (ward) => {
    if (ward === 'ALL') {
      if (selectAll) {
        setSelectedWard([]);
        setSelectAll(false);
      } else {
        setSelectedWard(wardNoList.map((w) => w.NewWardNo));
        setSelectAll(true);
      }
    } else {
      let updatedSelection = selectedWard.includes(ward) ? selectedWard.filter((w) => w !== ward) : [...selectedWard, ward];

      setSelectedWard(updatedSelection);
      setSelectAll(updatedSelection.length === wardNoList.length);
    }
  };
  useEffect(() => {
    console.log('Fetching ward list...');
    const wardList = async () => {
      const wardNoList = await fetchWards();
      setWardNoList(wardNoList);
    };
    wardList();
  }, []);


  //to fetch construction types from db tab 2
  useEffect(() => {
    const fetchConstuctionTypes = async () => {
      try {
        const data = await getConstructionTypes();
        data, 'years list from db';
        setConstructionsList(data, 'constructions type list from db');
      } catch (error) {
        console.log(error);
      }
    };

    fetchConstuctionTypes();
  }, []);

  // Handle Min and Max Input Changes
  const handleMinChange = (event) => setMinValue(event.target.value);
  const handleMaxChange = (event) => setMaxValue(event.target.value);

  // Handle Add Range
  const handleAddRange = () => {
    if (minValue && maxValue) {
      setTableNewDmdAnalysis([...tableNewDmdAnalysis, { reason: `${minValue} - ${maxValue}` }]);
      setTableOldDmdAnalysis([...tableOldDmdAnalysis, { reason: `${minValue} - ${maxValue}` }]);
      setMinValue(''); // Reset fields
      setMaxValue('');
    }
  };

  // Handle Generate Click



  const handleAppealTypeChange = (event) => {
    setAppealType(event.target.value);
  };

  const handleSave = async () => {

    const isAutoHearing = appealType === '1';
    const ownerIds = await getOwnersForAutoHearingAppComm(isAutoHearing, selectedWard);
    console.log('data from getOwnersForAutoHearingAppComm', ownerIds)
    if (ownerIds.length) {
      const ownerIDs = ownerIds.map((item) => item.OwnerID)
      setOwnerIDs(ownerIDs);
    } else {
      console.error(ownerIds.message);
    }
    const appealData = {
      isAutoHearing,
      ownerIDs,
      isConstructionType,
      constructionsList,
      typesOfUseList,
      constructionPercentages,
      typeOfUsePercentages
    };

    try {
      const response = await applyAppealService(appealData);
      alert(response.success ? 'Appeal applied successfully!' : 'Failed to apply appeal.');
    } catch (error) {
      alert(error.message);
    }
  }
  const [typesOfUseList, setTypesOfUseList] = useState([]);

  useEffect(() => {
    const fetchTypesOfUse = async () => {
      try {
        const data = await getTypeOfUseList();
        console.log(data, 'list type of use list');
        setTypesOfUseList(data);
      } catch (error) {
        console.error('Failed to fetch types of use:', error);
      }
    };

    fetchTypesOfUse();
  }, []);

  // Log construction percentages whenever they change
  useEffect(() => {
    console.log('Construction Percentages:', constructionPercentages);
  }, [constructionPercentages]);

  // Log type of use percentages whenever they change
  useEffect(() => {
    console.log('Type Of Use Percentages:', typeOfUsePercentages);
  }, [typeOfUsePercentages]);



  useEffect(() => {
    handleGenerateDemandAnalysis();
    console.log('Loading////', handleGenerateDemandAnalysis());
  }, []);

  const handleGenerateDemandAnalysis = async () => {
    setError(null);
    try {
      const RangeValue = {
        minValue,
        maxValue
      };
      console.log('Generating', RangeValue);
      const response = await getDemandAnalysisData(RangeValue);
      console.log(response.data, 'data ayaaa');
      setTableNewDmdAnalysis(response.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  const handleProceedClick = async () => {
    try {
      loggedInUserRole
      const isAutoHearing = appealType === '1';
      const res = await applyAppealRatioWise(tableNewDmdAnalysis, appealTable, isAutoHearing, loggedInUserRole)
      if (res.status = 200) {
        snackbarMessage('Hearing Applied Successfully')
        snackbarSeverity('success')
        snackbarOpen(true)
      }
    } catch (error) {
      console.log(error.message,'Error in  Applying Hearing')
      snackbarMessage('Error in  Applying Hearing')
      snackbarSeverity('error')
      snackbarOpen(true)
    }

  };

  return (
    <>
      <MainCard>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Property Details Wise" icon={<BookOutlined />} iconPosition="start" {...a11yProps(0)} />
              <Tab label="Tax Analysis Wise" icon={<BookOutlined />} iconPosition="start" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {/* title */}
            <MainCard title="Auto Hearing Appeal" style={{ color: 'blue', fontWeight: 'bold' }}>
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
                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel>Select Criteria</InputLabel>
                    <Select labelId="select-criteria" id="select-criteria" value={selectedCriteria} onChange={handleCriteriaChange}>
                      <MenuItem value="0">Construction Type</MenuItem>
                      <MenuItem value="1">Type of Use</MenuItem>
                    </Select>{' '}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel>Select Appeal Type</InputLabel>
                    <Select labelId="select-appeal-type" id="select-appeal-type" value={appealType} onChange={handleAppealTypeChange}>
                      <MenuItem value="0">Appeal</MenuItem>
                      <MenuItem value="1">Hearing</MenuItem>
                    </Select>{' '}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel>Ward:</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflowY: 'auto'
                          }
                        }
                      }}
                      open={open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      style={{ height: '35px' }}
                      value={selectedWard}
                      multiple
                      displayEmpty
                      renderValue={(selected) => (Array.isArray(selected) && selected.length ? selected.join(', ') : 'Select Ward')}
                    >
                      <MenuItem key="all" value="ALL" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectAll} onChange={() => handleCheckboxChange('ALL')} />
                        ALL
                      </MenuItem>
                      {wardNoList.map((ward, index) => (
                        <MenuItem key={index} value={ward.NewWardNo} onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={selectedWard.includes(ward.NewWardNo)} onChange={() => handleCheckboxChange(ward.NewWardNo)} />
                          {ward.NewWardNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>
              </Grid>

              <Box mb={1} mt={2}>
                <hr />
              </Box>
              {/* table */}
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
                {isConstructionType && (
                  <Grid item xs={12} sm={5}>
                    <div className="card" style={{ marginTop: '6px' }}>
                      <Card>
                        <CardContent>
                          <Box sx={{ overflowX: 'auto', height: '250px' }}>
                            <Table>
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell>Construction Type</TableCell>
                                  <TableCell>Percentage (%)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {constructionsList.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.ConstructionId}</TableCell>
                                    <TableCell>
                                      <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        autoComplete="off"
                                        InputProps={{
                                          endAdornment: '%'
                                        }}
                                        value={constructionPercentages[item.ConstructionId] || ''}
                                        onChange={(e) =>
                                          setConstructionPercentages((prev) => ({
                                            ...prev,
                                            [item.ConstructionId]: e.target.value
                                          }))
                                        }
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid>
                )}

                {isTypeOfUse && (
                  <Grid item xs={12} sm={5}>
                    <div className="card" style={{ marginTop: '6px' }}>
                      <Card>
                        <CardContent>
                          <Box sx={{ overflowX: 'auto', height: '250px' }}>
                            <Table>
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell>Type Of Use</TableCell>
                                  <TableCell>Percentage (%)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {typesOfUseList.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.Description}</TableCell>
                                    <TableCell>
                                      <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        autoComplete="off"
                                        InputProps={{
                                          endAdornment: '%'
                                        }}
                                        value={typeOfUsePercentages[item.Description] || ''}
                                        onChange={(e) =>
                                          setTypeOfUsePercentages((prev) => ({
                                            ...prev,
                                            [item.Description]: e.target.value
                                          }))
                                        }
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid>
                )}
              </Grid>

              {/* table */}
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
                <Grid item xs={10} sm={2} mt={3}>
                  <Stack spacing={0}>
                    <Button variant="contained" color="success" onClick={handleSave}>
                      Save
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={10} sm={2} mt={3}>
                  <Stack spacing={0}>
                    <Button variant="contained" color="secondary">
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>

            {/*  */}

            {/*  */}
          </TabPanel>

          {/* //2nd page tab */}

          <TabPanel value={value} index={1}>
            {/* title */}
            <MainCard title="Auto Hearing Appeal" style={{ color: 'blue', fontWeight: 'bold' }}>
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
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel>Select Appeal Type</InputLabel>
                    <Select labelId="select-appeal-type" id="select-appeal-type">
                      <MenuItem value="0">Appeal</MenuItem>
                      <MenuItem value="1">Hearing</MenuItem>
                    </Select>{' '}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel>Min Value</InputLabel>
                    <TextField
                      placeholder="Enter Min Value"
                      type="number"
                      value={minValue}
                      onChange={(e) => handleMinChange(e)}
                    ></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel>Max Value</InputLabel>
                    <TextField placeholder="Enter Min Value" type="number" value={maxValue} onChange={handleMaxChange}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel>Select Latest One</InputLabel>
                    <Select labelId="select-appeal-type" id="select-appeal-type" onChange={(event) => (setAppealType(event.target.value))} >
                      <MenuItem value="Latest">Latest</MenuItem>
                      <MenuItem value="Net">Net</MenuItem>
                      <MenuItem value="Retention">Retention</MenuItem>
                      <MenuItem value="Hearing">Hearing</MenuItem>
                      <MenuItem value="Appeal committee">Appeal committee</MenuItem>
                      <MenuItem value="Remission">Remission</MenuItem>
                    </Select>{' '}
                  </Stack>
                </Grid>
              </Grid>

              {/* button */}
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
                <Grid item xs={10} sm={2} mt={3}>
                  <Stack spacing={0}>
                    <Button variant="contained" color="success" onClick={handleAddRange}>
                      Add Range
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={10} sm={2} mt={3}>
                  <Stack spacing={0}>
                    <Button variant="contained" color="info" onClick={handleGenerateDemandAnalysis}>
                      Generate
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={10} sm={2} mt={3}>
                  <Stack spacing={0}>
                    <Button variant="contained" color="secondary">
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={10} sm={2} mt={3}>
                  <Stack spacing={0}>
                    <Button variant="contained" color="success" onClick={handleProceedClick}>
                      Proceed
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
            <Box mt={2}></Box>
            <MainCard>
              {/* table */}
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
                <Grid item xs={12} sm={12}>
                  <Box className="card" style={{ marginTop: '20px' }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
                          Total Gross Properties Demand{' '}
                        </Typography>
                        <Grid sx={{ marginLeft: '65vw' }}>
                          <CSVExport data={tableNewDmdAnalysis} headers={headers} filename="auto-hearing-appeal-comm.csv" />
                        </Grid>
                        <Box sx={{ overflowX: 'auto', height: '300px' }}>
                          {/* Table */}
                          <Table>
                            {/* Table Header */}
                            <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                              <TableRow>
                                <TableCell>Reason</TableCell>
                                <TableCell> Properties</TableCell>
                                <TableCell>Old RV</TableCell>
                                <TableCell>Old Prop Demand</TableCell>
                                <TableCell>Old Total Demand</TableCell>
                                <TableCell> New RV </TableCell>
                                <TableCell>New Prop Demand</TableCell>
                                <TableCell> New Total Demand </TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell> Final Property Demand</TableCell>
                                <TableCell>Final Total Demand</TableCell>
                              </TableRow>
                            </TableHead>
                            {/* Table Body */}
                            <TableBody>
                              {tableNewDmdAnalysis.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{row?.reason}</TableCell>
                                  <TableCell> {row?.Properties}</TableCell>
                                  <TableCell>{row?.OldRV}</TableCell>
                                  <TableCell>{row?.OldPropDmd}</TableCell>
                                  <TableCell>{row?.OldTotDmd}</TableCell>
                                  <TableCell>{row?.NewRV} </TableCell>
                                  <TableCell>{row?.NewPropDmd}</TableCell>
                                  <TableCell>{row?.NewTotDmd} </TableCell>
                                  <TableCell>{row?.Discount}</TableCell>
                                  <TableCell>{row?.FinalPropDmd}</TableCell>
                                  <TableCell>{row?.FinalTotDmd}</TableCell>
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
            </MainCard>

            <Box mt={2}></Box>
            <MainCard>
              {/* table */}
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
                <Grid item xs={12} sm={12}>
                  <div className="card" style={{ marginTop: '6px' }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
                          Total Gross Properties Demand{' '}
                        </Typography>
                        <Grid sx={{ marginLeft: '65vw' }}>
                          <CSVExport data={data2} headers2={headers2} filename="auto-hearing-appeal-comm2.csv" />
                        </Grid>
                        <Box sx={{ overflowX: 'auto', height: '300px' }}>
                          {/* Table */}
                          <Table>
                            {/* Table Header */}
                            <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                              <TableRow>
                                <TableCell>Reason</TableCell>
                                <TableCell> Properties</TableCell>
                                <TableCell>Old RV</TableCell>
                                <TableCell>Old Prop Demand</TableCell>
                                <TableCell>Old Total Demand</TableCell>
                                <TableCell> New RV </TableCell>
                                <TableCell>New Prop Demand</TableCell>
                                <TableCell> New Total Demand </TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell> Property Demand</TableCell>
                                <TableCell>Total Demand</TableCell>
                              </TableRow>
                            </TableHead>

                            {/* Table Body */}
                            <TableBody>
                              {tableOldDmdAnalysis.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{row.reason}</TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </CardContent>
                    </Card>
                  </div>
                </Grid>
                {/* table2 */}
              </Grid>
            </MainCard>

            {/*  */}

            {/*  */}
          </TabPanel>
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SnackbarContent
            sx={{
              backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
              color: 'white',
              width: '100%',
              fontWeight: 'bold'
            }}
            message={snackbarMessage}
          />
        </Snackbar>
      </MainCard>

    </>
  );
}

export default AutoHearingAppealComm;
