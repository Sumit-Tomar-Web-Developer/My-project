import React from 'react';
import { Grid, InputLabel,Alert, ListItem,List,Accordion ,AccordionSummary ,AccordionDetails ,Stack, TextField,Table,TableHead,TableRow,TableCell,TableBody,IconButton,Typography,Box,Button,Card,CardContent, FormControlLabel, Checkbox, Link, Autocomplete, Select, MenuItem, FormControl } from '@mui/material';

import MainCard from 'components/MainCard';
import { CaretRightOutlined, DollarOutlined, PayCircleOutlined, RightCircleOutlined, SettingOutlined } from '@ant-design/icons';
import FooterOnline from './FooterOnline';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import jsPDF from "jspdf";

import Snackbar from '@mui/material/Snackbar';
import { Row } from 'jspdf-autotable';
import { fetchWardNo } from 'services/wardnumber.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { DataGrid } from '@mui/x-data-grid';
import { markOnlinePaymentFailed, payOnlinePayment, searchPropertyOnlinePayment, verifyOnlinePayment } from 'services/paymentServices/onlinePaymentService/onlinePaymentService';
import { getCurrentBalanceDetails, getCurrentPenalty, getDiscountPercentageService, getOfflineReceipt, getOrderedTaxAliases, getPendingBalanceDetails, getPendingPenalty } from 'services/paymentServices/offlinePaymentService/offlinePaymentService';

function OnlinePayment() {


const[showNote,setShowNote]=useState(true);
const [isOpen, setIsOpen] = useState(false); 
const [showCashDetails, setShowCashDetails] = useState(false);
const [showDetails, setShowDetails] = useState(false);

  const [payAccept, setPayAccept] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);



const [currentBalance, setCurrentBalance] = useState([]);
const [pendingBalance, setPendingBalance] = useState([]);


  const currentYear = "2022";
  const pendingYear=currentYear-1;

const [discountInfo, setDiscountInfo] = useState({
  CURRENT: { percentage: 0, taxName: null },
  PENDING: { percentage: 0, taxName: null }
});


const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "info",
});


 

  const handlePayAccept = () => {
    setPayAccept(!payAccept);
  };



// const handlePayProperty = async (row) => {
//   if (!payAccept) {
//     setShowAlert(true);
//     setOpenDialog(false);
//     return;
//   }

//   // setOpenDialog(true); 
//   const paymentType = row.type; // 'PENDING' | 'CURRENT' | 'TOTAL'

//   try {
//     if (!selectedTaxRow) {
//       alert("Please select a property first");
//       return;
//     }

//     // 2️⃣ Prepare payload
//     const payload = {
//       OwnerID: selectedProperty.OwnerID,
//       FinanceYear: Number(currentYear),
//       PendingYear:
//         paymentType === "PENDING"
//           ? Number(currentYear) - 1
//           : Number(currentYear),
//       totalPaid:
//         paymentType === "PENDING"
//           ? pendingTotals.net
//           : paymentType === "CURRENT"
//           ? currentTotals.net
//           : totalTotals.net,
//       email: "deepika.dhole@gmail.com",
//       mobile: "4444444",
//       pendingBalanceObj: pendingBalance,
//       currentBalanceObj: currentBalance,
//       paymentType
//     };

//     console.log(payload,"payloadd")

//     // 1️⃣ Initiate payment
//    const initRes = await payOnlinePayment(payload);

//   console.log(initRes,"invvv")
//   const options = {
//   key: initRes.key_id,
//   amount: initRes.amount,
//   currency: initRes.currency,
//   name: "Mangaon NP",
//   description: "Property Tax Payment",
//   order_id: initRes.orderId,
//   prefill: {
//     email: payload.email,
//     contact: payload.mobile,
//   },

//   handler: async function (response) {
//     console.log("Razorpay Success:", response);

//     // Send payment ID back to backend
//     await payOnlinePayment({
//       ...payload,
//       razorpay_payment_id: response.razorpay_payment_id,
//     });

//     alert("Payment successful!");
//   },
// };

// const rzp = new window.Razorpay(options);
// rzp.open();


//   } catch (err) {
//     console.error(err);
//     alert(err.message || "Payment failed");
//   }
// };

// const handlePayProperty = async (row) => {
//   if (!payAccept) {
//     setShowAlert(true);
//     setOpenDialog(false);
//     return;
//   }

//   const paymentType = row.type;

//   try {
//     if (!selectedTaxRow) {
//       alert("Please select a property first");
//       return;
//     }

//     const payload = {
//       OwnerID: selectedProperty.OwnerID,
//       FinanceYear: Number(currentYear),
//       PendingYear:
//         paymentType === "PENDING"
//           ? Number(currentYear) - 1
//           : Number(currentYear),
//       totalPaid:
//         paymentType === "PENDING"
//           ? pendingTotals.net
//           : paymentType === "CURRENT"
//           ? currentTotals.net
//           : totalTotals.net,
//       email: selectedProperty.EmailID||'deepika.dhole@gmail.com',
//       mobile: selectedProperty.MobileNo || 99999999,
//       pendingBalanceObj: pendingBalance,
//       currentBalanceObj: currentBalance,
//       paymentType
//     };


//     // 1️⃣ CREATE ORDER
// const response = await payOnlinePayment(payload);

// // 🔍 FULL AXIOS RESPONSE
// console.log("🟦 payOnlinePayment FULL RESPONSE:", response);

// // 🔍 ONLY BACKEND DATA
// const initRes = response?.data;
// console.log("🟩 Razorpay INIT DATA:", initRes);


//     const options = {
//       key: response.key_id,
//       amount: response.amount,
//       currency: response.currency,
//       name: "Mangaon NP",
//       description: `Property Tax Payment - Invoice ${response.invoiceNo}`,
//       order_id: response.orderId,

//       prefill: {
//         email: payload.email,
//         contact: payload.mobile
//       },

//       handler: async function (response) {
//         try {
//           // 2️⃣ VERIFY PAYMENT
//           await verifyOnlinePayment({
//             invoiceNo: response.invoiceNo,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature
//           });

//           alert("✅ Payment successful");
//           setOpenDialog(false);

//         } catch (err) {
//           alert("❌ Payment verification failed");
//         }
//       },

//       modal: {
//         ondismiss: async () => {
//           alert("Payment cancelled");
//         }
//       }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//   } catch (err) {
//     console.error(err);
//     alert("Payment initiation failed");
//   }
// };



// const handlePayProperty = async (row) => {
//   if (!payAccept) {
//     setShowAlert(true);
//     setOpenDialog(false);
//     return;
//   }

//   const paymentType = row.type;

//   try {
//     if (!selectedTaxRow) {
//       alert("Please select a property first");
//       return;
//     }

//     const payload = {
//       OwnerID: selectedProperty.OwnerID,
//       FinanceYear: Number(currentYear),
    
    
//       PendingYear:
//         paymentType === "PENDING"
//           ? Number(currentYear) - 1
//           : Number(currentYear),
//       totalPaid:
//         paymentType === "PENDING"
//           ? pendingTotals.net
//           : paymentType === "CURRENT"
//           ? currentTotals.net
//           : totalTotals.net,
//       email: selectedProperty.EmailID || "deepika.dhole@gmail.com",
//       mobile: selectedProperty.MobileNo || 9999999999,
//       pendingBalanceObj: pendingBalance,
//       currentBalanceObj: currentBalance,
//       paymentType
//     };

//     // 1️⃣ CREATE ORDER
//     const response = await payOnlinePayment(payload);

//     console.log("🟦 FULL AXIOS RESPONSE:", response);

//     // ✅ ALWAYS USE response.data
//     const initRes = response;

//     console.log("🟩 Razorpay INIT DATA:", initRes);

//     const options = {
//       key: initRes.key_id,
//       amount: initRes.amount,          // already in paise
//       currency: initRes.currency,
//       name: "Mangaon NP",
//       description: `Property Tax Payment - Invoice ${initRes.invoiceNo}`,
//       order_id: initRes.orderId,

//       prefill: {
//         email: payload.email,
//         contact: payload.mobile
//       },

//       handler: async function (rzpResponse) {
//         try {
//           // 2️⃣ VERIFY PAYMENT
//           await verifyOnlinePayment({
//             invoiceNo: initRes.invoiceNo, // ✅ FROM BACKEND
//             razorpay_order_id: rzpResponse.razorpay_order_id,
//             razorpay_payment_id: rzpResponse.razorpay_payment_id,
//             razorpay_signature: rzpResponse.razorpay_signature,
//             WardNo: selectedWard,
//   PropertyNo: formData.propertyNo,
//   PartitionNo: formData.partitionNo || null,
//     pendingBalanceObj: pendingBalance,
//       currentBalanceObj: currentBalance,
//       paymentType,
//         OwnerID: selectedProperty.OwnerID,
//       FinanceYear: Number(currentYear),
    
    
//       PendingYear:
//         paymentType === "PENDING"
//           ? Number(currentYear) - 1
//           : Number(currentYear),
//       totalPaid:
//         paymentType === "PENDING"
//           ? pendingTotals.net
//           : paymentType === "CURRENT"
//           ? currentTotals.net
//           : totalTotals.net,
//       email: selectedProperty.EmailID || "deepika.dhole@gmail.com",
//       mobile: selectedProperty.MobileNo || 9999999999,

//           });

//           alert("✅ Payment successful");
//           setOpenDialog(false);
//         } catch (err) {
//           console.error(err);
//           alert("❌ Payment verification failed");
//         }
//       },

//       // modal: {
//       //   ondismiss: () => {
//       //     alert("Payment cancelled");
//       //   }
//       // }
//       modal: {
//   ondismiss: async () => {
//     try {
//       // 🔴 CALL FAILURE API HERE
//       await markOnlinePaymentFailed({
//         invoiceNo: initRes.invoiceNo
//       });

//       alert("❌ Payment cancelled");
//     } catch (err) {
//       console.error("Failed to mark payment as FAILED", err);
//     }
//   }
// }

//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();

//   } catch (err) {
//     console.error(err);
//     alert("Payment initiation failed");
//   }
// };

const [onlineTxnId, setOnlineTxnId] = useState("");
const [onlineAmount, setOnlineAmount] = useState("");
const[paySuccess,setPaySuccess]=useState(false);


const handleGetReceipt = () => {
  const doc = new jsPDF("p", "mm", "a4");

  // ===== HEADER =====
  doc.setFontSize(16);
  doc.text("PAYMENT RECEIPT", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text("Municipal Corporation", 105, 27, { align: "center" });

  doc.line(20, 32, 190, 32);

  // ===== CONTENT =====
  doc.setFontSize(12);

  doc.text(`Transaction ID :`, 20, 45);
  doc.text(`"DUMMY_TXN_001"}`, 80, 45);

  doc.text(`Transaction Amount :`, 20, 55);
 // doc.text(`₹ ${taxTotal || 0}`, 80, 55);

  doc.text(`Payment Mode :`, 20, 65);
  doc.text(`ONLINE`, 80, 65);

  doc.text(`Date :`, 20, 75);
  doc.text(new Date().toLocaleDateString(), 80, 75);

  doc.line(20, 85, 190, 85);

  // ===== FOOTER =====
  doc.setFontSize(10);
  doc.text(
    "This is a system generated receipt. No signature required.",
    105,
    95,
    { align: "center" }
  );

  // ===== DOWNLOAD =====
  doc.save(`Receipt_ || "DUMMY"}.pdf`);
};

const handlePayProperty = async (row) => {
  console.log("Razorpay loaded?", window.Razorpay);

  if (!payAccept) {
    setShowAlert(true);
    setOpenDialog(false);
    return;
  }

  const paymentType = row.type;

  try {
    if (!selectedTaxRow) {
      alert("Please select a property first");
      return;
    }
    console.log( selectedProperty.EmailID,"selected id email")

    const payload = {
      OwnerID: selectedProperty.OwnerID,
      FinanceYear: Number(currentYear),
      PendingYear:
        paymentType === "PENDING"
          ? Number(currentYear) - 1
          : Number(currentYear),
      totalPaid:
        paymentType === "PENDING"
          ? pendingTotals.net
          : paymentType === "CURRENT"
          ? currentTotals.net
          : totalTotals.net,
      email: selectedProperty.EmailID || "deepika.dhole@gmail.com",
      mobile: selectedProperty.MobileNo || 9999999999,
      pendingBalanceObj: pendingBalance,
      currentBalanceObj: currentBalance,
      paymentType
    };

    // 1️⃣ CREATE ORDER
    const initRes = await payOnlinePayment(payload);

    const options = {
      key: initRes.key_id,
      amount: initRes.amount,
      currency: initRes.currency,
      name: "Mangaon NP",
      description: `Property Tax Payment - Invoice ${initRes.invoiceNo}`,
      order_id: initRes.orderId,

      prefill: {
        email: payload.email,
        contact: payload.mobile
      },

      handler: async function (rzpResponse) {
        try {

       console.log("Razorpay response:", rzpResponse); // ✅ FIXED

    // ✅ SET UI STATE FIRST
    setOnlineTxnId(rzpResponse.razorpay_payment_id);
    setOnlineAmount(initRes.amount / 100);
    setPaySuccess(true);



          await verifyOnlinePayment({
            invoiceNo: initRes.invoiceNo,
            razorpay_order_id: rzpResponse.razorpay_order_id,
            razorpay_payment_id: rzpResponse.razorpay_payment_id,
            razorpay_signature: rzpResponse.razorpay_signature,
            WardNo: selectedWard,
            PropertyNo: formData.propertyNo,
            PartitionNo: formData.partitionNo || null,
            email: selectedProperty.EmailID || "deepika.dhole@gmail.com",
          });

          alert("✅ Payment successful");
          setOpenDialog(false);
          setShowCashDetails(false);
          setShowTaxDetails(false);
          //setPaySuccess(true);

        } catch (err) {
          console.error(err);
          alert("❌ Payment verification failed");
        }
      },

      modal: {
        ondismiss: async () => {
              console.log("🔥 MODAL DISMISSED");

          await markOnlinePaymentFailed({
            
            invoiceNo: initRes.invoiceNo,
            failureReason: "USER_CANCELLED"
          });

          alert("❌ Payment cancelled");
        }
      }
    };

    // 🔥 CREATE INSTANCE
    const rzp = new window.Razorpay(options);

    // 🔥 HANDLE FAILED EVENT (THIS WAS MISSING)
    rzp.on("payment.failed", async function (response) {
        console.log("🔥 PAYMENT FAILED EVENT", response);

      await markOnlinePaymentFailed({
        invoiceNo: initRes.invoiceNo,
        failureReason: response?.error?.description || "UNPROCESSED"
      });

      alert("❌ Payment failed");
    });

    // 🔥 OPEN RAZORPAY
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment initiation failed");
  }
};


const[open,setOpen]=useState(false);
  

  const handlePayNowContextMenu = (event) => {
    event.preventDefault(); 
    handlePayProperty(); 
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

// Receipt
const handleOpenVDialog = (event) => {
  setOpenReceiptDetails(true);

};

const [openReceiptDetails, setOpenReceiptDetails] = useState(false);

const handleReceiptDetails = () => {
  setOpenReceiptDetails(false);
};

const [currentPage, setCurrentPage] = useState(1); // Initial page
const [fontSize, setFontSize] = useState(13); // Initial font size
const totalPages = 4; // Total number of pages

const increaseFontSize = () => {
  setFontSize((prevSize) => prevSize + 1);
};

const decreaseFontSize = () => {
  setFontSize((prevSize) => Math.max(prevSize - 1, 10)); // Ensure minimum font size is 10
};

const downloadTermsAndConditions = () => {
  const termsContent = `
    CMC Terms and Conditions For Online

    Terms and Conditions For Online-Payments
    The Terms and Conditions contained herein shall apply to any person (“User”) using the services of
    Chandrapur Municipal Corporation(CMC). for making payments through an online payment gateway service
    (“Service ”) offered by CMC in association with concern Bank and Tech Process (“Payment Service
    Providers ”) through CMC’s website i.e. http://www.chandrapurmc.org. Each User is therefore deemed to
    have read and accepted these Terms and Conditions.
    A. Privacy Policy
    CMC respects and protects the privacy of the individuals that access the information and use the
    services provided through them. Individually identifiable information about the User is not willfully
    disclosed to any third party without first receiving the User's permission, as covered in this Privacy
    Policy.
    This Privacy Policy describes CMC ’s treatment of personally identifiable information that CMC
    collects when the User is on the CMC ’s website. CMC does not collect any unique information
    about the User (such as User's name, email address, age, gender etc.) except when you specifically
    and knowingly provide such information on the Website. Like any business interested in offering the
    highest quality of service to clients, CMC may, from time to time, send email to the User and other
    communication to tell the User about the various services, features, functionality and content
    offered by CMC website or seek voluntary information from The User.
    Please be aware, however, that CMC will release specific personal information about the User if
    required to do so in the following circumstances:
    a) in order to comply with any valid legal process such as a search warrant, statute, or court order, or
    available at time of opening the tender
    b) if any of User’s actions on our website violate the Terms of Service or any of our guidelines for
    specific services, or
    c) To protect or defend CMC ’s legal rights or property, the CMC ’s site, or the Users of the site or;
    d) To investigate, prevent, or take action regarding illegal activities, suspected fraud, situations
    involving potential threats to the security, integrity of CMC ’s website/offerings.
    B. General Terms and Conditions For E-Payment
    
  `;

  // Convert the content to a blob
  const termsBlob = new Blob([termsContent], { type: 'text/plain' });

  // Create a temporary anchor element to trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(termsBlob);
  downloadLink.download = 'Receipt_online_payment.pdf';
  downloadLink.click();
};

const nextPage = () => {
  setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
};

const prevPage = () => {
  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
};

const[showCompliant,setShowComplaint]=useState(false);
const[hideSearchCriteria,setHideSearchCriteria]=useState(true);

const handleFixClick = () => {
  setShowComplaint(true);
  setHideSearchCriteria(false);
};


const handleCancel=()=>
{
  setHideSearchCriteria(true);
  setShowComplaint(false);
  setShowReciept(false);   

}

const handleCancelSearch=()=>
{
  //  setHideSearchCriteria(true);
  // setShowComplaint(false);
            setIsOpen(!isOpen); 
            setShowPropertyGrid(false); 

}
 
const[wardList,setWardList]=useState([]);
const [selectedPropertyOwnerID, setSelectedPropertyOwnerID] = useState(null);
const [showPropertyGrid, setShowPropertyGrid] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);
const[propertyData,setPropertyData]=useState([]);
const [selectedProperty, setSelectedProperty] = useState(null);
   const[selectedWard,setSelectedWard]=useState('');
  const[propertyNoList,setPropertyNoList]=useState([])
  const [taxHeaders, setTaxHeaders] = useState([]);
  

const [formData, setFormData] = useState({
  propertyIndexNo: '',
  wardNo: '',
  propertyNo: '',
  partitionNo:'',
  primaryOwnerEng: '',
  primaryOwnerMar: '',
  renterEng: '',
  renterMar: '',
  computerNo: '',
  mobileNo: '',
  billBookNo:'',
  invoiceNo:'',
  txnStatus:'',
});
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const [detailType, setDetailType] = useState(null); // 'PENDING' | 'CURRENT' | 'TOTAL'
const handleButtonClickView = (type) => {
  setDetailType(type);
   setShowDetails(!showDetails); 
    setShowCashDetails(false); 
};

useEffect(() => {
  const loadTaxAliases = async () => {
    try {
      const res = await getOrderedTaxAliases();
      // Just append new alias at the end (NO API CHANGE)
      const updated = [
        ...res.data,
         { key: "Interest", label: "शास्ती कर " },
         { key: "DiscountPercentage", label: "विशेष सूट" } 
      ];
      console.log(res,"headers taxes ")
      setTaxHeaders(updated);   
    } catch (err) {
      console.error(err);
    }
  };
  loadTaxAliases();
}, []);
useEffect(() => {
  if (selectedRow) {
    console.log("✅ Selected Row online payment:", selectedRow);
    console.log("🆔 OwnerID:", selectedRow.OwnerID);
    console.log("🆔 OwnerID seleele:", selectedPropertyOwnerID);   
  }
}, [selectedRow]);


const fetchDiscount = async (OwnerID, paymentType, year) => {
  const reqBody = {
    OwnerID,
    DiscountFinanceYear: year,
    DiscountPendingYear: year,
    PaymentType: paymentType,
    PaymentMode: "ONLINE"
  };

  const res = await getDiscountPercentageService(reqBody);

  console.log(res,"ressssss")

  if (res?.success) {
    setDiscountInfo(prev => ({
      ...prev,
      [paymentType]: {
        percentage: Number(res.discountPercentage ?? 0),
        taxName: res.taxName
      }
    }));
  }
};

const safeObject = (obj = {}) => {
  const result = {};
  for (const key in obj) {
    const val = obj[key];
    result[key] = val == null || val < 0 ? 0 : val;
  }
  return result;
};
const extractPropertyObject = async(res) => {

  if (!res?.data) return null;

  // single object case
  if (res.data.OwnerID) return res.data;

console.log(res.data,"KKLL");

      const receiptRes = await getOfflineReceipt(res.data.OwnerID);
  
      console.log(receiptRes,"rrrdddcccee")
      if (receiptRes?.found) {
    setHasReceipt(true);
    setShowReciept(true);
    setReceiptData(receiptRes.data);}
  

  // wrapped object case
  if (res.data.data?.OwnerID) return res.data.data;

  return null;
};

useEffect(() => {
  console.log(selectedProperty,"selected property dataaaa")

  console.log(selectedProperty?.OwnerID,"iddddddddddddddd")
  if (!selectedProperty?.OwnerID) return;

  const OwnerID = selectedProperty.OwnerID;

  const fetchAllData = async () => {
    try {
      // 1️⃣ Pending balance
      const pending = await getPendingBalanceDetails({
        OwnerID,
        p_Year: currentYear,
      });

      // 2️⃣ Current balance
      const current = await getCurrentBalanceDetails({
        OwnerID,
        p_Year: currentYear,
      });

      console.log(pending+current,"CP RTAXXX");


      

      setPendingBalance(safeObject(pending[0] || {}));
      setCurrentBalance(safeObject(current[0] || {}));

      // 3️⃣ Penalties
      const payload = { OwnerID, Year: currentYear };
      // const [currentPenalty, pendingPenalty] = await Promise.all([
      //   getCurrentPenalty(payload),
      //   getPendingPenalty(payload)
      // ]);

       const currentPenalty = 0;
      const pendingPenalty = 0;
      console.log(currentPenalty, pendingPenalty, "penalties online");

      // 4️⃣ Discounts (CURRENT + PENDING)
      await Promise.all([
        fetchDiscount(OwnerID, "CURRENT", currentYear),
        fetchDiscount(OwnerID, "PENDING", currentYear)
      ]);

    } catch (err) {
      console.error(err);
    }
  };

  fetchAllData();
}, [selectedProperty?.OwnerID]);

const calculateTotals = (balance, discountInfo) => {
  const taxTotal = Number(balance?.TaxTotal ?? 0);
  const interest = Number(balance?.Interest ?? 0);

  const gross = taxTotal + interest;

  let discount = 0;

  if (discountInfo?.CURRENT?.percentage && discountInfo?.taxName) {
    const taxValue = Number(balance?.[discountInfo.taxName] ?? 0);
    discount = Math.round((taxValue * discountInfo.percentage) / 100);
  }

  const net = Math.max(gross - discount, 0);

  return { gross, discount, net };
};

const pendingTotals = calculateTotals(
  pendingBalance,
  discountInfo.PENDING
);

const currentTotals = calculateTotals(
  currentBalance,
  discountInfo.CURRENT
);

const totalTotals = {
  gross: pendingTotals.gross + currentTotals.gross,
  discount: pendingTotals.discount + currentTotals.discount,
  net: Math.max(
    pendingTotals.gross +
      currentTotals.gross -
      (pendingTotals.discount + currentTotals.discount),
    0
  )
};


const rows = [
  {
    type: 'PENDING',
    year: pendingYear,
    tax: pendingTotals.gross,
    interest: pendingBalance?.Interest || 0,
    discount: pendingTotals.discount,
    net: pendingTotals.net
  },
  {
    type: 'CURRENT',
    year: currentBalance?.FinanceYear,
    tax: currentTotals.gross,
    interest: currentBalance?.Interest || 0,
    discount: currentTotals.discount,
    net: currentTotals.net
  },
  {
    type: 'TOTAL',
    year: currentBalance?.FinanceYear,
    tax: pendingTotals.gross + currentTotals.gross,
    interest:
      (pendingBalance?.Interest || 0) + (currentBalance?.Interest || 0),
    discount: pendingTotals.discount + currentTotals.discount,
    net: Math.max(
      pendingTotals.gross +
        currentTotals.gross -
        (pendingTotals.discount + currentTotals.discount),
      0
    )
  }
];



 useEffect(() => {
      const loadWardNos = async () => {
        try {
          const wardNo = await fetchWardNo();
          const sortedWard = [...wardNo].sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo));
          setWardList(sortedWard);
        } catch (error) {
          console.error('Error fetching ward Number', error);
        }
      };
      loadWardNos();
    }, []);

 

      const handleWardChange = async (event) => {
          const selectedWard = Number(event.target.value);
          setSelectedWard(selectedWard);
      // const value = Number(event.target.value);
          // 🔹 update formData.wardNo
      setFormData(prev => ({
        ...prev,
        wardNo: selectedWard,
      }));
    
          try {
            const response = await fetchPropertyRangeByWard(selectedWard);
            const propertyRange = response.properties; // <- use .properties array
            if (!Array.isArray(propertyRange)) throw new Error("Invalid property range");
        
            // Sort: main property first, then partitions
            const sortedProps = propertyRange.sort((a, b) => {
              const propA = parseInt(a.NewPropertyNo, 10);
              const propB = parseInt(b.NewPropertyNo, 10);
        
              if (propA !== propB) return propA - propB;
        
              const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
              const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;
              return partA - partB;
            });
        
            setPropertyNoList(sortedProps);
          } catch (error) {
            console.error('Error fetching property range:', error);
          }
        
         
        };

        const handleSerachCancel = () => {
  setFormData({
    propertyIndexNo: '',
    wardNo: '',
    propertyNo: '',
    partitionNo: '',
    primaryOwnerEng: '',
    primaryOwnerMar: '',
    renterEng: '',
    renterMar: '',
    computerNo: '',
    mobileNo: '',
    billBookNo: '',
    invoiceNo: '',
    txnStatus: '',
  });
  setSelectedWard('');
  setSelectedPropertyOwnerID('')
   setShowReciept(false);
   setShowPropertyGrid(false);   
};

const columnsProperty = [
  {
    field: "rowSelect",
    headerName: "Select",
    width: 90,
    sortable: false,
    renderCell: (params) => (
      <input
        type="radio"
        name="propertySelect"
        checked={selectedRow?.OwnerID === params.row.OwnerID}
        onChange={() => {
          setSelectedRow(params.row);
          setSelectedPropertyOwnerID(params.row.OwnerID)
          setSelectedProperty(params.row);
          setIsOpen(!isOpen); 
          setShowTaxDetails(true); 
        }}
      />
    ),
  },
  { field: "NewWardNo", headerName: "Ward No", flex: 1 },
  { field: "NewPropertyNo", headerName: "Property No", flex: 1 },
  { field: "NewPartitionNo", headerName: "Partition No", flex: 1 },
  { field: "OwnerName", headerName: "Owner Name", flex: 1.5 },
  { field: "renterName", headerName: "Renter Name", flex: 1.5 },
];



const rowsOwners = (propertyData || []).map((row, index) => ({
  id: row.OwnerID ?? index + 1,   // ✅ unique id (best)
  ...row,
}));
const normalizeToArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [];
};
const [hasReceipt, setHasReceipt] = useState(false);
const normalizeProperty = (res) => {
  if (!res || !res.data) return null;

  // case: data is array
  if (Array.isArray(res.data)) {
    return res.data[0] || null;
  }

  // case: data is object
  if (typeof res.data === "object") {
    return res.data;
  }

  return null;
};


const handleGetProperty = async () => {  
  setShowNote(false); 
   try {
    const {
      wardNo,
      propertyNo,
      computerNo,
      mobileNo,
      primaryOwnerEng,
      primaryOwnerMar,
      occupierEng,
      occupierMar,
    } = formData;


    

    // ✅ build payload dynamically
    const payload = {};

    if (wardNo) payload.wardNo = wardNo;
    if (propertyNo) payload.propertyNo = propertyNo;
    if (computerNo) payload.computerNo = computerNo;
    if (mobileNo) payload.mobileNo = mobileNo;
    if (primaryOwnerEng) payload.primaryOwnerEng = primaryOwnerEng;
    if (primaryOwnerMar) payload.primaryOwnerMar = primaryOwnerMar;
    if (occupierEng) payload.occupierEng = occupierEng;
    if (occupierMar) payload.occupierMar = occupierMar;

    // ❌ nothing entered
    if (Object.keys(payload).length === 0) {
      alert("Please enter at least one search criteria");
      return;
    }
 
     // 🔹 CASE 1: ward No & property No → Fetch Multiple Properties
    if (payload.wardNo && payload.propertyNo) {
      const res = await searchPropertyOnlinePayment({
        wardNo,
        propertyNo,
      });
      // const property = res.data; // ✅ get object
const property = normalizeProperty(res);

        console.log(res,"ppoffline");
        console.log(property,"ppofflineproperty");


  //const property = extractPropertyObject(res);

  //console.log(property,"ppoffline");
 // ✅ store FULL OBJECT
  setSelectedProperty(property);
  // ✅ STORE OWNERID IMMEDIATELY
  setSelectedPropertyOwnerID(property.OwnerID);
      setIsOpen(!isOpen);  
      setShowTaxDetails(true);
setShowCashDetails(false);
setShowReciept(false);
      //setPropertyData([property]);
      setShowPropertyGrid(true);


 // 🔥 NOW CHECK IF RECEIPT EXISTS
  try {
    const receiptRes = await getOfflineReceipt(property.OwnerID);

    if (receiptRes?.found) {
  setHasReceipt(true);
  setReceiptData(receiptRes.data);
  setShowReciept(true);   
  setIsOpen(!isOpen);  
  setShowPropertyGrid(false);
setShowTaxDetails(false);
setShowCashDetails(false);
   //setHideSearchCriteria(true);


 // setShowDebt(true);

  
}

  } catch (error) {
    console.error("Receipt check failed for online page:", error);
    setHasReceipt(false);
    //setShowDebt(true);      
  }



      return;
    }


  
      // 🔹 CASE 2: Mobile No → Fetch Multiple Properties
      if (payload.mobileNo) {
        const res = await searchPropertyOnlinePayment({  mobileNo });
setPropertyData(normalizeToArray(res.data));
        setShowPropertyGrid(true);
        return;
      }
  
      // 🔹 CASE 3: computerNo
      if (payload.computerNo) {
         const res = await searchPropertyOnlinePayment({ computerNo });
         setPropertyData(normalizeToArray(res.data));
         setShowPropertyGrid(true);
        return;
      }
  
  
      // 🔹 CASE 4: Name search (English / Marathi)
      if (payload.primaryOwnerEng || payload.primaryOwnerMar || payload.occupierEng || payload.occupierMar) {
        const res = await searchPropertyOnlinePayment({
          primaryOwnerEng,
          primaryOwnerMar,
          occupierEng,
          occupierMar
        });
        setPropertyData(normalizeToArray(res.data));
        setShowPropertyGrid(true);
        return;
      }
  
  } catch (err) {
      console.error(err);
      alert("Error fetching data");
    } 
  };


  const getDetailBalance = () => {
  if (detailType === 'PENDING') return pendingBalance;
  if (detailType === 'CURRENT') return currentBalance;

  if (detailType === 'TOTAL') {
    const combined = {};

    taxHeaders.forEach(({ key }) => {
      combined[key] =
        Number(pendingBalance?.[key] ?? 0) +
        Number(currentBalance?.[key] ?? 0);
    });

    combined.FinanceYear = 'Total';
    return combined;
  }

  return null;
};
const detailBalance = getDetailBalance();


const [selectedTaxRow, setSelectedTaxRow] = useState(null);
const [showTaxDetails, setShowTaxDetails] = useState(false);



const handlePayClick = (row) => {
  setSelectedTaxRow(row); 
  handlePayProperty(row); 
  setShowCashDetails(!showCashDetails); 
  setShowDetails(false);
};

const [receiptData, setReceiptData] = useState(null);
const[showReciept,setShowReciept]=useState(false);


// const hasPending =
//   Number(pendingBalance?.TaxTotal ?? 0) > 0 ||
//   Number(pendingBalance?.NetTotal ?? 0) > 0;

// const hasCurrent =
//   Number(currentBalance?.TaxTotal ?? 0) > 0 ||
//   Number(currentBalance?.NetTotal ?? 0) > 0;

// const hasTotal = hasPending || hasCurrent;


const hasCurrent = taxHeaders.some(
  ({ key }) => Number(currentBalance?.[key] ?? 0) > 0
);

const hasPending = taxHeaders.some(
  ({ key }) => Number(pendingBalance?.[key] ?? 0) > 0
);

const hasTotal = hasPending || hasCurrent;

console.log(hasCurrent,"CC")
console.log(hasPending,"PP")
console.log(hasTotal,"TT")


  return (
    <>
          {!isOpen && (

      <>

    <MainCard  title="Counter Payment">
    <Grid container spacing={2} justifyContent="space-between">
  <Grid item xs={12} sm={12}>
    <Typography  variant="h7" style={{ fontWeight: 'bold' }}>
      <span style={{ color: 'red' }}>*</span>
      <span>ऑनलाईन मालमत्ता कर भरणा करण्याबाबत कोणतीही तक्रार असल्यास किंवा मदत पाहिजे असल्यास कृपया टोल फ्री 1800XXXXXX क्रमांकावर संपर्क साधा helpdesk.Shirurnp@gmail.com या इमेल आय.डी. वर मेल करा.</span>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={12} mb={0.3}>
          <Grid container spacing={2} justifyContent="right">
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
              <Button variant="contained" color="primary" onClick={handleFixClick}>
              तक्रार सेवा                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
              <Button variant="contained" color="primary" >
              आमच्या बदल                 </Button>
              </Stack>
            </Grid>
          </Grid>
  </Grid>
</Grid>


 {showCompliant && (
  <>
     <MainCard style={{ backgroundColor: '#e3f2fd' }}>
     <Typography variant="h5" style={{ fontWeight: 'bold' }}>
      <span>   तक्रार सेवा </span>
     </Typography>
    
    </MainCard>   
  <MainCard>
  <Grid container spacing={2} alignItems="center">
    {/* Mobile Label */}
    <Grid item xs={12} sm={2}>
      <Stack>मोबाईल नं.</Stack>
    </Grid>

    {/* TextField */}
    <Grid item xs={12} sm={3}>
      <TextField
        fullWidth
        size="small"
        placeholder="Enter mobile number"
      />
    </Grid>
  </Grid>

  {/* Buttons Row */}
  <Grid
    container
    spacing={2}
    justifyContent="flex-start"
    style={{ marginTop: 16 }}
  >
    <Grid item>
      <Button variant="contained" color="success">
        Get Property
      </Button>
    </Grid>

    <Grid item>
      <Button variant="contained" color="success" onClick={handleCancel}>
        Cancel
      </Button>
    </Grid>
  </Grid>
</MainCard>

      </>
    )}

{hideSearchCriteria && (
  <>
    <MainCard style={{ backgroundColor: '#e3f2fd' }}>
      <Typography variant="h5" style={{ fontWeight: 'bold' }}>
        <span>Find Property</span>
      </Typography>
    </MainCard>
    <MainCard>   
         <Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={10} lg={6}>
          <Box >
            <Box>
             
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} sm={4.7}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>वार्ड क्र. :</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3} mb={1}>
                  <Stack spacing={1}>
                
 <Select
                          labelId="ward-no-label"
                          id="ward-no-select"
                          value={selectedWard}
                          onChange={handleWardChange}
                          displayEmpty
                          
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                         
                          {Array.isArray(wardList) &&
                            wardList.length > 0 &&
                            wardList.map((ward, index) => (
                              <MenuItem key={index} value={Number(ward.NewWardNo)}>
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
                    name="primaryOwnerEng"
  value={formData.primaryOwnerEng}
  onChange={handleChange}
 />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={4.6}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>भोगवटदार नाव:(इंग्रजी)</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name" placeholder="Enter Occupier Name(English)"
                    name="occupierEng"
  value={formData.occupierEng}
  onChange={handleChange} />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={4.6}>
                  <Stack sx={{ mt: 1 }} spacing={1}>
                    <InputLabel style={{ fontWeight: 'bold' }}>संगणक क्रं.</InputLabel>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={7.3} mb={1}>
                  <Stack spacing={1}>
                    <TextField required fullWidth autoComplete="family-name" placeholder="Enter Old Computer No."
                     name="computerNo"
  value={formData.computerNo}
  onChange={handleChange} /> 
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={10} lg={6}>
          <Box >
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={6} sm={4.6}>
                <Stack sx={{ mt: 1 }} spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता क्र.:</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={7.3} mb={1}>
                <Stack spacing={1}>
                  <Autocomplete
  options={propertyNoList}

  value={
    propertyNoList.find(
      x => x.OwnerID === selectedPropertyOwnerID
    ) || null
  }

 onChange={(_, selectedOption) => {
  if (!selectedOption) {
    setSelectedPropertyOwnerID(null);
    setFormData(prev => ({
      ...prev,
      propertyNo: '',
      partitionNo: ''
    }));
    return;
  }

  setSelectedPropertyOwnerID(selectedOption.OwnerID);

  setFormData(prev => ({
    ...prev,
    propertyNo: selectedOption.NewPropertyNo,
    partitionNo: selectedOption.NewPartitionNo || ''
  }));
}}


  inputValue={formData.propertyNo}
  onInputChange={(_, newInput) => {
    setFormData(prev => ({
      ...prev,
      propertyNo: newInput
    }));
  }}

  isOptionEqualToValue={(a, b) => a?.OwnerID === b?.OwnerID}

  getOptionLabel={(o) =>
    o.NewPartitionNo
      ? `${o.NewPropertyNo}_${o.NewPartitionNo}`
      : o.NewPropertyNo
  }

  // 🔴 THIS WAS MISSING
  renderInput={(params) => (
    <TextField
      {...params}
    
      size="small"
      fullWidth
    />
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
                  <TextField required fullWidth autoComplete="family-name" placeholder="Enter owner Name(Marathi)" 
                    name="primaryOwnerMar"
  value={formData.primaryOwnerMar}
  onChange={handleChange} />
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={6} sm={4.6}>
                <Stack sx={{ mt: 1 }} spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>भोगवटदार नाव:(मराठी)</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={7.3} mb={1}>
                <Stack spacing={1}>
                  <TextField required fullWidth autoComplete="family-name" placeholder="Enter occupierMar Name(Marathi)" 
                  name="occupierMar"
  value={formData.occupierMar}
  onChange={handleChange} />
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={6} sm={4.6}>
                <Stack sx={{ mt: 1 }} spacing={1}>
                  <InputLabel style={{ fontWeight: 'bold' }}>मोबाईल नं.</InputLabel>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={7.3} mb={1}>
                <Stack spacing={1}>
                  <TextField required fullWidth autoComplete="family-name" placeholder="Enter Mobile No"
                     name="mobileNo"
  value={formData.mobileNo}
  onChange={handleChange} />
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
            <Button variant="contained" color="primary" 
            onClick={handleGetProperty}>
                Get Property
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <Button variant="contained" color="secondary" onClick={handleSerachCancel}>
                Cancel
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
     
</Grid>
    </MainCard>
    </>
)}
    


  </MainCard>
  
 {showPropertyGrid && (
   <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
     <Box sx={{ height: 500, width: "100%" }}>
       <DataGrid
         rows={rowsOwners}
         columns={columnsProperty}
         pageSizeOptions={[10, 25, 50, 100]}
         disableRowSelectionOnClick
      
         sx={{
           "& .MuiDataGrid-columnHeaders": {
             fontWeight: "bold",
             fontSize: 15,
           },
           "& .MuiDataGrid-row:hover": {
             backgroundColor: "#f5f5f5",
             cursor: "pointer",
           },
         }}
       />
     </Box>
   </Grid>
 )}
</> 
 )} 
{isOpen && (
 <>
 <MainCard title="Get Property Online Payment">
   <Grid container spacing={2} justifyContent="space-between">
   <Grid item xs={12}>
 <Typography  variant="h7" style={{ fontWeight: 'bold' }}>
   <span style={{ color: 'red' }}>*</span>
   <span>ऑनलाईन मालमत्ता कर भरणा करण्याबाबत कोणतीही तक्रार असल्यास किंवा मदत पाहिजे असल्यास कृपया टोल फ्री 1800XXXXXX क्रमांकावर संपर्क साधा helpdesk.Shirurnp@gmail.com या इमेल आय.डी. वर मेल करा.</span>
 </Typography>
</Grid>
<Grid item xs={12} sm={12} mb={0.3}>
       <Grid container spacing={2} justifyContent="right">
         
         <Grid item xs={12} sm={1.5}>
           <Stack spacing={1}>
           <Button variant="contained" color="primary"  >
           आमच्या बदल                 </Button>
           </Stack>
         </Grid>
           <Grid item xs={12} sm={1.5}>
           <Stack spacing={1}>
           <Button variant="contained" color="primary" onClick={handleCancelSearch} >
          Back to Search              </Button>
           </Stack>
         </Grid>
         
       </Grid>
</Grid>
</Grid>
   <MainCard style={{ backgroundColor: '#e3f2fd' }}>
     <Typography variant="h5" style={{ fontWeight: 'bold' }}>
       <span>प्राथमिक कर धारकाची माहिती</span>
     </Typography>
   </MainCard>
   <MainCard>   
        <Grid>

     <Grid container spacing={4.5}>
       <Grid item xs={12} md={10} lg={4}>
        
           <Box>
             <Grid container spacing={1} justifyContent="center">
               <Grid item xs={6} sm={5.2}>
                 <Stack sx={{ mt: 1 }} spacing={1}>
                   {/* <InputLabel style={{ fontWeight: 'bold' }}>वार्ड क्र. :</InputLabel> */}
                                     <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>वार्ड क्र. : </Typography>
                   
                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.3} mb={1}>
   {/* <TextField required fullWidth autoComplete="family-name" placeholder="Enter Ward No." value={wardNo}
                onChange={handleWardNoChange}/>  
                          */} <Stack spacing={1}sx={{ mt: 2 }}>
 <InputLabel style={{ fontWeight: 'bold' }}>{selectedProperty.NewWardNo}</InputLabel> 
 </Stack>       
        </Grid>
             </Grid>
             <Grid container spacing={1} justifyContent="center">
               <Grid item xs={6} sm={5.2}>
                 <Stack sx={{ mt: 2 }} spacing={1}>
                   {/* <InputLabel style={{ fontWeight: 'bold' }}>भोगवटदार नाव:</InputLabel> */}
                                                        <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>भोगवटदार नाव: </Typography>

                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.3} mb={1}>
                 <Stack spacing={1}sx={{ mt: 2 }}>
                               <InputLabel style={{ fontWeight: 'bold' }}>{selectedProperty.OccupierName}</InputLabel>
       
                 </Stack>
               </Grid>
             </Grid>
             <Grid container spacing={1} justifyContent="center">
               <Grid item xs={6} sm={5.2}>
                 <Stack sx={{ mt: 2 }} spacing={1}>
                   {/* <InputLabel style={{ fontWeight: 'bold' }}>संपर्क क्र.:</InputLabel> */}
                                                        <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>संपर्क क्र.:</Typography>

                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.3} mb={1}>
                 <Stack spacing={1} sx={{ mt: 2 }}>
 <InputLabel style={{ fontWeight: 'bold' }}>{selectedProperty.MobileNo}</InputLabel>                 </Stack>
               </Grid>
             </Grid>
            
           </Box>
        
       </Grid>
       <Grid item xs={12} md={10} lg={4}>
         <Box title="Find Property">
           <Box>
             <Grid container spacing={2} justifyContent="center">
               <Grid item xs={6} sm={2.9}>
                 <Stack sx={{ mt: 2 }} spacing={1}>
                   {/* <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता क्र.: </InputLabel> */}
                                                        <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>मालमत्ता क्र.: </Typography>

                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.3} mb={1}>
                 <Stack spacing={1}sx={{ mt: 2 }}>
 <InputLabel style={{ fontWeight: 'bold' }}>{selectedProperty.NewPropertyNo}</InputLabel>                 
                 </Stack>
               </Grid>
             </Grid>
             <Grid container spacing={2} justifyContent="center">
               <Grid item xs={6} sm={3.4}>
                 <Stack sx={{ mt: 2 }} spacing={1}>
                   {/* <InputLabel style={{ fontWeight: 'bold' }}>भाडेकरी नाव: </InputLabel> */}
                                                        <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>भाडेकरी नाव : </Typography>

                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.3} mb={1}>
                 <Stack spacing={1}sx={{ mt: 2 }}>
 <InputLabel style={{ fontWeight: 'bold' }}>{selectedProperty.renterName}</InputLabel>                 
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
                 <Stack sx={{ mt: 2 }} spacing={1}>
                   {/* <InputLabel style={{ fontWeight: 'bold' }}>प्राथमिक कर धारकाचे नाव:</InputLabel> */}
                                                        <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>प्राथमिक कर धारकाचे नाव : </Typography>

                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.8} mb={1}>
                 <Stack spacing={1} sx={{ mt: 2 }}>
 <InputLabel style={{ fontWeight: 'bold' }}>{selectedProperty.OwnerName}</InputLabel>                 
                 </Stack>
               </Grid>
             </Grid>
             <Grid container spacing={1} justifyContent="center">
               <Grid item xs={6} sm={6.2}>
                 <Stack sx={{ mt: 2 }} spacing={1}>
                   {/* <InputLabel style={{ fontWeight: 'bold' }}>दुकानाचे नाव /अपार्टमेन्टचे नाव:</InputLabel> */}
                   <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>दुकानाचे नाव /अपार्टमेन्टचे नाव : </Typography>

                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.8} mb={1}>
                 <Stack spacing={1}sx={{ mt: 2 }}>
            <InputLabel style={{ fontWeight: 'bold' }}>{selectedProperty.BuildingOrShopName}</InputLabel>                 
     
                 </Stack>
               </Grid>
             </Grid>
             <Grid container spacing={1} justifyContent="center">
               <Grid item xs={6} sm={6.2}>
                 <Stack sx={{ mt: 2 }} spacing={1}>
                   {/* <InputLabel style={{ fontWeight: 'bold' }}>पत्ता :</InputLabel> */}
                                                        <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>पत्ता : </Typography>

                 </Stack>
               </Grid>
               <Grid item xs={6} sm={5.8} >
                 <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel style={{ fontWeight: 'bold' }}>{selectedProperty.Address}</InputLabel>                 
                 </Stack>
               </Grid>
             </Grid>
            
           </Box>
         </Box>
       </Grid>
       
     </Grid>
    
    
</Grid>
   </MainCard>


</MainCard>



{showTaxDetails && (
  <>
<MainCard style={{ backgroundColor: '#e3f2fd' }}>



<Box sx={{ display: 'flex', alignItems: 'center' }}>
 <Typography variant="h5" gutterBottom sx={{ color: 'blue', fontWeight: 'bold', marginRight: 'auto', marginBottom: '2vw' }}>
 कराचे विवरण    </Typography>
 <Button  variant="contained"  >
View Bill    </Button>
<IconButton  variant="contained" color="secondary" sx={{ fontSize: '1.8rem' }}>
<SettingOutlined />
</IconButton>
</Box>

   </MainCard>
<MainCard >
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
         <Grid item xs={12} sm={12}>
           <Box className="card">
             <Card>
               <CardContent>
                 <Box sx={{ overflowX: 'auto', height: '250px' }}>
                   {/* Table */}
                 <Table sx={{ minWidth: 2500 }}> {/* Set wide enough for all columns */}
                      
{(hasPending || hasCurrent || hasTotal) && (
                       <TableHead>
                         <TableRow>
                           <TableCell>Select</TableCell>
                           <TableCell>आर्थिक वर्ष</TableCell> {/* NEW */}
                           {taxHeaders.map((h) => (
                             <TableCell key={h.key} sx={{ whiteSpace: "nowrap" }}>
                               {h.label}
                             </TableCell>
                           ))}
                            
                                       <TableCell>एकूण कर</TableCell>
                             <TableCell>निव्वळ एकूण कर</TableCell>
                 
                         </TableRow>
                       </TableHead>
                       )}
                 
                       <TableBody>
                      {hasPending &&(
                         <TableRow>
                       
                           <TableCell>
                             {hasPending && (
                               <Button
                                 variant="contained"
                                 color="warning"
                                 size="small"
onClick={() =>
    handlePayClick({
      type: "PENDING",
      year: previousYear,
      ...pendingTotals
    })
  }                 
                               >
                                 PAY PENDING
                               </Button>
                             )}
                           </TableCell>
                            <TableCell>{previousYear}</TableCell>
                           {taxHeaders.map((h) => {
                  if (h.key === "DiscountPercentage") {
                     return (
                       <TableCell key={h.key}>
                         {pendingTotals.discount}
                       </TableCell>
                     );
                   }
                 
                   return (
                     <TableCell key={h.key}>
                       {pendingBalance?.[h.key] ?? 0}
                     </TableCell>
                   );
                 })}
                 
                           
                          <TableCell>{pendingTotals.gross}</TableCell>
                 <TableCell>{pendingTotals.net}</TableCell>
                 
                 
                         </TableRow>
                 )}
                         {/* Current Balance Row */}

                           {hasCurrent && (
                         <TableRow>
                       
                           <TableCell>
                           
                               <Button
                                 variant="contained"
                                 color="success"
                                 size="small" 
                     onClick={() =>
    handlePayClick({
      type: "CURRENT",
      year: currentYear,
      ...currentTotals
    })
  }
                               >
                                 PAY CURRENT
                               </Button>
                            
                           </TableCell>
                            <TableCell>{currentYear}</TableCell>
                         {taxHeaders.map((h) => {
                   if (h.key === "DiscountPercentage") {
                     return (
                       <TableCell key={h.key}>
                         {currentTotals.discount}
                       </TableCell>
                     );
                   }
                 
                   return (
                     <TableCell key={h.key}>
                       {currentBalance?.[h.key] ?? 0}
                     </TableCell>
                   );
                 })}
                 
                             
                             <TableCell>{currentTotals.gross}</TableCell>
                 <TableCell>{currentTotals.net}</TableCell>
                 
                 
                         </TableRow>
                           )}
                         {/* TOTAL Row */}
                          {hasTotal && (
                         <TableRow sx={{ background: "#eef" }}>
                          
                           <TableCell>
                            
                               <Button
                                 variant="contained"
                                 color="primary"
                                 size="small"
 onClick={() =>
    handlePayClick({
      type: "TOTAL",
      year: "TOTAL",
      ...totalTotals
    })
  }                               >
                                 PAY TOTAL
                               </Button>
                          
                           </TableCell>
                            <TableCell>{"Total"}</TableCell>
                          {taxHeaders.map((h) => {
                   if (h.key === "DiscountPercentage") {
                     return (
                       <TableCell key={h.key}>
                         {totalTotals.discount}
                       </TableCell>
                     );
                   }
                 
                   return (
                     <TableCell key={h.key}>
                       {(pendingBalance?.[h.key] ?? 0) +
                        (currentBalance?.[h.key] ?? 0)}
                     </TableCell>
                   );
                 })}
                 
                                
                         <TableCell>{totalTotals.gross}</TableCell>
                          
                 <TableCell>{totalTotals.net}</TableCell>
                 
                 
                 
                 
                         </TableRow>
                          )}
                       </TableBody>
                     </Table>

                     {!hasPending && !hasCurrent && !hasTotal && (
                       <Typography align="center" sx={{ mt: 2 }}>
                         No tax dues available
                       </Typography>
                     )}
                     
                 </Box>
               </CardContent>
             </Card>
           </Box>
         </Grid>
       </Grid>

       
</MainCard>
</>
                        )}

{/* //table 2 */}
{showDetails && (
<>
<MainCard >
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
         <Grid item xs={12} sm={12}>
           <Box className="card">
             <Card>
               <CardContent>
                
               
                 <Box sx={{ overflowX: 'auto', height: '300px' }}>
                   {/* Table */}
                   <Table>
                     {/* Table Header */}
                    <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
  <TableRow>
    <TableCell>आर्थिक वर्ष</TableCell>
    {taxHeaders.map((h) => (
      <TableCell key={h.key}>{h.label}</TableCell>
    ))}
  </TableRow>
</TableHead>

                     {/* Table Body */}
                    <TableBody>
  {detailBalance && (
    <TableRow>
      <TableCell>{detailBalance.FinanceYear}</TableCell>

      {taxHeaders.map((h) => (
        <TableCell key={h.key}>
          {Number(detailBalance?.[h.key] ?? 0)}
        </TableCell>
      ))}
    </TableRow>
  )}
</TableBody>

                   </Table>
                 </Box>
               </CardContent>
             </Card>
           </Box>
         </Grid>
       </Grid>

       
</MainCard>
  </>
   )}
   
<MainCard>
  
       {/*<Grid container spacing={2}>
<Grid item xs={6} sm={0.6}>
 <Stack sx={{ mt: 1 }} spacing={0}> 
   <InputLabel style={{ fontWeight: 'bold', marginBottom: 0 }}>Note:</InputLabel>
 </Stack>
</Grid>}
<Grid item xs={6} sm={2.8} mb={1}>
 <Stack spacing={0}> 
   <TextField InputProps={{ readOnly: true }} required fullWidth autoComplete="family-name" value={'शिरुर , 2, राम आळी, शिरुर'} />
 </Stack>
</Grid>
<Grid item xs={6} sm={0.6}>
 <Stack sx={{ mt: 1 }} spacing={0}>
   <InputLabel style={{ fontWeight: 'bold', marginBottom: 0 }}>Note:</InputLabel> 
 </Stack>
</Grid>
<Grid item xs={6} sm={7.8} mb={1}>
 <Stack spacing={0}>
   <TextField InputProps={{ readOnly: true }} required fullWidth autoComplete="family-name" value={'शिरुर , 2, राम आळी, शिरुर'} />
 </Stack>
</Grid>
</Grid>

<Grid item xs={12} mb={1}>
   <Typography variant="h7"   style={{ fontWeight: 'bold' }} > Note:</Typography>
 </Grid>

 */}
</MainCard>


{/* Cash details section */}
<Box mb={2}></Box>

{showCashDetails && (
<>
    <MainCard  style={{ backgroundColor: '#e3f2fd' }}>
    <Typography variant="h5" style={{ fontWeight: 'bold' }}>
      <span>Pay Property Tax</span>
    </Typography>
  </MainCard>
  <MainCard>
  <Grid  container
         spacing={2.2}
         style={{
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
           width: '100%',
           height: '100%'
         }}
       >
       <Grid item xs={12} md={10} lg={6}>
         <Box >
           <Box>
             <Grid container spacing={1} justifyContent="center">
               <Grid item xs={6} sm={2}>
                 <Stack sx={{ mt: 1 }} spacing={1}>
                 <InputLabel style={{ fontWeight: 'bold' }}>
     <span style={{ color: 'red' }}>*</span> Email Id:
   </InputLabel>                    </Stack>
               </Grid>
               <Grid item xs={6} sm={6.3} mb={1}>
                 <Stack spacing={1}>
                   <TextField  required fullWidth autoComplete="family-name"  value={selectedProperty?.EmailID ?? ""}
  onChange={(e) =>
    setSelectedProperty((prev) => ({
      ...prev,
      EmailID: e.target.value,
    }))
  } />
                 </Stack>
               </Grid>
             </Grid>
             <Grid container spacing={1} justifyContent="center">
               <Grid item xs={6} sm={2}>
                 <Stack sx={{ mt: 1 }} spacing={1}>
                 <InputLabel style={{ fontWeight: 'bold' }}>
     <span style={{ color: 'red' }}>*</span> Mobile No.:
   </InputLabel>                    </Stack>
               </Grid>
               <Grid item xs={6} sm={6.3} mb={1}>
                 <Stack spacing={1}>
                   <TextField   required fullWidth autoComplete="family-name"   value={selectedProperty?.MobileNo ?? ""}
  onChange={(e) =>
    setSelectedProperty((prev) => ({
      ...prev,
      MobileNo: e.target.value,
    }))
  } />
                 </Stack>
               </Grid>
             </Grid>
             <Grid container spacing={1} justifyContent="center">
               <Grid item xs={6} sm={2}>
                 <Stack sx={{ mt: 1 }} spacing={1}>
                 <InputLabel style={{ fontWeight: 'bold' }}>
     <span style={{ color: 'red' }}>*</span> Total Tax:
   </InputLabel>                    </Stack>
               </Grid>
               <Grid item xs={6} sm={6.3} mb={1}>
                 <Stack spacing={1}>
                   <TextField InputProps={{ readOnly: true }}  required fullWidth autoComplete="family-name" value={selectedTaxRow?.net ?? ''}  />
                 </Stack>
               </Grid>
             </Grid>
             <Grid container spacing={1} justifyContent="center">
             <Grid item xs={12} sm={8} >
               <Stack spacing={1} direction={'row'} alignItems="center" marginTop={1}>
               <FormControlLabel
           control={
             <Checkbox
               checked={payAccept}
               onChange={handlePayAccept} 
               onContextMenu={handlePayNowContextMenu}
             />
           }
           label={<Box fontWeight="bold">Accept term and condition</Box>}
         />
         <Button  onClick={handleOpenVDialog}>Click here to read</Button>
       </Stack>
               </Grid>
             </Grid>
             <Box marginTop={2} >
       <Grid container spacing={1} justifyContent="center">
      
         <Grid item xs={12} sm={4} >
           <Stack spacing={1} mb={2}>
           <Button variant="contained" color="primary" onClick={handlePayProperty} >
Pay Now                </Button> 
<Dialog open={openDialog} onClick={handleCloseDialog} fullWidth maxWidth="xs">
     <DialogContent>
       <Stack marginBottom={1}>
         <DialogContentText id="alert-dialog-description">Enter Amount</DialogContentText>
       </Stack>
       <TextField required fullWidth maxWidth="sm" ></TextField>
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
     

     {showAlert && (
<Grid container spacing={2} justifyContent="center" alignItems="center">
 <Grid item xs={12} sm={7} justifyContent="center">
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
               <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
               Checkbox confirms you've read and agreed to terms                  </Alert>
             </Snackbar>
 </Grid>
</Grid>
)}
           </Box>
         </Box>
       </Grid>
       </Grid>
  </MainCard></>
   )}
  
{/* <FooterOnline/> */}
<Dialog open={openReceiptDetails} onClose={handleReceiptDetails}>
     <Grid container>
       <Grid item xs={12} md={12} lg={12}>
       </Grid>
       <Grid item xs={12} md={12} lg={12}>
         <DialogActions style={{ justifyContent: 'flex-end' }}>
           <IconButton onClick={handleReceiptDetails} color="error">
             <CloseOutlined />
           </IconButton>
         </DialogActions>
       </Grid>
     </Grid>

     <DialogContent>
     <MainCard style={{ backgroundColor: '#e3f2fd'}}>
   <MainCard style={{ backgroundColor: '#e3f2fd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
<Typography variant="h3" style={{ fontWeight: 'bold' }}>
 Receipt
</Typography>
</MainCard>
<MainCard style={{ backgroundColor: 'black', color: 'white' }}>
<Grid container justifyContent="space-between" alignItems="center" >
       <Grid item>
         <Typography variant="h7" >
           CMC Terms and Conditions For Online - Page {currentPage} of {totalPages}
         </Typography>
       {/* </Grid> 

       <Grid container spacing={1} mt={1} justifyContent="flex-end"> */}
{/* Button with download icon */}
<IconButton sx={{ gap: '2vw', fontSize: '1.5rem', minWidth: '1rem', minHeight: '1rem' }}variant="contained" color="primary" onClick={downloadTermsAndConditions} size="large">
 <DownloadOutlined />
</IconButton>
<IconButton  sx={{ gap: '2vw', fontSize: '1.5rem', minWidth: '1.5rem', minHeight: '1.5rem' }} variant="contained" color="primary" size="large">
 <PrinterOutlined />
</IconButton>
<Button sx={{ gap: '2vw', fontSize: '1.5rem', minWidth: '1.5rem', minHeight: '1.5rem' }} onClick={increaseFontSize}>
+
</Button>
<Button sx={{ gap: '2vw', fontSize: '1.5rem', minWidth: '1.5rem', minHeight: '1.5rem' }} onClick={decreaseFontSize}>
-
</Button>

{/* Page navigation buttons */}
<Button  sx={{ gap: '2vw', fontSize: '1.1rem', minWidth: '1.5rem', minHeight: '1.5rem' }} onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
<Button  sx={{ gap: '2vw', fontSize: '1.1rem', minWidth: '1.5rem', minHeight: '1.5rem' }} onClick={nextPage} disabled={currentPage === totalPages} >Next</Button>
</Grid>

       
     </Grid>
     </MainCard>
     <Typography variant="body1" mt={2} style={{ fontSize: `${fontSize}px` }}>
       {currentPage === 1 && (
         <>
 <Typography variant="h5" style={{ fontWeight: 'bold' }}>Terms and Conditions For Online-Payments :</Typography>
           
           The Terms and Conditions contained herein shall apply to any person (“User”) using the services of
Chandrapur Municipal Corporation(CMC). for making payments through an online payment gateway service
(“Service ”) offered by CMC in association with concern Bank and Tech Process (“Payment Service
Providers ”) through CMC’s website i.e. http://www.chandrapurmc.org. Each User is therefore deemed to
have read and accepted these Terms and Conditions.      
      <br />
<Typography variant="h5" style={{ fontWeight: 'bold' }}>A. Privacy Policy :</Typography>
           
           CMC respects and protects the privacy of the individuals that access the information and use the
           services provided through them. Individually identifiable information about the User is not willfully
           disclosed to any third party without first receiving the User's permission, as covered in this Privacy
           Policy.              
             <br />
             This Privacy Policy describes CMC ’s treatment of personally identifiable information that CMC
           collects when the User is on the CMC ’s website. CMC does not collect any unique information
           about the User (such as User's name, email address, age, gender etc.) except when you specifically
           and knowingly provide such information on the Website. Like any business interested in offering the
           highest quality of service to clients, CMC may, from time to time, send email to the User and other
           communication to tell the User about the various services, features, functionality and content
           offered by CMC website or seek voluntary information from The User. 
                         <br />
          Please be aware, however, that CMC will release specific personal information about the User if
           required to do so in the following circumstances:
           <br /> a) in order to comply with any valid legal process such as a search warrant, statute, or court order, or
           available at time of opening the tender
           <br /> b) if any of User’s actions on our website violate the Terms of Service or any of our guidelines for
           specific services, or
           <br />   c) To protect or defend CMC ’s legal rights or property, the CMC ’s site, or the Users of the site or;
           <br /> d) To investigate, prevent, or take action regarding illegal activities, suspected fraud, situations
           involving potential threats to the security, integrity of CMC ’s website/offerings. 
           <br/>
           <Typography variant="h5" style={{ fontWeight: 'bold' }}>B. General Terms and Conditions For E-Payment:</Typography>
      1. Once a User has accepted these Terms and Conditions, he/ she may register on CMC’s site and
avail the Services. 
      <br/>
      2. CMC's rights, obligations, undertakings shall be subject to the laws in force in India, as well as any
directives/ procedures of Government of India, and nothing contained in these Terms and
Conditions shall be in derogation of CMC's right to comply with any law enforcement agencies
request or requirements relating to any User’s use of the website or information provided to or
gathered by CMC with respect to such use. Each User accepts and agrees that the provision of
details of his/ her use of the Website to regulators or police or to any other third party in order to
resolve disputes or complaints which relate to the Website shall be at the absolute discretion of
CMC. 
      <br/>
      3. If any part of these Terms and Conditions are determined to be invalid or unenforceable pursuant
to applicable law including, but not limited to, the warranty disclaimers and liability
limitations set forth herein, then the invalid or unenforceable provision will be deemed superseded
by a valid, enforceable provision that most closely matches the intent of the original provision and
the remainder of these Terms and Conditions shall continue in effect
      <br/>
      4. These Terms and Conditions constitute the entire agreement between the User and CMC. These
Terms and Conditions supersede all prior or contemporaneous communications and proposals,
whether electronic, oral, or written, between the User and CMC. A printed version of these Terms
and Conditions and of any notice given in electronic form shall be admissible in judicial or
administrative proceedings based upon or relating to these Terms and Conditions to the same extent
and subject to the same conditions as other business documents and records originally generated
and maintained in printed form. 
      <br/>
         </>
       )}
       {currentPage === 2 && (
         <>
5. The entries in the books of CMC and/or the Payment Service Providers kept in the ordinary course
of business of CMC and/or the Payment Service Providers with regard to transactions covered under
these Terms and Conditions and matters therein appearing shall be binding on the User and shall be
conclusive proof of the genuineness and accuracy of the transaction
<br/>
6. Refund For Charge Back Transaction : In the event there is any claim for/ of charge back by the
User for any reason whatsoever, such User shall immediately approach CMC with his/ her claim
details and claim refund from CMC alone. Such refund (if any) shall be effected only by CMC via
payment gateway or by means of a demand draft or such other means as CMC deems appropriate.
No claims for refund/ charge back shall be made by any User to the Payment Service Provider(s) and
in the event such claim is made it shall not be entertained.
<br/>
7. In these Terms and Conditions, the term “ Charge Back ” shall mean, approved and settled credit
card or net banking purchase transaction(s) which are at any time refused, debited or charged back
to merchant account (and shall also include similar debits to Payment Service Provider's accounts, if
any) by the acquiring bank or credit card company for any reason whatsoever, together with the
bank fees, penalties and other charges incidental thereto. 
<br/>
8. Refund for fraudulent/duplicate transaction(s): The User shall directly contact CMC for any
fraudulent transaction(s) on account of misuse of Card/ Bank details by a fraudulent individual/party
and such issues shall be suitably addressed by CMC alone in line with their policies and rules. 
<br/>
9. Server Slow Down/Session Timeout: In case the Website or Payment Service Provider’s webpage,
that is linked to the Website, is experiencing any server related issues like ‘slow down’ or ‘failure’ or
‘session timeout’, the User shall, before initiating the second payment,, check whether his/her Bank
Account has been debited or not and accordingly resort to one of the following options: 
<br/>
i. In case the Bank Account appears to be debited, ensure that he/ she does not make the payment
twice and immediately thereafter contact CMC via e-mail or any other mode of contact as provided
by CMC to confirm payment. 
<br/>
ii. In case the Bank Account is not debited, the User may initiate a fresh transaction to make
payment. 
<br/>
However, the User agrees that under no circumstances the Payment Gateway Service Provider shall
be held responsible for such fraudulent/duplicate transactions and hence no claims should be
<br/>
Provider(s) in this regard shall be entertained by the Payment Service 
<br/>
Provider(s). 
<Typography variant="h5" style={{ fontWeight: 'bold' }}>C. Limitation of Liability </Typography>

1. CMC has made this Service available to the User as a matter of convenience. CMC expressly
disclaims any claim or liability arising out of the provision of this Service. The User agrees and
acknowledges that he/ she shall be solely responsible for his/ her conduct and that CMC reserves
the right to terminate the rights to use of the Service immediately without giving any prior notice
thereof.
<br/>
2. CMC and/or the Payment Service Providers shall not be liable for any inaccuracy, error or delay in,
or omission of (a) any data, information or message, or (b) the transmission or delivery of any such
data, information or message; or (c) any loss or damage arising from or occasioned by any such
inaccuracy, error, delay or omission, non-performance or interruption in any such data, information
or message. Under no circumstances shall the CMC and/or the Payment Service Providers, its
employees, directors, and its third party agents involved in processing, delivering or managing the
Services, be liable for any direct, indirect, incidental, special or consequential damages, or any
damages whatsoever, including punitive or exemplary arising out of or in any way connected with
the provision of or any inadequacy or deficiency in the provision of the Services or resulting from
unauthorized access or alteration of transmissions of data or arising from suspension or termination
of the Services.
<br/>
3. CMC and the Payment Service Provider(s) assume no liability whatsoever for any monetary or 
        
         </>
       )}
       {currentPage === 3 && (
         <>
other damage suffered by the User on account of: 
<br/>
(I) the delay, failure, interruption, or corruption of any data or other information transmitted in
connection with use of the Payment Gateway or Services in connection thereto; and/ or (ii) any
interruption or errors in the operation of the Payment Gateway. 
<br/>
4. The User shall indemnify and hold harmless the Payment Service Provider(s) and CMC and their
respective officers, directors, agents, and employees, from any claim or demand, or actions arising
out of or in connection with the utilization of the Services.
<br/>
<Typography variant="h5" style={{ fontWeight: 'bold' }}>D. Miscellaneous Conditions: </Typography>
1. Any waiver of any rights available to CMC under these Terms and Conditions shall not mean that
those rights are automatically waived. 
<br/>
2. The User agrees, understands and confirms that his/ her personal data including without
limitation details relating to debit card/ credit card transmitted over the Internet may be susceptible
to misuse, hacking, theft and/ or fraud and that CMC or the Payment Service Provider(s) have no
control over such matters. 
<br/>
3. Although all reasonable care has been taken towards guarding against unauthorized use of any
information transmitted by the User, CMC does not represent or guarantee that the use of the
Services provided by/ through it will not result in theft and/or unauthorized use of data over the
Internet. 
<br/>
4. CMC, the Payment Service Provider(s) and its affiliates and associates shall not be liable, at any
time, for any failure of performance, error, omission, interruption, deletion, defect, delay in
operation or transmission, computer virus, communications line failure, theft or destruction or
unauthorized access to, alteration of, or use of information contained on the Website. 
<br/>
4. CMC, the Payment Service Provider(s) and its affiliates and associates shall not be liable, at any
time, for any failure of performance, error, omission, interruption, deletion, defect, delay in
operation or transmission, computer virus, communications line failure, theft or destruction or
unauthorized access to, alteration of, or use of information contained on the Website. 
<br/>
i. Choose a new password, whenever required for security reasons. ii. Keep his/ her User ID &
Password strictly confidential.iii. Be responsible for any transactions made by User under such User
ID and Password.
<br/>
The User is hereby informed that CMC will never ask the User for the User’s password in an
unsolicited phone call or in an unsolicited email. The User is hereby required to sign out of his/ her
CMC account on the Website and close the web browser window when the transaction(s) have been
completed. This is to ensure that others cannot access the User’s personal information and
correspondence when the User happens to share a computer with someone else or is using a
computer in a public place like a library or Internet café. 
<Typography variant="h5" style={{ fontWeight: 'bold' }}>E. Debit/Credit Card, Bank Account Details </Typography>
1. The User agrees that the debit/credit card details provided by him/ her for use of the aforesaid
Service(s) must be correct and accurate and that the User shall not use a debit/ credit card, that is
not lawfully owned by him/ her or the use of which is not authorized by the lawful owner thereof.
The User further agrees and undertakes to provide correct and valid debit/credit card details. 
<br/>
2. The User may make his/ her payment(Tender Fee/Earnest Money deposit) to CMC by using a
debit/credit card or through online banking account. The User warrants, agrees and confirms that
when he/ she initiates a payment transaction and/or issues an online payment instruction and
provides his/ her card / bank details:
<br/>
i. The User is fully and lawfully entitled to use such credit / debit card, bank account for such transactions; 
<br/>
ii. The User is responsible to ensure that the card/ bank account details provided by him/ her are
accurate; 
<br/>
iii. The User is authorizing debit of the nominated card/ bank account for the payment of Tender Fee
and Earnest Money Deposit.
<br/>

         </>
       )}
       {currentPage === 4 &&(
         <>
         iv. The User is responsible to ensure sufficient credit is available on the nominated card/ bank
account at the time of making the payment to permit the payment of the dues payable or the bill(s)
selected by the User inclusive of the applicable Fee. 
<br/>
F. Personal Information 
<br/>
1. The User agrees that, to the extent required or permitted by law, CMC and/ or the Payment
Service Provider(s) may also collect, use and disclose personal information in connection with
security related or law enforcement investigations or in the course of cooperating with authorities or
complying with legal requirements. 
<br/>
2. The User agrees that any communication sent by the User vide e-mail, shall imply release of
information therein/ therewith to CMC. The User agrees to be contacted via e-mail on such mails
initiated by him/ her. 
<br/>
3. In addition to the information already in the possession of CMC and/ or the Payment Service
Provider(s), CMC may have collected similar information from the User in the past. By entering the
Website the User consents to the terms of CMC’s information privacy policy and to our continued
use of previously collected information. By submitting the User’s personal information to us, the
User will be treated as having given his/her permission for the processing of the User’s personal data
as set out herein. 
<br/>
4. The User acknowledges and agrees that his/ her information will be managed in accordance with
the laws for the time in force.
<Typography variant="h5" style={{ fontWeight: 'bold' }}>G. Payment Gateway Disclaimer  </Typography>
The Service is provided in order to facilitate payment of CMC online. CMC or the Payment Service
Provider(s) do not make any representation of any kind, express or implied, as to the operation of
the Payment Gateway other than what is specified in the Website for this purpose. By accepting/
agreeing to these Terms and Conditions, the User expressly agrees that his/ her use of the aforesaid
online payment Service is entirely at own risk and responsibility of the User.
         </>
       )}

<Grid item xs={12} sm={12} >
       <Grid container spacing={2} mt={1} justifyContent="center">
         
         <Grid item xs={12} sm={2}>
           <Stack spacing={1}>
           <Button variant="contained" color="primary" onClick={handleReceiptDetails} >
           Close               </Button>
           </Stack>
         </Grid>
       </Grid>
</Grid>
     </Typography>
   </MainCard>
     </DialogContent>
   </Dialog>

 </>
)}

{showNote &&(

<>
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
</MainCard>  
</>
)}


{showReciept &&(
<MainCard>
  <Card sx={{ mt: 4, borderRadius: 1, border: "1px solid #ddd" }}>
      {/* Header */}
      <Box
        sx={{
          background: "#f6f6f6",
          borderBottom: "1px solid #ddd",
          p: 1.5,
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
          Downloads Receipt
        </Typography>
      </Box>

      <CardContent>
        {/* Dropdown row */}
        <Grid container alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={2}>
            <Typography sx={{ fontWeight: "500" }}>Request Type:</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <Select defaultValue="Receipt">
                <MenuItem value="Receipt">Receipt</MenuItem>
                <MenuItem value="Challan">Challan</MenuItem>
                <MenuItem value="Bill">Bill</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* TABLE */}
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Counter</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>2 Inch</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>3 Inch</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Bill Book No</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Invoice No</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Payment Mode</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Payee Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Bank</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Transaction Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Mobile</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>
                  <IconButton color="warning">
                    {/* <DownloadIcon /> */}
                  </IconButton>
                </TableCell>

                <TableCell>
                  <IconButton color="warning">
                    {/* <DownloadIcon /> */}
                  </IconButton>
                </TableCell>

                <TableCell>
                  <IconButton color="warning">
                    {/* <DownloadIcon/> */}
                  </IconButton>
                </TableCell>

            <TableCell>{receiptData.BillBookNo}</TableCell>
            <TableCell>{receiptData.InvoiceNo}</TableCell>
            <TableCell>{receiptData.Amount}</TableCell>
            <TableCell>{receiptData.PaymentMode}</TableCell>
            <TableCell>{receiptData.PayeeName}</TableCell>
            <TableCell>{receiptData.BankName}</TableCell>
            <TableCell>
              {new Date(receiptData.TransactionDate).toLocaleString()}
            </TableCell>
            <TableCell>{receiptData.EmailId}</TableCell>
            <TableCell>{receiptData.MobileNumber}</TableCell>
          
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
</MainCard>
)}

{paySuccess && (
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
value={onlineTxnId}
      InputProps={{ readOnly: true }}  />
  
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
      value={onlineAmount}
    InputProps={{ readOnly: true }}

          />
        </Grid>
      </Grid>
  
   <Grid container alignItems="center" spacing={1}>
        <Grid item xs={5}>
          <InputLabel sx={{ fontWeight: 'bold' }}>
          Get Payment Receipt:       </InputLabel>
        </Grid>
        <Grid item xs={7}>
        <Button variant="contained" color="primary" onClick={handleGetReceipt}>
              Get Receipt
            </Button>
        </Grid>
    </Grid>
  
          </Box>
  
          
        </Box>
        
        </MainCard>
)}
</>
  );
}

export default OnlinePayment;
