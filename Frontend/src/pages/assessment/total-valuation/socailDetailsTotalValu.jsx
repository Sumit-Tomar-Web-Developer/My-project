import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    InputLabel,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
  } from '@mui/material';
  import MainCard from 'components/MainCard';
  

  function SocialDetailsTotalValuation() {
    return (
      <MainCard  sx={{ background: '#e3f2fd' }}>
        <MainCard title="Apply Taxes">
    <Grid container spacing={0.2} mt={1}  justifyContent="center">
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Property</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Education</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tree</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Employment</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sp.Edu</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Fire</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Road</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Light</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sewage</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Saniation</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Drain</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Cess</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
</Grid>
<Grid container spacing={0.2} mt={1}  justifyContent="center">
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Cess</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Benfits</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>M.Build</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Bill</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax1</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax2</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax3</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax4</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax5</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Is Tax For Plot</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1.3}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Is Policy Applicable</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item >
          <Stack  spacing={1} mt={3.8}>
            <Button
              variant="contained"
              color="success"
              sx={{ padding: '7px' }}
            >
              Ok
            </Button>
          </Stack>
        </Grid>
</Grid>
</MainCard>   
<MainCard title="Taxes Percentage">
    <Grid container spacing={0.2} justifyContent="center">
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Property</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Education</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tree</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Employment</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sp.Edu</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Fire</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Road</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Light</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sewage</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Saniation</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>

</Grid>
<Grid container spacing={0.2} mt={1}  justifyContent="center">
<Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Drain</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
 <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Cess</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Benfits</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>M.Build</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Bill</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax1</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax2</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax3</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax4</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  <Grid item xs={12} sm={1}>
    <Stack spacing={1}>
      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax5</InputLabel>
      <TextField required fullWidth />
    </Stack>
  </Grid>
  
 
</Grid>
</MainCard>   
      </MainCard>
    );
  }
  
  export default SocialDetailsTotalValuation;