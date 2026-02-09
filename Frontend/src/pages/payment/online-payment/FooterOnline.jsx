import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import MainCard from 'components/MainCard';
const FooterOnline = () => {
  return (
    <>
     {/* Payment Gateway */}
  <Box mb={2}></Box>
  <MainCard  style={{ backgroundColor: '#e3f2fd' }}>
  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
    <span>Payment Gateway Notification</span>
  </Typography>
</MainCard>
<MainCard>
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography variant="h5" color="red" style={{ fontWeight: 'bold' }} > Note</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1">1. Net Banking Payment: Rs. 10 per transaction.</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1">2. Debit Card Payment: Less than ₹2000 - 0.00%, Greater than ₹2000 - 1%.</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1">3. Credit Card Payment: 1%.</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1">4. NEFT or RTGS Payment: ₹5.</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1">5. UPI Payment: Less than ₹2000 - 0.00, Greater than ₹2000 - ₹9.</Typography>
    </Grid>
    <Grid item xs={12}>
      <Box mt={3}></Box>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="h5" color="red" style={{ fontWeight: 'bold' }}>Do Not Do ...</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1">1. Do not attempt your transaction a second time if you have already tried. If your amount is debited but not updated on the website, please email us at helpdesk.Shirurnp@gmail.com</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1">2. For any queries related to online Property Tax Payment, please call us on our toll-free number.</Typography>
    </Grid>
  </Grid>
</MainCard></>
  );
};

export default FooterOnline;
