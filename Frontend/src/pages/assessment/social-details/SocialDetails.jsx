import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';
import MainCard from 'components/MainCard';

function SocialDetails() {
  return (
    <MainCard title="Social Details">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>Road Width</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>R Toilet</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>C Toilet</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={3} style={{ textAlign: 'center' }}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>No. of Trees</InputLabel>
            <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
          </Stack>
        </Grid>
      </Grid>
      <Grid sx={{ mt: 2 }}>
        <MainCard>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                border: '2px solid #E6EBF1',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '4px'
              }}
            >
              <div style={{ textAlign: 'right', marginLeft: 20 }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="IsFire" />
              </div>
              <div style={{ textAlign: 'center', margin: 20 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>No. of Fire</InputLabel>
                <TextField required id="FullNameBasic" name="FullName" autoComplete="given-name" style={{ width: '150px' }} />
              </div>
            </div>
            <div
              style={{
                border: '2px solid #E6EBF1',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: 30,
                marginRight: 30,
                borderRadius: '4px'
              }}
            >
              <div style={{ textAlign: 'right', marginLeft: 20 }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="IsBoreWell" />
              </div>
              <div style={{ textAlign: 'center', margin: 20 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>No. of Borewell</InputLabel>
                <TextField required id="FullNameBasic" name="FullName" autoComplete="given-name" style={{ width: '150px' }} />
              </div>
            </div>
            <div
              style={{
                border: '2px solid #E6EBF1',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '4px'
              }}
            >
              <div style={{ textAlign: 'right', marginLeft: 30 }}>
                <FormControlLabel sx={{ mr: 7 }} control={<Checkbox defaultChecked />} label="IsHandPump" />
              </div>
              <div style={{ textAlign: 'center', margin: 20 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>No. of Hand Pump</InputLabel>
                <TextField required id="FullNameBasic" name="FullName" autoComplete="given-name" style={{ width: '150px' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                border: '2px solid #E6EBF1',
                display: 'flex',
                borderRadius: '4px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20
              }}
            >
              <div style={{ textAlign: 'right', marginLeft: 20 }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="IsLift" />
              </div>
              <div style={{ textAlign: 'center', margin: 20 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>No. of Lift</InputLabel>
                <TextField required id="FullNameBasic" name="FullName" autoComplete="given-name" style={{ width: '150px' }} />
              </div>
            </div>
            <div
              style={{
                border: '2px solid #E6EBF1',
                display: 'flex',
                borderRadius: '4px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: 30,
                marginRight: 30,
                marginTop: 20
              }}
            >
              <div style={{ textAlign: 'right', marginLeft: 20 }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="IsSolar" />
              </div>
              <div style={{ textAlign: 'center', margin: 20 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>No. of Solar</InputLabel>
                <TextField required id="FullNameBasic" name="FullName" autoComplete="given-name" style={{ width: '150px' }} />
              </div>
            </div>
            <div
              style={{
                border: '2px solid #E6EBF1',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20
              }}
            >
              <div style={{ textAlign: 'right', marginLeft: 20 }}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Is RainWater Harvesting" />
              </div>
              <div style={{ textAlign: 'center', margin: 20 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>No. Rain Water Harvesting</InputLabel>
                <TextField required id="FullNameBasic" name="FullName" autoComplete="given-name" style={{ width: '150px' }} />
              </div>
            </div>
          </div>
        </MainCard>
        <Grid sx={{ marginTop: 2 }}>
          <MainCard>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Accordion>
                  <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                    Water Connection
                  </AccordionSummary>
                  <AccordionDetails sx={{ flexDirection: 'column' }}>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Water Connection" />
                    <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>No. of Water Connection</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>Size()</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12} md={4}>
                <Accordion>
                  <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                    चतुर्थसीमा
                  </AccordionSummary>
                  <AccordionDetails>
                        <Grid container spacing={2}>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}> पूर्व</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}> पश्चिम</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>उत्तर</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>दक्षिण</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}> पूर्व</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}> पश्चिम</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>उत्तर</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack spacing={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>दक्षिण</InputLabel>
                          <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                        </Stack>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              {/* <Grid item xs={12} md={4}>
                <Accordion>
                  <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                    Wadh Ghat Remark
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item>
                      <Stack spacing={1}>
                        <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}> Wadh Ghat Remark [1]</InputLabel>
                        <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                      </Stack>
                    </Grid>
                    <Grid sx={{ marginTop: 1 }}>
                      <Stack spacing={1}>
                        <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>Wadh Ghat Remark [2] </InputLabel>
                        <TextField required id="FullNameBasic" name="FullName" fullWidth autoComplete="given-name" />
                      </Stack>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid> */}
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default SocialDetails;
