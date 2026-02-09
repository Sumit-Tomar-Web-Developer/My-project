import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { resendOtpService, sendOtpService, verifyOtpService } from 'services/AdminPanel/applicationSettingService';

const AuthOtpVerify = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // email & first login flag
  const [otp, setOtp] = useState('');

  // 🔒 Protect OTP page
  useEffect(() => {
    if (!state?.identifier || localStorage.getItem('otpPending') !== 'true') {
      navigate('/login', { replace: true });
    }
  }, [state, navigate]);
  const handleSubmit = async () => {
    try {
      const data = await verifyOtpService(state.identifier, otp); // email + user-entered OTP
  
      if (data.success) {
        localStorage.removeItem('otpPending'); 
  
        if (state?.isfirstlogin) {
          navigate('/reset-password', { replace: true });
        } else {
          navigate('/assessment/data-entry', { replace: true });
        }
      } else {
        alert(data.message); 
      }
    } catch (err) {
      alert('Failed to verify OTP');
    }
  };
  // const handleSubmit = () => {
  //   // ✅ Assume OTP verified successfully

  //   localStorage.removeItem('otpPending'); // OTP completed

  //   if (state?.isfirstlogin) {
  //     navigate('/reset-password', { replace: true });
  //   } else {
  //     navigate('/assessment/data-entry', { replace: true });
  //   }
  // };
  // const handleResend = async () => {
  //   try {
  //     // 🔹 Call resend OTP API
  //     await fetcher.post('/auth/resend-otp', { email: state.email });
      
  //     // Optional: success message
  //     alert('OTP has been resent to your email.');
  
  //     // Reset OTP field
  //     setOtp('');
  //   } catch (err) {
  //     console.error('Resend OTP failed:', err);
  //     alert('Failed to resend OTP, try again.');
  //   }
  // };
  const handleResend = async () => {
    try {
      const data = await resendOtpService(state.identifier);
  
      if (data.success) {
        alert('OTP has been resent to your email');
        setOtp('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to resend OTP');
    }
  };
  if (!state?.identifier) return null;

  return (
    <Grid
    container
    justifyContent="center"
    alignItems="center"
    sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}
  >
    <Grid item xs={11} sm={6} md={4}>
      <Card elevation={6}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h3" align="center"  sx={{ 
    color: '#1DA1F2',     
    fontWeight: 'bold', 
    mb: 2 
  }}>
              OTP Verification
            </Typography>
  
            <Typography
  variant="h5"
  align="left"
  sx={{
    color: '#0D1B2A',
    fontWeight: 500,
    mb: 1,
  }}
>
  Your  OTP {' '}
  <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
   (One Time Password)
  </span>{' '}
  has been sent to your registered Email ID
</Typography>

  
            <Typography variant="h5" align="left" ml={1}  sx={{ 
    
    fontWeight: 400 
  }}>
  OTP sent to <b>{state.identifier}</b>
            </Typography>
  
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              inputProps={{ maxLength: 5 }}
            />
  
            {/* Inline Buttons */}
            <Stack direction="row"  justifyContent="left" >
              <Button
                variant="text"
                color="primary"
                onClick={handleResend}
                sx={{ 
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#115293' }, minWidth: 100 }}
              >
                Resend
              </Button>
  
              <Button
                variant="contained"
                color="primary"
                disabled={otp.length < 4}
                onClick={handleSubmit}
                sx={{  color: '#fff',
                fontWeight: 'bold',
                backgroundColor: '#1976d2', 
                '&:hover': { backgroundColor: '#115293' },minWidth: 100 }}
              >
Submit              </Button>
  
<Button
  variant="text"   
  color="error"
  onClick={() => navigate('/login', { replace: true })}
  sx={{
    fontWeight: 'bold',
    minWidth: 100,
    '&:hover': { backgroundColor: '#d32f2f' } // darken on hover
  }}
>
  Cancel
</Button>

            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="center">
          <Typography
  variant="h5"
  align="left"
  sx={{
    color: '#0D1B2A',
    fontWeight: 500,
  
    mt:4
  }}
>
  For any queries contact us on Toll Free No. {' '}
  <span
    style={{
      fontWeight: 'bold',
      textDecoration: 'underline',
      color: '#1976d2', 
    }}
  >   1800-123-5670
  </span>{' '}
</Typography>
</Stack>
<Stack direction="row" spacing={2} justifyContent="center">
          <Typography
  variant="h5"
  align="left"
  sx={{
    color: '#0D1B2A',
    fontWeight: 500,
    mb: 1,
    mt:3
  }}
>
  @ Core Project Engineers and Consultants Pvt.Ltd. Amaravati
  
</Typography>
</Stack>

        </CardContent>
      </Card>
    </Grid>
  </Grid>
  
  );
};

export default AuthOtpVerify;
