import React from 'react';
import { Grid, InputLabel, Stack, TextField,Box,Typography,Alert,Button, Select,MenuItem, Autocomplete, TableContainer, Table, TableHead, TableRow, Paper, TableCell, TableBody, Checkbox, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import { useNavigate } from 'react-router';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Dialog from '@mui/material/Dialog';
  import DialogActions from '@mui/material/DialogActions';
  import DialogContent from '@mui/material/DialogContent';
  import DialogContentText from '@mui/material/DialogContentText';
  import DialogTitle from '@mui/material/DialogTitle';
  import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Snackbar from '@mui/material/Snackbar';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchWardList } from 'services/data-entry.services';
import { useEffect } from 'react';
import { fetchWardNo, postWardSelection } from 'services/wardnumber.services';
import { fetchBillBooks, fetchEmailMobileFetch, fetchInvoicesByBillBook, fetchOwnerWiseBillTransactions, searchTransferFeeRenter, upsertTransferTransaction } from 'services/paymentServices/transferFeeService/transferFeeService';
import { SelectOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getBankList, getBillBookNos, getNextInvoiceNo, getPaymentModes } from 'services/paymentServices/offlinePaymentService/offlinePaymentService';
import dayjs from 'dayjs';
///////////////////////////////TransferFee/////////////////
function TransferFee() {
  const [wardNo, setWardNo] = useState('');
  const [propertyNo, setPropertyNo] = useState('');
  const [propList, setPropList] = useState([]);
  const [wardList, setWardList] = useState([]); 
  const [receivedPropertyOwnerList, setReceivedPropertyOwnerList] = useState([]);
const [paymentSuccess, setPaymentSuccess] = useState(false);
const [transferAmt, setTransferAmt] = useState(0);
const [rtifee, setRtifee] = useState(0);
const [otherFee, setOtherFee] = useState(0);
const [copyFee, setCopyFee] = useState(0);
const [certificateFee, setCertificateFee] = useState(0);
const [billBooks, setBillBooks] = useState([]);
const [invoices, setInvoices] = useState([]);
const[ transactionId,setTransactionId] =useState('');
const [merchantTxnRefNumber, setMerchantTxnRefNumber] = useState('');

const [selectedBillBook, setSelectedBillBook] = useState('');
const [selectedInvoice, setSelectedInvoice] = useState('');
const [email, setEmail] = useState('');
const[address,setAddress] =useState('');
const[shopName,setShopName] =useState('');
const[remark,setRemark] =useState('');
const [banks, setBanks] = useState([]);
// Fetch Banks
useEffect(() => {
  const fetchBanks = async () => {
    const res = await getBankList();
    console.log(res.banks,"bbnkk")
    setBanks(res.banks);
  };
  fetchBanks();
}, []);
const [values, setValues] = useState({
  
  paymentMode: 0,
  transactionId: '',
  TransactionId:'',
  chequeDate: '',
  noticeFee:'',
  extraAmount: '',  
  behalfPayer: '',
  RelID:''

});
const handleChange = (field) => (event) => {
  const value = event.target.value;
  setValues((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const totalPayTax =
  Number(transferAmt) +
  Number(rtifee) +
  Number(otherFee) +
  Number(copyFee) +
  Number(certificateFee);

  const [selectedProperty, setSelectedProperty] = useState(null);
  useEffect(() => {
    const loadWardNos = async () => {
      try {
        const res = await fetchWardNo();
  
        const sortedWard = [...res].sort(
          (a, b) => Number(a.NewWardNo) - Number(b.NewWardNo)
        );
  
        setWardList(sortedWard); 
      } catch (error) {
        console.error('Error fetching ward Number', error);
      }
    };
  
    loadWardNos();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      if (wardNo) {
        try {
          const response = await postWardSelection(wardNo);
          setReceivedPropertyOwnerList(response.properties);
          console.log(response);
        } catch (error) {
          console.error('Error posting ward No.:', error);
        }
      }
    };
    fetchData();
  }, [wardNo]);

  useEffect(() => {
    const loadBillBooks = async () => {
      try {
        const data = await fetchBillBooks();
        setBillBooks(data); // assumes API returns an array of billBookNo
      } catch (error) {
        console.error('Error loading bill books', error);
      }
    };
  
    loadBillBooks();
  }, []);
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!selectedProperty?.OwnerID) return;
  
      try {
        const data = await fetchEmailMobileFetch({ ownerId: selectedProperty.OwnerID });
        console.log('Owner details:', data);
  
        // populate the fields
        setMobileNo(data.MobileNo || '');
        setEmail(data.EmailID || '');
        setAddress(data.OwnerPatta || '');
        setShopName(data.BuildingOrShopNameMarathi || '');
      } catch (error) {
        console.error('Error fetching owner details:', error);
      }
    };
  
    fetchOwnerDetails();
  }, [selectedProperty]);
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in offline paymrebt page');
  }, [userData]);

const [billBookNos, setBillBookNos] = useState([]);
useEffect(() => {
  const fetchBillBooks = async () => {
    try {
      const response = await getBillBookNos(userData.UserID);
      console.log("Fetched Bill Book Nos:", response);

      setBillBookNos(response.data || []);
    } catch (err) {
      console.error("Error fetching bill books:", err);
    }
    
  };

  fetchBillBooks();
}, []);   // empty array = run only once on mount



  const navigate = useNavigate();

  const handleWardNoChange = async (event) => {
    const ward = event.target.value;
  
    setWardNo(ward);
    setSelectedProperty(null);
    setPropList([]);
    setReceivedPropertyOwnerList([]);
  
    try {
      // 🔹 API call
      const res = await fetchPropertyRangeByWard(ward);
      const properties = res?.properties || [];
  
      // 🔹 Property + Partition ko alag-alag rakho
      const formattedProps = properties
        .map(p => ({
          NewPropertyNo: p.NewPropertyNo,
          NewPartitionNo: p.NewPartitionNo || '0',
          OwnerName: p.OwnerName,
          OwnerID: p.OwnerID,
          NewWardNo: p.NewWardNo
        }))
        // 🔹 sort: property → partition
        .sort((a, b) => {
          if (Number(a.NewPropertyNo) === Number(b.NewPropertyNo)) {
            return Number(a.NewPartitionNo) - Number(b.NewPartitionNo);
          }
          return Number(a.NewPropertyNo) - Number(b.NewPropertyNo);
        });
  
      setPropList(formattedProps);
  
    } catch (error) {
      console.error('Error fetching properties by ward', error);
    }
  };
  

  const handlePropertyNoChange = (event) => {
    setPropertyNo(event.target.value);
  };
  const [showSerachTable, setShowSerachTable] = useState(false);

  // const handleButtonClick = (row) => {
  //   // optional: open section / modal
  //   setIsOpen(true);
  
  //   // ✅ Ward No
  //   setWardNo(row.NewWardNo || '');
  
  //   // ✅ Property No (with partition)
  //   setPropertyNo(
  //     row.NewPartitionNo && row.NewPartitionNo !== '0'
  //       ? `${row.NewPropertyNo}-${row.NewPartitionNo}`
  //       : row.NewPropertyNo || ''
  //   );
  
  //   // ✅ Primary Owner Name (Marathi preferred)
  //   setPrimaryOwnerMar(
  //     row.OwnerNameMarathi ||
  //     row.OwnerName ||
  //     ''
  //   );
  
  //   // ✅ Bhogvatdar / Owner (same data if needed separately)
  //   setOwnerName(
  //     row.OwnerNameMarathi ||
  //     row.OwnerName ||
  //     ''
  //   );
  
  //   // ✅ Renter / Occupier Name
  //   setRenterName(
  //     row.OccupierNameMarathi ||
  //     row.OccupierName ||
  //     ''
  //   );
  
  //   // ✅ Mobile No
  //   setMobileNo(row.MobileNo || '');
  
  //   // ✅ Shop / Apartment Name
  //   setShopName(
  //     row.BuildingOrShopNameMarathi ||
  //     row.BuildingOrShopName ||
  //     ''
  //   );
  
  //   // ✅ Address
  //   setAddress(
  //     row.Address ||
  //     row.OwnerPatta ||
  //     ''
  //   );
  // };
  const handleButtonClick = (row) => {
    console.log("ROW SELECTED 👉", row);
  
    // ✅ IMPORTANT: SELECT PROPERTY (PAYMENT DEPENDS ON THIS)
    setSelectedProperty({
      OwnerID: row.OwnerID,               // 🔥 MUST
      NewWardNo: row.NewWardNo,
      NewPropertyNo: row.NewPropertyNo,
      NewPartitionNo: row.NewPartitionNo || '0',
    });
  
    // ✅ optional: open section / modal
    setIsOpen(true);
  
    // ✅ UI fields (only for display)
    setWardNo(row.NewWardNo || '');
  
    setPropertyNo(
      row.NewPartitionNo && row.NewPartitionNo !== '0'
        ? `${row.NewPropertyNo}-${row.NewPartitionNo}`
        : row.NewPropertyNo || ''
    );
  
    setPrimaryOwnerMar(
      row.OwnerNameMarathi ||
      row.OwnerName ||
      ''
    );
  
    setRenterName(
      row.OccupierNameMarathi ||
      row.OccupierName ||
      ''
    );
  
    setMobileNo(row.MobileNo || '');
  
    setShopName(
      row.BuildingOrShopNameMarathi ||
      row.BuildingOrShopName ||
      ''
    );
  
    setAddress(
      row.Address ||
      row.OwnerPatta ||
      ''
    );
  };
  
  // const handleGetProperty = () => {
  //   console.log("clicked");
  // console.log("wardNo:", wardNo);
  // console.log("selectedProperty:", selectedProperty);

  //   if (!wardNo || !selectedProperty ) {
  //     alert("Please select Ward No and Property No");
  //     return;
  //   }
  
  //   // 🔹 SAME PAGE table show
  //   setShowSerachTable(true);
  
    
  // };
  const [occupierEng, setoccupierEng] = useState('');
const [occupierMar, setoccupierMar] = useState('');
const [RenterEng, setRenterEng] = useState('');
const [RenterMar, setRenterMar] = useState('');
const [primaryOwnerEng, setPrimaryOwnerEng] = useState('');
const [primaryOwnerMar, setPrimaryOwnerMar] = useState('');

const [searchResults, setSearchResults] = useState([]);
const handleGetProperty = async () => {
  // Prepare search data
  const searchData = {
    wardNo: wardNo || null,
    propertyNo: selectedProperty?.NewPropertyNo || null,
    occupierEng: occupierEng?.trim() || null,
    occupierMar: occupierMar?.trim() || null,
    primaryOwnerEng: primaryOwnerEng?.trim() || null,
    primaryOwnerMar: primaryOwnerMar?.trim() || null,
    RenterEng: RenterEng?.trim() || null,
    RenterMar: RenterMar?.trim() || null,
  };

  try {
    const result = await searchTransferFeeRenter(searchData);

    // Handle backend error
    if (result.error) {
      alert(result.error);
      setShowSerachTable(false);
      return;
    }

    // Handle no data found
    if (!result.data || (Array.isArray(result.data) && result.data.length === 0)) {
      alert("No data found");
      setShowSerachTable(false);
      return;
    }

    // Ensure data is an array
    const dataArray = Array.isArray(result.data) ? result.data : [result.data];

    // Update the table
    setSearchResults(dataArray);
    setShowSerachTable(true);

    // Auto-populate renter fields from the first record
    setRenterEng(dataArray[0].renterName || "");
    setRenterMar(dataArray[0].renterNameMarathi || "");

    
    console.log("Search Results 👉", dataArray);
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
    setShowSerachTable(false);
  }
};

  
//pay button
// const handleFinalPay = () => {
//   const payload = {
//     wardNo,
//     propertyNo: selectedProperty?.NewPropertyNo,
//     billBookNo: selectedBillBook,
//     invoiceNo: selectedInvoice,
//     paymentMode,
//     //transactionId: transferId, // ✅ send state here
//     totalPayTax
//   };

//   console.log('Payment payload:', payload);

//   // Call your payment API here
//   // await payTransferFee(payload);

//   setOpenDialog(false);
//   setPaymentSuccess(true);
// };

const handleFinalPay = async () => {
  try {
    const payload = {
      OwnerID: selectedProperty?.OwnerID || 0,
      BillBookNo: selectedBillBook || '',
      InvoiceNo: selectedInvoice || '',
      PaymentMode: values?.paymentMode || 0,
      chequeNo: values?.chequeNo || 0,
      chequeDate: values?.chequeDate || 0,
      bank: values?.bank || 0,
      Amount: totalPayTax || 0,
      NetTotal: totalPayTax || 0,
      MobileNumber: values?.mobileNo || '',
      EmailId: email || null,
      Remark: remark || null,
      TransferFee: transferAmt || 0,
      RTIFee: rtifee || 0,
      OtherFee: otherFee || 0,
      WarrentFee: copyFee || 0,
      Tax2: certificateFee || 0,
      WardNo: selectedProperty?.NewWardNo || 0,
      PropertyNo: selectedProperty?.NewPropertyNo || 0,
      PartitionNo: selectedProperty?.NewPartitionNo || 0,
    };

    const response = await upsertTransferTransaction(payload);
    console.log("Payment API Full Response:", response);
    // ✅ Set the newly created MerchantTxnRefNumber to state
    const merchantId = response?.data?.data?.MerchantTxnRefNumber;
    if (merchantId) {
      setMerchantTxnRefNumber(merchantId);
    }

    // handle success UI
    if (response?.data) {
      setOpenDialog(false);
      setPaymentSuccess(true);
    }

  } catch (error) {
    console.error("Payment Error:", error);
  }
};

// const handleFinalPay = async () => {
//   try {
//     const payload = {
//       OwnerID: selectedProperty?.OwnerID || 0,
//       BillBookNo: selectedBillBook || '',
//       InvoiceNo:selectedInvoice || '',
//       PaymentMode: values.paymentMode || 0,
//             PaymentMode: values.paymentMode || 0,
//             chequeNo: values.chequeNo || 0,
//             chequeDate: values.chequeDate || 0,
//             behalfPayer: values.behalfPayer || 0,
//             TransactionId:values.TransactionId || 0,
//             RelID:values.RelID || 0,
//             bank: values.bank || 0,
//       Amount: totalPayTax || 0,
//       NetTotal: totalPayTax || 0,
//       MobileNumber: values.mobileNo || '',
//       EmailId: email || null,
//       Remark: remark || null,
//       TransferFee: transferAmt || 0,
//       RTIFee: rtifee || 0,
//       OtherFee: otherFee || 0,
//       WarrentFee: copyFee || 0,
//       Tax2: certificateFee || 0,
//       WardNo: selectedProperty?.NewWardNo || 0,
//   PropertyNo: selectedProperty?.NewPropertyNo || 0,
//   PartitionNo: selectedProperty?.NewPartitionNo || 0,
//     };
    

//     console.log("Upsert Payload:", payload);

//     const response = await upsertTransferTransaction(payload);
//     console.log("Payment API Response:", response);

//     // Adjust this based on your API
//     if (response?.success) {
//       setOpenDialog(false);

//       setPaymentSuccess(true);
//       setSnackbarMessage("Payment successful!");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);

//     } else {
//       setSnackbarMessage("Payment failed. " + (response?.message || ""));
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);    }
//   } catch (error) {
//     console.error("Payment Error:", error);
//     setSnackbarMessage("Something went wrong while payment.");
//     setSnackbarSeverity("error");
//     setSnackbarOpen(true);  }
// };

  
//nav
const [isOpen, setIsOpen] = useState(false);
// transfer
 //Datepicker state
 const [value, setValue] = useState(null);
//  const [wardNo, setWardNo] = useState('');
 const [showTable, setShowTable] = useState(false);
 const [paymentMode, setPaymentMode] = useState(0);
 const [mobileNo, setMobileNo] = useState('');
 const [billBookNo, setBillBook] = useState('');
 const [showAlert, setShowAlert] = useState(false);
 const [open, setOpen] = useState(false);


//model
const [openDialog, setOpenDialog] = useState(false);
const handleClickDialog = () => {
setOpenDialog(true);
};
//  const handleWardNoChange = (event) => {
//    setWardNo(event.target.value);
//  };
 const handleGetsProperty = () => {
   if (wardNo ) {
     setShowTable(true);
   }
 };  
 
 //mobile and billbook enter
 const handleMobileNoChange = (event) => {
  let value = event.target.value;

  // ❌ Remove non-digit characters
  value = value.replace(/\D/g, '');

  // 🔹 Limit to 10 digits max
  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  setMobileNo(value);
};

//  const currentYear=new Date().getFullYear();
const currentYear=2021;
 const handleBillBookChange = async (event) => {
  const billBookNos = event.target.value;

  setSelectedBillBook(billBookNos);
  setSelectedInvoice(''); // reset pehle

  try {
    const res = await getNextInvoiceNo({
      userID: userData?.UserID,   
      status: 1,                  
      year: currentYear          
    });

    console.log("Invoice API 👉", res);

    const invoiceData = Array.isArray(res) ? res[0] : res;

    if (invoiceData?.ErrorCode === 0) {
      // 🔥 MAIN FIX — TextField ke liye
      setSelectedInvoice(invoiceData.InvoiceNo);

      // Agar future me dropdown chahiye
      setInvoices([invoiceData.InvoiceNo]);
    } else {
      setSelectedInvoice('');
      setInvoices([]);
      alert(invoiceData?.ErrorMsg || "Invoice not available");
    }
  } catch (error) {
    console.error('Error fetching invoices for bill book', error);
  }
};


const handlePayProperty = () => {
  if (mobileNo && selectedBillBook && selectedInvoice) {
    setOpenDialog(true);
    setShowAlert(false);
  } else {
    setShowAlert(true);
    setOpen(true);
  }
};
 const handleCloseDialog = () => {
   setOpenDialog(false);
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
//payment mode
const [paymentModes, setPaymentModes] = useState([]);

useEffect(() => {
  const fetchPaymentModes = async () => {
    const modes = await getPaymentModes();
    setPaymentModes(modes);
  };
  fetchPaymentModes();
}, []);
const[showCheckDDTransDate,setShowCheckDDTransDate]=useState(false);
const[showCheckDDTransNo,setShowCheckDDTransNo]=useState(false);
const[showBank,setShowBank]=useState(false)
const[showDDandCheckDate,setShowDDandCheckDate]=useState(false)
const[showReferalID,setShowRefralID]=useState(false);
const[showTransID,setShowTransID]=useState(false);
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error'

const handleSnackbarClose = () => {
  setSnackbarOpen(false);
};

const handlePaymentChange = (field) => async (event) => {
  try {
    const value = event.target.value;

    // Update the main values object
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "paymentMode") {
      // Reset all first
      setShowTransID(false);
      setShowRefralID(false);
      setShowBank(false);
      setShowDDandCheckDate(false);
      setShowCheckDDTransNo(false);
      setShowCheckDDTransDate(false);

      // Show specific fields based on payment mode
      switch (value) {
        case "CASH":
          setShowTransID(false);
          break;
        case "CARD PAYMENT":
          setShowRefralID(true);
          break;
        case "CHEQUE":
          setShowBank(true);
          setShowCheckDDTransNo(true);
          setShowCheckDDTransDate(true);
          break;

        case "DD":
          setShowBank(true);
          setShowCheckDDTransNo(true);
          setShowCheckDDTransDate(true);
          break;

        case "NEFT":
          setShowBank(true);
          setShowCheckDDTransNo(true);
          setShowCheckDDTransDate(true);
          break;
        case "RTGS":
          setShowBank(true);
          setShowCheckDDTransNo(true);
          setShowCheckDDTransDate(true);
          break;
        
        default:
          break;
      }
    }
  } catch (err) {
    console.error("Error in handlePaymentChange:", err);
    setSnackbar({
      open: true,
      severity: "error",
      message: "An error occurred",
    });
  }
};
///all owner wise
// For Transfer Fee transactions table
const [selectedOwnerID, setSelectedOwnerID] = useState(null); // owner selected
const [receiptType, setReceiptType] = useState(''); // static dropdown
const [transferFeeTxns, setTransferFeeTxns] = useState([]);
useEffect(() => {
  const loadOwnerTransactions = async () => {
    const ownerID = selectedProperty?.OwnerID;
    if (!ownerID) return;

    try {
      const allTxns = await fetchOwnerWiseBillTransactions(ownerID); // POST API

      // Set all transactions as-is
      setTransferFeeTxns(allTxns);

      // Show latest MerchantTxnRefNumber (optional)
      if (allTxns.length > 0) {
        setMerchantTxnRefNumber(allTxns[allTxns.length - 1].MerchantTxnRefNumber);
      } else {
        setMerchantTxnRefNumber('');
      }
    } catch (error) {
      console.error('Failed to load owner transactions:', error);
    }
  };

  loadOwnerTransactions();
}, [selectedProperty]); // only reload when selected owner changes


const handleDownloadReceipt = (merchantTxnRefNumber) => {
  // Implement download logic here, e.g., open PDF URL
  console.log('Download receipt for:', merchantTxnRefNumber);
  window.open(`/api/download-receipt/${merchantTxnRefNumber}`, '_blank');
};

  return (
    <>
       {paymentSuccess ? (
        <>
      <MainCard title="प्राथमिक कर धारकाची माहिती ">
         
        <Grid container spacing={1}>
          <Grid item xs={12} md={10} lg={12}>
            <Box title="Find Property">
              <Box>
              <Grid container spacing={3} mb={2}>
  {/* ===== Ward No ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
          वार्ड क्र.
        </InputLabel>
      </Grid>
      <Grid item xs={7}>
        <TextField
          fullWidth
          value={wardNo}
        />
      </Grid>
    </Grid>
  </Grid>

  {/* ===== Property No ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
          मालमत्ता क्र.
        </InputLabel>
      </Grid>
      <Grid item xs={7}>
    
      <Stack spacing={1}>
                   <TextField
  fullWidth
  value={
    selectedProperty
      ? selectedProperty.NewPartitionNo && selectedProperty.NewPartitionNo !== '0'
        ? `${selectedProperty.NewPropertyNo}-${selectedProperty.NewPartitionNo}`
        : selectedProperty.NewPropertyNo
      : ''
  }
/>                   </Stack>
      </Grid>
    </Grid>
  </Grid>

  {/* ===== Owner Name ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
          प्राथमिक कर धारकाचे नाव:
        </InputLabel>
      </Grid>
      <Grid item xs={7}>
        <TextField
          fullWidth
          placeholder="Enter Owner Name (Marathi)"
          value={primaryOwnerEng}
        />
      </Grid>
    </Grid>
  </Grid>
</Grid>



<Grid container spacing={3}  mb={2}>
  {/* ===== Ward No ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        भोगवटदार /भाडेकरी नाव        </InputLabel>
      </Grid>
      <Grid item xs={7}>
        <TextField
          fullWidth
          value={occupierMar}
        />
      </Grid>
    </Grid>
  </Grid>

  {/* ===== Property No ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        </InputLabel>
      </Grid>
      <Grid item xs={7}>
       
      </Grid>
    </Grid>
  </Grid>

  {/* ===== Owner Name ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        दुकानाचे नाव/अपार्टमेन्टचे नाव       </InputLabel>
      </Grid>
      <Grid item xs={7}>
        <TextField
          fullWidth
          placeholder="Enter Owner Name (Marathi)"
          value={shopName}

        />
      </Grid>
    </Grid>
  </Grid>
</Grid>


<Grid container spacing={3}  mb={2}>
  {/* ===== Ward No ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        संपर्क क्र.:        </InputLabel>
      </Grid>
      <Grid item xs={7}>
    <TextField
      fullWidth
      value={mobileNo}
      InputProps={{ readOnly: true }}
      placeholder="Mobile No"
    />
      </Grid>
    </Grid>
  </Grid>

  {/* ===== Property No ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        </InputLabel>
      </Grid>
      <Grid item xs={7}>
       
      </Grid>
    </Grid>
  </Grid>

  {/* ===== Owner Name ===== */}
  <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        पत्ता        </InputLabel>
      </Grid>
      <Grid item xs={7}>
        <TextField
          fullWidth
          placeholder="Enter Owner Name (Marathi)"
           value={address}
        />
      </Grid>
    </Grid>
  </Grid>
</Grid>


              </Box>
            </Box>
          </Grid>
         
        </Grid> 
       
      </MainCard>
      <MainCard title="   Payment Completed Successfully">
     
        <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        mt={3}
        mb={3}
      >
        {/* <CheckCircleIcon color="success" sx={{ fontSize: 80 }} /> */}

    

        {/* <Divider sx={{ width: '100%', my: 2 }} /> */}

        <Box width="100%" maxWidth={400}>

        <Grid item xs={12} sm={4}>
    <Grid container alignItems="center" spacing={1} mb={2}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        Transaction ID:        </InputLabel>
      </Grid>
      <Grid item xs={7}>
      <TextField
  required
  fullWidth
  value={merchantTxnRefNumber || ''}
/>

      </Grid>
    </Grid>
  </Grid>

  <Grid container alignItems="center" spacing={1} mb={2}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        Transaction Amount:        </InputLabel>
      </Grid>
      <Grid item xs={7}>
        <TextField
          fullWidth
          value={wardNo}
        />
      </Grid>
    </Grid>

 <Grid container alignItems="center" spacing={1}>
      <Grid item xs={5}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
        Get Payment Receipt:       </InputLabel>
      </Grid>
      <Grid item xs={7}>
      <Button variant="contained" color="primary">
            Get Receipt
          </Button>
      </Grid>
  </Grid>

        </Box>

        
      </Box>
      
      </MainCard>
</>
    ) : !isOpen ? (
      // {!isOpen && (
        <>
    <MainCard title="Counter Payment">
      <Typography sx={{ mb: 2 }} variant="h6" style={{ fontWeight: 'bold' }}>
        <span style={{ color: 'red' }}>*</span>
        <span>
          मालमत्ता कर भरणा करण्याबाबत कोणतीही तक्रार असल्यास किंवा मदत पाहिजे असल्यास कृपया टोल फ्री 1800XXXXXX
          क्रमांकावर संपर्क साधा helpdesk.Shirurnp@gmail.com या इमेल आय.डी. वर मेल करा.
        </span>
      </Typography>
      <MainCard style={{ backgroundColor: '#e3f2fd' }}>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          <span>Find Property</span>
        </Typography>
      </MainCard>
      <MainCard>   
           <Grid>

        <Grid container spacing={4.5}>
          <Grid item xs={12} md={10} lg={6}>
            <Box title="Find Property">
              <Box>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता सांकेतांक:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name" placeholder="Enter Unique No." />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent="center">
                  <Grid item xs={6} sm={2.8}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>वार्ड क्र. :</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={5.3} mb={1}>
                    <Stack spacing={1}>
                      {/* <TextField required fullWidth autoComplete="family-name" placeholder="Enter Ward No." value={wardNo}
                  onChange={handleWardNoChange} /> */}
                 <Select
  value={wardNo}
  onChange={handleWardNoChange}
    displayEmpty
  fullWidth
>
  <MenuItem value="" disabled>
    Select Ward No
  </MenuItem>

  {wardList.map((ward, index) => (
    <MenuItem key={index} value={ward.NewWardNo}>
      {ward.NewWardNo}
    </MenuItem>
  ))}
</Select>


                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6} sm={4.7}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>प्राथमिक कर धारकाचे नाव : (इंग्रजी)</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name" placeholder="Enter Occupier Name(English)"
                       value={primaryOwnerEng}
                       onChange={(e) => setPrimaryOwnerEng(e.target.value)} />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={6} sm={4.6}>
                    <Stack sx={{ mt: 1 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>भोगवटदाराचे नाव:(इंग्रजी)</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={7.3} mb={1}>
                    <Stack spacing={1}>
                      <TextField required fullWidth autoComplete="family-name" 
                      placeholder="Enter Occupier Name(English)" 
                       value={occupierEng}
  onChange={(e) => setoccupierEng(e.target.value)}/>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={10} lg={6}>
            <Box marginTop={6}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={2.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता क्र.:</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={5.3} mb={1}>
                  <Stack spacing={1}>
                  <Autocomplete
  options={propList}
  value={selectedProperty}
  onChange={(_, value) => setSelectedProperty(value)}
  getOptionLabel={(option) => {
    if (!option?.NewPropertyNo) return '';
    // show partition only if it exists and is not empty
    return option.NewPartitionNo && option.NewPartitionNo !== '0'
      ? `${option.NewPropertyNo}-${option.NewPartitionNo}`
      : `${option.NewPropertyNo}`;
  }}
  isOptionEqualToValue={(option, value) =>
    option.NewPropertyNo === value.NewPropertyNo &&
    option.NewPartitionNo === value.NewPartitionNo
  }
  renderInput={(params) => (
    <TextField {...params} label="Property No - Partition" fullWidth />
  )}
/>




                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={4.6}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>प्राथमिक कर धारकाचे नाव:(मराठी)</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name" 
                    placeholder="Enter Occupier Name(Marathi)" 
                    value={primaryOwnerMar}
                    onChange={(e) => setPrimaryOwnerMar(e.target.value)}/>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={4.6}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>भोगवटदाराचे नाव:(मराठी)</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name" 
                    placeholder="Enter Occupier Name(Marathi)"
                     value={occupierMar}
  onChange={(e) => setoccupierMar(e.target.value)} />
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
              <Button variant="contained" color="primary" onClick={handleGetProperty}>
                  Get Property
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <Button variant="contained" color="secondary">
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
       
</Grid>
      </MainCard>
    </MainCard>
    {showSerachTable && (
  <MainCard sx={{ mt: 3 }} title="Searched Property Owner Details">
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>Ward No</TableCell>
            <TableCell>Property No</TableCell>
            <TableCell>Owner Name</TableCell>
            <TableCell>Renter Name</TableCell>
          </TableRow>
        </TableHead>

  
<TableBody>
  {searchResults.map((row) => (
    
    <TableRow
      key={`${row.wardNo || row.NewWardNo}-${row.propertyNo || row.NewPropertyNo}-${row.partitionNo || row.NewPartitionNo || 0}`}
    >
      
      <TableCell>
        <IconButton
          variant="contained"
          color="success"
          sx={{ fontSize: '2rem' }}
          onClick={() => handleButtonClick(row)} // pass row if needed
        >
          <SelectOutlined />
        </IconButton>
      </TableCell>

      <TableCell>{row.wardNo || row.NewWardNo}</TableCell>

      <TableCell>
        {row.partitionNo && row.partitionNo !== '0'
          ? `${row.propertyNo || row.NewPropertyNo}-${row.partitionNo}`
          : row.propertyNo || row.NewPropertyNo}
      </TableCell>

      <TableCell>{row.ownerNameMarathi || row.OwnerNameMarathi || row.ownerName || row.OwnerName || '-'}</TableCell>

      <TableCell>{row.renterNameMarathi || row.renterName || row.OccupierNameMarathi || row.OccupierName || '-'}</TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
    </TableContainer>
  </MainCard>
)}

    </>
    //  )}
// {isOpen && (
  
) : (
  <>
     
     <MainCard title="Counter Payment">
     <Typography sx={{ mb: 2}} variant="h6" style={{ fontWeight: 'bold' }}>
       <span style={{ color: 'red' }}>*</span>
       <span>
         मालमत्ता कर भरणा करण्याबाबत कोणतीही तक्रार असल्यास किंवा मदत पाहिजे असल्यास कृपया  टोल फ्री 1800XXXXXX
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
                     <TextField InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" value={wardNo} />
                   </Stack>
                 </Grid>
               </Grid>
               <Grid container spacing={1} justifyContent="center">
                 <Grid item xs={6} sm={5.2}>
                   <Stack sx={{ mt: 1 }} spacing={1}>
                     <InputLabel style={{ fontWeight: 'bold' }}>भोगवटदार नाव:</InputLabel>
                   </Stack>
                 </Grid>
                 <Grid item xs={6} sm={5.3} mb={1}>
                   <Stack spacing={1}>
                   <TextField InputProps={{ readOnly: true }}           value={occupierMar}
fullWidth  />
       
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
                     <TextField  InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" value={mobileNo} />
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
                   {/* <TextField
  fullWidth
  value={
    selectedProperty
      ? selectedProperty.NewPartitionNo && selectedProperty.NewPartitionNo !== '0'
        ? `${selectedProperty.NewPropertyNo}-${selectedProperty.NewPartitionNo}`
        : selectedProperty.NewPropertyNo
      : ''
  }
/> */}
<TextField InputProps={{ readOnly: true }} fullWidth value={propertyNo} />

</Stack>
                 </Grid>
               </Grid>
               <Grid container spacing={2} justifyContent="center">
                 <Grid item xs={6} sm={2.9}>
                   <Stack sx={{ mt: 1 }} spacing={1}>
                     <InputLabel style={{ fontWeight: 'bold' }}>भाडेकरी नाव: </InputLabel>
                   </Stack>
                 </Grid>
                 <Grid item xs={6} sm={5.3} mb={1}>
                   <Stack spacing={1}>
                     <TextField required fullWidth autoComplete="family-name" InputProps={{ readOnly: true }}    value={RenterMar}
  onChange={(e) => setRenterMar(e.target.value)}  />
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
                     <TextField InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" 
  value={primaryOwnerMar}
  placeholder="Enter Unique No." />
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
                 InputProps={{ readOnly: true }} 
                 value={shopName}
                 />       
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
                     <TextField  InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" 
                     value={address} />
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
                     <TextField required fullWidth autoComplete="family-name" 
                       type="number"
                       value={transferAmt}
                       onChange={(e) => setTransferAmt(e.target.value)}  />
                   </Stack>
                 </Grid>
               </Grid>
               <Grid container spacing={1} justifyContent="center">
                 <Grid item xs={6} sm={2.8}>
                   <Stack sx={{ mt: 1 }} spacing={1}>
                     <InputLabel style={{ fontWeight: 'bold' }}>माहिती अधिकार फ्री :</InputLabel>
                   </Stack>
                 </Grid>
                 <Grid item xs={6} sm={5.3} mb={1}>
                   <Stack spacing={1}>
                     <TextField required fullWidth autoComplete="family-name" 
                      type="number"
                      value={rtifee}
                      onChange={(e) => setRtifee(e.target.value)}/>
                   </Stack>
                 </Grid>
               </Grid>
               <Grid container spacing={1} justifyContent="center">
                 <Grid item xs={6} sm={2.8}>
                   <Stack sx={{ mt: 1 }} spacing={1}>
                     <InputLabel style={{ fontWeight: 'bold' }}>इतर फ्री :</InputLabel>
                   </Stack>
                 </Grid>
                 <Grid item xs={6} sm={5.3} mb={1}>
                   <Stack spacing={1}>
                     <TextField required fullWidth autoComplete="family-name"
                      type="number"
  value={otherFee}
  onChange={(e) => setOtherFee(e.target.value)} />
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
                   <InputLabel style={{ fontWeight: 'bold' }}>नक्कल फ्री :</InputLabel>
                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.3} mb={1}>
                 <Stack spacing={1}>
                   <TextField required fullWidth autoComplete="family-name"
                    type="number"
                    value={copyFee}
                    onChange={(e) => setCopyFee(e.target.value)} />
                 </Stack>
               </Grid>
             </Grid>
             <Grid container spacing={2} justifyContent="center">
               <Grid item xs={6} sm={2.8}>
                 <Stack sx={{ mt: 1 }} spacing={1}>
                   <InputLabel style={{ fontWeight: 'bold' }}>प्रमाणपत्र फ्री :</InputLabel>
                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.3} mb={1}>
                 <Stack spacing={1}>
                   <TextField required fullWidth autoComplete="family-name"
                   type="number"
                   value={certificateFee}
                   onChange={(e) => setCertificateFee(e.target.value)}
                 />
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
                   <TextField required fullWidth autoComplete="family-name" 
                   value={remark}
                   onChange={(e) => setRemark(e.target.value)} />
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
             <Button variant="contained" color="primary" onClick={handleGetsProperty} >
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
    <TextField
      required
      fullWidth
      autoComplete="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)} // 🔑 allow updating state
    />
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
                   <Select
      value={selectedBillBook}
      onChange={handleBillBookChange}
      displayEmpty
      fullWidth
    >
      <MenuItem value="" disabled>
        --Select Bill Book--
      </MenuItem>
      {/* {billBooks.map((bb, index) => (
        <MenuItem key={index} value={bb}>
          {bb}
        </MenuItem>
      ))} */}
       {billBookNos.map((item, index) => (
    <MenuItem key={index} value={item.BillBookNo}>
      {item.BillBookNo}
    </MenuItem>
  ))}
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
    <Select
      labelId="payment-mode-label"
      value={values.paymentMode}
      onChange={handlePaymentChange("paymentMode")} // ✅ use your handler here
    >
       {paymentModes.map((mode, idx) => (
    <MenuItem key={idx} value={mode}>
      {mode}
    </MenuItem>
  ))}
    </Select>
  </Stack>
</Grid>

                 
               </Grid>
               
              
               {/* <Grid container spacing={1} justifyContent="center">
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
               </Grid> */}
               <Grid container spacing={1} justifyContent="center">
                 <Grid item xs={6} sm={2.8}>
                   <Stack sx={{ mt: 1 }} spacing={1}>
                     <InputLabel style={{ fontWeight: 'bold' }}>Total Pay Tax:</InputLabel>
                   </Stack>
                 </Grid>
                 <Grid item xs={6} sm={5.3} mb={1}>
                   <Stack spacing={1}>
                     <TextField required fullWidth autoComplete="family-name" 
                      value={totalPayTax}
                      InputProps={{ readOnly: true }}/>
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
                 <TextField
  required
  fullWidth
  placeholder="Mobile No"
  value={mobileNo}
  onChange={handleMobileNoChange}
  error={mobileNo.length > 0 && mobileNo.length !== 10}
  helperText={
    mobileNo.length > 0 && mobileNo.length !== 10
      ? "Mobile number must be exactly 10 digits"
      : ""
  }
/>

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
                 {/* <Select
      value={selectedInvoice}
      onChange={(e) => setSelectedInvoice(e.target.value)}
      displayEmpty
      fullWidth
    >
      <MenuItem value="" disabled>
        --Select Invoice--
      </MenuItem>
      {invoices.map((inv, index) => (
  <MenuItem key={index} value={inv.InvoiceNo}>
    {inv.InvoiceNo}
  </MenuItem>
))}
    </Select>               */}
      <TextField
                    fullWidth
                    value={selectedInvoice}
                    onChange={(e) => setSelectedInvoice(e.target.value)}
                    size="small"
                    InputProps={{ readOnly: true }} // optional

                  />
       </Stack>
               </Grid>
             </Grid>

                
             {showTransID&& (
        <Grid item xs={12} >
              <InputLabel>Transaction ID</InputLabel>
          <TextField
            fullWidth
        
            value={values.TransactionId}
            onChange={handlePaymentChange('TransactionId')}
            size="small"
          />
        </Grid>
        )}
{showReferalID && (
  <Box sx={{ backgroundColor: '#e0f7fa', padding: '6px', mb: 1 }}>
    <Grid container spacing={1} alignItems="center">

      {/* LABEL */}
      <Grid item xs={12} sm={3}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
          Paid Ref ID
        </InputLabel>
      </Grid>

      {/* TEXTFIELD */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          value={values.RelID}
          onChange={handlePaymentChange('RelID')}
        />
      </Grid>

    </Grid>
  </Box>
)}

{showBank&&(
  <>
    <Box sx={{ backgroundColor: '#e0f7fa', padding: '6px' }}>
  <Grid container spacing={1} alignItems="center">

    {/* LABEL */}
    <Grid item xs={12} sm={4}>
      <InputLabel sx={{ fontWeight: 'bold' }}>
        <span style={{ color: 'red' }}>*</span> Bank
      </InputLabel>
    </Grid>

    {/* SELECT BOX */}
    <Grid item xs={12} sm={6}>
      <Select
        fullWidth
        value={values.bank}
        onChange={handlePaymentChange('bank')}
      >
        {banks.map((bank, idx) => (
          <MenuItem key={idx} value={bank}>
            {bank}
          </MenuItem>
        ))}
      </Select>
    </Grid>

  </Grid>
</Box>
</>
)}
   {showCheckDDTransNo && (
  <Box sx={{ backgroundColor: '#e0f7fa', padding: '6px', }}>
    <Grid container spacing={1} alignItems="center">

      {/* LABEL */}
      <Grid item xs={12} sm={4}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
          Cheque / DD / Trans No
        </InputLabel>
      </Grid>

      {/* TEXTBOX */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          value={values.chequeNo}
          onChange={handlePaymentChange('chequeNo')}
        />
      </Grid>

    </Grid>
  </Box>
)}
    
    {showDDandCheckDate && (
  <Box sx={{ backgroundColor: '#e0f7fa', padding: '6px' }}>
    <Grid container spacing={1} alignItems="center">

      {/* LABEL */}
      <Grid item xs={12} sm={4}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
          Cheque / DD / Date
        </InputLabel>
      </Grid>

      {/* DATE FIELD */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          size="small"
          value={values.chequeDate}
          onChange={handlePaymentChange('chequeDate')}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

    </Grid>
  </Box>
)}

{showCheckDDTransDate && (
  <Box sx={{ backgroundColor: '#e0f7fa', padding: '6px', mb: 1 }}>
    <Grid container spacing={1} alignItems="center">

      {/* LABEL */}
      <Grid item xs={12} sm={4}>
        <InputLabel sx={{ fontWeight: 'bold' }}>
          Cheque / DD / Trans Date
        </InputLabel>
      </Grid>

      {/* DATE PICKER */}
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={values.chequeDate ? dayjs(values.chequeDate) : null}
            onChange={(newValue) => {
              handlePaymentChange('chequeDate')({
                target: {
                  value: newValue ? newValue.format('YYYY-MM-DD') : ''
                }
              });
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small"
              }
            }}
          />
        </LocalizationProvider>
      </Grid>

    </Grid>
  </Box>
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
             <Button variant="contained" color="primary" onClick={handleFinalPay} >
Pay Now                </Button> 
 
             </Stack>
                    
           </Grid>
           
         </Grid>
     

       </Box>
      
</Grid>
{showAlert && (
 <Grid container spacing={2} justifyContent="center" alignItems="center">
   <Grid item xs={12} sm={7} justifyContent="center">
   <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
    Please Fill Pay Property Tax
  </Alert>
</Snackbar>

   </Grid>
 </Grid>
)}

{paymentSuccess && (
  <MainCard title="Transfer Fee Receipt">
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }} value={totalPayTax}>
        ✔ Payment Completed Successfully
      </Typography>
    </Box>

    <Box sx={{ mt: 3, px: 4 }}>
  <Grid container spacing={2}>
    
    <Grid item xs={6}>
      <Typography fontWeight="bold">Transaction ID :</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{paymentResult.txnId || '-'}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography fontWeight="bold">Transaction Date & Time :</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>{paymentResult.dateTime || '-'}</Typography>
    </Grid>

    <Grid item xs={6}>
      <Typography fontWeight="bold">Amount :</Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography>₹{paymentResult.amount}</Typography>
    </Grid>

  </Grid>
</Box>

    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Button variant="contained" color="primary">
        Get Receipt
      </Button>
    </Box>
  </MainCard>
)}


     </MainCard>
     {/*  */}
     <MainCard>   
          <Grid>

       <Grid container spacing={4.5}>
         <Grid item xs={12} md={10} lg={12}>
           <Box>
             <Box>
              
             <Grid container spacing={1} justifyContent="center">
        <Grid item xs={6} sm={2.8}>
          <Stack sx={{ mt: 1 }} spacing={1}>
            <InputLabel style={{ fontWeight: 'bold' }}>Receipt:</InputLabel>
          </Stack>
        </Grid>
        <Grid item xs={6} sm={5.3} mb={1}>
          <Stack spacing={1}>
            <Select
              fullWidth
              value={receiptType}
              onChange={(e) => setReceiptType(e.target.value)}
            >
                            <MenuItem value="">All</MenuItem>

              <MenuItem value="Transfer Fee">Transfer Fee</MenuItem>
              {/* Add more types if needed */}
            </Select>
          </Stack>
        </Grid>
      </Grid>

      {/* Owner-wise Transfer Fee Table */}
      {receiptType === 'Transfer Fee' && transferFeeTxns.length > 0 && (
  <TableContainer component={Paper} sx={{ mt: 2 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell><b>Receipt</b></TableCell>
          <TableCell><b>MerchantTxnRefNumber</b></TableCell>
          <TableCell><b>BillBook No</b></TableCell>
          <TableCell><b>Invoice No</b></TableCell>
          <TableCell><b>Transfer Fee</b></TableCell>
          <TableCell><b>Transaction Date</b></TableCell>
          <TableCell><b>Payment Resource</b></TableCell>
          <TableCell><b>Payment Mode</b></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {transferFeeTxns.map((txn) => (
          <TableRow key={txn.BTId}>
            <TableCell>
              <Button
                size="small"
                variant="contained"
                onClick={() =>
                  handleDownloadReceipt(txn.MerchantTxnRefNumber)
                }
              >
                Download
              </Button>
            </TableCell>
            <TableCell>{txn.MerchantTxnRefNumber}</TableCell>
            <TableCell>{txn.BillBookNo}</TableCell>
            <TableCell>{txn.InvoiceNo}</TableCell>
            <TableCell>{txn.TransferFee}</TableCell>
            <TableCell>
              {new Date(txn.CreatedDate).toLocaleString()}
            </TableCell>
            <TableCell>{txn.PaymentResource || 'N/A'}</TableCell>
            <TableCell>{txn.PaymentMode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}


             </Box>
           </Box>
         </Grid>
      
       </Grid>
      
      
</Grid>
{showAlert && (
 <Grid container spacing={2} justifyContent="center" alignItems="center">
   <Grid item xs={12} sm={7} justifyContent="center">
   <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
    Please Fill Pay Property Tax
  </Alert>
</Snackbar>

   </Grid>
 </Grid>
)}

{paymentSuccess && (
  <MainCard title="Transfer Fee Receipt">
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
        ✔ Payment Completed Successfully
      </Typography>
    </Box>

    <Box sx={{ mt: 3, px: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography fontWeight="bold">Transaction ID :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>22935WIP12</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight="bold">Transaction Date & Time :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>3:45 PM</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography fontWeight="bold">Amount :</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>₹110</Typography>
        </Grid>
      </Grid>
    </Box>

    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Button variant="contained" color="primary">
        Get Receipt
      </Button>
    </Box>
  </MainCard>
)}
<Snackbar
  open={snackbarOpen}
  autoHideDuration={4000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>


     </MainCard>
       </MainCard>
       </>
      
     )}
   </MainCard>
  


   </>
)}

</>
  );

}
export default TransferFee;
