import { useState, useEffect } from 'react';
import {
  Grid,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Select,
  TableHead,
  TableRow,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Checkbox,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions
} from '@mui/material';
import { Box, Tab, Tabs } from '@mui/material';
import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import {
  deleteZoneSectionMasterList,
  fetchZoneSectionDetailsList,
  fetchZoneSectionMasterList,
  postAddUpdateZoneSectionMasterList,
  postAddZoneDetails
} from 'services/masterServices/zone-section-master-services/zone-section-master.services';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import { fetchWardNo } from 'services/wardnumber.services';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const validationSchema = yup.object().shape({
  ZoneSectionNo: yup.string().required('Zone Section No is required'),
  ZoneSectionType: yup.string().required('Section Type is required'),
  Remark: yup.string().required('Remark is required')
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};

function ZoneSection() {
  const [value, setValue] = useState(0);
  const [zoneSectionList, setZoneSectionList] = useState([]);
  const [reloadPage, setReloadPage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [receivedStatus, setReceivedStatus] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [wardNo, setWardNo] = useState([]);
  const [zoneSectionDetails, setZoneSectionDetailsList] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [filteredWards, setFilteredWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);
  const [selectedWardInZone, setSelectedWardInZone] = useState([]);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Zone Section';
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
      console.log(access, 'assigned access to Zone section master Page');
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
  const handlePostNewList = async () => {
    try {
      const { message, status } = await postAddZoneDetails({
        ZoneSectionNo: selectedZone,
        WardList: filteredWards
      });
      setReceivedMessage(message);
      setReceivedStatus(status);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error In Posting New Zone Details');
    }
  };

  const handleSingleWardAdd = () => {
    let isWardAssigned = false;
    let isWardAssignedList = false;

    zoneSectionDetails.forEach((ward) => {
      if (ward.Ward == selectedWard.NewWardNo) {
        isWardAssigned = true;
      }
    });

    filteredWards.forEach((ward) => {
      if (ward == selectedWard.NewWardNo) {
        isWardAssignedList = true;
      }
    });

    if (isWardAssigned || isWardAssignedList) {
      alert('Ward already assigned');
      return;
    } else {
      const newFilteredWards = [...filteredWards];
      newFilteredWards.push(selectedWard.NewWardNo);
      setFilteredWards(newFilteredWards);
    }
  };

  const handleMultipleWardAdd = () => {
    let isWardAssigned = false;

    zoneSectionDetails.forEach((ward) => {
      wardNo.forEach((newWards) => {
        if (ward.Ward == newWards.NewWardNo) {
          isWardAssigned = true;
        }
      });
    });

    if (isWardAssigned) {
      alert('Ward already assigned');
      return;
    } else {
      const newFilteredWards = [...filteredWards];
      wardNo.forEach((newWards) => newFilteredWards.push(newWards.NewWardNo));

      setFilteredWards(newFilteredWards);
    }
  };

  const handleSingleWardDelete = () => {
    const newFilteredWards = [...filteredWards];

    newFilteredWards.splice(selectedWardInZone, 1);

    setFilteredWards(newFilteredWards);
  };

  const handleMultipleWardDelete = () => {
    const newFilteredWards = [...filteredWards];

    newFilteredWards.splice(0, newFilteredWards.length);

    setFilteredWards(newFilteredWards);
  };

  const handleZoneChange = (event) => {
    const selectedZoneNo = event.target.value;
    setSelectedZone(selectedZoneNo);

    const wards = zoneSectionDetails.filter((zone) => zone.ZoneSectionNo === selectedZoneNo).map((zone) => zone.Ward);

    setFilteredWards(wards);
  };

  const handleSelectedWard = (ward) => {
    setSelectedWard(ward);
  };

  const handleSelectedWardInZone = (index) => {
    setSelectedWardInZone(index);
  };

  const formik = useFormik({
    initialValues: {
      ZoneSectionNo: '',
      ZoneSectionType: '',
      Remark: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const { message, status } = await postAddUpdateZoneSectionMasterList({
          ZoneID: values.ZoneID ? values.ZoneID : 0,
          ZoneSectionNo: values.ZoneSectionNo,
          ZoneSectionType: values.ZoneSectionType,
          Remark: values.Remark, 
          Status: true
        });
        setReceivedStatus(status);
        setReceivedMessage(message);
        setSnackbarOpen(true);
        setReloadPage(true);
        resetForm();
      } catch (error) {
        console.error('Error saving zone section:', error);
      }
    }
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchZoneSectionMasterList().then((res) => setZoneSectionList(res.data));
    setReloadPage(false);
  }, [reloadPage]);

  useEffect(() => {
    fetchZoneSectionDetailsList().then((res) => setZoneSectionDetailsList(res.data));
    setReloadPage(false);
  }, [filteredWards]);

  useEffect(() => {
    fetchWardNo().then((res) => setWardNo(res));
  }, []);

  useEffect(() => {
    const totalSelected = selectedCheckboxes.length;
    const totalCheckboxes = zoneSectionList.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedCheckboxes, zoneSectionList]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDelete = async () => {
    try {
      const { message, status } = await deleteZoneSectionMasterList({ IDs: selectedCheckboxes });
      setReceivedStatus(status);
      setReceivedMessage(message);
      setSnackbarOpen(true);
      setReloadPage(true);
    } catch (error) {
      console.error('Error in Deleting Zone Section:', error);
      setReceivedStatus(500);
    }
  };

  const handleRowClick = (zoneSection) => {
    formik.setValues(zoneSection);
  };

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedCheckboxes([...selectedCheckboxes, id]);
    } else {
      setSelectedCheckboxes(selectedCheckboxes.filter((checkboxId) => checkboxId !== id));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = zoneSectionList.map((zone) => zone.ZoneID);
      setSelectedCheckboxes(allIds);
    } else {
      setSelectedCheckboxes([]);
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
        <MainCard title="Zone Section Master">
          <Grid item xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Zone Section" iconPosition="end" {...a11yProps(0)} />
                <Tab label="Add wards to Zone" />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <form onSubmit={formik.handleSubmit}>
                <Grid display={'flex'} justifyContent={'center'} mt={3}>
                  <Grid item xs={3} mt={1}>
                    <InputLabel sx={{ fontWeight: 'bolder' }}>Zone Section No</InputLabel>
                  </Grid>
                  <Grid item xs={1} ml={2}>
                    <TextField
                      name="ZoneSectionNo"
                      value={formik.values.ZoneSectionNo}
                      onChange={formik.handleChange}
                      error={formik.touched.ZoneSectionNo && Boolean(formik.errors.ZoneSectionNo)}
                      helperText={formik.touched.ZoneSectionNo && formik.errors.ZoneSectionNo}
                      disabled={accessLevel < 3}
                    />
                  </Grid>
                  <Grid item xs={3} ml={3} mt={1}>
                    <InputLabel sx={{ fontWeight: 'bolder' }}>Section Type</InputLabel>
                  </Grid>
                  <Grid item xs={3} ml={2}>
                    <TextField
                      name="ZoneSectionType"
                      value={formik.values.ZoneSectionType}
                      onChange={formik.handleChange}
                      error={formik.touched.ZoneSectionType && Boolean(formik.errors.ZoneSectionType)}
                      helperText={formik.touched.ZoneSectionType && formik.errors.ZoneSectionType}
                      disabled={accessLevel < 3}
                    />
                  </Grid>
                  <Grid item xs={3} ml={3} mt={1}>
                    <InputLabel sx={{ fontWeight: 'bolder' }}>Remark</InputLabel>
                  </Grid>
                  <Grid item xs={3} ml={2}>
                    {/* <TextField name="Remark" onChange={handleChange}
                     disabled={accessLevel < 3} 
                     /> */}
                     <TextField
  name="Remark"
  value={formik.values.Remark}
  onChange={formik.handleChange}
  error={formik.touched.Remark && Boolean(formik.errors.Remark)}
  helperText={formik.touched.Remark && formik.errors.Remark}
  disabled={accessLevel < 3}
/>

                  </Grid>
                </Grid>
                <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
                  <Grid item>
                    <Button type="submit" variant="contained" color="success" disabled={accessLevel < 3}>
                      Save
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="secondary" onClick={formik.resetForm} disabled={accessLevel < 3}>
                      Clear
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="error" onClick={handleDelete} disabled={accessLevel < 4}>
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <TableContainer sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '1vw' }} display={'flex'}>
                        <Checkbox
                          indeterminate={indeterminate}
                          checked={allChecked}
                          onChange={handleSelectAll}
                          disabled={accessLevel < 3}
                        />
                      </TableCell>
                      <TableCell sx={{ pl: 3 }}>Edit</TableCell>
                      <TableCell sx={{ pl: 3 }}>Zone Number</TableCell>
                      <TableCell sx={{ pl: 3 }}>Section Type</TableCell>
                      <TableCell sx={{ pl: 3 }}>Remark</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {zoneSectionList.map((zoneSection, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCheckboxes.includes(zoneSection.ZoneID)}
                            onChange={(event) => handleCheckboxChange(event, zoneSection.ZoneID)}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color={formik.values.ZoneID === zoneSection.ZoneID ? 'success' : 'primary'}
                            onClick={() => handleRowClick(zoneSection)}
                            disabled={accessLevel < 3}
                          >
                            {formik.values.ZoneID === zoneSection.ZoneID ? <SendOutlined /> : <EditTwoTone />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{zoneSection.ZoneSectionNo}</TableCell>
                        <TableCell>{zoneSection.ZoneSectionType}</TableCell>
                        <TableCell>{zoneSection.Remark}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid display={'flex'} justifyContent={'flex-start'} mt={3} ml={10}>
                <Grid item xs={3} mt={1}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Zone Section No.</InputLabel>
                </Grid>
                <Grid item xs={1} ml={2}>
                  <Select sx={{ minWidth: '12vw' }} onChange={handleZoneChange} value={selectedZone} disabled={accessLevel < 3}>
                    <MenuItem disabled>Select Zone Section No</MenuItem>
                    {zoneSectionList.map((zone) => (
                      <MenuItem key={zone.ZoneID} value={zone.ZoneSectionNo}>
                        {zone.ZoneSectionNo}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid container spacing={2.5} display={'flex'} justifyContent={'center'} sx={{ height: '40vh' }}>
                <Grid item xs={12} md={5} lg={3}>
                  <TableContainer sx={{ height: '30vh', marginTop: '6vh' }}>
                    <Table>
                      <TableBody>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: '20vw' }}>All wards</TableCell>
                          </TableRow>
                        </TableHead>

                        {wardNo.map((ward, index) => (
                          <TableRow
                            key={index}
                            onClick={() => handleSelectedWard(ward)}
                            disabled={accessLevel < 3}
                            style={{ backgroundColor: selectedWard.NewWardNo === ward.NewWardNo ? '#d3d3d3' : 'inherit' }}
                          >
                            <TableCell>{ward.NewWardNo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={5} lg={3}>
                  <Grid display={'flex'} justifyContent={'center'} flexDirection={'column'} mt={15}>
                    <Grid>
                      <Button variant="contained" color="success" fullWidth onClick={handleSingleWardDelete}>
                        &lt;
                      </Button>
                    </Grid>
                    <Grid mt={1}>
                      <Button variant="contained" color="error" fullWidth onClick={handleMultipleWardDelete}>
                        &lt; &lt;
                      </Button>
                    </Grid>
                    <Grid mt={1}>
                      <Button variant="contained" fullWidth onClick={handleSingleWardAdd}>
                        &gt;
                      </Button>
                    </Grid>

                    <Grid mt={1}>
                      <Button variant="contained" color="info" fullWidth onClick={handleMultipleWardAdd}>
                        &gt; &gt;
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5} lg={3}>
                  <TableContainer sx={{ height: '30vh', marginTop: '6vh' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Added Wards</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredWards.map((zone, index) => (
                          <TableRow
                            key={index}
                            onClick={() => handleSelectedWardInZone(index)}
                            style={{ backgroundColor: selectedWardInZone === index ? '#d3d3d3' : 'inherit' }}
                            disabled={accessLevel < 3}
                          >
                            <TableCell>{zone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid container justifyContent="center" spacing={3} style={{ marginTop: 5 }}>
                <Grid item>
                  <Button variant="contained" color="success" onClick={handlePostNewList} disabled={accessLevel < 3}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={receivedStatus === 200 || receivedStatus === 201 ? 'success' : receivedStatus === 202 ? 'info' : 'error'}
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

export default ZoneSection;
