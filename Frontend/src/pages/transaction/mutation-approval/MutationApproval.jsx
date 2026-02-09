// material-ui
import Pagination from '@mui/material/Pagination';
import PrinterOutlined from '@ant-design/icons/PrinterOutlined';
import SelectOutlined from '@ant-design/icons/SelectOutlined';
import dayjs from "dayjs";
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
  IconButton,
  TablePagination,
  Autocomplete
} from '@mui/material';
import { useEffect, useState } from 'react';
// project import
import { CSVExport } from 'components/third-party/react-table';
import MainCard from 'components/MainCard';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PendingMutation from './pending-mutation';

import { fetchMutationPendingRequests, SearchMutationRequest } from 'services/transaction/mutationHistoryApproval/mutationHistortyApprovalService';
import { getUserInfoById } from 'services/utlilityService/wardAllocations/wardAllocationService';
import { getZoneMasterList } from 'services/masterServices/zone-master-services.js/zone-master-services';
import { useSelector } from 'react-redux';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchWardNo } from 'services/wardnumber.services';
import { height } from '@mui/system';

function MutationApproval() {

  const [records, setRecords] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [disApprovedCount, setDisApprovedCount] = useState(0);
  const [isOpenPending, setIsOpenPending] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [status, setStatus] = useState(0);
  const [valueTo, setValueTo] = useState(null);
  const [valueFrom, setValueFrom] = useState(null);
  const [approvalMutation, setApprovalMutation] = useState(true);
  const [pending, setPending] = useState(true);
  const [showMutation, setShowMutation] = useState(true);
  const [selectedUpdVersionID, setSelectedUpdVersionID] = useState(null);
  const [versionID, setVersionID] = useState('');
  const [approvalStatus, setAppovalStatus] = useState('');
  const [wardNo, setWardNo] = useState('');
  const [propertyNo, setPropertyNo] = useState('');
  const [zoneNo, setZoneNo] = useState('');
  const [ferfarNo, setFerfarNo] = useState('');
  const [taxPayerName, setTaxPayerName] = useState('');
  const [zoneList, setZoneList] = useState([]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedOwnerID, setSelectedOwnerID] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allocatedWard, setAllocatedWard] = useState('');
  const [page, setPage] = useState(1);
  const[selectedWard,setSelectedWard]=useState('');
  const[wardList,setWardList]=useState([]);
  const[propertyNoList,setPropertyNoList]=useState([]);
  const[selectedPropertyNo,setSelectedPropertyNo]=useState('');
  
  
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

  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user');
  }, [userData]);

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

useEffect(() => {
      const loadWardNos = async () => {
        try {
          const wardNo = await fetchWardNo();
          const sortedWard = [...wardNo].sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo));
          setWardList(sortedWard);
        } catch (error) {
          console.error('Error fetching ward Number', error);
        }
      };
      loadWardNos();
    }, []);

 



  const handleNumberChange = (event) => {
    setSelectedNumbers(event.target.value);
  };

  const handleButtonClick = (row) => {

    console.log(row, "selected row");
    setAppovalStatus(row.ApprovalStatus);
    setSelectedOwnerID(row.OwnerID);
    setSelectedUpdVersionID(row.UpdVersionID);
    setVersionID(row.UpdVersionID);
    console.log(row.OwnerID, "ooo");
    console.log(row.UpdVersionID, "vvv");
    setShowMutation(!showMutation);
    setPending(false);
    setApprovalMutation(!approvalMutation);
  };




  const handleSearch = async () => {
    try {

const formattedPropertyNo = selectedPropertyNo
      ? selectedPropertyNo.NewPartitionNo
        ? `${selectedPropertyNo.NewPropertyNo}_${selectedPropertyNo.NewPartitionNo}`
        : selectedPropertyNo.NewPropertyNo
      : null;

      const payload = {
        wardNo:selectedWard,
        propertyNo:formattedPropertyNo,
        zoneNo,
        ferfarNo,
        approvalStatus: status || null,
        taxPayerName,
        fromDate: valueFrom ? dayjs(valueFrom).format('YYYY-MM-DD') : null,
        toDate: valueTo ? dayjs(valueTo).format('YYYY-MM-DD') : null
      };
      console.log(payload, "paylod for search")

      const res = await SearchMutationRequest(payload);

      console.log('Search response:', res);

      if (res.success) {
        setSearchResults(res.data || []);
        setIsSearchMode(true);
        setPage(1);

      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleClear = () => {
    setInitialRecords(records);
    setSelectedWard('');
    setSelectedPropertyNo('');
    setPage(1);
    setIsSearchMode(false);

    setWardNo('');
    setPropertyNo('');
    setZoneNo('');
    setFerfarNo('');
    setStatus('');
    setTaxPayerName('');
    setValueFrom(null);
    setValueTo(null);
  };

  const handleStatus = (event) => {
    const value = event.target.value;
    setStatus(value); // This state 'status' is used in handleSearch payload
  };

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

  const refreshDashboardData = async () => {
    try {
      const response = await fetchMutationPendingRequests();
      if (response?.success) {
        setInitialRecords(response.pendingRecords || []);
        setPendingCount(response.pendingCount || 0);
        setApprovedCount(response.approvedCount || 0);
        setDisApprovedCount(response.disapprovedCount || 0);
        setRecords(response.pendingRecords || []);
        // Reset search mode to show the fresh pending list
        setIsSearchMode(false);
      }
    } catch (error) {
      console.error("Error fetching mutation pending reqs", error);
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  // 2. Update the Back Button handler to call the refresh
  const handleButtonClickPending = () => {
    setShowMutation(true);
    setPending(true);
    refreshDashboardData();
  };


      const handleWardChange = async (event) => {
          const selectedWard = Number(event.target.value);
          setSelectedWard(selectedWard);
          try {
            const response = await fetchPropertyRangeByWard(selectedWard);
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

  const displayRecords = isSearchMode ? searchResults : initialRecords;

  const rowsPerPage = 5;


  // Calculate slicing indices
  const indexOfLastRecord = page * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = displayRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  console.log("Current records length:", currentRecords.length);

  useEffect(() => {
    setPage(1);
  }, [displayRecords]);

  return (
    <>
      {showMutation ? (
        <>
          <MainCard title="Mutation Approval Details">
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
                        <TableHead style={{ backgroundColor: 'white' }}>
                          <TableRow >
                            <TableCell >Enter Tax Payer Name To Search:</TableCell>
                            <TableCell>Enter From Date:</TableCell>
                            <TableCell>Enter To Date:</TableCell>
                            <TableCell >
                              <span style={{ color: 'red' }}>Pending :</span>
                              <span style={{ color: 'black' }}>
                                {pendingCount}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span style={{ color: 'blue' }}>Approved :</span>
                              <span style={{ color: 'black' }}>

                                {approvedCount}
                              </span>
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
                              <Grid item mt={1}>
                                <TextField required autoComplete="family-name" placeholder="Enter Search Text" value={taxPayerName} onChange={(e) => setTaxPayerName(e.target.value)} />
                              </Grid> </TableCell>
                            <TableCell>
                              <Grid item xs={2} sm={2} mt={0}>
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
                              <Grid item xs={2} sm={2} mt={0}>
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
                              <InputLabel sx={{ fontSize: '15px', fontWeight: 'bold', mt: '-1vw' }}>Ferfar No:</InputLabel>
                              <TextField required autoComplete="family-name" placeholder="Enter Ferfar No:" value={ferfarNo} onChange={(e) => { setFerfarNo(e.target.value) }} />


                            </TableCell>
                            <TableCell>
                              <Grid item xs={6} sm={5.3} mt={-1.8}>
                                <Stack spacing={0}>
                                  <InputLabel>Select Status:</InputLabel>
                                  <Select
                                    labelId="select-criteria"
                                    id="select-criteria"
                                    value={status}
                                    onChange={handleStatus}
                                    fullWidth
                                  >
                                    <MenuItem value="">Select</MenuItem>

                                    <MenuItem value="PENDING">PENDING</MenuItem>
                                    <MenuItem value="APPROVED">APPROVED</MenuItem>
                                    <MenuItem value="DISAPPROVED">DISAPPROVED</MenuItem>
                                  </Select>

                                </Stack>
                              </Grid>
                            </TableCell>
                          </TableRow>
                          <TableRow>
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
                                      onChange={(e) => { setZoneNo(e.target.value) }}
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
                            <TableCell>
                              <InputLabel sx={{ fontSize: '15px', fontWeight: 'bold', mb: 1 }}>Ward No:</InputLabel>
                              {/* <TextField required autoComplete="family-name" placeholder="Enter Search Text" value={wardNo} onChange={(e) => setWardNo(e.target.value)} /> */}
                                <Stack spacing={1}>
                                                
                                 <Select
                                                          labelId="ward-no-label"
                                                          id="ward-no-select"
                                                          value={selectedWard}
                                                          onChange={handleWardChange}
                                                          displayEmpty
                                                          
                                                          MenuProps={{
                                                            PaperProps: {
                                                              style: {
                                                                maxHeight: 150,
                                                                overflowY: 'auto'
                                                              }
                                                            }
                                                          }}
                                                        >
                                                         
                                                          {Array.isArray(wardList) &&
                                                            wardList.length > 0 &&
                                                            wardList.map((ward, index) => (
                                                              <MenuItem key={index} value={Number(ward.NewWardNo)}>
                                                                {ward.NewWardNo}
                                                              </MenuItem>
                                                            ))}
                                                        </Select>
                                                  </Stack>
                                
                            </TableCell>
                            <TableCell>
                              <InputLabel sx={{ fontSize: '15px', fontWeight: 'bold', mb: 1 }}>Property No:</InputLabel>
                              {/* <TextField required autoComplete="family-name" placeholder="Enter Search Text" value={propertyNo} onChange={(e) => setPropertyNo(e.target.value)} /> */}
                            
                            <Autocomplete
                              options={propertyNoList}
                            
                              value={selectedPropertyNo}
                              getOptionLabel={(option) => {
  if (!option) return '';
  if (option.NewPartitionNo) {
    return `${option.NewPropertyNo}_${option.NewPartitionNo}`;
  }
  return option.NewPropertyNo ?? '';
}}

                
                             onChange={(event, newValue) => {
    setSelectedPropertyNo(newValue);
  }}
                          
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                
                                  size="small"
                                  fullWidth
                                />
                              )}
                            />
                            </TableCell>
                          
                            <TableCell sx={{ fontSize: '15px', fontWeight: 'bold' }}>
                              <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: '100%',
                                  height: '100%'
                                }}
                              >
                                <Grid item xs={10} sm={6} mt={3}>
                                  <Stack spacing={0}>
                                    <Button variant="contained" onClick={handleSearch}>
                                      Search
                                    </Button>
                                  </Stack>
                                </Grid>
                                <Grid item xs={10} sm={6} mt={3}>
                                  <Stack spacing={0}>
                                    <Button variant="contained" color="secondary" onClick={handleClear}>
                                      Clear
                                    </Button>
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
                                <Grid item xs={10} sm={6} mt={3}>
                                  <Stack spacing={0}>
                                    <Button variant="contained" color="success">
                                      PrintAll
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
                            {isSearchMode ? `Search Results (${status || 'All'})` : 'Pending Requests'}</Typography>

                          <Grid sx={{ marginLeft: '65vw' }}>
                            <CSVExport data={initialRecords} headers={headers} filename="mutation-approval.csv" />
                          </Grid>
                          <Box sx={{ overflowX: 'auto' ,height:'400px'}}>
                            {/* Table */}
                            <Table stickyHeader>
                              {/* Table Header */}
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow  sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                                  <TableCell >Select</TableCell>
                                  {/* <TableCell>Action</TableCell> */}
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Property No</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Tax Payer Name</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Ferfar No</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Application Page Source</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Updated By</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} > Updated Date</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Approval By</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Approval Date</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Approval Status</TableCell>
                                  <TableCell sx={{
                                    whiteSpace: "nowrap"
                                  }} >Approval Remark</TableCell>
                                </TableRow>
                              </TableHead>
                              {/* Table Body */}
                              <TableBody>
                                {currentRecords.length > 0 ? (
                                  currentRecords.map((row) => (
                                    <TableRow key={row.UpdVersionID}>
                                      <TableCell>
                                        <IconButton
                                          variant="contained"
                                          color="success"
                                          sx={{ fontSize: '2rem' }}
                                          onClick={() => handleButtonClick(row)}
                                        >
                                          <SelectOutlined />
                                        </IconButton>
                                      </TableCell>

                                      <TableCell>{row.NewPropertyNo || '-'}</TableCell>
                                      <TableCell>{row.OwnerName || '-'}</TableCell>
                                      <TableCell>{row.FerfarNo}</TableCell>
                                      <TableCell>{row.ApplicationPageSource}</TableCell>
                                      <TableCell>{row.UpdatedBy}</TableCell>
                                      <TableCell>
                                        {row.UpdatedDate ? dayjs(row.UpdatedDate).format('DD-MM-YYYY HH:mm') : '-'}
                                      </TableCell>
                                      <TableCell>{row.ApprovalBy || '-'}</TableCell>
                                      <TableCell>
                                        {row.ApprovalDate ? dayjs(row.ApprovalDate).format('DD-MM-YYYY HH:mm') : '-'}
                                      </TableCell>
                                      <TableCell>{row.ApprovalStatus}</TableCell>
                                      <TableCell>{row.ApprovalRemark || '-'}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={11} align="center">
                                      {isSearchMode ? "No search results found" : "No pending records found"}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>

                            </Table>
                          </Box>
                          <TablePagination
                            rowsPerPageOptions={[5]}
                            component="div"
                            count={displayRecords.length}
                            rowsPerPage={rowsPerPage}
                            page={page - 1}
                            onPageChange={(e, newPage) => setPage(newPage + 1)}
                          />
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
      {/* {approvalMutation ? null : <ApprovalMutation ApprovalButton={handleButtonClick} selectedOwnerID={selectedOwnerID} />} */}
      {pending ? null : <PendingMutation PendingButton={handleButtonClickPending} selectedOwnerID={selectedOwnerID} selectedVersionID={versionID} selectedStatus={approvalStatus} />}

    </>
  );
}

export default MutationApproval;
