import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Checkbox,
  ListItemText,
  Button,
  TextField,
  Box,
  Stack,
  Snackbar,
  SnackbarContent,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Paper,
  Backdrop,
  CircularProgress
} from '@mui/material';
import MainCard from 'components/MainCard';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { display, height, textAlign } from '@mui/system';
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { fetchPropertyDescription } from 'services/data-entry.services';
import {
  getMissingPhotos,
  fetchMissingData,
  missingPropertyNo,
  missingToiletData,
  dupPropertyFloor,
  nontaxableProperty,
  taxableProperty,
  zeroCarpetAreaProps,
  constructionRent,
  oldRVHavingNoNetTax,
  propertiesRent,
  oldTaxGrthanOldRV,
  fetchOldWithoutTaxRV,
  fetchZeroTaxRVOldProperties,
  fetchOldTaxPresentNetZero,
  fetchPropertyDescMismatch,
  fetchEmpTaxResidential,
  fetchEmpTaxExemptCommercial,
  fetchEduTaxExemptCommercial,
  fetchEduTaxExemptResidential,
  fetchZeroTaxPropertyList,
  fetchHolderList,
  fetchMutationList,
  fetchPropertiesChart,
  fetchZoningList,
  fetchCurrentAppealStatus,
  fetchAutoAppealCommittee,
  fetchAutoHearingList,
  fetchOpenPlotProperties,
  fetchObliqueProperties,
  fetchConstructionProperties,
  getListByTaxRange,
  getNewTaxLessOldTax,
  getListByPropertyDesc,
  getNewTaxGreaterOldTax,
  fetchDataEntryGap,
  getFlatDetails,
  getRoomCarpetComparison,
  getToiletAreaComparison,
  getSqFtComparison,
  submissionAreaMismatch,
  submissionRoomNoMismatch,
  submissionMissing,
  utilityRoomCount,
  areaTotalIsMinusYes,
  lengthWidthZeroAreaGtZero,
  lengthZeroAreaGtZero,
  roomNoRepeat,
  fetchInvoiceReport,
  fetchTransactionReport,
  advanceAndBillBookReport
} from 'services/report/autoQc/qc';
import { getBillBookList, getTransYear } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import { set } from 'lodash';

function QC() {
  // Handle change in selected wards
  const [yearTrans, setYearTransList] = useState([]);
  const [year, setFinanceYear] = useState('');
  const [billBookNoList, setBillBookNoList] = useState([]);
  const [billBookNo, setBillBookNo] = useState([]);
  const [selectedBillBooks, setSelectedBillBooks] = useState([]);
  const [allBillBookData, setAllBillBookData] = useState({});
  const [selectedWards, setSelectedWards] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedDesc, setSelectedDesc] = useState([]);
  const [propertyDesc, setPropertyDesc] = useState([]);
  const [taxRange, setTaxRange] = useState({
    FromTax: 0,
    ToTax: 0
  });
  const [compareValue, setCompareValue] = useState('');
  const [xValue, setXValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [activePanel, setActivePanel] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]); // Initialize value as an empty array
  const [floorOption, setFloorOption] = useState('');
  const [dupProperty, setDupProperty] = useState('');
  const [missingToilet, setMissingToilet] = useState('');
  const [tableData, setTableData] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  // State for checkbox selections
  const [selectedPhotos, setSelectedPhotos] = useState({
    photoA: false,
    photoB: false,
    photoC: false,
    photoD: false,
    planPhoto: false,
    all: false
  });
  const [rentChecks, setRentChecks] = useState({
    calculatedRent: false,
    nonCalculatedRent: false
  });
  const [holderListChecks, setHolderListChecks] = useState({
    Plot: false,
    Building: false
  });
  const [demand, setDemand] = useState('');
  //const [selected]
  //snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [flatChecks, setFlatChecks] = useState({
    wardNo: '',
    fromProp: '',
    toProp: '',
    bhk: '',
    allBhk: false
  });
  const [roomNoRepeatChecks, setRoomNoRepeatChecks] = useState({
    rooms: '',
    carpetArea: ''
  });
  const [toiletAreaComparison, setToiletAreaComparison] = useState({
    Toilets: '',
    CarpetArea: ''
  });
  const [percent, setPercent] = useState('');
  const disabledPanels = [
    'oldCarpetAreaMismatch',
    'oldRVMismatch',
    'oldPropertyTaxMismatch',
    'plotAreaMismatch',
    'secondPhotoMissing',
    'oldTotalTaxMismatch',
    'propertyDescMismatchFlat',
    'apartmentNameMismatch',
    'newCarpetAreaMismatch',
    'constructionTypeMismatch',
    'taxMismatch',
    'apartmentNoMismatch',
    'toiletCountMismatch',
    'constructionYearMismatch',
    'zoneMismatch'
  ];

  // Dropdown change handler
  const handleDropdownChange = (option) => {
    const value = option.target.value;
    setTableData([]);
    setSelectedOption(value);
    setIsPanelOpen(true);
    switch (value) {
      // Missing Details
      case 'Missing Photo Plan':
        setActivePanel('missingPhotoPlan');
        break;
      case 'Missing Floor Info/Shop Name/Address/PlotArea':
        setActivePanel('floorInfo');
        break;
      case 'Missing PropertyNo':
        setActivePanel('missingPropertyNo');
        break;
      case 'Missing Toilet':
        setActivePanel('missingToilet');
        break;

      // Non Taxable List
      case 'Property is non taxtable but total tax is greater than zero':
        setActivePanel('nonTaxableButTaxGtZero');
        break;
      case 'Property is taxable but total is zero':
        setActivePanel('taxableButTaxIsZero');
        break;

      // Auto QC
      case 'Properties having zero carpet area':
        setActivePanel('zeroCarpetArea');
        break;
      case "Construction Type like 'AR','BR','CR'...etc but Calculated Rent is zero.":
        setActivePanel('constructionRentZero');
        break;
      case 'Duplicate Property/Floor List':
        setActivePanel('duplicateProperty');
        break;
      case 'Old RV has value but total tax is Zero':
        setActivePanel('oldRVNetZero');
        break;
      case 'Properties with renter and having rent':
        setActivePanel('renterWithRent');
        break;
      case 'Old Tax Greater Old RV List.':
        setActivePanel('oldTaxGtOldRV');
        break;
      case 'Old Property Without Old Tax and Old RV':
        setActivePanel('oldPropertyWithoutTaxRV');
        break;
      case 'Properties having Old property no. but its Old tax and old RV is zero':
        setActivePanel('oldPropertyNoZeroTaxRV');
        break;
      case 'Property Description Mismatch.':
        setActivePanel('propertyDescMismatch');
        break;
      case 'Property have old Tax but Net tax is Zero':
        setActivePanel('oldTaxNetZero');
        break;
      case 'Emp tax is applied on Residential properties.':
        setActivePanel('empTaxResidential');
        break;
      case 'Emp tax is not applied on Commercial properties':
        setActivePanel('empTaxExemptCommercial');
        break;
      case 'Edu tax is not applied on Residential properties':
        setActivePanel('eduTaxResidential');
        break;
      case 'Edu tax is not applied on Commercial properties':
        setActivePanel('eduTaxExemptCommercial');
        break;
      // Recommended By MC
      case 'Zero Tax Property List':
        setActivePanel('zeroTaxProperty');
        break;
      case 'Holder List':
        setActivePanel('holderList');
        break;
      case 'Mutation List':
        setActivePanel('mutationList');
        break;
      case 'Property chart(Main Prop,Oblique Prop,OP)':
        setActivePanel('propertyChart');
        break;
      case 'Zoning List':
        setActivePanel('zoningList');
        break;
      case 'Properties with Current Appeal Status':
        setActivePanel('currentAppealStatus');
        break;
      case 'Properties in Auto Appeal Committee':
        setActivePanel('autoAppealCommittee');
        break;
      case 'Properties in Auto Hearing List':
        setActivePanel('autoHearingList');
        break;

      // Assessment QC List
      case 'Open Plot Properties':
        setActivePanel('openPlotProperties');
        break;
      case 'Oblique Properties List':
        setActivePanel('obliqueProperties');
        break;
      case 'Under Construction Properties':
        setActivePanel('underConstruction');
        break;
      case 'TotalTax in Between Given Range':
        setActivePanel('totalTaxRange');
        break;
      case 'New Total Tax is less than old total tax in Given Range(As per old,0 to 1.5,1.5to 3...etc)':
        setActivePanel('newTaxLessOldTax');
        break;
      case 'Property Description Wise List.':
        setActivePanel('propertyDescWise');
        break;
      case 'New Total Tax is greater than old total tax in Given Range(as per old,0to 1.5,1.5to 3...etc)':
        setActivePanel('newTaxGreaterOldTax');
        break;
      case 'Data Entry Gap':
        setActivePanel('dataEntryGap');
        break;

      // Flat System
      case 'Old carpet area not matching':
        setActivePanel('oldCarpetAreaMismatch');
        break;
      case 'Old RV not matching':
        setActivePanel('oldRVMismatch');
        break;
      case 'Old property Tax not matching':
        setActivePanel('oldPropertyTaxMismatch');
        break;
      case 'Old Total Tax not matching':
        setActivePanel('oldTotalTaxMismatch');
        break;
      case 'New carpet area not matching':
        setActivePanel('newCarpetAreaMismatch');
        break;
      case 'Toilet count not matching':
        setActivePanel('toiletCountMismatch');
        break;
      case 'Plot area not matching':
        setActivePanel('plotAreaMismatch');
        break;
      case 'Property description not matching':
        setActivePanel('propertyDescMismatchFlat');
        break;
      case 'Construction type not matching':
        setActivePanel('constructionTypeMismatch');
        break;
      case 'Construction year not matching':
        setActivePanel('constructionYearMismatch');
        break;
      case 'Tax is not matching':
        setActivePanel('taxMismatch');
        break;
      case 'Second photo is missing':
        setActivePanel('secondPhotoMissing');
        break;
      case 'Apartment/Shop name not matching':
        setActivePanel('apartmentNameMismatch');
        break;
      case 'Apartment/Shop No is not matching':
        setActivePanel('apartmentNoMismatch');
        break;
      case 'Zone not matching':
        setActivePanel('zoneMismatch');
        break;
      case 'Comparison of room with respect to carpet area':
        setActivePanel('roomCarpetComparison');
        break;
      case 'Comparison of toilet with respect to total area':
        setActivePanel('toiletAreaComparison');
        break;
      case 'Comparison of OldSqFt and NewSqFt':
        setActivePanel('sqFtComparison');
        break;

      // Submission
      case 'Carpet Area Mismatch':
        setActivePanel('submissionCarpetAreaMismatch');
        break;
      case 'RoomNo Mismatch':
        setActivePanel('submissionRoomNoMismatch');
        break;
      case 'Submission Missing':
        setActivePanel('submissionMissing');
        break;
      case 'RoomNo Repeat':
        setActivePanel('roomNoRepeat');
        break;
      case 'Length is zero but area is greater than zero':
        setActivePanel('lengthZeroAreaGtZero');
        break;
      case 'Length=0 & width=0 & area>0':
        setActivePanel('lengthWidthZeroAreaGtZero');
        break;
      case 'Area=totalArea and isMinus=Yes':
        setActivePanel('areaTotalIsMinusYes');
        break;
      case 'Utility Having Room Count':
        setActivePanel('utilityRoomCount');
        break;
      //AMC list
      case 'Missing Invoice No.':
        setActivePanel('missingInvoiceNo');
        break;
      case 'Canceled Invoice Lists':
        setActivePanel('canceledInvoice');
        break;
      case 'Transaction Report':
        setActivePanel('transactionReport');
        break;
      case 'Advance Payment Transaction Report':
        setActivePanel('advancePaymentReport');
        break;
      case 'Bill Book List':
        setActivePanel('billBookList');
        break;
      default:
        setActivePanel(null);
        break;
    }
  };

  //handle ward change
  const handleWardChange = (event) => {
    const value = event.target.value;
    if (value.includes('All')) {
      if (selectedWards.length === wardList.length) {
        setSelectedWards([]);
      } else {
        setSelectedWards(wardList.map((w) => w.NewWardNo));
      }
    } else {
      setSelectedWards(value);
    }
  };

  // Handle checkbox changes
  const handleCheckboxPhotoes = (event) => {
    const { name, checked } = event.target;

    // If "All" checkbox is clicked
    if (name === 'all') {
      setSelectedPhotos({
        photoA: checked,
        photoB: checked,
        photoC: checked,
        photoD: checked,
        planPhoto: checked,
        all: checked
      });
    } else {
      setSelectedPhotos((prevState) => {
        const updatedState = {
          ...prevState,
          [name]: checked,
          all: false // IMPORTANT: Uncheck All when any item changes
        };

        return updatedState;
      });
    }
  };

  //handle and set Missing photos
  const handleMissingPhotos = async () => {
    // Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    // Validate selected photos
    const isAnyPhotoSelected = Object.values(selectedPhotos).some(Boolean);
    if (!isAnyPhotoSelected) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one missing photo');
      setSnackbarOpen(true);
      return;
    }

    // Prepare payload
    const selectedFilters = {
      ...selectedPhotos,
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      const { data, status } = await getMissingPhotos(selectedFilters);
      setOpenLoader(false);

      // Handle empty data for successful response (200)
      if (Array.isArray(data) && data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage('No missing photos found');
        setSnackbarOpen(true);
        return;
      }

      // Success: display data
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch missing photos';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  //select missing floor info filter
  const handleFloorInfoCheckbox = (event) => {
    const value = event.target.value;
    setFloorOption(value);
    console.log('floor info filter', value);
  };

  //handle and set Floor Info
  const handleFloorInfo = async () => {
    // Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    const selectedFilters = {
      floorInfo: floorOption,
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      const { data, status } = await fetchMissingData(selectedFilters);
      setOpenLoader(false);
      console.log('missing floorInfo', data);

      // Success but no data
      if (Array.isArray(data) && data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage('No missing floorInfo found');
        setSnackbarOpen(true);
        return;
      }

      // Success with data
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch missing floorInfo';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  //handle rent change
  const handleRentCheckbox = (event) => {
    const { name, checked } = event.target;

    setRentChecks((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  //handle and set Construction Type like "AR","BR","CR"...etc but Calculated Rent is zero.
  const handleConstructionRentZero = async () => {
    // Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    // Validate selected rent checkboxes
    const isAnyRentsSelected = Object.values(rentChecks).some(Boolean);
    if (!isAnyRentsSelected) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one checkbox');
      setSnackbarOpen(true);
      return;
    }

    const selectedFilters = {
      constructionRent: rentChecks,
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      const { data, status } = await constructionRent(selectedFilters);
      setOpenLoader(false);
      console.log('Construction Type AR/BR/CR but Calculated Rent is zero', data);

      // Success but no data
      if (!Array.isArray(data) || data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage('No Calculated Rent is zero');
        setSnackbarOpen(true);
        return;
      }

      // Success with data
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch Calculated Rent zero';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  //handle missing toilet
  const handleMissingToilet = async () => {
    // Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    const selectedFilters = {
      selectedOption: missingToilet,
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      const { data, status } = await missingToiletData(selectedFilters);
      setOpenLoader(false);
      console.log('missing ToiletData', data);

      // Success but no data
      if (!Array.isArray(data) || data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage('No missing ToiletData found');
        setSnackbarOpen(true);
        return;
      }

      // Success with data
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch missing ToiletData';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  //handle duplicate property
  const handleDupProperty = async () => {
    // Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    const selectedFilters = {
      selectedOption: dupProperty,
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      const { data, status } = await dupPropertyFloor(selectedFilters);
      setOpenLoader(false);
      console.log('missing PropertyNo', data);

      // Success but no data
      if (!Array.isArray(data) || data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage('No missing PropertyNo found');
        setSnackbarOpen(true);
        return;
      }

      // Success with data
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch missing PropertyNo';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  //handle PropertiesRentZero
  const handlePropertiesRentZero = async () => {
    // Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    // Validate selected checkboxes
    const isAnyRentsSelected = Object.values(rentChecks).some(Boolean);
    if (!isAnyRentsSelected) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one checkbox');
      setSnackbarOpen(true);
      return;
    }

    const selectedFilters = {
      selectedOption: rentChecks,
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      const { data, status } = await propertiesRent(selectedFilters);
      setOpenLoader(false);
      console.log('Construction Type AR/BR/CR but Calculated Rent is zero', data);

      // Success but no data
      if (!Array.isArray(data) || data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage('No Calculated Rent is zero');
        setSnackbarOpen(true);
        return;
      }

      // Success with data
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch Calculated Rent zero';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  // Helper to determine if "Both" should be checked
  const isBothChecked = holderListChecks.Plot && holderListChecks.Building;
  // Handle Holder list checkbox changes
  const handleHolderCheckbox = (event) => {
    const { name, checked } = event.target;

    if (name === 'Both') {
      // When "Both" is clicked, set Plot and Building
      setHolderListChecks({
        Plot: checked,
        Building: checked
      });
    } else {
      // Update individual checkbox
      setHolderListChecks((prevState) => {
        const updatedState = {
          ...prevState,
          [name]: checked
        };
        return updatedState;
      });
    }
  };

  // Handle and set Holder list
  const handleHolderList = async () => {
    // Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    // Validate selected holder list
    const isAnyHolderSelected = Object.values(holderListChecks).some(Boolean);
    if (!isAnyHolderSelected) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one holder list');
      setSnackbarOpen(true);
      return;
    }

    // Prepare payload
    const selectedFilters = {
      holderInfo: holderListChecks, // corrected syntax
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      console.log('holder list filter', selectedFilters);
      const { data, status } = await fetchHolderList(selectedFilters);

      setOpenLoader(false);

      // Handle empty data
      if (Array.isArray(data) && data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage('No holder list found for selected option');
        setSnackbarOpen(true);
        return;
      }

      // Success: display data
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch holder list';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };
  //handle taxRange fix for property description
  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxRange((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value) // Convert to number
    }));
  };
  //handle Property description change
  const handlePropertyDescChange = (event) => {
    const value = event.target.value;

    // If the event comes from the external Select All checkbox
    if (event.target.checked !== undefined) {
      if (selectedDesc.length === propertyDesc.length) {
        setSelectedDesc([]);
      } else {
        setSelectedDesc(propertyDesc.map((p) => p.PropertyTypeID));
      }
    } else {
      setSelectedDesc(value);
    }
  };
  //handle newtax lesser than oldertax
  const handleCompareChange = (event) => {
    setCompareValue(event.target.value);

    // Reset X if user selects anything else
    if (event.target.value !== 'Less than old Tax X Times') {
      setXValue('');
    }
  };

  //AMC
  //Handle to change BillBookNo
  const handleBillBookNo = (event) => {
    const value = event.target.value;

    if (value === 'All') {
      setBillBookNo('All'); // UI shows "All"
      setSelectedBillBooks(billBookNoList); // store all bill numbers internally
    } else {
      setBillBookNo(value); // UI shows selected number
      setSelectedBillBooks([value]); // store single value internally
    }
  };

  //Financial year change
  const handleFinanceYearChange = (ev) => {
    if (yearTrans) {
      setFinanceYear(ev.target.value);
    } else {
      setFinanceYear('');
    }
  };

  //handle missing invoice no
  const handleInvoiceReport = async () => {
    // Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }
    if (!year) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select year');
      setSnackbarOpen(true);
      return;
    }
    if (!billBookNo) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select Bill book no');
      setSnackbarOpen(true);
      return;
    }

    // Prepare payload
    const selectedFilters = {
      year,
      billBookNo,
      activePanel,
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      console.log('missing invoice filter', selectedFilters);
      const { data, status } = await fetchInvoiceReport(selectedFilters);

      setOpenLoader(false);

      // Handle empty data
      if (Array.isArray(data) && data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage(`No ${selectedOption} found`);
        setSnackbarOpen(true);
        return;
      }

      // Success: display data
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch ';

      if (status === 400) {
        setSnackbarSeverity('error');
      } else if (status === 404) {
        setSnackbarSeverity('error');
      } else {
        setSnackbarSeverity('error');
      }

      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };
  const handleTransactionReport = async (d) => {
    setDemand(d);

    // 1️⃣ Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    // 2️⃣ Validate Year
    if (!year) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Financial Year');
      setSnackbarOpen(true);
      return;
    }

    // 3️⃣ Demand validation (use the function argument 'd')
    if (!d) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Current or Pending Demand');
      setSnackbarOpen(true);
      return;
    }

    // 4️⃣ Prepare filters (USE d — NOT demand)
    const selectedFilters = {
      year: Number(year),
      demand: d,
      wardNo: selectedWards
    };

    setOpenLoader(true);

    try {
      const { data } = await fetchTransactionReport(selectedFilters);
      setOpenLoader(false);

      console.log('Transaction report', data);

      // No records
      if (!Array.isArray(data) || data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage('Transaction report not found');
        setSnackbarOpen(true);
        return;
      }

      // Success
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || 'Failed to fetch transaction report';

      setSnackbarSeverity('error');
      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  const handleAdvanceAndBillBookReport = async () => {
    // 1️⃣ Validate ward selection
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    // 2️⃣ Validate Year
    if (!year) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please Select Financial Year');
      setSnackbarOpen(true);
      return;
    }
    // 3️⃣ Prepare filters
    const selectedFilters = {
      activePanel,
      wardNo: selectedWards,
      year: Number(year)
    };

    setOpenLoader(true);

    try {
      const { data } = await advanceAndBillBookReport(selectedFilters);
      setOpenLoader(false);

      console.log('advance And BillBook report', data);

      // No records
      if (!Array.isArray(data) || data.length === 0) {
        setTableData([]);
        setSnackbarSeverity('error');
        setReceivedMessage(`${activePanel} report not found`);
        setSnackbarOpen(true);
        return;
      }

      // Success
      setTableData(data);
      setIsPanelOpen(false);
    } catch (error) {
      setOpenLoader(false);

      const status = error.response?.status;
      const message = error.response?.data?.message || `Failed to fetch ${activePanel} report`;

      setSnackbarSeverity('error');
      setReceivedMessage(message);
      setSnackbarOpen(true);
    }
  };

  //handle generate
  const handleGenerate = async () => {
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }
    if (!activePanel) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one dropdown option');
      setSnackbarOpen(true);
      return;
    }

    const selectedFilters = {
      selectedOption: activePanel,
      wardNo: selectedWards
    };

    // --- Helper to run any API request ---
    const runRequest = async (apiFunc, logMsg, emptyMsg, errorMsg) => {
      try {
        setOpenLoader(true);
        const { data, status } = await apiFunc(selectedFilters);
        console.log(logMsg, data);
        setOpenLoader(false);

        // Handle empty data
        if (!Array.isArray(data) || data.length === 0) {
          setTableData([]);
          setSnackbarSeverity('error');
          setReceivedMessage(emptyMsg);
          setSnackbarOpen(true);
          return;
        }

        // Success with data
        setTableData(data);
        setIsPanelOpen(false);
      } catch (error) {
        setOpenLoader(false);

        const status = error.response?.status;
        const message = error.response?.data?.message || errorMsg;

        if (status === 400) {
          setSnackbarSeverity('error');
        } else if (status === 404) {
          setSnackbarSeverity('error');
        } else {
          setSnackbarSeverity('error');
        }

        console.error(errorMsg, error);
        setReceivedMessage(message);
        setSnackbarOpen(true);
      }
    };

    // --- Panels ---
    switch (activePanel) {
      case 'nonTaxableButTaxGtZero':
        return runRequest(
          nontaxableProperty,
          'Non taxable but tax > 0',
          'No non taxable property found',
          'Failed to fetch non taxable property'
        );
      case 'taxableButTaxIsZero':
        return runRequest(taxableProperty, 'Taxable but tax = 0', 'No taxable property found', 'Failed to fetch taxable property');
      case 'missingPropertyNo':
        return runRequest(missingPropertyNo, 'Missing PropertyNo', 'No missing PropertyNo found', 'Failed to fetch missing PropertyNo');
      case 'zeroCarpetArea':
        return runRequest(
          zeroCarpetAreaProps,
          'Zero Carpet Area',
          'No data found for Zero Carpet Area',
          'Failed to fetch Zero Carpet Area'
        );
      case 'oldRVNetZero':
        return runRequest(
          oldRVHavingNoNetTax,
          'OldRV has value but Net Tax is zero',
          'No data found for oldRV net tax zero',
          'Failed to fetch oldRV net tax zero'
        );
      case 'oldTaxGtOldRV':
        return runRequest(
          oldTaxGrthanOldRV,
          'Old Tax greater than oldRV',
          'No data found for Old Tax greater than oldRV',
          'Failed to fetch Old Tax greater than oldRV'
        );
      case 'oldPropertyWithoutTaxRV':
        return runRequest(
          fetchOldWithoutTaxRV,
          'Old Property without old tax and  oldRV',
          'No data found for oldProperties without old tax and  oldRV',
          'Failed to fetch oldProperties without old tax and  oldRV'
        );
      case 'oldPropertyNoZeroTaxRV':
        return runRequest(
          fetchZeroTaxRVOldProperties,
          'Old Property No. having  zero oldtax and oldRV',
          'No data found for Old Property No. having  zero oldtax and oldRV',
          'Failed to fetchOld Property No. having  zero oldtax and oldRV'
        );
      case 'oldTaxNetZero':
        return runRequest(
          fetchOldTaxPresentNetZero,
          'Property have old Tax but Net tax is Zero',
          'No data found forProperty have old Tax but Net tax is Zero',
          'Failed to fetch Property have old Tax but Net tax is Zero'
        );
      case 'propertyDescMismatch':
        return runRequest(
          fetchPropertyDescMismatch,
          'Property description not matching',
          'No data found  for Property description Mismatch',
          'Failed to fetch Property description Mismatch'
        );
      case 'empTaxResidential':
        return runRequest(
          fetchEmpTaxResidential,
          'Emp tax is applied on Residential properties',
          'No data found for Emp tax is applied on Residential properties',
          'Failed to fetch for Emp tax is applied on Residential properties'
        );
      case 'empTaxExemptCommercial':
        return runRequest(
          fetchEmpTaxExemptCommercial,
          'Emp tax is not applied on Commercial properties',
          'No data found for Emp tax exempt Commercial properties',
          'Failed to fetch Emp tax exempt Commercial properties'
        );
      case 'eduTaxResidential':
        return runRequest(
          fetchEduTaxExemptResidential,
          'Edu tax is not applied on Residential properties',
          'No data found for Edu tax not applied on Residential properties',
          'Failed to fetch Edu tax not applied on Residential properties'
        );
      case 'eduTaxExemptCommercial':
        return runRequest(
          fetchEduTaxExemptCommercial,
          'Edu tax is not applied on Commercial properties',
          'No data found for Edu tax exempt Commercial properties',
          'Failed to fetch Edu tax exempt Commercial properties'
        );
      case 'zeroTaxProperty':
        return runRequest(
          fetchZeroTaxPropertyList,
          'Zero Tax Property List',
          'No data found for Zero Tax Property List',
          'Failed to fetch Zero Tax Property List'
        );
      case 'mutationList':
        return runRequest(fetchMutationList, 'Mutation List', 'No data found for Mutation List', 'Failed to fetch Mutation List');
      case 'propertyChart':
        return runRequest(fetchPropertiesChart, 'Property Chart', 'No data found for Property Chart', 'Failed to fetch Property Chart');
      case 'zoningList':
        return runRequest(fetchZoningList, 'Zoning List', 'No data found for Zoning List', 'Failed to fetch Zoning List');
      case 'currentAppealStatus':
        return runRequest(
          fetchCurrentAppealStatus,
          'Properties in Current Appeal Status',
          'No data found for Properties in Auto Appeal Committee',
          'Failed to fetch Properties in Auto Appeal Committee'
        );
      case 'autoAppealCommittee':
        return runRequest(
          fetchAutoAppealCommittee,
          'Properties in Auto Appeal Committee',
          'No data found for Properties in Auto Appeal Committee',
          'Failed to fetch Properties in Auto Appeal Committee'
        );
      case 'autoHearingList':
        return runRequest(
          fetchAutoHearingList,
          'Properties in Auto Hearing List',
          'No data found for Properties in Auto Hearing List',
          'Failed to fetch Properties in Auto Hearing List'
        );
      case 'openPlotProperties':
        return runRequest(
          fetchOpenPlotProperties,
          'Open Plot Properties',
          'No data found for Open Plot Properties',
          'Failed to fetch Open Plot Properties'
        );
      case 'obliqueProperties':
        return runRequest(
          fetchObliqueProperties,
          'Oblique Properties List',
          'No data found for Oblique Properties List',
          'Failed to fetch Oblique Properties List'
        );
      case 'underConstruction':
        return runRequest(
          fetchConstructionProperties,
          'Under Construction Properties',
          'No data found for Under Construction Properties',
          'Failed to fetch Under Construction Properties'
        );
      case 'dataEntryGap':
        return runRequest(fetchDataEntryGap, 'Data Entry Gap', 'No data found for Data Entry Gap', 'Failed to fetch Data Entry Gap');
      case 'submissionCarpetAreaMismatch':
        return runRequest(
          submissionAreaMismatch,
          'Carpet Area Mismatch',
          'No data found for Carpet Area Mismatch',
          'Failed to fetch Carpet Area Mismatch'
        );

      case 'submissionRoomNoMismatch':
        return runRequest(
          submissionRoomNoMismatch,
          'RoomNo Mismatch',
          'No data found for RoomNo Mismatch',
          'Failed to fetch RoomNo Mismatch'
        );

      case 'submissionMissing':
        return runRequest(
          submissionMissing,
          'Submission Missing',
          'No data found for Submission Missing',
          'Failed to fetch Submission Missing'
        );
      case 'roomNoRepeat':
        return runRequest(roomNoRepeat, 'RoomNo Repeat', 'No data found for RoomNo Repeat', 'Failed to fetch RoomNo Repeat');
      case 'lengthZeroAreaGtZero':
        return runRequest(
          lengthZeroAreaGtZero,
          'Length is zero but area is greater than zero',
          'No data found for Length is zero but area is greater than zero',
          'Failed to fetch Length is zero but area is greater than zero'
        );
      case 'lengthWidthZeroAreaGtZero':
        return runRequest(
          lengthWidthZeroAreaGtZero,
          'Length=0 & width=0 & area>0',
          'No data found for Length=0 & width=0 & area>0',
          'Failed to fetch Length=0 & width=0 & area>0'
        );
      case 'areaTotalIsMinusYes':
        return runRequest(
          areaTotalIsMinusYes,
          'Area=totalArea and isMinus=Yes',
          'No data found for Area=totalArea and isMinus=Yes',
          'Failed to fetch Area=totalArea and isMinus=Yes'
        );
      case 'utilityRoomCount':
        return runRequest(
          utilityRoomCount,
          'Utility Having Room Count',
          'No data found for Utility Having Room Count',
          'Failed to fetch Utility Having Room Count'
        );

      default:
        console.warn('Unknown active panel:', activePanel);
        break;
    }
  };

  // Handle dropdown change
  const handleChange = (event) => {
    const selectedId = event.target.value;
    const report = QCList.find((qc) => qc.id === selectedId);
  };

  const handleChangeList = (event) => {
    setSelectedTypes(event.target.value);
  };

  // Panel action handlers
  const handleOk = () => {
    // Call API based on activePanel
    console.log('Call API for panel:', activePanel);
    setActivePanel(null); // close panel
  };

  const handleCancel = () => {
    setIsPanelOpen(false);
    // if (activePanel == 'missingPhotoPlan') {
    //   setSelectedPhotos({
    //     photoA: false,
    //     photoB: false,
    //     photoC: false,
    //     photoD: false,
    //     planPhoto: false,
    //     all: false
    //   });
    // }
    // else if (activePanel == 'floorInfo') {
    //   setFloorOption('');
    // }
    // else if (activePanel == 'constructionRentZero') {
    //   setRentChecks({ calculatedRent: false, nonCalculatedRent: false });
    // }
    // else if (activePanel == 'duplicateProperty') {
    //   setDupProperty('');
    // }
    // else if (activePanel == 'renterWithRent') {
    //   setRentChecks({ calculatedRent: false, nonCalculatedRent: false });
    // }
    // else if (activePanel == 'holderList') {
    //   setHolderListChecks({
    //     Plot: false,
    //     Building: false
    //   });
    // }
    setSelectedOption('');
  };

  const handleClear = () => {
    setTableData([]);
    //setIsPanelOpen(true);
    setSelectedOption('');
    setActivePanel('');
    setSelectedWards([]);
  };

  // Generate Excel sheet
  const generateExcel = async () => {
    if (!tableData.length) return;

    // Create Workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('QC missing data');

    // Dynamic headers from the first object
    const headers = Object.keys(tableData[0]);

    // Add header row
    sheet.addRow(headers);

    // Add data rows
    tableData.forEach((row) => {
      const rowData = headers.map((h) => row[h] ?? '');
      sheet.addRow(rowData);
    });

    // Auto column width
    sheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Export as file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'QC_missing_data.xlsx');
  };
  //handle get tax between range

  const handleGetTaxBetweenRange = async () => {
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }
    if (selectedDesc.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one Property Description');
      setSnackbarOpen(true);
      return;
    }
    if (taxRange.from === '' || taxRange.to === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter both From and To values');
      setSnackbarOpen(true);
      return;
    }
    const result = await getListByTaxRange(selectedWards, selectedDesc, taxRange);
    console.log('Tax range result', result);
    setTableData(result.data);
    if (result.data.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data found for the selected criteria');
      setSnackbarOpen(true);
      return;
    }
    setIsPanelOpen(false);
  };
  const handleGetNewTaxGreaterOldTax = async () => {
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }
    if (compareValue === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select a comparison option');
      setSnackbarOpen(true);
      return;
    }
    if (compareValue === 'Less than old Tax X Times' && (xValue === '' || isNaN(xValue) || Number(xValue) <= 0)) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter a valid number for X');
      setSnackbarOpen(true);
      return;
    }
    const result = await getNewTaxGreaterOldTax(selectedWards, compareValue, xValue);
    console.log('New tax greater old tax result', result);
    setTableData(result.data);
    if (result.data.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data found for the selected criteria');
      setSnackbarOpen(true);
      return;
    }
    setIsPanelOpen(false);
  };
  const handleGetNewTaxLessOldTax = async () => {
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }
    if (compareValue === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select a comparison option');
      setSnackbarOpen(true);
      return;
    }
    if (compareValue === 'Less than old Tax X Times' && (xValue === '' || isNaN(xValue) || Number(xValue) <= 0)) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter a valid number for X');
      setSnackbarOpen(true);
      return;
    }
    const result = await getNewTaxLessOldTax(selectedWards, compareValue, xValue);
    console.log('New tax less old tax result', result);
    setTableData(result.data);
    if (result.data.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data found for the selected criteria');
      setSnackbarOpen(true);
      return;
    }
    setIsPanelOpen(false);
  };
  const handlePropertyDescWise = async () => {
    if (!selectedWards?.length) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one ward');
      setSnackbarOpen(true);
      return;
    }

    if (selectedTypes.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one Property Description');
      setSnackbarOpen(true);
      return;
    }
    const result = await getListByPropertyDesc(selectedWards, selectedTypes);
    console.log('Property description wise result', result);
    setTableData(result.data);
    if (result.data.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data found for the selected criteria');
      setSnackbarOpen(true);
      return;
    }
    setIsPanelOpen(false);
  };
  const handleFlatDetails = async () => {
    if (flatChecks.wardNo === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select a ward');
      setSnackbarOpen(true);
      return;
    }
    if (flatChecks.fromPropertyNo === '' || flatChecks.toPropertyNo === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter both From and To Property No.');
      setSnackbarOpen(true);
      return;
    }
    if (Number(flatChecks.fromPropertyNo) > Number(flatChecks.toPropertyNo)) {
      setSnackbarSeverity('error');
      setReceivedMessage('From Property No. should be less than or equal to To Property No.');
      setSnackbarOpen(true);
      return;
    }
    if (flatChecks.bhk === '' && flatChecks.allBhk === false) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select at least one BHK option');
      setSnackbarOpen(true);
      return;
    }
    const result = await getFlatDetails(flatChecks, activePanel);
    console.log('Flat details result', result);
    setTableData(result.data);
    if (result.data.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data found for the selected criteria');
      setSnackbarOpen(true);
      return;
    }
    setIsPanelOpen(false);
  };
  const handleRoomCarpetComparison = async () => {
    if (selectedWards.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select a ward');
      setSnackbarOpen(true);
      return;
    }
    if (roomNoRepeatChecks.rooms === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter the number of rooms');
      setSnackbarOpen(true);
      return;
    }
    if (roomNoRepeatChecks.carpetArea === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter the carpet area');
      setSnackbarOpen(true);
      return;
    }
    const result = await getRoomCarpetComparison(selectedWards, roomNoRepeatChecks);
    console.log('Room and Carpet area comparison result', result);
    setTableData(result.data);
    if (result.data.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data found for the selected criteria');
      setSnackbarOpen(true);
      return;
    }
    setIsPanelOpen(false);
  };
  const handleToiletAreaComparison = async () => {
    if (selectedWards.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select a ward');
      setSnackbarOpen(true);
      return;
    }
    if (toiletAreaComparison.Toilets === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter the Toilet count');
      setSnackbarOpen(true);
      return;
    }
    if (toiletAreaComparison.CarpetArea === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter the Toilet area');
      setSnackbarOpen(true);
      return;
    }
    const result = await getToiletAreaComparison(selectedWards, toiletAreaComparison);
    console.log('Toilet area comparison result', result);
    setTableData(result.data);
    if (result.data.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data found for the selected criteria');
      setSnackbarOpen(true);
      return;
    }
    setIsPanelOpen(false);
  };

  const handleSqFtComparison = async () => {
    if (selectedWards.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('Please select a ward');
      setSnackbarOpen(true);
      return;
    }
    if (percent === '') {
      setSnackbarSeverity('error');
      setReceivedMessage('Please enter the percentage value');
      setSnackbarOpen(true);
      return;
    }
    const result = await getSqFtComparison(selectedWards, percent);
    console.log('SqFt comparison result', result);
    setTableData(result.data);
    if (result.data.length === 0) {
      setSnackbarSeverity('error');
      setReceivedMessage('No data found for the selected criteria');
      setSnackbarOpen(true);
      return;
    }
    setIsPanelOpen(false);
  };

  //fetch ward list
  useEffect(() => {
    const fetchWardList = async () => {
      try {
        const wardlist = await fetchWards();
        const sortedWardList = wardlist.sort((a, b) => a.NewWardNo - b.NewWardNo); // Sort by NewWardNo in ascending order
        console.log('Sorted wardList:', sortedWardList);
        setWardList(sortedWardList);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchWardList();
  }, []);

  //get property description
  useEffect(() => {
    fetchPropertyDescription()
      .then((fetchproperty) => {
        console.log(fetchproperty, 'fetchproperty');
        setPropertyDesc(fetchproperty);
      })
      .catch((error) => {
        console.error('Error fetching property description:', error);
      });
  }, []);

  useEffect(() => {
    console.log('selected desc', selectedDesc);
  }, [selectedDesc]);

  useEffect(() => {
    console.log('selected option', selectedOption);
    setSelectedPhotos({
      photoA: false,
      photoB: false,
      photoC: false,
      photoD: false,
      planPhoto: false,
      all: false
    });
    setFloorOption('');
    setRentChecks({ calculatedRent: false, nonCalculatedRent: false });
    setDupProperty('');
    setHolderListChecks({
      Plot: false,
      Building: false
    });
    setFinanceYear('');
    setBillBookNo('');
  }, [selectedOption]);
  useEffect(() => {
    console.log('flat checks', flatChecks);
  }, [flatChecks, roomNoRepeatChecks, toiletAreaComparison, percent]);

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

  //Bill book data fetch
  useEffect(() => {
    const fetchBillBookEntries = async () => {
      try {
        const data = await getBillBookList();
        console.log('getBillBookList', data);
        setAllBillBookData(data);
      } catch (error) {
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

  return (
    <div>
      <Grid container spacing={2}>
        {/* ASSESSMENT Panel */}
        <Grid item xs={12} sm={6}>
          <MainCard title="ASSESSMENT" style={{ color: '#1677ff', height: '280px', overflowY: 'auto' }}>
            {/* Missing Details */}
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Typography style={{ marginBottom: '0.5rem' }}>Missing Details</Typography>
                  <Select
                    value={selectedOption}
                    onChange={(e) => handleDropdownChange(e)}
                    style={{ width: '450px' }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="Missing Photo Plan">Missing Photo Plan</MenuItem>
                    <MenuItem value="Missing Floor Info/Shop Name/Address/PlotArea">Missing Floor Info/Shop Name/Address/PlotArea</MenuItem>
                    <MenuItem value="Missing PropertyNo">Missing PropertyNo</MenuItem>
                    <MenuItem value="Missing Toilet">Missing Toilet</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Non Taxable List */}
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Typography style={{ marginBottom: '0.5rem' }}>Non Taxable List</Typography>
                  <Select
                    value={selectedOption}
                    onChange={(e) => handleDropdownChange(e)}
                    style={{ width: '450px' }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto',
                          width: '400px'
                        }
                      }
                    }}
                  >
                    <MenuItem value="Property is non taxtable but total tax is greater than zero">
                      Property is non taxtable but total tax is greater than zero
                    </MenuItem>
                    <MenuItem value="Property is taxable but total is zero">Property is taxable but total is zero</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Auto QC */}
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Typography style={{ marginBottom: '0.5rem' }}>Auto QC</Typography>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto',
                          width: '200px'
                        }
                      }
                    }}
                    style={{ width: '450px' }}
                    value={selectedOption}
                    onChange={(e) => handleDropdownChange(e)}
                  >
                    <MenuItem value="Properties having zero carpet area">Properties having zero carpet area</MenuItem>
                    <MenuItem value="Construction Type like 'AR','BR','CR'...etc but Calculated Rent is zero.">
                      Construction Type like "AR","BR","CR"...etc but Calculated Rent is zero.
                    </MenuItem>
                    <MenuItem value="Duplicate Property/Floor List">Duplicate Property/Floor List</MenuItem>
                    <MenuItem value="Old RV has value but total tax is Zero">Old RV has value but total tax is Zero</MenuItem>
                    <MenuItem value="Properties with renter and having rent">Properties with renter and having rent.</MenuItem>
                    <MenuItem value="Old Tax Greater Old RV List.">Old Tax Greater Old RV List.</MenuItem>
                    <MenuItem value="Old Property Without Old Tax and Old RV">Old Property Without Old Tax and Old RV</MenuItem>
                    <MenuItem value="Properties having Old property no. but its Old tax and old RV is zero">
                      Properties having Old property no. but its Old tax and old RV is zero
                    </MenuItem>
                    <MenuItem value="Property Description Mismatch.">Property Description Mismatch.</MenuItem>
                    <MenuItem value="Property have old Tax but Net tax is Zero">Property have old Tax but Net tax is Zero</MenuItem>
                    <MenuItem value="Emp tax is applied on Residential properties.">Emp tax is applied on Residential properties.</MenuItem>
                    <MenuItem value="Emp tax is not applied on Commercial properties">
                      Emp tax is not applied on Commercial properties
                    </MenuItem>
                    <MenuItem value="Edu tax is not applied on Residential properties">
                      Edu tax is not applied on Residential properties
                    </MenuItem>
                    <MenuItem value="Edu tax is not applied on Commercial properties">
                      Edu tax is not applied on Commercial properties
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Recommended By MC */}
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Typography style={{ marginBottom: '0.5rem' }}>Recommended By MC</Typography>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    onChange={(e) => handleDropdownChange(e)}
                    value={selectedOption}
                    style={{ width: '450px' }}
                  >
                    <MenuItem value="Zero Tax Property List">Zero Tax Property List</MenuItem>
                    <MenuItem value="Holder List">Holder List</MenuItem>

                    <MenuItem value="Mutation List">Mutation List</MenuItem>
                    <MenuItem value="Property chart(Main Prop,Oblique Prop,OP)">Property chart(Main Prop,Oblique Prop,OP)</MenuItem>
                    <MenuItem value="Zoning List">Zoning List</MenuItem>
                    <MenuItem value="Properties with Current Appeal Status">Properties with Current Appeal Status</MenuItem>
                    <MenuItem value="Properties in Auto Appeal Committee">Properties in Auto Appeal Committee</MenuItem>
                    <MenuItem value="Properties in Auto Hearing List">Properties in Auto Hearing List</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Assessment QC List */}
            <Grid item xs={12} style={{ marginTop: '5px' }}>
              <Grid item xs={12} sm={8}>
                <FormControl fullWidth>
                  <Typography style={{ marginBottom: '0.5rem' }}>Assessment QC List</Typography>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto',
                          width: '20px'
                        }
                      }
                    }}
                    style={{ width: '450px' }}
                    value={selectedOption}
                    onChange={(e) => handleDropdownChange(e)}
                  >
                    <MenuItem value="Open Plot Properties">Open Plot Properties</MenuItem>
                    <MenuItem value="Oblique Properties List">Oblique Properties List</MenuItem>
                    <MenuItem value="Under Construction Properties">Under Construction Properties</MenuItem>
                    <MenuItem value="TotalTax in Between Given Range">TotalTax in Between Given Range</MenuItem>
                    <MenuItem value="New Total Tax is less than old total tax in Given Range(As per old,0 to 1.5,1.5to 3...etc)">
                      New Total Tax is less than old total tax in Given Range<br/>(As per old,0 to 1.5,1.5to 3...etc)
                    </MenuItem>
                    <MenuItem value="Property Description Wise List.">Property Description Wise List</MenuItem>
                    <MenuItem value="New Total Tax is greater than old total tax in Given Range(as per old,0to 1.5,1.5to 3...etc)">
                      New Total Tax is greater than old total tax in Given Range(as per old,0to 1.5,1.5to 3...etc)
                    </MenuItem>
                    <MenuItem value="Data Entry Gap">Data Entry Gap</MenuItem>

                    <ListSubheader>Flat System</ListSubheader>
                    <MenuItem value="Old carpet area not matching">Old carpet area not matching</MenuItem>
                    <MenuItem value="Old RV not matching">Old RV not matching</MenuItem>
                    <MenuItem value="Old property Tax not matching">Old property Tax not matching</MenuItem>
                    <MenuItem value="Old Total Tax not matching">Old Total Tax not matching</MenuItem>
                    <MenuItem value="New carpet area not matching">New carpet area not matching</MenuItem>
                    <MenuItem value="Toilet count not matching">Toilet count not matching</MenuItem>
                    <MenuItem value="Plot area not matching">Plot area not matching</MenuItem>
                    <MenuItem value="Property description not matching">Property description not matching</MenuItem>
                    <MenuItem value="Construction type not matching">Construction type not matching</MenuItem>
                    <MenuItem value="Construction year not matching">Construction year not matching</MenuItem>
                    <MenuItem value="Tax is not matching">Tax is not matching</MenuItem>
                    <MenuItem value="Second photo is missing">Second photo is missing</MenuItem>
                    <MenuItem value="Apartment/Shop name not matching">Apartment/Shop name not matching</MenuItem>
                    <MenuItem value="Apartment/Shop No is not matching">Apartment/Shop No is not matching</MenuItem>
                    <MenuItem value="Zone not matching">Zone not matching</MenuItem>

                    <MenuItem value="Comparison of room with respect to carpet area">
                      Comparison of room with respect to carpet area
                    </MenuItem>
                    <MenuItem value="Comparison of toilet with respect to total area">
                      Comparison of toilet with respect to total area
                    </MenuItem>
                    <MenuItem value="Comparison of OldSqFt and NewSqFt">Comparison of OldSqFt and NewSqFt</MenuItem>

                    <ListSubheader>Submission</ListSubheader>
                    <MenuItem value="Carpet Area Mismatch">Carpet Area Mismatch</MenuItem>
                    <MenuItem value="RoomNo Mismatch">RoomNo Mismatch</MenuItem>
                    <MenuItem value="Submission Missing">Submission Missing</MenuItem>
                    <MenuItem value="RoomNo Repeat">RoomNo Repeat</MenuItem>
                    <MenuItem value="Length is zero but area is greater than zero">Length is zero but area is greater than zero</MenuItem>
                    <MenuItem value="Length=0 & width=0 & area>0">Length=0 & width=0 & area{'>'}0</MenuItem>
                    <MenuItem value="Area=totalArea and isMinus=Yes">Area=totalArea and isMinus=Yes</MenuItem>
                    <MenuItem value="Utility Having Room Count">Utility Having Room Count</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

        {/* AMC Panel */}
        <Grid item xs={12} sm={6}>
          <MainCard title="AMC" style={{ color: '#1677ff', height: '280px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <Radio checked={selectedOption === 'Missing Invoice No.'} onChange={handleDropdownChange} value="Missing Invoice No." />
                Missing Invoice No.
              </div>

              <div>
                <Radio
                  checked={selectedOption === 'Canceled Invoice Lists'}
                  onChange={handleDropdownChange}
                  value="Canceled Invoice Lists"
                />
                Canceled Invoice Lists
              </div>

              <div>
                <Radio checked={selectedOption === 'Transaction Report'} onChange={handleDropdownChange} value="Transaction Report" />
                Transaction Report
              </div>

              <div>
                <Radio
                  checked={selectedOption === 'Advance Payment Transaction Report'}
                  onChange={handleDropdownChange}
                  value="Advance Payment Transaction Report"
                />
                Advance Payment Transaction Report
              </div>

              <div>
                <Radio checked={selectedOption === 'Bill Book List'} onChange={handleDropdownChange} value="Bill Book List" />
                Bill Book List
              </div>
            </div>
          </MainCard>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} sm={2}>
          <Typography>Select Ward</Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <Select
              multiple
              value={selectedWards} // Bind state here
              onChange={handleWardChange}
              displayEmpty
              disabled={disabledPanels.includes(activePanel)}
              renderValue={(selected) => (selected && selected.length > 0 ? selected.join(', ') : '')}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 150,
                    overflowY: 'auto',
                    width: '50px'
                  }
                }
              }}
            >
              {/* "Select All" Option */}
              <MenuItem value="All">
                <Checkbox checked={wardList.length > 0 && selectedWards.length === wardList.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {/* Wards List */}
              {wardList.map((ward) => (
                <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                  <Checkbox checked={selectedWards.includes(ward.NewWardNo)} />
                  <ListItemText primary={ward.NewWardNo} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleGenerate} variant="contained" color="primary" disabled={disabledPanels.includes(activePanel)}>
              Generate
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClear}>
              Clear
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard style={{ marginTop: '10px', height: '450px' }}>
        <Typography style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '1rem' }}>Selected List Records</Typography>
        <Box
          sx={{
            display: 'flex',

            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            backgroundColor: '#f0f0f0'
          }}
        >
          {/* Show table when tableData has data */}
          {tableData?.length > 0 && (
            <Box
              sx={{
                width: '100%',
                maxHeight: 350,
                overflowX: 'auto',
                overflowY: 'auto',
                border: '1px solid #ccc',
                whiteSpace: 'nowrap'
              }}
            >
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow sx={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff' }}>
                    {Object.keys(tableData[0]).map((header) => (
                      <TableCell key={header}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row, i) => (
                    <TableRow key={i}>
                      {Object.keys(tableData[0]).map((header) => (
                        <TableCell key={header}>{row[header] ?? ''}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {isPanelOpen && activePanel === 'missingPhotoPlan' && (
            <MainCard style={{ height: '250px', width: '400px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography style={{ color: '#1677ff' }}>Select</Typography>
                </Grid>

                {/* First Column */}
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Checkbox checked={selectedPhotos.all} onChange={handleCheckboxPhotoes} name="all" />}
                    label="Select All"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedPhotos.photoA} onChange={handleCheckboxPhotoes} name="photoA" />}
                    label="Photo A"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedPhotos.photoC} onChange={handleCheckboxPhotoes} name="photoC" />}
                    label="Photo C"
                  />
                </Grid>

                {/* Second Column */}
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Checkbox checked={selectedPhotos.planPhoto} onChange={handleCheckboxPhotoes} name="planPhoto" />}
                    label="Plan Photo"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedPhotos.photoB} onChange={handleCheckboxPhotoes} name="photoB" />}
                    label="Photo B"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedPhotos.photoD} onChange={handleCheckboxPhotoes} name="photoD" />}
                    label="Photo D"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center">
                    <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleMissingPhotos}>
                      Ok
                    </Button>

                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'floorInfo' && (
            <MainCard style={{ height: '250px', width: '400px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <FormControl>
                <RadioGroup value={floorOption} onChange={handleFloorInfoCheckbox}>
                  <Grid container spacing={2}>
                    {/* First Column */}
                    <Grid item xs={6}>
                      <FormControlLabel value="option1" control={<Radio />} label="Floor Info" />
                      <FormControlLabel value="option3" control={<Radio />} label="Address (Marathi)" />
                      <FormControlLabel value="option4" control={<Radio />} label="Plot Area" />
                    </Grid>

                    {/* Second Column */}
                    <Grid item xs={6}>
                      <FormControlLabel value="option2" control={<Radio />} label="Shop Name" />
                      <FormControlLabel value="option5" control={<Radio />} label="Mobile No." />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'}>
                  <Button onClick={handleFloorInfo} variant="contained" color="success" style={{ marginRight: '16px' }}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}

          {isPanelOpen && activePanel === 'duplicateProperty' && (
            <MainCard style={{ height: '200px', width: '300px', padding: '16px' }}>
              <Typography style={{ color: '#1677ff', marginBottom: '12px' }}>Select</Typography>

              <FormControl component="fieldset">
                <RadioGroup value={dupProperty} onChange={(e) => setDupProperty(e.target.value)}>
                  <FormControlLabel value="option1" control={<Radio />} label="Duplicate Property" />
                  <FormControlLabel value="option2" control={<Radio />} label="Dublicate Floor" />
                </RadioGroup>
              </FormControl>

              <Box display="flex" justifyContent="center" marginTop={2}>
                <Button onClick={handleDupProperty} variant="contained" color="success" style={{ marginRight: '16px' }}>
                  Ok
                </Button>
                <Button onClick={handleCancel} variant="contained" color="secondary">
                  Cancel
                </Button>
              </Box>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'missingToilet' && (
            <MainCard style={{ height: '200px', width: '300px', padding: '16px' }}>
              <Typography style={{ color: '#1677ff', marginBottom: '12px' }}>Select</Typography>

              <FormControl component="fieldset">
                <RadioGroup value={missingToilet} onChange={(e) => setMissingToilet(e.target.value)}>
                  <FormControlLabel value="option1" control={<Radio />} label="Op Having Toilet" />
                  <FormControlLabel value="option2" control={<Radio />} label="Missing Toilet" />
                </RadioGroup>
              </FormControl>

              <Box display="flex" justifyContent="center" marginTop={2}>
                <Button onClick={handleMissingToilet} variant="contained" color="success" style={{ marginRight: '16px' }}>
                  Ok
                </Button>
                <Button onClick={handleCancel} variant="contained" color="secondary">
                  Cancel
                </Button>
              </Box>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'constructionRentZero' && (
            <MainCard style={{ height: '200px', width: '300px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>

              <FormControl>
                <RadioGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {/* Calculated Rent */}
                      <FormControlLabel
                        control={<Checkbox checked={rentChecks.calculatedRent} onChange={handleRentCheckbox} name="calculatedRent" />}
                        label="Calculated Rent"
                      />

                      {/* Non Calculated Rent */}
                      <FormControlLabel
                        control={<Checkbox checked={rentChecks.nonCalculatedRent} onChange={handleRentCheckbox} name="nonCalculatedRent" />}
                        label="Non Calculated Rent"
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleConstructionRentZero}>
                    Ok
                  </Button>

                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}

          {isPanelOpen && activePanel === 'renterWithRent' && (
            <MainCard style={{ height: '200px', width: '300px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>

              <FormControl>
                <RadioGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {/* Calculated Rent */}
                      <FormControlLabel
                        control={<Checkbox checked={rentChecks.calculatedRent} onChange={handleRentCheckbox} name="calculatedRent" />}
                        label="Calculated Rent"
                      />

                      {/* Non Calculated Rent */}
                      <FormControlLabel
                        control={<Checkbox checked={rentChecks.nonCalculatedRent} onChange={handleRentCheckbox} name="nonCalculatedRent" />}
                        label="Non Calculated Rent"
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handlePropertiesRentZero}>
                    Ok
                  </Button>

                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}

          {isPanelOpen && activePanel === 'holderList' && (
            <MainCard style={{ height: '200px', width: '300px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <FormControl>
                <RadioGroup>
                  <Grid container spacing={2}>
                    {/* First Column */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        value="Plot"
                        control={<Checkbox checked={holderListChecks.Plot} onChange={handleHolderCheckbox} name="Plot" />}
                        label="Plot"
                      />
                      <FormControlLabel
                        value="Building"
                        control={<Checkbox checked={holderListChecks.Building} onChange={handleHolderCheckbox} name="Building" />}
                        label="Building"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={isBothChecked} onChange={handleHolderCheckbox} name="Both" />}
                        label="Both"
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" onClick={handleHolderList} style={{ marginRight: '16px' }}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'calcNonCalcRent' && (
            <MainCard style={{ height: '200px', width: '300px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <FormControl>
                <RadioGroup>
                  <Grid container spacing={2}>
                    {/* First Column */}
                    <Grid item xs={12}>
                      <FormControlLabel value="option1" control={<Checkbox />} label="Calculated Rent" />
                      <FormControlLabel value="option2" control={<Checkbox />} label="Non Calculated Rent" />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'totalTaxRange' && (
            <MainCard style={{ height: '250px', width: '450px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label">Property Description</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <Select
                      multiple
                      value={selectedDesc} // Bind state here
                      onChange={handlePropertyDescChange}
                      displayEmpty
                      renderValue={(selected) =>
                        selected.length > 0
                          ? selected.map((id) => propertyDesc.find((p) => p.PropertyTypeID === id)?.PropertyDescription).join(', ')
                          : ''
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflowY: 'auto',
                            width: '50px'
                          }
                        }
                      }}
                    >
                      {/* "Select All" Option */}
                      {/* <MenuItem value="All">
                        <Checkbox checked={propertyDesc.length > 0 && selectedDesc.length === propertyDesc.length} />
                        <ListItemText primary="Select All" />
                      </MenuItem> */}
                      {/* propertyDesc List */}
                      {propertyDesc.map((desc) => {
                        console.log(desc, 'desc');
                        return (
                          <MenuItem key={desc.PropertyTypeID} value={desc.PropertyTypeID}>
                            <Checkbox checked={selectedDesc.includes(desc.PropertyTypeID)} />
                            <ListItemText primary={desc.PropertyDescription} />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControlLabel
                    control={<Checkbox checked={selectedDesc.length === propertyDesc.length} onChange={handlePropertyDescChange} />}
                    label="All"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={4}>
                  <InputLabel id="property-description-label">From</InputLabel>
                  <TextField
                    name="FromTax"
                    value={taxRange.FromTax}
                    type="number"
                    inputProps={{ min: 0 }}
                    fullWidth
                    onChange={handleTaxChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel id="property-description-label">To</InputLabel>
                  <TextField
                    name="ToTax"
                    value={taxRange.ToTax}
                    type="number"
                    inputProps={{ min: 0 }}
                    fullWidth
                    onChange={handleTaxChange}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleGetTaxBetweenRange}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'newTaxLessOldTax' && (
            <MainCard sx={{ width: 450, padding: 2 }}>
              {/* Title */}
              <Typography sx={{ color: '#1677ff', mb: 2 }}>Select</Typography>

              {/* LABEL + DROPDOWN */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="new-tax-less-old-tax-label">Type</InputLabel>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Select
                    labelId="LessRange-label"
                    fullWidth
                    value={compareValue}
                    onChange={handleCompareChange}
                    sx={{
                      border: '2px solid #ccc',
                      maxHeight: '80px',
                      overflowY: 'auto'
                    }}
                  >
                    <MenuItem value="Less than old Tax X Times">Less than old Tax 'X' Times</MenuItem>
                    <MenuItem value="Less Than Old Tax">Less Than Old Tax</MenuItem>
                    <MenuItem value="1 to 1.5 times">1 to 1.5 times</MenuItem>
                    <MenuItem value="1.5 to 3 times">1.5 to 3 times</MenuItem>
                    <MenuItem value="3 to 5 times">3 to 5 times</MenuItem>
                    <MenuItem value="5 to 10 times">5 to 10 times</MenuItem>
                    <MenuItem value="Above 10">Above 10</MenuItem>
                    <MenuItem value="All Comparison">All Comparison</MenuItem>
                  </Select>
                </Grid>

                {/* X INPUT FIELD */}
                {compareValue === 'Less than old Tax X Times' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <InputLabel>Enter X Value</InputLabel>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={xValue}
                        onChange={(e) => setXValue(e.target.value)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                  </>
                )}

                {/* BUTTONS */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Button variant="contained" color="success" onClick={handleGetNewTaxLessOldTax}>
                      Ok
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'newTaxGreaterOldTax' && (
            <MainCard sx={{ width: 450, padding: 2 }}>
              {/* Title */}
              <Typography sx={{ color: '#1677ff', mb: 2 }}>Select</Typography>

              {/* LABEL + DROPDOWN */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="new-tax-greater-old-tax-label">Type</InputLabel>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Select
                    labelId="LessRange-label"
                    fullWidth
                    value={compareValue}
                    onChange={handleCompareChange}
                    sx={{
                      border: '2px solid #ccc',
                      maxHeight: '80px',
                      overflowY: 'auto'
                    }}
                  >
                    <MenuItem value="Greater than old Tax X Times">Greater than old Tax 'X' Times</MenuItem>
                    <MenuItem value="Greater Than Old Tax">Greater Than Old Tax</MenuItem>
                    <MenuItem value="1 to 1.5 times">1 to 1.5 times</MenuItem>
                    <MenuItem value="1.5 to 3 times">1.5 to 3 times</MenuItem>
                    <MenuItem value="3 to 5 times">3 to 5 times</MenuItem>
                    <MenuItem value="5 to 10 times">5 to 10 times</MenuItem>
                    <MenuItem value="Above 10">Above 10</MenuItem>
                    <MenuItem value="All Comparison">All Comparison</MenuItem>
                  </Select>
                </Grid>

                {/* X INPUT FIELD */}
                {compareValue === 'Greater than old Tax X Times' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <InputLabel>Enter X Value</InputLabel>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={xValue}
                        onChange={(e) => setXValue(e.target.value)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                  </>
                )}

                {/* BUTTONS */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" gap={2} mt={2}>
                    <Button variant="contained" color="success" onClick={handleGetNewTaxGreaterOldTax}>
                      Ok
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </MainCard>
          )}

          {isPanelOpen && activePanel === 'propertyDescWise' && (
            <MainCard style={{ height: '350px', width: '400px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label">Property Type</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Select
                    labelId="property-description-label"
                    multiple
                    style={{
                      maxHeight: '130px',
                      overflowY: 'auto',
                      border: '2px solid #ccc',
                      width: '160px'
                    }}
                    value={selectedTypes} // This should be array of PropertyTypeID
                    onChange={handleChangeList}
                    renderValue={(selected) =>
                      selected.map((id) => propertyDesc.find((desc) => desc.PropertyTypeID === id)?.PropertyDescription).join(', ')
                    }
                  >
                    {propertyDesc.map((desc) => (
                      <MenuItem key={desc.PropertyTypeID} value={desc.PropertyTypeID}>
                        <Checkbox checked={selectedTypes.includes(desc.PropertyTypeID)} />
                        <ListItemText primary={desc.PropertyDescription} />
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handlePropertyDescWise}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}
          {/* {isPanelOpen && activePanel === 'newTaxGreaterOldTax' && (
            <MainCard style={{ height: '250px', width: '450px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> Property Type</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Select
                    labelId="property-description-label"
                    multiple
                    style={{
                      maxHeight: '130px',
                      overflowY: 'auto',
                      border: '2px solid #ccc',
                      width: '160px'
                    }}
                    value={selectedTypes}
                    onChange={handleChangeList}
                  >
                    <MenuItem>A</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )} */}
          {isPanelOpen &&
            (activePanel === 'oldCarpetAreaMismatch' ||
              activePanel === 'oldRVMismatch' ||
              activePanel === 'oldPropertyTaxMismatch' ||
              activePanel === 'plotAreaMismatch' ||
              activePanel === 'secondPhotoMissing' ||
              activePanel === 'oldTotalTaxMismatch' ||
              activePanel === 'propertyDescMismatchFlat' ||
              activePanel === 'apartmentNameMismatch' ||
              activePanel === 'newCarpetAreaMismatch' ||
              activePanel === 'constructionTypeMismatch' ||
              activePanel === 'taxMismatch' ||
              activePanel === 'apartmentNoMismatch' ||
              activePanel === 'toiletCountMismatch' ||
              activePanel === 'constructionYearMismatch' ||
              activePanel === 'zoneMismatch') && (
              <MainCard style={{ height: '350px', width: '550px' }}>
                <Grid item xs={12}>
                  <Typography style={{ color: '#1677ff' }}>Select</Typography>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '2px' }}>
                  <Grid item xs={12} sm={5}>
                    <InputLabel id="property-description-label"> Ward</InputLabel>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField value={flatChecks.wardNo} onChange={(e) => setFlatChecks((pre) => ({ ...pre, wardNo: e.target.value }))} />
                  </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '2px' }}>
                  {/* From Property */}
                  <Grid item xs={6}>
                    <InputLabel id="property-description-label">From Prop</InputLabel>
                    <TextField
                      fullWidth
                      value={flatChecks.fromProp}
                      onChange={(e) => setFlatChecks((pre) => ({ ...pre, fromProp: e.target.value }))}
                    />
                  </Grid>
                  {/* To Property */}
                  <Grid item xs={6}>
                    <InputLabel id="property-description-label">To Prop</InputLabel>
                    <TextField
                      fullWidth
                      value={flatChecks.toProp}
                      onChange={(e) => setFlatChecks((pre) => ({ ...pre, toProp: e.target.value }))}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} style={{ marginTop: '2px' }}>
                  {/* From Property */}
                  <Grid item xs={6}>
                    <InputLabel id="property-description-label">BHk</InputLabel>
                    <Select
                      labelId="bhk-label"
                      fullWidth
                      value={flatChecks.bhk}
                      disabled={flatChecks.allBhk}
                      onChange={(e) => setFlatChecks((pre) => ({ ...pre, bhk: e.target.value }))}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num} BHK
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  {/* To Property */}
                  <Grid item xs={6}>
                    <InputLabel id="property-description-label">All BHK</InputLabel>
                    <Checkbox
                      fullWidth
                      checked={flatChecks.allBhk}
                      onClick={() => setFlatChecks((pre) => ({ ...pre, bhk: '', allBhk: !pre.allBhk }))}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                    <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleFlatDetails}>
                      Ok
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </MainCard>
            )}
          {isPanelOpen && activePanel === 'roomCarpetComparison' && (
            <MainCard style={{ height: '350px', width: '550px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> Rooms</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    value={roomNoRepeatChecks.rooms}
                    onChange={(e) => setRoomNoRepeatChecks((pre) => ({ ...pre, rooms: e.target.value }))}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> CarpetArea</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    value={roomNoRepeatChecks.carpetArea}
                    onChange={(e) => setRoomNoRepeatChecks((pre) => ({ ...pre, carpetArea: e.target.value }))}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleRoomCarpetComparison}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'toiletAreaComparison' && (
            <MainCard style={{ height: '350px', width: '550px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> Toilets</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    value={toiletAreaComparison.Toilets}
                    onChange={(e) => setToiletAreaComparison((pre) => ({ ...pre, Toilets: e.target.value }))}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> CarpetArea</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    value={toiletAreaComparison.CarpetArea}
                    onChange={(e) => setToiletAreaComparison((pre) => ({ ...pre, CarpetArea: e.target.value }))}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleToiletAreaComparison}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && activePanel === 'sqFtComparison' && (
            <MainCard style={{ height: '350px', width: '550px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Select</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> Percent</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField value={percent} onChange={(e) => setPercent(e.target.value)} />
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleSqFtComparison}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary">
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && (activePanel == 'missingInvoiceNo' || activePanel == 'canceledInvoice') && (
            <MainCard style={{ height: '250px', width: '300px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Missing Invoices</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> Year</InputLabel>
                </Grid>
                <Grid item xs={12} sm={7}>
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
                    style={{ width: '150px' }}
                  >
                    {/* Add a "None" option */}
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {yearTrans.map((financeYear, index) => (
                      <MenuItem key={index} value={financeYear.FinanceYear}>
                        {financeYear.FinanceYear}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> Bill Book No</InputLabel>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Select
                    id="billBook-select"
                    value={billBookNo}
                    onChange={handleBillBookNo}
                    renderValue={() => (billBookNo === 'All' ? selectedBillBooks.join(', ') : billBookNo)}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 150, overflowY: 'auto' } }
                    }}
                    style={{ width: '150px' }}
                  >
                    <MenuItem value="All">All</MenuItem>

                    {billBookNoList.map((bill, index) => (
                      <MenuItem key={index} value={bill}>
                        {bill}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleInvoiceReport}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}

          {isPanelOpen && activePanel == 'transactionReport' && (
            <MainCard style={{ height: '250px', width: '300px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Transaction Report</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> Year</InputLabel>
                </Grid>
                <Grid item xs={12} sm={7}>
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
                    style={{ width: '150px' }}
                  >
                    {/* Add a "None" option */}
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {yearTrans.map((financeYear, index) => (
                      <MenuItem key={index} value={financeYear.FinanceYear}>
                        {financeYear.FinanceYear}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid container spacing={1} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="secondary" onClick={() => handleTransactionReport('Current')}>
                    Current
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" color="success" onClick={() => handleTransactionReport('Pending')}>
                    Pendings
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          )}
          {isPanelOpen && (activePanel == 'advancePaymentReport' || activePanel == 'billBookList') && (
            <MainCard style={{ height: '200px', width: '350px' }}>
              <Grid item xs={12}>
                <Typography style={{ color: '#1677ff' }}>Adv. Transaction Report</Typography>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '2px' }}>
                <Grid item xs={12} sm={5}>
                  <InputLabel id="property-description-label"> Year</InputLabel>
                </Grid>
                <Grid item xs={12} sm={7}>
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
                    style={{ width: '150px' }}
                  >
                    {/* Add a "None" option */}
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {yearTrans.map((financeYear, index) => (
                      <MenuItem key={index} value={financeYear.FinanceYear}>
                        {financeYear.FinanceYear}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent={'center'} style={{ marginTop: '10px' }}>
                  <Button variant="contained" color="success" style={{ marginRight: '16px' }} onClick={handleAdvanceAndBillBookReport}>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </MainCard>
          )}
        </Box>
      </MainCard>

      <Grid item xs={12} sm={4} style={{ marginTop: '10px' }}>
        <Stack spacing={1} alignItems="center">
          <Button variant="contained" color="primary" onClick={generateExcel}>
            Generate Excel Sheet
          </Button>
        </Stack>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          sx={{
            bgcolor: snackbarSeverity === 'success' ? 'success.main' : snackbarSeverity === 'error' ? 'error.main' : 'warning.main'
          }}
          message={receivedMessage}
        />
      </Snackbar>
      <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
export default QC;
