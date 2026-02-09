
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  InputLabel,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TableContainer,
  Radio,
  CircularProgress,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Autocomplete
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import jsPDF from "jspdf";

// project import
import MainCard from 'components/MainCard';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchOldPropertiesByWard, fetchOldWardNumbers, getBankList, getBillBookNos, getCurrentBalanceDetails, getCurrentPenalty, getDiscountPercentageService, getMinorInfoById, getNextInvoiceNo, getOfflineReceipt, getOrderedTaxAliases, getPaymentModes, getPendingBalanceDetails, getPendingPenalty, postWardSelectionService, processPaymentService, searchPropertyOfflinePayment, updateMinorInfo } from 'services/paymentServices/offlinePaymentService/offlinePaymentService';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchWardNo, postWardSelection } from 'services/wardnumber.services';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
//import DownloadIcon from "@mui/icons-material/Download";
// ==============================|| OfflinePayment PAGE ||============================== //

function OfflinePayment() {
  const [getProperty, setGetProperty] = useState(true);
  const [open, setOpen] = useState(false);
  const [openMinor, setOpenMinor] = useState(false);
  const handleOpenMinor = () => setOpenMinor(true);
  const handleCloseMinor = () => setOpenMinor(false);
const [propertyData, setPropertyData] = useState(null);

const MINOR_INITIAL_STATE = {
  Address: "",
  OwnerPatta: "",
  BuildingOrShopName: "",
  BuildingOrShopNameMarathi: "",
  BuildingOrFlatNo: "",
  MobileNo: 0,
  RToilet:0,
  CToilet: 0,
  OldPropertyNo:0,
  NewPlotNo: "",
  NewCityServeyNo: "",
  LoanRemark: "",
  FileNo: "",
  OpenPlotLength: 0,
  OpenPlotWidth: 0,
  OpenPlotRenterName: ""
};

const [minorInfo, setMinorInfo] = useState(MINOR_INITIAL_STATE);

const [currentBalance, setCurrentBalance] = useState([]);
const [pendingBalance, setPendingBalance] = useState([]);

// const [selected, setSelected] = useState(false);
// const [selectedOwnerID,setSelectedOwnerID]=useState('');
 const [mode, setMode] = useState("SEARCH"); 
const [loading, setLoading] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);
const [taxHeaders, setTaxHeaders] = useState([]);
const currentYear = "2022";

// const currentYear=new Date().getFullYear();
const previousYear = String(Number(currentYear) - 1);
const [pendingSelected, setPendingSelected] = useState(false);
const [currentSelected, setCurrentSelected] = useState(false);
const [totalSelected, setTotalSelected] = useState(false);
const[showReciept,setShowReciept]=useState(false);
const[paySuccess,setPaySuccess]=useState(false);


const[showTaxDistr,setShowTaxDistr]=useState(false)

const [showTable, setShowTable] = useState(false);
const [showPropertySearch, setShowPropertySearch] = useState(true);
  const[showPayPanel,setShowPayPanel]=useState(false);

const[showCheckDDTransDate,setShowCheckDDTransDate]=useState(false);
const[showCheckDDTransNo,setShowCheckDDTransNo]=useState(false);
const[showBank,setShowBank]=useState(false)
const[showDDandCheckDate,setShowDDandCheckDate]=useState(false)
const[showReferalID,setShowRefralID]=useState(false);
const[showTransID,setShowTransID]=useState(false);

const [formData, setFormData] = useState({
  propertyIndexNo: '',
  wardNo: '',
  propertyNo: '',
  oldWardNo: '',
  partitionNo:'',
  oldPartitionNo:'',
  oldPropertyNo: '',
  primaryOwnerEng: '',
  primaryOwnerMar: '',
  occupierEng: '',
  occupierMar: '',
  computerNo: '',
  mobileNo: '',
});

const [values, setValues] = useState({
  email: '',
  mobile: '',
  billBook: '00',
  invoiceNo: '',
  paymentMode: '',
  bank: '',
  chequeNo: '',
  TransactionId:'',
  chequeDate: '',
  totalPayTax: '',   
  noticeFee:'',
  extraAmount: '',  
  behalfPayer: '',
  RelID:''
});
const taxKeys = [
    "PropertyTax", "TreeCess", "EducationTax", "EmploymentTax",
    "RoadCess", "FireCess", "SpWaterCess", "WaterTax",
    "Sanitation", "DrainCess", "LightCess",
    "WaterBenefit", "SewageDisposalCess",
    "MajorBuilding"
  ];
const handleClear = () => {
  setValues({
    email: '',
    mobile: '',
    billBook: '',
    invoiceNo: '',
    paymentMode: '',
    bank: '',
    chequeNo: '',
    chequeDate: '',
    totalPayTax: '',
    noticeFee: '',
    extraAmount: '',
    behalfPayer: '',
  });

  // Hide conditional UI sections
  // setShowTransID(false);
  // //setShowReferalID(false);
  // setShowBank(false);
  // setShowDDandCheckDate(false);
  // setShowCheckDDTransNo(false);
  // setShowCheckDDTransDate(false);

  // Reset Pay Panel & checkboxes
  setShowPayPanel(false);
  setPendingSelected(false);
  setCurrentSelected(false);
  setTotalSelected(false);

  // Reset selected mode tracking if you have it
  setSelectedType(null);
  setMode('');
};




const[openPendingTaxDialog,setOpenPendingTaxDialog]=useState(false)

   
const [showDistributionTable, setShowDistributionTable] = useState(false); 
const[selectedType,setSelectedType]=useState(null);
  const [paymentModes, setPaymentModes] = useState([]);
  const [banks, setBanks] = useState([]);
  const[propertyNoList,setPropertyNoList]=useState([])
  const[oldPropertyNoList,setOldPropertyNoList]=useState([])
  const[wardList,setWardList]=useState([]);
  const[oldWardList,setOldWardList]=useState([]);
  const[selectedWard,setSelectedWard]=useState('');
   const[selectedOldWard,setSelectedOldWard]=useState('');
  const[selectedPropertyNo,setSeletedPropertyNo]=useState('');
  const[selectedOldPropertyNo,setSeletedOldPropertyNo]=useState('');
const [selectedPropertyOwnerID, setSelectedPropertyOwnerID] = useState(null);
const [selectedOldPropertyOwnerID, setSelectedOldPropertyOwnerID] = useState(null);

useEffect(() => {
  if (selectedOldPropertyOwnerID !== null) {
    console.log("Selected OLD OwnerID:", selectedOldPropertyOwnerID);
  }
}, [selectedOldPropertyOwnerID]);



useEffect(() => {
  if (selectedPropertyOwnerID !== null) {
    console.log("Selected NEW OwnerID:", selectedPropertyOwnerID);
  }
}, [selectedPropertyOwnerID]);


   // Fetch Payment Modes
  useEffect(() => {
    const fetchPaymentModes = async () => {
      const modes = await getPaymentModes();
      setPaymentModes(modes);
    };
    fetchPaymentModes();
  }, []);

  // Fetch Banks
  useEffect(() => {
    const fetchBanks = async () => {
      const res = await getBankList();
      console.log(res.banks,"bbnkk")
      setBanks(res.banks);
    };
    fetchBanks();
  }, []);

   useEffect(() => {
      const loadWardNos = async () => {
        try {
          const wardNo = await fetchWardNo();
          const sortedWard = [...wardNo].sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo));
          setWardList(sortedWard);
          setOldWardList(sortedWard);
        } catch (error) {
          console.error('Error fetching ward Number', error);
        }
      };
      loadWardNos();
    }, []);
  

     useEffect(() => {
      const loadoldWardNos = async () => {
        try {
          const res = await fetchOldWardNumbers();
          const ward=res.wards;
          const sortedWard = [...ward].sort((a, b) => Number(a.OldWardNo) - Number(b.OldWardNo));
          setOldWardList(sortedWard);
        } catch (error) {
          console.error('Error fetching old ward Numbers', error);
        }
      };
      loadoldWardNos();
    }, []);
    
    const handleWardChange = async (event) => {
      const selectedWard = Number(event.target.value);
      setSelectedWard(selectedWard);
  // const value = Number(event.target.value);
      // 🔹 update formData.wardNo
  setFormData(prev => ({
    ...prev,
    wardNo: selectedWard,
     oldWardNo: '',          
    oldPropertyNo: '',
    oldPartitionNo: '',
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


    
   const handleOldWardChange = async (event) => {
  const selectedWard = Number(event.target.value);

  console.log("old ward", selectedWard);
  setSelectedOldWard(selectedWard);

  // reset dependent fields
  setFormData(prev => ({
    ...prev,
    oldWardNo: selectedWard,
    wardNo: '',       // reset NEW
    propertyNo: '',
    partitionNo: '',
  }));

  try {
    const response = await fetchOldPropertiesByWard({ wardNo: selectedWard });
    const propertyRange = response.properties;

    if (!Array.isArray(propertyRange)) {
      throw new Error("Invalid property old range");
    }

    // ✅ REMOVE DUPLICATES
    const uniquePropsMap = new Map();

    propertyRange.forEach(item => {
      const key = `${item.OwnerID}-${item.OldPropertyNo}-${item.OldPartitionNo || ''}`;
      if (!uniquePropsMap.has(key)) {
        uniquePropsMap.set(key, item);
      }
    });

    const uniqueProps = Array.from(uniquePropsMap.values());

    // ✅ SORT: PropertyNo first, then PartitionNo
    const sortedProps = uniqueProps.sort((a, b) => {
      const propA = parseInt(a.OldPropertyNo, 10) || 0;
      const propB = parseInt(b.OldPropertyNo, 10) || 0;

      if (propA !== propB) return propA - propB;

      const partA = parseInt(a.OldPartitionNo, 10) || 0;
      const partB = parseInt(b.OldPartitionNo, 10) || 0;

      return partA - partB;
    });

    setOldPropertyNoList(sortedProps);
  } catch (error) {
    console.error('Error fetching property range:', error);
  }
};

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
  doc.text(`${merchantTxnRefNumber || "DUMMY_TXN_001"}`, 80, 45);

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
  doc.save(`Receipt_${merchantTxnRefNumber || "DUMMY"}.pdf`);
};
 






// editing / distribution
const [distributionValues, setDistributionValues] = useState({});
// अंशत भरावयाची रक्कम user enters 
const [partialAmount, setPartialAmount] = useState(0); 

// useEffect(() => {
//   const fetchMinorInfo = async () => {
//     if (selectedRow?.OwnerID) {
//       const selectedOwnerDetails = await handleMinorInfo(selectedRow.OwnerID);
//       console.log(selectedOwnerDetails, "minor info");
//     }
//   };

//   fetchMinorInfo();
// }, [selectedRow?.OwnerID]);


useEffect(() => {
  const fetchMinorInfo = async () => {
    if (!selectedRow?.OwnerID) return;

    const res = await getMinorInfoById({ ownerId: selectedRow.OwnerID });
    const apiData = res?.data;
    if (!apiData) return;

    setMinorInfo({
      ...MINOR_INITIAL_STATE,
      ...apiData  
    });
  };

  fetchMinorInfo();
}, [selectedRow?.OwnerID]);


useEffect(() => {
  console.log(mode, "greatttt");
  console.log(selectedRow?.OwnerID, "id");

  if (mode !== "DETAILS") return;
  if (!selectedRow?.OwnerID) return;

  const fetchAllData = async () => {
    try {
      const OwnerID = selectedRow.OwnerID;

      // --------------------------
      // 1️⃣ PENDING BALANCE
      // --------------------------
      const pending = await getPendingBalanceDetails({
        OwnerID,
        p_Year: currentYear,
      });
      console.log(pending, "pen data");

      // --------------------------
      // 2️⃣ CURRENT BALANCE
      // --------------------------
      const current = await getCurrentBalanceDetails({
        OwnerID,
        p_Year: currentYear,
      });
      console.log(current, "curr data");

      setPendingBalance(safeObject(pending[0] || {}));
      setCurrentBalance(safeObject(current[0] || {}));

      // --------------------------
      // 3️⃣ PENALTY (Current & Pending)
      // --------------------------
      const payload = { OwnerID, Year: currentYear };

      // const currentPenalty = await getCurrentPenalty(payload);
      // const pendingPenalty = await getPendingPenalty(payload);


      const currentPenalty = 0;
      const pendingPenalty = 0;
      console.log(currentPenalty, pendingPenalty, "penalties both");

      // --------------------------
      // 4️⃣ DISCOUNT PERCENTAGE
      // --------------------------
      const discountReqBody = {
        OwnerID,
        DiscountFinanceYear: currentYear,
        DiscountPendingYear: currentYear,
        PaymentType: "CURRENT",          
        PaymentMode: "OFFLINE"         
      };

      const discountRes = await getDiscountPercentageService(discountReqBody);
      console.log("DISCOUNT RESULT →", discountRes);
     

if (discountRes?.success) {
  setDiscountInfo({
    percentage: Number(discountRes.discountPercentage ?? 0),
    taxName: discountRes.taxName 
  });
}

    } catch (err) {
      console.error(err);
    }
  };

  fetchAllData();
}, [mode, selectedRow?.OwnerID]);

const [discountInfo, setDiscountInfo] = useState({
  percentage: 0,
  taxName: null
});
 

// const calculateTotals = (balance, discountInfo) => {
//   const taxTotal = Number(balance?.TaxTotal ?? 0);
//   const interest = Number(balance?.Interest ?? 0);

//   const gross = taxTotal + interest;

//   let discount = 0;
//   console.log(discountInfo?.percentage,"percentage discount")
//   if (discountInfo?.percentage && discountInfo?.taxName) {
//     const taxValue = Number(balance?.[discountInfo.taxName] ?? 0);
//     discount = +(taxValue * discountInfo.percentage / 100).toFixed(2);
//   }

//   const net = gross - discount;

//   return { gross, discount, net };
// };


const [isPartialPayment, setIsPartialPayment] = useState(false);

// const calculateTotals = (balance, discountInfo) => {
//   const taxTotal = Number(balance?.TaxTotal ?? 0);
//   const interest = Number(balance?.Interest ?? 0);

//   const gross = taxTotal + interest;

//   let discount = 0;
//   if (discountInfo?.percentage && discountInfo?.taxName) {
//     const taxValue = Number(balance?.[discountInfo.taxName] ?? 0);
//     discount = Math.round(taxValue * discountInfo.percentage / 100);
//   }

//   const net = Math.round(gross - discount);

//   return { gross, discount, net };
// };

const calculateTotals = (balance, discountInfo, isPartialPayment) => {
  const taxTotal = Number(balance?.TaxTotal ?? 0);
  const interest = Number(balance?.Interest ?? 0);

  const gross = taxTotal + interest;

  let discount = 0;

  // 🔥 BLOCK DISCOUNT FOR PARTIAL PAYMENT
  if (
    !isPartialPayment &&
    discountInfo?.percentage &&
    discountInfo?.taxName
  ) {
    const taxValue = Number(balance?.[discountInfo.taxName] ?? 0);
    discount = Math.round(taxValue * discountInfo.percentage / 100);
  }

  const net = gross - discount;

  return { gross, discount, net };
};


const renderDiscountNote = (balanceYear, balance) => {
  if (!discountInfo?.percentage || !discountInfo?.taxName) return null;

  const taxValue = Number(balance?.[discountInfo.taxName] ?? 0);
  const discountAmount = Math.round(taxValue * discountInfo.percentage / 100);

  return `NOTE: For year ${balanceYear}, Discount amount ${discountAmount}Rs. has been calculated on ${discountInfo.taxName} ${taxValue} with ${discountInfo.percentage}% of discount.`;
};


// const pendingTotals = calculateTotals(pendingBalance, discountInfo);
// const currentTotals = calculateTotals(currentBalance, discountInfo);

// const totalTotals = {
//   gross: pendingTotals.gross + currentTotals.gross,
//   discount: pendingTotals.discount + currentTotals.discount,
//   net:
//     (pendingTotals.gross + currentTotals.gross) -
//     (pendingTotals.discount + currentTotals.discount)
// };

const pendingTotals = calculateTotals(
  pendingBalance,
  discountInfo,
  isPartialPayment
);

const currentTotals = calculateTotals(
  currentBalance,
  discountInfo,
  isPartialPayment
);

const totalTotals = {
  gross: pendingTotals.gross + currentTotals.gross,
  discount: pendingTotals.discount + currentTotals.discount,
  net:
    (pendingTotals.gross + currentTotals.gross) -
    (pendingTotals.discount + currentTotals.discount)
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

const handleChange = (e) => {
  if (!e || !e.target) {
    console.warn("Invalid event passed to handleChange:", e);
    return;
  }

  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handlePaymentChange = (field) => async (event) => {
  try {
    const value = event.target.value;

    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "billBook") {
      const selectedObj = billBookNos.find(
        (item) => item.BillBookNo === value
      );

      if (!selectedObj) return;

      const apiRes = await getNextInvoiceNo({
        userID: userData.UserID,
        year: currentYear,
        status: selectedObj.Status ? 1 : 0,
      });

      console.log("Invoice API Response:", apiRes);

      const spRes = apiRes?.[0];

      if (spRes && spRes.ErrorCode === 0) {
        setValues((prev) => ({
          ...prev,
          invoiceNo: spRes.InvoiceNo,
        }));
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Invoice generation failed",
        });
      }
    }

    if (field === "paymentMode") {
      // Reset all first
      setShowTransID(false);
      setShowRefralID(false);
      setShowBank(false);
      setShowDDandCheckDate(false);
      setShowCheckDDTransNo(false);
      setShowCheckDDTransDate(false);

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
        case "UPI PAYMENT":
          setShowTransID(true)
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

const computeRowTaxTotal = (row) => {
  if (!row) return 0;

  return taxHeaders.reduce((sum, header) => {
    const v = Number(row[header.key] || 0);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);
};

const computeRowNetTotal = (row = {}) => {
  const taxTotal = computeRowTaxTotal(row);
  const interest = Number(row.Interest ?? 0);
  return taxTotal + (isNaN(interest) ? 0 : interest);
};

const columns = [
  {
    field: "select",
    headerName: "Select",
    width: 90,
    renderCell: (params) => (
      <input
        type="radio"
        name="rowSelect"
        checked={selectedRow?.OwnerID === params.row.OwnerID} 
     onRowClick={(params) => {
  console.log("Row selected:", params.row);  
  setSelectedRow(params.row);
  setMode("DETAILS");
  setShowTable(false);    
}}
      />
    ),
  },
  { field: "NewWardNo", headerName: "Ward No", flex: 1 },
  { field: "NewPropertyNo", headerName: "Property No", flex: 1 },
  { field: "NewPartitionNo", headerName: "Partition No", flex: 1 },
  { field: "OwnerName", headerName: "Owner Name", flex: 1.5 },
  { field: "OccupierName", headerName: "Occupier Name", flex: 1.5 },
  { field: "renterName", headerName: "Renter Name", flex: 1.5 },
];


// Add unique id for each row (DataGrid requires 'id')
const rows = (propertyData || []).map((row, idx) => ({
  id: idx + 1,
  ...row,
}));

//owner name
const [showPropertyGrid, setShowPropertyGrid] = useState(false);
const [selectedOwnerRow, setSelectedOwnerRow] = useState(null);


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
          setMode("DETAILS");
          setShowPropertyGrid(false);
          setShowTaxDistr(true);
          setShowDebt(true);
        }}
      />
    ),
  },
  { field: "NewWardNo", headerName: "Ward No", flex: 1 },
  { field: "NewPropertyNo", headerName: "Property No", flex: 1 },
  { field: "NewPartitionNo", headerName: "Partition No", flex: 1 },
  { field: "OwnerName", headerName: "Owner Name", flex: 1.5 },
  { field: "OccupierName", headerName: "Occupier Name", flex: 1.5 },
  { field: "renterName", headerName: "Renter Name", flex: 1.5 },
];

const rowsOwners = (propertyData || []).map((row, index) => ({
  id: row.OwnerID ?? index + 1,   // ✅ unique id (best)
  ...row,
}));


const handleGetProperty = async () => {
  setMode("SEARCH");
  setLoading(true);
  try {
    const {
      wardNo,
      computerNo,
      propertyNo,
      mobileNo,
      oldPropertyNo,
      primaryOwnerEng,
      primaryOwnerMar,
      occupierEng,
      occupierMar
    } = formData;


    

  


  // 🔹 CASE 1: Only Ward No entered → Call Ward Selection API
    if (wardNo && !propertyNo && !mobileNo  && !oldPropertyNo &&
        !primaryOwnerEng && !primaryOwnerMar && !occupierEng && !occupierMar) {

    const result = await postWardSelectionService(formData.wardNo);
    console.log("Ward properties:", result);
      setPropertyData(result.properties);
      // 👈 SHOW TABLE ONLY WHEN DATA EXISTS
  setShowTable(true);
      return;
    }

//dat based on old property no 
if (selectedPropertyOwnerID || selectedOldPropertyOwnerID) {
  const ownerID = selectedPropertyOwnerID || selectedOldPropertyOwnerID;

  const res = await searchPropertyOfflinePayment({ OwnerID: ownerID });
  console.log(res, "matched property data");

  setMinorInfo(res.data);
  setSelectedRow(res.data);
  setMode("DETAILS");
  setShowTable(false);
  setShowTaxDistr(false);

  // 🔥 NOW CHECK IF RECEIPT EXISTS
  try {
    const receiptRes = await getOfflineReceipt(res.data.OwnerID);

    if (receiptRes?.found) {
  setHasReceipt(true);
  setReceiptData(receiptRes.data);
  setShowReciept(true);
  setShowDebt(true);
  showTaxDistr(false);
  showDebt(false);
}

  } catch (error) {
    console.error("Receipt check failed:", error);
    setHasReceipt(false);
    setShowDebt(true);      
  }

  return;



}

    // 🔹 CASE 3: Mobile No → Fetch Multiple Properties
    if (mobileNo) {
      const res = await searchPropertyOfflinePayment({ mobileNo });


      setSelectedRow(res.data);
      //setMode("DETAILS");
      setPropertyData(res.data);
      setShowPropertyGrid(true);
      setShowDebt(true);
      return;
    }

    // 🔹 CASE 4: computerNo
    if (computerNo) {
       const res = await searchPropertyOfflinePayment({ computerNo });
      setPropertyData(res.data);
       setShowPropertyGrid(true);
        setShowDebt(true);
      return;
    }

    

    // 🔹 CASE 6: Name search (English / Marathi)
    if (primaryOwnerEng || primaryOwnerMar || occupierEng || occupierMar) {
      const res = await searchPropertyOfflinePayment({
        primaryOwnerEng,
        primaryOwnerMar,
        occupierEng,
        occupierMar
      });
      setPropertyData(res.data);
      setShowPropertyGrid(true);
      setShowDebt(true);
      return;
    }

    //alert("Please enter any search criteria");

} catch (err) {
    console.error(err);
    alert("Error fetching data");
  } finally {
    setLoading(false);   // 🔥 hide loader
  }
};





const handleMinorChange = (e) => {
  const { name, value } = e.target;
  setMinorInfo((prev) => ({
    ...prev,
    [name]: value
  }));
};



// helper to update values
const setValue = (field, val) => setValues(s => ({ ...s, [field]: val }));


// mode: 'PENDING'|'CURRENT'|'TOTAL'
// This computes totalPayTax and prepares calculated distribution preview in UI (optional)
// const handleSelectPaymentMode = (mode) => {
//   // get numeric totals
//   const pendingTaxTotal = Number(pendingBalance?.TaxTotal ?? 0);
//   const currentTaxTotal = Number(currentBalance?.TaxTotal ?? 0);

//   let amountToPay = 0;
//   if (mode === 'PENDING') {
//     amountToPay = pendingTaxTotal;
//   } else if (mode === 'CURRENT') {
//     amountToPay = currentTaxTotal;
//   }else if (mode === 'TOTAL') {
//   amountToPay = Number(totalTotals.net ?? 0); // ✅ 3769
// }

//   setValue('totalPayTax', amountToPay);
//   // also set partialAmount/extraAmount if you want them visible; we only store final in totalPayTax
//   // open pay panel
//   setShowPayPanel(true);
// };
const handleSelectPaymentMode = (mode) => {
  let amountToPay = 0;

  if (mode === 'PENDING') {
    amountToPay = Number(pendingTotals.net ?? 0);
  }

  else if (mode === 'CURRENT') {
    amountToPay = Number(currentTotals.net ?? 0);
  }

  else if (mode === 'TOTAL') {
    amountToPay = Number(totalTotals.net ?? 0); // 🔥 FIX
  }

  setValue('totalPayTax', amountToPay);
  setShowPayPanel(true);
};



const distributeCorrectly = (enteredAmount) => {
  const baseRow = baseDistributionRef.current;
  if (!baseRow || !enteredAmount) return {};

  // 1️⃣ Calculate total tax
  const taxTotal = taxKeys.reduce(
    (sum, key) => sum + Number(baseRow[key] ?? 0),
    0
  );

  if (taxTotal === 0) return {};

  const distributed = {};
  let sum = 0;

  // 2️⃣ Proportional distribution (ROUND FIGURE)
  taxKeys.forEach((key) => {
    const baseValue = Number(baseRow[key] ?? 0);

    if (baseValue === 0) {
      distributed[key] = 0;
      return;
    }

    const value = Math.round(
      enteredAmount * (baseValue / taxTotal)
    );

    distributed[key] = value;
    sum += value;
  });

  // 3️⃣ Rounding correction (₹ adjust)
  let diff = enteredAmount - sum;

  if (diff !== 0) {
    const firstNonZeroKey = taxKeys.find(
      (k) => distributed[k] > 0
    );
    if (firstNonZeroKey) {
      distributed[firstNonZeroKey] += diff;
    }
  }

  // 4️⃣ Interest remains unchanged
  distributed.Interest = Math.round(
    Number(baseRow.Interest ?? 0)
  );

  return distributed;
};

const onOpenDistribution = () => {
  // --- 1️⃣ Find original gross tax total ---
  const originalTaxTotal =
    selectedType === "PENDING"
      ? Number(pendingBalance?.TaxTotal ?? 0)
      : selectedType === "CURRENT"
      ? Number(currentBalance?.TaxTotal ?? 0)
      : Number(pendingBalance?.TaxTotal ?? 0) +
        Number(currentBalance?.TaxTotal ?? 0);

console.log("selectedType =", selectedType);
console.log("partialAmount =", partialAmount);
console.log("baseDistributionRef =", baseDistributionRef.current);


  // --- 2️⃣ Minimum validation (50%) ---
  const minimumAllowed = originalTaxTotal * 0.5;

  if (partialAmount < minimumAllowed) {
    setSnackbar({
      open: true,
      severity: "error",
      message: `You must pay at least ₹${minimumAllowed}.`,
    });
    return;
  }

  // --- 3️⃣ DISTRIBUTE instead of copying ---
  let distributedRow = {};

  if (selectedType === "CURRENT") {
    distributedRow = distributeCorrectly(Number(partialAmount));
  }

  if (selectedType === "PENDING") {
    distributedRow = distributeCorrectly(Number(partialAmount));
  }

  if (selectedType === "TOTAL") {
    distributedRow = distributeCorrectly(Number(partialAmount));
    distributedRow.FinanceYear = "Total";
  }

  // --- 4️⃣ Set distributed values ---
  setDistributionValues(distributedRow);

  // --- 5️⃣ Show distribution table ---
  setShowDistributionTable(true);
};

const onPayPending = () => {
  setSelectedType("PENDING");
setIsPartialPayment(true);   
  // ✅ Set payable amount (NET or TAX total as per your rule)
  setPartialAmount(pendingTotals.net);   // ✅ SAME LOGIC AS CURRENT

  // ✅ Build base distribution row (ONLY TAX KEYS)
  const baseRow = {};
  taxKeys.forEach((key) => {
    baseRow[key] = Number(pendingBalance?.[key] ?? 0);
  });

  // ✅ Interest stays separate
  baseRow.Interest = Number(pendingBalance?.Interest ?? 0);

  // 🔐 CRITICAL: store original base
  baseDistributionRef.current = baseRow;

  // ✅ Show in UI
  setDistributionValues(baseRow);
  //setShowTaxDistr(true);
  setShowDistributionTable(false);
};

const onPayTotal = () => {
  setSelectedType("TOTAL");
  setIsPartialPayment(true);

  // ✅ TOTAL PAYABLE = NET TOTAL
  setPartialAmount(totalTotals.net); // 🔥 3769

  // ✅ Build combined distribution
  const baseRow = {};

  taxKeys.forEach((key) => {
    baseRow[key] =
      Number(pendingBalance?.[key] ?? 0) +
      Number(currentBalance?.[key] ?? 0);
  });

  // Interest separate
  baseRow.Interest =
    Number(pendingBalance?.Interest ?? 0) +
    Number(currentBalance?.Interest ?? 0);

  // 🔐 Store original
  baseDistributionRef.current = { ...baseRow };

  // ✅ Show in UI
  setDistributionValues(baseRow);
  setShowTaxDistr(true);
  setShowDistributionTable(false);

   setValues(prev => ({
    ...prev,
    totalPayTax: totalTotals.net
  }));
};

const [originalNetTotal, setOriginalNetTotal] = useState(0);

const handlePartialAmountInput = (e) => {
  const value = e.target.value;

  // Allow empty string
  if (value === "") {
    setPartialAmount("");
    return;
  }

  // Allow valid decimal (regex)
  if (/^\d*\.?\d*$/.test(value)) {
    setPartialAmount(value);
  }
};
const [merchantTxnRefNumber, setMerchantTxnRefNumber] = useState('');
const [paidAmount, setPaidAmount] = useState("");

// Pay Now click => call API to process payment
const handlePayNow = async () => {
    try {
    let PendingYear = Number(currentYear) - 1;
    let FinanceYear = currentYear; 

    // ✔ CASE 1: Pending selected
    if (pendingSelected && !currentSelected && !totalSelected) {
      PendingYear = PendingYear;
    }

    // ✔ CASE 2: Current selected
    if (currentSelected && !pendingSelected && !totalSelected) {
      PendingYear = FinanceYear
    }

    // ✔ CASE 3: Total selected
    if (totalSelected) {
      PendingYear = FinanceYear;
    }
    const payload = {
      OwnerID: selectedRow.OwnerID||selectedPropertyOwnerID,
      WardNo:selectedWard,
      PropertyNo: selectedRow?.PropertyNo || null,
      PartitionNo: selectedRow?.PartitionNo || null,
      FinanceYear: Number(FinanceYear),
      PendingYear: Number(PendingYear),
      paymentMode: values.paymentMode,
      billBookNo: values.billBook,
      invoiceNo: values.invoiceNo,
      email: values.email,
      mobile: values.mobile,
      totalPaid: Number(values.totalPayTax || 0),
      partialAmount: Number(values.partialAmount || 0),
      extraAmount: Number(values.extraAmount || 0),
      pendingBalanceObj: pendingBalance,
      currentBalanceObj: currentBalance,
      paymentDetails: {
        chequeNo: values.chequeNo,
        chequeDate: values.chequeDate,
        behalfPayer: values.behalfPayer,
        TransactionId:values.TransactionId,
        RelID:values.RelID,
        bank: values.bank
      }
    };
    console.log(payload,"data to be send to save in bill transaction details page.")

    const response = await processPaymentService(payload);

    console.log(response,"payment successful offline data")

    
    //handleClear();
    const merchantId = response?.data?.MerchantTxnRefNumber;
    const amountPaid =
  response?.data?.Amount ??
  response?.data?.NetTotal;

   setPaidAmount(amountPaid);


    console.log(merchantId,"merchntiddd")
    if (merchantId) {
      setMerchantTxnRefNumber(merchantId);
    }

    // // handle success UI
    // if (response?.data) {
    //   setOpenDialog(false);
    //   setPaymentSuccess(true);
    // }

    // success: data will include created billtransactiondetails row and updated remaining amounts
    setSnackbar({ open: true, message: 'Payment successful'|| response.message, severity: 'success' });
    setPaySuccess(true);
    setShowDebt(false);
    setShowDebt(false);
    // update UI with returned updated pending/current values
    // if (data.updatedBalances) {
    //   setPendingBalance(data.updatedBalances.pending || {});
    //   setCurrentBalance(data.updatedBalances.current || {});
    // }

    // optionally refresh property info or receipts
  } catch (err) {
    console.error(err);
    setSnackbar({ open: true, message: err.message || 'Payment failed', severity: 'error' });
  }
};

  
  const handlePayChange = (field) => (evt) => {
    setShowPayPanel(true);
    setValues((s) => ({ ...s, [field]: evt.target.value }));
  };

// const hasPending = pendingBalance && Object.values(pendingBalance).some(v => Number(v) > 0);
// const hasCurrent = currentBalance && Object.values(currentBalance).some(v => Number(v) > 0);
// const hasTotal = hasPending || hasCurrent;
const hasPending =
  Number(pendingBalance?.TaxTotal ?? 0) > 0 ||
  Number(pendingBalance?.NetTotal ?? 0) > 0;

const hasCurrent =
  Number(currentBalance?.TaxTotal ?? 0) > 0 ||
  Number(currentBalance?.NetTotal ?? 0) > 0;

const hasTotal = hasPending || hasCurrent;


const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "info",
});



const handleClosePendingDialoge=()=>{
  setOpenPendingTaxDialog(false);
}




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


const safeObject = (obj = {}) => {
  const result = {};
  for (const key in obj) {
    const val = obj[key];
    result[key] = val == null || val < 0 ? 0 : val;
  }
  return result;
};

const [hasReceipt, setHasReceipt] = useState(false);
const [receiptData, setReceiptData] = useState(null);
const[showDebt,setShowDebt]=useState(false);


useEffect(() => {
  if (!selectedRow?.OwnerID) return;

  const checkReceipt = async () => {
    try {
      const res = await getOfflineReceipt(selectedRow.OwnerID);

      console.log(res,"get receipt")

      if (res.found) {
        setHasReceipt(true);
        setReceiptData(res.data);
        setShowDebt(false);
      } else {
        setHasReceipt(false);
        setReceiptData(null);
         setShowDebt(true);     
      }
    } catch (error) {
      console.error("Receipt check error:", error);
    }
  };

  checkReceipt();
}, [selectedRow?.OwnerID]);


const handleSaveMinorInfo = async () => {
  try {
    const payload = {
      OwnerID: selectedRow.OwnerID,

      // Property Mast
      addressEnglish: minorInfo.Address,
      addressMarathi: minorInfo.OwnerPatta,
      shopNameEnglish: minorInfo.BuildingOrShopName,
      shopNameMarathi: minorInfo.BuildingOrShopNameMarathi,
      flatNo: minorInfo.BuildingOrFlatNo,
      mobileNo: minorInfo.MobileNo,
      newPlotNo: minorInfo.NewPlotNo,
      newCityServeyNo: minorInfo.NewCityServeyNo,
      loanRemark: minorInfo.LoanRemark,
      fileNo: minorInfo.FileNo,
      length: minorInfo.OpenPlotLength,
      width: minorInfo.OpenPlotWidth,

      // Social
      rToilet: Number(minorInfo.NewToiletNo || 0),
      cToilet: Number(minorInfo.commToiletNo || 0),

      // Old Property
      oldPropertyNo: minorInfo.OldPropertyNo,

      // Renter
      renterName: minorInfo.OpenPlotRenterName
    };

    const response = await updateMinorInfo(payload);
    console.log("Minor info saved:", response);

  } catch (error) {
    console.error("Error saving minor info", error);
  }
};

const [isEditing, setIsEditing] = useState(false);

const editableTaxHeaders = taxHeaders.filter(
  (h) => !["Interest", "DiscountPercentage"].includes(h.key)
);


const distributionHeaders = [
  ...editableTaxHeaders,
  { key: "Interest", label: "शास्ती कर" }
];

const [enteredAmount, setEnteredAmount] = useState(0);

const [previewNetTotal, setPreviewNetTotal] = useState(null);

const baseDistributionRef = useRef(null);

const onPayCurrent = () => {
  setSelectedType("CURRENT"); 
  setIsPartialPayment(true);   
  setPartialAmount(currentTotals.net); 

  const baseRow = {};
  taxKeys.forEach((key) => {
    baseRow[key] = Number(currentBalance?.[key] ?? 0);
  });

  baseRow.Interest = Number(currentBalance?.Interest ?? 0);

  
  // ✅ CORRECT KEY USED BY TABLE
  baseRow.DiscountPercentage = Number(currentTotals?.discount ?? 0);

  console.log("🟢 baseRow after PAY CURRENT:", baseRow);
  // baseDistributionRef.current = baseRow;
    baseDistributionRef.current = { ...baseRow };


  setDistributionValues(baseRow);
  setShowTaxDistr(true);
  setShowDistributionTable(false);
};


const onUpdateRow = () => {
  const taxTotal = taxKeys.reduce(
    (sum, k) => sum + Number(distributionValues[k] ?? 0),
    0
  );

  const netTotal = Math.round(Number(partialAmount));

  // 🔍 1️⃣ LOG RAW DISTRIBUTION (what user edited)
  console.log("🟡 RAW distributionValues:", {
    ...distributionValues
  });

  // 🔍 2️⃣ LOG BEFORE forcing discount
  const beforeUpdate = {
    ...distributionValues,
    TaxTotal: Math.round(taxTotal),
    NetTotal: netTotal
  };

  console.log("🟠 BEFORE Discount reset:", beforeUpdate);

  // 🔒 3️⃣ FORCE DISCOUNT = 0
  const finalRow = {
    ...beforeUpdate,
    Discount: 0
  };

  console.log("🟢 FINAL ROW (Discount forced 0):", finalRow);

  if (selectedType === "CURRENT") {
    setCurrentBalance(prev => {
      console.log("🔵 PREVIOUS CURRENT BALANCE:", prev);
      return { ...prev, ...finalRow };
    });
  }

  if (selectedType === "PENDING") {
    setPendingBalance(prev => {
      console.log("🔵 PREVIOUS PENDING BALANCE:", prev);
      return { ...prev, ...finalRow };
    });
  }

  setIsEditing(false);
  setShowDistributionTable(false);
};



const applyPaymentSelection = (type) => {
  let amount = 0;

  if (type === "PENDING") {
    amount = Number(pendingTotals.net ?? 0);
  }

  if (type === "CURRENT") {
    amount = Number(currentTotals.net ?? 0);
  }

  if (type === "TOTAL") {
    amount =
      Number(pendingTotals?.net ?? 0) +
      Number(currentTotals?.net ?? 0); // 🔥 FIX
  }

  setSelectedType(type);
  setPartialAmount(amount);

  setValues(prev => ({
    ...prev,
    totalPayTax: amount
  }));

  setShowPayPanel(true);
  setMode("DETAILS");
};

const handleCancel = () => {
  setSelectedRow(null);
  setSelectedOwnerRow(null); // if you are using this
  setFormData({
    propertyIndexNo: '',
    wardNo: '',
    propertyNo: '',
    oldWardNo: '',
    oldPropertyNo: '',
    primaryOwnerEng: '',
    primaryOwnerMar: '',
    occupierEng: '',
    occupierMar: '',
    computerNo: '',
    mobileNo: '',
  });
  setMode("SEARCH");
  setSelectedOldWard('');
  setSelectedWard('');
  setSelectedPropertyOwnerID(null);
  setSelectedOldPropertyOwnerID(null)
  setShowTable(false);
  setShowPropertyGrid(false);
  setShowReciept(false);
};



  return (
    <>
      <Card sx={{ fontSize: '0.9rem', fontWeight: 'bold', mb: 4, background: '#FAFAFB' }}>
        मालमत्ता कर भरणा करण्याबाबत कोणतीही तक्रार असल्यास किंवा मदत पाहिजे असल्यास कृपया या टोल फ्री नंबर क्रमांकावर संपर्क साधा{' '}
        <Link>helpdesk.Shirurnp@gmail.com</Link> या इमेल आय.डी. वर मेल करा.{' '}
      </Card>
      {mode === "SEARCH" && (
        <>
          <MainCard style={{ backgroundColor: '#e3f2fd' }}>
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>
              <span>Find Property</span>
            </Typography>
          </MainCard>
          {/*search criteria*/}
          <MainCard>
           
              <Grid container spacing={3}>
                <Grid item xs={12} md={10} lg={6}>
                
                    <Box>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6} sm={4.7}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>मालमत्ता सांकेतांक:</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField required fullWidth autoComplete="family-name"  name="propertyIndexNo"
  value={formData.propertyIndexNo}
  onChange={handleChange}
  placeholder="Enter Property Index No."
  disabled />
                          </Stack>
                        </Grid>
                      </Grid>
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
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6} sm={4.6}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}> जुना वॉर्ड नं .:</InputLabel>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sm={7.3} mb={1}>
                            <Stack spacing={1}>
                           
                   
                            <Select
                          labelId="ward-no-label"
                          id="ward-no-select"
                          value={selectedOldWard}
                          onChange={handleOldWardChange}
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
                  
                          {Array.isArray(oldWardList) &&
                            oldWardList.length > 0 &&
                            oldWardList.map((ward, index) => (
                              <MenuItem key={index} value={Number(ward.OldWardNo)}>
                                {ward.OldWardNo}
                              </MenuItem>
                            ))}
                        </Select>
                               </Stack> 
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6} sm={4.6}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>प्राथमिक कर धारकाचे नाव : (इंग्रजी)</InputLabel>
                          </Stack>
                        </Grid>

                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField required fullWidth autoComplete="family-name"    name="primaryOwnerEng"
  value={formData.primaryOwnerEng}
  onChange={handleChange}
  placeholder="Enter Primary Owner Name (English)" />
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
                          <TextField required fullWidth autoComplete="family-name"   name="mobileNo"
  value={formData.mobileNo}
  onChange={handleChange}
  placeholder="Enter Mobile No." />
                        </Stack>
                      </Grid>
                    </Grid>
                 
                  </Box>
                </Grid>
                <Grid item xs={12} md={10} lg={6}>
                  <Box>
                     <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6} sm={4.6}>
                          <Stack sx={{ mt: 1 }} spacing={1}>
                            <InputLabel style={{ fontWeight: 'bold' }}>संगणक क्रं. :</InputLabel>
                          </Stack>
                        </Grid>

                        <Grid item xs={6} sm={7.3} mb={1}>
                          <Stack spacing={1}>
                            <TextField required fullWidth autoComplete="family-name" name="computerNo"
  value={formData.computerNo}
  onChange={handleChange}
  placeholder="Enter Computer No." />
                          </Stack>
                        </Grid>
                      </Grid>
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
                          <InputLabel style={{ fontWeight: 'bold' }}>जुना मालमत्ता नं :</InputLabel>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} sm={7.3} mb={1}>
                        <Stack spacing={1}>

<Autocomplete
  options={oldPropertyNoList}

  value={
    oldPropertyNoList.find(
      x => x.OwnerID === selectedOldPropertyOwnerID
    ) || null
  }

  onChange={(_, selectedOption) => {
    if (!selectedOption) {
      setSelectedOldPropertyOwnerID(null);
      setFormData(prev => ({
        ...prev,
        oldPropertyNo: '',
        oldPartitionNo: ''
      }));
      return;
    }

    setSelectedOldPropertyOwnerID(selectedOption.OwnerID);

    setFormData(prev => ({
      ...prev,
      oldPropertyNo: selectedOption.OldPropertyNo,
      oldPartitionNo: selectedOption.OldPartitionNo || ''
    }));
  }}

  inputValue={formData.oldPropertyNo}

  onInputChange={(_, newInput) => {
    setFormData(prev =>
      prev.oldPropertyNo === newInput
        ? prev
        : { ...prev, oldPropertyNo: newInput }
    );
  }}

  isOptionEqualToValue={(a, b) => a?.OwnerID === b?.OwnerID}

  getOptionLabel={(o) =>
    o.OldPartitionNo
      ? `${o.OldPropertyNo}_${o.OldPartitionNo}`
      : o.OldPropertyNo
  }

  renderInput={(params) => (
    <TextField {...params} size="small" fullWidth />
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
                          <TextField required fullWidth autoComplete="family-name"   name="primaryOwnerMar"
  value={formData.primaryOwnerMar}
  onChange={handleChange}
  placeholder="Enter Primary Owner Name (Marathi)"/>
                        </Stack>
                      </Grid>
                    </Grid>
                  
                  </Box>
                </Grid>
              </Grid>
           
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} sm={2}>
                    <Stack spacing={1}>
                      <Button variant="contained" color="primary" onClick={handleGetProperty} disabled={loading}>
                        {loading ? (
    <CircularProgress size={22} sx={{ color: "white" }} />
  ) : (
    "Get Property"
  )}
                      </Button>
                        
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Stack spacing={1}>
                      <Button variant="contained" color="secondary" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
          
 {showTable && (
  <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
   <Box style={{ height: 500, width: "100%" }}>
    <DataGrid
      rows={rows}
      columns={columns}
      pageSizeOptions={[10, 25, 50, 100]}
      disableRowSelectionOnClick
     onRowClick={(params) => {
  setSelectedRow(params.row);
  setMode("DETAILS")
  setShowPropertySearch(false);
}}

      sx={{
        "& .MuiDataGrid-columnHeaders": { fontWeight: "bold", fontSize: 15 },
        "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
      }}
    />
  </Box>

</Grid>

)}   
{/* ---------------- search table ownername||ownername marathi---------------- */}

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




          </MainCard>
          
        </>
      )} 
         {/* ---------------- DETAILS MODE ---------------- */}
   {mode === "DETAILS" && (selectedRow || selectedOwnerRow) && (
        <>
          <Grid display={'flex'} justifyContent={'space-evenly'} mb={2} ml={5}>
            <Button variant="contained" color="info"  onClick={() => {
    setSelectedRow(null);     // ✔ clear selected row
    //setShowPropertySearch(true); 
    setMode("SEARCH")
    handleCancel();
     // optional: refresh table if needed
  }}>
              Search Property
            </Button>
            <Button variant="contained" color="info">
              Get Notice
            </Button>
            <Button variant="contained" color="info">
              Get Karakarni
            </Button>
            <Button variant="contained" color="info">
              Get Nakkal
            </Button>
            <Button variant="contained" color="info" onClick={handleOpenMinor}>
              Minor Changes
            </Button>
            <Dialog open={openMinor} onClose={handleCloseMinor} maxWidth="md" fullWidth>
              <DialogTitle>Minor Changes</DialogTitle>

              <DialogContent dividers>
                <Grid container spacing={2}>
               
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Address</InputLabel>
                    <TextField  fullWidth size="small"  name="Address"
  value={minorInfo.Address}
  onChange={handleMinorChange} />
                  </Grid>

                  {/* Address */}
                  <Grid item xs={12} sm={6} mb={2}>
                         <InputLabel>Address in Marathi</InputLabel>
                    <TextField  fullWidth size="small" name='OwnerPatta' value={minorInfo.OwnerPatta||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* Shop Name Marathi */}
                  <Grid item xs={12} sm={6}>  
                        <InputLabel>Shop/Building Name</InputLabel> 
                    <TextField  fullWidth size="small" name='BuildingOrShopName' value={minorInfo.BuildingOrShopName||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* Shop/Building Name */}
                  <Grid item xs={12} sm={6}>
                        <InputLabel>Shop Name in Marathi</InputLabel>
                    <TextField  fullWidth size="small" name='BuildingOrShopNameMarathi' value={minorInfo.BuildingOrShopNameMarathi||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* Flat No */}
                  <Grid item xs={6} sm={3}>
                         <InputLabel>Flat No.</InputLabel>
                    <TextField  fullWidth size="small" name='BuildingOrFlatNo' value={minorInfo.BuildingOrFlatNo||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* Mobile */}
                  <Grid item xs={6} sm={3}>
                         <InputLabel>Mobile No.</InputLabel>
                    <TextField  fullWidth size="small" name='MobileNo' value={minorInfo.
                    MobileNo
||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* R.Toilet */}
                  <Grid item xs={6} sm={3}>
                         <InputLabel> R.Toilet</InputLabel>
                    <TextField  fullWidth size="small" name='RToilet' value={minorInfo.RToilet||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* C.Toilet */}
                  <Grid item xs={6} sm={3}>
                         <InputLabel> C.Toilet</InputLabel>
                    <TextField  fullWidth size="small" name='CToilet' value={minorInfo.CToilet||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* Old Property No */}
                  <Grid item xs={12} sm={4}>
                         <InputLabel>Old Property No</InputLabel>
                    <TextField  fullWidth size="small" name='OldPropertyNo' value={minorInfo.OldPropertyNo
||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* New Plot No */}
                  <Grid item xs={12} sm={4}>
                         <InputLabel> New Plot No</InputLabel>
                    <TextField  fullWidth size="small" name='NewPlotNo' value={minorInfo.NewPlotNo||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* New City Survey No */}
                  <Grid item xs={12} sm={4}>
                         <InputLabel>New City Survey No.</InputLabel>
                    <TextField  fullWidth size="small" name='NewCityServeyNo' value={minorInfo.NewCityServeyNo||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* Loan Remark */}
                  <Grid item xs={12} sm={4}>
                         <InputLabel>Loan Remark</InputLabel>
                    <TextField  fullWidth size="small" name='LoanRemark' value={minorInfo.LoanRemark||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* File No */}
                  <Grid item xs={12} sm={4}>
                         <InputLabel>File No </InputLabel>
                    <TextField  fullWidth size="small" name='shopNameEnglish' value={minorInfo.FileNo||''} onChange={handleMinorChange}/>
                  </Grid>

                  {/* Length */}
                  <Grid item xs={12} sm={2}>
                         <InputLabel>Length</InputLabel>
                    <TextField  fullWidth size="small" name='OpenPlotLength' value={minorInfo.OpenPlotLength||''} onChange={handleMinorChange} />
                  </Grid>

                  {/* Width */}
                  <Grid item xs={12} sm={2}>
                         <InputLabel>Width</InputLabel>
                    <TextField  fullWidth size="small" name='OpenPlotWidth' value={minorInfo.OpenPlotWidth||''} onChange={handleMinorChange}/>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button variant="contained" onClick={handleSaveMinorInfo}>Save</Button>
              </DialogActions>
            </Dialog>
          </Grid>

          {/* selected property details*/ }
          <MainCard title="प्राथमिक कर धारकाची माहिती">
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} lg={4}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 0.5, mr: 1 }}>वार्ड क्र.</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}> {minorInfo?.NewWardNo || "-"}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 0.5, mr: 1 }}>मालमत्ता क्र.</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}> {minorInfo?.NewPropertyNo || "-"}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 0.5, mr: 1 }}>प्राथमिक कर धारकाचे नाव:</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>{minorInfo?.NewPropertyNo || "-"}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={1} mt={0.5}>
              <Grid item xs={12} md={6} lg={4}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 0.5, mr: 1 }}>भोगवटदार :</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>{minorInfo?.OccupierName || "-"}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 0.5, mr: 1 }}>भाडेकरी नाव :</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>{minorInfo?.renterName || "-"}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 0.5, mr: 1 }}>दुकानाचे नाव /अपार्टमेन्टचे नाव:</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>{minorInfo?.shopNameEnglish || "-"}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4} mt={2}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 1, mr: 1 }}>संपर्क क्र. :</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>{minorInfo?.MobileNo || "-"}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} lg={4} mt={2}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 1, mr: 1 }}>पत्ता :</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>{minorInfo?.Address || "-"}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} lg={4} mt={2}>
                <Grid display={'flex'} justifyContent={'space-between'} ml={5}>
                  <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', mt: 1, mr: 1 }}>सिटी सर्वे नं. :</Typography>
                  <Typography sx={{ color: 'blue', fontWeight: 'bolder', fontSize: '1rem' }}>{minorInfo?.NewCityServeyNo || "-"}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
          {/* selected property details bill */ }

{showDebt && (
           <MainCard title="कराचे विवरण">
  <Box sx={{ width: "100%", overflowX: "auto" }}>

 {(hasPending || hasCurrent || hasTotal) && (

    <Table sx={{ minWidth: 2500 }}> {/* Set wide enough for all columns */}
      <TableHead>
        <TableRow>
          <TableCell>Select</TableCell>
          <TableCell>Edit Row</TableCell>
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

      <TableBody>
     {hasPending &&(
        <TableRow>
          <TableCell>
            <Checkbox
  checked={pendingSelected}
  onChange={(e) => {
    setPendingSelected(e.target.checked);

    if (e.target.checked) {
      applyPaymentSelection("PENDING");
    } else {
      if (!currentSelected && !totalSelected) {
        setShowPayPanel(false);
      }
    }
  }}
/>



</TableCell>
          <TableCell>
            {hasPending && (
              <Button
                variant="contained"
                color="warning"
                size="small"
           onClick={onPayPending}

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
       {/* Current Balance Row */}
{hasCurrent && (
  <TableRow>
    <TableCell>
      <Checkbox
        checked={currentSelected}
        onChange={(e) => {
          setCurrentSelected(e.target.checked);

          if (e.target.checked) {
            applyPaymentSelection("CURRENT");
          } else {
            if (!pendingSelected && !totalSelected) {
              setShowPayPanel(false);
            }
          }
        }}
      />
    </TableCell>

    <TableCell>
      <Button
        variant="contained"
        color="success"
        size="small"
        onClick={onPayCurrent}
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
       {/* TOTAL Row */}
{hasTotal && (
  <TableRow sx={{ background: "#eef" }}>
    <TableCell>
      <Checkbox
        checked={totalSelected}
        onChange={(e) => {
          setTotalSelected(e.target.checked);

          if (e.target.checked) {
            applyPaymentSelection("TOTAL");
          } else {
            if (!pendingSelected && !currentSelected) {
              setShowPayPanel(false);
            }
          }
        }}
      />
    </TableCell>

    <TableCell>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => {
          if (!totalSelected) {
            setSnackbar({
              open: true,
              message: "Please select the record before proceeding.",
              severity: "warning",
            });
            setShowPayPanel(false);
            return;
          }

          setShowPayPanel(true);
          handleSelectPaymentMode("TOTAL");
        }}
      >
        PAY TOTAL
      </Button>
    </TableCell>

    <TableCell>Total</TableCell>

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
 )}
 {!hasPending && !hasCurrent && !hasTotal && (
  <Typography align="center" sx={{ mt: 2 }}>
    No tax dues available
  </Typography>
)}

</Box>
  </MainCard>
)}





{showTaxDistr && (

            
            <MainCard>
             <Grid container alignItems="center" spacing={2} sx={{ mt: 2 }}>

   <Grid item>
    <Typography sx={{ fontWeight: "bolder", fontSize: "1rem" }}>
      मागील थकीत कराचे वर्णन:
    </Typography>
  </Grid>

  <Grid item>
    <Button variant="contained" color="primary" onClick={() => setOpenPendingTaxDialog(true)}> मागील थकीत कराचे वर्णन</Button>
  </Grid>
  {/* अंशत भरावयाची एकूण रक्कम */}
  <Grid item>
    <Typography sx={{ fontWeight: "bolder", fontSize: "1rem" }}>
      अंशत भरावयाची एकूण रक्कम रु.:
    </Typography>
  </Grid>

  <Grid item>
    <TextField
      size="small"
      sx={{ width: 170 }}
      InputProps={{
        sx: { color: "blue", fontWeight: "bolder", fontSize: "1rem" },

      }}
      value={partialAmount}
      onChange={handlePartialAmountInput}
    />
  </Grid>

  
  </Grid>
    <Grid container alignItems="center" spacing={2} sx={{ mt: 2 }}>
{/* अधिक भरावयाची रक्कम */ }

  <Grid item>
    <Typography sx={{ fontWeight: "bolder", fontSize: "1rem" }}>
      अधिक भरावयाची रक्कम:
    </Typography>
  </Grid>

  <Grid item>
    <TextField
      size="small"
      sx={{ width: 170 }}
      InputProps={{
        sx: { color: "blue", fontWeight: "bolder", fontSize: "1rem" },
      }}
    />
  </Grid>
  {/* नोटीस फी */}
  <Grid item>
    <Typography sx={{ fontWeight: "bolder", fontSize: "1rem" }}>
      नोटीस फी :
    </Typography>
  </Grid>

  <Grid item>
    <TextField
      size="small"
      sx={{ width: 170 }}
      InputProps={{
        sx: { color: "blue", fontWeight: "bolder", fontSize: "1rem" },
      }}
    />
  </Grid>

  {/* कर वितरण करा Button */}
  <Grid item sx={{ ml: 10 }}>
    <Button variant="contained" color="primary" onClick={onOpenDistribution}>
      कर वितरण करा
    </Button>
  </Grid>
</Grid>

                   <Grid container>
                <Typography
  variant="body1"
  sx={{
   ml:'10px',
    fontSize: '1rem',     // Increase size (you can use 1.1rem or 1.2rem)
    fontWeight: 'bold', 
    mt:"20px"   // Make text bold
  }}
>
{renderDiscountNote(currentYear, currentBalance)}

</Typography>

</Grid>
            
            </MainCard>
            )}


 {showPayPanel && (

           
            <MainCard style={{ backgroundColor: '#e3f2fd' }}>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                <span>Pay Property Tax</span>
              </Typography>
    <Box sx={{ p: { xs: 1.5, sm: 3 }, maxWidth: 1100, mx: 'auto' }}>
      
      <Card>
        <CardContent>
          {/* Grid container: two-column layout on md+; single column on sm */}
          <Grid container spacing={2}>
            {/* Left column (form fields grouped) */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack sx={{ mb: 1 }}>
                <InputLabel>Email</InputLabel>
               </Stack>
                  <TextField
                    fullWidth
                  
                    value={values.email}
                    onChange={handlePaymentChange('email')}
                    variant="outlined"
                    size="small"
                  />
                   
                </Grid>

                <Grid item xs={12} >
                    <Stack sx={{ mb: 1 }}>
                                      <InputLabel id="billbook-label">Bill Book No</InputLabel>
               
</Stack>
<Stack>
                    <Select
                      labelId="billbook-label"
                      value={values.billBook}
                      label="Bill Book No"
                      onChange={handlePaymentChange('billBook')}
                    >
  {billBookNos.map((item, index) => (
    <MenuItem key={index} value={item.BillBookNo}>
      {item.BillBookNo}
    </MenuItem>
  ))}

                    
                    </Select>
              </Stack>
                </Grid>

                <Grid item xs={12}>
                         <Stack sx={{ mb: 1 }}>
              <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
              </Stack>
  
                  <Stack>
                    <Select
                      labelId="payment-mode-label"
                      value={values.paymentMode}
                      label="Payment Mode"
                      onChange={handlePaymentChange('paymentMode')}
                    >
                      {paymentModes.map((mode, idx) => (
    <MenuItem key={idx} value={mode}>
      {mode}
    </MenuItem>
  ))}
                    </Select>
               </Stack>
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
{showReferalID&&(
                 <Grid item xs={12} >
                         <Stack sx={{ mb: 1 }}>

                      <InputLabel>Paid Ref ID</InputLabel>
                      </Stack>
                  <TextField
                    fullWidth
                    labe
                    value={values.RelID}
                    onChange={handlePaymentChange('RelID')}
                    size="small"
                  />
                </Grid>
                )}
 {showBank&&(
                <Grid item xs={12} >
                       <Stack sx={{ mb: 1 }}>
                    <InputLabel id="bank-label">Bank</InputLabel>
                    </Stack>
                    <Stack>
                    <Select
                      labelId="bank-label"
                      value={values.bank}
                   
                      onChange={handlePaymentChange('bank')}
                    >
                      {banks.map((bank, idx) => (
        <MenuItem key={idx} value={bank}>
          {bank}
        </MenuItem>
      ))}
                    </Select>
                 </Stack>
                </Grid>
 )}
                
{showDDandCheckDate&&(
                <Grid item xs={12} >
                         <Stack sx={{ mb: 1 }}>

                  <InputLabel>Cheque/DD/ Date</InputLabel>
                  </Stack>
                  <TextField
                    fullWidth
                
                    value={values.chequeDate}
                    onChange={handlePaymentChange('chequeDate')}
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
)}

                <Grid item xs={12}>
                         <Stack sx={{ mb: 1 }}>

                   <InputLabel>Total Pay Tax</InputLabel>
                   </Stack>
                  <TextField
                    fullWidth
                 
                    value={values.totalPayTax}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Right column (compact fields) */}
            <Grid item xs={12} md={6}>
             
              <Grid container spacing={2}>
                <Grid item xs={12}>
                         <Stack sx={{ mb: 1 }}>

                   <InputLabel>Mobile No.</InputLabel>
                   </Stack>
                  <TextField
                    fullWidth
                 
                    
                    value={values.mobile}
                    onChange={handlePaymentChange('mobile')}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} >
                         <Stack sx={{ mb: 1 }}>

                   <InputLabel>Invoice No</InputLabel>
                   </Stack>
                  <TextField
                    fullWidth
                    value={values.invoiceNo}
                    onChange={handlePaymentChange('invoiceNo')}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                         <Stack sx={{ mb: 1 }}>

                    <InputLabel>Behalf Payer Name</InputLabel>
                    </Stack>
                  <TextField
                    fullWidth
             
                    value={values.behalfPayer}
                    onChange={handlePaymentChange('behalfPayer')}
                    size="small"
                  />
                </Grid>
                {showCheckDDTransNo&&(
                <Grid item xs={12} >
                         <Stack sx={{ mb: 1 }}>

                      <InputLabel>Cheque/DD/Trans No</InputLabel>
                      </Stack>
                  <TextField
                    fullWidth
               
                    value={values.chequeNo}
                    onChange={handlePaymentChange('chequeNo')}
                    size="small"
                  />
                </Grid>
                )}
                 {showCheckDDTransDate&&(
                 <Grid item xs={12}>
                         <Stack sx={{ mb: 1 }}>

                      <InputLabel>Cheque/DD/Trans Date</InputLabel>
                      </Stack>
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
                 )}

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                    <Button variant="contained" size="medium" onClick={handlePayNow}>
                      Pay Now
                    </Button>

                    <Button variant="outlined" size="medium">
                      Check Now
                    </Button>

                    {/* small auxiliary action (helper text or status) */}
                    <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                      Pay using NEFT / Cheque / DD
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  {/* Mimic a column of small informational fields */}
                  <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                    * Fields marked are mandatory
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>

            </MainCard>
               )}
        <Dialog
      open={openPendingTaxDialog}
      onClose={handleClosePendingDialoge}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "80vw",
          backgroundColor: "white",
          borderRadius: 2,
          padding: 2,
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            maxHeight: "60vh",
            overflow: "auto",
            border: "1px solid #ccc",
            p: 1,
            background: "#fff",
          }}
        >
          {/* TABLE */}
          <Table
            sx={{
              minWidth: "1600px", // force scroll like screenshot
              borderCollapse: "collapse",
            }}
          >
            {/* <TableHead>
              <TableRow>
                {[
                  "कर मागणी वर्ष",
                  "मासिकता रु.",
                  "दुय्यम रु.",
                  "म. शिक्षण उपकर रु.",
                  "रोजगार हमी उपकर रु.",
                  "अभिषमन रु.",
                  "उपभोक्ता शुल्क रु.",
                  "स्वच्छता कर रु.",
                  "सार्वजनिक कर रु.",
                  "अनाधिकृत बांधकामावरती शुल्क",
                  "शास्ती रु.",
                  "शास्ती रु."
                ].map((text, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      border: "1px solid #333",
                      textAlign: "center",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      padding: "6px",
                    }}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead> */}
<TableHead>
  <TableRow>
    <TableCell>कर मागणी वर्ष</TableCell>

    {taxHeaders.map((h) => (
      <TableCell key={h.key} sx={{ whiteSpace: "nowrap" }}>
        {h.label}
      </TableCell>
    ))}

   
  </TableRow>
</TableHead>

         <TableBody>
  <TableRow>
    {/* Pending Year */}
    <TableCell
      sx={{
        border: "1px solid #333",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {pendingBalance?.PendingYear ?? "-"}
    </TableCell>

    {/* Taxes */}
    {taxHeaders.map((h) => (
      <TableCell
        key={h.key}
        sx={{
          border: "1px solid #333",
          textAlign: "center",
          padding: "6px",
          whiteSpace: "nowrap",
        }}
      >
        {Number(pendingBalance?.[h.key] ?? 0)}
      </TableCell>
    ))}
  </TableRow>
</TableBody>

          </Table>

        </Box>

        <Typography
          align="center"
          sx={{ mt: 2, fontSize: "14px", fontWeight: "bold" }}
        >
          माघील वर्षांचे करणे नाहीत.
        </Typography>
      </DialogContent>
    </Dialog>
        
        </>
      )}

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
  >
    {snackbar.message}
  </Alert>
</Snackbar>


{showDistributionTable && (
  <Table>
    <TableHead>
       {distributionHeaders.map((h) => (
          <TableCell key={h.key} sx={{ whiteSpace: "nowrap" }}>
            {h.label}
          </TableCell>
        ))}
          </TableHead>
    <TableBody>
    <TableRow>
  {distributionHeaders.map(h => (
    <TableCell key={h.key}>
      {isEditing ? (
        <TextField
          size="small"
          value={distributionValues[h.key] ?? 0}
          onChange={e =>
            setDistributionValues(prev => ({
              ...prev,
              [h.key]: Number(e.target.value || 0)
            }))
          }
        />
      ) : (
        <span>{distributionValues[h.key] ?? 0}</span>
      )}
    </TableCell>
  ))}

  <TableCell sx={{ whiteSpace: "nowrap" }}>
    {!isEditing ? (
      <Button
        color="success"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </Button>
    ) : (
      <Button
        color="success"
        onClick={onUpdateRow}
      >
        Update
      </Button>
    )}
  </TableCell>
</TableRow>

    </TableBody>
  </Table>
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
  value={paidAmount || ""}
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


    </>
  );
}

export default OfflinePayment;
