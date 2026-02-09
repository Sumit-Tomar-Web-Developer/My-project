// material-ui
import { Grid, InputLabel, Stack, TextField,Box,Typography,Accordion, AccordionDetails, AccordionSummary, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControlLabel, Checkbox, CardContent, Card, FormGroup, Button } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useNavigate } from 'react-router';


// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

function ApprovalMutation({ApprovalButton}) {
  //navigate
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/transaction/mutation-approval');
  };
 

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
    anchor.download = 'C:\Users\DELL\Downloads\अर्ज.pdf';
    anchor.click();
  };
  const handleDownloadPDFs = () => {
    const pdfURL = 'path/to/your/pdf.pdf';
    const anchor = document.createElement('a');
    anchor.href = pdfURL;
    anchor.download = 'C:\Users\DELL\Downloads\फेरफार_कागदपत्र.pdf';
    anchor.click();
  };
  //show img
  const [isOpen, setIsOpen] = useState(false);

  function toggle(e) {
    setIsOpen((isOpen) => !isOpen);
    e.preventDefault();
}
 
    // const [age, setAge] = useState('');
    // const handleChange = (event) => {
    //     setAge(event.target.value);
    //   };

      
  return (
    <>
    <MainCard title="Changes Approval">
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
   


 <Grid container spacing={3} justifyContent="center" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}> 
 

 <Grid item xs={6} sm={3} >
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>वार्ड क्र. </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3}  mb={1}>
                  <Stack spacing={1}>
                  <TextField  type="text" value={'D_3'}></TextField>
               </Stack>
                </Grid>


 </Grid>




</Grid>

<Grid item xs={12} md={10} lg={4}>
   
 <Grid container spacing={3} justifyContent="center" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}> 
 

 <Grid item xs={6} sm={3} >
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता क्र.</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6.3}  mb={1}>
                  <Stack spacing={1}>
                  <TextField  type="text" value={' 627'}></TextField>
               </Stack>
                </Grid>


 </Grid>




</Grid>




<Grid item xs={12} md={10} lg={5}>
   


 <Grid container spacing={0} justifyContent="center" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}> 
 

 <Grid item xs={6} sm={4.5} >
                  <Stack spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>प्राथमिक कर धारकाचे नाव  </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={6.2}  mb={1}>
                  <Stack spacing={0}>
                  <TextField  type="text" value={'प्रशांत प्रभाकर सुर्यवंशी'}></TextField>
               </Stack>
                </Grid>


 </Grid>



</Grid>

    </Grid>
    {/* 2nd heading*/}
    <Grid container spacing={1.5} mb={'1vw'} justifyContent="center">
    <Grid item xs={12} md={10} lg={4}>

    <Box sx={{ 
    display: 'flex', 
    alignItems: 'center',
    border: '2px solid #ccc',
    borderRadius: '8px',
    padding: '4px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)', // Adding box shadow
}}>
<Typography variant="h5" gutterBottom sx={{ color: 'blue', fontWeight: 'bold', textAlign: 'center', margin: 'auto', marginBottom: '1vw' }}>
Mutation Entry Changes: (APPROVED)
    </Typography>
</Box></Grid></Grid>

 
{/* 1st table */}
   <MainCard  >

<Grid container spacing={5}  mb={1} > 

        <Grid item xs={12} md={10} lg={6} >
        <Typography variant="h5" style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'0.6vw' }}>
        Property Owner Details Original

    </Typography>
    
        <TableContainer >
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
                <TableCell className="font-weight-bold">Shop/Bld.Name	</TableCell>
                <TableCell className="font-weight-bold">Shop/Flat No.</TableCell>
               

              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>
                  <FormControlLabel control={<Checkbox />} />
                </TableCell>
                <TableCell>श्री</TableCell>
                <TableCell>प्रशांत</TableCell>
                <TableCell>प्रभाकर</TableCell>
                <TableCell>सुर्यवंशी</TableCell>
                <TableCell>	आदर्श नगर</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>Mr</TableCell>
                <TableCell>Prashant</TableCell>
                <TableCell>Prabhakar</TableCell>
                <TableCell>Suryawanshi</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
             
            </TableBody>
          </Table>
        </TableContainer>
               
   
</Grid>

{/* table 4th line 2nd */}

<Grid item xs={12} md={10} lg={6} >
<Typography variant="h5" style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'1.3vw' }}>
       
    </Typography>
   <TableContainer >
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
                <TableCell className="font-weight-bold">Shop/Bld.Name	</TableCell>
                <TableCell className="font-weight-bold">Shop/Flat No.</TableCell>
               

              </TableRow>
            </TableHead>
       <TableBody >
        
         <TableRow style={{backgroundColor:'#ffcdd2'}}>
                <TableCell style={{ textAlign: 'center' }}>
                  <FormControlLabel control={<Checkbox />} />
                </TableCell>
                <TableCell>श्री</TableCell>
                <TableCell>प्रशांत</TableCell>
                <TableCell>प्रभाकर</TableCell>
                <TableCell>सुर्यवंशी</TableCell>
                <TableCell>	आदर्श नगर</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>Mr</TableCell>
                <TableCell>Prashant</TableCell>
                <TableCell>Prabhakar</TableCell>
                <TableCell>Suryawanshi</TableCell>
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




{/* 4th renter Deatils */}
<MainCard  >

<Grid container spacing={5}  mb={1} > 
<Grid item xs={12} md={10} lg={6} >

<Typography variant="h5"   mb={1} style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'0.6vw' }}>
Renter Mutation Details Original 


</Typography>
<Box sx={{ overflowX: 'auto', height: '164px' }}>

{/* <Grid container spacing={2}  >

<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Plot Area Type</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}   mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>खुल्या भूखंडाच्या भो.प्रथम नाव	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}   mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>मधले नाव</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid>  */}
{/* <Grid container spacing={2}  >

<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    आडनाव</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Wadh Ghat Remark</InputLabel>
    <TextField required fullWidth maxWidth="sm"  
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Plot Taxable Area(SqFt)</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={'0'}
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 

<Grid container spacing={2}  >

<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    WadhGhatDocument</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Occupier Name (OP)	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>भोगवाटदाराचे नाव(OP)
</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid>  */}
</Box>

</Grid>

{/* table 4th line 2nd for 4nd table */}

<Grid item xs={12} md={10} lg={6} >
<Typography variant="h5"   mb={1} style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'0.6vw' }}>
Renter Mutation Details Changes

</Typography>

    {/* <Grid container spacing={2}  >

<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Plot Area Type</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}   mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>खुल्या भूखंडाच्या भो.प्रथम नाव	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}   mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>मधले नाव</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 

<Grid container spacing={2}  >

<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    आडनाव</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Wadh Ghat Remark</InputLabel>
    <TextField required fullWidth maxWidth="sm"  value={'लिपिक माहितीनुस'}
           style={{ backgroundColor: '#ff8a80' }}

      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Plot Taxable Area(SqFt)</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={'0'}
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 

<Grid container spacing={2}  >

<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    WadhGhatDocument</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={'स्थळपाहणी अहवाल'}
           style={{ backgroundColor: '#ff8a80' }}

      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Occupier Name (OP)	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>भोगवाटदाराचे नाव(OP)
</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid>   */}


        


</Grid>


</Grid>

</MainCard>




{/* 5th Old Information deatils */}
<MainCard  >

<Grid container spacing={5}  mb={1} > 
<Grid item xs={12} md={10} lg={6} >

<Typography variant="h5"  mb={1}  style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'0.6vw' }}>
Property Mutation Document Original

</Typography>
<Grid container spacing={2}  >

<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Old Owner Purchase Date	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  value={'23/02/2024'}
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>New Owner Purchase Date	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  value={'New'}
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Order No</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 

<Grid container spacing={2}>

<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Transfer Date	</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={'08/04/2024'}

       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Remark</InputLabel>
    <TextField required fullWidth maxWidth="sm"  value={'आदेशानुसार'}
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>FerFar Document</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={'अर्ज'}
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 


</Grid>

{/* table 4th line 2nd for3nd table */}

<Grid item xs={12} md={10} lg={6} >
<Typography variant="h5" mb={1} style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'1.3vw' }}>
Property Mutation Document Changes

    </Typography>

    <Grid container spacing={2}  >

<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Old Owner Purchase Date	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  value={'23/02/2024'}
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>New Owner Purchase Date	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  value={'23/02/2024'}
       style={{backgroundColor:'#ffcdd2'}}
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Order No</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 

<Grid container spacing={2}>

<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Transfer Date	</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={'08/04/2024'}

       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Remark</InputLabel>
    <TextField required fullWidth maxWidth="sm"  value={'आदेशानुसार'}
       style={{backgroundColor:'#ffcdd2'}}
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>FerFar Document</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={'अर्ज'}
       
      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 


        


</Grid>


</Grid>

</MainCard>


{/* 12 Images */}

<MainCard  >

<Grid container spacing={5}  mb={1} > 

<Grid item xs={12} md={10} lg={6} >
<Box sx={{ display: 'flex', alignItems: 'center', backgroundColor:'#b2dfdb',padding:'0.2vw'}}>
    <Typography variant="h5" mt={2} ml={4 } gutterBottom sx={{  fontWeight: 'bold', marginRight: 'auto' }}>
    Uploaded Document

    </Typography>
    <Button variant="contained"    onClick={toggle} color="primary" size="small">
        Show Download
    </Button>
</Box>    

{isOpen && (
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
          
          <Box sx={{ overflowX: 'auto'}} >

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
                  <TableRow >
                    <TableCell>अर्ज</TableCell>
                    <TableCell>  <Button variant="contained"   color="primary" size="small" onClick={handleDownloadPDF}>
        View Documents
    </Button></TableCell>
                    </TableRow>

                    <TableRow >

                    <TableCell>फेरफार कागदपत्र</TableCell>
                    <TableCell>  <Button variant="contained"   color="primary" size="small" onClick={handleDownloadPDFs}>
        View Documents
    </Button></TableCell>
                    </TableRow >
                   
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




{/* table 12th line 2nd for3nd table */}




</Grid>
</MainCard>



{/* last */}
<MainCard>
<Grid item xs={12} sm={12} >
<Typography variant="h5" mb={1}  style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'0.6vw' }}>
Data Entry Changes Approve/Disapprove

</Typography>
<Grid container spacing={3} justifyContent="center" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}> 
 

 <Grid item xs={6} sm={1.2}>
                  <Stack  spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>वाढ-घट शेरा: </InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3}  mb={1} mt={1}>
                  <Stack spacing={1}>
                  <TextField
                required
                Width
                autoComplete="family-name"
                value={'Ok'}
                sx={{ mt: 3}}              />                  </Stack>
                </Grid>

                <Grid container spacing={3} justifyContent="center" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}> 
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

export default ApprovalMutation;
