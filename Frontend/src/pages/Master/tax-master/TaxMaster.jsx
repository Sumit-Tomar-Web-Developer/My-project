import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import {
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Button,
  Typography,
  Divider,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { fetchGroupList } from 'services/assessmentService/DataEntryService/dataEntryService';

import { fetchPrimeTypeOfUseList } from 'services/masterServices/prime-type-of-use-services/prime-type-of-use.services';
import {
  fetchTaxMasterList,
  postUpdateTaxMasterList,
  deleteTaxMasterList
} from 'services/masterServices/tax-master-services/tax-master.services';
import { getTaxList } from 'services/masterServices/tax-name-master-services/tax-name-master.services';
import { getTypeOfUseList } from 'services/masterServices/typeOfUseServices/typeOfUse.service';

function TaxMaster() {
  const [taxMasters, setTaxMasters] = useState([]);
  const [allTaxMasters, setAllTaxMasters] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('');
  const [typeOfUses, setTypeOfUses] = useState([]);
  const [typeOfUsesGroup, setTypeOfUsesGroup] = useState([]);
  const [selectedTaxMaster, setSelectedTaxMaster] = useState('');
  const [selectedTypeOfUse, setSelectedTypeOfUse] = useState([]);
  const [selectedTypeOfUseGroup, setSelectedTypeOfUseGroup] = useState('Select Type of Use');
  const [year, setYear] = useState('');
  const [rate, setRate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [onALVRV, setOnALVRV] = useState('');
  const [taxMasterID, setTaxMasterID] = useState('');
  const [reloadPage, setReloadPage] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [receivedStatus, setReceivedStatus] = useState('');
  const [isSaveEnabled, setIsSaveEnabled] = useState(true);
  const [disableDeleteButton, setDisableDeleteButton] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [typeOfUsePrime, setTypeOfUsePrime] = useState([]);

  //set current page ID by page name which is Active Taxes

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);
  const [invalidYear, setInvalidYear] = useState(true);
  const [editButtonClicked, setEditButtonClicked] = useState(false);


  useEffect(() => {

  }, [selectedTypeOfUseGroup])
  useEffect(() => {
    console.log(selectedRows, 'selectedTypeOfUse')
  }, [selectedTypeOfUse, taxMasterID])
  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Tax Master';
      try {
        const fetchedPageID = await getPageIDByPageName(pageName);
        console.log(fetchedPageID, 'fetchedPageID' + ` ${pageName}`);
        setPageID(fetchedPageID);
      } catch (error) {
        console.error('Error fetching page ID:', error);
      }
    };
    getPageID();
  }, []);

  // Get permissions for this page for logged in user from Redux
  const permissions = useSelector((state) => {
    const p = state.newUserDetails.permissions;
    return Array.isArray(p) ? p : [];
  });



  //get permission for current page
  const permissionAccess = permissions.find((perm) => perm.PageID === Number(pageID.PageID));

  useEffect(() => {
    if (permissionAccess?.AccessID) {
      const access = permissionAccess.AccessID;
      console.log(access, 'assigned access to tax master Page');
      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true); // Show dialog for No Access or View Only
      } else {
        setShowAccessDialog(false);
      }
    }
  }, [permissionAccess]);

  const navigate = useNavigate();
  const handleRedirect = () => {
    setShowAccessDialog(false);
    navigate('/payment/dashboard');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchPrimeTypeOfUseList().then((res) => setTypeOfUsePrime(res));
    fetchGroupList().then((res) => setTypeOfUsesGroup(res));
    setReloadPage(false);
  }, [reloadPage]);

  useEffect(() => {
    getTypeOfUseList().then((res) => setTypeOfUses(res));
    setReloadPage(false);
    getTaxList().then((res) => {
      const activeTaxMasters = res.data.filter((name) => name.Status == true);
      setAllTaxMasters(activeTaxMasters);
      setTaxMasters(activeTaxMasters);
      setReloadPage(false);
    });
  }, [reloadPage]);

  useEffect(() => {
    if (selectedTaxMaster) {
      fetchTaxMasterList({ TaxNametype: selectedTaxMaster }).then((res) => {
        setTaxMasters(res.data);
        setReloadPage(false);
      });
    } else {
      setTaxMasters(allTaxMasters);
    }
  }, [selectedTaxMaster, allTaxMasters, reloadPage]);

  const handleRowClick = (row) => {
    const isSelected = selectedRows.includes(row.ID);
    console.log(isSelected, 'selected row data');
    if (!selectedRows.includes(row.ID)) {
      setEditButtonClicked(true);
      const newSelectedRows = isSelected ? selectedRows.filter((id) => id !== row.ID) : [...selectedRows, row.ID];
      const matchRow = typeOfUses.filter((type) => type.TypeOfUseID === row.Type)[0];
      console.log(matchRow, 'matchRow');

      setSelectedRows(newSelectedRows);
      setSelectedTaxMaster(row.Taxnametype);
      setOnALVRV(row.OnRVOrALV);
      setYear(row.Year);
      setInvalidYear(false);
      setRate(row.Rate);
      setMinAmount(row.MinAmount);
      setMaxAmount(row.MaxAmount);
      selectedRows.includes(matchRow.TypeOfUseID);
      setSelectedTypeOfUse([matchRow.TypeOfUseID]);

      setTaxMasterID(row.ID);
      setIsSaveEnabled(newSelectedRows.length === 0);
      setDisableDeleteButton(newSelectedRows.length === 0);
    }
    else {
      setEditButtonClicked(false);
      setSelectedTypeOfUse([]);
      setSelectedTypeOfUseGroup('Select Type of Use');
      setYear('');
      setInvalidYear(true);
      setRate('');
      setMinAmount('');
      setMaxAmount('');
      setOnALVRV('');
      setIsSaveEnabled(true);
      setDisableDeleteButton(true);
      setSelectedRows([]);
    }
  };
  const [form, setForm] = useState({
    rate: "",
    minAmount: "",
    maxAmount: "",
    onALVRV: "",
    selectedTaxMaster: "",
    selectedTypeOfUse: "",
  });
  useEffect(() => {
    setForm({
      rate: rate,
      minAmount: minAmount,
      maxAmount: maxAmount,
      onALVRV: onALVRV,
      selectedTaxMaster: selectedTaxMaster,
      selectedTypeOfUse: selectedTypeOfUse,
    })
  }, [rate, minAmount, maxAmount, onALVRV, selectedTaxMaster, selectedTypeOfUse])

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Required field checks
    if (!form.rate) {
      newErrors.message = "Rate is required";
    } else if (!form.onALVRV) {
      newErrors.message = "Select ALV or RV";
    } else if (!form.selectedTypeOfUse) {
      newErrors.message = "Type of Use is required";
    } else if (!form.selectedTaxMaster) {
      newErrors.message = "Select Tax Master";
    }
    // Min/Max amounts for special tax masters
    else if (
      ['EducationTax', 'EmploymentTax', 'OpenPlot-EmploymentTax', 'OpenPlot-EducationTax']
        .includes(form.selectedTaxMaster)
    ) {
      if (!form.minAmount) {
        newErrors.message = "Min amount is required";
      } else if (!form.maxAmount) {
        newErrors.message = "Max amount is required";
      } else if (Number(form.minAmount) > Number(form.maxAmount)) {
        newErrors.message = "Max amount must be greater than Min amount";
      }
    }

    // Duplicate check (only if no previous errors)
    if (!newErrors.message) {
      const isDuplicate = taxMasters.some(item => {
        if (
          item.rate !== form.rate ||
          item.selectedTaxMaster !== form.selectedTaxMaster ||
          item.onALVRV !== form.onALVRV ||
          item.selectedTypeOfUse !== form.selectedTypeOfUse
        ) {
          return false;
        }

        if (
          ['EducationTax', 'EmploymentTax', 'OpenPlot-EmploymentTax', 'OpenPlot-EducationTax']
            .includes(form.selectedTaxMaster)
        ) {
          if (item.minAmount !== form.minAmount || item.maxAmount !== form.maxAmount) {
            return false;
          }
        }

        return true; // duplicate found
      });

      if (isDuplicate) {
        newErrors.message = "This tax master row already exists";
      }
    }

    // Show snackbar
    setErrors(newErrors);
    if (newErrors.message) {
      setSnackbarSeverity('error');
      setReceivedMessage(newErrors.message);
      setSnackbarOpen(true);
    }

    return Object.keys(newErrors).length === 0; // valid = no errors
  };

  const handleSave = async () => {
    if (validate()) {
      setDisableDeleteButton(true);
      setIsSaveEnabled(true);


      const data = {
        ID: taxMasterID || 0,
        Type: selectedTypeOfUse,
        Year: parseInt(year, 10),
        Rate: parseFloat(rate),
        MinAmount: parseFloat(minAmount),
        MaxAmount: parseFloat(maxAmount),
        Taxnametype: selectedTaxMaster,
        OnRVOrALV: onALVRV,
        AssessmentId: 1
      };

      setTaxMasterID(0);
      const { message, status } = await postUpdateTaxMasterList(data);
      setReceivedStatus(status);
      setReceivedMessage(message);
      setSnackbarOpen(true);
      setSelectedTypeOfUse([]);
      setSelectedTypeOfUseGroup('Select Type of Use');
      setYear('');
      setRate('');
      setMinAmount('');
      setMaxAmount('');
      setReloadPage(true);
    };
  }

  const handleChange = () => {
    setIsSaveEnabled(false);
    setDisableDeleteButton(false);
  };

  const handleClear = () => {
    setSelectedTaxMaster('');
    setSelectedTypeOfUse([]);
    setSelectedTypeOfUseGroup('Select Type of Use');
    setYear('');
    setRate('');
    setMinAmount('');
    setMaxAmount('');
    setIsSaveEnabled(true);
    setDisableDeleteButton(true);
    setSelectedRows([]);
  };

  const handleDelete = async () => {
    if (!selectedRows.length) {
      setReceivedStatus(500);
      setReceivedMessage('Select at least one record to delete');
      setSnackbarSeverity('error')
      setSnackbarOpen(true);
    } else {
      setDisableDeleteButton(true);
      setIsSaveEnabled(false);
      try {
        const res = await deleteTaxMasterList({ IDs: selectedRows });
        setReceivedStatus(200);
        setReceivedMessage('Items deleted successfully');
        setReloadPage(true);
        setSnackbarOpen(true);
        handleClear();
      } catch (error) {
        console.error('Error In deleting Tax Master');
        setReceivedStatus(500);
      }
    }
  };
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      return
    }
    if (invalidYear) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error')
      setReceivedMessage('Enter valid Year ')
    }

  }, [invalidYear])
  const [minMaxError, setMinMaxError] = useState(false); // store error message

  useEffect(() => {
    if (minAmount !== "" && maxAmount !== "") {
      if (Number(minAmount) > Number(maxAmount)) {
        setMinMaxError("Min amount should be less than Max Amount");
      } else {
        setMinMaxError("");
      }
    } else {
      setMinMaxError(false); // clear error if one is empty
    }
  }, [minAmount, maxAmount]);


  return (
    <>
      {showAccessDialog ? (
        <Dialog open={true} maxWidth="xs" fullWidth>
          <DialogTitle>{accessLevel === 1 ? 'No Access' : 'View Only Access'}</DialogTitle>
          <DialogContent>
            <Typography>
              {accessLevel === 1
                ? 'You do not have permission to access this page.'
                : 'You have view-only access. Editing or saving changes is not allowed.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                if (accessLevel === 1) {
                  handleRedirect();
                } else {
                  setShowAccessDialog(false);
                }
              }}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <MainCard title="Tax Master">
          <Grid display={'flex'} justifyContent={'flex-start'} mt={3}>
            <Grid item xs={3} mt={1} mb={4} ml={15}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Select Tax Master</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <Select
                sx={{ minWidth: '8.5vw' }}
                value={selectedTaxMaster}
                onChange={(e) => {
                  setSelectedTaxMaster(e.target.value);
                  handleChange();
                }}
                disabled={accessLevel < 3}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 5 + 8, // 5 items visible, 48px each + padding
                      width: '20ch',
                    },
                  },
                }}
              >
                {allTaxMasters.map((taxMaster) => (
                  <MenuItem key={taxMaster.ID} value={taxMaster.TaxName}>
                    {taxMaster.TaxName}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={3} mt={1} ml={19}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>ALV / RV</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <Select
                sx={{ minWidth: '8.5vw' }}
                value={onALVRV}
                onChange={(e) => {
                  setOnALVRV(e.target.value);
                  handleChange();
                }}
                disabled={accessLevel < 3}
              >
                <MenuItem value="ALV">ALV</MenuItem>
                <MenuItem value="RV">RV</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Divider />


          <Grid display={'flex'} justifyContent={'flex-start'} mt={3}>
            <Grid item xs={3} mt={1} mb={4} ml={15}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Type of Use Group</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <Select

                sx={{ minWidth: '8.5vw' }}
                value={selectedTypeOfUseGroup}
                onChange={(e) => {
                  setSelectedTypeOfUseGroup(e.target.value);
                  handleChange();
                }}
                disabled={accessLevel < 3}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 5 + 8, // 5 items visible, 48px each + padding
                      width: '20ch',
                    },
                  },
                }}
              >
                <MenuItem value='Select Type of Use' >
                  Select Type of Use
                </MenuItem>
                {typeOfUsesGroup.map((typeOfUse) => (
                  <MenuItem key={typeOfUse.GroupID} value={typeOfUse.GroupID}>
                    {typeOfUse.GroupDescription}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={3} mt={1} ml={19}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Type of Use</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <Select
                multiple
                sx={{ maxWidth: '8.5vw', minWidth: '8.5vw' }}
                value={selectedTypeOfUse}
                onChange={(e) => {
                  const value = e.target.value
                  console.log(value, 'type of use selected')
                  setSelectedTypeOfUse(value);
                  handleChange();
                }}
                disabled={accessLevel < 3}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 5 + 8, // 5 items visible, 48px each + padding
                      width: '30ch',
                    },
                  },
                }}
              >

                {selectedTypeOfUseGroup === 'Select Type of Use' ?
                  typeOfUsePrime.map((row) => {
                    console.log(row, 'row of type of use'); return (
                      <MenuItem key={row.ID} value={row.Type}>
                        <FormControlLabel label={row.Description}
                          control={<Checkbox checked={selectedTypeOfUse.includes(row.Type)} />} />
                      </MenuItem>
                    )
                  }) : typeOfUses.map((typeOfUse) => (
                    typeOfUse.GroupID == selectedTypeOfUseGroup ? (
                      <MenuItem key={typeOfUse.ID} value={typeOfUse.TypeOfUseID}>
                        <FormControlLabel label={typeOfUse.Description}
                          control={<Checkbox checked={selectedTypeOfUse.includes(typeOfUse.TypeOfUseID)} />} />
                      </MenuItem>
                    ) : null
                  ))}

              </Select>
            </Grid>

          </Grid>
          <Grid display={'flex'} justifyContent={'flex-start'} mt={3} ml={26}>
            <Grid item xs={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Year</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <TextField
                label="Year"
                value={year}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only 0 to 4 digits
                  if (/^\d{0,4}$/.test(value)) {
                    setYear((pre) => value)

                    // Update error status on change too
                    setInvalidYear(value.length > 0 && value.length < 4);

                  }

                }
                }
                fullWidth
                disabled={accessLevel < 3}
                inputProps={{
                  inputMode: 'numeric',
                }
                }

                error={isFirstRender.current ? '' : invalidYear}
                helperText={isFirstRender.current ? '' : invalidYear ? "Year must be 4 digits" : ""}
              />
            </Grid>
            <Grid item xs={3} mt={1} ml={17}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Rate</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <TextField
                type='decimal'
                value={rate}
                onChange={(e) => {
                  const val = e.target.value;

                  // Allow numbers with optional decimal part up to 2 digits
                  if (/^\d{0,2}(\.\d{0,2})?$/.test(val)) {
                    setRate(val);
                  }
                }}
                inputProps={{
                  inputMode: "decimal",       // mobile numeric keyboard with decimal
                  pattern: "[0-9]*[.,]?[0-9]{0,2}" // HTML validation for 2 decimals
                }}
                disabled={accessLevel < 3} />
            </Grid>
          </Grid>
          <Grid display={'flex'} justifyContent={'flex-start'} mt={3} ml={19}>
            <Grid item xs={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}
                disabled={
                  accessLevel < 3 ||
                  (selectedTaxMaster !== "EducationTax" && selectedTaxMaster !== "EmploymentTax" && selectedTaxMaster !== "OpenPlot-EmploymentTax" && selectedTaxMaster !== "OpenPlot-EducationTax")
                }>Min. Amount</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <TextField
                type="text"
                value={minAmount}
                onChange={(e) => {
                  const val = e.target.value;

                  // Allow numbers with optional decimal part up to 2 digits
                  if (/^\d{0,10}(\.\d{0,2})?$/.test(val) || val === "") {
                    setMinAmount(val);
                  }
                }}
                disabled={
                  accessLevel < 3 ||
                  (selectedTaxMaster !== "EducationTax" && selectedTaxMaster !== "EmploymentTax" && selectedTaxMaster !== "OpenPlot-EmploymentTax" && selectedTaxMaster !== "OpenPlot-EducationTax")
                }
                error={Boolean(minMaxError)} // 🔴 red highlight when error exists
                helperText={minMaxError}
                inputProps={{
                  inputMode: "decimal",       // mobile numeric keyboard with decimal
                  pattern: "[0-9]*[.,]?[0-9]{0,2}" // HTML validation for 2 decimals
                }}
              />
            </Grid>
            <Grid item xs={3} mt={1} ml={10}>
              <InputLabel sx={{ fontWeight: 'bolder' }}
                disabled={
                  accessLevel < 3 ||
                  (selectedTaxMaster !== "EducationTax" && selectedTaxMaster !== "EmploymentTax" && selectedTaxMaster !== "OpenPlot-EmploymentTax" && selectedTaxMaster !== "OpenPlot-EducationTax")
                }>Max. Amount</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <TextField
                type='decimal'
                value={maxAmount}
                onChange={(e) => {
                  const val = e.target.value;

                  // allow empty string so user can clear the input
                  // ensure only digits and max length 7
                  if (/^\d{0,10}(\.\d{0,2})?$/.test(val) || val === "") {
                    setMaxAmount(val);
                  }
                  // else: do nothing, invalid input won't update state
                }}
                disabled={accessLevel < 3 || selectedTaxMaster !== 'EducationTax' && selectedTaxMaster !== 'EmploymentTax' && selectedTaxMaster !== 'OpenPlot-EmploymentTax' && selectedTaxMaster !== 'OpenPlot-EducationTax'}
                inputProps={{
                  inputMode: "decimal",       // mobile numeric keyboard with decimal
                  pattern: "[0-9]*[.,]?[0-9]{0,2}" // HTML validation for 2 decimals
                }}
              />
            </Grid>
          </Grid>

          <Grid display={'flex'} justifyContent={'center'} mt={3} mb={2}>
            <Grid item xs={3} mt={1}>
              <Button variant="contained" color="success" onClick={handleSave} disabled={accessLevel < 3 || invalidYear || minMaxError || selectedTaxMaster === '' || selectedTypeOfUse === '' || rate === ''}>
                Save
              </Button>
            </Grid>
            <Grid item xs={1} ml={2} mt={1}>
              <Button variant="contained" color="secondary" onClick={handleClear} disabled={accessLevel < 3}>
                Clear
              </Button>
            </Grid>
            <Grid item xs={1} ml={2} mt={1}>
              <Button variant="contained" color="error" onClick={handleDelete} disabled={accessLevel < 4}>
                Delete
              </Button>
            </Grid>
          </Grid>
          <Typography sx={{ mt: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Tax Rate List
          </Typography>
          <TableContainer sx={{ mt: 3, height: 300, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{
                  width: '1vw',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}>
                  {/* Sticky first column */}
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 2,
                      backgroundColor: 'white',
                      width: 50,
                      minWidth: 50,
                    }}
                  >
                    <Checkbox
                      checked={selectedRows.length > 0 && selectedRows.length === taxMasters.length}
                      indeterminate={selectedRows.length > 0 && selectedRows.length < taxMasters.length}
                      onChange={() => {
                        if (selectedRows.length === taxMasters.length) {
                          setSelectedRows([]);
                        } else {
                          setSelectedRows(taxMasters.map((row) => row.ID));
                        }
                      }}
                      disabled={accessLevel < 3}
                    />
                  </TableCell>

                  {/* Other header cells */}
                  <TableCell sx={{ width: 60, minWidth: 60 }}>Edit</TableCell>
                  <TableCell sx={{ width: 80, minWidth: 80 }}>Year</TableCell>
                  <TableCell sx={{ width: 60, minWidth: 60 }}>Rate</TableCell>
                  <TableCell sx={{ width: 150, minWidth: 150 }}>Description</TableCell>
                  <TableCell sx={{ width: 80, minWidth: 80 }}>On ALV/RV</TableCell>
                  <TableCell sx={{ width: 100, minWidth: 100 }}>Min Amount</TableCell>
                  <TableCell sx={{ width: 100, minWidth: 100 }}>Max Amount</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedTaxMaster &&
                  taxMasters.map((taxMaster) => (
                    <TableRow key={taxMaster.ID} hover>
                      <TableCell
                        sx={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 1,
                          backgroundColor: 'white',
                        }}
                      >
                        <Checkbox
                          checked={selectedRows.includes(taxMaster.ID)}
                          onChange={() => handleRowClick(taxMaster)}
                          disabled={accessLevel < 3}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color={taxMaster.ID === taxMasterID ? 'success' : 'primary'}
                          onClick={() => handleRowClick(taxMaster)}
                          disabled={accessLevel < 3}
                        >
                          {taxMaster.ID === selectedRows ? <SendOutlined /> : <EditTwoTone />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{taxMaster.Year}</TableCell>
                      <TableCell>{taxMaster.Rate}</TableCell>
                      <TableCell>{taxMaster.Type}</TableCell>
                      <TableCell>{taxMaster.OnRVOrALV}</TableCell>
                      <TableCell>{taxMaster.MinAmount}</TableCell>
                      <TableCell>{taxMaster.MaxAmount}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
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
        </MainCard>
      )}
    </>
  );
}

export default TaxMaster;
