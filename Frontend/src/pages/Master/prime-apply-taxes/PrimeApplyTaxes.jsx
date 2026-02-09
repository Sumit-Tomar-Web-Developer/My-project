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
  Checkbox,
  Stack,
  FormControlLabel,
  FormGroup,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import { ta } from 'date-fns/locale';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { fetchTaxList, postUpdatedTaxList, fetchTypeOfUseMasterPrime, fetchTypeOfUseMaster } from 'services/masterServices/prime-apply-tax-services/primeApplyTax.services';



function PrimeApplyTaxes() {
  const [taxList, setTaxList] = useState([]);
  const [openSnackApplyTaxPrime, setOpenSnackApplyTaxPrime] = useState(false);
  const [taxListUpdated, setTaxListUpdated] = useState(false);
  const [selectedTableIndex, setSelectedTableIndex] = useState(0);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Prime Apply Taxes';
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

      console.log(access, 'assigned access to Prime Apply Taxes Page');

      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTaxList();
        setTaxList(data);
      } catch (error) {
        console.error('Error fetching Tax List: Page', error);
      }
    };
    fetchData();
  }, []);

  const handleSaveClick = async () => {
    try {
      const response = await postUpdatedTaxList(taxList);
      setOpenSnackApplyTaxPrime(true);
      setTaxListUpdated(false);
      console.log('Tax list updated successfully', response);
    } catch (error) {
      console.error('Error updating tax list', error);
    }
  };
  const [typeDesList, setTypeDesList] = useState([])
  useEffect(() => {
    fetchTypeOfUseMaster()
      .then((fetchproperty) => {
        console.log(fetchproperty, 'prop des')
        setTypeDesList(fetchproperty);
      })
      .catch((error) => {
        console.error('Error fetching property description:', error);
      });
  }, []);
  const [primeDesList, setPrimeDesList] = useState([])
  useEffect(() => {
    fetchTypeOfUseMasterPrime()
      .then((fetchproperty) => {
        console.log(fetchproperty, 'fetchproperty');
        setPrimeDesList(fetchproperty);
      })
      .catch((error) => {
        console.error('Error fetching property description:', error);
      });
  }, [])
  const handleCheckboxChange = useCallback(
    (index, field) => (event) => {
      setTaxList((prev) => {
        const newTaxList = [...prev];
        newTaxList[index][field] = event.target.checked;
        return newTaxList;
      });
      setTaxListUpdated(true);
    },
    []
  );


  const handleDateChange = useCallback(
    (index, field) => (event) => {
      setTaxList((prev) => {
        const newTaxList = [...prev];
        newTaxList[index][field] = event.target.value;
        return newTaxList;
      });
      setTaxListUpdated(true);
    },
    []
  );
  useEffect(() => {
    console.log(taxList, 'taxList')
      , [taxList]
  })

  const handleTaxPrimeMasterClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackApplyTaxPrime(false);
  }, []);

  const handleTableCellClick = useCallback((index) => {
    setSelectedTableIndex(index);
  }, []);

  const selectedTaxItem = useMemo(() => taxList[selectedTableIndex] || {}, [taxList, selectedTableIndex]);

  const renderCheckbox = useCallback(
    (index, field, label) => (
      <FormControlLabel
        control={
          <Checkbox checked={taxList[index]?.[field] || false} onChange={handleCheckboxChange(index, field)} disabled={accessLevel < 3} />
        }
        label={label}
        sx={{ ml: 1 }}
      />
    ),
    [handleCheckboxChange, taxList]
  );

  const renderDateField = useCallback(
    (index, field) => (
      <TextField
        type="date"
        value={taxList[index]?.[field]?.split('T')[0] || ''}
        onChange={handleDateChange(index, field)}
        disabled={accessLevel < 3}
      />
    ),
    [handleDateChange, taxList]
  );

  const isDisabled = accessLevel < 3;
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
        <MainCard title="Prime Apply Tax Master">
          <Snackbar
            open={openSnackApplyTaxPrime}
            autoHideDuration={6000}
            onClose={handleTaxPrimeMasterClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleTaxPrimeMasterClose} severity="success" variant="filled" sx={{ width: '100%' }}>
              Apply Prime Tax List Updated Successfully
            </Alert>
          </Snackbar>
          <>
            <Grid display={'flex'} justifyContent={'center'} mt={3}>
              <Grid item xs={3} mt={1}>
                <InputLabel sx={{ fontWeight: 'bolder' }}>Type of Use</InputLabel>
              </Grid>
              <Grid item xs={1} ml={2}>
                <TextField value={typeDesList.find(d => d.TypeOfUseID === selectedTaxItem.TypeofUseId)?.Description || ''} disabled={accessLevel < 3} />
              </Grid>
              <Grid item xs={3} mt={1} ml={10}>
                <InputLabel sx={{ fontWeight: 'bolder' }}>Type Description</InputLabel>
              </Grid>
              <Grid item xs={1} ml={2}>
                <TextField value={primeDesList.find(d => d.Type === selectedTaxItem.Type)?.Description || ''} disabled={accessLevel < 3} />
              </Grid>
            </Grid>
            <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} mt={4}>
              <Stack mt={1}>
                <FormGroup aria-label="position" column>
                  {renderCheckbox(selectedTableIndex, 'PropertyTax', 'Property Tax', isDisabled)}
                  {renderCheckbox(selectedTableIndex, 'EducationTax', 'Education Tax', isDisabled)}
                  {renderCheckbox(selectedTableIndex, 'EmploymentTax', 'Employment Tax', isDisabled)}
                  {renderCheckbox(selectedTableIndex, 'SpEducationTax', 'Sp. Education Tax', isDisabled)}
                </FormGroup>
              </Stack>
              <Stack mt={1}>
                <FormGroup aria-label="position" column>
                  {renderCheckbox(selectedTableIndex, 'DrainCess', 'Drain Cess')}
                  {renderCheckbox(selectedTableIndex, 'RoadCess', 'Road Cess')}
                  {renderCheckbox(selectedTableIndex, 'TreeCess', 'Tree Cess')}
                  {renderCheckbox(selectedTableIndex, 'SewageDisposalCess', 'Sewage Disposal Cess')}
                </FormGroup>
              </Stack>
              <Stack mt={1}>
                <FormGroup aria-label="position" column>
                  {renderCheckbox(selectedTableIndex, 'Sanitation', 'Sanitation')}
                  {renderCheckbox(selectedTableIndex, 'WaterBenefit', 'Water Benefit')}
                  {renderCheckbox(selectedTableIndex, 'SpWaterCess', 'Sp. Water Cess')}
                  {renderCheckbox(selectedTableIndex, 'WaterBill', 'Water Bill')}
                </FormGroup>
              </Stack>
              <Stack mt={1}>
                <FormGroup aria-label="position" column>
                  {renderCheckbox(selectedTableIndex, 'FireCess', 'Fire Cess')}
                  {renderCheckbox(selectedTableIndex, 'MajorBuilding', 'Major Building')}
                  {renderCheckbox(selectedTableIndex, 'LightCess', 'Light Cess')}
                  {renderCheckbox(selectedTableIndex, 'Tax1', 'Tax 1')}
                </FormGroup>
              </Stack>
              <Stack mt={1}>
                <FormGroup aria-label="position" column>
                  {renderCheckbox(selectedTableIndex, 'Tax2', 'Tax 2')}
                  {renderCheckbox(selectedTableIndex, 'Tax3', 'Tax 3')}
                  {renderCheckbox(selectedTableIndex, 'Tax4', 'Tax 4')}
                  {renderCheckbox(selectedTableIndex, 'Tax5', 'Tax 5')}
                </FormGroup>
              </Stack>
            </Grid>
            <Grid display={'flex'} justifyContent={'center'} mt={3}>
              <Grid item xs={3} mt={1}>
                <Button variant="contained" color="success" onClick={handleSaveClick} disabled={accessLevel < 3}>
                  Save
                </Button>
              </Grid>
            </Grid>
            <TableContainer sx={{ mt: 3, height: 400, overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{
                   
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                  }}>
                    <TableCell>Type of Use</TableCell>
                    <TableCell>Type Description</TableCell>
                    <TableCell>Property Tax</TableCell>
                    <TableCell>Education Tax</TableCell>
                    <TableCell>Employment Tax</TableCell>
                    <TableCell>Sp. Education Tax</TableCell>
                    <TableCell>Drain Cess</TableCell>
                    <TableCell>Road Cess</TableCell>
                    <TableCell>Tree Cess</TableCell>
                    <TableCell>Sewage Disposal Cess</TableCell>
                    <TableCell>Sanitation</TableCell>
                    <TableCell>Water Benefit</TableCell>
                    <TableCell>Sp. Water Cess</TableCell>
                    <TableCell>Water Bill</TableCell>
                    <TableCell>Fire Cess</TableCell>
                    <TableCell>Major Building</TableCell>
                    <TableCell>Light Cess</TableCell>
                    <TableCell>Tax 1</TableCell>
                    <TableCell>Tax 2</TableCell>
                    <TableCell>Tax 3</TableCell>
                    <TableCell>Tax 4</TableCell>
                    <TableCell>Tax 5</TableCell>
                    <TableCell>Updated Date</TableCell>
                    <TableCell>Created Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxList.length > 0 ? (
                    taxList.map((tax, index) => (
                      <TableRow
                        key={tax.AtmId}
                        onClick={() => handleTableCellClick(index)}
                        style={{
                          backgroundColor: selectedTableIndex === index ? '#D3D3D3' : 'inherit'
                        }}
                      >
                        <TableCell>{typeDesList.find(d => d.TypeOfUseID === tax.TypeofUseId)?.Description
                        }</TableCell>
                        <TableCell>{primeDesList.find(d => d.Type === tax.Type)?.Description}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.PropertyTax || false}
                            onChange={handleCheckboxChange(index, 'PropertyTax')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.EducationTax || false}
                            onChange={handleCheckboxChange(index, 'EducationTax')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.EmploymentTax || false}
                            onChange={handleCheckboxChange(index, 'EmploymentTax')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.SpEducationTax || false}
                            onChange={handleCheckboxChange(index, 'SpEducationTax')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.DrainCess || false}
                            onChange={handleCheckboxChange(index, 'DrainCess')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.RoadCess || false}
                            onChange={handleCheckboxChange(index, 'RoadCess')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.TreeCess || false}
                            onChange={handleCheckboxChange(index, 'TreeCess')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.SewageDisposalCess || false}
                            onChange={handleCheckboxChange(index, 'SewageDisposalCess')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.Sanitation || false}
                            onChange={handleCheckboxChange(index, 'Sanitation')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.WaterBenefit || false}
                            onChange={handleCheckboxChange(index, 'WaterBenefit')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.SpWaterCess || false}
                            onChange={handleCheckboxChange(index, 'SpWaterCess')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.WaterBill || false}
                            onChange={handleCheckboxChange(index, 'WaterBill')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.FireCess || false}
                            onChange={handleCheckboxChange(index, 'FireCess')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.MajorBuilding || false}
                            onChange={handleCheckboxChange(index, 'MajorBuilding')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={tax.LightCess || false}
                            onChange={handleCheckboxChange(index, 'LightCess')}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={tax.Tax1 || false} onChange={handleCheckboxChange(index, 'Tax1')} disabled={accessLevel < 3} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={tax.Tax2 || false} onChange={handleCheckboxChange(index, 'Tax2')} disabled={accessLevel < 3} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={tax.Tax3 || false} onChange={handleCheckboxChange(index, 'Tax3')} disabled={accessLevel < 3} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={tax.Tax4 || false} onChange={handleCheckboxChange(index, 'Tax4')} disabled={accessLevel < 3} />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={tax.Tax5 || false} onChange={handleCheckboxChange(index, 'Tax5')} disabled={accessLevel < 3} />
                        </TableCell>
                        <TableCell>{renderDateField(index, 'UpdatedDate')}</TableCell>
                        <TableCell>{renderDateField(index, 'CreatedDate')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={24} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        </MainCard>
      )}
    </>
  );
}

export default PrimeApplyTaxes;
