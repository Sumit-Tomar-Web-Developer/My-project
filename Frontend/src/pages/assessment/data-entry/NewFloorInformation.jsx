import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Button,
  Box,
  Checkbox,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  Typography,
  SnackbarContent,
  FormControl,
  FormHelperText,
  DialogContentText
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';

import * as Yup from 'yup';
import { Table, TableBody, TableCell, ListItemText, TableContainer, TableHead, TableRow } from '@mui/material';
import { useRef, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import EditTwoTone from '@ant-design/icons/EditTwoTone';
import SendOutlined from '@ant-design/icons/SendOutlined';
import IconButton from 'components/@extended/IconButton';
import { useEffect } from 'react';
import { fetchConstructionType } from 'services/construction.services';
import { fetchNewFloor } from 'services/floorMaster.service';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPropertyDetailsNew,
  setFloorSubmissionDetailsMinusData,
  setFloorSubmissionDetailsInitialData,
  setPropertyMastFormDataEntry,
  setDeletedPDNIdsExistingProperty,
  clearFloorSubmissionDetailsMinusData,
  deletePropertyDetailsNew,
  deletefloorSubmissionDetailsMinusData,
  deletefloorSubmissionDetailsInitialData,
  setDeletedFloorSubmisionMinusExistingProperty,
  setDeletedFloorSubmisionExistingProperty
} from 'state/reducers/ExistingPropertySlice';
import { getOldTypeOfUseList } from 'services/masterServices/typeOfUseServices/typeOfUse.service';
import { fetchFloorRoomNo, fetchRoomShapes } from 'services/data-entry.services';
import translateText from '../../../utils/translator';
import { selectCapitalValue } from 'state/reducers/totalValution/capitalValueAssessment';
import {
  fetchGroupList,
  fetchRoomTypeMaster,
  fetchTypeDescByGroupId,
  insertNonTaxableTypeOfUse,
  checkPDNIdForGenerating,
  checkFSDIdForGenerating,
  checkFSDMDIdForGenerating,
  premissionCheckForSubmission
} from 'services/assessmentService/DataEntryService/dataEntryService';
import dayjs from 'dayjs';
import { useMemo } from 'react';
export default function NewFloorInformation({ openPlotState, isNewProperty, selectedOwnerID }) {
  const allFlorData = useSelector((state) => state.combinedDataEntry.combinedData.propertyDetailsNew);
  // const PropertyMastInitialData = useSelector((state) => state.combinedDataEntry.combinedData.propertyMast);
  const dataPDNIdWise = useSelector((state) => state.combinedDataEntry.combinedData.floorSubmissionDetails);
  const dataFSDIdWise = useSelector((state) => state.combinedDataEntry.combinedData.floorSubmissionDetailsMinusData);
  const accessLevel = useSelector((state) => state.accessLevel.value);
  const capitalValue = useSelector((state) => state.setPolicies.capitalValue);
  const propertyMast = useSelector((state) => state.combinedDataEntry.combinedData.propertyMast) || {};

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogIsMinus, setOpenDialogIsMinus] = useState(false);
  const [TypeOFUsePrimeList, setTypeOFUsePrimeList] = useState([
    { Type: 'R', Description: 'निवासी' },
    { Type: 'C', Description: 'अनिवासी' },
    { Type: 'I', Description: 'औदयोगिक' }
  ]);
  // const [floorRoomList, setFloorRoomList] = useState([]);
  const [roomShapeList, setRoomShapeList] = useState([]);
  const [constructionTypeList, setConstructionTypeList] = useState([]);
  const [floorList, setFloorList] = useState([]);
  const [BuildUpAreaSqFeet, setBuildUpAreaSqFeet] = useState(0);
  const [BuildUpAreaSqMeter, setBuildUpAreaSqMeter] = useState(0);
  const [total, setTotal] = useState(0);
  // const [availableRoomsCount, setAvailableRoomsCount] = useState(0);
  const [newFloorCopiedData, setNewFloorCopiedData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  //  // Set of room
  const [isValidRooms, setIsValidRooms] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [tableMinusData, setTableMinusData] = useState([]);
  const [errors, setErrors] = useState({});
  //formule
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [shape, setShape] = useState('');

  //roomwise
  const [area, setArea] = useState(0);
  //minus data area
  const [Area, setIsMinusArea] = useState('');
  // const [areaProperty, setAreaProperty] = useState(0);
  const [isMinus, setIsMinus] = useState(0);
  const [isOuter, setIsOuter] = useState('No');
  const [minusArea, setMinusArea] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [propertyNewDetails, setPropertyNewDetails] = useState({
    OwnerID: selectedOwnerID,
    PDNId: 0,
    FloorID: '',
    ConstructionType: '',
    TypeOFUse: '',
    GroupId: '0',
    ConstructionYear: '',
    NoOfRooms: '',
    CarpetAreaSqFeet: '',
    CarpetAreaSqMeter: '',
    BuildUpAreaSqFeet: '',
    BuildUpAreaSqMeter: '',
    Room: 0,
    Registration: 0,
    RenterYesNO: 0,
    OccupierYesNo: null,
    OccupierName: '',
    OccupierNameMarathi: '',
    RenterName: '',
    RenterNameMarathi: '',
    Rent: 0,
    NonCalculateRent: 0,
    AgreementDate: null,
    AgreementToDate: null
  });
  const [floorSubmissionDetails, setFloorSubmissionDetails] = useState({
    OwnerID: 0,
    FSDId: 0,
    Length: 0,
    Width: 0,
    Height: 0,
    Area: 0,
    NoOfRooms: 0,
    TotalArea: 0,
    RoomNo: [],
    InnerOuter: 'No',
    isMinus: 0,
    RoomShapeName: '',
    SmallBase: 0,
    LargeBase: 0,
    Radius: 0,
    length_a: 0,
    length_b: 0,
    length_c: 0,
    RoomType: ''
  });
  const [FloorSubmissionDetailsMinus, setFloorSubmissionDetailsMinus] = useState({});
  const [minusErrors, setMinusErrors] = useState({});
  const [currentFSDId, setCurrentFSDId] = useState(null);
  const [selectedItemMinus, setSelectedItemMinus] = useState(null);
  const [openDeleteDialogMinus, setOpenDeleteDialogMinus] = useState(false);
  const [propertyDetailsTableData, setPropertyDetailsTableData] = useState([]);
  const [rowToDeleteMinus, setRowToDeleteMinus] = useState({});
  const [rowToDelete, setRowToDelete] = useState({});
  const [floorSubmissionDetailsDialogDelete, setFloorSubmissionDetailsDialogDelete] = useState(false);
  const [adjustedAreaTotal, setAdjustedAreaTotal] = useState(0);

  const [minusAreaTotal, setMinusAreaTotal] = useState(0);

  const [pdnId, setPdnId] = useState(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPDNId, setSelectedPDNId] = useState(null);

  const [roomCount, setRoomCount] = useState(1);
  const [singleRoomArea, setSingleRoomArea] = useState('');
  const [singleUpdateRoomArea, setSingleUpdateRoomArea] = useState('');

  const [propertyMastLocal, setPropertyMastLocal] = useState({
    OpenPlotType: '0',
    OpenPlotOccupierName: '',
    OpenPlotOccupierMarathiName: '',
    OpenPlotLength: 0,
    OpenPlotWidth: 0
  });
  const [openDialogDeleteIsMinus, setOpenDialogDeleteIsMinus] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [minusShape, setMinusShape] = useState('');
  const [selectedMinusShape, setSelectedMinusShape] = useState(null);
  const [typeOfUseList, setTypeOfUseList] = useState([]);
  const [typeOfUseListFilter, setTypeOfUseListFilter] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [calculatedArea, setCalculatedArea] = useState();
  const isRenter = propertyNewDetails.RenterYesNO === 1;
  const isOccupier = propertyNewDetails.OccupierYesNo === 1;
  const [submissionPermission, setSubmissionPermission] = useState(false);
  const [isSubMeter, setIsSubMeter] = useState(false);
  const [typeOFUseFocused, setTypeOFUseFocused] = useState(false);
  const [typeOFConstruction, setTypeOFConstruction] = useState(false);
  const [typeOFGroup, setTypeOFGroup] = useState(false);

  useEffect(() => {
    const fetchPermission = async () => {
      const fetchSubmissionPermission = await premissionCheckForSubmission();
      setSubmissionPermission(fetchSubmissionPermission.data.permission.IsSubOnDataEntry);
      setIsSubMeter(fetchSubmissionPermission.data.permission.IsSubOnMeter);
      console.log(fetchSubmissionPermission, 'fetchSubmissionPermission');
    };
    fetchPermission();
  }, []);

  useEffect(() => {
    if (isNewProperty) {
      resetFields();
      setPropertyNewDetails({
        OwnerID: selectedOwnerID,
        PDNId: 0,
        FloorID: '',
        ConstructionType: '',
        TypeOFUse: '',
        GroupId: '',
        ConstructionYear: '',
        NoOfRooms: '',
        CarpetAreaSqFeet: '',
        CarpetAreaSqMeter: '',
        BuildUpAreaSqFeet: '',
        BuildUpAreaSqMeter: '',
        Room: 0,
        Registration: 0,
        RenterYesNO: 0,
        OccupierYesNo: null,
        OccupierName: '',
        OccupierNameMarathi: '',
        RenterName: '',
        RenterNameMarathi: '',
        Rent: 0,
        NonCalculateRent: 0,
        AgreementDate: null,
        AgreementToDate: null
      });
      dispatch?.(setFloorSubmissionDetailsMinusData?.([]));
      dispatch(setFloorSubmissionDetailsInitialData([]));
      dispatch(setPropertyDetailsNew([]));
    }
  }, [isNewProperty]);

  useEffect(() => {
    console.log(allFlorData, 'allFlorData');
    setPropertyDetailsTableData(allFlorData); // Arranging Floor Wise Data
  }, [allFlorData]);

  useEffect(() => {
    setTableData(dataPDNIdWise);
  }, [dataPDNIdWise]);

  useEffect(() => {
    console.log(dataFSDIdWise, 'dataFSDIdWise');
    setTableMinusData(dataFSDIdWise);
  }, [dataFSDIdWise]);
  useEffect(() => {
    console.log(submissionPermission, 'submissionPermission');
  }, [calculatedArea, rowToDeleteMinus, rowToDelete, isSubMeter, submissionPermission]);

  useEffect(() => {
    if (!pdnId) {
      const generatePDNId = async () => {
        const newId = Math.floor(Math.random() * 1e9);
        try {
          if (newId) {
            const pdnIdCheck = await checkPDNIdForGenerating(newId);

            console.log(pdnIdCheck, newId, 'pdnIdCheck');

            if (pdnIdCheck === 'Already Exists') {
              return generatePDNId();
            }

            setPdnId(newId);
            console.log('✅ PDNId generated:', newId);
          }
        } catch (error) {
          console.error('error in generating PDNId', error);
        }
      };

      generatePDNId();
    }
  }, [pdnId]);

  useEffect(() => {
    console.log(selectedOwnerID, typeOFConstruction, typeOFUseFocused, 'selectedOwnerID, typeOFConstruction, typeOFUseFocused');
  }, [selectedOwnerID, typeOFConstruction, typeOFUseFocused]);

  useEffect(() => {
    const getRoomTypes = async () => {
      try {
        const data = await fetchRoomTypeMaster();
        setRoomTypeList(data);
      } catch (error) {
        console.error('Failed to load room types:', error);
      }
    };

    getRoomTypes();
  }, []);

  const handleCancelMinus = () => {
    setTotal((prev) => prev + (minusArea || 0));

    // Reset UI values
    setIsMinusArea(0);
    setMinusArea(0);
    setMinusShape('');
    //setSelectedRooms([]);
    setSelectedItem(null);
    // Reset Existing Property minus fields
    setFloorSubmissionDetailsMinus({
      OwnerID: 0,
      FSDMDId: '',
      Length: '',
      Width: '',
      Height: '',
      Area: '',
      SmallBase: '',
      LargeBase: '',
      Radius: '',
      length_a: '',
      length_b: '',
      length_c: '',
      TotalArea: ''
    });
  };

  const calculateAreaFromShape = (shapeObj, data) => {
    if (!shapeObj || !shapeObj.Formula) return 0;

    try {
      let formula = shapeObj.Formula;
      if (shapeObj?.RoomShapeName.startsWith('Non')) {
        console.log(shapeObj?.RoomShapeName, 'formula for minus');
        const a = toInches(data.length_a);
        const b = toInches(data.length_b);
        const c = toInches(data.length_c);

        if (a && b && c) {
          const s = (a + b + c) / 2;
          console.log(s, 'result for minus');
          const result = Math.sqrt(s * (s - a) * (s - b) * (s - c));
          console.log(result, 'result for minus');
          return isNaN(result) ? 0 : parseFloat(sqInchToSqFeet(result).toFixed(2));
        }
        return 0;
      }

      // ✅ Normal formula handling (replace variables with inch values)
      Object.keys(data).forEach((key) => {
        let value = parseFloat(data[key]) || 0;

        // convert only length/width/height/radius type fields to inches
        if (['Length', 'Width', 'Height', 'SmallBase', 'LargeBase', 'Radius', 'length_a', 'length_b', 'length_c'].includes(key)) {
          value = toInches(value);
        }

        const regex = new RegExp(`\\b${key}\\b`, 'gi'); // case-insensitive replace
        formula = formula.replace(regex, value);
      });

      // eslint-disable-next-line no-eval
      const result = eval(formula);

      // ✅ convert result (sq in → sq ft)
      return isNaN(result) ? 0 : parseFloat(sqInchToSqFeet(result).toFixed(2));
    } catch (err) {
      console.error('Error calculating area:', err, shapeObj.Formula, data);
      return 0;
    }
  };
  // must be async because we call the server
  const generateUniqueFSDMDId = async () => {
    while (true) {
      const newId = Math.floor(Math.random() * 1e9);
      try {
        if (newId) {
          const check = await checkFSDMDIdForGenerating(newId);
          // e.g. check returns { message: "Already Exists" } or { message: "Available" }
          if (check?.message !== 'Already Exists') {
            return newId;
          }
        }
        // otherwise loop again and try another random ID
      } catch (err) {
        console.error('Error checking FSDMDId:', err);
        return newId; // fallback: just return it
      }
    }
  };
  const generateUniqueFSDId = async () => {
    while (true) {
      const newId = Math.floor(Math.random() * 1e9);
      try {
        if (newId) {
          const check = await checkFSDIdForGenerating(newId);
          // e.g. check returns { message: "Already Exists" } or { message: "Available" }
          if (check?.message !== 'Already Exists') {
            return newId; // ✅ unique
          }
        }
        // otherwise loop again and try another random ID
      } catch (err) {
        console.error('Error checking FSDMDId:', err);
        return newId; // fallback: just return it
      }
    }
  };

  const handleAddMinus = async () => {
    const source = FloorSubmissionDetailsMinus || {};

    // 1️⃣ Require a shape selected
    if (!minusShape) {
      setSnackbarMessage('❌ Please select a shape');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // 2️⃣ Validate shapeObj
    const shapeObj = roomShapeList.find((s) => String(s.ShapeID) === String(minusShape));
    console.log(shapeObj, 'shapeObj');
    if (!shapeObj) {
      setSnackbarMessage('❌ Invalid shape selected');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // 3️⃣ Build numeric rowData for relevant fields
    const relevantFields = shapeObj.Fields;
    const rowData = {};
    relevantFields.forEach((field) => {
      const raw = source[field];
      const n = parseFloat(String(raw ?? '').replace(/,/g, ''));
      rowData[field] = Number.isFinite(n) ? n : 0;
    });

    console.log(relevantFields, 'relevantFields');
    const missingFields = {};
    relevantFields.forEach((field) => {
      const val = rowData[field];
      console.log(val, 'val');
      if (val == undefined || val == null || String(val).trim() == '' || !Number.isFinite(Number(val)) || val == 0) {
        missingFields[field] = `Please enter ${field}`;
      }
    });
    if (Object.keys(missingFields).length > 0) {
      setMinusErrors(missingFields);
      return;
    }

    // 2️⃣ Dimension check — only if same shape name

    const floorShapeName = floorSubmissionDetails?.RoomShapeName;

    const minusShapeName = roomShapeList.filter((row) => row?.ShapeID == minusShape);

    if (
      floorShapeName &&
      minusShapeName[0]?.RoomShapeName &&
      String(floorShapeName).trim().toLowerCase() === String(minusShapeName[0]?.RoomShapeName).trim().toLowerCase()
    ) {
      const dimensionErrors = {};
      const compareFields = ['Length', 'Width', 'Height', 'SmallBase', 'LargeBase', 'Radius', 'length_a', 'length_b', 'length_c'];

      compareFields.forEach((field) => {
        const floorValRaw = floorSubmissionDetails?.[field];
        const minusValRaw = rowData[field];

        const maxAllowed = Number(String(floorValRaw ?? '').replace(/,/g, ''));
        const minusVal = Number(String(minusValRaw ?? '').replace(/,/g, ''));

        if (Number.isFinite(maxAllowed) && Number.isFinite(minusVal) && minusVal > maxAllowed) {
          dimensionErrors[field] = `${field} cannot be greater than room ${field} (${maxAllowed})`;
        }
      });

      if (Object.keys(dimensionErrors).length > 0) {
        setMinusErrors((prev) => ({ ...prev, ...dimensionErrors }));
        setSnackbarMessage('❌ Some values exceed the room’s dimensions');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
    }

    // 6️⃣ Clear previous minus errors
    setMinusErrors({});

    // 7️⃣ Calculate area
    let calculatedMinusArea = 0;
    try {
      calculatedMinusArea = calculateAreaFromShape(shapeObj, rowData);
      console.log(calculatedMinusArea, 'calculatedMinusArea');
      if (!Number.isFinite(calculatedMinusArea)) calculatedMinusArea = 0;
    } catch (err) {
      console.error('Area calculation failed:', err);
      setSnackbarMessage('❌ Failed to calculate area');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    const roundedArea = parseFloat(calculatedMinusArea.toFixed(2));

    // 8️⃣ Compose entry with unique FSDMDId
    const fsdmdId = selectedItemMinus?.FSDMDId || (await generateUniqueFSDMDId());
    const newEntry = {
      ...rowData,
      FSDMDId: fsdmdId,
      Area: roundedArea,
      TotalArea: roundedArea,
      FSDId: currentFSDId,
      RoomShapeName: shapeObj?.RoomShapeName || '',
      ShapeID: minusShape,
      RoomCount: selectedRooms?.length || 1,
      OwnerID: selectedOwnerID || 0,
      IsConfirmed: false,
      Insert: !selectedItemMinus,
      Update: !!selectedItemMinus,
      isMinus: 1
    };

    const minusArea = roundedArea * floorSubmissionDetails.RoomNo.length;
    console.log(minusArea, 'calculated');
    if (minusArea >= calculatedArea) {
      setSnackbarMessage(`❌ Minus total area cannot be greater than or equal to Floor total area`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    // 🔟 Insert or update minus table in state/Redux
    setTableMinusData((prev = []) => {
      const idx = prev.findIndex((item) => item?.FSDMDId === newEntry.FSDMDId);
      let updated;
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = { ...updated[idx], ...newEntry, Insert: false, Update: true };
      } else {
        updated = [...prev, { ...newEntry, Insert: true, Update: false }];
      }

      try {
        dispatch?.(setFloorSubmissionDetailsMinusData?.({ newData: updated }));
      } catch (err) {
        // optional dispatch - ignore if undefined
      }
      return updated;
    });

    // 1️⃣1️⃣ Persist the FSDId back into the minus form source
    if (typeof setFloorSubmissionDetailsMinus === 'function') {
      setFloorSubmissionDetailsMinus((prev) => ({
        ...(prev || {}),
        FSDId: currentFSDId
      }));
    } else if (typeof setFloorSubmissionDetails === 'function') {
      setFloorSubmissionDetails((prev) => ({
        ...(prev || {}),
        FSDId: currentFSDId
      }));
    }

    // 1️⃣2️⃣ Reset UI fields
    setFloorSubmissionDetailsMinus?.(() => ({
      FSDMDId: '',
      Length: '',
      Width: '',
      Height: '',
      Area: '',
      SmallBase: '',
      LargeBase: '',
      Radius: '',
      length_a: '',
      length_b: '',
      length_c: '',
      TotalArea: ''
    }));
    setIsMinusArea?.(0);
    setMinusArea?.(0);
    setMinusShape?.('');
    setSelectedMinusShape('');
    setSelectedItemMinus?.(null);

    // 1️⃣3️⃣ Show success snackbar
    setSnackbarMessage('✅ Minus area added/updated');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleFloorSubmissionMinusChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...FloorSubmissionDetailsMinus,
      [name]: value
    };

    // Shape object find karo
    const shapeObj = roomShapeList.find((s) => String(s.ShapeID) === String(minusShape));

    // Pehle area calculate karo
    const calculatedArea = calculateAreaFromShape(shapeObj, updated);

    // Area ko 2 decimal tak round karo
    const roundedArea = calculatedArea ? parseFloat(calculatedArea.toFixed(2)) : 0;

    setFloorSubmissionDetailsMinus({
      ...updated,
      Area: roundedArea
    });

    setMinusArea(roundedArea);
  };

  // Function to handle input changes
  const handleFloorSubmissionChange = (e) => {
    const { name, value } = e.target;

    // Prevent 0 values for shape fields
    if (['Length', 'Width', 'Height', 'SmallBase', 'LargeBase', 'Radius', 'length_a', 'length_b', 'length_c'].includes(name)) {
      if (parseFloat(value) === 0) {
        alert(`${name} should be greater than 0`);
        return;
      }
    }

    setFloorSubmissionDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleEditMinusRow = (row) => {
    // :one: Resolve the shape ID (handle both ID or name)
    let resolvedShapeId = row.ShapeID || row.RoomShapeID || '';
    if (!resolvedShapeId && row.RoomShapeName) {
      const found = roomShapeList.find((s) => s.RoomShapeName.toLowerCase() === row.RoomShapeName.toLowerCase());
      resolvedShapeId = found?.ShapeID || '';
    }
    const selectedShape = roomShapeList.find((s) => String(s.ShapeID) === String(resolvedShapeId));
    // :two: Normalize the row for editing
    const normalized = {
      ...row,
      RoomShapeID: resolvedShapeId || '',
      RoomShapeName: row.RoomShapeName || '',
      Area: Number(row.Area) || 0
    };
    // :three: Reset all shape-specific fields
    const allShapeFields = ['Length', 'Width', 'Height', 'SmallBase', 'LargeBase', 'Radius', 'length_a', 'length_b', 'length_c'];
    allShapeFields.forEach((f) => (normalized[f] = 0));

    // :four: Keep only relevant fields for this shape
    (selectedShape?.Fields || []).forEach((field) => {
      normalized[field] = row[field] ?? 0;
    });
    // :five: Set Minus-specific state so handleAddMinus knows it’s an edit
    setSelectedItemMinus(normalized);
    setMinusShape(normalized.RoomShapeID);
    setFloorSubmissionDetailsMinus(normalized);
    setFloorSubmissionDetailsMinus(normalized);

    // :six: Set current floor ID and total area
    //  setCurrentFSDId(row.FSDId);
    setTotal(normalized.TotalArea || 0);
    // :seven: Inner/Outer flags
    if (row.InnerOuter === 'Yes' || row.InnerOuter === 'No') {
      setIsOuter(row.InnerOuter);
      setIsOuter(row.InnerOuter);
    }
    // :eight: Open the Minus edit dialog
    setOpenDialogIsMinus(true);
  };

  const handleDeleteIsMinusRow = (row) => {
    console.log('delete requested:', row);

    if (!row || row.FSDMDId === undefined || row.FSDMDId === null) {
      console.warn('handleDeleteIsMinusRow: invalid row or missing FSDMDId', row);
      return;
    }

    const idToRemove = String(row.FSDMDId);

    // defensive copy & filter out the row to delete
    const existing = Array.isArray(tableMinusData) ? tableMinusData : [];
    const updated = existing.filter((r) => String(r?.FSDMDId) !== idToRemove);

    // if nothing changed, bail out
    if (updated.length === existing.length) {
      console.warn('handleDeleteIsMinusRow: no matching row found to delete', idToRemove);
      return;
    }

    // set local state
    setTableMinusData(updated);

    // optional: sync to redux if your actions exist
    try {
      dispatch(deletefloorSubmissionDetailsMinusData({ id: idToRemove }));
      dispatch(setDeletedFloorSubmisionMinusExistingProperty({ FSDMDId: idToRemove }));
    } catch (err) {
      console.warn('handleDeleteIsMinusRow: dispatch failed', err);
    }

    // feedback to user (if you have snackbar state)
    try {
      setSnackbarMessage?.('✅ Minus row deleted');
      setSnackbarSeverity?.('success');
      setSnackbarOpen?.(true);
    } catch (e) {
      // ignore if snackbar setters are not present
    }

    console.log('handleDeleteIsMinusRow -> updated tableMinusData:', updated);
  };

  const dispatch = useDispatch();

  //existing property details from redux

  const handleRoomChange = (event) => {
    const {
      target: { value }
    } = event;

    // const selected = typeof value === 'string' ? value.split(',').map(Number) : value;
    const selected = typeof value === 'string' ? value.split(',').map(Number) : value.map(Number);

    setSelectedRooms(selected);
    setFloorSubmissionDetails((prev) => ({
      ...prev,
      RoomNo: selected
    }));
  };

  const handleShapeChange = (event) => {
    const selectedShapeId = event.target.value;
    setShape(selectedShapeId);

    const shapeObj = roomShapeList.find((s) => s.ShapeID === selectedShapeId);
    const shapeName = shapeObj ? shapeObj.RoomShapeName : '';
    setFloorSubmissionDetails((prev) => ({
      ...prev,
      RoomShapeName: shapeName,
      ...shapeObj?.Fields?.reduce((acc, f) => ({ ...acc, [f]: '' }), {})
    }));
    setErrors((prev) => {
      const { shape, selectedShape, ...rest } = prev;
      return rest;
    });
  };

  const resetFields = () => {
    setSelectedRooms([]);
    setIsResetting(true);
    setAdjustedAreaTotal(0);
    setShape('');
    setArea(0);
    setTotal(0);
    setIsMinus('');
    setIsOuter('');
    setIsOuter('');
    setSelectedItem(null);
    setSelectedRoomType('');
    setFloorSubmissionDetails({
      OwnerID: 0,
      FSDId: 0,
      Length: 0,
      Width: 0,
      Height: 0,
      Area: 0,
      NoOfRooms: 0,
      TotalArea: 0,
      RoomNo: [],
      InnerOuter: 'No',
      isMinus: 0,
      RoomShapeName: '',
      SmallBase: 0,
      LargeBase: 0,
      Radius: 0,
      length_a: 0,
      length_b: 0,
      length_c: 0,
      RoomType: ''
    });
    setCurrentFSDId(null);

    setFloorSubmissionDetails({
      OwnerID: 0,
      FSDId: 0,
      Length: 0,
      Width: 0,
      Height: 0,
      Area: 0,
      NoOfRooms: 0,
      TotalArea: 0,
      RoomNo: [],
      InnerOuter: 'No',
      isMinus: 0,
      RoomShapeName: '',
      SmallBase: 0,
      LargeBase: 0,
      Radius: 0,
      length_a: 0,
      length_b: 0,
      length_c: 0,
      RoomType: ''
    });
  };

  const getShapeFields = (shapeId) => {
    const shapeObj = roomShapeList.find((s) => String(s.ShapeID) === String(shapeId));
    if (!shapeObj) return [];

    // Extract only fields that are TRUE in DB
    return Object.keys(shapeObj).filter(
      (key) => !['ShapeID', 'RoomShapeName', 'CreatedBy', 'CreatedDate', 'UpdatedBy', 'UpdatedDate'].includes(key) && shapeObj[key] === true
    );
  };
  {
    getShapeFields(shape).map((field) => (
      <Grid item xs={3} key={field}>
        <InputLabel>{field}</InputLabel>
        <TextField name={field} value={floorSubmissionDetails[field]} onChange={handleFloorSubmissionChange} />
      </Grid>
    ));
  }

  const selectedShape = roomShapeList.find((s) => String(s.ShapeID) === String(shape));

  {
    selectedShape?.Fields?.map((field) => (
      <TextField
        key={field}
        name={field}
        label={field}
        value={floorSubmissionDetails[field] || ''}
        onChange={(e) =>
          setFloorSubmissionDetails((prev) => ({
            ...prev,
            [field]: e.target.value
          }))
        }
        fullWidth
      />
    ));
  }

  const toInches = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;

    if (isSubMeter == false) {
      // convert feet → inches
      const parts = val.toString().split('.');
      console.log(parts[1], 'parts');
      const feet = Math.floor(num); // whole feet
      const inchPart = parts[1] ? Number(parts[1]) : 0; // decimal part as inches
      console.log(feet, inchPart, parts[1], feet * 12 + Number(inchPart), 'feet, inchPart for floor');
      return feet * 12 + Number(inchPart);
    } else {
      // convert meter → inches
      return num;
    }
  };

  const sqInchToSqFeet = (val) => {
    if (isSubMeter == false) {
      return (val || 0) / 144;
    } else {
      return val;
    }
  };

  useEffect(() => {
    console.log('running on changing no of room');
    if (!selectedShape) {
      setSingleUpdateRoomArea(0);
      setSingleRoomArea(0);
      // setAdjustedAreaNewTotal(0);
      return;
    }
    //  const shapeObj = roomShapeList.find(
    //   (s) => String(s.ShapeID) === String(selectedShape)
    // );

    let calculatedAreaNew = 0;
    console.log(selectedShape, 'shapeObj for new area');

    calculatedAreaNew = calculateAreaFromShape(selectedShape, floorSubmissionDetails);
    console.log(calculatedAreaNew, 'calculatedAreaNew before sqInchToSqFeet');
    // calculatedAreaNew = sqInchToSqFeet(calculatedAreaNew);
    calculatedAreaNew = parseFloat(calculatedAreaNew.toFixed(2));
    const calcArea = floorSubmissionDetails.RoomNo.length * calculatedAreaNew;

    console.log(calcArea, 'calculated');

    if (Number.isFinite(calcArea)) {
      setCalculatedArea(calcArea);
    }

    if (isMinus == 1) {
      if (Array.isArray(tableMinusData) && tableMinusData.length > 0) {
        const totalMinus = tableMinusData
          .filter((row) => {
            console.log(row?.FSDId, 'totalMinus');
            return row?.FSDId == currentFSDId;
          })
          .reduce((sum, row) => sum + (Number(row?.TotalArea) || row?.Area), 0);

        console.log(totalMinus, 'totalMinus');
        console.log('Minus area calc:', calculatedAreaNew - totalMinus);

        setSingleUpdateRoomArea(parseFloat(calculatedAreaNew.toFixed(2)));

        const baseValue = floorSubmissionDetails.RoomNo.length * (calculatedAreaNew - totalMinus);

        if (isOuter === 'Yes') {
          setAdjustedAreaTotal(parseFloat((0.8 * baseValue).toFixed(2)));
        } else {
          setAdjustedAreaTotal(parseFloat(baseValue.toFixed(2)));
        }
      }
    } else {
      const baseValue = floorSubmissionDetails.RoomNo.length * calculatedAreaNew;

      if (isOuter === 'Yes') {
        setAdjustedAreaTotal(parseFloat((0.8 * baseValue).toFixed(2)));
      } else {
        setAdjustedAreaTotal(parseFloat(baseValue.toFixed(2)));
      }
      setSingleUpdateRoomArea(parseFloat(calculatedAreaNew.toFixed(2)));
    }
  }, [
    shape,
    floorSubmissionDetails,
    isOuter,
    selectedRooms,
    tableData,
    tableMinusData?.length,
    currentFSDId,
    propertyNewDetails?.roomCount
  ]);

  // Phase 1: Load saved row values only once on dialog open
  const handleEditRow = (row) => {
    setCurrentFSDId(row.FSDId || currentFSDId);
    setIsMinus(row.isMinus);

    if (row.isMinus === 1 || row.isMinus === 'Yes') {
      const minusSource = dataFSDIdWise; // ✅ existing property slice

      const rid = Number(row?.FSDId ?? row?.FSDID);
      const matched = (Array.isArray(minusSource) ? minusSource : []).filter((d) => Number(d?.FSDId ?? d?.FSDID) === rid);

      setTableMinusData(matched);
      if (matched.length > 0) {
        setTableMinusData(matched);
      } else {
        setTableMinusData([]); // ✅ ensure empty for new rows
      }
    } else {
      setTableMinusData([]); // ✅ non-minus rows should never show minus table
    }

    let resolvedShapeId = row.ShapeID || row.RoomShapeID || '';
    if (!resolvedShapeId && row.RoomShapeName) {
      const found = roomShapeList.find((s) => s.RoomShapeName.toLowerCase() === row.RoomShapeName.toLowerCase());
      resolvedShapeId = found?.ShapeID || '';
    }

    const selectedShape = roomShapeList.find((s) => String(s.ShapeID) === String(resolvedShapeId));
    console.log(row, 'row for Add row');

    let normalized = {
      ...row,
      RoomShapeID: resolvedShapeId || '',
      RoomShapeName: row.RoomShapeName || '',
      Area: row.Area,
      RoomNo: row.RoomNo ? (Array.isArray(row.RoomNo) ? row.RoomNo : [row.RoomNo]) : [],
      RoomType: row.RoomType || '',
      InnerOuter: row.InnerOuter || 'No',
      isMinus: row.isMinus === 1 || row.isMinus === 'Yes' ? 1 : 0
    };
    console.log(normalized, 'normalized');

    const allShapeFields = ['Length', 'Width', 'Height', 'SmallBase', 'LargeBase', 'Radius', 'Length_A', 'Length_B', 'Length_C'];
    allShapeFields.forEach((f) => {
      if (normalized[f] === undefined || normalized[f] === null || normalized[f] === '') {
        normalized[f] = 0;
      }
    });

    (selectedShape?.Fields || []).forEach((field) => {
      normalized[field] = row[field] ?? 0;
    });

    // ✅ force total display correctly
    if (tableMinusData.length > 0) {
      const totalMinus = Array.isArray(tableMinusData) ? tableMinusData.reduce((sum, row) => sum + (Number(row?.TotalArea) || 0), 0) : 0;
      console.log('is edit runnning', normalized.Area * normalized.RoomNo.length - totalMinus);
      setSingleRoomArea((pre) => normalized.Area * normalized.RoomNo.length - totalMinus);
      setAdjustedAreaTotal((pre) => normalized.Area * normalized.RoomNo.length - totalMinus);
    }
    setIsEditing(true); // 🔹 flag set
    setSelectedItem(normalized);
    setShape(normalized.RoomShapeID);
    setFloorSubmissionDetails(normalized);

    setSingleUpdateRoomArea(normalized.Area);

    setSelectedRooms(Array.isArray(normalized.RoomNo) ? normalized.RoomNo : normalized.RoomNo ? [normalized.RoomNo] : []);
    setSelectedRoomType(normalized.RoomType || '');
    setIsOuter(normalized.InnerOuter || 'No');
    setIsMinus(normalized.isMinus);
    setOpenDialog(true);
  };

  useEffect(() => {
    console.log(adjustedAreaTotal, 'adjustedAreaTotal');
  }, [adjustedAreaTotal]);

  const skipRoomTypeIds = [
    'WR',
    'WC',
    'V',
    'VTR',
    'VTC',
    'WI',
    'CWR',
    'CWC',
    'CWI',
    'GWR',
    'GWC',
    'PR',
    'PC',
    'RCO',
    'CCO',
    'WEP',
    'WEG',
    'WEI'
  ];

  const isSkipRoomType = (TypeOfUseID) => {
    console.log('🔎 Checking TypeOfUseID:', TypeOfUseID);
    return skipRoomTypeIds.includes(TypeOfUseID);
  };

  const totalRooms = propertyNewDetails?.NoOfRooms || 0;

  const currentPDNId = pdnId;

  // 🔹 Robust set of already-used room numbers (handles string "1,2" or array [1,2])
  const usedRoomsSet = useMemo(() => {
    const set = new Set();

    (Array.isArray(tableData) ? tableData : [])
      .filter((row) => {
        if (!row) return false;
        return row.PDNId === currentPDNId || row.PDNId === pdnId;
      })
      .forEach((row) => {
        const roomData = row.RoomNo ?? row.roomNo; // handle both field names
        console.log(roomData, 'roomData for used room');

        let nums = [];
        if (Array.isArray(roomData)) {
          nums = roomData;
        } else if (typeof roomData === 'string') {
          nums = roomData
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n));
        } else if (typeof roomData === 'number') {
          nums = [roomData];
        }

        nums.forEach((n) => set.add(Number(n)));
      });

    // ✅ Remove currently selected rooms (so they stay enabled in edit mode)
    // (selectedRooms || []).forEach((n) => set.delete(Number(n)));

    console.log('🔒 Used Rooms Set:', [...set]);
    return set;
  }, [tableData, currentPDNId, floorSubmissionDetails?.FSDId, selectedRooms, pdnId]);

  useEffect(() => {
    console.log(propertyDetailsTableData, 'propertyDetailsTableData');
  }, [propertyDetailsTableData]);

  const handleAddRow = async () => {
    // --- find selected shape ---
    const selectedShape = (Array.isArray(roomShapeList) ? roomShapeList : []).find((s) => String(s.ShapeID) === String(shape));

    // --- 1️⃣ Basic validation ---

    const newErrors = {};
    if (!shape || !selectedShape) newErrors.shape = 'Please select a valid Room Shape';

    if (!selectedRoomType && !floorSubmissionDetails?.RoomType) newErrors.roomType = 'Please select Room Type';

    if (!selectedRooms || selectedRooms.length === 0) {
      setSnackbarMessage('❌ Please select at least one Room Number');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // --- 2️⃣ Shape-specific dimension validation ---
    if (selectedShape?.Fields?.length) {
      selectedShape.Fields.forEach((f) => {
        const val = floorSubmissionDetails?.[f];
        if (val === null || val === undefined || String(val).trim() === '' || Number(val) === 0) {
          newErrors[f] = `Please enter ${f}`;
        }
      });
    }

    // after validation, zero out irrelevant fields
    const allowedFields = new Set(selectedShape?.Fields || []);
    const allDimensionFields = ['Length', 'Width', 'Height', 'SmallBase', 'LargeBase', 'length_a', 'length_b', 'length_c', 'Radius'];

    allDimensionFields.forEach((f) => {
      if (!allowedFields.has(f)) {
        // clear previous values of irrelevant fields
        floorSubmissionDetails[f] = 0; // or "" if you prefer
      }
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // --- helpers ---
    const raw = floorSubmissionDetails || {};
    const safeNumber = (v, fallback = 0) => {
      const n = typeof v === 'number' ? v : parseFloat(String(v || '').replace(/,/g, ''));
      return Number.isFinite(n) ? n : fallback;
    };
    const safeString = (v, fallback = '') => (v === undefined || v === null ? fallback : String(v));

    // --- 3️⃣ Max allowed check ---
    const dimensionErrors = {};
    if (selectedShape?.Fields?.length) {
      selectedShape.Fields.forEach((field) => {
        const floorValRaw = floorSubmissionDetails?.[field];
        const minusValRaw = raw[field];
        if (floorValRaw == null || floorValRaw === '' || minusValRaw == null || minusValRaw === '') return;

        const maxAllowed = parseFloat(String(floorValRaw).replace(/,/g, ''));
        const minusVal = parseFloat(minusValRaw) || 0;

        if (Number.isFinite(maxAllowed) && minusVal > maxAllowed) {
          dimensionErrors[field] = `${field} cannot be greater than room ${field} (${maxAllowed})`;
        }
      });
    }

    if (Object.keys(dimensionErrors).length > 0) {
      setMinusErrors((prev) => ({ ...prev, ...dimensionErrors }));
      setSnackbarMessage("❌ Some values exceed the room's dimensions");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // --- 4️⃣ Collect base form fields ---
    const formDetails = {
      FSDId: raw.FSDId ?? 0,
      OwnerID: raw.OwnerID ?? selectedOwnerID ?? 0,
      Length: safeNumber(raw.Length, 0),
      Width: safeNumber(raw.Width, 0),
      Height: safeNumber(raw.Height, 0),
      Area: safeNumber(raw.Area, 0),
      SmallBase: safeNumber(raw.SmallBase, 0),
      LargeBase: safeNumber(raw.LargeBase, 0),
      length_a: safeNumber(raw.length_a, 0),
      length_b: safeNumber(raw.length_b, 0),
      length_c: safeNumber(raw.length_c, 0),
      Radius: safeNumber(raw.Radius, 0),
      RoomType: safeString(raw.RoomType, '')
    };

    // --- 5️⃣ shape-specific fields from raw ---
    const fieldValues = {};
    (selectedShape?.Fields || []).forEach((f) => {
      const val = raw[f];
      const maybeNum = Number(String(val || '').trim());
      fieldValues[f] = Number.isFinite(maybeNum) && String(val).trim() !== '' ? maybeNum : ''; // leave empty initially
    });

    // normalise empties to 0 only if at least one field has data
    const hasAnyFieldData = Object.values(fieldValues).some((v) => v !== '');
    if (hasAnyFieldData) {
      Object.keys(fieldValues).forEach((key) => {
        if (fieldValues[key] === '') fieldValues[key] = 0;
      });
    }

    // --- ensure FSDId exists ---
    const newFsdId = formDetails.FSDId || currentFSDId || (await generateUniqueFSDId());
    if (!currentFSDId) setCurrentFSDId(newFsdId);

    // --- 6️⃣ compose baseData ---
    const baseData = {
      ...raw,
      ...formDetails,
      ...fieldValues,
      FSDId: newFsdId,
      PDNId: pdnId,
      OwnerID: selectedOwnerID || formDetails.OwnerID || 0,
      RoomType: selectedRoomType || formDetails.RoomType || 'Default',
      RoomShapeName: selectedShape?.RoomShapeName || '',
      ShapeID: shape || 0,
      Area: Number(singleUpdateRoomArea) || Number(formDetails.Area) || 0,
      TotalArea: Number(adjustedAreaTotal) || 0,
      isMinus: isMinus ? 1 : 0,
      InnerOuter: isOuter === 'Yes' ? 'Yes' : 'No'
    };

    // --- 7️⃣ RoomNo / NoOfRooms ---
    const typeOfUse = (propertyNewDetails?.TypeOFUse || '').toString().trim().toUpperCase();
    if (isSkipRoomType(typeOfUse)) {
      baseData.NoOfRooms = 0;
    } else {
      baseData.RoomNo =
        Array.isArray(selectedRooms) && selectedRooms.length > 0 ? [...new Set(selectedRooms)].map(Number).sort((a, b) => a - b) : [1];
      baseData.NoOfRooms = baseData.RoomNo.length;
    }

    // 🚫 8️⃣ Prevent negative total area
    let newTotalArea = Number(adjustedAreaTotal) || 0;
    console.log(adjustedAreaTotal, 'newTotalArea');
    if (isMinus) newTotalArea -= Number(baseData.Area);
    else newTotalArea += Number(baseData.Area);
    console.log(newTotalArea, 'newTotalArea');

    if (adjustedAreaTotal < 0) {
      setSnackbarMessage('❌ Total Floor Area cannot be negative');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // --- 9️⃣ insert or update immutably ---
    setTableData((prev) => {
      const previous = Array.isArray(prev) ? prev : [];
      const updated = [...previous];

      if (isEditing) {
        const idx = updated.findIndex((item) => String(item?.FSDId) === String(baseData?.FSDId));
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            ...baseData,
            Insert: false,
            Update: true
          };
        } else {
          updated.push({ ...baseData, Insert: true, Update: false });
        }
      } else {
        updated.push({ ...baseData, Insert: true, Update: false });
      }

      dispatch(setFloorSubmissionDetailsInitialData({ newData: updated }));

      return updated;
    });

    // --- 🔟 reset UI state ---
    setIsEditing(false);
    setCurrentFSDId(null);
    setCalculatedArea(0);

    setFloorSubmissionDetails((prev) => ({
      ...(prev || {}),
      OwnerID: 0,
      FSDId: 0,
      Length: 0,
      Width: 0,
      Height: 0,
      Area: 0,
      NoOfRooms: 0,
      TotalArea: 0,
      RoomNo: [],
      InnerOuter: 'No',
      isMinus: 0,
      RoomShapeName: '',
      SmallBase: 0,
      LargeBase: 0,
      Radius: 0,
      length_a: 0,
      length_b: 0,
      length_c: 0,
      RoomType: ''
    }));

    resetFields?.();
    setIsMinus(false);
    setMinusArea(0);
  };

  useEffect(() => {
    if (isResetting) return;
    const areaCalculation = () => {
      if (!tableData || tableData.length === 0) return; // safeguard
      console.log('🔍 tableData row:', tableData);

      const filteredRows = tableData.filter((row) => row?.PDNId === pdnId);

      console.log('🔍 filteredRows: for carpet ara', filteredRows);

      if (filteredRows.length === 0) return;

      const carpetFromRows = filteredRows.reduce((sum, row) => {
        const totalArea = row?.TotalArea ? Number(row.TotalArea).toFixed(2) : 0;
        return sum + Number(totalArea);
      }, 0);

      let carpetAreaSqFt = 0;
      let carpetAreaSqMtr = 0;

      if (isSubMeter) {
        // User/data entry is in SqMtr
        carpetAreaSqMtr = parseFloat(carpetFromRows); // direct
        carpetAreaSqFt = parseFloat((carpetAreaSqMtr * 10.764).toFixed(2));
      } else {
        // User/data entry is in SqFt
        carpetAreaSqFt = parseFloat(carpetFromRows); // direct
        carpetAreaSqMtr = parseFloat((carpetAreaSqFt / 10.764).toFixed(2));
      }

      let cvPercent = 0;
      if (propertyNewDetails.ConstructionType !== 'E' && propertyNewDetails.ConstructionType !== 'OP') {
        if (propertyNewDetails.ConstructionYear <= 2018) cvPercent = 0.2;
        else if (propertyNewDetails.ConstructionYear > 2018) cvPercent = 0.1;
      }

      const buildUpAreaSqFt = parseFloat((carpetAreaSqFt + carpetAreaSqFt * cvPercent).toFixed(2));
      const buildUpAreaSqMtr = parseFloat((carpetAreaSqMtr + carpetAreaSqMtr * cvPercent).toFixed(2));

      const updated = {
        CarpetAreaSqFeet: parseFloat(carpetAreaSqFt.toFixed(2)),
        CarpetAreaSqMeter: carpetAreaSqMtr,
        BuildUpAreaSqFeet: BuildUpAreaSqFeet,
        BuildUpAreaSqMeter: BuildUpAreaSqMeter
      };
      setBuildUpAreaSqFeet(buildUpAreaSqFt);
      setBuildUpAreaSqMeter(buildUpAreaSqMtr);
    };

    areaCalculation();
  }, [
    tableData,
    selectedOwnerID,
    pdnId,
    capitalValue,
    tableData,
    propertyNewDetails?.ConstructionYear,

    propertyNewDetails?.ConstructionType,

    isResetting
  ]);

  // Collect active shape IDs
  const activeShapeIDs = useMemo(() => {
    return [...new Set(tableData?.map((row) => row?.shapeId))];
  }, [tableData]);

  // Dynamic headers from shape master
  const dynamicHeaders = useMemo(() => {
    const headers = new Set();

    const filteredRows = tableData?.filter((row) => !selectedPDNId || row?.PDNId === selectedPDNId);

    // ✅ Existing rows ke keys add karo
    filteredRows?.forEach((row) => {
      Object?.keys(row ? row : {})?.forEach((key) => {
        if (
          ![
            'FSDId',
            'FSDMDId',
            'RoomCount',
            'IsConfirmed',
            'RoomNo',
            'Formula',
            'FloorID',
            'ConstructionYear',
            'ConstructionId',
            'Remark',
            'RoomRemark',
            'Remark',
            'CreatedBy',
            'UpdatedBy',
            'CreatedDate',
            'UpdatedDate',
            'RoomShapeID',
            'TypeOfUseID',
            'REMARK',
            'Delete',
            'RoomType',
            'ShapeID',
            'RoomShapeName',
            'Area',
            'TotalArea',
            'NoOfRooms',
            'isMinus',
            'isOuter',
            'InnerOuter',
            'PDNId',
            'Insert',
            'Update',
            'OwnerID'
          ].includes(key)
        ) {
          headers.add(key);
        }
      });
    });

    // ✅ Active shape fields
    activeShapeIDs.forEach((id) => {
      const shapeObj = roomShapeList.find((s) => String(s.ShapeID) === String(id));
      if (shapeObj?.Fields) {
        shapeObj.Fields.forEach((f) => headers.add(f));
      }
    });

    return [...headers];
  }, [tableData, selectedPDNId, activeShapeIDs, roomShapeList]);

  // ✅ Area input for single room if needed
  const renderSingleRoomAreaInput = () => {
    if (roomCount === 1) {
      return (
        <Grid item xs={1.7} mt={1}>
          <Stack spacing={1} mb={1}>
            <InputLabel>Area</InputLabel>
            <TextField required fullWidth value={singleUpdateRoomArea} />
          </Stack>
        </Grid>
      );
    }
    return null;
  };

  // scroll height limit
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 5 + 8 // 5 items of 48px height + padding
      }
    }
  };

  //floor submission details
  const validateShapeFields = () => {
    const getFieldValue = (field) => floorSubmissionDetails[field];

    const isInvalid = (val) => !val || parseFloat(val) <= 0;

    let valid = true;

    switch (shape) {
      case Rectangle: // Rectangle
        const length = getFieldValue('Length');
        const width = getFieldValue('Width');
        setLengthError(isInvalid(length));
        setWidthError(isInvalid(width));
        valid = !isInvalid(length) && !isInvalid(width);
        break;

      case RightAngleTriangle: // Right-Angled Triangle
        const smallBase = getFieldValue('SmallBase');
        const height = getFieldValue('Height');
        setSmallBaseError(isInvalid(smallBase));
        setHeightError(isInvalid(height));
        valid = !isInvalid(smallBase) && !isInvalid(height);
        break;

      case Trapezoidal: // Trapezoid
        const sBase = getFieldValue('SmallBase');
        const lBase = getFieldValue('LargeBase');
        const trapHeight = getFieldValue('Height');
        setSmallBaseError(isInvalid(sBase));
        setLargeBaseError(isInvalid(lBase));
        setHeightError(isInvalid(trapHeight));
        valid = !isInvalid(sBase) && !isInvalid(lBase) && !isInvalid(trapHeight);
        break;

      case Circle: // Circle
      case Semi - Circle: // Semi-Circle
        const radius = getFieldValue('Radius');
        setRadiusError(isInvalid(radius));
        valid = !isInvalid(radius);
        break;

      case Non - Equilateral - Triangle: // Non-Equilateral Triangle
        const a = getFieldValue('length_a');
        const b = getFieldValue('length_b');
        const c = getFieldValue('length_c');
        setLengthAError(isInvalid(a));
        setLengthBError(isInvalid(b));
        setLengthCError(isInvalid(c));
        valid = !isInvalid(a) && !isInvalid(b) && !isInvalid(c);
        break;

      case Hexagon: // Hexagon
      case Octagon: // Octagon
        const sideLength = getFieldValue('Length');
        setLengthError(isInvalid(sideLength));
        valid = !isInvalid(sideLength);
        break;

      case Pentagon: // Pentagon
        const radiusPentagon = getFieldValue('Radius');
        setRadiusError(isInvalid(radiusPentagon));
        valid = !isInvalid(radiusPentagon);
        break;

      case EquilateralTriangle: // Equilateral Triangle
        const eqLength = getFieldValue('Length');
        setLengthError(isInvalid(eqLength));
        valid = !isInvalid(eqLength);
        break;

      default:
        valid = true;
    }

    return valid;
  };

  const handleRoomTypeChange = (e) => {
    const roomTypeName = e.target.value;
    setSelectedRoomType(roomTypeName);

    setFloorSubmissionDetails((prev) => ({
      ...prev,
      RoomType: roomTypeName
    }));

    setErrors((prev) => {
      const { selectedRoomType, ...rest } = prev;
      return rest;
    });
  };

  const handleIsOuterChange = (event) => {
    setIsOuter(event.target.value);
    console.log(event.target.value, 'selected value');
    setIsOuter(event.target.value);
  };

  const handlePasteClick = () => {
    const newEntry = JSON.parse(JSON.stringify(newFloorCopiedData));
    newEntry.PDNId = pdnId;
    setPropertyNewDetails(newEntry);
  };

  const handleCopyClick = () => {
    setNewFloorCopiedData(JSON.parse(JSON.stringify(propertyNewDetails)));
  };

  const handleClearNewDetails = () => {
    setPropertyNewDetails({
      FloorID: '',
      ConstructionType: '',
      TypeOFUse: '',
      GroupId: '0',
      ConstructionYear: '',
      NoOfRooms: '',
      CarpetAreaSqFeet: '',
      CarpetAreaSqMeter: '',
      BuildUpAreaSqFeet: '',
      BuildUpAreaSqMeter: '',
      Room: '',
      Registration: 0,
      OccupierYesNo: null,
      OccupierName: '',
      OccupierNameMarathi: '',
      RenterName: '',
      RenterNameMarathi: '',
      RenterYesNO: 0,
      Rent: 0,
      NonCalculateRent: 0,
      AgreementDate: null,
      AgreementToDate: null
    });
  };

  const handleRowClick = (item) => {
    console.log(item, 'found item to be edited');
    setSelectedPDNId(item?.PDNId);
    setPdnId(item?.PDNId);

    // ✅ normalize yes/no fields
    const normalizedItem = {
      ...item,
      RenterYesNO: item.RenterYesNO ? 1 : 0,
      Registration: item.Registration ? 1 : 0,
      OccupierYesNo: item.OccupierYesNo ? 1 : 0
    };

    // ✅ refresh typeOfUseList for GroupId
    if (normalizedItem.GroupId) {
      fetchTypeDescByGroupId(normalizedItem.GroupId)
        .then((result) => setTypeOfUseList(result))
        .catch((err) => console.error('Failed to fetch TypeOfUse:', err));
    }

    setPropertyNewDetails(normalizedItem);
    const matchedRoomData = tableData?.find((r) => r?.pdnId === item?.pdnId);
    if (matchedRoomData) {
      setFloorSubmissionDetails(matchedRoomData);
      setSelectedRooms(matchedRoomData.RoomNo || []);
      setShape(matchedRoomData.ShapeID || '');
      setIsOuter(matchedRoomData.InnerOuter || 'No');
      setIsMinus(matchedRoomData.isMinus === 1);
      setSelectedRoomType(matchedRoomData.RoomType || '');
    }
    // ✅ enable submission button
    setIsValidRooms(item.NoOfRooms && parseInt(item.NoOfRooms) > 0);
  };

  //roomshape
  useEffect(() => {
    fetchRoomShapes().then((res) => {
      setRoomShapeList(res.data);
      console.log(res.data, 'Floor rooms no');
    });
  }, []);

  useEffect(() => {
    fetchConstructionType().then((res) => {
      setConstructionTypeList(res.data);
    });
  }, []);

  useEffect(() => {
    fetchNewFloor().then((res) => {
      setFloorList(res.floorList);
    });
  }, []);

  useEffect(() => {
    console.log(propertyNewDetails, 'setPropertyNewDetails');
    const details = propertyNewDetails;

    const valid =
      details.NoOfRooms !== '' &&
      details.ConstructionType !== '' &&
      details.ConstructionYear &&
      details.ConstructionYear.toString().length === 4 &&
      details.TypeOFUse !== '' &&
      details.GroupId !== '';

    setIsValidRooms(valid);
  }, [propertyNewDetails]);

  //exsiting handle change
  const handleInputNewInformChange = async (e) => {
    const { name, value } = e.target;
    if ((name === 'OccupierName' || name === 'RenterName') && /[^a-zA-Z\s]/.test(value)) {
      return;
    }
    setPropertyNewDetails({ ...propertyNewDetails, [name]: value });

    // 🔹 also dispatch to Redux
    //dispatch(setPropertyDetailsNewFormRedux({ [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '' // Remove error message for the field
    }));

    setPropertyNewDetails((prev) => ({
      ...prev,
      [name]: value
    }));
    // ✅ Ensure ConstructionYear is stored as number
    if (name === 'ConstructionYear') {
      const newValue = value ? Number(value) : '';
      // Validate against future year
      if (newValue > new Date().getFullYear()) {
        setErrors((prev) => ({
          ...prev,
          ConstructionYear: 'Construction Year cannot be in the future'
        }));
      }
    }

    // 👉 If GroupId is selected, fetch TypeOfUse list
    if (name === 'GroupId') {
      setPropertyNewDetails((prev) => ({
        ...prev,
        [name]: value
      }));
    }
    if (name === 'RenterYesNO' && value === 0) {
      const resetRenterFields = {
        RenterYesNO: value,
        RenterName: '',
        RenterNameMarathi: '',
        Rent: 0,
        NonCalculateRent: 0,
        AgreementDate: null,
        AgreementToDate: null
      };

      setPropertyNewDetails((prev) => ({
        ...prev,
        ...resetRenterFields
      }));

      // 🔹 also dispatch reset to Redux
      // dispatch(setPropertyDetailsNewFormRedux(resetRenterFields));
    }

    if (name === 'OccupierYesNo' && value === 0) {
      setPropertyNewDetails((prev) => ({
        ...prev,
        OccupierYesNo: value,

        OccupierName: '',
        OccupierNameMarathi: ''
      }));
      //dispatch(setPropertyDetailsNewFormRedux(resetRenterFields));
    }
    if (name === 'OccupierName' || name === 'RenterName') {
      translateText(value)
        .then((translated) => {
          const translatedFieldName = `${name}Marathi`;
          setPropertyNewDetails((prevState) => ({
            ...prevState,
            [translatedFieldName]: translated
          }));
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    // reset form states to blank
    setSelectedRooms([]);
    setSelectedRoomType('');
    setShape('');
    setIsOuter('No');
    setIsOuter('No');
    setIsMinus(0);
    setErrors({});
    setSelectedItem(null);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAction = () => {
    setIsMinus(0);
    setTableMinusData([]);
    dispatch(clearFloorSubmissionDetailsMinusData({ id: currentFSDId }));
    setOpenDialogDeleteIsMinus(false);
  };
  const handleCloseOpenDialogDeleteIsMinus = () => {
    setIsMinus(true);
    setOpenDialogDeleteIsMinus(false);
  };

  useEffect(() => {
    // define an async function inside
    const ensureFSDId = async () => {
      if (!currentFSDId) {
        const newFSDId = await generateUniqueFSDId();
        console.log('✅ Generated FSDId (Minus flow):', newFSDId);
        setCurrentFSDId(newFSDId);
      }
    };

    // then invoke it
    ensureFSDId();
  }, [isMinus]); // runs when isMinus changes

  useEffect(() => {}, [currentFSDId]);
  const handleMinusAreaConfirm = () => {
    const totalMinusArea = tableMinusData.filter((row) => row?.FSDId == currentFSDId).reduce((sum, row) => sum + (row?.TotalArea || 0), 0);
    const minusArea = totalMinusArea * floorSubmissionDetails.RoomNo.length;
    if (minusArea > calculatedArea) {
      setSnackbarMessage(`❌ Minus total area cannot be greater than or equal to Floor total area`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    console.log(tableMinusData?.filter((row) => row?.FSDId));
    console.log(currentFSDId);
    if (tableMinusData?.filter((row) => row?.FSDId === currentFSDId).length <= 0) {
      setIsMinus(0);
    }

    handleCloseDialogIsMinus();
  };

  const calculateTotalArea = (currentTotal, addedArea) => {
    return currentTotal - addedArea;
  };
  const handleCloseDialogIsMinus = (addedArea) => {
    setOpenDialogIsMinus(false);
    const newTotalArea = calculateTotalArea(floorSubmissionDetails.TotalArea, addedArea);

    setFloorSubmissionDetails((prevDetails) => ({
      ...prevDetails,
      TotalArea: newTotalArea
    }));
    setOpenDialog(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'OpenPlotOccupierName') {
      translateText(value)
        .then((translated) => {
          setPropertyMastLocal((prevState) => ({
            ...prevState,
            OpenPlotOccupierMarathiName: translated
          }));
        })
        .catch((err) => {
          console.error('Translation Error:', err);
        });
    }
    setPropertyMastLocal((prev) => {
      const updated = {
        ...prev,
        [name]: value
      };
      dispatch(setPropertyMastFormDataEntry(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (Object.keys(propertyMast).length === 0) return;
    console.log(propertyMast, 'propertyMast');
    setPropertyMastLocal(propertyMast);
  }, [propertyMast]);

  const handleDeleteClick = (PDNId) => {
    setSelectedDeleteId(PDNId);
    setOpenDeleteDialog(true); // open confirmation dialog
  };
  const handleConfirmDelete = () => {
    if (selectedDeleteId != null) {
      const updatedData = propertyDetailsTableData.filter((item) => item.PDNId !== selectedDeleteId);

      // update local state
      setPropertyDetailsTableData(updatedData);
      dispatch(deletePropertyDetailsNew({ id: selectedDeleteId }));
      // // update Redux propertyDetailsNew with updated data
      dispatch(setPropertyDetailsNew({ newData: updatedData }));

      // ✅ track deleted PDNId in Redux
      dispatch(setDeletedPDNIdsExistingProperty({ PDNId: selectedDeleteId }));
      console.log('🗑️ Dispatching delete for:', selectedDeleteId);

      console.log('🗑️ Deleted PDNId:', selectedDeleteId);
    }

    // ✅ close once, outside if
    setSelectedDeleteId(null);
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setSelectedDeleteId(null);
    setOpenDeleteDialog(false);
  };

  const handleSubmitFloorDetails = () => {
    console.log('Submitting floor details...', propertyNewDetails, tableData);
    const noOfRoomsValue = propertyNewDetails.NoOfRooms;
    const noOfRoomsNum = Number(noOfRoomsValue) || 0;

    // if (noOfRoomsNum === 0) {
    //   setOpenDialog(false);
    //   return;
    // }

    // 🔹 Required rooms [1..N]
    const requiredRooms = Array.from({ length: noOfRoomsNum }, (_, i) => i + 1);

    // 🔹 Collect all rooms only from tableData (always check `RoomNo`)
    const usedRoomsFromTable = (Array.isArray(tableData) ? tableData : []).flatMap((row) =>
      Array.isArray(row.RoomNo)
        ? row.RoomNo
        : typeof row.RoomNo === 'string'
          ? row.RoomNo.split(',').map((num) => Number(num.trim()))
          : typeof row.RoomNo === 'number'
            ? [row.RoomNo]
            : []
    );

    if (!tableData || tableData.length === 0) return; // safeguard

    // 🔹 Filter rows only for this PDNId
    const filteredRows = tableData.filter((row) => row.PDNId === pdnId);

    // 🔹 Total rooms in filtered rows
    const totalRoomCount = filteredRows.reduce((sum, row) => sum + (Number(row.NoOfRooms) || 0), 0);

    // 🔹 Total carpet area from filtered rows
    const carpetFromRows = filteredRows.reduce((sum, row) => {
      const totalArea = row?.TotalArea ? Number(row.TotalArea).toFixed(2) : 0;
      return sum + Number(totalArea);
    }, 0);

    let carpetAreaSqFt = 0;
    let carpetAreaSqMtr = 0;

    if (isSubMeter) {
      // User/data entry is in SqMtr
      carpetAreaSqMtr = parseFloat(carpetFromRows); // direct
      carpetAreaSqFt = parseFloat((carpetAreaSqMtr * 10.764).toFixed(2));
    } else {
      // User/data entry is in SqFt
      carpetAreaSqFt = parseFloat(carpetFromRows); // direct
      carpetAreaSqMtr = parseFloat((carpetAreaSqFt / 10.764).toFixed(2));
    }

    const constructionType = propertyNewDetails?.ConstructionType;
    const constructionYear = Number(propertyNewDetails?.ConstructionYear) || 0;

    // 🔹 CV Percent
    let cvPercent = 0;
    if (constructionType !== 'E' && constructionType !== 'OP') {
      if (constructionYear < 2018) cvPercent = 0.2;
      else if (constructionYear >= 2018) cvPercent = 0.1;
    }

    // 🔹 Build up areas
    const buildUpAreaSqFt = parseFloat((carpetAreaSqFt + carpetAreaSqFt * cvPercent).toFixed(2));
    const buildUpAreaSqMtr = parseFloat((carpetAreaSqMtr + carpetAreaSqMtr * cvPercent).toFixed(2));

    setBuildUpAreaSqFeet(buildUpAreaSqFt);
    setBuildUpAreaSqMeter(buildUpAreaSqMtr);

    // 🔹 Combine everything into ONE updated object
    const updated = {
      ...propertyNewDetails,
      CarpetAreaSqFeet: parseFloat(carpetAreaSqFt.toFixed(2)),
      CarpetAreaSqMeter: carpetAreaSqMtr,
      BuildUpAreaSqFeet: buildUpAreaSqFt,
      BuildUpAreaSqMeter: buildUpAreaSqMtr,
      Room: totalRoomCount // include Room here
    };

    // ✅ Only one setState call
    setPropertyNewDetails(updated);

    // 🔹 Unique rooms from table
    const uniqueRooms = [...new Set(usedRoomsFromTable.map(Number))].sort((a, b) => a - b);

    // 🔹 Check if table covers all required rooms
    const allFilled = requiredRooms.every((r) => uniqueRooms.includes(r));

    if (allFilled) {
      setOpenDialog(false);
    } else {
      setSnackbarMessage('⚠️ Please fill all room numbers before submitting.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleNumberInput = (event) => {
    const { key, target } = event;
    const currentValue = target.value;

    // Allow navigation keys (Backspace, Delete, Arrow keys, Tab)
    if (
      !/^[0-9]$/.test(key) && // Only allow numeric keys
      key !== 'Backspace' &&
      key !== 'Delete' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      key !== 'Tab'
    ) {
      event.preventDefault();
      console.log('Only numbers are allowed');
    } else if (currentValue.length >= 4 && /^[0-9]$/.test(key)) {
      // Prevent input if the length is 4 digits and the user tries to add another digit
      event.preventDefault();
      console.log('year must contain 4 digits');
    } else {
      console.log(''); // Clear error message on valid input
    }
  };

  const handleNumberDecimalInput = (event) => {
    const { key, target } = event;

    // Allow navigation keys (Backspace, Delete, Arrow keys, Tab, Enter, etc.)
    if (
      !/^[0-9.]$/.test(key) && // Allow only numbers and the decimal point
      key !== 'Backspace' &&
      key !== 'Delete' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      key !== 'Tab' &&
      key !== 'Enter'
    ) {
      event.preventDefault();
    } else if (key === '.' && target.value.includes('.')) {
      // Prevent multiple decimal points
      event.preventDefault();
    }
  };

  useEffect(() => {
    const source = FloorSubmissionDetailsMinus || [];
    console.log(minusShape, 'minusShape');
    const roomShapeNameMinus = roomShapeList.filter((row) => row?.ShapeID == minusShape)[0]?.RoomShapeName;
    console.log(roomShapeNameMinus, 'roomShapeNameMinus');
    console.log(source, 'FloorSubmissionDetailsMinus');
    if (!minusShape) {
      return;
    }

    let totalMinusArea = 0;

    const shapeObj = roomShapeList.find((s) => String(s.ShapeID) === String(minusShape));
    console.log(source, 'FloorSubmissionDetailsMinus');
  }, [isMinus, FloorSubmissionDetailsMinus, selectedMinusShape]);

  const minusFixedHeaders = ['Edit', 'Delete', 'Room Shape'];

  useEffect(() => {
    fetchGroupList()
      .then(setGroupList)
      .catch((err) => {
        console.error('Error fetching group list:', err);
      });
  }, []);

  useEffect(() => {
    console.log('GroupList', groupList);
    console.log('constructionTypeList', constructionTypeList);
  }, [groupList, constructionTypeList]);

  const minusDynamicHeaders = useMemo(() => {
    const rows = Array.isArray(tableMinusData) ? tableMinusData : [];

    const excludeKeys = new Set([
      'FSDMDId',
      'FSDId',
      'PDNId',
      'RoomType',
      'ShapeID',
      'OwnerID',
      'IsConfirmed',
      'Insert',
      'Update',
      'isMinus',
      'Area',
      'RoomShapeName',
      'RoomCount',
      'TotalArea',
      'CreatedDate',
      'UpdatedBy',
      'CreatedBy',
      'UpdatedDate',
      'RoomShapeID'
    ]);

    const headers = new Set();

    rows.forEach((row) => {
      Object.keys(row || {}).forEach((rawKey) => {
        const key = String(rawKey).trim();
        if (key && !excludeKeys.has(key)) headers.add(key);
      });
    });

    return [...headers]; // preserves discovery order
  }, [tableMinusData]);

  useEffect(() => {}, [minusArea]);

  // ----------------------- Yup schema -----------------------
  const propertyNewDetailsSchema = Yup.object().shape({
    FloorID: Yup.string().required('Floor is required'),
    ConstructionType: Yup.string().required('Construction Type is required'),
    TypeOFUse: Yup.string().required('Type Of Use is required'),
    GroupId: Yup.string().required('Group ID is required'),
    ConstructionYear: Yup.number()
      .typeError('Construction Year is required')
      .required('Construction Year is required')
      .test('len', 'Construction Year must be exactly 4 digits', (value) => value && value.toString().length === 4)
      .max(new Date().getFullYear(), 'Construction Year cannot be in the future'),

    Registration: Yup.string().required('Registration is required')
    // Occupier: Yup.string().required('Occupier is required'), // optional
  });

  // ----------------------- Add Button Handler -----------------------
  const handleNewAddButtonClick = async () => {
    if (submissionPermission == false) {
      if (propertyNewDetails?.CarpetAreaSqFeet === undefined || propertyNewDetails?.CarpetAreaSqFeet === '') {
        setSnackbarMessage('❌ Carpet area is required while adding new floor details.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      } else if (propertyNewDetails?.CarpetAreaSqFeet > 0) {
        setSnackbarMessage('❌ Carpet area must be greater than zero while adding new floor details.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
    }
    try {
      const rawDetails = propertyNewDetails || {};
      let validationErrors = {};

      // 1️⃣ Validate form using Yup
      try {
        console.log(rawDetails, 'rawDetails');
        await propertyNewDetailsSchema.validate(rawDetails, { abortEarly: false });
        if (propertyNewDetails && tableData.length > 0) {
          // Destructure fields
          const {
            FloorID,
            ConstructionYear,
            GroupId,
            TypeOFUse,
            ConstructionType,
            PDNId // assuming PDNId exists in propertyNewDetails
          } = propertyNewDetails;

          // Check if a row already exists with same details
          const existingRow = propertyDetailsTableData.find(
            (row) =>
              String(row.FloorID) === String(FloorID) &&
              String(row.ConstructionYear) === String(ConstructionYear) &&
              String(row.GroupId) === String(GroupId) &&
              String(row.TypeOFUse) === String(TypeOFUse) &&
              String(row.ConstructionType) === String(ConstructionType)
          );

          if (existingRow) {
            // If PDNId is different, show error
            if (existingRow.PDNId !== PDNId) {
              setSnackbarMessage('Floor details already exist');
              setSnackbarSeverity('error');
              setSnackbarOpen(true);
              return;
            }
            // else allow (it’s the same record being edited)
          }

          // … your save logic here
        }

        if (rawDetails.RenterYesNO) {
          if (!rawDetails.RenterName) {
            return setErrors((prev) => ({ ...(prev || {}), RenterName: 'Renter Name is required' }));
          }
        }
        setErrors((pre) => ({
          ...pre,
          RenterName: false
        }));
      } catch (err) {
        if (err?.inner && Array.isArray(err.inner)) {
          err.inner.forEach((e) => {
            if (e?.path) validationErrors[e.path] = e.message;
          });
        } else if (err?.path) {
          validationErrors[err.path] = err.message;
        }

        setErrors((prev) => ({ ...(prev || {}), ...validationErrors }));
        return;
      }

      // 2️⃣ Validate room coverage: selectedRooms must match NoOfRooms
      const expectedRooms = Number(rawDetails.NoOfRooms) || 0;
      const union = new Set();

      if (usedRoomsSet && typeof usedRoomsSet[Symbol.iterator] === 'function') {
        for (const v of usedRoomsSet) union.add(Number(v));
      }
      (selectedRooms || []).forEach((n) => union.add(Number(n)));

      const gotRooms = union.size;

      if (submissionPermission) {
        if (!skipRoomTypeIds.includes(propertyNewDetails.TypeOFUse)) {
          if (gotRooms !== expectedRooms) {
            setSnackbarMessage('Room count does not match with Room No.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
          }
        }
      }

      // 3️⃣ Prepare object to add/update
      const detailsToAdd = {
        ...rawDetails,
        PDNId: pdnId,
        RoomNo: Array.isArray(selectedRooms) ? selectedRooms.map(Number) : rawDetails.RoomNo || []
      };

      console.log(detailsToAdd, 'detailsToAdd');
      // 4️⃣ Update local form state with PDNId
      setPropertyNewDetails((prev) => ({ ...(prev || {}), PDNId: pdnId }));

      // 5️⃣ Immutable upsert into table + Redux
      const prevList = Array.isArray(propertyDetailsTableData) ? propertyDetailsTableData : [];
      const existingIndex = prevList.findIndex((item) => String(item?.PDNId) === String(detailsToAdd.PDNId));

      let updatedList;
      if (existingIndex !== -1) {
        updatedList = [...prevList];
        updatedList[existingIndex] = { ...updatedList[existingIndex], ...detailsToAdd, Insert: false, Update: true };
      } else {
        updatedList = [...prevList, { ...detailsToAdd, Insert: true, Update: false }];
      }

      // Update Redux safely
      console.log(updatedList, 'updatedList');
      try {
        dispatch(setPropertyDetailsNew({ newData: updatedList }));
      } catch (dispatchErr) {
        console.warn('Redux dispatch failed:', dispatchErr);
      }

      // 6️⃣ Reset UI fields & state
      setIsResetting(true);
      handleClearNewDetails?.();

      setPdnId(null);

      setErrors({});
    } catch (err) {
      console.error('Failed to add property details:', err);
    }
  };

  const handleDeleteFloorSubmissionRow = (row) => {
    const FSDId = row.FSDId;
    console.log(FSDId, 'FSDId to delete');
    dispatch(deletefloorSubmissionDetailsInitialData({ id: FSDId }));
    dispatch(setDeletedFloorSubmisionExistingProperty({ FSDId: FSDId }));
  };

  const handleConfirmDeleteMinus = (row) => {
    handleDeleteIsMinusRow(row);
    setRowToDeleteMinus({});
    setOpenDeleteDialogMinus(false);
  };

  const handleActionToDeleteRow = (row) => {
    handleDeleteFloorSubmissionRow(row);
    setRowToDelete({});
    setFloorSubmissionDetailsDialogDelete(false);
  };
  useEffect(() => {
    console.log(propertyNewDetails.ConstructionYear, 'construction year');

    // pick multiplier based on year
    const multiplier = propertyNewDetails.ConstructionYear <= 2018 ? 0.2 : 0.1;

    // always compute built up area in ft² first
    const buildUpAreaSqFt = Number(propertyNewDetails.CarpetAreaSqFeet || 0) * multiplier;

    // total built-up area in ft²
    const totalBuiltUpSqFt = Number(propertyNewDetails.CarpetAreaSqFeet || 0) + buildUpAreaSqFt;

    // convert to m²
    const totalBuiltUpSqMtr = totalBuiltUpSqFt / 10.764;

    setPropertyNewDetails((prev) => ({
      ...prev,
      BuildUpAreaSqFeet: Number(totalBuiltUpSqFt).toFixed(2),
      BuildUpAreaSqMeter: Number(totalBuiltUpSqMtr).toFixed(2)
    }));
  }, [propertyNewDetails.CarpetAreaSqFeet, propertyNewDetails.ConstructionYear]);
  const shortcutKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  useEffect(() => {
    const handleKeySelect = (e) => {
      // ignore if select is disabled

      if (!typeOFConstruction) return;

      console.log('clicking for change');
      const key = e.key.toLowerCase();
      const index = shortcutKeys.indexOf(key);

      if (index >= 0 && constructionTypeList[index]) {
        handleInputNewInformChange({
          target: {
            name: 'ConstructionType',
            value: constructionTypeList[index].ConstructionId
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeySelect);
    return () => window.removeEventListener('keydown', handleKeySelect);
  }, [typeOFConstruction]);
  // key → TypeOfUseID

 const shortcutKeyForGroup = {
  1: 'N',  // No Tax
  2: 'A',  // Non-Residential (अनिवासी)
  3: 'I',  // Industrial (औदयोगिक)
  4: 'O',  // Open Plot (खुला भुखंड)
  5: 'D',  // Religious (धार्मीक)
  6: 'M',  // Municipal Property (नगरपरिषद मालमत्ता)
  8: 'R',  // Residential (निवासी)
  10: 'G', // Government Property (शासकीय मालमत्ता)
  11: 'C'  // Central Government Property (केंद्र शासकीय मालमत्ता)
};


  useEffect(() => {
  const handleGroupKeySelect = (e) => {
    if (!typeOFGroup) return;

    const key = e.key.toUpperCase();

    // find matching shortcut key
    const foundGroup = Object.entries(shortcutKeyForGroup).find(([groupId, shortKey]) =>
      shortKey.startsWith(key)
    );

    if (foundGroup) {
      const [groupId] = foundGroup;
      handleInputNewInformChange({
        target: {
          name: 'GroupId',
          value: parseInt(groupId)
        }
      });
    }
  };

  window.addEventListener('keydown', handleGroupKeySelect);
  return () => window.removeEventListener('keydown', handleGroupKeySelect);
}, [typeOFGroup]);

  const typeOfUseShortcuts = {
    r: 'R',
    s: 'S',
    n: 'N',
    g: 'G',
    h: 'H',
    t: 'T',
    e: 'E',
    o: 'O',
    x: 'WI',
    y: 'WC',
    p: 'P',
    m: 'M',
    v: 'V',
    d: 'D',
    i: 'I',
    b: 'B'
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if (accessLevel < 3) return;
      if (!typeOfUseList.length) return;
      if (!typeOFUseFocused) return; // wait for fetch

      const key = e.key.toLowerCase();
      const selectedType = typeOfUseShortcuts[key];

      if (selectedType) {
        const typeRow = typeOfUseList.find((x) => x.GroupId === selectedType);

        // update TypeOFUse
        handleInputNewInformChange({
          target: {
            name: 'TypeOFUse',
            value: selectedType
          }
        });

        // auto-set GroupId
        if (typeRow && typeRow.GroupId) {
          handleInputNewInformChange({
            target: {
              name: 'GroupId',
              value: typeRow.GroupId
            }
          });
        }
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [accessLevel, typeOfUseList, typeOFUseFocused]);

  useEffect(() => {
    const fetchGroupList = async () => {
      try {
        const result = await fetchTypeDescByGroupId();
        setTypeOfUseList(result);
      } catch (error) {
        console.error('Failed to fetch type of use list:', error);
      }
    };
    fetchGroupList();
  }, []);
  useEffect(() => {}, [typeOfUseListFilter]);
  useEffect(() => {
    if (!typeOfUseList.length) return;

    console.log(propertyNewDetails.GroupId, 'group list');
    const list = typeOfUseList.filter((item) => {
      console.log(item, 'list');
      return item.GroupID == propertyNewDetails.GroupId;
    });
    console.log(list, 'list');
    setTypeOfUseListFilter(list);
  }, [propertyNewDetails.GroupId]);

  return (
    <>
      {openPlotState ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <InputLabel>Type</InputLabel>

                <Select
                  labelId="type-of-use-label"
                  id="type-of-use-select"
                  value={propertyMastLocal.OpenPlotType ?? 0}
                  name="OpenPlotType"
                  onChange={handleChange}
                  style={{ height: 40 }}
                  disabled={accessLevel < 3}
                >
                  <MenuItem value="0" disable>
                    Select Type of Use
                  </MenuItem>
                  {TypeOFUsePrimeList.map((type) => (
                    <MenuItem key={type.ID} value={type.Type}>
                      {type.Description}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>Occupier Full Name(OP)</InputLabel>
                <TextField
                  required
                  name="OpenPlotOccupierName"
                  placeholder="Occupier Full Name(OP)"
                  fullWidth
                  autoComplete="family-name"
                  value={propertyMastLocal.OpenPlotOccupierName}
                  onChange={handleChange}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Stack spacing={1}>
                <InputLabel>भोगवटधाराचे पूर्ण नाव (OP)</InputLabel>
                <TextField
                  required
                  name="OpenPlotOccupierMarathiName"
                  placeholder="भोगवटधाराचे पूर्ण नाव (OP)"
                  fullWidth
                  autoComplete="family-name"
                  value={propertyMastLocal.OpenPlotOccupierMarathiName}
                  onChange={handleChange}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={1.2}>
            <Stack spacing={1}>
              <InputLabel>Floor</InputLabel>
              <Select
                name={'FloorID'}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.FloorID}
                error={!!errors.FloorID}
                helperText={errors.FloorID}
                FormHelperTextProps={{ style: { color: 'red' } }}
                displayEmpty
                inputProps={{ 'aria-label': 'Floor' }}
                sx={{ bgcolor: '#F5F5F5' }}
                disabled={accessLevel < 3}
                MenuProps={MenuProps}
              >
                <MenuItem value="" disabled>
                  Select Floor
                </MenuItem>
                {floorList.map((type) => (
                  <MenuItem key={type.FMId} value={type.FloorID}>
                    {type.FloorID}
                  </MenuItem>
                ))}
              </Select>
              {errors.FloorID && (
                <Typography variant="caption" sx={{ color: 'red', ml: 1 }}>
                  {errors.FloorID}
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>Year</InputLabel>
              <TextField
                required
                placeholder="ConstructionYear"
                name={'ConstructionYear'}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.ConstructionYear}
                fullWidth
                error={Boolean(errors.ConstructionYear)}
                helperText={errors.ConstructionYear}
                FormHelperTextProps={{ style: { color: 'red' } }}
                onKeyDown={handleNumberInput}
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>Construction Type</InputLabel>
              <Select
                labelId="construction-type-label"
                id="construction-type-select"
                name={'ConstructionType'}
                onFocus={() => setTypeOFConstruction(true)}
                onBlur={() => setTypeOFConstruction(false)}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.ConstructionType}
                style={{ height: 40 }}
                error={!!errors.ConstructionType}
                helperText={errors.ConstructionType}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3}
                MenuProps={MenuProps}
              >
                <MenuItem value="" disabled>
                  Select Construction
                </MenuItem>

                {constructionTypeList.map((type, index) => (
                  <MenuItem key={type.CTMId} value={type.ConstructionId}>
                    {type.Description} ({shortcutKeys[index]})
                  </MenuItem>
                ))}
              </Select>

              {errors.ConstructionType && (
                <Typography variant="caption" sx={{ color: 'red', ml: 1 }}>
                  {errors.ConstructionType}
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.3}>
            <Stack spacing={1}>
              <InputLabel>Group</InputLabel>

              <Select
                labelId="type-of-use-label"
                id="type-of-use-select"
                name="GroupId"
                onFocus={() => setTypeOFGroup(true)}
                onBlur={() => setTypeOFGroup(false)}
                value={propertyNewDetails.GroupId}
                onChange={handleInputNewInformChange}
                error={!!errors.GroupId}
                helperText={errors.GroupId}
                FormHelperTextProps={{ style: { color: 'red' } }}
                style={{ height: 40 }}
                disabled={accessLevel < 3}
                MenuProps={MenuProps}
              >
                <MenuItem value="" disabled>
                  Select Group
                </MenuItem>

                {groupList.map((group) => (
                  <MenuItem key={group.GroupID} value={group.GroupID}>
                    {group.GroupDescription} ({shortcutKeyForGroup[group.GroupID]})
                  </MenuItem>
                ))}
              </Select>

              {errors.GroupId && (
                <Typography variant="caption" sx={{ color: 'red', ml: 1 }}>
                  {errors.GroupId}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>Type of Use</InputLabel>
              <Select
                labelId="type-of-use-label"
                id="type-of-use-select"
                name="TypeOFUse"
                onFocus={() => setTypeOFUseFocused(true)}
                onBlur={() => setTypeOFUseFocused(false)}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.TypeOFUse}
                style={{ height: 40 }}
                error={!!errors.TypeOFUse}
                helperText={errors.TypeOFUse}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3}
                MenuProps={MenuProps}
              >
                {typeOfUseListFilter.map((item) => {
                  const shortcutKey = Object.entries(typeOfUseShortcuts).find(([key, id]) => id === item.TypeOfUseID)?.[0]; // get the key if mapped

                  return (
                    <MenuItem key={item.TypeOfUseID} value={item.TypeOfUseID}>
                      {item.Description} {shortcutKey ? `(${shortcutKey})` : ''}
                    </MenuItem>
                  );
                })}
              </Select>
              {errors.TypeOFUse && (
                <Typography variant="caption" sx={{ color: 'red', ml: 1 }}>
                  {errors.TypeOFUse}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={1.2}>
            <Stack spacing={1}>
              <InputLabel>No. of Rooms</InputLabel>
              <TextField
                required
                placeholder="No. of Rooms"
                fullWidth
                autoComplete="off"
                name={'NoOfRooms'}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.NoOfRooms}
                error={!!errors.NoOfRooms}
                helperText={errors.NoOfRooms}
                FormHelperTextProps={{ style: { color: 'red' } }}
                onKeyDown={handleNumberInput}
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Stack spacing={0}>
              <Button
                style={{ marginTop: 30 }}
                variant="contained"
                color="success"
                onClick={handleOpenDialog}
                disabled={!isValidRooms || submissionPermission == false}
              >
                Submission
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>Carpet SqFt</InputLabel>
              <TextField
                required
                placeholder="Carpet SqFt"
                fullWidth
                name="CarpetAreaSqFeet"
                value={propertyNewDetails.CarpetAreaSqFeet}
                onChange={(e) => {
                  const val = e.target.value;
                  // ✅ allow only numbers with up to 2 decimals
                  if (/^\d*\.?\d{0,2}$/.test(val)) {
                    const sqFt = parseFloat(val) || 0;
                    const sqMtr = parseFloat((sqFt * 0.093).toFixed(2));

                    setPropertyNewDetails((prev) => ({
                      ...prev,
                      CarpetAreaSqFeet: val,
                      CarpetAreaSqMeter: isNaN(sqMtr) ? '' : sqMtr
                    }));
                  }
                }}
                onKeyDown={(e) => {
                  // Block invalid keys like e, +, -
                  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                }}
                disabled={accessLevel < 3 || submissionPermission === true}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>Carpet Sq Mtr.</InputLabel>
              <TextField
                required
                placeholder="Carpet Sq Mtr."
                fullWidth
                name="CarpetAreaSqMeter"
                value={propertyNewDetails.CarpetAreaSqMeter}
                onChange={(e) => {
                  const val = e.target.value;
                  const sqMtr = parseFloat(val) || 0;
                  const sqFt = parseFloat((sqMtr * 10.764).toFixed(2));

                  setPropertyNewDetails((prev) => ({
                    ...prev,
                    CarpetAreaSqMeter: val,
                    CarpetAreaSqFeet: isNaN(sqFt) ? '' : sqFt
                  }));
                }}
                error={!!errors.CarpetAreaSqMeter}
                helperText={errors.CarpetAreaSqMeter}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3 || true}
                InputProps={{ readOnly: true /* keep true if only SqFt is editable */ }}
                onKeyDown={handleNumberDecimalInput}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>BuiltUp Sq Ft</InputLabel>

              <TextField
                fullWidth
                name="BuildUpAreaSqFeet"
                value={propertyNewDetails.BuildUpAreaSqFeet || ''}
                disabled={accessLevel < 3 || true}
                onChange={(e) => {
                  const value = e.target.value;
                  setPropertyNewDetails((prev) => ({
                    ...prev,
                    BuildUpAreaSqFeet: value
                  }));
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>BuiltUp Sq. Mtr.</InputLabel>

              <TextField
                fullWidth
                disabled={accessLevel < 3 || true}
                name="BuiltUpSqMFt"
                value={propertyNewDetails.BuildUpAreaSqMeter || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setPropertyNewDetails((prev) => ({
                    ...prev,
                    BuildUpAreaSqMeter: value
                  }));
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Stack spacing={1}>
              <InputLabel>Rooms</InputLabel>
              <TextField
                required
                placeholder="Rooms"
                fullWidth
                autoComplete="family-name"
                name="Room"
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.NoOfRooms}
                error={!!errors.Room}
                helperText={errors.Room}
                FormHelperTextProps={{ style: { color: 'red' } }}
                onKeyDown={handleNumberInput}
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.7}>
            <Stack spacing={1}>
              <InputLabel>Registration</InputLabel>
              <Select
                labelId="Registration-label"
                id="Registration-select"
                name="Registration"
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.Registration}
                style={{ height: 40 }}
                error={!!errors.Registration}
                helperText={errors.Registration}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3}
              >
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </Select>

              {errors.Registration && (
                <Typography variant="caption" sx={{ color: 'red', ml: 1 }}>
                  {errors.Registration}
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Stack spacing={1}>
              <InputLabel>Renter</InputLabel>
              <Select
                name="RenterYesNO"
                value={propertyNewDetails.RenterYesNO}
                onChange={handleInputNewInformChange}
                style={{ height: 40 }}
                disabled={accessLevel < 3}
              >
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={3.3}>
            <Stack spacing={1}>
              <InputLabel>Renter Full Name</InputLabel>
              <TextField
                required
                placeholder="Renter Full Name"
                name={'RenterName'}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.RenterName}
                fullWidth
                autoComplete="family-name"
                error={!!errors.RenterName}
                helperText={errors.RenterName}
                FormHelperTextProps={{ style: { color: 'red' } }}
                disabled={accessLevel < 3 || !isRenter}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Renter Name(Marathi) </InputLabel>
              <TextField
                required
                placeholder="Renter Name(Marathi)"
                fullWidth
                autoComplete="family-name"
                name={'RenterNameMarathi'}
                disabled={accessLevel < 3 || !isRenter}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.RenterNameMarathi}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={2.2}>
            <Stack spacing={1}>
              <InputLabel>Calculated Rent</InputLabel>
              <TextField
                required
                placeholder="Calculated Rent"
                fullWidth
                autoComplete="family-name"
                name={'Rent'}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.Rent}
                error={!!errors.Rent}
                helperText={errors.Rent}
                FormHelperTextProps={{ style: { color: 'red' } }}
                // onKeyDown={handleNumberInput}
                disabled={accessLevel < 3 || !isRenter}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2.1}>
            <Stack spacing={1}>
              <InputLabel>Non Calculated Rent</InputLabel>
              <TextField
                required
                placeholder="Non Calculated  Rent"
                fullWidth
                autoComplete="family-name"
                name={'NonCalculateRent'}
                onChange={handleInputNewInformChange}
                value={propertyNewDetails.NonCalculateRent}
                error={!!errors.NonCalculateRent}
                helperText={errors.NonCalculateRent}
                FormHelperTextProps={{ style: { color: 'red' } }}
                //  onKeyDown={handleNumberInput}
                disabled={accessLevel < 3 || !isRenter}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2.2} mt={1}>
            <Stack spacing={1}>
              <InputLabel>Agreement From Date</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={accessLevel < 3 || !isRenter}
                  value={propertyNewDetails.AgreementDate ? dayjs(propertyNewDetails.AgreementDate) : null}
                  onChange={(newValue) => {
                    const formattedDate = newValue ? newValue.toISOString() : null;
                    setPropertyNewDetails((prev) => ({
                      ...prev,
                      AgreementDate: formattedDate
                    }));
                    // ✅ Clear error on change
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      AgreementDate: ''
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(errors.AgreementDate),
                      helperText: errors.AgreementDate || '',
                      FormHelperTextProps: { style: { color: 'red' } }
                    }
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2.2} mt={2}>
            <Stack spacing={1}>
              <InputLabel>AgreementToDate</InputLabel>
            </Stack>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disabled={accessLevel < 3 || !isRenter}
                value={propertyNewDetails.AgreementToDate ? dayjs(propertyNewDetails.AgreementToDate) : null}
                onChange={(newValue) => {
                  const formattedDate = newValue ? newValue.toISOString() : null;
                  setPropertyNewDetails((prev) => ({
                    ...prev,
                    AgreementToDate: formattedDate
                  }));
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    AgreementToDate: ''
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.AgreementToDate),
                    helperText: errors.AgreementToDate || '',
                    FormHelperTextProps: { style: { color: 'red' } }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
            <Grid item>
              <Button variant="contained" onClick={handleCopyClick}>
                Copy
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handlePasteClick}>
                Paste
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={handleNewAddButtonClick}>
                Add
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3}></Grid>

          <Box component="span" m={1}>
            <TableContainer >
              <Table size="small" >
                <TableHead>
                  <TableRow>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                    <TableCell>Sr.No</TableCell>
                    <TableCell>Floor</TableCell>
                    <TableCell>Const Year</TableCell>
                    <TableCell>Const Type</TableCell>
                    <TableCell>Group Id</TableCell>
                    <TableCell>Type of Use</TableCell>
                    <TableCell>Carpet Area SqFt</TableCell>
                    <TableCell>Carpet Area SqMtr</TableCell>
                    <TableCell>Builtup Area SqFt</TableCell>
                    <TableCell>Builtup Area SqMtr</TableCell>
                    <TableCell>No of Rooms</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Registration</TableCell>
                    <TableCell>Renter</TableCell>
                    <TableCell>Renter Name</TableCell>
                    <TableCell>Renter Name Marathi</TableCell>
                    <TableCell>Calculated Rent</TableCell>
                    <TableCell>NonCalculated Rent</TableCell>
                    <TableCell>Agreement From Date</TableCell>               
                    <TableCell>Agreement To Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {propertyDetailsTableData?.length > 0 ? (
                    propertyDetailsTableData
                      .filter(
                        (data) =>
                          data.PDNId ||
                          data.OwnerID ||
                          data.ConstructionType ||
                          data.TypeOFUse ||
                          data.GroupDescription ||
                          data.CarpetAreaSqFeet ||
                          data.CarpetAreaSqMeter ||
                          data.BuildUpAreaSqFeet ||
                          data.BuildUpAreaSqMeter ||
                          data.NoOfRooms ||
                          data.Room ||
                          data.Registration ||
                          data.RenterYesNO ||
                          data.RenterName ||
                          data.RenterNameMarathi ||
                          data.Rent ||
                          data.NonCalculateRent ||
                          data.AgreementDate ||
                          data.AgreementToDate
                      )
                      .map((data, index) => (
                        <TableRow key={data.PDNId}>
                          <TableCell>
                            <IconButton
                              color={String(propertyNewDetails.PDNId) === String(data.PDNId) ? 'success' : 'primary'}
                              onClick={() => handleRowClick(data)}
                              disabled={accessLevel < 3}
                            >
                              {String(propertyNewDetails.PDNId) === String(data.PDNId) ? <SendOutlined /> : <EditTwoTone />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              name="cancel"
                              onClick={() => handleDeleteClick(data.PDNId)}
                              disabled={accessLevel < 3}
                            >
                              <CloseOutlined />
                            </IconButton>
                          </TableCell>

                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data.FloorID || ''}</TableCell>
                          <TableCell>{data.ConstructionYear || ''}</TableCell>
                          <TableCell>{data.ConstructionType || ''}</TableCell>
                          <TableCell>{data.GroupId || ''}</TableCell>
                          <TableCell>{data.TypeOFUse || ''}</TableCell>
                          <TableCell>{data.CarpetAreaSqFeet || 0}</TableCell>
                          <TableCell>{data.CarpetAreaSqMeter || 0}</TableCell>
                          <TableCell>{data.BuildUpAreaSqFeet || 0}</TableCell>
                          <TableCell>{data.BuildUpAreaSqMeter || 0}</TableCell>
                          <TableCell>{data.NoOfRooms || ''}</TableCell>
                          <TableCell>{data.Room || ''}</TableCell>
                          <TableCell>
                            {data.Registration == 1 || data.Registration === '1'
                              ? 'Yes'
                              : data.Registration == 0 || data.Registration === '0'
                                ? 'No'
                                : ''}
                          </TableCell>
                          <TableCell>
                            {data.RenterYesNO == 1 || data.RenterYesNO === '1'
                              ? 'Yes'
                              : data.RenterYesNO == 0 || data.RenterYesNO === '0'
                                ? 'No'
                                : ''}
                          </TableCell>
                          <TableCell>{data.RenterName || ''}</TableCell>
                          <TableCell>{data.RenterNameMarathi || ''}</TableCell>
                          <TableCell>{data.Rent || 0}</TableCell>
                          <TableCell>{data.NonCalculateRent || 0}</TableCell>
                          <TableCell>{data.AgreementDate ? new Date(data.AgreementDate).toLocaleDateString('en-GB') : ''}</TableCell>
                          <TableCell>{data.AgreementToDate ? new Date(data.AgreementToDate).toLocaleDateString('en-GB') : ''}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={20} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>Are you sure you want to delete this row?</DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete}>Cancel</Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openDialog}
            onClose={(event, reason) => {
              // Use a single variable for number of rooms
              const noOfRoomsValue = propertyNewDetails?.NoOfRooms;
              const noOfRoomsNum = Number(noOfRoomsValue);

              if (reason === 'backdropClick') {
                return;
              }

              if (reason === 'escapeKeyDown') {
                if (noOfRoomsNum !== selectedRooms.length) {
                  setSnackbarMessage('Please fill all room numbers.');
                  setSnackbarSeverity('error');
                  setSnackbarOpen(true);
                  setOpenDialog(false);
                  return;
                }
                handleCloseDialog();
                return;
              }

              handleCloseDialog();
            }}
            maxWidth="xl"
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">Room Wise Submission in SqFt</DialogTitle>
            <DialogContent>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={1.7}>
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <InputLabel>Room No.</InputLabel>
                    <Select
                      label="Room No"
                      multiple
                      value={selectedRooms}
                      onChange={handleRoomChange}
                      renderValue={(selected) => (selected || []).join(', ')}
                      // error={roomNoError}
                      MenuProps={MenuProps}
                      // disabled={totalRooms <= 0}
                    >
                      <MenuItem value="" disabled>
                        Select Room No.
                      </MenuItem>

                      {console.log(isSkipRoomType(propertyNewDetails.TypeOFUse), 'checking for list room no')}
                      {Array.from({ length: isSkipRoomType(propertyNewDetails.TypeOFUse) ? 50 : totalRooms }, (_, i) => {
                        console.log(i, 'checking for list');
                        return i + 1;
                      }).map((room) => {
                        return (
                          <MenuItem key={room} value={room} disabled={usedRoomsSet.has(room) && !selectedRooms.includes(room)}>
                            <Checkbox
                              checked={selectedRooms.includes(room)}
                              disabled={usedRoomsSet.has(room) && !selectedRooms.includes(room)}
                            />
                            <ListItemText primary={`${room}`} />
                          </MenuItem>
                        );
                      })}
                    </Select>

                    {/* {roomNoError && <span style={{ color: 'red', fontSize: 12 }}>Room No. is required</span>} */}
                  </Stack>
                </Grid>

                <Grid item xs={2} mt={1}>
                  <InputLabel>Room Type</InputLabel>

                  <FormControl fullWidth error={!!errors.selectedRoomType}>
                    <Select value={selectedRoomType} onChange={handleRoomTypeChange} displayEmpty MenuProps={MenuProps}>
                      <MenuItem value="" disabled>
                        Select Room Type
                      </MenuItem>
                      {roomTypeList.map((item) => (
                        <MenuItem key={item.id} value={item.roomType}>
                          {item.roomType}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.selectedRoomType && <FormHelperText>{errors.selectedRoomType}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={2} mt={1}>
                  <InputLabel>Room Shape</InputLabel>
                  <Select value={shape} onChange={handleShapeChange} fullWidth error={!!errors.shape} helperText={errors.shape || ''}>
                    {roomShapeList.map((shapeObj) => (
                      <MenuItem key={shapeObj.ShapeID} value={shapeObj.ShapeID}>
                        {shapeObj.RoomShapeName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {(() => {
                  const shapeObj = roomShapeList.find((s) => String(s.ShapeID) === String(shape));
                  if (!shapeObj || !shapeObj.Fields) return null;

                  return shapeObj.Fields.map((field) => (
                    <Grid item xs={2} key={field} mt={1}>
                      <InputLabel>{field}</InputLabel>
                      <TextField
                        name={field}
                        value={floorSubmissionDetails[field] || ''}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          if (name == 'Area') return;
                          else {
                            // ✅ Allow only numbers (and optional decimal point)
                            if (/^\d*\.?\d*$/.test(value)) {
                              setFloorSubmissionDetails((prev) => ({
                                ...prev,
                                [name]: value
                              }));

                              // clear error for this field
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors[field];
                                return newErrors;
                              });
                            }
                          }
                        }}
                        fullWidth
                        error={!!errors[field]}
                        helperText={errors[field] || ''}
                      />
                    </Grid>
                  ));
                })()}
                {renderSingleRoomAreaInput()}
                <Grid item xs={1.7}>
                  <Stack spacing={1}>
                    <InputLabel>Room Count</InputLabel>
                    <TextField required fullWidth value={selectedRooms.length} readOnly />
                  </Stack>
                </Grid>
                <Grid item xs={1.7}>
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <InputLabel>Is Minus</InputLabel>
                    <Select
                      labelId="is-minus-label"
                      id="is-minus-select"
                      value={isMinus ? 1 : 0}
                      onChange={(e) => {
                        const selectedValue = e.target.value; // 0 or 1

                        if (selectedValue == 1) {
                          setIsMinus(selectedValue);

                          return;
                        } else {
                          setIsMinus(selectedValue);
                        }
                      }}
                      fullWidth
                    >
                      <MenuItem
                        value={0}
                        onClick={() => {
                          if (tableMinusData.filter((row) => row.PDNId == currentPDNId).length >= 0) setOpenDialogDeleteIsMinus(true);
                        }}
                      >
                        No
                      </MenuItem>
                      <MenuItem value={1} onClick={() => setOpenDialogIsMinus(true)}>
                        Yes
                      </MenuItem>
                    </Select>
                  </Stack>
                </Grid>

                <Grid item xs={1.7}>
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <InputLabel>Is Outer</InputLabel>
                    <Select labelId="is-outer-label" id="is-outer-select" value={isOuter || 'No'} onChange={handleIsOuterChange} fullWidth>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </Stack>
                </Grid>

                <Grid item xs={1.7}>
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <InputLabel>Total</InputLabel>
                    <TextField required fullWidth value={adjustedAreaTotal} readOnly />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="contained" color="success" onClick={handleAddRow}>
                      Add
                    </Button>
                    <Button variant="contained" color="secondary" onClick={resetFields}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              {/* Table and Buttons Section */}
              <Grid container spacing={1} mt={3}>
                <Grid item xs={12} md={12}>
                  <TableContainer sx={{ maxWidth: '90vw' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {/* Fixed headers */}
                          <TableCell>Edit</TableCell>
                          <TableCell>Delete</TableCell>
                          <TableCell>Room Type</TableCell>

                          <TableCell>Room No</TableCell>
                          <TableCell>Room Shape</TableCell>

                          {/* ✅ Dynamic headers */}
                          {dynamicHeaders.map((header) => (
                            <TableCell key={header}>{header}</TableCell>
                          ))}
                          <TableCell>Area</TableCell>
                          <TableCell>Room Count</TableCell>
                          <TableCell>IsMinus</TableCell>
                          <TableCell>IsOuter</TableCell>

                          <TableCell>Total Area</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {tableData
                          ?.filter((row) => row?.PDNId === pdnId)
                          .map((row, idx) => {
                            return (
                              <TableRow key={row?.FSDId || idx}>
                                {/* Fixed cols */}
                                <TableCell>
                                  <Button onClick={() => handleEditRow(row)}>Edit</Button>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    color="error"
                                    onClick={() => {
                                      setRowToDelete(row);
                                      setFloorSubmissionDetailsDialogDelete(true);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>

                                <TableCell>{row.RoomType}</TableCell>
                                <TableCell>{Array.isArray(row?.RoomNo) && row.RoomNo.length > 0 ? row.RoomNo.join(', ') : '-'}</TableCell>

                                <TableCell>{row.RoomShapeName}</TableCell>
                                {dynamicHeaders.map((field) => (
                                  <TableCell key={field}>
                                    {row[field] !== undefined && row[field] !== null && row[field] !== '' ? row[field] : '-'}
                                  </TableCell>
                                ))}
                                <TableCell>{row.Area !== 0 ? Number(row.Area).toFixed(2) : ''}</TableCell>
                                {/* <TableCell>{selectedRooms.length}</TableCell> */}
                                <TableCell>{row.NoOfRooms || 0}</TableCell>

                                <TableCell>{row.isMinus === 1 || row.isMinus === 'Yes' ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{row.isOuter || row.InnerOuter}</TableCell>

                                <TableCell>{Number(row.TotalArea || 0).toFixed(2)}</TableCell>

                                {/* ✅ Dynamic cols */}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid display="flex" alignItems="center" justifyContent="space-evenly" mt={3}>
                <Button variant="contained" onClick={handleSubmitFloorDetails}>
                  Ok
                </Button>
              </Grid>
            </DialogContent>
          </Dialog>

          {/* mius */}
          <Dialog
            open={openDialogIsMinus}
            disableEscapeKeyDown
            onClose={handleCloseDialogIsMinus}
            maxWidth="xl"
          >
            <DialogContent>
              <Grid container spacing={2} ml={4} alignItems="center">
                {/* Room Shape Dropdown */}
                <Grid item xs={3} mt={1}>
                  <Stack spacing={1}>
                    <InputLabel>Room Shape</InputLabel>
                    <Select
                      fullWidth
                      value={minusShape}
                      onChange={(e) => setMinusShape(e.target.value)}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) return 'Select Shape';
                        const selectedShape = roomShapeList.find((item) => item.ShapeID === selected);
                        return selectedShape?.RoomShapeName || 'Select Shape';
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Shape
                      </MenuItem>
                      {roomShapeList.map((roomShape) => (
                        <MenuItem key={roomShape.ShapeID} value={roomShape.ShapeID}>
                          {roomShape.RoomShapeName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>

                {/* Minus Dialog Dynamic Inputs */}
                {roomShapeList
                  .find((s) => String(s.ShapeID) === String(minusShape))
                  ?.Fields?.map((field) => (
                    <Grid item xs={3} key={field} mt={1.2}>
                      <InputLabel>{field}</InputLabel>
                      <TextField
                        name={field}
                        value={FloorSubmissionDetailsMinus[field] || ''}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          // ✅ allow only numbers up to 2 decimals
                          if (/^\d*\.?\d{0,2}$/.test(value)) {
                            handleFloorSubmissionMinusChange(e);
                          }
                        }}
                        onKeyDown={(e) => {
                          // Optional: block E, +, - on keyboard
                          if (['e', 'E', '+', '-'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        error={Boolean(minusErrors[field])}
                        helperText={minusErrors[field] || ''}
                      />
                    </Grid>
                  ))}
                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <InputLabel>Total</InputLabel>
                    <TextField
                      required
                      fullWidth
                      value={(() => {
                        const shapeObj = roomShapeList.find((s) => String(s.ShapeID) === String(minusShape));
                        if (!shapeObj) return 0;

                        const values = {};
                        (shapeObj.Fields || [])?.forEach((f) => {
                          const raw = parseFloat(FloorSubmissionDetailsMinus[f]) || 0;
                          values[f] = toInches(raw); // ✅ convert to inches
                        });

                        try {
                          let area = calculateAreaFromShape(shapeObj, values);
                          area = sqInchToSqFeet(area); // ✅ convert to sq.ft
                          return parseFloat(area.toFixed(2));
                        } catch {
                          return 0;
                        }
                      })()}
                    />{' '}
                  </Stack>
                </Grid>
              </Grid>
              <Grid display={'flex'} justifyContent={'space-evenly'} mt={3}>
                <Button variant="contained" color="success" onClick={handleAddMinus}>
                  Add
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCancelMinus}>
                  Clear
                </Button>
              </Grid>
              <Grid mt={3} ml={8}>
                <TableContainer sx={{ maxWidth: '50vw' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {minusFixedHeaders.map((header) => (
                          <TableCell key={header}>{header}</TableCell>
                        ))}

                        {Array.isArray(minusDynamicHeaders) && minusDynamicHeaders.length > 0 ? (
                          minusDynamicHeaders.map((header, idx) => {
                            // helpful debug (will show in console)
                            if (idx === 0) {
                              console.log('Rendering dynamic headers:', minusDynamicHeaders);
                            }

                            const h = String(header).trim();
                            return <TableCell key={`dyn-${h}-${idx}`}>{h || '-'}</TableCell>;
                          })
                        ) : (
                          // optional: show placeholder column so table structure is visible
                          <TableCell key="dyn-placeholder">No dynamic fields</TableCell>
                        )}
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {(Array.isArray(tableMinusData) ? tableMinusData : [])
                        .filter((row) => row && String(row.FSDId ?? row.FSDID ?? '') === String(currentFSDId ?? ''))
                        .map((row, idx) => {
                          return (
                            <TableRow key={row.FSDMDId || idx}>
                              <TableCell>
                                <Button onClick={() => handleEditMinusRow(row)}>Edit</Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  color="error"
                                  onClick={() => {
                                    setRowToDeleteMinus(row);
                                    setOpenDeleteDialogMinus(true);
                                  }}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                              <TableCell>{row.RoomShapeName}</TableCell>
                              {minusDynamicHeaders.map((header) => (
                                <TableCell key={header}>{row[header] || '-'}</TableCell>
                              ))}
                              <TableCell>{row.Area}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Dialog open={openDeleteDialogMinus} onClose={() => setOpenDeleteDialogMinus(false)}>
                  <DialogTitle>Confirm Delete</DialogTitle>
                  <DialogContent>Are you sure you want to delete this row?</DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenDeleteDialogMinus(false)}>Cancel</Button>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => {
                        handleConfirmDeleteMinus(rowToDeleteMinus);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>

              {/* Final OK Button */}
              <Grid display={'flex'} justifyContent={'space-evenly'} mt={3}>
                <Button variant="contained" onClick={handleMinusAreaConfirm}>
                  Ok
                </Button>
              </Grid>
            </DialogContent>
          </Dialog>
        </Grid>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
            color: 'white',
            width: '100%',
            fontWeight: 'bold'
          }}
          message={snackbarMessage}
        />
      </Snackbar>

      <Dialog open={openDialogDeleteIsMinus} onClose={handleCloseOpenDialogDeleteIsMinus} fullWidth maxWidth="xs">
        <DialogContent>
          <Stack marginBottom={2}>
            <DialogContentText id="alert-dialog-description">Are you sure you want to delete minus data for this row</DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleAction} autoFocus>
            Ok
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCloseOpenDialogDeleteIsMinus} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={floorSubmissionDetailsDialogDelete}
        onClose={() => setFloorSubmissionDetailsDialogDelete(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <Stack marginBottom={2}>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete floor submission data for this row
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={() => handleActionToDeleteRow(rowToDelete)} autoFocus>
            Ok
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setFloorSubmissionDetailsDialogDelete(false)} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
