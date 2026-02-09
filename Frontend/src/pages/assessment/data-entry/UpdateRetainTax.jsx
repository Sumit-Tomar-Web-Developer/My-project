import { Grid, Stack, Button, InputLabel, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UpdateRetainTax = () => {
  const navigate = useNavigate();

  const handleKeyDownSocial = (event) => {
    if (event.key === 'Escape') {
      navigate('/assessment/data-entry');
    } else if (event.key === 'backspace') {
      navigate('false');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownSocial);

    return () => {
      window.removeEventListener('keydown', handleKeyDownSocial);
    };
  });
  return (
    <MainCard title="Update Retain Taxes">
      <Grid container spacing={1}>
        <Grid item xs={12} sm={0.6} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>RV</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Property</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Edu.</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Spl Edu.</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Emp</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Tree</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Fire</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Light</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Drain</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Road</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.9} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Sanitation</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>W.Cess</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>W.Bill</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>M.Build</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Sewage</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Tax1</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={0.7} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel>Total Tax</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" mt={2}>
        <Grid item xs={12} sm={1}>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Button variant="contained" color="success">
              Save
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default UpdateRetainTax;
