// material-ui
import { Grid, InputLabel, Stack, TextField, Box, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import Footer from 'components/footer/footer';

// ==============================|| Employee Master PAGE ||============================== //

function EmployeeMaster({ employeeMaster }) {
  return (
    <MainCard title=" Employee Master">
      <MainCard>
        <Grid container spacing={4} justifyContent={'center'} alignItems={'center'}>
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Employee Name</InputLabel>
              <TextField required />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>City</InputLabel>
              <TextField required />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Address</InputLabel>
              <TextField required />
            </Stack>
          </Grid>
        </Grid>
      </MainCard>

      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Table style={{ width: '750px', overflowX: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell>EmpName</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              <TableRow>
                <TableCell>Shri. Vilas Shendre</TableCell>
                <TableCell>Chandrapur </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Shri. Bharat Rajput</TableCell>
                <TableCell>Chandrapur </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Shri. Sudharkar Patil</TableCell>
                <TableCell>Chandrapur </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Shri. R. Patil</TableCell>
                <TableCell>Chandrapur </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </MainCard>
      <Grid>
        <MainCard>
          <Footer employeeMaster={employeeMaster} />
        </MainCard>
      </Grid>
    </MainCard>
  );
}

export default EmployeeMaster;
