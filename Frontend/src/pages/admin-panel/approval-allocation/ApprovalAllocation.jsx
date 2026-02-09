import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  Box,
  Checkbox,
  Typography,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,Snackbar, Alert
} from '@mui/material';
import MainCard from 'components/MainCard';
import { EditOutlined } from '@ant-design/icons';
import { getUserRole } from 'services/Amc/user-role-services/userRoleService';
import { fetchWardByZone, fetchZoneSectionList } from 'services/transaction/ddChequeApproval/ddChequeApprovalService';
import { getApprovalAllocationHistory, upsertApprovalAllocationHistory } from 'services/AdminPanel/approvalAllocationService';

function ApprovalAllocation() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' 
  });
// Snackbar close handler
const handleCloseSnackbar = () => {
  setSnackbar(prev => ({ ...prev, open: false }));
};
  const [userType, setUserType] = useState([]);
  const [zone, setZone] = useState('');
  const [selectedWard, setSelectedWard] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const tableHeaders = ['Edit', 'User Type', 'User ID', 'User Name', 'Zone No', 'Ward No', 'Allocation Status'];

  useEffect(() => {
    // Initialize tableData with two entries
    setTableData([
      {
        userType: 'Office Employee',
        userId: 'USER_123456',
        userName: 'Vinod',
        zoneNo: 'Zone 1',
        wardNo: '1, 2, 3',
        allocationStatus: 'Allocate'
      },
      {
        userType: 'Admin',
        userId: 'USER_789012',
        userName: 'Jane Smith',
        zoneNo: 'Zone 2',
        wardNo: '4, 5, 6',
        allocationStatus: 'Allocate'
      }
    ]);
  }, []);

  const [roleList, setRoleList] = useState([]);     
  const [selectedRole, setSelectedRole] = useState(''); 
  const [allocateTo, setAllocateTo] = useState('');
  const [selectedZone, setSelectedZone] = useState('');



  const fetchRoleUser = async () => {
    try {
      const response = await getUserRole();
      console.log(response, 'API Response');
      const fetchedRoleList = response; // Assuming API returns an array of roles directly
      setRoleList(fetchedRoleList); // Update the roleList state
    } catch (error) {
      console.error('Error fetching role list:', error);
      setRoleList([]); // Set empty array if there's an error
    }
  };
  useEffect(() => {
    fetchRoleUser();
  }, []);
  const handleUserTypeChange = (event) => {
    const selectedUserType = event.target.value;
    setRoleList(selectedUserType);

    if (firstSubMenu) {
      setAllocateTo(firstSubMenu);
    } else {
      setAllocateTo('');
    }
  };

  const WardArray = ['All', '1', '2', ' 3', '4', '5', '6', '7', '8'];

  const handleCheckboxChanges = (wardValue) => {
    // All checkbox
    if (wardValue === 'ALL') {
      const allChecked = !selectAll;
      setSelectAll(allChecked);
  
      if (allChecked) {
        // wardList se sab ward bhejo
        setSelectedWard(wardList.map(w => w.Ward));
      } else {
        setSelectedWard([]);
      }
      return;
    }
  
    // Single ward toggle
    setSelectedWard((prev) =>
      prev.includes(wardValue)
        ? prev.filter(w => w !== wardValue)
        : [...prev, wardValue]
    );
  };
  

  const handleAllocateToChange = (e) => {
    const selectedName = e.target.value;
  
    const user = roleList.find(
      (r) => r.role === selectedRole && r.name === selectedName
    );
  
    if (user) {
      setAllocateTo(user.name);
      setSelectedUser(user); 
      console.log('Selected UserID:', user.UserID);
    }
  };
  




  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = async (index) => {
    const row = tableData[index];
    setEditIndex(index);
  
    // User Type
    setSelectedRole(row.user_type);
  
    // User
    const user = roleList.find(u => u.UserID === row.user_id);
    if (user) {
      setSelectedUser(user);
      setAllocateTo(user.name);
    }
  
    // Ward array normalize
    const wardsArray = Array.isArray(row.ward)
      ? row.ward
      : row.ward.split(',').map(w => w.trim());
  
    // ✅ Zone change with edit flag
    await handleZoneChange(
      { target: { value: row.zone } },
      true,
      wardsArray
    );
  };
  
  
    // Fetch Allocation History
    const loadAllocationHistory = async () => {
      try {
        const res = await getApprovalAllocationHistory();
    
        if (res?.success && Array.isArray(res.data)) {
          setTableData(res.data);   // ✅ table render yahin se hoti hai
        } else {
          setTableData([]);         // fallback
        }
      } catch (err) {
        console.error(err);
        setTableData([]);
      }
    };
    
  
    useEffect(() => {
      loadAllocationHistory();
    }, []);

    
   // Allocate / De-Allocate handler
   const handleAllocate = async (status) => {
    if (!selectedRole || !selectedUser || !selectedZone || selectedWard.length === 0) {
      setSnackbar({ open: true, message: 'Please select all fields', severity: 'warning' });
      return;
    }
  
    const wardsArray = selectedWard.map(w => w.toString());
    const allocationStatus = status; // 'Allocate' or 'DeAllocate'
  
    const payload = {
      allocation_id: editIndex !== null ? tableData[editIndex]?.allocation_id : null,
      user_type: selectedRole,
      user_id: selectedUser.UserID,
      user_name: selectedUser.name,
      zone: selectedZone,
      ward: wardsArray,
      allocation_status: allocationStatus
    };
  
    try {
      const res = await upsertApprovalAllocationHistory(payload);
  
      if (res.success) {
        await loadAllocationHistory();
  
        setEditIndex(null);
        setSelectedRole('');
        setSelectedUser(null);
        setAllocateTo('');
        setSelectedZone('');
        setSelectedWard([]);
        setSelectAll(false);
  
        // ✅ Show success snackbar
        setSnackbar({ open: true, message: 'Allocation updated successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: res.message || 'Error while saving allocation', severity: 'error' });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error while saving allocation', severity: 'error' });
    }
  };
  

    
    
    
    
  const [zoneList, setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);

  //zone
  const loadZones = async () => {
    try {
      const res = await fetchZoneSectionList();
      if (res.success) {
        setZoneList(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    loadZones();
  }, []);
   //zone based ward
   const handleZoneChange = async (e, isEdit = false, editWards = []) => {
    const zoneNo = e.target.value;
    setSelectedZone(zoneNo);
    setWardList([]);
    setSelectedWard([]);
  
    if (!zoneNo) return;
  
    try {
      const res = await fetchWardByZone(zoneNo);
      if (res.success) {
        setWardList(res.data);
  
        // ✅ ONLY FOR EDIT
        if (isEdit && editWards.length > 0) {
          setSelectedWard(editWards);
  
          setSelectAll(editWards.length === res.data.length);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <>
      <MainCard title="Approval Ward Allocation">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Typography>User Type</Typography>

              <FormControl fullWidth>
              <Select
  value={selectedRole}
  onChange={(e) => {
    setSelectedRole(e.target.value);
    setAllocateTo(''); // reset user when role changes
  }}
>
  <MenuItem value="" disabled>
    Select
  </MenuItem>

  {[...new Set(roleList.map((r) => r.role))].map((roleName, index) => (
    <MenuItem key={index} value={roleName}>
      {roleName}
    </MenuItem>
  ))}
</Select>

              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack spacing={1}>
              <Typography>Allocate To</Typography>
        
              <Stack spacing={1}>
              <Select
  value={selectedUser ? selectedUser.UserID : ''}
  onChange={(e) => {
    const user = roleList.find(u => u.UserID === e.target.value);
    setSelectedUser(user);       // ✅ full object
    setAllocateTo(user.name);    // optional (for display)
  }}
>
  <MenuItem value="" disabled>
    Select
  </MenuItem>

  {roleList
    .filter(u => u.role === selectedRole)
    .map(u => (
      <MenuItem key={u.UserID} value={u.UserID}>
        {u.name}
      </MenuItem>
    ))}
</Select>


                  </Stack>

            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Typography>Zone Section</Typography>
              <Select
                sx={{ width: '150px' }}
                value={selectedZone}
                onChange={handleZoneChange}

              >
               {zoneList.map((z, index) => (
    <MenuItem key={index} value={z.ZoneSectionNo}>
      {z.ZoneSectionNo}
    </MenuItem>
  ))}
              </Select>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Typography>Select Ward</Typography>
              <Box
  style={{
    maxHeight: '130px',
    width: '140px',
    overflowY: 'auto',
    border: '2px solid #ccc',
    padding: '5px',
    color: '#1677ff'
  }}
>
 
<Box mt={1}>
  {/* Select All */}
  <div>
    <label>
      <Checkbox
        checked={selectAll}
        onChange={() => handleCheckboxChanges('ALL')}
      />
      All
    </label>
  </div>

  {/* Individual wards */}
  {wardList.map((w, index) => (
    <div key={index}>
      <label>
        <Checkbox
          checked={selectedWard.includes(w.Ward)}
          onChange={() => handleCheckboxChanges(w.Ward)}
        />
        {w.Ward}
      </label>
    </div>
  ))}
</Box>
</Box>

            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={4}>
            <Stack spacing={2} direction={'row'}>
              <Button variant="contained" color="warning"     onClick={() => handleAllocate('Allocate')}
>
                Allocate
              </Button>
            
              <Button
    variant="contained"
    color="info"
    onClick={() => {
      setEditIndex(null);
      setSelectedRole('');
      setSelectedUser(null);
      setAllocateTo('');
      setSelectedZone('');
      setSelectedWard([]);
      setSelectAll(false);
    }}
  >
    Cancel
  </Button>
              <Button variant="contained" color="warning"   onClick={() => handleAllocate('DeAllocate')}>
                De-Allocate
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
      <MainCard>
      <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((h, i) => <TableCell key={i}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>
                <EditOutlined
  style={{ cursor: 'pointer' }}
  onClick={() => handleEdit(i)}   
/>                </TableCell>
                <TableCell>{row.user_type}</TableCell>
                <TableCell>{row.user_id}</TableCell>
                <TableCell>{row.user_name}</TableCell>
                <TableCell>{row.zone}</TableCell>
                <TableCell>{Array.isArray(row.ward) ? row.ward.join(', ') : row.ward}</TableCell>
                <TableCell>{row.allocation_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    onClose={handleCloseSnackbar}
    severity={snackbar.severity}
    variant="filled"
    sx={{ width: '100%' }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
      </MainCard>
    </>
  );
}
export default ApprovalAllocation;
