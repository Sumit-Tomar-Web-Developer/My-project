import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { signInUserApi } from '../../AppApis/ApiFunctions';
import { userDataFormat } from '../../Utils/UtilityFunctions';
import CustomButton from '../../Components/Common/CustomButton';
import { API_STATUS } from '../../Utils/Constants';
import { useToast } from '../../Providers/ToastProvider';
import { useAuth } from '../../Providers/AuthProvider';


export default function SignIn() {
  const navigate = useNavigate();
  const { toastMessage } = useToast();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorTexts, setErrorTexts] = useState({
    userId: '',
    password: ''
  });

  const validateInputs = (signInData) => {
    let is_valid = true;
    let errors = {
      userId: '',
      password: ''
    };
    if (signInData.userId === "") {
      errors.userId = 'User ID is required';
      is_valid = false;
    }
    if (signInData.password === "") {
      errors.password = 'Password is required';
      is_valid = false
    }
    setErrorTexts(errors);
    return is_valid;
  }

  const signInApiCall = (signInData) => {
    setLoading(true);
    signInUserApi(signInData).then((res) => {
      if (res.data) {
        if (res.data.type == API_STATUS.SUCCESS) {
          toastMessage.success(res.data.message);
          let resData = res.data.data;
          let userData = userDataFormat(resData.id, resData.name, resData.role, resData.department,
            resData.departmentName, resData.token)
          login(userData);
          navigate('/dashboard');
        }
        else {
          toastMessage.error(res.data.message);
        }
      }
      else {
        toastMessage.error("Sign In Failed!!");
      }
    }).catch((error) => {
      console.log(error);
      toastMessage.error("Sign In Failed!!");
    }).finally(() => {
      setLoading(false);
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const signInData = {
      userId: data.get('userId').trim(),
      password: data.get('password').trim(),
    }
    if (validateInputs(signInData)) {
      signInApiCall(signInData);
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id="userId"
            label="User ID"
            name="userId"
            autoComplete="userId"
            error={errorTexts.userId !== ''}
            helperText={errorTexts.userId}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={errorTexts.password !== ''}
            helperText={errorTexts.password}
          />
          <CustomButton
            loading={loading}
            type="submit"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Sign In
          </CustomButton>
          {/* <Grid container>
            <Grid xs>
              <Link href="\reset_password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Grid> */}
        </Box>
      </Box>
    </Container>
  );
}
