import { Box, Button, Grid, InputLabel, Snackbar, Alert, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { EditTwoTone, SendOutlined } from '@ant-design/icons';

import { useState, useEffect, useCallback } from 'react';
import { Table, SnackbarContent, TableBody, TableCell, TableContainer, TableHead, TableRow,IconButton } from '@mui/material';

import {
  addUpdateRates,
  deleteDeprRate,
  deleteDeprRateById,
  getAllDepreciationMasters,
  getConstructionTypes,
  getRangeValues,
  getYears
} from 'services/masterServices/depreciationservices/depreciation.services';

import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { fetchNpTitle } from 'services/mutation.services';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function Depreciation() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarMessageDeleteSingleRate, setSnackbarMessageDeleteSingleRate] = useState('');
  const [value, setValue] = useState(0);
  const [constructionsList, setConstructionsList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [minYear, setMinYear] = useState();
  const [maxYear, setMaxYear] = useState();
  const [years_list, setYearsList] = useState([]);
  const [depr_years_list, setDepr_YearsList] = useState([]);
  const [rangeValues, setRangeValues] = useState([]);
  const [allDeprMasterData, setAllDeprMasterData] = useState([]);
  const [showDepChartTable, setShowDepChartTable] = useState(false);
  const [rateYear, setRateYear] = useState('');
  const [showAddRangeButton, setShowAddRangeButton] = useState(false);
  //response messages

  const [isOpen, setIsOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');

  const [snackbarOpenGen, setSnackbarOpenGen] = useState(false);

  const [snackbarOpenUpdateRates, setSnackbarOpenUpdateRates] = useState(false);

 const [snackbarOpenDeleteSingleRate, setSnackbarOpenDeleteSingleRate] = useState(false);
  
  const [receivedMessageUpdateRates, setReceivedMessageUpdateRates] = useState('');

const [receivedMessageSingleDeleteRate, setReceivedMessageSingleDeleteRate] = useState('');

  const [snackbarOpenDeleteRates, setSnackbarOpenDeleteRates] = useState(false);
  const [snackbarOpenDeleteRate, setSnackbarOpenDeleteRate] = useState(false);

  const [snackbarMessageGen, setSnackbarMessageGen] = useState('');

  const [snackbarOpenAddRate, setSnackbarOpenAddRate] = useState(false);
  const [snackbarMessageAddRate, setSnackbarMessageAddRate] = useState('');

  const [snackbarMessageUpdateRate, setSnackbarMessageUpdateRate] = useState('');
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

   const [dialogDeleteOpenSingleRate, setDialogDeleteOpenSingleRate] = useState(false);
  const [dialogDeleteOpenRate, setDialogDeleteOpenRate] = useState(false);

  // pop-up
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeprDialog, setOpenDeprDialog] = useState(false);
  const [openUpdateDeprDialog, setOpenUpdateDeprDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(years_list[0]?.Year || '');
  const [errors, setErrors] = useState({});
  const [temRangeList, setTemRangeList] = useState([]);
  const [deprData, setDeprData] = useState({
    ID: 0,
    depYear: '',
    ConstructionId: '',
    minDeprYear: '',
    maxDeprYear: '',
    deprRate: ''
  });

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Depreciation';
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

  console.log(permissionAccess,"permissionAccess for dep page")

  useEffect(() => {
    if (permissionAccess?.AccessID) {
      const access = permissionAccess.AccessID;

      console.log(access, 'assigned access to Depreciation Page');

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

  const validationSchemaSingleRate = Yup.object().shape({
    depYear: Yup.string().required('Year is required'),
    ConstructionId: Yup.string().required('ConstructionId is required'),
    minDeprYear: Yup.string().required('minDeprYear is required'),
    maxDeprYear: Yup.string().required('maxDeprYear is required'),
    deprRate: Yup.string().required('deprRate is required')
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseSnackbarGen = () => {
    setSnackbarOpenGen(false);
  };

    const handleCloseSnackbarUpdateRates = () => {
    setSnackbarOpenUpdateRates(false);
  };

    const handleCloseSnackbarDeleteSingleRate = () => {
   setSnackbarOpenDeleteSingleRate(false);
  };

  const handleCloseSnackbarDeleteRates = () => {
    setSnackbarOpenDeleteRates(false);
  };

  const handleCloseSnackbarDeleteRate = () => {
    setSnackbarOpenDeleteRate(false);
  };

  const handleCloseSnackbarUpdateRate = () => {
    setSnackbarOpenUpdateRate(false);
  };

  // const validationSchemaRatesByChart = Yup.object().shape({
  //   minYear: Yup.number().required('Min year is required'),
  //   maxYear: Yup.number().required('Max year is required'),
  //   rateYear: Yup.string().required('rate year is required')
  // });
  const validationSchemaRatesByChart = Yup.object().shape({
  minYear: Yup.number()
    .typeError("Min Year must be a number")
    .min(0, "Min Year cannot be negative")
    .max(999, "Min Year cannot exceed 999")
    .required("Min Year is required"),
  maxYear: Yup.number()
    .typeError("Max Year must be a number")
    .min(0, "Max Year cannot be negative")
    .max(999, "Max Year cannot exceed 999")
    .required("Max Year is required"),
  rateYear: Yup.number()
    .typeError("Rate Year must be a number")
    .required("Rate Year is required"),
});

  const handleNumberMBInput = (event) => {
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
      console.log('rate year cannot exceed 4 digits');
    } else {
      console.log(''); // Clear error message on valid input
    }
  };

  const handleRateYearChange = (e) => {
    const value = e.target.value;
    console.log(value, 'current year');
    setRateYear(value);
    fetchDepreciationData(value);
    // Check if the value is less than 4 digits and show an error
    if (value.length > 0 && value.length < 4) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        rateYear: 'Rate year cannot be less than 4 digits'
      }));
    } else if (value.length === 4) {
      // Clear error when a valid 4-digit year is entered
      setErrors((prevErrors) => ({
        ...prevErrors,
        rateYear: ''
      }));
    }
  };

  const handleYearKeyDown = (event) => {
    const { value } = event.target;

    // Allow only numbers, Backspace, Tab, and Arrow keys
    if (!/[0-9]/.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }

    // Restrict input to 4 digits
    if (value.length >= 4 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  };



const [receivedUpdateMessage, setReceivedUpdateMessage] = useState('');
const [snackbarOpenUpdateRate, setSnackbarOpenUpdateRate] = useState(false);


  const validateYears = (min, max) => {
  let newErrors = {};

  if (!min) {
    newErrors.minYear = 'Min value is required';
  }
  if (!max) {
    newErrors.maxYear = 'Max value is required';
  }
  if (min && max) {
    if (Number(min) > Number(max)) {
      newErrors.minYear = 'Min value cannot be greater than Max value';
    }
    if (Number(max) < Number(min)) {
      newErrors.maxYear = 'Max value cannot be less than Min value';
    }
  }

  setErrors(newErrors);
};
  const handleMinYearChange = (event) => {
    const value = event.target.value;
    setMinYear(value);

    // Validation for minYear
    validateYears(value, maxYear); 
    setShowAddRangeButton(value && maxYear ? true : false);
  };

  const handleMaxYearChange = (event) => {
    const value = event.target.value;
    setMaxYear(value);

    // Validation for maxYear
    validateYears(minYear, value); 
    setShowAddRangeButton(minYear && value ? true : false);
  };




  const handleKeyDown = (event) => {
    // Prevents non-numeric input
    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  };


  
  
 
 
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const data = await getYears();
        setYearsList(data, 'years list from db');
        setDepr_YearsList(data, 'depr list from db');
      } catch (error) {
        console.log(error);
      }
    };

    fetchYears();
  }, []);
  //to fetch years from db tab1
  useEffect(() => {
    const fetchAllDeprMasterData = async () => {
      try {
        const data = await getAllDepreciationMasters();
        console.log(data, 'all depr master data from db');
        setAllDeprMasterData(data, 'all master data list from db');
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllDeprMasterData();
  }, []);

  //to fetch construction types from db tab 2
  useEffect(() => {
    const fetchConstuctionTypes = async () => {
      try {
        const data = await getConstructionTypes();
        data, 'years list from db';
        setConstructionsList(data, 'constructions type list from db');
      } catch (error) {
        console.log(error);
      }
    };

    fetchConstuctionTypes();
  }, []);

  //tab2
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDeprData({
      ...deprData,
      [name]: value
    });
  };

  // Form validation schema using Yup password prompt
  const validationSchema = Yup.object({
    password: Yup.string().required('Password is required')
  });

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleClickDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //dialoge tab2 update button click
  const handleUpdateDeprClickDialog = () => {
    setOpenUpdateDeprDialog(true);
  };

  const handleCloseUpdateDeprDialog = () => {
    setOpenUpdateDeprDialog(false);
  };

  //dialoge tab2 Add button click
  const handleAddDeprDialog = () => {
    setOpenDeprDialog(true);
  };

  const handleCloseAddDeprDialog = () => {
    setOpenDeprDialog(false);
  };

  //to fetch ranges and their rates from databse
  useEffect(() => {
    fetchDepreciationData(rateYear);
  }, [rateYear]);

  //switching between tab1 & tab2
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [uniqueRangeValues, setUniqueRangeValues] = useState([]);

  //Combine rangeValues with temRangeList
  const handleShowDeprRange = () => {
    // Combine rangeValues with temRangeList
    const allRangeValues = [...rangeValues, ...temRangeList];

    // Filter unique range values
    const uniqueRangeValues = [];
    const seenRanges = new Set();

    allRangeValues.forEach((range) => {
      const key = `${range.MinYear}-${range.MaxYear}`;
      if (!seenRanges.has(key)) {
        seenRanges.add(key);
        uniqueRangeValues.push(range);
      }
    });

    // Update state with unique range values
    setUniqueRangeValues(uniqueRangeValues);
    if (uniqueRangeValues.length > 0) {
      setShowDepChartTable(true);
    } else {
      setSnackbarMessage('Please add a range.');
      setSnackbarOpen(true);
    }
  };

  //show side chart table
  useEffect(() => {
    console.log(showDepChartTable);
  }, [showDepChartTable]);
// const handleAddRange = async () => {
//   const validationErrors = await validationSchemaRatesByChart
//     .validate({ minYear, maxYear, rateYear }, { abortEarly: false })
//     .then(() => null)
//     .catch((err) =>
//       err.inner.reduce((acc, curr) => ({ ...acc, [curr.path]: curr.message }), {})
//     );

//   if (validationErrors) {
//     setErrors(validationErrors);
//     setSnackbarMessage("Please correct the errors before adding the range");
//     setSnackbarOpen(true);
//     return;
//   }

//   if (minYear && maxYear) {
//     const rangeExists = temRangeList.some((range) => {
//       const existingMin = range.MinYear;
//       const existingMax = range.MaxYear;

//       // 1. Exact duplicate
//       if (existingMin === minYear && existingMax === maxYear) return true;

//       // 2. Overlap or touching
//       if (maxYear >= existingMin && minYear <= existingMax) return true;

//       return false;
//     });

//     if (!rangeExists) {
//       const updatedTemRangeList = [
//         ...temRangeList,
//         { MinYear: minYear, MaxYear: maxYear },
//       ];

//       updatedTemRangeList.sort((a, b) => a.MinYear - b.MinYear);

//       setTemRangeList(updatedTemRangeList);
//       setShowDepChartTable(false);
//     } else {
//       setSnackbarMessage("Overlapping, touching, or duplicate range not allowed");
//       setSnackbarOpen(true);
//     }
//   }
// };
  //clear fields tab2 cancel click
 
// const handleAddRange = async () => {
//   const validationErrors = await validationSchemaRatesByChart
//     .validate({ minYear, maxYear, rateYear }, { abortEarly: false })
//     .then(() => null)
//     .catch((err) =>
//       err.inner.reduce((acc, curr) => ({ ...acc, [curr.path]: curr.message }), {})
//     );

//   if (validationErrors) {
//     setErrors(validationErrors);
//     setSnackbarMessage("Please correct the errors before adding the range");
//     setSnackbarOpen(true);
//     return;
//   }

//   if (minYear && maxYear) {
//     const newMin = parseInt(minYear, 10);
//     const newMax = parseInt(maxYear, 10);

//     // ✅ Check: Range length must not exceed 100
//     if (newMax - newMin > 100) {
//       setSnackbarMessage("Range cannot exceed 100 years");
//       setSnackbarOpen(true);
//       return;
//     }
//     // ✅ Check against existing temp ranges
//     const rangeExistsInTemp = temRangeList.some((range) => {
//       const existingMin = parseInt(range.MinYear, 10);
//       const existingMax = parseInt(range.MaxYear, 10);

//       if (existingMin === newMin && existingMax === newMax) return true;
//       if (newMax >= existingMin && newMin <= existingMax) return true;
//       return false;
//     });

//     // ✅ Check against DB ranges
//     const rangeExistsInDb = rangeValues.some((range) => {
//       const existingMin = parseInt(range.MinYear, 10);
//       const existingMax = parseInt(range.MaxYear, 10);

//       if (existingMin === newMin && existingMax === newMax) return true;
//       if (newMax >= existingMin && newMin <= existingMax) return true;
//       return false;
//     });

//     if (rangeExistsInTemp || rangeExistsInDb) {
//       setSnackbarMessage("Overlapping, or duplicate range not allowed");
//       setSnackbarOpen(true);
//       return;
//     }

//     // ✅ If no conflict, add it
//     const updatedTemRangeList = [
//       ...temRangeList,
//       { MinYear: newMin, MaxYear: newMax },
//     ];

//     updatedTemRangeList.sort((a, b) => a.MinYear - b.MinYear);

//     setTemRangeList(updatedTemRangeList);
//     setShowDepChartTable(false);
//   }
// };

 const handleAddRange = async () => {
  // 1️⃣ Validate inputs
  const validationErrors = await validationSchemaRatesByChart
    .validate({ minYear, maxYear, rateYear }, { abortEarly: false })
    .then(() => null)
    .catch((err) =>
      err.inner.reduce((acc, curr) => ({ ...acc, [curr.path]: curr.message }), {})
    );

  if (validationErrors) {
    setErrors(validationErrors);
    setSnackbarMessage("Please correct the errors before adding the range");
    setSnackbarOpen(true);
    return;
  }

  if (minYear && maxYear) {
    const newMin = parseInt(minYear, 10);
    const newMax = parseInt(maxYear, 10);

    // ✅ Optional: enforce max digits (already done by validation schema)
    if (newMin > 999 || newMax > 999) {
      setSnackbarMessage("Year cannot exceed 999");
      setSnackbarOpen(true);
      return;
    }

    // ✅ Optional: keep previous range length limit (uncomment if needed)
    // if (newMax - newMin > 100) {
    //   setSnackbarMessage("Range cannot exceed 100 years");
    //   setSnackbarOpen(true);
    //   return;
    // }

    // 2️⃣ Check overlapping or duplicate ranges in temp list
    const rangeExistsInTemp = temRangeList.some((range) => {
      const existingMin = parseInt(range.MinYear, 10);
      const existingMax = parseInt(range.MaxYear, 10);
      return newMax >= existingMin && newMin <= existingMax;
    });

    // 3️⃣ Check overlapping or duplicate ranges in DB list
    const rangeExistsInDb = rangeValues.some((range) => {
      const existingMin = parseInt(range.MinYear, 10);
      const existingMax = parseInt(range.MaxYear, 10);
      return newMax >= existingMin && newMin <= existingMax;
    });

    if (rangeExistsInTemp || rangeExistsInDb) {
      setSnackbarMessage("Overlapping or duplicate range not allowed");
      setSnackbarOpen(true);
      return;
    }

    // 4️⃣ Add new range to temp list
    const updatedTemRangeList = [
      ...temRangeList,
      { MinYear: newMin, MaxYear: newMax },
    ];

    updatedTemRangeList.sort((a, b) => a.MinYear - b.MinYear);

    setTemRangeList(updatedTemRangeList);
    setShowDepChartTable(false);
  }
  setMinYear("");
  setMaxYear("");

};

  //generate rates for tab1
  const handleGenerateRateClick = async () => {
    console.log('editedRanges:', editedRanges);
    console.log('rangeValues:', rangeValues);

    const ratesArray = editedRanges.flatMap((constType) =>
      uniqueRangeValues.map((range) => {
        const key = `${range.MinYear}-${range.MaxYear}`;
        const rateInput = document.getElementById(`${constType.ConstructionId}-${key}`).value.trim();

        console.log(`Rate input for ${constType.ConstructionId}-${key}:`, rateInput);
        return {
          Year: parseInt(rateYear),
          ConstructionID: constType.ConstructionId,
          MinYear: parseInt(range.MinYear),
          MaxYear: parseInt(range.MaxYear),
          Rate: rateInput === '' ? null : parseFloat(rateInput)

        };
      })
    );

    console.log('Generated rates arrayyyyy:', ratesArray);

    try {
      const response = await addUpdateRates(ratesArray);
      console.log('Ratesii:', response);
      if (response.status === 200 || response.status === 201) {
        setReceivedMessage(response.message);
        //console.log('Received message:', response.message);
        setSnackbarSeverity('success');
        setSnackbarMessageGen(response.message);
        setSnackbarOpenGen(true);
        setRateYear('');
        setMinYear('');
        setMaxYear('');
        cancelClickChartRates();
        setAllDeprMasterData((prevData) => {
          const updatedData = [...prevData, ...ratesArray];
          // Removing duplicates based on Year, ConstructionID, MinYear, and MaxYear
          const uniqueData = updatedData.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.Year === item.Year &&
                  t.ConstructionID === item.ConstructionID &&
                  t.MinYear === item.MinYear &&
                  t.MaxYear === item.MaxYear
              )
          );
          return uniqueData;
        });

        // Update the years_list with the new rate year if it's not already present
        setYearsList((prevYearsList) => {
          const newYear = { Year: rateYear };
          const yearExists = prevYearsList.some((year) => year.Year === newYear.Year);
          return yearExists ? prevYearsList : [...prevYearsList, newYear];
        });
        setRateYear('');
        //setTemRangeList([]);
        //setRangeValues([]);
        //setShowDepChartTable(false);
      } else {
        setReceivedMessage(response.message || 'An error occurred while saving rates');
        setSnackbarSeverity('error');
        setSnackbarMessage(response.message || 'An error occurred while saving rates');
        setSnackbarOpenGen(true);
      }
    } catch (validationErrors) {
      if (validationErrors.inner && validationErrors.inner.length > 0) {
        const formattedErrors = validationErrors.inner.reduce((acc, err) => {
          return { ...acc, [err.path]: err.message };
        }, {});
        setErrors(formattedErrors);
      } else {
        console.error('Validation Error:', validationErrors);
      }
    }
  };

  // //update rates tab 1

  const handleUpdateRates = async () => {
    // Flatten into rate array
    const rawRatesArray = editedRanges.flatMap((constType) =>
      uniqueRangeValues.map((range) => {
        const key = `${range.MinYear}-${range.MaxYear}`;
        const rateInput = document.getElementById(`${constType.ConstructionId}-${key}`).value.trim();

        return {
          Year: parseInt(rateYear),
          ConstructionID: constType.ConstructionId,
          MinYear: parseInt(range.MinYear),
          MaxYear: parseInt(range.MaxYear),
          Rate: rateInput === '' ? null : parseFloat(rateInput)
        };
      })
    );

    console.log('data of existing year rates to be passed', rawRatesArray);

    try {
      const response = await addUpdateRates(rawRatesArray);
      if (response.status === 200 || response.status === 201) {
        //setReceivedMessageUpdateRates(response.message);
        console.log('Received message from back rates array existing updated rates:', response.message);
        setSnackbarSeverity('success');

        setReceivedMessageUpdateRates(response.message || 'Rates updated successfully.');
        setSnackbarOpenUpdateRates(true);


    // Update the table immediately
      setAllDeprMasterData((prevData) => {
        const updatedData = [...prevData];

        rawRatesArray.forEach((newRate) => {
          const index = updatedData.findIndex(
            (item) =>
              item.Year === newRate.Year &&
              item.ConstructionID === newRate.ConstructionID &&
              item.MinYear === newRate.MinYear &&
              item.MaxYear === newRate.MaxYear
          );

          if (index !== -1) {
            // Update existing record
            updatedData[index] = { ...updatedData[index], Rate: newRate.Rate };
          } else {
            // Add new record if not found
            updatedData.push(newRate);
          }
        });

        return updatedData;
      });
        setRateYear('');
        setMinYear('');
        setMaxYear('');
        cancelClickChartRates();
      } else {
        //setReceivedMessage(response.message || 'An error occurred while saving tax data');
        setSnackbarSeverity('error');
        setReceivedMessageUpdateRates(response.message || 'An error occurred while saving tax data');
        setSnackbarOpenUpdateRates(true);
      }
    } catch (validationErrors) {
      if (validationErrors.inner && validationErrors.inner.length > 0) {
        const formattedErrors = validationErrors.inner.reduce((acc, err) => {
          return { ...acc, [err.path]: err.message };
        }, {});
        setErrors(formattedErrors);
      } else {
        console.error('Validation Error:', validationErrors);
      }
    }
  };

  //clear side chart table
  const cancelClickChartRates = () => {
    setMinYear('');
    setMaxYear('');
    setRateYear('');
    setRangeValues([]);
    setTemRangeList([]);
    setErrors({});
  };

  const handleCancelAddRate = () => {
    setDeprData({
      ID: 0,
      depYear: '',
      ConstructionId: '',
      minDeprYear: '',
      maxDeprYear: '',
      deprRate: ''
    });
    setErrors({});
  };

  const handleRowClick = (masterData) => {
    console.log('Row clicked:', masterData); 
    setSelectedRow(masterData);
    setDeprData({
      ID: masterData.ID,
      depYear: masterData.Year,
      ConstructionId: masterData.ConstructionID,
      minDeprYear: masterData.MinYear,
      maxDeprYear: masterData.MaxYear,
      deprRate: masterData.Rate
    });
    console.log('Selected row:', masterData); // Debugging statement
    console.log('Dep data:', {
      ID: masterData.ID,
      depYear: masterData.Year,
      ConstructionId: masterData.ConstructionID,
      minDeprYear: masterData.MinYear,
      maxDeprYear: masterData.MaxYear,
      deprRate: masterData.Rate
    }); // Debugging statement
  };

  //tab2


  const [editedRanges, setEditedRanges] = useState([]);

  const fetchDepreciationData = useCallback(async (Year) => {
    try {
      console.log(Year, 'yr data');
      const data = await getRangeValues(Year);
      console.log('data.rates:', data.rates);
      const uniqueRates = data.rates;
      console.log('uniqueRates:', uniqueRates);
      setRangeValues(uniqueRates || []);
    } catch (err) {
      console.log(err.message);
      setRangeValues([]);
      setShowDepChartTable(false);
    }
  }, []);

  // will show range values from database
  useEffect(() => {
    const allRangeValues = [...rangeValues, ...temRangeList];

    // Filter unique range values
    const uniqueRangeValues = [];
    const seenRanges = new Set();

    allRangeValues.forEach((range) => {
      const key = `${range.MinYear}-${range.MaxYear}`;
      if (!seenRanges.has(key)) {
        seenRanges.add(key);
        uniqueRangeValues.push(range);
      }
    });

    setUniqueRangeValues(uniqueRangeValues);
  }, [rangeValues, temRangeList]);
 

  //olduse effect workng
  useEffect(() => {
    console.log('constructionsList:', constructionsList);
    console.log('rangeValues:', rangeValues);

    const initialRanges = constructionsList.map((constType) => {
      const initialRangeValues = {};
      rangeValues.forEach((range) => {
        if (constType.ConstructionId === range.ConstructionID) {
          const key = `${range.MinYear}-${range.MaxYear}`;
          // initialRangeValues[key] = range.Rate;
          initialRangeValues[key] = range.Rate != null 
  ? parseFloat(range.Rate).toFixed(2)   // 👉 Always 2 decimals
  : '';

        }
      });
      return { ...constType, ...initialRangeValues };
    });

    console.log('initialRanges:', initialRanges);

    setEditedRanges(initialRanges);
    setShowDepChartTable(rangeValues.length > 0);
  }, [constructionsList, rangeValues]);

  //rates changes for dynamic generated texboxes
  // const handleRangeChange = useCallback(
  //   (index, key) => (event) => {
  //     const newRanges = [...editedRanges];
  //     newRanges[index][key] = event.target.value;
  //     setEditedRanges(newRanges);
  //   },
  //   [editedRanges]
  // );

// const handleRangeChange = useCallback(
//   (index, key) => (event) => {
//     let value = event.target.value;

//     // Allow empty (will be saved as null later)
//     if (value === '') {
//       const newRanges = [...editedRanges];
//       newRanges[index][key] = '';
//       setEditedRanges(newRanges);
//       return;
//     }

  
//     // Allow only digits + optional decimal point + up to 2 decimals
//     if (!/^\d*\.?\d{0,2}$/.test(value)) {
//       return; // block if invalid
//     }

//     let num = parseFloat(value);

//     if (num < 0) num = 0;
//     if (num > 100) num = 100;

//     const newRanges = [...editedRanges];
//     newRanges[index][key] = num.toString();
//     setEditedRanges(newRanges);
//   },
//   [editedRanges]
// );

const handleRangeChange = useCallback(
  (index, key) => (event) => {
    let value = event.target.value;

    // Allow empty input (kept as '')
    if (value === '') {
      const newRanges = [...editedRanges];
      newRanges[index][key] = '';
      setEditedRanges(newRanges);
      return;
    }

    // Allow only numbers with optional decimal + up to 2 digits
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return; // block invalid
    }


      // ✅ Block if > 100
    const num = parseFloat(value);
    if (num > 100) {
      return; // do not update
    }

    
    // ✅ Keep as string while typing (don't parse yet)
    const newRanges = [...editedRanges];
    newRanges[index][key] = value;
    setEditedRanges(newRanges);
  },
  [editedRanges]
);


  //delete rates tab1
  const handleDeleteRates = async () => {
    setDialogDeleteOpen(true);
  };

  const handleDeleteDeprRate = async () => {
    setDialogDeleteOpenRate(true);
  };

  useEffect(() => {
  // Close snackbars whenever the tab changes
  setSnackbarOpenGen(false);
  setSnackbarOpenAddRate(false);
  setSnackbarOpenUpdateRate(false);
    setSnackbarOpenUpdateRates(false);
  // setSnackbarOpenDeleteRates(false);
}, [value]); // activeTab = state variable controlling current tab

  const handleUpdateRateClick = async () => {
     if (!selectedRow) {
      setSnackbarOpenDeleteSingleRate(true);
      setReceivedMessageSingleDeleteRate('Please select a row to update rate.');
      setSnackbarMessageDeleteSingleRate(receivedMessageSingleDeleteRate);
      setSnackbarSeverity('error');
 
      return;
    }
    try {
      const rateData = {
        ID: selectedRow ? selectedRow.ID : 0,
        Year: deprData.depYear,
        ConstructionID: deprData.ConstructionId,
        MinYear: deprData.minDeprYear,
        MaxYear: deprData.maxDeprYear,
        Rate: deprData.deprRate
      };

      const response = await addUpdateRates([rateData]);

      console.log(response, 'single update response');

      if (response.status === 200 || response.status === 201) {
        setReceivedUpdateMessage("Rate updated successfully");
        console.log('Received message:', response.message);
        setSnackbarSeverity('success');
        setSnackbarOpenUpdateRate(true);
     

        if (selectedRow) {
          setAllDeprMasterData((allDeprMasterData) =>
            allDeprMasterData.map((rate) => (rate.ID === selectedRow.ID ? { ...rate, ...rateData } : rate))
          );
          console.log('Rate updated successfully:', response);
        } else {
          setAllDeprMasterData((allDeprMasterData) => [...allDeprMasterData, rateData]);
          console.log('Rate added successfully:', response);
        }
        setSelectedRow(null);
        handleCancelAddRate();
        // cancelClick();
      } else {
        console.error('Error in adding/updating rates:', response);
      }
    } catch (error) {
      console.error('Error in updating rates:', error);
    }
  };
  const handleDeleteRateClick = async () => {
    if (!selectedRow) {
      setSnackbarOpenDeleteSingleRate(true);
      setReceivedMessageSingleDeleteRate('Please select a row to delete rate.');
      setSnackbarMessageDeleteSingleRate(receivedMessageSingleDeleteRate);
      setSnackbarSeverity('error');
 
      return;
    }
    setDialogDeleteOpenSingleRate(true);
};


  const handleCloseDeleteDialog = () => {
    //setDialogDeleteOpenRates(false);
    setDialogDeleteOpen(false);
  };

  const handleCloseDeleteDialogSingleRate = () => {
    setDialogDeleteOpenSingleRate(false);
  };

  const handleConfirmDeleteSingleRate = async () => {
   setDialogDeleteOpenSingleRate(false);
   if (!selectedRow) return; // No row selected

  try {
    const response = await deleteDeprRateById(selectedRow.ID);

    console.log(response, 'delete response');
    if (response.status === 200) {
  setAllDeprMasterData((prevData) =>
    prevData.filter((row) => row.ID !== selectedRow.ID)
  );
  setSelectedRow(null); 
  setSnackbarOpenDeleteSingleRate(true);
  setSnackbarSeverity('success');
  setReceivedMessageSingleDeleteRate(response.res?.data?.message || response.message || 'Rate deleted successfully');
  setSnackbarMessageDeleteSingleRate(receivedMessageSingleDeleteRate);
  handleCancelAddRate();
} else {
  setSnackbarSeverity('error');
  setReceivedMessageSingleDeleteRate(response.res?.data?.message || response.message || 'Error deleting row');
  setSnackbarMessageDeleteSingleRate(receivedMessageSingleDeleteRate);
  setSnackbarOpenDeleteSingleRate(true);
}
  } catch (error) {
    console.error('Error deleting row:', error);
    setSnackbarSeverity('error');
    setReceivedMessageSingleDeleteRate('Server error while deleting row');
    setSnackbarMessageDeleteSingleRate(receivedMessageSingleDeleteRate);
    setSnackbarOpenDeleteSingleRate(true);
  }
  };

  const handleConfirmDelete = async () => {
    setOpenDialogPassword(true);
    
    // try {
    //   if (rateYear) {
    //     const response = await deleteDeprRate(rateYear);
    //     if (response.status === 200 || response.status === 201) {
    //       setReceivedMessage(response.message);
    //       setSnackbarSeverity('success');
    //       setSnackbarOpenDeleteRates(true);
    //       setErrors({});

    //       // Update the years list by filtering out the deleted rate year
    //       setYearsList((years_list) => {
    //         const updatedList = years_list.filter((year) => year.Year !== rateYear);
    //         console.log('Updated years list:', updatedList); // Check updated list
    //         return updatedList;
    //       });

    //       setRateYear('');
    //       setRateYear('');
    //     } else {
    //       setErrors((prevErrors) => ({
    //         ...prevErrors,
    //         Year: 'Failed to delete the rate.'
    //       }));
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error deleting rate:', error);
    // } finally {
    //   setDialogDeleteOpen(false);
    // }
  };

  useEffect(() => {
    console.log('allDeprMasterData updated:', allDeprMasterData);
  }, [allDeprMasterData]);

  useEffect(() => {
    console.log('years_list updated:', years_list);
  }, [years_list]);

 
  const [openDialogPassword, setOpenDialogPassword] = useState(false);

  const handleCloseDialogPassword = async () => {
    setOpenDialogPassword(false);
    setDialogDeleteOpen(false);
  
  };

   const [password, setPassword] = useState('');
  const handleSubmitPassword = async () => {
    try {
        const levelname = 'L1';
      // Validate password
      const passwordCheckResponse = await levelPassword(levelname, password);
      console.log(passwordCheckResponse, 'pass  respomse data entry');
      if (passwordCheckResponse.status !== 200) {
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setSnackbarMessage('Invalid password');
        console.log('Invalid password data entry');
        throw new Error('Invalid password');
      }

      if (rateYear) {
        const response = await deleteDeprRate(rateYear);
        if (response.status === 200 || response.status === 201) {
          setReceivedMessage(response.message);
          setSnackbarSeverity('success');
          setSnackbarOpenDeleteRates(true);
          setErrors({});

          // Update the years list by filtering out the deleted rate year
          setYearsList((years_list) => {
            const updatedList = years_list.filter((year) => year.Year !== rateYear);
            console.log('Updated years list:', updatedList); // Check updated list
            return updatedList;
          });

          setRateYear('');
          setRateYear('');
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            Year: 'Failed to delete the rate.'
          }));
        }
      }
    } catch (error) {
      console.error('Error deleting rate:', error);
    } finally {
       setDialogDeleteOpen(false);
       setOpenDialogPassword(false);
       setPassword('');
    }
  }

const handleSaveClick = async () => {
  const exists = allDeprMasterData.some(
    (item) => item.Year === parseInt(rateYear)
  );

  if (!exists) {
    // ✅ validation only for generate mode
    const isValid = await validationSchemaRatesByChart.isValid({
      rateYear,
      minYear,
      maxYear,
    });

    if (!isValid) {
      validationSchemaRatesByChart
        .validate({ rateYear, minYear, maxYear }, { abortEarly: false })
        .catch((err) => {
          const validationErrors = {};
          err.inner.forEach((error) => {
            validationErrors[error.path] = error.message;
          });
          setErrors(validationErrors);
        });
      return; // stop if invalid
    }

    handleGenerateRateClick(); // safe to call, no validation inside
  } else {
    handleUpdateRates(); // update mode
  }
};

const [npTitle, setNpTitle] = useState("");

// fetching npTitle on mount
useEffect(() => {
  const fetchNpCouncilTitle = async () => {
    try {
      const res = await fetchNpTitle(); 
      console.log("Fetched NPTitle:", res);

      const title = res?.res?.data?.NPTitle || res?.NPTitle || "";
      setNpTitle(title);

      console.log("NPTitle set to:", title);
    } catch (err) {
      console.error("Error fetching NPTitle:", err);
    }
  };
  fetchNpCouncilTitle();
}, []);


const handleExportToExcel = async () => {
  if (!rateYear) {
       setSnackbarMessage("Please select a year before exporting");
    setSnackbarOpen(true);
    return;
  }

  // ✅ Filter only selected year’s rows
  const filteredData = allDeprMasterData.filter(
    (row) => String(row.Year) === String(rateYear)
  );

  if (filteredData.length === 0) {
    alert(`No data available for year ${rateYear}`);
    return;
  }

  // ✅ Create workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Depreciation Data");

  // ✅ Add Council title at top (from npTitle state)
  worksheet.mergeCells("A1:E1");
  worksheet.getCell("A1").value = npTitle || "Nagar Parishad";
  worksheet.getCell("A1").font = { size: 16, bold: true };
  worksheet.getCell("A1").alignment = { horizontal: "center" };

  // ✅ Add header row
  worksheet.addRow([
    "Construction Id",
    "Year",
    "Rate",
    "Min Year",
    "Max Year"
  ]);

  // ✅ Adjust Column Widths
  worksheet.columns = [
    { key: "ConstructionID", width: 20 },
    { key: "Year", width: 10 },
    { key: "Rate", width: 12 },
    { key: "MinYear", width: 12 },
    { key: "MaxYear", width: 12 }
  ];

  // ✅ Add filtered rows
  filteredData.forEach((row) => {
    worksheet.addRow({
      ConstructionID: row.ConstructionID,
      Year: row.Year,
      Rate: row.Rate,
      MinYear: row.MinYear,
      MaxYear: row.MaxYear
    });
  });

  // ✅ Save file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    `Depreciation_${rateYear}.xlsx`
  );
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
        <MainCard title="Depreciation Master">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Depreciation Rates By Chart" iconPosition="end" {...a11yProps(0)} />
              <Tab label="Add Depreciation Rates" iconPosition="end" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={5} lg={6}>
                <MainCard>
                  <Grid container alignItems="center">
                    {/* Grid item for label */}

                    <Grid item xs={12} sm={5.5}>
                      <Typography>Rates already present for years</Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Select
                        value={selectedYear}
                        sx={{ width: '192px' }}
                        onChange={(e) => {
                          setSelectedYear(e.target.value);
                        }}
                        disabled={accessLevel < 3}
                      >
                        {years_list.map((year, index) => (
                          <MenuItem key={index} value={year.Year}>
                            {year.Year}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    {/* Grid item for select */}
                    <Grid item xs={12} sm={6}></Grid>
                  </Grid>
                  <Grid container alignItems="center" marginTop={2}>
                    <Grid item xs={12} sm={5.5}>
                      <Typography>Year</Typography>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <TextField
                        value={rateYear}
                        name="rateYear"
                        onChange={handleRateYearChange}
                        error={!!errors.rateYear}
                        helperText={errors.rateYear}
                        onKeyDown={handleNumberMBInput}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        disabled={accessLevel < 3}
                      ></TextField>
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" marginTop={2}>
                    <Grid item xs={12} sm={5.5}>
                      <Typography>Min Value</Typography>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <TextField
                        value={minYear}
                        name="minYear"
                        onChange={handleMinYearChange}
                        error={!!errors.minYear}
                        helperText={errors.minYear}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        onKeyDown={handleKeyDown}
                        disabled={accessLevel < 3}
                      ></TextField>
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" marginTop={2} marginBottom={2}>
                    <Grid item xs={12} sm={5.5}>
                      <Typography> Max Value</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={maxYear}
                        name="maxYear"
                        onChange={handleMaxYearChange}
                        error={!!errors.maxYear}
                        helperText={errors.maxYear}
                        onKeyDown={handleKeyDown}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        disabled={accessLevel < 3}
                      ></TextField>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                      <Button variant="contained" onClick={handleAddRange} disabled={!showAddRangeButton || accessLevel < 3}>
                        Add Range
                      </Button>
                    </Stack>
                  </Grid>
                  {rangeValues && rangeValues.length > 0 ? (
                    <TableContainer style={{ height: '19vh', overflow: 'auto', marginTop: 20 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                            <TableCell sx={{ pl: 10 }}>Range</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {uniqueRangeValues.map((range, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ width: '200vw' }}>{`${range.MinYear} - ${range.MaxYear}`}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <TableContainer style={{ height: '19vh', overflow: 'auto', marginTop: 20 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow sx={{ 
            width: '1vw', 
            position: 'sticky', 
            top: 0, 
            zIndex: 10 
          }}>
                            <TableCell sx={{ pl: 10 }}>Range</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {temRangeList.map((range, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ width: '200vw' }}>{`${range.MinYear} - ${range.MaxYear}`}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}{' '}
                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    variant="filled"
                    color="success"
                  >
                    <Alert onClose={handleCloseSnackbar} severity="info" variant="filled" sx={{ width: '100%' }}>
                      {snackbarMessage}
                    </Alert>
                  </Snackbar>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={5} lg={6}>
                <MainCard>
                  <Button variant="contained" onClick={handleShowDeprRange} disabled={accessLevel < 3}>
                    Create Depreciation Chart
                  </Button>
                  {showDepChartTable && (
                    <TableContainer style={{ height: '40.5vh', overflow: 'auto', marginTop: 20 }}>
                     <Table stickyHeader>
                       <TableHead>
                         <TableRow sx={{ 
           width: '1vw', 
           position: 'sticky', 
           top: 0, 
           zIndex: 10 
         }}>

                            <TableCell sx={{ pl: 3 }}>Construction Type / Construction Year</TableCell>
                            {uniqueRangeValues.map((tempRange, idx) => (
                              <TableCell key={idx}>{`${tempRange.MinYear} - ${tempRange.MaxYear}`}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {editedRanges.map((constType, index) => (
                            <TableRow key={index}>
                              <TableCell>{constType.ConstructionId}</TableCell>
                              {uniqueRangeValues.map((range, idx) => {
                                const key = `${range.MinYear}-${range.MaxYear}`;
                                return (
                                  <TableCell key={idx}>
                                    <TextField
                                      id={`${constType.ConstructionId}-${key}`}
                                      fullWidth
                                      variant="outlined"
                                      size="small"
                                      value={constType[key] || ''}
                                      onChange={handleRangeChange(index, key)}
                                    />
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </MainCard>
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                  <Button variant="contained" color='success' onClick={handleSaveClick} disabled={accessLevel < 3}>
                   Save
                  </Button>

                  <Snackbar
                    open={snackbarOpenGen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbarGen}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <SnackbarContent
                      sx={{
                        backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
                      }}
                      message={receivedMessage}
                    />
                  </Snackbar>

                 

                  {/* <Button variant="contained" onClick={handleUpdateRates} disabled={accessLevel < 3} color='success'> 
                    Update Rates
                  </Button> */}


            <Snackbar
                    open={snackbarOpenUpdateRates}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbarUpdateRates}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <SnackbarContent
                      sx={{
                        backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
                      }}
                      message={receivedMessageUpdateRates}
                    />
                  </Snackbar>




                  <Button variant="contained" color="error" onClick={handleDeleteRates} disabled={accessLevel < 4}>
                    Delete
                  </Button>
                  <Dialog open={dialogDeleteOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                      <DialogContentText>Are you sure you want to delete?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmDelete} color="error">
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>

                   

                     <Dialog open={openDialogPassword} onClose={handleCloseDialogPassword} fullWidth maxWidth="xs">
                                              <DialogTitle id="alert-dialog-title">L1 LEVEL </DialogTitle>
                                              <DialogContent>
                                                <Stack marginBottom={2}>
                                                  <DialogContentText id="alert-dialog-description">Submit the password</DialogContentText>
                                                </Stack>
                        
                                                <TextField
                                                  required
                                                  value={password}
                                                  type="password"
                                                  onChange={(e) => setPassword(e.target.value)}
                                                  fullWidth
                                                  maxWidth="sm"
                                                ></TextField>
                                              </DialogContent>
                                              <DialogActions>
                                                <Button variant="contained" color="success" onClick={handleSubmitPassword} autoFocus>
                                                  Submit
                                                </Button>
                                                <Button variant="contained" color="secondary" onClick={handleCloseDialogPassword} autoFocus>
                                                  Cancel
                                                </Button>
                                              </DialogActions>
                                            </Dialog>

                  <Snackbar
                    open={snackbarOpenDeleteRates}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbarDeleteRates}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                    <SnackbarContent
                      sx={{
                        backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
                      }}
                      message={receivedMessage}
                    />
                  </Snackbar>

                  <Button variant="contained" color="info" disabled={accessLevel < 3} onClick={handleExportToExcel}>
                    Export
                  </Button>

                  <Button variant="contained" color="secondary" onClick={cancelClickChartRates} disabled={accessLevel < 3}>
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={5} lg={6} mt={0}>
                <MainCard>
                  <Grid container alignItems="center">
                    {/* Grid item for label */}
                    <Grid item xs={12} sm={4}>
                      <Typography>Year</Typography>
                    </Grid>
                    {/* Grid item for select */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={deprData.depYear}
                        name="depYear"
                        onChange={handleInputChange}
                        error={!!errors.depYear}
                        helperText={errors.depYear}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        // disabled={accessLevel < 3}
                          disabled={true} 
                      ></TextField>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center" marginTop={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Min Value</Typography>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <TextField
                        value={deprData.minDeprYear}
                        name="minDeprYear"
                        onChange={handleInputChange}
                        error={!!errors.minDeprYear}
                        helperText={errors.minDeprYear}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        // disabled={accessLevel < 3}
                          disabled={true} 
                      ></TextField>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center" marginTop={2} marginBottom={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography> Max Value</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={deprData.maxDeprYear}
                        name="maxDeprYear"
                        onChange={handleInputChange}
                        error={!!errors.maxDeprYear}
                        helperText={errors.maxDeprYear}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        // disabled={accessLevel < 3}
                          disabled={true} 
                      ></TextField>
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" marginTop={2} marginBottom={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography>Rate</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        value={deprData.deprRate}
                        name="deprRate"
                        onChange={handleInputChange}
                        error={!!errors.deprRate}
                        helperText={errors.deprRate}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                        disabled={accessLevel < 3}
                      ></TextField>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center" marginTop={2} marginBottom={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography> Construction Type</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Select
                        onChange={handleInputChange}
                        value={deprData.ConstructionId}
                        name="ConstructionId"
                        error={!!errors.ConstructionId}
                        helperText={errors.ConstructionId}
                        FormHelperTextProps={{ style: { color: 'red' } }}
                          disabled={true} 
                        sx={{ width: '192px' }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: 'auto'
                            }
                          }
                        }}
                        // disabled={accessLevel < 3}
                      >
                        {constructionsList.map((consType, index) => (
                          <MenuItem key={index} value={consType.ConstructionId}>
                            {consType.ConstructionId}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} style={{ textAlign: 'center' }} mt={2.5}>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                   

                      <Button variant="contained" color="info" onClick={handleUpdateRateClick}>
                    Update Rate
                  </Button>
                   <Snackbar
                        open={snackbarOpenUpdateRate}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbarUpdateRate}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                      >
                        <SnackbarContent
                          sx={{
                            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
                          }}
                          message={receivedUpdateMessage}
                        />
                      </Snackbar>
                    <Button variant="contained" color="error" onClick={handleDeleteRateClick} disabled={accessLevel < 4}>
                    Delete Rate
                  </Button>
                   <Dialog open={dialogDeleteOpenSingleRate} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                      <DialogContentText>Are you sure you want to delete?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDeleteDialogSingleRate} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmDeleteSingleRate} color="error">
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
  <Snackbar
                        open={snackbarOpenDeleteSingleRate}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbarDeleteSingleRate}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                      >
                        <SnackbarContent
                          sx={{
                            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red'
                          }}
                          message={receivedMessageSingleDeleteRate}
                        />
                      </Snackbar>
                      <Button variant="contained" color="secondary" onClick={handleCancelAddRate} disabled={accessLevel < 3}>
                        Cancel
                      </Button>
                    </Stack>
                  </Grid>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={5} lg={6}>
                <MainCard>
                  <TableContainer style={{ height: '40.5vh', overflow: 'auto', marginTop: 20 }}>
                     <Table stickyHeader>
                       <TableHead>
                         <TableRow sx={{ 
           width: '1vw', 
           position: 'sticky', 
           top: 0, 
           zIndex: 10 
         }}>

                            <TableCell>Edit</TableCell>
                          <TableCell sx={{ pl: 3 }}>Construction Id</TableCell>
                          <TableCell align="right">Year</TableCell>
                          <TableCell align="right">Rate</TableCell>
                          <TableCell align="right">Min Year</TableCell>
                          <TableCell align="right">Max Year</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allDeprMasterData.map((masterData, index) => (
                          <TableRow key={index}>
                              <TableCell>
                             <IconButton
  color={selectedRow?.ID === masterData.ID ? 'success' : 'primary'}
  onClick={() => handleRowClick(masterData)}
  disabled={accessLevel < 4}
>
  {selectedRow?.ID === masterData.ID ? <SendOutlined /> : <EditTwoTone />}
</IconButton>

                                                </TableCell>
                            
                            <TableCell>{masterData.ConstructionID}</TableCell>
                            <TableCell align="right">{masterData.Year}</TableCell>
                               <TableCell align="right">{masterData.Rate}</TableCell>
                            <TableCell align="right">{masterData.MinYear}</TableCell>
                            <TableCell align="right">{masterData.MaxYear}</TableCell>
                         
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MainCard>
              </Grid>
            </Grid>
          </TabPanel>
        </MainCard>
      )}
    </>
  );
}

export default Depreciation;
