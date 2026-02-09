// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Tab,
  Tabs,
  Button,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// project import
import MainCard from 'components/MainCard';
import { useState,useEffect } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { postWardSelection } from 'services/wardnumber.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchWardList } from 'services/data-entry.services';

// ==============================|| PropertyClassification PAGE ||============================== //

function PropertyClassification() {
  let selectedTab = 0;
  const [value, setValue] = useState(selectedTab);

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowTab2, setSelectedRowTab2] = useState(null); //

  // Hardcoded data
  const rows = [
    { id: 1, propertyType: 'खाजगी शाळा', exportType: 'बिगर निवासी' },
    { id: 2, propertyType: 'न.प.शाळा', exportType: 'नगरपरिषद मालमत्ता' },
    { id: 3, propertyType: 'शासकीय शाळा', exportType: ' शासकीय मालमत्ता' },
    { id: 4, propertyType: 'डिस्पेन्सरी', exportType: 'बिगर निवासी' },
    { id: 5, propertyType: 'खाजगी रुग्णालय', exportType: 'बिगर निवासी' },
    { id: 6, propertyType: 'शासकीय रुग्णालय', exportType: ' शासकीय मालमत्ता' },
    { id: 5, propertyType: 'प्राथमिक आरोग्य', exportType: 'शासकीय मालमत्ता' }
  ];

  const [selectedWard, setSelectedWard] = useState('1');
  const [wardList, setWardList] = useState([]);
  

useEffect(() => {
  const fetchWards = async () => {
    const wards = await fetchWardList();
      console.log(wards, 'fetched wards');
      const sortedWards = [...wards].sort(
        (a, b) => Number(a.NewWardNo) - Number(b.NewWardNo)
      );
        setWardList(sortedWards);
  } 
  fetchWards();
}, []);



     const [propertyNoList, setPropertyNoList] = useState([]);
     const [selectedPropertyNo, setSelectedPropertyNo] = useState('');

  const handleWardChange = async(event) => {
    const selectedward=event.target.value;
     try {
              const response = await fetchPropertyRangeByWard(selectedward);
              const propertyRange = response.properties; // <- use .properties array
              if (!Array.isArray(propertyRange)) throw new Error("Invalid property range");
          
              // Sort: main property first, then partitions
              const sortedProps = propertyRange.sort((a, b) => {
                const propA = parseInt(a.NewPropertyNo, 10);
                const propB = parseInt(b.NewPropertyNo, 10);
          
                if (propA !== propB) return propA - propB;
          
                const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
                const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;
                return partA - partB;
              });
          
              setPropertyNoList(sortedProps);
            } catch (error) {
              console.error('Error fetching property range:', error);
            }
  };



  // Function to handle row click
  const handleRowClick = (rowData) => {
    if (value === 0) {
      setSelectedRow(rowData);
    } else {
      setSelectedRowTab2(rowData);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function TabPanel({ children, value, index, ...other }) {
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number,
    index: PropTypes.number
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  return (
    <MainCard title="Property Classification">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Property Description" icon={<HomeOutlined />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Property Type of Use" icon={<HomeOutlined />} iconPosition="start" {...a11yProps(1)} />
        </Tabs>

        {/* //1st tab */}
        <TabPanel value={value} index={0}>
          <MainCard title="Property Description" style={{ color: '#1677ff' }}>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Grid item xs={12} sm={6}>
                <MainCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel>Property Type </InputLabel>
                        <TextField
                          required
                          value={selectedRow ? selectedRow.propertyType : ''}
                          onChange={(e) => setSelectedRow({ ...selectedRow, propertyType: e.target.value })}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel>Export Type </InputLabel>
                        <TextField
                          required
                          value={selectedRow ? selectedRow.exportType : ''}
                          onChange={(e) => setSelectedRow({ ...selectedRow, exportType: e.target.value })}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                {/* table  */}
                <Box display="flex" justifyContent="center">
                  <TableContainer component={Paper} style={{ width: '550px', maxHeight: '300px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Property Type</TableCell>
                          <TableCell>Export Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.id} onClick={() => handleRowClick(row)}>
                            <TableCell>{row.propertyType}</TableCell>
                            <TableCell>{row.exportType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </MainCard>
              <Grid container display="flex" justifyContent="center">
                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="success" onClick={handleClickDialog}>
                      Save
                    </Button>

                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                      <DialogContent>
                        <Stack>
                          <DialogContentText
                            id="alert-dialog-description"
                            sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'darkgreen' }}
                          >
                            Updating Record Successfully.
                          </DialogContentText>
                        </Stack>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" color="success" onClick={handleCloseDialog} autoFocus>
                          Ok
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </TabPanel>

        {/* 2nd tab */}

        <TabPanel value={value} index={1}>
          <MainCard title="Property Type Of Use" style={{ color: '#1677ff' }}>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Grid item xs={12} sm={6}>
                <MainCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel>Property Use </InputLabel>
                        <TextField
                          required
                          value={selectedRowTab2 ? selectedRowTab2.propertyType : ''}
                          onChange={(e) => setSelectedRowTab2({ ...selectedRowTab2, propertyType: e.target.value })}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel>Export Use </InputLabel>
                        <TextField
                          required
                          value={selectedRowTab2 ? selectedRowTab2.exportType : ''}
                          onChange={(e) => setSelectedRowTab2({ ...selectedRowTab2, exportType: e.target.value })}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                {/* table  */}
                <Box display="flex" justifyContent="center">
                  <TableContainer component={Paper} style={{ width: '550px', maxHeight: '300px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type Of Use</TableCell>
                          <TableCell>Export Use</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.id} onClick={() => handleRowClick(row)}>
                            <TableCell>{row.propertyType}</TableCell>
                            <TableCell>{row.exportType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </MainCard>
              <Grid container display="flex" justifyContent="center">
                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="success" onClick={handleClickDialog}>
                      Save
                    </Button>

                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                      <DialogContent>
                        <Stack>
                          <DialogContentText
                            id="alert-dialog-description"
                            sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'darkgreen' }}
                          >
                            Updated Record Successfully.
                          </DialogContentText>
                        </Stack>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" color="success" onClick={handleCloseDialog} autoFocus>
                          Ok
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </TabPanel>
      </Box>
    </MainCard>
  );
}

export default PropertyClassification;
