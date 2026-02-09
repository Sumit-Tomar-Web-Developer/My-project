// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
  Checkbox,
  CardContent,
  Card,
  Button
} from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

function ApprovalDataEntry({ ApprovalButton }) {
  //navigate
  // const navigate = useNavigate();
  // const handleButtonClick = () => {
  //   navigate('/transaction/data-entry-approval');
  // };

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  //changes img hover
  const [hoveredItems, setHoveredItems] = useState(null);

  const handleMouseEnters = (indexs) => {
    setHoveredItems(indexs);
  };

  const handleMouseLeaves = () => {
    setHoveredItems(null);
  };
  const handleDownloadPDF = () => {
    const pdfURL = 'path/to/your/pdf.pdf';
    const anchor = document.createElement('a');
    anchor.href = pdfURL;
    anchor.download = 'C:UsersDELLDownloadsफेरफार_कागदपत्र.pdf';
    anchor.click();
  };

  //show img
  const [isOpens, setIsOpen] = useState(false);

  function toggle(e) {
    setIsOpens((isOpens) => !isOpens);
    e.preventDefault();
  }

  // const [age, setAge] = useState('');
  // const handleChange = (event) => {
  //     setAge(event.target.value);
  //   };

  return (
    <>
      <MainCard title="ApprovalDataEntry">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'blue', fontWeight: 'bold', marginRight: 'auto', marginBottom: '2vw' }}>
            प्राथमिक कर धारकाची माहिती
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: 'red', fontWeight: 'bold', marginLeft: 'auto', marginBottom: '2vw' }}>
            Show Info
          </Typography>
        </Box>
        <Grid container spacing={2.5} mb={'1vw'}>
          <Grid item xs={12} md={10} lg={3}>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <Grid item xs={6} sm={3}>
                <Stack spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>वार्ड क्र. </InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={5.3} mb={1}>
                <Stack spacing={1}>
                  <TextField type="text" value={'D_18'}></TextField>
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10} lg={4}>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <Grid item xs={6} sm={3}>
                <Stack spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता क्र.</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={6.3} mb={1}>
                <Stack spacing={1}>
                  <TextField type="text" value={' 124-1 '}></TextField>
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={10} lg={5}>
            <Grid
              container
              spacing={0}
              justifyContent="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <Grid item xs={6} sm={4.5}>
                <Stack spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>प्राथमिक कर धारकाचे नाव </InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={6.2} mb={1}>
                <Stack spacing={0}>
                  <TextField type="text" value={'महादेव बालाजी मेश्राम'}></TextField>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* 2nd heading*/}
        <Grid container spacing={1.5} mb={'1vw'} justifyContent="center">
          <Grid item xs={12} md={10} lg={4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '4px',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' // Adding box shadow
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: 'blue', fontWeight: 'bold', textAlign: 'center', margin: 'auto', marginBottom: '1vw' }}
              >
                New Property Created: (APPROVED)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 3rd accord */}
        <Grid container spacing={1.5} mb={2.9}>
          <Grid item xs={12} md={10} lg={6}>
            <Typography
              variant="h5"
              style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#8c9eff', padding: '0.6vw' }}
            >
              Old Data
            </Typography>
            <Box>
              <Accordion>
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ fontWeight: 'bolder' }}
                >
                  Property Details
                </AccordionSummary>
                <AccordionDetails sx={{ flexDirection: 'column' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Zone No.</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Open Plot</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'No'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Property Description</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'दुकान'}></TextField>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>CSN</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={''}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel> Plot No</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={''}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Plot Area SqFt</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'360'}></TextField>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Plot Area SqMtr</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'33.46'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>BuiltUpArea</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'172.8'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>CarpetArea</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>R.Toilet</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>C.Toilet</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel></InputLabel>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Category</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Part Type</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}></Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>

          {/* 3rd 2nd */}
          <Grid item xs={12} md={10} lg={6}>
            <Typography
              variant="h5"
              style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#82b1ff', padding: '0.6vw' }}
            >
              New Changed Data
            </Typography>
            <Box>
              <Accordion>
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ fontWeight: 'bolder' }}
                >
                  Property Details
                </AccordionSummary>
                <AccordionDetails sx={{ flexDirection: 'column' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Zone No.</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'2'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Open Plot</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'No'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Property Description</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'दुकान'}></TextField>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>CSN</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={''}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel> Plot No</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={''}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Plot Area SqFt</InputLabel>
                        <TextField required fullWidth maxWidth="sm" style={{ backgroundColor: '#ff8a80' }} value={'180'} />
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Plot Area SqMtr</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'16.32'} style={{ backgroundColor: '#ff8a80' }}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>BuiltUpArea</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'172.8'}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>CarpetArea</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>R.Toilet</InputLabel>
                        <TextField required fullWidth maxWidth="sm" value={'1'} style={{ backgroundColor: '#ff8a80' }}></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>C.Toilet</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel></InputLabel>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Category</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}>
                        <InputLabel>Part Type</InputLabel>
                        <TextField required fullWidth maxWidth="sm"></TextField>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                      <Stack sx={{ width: '100%' }}></Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
        </Grid>

        <Box mb={1.9}>
          <hr></hr>
        </Box>
        {/* 1st table */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Owner and property details
              </Typography>

              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">isPrime</TableCell>
                      <TableCell className="font-weight-bold">शिर्षक</TableCell>
                      <TableCell className="font-weight-bold">प्रथमनाव</TableCell>
                      <TableCell className="font-weight-bold">मधलेनाव</TableCell>
                      <TableCell className="font-weight-bold">आडनाव</TableCell>
                      <TableCell className="font-weight-bold">पत्ता</TableCell>
                      <TableCell className="font-weight-bold">दुकान/इमारतचे नाव</TableCell>
                      <TableCell className="font-weight-bold">दुकान/flat नं.</TableCell>
                      <TableCell className="font-weight-bold">Title</TableCell>
                      <TableCell className="font-weight-bold">First</TableCell>
                      <TableCell className="font-weight-bold">Middle</TableCell>
                      <TableCell className="font-weight-bold">Last</TableCell>
                      <TableCell className="font-weight-bold">Address</TableCell>
                      <TableCell className="font-weight-bold">Shop/Bld.Name </TableCell>
                      <TableCell className="font-weight-bold">Shop/Flat No.</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ textAlign: 'center' }}>
                        <FormControlLabel control={<Checkbox />} />
                      </TableCell>
                      <TableCell>श्री</TableCell>
                      <TableCell>महादेव</TableCell>
                      <TableCell>बालाजी</TableCell>
                      <TableCell>मेश्राम</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Mr</TableCell>
                      <TableCell>Mahadev</TableCell>
                      <TableCell>Balaji</TableCell>
                      <TableCell>Meshram</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* table 4th line 2nd */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">isPrime</TableCell>
                      <TableCell className="font-weight-bold">शिर्षक</TableCell>
                      <TableCell className="font-weight-bold">प्रथमनाव</TableCell>
                      <TableCell className="font-weight-bold">मधलेनाव</TableCell>
                      <TableCell className="font-weight-bold">आडनाव</TableCell>
                      <TableCell className="font-weight-bold">पत्ता</TableCell>
                      <TableCell className="font-weight-bold">दुकान/इमारतचे नाव</TableCell>
                      <TableCell className="font-weight-bold">दुकान/flat नं.</TableCell>
                      <TableCell className="font-weight-bold">Title</TableCell>
                      <TableCell className="font-weight-bold">First</TableCell>
                      <TableCell className="font-weight-bold">Middle</TableCell>
                      <TableCell className="font-weight-bold">Last</TableCell>
                      <TableCell className="font-weight-bold">Address</TableCell>
                      <TableCell className="font-weight-bold">Shop/Bld.Name </TableCell>
                      <TableCell className="font-weight-bold">Shop/Flat No.</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow style={{ backgroundColor: 'yellow' }}>
                      <TableCell style={{ textAlign: 'center' }}>
                        <FormControlLabel control={<Checkbox />} />
                      </TableCell>
                      <TableCell>श्री</TableCell>
                      <TableCell>महादेव</TableCell>
                      <TableCell>बालाजी</TableCell>
                      <TableCell>मेश्राम</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Mr</TableCell>
                      <TableCell>Mahadev</TableCell>
                      <TableCell>Balaji</TableCell>
                      <TableCell>Meshram</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>

        {/* 2nd table */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Floor details
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Floor</TableCell>
                      <TableCell className="font-weight-bold">Const.Year</TableCell>
                      <TableCell className="font-weight-bold">Const.Type</TableCell>
                      <TableCell className="font-weight-bold">Type Of Use </TableCell>
                      <TableCell className="font-weight-bold">Carpet Area(ft)</TableCell>
                      <TableCell className="font-weight-bold"> Carpet Area(mtr)</TableCell>
                      <TableCell className="font-weight-bold">Rooms</TableCell>
                      <TableCell className="font-weight-bold">Registration</TableCell>
                      <TableCell className="font-weight-bold">Renter</TableCell>
                      <TableCell className="font-weight-bold">Occupier</TableCell>
                      <TableCell className="font-weight-bold">प्रथमनाव</TableCell>
                      <TableCell className="font-weight-bold">मधलेनाव</TableCell>
                      <TableCell className="font-weight-bold">आडनाव</TableCell>
                      <TableCell className="font-weight-bold">CalculateRent </TableCell>
                      <TableCell className="font-weight-bold">NonCalculateRent</TableCell>
                      <TableCell className="font-weight-bold">First</TableCell>
                      <TableCell className="font-weight-bold">Middle</TableCell>
                      <TableCell className="font-weight-bold">Last</TableCell>
                      <TableCell className="font-weight-bold">Agreement</TableCell>
                      <TableCell className="font-weight-bold">AgreementDate</TableCell>
                      <TableCell className="font-weight-bold">AgreementToDate</TableCell>
                      <TableCell className="font-weight-bold">OccupierName</TableCell>
                      <TableCell className="font-weight-bold">MarathiOccupierName</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>G</TableCell>
                      <TableCell>2000</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>S</TableCell>
                      <TableCell>144</TableCell>
                      <TableCell>13.38</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>1/1/1900 12:00:00 AM </TableCell>
                      <TableCell>1/1/1900 12:00:00 AM</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Floor</TableCell>
                      <TableCell className="font-weight-bold">Const.Year</TableCell>
                      <TableCell className="font-weight-bold">Const.Type</TableCell>
                      <TableCell className="font-weight-bold">Type Of Use </TableCell>
                      <TableCell className="font-weight-bold">Carpet Area(ft)</TableCell>
                      <TableCell className="font-weight-bold"> Carpet Area(mtr)</TableCell>
                      <TableCell className="font-weight-bold">Rooms</TableCell>
                      <TableCell className="font-weight-bold">Registration</TableCell>
                      <TableCell className="font-weight-bold">Renter</TableCell>
                      <TableCell className="font-weight-bold">Occupier</TableCell>
                      <TableCell className="font-weight-bold">प्रथमनाव</TableCell>
                      <TableCell className="font-weight-bold">मधलेनाव</TableCell>
                      <TableCell className="font-weight-bold">आडनाव</TableCell>
                      <TableCell className="font-weight-bold">CalculateRent </TableCell>
                      <TableCell className="font-weight-bold">NonCalculateRent</TableCell>
                      <TableCell className="font-weight-bold">First</TableCell>
                      <TableCell className="font-weight-bold">Middle</TableCell>
                      <TableCell className="font-weight-bold">Last</TableCell>
                      <TableCell className="font-weight-bold">Agreement</TableCell>
                      <TableCell className="font-weight-bold">AgreementDate</TableCell>
                      <TableCell className="font-weight-bold">AgreementToDate</TableCell>
                      <TableCell className="font-weight-bold">OccupierName</TableCell>
                      <TableCell className="font-weight-bold">MarathiOccupierName</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow style={{ backgroundColor: 'yellow' }}>
                      <TableCell>G</TableCell>
                      <TableCell>2000</TableCell>
                      <TableCell>B</TableCell>
                      <TableCell>S</TableCell>
                      <TableCell>144</TableCell>
                      <TableCell>13.38</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>No</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>No</TableCell>
                      <TableCell>1/1/1900 12:00:00 AM </TableCell>
                      <TableCell>1/1/1900 12:00:00 AM</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>

        {/* 4th renter Deatils */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                mb={1}
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}
              >
                Renter Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Plot Area Type</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>खुल्या भूखंडाच्या भो.प्रथम नाव </InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>मधले नाव</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>आडनाव</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Wadh Ghat Remark</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Plot Taxable Area(SqFt)</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>WadhGhatDocument</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Occupier Name (OP) </InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>भोगवाटदाराचे नाव(OP)</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for 4nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                mb={1}
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Plot Area Type</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>खुल्या भूखंडाच्या भो.प्रथम नाव </InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>मधले नाव</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>आडनाव</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Wadh Ghat Remark</InputLabel>
                    <TextField
                      required
                      fullWidth
                      maxWidth="sm"
                      value={'लिपिक माहितीनुस'}
                      style={{ backgroundColor: '#ff8a80' }}
                    ></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Plot Taxable Area(SqFt)</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>WadhGhatDocument</InputLabel>
                    <TextField
                      required
                      fullWidth
                      maxWidth="sm"
                      value={'स्थळपाहणी अहवाल'}
                      style={{ backgroundColor: '#ff8a80' }}
                    ></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Occupier Name (OP) </InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>भोगवाटदाराचे नाव(OP)</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>

        {/* 5th Old Information deatils */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Old information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Ward</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property No</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'New'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>PartitionNo</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>City Servey No</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'New'}></TextField>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>RV</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>ALV</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property No</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Tax Total</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Ward</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property No</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'1800110'} style={{ backgroundColor: '#ff8a80' }}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>PartitionNo</InputLabel>
                    <TextField required fullWidth maxWidth="sm"></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>City Servey No</InputLabel>
                    <TextField required fullWidth maxWidth="sm" style={{ backgroundColor: '#ff8a80' }}></TextField>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>RV</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>ALV</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property No</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Tax Total</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'0'}></TextField>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>

        {/* 6th Property new Information  */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Property New info
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>New ALV</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'2032.00'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>New RV</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'1829.00'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property Tax</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'439.00'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Tax Total</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'652.00'}></TextField>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>New ALV</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'2032.00'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>New RV</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'1829.00'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Property Tax</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'439.00'}></TextField>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
                  <Stack sx={{ width: '100%' }}>
                    <InputLabel>Tax Total</InputLabel>
                    <TextField required fullWidth maxWidth="sm" value={'652.00'}></TextField>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
        {/* 7th Pending Tax Details table*/}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Pending tax details
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Pending Year</TableCell>
                      <TableCell className="font-weight-bold"> Property Tax</TableCell>
                      <TableCell className="font-weight-bold">Education Tax</TableCell>
                      <TableCell className="font-weight-bold">Sp. Education Tax </TableCell>
                      <TableCell className="font-weight-bold">Employment Tax</TableCell>
                      <TableCell className="font-weight-bold"> Tree Cess</TableCell>
                      <TableCell className="font-weight-bold">Fire Cess</TableCell>
                      <TableCell className="font-weight-bold">Light Cess</TableCell>
                      <TableCell className="font-weight-bold">Drain Cess</TableCell>
                      <TableCell className="font-weight-bold">Road Cess</TableCell>
                      <TableCell className="font-weight-bold">Sanitation</TableCell>
                      <TableCell className="font-weight-bold">Sp. Water Cess</TableCell>
                      <TableCell className="font-weight-bold">Water Benefit </TableCell>
                      <TableCell className="font-weight-bold">Water Bill </TableCell>
                      <TableCell className="font-weight-bold">Major Building</TableCell>
                      <TableCell className="font-weight-bold">Sewage Disposal Cess</TableCell>
                      <TableCell className="font-weight-bold">Tax1</TableCell>
                      <TableCell className="font-weight-bold">TaxTotal</TableCell>
                      <TableCell className="font-weight-bold">Interest</TableCell>
                      <TableCell className="font-weight-bold">Net Total</TableCell>
                      <TableCell className="font-weight-bold">Remark</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>2022</TableCell>
                      <TableCell>439.00</TableCell>
                      <TableCell>163.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>41.00</TableCell>
                      <TableCell>9.00</TableCell>
                      <TableCell>0.0000</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>157.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>809.00</TableCell>
                      <TableCell>156.00</TableCell>
                      <TableCell>965.00 </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Pending Year</TableCell>
                      <TableCell className="font-weight-bold"> Property Tax</TableCell>
                      <TableCell className="font-weight-bold">Education Tax</TableCell>
                      <TableCell className="font-weight-bold">Sp. Education Tax </TableCell>
                      <TableCell className="font-weight-bold">Employment Tax</TableCell>
                      <TableCell className="font-weight-bold"> Tree Cess</TableCell>
                      <TableCell className="font-weight-bold">Fire Cess</TableCell>
                      <TableCell className="font-weight-bold">Light Cess</TableCell>
                      <TableCell className="font-weight-bold">Drain Cess</TableCell>
                      <TableCell className="font-weight-bold">Road Cess</TableCell>
                      <TableCell className="font-weight-bold">Sanitation</TableCell>
                      <TableCell className="font-weight-bold">Sp. Water Cess</TableCell>
                      <TableCell className="font-weight-bold">Water Benefit </TableCell>
                      <TableCell className="font-weight-bold">Water Bill </TableCell>
                      <TableCell className="font-weight-bold">Major Building</TableCell>
                      <TableCell className="font-weight-bold">Sewage Disposal Cess</TableCell>
                      <TableCell className="font-weight-bold">Tax1</TableCell>
                      <TableCell className="font-weight-bold">TaxTotal</TableCell>
                      <TableCell className="font-weight-bold">Interest</TableCell>
                      <TableCell className="font-weight-bold">Net Total</TableCell>
                      <TableCell className="font-weight-bold">Remark</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow style={{ backgroundColor: 'yellow' }}>
                      <TableCell>2022</TableCell>
                      <TableCell>439.00</TableCell>
                      <TableCell>163.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>41.00</TableCell>
                      <TableCell>9.00</TableCell>
                      <TableCell>0.0000</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>157.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>809.00</TableCell>
                      <TableCell>156.00</TableCell>
                      <TableCell>965.00 </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
        {/* 8th current Tax Details table*/}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Current tax details
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Finance Year</TableCell>
                      <TableCell className="font-weight-bold"> Property Tax</TableCell>
                      <TableCell className="font-weight-bold">Education Tax</TableCell>
                      <TableCell className="font-weight-bold">Sp. Education Tax </TableCell>
                      <TableCell className="font-weight-bold">Employment Tax</TableCell>
                      <TableCell className="font-weight-bold"> Tree Cess</TableCell>
                      <TableCell className="font-weight-bold">Fire Cess</TableCell>
                      <TableCell className="font-weight-bold">Light Cess</TableCell>
                      <TableCell className="font-weight-bold">Drain Cess</TableCell>
                      <TableCell className="font-weight-bold">Road Cess</TableCell>
                      <TableCell className="font-weight-bold">Sanitation</TableCell>
                      <TableCell className="font-weight-bold">Sp. Water Cess</TableCell>
                      <TableCell className="font-weight-bold">Water Benefit </TableCell>
                      <TableCell className="font-weight-bold">Water Bill </TableCell>
                      <TableCell className="font-weight-bold">Major Building</TableCell>
                      <TableCell className="font-weight-bold">Sewage Disposal Cess</TableCell>
                      <TableCell className="font-weight-bold">Tax1</TableCell>
                      <TableCell className="font-weight-bold">TaxTotal</TableCell>
                      <TableCell className="font-weight-bold">Interest</TableCell>
                      <TableCell className="font-weight-bold">Remark</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>2023</TableCell>
                      <TableCell>439.00</TableCell>
                      <TableCell>163.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>41.00</TableCell>
                      <TableCell>9.00</TableCell>
                      <TableCell>0.0000</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>157.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>809.00</TableCell>
                      <TableCell>156.00</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Finance Year</TableCell>
                      <TableCell className="font-weight-bold"> Property Tax</TableCell>
                      <TableCell className="font-weight-bold">Education Tax</TableCell>
                      <TableCell className="font-weight-bold">Sp. Education Tax </TableCell>
                      <TableCell className="font-weight-bold">Employment Tax</TableCell>
                      <TableCell className="font-weight-bold"> Tree Cess</TableCell>
                      <TableCell className="font-weight-bold">Fire Cess</TableCell>
                      <TableCell className="font-weight-bold">Light Cess</TableCell>
                      <TableCell className="font-weight-bold">Drain Cess</TableCell>
                      <TableCell className="font-weight-bold">Road Cess</TableCell>
                      <TableCell className="font-weight-bold">Sanitation</TableCell>
                      <TableCell className="font-weight-bold">Sp. Water Cess</TableCell>
                      <TableCell className="font-weight-bold">Water Benefit </TableCell>
                      <TableCell className="font-weight-bold">Water Bill </TableCell>
                      <TableCell className="font-weight-bold">Major Building</TableCell>
                      <TableCell className="font-weight-bold">Sewage Disposal Cess</TableCell>
                      <TableCell className="font-weight-bold">Tax1</TableCell>
                      <TableCell className="font-weight-bold">TaxTotal</TableCell>
                      <TableCell className="font-weight-bold">Interest</TableCell>
                      <TableCell className="font-weight-bold">Remark</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow style={{ backgroundColor: 'yellow' }}>
                      <TableCell>2023</TableCell>
                      <TableCell>439.00</TableCell>
                      <TableCell>163.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>41.00</TableCell>
                      <TableCell>9.00</TableCell>
                      <TableCell>0.0000</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>157.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>809.00</TableCell>
                      <TableCell>156.00</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>

        {/* 9 Appeal Taxes table*/}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Appeal taxes
              </Typography>
              <Box sx={{ overflowX: 'auto', height: '164px' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-weight-bold"> Property </TableCell>
                        <TableCell className="font-weight-bold">Education </TableCell>
                        <TableCell className="font-weight-bold">Sp. Edu. </TableCell>
                        <TableCell className="font-weight-bold">Employment</TableCell>
                        <TableCell className="font-weight-bold"> Tree </TableCell>
                        <TableCell className="font-weight-bold">Fire </TableCell>
                        <TableCell className="font-weight-bold">Light </TableCell>
                        <TableCell className="font-weight-bold">Drain </TableCell>
                        <TableCell className="font-weight-bold">Road </TableCell>
                        <TableCell className="font-weight-bold">Sanitation</TableCell>
                        <TableCell className="font-weight-bold">W. Cess</TableCell>
                        <TableCell className="font-weight-bold">W. Benefit </TableCell>
                        <TableCell className="font-weight-bold">Water Bill </TableCell>
                        <TableCell className="font-weight-bold">Major Build</TableCell>
                        <TableCell className="font-weight-bold">Sewage </TableCell>
                        <TableCell className="font-weight-bold">Tax1</TableCell>
                        <TableCell className="font-weight-bold">Total</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <Box sx={{ overflowX: 'auto', height: '164px' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-weight-bold"> Property </TableCell>
                        <TableCell className="font-weight-bold">Education </TableCell>
                        <TableCell className="font-weight-bold">Sp. Edu. </TableCell>
                        <TableCell className="font-weight-bold">Employment</TableCell>
                        <TableCell className="font-weight-bold"> Tree </TableCell>
                        <TableCell className="font-weight-bold">Fire </TableCell>
                        <TableCell className="font-weight-bold">Light </TableCell>
                        <TableCell className="font-weight-bold">Drain </TableCell>
                        <TableCell className="font-weight-bold">Road </TableCell>
                        <TableCell className="font-weight-bold">Sanitation</TableCell>
                        <TableCell className="font-weight-bold">W. Cess</TableCell>
                        <TableCell className="font-weight-bold">W. Benefit </TableCell>
                        <TableCell className="font-weight-bold">Water Bill </TableCell>
                        <TableCell className="font-weight-bold">Major Build</TableCell>
                        <TableCell className="font-weight-bold">Sewage </TableCell>
                        <TableCell className="font-weight-bold">Tax1</TableCell>
                        <TableCell className="font-weight-bold">Total</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
        </MainCard>
        {/* 10th Water Connection Mast */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Water Connection Mast
              </Typography>
              <Box sx={{ overflowX: 'auto', height: '200px' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-weight-bold"> Tap Size </TableCell>
                        <TableCell className="font-weight-bold">Tap Size </TableCell>
                        <TableCell className="font-weight-bold">Tap Use Type </TableCell>
                        <TableCell className="font-weight-bold">Tap Use Type</TableCell>
                        <TableCell className="font-weight-bold"> Tap Condition </TableCell>
                        <TableCell className="font-weight-bold">Tap Condition </TableCell>
                        <TableCell className="font-weight-bold">Connection Year </TableCell>
                        <TableCell className="font-weight-bold">Rate </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <Box sx={{ overflowX: 'auto', height: '200px' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-weight-bold"> Tap Size </TableCell>
                        <TableCell className="font-weight-bold">Tap Size </TableCell>
                        <TableCell className="font-weight-bold">Tap Use Type </TableCell>
                        <TableCell className="font-weight-bold">Tap Use Type</TableCell>
                        <TableCell className="font-weight-bold"> Tap Condition </TableCell>
                        <TableCell className="font-weight-bold">Tap Condition </TableCell>
                        <TableCell className="font-weight-bold">Connection Year </TableCell>
                        <TableCell className="font-weight-bold">Rate </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
        </MainCard>
        {/* 11 checkbox */}
        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Special Discount Original
              </Typography>

              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack spacing={1} direction={'row'} marginTop={2}>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsSolar</Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsRainWaterHarvesting</Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsGarbageSegregation</Box>
                  </Box>
                </Stack>
              </Grid>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack spacing={1} direction={'row'} marginTop={2}>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsEBill</Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsGarbageDisposal</Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '1.3vw' }}
              ></Typography>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack spacing={1} direction={'row'} marginTop={2}>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsSolar</Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsRainWaterHarvesting</Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsGarbageSegregation</Box>
                  </Box>
                </Stack>
              </Grid>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack spacing={1} direction={'row'} marginTop={2}>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsEBill</Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox disabled />
                    <Box fontWeight="bold">IsGarbageDisposal</Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
        {/* 12 Images */}

        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}>
                Uploaded Images
              </Typography>
            </Grid>

            {/* table 12th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#b2dfdb', padding: '0.2vw' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginRight: 'auto' }}>
                  Uploaded Document
                </Typography>
                <Button variant="contained" onClick={toggle} color="primary" size="small">
                  Show Image
                </Button>
              </Box>

              {isOpens && (
                <Grid
                  container
                  spacing={2.2}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {/* table */}

                  {/* table2 */}
                  <Grid item xs={12} sm={9}>
                    <Box className="card">
                      <Card>
                        <CardContent>
                          {/* <Typography variant="h6" gutterBottom sx={{ color: 'blue', fontWeight: 'bold' }}>
          Ward List
          </Typography> */}

                          <Box sx={{ overflowX: 'auto', height: '280px' }}>
                            {/* Table */}
                            <Table>
                              {/* Table Header */}
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell>Document Name</TableCell>
                                  <TableCell>Show</TableCell>
                                </TableRow>
                              </TableHead>
                              {/* Table Body */}
                              <TableBody>
                                <TableRow>
                                  <TableCell>स्थळपाहणी अहवाल</TableCell>
                                  <TableCell>
                                    {' '}
                                    <Button variant="contained" color="primary" size="small" onClick={handleDownloadPDF}>
                                      View Documents
                                    </Button>
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>वाढघट कागदपत्र</TableCell>
                                  <TableCell>
                                    {' '}
                                    <Button variant="contained" color="primary" size="small">
                                      View Documents
                                    </Button>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>स्थळपाहणी अहवाल</TableCell>
                                  <TableCell>
                                    {' '}
                                    <Button variant="contained" color="primary" size="small">
                                      View Documents
                                    </Button>
                                  </TableCell>
                                </TableRow>

                                <TableRow>
                                  <TableCell>वाढघट कागदपत्र </TableCell>
                                  <TableCell>
                                    {' '}
                                    <Button variant="contained" color="primary" size="small">
                                      View Documents
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </MainCard>

        {/* 13 Old Images */}

        <MainCard>
          <Grid container spacing={5} mb={1}>
            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                mb={1}
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}
              >
                Old Plan Photo
              </Typography>
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12} md={6} lg={3}>
                  {[0, 1].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        border: '2px solid #ccc',
                        padding: '30px',
                        borderRadius: '19px',
                        marginBottom: '0.4vw',
                        transition: 'transform 0.1s ease',
                        transform: hoveredItem === index ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img src={`url_of_your_image_${index + 1}`} alt="No Image Available" style={{ width: '100%' }} />
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  {[2, 3].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        border: '2px solid #ccc',
                        padding: '30px',
                        borderRadius: '19px',
                        marginBottom: '0.4vw',
                        transition: 'transform 0.1s ease',
                        transform: hoveredItem === index ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img src={`url_of_your_image_${index + 1}`} alt="No Image Available" style={{ width: '100%' }} />
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <Box
                    sx={{
                      border: '2px solid #ccc',
                      padding: '100px',
                      borderRadius: '19px',
                      marginBottom: '0.4vw',
                      marginRight: '-8vw',
                      transition: 'transform 0.1s ease',
                      transform: hoveredItem === 4 ? 'scale(1.3)' : 'scale(1)'
                    }}
                    onMouseEnter={() => handleMouseEnter(4)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img src="url_of_your_image_5" alt="No Image Available" style={{ width: '100%' }} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* table 4th line 2nd for3nd table */}

            <Grid item xs={12} md={10} lg={6}>
              <Typography
                variant="h5"
                mb={1}
                style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}
              >
                Changed Plan Photo
              </Typography>
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12} md={6} lg={3}>
                  {[0, 1].map((indexs) => (
                    <Box
                      key={indexs}
                      sx={{
                        border: '2px solid #ccc',
                        padding: '30px',
                        borderRadius: '19px',
                        marginBottom: '0.4vw',
                        transition: 'transform 0.1s ease',
                        transform: hoveredItems === indexs ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => handleMouseEnters(indexs)}
                      onMouseLeave={handleMouseLeaves}
                    >
                      <img src={`url_of_your_image_${indexs + 1}`} alt="No Image Available" style={{ width: '100%' }} />
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  {[2, 3].map((indexs) => (
                    <Box
                      key={indexs}
                      sx={{
                        border: '2px solid #ccc',
                        padding: '30px',
                        borderRadius: '19px',
                        marginBottom: '0.4vw',
                        transition: 'transform 0.1s ease',
                        transform: hoveredItems === indexs ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => handleMouseEnters(indexs)}
                      onMouseLeave={handleMouseLeaves}
                    >
                      <img src={`url_of_your_image_${indexs + 1}`} alt="No Image Available" style={{ width: '100%' }} />
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                  <Box
                    sx={{
                      border: '2px solid #ccc',
                      padding: '100px',
                      borderRadius: '19px',
                      marginBottom: '0.4vw',
                      marginRight: '-8vw',
                      transition: 'transform 0.1s ease',
                      transform: hoveredItems === 4 ? 'scale(1.3)' : 'scale(1)'
                    }}
                    onMouseEnter={() => handleMouseEnters(4)}
                    onMouseLeave={handleMouseLeaves}
                  >
                    <img src="url_of_your_image_5" alt="No Image Available" style={{ width: '100%' }} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>

        {/* last */}
        <MainCard>
          <Grid item xs={12} sm={12}>
            <Typography
              variant="h5"
              mb={1}
              style={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#b2dfdb', padding: '0.6vw' }}
            >
              Data Entry Changes Approve/Disapprove
            </Typography>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <Grid item xs={6} sm={1.2}>
                <Stack spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>वाढ-घट शेरा: </InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={5.3} mb={1} mt={1}>
                <Stack spacing={1}>
                  <TextField required Width autoComplete="family-name" value={'Ok'} sx={{ mt: 3 }} />{' '}
                </Stack>
              </Grid>

              <Grid
                container
                spacing={3}
                justifyContent="center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                <Grid item xs={6} sm={3}>
                  <Stack spacing={0}>
                    <Button variant="contained" color="warning" onClick={ApprovalButton}>
                      Back To Search
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>

        {/* end maincard */}
      </MainCard>
    </>
  );
}

export default ApprovalDataEntry;
