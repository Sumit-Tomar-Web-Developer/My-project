import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from '../../Providers/ToastProvider';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

import { getOTPApi, resetPasswordApi } from '../../AppApis/ApiFunctions';
import { PASS_PATTERN } from '../../Utils/Constants';
import CustomButton from '../../Components/Common/CustomButton';


export default function ResetPassword() {
  const navigate = useNavigate();
  const { toastMessage } = useToast();

  const [loading, setLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false)
  const [errorTexts, setErrorTexts] = useState({
    userID: '',
    otp: '',
    password: ''
  });

  const validateInputs = (userData) => {
    let is_valid = true;
    let errors = {
      userID: '',
      password: '',
      otp: ''
    };

    if (userData.userID === "") {
      errors.userID = 'User ID is required';
      is_valid = false;
    }

    if (isOTPSent) {
      if (userData.password === "") {
        errors.password = 'Password is required';
        is_valid = false
      }
      else {
        if (!PASS_PATTERN.test(userData.password)) {
          errors.password = 'Password must be 8 to 12 character long and contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character(@$!%*?&)';
          is_valid = false;
        }
      }

      if (userData.otp === "") {
        errors.otp = 'OTP is required';
        is_valid = false
      }
    }

    setErrorTexts(errors);
    return is_valid;
  }

  const resetPasswordApiCall = (userData) => {
    setLoading(true);
    resetPasswordApi(userData).then((res) => {
      if (res.data) {
        if (res.data.is_success) {
          toastMessage.success(res.data.message);
          navigate("/signin");
        }
        else {
          toastMessage.error(res.data.message);
        }
      }
      else {
        toastMessage.error("Password Reset Failed!!");
      }
    }).catch((error) => {
      console.log(error);
      toastMessage.error("Password Reset Failed!!");
    }).finally(() => {
      setIsOTPSent(false);
      setLoading(false);
    })
  }


  const getOTPApiCall = (userData) => {
    getOTPApi(userData).then((res) => {
      if (res.data) {
        if (res.data.is_success) {
          toastMessage.success(res.data.message);
          setIsOTPSent(true);
        }
        else {
          toastMessage.error(res.data.message);
        }
      }
      else {
        toastMessage.error("OTP generation Failed!!");
      }
    }).catch((error) => {
      console.log(error);
      toastMessage.error("OTP generation Failed!!");
    })
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let userData = {};
    userData.userID = data.get('userID').trim();
    if (isOTPSent) {
      userData.otp = data.get('otp').trim();
      userData.password = data.get('password').trim();
    }
    console.log(userData);
    if (validateInputs(userData)) {
      if (isOTPSent) {
        resetPasswordApiCall(userData)
      }
      else {
        getOTPApiCall(userData);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userID"
            label="User ID"
            name="userID"
            autoComplete="userID"
            autoFocus
            error={errorTexts.userID !== ''}
            helperText={errorTexts.userID}
          />
          {isOTPSent &&
            <TextField
              margin="normal"
              required
              fullWidth
              name="otp"
              label="Enter OTP"
              type="number"
              id="otp"
              error={errorTexts.otp !== ''}
              helperText={errorTexts.otp}
            />}
          {isOTPSent &&
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              error={errorTexts.password !== ''}
              helperText={errorTexts.password}
            />}
          <CustomButton
            loading={loading}
            type="submit"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            {isOTPSent ? "Change Password" : "Get OTP"}
          </CustomButton>
          <Grid container>
            <Grid item xs>
              <Link onClick={() => setIsOTPSent(!isOTPSent)} variant="body2">
                {isOTPSent ? "Do not have OTP?" : "Already have OTP?"}
              </Link>
            </Grid>
            <Grid item>
              <Link href="\signin" variant="body2">
                Want to Sign in?
              </Link>
            </Grid>
          </Grid>

        </Box>
      </Box>
    </Container>
  );
}