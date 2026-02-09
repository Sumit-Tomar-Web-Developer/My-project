import { Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { fetchPrimeTypeOfUseList } from 'services/masterServices/prime-type-of-use-services/prime-type-of-use.services';
import { setAdditionalData, setFlatRate, setAdditionalErrors } from '../../../state/reducers/additionlPropertyDataSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialDrainData, setPropertyAdditionalDetails, setPropertyMastFormDataEntry } from 'state/reducers/ExistingPropertySlice.js';
import { setNewPropertyMast } from 'state/reducers/dataEntry/formDataPropertyMast.js';
export default function AdditionalPropertyInformation({
  isNewProperty,
  newAdditionalPropertyData,
  setNewAdditionalPropertyData,
  errors,
  setErrors
}) {
  const [drainFlatRate, setDrainFlatRate] = useState(false);
  const [drainFlatRateInitial, setDrainFlatRateInitial] = useState(false);

  const [TypeOFUsePrimeList, setTypeOFUsePrimeList] = useState([]);

  const [additionalPropertyData, setAdditionalPropertyData] = useState({
    MobileNo: '',
    PanCardNo: '',
    EmailID: '',
    AdharCardNo: '',
    PropertyRemark: '',
    CombPropRemark: '',
    PlotTaxableAreaSqFt: null,
    HearingObjNo: '',
    AppealCommObjNo: '',
    WadhGhatRemarkOne: '',
    WadhGhatRemarkTwo: '',
    WadhGhatRemarkThree: '',
    PropertyChange: '',
    FlatSystemRemark: '',
    BHK: null,
    OpenPlotLength: null,
    OpenPlotWidth: null
  });

  //page access from redux
  const accessLevel = useSelector((state) => state.accessLevel.value);

  const dispatch = useDispatch();
  const additionalData = useSelector((state) => state.additionalDetails.newAdditionalData);
  const FlatRate = useSelector((state) => state.additionalDetails.newDrainFlatRate);

  //fectching inital data
  const AdditionalInitialData = useSelector((state) => state.combinedDataEntry.combinedData.propertyMast);
  const DrainInitialData = useSelector((state) => state.combinedDataEntry.combinedData.drainFlatRate);

  console.log('DrainInitialDataaaaa:', DrainInitialData || 'not loaded yet');

  const newOpenPlot = useSelector((state) => state.propertyMastDetails.newPropertyData?.OpenPlot);

  console.log('newOpenPlot:', newOpenPlot);

  const existingOpenPlot = useSelector((state) => state.combinedDataEntry.combinedData?.propertyMast?.OpenPlot);
  console.log('existingOpenPlot:', existingOpenPlot);

  useEffect(() => {
    console.log('🔄 Redux newAdditionalData Updated:', newAdditionalPropertyData);
  }, [newAdditionalPropertyData]);

  useEffect(() => {
    if (FlatRate && FlatRate.drainFlatRate) {
      setDrainFlatRate(FlatRate.drainFlatRate);
    }
  }, [FlatRate]);

  //set current new social data from
  // useEffect(() => {
  //   if (additionalData) {
  //     setNewAdditionalPropertyData(additionalData);
  //   }
  // }, [additionalData]);
  useEffect(() => {
    if (isNewProperty && additionalData) {
      setNewAdditionalPropertyData(additionalData);
    }
  }, [additionalData, isNewProperty]);

  useEffect(() => {
    if (!isNewProperty) {
      setAdditionalPropertyData(AdditionalInitialData || []);
      const dataToValidate = { ...AdditionalInitialData };

      // Step 2: Run validation (same rules as handleBlur)
      let errors = {};

      if (dataToValidate.MobileNo && !/^\d{10}$/.test(dataToValidate.MobileNo)) {
        errors.MobileNo = 'Mobile number must be exactly 10 digits';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (dataToValidate.EmailID && !emailRegex.test(dataToValidate.EmailID)) {
        errors.EmailID = 'Invalid email address';
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (dataToValidate.PanCardNo && !panRegex.test(dataToValidate.PanCardNo.toUpperCase())) {
        errors.PanCardNo = 'Invalid PAN format (e.g. ABCDE1234F)';
      }

      if (dataToValidate.AdharCardNo && !/^\d{12}$/.test(dataToValidate.AdharCardNo)) {
        errors.AdharCardNo = 'Aadhaar number must be 12 digits';
      }

      if (dataToValidate.FlatSystemRemark === 'Yes' && (!dataToValidate.BHK || isNaN(dataToValidate.BHK))) {
        errors.BHK = 'BHK value is required when Flat System is Yes';
      }

      // Step 3: Update local state and Redux
      setFieldErrors(errors);
      const hasErrors = Object.values(errors).some((err) => err && err.trim() !== '');
      dispatch(setAdditionalErrors({ hasErrors, fieldErrors: errors }));

      console.log('Page Load Validation Errors:', errors, 'Has Errors:', hasErrors);

      if (DrainInitialData && DrainInitialData.DrainFlatRate !== undefined) {
        const mappedValue = DrainInitialData.DrainFlatRate ? '1' : '0';
        setDrainFlatRateInitial(mappedValue);
      }
      if (AdditionalInitialData) {
        setAdditionalPropertyData((prevState) => ({
          ...prevState,
          ...(AdditionalInitialData || []),
          Type: AdditionalInitialData.Type || ''
        }));
      }
    }
  }, [AdditionalInitialData, DrainInitialData, isNewProperty]);

  useEffect(() => {
    console.log('Errors:', errors);
    console.log('Data:', additionalPropertyData);
  }, [errors, additionalPropertyData]);

  const fieldTypes = {
    MobileNo: 'string',
    PanCardNo: 'string',
    EmailID: 'string',
    AdharCardNo: 'string',
    PropertyRemark: 'string',
    CombPropRemark: 'string',
    PlotTaxableAreaSqFt: 'number',
    HearingObjNo: 'string',
    AppealCommObjNo: 'string',
    WadhGhatRemarkOne: 'string',
    WadhGhatRemarkTwo: 'string',
    WadhGhatRemarkThree: 'string',
    PropertyChange: 'string',
    FlatSystemRemark: 'string',
    BHK: 'number',
    OpenPlotLength: 'number',
    OpenPlotWidth: 'number'
  };

  const [newFieldErrors, setNewFieldErrors] = useState({});

  // debug log
  console.log({
    newLength: newAdditionalPropertyData?.OpenPlotLength,
    newWidth: newAdditionalPropertyData?.OpenPlotWidth,
    existingLength: additionalPropertyData?.OpenPlotLength,
    existingWidth: additionalPropertyData?.OpenPlotWidth,
    newOpenPlot,
    existingOpenPlot
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Convert numbers if needed
    const fieldType = fieldTypes[name];
    if (fieldType === 'number') {
      updatedValue = value === '' ? null : Number(value);
    }

    // Special field mappings
    if (name === 'CombPropRemark') {
      updatedValue = value === 'Yes' ? 'Yes' : 'No';
    } else if (name === 'PropertyChange') {
      updatedValue = value === 'Change' ? 'change' : 'unchange';
    }

    if (isNewProperty) {
      // --- New Property ---
      setNewAdditionalPropertyData((prevState) => {
        const updatedState = { ...prevState, [name]: updatedValue };

        // Dynamic Plot Area calculation
        if (name === 'OpenPlotLength' || name === 'OpenPlotWidth') {
          const prevLength = prevState.OpenPlotLength ?? 0;
          const prevWidth = prevState.OpenPlotWidth ?? 0;

          const safeLength = parseFloat(name === 'OpenPlotLength' ? updatedValue : prevLength) || 0;
          const safeWidth = parseFloat(name === 'OpenPlotWidth' ? updatedValue : prevWidth) || 0;

          updatedState.PlotTaxableAreaSqFt = safeLength * safeWidth;

          // Dispatch to first tab & additional tab
          dispatch(setNewPropertyMast({ PlotTaxableAreaSqFt: updatedState.PlotTaxableAreaSqFt }));
          dispatch(setAdditionalData({ PlotTaxableAreaSqFt: updatedState.PlotTaxableAreaSqFt }));

          console.log('New Property PlotArea:', updatedState.PlotTaxableAreaSqFt);
        }

        if (name === 'FlatSystemRemark' && updatedValue === 'No') {
          updatedState.BHK = null;
        }

        dispatch(setAdditionalData(updatedState));
        return updatedState;
      });
    } else {
      // --- Existing Property ---
      setAdditionalPropertyData((prevState) => {
        const updatedState = { ...prevState, [name]: updatedValue };

        // Dynamic Plot Area calculation
        if (name === 'OpenPlotLength' || name === 'OpenPlotWidth') {
          const prevLength = prevState.OpenPlotLength ?? additionalPropertyData?.OpenPlotLength ?? 0;
          const prevWidth = prevState.OpenPlotWidth ?? additionalPropertyData?.OpenPlotWidth ?? 0;

          const safeLength = parseFloat(name === 'OpenPlotLength' ? updatedValue : prevLength) || 0;
          const safeWidth = parseFloat(name === 'OpenPlotWidth' ? updatedValue : prevWidth) || 0;

          updatedState.PlotTaxableAreaSqFt = safeLength * safeWidth;

          // Dispatch to first tab & additional tab
          dispatch(setPropertyMastFormDataEntry({ PlotTaxableAreaSqFt: updatedState.PlotTaxableAreaSqFt }));
          dispatch(setAdditionalData({ PlotTaxableAreaSqFt: updatedState.PlotTaxableAreaSqFt }));

          console.log('Existing Property PlotArea:', updatedState.PlotTaxableAreaSqFt);
        }

        if (name === 'FlatSystemRemark' && updatedValue === 'No') {
          updatedState.BHK = null;
        }

        dispatch(setAdditionalData(updatedState));
        dispatch(setPropertyAdditionalDetails(updatedState));
        return updatedState;
      });
    }
  };

  const handleDrainFlatRateChange = (e) => {
    const { name, value } = e.target;

    if (name === 'drainFlatRate') {
      setDrainFlatRate(value);
    }

    dispatch(
      setFlatRate({
        [name]: value
      })
    );
  };

  // const handleDrainFlatRateChangeInitial = (e) => {
  //   const newValue = e.target.value === 'true';
  //   setDrainFlatRateInitial(newValue);
  //   dispatch(setInitialDrainData(newValue));
  //   //setUpdateDummy((prev) => prev + 1); // Force re-render
  // };

  const handleDrainFlatRateChangeInitial = (e) => {
    const newValue = e.target.value; // "1" or "0"
    setDrainFlatRateInitial(newValue);

    dispatch(setInitialDrainData(newValue === '1' ? 1 : 0));
  };

  useEffect(() => {
    const fetchTypeOFUse = async () => {
      try {
        const fetchedTypeOFUse = await fetchPrimeTypeOfUseList();
        setTypeOFUsePrimeList(fetchedTypeOFUse);
      } catch (error) {
        console.error('Error fetching type of use:', error);
        setTypeOFUsePrimeList([]);
      }
    };
    fetchTypeOFUse();
  }, []);
  const handleInput = (e) => {
    // Check if the input is a number using a regular expression
    if (!/^[0-9]*$/.test(e.target.value)) {
      e.preventDefault(); // Prevent non-numeric input
    }
  };
  useEffect(() => {
    console.log('Updated drainFlatRateInitial:', drainFlatRateInitial);
  }, [drainFlatRateInitial]);

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (isNewProperty) {
      // Validation for New Property
      switch (name) {
        case 'MobileNo':
          setNewFieldErrors((prev) => ({
            ...prev,
            MobileNo: value && !/^\d{10}$/.test(value) ? 'Mobile number must be exactly 10 digits' : ''
          }));
          break;

        case 'EmailID':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          setNewFieldErrors((prev) => ({
            ...prev,
            EmailID: value && !emailRegex.test(value) ? 'Invalid email address' : ''
          }));
          break;

        case 'PanCardNo':
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          setNewFieldErrors((prev) => ({
            ...prev,
            PanCardNo: value && !panRegex.test(value.toUpperCase()) ? 'Invalid PAN format (e.g. ABCDE1234F)' : ''
          }));
          break;

        case 'AdharCardNo':
          setNewFieldErrors((prev) => ({
            ...prev,
            AdharCardNo: value && !/^\d{12}$/.test(value) ? 'Aadhaar number must be 12 digits' : ''
          }));
          break;
      }
    } else {
      // Validation for Existing Property
      switch (name) {
        case 'MobileNo':
          setFieldErrors((prev) => ({
            ...prev,
            MobileNo: value && !/^\d{10}$/.test(value) ? 'Mobile number must be exactly 10 digits' : ''
          }));
          break;

        case 'EmailID':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          setFieldErrors((prev) => ({
            ...prev,
            EmailID: value && !emailRegex.test(value) ? 'Invalid email address' : ''
          }));
          break;

        case 'PanCardNo':
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          setFieldErrors((prev) => ({
            ...prev,
            PanCardNo: value && !panRegex.test(value.toUpperCase()) ? 'Invalid PAN format (e.g. ABCDE1234F)' : ''
          }));
          break;

        case 'AdharCardNo':
          setFieldErrors((prev) => ({
            ...prev,
            AdharCardNo: value && !/^\d{12}$/.test(value) ? 'Aadhaar number must be 12 digits' : ''
          }));
          break;
      }
    }
  };

  const handleNumberInputArea = (event) => {
    const { key } = event;
    if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Tab') {
      event.preventDefault();
      setErrorMessage('Only numbers are allowed');
    } else {
      setErrorMessage(''); // Clear error message on valid input
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
      setErrorMessage('Only numbers are allowed');
    } else if (currentValue.length >= 12 && /^[0-9]$/.test(key)) {
      // Prevent input if the length is 12 digits and the user tries to add another digit
      event.preventDefault();
      setErrorMessage('Aadhar Card number cannot exceed 12 digits');
    } else {
      setErrorMessage(''); // Clear error message on valid input
    }
  };

  const handleNumberMBInput = (event) => {
    const { key, target } = event;
    const currentValue = target.value;

    if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Tab') {
      event.preventDefault();
      setFieldErrors((prev) => ({
        ...prev,
        MobileNo: 'Only numbers are allowed'
      }));
    } else if (currentValue.length >= 10 && /^[0-9]$/.test(key)) {
      event.preventDefault();
      setFieldErrors((prev) => ({
        ...prev,
        MobileNo: 'Mobile number cannot exceed 10 digits'
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        MobileNo: ''
      }));
    }
  };

  const [fieldErrors, setFieldErrors] = useState({
    MobileNo: '',
    PanCardNo: '',
    AdharCardNo: '',
    EmailID: '',
    BHK: ''
  });
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Mob./PhNo.</InputLabel>
            <TextField
              required
              placeholder="Mob./PhNo."
              fullWidth
              autoComplete="given-name"
              name={isNewProperty ? 'MobileNo' : 'MobileNo'}
              value={isNewProperty ? newAdditionalPropertyData.MobileNo : additionalPropertyData.MobileNo}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={!!fieldErrors.MobileNo}
              // helperText={fieldErrors.MobileNo}
              error={isNewProperty ? !!newFieldErrors.MobileNo : !!fieldErrors.MobileNo}
              helperText={isNewProperty ? newFieldErrors.MobileNo : fieldErrors.MobileNo}
              //FormHelperTextProps={{ style: { color: 'red' } }}
              onKeyDown={handleNumberMBInput}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Pan Card No.</InputLabel>
            <TextField
              required
              placeholder="Pan Card No."
              fullWidth
              autoComplete="given-name"
              name={isNewProperty ? 'PanCardNo' : 'PanCardNo'}
              value={isNewProperty ? newAdditionalPropertyData.PanCardNo : additionalPropertyData.PanCardNo}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={!!fieldErrors.PanCardNo}
              // helperText={fieldErrors.PanCardNo}
              error={isNewProperty ? !!newFieldErrors.PanCardNo : !!fieldErrors.PanCardNo}
              helperText={isNewProperty ? newFieldErrors.PanCardNo : fieldErrors.PanCardNo}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Email Id</InputLabel>
            <TextField
              required
              placeholder="Email Id"
              fullWidth
              autoComplete="family-name"
              name={isNewProperty ? 'EmailID' : 'EmailID'}
              value={isNewProperty ? newAdditionalPropertyData.EmailID : additionalPropertyData.EmailID}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={!!fieldErrors.EmailID}
              // helperText={fieldErrors.EmailID}
              error={isNewProperty ? !!newFieldErrors.EmailID : !!fieldErrors.EmailID}
              helperText={isNewProperty ? newFieldErrors.EmailID : fieldErrors.EmailID}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Adhar Card No.</InputLabel>
            <TextField
              required
              placeholder="Adhar Card No."
              fullWidth
              autoComplete="family-name"
              name={isNewProperty ? 'AdharCardNo' : 'AdharCardNo'}
              value={isNewProperty ? newAdditionalPropertyData.AdharCardNo : additionalPropertyData.AdharCardNo}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={!!fieldErrors.AdharCardNo}
              // helperText={fieldErrors.AdharCardNo}
              error={isNewProperty ? !!newFieldErrors.AdharCardNo : !!fieldErrors.AdharCardNo}
              helperText={isNewProperty ? newFieldErrors.AdharCardNo : fieldErrors.AdharCardNo}
              FormHelperTextProps={{ style: { color: 'red' } }}
              // onInput={handleInput}
              onKeyDown={handleNumberInput}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Property Remark</InputLabel>
            <TextField
              required
              placeholder="Property Remark"
              fullWidth
              autoComplete="family-name"
              name={isNewProperty ? 'PropertyRemark' : 'PropertyRemark'}
              value={isNewProperty ? newAdditionalPropertyData.PropertyRemark : additionalPropertyData.PropertyRemark}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.PropertyRemark}
              helperText={errors.PropertyRemark}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Is Combine Property</InputLabel>
            <Select
              labelId="registration-label"
              id="registration-select"
              name={isNewProperty ? 'CombPropRemark' : 'CombPropRemark'}
              value={
                isNewProperty
                  ? newAdditionalPropertyData.CombPropRemark === 'Yes'
                    ? 'Yes'
                    : 'No'
                  : additionalPropertyData.CombPropRemark === 'Yes'
                    ? 'Yes'
                    : 'No'
              }
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ height: 40 }}
              error={!!errors.CombPropRemark}
              helperText={errors.CombPropRemark}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </Stack>
        </Grid>
        {/* <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Plot Taxable Area(SqFt)</InputLabel>
            <TextField
              required
              placeholder="Plot Taxable Area(SqFt)"
              fullWidth
              autoComplete="family-name"
              name={isNewProperty ? 'PlotTaxableAreaSqFt' : 'PlotTaxableAreaSqFt'}
                value={
        isNewProperty
          ? newAdditionalPropertyData.PlotTaxableAreaSqFt
          : (additionalPropertyData?.OpenPlot
              ? additionalPropertyData.PlotTaxableAreaSqFt
              : '')
      }
              // onChange={handleChange}
              // onBlur={handleBlur}
              // error={!!errors.PlotTaxableAreaSqFt}
              // helperText={errors.PlotTaxableAreaSqFt}
              // FormHelperTextProps={{ style: { color: 'red' } }}
              // onKeyDown={handleNumberInputArea}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid> */}
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Plot Taxable Area (SqFt)</InputLabel>

            <TextField
              required
              placeholder="Plot Taxable Area (SqFt)"
              fullWidth
              autoComplete="family-name"
              name="PlotTaxableAreaSqFt"
              //      value={
              //   isNewProperty
              //     ? newAdditionalPropertyData?.OpenPlot
              //       ? newAdditionalPropertyData?.PlotTaxableAreaSqFt ?? ''
              //       : ''
              //     : additionalPropertyData?.OpenPlot
              //       ? additionalPropertyData?.PlotTaxableAreaSqFt ?? ''
              //       : ''
              // }
              value={
                isNewProperty
                  ? newOpenPlot
                    ? newAdditionalPropertyData?.OpenPlotLength && newAdditionalPropertyData?.OpenPlotWidth
                      ? (
                          parseFloat(newAdditionalPropertyData.OpenPlotLength) * parseFloat(newAdditionalPropertyData.OpenPlotWidth)
                        ).toString()
                      : newAdditionalPropertyData?.PlotTaxableAreaSqFt ?? ''
                    : ''
                  : existingOpenPlot
                    ? additionalPropertyData?.OpenPlotLength && additionalPropertyData?.OpenPlotWidth
                      ? (parseFloat(additionalPropertyData.OpenPlotLength) * parseFloat(additionalPropertyData.OpenPlotWidth)).toString()
                      : additionalPropertyData?.PlotTaxableAreaSqFt ?? ''
                    : ''
              }
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.PlotTaxableAreaSqFt}
              helperText={errors.PlotTaxableAreaSqFt}
              FormHelperTextProps={{ style: { color: 'red' } }}
              onKeyDown={handleNumberInputArea}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Hearing Objection No.</InputLabel>
            <TextField
              required
              placeholder="Hearing Objection No."
              fullWidth
              autoComplete="given-name"
              name={isNewProperty ? 'HearingObjNo' : 'HearingObjNo'}
              value={isNewProperty ? newAdditionalPropertyData.HearingObjNo : additionalPropertyData.HearingObjNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.HearingObjNo}
              helperText={errors.HearingObjNo}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Appeal Comm. Objective No.</InputLabel>
            <TextField
              required
              placeholder="Appeal Comm. Objective No."
              fullWidth
              autoComplete="given-name"
              name={isNewProperty ? 'AppealCommObjNo' : 'AppealCommObjNo'}
              value={isNewProperty ? newAdditionalPropertyData.AppealCommObjNo : additionalPropertyData.AppealCommObjNo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.AppealCommObjNo}
              helperText={errors.AppealCommObjNo}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Wadh Ghat Remark</InputLabel>
            <TextField
              required
              placeholder="Wadh Ghat Remark"
              fullWidth
              autoComplete="family-name"
              name={isNewProperty ? 'WadhGhatRemarkOne' : 'WadhGhatRemarkOne'}
              value={isNewProperty ? newAdditionalPropertyData.WadhGhatRemarkOne : additionalPropertyData.WadhGhatRemarkOne}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.WadhGhatRemarkOne}
              helperText={errors.WadhGhatRemarkOne}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>IsProperty Changes</InputLabel>
            <Select
              labelId="is-combined-prop-label"
              id="is-combined-prop-select"
              onChange={handleChange}
              name={isNewProperty ? 'PropertyChange' : 'PropertyChange'}
              error={!!errors.PropertyChange}
              helperText={errors.PropertyChange}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
              value={
                isNewProperty
                  ? newAdditionalPropertyData.PropertyChange === 'change'
                    ? 'Change'
                    : 'UnChange'
                  : additionalPropertyData.PropertyChange === 'change'
                    ? 'Change'
                    : 'UnChange'
              }
              style={{ height: 35 }}
            >
              <MenuItem value="UnChange">UnChange</MenuItem>
              <MenuItem value="Change">Change</MenuItem>
            </Select>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>DrainTax FlatRate</InputLabel>
            <Select
              required
              placeholder="DrainTax FlatRate"
              fullWidth
              {...(isNewProperty && { name: 'drainFlatRate' })}
              // value={isNewProperty ? FlatRate.drainFlatRate : drainFlatRateInitial ? 'true' : 'false'}
              value={
                isNewProperty
                  ? String(FlatRate.drainFlatRate) // convert number to string
                  : drainFlatRateInitial // already string "1" or "0"
              }
              onChange={isNewProperty ? handleDrainFlatRateChange : handleDrainFlatRateChangeInitial}
              onBlur={handleBlur}
              style={{ height: 40 }}
              // error={!!errors.Occupier}
              //   helperText={errors.Occupier}
              //   FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            >
              <MenuItem value="1">Yes</MenuItem>
              <MenuItem value="0">No</MenuItem>
            </Select>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>IsFlat System</InputLabel>
            <Select
              labelId="registration-label"
              id="registration-select"
              onChange={handleChange}
              onBlur={handleBlur}
              name={isNewProperty ? 'FlatSystemRemark' : 'FlatSystemRemark'}
              error={!!errors.FlatSystemRemark}
              helperText={errors.FlatSystemRemark}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
              value={
                isNewProperty
                  ? newAdditionalPropertyData.FlatSystemRemark === 'Yes'
                    ? 'Yes'
                    : 'No'
                  : additionalPropertyData.FlatSystemRemark === 'Yes'
                    ? 'Yes'
                    : 'No'
              }
              style={{ height: 40 }}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>BHK</InputLabel>
            {/* <TextField
              required
              placeholder="BHK"
              fullWidth
              autoComplete="family-name"
              name={isNewProperty ? 'BHK' : 'BHK'}
              onBlur={handleBlur}
              value={isNewProperty ? newAdditionalPropertyData.BHK : additionalPropertyData.BHK}
              onChange={handleChange}
              error={!!errors.BHK}
              helperText={errors.BHK}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={
                accessLevel < 3 ||
                (isNewProperty ? newAdditionalPropertyData.FlatSystemRemark !== 'Yes' : additionalPropertyData.FlatSystemRemark !== 'Yes')
              }
            /> */}
            <TextField
              required
              placeholder="BHK"
              fullWidth
              autoComplete="family-name"
              name="BHK"
              onBlur={handleBlur}
              value={isNewProperty ? newAdditionalPropertyData.BHK ?? '' : additionalPropertyData.BHK ?? ''}
              onChange={handleChange}
              // error={!!errors.BHK}
              // helperText={errors.BHK}
              error={isNewProperty ? !!newFieldErrors.BHK : !!fieldErrors.BHK}
              helperText={isNewProperty ? newFieldErrors.BHK : fieldErrors.BHK}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={
                accessLevel < 3 ||
                (isNewProperty ? newAdditionalPropertyData.FlatSystemRemark !== 'Yes' : additionalPropertyData.FlatSystemRemark !== 'Yes')
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel> Wadh Ghat Remark [1]</InputLabel>
            <TextField
              name={isNewProperty ? 'WadhGhatRemarkTwo' : 'WadhGhatRemarkTwo'}
              value={isNewProperty ? newAdditionalPropertyData.WadhGhatRemarkTwo : additionalPropertyData.WadhGhatRemarkTwo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.WadhGhatRemarkTwo}
              helperText={errors.WadhGhatRemarkTwo}
              FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Wadh Ghat Remark [2] </InputLabel>
            <TextField
              name={isNewProperty ? 'WadhGhatRemarkThree' : 'WadhGhatRemarkThree'}
              value={isNewProperty ? newAdditionalPropertyData.WadhGhatRemarkThree : additionalPropertyData.WadhGhatRemarkThree}
              onChange={handleChange}
              onBlur={handleBlur}
              // error={!!errors.WadhGhatRemarkThree}
              // helperText={errors.WadhGhatRemarkThree}
              // FormHelperTextProps={{ style: { color: 'red' } }}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Length</InputLabel>
            <TextField
              required
              name="OpenPlotLength"
              placeholder="Length"
              fullWidth
              autoComplete="family-name"
              value={isNewProperty ? newAdditionalPropertyData.OpenPlotLength ?? '' : additionalPropertyData.OpenPlotLength ?? ''}
              onChange={handleChange}
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Stack spacing={1}>
            <InputLabel>Width</InputLabel>
            <TextField
              required
              name="OpenPlotWidth"
              placeholder="Width"
              fullWidth
              value={isNewProperty ? newAdditionalPropertyData.OpenPlotWidth ?? '' : additionalPropertyData.OpenPlotWidth ?? ''}
              onChange={handleChange}
              autoComplete="family-name"
              disabled={accessLevel < 3}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
