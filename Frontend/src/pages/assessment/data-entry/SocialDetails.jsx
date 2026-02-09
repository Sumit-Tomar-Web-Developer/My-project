
// export default SocialDetails;
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
    Stack,
  TextField,
  Box,
  Typography,
  FormControl,
 
  MenuItem,
  Select
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { setSocialData, setRToiletCToilet, setSocialErrors } from '../../../state/reducers/socialDetailsSlice';
import { setPropertySocialDetails, setRToiletInitialData, setCToiletInitialData } from '../../../state/reducers/ExistingPropertySlice';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTapSizes } from 'services/assessmentService/DataEntryService/dataEntryService';

function SocialDetails({ isNewProperty, newSocialDetailsData, setNewSocialDetailsData}) {
 

const [socialDetailsData, setSocialDetailsData] = useState({
  OwnerID: 0,
  NoOfWaterConnection: null,
  WaterConnectionType: '',
  IsWaterMeter: false,
  MeterStatus: '',
  WaterBillAreaName: '',
  WaterBillConnectionNo1: null,
  WaterBillMeterNo: null,
  WaterBillCustomerNo: '',
  ConnectionNo2: null,
  MeterNo2: null,
  ConnectionNo3: null,
  MeterNo3: null,
  ConnectionNo4: null,
  MeterNo4: null,
  ConnectionNo5: null,
  MeterNo5: null,
  IsTubeWell: false,
  NoOfTubeWell: null,
  IsBoar: false,
  NoOfBoar: null,
  IsWell: false,
  NoOfWell: null,
  IsHandPump: false,
  NoOfHandPump: null,
  IsSolar: false,
  NoOfSolar: null,
  IsLift: false,
  NoOfLift: null,
  IsFireSafety: false,
  NoOfFireSafety: null,
  ToiletSeatCountResidential: null,
  ToiletSeatCountNonResidential: null,
  NoOfTrees: null,
  IsWastewaterOutlet: false,
  IsEtpStp: false,
  IsHomeComposting: false,
  IsVermicompost: false,
  IsECharging: false,
  IsUndergroundSewage: false,
  IsUndergroundTank: false,
  IsBoosterPump: false,
  IsBuildingPermission: false,
  IsOcIssued: false,
  OcNo: null,
  IsRainwaterharvesting: false,
  RoadWidth: null,
  IsWaterConn: false,
  WaterRemark:"",
  ParkingRemark:"",
  BorewellRemark:"",
  CCNumber: null,
  WaterConnSize: '',
  DirectionEast: '',
  DirectionWest: '',
  DirectionNorth: '',
  DirectionSouth: ''
});


  const checkboxToNumberMap = {
  IsBoar: 'NoOfBoar',
  IsLift: 'NoOfLift',
  IsSolar: 'NoOfSolar',
  IsWell: 'NoOfWell',
  IsHandPump: 'NoOfHandPump',
  IsSepticTank: 'NoOfSepticTank',
  IsFireSafety: 'NoOfFireSafety',
  IsRainwaterharvesting: 'NoOfRainwaterharvesting',
  IsWaterConn: 'NoOfWaterConnection',
  IsBuildingPermission: 'CCNumber',
  IsOcIssued: 'OcNo'
};

  const [tapSizes, setTapSizes] = useState([]);

  const dispatch = useDispatch();
  const socialsData = useSelector((state) => state.socialDetails.newSocialData);
  const SocialInitialData = useSelector((state) => state.combinedDataEntry.combinedData.propertySocialDetails);



useEffect(() => {
  console.log('👀 newSocialDetailsData changed:', newSocialDetailsData);
}, [newSocialDetailsData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchTapSizes();
        console.log(res, 'tap sizes list');
        setTapSizes(res);
      } catch (err) {
        console.error('Error fetching tap sizes:', err);
      }
    };
    fetchData();
  }, []);

const reduxNewSocialErrors = useSelector(state => state.socialDetails.fieldErrors);
console.log('Redux new social data errors:', reduxNewSocialErrors);

useEffect(() => {
  if (isNewProperty) {
    console.log("Restoring new property social data & errors from Redux");
    if (reduxNewSocialErrors && Object.keys(reduxNewSocialErrors).length > 0) {
      setNewFieldErrors(reduxNewSocialErrors); // restore errors
    }
  }
}, [isNewProperty, reduxNewSocialErrors]);


const handleNewSocialDetailsChange = (e) => {
  const { name, type, value, checked } = e.target;
  console.log(`🖊 New field changed: ${name}, Type: ${type}, Value: ${type === 'checkbox' ? checked : value}`);

  const updated = { ...newSocialDetailsData };
  let newErrors = { ...newFieldErrors };
  const numericFields = Object.values(checkboxToNumberMap);

  if (type === 'checkbox') {
    updated[name] = checked;

    const linkedField = checkboxToNumberMap[name];
    if (!checked && linkedField) {
      updated[linkedField] = null; // clear linked number field
      newErrors[linkedField] = ''; // clear error
    }
  } else {
    if (numericFields.includes(name)) {
      // Keep raw input string to allow validation of non-numeric characters
      updated[name] = value === '' ? null : value;
      // Don't clear error here; validation will handle it
    } else {
      updated[name] = value;
      newErrors[name] = ''; // clear error for non-numeric fields on change
    }
  }

  // Run validation on updated data
  const validationErrors = validateCheckboxNumberPairs(updated, name);
  newErrors = { ...newErrors, ...validationErrors };

  setNewSocialDetailsData(updated);
  setNewFieldErrors(newErrors);

  const hasErrors = Object.values(newErrors).some(err => err && err.trim() !== '');
  console.log("🔍 Has validation errors in New Social Details:", hasErrors);

  // Dispatch errors to redux
      dispatch(
        setSocialErrors({
          hasErrors,
          fieldErrors: newErrors,
        })
      );


  if (type === 'checkbox' || !hasErrors) {
    console.log("✅ Dispatching New Social Data to Redux:", updated);
    dispatch(setSocialData(updated)); // or your specific action for new property
  } else {
    console.warn("🚫 Dispatch skipped due to validation errors in New Social Details.");
  }
};

useEffect(() => {
  if (!isNewProperty) {
    console.log(SocialInitialData, "initial social data from redux.");

    if (SocialInitialData) {
      setSocialDetailsData(SocialInitialData || {});

      // Run initial validation for existing data
      const initialErrors = validateCheckboxNumberPairs(SocialInitialData);

      console.log("Initial validation errors:", initialErrors);
      setFieldErrors(initialErrors);

      // Check if there are any errors
      const hasErrors = Object.values(initialErrors).some(err => err && err.trim() !== "");

      console.log("Has validation errors?", hasErrors);

      // Dispatch errors to redux
      dispatch(
        setSocialErrors({
          hasErrors,
          fieldErrors: initialErrors,
        })
      );

      if (hasErrors) {
        console.warn("⚠️ Existing property has missing required values:", initialErrors);
      }
    }
  }
}, [isNewProperty, SocialInitialData, dispatch]);



const handleSocialDetailsChange = (e) => {
  const { name, type, value, checked } = e.target;
  console.log(`🖊 Field changed: ${name}, Type: ${type}, Value: ${type === 'checkbox' ? checked : value}`);

  const updated = { ...socialDetailsData };
  let newErrors = { ...fieldErrors };
  const numericFields = Object.values(checkboxToNumberMap);

  if (type === 'checkbox') {
    updated[name] = checked;

    const linkedField = checkboxToNumberMap[name];
    if (!checked && linkedField) {
      updated[linkedField] = null; // clear number value
      newErrors[linkedField] = ''; // clear error
    }
  } else {
    if (numericFields.includes(name)) {
      updated[name] = value === '' ? null : Number(value);
      newErrors[name] = '';
    } else {
      updated[name] = value;
      newErrors[name] = '';
    }
  }

  // ✅ Run all checkbox-number validations
// inside handleSocialDetailsChange / handleNewSocialDetailsChange
const validationErrors = validateCheckboxNumberPairs(updated, checkboxToNumberMap);
newErrors = { ...newErrors, ...validationErrors };

  console.log("📋 Updated Data:", updated);
  console.log("❌ Validation Errors:", validationErrors);

  setSocialDetailsData(updated);
  setFieldErrors(newErrors);

  const hasErrors = Object.values(newErrors).some(err => err);
  console.log("🔍 Has validation errors:", hasErrors);

  // 📌 Always dispatch for checkbox toggles so UI stays in sync
  if (type === 'checkbox' || !hasErrors) {
    console.log("✅ Dispatching to Redux:", updated);
    dispatch(setPropertySocialDetails(updated));
  } else {
    console.warn("🚫 Dispatch skipped due to validation errors.");
  }
};

// helper: format the number-field label (special-case as you wanted)
const formatFieldName = (fieldName) => {
  if (fieldName === 'NoOfRainwaterharvesting') {
    return 'NoOfRainwater\nharvesting';
  }
  return fieldName;
};

// helper: treat different truthy representations as checked
const isTruthyChecked = (val) => {
  return val === true || val === 1
    || val === '1' || val === 'true' || val === 'True'
    || val === 'on' || val === 'yes' || val === 'YES';
};

// validator: if changedFieldName is omitted -> validate all pairs
// if changedFieldName provided -> validate only that pair (checkbox or its number)
const validateCheckboxNumberPairs = (data = {}, changedFieldName) => {
  const errors = {};

  const validatePair = (checkField, numberField) => {
    const checked = isTruthyChecked(data[checkField]);
    const rawNumber = data[numberField];
    const isEmpty = rawNumber === null || rawNumber === undefined || String(rawNumber).trim() === '';

    if (checked) {
      if (isEmpty) {
        errors[numberField] = `${formatFieldName(numberField)}\nIs required`;
        return;
      }

      // If user stored a string like "12" that's fine; check allowed characters
      const str = String(rawNumber).trim();
      if (!/^[0-9]+$/.test(str)) {
        errors[numberField] = 'Only numbers are allowed';
        return;
      }

      if (Number(str) <= 0) {
        errors[numberField] = 'Please enter a number greater than 0';
        return;
      }

      // valid -> clear any error
      errors[numberField] = '';
    } else {
      // checkbox unchecked -> ensure error cleared for that number field
      errors[numberField] = '';
    }
  };

  // if no changedFieldName -> validate ALL pairs
  if (!changedFieldName) {
    Object.entries(checkboxToNumberMap).forEach(([checkField, numberField]) => {
      validatePair(checkField, numberField);
    });
    return errors;
  }

  // if changedFieldName is a checkbox (key in the map)
  if (checkboxToNumberMap[changedFieldName]) {
    const numberField = checkboxToNumberMap[changedFieldName];
    validatePair(changedFieldName, numberField);
    return errors;
  }

  // if changedFieldName is one of the number fields -> find its checkbox and validate that pair
  const checkFieldForNumber = Object.keys(checkboxToNumberMap)
    .find(k => checkboxToNumberMap[k] === changedFieldName);
  if (checkFieldForNumber) {
    validatePair(checkFieldForNumber, changedFieldName);
    return errors;
  }

  // default: nothing to validate
  return errors;
};

  // const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [newFieldErrors, setNewFieldErrors] = useState({}); 

  

const handleNumberInput = (event, isNewProperty) => {
  const { key, target } = event;
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  const fieldName = target.name;

  if (!/^[0-9]$/.test(key) && !allowedKeys.includes(key)) {
    event.preventDefault();

    if (isNewProperty) {
      setNewFieldErrors((prev) => ({
        ...prev,
        [fieldName]: 'Only numbers are allowed',
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: 'Only numbers are allowed',
      }));
    }
  } else {
    if (isNewProperty) {
      setNewFieldErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  }
};


  //page access from redux

  
  const accessLevel = useSelector((state) => state.accessLevel.value);

  console.log('🔍 ConnectionNo2 value:', isNewProperty ? newSocialDetailsData.ConnectionNo2 : socialDetailsData.ConnectionNo2);

  return (
    <MainCard>
      <Grid container direction="row" spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={7.3}>
          <MainCard>
            <Grid container spacing={1} direction="row">
              {/* नळ जोळनी */}
              <Grid item xs={2.8}>
                <FormControlLabel
                  control={
                    <Checkbox
                     
                      name={isNewProperty ? 'IsWaterConn' : 'IsWaterConn'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsWaterConn : !!socialDetailsData.IsWaterConn}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                    />
                  }
                  label="Water Connection"
                />
              </Grid>
              <Grid item xs={1.1} ml={2} mt={1}>
                <InputLabel>No.</InputLabel>
              </Grid>
              {/* जोडणी संख्या */}
              <Grid item xs={2.5}>
                <TextField
                  // label="जोडणी संख्या"
                  fullWidth
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  name={isNewProperty ? 'NoOfWaterConnection' : 'NoOfWaterConnection'}
                  value={isNewProperty ? newSocialDetailsData.NoOfWaterConnection ??"" : socialDetailsData.NoOfWaterConnection??""}
                  disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsWaterConn : !socialDetailsData.IsWaterConn)}
                  onKeyDown={handleNumberInput}
                     error={!!(isNewProperty ? newFieldErrors.NoOfWaterConnection : fieldErrors.NoOfWaterConnection)}
                  
  helperText={
  (isNewProperty ? newFieldErrors.NoOfWaterConnection : fieldErrors.NoOfWaterConnection)
    ? (isNewProperty ? newFieldErrors.NoOfWaterConnection : fieldErrors.NoOfWaterConnection).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
                />
              </Grid>

              {/* साईझ*/}
              <Grid item xs={1.5} ml={2} mt={1}>
                <InputLabel>Size</InputLabel>
              </Grid>
              {/*Dropdown */}
              <Grid item xs={3.2}>
                <FormControl size="small" fullWidth>
                  <Select
                    displayEmpty
                    name={isNewProperty ? 'WaterConnSize' : 'WaterConnSize'}
                    value={isNewProperty ? newSocialDetailsData.WaterConnSize : socialDetailsData.WaterConnSize}
                    onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                    onKeyDown={handleNumberInput}
                    disabled={accessLevel < 3}
                  >
                    {tapSizes.map((tap) => (
                      <MenuItem key={tap.TapSizeId} value={tap.SizeAlias}>
                        {tap.SizeAlias}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={1} direction="row" sx={{ mt: 1 }}>
              {/* नळजोळनी प्रकार */}
              <Grid item xs={2.6}>
                <InputLabel>Water connection type</InputLabel>
              </Grid>
              <Grid item xs={3.2}>
                <FormControl size="small" fullWidth>
                  <Select
                    displayEmpty
                    name={isNewProperty ? 'WaterConnectionType' : 'WaterConnectionType'}
                    value={
                      isNewProperty
                        ? (newSocialDetailsData.WaterConnectionType || '').trim()
                        : (socialDetailsData.WaterConnectionType || '').trim()
                    }
                    onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                    onKeyDown={handleNumberInput}
                    disabled={accessLevel < 3}
                  >
                    <MenuItem value="निवासी"> निवासी </MenuItem>
                    <MenuItem value="व्यावसायिक">व्यावसायिक </MenuItem>
                    <MenuItem value="औद्योगिक">औद्योगिक </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* पाण्याचे मीटर */}
              <Grid item xs={2.5} ml={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={isNewProperty ? 'IsWaterMeter' : 'IsWaterMeter'}
                      sx={{ mr: 1 }}
                      checked={isNewProperty ? !!newSocialDetailsData.IsWaterMeter : !!socialDetailsData.IsWaterMeter}
                      //value={isNewProperty ? newSocialDetailsData.IsWaterMeter : socialDetailsData.IsWaterMeter}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  }
                  label="Water meter"
                />
              </Grid>

              {/* मीटर स्तिथी */}
              <Grid item xs={1.5} mt={1}>
                <InputLabel>Meter Status</InputLabel>
              </Grid>
              <Grid item xs={1.7}>
                <FormControl size="small" fullWidth>
                  <Select
                    displayEmpty
                    name={isNewProperty ? 'MeterStatus' : 'MeterStatus'}
                    sx={{ mr: 1 }}
                    value={isNewProperty ? (newSocialDetailsData.MeterStatus || '').trim() : (socialDetailsData.MeterStatus || '').trim()}
                    onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                    onKeyDown={handleNumberInput} disabled={isNewProperty ? !newSocialDetailsData.IsWaterMeter : !socialDetailsData.IsWaterMeter}
                  >
                    <MenuItem value="चालू">चालू</MenuItem>
                    <MenuItem value="बंद">बंद</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={1} direction="row" sx={{ mt: 1 }}>
              {/* पाणी पट्टी भागाचे नाव  */}
              <Grid item xs={2.6}>
                <InputLabel>Water Bill Area Name</InputLabel>
              </Grid>

              <Grid item xs={3.2}>
                <TextField
                  name={isNewProperty ? 'WaterBillAreaName' : 'WaterBillAreaName'}
                  sx={{ mr: 1 }}
                  value={isNewProperty ? newSocialDetailsData.WaterBillAreaName : socialDetailsData.WaterBillAreaName}
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                ></TextField>
              </Grid>
              {/* पाणी पट्टी जोडणी क्र. WaterBillConnectionNo1*/}
              <Grid item xs={2.5} ml={2}>
                <InputLabel>Water Bill Conn No. 1</InputLabel>
              </Grid>
              <Grid item xs={3.2}>
                <TextField
                  name={isNewProperty ? 'WaterBillConnectionNo1' : 'WaterBillConnectionNo1'}
                  sx={{ mr: 1 }}
                  value={isNewProperty ? newSocialDetailsData.WaterBillConnectionNo1 : socialDetailsData.WaterBillConnectionNo1}
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  onKeyDown={handleNumberInput}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} direction="row" sx={{ mt: 1 }}>
              <Grid item xs={2.6}>
                <InputLabel>Water Bill Meter No.1</InputLabel>
              </Grid>
              <Grid item xs={3.2}>
                <TextField
                  name={isNewProperty ? 'WaterBillMeterNo' : 'WaterBillMeterNo'}
                  sx={{ mr: 1 }}
                  value={isNewProperty ? newSocialDetailsData.WaterBillMeterNo : socialDetailsData.WaterBillMeterNo}
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  onKeyDown={handleNumberInput}
                />
              </Grid>
              <Grid item xs={2.5} ml={2}>
                <InputLabel>Water Bill Customer 1</InputLabel>
              </Grid>

              <Grid item xs={3.2}>
                <TextField
                  name={isNewProperty ? 'WaterBillCustomerNo' : 'WaterBillCustomerNo'}
                  sx={{ mr: 1 }}
                  value={isNewProperty ? newSocialDetailsData.WaterBillCustomerNo : socialDetailsData.WaterBillCustomerNo}
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  onKeyDown={handleNumberInput}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={4.7}>
          <MainCard>
            <Grid container spacing={2} mb={2}>
              {/* First block   */}
              <Grid item xs={6}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <InputLabel>Conn No. 2</InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                  
                    <TextField
                      fullWidth
                      name={isNewProperty ? 'ConnectionNo2' : 'ConnectionNo2'}
                      sx={{ mr: 1 }}
                      value={isNewProperty
  ? newSocialDetailsData.ConnectionNo2 ?? ''
  : socialDetailsData.ConnectionNo2 ?? ''}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Second block */}
              <Grid item xs={6}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <InputLabel>Meter No. 2</InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name={isNewProperty ? 'MeterNo2' : 'MeterNo2'}
                      sx={{ mr: 1 }}
                      value={isNewProperty ? newSocialDetailsData.MeterNo2??"" : socialDetailsData.MeterNo2??""}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              {/* First block */}
              <Grid item xs={6}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <InputLabel>Conn No. 3</InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name={isNewProperty ? 'ConnectionNo3' : 'ConnectionNo3'}
                      sx={{ mr: 1 }}
                      value={isNewProperty ? newSocialDetailsData.ConnectionNo3 : socialDetailsData.ConnectionNo3}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Second block */}
              <Grid item xs={6}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <InputLabel>Meter No. 3</InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name={isNewProperty ? 'MeterNo3' : 'MeterNo3'}
                      sx={{ mr: 1 }}
                      value={isNewProperty ? newSocialDetailsData.MeterNo3??"" : socialDetailsData.MeterNo3??""}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              {/* First block */}
              <Grid item xs={6}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <InputLabel>Conn No. 4</InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name={isNewProperty ? 'ConnectionNo4' : 'ConnectionNo4'}
                      sx={{ mr: 1 }}
                      value={isNewProperty ? newSocialDetailsData.ConnectionNo4 : socialDetailsData.ConnectionNo4}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Second block */}
              <Grid item xs={6}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <InputLabel>Meter No. 4</InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name={isNewProperty ? 'MeterNo4' : 'MeterNo4'}
                      sx={{ mr: 1 }}
                      value={isNewProperty ? newSocialDetailsData.MeterNo4 ??"": socialDetailsData.MeterNo4??""}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {/* First block */}
              <Grid item xs={6}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <InputLabel>Conn No. 5</InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name={isNewProperty ? 'ConnectionNo5' : 'ConnectionNo5'}
                      sx={{ mr: 1 }}
                      value={isNewProperty ? newSocialDetailsData.ConnectionNo5??"" : socialDetailsData.ConnectionNo5??""}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Second block */}
              <Grid item xs={6}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <InputLabel>Meter No. 5</InputLabel>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name={isNewProperty ? 'MeterNo5' : 'MeterNo5'}
                      sx={{ mr: 1 }}
                      value={isNewProperty ? newSocialDetailsData.MeterNo5 ??"": socialDetailsData.MeterNo5??""}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      onKeyDown={handleNumberInput}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MainCard>





<Grid container spacing={2} direction="row" alignItems="center" mt={1}>
  {/* Header */}
  <Grid item xs={1}>
    <InputLabel>No. of Toilets</InputLabel>
  </Grid>

  {/* Residential */}
  <Grid item xs={1}>
    <InputLabel>Residential</InputLabel>
  </Grid>

  <Grid item xs={2}>
    <TextField
      name="ToiletSeatCountResidential"
      value={
        isNewProperty
          ? newSocialDetailsData.ToiletSeatCountResidential
          : socialDetailsData.ToiletSeatCountResidential
      }
      onKeyDown={handleNumberInput}
      onChange={
        isNewProperty
          ? handleNewSocialDetailsChange
          : handleSocialDetailsChange
      }
      disabled={accessLevel < 3}
      fullWidth
    />
  </Grid>

  {/* Commercial */}
  <Grid item xs={1}>
    <InputLabel>Commercial</InputLabel>
  </Grid>

  <Grid item xs={2}>
    <TextField
      name="ToiletSeatCountNonResidential"
      value={
        isNewProperty
          ? newSocialDetailsData.ToiletSeatCountNonResidential
          : socialDetailsData.ToiletSeatCountNonResidential
      }
      onKeyDown={handleNumberInput}
      onChange={
        isNewProperty
          ? handleNewSocialDetailsChange
          : handleSocialDetailsChange
      }
      disabled={accessLevel < 3}
      fullWidth
    />
  </Grid>
</Grid>

            <Grid container spacing={2} direction="row" mt={1}>
              {/*जलपुनःभरण संख्या */}
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      
                      name={isNewProperty ? 'IsRainwaterharvesting' : 'IsRainwaterharvesting'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsRainwaterharvesting : !!socialDetailsData.IsRainwaterharvesting}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Rainwater Harvesting"
                />
              </Grid>
              {/* संख्या */}
              
              <Grid item xs={0.5} mt={1}>
                <InputLabel>No.</InputLabel>
              </Grid>
              <Grid item xs={1.1}>
                <TextField
                  name={isNewProperty ? 'NoOfRainwaterharvesting' : 'NoOfRainwaterharvesting'}
                   value={isNewProperty ? newSocialDetailsData.NoOfRainwaterharvesting ?? '' : socialDetailsData.NoOfRainwaterharvesting ?? ''}
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={
                    accessLevel < 3 ||
                    (isNewProperty ? !newSocialDetailsData.IsRainwaterharvesting : !socialDetailsData.IsRainwaterharvesting)
                  }
                onKeyDown={(e) => handleNumberInput(e, isNewProperty)}
                   error={!!(isNewProperty ? newFieldErrors.NoOfRainwaterharvesting : fieldErrors.NoOfRainwaterharvesting)}
helperText={
  (isNewProperty ? newFieldErrors.NoOfRainwaterharvesting : fieldErrors.NoOfRainwaterharvesting)
    ? (isNewProperty ? newFieldErrors.NoOfRainwaterharvesting : fieldErrors.NoOfRainwaterharvesting).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
                />
              </Grid>



              <Grid item xs={0.7} sx={{ml:5}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      
                      name={isNewProperty ? 'IsWell' : 'IsWell'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsWell : !!socialDetailsData.IsWell}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="well"
                />
              </Grid>
              <Grid item xs={0.5} mt={1}>
                <InputLabel>No.</InputLabel>
              </Grid>
              <Grid item xs={1.1}>
                <TextField
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsWell : !socialDetailsData.IsWell)}
                  name={isNewProperty ? 'NoOfWell' : 'NoOfWell'}
                  value={isNewProperty ? newSocialDetailsData.NoOfWell ??"" : socialDetailsData.NoOfWell??""}
                  onKeyDown={handleNumberInput}
                  error={!!(isNewProperty ? newFieldErrors.NoOfWell : fieldErrors.NoOfWell)}
 helperText={
  (isNewProperty ? newFieldErrors.NoOfWell : fieldErrors.NoOfWell)
    ? (isNewProperty ? newFieldErrors.NoOfWell : fieldErrors.NoOfWell).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
                />
              </Grid>
              <Grid item xs={0.7}sx={{ml:5}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      
                      name={isNewProperty ? 'IsBoar' : 'IsBoar'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsBoar : !!socialDetailsData.IsBoar}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Boar"
                />
              </Grid>
              {/* संख्या */}
              <Grid item xs={0.5} mt={1}>
                <InputLabel>No. </InputLabel>
              </Grid>
              <Grid item xs={1.1}>
                <TextField
                  name={isNewProperty ? 'NoOfBoar' : 'NoOfBoar'}
                  value={isNewProperty ? newSocialDetailsData.NoOfBoar??""  : socialDetailsData.NoOfBoar??"" }
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsBoar : !socialDetailsData.IsBoar)}
                  onKeyDown={handleNumberInput}
                     error={!!(isNewProperty ? newFieldErrors.NoOfBoar : fieldErrors.NoOfBoar)}
 helperText={
  (isNewProperty ? newFieldErrors.NoOfBoar : fieldErrors.NoOfBoar)
    ? (isNewProperty ? newFieldErrors.NoOfBoar : fieldErrors.NoOfBoar).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
/>
              </Grid>

              <Grid item xs={1.1}sx={{ml:2}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={isNewProperty ? 'IsHandPump' : 'IsHandPump'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsHandPump : !!socialDetailsData.IsHandPump}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Handpump"
                />
              </Grid>
              <Grid item xs={0.5} mt={1}>
                <InputLabel>No.</InputLabel>
              </Grid>
              <Grid item xs={1.1}>
                <TextField
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsHandPump : !socialDetailsData.IsHandPump)}
                  name={isNewProperty ? 'NoOfHandPump' : 'NoOfHandPump'}
                  value={isNewProperty ? newSocialDetailsData.NoOfHandPump??""  : socialDetailsData.NoOfHandPump??"" }
                  onKeyDown={handleNumberInput}
                     error={!!(isNewProperty ? newFieldErrors.NoOfHandPump : fieldErrors.NoOfHandPump)}
  helperText={
  (isNewProperty ? newFieldErrors.NoOfHandPump : fieldErrors.NoOfHandPump)
    ? (isNewProperty ? newFieldErrors.NoOfHandPump : fieldErrors.NoOfHandPump).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} direction="row" mt={1}>
              {/* अग्री सुरक्षा  ? */}
              <Grid item xs={1.3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={isNewProperty ? 'IsFireSafety' : 'IsFireSafety'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsFireSafety : !!socialDetailsData.IsFireSafety}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Fire Safety"
                />
              </Grid>

              <Grid item xs={0.4} mt={1}>
                <InputLabel>No.</InputLabel>
              </Grid>

              <Grid item xs={1.1}>
                <TextField
                 
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsFireSafety : !socialDetailsData.IsFireSafety)}
                  name={isNewProperty ? 'NoOfFireSafety' : 'NoOfFireSafety'}
                  value={isNewProperty ? newSocialDetailsData.NoOfFireSafety??""  : socialDetailsData.NoOfFireSafety??"" }
                  onKeyDown={handleNumberInput}
                    error={!!(isNewProperty ? newFieldErrors.NoOfFireSafety : fieldErrors.NoOfFireSafety)}
   helperText={
  (isNewProperty ? newFieldErrors.NoOfFireSafety : fieldErrors.NoOfFireSafety)
    ? (isNewProperty ? newFieldErrors.NoOfFireSafety : fieldErrors.NoOfFireSafety).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
                />
              </Grid>
              <Grid item xs={0.7}sx={{ml:5}}>
                <FormControlLabel
                  control={
                    <Checkbox
                     
                      name={isNewProperty ? 'IsSolar' : 'IsSolar'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsSolar : !!socialDetailsData.IsSolar}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Solar"
                />
              </Grid>
              <Grid item xs={0.4} mt={1}>
                <InputLabel> No </InputLabel>
              </Grid>
              <Grid item xs={1.1}>
                <TextField
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsSolar : !socialDetailsData.IsSolar)}
                  name={isNewProperty ? 'NoOfSolar' : 'NoOfSolar'}
                  value={isNewProperty ? newSocialDetailsData.NoOfSolar??""  : socialDetailsData.NoOfSolar??"" }
                  onKeyDown={handleNumberInput}
                    error={!!(isNewProperty ? newFieldErrors.NoOfSolar : fieldErrors.NoOfSolar)}
 helperText={
  (isNewProperty ? newFieldErrors.NoOfSolar : fieldErrors.NoOfSolar)
    ? (isNewProperty ? newFieldErrors.NoOfSolar : fieldErrors.NoOfSolar).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
                />
              </Grid>

              <Grid item xs={0.7} sx={{ml:5}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      
                      name={isNewProperty ? 'IsLift' : 'IsLift'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsLift : !!socialDetailsData.IsLift}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Lifts"
                />
              </Grid>

              <Grid item xs={0.5} mt={1}>
                <InputLabel>No.</InputLabel>
              </Grid>
              <Grid item xs={1.1}>
                <TextField
                  name={isNewProperty ? 'NoOfLift' : 'NoOfLift'}
                  value={isNewProperty ? newSocialDetailsData.NoOfLift??""  : socialDetailsData.NoOfLift??"" }
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsLift : !socialDetailsData.IsLift)}
                  onKeyDown={handleNumberInput}
                   error={!!(isNewProperty ? newFieldErrors.NoOfLift : fieldErrors.NoOfLift)}
 helperText={
  (isNewProperty ? newFieldErrors.NoOfLift : fieldErrors.NoOfLift)
    ? (isNewProperty ? newFieldErrors.NoOfLift : fieldErrors.NoOfLift).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
                />
              </Grid>
              <Grid item xs={1.4}sx={{ml:5}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={isNewProperty ? 'IsSepticTank' : 'IsSepticTank'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsSepticTank : !!socialDetailsData.IsSepticTank}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Septic Tank"
                />
              </Grid>
              <Grid item xs={0.5} mt={1}>
                <InputLabel>No.</InputLabel>
              </Grid>
              <Grid item xs={1.1}>
                <TextField
                  name={isNewProperty ? 'NoOfSepticTank' : 'NoOfSepticTank'}
                 value={isNewProperty ? newSocialDetailsData.NoOfSepticTank ?? '' : socialDetailsData.NoOfSepticTank ?? ''}

                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsSepticTank : !socialDetailsData.IsSepticTank)}
                  onKeyDown={handleNumberInput}
                    error={!!(isNewProperty ? newFieldErrors.NoOfSepticTank : fieldErrors.NoOfSepticTank)}
   helperText={
  (isNewProperty ? newFieldErrors.NoOfSepticTank : fieldErrors.NoOfSepticTank)
    ? (isNewProperty ? newFieldErrors.NoOfSepticTank : fieldErrors.NoOfSepticTank).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={2} direction="row">
              {/* तळटाकी */}
              <Grid item xs={2.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ mr: 1 }}
                      name={isNewProperty ? 'IsUndergroundTank' : 'IsUndergroundTank'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsUndergroundTank : !!socialDetailsData.IsUndergroundTank}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Septic Tanks"
                />
              </Grid>

              {/* बुस्टरपंप आहे का ? IsBoosterPump */}
              <Grid item xs={2.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ mr: 1 }}
                      name={isNewProperty ? 'IsBoosterPump' : 'IsBoosterPump'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsBoosterPump : !!socialDetailsData.IsBoosterPump}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Booster Pump"
                />
              </Grid>

              {/* कूपनलिका आहे का ?IsTubeWell*/}
              <Grid item xs={2.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ mr: 1 }}
                      name={isNewProperty ? 'IsTubeWell' : 'IsTubeWell'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsTubeWell : !!socialDetailsData.IsTubeWell}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Tube Well"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ mr: 1 }}
                      name={isNewProperty ? 'IsUndergroundSewage' : 'IsUndergroundSewage'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsUndergroundSewage : !!socialDetailsData.IsUndergroundSewage}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      disabled={accessLevel < 3}
                    />
                  }
                  label="Underground Sewage"
                />
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={2.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={isNewProperty ? 'IsEtpStp' : 'IsEtpStp'}
                      sx={{ mr: 1 }}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      checked={!!(isNewProperty ? newSocialDetailsData.IsEtpStp : socialDetailsData.IsEtpStp)}
                      onKeyDown={handleNumberInput}
                    />
                  }
                  label="ETP/STP"
                />
              </Grid>

              <Grid item xs={2.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ mr: 1 }}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      checked={!!(isNewProperty ? newSocialDetailsData.IsHomeComposting : socialDetailsData.IsHomeComposting)}
                      name={isNewProperty ? 'IsHomeComposting' : 'IsHomeComposting'}
                    />
                  }
                  label="Home Composting"
                />
              </Grid>
              <Grid item xs={2.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ mr: 1 }}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      name={isNewProperty ? 'IsVermicompost' : 'IsVermicompost'}
                      checked={isNewProperty ? !!newSocialDetailsData.IsVermicompost : !!socialDetailsData.IsVermicompost}
                      onKeyDown={handleNumberInput}
                    />
                  }
                  label="Vermi Compost"
                />
              </Grid>
              <Grid item xs={2.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ mr: 1 }}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      // disabled={
                      //   accessLevel < 3 ||
                      //   (isNewProperty ? !newSocialDetailsData.IsUndergroundSewage : !socialDetailsData.IsUndergroundSewage)
                      // }
                      checked={!!(isNewProperty ? newSocialDetailsData.IsECharging : socialDetailsData.IsECharging)}
                      name={isNewProperty ? 'IsECharging' : 'IsECharging'}
                      //value={isNewProperty ? newSocialDetailsData.IsECharging : socialDetailsData.IsECharging}
                      onKeyDown={handleNumberInput}
                    />
                  }
                  label="Is E-Charging"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} direction="row" sx={{ mt: 1 }}>
            

               {/* CC Section */}
  <Grid item xs={5}>
    <Grid container spacing={5} alignItems="center">
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              sx={{ mr: 1 }}
              onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
              name="IsBuildingPermission"
              checked={!!(isNewProperty ? newSocialDetailsData.IsBuildingPermission : socialDetailsData.IsBuildingPermission)}
              onKeyDown={handleNumberInput}
            />
          }
          label="Building Permission (CC)"
        />
      </Grid>
      <Grid item>
        <InputLabel>CC No.</InputLabel>
      </Grid>
      <Grid item>
        <TextField
          name="CCNumber"
          value={isNewProperty ? newSocialDetailsData.CCNumber ?? "" : socialDetailsData.CCNumber ?? ""}
          onKeyDown={handleNumberInput}
          autoComplete="given-name"
            disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsBuildingPermission : !socialDetailsData.IsBuildingPermission)}
          onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
          //disabled={accessLevel < 3}
          sx={{ width: '100px' }}
          error={!!(isNewProperty ? newFieldErrors.CCNumber : fieldErrors.CCNumber)}
                  
  helperText={
  (isNewProperty ? newFieldErrors.CCNumber : fieldErrors.CCNumber)
    ? (isNewProperty ? newFieldErrors.CCNumber : fieldErrors.CCNumber).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
        />
      </Grid>
    </Grid>
  </Grid>

  {/* OC Section */}
  <Grid item xs={4}>
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              sx={{ mr: 1 }}
              onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
              name="IsOcIssued"
              checked={!!(isNewProperty ? newSocialDetailsData.IsOcIssued : socialDetailsData.IsOcIssued)}
              onKeyDown={handleNumberInput}
            />
          }
          label="OC Issued"
        />
      </Grid>
      <Grid item>
        <InputLabel>Oc क्र.</InputLabel>
      </Grid>
      <Grid item>
        <TextField
          onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
          name="OcNo"
          value={isNewProperty ? newSocialDetailsData.OcNo ?? "" : socialDetailsData.OcNo ?? ""}
          onKeyDown={handleNumberInput}
             disabled={accessLevel < 3 || (isNewProperty ? !newSocialDetailsData.IsOcIssued : !socialDetailsData.IsOcIssued)}
          sx={{ width: '100px' }}
           error={!!(isNewProperty ? newFieldErrors.OcNo : fieldErrors.OcNo)}
                  
  helperText={
  (isNewProperty ? newFieldErrors.OcNo : fieldErrors.OcNo)
    ? (isNewProperty ? newFieldErrors.OcNo : fieldErrors.OcNo).split('\n').map((line, idx) => (
        <span key={idx}>{line}<br /></span>
      ))
    : ''
}
        />
      </Grid>
    </Grid>
  </Grid>
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ mr: 1 }}
                      onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                      name={isNewProperty ? 'IsWastewaterOutlet' : 'IsWastewaterOutlet'}
                      onKeyDown={handleNumberInput}
                      checked={!!(isNewProperty ? newSocialDetailsData.IsWastewaterOutlet : socialDetailsData.IsWastewaterOutlet)}
                    />
                  }
                  label="Waste Water Outlet"
                />
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={1.1} mt={1}>
                <InputLabel>Road Width</InputLabel>
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  name={isNewProperty ? 'RoadWidth' : 'RoadWidth'}
                  value={isNewProperty ? newSocialDetailsData.RoadWidth??"" : socialDetailsData.RoadWidth??""}
                  fullWidth
                  autoComplete="given-name"
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  onKeyDown={handleNumberInput}
                  disabled={accessLevel < 3}
                />
              </Grid>
              
              

              <Grid item xs={0.9} mt={1} sx={{ ml: 2 }}>
                <InputLabel>No of Trees</InputLabel>
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  name={isNewProperty ? 'NoOfTrees' : 'NoOfTrees'}
                  value={isNewProperty ? newSocialDetailsData.NoOfTrees??"" : socialDetailsData.NoOfTrees??""}
                  fullWidth
                  onKeyDown={handleNumberInput}
                  autoComplete="given-name"
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3}
                />
              </Grid>
            </Grid>

               <Grid container direction="row" spacing={2} sx={{ mt: 2 }}>
           
                  <Grid item xs={1.2} mt={1}>
                <InputLabel>Water Remark</InputLabel>
            
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  name={isNewProperty ? 'WaterRemark' : 'WaterRemark'}
                  value={isNewProperty ? newSocialDetailsData.WaterRemark??"" : socialDetailsData.WaterRemark??""}
                  fullWidth
                  autoComplete="given-name"
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                
                  disabled={accessLevel < 3}
                />
              </Grid>
               
              <Grid item xs={1.2} mt={1}>
                <InputLabel>Parking Remark</InputLabel>
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  name={isNewProperty ? 'ParkingRemark' : 'ParkingRemark'}
                  value={isNewProperty ? newSocialDetailsData.ParkingRemark??"" : socialDetailsData.ParkingRemark??""}
                  fullWidth
                 
                  autoComplete="given-name"
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3}
                />
              </Grid>
             
               <Grid item xs={0.4} />
              <Grid item xs={1.3} mt={1}>
                <InputLabel>Borewell Remark</InputLabel>
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  name={isNewProperty ? 'BorewellRemark' : 'BorewellRemark'}
                  value={isNewProperty ? newSocialDetailsData.BorewellRemark??"" : socialDetailsData.BorewellRemark??""}
               
                  autoComplete="given-name"
                  onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
                  disabled={accessLevel < 3}
                />
              </Grid>
              
          
            </Grid>

          </MainCard>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={2}>
              <Grid item xs={12}>
              <Accordion>
  <AccordionSummary
    aria-controls="panel1-content"
    id="panel1-header"
    sx={{ fontWeight: 'bolder' }}
  >
    Boundaries
  </AccordionSummary>
  <AccordionDetails>
    <Grid container spacing={2}>
      {[
        {
          label: 'East',
          name: 'DirectionEast',
          value: isNewProperty ? newSocialDetailsData.DirectionEast : socialDetailsData.DirectionEast
        },
        {
          label: 'West',
          name: 'DirectionWest',
          value: isNewProperty ? newSocialDetailsData.DirectionWest : socialDetailsData.DirectionWest
        },
        {
          label: 'North',
          name: 'DirectionNorth',
          value: isNewProperty ? newSocialDetailsData.DirectionNorth : socialDetailsData.DirectionNorth
        },
        {
          label: 'South',
          name: 'DirectionSouth',
          value: isNewProperty ? newSocialDetailsData.DirectionSouth : socialDetailsData.DirectionSouth
        }
      ].map((field, index) => (
        <Grid item xs={12} md={3} key={`direction-${index}`}>
          <Stack spacing={1}>
            <InputLabel sx={{ fontWeight: 'bold', fontSize: '12px' }}>
              {field.label}
            </InputLabel>
            <TextField
              required
              name={field.name}
              value={field.value}
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '16px',
                  padding: '10px'
                }
              }}
              onChange={isNewProperty ? handleNewSocialDetailsChange : handleSocialDetailsChange}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
      ))}

    </Grid>
  </AccordionDetails>
</Accordion>

              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default SocialDetails;
