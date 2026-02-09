import React from 'react';
import { Typography, Box, Card, CardContent, Table, TableHead, Button, TableBody, TableRow, TableCell, Grid } from '@mui/material';
import { CSVExport } from 'components/third-party/react-table';
import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import { getPropertiesForAdvanceDeduction } from 'services/utlilityService/AddTaxService/AddTaxService'
import { useEffect } from 'react';

// import PaymentAdvance from './PaymentAdvance'

//payment

// eslint-disable-next-line react/prop-types
function PaymentAdvance({ PaymentAdvance, selectWards, financialYear }) {
  console.log(selectWards, financialYear, 'selectWards, financialYear');

  const headers = [
    { label: 'New Ward No', key: 'NewWardNo' },
    { label: 'New Property No', key: 'NewPropertyNo' },
    { label: 'New Partition No', key: 'NewPartitionNo' }
  ];


  const [dataForAdvance, setDataForAdvance] = React.useState([]);
  const [dataForMisCellaneous, setDataForMisCellaneous] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPropertiesForAdvanceDeduction(selectWards, financialYear);
        setDataForAdvance(response.response.data[0] || []);
        setDataForMisCellaneous(response.response.data[1] || []);
      } catch (error) {
        console.error('Error Properties for Advance Deduction :', error);
      }
    }
    fetchData();

  }, [selectWards, financialYear]);

  return (
    <MainCard title="Properties For Advance Deduction">
      <div className="card" style={{ marginTop: '6px' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
              No. of Properties Having Advance Amount: 0
            </Typography>
            <Grid sx={{ marginLeft: '65vw' }}>
              <CSVExport data={dataForAdvance} headers={headers} filename="add-Taxes.csv" />
            </Grid>
            <Box sx={{ overflowX: 'auto', height: '300px' ,overflowY: 'auto'}}>
              {/* Table */}
              <Table>
                {/* Table Header */}
                <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                  <TableRow>
                    <TableCell>New Ward No</TableCell>
                    <TableCell>New Property No</TableCell>
                    <TableCell>New Partition No</TableCell>
                  </TableRow>
                </TableHead>
                {/* Table Body */}
                <TableBody>
                  {dataForAdvance.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.NewWardNo}</TableCell>
                      <TableCell>{row.NewPropertyNo}</TableCell>
                      <TableCell>{row.NewPartitionNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* //2nd table  */}
      <div className="card" style={{ marginTop: '20px' }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
              No. of Properties Having MisCellaneous Amount: 0
            </Typography>
            <Grid sx={{ marginLeft: '65vw' }}>
              <CSVExport data={dataForMisCellaneous} headers={headers} filename="add-Taxes.csv" />
            </Grid>
            <Box sx={{ overflowX: 'auto', height: '300px' }}>
              {/* Table */}
              <Table>
                {/* Table Header */}
                <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                  <TableRow>
                    <TableCell>New Ward No</TableCell>
                    <TableCell>New Property No</TableCell>
                    <TableCell>New Partition No</TableCell>
                  </TableRow>
                </TableHead>
                {/* Table Body */}
                <TableBody>
                  {dataForMisCellaneous.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.NewWardNo}</TableCell>
                      <TableCell>{row.NewPropertyNo}</TableCell>
                      <TableCell>{row.NewPartitionNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Grid container justifyContent="center" mt={2}>
              <Grid item xs={12} sm={3}>
                <Box display="flex" justifyContent="center">
                  <Button variant="contained" color="success" size="small" onClick={PaymentAdvance}>
                    Okay
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </MainCard>
  );
}

export default PaymentAdvance;
