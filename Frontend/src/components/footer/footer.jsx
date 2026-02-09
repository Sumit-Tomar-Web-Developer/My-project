import React from 'react';
// material-ui
import { Grid, Button, Stack } from '@mui/material';
import PropTypes from 'prop-types';

const Footer = ({ employeeMaster }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={7}>
        <Grid container spacing={2} justifyContent="flex-start">
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <Button variant="contained" color="success">
                First
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <Button variant="contained" color="warning">
                &lt;&lt; Previous
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <Button variant="contained" color="info">
                1
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <Button variant="contained" color="info">
                10509
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2.2}>
            <Stack spacing={1}>
              <Button variant="contained" color="warning">
                Next &gt;&gt;
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <Button variant="contained" color="success">
                Last
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={5}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Button variant="contained" color="success">
                Add
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Button variant="contained" color="success">
                Save
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Button variant="contained" color="info">
                Edit
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Button variant="contained" color="secondary" onClick={employeeMaster}>
                Cancel
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Button variant="contained" color="error">
                Delete
              </Button>
            </Stack>


            
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

// Define PropTypes for the Footer component
Footer.propTypes = {
  employeeMaster: PropTypes.func.isRequired // Should be a function and required
};

export default Footer;
