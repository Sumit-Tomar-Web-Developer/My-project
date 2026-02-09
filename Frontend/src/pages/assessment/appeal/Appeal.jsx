
// material-ui
import {
  Grid,
  Autocomplete,
  Box,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Select,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Chip,
  Backdrop,
  CircularProgress,
  Snackbar,
  SnackbarContent
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { format, parseISO } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function createData(name, designation, product, date, badgeText, badgeType) {
  return { name, designation, product, date, badgeText, badgeType };
}

// project import
import MainCard from 'components/MainCard';
import React,{ useState, useEffect } from 'react';
import {
  fetchAppealAllInfo,
  fetchFinancialYear,
  fetchOwnerId,
  fetchPropertyRange,
  fetchRetaintionFactors,
  fetchTaxName,
  fetchWardList,
  applyPolicies,
  getNetValuation,
  fetchOwnerRateableValue,
  fetchOwnerTaxes,
  fetchTaxRateByAmount,
  resetAppealService,
  fetchHearingRV,
  fetchCourtRV,
  fetchRetainRV,
  fetchAppealRV
} from 'services/appeal.services';
import { blue, green, orange, pink, yellow,red } from '@mui/material/colors';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useNavigate } from 'react-router';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';

// ==============================|| SAMPLE PappealReson ||============================== //

function Appeal() {
  const [isValueReady, setIsValueReady] = useState(false);

  const [incrementList, setIncrementList] = useState('');
  const [financialYearList, setFinancialYearList] = useState([]);
  const [financialYear, setFinancialYear] = useState('');
  const [wardList, setwardList] = useState([]);
  const [ward, setward] = useState('');
  const [retaintionFactorList, setretaintionFactorList] = useState([]);
  const [retaintionFactor, setretaintionFactor] = useState('');
  const [taxNameList, setTaxNameList] = useState([]);
  const [propList, setPropList] = useState([]);
  const [propNo, setPropNo] = useState('');
  const [partNo, setPartNo] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [appealReson, setAppealReson] = useState('');
  const [tableLoading, setTableLoading] = useState(false);

const [oldRV, setOldRv] = useState(0);
  const [netRv, setNetRv] = useState(0);
  const [retainRV, setRetainRV] = useState(0);
  const [hearingRV, setHearingRV] = useState(0);
  const [appealCommRV, setAppealCommRV] = useState(0);
  const [courtResRV, setCourtResRV] = useState(0);
  const [customRV, setCustomRV] = useState(0);

  const [rdbIncr, setRdbIncr] = useState('Increment');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const [receivedMessage, setReceivedMessage] = useState('');



  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  const [appealInfo, SetAppealInfo] = useState({
    AppealProcess: '',
    OwnerId: 0,
    OwnerName: '',
    RenterName: '',
    OccupierName:'',
    NetRV: [],
    // RetainRV: [],
    HearingRV: [],
    AppealMast: [],
    RetaintionMast: [],
    CourtResultMast: [],
    HearingMast: []
  });

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);
//set prop heigth
const ITEM_HEIGHT = 48; 
const VISIBLE_ITEMS = 4; 

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * VISIBLE_ITEMS,
      width: 250
    }
  }
};


  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Appeal';
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
      console.log(access, 'assigned access to Appeal Page');
      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true); 
      } else {
        setShowAccessDialog(false);
      }
    }
  }, [permissionAccess]);

  const navigate = useNavigate();
  const handleRedirect = () => {
    setShowAccessDialog(false);
    navigate('/payment/dashboard');
  };

  // Create Increment list from 2.5 to 28 as per old application
  const [incrList, setIncrList] = useState([]);
  function createIncrementList() {
    const list = [];
    for (let index = 2.5; index <= 28; index += 2.5) {
      list.push(index);
    }
    return list;
  }

  const handleIncrList = (event) => {
    setIncrementList(event.target.value);
  };
  const handleChange = (event) => {
    setAppealReson(event.target.value);
    setCustomRV(0);
  };
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    const list = createIncrementList();
    setIncrList(list);

    fetchFinancialYear()
      .then((finList) => {
        setFinancialYearList(finList);
      })
      .catch((error) => {
        console.error('Error fetching financial list:', error);
      });
    fetchWardList()
      .then((finList) => {
        setwardList(finList);
      })
      .catch((error) => {
        console.error('Error fetching Ward list:', error);
      });

    fetchTaxName()
      .then((txnNameList) => {
        setTaxNameList(txnNameList);
        console.log("tax name", txnNameList);
      })
      .catch((error) => {
        console.error('Error fetching financial list:', error);
      });
    fetchRetaintionFactors()
      .then((finList) => {
        setretaintionFactorList(finList);
      })
      .catch((error) => {
        console.error('Error fetching financial list:', error);
      });
  }, []);

  const handleChangeYear = (event) => {
    setFinancialYear(event.target.value);
  };
  const handleWard = (event) => {
    setward(event.target.value);
    setPropNo('');
    setPartNo('');
    // console.log()
    fetchPropertyRange(event.target.value)
      .then((propertyRange) => {
        const propertyRangeWithWard = propertyRange.map((item) => item.PropNo);
        setPropList(propertyRangeWithWard);
        // console.log(propertyRange)
      })
      .catch((error) => {
        console.error('Error fetching property range:', error);
      });
  };
  const handleRetainFactor = (event) => {
    setretaintionFactor(event.target.value);
  };
  const [ownerID, setOwnerID] = useState(null);

  const FetchOwnerIdFromWardPropNo = (wdNo, propNo, partNo) => {
    fetchOwnerId(wdNo, propNo, partNo)
      .then((res) => {
        const ownerId = res.OwnerId;
        console.log(ownerId);
        if (ownerId > 0) {
           setOwnerID(ownerId); 
          SetOwnerAppealInfo(ownerId);
        }
      })
      .catch((error) => {
        console.log('Error Fetching Owner Id', error);
      });
  };

  useEffect(() => {
    if (!ownerID) return;
  
    const refreshOwnerData = async () => {
      try {
        setTableLoading(true);
  
        // appeal info refresh
        await SetOwnerAppealInfo(ownerID);
  
        // tax aur RV refresh karo
        const [taxData, hearing, court, retain] = await Promise.all([
          fetchOwnerTaxes(ownerID),
          fetchHearingRV(ownerID),
          fetchCourtRV(ownerID),
          fetchRetainRV(ownerID),
          
        ]);
  
        setOwnerTaxes(taxData);
        setHearingRV(hearing?.totalRentalValue || 0);
        setCourtResRV(court?.totalCourtRentalValue || 0);
        setRetainRV(retain?.totalRetainRentalValue || 0);
        setAppealCommRV(appealInfo?.totalAppealRentalValue || 0);
        // finally table refresh
        await calculateAllTaxes();
  
      } catch (err) {
        console.error("Error refreshing owner data:", err);
      } finally {
        setTableLoading(false);
      }
    };
  
    refreshOwnerData();
  }, [ownerID]);
  
  
  //tax amnount taxmster
  const [ownerTaxes, setOwnerTaxes] = useState([]);
 
  useEffect(() => {
    if (!appealInfo) return;
  
    const mapped = mapAppealInfoForBackend(appealInfo, appealReson);
    if (!mapped.OwnerID) return; 
  
    const loadOwnerTaxes = async () => {
      try {
        const taxes = await fetchOwnerTaxes(mapped.OwnerID);
        console.log(taxes, "taxes");
        setOwnerTaxes(taxes);
      } catch (err) {
        console.error("Error fetching owner taxes:", err.response?.data || err.message);
      }
    };
  
    loadOwnerTaxes();
  }, [appealInfo, appealReson]);
  const [taxRates, setTaxRates] = useState({});
const [calculatedTaxes, setCalculatedTaxes] = useState({});


  useEffect(() => {
    const ownerId = appealInfo.OwnerId;
    if (!ownerId) return;
  
    const getNetRv = async () => {
      try {
        const data = await fetchOwnerRateableValue(ownerId);
        setNetRv(data.totalRateableValue ?? 0);  // ✅ correct key
      } catch (err) {
        console.error('Error fetching net RV:', err);
        setNetRv(0);
      }
    };
  
    getNetRv();
  }, [appealInfo.OwnerId]);
  
  useEffect(() => {
    const ownerId = appealInfo.OwnerId;
    if (!ownerId) return;
  
    const getHearingRv = async () => {
      try {
        const data = await fetchHearingRV(ownerId);
        setHearingRV(data.totalRentalValue ?? 0);  // ✅ correct key
      } catch (err) {
        console.error('Error fetching net RV:', err);
        setHearingRV(0);
      }
    };
  
    getHearingRv();
  }, [appealInfo.OwnerId]);
  useEffect(() => {
    const ownerId = appealInfo.OwnerId;
    if (!ownerId) return;
  
    const getCourtRv = async () => {
      try {
        const data = await fetchCourtRV(ownerId);
        setCourtResRV(data.totalCourtRentalValue ?? 0);  // ✅ correct key
      } catch (err) {
        console.error('Error fetching net RV:', err);
        setCourtResRV(0);
      }
    };
  
    getCourtRv();
  }, [appealInfo.OwnerId]);

  useEffect(() => {
    const ownerId = appealInfo.OwnerId;
    if (!ownerId) return;
  
    const getRetainRv = async () => {
      try {
        const data = await fetchRetainRV(ownerId);
        setRetainRV(data.totalRetainRentalValue ?? 0);  
      } catch (err) {
        console.error('Error fetching net RV:', err);
        setRetainRV(0);
      }
    };
  
    getRetainRv();
  }, [appealInfo.OwnerId]);

  useEffect(() => {
    const ownerId = appealInfo.OwnerId;
    if (!ownerId) return;
  
    const getAppealRv = async () => {
      try {
        const data = await fetchAppealRV(ownerId);
        setAppealCommRV(data.totalAppealRentalValue ?? 0);  
      } catch (err) {
        console.error('Error fetching appeal RV:', err);
        setAppealCommRV(0);
      }
    };
  
    getAppealRv();
  }, [appealInfo.OwnerId]);

  // function SetOwnerAppealInfo(ownerId) { 
  //   fetchAppealAllInfo(ownerId)
  //     .then(async (ownerInfo) => {
  //       console.log(ownerInfo, "ownerInfo");
  
  //       // 1️⃣ Set Old RV
  //       if (ownerInfo.oldDetail && ownerInfo.oldDetail.length > 0) {
  //         const rv = ownerInfo.oldDetail[0].OldRV ?? 0;
  //         setOldRv(rv);
  //       } else {
  //         setOldRv(0);
  //       }
  
  //       // 2️⃣ Fetch Net RV
  //       let netRVData = {};
  //       try {
  //         netRVData = await fetchOwnerRateableValue(ownerId);
  //         console.log("Fetched NetRV Data (service):", netRVData);
  //         setNetRv(netRVData.totalRateableValue || 0);
  //       } catch (err) {
  //         console.error("❌ Failed to fetch NetRV:", err.response?.data || err.message);
  //         setNetRv(0);
  //       }
  
  //       // 3️⃣ Fetch Hearing RV (Rental Value)
  //       let hearingRVData = {};
  //       try {
  //         hearingRVData = await fetchHearingRV(ownerId);
  //         console.log("Fetched HearingRV Data (service):", hearingRVData);
  //         setHearingRV(hearingRVData.totalRentalValue || 0);
  //       } catch (err) {
  //         console.error("❌ Failed to fetch HearingRV:", err.response?.data || err.message);
  //         setHearingRV(0);
  //       }
  //       //court
  //       let CourtRVData = {};
  //       try {
  //         CourtRVData = await fetchCourtRV(ownerId);
  //         console.log("Fetched CourtRVData Data (service):", CourtRVData);
  //         setCourtResRV(CourtRVData.totalCourtRentalValue || 0);
  //       } catch (err) {
  //         console.error("❌ Failed to fetch CourtRVData:", err.response?.data || err.message);
  //         setCourtResRV(0);
  //       }
  
  //       // 4️⃣ Combine Everything into AppealInfo
  //       const updatedAppealInfo = {
  //         OwnerId: ownerInfo.OwnerID,
  //         OwnerName: ownerInfo.combinedownerrenternames?.[0]?.MarathiOwnerName || "",
  //         RenterName: ownerInfo.combinedownerrenternames?.[0]?.MarathiRenterName || "",
  //         OccupierName: ownerInfo.combinedownerrenternames?.[0]?.MarathiOccupierName || "",
  //         AppealMast: ownerInfo.appealmasts || [],
  //         RetaintionMast: ownerInfo.retentiontaxmasts || [],
  //         CourtResultMast: ownerInfo.courtresultmasts || [],
  //         HearingMast: ownerInfo.hearingmasts || [],
  
  //         NetRV: {
  //           total: netRVData.totalRateableValue || 0,
  //           rows: ownerInfo.netRV?.rows || [],
  //         },
  
  //         HearingRV: {
  //           total: hearingRVData.totalRentalValue || 0,
  //           rows: ownerInfo.hearingmasts || [],
  //         },
  //         CourtResRV: {
  //           total: CourtRVData.totalCourtRentalValue || 0,
  //           rows: ownerInfo.courtresultmasts || [],
  //         },
  //       };
  
  //       SetAppealInfo(updatedAppealInfo);
  
  //       console.log("✅ Updated Appeal Info with NetRV & HearingRV:", updatedAppealInfo);
  //     })
  //     .catch((error) => {
  //       console.error("Error Fetching Owner Appeal Info:", error);
  //     });
  // }
  
function SetOwnerAppealInfo(ownerId) { 
  fetchAppealAllInfo(ownerId)
    .then(async (ownerInfo) => {
      console.log(ownerInfo, "ownerInfo");

      // Set Old RV
      if (ownerInfo.oldDetail && ownerInfo.oldDetail.length > 0) {
        const rv = ownerInfo.oldDetail[0].OldRV ?? 0;
        setOldRv(rv);
      } else {
        setOldRv(0);
      }
      let netRVData = {};
      try {
        netRVData = await fetchOwnerRateableValue(ownerId); // ✅ service call
        console.log("Fetched NetRV Data (service):", netRVData);
      
        setNetRv(netRVData.totalRateableValue || 0);
      } catch (err) {
        console.error("❌ Failed to fetch NetRV:", err.response?.data || err.message);
        setNetRv(0);
      }
      

      // Set Appeal Info
      SetAppealInfo({
        OwnerId: ownerInfo.OwnerID,
        OwnerName: ownerInfo.combinedownerrenternames[0]?.MarathiOwnerName || "",
        RenterName: ownerInfo.combinedownerrenternames[0]?.MarathiRenterName || "",
        OccupierName: ownerInfo.combinedownerrenternames[0]?.MarathiOccupierName || "",
        AppealMast: (ownerInfo.appealmasts || []).filter(a => a.Reason?.toLowerCase() === "appeal committee"),
        RetaintionMast: ownerInfo.retentiontaxmasts || [],
        CourtResultMast: ownerInfo.courtresultmasts || [],
        HearingMast: ownerInfo.hearingmasts || [],
        NetRV: {
          total: netRVData.totalRateableValue || 0, // total sum
          rows: ownerInfo.netRV?.rows || []          // keep individual rows if available
        }
      });
     
    })
    .catch((error) => {
      console.log("Error Fetching Owner Appeal Info", error);
    });
}

 
  
  function getLastRV() {
    let calRV = 0;
    if (courtResRV > 0) calRV = courtResRV;
    else if (appealCommRV > 0) calRV = appealCommRV;
    else if (hearingRV > 0) calRV = hearingRV;
    else if (retainRV > 0) calRV = retainRV;
    else if (netRv > 0) calRV = netRv;
    else calRV = oldRV;

    return calRV;
  }

  function SetFactorRV() {
    const calRV = getLastRV();
    const factor = Number(retaintionFactor) || 0;
    // const factRV = factor * calRV;
    let factRV = factor * calRV;

  // Round up to 2 decimal places
  factRV = Math.ceil(factRV * 100) / 100;
    setCustomRV(factRV);
  }

  function SetIncrementRV() {
    const calRV = Number(getLastRV()) || 0;
    const incrPercent = Number(incrementList) || 0;
  
    // percentage of current RV
    let diff = (incrPercent / 100) * calRV;
  
    let incrRV = rdbIncr === 'Increment' ? calRV + diff : calRV - diff;
  
    // Round up to 2 decimal places
    incrRV = Math.round(incrRV * 100) / 100;
  
    setCustomRV(incrRV);
  
    // 🔑 Immediately push this new RV to the right slab
    if (appealReson) {
      SetCalculatedRV(appealReson);
    }
  }
  

  const handleRadioButton = (e) => {
    setCustomRV(0);
    setRdbIncr(e.target.value);
  };
  const [overrideReason, setOverrideReason] = useState(null);
  async function SetCalculatedRV(reason) {
    try {
      setTableLoading(true);   
  
      const custRV = customRV;
  
      if (reason === "retention") {
        setRetainRV(custRV);
      } else if (reason === "hearing") {
        setHearingRV(custRV);
      } else if (reason === "appeal committee") {
        setAppealCommRV(custRV);
      } else if (reason === "remission") {
        setCourtResRV(custRV);
      }
  
      setOverrideReason(reason);
  
      await calculateAllTaxes();  // wait until taxes recalc
    } finally {
      setTableLoading(false);  // 🔹 loader band
    }
  }
  
  
  // function SetCalculatedRV(reason) {
  //   const custRV = customRV;
  
  //   if (reason === "retention") {
  //     setRetainRV(custRV);
  //   } else if (reason === "hearing") {
  //     setHearingRV(custRV);
  //   } else if (reason === "appeal committee") {
  //     setAppealCommRV(custRV);
  //   } else if (reason === "remission") {
  //     setCourtResRV(custRV);
  //   }
  //    setOverrideReason(reason);
  // calculateAllTaxes();
  // }
  //Emp id
  const [empID, setEmpID] = useState(null);


  useEffect(() => {
    const getPageID = async () => {
      const pageIdAppeal = 'Zoning';
      try {
        const fetchedPageID = await getPageIDByPageName(pageIdAppeal);
        console.log(fetchedPageID, 'fetchedPageID' + ` ${pageIdAppeal}`);
        setEmpID(fetchedPageID.PageID);
      } catch (error) {
        console.error('Error fetching page ID:', error);
      }
    };
    getPageID();
  }, []);
  
  // 2️⃣ EmpID fetch (logged-in user)
 
    const mapAppealInfoForBackend = (appealInfo, appealReson) => {
      const netRV = appealInfo.NetRV || 0;
    const retainRV = appealInfo.RetainRV || 0;
    const hearingRV = appealInfo.HearingRV || 0;
    const appealCommitteeRV = appealInfo.AppealCommitteeRV || 0;
    const courtRV = appealInfo.CourtRV || 0;

    
      return {
        OwnerID: appealInfo.OwnerId,
        OwnerName: appealInfo.OwnerName,
        RenterName: appealInfo.RenterName,
        OccupierName: appealInfo.OccupierName,
        AppealReason: appealReson,  
        WardNo: ward, 
        EmpID: empID  ,
        Date: startDate
        ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`
        : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,
        
      PropertyNo: propNo,     
      PartitionNo: partNo,  
  Year: financialYear
    ? parseInt(financialYear.split("-")[0])   // "2023-2024" → 2023
    : new Date().getFullYear(),
          AppealMast: appealInfo.AppealMast || [],
        RetaintionMast: appealInfo.RetaintionMast || [],
        CourtResultMast: appealInfo.CourtResultMast || [],
        HearingMast: appealInfo.HearingMast || [],
        CreatedBy: appealInfo.CreatedBy || 1,
        UpdatedBy: appealInfo.UpdatedBy || 1
      };
    };
  

2

//calcaution

// State to hold taxable values per slab
const [taxableValues, setTaxableValues] = useState({
  Net: {},
  Retain: {},
  Hearing: {},
  Appeal: {},
  Court: {},
});
const calculateAllTaxes = async () => {
  const slabs = [
    { key: "Net", rv: netRv },
    { key: "Retain", rv: retainRV },
    { key: "Hearing", rv: hearingRV },
    { key: "Appeal", rv: appealCommRV },
    { key: "Court", rv: courtResRV },
  ];

  const result = {}; // ✅ no : any

  for (const slab of slabs) {
    const slabResult = {}; // ✅ no : any
    console.groupCollapsed(`📊 Slab Calculation -> ${slab.key} (RV: ${slab.rv})`);

    for (const tax of taxNameList) {
      try {
        const rateData = await fetchTaxRateByAmount(slab.rv, tax.TaxName);
        const ownerFactor = ownerTaxes?.[0]?.[tax.TaxName] ?? 0;
        const rate = rateData?.rate ?? 0;

        const taxValue = (slab.rv || 0) * (rate / 100) * ownerFactor;
        const roundedValue = Math.ceil(taxValue * 100) / 100;

        slabResult[tax.TaxName] = roundedValue;

        console.log(
          `➡️ Tax: ${tax.TaxName.padEnd(15)} | Rate: ${rate}% | RV: ${slab.rv} | ownerFactor: ${ownerFactor} | Final Tax: ${roundedValue}`
        );
      } catch (err) {
        slabResult[tax.TaxName] = 0;
      }
    }

    console.groupEnd();
    result[slab.key] = slabResult;
  }

  setTaxableValues(result);
  console.log("✅ Final Tax Calculation with backend rates:", result);
};


// 🔹 useEffect calls it automatically on dependencies
useEffect(() => { 
  if (!appealInfo || !taxNameList?.length) return;
  calculateAllTaxes();
}, [appealInfo, taxNameList, netRv, retainRV, hearingRV, appealCommRV, courtResRV, ownerTaxes]);

// 🔹 Button click can now call it
// Function to apply policies and update taxes
const [showL2Dialog, setShowL2Dialog] = useState(false);
const [l2Password, setL2Password] = useState('');
const [pendingTableData, setPendingTableData] = useState(null);
const [loading, setLoading] = useState(false);
const [showAdminDialog, setShowAdminDialog] = useState(false);

const handleApplyPolicies = (tableData) => {
  if (!appealReson) {
    alert("⚠️ Please select an Appeal Reason.");
    return;
  }
  setPendingTableData(tableData);
  setShowL2Dialog(true);
};

// const confirmApplyWithL2 = async () => {
//   if (!l2Password) {
//     setSnackbarMessage("Please enter L2 password.");
//     setSnackbarSeverity("warning");
//     setSnackbarOpen(true);
//         return;
//   }

//   try {
//     setLoading(true);

//     // 🔑 Step 1: Validate L2 Password
//     const passwordCheckResponse = await levelPassword("L2", l2Password);
//     if (passwordCheckResponse.status !== 200) {
//       setSnackbarMessage("❌ Invalid L2 password.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);   
//          return;
//     }

//     // 🔑 Step 2: Build payload
//     const payload = mapAppealInfoForBackend(appealInfo, appealReson);
//     // payload.AppealMast = pendingTableData?.Appeal || [];
//     payload.Mode = "apply";
//     if (appealReson === "appeal committee") {

//     payload.AppealMast = [
//       {
//         ...(pendingTableData?.Appeal || {}),
//         RentalValue: appealCommRV || 0,   
//         PropertyTax: pendingTableData?.appealCommRV?.PropertyTax || 0,
//         EducationTax: pendingTableData?.appealCommRV?.EducationTax || 0,
//         EmploymentTax: pendingTableData?.appealCommRV?.EmploymentTax || 0,
//         TreeCess: pendingTableData?.appealCommRV?.TreeCess || 0,
//         SpEducationTax: pendingTableData?.appealCommRV?.SpEducationTax || 0,
//         Sanitation: pendingTableData?.appealCommRV?.Sanitation || 0,
//         DrainCess: pendingTableData?.appealCommRV?.DrainCess || 0,
//         SpWaterCess: pendingTableData?.appealCommRV?.SpWaterCess || 0,
//         RoadCess: pendingTableData?.appealCommRV?.RoadCess || 0,
//         FireCess: pendingTableData?.appealCommRV?.FireCess || 0,
//         LightCess: pendingTableData?.appealCommRV?.LightCess || 0,
//         WaterBenefit: pendingTableData?.appealCommRV?.WaterBenefit || 0,
//         WaterBill: pendingTableData?.appealCommRV?.WaterBill || 0,
//         SewageDisposalCess: pendingTableData?.appealCommRV?.SewageDisposalCess || 0,
//         Tax1: pendingTableData?.appealCommRV?.Tax1 || 0,
//         Tax2: pendingTableData?.appealCommRV?.Tax2 || 0,
//         Tax3: pendingTableData?.appealCommRV?.Tax3 || 0,
//         Tax4: pendingTableData?.appealCommRV?.Tax4 || 0,
//         Tax5: pendingTableData?.appealCommRV?.Tax5 || 0
//       }
//     ]; }
//     if (appealReson === "retention") {

//     payload.RetaintionMast = [
//       {
//         ...(pendingTableData?.Retain || {}),
//         RentalValue: retainRV || 0,   // ✅ now rental value saved in correct table
//         PropertyTax: pendingTableData?.Retain?.PropertyTax || 0,
//         EducationTax: pendingTableData?.Retain?.EducationTax || 0,
//         EmploymentTax: pendingTableData?.Retain?.EmploymentTax || 0,
//         TreeCess: pendingTableData?.Retain?.TreeCess || 0,
//         SpEducationTax: pendingTableData?.Retain?.SpEducationTax || 0,
//         Sanitation: pendingTableData?.Retain?.Sanitation || 0,
//         DrainCess: pendingTableData?.Retain?.DrainCess || 0,
//         SpWaterCess: pendingTableData?.Retain?.SpWaterCess || 0,
//         RoadCess: pendingTableData?.Retain?.RoadCess || 0,
//         FireCess: pendingTableData?.Retain?.FireCess || 0,
//         LightCess: pendingTableData?.Retain?.LightCess || 0,
//         WaterBenefit: pendingTableData?.Retain?.WaterBenefit || 0,
//         WaterBill: pendingTableData?.Retain?.WaterBill || 0,
//         SewageDisposalCess: pendingTableData?.Retain?.SewageDisposalCess || 0,
//         Tax1: pendingTableData?.Retain?.Tax1 || 0,
//         Tax2: pendingTableData?.Retain?.Tax2 || 0,
//         Tax3: pendingTableData?.Retain?.Tax3 || 0,
//         Tax4: pendingTableData?.Retain?.Tax4 || 0,
//         Tax5: pendingTableData?.Retain?.Tax5 || 0
//       }
//     ];}
//     if (appealReson === "court result") {
      
  
//         payload.CourtResultMast = [
//       {
//         ...(pendingTableData?.Retain || {}),
//         RentalValue: courtResRV || 0,   
//         PropertyTax: pendingTableData?.Court?.PropertyTax || 0,
//         EducationTax: pendingTableData?.Court?.EducationTax || 0,
//         EmploymentTax: pendingTableData?.Court?.EmploymentTax || 0,
//         TreeCess: pendingTableData?.Court?.TreeCess || 0,
//         SpEducationTax: pendingTableData?.Court?.SpEducationTax || 0,
//         Sanitation: pendingTableData?.Court?.Sanitation || 0,
//         DrainCess: pendingTableData?.Court?.DrainCess || 0,
//         SpWaterCess: pendingTableData?.Court?.SpWaterCess || 0,
//         RoadCess: pendingTableData?.Court?.RoadCess || 0,
//         FireCess: pendingTableData?.Court?.FireCess || 0,
//         LightCess: pendingTableData?.Court?.LightCess || 0,
//         WaterBenefit: pendingTableData?.Court?.WaterBenefit || 0,
//         WaterBill: pendingTableData?.Court?.WaterBill || 0,
//         SewageDisposalCess: pendingTableData?.Court?.SewageDisposalCess || 0,
//         Tax1: pendingTableData?.Court?.Tax1 || 0,
//         Tax2: pendingTableData?.Court?.Tax2 || 0,
//         Tax3: pendingTableData?.Court?.Tax3 || 0,
//         Tax4: pendingTableData?.Court?.Tax4 || 0,
//         Tax5: pendingTableData?.Court?.Tax5 || 0
//       }
//     ];}
//     if (appealReson === "hearing") {
     
//     payload.HearingMast = [
//       {
//         ...(pendingTableData?.Hearing || {}),
//         RentalValue: hearingRV || 0,   
//         PropertyTax: pendingTableData?.Hearing.PropertyTax || 0,
//         EducationTax: pendingTableData?.Hearing.EducationTax || 0,
//         EmploymentTax: pendingTableData?.Hearing.EmploymentTax || 0,
//         TreeCess: pendingTableData?.Hearing.TreeCess || 0,
//         SpEducationTax: pendingTableData?.Hearing.SpEducationTax || 0,
//         Sanitation: pendingTableData?.Hearing.Sanitation || 0,
//         DrainCess: pendingTableData?.Hearing.DrainCess || 0,
//         SpWaterCess: pendingTableData?.Hearing.SpWaterCess || 0,
//         RoadCess: pendingTableData?.Hearing.RoadCess || 0,
//         FireCess: pendingTableData?.Hearing.FireCess || 0,
//         LightCess: pendingTableData?.Hearing.LightCess || 0,
//         WaterBenefit: pendingTableData?.Hearing.WaterBenefit || 0,
//         WaterBill: pendingTableData?.Hearing.WaterBill || 0,
//         SewageDisposalCess: pendingTableData?.Hearing.SewageDisposalCess || 0,
//         Tax1: pendingTableData?.Hearing.Tax1 || 0,
//         Tax2: pendingTableData?.Hearing.Tax2 || 0,
//         Tax3: pendingTableData?.Hearing.Tax3 || 0,
//         Tax4: pendingTableData?.Hearing.Tax4 || 0,
//         Tax5: pendingTableData?.Hearing?.Tax5 || 0
//       }
//     ];  } 
//    // payload.HearingMast = pendingTableData?.Hearing || [];

//     console.log("📦 Sending payload (after L2 auth):", payload);

//     // 🔑 Step 3: Apply policies
//     const res = await applyPolicies(payload);
//     console.log("✅ Policy applied successfully:", res);

//     if (appealInfo.OwnerId) {
//       await calculateAllTaxes();
//     }

//     setSnackbarMessage("✅ All AppealReason rows processed successfully.");
//     setSnackbarSeverity("success");
//     setSnackbarOpen(true);
//     } catch (err) {
//     console.error("❌ Error Applying Policy:", err);
//     setSnackbarMessage("Error: " + (err.response?.data?.message || err.message));
//     setSnackbarSeverity("error");
//     setSnackbarOpen(true);
//     } finally {
//     setLoading(false);
//     setShowL2Dialog(false);
//     setL2Password('');
//     setPendingTableData(null);
//   }
// };
//delete

const confirmApplyWithL2 = async () => {
  if (!l2Password) {
    setSnackbarMessage("Please enter L2 password.");
    setSnackbarSeverity("warning");
    setSnackbarOpen(true);
    return;
  }

  try {
    setLoading(true);

    // 🔑 Step 1: Validate L2 Password
    const passwordCheckResponse = await levelPassword("L2", l2Password);
    if (passwordCheckResponse.status !== 200) {
      setSnackbarMessage("❌ Invalid L2 password.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // 🔑 Step 2: Build payload
    const payload = mapAppealInfoForBackend(appealInfo, appealReson);
    payload.Mode = "apply";

    // 🟩 APPEAL COMMITTEE
    if (appealReson === "appeal committee") {
      payload.AppealMast = [
        {
          ...(pendingTableData?.Appeal || {}),
          RentalValue: appealCommRV || 0,
          PropertyTax: pendingTableData?.Appeal?.PropertyTax || 0,
          EducationTax: pendingTableData?.Appeal?.EducationTax || 0,
          EmploymentTax: pendingTableData?.Appeal?.EmploymentTax || 0,
          TreeCess: pendingTableData?.Appeal?.TreeCess || 0,
          SpEducationTax: pendingTableData?.Appeal?.SpEducationTax || 0,
          Sanitation: pendingTableData?.Appeal?.Sanitation || 0,
          DrainCess: pendingTableData?.Appeal?.DrainCess || 0,
          SpWaterCess: pendingTableData?.Appeal?.SpWaterCess || 0,
          RoadCess: pendingTableData?.Appeal?.RoadCess || 0,
          FireCess: pendingTableData?.Appeal?.FireCess || 0,
          LightCess: pendingTableData?.Appeal?.LightCess || 0,
          WaterBenefit: pendingTableData?.Appeal?.WaterBenefit || 0,
          WaterBill: pendingTableData?.Appeal?.WaterBill || 0,
          SewageDisposalCess: pendingTableData?.Appeal?.SewageDisposalCess || 0,
          Tax1: pendingTableData?.Appeal?.Tax1 || 0,
          Tax2: pendingTableData?.Appeal?.Tax2 || 0,
          Tax3: pendingTableData?.Appeal?.Tax3 || 0,
          Tax4: pendingTableData?.Appeal?.Tax4 || 0,
          Tax5: pendingTableData?.Appeal?.Tax5 || 0
        },
      ];
    }

    // 🟦 RETENTION
    if (appealReson === "retention") {
      payload.RetaintionMast = [
        {
          ...(pendingTableData?.Retain || {}),
          RentalValue: retainRV || 0,
          PropertyTax: pendingTableData?.Retain?.PropertyTax || 0,
          EducationTax: pendingTableData?.Retain?.EducationTax || 0,
          EmploymentTax: pendingTableData?.Retain?.EmploymentTax || 0,
          TreeCess: pendingTableData?.Retain?.TreeCess || 0,
          SpEducationTax: pendingTableData?.Retain?.SpEducationTax || 0,
          Sanitation: pendingTableData?.Retain?.Sanitation || 0,
          DrainCess: pendingTableData?.Retain?.DrainCess || 0,
          SpWaterCess: pendingTableData?.Retain?.SpWaterCess || 0,
          RoadCess: pendingTableData?.Retain?.RoadCess || 0,
          FireCess: pendingTableData?.Retain?.FireCess || 0,
          LightCess: pendingTableData?.Retain?.LightCess || 0,
          WaterBenefit: pendingTableData?.Retain?.WaterBenefit || 0,
          WaterBill: pendingTableData?.Retain?.WaterBill || 0,
          SewageDisposalCess: pendingTableData?.Retain?.SewageDisposalCess || 0,
          Tax1: pendingTableData?.Retain?.Tax1 || 0,
          Tax2: pendingTableData?.Retain?.Tax2 || 0,
          Tax3: pendingTableData?.Retain?.Tax3 || 0,
          Tax4: pendingTableData?.Retain?.Tax4 || 0,
          Tax5: pendingTableData?.Retain?.Tax5 || 0,
        },
      ];
    }

    // 🟨 HEARING
    if (appealReson === "hearing") {
      payload.HearingMast = [
        {
          ...(pendingTableData?.Hearing || {}),
          RentalValue: hearingRV || 0,
          PropertyTax: pendingTableData?.Hearing?.PropertyTax || 0,
          EducationTax: pendingTableData?.Hearing?.EducationTax || 0,
          EmploymentTax: pendingTableData?.Hearing?.EmploymentTax || 0,
          TreeCess: pendingTableData?.Hearing?.TreeCess || 0,
          SpEducationTax: pendingTableData?.Hearing?.SpEducationTax || 0,
          Sanitation: pendingTableData?.Hearing?.Sanitation || 0,
          DrainCess: pendingTableData?.Hearing?.DrainCess || 0,
          SpWaterCess: pendingTableData?.Hearing?.SpWaterCess || 0,
          RoadCess: pendingTableData?.Hearing?.RoadCess || 0,
          FireCess: pendingTableData?.Hearing?.FireCess || 0,
          LightCess: pendingTableData?.Hearing?.LightCess || 0,
          WaterBenefit: pendingTableData?.Hearing?.WaterBenefit || 0,
          WaterBill: pendingTableData?.Hearing?.WaterBill || 0,
          SewageDisposalCess: pendingTableData?.Hearing?.SewageDisposalCess || 0,
          Tax1: pendingTableData?.Hearing?.Tax1 || 0,
          Tax2: pendingTableData?.Hearing?.Tax2 || 0,
          Tax3: pendingTableData?.Hearing?.Tax3 || 0,
          Tax4: pendingTableData?.Hearing?.Tax4 || 0,
          Tax5: pendingTableData?.Hearing?.Tax5 || 0,
        },
      ];
    }

    // 🟥 COURT RESULT
    if (appealReson === "court result" || appealReson === "remission") {
      payload.CourtResultMast = [
        {
          ...(pendingTableData?.Court || {}),
          RentalValue: courtResRV || 0,
          PropertyTax: pendingTableData?.Court?.PropertyTax || 0,
          EducationTax: pendingTableData?.Court?.EducationTax || 0,
          EmploymentTax: pendingTableData?.Court?.EmploymentTax || 0,
          TreeCess: pendingTableData?.Court?.TreeCess || 0,
          SpEducationTax: pendingTableData?.Court?.SpEducationTax || 0,
          Sanitation: pendingTableData?.Court?.Sanitation || 0,
          DrainCess: pendingTableData?.Court?.DrainCess || 0,
          SpWaterCess: pendingTableData?.Court?.SpWaterCess || 0,
          RoadCess: pendingTableData?.Court?.RoadCess || 0,
          FireCess: pendingTableData?.Court?.FireCess || 0,
          LightCess: pendingTableData?.Court?.LightCess || 0,
          WaterBenefit: pendingTableData?.Court?.WaterBenefit || 0,
          WaterBill: pendingTableData?.Court?.WaterBill || 0,
          SewageDisposalCess: pendingTableData?.Court?.SewageDisposalCess || 0,
          Tax1: pendingTableData?.Court?.Tax1 || 0,
          Tax2: pendingTableData?.Court?.Tax2 || 0,
          Tax3: pendingTableData?.Court?.Tax3 || 0,
          Tax4: pendingTableData?.Court?.Tax4 || 0,
          Tax5: pendingTableData?.Court?.Tax5 || 0,
        },
      ];
    }

    console.log("📦 Sending payload (after L2 auth):", payload);

    // 🔑 Step 3: Apply policies
    const res = await applyPolicies(payload);
    console.log("✅ Policy applied successfully:", res);

    if (appealInfo.OwnerId) {
      await calculateAllTaxes();
    }

    setSnackbarMessage("✅ All AppealReason rows processed successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  } catch (err) {
    console.error("❌ Error Applying Policy:", err);
    setSnackbarMessage("Error: " + (err.response?.data?.message || err.message));
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
    setShowL2Dialog(false);
    setL2Password("");
    setPendingTableData(null);
  }
};

const [adminpassword, setAdminPassword] = useState("");

  // const handleDelete = async (appealInfo, reason) => {
  //   if (!adminpassword) {
  //     setSnackbarMessage("❌ Please enter password to confirm.");
  //     setSnackbarSeverity("error");
  //     setSnackbarOpen(true);
  //     return;
  //   }
  //   const reasonMap = {
  //     retention: 1,
  //     hearing: 2,
  //     'appeal committee': 3,
  //     remission: 4
  //   };

  //   const payload = {
  //     ...mapAppealInfoForBackend(appealInfo, reason),
  //     SelectOne: reasonMap[reason],  
  //     Mode: "manual" | "apply",
  //     OwnerIDList: ""
  //   };

  //   try {
  //     const result = await resetAppealService(payload);
  //     console.log("Appeal deleted:", result.message);
  //     setSnackbarMessage("✅ Appeal deleted successfully.");
  //     setSnackbarSeverity("success");
  //     setSnackbarOpen(true);
  //   } catch (err) {
  //     console.error("Failed to delete appeal:", err.message || err);
  //   setSnackbarMessage("❌ Failed to delete appeal. Please try again.");
  //   setSnackbarSeverity("error");
  //   setSnackbarOpen(true);
  //   }
  // };

  const handleDelete = async () => {
    if (!adminpassword) {
      setSnackbarMessage("Please enter Admin password.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      setLoading(true);
  
      // ✅ Step 1: Validate Admin Password
      const passwordCheckResponse = await levelPassword("Admin", adminpassword);
      if (passwordCheckResponse.status !== 200) {
        setSnackbarMessage("❌ Invalid Admin password.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      // ✅ Step 2: Prepare delete payload
      const reasonMap = {
        retention: 1,
        hearing: 2,
        'appeal committee': 3,
        remission: 4
      };
  
      const payload = {
        ...mapAppealInfoForBackend(appealInfo, appealReson),
        SelectOne: reasonMap[appealReson],
        Mode: "manual",
        OwnerIDList: "",
        Reason: appealReson,  
      };
  
      // ✅ Step 3: Call delete service
      const result = await resetAppealService(payload);
      console.log("Appeal deleted:", result.message);
  
      setSnackbarMessage("✅ Appeal deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to delete appeal:", err.message || err);
      setSnackbarMessage("❌ Failed to delete appeal. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setOpen(false);
      setAdminPassword("");
    }
  };
  
  const onConfirmDelete = () => {
    handleDelete();
  };
  
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // const onConfirmDelete = () => {
  //   handleDelete(appealInfo, appealReson);
  //   setAdminPassword("");
  //   handleClose();
  // };
  const normalizeRow = (row) => ({
    PropertyTax: Number(row.PropertyTax) || 0,
    EducationTax: Number(row.EducationTax) || 0,
    EmploymentTax: Number(row.EmploymentTax) || 0,
    TreeCess: Number(row.TreeCess) || 0,
    SpEducationTax: Number(row.SpEducationTax) || 0,
    Sanitation: Number(row.Sanitation) || 0,
    DrainCess: Number(row.DrainCess) || 0,
    SpWaterCess: Number(row.SpWaterCess) || 0,
    RoadCess: Number(row.RoadCess) || 0,
    FireCess: Number(row.FireCess) || 0,
    LightCess: Number(row.LightCess) || 0,
    WaterBenefit: Number(row.WaterBenefit) || 0,
    WaterBill: Number(row.WaterBill) || 0,
    Tax2: Number(row.Tax2) || 0,
    Tax3: Number(row.Tax3) || 0,
    Tax4: Number(row.Tax4) || 0,
    Tax5: Number(row.Tax5) || 0
  });

  const preparedRows = {
    Net: taxableValues.Net,
    Retain: appealInfo.RetaintionMast?.[0] ? normalizeRow(appealInfo.RetaintionMast[0]) : taxableValues.Retain,
    Hearing: appealInfo.HearingMast?.[0] ? normalizeRow(appealInfo.HearingMast[0]) : taxableValues.Hearing,
    Appeal: appealInfo.AppealMast?.[0] ? normalizeRow(appealInfo.AppealMast[0]) : taxableValues.Appeal,
    Court: appealInfo.CourtResultMast?.[0] ? normalizeRow(appealInfo.CourtResultMast[0]) : taxableValues.Court
  };

  useEffect(() => {
    if (!appealInfo.OwnerId) return;
  
    const loadAll = async () => {
      setTableLoading(true);
      setIsValueReady(false);   // ⛔ wait mode ON
  
      await calculateAllTaxes(); // all async work
  
      setIsValueReady(true);    // ✅ value confirmed
      setTableLoading(false);
    };
  
    loadAll();
  }, [
    appealInfo.OwnerId,
    netRv,
    retainRV,
    hearingRV,
    appealCommRV,
    courtResRV,
  ]);
  
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
        <MainCard title="Appeal">
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={5} lg={6}>
              <MainCard>
                <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Prime Information:
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Year</InputLabel>
                      <Select onChange={handleChangeYear} style={{ height: '35px' }} value={financialYear} disabled={accessLevel < 3}>
                        <MenuItem value="" disabled>
                          Select Option
                        </MenuItem>
                        {financialYearList.map((fin) => (
                          <MenuItem key={fin.FinanceYearRange} value={fin.FinanceYearRange}>
                            {fin.FinanceYearRange}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Stack spacing={1}>
                      <InputLabel>Zone No.</InputLabel>
                      <TextField
                        required
                        id="ZoneNoBasic"
                        name="ZoneNo"
                        placeholder="Zone No."
                        fullWidth
                        autoComplete="given-name"
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={2.5}>
                    <Stack spacing={1}>
                      <InputLabel>Ward No.</InputLabel>
                      {/* <TextField required id="ZoneNoBasic" name="ZoneNo" placeholder="Ward No." fullWidth autoComplete="given-name" /> */}
                      <Select onChange={handleWard}  MenuProps={MenuProps}   style={{ height: '35px' }} fullWidth value={ward} disabled={accessLevel < 3}>
                        <MenuItem value="" disabled>
                          Select Option
                        </MenuItem>
                        {wardList
        .slice()
        .sort((a, b) => a.NewWardNo - b.NewWardNo) // ascending order
        .map((wd) => (
          <MenuItem key={wd.NewWardNo} value={wd.NewWardNo}>
            {wd.NewWardNo}
          </MenuItem>
        ))}
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={2.5}>
                    <Stack spacing={1}>
                      <InputLabel>Property No.</InputLabel>
                      {/* <TextField required id="ZoneNoBasic" name="ZoneNo" placeholder="Property No." fullWidth autoComplete="given-name" /> */}
                      <Autocomplete
                        id="personal-country"
                        fullWidth
                        value={propNo}
                        onChange={(_, newValue) => {
                          setPropNo(newValue === null ? '' : newValue.split('-')[0]);
                          setPartNo(newValue === null ? '' : newValue.split('-').length == 1 ? '' : newValue.split('-')[1]);
                          FetchOwnerIdFromWardPropNo(
                            ward,
                            newValue === null ? '' : newValue.split('-')[0],
                            newValue === null ? '' : newValue.split('-').length == 1 ? '' : newValue.split('-')[1]
                          );
                        }}
                        disabled={accessLevel < 3}

                        options={propList}
                        autoHighlight
                        ListboxProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * VISIBLE_ITEMS, 
                            overflow: 'auto'
                          }
                        }}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            placeholder="Property No"
                            name="country"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: 'new-password' // disable autocomplete and autofill
                            }}
                            disabled={accessLevel < 3}
                          />
                        )}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Stack spacing={1}>
                      <InputLabel>Partition No.</InputLabel>
                      <TextField
                        required
                        id="ZoneNoBasic"
                        name="ZoneNo"
                        value={partNo}
                        disabled
                        placeholder="Partition No."
                        fullWidth
                        autoComplete="given-name"
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={2.7}>
                    <Stack sx={{ mt: 1.5 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Owner Name: </InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={9.3}>
                    <Stack spacing={1}>
                      <TextField
                        required
                        id="ZoneNoBasic"
                        name="ZoneNo"
                        value={appealInfo.OwnerName}
                        placeholder="Owner Name"
                        fullWidth
                        autoComplete="given-name"
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={2.7}>
                    <Stack sx={{ mt: 1.5 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}>Renter Name:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={9.3}>
                    <Stack spacing={1}>
                      <TextField
                        required
                        id="ZoneNoBasic"
                        value={appealInfo.RenterName || ""}        
                                        name="ZoneNo"
                        placeholder="Renter Name"
                        fullWidth
                        autoComplete="given-name"
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={2.7}>
                    <Stack sx={{ mt: 1.5 }} spacing={1}>
                      <InputLabel style={{ fontWeight: 'bold' }}> Occuiper Name:</InputLabel>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sm={9.3}>
                    <Stack spacing={1}>
                      <TextField
                        required
                        id="ZoneNoBasic"
                        value={appealInfo.OccupierName || ""}                 
                                name="OccupierName"
                                                        placeholder="Occupier Name"

                         fullWidth
                        autoComplete="given-name"
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
              <Grid sx={{ mt: 2 }}>
                <MainCard>
                  <Typography variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                    Appeal Status:
                  </Typography>
                  <Grid sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center">
                      <Checkbox disabled checked={appealInfo.RetaintionMast.length > 0 ? true : false} />
                      <span>Retain (Appeal)</span>
                      <Checkbox disabled checked={appealInfo.HearingMast.length > 0 ? true : false} />
                      <span>Hearing</span>
                      <Checkbox disabled checked={appealInfo.RetaintionMast.length > 0 ? true : false} />
                      <span>Appeal Committee</span>
                      <Checkbox disabled checked={appealInfo.CourtResultMast.length > 0 ? true : false} />
                      <span>Court Result</span>
                    </Stack>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5} lg={6}>
              <MainCard>
                <Grid item xs={12} md={5} lg={6}>
                  <Typography variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                    Functionality Appeal Process:
                  </Typography>
                  <Grid item xs={6} sm={12}>
                    <Stack spacing={1} mt={2}>
                    <Select
  value={appealReson}
  // onChange={(e) => setAppealReson(e.target.value)}
  onChange={(e) => {
    const selectedReason = e.target.value;
    setAppealReson(selectedReason);
    SetCalculatedRV(selectedReason); 
  }}
  displayEmpty
  inputProps={{ 'aria-label': 'Appeal Reason' }}
  sx={{ bgcolor: '#F5F5F5' }}
  disabled={accessLevel < 3}
>
  <MenuItem value="retention">Retention</MenuItem>
  <MenuItem value="hearing">Hearing</MenuItem>
  <MenuItem value="appeal committee">Appeal Committee</MenuItem>
  <MenuItem value="remission">Court Result</MenuItem>
</Select>

                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={5} lg={6}>
                    <MainCard>
                      <Grid>
                        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                          <Stack spacing={1} direction="row" alignItems="center">
                            <span>Set As</span>
                            <Select
                              value={retaintionFactor}
                              onChange={handleRetainFactor}
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                              sx={{ minWidth: '7vw' }}
                              disabled={accessLevel < 3}
                            >
                              <MenuItem value="" disabled>
                                Select Option
                              </MenuItem>
                              {retaintionFactorList.map((retain) => (
                                <MenuItem key={retain.FactorValue} value={retain.FactorValue}>
                                  {retain.FactorValue}
                                </MenuItem>
                              ))}
                            </Select>
                            <Grid item xs={2}>
                              <Button
                                sx={{ padding: '10px 5px', fontSize: '0.75rem' }}
                                variant="contained"
                                onClick={SetFactorRV}
                                disabled={accessLevel < 3}
                              >
                                Set
                              </Button>
                            </Grid>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{ mt: 2, ml: 2 }}>
                          <RadioGroup
                            aria-label="gender"
                            defaultValue="Increment"
                            name="radio-buttons-group"
                            row
                            value={rdbIncr}
                            onChange={handleRadioButton}
                            disabled={accessLevel < 3}
                          >
                            <FormControlLabel value="Increment" control={<Radio disabled={accessLevel < 3} />} label="Increment" />

                            <FormControlLabel value="Decrement" control={<Radio disabled={accessLevel < 3} />} label="Decrement" />
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                          <Stack spacing={1} direction="row" alignItems="center">
                            <Select
                              value={incrementList}
                              onChange={handleIncrList}
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                              sx={{ minWidth: '10vw' }}
                              disabled={accessLevel < 3}
                            >
                              <MenuItem value="" disabled>
                                Select Option
                              </MenuItem>
                              {incrList.map((data, index) => (
                                <MenuItem key={index} value={data}>
                                  {data}
                                </MenuItem>
                              ))}
                            </Select>
                            <Grid item xs={1}>
                              <Button
                                sx={{ padding: '10px 5px', fontSize: '0.75rem' }}
                                variant="contained"
                                onClick={SetIncrementRV}
                                disabled={accessLevel < 3}
                              >
                                Set
                              </Button>
                            </Grid>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={10.5} sx={{ mt: 2 }} mb={2}>
                          <Stack spacing={1} direction="row" alignItems="center">
                            <span>RV</span>
                            <TextField value={customRV} disabled={accessLevel < 3}></TextField>
                            <Grid item xs={2}>
                              <Button
                                sx={{ padding: '10px 5px', fontSize: '0.75rem' }}
                                variant="contained"
                                onClick={() => {SetCalculatedRV(appealReson)
                                  setCustomRV("");                                
                                }}
                                   disabled={accessLevel < 3}
                              >
                                Set
                              </Button>
                            </Grid>
                          </Stack>
                        </Grid>
                      </Grid>
                    </MainCard>
                  </Grid>
                  <Grid item xs={12} md={2} lg={6}>
                    <MainCard>
                      <Grid sx={{ mt: 2 }}>
                        <Stack direction="row" alignItems="center">
                          <span style={{ marginLeft: 6, minWidth: '3vw' }}>Issued By:</span>
                          <TextField sx={{ ml: 2, maxWidth: '10vw' }} 
                             value={appealInfo?.OwnerId || ''} 
                         disabled={accessLevel < 3}>
                             InputProps={{ readOnly: true }}
                          </TextField>
                        </Stack>
                        <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
                          <span style={{ marginLeft: 6, minWidth: '3vw' }}>Reason:</span>
                          <Select
                            value={appealReson || 0}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{ minWidth: '9.7vw', ml: 2 }}
                            disabled={accessLevel < 3}
                          >
                            {/* <MenuItem value="" disabled>Select Option</MenuItem> */}
                            <MenuItem value="retention">Retention</MenuItem>
  <MenuItem value="hearing">Hearing</MenuItem>
  <MenuItem value="appeal committee">Appeal Committee</MenuItem>
  <MenuItem value="remission">Court Result</MenuItem>
                          </Select>
                        </Stack>
                        <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
                          <span style={{ marginLeft: 6, minWidth: '3vw' }}>Date:</span>
                          {/* <TextField sx={{ ml: 2, maxWidth: '10vw' }}></TextField> */}
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3} sx={{ ml: 2 }}>
                              <DatePicker value={startDate} onChange={(date) => setStartDate(date)} disabled={accessLevel < 3} />
                            </Stack>
                          </LocalizationProvider>
                        </Stack>
                      </Grid>
                      <Grid>
                        <Stack spacing={1} sx={{ mt: 4 }}>
                          <Button variant="contained" color="success" 
  onClick={() => handleApplyPolicies(taxableValues)}
  disabled={
    accessLevel < 3 ||    
    tableLoading 
    ||        
     !isValueReady          
  }>
                            Apply Policy
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid>
                        <Stack spacing={1} sx={{ mt: 2, mb: 2 }}>
                          <Button variant="contained" color="error" 
 disabled={accessLevel < 4 || !appealInfo}
 onClick={handleClickOpen}>
 Delete Policy
                          </Button>
                        </Stack>
                          <Dialog open={open} onClose={handleClose}>
                          <DialogTitle id="alert-dialog-title" color="error" style={{ fontSize: '24px', fontWeight: 'bold' }}>
    Delete Police</DialogTitle>        <DialogContent>
          <DialogContentText id="alert-dialog-description">
Enter Admin Password          
            <TextField
      autoFocus
      margin="dense"
      label="Admin Password"
      type="password"
      fullWidth
      value={adminpassword}
      onChange={(e) => setAdminPassword(e.target.value)}
    />
        </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={onConfirmDelete} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
                      </Grid>
                    </MainCard>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          </Grid>
          <Grid sx={{ mt: 2 }}>
            <MainCard>
              <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                Assessment Year Slab:
              </Typography>
              <Grid>
                <Stack direction="row" alignItems="center">
                  <InputLabel style={{ fontSize: '18px', color: 'black', fontWeight: 'bold' }} sx={{ ml: 11 }}>
                    Old RV
                  </InputLabel>
                  <InputLabel style={{ fontSize: '18px', color: 'orange', fontWeight: 'bold' }} sx={{ ml: 13 }}>
                    Net RV
                  </InputLabel>
                  <InputLabel style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold' }} sx={{ ml: 13 }}>
                    Retain RV
                  </InputLabel>
                  <InputLabel style={{ fontSize: '18px', color: 'green', fontWeight: 'bold' }} sx={{ ml: 13 }}>
                    Hearing RV
                  </InputLabel>
                  <InputLabel style={{ fontSize: '18px', color: 'red', fontWeight: 'bold' }} sx={{ ml: 13 }}>
                    Appeal Committee RV
                  </InputLabel>
                  <InputLabel style={{ fontSize: '18px', color: 'purple', fontWeight: 'bold' }} sx={{ ml: 13 }}>
                    Court RV
                  </InputLabel>
                </Stack>
              </Grid>
              <Grid sx={{ mt: 1 }}>
                <Stack direction="row" alignItems="center">
                  <TextField sx={{ ml: 10, maxWidth: 90 }} key={'OldRV'} value={oldRV} disabled={accessLevel < 3}></TextField>
                  <TextField sx={{ ml: 10, maxWidth: 90 }} key={'NetRV'} value={netRv} disabled={accessLevel < 3}></TextField>
                  <TextField sx={{ ml: 9, maxWidth: 90 }} key={'RetainRV'} value={retainRV} disabled={accessLevel < 3}></TextField>
                  <TextField sx={{ ml: 13, maxWidth: 90 }} key={'HearingRV'} value={hearingRV} disabled={accessLevel < 3}></TextField>
                  <TextField sx={{ ml: 20, maxWidth: 90 }} key={'AppealCommRV'} value={appealCommRV} disabled={accessLevel < 3}></TextField>
                  <TextField sx={{ ml: 19, maxWidth: 90 }} key={'CourtResRV'} value={courtResRV} disabled={accessLevel < 3}></TextField>
                </Stack>
              </Grid>
            </MainCard>
          </Grid>
          <Grid sx={{ mt: 2 }}>
          <MainCard>
  <TableContainer style={{ marginTop: 20 }}>
    {tableLoading && (
      <Backdrop
        open={true}
        sx={{
          position: "absolute",
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )}
    <Table>
      <TableHead>
        <TableRow>
          {taxNameList.map((tax) => (
            <TableCell key={tax.TaxName}>{tax.TaxName}</TableCell>
          ))}
          <TableCell>Total Tax</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {['Net', 'Retain', 'Hearing', 'Appeal', 'Court'].map((key, idx) => (
          <React.Fragment key={key}>
           <TableRow>
  <TableCell
    colSpan={Math.ceil(taxNameList.length / 2.7)}
    style={{
      color: [orange[800], blue[800], green[800], red[500],pink[800] ][idx],
      fontWeight: "bold",
    }}  >
    {key} Taxes
  </TableCell>
  <TableCell
    colSpan={taxNameList.length - Math.ceil(taxNameList.length / 3.7)}
    style={{
      color: [orange[800], blue[800], green[800], red[500],pink[800] ][idx],
      fontWeight: "bold",
    }}  >
    RV : {key === 'Net' ? netRv : key === 'Retain' ? retainRV : key === 'Hearing' ? hearingRV : key === 'Appeal' ? appealCommRV : courtResRV}
  </TableCell>
</TableRow>
            <TableRow>
              {taxNameList.map((tax) => {
                let row;

                if (
                  (overrideReason === "retention" && key === "Retain") ||
                  (overrideReason === "hearing" && key === "Hearing") ||
                  (overrideReason === "appeal committee" && key === "Appeal") ||
                  (overrideReason === "remission" && key === "Court")
                ) {
                  row = taxableValues[key] || {};
                } else {
                  row = preparedRows[key] || {};
                }

                return <TableCell key={tax.TaxName}>{row[tax.TaxName] ?? 0}</TableCell>;
              })}
              <TableCell>
                {taxNameList.reduce((sum, tax) => {
                  let row;
                  if (
                    (overrideReason === "retention" && key === "Retain") ||
                    (overrideReason === "hearing" && key === "Hearing") ||
                    (overrideReason === "appeal committee" && key === "Appeal") ||
                    (overrideReason === "remission" && key === "Court")
                  ) {
                    row = taxableValues[key] || {};
                  } else {
                    row = preparedRows[key] || {};
                  }
                  return sum + (row[tax.TaxName] ?? 0);
                }, 0)}
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  {/* Save Button */}
  <div style={{ marginTop: 20, textAlign: 'right' }}>
    <button 
      onClick={async () => {
        try {
          // Prepare payload
          const rowsToSave = ['Net', 'Retain', 'Hearing', 'Appeal', 'Court'].map(key => ({
            taxType: key,
            ...( (overrideReason === "retention" && key === "Retain") ||
               (overrideReason === "hearing" && key === "Hearing") ||
               (overrideReason === "appeal committee" && key === "Appeal") ||
               (overrideReason === "remission" && key === "Court")
                 ? taxableValues[key] || {}
                 : preparedRows[key] || {}
            )
          }));

          const payload = {
            ownerID,
            year,
            data: rowsToSave,
          };

          // Call your API
          const response = await axios.post("/api/saveTaxes", payload);

          if (response.data.success) {
            alert("Taxes saved successfully!");
          } else {
            alert("Failed to save taxes!");
          }
        } catch (err) {
          console.error(err);
          alert("Error saving taxes!");
        }
      }}
    >
      
    </button>
  </div>
</MainCard>

          </Grid>
          <Dialog open={showL2Dialog} onClose={() => setShowL2Dialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle id="alert-dialog-title" color="error" style={{ fontSize: '24px', fontWeight: 'bold' }}>
    Appliy Police</DialogTitle>
  <DialogContent>
  <DialogContentText id="alert-dialog-description">Enter L2 Password</DialogContentText>

    <TextField
      autoFocus
      margin="dense"
      label="L2 Password"
      type="password"
      fullWidth
      value={l2Password}
      onChange={(e) => setL2Password(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => { setShowL2Dialog(false); setL2Password(''); }}>Cancel</Button>
    <Button
      onClick={confirmApplyWithL2}
      variant="contained"
      color="success"
      disabled={loading}
    >
      {loading ? "Checking..." : "Confirm"}
    </Button>
  </DialogActions>
</Dialog>

<Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
           <SnackbarContent
    sx={{
      backgroundColor:
        snackbarSeverity === 'success'
          ? 'green'
          : snackbarSeverity === 'warning'
          ? 'orange'
          : 'red',
      fontWeight: 'bold',
    }}
    message={snackbarMessage}
  />
          </Snackbar>
        </MainCard>
        
      )}
    </>
  );
}

export default Appeal;
