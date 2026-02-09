// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  Button,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  TextField,
  SnackbarContent,
  Snackbar 
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { comparatativeStatement } from '../../../services/report/demandAnalysis/demandAnalysis.js';
// ==============================|| SAMPLE PAGE ||============================== //

function DemandAnalysis() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [showMinMaxInputs, setShowMinMaxInputs] = useState(false);

  const [showDemandTable, setShowDemandTable] = useState(false);
  const [tableData, setTableData] = useState();
  const [showAnalysisTable, setShowAnalysisTable] = useState(false);
  const [showExtraButton, setShowExtraButton] = useState(false);
  const [generateAnalysis, setGenerateAnalysis] = useState(false);
 const [snackbarOpen, setSnackbarOpen] = useState(false);
   const [snackbarSeverity, setSnackbarSeverity] = useState('success');
   const [receivedMessage, setReceivedMessage] = useState('');
  //export
  const handleExportButtonClick = async() => {
    if (!tableData.length) return;
  
      // Create Workbook
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Demand Analysis');
  
      // Dynamic headers from the first object
      const headers = Object.keys(tableData[0]);
  
      // Add header row
      sheet.addRow(headers);
  
      // Add data rows
      tableData.forEach((row) => {
        const rowData = headers.map((h) => row[h] ?? '');
        sheet.addRow(rowData);
      });
  
      // Auto column width
      sheet.columns.forEach((column) => {
        column.width = 20;
      });
  
      // Export as file
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), 'Demand_Analysis.xlsx');
  };
 

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    setSelectedOption(selectedValue);

    // Show inputs only when "Select an option" is selected
    setShowMinMaxInputs(selectedValue === 0);

    // Reset other states based on the selected value
    if (selectedValue === 0) {
      setShowDemandTable(false);
      setShowAnalysisTable(false);
      setShowExtraButton(false);
      setGenerateAnalysis(false);
    } else if (selectedValue === 1) {
      setShowDemandTable(false);
      setShowAnalysisTable(false);
      setShowExtraButton(true);
      setGenerateAnalysis(false);
    } else if (selectedValue === 2) {
      setShowDemandTable(false);
      setShowAnalysisTable(true);
      setShowExtraButton(false);
      setGenerateAnalysis(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleGenerateChange = async () => {
    if (selectedOption === 1) {
      try {
        const { data, status } = await comparatativeStatement();

        if (status === 200 && Array.isArray(data) && data.length > 0) {
          setTableData(data);
          setShowDemandTable(true);
        } else {
          setSnackbarOpen(true);
          setSnackbarSeverity('error');
          setReceivedMessage('No data found for comparatativeStatement');
          setTableData([]);
          setShowDemandTable(false);
        }
      } catch (error) {
        setTableData([]);
        setShowDemandTable(false);
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(error?.response?.data?.message || 'Failed to get comparatativeStatement ');
      } finally {
        setOpenLoader(false);
      }
    }
  };

  const handleAnalysisChange = () => {
    setGenerateAnalysis(true);
  };

  //generate table on generate button click of Comparative Statement
  const GenerateTable = () => {
    return (
      <Box width="100%" height="250px" overflow="auto">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Particulars</TableCell>
                <TableCell>Properties</TableCell>
                <TableCell>Before Assess Demand</TableCell>
                <TableCell>New Total Demand</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>शहरlतील जुने मालमत्ता इमारत</TableCell>
                <TableCell>3508</TableCell>
                <TableCell>1513125</TableCell>
                <TableCell>10041504</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>अंशात आकारणी केलेल्या मालमत्ता इमारत</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
                <TableCell>0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>वाढीव मालमत्ता इमारत, शहरlतील एकूण कर निरंक असलेल्या मालमत्ता इमारत, एकूण मालमत्ता इमारत</TableCell>
                <TableCell>5696</TableCell>
                <TableCell>139180</TableCell>
                <TableCell>10360250</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>शहरlतील एकूण कर निरंक असलेल्या मालमत्ता इमारत</TableCell>
                <TableCell>5696</TableCell>
                <TableCell>139180</TableCell>
                <TableCell>10360250</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-danger">एकूण मालमत्ता इमारत</TableCell>
                <TableCell className="bg-danger">5696</TableCell>
                <TableCell className="bg-danger">139180</TableCell>
                <TableCell className="bg-danger">10360250</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>शहरlतील ख्रुलू भूखंड</TableCell>
                <TableCell>5696</TableCell>
                <TableCell>139180</TableCell>
                <TableCell>10360250</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  //generate table on generate button click of demamd analysis click
  const GenerateAnalysisTable = () => {
    return (
      <Box width="100%" height="250px" overflow="auto">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reason</TableCell>
                <TableCell>Properties</TableCell>
                <TableCell>Percents</TableCell>
                <TableCell>Old RV</TableCell>
                <TableCell>Old Demand</TableCell>
                <TableCell>Old Prop.Demand</TableCell>
                <TableCell>New RV</TableCell>
                <TableCell>New Demand</TableCell>
                <TableCell>New Prop Demand</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1-2</TableCell>
                <TableCell>572</TableCell>
                <TableCell></TableCell>
                <TableCell>1512973</TableCell>
                <TableCell>309906</TableCell>
                <TableCell>229708</TableCell>
                <TableCell>22920005</TableCell>
                <TableCell>889631</TableCell>
                <TableCell>548023</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  //side ui on selecting tab3
  const DemandAnalysisTable = () => {
    return (
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Stack spacing={1}>
              <InputLabel>Max Value</InputLabel>
              <TextField required placeholder="Enter max value" />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Stack spacing={1}>
              <InputLabel>Min Value</InputLabel>
              <TextField required placeholder="Enter min value" />
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12} sm={4}>
            <Stack spacing={1}>
              <Button variant="contained" color="primary" onClick={handleAnalysisChange}>
                Add Range
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Stack spacing={1}>
              <Button variant="contained" color="info" onClick={handleExportButtonClick}>
                Generate
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    );
  };

  return (
    <MainCard title="Demand Analysis">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <MainCard>
            <Grid item xs={12} sm={4}>
              <Stack spacing={1}>
                <InputLabel style={{ color: '#1677ff' }}>Select List</InputLabel>
                <Select id="list-select" value={selectedOption} onChange={handleSelectChange}>
                  <MenuItem value={0}>Select an option</MenuItem>
                  <MenuItem value={1}>Comparative Statement</MenuItem>
                  <MenuItem value={2}>Demand Analysis</MenuItem>
                </Select>
              </Stack>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
              {showExtraButton && ( // Conditional rendering of the generate button
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="primary" onClick={handleGenerateChange}>
                      Generate
                    </Button>
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <Stack spacing={1}>
                  <Button variant="contained" color="info" onClick={handleExportButtonClick}>
                    Export To Excel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6}>
          {showAnalysisTable && !showDemandTable && <DemandAnalysisTable />}
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12}>
        {showDemandTable && !generateAnalysis && (
          <MainCard>
            {/* Show table when tableData has data */}
            {tableData?.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  maxHeight: 350,
                  overflowX: 'auto',
                  overflowY: 'auto',
                  border: '1px solid #ccc',
                  whiteSpace: 'nowrap'
                }}
              >
                <Table sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow sx={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff' }}>
                      {Object.keys(tableData[0]).map((header) => (
                        <TableCell key={header}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tableData.map((row, i) => (
                      <TableRow key={i}>
                        {Object.keys(tableData[0]).map((header) => (
                          <TableCell key={header}>{row[header] ?? ''}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </MainCard>
        )}
      </Grid>

      <Grid item xs={12} sm={12}>
        {/* Show Generate Analysis Table when showAnalysisTable is true */}
        {generateAnalysis && (
          <MainCard>
            <GenerateAnalysisTable />
          </MainCard>
        )}
      </Grid>
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
    </MainCard>
    
  );
}

export default DemandAnalysis;
