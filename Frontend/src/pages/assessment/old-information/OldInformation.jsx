// material-ui
import { Button, Grid, InputLabel, Stack, TextField, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function createData(name, designation, product, date, badgeText, badgeType) {
  return { name, designation, product, date, badgeText, badgeType };
}

const rows = [
  createData('Materially', 'Powerful Admin Theme', '16,300', '$53', '$15,652'),
  createData('Photoshop', 'Design Software', '26,421', '$35', '$8,785')
];

function OldInformation() {
  return (
    <MainCard title="Old Floor Information">
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Zone No:</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Ward No:</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Property No:</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Parti No:</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>CSN No:</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Plot No:</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={0.5}>
        <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Floor</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Year</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Construction Type</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Type of Use</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Carpet SqFt</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Carpet SqMtr</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Registration</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
          <Grid item>
            <Button variant="contained" color="success">
              ADD
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <TableContainer style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>Application</TableCell>
              <TableCell align="right">Sales</TableCell>
              <TableCell align="right">Avg. Price</TableCell>
              <TableCell align="right" sx={{ pr: 3 }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover key={index}>
                <TableCell sx={{ pl: 3 }}>
                  <Typography align="left" variant="subtitle1">
                    {row.name}
                  </Typography>
                  <Typography align="left" variant="caption" color="secondary">
                    {row.designation}
                  </Typography>
                </TableCell>
                <TableCell align="right">{row.product}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  <span>{row.badgeText}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
    <Grid mt={2}>
      <MainCard>
        <Typography variant="h5" gutterBottom sx={{ mt: 2.5, mb: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
          Old Taxation Details:
        </Typography>
        <Grid container spacing={3} mt={0.5}>
          <Grid item xs={12} sm={1.5} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>RV</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>ALV</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>PropTax</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>TotTax</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Const. Area SqFt</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Plot Area SqFt</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Toilet No</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Rooms</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
            <Grid item>
              <Button variant="contained">OK</Button>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>
    </Grid>
    <Grid sx={{ mt: 2 }}>
      <MainCard>
        <Typography variant="h5" gutterBottom sx={{ mt: 1.5, mb: 2, ml: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
          Old Taxes:
        </Typography>
        <TableContainer style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Application</TableCell>
                <TableCell align="right">Sales</TableCell>
                <TableCell align="right">Avg. Price</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell sx={{ pl: 3 }}>
                    <Typography align="left" variant="subtitle1">
                      {row.name}
                    </Typography>
                    <Typography align="left" variant="caption" color="secondary">
                      {row.designation}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{row.product}</TableCell>
                  <TableCell align="right">{row.date}</TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <span>{row.badgeText}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </Grid>
    <Grid sx={{ mt: 2 }}>
      <MainCard>
        <Typography variant="h5" gutterBottom sx={{ mt: 1.5, mb: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
          Pending Taxes:
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={1.4} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Year</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Prop</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Edu</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sp. Edu</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Emp</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tree</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Fire</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Light</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Drain</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Road</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.2} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sanitation</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W. Cess</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W. Ben</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W. Bill</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>M. Build</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>M. Build</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sewage</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax 1</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax Total</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Interest</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.3} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Total</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.7} style={{ textAlign: 'center' }}>
            <Stack spacing={1}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Remark</InputLabel>
              <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
            </Stack>
          </Grid>
          <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
            <Grid item>
              <Button variant="contained" color="success">
                ADD
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <TableContainer style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Application</TableCell>
                <TableCell align="right">Sales</TableCell>
                <TableCell align="right">Avg. Price</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell sx={{ pl: 3 }}>
                    <Typography align="left" variant="subtitle1">
                      {row.name}
                    </Typography>
                    <Typography align="left" variant="caption" color="secondary">
                      {row.designation}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{row.product}</TableCell>
                  <TableCell align="right">{row.date}</TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <span>{row.badgeText}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </Grid>
  </MainCard>
  );
}

export default OldInformation;
