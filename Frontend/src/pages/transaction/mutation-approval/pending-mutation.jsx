// material-ui
import { Grid, InputLabel, Stack, TextField,Box,Typography,Accordion, AccordionDetails, AccordionSummary, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControlLabel, Checkbox, CardContent, Card, FormGroup, Button, Alert, Snackbar } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';


// project import
import MainCard from 'components/MainCard';
import { fetchcomparisionData, fetchMutationPendingRequests, saveApprovedRequest, saveDisApprovedRequest, ShowDocumentsByOwnerID } from 'services/transaction/mutationHistoryApproval/mutationHistortyApprovalService';
import { getRenterMutationDataByOwnerID } from 'services/renterMutaionService';
import { useSelector } from 'react-redux';

// ==============================|| SAMPLE PAGE ||============================== //

function PendingMutation({ PendingButton,selectedOwnerID,selectedVersionID,selectedStatus }) {
  //navigate
  const navigate = useNavigate();
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user');
  }, [userData]);

  const handleButtonClickDiscard = () => {
    alert("please enter remark")
    navigate('/transaction/mutation-approval');

     
  };

  const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success" // success | error | warning | info
});


const handleSnackbarClose = (event, reason) => {
  if (reason === "clickaway") return;
  setSnackbar(prev => ({ ...prev, open: false }));
};

  // const handleButtonClickApproval = () => {
  //   alert("please enter Approval")


  //   navigate('/transaction/mutation-approval');
  // };




  const handleButtonClickApproval = async () => {
  try {
   const payload={
      OwnerID:selectedOwnerID,
      user:userData,
      remark,
      selectedVersionID,
    }

    console.log(payload,"payload to be approved");
    // Call the backend API
    const result = await saveApprovedRequest(payload);

     setSnackbar({
        open: true,
        message: result.message||"Mutation approved successfully",
        severity: "success"
      });
    // ✅ Do something with the response
    console.log("Approval response:", result);

  
  } catch (error) {
    console.error("Error approving request:", error);
    setSnackbar({
      open: true,
      message: error|| "Failed to approve mutation",
      severity: "error"
    });
  }
};


const handleButtonClickDisApproval = async () => {
  try {
    
    const payload={
      OwnerID:selectedOwnerID,
      user:userData,
      remark,
      selectedVersionID
    }
    // Call the backend API
    const result = await saveDisApprovedRequest(payload);
    // ✅ Do something with the response
    console.log("disApproval response:", result);
setSnackbar({
      open: true,
      message: result.message||"Mutation disApproval successfully",
        severity: "success"
    });
  } catch (error) {
    console.error("Error disapproving request:", error);
    setSnackbar({
      open: true,
      message: "Failed to Disapprove mutation",
      severity: "error"
    });
  }
};


  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };



  useEffect(()=>
  {
    console.log(selectedOwnerID,"ownerid mutation pending")
  },[selectedOwnerID])

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
    anchor.download = 'C:\Users\DELL\Downloads\फेरफार_कागदपत्र.pdf';
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
  const [remark, setRemark] = useState('');


  function toggle(e) {
    setIsOpen((isOpen) => !isOpen);
    e.preventDefault();
}
 
    // const [age, setAge] = useState('');
    // const handleChange = (event) => {
    //     setAge(event.target.value);
    //   };
    // const [records, setRecords] = useState([]);
    

    // useEffect(() => {
    // const fetchMutationPendingReq = async () => {
    //     try {
    //       const response = await fetchMutationPendingRequests();
    //       console.log(response,"Mutation pending data");
    
    //       if (response?.success) {
    //         setRecords(response.data || []);
    //         setPendingCount(response.pendingCount || 0);
    //         setApprovedCount(response.approvedCount || 0);
    //         setDisApprovedCount(response.disApprovedCount || 0);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching mutation pending reqs", error);
    //     } 
    //   };
    
    //   fetchMutationPendingReq();
    // }, []);
    
    
    
      const [transerDetailsList, setTranserDetailsList] = useState([]);
      const[preData,setPrevData]=useState({});
      const[newData,setNewData]=useState({});
      const[documents,setDocuments]=useState({});
const [docs, setDocs] = useState([]);

      
useEffect(() => {
  const fetchDocuments = async () => {
    try {
      console.log(selectedOwnerID,selectedVersionID,"selected ids ownerid and version id")
          if (!selectedOwnerID || !selectedVersionID) return;

      const res = await ShowDocumentsByOwnerID(selectedOwnerID,selectedVersionID);
      console.log("📄 API Docs:", res);

      const records = res?.documents;

      if (Array.isArray(records)) {
        console.log("✅ Recordssss:", records);
        setDocs(records);
      } else {
        setDocs([]);
      }
    } catch (err) {
      console.error("❌ Fetch failed", err);
      setDocs([]);
    }
  };

  if (selectedOwnerID) fetchDocuments();
}, [selectedOwnerID]);


const DOCUMENT_MASTER = {
  1: 'स्थळपाहणी अहवाल',
  2: 'पावती पुस्तक',
  3: 'नोटशीट',
  4: 'अर्ज',
  5: 'सूचना पत्रक',
  6: 'जुनी टॅक्स पावती',
  7: 'जुने डिमांड बिल',
  8: 'रजिस्ट्री',
  9: 'दुरुस्ती पत्रक',
  10: 'फेरफार कागदपत्र',
};

const getDocNameFromFile = (fileName) => {
  const docId = Number(fileName.split("__")[0]);
  return DOCUMENT_MASTER[docId] || "Unknown Document";
};


const BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:4000/Tax_Assessment_NTIS_Backend" 
  : "http://newntis.coreproject.in/Tax_Assessment_NTIS_Backend";


const handleViewDocument = (fileUrl) => {

    console.log("fileUrl mutation ferfar",fileUrl);

  if (!fileUrl) {
    console.error("❌ File URL missing");
    return;
  }

  const finalUrl = fileUrl.startsWith("http")
    ? fileUrl
    : `${BASE_URL}${fileUrl}`;

  console.log("📄 Opening document:", finalUrl);

  window.open(finalUrl, "_blank", "noopener,noreferrer");
};

    
     useEffect(() => {
          const fetchRenterDetails = async () => {
            if (selectedOwnerID) {
              try {
                const response = await getRenterMutationDataByOwnerID(selectedOwnerID);

                console.log(response,"renter response");
              
                const { prevRenterTransferDetails } = response.RenterInfo;
            
                setTranserDetailsList(prevRenterTransferDetails);
              } catch (error) {
                console.error('Error fetching info renter changes:', error);
              }
            }
          };
          fetchRenterDetails();
        }, [selectedOwnerID]);
    
    const[selectedRowStatus,setSelectedRowStatus]=useState('');


     useEffect(() => {
          const fetchOwnerMutationDetails = async () => {
            console.log(selectedOwnerID,"mut data id")
            if (selectedOwnerID) {
              try {
                const response = await fetchcomparisionData(selectedOwnerID);
                console.log(response,"resoo muta")
                setPrevData(response.original);
                setNewData(response.changed)
              } catch (error) {
                console.error('Error fetching info mutation changes:', error);
              }
            }
          };
          fetchOwnerMutationDetails();
        }, [selectedOwnerID]);
    

      
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
                  <TextField  type="text" value={preData.WardNo||""}></TextField>
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
                  <TextField  type="text" value={preData.NewPropertyNo||""} ></TextField>
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
                  <TextField  type="text" value={preData.OwnerNameMarathi ||""}></TextField>
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
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)', 
}}>
<Typography variant="h5" gutterBottom sx={{ color: 'blue', fontWeight: 'bold', textAlign: 'center', margin: 'auto', marginBottom: '1vw' }}>
Mutation Entry Changes: {selectedStatus}
    </Typography>
</Box></Grid></Grid>


 
{/* 5th Old Information deatils */}
<MainCard  >

<Grid container spacing={5}  mb={1} > 
<Grid item xs={12} md={10} lg={6} >

<Typography variant="h5"  mb={1}  style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'0.6vw' }}>
Property Owner Details and Document Original

</Typography>
<Grid container spacing={2}>

<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Owner Name	</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={preData.OwnerName||""}></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Occupier Name</InputLabel>
    <TextField required fullWidth maxWidth="sm" value={preData.OccupierName||""}> </TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel> Old Owner Purchase Date</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       value={preData.OldOwnerPurchaseDate||""}
      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 
<Grid container spacing={2}  >

<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Old Owner Transfer Date	</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      value={preData.TransferDate||""}
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Order No</InputLabel>
    <TextField required fullWidth maxWidth="sm"  
        value={preData.OrderNo||""}
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>Remark</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
               value={preData.Remark||""}

      
                        ></TextField>

  </Stack>
</Grid>


</Grid> 





</Grid>

{/* table 4th line 2nd for3nd table */}

<Grid item xs={12} md={10} lg={6} >
<Typography variant="h5"  mb={1}  style={{  fontWeight: 'bold', textAlign: 'center', backgroundColor:'#b2dfdb', padding:'0.6vw' }}>
Property Owner Details and Document New

    </Typography>
<Grid container spacing={2}>
<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
   New Owner Name</InputLabel>
    <TextField required fullWidth maxWidth="sm"
                   value={newData.OwnerName||""}

       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    Occupier Name	</InputLabel>
    <TextField required fullWidth maxWidth="sm"
value={newData.OccupierName||""}
       
      
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>New Owner Purchase Date</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
      
      value={newData?.NewOwnerPurchaseDate
    ? newData.NewOwnerPurchaseDate.slice(0, 10)
    : ""
  }

                        ></TextField>

  </Stack>
</Grid>



</Grid> 
    <Grid container spacing={2}  >
<Grid item xs={6} sm={4}  mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>New Owner Transfer Date	</InputLabel>
    <TextField required fullWidth maxWidth="sm"  
      

       value={newData?.TransferDate
    ? newData.TransferDate.slice(0, 10)
    : ""
       }

                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    New Owner Order No	</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       
      value={newData.OrderNo||""}
                        ></TextField>

  </Stack>
</Grid>
<Grid item xs={6} sm={4} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' ,width:'40vw'}}>
  <Stack sx={{ width: '100%' }}>
    <InputLabel>
    New Owner Remark	</InputLabel>
    <TextField required fullWidth maxWidth="sm" 
       value={newData.Remark||""}
      
                        ></TextField>

  </Stack>
</Grid>




</Grid> 




        


</Grid>


</Grid>

</MainCard>


<MainCard>
  <Grid container spacing={5} mb={1}>

    {transerDetailsList.length === 0 ? (
      <Grid item xs={12}>
        <Typography align="center">No Renter Mutation Data</Typography>
      </Grid>
    ) : (
      transerDetailsList.map((item, index) => (
        <React.Fragment key={index}>

          {/* ===== ORIGINAL ===== */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#b2dfdb",
                p: "0.6vw"
              }}
            >
              Renter Mutation Details Original
            </Typography>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <Stack>
                  <InputLabel>Previous Renter Name</InputLabel>
                  <TextField
                    fullWidth
                    value={item.PreviousRenter || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack>
                  <InputLabel>Mutation Date</InputLabel>
                  <TextField
                    fullWidth
                    value={item.MutationDate?.slice(0, 10) || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {/* ===== CHANGED ===== */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#b2dfdb",
                p: "0.6vw"
              }}
            >
              Renter Mutation Details Changes
            </Typography>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <Stack>
                  <InputLabel>New Renter Name</InputLabel>
                  <TextField
                    fullWidth
                    value={item.CurrentRenter || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack>
                  <InputLabel>New Mutation Date</InputLabel>
                  <TextField
                    fullWidth
                    value={item.MutationDate?.slice(0, 10) || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Grid>

        </React.Fragment>
      ))
    )}

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
  <TableHead style={{ backgroundColor: "#F5F5F5" }}>
    <TableRow>
      <TableCell>Document Name</TableCell>
      <TableCell>Show</TableCell>
    </TableRow>
  </TableHead>

<TableBody>
  {docs.length === 0 ? (
    <TableRow>
      <TableCell colSpan={2} align="center">
        No Documents
      </TableCell>
    </TableRow>
  ) : (
    docs.map((doc, index) => (
      <TableRow key={index}>
        <TableCell>
          {getDocNameFromFile(doc.fileName)}
        </TableCell>

        <TableCell>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleViewDocument(doc.fileUrl)}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    ))
  )}
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
                    value={remark}
      onChange={(e) => setRemark(e.target.value)}

                sx={{ mt: 3}}              />                  </Stack>
                </Grid>

                <Grid container spacing={3} justifyContent="center" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}> 
                   <Grid item xs={6} sm={2.2}>
          <Stack spacing={0}>
            <Button variant="contained" color="info" onClick={handleButtonClickApproval}>
Approve           </Button>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={2.2}>
          <Stack spacing={0}>
          <Button variant="contained" color="error" onClick={handleButtonClickDisApproval}>
DisAppove         </Button>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={2.2}>
          <Stack spacing={0}>
            <Button variant="contained" color="warning" onClick={PendingButton }>
              Back To Search
            </Button>
          </Stack>
        </Grid>
        <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.severity}
    variant="filled"
    sx={{ width: "100%" }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

 
        </Grid>
 </Grid>

</Grid>
</MainCard>

{/* end maincard */}
    </MainCard>
    </>
  );
}

export default PendingMutation;
