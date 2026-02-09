// material-ui
import {
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Checkbox,
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  FormControlLabel,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  FormControl,
  Autocomplete,
  Snackbar,
  SnackbarContent,
  InputAdornment
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// eslint-disable-next-line no-restricted-imports
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
// project import
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import FromViewTransTaxPayment from '../fromviewtranstaxpayment/FromViewTransTaxPayment.jsx';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService.js';
//services import
import { fetchWardList } from 'services/data-entry.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { getTransYear } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import {
  getCombinedOwnerDetails,
  getPendingTaxes,
  getInterestAmounts,
  getBalanceSheetData,
  fetchAllBanks,
  saveTaxPayment,
  cancelInvoiceNo,
  checkInvoiceStatus,
  checkDuplicateInvoice,
  fetchBillBookList,
  sendForApproval
} from 'services/Amc/taxPayment/taxPayment.js';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
import { getCurrentTaxes } from 'services/Amc/advancePayment/advancePayment';
import { propertyOf } from 'lodash';
import { convertFileToBase64 } from '../../assessment/data-entry/UploadPhotoAndPlan.jsx'

// ==============================|| Tax PAGE ||============================== //

function TaxPayment() {
  const user = useSelector((state) => state.newUserDetails.initialUserData);
  console.log(user, 'logged in user details');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64File, setBase64File] = useState('');
  const [wardList, setWardList] = useState([]);
  const [wardNo, setWardNo] = useState('');
  const [ownerID, setOwnerID] = useState('');
  const [propertyList, setPropertyList] = useState([]);
  const [property, setProperty] = useState('');
  const [partition, setPartition] = useState('');
  const [ownerDetails, setOwnerDetails] = useState({
    OldWardNo: '',
    OldPropertyNo: '',
    OldPartitionNo: '',
    OwnerName: '',
    OccupierName: '',
    RenterName: '',
    AssessmentNo: ''
  });
  const [yearTrans, setYearTransList] = useState([]);
  const [year, setFinanceYear] = useState('');
  const [billBookNoList, setBillBookNoList] = useState([]);
  const [billBookNo, setBillBookNo] = useState('');
  const [invoiceNoList, setInvoiceNoList] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [empName, setEmpName] = useState('');
  const [empID, setEmpID] = useState('');
  const [allBillBookData, setAllBillBookData] = useState({});
  const [prevPendInt, setPrevPendInt] = useState(0);
  const [pendInt, setPenInt] = useState(0);
  const [currInt, setCurrInt] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(0);
  const [transactionDate, setTransactionDate] = useState(dayjs());
  const [bankList, setBankList] = useState([]);
  const [currentTaxes, setCurrentTaxes] = useState({
    Property: 0,
    Education: 0,
    'Sp.Educ': 0,
    Emp: 0,
    Tree: 0,
    Fire: 0,
    Light: 0,
    Drain: 0,
    Road: 0,
    Sanitation: 0,
    'W.Cess': 0,
    'W.Benifit': 0,
    'W.Bill': 0,
    'M.Build': 0,
    Sewage: 0,
    Tax1: 0,
    Tax2: 0,
    Interest: 0,
    'Total Tax': 0,
    'Extra Charges': 0,
    'Notice Fee': 0,
    Discount: 0,
    NetTotal: 0
  });
  const [initialCurrentTaxes, setInitialCurrentTaxes] = useState({
    Property: 0,
    Education: 0,
    'Sp.Educ': 0,
    Emp: 0,
    Tree: 0,
    Fire: 0,
    Light: 0,
    Drain: 0,
    Road: 0,
    Sanitation: 0,
    'W.Cess': 0,
    'W.Benifit': 0,
    'W.Bill': 0,
    'M.Build': 0,
    Sewage: 0,
    Tax1: 0,
    Tax2: 0,
    Interest: 0,
    'Total Tax': 0,
    'Extra Charges': 0,
    'Notice Fee': 0,
    Discount: 0,
    NetTotal: 0
  });

  const [pendingTaxes, setPendingTaxes] = useState({
    Property: 0,
    Education: 0,
    'Sp.Educ': 0,
    Emp: 0,
    Tree: 0,
    Fire: 0,
    Light: 0,
    Drain: 0,
    Road: 0,
    Sanitation: 0,
    'W.Cess': 0,
    'W.Benifit': 0,
    'W.Bill': 0,
    'M.Build': 0,
    Sewage: 0,
    Tax1: 0,
    Tax2: 0,
    Interest: 0,
    'Total Tax': 0,
    'Extra Charges': 0,
    'Notice Fee': 0,
    Discount: 0,
    NetTotal: 0
  });

  const [initialPendingTaxes, setInitialPendingTaxes] = useState({
    Property: 0,
    Education: 0,
    'Sp.Educ': 0,
    Emp: 0,
    Tree: 0,
    Fire: 0,
    Light: 0,
    Drain: 0,
    Road: 0,
    Sanitation: 0,
    'W.Cess': 0,
    'W.Benifit': 0,
    'W.Bill': 0,
    'M.Build': 0,
    Sewage: 0,
    Tax1: 0,
    Tax2: 0,
    Interest: 0,
    'Total Tax': 0,
    'Extra Charges': 0,
    'Notice Fee': 0,
    Discount: 0,
    NetTotal: 0
  });

  const [totalPaid, setTotalPaid] = useState({
    Property: 0,
    Education: 0,
    'Sp.Educ': 0,
    Emp: 0,
    Tree: 0,
    Fire: 0,
    Light: 0,
    Drain: 0,
    Road: 0,
    Sanitation: 0,
    'W.Cess': 0,
    'W.Benifit': 0,
    'W.Bill': 0,
    'M.Build': 0,
    Sewage: 0,
    Tax1: 0,
    Tax2: 0,
    Interest: 0,
    'Total Tax': 0,
    'Extra Charges': 0,
    'Notice Fee': 0,
    Discount: 0,
    NetTotal: 0
  });
  const [refreshTaxData, setRefreshTaxData] = useState(false);
  const [otherExpenses, setOtherExpenses] = useState({
    Interest: 0,
    'Extra Charges': 0,
    'Notice Fee': 0,
    Discount: 0,
    'Total Tax': 0,
    'Net Total': 0
  });
  const [currNetTotal, setCurrNetTotal] = useState(0);
  const [pendNetTotal, setPendNetTotal] = useState(0);
  const [paymentMode, setPaymentMode] = useState('');
  const [showTaxPayment, setShowTaxPayment] = useState(true);
  const [showViewTransaction, setShowViewTransaction] = useState(true);
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState(null);
  const [remark, setRemark] = useState('');
  const [mobileNo, setMobileNo] = useState('+91 ');
  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [checkFormData, setFormData] = useState({
    chequeNo: '',
    name: '',
    bankName: '',
    branchName: '',
    ifsc: '',
    date: null,
    expiryDate: null
  });
  // State variables to manage checkbox states
  const [isCurrPaymentType, setIsCurrPaymentType] = useState(false);
  const [isPendPaymentType, setIsPendPaymentType] = useState(false);
  //snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [paymentsToSaveOnDup, setPaymentsToSaveOnDup] = useState([]);
  const [dupInvoiceDialog, setDupInvoiceDialog] = useState(false);
  const [allowDupInvoice, setAllowDupInvoice] = useState(false);
  const [levelname, setLevelName] = useState('');
  const [password, setPassword] = useState('');
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  const columnOrder = [
    'Property',
    'Education',
    'Sp.Educ',
    'Emp',
    'Tree',
    'Fire',
    'Light',
    'Drain',
    'Road',
    'Sanitation',
    'W.Cess',
    'W.Benifit',
    'W.Bill',
    'M.Build',
    'Sewage',
    'Tax1',
    'Tax2',
    'Interest',
    'Total Tax'
  ];
  const inputRef = useRef(null);

  const navigate = useNavigate();

  const ownerData = {
    ownerID: ownerID,
    NewWardNo: wardNo,
    NewPropertyNo: property,
    NewPartitionNo: partition,
    FinancialYear: year,
    OwnerName: ownerDetails.OwnerName,
    OccupierName: ownerDetails.OccupierName,
    RenterName: ownerDetails.RenterName,
    AssessmentNo: ownerDetails.AssessmentNo
  };
  useEffect(() => {
   
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Tax Payment';
      try {
        const fetchedPageID = await getPageIDByPageName(pageName);
        console.log(fetchedPageID, 'fetchedPageID' + ` ${pageName}`);
        setPageID(fetchedPageID);
      } catch (error) {
        console.error('Error fetching page ID:', error);
      }
    };
    getPageID();
  }, []);

  // Get permissions for this page for logged in user from Redux
  const permissions = useSelector((state) => {
    const p = state.newUserDetails.permissions;
    return Array.isArray(p) ? p : [];
  });

  //get permission for current page
  const permissionAccess = permissions.find((perm) => perm.PageID === Number(pageID.PageID));

  useEffect(() => {
    if (permissionAccess?.AccessID) {
      const access = permissionAccess.AccessID;
      console.log(access, 'assigned access to Tax Payment Page');
      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true); // Show dialog for No Access or View Only
      } else {
        setShowAccessDialog(false);
      }
    }
  }, [permissionAccess]);

  const handleRedirect = () => {
    setShowAccessDialog(false);
    navigate('/payment/dashboard');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  /* Tax-payment Property Details  */
  //year fetch
  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await getTransYear();
        console.log(response, 'API Response');
        const fetchedYearList = response || []; // Assuming API returns an array of roles directly
        const sortedYearList = [...fetchedYearList].sort((a, b) => b.FinanceYear - a.FinanceYear);
        setYearTransList(sortedYearList); // Update the roleList state
      } catch (error) {
        console.error('Error fetching year list:', error);
        setYearTransList([]);
      }
    };
    fetchYear();
  }, []);

  //Financial year change
  const handleFinanceYearChange = (ev) => {
    if (yearTrans) {
      setFinanceYear(ev.target.value);
    } else {
      setFinanceYear('');
    }
  };

  //Fetch ward list
  useEffect(() => {
    const fetchWardNoList = async () => {
      try {
        const wardList = await fetchWardList();
        console.log('wardList', wardList);
        const wardNumbers = wardList.map((item) => item.NewWardNo);
        // Sort numbers (ascending)
        const sortedWardNumbers = wardNumbers.sort((a, b) => a - b);
        setWardList(sortedWardNumbers);
      } catch (error) {
        console.error('Error in fetching ward list:', error);
      }
    };
    fetchWardNoList();
  }, []);

  //handle ward change
  const handleWardChange = (event) => {
    setWardNo(event.target.value);
  };

  //Fetch Property Range by Ward
  useEffect(() => {
    console.log(wardNo);
    if (wardNo != '') {
      const propertyRange = async () => {
        try {
          setProperty('');
          setPartition('');
          const propertyRange = await fetchPropertyRangeByWard(wardNo);
          console.log('propertyRange:', propertyRange.properties);
          if (propertyRange.properties.length > 0) {
            // Sort by NewPropertyNo, then by NewPartitionNo
            const sortedProperties = [...propertyRange.properties].sort((a, b) => {
              const propA = parseInt(a.NewPropertyNo, 10) || 0;
              const propB = parseInt(b.NewPropertyNo, 10) || 0;
              if (propA !== propB) return propA - propB;

              const partA = parseInt(a.NewPartitionNo, 10) || 0;
              const partB = parseInt(b.NewPartitionNo, 10) || 0;
              return partA - partB;
            });

            setPropertyList(sortedProperties);
          }
        } catch (error) {
          console.error('Failed to fetch propertyRange:', error);
        }
      };

      propertyRange();
    } else {
      setPropertyList([]);
      setProperty('');
      setPartition('');
    }
  }, [wardNo]);

  //label as propertyNo-partitionNo
  const label = (o) => {
    const prop = parseInt(o?.NewPropertyNo, 10) || 0;
    const part = parseInt(o?.NewPartitionNo || 0, 10);
    return part > 0 ? `${prop}-${part}` : `${prop}`;
  };

  //handle function for Property change
  const handlePropertyChange = (_, selected) => {
    console.log('handlePropertyChange', selected);
    if (!selected || propertyList.length === 0) {
      setProperty('');
      setPartition('');
      return;
    }

    // Option 1: Use NewPropertyNo and NewPartitionNo from the object
    setOwnerID(selected.OwnerID);
    setProperty(selected.NewPropertyNo);
    setPartition(selected.NewPartitionNo);
  };

  //fetch owner deatils
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        if (ownerID) {
          const data = await getCombinedOwnerDetails(ownerID);
          console.log('response of fetchOwnerDetails', data);
          setOwnerDetails({
            OldWardNo: data.OldWardNo,
            OldPropertyNo: data.OldPropertyNo,
            OldPartitionNo: data.OldPartitionNo,
            OwnerName: data.OwnerName,
            OccupierName: data.OccupierName,
            RenterName: data.RenterName,
            AssessmentNo: data.AssessmentNo
          });
          console.log('response', ownerDetails);
        } else {
          setOwnerDetails({
            OldWardNo: '',
            OldPropertyNo: '',
            OldPartitionNo: '',
            OwnerName: '',
            OccupierName: '',
            RenterName: '',
            AssessmentNo: ''
          });
        }
      } catch (error) { }
    };
    fetchOwnerDetails();
  }, [ownerID]);

  //On changing ward no reset filled
  useEffect(() => {
    return (
      setProperty(''),
      setPartition(''),
      setOwnerID(''),
      setPropertyList([]),
      setOwnerDetails({
        OldWardNo: '',
        OldPropertyNo: '',
        OldPartitionNo: '',
        OwnerName: '',
        OccupierName: '',
        RenterName: '',
        AssessmentNo: ''
      })
    );
  }, [wardNo]);

  //Bill book data fetch
  useEffect(() => {
    const fetchBillBookEntries = async () => {
      try {
        const { status, data } = await fetchBillBookList();
        console.log('fetchBillBookList', data);
        if (status === 200 && data?.entries) {
          setAllBillBookData(data.entries);
        } else {
          setAllBillBookData([]);
        }
      } catch (error) {
        setAllBillBookData([]);
        setSnackbarSeverity('error');
        setReceivedMessage(error.response?.data?.message || 'Failed to fetch Bill Book list');
        setSnackbarOpen(true);
        console.error('Error fetching bill book entries:', error);
      }
    };

    fetchBillBookEntries();
  }, []);

  //Filter and set BillBookNoList
  useEffect(() => {
    if (!year || allBillBookData.length === 0) return;

    const filteredBillBooks = allBillBookData.filter((entry) => entry.Year === year).map((entry) => entry.BillBookNo);

    setBillBookNoList([...new Set(filteredBillBooks)]);
  }, [year, allBillBookData]);

  //Filter and set InvoiceNoList
  useEffect(() => {
    if (!billBookNo || !year || allBillBookData.length === 0) return;

    const filteredEntries = allBillBookData.filter((entry) => entry.Year === year && entry.BillBookNo === billBookNo);

    if (filteredEntries.length > 0) {
      const { ReceiptNoFrom, ReceiptNoTo, EmpName, UserID } = filteredEntries[0];
      const numberRange = Array.from({ length: ReceiptNoTo - ReceiptNoFrom + 1 }, (_, i) => ReceiptNoFrom + i);
      setInvoiceNoList(numberRange);
      setEmpName(EmpName);
      setEmpID(UserID);
    } else {
      setInvoiceNoList([]);
      setEmpName('');
      setEmpID('');
    }
  }, [billBookNo, year, allBillBookData]);

  //Handle to change BillBookNo
  const handleBillBookNo = (e) => {
    setBillBookNo(e.target.value);
  };

  //handle to change InvoiceNo
  const handleInvoiceNo = async (e) => {
    const value = e.target.value;
    if (value) {
      const res = await checkInvoiceStatus(year, billBookNo, value);
      if (res.status === 409) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(`${res.message}` || `Invoice No ${invoiceNo} is not active for BillBook No ${billBookNo}`);
        setInvoiceNo('');
        return;
      } else {
        setInvoiceNo(value);
      }
    }
  };

  /*Fetch current, pending and total paid record */
  //Fetch balancesheet Data

  useEffect(() => {
    console.log(showViewTransaction, 'showViewTransaction');
  }, [showViewTransaction]);
  //Fetch current tax data for selected owner
  useEffect(() => {
    {
      if (year !== '') {
        const getCurrentTaxesData = async () => {
          try {
            if (ownerID && year) {
              const c_taxes = await getCurrentTaxes(ownerID, year);
              console.log('Current Taxes:', c_taxes);

              // safely access second array object
              const taxData = c_taxes?.[0] || {};
              const mappedData = {
                Property: taxData.PropertyTax || 0,
                Education: taxData.EducationTax || 0,
                'Sp.Educ': taxData.SpEducationTax || 0,
                Emp: taxData.EmploymentTax || 0,
                Tree: taxData.TreeCess || 0,
                Fire: taxData.FireCess || 0,
                Light: taxData.LightCess || 0,
                Drain: taxData.DrainCess || 0,
                Road: taxData.RoadCess || 0,
                Sanitation: taxData.Sanitation || 0,
                'W.Cess': taxData.SpWaterCess || 0,
                'W.Benifit': taxData.WaterBenefit || 0,
                'W.Bill': taxData.WaterBill || 0,
                'M.Build': taxData.MajorBuilding || 0,
                Sewage: taxData.SewageDisposalCess || 0,
                Tax1: taxData.Tax1 || 0,
                Tax2: taxData.Tax2 || 0,
                Interest: taxData.Interest || 0,
                'Total Tax': taxData.TaxTotal || 0,
                'Extra Charges': taxData.MiscellaneousFee || 0,
                'Notice Fee': taxData.NoticeFee || 0,
                Discount: taxData.Discount || 0,
                NetTotal: taxData.TaxTotal || 0
              };
              console.log('get current tax', currentTaxes);
              setCurrentTaxes(mappedData);
              setInitialCurrentTaxes(mappedData);
            }
            const p_taxes = await getPendingTaxes(ownerID, year);
            console.log('Pending Taxes:', p_taxes);

            // safely access second array object
            const taxData = p_taxes?.[0] || {};
            const mappedData = {
              Property: taxData.PropertyTax || 0,
              Education: taxData.EducationTax || 0,
              'Sp.Educ': taxData.SpEducationTax || 0,
              Emp: taxData.EmploymentTax || 0,
              Tree: taxData.TreeCess || 0,
              Fire: taxData.FireCess || 0,
              Light: taxData.LightCess || 0,
              Drain: taxData.DrainCess || 0,
              Road: taxData.RoadCess || 0,
              Sanitation: taxData.Sanitation || 0,
              'W.Cess': taxData.SpWaterCess || 0,
              'W.Benifit': taxData.WaterBenefit || 0,
              'W.Bill': taxData.WaterBill || 0,
              'M.Build': taxData.MajorBuilding || 0,
              Sewage: taxData.SewageDisposalCess || 0,
              Tax1: taxData.Tax1 || 0,
              Tax2: taxData.Tax2 || 0,
              Interest: taxData.Interest || 0,
              'Total Tax': taxData.TaxTotal || 0,
              'Extra Charges': taxData.MiscellaneousFee || 0,
              'Notice Fee': taxData.NoticeFee || 0,
              Discount: taxData.Discount || 0,
              NetTotal: taxData.NetTotal || 0
            };

            setPendingTaxes(mappedData);
            setInitialPendingTaxes(mappedData);

            const taxes = await getBalanceSheetData(ownerID, year);
            console.log('get balance sheet data', taxes);

            if (taxes[3][0]) {
              setTotalPaid({
                Property: taxes[3][0]?.PropertyTax || 0,
                Education: taxes[3][0]?.EducationTax || 0,
                'Sp.Educ': taxes[3][0]?.SpEducationTax || 0,
                Emp: taxes[3][0]?.EmploymentTax || 0,
                Tree: taxes[3][0]?.TreeCess || 0,
                Fire: taxes[3][0]?.FireCess || 0,
                Light: taxes[3][0]?.LightCess || 0,
                Drain: taxes[3][0]?.DrainCess || 0,
                Road: taxes[3][0]?.RoadCess || 0,
                Sanitation: taxes[3][0]?.Sanitation || 0,
                'W.Cess': taxes[3][0]?.SpWaterCess || 0,
                'W.Benifit': taxes[3][0]?.WaterBenefit || 0,
                'W.Bill': taxes[3][0]?.WaterBill || 0,
                'M.Build': taxes[3][0]?.MajorBuilding || 0,
                Sewage: taxes[3][0]?.SewageDisposalCess || 0,
                Tax1: taxes[3][0]?.Tax1 || 0,
                Tax2: taxes[3][0]?.Tax2 || 0,
                Interest: taxes[3][0]?.Interest || 0,
                'Total Tax': taxes[3][0]?.TaxTotal || 0,
                'Extra Charges': taxes[3][0]?.MiscellaneousFee || 0,
                'Notice Fee': taxes[3][0]?.NoticeFee || 0,
                Discount: taxes[3][0]?.Discount || 0,
                NetTotal: taxes[3][0]?.NetTotal || 0
              });
            }
            console.log('TotalPaid', taxes[3][0]);
          } catch (error) {
            console.error('Error fetching current taxes data:', error);
          }
        };
        getCurrentTaxesData();
      } else {
        if (ownerID) {
          setSnackbarOpen(true);
          setSnackbarSeverity('error');
          setReceivedMessage('Please Select The Finance Year');
        }
      }
    }
  }, [ownerID, year, showViewTransaction, refreshTaxData]);

  useEffect(() => {
    console.log(currentTaxes, 'CurrentTaxes');
    console.log(pendingTaxes, 'PendingTaxes');
  }, [currentTaxes, pendingTaxes]);

  //Select payment type
  const handleCheckboxClick = (e, type) => {
    e.stopPropagation(); // stop ripple propagation

    const isCurrent = type === 'current';
    const netTotal = Number(isCurrent ? currentTaxes?.NetTotal || 0 : pendingTaxes?.NetTotal || 0);

    if (netTotal == 0) {
      // Stop the visual toggle (revert immediately)
      e.preventDefault();

      setSnackbarSeverity('error');
      setReceivedMessage(`${isCurrent ? 'Current' : 'Pending'} Tax Net Total is zero — cannot enable.`);
      setSnackbarOpen(true);
      return;
    }
    if (type === 'current') {
      setIsCurrPaymentType((prev) => !prev);
    } else if (type === 'pending') {
      setIsPendPaymentType((prev) => !prev);
    }
  };

  //Handle Edit Current Tax details
  const handleInputChange = (e, key) => {
    const value = e.target.value;

    setCurrentTaxes((prev) => {
      // Prevent direct editing of 'Total Tax'
      if (key === 'Total Tax' || key === 'Total') {
        return prev;
      }
      // If value hasn't changed, return previous state
      if (prev[key] === value) {
        return prev;
      }
      // Ensure value doesn’t exceed initial
      const initialValue = parseFloat(initialCurrentTaxes[key]) || 0;
      const newValue = parseFloat(value);
      if (newValue > initialValue) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Amount enter should be smaller that current demand');
        return prev;
      }

      // Update the changed field
      const updated = {
        ...prev,
        [key]: value
      };

      // Recalculate Total Tax only if contributing values changed
      const taxFields = [
        'Property',
        'Education',
        'Sp.Educ',
        'Drain',
        'Emp',
        'Tree',
        'Fire',
        'Light',
        'Road',
        'Sanitation',
        'W.Cess',
        'W.Benifit',
        'W.Bill',
        'M.Build',
        'Sewage',
        'Tax1'
      ];

      // Calculate total tax sum
      const totalTax = taxFields.reduce((sum, field) => {
        const fieldVal = parseFloat(updated[field]) || 0;
        return sum + fieldVal;
      }, 0);

      // Only update if Total Tax actually changes
      if (parseFloat(prev['Total Tax']) !== parseFloat(totalTax.toFixed(2))) {
        updated['Total Tax'] = totalTax.toFixed(2);
      }
      const extraCharges = parseFloat(updated['Extra Charges']) || 0;
      const interest = parseFloat(currInt) || 0;
      const noticeFee = parseFloat(updated['Notice Fee']) || 0;
      const discount = parseFloat(updated.Discount || 0);

      // Calculate Total
      const total = totalTax + extraCharges + interest + noticeFee - discount;
      updated['NetTotal'] = total.toFixed(2);

      return updated;
    });
  };

  //Handle Edit pending Tax details
  const handleInputChangePending = (e, key) => {
    const value = e.target.value;

    setPendingTaxes((prev) => {
      // Prevent direct editing of 'Total Tax'
      if (key === 'Total Tax' || key === 'Total') {
        return prev;
      }
      // If value hasn't changed, return previous state
      if (prev[key] === value) {
        return prev;
      }
      // Ensure value doesn’t exceed initial
      const initialValue = parseFloat(initialPendingTaxes[key]) || 0;
      const newValue = parseFloat(value);
      if (newValue > initialValue) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Amount enter should be smaller that current demand');
        return prev;
      }

      // Update the changed field
      const updated = {
        ...prev,
        [key]: value
      };

      // Recalculate Total Tax only if contributing values changed
      const taxFields = [
        'Property',
        'Education',
        'Sp.Educ',
        'Drain',
        'Emp',
        'Tree',
        'Fire',
        'Light',
        'Road',
        'Sanitation',
        'W.Cess',
        'W.Benifit',
        'W.Bill',
        'M.Build',
        'Sewage',
        'Tax1'
      ];

      // Calculate total tax sum
      const totalTax = taxFields.reduce((sum, field) => {
        const fieldVal = parseFloat(updated[field]) || 0;
        return sum + fieldVal;
      }, 0);

      // Only update if Total Tax actually changes
      if (parseFloat(prev['Total Tax']) !== parseFloat(totalTax.toFixed(2))) {
        updated['Total Tax'] = totalTax.toFixed(2);
      }
      const extraCharges = parseFloat(updated['Extra Charges']) || 0;
      const interest = parseFloat(currInt) || 0;
      const noticeFee = parseFloat(updated['Notice Fee']) || 0;
      const discount = parseFloat(updated.Discount || 0);

      // Calculate Total
      const total = totalTax + extraCharges + interest + noticeFee - discount;
      updated['NetTotal'] = total.toFixed(2);

      return updated;
    });
  };

  //handle Other expenses calculations
  useEffect(() => {
    const handleOtherExpenses = async () => {
      if (!ownerID || !year) {
        setOtherExpenses({
          Interest: 0,
          'Extra Charges': 0,
          'Notice Fee': 0,
          Discount: 0,
          'Total Tax': 0,
          'Net Total': 0
        });
        return;
      }
      try {
        const currInterest = parseFloat(currInt || 0);
        const pendInterest = parseFloat(pendInt || 0);
        //const
        const totalInterest = Number(pendInterest) + Number(currInterest) + Number(prevPendInt);
        const currTotalTax = parseFloat(currentTaxes['Total Tax']) || 0;
        const pendTotalTax = parseFloat(pendingTaxes['Total Tax']) || 0;

        const currExtraCharges = parseFloat(currentTaxes['Extra Charges']) || 0;
        const pendExtraCharges = parseFloat(pendingTaxes['Extra Charges']) || 0;

        const currNoticeFee = parseFloat(currentTaxes['Notice Fee']) || 0;
        const pendNoticeFee = parseFloat(pendingTaxes['Notice Fee']) || 0;

        const currDiscount = parseFloat(currentTaxes.Discount) || 0;
        const pendDiscount = parseFloat(pendingTaxes.Discount) || 0;
        const totalPaidAmount = totalPaid.NetTotal;
        // Case 1: Neither editable
        if (!isCurrPaymentType && !isPendPaymentType) {
          setOtherExpenses({
            Interest: 0,
            'Extra Charges': 0,
            'Notice Fee': 0,
            Discount: 0,
            'Total Tax': 0,
            'Net Total': 0
          });
          setAmount(0);

          return;
        }

        // Case 2: Both editable
        else if (isCurrPaymentType && isPendPaymentType) {
          const totalTax = currTotalTax + pendTotalTax;
          const extra = currExtraCharges + pendExtraCharges;
          const notice = currNoticeFee + pendNoticeFee;
          const discount = currDiscount + pendDiscount;
          let netTotal = totalTax + totalInterest + extra + notice - discount;
          setOtherExpenses({
            Interest: totalInterest,
            'Extra Charges': extra,
            'Notice Fee': notice,
            Discount: discount,
            'Total Tax': totalTax,
            'Net Total': netTotal
          });
          setAmount(netTotal);
          setCurrNetTotal(currTotalTax + currInterest);
          setPendNetTotal(pendTotalTax + pendInterest + prevPendInt);
          return;
        }

        // Case 3: Only current editable
        else if (isCurrPaymentType) {
          const currNetTotal = currTotalTax + currInterest + currExtraCharges + currNoticeFee - currDiscount;

          setOtherExpenses({
            Interest: currInterest,
            'Extra Charges': currExtraCharges,
            'Notice Fee': currNoticeFee,
            Discount: currDiscount,
            'Total Tax': currTotalTax,
            'Net Total': currNetTotal
          });
          setAmount(currNetTotal);
          setCurrNetTotal(currTotalTax + currInterest);
          return;
        }

        // Case 4: Only pending editable
        else if (isPendPaymentType) {
          const pendNetTotal = pendTotalTax + pendInterest + pendExtraCharges + pendNoticeFee - pendDiscount;
          setOtherExpenses({
            Interest: pendInterest,
            'Extra Charges': pendExtraCharges,
            'Notice Fee': pendNoticeFee,
            Discount: pendDiscount,
            'Total Tax': pendTotalTax,
            'Net Total': pendNetTotal
          });
          setAmount(pendNetTotal);
          setPendNetTotal(pendTotalTax + pendInterest + prevPendInt);
          return;
        }
      } catch (error) {
        console.error('Error calculating other expenses', error);
      }
    };
    handleOtherExpenses();
  }, [currentTaxes, pendingTaxes, isCurrPaymentType, isPendPaymentType, currInt, pendInt]);

  //handle change for Transaction Date Change
  const handleTransactionDateChange = (newValue) => {
    if (newValue && dayjs(newValue).isAfter(dayjs(), 'day')) {
      setTransactionDate(dayjs());
      setSnackbarSeverity('error');
      setReceivedMessage("Transaction date cannot be greater than today's date");
      setSnackbarOpen(true);
      return;
    }
    setTransactionDate(newValue);
  };

  //To fetch InterestAmounts and AdvancePaid
  useEffect(() => {
    const fetchPaidAmounts = async () => {
      if (ownerID && year && transactionDate) {
        try {
          const response = await getInterestAmounts(ownerID, year, transactionDate);
          const advanceValue = response?.advancePaid || 0;
          const pendInt = response?.pendInterest || 0;
          const currInt = response?.currInterest || 0;
          const currPaidTaxes = response?.currentPaidTaxes || {};
          const pendPaidTaxes = response?.pendingPaidTaxes || {};
          console.log('fetchPaidAmounts', response);
          setAdvancePaid(advanceValue);
          setPenInt(pendInt);
          setCurrInt(currInt);
          setPrevPendInt(pendingTaxes?.Interest || 0);

          setCurrentTaxes((prev = {}) => {
            const updatedTaxes = { ...prev };
            Object.keys(prev).forEach((key) => {
              const currentValue = Number(prev[key] || 0);
              const currPaid = Number(currPaidTaxes[key] || 0);
              updatedTaxes[key] = Math.max(currentValue - currPaid, 0);
            });
            return updatedTaxes;
          });

          setPendingTaxes((prev = {}) => {
            const updatedTaxes = { ...prev };
            Object.keys(prev).forEach((key) => {
              const pendingValue = Number(prev[key] || 0);
              const pendPaid = Number(pendPaidTaxes[key] || 0);
              updatedTaxes[key] = Math.max(pendingValue - pendPaid, 0);
            });
            return updatedTaxes;
          });
          console.log('paid current', currentTaxes);
          console.log('paid pending', pendingTaxes);
          console.log('Advance Paid:', advanceValue);
          console.log('Pending Interest:', pendInt, 'Current Interest:', currInt);
        } catch (error) {
          console.error('Error fetching paid amounts:', error);
        }
      } else {
        // Reset all if no ownerID or year
        setAdvancePaid(0);
        setPenInt(0);
        setCurrInt(0);
        setPrevPendInt(0);
        setCurrentTaxes({});
        setPendingTaxes({});
        setInitialCurrentTaxes({});
        setInitialPendingTaxes({});
      }
    };

    fetchPaidAmounts();
  }, [ownerID, year, transactionDate, showViewTransaction, refreshTaxData]);

  /**Payment Details */
  const isFormValid = () => {
    const { chequeNo, bankName, date, expiryDate } = checkFormData;
    console.log('checkformData', checkFormData);
    return chequeNo.trim() !== '' && bankName.trim() !== '' && date !== null && expiryDate !== null;
  };

  // DD/check/NEFT/RIGS formdata disable for below paymentMode
  const isDisabled = paymentMode === 'Cash' || paymentMode === 'UPI' || paymentMode === '';
  //Payment Details enable if property selected
  const isEditable = property !== '';
  // Enable if paymentMode is UPI
  const isUPI = paymentMode === 'UPI';

  useEffect(() => {
    console.log(isEditable, 'isEditable');
  }, [isEditable]);

  useEffect(() => {
    console.log(paymentMode, 'paymentMode');
  }, [checkFormData.date, checkFormData.expiryDate, empID, paymentMode]);

  //reset below filds if property change
  useEffect(() => {
    setOwnerDetails({
      OldWardNo: '',
      OldPropertyNo: '',
      OldPartitionNo: '',
      OwnerName: '',
      OccupierName: '',
      RenterName: '',
      AssessmentNo: ''
    });
    setCurrentTaxes({
      Property: 0,
      Education: 0,
      'Sp.Educ': 0,
      Emp: 0,
      Tree: 0,
      Fire: 0,
      Light: 0,
      Drain: 0,
      Road: 0,
      Sanitation: 0,
      'W.Cess': 0,
      'W.Benifit': 0,
      'W.Bill': 0,
      'M.Build': 0,
      Sewage: 0,
      Tax1: 0,
      Tax2: 0,
      Interest: 0,
      'Total Tax': 0,
      'Extra Charges': 0,
      'Notice Fee': 0,
      Discount: 0,
      NetTotal: 0
    });
    setInitialCurrentTaxes({
      Property: 0,
      Education: 0,
      'Sp.Educ': 0,
      Emp: 0,
      Tree: 0,
      Fire: 0,
      Light: 0,
      Drain: 0,
      Road: 0,
      Sanitation: 0,
      'W.Cess': 0,
      'W.Benifit': 0,
      'W.Bill': 0,
      'M.Build': 0,
      Sewage: 0,
      Tax1: 0,
      Tax2: 0,
      Interest: 0,
      'Total Tax': 0,
      'Extra Charges': 0,
      'Notice Fee': 0,
      Discount: 0,
      NetTotal: 0
    });
    setPendingTaxes({
      Property: 0,
      Education: 0,
      'Sp.Educ': 0,
      Emp: 0,
      Tree: 0,
      Fire: 0,
      Light: 0,
      Drain: 0,
      Road: 0,
      Sanitation: 0,
      'W.Cess': 0,
      'W.Benifit': 0,
      'W.Bill': 0,
      'M.Build': 0,
      Sewage: 0,
      Tax1: 0,
      Tax2: 0,
      Interest: 0,
      'Total Tax': 0,
      'Extra Charges': 0,
      'Notice Fee': 0,
      Discount: 0,
      NetTotal: 0
    });
    setInitialPendingTaxes({
      Property: 0,
      Education: 0,
      'Sp.Educ': 0,
      Emp: 0,
      Tree: 0,
      Fire: 0,
      Light: 0,
      Drain: 0,
      Road: 0,
      Sanitation: 0,
      'W.Cess': 0,
      'W.Benifit': 0,
      'W.Bill': 0,
      'M.Build': 0,
      Sewage: 0,
      Tax1: 0,
      Tax2: 0,
      Interest: 0,
      'Total Tax': 0,
      'Extra Charges': 0,
      'Notice Fee': 0,
      Discount: 0,
      NetTotal: 0
    });
    setTotalPaid({
      Property: 0,
      Education: 0,
      'Sp.Educ': 0,
      Emp: 0,
      Tree: 0,
      Fire: 0,
      Light: 0,
      Drain: 0,
      Road: 0,
      Sanitation: 0,
      'W.Cess': 0,
      'W.Benifit': 0,
      'W.Bill': 0,
      'M.Build': 0,
      Sewage: 0,
      Tax1: 0,
      Interest: 0,
      'Extra Charges': 0,
      'Notice Fee': 0,
      Discount: 0,
      'Total Tax': 0,
      Total: 0
    });
    setFormData({
      chequeNo: '',
      name: '',
      bankName: '',
      branchName: '',
      ifsc: '',
      amount: '',
      date: null,
      expiryDate: null
    });
    setOtherExpenses({ Interest: 0, 'Extra Charges': 0, 'Notice Fee': 0, Discount: 0, 'Total Tax': 0, 'Net Total': 0 });
    setAmount(0);
    setPaymentMode('');
    setBillNo('');
    setBillDate(null);
    setTransactionDate(dayjs());
    setRemark('');
    setTransactionId('');
  }, [property]);

  //handle change for Bill Date Change
  const handleBillDateChange = (newValue) => {
    if (newValue && dayjs(newValue).isAfter(dayjs(), 'day')) {
      setBillDate(null);
      setSnackbarSeverity('error');
      setReceivedMessage("Bill Date cannot be greater than today's date");
      setSnackbarOpen(true);
      return;
    }
    setBillDate(dayjs(newValue));
  };
  //Handle function for DD/check/NEFT/RIGS formdata
  const handleCheckData = async (eventOrValue, fieldName = null) => {
    let name, value;

    if (typeof eventOrValue === 'string') {
      // Case: Autocomplete or manual call
      name = fieldName;
      value = eventOrValue;
    } else {
      // Case: Normal input
      name = eventOrValue.target.name;
      value = eventOrValue.target.value;
    }

    const alphabetOnlyFields = ['name', 'branchName', 'bankName'];
    if (alphabetOnlyFields.includes(name) && !/^[a-zA-Z\s]*$/.test(value)) return;

    if (name === 'chequeNo' && !/^\d{0,6}$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Handle function to open dialog box to cancel invoice
  const handleCancelClick = () => {
    if (!billBookNo) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select the  Bill Book No');
      return;
    }
    if (!invoiceNo) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please select invoice no.');
      return;
    }

    setOpenCancelDialog(true);
  };

  //Handle function to Cancel invoice No
  const handleCancelConfirm = async () => {
    try {
      if (!year) {
        setSnackbarSeverity('error');
        setReceivedMessage('Please select financial year.');
        setSnackbarOpen(true);
        return;
      }
      if (!cancelReason) {
        setSnackbarSeverity('error');
        setReceivedMessage('Please Add Reason to cancel Invoice.');
        setSnackbarOpen(true);
        return;
      }
      const res = await cancelInvoiceNo(year, billBookNo, invoiceNo, cancelReason);

      if (res.status === 200) {
        setSnackbarSeverity('success');
        setReceivedMessage(`${res.message}` || 'Invoice No cancelled successfully');
      } else if (res.status === 409) {
        setSnackbarSeverity('warning');
        setReceivedMessage(`${res.message}` || 'Invoice No already cancelled');
      } else {
        setSnackbarSeverity('error');
        setReceivedMessage(`${res.message}` || 'Error cancelling invoice number');
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error('Unexpected error while cancelling invoice:', error);
      setSnackbarSeverity('error');
      setReceivedMessage('Unexpected error occurred. Please try again later.');
      setSnackbarOpen(true);
    } finally {
      setOpenCancelDialog(false);
      setInvoiceNo('');
      setBillBookNo('');
    }
  };

  //Payment Mode list hardcoded
  const paymentLabels = {
    1: 'Cash',
    2: 'Cheque',
    3: 'DD',
    4: 'UPI',
    5: 'NEFT',
    6: 'RIGS',
    7: 'Card'
  };

  //Handle payment mode change
  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value); // store label directly
    console.log('paymentMode selected:', event.target.value);
  };
  //Handle TransactionId change
  const handleTransactionId = (e) => {
    const value = e.target.value;
    const validPattern = /^[A-Za-z0-9._-]*$/;
    if (validPattern.test(value) || value === '') {
      setTransactionId(value);
    }
  };
  //Handle to change mobile no and set
  const handleChangeMobNo = (e) => {
    let value = e.target.value;

    // Always ensure it starts with +91
    if (!value.startsWith('+91')) {
      value = '+91' + value.replace(/^\+91/, '');
    }

    // Remove all non-digits except +
    value = '+91' + value.slice(3).replace(/\D/g, '');

    // Limit to +91 + 10 digits = total 13 chars
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    setMobileNo(value);
    if (value < 13) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Invalid Mobile Number.check number of digits');
      return;
    }
  };

  // Move cursor to the end (after +91)
  const handleFocus = () => {
    const input = inputRef.current;
    if (input) {
      setTimeout(() => {
        input.setSelectionRange(mobileNo.length, mobileNo.length);
      }, 0);
    }
  };

  //Handle function to close password dialog box
  const handleClosePassDialog = async () => {
    setAllowDupInvoice(false);
    setPassword('');
  };
  // Handle Password Check
  const handleCheckPassword = async () => {
    try {
      const res = await levelPassword(levelname, password);

      if (res.response.status === 200) {
        // Password valid → close dialog & proceed to save
        handleClosePassDialog();
        await savePayment(paymentsToSaveOnDup);
        setPaymentsToSaveOnDup([]);
      } else {
        // Invalid password
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Invalid Password! Please try again.');
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Error verifying password.');
    }
  };

  // Prepares data for save tax payment records
  const handleSaveTaxPayment = async () => {
    setOpenSaveDialog(false);
    try {
      // 1️⃣ Required fields check
      if (!year) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select Financial Year');
        return;
      }
      if (!property) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select Property');
        return;
      }
      if (!billBookNo) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select Bill book No');
        return;
      }
      if (!invoiceNo) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select invoice number');
        return;
      }
      if (!isCurrPaymentType && !isPendPaymentType) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select Current or Pending Tax');
        return;
      }
      if (amount === 0) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Demand is 0 now');
        return;
      }
      if (!transactionDate) {
        setSnackbarOpen(true);
        setSnackbarSeverity('warning');
        setReceivedMessage('Please Select Transaction Date');
        return;
      }
      if (transactionDate) {
        const isToday = dayjs(transactionDate).isSame(dayjs(), 'day');
        if (isToday) {
          setSnackbarSeverity('warning');
          setReceivedMessage('The selected transaction date matches today’s date.');
          setSnackbarOpen(true);
        }
      }
      if (!billNo) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select Bill No');
        return;
      }
      if (!billDate) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select Bill Date');
        return;
      }
      if (!paymentMode) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select payment mode');
        return;
      }
      if (paymentMode === 'UPI' && transactionId == '') {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please fill the TransactionID of UPI payment');
        return;
      }
      if (
        (paymentMode === 'Cheque' || paymentMode === 'DD' || paymentMode === 'NEFT' || paymentMode === 'RIGS' || paymentMode === 'Card') &&
        !isFormValid()
      ) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(`Please fill the ${paymentMode}required fields`);
        return;
      }

      const commonData = {
        wardNo,
        propertyNo: property,
        ownerID,
        BillBookNo: billBookNo,
        year,
        paymentMode,
        billNo,
        mobileNo,
        remark,
        billDate,
        invoiceNo,
        empID,
        transactionId,
        transactionDate,
        amount,
        PaymentResource: 'Posting',
        ...checkFormData
      };

      // 2️⃣ Prepare payments dynamically
      const paymentsToProcess = [];

      if (isCurrPaymentType) {
        const updatedCurrent = {
          ...currentTaxes,
          Interest: currInt,
          NetTotal: currNetTotal,
          ...commonData,
          paymentType: 'Current',
          pendingYear: year
        };

        setCurrentTaxes(updatedCurrent);
        paymentsToProcess.push(updatedCurrent);
      }

      if (isPendPaymentType) {
        const updatedPending = {
          ...pendingTaxes,
          Interest: pendInt + prevPendInt,
          NetTotal: pendNetTotal,
          ...commonData,
          paymentType: 'Pending',
          pendingYear: year - 1
        };

        setPendingTaxes(updatedPending);
        paymentsToProcess.push(updatedPending);
      }

      try {
        // 3️⃣ Check Duplicate Invoice
        const res = await checkDuplicateInvoice(paymentsToProcess);
        console.log('duplicate data', res);

        if (res.status === 409) {
          // Duplicate found → show warning dialog
          setDupInvoiceDialog(true);
          setPaymentsToSaveOnDup(paymentsToProcess);
          return;
        } else if (res.status === 200) {
          // No duplicate → directly save
          await savePayment(paymentsToProcess);
        } else {
          // Other status codes
          console.warn('Unexpected response:', res.message);
        }
      } catch (error) {
        // Network or unknown error
        console.error('Error while checking duplicate invoice:', error);
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(error.message || 'Network error. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error saving tax payment:', error);
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Unexpected error occurred. Please try again.');
    } finally {
      // Close dialog after processing
      setOpenCancelDialog(false);
    }
  };
  const handleSendForApproval = async () => {
    console.log('selected file', previewUrl)
    try {
      // 1️⃣ Required fields check
      if (!year) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select Financial Year');
        return;
      }
      if (!property) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select Property');
        return;
      }
      if (!billBookNo) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select Bill book No');
        return;
      }
      if (!invoiceNo) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select invoice number');
        return;
      }
      if (!isCurrPaymentType && !isPendPaymentType) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select Current or Pending Tax');
        return;
      }
      if (amount === 0) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Demand is 0 now');
        return;
      }
      if (!transactionDate) {
        setSnackbarOpen(true);
        setSnackbarSeverity('warning');
        setReceivedMessage('Please Select Transaction Date');
        return;
      }
      if (transactionDate) {
        const isToday = dayjs(transactionDate).isSame(dayjs(), 'day');
        if (isToday) {
          setSnackbarSeverity('warning');
          setReceivedMessage('The selected transaction date matches today’s date.');
          setSnackbarOpen(true);
        }
      }
      if (!billNo) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select Bill No');
        return;
      }
      if (!billDate) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select Bill Date');
        return;
      }
      if (!paymentMode) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please select payment mode');
        return;
      }
      if (paymentMode === 'UPI' && transactionId == '') {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please fill the TransactionID of UPI payment');
        return;
      }
      if (
        (paymentMode === 'Cheque' || paymentMode === 'DD' || paymentMode === 'NEFT' || paymentMode === 'RIGS' || paymentMode === 'Card') &&
        !isFormValid()
      ) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(`Please fill the ${paymentMode}required fields`);
        return;
      }

      const commonData = {
        wardNo,
        propertyNo: property,
        ownerID,
        BillBookNo: billBookNo,
        year,
        paymentMode,
        billNo,
        mobileNo,
        remark,
        billDate,
        invoiceNo,
        empID,
        transactionId,
        transactionDate,
        amount,
        PaymentResource: 'Posting',
        proofDetails: base64File,
        ...checkFormData
      };

      // 2️⃣ Prepare payments dynamically
      const paymentsToProcess = [];

      if (isCurrPaymentType) {
        const updatedCurrent = {
          ...currentTaxes,
          Interest: currInt,
          NetTotal: currNetTotal,
          ...commonData,
          paymentType: 'Current',
          pendingYear: year
        };

        setCurrentTaxes(updatedCurrent);
        paymentsToProcess.push(updatedCurrent);
      }

      if (isPendPaymentType) {
        const updatedPending = {
          ...pendingTaxes,
          Interest: pendInt + prevPendInt,
          NetTotal: pendNetTotal,
          ...commonData,
          paymentType: 'Pending',
          pendingYear: year - 1
        };

        setPendingTaxes(updatedPending);
        paymentsToProcess.push(updatedPending);
      }

      try {
        // 3️⃣ Check Duplicate Invoice
         const res = await checkDuplicateInvoice(paymentsToProcess);
      
        if (res.status == 409 || res.data.status == 409) {
          // Duplicate found → show warning dialog
          setDupInvoiceDialog(true);
          setPaymentsToSaveOnDup(paymentsToProcess);
          return;
        } else if (res.status == 200) { 
          // No duplicate → directly save
           const res = await sendForApproval(paymentsToProcess,user);
          if (res.status === 200 && res.data.success) {
            setSnackbarOpen(true);
            setSnackbarSeverity('success');
            setReceivedMessage(res.data.message || 'Sent for approval successfully');
            setBase64File('');
            setPreviewUrl(null);
            handleClear();
      
            setSelectedFile(null);
          } else {
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            setReceivedMessage(res.data.message || 'Error sending for approval');
          }
        } else {
          // Other status codes
          console.warn('Unexpected response:', res.message);
        }
      } catch (error) {
        // Network or unknown error
        console.error('Error while checking duplicate invoice:', error);
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage(error.message || 'Network error. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error sending tax payment details:', error);
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Unexpected error occurred. Please try again.');
    } finally {
      // Close dialog after processing
      setOpenCancelDialog(false);
    }
  };

  // Function to save tax payment records
  const savePayment = async (paymentsToProcess) => {
    console.log('save payment reach', paymentsToProcess);
    const { data, status } = await saveTaxPayment(paymentsToProcess);

    if (status === 200 && data.success) {
      if (isCurrPaymentType) setIsCurrPaymentType((prev) => !prev);
      if (isPendPaymentType) setIsPendPaymentType((prev) => !prev);

      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setReceivedMessage(data.message);
      setRefreshTaxData((prev) => !prev);
    } else {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage(data.message || 'Error saving tax payment');
    }
  };
  //clear the tax payment form
  const handleClear = async () => {
    setFinanceYear('');
    setWardNo('');
    setProperty('');
    setPartition('');
    setOwnerDetails(() => ({
      OldWardNo: '',
      OldPropertyNo: '',
      OldPartitionNo: '',
      OwnerName: '',
      OccupierName: '',
      RenterName: '',
      AssessmentNo: ''
    }));
    setPropertyList([]);
    setBillBookNo('');
    setInvoiceNo('');
    setEmpName('');
    setOwnerID('');
    if (isCurrPaymentType) {
      setIsCurrPaymentType((prev) => !prev);
    }
    if (isPendPaymentType) {
      setIsPendPaymentType((prev) => !prev);
    }

    setPrevPendInt(0);
    setCurrInt(0);
    setPenInt(0);
    setAdvancePaid(0);
    const resetTaxes = {
      Property: 0,
      Education: 0,
      'Sp.Educ': 0,
      Emp: 0,
      Tree: 0,
      Fire: 0,
      Light: 0,
      Drain: 0,
      Road: 0,
      Sanitation: 0,
      'W.Cess': 0,
      'W.Benifit': 0,
      'W.Bill': 0,
      'M.Build': 0,
      Sewage: 0,
      Tax1: 0,
      Tax2: 0,
      Interest: 0,
      'Total Tax': 0,
      'Extra Charges': 0,
      'Notice Fee': 0,
      Discount: 0,
      NetTotal: 0
    };
    setCurrentTaxes(resetTaxes);
    setInitialCurrentTaxes(resetTaxes);
    setInitialPendingTaxes(resetTaxes);
    setPendingTaxes(resetTaxes);
    setTotalPaid(resetTaxes);
    setFormData({
      chequeNo: '',
      name: '',
      bankName: '',
      branchName: '',
      ifsc: '',
      amount: '',
      date: dayjs(),
      expiryDate: dayjs()
    });
    setBillNo('');
    setMobileNo('+91');
    setPaymentMode('');
    setRemark('');
  };

  //Navigate to advance payment
  const handleNavigationToAdvance = () => {
    if (!year) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Finance Year');
      return;
    }
    if (!wardNo) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Ward No');
      return;
    }
    if (!property) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Property No');
      return;
    }

    const netTotalCurr = Number(currentTaxes?.NetTotal || 0);
    const netTotalPend = Number(pendingTaxes?.NetTotal || 0);
    if (netTotalCurr == 0 && netTotalPend == 0) {
      navigate('/amc/advance-payment');
    } else {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please Pay Current/Pending Demand First');
      return;
    }
  };

  //handle function  to navigate from tax Payment page to view Transaction
  const handleTaxPayment = () => {
    if (!year) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Financial year');
      return;
    }
    if (!wardNo) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Ward No');
      return;
    }
    if (!property) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Property No');
      return;
    }

    setShowTaxPayment(!showTaxPayment);
    setShowViewTransaction(!showViewTransaction);
  };

  //handle function  to navigate from view Transaction to tax Payment page
  const handleViewTransaction = () => {
    setShowTaxPayment(!showTaxPayment);
    setShowViewTransaction(!showViewTransaction);
  };

  //fetch all bank names
  const fetchAllBankNames = async () => {
    try {
      const res = await fetchAllBanks();
      console.log('Banks record', res);
      setBankList(res);
    } catch (error) {
      console.error('Error to fetch banks', error);
    }
  };
  useEffect(() => {
    fetchAllBankNames();
  }, []);

  return (
    <>
      {showAccessDialog ? (
        <Dialog open={true} maxWidth="xs" fullWidth>
          <DialogTitle>{accessLevel === 1 ? 'No Access' : 'View Only Access'}</DialogTitle>
          <DialogContent>
            <Typography>
              {accessLevel === 1
                ? 'You do not have permission to access this page.'
                : 'You have view-only access. Editing or saving changes is not allowed.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                if (accessLevel === 1) {
                  handleRedirect();
                } else {
                  setShowAccessDialog(false);
                }
              }}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <>
          {showTaxPayment ? (
            <>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <SnackbarContent
                  sx={{
                    backgroundColor: snackbarSeverity === 'success' ? 'green' : snackbarSeverity === 'warning' ? 'grey' : 'red'
                  }}
                  message={receivedMessage}
                />
              </Snackbar>

              <MainCard title="Tax Payment">
                <MainCard>
                  <Grid container spacing={2.4}>
                    <Grid item xs={12} sm={1.8}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>*</span> Finance Year
                        </InputLabel>
                        <Select
                          id="year-select"
                          value={year}
                          onChange={handleFinanceYearChange}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                          disabled={accessLevel < 3}
                        >
                          {/* {financeyearList.map((year, index) => (
                          <MenuItem key={index} value={year}>
                            {year}-{year + 1}
                          </MenuItem>
                        ))} */}
                          {/* Add a "None" option */}
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {yearTrans.map((financeYear, index) => (
                            <MenuItem key={index} value={financeYear.FinanceYear}>
                              {financeYear.FinanceYear}-{financeYear.FinanceYear + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.7}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>*</span> Select Ward
                        </InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="ward-select"
                            value={wardNo}
                            placeholder="ward no"
                            onChange={handleWardChange}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                            disabled={accessLevel < 3}
                          >
                            {wardList.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.7}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>*</span> Property No
                        </InputLabel>
                        <Autocomplete
                          options={propertyList}
                          getOptionLabel={(option) => String(option?.NewPropertyNo ?? ' ')}
                          //isOptionEqualToValue={(a, b) => a.NewPropertyNo === b.NewPropertyNo}
                          value={propertyList.find((p) => p.NewPropertyNo === property) || null}
                          onChange={handlePropertyChange}
                          // open automatically on focus and via the dropdown icon
                          forcePopupIcon
                          openOnFocus
                          // keep Autocomplete uncontrolled for input & popup;
                          // we still filter by the user's typed text
                          filterOptions={(options, state) => {
                            const q = String(state.inputValue ?? '').trim();
                            if (!q) return options; // show all when empty
                            return options.filter((o) => String(o?.NewPropertyNo ?? '').startsWith(q));
                          }}
                          renderOption={(props, option) => {
                            props.key = option.NewWardNo;
                            return <li {...props}>{label(option)}</li>;
                          }}
                          renderInput={(params) => <TextField {...params} variant="outlined" disabled={accessLevel < 3} />}
                          ListboxProps={{ style: { maxHeight: 150, overflowY: 'auto' } }}
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.7}>
                      <Stack spacing={1}>
                        <InputLabel>Partition No</InputLabel>
                        <TextField
                          value={partition}
                          placeholder="Partition No"
                          variant="outlined"
                          InputProps={{
                            readOnly: true
                          }}
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.7}>
                      <Stack spacing={1}>
                        <InputLabel>Old Ward</InputLabel>
                        <TextField required value={ownerDetails.OldWardNo} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={1.7}>
                      <Stack spacing={1}>
                        <InputLabel>Old Property No</InputLabel>
                        <TextField required value={ownerDetails.OldPropertyNo} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={1.7}>
                      <Stack spacing={1}>
                        <InputLabel>Old Partition No</InputLabel>
                        <TextField required value={ownerDetails.OldPartitionNo} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>
                <MainCard>
                  <Grid container spacing={2.4}>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1} direction="row" alignItems="center">
                        <InputLabel>Owner Name</InputLabel>
                      </Stack>
                      <Stack spacing={1} marginTop={1}>
                        <TextField required value={ownerDetails.OwnerName} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel>Occupier Name</InputLabel>

                        <TextField required value={ownerDetails.OccupierName} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel>Renter Name</InputLabel>
                        <TextField required value={ownerDetails.RenterName} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel>Assesment No</InputLabel>
                        <TextField required value={ownerDetails.AssessmentNo} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>

                <MainCard title={'Tax Details:'}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={1.6}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>*</span> Bill Book No
                        </InputLabel>
                        <Select
                          id="billBook-select"
                          value={billBookNo}
                          onChange={handleBillBookNo}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                          disabled={accessLevel < 3}
                        >
                          {billBookNoList.length === 0 ? (
                            <MenuItem disabled>
                              <Typography noWrap sx={{ maxWidth: 200 }}>
                                {year ? (
                                  <>
                                    No Bill Book Numbers <br /> found for this year
                                  </>
                                ) : (
                                  'Select a financial year first'
                                )}
                              </Typography>
                            </MenuItem>
                          ) : (
                            billBookNoList.map((billBookNo, index) => (
                              <MenuItem key={index} value={billBookNo}>
                                {billBookNo}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.6}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>* </span>Invoice No
                        </InputLabel>
                        <Select
                          id="invoice-select"
                          value={invoiceNo}
                          onChange={handleInvoiceNo}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                          disabled={accessLevel < 3}
                        >
                          {invoiceNoList.map((invoiceNo, index) => (
                            <MenuItem key={index} value={invoiceNo}>
                              {invoiceNo}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2.5}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>* </span> Transaction Date
                        </InputLabel>
                      </Stack>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            value={transactionDate}
                            onChange={handleTransactionDateChange}
                            maxDate={dayjs()} // disables selecting future dates
                            disabled={accessLevel < 3}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1} direction={'row'} alignItems="center" marginTop={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isPendPaymentType}
                              onChange={(e) => handleCheckboxClick(e, 'pending')}
                              disabled={accessLevel < 3}
                            />
                          }
                          label={
                            <Box fontWeight="bold" style={{ color: '#ff5252 ' }}>
                              {' '}
                              Pending Tax
                            </Box>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isCurrPaymentType}
                              onChange={(e) => handleCheckboxClick(e, 'current')}
                              disabled={accessLevel < 3}
                            />
                          }
                          label={
                            <Box fontWeight="bold" style={{ color: '#ff5252 ' }}>
                              {' '}
                              Current Tax
                            </Box>
                          }
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.7}>
                      <Stack spacing={1}>
                        <InputLabel>Employee Name </InputLabel>
                        <TextField required value={empName}></TextField>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.6}>
                      <Stack spacing={1}>
                        <InputLabel>OwnerID</InputLabel>
                        <TextField required value={ownerID} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Conditionally render PendingTaxDetails inline if only the Pending Tax checkbox is selected */}
                  {isPendPaymentType && (
                    <Card>
                      <CardContent>
                        <Typography sx={{ mb: 2 }} variant="h5" style={{ color: '#1677FF', mt: 2, fontWeight: 'bold' }}>
                          Pending Tax Detail
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.keys(pendingTaxes)
                            .slice(0, 16)
                            .map((label) => (
                              <Grid item xs={12} sm={1.5} key={label}>
                                <Stack spacing={1}>
                                  <InputLabel>{label}</InputLabel>
                                  <TextField
                                    type="number"
                                    value={pendingTaxes[label]}
                                    disabled={!isPendPaymentType}
                                    onChange={(e) => handleInputChangePending(e, label)}
                                    onFocus={(e) => {
                                      if (e.target.value === '0') {
                                        handleInputChangePending({ target: { value: '' } }, label);
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value === '') {
                                        handleInputChangePending({ target: { value: '0' } }, label);
                                      }
                                    }}
                                    inputProps={{
                                      min: 0,
                                      pattern: '[0-9]*',
                                      inputMode: 'numeric'
                                    }}
                                  />
                                </Stack>
                              </Grid>
                            ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  )}

                  {/* Conditionally render CurrentTaxDetails inline if only the Current Tax checkbox is selected */}
                  {isCurrPaymentType && (
                    <Card>
                      <CardContent>
                        <Typography sx={{ mb: 2 }} variant="h5" style={{ color: '#1677FF', mt: 2, fontWeight: 'bold' }}>
                          Current Tax Detail
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.keys(currentTaxes)
                            .slice(0, 16)
                            .map((label, index) => (
                              <Grid item xs={12} sm={1.5} key={index}>
                                <Stack spacing={1}>
                                  <InputLabel>{label}</InputLabel>
                                  <TextField
                                    required
                                    type="number"
                                    value={currentTaxes[label]}
                                    disabled={!isCurrPaymentType}
                                    onChange={(e) => handleInputChange(e, label)}
                                    onFocus={(e) => {
                                      if (e.target.value === '0') {
                                        handleInputChange({ target: { value: '' } }, label);
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value === '') {
                                        handleInputChange({ target: { value: '0' } }, label);
                                      }
                                    }}
                                    inputProps={{
                                      min: 0,
                                      pattern: '[0-9]*',
                                      inputMode: 'numeric'
                                    }}
                                  />
                                </Stack>
                              </Grid>
                            ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  )}
                </MainCard>
                <MainCard>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel style={{ color: '#ff5252' }}>Previous Pending Interest</InputLabel>

                        <TextField required value={prevPendInt} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel style={{ color: '#ff5252 ' }}>Pending Interest</InputLabel>
                        <TextField required value={pendInt} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel style={{ color: '#ff5252 ' }}>Current Interest</InputLabel>
                        <TextField required value={currInt} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel style={{ color: '#ff5252 ' }}>Advance Paid</InputLabel>
                        <TextField required value={advancePaid} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel style={{ color: '#ff5252 ' }}>Total Paid</InputLabel>
                        <TextField required value={totalPaid.NetTotal || 0} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box marginTop={1} sx={{ textAlign: 'center' }}></Box>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>Interest</InputLabel>
                        <TextField required value={otherExpenses.Interest} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>Extra Charges</InputLabel>
                        <TextField required value={otherExpenses['Extra Charges']} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>Notice Fee</InputLabel>
                        <TextField required value={otherExpenses['Notice Fee']} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>Discount</InputLabel>
                        <TextField required value={otherExpenses.Discount} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>Total Tax</InputLabel>
                        <TextField required value={otherExpenses['Total Tax']} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>Net Total</InputLabel>
                        <TextField required value={otherExpenses['Net Total']} disabled={accessLevel < 3} />
                      </Stack>
                    </Grid>
                  </Grid>
                </MainCard>

                <Box marginTop={1} sx={{ textAlign: 'center' }}></Box>
                <MainCard title="Balance Sheet">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel style={{ color: '#ff5252 ' }}>Custom Current</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel style={{ color: '#ff5252 ' }}> Custom Pending</InputLabel>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box marginTop={2} sx={{ textAlign: 'center' }}>
                    <div style={{ width: '100%', borderBottom: '1px solid gray', margin: '10px auto' }} />
                  </Box>

                  <Box sx={{ overflowX: 'auto', height: 350, width: '100%' }}>
                    <Table sx={{ minWidth: 650 }} className="table table-striped table-bordered nowrap">
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          {columnOrder.map((col, idx) => (
                            <TableCell key={idx}>{col}</TableCell>
                          ))}
                          <TableCell>Net Total:</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Current Taxes */}
                        <TableRow className="text-center">
                          <TableCell className="font-weight-bold mx-2">C</TableCell>
                          {columnOrder.map((col, idx) => (
                            <TableCell key={idx}>{currentTaxes[col] || 0}</TableCell>
                          ))}
                          <TableCell>{currentTaxes.NetTotal || 0}</TableCell>
                        </TableRow>

                        {/* Pending Taxes */}
                        <TableRow className="text-center">
                          <TableCell className="font-weight-bold mx-2">P</TableCell>
                          {columnOrder.map((col, idx) => (
                            <TableCell key={idx}>{pendingTaxes[col] || 0}</TableCell>
                          ))}
                          <TableCell>{pendingTaxes.NetTotal || 0}</TableCell>
                        </TableRow>

                        {/* Total Taxes (C + P) */}
                        <TableRow className="text-center">
                          <TableCell className="font-weight-bold mx-2">TT</TableCell>
                          {columnOrder.map((col, idx) => {
                            const currentVal = Number(currentTaxes[col]) || 0;
                            const pendingVal = Number(pendingTaxes[col]) || 0;
                            return <TableCell key={idx}>{currentVal + pendingVal}</TableCell>;
                          })}
                          <TableCell>{Number(currentTaxes.NetTotal || 0) + Number(pendingTaxes.NetTotal || 0)}</TableCell>
                        </TableRow>

                        {/* Total Paid */}
                        <TableRow className="text-center">
                          <TableCell className="font-weight-bold mx-2">TP</TableCell>
                          {columnOrder.map((col, idx) => (
                            <TableCell key={idx}>{Number(totalPaid[col]) || 0}</TableCell>
                          ))}
                          <TableCell>{totalPaid.NetTotal || 0}</TableCell>
                        </TableRow>

                        {/* Net Balance */}
                        <TableRow className="text-center">
                          <TableCell sx={{ color: '#ff5252' }}>PN</TableCell>
                          {columnOrder.map((col, idx) => {
                            const total = (Number(currentTaxes[col]) || 0) + (Number(pendingTaxes[col]) || 0);
                            const paid = Number(totalPaid[col]) || 0;
                            const netBal = total - paid < 0 ? 0 : total - paid;
                            return (
                              <TableCell key={idx} sx={{ color: '#ff5252' }}>
                                {netBal}
                              </TableCell>
                            );
                          })}
                          <TableCell sx={{ color: '#ff5252' }}>
                            {Math.max(
                              0,
                              Number(currentTaxes.NetTotal || 0) + Number(pendingTaxes.NetTotal || 0) - Number(totalPaid.NetTotal || 0)
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </MainCard>
                <Box marginTop={2} sx={{ textAlign: 'center' }}>
                  <div style={{ width: '100%', borderBottom: '1px solid gray', margin: '10px auto' }} />
                </Box>
                <MainCard title={'Payment Details'}>
                  <Grid container spacing={1.5} direction={'row'}>
                    <Grid item xs={12} sm={1}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>* </span>Bill No
                        </InputLabel>
                        <TextField
                          required
                          value={billNo}
                          disabled={!isEditable} // Disable if property number is not selected
                          onChange={(e) => setBillNo(e.target.value)}
                          onFocus={(e) => {
                            if (e.target.value === '0') {
                              handleInputChange({ target: { value: '' } }, 'billNo');
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              handleInputChange({ target: { value: '0' } }, 'billNo');
                            }
                          }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2.3}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>* </span>Bill Date
                        </InputLabel>
                      </Stack>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            value={billDate}
                            onChange={handleBillDateChange}
                            maxDate={dayjs()}
                            disabled={accessLevel < 3 || !isEditable} // Disable if property number is not selected
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={2.4}>
                      <Stack spacing={1}>
                        <InputLabel>Mobile No</InputLabel>
                        <TextField
                          required
                          name="MobileNo"
                          inputRef={inputRef}
                          value={mobileNo}
                          onChange={handleChangeMobNo}
                          onFocus={handleFocus}
                          disabled={accessLevel < 3}
                          inputProps={{
                            maxLength: 13,
                            inputMode: 'numeric',
                            pattern: '[0-9+]*'
                          }}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.3}>
                      <Stack spacing={1}>
                        <InputLabel>
                          <span style={{ color: 'red' }}>* </span>Payment Mode
                        </InputLabel>
                        <Select
                          id="payment-select"
                          value={paymentMode} // the label
                          onChange={handlePaymentModeChange}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                          disabled={!isEditable || accessLevel < 3}
                        >
                          {Object.values(paymentLabels).map((label) => (
                            <MenuItem key={label} value={label}>
                              {label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={1.6}>
                      <Stack spacing={1}>
                        <InputLabel> Amount</InputLabel>
                        <TextField
                          required
                          name="amount"
                          value={otherExpenses['Net Total']}
                          onChange={handleCheckData}
                          disabled={accessLevel < 3 || !isEditable}
                          type="number"
                          inputProps={{
                            min: 0,
                            pattern: '[0-9]*',
                            inputMode: 'numeric'
                          }}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2.5}>
                      <Stack direction={'row'} spacing={1} marginTop={3.5}>
                        <Stack spacing={1}>
                          <Button
                            variant="contained"
                            color="info"
                            onClick={handleTaxPayment}
                            sx={{ width: '150px' }}
                            disabled={accessLevel < 3}
                          >
                            View Transaction
                          </Button>
                        </Stack>
                        <Stack spacing={1}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCancelClick}
                            sx={{ width: '150px' }}
                            disabled={accessLevel < 3}
                          >
                            Cancel Receipt
                          </Button>

                          <Dialog
                            open={openCancelDialog}
                            onClose={() => setOpenCancelDialog(false)}
                          // PaperProps={{
                          //   sx: {
                          //     width: 300, // increase width
                          //     height: 250, // increase height

                          //     overflow: 'hidden' // prevent scrollbars
                          //   }
                          // }}
                          >
                            <DialogTitle>Cancel Invoice</DialogTitle>
                            <DialogContent>
                              <p>Do you want to cancel this Invoice No.?</p>
                              <InputLabel>Reason</InputLabel>
                              <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="reason"
                                type="text"
                                // multiline
                                fullWidth
                                variant="outlined"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={() => {
                                  if (!cancelReason.trim()) {
                                    // ✅ Show Snackbar Error instead of inline error
                                    setSnackbarOpen(true);
                                    setSnackbarSeverity('error');
                                    setReceivedMessage('Please enter a reason for cancellation');
                                    return;
                                  }

                                  // Call your confirm handler with reason
                                  handleCancelConfirm(cancelReason);

                                  // Reset states
                                  setCancelReason('');
                                  setOpenCancelDialog(false);
                                }}
                                color="primary"
                              >
                                Confirm
                              </Button>
                              <Button onClick={() => setOpenCancelDialog(false)} color="secondary">
                                Cancel
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid container spacing={2}></Grid>
                    <Grid item xs={12} sm={8}>
                      <Stack spacing={1}>
                        <InputLabel>Remark</InputLabel>
                        <TextField
                          required
                          value={remark}
                          disabled={!isEditable || accessLevel < 3} // Disable if property number is not selected
                          onChange={(e) => setRemark(e.target.value)}
                        />
                      </Stack>
                    </Grid>
                    {paymentMode === 'UPI' && (
                      <Grid item xs={12} sm={3}>
                        <Stack spacing={1}>
                          <InputLabel>
                            <span style={{ color: 'red' }}>* </span>Transaction ID
                          </InputLabel>
                          <TextField
                            required
                            name="transaction-id"
                            value={transactionId}
                            onChange={handleTransactionId}
                            disabled={accessLevel < 3 || !isUPI}
                            inputProps={{
                              maxLength: 20,
                              inputMode: 'text',
                              pattern: '[A-Za-z0-9._-]*',
                              title: 'Only letters, numbers, dots, underscores, or hyphens allowed'
                            }}
                          />
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                  <Box marginTop={1} sx={{ textAlign: 'center' }}></Box>
                  {/* {conditionaly} */}
                  {(paymentMode === 'Cheque' ||
                    paymentMode === 'DD' ||
                    paymentMode === 'NEFT' ||
                    paymentMode === 'RIGS' ||
                    paymentMode === 'Card') && (
                      <MainCard title="DD/Cheque Details">
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>
                                <span style={{ color: 'red' }}>* </span>DD/Cheque No
                              </InputLabel>
                              <TextField
                                required
                                type="number"
                                name="chequeNo"
                                value={checkFormData.chequeNo}
                                onChange={handleCheckData}
                                disabled={accessLevel < 3 || isDisabled || !isEditable}
                                inputProps={{
                                  min: 0,
                                  pattern: '[0-9]*',
                                  inputMode: 'numeric',
                                  maxLength: 6
                                }}
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>Name</InputLabel>

                              <TextField
                                required
                                name="name"
                                value={checkFormData.name}
                                onChange={handleCheckData}
                                disabled={accessLevel < 3 || isDisabled || !isEditable}
                                inputProps={{
                                  pattern: '[a-zA-Zs]*'
                                }}
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>
                                <span style={{ color: 'red' }}>* </span>Bank Name
                              </InputLabel>
                              <Autocomplete
                                freeSolo
                                options={bankList.map((b) => b.BankName)}
                                value={checkFormData.bankName}
                                onInputChange={(e, newValue) => handleCheckData(newValue, 'bankName')}
                                disabled={accessLevel < 3 || isDisabled || !isEditable}
                                renderInput={(params) => <TextField {...params} required />}
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>Branch Name</InputLabel>
                              <TextField
                                required
                                name="branchName"
                                value={checkFormData.branchName}
                                onChange={handleCheckData}
                                disabled={accessLevel < 3 || isDisabled || !isEditable}
                                inputProps={{
                                  pattern: '[a-zA-Zs]*'
                                }}
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>Bank IFSC No</InputLabel>
                              <TextField
                                required
                                name="ifsc"
                                value={checkFormData.ifsc}
                                onChange={handleCheckData}
                                disabled={accessLevel < 3 || isDisabled || !isEditable}
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>
                                <span style={{ color: 'red' }}>* </span>Date
                              </InputLabel>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  value={checkFormData.date}
                                  onChange={(newValue) => setFormData({ ...checkFormData, date: newValue })}
                                  disabled={accessLevel < 3 || isDisabled || !isEditable}
                                />
                              </LocalizationProvider>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>
                                <span style={{ color: 'red' }}>* </span>Expiry Date
                              </InputLabel>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  value={checkFormData.expiryDate}
                                  onChange={(newValue) => setFormData({ ...checkFormData, expiryDate: newValue })}
                                  disabled={accessLevel < 3 || isDisabled || !isEditable}
                                />
                              </LocalizationProvider>
                            </Stack>
                          </Grid>
                        </Grid>
                      </MainCard>
                    )}

                  <Grid item>
                    <MainCard
                      sx={{
                        height: 'auto',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      {user?.role === 'AMC Employee' && (
                        <Grid item sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">

                            {/* Upload Button */}
                            <Button variant="outlined" component="label">
                              {selectedFile ? selectedFile.name : "Upload PDF / Image"}

                              <input
                                type="file"
                                hidden
                                accept="application/pdf,image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  setSelectedFile(file);
                                  setPreviewUrl(URL.createObjectURL(file));

                                  // Convert to Base64
                                  const base64 = await convertFileToBase64(file);
                                  setBase64File(base64); // store base64 string
                                }}
                              />
                            </Button>


                            {/* Preview Button */}
                            <Button
                              variant="contained"
                              color='success'
                              disabled={!selectedFile}
                              onClick={() => setPreviewOpen(true)}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="contained"
                              color='error'
                              disabled={!selectedFile}
                              onClick={() => setSelectedFile(null)}
                            >
                              Remove
                            </Button>

                          </Stack>
                        </Grid>
                      )}

                      <Dialog
                        open={previewOpen}
                        onClose={() => setPreviewOpen(false)}
                        maxWidth="md"
                        fullWidth
                      >
                        <DialogTitle>File Preview</DialogTitle>
                        <DialogContent>
                          {selectedFile?.type === 'application/pdf' ? (
                            <iframe
                              src={previewUrl}
                              width="100%"
                              height="500px"
                              title="PDF Preview"
                            />
                          ) : (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              style={{ width: '100%', maxHeight: '500px' }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>





                      <Grid container spacing={3} justifyContent="center" alignItems="center">
                        {/* Save Button with Snackbar */}
                        <Grid item>
                          <Stack spacing={1} alignItems="center">
                            {/* --- SAVE BUTTON --- */}
                            <Button variant="contained" color={user?.role == 'AMC Employee' ? 'primary' : 'success'} onClick={user?.role == 'AMC Employee' ? handleSendForApproval : () => setOpenSaveDialog(true)} disabled={accessLevel < 3}>
                              {user?.role == 'AMC Employee' ? 'Send For Approval' : 'Save'}
                            </Button>

                            {/* --- SAVE DIALOG --- */}
                            <Dialog
                              open={openSaveDialog}
                              onClose={() => setOpenSaveDialog(false)}
                              PaperProps={{
                                sx: {
                                  width: 300,
                                  height: 200,
                                  overflow: 'hidden'
                                }
                              }}
                            >
                              <DialogTitle>Save Tax Payment</DialogTitle>
                              <DialogContent>
                                <p>Do you want to Save Tax Payment?</p>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleSaveTaxPayment} variant="contained" color="primary">
                                  Confirm
                                </Button>
                                <Button onClick={() => setOpenSaveDialog(false)} variant="contained" color="secondary">
                                  Cancel
                                </Button>
                              </DialogActions>
                            </Dialog>

                            {/* DUPLICATE INVOICE WARNING */}
                            <Dialog
                              open={dupInvoiceDialog}
                              onClose={() => setDupInvoiceDialog(false)}
                              PaperProps={{ sx: { width: 300, height: 200, overflow: 'hidden' } }}
                            >
                              <DialogContent>
                                <p>⚠️ Warning! Duplicate Invoice No. Found. Continue?</p>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    setLevelName('L2');
                                    setDupInvoiceDialog(false);
                                    setAllowDupInvoice(true); // show password dialog
                                  }}
                                >
                                  Yes
                                </Button>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => {
                                    setDupInvoiceDialog(false);
                                    setAllowDupInvoice(false);
                                  }}
                                >
                                  No
                                </Button>
                              </DialogActions>
                            </Dialog>

                            {/* PASSWORD DIALOG */}
                            <Dialog open={allowDupInvoice} onClose={handleClosePassDialog} fullWidth maxWidth="xs">
                              <DialogTitle>{levelname}</DialogTitle>
                              <DialogContent>
                                <DialogContentText>Enter Security Password</DialogContentText>
                                <TextField
                                  required
                                  fullWidth
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  autoComplete="new-password"
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={async () => {
                                    await handleCheckPassword();
                                  }}
                                >
                                  Ok
                                </Button>
                                <Button variant="contained" color="secondary" onClick={handleClosePassDialog}>
                                  Cancel
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Stack>
                        </Grid>

                        {/* --- CLEAR BUTTON --- */}
                        <Grid item>
                          <Button variant="contained" color="secondary" onClick={handleClear}>
                            Clear
                          </Button>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>

                  <Grid container spacing={3} justifyContent={'center'} alignItems={'center'}>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <Button variant="contained" color="secondary" onClick={handleNavigationToAdvance} disabled={accessLevel < 3}>
                          Take Advance Payment
                        </Button>
                      </Stack>
                    </Grid>
                    {/* 
                    <Grid item xs={12} sm={4} marginBottom={1}>
                      <Stack spacing={2} direction="row" alignItems="center">
                        <label
                          style={{
                            fontSize: '18px',
                            color: '#1677ff',
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            marginTop: 16
                          }}
                        >
                          <input  disabled={accessLevel < 3} />
                          Attach Document
                        </label>
                        <Chip
                          sx={{
                            mt: 2,
                            ml: 1,
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          label="1"
                          color="error"
                          size="small"
                        />
                      </Stack>
                    </Grid> */}
                  </Grid>
                </MainCard>
              </MainCard>
            </>
          ) : null
          }
          {
            showViewTransaction ? null : (
              <FromViewTransTaxPayment
                ViewButton={handleViewTransaction}
                ownerData={ownerData}
                allBillBookData={allBillBookData}
                invoiceNoList={invoiceNoList}
                empName={empName}
                totalPaid={totalPaid}
                setTotalPaid={setTotalPaid}
              />
            )
          }
        </>
      )}
    </>
  );
}
export default TaxPayment;
