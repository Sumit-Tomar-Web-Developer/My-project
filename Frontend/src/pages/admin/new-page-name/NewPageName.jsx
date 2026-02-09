// material-ui
import {
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Table,
  TableHead,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  SnackbarContent,
  Snackbar,
  IconButton
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { deletePageInfo, fetchPageNames, savePageNames } from 'services/AdminServices/pageNameMaster/PageNameMasterService';
import * as Yup from 'yup';
import Pagination from '@mui/material/Pagination';
import { CheckCircleOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setPageNameList } from 'state/reducers/newUser/newUserSlice';
// ==============================|| SAMPLE PAGE ||============================== //

function NewPageName() {
  const [newPageData, setNewPageData] = useState({
    PageID: 0,
    PageName: '',
    PageAlias: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pageList, setPageList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    PageName: Yup.string().required('Page Name is required'),
    PageAlias: Yup.string().required('Page Name Alias is required')
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const getPageNames = async () => {
      try {
        const response = await fetchPageNames();
        console.log('Page Names', response.data);
        setPageList(response.data);
        dispatch(setPageNameList(response.data));
      } catch (err) {
        console.error('Error fetching page names', err);
      }
    };
    getPageNames();
  }, []);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setNewPageData((prevData) => ({ ...prevData, [name]: value }));
  };
  // const handleSave = async () => {
  //   try {
  //     const pageData = {
  //       ...newPageData,
  //       PageName: newPageData.PageName,
  //       PageAlias: newPageData.PageAlias,
  //       PageID: newPageData.PageID || 0
  //     };

  //     await validationSchema.validate(pageData, { abortEarly: false });
  //     let response;
  //     // Check for duplicate alias before API call
  //     const isDuplicate = pageList.some((page) => page.PageAlias === pageData.PageAlias && page.PageID !== pageData.PageID);
  //     if (isDuplicate) {
  //       setSnackbarSeverity('error');
  //       setSnackbarOpen(true);
  //       setReceivedMessage('Page Alias already exists. Please use a different alias.');
  //       setSnackbarMessage(receivedMessage);
  //       return;
  //     }
  //     if (pageData.PageID === 0) {
  //       const response = await savePageNames(pageData);
  //       console.log(response, 'success');
  //       if (response.status === 200 || response.status === 201) {
  //         setReceivedMessage(response.message);
  //         setSnackbarSeverity('success');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage(receivedMessage);
  //         setPageList((prevList) => [...prevList, response.res.data.NewPageInfo]);
  //         handleCancelClick();
  //       } else {
  //         setReceivedMessage(response.message || 'An error occured while saving page information.');
  //         setSnackbarSeverity('error');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage('An error occured while saving page information.');
  //       }
  //     } else {
  //       response = await savePageNames(pageData);
  //       console.log(response, 'updated');
  //       if (response.status === 200 || response.status === 201) {
  //         setReceivedMessage(response.message);
  //         setSnackbarSeverity('success');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage(receivedMessage);
  //         const updatedPageList = pageList.map((page) => (page.PageID === pageData.PageID ? response.res.data.NewPageInfo : page));
  //         setPageList(updatedPageList);
  //         handleCancelClick();
  //       } else {
  //         setReceivedMessage(response.message || 'An error occured while saving page information.');
  //         setSnackbarSeverity('error');
  //         setSnackbarOpen(true);
  //         setSnackbarMessage('An error occured while saving page information.');
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
  const handleSave = async () => {
    try {
      const pageData = {
        ...newPageData,
        PageName: newPageData.PageName,
        PageAlias: newPageData.PageAlias,
        PageID: newPageData.PageID || 0
      };

      await validationSchema.validate(pageData, { abortEarly: false });

      // Check for duplicate PageName or PageAlias before API call
      const isDuplicate = pageList.some(
        (page) => (page.PageAlias === pageData.PageAlias || page.PageName === pageData.PageName) && page.PageID !== pageData.PageID
      );

      if (isDuplicate) {
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setReceivedMessage('Page Name or Page Alias already exists. Please use a different value.');
        setSnackbarMessage(receivedMessage);
        return;
      }

      let response;
      if (pageData.PageID === 0) {
        response = await savePageNames(pageData);
        console.log(response, 'success');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setSnackbarMessage(receivedMessage);
          setPageList((prevList) => [...prevList, response.res.data.NewPageInfo]);
          handleCancelClick();
        } else {
          setReceivedMessage(response.message || 'An error occurred while saving page information.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setSnackbarMessage('An error occurred while saving page information.');
        }
      } else {
        response = await savePageNames(pageData);
        console.log(response, 'updated');
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setSnackbarMessage(receivedMessage);
          const updatedPageList = pageList.map((page) => (page.PageID === pageData.PageID ? response.res.data.NewPageInfo : page));
          setPageList(updatedPageList);
          handleCancelClick();
        } else {
          setReceivedMessage(response.message || 'An error occurred while saving page information.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          setSnackbarMessage('An error occurred while saving page information.');
        }
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

  const handleCheckboxChange = (event, tax) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, tax]);
    } else {
      setSelectedRows((prevSelected) => prevSelected.filter((row) => row.PageID !== tax.PageID));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(currentItems);
    } else {
      setSelectedRows([]);
    }
  };
  const handleDeletePage = async () => {
    try {
      const IDsToDelete = selectedRows.map((row) => row.PageID);
      if (IDsToDelete.length > 0) {
        const response = await deletePageInfo(IDsToDelete);
        setSnackbarOpen(true);
        setSnackbarSeverity('success');
        setReceivedMessage(response.data.message);
        setSnackbarMessage(receivedMessage);
        setPageList((prevDataList) => prevDataList.filter((data) => !IDsToDelete.includes(data.PageID)));
        setSelectedRows([]);
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage(error.message);
      setSnackbarMessage(receivedMessage);
    }
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [indeterminate, setIndeterminate] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  const handleCancelClick = () => {
    setNewPageData({
      PageName: '',
      PageAlias: '',
      pageGroup: ''
    });
    setErrors({});
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pageList.slice(indexOfFirstItem, indexOfLastItem);

  // activeTaxes checkbox
  useEffect(() => {
    const totalSelected = selectedRows.length;
    const totalCheckboxes = currentItems.length;
    setAllChecked(totalSelected === totalCheckboxes && totalSelected > 0);
    setIndeterminate(totalSelected > 0 && totalSelected < totalCheckboxes);
  }, [selectedRows, currentItems]);
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleRowClick = (data) => {
    setSelectedRow(data);
    setNewPageData(data);
    setIsOpen(true);
  };

  return (
    <MainCard title="Create New Page" style={{ color: 'blue', fontWeight: 'bold' }}>
      <Typography variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
        Add Page{' '}
      </Typography>
      <MainCard>
        <Grid
          container
          spacing={3}
          gap={0}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid item xs={6} sm={3} mb={2}>
            <Stack spacing={1}>
              <InputLabel>Page Name</InputLabel>
              <TextField
                required
                id="FullNameBasic"
                name="PageName"
                placeholder="Enter Page Name"
                fullWidth
                autoComplete="given-name"
                onChange={handleOnChange}
                value={newPageData.PageName}
                error={!!errors.PageName}
                helperText={errors.PageName}
                FormHelperTextProps={{ style: { color: 'red' } }}
              />
            </Stack>
          </Grid>

          <Grid item xs={6} sm={3} mb={2}>
            <Stack spacing={1}>
              <InputLabel>Alias Name</InputLabel>
              <TextField
                required
                id="FullNameBasic"
                name="PageAlias"
                placeholder=" Enter Alias Name"
                fullWidth
                autoComplete="given-name"
                value={newPageData.PageAlias}
                onChange={handleOnChange}
                error={!!errors.PageAlias}
                helperText={errors.PageAlias}
                FormHelperTextProps={{ style: { color: 'red' } }}
              />
            </Stack>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
          gap={0}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          {/* <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Page Group</InputLabel>
              <Select labelId="page-group" id="page-group" name="pageGroup" value={newPageData.pageGroup} onChange={handleOnChange}>
                {pageGroups.map((group, index) => (
                  <MenuItem key={index} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>{' '}
            </Stack>
          </Grid> */}
        </Grid>
        {/* {/button */}
        <Grid
          container
          spacing={3}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid item xs={12} sm={1} mt={3}>
            <Stack spacing={1}>
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>{' '}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} mt={3}>
            <Stack spacing={1}>
              <Button variant="contained" color="secondary" onClick={handleCancelClick}>
                Cancel
              </Button>{' '}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} mt={3}>
            <Stack spacing={1}></Stack>
            <Button variant="contained" color="error" onClick={handleDeletePage}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </MainCard>
      {/*  */}

      {/*  */}
      <Box mb={1} mt={2}>
        <hr />
      </Box>
      {/* table */}
      <MainCard>
        <Typography variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
          Page List{' '}
        </Typography>

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
          {/* table */}
          <Grid item xs={12} sm={12}>
            <div className="card" style={{ marginTop: '6px' }}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '40vh'
                    }}
                  >
                    <Box sx={{ overflowX: 'auto', height: '350px', width: '700px' }}>
                      <Table>
                        <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                          <TableRow>
                            <TableCell>
                              <Checkbox checked={allChecked} indeterminate={indeterminate} onChange={handleSelectAll} />
                            </TableCell>
                            <TableCell>Edit</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Page Name</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Alias Name</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {currentItems.map((item) => (
                            <TableRow key={item.PageID}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedRows.some((row) => row.PageID === item.PageID)}
                                  onChange={(event) => handleCheckboxChange(event, item)}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleRowClick(item)}>
                                  <EditTwoTone />
                                </IconButton>
                              </TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.PageName}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.PageAlias}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Box>
                </CardContent>
                <Pagination
                  count={Math.ceil(pageList.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handleChangePage}
                  variant="outlined"
                  color="primary"
                  sx={{ ml: '33vw', mb: '0.5vw' }}
                />
              </Card>
            </div>
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
        {/* table */}
      </MainCard>
    </MainCard>
  );
}

export default NewPageName;
