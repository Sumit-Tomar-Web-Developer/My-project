import React, { useEffect, useState,useMemo } from 'react';
import {
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  Card,
  TableContainer,
  Typography,
  Select,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormHelperText,
  Snackbar,
  SnackbarContent,
  Autocomplete,
  TextField,
  Chip,
  
} from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Menu from '@mui/material/Menu';
// project import
import MainCard from 'components/MainCard';
import { FixedSizeList } from 'react-window';
import { fetchPropertyRange, fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { postWardSelection } from 'services/wardnumber.services';
import { fetchPropertyRangeByWard, saveDataEntryDetails } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

function DataEntrySameAs() {
  // property
  const [wardListCopyFrom, setWardListCopyFrom] = useState([]);
  const [wardListCopyOn, setWardListCopyOn] = useState([]);
  const [newPropertyNoFromList, setNewPropertyNoFromList] = useState([]);
  const [newPropertyNoToList, setNewPropertyNoToList] = useState([]);
  const [propertyNoCopyOnList, setPropertyNoCopyOnList] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedPropertyTo, setSelectedPropertyTo] = useState('');
  const [propertyNoList, setPropertyNoList] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  // const [showPropertyTo, setShowPropertyTo] = useState(false);
  const [showPropertyTable, setShowPropertyTable] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessages, setSnackbarMessages] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [ownerIds, setOwnerIds] = useState([]);

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  const [dataEntryCopiedOn, setDataEntryCopiedOn] = useState({
    WardNoCopyOn: '',
    PropertyNoCopyOn: [],
    NewPropertyNoFrom: '',
    NewPropertyTo: ''
  });
  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Data Entry Same As';
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
      console.log(access, 'assigned access to Delete Access Property Page');
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


useEffect(() => {
  fetchWards()
    .then((wards) => {
      console.log(wards, 'fetched wards');

      // Convert string -> number for correct ascending order
      const sortedWards = [...wards].sort(
        (a, b) => Number(a.NewWardNo) - Number(b.NewWardNo)
      );

      setWardListCopyFrom(sortedWards);
      setWardListCopyOn(sortedWards);
    })
    .catch((error) => {
      console.error('Error fetching wards:', error);
    });
}, []);


const handleInputChangeCopyOn = async (e) => {
  const { name, value } = e.target;

  console.log("👉 Input changed:", name, value);
   const updatedValue = Array.isArray(value) ? value : [value];

    console.log("📥 Select onChange value:", updatedValue);
setDataEntryCopiedOn((prev) => {
  let updatedValue = value;

  // If handling PropertyNoCopyOn or multi-value selects, make sure it's an array
  if (name === "PropertyNoCopyOn") {
    updatedValue = Array.isArray(value) ? value : [];
  }

  return {
    ...prev,
    [name]: updatedValue,
    ...(name === "WardNoCopyOn" && prev.WardNoCopyOn !== value
      ? { PropertyNoCopyOn: [], NewPropertyNoFrom: "", NewPropertyTo: "" }
      : {})
  };
});


  if (name === "WardNoCopyOn") {
   

     try {
        const response = await fetchPropertyRangeByWard(value);
        const propertyRange = response.properties; // <- use .properties array
        if (!Array.isArray(propertyRange)) throw new Error("Invalid property range");
    
        // Sort: main property first, then partitions
        const sortedProps = propertyRange.sort((a, b) => {
          const propA = parseInt(a.NewPropertyNo, 10);
          const propB = parseInt(b.NewPropertyNo, 10);
    
          if (propA !== propB) return propA - propB;
    
          const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
          const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;
          return partA - partB;
        });
    // 🔹 Add clean displayLabel and unique value (with OwnerID)
  const mappedProps = sortedProps.map((p) => ({
    ...p,
    displayLabel: p.NewPartitionNo
      ? `${p.NewPropertyNo}_${p.NewPartitionNo}`
      : String(p.NewPropertyNo),
    value: p.NewPartitionNo
      ? `${p.NewPropertyNo}_${p.NewPartitionNo}_${p.OwnerID}`
      : `${p.NewPropertyNo}_${p.OwnerID}`, // unique
  }));

  console.log("💠 propertyNoCopyOnList:", mappedProps);

        setPropertyNoCopyOnList(mappedProps);
        setNewPropertyNoFromList(mappedProps);
        setNewPropertyNoToList(mappedProps);

      } catch (error) {
        console.error('Error fetching property range:', error);
      }
  }
};

// first ward no change 
  const handleInputChangeCopyFrom = async (event) => {
    const { name, value } = event.target;
    setDataEntryCopiedFrom((prevState) => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'WardNoCopyFrom') {
      // try {
      //   const response = await postWardSelection(value);
      //   const properties = response.properties ||[];

      //   if (Array.isArray(properties) && properties.length > 0) 
      //     {
        
      //   const newPropertyNos = properties.map((prop) => ({
      //   OwnerID: prop.OwnerID,
      //   displayLabel: prop.NewPartitionNo
      //     ? `${prop.NewPropertyNo}_${prop.NewPartitionNo}`
      //     : prop.NewPropertyNo,
      //   NewPropertyNo: prop.NewPropertyNo,
      //   NewPartitionNo: prop.NewPartitionNo
      // })); 
      //     console.log("👉 propertyNoCopyOnList set to:", newPropertyNos);
      //     setPropertyNoList(newPropertyNos);
      //     console.log('Added property', propertyNoList);
      //   } else {
      //     setPropertyNoList([]);
      //   }
      // } catch (error) {
      //   console.error('Error posting ward No.:', error);
      //   setPropertyNoList([]);
      // }
       try {
          const response = await fetchPropertyRangeByWard(value);
          const propertyRange = response.properties; // <- use .properties array
          if (!Array.isArray(propertyRange)) throw new Error("Invalid property range");
      
          // Sort: main property first, then partitions
          const sortedProps = propertyRange.sort((a, b) => {
            const propA = parseInt(a.NewPropertyNo, 10);
            const propB = parseInt(b.NewPropertyNo, 10);
      
            if (propA !== propB) return propA - propB;
      
            const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
            const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;
            return partA - partB;
          });
      
          setPropertyNoList(sortedProps);
        } catch (error) {
          console.error('Error fetching property range:', error);
        }
    }
  };





  useEffect(() => {
    console.log(ownerIds, 'Updated ownerIds from useEffect');
  }, [ownerIds]);


const handleShowClick = async (e) => {
  e.preventDefault();

  const { WardNoCopyOn, PropertyNoCopyOn, NewPropertyNoFrom, NewPropertyTo } = dataEntryCopiedOn;

  if (!WardNoCopyOn) {
    alert("Please select ward number.");
    return;
  }

  setIsOpen(true);

  try {
    const response = await fetchPropertyRangeByWard(WardNoCopyOn);
    const properties = response.properties || [];
    let allProperties = [];

    // ✅ ALL properties
    if (PropertyNoCopyOn?.includes("ALL")) {
      allProperties = [...properties];
    }

    // ✅ Individual / multiple properties (match with partition if exists)
  const individualProps = properties.filter((p) => {
  const label = p.NewPartitionNo
    ? `${p.NewPropertyNo}_${p.NewPartitionNo}_${p.OwnerID}`
    : `${p.NewPropertyNo}_${p.OwnerID}`;

  return PropertyNoCopyOn?.includes(label);
});

    allProperties = [...allProperties, ...individualProps];

    // ✅ Property range
    if (PropertyNoCopyOn?.includes("PropertyTo") && (NewPropertyNoFrom || NewPropertyTo)) {
      const from = NewPropertyNoFrom || "";
      const to = NewPropertyTo || "";
      const rangeProps = await fetchPropertyRange(WardNoCopyOn, from, to);
      allProperties = [...allProperties, ...rangeProps];
    }

    // Remove duplicates by OwnerID
    const uniqueMap = {};
    allProperties.forEach((p) => (uniqueMap[p.OwnerID] = p));
    const uniqueProps = Object.values(uniqueMap);

    // ✅ Now you have both PropertyNos + OwnerIDs
    console.log("✅ Final Props (with OwnerID):", uniqueProps);

    setShowPropertyTable(uniqueProps);
    setOwnerIds(uniqueProps.map((p) => p.OwnerID));
  } catch (err) {
    console.error("Error fetching properties:", err);
  }
};


  const [dataEntryCopiedFrom, setDataEntryCopiedFrom] = useState({
    WardNoCopyFrom: '',
    PropertyNo: '',
    RenterName: false,
    OccupierName: false
  });
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClear = () => {
    setNewPropertyNoFromList([]);
    setNewPropertyNoToList([]);
    setPropertyNoCopyOnList([]);
    setSelectedWard('');
    setSelectedProperty('');
    setSelectedPropertyTo('');
    setPropertyNoList([]);
    setErrors({});
    setSelectAll(false);
    //setShowPropertyTo(false);
    setShowPropertyTable([]);
    setIsOpen(false);
    setSnackbarOpen(false);
    setOwnerIds([]);

    // Reset form data states
    setDataEntryCopiedOn({
      WardNoCopyOn: '',
      PropertyNoCopyOn: [],
      NewPropertyNoFrom: '',
      NewPropertyTo: ''
    });

    setDataEntryCopiedFrom({
      WardNoCopyFrom: '',
      PropertyNo: '',
      RenterName: false,
      OccupierName: false
    });
  };

  const handleNamesCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setDataEntryCopiedFrom((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

useEffect(() => {
  console.log("🔄 dataEntryCopiedOn.PropertyNoCopyOn updated:", dataEntryCopiedOn.PropertyNoCopyOn);
}, [dataEntryCopiedOn.PropertyNoCopyOn]);



const handleCheckboxChange = (event, value) => {
  setDataEntryCopiedOn((prev) => {
    const prevSelected = Array.isArray(prev.PropertyNoCopyOn) ? prev.PropertyNoCopyOn : [];
    let updated = [...prevSelected];

    if (value === "ALL") {
      updated = prevSelected.includes("ALL") ? [] : ["ALL"];
    } else if (value === "PropertyTo") {
      updated = prevSelected.includes("PropertyTo")
        ? prevSelected.filter((v) => v !== "PropertyTo")
        : [...prevSelected.filter((v) => v !== "ALL"), "PropertyTo"];
    } else {
      updated = prevSelected.includes(value)
        ? updated.filter((v) => v !== value)
        : [...updated.filter((v) => v !== "ALL" && v !== "PropertyTo"), value];
    }

    return { ...prev, PropertyNoCopyOn: updated };
  });
};

const VirtualizedListbox = React.forwardRef(function VirtualizedListbox(props, ref) {
  const { children, ...other } = props;
  const items = React.Children.toArray(children);

  return (
    <div ref={ref} {...other}>
      <FixedSizeList
        height={300}
        width="100%"
        itemSize={36}
        itemCount={items.length}
        overscanCount={5}
      >
        {({ index, style }) => <div style={style}>{items[index]}</div>}
      </FixedSizeList>
    </div>
  );
});


  const handleApplyClick = async () => {
    if (!dataEntryCopiedFrom.WardNoCopyFrom || !dataEntryCopiedFrom.PropertyNo) {
      alert('Please select ward number and property number.');
      return;
    }
    try {
      const response = await saveDataEntryDetails(ownerIds, dataEntryCopiedFrom);

      console.log(response, 'prabhu');

      if (response.status === 200 || response.status === 201) {
        setReceivedMessage(response.message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setReceivedMessage(response.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error applying property details:', error);
    }
  };




const showPropertyTo = dataEntryCopiedOn.PropertyNoCopyOn?.includes("PropertyTo");

console.log("💠 PropertyNoCopyOn in state:", dataEntryCopiedOn.PropertyNoCopyOn);
console.log("💠 propertyNoCopyOnList:", propertyNoCopyOnList);
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
        <MainCard title="Submission Same As">
          <Grid container spacing={1.5} alignItems="stretch">
            <Grid item xs={12} md={10} lg={6} >
              <MainCard>
                <Typography sx={{ mb: 4 }} variant="h4" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Copy Entry On:
                </Typography>
                <Box marginTop={2}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={6} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel>Ward No</InputLabel>
                        <Select
                          sx={{ minWidth: '100px' }}
                          value={dataEntryCopiedOn.WardNoCopyOn}
                          onChange={handleInputChangeCopyOn}
                          name="WardNoCopyOn"
                          error={!!errors.WardNoCopyOn}
                          helperText={errors.WardNoCopyOn}
                          FormHelperTextProps={{ style: { color: 'red' } }}
                          disabled={accessLevel < 3}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          {wardListCopyOn.map((ward, index) => (
                            <MenuItem key={index} value={ward.NewWardNo}>
                              {ward.NewWardNo}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel>Select Properties</InputLabel>


{/* <Autocomplete
  multiple
  disableCloseOnSelect
  options={[
    { value: 'ALL', displayLabel: 'ALL' },
    { value: 'PropertyTo', displayLabel: 'Property To' },
    ...propertyNoCopyOnList
  ]}
  getOptionLabel={(option) => option.displayLabel}
 value={[
  ...(['ALL', 'PropertyTo'].map(v => 
      dataEntryCopiedOn.PropertyNoCopyOn.includes(v) ? { value: v, displayLabel: v === 'ALL' ? 'ALL' : 'Property To' } : null
  ).filter(Boolean)),
  ...propertyNoCopyOnList.filter(opt =>
    dataEntryCopiedOn.PropertyNoCopyOn.includes(opt.value)
  )
]}

onChange={(event, newValue) => {
  const selectedValues = newValue.map((v) => v.value);

  setDataEntryCopiedOn((prev) => ({
    ...prev,
    PropertyNoCopyOn: selectedValues.includes('ALL')
      ? ['ALL']
      : selectedValues
  }));
}}

renderOption={(props, option, { selected }) => (
  <li {...props}>
    <Checkbox checked={selected} sx={{ mr: 1 }} />
    {option.displayLabel}
  </li>
)}

  renderInput={(params) => <TextField {...params} label="Select Properties" />}
/> */}



<Autocomplete
  multiple
  disableCloseOnSelect
  options={[
    { value: 'ALL', displayLabel: 'ALL' },
    { value: 'PropertyTo', displayLabel: 'Property To' },
    ...propertyNoCopyOnList
  ]}
  getOptionLabel={(option) => option.displayLabel}
  value={[
    ...['ALL', 'PropertyTo']
      .filter(v => dataEntryCopiedOn.PropertyNoCopyOn.includes(v))
      .map(v => ({ value: v, displayLabel: v === 'ALL' ? 'ALL' : 'Property To' })),
    ...propertyNoCopyOnList.filter(opt =>
      dataEntryCopiedOn.PropertyNoCopyOn.includes(opt.value)
    )
  ]}
  onChange={(event, newValue) => {
    const selectedValues = newValue.map(v => v.value);
    setDataEntryCopiedOn(prev => ({
      ...prev,
      PropertyNoCopyOn: selectedValues.includes('ALL')
        ? ['ALL']
        : selectedValues
    }));
  }}
  ListboxComponent={VirtualizedListbox} 
  renderOption={(props, option, { selected }) => (
    <li {...props} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 12 }}>
      <Checkbox checked={selected} sx={{ mr: 1 }} />
      {option.displayLabel}
    </li>
  )}
  renderTags={(tagValue, getTagProps) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tagValue.map((option, index) => (
        <Chip label={option.displayLabel} {...getTagProps({ index })} size="small" />
      ))}
    </Box>
  )}
  renderInput={(params) => <TextField {...params} />}
/>




                        <FormHelperText style={{ color: 'red' }}>{errors.PropertyNoCopyOn}</FormHelperText>
                      </Stack>
                    </Grid>
                  </Grid>
                 {showPropertyTo && (
  <Grid container spacing={3} justifyContent="center">
    <Grid item xs={12} sm={4}>
      <Stack spacing={1}>
        <InputLabel>From Properties</InputLabel>
        <Select
          value={dataEntryCopiedOn.NewPropertyNoFrom || ""}
          onChange={handleInputChangeCopyOn}
          name="NewPropertyNoFrom"
          fullWidth
          MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
        >
            {newPropertyNoFromList.map((p) => {
        const displayValue = p.NewPartitionNo
          ? `${p.NewPropertyNo}_${p.NewPartitionNo}`
          : `${p.NewPropertyNo}`;
        return (
          <MenuItem key={displayValue} value={displayValue}>
            {displayValue}
          </MenuItem>
        );
      })}
        </Select>
      </Stack>
    </Grid>

    <Grid item xs={12} sm={4}>
      <Stack spacing={1}>
        <InputLabel>To Properties</InputLabel>
        <Select
          value={dataEntryCopiedOn.NewPropertyTo || ""}
          onChange={handleInputChangeCopyOn}
          name="NewPropertyTo"
          fullWidth
          MenuProps={{ PaperProps: { style: { maxHeight: 150 } } }}
        >
           {newPropertyNoToList.map((p) => {
        const displayValue = p.NewPartitionNo
          ? `${p.NewPropertyNo}_${p.NewPartitionNo}`
          : `${p.NewPropertyNo}`;
        return (
          <MenuItem key={displayValue} value={displayValue}>
            {displayValue}
          </MenuItem>
        );
      })}
        </Select>
      </Stack>
    </Grid>
  </Grid>
)}

                </Box>

                <Box marginTop={4} sx={{ mb: 0.5 }}>
                  <Grid container spacing={2} justifyContent="center" marginTop={8}>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <Button variant="contained" color="info" onClick={handleShowClick} disabled={accessLevel < 3}>
                          ShowData
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </MainCard>
            </Grid>

            <Grid item xs={12} md={10} lg={6}>
              <MainCard>
                <Typography sx={{ mb: 2 }} variant="h4" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Data Entry Like:
                </Typography>
                <Box marginTop={2}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={6} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel>Ward </InputLabel>
                        <Select
                          sx={{ minWidth: '100px' }}
                          value={dataEntryCopiedFrom.WardNoCopyFrom}
                          onChange={handleInputChangeCopyFrom}
                          name="WardNoCopyFrom"
                          error={!!errors.WardNoCopyFrom}
                          helperText={errors.WardNoCopyFrom}
                          FormHelperTextProps={{ style: { color: 'red' } }}
                          disabled={accessLevel < 3}
                           MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          {wardListCopyFrom.map((ward, index) => (
                            <MenuItem key={index} value={ward.NewWardNo}>
                              {ward.NewWardNo}
                            </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel>Property No </InputLabel>
                        <Select
                          sx={{ minWidth: '100px' }}
                          value={dataEntryCopiedFrom.PropertyNo}
                          onChange={handleInputChangeCopyFrom}
                          name="PropertyNo"
                          error={!!errors.PropertyNo}
                          helperText={errors.PropertyNo}
                          FormHelperTextProps={{ style: { color: 'red' } }}
                          disabled={accessLevel < 3}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          {propertyNoList.map((property, index) => (
                            <MenuItem 
          key={index} 
          value={property.NewPartitionNo 
                   ? `${property.NewPropertyNo}_${property.NewPartitionNo}` 
                   : property.NewPropertyNo
                 }
        >
          {property.NewPartitionNo 
            ? `${property.NewPropertyNo}_${property.NewPartitionNo}` 
            : property.NewPropertyNo
          }
        </MenuItem>
                          ))}
                        </Select>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={1} justifyContent="center" >
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}></Stack>
                    <Grid marginTop={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="RenterName"
                            checked={dataEntryCopiedFrom.RenterName}
                            onChange={handleNamesCheckboxChange}
                            disabled={accessLevel < 3}
                          />
                        }
                        label="With Renter"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="OccupierName"
                            checked={dataEntryCopiedFrom.OccupierName}
                            onChange={handleNamesCheckboxChange}
                            disabled={accessLevel < 3}
                          />
                        }
                        label="With Occupier"
                      />{' '}
                    </Grid>
                  </Grid>
                </Grid>
                <Box marginTop={1}>
                  <Grid container spacing={2} justifyContent="center" marginTop={3}>
                    {' '}
                    {/* Added justifyContent="center" */}
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <Button variant="contained" color="success" onClick={handleApplyClick} disabled={accessLevel < 3}>
                          Apply
                        </Button>

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
                            message={receivedMessage}
                          />
                        </Snackbar>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <Button variant="contained" color="secondary" onClick={handleClear} disabled={accessLevel < 3}>
                          Clear
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </MainCard>
            </Grid>
          </Grid>

          {isOpen && (
            <MainCard title="Property Information"  style={{ color: 'blue', fontWeight: 'bold', marginTop: '10px' }} >
              <TableContainer style={{ height: '58vh' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Owner ID</TableCell>
                      <TableCell>Ward No.</TableCell>
                      <TableCell>Property No.</TableCell>
                      <TableCell>Partition No.</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showPropertyTable.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.OwnerID}</TableCell>
                        <TableCell>{item.NewWardNo}</TableCell>
                        <TableCell>{item.NewPropertyNo}</TableCell>
                        <TableCell>{item.NewPartitionNo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          )}
        </MainCard>
      )}
    </>
  );
}

export default DataEntrySameAs;
