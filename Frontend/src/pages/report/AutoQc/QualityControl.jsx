import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  SnackbarContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { QCList } from './QualityControlList';
import { fetchFinancialYear, fetchWardList } from 'services/appeal.services';
import { fetchConstructionType } from 'services/construction.services';
import {
  fetchAppealCommitteeMast,
  fetchAppealCurrentReasonMast,
  fetchBillBookByYear,
  fetchBillBookNoByYear,
  fetchDefaultProperty,
  fetchFlatSystemData,
  fetchHearingMast,
  fetchHolderList,
  fetchMissingPhotoPlanList,
  fetchMissingPlanList,
  fetchMissingPropertyNew,
  fetchOldTaxGreaterThanOldRv,
  fetchOldVsNewRVPercentage,
  fetchPropertyDescriptionReport,
  fetchPropertyTaxGreaterThanOldTax,
  fetchTotalTaxRangeReport,
  fetchZeroCarpetList,
  fetchZeroOldTax,
  getActualValueAppeal,
  getAddressMobileList,
  getBankTowelWithoutRent,
  getCancelBillBookInvoiceService,
  getCombinePropertiesList,
  getCommercialEduZero,
  getCommercialReport,
  getComparision,
  getConstructionAR,
  getConstructionList,
  getDataEntryGap,
  getDuplicateFloor,
  getDuplicatePropertyList,
  getEmployeeTAx,
  getMissingGIS,
  getMissingInvoiceService,
  getMissingPlotArea,
  getMissingShop,
  getMissionToilet,
  getMutationListByDateService,
  getNewProperty,
  getObliqueProperties,
  getOldPropertyGRRv,
  getOldRvHasValueButNetTax,
  getOldTaxGrtProperty,
  getOldTaxNetTZero,
  getOpenPlotProperties,
  getOpenPlotWithoutDetailsList,
  getOuterProperty,
  getPropDescMismatchProperties,
  getPropertiesHavingNewRvNetTax,
  getPropertiesWithoutRenterList,
  getPropertiesoldTaxOldRVzero,
  getPropertyChart,
  getRenterHavingRent,
  getSocialDetailsList,
  getTaxAppliedTaxZero,
  getTaxableTotalTax,
  getTaxableTotalTaxZero,
  getTotalTax10times,
  getTotalTax3times,
  getTotalTaxGrter,
  getTotalTaxReducer,
  getUnderConstructionProperties,
  getUtilityMismatch,
  getZeroRentList,
  getZeroTaxOpenPlot,
  getZoningList
} from 'services/report/autoQc/qualityControl/qualityControlService';
import { fetchPropertyDescription } from 'services/data-entry.services';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';

const QualityControl = () => {
  // State to manage selected wards
  const [showFloorWiseTable, setShowFloorWiseTable] = useState(false);
  const [showPropertyWiseTable, setShowPropertyWiseTable] = useState(false);
  const [showSelectedListTable, setShowSelectedListTable] = useState(false);
  const [allWard, setAllWard] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBillBookNo, setSelectedBillBookNo] = useState('All');
  const [financialYearList, setFinancialYearList] = useState([]);
  const [selectedYearNo, setSelectedYearNo] = useState('');
  const [showTotalTaxDialog, setShowTotalTaxDialog] = useState(false);
  const [showPDesDialog, setShowPDesDialog] = useState(false);
  const [selectedPropD, setSelectedPropD] = useState('');
  const [selectAllPropD, setSelectAllPropD] = useState(false);

  const [selectedPropDesc, setSelectedPropDesc] = useState([]);
  const [selectAllPropDesc, setSelectAllPropDesc] = useState(false);
  const [fromTax, setFromTax] = useState('');
  const [toTax, setToTax] = useState('');
  const [propertyDescArray, setpropertyDescArray] = useState([]);
  //Property
  const [propertyRange, setPropertyRange] = useState({ from: '', to: '' });
  const [propertyRangeList, setPropertyRangeList] = useState([]);
//mutation
const [openDateDialog, setOpenDateDialog] = useState(false);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

const [showFlatSystemDialog, setShowFlatSystemDialog] = useState(false);
const [flatWard, setFlatWard] = useState([]);
const [propertyRangef, setPropertyRangef] = useState({ from: '', to: '' });
  const [propertyRangeListf, setPropertyRangeListf] = useState([]);

const [bhk, setBhk] = useState("");
  //prope dedc
  useEffect(() => {
    fetchPropertyDescription()
      .then((fetchproperty) => {
        console.log('Fetched property data:', fetchproperty);
        setpropertyDescArray(fetchproperty);
      })
      .catch((error) => {
        console.error('Error fetching property data:', error);
      });
  }, []);

  useEffect(() => {
    fetchFinancialYear()
      .then((finList) => {
        setFinancialYearList(finList);
      })
      .catch((error) => {
        console.error('Error fetching financial list:', error);
      });
  }, []);
 
  
  //bill book
  const [billBookList, setBillBookList] = useState([]);
  const [billBookNoList, setBillBookNoList] = useState([]);

  useEffect(() => {
    if (selectedYear) {
      fetchBillBookByYear(selectedYear)
        .then((list) => {
          setBillBookList(list);

          setSelectedBillBookNo(list.length > 0 ? list[0]['बिल बुक क्र.'] : '');
        })
        .catch((err) => console.error(err));
    } else {
      setBillBookList([]);
      setSelectedBillBookNo('');
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYearNo) {
      fetchBillBookNoByYear(selectedYearNo)
        .then((list) => {
          setBillBookNoList(list);
          setSelectedBillBookNo(list.length > 0 ? list[0] : '');
        })
        .catch((err) => console.error(err));
    } else {
      setBillBookNoList([]);
      setSelectedBillBookNo('');
    }
  }, [selectedYearNo]);

  const handleFinanceYearChange = (year) => {
    setSelectedYear(year);
    setSelectedBillBookNo('');
  };

  useEffect(() => {
    fetchWardList()
      .then((finList) => setWardList(finList))
      .catch((error) => console.error('Error fetching wards:', error));
  }, []);
  // Handle change in selected wards
  // const handleWardChange = (event) => {
  //   const value = event.target.value;

  //   if (value.includes("ALL")) {
  //     if (allWard.length === wardList.length) {
  //       setAllWard([]);
  //       setSelectAll(false);
  //     } else {
  //       setAllWard(wardList.map((w) => w.NewWardNo));
  //       setSelectAll(true);
  //     }
  //   } else {
  //     setAllWard(value);
  //     setSelectAll(value.length === wardList.length);
  //   }
  // };

  const handleWardChange = async (event) => {
    const value = event.target.value;

    if (value.includes('ALL')) {
      if (allWard.length === wardList.length) {
        setAllWard([]);
        setFlatWard([])
        setSelectAll(false);
        setPropertyRangeList([]);
        setPropertyRange({ from: '', to: '' });
        setPropertyRangeListf([]);
        setPropertyRangef({ from: '', to: '' });
      } else {
        const all = wardList.map((w) => w.NewWardNo);
        setAllWard(all);
        setSelectAll(true);
        setPropertyRangeList([]);
        setPropertyRange({ from: '', to: '' });
        setPropertyRangeListf([]);
        setPropertyRangef({ from: '', to: '' });
      }
      return;
    }

    setAllWard(value);
    setSelectAll(value.length === wardList.length);

    if (value.length === 1) {
      try {
        const wardNo = value[0];
        const res = await fetchPropertyRangeByWard(wardNo);

        // ⭐⭐ SORT ASCENDING ⭐⭐
        const sorted = res.properties.sort((a, b) => Number(a.NewPropertyNo) - Number(b.NewPropertyNo));

        setPropertyRangeList(sorted);
        setPropertyRange({
          from: '',
          to: ''
        });
      } catch (error) {
        console.error('Error fetching property range:', error);
        setPropertyRangeList([]);
        setPropertyRange({ from: '', to: '' });
      }
    } else {
      setPropertyRangeList([]);
      setPropertyRange({ from: '', to: '' });
    }
  };
  const handleFlatWardChange = async (event) => {
    const value = event.target.value;
  
    // --- SELECT ALL ---
    if (value.includes("ALL")) {
      if (flatWard.length === wardList.length) {
        // Unselect All
        setFlatWard([]);
        setSelectAllFlat(false);
        setPropertyRangeListf([]);
        setPropertyRangef({ from: "", to: "" });
      } else {
        // Select All
        const all = wardList.map((w) => w.NewWardNo);
        setFlatWard(all);
        setSelectAllFlat(true);
        setPropertyRangeListf([]);
        setPropertyRangef({ from: "", to: "" });
      }
      return;
    }
  
    // --- Normal Multi Select ---
    setFlatWard(value);
    setSelectAllFlat(value.length === wardList.length);
  
    // --- If Only One Ward Selected → Load Property Numbers ---
    if (value.length === 1) {
      try {
        const wardNo = value[0];
        const res = await fetchPropertyRangeByWard(wardNo);
  
        if (res?.properties) {
          const sorted = res.properties.sort(
            (a, b) => Number(a.NewPropertyNo) - Number(b.NewPropertyNo)
          );
  
          setPropertyRangeListf(sorted);   // ⭐ LIST SET
        } else {
          setPropertyRangeListf([]);
        }
  
        setPropertyRangef({ from: "", to: "" });  // reset
      } catch (error) {
        console.error("Error fetching property range:", error);
        setPropertyRangeListf([]);
        setPropertyRangef({ from: "", to: "" });
      }
    } 
    else {
      // More than 1 ward selected → clear list
      setPropertyRangeListf([]);
      setPropertyRangef({ from: "", to: "" });
    }
  };
  
  const [constructionTypeList, setConstructionTypeList] = useState([]);
  useEffect(() => {
    fetchConstructionType().then((res) => {
      setConstructionTypeList(res.data);
    });
  }, []);
  const rows = [
    { id: 1, name: 'John Doe', age: 28 },
    { id: 2, name: 'Jane Smith', age: 32 },
    { id: 3, name: 'Samuel Brown', age: 45 }
  ];
  const [open, setOpen] = useState(false);
  //excel

  

  const handleExportToExcel = () => {
    try {
      if (!tableData || tableData.length === 0) {
        alert("No data available to download");
        return;
      }
  
      // Convert array → sheet
      const worksheet = XLSX.utils.json_to_sheet(tableData);
  
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  
      // Convert to excel binary
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
  
      // Convert buffer → file
      const fileBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      // Download excel
      saveAs(fileBlob, `${selectedReport}_Report.xlsx`);
    } catch (err) {
      console.error("Excel Download Error:", err);
      alert("Failed to generate Excel");
    }
  };
  
  const [showConstructionTable, setShowConstructionTable] = useState(false);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchReportData = async (reportName, wards) => {
    switch (reportName) {
      case 'Missing Photo List':
        return await fetchMissingPhotoPlanList(wards);

      case 'Missing Plan List':
        return await fetchMissingPlanList(wards);
      case 'Zero Tax Property List':
        return await fetchZeroOldTax(wards);
      case 'Default Property List':
        return await fetchDefaultProperty(wards);
      case 'Holder List':
        return await fetchHolderList(wards);
      case 'Old Property Tax Greater Then Old Tax':
        return await fetchPropertyTaxGreaterThanOldTax(wards);
      case 'Old Tax Greater Then Old Rv List':
        return await fetchOldTaxGreaterThanOldRv(wards);
      case 'Old Property Without Old Tax and Old RV':
        return await fetchMissingPlanList(wards);
      case 'Missing Property Details List':
        return await fetchMissingPropertyNew(wards);
      case 'Properties in Auto Hearing List':
        return await fetchHearingMast(wards);
      case 'Properties in Auto Appeal Committee List':
        return await fetchAppealCommitteeMast(wards);
      case 'Property With Current Appeal Status List':
        return await fetchAppealCurrentReasonMast(wards);
      case 'Properties having zero carpet area':
        return await fetchZeroCarpetList(wards);
      case 'Properties with missing floor Details':
        return await getOpenPlotWithoutDetailsList(wards);
      case 'Toilet Count':
        return await getSocialDetailsList(wards);
      case 'Properties without rent':
        return await getZeroRentList(wards);
      case 'Duplicate Property List':
        return await getDuplicatePropertyList(wards);
      case 'Combine Property List':
        return await getCombinePropertiesList(wards);
      case 'Missing Address, Address in Marathi and Mobile No':
        return await getAddressMobileList(wards);
      case 'Old RV has value but Net tax is Zero':
        return await getOldRvHasValueButNetTax(wards);
      case 'Missing Invoice No.':
        return await getMissingInvoiceService(wards);
      case 'Missing floor information in property and excluding plots':
        return await fetchMissingPropertyNew(wards);
      case 'Duplicate Floor List':
        return await getDuplicateFloor(wards);
      case 'Properties without Renter':
        return await getPropertiesWithoutRenterList(wards);
      case 'Missing Toilet':
        return await getMissionToilet(wards);
      case 'Properties with renter and having rent':
        return await getRenterHavingRent(wards);
      case 'Canceled Invoice Lists':
        return await getCancelBillBookInvoiceService(wards);
      case 'Open Plot Properties':
        return await getOpenPlotProperties(wards);
      case 'Oblique Property List':
        return await getObliqueProperties(wards);
      case 'Under Construction Properties':
        return await getUnderConstructionProperties(wards);
      case 'Property Description Mismatch Property':
        return await getPropDescMismatchProperties(wards);
      case 'Bank,Tower,Office,Hostels without Rent':
        return await getBankTowelWithoutRent(wards);
      case 'Total Tax in Between Given Range':
        return await fetchTotalTaxRangeReport(wards);
      case 'Total Tax is greater than 100000':
        return await getTotalTaxGrter(wards);
      case "Properties having old propery no. but it's old Tax and Old RV is zero":
        return await getPropertiesoldTaxOldRVzero(wards);
      case 'Property have old Tax but Net Tax is Zero':
        return await getOldTaxNetTZero(wards);
      case 'Missing Plot area list':
        return await getMissingPlotArea(wards);
      case 'Zero tax Open Plot':
        return await getZeroTaxOpenPlot(wards);
      case 'Missing ShopName List':
        return await getMissingShop(wards);
      case 'Missing GIS Photo List':
        return await getMissingGIS(wards);
      //  case "Property Description" :
      //   return await fetchPropertyDescription(selectedPropD);
      case 'NewTotalTax is 10 times greater than OldTotalTax':
        return await getTotalTax10times(wards);
      case 'NewTotalTax is 3 times less than OldTotalTax':
        return await getTotalTax3times(wards);
      case 'totaltax is less than old total tax':
        return await getTotalTaxReducer(wards);
      case 'Comparison':
        return await getComparision(wards);
      case 'Residential properties to which employemnt tax is applied':
        return await getEmployeeTAx(wards);
      case 'Commercial properties to which employemnt tax is not applied':
        return await getCommercialReport(wards);
      case 'New Properties':
        return await getNewProperty(wards);
      case 'Outer Properties':
        return await getOuterProperty(wards);
      case 'Old Tax is Greater than Old RV':
        return await getOldTaxGrtProperty(wards);
      case 'Missing Appeal Policy With compare to Actual Table values':
        return await getActualValueAppeal(wards);
        case 'Properties having New RV but Net Tax is Zero':
          return await getPropertiesHavingNewRvNetTax(wards);
          case 'Data Entry Gap':
            return await getDataEntryGap(wards);
            case 'Utility Mismatch Property':
              return await getUtilityMismatch(wards);
              case 'Tax is applied but tax value is Zero':
                return await getTaxAppliedTaxZero(wards);  
                case 'Property Chart':
                  return await getPropertyChart(wards);
                  case 'Zoning list':
                  return await getZoningList(wards);
                  case 'Property is Non Taxable but Total Tax is Greater than Zero':
                    return await getTaxableTotalTax(wards);
                    case 'Property is Taxable but Total Tax is Zero':
                      return await getTaxableTotalTaxZero(wards);
                      case "Construction Type like 'AR','BR','CR'..etc but calculated Rent is zero":
                        return await getConstructionAR(wards);
case "Old Total Tax/Old prop Tax greater than Old RV":
  return await getOldPropertyGRRv(wards);
  case "Commercial properties but education tax is not applied":
    return await getCommercialEduZero(wards);
                  default:
        console.warn('No matching API for report:', reportName);
        return [];
    }
  };
  const [invoiceDialogType, setInvoiceDialogType] = useState('missing');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const handleGenerateClick = async () => {
    if (!allWard || allWard.length === 0) {
      setSnackbarMessage('⚠️ Please select at least one Ward No before generating the report.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    setShowSelectedListTable(true);
    setShowPropertyWiseTable(false);
    setShowFloorWiseTable(false);
    setOpen(true);
  
    setTableData([]);
    setTotalRecordCount(0);
  
    setLoading(true);
  
    try {
      const response = await fetchReportData(selectedReport, allWard);
  
      const rows = Array.isArray(response)
        ? response
        : response?.data || [];
  
      console.log('Final rows for table:', rows);
  
      if (rows.length === 0) {
        setSnackbarMessage("❌ No data found for selected report.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
  
      setTableData(rows);
      setTotalRecordCount(rows.length);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbarMessage("❌ Something went wrong while fetching data.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // const handleGenerateClick = async () => {
  //   if (!allWard || allWard.length === 0) {
  //     alert('⚠️ Please select at least one Ward No before generating the report.');
  //     return;
  //   }

  //   setShowSelectedListTable(true);
  //   setShowPropertyWiseTable(false);
  //   setShowFloorWiseTable(false);
  //   setOpen(true);

  //   setTableData([]);
  //   setTotalRecordCount(0);

  //   setLoading(true);

  //   try {
  //     const response = await fetchReportData(selectedReport, allWard);

  //     console.log('Raw response:', response);

  //     // 🟢 This handles EVERYTHING
  //     const rows = Array.isArray(response) 
  //       ? response
  //       : response?.data || []; 
  //          console.log('Final rows for table:', rows);

  //     setTableData(rows);
  //     setTotalRecordCount(rows.length);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //invoice
  const handleGenerateClickWithInvoice = async () => {
    if (!selectedYear) {
      alert('Please select Year');
      return;
    }

    const reqBody = {
      year: selectedYear,
      billBookNo: selectedBillBookNo
    };

    try {
      const response = await getMissingInvoiceService(reqBody);

      const rows = response?.data || [];
      setTableData(rows);
      setTotalRecordCount(rows.length);

      setShowSelectedListTable(true);
    } catch (error) {
      console.error('Error fetching Missing Invoice List', error);
    }
  };
  //total tax
  const handleTotalTaxReport = async () => {
    try {
      const res = await fetchTotalTaxRangeReport(selectedPropDesc, propertyRange.from, propertyRange.to);

      setSelectedReport('Total Tax in Between Given Range');
      setTableData(res);
      setShowSelectedListTable(true);
      setShowTotalTaxDialog(false);
    } catch (error) {
      console.error('Error fetching Tax Range', error);
      alert('Something went wrong');
    }
  };
  //pd 51
  const [selectedPd, setSelectedPd] = useState('');

  const handlePropertyDescription = async () => {
    try {
      if (!selectedPd) {
        alert("Please select Property Description");
        return;
      }
  
      const res = await fetchPropertyDescriptionReport(selectedPd);
  
      const dataArray = Array.isArray(res.data) ? res.data : res || [];
  
      setTableData(dataArray);
  
      // ✅ Handle both totalRecords and totalRecordCount
      const totalCount = res.totalRecordCount ?? res.totalRecords ?? dataArray.length;
      setTotalRecordCount(totalCount);
  
      setSelectedReport("Property Description");
      setShowSelectedListTable(true);
      setShowPDesDialog(false);
    } catch (error) {
      console.error("Error fetching PD report", error);
      alert("Something went wrong while fetching data");
    }
  };
  const handleOpenPDesDialog = () => {
    setSelectedPd(''); // ✅ Reset previous selection
    setShowPDesDialog(true);
  };
  
  
  // const resetTotalTaxFields = () => {
  //   setSelectAllPropDesc(false);
  //   setSelectedPropDesc([]);
  //   setAllWard([]);
  //   setSelectAll(false);
  //   setPropertyRange({ from: "", to: "" });
  //   setPropertyRangeList([]);
  // };

  // const handleGenerateClick = async () => {
  //   if (!allWard || allWard.length === 0) {
  //     setDialogMessage("⚠️ Please select at least one Ward No before generating the report.");
  //     setDialogOpen(true);
  //     return;
  //   }

  //   setShowSelectedListTable(true);
  //   setShowPropertyWiseTable(false);
  //   setShowFloorWiseTable(false);
  //   setOpen(true);

  //   setTableData([]);
  //   setTotalRecordCount(0);
  //   setLoading(true);

  //   try {
  //     const response = await fetchReportData(selectedReport, allWard);
  //     const data = response.data || [];

  //     setTableData(response.data);
  //     setTotalRecordCount(response.data.length);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setDialogMessage("❌ Error fetching data. Please try again later.");
  //     setDialogOpen(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const [allTableData, setAllTableData] = useState([]);
  const [totalTaxValue, setTotalTaxValue] = useState("");

  const handleConstructionProceed = async () => {
    if (!allWard.length || selectedTypes.length === 0) {
      alert('Please select at least one ward and construction type.');
      return;
    }
  
    setLoading(true);
    setShowConstructionTable(false);
    setSelectedReport('Construction Type and Tax Wise List');
  
    try {
      const response = await getConstructionList(allWard);
  
      if (!response || !Array.isArray(response)) {
        alert('Invalid data received from server.');
        return;
      }
  
      // 1️⃣ Filter by construction type
      const filteredData = response.filter((row) =>
        selectedTypes.includes(row.constructionType)
      );
  
      // 2️⃣ Map construction descriptions
      const mappedData = filteredData.map((row) => {
        const match = constructionTypeList.find(
          (t) => t.ConstructionId === row.constructionType
        );
  
        return {
          ...row,
          constructionTypeDesc: match ? match.Description : row.constructionType,
        };
      });
  
      // 3️⃣ ⭐ APPLY TOTAL TAX FILTER ⭐
      let taxFiltered = mappedData;
  
      if (totalTaxValue && !isNaN(totalTaxValue)) {
        taxFiltered = mappedData.filter(
          (row) => Number(row.oldTotalTax || 0) > Number(totalTaxValue)
        );
      }
  
      // 4️⃣ Set final table data
      setTableData(taxFiltered);
      setTotalRecordCount(taxFiltered.length);
      setShowConstructionTable(true);
    } catch (error) {
      console.error('❌ Error fetching construction data:', error);
      alert('Failed to fetch construction data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleFloorWiseClick = () => {
    setShowFloorWiseTable(true);
    setShowSelectedListTable(false);
    setShowPropertyWiseTable(false);
  };
  const handlePropertyWiseClick = () => {
    setShowFloorWiseTable(false);
    setShowSelectedListTable(false);
    setShowPropertyWiseTable(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [selectedReport, setSelectedReport] = useState(null);

  // Handle dropdown change
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showBillBookDialog, setShowBillBookDialog] = useState(false);

  const handleChange = (event) => {
    const selectedReportName = event.target.value;
    console.log(selectedReportName);
    setAllWard([]);
    setSelectAll(false);
    setTotalRecordCount(0);

    setPropertyRange({ from: "", to: "" });
    setPropertyRangeList([]);
  
    setSelectedPropDesc([]);
    setSelectAllPropDesc(false);
  
    setFlatWard([]);
    setPropertyRangef({ from: "", to: "" });
    setBhk("");
  
    setSelectedPd("");






    setSelectedReport(selectedReportName);

    if (selectedReportName === 'Missing Address, Address in Marathi and Mobile No') {
      setShowAddressDialog(true);
    } else {
      setShowAddressDialog(false);
    }
    if (selectedReportName === 'Bill Book List') {
      setShowBillBookDialog(true);
    } else {
      setShowBillBookDialog(false);
    }
    if (selectedReportName === 'Total Tax in Between Given Range') {
      setShowTotalTaxDialog(true);
    }
    if (selectedReportName === 'Property Description') {
      handleOpenPDesDialog();
    }
    if (selectedReportName === 'Comparision of Old and new Rv in percentage') {
      setShowPercentDialog(true);
    }
    if (selectedReportName === 'Mutation List') {
      setOpenDateDialog(true);
    }
    if (selectedReportName === 'Old carpet area not matching  in flat system') {
      setShowFlatSystemDialog(true);
  }
    if (selectedReportName === 'Missing Invoice No.') {
      setSelectedYear("");
      setSelectedBillBookNo("");
      setBillBookList([]);
      setInvoiceDialogType('missing');
      setShowInvoiceDialog(true);
    } else if (selectedReportName === 'Canceled Invoice Lists') {
      setSelectedYear("");
  setSelectedBillBookNo("");
  setBillBookList([]);
  setInvoiceDialogType('cancel');
  setShowInvoiceDialog(true);
    } else {
      setShowInvoiceDialog(false);
    }
  };

  //desc.
  let description = '';

  if (selectedReport === 'Missing Photo List') {
    description = "Shows list of records which don't have property image";
  } else if (selectedReport === 'Missing Plan List') {
    description = "Shows list of records which don't have plan image.";
  } else if (selectedReport === 'Zero Tax Property List') {
    description = 'Shows list of records Where the total tax of property is zero';
  } else if (selectedReport === 'Default Property List') {
    description = "Shows list of records Who's Property owner name is Default like A,B,C";
  } else if (selectedReport === 'Holder List') {
    description = "Shows list of records Who's Property owner name is Holder";
  } else if (selectedReport === 'Missing Property Details List') {
    description = "Shows list of records Who's propertyNo is missed within respected ward";
  } else if (selectedReport === 'Old Tax Greater Then Old Rv List') {
    description = "Shows list of records Who's old tax is Greater than old RV";
  } else if (selectedReport === 'Old Property Tax Greater Then Old Tax') {
    description = "Shows list of records Who's old tax is Greater than old Tax";
  } else if (selectedReport === 'Old Property Without Old Tax and Old RV') {
    description = 'Shows list of records Which property is old but it old Tax and Old RV is zero';
  } else if (selectedReport === 'Construction Type and Tax Wise List') {
    description = 'Shows list of records from below selected construction type combination and with tax condition.';
  } else if (selectedReport === 'Property With Current Appeal Status List') {
    description =
      'Shows list of records with its current appeal status like No. of properties which are in Retaintion,Hearing,Appeal Committee and Remission etc';
  } else if (selectedReport === 'Properties in Auto Hearing List') {
    description = 'Shows list of Property records Which are in Hearing';
  } else if (selectedReport === 'Properties in Auto Appeal Committee List') {
    description = 'Shows list of Property records Which are in Appeal Committee';
  } else if (selectedReport === 'Properties with missing floor Details') {
    description = "Shows list of records Which don't have floor details";
  } else if (selectedReport === 'Properties having zero carpet area') {
    description = "Shows list of Property  Which don't have carpet area";
  } else if (selectedReport === 'Auto AC List') {
    description = 'Shows list of Property with its Application Retain Policies Status';
  } else if (selectedReport === 'Toilet Count') {
    description = 'Shows list of property with Toilets Count for each Property.';
  } else if (selectedReport === 'Properties without rent') {
    description = "Shows list of property which having renter but don't have rent";
  } else if (selectedReport === 'Duplicate Property List') {
    description = 'Shows list of properties where a ward has duplicate property no.';
  } else if (selectedReport === 'Combine Property List') {
    description = 'Shows list of combine properties alone with main properties ';
  } else if (selectedReport === 'Properties without old Property tax and old total tax') {
    description = 'Shows list of properties which having Old RV but dont have old property tax and old total tax.';
  }else if (selectedReport === 'Missing Address, Address in Marathi and Mobile No') {
    description = 'Shows list of properties of which do not have Address and Mobile No.';
  }else if (selectedReport === 'Missing Toilet') {
    description = 'Shows list of properties where toilet are missing';
  }else if (selectedReport === 'Duplicate Property List') {
    description = 'Shows list of properties where a ward has duplicate property no.';
  }else if (selectedReport === 'Duplicate Floor List') {
    description = 'Shows list of properties which has duplicate entries for floor';
  }else if (selectedReport === 'Old RV has value but Net tax is Zero') {
    description = 'Shows list of properties which has value for OldRV but Net Tax is Zero';
  }else if (selectedReport === 'Properties without Renter') {
    description = 'Shows list of properties which has rent but do not have renter name';
  }else if (selectedReport === 'Missing Invoice No.') {
    description = 'Shows list of Missing invoice No.';
  }else if (selectedReport === 'Missing floor information in property and excluding plots') {
    description = 'Shows list of properties where new floor details are missing and property is not open plot';
  }else if (selectedReport === 'Missing New and Old Floor type of use information') {
    description = 'Shows list of mismatch properties where New and Old Floor type of use Information';
  }else if (selectedReport === 'Properties with renter and having rent') {
    description = 'Shows list of properties where property has renter and rent of property not zero';
  } else if (selectedReport === 'Missing Appeal Policy With compare to Actual Table values') {
    description = 'Shows list of properties where Missing Appeal Policy With compare to Actual Table Values';
  }else if (selectedReport === 'Canceled Invoice Lists') {
    description = 'Show list of Canceled Invoice No';
  }else if (selectedReport === 'Open Plot Properties') {
    description = 'Shows list of Open Plot Properties';
  }else if (selectedReport === 'Bill Book List') {
    description = 'Shows Bill Book list for selected year.';
  }else if (selectedReport === 'Oblique Property List') {
    description = 'Shows ward wise oblique property with respect to PropertyNo.';
  }else if (selectedReport === 'Comparision of Old and new Rv in percentage') {
    description = 'Shows comparison in percentage of Old RV with respect to New RV for Properties';
  }else if (selectedReport === 'Under Construction Properties') {
    description = 'Shows list of properties which are under Construction';
  } else if (selectedReport === 'Property Description Mismatch Property') {
    description = 'Shows list of Property Description Mismatch Property';
  }else if (selectedReport === 'Bank,Tower,Office,Hostels without Rent') {
    description = 'Shows list of properties which having renter but do not have Rent';
  }else if (selectedReport === 'Total Tax in Between Given Range') {
    description = 'Shows list of properties who is Total Tax in Between Given Range';
  } else if (selectedReport === 'Total Tax is greater than 100000') {
    description = 'Shows list of properties who is Total Tax is greater than 100000';
  }else if (selectedReport === "Properties having old propery no. but it's old Tax and Old RV is zero") {
    description = 'Shows list of Properties having old Property no. but it is old Tax and Old RV is zero';
  } else if (selectedReport === 'Property have old Tax but Net Tax is Zero') {
    description = 'Shows list of Properties which having old tax but net tax is zero';
  }else if (selectedReport === 'Missing Plot area list') {
    description = '';
  }else if (selectedReport === 'Shows list of Properties which do not have Plot area') {
    description = '';
  }else if (selectedReport === 'Zero tax Open Plot') {
    description = 'Shows list of Open Plot is which having Zero tax';
  } else if (selectedReport === 'Missing ShopName List') {
    description = 'Shows list of Properties i.e office and shops where Shop Name is missing';
  }else if (selectedReport === 'Missing GIS Photo List') {
    description = 'Shows list of Properties which do not have GIS property image.';
  } else if (selectedReport === 'Property Description') {
    description = 'Shows list of Properties according to its Property Description';
  }else if (selectedReport === 'NewTotalTax is 10 times greater than OldTotalTax') {
    description = 'Shows list of records  who is NewTotalTax is 10 times greater than OldTotalTax';
  }else if (selectedReport === 'NewTotalTax is 3 times less than OldTotalTax') {
    description = 'Shows list of records  who is NewTotalTax is 3 times less than OldTotalTax';
  } else if (selectedReport === 'totaltax is less than old total tax') {
    description = 'Shows list of Properties whose total tax is less than old total tax';
  }else if (selectedReport === 'Comparison') {
    description = 'Comparison Of Old and new data ';
  }else if (selectedReport === 'Residential properties to which employemnt tax is applied') {
    description = 'Shows list of Residential Properties to which employemnt tax is  applied';
  }else if (selectedReport === 'Commercial properties to which employemnt tax is not applied') {
    description = 'Shows list of Commercial Properties to which employemnt tax is not applied';
  }else if (selectedReport === 'New Properties') {
    description = 'Shows list of new Properties';
  }else if (selectedReport === 'Outer Properties') {
    description = 'Shows list of Properties which have Outer Remark';
  }else if (selectedReport === 'Old Tax is Greater than Old RV') {
    description = 'Shows list of Properties which having Old tax is more than Old RV';
  }  else if (selectedReport === 'Properties having New RV but Net Tax is Zero') {
    description = 'Shows list of Properties which having new RV but net tax is zero';
  }  else if (selectedReport === 'Missing Property No.') {
    description = 'Shows list pf Properties which are missing from ward';
  }  else if (selectedReport === 'Data Entry Gap') {
    description = 'Shows list pf Properties which do not have Data Entry';
  }  else if (selectedReport === 'Utility Mismatch Property') {
    description = 'Shows list of Utility Mismatch Property';
  }  else if (selectedReport === 'Comparison Report') {
    description = 'Shows Comparison Report';
  }  else if (selectedReport === 'Tax is applied but tax value is Zero') {
    description = 'Shows properties where tax has to apply but actual values is zero.';
  }  else if (selectedReport === 'Mutation List') {
    description = 'Mutation Details';
  } else if (selectedReport === 'Property Chart') {
    description = 'Shows Total Property No and Oblique No count';
  } else if (selectedReport === 'Zoning list') {
    description = 'Shows Zoning ward wise';
  } else if (selectedReport === 'Property is Non Taxable but Total Tax is Greater than Zero') {
    description = 'Show Property is Non Taxable but Total Tax is Greater than Zero';
  } else if (selectedReport === 'Property is Taxable but Total Tax is Zero') {
    description = 'Show Property is Taxable but Total Tax is Zero';
  }else if (selectedReport === 'Old carpet area not matching  in flat system') {
    description = 'Shows list of properties where old carpet area is not same for flat system.';
  }else if (selectedReport === "Construction Type like 'AR','BR','CR'..etc but calculated Rent is zero") {
    description = "Show Construction Type like 'AR','BR','CR'..etc but calculated Rent is zero";
  }else if (selectedReport === 'Old Total Tax/Old prop Tax greater than Old RV') {
    description = 'Show Old Total Tax/Old prop Tax greater than Old RV';
  }else if (selectedReport === 'Commercial properties but education tax is not applied') {
    description = 'Commercial properties but education tax is not applied';
  }
  
  
  
  
  
  else {
    description = 'Selected list description goes here.';
  }
  //construction
  const isConstructionReportSelected = selectedReport === 'Construction Type and Tax Wise List';
  const [selectedTypes, setSelectedTypes] = useState([]);
  const isAppealReportSelected = selectedReport === 'Property With Current Appeal Status List';

  //dynamic header
  const reportHeaders = {
    'Missing Photo List': [
      'Zone No.',
      'New Ward No.',
      'New Property No.',
      'New Partition No.',
      'Old Ward No',
      'Old Property No.',
      'Old Partition No.',
      'Owner Name (Marathi)',
      'Occuiper Name(Marathi)',
      'Shop/Build Name(Marathi)',
      'Property Descrpition',
      'Address(Marathi)',
      'Photo A',
      'Photo B',
      'Photo C',
      'Photo D'
    ],
   

    'Missing Property Details List': ['नवीन प्रभाग क्र', 'मालमत्ता क्र', 'भाग क्र'],
   
    'Old Property Without Old Tax and Old RV': [
      'New Ward No.',
      'New Property No.',
      'New Partition No.',
      'Old Ward No.',
      'Old Property No.',
      'Owner Name',
      'Old Partition No.',
      'Owner Name',
      'Owner Name(Marathi)',
      'Renter Name',
      'Occuiper Name(Marathi)',
      'old Tax',
      'Old Property Tax'
    ],
    'Construction Type and Tax Wise List': [
      'New Ward No.',
      'New Property No.',
      'New Partition No.',
      'Old Ward No.',
      'Old Property No.',
      'Old Partition No.',
      'Owner Name',
      'Owner Name(Marathi)',
      'Renter Name',
      'Occupier Name',
      'Occupier Name(Marathi)',
      'Construction Description',
      'Old Rv',
      'Rv',
      'Total Tax'
    ],
    'Property With Current Appeal Status List': [
      'New Zone No.',
      'New Ward No.',
      'New Property No.',
      'New Partition No.',
      'Old Ward No.',
      'Old Property No.',
      'Old Partition No.',
      'Owner Name',
      'Owner Name(Marathi)',
      'Occuiper Name',
      'Occuiper Name(Marathi)',

      'Renter Name',
      'Current Status'
    ],
    'Properties in Auto Hearing List': [
      'New Ward No.',
      'New Property No.',
      'New Partition No.',
      'Old Ward No.',
      'Old Property No.',
      'Old Partition No.',
      'Owner Name',
      'Owner Name(Marathi)',
      'Renter Name',
      'Renter Name(Marathi)',
      'Status '
    ],

    // 'Properties in Auto Appeal Committee List': [
    //   'नवीन प्रभाग क्र',
    //   'नवीन मालमत्ता क्र',
    //   'भाग क्र',
    //   'जुना वॉर्ड क्र',
    //   'जुनी मालमत्ता क्र',
    //   'जुना भाग क्र',
    //   'Owner Name',
    //   'मालमत्ता धारकाचे नाव',
    //   'Renter Name',
    //   'मालमत्ता  धारकाचे  नाव',
    //   'स्टेटस '
    // ],
   
    'Properties having zero carpet area': [
            'New Zone No.',

      'New Ward No.',
      'New Property No.',
      'New Partition No.',
      'Old Ward No.',
      'Old Property No.',
      'Old Partition No.',
      'Owner Name(Marathi)',   
         'Occupier Name',
      'Shop/Build Name',
      'Property Desciption',
      'Address'
    ],
    'Auto AC List': [],
    'Toilet Count': [
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'Owner Name',
      'मालमत्ता धारकाचे नाव',
      'Renter Name',
      'भोगवटदाराचे नाव',
      'शौचालय संख्या',
      'अनिवासी शौचालय संख्या'
    ],
    'Properties without rent': [
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'Owner Name',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'भाडे',
      'Renter Name',
      'भोगवटदाराचे नाव'
    ],
    'Duplicate Property List': ['नवीन प्रभाग क्र', 'मालमत्ता क्र', 'भाग क्र'],
    'Combine Property List': [
      'Owner Id',
      'नवीन प्रभाग क्र',
      'New Property No.',
      'New Partition No.',
      'Owner Name',
      'मालमत्ता धारकाचे नाव',
      'Renter Name',
      'भोगवटदाराचे नाव',
      'शेरा'
    ],
    'Missing Address, Address in Marathi and Mobile No': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Old RV has value but Net tax is Zero': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Missing Invoice No.': ['वर्ष', 'बिल बुक क्र.', 'पावती क्र.', 'कर्मचारी नाव'],
    'Missing floor information in property and excluding plots': ['नवीन प्रभाग क्र', 'मालमत्ता क्र', 'भाग क्र'],
    'Duplicate Floor List': [
      'Owner Id',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'Marathi Owner Name',
      'भोगवटदाराचे नाव',
      'Marathi Renter Name',
      'मजला',
      'बांधकाम वर्ष',
      'बांधकाम प्रकार',
      'उपयोगाचा प्रकार',
      'चटई क्षेत्रफळ चौ. फूट.',
      'चटई क्षेत्रफळ चौ.मी',
      'खोली',
      'नोंदणी',
      'भोगवटदाराचे',
      'भाडे'
    ],
    'Properties without Renter': [
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'Owner Name',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे',
      'भाडे',
      'Renter Name',
      'भोगवटदाराचे नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता'
    ],
    'Missing Toilet': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'Owner Name',
      'Renter Name',
      'इमारत व दुकान नाव',
      'पत्ता'
    ],
    'Properties with renter and having rent': ['झोन क्र', 'नवीन प्रभाग क्र', 'नवीन मालमत्ता क्र'],
    'Canceled Invoice Lists': ['बिल बुक क्र.', 'पावती क्र. (From)', 'पावती क्र. (To)', 'टिप्पणी/शेरा', 'कर्मचारी नाव', 'वर्ष'],
    'Open Plot Properties': [
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'Marath Owner Name',
      'भोगवटदाराचे नाव',
      'Marathi Renter Name',
      'Open Plot Renter Name',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तावित कर',
      'खुला भुखंड'
    ],
    'Bill Book List': ['वर्ष', 'बिल बुक क्र.', 'पावती क्र.From', 'पावती क्र.To', 'कर्मचारी नाव', 'Status'],
    'Oblique Property List': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Under Construction Properties': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Property Description Mismatch Property': ['New Ward No.', 'New Property No,', 'New Partition No.', 'Property Descrpition'],
    'Bank,Tower,Office,Hostels without Rent': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Total Tax in Between Given Range': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'Owner Name',
      'Renter Name',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Total Tax is greater than 100000': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    "Properties having old propery no. but it's old Tax and Old RV is zero": [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Property have old Tax but Net Tax is Zero': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Missing Plot area list': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर'
    ],
    'Zero tax Open Plot': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Missing ShopName List': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Missing GIS Photo List': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Property Description': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'NewTotalTax is 10 times greater than OldTotalTax': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'NewTotalTax is 3 times less than OldTotalTax': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'totaltax is less than old total tax': [
      'झोन क्र',
      'नवीन प्रभाग क्र',
      'नवीन मालमत्ता क्र',
      'नवीन भाग क्र',
      'जुना प्रभाग क्र',
      'जुनी मालमत्ता क्र',
      'जुना भाग क्र',
      'मालमत्ता धारकाचे नाव',
      'भोगवटदाराचे नाव',
      'इमारत व दुकान नाव',
      'मालमत्तेचे वर्णन',
      'पत्ता',
      'एकूण क्षेत्रफळ',
      'भाडे',
      'जुने करयोग्य मुल्य',
      'जुना मालमत्ता कर',
      'जूना एकूण कर',
      'प्रस्तावित करयोग्य मुत्प',
      'प्रस्तादि मालमत कर',
      'प्रस्तावित एकूण कर'
    ],
    'Data Entry Gap':['प्रभाग क्र','नवीन मालमत्ता क्र','नवीन भाग क्र','मालमत्ता धारकाचे नाव'],
    'Mutation List':['झोन क्र',' प्रभाग क्र','मालमत्ता क्र','भाग क्र'],
'Property Chart':['नवीन प्रभाग क्र','मुख्य मालमत्ता','भाग क्रं मालमत्ता','एकूण मालमत्ता','खुला भुखंड','इमारती'],
'Zoning list':['नवीन प्रभाग क्र','एकूण मालमत्ता','Z','1','2','3','4','5'],
'Property is Non Taxable but Total Tax is Greater than Zero':['झोन क्र','Ward No.','Property No.','Partition No.','Marathi Owner Name','Marathi Renter Name','Old Rv','Old Total Tax','Property Descrpition','Tax Total'],
'Old carpet area not matching  in flat system':['Ward No.','Property No.','Partition No.'],
"Construction Type like 'AR','BR','CR'..etc but calculated Rent is zero":['झोन क्र','Ward No.','Property No.','Partition No.','Marathi Owner Name','Marathi Renter Name','Old Rv','Old Total Tax','Property Descrpition'],
'Old Total Tax/Old prop Tax greater than Old RV':['झोन क्र','Ward No.','Property No.','Partition No.','Marathi Owner Name','Marathi Renter Name','Old Rv','Old Total Tax','Old Property Tax','Property Descrpition'],
'Commercial properties but education tax is not applied':['Ward No.','Property No.','Partition No.','Finance Year','Education Tax','Total Tax'],
"Comparision of Old and new Rv in percentage":['Ward No.','Property No.','Partition No.','Owner Name','Renter Name','OldRV','New RV','%'],
Default:  [
  'Zone No.',
  'New Ward No.',
  'New Property No.',
  'New Partition No.',
  'Old Ward No',
  'Old Property No.',
  'Old Partition No.',
  'Owner Name (Marathi)',
  'Occuiper Name(Marathi)',
  'Shop/Build Name(Marathi)',
  'Property Descrpition',
  'Address(Marathi)',
  'Total Area',
  'Rent',
  'Old RV',
  'Old Property Tax',
  'Old Total Tax',
  'RV',
  'Property Tax',
  'Total Tax'
],
  };

  //address,address in marathi,mobile
  const [selectedFields, setSelectedFields] = useState({
    addressEnglish: false,
    addressMarathi: false,
    mobile: false
  });

  const baseHeaders = reportHeaders['Missing Address, Address in Marathi and Mobile No'];

  const dynamicHeaders = [...baseHeaders];

  if (selectedFields.addressEnglish) dynamicHeaders.push('Address (English)');
  if (selectedFields.addressMarathi) dynamicHeaders.push('पत्ता');
  if (selectedFields.mobile) dynamicHeaders.push('Mobile No');
  const [appealFilters, setAppealFilters] = useState({
    Net: false,
    Retain: false,
    Hearing: false,
    'Appeal Committee': false,
    Remmision: false
  });
  const handleAppealCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setAppealFilters((prev) => ({ ...prev, [name]: checked }));
  };
  //Mutation
  const handleFetchMutationList = async () => {
    try {
      if (!fromDate || !toDate) {
        alert("Please select both dates");
        return;
      }
  
      console.log("📅 Fetching Mutation List:", fromDate, toDate);
  
      const res = await getMutationListByDateService(fromDate, toDate);
  
      console.log("📌 MUTATION RESPONSE:", res);
  
      setTableData(res.data || []);
  
      setSelectedReport("Mutation List");  
      setShowSelectedListTable(true);
      setOpenDateDialog(false);
  
    } catch (error) {
      console.error("❌ Error fetching mutation list:", error);
    }
  };
//flat
const [selectAllFlat, setSelectAllFlat] = useState(false);

const handleFlatSystemSubmit = async () => {
  if (!flatWard.length || !propertyRangef.from || !propertyRangef.to || !bhk) {
    alert("Please fill all flat system fields");
    return;
  }

  const res = await fetchFlatSystemData(
    flatWard,                           
    Number(propertyRangef.from),
    Number(propertyRangef.to),
    Number(bhk)
  );

  setSelectedReport("Old carpet area not matching  in flat system"); 
        setTableData(res.data || []);

  setShowSelectedListTable(true);
  setShowFlatSystemDialog(false);
};
//comparsion
const [showPercentDialog, setShowPercentDialog] = useState(false);
const [percentValue, setPercentValue] = useState("");
const handlePercentageSubmit = async () => {
  if (!percentValue) {
    alert("Please enter percentage");
    return;
  }

  const res = await fetchOldVsNewRVPercentage(percentValue);

  setSelectedReport("Comparision of Old and new Rv in percentage");
  setTableData(res);
  setShowSelectedListTable(true);
  setShowPercentDialog(false);
};




  
  return (
    <>
      <MainCard>
        <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem' }}>
          Note: Please make Add Taxes and proceed for Generate List..
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <Typography>Select List</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Select
                value={selectedReport}
                onChange={handleChange}
                name={selectedReport || ''}
                fullWidth
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      overflowY: 'auto',
                      width: '200px'
                    }
                  }
                }}
              >
                <MenuItem value="" disabled>
                  Choose a report
                </MenuItem>

                <MenuItem value="Missing Photo List">1) Missing Photo List</MenuItem>
                <MenuItem value="Missing Plan List">2) Missing Plan List</MenuItem>
                <MenuItem value="Zero Tax Property List">3) Zero Tax Property List</MenuItem>
                <MenuItem value="Default Property List">4) Default Property List</MenuItem>
                <MenuItem value="Holder List">5) Holder List</MenuItem>
                <MenuItem value="Missing Property Details List">6) Missing Property Details List</MenuItem>
                <MenuItem value="Old Tax Greater Then Old Rv List">7) Old Tax Greater Old Rv List</MenuItem>
                <MenuItem value="Old Property Tax Greater Then Old Tax">8) Old Property Tax Greater Old Tax</MenuItem>
                <MenuItem value="Old Property Without Old Tax and Old RV">9) Old Property Without Old Tax and Old RV</MenuItem>
                <MenuItem value="Construction Type and Tax Wise List">10) Construction Type and Tax Wise List</MenuItem>
                <MenuItem value="Property With Current Appeal Status List">11) Property With Current Appeal Status List</MenuItem>
                <MenuItem value="Properties in Auto Hearing List">12) Properties in Auto Hearing List</MenuItem>
                <MenuItem value="Properties in Auto Appeal Committee List">13) Properties in Auto Appeal Committee List</MenuItem>
                <MenuItem value="Properties with missing floor Details">14) Properties with missing floor Details</MenuItem>
                <MenuItem value="Properties having zero carpet area">15)Properties having zero carpet area</MenuItem>
                <MenuItem value="Auto AC List">16) Auto QC List</MenuItem>
                <MenuItem value="Combine Property List">17) Combine Property List</MenuItem>
                <MenuItem value="Toilet Count">18) Toilet Count</MenuItem>
                <MenuItem value="Properties without rent">20) Properties without rent</MenuItem>
                <MenuItem value="Properties without old Property tax and old total tax">
                  21) Properties without old Property tax and old total tax
                </MenuItem>
                <MenuItem value="Missing Address, Address in Marathi and Mobile No">
                  22) Missing Address, Address in Marathi and Mobile No
                </MenuItem>
                <MenuItem value="Missing Toilet">23) Missing Toilet</MenuItem>
                <MenuItem value="Duplicate Property List">24) Duplicate Property List</MenuItem>
                <MenuItem value="Duplicate Floor List">25) Duplicate Floor List</MenuItem>
                <MenuItem value="Old RV has value but Net tax is Zero">26) Old RV has value but Net tax is Zero</MenuItem>
                <MenuItem value="Properties without Renter">27) Properties without Renter</MenuItem>
                <MenuItem value="Missing Invoice No.">28) Missing Invoice No.</MenuItem>
                <MenuItem value="Missing floor information in property and excluding plots">
                  29) Missing floor information in property and excluding plots
                </MenuItem>
                <MenuItem value="Missing New and Old Floor type of use information">
                  30) Missing New and Old Floor type of use information
                </MenuItem>
                <MenuItem value="Properties with renter and having rent">31) Properties with renter and having rent</MenuItem>
                <MenuItem value="Missing Appeal Policy With compare to Actual Table values">
                  32) Missing Appeal Policy With compare to Actual Table values
                </MenuItem>
                <MenuItem value="Canceled Invoice Lists">33) Canceled Invoice Lists</MenuItem>
                <MenuItem value="Open Plot Properties">34)Open Plot Properties</MenuItem>
                <MenuItem value="Transaction Report">35)Transaction Report</MenuItem>
                <MenuItem value="Advance Payment Transaction Report">36)Advance Payment Transaction Report</MenuItem>
                <MenuItem value="Bill Book List">37)Bill Book List</MenuItem>
                <MenuItem value="Oblique Property List">38)Oblique Property List</MenuItem>
                <MenuItem value="Comparision of Old and new Rv in percentage">39)Comparision of Old and new Rv in percentage</MenuItem>
                <MenuItem value="Under Construction Properties">40)Under Construction Properties</MenuItem>
                <MenuItem value="Property Data">41)Property Data</MenuItem>
                <MenuItem value="Property Description Mismatch Property">42)Property Description Mismatch Property</MenuItem>
                <MenuItem value="Bank,Tower,Office,Hostels without Rent">43)Bank,Tower,Office,Hostels without Rent</MenuItem>
                <MenuItem value="Total Tax in Between Given Range">44)Total Tax in Between Given Range</MenuItem>
                <MenuItem value="Total Tax is greater than 100000">45)Total Tax is greter than 100000</MenuItem>
                <MenuItem value="Properties having old propery no. but it's old Tax and Old RV is zero">
                  46)Properties having old propery no. but it's old Tax and Old RV is zero
                </MenuItem>
                <MenuItem value="Property have old Tax but Net Tax is Zero">47) Property have old Tax but Net Tax is Zero</MenuItem>
                <MenuItem value="Missing Plot area list">48) Missing Plot area list</MenuItem>
                <MenuItem value="Zero tax Open Plot">49)Zero tax Open Plot</MenuItem>
                <MenuItem value="Missing ShopName List">50)Missing ShopName List</MenuItem>
                <MenuItem value="Missing GIS Photo List">51)Missing GIS Photo List</MenuItem>
                <MenuItem value="Property Description">52)Property Description</MenuItem>
                <MenuItem value="NewTotalTax is 10 times greater than OldTotalTax">
                  53)NewTotalTax is 10 times greater than OldTotalTax
                </MenuItem>
                <MenuItem value="NewTotalTax is 3 times less than OldTotalTax">54)NewTotalTax is 3 times less than OldTotalTax</MenuItem>
                <MenuItem value="totaltax is less than old total tax">55)Totaltax is less than old total tax</MenuItem>
                <MenuItem value="Comparison">56)Comparison</MenuItem>
                <MenuItem value="Residential properties to which employemnt tax is applied">
                  57)Residential properties to which employemnt tax is applied
                </MenuItem>
                <MenuItem value="Commercial properties to which employemnt tax is not applied">
                  58)Commercial properties to which employemnt tax is not applied
                </MenuItem>
                <MenuItem value="New Properties">59)New Properties</MenuItem>
                <MenuItem value="Outer Properties">60)Outer Properties</MenuItem>
                <MenuItem value="Old Tax is Greater than Old RV">61) Old Tax is Greater than Old RV</MenuItem>
                <MenuItem value="Properties having New RV but Net Tax is Zero">62)Properties having New RV but Net Tax is Zero</MenuItem>
                <MenuItem value="Missing Property No.">63)Missing Property No.</MenuItem>
                <MenuItem value="Data Entry Gap">63)Data Entry Gap</MenuItem>

                <MenuItem value="Utility Mismatch Property">64)Utility Mismatch Property</MenuItem>
                <MenuItem value="Comparison Report">65)Comparison Report</MenuItem>
                <MenuItem value="Tax is applied but tax value is Zero">66)Tax is applied but tax value is Zero</MenuItem>
                <MenuItem value="Mutation List">67)Mutation List</MenuItem>
                <MenuItem value="Property Chart">68)Property Chart</MenuItem>
                <MenuItem value="Zoning list">69)Zoning list</MenuItem>
                <MenuItem value="Property is Non Taxable but Total Tax is Greater than Zero">
                  70)Property is Non Taxable but Total Tax is Greater than Zero
                </MenuItem>
                <MenuItem value="Property is Taxable but Total Tax is Zero">71)Property is Taxable but Total Tax is Zero</MenuItem>
                <MenuItem value="Old carpet area not matching  in flat system">72)Old carpet area not matching in flat system</MenuItem>
                <MenuItem value="Construction Type like 'AR','BR','CR'..etc but calculated Rent is zero">
                  73)Construction Type like 'AR','BR','CR'..etc but calculated Rent is zero
                </MenuItem>
                <MenuItem value="Old Total Tax/Old prop Tax greater than Old RV">
                  74)Old Total Tax/Old prop Tax greater than Old RV
                </MenuItem>
                <MenuItem value="Commercial properties but education tax is not applied">
                  75)Commercial properties but education tax is not applied
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Second Grid for Select Wards */}
        <Grid container spacing={2} marginTop={1}>
          <Grid item xs={12} sm={2}>
            <Typography>Select Wards</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Select
                multiple
                value={allWard}
                onChange={handleWardChange}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      overflowY: 'auto'
                    }
                  }
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox checked={selectAll} />
                  <ListItemText primary="All" />
                </MenuItem>

                {[...wardList]
                  .sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo))
                  .map((wd) => (
                    <MenuItem key={wd.NewWardNo} value={wd.NewWardNo}>
                      <Checkbox checked={allWard.indexOf(wd.NewWardNo) > -1} />
                      <ListItemText primary={wd.NewWardNo} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="info" onClick={handleGenerateClick}>
              Generate
            </Button>
          </Grid>
        </Grid>

        {/* Third Grid for List Descriptions */}
        <Grid container spacing={2} marginTop={1}>
          <Grid item xs={12} sm={2}>
            <Typography>List Description</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                minHeight: '100px'
              }}
            >
              <Typography>{description}</Typography>
            </Box>
          </Grid>
        </Grid>
      </MainCard>
      <MainCard style={{ marginTop: '10px' }}>
        <Grid container spacing={2} marginTop={2}>
          {/* --- LEFT CARD --- */}
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem' }}>
                Construction Type and Tax Wise List
              </Typography>

              {/* Select Construction Type */}
              <Grid container spacing={2} marginTop={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography>Select Construction Type</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth disabled={!isConstructionReportSelected}>
                    <InputLabel id="construction-type-label">Select Construction Type</InputLabel>
                    <Select
                      labelId="construction-type-label"
                      multiple
                      value={selectedTypes}
                      onChange={(e) => setSelectedTypes(e.target.value)}
                      renderValue={(selected) => {
                        if (selected.length === 0) return 'Select Construction Type';
                        const selectedNames = constructionTypeList
                          .filter((type) => selected.includes(type.ConstructionId))
                          .map((type) => type.Description)
                          .join(', ');
                        return selectedNames;
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 250, width: 300 }
                        }
                      }}
                    >
                      {constructionTypeList.map((type) => (
                        <MenuItem key={type.CTMId} value={type.ConstructionId}>
                          <Checkbox checked={selectedTypes.includes(type.ConstructionId)} />
                          <ListItemText primary={type.Description} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Total Tax + Proceed */}
              <Grid container spacing={2} marginTop={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography>Total Tax</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
  disabled={!isConstructionReportSelected}
  fullWidth
  type="number"
  value={totalTaxValue}
  onChange={(e) => setTotalTaxValue(e.target.value)}
/>                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" color="success" disabled={!isConstructionReportSelected} onClick={handleConstructionProceed}>
                    Proceed
                  </Button>
                </Grid>
              </Grid>

              {/* Total Record Count */}
              <Grid container spacing={2} marginTop={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography>Total Record Count</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField fullWidth value={totalRecordCount} />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>

          {/* --- RIGHT CARD --- */}
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem' }}>Appeal Status Filter</Typography>

              <Grid container spacing={2} marginTop={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2} direction="row" wrap="nowrap">
                    {['Net', 'Retain', 'Hearing', 'Appeal Committee', 'Remmision'].map((label, index) => (
                      <Grid item key={index}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={label}
                              checked={appealFilters[label]}
                              onChange={handleAppealCheckboxChange}
                              disabled={!isAppealReportSelected}
                            />
                          }
                          label={label}
                        />{' '}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={2} marginTop={2}>
                {/* <Grid item xs={12} sm={4}>
        <Button
  variant="contained"
  color="success"
  disabled={!isAppealReportSelected}
  onClick={() => {
    console.log("🟢 Filter button clicked");
    console.log("📋 Current appealFilters:", appealFilters);

    const activeFilters = Object.keys(appealFilters).filter((key) => appealFilters[key]);
    console.log("✅ Active filters selected:", activeFilters);

    // 🔹 Map UI checkbox labels → backend reasons
    const reasonMap = {
      Retain: "retention",
      Hearing: "hearing",
      "Appeal Committee": "appeal committee",
      Remmision: "remission",
      Net: "net",
    };

    const activeReasons = activeFilters.map(
      (f) => reasonMap[f] || f.toLowerCase().trim()
    );

    console.log("🎯 Mapped active reasons:", activeReasons);

    // Choose dataset
    const dataToFilter =
      Array.isArray(allTableData) && allTableData.length > 0
        ? allTableData
        : Array.isArray(tableData)
        ? tableData
        : [];

    console.log("📦 Data to filter length:", dataToFilter.length);

    if (dataToFilter.length === 0) {
      setSnackbarMessage("No data available for filtering");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    if (activeReasons.length === 0) {
      setSnackbarMessage("Please select at least one filter");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      setTableData(dataToFilter);
      setTotalRecordCount(dataToFilter.length);
      return;
    }

    if (selectedReport !==  "Property With Current Appeal Status List") {
      setSnackbarMessage("Filter works only for 'Property With Current Appeal Status List'");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    console.log("🔍 Applying filters to table data...");

    const filteredRows = dataToFilter
      .map((row) => {
        const appeals = row.appealmasts || [];

        // ✅ Filter out empty/null/undefined reasons before comparison
        const matchingAppeals = appeals.filter((appeal) => {
          const reason = (appeal.Reason || appeal.reason || "").toLowerCase().trim();

          if (!reason) return false; 

          return activeReasons.some(
            (r) => reason.includes(r) || r.includes(reason)
          );
        });

        if (matchingAppeals.length > 0) {
          console.log(
            `✅ Row matched: OwnerID=${row.OwnerID}, AppealReasons=[${matchingAppeals
              .map((a) => a.Reason || a.reason)
              .join(", ")}]`
          );
          return { ...row, appealmasts: matchingAppeals };
        }
        return null;
      })
      .filter((row) => row !== null);

    console.log("🎯 Filtered rows count:", filteredRows.length);
    console.log("🧾 Filtered rows sample:", filteredRows.slice(0, 3));

    setTableData(filteredRows);
    setTotalRecordCount(filteredRows.length);

    if (filteredRows.length === 0) {
      setSnackbarMessage("No matching records found");
      setSnackbarSeverity("info");
    } else {
      setSnackbarMessage(`${filteredRows.length} records matched your filters`);
      setSnackbarSeverity("success");
    }
    setSnackbarOpen(true);
  }}
>
  Filter
</Button>







        </Grid> */}
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!isAppealReportSelected}
                    onClick={() => {
                      console.log('🟢 Filter button clicked');
                      console.log('📋 Current appealFilters:', appealFilters);

                      const activeFilters = Object.keys(appealFilters).filter((key) => appealFilters[key]);
                      console.log('✅ Active filters selected:', activeFilters);

                      // 🔹 Map UI checkbox labels → backend reasons
                      const reasonMap = {
                        Retain: 'retention',
                        Hearing: 'hearing',
                        'Appeal Committee': 'appeal committee',
                        Remmision: 'remission',
                        Net: 'net'
                      };

                      const activeReasons = activeFilters.map((f) => reasonMap[f] || f.toLowerCase().trim());

                      console.log('🎯 Mapped active reasons:', activeReasons);

                      // Choose dataset
                      const dataToFilter =
                        Array.isArray(allTableData) && allTableData.length > 0 ? allTableData : Array.isArray(tableData) ? tableData : [];

                      console.log('📦 Data to filter length:', dataToFilter.length);

                      if (dataToFilter.length === 0) {
                        setSnackbarMessage('No data available for filtering');
                        setSnackbarSeverity('warning');
                        setSnackbarOpen(true);
                        return;
                      }

                      if (activeReasons.length === 0) {
                        setSnackbarMessage('Please select at least one filter');
                        setSnackbarSeverity('warning');
                        setSnackbarOpen(true);
                        setTableData(dataToFilter);
                        setTotalRecordCount(dataToFilter.length);
                        return;
                      }

                      if (selectedReport !== 'Property With Current Appeal Status List') {
                        setSnackbarMessage("Filter works only for 'Property With Current Appeal Status List'");
                        setSnackbarSeverity('info');
                        setSnackbarOpen(true);
                        return;
                      }

                      console.log('🔍 Applying filters to table data...');

                      const filteredRows = dataToFilter
                        .map((row) => {
                          const appeals = row.appealmasts || [];
                          const netReason = row.netRV?.Reason?.toLowerCase() || '';

                          // ✅ Filter appeals
                          const matchingAppeals = appeals.filter((appeal) => {
                            const reason = (appeal.Reason || appeal.reason || '').toLowerCase().trim();
                            if (!reason) return false;
                            return activeReasons.some((r) => reason.includes(r) || r.includes(reason));
                          });

                          // ✅ Check netRV reason
                          const matchesNet = netReason && activeReasons.includes(netReason);

                          if (matchingAppeals.length > 0 || matchesNet) {
                            return {
                              ...row,
                              appealmasts: matchingAppeals
                            };
                          }

                          return null;
                        })
                        .filter((row) => row !== null);

                      console.log('🎯 Filtered rows count:', filteredRows.length);
                      console.log('🧾 Filtered rows sample:', filteredRows.slice(0, 3));

                      setTableData(filteredRows);
                      setTotalRecordCount(filteredRows.length);

                      if (filteredRows.length === 0) {
                        setSnackbarMessage('No matching records found');
                        setSnackbarSeverity('info');
                      } else {
                        setSnackbarMessage(`${filteredRows.length} records matched your filters`);
                        setSnackbarSeverity('success');
                      }
                      setSnackbarOpen(true);
                    }}
                  >
                    Filter
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>

        {/* <Grid container spacing={2} marginTop={1}>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container spacing={2} marginTop={2}>
                <Grid item xs={12} sm={4}>
                  <Typography>Total Record Count</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField value={totalRecordCount} />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem' }}>KDMC Report</Typography>
              <Grid container spacing={2} marginTop={0.5}>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" color="success" onClick={handleFloorWiseClick}>
                    Floor Wise
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" color="success" onClick={handlePropertyWiseClick}>
                    Property Wise
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid> */}
      </MainCard>

      <MainCard style={{ marginTop: '10px', height: '500px' }}>
        <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem' }}>Selected List Records</Typography>
        {loading && (
          <Typography
            style={{
              color: 'red',
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            Please wait, While processing...
          </Typography>
        )}
        {showSelectedListTable && selectedReport === 'Missing Photo List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Missing Photo List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.zone}</TableCell>
                    <TableCell>{row.newWard}</TableCell>
                    <TableCell>{row.newProperty}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupantName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.photoA}</TableCell>
                    <TableCell>{row.photoB}</TableCell>
                    <TableCell>{row.photoC}</TableCell>
                    <TableCell>{row.photoD}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Missing Plan List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell> {/* एकूण क्षेत्रफळ */}
                    <TableCell>{row.rent}</TableCell> {/* भाडे */}
                    <TableCell>{row.oldRV}</TableCell> {/* जुने करयोग्य मूल्य */}
                    <TableCell>{row.oldPropertyTax}</TableCell> {/* जुना मालमत्ता कर */}
                    <TableCell>{row.oldTotalTax}</TableCell> {/* प्रस्तावित करयोग्य मूल्य */}
                    <TableCell>{row.propertyTax}</TableCell> {/* प्रस्तावित मालमत्ता कर */}
                    <TableCell>{row.rateableValue}</TableCell> {/* प्रस्तावित एकूण कर */}
                    <TableCell>{row.taxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Zero Tax Property List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell> {/* एकूण क्षेत्रफळ */}
                    <TableCell>{row.rent}</TableCell> {/* भाडे */}
                    <TableCell>{row.oldRV}</TableCell> {/* जुने करयोग्य मूल्य */}
                    <TableCell>{row.oldPropertyTax}</TableCell> {/* जुना मालमत्ता कर */}
                    <TableCell>{row.oldTotalTax}</TableCell> {/* प्रस्तावित करयोग्य मूल्य */}
                    <TableCell>{row.propertyTax}</TableCell> {/* प्रस्तावित मालमत्ता कर */}
                    <TableCell>{row.rateableValue}</TableCell> {/* प्रस्तावित एकूण कर */}
                    <TableCell>{row.taxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Default Property List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell> {/* एकूण क्षेत्रफळ */}
                    <TableCell>{row.rent}</TableCell> {/* भाडे */}
                    <TableCell>{row.oldRV}</TableCell> {/* जुने करयोग्य मूल्य */}
                    <TableCell>{row.oldPropertyTax}</TableCell> {/* जुना मालमत्ता कर */}
                    <TableCell>{row.oldTotalTax}</TableCell> {/* प्रस्तावित करयोग्य मूल्य */}
                    <TableCell>{row.propertyTax}</TableCell> {/* प्रस्तावित मालमत्ता कर */}
                    <TableCell>{row.rateableValue}</TableCell> {/* प्रस्तावित एकूण कर */}
                    <TableCell>{row.taxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Holder List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell> {/* एकूण क्षेत्रफळ */}
                    <TableCell>{row.rent}</TableCell> {/* भाडे */}
                    <TableCell>{row.oldRV}</TableCell> {/* जुने करयोग्य मूल्य */}
                    <TableCell>{row.oldPropertyTax}</TableCell> {/* जुना मालमत्ता कर */}
                    <TableCell>{row.OldTotalTax}</TableCell> {/* प्रस्तावित करयोग्य मूल्य */}
                    <TableCell>{row.propertyTax}</TableCell> {/* प्रस्तावित मालमत्ता कर */}
                    <TableCell>{row.rateableValue}</TableCell> {/* प्रस्तावित एकूण कर */}
                    <TableCell>{row.taxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Missing Property Details List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Missing Property Details List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Old Tax Greater Then Old Rv List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell> {/* एकूण क्षेत्रफळ */}
                    <TableCell>{row.rent}</TableCell> {/* भाडे */}
                    <TableCell>{row.oldRV}</TableCell> {/* जुने करयोग्य मूल्य */}
                    <TableCell>{row.oldPropertyTax}</TableCell> {/* जुना मालमत्ता कर */}
                    <TableCell>{row.oldTotalTax}</TableCell> {/* प्रस्तावित करयोग्य मूल्य */}
                    <TableCell>{row.propertyTax}</TableCell> {/* प्रस्तावित मालमत्ता कर */}
                    <TableCell>{row.rateableValue}</TableCell> {/* प्रस्तावित एकूण कर */}
                    <TableCell>{row.taxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Old Property Tax Greater Then Old Tax' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell> {/* एकूण क्षेत्रफळ */}
                    <TableCell>{row.rent}</TableCell> {/* भाडे */}
                    <TableCell>{row.oldRV}</TableCell> {/* जुने करयोग्य मूल्य */}
                    <TableCell>{row.oldPropertyTax}</TableCell> {/* जुना मालमत्ता कर */}
                    <TableCell>{row.oldTotalTax}</TableCell> {/* प्रस्तावित करयोग्य मूल्य */}
                    <TableCell>{row.propertyTax}</TableCell> {/* प्रस्तावित मालमत्ता कर */}
                    <TableCell>{row.rateableValue}</TableCell> {/* प्रस्तावित एकूण कर */}
                    <TableCell>{row.taxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Old Property Without Old Tax and Old RV' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Old Property Without Old Tax and Old RV'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.oldRV}</TableCell> {/* जुने करयोग्य मूल्य */}
                    <TableCell>{row.oldPropertyTax}</TableCell> {/* जुना मालमत्ता कर */}
                    <TableCell>{row.propertyTax}</TableCell> {/* प्रस्तावित मालमत्ता कर */}
                    <TableCell>{row.rateableValue}</TableCell> {/* प्रस्तावित एकूण कर */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showConstructionTable && selectedReport === 'Construction Type and Tax Wise List' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Construction Type and Tax Wise List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.zone}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.marathiOwnerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.marathiOccupierName}</TableCell>
                    <TableCell>{row.renterName}</TableCell>

                    <TableCell>{row.constructionTypeDesc}</TableCell>
                    <TableCell>{row.oldRV}</TableCell>
                    <TableCell>{row.oldPropertyTax}</TableCell>
                    <TableCell>{row.oldTotalTax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Property With Current Appeal Status List' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {(reportHeaders['Property With Current Appeal Status List'] || []).map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(tableData || []).map((row, idx) => {
                  // Flatten nested arrays
                  const renter = row.combinedownerrenternames?.[0] || {};
                  const appeal = row.appealmasts?.[0] || {};
                  const oldpropertymast = row.oldpropertymast?.[0] || {};

                  return (
                    <TableRow key={idx}>
                      <TableCell>{row.NewZoneNo}</TableCell>
                      <TableCell>{row.NewWardNo}</TableCell>
                      <TableCell>{row.NewPropertyNo}</TableCell>
                      <TableCell>{row.NewPartitionNo}</TableCell>
                      <TableCell>{row.oldpropertymast?.OldWardNo}</TableCell>
                                            <TableCell>{row.oldpropertymast.OldPropertyNo || ''}</TableCell>
                      <TableCell>{row.oldpropertymast.OldPartitionNo || ''}</TableCell>

                      <TableCell>{renter.OwnerName}</TableCell>
                      <TableCell>{renter.OwnerNameMarathi}</TableCell>
                      <TableCell>{renter.OccupierName || ''}</TableCell>
                      <TableCell>{renter.MarathiOccupierName || ''}</TableCell>
                      <TableCell>{renter.RenterName || ''}</TableCell>
                      <TableCell>{appeal.Reason || row.netRV?.Reason || ''}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Properties in Auto Hearing List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Properties in Auto Hearing List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.ownerNameMarathi}</TableCell>
                    <TableCell>{row.renterName}</TableCell>
                    <TableCell>{row.renterNameMarathi}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Properties in Auto Appeal Committee List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Properties in Auto Hearing List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.ownerNameMarathi}</TableCell>
                    <TableCell>{row.renterName}</TableCell>
                    <TableCell>{row.renterNameMarathi}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Toilet Count' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Toilet Count']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>

                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.ownerNameMarathi}</TableCell>

                    <TableCell>{row.renterName}</TableCell>
                    <TableCell>{row.renterNameMarathi}</TableCell>

                    <TableCell>{row.toiletSeatResidential}</TableCell>
                    <TableCell>{row.toiletSeatNonResidential}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Properties without rent' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Properties without rent']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>

                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.ownerNameMarathi}</TableCell>

                    <TableCell>{row.OccupierYesNo}</TableCell>
                    <TableCell>{row.Rent}</TableCell>

                    <TableCell>{row.RenterName}</TableCell>
                    <TableCell>{row.OccupierNameMarathi}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Duplicate Property List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Duplicate Property List']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Properties with missing floor Details' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>

                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.ownerNameMarathi}</TableCell>

                    <TableCell>{row.renterName}</TableCell>
                    <TableCell>{row.renterNameMarathi}</TableCell>

                    <TableCell>{row.toiletSeatResidential}</TableCell>
                    <TableCell>{row.toiletSeatNonResidential}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Properties having zero carpet area' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Properties having zero carpet area']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>

                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.occupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>

                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Combine Property List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Combine Property List']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.OwnerID}</TableCell>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>

                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOwnerName}</TableCell>
                    <TableCell>{row.RenterName}</TableCell>
                    <TableCell>{row.MarathiRenterName}</TableCell>
                    <TableCell>{row.PropertyRemark}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Missing Address, Address in Marathi and Mobile No' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {dynamicHeaders.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell>
                    <TableCell>{row.rent}</TableCell>
                    <TableCell>{row.oldRV}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.rateableValue}</TableCell>
                    <TableCell>{row.propertyTax}</TableCell>
                    <TableCell>{row.oldTotalTax}</TableCell>
                    <TableCell>{row.taxTotal}</TableCell>

                    {/* DYNAMIC DATA COLUMNS */}
                    {selectedFields.addressEnglish && <TableCell>{row.address}</TableCell>}
                    {selectedFields.addressMarathi && <TableCell>{row.OwnerPatta}</TableCell>}
                    {selectedFields.mobile && <TableCell>{row.MobileNo}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Old RV has value but Net tax is Zero' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Old RV has value but Net tax is Zero']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>
                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.marathiOccupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell>
                    <TableCell>{row.rent}</TableCell>
                    <TableCell>{row.oldRV}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.rateableValue}</TableCell>
                    <TableCell>{row.propertyTax}</TableCell>
                    <TableCell>{row.oldTotalTax}</TableCell>
                    <TableCell>{row.taxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Missing Invoice No.' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Missing Invoice No.']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.Year}</TableCell>
                      <TableCell>{row.BillBookNo}</TableCell>
                      <TableCell>{row.ReceiptNo}</TableCell>
                      <TableCell>{row.EmpName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} style={{ textAlign: 'center' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Missing floor information in property and excluding plots' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Missing floor information in property and excluding plots'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Duplicate Floor List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportHeaders['Duplicate Floor List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.OwnerID}</TableCell>

                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.MarathiOwnerName}</TableCell>
                    <TableCell>{row.OccupierName}</TableCell>
                    <TableCell>{row.OccupierNameMarathi}</TableCell>
                    <TableCell>{row.FloorID}</TableCell>
                    <TableCell>{row.ConstructionYear}</TableCell>
                    <TableCell>{row.ConstructionType}</TableCell>
                    <TableCell>{row.TypeOFUse}</TableCell>
                    <TableCell>{row.CarpetAreaSqFeet}</TableCell>
                    <TableCell>{row.CarpetAreaSqMeter}</TableCell>
                    <TableCell>{row.NoOfRooms}</TableCell>
                    <TableCell>{row.Registration}</TableCell>
                    <TableCell>{row.OccupierYesNo}</TableCell>
                    <TableCell>{row.Rent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Properties without Renter' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Properties without Renter']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.NewWardNo}</TableCell>
                      <TableCell>{row.NewPropertyNo}</TableCell>
                      <TableCell>{row.NewPartitionNo}</TableCell>
                      <TableCell>{row.OwnerName}</TableCell>
                      <TableCell>{row.ownerNameMarathi}</TableCell>
                      <TableCell>{row.OccupierYesNo}</TableCell>
                      <TableCell>{row.Rent}</TableCell>
                      <TableCell>{row.RenterName}</TableCell>
                      <TableCell>{row.OccupierName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} style={{ textAlign: 'center' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Missing Toilet' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Missing Toilet']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.NewZoneNo}</TableCell>
                      <TableCell>{row.NewWardNo}</TableCell>
                      <TableCell>{row.NewPropertyNo}</TableCell>
                      <TableCell>{row.NewPartitionNo}</TableCell>
                      <TableCell>{row.OldWardNo}</TableCell>
                      <TableCell>{row.OldPropertyNo}</TableCell>
                      <TableCell>{row.OldPartitionNo}</TableCell>
                      <TableCell>{row.OwnerName}</TableCell>
                      <TableCell>{row.RenterName}</TableCell>
                      <TableCell>{row.BuildingOrShopNameMarathi}</TableCell>
                      <TableCell>{row.OwnerPatta}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} style={{ textAlign: 'center' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Properties with renter and having rent' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Properties with renter and having rent']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.NewZoneNo}</TableCell>
                      <TableCell>{row.NewWardNo}</TableCell>
                      <TableCell>{row.NewPropertyNo}</TableCell>
                      <TableCell>{row.NewPartitionNo}</TableCell>
                      <TableCell>{row.OldWardNo}</TableCell>
                      <TableCell>{row.OldPropertyNo}</TableCell>
                      <TableCell>{row.OldPartitionNo}</TableCell>
                      <TableCell>{row.OwnerName}</TableCell>
                      <TableCell>{row.RenterName}</TableCell>
                      <TableCell>{row.BuildingOrShopNameMarathi}</TableCell>
                      <TableCell>{row.OwnerPatta}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} style={{ textAlign: 'center' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Canceled Invoice Lists' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Canceled Invoice Lists']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.BillBookNo}</TableCell>
                      <TableCell>{row.ReceiptNoFrom}</TableCell>
                      <TableCell>{row.ReceiptNoTo}</TableCell>
                      <TableCell>{row.Remark}</TableCell>
                      <TableCell>{row.EmpName}</TableCell>
                      <TableCell>{row.Year}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} style={{ textAlign: 'center' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Open Plot Properties' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Open Plot Properties']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.NewWardNo}</TableCell>
                      <TableCell>{row.NewPropertyNo}</TableCell>
                      <TableCell>{row.NewPartitionNo}</TableCell>
                      <TableCell>{row.OldWardNo}</TableCell>
                      <TableCell>{row.OldPropertyNo}</TableCell>
                      <TableCell>{row.OldPartitionNo}</TableCell>
                      <TableCell>{row.OwnerName}</TableCell>
                      <TableCell>{row.MarathiOwnerName}</TableCell>
                      <TableCell>{row.OccupierName}</TableCell>
                      <TableCell>{row.MarathiRenterName}</TableCell>
                      <TableCell>{row.OpenPlotRenterName}</TableCell>

                      <TableCell>{row.ProposedTax}</TableCell>
                      <TableCell>{row.ProposedRateableValue}</TableCell>
                      <TableCell>{row.IsOpenPlot}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} style={{ textAlign: 'center' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Bill Book List' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Bill Book List']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.Year}</TableCell>
                      <TableCell>{row.BillBookNo}</TableCell>
                      <TableCell>{row.ReceiptNoFrom}</TableCell>
                      <TableCell>{row.ReceiptNoTo}</TableCell>
                      <TableCell>{row.EmpName}</TableCell>
                      <TableCell>{row.Status ? 'True' : 'False'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} style={{ textAlign: 'center' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Oblique Property List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Oblique Property List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>

                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopNameMarathi}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.ProposedRV}</TableCell>
                    <TableCell>{row.ProposedPropertyTax}</TableCell>
                    <TableCell>{row.ProposedTotalTax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Under Construction Properties' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Under Construction Properties'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>

                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.MarathiOwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopNameMarathi}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.ProposedRV}</TableCell>
                    <TableCell>{row.ProposedPropertyTax}</TableCell>
                    <TableCell>{row.ProposedTotalTax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Property Description Mismatch Property' && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Property Description Mismatch Property']?.map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.WardNo}</TableCell>
                      <TableCell>{row.PropertyNo}</TableCell>
                      <TableCell>{row.PartitionNo}</TableCell>
                      <TableCell>{row.PropertyDescription}</TableCell>
                      <TableCell>{row.ownerNameMarathi}</TableCell>
                      <TableCell>{row.OccupierYesNo}</TableCell>
                      <TableCell>{row.Rent}</TableCell>
                      <TableCell>{row.RenterName}</TableCell>
                      <TableCell>{row.OccupierName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} style={{ textAlign: 'center' }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Bank,Tower,Office,Hostels without Rent' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Bank,Tower,Office,Hostels without Rent'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.newZoneNo}</TableCell>

                    <TableCell>{row.newWardNo}</TableCell>
                    <TableCell>{row.newPropertyNo}</TableCell>
                    <TableCell>{row.newPart}</TableCell>
                    <TableCell>{row.oldWard}</TableCell>
                    <TableCell>{row.oldProperty}</TableCell>
                    <TableCell>{row.oldPart}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.buildingName}</TableCell>
                    <TableCell>{row.propertyDesc}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.carpetAreaSqFeet}</TableCell>
                    <TableCell>{row.rent}</TableCell>
                    <TableCell>{row.oldRV}</TableCell>
                    <TableCell>{row.oldPropertyTax}</TableCell>
                    <TableCell>{row.oldTotalTax}</TableCell>
                    <TableCell>{row.rateableValue}</TableCell>
                    <TableCell>{row.propertyTax}</TableCell>
                    <TableCell>{row.taxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Total Tax in Between Given Range' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Total Tax in Between Given Range'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>

                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.RenterName}</TableCell>
                    <TableCell>{row.ImaratName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.ProposedRV}</TableCell>
                    <TableCell>{row.ProposedPropertyTax}</TableCell>
                    <TableCell>{row.ProposedTotalTax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Total Tax is greater than 100000' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Total Tax is greater than 100000'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.MarathiOwnerName}</TableCell>
                    <TableCell>{row.MarathiRenterName}</TableCell>
                    <TableCell>{row.ImaratName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.ProposedRV}</TableCell>
                    <TableCell>{row.ProposedPropertyTax}</TableCell>
                    <TableCell>{row.ProposedTotalTax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable &&
          selectedReport === "Properties having old propery no. but it's old Tax and Old RV is zero" &&
          allWard.length > 0 && (
            <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {reportHeaders["Properties having old propery no. but it's old Tax and Old RV is zero"].map((header, index) => (
                      <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.NewZoneNo}</TableCell>
                      <TableCell>{row.WardNo}</TableCell>
                      <TableCell>{row.PropertyNo}</TableCell>
                      <TableCell>{row.PartitionNo}</TableCell>
                      <TableCell>{row.OldWardNo}</TableCell>
                      <TableCell>{row.OldPropertyNo}</TableCell>
                      <TableCell>{row.OldPartitionNo}</TableCell>
                      <TableCell>{row.OwnerName}</TableCell>
                      <TableCell>{row.RenterName}</TableCell>
                      <TableCell>{row.ImaratName}</TableCell>
                      <TableCell>{row.PropertyDescription}</TableCell>
                      <TableCell>{row.Address}</TableCell>
                      <TableCell>{row.TotalArea}</TableCell>
                      <TableCell>{row.TotalRent}</TableCell>
                      <TableCell>{row.OldRV}</TableCell>
                      <TableCell>{row.OldPropertyTax}</TableCell>
                      <TableCell>{row.OldTotalTax}</TableCell>
                      <TableCell>{row.ProposedRV}</TableCell>
                      <TableCell>{row.ProposedPropertyTax}</TableCell>
                      <TableCell>{row.ProposedTotalTax}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

        {showSelectedListTable && selectedReport === 'Property have old Tax but Net Tax is Zero' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Property have old Tax but Net Tax is Zero'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.RenterName}</TableCell>
                    <TableCell>{row.ImaratName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.ProposedRV}</TableCell>
                    <TableCell>{row.ProposedPropertyTax}</TableCell>
                    <TableCell>{row.ProposedTotalTax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Missing Plot area list' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Missing Plot area list'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.RenterName}</TableCell>
                    <TableCell>{row.ImaratName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Zero tax Open Plot' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Zero tax Open Plot'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.ImaratName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.RateableValue}</TableCell>
                    <TableCell>{row.PropertyTax}</TableCell>
                    <TableCell>{row.TaxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Missing ShopName List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Missing ShopName List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.RateableValue}</TableCell>
                    <TableCell>{row.PropertyTax}</TableCell>
                    <TableCell>{row.TaxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'Missing GIS Photo List' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Missing GIS Photo List'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.OccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.RateableValue}</TableCell>
                    <TableCell>{row.PropertyTax}</TableCell>
                    <TableCell>{row.TaxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {showSelectedListTable && selectedReport === 'NewTotalTax is 10 times greater than OldTotalTax' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['NewTotalTax is 10 times greater than OldTotalTax'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.RateableValue}</TableCell>
                    <TableCell>{row.PropertyTax}</TableCell>
                    <TableCell>{row.TaxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'NewTotalTax is 3 times less than OldTotalTax' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['NewTotalTax is 3 times less than OldTotalTax'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.RateableValue}</TableCell>
                    <TableCell>{row.PropertyTax}</TableCell>
                    <TableCell>{row.TaxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'totaltax is less than old total tax' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['totaltax is less than old total tax'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.RateableValue}</TableCell>
                    <TableCell>{row.PropertyTax}</TableCell>
                    <TableCell>{row.TaxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Comparison' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.RateableValue}</TableCell>
                    <TableCell>{row.PropertyTax}</TableCell>
                    <TableCell>{row.TaxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Residential properties to which employemnt tax is applied' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopName}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.RateableValue}</TableCell>
                    <TableCell>{row.PropertyTax}</TableCell>
                    <TableCell>{row.TaxTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable &&
          selectedReport === 'Commercial properties to which employemnt tax is not applied' &&
          allWard.length > 0 && (
            <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {reportHeaders['Default'].map((header, index) => (
                      <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.ZoneNo}</TableCell>
                      <TableCell>{row.WardNo}</TableCell>
                      <TableCell>{row.PropertyNo}</TableCell>
                      <TableCell>{row.PartitionNo}</TableCell>
                      <TableCell>{row.OldWardNo}</TableCell>
                      <TableCell>{row.OldPropertyNo}</TableCell>
                      <TableCell>{row.OldPartitionNo}</TableCell>
                      <TableCell>{row.OwnerName}</TableCell>
                      <TableCell>{row.MarathiOccupierName}</TableCell>
                      <TableCell>{row.BuildingName}</TableCell>
                      <TableCell>{row.Description}</TableCell>
                      <TableCell>{row.Address}</TableCell>
                      <TableCell>{row.TotalArea}</TableCell>
                      <TableCell>{row.TotalRent}</TableCell>
                      <TableCell>{row.RV_Old}</TableCell>
                      <TableCell>{row.PropertyTax_Old}</TableCell>
                      <TableCell>{row.TotalTax_Old}</TableCell>
                      <TableCell>{row.RV_New}</TableCell>
                      <TableCell>{row.PropertyTax_New}</TableCell>
                      <TableCell>{row.TotalTax_New}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        {showSelectedListTable && selectedReport === 'New Properties' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.ZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingName}</TableCell>
                    <TableCell>{row.Description}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.RV_Old}</TableCell>
                    <TableCell>{row.PropertyTax_Old}</TableCell>
                    <TableCell>{row.TotalTax_Old}</TableCell>
                    <TableCell>{row.RV_New}</TableCell>
                    <TableCell>{row.PropertyTax_New}</TableCell>
                    <TableCell>{row.TotalTax_New}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Outer Properties' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.ZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingName}</TableCell>
                    <TableCell>{row.Description}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.RV_Old}</TableCell>
                    <TableCell>{row.PropertyTax_Old}</TableCell>
                    <TableCell>{row.TotalTax_Old}</TableCell>
                    <TableCell>{row.RV_New}</TableCell>
                    <TableCell>{row.PropertyTax_New}</TableCell>
                    <TableCell>{row.TotalTax_New}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Old Tax is Greater than Old RV' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.ZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingName}</TableCell>
                    <TableCell>{row.Description}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.RV_Old}</TableCell>
                    <TableCell>{row.PropertyTax_Old}</TableCell>
                    <TableCell>{row.TotalTax_Old}</TableCell>
                    <TableCell>{row.RV_New}</TableCell>
                    <TableCell>{row.PropertyTax_New}</TableCell>
                    <TableCell>{row.TotalTax_New}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Missing Appeal Policy With compare to Actual Table values' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.ZoneNo}</TableCell>
                    <TableCell>{row.WardNo}</TableCell>
                    <TableCell>{row.PropertyNo}</TableCell>
                    <TableCell>{row.PartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingName}</TableCell>
                    <TableCell>{row.Description}</TableCell>
                    <TableCell>{row.Address}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.RV_Old}</TableCell>
                    <TableCell>{row.PropertyTax_Old}</TableCell>
                    <TableCell>{row.TotalTax_Old}</TableCell>
                    <TableCell>{row.RV_New}</TableCell>
                    <TableCell>{row.PropertyTax_New}</TableCell>
                    <TableCell>{row.TotalTax_New}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
         {showSelectedListTable && selectedReport === 'Properties having New RV but Net Tax is Zero' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewZoneNo}</TableCell>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.OldWardNo}</TableCell>
                    <TableCell>{row.OldPropertyNo}</TableCell>
                    <TableCell>{row.OldPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                    <TableCell>{row.MarathiOccupierName}</TableCell>
                    <TableCell>{row.BuildingOrShopNameMarathi}</TableCell>
                    <TableCell>{row.PropertyDescription}</TableCell>
                    <TableCell>{row.OwnerPatta}</TableCell>
                    <TableCell>{row.TotalArea}</TableCell>
                    <TableCell>{row.TotalRent}</TableCell>
                    <TableCell>{row.OldRV}</TableCell>
                    <TableCell>{row.OldPropertyTax}</TableCell>
                    <TableCell>{row.OldTotalTax}</TableCell>
                    <TableCell>{row.ProposedRV}</TableCell>
                    <TableCell>{row.ProposedPropertyTax}</TableCell>
                    <TableCell>{row.ProposedTotalTax}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
             {showSelectedListTable && selectedReport === 'Utility Mismatch Property' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Default'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
  {tableData.length > 0 ? (
    tableData.map((row, idx) => (
      <TableRow key={idx}>
        <TableCell>{row.NewZoneNo}</TableCell>
        <TableCell>{row.NewWardNo}</TableCell>
        <TableCell>{row.NewPropertyNo}</TableCell>
        <TableCell>{row.NewPartitionNo}</TableCell>
        <TableCell>{row.OldWardNo}</TableCell>
        <TableCell>{row.OldPropertyNo}</TableCell>
        <TableCell>{row.OldPartitionNo}</TableCell>
        <TableCell>{row.OwnerName}</TableCell>
        <TableCell>{row.MarathiOccupierName}</TableCell>
        <TableCell>{row.BuildingOrShopNameMarathi}</TableCell>
        <TableCell>{row.PropertyDescription}</TableCell>
        <TableCell>{row.OwnerPatta}</TableCell>
        <TableCell>{row.TotalArea}</TableCell>
        <TableCell>{row.TotalRent}</TableCell>
        <TableCell>{row.OldRV}</TableCell>
        <TableCell>{row.OldPropertyTax}</TableCell>
        <TableCell>{row.OldTotalTax}</TableCell>
        <TableCell>{row.ProposedRV}</TableCell>
        <TableCell>{row.ProposedPropertyTax}</TableCell>
        <TableCell>{row.ProposedTotalTax}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell 
        colSpan={reportHeaders['Default'].length} 
        style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
      >
        No Data Found
      </TableCell>
    </TableRow>
  )}
</TableBody>

            </Table>
          </TableContainer>
        )}
        {showSelectedListTable && selectedReport === 'Data Entry Gap' && allWard.length > 0 && (
          <TableContainer style={{ marginTop: '20px', maxHeight: '430px', overflowY: 'auto' , width: '100%' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportHeaders['Data Entry Gap'].map((header, index) => (
                    <TableCell key={index} style={{ fontWeight: 'bold', top: 0, position: 'sticky', zIndex: 10 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.NewWardNo}</TableCell>
                    <TableCell>{row.NewPropertyNo}</TableCell>
                    <TableCell>{row.NewPartitionNo}</TableCell>
                    <TableCell>{row.OwnerName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
   {showSelectedListTable &&
  selectedReport === "Tax is applied but tax value is Zero" &&
  allWard.length > 0 && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Default"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.NewZoneNo}</TableCell>
                <TableCell>{row.NewWardNo}</TableCell>
                <TableCell>{row.NewPropertyNo}</TableCell>
                <TableCell>{row.NewPartitionNo}</TableCell>
                <TableCell>{row.OldWardNo}</TableCell>
                <TableCell>{row.OldPropertyNo}</TableCell>
                <TableCell>{row.OldPartitionNo}</TableCell>
                <TableCell>{row.OwnerName}</TableCell>
                <TableCell>{row.MarathiOccupierName}</TableCell>
                <TableCell>{row.BuildingOrShopNameMarathi}</TableCell>
                <TableCell>{row.PropertyDescription}</TableCell>
                <TableCell>{row.OwnerPatta}</TableCell>
                <TableCell>{row.TotalArea}</TableCell>
                <TableCell>{row.TotalRent}</TableCell>
                <TableCell>{row.OldRV}</TableCell>
                <TableCell>{row.OldPropertyTax}</TableCell>
                <TableCell>{row.OldTotalTax}</TableCell>
                <TableCell>{row.ProposedRV}</TableCell>
                <TableCell>{row.ProposedPropertyTax}</TableCell>
                <TableCell>{row.ProposedTotalTax}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )}
{showSelectedListTable && selectedReport === "Mutation List" && (
  <TableContainer style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto",width: '100%'  }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {reportHeaders["Mutation List"].map((header, index) => (
            <TableCell key={index} style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}>
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {tableData.length > 0 ? (
          tableData.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.NewZoneNo}</TableCell>
              <TableCell>{row.NewWardNo}</TableCell>
              <TableCell>{row.NewPropertyNo}</TableCell>
              <TableCell>{row.NewPartitionNo}</TableCell>
              
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={reportHeaders["Mutation List"].length} style={{ textAlign: "center", padding: "20px" }}>
              No Data Found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
)}
{showSelectedListTable &&
  selectedReport === "Property Chart" &&
  allWard.length > 0 && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Property Chart"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                 <TableCell>{row["नवीन प्रभाग क्र"]}</TableCell>
        <TableCell>{row["मुख्य मालमत्ता"]}</TableCell>
        <TableCell>{row["भाग क्रं मालमत्ता"]}</TableCell>
        <TableCell>{row["एकूण मालमत्ता"]}</TableCell>
        <TableCell>{row["खुला भुखंड"]}</TableCell>
        <TableCell>{row["इमारती"]}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )}
{showSelectedListTable &&
  selectedReport === "Zoning list" &&
  allWard.length > 0 && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Zoning list"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                 <TableCell>{row["नवीन प्रभाग क्र"]}</TableCell>
        <TableCell>{row["एकूण मालमत्ता"]}</TableCell>
        <TableCell>{row["Z"]}</TableCell>
        <TableCell>{row["1"]}</TableCell>
        <TableCell>{row["2"]}</TableCell>
        <TableCell>{row["3"]}</TableCell>
        <TableCell>{row["4"]}</TableCell>
        <TableCell>{row["5"]}</TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )}
{showSelectedListTable &&
  selectedReport === "Property is Non Taxable but Total Tax is Greater than Zero" &&
  allWard.length > 0 && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Property is Non Taxable but Total Tax is Greater than Zero"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                  <TableCell>{row.newZoneNo}</TableCell>
              <TableCell>{row.newWardNo}</TableCell>
              <TableCell>{row.newPropertyNo}</TableCell>
              <TableCell>{row.newPart}</TableCell>
              <TableCell>{row.ownerName}</TableCell>
              <TableCell>{row.RenterName}</TableCell>
              <TableCell>{row.oldRV}</TableCell>
              <TableCell>{row.oldTotalTax}</TableCell>
              <TableCell>{row.propertyDesc}</TableCell>
              <TableCell>{row.taxTotal}</TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )} 
{showSelectedListTable &&
  selectedReport === "Property is Taxable but Total Tax is Zero" &&
  allWard.length > 0 && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Property is Non Taxable but Total Tax is Greater than Zero"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                  <TableCell>{row.newZoneNo}</TableCell>
              <TableCell>{row.newWardNo}</TableCell>
              <TableCell>{row.newPropertyNo}</TableCell>
              <TableCell>{row.newPart}</TableCell>
              <TableCell>{row.ownerName}</TableCell>
              <TableCell>{row.RenterName}</TableCell>
              <TableCell>{row.oldRV}</TableCell>
              <TableCell>{row.oldTotalTax}</TableCell>
              <TableCell>{row.propertyDesc}</TableCell>
              <TableCell>{row.taxTotal}</TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )}
 {showSelectedListTable &&
  selectedReport === "Old carpet area not matching  in flat system" && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Old carpet area not matching  in flat system"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.newZoneNo}</TableCell>
                <TableCell>{row.newWardNo}</TableCell>
                <TableCell>{row.newPropertyNo}</TableCell>
                <TableCell>{row.newPart}</TableCell>
                <TableCell>{row.ownerName}</TableCell>
                <TableCell>{row.renterName}</TableCell>
                <TableCell>{row.oldRV}</TableCell>
                <TableCell>{row.oldTotalTax}</TableCell>
                <TableCell>{row.propertyDesc}</TableCell>
                <TableCell>{row.taxTotal}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Old carpet area not matching  in flat system"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
)}

   {showSelectedListTable &&
  selectedReport === "Construction Type like 'AR','BR','CR'..etc but calculated Rent is zero" &&
  allWard.length > 0 && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Construction Type like 'AR','BR','CR'..etc but calculated Rent is zero"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                  <TableCell>{row.newZoneNo}</TableCell>
              <TableCell>{row.newWardNo}</TableCell>
              <TableCell>{row.newPropertyNo}</TableCell>
              <TableCell>{row.newPart}</TableCell>
              <TableCell>{row.ownerName}</TableCell>
              <TableCell>{row.RenterName}</TableCell>
              <TableCell>{row.oldRV}</TableCell>
              <TableCell>{row.oldTotalTax}</TableCell>
              <TableCell>{row.propertyDesc}</TableCell>
              <TableCell>{row.taxTotal}</TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )}
   {showSelectedListTable &&
  selectedReport === "Old Total Tax/Old prop Tax greater than Old RV" &&
  allWard.length > 0 && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Old Total Tax/Old prop Tax greater than Old RV"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                  <TableCell>{row.NewZoneNo}</TableCell>
              <TableCell>{row.NewWardNo}</TableCell>
              <TableCell>{row.NewPropertyNo}</TableCell>
              <TableCell>{row.NewPartitionNo}</TableCell>
              <TableCell>{row.MarathiOwnerName}</TableCell>
              <TableCell>{row.MarathiRenterName}</TableCell>
              <TableCell>{row.OldRV}</TableCell>
              <TableCell>{row.OldPropertyTax}</TableCell>
              <TableCell>{row.PropertyDescription}</TableCell>
              <TableCell>{row.OldTotalTax}</TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )}
    {showSelectedListTable &&
  selectedReport === "Comparision of Old and new Rv in percentage" && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Comparision of Old and new Rv in percentage"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                  <TableCell>{row.WardNo}</TableCell>
              <TableCell>{row.PropertyNo}</TableCell>
              <TableCell>{row.PartitionNo}</TableCell>
              <TableCell sx={{ width: "120px", whiteSpace: "nowrap" }}>{row.OwnerName}</TableCell>
              <TableCell>{row.RenterName}</TableCell>
              <TableCell>{row.OldRV}</TableCell>
              <TableCell>{row.NewRV}</TableCell>
              <TableCell>{row.PercentValue}</TableCell>
              
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )}
    {showSelectedListTable &&
  selectedReport === "Comparision of Old and new Rv in percentage" &&
  allWard.length > 0 && (
    <TableContainer
      style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {reportHeaders["Comparision of Old and new Rv in percentage"].map((header, index) => (
              <TableCell
                key={index}
                style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.length > 0 ? (
            tableData.map((row, idx) => (
              <TableRow key={idx}>
                  <TableCell>{row.WardNo}</TableCell>
              <TableCell>{row.PropertyNo}</TableCell>
              <TableCell>{row.PartitionNo}</TableCell>
              <TableCell>{row.OwnerName}</TableCell>
              <TableCell>{row.RenterName}</TableCell>
              <TableCell>{row.OldRV}</TableCell>
              <TableCell>{row.NewRV}</TableCell>
              <TableCell>{row.PercentValue}</TableCell>
             

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={reportHeaders["Default"].length}
                style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )}
    {showSelectedListTable &&
 selectedReport === "Property Description" &&
 tableData.length >= 0 && (
  <TableContainer
    style={{ marginTop: "20px", maxHeight: "430px", overflowY: "auto" }}
  >
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {reportHeaders["Property Description"].map((header, index) => (
            <TableCell
              key={index}
              style={{ fontWeight: "bold", top: 0, position: "sticky", zIndex: 10 }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {tableData.length > 0 ? (
          tableData.map((row, idx) => (
            <TableRow key={idx}>
            <TableCell>{row.NewZoneNo}</TableCell>
        <TableCell>{row.NewWardNo}</TableCell>
        <TableCell>{row.NewPropertyNo}</TableCell>
        <TableCell>{row.NewPartitionNo}</TableCell>
        <TableCell>{row.OldWardNo}</TableCell>
        <TableCell>{row.OldPropertyNo}</TableCell>
        <TableCell>{row.OldPartitionNo}</TableCell>
        <TableCell>{row.OwnerName}</TableCell>
        <TableCell>{row.RenterName  }</TableCell>
        <TableCell>{row.BuildingOrShopName}</TableCell>
        <TableCell>{row.PropertyDesc  }</TableCell>
        <TableCell>{row.OwnerPatta}</TableCell>
        <TableCell>{row.TotalArea}</TableCell>
        <TableCell>{row.TotalRent}</TableCell>
        <TableCell>{row.OldRV}</TableCell>
        <TableCell>{row.OldPropertyTax}</TableCell>
        <TableCell>{row.OldTotalTax}</TableCell>
        <TableCell>{row.RateableValue}</TableCell>
        <TableCell>{row.PropertyTax}</TableCell>
        <TableCell>{row.TaxTotal}</TableCell>


        </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={reportHeaders["Property Description"].length}
              style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
            >
              No Data Found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
)}

       <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}

>
<SnackbarContent
          sx={{
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
          }}
          message={snackbarMessage}
        />
</Snackbar>


        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Quality Control</DialogTitle>
          <DialogContent>
            <Typography>{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showAddressDialog} onClose={() => setShowAddressDialog(false)}>
          <DialogTitle>Select Fields</DialogTitle>
          <DialogContent>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.addressEnglish}
                  onChange={(e) => setSelectedFields((prev) => ({ ...prev, addressEnglish: e.target.checked }))}
                />
              }
              label="Address (English)"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.addressMarathi}
                  onChange={(e) => setSelectedFields((prev) => ({ ...prev, addressMarathi: e.target.checked }))}
                />
              }
              label="पत्ता"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFields.mobile}
                  onChange={(e) => setSelectedFields((prev) => ({ ...prev, mobile: e.target.checked }))}
                />
              }
              label="Mobile No"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setShowAddressDialog(false)}>OK</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showBillBookDialog} onClose={() => setShowBillBookDialog(false)}>
          <DialogTitle>Select Year</DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              {/* Year */}
              <Grid item xs={12}>
                <Typography>Year</Typography>
                <FormControl fullWidth size="small">
                  <Select value={selectedYearNo} style={{ height: '35px' }} onChange={(e) => setSelectedYearNo(e.target.value)}>
                    <MenuItem value="" disabled>
                      Select Option
                    </MenuItem>
                    {financialYearList.map((fin) => (
                      <MenuItem key={fin.FinanceYearRange} value={fin.FinanceYearRange}>
                        {fin.FinanceYearRange}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              onClick={async () => {
                if (!selectedYearNo) {
                  alert('Please select Year');
                  return;
                }

                setShowBillBookDialog(false);

                try {
                  // 🔥 Call the API service
                  const list = await fetchBillBookNoByYear(selectedYearNo);

                  setTableData(list);

                  setSelectedReport('Bill Book List');

                  setShowSelectedListTable(true);
                } catch (error) {
                  console.error('Error fetching Bill Book List:', error);
                  alert('Failed to load Bill Book List');
                }
              }}
            >
              OK
            </Button>

            <Button variant="outlined" color="error" onClick={() => setShowBillBookDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Invoice Dialog */}
        <Dialog open={showInvoiceDialog} 
        onClose={() => {
    setSelectedYear("");
    setSelectedBillBookNo("");
    setBillBookList([]);
    setShowInvoiceDialog(false);
  }}>
          <DialogTitle>{invoiceDialogType === 'missing' ? 'Missing Invoice No.' : 'Canceled Invoice Lists'}</DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              {/* Year */}
              <Grid item xs={12}>
                <Typography>Year</Typography>
                <FormControl fullWidth size="small">
                  <Select value={selectedYear} style={{ height: '35px' }} onChange={(e) => setSelectedYear(e.target.value)}>
                    <MenuItem value="" disabled>
                      Select Option
                    </MenuItem>
                    {financialYearList.map((fin) => (
                      <MenuItem key={fin.FinanceYearRange} value={fin.FinanceYearRange}>
                        {fin.FinanceYearRange}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Bill Book No */}
              <Grid item xs={12}>
                <Typography>Bill Book No.</Typography>
                <FormControl fullWidth size="small">
                  <Select value={selectedBillBookNo} onChange={(e) => setSelectedBillBookNo(e.target.value)}>
                    <MenuItem value="">Select</MenuItem>
                    {(billBookList || []).map((bb) => (
                      <MenuItem key={bb} value={bb}>
                        {bb}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              onClick={async () => {
                if (!selectedYear) {
                  alert('Please select Year');
                  return;
                }

                setShowInvoiceDialog(false);

                try {
                  const reqBody = {
                    year: selectedYear,
                    billBookNo: selectedBillBookNo
                  };

                  let response;
                  if (invoiceDialogType === 'missing') {
                    response = await getMissingInvoiceService(reqBody);
                    setSelectedReport('Missing Invoice No.');
                  } else {
                    response = await getCancelBillBookInvoiceService(reqBody);
                    setSelectedReport('Canceled Invoice Lists');
                  }

                  const rows = response?.data || [];
                  setTableData(rows);
                  setTotalRecordCount(rows.length);
                  setShowSelectedListTable(true);
                } catch (error) {
                  console.error('Error fetching Invoice List', error);
                  alert('Failed to fetch data. Check console.');
                }
              }}
            >
              OK
            </Button>

            <Button variant="outlined" color="error" onClick={() => setShowInvoiceDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        {/* //total atax */}
        <Dialog open={showTotalTaxDialog} onClose={() => setShowTotalTaxDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              backgroundColor: '#f5f5f5',
              fontWeight: '600',
              padding: '10px 16px'
            }}
          >
            Comparison Taxes
          </DialogTitle>

          <DialogContent>
            <Typography sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>Property Description</Typography>

            {/* Scroll Box */}
            <Box
              sx={{
                maxHeight: 200,
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '10px'
              }}
            >
              {/* ALL OPTION */}
              <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={12} sx={{ width: '95%' }}>
                  <FormControlLabel
                    sx={{ width: '80%' }}
                    control={
                      <Checkbox
                        checked={selectAllPropDesc}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectAllPropDesc(checked);

                          if (checked) {
                            setSelectedPropDesc(propertyDescArray.map((p) => p.PropertyTypeID));
                          } else {
                            setSelectedPropDesc([]);
                          }
                        }}
                      />
                    }
                    label="All"
                  />
                </Grid>
              </Grid>

              <Grid container>
                {propertyDescArray.map((p) => (
                  <Grid item xs={12} key={p.PropertyTypeID}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPropDesc.includes(p.PropertyTypeID)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setSelectedPropDesc((prev) => [...prev, p.PropertyTypeID]);
                            } else {
                              setSelectedPropDesc((prev) => prev.filter((id) => id !== p.PropertyTypeID));
                            }
                          }}
                        />
                      }
                      label={`${p.PropertyTypeID} - ${p.PropertyDescription}`}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {/* ⭐ WARD LABEL + DROPDOWN */}
              <Grid item xs={4}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: '3px' }}>Ward No.</Typography>

                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={allWard}
                    onChange={handleWardChange}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                  >
                    <MenuItem value="ALL">
                      <Checkbox checked={selectAll} />
                      <ListItemText primary="All" />
                    </MenuItem>

                    {[...wardList]
                      .sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo))
                      .map((wd) => (
                        <MenuItem key={wd.NewWardNo} value={wd.NewWardNo}>
                          <Checkbox checked={allWard.indexOf(wd.NewWardNo) > -1} />
                          <ListItemText primary={wd.NewWardNo} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* ⭐ FROM LABEL + DROPDOWN */}
              <Grid item xs={4}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: '3px' }}>From</Typography>

                <FormControl fullWidth size="small">
                  <Select value={propertyRange.from} onChange={(e) => setPropertyRange({ ...propertyRange, from: e.target.value })}>
                    {propertyRangeList.map((p, idx) => (
                      <MenuItem key={idx} value={p.NewPropertyNo}>
                        {p.NewPropertyNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* ⭐ TO LABEL + DROPDOWN */}
              <Grid item xs={4}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: '3px' }}>To</Typography>

                <FormControl fullWidth size="small">
                  <Select value={propertyRange.to} onChange={(e) => setPropertyRange({ ...propertyRange, to: e.target.value })}>
                    {propertyRangeList.map((p, idx) => (
                      <MenuItem key={idx} value={p.NewPropertyNo}>
                        {p.NewPropertyNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              disabled={allWard.length === 0 || selectedPropDesc.length === 0 || !propertyRange.from || !propertyRange.to}
              onClick={handleTotalTaxReport}
            >
              OK
            </Button>

            <Button variant="outlined" color="error" onClick={() => setShowTotalTaxDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

          {/* Property Description Dialog */}
<Dialog
  open={showPDesDialog}
  onClose={() => {
    setSelectedPd(''); // Reset on close
    setShowPDesDialog(false);
  }}  maxWidth="sm"
  fullWidth
>
  <DialogTitle
    sx={{
      backgroundColor: "#f5f5f5",
      fontWeight: "600",
      padding: "10px 16px",
    }}
  >
    Property Description
  </DialogTitle>

  <DialogContent>
    <Typography sx={{ mb: 1, mt: 2, fontWeight: "bold" }}>
      Property Description
    </Typography>

    {/* Scrollable Box */}
    <Box
      sx={{
        maxHeight: 250,
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "10px",
      }}
    >
      <RadioGroup
        value={selectedPd}
        onChange={(e) => setSelectedPd(e.target.value)}
      >
        {propertyDescArray.map((p) => (
          <FormControlLabel
            key={p.PropertyTypeID}
            value={p.PropertyDescription}
            control={<Radio />}
            label={p.PropertyDescription}
            sx={{ width: "100%", marginLeft: 0 }}
          />
        ))}
      </RadioGroup>
    </Box>
  </DialogContent>

  <DialogActions>
    <Button variant="contained" onClick={handlePropertyDescription}>
      OK
    </Button>

    <Button
      variant="outlined"
      color="error"
      onClick={() => setShowPDesDialog(false)}
    >
      Cancel
    </Button>
  </DialogActions>
</Dialog>

        {/* Mutation */}
        <Dialog open={openDateDialog} onClose={() => setOpenDateDialog(false)}>
  <DialogTitle>Select Date Range</DialogTitle>
  <DialogContent>
    <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
      <TextField
        label="From Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <TextField
        label="To Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
    </div>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDateDialog(false)} color="error">
      Cancel
    </Button>
    <Button onClick={handleFetchMutationList} variant="contained" color="primary">
      OK
    </Button>
  </DialogActions>
</Dialog>
{/* Flat */}
<Dialog
  open={showFlatSystemDialog}
  onClose={() => setShowFlatSystemDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: "600" }}>
    Flat System Fields
  </DialogTitle>

  <DialogContent>
    <Box sx={{ p: 3, borderRadius: 2, mt: 1 }}>

      {/* WARD */}
      <Typography sx={{ fontWeight: 600, mb: 1 }}>Ward No.</Typography>
      <FormControl fullWidth size="small">
        <Select
          multiple
          value={flatWard}
          onChange={handleFlatWardChange}
          renderValue={(selected) => selected.join(", ")}
        >
          <MenuItem value="ALL">
            <Checkbox checked={selectAllFlat} />
            <ListItemText primary="All" />
          </MenuItem>

          {wardList
            .sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo))
            .map((wd) => (
              <MenuItem key={wd.NewWardNo} value={wd.NewWardNo}>
                <Checkbox checked={flatWard.includes(wd.NewWardNo)} />
                <ListItemText primary={wd.NewWardNo} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* FROM / TO PROPERTY */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>From Property</Typography>
          <Select
            fullWidth
            size="small"
            value={propertyRangef.from}
            onChange={(e) =>
              setPropertyRangef({ ...propertyRangef, from: e.target.value })
            }
          >
            {propertyRangeListf.map((p, idx) => (
              <MenuItem key={idx} value={p.NewPropertyNo}>
                {p.NewPropertyNo}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={6}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>To Property</Typography>
          <Select
            fullWidth
            size="small"
            value={propertyRangef.to}
            onChange={(e) =>
              setPropertyRangef({ ...propertyRangef, to: e.target.value })
            }
          >
            {propertyRangeListf.map((p, idx) => (
              <MenuItem key={idx} value={p.NewPropertyNo}>
                {p.NewPropertyNo}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {/* BHK */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>BHK</InputLabel>
            <Select
              value={bhk}
              label="BHK"
              onChange={(e) => setBhk(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} BHK
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

    </Box>
  </DialogContent>

  <DialogActions>
    <Button variant="contained" onClick={handleFlatSystemSubmit}>
      OK
    </Button>
    <Button variant="outlined" color="error" onClick={() => setShowFlatSystemDialog(false)}>
      Cancel
    </Button>
  </DialogActions>
</Dialog>

{/* Pecentage */}
<Dialog
  open={showPercentDialog}
  onClose={() => setShowPercentDialog(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle
    sx={{
      backgroundColor: "#f5f5f5",
      fontWeight: 600,
      padding: "8px 14px",
      marginBottom: 1,
    }}
  >
    Enter Percentage
  </DialogTitle>

  <DialogContent sx={{  padding: "20px" }}>
    
    {/* Label */}
    <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1 }}>
      Enter Percentage
    </Typography>

    <TextField
      autoFocus
      fullWidth
      variant="outlined"
      size="small"
      value={percentValue}
      onChange={(e) => setPercentValue(e.target.value)}
    />
  </DialogContent>

  <DialogActions sx={{ padding: "10px" }}>
    <Button variant="contained" onClick={handlePercentageSubmit}>
      OK
    </Button>

    <Button variant="outlined" color="error" onClick={() => setShowPercentDialog(false)}>
      Cancel
    </Button>
  </DialogActions>
</Dialog>




      </MainCard>
      <Grid ConstructionId style={{ marginTop: '10px', height: '200px' }}>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" color="info" onClick={handleExportToExcel}>
            Generate Excel Sheet
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default QualityControl;
