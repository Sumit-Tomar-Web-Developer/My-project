// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  Radio,
  Typography,
  FormControlLabel,
  RadioGroup,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
  Checkbox,
  FormLabel
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchFinancialYear } from 'services/appeal.services';
import { fetchAllTableInfo } from 'services/data-entry.services';

// ==============================|| Report Engine PAGE ||============================== //

function ReportEngine() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [selectedValue, setSelectedValue] = useState();
  const [singleReport, setSingleReport] = useState();
  const [combineReport, setCombineReport] = useState();
  const [showCheckbox, setShowCheckbox] = useState(false);

  const [reportType, setReportType] = useState(0);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleReportChange = (event) => {
    setReportType(event.target.value);
  };

  const handleShowFilterClick = () => {
    setShowCheckbox(!showCheckbox);
  };

  const handleSaveClick = () => {
    console.log('saved');
  };

  //select proeprty
  const [selectedNumbersProp, setSelectedNumbersProp] = useState([]);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [wardList, setWardList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [financialYear, setFinancialYear] = useState('');
  const [selectedOwnerID, setSelectedOwnerID] = useState('');
  const [propertiesData, setPropertiesData] = useState({});

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        const wardList = await fetchWards();
        const sortedWardList = wardList.sort((a, b) => a.NewWardNo - b.NewWardNo); // Sort by NewWardNo in ascending order
        console.log('Sorted wardList:', sortedWardList);
        setWardList(sortedWardList);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchWardList();
  }, []);

  useEffect(() => {
    fetchFinancialYear()
      .then((yearList) => {
        setFinancialYearList(yearList);
      })
      .catch((err) => {
        console.error('Error fetching financial years:', err);
      });
  }, []);

  // Effect to fetch data when selectedOwnerID changes from redux
  useEffect(() => {
    {
      fetchAllTableInfo(selectedOwnerID).then((res) => {
        console.log(res, 'data recieved');
        setPropertiesData(res.PropertyInfo);
      });
    }
  }, [selectedOwnerID]);
  // This function will handle generating the PDF
  const generatePDF = (propertiesData) => {
    console.log(propertiesData, 'data found');

    const doc = new jsPDF();

    // Define the margin
    const marginTop = 20;

    // Add Title
    doc.setFontSize(16);
    doc.text('Amravati Nagar Parishad Tax Assessment Report', 20, marginTop);

    // Add Report Date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Report Generated on: ${date}`, 20, marginTop + 10); // Position below the title

    // Set up the document title and initial style
    doc.setFontSize(18);

    // Set up column headers for the table
    const headers = ['OwnerID', 'PropertyTypeID', 'OwnerTitle', 'OwnerName', 'PlotArea', 'PropertyRemark', 'EmailID'];

    // Set up data for the table
    const tableData = propertiesData.propertyMast
      ? [
          [
            propertiesData.propertyMast.OwnerID,
            propertiesData.propertyMast.PropertyTypeID,
            propertiesData.propertyMast.OwnerTitle,
            propertiesData.propertyMast.OwnerName,
            propertiesData.propertyMast.PlotArea,
            propertiesData.propertyMast.PropertyRemark,
            propertiesData.propertyMast.EmailID
          ]
        ]
      : [];

    // Add the table to the PDF
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 0, 0],
        textColor: [255, 255, 255]
      }
    });

    // Save the PDF with a name
    doc.save('property-details.pdf');

    // Reset the flag to allow for PDF generation next time
    setPdfGenerated(false);
  };
  const handleNumberChangeProp = (event) => {
    setSelectedNumbersProp(event.target.value);
  };

  const handleRadioChange = (e) => {
    const radioId = e.target.id;
    if (radioId === 'singleProperty') {
      setSelectedOverlay('singleProperty');
    } else if (radioId === 'propertyRange') {
      setSelectedOverlay('propertyRange');
    } else if (radioId === 'selectedPropertyFromRange') {
      setSelectedOverlay('selectedpropertyRange');
    } else {
      setSelectedOverlay(null);
    }
  };

  const handleWardChange = async (event) => {
    const ward = event.target.value;
    setSelectedWard(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setSelectedOwnerID(properties.OwnerID);

      console.log(selectedOwnerID, 'idd');
      //setpropertyNoListTo(propertyRange.properties);
      //setpropertyNoListFrom(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };
  const handleChangeYear = async (event) => {
    setFinancialYear(event.target.value);
  };
  return (
    <MainCard title=" Generate Report  ">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <MainCard>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <Stack spacing={1}>
                  <InputLabel>Year</InputLabel>
                  <FormControl fullWidth>
                    <InputLabel id="select-demand-type-label">Year</InputLabel>
                    <Select onChange={handleChangeYear} value={financialYear}>
                      <MenuItem value="" disabled>
                        Select Option
                      </MenuItem>
                      {financialYearList.map((fin) => (
                        <MenuItem key={fin.FinanceYearRange} value={fin.FinanceYearRange}>
                          {fin.FinanceYearRange}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Stack spacing={1}>
                  <InputLabel>Ward</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      id="ward-select"
                      placeholder="ward no"
                      value={selectedWard}
                      onChange={handleWardChange}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflowY: 'auto'
                          }
                        }
                      }}
                      // error={!!error.selectedWard}
                      // helperText={error.selectedWard}
                      // FormHelperTextProps={{ style: { color: 'red' } }}
                    >
                      {wardList.map((ward) => (
                        <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                          {ward.NewWardNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={4}>
          <MainCard>
            <Typography sx={{ mb: 2 }} variant="h5" style={{ color: '#1677ff' }}>
              Update Properties
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={11}>
                    <Stack spacing={1}>
                      <RadioGroup value={selectedValue} onChange={handleRadioChange}>
                        <FormControlLabel
                          control={<Radio value="Single Property" name="propertyType" id="singleProperty" />}
                          label="Single Property"
                        />
                        <FormControlLabel
                          control={<Radio name="propertyType" id="propertyRange" value="Property Range" />}
                          label="Property Range"
                        />
                        <FormControlLabel
                          control={<Radio name="propertyType" id="selectedPropertyFromRange" value="Selected Property From Range" />}
                          label="Selected Property From Range"
                        />
                      </RadioGroup>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          {selectedOverlay === 'singleProperty' && (
            <MainCard title="Single Property No" variant="h5" style={{ color: '#1677ff' }}>
              <Box boxShadow={3} padding={2}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>Enter Property No</InputLabel>
                    <TextField value={selectedOwnerID} onChange={(e) => setSelectedOwnerID(e.target.value)} />
                  </Stack>
                </Grid>
              </Box>
            </MainCard>
          )}

          {selectedOverlay === 'propertyRange' && (
            <MainCard>
              <Box boxShadow={3} padding={2}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel>From Property</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          id="from-select"
                          value={selectedWard}
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
                          {[...Array(200).keys()].map((number) => (
                            <MenuItem key={number + 1} value={number + 1}>
                              {number + 1}
                            </MenuItem>
                          ))}
                          <MenuItem key="all" value="all">
                            All
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel>Till</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          id="till-select"
                          value={selectedWard}
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
                          {[...Array(200).keys()].map((number) => (
                            <MenuItem key={number + 1} value={number + 1}>
                              {number + 1}
                            </MenuItem>
                          ))}
                          <MenuItem key="all" value="all">
                            All
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </MainCard>
          )}

          {selectedOverlay === 'selectedpropertyRange' && (
            <MainCard>
              <Box sx={{ border: '2px solid gray', width: '250px', height: '150px' }}></Box>
            </MainCard>
          )}
        </Grid>

        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel component="legend" variant="h5" style={{ color: '#1677ff' }}>
                    Format
                  </FormLabel>
                  <RadioGroup row aria-label="options" name="options" value={selectedValue} onChange={handleChange}>
                    <FormControlLabel value="option1" control={<Radio />} label="RPT" />
                    <FormControlLabel value="option2" control={<Radio />} label="Pdf" />
                    <FormControlLabel value="option3" control={<Radio />} label="Word" />
                    <FormControlLabel value="option4" control={<Radio />} label="Excel" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* <Box boxShadow={3} padding={2}> */}
                <InputLabel variant="h5" style={{ color: '#1677ff' }}>
                  Group By
                </InputLabel>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <FormControl>
                      <FormControlLabel
                        control={<Checkbox checked={combineReport} onChange={(e) => setCombineReport(e.target.checked)} />}
                        label="All in Combine"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl>
                      <FormLabel component="legend" variant="h5" style={{ color: '#1677ff' }}></FormLabel>
                      <FormControlLabel
                        control={<Checkbox checked={singleReport} onChange={(e) => setSingleReport(e.target.checked)} />}
                        label="Single Report"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id="report-select-label">Search Report </InputLabel>
                  <Select labelId="report-select-label" id="report-select" value={reportType} onClick={handleReportChange}>
                    <MenuItem value={0}>Assessment Prime Report</MenuItem>
                    <MenuItem value={1}>Assessment Final Report</MenuItem>
                    <MenuItem value={2}>119 Notice</MenuItem>
                    <MenuItem value={3}>Kae Akarani</MenuItem>
                    <MenuItem value={4}>Kae Akarani With Non Tax Type</MenuItem>
                    <MenuItem value={5}>Assessment Nakkal</MenuItem>
                    <MenuItem value={6}>Bill</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handleShowFilterClick}>
                      {showCheckbox ? 'Hide Filter' : 'Show Filter'}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="info" onClick={() => generatePDF(propertiesData)}>
                      Show
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {showCheckbox && (
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<FormControlLabel control={<Checkbox />} />} label="Is Zero Tax Property" />
                  <Button variant="contained" color="success" onClick={handleSaveClick}>
                    Save
                  </Button>
                </Grid>
              )}
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default ReportEngine;
