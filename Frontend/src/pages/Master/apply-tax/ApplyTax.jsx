

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  FormControlLabel,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  MenuItem,
  InputLabel,
  Select,
  TableContainer,
  Typography,
  FormGroup,
  Checkbox,
  Snackbar,
  SnackbarContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions
} from '@mui/material';
import MainCard from 'components/MainCard';
import { fetchPropertyRange, fetchWards, saveAppliedTaxes } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
import { useSelector } from 'react-redux';
//
const ApplyTax = () => {
  const [NewWardNo, setNewWardNo] = useState([]);
  const [NewPropertyNo, setNewPropertyNo] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [NewPropertyTo, setNewPropertyTo] = useState([]);
  const [selectedPropertyTo, setSelectedPropertyTo] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showPropertyTable, setShowPropertyTable] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  // const [ownerIDs, setOwnerIDs] = useState([]);
  const [propertyTax, setPropertyTax] = useState(false);
  const [educationTax, setEducationTax] = useState(false);
  const [employmentTax, setEmploymentTax] = useState(false);
  const [spEducationTax, setSpEducationTax] = useState(false);
  const [drainCess, setDrainCess] = useState(false);
  const [roadCess, setRoadCess] = useState(false);
  const [treeCess, setTreeCess] = useState(false);
  const [sewageDisposalCess, setSewageDisposalCess] = useState(false);
  const [sanitation, setSanitation] = useState(false);
  const [waterBenefit, setWaterBenefit] = useState(false);
  const [spWaterCess, setSpWaterCess] = useState(false);
  const [majorBuilding, setMajorBuilding] = useState(false);
  const [fireCess, setFireCess] = useState(false);
  const [lightCess, setLightCess] = useState(false);
  const [tax1, setTax1] = useState(false);
  const [tax2, setTax2] = useState(false);
  const [tax3, setTax3] = useState(false);
  const [tax4, setTax4] = useState(false);
  const [tax5, setTax5] = useState(false);
  const [isTaxforplot, setIsTaxforplot] = useState(false);

  const [waterBill, setWaterBill] = useState(false);
  // const [inAppComm, setInAppComm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isTaxForPlot, setIsTaxForPlot] = useState(false);
  const [isPolicyApplicable, setIsPolicyApplicable] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  //snackbar

  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleShowClick = (e) => {
    console.log('selectedWard:', selectedWard); // Debug log
    switch (true) {
      case selectedWard.length === 0:
        alert('Please select ward and property range');
        return;
      case selectedWard.length > 0 && (!selectedProperty || !selectedPropertyTo):
        alert('Please select property range');
        return;
      default:
        setIsOpen(true);
    }
    setIsOpen(true);
    e.preventDefault();

    const from = selectedProperty;
    const to = selectedPropertyTo;

    fetchPropertyRange(selectedWard, from, to)
      .then((propertyRange) => {
        const propertyRangeWithWard = propertyRange.map((item) => ({
          ...item,
          NewWardNo: selectedWard
        }));
        setShowPropertyTable(propertyRangeWithWard);
      })
      .catch((error) => {
        console.error('Error fetching property range:', error);
      });
  };

  const renderValue = (selected) => {
    if (selected.length === 0) {
      return <em>None</em>;
    }
    if (selectAll) {
      return 'ALL';
    }
    return selected.join(', ');
  };

  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
  };
  // const [selectedPropertyNoTo, setSelectedPropertyNoTo] = useState('');
  // const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const handlePropertyChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedProperty(e.target.value);
  };
  const handlePropertyChangeTo = async (e) => {
    setSelectedPropertyTo(e.target.value);
  };

  //ward
  // ward
useEffect(() => {
  fetchWards()
    .then((wards) => {
      // ✅ Sort wards by NewWardNo in ascending order
      const sortedWards = wards.sort((a, b) => a.NewWardNo - b.NewWardNo);
      setNewWardNo(sortedWards);
    })
    .catch((error) => {
      console.error('Error fetching ward:', error);
    });
}, []);

const handleCheckboxChanges = async (wardNo) => {
  if (wardNo === 0) {
    // 🔹 "ALL" case
    const allChecked = !selectAll;
    setSelectAll(allChecked);

    const updatedSelectedWard = allChecked ? NewWardNo.map((ward) => ward.NewWardNo) : [];
    setSelectedWard(updatedSelectedWard);

    if (allChecked) {
      // Clear everything
      setNewPropertyNo([]);
      setNewPropertyTo([]);
      setSelectedProperty('');
      setSelectedPropertyTo('');
      setShowPropertyTable([]);
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  } else {
    // 🔹 Toggle single ward
    const updatedSelectedWard = selectedWard.includes(wardNo)
      ? selectedWard.filter((w) => w !== wardNo)
      : [...selectedWard, wardNo];

    setSelectedWard(updatedSelectedWard);
    setSelectAll(updatedSelectedWard.length === NewWardNo.length);

    if (updatedSelectedWard.length > 1) {
      // Multiple wards → disable dropdowns
      setNewPropertyNo([]);
      setNewPropertyTo([]);
      setShowPropertyTable([]);
      setButtonDisabled(true);
    } else {
      try {
        // ✅ Fetch properties for the ward
        const propertyRange = await fetchPropertyRangeByWard(wardNo);
        console.log('👉 Raw propertyRange from API:', propertyRange);

        // ✅ Map actual properties array
        const formattedProperties = (propertyRange.properties || []).map((item) => {
          const propValue =
            item.NewPartitionNo && item.NewPartitionNo !== 0 && item.NewPartitionNo !== ''
              ? `${item.NewPropertyNo}-${item.NewPartitionNo}`
              : `${item.NewPropertyNo}`;

          console.log(
            `✅ Property: ${item.NewPropertyNo}, Partition: ${item.NewPartitionNo}, prop: ${propValue}`
          );

          return { ...item, prop: propValue };
        });

        console.log('👉 Final formattedProperties:', formattedProperties);

        // ✅ Bind to dropdowns
        setNewPropertyNo(formattedProperties);
        setNewPropertyTo(formattedProperties);

        // Reset selection
        setSelectedProperty('');
        setSelectedPropertyTo('');

        setButtonDisabled(false);
      } catch (error) {
        console.error('❌ Error fetching property range:', error);
        setButtonDisabled(true);
      }
    }
  }
};


  // const handleCheckboxChanges = async (wardNo) => {
  //   if (wardNo === 0) {
  //     // "ALL" case
  //     const allChecked = !selectAll;
  //     setSelectAll(allChecked);
  //     const updatedSelectedWard = allChecked ? NewWardNo.map((ward) => ward.NewWardNo) : [];
  //     setSelectedWard(updatedSelectedWard);
  //     if (allChecked) {
  //       setNewPropertyNo([]);
  //       setNewPropertyTo([]);
  //       setSelectedProperty('');
  //       setSelectedPropertyTo('');
  //       setShowPropertyTable([]);
  //       setButtonDisabled(true);
  //     } else {
  //       setButtonDisabled(false);
  //     }
  //   } else {
  //     const updatedSelectedWard = selectedWard.includes(wardNo)
  //       ? selectedWard.filter((w) => w !== wardNo)
  //       : [...selectedWard, wardNo];

  //     setSelectedWard(updatedSelectedWard);
  //     setSelectAll(updatedSelectedWard.length === NewWardNo.length);

  //     if (updatedSelectedWard.length > 1) {
  //       setNewPropertyNo([]);
  //       setNewPropertyTo([]);
  //       setShowPropertyTable([]);
  //       setButtonDisabled(true);
  //     } else {
  //       try {
  //         const from = selectedProperty;
  //         const to = selectedPropertyTo;
  //         const propertyRange = await fetchPropertyRangeByWard(wardNo); // Ensure this API works with just wardNo
  //         console.log('propertyRange:', propertyRange);
  //         const formattedProperties = propertyRange.map((item) => ({
  //           ...item,
  //           prop: item.NewPartitionNo && item.NewPartitionNo !== 0
  //             ? `${item.NewPropertyNo}-${item.NewPartitionNo}`
  //             : `${item.NewPropertyNo}`
  //         }));
          
  //         setNewPropertyNo(formattedProperties);
  //         setNewPropertyTo(formattedProperties);
  //         // To dropdown
  //         setButtonDisabled(false);
  //       } catch (error) {
  //         console.error('Error fetching property range:', error);
  //         setButtonDisabled(true);
  //       }
  //     }
  //   }
  // };
  const [password, setPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickDialog = () => {

    setOpenDialog(true);
  };
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user in constr  page');
  }, [userData])
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleSaveClick = async () => {
    if (!password) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Please enter password!');
      setSnackbarOpen(true);
      return;
    }

    const levelname = 'L1'; 

    try {
      setLoading(true);

      // Step 1: validate L1 password
      const passwordCheckResponse = await levelPassword(levelname, password);
      if (passwordCheckResponse.status !== 200) {
        throw new Error('Invalid password');
      }

      // Step 2: save taxes
      const taxValues = {
        selectAll,
        selectedWard,
        propertyTax,
        educationTax,
        employmentTax,
        spEducationTax,
        drainCess,
        roadCess,
        treeCess,
        sewageDisposalCess,
        sanitation,
        waterBenefit,
        spWaterCess,
        majorBuilding,
        fireCess,
        lightCess,
        tax1,
        tax2,
        tax3,
        tax4,
        tax5,
        waterBill,
        isTaxForPlot: isTaxforplot ? 1 : 0,
        isPolicyApplicable,
        UserID: userData?.UserID || 1

      };

      const response = await saveAppliedTaxes(taxValues);

      setSnackbarSeverity('success');
      setSnackbarMessage(response?.message || 'Taxes applied successfully!');
      setSnackbarOpen(true);
      setPassword('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Error applying taxes:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(error.message || 'Failed to apply taxes. Please try again.');
      setSnackbarOpen(true);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // const handleSaveClick = async () => {
  //   const taxValues = {
  //     selectAll,
  //     selectedWard,
  //     propertyTax,
  //     educationTax,
  //     employmentTax,
  //     spEducationTax,
  //     drainCess,
  //     roadCess,
  //     treeCess,
  //     sewageDisposalCess,
  //     sanitation,
  //     waterBenefit,
  //     spWaterCess,
  //     majorBuilding,
  //     fireCess,
  //     lightCess,
  //     tax1,
  //     tax2,
  //     tax3,
  //     tax4,
  //     tax5,
  //     waterBill,
  //     isTaxForPlot,
  //     isPolicyApplicable,
  //   };

  //   try {
  //     setLoading(true); // ✅ start loader
  //     const response = await saveAppliedTaxes(taxValues);
  //     console.log('Taxes applied successfully:', response);
  //     setSnackbarSeverity('success');
  //     setSnackbarMessage('Taxes applied successfully!');
  //     setSnackbarOpen(true);
  //   } catch (error) {
  //     console.error('Error applying taxes:', error);
  //     setSnackbarSeverity('error');
  //     setSnackbarMessage('Failed to apply taxes. Please try again.');
  //     setSnackbarOpen(true);
  //   } finally {
  //     setLoading(false); // ✅ stop loader
  //   }
  // };
  const handleClearClick = () => {
    // Reset all dropdowns and selections
    setSelectedWard([]);
    setSelectAll(false);
    setSelectedProperty('');
    setSelectedPropertyTo('');
    setNewPropertyNo([]);
    setNewPropertyTo([]);

    // Reset property table
    setShowPropertyTable([]);
    setIsOpen(false);
    setButtonDisabled(false);

    // Reset all taxes
    setPropertyTax(false);
    setEducationTax(false);
    setEmploymentTax(false);
    setSpEducationTax(false);
    setDrainCess(false);
    setRoadCess(false);
    setTreeCess(false);
    setSewageDisposalCess(false);
    setSanitation(false);
    setWaterBenefit(false);
    setSpWaterCess(false);
    setMajorBuilding(false);
    setFireCess(false);
    setLightCess(false);
    setTax1(false);
    setTax2(false);
    setTax3(false);
    setTax4(false);
    setTax5(false);
    setIsTaxforplot(false);

    setWaterBill(false);
    setIsTaxForPlot(false);
    setIsPolicyApplicable(false);

    // Optional: close snackbar if open
    setSnackbarOpen(false);
  };

  // const handleSaveClick = () => {
  //   const taxValues = {
  //     selectAll,
  //     selectedWard,
  //     propertyTax,
  //     educationTax,
  //     employmentTax,
  //     spEducationTax,
  //     drainCess,
  //     roadCess,
  //     treeCess,
  //     sewageDisposalCess,
  //     sanitation,
  //     waterBenefit,
  //     spWaterCess,
  //     majorBuilding,
  //     fireCess,
  //     lightCess,
  //     tax1,
  //     tax2,
  //     tax3,
  //     tax4,
  //     tax5,
  //     waterBill,
  //     isTaxForPlot,
  //     isPolicyApplicable,
  //     // inAppComm,
  //     // inHearing,
  //     // drainFlatRate
  //   };
  //   console.log('taxdata', taxValues);
  //   saveAppliedTaxes(taxValues)
  //     .then((response) => {
  //       console.log('Taxes applied successfully:', response);
  //       setSnackbarSeverity('success');
  //     setSnackbarMessage('Taxes applied successfully!');
  //     setSnackbarOpen(true);
  //     })
  //     .catch((error) => {
  //       console.error('Error applying taxes:', error);
  //       setSnackbarSeverity('error');
  //     setSnackbarMessage('Failed to apply taxes. Please try again.');
  //     setSnackbarOpen(true)
  //     });
  // };

  return (
    <MainCard title="Apply Tax Master">
      <Grid container spacing={1}>
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent overlay
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <CircularProgress size={60} />
            <Typography
              variant="h6"
              sx={{ mt: 2, color: 'red', fontWeight: 'bold', textAlign: 'center' }}
            >
              Please wait...
            </Typography>
          </Box>
        )}


        <Grid item xs={12} md={7}>
          <Grid mb={2}>
            <MainCard>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel>Ward</InputLabel>
                    <Select
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflowY: 'auto'
                          }
                        }
                      }}
                      style={{ height: '35px' }}
                      value={selectedWard}
                      renderValue={renderValue}
                    >
                      <MenuItem key="all" value="ALL" onClick={() => handleCheckboxChanges(0)}>
                        <Checkbox checked={selectAll} onChange={() => handleCheckboxChanges(0)} />
                        ALL
                      </MenuItem>
                      {NewWardNo.map((ward, index) => (
                        <MenuItem key={index} value={ward.NewWardNo}>
                          <Checkbox
                            checked={selectedWard.includes(ward.NewWardNo)}
                            onChange={() => handleCheckboxChanges(ward.NewWardNo)}
                          />
                          {ward.NewWardNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel> From Property </InputLabel>
                    <Select
                      onChange={handlePropertyChangeFrom}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflowY: 'auto'
                          }
                        }
                      }}
                      style={{ height: '35px' }}
                      value={selectedProperty}
                      disabled={selectAll}
                    >
                      {Array.isArray(NewPropertyNo) &&
      [...NewPropertyNo]
      .sort((a, b) => Number(a.prop) - Number(b.prop)) 
      .map((property, index) => (
          <MenuItem key={index} value={property.prop}>
            {property.prop}
          </MenuItem>
        ))}

                    </Select>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                <Stack spacing={1}>
  <InputLabel>To Property</InputLabel>
  <Select
    onChange={handlePropertyChangeTo}
    MenuProps={{
      PaperProps: {
        style: {
          maxHeight: 150,
          overflowY: 'auto',
        },
      },
    }}
    style={{ height: '35px' }}
    value={selectedPropertyTo}
    disabled={selectAll}
  >
    {Array.isArray(NewPropertyTo) &&
      [...NewPropertyTo]
      .sort((a, b) => Number(a.prop) - Number(b.prop)) 
      .map((property, index) => (
          <MenuItem key={index} value={property.prop}>
            {property.prop}
          </MenuItem>
        ))}
  </Select>
</Stack>

                </Grid>
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center' }} mt={1}>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                  <Button variant="contained" color="secondary" onClick={handleShowClick} disabled={buttonDisabled}>
                    Show
                  </Button>
                </Stack>
              </Grid>
            </MainCard>
          </Grid>

          <Grid mb={2}>
            <MainCard>
              <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                Apply Tax From Here:
              </Typography>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                {[
                  { key: 'PropertyTax', label: 'Property', checked: propertyTax, set: setPropertyTax },
                  { key: 'EducationTax', label: 'Education', checked: educationTax, set: setEducationTax },
                  { key: 'EmploymentTax', label: 'Employment', checked: employmentTax, set: setEmploymentTax }, // make sure you have this state
                  { key: 'SpEducationTax', label: 'Sp.Edu.', checked: spEducationTax, set: setSpEducationTax },



                  // If you truly need "Total" as a checkbox, add a state for it and uncomment:
                  // { key: 'Total',              label: 'Total',        checked: totalChecked,          set: setTotalChecked },
                ].map(({ key, label, checked, set }) => (
                  <Grid
                    item
                    key={key}
                    sx={{
                      flex: '1 0 25%',         // 4 equal columns per row
                      display: 'flex',

                      px: 1,                  // horizontal padding (margin look)
                      mb: 1                   // vertical spacing between rows
                    }}>
                    <FormControlLabel
                      value={key}
                      control={<Checkbox checked={checked} onChange={(e) => set(e.target.checked)} />}
                      label={label}
                      labelPlacement="end"
                      sx={{ ml: 0.5 }}
                    />
                  </Grid>
                ))}

              </Grid>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>

                {[
                  { key: 'TreeCess', label: 'Tree', checked: treeCess, set: setTreeCess },
                  { key: 'FireCess', label: 'Fire', checked: fireCess, set: setFireCess },
                  { key: 'DrainCess', label: 'Drain', checked: drainCess, set: setDrainCess },
                  { key: 'SewageDisposalCess', label: 'Sewage', checked: sewageDisposalCess, set: setSewageDisposalCess },
                ].map(({ key, label, checked, set }) => (
                    <Grid item
                      key={key}
                      sx={{
                        flex: '1 0 25%',         // 4 equal columns per row
                        display: 'flex',

                        px: 1,                  // horizontal padding (margin look)
                        mb: 1                   // vertical spacing between rows
                      }}>
                      <FormControlLabel
                        value={key}
                        control={<Checkbox checked={checked} onChange={(e) => set(e.target.checked)} />}
                        label={label}
                        labelPlacement="end"
                        sx={{ ml: 0.5 }}
                      />
                    </Grid>
                  ))
                }
              </Grid>
              <Grid display={'flex'} alignItems={'left'} justifyContent={'space-between'}>

                {[
                  { key: 'RoadCess', label: 'Road', checked: roadCess, set: setRoadCess },
                  { key: 'Sanitation', label: 'Sanitation', checked: sanitation, set: setSanitation },
                  { key: 'SpWaterCess', label: 'W.Cess', checked: spWaterCess, set: setSpWaterCess },
                  { key: 'WaterBenefit', label: 'W.benefit', checked: waterBenefit, set: setWaterBenefit },].map(({ key, label, checked, set }) => (
                    <Grid item
                      key={key}
                      sx={{
                        flex: '1 0 25%',         // 4 equal columns per row
                        display: 'flex',

                        px: 1,                  // horizontal padding (margin look)
                        mb: 1                   // vertical spacing between rows
                      }}>
                      <FormControlLabel
                        value={key}
                        control={<Checkbox checked={checked} onChange={(e) => set(e.target.checked)} />}
                        label={label}
                        labelPlacement="end"
                        sx={{ ml: 0.5 }}
                      />
                    </Grid>
                  ))
                }
              </Grid>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>

                {[
                  { key: 'WaterBill', label: 'Water Bill', checked: waterBill, set: setWaterBill },
                  { key: 'MajorBuilding', label: 'Major Build', checked: majorBuilding, set: setMajorBuilding },
                  { key: 'LightCess', label: 'Light', checked: lightCess, set: setLightCess },

                  { key: 'Tax1', label: 'Tax1', checked: tax1, set: setTax1 }].map(({ key, label, checked, set }) => (
                    <Grid item
                      key={key}
                      sx={{
                        flex: '1 0 25%',         // 4 equal columns per row
                        display: 'flex',

                        px: 1,                  // horizontal padding (margin look)
                        mb: 1                   // vertical spacing between rows
                      }}>
                      <FormControlLabel
                        value={key}
                        control={<Checkbox checked={checked} onChange={(e) => set(e.target.checked)} />}
                        label={label}
                        labelPlacement="end"
                        sx={{ ml: 0.5 }}
                      />
                    </Grid>
                  ))
                }
               
              </Grid>
              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>

                {[
                  
                  { key: 'Tax2', label: 'Tax2', checked: tax2, set: setTax2 },
                  { key: 'Tax3', label: 'Tax3', checked: tax3, set: setTax3 },
                  { key: 'Tax4', label: 'Tax4', checked: tax4, set: setTax4 },

                  { key: 'Tax5', label: 'Tax5', checked: tax5, set: setTax5}].map(({ key, label, checked, set }) => (
                   
                    <Grid item
                      key={key}
                      sx={{
                        flex: '1 0 25%',         // 4 equal columns per row
                        display: 'flex',

                        px: 1,                  // horizontal padding (margin look)
                        mb: 1                   // vertical spacing between rows
                      }}>
                      <FormControlLabel
                        value={key}
                        control={<Checkbox checked={checked} onChange={(e) => set(e.target.checked)} />}
                        label={label}
                        labelPlacement="end"
                        sx={{ ml: 0.5 }}
                      />
                    </Grid>
                  ))
                }
               
              </Grid>
              
               <Grid  display={'flex'} alignItems={'left'} justifyContent={'space-between'}></Grid>
                <Grid item
                  sx={{
                    flex: '1 0 25%',         // 4 equal columns per row
                    display: 'flex',
                    px: 1,                  // horizontal padding (margin look)
                    mb: 1                   // vertical spacing between rows
                  }}>
                  <FormControlLabel
                    value="IsPolicyApplicable"
                    control={<Checkbox checked={isPolicyApplicable} onChange={(event) => setIsPolicyApplicable(event.target.checked)} />}
                    label="Is Policy Applicable"
                    labelPlacement="end"
                    sx={{ ml: 0.5 }}
                  />
                   <FormControlLabel
                    value="isTaxforplot"
                    control={<Checkbox checked={isTaxforplot} onChange={(event) => setIsTaxforplot(event.target.checked)} />}
                    label="Is Tax for plot"
                    labelPlacement="end"
                    sx={{ ml: 1 }}
                  />
                </Grid>

              <Box display="flex" justifyContent="center" mt={3}>

                <Stack spacing={2} direction="row">
                  <Button variant="contained" color="success" onClick={handleClickDialog} disabled={loading} >
                    Save
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleClearClick}>
                    Clear
                  </Button>
                </Stack>
              </Box>
            </MainCard>
          </Grid>
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
            <DialogTitle id="alert-dialog-title" color="error" style={{ fontSize: '24px', fontWeight: 'bold' }}>
              
            </DialogTitle>

            <DialogContent>
              <Stack marginBottom={2}>
                <DialogContentText id="alert-dialog-description">Enter L1 Password</DialogContentText>
              </Stack>
              <TextField
                label="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />{' '}
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="success" onClick={handleSaveClick} autoFocus>
                Ok
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

        </Grid>

        <Grid item xs={12} md={5}>
          {isOpen && (
            <MainCard title="Property Information" style={{ color: 'blue', fontWeight: 'bold' }}>
              <TableContainer style={{ height: '58vh' ,overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                      <TableCell>Owner ID</TableCell>
                      <TableCell>Ward No.</TableCell>
                      <TableCell>Property No.</TableCell>
                      <TableCell>Partition No.</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {showPropertyTable.map((item, index) => (
                      <TableRow key={index} onClick={() => handleRowClick(item.OwnerID)}>
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
    </MainCard>
  );
};

export default ApplyTax;