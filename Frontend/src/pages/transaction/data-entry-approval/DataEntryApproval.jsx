// material-ui
import Pagination from '@mui/material/Pagination';
import PrinterOutlined from '@ant-design/icons/PrinterOutlined';
import SelectOutlined from '@ant-design/icons/SelectOutlined';

import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  IconButton,
  OutlinedInput
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project import
import { CSVExport } from 'components/third-party/react-table';

import MainCard from 'components/MainCard';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { color } from '@mui/system';
import ApprovalDataEntry from './approval-data-entry';
import PendingDataEntry from './pending-data-entry';
import { SearchDataEntryRequest, fetchDataEntryAppPendingRequests } from 'services/transaction/dataentryApprovalService/dataEntryApprovalService';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getUserInfoById } from 'services/utlilityService/wardAllocations/wardAllocationService';
import { getZoneMasterList } from 'services/masterServices/zone-master-services.js/zone-master-services';
// ==============================|| SAMPLE PAGE ||============================== //

function DataEntryApproval() {
  const [allo, setAllo] = useState('0');

  const handleAlloc = (event) => {
    setAllo(event.target.value);
  };


  const headers = [
    { label: 'Select', key: 'newSelect' },
    { label: 'Action', key: 'newAction' },
    { label: 'Property No', key: 'newPropertyNo' },
    { label: 'Tax Payer Name', key: 'newTaxPayerName' },
    { label: 'Wadhghat No', key: 'newWadhghatNo' },
    { label: 'Application Page Source', key: 'newApplicationPageSource' },
    { label: 'Updated By', key: 'newUpdatedBy' },
    { label: 'Updated Date', key: 'newUpdatedDate' },
    { label: 'Approval By', key: 'newApprovalBy' },
    { label: 'Approval Date', key: 'newApprovalDate' },
    { label: 'Approval Status', key: 'newApprovalStatus' },
    { label: 'Approval Remark', key: 'newApprovalRemark' }
  ];

  // Sample data
  const data = [
    { newSelect: '', newPropertyNo: 'System Architect', newObliqueNo: 'Edinburgh' },
    { newWardNo: 'Garrett Winters', newPropertyNo: 'Accountant', newObliqueNo: 'Tokyo' },
    { newWardNo: 'Ashton Cox', newPropertyNo: 'Junior Technical Author', newObliqueNo: 'San Francisco' },
    { newWardNo: 'Cedric Kelly', newPropertyNo: 'Senior Javascript Developer', newObliqueNo: 'Edinburgh' },
    { newWardNo: 'Cedric Kelly', newPropertyNo: 'Senior Javascript Developer', newObliqueNo: 'Edinburgh' }
  ];
  //approval
  const [isOpen, setIsOpen] = useState(false);

  function toggle(e) {
    setIsOpen((isOpen) => !isOpen);
    e.preventDefault();
    setIsOpenPending(false);
  }
  //all
  const [isOpenAll, setIsOpenAll] = useState(false);

  function toggleAll(e) {
    setIsOpenAll((isOpenAll) => !isOpenAll);
    e.preventDefault();
    setIsOpenPending(true);
    setIsOpen(true);
  }
  //Pending
  const [isOpenPending, setIsOpenPending] = useState(true);

  function togglePending(e) {
    setIsOpenPending((isOpenPending) => !isOpenPending);
    e.preventDefault();
    setIsOpen(false);
  }
  //ward
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const handleNumberChange = (event) => {
    setSelectedNumbers(event.target.value);
  };
  const numbers = ['zone1', 'zone2', 'zone3', 'zone4', 'zone5', 'zone6', 'zone7', 'zone8'];
  const [status, setStatus] = useState(0);

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };

  //Datepicker state
  const [valueTo, setValueTo] = useState(null);
  //Datepicker state2
  const [valueFrom, setValueFrom] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState(null);

  //Navigation
  const [approvalDataEntry, setApprovalDataEntry] = useState(true);
  const [pending, setPending] = useState(true);
  const [showDataEntry, setShowDataEntry] = useState(true);
  const[versionID,setVersionID]=useState('');
  const [selectedUpdVersionID, setSelectedUpdVersionID] = useState(null);

  const handleButtonClick = (row) => {
    setSelectedOwnerID(row.OwnerID);
    setSelectedUpdVersionID(row.UpdVersionID); 
    setVersionID(row.UpdVersionID);
    console.log(row.OwnerID,"ooo");
    console.log(row.UpdVersionID,"vvv");
    setShowDataEntry(!showDataEntry);
    // setApprovalDataEntry(!approvalDataEntry);
    setPending(false);
  };
  const handleButtonClickPending = () => {
    setShowDataEntry(!showDataEntry);
    setPending(!pending);
  };
  //start connection
  const [initialRecords, setInitialRecords] = useState([]); 
const [isSearchMode, setIsSearchMode] = useState(false);

const [records, setRecords] = useState([]);
const [pendingCount, setPendingCount] = useState(0);
const [approvedCount, setApprovedCount] = useState(0);
const [disApprovedCount, setDisApprovedCount] = useState(0);
const [allocatedWard,setAllocatedWard]=useState('');
const userData = useSelector((state) => state.newUserDetails.initialUserData);
const [zoneList, setZoneList] = useState([]);
const [selectedOwnerID,setSelectedOwnerID]=useState('');
const [wardNo, setWardNo] = useState('');
const [propertyNo, setPropertyNo] = useState('');
const [zoneNo, setZoneNo] = useState('');
const [WadhghatNo, setWadhghatNo] = useState('');
const [taxPayerName, setTaxPayerName] = useState('');

useEffect(() => {
  console.log(userData, 'logged in user');
}, [userData]);
//search button
const handleSearch = async () => {
  try {
    const payload = {
      wardNo,
      propertyNo,
      zoneNo,
      WadhghatNo,
      approvalStatus: status || null,
      taxPayerName,
      fromDate: valueFrom ? dayjs(valueFrom).format('YYYY-MM-DD') : null,
      toDate: valueTo ? dayjs(valueTo).format('YYYY-MM-DD') : null
    };
    console.log(payload,"paylod for search")

    const res = await SearchDataEntryRequest(payload);

    console.log('Search response:', res);

    if (res.success) {
      setRecords(res.data || []);
      setIsSearchMode(true);
    }
  } catch (error) {
    console.error('Search error:', error);
  }
};
const handleClear = () => {
  setRecords(initialRecords);
  setIsSearchMode(false);

  setWardNo('');
  setPropertyNo('');
  setZoneNo('');
  setWadhghatNo('');
  setStatus('');
  setTaxPayerName('');
  setValueFrom(null);
  setValueTo(null);
};
//pending table 
useEffect(() => {
  const fetchDataentryPendingReq = async () => {
    try {
      const response = await fetchDataEntryAppPendingRequests();
      console.log(response,"response pending des")

      if (response?.success) {
        setRecords(response.pendingRecords || []);
        setInitialRecords(response.pendingRecords || []); 

        setPendingCount(response.pendingCount || 0);
        setApprovedCount(response.approvedCount || 0);
        setDisApprovedCount(response.disapprovedCount || 0);

        setIsSearchMode(false);
      }
    } catch (error) {
      console.error("Error fetching data entry pending reqs", error);
    }
  };

  fetchDataentryPendingReq();
}, []);
//ward
useEffect(() => {
  const fetchUserInfo = async () => {
    if (!userData.UserID || userData.UserID === 0) return;

    try {
      const response = await getUserInfoById(userData.UserID);
      console.log(response, 'allocated ward mutation approval');

      const user = response.user?.[0]; // ✅ array → object

      if (user?.AllocatedWard) {
        const parsedWards = Array.isArray(user.AllocatedWard)
          ? user.AllocatedWard
          : JSON.parse(user.AllocatedWard);

        setAllocatedWard(parsedWards.join(', ')); // "1, 3, 4"
      } else {
        setAllocatedWard('');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  fetchUserInfo();
}, [userData.UserID]);
 //zone
 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getZoneMasterList();
      console.log(response, 'response');

      const fetchedZoneList = response.zoneList;
      console.log(fetchedZoneList, 'zone');

      setZoneList(fetchedZoneList);
    } catch (error) {
      console.error('Error fetching Zone Master:', error);
      setZoneList([]);
    }
  };

  fetchData();
}, []);
  
  return (
    <>
      {showDataEntry ? (
        <>
          <MainCard title="Changes Approval Details">
            {/* <Grid sx={{ overflowX: 'auto' }}> */}
            <Grid container spacing={2}>
            <Grid item xs={6} sm={5.3} mb={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
<Typography sx={{ fontWeight: 'bold' }}>Allocate Ward</Typography>
      <Typography sx={{ ml: 3 }}>{allocatedWard || ''}</Typography>
    </Stack>
            </Grid>
        </Grid>

            {/* table */}
            <Grid item xs={12} sm={12} mt={2}>
              <Box className="card" style={{ marginTop: '6px' }}>
                <Card>
                  <CardContent>
                    <Box>
                      {/* Table */}
                      <Table>
                        {/* Table Header */}
                        <TableHead style={{ backgroundColor:'white'}}>
                          <TableRow>
                            <TableCell>Enter Tax Payer Name To Search:</TableCell>
                            <TableCell>Enter From Date:</TableCell>
                            <TableCell>Enter To Date:</TableCell>
                            <TableCell>
                              <span style={{ color: 'red' }}>Pending :</span>
                              <span style={{ color: 'black' }}>
                              {pendingCount}
                              </span>
                            </TableCell>
                           
                            <TableCell>
                              <span style={{ color: 'green' }}>Approved:</span>
                              <span style={{ color: 'black' }}>{approvedCount}</span>
                            </TableCell>
                              <TableCell>
                        <span style={{ color: 'green' }}>DisApproved:</span>
                        <span style={{ color: 'black' }}>{disApprovedCount}</span>
                      </TableCell>
                          </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                          <TableRow>
                            <TableCell>
                            <TextField required autoComplete="family-name" placeholder="Enter Search Text" value={taxPayerName} onChange={(e)=>setTaxPayerName(e.target.value)} />
                            </TableCell>
                            <TableCell>
                              <Grid item xs={2} sm={2} mb={1}>
                                <Stack spacing={1}>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{ width: '88%' }}>
                                      <DatePicker value={valueFrom} onChange={(newValue) => setValueFrom(newValue)} />
                                    </DemoContainer>
                                  </LocalizationProvider>
                                </Stack>{' '}
                              </Grid>{' '}
                            </TableCell>
                            <TableCell>
                              <Grid item xs={2} sm={2} mb={1}>
                                <Stack spacing={1}>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{ width: '88%' }}>
                                      <DatePicker value={valueTo} onChange={(newValue) => setValueTo(newValue)} />
                                    </DemoContainer>
                                  </LocalizationProvider>
                                </Stack>{' '}
                              </Grid>{' '}
                            </TableCell>
                            <TableCell>
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
                                <Grid item xs={10} sm={6}>
                                  <Stack spacing={0}>
                                    <Button variant="contained"
                                     onClick={handleSearch}
                                      >
                                      Search
                                    </Button>
                                  </Stack>
                                </Grid>
                                <Grid item xs={10} sm={6}>
                                  <Stack spacing={0}>
                                    <Button variant="contained" color="secondary" onClick={handleClear}>
                                      Clear
                                    </Button>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </TableCell>
                            <TableCell>
                              <Grid item xs={6} sm={5.3} mb={1}>
                                <Stack spacing={1}>
                                  <InputLabel>Select Status:</InputLabel>
                                  <Select labelId="select-criteria" id="select-criteria" value={status} onChange={handleStatus}>
                                    <MenuItem value="0">--Select--</MenuItem>
                                    <MenuItem value="1" onClick={toggleAll}>
                                      ALL
                                    </MenuItem>
                                    <MenuItem value="2" onClick={togglePending}>
                                      PENDING
                                    </MenuItem>
                                    <MenuItem value="3">VERFIED</MenuItem>
                                    <MenuItem value="4" onClick={toggle}>
                                      APPROVED
                                    </MenuItem>
                                  </Select>{' '}
                                </Stack>
                              </Grid>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <InputLabel sx={{ fontSize: '15px', fontWeight: 'bold', mb: 2 }}>Ward No:</InputLabel>
                              <TextField required autoComplete="family-name" placeholder="Enter Search Text" value={wardNo} onChange={(e)=>setWardNo(e.target.value)} />
                            </TableCell>
                            <TableCell>
                              <InputLabel sx={{ fontSize: '15px', fontWeight: 'bold', mb: 2 }}>Property No:</InputLabel>
                              <TextField required autoComplete="family-name" placeholder="Enter Search Text" value={propertyNo} onChange={(e)=>setPropertyNo(e.target.value)}/>
                            </TableCell>
                            <TableCell>
                              <Grid item xs={6} sm={6}>
                                <Stack spacing={1}>
                                  <InputLabel id="demo-number-select-label" sx={{ fontSize: '15px', fontWeight: 'bold', mb: 2 }}>
                                    Zone No:
                                  </InputLabel>
                                  <FormControl fullWidth>
                                  <Select
                                                   sx={{ minWidth: '100px' }}
                                                   value={zoneNo}
                                                   onChange={(e)=>{setZoneNo(e.target.value)}}
                                                   name="ZoneNo"
                                                  
                                                   MenuProps={{
                                                     PaperProps: {
                                                       style: {
                                                         maxHeight: 200,
                                                       },
                                                     },
                                                   }}
                                                 >
                                                   <MenuItem value={0} disabled>
                                                     Select
                                                   </MenuItem>
                                                   {zoneList.map((zone, index) => (
                                                     <MenuItem key={index} value={zone.ZoneNo}>
                                                       {zone.ZoneNo}
                                                     </MenuItem>
                                                   ))}
                                                 </Select>
                                  </FormControl>
                                </Stack>
                              </Grid>
                            </TableCell>
                            <TableCell sx={{ fontSize: '15px', fontWeight: 'bold', mb: 2 }}>
                              <InputLabel sx={{ fontSize: '15px', fontWeight: 'bold', mb: 2 }}>WadhGhat No:</InputLabel>
                              <TextField required autoComplete="family-name" placeholder="Enter Search Text" value={WadhghatNo} onChange={(e)=>{setWadhghatNo(e.target.value)}} />
                            </TableCell>
                            <TableCell>
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
                                <Grid item xs={10} sm={12} mt={3}>
                                  <Stack spacing={0}>
                                    <Button variant="contained" color="success">
                                      PrintAll{' '}
                                    </Button>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                  {/* table 2 */}
                </Card>
              </Box>
            </Grid>
            {/*table 2  */}
            {isOpen && (
              <>
                <Box mb={1}></Box>
                {/* table */}

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
                            Approval
                          </Typography>
                          <Grid sx={{ marginLeft: '65vw' }}>
                            <CSVExport data={data} headers={headers} filename="data-entry-approval.csv" />
                          </Grid>
                          <Box sx={{ overflowX: 'auto', height: '500px' }}>
                            {/* Table */}
                            <Table>
                              {/* Table Header */}
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell>Select</TableCell>
                                  <TableCell>Action</TableCell>
                                  <TableCell>Property No</TableCell>
                                  <TableCell>Tax Payer Name</TableCell>
                                  <TableCell>Wadhghat No</TableCell>
                                  <TableCell>Application Page Source</TableCell>
                                  <TableCell>Updated By</TableCell>
                                  <TableCell> Updated Date</TableCell>
                                  <TableCell>Approval By</TableCell>
                                  <TableCell>Approval Date</TableCell>
                                  <TableCell>Approval Status</TableCell>
                                  <TableCell>Approval Remark</TableCell>
                                </TableRow>
                              </TableHead>
                              {/* Table Body */}
                              <TableBody>
                                <TableRow>
                                  <TableCell>
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
                                      <Grid item xs={10} sm={15} mt={3}>
                                        <Stack spacing={0}>
                                          <TableCell>
                                            <IconButton
                                              variant="contained"
                                              color="success"
                                              sx={{ fontSize: '2rem' }}
                                              onClick={handleButtonClick}
                                            >
                                              <SelectOutlined />
                                            </IconButton>
                                          </TableCell>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell>
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
                                      <Grid item xs={10} sm={15} mt={3}>
                                        <Stack spacing={0}>
                                          <TableCell>
                                            <IconButton variant="contained" color="primary" sx={{ fontSize: '2rem' }}>
                                              <PrinterOutlined />
                                            </IconButton>
                                          </TableCell>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell>28-88-6</TableCell>
                                  <TableCell>Mahadev Balaji Meshram</TableCell>
                                  <TableCell>WG-3382</TableCell>
                                  <TableCell> OP-DataEntry</TableCell>
                                  <TableCell>OP-240 ( amol.p )</TableCell>
                                  <TableCell>4/4/2024 5:33:00 PM</TableCell>
                                  <TableCell>dipali raikwar</TableCell>
                                  <TableCell>4/4/2024 5:42:34 PM </TableCell>
                                  <TableCell>APPROVED</TableCell>
                                  <TableCell>ok</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>
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
                                      <Grid item xs={10} sm={15} mt={3}>
                                        <Stack spacing={0}>
                                          <TableCell>
                                            <IconButton
                                              variant="contained"
                                              color="success"
                                              sx={{ fontSize: '2rem' }}
                                              onClick={handleButtonClick}
                                            >
                                              <SelectOutlined />
                                            </IconButton>
                                          </TableCell>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell>
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
                                      <Grid item xs={10} sm={15} mt={3}>
                                        <Stack spacing={0}>
                                          <TableCell>
                                            <IconButton variant="contained" color="primary" sx={{ fontSize: '2rem' }}>
                                              <PrinterOutlined />
                                            </IconButton>
                                          </TableCell>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell>28-88-6</TableCell>
                                  <TableCell>Milind Socierty</TableCell>
                                  <TableCell>WG-3382</TableCell>
                                  <TableCell> OP-DataEntry</TableCell>
                                  <TableCell>OP-240 ( amol.p )</TableCell>
                                  <TableCell>4/4/2024 5:33:00 PM</TableCell>
                                  <TableCell>dipali raikwar</TableCell>
                                  <TableCell>4/4/2024 5:42:34 PM </TableCell>
                                  <TableCell>APPROVED</TableCell>
                                  <TableCell>ok</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>
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
                                      <Grid item xs={10} sm={15} mt={3}>
                                        <Stack spacing={0}>
                                          <TableCell>
                                            <IconButton
                                              variant="contained"
                                              color="success"
                                              sx={{ fontSize: '2rem' }}
                                              onClick={handleButtonClick}
                                            >
                                              <SelectOutlined />
                                            </IconButton>
                                          </TableCell>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell>
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
                                      <Grid item xs={10} sm={15} mt={3}>
                                        <Stack spacing={0}>
                                          <TableCell>
                                            <IconButton variant="contained" color="primary" sx={{ fontSize: '2rem' }}>
                                              <PrinterOutlined />
                                            </IconButton>
                                          </TableCell>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell>28-88-6</TableCell>
                                  <TableCell>Milind Socierty</TableCell>
                                  <TableCell>WG-3382</TableCell>
                                  <TableCell> OP-DataEntry</TableCell>
                                  <TableCell>OP-240 ( amol.p )</TableCell>
                                  <TableCell>4/4/2024 5:33:00 PM</TableCell>
                                  <TableCell>dipali raikwar</TableCell>
                                  <TableCell>4/4/2024 5:42:34 PM </TableCell>
                                  <TableCell>APPROVED</TableCell>
                                  <TableCell>ok</TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>
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
                                      <Grid item xs={10} sm={15} mt={3}>
                                        <Stack spacing={0}>
                                          <TableCell>
                                            <IconButton
                                              variant="contained"
                                              color="success"
                                              sx={{ fontSize: '2rem' }}
                                              onClick={handleButtonClick}
                                            >
                                              <SelectOutlined />
                                            </IconButton>
                                          </TableCell>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell>
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
                                      <Grid item xs={10} sm={15} mt={3}>
                                        <Stack spacing={0}>
                                          <TableCell>
                                            <IconButton variant="contained" color="primary" sx={{ fontSize: '2rem' }}>
                                              <PrinterOutlined />
                                            </IconButton>
                                          </TableCell>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </TableCell>
                                  <TableCell>28-88-6</TableCell>
                                  <TableCell>Milind Socierty</TableCell>
                                  <TableCell>WG-3382</TableCell>
                                  <TableCell> OP-DataEntry</TableCell>
                                  <TableCell>OP-240 ( amol.p )</TableCell>
                                  <TableCell>4/4/2024 5:33:00 PM</TableCell>
                                  <TableCell>dipali raikwar</TableCell>
                                  <TableCell>4/4/2024 5:42:34 PM </TableCell>
                                  <TableCell>APPROVED</TableCell>
                                  <TableCell>ok</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                          <Pagination count={10} variant="outlined" color="primary" />
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
            {/* pending */}
            {isOpenPending && (
              <>
                <Box mb={1}></Box>
                {/* table */}
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
                        <Typography variant="h6" sx={{ color: 'blue', fontWeight: 'bold' }}>
  {isSearchMode ? 'Search Results' : 'Pending'}
</Typography>
                          <Grid sx={{ marginLeft: '65vw' }}>
                            <CSVExport data={data} headers={headers} filename="data-entry-approval.csv" />
                          </Grid>
                          <Box sx={{ overflowX: 'auto', height: '500px' }}>
                            {/* Table */}
                            <Table>
                              {/* Table Header */}
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell>Select</TableCell>
                                  <TableCell>Property No</TableCell>
                                  <TableCell>Tax Payer Name</TableCell>
                                  <TableCell>Wadhghat No</TableCell>
                                  <TableCell>Application Page Source</TableCell>
                                  <TableCell>Updated By</TableCell>
                                  <TableCell> Updated Date</TableCell>
                                  <TableCell>Approval By</TableCell>
                                  <TableCell>Approval Date</TableCell>
                                  <TableCell>Approval Status</TableCell>
                                  <TableCell>Approval Remark</TableCell>
                                </TableRow>
                              </TableHead>
                              {/* Table Body */}
                              <TableBody>
  {records.length > 0 ? (
    records.map((row, index) => (
      <TableRow key={row.UpdVersionID}>
        {/* Select */}
  <TableCell>
<IconButton variant="contained" color="success" sx={{ fontSize: '2rem' }}   onClick={() => handleButtonClick(row)}   
>
  <SelectOutlined />
  </IconButton>                                 
</TableCell>

        {/* Action */}
        {/* <TableCell>
          <Button size="small" variant="contained">
            View
          </Button>
        </TableCell> */}

        {/* Property No */}
        <TableCell>{row.NewPropertyNo}</TableCell>

        {/* Tax Payer Name */}
        <TableCell>{row.OwnerName || '-'}</TableCell>

        {/* Wadhghat No */}
        <TableCell>
          {row.WadhghatNo}
        </TableCell>

        {/* Application Page Source */}
        <TableCell>{row.ApplicationPageSource}</TableCell>

        {/* Updated By */}
        <TableCell>{row.UpdatedBy}</TableCell>

        {/* Updated Date */}
        <TableCell>
          {row.UpdatedDate
            ? dayjs(row.UpdatedDate).format('DD-MM-YYYY HH:mm')
            : '-'}
        </TableCell>

        {/* Approval By */}
        <TableCell>{row.ApprovalBy || '-'}</TableCell>

        {/* Approval Date */}
        <TableCell>
          {row.ApprovalDate
            ? dayjs(row.ApprovalDate).format('DD-MM-YYYY HH:mm')
            : '-'}
        </TableCell>

        {/* Approval Status */}
        <TableCell>
          {row.ApprovalStatus}
            
        </TableCell>

        {/* Approval Remark */}
        <TableCell>{row.ApprovalRemark || '-'}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={12} align="center">
        No pending records found
      </TableCell>
    </TableRow>
  )}
</TableBody>
                            </Table>
                          </Box>
                          <Pagination count={10} variant="outlined" color="primary" />
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
            {/* </Grid> */}
          </MainCard>
        </>
      ) : null}
      {approvalDataEntry ? null : <ApprovalDataEntry ApprovalButton={handleButtonClick} />}
      {pending ? null : <PendingDataEntry PendingButton={handleButtonClickPending} selectedOwnerID={selectedOwnerID} selectedVersionID={versionID} />}
    </>
  );
}

export default DataEntryApproval;
