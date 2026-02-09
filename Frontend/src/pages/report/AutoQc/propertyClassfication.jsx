import React, { useEffect } from 'react';
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Tab,
  Tabs,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Typography,
  FormControlLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress

} from '@mui/material';
import { useState } from 'react';
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import MainCard from 'components/MainCard';
import { fetchPropertyDescription } from 'services/data-entry.services';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { getTransYear } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import { fetchPropertyCountByDescription, getPropertyClassificationData } from 'services/report/autoQc/propertyClassification/propertyClassification'

const PropertyClassification = () => {
  const [propertyDesc, setPropertyDesc] = useState([]);
  const [countedList, setCountedList] = useState([])
  const [filterDesc, setFilterDesc] = useState([]);
  const [isFilterSelected, setIsFilterSelected] = useState();
  const [showTable, setShowTable] = useState(false);
  const [showAllTable, setShowAllTable] = useState(false);
  const [isCurrentChecked, setIsCurrentChecked] = useState(false);
  const [isPendingChecked, setIsPendingChecked] = useState(false);
  const selectFilter = ['Old Rv', 'Old TAX', 'New Rv', 'New Tax'];
  const [open, setOpen] = useState(false);
  const [openDescr, setOpenDescr] = useState(false);
  const [propDescriptionList, setPropDescriptionList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [receivedStatus, setReceivedStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tableData, setTableData] = useState([])
  const [openloader, setOpenloader] = useState(false);
  const [currentHeader, setCurrentHeader] = useState([])
  const [pendingHeader, setPendingHeader] = useState([])
  const propertyHeaders = ["NewWardNo", "NewPropertyNo", "NewPartitionNo", "OwnerName", "Address", "OccupierName", "BuildingOrShopName"];
  const oldHeaders = ["OldWardNo", "OldPropertyNo", "OldPartitionNo", "OldRV", "OldTotalTax"];
  const totalHeaders = ["RateableValue", "TaxTotal"];
  const [originalTableData, setOriginalTableData] = useState([]);


  useEffect(() => {
    fetchPropertyDescription()
      .then((fetchproperty) => {
        setPropDescriptionList(fetchproperty);
      })
      .catch((error) => {
        console.error('Error fetching property description:', error);
      });
  }, []);
  const handleFilterButtonClick = () => {
    const filterMap = {
      "Old Rv": "OldRV",
      "Old TAX": "OldTotalTax",
      "New Rv": "RateableValue",
      "New Tax": "TaxTotal",
    };
    console.log(filterDesc, 'filterDesc')
    // If nothing selected, show all
    if (!filterDesc.length) {
      return setTableData(originalTableData);
    }
    setOpenloader(true);
    const filteredData = originalTableData.reduce((acc, row) => {

      const from = Number(fromValue || 0);
      const to = Number(toValue || Infinity);

      // Check ANY selected filter
      const match = filterDesc.some((desc) => {
        const key = filterMap[desc];
        if (!key) return false;

        const value = row[key];

        // Skip if null, undefined, or empty string
        if (value === null || value === undefined || value === '') return false;

        const numericValue = Number(value);
        return numericValue >= from && numericValue <= to;
      });

      if (match) acc.push(row);

      return acc;
    }, [filterDesc]);


    setTableData(filteredData);
    setOpenloader(false);
  };




  useEffect(() => {
    const fetchWardList = async () => {
      try {
        const wardlist = await fetchWards();
        const sortedWardList = wardlist.sort((a, b) => a.NewWardNo - b.NewWardNo); // Sort by NewWardNo in ascending order
        console.log('Sorted wardList:', sortedWardList);
        setWardList(sortedWardList);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchWardList();
  }, []);
  useEffect(() => {
    const yearTransList = async () => {
      try {
        const yearList = await getTransYear();
        console.log(yearList, 'API Response');
        setFinancialYearList(yearList);
      } catch (error) {
        console.error('Error fetching year list:', error);
        setFinancialYearList([]);
      }
    };
    yearTransList();
  }, []);
  useEffect(() => {
    if (tableData.length > 0) {
      const sampleRow =
        tableData.find(r =>
          Object.keys(r).some(
            k => k.startsWith("current_") || k.startsWith("pending_")
          )
        ) || tableData[0];

      const current = Object.keys(sampleRow).filter(k =>
        k.startsWith("current_")
      );
      const pending = Object.keys(sampleRow).filter(k =>
        k.startsWith("pending_")
      );

      setCurrentHeader(current);
      setPendingHeader(pending);
    }
  }, [tableData]);

  useEffect(() => {


  }, [currentHeader, pendingHeader, openloader, tableData, originalTableData, snackbarOpen]);
  useEffect(() => {

    if (!isFilterSelected) {


      setFilterDesc([]); // Clear all selected

    }
  }, [isFilterSelected])
  useEffect(() => {
    const propertyCountByDescription = async () => {
      try {
        if (selectedDescriptions.length > 0) {
          const result = await fetchPropertyCountByDescription(selectedDescriptions, selectedWard);
          const data = result.data;

          // Create a map of PropertyTypeID → count
          const countMap = Object.fromEntries(data.map(item => [item.PropertyTypeID, item.count]));

          // Filter and map descriptions along with their counts
          const filterList = propDescriptionList
            .filter(row => countMap[row.PropertyTypeID] !== undefined)
            .map(row => ({
              description: row.PropertyDescription,
              count: countMap[row.PropertyTypeID]
            }));

          setCountedList(filterList);

          console.log(filterList, 'filterList');
        }

      } catch (error) {
        console.log(error.message, 'Error in fetching property count by property descirption')

      }

    }
    propertyCountByDescription()
  }, [selectedDescriptions])
  useEffect(() => {
    console.log(filterDesc, 'filterDesc')
  }, [countedList, snackbarOpen, tableData, filterDesc, originalTableData])

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDescr = () => {
    setOpenDescr(false);
  };

  const handleShowDataClick = async () => {

    if (!selectedWard) {
      setReceivedMessage('Please select ward')
      setReceivedStatus('error')
      setSnackbarOpen(true)
      return
    }

    if (selectedDescriptions.length <= 0) {
      setReceivedMessage('Please select description')
      setReceivedStatus('error')
      setSnackbarOpen(true)
      return
    }

    if (!selectedYear) {
      setReceivedMessage('Please select year')
      setReceivedStatus('error')
      setSnackbarOpen(true)
      return
    }
    // setShowTable(true);
    setOpenloader(true);
    const result = await getPropertyClassificationData(selectedWard, selectedYear, selectedDescriptions, isCurrentChecked, isPendingChecked)
    console.log(result.data, 'taxes')
    // const flattenedResult = result.data.map(owner => {
    //   const flatOwner = {
    //     OwnerID: owner.OwnerID,
    //     OwnerName: owner.propertyMast?.OwnerName,
    //     Address: owner.propertyMast?.Address,
    //     NewWardNo: owner.propertyMast?.NewWardNo,
    //     NewPropertyNo: owner.propertyMast?.NewPropertyNo,
    //     NewPartitionNo: owner.propertyMast?.NewPartitionNo,
    //     OccupierName: owner.propertyMast?.OccupierName,
    //     BuildingOrShopName: owner.propertyMast?.BuildingOrShopName,
    //   };

    //   // Old Property
    //   if (owner.oldPropertyMast?.[0]) {
    //     const old = owner.oldPropertyMast[0];
    //     flatOwner.OldWardNo = old.OldWardNo;
    //     flatOwner.OldPropertyNo = old.OldPropertyNo;
    //     flatOwner.OldPartitionNo = old.OldPartitionNo;
    //     flatOwner.OldRV = old.OldRV;
    //     flatOwner.OldTotalTax = old.OldTotalTax;
    //   }

    //   // Total Tax
    //   if (owner.totalTax?.[0]) {
    //     const total = owner.totalTax[0];
    //     flatOwner.RateableValue = total.RateableValue;
    //     flatOwner.TaxTotal = total.TaxTotal;
    //   }

    //   // Current Taxes
    //   if (owner.currentTaxes?.[0]) {
    //     Object.assign(flatOwner, owner.currentTaxes[0]);
    //   }

    //   // Pending Taxes
    //   if (owner.pendingTaxes?.[0]) {
    //     Object.assign(flatOwner, owner.pendingTaxes[0]);
    //   }

    //   return flatOwner;

    // });

    setTableData(result.data)
    setShowTable(true);
    setOpenloader(false);
    setOriginalTableData(result.data)

    console.log(result.data, 'result.data')
  };


  //for property description select
  const HandleFilterDescChange = (value) => {
    setFilterDesc((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };


  const handleCheckboxChange = (event) => {
    if (!selectedWard) {
      setOpenDescr(true); // Open dialog if ward is not selected
      return;
    }


    const {
      target: { value }
    } = event;
    console.log(value, 'value')
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setSelectedDescriptions(selectedValues);

    // Show table if at least one description is selected
    setShowAllTable(selectedValues.length > 0);

    // Update 'Select All' checkbox status
    setSelectAll(selectedValues.length === propDescriptionList.length);
  };



  // Handle 'All' checkbox change
  const handleSelectAll = () => {
    if (!selectedWard) {
      setOpenDescr(true); // Open dialog if ward is not selected
      return;
    }
    if (selectAll) {
      setSelectedDescriptions([]);
      setShowAllTable(false); // Hide table when deselecting all
    } else {
      const allDescriptions = propDescriptionList.map((item) => item.PropertyTypeID);
      setSelectedDescriptions(allDescriptions);
      setShowAllTable(true); // Show table when selecting all
    }
    setSelectAll(!selectAll);
  };
  
  const generateDescriptionList = async () => {



    if (!countedList.length) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Property Summary");

    // Header
    sheet.addRow(["Property Classification", "Total"]);

    // Rows
    countedList.forEach(item => {
      sheet.addRow([
        item.description ?? "",
        item.count ?? 0,
      ]);
    });

    // Auto column width
    sheet.columns = [
      { width: 30 },
      { width: 12 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "PropertySummary.xlsx");

  }
  const generatePropertyList = async () => {

    if (!tableData.length) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Property Classification");

    // Build headers array
    let headers = [
      ...propertyHeaders,
      ...oldHeaders,
      ...totalHeaders,
    ];

    if (isCurrentChecked) {
      headers.push(...currentHeader.map(h => h.replace("current_", "Current_")));
    }
    if (isPendingChecked) {
      headers.push(...pendingHeader.map(h => h.replace("pending_", "Pending_")));
    }

    // Add header row
    sheet.addRow(headers);

    // Add data rows
    tableData.forEach(row => {
      let rowData = [];

      propertyHeaders.forEach(h => rowData.push(row[h] ?? ""));
      oldHeaders.forEach(h => rowData.push(row[h] ?? ""));
      totalHeaders.forEach(h => rowData.push(row[h] ?? ""));

      if (isCurrentChecked) {
        currentHeader.forEach(h => rowData.push(row[h] ?? ""));
      }
      if (isPendingChecked) {
        pendingHeader.forEach(h => rowData.push(row[h] ?? ""));
      }

      sheet.addRow(rowData);
    });

    // Auto column width
    sheet.columns.forEach(column => {
      column.width = 18;
    });

    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "PropertyClassification.xlsx");
  }

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Ward No</InputLabel>
            <FormControl fullWidth>
              <Select
                value={selectedWard}
                onChange={(event) => setSelectedWard(event.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      overflowY: 'auto'
                    }
                  }
                }}
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
        <Dialog open={openDescr} onClose={handleCloseDescr}>
          <DialogTitle>Quality Control</DialogTitle>

          <DialogContent>
            <Typography>Please select ward no</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDescr} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel id="property-description-label">Property Classification</InputLabel>
            <FormControl fullWidth>
              <Select
                multiple
                value={selectedDescriptions}
                onChange={handleCheckboxChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 5 + 8, // 48px per item * 5 items + 8px padding
                      width: 250,
                    },
                  },
                }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return 'Select Description';
                  }
                  return selected
                    .map((id) => {
                      const description = propDescriptionList.find((item) => item.PropertyTypeID === id);
                      return description ? description.PropertyDescription : '';
                    })
                    .join(', ');
                }}
              >
                {/* All option */}
                <MenuItem value="All">
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                  <ListItemText primary="All" />
                </MenuItem>

                {/* Property descriptions with checkboxes */}
                {propDescriptionList.map((user, index) => (
                  <MenuItem key={index} value={user.PropertyTypeID}>
                    <Checkbox checked={selectedDescriptions.includes(user.PropertyTypeID)} />
                    <ListItemText primary={user.PropertyDescription} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Financial Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              style={{
                maxHeight: '130px',
                overflowY: 'auto'
              }}
            >
              {financialYearList.map((year, index) => (
                <MenuItem key={index} value={year.FinanceYear}>
                  {year.FinanceYear}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={2} mt={3.2}>
          <FormControlLabel
            control={<Checkbox checked={isCurrentChecked} onChange={() => setIsCurrentChecked(!isCurrentChecked)} />}
            label="Current Tax"
            sx={{ marginLeft: 3 }}
          />
        </Grid>
        <Grid item xs={12} sm={2} mt={3.2}>
          <FormControlLabel
            control={<Checkbox checked={isPendingChecked} onChange={() => setIsPendingChecked(!isPendingChecked)} />}
            label="Pending Tax"
            sx={{ marginLeft: -3 }}
          />
        </Grid>
        <Grid item xs={12} sm={2} mt={3.2} sx={{ marginLeft: -5 }}>
          <Stack spacing={1}>
            <Button variant="contained" color="primary" onClick={handleShowDataClick}>
              Show Data
            </Button>
          </Stack>{' '}
        </Grid>
      </Grid>
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <MainCard>
              <Box width="100%" height="450px" overflow="auto">
                {showAllTable && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Property Classification</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {countedList.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.count}</TableCell>
                          </TableRow>
                        ))}

                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
              <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
                <Button variant="contained" color="primary" onClick={generateDescriptionList}>
                  Generated Excel Sheet
                </Button>
              </Box>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <MainCard>
              <Grid item xs={12} sm={12} mb={1.5}>
                <Stack spacing={1}>
                  <Box display="flex" alignItems="center">
                    <FormControlLabel
                      control={<Checkbox checked={isFilterSelected} onChange={(e) => setIsFilterSelected(e.target.checked)} />}
                      label="Select Filter"
                      labelPlacement="end"
                      style={{ marginRight: '8px' }}
                    />
                  </Box>
                  <Box
                    style={{
                      maxHeight: '130px',
                      overflowY: 'auto',
                      border: '2px solid #ccc'
                    }}
                  >
                    {selectFilter.map((label, index) => (
                      <Box key={index} className="form-check">
                        <label htmlFor={`filterDesc${label}`}>
                          <Checkbox
                            id={`filterDesc${label}`}
                            checked={filterDesc.includes(label)}
                            onChange={() => HandleFilterDescChange(label)}
                            disabled={!isFilterSelected}
                          />
                          {label}
                        </label>
                      </Box>
                    ))}
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={12} mb={1.5}>
                <InputLabel>From Value</InputLabel>
                <FormControl fullWidth>
                  <TextField type="number" value={fromValue} onChange={(e) => setFromValue(e.target.value)}></TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} mb={1.5}>
                <InputLabel>To Value</InputLabel>
                <FormControl fullWidth>
                  <TextField type="number" value={toValue} onChange={(e) => setToValue(e.target.value)}></TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} mb={2} ml={5}>

                <Button variant="contained" color="primary" onClick={handleFilterButtonClick}>
                  Filter {'>>'}

                </Button>
              </Grid>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Quality Control</DialogTitle>

                <DialogContent>
                  <Typography>Please select filter range</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
              <Grid item xs={12} sm={12}>
                <Typography variant="contained" color="primary" ml={2}>
                  Total Property Count:
                </Typography>

                <TextField value={tableData.length}></TextField>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} sm={5.5}>
            <MainCard>
              <Box sx={{ width: '100%', overflowX: 'auto' }} height="450px">
                {showTable && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        {[...propertyHeaders, ...oldHeaders, ...totalHeaders].map(h => (
                          <TableCell key={h}>{h}</TableCell>
                        ))}
                        {isCurrentChecked && currentHeader.map(h => (
                          <TableCell key={h}>{h.replace("current_", "Current ")}</TableCell>
                        ))}
                        {isPendingChecked && pendingHeader.map(h => (
                          <TableCell key={h}>{h.replace("pending_", "Pending ")}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          {[...propertyHeaders, ...oldHeaders, ...totalHeaders].map(h => (
                            <TableCell key={h}>{row[h] ?? ""}</TableCell>
                          ))}
                          {isCurrentChecked && currentHeader.map(h => (
                            <TableCell key={h}>{row[h] ?? ""}</TableCell>
                          ))}
                          {isPendingChecked && pendingHeader.map(h => (
                            <TableCell key={h}>{row[h] ?? ""}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

              </Box>

              <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
                <Button variant="contained" color="primary" onClick={generatePropertyList}>
                  Generated Excel Sheet
                </Button>
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={receivedStatus == 200 || receivedStatus == 201 ? 'success' : receivedStatus == 202 ? 'info' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {receivedMessage}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openloader}
      // onClick={handleCloseLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default PropertyClassification;
