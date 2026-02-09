import { Grid, InputLabel, Stack, Typography, TextField, Button, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import EditTwoTone from '@ant-design/icons/EditTwoTone';
import SendOutlined from '@ant-design/icons/SendOutlined';
import IconButton from 'components/@extended/IconButton';
import { fetchJointOwnerList, fetchPropertyDescription, fetchPropertyMast } from 'services/data-entry.services';
import translateText from 'utils/translator';

export default function FormDataEntry() {
  const [age, setAge] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  // const [isPrime, setIsPrime] = useState(false);
  const [Selected, setSelected] = useState(false);
  const [propertyDesc, setPropertDesc] = useState([]);
  const [propertyMast, setPropertyMast] = useState([]);
  const [jointOwnerList, setJointOwnerList] = useState([]);
  const [propertyDescription, setPropertyDescription] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const [zoneNo, setZoneNo] = useState('');
  const [wardNo, setWardNo] = useState('');
  const [propertyNo, setPropertyNo] = useState('');
  const [partitionNo, setPartitionNo] = useState('');
  const [csn, setCsn] = useState('');
  const [plotNo, setPlotNo] = useState('');
  const [plotArsqFt, setPlotArsqFt] = useState('');
  const [plotArsqMFt, setPlotArsqMFt] = useState('');
  const [carpetArtsqFt, setCarpetArtsqFt] = useState('');
  const [buildUpArea, setBuildUpArea] = useState('');
  const [rentedArSqFt, setRentedArSqFt] = useState('');
  const [totalRent, setTotalRent] = useState('');
  const [ownerID, setOwnerID] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [shopBuildName, setShopBuildName] = useState('');
  const [shopFlatNo, setShopFlatNo] = useState('');
  const [title, setTitle] = useState(0);

  const [tempData, setTempData] = useState({
    title: '',
    fullName: '',
    address: '',
    shopBuildName: '',
    shopFlatNo: ''
  });

  const handleAddButtonClick = () => {
    // Add temporary data to the list
    setJointOwnerList((prevList) => [...prevList, { ...tempData }]);
    // Clear temporary data
    setTempData({
      title: '',
      fullName: '',
      address: '',
      shopBuildName: '',
      shopFlatNo: ''
    });
    // English to Marathi fields states
    const [engFullName, setengFullName] = useState('');
    const [marFullName, setmarFullName] = useState('');
    const [engAdress, setengAdress] = useState('');
    const [marAdress, setmarAdress] = useState('');
    const [engShopName, setengShopName] = useState('');
    const [marShopName, setmarShopName] = useState('');
    const [engFlatNo, setengFlatNo] = useState('');
    const [marFlatNo, setmarFlatNo] = useState('');
    const [error, setError] = useState('');

    //get property description
    useEffect(() => {
      fetchPropertyDescription()
        .then((fetchproperty) => {
          setPropertDesc(fetchproperty);
        })
        .catch((error) => {
          console.error('Error fetching property description:', error);
        });
    }, []);

    // get property mast
    useEffect(() => {
      fetchPropertyMast()
        .then((propertymast) => {
          setPropertyMast(propertymast);
        })
        .catch((error) => {
          console.error('Error fetching property mast:', error);
        });
    }, []);

    // get joint owner list
    useEffect(() => {
      fetchJointOwnerList()
        .then((ownerlist) => {
          setJointOwnerList(ownerlist);
        })
        .catch((error) => {
          console.error('Error fetching owner list:', error);
        });
    }, []);

    // Function to handle row click

    const handleRowClick = (item) => {
      setSelectedItem(item);
      setTitle(item.OwnerTitle);

      setAddress(item.Address);
      setShopBuildName(item.BuildingOrShopName);
      setShopFlatNo(item.BuildingOrShopNumber);
    };

    const handleChange1 = (event) => {
      setOpenPlot(event.target.value);
    };

    const handleChange3 = (event) => {
      setPropertyDescription(event.target.value);
    };

    const handleClickDialog = () => {
      setOpenDialog(true);
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

    const handleNameChange = (event) => {
      const { value } = event.target;
      setengFullName(value);
      translateText(value)
        .then((translated) => setmarFullName(translated))
        .catch((err) => {
          setError(err.message);
          console.error('Error:', err);
        });
    };

    const handleAdressChange = (event) => {
      const { value } = event.target;
      setengAdress(value);
      translateText(value)
        .then((translated) => setmarAdress(translated))
        .catch((err) => {
          setError(err.message);
          console.error('Error:', err);
        });
    };

    const handleShopNameChange = (event) => {
      const { value } = event.target;
      setengShopName(value);
      translateText(value)
        .then((translated) => setmarShopName(translated))
        .catch((err) => {
          setError(err.message);
          console.error('Error:', err);
        });
    };

    const handleFlatNoChange = (event) => {
      const { value } = event.target;
      setengFlatNo(value);
      translateText(value)
        .then((translated) => setmarFlatNo(translated))
        .catch((err) => {
          setError(err.message);
          console.error('Error:', err);
        });
    };
    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={1.2}>
            <Stack spacing={1}>
              <InputLabel>Zone No:</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" placeholder="Zone No:" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.4}>
            <Stack spacing={1}>
              <InputLabel>Ward No:</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" placeholder="Ward No:" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Property No</InputLabel>
              <TextField required placeholder="Property No" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Partition No</InputLabel>
              <TextField required placeholder="Partition No" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel id="open-plot-label">Open Plot:</InputLabel>
              <Select labelId="open-plot-label" id="open-plot-select" value={openPlot} onChange={handleChange1} style={{ height: '35px' }}>
                <MenuItem value="0">No</MenuItem>
                <MenuItem value="1">Yes</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.4}>
            <Stack spacing={1}>
              <InputLabel>CSN:</InputLabel>
              <TextField required placeholder="CSN:" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.4}>
            <Stack spacing={1}>
              <InputLabel>Plot No:</InputLabel>
              <TextField required placeholder="Plot No:" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel id="property-description-label">Property Description:</InputLabel>
              <Select onChange={handleChange3} style={{ height: '35px' }} value={propertyDescription}>
                {propertyDesc.map((user) => (
                  <MenuItem key={user.PropertyTypeID} value={user.PropertyTypeID}>
                    {user.PropertyDescription}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.2}>
            <Stack spacing={1}>
              <InputLabel>Plot Ar SqFt</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" placeholder="Plot Ar SqFt" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.4}>
            <Stack spacing={1}>
              <InputLabel>Plot Ar SqMtr</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" placeholder="Plot Ar SqMtr" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={1.4}>
            <Stack spacing={1}>
              <InputLabel>CarpetArSqMtr</InputLabel>
              <TextField required placeholder="CarpetArSqMtr" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.4}>
            <Stack spacing={1}>
              <InputLabel>BuildUp Area</InputLabel>
              <TextField required placeholder="BuildUp Area" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>RentedArSqFt</InputLabel>
              <TextField required placeholder="RentedArSqFt" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Total Rent</InputLabel>
              <TextField required placeholder="Total Rent" fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Owner ID</InputLabel>
              <TextField required placeholder="Owner ID" fullWidth autoComplete="family-name" type="number" />
            </Stack>
          </Grid>
          <Grid item xs={40} sm={2}>
            <Stack spacing={10}>
              <Button style={{ marginTop: 30 }} variant="contained" onClick={handleClickDialog}>
                In Mtr
              </Button>
              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                <DialogTitle id="alert-dialog-title">In SqMt</DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel> BuiltUpArSqFt</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={2515.2}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel> CarpetArSqFt</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={2515.2}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel> RentedArSqFt</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={1716}></TextField>
                      </Stack>
                    </Grid>
                  </Grid>
                </DialogContent>
              </Dialog>
            </Stack>
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom sx={{ mt: 2, mb: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
          Owner Details :
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={1}>
            <Stack spacing={1}>
              <InputLabel>Title</InputLabel>
              <Select
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Mr.' }}
                sx={{ bgcolor: '#F5F5F5' }}
              >
                <MenuItem value={0}>Mr.</MenuItem>
                <MenuItem value={1}>Mrs.</MenuItem>
                <MenuItem value={2}>others</MenuItem>
                <MenuItem value={3}>Miss</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3.4}>
            <Stack spacing={1}>
              <InputLabel>Full Name</InputLabel>
              <TextField
                required
                id="FullNameBasic"
                value={engFullName}
                onChange={handleNameChange}
                name="FullName"
                placeholder="Full Name"
                fullWidth
                autoComplete="given-name"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3.5}>
            <Stack spacing={1}>
              <InputLabel>Address</InputLabel>
              <TextField
                required
                placeholder="Address"
                value={engAdress}
                onChange={handleAdressChange}
                fullWidth
                autoComplete="family-name"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>Shop/build. Name</InputLabel>
              <TextField
                required
                placeholder="Shop/build. Name"
                value={engShopName}
                onChange={handleShopNameChange}
                fullWidth
                autoComplete="family-name"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>Shop/Flat No.</InputLabel>
              <TextField
                required
                placeholder="Shop/Flat No."
                value={engFlatNo}
                onChange={handleFlatNoChange}
                fullWidth
                autoComplete="family-name"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Stack spacing={1}>
              <InputLabel>*शिर्षक</InputLabel>
              <Select
                value={शिर्षक}
                onChange={(event) => {
                  setशिर्षक(event.target.value);
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'श्री.' }}
                sx={{ bgcolor: '#F5F5F5' }}
              >
                <MenuItem value={0}>श्री</MenuItem>
                <MenuItem value={1}>श्रीमती.</MenuItem>
                <MenuItem value={2}>सौ</MenuItem>
                <MenuItem value={3}>इतर</MenuItem>
              </Select>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={3.4}>
            <Stack spacing={1}>
              <InputLabel>पूर्ण नाव</InputLabel>
              <TextField
                required
                id="FullNameBasic"
                value={marFullName}
                name="FullName"
                placeholder="पूर्ण नाव"
                fullWidth
                autoComplete="given-name"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3.5}>
            <Stack spacing={1}>
              <InputLabel>पत्ता</InputLabel>
              <TextField required placeholder="पत्ता" value={marAdress} fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>दुकान/इमारतचे नाव </InputLabel>
              <TextField required placeholder="दुकान/इमारतचे नाव " value={marShopName} fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>दुकान/Flat नं</InputLabel>
              <TextField required placeholder="दुकान/Flat नं" value={marFlatNo} fullWidth autoComplete="family-name" />
            </Stack>
          </Grid>
          <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
            <Grid item>
              <Button variant="contained">Copy</Button>
            </Grid>
            <Grid item>
              <Button variant="contained">Paste</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success">
                Add
              </Button>
            </Grid>
          </Grid>

          <TableContainer style={{ marginTop: 20, marginLeft: 20, height: '32vh' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="font-weight-bold">Edit</TableCell>
                  <TableCell className="font-weight-bold">Delete</TableCell>
                  <TableCell className="font-weight-bold">isPrime</TableCell>
                  <TableCell className="font-weight-bold">शिर्षक</TableCell>
                  <TableCell className="font-weight-bold">पूर्ण नाव</TableCell>
                  <TableCell className="font-weight-bold">पत्ता</TableCell>
                  <TableCell className="font-weight-bold">दुकान/इमारतचे नाव</TableCell>
                  <TableCell className="font-weight-bold">दुकान/Flat नं</TableCell>
                  <TableCell className="font-weight-bold">Title</TableCell>
                  <TableCell className="font-weight-bold">Full Name</TableCell>
                  <TableCell className="font-weight-bold">Address</TableCell>
                  <TableCell className="font-weight-bold">Shop/Building Name</TableCell>
                  <TableCell className="font-weight-bold">Shop/Flat No.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jointOwnerList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <IconButton color={Selected ? 'success' : 'primary'} onClick={() => handleRowClick(item)}>
                        {Selected ? <SendOutlined /> : <EditTwoTone />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" name="cancel">
                        <CloseOutlined />
                      </IconButton>
                    </TableCell>

                    <TableCell style={{ textAlign: 'center' }}>
                      <FormControlLabel control={<Checkbox />} />
                      {item.isPrime}
                    </TableCell>
                    <TableCell>{item.OwnerTitleMarathi}</TableCell>
                    <TableCell>{item.OwnerNameMarathi}</TableCell>
                    <TableCell>{item.OwnerPatta}</TableCell>
                    <TableCell>{item.BuildingOrShopNameMarathi}</TableCell>
                    <TableCell>{item.BuildingOrShopNumberMarathi}</TableCell>
                    <TableCell>{item.OwnerTitle}</TableCell>
                    <TableCell>{item.OwnerName}</TableCell>
                    <TableCell>{item.Address}</TableCell>
                    <TableCell>{item.BuildingOrShopName}</TableCell>
                    <TableCell>{item.BuildingOrShopNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </>
    );
  };
}
