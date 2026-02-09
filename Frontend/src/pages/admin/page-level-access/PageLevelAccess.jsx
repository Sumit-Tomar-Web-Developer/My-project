// material-ui
import { DeleteOutlined, EditOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';

import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Box,
  Table,
  TableHead,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Select,
  MenuItem,
  IconButton,
    Dialog,            
  DialogTitle,      
  DialogContent,      
  DialogActions,       
  Snackbar,
  Alert
} from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import {
  AddOrUpdateSecurityLayer,
  DeleteSecurityLayer,
  getSecurityLayer
} from 'services/AdminServices/pageLevelAccess/PageLevelAccessService.js';
// ==============================|| SAMPLE PAGE ||============================== //
function PageLevelAccess() {
 

  const [layerList, setLayerList] = useState([]);
  const [layerData, setLayerData] = useState({
    LayerID: 0,
    LayerName: '',
    Status: ''
  });

  useEffect(() => {
    const layerList = async () => {
      const layerList = await getSecurityLayer();
      console.log(layerList, 'layer data fetched');
      setLayerList(layerList.LayerData);
    };
    layerList();
  }, []);

  const [touched, setTouched] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarType, setSnackbarType] = useState("success"); // success | error


  const isDuplicateName = layerList.some(
    (layer) =>
      layer.LayerName.toLowerCase().trim() === layerData.LayerName.toLowerCase().trim() &&
      layer.LayerID !== layerData.LayerID
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field Name: ${name}, New Value: ${value}`);
    setLayerData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLayerDelete = async (LayerID) => {
    try {
      const response = await DeleteSecurityLayer(LayerID);
      console.log(response, 'Layer deleted');
      setLayerList(layerList.filter((layer) => layer.LayerID !== LayerID));
       setTouched(false);
   // Show success snackbar
      setSnackbarMessage("Layer deleted successfully");
      setSnackbarType("success");
      setSnackbarOpen(true);
    } catch (e) {
      console.error('Error deleting layer:', e);
         setTouched(false);
   // Show success snackbar
      setSnackbarMessage("Failed to delete layer.");
      setSnackbarType("success");
      setSnackbarOpen(true);
    }
  };
  const handleClear = () => {
    setLayerData({ LayerID: 0, LayerName: '', Status: '' });
    setTouched(false);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [deleteId, setDeleteId] = useState(null);

  // const handleSaveLayer = async () => {
  //   try {
  //     const data = {
  //       LayerID: layerData.LayerID ?? 0,
  //       LevelName: layerData.LayerName,
  //       Status: layerData.Status
  //     };

  //     console.log('Saving Layer:', data);

  //     const response = await AddOrUpdateSecurityLayer(data);

  //     console.log(response, 'data added');

  //     const updatedLayer = response.layerData;

  //     setLayerList(
  //       (prevList) =>
  //         data.LayerID === 0
  //           ? [...prevList, updatedLayer]
  //           : prevList.map((layer) => (layer.LayerID === updatedLayer.LayerID ? updatedLayer : layer)) // Update existing layer
  //     );

  //     // Clear form fields
  //     setLayerData({ LayerID: 0, LayerName: '', Status: '' });
  //   } catch (e) {
  //     console.error('Error saving layer:', e);
  //     alert('Failed to save layer.');
  //   }
  // };

  const handleSaveLayer = async () => {
    try {
      const layerPayload = {
        LayerID: layerData.LayerID ?? 0,
        LayerName: layerData.LayerName,
        Status: layerData.Status
      };

      console.log('Saving Layer:', layerPayload);

      const response = await AddOrUpdateSecurityLayer(layerPayload);

      console.log(response, 'data added');

      if (response?.layerData) {
        setLayerList(
          (prevList) =>
            layerPayload.LayerID === 0
              ? [...prevList, response.layerData]
              : prevList.map((layer) => (layer.LayerID === response.layerData.LayerID ? response.layerData : layer)) // Update existing entry
        );
        // clear
        handleClear();
         // RESET validation
  setTouched(false);
   // Show success snackbar
      setSnackbarMessage(response.message);
      setSnackbarType("success");
      setSnackbarOpen(true);
      }
    } catch (e) {
      console.error('Error saving layer:', e);
      setSnackbarMessage("Failed to save layer.");
    setSnackbarType("error");
    setSnackbarOpen(true);
    }
  };

  const handleRowClick = (layer) => {
    setLayerData(layer);
  };

  return (
    <MainCard title="Security Level Creation " style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>
      <Grid
        container
        spacing={2.2}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
      >
        <Grid item xs={12} sm={9}>
          <Box className="card">
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6} sm={3.3}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Level Name</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                     {/* <TextField
  name="LayerName"
  value={layerData.LayerName || ''}
  onChange={handleChange}
  error={!layerData.LayerName.trim() || isDuplicateName}   
  helperText={
    !layerData.LayerName.trim()
      ? "Level Name is required"
      : isDuplicateName
      ? "This Level Name already exists"
      : ""
  }
/> */}
<TextField
  name="LayerName"
  value={layerData.LayerName || ''}
  onChange={(e) => {
    setTouched(true);
    handleChange(e);
  }}
  onBlur={() => setTouched(true)}
  error={touched && (!layerData.LayerName.trim() || isDuplicateName)}
  helperText={
    touched
      ? !layerData.LayerName.trim()
        ? "Level Name is required"
        : isDuplicateName
        ? "This Level Name already exists"
        : ""
      : ""
  }
/>

                    </Stack>
                  </Grid>
                </Grid>

                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6} sm={3.3}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Status</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <Select name="Status" value={layerData.Status || ''} onChange={handleChange}>
                        <MenuItem value="Enable">Enable</MenuItem>
                        <MenuItem value="Disable">Disable</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>

                  <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={1} justifyContent="center">
                      <Stack spacing={2} direction={'row'} marginTop={2} marginLeft={12}>
                        <Button variant="contained" color="success" onClick={handleSaveLayer}  disabled={!layerData.LayerName.trim() || !layerData.Status.trim() || isDuplicateName}>
                          Save
                        </Button>

                        <Button variant="contained" color="secondary" onClick={handleClear} >
                          Clear
                        </Button>

                        {/* <Button variant="contained" color="error" onClick={handleLayerDelete}>
                          Delete
                        </Button> */}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={3} justifyContent="center" mt={3}>
                  <Grid item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card>
                      <CardContent>
                        <Box sx={{ mb: '1vw', overflowX: 'auto', height: '300px', textAlign: 'center', width: '400px' }}>
                          <Table>
                            <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                              <TableRow>
                                <TableCell>Edit</TableCell>
                                <TableCell>Delete</TableCell>
                                <TableCell>Level Name</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {(layerList ?? []).map((layer, index) => (
                                <TableRow key={index}>
                                  {/* Edit Button */}
                                  <TableCell>
                                    <IconButton
                                      color={layerData.LayerID === layer.LayerID ? 'success' : 'primary'}
                                      onClick={() => handleRowClick(layer)}
                                    >
                                      {layerData.LayerID === layer.LayerID ? <SendOutlined /> : <EditTwoTone />}
                                    </IconButton>
                                  </TableCell>

                                  {/* Delete Button */}
                                  <TableCell>
  <IconButton
    color={layerData.LayerID === layer.LayerID ? 'primary' : 'default'}
    onClick={() => {
      setDeleteId(layer.LayerID);   // store which ID to delete
      setOpenDeleteDialog(true);    // open the confirmation popup
    }}
  >
    <DeleteOutlined style={{ color: '#ff4d4f' }} />
  </IconButton>
</TableCell>

                                  {/* Layer Name */}
                                  <TableCell>{layer.LayerName}</TableCell>

                                  {/* Status */}
                                  <TableCell>{layer.Status}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

              
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
<Dialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete this Level?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
      No
    </Button>
    <Button
      onClick={() => {
        handleLayerDelete(deleteId);
        setOpenDeleteDialog(false);
      }}
      color="error"
      variant="contained"
    >
      Yes
    </Button>
  </DialogActions>
</Dialog>
<Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity={snackbarType}
    variant="filled"
    sx={{ width: "100%" }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>

      
    </MainCard>
  );
}
export default PageLevelAccess;
