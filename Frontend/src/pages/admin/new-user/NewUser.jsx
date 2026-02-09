import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  TextareaAutosize,
  Table,
  TableBody,
  TableCell,
  Card,
  CardContent,
  Button,
  Typography,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  SnackbarContent,
  Snackbar,
  FormControl,
  FormHelperText
} from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { fetchUsers, createUser } from 'services/admin-users.services';
import { format, parseISO } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MainCard from 'components/MainCard';
import { DatePicker } from '@mui/x-date-pickers';
import { getSecurityLayer } from 'services/AdminServices/pageLevelAccess/PageLevelAccessService';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { setNewUserData } from 'state/reducers/newUser/newUserSlice';

function NewUser() {
  // const [startDate, setStartDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [layerList, setLayerList] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchUsers()
      .then((fetchedUsers) => {
        setUsers(fetchedUsers);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const [userData, setUserData] = useState({
    UserID: 0,
    role: '',
    name: '',
    email: '',
    username:'',
    contact_no: '',
    address: '',
    startDate: new Date(),
    active: '',
    userlevel: ''
  });

  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClearClick = () => {
    setUserData({
      UserID: 0,
      role: '',
      name: '',
      email: '',
      contact_no: '',
      address: '',
      startDate: null,
      active: '',
      userlevel: ''
    });

    setErrors({});
  };

  const handleNumberInput = (event) => {
    const { key, target } = event;
    const currentValue = target.value;

    if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Tab') {
      event.preventDefault();
      console.log('Only numbers are allowed');
    } else if (currentValue.length >= 10 && /^[0-9]$/.test(key)) {
      event.preventDefault();
      console.log('year must contain 10 digits');
    } else {
      console.log('error');
    }
  };

  // Define Yup validation schema
  const validationSchema = Yup.object().shape({
    role: Yup.string().required('Role is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    contact_no: Yup.string()
      .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits')
      .required('Contact number is required'),
    address: Yup.string().required('Address is required'),
    startDate: Yup.date().nullable().required('Start date is required'),
    active: Yup.string().required('Active status is required'),
    userlevel: Yup.string().required('User level is required')
  });

  useEffect(() => {
    const layerList = async () => {
      const layerList = await getSecurityLayer();
      console.log(layerList, 'layer data fetched');
      setLayerList(layerList.LayerData);
    };
    layerList();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // const handleCreateUser = async () => {
  //   try {
  //     const { startDate } = userData;

  //     // Log the date before processing
  //     console.log('Raw startDate from userData:', startDate);

  //     // Ensure startDate is valid before formatting
  //     const formattedDob = startDate && !isNaN(new Date(startDate)) ? format(new Date(startDate), 'yyyy-MM-dd') : '';

  //     console.log('Formatted DOB:', formattedDob);

  //     const Data = {
  //       ...userData,
  //       UserID: userData.UserID || 0,
  //       dob: formattedDob
  //     };

  //     console.log(Data, 'Processed user data');
  //     await validationSchema.validate(userData, { abortEarly: false });

  //     setErrors({});
  //     let response;
  //     if (userData.UserID === 0) {
  //       response = await createUser(Data); // API call for create & update
  //       console.log(response, 'API Response');

  //       if (response.status === 200 || response.status === 201) {
  //         setSnackbarOpen(true);
  //         setSnackbarSeverity('success');
  //         setReceivedMessage(response.data.message);
  //         setSnackbarMessage(receivedMessage);
  //         handleClearClick();
  //         console.log(response.data.adminUser, 'naya user');
  //         setUsers((prevList) => [...prevList, response.data.adminUser]);
  //       } else {
  //         setReceivedMessage(response.message || 'An error occurred while saving page information.');
  //         setSnackbarSeverity('error');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage('An error occurred while saving page information.' || receivedMessage);
  //       }
  //     } else {
  //       response = await createUser(Data);
  //       console.log(response, 'updated');
  //       if (response.status === 200 || response.status === 201) {
  //         setSnackbarOpen(true);
  //         setSnackbarSeverity('success');
  //         setReceivedMessage(response.data.message);
  //         setSnackbarMessage(receivedMessage);
  //         const updatedList = users.map((user) => (user.UserID === Data.UserID ? response.data.adminUser : user));
  //         setUsers(updatedList);
  //         handleClearClick();
  //       } else {
  //         setReceivedMessage(response.message || 'An error occurred while saving page information.');
  //         setSnackbarSeverity('error');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage('An error occurred while saving page information.');
  //       }
  //     }
  //   } catch (validationErrors) {
  //     if (validationErrors.inner && validationErrors.inner.length > 0) {
  //       const formattedErrors = validationErrors.inner.reduce((acc, err) => {
  //         return { ...acc, [err.path]: err.message };
  //       }, {});
  //       setErrors(formattedErrors);
  //     } else {
  //       console.error('Validation Error:', validationErrors);
  //     }
  //   }
  // };

  const handleCreateUser = async () => {
    try {
      const { startDate } = userData;

      console.log('Raw startDate from userData:', startDate);

      const formattedDob = startDate && !isNaN(new Date(startDate)) ? format(new Date(startDate), 'yyyy-MM-dd') : '';

      console.log('Formatted DOB:', formattedDob);

      const Data = {
        ...userData,
        UserID: userData.UserID || 0,
        dob: formattedDob
      };

      console.log(Data, 'Processed user data');
      await validationSchema.validate(userData, { abortEarly: false });

      setErrors({});
      let response;

      response = await createUser(Data); // API call for create & update
      console.log(response, 'API Response');

      if (response.status === 200 || response.status === 201) {
        const adminUser = response.data.adminUser;
        setSnackbarOpen(true);
        setSnackbarSeverity('success');
        setReceivedMessage(response.data.message);
        setSnackbarMessage(receivedMessage);
        handleClearClick();
        if (userData.UserID === 0) {
          // For newly created user
          setUsers((prevList) => [...prevList, adminUser]);

          // Dispatch UserID and LayerID to state or context
          //dispatch({ type: 'SET_USER_LAYER', payload: { UserID: adminUser.UserID, LayerID } });
        } else {
          // For updated user
          const updatedList = users.map((user) => (user.UserID === adminUser.UserID ? adminUser : user));
          setUsers(updatedList);

          // Dispatch updated UserID and LayerID
          //dispatch({ type: 'SET_USER_LAYER', payload: { UserID: adminUser.UserID, LayerID } });
        }
      } else {
        setReceivedMessage(response.message || 'An error occurred while saving user data.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setSnackbarMessage(receivedMessage);
      }
    } catch (validationErrors) {
      if (validationErrors.inner && validationErrors.inner.length > 0) {
        const formattedErrors = validationErrors.inner.reduce((acc, err) => {
          return { ...acc, [err.path]: err.message };
        }, {});
        setErrors(formattedErrors);
      } else {
        console.error('Validation Error:', validationErrors);
      }
    }
  };

  useEffect(() => {
    console.log('Updated Users List:', users);
  }, [users]);
  const handleRowClick = (user) => {
    console.log(user, 'rowClick new user');

    setErrors({});

    const formattedDate = user.dob ? new Date(user.dob) : null;
    const selectedLayer = layerList.find((layer) => layer.LayerName === user.userlevel);

    const updatedUserData = {
      ...user,
      startDate: formattedDate,
      userlevel: selectedLayer ? selectedLayer.LayerName : ''
    };

    setUserData(updatedUserData);

    // Dispatch the updated data to Redux
    //dispatch(setNewUserData(updatedUserData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors({});
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // dispatch(
    //   setNewUserData({
    //     [name]: value
    //   })
    // );
  };

  const handleDateChange = (field, newValue) => {
    if (newValue) {
      setUserData((prevData) => ({
        ...prevData,
        [field]: newValue
      }));
    }
    // // Dispatch updated value to Redux store
    // dispatch(
    //   setNewUserData({
    //     [field]: newValue
    //   })
    // );

    setErrors({});
  };
  return (
    <>
      <MainCard title="Create New User" style={{ color: 'blue', fontWeight: 'bold' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
          Add User{' '}
        </Typography>
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={10} lg={6}>
            <Box>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Role </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <FormControl error={!!errors.role} fullWidth>
                      <Select name="role" value={userData.role} onChange={handleChange}>
                        <MenuItem value="Super Admin">Super Admin</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Office Employee">Office Employee</MenuItem>
                        <MenuItem value="Site Employee">Site Employee</MenuItem>
                        <MenuItem value="Council Employee">Council Employee</MenuItem>
                        <MenuItem value="AMC">AMC</MenuItem>
                        <MenuItem value="AMC Office Employee">AMC Office Employee</MenuItem>

                      
                      </Select>{' '}
                      {/*{errors.role && <FormHelperText error>{errors.role}</FormHelperText>}*/}
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Name</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField
                      
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                    />
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Email</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField
                      
                      type="text"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                    />
                  </Stack>
                </Grid>
              </Grid>

    <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>User name</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField
                      
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      error={!!errors.username}
                      helperText={errors.username}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                    />
                  </Stack>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Active </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <FormControl error={!!errors.active} fullWidth>
                      <Select labelId="select-criteria" name="active" value={userData.active} onChange={handleChange}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="De-Active">De-Active</MenuItem>
                      </Select>{' '}
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={10} lg={6}>
            <Box>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Date Of Birth</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={userData.startDate}
                        onChange={(newValue) => handleDateChange('startDate', newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            FormHelperTextProps={{ style: { color: 'red' } }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Address </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <FormControl fullWidth error={Boolean(errors.address)}>
                      <TextareaAutosize
                        value={userData.address}
                        onChange={(e) =>
                          setUserData((prevData) => ({
                            ...prevData,
                            address: e.target.value
                          }))
                        }
                        minRows={2}
                        maxRows={6}
                        required
                        style={{
                          width: '100%',
                          border: `1px solid ${errors.address ? 'red' : '#ccc'}`,
                          borderRadius: '4px',
                          padding: '8px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      {errors.address && <FormHelperText>{errors.address}</FormHelperText>}
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Contact No </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField
                      name="contact_no"
                  
                      type="text"
                      value={userData.contact_no}
                      onChange={handleChange}
                      error={!!errors.contact_no}
                      helperText={errors.contact_no}
                      FormHelperTextProps={{ style: { color: 'red' } }}
                      onKeyDown={handleNumberInput}
                    />
                  </Stack>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={2.7}>
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Level Name </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <FormControl error={!!errors.userlevel} fullWidth>
                      <Select name="userlevel" value={userData.userlevel} onChange={handleChange}>
                        {layerList.map((layer) => (
                          <MenuItem key={layer.LayerID} value={layer.LayerName}>
                            {layer.LayerName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid item xs={10} sm={2} mt={1}>
            <Stack spacing={0}>
              <Button variant="contained" color="success" onClick={handleCreateUser}>
                Save
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={10} sm={2} mt={1}>
            <Stack spacing={0}>
              <Button variant="contained" color="secondary" onClick={handleClearClick}>
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
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
        <Box mb={1}></Box>
        <MainCard>
          <Grid
            container
            spacing={2.2}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            <Grid item xs={12} sm={12}>
              <Box className="card">
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
                      User List
                    </Typography>

                    <Box sx={{ overflowX: 'auto', height: '300px' }}>
                      <Table>
                        <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                          <TableRow>
                            <TableCell>Edit</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                             <TableCell>Username</TableCell>
                            <TableCell>active</TableCell>
                            <TableCell>Date Of Birth</TableCell>
                            <TableCell>address</TableCell>
                            <TableCell>contact No</TableCell>
                            <TableCell>User Level</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.UserID}>
                              {/* Assuming user.UserID is unique */}
                              <TableCell>
                                <IconButton
                                  color={userData.UserID === user.UserID ? 'success' : 'primary'}
                                  onClick={() => handleRowClick(user)}
                                >
                                  {userData.UserID === user.UserID ? <SendOutlined /> : <EditTwoTone />}
                                </IconButton>
                              </TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                               <TableCell>{user.username}</TableCell>
                              <TableCell>{user.active}</TableCell>
                              <TableCell>{user.dob}</TableCell>
                              <TableCell>{user.address}</TableCell>
                              <TableCell>{user.contact_no}</TableCell>
                              <TableCell>{user.userlevel}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </MainCard>
      </MainCard>
    </>
  );
}

export default NewUser;
