// material-ui

import {
  Checkbox,
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Typography,
  MenuItem,
  Select,
  Stack,
  Button,
  TextField,
  InputAdornment,
  TextareaAutosize,
  InputLabel,
  ListItemText
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useState ,useEffect} from 'react';
// eslint-disable-next-line no-restricted-imports
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers';
import { getZoneMasterList } from 'services/masterServices/zone-master-services.js/zone-master-services';
import { getBankList, getBillBookNos, getPaymentModes } from 'services/paymentServices/offlinePaymentService/offlinePaymentService';
import { useSelector } from 'react-redux';
import { getBillBookYearRange } from 'services/Amc/SetRemarkInvoiceService/setReamarkInvoiceService';
import { fetchWardNo } from 'services/wardnumber.services';
import { fetchAllBillBookList, fetchAllReport, fetchBillBookUsers, fetchCollectionPercentageChartReport, fetchCollectionReportWithSubReportType, fetchCommonReport,fetchDaywiseCollectionReport, fetchGatewayPaymentReport, fetchTaxPerformanceReport, fetchTransactionChallanTransferFeeReport, fetchWardwiseDailyReport, fetchWardwiseUserwiseInvoiceReport } from 'services/report/collection-report-service/collectionReportService';
import { getApplicationSetting } from 'services/AdminPanel/applicationSettingService';

function CollectionReport() {
  const ReportArray = [
    { label: 'ALL', subMenu: [] },
    {
      label: 'Collection Details',
      subMenu: [
        'All Summary',
        'Cancellation',
        'Properties Newly Added',
        'Properties Updated Owner data',
        'Properties updated from Mutation',
        'Properties for pending taxes newly added',
        'Cheque Clearance report',
        'Payment Modewise Collection Summary',
        'TransferFee'
      ]
    },
    {
      label: 'Collection Gross',
      subMenu: []
    },
    {
      label: 'Demand Details',
      subMenu: []
    },
    {
      label: 'Demand Gross',
      subMenu: []
    },
    {
      label: 'Outstanding Details',
      subMenu: []
    },
    {
      label: 'Outstanding Gross',
      subMenu: []
    },
    {
      label: 'Transaction Report',
      subMenu: ['All ', 'Successful', 'Failed', 'Partially Passed', 'Refund Transactions', 'Need To Refund', 'Need To Make Payment']
    },
    {
      label: 'Challan',
      subMenu: ['ALL ', 'Ward Wise ', 'Ward Wise Summary']
    },
    {
      label: 'Wardwise/UserwiseInvoice Report',
      subMenu: []
    },
    {
      label: 'Daywise Collection Report',
      subMenu: []
    },
    {
      label: 'Getway Payment Report',
      subMenu: []
    },
    {
      label: 'ClerkwiseReport',
      subMenu: ['ALL', 'Ward Wise']
    },
    {
      label: 'TaxCollectionWise&PaymentWiseCollection Report',
      subMenu: []
    },
    {
      label: 'Wardwise Daily Report',
      subMenu: []
    },
    {
      label: 'Collection Percentage Chart Report',
      subMenu: []
    },
    {
      label: 'Tax Collector Performance Report',
      subMenu: []
    },
    {
      label: 'Transfer Fee Collection',
      subMenu: []
    },
    {
      label: 'Counter Foil',
      subMenu: []
    }
  ];
  const payResourceOptions = [
  { id: 1, label: "NTIS" },
  { id: 2, label: "Counter Payment" },
  { id: 3, label: "Online" }
];


// const handleResourceChange = (event) => {
//   setPayResource(event.target.value);
// };

  //const wardList = ['All', '1', '2', '3', '4', '5', 'D_1', 'D_2', 'D_3'];
  //const counterUserArray = ['------Select-----', 'Administrator', 'Vinod ubale', 'Pramode pawar', 'amrut bhavar'];
  const payModeArray = ['---Select---', 'Card Payment', 'Cash', 'Cheque', 'DD', 'NEFT', 'Online', 'RTGS'];

  const [report, setReport] = useState(ReportArray[0].label); // Set default value to the first element of ReportArray
  const [subReport, setSubReport] = useState('');

  const [selectedZone, setSelectedZone] = useState(0);
  const [payResource, setPayResource] = useState([]);

  const [payMode, setPayMode] = useState([]);
  const [counterUser, setCounterUser] = useState([]);
   const[selectedUser,setSelectedUser]=useState([])
  const [selectedBillBook, setSelectedBillBook] = useState(0);
  const [financeYear, setFinanceYear] = useState(0);
  const [payOption, setPayOption] = useState(0);
  const [status, setStatus] = useState(0);
  const [getwayStatus, setGetwayStatus] = useState(0);
  const [payType, setPayType] = useState(0);

  const [counterReceipt, setCounterReceipt] = useState(0);
  const [totalCollection, setTotalCollection] = useState(0);

  //Datepicker state
  const [fromValue, setFromValue] = useState(null);

    const [toValue, setToValue] = useState(null);


    const [fromDayWiseValue, setFromDayWiseValue] = useState(null);

    const [toDayWiseValue, setToDayWiseValue] = useState(null);



  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCounterReceiptChange = (option) => {
    setCounterReceipt(option === counterReceipt ? '' : option);
  };
  const handletotalCollectionChange = (option) => {
    setTotalCollection(option === totalCollection ? '' : option);
  };
 const handlePayModeChange = (event) => {
  setPayMode(event.target.value);
};


  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(value)) {
        return prevSelectedOptions.filter((option) => option !== value);
      } else {
        return [...prevSelectedOptions, value];
      }
    });
  };
  const handleReportChange = (event) => {
        console.log("selectedReporttt")

    const selectedReport = event.target.value;
    console.log(selectedReport,"selectedReport")
    setReport(selectedReport);
    const firstSubMenu = ReportArray.find((item) => item.label === selectedReport)?.subMenu[0];

    if (firstSubMenu) {
      setSubReport(firstSubMenu);
    }
    // Reset sub-report dropdown when the report changes
    else {
      setSubReport('');
    }
  };
  const handlePayOptionChange = (event) => {
    const selectedPayOption = event.target.value;
    setPayOption(selectedPayOption);

    // Reset status when selecting a different pay option
    setStatus(0);
  };

  const RenderToDate = () => {
    return (
      <>
      <Grid container alignItems="center" marginTop={2}>
                <Grid item xs={12} sm={4}>
                  <Typography>From Date</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker value={fromValue} onChange={(newValue) => setFromValue(newValue)} sx={{ width: '300px !important' }} />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              </Grid>
      <Grid container alignItems="center" marginTop={2}>
        <Grid item xs={12} sm={4}>
          <Typography>To Date</Typography>
        </Grid>

        <Grid item xs={12} sm={8}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker value={toValue} onChange={(newValue) => setToValue(newValue)} fullWidth sx={{ width: '300px !important' }} />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>
      </>
    );
  };
  //render paymode to right side on tab select from resource
  const RenderPayMode = () => {
  return (
    <Grid container alignItems="center" marginTop={2}>
      <Grid item xs={12} sm={4}>
        <Typography>Pay Mode</Typography>
      </Grid>

     <Grid item xs={12} sm={6}>
    <FormControl size="small" sx={{ width: "300px" }}>
      <Select
        multiple
        value={payMode}
        onChange={handlePayModeChange}
        displayEmpty
        renderValue={(selected) =>
          selected.length === 0
            ? "Select Pay Mode"
            : selected.join(", ")
        }
        MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      overflowY: 'auto'
                    }
                  }
                }}
                disableAutoFocusItem:true

      >
        {paymentModes.map((mode, index) => (
          <MenuItem key={index} value={mode}>
            {/* ✅ Checkbox in front */}
            <Checkbox checked={payMode.includes(mode)} />
            <ListItemText primary={mode} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
    </Grid>
  );
};


  //render paymode to right side on tab select from resource
  const RenderPayModeTab = () => {
    return (
      <Grid container alignItems="center" marginTop={2}>
        <Grid item xs={12} sm={4}>
          <Typography> Tab Pay Mode</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              width: '300px',
              maxHeight: '200px',
              height: '100px',
              overflowY: 'scroll'
            }}
          >
            {payModeArray.map((option) => (
              <Box
                key={option}
                style={{
                  padding: '1px 6px',
                  cursor: 'pointer',
                  backgroundColor: payMode.includes(option) ? '#1976D2' : 'transparent',
                  color: payMode.includes(option) ? '#FFFFFF' : 'inherit'
                }}
                onClick={() => handlePayModeChange(option)}
              >
                {option}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    );
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleGetwayStatusChange = (event) => {
    setGetwayStatus(event.target.value);
  };

  const handlePayTypeChange = (event) => {
    setPayType(event.target.value);
  };
  const handleSubReportChange = (event) => {
    setSubReport(event.target.value);
  };
  // const handleBillBookChange = (event) => {
  //   setSelectedBillBook(event.target.value);
  // };
  const handleZoneChange = (event) => {
    setSelectedZone(event.target.value);
  };
  const handleFinanceYearChange = (event) => {
    setFinanceYear(event.target.value);
  };
// const handleResourceChange = (event) => {
//   const {
//     target: { value },
//   } = event;

//   setPayResource(
//     typeof value === "string" ? value.split(",") : value
//   );
// };

 const handleResourceChange = (event) => {
  let {
    target: { value },
  } = event;

  // force array
  value = typeof value === "string" ? value.split(",") : value;

  // ❗ remove numbers if any (old state pollution)
  const cleaned = value.filter(v => typeof v === "string");

  setPayResource(cleaned);
};


  const handleCounterUserChange = (user) => {

// when selecting user
setSelectedUser(user);
  };

  const [zoneList, setZoneList] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getZoneMasterList();
        console.log(response, 'response');
  
        const fetchedZoneList = response.zoneList;
        console.log(fetchedZoneList, 'zone');
  
        setZoneList(fetchedZoneList||[]);
      } catch (error) {
        console.error('Error fetching Zone Master:', error);
        setZoneList([]);
      }
    };
  
    fetchData();
  }, []); 

    const [billBookNos, setBillBookNos] = useState([]);
    const [paymentModes, setPaymentModes] = useState([]);
    const[yearOptions,setYearOptions]=useState([])

      //years
      useEffect(() => {

      const fetchYear = async () => {
          try {
            const response = await getBillBookYearRange();
            console.log(response,"year range");
            setYearOptions(response||[]);
          } catch (error) {
            console.error('Error fetching year list:', error);
            setYearOptions([]);
          }
        };
        fetchYear()
      },[])


//bill book nos
        useEffect(() => {
      const fetchBillbookNos = async () => {
          try {
            const response = await fetchAllBillBookList();
            console.log(response,"all bill book nos list");
            setBillBookNos(response.data||[]);
          } catch (error) {
            console.error('Error fetching bill book list:', error);
            setBillBookNos([]);
          }
        };
        fetchBillbookNos()
      },[])

   // Fetch Payment Modes
    useEffect(() => {
      const fetchPaymentModes = async () => {
        const modes = await getPaymentModes();
        console.log(modes,"paymentmodes")
        setPaymentModes(modes||[]);
      };
      fetchPaymentModes();
    }, []);
  
    // Fetch Banks
    useEffect(() => {
      const fetchBanks = async () => {
        const res = await getBankList();
        console.log(res.banks,"bbnkk")
        //setBanks(res.banks);
      };
      fetchBanks();
    }, []);

  
  const[wardList,setWardList]=useState([]);
  const [selectedWards, setSelectedWards] = useState([]);

const handleWardChange = (event) => {
  const {
    target: { value }
  } = event;

  setSelectedWards(
    typeof value === "string" ? value.split(",") : value
  );
};

  //ward nos
     useEffect(() => {
        const loadWardNos = async () => {
          try {
            const wardNo = await fetchWardNo();
            const sortedWard = [...wardNo].sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo));
            console.log(sortedWard);
            setWardList(sortedWard);
          } catch (error) {
            console.error('Error fetching ward Number', error);
          }
        };
        loadWardNos();
      }, []);


  const handleBillBookChange = async (e) => {

  const selectedBillBook = e.target.value;
      console.log(selectedBillBook,"val")
      setSelectedBillBook(selectedBillBook);


  // Reset users when ALL selected
  if (selectedBillBook === 0) {
    setCounterUser([]);
    setSelectedUser(null)
    return;
  }

  try {
    const response = await fetchBillBookUsers(selectedBillBook);
    console.log(response,"valsem")

    // response.data = [{ UserID, name }]
    const users = response?.data || [];

    setCounterUser(users);

  } catch (error) {
    console.error("Error fetching counter users:", error);
    setCounterUser([]);
  }
};
const [selectedUserIds, setSelectedUserIds] = useState([]); // [5, 6, ...]


  const ShowDayWiseCollectionReport = () => {
    return (
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Grid container>
            <Grid item xs={12}>
               <Grid container alignItems="center" marginTop={2}>
                <Grid item xs={12} sm={3}>
                  <Typography>From Date</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker value={fromDayWiseValue} onChange={(newValue) => setFromDayWiseValue(newValue)} sx={{ width: '300px !important' }} />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center" marginTop={2}>
                <Grid item xs={12} sm={3}>
                  <Typography>Without Interest</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
<Checkbox
              checked={withoutInterest}
              onChange={(e) => setWithoutInterest(e.target.checked)}
            />
                                  </InputAdornment>
                      )
                    }}
                    sx={{ width: '300px' }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container alignItems="center" marginTop={2}>
                <Grid item xs={12} sm={3}>
                  <Typography>To Date</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker value={toDayWiseValue} onChange={(newValue) => setToDayWiseValue(newValue)} fullWidth sx={{ width: '300px !important' }} />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center" marginTop={2}>
                <Grid item xs={12} sm={3}>
                  <Typography>With Interest</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
<Checkbox
              checked={withInterest}
              onChange={(e) => setWithInterest(e.target.checked)}
            />
                                  </InputAdornment>
                      )
                    }}
                    sx={{ width: '300px' }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  console.log('selectedZone:', selectedZone, typeof selectedZone);
console.log('report:', report);
console.log('wardList length:', wardList.length);



const[invoiceFrom,setInvoiceFrom]=useState('');
const[invoiceTo,setInvoiceTo]=useState('');

const normalizeReportType = (reportType) => {
  if ([
    "COLLECTION GROSS",
    "GROSS_DETAILS",
    "DEMAND_DETAILS",
    "DEMAND_GROSS",
    "OUTSTANDING_DETAILS",
    "OUTSTANDING_GROSS",
    "WARDWISE_DAILY",
    "DAYWISE_COLLECTION",
    "DAILY_COLLECTION_GROSS",
    "TRANSACTION_REPORT",

    "CHALLAN_PAYTYPE",
    "CLERKWISE",
    "TAX_COLLECTION_WISE",
    "PAYMENT_WISE_COLLECTION",
    "TRANSFER_FEE"
  ].includes(reportType)) {
    return "DAILY_COLLECTION_COMMON";
  }

  return reportType;
};
const [dailyCollectionConfig, setDailyCollectionConfig] = useState({
  time: '',
  daySpan: '',
  spanHolidays: ''
});

useEffect(() => {
  const fetchSettings = async () => {
    const res = await getApplicationSetting();

    if (res?.success && res.data) {
      const row = res.data;

      setDailyCollectionConfig({
        time: row.DailyCollectionReportTimeSpan || '',
        daySpan: row.DailyCollectionReportDaySpan || '',
        spanHolidays: row.DailyCollectionReportDaySpanForH || '',
      });
    }
  };

  fetchSettings();
}, []);
const[inVoiceNo,setInVoiceNo]=useState('')

const payloadCollectionSubReport={
  DailyCollectionReportTimeSpan:dailyCollectionConfig.time,
  DailyCollectionReportDaySpan:dailyCollectionConfig.daySpan,
  DailyCollectionReportDaySpanF:dailyCollectionConfig.spanHolidays,
  subReportType:subReport,
  zoneId:selectedZone,
  wardId:selectedOptions,
  financialYear:financeYear,
  billBook:selectedBillBook,
  payResource:payResource,
  payMode:payMode,
  counterUserIds:selectedUser,
  payType:payType,
  //payOption,
  invoiceFrom,
  invoiceTo,
  fromValue,
  toValue,
  inVoiceNo
}

  
const buildPayload = () => ({ 
  zoneId:selectedZone,
  wardId:wardNo,
  financialYear:financeYear,
  billBook:selectedBillBook,
  payResource:payResource,
  payMode:payMode,
  counterUserIds:selectedUser,
  payType:payType,
  //payOption,
  invoiceFrom,
  invoiceTo,
  fromValue,
  toValue,
  inVoiceNo,

});



const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user check mutation page');
  }, [userData]);



const [withoutInterest, setWithoutInterest] = useState(false);
const [withInterest, setWithInterest] = useState(false);
const [merchantRefNo, setMerchantRefNo] = useState('');

  const isAmc = userData?.role === 'Amc Employee';
const defaultPayload = () => ({
  reportType: report,
  subReportType: subReport||"",
  zoneId: selectedZone,
  wardId: selectedOptions,
  financialYear: financeYear,
  billBook: selectedBillBook,
  payResource,
  payMode,
  counterUserIds: selectedUser,
  payType,
  fromDate: fromValue ? fromValue.toISOString() : null,
  toDate: toValue ? toValue.toISOString() : null,
});

const commonCollectionPayload = () => ({
  reportType:report,
  zoneId: selectedZone,
  wardId: selectedOptions,
  financialYear: financeYear,
  billBook: selectedBillBook,
  payResource,
  payMode,
  counterUserIds: selectedUser,
  payType,
  invoiceFrom,
  invoiceTo,
  //fromDate:fromValue,
   fromDate: fromValue ? fromValue.toISOString() : null,
  toDate: toValue ? toValue.toISOString() : null,
  //toDate:toValue,
  inVoiceNo
});

  const payloadBuilders = {
  "Collection Gross": commonCollectionPayload,
  "Demand Details": commonCollectionPayload,
  "Demand Gross": commonCollectionPayload,
  "Outstanding Details": commonCollectionPayload,
  "Outstanding Gross": commonCollectionPayload,
  "Transfer Fee Collection":commonCollectionPayload,
  "Wardwise/UserwiseInvoice Report": () => ({
  reportType:report,
  zoneId:selectedZone,
  wardId:selectedOptions,
  financialYear:financeYear,
  billBook:selectedBillBook,
  payResource:payResource,
  payMode:payMode,
  counterUserIds:selectedUser,
  payType:payType,
  inVoiceNo,
  invoiceFrom:invoiceFrom,
  invoiceTo:invoiceTo,
   fromDate: fromValue ? fromValue.toISOString() : null,
  toDate: toValue ? toValue.toISOString() : null,
  }),

  "Daywise Collection Report": () => ({
     fromDate: fromValue ? fromValue.toISOString() : null,
  toDate: toValue ? toValue.toISOString() : null,
    withoutInterest,
    withInterest
  }),
    "Getway Payment Report": () => ({
    financialYear: financeYear,
    payType,
    billBook: selectedBillBook,
    inVoiceNo,
     fromDate: fromValue ? fromValue.toISOString() : null,
  toDate: toValue ? toValue.toISOString() : null,
    merchantReferenceNo: merchantRefNo,
    status:getwayStatus
  }),
  "Wardwise Daily Report": () => ({
    zoneId:selectedZone,
    wardId:selectedOptions,
    financialYear:financeYear,
     fromDate: fromValue ? fromValue.toISOString() : null,
     toDate: toValue ? toValue.toISOString() : null,
    }),
    "Collection Percentage Chart Report": () => ({
    financialYear:financeYear,
     fromDate: fromValue ? fromValue.toISOString() : null,
  toDate: toValue ? toValue.toISOString() : null,    }),
     "Tax Collector Performance Report": () => ({
    zoneId:selectedZone,
    wardId:selectedOptions,  
    financialYear:financeYear,
     fromDate: fromValue ? fromValue.toISOString() : null,
  toDate: toValue ? toValue.toISOString() : null,
    }),
    "Counter Foil":()=>({
    wardId:selectedOptions,  
    financialYear:financeYear,
     fromDate: fromValue ? fromValue.toISOString() : null,
  toDate: toValue ? toValue.toISOString() : null,
    })

};

const handleSearch = async () => {
  try {
    const payloadToSend = isAmc
  ? payloadCollectionSubReport()
  : payloadBuilders[report]
    ? payloadBuilders[report]()
    : defaultPayload();
  console.log(payloadToSend,"payload to search");
    let response;

  switch (report) {
  case "ALL":
        response = await fetchAllReport(payloadToSend);
        console.log(response,"fetchAllReport");
    break;

  case "Collection Details":
        response = await fetchCollectionReportWithSubReportType(payloadToSend);
        console.log(response,"fetchCollectionReportWithSubReportType");
    break;
  case "Collection Gross":
  case "Demand Details":
  case "Demand Gross":
  case "Outstanding Details":
  case "Outstanding Gross":
    response = await fetchCommonReport(payloadToSend);
    break;
  case "Transaction Report":
  case "Challan":
  case "Transfer Fee Collection":

   response = await fetchTransactionChallanTransferFeeReport({
      ...payloadToSend,
      subReportType: reportType
    }); 
  break;

  case "Wardwise/UserwiseInvoice Report":
    response = await fetchWardwiseUserwiseInvoiceReport(payloadToSend);
    break;
  case "Daywise Collection Report":
    response = await fetchDaywiseCollectionReport(payloadToSend);
    break;

 case "Getway Payment Report":
    response = await fetchGatewayPaymentReport(payloadToSend);
    break;

 case "ClerkwiseReport":
        response = await fetchWardwiseUserwiseInvoiceReport({

        ...payloadToSend,
      subReportType: reportType
    })
        break;
   case "TaxCollectionWise&PaymentWiseCollection Report":
        response = await fetchWardwiseUserwiseInvoiceReport({
          ...payloadToSend,
      TotalCollection: totalCollection

        })
    break;
    
  
  case "Wardwise Daily Report":
    response = await fetchWardwiseDailyReport(payloadToSend);
    break;
 
  case "Collection Percentage Chart Report":
    response = await fetchCollectionPercentageChartReport(payloadToSend);
    break;

  
  case "Tax Collector Performance Report":
    response = await fetchTaxPerformanceReport({
      ...payloadToSend,
      subReportType: reportType
    });
    break;
  default:
    throw new Error("Invalid Report Type Selected");
}

    console.log(response?.data,"data backend response")

    //setTableData(response?.data || []);
    //setTotalCount(response?.count || 0);

  } catch (error) {
    console.log("Search failed:", error);
    throw error;
  } 
};

const shouldShowWard =
  report !== "Getway Payment Report" &&
  report !== "Daywise Collection Report"&&
  report !== "Tax Collector Performance Report";








  return (
    <MainCard>
      <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>Collection Reports</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Grid item xs={12} sm={8}>
            <FormControl fullWidth>
              <Typography style={{ marginBottom: '0.5rem' }}>Select Report</Typography>
              <Select
                value={report}
                onChange={handleReportChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      overflowY: 'auto'
                    }
                  }
                }}
              >
                {ReportArray.map((reportItem, index) => (
                  <MenuItem key={index} value={reportItem.label}>
                    {reportItem.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid item xs={12} sm={8}>
            <FormControl fullWidth>
              <Typography style={{ marginBottom: '0.5rem' }}>Select Sub Report</Typography>
              {ReportArray.find((item) => item.label === report)?.subMenu.length > 0 ? (
                <Select
                  value={subReport}
                  onChange={handleSubReportChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                >
                  {ReportArray.find((item) => item.label === report)?.subMenu.map((subReportItem, index) => (
                    <MenuItem key={index} value={subReportItem}>
                      {subReportItem}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Select
                  value=""
                  onChange={handleSubReportChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                />
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>Report Filters</Typography>
          {report !== 'Daywise Collection Report' && (
            <MainCard>
              <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>
                Set Filters For Reports
              </Typography>
              <Grid container spacing={2}>
                {/* left Grid item 6 */}
                <Grid item xs={12} sm={6}>
                  <MainCard>
                    {report !== 'Getway Payment Report' && report !== 'Collection Percentage Chart Report' && report !== 'Counter Foil' && (
                      <Grid container alignItems="center">
                        {/* Grid item for label */}
                        <Grid item xs={12} sm={4}>
                          <Typography>Zone Section:</Typography>
                        </Grid>
                        {/* Grid item for select */}
                        <Grid item xs={12} sm={6}>
<Grid item xs={12} sm={6}>
  <Select
    value={selectedZone}
    onChange={(e) => setSelectedZone(e.target.value)}
    sx={{ width: '300px' }}
    displayEmpty
  >
    {/* ALL option */}
    <MenuItem value={0}>
      ALL
    </MenuItem>

    {/* Dynamic zones */}
    {zoneList.map((zone) => (
      <MenuItem key={zone.ID} value={zone.ZoneNo}>
        {zone.ZoneNo}
      </MenuItem>
    ))}
  </Select>
</Grid>

                        </Grid>
                      </Grid>
                    )}
                    <Grid container alignItems="center" marginTop={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography>Finance Year</Typography>
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <Select
  value={financeYear}
  onChange={(e) => setFinanceYear(e.target.value)}
  fullWidth
  sx={{ width: '300px' }}
  displayEmpty
>
  {/* ALL */}
  <MenuItem value={0}>ALL</MenuItem>

  {/* Dynamic finance years */}
  {yearOptions.map((item, index) => (
    <MenuItem key={index} value={item.FinanceYearRange}>
      {item.FinanceYearRange}
    </MenuItem>
  ))}
</Select>
                      </Grid>
                    </Grid>

                    {report !== 'Wardwise Daily Report' && report !== 'Collection Percentage Chart Report' && report !== 'Counter Foil' && (
                      <Grid container alignItems="center" marginTop={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography> Select Bill Book </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Select
  value={selectedBillBook}
  onChange={(e) => handleBillBookChange(e)}
  sx={{ width: '300px' }}
  displayEmpty
>
  {/* ALL option */}
  <MenuItem value={0}>ALL</MenuItem>

  {/* Dynamic selectedBillBook numbers */}
  {billBookNos.map((item, index) => (
    <MenuItem key={index} value={item.BillBookNo}>
      {item.BillBookNo}
    </MenuItem>
  ))}
</Select>

                        </Grid>
                      </Grid>
                    )}

                    {report !== 'ALL' &&
                      report !== 'Getway Payment Report' &&
                      report !== 'Collection Details' &&
                      report !== 'Collection Gross' &&
                      report !== 'Demand Details' &&
                      report !== 'Demand Gross' &&
                      report !== 'Outstanding Details' &&
                      report !== 'Outstanding Gross' &&
                      report !== 'Transaction Report' &&
                      report !== 'Challan' &&
                      report !== 'ClerkwiseReport' &&
                      report !== 'TaxCollectionWise&PaymentWiseCollection Report' &&
                      report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Transfer Fee Collection' &&
                      report !== 'Counter Foil' && (
                        <Grid container alignItems="center" marginTop={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography>Counter Receipt</Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Select value={counterReceipt} onChange={handleCounterReceiptChange} sx={{ width: '300px' }}>
                              <MenuItem value={0}>--Select--</MenuItem>
                              <MenuItem value={1}>Ascending</MenuItem>
                              <MenuItem value={2}>Descending</MenuItem>
                            </Select>
                          </Grid>
                        </Grid>
                      )}

                    {report !== 'ALL' &&
                      report !== 'Getway Payment Report' &&
                      report !== 'Collection Details' &&
                      report !== 'Collection Gross' &&
                      report !== 'Demand Details' &&
                      report !== 'Demand Gross' &&
                      report !== 'Outstanding Details' &&
                      report !== 'Outstanding Gross' &&
                      report !== 'Transaction Report' &&
                      report !== 'Challan' &&
                      report !== 'ClerkwiseReport' &&
                      report !== ' TaxCollectionWise&PaymentWiseCollection Report' &&
                      report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Transfer Fee Collection' &&
                      report !== 'Counter Foil' && (
                        <Grid container alignItems="center" marginTop={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography>Total Collection</Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Select value={totalCollection} onChange={handletotalCollectionChange} sx={{ width: '300px' }}>
                              <MenuItem value={0}>--Select--</MenuItem>
                              <MenuItem value={1}>Ascending</MenuItem>
                              <MenuItem value={2}>Descending</MenuItem>
                            </Select>
                          </Grid>
                        </Grid>
                      )}

                    {report !== 'Wardwise/UserwiseInvoice Report' &&
                      report !== 'Getway Payment Report' &&
                      report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Counter Foil' && (
                    
                        <Grid container alignItems="center" marginTop={2}>
  <Grid item xs={12} sm={4}>
    <Typography>Pay Resource:</Typography>
  </Grid>

  <Grid item xs={12} sm={6}>
    <Select
      multiple
      value={payResource}
      onChange={handleResourceChange}
      sx={{ width: "300px" }}
      displayEmpty
      renderValue={(selected) =>
  selected.length === 0
    ? "Select Pay Resource"
    : selected.join(", ")
}


    >
      {payResourceOptions.map((option) => (
  <MenuItem key={option.id} value={option.label}>
    <Checkbox checked={payResource.indexOf(option.label) > -1} />
    <ListItemText primary={option.label} />
  </MenuItem>
))}
    </Select>
  </Grid>
</Grid>
                      )}

                    {/* {payResource === 4 && (
                      <Grid container alignItems="center" marginTop={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography>Tab User</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextareaAutosize aria-label="minimum height" minRows={3} style={{ width: '300px' }} />
                        </Grid>
                      </Grid>
                    )} */}

                    {report !== 'Wardwise/UserwiseInvoice Report' &&
                      report !== 'Getway Payment Report' &&
                      report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Counter Foil' &&
                      payResource !== 4 && <RenderPayMode />}

                    {report !== 'Wardwise/UserwiseInvoice Report' &&
                      report !== 'Getway Payment Report' &&
                      report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Counter Foil' &&
                      payResource !== 4 && (

<Grid container alignItems="center" marginTop={2}>
  <Grid item xs={12} sm={4}>
    <Typography>By Counter User</Typography>
  </Grid>

  <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
    <Select
  multiple
  value={selectedUser}
  onChange={(e) =>setSelectedUser(e.target.value)}
  renderValue={(selectedUser) =>
    selectedUser.length === 0
      ? "Select Counter User"
      : counterUser
          .filter(user => selectedUser.includes(user.UserID))
          .map(user => user.name)
          .join(", ")
  }
>
  {counterUser.length === 0 ? (
    <MenuItem disabled>No users found</MenuItem>
  ) : (
    counterUser.map((user) => (
      <MenuItem key={user.UserID} value={user.UserID}>
        <Checkbox checked={selectedUser.includes(user.UserID)} />
        <ListItemText primary={user.name} />
      </MenuItem>
    ))
  )}
</Select>

    </FormControl>
  </Grid>
</Grid>

                      )}

                    {/* {report !== 'ALL' && (
                      <Grid container alignItems="center" marginTop={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography>From Date</Typography>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker
                                value={value}
                                onChange={(newValue) => setValue(newValue)}
                                fullWidth
                                sx={{ width: '300px !important' }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                    )} */}
                    {report == 'Getway Payment Report' && (
                      <Grid container alignItems="center" marginTop={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography>Merchand Reference No</Typography>
                        </Grid>

                        <Grid item xs={12} sm={5}>
                          <TextField required placeholder="Enter Merchand Reference No" fullWidth sx={{ width: '300px' }}       value={merchantRefNo}
      onChange={(e) => setMerchantRefNo(e.target.value)}
></TextField>
                        </Grid>
                      </Grid>
                    )}
                    {report !== 'Getway Payment Report' &&
                      report !== 'ALL' &&
                      report !== 'Collection Details' &&
                      report !== 'Collection Gross' &&
                      report !== 'Demand Details' &&
                      report !== 'Demand Gross' &&
                      report !== 'Outstanding Details' &&
                      report !== 'Outstanding Gross' &&
                      report !== 'Transaction Report' &&
                      report !== 'Challan' &&
                      report !== 'Wardwise/UserwiseInvoice Report' &&
                      report !== 'ClerkwiseReport' &&
                      report !== 'TaxCollectionWise&PaymentWiseCollection Report' &&
                      report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Transfer Fee Collection' &&
                      report !== 'Counter Foil' && (
                        <Grid container alignItems="center" marginTop={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography> From Time </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['TimePicker']}>
                                <TimePicker label=" time picker" fullWidth sx={{ width: '250px' }} />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid>
                        </Grid>
                      )}

                    
                  </MainCard>
                  <Grid container alignItems="center" marginTop={2} spacing={2}  justifyContent="center">
                      <Grid item>
                        <Stack spacing={1} marginTop={3}>
                          <Button variant="contained" color="info" onClick={handleSearch}>
                            Employee Search Report
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Stack spacing={1} marginTop={3}>
                          <Button variant="contained" color="secondary">
                            Cancel
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <MainCard>
                  {shouldShowWard && (
  <Grid container alignItems="center">
    <Grid item xs={12} sm={4}>
      <Typography>Ward</Typography>
    </Grid>

    <Grid item xs={12} sm={6}>
      <FormControl fullWidth size="small">
        <Select
  multiple
  value={selectedOptions}
  onChange={(e) => setSelectedOptions(e.target.value)}
  displayEmpty
  renderValue={(selected) =>
    selected.length === 0
      ? "Select Ward(s)"
      : selected.join(", ")
  }
  MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 200,  
          
      }
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    }
  }}
>
  {wardList.map(({ NewWardNo }) => (
    <MenuItem key={NewWardNo} value={NewWardNo}>
      <Checkbox checked={selectedOptions.includes(NewWardNo)} />
      <ListItemText primary={`${NewWardNo}`} />
    </MenuItem>
  ))}
</Select>

      </FormControl>
    </Grid>
  </Grid>
)}

                    {(report === 'ALL' ||
                      report === 'Collection Details' ||
                      report === 'Collection Gross' ||
                      report === 'Demand Details' ||
                      report === 'Demand Gross' ||
                      report === 'Outstanding Details' ||
                      report === 'Outstanding Gross' ||
                      report === 'Challan' ||
                      report === 'Getway Payment Report' ||
                      report === 'Wardwise/UserwiseInvoice Report' ||
                      report === 'ClerkwiseReport' ||
                      report === 'TaxCollectionWise&PaymentWiseCollection Report') && (
                      <Grid container alignItems="center" marginTop={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography>{report === 'Wardwise/UserwiseInvoice Report' ? 'Pay Type' : 'Pay Type'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Select value={payType} onChange={handlePayTypeChange} fullWidth sx={{ width: '300px' }}>
                            <MenuItem value="">-Select-</MenuItem>
  <MenuItem value="current">current</MenuItem>
  <MenuItem value="pending">pending</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    )}

                    {report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Counter Foil' && (
                        <Grid container alignItems="center" marginTop={2}>
                          {/* Invoice Number Label */}
                          <Grid item xs={12} sm={4}>
                            <Typography>Invoice No:</Typography>
                          </Grid>

                          {/* From and To Text Fields */}
                          <Grid item xs={12} sm={7} container spacing={2}>
                            {/* From TextField */}
                            {report !== 'Getway Payment Report' &&
                              report !== 'ClerkwiseReport' &&
                              report !== 'Collection Percentage Chart Report' &&
                              report !== 'Tax Collector Performance Report' &&
                              report !== 'Transfer Fee Collection' && (
                                <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <Typography>From</Typography>
                                    <TextField variant="outlined" value={invoiceFrom} fullWidth sx={{ width: '135px' }} onChange={(e)=>setInvoiceFrom(e.target.value)} />
                                  </Stack>
                                </Grid>
                              )}

                            {/* To TextField */}
                            {report !== 'Getway Payment Report' &&
                              report !== 'ClerkwiseReport' &&
                              report !== 'Collection Percentage Chart Report' &&
                              report !== 'Tax Collector Performance Report' &&
                              report !== 'Transfer Fee Collection' && (
                                <Grid item xs={6}>
                                  <Stack spacing={1}>
                                    <Typography>To</Typography>
                                    <TextField variant="outlined" value={invoiceTo} fullWidth sx={{ width: '135px' }}onChange={(e)=>setInvoiceTo(e.target.value)} />
                                  </Stack>
                                </Grid>
                              )}

                            {report !== 'Collection Details' &&
                              report !== 'Collection Gross' &&
                              report !== 'Demand Gross' &&
                              report !== 'Demand Details' &&
                              report !== 'Outstanding Details' &&
                              report !== 'Outstanding Gross' &&
                              report !== 'Transaction Report' &&
                              report !== 'Challan' &&
                              report !== 'TaxCollectionWise&PaymentWiseCollection Report' &&
                              report !== 'Tax Collector Performance Report' &&
                              report !== 'Wardwise/UserwiseInvoice Report' && (
                                <Grid item xs={12}>
                                  <Stack>
                                    <TextField variant="outlined" fullWidth sx={{ width: '300px' }} value={inVoiceNo} onChange={(e)=>setInVoiceNo(e.target.value)} />
                                  </Stack>
                                </Grid>
                              )}
                          </Grid>
                        </Grid>
                      )}

                    {/* {report === 'Wardwise/UserwiseInvoice Report' && (
                      <Grid container alignItems="center" marginTop={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography>Tab Receipt</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Select value={counterReceipt} onChange={handleCounterReceiptChange} sx={{ width: '300px' }}>
                            <MenuItem value={0}>--Select--</MenuItem>
                            <MenuItem value={1}>Ascending</MenuItem>
                            <MenuItem value={2}>Descending</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    )} */}

                    {/* {report !== 'Getway Payment Report' &&
                      report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Counter Foil' &&
                      report !== 'Wardwise/UserwiseInvoice Report' && (
                        <Grid container alignItems="center" marginTop={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography>Pay Option</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Select value={payOption} onChange={handlePayOptionChange} fullWidth sx={{ width: '300px' }}>
                              <MenuItem value={0}>ALL</MenuItem>
                              <MenuItem value={1}>Other Pay</MenuItem>
                              <MenuItem value={2}>Cheque Pay</MenuItem>
                            </Select>
                          </Grid>
                        </Grid>
                      )} */}

                    {/* {payResource === 4 && <RenderPayModeTab />} */}

                    {/* Render status select only when Cheque Pay is selected */}
                    {payOption === 2 && (
                      <Grid container alignItems="center" marginTop={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography>Status</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Select value={status} onChange={handleStatusChange} fullWidth sx={{ width: '250px' }}>
                            <MenuItem value={0}>-Select-</MenuItem>
                            <MenuItem value={1}>Clear</MenuItem>
                            <MenuItem value={2}>InProcess</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    )}

                    {report !== 'ALL' &&
                      (report === 'Collection Details' ||
                        report === 'Collection Gross' ||
                        report === 'Demand Details' ||
                        report === 'Demand Gross' ||
                        report === 'Outstanding Details' ||
                        report === 'Outstanding Gross ' ||
                        report === 'Challan' ||
                        report === 'Transaction Report' ||
                        report === 'Wardwise/UserwiseInvoice Report' ||
                        report === 'ClerkwiseReport' ||
                        report === 'TaxCollectionWise&PaymentWiseCollection Report' ||
                        report === 'Transfer Fee Collection' ||
                        report === 'Getway Payment Report' ||
                        report === 'Wardwise Daily Report' ||
                        report === 'Collection Percentage Chart Report' ||
                        report === 'Tax Collector Performance Report' ||
                        report === 'Counter Foil' ||
                        report === 'Getway Payment Report' ||
                        report === 'Wardwise Daily Report' ||
                        report === 'Collection Percentage Chart Report' ||
                        report === 'Tax Collector Performance Report' ||
                        report === 'Counter Foil') && (
                        <Box style={{ marginTop: '1rem' }}>
                          <RenderToDate />
                        </Box>
                      )}

                    {report === 'Getway Payment Report' && (
                      <Grid container alignItems="center" marginTop={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography>Select Status</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Select value={getwayStatus} onChange={handleGetwayStatusChange} sx={{ width: '300px' }}>
                            <MenuItem value={0}>ALL</MenuItem>
                            <MenuItem value={1}>Failed</MenuItem>
                            <MenuItem value={2}>Initiated</MenuItem>
                            <MenuItem value={3}>Success</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    )}

                    {report !== 'ALL' &&
                      report !== 'Collection Details' &&
                      report !== 'Collection Gross' &&
                      report !== 'Demand Details' &&
                      report !== 'Demand Gross' &&
                      report !== 'Outstanding Details' &&
                      report !== 'Outstanding Gross' &&
                      report !== 'Transaction Report' &&
                      report !== 'Challan' &&
                      report !== 'Wardwise/UserwiseInvoice Report' &&
                      report !== 'Getway Payment Report' &&
                      report !== 'ClerkwiseReport' &&
                      report !== 'TaxCollectionWise&PaymentWiseCollection Report' &&
                      report !== 'Wardwise Daily Report' &&
                      report !== 'Collection Percentage Chart Report' &&
                      report !== 'Tax Collector Performance Report' &&
                      report !== 'Transfer Fee Collection' &&
                      report !== 'Counter Foil' && (
                        <Grid container alignItems="center" marginTop={2}>
                          <Grid item xs={12} sm={4}>
                            <Typography>To Time </Typography>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['TimePicker']}>
                                <TimePicker label=" time picker" fullWidth sx={{ width: '250px' }} />
                              </DemoContainer>
                            </LocalizationProvider>
                          </Grid>
                        </Grid>
                      )}
                  </MainCard>
                </Grid>
              </Grid>
            </MainCard>
          )}
          {report == 'Daywise Collection Report' && <ShowDayWiseCollectionReport />}
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default CollectionReport;
