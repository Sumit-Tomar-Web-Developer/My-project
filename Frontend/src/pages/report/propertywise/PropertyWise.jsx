// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  Box,
  Radio,
  Select,
  FormControlLabel,
  Checkbox,
  FormControl,
  MenuItem,
  ListItemText,
  TextField,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  OutlinedInput,
  Autocomplete
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useEffect, useRef, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as XLSX from 'xlsx';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchPropertyDescription, fetchPropertyMast, fetchWardList } from 'services/data-entry.services';
import { fetchFinancialYear } from 'services/appeal.services';
import {
  fetchAdvanceCollection,
  fetchAppealData,
  fetchAppealMastList,
  fetchBillBookList,
  fetchCurrentCollection,
  fetchCurrentDemand,
  fetchGhosehwara,
  fetchMiscellaneousFee,
  fetchOldPropertyData,
  fetchOldPropertyMastList,
  fetchOutstandingCurrentBalance,
  fetchOutstandingPendingBalance,
  fetchOutstandingTotalBalance,
  fetchOwnerIdListForReportGen,
  fetchPendingCollection,
  fetchPendingDemand,
  fetchPropertyDetailsNewData,
  fetchPropertyDetaisNewList,
  fetchPropertyMastColumnsByOwner,
  fetchPropertyMastList,
  fetchTaxPendingList,
  fetchTotalCollection,
  fetchTotalDemand,
  fetchTransMastList
} from 'services/report/property-wise-service/propertyWiseServices';
import { fetchPropertyRange } from 'services/masterServices/apply-tax-services/apply-tax.services';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';

// ==============================|| PropertyWise PAGE ||============================== //

function PropertyWise() {
  const [toproperty, setToProperty] = useState([]);

  const [fromproperty, setFromProperty] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [compareStatement, setCompareStatement] = useState('');
  const [equalTo, setEqualTo] = useState('');
  const [notEqualTo, setNotEqualTo] = useState('');
  const [lessThan, setLessThan] = useState('');
  const [greaterThan, setGreaterThan] = useState('');
  const [lessThanOrEqual, setLessThanOrEqual] = useState('');
  const [greaterThanOrEqual, setGreaterThanOrEqual] = useState('');
  const [between, setBetween] = useState('');
  const [selectDemand, setSelectDemand] = useState('');
  const [topProperty, setTopProperty] = useState('');
  const [sortOnField, setSortOnField] = useState('');
  const [order, setOrder] = useState('');
  const [propertyDesc, setPropertyDesc] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [propertyNoList, setPropertyNoList] = useState([]);
  const [propertyNoToList, setPropertyNoToList] = useState([]);
  const [selectedOwnerID, setSelectedOwnerID] = useState([]);
  const [pmList, setPmList] = useState([]);
  const [oldPmList, setOldPmList] = useState([]);
  const [propertyDetailsList, setPropertyDetailsList] = useState([]);
  const [appealList, setAppealList] = useState([]);
  const [billBookList, setBillBookList] = useState([]);
  const [transMastList, setTransMastList] = useState([]);
  const [taxPendingList, setTaxPendingList] = useState([]);

  const [wardList, setWardList] = useState([]);
  const [partNo, setPartNo] = useState('');
  const [openDilog, setOpenDialog] = useState(false);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [financialYear, setFinancialYear] = useState('');

  // inside your component
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectedPropertiesBillBook, setSelectedPropertiesBillBook] = useState([]);
  const [selectedPropertiesPropertyMast, setSelectedPropertiesPropertyMast] = useState([]);

  const [selectedPropertiesTransMast, setSelectedPropertiesTransMast] = useState([]);
  const [selectedPropertiesTaxPending, setSelectedPropertiesTaxPending] = useState([]);
  const [selectedPropertiesOldMast, setSelectedPropertiesOldMast] = useState([]);
  const [selectedPropertiesAppealMast, setSelectedPropertiesAppealMast] = useState([]);
  const [selectedPropertiesDetailsNew, setSelectedPropertiesDetailsNew] = useState([]);
  const [allWard, setAllWard] = useState([]);

  const [selectedPropertyNoFromObj, setSelectedPropertyNoFromObj] = useState(null);
  const [selectedPropertyNoToObj, setSelectedPropertyNoToObj] = useState(null);

  // Separate input values for each comparison type
  const [equalToValue, setEqualToValue] = useState('');
  const [notEqualToValue, setNotEqualToValue] = useState('');
  const [lessThanValue, setLessThanValue] = useState('');
  const [greaterThanValue, setGreaterThanValue] = useState('');
  const [lessThanOrEqualValue, setLessThanOrEqualValue] = useState('');
  const [greaterThanOrEqualValue, setGreaterThanOrEqualValue] = useState('');
  const [betweenValue, setBetweenValue] = useState('');
  const [andValue, setAndValue] = useState('');

  const [selectedDemandRadio, setSelectedDemandRadio] = useState('');
  const [dialogText, setDialogText] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    const fetchWards = async () => {
      const wards = await fetchWardList();
      console.log(wards, 'fetched wards');
      const sortedWards = [...wards].sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo));
      setWardList(sortedWards);
    };
    fetchWards();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleWardChange = async (event) => {
    let selectedWards = event.target.value;
    console.log('Selected Wards:', selectedWards);

    // If ALL was previously selected but now user selected specific ward(s), remove ALL
    if (selectedWards.includes('ALL') && selectedWards.length > 1) {
      selectedWards = selectedWards.filter((w) => w !== 'ALL');
    }

    // If user selects ALL, replace everything with ALL
    if (selectedWards.includes('ALL')) {
      setSelectAll(true);
      setAllWard(['ALL']);
      setPropertyNoList([]);
      setPropertyNoToList([]);
      setFromProperty('');
      setToProperty('');
      console.log('All wards selected, skipping property range.');
      return;
    }

    setSelectAll(false);
    setAllWard(selectedWards);

    // Multiple wards selected → skip property range
    if (selectedWards.length > 1) {
      setPropertyNoList([]);
      setPropertyNoToList([]);
      setFromProperty('');
      setToProperty('');
      console.log('Multiple wards selected, skipping property range.');
      return;
    }

    // Single ward selected → fetch property range
    const ward = selectedWards[0];
    try {
      const response = await fetchPropertyRangeByWard(ward);
      const propertyRange = response.properties;
      if (!Array.isArray(propertyRange)) throw new Error('Invalid property range');

      // Sort main property first, then partitions
      const sortedProps = propertyRange.sort((a, b) => {
        const propA = parseInt(a.NewPropertyNo, 10);
        const propB = parseInt(b.NewPropertyNo, 10);

        if (propA !== propB) return propA - propB;

        const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
        const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;
        return partA - partB;
      });

      console.log('Sorted Properties for single ward:', sortedProps);

      setPropertyNoList(sortedProps);
      setPropertyNoToList(sortedProps);
    } catch (error) {
      console.error('Error fetching property range:', error);
      setPropertyNoList([]);
      setPropertyNoToList([]);
    }
  };

  useEffect(() => {
    const loadPropertyMastColumns = async () => {
      try {
        const PMColumns = await fetchPropertyMastList();
        setPmList(PMColumns.data);
        console.log(PMColumns.data, 'property mast columns');
      } catch (error) {
        console.error('Error fetching property description:', error);
      }
    };

    loadPropertyMastColumns();
  }, []);

  // component
  useEffect(() => {
    const loadOldPropertyMastColumns = async () => {
      try {
        const PMOldColumns = await fetchOldPropertyMastList();
        setOldPmList(PMOldColumns.data);
        console.log(PMOldColumns.data, ' PMOldColumns ');
      } catch (error) {
        console.error('Error fetching PMOldColumns:', error);
      }
    };

    loadOldPropertyMastColumns();
  }, []);

  // component
  useEffect(() => {
    const loadPropertyDetailsColumns = async () => {
      try {
        const PDetailsColumns = await fetchPropertyDetaisNewList();
        setPropertyDetailsList(PDetailsColumns.data);
        console.log(PDetailsColumns.data, 'PDetailsColumns columns');
      } catch (error) {
        console.error('Error fetching PDetailsColumns:', error);
      }
    };

    loadPropertyDetailsColumns();
  }, []);

  // component
  useEffect(() => {
    const loadAppealMastColumns = async () => {
      try {
        const PAppealColumns = await fetchAppealMastList();
        setAppealList(PAppealColumns.data);
        console.log(PAppealColumns.data, 'PAppealColumns columns');
      } catch (error) {
        console.error('Error fetching PAppealColumns:', error);
      }
    };

    loadAppealMastColumns();
  }, []);

  // component
  useEffect(() => {
    const loadBillBookColumns = async () => {
      try {
        const PBillBookColumns = await fetchBillBookList();
        setBillBookList(PBillBookColumns.data);
        console.log(PBillBookColumns.data, 'PBillBookColumns columns');
      } catch (error) {
        console.error('Error fetching PBillBookColumns:', error);
      }
    };

    loadBillBookColumns();
  }, []);

  // component
  useEffect(() => {
    const loadTransMastColumns = async () => {
      try {
        const PTransMastColumns = await fetchTransMastList();
        setTransMastList(PTransMastColumns.data);
        console.log(PTransMastColumns.data, 'PTransMastColumns columns');
      } catch (error) {
        console.error('Error fetching PTransMastColumns:', error);
      }
    };

    loadTransMastColumns();
  }, []);

  // component
  useEffect(() => {
    const loadTaxPendingColumns = async () => {
      try {
        const PTaxColumns = await fetchTaxPendingList();
        setTaxPendingList(PTaxColumns.data);
        console.log(PTaxColumns.data, 'PTaxColumns columns');
      } catch (error) {
        console.error('Error fetching PTaxColumns:', error);
      }
    };
    loadTaxPendingColumns();
  }, []);

  const [radioGroupEnabled, setRadioGroupEnabled] = useState(false);

  //export
  const handleExportButtonClick = () => {
    if (!tableData || tableData.length === 0) {
      showSnackbar('No data to export', 'info');
      return;
    }

    // Prepare header row
    const headerRow = tableHeaders; // already includes 'NetTotal'

    // Prepare data rows
    const dataRows = tableData.map((row) => {
      return headerRow.map((col) => row[col] ?? '');
    });

    // Combine into final data array
    const exportData = [
      ['Daily Collection Report'], // Title row
      [], // Empty row
      headerRow, // Column headers
      ...dataRows // Data rows
    ];

    // Convert to worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DailyCollectionReport');

    // Export
    XLSX.writeFile(wb, 'DailyCollectionReport.xlsx');
  };

  const handleCompareChange = () => {
    const newState = !compareStatement;
    setCompareStatement(newState);

    if (!newState) {
      // If unchecked, reset everything
      setSelectedCompareOperator('');
      setEqualToValue('');
      setNotEqualToValue('');
      setLessThanValue('');
      setGreaterThanValue('');
      setLessThanOrEqualValue('');
      setGreaterThanOrEqualValue('');
      setBetweenValue('');
      setAndValue('');
    }
  };

  // useEffect(() => {
  //   const yearList = async () => {
  //     try {
  //       const yearList = await fetchFinancialYear();

  //       setFinancialYearList(yearList);
  //       // console.log(data, 'financial year data');
  //     } catch (error) {
  //       console.error('Error fetching financial year list:', error);
  //     }
  //   };
  //   yearList();
  // }, []);

  useEffect(() => {
    const yearList = async () => {
      try {
        const data = await fetchFinancialYear();

        console.log(data, 'financial year data');

        // ✅ Sort ascending by starting year (e.g., 2021-2022 → 2027-2028)
        const sortedYears = data.sort((a, b) => {
          const startA = parseInt(a.FinanceYearRange.split('-')[0]);
          const startB = parseInt(b.FinanceYearRange.split('-')[0]);
          return startA - startB;
        });

        setFinancialYearList(sortedYears);
      } catch (error) {
        console.error('Error fetching financial year list:', error);
      }
    };

    yearList();
  }, []);

  const handleChangeYear = (event) => {
    const year = event.target.value; // selected financial year, e.g., "2023-2024"
    console.log(year, 'yearrr');
    setFinancialYear(year);

    if (year) {
      const [startYear, endYear] = year.split('-'); // <-- FIXED

      // From Date = 1 April of startYear
      setFromDate(dayjs(`${startYear}-04-01`));

      // To Date = 31 March of endYear
      setToDate(dayjs(`${endYear}-03-31`));
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetchPropertyDescription(); // await is important
        console.log(response, 'property description');
        setPropertyDesc(response);
      } catch (error) {
        console.error('Error fetching property description:', error);
      }
    };

    fetchDescription(); // call it once
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract strings from the selected objects
        const fromProperty = selectedPropertyNoFromObj
          ? selectedPropertyNoFromObj.NewPartitionNo
            ? `${selectedPropertyNoFromObj.NewPropertyNo}_${selectedPropertyNoFromObj.NewPartitionNo}`
            : `${selectedPropertyNoFromObj.NewPropertyNo}`
          : '';

        const toProperty = selectedPropertyNoToObj
          ? selectedPropertyNoToObj.NewPartitionNo
            ? `${selectedPropertyNoToObj.NewPropertyNo}_${selectedPropertyNoToObj.NewPartitionNo}`
            : `${selectedPropertyNoToObj.NewPropertyNo}`
          : '';

        console.log(fromProperty, 'Cleaned From Property');

        const cleanedFromProperty = fromProperty?.split('_')[0] || '';
        console.log(cleanedFromProperty, 'Cleaned From Property');

        const cleanedToProperty = toProperty?.split('_')[0] || '';
        console.log(cleanedToProperty, 'Cleaned To Property');

        const data = {
          wardNo: allWard,
          propertyTypeID: selectedProperties,
          fromProperty: cleanedFromProperty,
          toProperty: cleanedToProperty,
          financialYear
        };

        console.log(data, 'data for owner id list');

        const ownerIdList = await fetchOwnerIdListForReportGen(data);
        console.log(ownerIdList, 'owner id list');

        setSelectedOwnerID(ownerIdList.data.ownerIds);
      } catch (err) {
        console.error('Error in useEffect:', err);
      }
    };

    fetchData();
  }, [selectedPropertyNoFromObj, selectedPropertyNoToObj, financialYear, allWard, selectedProperties]);

  useEffect(() => {
    console.log(selectedOwnerID, 'selectedOwnerID in useEffect');
  }, [selectedOwnerID]);

  useEffect(() => {
    console.log('📌 Selected Appeal Columns:', selectedPropertiesAppealMast);
  }, [selectedPropertiesAppealMast]);

  const handleSelectDemandChange = (e) => {
    const value = e.target.value;
    setSelectDemand(value);

    // 🧹 Clear Appeal, Old Property, and New Property selections when demand type changes
    setSelectedPropertiesAppealMast([]);
    setSelectedPropertiesOldMast([]);
    setSelectedPropertiesDetailsNew([]);

    // 🔹 Clear previous table data and headers
    setTableData([]);
    setTableHeaders([]);
    setSelectedColumns([]);
    setSelectedPropertiesTransMast([]);
    setSelectedPropertiesTaxPending([]);

    // 🧭 Map demand to relevant section
    const demandRadioMap = {
      'Current Demand': 'Trans Mast',
      'Pending Demand': 'Tax Pending',
      'Total Demand': 'Total Demand',
      'Current Collection': 'Bill Entry',
      'Pending Collection': 'Bill Entry',
      'Total Collection': 'Bill Entry',
      'OutStanding Current Balance': 'Current Outstanding',
      'OutStanding Pending Balance': 'Pending Outstanding',
      'OutStanding Total Balance': 'Total Outstanding',
      Ghosehwara: 'Without Payment',
      'Advance Collection': 'Advance Collection',
      'Miscellaneous Fee': 'Miscellaneous Fee'
    };

    const mappedRadio = demandRadioMap[value] || '';
    setSelectedDemandRadio(mappedRadio);
    setRadioGroupEnabled(Boolean(mappedRadio));
    setRadioLock(true);

    // 🗨️ Open confirmation dialog
    setDialogText(`Do you want to select "${value}"?`);
    setOpenDialog(true);

    // 🧩 Open relevant Autocomplete based on demand
    setSelectOpen(value === 'Current Demand' || value === 'Total Demand');
    setTaxPendingOpen(value === 'Pending Demand' || value === 'Total Demand');
    setBillBookOpen(['Current Collection', 'Pending Collection', 'Total Collection'].includes(value));
    setCurrentOutstandingOpen(value === 'OutStanding Current Balance');
    setPendingOutstandingOpen(value === 'OutStanding Pending Balance');
    setTotalOutstandingOpen(value === 'OutStanding Total Balance');
    // setCurrentCollectionOpen(value === 'Outstanding Current Balance');
    // setPendingCollectionOpen(value === 'Outstanding Pending Balance');
    // setTotalCollectionOpen(value === 'Outstanding Total Balance');
    setGhosehwaraOpen(value === 'Ghosehwara');
  };

  const [propertyMastOpen, setPropertyMastOpen] = useState(false);
  const [detailsNewOpen, setDetailsNewOpen] = useState(false);
  const [appealMastOpen, setAppealMastOpen] = useState(false);
  const [oldMastOpen, setOldMastOpen] = useState(false);
  const [currentDemandOpen, setcurrentDemandOpen] = useState(false);

  const [taxPendingOpen, setTaxPendingOpen] = useState(false);
  const [currentCollectionOpen, setCurrentCollectionOpen] = useState(false);
  const [pendingCollectionOpen, setPendingCollectionOpen] = useState(false);
  const [totalCollectionOpen, setTotalCollectionOpen] = useState(false);
  const [billBookOpen, setBillBookOpen] = useState(false);
  const [currentOutstandingOpen, setCurrentOutstandingOpen] = useState(false);
  const [pendingOutstandingOpen, setPendingOutstandingOpen] = useState(false);
  const [totalOutstandingOpen, setTotalOutstandingOpen] = useState(false);
  const [ghosehwaraOpen, setGhosehwaraOpen] = useState(false);

  useEffect(() => {
    // Close all dropdowns first
    setcurrentDemandOpen(false);
    setTaxPendingOpen(false);
    setBillBookOpen(false);
    setCurrentCollectionOpen(false);
    setPendingCollectionOpen(false);
    setTotalCollectionOpen(false);

    // Now open based on selected demand
    switch (selectDemand) {
      case 'Current Demand':
        setcurrentDemandOpen(true);
        break;

      case 'Pending Demand':
        setTaxPendingOpen(true);
        break;

      case 'Total Demand':
        setcurrentDemandOpen(true);
        setTaxPendingOpen(true);
        break;

      case 'Bill Collection':
        setBillBookOpen(true);
        break;
      case 'Current Collection':
        setBillBookOpen(true);
        break;
      case 'Pending Collection':
        setBillBookOpen(true);
        break;
      case 'Total Collection':
        setBillBookOpen(true);
        break;
      case 'Current Outstanding':
        setCurrentOutstandingOpen(true);
        break;
      case 'Pending Outstanding':
        setPendingOutstandingOpen(true);
        break;

      default:
        break;
    }
  }, [selectDemand]);

  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedCompareOperator, setSelectedCompareOperator] = useState('');

  const hiddenPropertyMastColumns = [
    'CreatedBy',
    'UpdatedBy',
    'CreatedDate',
    'UpdatedDate',
    'VersionNo',
    'CouncilID',
    'PropertyChange',
    'Status'
  ];

  const handleSortChange = (value) => {
    console.log('🔹 handleSortChange:', { value, prevSortOnField: sortOnField, prevOrder: order });
    if (sortOnField === value) {
      // toggle order (we use order state "Ascending" | "Descending")
      setOrder((prev) => (prev === 'Ascending' ? 'Descending' : 'Ascending'));
    } else {
      setSortOnField(value);
      setOrder('Ascending'); // default
    }

    // Open Property Mast autocomplete for Owner Id or Ward/Prop/Parti
    if (value === 'Owner Id' || value === 'WardNo PropNo PartiNo') {
      setPropertyMastOpen(true);
    } else {
      setPropertyMastOpen(false);
    }
  };

  useEffect(() => {
    console.log('📌 Selected Appeal Columns:', selectedPropertiesAppealMast);
  }, [selectedPropertiesAppealMast]);

  useEffect(() => {
    console.log('📌 Selected Owner IDs:', selectedOwnerID);
  }, [selectedOwnerID]);

  const getFinalColumns = (data, selectedProps, extraList, type, skipColumnsMap) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const firstRow = data[0];
    const allKeys = Object.keys(firstRow);

    // Optional: skip unwanted columns per type (if skipColumnsMap is defined)
    const filtered = allKeys.filter((col) => !skipColumnsMap?.[type]?.includes(col));

    return filtered; // ✅ returns ['Date', 'OwnerID', 'EducationTax', ...]
  };

  const handleShowDemand = async (selectDemand) => {
    if (!allWard?.length || !financialYear) {
      showSnackbar('Please select Ward and Financial Year', 'warning');
      return;
    }
    if (!selectedOwnerID || selectedOwnerID.length === 0) {
      showSnackbar('No OwnerID found for given filter', 'error');
      return;
    }

    try {
      console.log('🚀 handleShowDemand triggered');
      console.log('🎯 selectedOwnerID', selectedOwnerID);

      let result = [];
      let isSpecialData = false;

      const skipColumnsMap = {
        TransMast: ['Maintenance', 'OriginalOwnerID', 'CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId'],
        TaxPending: ['CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId'],
        BillBook: ['Maintenance', 'CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate'],
        Appeal: ['CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId'],
        OldPropertyMast: ['CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId'],
        NewPropertyDetails: ['CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId']
      };

      let finalColumns = [];
      let filteredData = [];

      // 1️⃣ Appeal
      if (selectedPropertiesAppealMast?.length > 0 && selectedOwnerID?.length > 0) {
        const payloadAppeal = { ownerIDs: selectedOwnerID, columns: selectedPropertiesAppealMast };
        const response = await fetchAppealData(payloadAppeal);
        result = response.data;
        isSpecialData = true;

        finalColumns = getFinalColumns(result, selectedPropertiesAppealMast, appealList, 'Appeal', skipColumnsMap);
        console.log('📋 [Appeal] Columns:', finalColumns, 'Rows:', result.length);

        setSelectedColumns(finalColumns);
        setTableData(result);
        setTableHeaders(finalColumns);
      }

      // 2️⃣ Old Property
      else if (selectedPropertiesOldMast?.length > 0 && selectedOwnerID?.length > 0) {
        const response = await fetchOldPropertyData({ ownerIDs: selectedOwnerID, columns: selectedPropertiesOldMast });
        result = response.data;
        isSpecialData = true;

        finalColumns = getFinalColumns(result, selectedPropertiesOldMast, oldPmList, 'OldPropertyMast', skipColumnsMap);
        console.log('📋 [Old Property] Columns:', finalColumns, 'Rows:', result.length);

        setSelectedColumns(finalColumns);
        setTableData(result);
        setTableHeaders(finalColumns);
      }

      // 3️⃣ New Property Details
      else if (selectedPropertiesDetailsNew?.length > 0 && selectedOwnerID?.length > 0) {
        const response = await fetchPropertyDetailsNewData({ ownerIDs: selectedOwnerID, columns: selectedPropertiesDetailsNew });
        result = response.data;
        isSpecialData = true;

        finalColumns = getFinalColumns(result, selectedPropertiesDetailsNew, propertyDetailsList, 'NewPropertyDetails', skipColumnsMap);
        console.log('📋 [New Property] Columns:', finalColumns, 'Rows:', result.length);

        setSelectedColumns(finalColumns);
        setTableData(result);
        setTableHeaders(finalColumns);
      }

      // 4️⃣ Demand Tables (Current/Pending/Total etc.)
      if (!isSpecialData) {
        let payload = { ownerIDList: selectedOwnerID || [], year: financialYear.split('-')[0] };

        const demandsNeedingDates = [
          'Current Collection',
          'Pending Collection',
          'Total Collection',
          'Outstanding Current Balance',
          'Outstanding Pending Balance',
          'Outstanding Total Balance',
          'Ghosehwara'
        ];

        if (demandsNeedingDates.includes(selectDemand) && fromDate && toDate) {
          payload.p_from_date = dayjs(fromDate).format('YYYY-MM-DD');
          payload.p_to_date = dayjs(toDate).format('YYYY-MM-DD');
        }
        // if (selectDemand === 'Current Collection' || selectDemand === 'Pending Collection' || selectDemand === 'Total Collection') {
        //   payload = {
        //     OwnerIDList: selectedOwnerID || [],
        //     p_Year: parseInt(financialYear.split('-')[0]),
        //     p_from_date: dayjs(fromDate).format('YYYY-MM-DD'),
        //     p_to_date: dayjs(toDate).format('YYYY-MM-DD')
        //   };
        // }

        if (selectDemand === 'Current Collection' || selectDemand === 'Pending Collection' || selectDemand === 'Total Collection') {
          payload = {
            OwnerIDList: selectedOwnerID || [],
            p_Year: parseInt(financialYear.split('-')[0])
          };

          // Only send dates if both selected
          if (fromDate && toDate) {
            const from = dayjs(fromDate);
            const to = dayjs(toDate);

            if (from.isValid() && to.isValid()) {
              payload.p_from_date = from.format('YYYY-MM-DD');
              payload.p_to_date = to.format('YYYY-MM-DD');
            }
          }
        }

        // ✅ DEMAND payload (NO DATE RANGE)
        if (selectDemand === 'Current Demand' || selectDemand === 'Pending Demand' || selectDemand === 'Total Demand') {
          payload = {
            ownerIDList: Array.isArray(selectedOwnerID) ? selectedOwnerID : [selectedOwnerID],
            p_Year: parseInt(financialYear.split('-')[0])
          };
        }

        switch (selectDemand) {
          case 'Current Demand':
            result = (await fetchCurrentDemand(payload)).data;
            break;
          case 'Pending Demand':
            result = (await fetchPendingDemand(payload)).data;
            break;
          case 'Total Demand':
            result = (await fetchTotalDemand(payload)).data;
            break;
          case 'Current Collection':
            result = (await fetchCurrentCollection(payload)).data;
            break;
          case 'Pending Collection':
            result = (await fetchPendingCollection(payload)).data;
            break;
          case 'Total Collection':
            result = (await fetchTotalCollection(payload)).data;
            break;
          case 'OutStanding Current Balance':
            result = (await fetchOutstandingCurrentBalance(payload)).data;
            break;
          case 'OutStanding Pending Balance':
            {
              let raw = (await fetchOutstandingPendingBalance(payload)).data;

              console.log('RAW:', raw);

              // 🔥 FIX: flatten sequelize wrapper
              const result = raw.map((r) => (r && r[0] ? r[0] : r)).filter((r) => r && r.OwnerID !== undefined);

              console.log('Flattened Row:', result[0]);

              const columns = Object.keys(result[0]);

              setSelectedColumns(columns);
              setTableHeaders(columns);
              setTableData(result);
              return;
            }

            break;
          case 'OutStanding Total Balance':
            result = (await fetchOutstandingTotalBalance(payload)).data;

            break;
          // case 'Ghosehwara': result = (await fetchGhosehwara(payload)).data; break;
          case 'Ghosehwara': {
            console.log('📊 Generating Ghosehwara Owner-wise Combined Table');

            // 🧾 1️⃣ Prepare payload
            const payload = {
              OwnerID: Array.isArray(selectedOwnerID) ? selectedOwnerID : [selectedOwnerID],
              p_Year: parseInt(financialYear.split('-')[0])
            };

            // 🧠 2️⃣ Call your new backend API
            // make sure `fetchGhosehwaraOwnerwise` is imported from your service file
            const ghoseData = await fetchGhosehwara(payload);

            if (!ghoseData || ghoseData.length === 0) {
              showSnackbar('No data found for Ghosehwara (Owner-wise)', 'info');
              setTableHeaders([]);
              setTableData([]);
              return;
            }
            console.log('Ghose Data Row Sample:', ghoseData[0]);

            // 🧮 3️⃣ Prepare table columns dynamically
            const allHeaders = Array.from(new Set(ghoseData.flatMap(Object.keys)));

            // 🪶 Optional: ensure “SrNo” appears first
            const orderedHeaders = [
              'SrNo',
              'OwnerID',
              'WardNo',
              'PropertyNo',
              'PartitionNo',
              'FinanceYear',
              ...allHeaders.filter((h) => !['SrNo', 'OwnerID', 'WardNo', 'PropertyNo', 'PartitionNo', 'FinanceYear'].includes(h))
            ];

            // 🪄 4️⃣ Push data into table state
            setSelectedColumns(orderedHeaders);
            setTableHeaders(orderedHeaders);
            setTableData(ghoseData);

            console.log('✅ Ghosehwara Owner-wise data received:', ghoseData);
            return;
          }

          case 'Advance Collection':
            try {
              result = (await fetchAdvanceCollection(payload)).data;
            } catch (err) {
              const message = err?.response?.data?.message || 'No data found for Advance Collection';

              showSnackbar(message, 'error');
              return;
            }
            break;
          case 'Miscellaneous Fee': {
            result = (await fetchMiscellaneousFee(payload)).data;

            if (!result?.length) {
              showSnackbar('No data found', 'info');
              setTableHeaders([]);
              setTableData([]);
              return;
            }

            // ✅ Only show MiscellaneousFee column — no totals or extra columns
            const finalColumns = ['MiscellaneousFee'];
            setSelectedColumns(finalColumns);
            setTableHeaders(finalColumns);
            setTableData(result);

            console.log('✅ Showing only MiscellaneousFee column:', result);
            return; // ⛔ stop here — skip all further processing
          }

          default:
            console.warn('⚠️ Unknown demand type:', selectDemand);
        }

        if (!result?.length) {
          showSnackbar('No data found', 'info');
          setTableHeaders([]);
          setTableData([]);
          return;
        }

        // ✅ Derive columns dynamically from result
        const finalColumns = getFinalColumns(result, selectedProperties, [], selectDemand, skipColumnsMap);

        // ✅ Sync all column-related states (this fixes autocomplete & table)
        setSelectedPropertiesTransMast(finalColumns);
        setSelectedPropertiesTaxPending(finalColumns);
        setSelectedPropertiesBillBook(finalColumns);
        setSelectedColumns(finalColumns);

        // ✅ Also sync table headers immediately
        setTableHeaders(finalColumns);

        console.log(`🧩 Columns set for ${selectDemand}:`, finalColumns);
        // 🧾 Calculate TaxTotal & NetTotal
        const taxColumns = [
          'PropertyTax',
          'EducationTax',
          'EmploymentTax',
          'TreeCess',
          'SpEducationTax',
          'Sanitation',
          'DrainCess',
          'SpWaterCess',
          'RoadCess',
          'FireCess',
          'LightCess',
          'WaterBenefit',
          'MajorBuilding',
          'SewageDisposalCess',
          'WaterBill',
          'Tax1',
          'Tax2',
          'Tax3',
          'Tax4',
          'Tax5'
        ];

        filteredData = result.map((row) => {
          const newObj = { ...row };
          let netTotal = 0;
          taxColumns.forEach((col) => (netTotal += Number(row[col]) || 0));
          newObj.NetTotal = netTotal;
          newObj.TaxTotal = netTotal;
          return newObj;
        });

        // 5️⃣ Apply Compare Statement Filter
        if (compareStatement && selectedCompareOperator) {
          filteredData = filteredData.filter((row) => {
            const taxTotal = Number(row.TaxTotal ?? 0);
            switch (selectedCompareOperator) {
              case 'EqualTo':
                return taxTotal === Number(equalToValue);
              case 'NotEqualTo':
                return taxTotal !== Number(notEqualToValue);
              case 'LessThan':
                return taxTotal < Number(lessThanValue);
              case 'GreaterThan':
                return taxTotal > Number(greaterThanValue);
              case 'LessThanOrEqual':
                return taxTotal <= Number(lessThanOrEqualValue);
              case 'GreaterThanOrEqual':
                return taxTotal >= Number(greaterThanOrEqualValue);
              case 'Between':
                return taxTotal >= Number(betweenValue) && taxTotal <= Number(andValue);
              default:
                return true;
            }
          });
          console.log(`📉 After Compare (${selectedCompareOperator}) → Rows:`, filteredData.length);
        }

        // 6️⃣ Top N Property filter
        const topCount = Number(topProperty);
        if (!isNaN(topCount) && topCount > 0) {
          filteredData.sort((a, b) => b.TaxTotal - a.TaxTotal);
          filteredData = filteredData.slice(0, topCount);
          console.log(`🏆 After Top ${topCount} filter → Rows:`, filteredData.length);
        }

        // 7️⃣ Sorting
        if (sortOnField === 'TaxTotal') {
          filteredData.sort((a, b) => (order === 'Descending' ? b.TaxTotal - a.TaxTotal : a.TaxTotal - b.TaxTotal));
        } else if (sortOnField === 'NetTaxTotal') {
          filteredData.sort((a, b) => (order === 'Descending' ? b.NetTotal - a.NetTotal : a.NetTotal - b.NetTotal));
        }

        // 8️⃣ Add Ward/Prop/PartNo columns if needed
        if (sortOnField === 'WardNo PropNo PartiNo') {
          const serviceData = {
            ownerIDs: filteredData.map((r) => r.OwnerID),
            columns: ['WardNo', 'PropNo', 'PartiNo']
          };

          console.log('📤 Fetching PropertyMast for Ward sorting:', serviceData);
          // ✅ Auto-select these columns in Property Mast autocomplete
          setSelectedPropertiesPropertyMast(['NewWardNo', 'NewPropertyNo', 'NewPartitionNo']);
          const propertyMastResponse = await fetchPropertyMastColumnsByOwner(serviceData);
          const pmData = propertyMastResponse?.data || [];

          console.log('📥 PropertyMast data received:', propertyMastResponse);

          // 🔍 Merge Ward/Prop/Part info into filteredData
          filteredData = filteredData.map((row) => {
            const match = pmData.find((p) => p.OwnerID === row.OwnerID);
            if (!match) {
              console.warn(`⚠️ No PropertyMast found for OwnerID: ${row.OwnerID}`);
            }
            return {
              ...row,
              WardNo: match?.NewWardNo ?? '',
              PropertyNo: match?.NewPropertyNo ?? '',
              PartitionNo: match?.NewPartitionNo ?? ''
            };
          });

          console.log('🔄 After merging Ward/Prop/Part info:', filteredData.slice(0, 5));

          // 🔢 Sort by Ward → Property → Partition
          filteredData.sort((a, b) => {
            const wardCompare = (a.WardNo || '').localeCompare(b.WardNo || '');
            if (wardCompare !== 0) return wardCompare;
            const propCompare = (a.PropertyNo || '').localeCompare(b.PropertyNo || '');
            if (propCompare !== 0) return propCompare;
            return (a.PartitionNo || '').localeCompare(b.PartitionNo || '');
          });

          console.log('🔢 After Ward/Prop/Part sorting:', filteredData.slice(0, 5));

          // 🧾 Update table headers to include new columns at start
          const existingHeaders = Object.keys(filteredData[0] || {});
          const withWardCols = [
            'WardNo',
            'PropertyNo',
            'PartitionNo',
            ...existingHeaders.filter((h) => !['WardNo', 'PropertyNo', 'PartitionNo'].includes(h))
          ];

          setSelectedColumns(withWardCols);
          setTableHeaders(withWardCols);
          setTableData(filteredData);

          console.log('✅ Final Table with Ward/Prop/Part columns →', withWardCols);
          return; // exit to prevent overwriting table
        }

        // ✅ Final fallback for all normal demand tables (Current, Pending, Total, etc.)
        if (filteredData.length > 0) {
          const finalColumnsDemand = Object.keys(filteredData[0] || {});
          console.log('📋 [Demand] Final Columns:', finalColumnsDemand, 'Rows:', filteredData.length);

          setSelectedColumns(finalColumnsDemand);
          setTableHeaders(finalColumnsDemand);
          setTableData(filteredData);

          console.log('✅ Table updated for Demand type:', selectDemand);
        } else {
          console.warn('⚠️ No filtered data available after processing demand.');
        }
      }
    } catch (error) {
      console.error('❌ Error in handleShowDemand:', error);
      showSnackbar('Error fetching data', 'error');
    }
  };

  // const handleShowDemand = async (selectDemand) => {
  //   if (!allWard?.length || !financialYear) {
  //     showSnackbar('Please select Ward and Financial Year', 'warning');
  //     return;
  //   }

  //   try {
  //     console.log('🚀 handleShowDemand triggered');
  //     console.log('🎯 selectedOwnerID', selectedOwnerID);

  //     let result = [];
  //     let isSpecialData = false;

  //     const skipColumnsMap = {
  //       TransMast: ['Maintenance', 'OriginalOwnerID', 'CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId'],
  //       TaxPending: ['CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId'],
  //       BillBook: ['Maintenance', 'CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate'],
  //       Appeal: ['CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId'],
  //       OldPropertyMast: ['CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId'],
  //       NewPropertyDetails: ['CreatedBy', 'UpdatedBy', 'CreatedDate', 'UpdatedDate', 'TId']
  //     };

  //     let finalColumns = [];
  //     let filteredData = [];

  //     // 1️⃣ Appeal
  //     if (selectedPropertiesAppealMast?.length > 0 && selectedOwnerID?.length > 0) {
  //       const payloadAppeal = { ownerIDs: selectedOwnerID, columns: selectedPropertiesAppealMast };
  //       const response = await fetchAppealData(payloadAppeal);
  //       result = response.data;
  //       isSpecialData = true;

  //       finalColumns = getFinalColumns(result, selectedPropertiesAppealMast, appealList, 'Appeal', skipColumnsMap);
  //       console.log('📋 [Appeal] Columns:', finalColumns, 'Rows:', result.length);

  //       setSelectedColumns(finalColumns);
  //       setTableData(result);
  //       setTableHeaders(finalColumns);
  //     }

  //     // 2️⃣ Old Property
  //     else if (selectedPropertiesOldMast?.length > 0 && selectedOwnerID?.length > 0) {
  //       const response = await fetchOldPropertyData({ ownerIDs: selectedOwnerID, columns: selectedPropertiesOldMast });
  //       result = response.data;
  //       isSpecialData = true;

  //       finalColumns = getFinalColumns(result, selectedPropertiesOldMast, oldPmList, 'OldPropertyMast', skipColumnsMap);
  //       console.log('📋 [Old Property] Columns:', finalColumns, 'Rows:', result.length);

  //       setSelectedColumns(finalColumns);
  //       setTableData(result);
  //       setTableHeaders(finalColumns);
  //     }

  //     // 3️⃣ New Property Details
  //     else if (selectedPropertiesDetailsNew?.length > 0 && selectedOwnerID?.length > 0) {
  //       const response = await fetchPropertyDetailsNewData({ ownerIDs: selectedOwnerID, columns: selectedPropertiesDetailsNew });
  //       result = response.data;
  //       isSpecialData = true;

  //       finalColumns = getFinalColumns(result, selectedPropertiesDetailsNew, propertyDetailsList, 'NewPropertyDetails', skipColumnsMap);
  //       console.log('📋 [New Property] Columns:', finalColumns, 'Rows:', result.length);

  //       setSelectedColumns(finalColumns);
  //       setTableData(result);
  //       setTableHeaders(finalColumns);
  //     }

  //     // 4️⃣ Demand Tables (Current/Pending/Total etc.)
  //     if (!isSpecialData) {
  //       let payload = { ownerIDList: selectedOwnerID || [], year: financialYear.split('-')[0] };

  //       const demandsNeedingDates = [
  //         'Current Collection', 'Pending Collection', 'Total Collection',
  //         'Outstanding Current Balance', 'Outstanding Pending Balance',
  //         'Outstanding Total Balance', 'Ghosehwara'
  //       ];

  //       if (demandsNeedingDates.includes(selectDemand) && fromDate && toDate) {
  //         payload.p_from_date = dayjs(fromDate).format('YYYY-MM-DD');
  //         payload.p_to_date = dayjs(toDate).format('YYYY-MM-DD');
  //       }
  //       if (selectDemand === 'Current Collection' || selectDemand === 'Pending Collection'|| selectDemand === 'Total Collection') {
  //         payload = {
  //           OwnerID: selectedOwnerID || [],
  //           p_Year: parseInt(financialYear.split('-')[0]),
  //           p_from_date: dayjs(fromDate).format('YYYY-MM-DD'),
  //           p_to_date: dayjs(toDate).format('YYYY-MM-DD')
  //         };
  //       }
  // switch (selectDemand) {
  //   case 'Current Demand':
  //     result = (await fetchCurrentDemand(payload)).data;
  //     break;

  //   case 'Pending Demand':
  //     result = (await fetchPendingDemand(payload)).data;
  //     break;

  //   case 'Total Demand':
  //     result = (await fetchTotalDemand(payload)).data;
  //     break;

  //   case 'Current Collection':
  //     result = (await fetchCurrentCollection(payload)).data;
  //     break;

  //   case 'Pending Collection':
  //     result = (await fetchPendingCollection(payload)).data;
  //     break;

  //   case 'Total Collection':
  //     result = (await fetchTotalCollection(payload)).data;
  //     break;

  //   case 'OutStanding Current Balance':
  //     result = (await fetchOutstandingCurrentBalance(payload)).data;
  //     break;

  //   case 'OutStanding Pending Balance':
  //     result = (await fetchOutstandingPendingBalance(payload)).data;
  //     break;

  //   case 'OutStanding Total Balance': {
  //     const currBal = (await fetchOutstandingCurrentBalance(payload)).data;
  //     const pendBal = (await fetchOutstandingPendingBalance(payload)).data;
  //     result = [...currBal, ...pendBal];
  //     break;
  //   }

  //   case 'Advance Collection':
  //     result = (await fetchAdvanceCollection(payload)).data;
  //     break;

  //   case 'Miscellaneous Fee': {
  //     result = (await fetchMiscellaneousFee(payload)).data;

  //     if (!result?.length) {
  //       showSnackbar('No data found', 'info');
  //       setTableHeaders([]);
  //       setTableData([]);
  //       return;
  //     }

  //     // ✅ Only show MiscellaneousFee column — no totals or extra columns
  //     const finalColumns = ['MiscellaneousFee'];
  //     setSelectedColumns(finalColumns);
  //     setTableHeaders(finalColumns);
  //     setTableData(result);

  //     console.log('✅ Showing only MiscellaneousFee column:', result);
  //     return; // ⛔ stop here — skip all further processing
  //   }
  // case 'Ghosehwara': {
  //   console.log("📊 Generating Ghosehwara combined table (OwnerID-wise)");

  //   // Split payloads by type
  //   const basePayload = {
  //     OwnerID: selectedOwnerID || [],
  //     p_Year: parseInt(financialYear.split('-')[0])
  //   };

  //   const datePayload = {
  //     ...basePayload,
  //     p_from_date: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
  //     p_to_date: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null
  //   };

  //   // Fetch all categories (some with date, some without)
  //   const requests = {
  //     currentDemand: fetchCurrentDemand(basePayload),
  //     pendingDemand: fetchPendingDemand(basePayload),
  //     totalDemand: fetchTotalDemand(basePayload),

  //     currentCollection: fetchCurrentCollection(datePayload),
  //     pendingCollection: fetchPendingCollection(datePayload),
  //     totalCollection: fetchTotalCollection(datePayload),

  //     outstandingCurrent: fetchOutstandingCurrentBalance(datePayload),
  //     outstandingPending: fetchOutstandingPendingBalance(datePayload),
  //     outstandingTotal: fetchOutstandingTotalBalance(datePayload),

  //     advanceCollection: fetchAdvanceCollection(datePayload),
  //     miscellaneousFee: fetchMiscellaneousFee(basePayload)
  //   };

  //   const results = await Promise.allSettled(Object.values(requests));
  //   const keys = Object.keys(requests);

  //   // Extract fulfilled data
  //   const allGhoseRows = keys.map((key, i) => ({
  //     type: key
  //       .replace(/([A-Z])/g, ' $1') // format CamelCase to readable type
  //       .replace(/^./, str => str.toUpperCase()),
  //     data:
  //       results[i].status === 'fulfilled' && Array.isArray(results[i].value?.data)
  //         ? results[i].value.data
  //         : []
  //   }));

  //   // If all are empty → show message & stop
  //   const totalDataCount = allGhoseRows.reduce(
  //     (sum, row) => sum + (row.data?.length || 0),
  //     0
  //   );
  //   if (totalDataCount === 0) {
  //     showSnackbar('No data found for selected owners', 'info');
  //     setTableData([]);
  //     setTableHeaders([]);
  //     return;
  //   }

  //   // ✅ Collect all unique headers (NO exclusions)
  //   const allHeaders = Array.from(
  //     new Set(allGhoseRows.flatMap(row => row.data.flatMap(r => Object.keys(r))))
  //   );

  //   // ✅ Group data by OwnerID (independent of missing datasets)
  //   const groupedByOwner = {};
  //   allGhoseRows.forEach(row => {
  //     row.data.forEach(record => {
  //       const ownerId = record.OwnerID ?? 'Unknown';
  //       if (!groupedByOwner[ownerId]) groupedByOwner[ownerId] = [];
  //       groupedByOwner[ownerId].push({
  //         Type: row.type,
  //         ...record
  //       });
  //     });
  //   });

  //   // ✅ Flatten grouped data for rendering
  //   const masterTable = [];
  //   Object.entries(groupedByOwner).forEach(([ownerId, records]) => {
  //     records.forEach(record => {
  //       const newObj = { OwnerID: ownerId, ...record };

  //       // Calculate NetTotal for numeric fields
  //       newObj.NetTotal = allHeaders.reduce(
  //         (sum, col) => sum + (Number(record[col]) || 0),
  //         0
  //       );

  //       masterTable.push(newObj);
  //     });
  //   });

  //   // ✅ Set headers & data
  //   const tableHeaders = ["OwnerID", "Type", ...allHeaders, "NetTotal"];
  //   setSelectedColumns(tableHeaders);
  //   setTableHeaders(tableHeaders);
  //   setTableData(masterTable);

  //   console.log("✅ Ghosehwara master table ready:", masterTable);
  //   break;
  // }

  //   default:
  //     console.warn('⚠️ Unknown demand type:', selectDemand);
  // }
  //       if (!result?.length) {
  //         showSnackbar('No data found', 'info');
  //         setTableHeaders([]);
  //         setTableData([]);
  //         return;
  //       }

  //   // ✅ Derive columns dynamically from result
  //   const finalColumns = getFinalColumns(result, selectedProperties, [], selectDemand, skipColumnsMap);

  //   // ✅ Sync all column-related states (this fixes autocomplete & table)
  //   setSelectedPropertiesTransMast(finalColumns);
  //   setSelectedPropertiesTaxPending(finalColumns);
  //   setSelectedPropertiesBillBook(finalColumns);
  //   setSelectedColumns(finalColumns);

  //   // ✅ Also sync table headers immediately
  //   setTableHeaders(finalColumns);

  //   console.log(`🧩 Columns set for ${selectDemand}:`, finalColumns);
  //       // 🧾 Calculate TaxTotal & NetTotal
  //       const taxColumns = [
  //         'PropertyTax', 'EducationTax', 'EmploymentTax', 'TreeCess', 'SpEducationTax',
  //         'Sanitation', 'DrainCess', 'SpWaterCess', 'RoadCess', 'FireCess', 'LightCess',
  //         'WaterBenefit', 'MajorBuilding', 'SewageDisposalCess', 'WaterBill',
  //         'Tax1', 'Tax2', 'Tax3', 'Tax4', 'Tax5'
  //       ];

  //       filteredData = result.map(row => {
  //         const newObj = { ...row };
  //         let netTotal = 0;
  //         taxColumns.forEach(col => netTotal += Number(row[col]) || 0);
  //         newObj.NetTotal = netTotal;
  //         newObj.TaxTotal = netTotal;
  //         return newObj;
  //       });

  //       // 5️⃣ Apply Compare Statement Filter
  //       if (compareStatement && selectedCompareOperator) {
  //         filteredData = filteredData.filter(row => {
  //           const taxTotal = Number(row.TaxTotal ?? 0);
  //           switch (selectedCompareOperator) {
  //             case 'EqualTo': return taxTotal === Number(equalToValue);
  //             case 'NotEqualTo': return taxTotal !== Number(notEqualToValue);
  //             case 'LessThan': return taxTotal < Number(lessThanValue);
  //             case 'GreaterThan': return taxTotal > Number(greaterThanValue);
  //             case 'LessThanOrEqual': return taxTotal <= Number(lessThanOrEqualValue);
  //             case 'GreaterThanOrEqual': return taxTotal >= Number(greaterThanOrEqualValue);
  //             case 'Between': return taxTotal >= Number(betweenValue) && taxTotal <= Number(andValue);
  //             default: return true;
  //           }
  //         });
  //         console.log(`📉 After Compare (${selectedCompareOperator}) → Rows:`, filteredData.length);
  //       }

  //       // 6️⃣ Top N Property filter
  //       const topCount = Number(topProperty);
  //       if (!isNaN(topCount) && topCount > 0) {
  //         filteredData.sort((a, b) => b.TaxTotal - a.TaxTotal);
  //         filteredData = filteredData.slice(0, topCount);
  //         console.log(`🏆 After Top ${topCount} filter → Rows:`, filteredData.length);
  //       }

  //       // 7️⃣ Sorting
  //       if (sortOnField === 'TaxTotal') {
  //         filteredData.sort((a, b) => order === 'Descending' ? b.TaxTotal - a.TaxTotal : a.TaxTotal - b.TaxTotal);
  //       } else if (sortOnField === 'NetTaxTotal') {
  //         filteredData.sort((a, b) => order === 'Descending' ? b.NetTotal - a.NetTotal : a.NetTotal - b.NetTotal);
  //       }

  // // 8️⃣ Add Ward/Prop/PartNo columns if needed
  // if (sortOnField === 'WardNo PropNo PartiNo') {
  //   const serviceData = {
  //     ownerIDs: filteredData.map(r => r.OwnerID),
  //     columns: ['WardNo', 'PropNo', 'PartiNo']
  //   };

  //   console.log('📤 Fetching PropertyMast for Ward sorting:', serviceData);
  //   // ✅ Auto-select these columns in Property Mast autocomplete
  //   setSelectedPropertiesPropertyMast(['NewWardNo', 'NewPropertyNo', 'NewPartitionNo']);
  //   const propertyMastResponse = await fetchPropertyMastColumnsByOwner(serviceData);
  //   const pmData = propertyMastResponse?.data || [];

  //   console.log('📥 PropertyMast data received:', propertyMastResponse);

  //   // 🔍 Merge Ward/Prop/Part info into filteredData
  //   filteredData = filteredData.map(row => {
  //     const match = pmData.find(p => p.OwnerID === row.OwnerID);
  //     if (!match) {
  //       console.warn(`⚠️ No PropertyMast found for OwnerID: ${row.OwnerID}`);
  //     }
  //     return {
  //       ...row,
  //       WardNo: match?.WardNo ?? '',
  //       PropertyNo: match?.PropNo ?? '',
  //       PartitionNo: match?.PartiNo ?? ''
  //     };
  //   });

  //   console.log('🔄 After merging Ward/Prop/Part info:', filteredData.slice(0, 5));

  //   // 🔢 Sort by Ward → Property → Partition
  //   filteredData.sort((a, b) => {
  //     const wardCompare = (a.NewWardNo || '').localeCompare(b.NewWardNo || '');
  //     if (wardCompare !== 0) return wardCompare;
  //     const propCompare = (a.NewPropertyNo || '').localeCompare(b.NewPropertyNo || '');
  //     if (propCompare !== 0) return propCompare;
  //     return (a.NewPartitionNo || '').localeCompare(b.NewPartitionNo || '');
  //   });

  //   console.log('🔢 After sorting by NewWardNo/PropertyNo/PartitionNo:', filteredData.slice(0, 5));

  //   // 🧾 Update table headers to include these at the start
  //   const existingHeaders = Object.keys(filteredData[0] || {});
  //   const withWardCols = [
  //     'NewWardNo', 'NewPropertyNo', 'NewPartitionNo',
  //     ...existingHeaders.filter(h => !['NewWardNo', 'NewPropertyNo', 'NewPartitionNo'].includes(h))
  //   ];

  //   setSelectedColumns(withWardCols);
  //   setTableHeaders(withWardCols);
  //   setTableData(filteredData);

  //   console.log('✅ Final Table with NewWardNo/PropertyNo/PartitionNo columns →', withWardCols);
  //   return; // exit to prevent overwriting table
  // }

  //       // ✅ Final fallback for all normal demand tables (Current, Pending, Total, etc.)
  // if (filteredData.length > 0) {
  //   const finalColumnsDemand = Object.keys(filteredData[0] || {});
  //   console.log('📋 [Demand] Final Columns:', finalColumnsDemand, 'Rows:', filteredData.length);

  //   setSelectedColumns(finalColumnsDemand);
  //   setTableHeaders(finalColumnsDemand);
  //   setTableData(filteredData);

  //   console.log('✅ Table updated for Demand type:', selectDemand);
  // } else {
  //   console.warn('⚠️ No filtered data available after processing demand.');
  // }
  //     }

  //   } catch (error) {
  //     console.error('❌ Error in handleShowDemand:', error);
  //     showSnackbar('Error fetching data', 'error');
  //   }
  // };

  const handleCompareOperatorChange = (value) => {
    setSelectedCompareOperator(value);

    // // Clear all text fields
    // setEqualToValue(value === 'EqualTo' ? equalToValue : '');
    // setNotEqualToValue(value === 'NotEqualTo' ? notEqualToValue : '');
    // setLessThanValue(value === 'LessThan' ? lessThanValue : '');
    // setGreaterThanValue(value === 'GreaterThan' ? greaterThanValue : '');
    // setLessThanOrEqualValue(value === 'LessThanOrEqual' ? lessThanOrEqualValue : '');
    // setGreaterThanOrEqualValue(value === 'GreaterThanOrEqual' ? greaterThanOrEqualValue : '');
    // setBetweenValue(value === 'Between' ? betweenValue : '');
    // setAndValue(value === 'Between' ? andValue : '');
    setEqualToValue('');
    setNotEqualToValue('');
    setLessThanValue('');
    setGreaterThanValue('');
    setLessThanOrEqualValue('');
    setGreaterThanOrEqualValue('');
    setBetweenValue('');
    setAndValue('');
  };

  const handleClearAll = () => {
    setSelectedDemandRadio('');
    setSortOnField('');
    setOrder('');
    setEqualToValue('');
    setNotEqualToValue('');
    setLessThanValue('');
    setGreaterThanValue('');
    setGreaterThanValue('');
    setLessThanOrEqualValue('');
    setGreaterThanOrEqualValue('');
    setBetweenValue('');
    setAndValue('');

    setSelectDemand('');
    setcurrentDemandOpen(false);
    setTaxPendingOpen(false);
    setSelectOpen(false);
    setBillBookOpen(false);
    setCurrentCollectionOpen(false);
    setPendingCollectionOpen(false);
    setTotalCollectionOpen(false);
    setRadioGroupEnabled(false);
    setSelectAll(false);
    setAllWard([]);
    setFinancialYear('');
    setSelectedProperties([]);
    setSelectedColumns([]);
    setSelectedPropertiesTransMast([]);
    setSelectedPropertiesPropertyMast([]);
    setSortOnField('');
    setTopProperty('');
    setCompareStatement(false);
    setSelectedCompareOperator('');
    setEqualToValue('');
    setNotEqualToValue('');
    setLessThanValue('');
    setGreaterThanValue('');
    setLessThanOrEqualValue('');
    setGreaterThanOrEqualValue('');
    setBetweenValue('');
    setAndValue('');

    setSelectedOwnerID([]);
    setTableHeaders([]);
    setTableData([]);
    setSelectedPropertyNoFromObj(null);
    setSelectedPropertyNoToObj(null);
  };
  const clearDemandOnly = () => {
    setSelectDemand('');
    setSelectedDemandRadio('');
    setRadioGroupEnabled(false);

    // Close all Autocomplete dropdowns
    setcurrentDemandOpen(false);
    setTaxPendingOpen(false);
    setBillBookOpen(false);
    setCurrentCollectionOpen(false);
    setPendingCollectionOpen(false);
    setTotalCollectionOpen(false);
    setGhosehwaraOpen(false);

    // Clear all demand-based selections
    setSelectedPropertiesTransMast([]);
    setSelectedPropertiesTaxPending([]);
    setSelectedPropertiesBillBook([]);
    setSelectedPropertiesAppealMast([]);
    setSelectedPropertiesOldMast([]);
    setSelectedPropertiesDetailsNew([]);

    // Clear table
    setTableHeaders([]);
    setTableData([]);
  };

  useEffect(() => {
    if (selectedPropertiesAppealMast.length > 0) {
      if (selectedPropertiesOldMast.length > 0) setSelectedPropertiesOldMast([]);
      if (selectedPropertiesDetailsNew.length > 0) setSelectedPropertiesDetailsNew([]);
      setSelectDemand('');
      setTableData([]);
      setTableHeaders([]);
    } else if (selectedPropertiesOldMast.length > 0) {
      if (selectedPropertiesAppealMast.length > 0) setSelectedPropertiesAppealMast([]);
      if (selectedPropertiesDetailsNew.length > 0) setSelectedPropertiesDetailsNew([]);
      setSelectDemand('');
      setTableData([]);
      setTableHeaders([]);
    } else if (selectedPropertiesDetailsNew.length > 0) {
      if (selectedPropertiesAppealMast.length > 0) setSelectedPropertiesAppealMast([]);
      if (selectedPropertiesOldMast.length > 0) setSelectedPropertiesOldMast([]);
      setSelectDemand('');
      setTableData([]);
      setTableHeaders([]);
    }
  }, [selectedPropertiesAppealMast, selectedPropertiesOldMast, selectedPropertiesDetailsNew]);

  const [radioLock, setRadioLock] = useState(false);

  return (
    <MainCard title="Property Wise">
      <Grid container spacing={2.2}>
        <Grid item xs={12}>
          <MainCard title="Property Details" style={{ color: '#1677ff' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>Select Ward </InputLabel>

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

                      {wardList.map((wd) => (
                        <MenuItem key={wd.NewWardNo} value={wd.NewWardNo}>
                          <Checkbox checked={allWard.indexOf(wd.NewWardNo) > -1} />
                          <ListItemText primary={wd.NewWardNo} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/*From Property Autocomplete*/}
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>From Property</InputLabel>
                  <Autocomplete
                    options={propertyNoList || []}
                    getOptionLabel={(option) =>
                      option.NewPartitionNo ? `${option.NewPropertyNo}_${option.NewPartitionNo}` : `${option.NewPropertyNo}`
                    }
                    value={selectedPropertyNoFromObj}
                    onChange={(event, newValue) => setSelectedPropertyNoFromObj(newValue)}
                    disableClearable
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select From Property" disabled={selectAll || allWard.length > 1} />
                    )}
                    disablePortal
                  />
                </Stack>
              </Grid>

              {/* To Property Autocomplete */}
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <InputLabel>To Property</InputLabel>
                  <Autocomplete
                    options={propertyNoToList || []}
                    getOptionLabel={(option) =>
                      option.NewPartitionNo ? `${option.NewPropertyNo}_${option.NewPartitionNo}` : `${option.NewPropertyNo}`
                    }
                    value={selectedPropertyNoToObj}
                    onChange={(event, newValue) => setSelectedPropertyNoToObj(newValue)}
                    disableClearable
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select To Property" disabled={selectAll || allWard.length > 1} />
                    )}
                    disablePortal
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={2.1}>
                <Stack spacing={1}>
                  <InputLabel>Financial Year</InputLabel>
                  <Select onChange={handleChangeYear} value={financialYear}>
                    {Array.isArray(financialYearList) &&
                      financialYearList.map((fin) => (
                        <MenuItem key={fin.FinanceYearRange} value={fin.FinanceYearRange}>
                          {fin.FinanceYearRange}
                        </MenuItem>
                      ))}
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={2.2}>
                <Stack spacing={1}>
                  <InputLabel>Property Description</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      multiple
                      value={selectedProperties}
                      onChange={(e) => setSelectedProperties(e.target.value)}
                      input={<OutlinedInput />}
                      renderValue={(selected) =>
                        propertyDesc
                          .filter((item) => selected.includes(item.PropertyTypeID))
                          .map((item) => item.PropertyDescription)
                          .join(', ')
                      }
                      MenuProps={{
                        PaperProps: {
                          style: { maxHeight: 130 }
                        }
                      }}
                    >
                      {Array.isArray(propertyDesc) &&
                        propertyDesc.map((item) => (
                          <MenuItem key={item.PropertyTypeID} value={item.PropertyTypeID}>
                            <Checkbox checked={selectedProperties.includes(item.PropertyTypeID)} />
                            <ListItemText primary={item.PropertyDescription} />
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={2} marginTop={1}>
              {/* Property Mast */}
              <Grid item xs={12} sm={2}>
                <Stack spacing={2}>
                  <InputLabel>Property Mast</InputLabel>
                  {/* <Autocomplete
                    multiple
                  options={(pmList || []).filter(col => !hiddenPropertyMastColumns.includes(col))}
                    value={selectedPropertiesPropertyMast}
                    onChange={(event, newValue) => setSelectedPropertiesPropertyMast(newValue)}
                    disableCloseOnSelect
                    open={propertyMastOpen}
                    onOpen={() => setPropertyMastOpen(true)}
                    onClose={() => setPropertyMastOpen(false)}
                    getOptionLabel={(option) => option}
                     ListboxProps={{
        style: {
          maxHeight: 48 * 5 + 8, // 👈 5 items visible (48px each + some padding)
          overflowY: 'auto',
        },
      }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox style={{ marginRight: 8 }} checked={selected} />
                        {option}
                      </li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Property Mast" />}
                    renderTags={() => null}
                  /> */}
                  <Autocomplete
                    multiple
                    options={['All', ...(pmList || []).filter((col) => !hiddenPropertyMastColumns.includes(col))]} // 👈 include "All"
                    value={selectedPropertiesPropertyMast}
                    onChange={(event, newValue, reason) => {
                      const allOptions = (pmList || []).filter((col) => !hiddenPropertyMastColumns.includes(col));

                      // 🧠 If "All" selected — select everything
                      if (newValue.includes('All') && reason !== 'removeOption') {
                        setSelectedPropertiesPropertyMast(allOptions);
                      }
                      // 🧠 If "All" deselected — clear all selections
                      else if (!newValue.includes('All') && selectedPropertiesPropertyMast.length === allOptions.length) {
                        setSelectedPropertiesPropertyMast([]);
                      }
                      // 🧠 Normal selection behavior
                      else {
                        setSelectedPropertiesPropertyMast(newValue);
                      }
                    }}
                    disableCloseOnSelect
                    open={propertyMastOpen}
                    onOpen={() => setPropertyMastOpen(true)}
                    onClose={() => setPropertyMastOpen(false)}
                    getOptionLabel={(option) => option}
                    ListboxProps={{
                      style: {
                        maxHeight: 48 * 5 + 8,
                        overflowY: 'auto'
                      }
                    }}
                    renderOption={(props, option, { selected }) => {
                      const allOptions = (pmList || []).filter((col) => !hiddenPropertyMastColumns.includes(col));
                      const isAllSelected = selectedPropertiesPropertyMast.length === allOptions.length;

                      return (
                        <li {...props}>
                          <Checkbox style={{ marginRight: 8 }} checked={option === 'All' ? isAllSelected : selected} />
                          {option}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    renderTags={() => null}
                  />
                </Stack>
              </Grid>

              {/* New Property Details */}

              {/* New Property Details */}
              <Grid item xs={12} sm={2}>
                <Stack spacing={2}>
                  <InputLabel>New Property Details</InputLabel>
                  <Autocomplete
                    multiple
                    options={['All', ...(propertyDetailsList || [])]} // ✅ include "All"
                    value={selectedPropertiesDetailsNew}
                    onChange={(event, newValue) => {
                      const allOptions = propertyDetailsList || [];
                      const allSelected = selectedPropertiesDetailsNew.length === allOptions.length;

                      // 🧠 Handle “All” toggle logic
                      if (newValue.includes('All')) {
                        if (allSelected) {
                          // “All” unchecked → clear all
                          setSelectedPropertiesDetailsNew([]);
                        } else {
                          // “All” checked → select everything
                          setSelectedPropertiesDetailsNew(allOptions);
                        }
                      } else {
                        // Regular item selection
                        setSelectedPropertiesDetailsNew(newValue);
                      }

                      // 🧹 Clear other related selections and table
                      if (newValue.length > 0) {
                        setSelectedPropertiesAppealMast([]);
                        setSelectedPropertiesOldMast([]);
                        setTableData([]);
                        setTableHeaders([]);
                      }
                    }}
                    disableCloseOnSelect
                    open={detailsNewOpen}
                    onOpen={() => setDetailsNewOpen(true)}
                    onClose={() => setDetailsNewOpen(false)}
                    getOptionLabel={(option) => option}
                    ListboxProps={{
                      style: {
                        maxHeight: 48 * 5 + 8, // show max 5 items
                        overflowY: 'auto'
                      }
                    }}
                    renderOption={(props, option, { selected }) => {
                      const allOptions = propertyDetailsList || [];
                      const isAllSelected = selectedPropertiesDetailsNew.length === allOptions.length;

                      return (
                        <li {...props}>
                          <Checkbox style={{ marginRight: 8 }} checked={option === 'All' ? isAllSelected : selected} />
                          {option}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    renderTags={() => null}
                  />
                </Stack>
              </Grid>

              {/* Appeal */}
              <Grid item xs={12} sm={2}>
                <Stack spacing={2}>
                  <InputLabel>Appeal</InputLabel>
                  <Autocomplete
                    multiple
                    options={['All', ...(appealList || [])]} // ✅ include "All"
                    value={selectedPropertiesAppealMast}
                    onChange={(event, newValue) => {
                      const allOptions = appealList || [];
                      const allSelected = selectedPropertiesAppealMast.length === allOptions.length;

                      // 🧠 Handle “All” toggle logic
                      if (newValue.includes('All')) {
                        if (allSelected) {
                          // “All” unchecked → clear all
                          setSelectedPropertiesAppealMast([]);
                        } else {
                          // “All” checked → select all
                          setSelectedPropertiesAppealMast(allOptions);
                        }
                      } else {
                        // Normal item selection
                        setSelectedPropertiesAppealMast(newValue);
                      }

                      // 🧹 Clear other dropdowns and table when appeal changes
                      setSelectedPropertiesOldMast([]);
                      setSelectedPropertiesDetailsNew([]);
                      setTableData([]);
                      setTableHeaders([]);
                    }}
                    disableCloseOnSelect
                    open={appealMastOpen}
                    onOpen={() => setAppealMastOpen(true)}
                    onClose={() => setAppealMastOpen(false)}
                    getOptionLabel={(option) => option}
                    ListboxProps={{
                      style: {
                        maxHeight: 48 * 5 + 8, // show up to 5 items
                        overflowY: 'auto'
                      }
                    }}
                    renderOption={(props, option, { selected }) => {
                      const allOptions = appealList || [];
                      const isAllSelected = selectedPropertiesAppealMast.length === allOptions.length;

                      return (
                        <li {...props}>
                          <Checkbox style={{ marginRight: 8 }} checked={option === 'All' ? isAllSelected : selected} />
                          {option}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    renderTags={() => null}
                  />
                </Stack>
              </Grid>

              {/* Old Property */}
              <Grid item xs={12} sm={2}>
                <Stack spacing={2}>
                  <InputLabel>Old Property</InputLabel>
                  <Autocomplete
                    multiple
                    options={['All', ...(oldPmList || [])]}
                    value={selectedPropertiesOldMast}
                    onChange={(event, newValue) => {
                      const allOptions = oldPmList || [];
                      const allSelected = selectedPropertiesOldMast.length === allOptions.length;

                      // 🧠 Handle “All” toggle
                      if (newValue.includes('All')) {
                        if (allSelected) {
                          setSelectedPropertiesOldMast([]); // unselect all
                        } else {
                          setSelectedPropertiesOldMast(allOptions); // select all
                        }
                      } else {
                        setSelectedPropertiesOldMast(newValue);
                      }

                      // 🧹 Clear other dropdowns + table
                      setSelectedPropertiesAppealMast([]);
                      setSelectedPropertiesDetailsNew([]);
                      setTableData([]);
                      setTableHeaders([]);
                    }}
                    disableCloseOnSelect
                    open={oldMastOpen}
                    onOpen={() => setOldMastOpen(true)}
                    onClose={() => setOldMastOpen(false)}
                    getOptionLabel={(option) => option}
                    ListboxProps={{
                      style: {
                        maxHeight: 48 * 5 + 8,
                        overflowY: 'auto'
                      }
                    }}
                    renderOption={(props, option, { selected }) => {
                      const allOptions = oldPmList || [];
                      const isAllSelected = selectedPropertiesOldMast.length === allOptions.length;
                      return (
                        <li {...props}>
                          <Checkbox style={{ marginRight: 8 }} checked={option === 'All' ? isAllSelected : selected} />
                          {option}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    renderTags={() => null}
                  />
                </Stack>
              </Grid>

              {/* Trans Mast */}
              <Grid item xs={12} sm={2}>
                <Stack spacing={2}>
                  <InputLabel>Trans Mast</InputLabel>
                  <Autocomplete
                    multiple
                    options={['All', ...(transMastList || [])]}
                    value={selectedPropertiesTransMast}
                    onChange={(event, newValue) => {
                      const allOptions = transMastList || [];
                      const allSelected = selectedPropertiesTransMast.length === allOptions.length;

                      // 🧠 “All” select/unselect logic
                      if (newValue.includes('All')) {
                        if (allSelected) {
                          setSelectedPropertiesTransMast([]); // unselect all
                        } else {
                          setSelectedPropertiesTransMast(allOptions); // select all
                        }
                      } else {
                        setSelectedPropertiesTransMast(newValue);
                      }

                      // 🧹 Optional: clear table if needed
                      // setTableData([]);
                      // setTableHeaders([]);
                    }}
                    disableCloseOnSelect
                    open={currentDemandOpen}
                    onOpen={() => setcurrentDemandOpen(true)}
                    onClose={() => setcurrentDemandOpen(false)}
                    getOptionLabel={(option) => option}
                    ListboxProps={{
                      style: {
                        maxHeight: 48 * 5 + 8,
                        overflowY: 'auto'
                      }
                    }}
                    renderOption={(props, option, { selected }) => {
                      const allOptions = transMastList || [];
                      const isAllSelected = selectedPropertiesTransMast.length === allOptions.length;
                      return (
                        <li {...props}>
                          <Checkbox style={{ marginRight: 8 }} checked={option === 'All' ? isAllSelected : selected} />
                          {option}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    renderTags={() => null}
                  />
                </Stack>
              </Grid>

              {/* Tax Pending */}
              <Grid item xs={12} sm={2}>
                <Stack spacing={2}>
                  <InputLabel>Tax Pending</InputLabel>
                  <Autocomplete
                    multiple
                    options={['All', ...(taxPendingList || [])]}
                    value={selectedPropertiesTaxPending}
                    onChange={(event, newValue) => {
                      const allOptions = taxPendingList || [];
                      const allSelected = selectedPropertiesTaxPending.length === allOptions.length;

                      // 🧠 “All” toggle logic
                      if (newValue.includes('All')) {
                        if (allSelected) {
                          setSelectedPropertiesTaxPending([]); // unselect all
                        } else {
                          setSelectedPropertiesTaxPending(allOptions); // select all
                        }
                      } else {
                        setSelectedPropertiesTaxPending(newValue);
                      }

                      // 🧹 Optional reset
                      // setTableData([]);
                      // setTableHeaders([]);
                    }}
                    disableCloseOnSelect
                    open={taxPendingOpen}
                    onOpen={() => setTaxPendingOpen(true)}
                    onClose={() => setTaxPendingOpen(false)}
                    getOptionLabel={(option) => option}
                    ListboxProps={{
                      style: {
                        maxHeight: 48 * 5 + 8,
                        overflowY: 'auto'
                      }
                    }}
                    renderOption={(props, option, { selected }) => {
                      const allOptions = taxPendingList || [];
                      const isAllSelected = selectedPropertiesTaxPending.length === allOptions.length;
                      return (
                        <li {...props}>
                          <Checkbox style={{ marginRight: 8 }} checked={option === 'All' ? isAllSelected : selected} />
                          {option}
                        </li>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    renderTags={() => null}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={1} marginTop={2}>
              <Typography style={{ color: '#1677ff' }}>Transaction Dates For Bill Entry Details</Typography>

              <Grid container spacing={1} marginTop={2}>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel>From Date</InputLabel>
                  </Stack>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        value={fromDate}
                        onChange={(newValue) => setFromDate(newValue)}
                        disabled={!['Current Collection', 'Pending Collection', 'Total Collection'].includes(selectDemand)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel>To Date</InputLabel>
                  </Stack>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        value={toDate}
                        onChange={(newValue) => setToDate(newValue)}
                        disabled={!['Current Collection', 'Pending Collection', 'Total Collection'].includes(selectDemand)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Stack spacing={0.5}>
                    <InputLabel>Bill Entry</InputLabel>

                    <Autocomplete
                      multiple
                      options={['All', ...(billBookList || [])]} // ✅ Add "All" option
                      value={selectedPropertiesBillBook}
                      onChange={(event, newValue) => {
                        const allOptions = billBookList || [];
                        const allSelected = selectedPropertiesBillBook.length === allOptions.length;

                        // 🧠 Handle “All” select/unselect logic
                        if (newValue.includes('All')) {
                          if (allSelected) {
                            // “All” unchecked → clear all
                            setSelectedPropertiesBillBook([]);
                          } else {
                            // “All” checked → select everything
                            setSelectedPropertiesBillBook(allOptions);
                          }
                        } else {
                          // Regular case
                          setSelectedPropertiesBillBook(newValue);
                        }

                        // 🧹 Optional cleanup (uncomment if needed)
                        // setTableData([]);
                        // setTableHeaders([]);
                      }}
                      disableCloseOnSelect
                      open={billBookOpen}
                      onOpen={() => setBillBookOpen(true)}
                      onClose={() => setBillBookOpen(false)}
                      getOptionLabel={(option) => option}
                      ListboxProps={{
                        style: {
                          maxHeight: 48 * 5 + 8, // show max 5 items
                          overflowY: 'auto'
                        }
                      }}
                      renderOption={(props, option, { selected }) => {
                        const allOptions = billBookList || [];
                        const isAllSelected = selectedPropertiesBillBook.length === allOptions.length;

                        return (
                          <li {...props}>
                            <Checkbox style={{ marginRight: 8 }} checked={option === 'All' ? isAllSelected : selected} />
                            {option}
                          </li>
                        );
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      renderTags={() => null}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={1} marginTop={2}>
              <Stack direction={'row'} alignItems="center">
                <InputLabel style={{ color: '#1677ff' }}>Compare Statement</InputLabel>
                <Checkbox checked={compareStatement} onChange={handleCompareChange} />
              </Stack>
            </Grid>
            <Grid container spacing={2}>
              {/* Column 1 */}
              <Grid item xs={12} sm={3}>
                <Stack direction="row" alignItems="center">
                  <Radio
                    value="EqualTo"
                    checked={selectedCompareOperator === 'EqualTo'}
                    onChange={() => handleCompareOperatorChange('EqualTo')}
                    disabled={!compareStatement}
                  />
                  <InputLabel sx={{ mr: 6 }}>Equal To</InputLabel>

                  <TextField
                    size="small"
                    value={equalToValue}
                    onChange={(e) => setEqualToValue(e.target.value)}
                    disabled={!compareStatement}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" marginTop={1}>
                  <Radio
                    value="NotEqualTo"
                    checked={selectedCompareOperator === 'NotEqualTo'}
                    onChange={() => handleCompareOperatorChange('NotEqualTo')}
                    //onChange={(e) => setSelectedCompareOperator(e.target.value)}
                    disabled={!compareStatement}
                  />
                  <InputLabel sx={{ mr: 3 }}>Not EqualTo</InputLabel>

                  <TextField
                    size="small"
                    value={notEqualToValue}
                    onChange={(e) => setNotEqualToValue(e.target.value)}
                    disabled={!compareStatement}
                  />
                </Stack>
              </Grid>

              {/* Column 2 */}
              <Grid item xs={12} sm={3}>
                <Stack spacing={1}>
                  {/* LessThan */}
                  <Stack direction="row" alignItems="center">
                    <Radio
                      value="LessThan"
                      checked={selectedCompareOperator === 'LessThan'}
                      onChange={() => handleCompareOperatorChange('LessThan')}
                      //onChange={(e) => setSelectedCompareOperator(e.target.value)}
                      disabled={!compareStatement}
                    />
                    <InputLabel sx={{ mr: 5 }}>Less Than</InputLabel>

                    <TextField
                      size="small"
                      value={lessThanValue}
                      onChange={(e) => setLessThanValue(e.target.value)}
                      disabled={!compareStatement}
                    />
                  </Stack>

                  {/* GreaterThan */}
                  <Stack direction="row" alignItems="center">
                    <Radio
                      value="GreaterThan"
                      checked={selectedCompareOperator === 'GreaterThan'}
                      onChange={() => handleCompareOperatorChange('GreaterThan')}
                      //onChange={(e) => setSelectedCompareOperator(e.target.value)}
                      disabled={!compareStatement}
                    />
                    <InputLabel sx={{ mr: 3, whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'unset' }}>Greater Than</InputLabel>

                    <TextField
                      size="small"
                      value={greaterThanValue}
                      onChange={(e) => setGreaterThanValue(e.target.value)}
                      disabled={!compareStatement}
                    />
                  </Stack>
                </Stack>
              </Grid>

              {/* Column 3 */}
              <Grid item xs={12} sm={3}>
                <Stack spacing={1}>
                  {/* LessThanOrEqual */}
                  <Stack direction="row" alignItems="center">
                    <Radio
                      value="LessThanOrEqual"
                      checked={selectedCompareOperator === 'LessThanOrEqual'}
                      onChange={() => handleCompareOperatorChange('LessThanOrEqual')}
                      //onChange={(e) => setSelectedCompareOperator(e.target.value)}
                      disabled={!compareStatement}
                    />
                    <InputLabel sx={{ mr: 4, whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'unset' }}>
                      Less Than or Equal To
                    </InputLabel>

                    <TextField
                      size="small"
                      value={lessThanOrEqualValue}
                      onChange={(e) => setLessThanOrEqualValue(e.target.value)}
                      disabled={!compareStatement}
                      // sx={{ width: '100px' }}
                      // sx={{ flex: 1 }}
                    />
                  </Stack>
                  {/* GreaterThanOrEqual */}
                  <Stack direction="row" alignItems="center">
                    <Radio
                      value="GreaterThanOrEqual"
                      checked={selectedCompareOperator === 'GreaterThanOrEqual'}
                      onChange={() => handleCompareOperatorChange('GreaterThanOrEqual')}
                      //onChange={(e) => setSelectedCompareOperator(e.target.value)}
                      disabled={!compareStatement}
                    />
                    <InputLabel sx={{ mr: 2, whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'unset' }}>
                      Greater Than or Equal To
                    </InputLabel>

                    <TextField
                      size="small"
                      value={greaterThanOrEqualValue}
                      onChange={(e) => setGreaterThanOrEqualValue(e.target.value)}
                      disabled={!compareStatement}
                    />
                  </Stack>
                </Stack>
              </Grid>

              {/* Column 4 */}
              <Grid item xs={12} sm={3}>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center">
                    <Radio
                      value="Between"
                      checked={selectedCompareOperator === 'Between'}
                      onChange={(e) => setSelectedCompareOperator(e.target.value)}
                      disabled={!compareStatement}
                    />
                    <InputLabel sx={{ mr: 2 }}>Between</InputLabel>

                    {/* First value */}
                    <TextField
                      size="small"
                      value={betweenValue}
                      onChange={(e) => setBetweenValue(e.target.value)}
                      disabled={!compareStatement}
                      sx={{ width: '80px', mr: 1 }}
                    />

                    <InputLabel sx={{ mr: 1 }}>And</InputLabel>

                    {/* Second value */}
                    <TextField
                      size="small"
                      value={andValue}
                      onChange={(e) => setAndValue(e.target.value)}
                      disabled={!compareStatement}
                      sx={{ width: '80px' }}
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={1} marginTop={2}>
              <Stack spacing={1}>
                <InputLabel style={{ color: '#1677ff' }}>Select TaxTotal Field of a Following Table To Compare</InputLabel>
              </Stack>
            </Grid>
            {/* 
            <Grid container marginTop={2} spacing={2}>
<Box disabled={!radioGroupEnabled}>
              <FormControlLabel
                control={<Radio />}
                label="Trans Mast"
                value="Trans Mast"
                checked={selectedDemandRadio === 'Trans Mast'}
                onChange={(e) => setSelectedDemandRadio(e.target.value)}
                sx={{
                  color: 'black',
                  ml: 3, // label color
                  '& .MuiFormControlLabel-label': { color: 'black' } // more specific
                }}
              />
              <FormControlLabel
                control={<Radio />}
                label="Tax Pending"
                value="Tax Pending"
                checked={selectedDemandRadio === 'Tax Pending'}
                onChange={(e) => setSelectedDemandRadio(e.target.value)}
                // sx={{ marginLeft: '5px' }}
                sx={{
                  color: 'black',
                  ml: 3, // label color
                  '& .MuiFormControlLabel-label': { color: 'black' } // more specific
                }}
              />
              <FormControlLabel
                control={<Radio />}
                label="Bill Entry"
                value="Bill Entry"
                checked={selectedDemandRadio === 'Bill Entry'}
                onChange={(e) => setSelectedDemandRadio(e.target.value)}
                sx={{
                  color: 'black',
                  ml: 3, // label color
                  '& .MuiFormControlLabel-label': { color: 'black' } // more specific
                }}
              />
              <FormControlLabel
                control={<Radio />}
                label="Total Demand"
                value="Total Demand"
                checked={selectedDemandRadio === 'Total Demand'}
                onChange={(e) => setSelectedDemandRadio(e.target.value)}
                sx={{
                  color: 'black',
                  ml: 3, // label color
                  '& .MuiFormControlLabel-label': { color: 'black' } // more specific
                }}
              />
              <FormControlLabel
                control={<Radio />}
               label="Current Outstanding"
  value="Current Outstanding"
  checked={selectedDemandRadio === 'Current Outstanding'}
                onChange={(e) => setSelectedDemandRadio(e.target.value)}
                sx={{
                  color: 'black',
                  ml: 3, 
                  '& .MuiFormControlLabel-label': { color: 'black' } 
                }}
              />
              <FormControlLabel
                control={<Radio />}
                label="Pending Outstanding"
                value="Pending Outstanding"
                checked={selectedDemandRadio === 'Pending Outstanding'}
                onChange={(e) => setSelectedDemandRadio(e.target.value)}
                sx={{
                  color: 'black',
                  ml: 3, 
                  '& .MuiFormControlLabel-label': { color: 'black' } 
                }}
              />
              <FormControlLabel
                control={<Radio />}
                label="Total Outstanding"
                value="Total Outstanding"
                checked={selectedDemandRadio === 'Total Outstanding'}
                onChange={(e) => setSelectedDemandRadio(e.target.value)}
                sx={{
                  color: 'black',
                  ml: 3, 
                  '& .MuiFormControlLabel-label': { color: 'black' }
                }}
              />

</Box>
            </Grid> */}
            <Grid container marginTop={2} spacing={2}>
              <FormControl component="fieldset">
                <Box sx={{ ml: 2 }}>
                  {[
                    'Trans Mast',
                    'Tax Pending',
                    'Bill Entry',
                    'Total Demand',
                    'Current Outstanding',
                    'Pending Outstanding',
                    'Total Outstanding'
                  ].map((label) => (
                    <FormControlLabel
                      key={label}
                      control={<Radio />}
                      label={label}
                      value={label}
                      checked={selectedDemandRadio === label}
                      onClick={(e) => {
                        // ❌ Block click if radios are disabled or locked
                        if (!radioGroupEnabled) {
                          e.preventDefault();
                          return;
                        }

                        // 🔒 Lock selection: only allow switch if radioLock is false
                        if (radioLock) {
                          e.preventDefault();
                          return;
                        }

                        setSelectedDemandRadio(e.target.value);
                      }}
                      sx={{
                        color: 'black',
                        ml: 3,
                        cursor: radioGroupEnabled
                          ? radioLock
                            ? 'not-allowed' // locked after selecting demand
                            : 'pointer'
                          : 'not-allowed',
                        '& .MuiFormControlLabel-label': { color: 'black' }
                      }}
                    />
                  ))}
                </Box>
              </FormControl>
            </Grid>

            <Grid container spacing={2} alignItems="center" marginTop={2}>
              <Grid item xs={12} sm={3}>
                <InputLabel sx={{ mb: 2 }}>Select Demand Type </InputLabel>
                <FormControl fullWidth>
                  <Select
                    labelId="selectDemandLabel"
                    value={selectDemand}
                    onChange={handleSelectDemandChange}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 5 + 8,
                          overflowY: 'auto'
                        }
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left'
                      }
                    }}
                    fullWidth
                  >
                    <MenuItem value="Current Demand">Current Demand</MenuItem>
                    <MenuItem value="Pending Demand">Pending Demand</MenuItem>
                    <MenuItem value="Total Demand">Total Demand</MenuItem>
                    <MenuItem value="Current Collection">Current Collection</MenuItem>
                    <MenuItem value="Pending Collection">Pending Collection</MenuItem>
                    <MenuItem value="Total Collection">Total Collection</MenuItem>
                    <MenuItem value="OutStanding Current Balance">OutStanding Current Balance</MenuItem>
                    <MenuItem value="OutStanding Pending Balance">OutStanding Pending Balance</MenuItem>
                    <MenuItem value="OutStanding Total Balance">OutStanding Total Balance</MenuItem>
                    <MenuItem value="Ghosehwara">Ghosehwara</MenuItem>
                    <MenuItem value="Advance Collection">Advance Collection</MenuItem>
                    <MenuItem value="Miscellaneous Fee">Miscellaneous Fee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <InputLabel sx={{ mb: 2 }}>Top Property </InputLabel>
                <TextField fullWidth value={topProperty} onChange={(e) => setTopProperty(e.target.value)} />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <InputLabel sx={{ mb: 2 }}>Sort on Field </InputLabel>
                <FormControl fullWidth>
                  <Select
                    labelId="sortOnFieldLabel"
                    id="sortOnField"
                    value={sortOnField}
                    onChange={(e) => handleSortChange(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">---Please Select One---</MenuItem>
                    <MenuItem value="Owner Id">Owner Id</MenuItem>
                    <MenuItem value="WardNo PropNo PartiNo">WardNo PropNo PartiNo</MenuItem>
                    <MenuItem value="TaxTotal">TaxTotal</MenuItem>
                    <MenuItem value="NetTaxTotal">NetTaxTotal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <InputLabel sx={{ mb: 2 }}>Order By </InputLabel>
                <FormControl fullWidth>
                  <Select labelId="orderLabel" id="order" value={order} onChange={(e) => setOrder(e.target.value)} fullWidth>
                    <MenuItem value="">---Please Select One---</MenuItem>
                    <MenuItem value="Ascending">Ascending</MenuItem>
                    <MenuItem value="Descending">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="body1" className="text-danger" sx={{ paddingLeft: '20px' }}>
                  RecordCount:{tableData.length}
                </Typography>
              </Grid>
            </Grid>
          </MainCard>

          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2} marginTop={2}>
              <Grid item xs={12} sm={2}>
                <Button variant="contained" fullWidth color="primary" onClick={() => handleShowDemand(selectDemand)}>
                  Show
                </Button>
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={4000}
                  onClose={() => setSnackbarOpen(false)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button variant="contained" fullWidth color="primary" onClick={handleExportButtonClick}>
                  Export To Excel
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button variant="contained" fullWidth color="secondary" onClick={handleClearAll}>
                  Clear All
                </Button>
                <Dialog open={openDilog} onClose={() => setOpenDialog(false)}>
                  <DialogTitle>Amc Calculations</DialogTitle>
                  <DialogContent>
                    <DialogContentText>{dialogText}</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        clearDemandOnly();
                        setOpenDialog(false);
                      }}
                    >
                      No
                    </Button>
                    <Button onClick={() => setOpenDialog(false)}>Yes</Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <MainCard>
              <Box
                sx={{
                  width: '100%',
                  maxHeight: 500, // 👈 sets visible height
                  overflow: 'auto', // 👈 enables scrollbars if content overflows
                  border: '1px solid #ddd',
                  borderRadius: 2
                }}
              >
                {tableData.length > 0 && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        {/* <TableCell>Sr No</TableCell> */}
                        {selectedColumns.map((header) => (
                          <TableCell key={header}>{header}</TableCell>
                        ))}
                        {/* <TableCell>Net Total</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={index}>
                          {/* <TableCell>{index + 1}</TableCell> */}
                          {/* {selectedColumns.map((header) => {
                            const value = row[header] ?? '-';
                            return <TableCell key={header}>{value}</TableCell>;
                          })}
                            */}
                          {selectedColumns.map((header) => {
                            const value = row[header];

                            // 🛑 If value is an object -> convert to string to avoid React crash
                            const safeValue = value && typeof value === 'object' ? JSON.stringify(value) : value ?? '-';

                            return <TableCell key={header}>{safeValue}</TableCell>;
                          })}
                          {/* <TableCell>{row.NetTotal ?? 0}</TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default PropertyWise;
