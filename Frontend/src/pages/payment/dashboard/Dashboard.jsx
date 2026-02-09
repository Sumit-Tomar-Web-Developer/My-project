// material-ui
import { Breadcrumbs, Button, Grid, InputLabel, Link, Select, Stack, Typography, Box } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import EcommerceMetrix from 'components/cards/statistics/EcommerceMetrix';
import IncomeAreaChart from 'sections/dashboard/analytics/IncomeChart';

import HomeFilled from '@ant-design/icons/HomeFilled';
import AuditOutlined from '@ant-design/icons/AuditOutlined';
import FundFilled from '@ant-design/icons/FundFilled';
import UserCountCard from 'components/cards/statistics/UserCountCard';
import ApexBarChart from 'sections/charts/apexchart/ApexBarChart';
import Chip from '@mui/material/Chip';

import ContactsOutlined from '@ant-design/icons/ContactsOutlined';

import FileProtectOutlined from '@ant-design/icons/FileProtectOutlined';

import RedditOutlined from '@ant-design/icons/RedditOutlined';
// material-ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// project imports
import SimpleBar from 'components/third-party/SimpleBar';
import { useState } from 'react';

// table data
const createData = (sales, product, price, colorClass ,newclass = '') => ({ sales, product, price, colorClass, newclass });

const rows = [createData('Wadh Ghat Remark', '0', '0','0'), createData('Mutation', '0', '0','0')];

function Dashboard() {
  const [showTrend, setShowTrend] = useState(false);
  const [slot, setSlot] = useState('week');

  const handleShowTrend = () => {
    setShowTrend(!showTrend);
  };
  return (
    <>
      <Grid display={'flex'} justifyContent={'space-between'}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary" sx={{ fontWeight: 'bolder', fontSize: '1.5rem' }}>
            Home
          </Typography>

          <Typography color="text.primary" sx={{ fontSize: '1.5rem' }}>
            Summary of आरमोरी{' '}
          </Typography>
        </Breadcrumbs>
        <Button variant="dashed" color={showTrend ? 'warning' : 'error'} sx={{ mb: '2vh', fontWeight: 'bolder' }} onClick={handleShowTrend}>
          {showTrend ? 'SHOW TREND' : 'HIDE TREND'}
        </Button>
      </Grid>
      {showTrend ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4} sm={6}>
              <EcommerceMetrix primary="Total Properties" secondary="14870" color="primary.dark" iconPrimary={HomeFilled} />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <EcommerceMetrix primary="Tax Payer / Defaulter" secondary="0/14870" color="warning.dark" iconPrimary={AuditOutlined} />
            </Grid>
            <Grid item xs={12} lg={4} sm={12}>
              <EcommerceMetrix primary="Todays Receipt/Cancel Receipt" secondary="97/120" c color="success.dark" iconPrimary={FundFilled} />
            </Grid>

            <Grid item xs={12} lg={12} sm={6}>
              <MainCard title="Todays Collection Info" subheader="04/04/2024">
                <ApexBarChart />
                <Grid style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                  <Chip color="success" label="Total Collection : 10000 " size="large" />
                  <Chip color="secondary" label="No. Of. DD Collected : 10 " size="large" />

                  <Chip color="info" label="No. Of. Cheque Collected : 9" size="large" />
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} lg={12} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h3" style={{ color: 'black', fontWeight: 'bold' }}>
                Demand / Balance Info
              </Typography>
            </Grid>

            <Grid item xs={12} lg={2.4}>
              <UserCountCard primary="Current Demand" secondary=" 6.07 cr. / 6.07 cr. " color="success.light" />
            </Grid>
            <Grid item xs={12} lg={2.4} sm={6}>
              <UserCountCard primary="Current Interest Demand " secondary=" 1.2 cr. / 2.0 cr." color="secondary.dark" />
            </Grid>
            <Grid item xs={12} lg={2.4} sm={6}>
              <UserCountCard primary="Pending Demand " secondary=" 2.96 cr. / 3.24 cr. " color="warning.main" />
            </Grid>
            <Grid item xs={12} lg={2.4} sm={6}>
              <UserCountCard primary="Pending Interest Demand " secondary=" 28.03 L / 28.03 L " color="info.main" />
            </Grid>
            <Grid item xs={12} lg={2.4} sm={6}>
              <UserCountCard primary="Total Demand " secondary=" 9.31 cr. / 9.31 cr. " color="error.main" />
            </Grid>
            <Grid item xs={12} lg={12} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h3" style={{ color: 'black', fontWeight: 'bold' }}>
                Collection Upto Date Received in Percentage(%)
              </Typography>
            </Grid>

            <Grid item xs={12} lg={4} sm={6}>
              <UserCountCard primary="Current" secondary="0 (0.0%)" iconPrimary={ContactsOutlined} color="success.main" />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <UserCountCard primary="Pending" secondary="19 (2.4%)" iconPrimary={FileProtectOutlined} color="success.main" />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
              <UserCountCard primary="Total" secondary="153 (100%)" iconPrimary={RedditOutlined} color="error.dark" />
            </Grid>
          </Grid>
          <Grid mt={3}>
            <MainCard title="Approval" content={false}>
              <Grid sx={{ p: 2.5 }} container direction="row" justifyContent="space-around" alignItems="center">
                <Grid item>
                  <Grid container direction="column" spacing={1} alignItems="center" justifyContent="center">
                    <Grid item>
                      <Typography variant="subtitle2" color="secondary"  sx={{fontSize:'1rem'}}>
                        Approved
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h4">0</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column" spacing={1} alignItems="center" justifyContent="center">
                    <Grid item>
                      <Typography variant="subtitle2" color="secondary"  sx={{fontSize:'1rem'}}>
                        Discard
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h4">0</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column" spacing={1} alignItems="center" justifyContent="center">
                    <Grid item>
                      <Typography variant="subtitle2" color="secondary"  sx={{fontSize:'1rem'}}>
                        Pending
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h4">0</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <SimpleBar
                sx={{
                  height: 150
                }}
              >
                <TableContainer>
                  <Table>
                    <TableHead sx={{background:'lightblue'}}>
                      <TableRow>
                        <TableCell sx={{ pl: 3 }}>Category</TableCell>
                        <TableCell>Approved</TableCell>
                        <TableCell align="right">Discard</TableCell>
                        <TableCell align="right">Pending</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow hover key={index}>
                          <TableCell sx={{ pl: 3 }}>
                            <span className={row.colorClass}>{row.sales}</span>
                          </TableCell>
                          <TableCell>{row.product}</TableCell>
                          <TableCell align="right" sx={{ pr: 3 }}>
                            <span>{row.price}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </SimpleBar>
            </MainCard>
          </Grid>
          <Grid display={'flex'} justifyContent={'space-between'} mt={3}>
            <Typography fontWeight={'bolder'} fontSize={'1.2rem'}>
              Please wait dashboard will update. <Link>[Refresh]</Link>
            </Typography>
            <Stack direction={'row'}>
              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '1.2rem', marginRight: '1rem', marginTop: '0.5rem' }}>
                सिलेक्ट झोन{' '}
              </InputLabel>
              <Select sx={{width:'200px'}}></Select>
            </Stack>
          </Grid>
        </>
      ) : (
        <>
          <MainCard>
            <Grid>
              <Stack direction={'row'} display={'flex'} justifyContent={'center'}>
                <Typography sx={{ fontWeight: 'bolder', fontSize: '1.2rem', marginRight: '1rem', marginTop: '0.3rem' }}>
                  Select Trend
                </Typography>
                <Select sx={{ width: '40vw' }}></Select>
              </Stack>
            </Grid>
            <Grid mt={4}>
              <Table style={{ width: '100%', height: '150px', overflowX: 'auto' }}>
                <TableHead sx={{ background: 'lightblue' }}>
                  <TableRow>
                    <TableCell>April</TableCell>
                    <TableCell>May</TableCell>
                    <TableCell>June</TableCell>
                    <TableCell>July</TableCell>
                    <TableCell>August</TableCell>
                    <TableCell>September</TableCell>
                    <TableCell>October</TableCell>
                    <TableCell>November </TableCell>
                    <TableCell>December </TableCell>
                    <TableCell>January</TableCell>
                    <TableCell>February </TableCell>
                    <TableCell>March</TableCell>
                  </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                  <TableRow>
                    <TableCell>10309</TableCell>
                    <TableCell>5727</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>1432</TableCell>
                    <TableCell>430</TableCell>
                    <TableCell>215</TableCell>
                    <TableCell>111</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            <Grid>
              <>
                <Grid container alignItems="center" justifyContent="space-between" mt={3}>
                  <Grid item>
                    <Typography variant="h5">Trend</Typography>
                  </Grid>
                  <Grid item>
                    <Stack direction="row" alignItems="center" spacing={0}>
                      <Button
                        size="small"
                        onClick={() => setSlot('month')}
                        color={slot === 'month' ? 'primary' : 'secondary'}
                        variant={slot === 'month' ? 'outlined' : 'text'}
                      >
                        Month
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setSlot('week')}
                        color={slot === 'week' ? 'primary' : 'secondary'}
                        variant={slot === 'week' ? 'outlined' : 'text'}
                      >
                        Week
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                  <Box sx={{ pt: 1, pr: 2 }}>
                    <IncomeAreaChart slot={slot} />
                  </Box>
                </MainCard>
              </>
            </Grid>
          </MainCard>
        </>
      )}
    </>
  );
}

export default Dashboard;
