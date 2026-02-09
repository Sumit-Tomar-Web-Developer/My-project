// material-ui
import { Grid, InputLabel, Stack, TextField,Box,Typography,Alert,Button, Select,MenuItem } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  //model
  import Dialog from '@mui/material/Dialog';
  import DialogActions from '@mui/material/DialogActions';
  import DialogContent from '@mui/material/DialogContent';
  import DialogContentText from '@mui/material/DialogContentText';
  import DialogTitle from '@mui/material/DialogTitle';


// project import
import MainCard from 'components/MainCard';
import { useState } from 'react';
// ==============================|| SAMPLE PAGE ||============================== //
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router';
import Snackbar from '@mui/material/Snackbar';

function GetPropertyTransferFee() {
  //Datepicker state
  const [value, setValue] = useState(null);
    const [wardNo, setWardNo] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [paymentMode, setPaymentMode] = useState(0);
    const [mobileNo, setMobileNo] = useState('');
    const [billBookNo, setBillBook] = useState('');
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);


//model
const [openDialog, setOpenDialog] = useState(false);
const handleClickDialog = () => {
  setOpenDialog(true);
};
    const handleWardNoChange = (event) => {
      setWardNo(event.target.value);
    };
    const handleGetProperty = () => {
      if (wardNo ) {
        setShowTable(true);
      }
    };  
    
    //mobile and billbook enter
    const handleMobileNoChange = (event) => {
      setMobileNo(event.target.value);
    };
  
    const handleBillBookChange = (event) => {
      setBillBook(event.target.value);
    };
  
    const handlePayProperty = () => {
      if (mobileNo && billBookNo) {
        setOpenDialog(true); 
        setShowAlert(false);

      } else {
        setShowAlert(true); // Display the alert
      }
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
  
    
    // const handleCloseDialog = () => {
    //   setOpenDialog(false);
    // };
  
    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
  


    const handlePaymentModeChange = (event) => {
      setPaymentMode(event.target.value);
    }; 

  return (
    <>
     
      <MainCard title="Counter Payment">
      <Typography sx={{ mb: 2}} variant="h6" style={{ fontWeight: 'bold' }}>
        <span style={{ color: 'red' }}>*</span>
        <span>
          मालमत्ता कर भरणा करण्याबाबत कोणतीही तक्रार असल्यास किंवा मदत पाहिजे असल्यास कृपया  टोल फ्री 18XXXXXXXX
          क्रमांकावर संपर्क साधा helpdesk.Shirurnp@gmail.com या इमेल आय.डी. वर मेल करा.
        </span>
      </Typography>
      <MainCard style={{ backgroundColor: '#e3f2fd' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          <span>प्राथमिक कर धारकाची माहिती</span>
        </Typography>
      </MainCard>
      <MainCard>   
           <Grid>

        <Grid container spacing={4.5}>
          <Grid item xs={12} md={10} lg={4}>
            <Box >
              <Box>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={5.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>वार्ड क्र. :</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" value={'1'} />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={5.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>भोगवटदार /भाडेकरी नाव:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
               <TextField required fullWidth autoComplete="family-name" 
                  InputProps={{ readOnly: true }}  />       
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={5.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>संपर्क क्र.:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField  InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" />
                    </Stack>
                  </Grid>
                </Grid>
               
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={10} lg={4}>
            <Box title="Find Property">
              <Box>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6} sm={2.9}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता क्र.: </InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name" value={'11'} InputProps={{ readOnly: true }}  placeholder="Enter Unique No." />
                    </Stack>
                  </Grid>
                </Grid>
              
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={10} lg={4}>
            <Box >
              <Box>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={6.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>प्राथमिक कर धारकाचे नाव:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.8} mb={1}>
                    <Stack spacing={1}>
                      <TextField InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" value={'विश्वास विनायक मुळे'} placeholder="Enter Unique No." />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={6.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>दुकानाचे नाव /अपार्टमेन्टचे नाव:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.8} mb={1}>
                    <Stack spacing={1}>
               <TextField required fullWidth autoComplete="family-name" 
                  InputProps={{ readOnly: true }}  />       
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={6.2}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>पत्ता :</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.8} mb={1}>
                    <Stack spacing={1}>
                      <TextField  InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" value={'शिरुर , 2, राम आळी, शिरुर'} />
                    </Stack>
                  </Grid>
                </Grid>
               
              </Box>
            </Box>
          </Grid>
          
        </Grid>
       
       
</Grid>
      </MainCard>

    <Box mb={1}></Box>
    <MainCard style={{ backgroundColor: '#e3f2fd' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          <span>हस्तांतरण भरावयाची रक्कम</span>
        </Typography>
      </MainCard>
    <MainCard>   
           <Grid>

        <Grid container spacing={4.5}>
          <Grid item xs={12} md={10} lg={6}>
            <Box>
              <Box>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>हस्तांतरण रक्कम:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name"   value={wardNo}
                  onChange={handleWardNoChange}  />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>माहिती अधिकार फि:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name" />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>इतर फि:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name"  />
                    </Stack>
                  </Grid>
                </Grid>
               
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={10} lg={6}>
            <Box >
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={2.8}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>नक्कल फी :</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name" />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={2.8}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>प्रमाणपत्र फि:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name"/>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={2.8}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>शेरा:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name"  />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Box marginTop={1} sx={{ mb: 0.5 }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
              <Button variant="contained" color="primary" onClick={handleGetProperty} >
Submit                </Button>
              </Stack>
            </Grid>
            
          </Grid>
        </Box>
       
</Grid>
      </MainCard>
      {showTable && (
        <>
              <MainCard>

        <Box mb={1}></Box>
    <MainCard style={{ backgroundColor: '#e3f2fd' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          <span>Pay Property Tax</span>
        </Typography>
      </MainCard>
    <MainCard>   
           <Grid>

        <Grid container spacing={4.5}>
          <Grid item xs={12} md={10} lg={6}>
            <Box>
              <Box>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Email Id:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name"  placeholder='Email'/>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Bill Book No:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack>
                    <Select id="bill-select" value={billBookNo} onChange={handleBillBookChange}>
  <MenuItem value={0}>--Bill Book Number---</MenuItem>
  <MenuItem value={1}>1</MenuItem>
</Select></Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Payment Mode:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                    <Stack>
                    <Select id="payment-select" value={paymentMode} onChange={handlePaymentModeChange}>
                    <MenuItem value={0}>Cash</MenuItem>
                <MenuItem value={1}>Cheque</MenuItem>
  <MenuItem value={2}>DD</MenuItem>
  <MenuItem value={3}>Card Payment</MenuItem>
  <MenuItem value={4}>UPI Payment</MenuItem>
</Select> 

      </Stack>                    </Stack>
                  </Grid>
                  
                </Grid>
                
               
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Transaction Id:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name"  placeholder='Transaction Id'/>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Total Pay Tax:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name"  placeholder='1'/>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={10} lg={6}>
            <Box >
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={2.8}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>
  <span style={{ color: 'red' }}>*</span>Mobile No.:
</InputLabel>                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name" placeholder='Mobile No' value={mobileNo}
                  onChange={handleMobileNoChange}/>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={2.8}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Invoice No:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name" placeholder='Invoice No'/>
                  </Stack>
                </Grid>
              </Grid>

              {/* payment Condition Cheque */}
              {paymentMode === 1 && (
                  <>
    <Box  sx={{ backgroundColor: '#e0f7fa' , padding:'6px'}}> {/* Adjust the padding value as needed */}
          <Grid container spacing={1}  justifyContent="center">
          <Grid item xs={6} sm={3} >
            <Stack sx={{ mt: 1 }} spacing={1}>
            <InputLabel style={{ fontWeight: 'bold' }}>
  <span style={{ color: 'red' }}>*</span>Bank
</InputLabel>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={5.3} mb={1}>
          <Stack>
                    <Select >
                    <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Allahabad Bank</MenuItem>
  <MenuItem value={2}>Andhra Bank</MenuItem>
  <MenuItem value={3}>Axis Bank</MenuItem>
  <MenuItem value={4}>Bank of Baroda</MenuItem>
  <MenuItem  value={6}>Bank of India(BOI)</MenuItem>
  <MenuItem  value={7}>Bank of Maharashtra</MenuItem>
  <MenuItem  value={8}>Buldhana Urban Co-Operative Bank Ltd</MenuItem>
  <MenuItem  value={9}>Canara Bank</MenuItem>
  <MenuItem  value={10}>Central Bank of India</MenuItem>

</Select> 

      </Stack>      
          </Grid>
        </Grid>
         <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={3}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>
  <span style={{ color: 'red' }}>*</span>Cheque/DD No:
</InputLabel>                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name"  placeholder='Cheque/DD No.'/>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={3}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>
  <span style={{ color: 'red' }}>*</span>Cheque/DD Date:
</InputLabel>                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} >
                  <Stack spacing={0}>

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DatePicker']}>
    <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
  </DemoContainer>
</LocalizationProvider>
</Stack>
                  </Grid>
                </Grid></Box>
                </>
        )}
             
             {/* payment Condition DD */}
             {paymentMode === 2 && (
                  <>
    <Box  sx={{ backgroundColor: '#e0f7fa' , padding:'6px'}}> {/* Adjust the padding value as needed */}
          <Grid container spacing={1}  justifyContent="center">
          <Grid item xs={6} sm={3} >
            <Stack sx={{ mt: 1 }} spacing={1}>
            <InputLabel style={{ fontWeight: 'bold' }}>
  <span style={{ color: 'red' }}>*</span>Bank
</InputLabel>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={5.3} mb={1}>
          <Stack>
                    <Select >
                    <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Allahabad Bank</MenuItem>
  <MenuItem value={2}>Andhra Bank</MenuItem>
  <MenuItem value={3}>Axis Bank</MenuItem>
  <MenuItem value={4}>Bank of Baroda</MenuItem>
  <MenuItem  value={6}>Bank of India(BOI)</MenuItem>
  <MenuItem  value={7}>Bank of Maharashtra</MenuItem>
  <MenuItem  value={8}>Buldhana Urban Co-Operative Bank Ltd</MenuItem>
  <MenuItem  value={9}>Canara Bank</MenuItem>
  <MenuItem  value={10}>Central Bank of India</MenuItem>

</Select> 

      </Stack>      
          </Grid>
        </Grid>
         <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={3}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>
  <span style={{ color: 'red' }}>*</span>Cheque/DD No:
</InputLabel>                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name"  placeholder='Cheque/DD Date'/>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={3}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>
  <span style={{ color: 'red' }}>*</span>Cheque/DD Date:
</InputLabel>                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} >
                  <Stack spacing={0}>

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DemoContainer components={['DatePicker']}>
    <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
  </DemoContainer>
</LocalizationProvider>
</Stack>
                  </Grid>
                </Grid></Box>
                </>
        )}

          {/* payment Condition Card */}
          {paymentMode === 3 && (
                  <>
    <Box  sx={{ backgroundColor: '#e0f7fa' , padding:'6px'}}> 
        
         <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={3}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>
Paid Ref.ID:</InputLabel>                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name"  placeholder='RefNo.'/>
                    </Stack>
                  </Grid>
                </Grid>
                
              </Box>
                </>
        )}
             
            </Box>
           
          </Grid>
        </Grid>
        <Box marginTop={2} >
          <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12} sm={1}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>Pay</InputLabel>
                  </Stack>
                </Grid>
            <Grid item xs={12} sm={2} >
              <Stack spacing={1} mb={2}>
              <Button variant="contained" color="primary" onClick={handlePayProperty} >
Pay Now                </Button>  <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        {/* <DialogTitle id="alert-dialog-title">NTIS L1</DialogTitle> */}
        <DialogContent>
          <Stack marginBottom={1}>
            <DialogContentText id="alert-dialog-description">Enter Amount</DialogContentText>
          </Stack>
          <TextField required fullWidth maxWidth="sm"></TextField>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleCloseDialog} autoFocus>
            Pay
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog> 
              </Stack>
                     
            </Grid>
            
          </Grid>
      

        </Box>
       
</Grid>
{showAlert && (
  <Grid container spacing={2} justifyContent="center" alignItems="center">
    <Grid item xs={12} sm={7} justifyContent="center">
       <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                  Please Fill Pay Property Tax
                  </Alert>
                </Snackbar>
    </Grid>
  </Grid>
)}

      </MainCard>
        </MainCard>
        </>
       
      )}
    </MainCard>
    </>
  );
}

export default GetPropertyTransferFee;
