import { Grid, InputLabel, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Typography, Button } from '@mui/material';
import MainCard from 'components/MainCard';

function PropertyTypeTax() {
  return (
    <MainCard title="Property Type Tax Rate">
      <Grid display={'flex'} justifyContent={'center'} mt={3}>
        <Grid item xs={3} mt={1}>
          <InputLabel sx={{ fontWeight: 'bolder' }}>Property Description</InputLabel>
        </Grid>
        <Grid item xs={1} ml={2}>
         <Select sx={{minWidth:"12vw"}}></Select>
        </Grid>
        <Grid item xs={3} ml={3} mt={1}>
          <InputLabel sx={{ fontWeight: 'bolder' }}>Rate</InputLabel>
        </Grid>
        <Grid item xs={3} ml={2}>
          <TextField></TextField>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
        <Grid item>
          <Button variant="contained" color="success">
            Save
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary">
            Clear
          </Button>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}></Grid>
      <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
        Rate List:
      </Typography>
      <TableContainer sx={{ mt: 3 ,overflow: 'auto'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow  sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
              <TableCell sx={{ pl: 3 }}>Property Description</TableCell>
              <TableCell >Type Description</TableCell>
              <TableCell >Tax</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

export default PropertyTypeTax;
