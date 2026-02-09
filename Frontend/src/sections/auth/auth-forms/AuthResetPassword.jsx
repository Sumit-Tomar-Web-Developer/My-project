import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { openSnackbar } from 'api/snackbar';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { resetPassword } from 'services/AuthService/authService';
import { sendOtpService } from 'services/AdminPanel/applicationSettingService';
import { useSelector } from 'react-redux';

// ============================|| STATIC - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  const identifier = localStorage.getItem('resetIdentifier');

  console.log(identifier,"last used email or username")


  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const otpLoginEnabled = useSelector(
  (state) => state.appSetting?.otpLoginEnabled
);

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string().max(255).required('Password is required'),
        confirmPassword: Yup.string()
          .required('Confirm Password is required')
          .test('confirmPassword', 'Both Password must be match!', (confirmPassword, yup) => yup.parent.password === confirmPassword)
      })}

// onSubmit={async (values, { setSubmitting, setErrors }) => {
//   try {
//     const data = await resetPassword({
//       identifier,
//       newPassword: values.password
//     });

//     console.log(data,"data to be resrt")
//     // Save token & user
//     localStorage.setItem('serviceToken', data.token);
   
//     // 🔹 Trigger OTP step
//     localStorage.setItem('otpPending', 'true');
//     // 🔹 Redirect to OTP page
//     navigate('/otp', {
//       replace: true,
//       state: { identifier, isfirstlogin: false }
//     });

//        // 1️⃣ SEND OTP HERE
//     const otpResult = await sendOtpService(identifier, values.password);
//      if (!otpResult?.success) {
//       setErrors({ submit: otpResult?.message || 'Failed to send OTP' });
//       return;
//     }
//   } catch (err) {
//     setErrors({ submit: err.response?.data?.error || 'Reset failed' });
//   } finally {
//     setSubmitting(false);
//   }
// }}

onSubmit={async (values, { setSubmitting, setErrors }) => {
  try {
    const data = await resetPassword({
      identifier,
      newPassword: values.password
    });

    localStorage.setItem('serviceToken', data.token);

    if (otpLoginEnabled) {
      // enable OTP ONLY IF feature ON
      localStorage.setItem('otpPending', 'true');

      await sendOtpService(identifier, values.password);

      navigate('/otp', {
        replace: true,
        state: { identifier, isfirstlogin: false }
      });

      return;
    }

    // otherwise → normal login flow
    localStorage.removeItem('otpPending');
    navigate('/assessment/data-entry');

  } catch (err) {
    setErrors({ submit: err.response?.data?.error || 'Reset failed' });
  } finally {
    setSubmitting(false);
  }
}}


    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-reset">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-reset"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error id="helper-text-password-reset">
                  {errors.password}
                </FormHelperText>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirm-password-reset">Confirm Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  id="confirm-password-reset"
                  type="password"
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter confirm password"
                />
              </Stack>
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="helper-text-confirm-password-reset">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Reset Password
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthResetPassword;
