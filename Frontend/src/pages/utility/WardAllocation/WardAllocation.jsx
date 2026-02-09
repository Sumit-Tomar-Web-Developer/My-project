// material-ui
import { DeleteOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';

import {
  Box,
  Select,
  MenuItem,
  Grid,
  InputLabel,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  Checkbox,
  OutlinedInput,
  Button,
  IconButton,
  SnackbarContent,
  Snackbar,
  Typography
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { fetchWardList } from 'services/data-entry.services';
import { getUserInfoById, getUserNames, saveAllocatedWards } from 'services/utlilityService/wardAllocations/wardAllocationService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

// ==============================|| SAMPLE PAGE ||============================== //

function WardAllocation() {
  const [usersName, setUsersName] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState({});
  const [userData, setUserData] = useState({
    UserID: 0,
    name: '',
    AllocatedWard: []
  });

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Ward Allocation';
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
      console.log(access, 'assigned access to Ward Allocation Page');
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

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

useEffect(() => {
  const getUser = async () => {
    const response = await getUserNames();
    console.log(response, 'list of users');

    if (response && response.data && Array.isArray(response.data)) {
      setUsersName(response.data);
    }
  };
  getUser();
}, []);



  useEffect(() => {
    const getWards = async () => {
      const wardList = await fetchWardList();
      console.log(wardList, 'list ward issued by user');
      const sortedWards = wardList.sort((a, b) => a.NewWardNo - b.NewWardNo);
      setWardList(sortedWards);
    };
    getWards();
  }, []);

  // useEffect(() => {
  //   setUserData({
  //     ...userData,
  //     AllocatedWard: userData.AllocatedWard.map((ward) => String(ward))
  //   });
  // }, [userData.AllocatedWard]);

  const handleRowClick = (user) => {
    console.log('Row clicked:', user); // Log the user object for debugging

    const allocatedWard = Array.isArray(user.AllocatedWard) ? user.AllocatedWard : JSON.parse(user.AllocatedWard || '[]');

    if (allocatedWard.length === 0) {
      setDialogMessage('Edit not allowed for users with no allocated wards.');
      setOpenDialog(true);
      return;
    }

    console.log('Setting selected row and user data'); // Debugging logs
    setSelectedRow(user.UserID);
    setUserData({
      UserID: user.UserID,
      name: user.name,
      AllocatedWard: allocatedWard
    });
  };

  const handleCancel = () => {
    setSelectedRow('');
    setUserData({
      UserID: 0,
      name: '',
      AllocatedWard: []
    });
    //setUserInfo([]);
  };
  const validatFields = () => {
    const newErrors = {};

    if (!userData.name) {
      newErrors.name = 'Name is required';
    }
  
    // Validate allocated ward (it should be an array with at least one selected ward)
    if (!userData.AllocatedWard || userData.AllocatedWard.length === 0 || userData.AllocatedWard.includes('ALL')) {
      newErrors.AllocatedWard = 'Please select a ward to allocate';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [userIdToDelete, setUserIdToDelete] = useState('');

  const handleDelete = async (userId) => {
    setOpenDeleteDialog(true);
    setUserIdToDelete(userId);
  };

  const handleSave = async () => {
    if (!validatFields()) return;
    const usersData = {
      UserID: userData.UserID,
      AllocatedWard: userData.AllocatedWard
    };

    console.log('Sending request with userData:', usersData);
    try {
      const response = await saveAllocatedWards(usersData);
      setSnackbarOpen(true);
      setReceivedMessage(response.message);
      setSnackbarMessage(receivedMessage);
      console.log('response', response);
      setUserInfo(response.userData);
      handleCancel();
    } catch (error) {
      console.error('Error while saving allocated wards:', error);
    }
  };
  const [open, setOpen] = useState(false);

 
  const handleChange = (event) => {
    setError({});
    const { name, value } = event.target;

    if (name === 'name') {
      const selectedUser = usersName.find((user) => user.UserID === parseInt(value, 10));
      setUserData({
        UserID: selectedUser.UserID,
        name: selectedUser.name,
        AllocatedWard: Array.isArray(selectedUser.AllocatedWard)
          ? selectedUser.AllocatedWard
          : JSON.parse(selectedUser.AllocatedWard || '[]')
      });
        getUserInfoById(value).then((response) => {
        setUserInfo(response.user);
      });
    }
    if (name === 'AllocatedWard') {
      const newSelectedWards = typeof value === 'string' ? value.split(',') : value.map((ward) => String(ward));

      // If "ALL" is selected, select all wards
      if (newSelectedWards.includes('ALL')) {
        setUserData({
          ...userData,
          AllocatedWard: ['ALL', ...wardList.map((ward) => String(ward.NewWardNo))]
        });
      } else {
        // Remove "ALL" if it's not selected anymore
        const filteredWards = newSelectedWards.filter((ward) => ward !== 'ALL');

        // Ensure there are no duplicates and that all values are strings
        setUserData({
          ...userData,
          AllocatedWard: Array.from(new Set(filteredWards.map((ward) => String(ward))))
        });
      }
    }
  };

  const normalizedAllocatedWard = Array.isArray(userData.AllocatedWard) ? userData.AllocatedWard.map((ward) => String(ward)) : [];

  const handleRenderValue = (selected) => {
    const normalizedSelected = selected.map((ward) => String(ward));
    console.log('Normalized Selected:', normalizedSelected);
    if (normalizedSelected.includes('ALL')) {
      return 'ALL';
    }
    return normalizedSelected.join(', ');
  };

  const handleSelectAll = (event) => {
    // If "ALL" is selected, check/uncheck all wards
    if (event.target.checked) {
      setUserData({ ...userData, AllocatedWard: ['ALL', ...wardList.map((ward) => String(ward.NewWardNo))] });
    } else {
      setUserData({ ...userData, AllocatedWard: [] });
    }
  };

   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

   const handleCancelDelete = () => {
  setOpenDeleteDialog(false);
};

 const handleConfirmDelete = async () => {
  const usersData = {
    UserID: userIdToDelete,
    AllocatedWard: []
  };
  console.log('Sending request with userData:', usersData);

  // Show message if there are no wards
  if (usersData.AllocatedWard.length === 0) {
    setReceivedMessage('No allocated wards to delete.');
    setSnackbarMessage('No allocated wards to delete.');
    setSnackbarOpen(true);
  }

  try {
    const response = await saveAllocatedWards(usersData);
    console.log('Response from API:', response);
    setSnackbarOpen(true);

    if (response.message === 'Allocated wards updated successfully to [].') {
      // ✅ Success case: empty the table
      setReceivedMessage('Ward allocation deleted successfully');
      setSnackbarMessage('Ward allocation deleted successfully');
      setUserInfo([]); // clear the table
    } else {
      // In case API still returns userData, fall back to it
      setUserInfo(response.userData || []);
    }

    handleCancel();
  } catch (err) {
    console.error('Error while deleting allocated wards:', err);
  }
  setOpenDeleteDialog(false);
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
        <MainCard title="Ward Allocation">
          <Grid
            container
            spacing={7}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '80%'
            }}
          >
            <Grid item xs={12} sm={2.2}>
              <Stack spacing={1}>
                <InputLabel>Issue By</InputLabel>
                <Select
                  name="name"
                  value={userData.UserID}
                  onChange={handleChange}
                  error={!!error.name}
                  helperText={error.name}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                  disabled={accessLevel < 3}
                >
                 {usersName.map((user, index) => (
 <MenuItem key={user.UserID} value={user.UserID}>
    {user.name}
  </MenuItem>
))}
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={2.2}>
              <Stack spacing={1}>
                <InputLabel id="demo-number-select-label">Ward</InputLabel>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-number-select-label"
                    name="AllocatedWard"
                    multiple
                    value={userData.AllocatedWard}
                    error={!!error.AllocatedWard}
                    helperText={error.AllocatedWard}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    onChange={handleChange}
                    input={<OutlinedInput placeholder="Enter Number" />}
                    renderValue={handleRenderValue}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    disabled={accessLevel < 3}
                  >
                    {/* Add "ALL" option to select all wards */}
                    <MenuItem key="all" value="ALL">
                      <Checkbox
                        checked={normalizedAllocatedWard.includes('ALL') || normalizedAllocatedWard.length === wardList.length}
                        onChange={handleSelectAll}
                      />
                      ALL
                    </MenuItem>
                    {wardList.map((ward, index) => (
                      <MenuItem key={index} value={String(ward.NewWardNo)}>
                        <Checkbox checked={normalizedAllocatedWard.includes(String(ward.NewWardNo))} />
                        {ward.NewWardNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
            <Table style={{ width: '650px', overflowX: 'auto' }}>
              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                <TableRow>
                  <TableCell>Delete</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>User Id</TableCell>
                  <TableCell>User Full Name </TableCell>
                  <TableCell>Allocation Ward</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {userInfo.length > 0 &&
                  userInfo.map((user, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <DeleteOutlined
                            onClick={() => handleDelete(user.UserID)}
                            color={selectedRow === user.UserID ? 'success' : 'primary'}
                            style={{
                              color: selectedRow === user.UserID ? 'Red' : 'Red',
                              marginLeft: '20px'
                            }}
                            disabled={!(user.AllocatedWard && user.AllocatedWard.length > 0)}
                          >
                            {/* {selectedRow === user.id ? <SendOutlined /> : <EditTwoTone />} */}
                          </DeleteOutlined>


                         
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color={selectedRow === user.UserID ? 'success' : 'primary'}
                            onClick={() => handleRowClick(user)}
                            disabled={!(user.AllocatedWard && user.AllocatedWard.length > 0)}
                          >
                            {selectedRow === user.UserID ? <SendOutlined /> : <EditTwoTone />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{user.UserID}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          {/* Check if AllocatedWard is an array or a string that needs parsing */}
                          {user.AllocatedWard && user.AllocatedWard.length > 0
                            ? Array.isArray(user.AllocatedWard)
                              ? user.AllocatedWard.join(', ')
                              : JSON.parse(user.AllocatedWard).join(', ')
                            : 'No wards allocated'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
              <Dialog open={openDeleteDialog} maxWidth="xs" fullWidth>
                        <DialogContent>
                          <Typography variant="body1">Are you sure you want to delete?</Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button  onClick={handleConfirmDelete} color="error" variant="contained">
                            Yes
                          </Button>
                          <Button onClick={handleCancelDelete} color="primary" variant="outlined">
                            No
                          </Button>
                        </DialogActions>
                      </Dialog>
            {/* Dialog for no allocated wards */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
              <DialogTitle id="alert-dialog-title" color="error" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Action Not Allowed
              </DialogTitle>

              <DialogContent>{dialogMessage}</DialogContent>

              <DialogActions>
                <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Grid container justifyContent="center" alignItems="center">
            <Stack spacing={1} direction="row">
              <Button variant="contained" color="success" size="large" onClick={handleSave} disabled={accessLevel < 3}>
                Save
              </Button>
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
              <Button variant="contained" color="secondary" size="large" onClick={handleCancel} disabled={accessLevel < 3}>
                Cancel
              </Button>
            </Stack>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

export default WardAllocation;
