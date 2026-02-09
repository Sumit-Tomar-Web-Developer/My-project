// material-ui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  Stack,
  TextField,
  Typography,
  RadioGroup,
  Snackbar,
  SnackbarContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import React, { useEffect, useState } from 'react';

// project import
import MainCard from 'components/MainCard';
//Dialog
import { fetchWards } from 'services/masterServices/apply-tax-services/apply-tax.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import {
  getJointOwnerDetails,
  getOwnerNames,
  getPropertyRangeFromAndTo,
  saveAddress,
  saveCommonRemark,
  saveOwnerNames,
  savePropertyDesc,
  saveRoad,
  saveShop,
  saveWadhGhat
} from 'services/utlilityService/updatePropertyDetailsService/updatePropertyDetailsService';
import translateText from 'utils/translator';
import { fetchPropertyDescription } from 'services/data-entry.services';
import PropertyType from 'pages/Master/property-type/PropertyType';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { useNavigate } from 'react-router';
// ==============================|| SAMPLE PAGE ||============================== //

function UpdatePropertyAddress() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});

  //dialog Common
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllAddress, setselectAllAddress] = useState(false);
  const [selectAllProp, setselectAllProp] = useState(false);

  const [wardList, setwardList] = useState([]);
  const [wardListProperty, setwardListProperty] = useState([]);
  const [propertyNoListTo, setpropertyNoListTo] = useState([]);
  const [propertyNoList, setPropertyNoList] = useState([]);
  const [propertyNoAddressList, setPropertyNoAddressList] = useState([]);
  const [propertyNoRoadList, setPropertyNoRoadList] = useState([]);
  const [propertyNoPropertyList, setPropertyNoPropertyList] = useState([]);

  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedPropertyRoad, setSelectedPropertyRoad] = useState('');

  const [propertyNoListFrom, setpropertyNoListFrom] = useState([]);
  const [selectedPropertyNoTo, setSelectedPropertyNoTo] = useState('');
  const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const [propertyRangeList, setpropertyRangeList] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState([]);
  const [jointDetails, setJointDetails] = useState([]);

  const [jointDetailsAddress, setJointDetailsAddress] = useState([]);
  const [jointDetailsRoad, setJointDetailsRoad] = useState([]);
  const [jointDetailsDescription, setJointDetailsDescription] = useState([]);
  const [addressDetails, setAddressDetails] = useState([]);
  const [ShopDetails, setShopDetails] = useState([]);
  const [existingCommonRemarkDetails, setExistingCommonRemarkDetails] = useState([]);
  const [wadhGhatDetails, setWadhGhatDetails] = useState([]);

  const [roadDetails, setRoadDetails] = useState([]);
  const [propDetails, setPropDetails] = useState([]);
  const [existingPropertyDescriptionShow, setExistingPropertyDescriptionShow] = useState([]);
  const [existingPropertyShop, setExistingPropertyShop] = useState([]);

  const [selectedProperties, setSelectedProperties] = useState([]);
  const [openDialogShop, setOpenDialogShop] = useState(false);
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedWardProperty, setSelectedWardProperty] = useState('');
  const [ownerIds, setOwnerIds] = useState([]);
  // address tab
  const [selectedAddressWard, setSelectedAddressWard] = useState('');
  const [selectedPropertyNoAddressFrom, setSelectedPropertyNoAddressFrom] = useState('');
  const [selectedPropertyNoAddressTo, setSelectedPropertyNoAddressTo] = useState('');
  const [propertyRangeAddressList, setpropertyRangeAddressList] = useState([]);
  const [selectedWardAddressProperty, setSelectedWardAddressProperty] = useState('');
  const [selectedPropertyAddress, setSelectedAddressProperty] = useState('');
  //road tab
  const [selectedRoadWard, setSelectedRoadWard] = useState('');
  const [selectedPropertyNoRoadFrom, setSelectedPropertyNoRoadFrom] = useState('');
  const [selectedPropertyNoRoadTo, setSelectedPropertyNoRoadTo] = useState('');
  const [selectAllRoad, setselectAllRoad] = useState(false);

  const [selectedPropertyDesc, setSelectedPropertyDesc] = useState('');
  const [selectedWardRoadProperty, setSelectedWardRoadProperty] = useState('');
  const [propertyRangeRoadList, setpropertyRangeRoadList] = useState([]);

  //Property
  const [selectedPropertyList, setSelectedPropertyList] = useState('');
  const [selectedPropertyWards, setSelectedPropertyWards] = useState('');
  const [selectedPropertyNosFrom, setSelectedPropertyNosFrom] = useState('');
  const [selectedPropertyNoPropTo, setSelectedPropertyNoPropTo] = useState('');
  const [propertyRangePropList, setpropertyRangePropList] = useState([]);

  //Shop
  const [selectedShopWard, setSelectedShopWard] = useState('');
  const [selectedPropertyNoShopFrom, setSelectedPropertyNoShopFrom] = useState('');
  const [selectedPropertyNoShopTo, setSelectedPropertyNoShopTo] = useState('');
  const [propertyRangeShopList, setpropertyRangeShopList] = useState([]);
  const [selectAllShop, setselectAllShop] = useState(false);
  //snackbar WadhGhat
  const [snackbarSeverityWadhGhat, setSnackbarSeverityWadhGhat] = useState('success');
  const [snackbarOpenWadhGhat, setSnackbarOpenWadhGhat] = useState(false);
  const [snackbarMessageWadhGhat, setSnackbarMessageWadhGhat] = useState('');
  
  const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user');
  }, [userData]);
  const handleCloseSnackbarWadhGhat = () => {
    setSnackbarOpenWadhGhat(false);
  };
  //snackbar CommonRemark
  const [snackbarSeverityCommonRemark, setSnackbarSeverityCommonRemark] = useState('success');
  const [snackbarOpenCommonRemark, setSnackbarOpenCommonRemark] = useState(false);
  const [snackbarMessageCommonRemark, setSnackbarMessageCommonRemark] = useState('');

  const handleCloseSnackbarCommonRemark = () => {
    setSnackbarOpenCommonRemark(false);
  };

  //snackbar Shop
  const [snackbarSeverityShop, setSnackbarSeverityShop] = useState('success');
  const [snackbarOpenShop, setSnackbarOpenShop] = useState(false);
  const [snackbarMessageShop, setSnackbarMessageShop] = useState('');

  const handleCloseSnackbarShop = () => {
    setSnackbarOpenShop(false);
  };
  //snackbar ProDesc
  const [snackbarSeverityProDesc, setSnackbarSeverityProDesc] = useState('success');
  const [snackbarOpenProDesc, setSnackbarOpenProDesc] = useState(false);
  const [snackbarMessageProDesc, setSnackbarMessageProDesc] = useState('');

  const handleCloseSnackbarProDesc = () => {
    setSnackbarOpenProDesc(false);
  };
  //snackbar Road
  const [snackbarSeverityRoad, setSnackbarSeverityRoad] = useState('success');
  const [snackbarOpenRoad, setSnackbarOpenRoad] = useState(false);
  const [snackbarMessageRoad, setSnackbarMessageRoad] = useState('');

  const handleCloseSnackbarRoad = () => {
    setSnackbarOpenRoad(false);
  };
  //snackbar Address
  const [snackbarSeverityAddress, setSnackbarSeverityAddress] = useState('success');
  const [snackbarOpenAddress, setSnackbarOpenAddress] = useState(false);
  const [snackbarMessageAddress, setSnackbarMessageAddress] = useState('');

  const handleCloseSnackbarAddress = () => {
    setSnackbarOpenAddress(false);
  };
  //snackbar Owner
  const [snackbarSeverityOwner, setSnackbarSeverityOwner] = useState('success');
  const [snackbarOpenOwner, setSnackbarOpenOwner] = useState(false);
  const [snackbarMessageOwner, setSnackbarMessageOwner] = useState('');

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Update Property Details';
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
      console.log(access, 'assigned access to Update Property Details Page');
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

  const handleCloseSnackbarOwner = () => {
    setSnackbarOpenOwner(false);
  };

  const handleCheckboxChangesNameLike = (event) => {
    setNameLikeChecked(event.target.checked);

    if (event.target.checked) {
      setNameLikeWardChecked(false);
    }
  };

  const handleCheckboxChangesNameLikeWard = (event) => {
    setNameLikeWardChecked(event.target.checked);

    if (event.target.checked) {
      setNameLikeChecked(false);
    }
  };

  const handleCancelChange = () => {
    setSelectedWardProperty('');
    setSelectedPropertyNoTo('');
    setSelectedPropertyNoFrom('');
    setSelectedProperties([]);
    setSelectAll(false);
    setShowTable(true);
    setNameLikeChecked(false);
    setNameLikeWardChecked(false);
    setNames({
      OwnerName: '',
      OwnerNameMarathi: ''
    });
    setSelectedProperty('');
    setSelectedWard('');
    setError({});
  };

  useEffect(() => {
    const fetchWardList = async () => {
      try {
        const wardlist = await fetchWards();
        const sortedWardList = wardlist.sort((a, b) => a.NewWardNo - b.NewWardNo); // Sort by NewWardNo in ascending order
        console.log('Sorted wardList:', sortedWardList);
        setwardList(sortedWardList);
        setwardListProperty(sortedWardList);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchWardList();
  }, []);

  useEffect(() => {
    const fetchOwnerNames = async () => {
      try {
        const response = getOwnerNames(selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);
        console.log('Sorted wardList:', response);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };

    fetchOwnerNames();
  }, []);

  useEffect(() => {
    console.log('Updated roadDetails:', roadDetails);
  }, [roadDetails]);
  //address
  useEffect(() => {
    const fetchPropertyRangeList = async () => {
      console.log(selectedAddressWard, selectedPropertyNoAddressFrom, selectedPropertyNoAddressTo);
      try {
        if (selectedAddressWard && selectedPropertyNoAddressFrom && selectedPropertyNoAddressTo) {
          const propertyRange = await getPropertyRangeFromAndTo(
            selectedAddressWard,
            selectedPropertyNoAddressFrom,
            selectedPropertyNoAddressTo
          );
          console.log(propertyRange);
          setpropertyRangeAddressList(propertyRange);
        } else {
          setpropertyRangeAddressList([]);
        }
      } catch (error) {
        console.error('Failed to fetch propertyRange:', error);
      }
    };

    fetchPropertyRangeList();
  }, [selectedAddressWard, selectedPropertyNoAddressFrom, selectedPropertyNoAddressTo]);
  //Road
  useEffect(() => {
    const fetchPropertyRangeList = async () => {
      console.log(selectedRoadWard, selectedPropertyNoRoadFrom, selectedPropertyNoRoadTo);
      try {
        if (selectedRoadWard && selectedPropertyNoRoadFrom && selectedPropertyNoRoadTo) {
          const propertyRange = await getPropertyRangeFromAndTo(selectedRoadWard, selectedPropertyNoRoadFrom, selectedPropertyNoRoadTo);
          console.log(propertyRange);
          setpropertyRangeRoadList(propertyRange);
        } else {
          setpropertyRangeRoadList([]);
        }
      } catch (error) {
        console.error('Failed to fetch propertyRange:', error);
      }
    };

    fetchPropertyRangeList();
  }, [selectedRoadWard, selectedPropertyNoRoadFrom, selectedPropertyNoRoadTo]);

  //Prop
  useEffect(() => {
    const fetchPropertyRangeList = async () => {
      console.log(selectedPropertyWards, selectedPropertyNosFrom, selectedPropertyNoPropTo);
      try {
        if (selectedPropertyWards && selectedPropertyNosFrom && selectedPropertyNoPropTo) {
          const propertyRange = await getPropertyRangeFromAndTo(selectedPropertyWards, selectedPropertyNosFrom, selectedPropertyNoPropTo);
          console.log(propertyRange);
          setpropertyRangePropList(propertyRange);
        } else {
          setpropertyRangePropList([]);
        }
      } catch (error) {
        console.error('Failed to fetch propertyRange:', error);
      }
    };

    fetchPropertyRangeList();
  }, [selectedPropertyWards, selectedPropertyNosFrom, selectedPropertyNoPropTo]);

  //get property description fetching
  useEffect(() => {
    fetchPropertyDescription()
      .then((fetchproperty) => {
        setPropDetails(fetchproperty);
        console.log(propDetails, 'property description fetched.');
      })
      .catch((error) => {
        console.error('Error fetching property description:', error);
      });
  }, []);

  useEffect(() => {
    const fetchPropertyRangeList = async () => {
      try {
        if (selectedWard && selectedPropertyNoFrom && selectedPropertyNoTo) {
          const propertyRange = await getPropertyRangeFromAndTo(selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);

          console.log('propertyRange:', propertyRange);
          setpropertyRangeList(propertyRange);
        } else {
          setpropertyRangeList([]);
        }
      } catch (error) {
        console.error('Failed to fetch propertyRange:', error);
      }
    };

    fetchPropertyRangeList();
  }, [selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo]);
  const [selectAllCommRemark, setselectAllCommRemark] = useState(false);
  //commRemark
  const handleCommRemarkWardChange = async (event) => {
    const ward = event.target.value;
    setSelectedCommRemarkWard(ward);
    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setpropertyNoListTo(propertyRange.properties);
      setpropertyNoListFrom(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };

  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
  
    if (checked) {
      const allOwnerIds = propertyRangeList.map(
        (property) => property.OwnerID
      );
  
      // 🔥 IMPORTANT FIX
      setSelectedPropertyOwnerIds(allOwnerIds);
    } else {
      setSelectedPropertyOwnerIds([]);
    }
  };
  
  //address all

  const handleSelectAllAddressChange = (event) => {
    const checked = event.target.checked;
    setselectAllAddress(checked);
  
    if (checked) {
      const allIds = propertyRangeAddressList.map((p) => p.OwnerID);
      setSelectedAddressOwnerIds(allIds);
    } else {
      setSelectedAddressOwnerIds([]);
    }
  };
  
  
  const [selectedRoadOwnerIds, setSelectedRoadOwnerIds] = useState([]);

  //road all
  const handleSelectAllRoadChange = (event) => {
    const checked = event.target.checked;
    setselectAllRoad(checked);
  
    if (checked) {
      const allIds = propertyRangeRoadList.map((p) => p.OwnerID);
      setSelectedRoadOwnerIds(allIds);
    } else {
      setSelectedRoadOwnerIds([]);
    }
  };

  //Prop all
  const handleSelectAllPropChange = (event) => {
    const checked = event.target.checked;
    setselectAllProp(checked);
  
    if (checked) {
      // When "Select All" is checked, select all property owner IDs
      const allOwnerIds = propertyRangePropList.map((property) => property.OwnerID);
      setSelectedPropertyOwnerIds(allOwnerIds);
    } else {
      // When unchecked, clear selection
      setSelectedPropertyOwnerIds([]);
    }
  };
  const handlePropertySelectChange = (event, property) => {
    const checked = event.target.checked;
    const propertyOwnerId = property.OwnerID;
  
    setSelectedPropertyOwnerIds((prevIds) => {
      let newIds;
  
      if (checked) {
        newIds = [...prevIds, propertyOwnerId];
      } else {
        newIds = prevIds.filter((id) => id !== propertyOwnerId);
      }
  
      // 🔄 Sync Select All checkbox
      setSelectAll(
        propertyRangeList.length > 0 &&
        newIds.length === propertyRangeList.length
      );
  
      return newIds;
    });
  };
  
  
  //Shop
  const handlePropertyShopChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedPropertyNoShopFrom(e.target.value);
  };

  //Shop
  const handlePropertyShopChangeTo = async (e) => {
    setSelectedPropertyNoShopTo(e.target.value);
  };
  //address
  const handlePropertySelectAddressChange = (event, property) => {
    const checked = event.target.checked;
    const propertyOwnerId = property.OwnerID;
  
    setSelectedAddressOwnerIds((prevIds) => {
      let newIds = [...prevIds];
  
      if (checked) {
        // Add if selected
        newIds.push(propertyOwnerId);
      } else {
        // Remove if unchecked
        newIds = newIds.filter(id => id !== propertyOwnerId);
      }
  
      // Update Select All state
      if (newIds.length === propertyRangeAddressList.length) {
        setselectAllAddress(true);
      } else {
        setselectAllAddress(false);
      }
  
      return newIds;
    });
  };
  
  //prop All
  const [selectedPropertyOwnerIds, setSelectedPropertyOwnerIds] = useState([]);

  const handlePropertySelectPropChange = (event, property) => {
    const checked = event.target.checked;
    const propertyOwnerId = property.OwnerID;

    // Use the previous state when updating ownerIds to ensure correct updates
    setSelectedPropertyOwnerIds((prevOwnerIds) => {
      let newOwnerIds = [...prevOwnerIds];
      if (checked) {
        // Add the selected property's OwnerID to the ownerIds array if checked
        newOwnerIds.push(propertyOwnerId);
      } else {
        // Remove the OwnerID from the ownerIds array if unchecked
        newOwnerIds = newOwnerIds.filter((id) => id !== propertyOwnerId);
      }

      // If all items are selected, set Select All to true
      if (newOwnerIds.length === propertyRangeAddressList.length) {
        setselectAllProp(true);
      } else {
        setselectAllProp(false);
      }

      return newOwnerIds;
    });
  };

  //road for All
  const handlePropertySelectRoadChange = (event, property) => {
    const checked = event.target.checked;
    const id = property.OwnerID;
  
    setSelectedRoadOwnerIds((prev) => {
      let updated = [];
  
      if (checked) {
        updated = [...prev, id];
      } else {
        updated = prev.filter((x) => x !== id);
      }
  
      // Auto enable/disable Select-All
      setselectAllRoad(updated.length === propertyRangeRoadList.length);
  
      return updated;
    });
  };
  
  const validateFieldsWadhGhat = () => {
    const newErrors = {};

    // Validate WadhGhat remarks
    if (!wadhGhat.WadhGhatRemarkOne && !wadhGhat.WadhGhatRemarkTwo) {
      newErrors.WadhGhatRemarkOne = 'At least one of WadhGhatRemarkOne or WadhGhatRemarkTwo is required';
      newErrors.WadhGhatRemarkTwo = 'At least one of WadhGhatRemarkOne or WadhGhatRemarkTwo is required';
    }
    // Validate selected ward
    if (!selectedWadhGhatWard) {
      newErrors.selectedWadhGhatWard = 'Please select a ward for WadhGhat';
    }

    // Validate property range (From and To)
    if (!selectedPropertyNoWadhGhatFrom) {
      newErrors.selectedPropertyNoWadhGhatFrom = 'Property No (From) is required';
    }
    if (!selectedPropertyNoWadhGhatTo) {
      newErrors.selectedPropertyNoWadhGhatTo = 'Property No (To) is required';
    }
    if (
      selectedPropertyNoWadhGhatFrom &&
      selectedPropertyNoWadhGhatTo &&
      Number(selectedPropertyNoWadhGhatFrom) > Number(selectedPropertyNoWadhGhatTo)
    ) {
      newErrors.propertyRange = 'Property range is invalid (From must be <= To)';
    }

    // Validate property list
    if (!propertyRangeWadhGhatList.length) {
      newErrors.propertyRangeWadhGhatList = 'Property range list cannot be empty';
    }

    // No specific validation for selectAllWadhGhat unless required
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectAllShopChange = (event) => {
    const checked = event.target.checked;
    setselectAllShop(checked);
  
    if (checked) {
      const allShopOwnerIds = propertyRangeShopList.map(shop => shop.OwnerID);
      setSelectedShopOwnerIds(allShopOwnerIds);
    } else {
      setSelectedShopOwnerIds([]);
    }
  };
  //shop
  const handleShopWardChange = async (event) => {
    const ward = event.target.value;
setSelectedShopWard(ward);
try {
  const propertyRange = await fetchPropertyRangeByWard(ward);
  console.log('propertyRange:', propertyRange);
  setpropertyNoListTo(propertyRange.properties);
  setpropertyNoListFrom(propertyRange.properties);
} catch (error) {
  console.error('Failed to fetch propertyRange:', error);
}
  }

  //shop
  useEffect(() => {
    const fetchPropertyRangeList = async () => {
      console.log(selectedShopWard, selectedPropertyNoShopFrom, selectedPropertyNoShopTo);
      try {
        if (selectedShopWard && selectedPropertyNoShopFrom && selectedPropertyNoShopTo) {
          const propertyRange = await getPropertyRangeFromAndTo(selectedShopWard, selectedPropertyNoShopFrom, selectedPropertyNoShopTo);
          console.log(propertyRange, 'prange');
          setpropertyRangeShopList(propertyRange);
        } else {
          setpropertyRangeShopList([]);
        }
      } catch (error) {
        console.error('Failed to fetch propertyRange:', error);
      }
    };
    fetchPropertyRangeList();
  }, [selectedShopWard, selectedPropertyNoShopFrom, selectedPropertyNoShopTo]);

  //shop

  const[selectedShopOwnerIds,setSelectedShopOwnerIds]=useState([]);
  const handlePropertySelectShopChange = (event, property) => {
    const checked = event.target.checked;
    const propertyOwnerId = property.OwnerID;
    // Use the previous state when updating ownerIds to ensure correct updates
    setSelectedShopOwnerIds((prevOwnerIds) => {
      let newOwnerIds = [...prevOwnerIds];
      if (checked) {
        // Add the selected property's OwnerID to the ownerIds array if checked
        newOwnerIds.push(propertyOwnerId);
      } else {
        // Remove the OwnerID from the ownerIds array if unchecked
        newOwnerIds = newOwnerIds.filter((id) => id !== propertyOwnerId);
      }
      // If all items are selected, set Select All to true
      if (newOwnerIds.length === propertyRangeAddressList.length) {
        setselectAllShop(true);
      } else {
        setselectAllShop(false);
      }
      return newOwnerIds;
    });
  };

  //Update CommonRemark
  const [selectedCommRemarkWard, setSelectedCommRemarkWard] = useState('');
  const [selectedPropertyNoCommRemarkFrom, setSelectedPropertyNoCommRemarkFrom] = useState('');
  const [selectedPropertyNoCommRemarkTo, setSelectedPropertyNoCommRemarkTo] = useState('');
  const [propertyRangeCommRemarkList, setpropertyRangeCommRemarkList] = useState([]);

  //wadhGhat
  const [selectedWadhGhatWard, setSelectedWadhGhatWard] = useState('');
  const [selectedPropertyNoWadhGhatFrom, setSelectedPropertyNoWadhGhatFrom] = useState('');
  const [selectedPropertyNoWadhGhatTo, setSelectedPropertyNoWadhGhatTo] = useState('');
  const [propertyRangeWadhGhatList, setpropertyRangeWadhGhatList] = useState([]);
  const [selectAllWadhGhat, setselectAllWadhGhat] = useState(false);

  //CommRemark
  useEffect(() => {
    const fetchPropertyRangeList = async () => {
      console.log(selectedCommRemarkWard, selectedPropertyNoCommRemarkFrom, selectedPropertyNoCommRemarkTo, 'data common');
      try {
        if (selectedCommRemarkWard && selectedPropertyNoCommRemarkFrom && selectedPropertyNoCommRemarkTo) {
          const propertyRange = await getPropertyRangeFromAndTo(
            selectedCommRemarkWard,
            selectedPropertyNoCommRemarkFrom,
            selectedPropertyNoCommRemarkTo
          );
          console.log(propertyRange, 'coomon list from databse');
          setpropertyRangeCommRemarkList(propertyRange);
        } else {
          setpropertyRangeCommRemarkList([]);
        }
      } catch (error) {
        console.error('Failed to fetch propertyRange:', error);
      }
    };
    fetchPropertyRangeList();
  }, [selectedCommRemarkWard, selectedPropertyNoCommRemarkFrom, selectedPropertyNoCommRemarkTo]);

  //Comm Remark all setselectAllCommRemark
  const handleSelectAllCommRemarkChange = (event) => {
    const checked = event.target.checked;
    setselectAllCommRemark(checked);
  
    if (checked) {
      const allOwnerIds = propertyRangeCommRemarkList.map(item => item.OwnerID);
      setSelectedCommRemarkOwnerIds(allOwnerIds);
    } else {
      setSelectedCommRemarkOwnerIds([]);
    }
  };
  

  //CommRemark

  const handlePropertyCommRemarkChangeTo = async (e) => {
    setSelectedPropertyNoCommRemarkTo(e.target.value);
  };
  //commRemark

  const handlePropertyCommRemarkChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedPropertyNoCommRemarkFrom(e.target.value);
  };
  //Comm Remark All
  const[selectedCommRemarkOwnerIds,setSelectedCommRemarkOwnerIds]=useState([]);

  const handlePropertySelectCommRemarkChange = (event, property) => {
    const checked = event.target.checked;
    const ownerId = property.OwnerID;
  
    setSelectedCommRemarkOwnerIds((prevIds) => {
      let newIds =[...prevIds];
  
      if (checked) {
        newIds.push(ownerId); // prevent duplicates
      } else {
        newIds = prevIds.filter(id => id !== ownerId);
      }
  
      // Update "Select All" dynamically
      if (newIds.length === propertyRangeCommRemarkList.length) {
        setselectAllCommRemark(true);
      } else {
        setselectAllCommRemark(false);
      }
      return newIds;
    });
  };
  //WadhGhat
  const handleWadhGhatWardChange = async (event) => {
    const ward = event.target.value;
    setSelectedWadhGhatWard(ward);
    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setpropertyNoListTo(propertyRange.properties);
      setpropertyNoListFrom(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };
  //WadhGhat
  const handlePropertyWadhGhatChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedPropertyNoWadhGhatFrom(e.target.value);
  };

  //WadhGhat
  const handlePropertyWadhGhatChangeTo = async (e) => {
    setSelectedPropertyNoWadhGhatTo(e.target.value);
  };
  //WadhGhat
    const [selectedWadhGhatOwnerIds, setSelectedWadhGhatOwnerIds] = useState([]);

  const handlePropertySelectWadhGhatChange = (event, property) => {
    const checked = event.target.checked;
    const propertyOwnerId = property.OwnerID;
    // Use the previous state when updating ownerIds to ensure correct updates
    setSelectedWadhGhatOwnerIds((prevOwnerIds) => {
      let newOwnerIds = [...prevOwnerIds];
      if (checked) {
        // Add the selected property's OwnerID to the ownerIds array if checked
        newOwnerIds.push(propertyOwnerId);
      } else {
        // Remove the OwnerID from the ownerIds array if unchecked
        newOwnerIds = newOwnerIds.filter((id) => id !== propertyOwnerId);
      }
      // If all items are selected, set Select All to true
      if (newOwnerIds.length === propertyRangeWadhGhatList.length) {
        setselectAllWadhGhat(true);
      } else {
        setselectAllWadhGhat(false);
      }
      return newOwnerIds;
    });
  };
  //WadhGhat all
  const handleSelectAllWadhGhatChange = (event) => {
    const checked = event.target.checked;
    setselectAllWadhGhat(checked);
  
    if (checked) {
      // 🔥 PURE WARD KI PROPERTIES
      const allOwnerIds = propertyRangeWadhGhatList.map(
        (p) => p.OwnerID
      );
      setSelectedWadhGhatOwnerIds(allOwnerIds);
    } else {
      setSelectedWadhGhatOwnerIds([]);
    }
  };
  
  

  //WadhGhat
  useEffect(() => {
    const fetchPropertyRangeList = async () => {
      console.log(selectedWadhGhatWard, selectedPropertyNoWadhGhatFrom, selectedPropertyNoWadhGhatTo);
      try {
        if (selectedWadhGhatWard && selectedPropertyNoWadhGhatFrom && selectedPropertyNoWadhGhatTo) {
          const propertyRange = await getPropertyRangeFromAndTo(
            selectedWadhGhatWard,
            selectedPropertyNoWadhGhatFrom,
            selectedPropertyNoWadhGhatTo
          );
          console.log(propertyRange, 'wad ghat');
          setpropertyRangeWadhGhatList(propertyRange);
        } else {
          setpropertyRangeWadhGhatList([]);
        }
      } catch (error) {
        console.error('Failed to fetch propertyRange:', error);
      }
    };
    fetchPropertyRangeList();
  }, [selectedWadhGhatWard, selectedPropertyNoWadhGhatFrom, selectedPropertyNoWadhGhatTo]);

  const handleClickDialogShop = () => {
    setOpenDialogShop(true);
  };

  const handleCloseDialogShop = () => {
    setOpenDialogShop(false);
  };
  //dialog Road
  const [openDialogs, setOpenDialogs] = useState(false);
  const handleClickDialogs = () => {
    setOpenDialogs(true);
  };
  const handleCloseDialogs = () => {
    setOpenDialogs(false);
  };
  //dialog property
  const [openDialogProperty, setOpenDialogProperty] = useState(false);
  const handleClickDialogProperty = () => {
    setOpenDialogProperty(true);
  };
  const handleCloseDialogProperty = () => {
    setOpenDialogProperty(false);
  };
  //dialog Wadh
  const [openDialogWadh, setOpenDialogWadh] = useState(false);
  const handleClickDialogWadh = () => {
    setOpenDialogWadh(true);
  };
  const handleCloseDialogWadh = () => {
    setOpenDialogWadh(false);
  };

  // radio
  const [selectedValue, setSelectedValue] = useState();

  const [selectedOverlay, setSelectedOverlay] = useState(null);

  const [errors, setErrors] = useState({});
  const [Names, setNames] = useState({
    OwnerName: '',
    OwnerNameMarathi: ''
  });
  //address
  const [Address, setAddress] = useState({
    Address: '',
    OwnerPatta: ''
  });

  //road
  const [road, setRoad] = useState({
    RoadWidth: ''
  });
  //property Descriptiom
  const [propertyDescrpition, setPropertyDescrpition] = useState({
    PropertyTypeId: 0
  });
  //shop
  const [shop, setShop] = useState({
    BuildingOrShopName: '',
    BuildingOrShopNameMarathi: ''
  });
  //common Remark
  const [commonRemark, setCommonRemark] = useState({
    DirectionEast: '',
    DirectionWest: '',
    DirectionNorth: '',
    DirectionSouth: ''
  });
  //wadhGhat
  const [wadhGhat, setWadhGhat] = useState({
    WadhGhatRemarkOne: '',
    WadhGhatRemarkTwo: ''
  });
  const handleNameChange = (event) => {
    const { name, value } = event.target;

    setNames((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));

    if (name === 'OwnerName') {
      translateText(value)
        .then((translated) => {
          setNames((prevState) => ({
            ...prevState,
            OwnerNameMarathi: translated
          }));
        })
        .catch((err) => {
          console.error('Error translating text:', err);
        });
    }
  };

  //address
  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));

    if (name === 'Address') {
      translateText(value)
        .then((translated) => {
          setAddress((prevState) => ({
            ...prevState,
            OwnerPatta: translated
          }));
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }
    setError({});
  };
  //shop
  const handleShopChange = (event) => {
    const { name, value } = event.target;
    setShop((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));

    if (name === 'BuildingOrShopName') {
      translateText(value)
        .then((translated) => {
          setShop((prevState) => ({
            ...prevState,
            BuildingOrShopNameMarathi: translated
          }));
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }
  };

  //road
  const handleRoadChange = (event) => {
    const { name, value } = event.target;

    // Allow only numeric values
    const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    setRoad((prevDetails) => ({
      ...prevDetails,
      [name]: numericValue
    }));
  };

  //common Remark
  const handleCommonRemarkChange = (event) => {
    const { name, value } = event.target;
    setCommonRemark((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));

    console.error('Error translating text', err);
  };
  //wadhGhat
  const handleWadhGhatChange = (event) => {
    const { name, value } = event.target;
    setWadhGhat((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));

    console.error('Error translating text', err);
  };

  const handlePropChange = (event) => {
    const selectedValue = event.target.value;
    setPropertyDescrpition({
      ...propertyDescrpition,
      PropertyTypeId: selectedValue
    });
  };

  const handleCancelAddressChanges = () => {
    console.log('Cancelling changes...');
    setError({});
    // setshowAddressExitAddress(true);
    setSelectedAddressWard('');
    setshowAddressTable(false);
    setSelectedPropertyNoAddressTo('');
    setSelectedPropertyNoAddressFrom('');
    setSelectedProperties([]);
    setselectAllAddress(false);

    setNameLikeAddressChecked(false);
    setnameLikeAddressWardChecked(false);
    setAddress({
      Address: '',
      OwnerPatta: ''
    });
    setSelectedAddressProperty('');
    setSelectedWardAddressProperty('');
    handleAddressCheckboxChanges();
  };

  //cancel shop button
  const handleCancelChangesShop = () => {
    setSelectedShopWard('');
    setSelectedPropertyNoShopFrom('');
    setSelectedPropertyNoShopTo('');
    setOwnerIds([]);
    setselectAllShop(false);
    setShop({
      BuildingOrShopName: '',
      BuildingOrShopNameMarathi: ''
    });
    setError([]);
  };
  //cancel Common Remark button
  const handleCancelCommonRemark = () => {
    setSelectedCommRemarkWard('');
    setSelectedPropertyNoCommRemarkFrom('');
    setSelectedPropertyNoCommRemarkTo('');
    setselectAllCommRemark(false);
    setOwnerIds([]);
    setCommonRemark({
      DirectionEast: '',
      DirectionWest: '',
      DirectionNorth: '',
      DirectionSouth: ''
    });
    setError([]);
  };
  //cancel wadh ghat button
  const handleCancelWadhGhat = () => {
    setSelectedWadhGhatWard('');
    setSelectedPropertyNoWadhGhatFrom('');
    setSelectedPropertyNoWadhGhatTo('');
    setselectAllWadhGhat(false);
    setOwnerIds([]);
    setWadhGhat({
      WadhGhatRemarkOne: '',
      WadhGhatRemarkTwo: ''
    });
    setError([]);
  };
  //Radio

  const handleRadioChange = (e) => {
    const radioId = e.target.id;
    if (radioId === 'updateOwner') {
      setSelectedOverlay('updateOwner');
    } else if (radioId === 'updateAddress') {
      setSelectedOverlay('updateAddress');
    } else if (radioId === 'UpdateRoad') {
      setSelectedOverlay('UpdateRoad');
    } else if (radioId === 'UpdateShop') {
      setSelectedOverlay('UpdateShop');
    } else if (radioId === 'UpdateCommonRemark') {
      setSelectedOverlay('UpdateCommonRemark');
    } else if (radioId === 'UpdatePropertyType') {
      setSelectedOverlay('UpdatePropertyType');
    } else if (radioId === 'UpdateWadhGhatRemark') {
      setSelectedOverlay('UpdateWadhGhatRemark');
    } else {
      setSelectedOverlay(null);
    }
  };

  //table
  const [showTable, setShowTable] = useState(false);
  const handleShowNamesClick = async () => {
    setShowTable(!showTable);
    try {
      const jointOwnerDetails = await getJointOwnerDetails(selectedProperty);
      console.log('Fetched jointDetails:', jointOwnerDetails); // Log the fetched data
      const fetchedDetails = jointOwnerDetails.data;
      // Wrap the data in an array if it's a single object
      setJointDetails(Array.isArray(fetchedDetails) ? fetchedDetails : [fetchedDetails]);
    } catch (error) {
      console.error('Error fetching joint owner details:', error);
    }
  };

  //      exting

  const [showExitNames, setShowExitNames] = useState(false);
  // const handleShowExitingNames = async () => {
  //   setShowExitNames(!showExitNames);
  //   try {
  //     const response = await getOwnerNames(selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);
  //     console.log('responseee:', response);

  //     // Assuming response contains ownerNameResults and JointResults as in your example
  //     if (response) {
  //       setOwnerDetails(response.mergedResults || []);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch wards:', error);
  //   }
  // };

  const handleShowExitingNames = async () => {
    try {
      // Backend se full list lao
      const response = await getOwnerNames(
        selectedWard,
        selectedPropertyNoFrom,
        selectedPropertyNoTo
      );
  


      if (!response) return;
  
      const allData = response.mergedResults || [];
  
      console.log("allDataaa", allData);
setShowExitNames(true);
setOwnerDetails(allData);
      // CASE 1: If ALL is selected → show all data
//       if (selectAll) {
//         setOwnerDetails(allData);
//       } 
//       // CASE 2: If some checkboxes selected → filter
//       else {
//         const filtered = allData.filter((item) =>
//           ownerIds.includes(item.OwnerID)
//         );
// console.log("filteredaaa", filtered);

//         setOwnerDetails(filtered);
//       }
  
      
// console.log("ownerIdsaaa", ownerIds);
// console.log("selectAllaaa", selectAll);
//       setShowExitNames(true);
    } catch (error) {
      console.error("Failed to fetch owners:", error);
    }
  };
  
  
  const validateFieldAddress = () => {
    const newErrors = {};
    console.log('Validating fields...');

    // Ensure at least one checkbox is selected
    if (!nameLikeAddressChecked && !nameLikeAddressWardChecked) {
      console.log('No checkbox selected.');
      newErrors.checkbox = 'Please select at least one option.';
    }

    // Validation for `nameLikeAddressChecked`
    if (nameLikeAddressChecked) {
      console.log('Validating for nameLikeAddressChecked...');
      if (!Address?.OwnerPatta) {
        console.log('OwnerPatta is missing.');
        newErrors.OwnerPatta = 'OwnerPatta is required';
      }
      if (!Address?.Address) {
        console.log('Address is missing.');
        newErrors.Address = 'Address is required';
      }
    }

    // Validation for `nameLikeAddressWardChecked`
    if (nameLikeAddressWardChecked) {
      console.log('Validating for nameLikeAddressWardChecked...');
      if (!selectedWardAddressProperty) {
        console.log('selectedWardAddressProperty is missing.');
        newErrors.selectedWardAddressProperty = 'Please select a ward for property to copy address.';
      }
      if (!selectedPropertyAddress) {
        console.log('selectedPropertyAddress is missing.');
        newErrors.selectedPropertyAddress = 'Select a property for selected ward.';
      }
    }

    // Common validations (independent of checkboxes)
    if (!selectedAddressWard) {
      console.log('selectedAddressWard is missing.');
      newErrors.selectedAddressWard = 'Please select a ward to get the property range.';
    }

    if (!selectedPropertyNoAddressFrom) {
      console.log('selectedPropertyNoAddressFrom is missing.');
      newErrors.selectedPropertyNoAddressFrom = 'Property No (From) is required.';
    }

    if (!selectedPropertyNoAddressTo) {
      console.log('selectedPropertyNoAddressTo is missing.');
      newErrors.selectedPropertyNoAddressTo = 'Property No (To) is required.';
    }

    if (
      selectedPropertyNoAddressFrom &&
      selectedPropertyNoAddressTo &&
      Number(selectedPropertyNoAddressFrom) > Number(selectedPropertyNoAddressTo)
    ) {
      console.log('Invalid property range: From > To.');
      newErrors.propertyRangeAddressList = 'Property range is invalid (From must be <= To).';
    }

    if (!propertyRangeAddressList.length) {
      console.log('propertyRangeList is empty.');
      newErrors.propertyRangeAddressList = 'Property range list cannot be empty.';
    }

    // Log errors
    console.log('Validation errors:', newErrors);

    // Update the error state
    setError(newErrors);

    // Return true if no errors
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid);
    return isValid;
  };

  const validateFieldOwnerNames = () => {
    const newErrors = {};
    // If Name Like is checked, validate OwnerName fields
    if (nameLikeChecked) {
      if (!Names?.OwnerName) {
        newErrors.OwnerName = 'Owner Name is required.';
      }
      if (!Names?.OwnerNameMarathi) {
        newErrors.OwnerNameMarathi = 'Owner Name (Marathi) is required.';
      }
    }

    if (nameLikeWardChecked) {
      if (!selectedProperty) {
        newErrors.selectedProperty = 'Please select a property.';
      }
      if (!selectedWardProperty) {
        newErrors.selectedWardProperty = 'Please select a ward.';
      }
    }

    if (!selectedWard) {
      newErrors.selectedWard = 'Please select a ward.';
    }
    if (!selectedPropertyNoFrom) {
      newErrors.selectedPropertyNoFrom = 'Property No (From) is required.';
    }
    if (!selectedPropertyNoTo) {
      newErrors.selectedPropertyNoTo = 'Property No (To) is required.';
    }
    if (selectedPropertyNoFrom && selectedPropertyNoTo && Number(selectedPropertyNoFrom) > Number(selectedPropertyNoTo)) {
      newErrors.propertyRange = 'Invalid property range: From must be <= To.';
    }
    if (!propertyRangeList.length) {
      newErrors.propertyRangeList = 'Property range list cannot be empty.';
    }

    // Set the validation errors in the state
    setError(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // const handleApplyChanges = async () => {
  //   if (!validateFieldOwnerNames()) return;

  //   try {
  //     const jointOwner = jointDetails[0];
  //     const requestData = {
  //       ownerIDs: ownerIds,
  //       ownerName: nameLikeChecked ? Names?.OwnerName : jointOwner?.OwnerName,
  //       ownerNameMarathi: nameLikeChecked ? Names?.OwnerNameMarathi : jointOwner?.OwnerNameMarathi,
  //       wardNo: selectedWard,
  //       fromPropertyNo: selectedPropertyNoFrom,
  //       toPropertyNo: selectedPropertyNoTo,
  //       user: userData

  //     };

  //     console.log('Data to update:', requestData);

  //     const response = await saveOwnerNames(requestData);

  //     setOwnerDetails(response.combinedOwnerList);
  //     setSnackbarSeverityOwner('success');
  //     setSnackbarMessageOwner(response?.message || 'Owner saved successfully!');
  //     setSnackbarOpenOwner(true);
  //     handleCancelChange();
  //   } catch (error) {
  //     console.error('Error in handleApplyChanges:', error); // Add this
  //     if (error.inner) {
  //       error.inner.forEach((error) => {
  //         validationErrors[error.path] = error.message;
  //       });
  //       setErrors(validationErrors);
  //     }
  //     console.error('Error updating Owner Names:', error);
  //     setSnackbarMessageShop(error?.response?.data?.error || 'An unexpected error occurred. Please try again.');
  //     setSnackbarOpenShop(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //Address
  // const handleApplyChangesAddress = async () => {
  //   console.log('Starting handleApplyChangesAddress...');

  //   // Step 1: Validate fields
  //   const isValid = validateFieldAddress();
  //   if (!isValid) {
  //     console.log('Validation failed. Aborting apply changes.');
  //     return; // Stop further execution if validation fails
  //   }
  //   try {
  //     const jointOwner = jointDetailsAddress[0];
  //     const requestData = {
  //       ownerIDs: selectedAddressOwnerIds,
  //       Address: nameLikeAddressChecked ? Address?.Address : jointOwner?.Address,
  //       OwnerPatta: nameLikeAddressChecked ? Address?.OwnerPatta : jointOwner?.OwnerPatta,
  //       wardNo: selectedAddressWard,
  //       fromPropertyNo: selectedPropertyNoAddressFrom,
  //       toPropertyNo: selectedPropertyNoAddressTo,
  //       user: userData

  //     };
  //     console.log('Data to update:', requestData);

  //     // Send the formatted data to the API
  //     const response = await saveAddress(requestData);
  //     console.log(' updated response:', response);
  //     setAddressDetails(response.res.data.combinedOwnerList);
  //     setSnackbarSeverityAddress('success');
  //     setSnackbarMessageAddress(response?.message || 'Address saved successfully!');
  //     setSnackbarOpenAddress(true);
  //     handleCancelAddressChanges();
  //   } catch (error) {
  //     err.inner.forEach((error) => {
  //       validationErrors[error.path] = error.message;
  //     });
  //     setErrors(validationErrors);
  //     console.error('Error updating RoadWidth:', error);
  //     setSnackbarMessageShop(error?.response?.data?.error || 'An unexpected error occurred. Please try again.');
  //     setSnackbarOpenShop(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const handleApplyChanges = async () => {
    if (!validateFieldOwnerNames()) return;

    try {
      const jointOwner = jointDetails[0];
      const requestData = {
      //   ownerIDs: selectedPropertyOwnerIds,
      //   ownerName: nameLikeChecked ? Names?.OwnerName : jointOwner?.OwnerName,
      //   ownerNameMarathi: nameLikeChecked ? Names?.OwnerNameMarathi : jointOwner?.OwnerNameMarathi,
      //   wardNo: selectedWard,
      //   fromPropertyNo: selectedPropertyNoFrom,
      //   toPropertyNo: selectedPropertyNoTo,
      //   user: userData

      
      ownerIDs: selectedPropertyOwnerIds,
        ownerName: nameLikeChecked ? Names?.OwnerName : jointOwner?.OwnerName,
               ownerNameMarathi: nameLikeChecked ? Names?.OwnerNameMarathi : jointOwner?.OwnerNameMarathi,

        wardNo: selectedWard,
      fromPropertyNo: selectedPropertyNoFrom,
      toPropertyNo: selectedPropertyNoTo,
      user: userData
      };
      console.log('Data to update:', requestData);

      const response = await saveOwnerNames(requestData);

      setOwnerDetails(response.combinedOwnerList);
      setSnackbarSeverityOwner('success');
      setSnackbarMessageOwner(response?.message || 'Owner saved successfully!');
      setSnackbarOpenOwner(true);
      handleCancelChange();
    } catch (error) {
      console.error('Error in handleApplyChanges:', error); // Add this
      if (error.inner) {
        error.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      console.error('Error updating Owner Names:', error);
      setSnackbarMessageShop(error?.response?.data?.error || 'An unexpected error occurred. Please try again.');
      setSnackbarOpenShop(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApplyChangesAddress = async () => {
    const isValid = validateFieldAddress();
    if (!isValid) return;
  
    try {
      const jointOwner = jointDetailsAddress[0];
  
      const requestData = {
        ownerIDs: selectedAddressOwnerIds,
        Address: nameLikeAddressChecked ? Address?.Address : jointOwner?.Address,
        OwnerPatta: nameLikeAddressChecked ? Address?.OwnerPatta : jointOwner?.OwnerPatta,
        user: userData
      };
  
      const response = await saveAddress(requestData);
  
      const updatedList = response?.res?.data?.combinedOwnerList || [];
  
      // ✅ MERGE updated rows into existing full list
      setAddressDetails(prevList =>
        prevList.map(item => {
          const updatedItem = updatedList.find(
            u => u.OwnerID === item.OwnerID
          );
          return updatedItem ? updatedItem : item;
        })
      );
  
      setSnackbarSeverityAddress("success");
      setSnackbarMessageAddress("Address updated successfully!");
      setSnackbarOpenAddress(true);
  
      // ✅ Clear selection only (NOT table)
      setSelectedAddressOwnerIds([]);
      setselectAllAddress(false);
  
    } catch (error) {
      console.error("Address update error:", error);
      setSnackbarSeverityAddress("error");
      setSnackbarMessageAddress(
        error?.response?.data?.error || "Unexpected error"
      );
      setSnackbarOpenAddress(true);
    }
  };
  
  
  // const handleApplyChangesAddress = async () => {
  //   const isValid = validateFieldAddress();
  //   if (!isValid) return;
  
  //   try {
  //     const jointOwner = jointDetailsAddress[0];
  
  //     const requestData = {
  //       ownerIDs: selectedAddressOwnerIds,
  //       Address: nameLikeAddressChecked ? Address?.Address : jointOwner?.Address,
  //       OwnerPatta: nameLikeAddressChecked ? Address?.OwnerPatta : jointOwner?.OwnerPatta,
  //       user: userData
  //     };
  
  //     console.log("Data to update:", requestData);
  
  //     const response = await saveAddress(requestData);
  //     const results = response?.res?.data?.combinedOwnerList || [];
  
  //     setAddressDetails(results);
  //     setSnackbarSeverityAddress("success");
  //     setSnackbarMessageAddress("Address updated successfully!");
  //     setSnackbarOpenAddress(true);
  
  //     handleCancelAddressChanges();
  //   } catch (error) {
  //     console.error("Address update error:", error);
  //     setSnackbarMessageAddress(
  //       error?.response?.data?.error || "Unexpected error"
  //     );
  //     setSnackbarOpenAddress(true);
  //   }
  // };
  
  //shop
  const handleApplyChangesShop = async () => {
    if (!validateFieldsShop()) return;

    try {
      // const jointOwner = jointDetailsShop[0];
      const requestData = {
        ownerIDs: selectedShopOwnerIds,
        BuildingOrShopName: shop.BuildingOrShopName,
        BuildingOrShopNameMarathi: shop.BuildingOrShopNameMarathi,
        wardNo: selectedShopWard,
        fromPropertyNo: selectedPropertyNoShopFrom,
        toPropertyNo: selectedPropertyNoShopTo,
        user: userData

      };
      console.log('Data to update:', requestData);

      // Send the formatted data to the API
      const response = await saveShop(requestData);

      console.log(response);
      // setExistingPropertyShop(response.res.data.combinedResults);
      setExistingPropertyShop(prev =>
        prev.map(row => {
          const shouldUpdate =
            selectAllShop ||
            selectedShopOwnerIds.includes(row.OwnerID);
      
          return shouldUpdate
            ? {
                ...row,
                BuildingOrShopName: shop.BuildingOrShopName,
                BuildingOrShopNameMarathi: shop.BuildingOrShopNameMarathi,
              }
            : row;
        })
      );
      
      setSnackbarSeverityShop('success');
      setSnackbarMessageShop(response?.message || 'Shop saved successfully!');
      setSnackbarOpenShop(true);
      console.log(ShopDetails);
      handleCancelChangesShop();
    } catch (error) {
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      console.error('Error updating owner names:', error);
      setSnackbarMessageShop(err?.response?.data?.error || 'An unexpected error occurred. Please try again.');
      setSnackbarOpenShop(true);
    } finally {
      setLoading(false);
    }
  };
  //Validation

  const validateFieldsCommonRemark = () => {
    const newErrors = {};

    // Validate WadhGhat remarks
    if (!commonRemark.DirectionEast && !commonRemark.DirectionWest && !commonRemark.DirectionNorth && !commonRemark.DirectionSouth) {
      newErrors.DirectionEast = 'DirectionEast is required';
      newErrors.DirectionWest = 'DirectionEast is required';
      newErrors.DirectionNorth = 'DirectionNorth is required';
      newErrors.DirectionSouth = 'DirectionSouth is required';
    }
    // Validate selected ward
    if (!selectedCommRemarkWard) {
      newErrors.selectedCommRemarkWard = 'Please select a ward for WadhGhat';
    }

    // Validate property range (From and To)
    if (!selectedPropertyNoCommRemarkFrom) {
      newErrors.selectedPropertyNoCommRemarkFrom = 'Property No (From) is required';
    }
    if (!selectedPropertyNoCommRemarkTo) {
      newErrors.selectedPropertyNoCommRemarkTo = 'Property No (To) is required';
    }
    if (
      selectedPropertyNoCommRemarkFrom &&
      selectedPropertyNoCommRemarkTo &&
      Number(selectedPropertyNoCommRemarkFrom) > Number(selectedPropertyNoCommRemarkTo)
    ) {
      newErrors.propertyRange = 'Property range is invalid (From must be <= To)';
    }
    // No specific validation for selectAllWadhGhat unless required
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //common remark apply

  const handleApplyChangesCommonRemark = async () => {
    if (!selectAllCommRemark && selectedCommRemarkOwnerIds.length === 0) {
      setSnackbarSeverityCommonRemark('error');
      setSnackbarMessageCommonRemark('Please select at least one property.');
      setSnackbarOpenCommonRemark(true);
      return;
    }
  
    if (!validateFieldsCommonRemark()) return;
  
    setLoading(true);
  
    try {
      const requestData = {
        ownerIDs: selectedCommRemarkOwnerIds,
        DirectionEast: commonRemark.DirectionEast,
        DirectionWest: commonRemark.DirectionWest,
        DirectionNorth: commonRemark.DirectionNorth,
        DirectionSouth: commonRemark.DirectionSouth,
        wardNo: selectedCommRemarkWard,
        fromPropertyNo: selectedPropertyNoCommRemarkFrom,
        toPropertyNo: selectedPropertyNoCommRemarkTo,
        user: userData,
      };
  
      console.log('Data to update:', requestData);
  
      // Send the formatted data to the API
      const response = await saveCommonRemark(requestData);
  
      // ✅ Merge updated rows with existing rows
      setExistingCommonRemarkDetails(prev =>
        prev.map(row => {
          const shouldUpdate =
            selectAllCommRemark ||
            selectedCommRemarkOwnerIds.includes(row.OwnerID);
      
          return shouldUpdate
            ? {
                ...row,
                DirectionEast: commonRemark.DirectionEast,
                DirectionWest: commonRemark.DirectionWest,
                DirectionNorth: commonRemark.DirectionNorth,
                DirectionSouth: commonRemark.DirectionSouth,
              }
            : row;
        })
      );
      
  
      setSnackbarSeverityCommonRemark('success');
      setSnackbarMessageCommonRemark(response?.message || 'Common Remark saved successfully!');
      setSnackbarOpenCommonRemark(true);
  
      handleCancelCommonRemark();
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      console.error('Error updating owner names:', err);
      setSnackbarMessageCommonRemark(err?.response?.data?.error || 'An unexpected error occurred. Please try again.');
      setSnackbarOpenCommonRemark(true);
    } finally {
      setLoading(false);
    }
  };
  
  const validateFieldsRoadwidth = () => {
    const newErrors = {};

    if (nameLikeRoadChecked) {
      // Validate RoadWidth
      if (!road.RoadWidth) {
        newErrors.RoadWidth = 'RoadWidth  is required';
      }
    }

    if (nameLikeRoadWardChecked) {
      if (!selectedWardRoadProperty) {
        newErrors.selectedWardRoadProperty = 'selected Ward for property cannot be empty';
      }
      if (!selectedPropertyRoad) {
        newErrors.selectedPropertyRoad = 'selected Property for ward cannot be empty';
      }
    }
    // Validate selected ward
    if (!selectedRoadWard) {
      newErrors.selectedRoadWard = 'Please select a ward for RoadWidth';
    }

    // Validate property range (From and To)
    if (!selectedPropertyNoRoadFrom) {
      newErrors.selectedPropertyNoRoadFrom = 'Property No (From) is required';
    }
    if (!selectedPropertyNoRoadTo) {
      newErrors.selectedPropertyNoRoadTo = 'Property No (To) is required';
    }
    if (!selectedPropertyNoRoadFrom && !selectedPropertyNoRoadTo && Number(selectedPropertyNoRoadFrom) > Number(selectedPropertyNoRoadTo)) {
      newErrors.propertyRangeRoadList = 'Property range is invalid (From must be <= To)';
    }

    // Validate property list
    if (!propertyRangeRoadList.length) {
      newErrors.propertyRangeRoadList = 'Property range list cannot be empty';
    }

    // No specific validation for selectAllWadhGhat unless required
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Wadh Ghat apply
  const handleApplyChangesWadhGhat = async () => {
    if (!selectAllWadhGhat && selectedWadhGhatOwnerIds.length === 0) {
      setSnackbarSeverityWadhGhat('error');
      setSnackbarMessageWadhGhat('Please select at least one property.');
      setSnackbarOpenWadhGhat(true);
      return; // ⛔ STOP HERE
    }
    if (!validateFieldsWadhGhat()) return;

    setLoading(true);
    try {
      const requestData = {
        ownerIDs: selectedWadhGhatOwnerIds,
        WadhGhatRemarkOne: wadhGhat.WadhGhatRemarkOne,
        WadhGhatRemarkTwo: wadhGhat.WadhGhatRemarkTwo,

        wardNo: selectedWadhGhatWard,
        fromPropertyNo: selectedPropertyNoWadhGhatFrom,
        toPropertyNo: selectedPropertyNoWadhGhatTo,
                user: userData

      };
      console.log('Data to update:', requestData);

      // Send the formatted data to the API
      const response = await saveWadhGhat(requestData);

      console.log(response);

      // setWadhGhatDetails(response.res.data.combinedResults);
          setWadhGhatDetails(prevList =>
        prevList.map(row =>
          selectedWadhGhatOwnerIds.includes(row.OwnerID)
            ? {
                ...row,
                WadhGhatRemarkOne: wadhGhat.WadhGhatRemarkOne,
                WadhGhatRemarkTwo: wadhGhat.WadhGhatRemarkTwo,
              }
            : row
        )
      );
      setSnackbarSeverityWadhGhat('success');
      setSnackbarMessageWadhGhat(response?.message || 'Wadh Ghat saved successfully!');
      setSnackbarOpenWadhGhat(true);

      // handleCancelWadhGhat();
    } catch (error) {
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);

        console.error('Error updating owner names:', error);
        setSnackbarMessageWadhGhat(err?.response?.data?.error || 'An unexpected error occurred. Please try again.');
        setSnackbarOpenWadhGhat(true);
      }
    } finally {
      setLoading(false);
    }
  };
  //validate description
  const validatePropertyDescription = () => {
    const newErrors = {};

    if (nameLikePropertyChecked) {
      // Validate RoadWidth
      if (!propertyDescrpition.PropertyTypeId) {
        newErrors.PropertyTypeId = 'propertyDescrpition  is required';
      }
    }

    if (nameLikePropertyWardChecked) {
      if (!selectedPropertyList) {
        newErrors.selectedPropertyList = 'selected Ward for property Type ID cannot be empty';
      }
      if (!selectedPropertyDesc) {
        newErrors.selectedPropertyDesc = 'selected Property for ward cannot be empty';
      }
    }
    // Validate selected ward
    if (!selectedPropertyWards) {
      newErrors.selectedPropertyWards = 'Please select a ward for Property Description';
    }

    // Validate property range (From and To)
    if (!selectedPropertyNosFrom) {
      newErrors.selectedPropertyNosFrom = 'Property No (From) is required';
    }
    if (!selectedPropertyNoPropTo) {
      newErrors.selectedPropertyNoPropTo = 'Property No (To) is required';
    }
    if (selectedPropertyNosFrom && selectedPropertyNoPropTo && Number(selectedPropertyNoRoadFrom) > Number(selectedPropertyNoRoadTo)) {
      newErrors.propertyRange = 'Property range is invalid (From must be <= To)';
    }

    // Validate property list
    if (!propertyRangePropList.length) {
      newErrors.propertyRangePropList = 'Property range list cannot be empty';
    }

    // No specific validation for selectAllWadhGhat unless required
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Validation Shop
  const validateFieldsShop = () => {
    const newErrors = {};

    // Validate BuildingOrShopName
    if (!shop.BuildingOrShopName && !shop.BuildingOrShopNameMarathi) {
      newErrors.BuildingOrShopName = 'Please Enter  BuildingOrShopName  is required';
      newErrors.BuildingOrShopNameMarathi = 'Please Enter  BuildingOrShopNameMarathi  is required';
    }
    // Validate selected ward
    if (!selectedShopWard) {
      newErrors.selectedShopWard = 'Please select a ward for BuildingOrShopName';
    }

    // Validate property range (From and To)
    if (!selectedPropertyNoShopFrom) {
      newErrors.selectedPropertyNoShopFrom = 'Property No (From) is required';
    }
    if (!selectedPropertyNoShopTo) {
      newErrors.selectedPropertyNoShopTo = 'Property No (To) is required';
    }
    if (selectedPropertyNoShopFrom && selectedPropertyNoShopTo && Number(selectedPropertyNoShopFrom) > Number(selectedPropertyNoShopTo)) {
      newErrors.propertyRange = 'Property range is invalid (From must be <= To)';
    }

    // Validate property list
    if (!propertyRangeShopList.length) {
      newErrors.propertyRangeShopList = 'Property range list cannot be empty';
    }

    // No specific validation for selectAllWadhGhat unless required
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // const handleApplyChangesRoad = async () => {
  //   try {
  //     const jointOwner = jointDetailsRoad[0];
  
  //     const requestData = {
  //       ownerIDs: selectedRoadOwnerIds,
  //       RoadWidth: nameLikeRoadChecked
  //         ? road?.RoadWidth
  //         : jointOwner?.RoadWidth,
  //       user: userData
  //     };
  
  //     console.log("Data to update road:", requestData);
  
  //     const response = await saveRoad(requestData);
  
  //     const combinedResults =
  //       response?.combinedResults ||
  //       response?.res?.data?.combinedResults ||
  //       [];
  
  //     // Selected wale hi show karo
  //     const filtered = combinedResults.filter(item =>
  //       selectedRoadOwnerIds.includes(item.OwnerID)
  //     );
  
  //     setRoadDetails(filtered);
  
  //     setSnackbarSeverityRoad("success");
  //     setSnackbarMessageRoad("Road Width Updated Successfully");
  //     setSnackbarOpenRoad(true);
  
  //     handleCancelRoad();
  //   } catch (error) {
  //     console.error("Error updating RoadWidth:", error);
  //   }
  // };
  const handleApplyChangesRoad = async () => {
    try {
      if (!selectedRoadOwnerIds || selectedRoadOwnerIds.length === 0) {
        setSnackbarSeverityRoad("error");
        setSnackbarMessageRoad("Please select at least one property");
        setSnackbarOpenRoad(true);
        return;
      }
  
      const jointOwner = jointDetailsRoad?.[0];
  
      const requestData = {
        ownerIDs: selectedRoadOwnerIds,
        RoadWidth: nameLikeRoadChecked
          ? road?.RoadWidth
          : jointOwner?.RoadWidth,
        user: userData
      };
  
      console.log("Data to update road:", requestData);
  
      // ✅ CORRECT CALL
      const response = await saveRoad(requestData);
  
      const combinedResults =
        response?.combinedResults ||
        response?.res?.data?.combinedResults ||
        [];
  
      setRoadDetails(prevList => {
        const map = new Map();
  
        prevList.forEach(item => {
          map.set(item.OwnerID, item);
        });
  
        combinedResults.forEach(item => {
          map.set(item.OwnerID, {
            ...map.get(item.OwnerID),
            ...item
          });
        });
  
        return Array.from(map.values());
      });
  
      setSnackbarSeverityRoad("success");
      setSnackbarMessageRoad("Road Width Updated Successfully");
      setSnackbarOpenRoad(true);
  
      setSelectedRoadOwnerIds([]);
      setselectAllRoad(false);
  
    } catch (error) {
      console.error("Error updating RoadWidth:", error);
      setSnackbarSeverityRoad("error");
      setSnackbarMessageRoad("Failed to update Road Width");
      setSnackbarOpenRoad(true);
    }
  };
  
  
 
  
  const handleCancelRoad = () => {
    setSelectedRoadWard('');
    setSelectedPropertyNoRoadFrom('');
    setSelectedPropertyNoRoadTo('');
    setselectAllRoad(false);
    setnameLikeRoadChecked(false);
    setnameLikeRoadWardChecked(false);
    setSelectedWardRoadProperty('');
    setSelectedPropertyRoad('');
    setshowRoadTable(false);
    setOwnerIds([]);
    setRoad({
      RoadWidth: ''
    });
    // Optionally close the dialog or snackbar
    setSnackbarOpenRoad(false);
    //handleRoadCheckboxChanges();
    setnameLikeRoadChecked(false);
    setError({});
  };
  //cancel prop desc
  const handleCancelPropDesc = () => {
    setSelectedPropertyList('');
    setSelectedPropertyWards('');
    setSelectedPropertyNosFrom('');
    setSelectedPropertyNoPropTo('');
    setselectAllProp(false);
    setSelectedPropertyDesc('');
    setOwnerIds([]);
    setshowPropertyTable(false);
    setnameLikePropertyChecked(false);
    setnameLikePropertyWardChecked(false);
    setError({});
    setPropertyDescrpition({
      PropertyTypeId: ''
    });
  };
  //property Descrpition
  //property Descrpition
  const handleApplyChangesPropDesc = async () => {
    if (!validatePropertyDescription()) return;
    try {
      const jointOwner = jointDetailsDescription[0];
      console.log(jointDetailsDescription, 'ala');
      const requestData = {
        ownerIDs: selectedPropertyOwnerIds,
        PropertyTypeId: nameLikePropertyChecked ? propertyDescrpition?.PropertyTypeId : jointOwner?.PropertyTypeID,
        wardNo: selectedPropertyWards,
        fromPropertyNo: selectedPropertyNosFrom,
        toPropertyNo: selectedPropertyNoPropTo,
         user: userData

      };
      console.log('Data to update:', requestData);

      // Send the formatted data to the API
      const response = await savePropertyDesc(requestData);
      console.log('resp', response);
      setExistingPropertyDescriptionShow(response.res.data.combinedResults);
      setSnackbarSeverityProDesc('success');
      setSnackbarMessageProDesc(response?.message || 'Common Remark saved successfully!');
      setSnackbarOpenProDesc(true);
      handleCancelPropDesc();
    } catch (error) {
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      console.error('Error updating propert description:', error);
      setSnackbarMessageShop(error?.response?.data?.error || 'An unexpected error occurred. Please try again.');
      setSnackbarOpenShop(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle checkbox change for first accordion
  // const handleCheckboxChangesNameLike = (event) => {
  //   setNameLikeChecked(event.target.checked);
  // };

  // Handle checkbox change for second accordion
  // const handleCheckboxChangesNameLikeWard = (event) => {
  //   setNameLikeWardChecked(event.target.checked);
  // };
  const [nameLikeChecked, setNameLikeChecked] = useState(false);
  const [nameLikeWardChecked, setNameLikeWardChecked] = useState(false);

  //property
  const [selectedOwnerNumbers, setselectedOwnerNumbers] = useState([]);

  const handleOwnerNumberChange = (event) => {
    setselectedOwnerNumbers(event.target.value);
  };
  //to pro
  const [selectedOwnerNumbersTo, setselectedOwnerNumbersTo] = useState([]);

  const handleOwnerNumberChangeTo = (event) => {
    setselectedOwnerNumbersTo(event.target.value);
  };

  //ward

  const handleWardChange = async (event) => {
    const ward = event.target.value;
    setSelectedWard(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setpropertyNoListTo(propertyRange.properties);
      setpropertyNoListFrom(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };

  const handleAddressWardChange = async (event) => {
    const ward = event.target.value;
    setSelectedAddressWard(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setpropertyNoListTo(propertyRange.properties);
      setpropertyNoListFrom(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };
  //road
  const handleRoadWardChange = async (event) => {
    const ward = event.target.value;
    setSelectedRoadWard(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setpropertyNoListTo(propertyRange.properties);
      setpropertyNoListFrom(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };
  //Property
  const handlePropertyWardChange = async (event) => {
    const ward = event.target.value;
    setSelectedPropertyWards(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setpropertyNoListTo(propertyRange.properties);
      setpropertyNoListFrom(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };

  const handleWardChangeProperty = async (event) => {
    const ward = event.target.value;
    setSelectedWardProperty(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setPropertyNoList(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };
  //address
  const handleWardChangeAddressProperty = async (event) => {
    const ward = event.target.value;
    setSelectedWardAddressProperty(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setPropertyNoAddressList(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }

    setError({});
  };

  //Road
  const handleWardChangeRoadProperty = async (event) => {
    const ward = event.target.value;
    setSelectedWardRoadProperty(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setPropertyNoRoadList(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };
  //prop List
  const handleChangePropertyList = async (event) => {
    const ward = event.target.value;
    setSelectedPropertyList(ward);

    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
      console.log('propertyRange:', propertyRange);
      setPropertyNoPropertyList(propertyRange.properties);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };

  //table

  const [selectedAddressOwnerIds, setSelectedAddressOwnerIds] = useState([]);
  const [showAddressTable, setshowAddressTable] = useState(false);
  const handleShowAddressClick = async () => {
    setshowAddressTable(!showAddressTable);
    try {
      const jointOwnerDetails = await getJointOwnerDetails(selectedPropertyAddress);
      console.log('Fetched jointDetails:', jointOwnerDetails); // Log the fetched data
      const fetchedDetails = jointOwnerDetails.data;
      // Wrap the data in an array if it's a single object
      setJointDetailsAddress(Array.isArray(fetchedDetails) ? fetchedDetails : [fetchedDetails]);
    } catch (error) {
      console.error('Error fetching joint owner details:', error);
    }
  };
  
  
  //show exting

  const [showAddressExitAddress, setshowAddressExitAddress] = useState(false);
  // const handleToggleExitAddress = async () => {
  //   setshowAddressExitAddress(!showAddressExitAddress);
  
  //   try {
  //     const response = await getOwnerNames(
  //       selectedAddressWard,
  //       selectedPropertyNoAddressFrom,
  //       selectedPropertyNoAddressTo
  //     );
  
  //     const allData = response?.mergedResults || [];
  
  //     let finalData = [];
  
  //     // CASE 1: All selected → full list
  //     if (selectAllAddress) {
  //       finalData = allData;
  //     }
  
  //     // CASE 2: Checkbox se selected Owners → only those
  //     else if (selectedAddressOwnerIds.length > 0) {
  //       finalData = allData.filter(item =>
  //         selectedAddressOwnerIds.includes(item.OwnerID)
  //       );
  //     }
  
  //     else {
  //       finalData = [];
  //     }
  
  //     setAddressDetails(finalData);
  
  //   } catch (error) {
  //     console.error("Failed to fetch address data:", error);
  //   }
  // };
  
  

  //name Like
 
  const handleToggleExitAddress = async () => {
    setshowAddressExitAddress(prev => !prev);
  
    try {
      const response = await getOwnerNames(
        selectedAddressWard,
        selectedPropertyNoAddressFrom,
        selectedPropertyNoAddressTo
      );
  
      const allData = response?.mergedResults || [];
  
      // ✅ ALWAYS show full range
      setAddressDetails(allData);
  
  
    } catch (error) {
      console.error("Failed to fetch address data:", error);
    }
  };
  
 
  const [nameLikeAddressChecked, setNameLikeAddressChecked] = useState(false);

  // const handleAddressCheckboxChanges = (event) => {
  //   setNameLikeAddressChecked(event.target.checked);
  //   if (event.target.checked) {
  //     setnameLikeAddressWardChecked(false); // Uncheck the other checkbox
  //   }
  // };

  const handleAddressCheckboxChanges = (event) => {
    if (!event) {
      // Cancel / reset case
      setNameLikeAddressChecked(false);
      setnameLikeAddressWardChecked(false);
      return;
    }
  
    const checked = event.target.checked;
    setNameLikeAddressChecked(checked);
  
    if (checked) {
      setnameLikeAddressWardChecked(false);
    }
  };
  
  const handleCheckboxChangesAddressWard = (event) => {
    setnameLikeAddressWardChecked(event.target.checked);
    if (event.target.checked) {
      setNameLikeAddressChecked(false); // Uncheck the other checkbox
    }
  };
  //wardLike
  const [nameLikeAddressWardChecked, setnameLikeAddressWardChecked] = useState(false);

  //table
  const [showRoadTable, setshowRoadTable] = useState(false);
  const handleShowRoadClick = async () => {
    setshowRoadTable(!showRoadTable);
    try {
      const jointOwnerDetails = await getJointOwnerDetails(selectedPropertyRoad);
      console.log('Fetched jointDetails:', jointOwnerDetails); // Log the fetched data
      const fetchedDetails = jointOwnerDetails.data;
      // Wrap the data in an array if it's a single object
      setJointDetailsRoad(Array.isArray(fetchedDetails) ? fetchedDetails : [fetchedDetails]);
    } catch (error) {
      console.error('Error fetching joint owner details:', error);
    }
  };
  //show exting

  const [showExitRoad, setshowExitRoad] = useState(false);
  // const handleToggleExitRoad = async () => {
  //   setshowExitRoad(!showExitRoad);
  
  //   try {
  //     const response = await getOwnerNames(
  //       selectedRoadWard,
  //       selectedPropertyNoRoadFrom,
  //       selectedPropertyNoRoadTo
  //     );
  
  //     const allData = response?.mergedResults || [];
  
  //     let finalData = [];
  
  //     if (selectAllRoad) {
  //       finalData = allData;
  //     } else {
  //       finalData = allData.filter((item) =>
  //         selectedRoadOwnerIds.includes(item.OwnerID)
  //       );
  //     }
  
  //     setRoadDetails(finalData);
  //   } catch (error) {
  //     console.error("Failed to fetch road width:", error);
  //   }
  // };
  const handleToggleExitRoad = async () => {
  setshowExitRoad(prev => !prev);

  try {
    const response = await getOwnerNames(
      selectedRoadWard,
      selectedPropertyNoRoadFrom,
      selectedPropertyNoRoadTo
    );

    const allData = response?.mergedResults || [];

    // ✅ ALWAYS full list
    setRoadDetails(allData);

  } catch (error) {
    console.error("Failed to fetch road width:", error);
  }
};

  
  //shop show Button
  const [showExitShop, setShowExitShop] = useState(false);
  const handleToggleExitshop = async () => {
    setShowExitShop(true); // 👈 sirf visibility
  
    try {
      const response = await getOwnerNames(
        selectedShopWard,
        selectedPropertyNoShopFrom,
        selectedPropertyNoShopTo
      );
  
      const allData = response?.mergedResults || [];
      let finalData = [];
  
      // CASE 1: Select All
      if (selectAllShop) {
        finalData = allData;
      }
      // CASE 2: Some owners selected
      else if (selectedShopOwnerIds.length > 0) {
        finalData = allData.filter(item =>
          selectedShopOwnerIds.includes(item.OwnerID)
        );
      }
      // CASE 3: Property selected but no checkbox → SHOW ALL
      else {
        finalData = allData;
      }
  
      setExistingPropertyShop(finalData);
  
    } catch (error) {
      console.error("Failed to fetch shop data:", error);
    }
  };
  
  // const handleToggleExitshop  = async () => {
  //   setExistingPropertyShop(!existingPropertyShop);
  
  //   try {
  //     const response = await getOwnerNames(selectedShopWard, selectedPropertyNoShopFrom, selectedPropertyNoShopTo);
  //     const allData = response?.mergedResults || [];
  
  //     let finalData = [];
  
  //     // CASE 1: All selected → full list
  //     if (selectAllShop) {
  //       finalData = allData;
  //     }
  //     // CASE 2: Only selected shop owners
  //     else if (selectedShopOwnerIds.length > 0) {
  //       finalData = allData.filter(item =>
  //         selectedShopOwnerIds.includes(item.OwnerID)
  //       );
  //     }
  //     // CASE 3: None selected
  //     else {
  //       finalData = [];
  //     }
  
  //     setExistingPropertyShop(finalData);
  
  //   } catch (error) {
  //     console.error("Failed to fetch shop data:", error);
  //   }
  // };
  
  const [showExitCommonRemark, setShowExitCommonRemark] = useState(false);

  //common remark
  const handleToggleExitCommonRemark = async () => {
    setShowExitCommonRemark(true); 
  
    try {
      const response = await getOwnerNames(
        selectedCommRemarkWard,
        selectedPropertyNoCommRemarkFrom,
        selectedPropertyNoCommRemarkTo
      );
  
      const allData = response?.mergedResults || [];
      let finalData = [];
  
      // CASE 1: Select All
      if (selectAllCommRemark) {
        finalData = allData;
      }
      // CASE 2: Some owners selected
      else if (selectedCommRemarkOwnerIds.length > 0) {
        finalData = allData.filter(item =>
          selectedCommRemarkOwnerIds.includes(item.OwnerID)
        );
      }
      // CASE 3: Property selected but no checkbox → SHOW ALL
      else {
        finalData = allData;
      }
  
      setExistingCommonRemarkDetails(finalData);
  
    } catch (error) {
      console.error("Failed to fetch common remark data:", error);
    }
  };
  
  //WadhGhat
  // const handleToggleExitWadhGhat = async () => {
  //   try {
  //     const response = await getOwnerNames(selectedWadhGhatWard, selectedPropertyNoWadhGhatFrom, selectedPropertyNoWadhGhatTo);
  //     console.log('responseee wadhghat:', response);

  //     // Assuming response contains ownerNameResults and JointResults as in your example
  //     if (response) {
  //       setWadhGhatDetails(response.mergedResults || []);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch wards:', error);
  //   }
  // };
  const [showExitWadhGhat, setShowExitWadhGhat] = useState(false);

  const handleToggleExitWadhGhat = async () => {
    setShowExitWadhGhat(true); 
  
    try {
      const response = await getOwnerNames(
        selectedWadhGhatWard,
        selectedPropertyNoWadhGhatFrom,
        selectedPropertyNoWadhGhatTo
      );
  
      const allData = response?.mergedResults || [];
      let finalData = [];
  
      // CASE 1: Select All
      if (selectAllWadhGhat) {
        finalData = allData;
      }
      // CASE 2: Some owners selected
      else if (selectedWadhGhatOwnerIds.length > 0) {
        finalData = allData.filter(item =>
          selectedWadhGhatOwnerIds.includes(item.OwnerID)
        );
      }
      // CASE 3: Property selected but no checkbox → SHOW ALL
      else {
        finalData = allData;
      }
  
      setWadhGhatDetails(finalData);
  
    } catch (error) {
      console.error("Failed to fetch WadhGhat data:", error);
    }
  };
  
  
  //name Like
  const [nameLikeRoadChecked, setnameLikeRoadChecked] = useState(false);

  const handleRoadCheckboxChanges = (event) => {
    setnameLikeRoadChecked(event.target.checked);
    setnameLikeRoadWardChecked(false);
  };

  const [nameLikeRoadWardChecked, setnameLikeRoadWardChecked] = useState(false);

  const [showPropertyTable, setshowPropertyTable] = useState(false);

  const [nameLikePropertyChecked, setnameLikePropertyChecked] = useState(false);

  const [selectedPropertyNumbers, setselectedPropertyNumbers] = useState([]);

  const [selectedPropertyNumbersTo, setselectedPropertyNumbersTo] = useState([]);
  const handleCheckboxChangesRoadWard = (event) => {
    setnameLikeRoadWardChecked(event.target.checked);
    setnameLikeRoadChecked(false);
  };

  
    const handleShowPropertyClick = async () => {
      setshowPropertyTable(!showPropertyTable);
      try {
        const jointOwnerDetails = await getJointOwnerDetails(selectedPropertyDesc);
        console.log('Fetched jointDetails:', jointOwnerDetails);
        const fetchedDetails = jointOwnerDetails.data;
        console.log(fetchedDetails, 'CCCCCC');
        // Wrap the data in an array if it's a single object
        setExistingPropertyDescriptionShow(Array.isArray(fetchedDetails) ? fetchedDetails : [fetchedDetails]);

      } catch (error) {
        console.error('Error fetching joint owner details:', error);
      }
    };
  //show exting

  const [showExitProperty, setshowExitProperty] = useState(false);
  // const handleToggleExitProperty = async () => {
  //   setshowExitProperty(!showExitProperty);
  //   try {
  //     const response = await getOwnerNames(selectedPropertyWards, selectedPropertyNosFrom, selectedPropertyNoPropTo);
  //     console.log('responseee:', response);

  //     // Assuming response contains ownerNameResults and JointResults as in your example
  //     if (response) {
  //       setExistingPropertyDescriptionShow(response.mergedResults || []);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch wards:', error);
  //   }
  // };
  // const handleToggleExitProperty = async () => {
  //   setshowExitProperty(!showExitProperty);
  
  //   try {
  //     const response = await getOwnerNames(
  //       selectedPropertyWards,
  //       selectedPropertyNosFrom,
  //       selectedPropertyNoPropTo
  //     );
  
  //     const allData = response?.mergedResults || [];
  
  //     let finalData = [];
  //     if (selectAllProp) {
  //       finalData = allData;
  //     } else {
  //       finalData = allData.filter((item) => ownerIds.includes(item.OwnerID));
  //     }
  
  //     setExistingPropertyDescriptionShow(finalData);
  //   } catch (error) {
  //     console.error("Failed to fetch property details:", error);
  //   }
  // };
  const handleToggleExitProperty = async () => {
    setshowExitProperty(prev => !prev);
  
    try {
      const response = await getOwnerNames(
        selectedPropertyWards,
        selectedPropertyNosFrom,
        selectedPropertyNoPropTo
      );
  
      const allData = response?.mergedResults || [];
      let finalData = [];
  
      // ✅ CASE 1: Select All
      if (selectAllProp) {
        finalData = allData;
      }
      // ✅ CASE 2: Some checkboxes selected
      else if (selectedPropertyOwnerIds.length > 0) {
        finalData = allData.filter(item =>
          selectedPropertyOwnerIds.includes(item.OwnerID)
        );
      }
      // ✅ CASE 3: Property selected but no checkbox → show ALL
      else {
        finalData = allData;
      }
  
      setExistingPropertyDescriptionShow(finalData);
  
    } catch (error) {
      console.error("Failed to fetch address data:", error);
    }
  };
  
  const handlePropertyCheckboxChanges = (event) => {
    setnameLikePropertyChecked(event.target.checked);
    setnameLikePropertyWardChecked(false);
  };

  const handlePropertyNumberChangeTo = (event) => {
    setselectedPropertyNumbersTo(event.target.value);
  };
  //ward
  const [selectedPropertyWard, setselectedPropertyWard] = useState('');

  //wardLike
  const [nameLikePropertyWardChecked, setnameLikePropertyWardChecked] = useState(false);

  const handleCheckboxChangesPropertyWard = (event) => {
    setnameLikePropertyWardChecked(event.target.checked);
    setnameLikePropertyChecked(false);
  };

  const handlePropertyChangeTo = async (e) => {
    setSelectedPropertyNoTo(e.target.value);
  };
  const handlePropertyAddressChangeTo = async (e) => {
    setSelectedPropertyNoAddressTo(e.target.value);
  };
  const handlePropertyPropChangeTo = async (e) => {
    setSelectedPropertyNoPropTo(e.target.value);
  };
  const handlePropertyRoadChangeTo = async (e) => {
    setSelectedPropertyNoRoadTo(e.target.value);
  };
  const handlePropertyChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedPropertyNoFrom(e.target.value);
  };
  const handlePropertyAddressChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedPropertyNoAddressFrom(e.target.value);
  };
  const handlePropertyRoadChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedPropertyNoRoadFrom(e.target.value);
  };
  const handlePropertyNoChangeFrom = (e) => {
    console.log(e.target.value);
    setSelectedPropertyNosFrom(e.target.value);
  };
  //address
  const handlePropertAddressChange = (e) => {
    setSelectedAddressProperty(e.target.value);
    setError({});
  };
  //Prop Like
  const handlePropertyProChange = (e) => {
    setSelectedPropertyDesc(e.target.value);
  };

  const handlePropertChange = (e) => {
    setSelectedProperty(e.target.value);
  };
  //road
  const handlePropertRoadChange = (e) => {
    setSelectedPropertyRoad(e.target.value);
  };
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
        <MainCard title="Update Property Details">
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <Stack spacing={1}>
                    <RadioGroup value={selectedValue} onChange={handleRadioChange} row>
                      <FormControlLabel
                        control={<Radio value="updateOwner" name="propertyType" id="updateOwner" />}
                        label="Owner Name"
                        style={{ marginRight: 50 }} // Adjust the value as needed
                      />
                      <FormControlLabel
                        control={<Radio value="updateAddress" name="propertyType" id="updateAddress" />}
                        label="Address"
                        style={{ marginRight: 50 }}
                      />
                      <FormControlLabel
                        control={<Radio name="propertyType" id="UpdateRoad" value="UpdateRoad" />}
                        label="Road Width"
                        style={{ marginRight: 50 }}
                      />
                      <FormControlLabel
                        control={<Radio name="propertyType" id="UpdatePropertyType" value="UpdatePropertyType" />}
                        label="Property Type"
                        style={{ marginRight: 50 }}
                      />
                      <FormControlLabel
                        control={<Radio name="propertyType" id="UpdateShop" value="UpdateShop" />}
                        label="Shop Name"
                        style={{ marginRight: 50 }}
                      />
                      <FormControlLabel
                        control={<Radio name="propertyType" id="UpdateCommonRemark" value="UpdateCommonRemark" />}
                        label="Common Remark"
                        style={{ marginRight: 50 }}
                      />
                      <FormControlLabel
                        control={<Radio name="propertyType" id="UpdateWadhGhatRemark" value="UpdateWadhGhatRemark" />}
                        label="Wadh Ghat Remark"
                        style={{ marginRight: 50 }}
                      />
                    </RadioGroup>
                  </Stack>
                </Grid>

                {selectedOverlay === 'updateOwner' && (
                  <>
                    <Grid item xs={12}>
                      <Box textAlign="left" my={2}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                          Name Same As
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid container spacing={1} justifyContent="center">
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel>Ward No</InputLabel>

                          <Select
                            id="ward-select"
                            placeholder="ward no"
                            value={selectedWard}
                            onChange={handleWardChange}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                            error={!!error.selectedWard}
                            disabled={accessLevel < 3}
                            helperText={error.selectedWard}
                            FormHelperTextProps={{ style: { color: 'red' } }}
                          >
                            {wardList
    .slice() 
    .sort((a, b) => a.NewWardNo - b.NewWardNo) 
    .map((ward) => (
      <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
        {ward.NewWardNo}
      </MenuItem>
    ))
  }
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">From Properties</InputLabel>
                          <Select
                            id="ward-select"
                            placeholder="ward no"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                            value={selectedPropertyNoFrom}
                            error={!!error.selectedPropertyNoFrom}
                            helperText={error.selectedPropertyNoFrom}
                            FormHelperTextProps={{ style: { color: 'red' } }}
                            onChange={handlePropertyChangeFrom}
                            disabled={accessLevel < 3}
                          >
                            {propertyNoListFrom
        .slice()
        .sort((a, b) => a.NewPropertyNo - b.NewPropertyNo) 
        .map((property, index) => (
          <MenuItem key={index} value={property.NewPropertyNo}>
            {property.NewPropertyNo}
          </MenuItem>
        ))
      }
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">To Properties</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="ward-select"
                              placeholder="ward no"
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              disabled={accessLevel < 3}
                              value={selectedPropertyNoTo}
                              error={!!error.selectedPropertyNoTo}
                              helperText={error.selectedPropertyNoTo}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              onChange={handlePropertyChangeTo}
                            >
                              {propertyNoListTo
          .slice()
          .sort((a, b) => a.NewPropertyNo - b.NewPropertyNo) 
          .map((property, index) => (
            <MenuItem key={index} value={property.NewPropertyNo}>
              {property.NewPropertyNo}
            </MenuItem>
          ))
        }
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2.2}>
                        <Stack spacing={1}>
                          <Box
                            style={{
                              maxHeight: '130px',
                              overflowY: 'auto',
                              marginTop: '29px',
                              border: '1px solid #ccc'
                            }}
                          >
                            <Box className="form-check">
                              <label htmlFor="select-all">
                                <Checkbox id="select-all" checked={selectAll} onChange={handleSelectAllChange} disabled={accessLevel < 3} />
                                All
                              </label>
                            </Box>

                            {/* Render propertyRangeList */}
                            {propertyRangeList &&
                              propertyRangeList.length > 0 &&
                              propertyRangeList.map((property, index) => (
                                <Box key={index} className="form-check">
                                  <label htmlFor={`property-${index}`}>
                                    <Checkbox
                                      id={`property-${index}`}
                                      value={property.OwnerID}
                                      checked={selectedPropertyOwnerIds.includes(property.OwnerID)}
                                      onChange={(e) => handlePropertySelectChange(e, property)}
                                      />
                                    {/* Display the `prop` field */}
                                    {property.prop || 'N/A'}
                                  </label>
                                </Box>
                              ))}
                          </Box>
                        </Stack>
                      </Grid>

                      {/* button */}
                      <Grid item xs={12} md={1} lg={12} mb={2}>
                        <Grid container justifyContent="center" alignItems="center">
                          <Stack spacing={1} sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="large"
                              onClick={handleShowExitingNames}
                              disabled={accessLevel < 3}
                            >
                              {showExitNames ? 'Show ' : 'Show  '}
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                      {/* 2column */}
                    </Grid>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={10} lg={5}>
                        <Box marginTop={2} marginLeft={2.2}>
                          <Accordion>
                            <AccordionSummary
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ fontWeight: 'bolder' }}
                              disabled={accessLevel < 3}
                            >
                              Name Like
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Name Like"
                                value=""
                                checked={nameLikeChecked}
                                onChange={handleCheckboxChangesNameLike}
                                disabled={accessLevel < 3}
                              />

<Grid container spacing={2} sx={{ marginTop: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Grid
                                  item
                                  xs={6}
                                  sm={8}
                                  style={{ display: 'flex', flexDirection: 'row', width: '40vw', justifyContent: 'center' }}
                                > <Stack sx={{ width: '100%' }}>
                                    <InputLabel sx={{ml:7}}>Enter Owner Name in English</InputLabel>
                                    <TextField
                                      name="OwnerName"
                                      value={Names.OwnerName}
                                      onChange={handleNameChange}
                                      sx={{ mt: 2 }}
                                      error={!!error.OwnerName}
                                      helperText={error.OwnerName}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      disabled={accessLevel < 3}
                                    ></TextField>
                                  </Stack>
                                </Grid>
                                
                              </Grid>
                              <Grid container spacing={2} sx={{ marginTop: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Grid
                                  item
                                  xs={6}
                                  sm={8}
                                  style={{ display: 'flex', flexDirection: 'row', width: '40vw', justifyContent: 'center' }}
                                ><Stack sx={{ width: '100%' }}>
                                    <InputLabel sx={{ml:7}}> Enter Owner Name In Marathi</InputLabel>
                                    <TextField
                                      name="OwnerNameMarathi"
                                      value={Names.OwnerNameMarathi}
                                      onChange={handleNameChange}
                                      sx={{ mt: 2 }}
                                      
                                      error={!!error.OwnerNameMarathi}
                                      helperText={error.OwnerNameMarathi}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      disabled={accessLevel < 3}
                                    ></TextField>
                                  </Stack>
                                </Grid>
                                
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      </Grid>
                      {/* 2nd */}
                      <Grid item xs={12} md={5} lg={2}>
                        <Typography sx={{ mb: 5, mt: 6, ml: 7 }} variant="h1" style={{ color: 'red', fontWeight: 'bold' }}>
                          OR
                        </Typography>
                      </Grid>

                      {/* 3rd */}
                      <Grid item xs={12} md={10} lg={5}>
                        <Box marginTop={2}>
                          <Accordion>
                            <AccordionSummary
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ fontWeight: 'bolder' }}
                              disabled={accessLevel < 3}
                            >
                              Name Like
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Name Like"
                                checked={nameLikeWardChecked}
                                onChange={handleCheckboxChangesNameLikeWard}
                              />
                              <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
                                <Grid item xs={6} sm={6}>
                                  <Stack spacing={1}>
                                    <InputLabel>Ward No</InputLabel>
                                    <FormControl>
                                      <Select
                                        MenuProps={{
                                          PaperProps: {
                                            style: {
                                              maxHeight: 150,
                                              overflowY: 'auto'
                                            }
                                          }
                                        }}
                                        value={selectedWardProperty}
                                        error={!!error.selectedWardProperty}
                                        helperText={error.selectedWardProperty}
                                        FormHelperTextProps={{ style: { color: 'red' } }}
                                        onChange={handleWardChangeProperty}
                                        disabled={accessLevel < 3}
                                      >
                                        {wardListProperty.slice() 
    .sort((a, b) => a.NewWardNo - b.NewWardNo) .map((ward) => (
                                          <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                            {ward.NewWardNo}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Stack>
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                  <Stack sx={{ width: '100%' }}>
                                    <InputLabel>Property No.</InputLabel>
                                    <Select
                                      sx={{ marginTop: 0.6 }}
                                      MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 150,
                                            overflowY: 'auto'
                                          }
                                        }
                                      }}
                                      value={selectedProperty}
                                      error={!!error.selectedProperty}
                                      helperText={error.selectedProperty}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      onChange={handlePropertChange}
                                    >
                                      {propertyNoList.slice()
        .sort((a, b) => a.NewPropertyNo - b.NewPropertyNo) 
        .map((property, index) => (
                                        <MenuItem key={index} value={property.OwnerID}>
                                          {property.NewPropertyNo}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Stack>
                                </Grid>
                              </Grid>

                              {/* button */}
                              <Grid item xs={12} md={1} lg={12} mb={1}>
                                <Grid container justifyContent="center" alignItems="center">
                                  <Stack spacing={1} sx={{ textAlign: 'center', marginTop: '20px' }}>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      size="large"
                                      onClick={handleShowNamesClick}
                                      disabled={accessLevel < 3}
                                    >
                                      Show Names
                                    </Button>
                                  </Stack>
                                </Grid>
                              </Grid>
                              {/* Table */}
                              {showTable && (
                                <Box sx={{ overflowX: 'auto', height: '200px' }}>
                                  <Table>
                                    {/* Table Header */}
                                    <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                      <TableRow>
                                        <TableCell>Owner Name</TableCell>
                                        <TableCell>Owner Name Marathi </TableCell>
                                        <TableCell>IsPrime</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {jointDetails.length === 1 && (
                                        <TableRow key={jointDetails[0].OwnerID}>
                                          <TableCell>{jointDetails[0].OwnerName}</TableCell>
                                          <TableCell>{jointDetails[0].OwnerNameMarathi}</TableCell>
                                          <TableCell>{jointDetails[0].isPrime ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container justifyContent="center" alignItems="center" marginTop={3}>
                      <Stack spacing={1} direction="row">
                        <Button variant="contained" color="success" size="large" onClick={handleApplyChanges} disabled={accessLevel < 3}>
                          Apply Changes
                        </Button>
                        <Button variant="contained" color="success" size="large" onClick={handleCancelChange} disabled={accessLevel < 3}>
                          Cancel Changes
                        </Button>
                      </Stack>
                    </Grid>

                    {showExitNames && (
                      <>
                        <Grid item xs={12} md={5} lg={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                                Update Owner Name
                              </Typography>
                              <Box sx={{ overflowX: 'auto', width: '100%', maxWidth: '80vw', height: '200px' }}>
                                <Table sx={{ minWidth: '800px' }}>
                                  {' '}
                                  {/* Adjust this to ensure all columns are visible */}
                                  {/* Table Header */}
                                  <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                    <TableRow>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>New Ward No.</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Properties No</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Partition No</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '20%' }}>Owner Name</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '20%' }}>Owner Name Marathi</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Is Prime</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  {/* Table Body */}
                                  <TableBody>
                                    {ownerDetails.length > 0 &&
                                      ownerDetails.map((details, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell>{details.NewWardNo}</TableCell>
                                            <TableCell>{details.NewPropertyNo}</TableCell>
                                            <TableCell>{details.NewPartitionNo}</TableCell>
                                            <TableCell>{details.OwnerName}</TableCell>
                                            <TableCell>{details.OwnerNameMarathi}</TableCell>
                                            <TableCell>{details.isPrime ? 'Yes' : 'No'}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* 1st */}
                {selectedOverlay === 'updateAddress' && (
                  <>
                    <Grid item xs={12}>
                      <Box textAlign="left" my={2}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                          Select Property Type:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid container spacing={1} justifyContent="center">
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel>Ward No</InputLabel>

                          <Select
                            id="ward-select"
                            placeholder="ward no"
                            value={selectedAddressWard}
                            error={!!error.selectedAddressWard}
                            helperText={error.selectedAddressWard}
                            FormHelperTextProps={{ style: { color: 'red' } }}
                            onChange={handleAddressWardChange}
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
                            {wardList.slice() 
    .sort((a, b) => a.NewWardNo - b.NewWardNo) 
    .map((ward) => (
                              <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                {ward.NewWardNo}
                              </MenuItem>
                            ))}
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">From Properties</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="ward-select"
                              placeholder="ward no"
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              disabled={accessLevel < 3}
                              value={selectedPropertyNoAddressFrom}
                              error={!!error.selectedPropertyNoAddressFrom}
                              helperText={error.selectedPropertyNoAddressFrom}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              onChange={handlePropertyAddressChangeFrom}
                            >
                              {propertyNoListFrom  .slice()
        .sort((a, b) => a.NewPropertyNo - b.NewPropertyNo) 
      .map((property, index) => (
                                <MenuItem key={index} value={property.NewPropertyNo}>
                                  {' '}
                                  {/* Use the correct property name */}
                                  {property.NewPropertyNo}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">To Properties</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="ward-select"
                              placeholder="ward no"
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              disabled={accessLevel < 3}
                              value={selectedPropertyNoAddressTo}
                              error={!!error.selectedPropertyNoAddressTo}
                              helperText={error.selectedPropertyNoAddressTo}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              onChange={handlePropertyAddressChangeTo}
                            >
                              {propertyNoListTo .slice()
          .sort((a, b) => a.NewPropertyNo - b.NewPropertyNo) 
         .map((property, index) => (
                                <MenuItem key={index} value={property.NewPropertyNo}>
                                  {' '}
                                  {/* Use the correct property name */}
                                  {property.NewPropertyNo}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2.2}>
                        <Stack spacing={1}>
                          <Box
                            style={{
                              maxHeight: '130px',
                              overflowY: 'auto',
                              marginTop: '29px',
                              border: '1px solid #ccc'
                            }}
                          >
                            <Box className="form-check">
                              <label htmlFor="select-all">
                                <Checkbox
                                  id="select-all"
                                  checked={selectAllAddress}
                                  onChange={handleSelectAllAddressChange}
                                  disabled={accessLevel < 3}
                                />
                                All
                              </label>
                            </Box>
                            {propertyRangeAddressList &&
                              propertyRangeAddressList.length > 0 && // Check if the array has items
                              propertyRangeAddressList.map((property, index) => (
                                <Box key={index} className="form-check">
                                  <label htmlFor={`property-${index}`}>
                                    <Checkbox
                                      id={`property-${index}`}
                                      value={property.OwnerID}
                                      checked={selectedAddressOwnerIds.includes(property.OwnerID)} // Check if the property is selected
                                      onChange={(event) => handlePropertySelectAddressChange(event, property)} // Update the ownerIds on change
                                    />
                                    {/* Display the `prop` field */}
                                    {property.prop || 'N/A'}
                                  </label>
                                </Box>
                              ))}
                          </Box>
                        </Stack>
                      </Grid>
                      {/* button */}
                      <Grid item xs={12} md={1} lg={12} mb={2}>
                        <Grid container justifyContent="center" alignItems="center">
                          <Stack spacing={1} sx={{ textAlign: 'center' }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="large"
                              onClick={handleToggleExitAddress}
                              disabled={accessLevel < 3}
                            >
                              {showAddressExitAddress ? 'Show' : 'Show'}
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* 2column */}

                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={10} lg={5}>
                        <Box marginTop={2} marginLeft={2.2}>
                          <Accordion>
                            <AccordionSummary
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ fontWeight: 'bolder' }}
                              disabled={accessLevel < 3}
                            >
                              Address Like
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Address Like"
                                value=""
                                checked={nameLikeAddressChecked}
                                onChange={handleAddressCheckboxChanges}
                              />

                              <Grid container spacing={2} sx={{ marginTop: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Grid
                                  item
                                  xs={6}
                                  sm={8}
                                  style={{ display: 'flex', flexDirection: 'row', width: '40vw', justifyContent: 'center' }}
                                >
                                  <Stack sx={{ width: '100%' }}>
                                    <InputLabel>Enter Address In English</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      name="Address"
                                      value={Address.Address}
                                      error={!!error.Address}
                                      helperText={error.Address}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      onChange={handleAddressChange}
                                      className={`form-control text-center ${!nameLikeAddressChecked ? 'disabled' : ''}`}
                                      disabled={!nameLikeAddressChecked || accessLevel < 3}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={6} sm={8} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                  <Stack sx={{ width: '100%' }}>
                                    <InputLabel>Enter Address In Marathi</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      name="OwnerPatta"
                                      onChange={handleAddressChange}
                                      value={Address.OwnerPatta}
                                      error={!!error.OwnerPatta}
                                      helperText={error.OwnerPatta}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      className={`form-control text-center ${!nameLikeAddressChecked ? 'disabled' : ''}`}
                                      disabled={!nameLikeAddressChecked || accessLevel < 3}
                                    />
                                  </Stack>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      </Grid>
                      {/* 2nd */}
                      <Grid item xs={12} md={5} lg={2}>
                        <Typography sx={{ mb: 5, mt: 6, ml: 7 }} variant="h1" style={{ color: 'red', fontWeight: 'bold' }}>
                          OR
                        </Typography>
                      </Grid>

                      {/* 3rd */}
                      <Grid item xs={12} md={10} lg={5}>
                        <Box marginTop={2}>
                          <Accordion>
                            <AccordionSummary
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ fontWeight: 'bolder' }}
                              disabled={accessLevel < 3}
                            >
                              Address Like
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Address Like"
                                checked={nameLikeAddressWardChecked}
                                onChange={handleCheckboxChangesAddressWard}
                              />
                              <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
                                <Grid item xs={6} sm={6} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                                  <Stack sx={{ width: '100%' }}>
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
                                      value={selectedWardAddressProperty}
                                      error={!!error.selectedWardAddressProperty}
                                      helperText={error.selectedWardAddressProperty}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      onChange={handleWardChangeAddressProperty}
                                    >
                                      {wardListProperty.map((ward) => (
                                        <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                          {ward.NewWardNo}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Stack>
                                </Grid>
                                <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                                  <Stack sx={{ width: '100%' }}>
                                    <InputLabel>Property No.</InputLabel>
                                    <Select
                                      sx={{ marginTop: 0.6 }}
                                      MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 150,
                                            overflowY: 'auto'
                                          }
                                        }
                                      }}
                                      value={selectedPropertyAddress}
                                      error={!!error.selectedPropertyAddress}
                                      helperText={error.selectedPropertyAddress}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      onChange={handlePropertAddressChange}
                                    >
                                      {propertyNoAddressList.map((property, index) => (
                                        <MenuItem key={index} value={property.OwnerID}>
                                          {property.NewPropertyNo}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Stack>
                                </Grid>
                              </Grid>

                              {/* button */}
                              <Grid item xs={12} md={1} lg={12} mb={1}>
                                <Grid container justifyContent="center" alignItems="center">
                                  <Stack spacing={1} sx={{ textAlign: 'center' }}>
                                    <Button variant="contained" color="success" size="large" onClick={handleShowAddressClick}>
                                      Show Names
                                    </Button>
                                  </Stack>
                                </Grid>
                              </Grid>
                              {/* Table */}
                              {showAddressTable && (
                                <Box sx={{ overflowX: 'auto', height: '200px' }}>
                                  <Table>
                                    {/* Table Header */}
                                    <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                      <TableRow>
                                        <TableCell>Owner ID</TableCell>

                                        <TableCell>Address </TableCell>
                                        <TableCell>पत्ता</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    {/* Table Body */}
                                    <TableBody>
                                      {jointDetailsAddress.length === 1 && (
                                        <TableRow key={jointDetailsAddress[0].OwnerID}>
                                          <TableCell>{jointDetailsAddress[0].OwnerID}</TableCell>
                                          <TableCell>{jointDetailsAddress[0].Address}</TableCell>
                                          <TableCell>{jointDetailsAddress[0].OwnerPatta}</TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>{' '}
                                  </Table>
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center" marginTop={3}>
                      <Stack spacing={1} direction="row">
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleApplyChangesAddress}
                          disabled={accessLevel < 3}
                        >
                          Apply Changes
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleCancelAddressChanges}
                          disabled={accessLevel < 3}
                        >
                          Cancel Changes
                        </Button>
                      </Stack>
                    </Grid>

                    {showAddressExitAddress && (
                      <>
                        <Grid item xs={12} md={5} lg={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                                Update Address
                              </Typography>
                              <Box sx={{ overflowX: 'auto', height: '300px' }}>
                                {/* Table */}
                                <Table>
                                  {/* Table Header */}
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>New Ward No.</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Properties No</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Partition No</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '20%' }}>Address</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '20%' }}> पत्ता </TableCell>
                                      {/* <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Is Prime</TableCell> */}
                                    </TableRow>
                                  </TableHead>

                                  {/* Table Body */}
                                  <TableBody>
                                    {addressDetails &&
                                      addressDetails.length > 0 &&
                                      addressDetails.map((details, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell>{details.NewWardNo}</TableCell>
                                            <TableCell>{details.NewPropertyNo}</TableCell>
                                            <TableCell>{details.NewPartitionNo}</TableCell>
                                            <TableCell>{details.Address}</TableCell>
                                            <TableCell>{details.OwnerPatta}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* 2nd */}
                {selectedOverlay === 'UpdateRoad' && (
                  <>
                    <Grid item xs={12}>
                      <Box textAlign="left" my={2}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                          Select Property Type:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid container spacing={1} justifyContent="center">
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel>Ward No</InputLabel>

                          <Select
                            id="ward-select"
                            placeholder="ward no"
                            value={selectedRoadWard}
                            onChange={handleRoadWardChange}
                            error={!!error.selectedRoadWard}
                            helperText={error.selectedRoadWard}
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
                            {wardList.slice() 
    .sort((a, b) => a.NewWardNo - b.NewWardNo) 
    .map((ward) => (
                              <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                {ward.NewWardNo}
                              </MenuItem>
                            ))}
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">From Properties</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="ward-select"
                              placeholder="ward no"
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              value={selectedPropertyNoRoadFrom}
                              error={!!error.selectedPropertyNoRoadFrom}
                              helperText={error.selectedPropertyNoRoadFrom}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              onChange={handlePropertyRoadChangeFrom}
                              disabled={accessLevel < 3}
                            >
                              {propertyNoListFrom.slice()
        .sort((a, b) => a.NewPropertyNo - b.NewPropertyNo) 
       .map((property, index) => (
                                <MenuItem key={index} value={property.NewPropertyNo}>
                                  {' '}
                                  {/* Use the correct property name */}
                                  {property.NewPropertyNo}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">To Properties</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="ward-select"
                              placeholder="ward no"
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              disabled={accessLevel < 3}
                              error={!!error.selectedPropertyNoRoadTo}
                              helperText={error.selectedPropertyNoRoadTo}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              value={selectedPropertyNoRoadTo}
                              onChange={handlePropertyRoadChangeTo}
                            >
                              {propertyNoListTo.slice()
          .sort((a, b) => a.NewPropertyNo - b.NewPropertyNo) 
         .map((property, index) => (
                                <MenuItem key={index} value={property.NewPropertyNo}>
                                  {' '}
                                  {property.NewPropertyNo}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2.2}>
                        <Stack spacing={1}>
                          <Box
                            style={{
                              maxHeight: '130px',
                              overflowY: 'auto',
                              marginTop: '29px',
                              border: '1px solid #ccc'
                            }}
                          >
                            <Box className="form-check">
                              <label htmlFor="select-all">
                                <Checkbox
                                  id="select-all"
                                  checked={selectAllRoad}
                                  onChange={handleSelectAllRoadChange}
                                  disabled={accessLevel < 3}
                                />
                                All
                              </label>
                            </Box>
                            {propertyRangeRoadList &&
                              propertyRangeRoadList.length > 0 && // Check if the array has items
                              propertyRangeRoadList.map((property, index) => (
                                <Box key={index} className="form-check">
                                  <label htmlFor={`property-${index}`}>
                                    <Checkbox
                                      id={`property-${index}`}
                                      value={property.OwnerID}
                                      checked={selectedRoadOwnerIds.includes(property.OwnerID)}
                                      onChange={(event) => handlePropertySelectRoadChange(event, property)}
                                    />
                                    {/* Display the `prop` field */}
                                    {property.prop || 'N/A'}
                                  </label>
                                </Box>
                              ))}
                          </Box>
                        </Stack>
                      </Grid>
                      {/* button */}
                      <Grid item xs={12} md={1} lg={12} mb={2}>
                        <Grid container justifyContent="center" alignItems="center">
                          <Stack spacing={1} sx={{ textAlign: 'center' }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="large"
                              onClick={handleToggleExitRoad}
                              disabled={accessLevel < 3}
                            >
                              {showExitRoad ? 'Show' : 'Show '}
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* 2column */}

                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={10} lg={5}>
                        <Box marginTop={2} marginLeft={2.2}>
                          <Accordion>
                            <AccordionSummary
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ fontWeight: 'bolder' }}
                              disabled={accessLevel < 3}
                            >
                              Road Width Like
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Road Width Like"
                                value=""
                                checked={nameLikeRoadChecked}
                                onChange={handleRoadCheckboxChanges}
                              />

                              <Grid container spacing={2} sx={{ marginTop: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Grid
                                  item
                                  xs={6}
                                  sm={8}
                                  style={{ display: 'flex', flexDirection: 'row', width: '40vw', justifyContent: 'center' }}
                                >
                                  <Stack sx={{ width: '100%' }}>
                                    <InputLabel>Enter Road Width</InputLabel>
                                    <TextField
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      onChange={handleRoadChange}
                                      name="RoadWidth"
                                      value={road.RoadWidth}
                                      error={!!error.RoadWidth}
                                      helperText={error.RoadWidth}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      className={`form-control text-center ${!nameLikeRoadChecked ? 'disabled' : ''}`}
                                      disabled={!nameLikeRoadChecked}
                                    />
                                  </Stack>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      </Grid>
                      {/* 2nd */}
                      <Grid item xs={12} md={5} lg={2}>
                        <Typography sx={{ mb: 5, mt: 6, ml: 7 }} variant="h1" style={{ color: 'red', fontWeight: 'bold' }}>
                          OR
                        </Typography>
                      </Grid>

                      {/* 3rd */}
                      <Grid item xs={12} md={10} lg={5}>
                        <Box marginTop={2}>
                          <Accordion>
                            <AccordionSummary
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ fontWeight: 'bolder' }}
                              disabled={accessLevel < 3}
                            >
                              Road Width Like
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Road Width Like"
                                checked={nameLikeRoadWardChecked}
                                onChange={handleCheckboxChangesRoadWard}
                              />
                              <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
                                <Grid item xs={6} sm={6} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                                  <Stack sx={{ width: '100%' }}>
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
                                      value={selectedWardRoadProperty}
                                      error={!!error.selectedWardRoadProperty}
                                      helperText={error.selectedWardRoadProperty}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      onChange={handleWardChangeRoadProperty}
                                    >
                                      {wardListProperty.map((ward) => (
                                        <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                          {ward.NewWardNo}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Stack>
                                </Grid>
                                <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                                  <Stack sx={{ width: '100%' }}>
                                    <InputLabel>Property No.</InputLabel>
                                    <Select
                                      // sx={{ marginTop: 0.6 }}
                                      MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 150,
                                            overflowY: 'auto'
                                          }
                                        }
                                      }}
                                      value={selectedPropertyRoad}
                                      error={!!error.selectedPropertyRoad}
                                      helperText={error.selectedPropertyRoad}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      onChange={handlePropertRoadChange}
                                    >
                                      {propertyNoRoadList.map((property, index) => (
                                        <MenuItem key={index} value={property.OwnerID}>
                                          {property.NewPropertyNo}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Stack>
                                </Grid>
                              </Grid>

                              {/* button */}
                              <Grid item xs={12} md={1} lg={12} mb={1}>
                                <Grid container justifyContent="center" alignItems="center">
                                  <Stack spacing={1} sx={{ textAlign: 'center' }}>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      size="large"
                                      onClick={handleShowRoadClick}
                                      disabled={accessLevel < 3}
                                    >
                                      Show Names
                                    </Button>
                                  </Stack>
                                </Grid>
                              </Grid>
                              {/* Table */}
                              {showRoadTable && (
                                <Box sx={{ overflowX: 'auto', height: '200px' }}>
                                  <Table>
                                    {/* Table Header */}
                                    <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                      <TableRow>
                                        <TableCell>Owner ID</TableCell>
                                        <TableCell>Road Width</TableCell>
                                      </TableRow>
                                    </TableHead>

                                    {/* Table Body */}
                                    <TableBody>
                                      {jointDetailsRoad.length === 1 && (
                                        <TableRow key={jointDetailsRoad[0].OwnerID}>
                                          <TableCell>{jointDetailsRoad[0].OwnerID}</TableCell>
                                          <TableCell>{jointDetailsRoad[0].RoadWidth}</TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container justifyContent="center" alignItems="center" marginTop={3}>
                      <Stack spacing={1} direction="row">
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleApplyChangesRoad}
                          disabled={accessLevel < 3}
                        >
                          Apply Changes
                        </Button>
                        <Button variant="contained" color="success" size="large" onClick={handleCancelRoad} disabled={accessLevel < 3}>
                          Cancel Changes
                        </Button>
                      </Stack>
                    </Grid>
                    {showExitRoad && (
                      <>
                        <Grid item xs={12} md={5} lg={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                                Update Road Width
                              </Typography>
                              <Box sx={{ overflowX: 'auto', height: '300px' }}>
                                {/* Table */}
                                <Table>
                                  {/* Table Header */}
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>New Ward No.</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Properties No</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '20%' }}>Partition No</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '20%' }}> Road Width</TableCell>
                                    </TableRow>
                                  </TableHead>

                                  {/* Table Body */}
                                  <TableBody>
                                    {roadDetails &&
                                      roadDetails.length > 0 &&
                                      roadDetails.map((details, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell>{details.NewWardNo}</TableCell>
                                            <TableCell>{details.NewPropertyNo}</TableCell>
                                            <TableCell>{details.NewPartitionNo}</TableCell>
                                            <TableCell>{details.RoadWidth}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* 4th */}
                {selectedOverlay === 'UpdatePropertyType' && (
                  <>
                    <Grid item xs={12}>
                      <Box textAlign="left" my={2}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                          Select Property Type:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid container spacing={1} justifyContent="center">
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel>Ward No</InputLabel>

                          <Select
                            id="ward-select"
                            placeholder="ward no"
                            value={selectedPropertyWards}
                            error={!!error.selectedPropertyWards}
                            helperText={error.selectedPropertyWards}
                            FormHelperTextProps={{ style: { color: 'red' } }}
                            onChange={handlePropertyWardChange}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 150,
                                  overflowY: 'auto'
                                }
                              }
                            }}
                            disabled={accessLevel < 3}
                          >
                            {wardList.slice().sort((a,b)=>a.NewWardNo - b.NewWardNo).map((ward) => (
                              <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                {ward.NewWardNo}
                              </MenuItem>
                            ))}
                          </Select>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">From Properties</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="ward-select"
                              placeholder="ward no"
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              disabled={accessLevel < 3}
                              value={selectedPropertyNosFrom}
                              error={!!error.selectedPropertyNosFrom}
                              helperText={error.selectedPropertyNosFrom}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              onChange={handlePropertyNoChangeFrom}
                            >
                              {propertyNoListFrom.slice()
          .sort((a, b) => a.NewPropertyNo - b.NewPropertyNo) 
         .map((property, index) => (
                                <MenuItem key={index} value={property.NewPropertyNo}>
                                  {' '}
                                  {/* Use the correct property name */}
                                  {property.NewPropertyNo}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-number-select-label">To Properties</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              id="ward-select"
                              placeholder="ward no"
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 150,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              disabled={accessLevel < 3}
                              value={selectedPropertyNoPropTo}
                              error={!!error.selectedPropertyNoPropTo}
                              helperText={error.selectedPropertyNoPropTo}
                              FormHelperTextProps={{ style: { color: 'red' } }}
                              onChange={handlePropertyPropChangeTo}
                            >
                              {propertyNoListTo.slice().sort((a,b)=>a.NewPropertyNo - b.NewPropertyNo).map((property, index) => (
                                <MenuItem key={index} value={property.NewPropertyNo}>
                                  {' '}
                                  {/* Use the correct property name */}
                                  {property.NewPropertyNo}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={2.2}>
                        <Stack spacing={1}>
                          <Box
                            style={{
                              maxHeight: '130px',
                              overflowY: 'auto',
                              marginTop: '29px',
                              border: '1px solid #ccc'
                            }}
                          >
                            <Box className="form-check">
                              <label htmlFor="select-all">
                                <Checkbox
                                  id="select-all"
                                  checked={selectAllProp}
                                  onChange={handleSelectAllPropChange}
                                  disabled={accessLevel < 3}
                                />
                                All
                              </label>
                            </Box>
                            {propertyRangePropList &&
                              propertyRangePropList.length > 0 && // Check if the array has items
                              propertyRangePropList.map((property, index) => (
                                <Box key={index} className="form-check">
                                  <label htmlFor={`property-${index}`}>
                                    <Checkbox
                                      id={`property-${index}`}
                                      value={property.OwnerID}
                                      checked={selectedPropertyOwnerIds.includes(property.OwnerID)} // Check if the property is selected
                                      onChange={(event) => handlePropertySelectPropChange(event, property)} // Update the ownerIds on change
                                    />
                                    {/* Display the `prop` field */}
                                    {property.prop || 'N/A'}
                                  </label>
                                </Box>
                              ))}
                          </Box>
                        </Stack>
                      </Grid>
                      {/* button */}
                      <Grid item xs={12} md={1} lg={12} mb={2}>
                        <Grid container justifyContent="center" alignItems="center">
                          <Stack spacing={1} sx={{ textAlign: 'center' }}>
                            {/* <Button variant="contained" color="info" size="large" onClick={handleShowExitingNames}
              {showPropertyExitNames ? "Hide Exit Names" : "Show Exit Names"}>
               Show Existing Names 
            </Button> */}
                            <Button variant="contained" color="success" size="large" onClick={handleToggleExitProperty}>
                              {showExitProperty ? 'Show' : 'Show '}
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* 2column */}
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={10} lg={5}>
                        <Box marginTop={2} marginLeft={2.2}>
                          <Accordion>
                            <AccordionSummary
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ fontWeight: 'bolder' }}
                              disabled={accessLevel < 3}
                            >
                              Property Like
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Property Like"
                                value=""
                                checked={nameLikePropertyChecked}
                                onChange={handlePropertyCheckboxChanges}
                              />

                              <Grid container spacing={2} sx={{ marginTop: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Grid
                                  item
                                  xs={6}
                                  sm={8}
                                  style={{ display: 'flex', flexDirection: 'row', width: '40vw', justifyContent: 'center' }}
                                >
                                  <Stack sx={{ width: '100%' }}>
                                    <InputLabel>Select Property Description</InputLabel>
                                    <Select
                                      required
                                      fullWidth
                                      maxWidth="sm"
                                      name="propertyDescrpition"
                                      value={propertyDescrpition.PropertyTypeId}
                                      error={!!error.PropertyTypeId}
                                      helperText={error.PropertyTypeId}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      className={`form-control text-center ${!nameLikePropertyChecked ? 'disabled' : ''}`}
                                      disabled={!nameLikePropertyChecked}
                                      onChange={handlePropChange}
                                    >
                                      {propDetails.map((user, index) => (
                                        <MenuItem key={index} value={user.PropertyTypeID}>
                                          {user.PropertyDescription}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Stack>
                                </Grid>

                                {/* <Grid item xs={6} sm={5} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                              <Stack sx={{ width: '100%' }}>
                                <Button variant="contained" color="success" onClick={handleClickDialogProperty}>
                                  Update
                                </Button>
                                <Dialog open={openDialogProperty} onClose={handleCloseDialogProperty} fullWidth maxWidth="xs">
                                  <DialogTitle id="alert-dialog-title" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                    Update Address
                                  </DialogTitle>
                                  <DialogContent>
                                    <Stack marginBottom={2}>
                                      <DialogContentText id="alert-dialog-description" align="center" style={{ fontSize: '15px' }}>
                                        Do you want to update your address?
                                      </DialogContentText>{' '}
                                    </Stack>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button variant="contained" color="success" onClick={handleCloseDialogProperty} autoFocus>
                                      Yes
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleCloseDialogProperty} autoFocus>
                                      No
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={5}>
                              <Stack spacing={1}>
                                <Button variant="contained" color="secondary">
                                  clear
                                </Button>
                              </Stack>
                            </Grid> */}
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      </Grid>
                      {/* 2nd */}
                      <Grid item xs={12} md={5} lg={2}>
                        <Typography sx={{ mb: 5, mt: 6, ml: 7 }} variant="h1" style={{ color: 'red', fontWeight: 'bold' }}>
                          OR
                        </Typography>
                      </Grid>
                      {/* 3rd */}
                      <Grid item xs={12} md={10} lg={5}>
                        <Box marginTop={2}>
                          <Accordion>
                            <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                              Property Like
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Property Like"
                                checked={nameLikePropertyWardChecked}
                                onChange={handleCheckboxChangesPropertyWard}
                              />
                              <Grid container spacing={2} sx={{ marginTop: 0.1 }}>
                                <Grid item xs={6} sm={6} mb={1} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                                  <Stack sx={{ width: '100%' }}>
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
                                      value={selectedPropertyList}
                                      error={!!error.selectedPropertyList}
                                      helperText={error.selectedPropertyList}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      onChange={handleChangePropertyList}
                                    >
                                      {wardListProperty.map((ward) => (
                                        <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                          {ward.NewWardNo}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Stack>
                                </Grid>
                                <Grid item xs={6} sm={6} style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                                  <Stack sx={{ width: '100%' }}>
                                    <InputLabel>Property No.</InputLabel>
                                    <Select
                                      MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 150,
                                            overflowY: 'auto'
                                          }
                                        }
                                      }}
                                      value={selectedPropertyDesc}
                                      error={!!error.selectedPropertyDesc}
                                      helperText={error.selectedPropertyDesc}
                                      FormHelperTextProps={{ style: { color: 'red' } }}
                                      onChange={handlePropertyProChange}
                                    >
                                      {propertyNoPropertyList.map((property, index) => (
                                        <MenuItem key={index} value={property.OwnerID}>
                                          {property.NewPropertyNo}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </Stack>
                                </Grid>
                              </Grid>

                              {/* button */}
                              <Grid item xs={12} md={1} lg={12} mb={1}>
                                <Grid container justifyContent="center" alignItems="center">
                                  <Stack spacing={1} sx={{ textAlign: 'center' }}>
                                    <Button variant="contained" color="success" size="large" onClick={handleShowPropertyClick}>
                                      Show Description
                                    </Button>
                                  </Stack>
                                </Grid>
                              </Grid>
                              {/* Table */}
                              {showPropertyTable && (
  <Box sx={{ overflowX: 'auto', height: '200px' }}>
    <Table>
      <TableHead style={{ backgroundColor: '#F5F5F5' }}>
        <TableRow>
          <TableCell>Owner Id</TableCell>
          <TableCell>Property Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {jointDetailsDescription.length === 1 && (
  <TableRow key={jointDetailsDescription[0].OwnerID}>
    <TableCell>{jointDetailsDescription[0].OwnerID}</TableCell>
    <TableCell>{jointDetailsDescription[0].PropertyDescription}</TableCell>
  </TableRow>
)}
      </TableBody>
    </Table>
  </Box>
)}

                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container justifyContent="center" alignItems="center" marginTop={3}>
                      <Stack spacing={1} direction="row">
                        <Button variant="contained" color="success" size="large" onClick={handleApplyChangesPropDesc}>
                          Apply Changes
                        </Button>
                        <Button variant="contained" color="success" size="large" onClick={handleCancelPropDesc}>
                          Cancel Changes
                        </Button>
                      </Stack>
                    </Grid>
                    {showExitProperty && (
                      <>
                        <Grid item xs={12} md={5} lg={12}>
                          <Card>
                            <CardContent>
                              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                                Update Property Type
                              </Typography>
                              <Box sx={{ overflowX: 'auto', height: '300px' }}>
                                {/* Table */}
                                <Table>
                                  {/* Table Header */}
                                  <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                    <TableRow>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Ward No.</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>property No</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Partition No.</TableCell>
                                      <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}>Property Description</TableCell>
                                    </TableRow>
                                  </TableHead>

                                  {/* Table Body */}
                                  <TableBody>
                                    {existingPropertyDescriptionShow.length > 0 &&
                                      existingPropertyDescriptionShow.map((details, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell>{details.NewWardNo}</TableCell>
                                            <TableCell>{details.NewPropertyNo}</TableCell>
                                            <TableCell>{details.NewPartitionNo}</TableCell>
                                            <TableCell>{details.PropertyDescription}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </>
                    )}
                  </>
                )}
                {/* 3rd */}
                {selectedOverlay === 'UpdateShop' && (
                  <>
                    <Grid item xs={12} md={5} lg={6}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                        Select Property Type:
                      </Typography>
                      <Grid container justifyContent="center" alignItems="center" mt={2}>
                        <Grid
                          container
                          spacing={1}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>Ward No</InputLabel>
                              <Select
                                id="ward-select"
                                placeholder="ward no"
                                error={!!error.selectedShopWard}
                                helperText={error.selectedShopWard}
                                value={selectedShopWard}
                                onChange={handleShopWardChange}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 150,
                                      overflowY: 'auto'
                                    }
                                  }
                                }}
                                disabled={accessLevel < 3}
                              >
                                {wardList.slice().sort((a,b)=> a.NewWardNo - b.NewWardNo).map((ward) => (
                                  <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                    {ward.NewWardNo}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel id="demo-number-select-label">From Properties</InputLabel>
                              <FormControl fullWidth>
                                <Select
                                  id="ward-select"
                                  placeholder="ward no"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 150,
                                        overflowY: 'auto'
                                      }
                                    }
                                  }}
                                  disabled={accessLevel < 3}
                                  error={!!error.selectedPropertyNoShopFrom}
                                  helperText={error.selectedPropertyNoShopFrom}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  value={selectedPropertyNoShopFrom}
                                  onChange={handlePropertyShopChangeFrom}
                                >
                                  {propertyNoListFrom.slice().sort((a,b)=>a.NewPropertyNo - b.NewPropertyNo).map((property, index) => (
                                    <MenuItem key={index} value={property.NewPropertyNo}>
                                      {' '}
                                      {/* Use the correct property name */}
                                      {property.NewPropertyNo}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel id="demo-number-select-label">To Properties</InputLabel>
                              <FormControl fullWidth>
                                <Select
                                  id="ward-select"
                                  placeholder="ward no"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 150,
                                        overflowY: 'auto'
                                      }
                                    }
                                  }}
                                  disabled={accessLevel < 3}
                                  error={!!error.selectedPropertyNoShopTo}
                                  helperText={error.selectedPropertyNoShopTo}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  value={selectedPropertyNoShopTo}
                                  onChange={handlePropertyShopChangeTo}
                                >
                                  {propertyNoListTo.slice().sort((a,b)=>a.NewPropertyNo - b.NewPropertyNo).map((property, index) => (
                                    <MenuItem key={index} value={property.NewPropertyNo}>
                                      {' '}
                                      {/* Use the correct property name */}
                                      {property.NewPropertyNo}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={2.2}>
                            <Stack spacing={1}>
                              <Box
                                style={{
                                  maxHeight: '130px',
                                  overflowY: 'auto',
                                  marginTop: '29px',
                                  border: '1px solid #ccc'
                                }}
                              >
                                <Box className="form-check">
                                  <label htmlFor="select-all">
                                    <Checkbox
                                      id="select-all"
                                      checked={selectAllShop}
                                      onChange={handleSelectAllShopChange}
                                      disabled={accessLevel < 3}
                                    />
                                    All
                                  </label>
                                </Box>
                                {propertyRangeShopList &&
                                  propertyRangeShopList.length > 0 &&
                                  propertyRangeShopList.map((property, index) => (
                                    <Box key={index} className="form-check">
                                      <label htmlFor={`property-${index}`}>
                                        <Checkbox
                                          id={`property-${index}`}
                                          value={property.OwnerID}
                                          checked={selectedShopOwnerIds.includes(property.OwnerID)} // Check if the property is selected
                                          onChange={(event) => handlePropertySelectShopChange(event, property)} // Update the ownerIds on change
                                          disabled={accessLevel < 3}
                                        />
                                        {/* Display the `prop` field */}
                                        {property.prop || 'N/A'}
                                      </label>
                                    </Box>
                                  ))}
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Box marginTop={4}>
                          <Grid
                            container
                            spacing={1}
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                              height: '100%'
                            }}
                          >
                            <Grid item xs={12} sm={8}>
                              <Stack spacing={1}>
                                <Button variant="contained" color="success" onClick={handleToggleExitshop}>
                                  Show
                                </Button>
                              </Stack>
                            </Grid>{' '}
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* after6 */}
                    <Grid item xs={12} md={5} lg={6}>
                      <Box boxShadow={3} padding>
                        <Grid container justifyContent="center" alignItems="center" mt={2}>
                          <Grid
                            container
                            spacing={1}
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                              height: '100%'
                            }}
                          >
                            <Grid item xs={12} sm={6} mb={2}>
                              <Stack spacing={1}>
                                <InputLabel>Enter Shop Name In English</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  autoComplete="family-name"
                                  name="BuildingOrShopName"
                                  value={shop.BuildingOrShopName}
                                  onChange={handleShopChange}
                                  error={!!error.BuildingOrShopName}
                                  helperText={error.BuildingOrShopName}
                                                                  disabled={accessLevel < 3}

                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                 // placeholder="Enter Shop Name  In English"
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6} mb={2}>
                            <Stack spacing={1}>
                              <InputLabel>Enter Shop Name In Marathi</InputLabel>

                              <TextField
                                required
                                fullWidth
                                autoComplete="family-name"
                                name="BuildingOrShopNameMarathi"
                                value={shop.BuildingOrShopNameMarathi}
                                onChange={handleShopChange}
                                error={!!error.BuildingOrShopNameMarathi}
                                helperText={error.BuildingOrShopNameMarathi}
                                FormHelperTextProps={{ style: { color: 'red' } }}
                               // placeholder="Enter Shop Name  In Marathi"
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center" marginTop={3}>
                      <Stack spacing={1} direction="row">
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleApplyChangesShop}
                          disabled={accessLevel < 3}
                        >
                          Apply Changes
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleCancelChangesShop}
                          disabled={accessLevel < 3}
                        >
                          Cancel Changes
                        </Button>
                      </Stack>
                    </Grid>
                    {/* table */}
                    <Grid item xs={12} md={5} lg={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                            Update Shop Name
                          </Typography>
                          <Box sx={{ overflowX: 'auto', height: '300px' }}>
                            {/* Table */}
                            <Table>
                              {/* Table Header */}
                              <TableHead>
                                <TableRow>
                                  <TableCell>Ward No.</TableCell>
                                  <TableCell> Property No.</TableCell>
                                  <TableCell>Partition No.</TableCell>
                                  <TableCell> Shop Name</TableCell>
                                  <TableCell> दुकान इमारतीचे नाव</TableCell>
                                </TableRow>
                              </TableHead>
                              {/* Table Body */}
                              {showExitShop && (
  <TableBody>
    {existingPropertyShop.length === 0 ? (
      <TableRow>
        <TableCell colSpan={5} align="center">
          No records found
        </TableCell>
      </TableRow>
    ) : (
      existingPropertyShop.map((details, index) => (
        <TableRow key={index}>
          <TableCell>{details.NewWardNo}</TableCell>
          <TableCell>{details.NewPropertyNo}</TableCell>
          <TableCell>{details.NewPartitionNo}</TableCell>
          <TableCell>{details.BuildingOrShopName}</TableCell>
          <TableCell>{details.BuildingOrShopNameMarathi}</TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
)}

                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </>
                )}

                {/* 4th */}
                {selectedOverlay === 'UpdateCommonRemark' && (
                  <>
                    <Grid item xs={12} md={5} lg={6}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                        Select Property Type:
                      </Typography>
                      <Grid container justifyContent="center" alignItems="center" mt={2}>
                        <Grid
                          container
                          spacing={1}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>Ward No</InputLabel>
                              <Select
                                id="ward-select"
                                placeholder="ward no"
                                value={selectedCommRemarkWard}
                                onChange={handleCommRemarkWardChange}
                                error={!!error.selectedCommRemarkWard}
                                helperText={error.selectedCommRemarkWard}
                                FormHelperTextProps={{ style: { color: 'red' } }}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 150,
                                      overflowY: 'auto'
                                    }
                                  }
                                }}
                              >
                                {wardList.slice().sort((a,b)=>a.NewWardNo - b.NewWardNo).map((ward) => (
                                  <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                    {ward.NewWardNo}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel id="demo-number-select-label">From Properties</InputLabel>
                              <FormControl fullWidth>
                                <Select
                                  id="ward-select"
                                  placeholder="ward no"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 150,
                                        overflowY: 'auto'
                                      }
                                    }
                                  }}
                                  error={!!error.selectedPropertyNoCommRemarkFrom}
                                  helperText={error.selectedPropertyNoCommRemarkFrom}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  value={selectedPropertyNoCommRemarkFrom}
                                  onChange={handlePropertyCommRemarkChangeFrom}
                                >
                                  {propertyNoListFrom.slice().sort((a,b)=>a.NewPropertyNo - b.NewPropertyNo).map((property, index) => (
                                    <MenuItem key={index} value={property.NewPropertyNo}>
                                      {' '}
                                      {/* Use the correct property name */}
                                      {property.NewPropertyNo}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel id="demo-number-select-label">To Properties</InputLabel>
                              <FormControl fullWidth>
                                <Select
                                  id="ward-select"
                                  placeholder="ward no"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 150,
                                        overflowY: 'auto'
                                      }
                                    }
                                  }}
                                  error={!!error.selectedPropertyNoCommRemarkTo}
                                  helperText={error.selectedPropertyNoCommRemarkTo}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  value={selectedPropertyNoCommRemarkTo}
                                  onChange={handlePropertyCommRemarkChangeTo}
                                >
                                  {propertyNoListTo.slice().sort((a,b)=>a.NewPropertyNo - b.NewPropertyNo).map((property, index) => (
                                    <MenuItem key={index} value={property.NewPropertyNo}>
                                      {' '}
                                      {/* Use the correct property name */}
                                      {property.NewPropertyNo}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={2.2}>
                            <Stack spacing={1}>
                              <Box
                                style={{
                                  maxHeight: '130px',
                                  overflowY: 'auto',
                                  marginTop: '29px',
                                  border: '1px solid #ccc'
                                }}
                              >
                                <Box className="form-check">
                                  <label htmlFor="select-all">
                                    <Checkbox id="select-all" checked={selectAllCommRemark} onChange={handleSelectAllCommRemarkChange} />
                                    All
                                  </label>
                                </Box>
                                {propertyRangeCommRemarkList &&
                                  propertyRangeCommRemarkList.length > 0 &&
                                  propertyRangeCommRemarkList.map((property, index) => (
                                    <Box key={index} className="form-check">
                                      <label htmlFor={`property-${index}`}>
                                        <Checkbox
                                          id={`property-${index}`}
                                          value={property.OwnerID}
                                          checked={selectedCommRemarkOwnerIds.includes(property.OwnerID)}
                                          onChange={(event) => handlePropertySelectCommRemarkChange(event, property)}
                                        />
                                        {/* Display the `prop` field */}
                                        {property.prop || 'N/A'}
                                      </label>
                                    </Box>
                                  ))}
                              </Box>
                            </Stack>
                          </Grid>
                          <Box marginTop={4}>
                            <Grid
                              container
                              spacing={1}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%'
                              }}
                            >
                              <Grid item xs={12} sm={8}>
                                <Stack spacing={1}>
                                  <Button variant="contained" color="success" onClick={handleToggleExitCommonRemark}>
                                    Show
                                  </Button>
                                </Stack>
                              </Grid>{' '}
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* after6 */}
                    <Grid item xs={12} md={5} lg={6} mt={3}>
                      <Box boxShadow={3} padding>
                        <Grid container justifyContent="center" alignItems="center" mt={2}>
                          <Grid
                            container
                            spacing={1}
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                              height: '100%'
                            }}
                          >
                            <Grid item xs={12} sm={5} mb={2}>
                              <Stack spacing={1}>
                                <InputLabel>East</InputLabel>

                                <TextField
                                  required
                                  fullWidth
                                  autoComplete="family-name"
                                  onChange={handleCommonRemarkChange}
                                  name="DirectionEast"
                                  error={!!error.DirectionEast}
                                  helperText={error.DirectionEast}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  value={commonRemark.DirectionEast}
                                  placeholder="Enter Remark"
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={5} mb={2}>
                              <Stack spacing={1}>
                                <InputLabel>West</InputLabel>

                                <TextField
                                  required
                                  fullWidth
                                  autoComplete="family-name"
                                  onChange={handleCommonRemarkChange}
                                  name="DirectionWest"
                                  error={!!error.DirectionWest}
                                  helperText={error.DirectionWest}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  value={commonRemark.DirectionWest}
                                  placeholder="Enter Remark"
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            spacing={1}
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                              height: '100%'
                            }}
                          >
                            <Grid item xs={12} sm={5} mb={2}>
                              <Stack spacing={1}>
                                <InputLabel>North</InputLabel>

                                <TextField
                                  required
                                  fullWidth
                                  autoComplete="family-name"
                                  onChange={handleCommonRemarkChange}
                                  name="DirectionNorth"
                                  value={commonRemark.DirectionNorth}
                                  error={!!error.DirectionNorth}
                                  helperText={error.DirectionNorth}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  placeholder="Enter Remark"
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={5} mb={2}>
                              <Stack spacing={1}>
                                <InputLabel>South</InputLabel>

                                <TextField
                                  required
                                  fullWidth
                                  autoComplete="family-name"
                                  onChange={handleCommonRemarkChange}
                                  name="DirectionSouth"
                                  error={!!error.DirectionSouth}
                                  helperText={error.DirectionSouth}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  value={commonRemark.DirectionSouth}
                                  placeholder="Enter Remark"
                                />
                              </Stack>
                            </Grid>{' '}
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          spacing={2}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                          }}
                        ></Grid>
                      </Box>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center" marginTop={3}>
                      <Stack spacing={1} direction="row">
                        <Button variant="contained" color="success" size="large" onClick={handleApplyChangesCommonRemark}>
                          Apply Changes
                        </Button>
                        <Button variant="contained" color="success" size="large" onClick={handleCancelCommonRemark}>
                          Cancel Changes
                        </Button>
                      </Stack>
                    </Grid>
                    {/* table */}
                    <Grid item xs={12} md={5} lg={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                            Update Common Remark Type
                          </Typography>
                          <Box sx={{ overflowX: 'auto', height: '300px' }}>
                            {/* Table */}
                            <Table>
                              {/* Table Header */}
                              <TableHead>
                                <TableRow>
                                  <TableCell>Ward No.</TableCell>
                                  <TableCell>property No</TableCell>
                                  <TableCell>Partition No.</TableCell>
                                  <TableCell> पुर्व</TableCell>
                                  <TableCell> पश्चिम</TableCell>
                                  <TableCell> उत्तर</TableCell>
                                  <TableCell> दक्षिण</TableCell>
                                </TableRow>
                              </TableHead>
                              {showExitCommonRemark && (
  <TableBody>
    {existingCommonRemarkDetails.length === 0 ? (
      <TableRow>
        <TableCell colSpan={7} align="center">
          No records found
        </TableCell>
      </TableRow>
    ) : (
      existingCommonRemarkDetails.map((details, index) => (
        <TableRow key={index}>
          <TableCell>{details.NewWardNo}</TableCell>
          <TableCell>{details.NewPropertyNo}</TableCell>
          <TableCell>{details.NewPartitionNo}</TableCell>
          <TableCell>{details.DirectionEast || ''}</TableCell>
          <TableCell>{details.DirectionWest || ''}</TableCell>
          <TableCell>{details.DirectionNorth || ''}</TableCell>
          <TableCell>{details.DirectionSouth || ''}</TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
)}

                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </>
                )}

                {/* 6th */}
                {/* 6th */}
                {selectedOverlay === 'UpdateWadhGhatRemark' && (
                  <>
                    <Grid item xs={12} md={5} lg={6}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                        Select Property Type:
                      </Typography>
                      <Grid container justifyContent="center" alignItems="center" mt={2}>
                        <Grid
                          container
                          spacing={1}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel>Ward No</InputLabel>
                              <Select
                                id="ward-select"
                                placeholder="ward no"
                                value={selectedWadhGhatWard}
                                onChange={handleWadhGhatWardChange}
                                error={!!error.selectedWadhGhatWard}
                                helperText={error.selectedWadhGhatWard}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 150,
                                      overflowY: 'auto'
                                    }
                                  }
                                }}
                              >
                                {wardList.slice().sort((a,b)=>a.NewWardNo - b.NewWardNo).map((ward) => (
                                  <MenuItem key={ward.NewWardNo} value={ward.NewWardNo}>
                                    {ward.NewWardNo}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel id="demo-number-select-label">From Properties</InputLabel>
                              <FormControl fullWidth>
                                <Select
                                  id="ward-select"
                                  placeholder="ward no"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 150,
                                        overflowY: 'auto'
                                      }
                                    }
                                  }}
                                  value={selectedPropertyNoWadhGhatFrom}
                                  error={!!error.selectedPropertyNoWadhGhatFrom}
                                  helperText={error.selectedPropertyNoWadhGhatFrom}
                                  onChange={handlePropertyWadhGhatChangeFrom}
                                >
                                  {propertyNoListFrom.slice().sort((a,b)=>a.NewPropertyNo - b.NewPropertyNo).map((property, index) => (
                                    <MenuItem key={index} value={property.NewPropertyNo}>
                                      {' '}
                                      {/* Use the correct property name */}
                                      {property.NewPropertyNo}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <InputLabel id="demo-number-select-label">To Properties</InputLabel>
                              <FormControl fullWidth>
                                <Select
                                  id="ward-select"
                                  placeholder="ward no"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 150,
                                        overflowY: 'auto'
                                      }
                                    }
                                  }}
                                  error={!!error.selectedPropertyNoWadhGhatTo}
                                  helperText={error.selectedPropertyNoWadhGhatTo}
                                  value={selectedPropertyNoWadhGhatTo}
                                  onChange={handlePropertyWadhGhatChangeTo}
                                >
                                  {propertyNoListTo.slice().sort((a,b)=>a.NewPropertyNo -b.NewPropertyNo).map((property, index) => (
                                    <MenuItem key={index} value={property.NewPropertyNo}>
                                      {' '}
                                      {/* Use the correct property name */}
                                      {property.NewPropertyNo}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={2.2}>
                            <Stack spacing={1}>
                              <Box
                                style={{
                                  maxHeight: '130px',
                                  overflowY: 'auto',
                                  marginTop: '29px',
                                  border: '1px solid #ccc'
                                }}
                              >
                                <Box className="form-check">
                                  <label htmlFor="select-all">
                                    <Checkbox id="select-all" checked={selectAllWadhGhat} onChange={handleSelectAllWadhGhatChange} />
                                    All
                                  </label>
                                </Box>
                                {propertyRangeWadhGhatList &&
                                  propertyRangeWadhGhatList.length > 0 && // Check if the array has items
                                  propertyRangeWadhGhatList.map((property, index) => (
                                    <Box key={index} className="form-check">
                                      <label htmlFor={`property-${index}`}>
                                        <Checkbox
                                          id={`property-${index}`}
                                          value={property.OwnerID}
                                          checked={selectedWadhGhatOwnerIds.includes(property.OwnerID)} // Check if the property is selected
                                          onChange={(event) => handlePropertySelectWadhGhatChange(event, property)} // Update the ownerIds on change
                                        />
                                        {/* Use the correct property name */}
                                        {property.NewPropertyNo}
                                      </label>
                                    </Box>
                                  ))}
                              </Box>
                            </Stack>
                          </Grid>
                          <Box marginTop={4}>
                            <Grid
                              container
                              spacing={1}
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%'
                              }}
                            >
                              <Grid item xs={12} sm={8}>
                                <Stack spacing={1}>
                                  <Button variant="contained" color="success" onClick={handleToggleExitWadhGhat}>
                                    Show
                                  </Button>
                                </Stack>
                              </Grid>{' '}
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* after6 */}
                    <Grid item xs={12} md={5} lg={6} mt={3}>
                      <Box boxShadow={3} padding>
                        <Grid container justifyContent="center" alignItems="center" mt={2}>
                          <Grid
                            container
                            spacing={1}
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100%',
                              height: '100%'
                            }}
                          >
                            <Grid item xs={12} sm={6} mb={2}>
                              <Stack spacing={1}>
                                <InputLabel>WadhGhatRemark One</InputLabel>
                                <TextField
                                  required
                                  fullWidth
                                  onChange={handleWadhGhatChange}
                                  name="WadhGhatRemarkOne"
                                  value={wadhGhat.WadhGhatRemarkOne}
                                  autoComplete="family-name"
                                  error={!!error.WadhGhatRemarkOne}
                                  helperText={error.WadhGhatRemarkOne}
                                  FormHelperTextProps={{ style: { color: 'red' } }}
                                  placeholder="WadhGhatRemark One"
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6} mb={2}>
                            <Stack spacing={1}>
                              <InputLabel>WadhGhatRemark Two</InputLabel>

                              <TextField
                                required
                                fullWidth
                                onChange={handleWadhGhatChange}
                                name="WadhGhatRemarkTwo"
                                value={wadhGhat.WadhGhatRemarkTwo}
                                autoComplete="family-name"
                                error={!!error.WadhGhatRemarkTwo}
                                helperText={error.WadhGhatRemarkTwo}
                                FormHelperTextProps={{ style: { color: 'red' } }}
                                placeholder="WadhGhatRemark Two"
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                          }}
                        ></Grid>
                      </Box>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center" marginTop={3}>
                      <Stack spacing={1} direction="row">
                        <Button variant="contained" color="success" size="large" onClick={handleApplyChangesWadhGhat}>
                          Apply Changes
                        </Button>
                        <Button variant="contained" color="success" size="large" onClick={handleCancelWadhGhat}>
                          Cancel Changes
                        </Button>
                      </Stack>
                    </Grid>
                    {/* table */}
                    <Grid item xs={12} md={5} lg={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                            Update WadhGhat Remark
                          </Typography>
                          <Box sx={{ overflowX: 'auto', height: '300px' }}>
                            {/* Table */}
                            <Table>
                              {/* Table Header */}
                              <TableHead style={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell>Ward No.</TableCell>
                                  <TableCell>From property No</TableCell>
                                  <TableCell> To Partition No.</TableCell>
                                  <TableCell>WadhGhatRemark One</TableCell>
                                  <TableCell>WadhGhatRemark Two</TableCell>
                                </TableRow>
                              </TableHead>
                              {/* Table Body */}
                              {showExitWadhGhat && (
  <TableBody>
    {wadhGhatDetails.length === 0 ? (
      <TableRow>
        <TableCell colSpan={5} align="center">
          No records found
        </TableCell>
      </TableRow>
    ) : (
      wadhGhatDetails.map((details, index) => (
        <TableRow key={index}>
          <TableCell>{details.NewWardNo}</TableCell>
          <TableCell>{details.NewPropertyNo}</TableCell>
          <TableCell>{details.NewPartitionNo}</TableCell>
          <TableCell>{details.WadhGhatRemarkOne}</TableCell>
          <TableCell>{details.WadhGhatRemarkTwo}</TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
)}

                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </>
                )}
                {/* end */}
              </Grid>
            </Grid>
            {/* WadhGhat */}
            <Snackbar
              open={snackbarOpenWadhGhat}
              autoHideDuration={6000}
              onClose={handleCloseSnackbarWadhGhat}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <SnackbarContent
                sx={{
                  backgroundColor: snackbarSeverityWadhGhat === 'success' ? 'green' : 'red'
                }}
                message={snackbarMessageWadhGhat}
              />
            </Snackbar>
            {/* Common Remark */}
            <Snackbar
              open={snackbarOpenCommonRemark}
              autoHideDuration={6000}
              onClose={handleCloseSnackbarCommonRemark}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <SnackbarContent
                sx={{
                  backgroundColor: snackbarSeverityCommonRemark === 'success' ? 'green' : 'red'
                }}
                message={snackbarMessageCommonRemark}
              />
            </Snackbar>
            {/* Shop */}
            <Snackbar
              open={snackbarOpenShop}
              autoHideDuration={6000}
              onClose={handleCloseSnackbarShop}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <SnackbarContent
                sx={{
                  backgroundColor: snackbarSeverityShop === 'success' ? 'green' : 'red'
                }}
                message={snackbarMessageShop}
              />
            </Snackbar>
            {/* ProDesc */}
            <Snackbar
              open={snackbarOpenProDesc}
              autoHideDuration={6000}
              onClose={handleCloseSnackbarProDesc}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <SnackbarContent
                sx={{
                  backgroundColor: snackbarSeverityProDesc === 'success' ? 'green' : 'red'
                }}
                message={snackbarMessageProDesc}
              />
            </Snackbar>
            {/* Road */}
            <Snackbar
              open={snackbarOpenRoad}
              autoHideDuration={6000}
              onClose={handleCloseSnackbarRoad}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <SnackbarContent
                sx={{
                  backgroundColor: snackbarSeverityRoad === 'success' ? 'green' : 'red'
                }}
                message={snackbarMessageRoad}
              />
            </Snackbar>

            {/* Address */}
            <Snackbar
              open={snackbarOpenAddress}
              autoHideDuration={6000}
              onClose={handleCloseSnackbarAddress}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <SnackbarContent
                sx={{
                  backgroundColor: snackbarSeverityAddress === 'success' ? 'green' : 'red'
                }}
                message={snackbarMessageAddress}
              />
            </Snackbar>
            {/* Owner */}
            <Snackbar
              open={snackbarOpenOwner}
              autoHideDuration={6000}
              onClose={handleCloseSnackbarOwner}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <SnackbarContent
                sx={{
                  backgroundColor: snackbarSeverityOwner === 'success' ? 'green' : 'red'
                }}
                message={snackbarMessageOwner}
              />
            </Snackbar>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

export default UpdatePropertyAddress;
