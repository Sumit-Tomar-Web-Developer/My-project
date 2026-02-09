// material-ui
import { Button, Grid, IconButton, InputLabel, Stack, Select, TextField, Typography, MenuItem, Snackbar, SnackbarContent } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { CloseOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { setOldPropertyMast, setPendingTaxesReducer, setPropertyDetailsOld, setOldTaxesReducer, setDeletedPDOIdsExistingProperty } from 'state/reducers/ExistingPropertySlice';
import { fetchConstructionType, fetchOldConstructionTypes } from 'services/construction.services';
import { fetchOldFloor } from 'services/floorMaster.service';
import { getOldTypeOfUseList } from 'services/masterServices/typeOfUseServices/typeOfUse.service';
import { getFinanceYear } from 'services/utlilityService/AddTaxService/AddTaxService';
import { fetchPropertyDescription } from 'services/data-entry.services';

function OldInformation(
  { isNewProperty }

  // { mainPropertyData }
) {
  const [propertyMasterOld, setPropertyOldMaster] = useState({
    OldZoneNo: '',
    OldWardNo: '',
    OldPropertyNo: '',
    OldPartitionNo: '',
    OldComputerNo: '',
    OldDescription: '',
    OldCityServeyNo: '',
    OldPlotNo: '',
    OldRV: '',
    OldPropertyTax: null,
    OldTotalTax: null,
    OldPlotArea: null,
    OldToiletNo: null,
    OldALV: '',
    OldTotalRooms: null,
    ConstAreaSqFt: '',
  });
  const [propertyDescriptionList, setPropertyDescriptionList] = useState([])

  //page access from redux
  const accessLevel = useSelector((state) => state.accessLevel.value);
  const [propertyOldDetails, setPropertyOldDetails] = useState([]);
  const [oldTaxes, setOldTaxes] = useState({
    PropertyTax: 0,
    EducationTax: 0,
    EmploymentTax: 0,
    TreeCess: 0,
    FireCess: 0,
    SpEducationTax: 0,
    MajorBuilding: 0,
    LightCess: 0,
    RoadCess: 0,
    DrainCess: 0,
    SewageDisposalCess: 0,
    Sanitation: 0,
    SpWaterCess: 0,
    WaterBenefit: 0,
    WaterBill: 0,
    Interest: 0,
    TaxTotal: 0,
    OldTaxYear: '',
    Tax1: 0
  });
  const [pendingTaxes, setPendingTaxes] = useState({
    // TPDID: '0',
    // OwnerID: '0',
    // PendingYear: '',
    // PropertyTax: '0',
    // EducationTax: '0',
    // SpEducationTax: '0',
    // EmploymentTax: '0',
    // TreeCess: '0',
    // FireCess: '0',
    // LightCess: '0',
    // DrainCess: '0',
    // RoadCess: '0',
    // Sanitation: '0',
    // SpWaterCess: '0',              // W. Cess
    // WaterBenefit: '0',
    // WaterBill: '0',
    // MajorBuilding: '0',
    // SewageDisposalCess: '0',
    // Interest: '0',
    // TaxTotal: '0',
    // Tax1: '0',
    // GrandTotal: '0',
    // Remark: ''
  });
  const [pendingTaxesList, setPendingTaxesList] = useState([])
  const [selectedPDOId, setSelectedPDOId] = useState([]);
  const [oldConstructionYearError, setOldConstructionYearError] = useState(false)
  const [editOldDetails, setOldDetails] = useState({
    // PDOId: '',
    // OwnerID: '',
    // OldFloorID: '',
    // OldConstructionYear: '',
    // OldConstructionType: '',
    // OldTypeOFUse: '',
    // OldCarpetAreaSqfeet: '',
    // OldCarpetAreaSqMeter: '',

  });
  const isAddDisabled = [
    editOldDetails.OldFloorID,
    editOldDetails.OldConstructionYear,
    editOldDetails.OldConstructionType,
    editOldDetails.OldTypeOFUse,
    editOldDetails.OldCarpetAreaSqfeet,
    editOldDetails.OldCarpetAreaSqMeter
  ].some(x => typeof x === 'string' ? x.trim() === '' : x === null || x === undefined);
  const isFirstRender = useRef(true);
  const [
    isFloorInfoAlreadyExists, setFloorInfoAlreadyExists] = useState(true);
  const handleAddOrUpdate = () => {
    const detailsToAdd = editOldDetails;

    setSelectedPDOId((prev) => {
      // Ensure prev is an array
      if (!Array.isArray(prev)) {
        prev = [];
      }

      const existingItemIndex = prev.findIndex((item) => item.PDOId === detailsToAdd.PDOId);
      let updatedList;

      if (existingItemIndex !== -1) {
        // Update existing item
        updatedList = [...prev];
        updatedList[existingItemIndex] = {
          ...detailsToAdd,
          Insert: false,
          Update: true
        };
      } else {
        // Add new item
        const newEntry = {
          ...detailsToAdd,
          PDOId: detailsToAdd.PDOId && detailsToAdd.PDOId !== ''
            ? detailsToAdd.PDOId
            : Math.floor(Math.random() * 1000000000), // Fallback for unique ID
          Insert: true,
          Update: false
        };
        updatedList = [...prev, newEntry];
      }
      dispatch(setPropertyDetailsOld({ newData: updatedList }));

      return updatedList;
    });
    // Clear the input fields
    setOldDetails({
      PDOId: '',
      OldFloorID: '',
      OldConstructionYear: '',
      OldConstructionType: '',
      OldTypeOFUse: '',
      OldCarpetAreaSqfeet: '',
      OldCarpetAreaSqMeter: '',

    });
  };
  useEffect(() => {
    if (isNewProperty) {
      console.log(isNewProperty, 'isNewProperty')
      setPropertyOldMaster(pre => ({
        ...pre,
        OldZoneNo: '',
        OldWardNo: '',
        OldPropertyNo: '',
        OldPartitionNo: '',
        OldComputerNo: '',
        OldDescription: '',
        OldCityServeyNo: '',
        OldPlotNo: '',
        OldRV: '',
        OldPropertyTax: '',
        OldTotalTax: '',
        OldPlotArea: null,
        OldToiletNo: null,
        OldALV: '',
        OldTotalRooms: null,
        ConstAreaSqFt: '',
      }))
      setPendingTaxesList([])
      setPendingTaxes(pre => ({
        ...pre,
        TPDID: '0',
        OwnerID: '0',
        PendingYear: '',
        PropertyTax: '0',
        EducationTax: '0',
        SpEducationTax: '0',
        EmploymentTax: '0',
        TreeCess: '0',
        FireCess: '0',
        LightCess: '0',
        DrainCess: '0',
        RoadCess: '0',
        Sanitation: '0',
        SpWaterCess: '0',              // W. Cess
        WaterBenefit: '0',
        WaterBill: '0',
        MajorBuilding: '0',
        SewageDisposalCess: '0',
        Interest: '0',
        TaxTotal: '0',
        Tax1: '0',
        GrandTotal: '0',
        Remark: ''
      }))
      setOldDetails(pre => ({
        ...pre,
        PDOId: '',
        OldFloorID: '',
        OldConstructionYear: '',
        OldConstructionType: '',
        OldTypeOFUse: '',
        OldCarpetAreaSqfeet: '',
        OldCarpetAreaSqMeter: '',

      }))
      setOldTaxes({
        PropertyTax: 0,
        EducationTax: 0,
        EmploymentTax: 0,
        TreeCess: 0,
        FireCess: 0,
        SpEducationTax: 0,
        MajorBuilding: 0,
        LightCess: 0,
        RoadCess: 0,
        DrainCess: 0,
        SewageDisposalCess: 0,
        Sanitation: 0,
        SpWaterCess: 0,
        WaterBenefit: 0,
        WaterBill: 0,
        Interest: 0,
        TaxTotal: 0,
        OldTaxYear: '',
        Tax1: 0
      })

      dispatch(setPropertyDetailsOld({}));
      dispatch(setOldPropertyMast({}))
      dispatch(setPendingTaxesReducer({}));



    }
  }, [isNewProperty])


  useEffect(() => {

    console.log('Old Floor details', editOldDetails);
    console.log('Old Floor details 2', selectedPDOId);
    if (selectedPDOId.some(item => item.OldFloorID === editOldDetails.OldFloorID
      && item.OldConstructionYear == editOldDetails.OldConstructionYear
      && item.OldConstructionType == editOldDetails.OldConstructionType
      && item.OldTypeOFUse == editOldDetails.OldTypeOFUse
      && item.OldCarpetAreaSqfeet == editOldDetails.OldCarpetAreaSqfeet
      && item.OldCarpetAreaSqMeter == editOldDetails.OldCarpetAreaSqMeter)) {
      setFloorInfoAlreadyExists(true);
    } else {
      setFloorInfoAlreadyExists(false);
    }

  }, [editOldDetails]);
  useEffect(() => {


    const toNumber = (v) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    };

    const totalSqFt = (selectedPDOId || []).reduce(
      (sum, item) => sum + toNumber(item?.OldCarpetAreaSqfeet ?? item?.OldCarpetAreaSqFeet),
      0
    );

    setPropertyOldMaster((pre) => ({
      ...pre,
      ConstAreaSqFt: totalSqFt
    }))
    dispatch(setOldPropertyMast({
      ...propertyMasterOld,
      ConstAreaSqFt: totalSqFt
    }))
  }, [selectedPDOId]);

  useEffect(() => {
    if (!isFirstRender.current) {
      if (isFloorInfoAlreadyExists) {
        if (isFirstRender.current) {
          return;
        }
        setSnackbarSeverity('error');
        setSnackbarMessage('Floor information already exists');
        setSnackbarOpen(true);
      }
    }
  }, [isFloorInfoAlreadyExists]);


  const [TypeOFUseList, setTypeOFUseList] = useState([]);
  const [constructionTypeList, setConstructionTypeList] = useState([]);
  const [floorList, setFloorList] = useState([]);
  const dispatch = useDispatch();

  const handleRowClick1 = (item) => {
    const { name, value } = item
    setPendingTaxes((prev) => {
      const next = { ...prev, [name]: value };

      if (!['TaxTotal', 'GrandTotal'].includes(name)) {
        const subtotal = sumTaxComponents(next);
        const interest = Number(next.Interest) || 0;

        next.TaxTotal = subtotal;
        next.GrandTotal = subtotal + interest;
      }

      return next;
    });
  };

  const handleRowClick2 = (item) => {
    setOldDetails(item);
  };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }
  useEffect(() => {
    fetchConstructionType().then((res) => {
      console.log('fetchOldConstructionTypes', res)
      setConstructionTypeList(res.data);
    });
    fetchOldFloor().then((res) => {
      setFloorList(res.floors);
      // console.log(res.floors, 'Old Floor');
    });
    getOldTypeOfUseList().then((res) => {
      setTypeOFUseList(res);
      // console.log(res, 'Old Type of Use');

    });
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Allow only numbers (and dot) for all fields except 'Remark'


    // Example conversion logic (e.g., carpet area)
    if (name === 'OldCarpetAreaSqfeet') {
      const sqMeter = value && !isNaN(value)
        ? (parseFloat(value) * 0.092903).toFixed(2)
        : '';

      setOldDetails((prev) => ({
        ...prev,
        [name]: value,
        OldCarpetAreaSqMeter: sqMeter
      }));
    } else {
      setOldDetails((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    setPropertyOldMaster((prev) => ({
      ...prev,
      [name]: value
    }));

    setPendingTaxes((prev) => {
      const next = { ...prev, [name]: value };

      if (!['TaxTotal', 'GrandTotal'].includes(name)) {
        const subtotal = sumTaxComponents(next);
        const interest = Number(next.Interest) || 0;

        next.TaxTotal = subtotal;
        next.GrandTotal = subtotal + interest;
      }

      return next;
    });

    setPropertyOldDetails((prev) => ({
      ...prev,
      [name]: value
    }));

    dispatch(setOldPropertyMast({
      ...propertyMasterOld,
      [name]: value
    }));
  };

  // useEffect(() => { dispatch(oldPropertyMast(propertyMasterOld)) }, [propertyMasterOld])


  const handlePTAddOrUpdate = () => {


    setPendingTaxesList((prev) => {
      // Ensure prev is an array
      if (!Array.isArray(prev)) {
        prev = [];
      }

      const existingItemIndex = prev.findIndex((item) => { console.log(pendingTaxes, item, 'pendingTaxes'); return item.PendingYear === pendingTaxes.PendingYear });
      let updatedList;

      if (existingItemIndex !== -1) {
        // Update existing item
        updatedList = [...prev];
        updatedList[existingItemIndex] = {
          ...pendingTaxes,

          Insert: false,
          Update: true
        };
      } else {
        // Add new item
        const newEntry = {
          ...pendingTaxes,
          TPDID: pendingTaxes.TPDID && pendingTaxes.TPDID !== ''
            ? pendingTaxes.TPDID
            : Math.floor(Math.random() * 1000000000),
          Insert: true,
          Update: false
        };
        updatedList = [...prev, newEntry];
      }
      dispatch(setPendingTaxesReducer({ newData: updatedList }));

      return updatedList;
    });
    // Clear the input fields
    setPendingTaxes(prev => ({
      ...prev,
      TPDID: '0',
      OwnerID: '0',
      PendingYear: '',
      PropertyTax: '0',
      EducationTax: '0',
      SpEducationTax: '0',
      EmploymentTax: '0',
      TreeCess: '0',
      FireCess: '0',
      LightCess: '0',
      DrainCess: '0',
      RoadCess: '0',
      Sanitation: '0',
      SpWaterCess: '0',              // W. Cess
      WaterBenefit: '0',
      WaterBill: '0',
      MajorBuilding: '0',
      SewageDisposalCess: '0',
      Interest: '0',
      TaxTotal: '0',
      Tax1: '0',
      Remark: '',
      GrandTotal: '0'
    }));

  };
  const CombinedData = useSelector((state) => state.combinedDataEntry.combinedData);

  const handleDeleteRow = (pdoId) => {
    // console.log('Deleting pdoId:', pdoId);
    // console.log(selectedPDOId, 'selectedPDOId');
    const itemExists = selectedPDOId.some((item) => item.PDOId === pdoId);
    // console.log('Item exists:', itemExists);

    if (itemExists) {
      const updatedData = selectedPDOId.filter((item) => item.PDOId !== pdoId);
      //  console.log('Updated Data:', updatedData);
      setSelectedPDOId(updatedData);
      dispatch(setPropertyDetailsOld({ newData: updatedData }));
      dispatch(setDeletedPDOIdsExistingProperty({ pdoId }));
      //setDeletedIDs((prev) => [...prev, PDNId]);
    }

  };

  useEffect(() => {
    // console.log(CombinedData, 'CombinedData')
    setPropertyOldMaster(
      CombinedData.oldPropertyMast || {
        OldZoneNo: '',
        OldWardNo: '',
        OldPropertyNo: '',
        OldPartitionNo: '',
        OldCityServeyNo: '',
        OldPlotNo: '',
        OldRV: '',
        OldPropertyTax: '',
        OldTotalTax: '',
        OldPlotArea: '',
        OldToiletNo: '',
        OldALV: '',
        OldTotalRooms: '',
        ConstAreaSqFt: ''
      }
    );
    setSelectedPDOId(CombinedData.propertyDetailsOld || []);
    setOldTaxes({
      PropertyTax: CombinedData.oldTaxes?.PropertyTax || 0,
      EducationTax: CombinedData.oldTaxes?.EducationTax || 0,
      EmploymentTax: CombinedData.oldTaxes?.EmploymentTax || 0,
      TreeCess: CombinedData.oldTaxes?.TreeCess || 0,
      FireCess: CombinedData.oldTaxes?.FireCess || 0,
      SpEducationTax: CombinedData.oldTaxes?.SpEducationTax || 0,
      MajorBuilding: CombinedData.oldTaxes?.MajorBuilding || 0,
      LightCess: CombinedData.oldTaxes?.LightCess || 0,
      RoadCess: CombinedData.oldTaxes?.RoadCess || 0,
      DrainCess: CombinedData.oldTaxes?.DrainCess || 0,
      SewageDisposalCess: CombinedData.oldTaxes?.SewageDisposalCess || 0,
      Sanitation: CombinedData.oldTaxes?.Sanitation || 0,
      SpWaterCess: CombinedData.oldTaxes?.SpWaterCess || 0,
      WaterBenefit: CombinedData.oldTaxes?.WaterBenefit || 0,
      WaterBill: CombinedData.oldTaxes?.WaterBill || 0,
      Interest: CombinedData.oldTaxes?.Interest || 0,
      TaxTotal: CombinedData.oldTaxes?.TaxTotal || 0,
      // OldTaxYear: CombinedData.oldTaxes?.OldTaxYear || '',
      Tax1: CombinedData.oldTaxes?.Tax1 || 0
    } || []);
    setPendingTaxesList(CombinedData.pendingTaxes || []);
    // console.log(CombinedData.pendingTaxes, 'Combined Data in Old Information');
  }, []);
  const taxKeys = [
    'PropertyTax',
    'EducationTax',
    'SpEducationTax',
    'EmploymentTax',
    'TreeCess',
    'FireCess',
    'LightCess',
    'DrainCess',
    'RoadCess',
    'Sanitation',
    'SpWaterCess',              // W. Cess
    'WaterBenefit',
    'WaterBill',
    'MajorBuilding',
    'SewageDisposalCess',
    'Tax1'
  ];

  const sumTaxComponents = obj =>
    taxKeys.reduce((sum, k) => sum + (Number(obj[k]) || 0), 0);
  const [financeYearList, setFinanceYearList] = useState([])
  useEffect(() => {
    const loadYear = async () => {
      const list = await getFinanceYear();   // [{ FinanceYear: '2021-22'}, … ]

      // extract the “start” part (first 4 digits) and find the max
      const latest = list.reduce((max, cur) => {
        return cur.FinanceYear > max.FinanceYear ? cur : max;
      });

      setFinanceYearList([latest]);          // keep only the highest
    };

    loadYear();
  }, []);

  const taxFields = [
    { key: 'PropertyTax', label: 'Prop' },
    { key: 'EducationTax', label: 'Edu' },
    { key: 'SpEducationTax', label: 'sp.Edu' },
    { key: 'EmploymentTax', label: 'Emp' },
    { key: 'TreeCess', label: 'Tree' },
    { key: 'FireCess', label: 'Fire' },
    { key: 'LightCess', label: 'Light' },
    { key: 'DrainCess', label: 'Drain' },
    { key: 'RoadCess', label: 'Road' },
    { key: 'Sanitation', label: 'Sanitation' },
    { key: 'SpWaterCess', label: 'W.Cess' },
    { key: 'WaterBenefit', label: 'W.Ben' },
    { key: 'WaterBill', label: 'W.Bill' },
    { key: 'MajorBuilding', label: 'M.Build' },
    { key: 'SewageDisposalCess', label: 'Sewage' },
    { key: 'Tax1', label: 'Tax1' },
    { key: 'Interest', label: 'Interest' },
    { key: 'TaxTotal', label: 'Total', readOnly: true } // calculated
  ];
  const handleCellChange = (key) => (e) => {
    const value = e.target.value;

    setOldTaxes((prev) => {
      const updatedTaxes = {
        ...prev,
        [key]: value,
      };

      if (key !== 'TaxTotal') {
        updatedTaxes.TaxTotal = calcTotal(updatedTaxes);
      }


      dispatch(setOldTaxesReducer(updatedTaxes));

      return updatedTaxes; // must return the updated state
    });
  };
  useEffect(() => {
    console.log(oldTaxes, 'oldTaxes');
  }, [oldTaxes])
  const calcTotal = (obj) => {
    // simple sum of all numeric fields except TaxTotal
    return taxFields
      .filter(f => f.key !== 'TaxTotal')
      .reduce((sum, f) => sum + (Number(obj[f.key]) || 0), 0);
  };
  useEffect(() => {
    console.log(propertyMasterOld.OldRV, 'propertyMasterOld.OldRV')
  }, [propertyMasterOld.OldRV])


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (pendingTaxes?.PendingYear) {
      const match = pendingTaxesList.find(
        (item) => Number(item.PendingYear) === Number(pendingTaxes.PendingYear)
      );
      if (match) {
        setPendingTaxes((prev) => {
          const next = { ...prev, ...match };

          const subtotal = sumTaxComponents(next);
          const interest = Number(next.Interest) || 0;

          next.TaxTotal = subtotal;
          next.GrandTotal = subtotal + interest;

          return next;
        });
      }
    }
  }, [pendingTaxes.PendingYear, pendingTaxesList]);
  useEffect(() => {
    fetchPropertyDescription()
      .then((fetchproperty) => {
        console.log(fetchproperty, 'fetchproperty');
        setPropertyDescriptionList(fetchproperty);
      })
      .catch((error) => {
        console.error('Error fetching property description:', error);
      });
  }, []);
  // const isTotalTaxInvalid = () => {
  //   if (isFirstRender) {
  //     isFirstRender.current = false;
  //     return;
  //   }
  //   return (
  //     parseFloat(propertyMasterOld.OldTotalTax || 0) <
  //     parseFloat(propertyMasterOld.OldPropertyTax || 0) ||
  //     parseFloat(propertyMasterOld.OldTotalTax || 0) >=
  //     parseFloat(propertyMasterOld.OldRV || 0)
  //   );
  // };
  // const isPropertyTaxInvalid = () => {
  //   if (isFirstRender) {
  //     isFirstRender.current = false;
  //     return;
  //   }
  //   return (

  //   );
  // };
  // useEffect(()=>{

  // },[propertyMasterOld.OldRV])
  // useEffect(() => {

  // }, [CombinedData.oldPropertyMast.ConstAreaSqFt])
  return (
    <>
      <Typography justifySelf={'center'} variant="h5" gutterBottom sx={{ mt: 2.5, mb: 2 }} style={{ color: 'blue', fontWeight: 'bold', textAlign: 'center' }}>
        Old Information:
      </Typography>
      <MainCard sx={{ mt: 2 }}>

        <Grid container spacing={3} mt={0.5}>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Zone No:</InputLabel>
              <TextField
                name="OldZoneNo"
                value={propertyMasterOld.OldZoneNo}
                onChange={handleInputChange}
                fullWidth
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Ward No:</InputLabel>
              <TextField
                required
                value={propertyMasterOld.OldWardNo}
                name="OldWardNo"
                onChange={handleInputChange}
                fullWidth
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Property No:</InputLabel>
              <TextField
                required
                name="OldPropertyNo"
                value={propertyMasterOld.OldPropertyNo}
                fullWidth
                onChange={handleInputChange}
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Partition No:</InputLabel>
              <TextField
                required
                name="OldPartitionNo"
                value={propertyMasterOld.OldPartitionNo}
                fullWidth
                onChange={handleInputChange}
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Computer No:</InputLabel>
              <TextField
                required
                name="OldComputerNo"
                value={propertyMasterOld.OldComputerNo}
                fullWidth
                onChange={handleInputChange}
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Property Description:</InputLabel>
              <Select
                style={{ height: '35px' }}
                name='OldDescription'
                value={propertyMasterOld.OldDescription}
                onChange={handleInputChange}
                // error={!!errors.PropertyTypeID}
                // helperText={errors.PropertyTypeID}
                FormHelperTextProps={{ style: { color: 'red' } }}

              >
                {propertyDescriptionList.map((user, index) => (
                  <MenuItem key={index} value={user.PropertyTypeID}>
                    {user.PropertyDescription}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old CSN No. / गट नं:</InputLabel>
              <TextField
                required
                name="OldCityServeyNo"
                value={propertyMasterOld.OldCityServeyNo}
                fullWidth
                onChange={handleInputChange}
                disabled={accessLevel < 3}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Plot No:</InputLabel>
              <TextField required name="OldPlotNo" value={propertyMasterOld.OldPlotNo} fullWidth onChange={handleInputChange} />
            </Stack>
          </Grid>
        </Grid>
      </MainCard>

      <MainCard sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mt: 2.5, mb: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
          Old Taxation Details:
        </Typography>
        <Grid container spacing={3} mt={0.5}>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old RV</InputLabel>
              <TextField
                required
                value={propertyMasterOld.OldRV}
                name="OldRV"
                onChange={(e) => {
                  const value = e.target.value;
                  console.log(value, 'value')
                  if (/^\d*\.?\d*$/.test(value)) {
                    const rv = parseFloat(value);
                    const alv = !isNaN(rv) && rv !== 0 ? (rv / 0.9).toFixed(2) : '';


                    setPropertyOldMaster((pre) => ({
                      ...pre,
                      OldALV: alv,
                      OldRV: value
                    }))
                    dispatch(setOldPropertyMast({
                      ...propertyMasterOld,
                      OldALV: alv,
                      OldRV: value
                    }));

                  }
                }}
                fullWidth
                disabled={accessLevel < 3}
                inputProps={{
                  inputMode: 'decimal', // mobile numeric keyboard with decimal
                  pattern: '[0-9]*',
                  onInput: (e) => {
                    // Allow only digits and decimal point
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                  }    // hint for browser validation
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old ALV</InputLabel>
              <TextField
                required
                value={propertyMasterOld.OldALV}
                name="OldALV"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*\.?\d*$/.test(value)) {
                    const alv = parseFloat(value);
                    const rv = !isNaN(alv) ? (alv * 0.9).toFixed(2) : '';

                    setPropertyOldMaster((pre) => ({
                      ...pre,
                      OldALV: value,
                      OldRV: rv
                    }))
                    dispatch(setOldPropertyMast({
                      ...propertyMasterOld,
                      OldALV: value,
                      OldRV: rv
                    }));
                  }
                }}
                fullWidth
                disabled={accessLevel < 3}
                inputProps={{
                  inputMode: 'decimal', // mobile numeric keyboard with decimal
                  pattern: '[0-9]*',
                  onInput: (e) => {
                    // Allow only digits and decimal point
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                  }    // hint for browser validation
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Property Tax</InputLabel>
              <TextField
                required
                value={propertyMasterOld.OldPropertyTax}
                name="OldPropertyTax"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                error={
                  isFirstRender.current
                    ? false
                    : propertyMasterOld.OldPropertyTax !== '' &&
                    propertyMasterOld.OldRV !== '' &&
                    !isNaN(parseFloat(propertyMasterOld.OldPropertyTax)) &&
                    !isNaN(parseFloat(propertyMasterOld.OldRV)) &&
                    parseFloat(propertyMasterOld.OldPropertyTax) >=
                    parseFloat(propertyMasterOld.OldRV)
                }
                helperText={
                  isFirstRender.current
                    ? ''
                    : propertyMasterOld.OldPropertyTax !== '' &&
                      propertyMasterOld.OldRV !== '' &&
                      !isNaN(parseFloat(propertyMasterOld.OldPropertyTax)) &&
                      !isNaN(parseFloat(propertyMasterOld.OldRV)) &&
                      parseFloat(propertyMasterOld.OldPropertyTax) >= parseFloat(propertyMasterOld.OldRV)
                      ? 'Property Tax must be lesser than RV'
                      : ''
                }
                fullWidth
                disabled={accessLevel < 3}
                inputProps={{
                  inputMode: 'decimal', // mobile numeric keyboard with decimal
                  pattern: '[0-9]*',
                  onInput: (e) => {
                    // Allow only digits and decimal point
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                  }    // hint for browser validation
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Total Tax</InputLabel>
              <TextField
                required
                value={propertyMasterOld.OldTotalTax}
                name="OldTotalTax"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                error={
                  isFirstRender.current
                    ? false
                    : propertyMasterOld.OldTotalTax !== '' &&
                    propertyMasterOld.OldPropertyTax !== '' &&

                    !isNaN(parseFloat(propertyMasterOld.OldTotalTax)) &&
                    !isNaN(parseFloat(propertyMasterOld.OldPropertyTax)) &&

                    (
                      parseFloat(propertyMasterOld.OldTotalTax) <
                      parseFloat(propertyMasterOld.OldPropertyTax)

                    )
                }
                helperText={
                  isFirstRender.current
                    ? ''
                    : propertyMasterOld.OldTotalTax !== '' &&
                      propertyMasterOld.OldPropertyTax !== '' &&
                      !isNaN(parseFloat(propertyMasterOld.OldTotalTax)) &&
                      !isNaN(parseFloat(propertyMasterOld.OldPropertyTax)) &&
                      parseFloat(propertyMasterOld.OldTotalTax) < parseFloat(propertyMasterOld.OldPropertyTax)
                      ? 'Total Tax must be greater than or equal to Property Tax'
                      : ''
                }
                fullWidth
                disabled={accessLevel < 3}
                inputProps={{
                  inputMode: 'decimal', // mobile numeric keyboard with decimal
                  pattern: '[0-9]*',
                  onInput: (e) => {
                    // Allow only digits and decimal point
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                  }    // hint for browser validation
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Const. Area SqFt</InputLabel>
              <TextField
                required
                value={propertyMasterOld.ConstAreaSqFt}
                name="ConstAreaSqFt"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                fullWidth
                disabled={accessLevel < 3 || selectedPDOId.length > 0}
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '[0-9]*',
                  onInput: (e) => {

                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                  }
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Plot Area SqFt</InputLabel>
              <TextField
                required
                value={propertyMasterOld.OldPlotArea}
                name="OldPlotArea"
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                fullWidth
                disabled={accessLevel < 3}
                inputProps={{
                  inputMode: 'decimal', // mobile numeric keyboard with decimal
                  pattern: '[0-9]*',
                  onInput: (e) => {
                    // Allow only digits and decimal point
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                  }    // hint for browser validation
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Toilet No</InputLabel>
              <TextField
                required
                value={propertyMasterOld.OldToiletNo}
                name="OldToiletNo"
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only digits (no dot)
                  if (/^\d*$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                fullWidth
                disabled={accessLevel < 3}
                inputProps={{
                  inputMode: 'numeric', // show number keypad on mobile
                  pattern: '[0-9]*',
                  onInput: (e) => {
                    // Remove any non-digit characters
                    e.target.value = e.target.value.replace(/\D/g, '');
                  }
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <Stack spacing={1}>
              <InputLabel>Old Total Rooms</InputLabel>
              <TextField
                required
                value={propertyMasterOld.OldTotalRooms}
                name="OldTotalRooms"
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only digits (no dot)
                  if (/^\d*$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                fullWidth
                disabled={accessLevel < 3}
                inputProps={{
                  inputMode: 'numeric', // show number keypad on mobile
                  pattern: '[0-9]*',
                  onInput: (e) => {
                    // Remove any non-digit characters
                    e.target.value = e.target.value.replace(/\D/g, '');
                  }
                }}
              />
            </Stack>
          </Grid>
          {/* <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
              <Grid item>
                <Button variant="contained">OK</Button>
              </Grid>
            </Grid> */}
        </Grid>
      </MainCard>
      <Grid mt={2}>
        <MainCard>
          <Typography variant="h5" gutterBottom sx={{ mt: 2.5, mb: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
            Old Floor Details:
          </Typography>
          <Grid container spacing={3} mt={0.5}>
            <Grid item xs={12} sm={2}>

              <Stack spacing={1}>
                <InputLabel>Floor *</InputLabel>
                <Select
                  name="OldFloorID"
                  onChange={handleInputChange}
                  value={editOldDetails.OldFloorID}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Floor' }}
                  sx={{ bgcolor: '#F5F5F5' }}
                  disabled={accessLevel < 3}
                  fullWidth
                >
                  {/* Only one placeholder here */}
                  <MenuItem value="" disabled>
                    Select Floor
                  </MenuItem>

                  {/* Loop for real options only */}
                  {floorList.map((type) => (
                    <MenuItem key={type.ID} value={type.OldFloorID}>
                      {type.OldFloorID}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
                <InputLabel>Year *</InputLabel>
                <TextField
                  required
                  value={editOldDetails.OldConstructionYear}
                  name="OldConstructionYear"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only 0 to 4 digits
                    if (/^\d{0,4}$/.test(value)) {
                      setOldDetails((prev) => ({
                        ...prev,
                        OldConstructionYear: value
                      }));
                      // Update error status on change too
                      setOldConstructionYearError(value.length > 0 && value.length < 4);
                    }
                  }}
                  onBlur={() => {
                    const value = editOldDetails.OldConstructionYear;
                    setOldConstructionYearError(value.length > 0 && value.length < 4);
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'numeric',
                  }}
                  error={oldConstructionYearError}
                  helperText={oldConstructionYearError ? "Year must be 4 digits" : ""}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <InputLabel>Construction Type *</InputLabel>
                {/* <TextField
                required
                value={editOldDetails.OldConstructionType}
                name="OldConstructionType"
                onChange={handleInputChange}
                fullWidth
              /> */}
                <Select
                  labelId="construction-type-label"
                  id="construction-type-select"
                  name="OldConstructionType"
                  onChange={handleInputChange}
                  value={editOldDetails.OldConstructionType}
                  style={{ height: 40 }}
                  disabled={accessLevel < 3}
                >

                  {constructionTypeList.map((type) => (
                    <MenuItem key={type.ConstructionId} value={type.ConstructionId}>
                      {type.Description}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <InputLabel>Type of Use *</InputLabel>
                {/* <TextField required value={editOldDetails.OldTypeOFUse} name="OldTypeOFUse" onChange={handleInputChange} fullWidth /> */}
                <Select
                  labelId="type-of-use-label"
                  id="type-of-use-select"
                  name={'OldTypeOFUse'}
                  onChange={handleInputChange}
                  value={editOldDetails.OldTypeOFUse}
                  style={{ height: 40 }}
                  disabled={accessLevel < 3}
                >
                  <MenuItem value="Select Type of Use" disabled>
                    Select Type of Use *
                  </MenuItem>
                  {TypeOFUseList.map((type) => (
                    <MenuItem key={type.ID} value={type.OldTypeOfUseID}>
                      {type.OldDescription}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <InputLabel>Carpet SqFt *</InputLabel>
                <TextField
                  required
                  value={editOldDetails.OldCarpetAreaSqfeet}
                  name="OldCarpetAreaSqfeet"
                  onChange={handleInputChange}
                  fullWidth
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Stack spacing={1}>
                <InputLabel>Carpet SqMtr *</InputLabel>
                <TextField
                  required
                  value={editOldDetails.OldCarpetAreaSqMeter}
                  name="OldCarpetAreaSqMeter"
                  onChange={handleInputChange}
                  fullWidth
                  disabled={true}
                />
              </Stack>
            </Grid>

            <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
              <Grid item>
                <Button variant="contained" color="success" onClick={handleAddOrUpdate} sx={{ mb: 3 }} disabled={isAddDisabled || isFloorInfoAlreadyExists || accessLevel < 3 || oldConstructionYearError}>
                  {editOldDetails.PDOId ? 'Update' : 'Add'}
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                  <TableCell>Floor</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Construction Type</TableCell>
                  <TableCell>Type of Use</TableCell>
                  <TableCell>Carpet SqFt</TableCell>
                  <TableCell>Carpet SqMtr</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPDOId.map((row) => (
                  <TableRow key={row.PDOId}>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleRowClick2(row)} disabled={accessLevel < 3}>
                        <EditTwoTone />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteRow(row.PDOId)} disabled={accessLevel < 3}>
                        <CloseOutlined />
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.OldFloorID}</TableCell>
                    <TableCell>{row.OldConstructionYear}</TableCell>
                    <TableCell>{row.OldConstructionType}</TableCell>
                    <TableCell>{row.OldTypeOFUse}</TableCell>
                    <TableCell>{row.OldCarpetAreaSqfeet}</TableCell>
                    <TableCell>{row.OldCarpetAreaSqMeter}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
      <Grid sx={{ mt: 2 }}>
        <MainCard>
          <Typography variant="h5" gutterBottom sx={{ mt: 1.5, mb: 2, ml: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
            Old Taxes:
          </Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {Object.keys(oldTaxes).map((key) => (
                    <TableCell key={key} align="center">{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {(Object.keys(oldTaxes)).map((key, value) => (
                    <TableCell key={key} align="center">

                      <TextField
                        name={key}
                        value={oldTaxes[key]}
                        onFocus={(e) => {
                          if (e.target.value === '0' || e.target.value === 0) {
                            e.target.value = '';
                            handleCellChange({ target: { name: e.target.name, value: '' } });
                          }
                        }}
                        onInput={(e) => {
                          // Remove any non-digit or more than one dot
                          e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                        }}
                        onChange={handleCellChange(key)}
                        variant="standard"
                        inputProps={{
                          style: { textAlign: 'center' },
                          inputMode: 'decimal',
                          pattern: '^[0-9]*\\.?[0-9]*$',
                        }}
                        sx={{ width: 70 }}
                      />

                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
      <Grid sx={{ mt: 2 }}>
        <MainCard>
          <Typography variant="h5" gutterBottom sx={{ mt: 1.5, mb: 2 }} style={{ color: 'blue', fontWeight: 'bold' }}>
            Pending Taxes:
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={1.4}>
              <Stack spacing={1}>
                <InputLabel>Year</InputLabel>
                <Select
                  key={pendingTaxes.PendingYear ?? 'empty'} // <- force re-render if value is cleared
                  name="PendingYear"
                  value={pendingTaxes.PendingYear}
                  onChange={handleInputChange}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  disabled={accessLevel < 3}
                  displayEmpty
                  fullWidth
                  renderValue={(selected) =>
                    !selected || selected === '' ? <em>Select Pending Year</em> : selected
                  }
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 150 } }
                  }}
                >
                  {/* <MenuItem value="">
                    <em>Select Pending Year</em>
                  </MenuItem> */}

                  {financeYearList.map((value, index) => {
                    const year = Number(value.FinanceYear);
                    return (
                      <MenuItem key={index} value={year - 1}>
                        {year - 1}
                      </MenuItem>
                    );
                  })}
                </Select>

              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Prop</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.PropertyTax}
                  name="PropertyTax"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>

            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Edu</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.EducationTax}
                  name="EducationTax"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}

                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Sp. Edu</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.SpEducationTax}
                  name="SpEducationTax"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}

                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Emp</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.EmploymentTax}
                  name="EmploymentTax"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Tree</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.TreeCess}
                  name="TreeCess"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Fire</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.FireCess}
                  name="FireCess"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Light</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.LightCess}
                  name="LightCess"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Drain</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.DrainCess}
                  name="DrainCess"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Road</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.RoadCess}
                  name="RoadCess"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Sanitation</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.Sanitation}
                  name="Sanitation"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.4}>
              <Stack spacing={1}>
                <InputLabel>W. Cess</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.SpWaterCess}
                  name="SpWaterCess"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>W. Ben</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.WaterBenefit}
                  name="WaterBenefit"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>W. Bill</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.WaterBill}
                  name="WaterBill"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>M.Build</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.MajorBuilding}
                  name="MajorBuilding"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Sewage</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.SewageDisposalCess}
                  name="SewageDisposalCess"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Tax 1</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.Tax1}
                  name="Tax1"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Tax Total</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.TaxTotal}
                  name="TaxTotal"
                  // onChange={(e) => {
                  //   const value = e.target.value;

                  //   if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                  //     handleInputChange(e);
                  //   }
                  // }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Stack spacing={1}>
                <InputLabel>Interest</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.Interest}
                  name="Interest"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.value = '';
                      handleInputChange({ target: { name: e.target.name, value: '' } });
                    }
                  }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
                <InputLabel>Total</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.GrandTotal}
                  name="GrandTotal"
                  // onChange={(e) => {
                  //   const value = e.target.value;

                  //   if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
                  //     handleInputChange(e);
                  //   }
                  // }}
                  fullWidth
                  disabled={accessLevel < 3}
                  inputProps={{
                    inputMode: 'decimal', // mobile numeric keyboard with decimal
                    pattern: '[0-9]*',
                    onInput: (e) => {
                      // Allow only digits and decimal point
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }    // hint for browser validation
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <Stack spacing={1}>
                <InputLabel>Remark</InputLabel>
                <TextField
                  required
                  value={pendingTaxes.Remark}
                  name="Remark"
                  onChange={handleInputChange}
                  fullWidth
                  disabled={accessLevel < 3}
                />
              </Stack>
            </Grid>
            <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
              <Grid item>
                <Button variant="contained" color="success" onClick={handlePTAddOrUpdate} sx={{ mb: 3 }} disabled={pendingTaxes.PendingYear == '' || !pendingTaxes.PendingYear || pendingTaxes.PendingYear == null} >
                  ADD
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <TableContainer style={{ marginTop: 20 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Edit</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Prop</TableCell>
                  <TableCell>Edu</TableCell>
                  <TableCell>Sp.Edu</TableCell>
                  <TableCell>Emp</TableCell>
                  <TableCell>Tree</TableCell>
                  <TableCell>Fire</TableCell>
                  <TableCell>Light</TableCell>
                  <TableCell>Drain</TableCell>
                  <TableCell>Road</TableCell>
                  <TableCell>Sanitation</TableCell>
                  <TableCell>W.Cess</TableCell>
                  <TableCell>W.Ben.</TableCell>
                  <TableCell>W.Bill</TableCell>
                  <TableCell>M Build</TableCell>
                  <TableCell>Sewage</TableCell>
                  <TableCell>Tax1</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Remark</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pendingTaxesList.map((item, index) => {

                  const isSelectedYear = Number(item.PendingYear) === Number(pendingTaxes.PendingYear);
                  const isCurrentEditRow = pendingTaxes.TPDID === item.TPDID;

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <IconButton
                          color={isCurrentEditRow ? 'success' : 'primary'}
                          onClick={() => handleRowClick1(item)}
                          disabled={accessLevel < 3 || !isSelectedYear}
                        >
                          {isCurrentEditRow ? <SendOutlined /> : <EditTwoTone />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">{item.PendingYear}</TableCell>
                      <TableCell align="center">{item.PropertyTax || 0}</TableCell>
                      <TableCell align="center">{item.EducationTax || 0}</TableCell>
                      <TableCell align="center">{item.SpEducationTax || 0}</TableCell>
                      <TableCell align="center">{item.EmploymentTax || 0}</TableCell>
                      <TableCell align="center">{item.TreeCess || 0}</TableCell>
                      <TableCell align="center">{item.FireCess || 0}</TableCell>
                      <TableCell align="center">{item.LightCess || 0}</TableCell>
                      <TableCell align="center">{item.DrainCess || 0}</TableCell>
                      <TableCell align="center">{item.RoadCess || 0}</TableCell>
                      <TableCell align="center">{item.Sanitation || 0}</TableCell>
                      <TableCell align="center">{item.SpWaterCess || 0}</TableCell>
                      <TableCell align="center">{item.WaterBenefit || 0}</TableCell>
                      <TableCell align="center">{item.WaterBill || 0}</TableCell>
                      <TableCell align="center">{item.MajorBuilding || 0}</TableCell>
                      <TableCell align="center">{item.SewageDisposalCess || 0}</TableCell>
                      <TableCell align="center">{item.Tax1 || 0}</TableCell>
                      <TableCell align="center">{item.Interest || 0}</TableCell>
                      <TableCell align="center">{item.TaxTotal || 0}</TableCell>
                      <TableCell align="center">{item.Remark || ''}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard >
      </Grid >
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
    </>
  );
}

export default OldInformation;