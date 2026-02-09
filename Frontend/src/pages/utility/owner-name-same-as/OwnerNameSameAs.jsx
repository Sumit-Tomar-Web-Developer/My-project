// // material-ui
// import {
//   Grid,
//   InputLabel,
//   Stack,
//   TextField,
//   Accordion,
//   AccordionDetails,
//   Radio,
//   AccordionSummary,
//   Select,
//   MenuItem,
//   FormControl,
//   OutlinedInput,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Typography,
//   Button,
//   TableRow,
//   TableCell,
//   Table,
//   TableHead,
//   TableBody,
//   Card,
//   CardContent
// } from '@mui/material';
// import { Box } from '@mui/system';
// import { useState } from 'react';

// // project import
// import MainCard from 'components/MainCard';

// // ==============================|| SAMPLE PAGE ||============================== //

// function OwnerNameSameAs() {
//   //table
//   const [showPropertyTable, setshowPropertyTable] = useState(false);
//   const handleShowPropertyClick = () => {
//     setshowPropertyTable(!showPropertyTable);
//   };
//   //show exting

//   const [showPropertyExitNames, setshowPropertyExitNames] = useState(false);
//   const handleToggleExitNames = () => {
//     setshowPropertyExitNames(!showPropertyExitNames);
//   };
//   const [englishName, setEnglishName] = useState(false);
//   const [marathiName, setMarathiName] = useState(false);

//   const handleEnglishCheckboxChange = () => {
//     setEnglishName(!englishName);
//   };

//   const handleMarathiCheckboxChange = () => {
//     setMarathiName(!marathiName);
//   };

//   //name Like
//   const [nameLikeChecked, setNameLikeChecked] = useState(false);

//   const handleCheckboxChanges = () => {
//     setNameLikeChecked(!nameLikeChecked);
//   };
//   //property
//   const [selectedPropertyNumbers, setselectedPropertyNumbers] = useState([]);

//   const handleOwnerNumberChange = (event) => {
//     setselectedPropertyNumbers(event.target.value);
//   };
//   const number = [1, 2, 3, 4, 5, 6, 7, 8, 9];
//   //to pro
//   const [selectedPropertyNumbersTo, setselectedPropertyNumbersTo] = useState([]);

//   const handlePropertyNumberChangeTo = (event) => {
//     setselectedPropertyNumbersTo(event.target.value);
//   };
//   const numbersTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];
//   //ward
//   const [selectedPropertyWard, setselectedPropertyWard] = useState('');
//   const handleWardChange = (event) => {
//     setselectedPropertyWard(event.target.value);
//   };
//   //wardLike
//   const [nameLikePropertyWardChecked, setnameLikePropertyWardChecked] = useState(false);

//   const handleCheckboxChangesWard = () => {
//     setnameLikePropertyWardChecked(!nameLikePropertyWardChecked);
//   };
//   return (
//     <MainCard title="Name Same As">
//       <Grid container spacing={1} justifyContent="center">
//         <Grid item xs={12} sm={2}>
//           <Stack spacing={1}>
//             <InputLabel>Ward No</InputLabel>

//             <Select id="ward-select" placeholder="ward no" value={selectedPropertyWard} onChange={handleWardChange}>
//               <MenuItem value="">Select Ward No</MenuItem>
//               <MenuItem value="1">1</MenuItem>
//               <MenuItem value="2">2</MenuItem>
//               <MenuItem value="3">3</MenuItem>
//             </Select>
//           </Stack>
//         </Grid>
//         <Grid item xs={12} sm={2}>
//           <Stack spacing={1}>
//             <InputLabel id="demo-number-select-label">From Properties</InputLabel>
//             <FormControl fullWidth>
//               {/* <Select
//             labelId="demo-number-select-label"
//             id="demo-number-select"
//             multiple
//             value={selectedPropertyNumbers}
//             onChange={handleOwnerNumberChange}
//             input={<OutlinedInput placeholder="Enter Number" />}
//             renderValue={(selected) => selected.join(', ')} 
//           >
//             {numbers.map((number) => (
//               <MenuItem key={number} value={number}>
//                 <Checkbox checked={selectedPropertyNumbers.indexOf(number) > -1} />
//                 {number}
//               </MenuItem>
//             ))}
//           </Select> */}
//               <Select value={selectedPropertyNumbers} onChange={handleOwnerNumberChange}>
//                 <MenuItem value="">Select Ward No</MenuItem>
//                 <MenuItem value="1">1</MenuItem>
//                 <MenuItem value="2">2</MenuItem>
//                 <MenuItem value="3">3</MenuItem>
//               </Select>
//             </FormControl>
//           </Stack>
//         </Grid>
//         <Grid item xs={12} sm={2}>
//           <Stack spacing={1}>
//             <InputLabel id="demo-number-select-label">To Properties</InputLabel>
//             <FormControl fullWidth>
//               {/* <Select
//             labelId="demo-number-select-label"
//             id="demo-number-select"
//             multiple
//             value={selectedPropertyNumbersTo}
//             onChange={handlePropertyNumberChangeTo}
//             input={<OutlinedInput placeholder="Enter Number" />}
//             renderValue={(selectedTo) => selectedTo.join(', ')} 
//           >
//             {numbersTo.map((number) => (
//               <MenuItem key={number} value={number}>
//                 <Checkbox checked={selectedPropertyNumbersTo.indexOf(number) > -1} />
//                 {number}
//               </MenuItem>
//             ))}
//           </Select> */}
//               <Select value={selectedPropertyNumbersTo} onChange={handlePropertyNumberChangeTo}>
//                 <MenuItem value="">Select Ward No</MenuItem>
//                 <MenuItem value="1">1</MenuItem>
//                 <MenuItem value="2">2</MenuItem>
//                 <MenuItem value="3">3</MenuItem>
//               </Select>
//             </FormControl>
//           </Stack>
//         </Grid>
//         <Grid item xs={10} mb={3}>
//           <FormGroup row alignItems="center" justifyContent="center" sx={{ gap: 4, marginLeft: '18vw' }}>
//             <FormControlLabel control={<Checkbox />} label="English Name" />
//             <FormControlLabel control={<Checkbox />} label="Marathi Name" />
//             <FormControlLabel control={<Checkbox />} label="Select All" />
//           </FormGroup>
//         </Grid>
//         {/* button */}
//         <Grid item xs={12} md={1} lg={12} mb={2}>
//           <Grid container justifyContent="center" alignItems="center">
//             <Stack spacing={1} sx={{ textAlign: 'center' }}>
//               {/* <Button variant="contained" color="info" size="large" onClick={handleToggleExitNames}
//                 {showPropertyExitNames ? "Hide Exit Names" : "Show Exit Names"}>
//                  Show Existing Names 
//               </Button> */}
//               <Button variant="contained" color="success" size="large" onClick={handleToggleExitNames}>
//                 {showPropertyExitNames ? "Show Existing Names" : "Show Existing Names "}
//               </Button>
//             </Stack>
//           </Grid>
//         </Grid>
//         {/* 2column */}

//         <MainCard>
//           <Grid container spacing={2.5}>
//             <Grid item xs={12} md={10} lg={5}>
//               <Box marginTop={2}>
//                 <Accordion>
//                   <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
//                     Name Like
//                   </AccordionSummary>
//                   <AccordionDetails sx={{ flexDirection: 'column' }}>
//                     <FormControlLabel
//                       control={<Checkbox />}
//                       label="Name Like"
//                       value=""
//                       checked={nameLikeChecked}
//                       onChange={handleCheckboxChanges}
//                     />

//                     <Grid container spacing={2} mb={2} sx={{ marginTop: 0.1 }}>
//                       <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', width: '40vw' }}>
//                         <Stack sx={{ width: '100%' }}>
//                           <InputLabel>प्रथम नाव</InputLabel>
//                           <TextField
//                             required
//                             fullWidth
//                             maxWidth="sm"
//                             className={`form-control text-center ${!nameLikeChecked ? 'disabled' : ''}`}
//                             name="wdName"
//                             id="wdName"
//                             onChange={handleMarathiCheckboxChange}
//                             disabled={!nameLikeChecked}
//                           ></TextField>
//                         </Stack>
//                       </Grid>
//                       <Grid item xs={6} sm={6} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
//                         <Stack sx={{ width: '100%' }}>
//                           <InputLabel>First Name</InputLabel>
//                           <TextField
//                             required
//                             fullWidth
//                             maxWidth="sm"
//                             className={`  form-control text-center ${!nameLikeChecked ? 'disabled' : ''}`}
//                             name="wdName"
//                             id="wdName"
//                             onChange={handleEnglishCheckboxChange}
//                             disabled={!nameLikeChecked}
//                           ></TextField>
//                         </Stack>
//                       </Grid>
//                     </Grid>
//                     <Grid container spacing={2} mb={2} sx={{ marginTop: 0.1 }}>
//                       <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
//                         <Stack sx={{ width: '100%' }}>
//                           <InputLabel> मधले नाव</InputLabel>
//                           <TextField
//                             required
//                             fullWidth
//                             maxWidth="sm"
//                             className={`form-control text-center ${!nameLikeChecked ? 'disabled' : ''}`}
//                             name="wdName"
//                             id="wdName"
//                             onChange={handleMarathiCheckboxChange}
//                             disabled={!nameLikeChecked}
//                           ></TextField>
//                         </Stack>
//                       </Grid>
//                       <Grid item xs={6} sm={6} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
//                         <Stack sx={{ width: '100%' }}>
//                           <InputLabel>Middle Name</InputLabel>
//                           <TextField
//                             required
//                             fullWidth
//                             maxWidth="sm"
//                             className={`  form-control text-center ${!nameLikeChecked ? 'disabled' : ''}`}
//                             name="wdName"
//                             id="wdName"
//                             onChange={handleEnglishCheckboxChange}
//                             disabled={!nameLikeChecked}
//                           ></TextField>
//                         </Stack>
//                       </Grid>
//                     </Grid>
//                     <Grid container spacing={2} mb={2} sx={{ marginTop: 0.1 }}>
//                       <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
//                         <Stack sx={{ width: '100%' }}>
//                           <InputLabel>आडनाव</InputLabel>
//                           <TextField
//                             required
//                             fullWidth
//                             maxWidth="sm"
//                             className={`form-control text-center ${!nameLikeChecked ? 'disabled' : ''}`}
//                             name="wdName"
//                             id="wdName"
//                             onChange={handleMarathiCheckboxChange}
//                             disabled={!nameLikeChecked}
//                           ></TextField>
//                         </Stack>
//                       </Grid>
//                       <Grid item xs={6} sm={6} mb={2} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
//                         <Stack sx={{ width: '100%' }}>
//                           <InputLabel>Last Name</InputLabel>
//                           <TextField
//                             required
//                             fullWidth
//                             maxWidth="sm"
//                             className={`  form-control text-center ${!nameLikeChecked ? 'disabled' : ''}`}
//                             name="wdName"
//                             id="wdName"
//                             onChange={handleEnglishCheckboxChange}
//                             disabled={!nameLikeChecked}
//                           ></TextField>
//                         </Stack>
//                       </Grid>
//                     </Grid>
//                   </AccordionDetails>
//                 </Accordion>
//               </Box>
//             </Grid>
//             {/* 2nd */}
//             <Grid item xs={12} md={5} lg={2}>
//               <Typography sx={{ mb: 5, mt: 6, ml: 7 }} variant="h1" style={{ color: 'red', fontWeight: 'bold' }}>
//                 OR
//               </Typography>
//             </Grid>

//             {/* 3rd */}
//             <Grid item xs={12} md={10} lg={5}>
//               <Box marginTop={2}>
//                 <Accordion>
//                   <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
//                     Name Like
//                   </AccordionSummary>
//                   <AccordionDetails sx={{ flexDirection: 'column' }}>
//                     <FormControlLabel
//                       control={<Checkbox />}
//                       label="Name Like"
//                       checked={nameLikePropertyWardChecked}
//                       onChange={handleCheckboxChangesWard}
//                     />
//                     <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
//                       <Grid item xs={6} sm={6} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
//                         <Stack sx={{ width: '100%' }}>
//                           <InputLabel>Ward</InputLabel>
//                           <Select id="year-select" placeholder="year" disabled={!nameLikePropertyWardChecked}>
//                             <MenuItem value={1}>1</MenuItem>
//                             <MenuItem value={2}>2</MenuItem>
//                             <MenuItem value={3}>3</MenuItem>
//                           </Select>
//                         </Stack>
//                       </Grid>
//                       <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
//                         <Stack sx={{ width: '100%' }}>
//                           <InputLabel>Property No.</InputLabel>
//                           <Select id="year-select" placeholder="year" disabled={!nameLikePropertyWardChecked}>
//                             <MenuItem value={1}>1</MenuItem>
//                             <MenuItem value={2}>2</MenuItem>
//                             <MenuItem value={3}>3</MenuItem>
//                           </Select>
//                         </Stack>
//                       </Grid>
//                     </Grid>

//                     {/* button */}
//                     <Grid item xs={12} md={1} lg={12} mb={1}>
//                       <Grid container justifyContent="center" alignItems="center">
//                         <Stack spacing={1} sx={{ textAlign: 'center' }}>
//                           <Button variant="contained" color="success" size="large" onClick={handleShowPropertyClick}>
//                             Show Names
//                           </Button>
//                         </Stack>
//                       </Grid>
//                     </Grid>
//                     {/* Table */}
//                     {showPropertyTable && (
//                       <Box sx={{ overflowX: 'auto', height: '200px' }}>
//                         <Table>
//                           {/* Table Header */}
//                           <TableHead style={{ backgroundColor: '#F5F5F5' }}>
//                             <TableRow>
//                               <TableCell>Owner Id</TableCell>
//                               <TableCell>Marathi Owner Pratham Nav</TableCell>
//                               <TableCell>Marathi Owner Madhle Nav</TableCell>
//                               <TableCell>Marathi Owner AadNav</TableCell>
//                               <TableCell>Owner First Name</TableCell>
//                               <TableCell>Owner Middle Name </TableCell>
//                               <TableCell>Owner Last Name </TableCell>
//                               <TableCell>IsPrime</TableCell>
//                             </TableRow>
//                           </TableHead>

//                           {/* Table Body */}
//                           <TableBody>
//                             <TableRow>
//                               <TableCell>B640</TableCell>
//                               <TableCell>देविदास</TableCell>
//                               <TableCell>विठ्ठल</TableCell>
//                               <TableCell>पाटील</TableCell>
//                               <TableCell>Devidas</TableCell>
//                               <TableCell>Vithal</TableCell>
//                               <TableCell>Patil</TableCell>
//                               <TableCell>True</TableCell>
//                             </TableRow>
//                             <TableRow>
//                               <TableCell>B640</TableCell>
//                               <TableCell></TableCell>
//                               <TableCell></TableCell>
//                               <TableCell></TableCell>
//                               <TableCell></TableCell>
//                               <TableCell></TableCell>
//                               <TableCell></TableCell>
//                               <TableCell>True</TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>0</TableCell>
//                               <TableCell>0</TableCell>
//                               <TableCell>1.2</TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>0</TableCell>
//                               <TableCell>0</TableCell>
//                               <TableCell>1.2</TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>0</TableCell>
//                               <TableCell>0</TableCell>
//                               <TableCell>1.2</TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>0</TableCell>
//                               <TableCell>0</TableCell>
//                               <TableCell>1.2</TableCell>
//                             </TableRow>

//                             <TableRow>
//                               <TableCell>0</TableCell>
//                               <TableCell>0</TableCell>
//                               <TableCell>1.2</TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </Box>
//                     )}
//                   </AccordionDetails>
//                 </Accordion>
//               </Box>
//             </Grid>
//           </Grid>
//         </MainCard>
//       </Grid>
//       {showPropertyExitNames && (
//         <>
//           <Box style={{ marginTop: '1px', marginRight: '1vw' }}>
//             <Card>
//               <CardContent>
//                 <Box sx={{ overflowX: 'auto', height: '200px', width: '80vw' }}>
//                   {/* Table */}
//                   <Table>
//                     {/* Table Header */}
//                     <TableHead style={{ backgroundColor: '#F5F5F5' }}>
//                       <TableRow>
//                         <TableCell>New Ward No.</TableCell>
//                         <TableCell>Properties No</TableCell>
//                         <TableCell>Is Prime</TableCell>
//                       </TableRow>
//                     </TableHead>

//                     {/* Table Body */}
//                     <TableBody>
//                       <TableRow>
//                         <TableCell>2</TableCell>
//                         <TableCell>1</TableCell>
//                         <TableCell>True</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>2</TableCell>
//                         <TableCell>2</TableCell>
//                         <TableCell>True</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>2</TableCell>
//                         <TableCell>2</TableCell>
//                         <TableCell>True</TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//         </>
//       )}
//     </MainCard>
//   );
// }

// export default OwnerNameSameAs;

// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Accordion,
  AccordionDetails,
  Radio,
  AccordionSummary,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Button,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
  Card,
  CardContent
} from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

// project import
import MainCard from 'components/MainCard';
//Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// ==============================|| SAMPLE PAGE ||============================== //

function OwnerNameSameAs() {
  //Address///////////////////////

//table
const [showPropertyTable, setshowPropertyTable] = useState(false);
const handleShowPropertyClick = () => {
  setshowPropertyTable(!showPropertyTable);
};
//show exting

const [showExitProperty, setshowExitProperty] = useState(false);
const handleToggleExitProperty = () => {
  setshowExitProperty(!showExitProperty);
};


//name Like
const [nameLikePropertyChecked, setnameLikePropertyChecked] = useState(false);

const handlePropertyCheckboxChanges = () => {
  setnameLikePropertyChecked(!nameLikePropertyChecked);
};
//property
const [selectedPropertyNumbers, setselectedPropertyNumbers] = useState([]);

const handlePropertyNumberChange = (event) => {
  setselectedPropertyNumbers(event.target.value);
};
//to pro
const [selectedPropertyNumbersTo, setselectedPropertyNumbersTo] = useState([]);

const handlePropertyNumberChangeTo = (event) => {
  setselectedPropertyNumbersTo(event.target.value);
};
//ward
const [selectedPropertyWard, setselectedPropertyWard] = useState('');

//wardLike
const [nameLikePropertyWardChecked, setnameLikePropertyWardChecked] = useState(false);

const handleCheckboxChangesPropertyWard = () => {
  setnameLikePropertyWardChecked(!nameLikePropertyWardChecked);
};

    //dialog Road
    const [openDialogProperty, setopenDialogProperty] = useState(false);
 const handleClickDialogProperty = () => {
   setopenDialogProperty(true);
 };
 const handleCloseDialogProperty = () => {
   setopenDialogProperty(false);
 };
  return (
    <>
    <MainCard >
    <Grid container spacing={1} justifyContent="center" alignItems="center">
  
    <Grid item xs={12}>
            <Box textAlign="left" my={2}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
               Property Type
              </Typography>
            </Box>
          </Grid>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Ward No</InputLabel>
  
            <Select id="ward-select" placeholder="ward no" value={selectedPropertyWard}>
              <MenuItem value="">Select Ward No</MenuItem>
              
            </Select>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel id="demo-number-select-label">From Properties</InputLabel>
            <FormControl fullWidth>
              
              <Select value={selectedPropertyNumbers} >
                <MenuItem value="">Select Ward No</MenuItem>
               
              </Select>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel id="demo-number-select-label">To Properties</InputLabel>
            <FormControl fullWidth>
            
              <Select value={selectedPropertyNumbersTo} onChange={handlePropertyNumberChangeTo}>
                <MenuItem value="">Select Ward No</MenuItem>
              
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      
        {/* button */}
        <Grid item xs={12} md={1} lg={12} mb={2}>
          <Grid container justifyContent="center" alignItems="center">
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              {/* <Button variant="contained" color="info" size="large" onClick={handleToggleExitNames}
                {showPropertyExitNames ? "Hide Exit Names" : "Show Exit Names"}>
                 Show Existing Names 
              </Button> */}
              <Button variant="contained" color="success" size="large" onClick={handleToggleExitProperty}>
                {showExitProperty ? "Show Existing Names" : "Show Existing Names "}
              </Button>
            </Stack>
          </Grid>
        </Grid>
  
        </Grid>
    
  
        {/* 2column */}
  
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={10} lg={5}>
            <Box marginTop={2} marginLeft={2.2} >
                <Accordion>
                  <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                    Name Like
                  </AccordionSummary>
                  <AccordionDetails sx={{ flexDirection: 'column' }}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Name Like"
                      value=""
                      checked={nameLikePropertyChecked}
                      onChange={handlePropertyCheckboxChanges}
                    />
  
  <Grid container spacing={2} sx={{ marginTop: 0.1, justifyContent: 'center', alignItems: 'center' }}>
  <Grid item xs={6} sm={8} style={{ display: 'flex', flexDirection: 'row', width: '40vw', justifyContent: 'center' }}>
    <Stack sx={{ width: '100%' }}>
      <InputLabel>Select Property Description</InputLabel>
      <Select
        required
        fullWidth
        maxWidth="sm"
        className={`form-control text-center ${!nameLikePropertyChecked ? 'disabled' : ''}`}
        disabled={!nameLikePropertyChecked}
        >
        <MenuItem value={0}>Select Property Description</MenuItem>
        <MenuItem value={1}>निवासी</MenuItem>
        <MenuItem value={2}>खाजगी शाळा</MenuItem> 
        <MenuItem value={3}>न. प. शाळा</MenuItem>
        <MenuItem value={4}>शासकीय शाळा</MenuItem>
        <MenuItem value={5}>डिस्पेन्सरी</MenuItem>  
        <MenuItem value={6}>खाजगी रुग्णालय</MenuItem>
        <MenuItem value={7}>शासकीय रुग्णालय</MenuItem>
        <MenuItem value={8}> प्राथमिक आरोग्य केंद्र</MenuItem> 
         <MenuItem value={9}> न. प चे रुग्णालय</MenuItem>
        <MenuItem value={10}>  मंगल कार्यालय/टॉकीज</MenuItem>
        <MenuItem value={11} >  बँक वित्तीय संस्थाe</MenuItem> 
      </Select> 
    </Stack>
  </Grid>
  
  <Grid item xs={6} sm={5}  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
    <Stack sx={{ width: '100%' }}>
    <Button variant="contained" color="success" onClick={handleClickDialogProperty}>
                 Update
                </Button>
                <Dialog open={openDialogProperty} onClose={handleCloseDialogProperty} fullWidth maxWidth="xs">
                  <DialogTitle id="alert-dialog-title" style={{ fontSize: '20px', fontWeight: 'bold' }}>Update Address</DialogTitle>
                  <DialogContent>
                    <Stack marginBottom={2}>
                    <DialogContentText id="alert-dialog-description" align="center" style={{ fontSize: '15px'}}>
  Do you want to update your address?
  </DialogContentText>                    </Stack>
                  </DialogContent>
                  <DialogActions>
                    <Button variant="contained" color="success"  onClick={handleCloseDialogProperty} autoFocus>
                    Yes
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCloseDialogProperty} autoFocus>
                    No
                    </Button>
                  </DialogActions>
                </Dialog>
    </Stack>
  </Grid>
  <Grid item xs={6} sm={5}>
              <Stack spacing={1}>
                <Button variant="contained" color="secondary">
                 clear
                </Button>
              </Stack>
            </Grid> 
  </Grid>
  
                   
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
            {/* 2nd */}
            <Grid item xs={12} md={5} lg={2}>
              <Typography sx={{ mb: 5, mt: 6, ml: 7 }} variant="h1" style={{ color: 'red', fontWeight: 'bold' }}>
                OR
              </Typography>
            </Grid>
  
            {/* 3rd */}
            <Grid item xs={12} md={10} lg={5}>
              <Box marginTop={2}>
                <Accordion>
                  <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                    Name Like
                  </AccordionSummary>
                  <AccordionDetails sx={{ flexDirection: 'column' }}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Name Like"
                      checked={nameLikePropertyWardChecked}
                      onChange={handleCheckboxChangesPropertyWard}
                    />
                    <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
                      <Grid item xs={6} sm={6} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack sx={{ width: '100%' }}>
                          <InputLabel>Ward</InputLabel>
                          <Select id="year-select" placeholder="year" disabled={!nameLikePropertyWardChecked}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Stack sx={{ width: '100%' }}>
                          <InputLabel>Property No.</InputLabel>
                          <Select id="year-select" placeholder="year" disabled={!nameLikePropertyWardChecked}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                          </Select>
                        </Stack>
                      </Grid>
                    </Grid>
  
                    {/* button */}
                    <Grid item xs={12} md={1} lg={12} mb={1}>
                      <Grid container justifyContent="center" alignItems="center">
                        <Stack spacing={1} sx={{ textAlign: 'center' }}>
                          <Button variant="contained" color="success" size="large" onClick={handleShowPropertyClick}>
                            Show Names
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                    {/* Table */}
                    {showPropertyTable && (
                      <Box sx={{ overflowX: 'auto', height: '200px' }}>
                        <Table>
                          {/* Table Header */}
                          <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                            <TableRow>
                              <TableCell>Owner Id</TableCell>
                              <TableCell>Marathi Owner Pratham Nav</TableCell>
                              <TableCell>Marathi Owner Madhle Nav</TableCell>
                              <TableCell>Marathi Owner AadNav</TableCell>
                              <TableCell>Owner First Name</TableCell>
                              <TableCell>Owner Middle Name </TableCell>
                              <TableCell>Owner Last Name </TableCell>
                              <TableCell>IsPrime</TableCell>
                            </TableRow>
                          </TableHead>
  
                          {/* Table Body */}
                          <TableBody>
                            
                          </TableBody>
                        </Table>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>
      {showExitProperty && (
     
     <>
<Grid item xs={12} md={5} lg={12}>
  
  <Card>
<CardContent>
<Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}  color='primary'>
Update Property Type

</Typography>
<Box sx={{ overflowX: 'auto', height: '300px' }}>

{/* Table */}
<Table>
 {/* Table Header */}
 <TableHead style={{ backgroundColor: '#F5F5F5' }}>
   <TableRow>
     <TableCell> OwnerId</TableCell>
     <TableCell>Ward No.</TableCell>
     <TableCell>property No</TableCell>
     <TableCell>Partition No.</TableCell>
     <TableCell>Property Description</TableCell>
    


    

   </TableRow>
 </TableHead>

 {/* Table Body */}
 <TableBody>
   <TableRow>
     <TableCell>B608</TableCell>
     <TableCell>1</TableCell>
     <TableCell>2</TableCell>
     <TableCell>4</TableCell>
     <TableCell></TableCell>
    

     
   </TableRow>
   <TableRow>
   <TableCell>B603</TableCell>
     <TableCell>1</TableCell>
     <TableCell>2</TableCell>
     <TableCell>4</TableCell>
     <TableCell></TableCell>
    

   </TableRow>
   <TableRow>
   <TableCell>B609</TableCell>
     <TableCell>1</TableCell>
     <TableCell>2</TableCell>
     <TableCell>5</TableCell>
     <TableCell></TableCell>
    
    

   </TableRow>
  
   <TableRow>
   <TableCell>B604</TableCell>
     <TableCell>4</TableCell>
     <TableCell>4</TableCell>
     <TableCell>2</TableCell>
     <TableCell></TableCell>
    

    
   </TableRow>
   <TableRow>

   <TableCell>B602</TableCell>
     <TableCell>1</TableCell>
     <TableCell>2</TableCell>
     <TableCell>5</TableCell>
     <TableCell></TableCell>
    
     </TableRow>

  
 </TableBody>
</Table>

</Box>


</CardContent>

</Card>

</Grid>
        </>
      )}
    </Grid> </MainCard>  </> 
  );
}

export default OwnerNameSameAs;

















































































