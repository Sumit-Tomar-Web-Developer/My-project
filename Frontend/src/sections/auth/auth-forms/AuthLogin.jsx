
  import PropTypes from 'prop-types';
  import React, { useEffect } from 'react';
  import { Link as RouterLink } from 'react-router-dom';

  // material-ui
  import {
    Button,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
  } from '@mui/material';

  // third party
  import * as Yup from 'yup';
  import { Formik } from 'formik';
  import { preload } from 'swr';

  // project import
  import useAuth from 'hooks/useAuth';
  import useScriptRef from 'hooks/useScriptRef';
  import IconButton from 'components/@extended/IconButton';
  import AnimateButton from 'components/@extended/AnimateButton';
  import { fetcher } from 'utils/axios';
  import { useNavigate } from 'react-router-dom';
  import { useState } from 'react';

  // assets
  import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
  import { replace } from 'lodash';

  import { useDispatch, useSelector } from 'react-redux';
  import { setAppSetting } from 'state/reducers/applicationSettingSlice/applictaionSettingSlice';
  import config from 'config';
  import { sendOtpService } from 'services/AdminPanel/applicationSettingService';


  // ============================|| JWT - LOGIN ||============================ //

  const AuthLogin = ({ isDemo = false }) => {
    const [checked, setChecked] = React.useState(false);
    const [firstLogin, setFirstLogin] = useState(false);
    const { login, isLoggedIn } = useAuth();
    const scriptedRef = useScriptRef();
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    
    const { otpLoginEnabled } = useSelector((state) => state.appSetting); 


  
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };


    return (
      <>
        <Formik
          initialValues={
            {
              identifier: '',   
    password: '',
    submit: null
            }
          }

    validationSchema={Yup.object().shape({
    identifier: Yup.string().required('Email or Username is required'),
    password: Yup.string().required('Password is required')
  })}
  
//   onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//   try {
//     const data = await login({
//       identifier: values.identifier,
//       password: values.password
//     });

//     console.log(data, "data for login user");

//     if (data?.error || !data?.token) {
//       setStatus({ success: false });
//       setErrors({ submit: data?.error || 'Invalid login' });
//       setSubmitting(false);
//       return;
//     }

//     // 🔹 Save token
//     localStorage.setItem('serviceToken', data.token);

//     // 🔹 First login flag
//     const isFirstLogin = data.user?.isfirstlogin;

//     // 1️⃣ FIRST LOGIN → RESET PASSWORD (NO OTP YET)
//     if (isFirstLogin === true) {
//       localStorage.removeItem('otpPending');
//       navigate('/reset-password');
//       return;
//     }

//     // 2️⃣ OTP LOGIN ENABLED → SEND OTP
//     if (otpLoginEnabled === true) {
//       try {
//         const otpResponse = await sendOtpService(values.identifier, values.password);

//         if (otpResponse.success) {
//           localStorage.setItem('otpPending', 'true');
//           navigate('/otp', {
//             state: { identifier: values.identifier, isfirstlogin: false }
//           });
//           return;
//         } else {
//           setErrors({ submit: otpResponse.message });
//           setSubmitting(false);
//           return;
//         }
//       } catch (err) {
//         console.error('OTP send failed:', err);
//         setErrors({ submit: 'Failed to send OTP' });
//         setSubmitting(false);
//         return;
//       }
//     }

//     // 3️⃣ NORMAL LOGIN → DATA ENTRY
//     localStorage.removeItem('otpPending');
//     navigate('/assessment/data-entry');

//   } catch (err) {
//     setStatus({ success: false });
//     setErrors({ submit: err.message || 'Unexpected error' });
//     setSubmitting(false);
//   }
// }}

onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
  console.log("🔵 AUTH LOGIN → SUBMIT");
  console.log("identifier =", values.identifier);
  console.log("password =", values.password);

  try {
    const data = await login({
      identifier: values.identifier,
      password: values.password
    });

    console.log("🟢 LOGIN RESPONSE =", data);

    if (data?.error || !data?.token) {
      console.log("🔴 LOGIN FAILED", data?.error);
      setStatus({ success: false });
      setErrors({ submit: data?.error || 'Invalid login' });
      setSubmitting(false);
      return;
    }

    // Save token
    localStorage.setItem('serviceToken', data.token);
    console.log("💾 TOKEN SAVED");

    const isFirstLogin = data.user?.isfirstlogin;
    console.log("⚠️ isfirstlogin =", isFirstLogin);

    // FIRST LOGIN
    if (isFirstLogin === true) {
      console.log("➡️ Redirecting to RESET PASSWORD");
      localStorage.removeItem('otpPending');
      navigate('/reset-password');
      return;
    }

    // OTP LOGIN CASE
    console.log("⚙️ otpLoginEnabled =", otpLoginEnabled);

    if (otpLoginEnabled === true) {
      console.log("📨 SENDING OTP...");

      try {
        const otpResponse = await sendOtpService(values.identifier, values.password);
        console.log("📩 OTP RESPONSE =", otpResponse);

        if (otpResponse.success) {
          console.log("✅ OTP SENT — setting otpPending=true");
          localStorage.setItem('otpPending', 'true');

          navigate('/otp', {
            state: { identifier: values.identifier, isfirstlogin: false }
          });

          return;
        } else {
          console.log("❌ OTP FAILED =", otpResponse.message);
          setErrors({ submit: otpResponse.message });
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.log("🔥 OTP ERROR =", err);
        setErrors({ submit: 'Failed to send OTP' });
        setSubmitting(false);
        return;
      }
    }

    // NORMAL LOGIN
    console.log("➡️ NORMAL LOGIN — redirecting to data entry");
    localStorage.removeItem('otpPending');
    navigate('/assessment/data-entry');

  } catch (err) {
    console.log("💥 LOGIN CRASH", err);
    setStatus({ success: false });
    setErrors({ submit: err.message || 'Unexpected error' });
    setSubmitting(false);
  }
}}


        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-login">Email Address</InputLabel>
                    {/* <OutlinedInput
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter EmailID or Username "
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                    /> */}
                    <OutlinedInput
    id="identifier-login"
    type="text"
    value={values.identifier}
    name="identifier"
    onBlur={handleBlur}
    onChange={handleChange}
    placeholder="Enter Email or Username"
    fullWidth
    error={Boolean(touched.identifier && errors.identifier)}
  />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-login">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="-password-login"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
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
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sx={{ mt: -1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(event) => setChecked(event.target.checked)}
                          name="checked"
                          color="primary"
                          size="small"
                        />
                      }
                      label={<Typography variant="h6">Keep me sign in</Typography>}
                    />
                    <Link variant="h6" component={RouterLink} to={isDemo ? '/auth/forgot-password' : '/forgot-password'} color="text.primary">
                      Forgot Password?
                    </Link>
                  </Stack>
                </Grid>
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                      Login
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </>
    );
  };

  AuthLogin.propTypes = {
    isDemo: PropTypes.bool
  };

  export default AuthLogin;