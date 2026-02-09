// import {
//   Grid,
//   Typography,
//   Button,
//   Box,
//   Stack,
//   TextField,
//   Select,
//   MenuItem,
//   TableHead,
//   TableCell,
//   Table,
//   TableRow,
//   TableBody,
//   TableContainer
// } from '@mui/material';
// import MainCard from 'components/MainCard';
// import { useEffect, useState } from 'react';
// import { EditOutlined } from '@ant-design/icons';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import { setAppSetting } from 'state/reducers/applicationSettingSlice/applictaionSettingSlice';
// import { useDispatch } from 'react-redux';
// import { getApplicationSetting, upsertApplicationSetting } from 'services/AdminPanel/applicationSettingService';

// function ApplicationSetting() {
//   const [editMode, setEditMode] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
// const [tableRow, setTableRow] = useState(null); // saved data
// const [editRow, setEditRow] = useState(null);
//   useEffect(() => {
//     const fetchSetting = async () => {
//       try {
//         const data = await getApplicationSetting();
  
//         if (data?.success && data?.data) {
//           const row = data.data;
//           setSelectedRow({
            // id: row.AppSettingID,
            // Status: row.DailyPaymentEndStatus ? 'End' : 'Start',
            // Otp: row.OtpVerification === 1 ? 'On' : 'Off',
            // time: row.DailyCollectionReportTimeSpan || '',
            // span: row.DailyCollectionReportDaySpan || '',
            // spanHolidays: row.DailyCollectionReportDaySpanForH || '',
            // weekday: row.DailyCollectionReportDaySpanForDay || '',
            // live:row.IsLivePaymentActive === 1 ? 'On' : 'Off',
            // dashbord:row.DashbordWithInterest === 1 ? 'On' : 'Off',
            // paymentFlag:row.OnlinePaymentPageFlag === 1 ? 'On' : 'Off',
            // wgVal:row.IsWGMoreThnVal === 1 ? 'On' : 'Off',
            // dataEntryRetain:row.IsDataEntryRetainScreenEnable === 1 ? 'On' : 'Off',
            // mobileValidate:row.IsMobileValidate === 1 ? 'On' : 'Off',
            // specialDiscount:row.IsSpecialDiscount === 1 ? 'On' : 'Off',
            // dualRecCharge:row.DualReceiptCharge === 1 ? 'On' : 'Off',
            // receiptDay:row.IsReceiptDay === 1 ? 'On' : 'Off',
            // dualReceiptFee:row.DualReceiptFee === 1 ? 'On' : 'Off',
            // threeReceipt:row.IsThreeInchReceipt === 1 ? 'On' : 'Off',
//           });
//         } else {
//           setSelectedRow(null);
//         }
//       } catch (err) {
//         console.error('Error loading application setting:', err);
//         setSelectedRow(null); // error case me bhi null
//       }
//     };
  
//     fetchSetting();
//   }, []);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
// const [snackbarMsg, setSnackbarMsg] = useState('');
// const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success | error

//   const [openCancelDialog, setOpenCancelDialog] = useState(false);
//   const [changesMade, setChangesMade] = useState(false);
//   const dispatch = useDispatch();

//   const handleEdit = () => {
//     setEditMode(!editMode);
//     setChangesMade(false);
//   };

//   // const handleSave = () => {
//   //   if (!changesMade) {
//   //     setOpenCancelDialog(true);
//   //     console.info('[ApplicationSetting] No changes made, nothing to save.');
//   //     return;
//   //   }
  
//   //   const otpEnabled = selectedRow.Otp === 'On';
//   //   console.log('[ApplicationSetting] Saving settings:', { otpLoginEnabled: otpEnabled });
  
//   //   dispatch(
//   //     setAppSetting({
//   //       otpLoginEnabled: otpEnabled
//   //     })
//   //   );
  
//   //   setOpenCancelDialog(true);
//   //   setEditMode(false);
//   // };
//   const handleSave = async () => {
//     if (!selectedRow) {
//       setSnackbarMsg('Please select a record to update.');
//       setSnackbarSeverity('error');
//       setOpenSnackbar(true);
//       return;
//     }
  
//     const payload = {
//       AppSettingID: selectedRow.id,
//       DailyPaymentEndStatus: selectedRow.Status === 'End' ? 1 : 0,
//       OtpVerification: selectedRow.Otp === 'On' ? 1 : 0,
//       DailyCollectionReportTimeSpan: selectedRow.time,
//       DailyCollectionReportDaySpan: selectedRow.span,
//       DailyCollectionReportDaySpanForH: selectedRow.spanHolidays,
//       DailyCollectionReportDaySpanForDay: selectedRow.weekday
//     };
  
//     try {
//       const response = await upsertApplicationSetting(payload); 
  
//       const message = response?.message || 'Record Saved Successfully';
//       setSnackbarMsg(message);
//       setSnackbarSeverity(response?.success ? 'success' : 'error');
  
//       // Redux only for runtime (GuestGuard)
//       if (response?.success) {
//         dispatch(
//           setAppSetting({ otpLoginEnabled: payload.OtpVerification === 1 })
//         );
//         setEditMode(false);
//         setChangesMade(false);
//       }
  
//       setOpenSnackbar(true);
//     } catch (err) {
//       console.error('Save failed', err);
//       setSnackbarMsg('Save failed. Please Fill All Data');
//       setSnackbarSeverity('error');
//       setOpenSnackbar(true);
//     }
//   };
  

//   const handleClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpenCancelDialog(false);
//   };

//   const handleChange = (field, value) => {
//     setSelectedRow((prevRow) => ({
//       ...prevRow,
//       [field]: value
//     }));
//     setChangesMade(true);
//   };

  // const headerStyle = {
  //   fontWeight:800,
  //   fontSize: '11px',
  //   lineHeight: 2.1,
  //   minWidth: 58,
  //   padding: '8px',
  //   textAlign: 'center'
  // };

//   return (
//     <>
//       <MainCard title="Application Setting">
//         <Grid container spacing={2}>
//           <Grid item xs={6} sm={2}>
//             <Stack spacing={1}>
//               <Typography>Payment Start/End:</Typography>
//               <Select
//                 sx={{ width: '150px' }}
//                 value={editMode ? selectedRow?.Status || '' : ''}
//                 onChange={(e) => handleChange('Status', e.target.value)}
//               >
//                 <MenuItem value="Start">Start</MenuItem>
//                 <MenuItem value="End">End</MenuItem>
//               </Select>
//             </Stack>
//           </Grid>
//           <Grid item xs={6} sm={2}>
//             <Stack spacing={1}>
//               <Typography>Turn OTP Mode</Typography>
//               <Select
//                 sx={{ width: '150px' }}
//                 value={editMode ? selectedRow.Otp : ''}
//                 onChange={(e) => handleChange('Otp', e.target.value)}
//               >
//                 <MenuItem value="On">On</MenuItem>
//                 <MenuItem value="Off">Off</MenuItem>
//               </Select>
//             </Stack>
//           </Grid>
//           <Grid item xs={6} sm={2}>
//             <Stack spacing={1}>
//               <Typography>Time Span:</Typography>
//               <TextField
//                 fullWidth
//                 sx={{ width: '150px' }}
//                 value={editMode ? selectedRow?.time || '' : ''} 
//                 onChange={(e) => handleChange('time', e.target.value)}
//               />
//             </Stack>
//           </Grid>
//           <Grid item xs={6} sm={2}>
//             <Stack spacing={1}>
//               <Typography>Day Span:</Typography>
//               <TextField
//                 fullWidth
//                 sx={{ width: '150px' }}
//                 value={editMode ? selectedRow.span : ''}
//                 onChange={(e) => handleChange('span', e.target.value)}
//               />
//             </Stack>
//           </Grid>
//           <Grid item xs={6} sm={2}>
//             <Stack spacing={1}>
//               <Typography>Day Span For Holiday:</Typography>
//               <TextField
//                 fullWidth
//                 sx={{ width: '150px' }}
//                 value={editMode ? selectedRow.spanHolidays : ''}
//                 onChange={(e) => handleChange('spanHolidays', e.target.value)}
//               />
//             </Stack>
//           </Grid>
//           <Grid item xs={6} sm={2}>
//             <Stack spacing={1}>
//               <Typography>Day:</Typography>
//               <TextField
//                 fullWidth
//                 sx={{ width: '150px' }}
//                 value={editMode ? selectedRow.weekday : ''}
//                 onChange={(e) => handleChange('weekday', e.target.value)}
//               />
//             </Stack>
//           </Grid>
//         </Grid>

//         <Grid container spacing={2} justifyContent="center" alignItems="center" marginTop={2}>
//           <Stack direction="row" spacing={2}>
//             <Button variant="contained" color="success" onClick={handleSave}>
//               Save
//             </Button>
//             {/* Snackbar component */}
//             <Snackbar
//   open={openSnackbar}
//   autoHideDuration={6000}
//   onClose={() => setOpenSnackbar(false)}
//   anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
// >
//   <Alert
//     onClose={() => setOpenSnackbar(false)}
//     severity={snackbarSeverity}
//     sx={{ width: '100%', backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red', color: 'white' }}
//   >
//     {snackbarMsg}
//   </Alert>
// </Snackbar>


//             <Button variant="contained" color="warning" onClick={handleEdit}>
//               Cancel
//             </Button>
        
//           </Stack>
//         </Grid>
//       </MainCard>

//       <MainCard>
//         <TableContainer>
//           <Table style={{ width: '100%', overflowX: 'auto' }} >
//           <TableHead>
//   <TableRow>
//     <TableCell align="center" sx={headerStyle}>Edit</TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Daily Payment End Status
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Turn OTP Mode
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Daily Paymen Time
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Daily Payment Span
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Daily Payment Span<br />Holidays
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Day
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Live Payment<br />Active
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Dashboard With<br />Interest
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Online Payment<br />Flag
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       WG More Than<br />Value
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Data Entry Retain<br />Screen
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Mobile<br />Validate
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Special<br />Discount
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Dual Receipt<br />Charge
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Receipt<br />Day
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Dual Receipt<br />Fee
//     </TableCell>

//     <TableCell align="center" sx={headerStyle}>
//       Three Inch<br />Receipt
//     </TableCell>
//   </TableRow>
// </TableHead>


//             {selectedRow ? (
//   <TableBody>
//     <TableRow key={selectedRow.id}>
//       <TableCell>
//         <EditOutlined onClick={handleEdit} style={{ cursor: 'pointer' }} />
//       </TableCell>
//       <TableCell>{selectedRow.Status}</TableCell>
//       <TableCell>{selectedRow.Otp}</TableCell>
//       <TableCell>{selectedRow.time}</TableCell>
//       <TableCell>{selectedRow.span}</TableCell>
//       <TableCell>{selectedRow.spanHolidays}</TableCell>
//       <TableCell>{selectedRow.weekday}</TableCell>
//       <TableCell>{selectedRow.live}</TableCell>
//       <TableCell>{selectedRow.dashbord}</TableCell>
//       <TableCell>{selectedRow.paymentFlag}</TableCell>
//       <TableCell>{selectedRow.wgVal}</TableCell>
//       <TableCell>{selectedRow.dataEntryRetain}</TableCell>
//       <TableCell>{selectedRow.mobileValidate}</TableCell>
//       <TableCell>{selectedRow.specialDiscount}</TableCell>
//       <TableCell>{selectedRow.dualRecCharge}</TableCell>
//       <TableCell>{selectedRow.receiptDay}</TableCell>
//       <TableCell>{selectedRow.dualReceiptFee}</TableCell>
//       <TableCell>{selectedRow.threeReceipt}</TableCell>


//     </TableRow>
//   </TableBody>
// ) : (
//   <TableBody>
//     <TableRow>
//       <TableCell colSpan={5} align="center">Loading...</TableCell>
//     </TableRow>
//   </TableBody>
// )}

//           </Table>
//         </TableContainer>
//       </MainCard>
//     </>
//   );
// }

// export default ApplicationSetting;
import {
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  TextField,
  Select,
  MenuItem,
  TableHead,
  TableCell,
  Table,
  TableRow,
  TableBody,
  TableContainer,
  Snackbar,
  Alert
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setAppSetting } from 'state/reducers/applicationSettingSlice/applictaionSettingSlice';
import { getApplicationSetting, upsertApplicationSetting } from 'services/AdminPanel/applicationSettingService';

function ApplicationSetting() {
  const dispatch = useDispatch();

  const [tableRow, setTableRow] = useState(null); // 🔒 Saved data
  const [editRow, setEditRow] = useState(null);   // ✏️ Editing data
  const [editMode, setEditMode] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const headerStyle = {
    fontWeight:800,
    fontSize: '11px',
    lineHeight: 2.1,
    minWidth: 58,
    padding: '8px',
    textAlign: 'center'
  };
  
  // 🔹 Load data
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await getApplicationSetting();
  
        if (res?.success && res.data) {
          const row = res.data;
  
          setTableRow({
            id: row.AppSettingID,
            Status: row.DailyPaymentEndStatus ? 'End' : 'Start',
            Otp: row.OtpVerification === 1 ? 'On' : 'Off',
            time: row.DailyCollectionReportTimeSpan || '',
            span: row.DailyCollectionReportDaySpan || '',
            spanHolidays: row.DailyCollectionReportDaySpanForH || '',
            weekday: row.DailyCollectionReportDaySpanForDay || '',
            live: row.IsLivePaymentActive === 1 ? 'On' : 'Off',
            dashbord: row.DashbordWithInterest === 1 ? 'On' : 'Off',
            paymentFlag: row.OnlinePaymentPageFlag === 1 ? 'On' : 'Off',
            wgVal: row.IsWGMoreThnVal === 1 ? 'On' : 'Off',
            dataEntryRetain: row.IsDataEntryRetainScreenEnable === 1 ? 'On' : 'Off',
            mobileValidate: row.IsMobileValidate === 1 ? 'On' : 'Off',
            specialDiscount: row.IsSpecialDiscount === 1 ? 'On' : 'Off',
            dualRecCharge: row.DualReceiptCharge === 1 ? 'On' : 'Off',
            receiptDay: row.IsReceiptDay === 1 ? 'On' : 'Off',
            dualReceiptFee: row.DualReceiptFee === 1 ? 'On' : 'Off',
            threeReceipt: row.IsThreeInchReceipt === 1 ? 'On' : 'Off'
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchSetting();
  }, []);
  
  // 🔹 Form change
  const handleChange = (field, value) => {
    setEditRow(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 🔹 Edit toggle
  const handleEdit = () => {
    setEditRow({ ...tableRow }); 
        setEditMode(true);
  };

  // 🔹 Save
  const handleSave = async () => {
    if (!editRow) {
      setSnackbarMsg('No record selected');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
  
    const payload = {
      AppSettingID: editRow.id,
      DailyPaymentEndStatus: editRow.Status === 'End' ? 1 : 0,
      OtpVerification: editRow.Otp === 'On' ? 1 : 0,
      DailyCollectionReportTimeSpan: editRow.time,
      DailyCollectionReportDaySpan: editRow.span,
      DailyCollectionReportDaySpanForH: editRow.spanHolidays,
      DailyCollectionReportDaySpanForDay: editRow.weekday
    };
  
    try {
      const response = await upsertApplicationSetting(payload);
  
      setSnackbarMsg(
        response?.message ||
        (response?.success ? 'Saved Successfully' : 'Save Failed')
      );
  
      setSnackbarSeverity(response?.success ? 'success' : 'error');
      setOpenSnackbar(true);
  
      // ✅ Only after SUCCESS
      if (response?.success) {
        setTableRow(editRow);        
        setEditMode(false);          
  
        // runtime OTP flag
        dispatch(
          setAppSetting({
            otpLoginEnabled: payload.OtpVerification === 1
          })
        );
      }
    } catch (error) {
      console.error('Save error:', error);
  
      setSnackbarMsg(
        error?.response?.data?.message ||
        'Server error. Please try again.'
      );
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  

  return (
    <>
      {/* ================= FORM ================= */}
      <MainCard title="Application Setting">
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Typography>Status</Typography>
            <Select
              fullWidth
              value={editMode ? editRow?.Status : ''}
              disabled={!editMode}
              onChange={(e) => handleChange('Status', e.target.value)}
            >
              <MenuItem value="Start">Start</MenuItem>
              <MenuItem value="End">End</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={2}>
            <Typography>OTP Mode</Typography>
            <Select
              fullWidth
              value={editMode ? editRow?.Otp : ''}
              disabled={!editMode}
              onChange={(e) => handleChange('Otp', e.target.value)}
            >
              <MenuItem value="On">On</MenuItem>
              <MenuItem value="Off">Off</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={2}>
            <Typography>Time Span</Typography>
            <TextField
              fullWidth
              disabled={!editMode}
              value={editMode ? editRow?.time : ''}
              onChange={(e) => handleChange('time', e.target.value)}
            />
          </Grid>

          <Grid item xs={2}>
            <Typography>Day Span</Typography>
            <TextField
              fullWidth
              disabled={!editMode}
              value={editMode ? editRow?.span : ''}
              onChange={(e) => handleChange('span', e.target.value)}
            />
          </Grid>

          <Grid item xs={2}>
            <Typography>Holiday Span</Typography>
            <TextField
              fullWidth
              disabled={!editMode}
              value={editMode ? editRow?.spanHolidays : ''}
              onChange={(e) => handleChange('spanHolidays', e.target.value)}
            />
          </Grid>

          <Grid item xs={2}>
            <Typography>Day</Typography>
            <TextField
              fullWidth
              disabled={!editMode}
              value={editMode ? editRow?.weekday : ''}
              onChange={(e) => handleChange('weekday', e.target.value)}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={2} justifyContent="center">
          <Button variant="contained" color="success" onClick={handleSave} disabled={!editMode}>
            Save
          </Button>
          <Button variant="contained" color="warning" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </Stack>
      </MainCard>

      {/* ================= TABLE ================= */}
      <MainCard>
        <TableContainer>
          <Table>
          <TableHead>
  <TableRow>
    <TableCell align="center" sx={headerStyle}>Edit</TableCell>

    <TableCell align="center" sx={headerStyle}>
      Daily Payment<br />Status
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      OTP<br />Mode
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Time<br />Span
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Day<br />Span
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Holiday<br />Span
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Week<br />Day
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Live<br />Payment
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Dashboard<br />Interest
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Online<br />Payment
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      WG &gt;<br />Value
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Data Entry<br />Retain
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Mobile<br />Validate
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Special<br />Discount
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Dual Receipt<br />Charge
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Receipt<br />Day
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      Dual Receipt<br />Fee
    </TableCell>

    <TableCell align="center" sx={headerStyle}>
      3-Inch<br />Receipt
    </TableCell>
  </TableRow>
</TableHead>

            {tableRow ? (
 <TableBody>
 <TableRow>
 <TableCell align="center">
  {!editMode ? (
    <EditOutlined
      onClick={handleEdit}
      style={{
        cursor: 'pointer',
        color: '#1976d2',
        fontSize: '18px'
      }}
      title="Edit"
    />
  ) : (
    <Stack direction="row" spacing={1} justifyContent="center">
      <SaveOutlined
        onClick={handleSave}
        style={{
          cursor: 'pointer',
          color: 'green',
          fontSize: '18px'
        }}
        title="Save"
      />
      <CloseOutlined
        onClick={handleEdit}
        style={{
          cursor: 'pointer',
          color: 'red',
          fontSize: '18px'
        }}
        title="Cancel"
      />
    </Stack>
  )}
</TableCell>


   <TableCell align="center">{tableRow.Status}</TableCell>
   <TableCell align="center">{tableRow.Otp}</TableCell>
   <TableCell align="center">{tableRow.time}</TableCell>
   <TableCell align="center">{tableRow.span}</TableCell>
   <TableCell align="center">{tableRow.spanHolidays}</TableCell>
   <TableCell align="center">{tableRow.weekday}</TableCell>
   <TableCell align="center">{tableRow.live}</TableCell>
   <TableCell align="center">{tableRow.dashbord}</TableCell>
   <TableCell align="center">{tableRow.paymentFlag}</TableCell>
   <TableCell align="center">{tableRow.wgVal}</TableCell>
   <TableCell align="center">{tableRow.dataEntryRetain}</TableCell>
   <TableCell align="center">{tableRow.mobileValidate}</TableCell>
   <TableCell align="center">{tableRow.specialDiscount}</TableCell>
   <TableCell align="center">{tableRow.dualRecCharge}</TableCell>
   <TableCell align="center">{tableRow.receiptDay}</TableCell>
   <TableCell align="center">{tableRow.dualReceiptFee}</TableCell>
   <TableCell align="center">{tableRow.threeReceipt}</TableCell>
 </TableRow>
</TableBody>

) : (
  <TableBody>
    <TableRow>
      <TableCell colSpan={18} align="center">
        Loading...
      </TableCell>
    </TableRow>
  </TableBody>
)}

          </Table>
        </TableContainer>
      </MainCard>

      <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    onClose={() => setOpenSnackbar(false)}
    severity={snackbarSeverity}
    sx={{ width: '100%', backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red', color: 'white' }}
  >
    {snackbarMsg}
  </Alert>
</Snackbar>
    </>
  );
}

export default ApplicationSetting;
