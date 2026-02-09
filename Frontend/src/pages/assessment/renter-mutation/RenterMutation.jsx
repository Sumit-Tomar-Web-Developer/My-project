import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Button,
  SnackbarContent,
  FormControlLabel,
  Snackbar,
  Checkbox,
  Box,
  IconButton,
  FormHelperText
} from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import translateText from '../../../utils/translator';
import { format, parseISO } from 'date-fns';
import MainCard from 'components/MainCard';

import { fetchWardNo, postWardSelection } from 'services/wardnumber.services';
import { useEffect, useState } from 'react';
import { getRenterMutationDataByOwnerID, saveRenterMutationInfo } from 'services/renterMutaionService';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import * as yup from 'yup';
import { fetchNewFloor } from 'services/floorMaster.service';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService.js';

// ==============================|| SAMPLE PAGE ||============================== //

function RenterMutation() {
  const [wardNo, setWardNo] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [receivedPropertyOwnerList, setReceivedPropertyOwnerList] = useState([]);
  const [selectPropertyOwnerList, setSelectPropertyOwnerList] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedOwnerID, setSelectedOwnerID] = useState('');
  const [selectedPropertyNo, setSelectedPropertyNo] = useState('');
  const [selectedPartitionNo, setSelectedPartitionNo] = useState('');
  const [jointOwnerList, setJointOwnerList] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [renterFloorList, setRenterFloorList] = useState([]);
  const [transerDetailsList, setTranserDetailsList] = useState([]);
  const [NewProperty, setNewProperty] = useState('');
  const [errors, setErrors] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [remark, setRemark] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [mutationDate, setMutationDate] = useState('');
  const [floorList, setFloorList] = useState([]);
  const [renterFloorDetails, setRenterFloorDetails] = useState({
    PDNId: '',
    OwnerID: 0,
    FloorID: '',
    ConstructionType: '',
    TypeOFUse: '0',
    GroupId: '0',
    ConstructionYear: '',
    NoOfRooms: '',
    CarpetAreaSqFeet: '',
    CarpetAreaSqMeter: '',
    BuiltUpSqFt: '',
    BuiltUpSqMFt: '',
    Room: '',
    Registration: '',
    Occupier: '',
    OccupierName: '',
    OccupierNameMarathi: '',
    RenterName: '',
    RenterNameMarathi: '',
    Rent: '',
    NonCalculateRent: '',
    AgreementDate: null,
    AgreementToDate: null
  });

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Renter Mutation';
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
      console.log(access, 'assigned access to Renter Mutation Page');
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

  useEffect(() => {
    fetchNewFloor().then((res) => {
      setFloorList(res.floorList);
    });
  }, []);
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRenterFloorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));

    // Check if the field is RenterName or OccupierName
    if (name === 'RenterName' || name === 'OccupierName') {
      // Clear errors related to Marathi names
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name === 'RenterName' ? 'RenterNameMarathi' : 'OccupierNameMarathi']: ''
      }));

      if (name === 'RenterName') {
        translateText(value)
          .then((translated) => {
            setRenterFloorDetails((prevState) => ({
              ...prevState,
              RenterNameMarathi: translated
            }));
          })
          .catch((err) => {
            console.error('Error:', err);
          });
      } else if (name === 'OccupierName') {
        translateText(value)
          .then((translated) => {
            setRenterFloorDetails((prevState) => ({
              ...prevState,
              OccupierNameMarathi: translated
            }));
          })
          .catch((err) => {
            console.error('Error:', err);
          });
      }
    }
  };

  const handleWardChange = (event) => {
    const { value } = event.target;
    setSelectedWard(value);
    setErrors((prevErrors) => ({ ...prevErrors, selectedWard: undefined }));
  };

  const handleNewPropertyChange = (event) => {
    const { value } = event.target;
    setNewProperty(value);
    setErrors((prevErrors) => ({ ...prevErrors, NewProperty: undefined }));
  };

  const handleOrderNoChange = (event) => {
    const { value } = event.target;
    setOrderNo(value);
    setErrors((prevErrors) => ({ ...prevErrors, orderNo: undefined }));
  };

  const handleMutationDateChange = (date) => {
    setMutationDate(date);
  };
  const handleSelectedCell = (ownerId, propertyNo, partitionNo) => {
    setSelectedOwnerID(ownerId);
    setSelectedPropertyNo(propertyNo);
    setSelectedPartitionNo(partitionNo);
    setJointOwnerList([]);
  };

  //map ward numbers to the dropdown
  useEffect(() => {
    fetchWardNo()
      .then((wardNo) => {
        setWardNo(wardNo);
      })
      .catch((error) => {
        console.error('Error fetching ward Number', error);
      });
  }, []);

  //map property numbers to dropdown
  useEffect(() => {
    const fetchData = async () => {
      if (selectedWard) {
        try {
          const response = await postWardSelection(selectedWard);
          setReceivedPropertyOwnerList(response.properties);
          console.log(response, 'propertyy');
        } catch (error) {
          console.error('Error posting ward No.:', error);
        }
      }
    };
    fetchData();
  }, [selectedWard]);

  //map for selected ownerid initial data joint|| newfloo|| transfer details
  useEffect(() => {
    const fetchRenterDetails = async () => {
      if (selectedOwnerID) {
        try {
          const response = await getRenterMutationDataByOwnerID(selectedOwnerID);
          const { jointOwnerInfo } = response.RenterInfo;
          const { propertyDetailsNew } = response.RenterInfo;
          const { prevRenterTransferDetails } = response.RenterInfo;
          setJointOwnerList(jointOwnerInfo);
          setRenterFloorList(propertyDetailsNew);
          setTranserDetailsList(prevRenterTransferDetails);
        } catch (error) {
          console.error('Error fetching info:', error);
        }
      }
    };
    fetchRenterDetails();
  }, [selectedOwnerID]);

  const filteredPropertyOwnerList = receivedPropertyOwnerList.filter((item) => {
    if (selectPropertyOwnerList) {
      // Ensure that NewPropertyNo is not null or undefined before using toLowerCase
      return item.NewPropertyNo && item.NewPropertyNo.toLowerCase().includes(searchInput.toLowerCase());
    } else {
      // Ensure that OwnerName is not null or undefined before using toLowerCase
      return item.OwnerName && item.OwnerName.toLowerCase().includes(searchInput.toLowerCase());
    }
  });

  const handleRowClick = (row) => {
    setSelectedItem(row);
    setRenterFloorDetails({
      PDNId: row.PDNId,
      FloorID: row.FloorID,
      OccupierName: row.OccupierName,
      OccupierNameMarathi: row.OccupierNameMarathi,
      RenterName: row.RenterName,
      RenterNameMarathi: row.RenterNameMarathi
    });
  };
  // Use useEffect to log the selected item when it changes
  useEffect(() => {
    console.log(selectedItem, 'selectedItem');
  }, [selectedItem]);

  const handleAddClick = () => {
    if (selectedItem) {
      setRenterFloorList((prevList) =>
        prevList.map((item) => (item.PDNId === selectedItem.PDNId ? { ...item, ...renterFloorDetails } : item))
      );
    }
  };

  useEffect(() => {
    console.log('Updated renterFloorList:', renterFloorList);
  }, [renterFloorList]);

  const validationSchema = yup.object().shape({
    selectedWard: yup.number().required('Ward is required'),
    NewProperty: yup.number().required('Property is required'),
    orderNo: yup.number().required('Order number is required'),
    mutationDate: yup.date().required('Mutation date is required'),
    RenterNameMarathi: yup
      .string()
      .nullable()
      .test('renter-or-occupier', ' Renter name is required', function (value) {
        const { OccupierNameMarathi } = this.parent;
        return value || (OccupierNameMarathi && OccupierNameMarathi.trim() !== '');
      }),
    OccupierNameMarathi: yup
      .string()
      .nullable()
      .test('occupier-or-renter', 'Occupier name is required', function (value) {
        const { RenterNameMarathi } = this.parent;
        return value || (RenterNameMarathi && RenterNameMarathi.trim() !== '');
      })
  });
  const handleSaveClick = async () => {
    const formattedDate = mutationDate ? format(new Date(mutationDate), 'yyyy-MM-dd') : null;
    const parsedDate = parseISO(formattedDate);

    const renterInfo = [
      {
        OwnerID: selectedOwnerID,
        Floor: renterFloorDetails.FloorID || '',
        PDNID: selectedItem ? selectedItem.PDNId : '',
        CurrentRenter: renterFloorDetails.RenterName || '',
        MCurrentRenter: renterFloorDetails.RenterNameMarathi || '',
        PreviousRenter: selectedItem ? selectedItem.RenterName || '' : '',
        MPreviousRenter: selectedItem ? selectedItem.RenterNameMarathi || '' : '',
        CurrentOccupier: renterFloorDetails.OccupierName || '',
        MCurrentOccupier: renterFloorDetails.OccupierNameMarathi || '',
        PreviousOccupier: selectedItem ? selectedItem.OccupierName || '' : '',
        MPreviousOccupier: selectedItem ? selectedItem.OccupierNameMarathi || '' : '',
        Remark: remark || '',
        MutationDate: parsedDate || '',
        OrderNo: orderNo || ''
      }
    ];

    console.log(renterInfo, 'datat');
    try {
      await validationSchema.validate(
        {
          selectedWard,
          NewProperty,
          orderNo,
          mutationDate,
          RenterNameMarathi: renterFloorDetails.RenterNameMarathi,
          OccupierNameMarathi: renterFloorDetails.OccupierNameMarathi
        },
        { abortEarly: false }
      );
      // After validation, check selectedItem again before accessing PDNId
      if (!selectedItem || !selectedItem.PDNId) {
        throw new Error('Please select a row to update.');
      }
      const response = await saveRenterMutationInfo(renterInfo);
      console.log(response.result.renterData.prevRenterTransferDetails, 'res');

      setReceivedMessage(response.message);
      setSnackbarSeverity('success');
      setSnackbarMessage(receivedMessage);
      setSnackbarOpen(true);
      setTranserDetailsList(response.result.renterData.prevRenterTransferDetails);
      setRenterFloorList(response.result.renterData.propertyDetailsNew);
      setJointOwnerList(response.result.renterData.jointOwnerInfo);

      setSelectedItem(null);
      setRenterFloorDetails({
        PDNId: '',
        FloorID: '',
        OccupierName: '',
        OccupierNameMarathi: '',
        RenterName: '',
        RenterNameMarathi: ''
      });
      setOrderNo('');
      setMutationDate(null);
      setRemark('');
    } catch (err) {
      const validationErrors = {};

      // Check if the error has inner validation errors
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        // Handle unexpected errors and set a generic message
        setSnackbarSeverity('error');
        console.log(err.message);
        setReceivedMessage(err.message);
        setSnackbarMessage(receivedMessage || 'An unexpected error occurred. Please try again.');
        setSnackbarOpen(true);
      }
    }
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
        <MainCard title="Renter Mutation">
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <MainCard>
                <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Search By:
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>
                        Ward No: <span style={{ color: 'red' }}>*</span>{' '}
                      </InputLabel>
                      <Select
                        labelId="ward-no-label"
                        id="ward-no-select"
                        value={selectedWard}
                        onChange={handleWardChange}
                        displayEmpty
                        disabled={accessLevel < 3}
                          MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                      >
                        <MenuItem value="" disabled>
                          Select Ward No
                        </MenuItem>
                        {Array.isArray(wardNo) &&
                          wardNo.length > 0 &&
                          wardNo.map((ward, index) => (
                            <MenuItem key={index} value={ward.NewWardNo}>
                              {ward.NewWardNo}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.selectedWard && <FormHelperText style={{ color: 'red' }}>{errors.selectedWard}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>
                        Property No: <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        labelId="Property-no-label"
                        id="Property-no-select"
                        value={NewProperty}
                        onChange={handleNewPropertyChange}
                        displayEmpty
                        disabled={accessLevel < 3}
                          MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                      >
                        <MenuItem value="" disabled>
                          Select Property No
                        </MenuItem>
                        {filteredPropertyOwnerList.map((item, index) => (
                          <MenuItem
                            key={index}
                            value={item.OwnerID}
                            onClick={() => handleSelectedCell(item.OwnerID, item.NewPropertyNo, item.NewPartitionNo)}
                          >
                            {item.NewPartitionNo !== '' ? item.NewPropertyNo + '-' + item.NewPartitionNo : item.NewPropertyNo}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.NewProperty && <FormHelperText style={{ color: 'red' }}>{errors.NewProperty}</FormHelperText>}
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel>Partition No:</InputLabel>
                      <TextField value={selectedPartitionNo} disabled={!selectedPartitionNo} disabled={accessLevel < 3} />
                    </Stack>
                  </Grid>
                </Grid>

                <Grid mt={2}>
                  <MainCard>
                    <Typography sx={{ mb: 2, mt: 1 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                      Owner Details:
                    </Typography>
                    <TableContainer style={{ marginTop: 20, height: '25vh' }}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell className="font-weight-bold">isPrime</TableCell>
                            <TableCell className="font-weight-bold">M.Title</TableCell>
                            <TableCell className="font-weight-bold">Full Name</TableCell>
                            <TableCell className="font-weight-bold">Full Name(Marathi) </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {jointOwnerList?.length > 0 ? (
                            jointOwnerList.map((item, index) => {
                              return (
                                <TableRow key={index}>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <FormControlLabel control={<Checkbox checked={item.isPrime} />} />
                                  </TableCell>
                                  <TableCell>{item.OwnerTitle || ''}</TableCell>
                                  <TableCell>{item.OwnerName || ''}</TableCell>
                                  <TableCell>{item.OwnerNameMarathi || ''}</TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                No Data Available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </MainCard>
                </Grid>
              </MainCard>
            </Grid>

            <MainCard>
              <Grid mt={2}>
                <MainCard>
                  <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                    Renter and Floor Details:
                  </Typography>
                  <TableContainer style={{ height: '30.5vh', overflow: 'auto', marginTop: 20 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Edit</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Floor</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Const.Year</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Const.Type</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Group Id</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Type of Use</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Carpet Area(Ft)</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Carpet Area(mtr)</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Rooms</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Registration</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Renter</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Renter Full Name</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Calculate Rent</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>NonCalculate Rent</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>भाडेकरूचे पूर्ण नाव</TableCell>
                          {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>Occupier</TableCell> */}
                          {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>भोगवटधाराचे पूर्ण नाव</TableCell> */}
                          {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>Occupier Full Name</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {renterFloorList.length > 0 ? (
                          renterFloorList.map((row, index) => {
                            return (
                              <TableRow hover key={row.PDNId}>
                                <TableCell>
                                  <IconButton
                                    color={selectedItem?.PDNId === row.PDNId ? 'success' : 'primary'}
                                    onClick={() => handleRowClick(row)}
                                    disabled={accessLevel < 3}
                                  >
                                    {selectedItem?.PDNId === row.PDNId ? <SendOutlined /> : <EditTwoTone />}
                                  </IconButton>
                                </TableCell>
                                <TableCell>{row.FloorID}</TableCell>
                                <TableCell>{row.ConstructionYear}</TableCell>
                                <TableCell>{row.ConstructionType}</TableCell>
                                <TableCell>{row.GroupId}</TableCell>
                                <TableCell sx={{ pr: 3 }}>
                                  <span>{row.TypeOFUse}</span>
                                </TableCell>
                                <TableCell>{row.CarpetAreaSqFeet}</TableCell>
                                <TableCell>{row.CarpetAreaSqMeter}</TableCell>
                                <TableCell>{row.NoOfRooms}</TableCell>
                                <TableCell align="center">
                                  <Checkbox checked={row.Registration} />
                                </TableCell>
                                <TableCell align="center">
                                  <Checkbox checked={row.RenterYesNO} />
                                </TableCell>
                                <TableCell>{row.RenterName}</TableCell>

                                <TableCell>{row.Rent}</TableCell>
                                <TableCell>{row.NonCalculateRent}</TableCell>
                                <TableCell>{row.RenterNameMarathi}</TableCell>

                                {/* <TableCell align="center">
                                  <Checkbox checked={row.OccupierYesNo} />
                                </TableCell> */}

                                {/* <TableCell>{row.OccupierNameMarathi}</TableCell> */}
                                {/* <TableCell>{row.OccupierName}</TableCell> */}
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                              No Data Available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MainCard>
              </Grid>
              <Grid mt={2}>
                <MainCard>
                  <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                    Edit Data Here:{' '}
                  </Typography>
                  <Grid container spacing={3}>
                    {/* <Grid item xs={12} sm={0.8}>
                    <Stack spacing={1}>
                      <InputLabel>Floor </InputLabel>
                      <TextField
                        required
                        name="FloorID"
                        value={renterFloorDetails.FloorID}
                        onChange={handleChange}
                        fullWidth
                        autoComplete="given-name"
                      />
                    </Stack>
                  </Grid> */}
                    <Grid item xs={12} sm={1.2}>
                      <Stack spacing={1}>
                        <InputLabel>Floor</InputLabel>
                        <Select
                          name="FloorID"
                          value={renterFloorDetails.FloorID}
                          onChange={handleChange}
                          displayEmpty
                          sx={{ bgcolor: '#F5F5F5' }}
                          disabled={accessLevel < 3}
                        >
                          <MenuItem value="" disabled>
                            Select Floor
                          </MenuItem>
                          {floorList.map((type) => (
                            <MenuItem key={type.FMId} value={type.FloorID}>
                              {type.FloorID}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2.8}>
                      <Stack spacing={1}>
                        <InputLabel> Renter Full Name </InputLabel>
                        <TextField
                          required
                          name="RenterName"
                          value={renterFloorDetails.RenterName}
                          onChange={handleChange}
                          fullWidth
                          autoComplete="given-name"
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2.8}>
                      <Stack spacing={1}>
                        <InputLabel>
                          Renter Full Name(Marathi) <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <TextField
                          required
                          name="RenterNameMarathi"
                          value={renterFloorDetails.RenterNameMarathi}
                          onChange={handleChange}
                          fullWidth
                          autoComplete="given-name"
                          error={!!errors.RenterNameMarathi}
                          helperText={errors.RenterNameMarathi}
                          FormHelperTextProps={{ style: { color: 'red' } }}
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </Grid>
                    {/* <Grid item xs={12} sm={2.8}>
                      <Stack spacing={1}>
                        <InputLabel> Occupier Full Name </InputLabel>
                        <TextField
                          required
                          name="OccupierName"
                          value={renterFloorDetails.OccupierName}
                          onChange={handleChange}
                          fullWidth
                          autoComplete="given-name"
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </Grid> */}
                    {/* <Grid item xs={12} sm={2.8}>
                      <Stack spacing={1}>
                        <InputLabel>
                          {' '}
                          Occuiper Full Name(Marathi) <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <TextField
                          required
                          name="OccupierNameMarathi"
                          value={renterFloorDetails.OccupierNameMarathi}
                          onChange={handleChange}
                          fullWidth
                          autoComplete="given-name"
                          error={!!errors.OccupierNameMarathi}
                          helperText={errors.OccupierNameMarathi}
                          FormHelperTextProps={{ style: { color: 'red' } }}
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </Grid> */}

                    <Grid item xs={12} sm={2.5}>
                      <Stack spacing={1}>
                        <InputLabel>
                          Mutation Date <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={mutationDate}
                            onChange={handleMutationDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            error={!!errors.mutationDate}
                            helperText={errors.mutationDate}
                            FormHelperTextProps={{ style: { color: 'red' } }}
                            disabled={accessLevel < 3}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={1.5}>
                      <Stack spacing={1}>
                        <InputLabel>
                          Order No: <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <TextField
                          required
                          value={orderNo}
                          onChange={handleOrderNoChange}
                          fullWidth
                          autoComplete="given-name"
                          error={!!errors.orderNo}
                          helperText={errors.orderNo}
                          FormHelperTextProps={{ style: { color: 'red' } }}
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={7}>
                      <Stack spacing={1}>
                        <InputLabel>Remark</InputLabel>
                        <TextField
                          required
                          name="Remark"
                          value={remark}
                          onChange={(event) => setRemark(event.target.value)}
                          fullWidth
                          autoComplete="given-name"
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={1} mt={3.8}>
                      <Stack spacing={1}>
                        <Button variant="contained" color="success" onClick={handleAddClick} disabled={accessLevel < 3}>
                          ADD
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>

                <Box display="flex" justifyContent="center" marginTop={2}>
                  <Button variant="contained" color="success" onClick={handleSaveClick} disabled={accessLevel < 3}>
                    SAVE
                  </Button>
                </Box>
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
              </Grid>
              <Grid mt={2}>
                <MainCard>
                  <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                    Property Transfer Details:
                  </Typography>
                  <TableContainer style={{ height: '49.5vh', overflow: 'auto', marginTop: 20 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ pl: 3 }}>Floor</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Curr.Renter</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Curr.Renter (Marathi)</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Prev. Renter</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Prev. Renter (Marathi)</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Remark</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Mutation Date</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Order No</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Curr. Occupier</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Curr. Occupier (Marathi)</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Prev. Occupier</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Prev. Occupier (Marathi)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transerDetailsList &&
                          transerDetailsList.length > 0 &&
                          transerDetailsList.map((row, index) => (
                            <TableRow hover key={index}>
                              <TableCell align="right">{row.Floor || ''}</TableCell>
                              <TableCell align="right">{row.CurrentRenter || ''}</TableCell>
                              <TableCell align="right">{row.MCurrentRenter || ''}</TableCell>
                              <TableCell align="right">{row.PreviousRenter || ''}</TableCell>
                              <TableCell align="right">{row.MPreviousRenter || ''}</TableCell>
                              <TableCell align="right">{row.Remark || ''}</TableCell>
                              <TableCell align="right">
                                {row.MutationDate ? new Date(row.MutationDate).toLocaleDateString('en-GB') : ''}
                              </TableCell>
                              <TableCell align="right">{row.OrderNo || ''}</TableCell>
                              <TableCell align="right">{row.CurrentOccupier || ''}</TableCell>
                              <TableCell align="right">{row.MCurrentOccupier || ''}</TableCell>
                              <TableCell align="right">{row.PreviousOccupier || ''}</TableCell>
                              <TableCell align="right">{row.MPreviousOccupier || ''}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MainCard>
              </Grid>
            </MainCard>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

export default RenterMutation;
