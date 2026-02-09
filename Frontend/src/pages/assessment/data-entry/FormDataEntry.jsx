import {
  Grid,
  InputLabel,
  Stack,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  DialogActions,
  SnackbarContent,
  Snackbar,
  Autocomplete,
  OutlinedInput,
  FormHelperText,
  FormControl
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
// import { createFilterOptions } from "@mui/material/Autocomplete";

import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import EditTwoTone from '@ant-design/icons/EditTwoTone';
import SendOutlined from '@ant-design/icons/SendOutlined';
import IconButton from 'components/@extended/IconButton';
import { fetchJointOwnerList, fetchPropertyDescription, fetchWardList } from 'services/data-entry.services';
import translateText from 'utils/translator';
import { postWardSelection } from 'services/wardnumber.services';
import { getZoneMasterList } from 'services/masterServices/zone-master-services.js/zone-master-services';
import { useDispatch, useSelector } from 'react-redux';
import { setNewPropertyJoinData, deleteJOD, resetNewPropertyJoinData } from 'state/reducers/dataEntry/formDataEntryJointOwnerSlice';
import { setNewPropertyMast, setNewClearPropertyMast } from 'state/reducers/dataEntry/formDataPropertyMast';
import { setPropertyMastFormDataEntry, setJointOwnerDetails, setdeleteJODExistingProperty } from 'state/reducers/ExistingPropertySlice';
import { saveAndUpdateOblique } from 'services/utlilityService/autoWardService/autoWard.service';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useNavigate } from 'react-router';
import { setAdditionalData } from 'state/reducers/additionlPropertyDataSlice';
import { fetchPropertyOwner } from 'services/appeal.services';
import { setTotalRenterRent } from 'state/reducers/newFloorInformationSlice';

export default function FormDataEntry({
  setSelectedOwnerID,
  selectedOwnerID,
  //onOpenPlotChange,
  showZones,
  showWardNo,
  showPropertyNo,
  hideZone,
  hideWardNo,
  hidePropertyNo,
  isNewProperty,
  NewPropertyFields,
  setNewPropertyFields,
  errors,
  setErrors,
  handleOpenPlotChange
  // newOwnerDetails,
  // setNewOwnerDetails
}) {
  const [newOwnerDetails, setNewOwnerDetails] = useState({
    OwnerID: 0,
    OwnerTitle: '',
    OwnerTitleMarathi: '',
    OwnerName: '',
    OwnerNameMarathi: '',
    OccupierName: '',
    OccupierNameMarathi: '',
    Address: '',
    JODId: '',
    OwnerPatta: '',
    isPrime: false,
    BuildingOrShopName: '',
    BuildingOrShopNameMarathi: '',
    BuildingOrFlatNo: '',
    BuildingOrFlatNoMarathi: ''
  });
  //carpet from new floor
  const totalCarpet = useSelector((state) => state.combinedDataEntry.combinedData.propertyDetailsNew);
  console.log(totalCarpet, 'totalCarpet form data entry');

  useEffect(() => {
    if (totalCarpet !== undefined && totalCarpet !== null) {
      const totalCarpetArea = totalCarpet.reduce((sum, item) => sum + (Number(item.CarpetAreaSqFeet) || 0), 0);
      const totalBuiltUpSqFt = totalCarpet.reduce((sum, item) => sum + (Number(item.BuildUpAreaSqFeet) || 0), 0);

      const rentedAreaSqMtr = totalCarpet
        .filter((item) => item.RenterYesNO)
        .reduce((sum, item) => sum + (Number(item.CarpetAreaSqFeet) || 0), 0);

      const rent = totalCarpet.filter((item) => item.RenterYesNO).reduce((sum, item) => sum + (Number(item.Rent) || 0), 0);

      console.log(totalCarpetArea, 'totalCarpetArea');
      setInputCarpetFtArea(totalCarpetArea || 0);
      setBuildUpAreaSqft(totalBuiltUpSqFt || 0);
      setInputRenterCarpetFtArea(rentedAreaSqMtr || 0);
      setInputRenterRent(rent || 0);
    }
  }, [totalCarpet, selectedOwnerID]);
  useEffect(() => {
    if (isNewProperty && (!totalCarpet || totalCarpet.length === 0)) {
      setInputCarpetFtArea(0);
      setBuildUpAreaSqft(0);
      setInputRenterCarpetFtArea(0);
      setInputRenterRent(0);
    }
  }, [isNewProperty, totalCarpet]);

  // renter total from new floor
  const [inputRenterRent, setInputRenterRent] = useState(0);
  //  const totalRenterRent = useSelector((state) => state.newFloorDetails.totalRenterRent);
  // useEffect(() => {
  //   if (isNewProperty && totalRenterRent !== undefined && totalRenterRent !== null) {
  //     setInputRenterRent(totalRenterRent);
  //   }
  // }, [isNewProperty, totalRenterRent]);

  // useEffect(() => {
  //   if (totalCarpet !== undefined && totalCarpet !== null) {
  //     setInputCarpetFtArea(totalCarpet);
  //   }
  // }, [totalCarpet]);

  const [isDisabled, setIsDisabled] = useState(true);
  const [ownerIdDisabled, setOwnerIdDisabled] = useState(true);
  const validateSchemaOwnerDetails = Yup.object().shape({
    OwnerTitle: Yup.string().required('Title is required'),
    OwnerName: Yup.string().required('Name is required'),
    Address: Yup.string().required('Address is required'),

    BuildingOrShopName: Yup.string().when('$isCommercial', {
      is: true,
      then: (schema) => schema.required('Building/Shop Name is required for Commercial'),
      otherwise: (schema) => schema.notRequired()
    }),

    BuildingOrFlatNo: Yup.string().when('$isCommercial', {
      is: true,
      then: (schema) => schema.required('Building/Shop Number is required for Commercial'),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const [PropertyMast, setPropertyMast] = useState({
    OwnerID: 0,
    NewZoneNo: '',
    NewWardNo: '',
    NewPropertyNo: '',
    NewPartitionNo: '',
    OpenPlot: false,
    NewCityServeyNo: '',
    NewPlotNo: '',
    PropertyTypeID: null,
    PlotTaxableAreaSqFt:0 ,
    PlotAreaSqMtr:0,    // openPlotWidth: null
    //CarpetAreaSqFeet: ''
  });

  const [ownerDetails, setOwnerDetails] = useState({
    OwnerTitle: '',
    isPrime: false,
    JODId: '',
    OwnerID: 0,
    OwnerTitleMarathi: '',
    OwnerName: '',
    OwnerNameMarathi: '',
    OccupierName: '',
    OccupierNameMarathi: '',
    Address: '',
    OwnerPatta: '',
    BuildingOrShopName: '',
    BuildingOrShopNameMarathi: '',
    BuildingOrFlatNo: '',
    BuildingOrFlatNoMarathi: ''
  });

  const [error, setError] = useState('');
  const [propertyNewDetails, setPropertyNewDetails] = useState([]);
  const [carpetAreaSqft, setCarpetAreaSqft] = useState(0);
  const [buildUpAreaSqft, setBuildUpAreaSqft] = useState(0);
  const [rent, setRent] = useState(0);
  const [rentAreaSqft, setRentAreaSqFt] = useState(0);
  const [inputRenterCarpetFtArea, setInputRenterCarpetFtArea] = useState(0);

  const [buildeUpAreaSqMtr, setBuildUpAreaSqMtr] = useState(0);
  const [carpetAreaSqMtr, setCarpetAreaSqMtr] = useState(0);
  const [plotAreaSqMtr, setPlotAreaSqMtr] = useState(0);
  const [rentedAreaSqMtr, setRentedAreaSqMtr] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemNewPropDelete, setSelectedItemNewPropDelete] = useState(null);
  const [CopiedData, setCopiedData] = useState({});
  const [openPlot, setOpenPlot] = useState(false);
  const [deletedIDs, setDeletedIDs] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [propertyDesc, setPropertDesc] = useState([]);
  const [jointOwnerList, setJointOwnerList] = useState([]);
  const [wardList, setwardList] = useState([]);
  const [propList, setPropList] = useState([]);
  const [newOwnerForm, setNewOwnerForm] = useState([]);
  const [open, setOpen] = useState(false);
  const [openNewPropDelete, setOpenNewPropDelete] = useState(false);
  const [selectedJODId, setSelectedJODId] = useState(null);
  const [selectedJODIdNewPropertyDelete, setSelectedJODIdNewPropertyDelete] = useState(null);
  const dispatch = useDispatch();
  // used new propert data
  const newOwnerData = useSelector((state) => state.formDataDetails.newOwnerData);
  const newPropertyData = useSelector((state) => state.propertyMastDetails.newPropertyData);
  useEffect(() => {
    if (plotAreaSqMtr) {
      setPropertyMast((prev) => ({
            ...prev,
            PlotAreaSqMtr: plotAreaSqMtr.toFixed(2)
        }));
    }
}, [plotAreaSqMtr]);
  //used existing property data
  const PropertyMastInitialData = useSelector((state) => state.combinedDataEntry.combinedData.propertyMast);
  const JointOwnerInitialData = useSelector((state) => state.combinedDataEntry.combinedData.jointOwnerDetails);
  const propertyNewDetailsData = useSelector((state) => state.combinedDataEntry.combinedData.propertyDetailsNew);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  // fetching zones from zonemaster for new property
  useEffect(() => {
    getZoneMasterList()
      .then((response) => {
        const fetchedZoneList = response.zoneList;
        setZoneList(fetchedZoneList);
      })
      .catch((error) => {
        console.error('Error fetching Zone Master:', error);
        setZoneList([]);
      });
  }, []);

  // const handleYes = async (JODId) => {
  //   setOpen(false);
  //   setDeletedIDs((prev) => [...prev, JODId]);
  //   // Properly update the state by filtering out the deleted item
  //   const updatedData = jointOwnerList.filter((item) => item.JODId !== JODId);
  //   setJointOwnerList(updatedData);
  //   dispatch(setJointOwnerDetails({ newData: updatedData }));
  //   dispatch(setdeleteJODExistingProperty({ JODId }));
  //   console.log(`Dispatched setdeleteJODExistingProperty with ID: ${JODId}`);
  //   return updatedData;
  // };

  const handleYes = async (JODId) => {
    setOpen(false);

    // find the item being deleted
    const ownerToDelete = jointOwnerList.find((item) => item.JODId === JODId);

    if (ownerToDelete?.isPrime) {
      // prevent deleting prime
      setSnackbarMessage('⚠️ Prime Owner cannot be deleted');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; // exit early
    }

    setDeletedIDs((prev) => [...prev, JODId]);

    // update the list by removing only non-prime
    const updatedData = jointOwnerList.filter((item) => item.JODId !== JODId);
    setJointOwnerList(updatedData);

    // dispatch redux updates
    dispatch(setJointOwnerDetails({ newData: updatedData }));
    dispatch(setdeleteJODExistingProperty({ JODId }));

    console.log(`✅ Deleted JODId: ${JODId}`);
    return updatedData;
  };

  const handleNo = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log('🟢 Rendered with newOwnerForm:', newOwnerForm);
  }, [newOwnerForm]);

  const handleYesNewPropertyDelete = () => {
    const JODId = selectedItemNewPropDelete?.JODId;

    console.log('🟥 Delete initiated for JODId:', JODId);
    console.log('📋 Current newOwnerForm:', newOwnerForm);

    if (!JODId) {
      console.warn('❌ No JODId found for deletion.');
      return;
    }

    // find the item being deleted
    const ownerToDelete = newOwnerForm.find((item) => item.JODId === JODId);

    if (ownerToDelete?.isPrime) {
      // prevent deleting prime
      setSnackbarMessage('⚠️ Prime Owner cannot be deleted');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; // exit early
    }

    setDeletedIDs((prev) => [...prev, JODId]);

    // Filter out the row to be deleted
    const updatedData = newOwnerForm.filter((item) => item.JODId !== JODId);
    console.log('🧹 Filtered newOwnerForm after deletion:', updatedData);

    // Update local state and Redux
    setNewOwnerForm(updatedData);
    dispatch(setNewPropertyJoinData({ newData: updatedData }));

    // Backend sync if needed
    dispatch(deleteJOD({ JODId }));

    // Reset selection to prevent ghost edit icon
    setSelectedItemNewPropDelete(null);

    // Close confirmation dialog
    setOpenNewPropDelete(false);

    console.log('✅ Deletion complete. Remaining rows:', updatedData.length);
  };

  const handleNoNewPropertyDelete = () => {
    setOpenNewPropDelete(false);
  };
  // useEffect(() => {
  //   setOpenPlot(PropertyMast.OpenPlot);

  //   if (onOpenPlotChange) {
  //     onOpenPlotChange(openPlot);
  //   }
  // }, [openPlot, onOpenPlotChange]);

  //inside form data entry
  useEffect(() => {
    if (selectedOwnerID) {
      setPropertyMast((prev) => ({ ...prev, OwnerID: selectedOwnerID }));
    }
  }, [selectedOwnerID]);

  useEffect(() => {
    console.log('📥 FormDataEntry received selectedOwnerID:', selectedOwnerID);
  }, [selectedOwnerID]);

  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const accessLevel = useSelector((state) => state.accessLevel.value);

  useEffect(() => {
    if (accessLevel === 1 || accessLevel === 2) {
      setShowAccessDialog(true);
    } else {
      setShowAccessDialog(false);
    }
  }, [accessLevel]);

  const navigate = useNavigate();
  const handleRedirect = () => {
    setShowAccessDialog(false);
    navigate('/payment/dashboard');
  };

  // to load initail data from the database
  useEffect(() => {
    if (!isNewProperty && PropertyMastInitialData) {
      if (PropertyMastInitialData) {
        console.log(JointOwnerInitialData, 'initial joint data from redux');

        // 🔹 Sort joint owners: isPrime true first
        const sortedJointOwners = [...(JointOwnerInitialData || [])].sort((a, b) => {
          if (a.isPrime && !b.isPrime) return -1; // a first
          if (!a.isPrime && b.isPrime) return 1; // b first
          return 0; // maintain order otherwise
        });

        setPropertyMast(PropertyMastInitialData || {});
        // Ensure Additional Tab gets the initial Plot Area value
        dispatch(
          setAdditionalData({
            PlotTaxableAreaSqFt: PropertyMastInitialData?.PlotTaxableAreaSqFt
          })
        );
        console.log('Initial dispatch to additionalPropertyData:', PropertyMastInitialData?.PlotTaxableAreaSqFt);
        setJointOwnerList(sortedJointOwners || []);
        setPropertyNewDetails(propertyNewDetailsData || []);
        //setRentAreaSqFt(0);
        //setRent(0);
        //setCarpetAreaSqft(0);
        //setBuildUpAreaSqft(0);
        if (PropertyMastInitialData.NewWardNo) {
          postWardSelection(PropertyMastInitialData.NewWardNo)
            .then((propertyRange) => {
              const sortedList = [...(propertyRange?.properties || [])].sort((a, b) => {
                const propA = parseInt(a.NewPropertyNo, 10) || 0;
                const propB = parseInt(b.NewPropertyNo, 10) || 0;

                if (propA !== propB) return propA - propB;

                const partA = parseInt(a.NewPartitionNo, 10) || 0;
                const partB = parseInt(b.NewPartitionNo, 10) || 0;

                return partA - partB;
              });

              setPropList(sortedList);
            })
            .catch((error) => {
              console.error('Error fetching property range:', error);
            });
        }
      }
    } else {
      setPropertyMast({});
      setJointOwnerList([]);
      setPropertyNewDetails([]);
      // setRentAreaSqFt(0);
      // setRent(0);
      setCarpetAreaSqft(0);
      // setBuildUpAreaSqft(0);
      setPropList([]);
    }
  }, [PropertyMastInitialData, isNewProperty, propertyNewDetailsData]);

  const [inputCarpetFtArea, setInputCarpetFtArea] = useState();

  // useEffect(() => {
  //   const areaCalculation = (newCalculation = false) => {
  //     console.log('⏱ Running areaCalculation. Is New Property:', newCalculation);

  //     let carpetArea = 0;
  //     let buildUpArea = 0;
  //     let totalRent = 0;
  //     let rentedArea = 0;
  //     let buildUpSqmtr = 0;
  //     let plotAreaSqmtr = 0;
  //     let carpetAreaSqmtr = 0;
  //     let rentedAreaSqmtr = 0;
  //     let plotAreaSqft = 0;

  //     if (!newCalculation) {
  //       plotAreaSqft = parseFloat(PropertyMast?.PlotTaxableAreaSqFt || 0);
  //       propertyNewDetails?.forEach((item) => {
  //         totalRent += parseFloat(item?.Rent || 0);
  //         carpetArea += parseFloat(item?.CarpetAreaSqFeet || 0);
  //         if (item.Rent > 0) {
  //           rentedArea += parseFloat(item?.CarpetAreaSqFeet || 0);
  //         }
  //       });
  //     } else {
  //       const parsedCarpetArea = parseFloat(inputCarpetFtArea || 0);
  //       carpetArea = isNaN(parsedCarpetArea) ? 0 : parsedCarpetArea;

  //       const parsedPlotArea = parseFloat(NewPropertyFields?.PlotTaxableAreaSqFt || 0);
  //       plotAreaSqft = isNaN(parsedPlotArea) ? 0 : parsedPlotArea;

  //       if (rent > 0) {
  //         rentedArea = carpetArea;
  //       }
  //     }

  //     buildUpArea = carpetArea + carpetArea * 0.2;
  //     buildUpSqmtr = buildUpArea * 0.092903;
  //     plotAreaSqmtr = plotAreaSqft * 0.092903;
  //     carpetAreaSqmtr = carpetArea * 0.092903;
  //     rentedAreaSqmtr = rentedArea * 0.092903;

  //     console.log('📐 Calculated values:');
  //     console.log('➡ Carpet Area (SqFt):', carpetArea);
  //     console.log('➡ BuildUp Area (SqFt):', buildUpArea);
  //     console.log('➡ Rent Area (SqFt):', rentedArea);
  //     console.log('➡ Total Rent:', totalRent);
  //     console.log('➡ Carpet Area (SqMtr):', carpetAreaSqmtr);
  //     console.log('➡ BuildUp Area (SqMtr):', buildUpSqmtr);
  //     console.log('➡ Rented Area (SqMtr):', rentedAreaSqmtr);
  //     console.log('➡ Plot Area (SqMtr):', plotAreaSqmtr);

  //     const setIfChanged = (setter, value, name) => {
  //       setter((prev) => {
  //         const changed = Math.abs(prev - value) > 0.01;
  //         if (changed) console.log(`🔁 Updating ${name} to`, value);
  //         return changed ? value : prev;
  //       });
  //     };

  //     setIfChanged(setBuildUpAreaSqMtr, buildUpSqmtr, 'BuildUpAreaSqMtr');
  //     setIfChanged(setCarpetAreaSqMtr, carpetAreaSqmtr, 'CarpetAreaSqMtr');
  //     setIfChanged(setPlotAreaSqMtr, plotAreaSqmtr, 'PlotAreaSqMtr');
  //     setIfChanged(setRentedAreaSqMtr, rentedAreaSqmtr, 'RentedAreaSqMtr');
  //     setIfChanged(setRentAreaSqFt, rentedArea, 'RentAreaSqFt');
  //     setIfChanged(setRent, totalRent, 'Rent');
  //     setIfChanged(setCarpetAreaSqft, carpetArea, 'CarpetAreaSqFt');
  //     setIfChanged(setBuildUpAreaSqft, buildUpArea, 'BuildUpAreaSqFt');
  //   };

  //   const shouldCalculate = isNewProperty
  //     ? !isNaN(parseFloat(inputCarpetFtArea)) && !isNaN(parseFloat(NewPropertyFields?.PlotTaxableAreaSqFt))
  //     : !!propertyNewDetails.length && !isNaN(parseFloat(PropertyMast?.PlotTaxableAreaSqFt));

  //     if (!propertyNewDetails || propertyNewDetails.length === 0) {
  //       console.warn('⚠️ No propertyNewDetails, using manual input values.');
  //       areaCalculation(true);
  //       return;
  //     }
  //   if (shouldCalculate) {
  //     areaCalculation(isNewProperty);
  //   } else {
  //     console.log('❌ Skipping areaCalculation due to invalid inputs');
  //   }
  // }, [
  //   inputCarpetFtArea,
  //   NewPropertyFields.PlotTaxableAreaSqFt,
  //   propertyNewDetails.length,
  //   isNewProperty,
  //   PropertyMast?.PlotTaxableAreaSqFt,
  //   // PropertyMast?.PlotTaxableAreaSqFt
  // ]);

  useEffect(() => {
    const areaCalculation = (newCalculation = false) => {
      console.log('⏱ Running areaCalculation. Is New Property:', newCalculation);

      let carpetArea = 0;
      let buildUpArea = 0;
      let totalRent = 0;
      let rentedArea = 0;
      let buildUpSqmtr = 0;
      let plotAreaSqmtr = 0;
      let carpetAreaSqmtr = 0;
      let rentedAreaSqmtr = 0;
      let plotAreaSqft = 0;

      if (!newCalculation) {
        plotAreaSqft = parseFloat(PropertyMast?.PlotTaxableAreaSqFt || 0);
        propertyNewDetails?.forEach((item) => {
          totalRent += parseFloat(item?.Rent || 0);
          carpetArea += parseFloat(item?.CarpetAreaSqFeet || 0);
          if (item.Rent > 0) {
            rentedArea += parseFloat(item?.CarpetAreaSqFeet || 0);
          }
        });
      } else {
        const parsedCarpetArea = parseFloat(inputCarpetFtArea || 0);
        carpetArea = isNaN(parsedCarpetArea) ? 0 : parsedCarpetArea;

        const parsedPlotArea = parseFloat(NewPropertyFields?.PlotTaxableAreaSqFt || PropertyMast?.PlotTaxableAreaSqFt || 0);
        plotAreaSqft = isNaN(parsedPlotArea) ? 0 : parsedPlotArea;

        if (rent > 0) rentedArea = carpetArea;
      }

      // ✅ Reset all values if nothing found
      if (
        (plotAreaSqft === 0 || isNaN(plotAreaSqft)) &&
        (carpetArea === 0 || isNaN(carpetArea)) &&
        (rentedArea === 0 || isNaN(rentedArea))
      ) {
        console.log('🔁 Resetting all SqMtr & SqFt values to 0');
        setPlotAreaSqMtr(0);
        setCarpetAreaSqMtr(0);
        setBuildUpAreaSqMtr(0);
        setRentedAreaSqMtr(0);
        setBuildUpAreaSqft(0); // ✅ Added
        setCarpetAreaSqft(0); // ✅ Added
        setRentAreaSqFt(0); // ✅ Added
        return;
      }

      // 🧮 Calculations
      buildUpArea = carpetArea + carpetArea * 0.2;
      buildUpSqmtr = buildUpArea * 0.092903;
      plotAreaSqmtr = plotAreaSqft * 0.092903;
      carpetAreaSqmtr = carpetArea * 0.092903;
      rentedAreaSqmtr = rentedArea * 0.092903;

      // ✅ Update states (SqMtr + SqFt both)
      setBuildUpAreaSqft(buildUpArea);
      setCarpetAreaSqft(carpetArea);
      setRentAreaSqFt(rentedArea);

      setBuildUpAreaSqMtr(buildUpSqmtr);
      setCarpetAreaSqMtr(carpetAreaSqmtr);
      setPlotAreaSqMtr(plotAreaSqmtr);
      setRentedAreaSqMtr(rentedAreaSqmtr);
    };

    // Always recalc when new data or owner changes
    areaCalculation(isNewProperty);
  }, [
    inputCarpetFtArea,
    NewPropertyFields.PlotTaxableAreaSqFt,
    PropertyMast?.PlotTaxableAreaSqFt,
    propertyNewDetails.length,
    isNewProperty,
    selectedOwnerID // ✅ ensure recalculation on owner change
  ]);

  const handlePlotFtAreaChange = (e) => {
    const value = e.target.value.trim();
    const numericValue = parseFloat(value);

    // Update local state
    setNewPropertyFields((prevState) => ({
      ...prevState,
      PlotTaxableAreaSqFt: value
    }));

    // Update sqmtr immediately
    if (!isNaN(numericValue)) {
      const convertedSqm = numericValue * 0.092903;
      setPlotAreaSqMtr(convertedSqm); // ✅ instant update!
    }

    // Optional: Clear errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (value !== '') delete newErrors.PlotTaxableAreaSqFt;
      return newErrors;
    });

    // Dispatch if needed (wait a bit if required)
    dispatch(setNewPropertyMast({ ...NewPropertyFields, PlotTaxableAreaSqFt: value }));

    console.log('📤 Dispatching PlotTaxableAreaSqFt to Redux:', value);
    dispatch(setAdditionalData({ PlotTaxableAreaSqFt: value }));
    console.log('✅ Dispatched to Redux');
  };
  

  const handleCarpetFtAreaChange = (e) => {
    console.log('liked area change');
    // Update the input value for CarpetFtArea
    // setInputCarpetFtArea(e.target.value);

    // // Clear the error for CarpetFtArea when a valid input is entered
    // setErrors((prevErrors) => ({
    //   ...prevErrors, // Keep other errors unchanged
    //   inputCarpetFtArea: '' // Clear the error for CarpetFtArea field
    // }));
  };

  // Input handling for new property
  // const handleCarpetAreaChange = (e) => {
  //   setInputCarpetArea(e.target.value);
  // };
  const handlePlotMtrAreaChange = (e) => {
    const { name, value } = e.target;
    
    const updatedFields = {
      ...PropertyMast,
      [name]: value,
      PlotTaxableAreaSqFt: (parseFloat(value) * 10.76).toFixed(2) 
    };
  
    setPropertyMast(updatedFields);
  
    dispatch(setPropertyMastFormDataEntry(updatedFields));
  };

  // //@NewProperty to show state jointownerlist from ||Redux|| changes
  useEffect(() => {
    if (Array.isArray(newOwnerData)) {
      setNewOwnerForm(newOwnerData);
    }
  }, [newOwnerData]);

  //@NewProperty To show Property Mast data from ||Redux|| Slice
  useEffect(() => {
    if (newPropertyData) {
      setNewPropertyFields(newPropertyData);
    }
  }, [newPropertyData]);

  const handleNewPropertyClick = (e) => {
    const { name, value } = e.target;

    const updatedValue = name === 'OpenPlot' ? value === 'true' : value;

    const payload = { [name]: updatedValue };

    // Special handling if OpenPlot is toggled
    if (name === 'OpenPlot') {
      if (value === 'true') {
        const openPlotItem = propertyDesc.find((item) => item.PropertyDescription === 'प्लॉट');
        if (openPlotItem) {
          payload.PropertyTypeID = openPlotItem.PropertyTypeID;
        }
      } else {
        payload.PropertyTypeID = null;
      }
    }

    dispatch(setNewPropertyMast(payload)); // ✅ only update what changed

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const handlePropertyChange = (e) => {
    if (isPageLocked) return;

    const { name, value } = e.target;

    // Convert empty string to null or 0 for numeric fields
    const parsedValue = (() => {
      if (name === 'PropertyTypeID') {
        return value === '' ? null : parseInt(value, 10);
      }
      if (name === 'PlotArea') {
        const sqFt = parseFloat(value) || 0;
        // Calculation: 33 / 10.7639 = 3.065... (fixed to 3.07)
        const calculatedMtr = (sqFt / 10.7639).toFixed(2); 
        
        updatedFields.PlotArea = value; 
        updatedFields.PlotAreaSqMtr = calculatedMtr; 
        updatedFields.PlotTaxableAreaSqFt = value; 
      }
      if (name === 'OpenPlot') {
        return value === 'true'; 
      }
      return value;
    })();

    let updatedFields = {
      ...PropertyMast,
      [name]: parsedValue
    };

    if (name === 'OpenPlot') {
      if (value === 'true') {
        const openPlotItem = propertyDesc.find((item) => item.PropertyDescription === 'प्लॉट');
        if (openPlotItem) {
          updatedFields.PropertyTypeID = openPlotItem.PropertyTypeID;
        }
      } else {
        // Optional: Reset PropertyTypeID if OpenPlot is false
        updatedFields.PropertyTypeID = null;
      }
    }

    setPropertyMast(updatedFields);

    //  if (name === 'CarpetAreaSqFeet') {
    //     setCarpetAreaSqft(parsedValue);
    //   }
    dispatch(setPropertyMastFormDataEntry(updatedFields));

    // Clear errors
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });

    if (name === 'NewWardNo') {
      postWardSelection(value)
        .then((propertyRange) => {
          const sortedList = [...(propertyRange?.properties || [])].sort((a, b) => {
            const propA = parseInt(a.NewPropertyNo, 10) || 0;
            const propB = parseInt(b.NewPropertyNo, 10) || 0;

            if (propA !== propB) return propA - propB;

            const partA = parseInt(a.NewPartitionNo, 10) || 0;
            const partB = parseInt(b.NewPartitionNo, 10) || 0;

            return partA - partB;
          });

          setPropList(sortedList);
        })
        .catch((error) => {
          console.error('Error fetching property range:', error);
        });
    }

    if (name === 'OwnerID') {
      setNewPropertyFields((prevState) => ({
        ...prevState,
        [name]: value === '' ? 0 : parseInt(value, 10)
      }));
    }
  };

  // const handleCopyClick = () => {
  //   setCopiedData(ownerDetails);
  //   if (showPropertyNo && showWardNo && showZones) {
  //     setCopiedData(newOwnerDetails);
  //   }
  //   console.log(ownerDetails, 'Copied data');
  // };
  const handleCopyClick = () => {
    const source = isNewProperty ? newOwnerDetails : ownerDetails;

    if (!source) {
      console.warn('⚠️ No row selected to copy');
      return;
    }

    // Drop IDs/audit fields; we’ll regenerate JODId on paste
    const { JODId, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate, ...clean } = source;

    setCopiedData(clean);
    console.log('Copied data:', clean);
  };

  // const handlePasteClick = () => {
  //   const newEntry = JSON.parse(JSON.stringify(CopiedData));
  //   newEntry.JODId = generateUniqueId();
  //   setOwnerDetails(newEntry);
  //   if (isNewProperty) {
  //     setNewOwnerDetails(newEntry);
  //   }
  // };

  const handlePasteClick = () => {
    const newEntry = JSON.parse(JSON.stringify(CopiedData));
    newEntry.JODId = generateUniqueId();
    newEntry.isPrime = false; // Always reset prime flag on paste

    setOwnerDetails(newEntry);

    if (isNewProperty) {
      setNewOwnerDetails(newEntry);
    }
  };

  // const handlePasteClick = () => {
  //   if (!CopiedData) return;

  //   const newEntry = JSON.parse(JSON.stringify(CopiedData));
  //   newEntry.JODId = generateUniqueId();
  //   newEntry.isPrime = false; // Always reset prime flag on paste

  //   if (isNewProperty) {
  //     setNewOwnerForm((prev) => {
  //       // 🔹 Duplicate check
  //       const isDuplicate = prev.some((item) =>
  //         item.OwnerName?.trim().toLowerCase() === newEntry.OwnerName?.trim().toLowerCase() &&
  //         item.OwnerPatta?.trim().toLowerCase() === newEntry.OwnerPatta?.trim().toLowerCase() &&
  //         (item.BuildingOrFlatNo?.trim() || '') === (newEntry.BuildingOrFlatNo?.trim() || '') &&
  //         (item.BuildingOrShopName?.trim() || '') === (newEntry.BuildingOrShopName?.trim() || '')
  //       );

  //       if (isDuplicate) {
  //         alert('Duplicate entry detected. Paste cancelled.');
  //         return prev;
  //       }

  //       return [...prev, { ...newEntry, Insert: true, Update: false, OwnerID: 0 }];
  //     });
  //   } else {
  //     setJointOwnerList((prev) => {
  //       // 🔹 Duplicate check
  //       const isDuplicate = prev.some((item) =>
  //         item.OwnerName?.trim().toLowerCase() === newEntry.OwnerName?.trim().toLowerCase() &&
  //         item.OwnerPatta?.trim().toLowerCase() === newEntry.OwnerPatta?.trim().toLowerCase() &&
  //         (item.BuildingOrFlatNo?.trim() || '') === (newEntry.BuildingOrFlatNo?.trim() || '') &&
  //         (item.BuildingOrShopName?.trim() || '') === (newEntry.BuildingOrShopName?.trim() || '')
  //       );

  //       if (isDuplicate) {
  //         alert('Duplicate entry detected. Paste cancelled.');
  //         return prev;
  //       }

  //       return [...prev, { ...newEntry, Insert: true, Update: false, OwnerID: selectedOwnerID }];
  //     });
  //   }
  // };

  // const handleToggleIsPrime = (JODId, checked) => {
  //   if (isNewProperty) {
  //     const updated = newOwnerForm.map((item) => ({
  //       ...item,
  //       isPrime: item.JODId === JODId ? checked : false
  //     }));

  //     setNewOwnerForm(updated);
  //     dispatch(setNewPropertyJoinData({ newData: updated }));

  //     const toggledItem = updated.find((item) => item.JODId === JODId);
  //     setNewOwnerDetails((prev) => ({
  //       ...prev,
  //       isPrime: toggledItem?.isPrime ?? false
  //     }));
  //   } else {
  //     const updated = jointOwnerList.map((item) => ({
  //       ...item,
  //       isPrime: item.JODId === JODId ? checked : false
  //     }));

  //     setJointOwnerList(updated);
  //     dispatch(setJointOwnerDetails({ newData: updated }));

  //     const toggledItem = updated.find((item) => item.JODId === JODId);
  //     setOwnerDetails((prev) => ({
  //       ...prev,
  //       isPrime: toggledItem?.isPrime ?? false
  //     }));
  //   }
  // };

  const handleToggleIsPrime = (JODId, checked) => {
    if (isNewProperty) {
      const updated = newOwnerForm.map((item) =>
        item.JODId === JODId ? { ...item, isPrime: checked } : { ...item, isPrime: checked ? false : item.isPrime }
      );

      setNewOwnerForm(updated);
      dispatch(setNewPropertyJoinData({ newData: updated }));
    } else {
      const updated = jointOwnerList.map((item) =>
        item.JODId === JODId ? { ...item, isPrime: checked } : { ...item, isPrime: checked ? false : item.isPrime }
      );

      setJointOwnerList(updated);
      dispatch(setJointOwnerDetails({ newData: updated }));
    }
  };

  const generateUniqueId = () => {
    return Math.floor(Math.random() * 1e9);
  };

  const handleRowClick = (item) => {
    console.log(item, 'row to be edited..');
    setErrors({});
    if (isPageLocked) return;
    setSelectedItem(item);
    setOwnerDetails(item);
    if (isNewProperty) {
      setNewOwnerDetails(item);
      setSelectedItemNewPropDelete(item);
    }
  };

  const handleDeleteClick = (JODId) => {
    setOpen(true);
    setSelectedJODId(JODId);
  };

  const handleOwnerDetailsChange = (e) => {
    // Clear only the error for the current field if it has a value
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...(value && { [name]: '' }) // clear if value is present
    }));
    if (isPageLocked) return;
    const { name, value } = e.target;
    setOwnerDetails((prevState) => ({
      ...prevState,
      [name]: value
    }));
    console.log(name, 'selected name');
    const marathiFields = {
      OwnerTitle: 'OwnerTitleMarathi',
      OwnerName: 'OwnerNameMarathi',
      Address: 'OwnerPatta',
      BuildingOrShopName: 'BuildingOrShopNameMarathi',
      BuildingOrFlatNo: 'BuildingOrFlatNoMarathi',
      OccupierName: 'OccupierNameMarathi'
    };

    if (marathiFields[name]) {
      translateText(value)
        .then((translated) => {
          setOwnerDetails((prevState) => ({
            ...prevState,
            [marathiFields[name]]: translated
          }));
        })
        .catch((err) => {
          setError(err.message);
          console.error('Error:', err);
        });
    }
  };
  useEffect(() => {}, [inputCarpetFtArea]);

  const handleNewOwnerDetailsChange = (e) => {
    // Clear only the error for the current field if it has a value
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...(value && { [name]: '' }) // clear if value is present
    }));
    const { name, value } = e.target;
    setNewOwnerDetails((prevState) => ({
      ...prevState,
      [name]: value
    }));

    // Clear the error for the specific field being updated
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name]; // Remove the error for this field
      return updatedErrors;
    });
    console.log(name, 'selected name');
    const marathiFields = {
      OwnerName: 'OwnerNameMarathi',
      Address: 'OwnerPatta',
      BuildingOrShopName: 'BuildingOrShopNameMarathi',
      BuildingOrFlatNo: 'BuildingOrFlatNoMarathi',
      OccupierName: 'OccupierNameMarathi'
    };

    if (marathiFields[name]) {
      translateText(value)
        .then((translated) => {
          setNewOwnerDetails((prevState) => ({
            ...prevState,
            [marathiFields[name]]: translated
          }));
        })
        .catch((err) => {
          setError(err.message);
          console.error('Error:', err);
        });
    }
  };

  const handleClearOwnerDetails = () => {
    setOwnerDetails({
      OwnerTitle: '',
      OwnerTitleMarathi: '',
      OwnerName: '',
      OwnerNameMarathi: '',
      Address: '',
      OwnerPatta: '',
      BuildingOrShopName: '',
      BuildingOrShopNameMarathi: '',
      BuildingOrFlatNo: '',
      BuildingOrFlatNoMarathi: '',
      OccupierName: '',
      OccupierNameMarathi: ''
    });
  };

  const handleNewClearOwnerDetails = () => {
    setNewOwnerDetails({
      OwnerTitle: '',
      OwnerTitleMarathi: '',
      OwnerName: '',
      OwnerNameMarathi: '',
      Address: '',
      OwnerPatta: '',
      BuildingOrShopName: '',
      BuildingOrShopNameMarathi: '',
      BuildingOrFlatNo: '',
      BuildingOrFlatNoMarathi: '',
      OccupierName: '',
      OccupierNameMarathi: ''
    });
  };

  const handleAddButtonClick = async () => {
    let validationErrors = {};
    const detailsToAdd = isNewProperty ? newOwnerDetails : ownerDetails;

    const selectedTypeId = isNewProperty ? NewPropertyFields?.PropertyTypeID : PropertyMast?.PropertyTypeID;
    const selectedType = propertyDesc.find((p) => p.PropertyTypeID === selectedTypeId);
    const isCommercial = selectedType?.PropertyDescription?.toLowerCase().includes('औद्योगिक');

    console.log('📌 Property Type ID Selected:', selectedTypeId);
    console.log('🏷️ Property Type Description:', selectedType?.PropertyDescription);
    console.log('✅ isCommercial:', isCommercial);

    // 🔍 Schema validation
    try {
      await validateSchemaOwnerDetails.validate(detailsToAdd, {
        abortEarly: false,
        context: { isCommercial }
      });
    } catch (error) {
      if (error.inner?.length) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      }
      if (Object.keys(validationErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...validationErrors }));
        console.log('❌ Validation failed:', validationErrors);
        return;
      }
    }

    // 🔹 Prevent empty owner
    const isEmptyOwner =
      !detailsToAdd.OwnerTitle?.trim() &&
      !detailsToAdd.OwnerName?.trim() &&
      !detailsToAdd.Address?.trim() &&
      !detailsToAdd.OwnerPatta?.trim();

    if (isEmptyOwner) {
      console.warn('🚫 Skipping empty owner entry');
      return;
    }

    if (!detailsToAdd.OwnerTitle || !detailsToAdd.OwnerName) {
      console.log('⚠️ Required fields missing.');
      return;
    }

    // 🔹 Helper for duplicate check
    const isDuplicateOwner = (list, details) =>
      list.some(
        (item) =>
          item.OwnerName?.trim().toLowerCase() === details.OwnerName?.trim().toLowerCase() &&
          item.OwnerPatta?.trim().toLowerCase() === details.OwnerPatta?.trim().toLowerCase() &&
          (item.BuildingOrFlatNo?.trim() || '') === (details.BuildingOrFlatNo?.trim() || '') &&
          (item.BuildingOrShopName?.trim() || '') === (details.BuildingOrShopName?.trim() || '')
      );

    // ------------------------- NEW PROPERTY -------------------------
    if (isNewProperty) {
      const { NewWardNo, NewPropertyNo, NewPartitionNo } = NewPropertyFields;

      const ownerExists = await fetchPropertyOwner(NewWardNo, NewPropertyNo, NewPartitionNo);
      if (ownerExists.length > 0) {
        setSnackbarOpen(true);
        setSnackbarMessage('PropertyNo for ward already exists');
        setSnackbarSeverity('error');
        //handleNewClearOwnerDetails();
        // dispatch(resetNewPropertyJoinData());
        // dispatch(setNewClearPropertyMast());
        // setNewOwnerForm(newOwnerData);
        // setNewPropertyFields(newPropertyData);
        return;
      }

      setNewOwnerForm((prev) => {
        const isEdit = !!detailsToAdd.JODId && prev.some((p) => p.JODId === detailsToAdd.JODId);
        const JODId = isEdit ? detailsToAdd.JODId : Math.floor(Math.random() * 1e9);

        if (!isEdit && isDuplicateOwner(prev, detailsToAdd)) {
          setSnackbarSeverity('error');
          setSnackbarMessage('Duplicate entry detected. Cannot add.');
          setSnackbarOpen(true);
          return prev;
        }

        // First owner is always primary
        const isPrimeFlag = prev.length === 0;

        const baseData = {
          ...detailsToAdd,
          JODId,
          OwnerID: 0,
          isPrime: isPrimeFlag,
          Insert: !isEdit,
          Update: isEdit
        };

        let updatedData;
        if (isEdit) {
          updatedData = prev.map((item) => (item.JODId === JODId ? { ...item, ...detailsToAdd, Update: true } : item));
        } else {
          updatedData = [baseData, ...prev]; // newest first
        }

        dispatch(setNewPropertyJoinData({ newData: updatedData }));
        handleNewClearOwnerDetails();
        setSelectedItemNewPropDelete(null);

        return updatedData;
      });
    }
    // ------------------------- EXISTING PROPERTY -------------------------
    else {
      const newJODId = detailsToAdd.JODId || Math.floor(Math.random() * 1e9);

      setJointOwnerList((prev) => {
        const existingIndex = prev.findIndex((item) => item.JODId === detailsToAdd.JODId);

        if (existingIndex === -1 && isDuplicateOwner(prev, detailsToAdd)) {
          setSnackbarSeverity('error');
          setSnackbarMessage('Duplicate entry detected. Cannot add.');
          setSnackbarOpen(true);
          return prev;
        }

        const alreadyHasPrime = prev.some((o) => o.isPrime === true);
        const isPrimeFlag = !alreadyHasPrime;

        const baseData = {
          ...detailsToAdd,
          JODId: detailsToAdd.JODId || newJODId,
          OwnerID: selectedOwnerID,
          isPrime: existingIndex !== -1 ? prev[existingIndex].isPrime ?? isPrimeFlag : isPrimeFlag,
          Insert: existingIndex === -1,
          Update: existingIndex !== -1
        };

        let updatedData;
        if (existingIndex !== -1) {
          updatedData = prev.map((item) => (item.JODId === detailsToAdd.JODId ? baseData : item));
        } else {
          updatedData = [baseData, ...prev]; // newest first
        }

        const primeCount = updatedData.filter((o) => o.isPrime).length;
        if (primeCount > 1) {
          setSnackbarSeverity('error');
          setSnackbarMessage('Only one Primary Owner is allowed.');
          setSnackbarOpen(true);
          return prev;
        }

        dispatch(setJointOwnerDetails({ newData: updatedData }));
        handleClearOwnerDetails();
        setSelectedItem(null);

        return updatedData;
      });
    }
  };

  //    const handleAddButtonClick = async () => {
  //     let validationErrors = {};
  //     const detailsToAdd = isNewProperty ? newOwnerDetails : ownerDetails;

  //     const selectedTypeId = isNewProperty ? NewPropertyFields?.PropertyTypeID : PropertyMast?.PropertyTypeID;
  //     const selectedType = propertyDesc.find((p) => p.PropertyTypeID === selectedTypeId);
  //     const isCommercial = selectedType?.PropertyDescription?.toLowerCase().includes('औद्योगिक');

  //     console.log('📌 Property Type ID Selected:', selectedTypeId);
  //     console.log('🏷️ Property Type Description:', selectedType?.PropertyDescription);
  //     console.log('✅ isCommercial:', isCommercial);

  //     // 🔍 Schema validation
  //     try {
  //       await validateSchemaOwnerDetails.validate(detailsToAdd, {
  //         abortEarly: false,
  //         context: { isCommercial }
  //       });
  //     } catch (error) {
  //       if (error.inner?.length) {
  //         error.inner.forEach((err) => {
  //           validationErrors[err.path] = err.message;
  //         });
  //       }
  //       if (Object.keys(validationErrors).length > 0) {
  //         setErrors((prev) => ({ ...prev, ...validationErrors }));
  //         console.log('❌ Validation failed:', validationErrors);
  //         return;
  //       }
  //     }

  //     const isEmptyOwner =
  //       !detailsToAdd.OwnerTitle?.trim() &&
  //       !detailsToAdd.OwnerName?.trim() &&
  //       !detailsToAdd.Address?.trim() &&
  //       !detailsToAdd.OwnerPatta?.trim();

  //     if (isEmptyOwner) {
  //       console.warn('🚫 Skipping empty owner entry');
  //       return;
  //     }

  //     if (!detailsToAdd.OwnerTitle || !detailsToAdd.OwnerName) {
  //       console.log('⚠️ Required fields missing.');
  //       return;
  //     }

  //     if (isNewProperty) {
  //       const NewWardNo = NewPropertyFields.NewWardNo;
  //       const NewPropertyNo = NewPropertyFields.NewPropertyNo;
  //       const NewPartitionNo = NewPropertyFields.NewPartitionNo;

  //       const ownerExists = await fetchPropertyOwner(NewWardNo, NewPropertyNo, NewPartitionNo);
  //       console.log('ownerExists', ownerExists);
  //       if (ownerExists.length == 0) {
  //         setNewOwnerForm((prev) => {
  //           console.log('prev at insert time:', prev);
  //           const isPrimeFlag = prev.length === 0;
  //           console.log('isPrimeFlag:', isPrimeFlag);
  //           // Check if this is actually an edit (JODId already exists in prev)
  //           const isEdit = !!detailsToAdd.JODId && prev.some((p) => p.JODId === detailsToAdd.JODId);

  //           // Assign JODId
  //           const JODId = isEdit ? detailsToAdd.JODId : Math.floor(Math.random() * 1e9);

  //           // Find existing index (for edits)
  //           const existingIndex = prev.findIndex((item) => item.JODId === JODId);

  //           // Duplicate check for new inserts only
  //           if (!isEdit) {
  //             const isDuplicate = prev.some(
  //               (item) =>
  //                 item.OwnerName?.trim().toLowerCase() === detailsToAdd.OwnerName?.trim().toLowerCase() &&
  //                 item.OwnerPatta?.trim().toLowerCase() === detailsToAdd.OwnerPatta?.trim().toLowerCase() &&
  //                 (item.BuildingOrFlatNo?.trim() || '') === (detailsToAdd.BuildingOrFlatNo?.trim() || '') &&
  //                 (item.BuildingOrShopName?.trim() || '') === (detailsToAdd.BuildingOrShopName?.trim() || '')
  //             );

  //             if (isDuplicate) {
  //               setSnackbarSeverity('error');
  //               setSnackbarMessage('Duplicate entry detected. Cannot add.');
  //               setSnackbarOpen(true);
  //               return prev;
  //             }
  //           }

  //           let baseData;
  //           if (isEdit && existingIndex !== -1) {
  //             // 🛠 Edit → preserve isPrime and mark as update
  //             baseData = {
  //               ...prev[existingIndex],
  //               ...detailsToAdd,
  //               JODId,
  //               Update: true,
  //               Insert: false
  //             };
  //           } else {
  //             // ➕ New insert → first row gets isPrime true
  //             const isPrimeFlag = !prev.some((o) => o.isPrime);

  //             console.log('isPrimeFlag:', isPrimeFlag);
  //             baseData = {
  //               ...detailsToAdd,
  //               JODId,
  //               OwnerID: 0,
  //               isPrime: isPrimeFlag,
  //               Insert: true,
  //               Update: false
  //             };
  //           }

  //           let updatedData;
  //           if (isEdit && existingIndex !== -1) {
  //             updatedData = [...prev];
  //             updatedData[existingIndex] = baseData;
  //           } else {
  //             updatedData = [...prev, baseData];
  //           }
  //           // Save in Redux
  //           console.log('🚀 Dispatching setNewPropertyJoinData with:', updatedData);
  //           dispatch(setNewPropertyJoinData({ newData: updatedData }));

  //           // Clear form
  //           handleNewClearOwnerDetails();
  //           setSelectedItemNewPropDelete(null);

  //           return updatedData;
  //         });
  //       } else {
  //         setSnackbarOpen(true);
  //         setSnackbarMessage('PropertyNo for ward is already exist');
  //         setSnackbarSeverity('error');
  //         handleNewClearOwnerDetails();
  //         dispatch(resetNewPropertyJoinData());
  //         dispatch(setNewClearPropertyMast());
  //         setNewOwnerForm(newOwnerData);
  //         setNewPropertyFields(newPropertyData);
  //         return;
  //       }
  //     }

  //     else {
  //       const newJODId = detailsToAdd.JODId || Math.floor(Math.random() * 1e9);

  //       setJointOwnerList((prev) => {
  //         // Find if same JOD already exists
  //         const existingIndex = prev.findIndex((item) => item.JODId === detailsToAdd.JODId);

  //         // ✅ Only check duplicates if it's a new entry (not editing)
  //         if (existingIndex === -1) {
  //           const isDuplicate = prev.some(
  //             (item) =>
  //               item.OwnerName?.trim().toLowerCase() === detailsToAdd.OwnerName?.trim().toLowerCase() &&
  //               item.OwnerPatta?.trim().toLowerCase() === detailsToAdd.OwnerPatta?.trim().toLowerCase() &&
  //               (item.BuildingOrFlatNo?.trim() || '') === (detailsToAdd.BuildingOrFlatNo?.trim() || '') &&
  //               (item.BuildingOrShopName?.trim() || '') === (detailsToAdd.BuildingOrShopName?.trim() || '')
  //           );

  //           if (isDuplicate) {
  //             setSnackbarSeverity('error');
  //             setSnackbarMessage('Duplicate entry detected. Cannot add.');
  //             setSnackbarOpen(true);
  //             return prev;
  //           }
  //         }

  //         const alreadyHasPrime = prev.some((o) => o.isPrime === true);
  //         const isPrimeFlag = !alreadyHasPrime;

  //         // ✅ Build base data safely
  //         const baseData = {
  //           ...detailsToAdd,
  //           JODId: detailsToAdd.JODId || newJODId,
  //           OwnerID: selectedOwnerID,
  //           isPrime: existingIndex !== -1
  //             ? prev[existingIndex].isPrime ?? isPrimeFlag
  //             : isPrimeFlag,
  //           Insert: existingIndex === -1,
  //           Update: existingIndex !== -1
  //         };

  //         // ✅ Replace or insert cleanly
  //         let updatedData;
  //         if (existingIndex !== -1) {
  //           updatedData = [...prev];
  //           updatedData[existingIndex] = baseData;
  //         } else {
  //           updatedData = [...prev, baseData];
  //         }

  //         // ✅ Ensure only one primary owner exists
  //         const primeCount = updatedData.filter(o => o.isPrime).length;
  //         if (primeCount > 1) {
  //           setSnackbarSeverity('error');
  //           setSnackbarMessage('Only one Primary Owner is allowed.');
  //           setSnackbarOpen(true);
  //           return prev;
  //         }

  //         console.log('🚀 Dispatching setJointOwnerDetails with:', updatedData);
  //         dispatch(setJointOwnerDetails({ newData: updatedData }));

  //         handleClearOwnerDetails();
  //         setSelectedItem(null);

  //         return updatedData;
  //       });
  //     }
  // };
  const handleDeleteNewClick = (JODId) => {
    const itemToDelete = newOwnerForm.find((item) => item.JODId === JODId);

    console.log('🟥 Delete button clicked - JODId:', JODId);
    console.log('🔍 Matched item:', itemToDelete);

    setSelectedItemNewPropDelete(itemToDelete); // ✅ Store the full object
    setOpenNewPropDelete(true);
  };

  useEffect(() => {
    fetchWardList()
      .then((wards) => {
        const sortedWards = wards.sort((a, b) => parseInt(a.NewWardNo) - parseInt(b.NewWardNo));
        console.log('Sorted ward list:', sortedWards);
        setwardList(sortedWards);
      })
      .catch((error) => {
        console.error('Error fetching ward:', error);
      });
  }, []);

  //lock the data entry page from admin lock property page
  const isPageLocked = useSelector((state) => state.pageLock.isPageLocked);
  console.log('locckkedd', isPageLocked);

  // //store properties in session storage coming from database
  // useEffect(() => {
  //   sessionStorage.setItem('UpdatedOwnerList', JSON.stringify(jointOwnerList));
  // }, [jointOwnerList]);

  //get property description
  useEffect(() => {
    fetchPropertyDescription()
      .then((fetchproperty) => {
        console.log(fetchproperty, 'fetchproperty');
        setPropertDesc(fetchproperty);
      })
      .catch((error) => {
        console.error('Error fetching property description:', error);
      });
  }, []);

  const handleClickDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const isValidRow = (data) => data?.JODId && data?.OwnerName && data?.OwnerNameMarathi && data?.BuildingOrFlatNo;

  const handleAlphabetInput = (event) => {
    const { key } = event;

    // Allow navigation keys (Backspace, Delete, Arrow keys, Tab, Space)
    if (
      !/^[a-zA-Z\s]$/.test(key) && // Allow only alphabets and spaces
      key !== 'Backspace' &&
      key !== 'Delete' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      key !== 'Tab'
    ) {
      event.preventDefault();
      console.log('Only alphabets are allowed');
    } else {
      console.log(''); // Clear error message on valid input
    }
  };

  const handleAddressInput = (event) => {
    const { key, target } = event;
    const currentValue = target.value;

    // Regular expression for allowed characters in the address
    const allowedRegex = /^[a-zA-Z0-9\s,.\-\/#&()]*$/;

    if (
      !allowedRegex.test(key) && // Only allow characters matching the regex
      key !== 'Backspace' &&
      key !== 'Delete' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      key !== 'Tab'
    ) {
      event.preventDefault();
      console.log('Only numbers, letters, spaces, and allowed symbols are permitted');
    } else {
      console.log('Valid character:', key);
    }
  };

  // const handleNumberInput = (event) => {
  //   const { key, target } = event;
  //   const currentValue = target.value;

  //   // Allow navigation keys (Backspace, Delete, Arrow keys, Tab)
  //   if (
  //     !/^[0-9]$/.test(key)
  //   ) {
  //     // event.preventDefault();
  //     console.log('Only numbers are allowed');
  //   } else if ( /^[0-9]$/.test(key)) {
  //     // Prevent input if the length is 4 digits and the user tries to add another digit
  //     event.preventDefault();

  //   } else {
  //     console.log('error'); // Clear error message on valid input
  //   }
  // };

  // const handleNumberAndFloatInput = (event) => {
  //   const { key, target } = event;
  //   const currentValue = target.value;

  //   // Allow navigation keys (Backspace, Delete, Arrow keys, Tab)
  //   if (
  //     !/^[0-9.]$/.test(key) && // Allow numeric keys and the dot (.)
  //     key !== 'Backspace' &&
  //     key !== 'Delete' &&
  //     key !== 'ArrowLeft' &&
  //     key !== 'ArrowRight' &&
  //     key !== 'Tab'
  //   ) {
  //     event.preventDefault();
  //     console.log('Only numbers and a single dot are allowed');
  //   } else if (key === '.') {
  //     // Prevent multiple dots or starting with a dot
  //     if (currentValue.includes('.') || currentValue === '') {
  //       event.preventDefault();
  //       console.log('Invalid dot placement');
  //     }
  //   } else if (currentValue.length >= 7 && /^[0-9]$/.test(key)) {
  //     // Prevent input if the length exceeds 7 digits (adjust as needed)
  //     event.preventDefault();
  //     console.log('Input must not exceed 7 characters');
  //   }
  // };
  const handleNumberAndFloatInput = (event) => {
    const { key, target } = event;
    const currentValue = target.value;

    // Allow navigation keys (Backspace, Delete, Arrow keys, Tab) and the decimal point
    if (
      !/^[0-9]$/.test(key) && // Allow numeric keys
      key !== 'Backspace' &&
      key !== 'Delete' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      key !== 'Tab' &&
      key !== '.' // Allow the decimal point
    ) {
      event.preventDefault(); // Prevent input if it's not allowed
    } else if (currentValue.includes('.') && key === '.') {
      // Prevent adding multiple decimal points
      event.preventDefault();
    }
  };

  const handleOnlyNumberInput = (event) => {
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
      setErrors('year must contain 4 digits');
    } else {
      setError(''); // Clear error message on valid input
    }
  };
  const norm = (s = '') => s.toString().replace(/\D/g, '').replace(/^0+/, '');

  // Take the full string the user typed, and extract the base property number:
  // - If there's a dash, take the part BEFORE the first dash
  // - Otherwise, take all digits
  const extractPropFromInput = (raw = '') => {
    const beforeDash = String(raw).split('-')[0]; // "134-2" -> "134"
    return norm(beforeDash); // strip non-digits & leading zeros
  };

  const label = (o) => {
    const prop = parseInt(o?.NewPropertyNo, 10) || 0;
    const part = parseInt(o?.NewPartitionNo || 0, 10);
    return part > 0 ? `${prop}-${part}` : `${prop}`;
  };

  const [inputValue, setInputValue] = useState('');
  const [openProp, setOpenProp] = useState(false);

  return (
    <>
      {' '}
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
        <MainCard>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={1.2}>
              <Stack spacing={1}>
                <InputLabel>Zone No:</InputLabel>
                {hideZone && (
                  <TextField
                    required
                    id="NewZoneNo"
                    value={PropertyMast.NewZoneNo ?? ''}
                    name="NewZoneNo"
                    placeholder="Zone No:"
                    fullWidth
                    autoComplete="given-name"
                    onChange={handlePropertyChange}
                    // onKeyDown={handleNumberInput}
                    disabled={accessLevel < 3}
                    // error={!!errors.NewWardNo}
                    helperText={errors.NewWardNo}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                  />
                )}
                {showZones && (
                  <TextField
                    name="NewZoneNo"
                    value={NewPropertyFields.NewZoneNo}
                    onChange={handleNewPropertyClick}
                    error={!!errors.NewZoneNo}
                    helperText={errors.NewZoneNo}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    //onKeyDown={handleNumberInput}
                    disabled={accessLevel < 3}
                  ></TextField>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.4}>
              <Stack spacing={1}>
                <InputLabel>Ward No:</InputLabel>
                {hideWardNo && (
                  <Select
                    onChange={handlePropertyChange}
                    style={{ height: '35px' }}
                    name="NewWardNo"
                    fullWidth
                    value={PropertyMast.NewWardNo}
                    disabled={accessLevel < 3}
                    // onKeyDown={handleNumberInput}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150,
                          overflowY: 'auto'
                        }
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Option
                    </MenuItem>
                    {wardList.map((wd, index) => (
                      <MenuItem key={index} value={wd.NewWardNo}>
                        {wd.NewWardNo}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {showWardNo && (
                  <TextField
                    name="NewWardNo"
                    value={NewPropertyFields.NewWardNo ?? ''}
                    onChange={handleNewPropertyClick}
                    error={!!errors.NewWardNo}
                    helperText={errors.NewWardNo}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    // onKeyDown={handleNumberInput}
                    disabled={accessLevel < 3}
                  />
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
                <InputLabel>Property No.</InputLabel>
                {hidePropertyNo && (
                  <Autocomplete
                    options={propList}
                    value={propList.find((x) => x.OwnerID === selectedOwnerID) || null}
                    onChange={(_, v) => setSelectedOwnerID(v ? v.OwnerID : null)}
                    isOptionEqualToValue={(a, b) => a?.OwnerID === b?.OwnerID}
                    getOptionLabel={(o) => String(o?.NewPropertyNo ?? '')}
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
                  />
                )}
                {showPropertyNo && (
                  <TextField
                    name="NewPropertyNo"
                    value={NewPropertyFields.NewPropertyNo ?? ''}
                    onChange={handleNewPropertyClick}
                    error={!!errors.NewPropertyNo}
                    helperText={errors.NewPropertyNo}
                    FormHelperTextProps={{ style: { color: 'red' } }}
                    // onKeyDown={handleNumberInput}
                    disabled={accessLevel < 3}
                  />
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
                <InputLabel>Partition No</InputLabel>
                <TextField
                  required
                  placeholder="Partition No"
                  fullWidth
                  name={isNewProperty ? 'NewPartitionNo' : 'NewPartitionNo'}
                  value={isNewProperty ? NewPropertyFields.NewPartitionNo ?? '' : PropertyMast.NewPartitionNo ?? ''}
                  onChange={isNewProperty ? handleNewPropertyClick : handlePropertyChange}
                  // error={!!errors.NewPartitionNo}
                  // helperText={errors.NewPartitionNo}
                  // FormHelperTextProps={{ style: { color: 'red' } }}
                  // onKeyDown={handleNumberInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
                <InputLabel id="open-plot-label">Open Plot:</InputLabel>
                <Select
                  labelId="open-plot-label"
                  name={isNewProperty ? 'OpenPlot' : 'OpenPlot'}
                  disabled={accessLevel < 3}
                  value={isNewProperty ? NewPropertyFields.OpenPlot : PropertyMast.OpenPlot}
                  onChange={isNewProperty ? handleNewPropertyClick : handlePropertyChange}
                  style={{ height: '35px' }}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.4}>
              <Stack spacing={1}>
                <InputLabel>CSN:</InputLabel>
                <TextField
                  required
                  placeholder="CSN:"
                  name={isNewProperty ? 'NewCityServeyNo' : 'NewCityServeyNo'}
                  value={isNewProperty ? NewPropertyFields.NewCityServeyNo ?? '' : PropertyMast.NewCityServeyNo ?? ''}
                  onChange={isNewProperty ? handleNewPropertyClick : handlePropertyChange}
                  error={!!errors.NewCityServeyNo}
                  helperText={errors.NewCityServeyNo}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  //onKeyDown={handleOnlyNumberInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.4}>
              <Stack spacing={1}>
                <InputLabel>Plot No:</InputLabel>
                <TextField
                  required
                  placeholder="Plot No:"
                  fullWidth
                  name={isNewProperty ? 'NewPlotNo' : 'NewPlotNo'}
                  value={isNewProperty ? NewPropertyFields.NewPlotNo : PropertyMast.NewPlotNo}
                  onChange={isNewProperty ? handleNewPropertyClick : handlePropertyChange}
                  error={!!errors.NewPlotNo}
                  helperText={errors.NewPlotNo}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  //onKeyDown={handleOnlyNumberInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            {/* <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <InputLabel>Property Description:</InputLabel>
                <Select
                  style={{ height: '35px' }}
                  name={isNewProperty ? 'PropertyTypeID' : 'PropertyTypeID'}
                  value={isNewProperty ? NewPropertyFields.PropertyTypeID : PropertyMast.PropertyTypeID}
                  onChange={isNewProperty ? handleNewPropertyClick : handlePropertyChange}
                  error={!!errors.PropertyTypeID}
                 
                  disabled={
                    isNewProperty
                      ? NewPropertyFields.OpenPlot === 'true' || accessLevel < 3
                      : PropertyMast.OpenPlot === 'true' || accessLevel < 3
                  }
                >
                  {propertyDesc.map((user, index) => (
                    <MenuItem key={index} value={user.PropertyTypeID}>
                      {user.PropertyDescription}
                    </MenuItem>
                  ))}
                </Select>
                  {errors.PropertyTypeID && (
                    <FormHelperText style={{ color: 'red' }}>   {errors.PropertyTypeID}</FormHelperText>
                  )}
                   
                
              </Stack>
            </Grid> */}
            {/* <Grid item xs={12} sm={2}>
  <Stack spacing={1}>
    <InputLabel>Property Description:</InputLabel>

    <FormControl
      error={!!errors.PropertyTypeID}
      fullWidth
      size="small"
      disabled={
        isNewProperty
          ? NewPropertyFields.OpenPlot === 'true' || accessLevel < 3
          : PropertyMast.OpenPlot === 'true' || accessLevel < 3
      }
    >
      <Select
        style={{ height: '35px' }}
        name="PropertyTypeID"
        value={isNewProperty ? NewPropertyFields.PropertyTypeID : PropertyMast.PropertyTypeID}
        onChange={isNewProperty ? handleNewPropertyClick : handlePropertyChange}
      
      >
        {propertyDesc.map((user, index) => (
          <MenuItem key={index} value={user.PropertyTypeID}>
            {user.PropertyDescription}
          </MenuItem>
        ))}
      </Select>

      {errors.PropertyTypeID && (
        <FormHelperText sx={{ color: 'red' }}>
          {errors.PropertyTypeID}
        </FormHelperText>
      )}
    </FormControl>
  </Stack>
</Grid> */}
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <InputLabel>Property Description:</InputLabel>

                <FormControl
                  fullWidth
                  size="small"
                  error={Boolean(errors.PropertyTypeID)}
                  disabled={
                    isNewProperty
                      ? NewPropertyFields.OpenPlot === 'true' || accessLevel < 3
                      : PropertyMast.OpenPlot === 'true' || accessLevel < 3
                  }
                  sx={{
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'red !important'
                    }
                  }}
                >
                  <Select
                    name="PropertyTypeID"
                    value={isNewProperty ? NewPropertyFields.PropertyTypeID || '' : PropertyMast.PropertyTypeID || ''}
                    onChange={isNewProperty ? handleNewPropertyClick : handlePropertyChange}
                    displayEmpty
                    sx={{
                      height: 35
                    }}
                    MenuProps={{
                                 PaperProps: {
                                 sx: {
                                 maxHeight: 200,   // dropdown height
                                 width: 240        // dropdown width
      }
    }
  }}
                  >
                    {propertyDesc.map((user, index) => (
                      <MenuItem key={index} value={user.PropertyTypeID}>
                        {user.PropertyDescription}
                      </MenuItem>
                    ))}
                  </Select>

                  {errors.PropertyTypeID && <FormHelperText sx={{ color: 'red' }}>{errors.PropertyTypeID}</FormHelperText>}
                </FormControl>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={1.3}>
              <Stack spacing={1}>
                <InputLabel>Plot Area SqFt</InputLabel>
                <TextField
                  placeholder="Plot Ar SqFt"
                  name={isNewProperty ? 'PlotTaxableAreaSqFt' : 'PlotTaxableAreaSqFt'}
                  value={isNewProperty ? NewPropertyFields.PlotTaxableAreaSqFt ?? '' : PropertyMast.PlotTaxableAreaSqFt ?? ''}
                  onChange={isNewProperty ? handlePlotFtAreaChange : handlePropertyChange}
                  error={!!errors.PlotTaxableAreaSqFt}
                  helperText={errors.PlotTaxableAreaSqFt}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  onKeyDown={handleNumberAndFloatInput}
                  //disabled={accessLevel < 3}
                  disabled={isNewProperty ? '' : '' || accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.3}>
            <Stack spacing={1}>
                          <InputLabel>Plot Area SqMtr</InputLabel>
                          <TextField
                            name="PlotAreaSqMtr"
                            // value={plotAreaSqMtr}
                            // value={isNewProperty && (!inputCarpetFtArea || !NewPropertyFields?.PlotTaxableAreaSqFt) ? '' : plotAreaSqMtr}
                            value={isNewProperty && !NewPropertyFields?.PlotTaxableAreaSqFt ? '' : PropertyMast.PlotAreaSqMtr}                            fullWidth
                            onChange={handlePlotMtrAreaChange}
                          />
                        </Stack>
            </Grid>
            <Grid item xs={12} sm={1.3}>
              <Stack spacing={1}>
                <InputLabel>Carpet Area SqFt</InputLabel>
                <TextField
                  placeholder="Carpet Area SqFT"
                  fullWidth
                  name={isNewProperty ? 'inputCarpetFtArea' : 'CarpetAreaSqFeet'}
                  // value={isNewProperty ? inputCarpetFtArea : carpetAreaSqft}
                  value={inputCarpetFtArea}
                  disabled={isNewProperty ? isDisabled : isDisabled || accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.4}>
              <Stack spacing={1}>
                <InputLabel>Build Up Area SqFt</InputLabel>
                <TextField
                  required
                  placeholder="BuildUp Area"
                  name="buildUpArea"
                  //value={buildUpAreaSqft}
                  value={buildUpAreaSqft}
                  // onChange={(e) => {
                  //   setBuildUpAreaSqft(e.target.value);
                  // }}
                  onKeyDown={handleNumberAndFloatInput}
                  //disabled={accessLevel < 3}
                  disabled={isNewProperty ? isDisabled : isDisabled || accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.4}>
              <Stack spacing={1}>
                <InputLabel>Rented Area SqFt</InputLabel>

                <TextField
                  required
                  placeholder="RentedArSqFt"
                  fullWidth
                  autoComplete="family-name"
                  name={'inputRenterCarpetFtArea'}
                  value={inputRenterCarpetFtArea ? Number(inputRenterCarpetFtArea).toFixed(2) : '0.00'}
                  onKeyDown={handleNumberAndFloatInput}
                  //disabled={accessLevel < 3}
                  //disabled={true}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.4}>
              <Stack spacing={1}>
                <InputLabel>Total Rent</InputLabel>
                <TextField
                  required
                  placeholder="Total Rent"
                  fullWidth
                  autoComplete="family-name"
                  value={inputRenterRent}
                  name={'inputRenterRent'}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.7}>
              <Stack spacing={1}>
                <InputLabel>Owner ID</InputLabel>
                <TextField
                  required
                  fullWidth
                  autoComplete="family-name"
                  type="number"
                  name={isNewProperty ? 'OwnerID' : 'OwnerID'}
                  value={isNewProperty ? NewPropertyFields.OwnerID || '' : PropertyMast.OwnerID}
                  onChange={isNewProperty ? handleNewPropertyClick : handlePropertyChange}
                  // onKeyDown={handleNumberInput}
                  //disabled={ownerIdDisabled || accessLevel < 3}
                  disabled={true}
                />
              </Stack>
            </Grid>

            <Grid item xs={40} sm={2}>
              <Stack spacing={10}>
                <Button style={{ marginTop: 30 }} variant="contained" onMouseEnter={() => setOpenDialog(true)}>
                  In Mtr
                </Button>
                <Dialog
                  open={openDialog}
                  onClose={handleCloseDialog}
                  fullWidth
                  maxWidth="sm"
                  PaperProps={{
                    sx: { pointerEvents: 'auto' }
                  }}
                >
                  <DialogTitle id="alert-dialog-title">In SqMtr</DialogTitle>
                  <DialogContent>
                    <Grid container spacing={2}>
                      {/* <Grid item xs={12} sm={3}>
                        <Stack spacing={1}>
                          <InputLabel>Plot Area SqMtr</InputLabel>
                          <TextField
                            name="PlotAreaSqMtr"
                            // value={plotAreaSqMtr}
                            // value={isNewProperty && (!inputCarpetFtArea || !NewPropertyFields?.PlotTaxableAreaSqFt) ? '' : plotAreaSqMtr}
                            value={isNewProperty && !NewPropertyFields?.PlotTaxableAreaSqFt ? '' : plotAreaSqMtr.toFixed(2)}
                            fullWidth
                            onChange={handlePlotMtrAreaChange}
                          />
                        </Stack>
                      </Grid> */}
                      <Grid item xs={12} sm={3}>
                        <Stack spacing={1}>
                          <InputLabel> Carpet Area SqMtr</InputLabel>
                          <TextField
                            required
                            fullWidth
                            maxWidth="sm"
                            value={isNewProperty && (!inputCarpetFtArea || !NewPropertyFields?.PlotTaxableAreaSqFt) ? '' : carpetAreaSqMtr}
                          ></TextField>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack spacing={1}>
                          <InputLabel> Built Up Area SqMtr</InputLabel>
                          <TextField
                            required
                            fullWidth
                            maxWidth="sm"
                            value={
                              isNewProperty && (!inputCarpetFtArea || !NewPropertyFields?.PlotTaxableAreaSqFt) ? '' : buildeUpAreaSqMtr
                            }
                          ></TextField>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Stack spacing={1}>
                          <InputLabel> Rented Area SqMtr</InputLabel>
                          <TextField
                            required
                            fullWidth
                            maxWidth="sm"
                            value={isNewProperty && (!inputCarpetFtArea || !NewPropertyFields?.rentedArea) ? '' : rentedAreaSqMtr}
                          ></TextField>
                        </Stack>
                      </Grid>
                      {/* <Grid item xs={12} sm={3}>
        <Stack spacing={1}>
          <InputLabel> Carpet Area SqMtr</InputLabel>
          <TextField
            required
            fullWidth
            value={isNewProperty? inputCarpetArea : carpetAreaSqMtr} // Show input for new property, otherwise show DB value
            onChange={handleCarpetAreaChange} // Only allow changes if it's a new property
            disabled={!isNewProperty} // Disable input if it's not a new property
          />
        </Stack>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Stack spacing={1}>
          <InputLabel> Built Up Area SqMtr</InputLabel>
          <TextField
            required
            fullWidth
            value={buildUpAreaSqMtr}
            disabled={!isNewProperty}
          />
        </Stack>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Stack spacing={1}>
          <InputLabel> Rented Area SqMtr</InputLabel>
          <TextField
            required
            fullWidth
            value={rentedAreaSqMtr}
            disabled={!isNewProperty}
          />
        </Stack>
      </Grid>  */}
                    </Grid>
                  </DialogContent>
                </Dialog>
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="h5" gutterBottom sx={{ mt: 2, mb: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
            Owner Details :
          </Typography>

          <Grid container spacing={3} direction="row" display="flex">
            <Grid item xs={1}>
              <Stack spacing={1}>
                <InputLabel>Title</InputLabel>
                <Select
                  value={isNewProperty ? newOwnerDetails.OwnerTitle : ownerDetails.OwnerTitle}
                  name="OwnerTitle"
                  error={!!errors.OwnerTitle}
                  helperText={errors.OwnerTitle}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  disabled={accessLevel < 3}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setErrors((prevErrors) => {
                      const updatedErrors = { ...prevErrors };
                      delete updatedErrors.OwnerTitle;
                      return updatedErrors;
                    });
                    // Update both English and Marathi titles
                    let marathiTitle;
                    switch (newValue) {
                      case 'Mr.':
                        marathiTitle = 'श्री';
                        break;
                      case 'Mrs.':
                        marathiTitle = 'श्रीमती';
                        break;
                      case 'Miss':
                        marathiTitle = 'कु';
                        break;
                      case 'Others':
                        marathiTitle = 'इतर';
                        break;
                      default:
                        marathiTitle = 'इतर';
                        break;
                    }

                    if (isNewProperty) {
                      setNewOwnerDetails((prevState) => ({
                        ...prevState,
                        OwnerTitle: newValue,
                        OwnerTitleMarathi: marathiTitle // Sync Marathi title
                      }));
                    } else {
                      setOwnerDetails((prevState) => ({
                        ...prevState,
                        OwnerTitle: newValue,
                        OwnerTitleMarathi: marathiTitle // Sync Marathi title
                      }));
                    }
                  }}
                  displayEmpty
                  sx={{ bgcolor: '#F5F5F5' }}
                >
                  <MenuItem value={'Mr.'}>Mr.</MenuItem>
                  <MenuItem value={'Mrs.'}>Mrs.</MenuItem>
                  <MenuItem value={'Others'}>Others</MenuItem>
                  <MenuItem value={'Miss'}>Miss</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={2.5}>
              <Stack spacing={1}>
                <InputLabel>Full Name</InputLabel>
                <TextField
                  required
                  id="FullNameBasic"
                  value={isNewProperty ? newOwnerDetails.OwnerName : ownerDetails.OwnerName}
                  name="OwnerName"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  fullWidth
                  autoComplete="given-name"
                  error={!!errors.OwnerName}
                  helperText={errors.OwnerName}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  onKeyDown={handleAlphabetInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={2.5}>
              <Stack spacing={1}>
                <InputLabel>Occupier Name</InputLabel>
                <TextField
                  required
                  value={isNewProperty ? newOwnerDetails.OccupierName : ownerDetails.OccupierName}
                  name="OccupierName"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  fullWidth
                  autoComplete="family-name"
                  error={!!errors.OccupierName}
                  helperText={errors.OccupierName}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  //onKeyDown={handleOnlyNumberInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={2.5}>
              <Stack spacing={1}>
                <InputLabel>Address</InputLabel>
                <TextField
                  required
                  value={isNewProperty ? newOwnerDetails.Address : ownerDetails.Address}
                  name="Address"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  fullWidth
                  autoComplete="family-name"
                  error={!!errors.Address}
                  helperText={errors.Address}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  onKeyDown={handleAddressInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={1.8}>
              <Stack spacing={1}>
                <InputLabel>Shop/ building Name</InputLabel>
                <TextField
                  required
                  value={isNewProperty ? newOwnerDetails.BuildingOrShopName : ownerDetails.BuildingOrShopName}
                  name="BuildingOrShopName"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  fullWidth
                  autoComplete="family-name"
                  error={!!errors.BuildingOrShopName}
                  helperText={errors.BuildingOrShopName}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  //onKeyDown={handleAlphabetInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={1.5}>
              <Stack spacing={1}>
                <InputLabel>Shop/Flat No.</InputLabel>
                <TextField
                  required
                  value={isNewProperty ? newOwnerDetails.BuildingOrFlatNo : ownerDetails.BuildingOrFlatNo}
                  name="BuildingOrFlatNo"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  fullWidth
                  autoComplete="family-name"
                  error={!!errors.BuildingOrFlatNo}
                  helperText={errors.BuildingOrFlatNo}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  //onKeyDown={handleOnlyNumberInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row" display="flex" style={{ marginTop: 10 }}>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <InputLabel>Title(Marathi)</InputLabel>
                <Select
                  value={isNewProperty ? newOwnerDetails.OwnerTitleMarathi : ownerDetails.OwnerTitleMarathi}
                  name="OwnerTitleMarathi"
                  disabled={accessLevel < 3}
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  readOnly
                  sx={{ bgcolor: '#F5F5F5' }}
                  // error={!!errors.OwnerTitleMarathi}
                  // helperText={errors.OwnerTitleMarathi}
                  // FormHelperTextProps={{ style: { color: 'red' } }}
                >
                  <MenuItem value={'श्री'}>श्री</MenuItem>
                  <MenuItem value={'श्रीमती'}>श्रीमती</MenuItem>
                  <MenuItem value={'कु'}>कु</MenuItem>
                  <MenuItem value={'इतर'}>इतर</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={2.5}>
              <Stack spacing={1}>
                <InputLabel>Full Name(Marathi)</InputLabel>
                <TextField
                  required
                  id="FullNameBasic"
                  value={isNewProperty ? newOwnerDetails.OwnerNameMarathi : ownerDetails.OwnerNameMarathi}
                  name="OwnerNameMarathi"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  fullWidth
                  autoComplete="given-name"
                  disabled={accessLevel < 3}
                  // error={!!errors.OwnerNameMarathi}
                  // helperText={errors.OwnerNameMarathi}
                  // FormHelperTextProps={{ style: { color: 'red' } }}
                />
              </Stack>
            </Grid>
            <Grid item xs={2.5}>
              <Stack spacing={1}>
                <InputLabel>Occupier Name(Marathi)</InputLabel>
                <TextField
                  required
                  value={isNewProperty ? newOwnerDetails.OccupierNameMarathi : ownerDetails.OccupierNameMarathi}
                  name="OccupierNameMarathi"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  fullWidth
                  autoComplete="family-name"
                  error={!!errors.OccupierNameMarathi}
                  helperText={errors.OccupierNameMarathi}
                  FormHelperTextProps={{ style: { color: 'red' } }}
                  //onKeyDown={handleOnlyNumberInput}
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={2.5}>
              <Stack spacing={1}>
                <InputLabel>Address(Marathi)</InputLabel>
                <TextField
                  required
                  value={isNewProperty ? newOwnerDetails.OwnerPatta : ownerDetails.OwnerPatta}
                  name="OwnerPatta"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  disabled={accessLevel < 3}
                  autoComplete="family-name"
                  // error={!!errors.OwnerPatta}
                  // helperText={errors.OwnerPatta}
                  // FormHelperTextProps={{ style: { color: 'red' } }}
                />
              </Stack>
            </Grid>
            <Grid item xs={1.8}>
              <Stack spacing={1}>
                <InputLabel>Shop/building Name(Marathi)</InputLabel>
                <TextField 
                  required
                  value={
                    showZones && showWardNo && showPropertyNo
                      ? newOwnerDetails.BuildingOrShopNameMarathi
                      : ownerDetails.BuildingOrShopNameMarathi
                  }
                  name="BuildingOrShopNameMarathi"
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                  fullWidth
                  disabled={accessLevel < 3}
                  autoComplete="family-name"
                  // error={!!errors.BuildingOrShopNameMarathi}
                  // helperText={errors.BuildingOrShopNameMarathi}
                  // FormHelperTextProps={{ style: { color: 'red' } }}
                />
              </Stack>
            </Grid>
            <Grid item xs={1.5}>
              <Stack spacing={1}>
                <InputLabel>Shop/Flat.No(Marathi)</InputLabel>
                <TextField
                  required
                  fullWidth
                  // error={!!errors.BuildingOrFlatNoMarathi}
                  // helperText={errors.BuildingOrFlatNoMarathi}
                  // FormHelperTextProps={{ style: { color: 'red' } }}
                  value={
                    showZones && showWardNo && showPropertyNo
                      ? newOwnerDetails.BuildingOrFlatNoMarathi
                      : ownerDetails.BuildingOrFlatNoMarathi
                  }
                  name="BuildingOrFlatNoMarathi"
                  disabled={accessLevel < 3}
                  onChange={isNewProperty ? handleNewOwnerDetailsChange : handleOwnerDetailsChange}
                />
              </Stack>
            </Grid>
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
              <Button variant="contained" color="success" onClick={handleAddButtonClick}>
                Add
              </Button>
            </Grid>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <SnackbarContent
              sx={{
                backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
              }}
              message={snackbarMessage}
            />
          </Snackbar>
          <Grid container spacing={3}>
            <TableContainer style={{ marginTop: 20, marginLeft: 20, height: '32vh' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      Edit
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      Delete
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      isPrime
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                    Title(Marathi)                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                    Full Name(Marathi)
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                    Occupier Name(Marathi) 
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                    Address(Marathi)
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                    Shop/build.Name(Marathi)
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                    Shop/Flat.No(Marathi)
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      Title
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      Full Name
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      Occupier Name
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      Address
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      Shop/Building Name
                    </TableCell>
                    <TableCell className="font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                      Shop/Flat No.
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isNewProperty ? (
                    newOwnerForm.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13} align="center">
                          No data available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      newOwnerForm
                        .filter((row) => !!row?.JODId)
                        // .sort((a, b) => (b.isPrime ? 1 : 0) - (a.isPrime ? 1 : 0))
                        .map((data, index) => {
                          console.log('Rendering newOwnerForm item:', data); // <-- Added
                          return (
                            <TableRow key={`${data.JODId}-${index}`}>
                              {/* Edit Button */}
                              <TableCell>
                                <IconButton
                                  color={selectedItemNewPropDelete?.JODId === data.JODId ? 'success' : 'primary'}
                                  disabled={accessLevel < 3}
                                  onClick={() => handleRowClick(data)}
                                >
                                  {selectedItemNewPropDelete?.JODId === data.JODId ? <SendOutlined /> : <EditTwoTone />}
                                </IconButton>
                              </TableCell>

                              {/* Delete Button */}
                              <TableCell>
                                <IconButton color="error" onClick={() => handleDeleteNewClick(data.JODId)} disabled={accessLevel < 4}>
                                  <CloseOutlined />
                                </IconButton>
                              </TableCell>

                              {/* isPrime */}
                              <TableCell style={{ textAlign: 'center' }}>
                                <Checkbox checked={data.isPrime} onChange={(e) => handleToggleIsPrime(data.JODId, e.target.checked)} />
                              </TableCell>

                              {/* Data Fields */}
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.OwnerTitleMarathi || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.OwnerNameMarathi || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.OccupierNameMarathi || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.OwnerPatta || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.BuildingOrShopNameMarathi || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.BuildingOrFlatNoMarathi || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.OwnerTitle || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.OwnerName || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.OccupierName || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.Address || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.BuildingOrShopName || ''}</TableCell>
                              <TableCell style={{ whiteSpace: 'nowrap' }}>{data.BuildingOrFlatNo || ''}</TableCell>
                            </TableRow>
                          );
                        })
                    )
                  ) : jointOwnerList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        No data available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    jointOwnerList
                      // .sort((a, b) => (b.isPrime ? 1 : 0) - (a.isPrime ? 1 : 0))
                      .map((item, index) => {
                        console.log('Rendering jointOwnerList item:', item); // <-- Added
                        return (
                          <TableRow key={`${item.JODId}-${index}`}>
                            {/* Edit Button */}
                            <TableCell>
                              <IconButton
                                color={selectedItem?.JODId === item.JODId ? 'success' : 'primary'}
                                onClick={() => handleRowClick(item)}
                                disabled={accessLevel < 3}
                              >
                                {selectedItem?.JODId === item.JODId ? <SendOutlined /> : <EditTwoTone />}
                              </IconButton>
                            </TableCell>

                            {/* Delete Button */}
                            <TableCell>
                              <IconButton color="error" onClick={() => handleDeleteClick(item.JODId)} disabled={accessLevel < 4}>
                                <CloseOutlined />
                              </IconButton>
                            </TableCell>

                            {/* isPrime */}
                            <TableCell style={{ textAlign: 'center' }}>
                              <Checkbox checked={item.isPrime} onChange={(e) => handleToggleIsPrime(item.JODId, e.target.checked)} />
                            </TableCell>

                            {/* Data Fields */}
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.OwnerTitleMarathi || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.OwnerNameMarathi || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.OccupierNameMarathi || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.OwnerPatta || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.BuildingOrShopNameMarathi || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.BuildingOrFlatNoMarathi || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.OwnerTitle || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.OwnerName || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.OccupierName || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.Address || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.BuildingOrShopName || ''}</TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>{item.BuildingOrFlatNo || ''}</TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Dialog open={open} maxWidth="xs" fullWidth>
            <DialogContent>
              <Typography variant="body1">Are you sure you want to delete?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleYes(selectedJODId)} color="error" variant="contained">
                Yes
              </Button>
              <Button onClick={handleNo} color="primary" variant="outlined">
                No
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openNewPropDelete} maxWidth="xs" fullWidth>
            <DialogContent>
              <Typography variant="body1">Are you sure you want to delete?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleYesNewPropertyDelete} color="error" variant="contained">
                Yes
              </Button>
              <Button onClick={handleNoNewPropertyDelete} color="primary" variant="outlined">
                No
              </Button>
            </DialogActions>
          </Dialog>
        </MainCard>
      )}
    </>
  );
}
