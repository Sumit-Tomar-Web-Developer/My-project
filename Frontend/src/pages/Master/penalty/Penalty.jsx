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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { fetchPenaltyList, postUpdatedPenaltyList } from 'services/masterServices/penalty-master-services/penalty-master.services';
import Snackbar from '@mui/material/Snackbar';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function Penalty() {
  const [editablePenalties, setEditablePenalties] = useState([]);
  const [newYear, setNewYear] = useState('');
  const [duplicateYearError, setDuplicateYearError] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Penalty';
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

      console.log(access, 'assigned access to Penalty Page');

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
        const data = await fetchPenaltyList();
        setEditablePenalties(
          data.map((penalty) => ({
            ...penalty,
            isAppliedOwnerIdWise: !!penalty.isAppliedOwnerIdWise,
            isValidateDate: !!penalty.isValidateDate
          }))
        );
      } catch (error) {
        console.error('Error in Fetching List', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (index, field, value) => {
    setEditablePenalties(prev =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [field]: value } // only update same row & field
          : row // leave other rows untouched
      )
    );
    setButtonDisabled(false);
  };
  const handleAddPenalty = () => {
    let isDuplicate = false;

    for (let i = 0; i < editablePenalties.length; i++) {
      if (editablePenalties[i].Year == newYear) {
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      setDuplicateYearError(`Year ${newYear} already exists.`);
    } else {
      const currentDate = new Date().toISOString().split('T')[0];
      const newPenalty = {
        Year: newYear,

        IsAppliedOwnerIDWise: false,
        IsValidateDate: false,
        PropertyTax: false,
        EducationTax: false,
        EmploymentTax: false,
        SpEducationTax: false,
        DrainCess: false,
        RoadCess: false,
        TreeCess: false,
        SewageDisposalCess: false,
        Sanitation: false,
        WaterBenefit: false,
        SpWaterCess: false,
        WaterBill: false,
        MajorBuilding: false,
        FireCess: false,
        LightCess: false,
        Tax1: false,
        Tax2: false,
        Tax3: false,
        Tax4: false,
        Tax5: false,
        BillGenerationDate: currentDate,
        start_half_on_current: currentDate,
        end_half_on_current: currentDate,
        start_full_on_current: currentDate,
        end_full_on_current: currentDate,
        start_full_on_pending: currentDate,
        end_full_on_pending: currentDate,
        Rate_Current: 0.0,
        Rate_Pending: 0.0
      };
      setEditablePenalties([...editablePenalties, newPenalty]);
      setNewYear('');
      setDuplicateYearError('');
    }
  };

  const handleUpdatePenalties = async () => {
    try {
      await postUpdatedPenaltyList(editablePenalties);
      handleSuccessSnackbarOpen();
    } catch (error) {
      console.error('Error updating penalties', error);
      handleErrorSnackbarOpen();
    }
    setButtonDisabled(true);
  };

  const handleSuccessSnackbarOpen = () => {
    setSuccessSnackbarOpen(true);
  };

  const handleSuccessSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessSnackbarOpen(false);
  };

  const handleErrorSnackbarOpen = () => {
    setErrorSnackbarOpen(true);
  };

  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSnackbarOpen(false);
  };

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
        <MainCard title="Penalty">
          <Grid container alignItems="center" justifyContent="center" mt={3}>
            <Grid item xs={0.3} mb={3.5}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Year</InputLabel>
            </Grid>
            <Grid item xs={2} ml={2}>
              <TextField
                value={newYear}
                type="number"
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow input only if it doesn't exceed 4 digits
                  if (value.length <= 4) {
                    setNewYear(value);
                    setDuplicateYearError('');
                    setButtonDisabled(false);
                  } else {
                    setDuplicateYearError('Year cannot exceed 4 digits');
                    setButtonDisabled(true);
                  }
                }}
                error={duplicateYearError !== ''}
                helperText={duplicateYearError}
                sx={{ minHeight: '72px' }}
              />
            </Grid>
            <Grid item xs={1} ml={2} mb={3.5}>
              <Button variant="contained" onClick={handleAddPenalty} disabled={buttonDisabled || newYear.length < 4}>
                Add
              </Button>
            </Grid>
          </Grid>

          <TableContainer sx={{ mt: 5 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>Bill Gen Date</TableCell>
                  <TableCell>Start Half on Current</TableCell>
                  <TableCell>End Half on Current</TableCell>
                  <TableCell>Start Full on Current</TableCell>
                  <TableCell>End Full on Current</TableCell>
                  <TableCell>Start Full on Pending</TableCell>
                  <TableCell>End Full on Pending</TableCell>
                  <TableCell>Is Applied Owner Id Wise</TableCell>
                  <TableCell>Is Validate Date</TableCell>
                  <TableCell>Property Tax</TableCell>
                  <TableCell>Education Tax</TableCell>
                  <TableCell>Employment Tax</TableCell>
                  <TableCell>Sp Education Tax</TableCell>
                  <TableCell>Drain Cess</TableCell>
                  <TableCell>Road Cess</TableCell>
                  <TableCell>Tree Cess</TableCell>
                  <TableCell>Sewage Disposal</TableCell>
                  <TableCell>Sanitation</TableCell>
                  <TableCell>Water Benefit</TableCell>
                  <TableCell>Sp Water Cess</TableCell>
                  <TableCell>Water Bill</TableCell>
                  <TableCell>Major Building</TableCell>
                  <TableCell>Fire Cess</TableCell>
                  <TableCell>Light Cess</TableCell>
                  <TableCell>Tax 1</TableCell>
                  <TableCell>Tax 2</TableCell>
                  <TableCell>Tax 3</TableCell>
                  <TableCell>Tax 4</TableCell>
                  <TableCell>Tax 5</TableCell>

                  <TableCell>Rate Current</TableCell>
                  <TableCell>Rate Pending</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editablePenalties.map((penalty, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ minWidth: '6vw' }}>
                      <TextField
                        value={penalty.Year}
                        onChange={(e) => handleInputChange(index, 'Year', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={penalty.BillGenerationDate.split('T')[0]}
                        onChange={(e) => handleInputChange(index, 'BillGenerationDate', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={penalty.start_half_on_current.split('T')[0]}
                        onChange={(e) => handleInputChange(index, 'start_half_on_current', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={penalty.end_half_on_current.split('T')[0]}
                        onChange={(e) => handleInputChange(index, 'end_half_on_current', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={penalty.start_full_on_current.split('T')[0]}
                        onChange={(e) => handleInputChange(index, 'start_full_on_current', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={penalty.end_full_on_current.split('T')[0]}
                        onChange={(e) => handleInputChange(index, 'end_full_on_current', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={penalty.start_full_on_pending.split('T')[0]}
                        onChange={(e) => handleInputChange(index, 'start_full_on_pending', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={penalty.end_full_on_pending.split('T')[0]}
                        onChange={(e) => handleInputChange(index, 'end_full_on_pending', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>

                    <TableCell>
                      <Checkbox
                        checked={penalty.IsAppliedOwnerIDWise}
                        onChange={(e) => handleInputChange(index, 'IsAppliedOwnerIDWise', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.IsValidateDate}
                        onChange={(e) => handleInputChange(index, 'IsValidateDate', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.PropertyTax}
                        onChange={(e) => handleInputChange(index, 'PropertyTax', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.EducationTax}
                        onChange={(e) => handleInputChange(index, 'EducationTax', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.EmploymentTax}
                        onChange={(e) => handleInputChange(index, 'EmploymentTax', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.SpEducationTax}
                        onChange={(e) => handleInputChange(index, 'SpEducationTax', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.DrainCess}
                        onChange={(e) => handleInputChange(index, 'DrainCess', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.RoadCess}
                        onChange={(e) => handleInputChange(index, 'RoadCess', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.TreeCess}
                        onChange={(e) => handleInputChange(index, 'TreeCess', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.SewageDisposalCess}
                        onChange={(e) => handleInputChange(index, 'SewageDisposalCess', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.Sanitation}
                        onChange={(e) => handleInputChange(index, 'Sanitation', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.WaterBenefit}
                        onChange={(e) => handleInputChange(index, 'WaterBenefit', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.SpWaterCess}
                        onChange={(e) => handleInputChange(index, 'SpWaterCess', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.WaterBill}
                        onChange={(e) => handleInputChange(index, 'WaterBill', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.MajorBuilding}
                        onChange={(e) => handleInputChange(index, 'MajorBuilding', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.FireCess}
                        onChange={(e) => handleInputChange(index, 'FireCess', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.LightCess}
                        onChange={(e) => handleInputChange(index, 'LightCess', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.Tax1}
                        onChange={(e) => handleInputChange(index, 'Tax1', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.Tax2}
                        onChange={(e) => handleInputChange(index, 'Tax2', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.Tax3}
                        onChange={(e) => handleInputChange(index, 'Tax3', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.Tax4}
                        onChange={(e) => handleInputChange(index, 'Tax4', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={penalty.Tax5}
                        onChange={(e) => handleInputChange(index, 'Tax5', e.target.checked)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        value={penalty.Rate_Current}
                        onChange={(e) => handleInputChange(index, 'Rate_Current', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={penalty.Rate_Pending}
                        onChange={(e) => handleInputChange(index, 'Rate_Pending', e.target.value)}
                        disabled={accessLevel < 3}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container alignItems="center" justifyContent="center" mt={2}>
            <Button variant="contained" color="success" onClick={handleUpdatePenalties} disabled={buttonDisabled}>
              Update
            </Button>
          </Grid>

          <Snackbar
            open={successSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleSuccessSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleSuccessSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
              Penalties updated successfully!
            </Alert>
          </Snackbar>
          <Snackbar
            open={errorSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleErrorSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleErrorSnackbarClose} severity="error" variant="filled" sx={{ width: '100%' }}>
              Failed to Update Penalties
            </Alert>
          </Snackbar>
        </MainCard>
      )}
    </>
  );
}

export default Penalty;
