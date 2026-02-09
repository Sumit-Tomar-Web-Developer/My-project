import React, { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
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
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  deletePrimeTypeofUse,
  fetchPrimeTypeOfUseList,
  postPrimeTypeOfUse
} from '../../../services/masterServices/prime-type-of-use-services/prime-type-of-use.services.js';
import * as Yup from 'yup';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function PrimeTypeOfUse() {
  const [primeTypeofUseList, setPrimeTypeofUseList] = useState([]);
  const [selectedPrimeType, setSelectedPrimeType] = useState({
    ID: 0,
    Type: '',
    Description: '',
    TypeTaxableStatus: false
  });
  const [typeDisabled, setTypeDisabled] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({
    Description: '',
    Type: ''
  });
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Prime Type Of Use';
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

      console.log(access, 'assigned access to Prime Type of Use Page');

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
    fetchPrimeTypeOfUseData();
  }, [reloadPage]);

  const fetchPrimeTypeOfUseData = () => {
    fetchPrimeTypeOfUseList()
      .then((response) => {
        setPrimeTypeofUseList(response);
        setReloadPage(false);
      })
      .catch((error) => {
        console.error('Error fetching primeTypeofUseList:', error);
      });
  };

  const handleRowClick = (row) => {
    const isSelected = selectedRows.includes(row.ID);
    const newSelectedRows = isSelected ? selectedRows.filter((id) => id !== row.ID) : [...selectedRows, row.ID];

    setSelectedRows(newSelectedRows);

    if (!isSelected) {
      setSelectedPrimeType({
        ID: row.ID,
        Type: row.Type,
        Description: row.Description,
        TypeTaxableStatus: row.TypeTaxableStatus
      });
    } else {
      setSelectedPrimeType({
        ID: 0,
        Type: '',
        Description: '',
        TypeTaxableStatus: false
      });
    }
    setTypeDisabled(!isSelected);
    setDeleteButtonDisabled(newSelectedRows.length === 0);
  };

  const handleDeleteButton = async () => {
    try {
      await deletePrimeTypeofUse(selectedRows);
      setReloadPage(true);
      handleClear();
    } catch (error) {
      console.log('Error in Deleting', error);
    }
    setDeleteButtonDisabled(true);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setSaveButtonDisabled(false);

    setSelectedPrimeType((prevState) => ({
      ...prevState,
      [name]: newValue
    }));

    validationSchema
      .validateAt(name, { [name]: newValue })
      .then(() => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: ''
        }));
      })
      .catch((error) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error.message
        }));
      });
  };

  const handleSave = () => {
    setDeleteButtonDisabled(true);
    validationSchema
      .validate(selectedPrimeType, { abortEarly: false })
      .then(() => {
        postPrimeTypeOfUse(selectedPrimeType)
          .then((response) => {
            console.log('Save successful:', response);
          })
          .catch((error) => {
            console.error('Error saving prime type of use:', error);
          });
        setReloadPage(true);
        handleClear();
        setSaveButtonDisabled(true);
        setErrors({});
      })
      .catch((validationErrors) => {
        console.error('Validation failed:', validationErrors.errors);
        setErrors(
          validationErrors.inner.reduce((errors, error) => {
            return {
              ...errors,
              [error.path]: error.message
            };
          }, {})
        );
      });
  };

  const handleClear = () => {
    setSelectedPrimeType({
      ID: 0,
      Type: '',
      Description: '',
      TypeTaxableStatus: false
    });
    setTypeDisabled(false);
    setDeleteButtonDisabled(true);
    setSelectedRows([]);
  };

  const validationSchema = Yup.object().shape({
    Description: Yup.string().required('Description is required'),
    Type: Yup.string().required('Type is required')
  });

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
        <MainCard title="Prime Type of Use Master">
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Add Prime Type of Use:
          </Typography>
          <Grid display={'flex'} justifyContent={'center'} mt={3}>

            <Grid item xs={3} ml={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Type</InputLabel>
            </Grid>
            <Grid item xs={3} ml={2}>
              <TextField
                name="Type"
                value={selectedPrimeType.Type}
                onChange={handleInputChange}

                helperText={errors.Type}
                FormHelperTextProps={{
                  style: { color: 'red' }
                }}
                disabled={typeDisabled || accessLevel < 3}
              />
            </Grid>
            <Grid item xs={3} ml={3} mt={1}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Description</InputLabel>
            </Grid>
            <Grid item xs={1} ml={2}>
              <TextField
                name="Description"
                value={selectedPrimeType.Description}
                onChange={handleInputChange}
                helperText={errors.Description}
                FormHelperTextProps={{
                  style: { color: 'red' }
                }}
                disabled={accessLevel < 3}
              />
            </Grid>
            <Grid item xs={3} ml={3} mt={1}>
              <Checkbox name="TypeTaxableStatus" checked={selectedPrimeType.TypeTaxableStatus} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={3} ml={2} mt={2}>
              <InputLabel sx={{ fontWeight: 'bolder' }}>Taxable</InputLabel>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
            <Grid item>
              <Button variant="contained" color="success" onClick={handleSave} disabled={accessLevel < 3}>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handleClear} disabled={accessLevel < 3}>
                Clear
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={handleDeleteButton} disabled={accessLevel < 4}>
                Delete
              </Button>
            </Grid>
          </Grid>
          <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Type of Use List:
          </Typography>
          <TableContainer sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.length > 0 && selectedRows.length === primeTypeofUseList.length}
                      indeterminate={selectedRows.length > 0 && selectedRows.length < primeTypeofUseList.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(primeTypeofUseList.map((row) => row.ID));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                      disabled={accessLevel < 3}
                    />
                  </TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Type Description</TableCell>
                  <TableCell>Taxable Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {primeTypeofUseList.map((row) => (
                  <TableRow key={row.ID}>
                    <TableCell>
                      <Checkbox checked={selectedRows.includes(row.ID)} onChange={() => handleRowClick(row)} disabled={accessLevel < 3} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color={selectedPrimeType?.ID === row.ID ? 'success' : 'primary'}
                        onClick={() => handleRowClick(row)}
                        disabled={accessLevel < 3}
                      >
                        {selectedPrimeType?.ID === row.ID ? <SendOutlined /> : <EditTwoTone />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.Type}</TableCell>
                    <TableCell>{row.Description}</TableCell>
                    <TableCell>
                      {row.TypeTaxableStatus ? (
                        <div
                          style={{
                            width: '130px',
                            height: '30px',
                            borderRadius: '5%',
                            backgroundColor: 'green',
                            color: 'white',
                            fontWeight: 'bolder',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          TAXABLE
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '130px',
                            height: '30px',
                            borderRadius: '5%',
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bolder',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          NON -TAXABLE
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      )}
    </>
  );
}

export default PrimeTypeOfUse;
