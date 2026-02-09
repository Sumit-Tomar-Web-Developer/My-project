import MainCard from 'components/MainCard';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  FormControl,
  DialogContentText
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PropTypes, { object } from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Box, Tab, Tabs, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, SnackbarContent } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { selectCapitalValue } from 'state/reducers/totalValution/capitalValueAssessment.js';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import {
  getpropertyDataFromNewDetails, applyPolicyDetails,
  getDetailsWithOldDetails, removeAllAppealsDetails, removeAppealCommitteeDetails,
  removeRemissionDetails, removeHearingDetails,
  removeRetentionDetails, saveLastRow, detailsForShortKeys, changeApplyTaxes
} from 'services/assessmentService/TotalValuation/totalValuation';
import { fetchPropertyRangeByWard } from '../../../services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { getPropertyByOldWardNo } from 'services/wardnumber.services';
import { getFinanceYear } from 'services/utlilityService/AddTaxService/AddTaxService';
import { convertWMFToSVG } from '../data-entry/UploadPhotoAndPlan';


function createData(name, designation, product, date, badgeText, badgeType) {
  return { name, designation, product, date, badgeText, badgeType };
}

const rowss = [
  createData('Materially', 'Powerful Admin Theme', '16,300', '$53', '$15,652'),
  createData('Photoshop', 'Design Software', '26,421', '$35', '$8,785')
];


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

function TotalValuation() {
  const capitalValue = useSelector(selectCapitalValue);

  // const additionalData = useSelector((state) => state.additionalDetails.newAdditionalData);

  const [value, setValue] = useState(0);
  const [showPropertyButtons, setShowPropertyButtons] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [openValidationDialog, setOpenValidationDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false); // Dialog for successful save
  const [inputValue, setInputValue] = useState(''); // State to manage input value
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogRV, setOpenDialogRV] = useState(false);
  const [openDialogCV, setOpenDialogCV] = useState(false);

  const [openSocialDetails, setOpenSocialDetails] = useState(false);
  const [openOldInformation, setOldInformation] = useState(false);
  const [openApplyTax, setApplyTax] = useState(false);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);
  const [applicalePolicy, setApplicablePolicy] = useState('');
  const navigate = useNavigate();


  const handleEditButtonForDataEnterClick = () => {
    navigate('/assessment/data-entry', { state: { fromTotalValuation: true } });
  };

  //119 view
  const handleButtonViewClick = () => {
    setOpenDialog(true); // Open the dialog
  };

  // Handle closing of dialog
  const handleCloseViewDialog = () => {
    setOpenDialog(false); // Close the dialog
  };
  //net RV page
  const handleButtonNetRVClick = () => {
    setOpenDialogRV(true); // Open the dialog
  };

  // Handle closing of dialog
  const handleCloseNetRVDialog = () => {
    setOpenDialogRV(false); // Close the dialog
  };

  //net RV page
  const handleButtonNetCVClick = () => {
    setOpenDialogCV(true); // Open the dialog
  };

  // Handle closing of dialog
  const handleCloseNetCVDialog = () => {
    setOpenDialogCV(false); // Close the dialog
  };
  // Handle input change
  const handleInputViewChange = (event) => {
    setInputValue(event.target.value); // Update input value
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      // Show confirmation dialog when checkbox is clicked
    }
  };
  // Handle close for success dialog
  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  // Handle button click for save
  const handleButtonClick = () => {
    if (!isChecked) {
      setOpenValidationDialog(true); // Show validation dialog if checkbox is not checked
    } else {
      setOpenConfirmationDialog(true); // Show confirmation dialog if checkbox is checked
    }
  };

  // Handle close for validation dialog
  const handleCloseValidationDialog = () => {

    setOpenValidationDialog(false);

  };

  // Handle close for confirmation dialog and show year dropdown
  // Handle close for confirmation dialog and show year dropdown
  const handleCloseConfirmationDialog = async (confirm) => {
    setOpenConfirmationDialog(false);

    if (confirm) {
      // 👉 Put your OK logic here
      const isAllNull = (obj) => {
        if (!obj || typeof obj !== "object") return true;
        return Object.values(obj).every(
          (v) => v === null || v === undefined || v === ""
        );
      };

      const pickFirstNonEmpty = (...sources) => {
        for (const obj of sources) {
          if (!obj) continue;

          // If it's an array → filter rows that are not all null
          if (Array.isArray(obj) && obj.length > 0) {
            const cleaned = obj.filter((row) => !isAllNull(row));
            if (cleaned.length > 0) {
              return [...cleaned];
            }
          }

          // If it's a plain object → only return if not all null
          if (typeof obj === "object" && Object.keys(obj).length > 0) {
            if (!isAllNull(obj)) {
              return { ...obj };
            }
          }
        }

        return null; // if all are empty or only contained null rows
      };

      const data = pickFirstNonEmpty(
        remissionTaxes,
        appealTaxes,
        hearingTaxes,
        retainTaxes,
        netTaxes
      );


      try {
        // Call your save API


        const response = await saveLastRow(data, selectedYear, ownerId);

        if (response == 200 || response.status == 200) {
          setSnackbarOpen(true);
          setSnackbarSeverity('success')
          setReceivedMessage('Data Saved SuccessFull ')

        }
      } catch (error) {
        console.error("Error while saving:", error);
      }

      // After success, show dropdown
      setShowYearDropdown(true);
    }
  };


  // Handle year selection from dropdown
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);

  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [hoveredItem, setHoveredItem] = useState(null);
  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };
  //changes img hover
  const [hoveredItems, setHoveredItems] = useState(null);
  const handleMouseEnters = (indexs) => {
    setHoveredItems(indexs);
  };
  const handleMouseLeaves = () => {
    setHoveredItems(null);
  };
  //Social Details Alt + 2

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'F2') {
      setOpenSocialDetails(true); // Open dialog or perform action
    } else if (event.key === 'Escape') {
      setOpenSocialDetails(false); // Close dialog or perform action
    }
  };

  // Don't forget to add this handler to the component's keydown event
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Clean up
    };
  }, []);

  const handleSocialDetails = () => {
    setOpenSocialDetails(false);
  };
  //Old Information Alt + 3

  const handleKeyDownOldInformation = (event) => {
    if (event.ctrlKey && event.key === 'F3') {
      setOldInformation(true); // Open dialog or perform action
    } else if (event.key === 'Escape') {
      setOldInformation(false); // Close dialog or perform action
    }
  };

  const [pageID, setPageID] = useState('');
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Total Valuation';
      try {
        const fetchedPageID = await getPageIDByPageName(pageName);

        setPageID(fetchedPageID);
      } catch (error) {
        console.error('Error fetching page ID:', error);
      }
    };
    getPageID();
  }, []);

  const permissions = useSelector((state) => {
    const p = state.newUserDetails.permissions;
    return Array.isArray(p) ? p : [];
  });
  const permissionAccess = permissions.find((perm) => perm.PageID === Number(pageID.PageID));
  useEffect(() => {
    if (permissionAccess?.AccessID) {
      const access = permissionAccess.AccessID;

      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true);
      } else {
        setShowAccessDialog(false);
      }
    }
  }, [permissionAccess]);

  const handleRedirect = () => {
    setShowAccessDialog(false);
    navigate('/payment/dashboard');
  };

  // Don't forget to add this handler to the component's keydown event
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownOldInformation);

    return () => {
      window.removeEventListener('keydown', handleKeyDownOldInformation); // Clean up
    };
  }, []);

  const handleOldInformation = () => {
    setOldInformation(false);
  };
  //Apply Tax Alt + 1

  const handleKeyApplyTax = (event) => {
    if (event.ctrlKey && event.key === 'F1') {
      setApplyTax(true); // Open dialog or perform action
    } else if (event.key === 'Escape') {
      setApplyTax(false); // Close dialog or perform action
    }
  };

  // Don't forget to add this handler to the component's keydown event
  useEffect(() => {
    window.addEventListener('keydown', handleKeyApplyTax);

    return () => {
      window.removeEventListener('keydown', handleKeyApplyTax); // Clean up
    };
  }, []);

  const handleApplyTax = () => {
    setApplyTax(false);
  };



  const fields = [
    { label: 'Zone <br /> No.', field: 'zoneNo', disabled: true },
    { label: 'Ward <br /> No.', field: 'wardNo' },
    { label: 'Property<br />No.', field: 'propertyNo' },
    { label: 'Partition<br /> No. ', field: 'partitionNo' },
    { label: 'City S <br /> No.', field: 'citySNo' },
    { label: 'Plot <br /> No.', field: 'plotNo' },
    { label: 'BuildUp Area(Sqft)', field: 'buildUpAreaSqFt' },
    { label: 'Carpet Area(Sqft)', field: 'carpetAreaSqFt' },
    { label: 'Plot Area <br />(Sqft)', field: 'plotAreaSqFt' }
  ];

  const [newDetails, setNewDetails] = useState({
    zoneNo: null,
    wardNo: '',
    propertyNo: '',
    partitionNo: null,
    citySNo: null,
    plotNo: null,
    buildUpAreaSqFt: null,
    carpetAreaSqFt: null,
    plotAreaSqFt: null
  });

  const [oldDetails, setOldDetails] = useState({
    zoneNo: null,
    wardNo: null,
    propertyNo: null,
    partitionNo: null,
    citySNo: null,
    plotNo: null,
    buildUpAreaSqFt: null,
    carpetAreaSqFt: null,
    plotAreaSqFt: null,
    OldALV: null,
    OldRV: null,
    OldTotalTax: null
  });
  const [ownerRenterDetails, setOwnerRenterDetails] = useState({
    ownerName: '',
    address: '',
    renterName: '',
    occupierName: '',
    buildingOrShopName: '',
    buildingOrFlatNo: '',
    rent: '',
    nonCalculatedRent: '',

  })
  const [totalValuationForAssessment, setTotalValuationForAssement] = useState({

    typeOfUse: '',
    ALV: '',
    maintenance: '',
    RV: '',
    propertyTax: '',
    propertyPercentage: '',
    educationTax: '',
    educationPercentage: '',
    employmentTax: '',
    employmentPercentage: '',
    total: ''

  })

  const [newConstructionPartValuation, setNewConstructionPartValuation] = useState({

    use: "",
    reason: '',
    alv: '',
    maintenance: '',
    rv: ''

  })

  const [oldConstructionPartValuation, setOldConstructionPartValuation] = useState({

    use: "",
    reason: '',
    alv: '',
    maintenance: '',
    rv: ''

  })

  const [oldRetentionPartValuation, setOldRetentionPartValuation] = useState({

    use: "",
    reason: '',
    alv: '',
    maintenance: '',
    rv: ''

  })
  const sourceRef = useRef(null);
  const [propertyDescription, setPropertyDescription] = useState('');
  const [constructionType, setConstructionType] = useState('');
  const [ownerId, setOwnerId] = useState(null);
  const [images, setImages] = useState([]);
  const [contactNo, setContactNo] = useState('');
  const [noOfRoom, setNoOfRoom] = useState('');
  const [isWaterConection, setIsWaterConnection] = useState('');
  const [isRainWaterHarvesting, setIsRainWaterHarvesting] = useState('');
  const [commonToilet, setCommonToilet] = useState('');
  const [rToilet, setRToilet] = useState('')
  const [propertyList, setPropertyList] = useState([])
  const [propertyListOld, setPropertyListOld] = useState([])
  const [prop, setProp] = useState('')
  const [propOld, setPropOld] = useState('')
  const [retainReason, setRetainReason] = useState('');
  const [retainRV, setRetainRV] = useState('');
  const [hearingRV, setHearingRV] = useState('');
  const [hearingReason, setHearingReason] = useState('');
  const [appealRV, setAppealRV] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [remissionRV, setRemissionRV] = useState('');
  const [remissionReason, setRemissionReason] = useState('');
  const [remissionTaxes, setRemissionTaxes] = useState({})
  const [action, setAction] = useState('');
  const [databaseRows, setDatabaseRows] = useState([]);
  const [gridRows, setGridRows] = useState([]);
  const [netTaxes, setNetTaxes] = useState({})
  const [retainOwnerID, setRetainOwnerID] = useState('');
  const [retainTaxes, setRetainTaxes] = useState({})
  const [hearingTaxes, setHearingTaxes] = useState({})
  const [appealTaxes, setAppealTaxes] = useState({})
  const [applyTaxes, setApplyTaxes] = useState({})
  const [oldPropertyMast, setOldPropertyMast] = useState({})
  const [socialDetails, setSocialDetails] = useState({})
  const [oldPendingTaxes, setOldPendingTaxes] = useState([])
  const [oldFloorData, setOldFloorData] = useState([])
  const [taxMaster, setTaxMaster] = useState({})
  const [eduAndEmp, setEduAndEmp] = useState({})





  const handleNewDetails = (field, value) => {
    setNewDetails(prev => ({
      ...prev,
      [field]: value
    }));

  };

  const handleOldDetails = (field, value) => {
    setOldDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeOwnerId = (event) => {
    setOwnerId(event.target.value);
  };
  const handleApplicablePolicyChange = (event) => {
    setApplicablePolicy(event.target.value);
  };
  const handleChangeApplyTaxes = async () => {
    const result = await changeApplyTaxes(ownerId, applyTaxes)

    if (result.status == 200) {
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
      setReceivedMessage('Changes Applied');
    }

  }
  useEffect(() => {
    if (ownerId != null || ownerId != '') {

      const shortsKeysDetails = async () => {
        console.log('calling short keys')
        const result = await detailsForShortKeys(ownerId)
        console.log(result, 'result for short keys')
        const oldPropertyMastResult = result.data?.oldProperty
        let oldFloorDataResult = result.data?.propertyDetailsOld;

        // Convert to array if it's a single object
        if (oldFloorDataResult && !Array.isArray(oldFloorDataResult)) {
          oldFloorDataResult = [oldFloorDataResult];
        }

        // Now oldFloorDataResult is always an array and can be iterated
        oldFloorDataResult?.forEach(floor => {
          console.log(floor.floorNumber, floor.constYear, floor.constType);
        });
        const oldPendingTaxesResult = result.data?.oldPeningTaxes
        const socialDetailsResult = result.data?.socialDetails
        const applyTaxesResult = result.data?.applyTax


        const taxMasterResult = result.data?.taxMaster || [];

        const taxRateMap = taxMasterResult.reduce((acc, tax) => {
          acc[tax.Taxnametype] = Number(tax.Rate); // convert to number
          return acc;
        }, {});
        const eduAndEmpResult = result.data?.eduAndEmp || [];

        const taxRateMapEdu = taxMasterResult.reduce((acc, tax) => {
          acc[tax.Taxnametype] = Number(tax.Rate); // convert to number
          return acc;
        }, {});



        // Define all tax columns in order
        const taxColumns = [
          'PropertyTax', 'EducationTax', 'SpEducationTax', 'EmploymentTax',
          'TreeCess', 'FireCess', 'LightCess', 'DrainCess', 'RoadCess', 'Sanitation',
          'SpWaterCess', 'WaterBenefit', 'WaterBill', 'MajorBuilding', 'SewageDisposalCess',
          'Tax1', 'Interest', 'TaxTotal', 'Remark'
        ];


        console.log(applyTaxesResult, 'after set')

        setOldPropertyMast(oldPropertyMastResult)
        setOldFloorData(oldFloorDataResult)
        setApplyTaxes(() => applyTaxesResult)
        setTaxMaster(taxRateMap)
        setSocialDetails(socialDetailsResult)
        setOldPendingTaxes(oldPendingTaxesResult)
        setEduAndEmp(taxRateMapEdu)

      }
      shortsKeysDetails()
    }


  }, [ownerId])
  useEffect(() => {
    console.log('after set apply', taxMaster)
  }, [applyTaxes, oldFloorData, taxMaster, socialDetails, oldPendingTaxes, eduAndEmp])

  useEffect(() => {
    sourceRef.current = null;
  }, [sourceRef.current])
  useEffect(() => {
    if (newDetails.propertyNo && newDetails.wardNo && sourceRef.current !== 'old') {
      const fetchPropertyDetails = async () => {
        try {
          sourceRef.current = 'new';
          const response = await getpropertyDataFromNewDetails(
            newDetails.wardNo,
            newDetails.propertyNo,
            newDetails.partitionNo
          );

          if (Array.isArray(response) && response.length > 0) {
            const property = response[0];
            const propertydetailsold = property.oldpropertymast || {};
            const propertydetailsnew = property.propertydetailsnews?.[0] || {};
            const rows = (response?.[1] || []);
            const totalValuationRows = response?.[5] || []
            const totalValuationArray = Object.values(totalValuationRows);
            // const transformedRows = Object.values(rows).map(row => ({
            //   typeOfUse: row.TypeOfUseID,
            //   ALV: row.AnnualRentalValue,
            //   maintenance: row.Maintenance,
            //   RV: row.RV,
            //   propertyTax: row.PropertyTax,
            //   propertyPercentage: row.PropertyTaxPer,
            //   educationTax: row.EducationTax,
            //   educationPercentage: row.REducationTaxPercenatge,
            //   employmentTax: row.EmploymentTax,
            //   employmentPercentage: row.REmploymentTaxPercenatge,
            //   total: row.Total
            // }));
            const emptyRowTemplate = {
              typeOfUse: '',
              ALV: 0,
              maintenance: 0,
              RV: 0,
              propertyTax: 0,
              propertyPercentage: 0,
              educationTax: 0,
              educationPercentage: 0,
              employmentTax: 0,
              employmentPercentage: 0,
              total: 0
            };

            // console.log(transformedRows, 'transformedRows')
            const newRows = Object.values(rows).reduce((acc, row) => {
              // Start with the row structure based on the type of use
              // const newRow = { ...emptyRowTemplate }; // Row template with all empty values
              let targetRow; // This will be either the 'R' or 'C' row, depending on the type of use

              // Check the type of use and set the target row
              if (row.Type === 'R') {
                targetRow = acc.R; // Accumulate values for 'R'
                // Sum the values for type 'R', ensuring they are numbers
                targetRow.typeOfUse = "R";
                targetRow.ALV += Number(row.AnnualRentalValue) || 0;
                targetRow.maintenance += Number(row.Maintenance) || 0;
                targetRow.RV += Number(row.RateableValue) || 0;
                targetRow.propertyTax += Number(row.PropertyTax) || 0;
                targetRow.propertyPercentage = Number(row.PropertyTaxPer) || 0;
                targetRow.educationTax += Number(row.REducationTax) || 0;
                targetRow.educationPercentage = Number(row.REducationTaxPercenatge) || 0;
                targetRow.employmentTax += Number(row.REmploymentTax) || 0;
                targetRow.employmentPercentage = Number(row.REmploymentTaxPercenatge) || 0;
                targetRow.total += (
                  Number(row.PropertyTax) || 0
                ) + (Number(row.Maintenance) || 0) + (Number(row.REducationTax) || 0) + (Number(row.REmploymentTax) || 0);
              } else if (row.Type === 'C') {
                targetRow = acc.C; // Accumulate values for 'C'
                targetRow.typeOfUse = "C";
                targetRow.ALV += Number(row.AnnualRentalValue) || 0;
                targetRow.maintenance += Number(row.Maintenance) || 0;
                targetRow.RV += Number(row.RateableValue) || 0;
                targetRow.propertyTax += Number(row.PropertyTax) || 0;
                targetRow.propertyPercentage = Number(row.PropertyTaxPer) || 0;
                targetRow.educationTax += Number(row.CEducationTax) || 0;
                targetRow.educationPercentage = Number(row.CEducationTaxPercenatge) || 0;
                targetRow.employmentTax += Number(row.CEmploymentTax) || 0;
                targetRow.employmentPercentage = Number(row.CEmploymentTaxPercenatge) || 0;
                targetRow.total += (
                  Number(row.PropertyTax) || 0
                ) + (Number(row.Maintenance) || 0) + (Number(row.CEducationTax) || 0) + (Number(row.CEmploymentTax) || 0);
              }

              return acc;
            }, { R: { ...emptyRowTemplate, typeOfUse: "R" }, C: { ...emptyRowTemplate, typeOfUse: "C" } }); // Initialize two rows: one for 'R' and one for 'C'

            // The result will be two rows: one for type 'R' and one for type 'C'
            const finalRows = [newRows.R, newRows.C];



            console.log(finalRows, 'finalRows');

            const totalEduTax = finalRows.reduce(
              (sum, row) => sum + row.educationTax,
              0
            );
            const totalEmpTax = finalRows.reduce(
              (sum, row) => sum + row.employmentTax,
              0
            );
            const newConstructionRows = response?.[2] || []
            const newConstructionRowsArray = Object.values(newConstructionRows);
            const newConstructiontransformedRows = newConstructionRowsArray.map(row => ({
              use: row.Use || '',
              reason: row.Reason || '',
              alv: row.ALV || 0,
              maintenance: row.Maintenance || 0,
              rv: row.RV || 0,
            }));


            const oldConstructionValuationRows = response?.[3] || []
            const oldConstructionValuationRowsArray = Object.values(oldConstructionValuationRows);
            const oldConstructionValuationRowstransformedRows = oldConstructionValuationRowsArray.map(row => ({
              use: row.Use || '',
              reason: row.Reason || '',
              alv: row.ALV || 0,
              maintenance: row.Maintenance || 0,
              rv: row.RV || 0,
            }));

            const oldRetentionPartValutionRows = response?.[4] || []
            const oldRetentionPartValutionRowsArray = Object.values(oldRetentionPartValutionRows);
            const oldRetentionPartValutionstransformedRows = oldRetentionPartValutionRowsArray.map(row => ({
              use: row.Use || '',
              reason: row.Reason || '',
              alv: row.ALV || 0,
              maintenance: row.Maintenance || 0,
              rv: row.RV || 0,
            }));
            const netTaxesRow = response?.[6] || []
            setNetTaxes({

              PropertyTax: netTaxesRow[0]?.PropertyTax || 0,
              EducationTax: totalEduTax || 0,
              SpEducationTax: netTaxesRow[0]?.SpEducationTax || 0,
              EmploymentTax: totalEmpTax || 0,
              TreeCess: netTaxesRow[0]?.TreeCess || 0,
              FireCess: netTaxesRow[0]?.FireCess || 0,
              LightCess: netTaxesRow[0]?.LightCess || 0,
              DrainCess: property?.PropertyTypeMaster?.Tax || 0,
              RoadCess: netTaxesRow[0]?.RoadCess || 0,
              Sanitation: netTaxesRow[0]?.Sanitation || 0,
              SpWaterCess: netTaxesRow[0]?.SpWaterCess || 0,
              WaterBenefitTax: netTaxesRow[0]?.WaterBenefitTax || 0,
              WaterBill: netTaxesRow[0]?.WaterBill || 0,
              MajorBuildingTax: netTaxesRow[0]?.MajorBuildingTax || 0,
              SewageDispCess: netTaxesRow[0]?.SewageDispCess || 0,
              Tax1: netTaxesRow[0]?.Tax1 || 0,
              Total: Number(netTaxesRow[0]?.Total) + Number(property?.PropertyTypeMaster?.Tax) + Number(totalEduTax) + Number(totalEmpTax)

            })

            setNewDetails(prev => {
              if (
                prev.zoneNo !== property.NewZoneNo ||
                prev.wardNo !== property.NewWardNo ||
                prev.propertyNo !== property.NewPropertyNo
              ) {
                return {
                  ...prev,
                  propertyNo: property.NewPropertyNo || '',
                  zoneNo: property.NewZoneNo || '',
                  wardNo: property.NewWardNo || '',
                  partitionNo: property.NewPartitionNo || '',
                  citySNo: property.NewCityServeyNo || '',
                  plotNo: property.NewPlotNo || '',
                  plotAreaSqFt: property.PlotArea ?? '',
                  buildUpAreaSqFt: property.propertydetailsnews?.[0]?.BuildUpAreaSqFeet || '',
                  carpetAreaSqFt: property.propertydetailsnews?.[0]?.CarpetAreaSqFeet || '',
                };
              }
              return prev;
            });

            setOldDetails(pre => {
              if (
                pre.zoneNo !== propertydetailsold.OldZoneNo ||
                pre.wardNo !== propertydetailsold.OldWardNo ||
                pre.propertyNo !== propertydetailsold.OldPropertyNo
              ) {
                return {
                  ...pre,
                  zoneNo: propertydetailsold.OldZoneNo || '',
                  wardNo: propertydetailsold.OldWardNo || '',
                  propertyNo: propertydetailsold.OldPropertyNo || '',
                  partitionNo: propertydetailsold.OldPartitionNo || '',
                  citySNo: propertydetailsold.OldCityServeyNo || '',
                  plotNo: propertydetailsold.OldPlotNo || '',
                  plotAreaSqFt: propertydetailsold.OldPlotArea ?? '',
                  buildUpAreaSqFt: propertydetailsold.PropertyDetailsOlds?.[0]?.OldBuildUpAreaSqFeet || '',
                  carpetAreaSqFt: propertydetailsold.PropertyDetailsOlds?.[0]?.OldCarpetAreaSqfeet || '',
                  OldALV: propertydetailsold.OldALV || '0',
                  OldRV: propertydetailsold.OldRV || '0',
                  OldTotalTax: propertydetailsold.OldTotalTax || '0',
                };
              }
              return pre;
            });

            setOwnerRenterDetails(pre => ({
              ...pre,
              ownerName: property.OwnerName,
              address: property.Address,
              renterName: propertydetailsnew.RenterName,
              occupierName: propertydetailsnew.OccupierName,
              buildingOrShopName: property.BuildingOrShopName,
              buildingOrFlatNo: property.BuildingOrFlatNo,
              rent: propertydetailsnew.Rent,
              nonCalculatedRent: propertydetailsnew.NonCalculateRent,
            }))
            const retain = response?.[7] || []
            setRetainOwnerID(retain[0]?.OwnerID || '');
            setRetainReason(retain[0]?.Reason || '');
            setRetainRV(retain[0]?.RentalValue || '');
            setRetainTaxes({

              PropertyTax: retain[0]?.PropertyTax,
              EducationTax: retain[0]?.EducationTax,
              SpEducationTax: retain[0]?.SpEducationTax,
              EmploymentTax: retain[0]?.EmploymentTax,
              TreeCess: retain[0]?.TreeCess,
              FireCess: retain[0]?.FireCess,
              LightCess: retain[0]?.LightCess,
              DrainCess: retain[0]?.DrainCess,
              RoadCess: retain[0]?.RoadCess,
              Sanitation: retain[0]?.Sanitation,
              SpWaterCess: retain[0]?.SpWaterCess,
              WaterBenefitTax: retain[0]?.WaterBenefit,
              WaterBill: retain[0]?.WaterBill || 0,
              MajorBuildingTax: retain[0]?.MajorBuilding,
              SewageDispCess: retain[0]?.SewageDisposalCess,
              Tax1: retain[0]?.Tax1,
              Total: retain[0]?.Total
            });
            const hearing = response?.[8] || []
            setHearingReason(hearing[0]?.Reason || '');
            setHearingRV(hearing[0]?.RV || '');
            setHearingTaxes({
              PropertyTax: hearing[0]?.PropertyTax,
              EducationTax: hearing[0]?.EducationTax,
              SpEducationTax: hearing[0]?.SpEducationTax,
              EmploymentTax: hearing[0]?.EmploymentTax,
              TreeCess: hearing[0]?.TreeCess,
              FireCess: hearing[0]?.FireCess,
              LightCess: hearing[0]?.LightCess,
              DrainCess: hearing[0]?.DrainCess,
              RoadCess: hearing[0]?.RoadCess,
              Sanitation: hearing[0]?.Sanitation,
              SpWaterCess: hearing[0]?.SpWaterCess,
              WaterBenefitTax: hearing[0]?.WaterBenefitTax,
              WaterBill: hearing[0]?.WaterBill,
              MajorBuildingTax: hearing[0]?.MajorBuildingTax,
              SewageDispCess: hearing[0]?.SewageDispCess,
              Tax1: hearing[0]?.Tax1,
              Total: hearing[0]?.Total
            });
            const appeal = response?.[9] || []
            setAppealReason(appeal[0]?.Reason || '');
            setAppealRV(appeal[0]?.RV || '');
            setAppealTaxes({
              PropertyTax: appeal[0]?.PropertyTax,
              EducationTax: appeal[0]?.EducationTax,
              SpEducationTax: appeal[0]?.SpEducationTax,
              EmploymentTax: appeal[0]?.EmploymentTax,
              TreeCess: appeal[0]?.TreeCess,
              FireCess: appeal[0]?.FireCess,
              LightCess: appeal[0]?.LightCess,
              DrainCess: appeal[0]?.DrainCess,
              RoadCess: appeal[0]?.RoadCess,
              Sanitation: appeal[0]?.Sanitation,
              SpWaterCess: appeal[0]?.SpWaterCess,
              WaterBenefitTax: appeal[0]?.WaterBenefitTax,
              WaterBill: appeal[0]?.WaterBill,
              MajorBuildingTax: appeal[0]?.MajorBuildingTax,
              SewageDispCess: appeal[0]?.SewageDispCess,
              Tax1: appeal[0]?.Tax1,
              Total: appeal[0]?.Total
            });
            const remission = response?.[10] || []
            if (remission.length > 0) {
              setRemissionReason(remission[0]?.Reason || '');
              setRemissionRV(remission[0]?.RentalValue || '');
              setRemissionTaxes({
                PropertyTax: remission[0]?.PropertyTax,
                EducationTax: remission[0]?.EducationTax,
                SpEducationTax: remission[0]?.SpEducationTax,
                EmploymentTax: remission[0]?.EmploymentTax,
                TreeCess: remission[0]?.TreeCess,
                FireCess: remission[0]?.FireCess,
                LightCess: remission[0]?.LightCess,
                DrainCess: remission[0]?.DrainCess,
                RoadCess: remission[0]?.RoadCess,
                Sanitation: remission[0]?.Sanitation,
                SpWaterCess: remission[0]?.SpWaterCess,
                WaterBenefitTax: remission[0]?.WaterBenefitTax,
                WaterBill: remission[0]?.WaterBill || 0,
                MajorBuildingTax: remission[0]?.MajorBuildingTax,
                SewageDispCess: remission[0]?.SewageDispCess,
                Tax1: remission[0]?.Tax1,
                Total: remission[0]?.Total

              });
            }
            setOwnerId(property.OwnerID);
            const constructionTypeDesc = property.propertydetailsnews[0]?.constructiontypemaster?.Description ?? '';
            setConstructionType(constructionTypeDesc);
            const propertyDescription = property?.PropertyTypeMaster?.PropertyDescription || ''
            setPropertyDescription(propertyDescription);
            setImages(property.images)
            setContactNo(property.MobileNo)
            const roomNo = property.propertydetailsnews?.[0]?.NoOfRooms || '';
            setNoOfRoom(roomNo)

            setDatabaseRows(rows);
            setNewConstructionPartValuation(newConstructiontransformedRows);
            setOldConstructionPartValuation(oldConstructionValuationRowstransformedRows);
            setOldRetentionPartValuation(oldRetentionPartValutionstransformedRows);
            setTotalValuationForAssement(finalRows);
            setIsWaterConnection(property.propertysocialdetails?.[0].IsWaterConn ? 'Yes' : 'No' || '');
            setIsRainWaterHarvesting(property.propertysocialdetails?.[0].IsRainwaterharvesting ? 'Yes' : 'No' || '');
            setCommonToilet(property.commToiletNo);
            setPropOld(propertydetailsold.OldPropertyNo);
            setProp(property.NewPropertyNo)

          }
        } catch (error) {
          console.error("Failed to fetch:", error);
        }
      };

      fetchPropertyDetails();
    }
  }, [newDetails.propertyNo, newDetails.wardNo, action]);
  useEffect(() => {

    if (oldDetails.wardNo) {

      const fetchPropertyList = async () => {
        const fetchPropertyList = await getPropertyByOldWardNo(oldDetails.wardNo)

        const proplist = Object.values(fetchPropertyList.data || {}) // ensure .data exists
          .map((property) => property.OldPropertyNo)
          .filter((no) => no !== undefined && no !== null && !isNaN(Number(no))) // remove invalid
          .sort((a, b) => Number(a) - Number(b));;

        setPropertyListOld(proplist);
      }
      fetchPropertyList();
    }
  }, [oldDetails.wardNo])


  useEffect(() => {

    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    // if (!oldDetails.wardNo && !oldDetails.propertyNo) {
    //   return
    // }
    if (oldDetails.propertyNo && oldDetails.wardNo && sourceRef.current !== 'new') {
      sourceRef.current = 'old';
      const fetchDetailsWithOldDetails = async () => {

        try {


          const response = await getDetailsWithOldDetails(oldDetails.wardNo, oldDetails.propertyNo)

          if (Array.isArray(response) && response.length > 0) {

            const property = response[0];
            const propertydetailsold = property.oldpropertymast || {};
            const propertydetailsnew = property.propertydetailsnews?.[0] || {};
            const rows = response?.[1] || [];
            const totalValuationRows = response?.[5] || []
            const totalValuationArray = Object.values(totalValuationRows);
            const transformedRows = totalValuationArray.map(row => ({
              typeOfUse: row.Use,
              ALV: row.ALV,
              maintenance: row.Maintenance,
              RV: row.RV,
              propertyTax: row.PropertyTax,
              propertyPercentage: row["Prop.%"],
              educationTax: row.EducationTax,
              educationPercentage: row["Edu.%"],
              employmentTax: row.EmploymentTax,
              employmentPercentage: row["Emp.%"],
              total: row.Total
            }));
            const emptyRowTemplate = {
              typeOfUse: '',
              ALV: 0,
              maintenance: 0,
              RV: 0,
              propertyTax: 0,
              propertyPercentage: 0,
              educationTax: 0,
              educationPercentage: 0,
              employmentTax: 0,
              employmentPercentage: 0,
              total: 0
            };

            // console.log(transformedRows, 'transformedRows')
            const newRows = Object.values(rows).reduce((acc, row) => {
              // Start with the row structure based on the type of use
              // const newRow = { ...emptyRowTemplate }; // Row template with all empty values
              let targetRow; // This will be either the 'R' or 'C' row, depending on the type of use

              // Check the type of use and set the target row
              if (row.Type === 'R') {
                targetRow = acc.R; // Accumulate values for 'R'
                // Sum the values for type 'R', ensuring they are numbers
                targetRow.typeOfUse = "R";
                targetRow.ALV += Number(row.AnnualRentalValue) || 0;
                targetRow.maintenance += Number(row.Maintenance) || 0;
                targetRow.RV += Number(row.RateableValue) || 0;
                targetRow.propertyTax += Number(row.PropertyTax) || 0;
                targetRow.propertyPercentage = Number(row.PropertyTaxPer) || 0;
                targetRow.educationTax += Number(row.REducationTax) || 0;
                targetRow.educationPercentage = Number(row.REducationTaxPercenatge) || 0;
                targetRow.employmentTax += Number(row.REmploymentTax) || 0;
                targetRow.employmentPercentage = Number(row.REmploymentTaxPercenatge) || 0;
                targetRow.total += (
                  Number(row.PropertyTax) || 0
                ) + (Number(row.Maintenance) || 0) + (Number(row.REducationTax) || 0) + (Number(row.REmploymentTax) || 0);
              } else if (row.Type === 'C') {
                targetRow = acc.C; // Accumulate values for 'C'
                targetRow.typeOfUse = "C";
                targetRow.ALV += Number(row.AnnualRentalValue) || 0;
                targetRow.maintenance += Number(row.Maintenance) || 0;
                targetRow.RV += Number(row.RateableValue) || 0;
                targetRow.propertyTax += Number(row.PropertyTax) || 0;
                targetRow.propertyPercentage = Number(row.PropertyTaxPer) || 0;
                targetRow.educationTax += Number(row.CEducationTax) || 0;
                targetRow.educationPercentage = Number(row.CEducationTaxPercenatge) || 0;
                targetRow.employmentTax += Number(row.CEmploymentTax) || 0;
                targetRow.employmentPercentage = Number(row.CEmploymentTaxPercenatge) || 0;
                targetRow.total += (
                  Number(row.PropertyTax) || 0
                ) + (Number(row.Maintenance) || 0) + (Number(row.CEducationTax) || 0) + (Number(row.CEmploymentTax) || 0);
              }

              return acc;
            }, { R: { ...emptyRowTemplate, typeOfUse: "R" }, C: { ...emptyRowTemplate, typeOfUse: "C" } }); // Initialize two rows: one for 'R' and one for 'C'

            // The result will be two rows: one for type 'R' and one for type 'C'
            const finalRows = [newRows.R, newRows.C];



            console.log(finalRows, 'finalRows');

            const totalEduTax = finalRows.reduce(
              (sum, row) => sum + row.educationTax,
              0
            );
            const totalEmpTax = finalRows.reduce(
              (sum, row) => sum + row.employmentTax,
              0
            );
            const newConstructionRows = response?.[2] || []
            const newConstructionRowsArray = Object.values(newConstructionRows);
            const newConstructiontransformedRows = newConstructionRowsArray.map(row => ({
              use: row.Use || '',
              reason: row.Reason || '',
              alv: row.ALV || 0,
              maintenance: row.Maintenance || 0,
              rv: row.RV || 0,
            }));


            const oldConstructionValuationRows = response?.[3] || []
            const oldConstructionValuationRowsArray = Object.values(oldConstructionValuationRows);
            const oldConstructionValuationRowstransformedRows = oldConstructionValuationRowsArray.map(row => ({
              use: row.Use || '',
              reason: row.Reason || '',
              alv: row.ALV || 0,
              maintenance: row.Maintenance || 0,
              rv: row.RV || 0,
            }));

            const oldRetentionPartValutionRows = response?.[4] || []
            const oldRetentionPartValutionRowsArray = Object.values(oldRetentionPartValutionRows);
            const oldRetentionPartValutionstransformedRows = oldRetentionPartValutionRowsArray.map(row => ({
              use: row.Use || '',
              reason: row.Reason || '',
              alv: row.ALV || 0,
              maintenance: row.Maintenance || 0,
              rv: row.RV || 0,
            }));

            const netTaxesRow = response?.[6] || []


            setNetTaxes({

              PropertyTax: netTaxesRow[0]?.PropertyTax || 0,
              EducationTax: totalEduTax || 0,
              SpEducationTax: netTaxesRow[0]?.SpEducationTax || 0,
              EmploymentTax: totalEmpTax || 0,
              TreeCess: netTaxesRow[0]?.TreeCess || 0,
              FireCess: netTaxesRow[0]?.FireCess || 0,
              LightCess: netTaxesRow[0]?.LightCess || 0,
              DrainCess: property?.PropertyTypeMaster?.Tax || 0,
              RoadCess: netTaxesRow[0]?.RoadCess || 0,
              Sanitation: netTaxesRow[0]?.Sanitation || 0,
              SpWaterCess: netTaxesRow[0]?.SpWaterCess || 0,
              WaterBenefitTax: netTaxesRow[0]?.WaterBenefitTax || 0,
              WaterBill: netTaxesRow[0]?.WaterBill || 0,
              MajorBuildingTax: netTaxesRow[0]?.MajorBuildingTax || 0,
              SewageDispCess: netTaxesRow[0]?.SewageDispCess || 0,
              Tax1: netTaxesRow[0]?.Tax1 || 0,
              Total: Number(netTaxesRow[0]?.Total) + Number(property?.PropertyTypeMaster?.Tax) + Number(totalEduTax) + Number(totalEmpTax)
            })

            setNewDetails(prev => {

              return {
                ...prev,
                propertyNo: property.NewPropertyNo || '',
                zoneNo: property.NewZoneNo || '',
                wardNo: property.NewWardNo || '',
                partitionNo: property.NewPartitionNo || '',
                citySNo: property.NewCityServeyNo || '',
                plotNo: property.NewPlotNo || '',
                plotAreaSqFt: property.PlotArea ?? '',
                buildUpAreaSqFt: property.propertydetailsnews?.[0]?.BuildUpAreaSqFeet || '',
                carpetAreaSqFt: property.propertydetailsnews?.[0]?.CarpetAreaSqFeet || '',
              };


            });

            setOldDetails(pre => {

              return {
                ...pre,
                zoneNo: propertydetailsold.OldZoneNo || '',
                // wardNo: propertydetailsold.OldWardNo || '',
                // propertyNo: propertydetailsold.OldPropertyNo || '',
                partitionNo: propertydetailsold.OldPartitionNo || '',
                citySNo: propertydetailsold.OldCityServeyNo || '',
                plotNo: propertydetailsold.OldPlotNo || '',
                plotAreaSqFt: propertydetailsold.OldPlotArea ?? '',
                buildUpAreaSqFt: propertydetailsold.PropertyDetailsOlds?.[0]?.OldBuildUpAreaSqFeet || '',
                carpetAreaSqFt: propertydetailsold.PropertyDetailsOlds?.[0]?.OldCarpetAreaSqfeet || '',
                OldALV: propertydetailsold.OldALV || '',
                OldRV: propertydetailsold.OldRV || '',
                OldTotalTax: propertydetailsold.OldTotalTax || '',
              };


            });
            const retain = response?.[7] || []
            setRetainOwnerID(retain[0]?.OwnerID || '');
            setRetainReason(retain[0]?.Reason || '');
            setRetainRV(retain[0]?.RentalValue || '');
            setRetainTaxes({

              PropertyTax: retain[0]?.PropertyTax,
              EducationTax: retain[0]?.EducationTax,
              SpEducationTax: retain[0]?.SpEducationTax,
              EmploymentTax: retain[0]?.EmploymentTax,
              TreeCess: retain[0]?.TreeCess,
              FireCess: retain[0]?.FireCess,
              LightCess: retain[0]?.LightCess,
              DrainCess: retain[0]?.DrainCess,
              RoadCess: retain[0]?.RoadCess,
              Sanitation: retain[0]?.Sanitation,
              SpWaterCess: retain[0]?.SpWaterCess,
              WaterBenefitTax: retain[0]?.WaterBenefit,
              WaterBill: retain[0]?.WaterBill || 0,
              MajorBuildingTax: retain[0]?.MajorBuilding,
              SewageDispCess: retain[0]?.SewageDisposalCess,
              Tax1: retain[0]?.Tax1,
              Total: retain[0]?.Total
            });
            const hearing = response?.[8] || []
            setHearingReason(hearing[0]?.Reason || '');
            setHearingRV(hearing[0]?.RV || '');
            setHearingTaxes({
              PropertyTax: hearing[0]?.PropertyTax,
              EducationTax: hearing[0]?.EducationTax,
              SpEducationTax: hearing[0]?.SpEducationTax,
              EmploymentTax: hearing[0]?.EmploymentTax,
              TreeCess: hearing[0]?.TreeCess,
              FireCess: hearing[0]?.FireCess,
              LightCess: hearing[0]?.LightCess,
              DrainCess: hearing[0]?.DrainCess,
              RoadCess: hearing[0]?.RoadCess,
              Sanitation: hearing[0]?.Sanitation,
              SpWaterCess: hearing[0]?.SpWaterCess,
              WaterBenefitTax: hearing[0]?.WaterBenefitTax,
              WaterBill: hearing[0]?.WaterBill,
              MajorBuildingTax: hearing[0]?.MajorBuildingTax,
              SewageDispCess: hearing[0]?.SewageDispCess,
              Tax1: hearing[0]?.Tax1,
              Total: hearing[0]?.Total
            });
            const appeal = response?.[9] || []
            setAppealReason(appeal[0]?.Reason || '');
            setAppealRV(appeal[0]?.RV || '');
            setAppealTaxes({
              PropertyTax: appeal[0]?.PropertyTax,
              EducationTax: appeal[0]?.EducationTax,
              SpEducationTax: appeal[0]?.SpEducationTax,
              EmploymentTax: appeal[0]?.EmploymentTax,
              TreeCess: appeal[0]?.TreeCess,
              FireCess: appeal[0]?.FireCess,
              LightCess: appeal[0]?.LightCess,
              DrainCess: appeal[0]?.DrainCess,
              RoadCess: appeal[0]?.RoadCess,
              Sanitation: appeal[0]?.Sanitation,
              SpWaterCess: appeal[0]?.SpWaterCess,
              WaterBenefitTax: appeal[0]?.WaterBenefitTax,
              WaterBill: appeal[0]?.WaterBill,
              MajorBuildingTax: appeal[0]?.MajorBuildingTax,
              SewageDispCess: appeal[0]?.SewageDispCess,
              Tax1: appeal[0]?.Tax1,
              Total: appeal[0]?.Total
            });
            const remission = response?.[10] || []
            setRemissionReason(remission[0]?.Reason || '');
            setRemissionRV(remission[0]?.RentalValue || '');
            setRemissionTaxes({
              PropertyTax: remission[0]?.PropertyTax,
              EducationTax: remission[0]?.EducationTax,
              SpEducationTax: remission[0]?.SpEducationTax,
              EmploymentTax: remission[0]?.EmploymentTax,
              TreeCess: remission[0]?.TreeCess,
              FireCess: remission[0]?.FireCess,
              LightCess: remission[0]?.LightCess,
              DrainCess: remission[0]?.DrainCess,
              RoadCess: remission[0]?.RoadCess,
              Sanitation: remission[0]?.Sanitation,
              SpWaterCess: remission[0]?.SpWaterCess,
              WaterBenefitTax: remission[0]?.WaterBenefitTax,
              WaterBill: remission[0]?.WaterBill || 0,
              MajorBuildingTax: remission[0]?.MajorBuildingTax,
              SewageDispCess: remission[0]?.SewageDispCess,
              Tax1: remission[0]?.Tax1,
              Total: remission[0]?.Total

            });

            setOwnerRenterDetails(pre => ({
              ...pre,
              ownerName: property.OwnerName,
              address: property.Address,
              renterName: propertydetailsnew.RenterName,
              occupierName: propertydetailsnew.OccupierName,
              buildingOrShopName: property.BuildingOrShopName,
              buildingOrFlatNo: property.BuildingOrFlatNo,
              rent: propertydetailsnew.Rent,
              nonCalculatedRent: propertydetailsnew.NonCalculateRent,
            }))
            setOwnerId(property.OwnerID);
            const constructionTypeDesc = property.propertydetailsnews[0]?.constructiontypemaster?.Description ?? '';
            setConstructionType(constructionTypeDesc);
            const propertyDescription = Array.isArray(property.PropertyTypeMaster) && property.PropertyTypeMaster.length > 0
              ? property.PropertyTypeMaster.PropertyDescription
              : '';
            setPropertyDescription(propertyDescription);
            setImages(property.images)
            setContactNo(property.MobileNo)
            const roomNo = property.propertydetailsnews?.[0]?.NoOfRooms || '';
            setNoOfRoom(roomNo)

            setDatabaseRows(rows);
            setNewConstructionPartValuation(newConstructiontransformedRows);
            setOldConstructionPartValuation(oldConstructionValuationRowstransformedRows);
            setOldRetentionPartValuation(oldRetentionPartValutionstransformedRows);
            setTotalValuationForAssement(finalRows);
            setIsWaterConnection(property.propertysocialdetails?.[0].IsWaterConn ? 'Yes' : 'No' || '');
            setIsRainWaterHarvesting(property.propertysocialdetails?.[0].IsRainwaterharvesting ? 'Yes' : 'No' || '');
            setCommonToilet(property.commToiletNo);
            setPropOld(propertydetailsold.OldPropertyNo);
            setProp(property.NewPropertyNo)

          }
        }

        catch (error) {


        }
      }
      fetchDetailsWithOldDetails();
    }
  }, [oldDetails.propertyNo, oldDetails.wardNo])
  useEffect(() => {

  }, [newDetails, oldDetails, images])

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (newDetails.wardNo) {
      const fetchPropertyList = async () => {
        const propertyRange = await fetchPropertyRangeByWard(newDetails.wardNo);
        const propertyList = propertyRange.properties;
        const propertyMap = new Map();


        propertyList.forEach((p) => {
          const baseNo = p.NewPropertyNo;
          const partition = p.NewPartitionNo;


          if (!propertyMap.has(baseNo)) {
            propertyMap.set(baseNo, []);
          }

          if (partition) {
            propertyMap.get(baseNo).push(partition);
          } else {
            propertyMap.get(baseNo); // Ensure baseNo is recorded even without partition
          }
        });

        const sortedList = [];

        Array.from(propertyMap.entries())
          .sort((a, b) => Number(a[0]) - Number(b[0])) // Sort base property numbers numerically
          .forEach(([baseNo, partitions]) => {
            sortedList.push(baseNo); // Add base number first

            partitions
              .sort((p1, p2) => {
                const n1 = isNaN(p1) ? p1 : Number(p1);
                const n2 = isNaN(p2) ? p2 : Number(p2);
                return typeof n1 === 'number' && typeof n2 === 'number' ? n1 - n2 : String(n1).localeCompare(String(n2));
              })
              .forEach((part) => {
                sortedList.push(`${baseNo}-${part}`);
              });
          });


        setPropertyList(sortedList);
      }
      fetchPropertyList();
    }

    setPropertyDescription('');
    setImages([]);
    setOwnerId('');
    setOldDetails({
      zoneNo: null,
      wardNo: null,
      propertyNo: null,
      partitionNo: null,
      citySNo: null,
      plotNo: null,
      buildUpAreaSqFt: null,
      carpetAreaSqFt: null,
      plotAreaSqFt: null,
      OldALV: '',
      OldRV: '',
      OldTotalTax: '',
    })
    setNewDetails(pre => ({
      ...pre,
      zoneNo: null,
      propertyNo: null,
      partitionNo: null,
      citySNo: null,
      plotNo: null,
      buildUpAreaSqFt: null,
      carpetAreaSqFt: null,
      plotAreaSqFt: null
    }))
    setOwnerRenterDetails({
      ownerName: '',
      address: '',
      renterName: '',
      occupierName: '',
      buildingOrShopName: '',
      buildingOrFlatNo: '',
      rent: '',
      nonCalculatedRent: '',
    })
    setTotalValuationForAssement({

      typeOfUse: '',
      ALV: '',
      maintenance: '',
      RV: '',
      propertyTax: '',
      propertyPercentage: '',
      educationTax: '',
      educationPercentage: '',
      employmentTax: '',
      employmentPercentage: '',
      total: ''

    })
    setNewConstructionPartValuation({
      use: "",
      reason: '',
      alv: '',
      maintenance: '',
      rv: ''
    });
    setOldConstructionPartValuation({
      use: "",
      reason: '',
      alv: '',
      maintenance: '',
      rv: ''
    });
    setOldRetentionPartValuation({
      use: "",
      reason: '',
      alv: '',
      maintenance: '',
      rv: ''
    })
    setNetTaxes({

    })
    setAppealTaxes({});
    setHearingTaxes({});
    setConstructionType('');
    setPropertyDescription('');
    setContactNo('')
    setNoOfRoom('')
    setDatabaseRows([]);
    setIsWaterConnection('');
    setIsRainWaterHarvesting('');
    setCommonToilet('');
    setProp('')
    setPropOld('')
    setRetainOwnerID('');
    setRetainReason('');
    setRetainRV('');
    setRetainTaxes({

    });
    setRemissionTaxes({

    })
    setRemissionRV('');
    setRemissionReason('');

    setHearingReason('');
    setHearingRV('');
    setAppealRV('');
    setAppealReason('');

  }, [newDetails.wardNo])

  const [totalRV, setTotalRV] = useState(0);
  const [totalAnnualRentalValue, setTotalAnnualRentalValue] = useState(0);

  useEffect(() => {
    let totalRV = 0;
    let totalARV = 0;
    const transformed = Object.values(databaseRows).map((row, index) => {
      const rv = Number(row?.RateableValue).toFixed(2);
      const annualRentalValue = Number(row?.AnnualRentalValue).toFixed(2);

      totalRV += Number(rv);
      totalARV += Number(annualRentalValue);
      // const readyReckonerRate = row.readyReckonerRate || 0;
      // const rateBaseValue = readyReckonerRate * row.builtUpAreaSqFt;
      // const floorSpaceIndex = row.builtUpAreaSqFt / row.carpetAreaSqFt;
      // const userCategory = row.constType === 'Residential' ? 'Category A' : 'Category B';
      // const ageFactor = new Date().getFullYear() - row.constYear;
      // const floorFactor = row.floor === 'Ground Floor' ? 1.0 : 0.9;
      // const weightageByNTB = row.majorBuilding === 'Yes' ? 1.2 : 1.0;
      // const capitalValue = rateBaseValue * floorFactor * weightageByNTB;

      return {
        id: row.ID || index + 1, // Use actual ID if present
        floor: row.Floor,
        constYear: row.ConstructionYear,
        constType: row.ConstructionType,
        use: row.TypeOfUseID,
        carpetAreaSqFt: Number(row.CarpetAreaSqFeet).toFixed(2),
        carpetAreaSqMtr: Number(row.CarpetAreaInMtr).toFixed(2),
        builtUpAreaSqFt: Number(row.BuiltUpAreaInSqft).toFixed(2),
        builtUpAreaSqMtr: Number(row.BuiltUpAreaInSqMtr).toFixed(2),
        yearlyRate: Number(row.YearlyRate).toFixed(2),
        monthlyRate: Number(row.MonthlyRate).toFixed(2),
        depreciation: Number(row.Depreciation).toFixed(2),
        annualRentalValue: Number(row.AnnualRentalValue).toFixed(2),
        maintenance: Number(row.Maintenance).toFixed(2),
        rv: Number(row.RateableValue).toFixed(2),
        propertyTax: Number(row.PropertyTax).toFixed(2),
        treeCess: Number(row.TreeCess).toFixed(2),
        spEducationTax: Number(row.SpEducationTax).toFixed(2),
        fireCess: Number(row.FireCess).toFixed(2),
        roadCess: Number(row.RoadCess).toFixed(2),
        lightCess: Number(row.LightCess).toFixed(2),
        sewageDisposalCess: Number(row.SewageDispCess).toFixed(2),
        drainCess: Number(row.DrainCess).toFixed(2),
        spWaterCess: Number(row.SpWaterCess).toFixed(2),
        waterBenefits: Number(row.WaterBenefitTax).toFixed(2),
        majorBuilding: Number(row.MajorBuildingTax).toFixed(2),
        waterBill: Number(row.WaterBill).toFixed(2),
        tax1: Number(row.Tax1).toFixed(2),
        yRV: Number(row.YearlyRent).toFixed(2),
        //   rateBaseValue,
        //   floorSpaceIndex,
        //   userCategory,
        //   AgeFactor:row.AgeFactor,
        //   floorFactor,
        //   weightageByNTB,
        //   capitalValue
      };
    });

    setGridRows(transformed);
    setTotalRV(Number(totalRV).toFixed(2));
    setTotalAnnualRentalValue(Number(totalARV).toFixed(2));
  }, [databaseRows]);
  const columns = [

    {
      field: 'floor', headerName: 'FLOOR', width: 100, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'constYear', headerName: 'CONSTRUCTION YEAR', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'constType', headerName: 'CONSTRUCTION TYPE', width: 180, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    { field: 'use', headerName: 'USE TYPE', width: 120 },
    {
      field: 'carpetAreaSqFt', headerName: 'CARPET AREA (SQFT)', width: 180, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'carpetAreaSqMtr', headerName: 'CARPET AREA (SQMTR)', width: 180, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'builtUpAreaSqFt', headerName: 'BUILTUP AREA (SQFT)', width: 180, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'builtUpAreaSqMtr', headerName: 'BUILTUP AREA (SQMTR)', width: 180, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'yearlyRate', headerName: 'YEARLY RATE', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'monthlyRate', headerName: 'MONTHLY RATE', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'yRV', headerName: 'Y RV', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'depreciation', headerName: 'DEPRECIATION', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'annualRentalValue', headerName: 'ANNUAL RENTAL VALUE', width: 200, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },

    {
      field: 'maintenance', headerName: 'MAINTENANCE', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'rv', headerName: 'RATEABLE VALUE', width: 160, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'propertyTax', headerName: 'PROPERTY TAX', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'treeCess', headerName: 'TREE CESS', width: 120, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'spEducationTax', headerName: 'SP EDUCATION TAX', width: 180, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'fireCess', headerName: 'FIRE CESS', width: 120, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'roadCess', headerName: 'ROAD CESS', width: 120, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'lightCess', headerName: 'LIGHT CESS', width: 120, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'sewageDisposalCess', headerName: 'SEWAGE DISPOSAL CESS', width: 200, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'drainCess', headerName: 'DRAIN CESS', width: 120, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'spWaterCess', headerName: 'SP WATER CESS', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'waterBenefits', headerName: 'WATER BENEFITS', width: 150, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'majorBuilding', headerName: 'MAJOR BUILDING', width: 160, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'waterBill', headerName: 'WATER BILL', width: 120, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    {
      field: 'tax1', headerName: 'TAX 1', width: 100, headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
      ),
    },
    // {
    //   field: 'yrv', headerName: 'Annual Rental Value', width: 100, headerAlign: 'center',
    //   renderCell: (params) => (
    //     <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
    //   ),
    // },
    //  {
    //   field: 'rV', headerName: 'RV', width: 100, headerAlign: 'center',
    //   renderCell: (params) => (
    //     <div style={{ width: '100%', textAlign: 'center' }}>{params.value}</div>
    //   ),
    // },
    // The following fields do not exist in the provided object, so excluding them:
    // { field: 'readyReckonerRate', headerName: 'READY RECKONER RATE', width: 200 },
    // { field: 'rateBaseValue', headerName: 'RATE BASE VALUE', width: 180 },
    // { field: 'floorSpaceIndex', headerName: 'FSI', width: 100 },
    // { field: 'Type', headerName: 'USER CATEGORY', width: 160 },
    //{ field: 'AgeFactor', headerName: 'AGE FACTOR', width: 140 },
    // { field: 'FloorFactor', headerName: 'FLOOR FACTOR', width: 140 },
    // No direct mapping for weightageByNTB or capitalValue in data
  ];

  const [open, setOpen] = useState(false);
  const [openOld, setOpenOld] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [financeYearList, setFinanceYearList] = useState([])
  useEffect(() => {
    const loadYear = async () => {
      const list = await getFinanceYear();   // [{ FinanceYear: '2021-22'}, … ]



      setFinanceYearList(list);          // keep only the highest
    };

    loadYear();
  }, []);

  const handleActionChange = (event) => {
    const selectedValue = Number(event.target.value);

    if (selectedValue) {
      setPendingAction(selectedValue); // store what user selected
      setOpenConfirm(true); // open confirm dialog
    }
  };
  const handleConfirm = () => {
    setAction(pendingAction); // apply the action after confirm
    setOpenConfirm(false);
  };

  const handleCancel = () => {
    setPendingAction(null);
    setOpenConfirm(false);
  };
  useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    // perform action based on value
    const runAction = async () => {
      switch (action) {
        case 1:

          const applyPolicy = async () => {
            try {
              if (!ownerId || ownerId == Null) {
                setReceivedMessage("Please select owner details");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return
              }
              if (applicalePolicy == '') {
                setReceivedMessage("Please select policy for apply");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return
              }
              console.log(ownerId, 'ownerid')
              const response = await applyPolicyDetails(ownerId, applicalePolicy)
              if (response && response.status === 200) {

                setReceivedMessage(response.data.message);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
              } else {

                setReceivedMessage('Failed to apply policy');
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
              }
            } catch (error) {

              setReceivedMessage('Failed to apply policy');
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          }
          applyPolicy();

          break;
        case 2:

          const removeRetention = async () => {
            try {
              const response = await removeRetentionDetails(ownerId)
              if (response && response.status === 200) {

                setSnackbarOpen(true);
                // setSnackbarMessage("Retention removed successfully");
                setReceivedMessage('Retention removed successfully');
                setSnackbarSeverity("success");
              }
              else {

                setSnackbarOpen(true);
                // setSnackbarMessage("Failed to remove retention");
                setReceivedMessage('Failed to remove retention');
                setSnackbarSeverity("error");
              }
            } catch (error) {
              console.error("Error removing retention:", error);
            }
          };
          removeRetention();
          break;
        case 3:

          const removeAppealCommittee = async () => {
            try {
              const response = await removeAppealCommitteeDetails(ownerId)
              if (response && response.status === 200) {

                setSnackbarOpen(true);
                // setSnackbarMessage("Appeal committee removed successfully");
                setReceivedMessage('Appeal committee removed successfully');
                setSnackbarSeverity("success");
              }
              else {

                setSnackbarOpen(true);
                // setSnackbarMessage("Failed to remove appeal committee");
                setReceivedMessage('Failed to remove appeal committee');
                setSnackbarSeverity("error");
              }
            } catch (error) {
              console.error("Error removing appeal committee:", error);
            }
          };
          removeAppealCommittee();
          break;
        case 4:

          const removeRemission = async () => {
            try {
              const response = await removeRemissionDetails(ownerId)
              if (response && response.status === 200) {

                setSnackbarOpen(true);
                // setSnackbarMessage("Remission removed successfully");
                setReceivedMessage('Remission removed successfully');
                setSnackbarSeverity("success");
              }
              else {

                setSnackbarOpen(true);
                // setSnackbarMessage("Failed to remove remission");
                setReceivedMessage('Failed to remove remission');
                setSnackbarSeverity("error");
              }
            } catch (error) {
              console.error("Error removing remission:", error);
            }
          };
          removeRemission();
          break;
        case 5:

          const removeAllAppeals = async () => {
            try {
              const response = await removeAllAppealsDetails(ownerId)

              if (response && response.status === 200) {

                setSnackbarOpen(true);
                // setSnackbarMessage("All appeals removed successfully");
                setReceivedMessage('All appeals removed successfully');
                setSnackbarSeverity("success");
              }
              else {

                setSnackbarOpen(true);
                // setSnackbarMessage("Failed to remove all appeals");
                setReceivedMessage('Failed to remove all appeals');
                setSnackbarSeverity("error");
              }

            } catch (error) {
              console.error("Error removing all appeals:", error);
            }
          };
          removeAllAppeals();
          break;
        case 6:

          const removeHearing = async () => {
            try {
              const response = await removeHearingDetails(ownerId)

              if (response && response.status === 200) {

                setSnackbarOpen(true);
                // setSnackbarMessage("All hearings removed successfully");
                setReceivedMessage(' Hearings removed successfully');
                setSnackbarSeverity("success");
              }
              else {

                setSnackbarOpen(true);
                // setSnackbarMessage("Failed to remove all hearings");
                setReceivedMessage('Failed to remove  Hearings');
                setSnackbarSeverity("error");
              }

            } catch (error) {
              console.error("Error removing all hearings:", error);
            }
          };
          removeHearing();
          break;
        default:
          break;
      }
    };
    setNewDetails((pre) => ({ ...pre, propertyNo: newDetails.propertyNo }));
    setAction('')
    runAction();
  }, [action]);

  useEffect(() => { }, [applicalePolicy])


  return (
    <> <Dialog open={openConfirm} onClose={handleCancel}>
      <DialogTitle>{pendingAction == 1 ? "Confirm Apply" : "Confirm Removal"}</DialogTitle>
      <DialogContent>
        {pendingAction !== 1 ? (<DialogContentText>
          Do you want to remove this record? This action cannot be undone.
        </DialogContentText>) : (<DialogContentText>
          Are you sure you want to Apply this policy? This action cannot be undone.
        </DialogContentText>)}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">Cancel</Button>
        <Button onClick={handleConfirm} color="error">{pendingAction !== 1 ? "Yes, Remove" : "Yes, Apply"}</Button>
      </DialogActions>
    </Dialog>
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
        <MainCard sx={{ color: 'Blue' }}>
          <Typography variant="h4" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
            Basic Property Details
          </Typography>
          <MainCard>
            <Grid container spacing={2}>
              <Grid item xs={14} sm={7}>
                <Grid container spacing={0.4}>
                  <Grid item xs={14} style={{ textAlign: 'center' }} mb={2} mt={2}>
                    <Stack spacing={0.4}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '20px', textAlign: 'center' }}>NEW</InputLabel>
                    </Stack>
                  </Grid>
                  {fields.map((item, index) => (
                    <Grid
                      item
                      xs={6}      // 2 boxes per row on extra-small screens (mobile)
                      sm={4}      // 3 boxes per row on small screens (tablets)
                      md={1.33}   // 9 boxes per row on medium screens (laptops)
                      lg={1.33}   // 9 boxes per row on large screens (desktops)
                      key={item.field}
                      style={{ textAlign: 'center' }}
                    >
                      <Stack spacing={1}>
                        <Typography
                          component="div"
                          sx={{ fontWeight: 'bolder', fontSize: '13px', height: '37px' }}
                          dangerouslySetInnerHTML={{ __html: item.label }}
                        />
                        {(item.field === 'propertyNo') ? (
                          <Autocomplete
                            freeSolo
                            fullWidth
                            open={open}
                            onOpen={() => setOpen(true)}     // Automatically opens dropdown on focus
                            onClose={() => setOpen(false)}   // Closes dropdown on blur
                            id={`${item.field}`}
                            inputValue={prop || ''}
                            onInputChange={(event, newInputValue) => {
                              const [propertyNo, partitionNo] = String(newInputValue).split('-');
                              setProp(propertyNo);
                            }}
                            onChange={(_, newValue) => {
                              if (newValue) {
                                const [propertyNo, partitionNo] = String(newValue).split('-');


                                handleNewDetails('propertyNo', propertyNo || '');
                                handleNewDetails('partitionNo', partitionNo || '');

                                setProp(propertyNo);
                                sourceRef.current = 'new';
                              } else {
                                handleNewDetails('propertyNo', '');
                                handleNewDetails('partitionNo', '');
                                setProp('');
                              }
                            }}
                            options={Array.isArray(propertyList) ? propertyList.filter(Boolean) : []}
                            autoHighlight
                            filterOptions={(options, state) => {
                              const inputValue = (state.inputValue || '').toLowerCase();
                              return [...new Set(options)].filter((opt) =>
                                String(opt || '').toLowerCase().includes(inputValue)
                              );
                            }}
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {option}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required
                                // placeholder={item.label || 'Enter Value'}
                                disabled={item.field === 'zoneNo'}
                                value={params.inputProps.value || ''}
                                onFocus={() => setOpen(true)} // Ensure dropdown shows when focused
                                onBlur={() => setOpen(false)} // Hide when losing focus
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password'
                                }}
                              />
                            )}
                          />) : (< TextField
                            required
                            id={item.field}
                            name={item.field}
                            value={newDetails[item.field] || ''}
                            onChange={(item.field === 'wardNo') && ((e) => handleNewDetails(item.field, e.target.value))}
                            disabled={item.field === 'zoneNo'}
                            fullWidth
                          />)}
                      </Stack>
                    </Grid>
                  ))}

                  <Grid item xs={14} style={{ textAlign: 'center' }} mb={2} mt={2}>
                    <Stack spacing={0.4}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '20px', textAlign: 'center' }}>OLD</InputLabel>
                    </Stack>
                  </Grid>

                  {fields.map((item, index) => (
                    <Grid item
                      xs={6}      // 2 boxes per row on extra-small screens (mobile)
                      sm={4}      // 3 boxes per row on small screens (tablets)
                      md={1.33}   // 9 boxes per row on medium screens (laptops)
                      lg={1.33}   // 9 boxes per row on large screens (desktops)
                      key={item.field}
                      style={{ textAlign: 'center' }}>
                      <Stack spacing={1}>
                        <Typography
                          component="div"
                          sx={{ fontWeight: 'bolder', fontSize: '13px', height: '37px' }}
                          dangerouslySetInnerHTML={{ __html: item.label }}
                        />
                        {(item.field === 'propertyNo') ? (<Autocomplete
                          freeSolo
                          fullWidth
                          open={openOld}
                          onOpen={() => setOpenOld(true)}     // Automatically opens dropdown on focus
                          onClose={() => setOpenOld(false)}   // Closes dropdown on blur
                          id={`${item.field}-propertyNo`}
                          inputValue={propOld || ''}
                          onInputChange={(event, newInputValue) => {
                            setPropOld(newInputValue);
                          }}
                          onChange={(_, newValue) => {
                            handleOldDetails(item.field, newValue || '');
                            setPropOld(newValue);
                            sourceRef.current = 'Old';
                          }}
                          options={Array.isArray(propertyListOld) ? propertyList.filter(Boolean) : []}
                          autoHighlight
                          filterOptions={(options, state) => {
                            const inputValue = (state.inputValue || '').toLowerCase();
                            return [...new Set(options)].filter((opt) =>
                              String(opt || '').toLowerCase().includes(inputValue)
                            );
                          }}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              {option}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              // placeholder={item.label || 'Enter Value'}
                              disabled={item.field === 'zoneNo'}
                              value={params.inputProps.value || ''}
                              onFocus={() => setOpenOld(true)} // Ensure dropdown shows when focused
                              onBlur={() => setOpenOld(false)} // Hide when losing focus
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />) : (< TextField
                          required
                          id={item.field}
                          name={item.field}
                          value={oldDetails[item.field] || ''}
                          onChange={(item.field === 'wardNo') && ((e) => handleOldDetails(item.field, e.target.value))}
                          disabled={item.field === 'zoneNo'}
                          fullWidth
                        />)}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Right Side: Image */}
              <Grid item xs={14} sm={5} style={{ textAlign: 'center' }}>
                <Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} style={{ textAlign: 'center' }} mb={2}>
                      <Stack spacing={1}>
                        <InputLabel sx={{ fontWeight: 'bolder', fontSize: '20px', textAlign: 'center' }}>Show Photos And Plan</InputLabel>
                      </Stack>
                    </Grid>
                    <Grid container spacing={2} sx={{ overflow: 'visible' }}>
                      {/* PropertyPathA & PropertyPathB */}
                      <Grid item xs={6} md={6} lg={3}>
                        {[images.PropertyPathA, images.PropertyPathB].map((src, index) => {
                          const imageExists = !!src;
                          const imagePath = imageExists
                            ? src.startsWith('data:image')
                              ? src
                              : `data:image/jpeg;base64,${src.replace(/\s/g, '')}`
                            : '/no-image-placeholder.png';

                          return (
                            <Box
                              key={`A-B-${index}`}
                              sx={{
                                border: '2px solid #ccc',
                                padding: imageExists ? '20px' : '30px',
                                borderRadius: '19px',
                                marginBottom: '0.4vw',
                                transition: 'transform 0.1s ease, padding 0.3s ease',
                                transform: hoveredItem === index ? 'scale(3) translateY(20px)' : 'scale(1) translateY(0px)',
                                transformOrigin: 'left center',
                                position: 'relative',
                                zIndex: hoveredItem === index ? 10 : 1,
                              }}
                              onMouseEnter={() => handleMouseEnter(index)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <Box
                                component="img"
                                src={imagePath}
                                alt="No Image Available"
                                sx={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Grid>

                      {/* PropertyPathC & PropertyPathD */}
                      <Grid item xs={6} md={6} lg={3}>
                        {[images.PropertyPathC, images.PropertyPathD].map((src, index) => {
                          const imageExists = !!src;
                          const imagePath = imageExists
                            ? src.startsWith('data:image')
                              ? src
                              : `data:image/jpeg;base64,${src.replace(/\s/g, '')}`
                            : '/no-image-placeholder.png';

                          const hoverIndex = index + 2;

                          return (
                            <Box
                              key={`C-D-${index}`}
                              sx={{
                                border: '2px solid #ccc',
                                padding: imageExists ? '20px' : '30px',
                                borderRadius: '19px',
                                marginBottom: '0.4vw',
                                transition: 'transform 0.1s ease, padding 0.3s ease',
                                transform: hoveredItem === hoverIndex ? 'scale(3) translateY(20px)' : 'scale(1) translateY(0px)',
                                transformOrigin: 'left center',
                                position: 'relative',
                                zIndex: hoveredItem === hoverIndex ? 10 : 1,
                              }}
                              onMouseEnter={() => handleMouseEnter(hoverIndex)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <Box
                                component="img"
                                src={imagePath}
                                alt="No Image Available"
                                sx={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Grid>

                      {/* PlanPath */}
                      <Grid item xs={6} md={6} lg={3} mt={3}>
                        {(() => {
                          const imageExists = !!images.PlanPath;
                          const imagePath = imageExists
                            ? images.PlanPath.startsWith('data:image')
                              ? images.PlanPath
                              : `data:image/jpeg;base64,${images.PlanPath.replace(/\s/g, '')}`
                            : '/no-image-placeholder.png';

                          return (
                            <Box
                              sx={{
                                border: '2px solid #ccc',
                                padding: imageExists ? '35px' : '75px',
                                borderRadius: '19px',
                                marginBottom: '0.4vw',
                                marginRight: '-8vw',
                                transition: 'transform 0.1s ease, padding 0.3s ease',
                                transform: hoveredItem === 4 ? 'scale(2)' : 'scale(1)',
                                transformOrigin: 'right center',
                                position: 'relative',
                                zIndex: hoveredItem === 4 ? 10 : 1,
                              }}
                              onMouseEnter={() => handleMouseEnter(4)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <Box
                                component="img"
                                src={convertWMFToSVG(imagePath)}
                                alt="No Image Available"
                                sx={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            </Box>
                          );
                        })()}
                      </Grid>
                    </Grid>


                  </Grid>
                </Grid>{' '}
              </Grid>
            </Grid>

            {/* propertyDescription      */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1} mt={2} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', minWidth: '140px' }}>Property Description</InputLabel>
                  <Typography component="div" sx={{ fontWeight: 'bolder', fontSize: '15px', letterSpacing: '1px', color: 'red' }}>
                    {propertyDescription}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1} mt={2} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', minWidth: '140px' }}>Construction Type</InputLabel>
                  <Typography component="div" sx={{ fontWeight: 'bolder', fontSize: '15px', letterSpacing: '1px', color: 'red' }}>
                    {constructionType}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1} mt={2} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', minWidth: '90px' }}>Owner ID</InputLabel>
                  <TextField
                    InputProps={{
                      sx: { fontWeight: 'bolder' }
                    }}
                    required
                    id="ownerId"
                    name="ownerId"
                    fullWidth
                    value={ownerId}
                    onChange={handleChangeOwnerId}
                  />
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={3} mt={2}>
              <Box ml={4}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Owner & Renter Details" iconPosition="end" {...a11yProps(0)} />
                    <Tab label="Other Details" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <Box sx={{ overflowX: 'auto', minWidth: '55vw' }}>
                    <TableContainer >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Owner Name(Marathi)</TableCell>
                            <TableCell align="center">Addres(Marathi)</TableCell>
                            <TableCell align="center">Renter FullName(Marathi)</TableCell>
                            <TableCell align="center">Occuiper Name(Marathi)</TableCell>
                            <TableCell align="center">Shop/Build Name(Marathi)</TableCell>
                            <TableCell align="center">Shop/Flat No(Marathi)</TableCell>
                            <TableCell align="center">calculated rent(Marathi)</TableCell>
                            <TableCell align="center">Non-calculated rent</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            {Object.values(ownerRenterDetails).map((value, index) => (
                              <TableCell align="center" key={index}>{value}</TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={10} lg={6}>
                      <Box>
                        <Box sx={{ width: "250px" }}>
                          <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={6} sm={4.7}>
                              <Stack sx={{ mt: 1 }} spacing={1}>
                                <InputLabel style={{ fontWeight: 'bold' }}>Contact</InputLabel>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={7.3} mb={1}>
                              <Stack spacing={1}>
                                <Typography component="div">
                                  {contactNo}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={6} sm={4.7}>
                              <Stack sx={{ mt: 1 }} spacing={1}>
                                <InputLabel style={{ fontWeight: 'bold' }}>Water <br /> Connection</InputLabel>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={7.3} mb={1} mt={1}>
                              <Stack spacing={1}>
                                <Typography component="div">
                                  {isWaterConection}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                          <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={6} sm={4.6}>
                              <Stack sx={{ mt: 1 }} spacing={1}>
                                <InputLabel style={{ fontWeight: 'bold' }} >
                                  RainWater <br />
                                  Harvesting
                                </InputLabel>
                              </Stack>
                            </Grid>
                            <Grid item xs={6} sm={7.3} mb={1} mt={1}>
                              <Stack spacing={1}>
                                <Typography fullWidth component="div">
                                  {isRainWaterHarvesting}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={10} lg={6}>
                      <Box>
                        <Grid container justifyContent='space-evenly'>

                          <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
                            <Stack spacing={1}>
                              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Room</InputLabel>
                              <Typography component="div" >
                                {noOfRoom}
                              </Typography>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
                            <Stack spacing={1}>
                              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>R.Toliet</InputLabel>
                              <Typography component="div" >
                                {noOfRoom}
                              </Typography>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
                            <Stack spacing={1}>
                              <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>C.Toliet</InputLabel>
                              <Typography component="div" >
                                {commonToilet}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Box>
            </Grid>
          </MainCard>
          <Grid mt={2}>
            <MainCard>
              <Typography sx={{ color: 'Blue', fontSize: '16px' }} variant="h5" mb={1}>
                {' '}
                Property Wise Valuation Details
              </Typography>
              <DataGrid alignItems="center"
                rows={gridRows}
                columns={columns}
                getRowId={(row) => row.id || row.floor}
                pageSize={3}
                rowsPerPageOptions={[5, 10, 20]}
                // checkboxSelection // Enable if you need checkbox selection
                disableSelectionOnClick
              />
            </MainCard>
          </Grid>
          <Grid container spacing={1.5} mt={0}>
            <Grid item xs={12} md={5} lg={4}>
              <MainCard>
                <Accordion>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography sx={{ color: 'blue' }} variant="h5">
                      {' '}
                      New Construction Part Valuation{' '}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer sx={{ height: '17vh', width: '21vw' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Use</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>ALV</TableCell>
                            <TableCell>Maintenance</TableCell>
                            <TableCell>RV </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>

                          {Array.isArray(newConstructionPartValuation) &&
                            newConstructionPartValuation.map((row, rowIndex) => (
                              <TableRow hover key={rowIndex}>
                                {Object.values(row).map((value, cellIndex) => (
                                  <TableCell align="center" key={cellIndex}>
                                    {value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}

                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <MainCard>
                <Accordion>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography sx={{ color: 'blue' }} variant="h5">
                      {' '}
                      Old Construction Part Valuation
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer sx={{ height: '17vh', width: '21vw' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Use</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>ALV</TableCell>
                            <TableCell>Maintenance</TableCell>
                            <TableCell>RV </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(oldConstructionPartValuation) &&
                            oldConstructionPartValuation.map((row, rowIndex) => (
                              <TableRow hover key={rowIndex}>
                                {Object.values(row).map((value, cellIndex) => (
                                  <TableCell align="center" key={cellIndex}>
                                    {value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>{' '}
                </Accordion>
              </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <MainCard>
                <Accordion>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography sx={{ color: 'blue' }} variant="h5">
                      {' '}
                      Old Retention Part Valuation
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer sx={{ height: '17vh', width: '22vw' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Use</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>ALV</TableCell>
                            <TableCell>Maintenance</TableCell>
                            <TableCell>RV</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(oldRetentionPartValuation) &&
                            oldRetentionPartValuation.map((row, rowIndex) => (
                              <TableRow hover key={rowIndex}>
                                {Object.values(row).map((value, cellIndex) => (
                                  <TableCell align="center" key={cellIndex}>
                                    {value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>{' '}
                </Accordion>
              </MainCard>
            </Grid>
          </Grid>
          <Grid mt={2}>
            <MainCard>
              <Accordion>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                  <Typography sx={{ color: 'blue' }} variant="h5">
                    {' '}
                    Total Valuation For Assessment
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <TableContainer sx={{ height: '18vh', width: '68vw' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Use</TableCell>
                          <TableCell align="center">ALV</TableCell>
                          <TableCell align="center">Maintenance</TableCell>
                          <TableCell align="center">RV </TableCell>
                          <TableCell align="center">Property Tax </TableCell>
                          <TableCell align="center">Prop%</TableCell>
                          <TableCell align="center">Education Tax </TableCell>
                          <TableCell align="center">Edu% </TableCell>
                          <TableCell align="center">Employment Tax </TableCell>
                          <TableCell align="center">Emp% </TableCell>
                          <TableCell align="center">Total </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(totalValuationForAssessment) &&
                          totalValuationForAssessment.map((row, rowIndex) => (
                            <TableRow hover key={rowIndex}>
                              {Object.values(row).map((value, cellIndex) => (
                                <TableCell align="center" key={cellIndex}>
                                  {typeof value === 'number' ? value.toFixed(2) : value}
                                </TableCell>


                              ))}
                            </TableRow>
                          ))}

                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            </MainCard>
            <MainCard sx={{ borderRadius: '20px' }}>
              {!capitalValue && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old RV</InputLabel>
                      <TextField required fullWidth value={oldDetails.OldRV} />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old ALV</InputLabel>
                      <TextField required fullWidth value={oldDetails.OldALV} />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old Tax</InputLabel>
                      <TextField required fullWidth value={oldDetails.OldTotalTax} />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>New ALV</InputLabel>
                      <TextField value={totalAnnualRentalValue} required fullWidth />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Net RV</InputLabel>
                      <TextField value={totalRV} required fullWidth onClick={handleButtonNetRVClick} />
                    </Stack>
                  </Grid>
                  <Dialog open={openDialogRV} onClose={handleCloseNetRVDialog}>
                    <DialogTitle
                      sx={{
                        fontSize: '1rem', // Adjust font size
                        color: '#d32f2f' // Set text color (error red in Material-UI)
                      }}
                    >
                      RV Calculations:
                    </DialogTitle>
                    <DialogContent>
                      {/* Input box */}
                      <MainCard>
                        <Grid container spacing={2} mb={1} justifyContent="center">
                          {/* First Label and TextField */}
                          <Grid item xs={12} sm={3} mt={1}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <InputLabel sx={{ minWidth: '10px', fontWeight: 'bolder' }}>RV Calculations:</InputLabel>
                            </Stack>
                          </Grid>

                          {/* Second Label and TextField */}
                          <Grid item xs={12} sm={4}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <InputLabel sx={{ minWidth: '30px', fontWeight: 'bolder' }}>RV</InputLabel>
                              <TextField required fullWidth autoComplete="family-name" value="179096.23" />
                            </Stack>
                          </Grid>
                        </Grid>

                        {/* Table to display data */}
                        <TableContainer sx={{ marginTop: 1, height: 220 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Floor ID</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Const Year</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Const Type</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Type Of Use</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>NET ALV</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>NET RV</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>NET PERCENTAGE</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>CALCULATED ALV</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>CALCULATED RV</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>CALC percentage</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {/* Sample data rows */}
                              <TableRow>

                              </TableRow>
                              <TableRow>

                              </TableRow>
                              <TableRow>

                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </MainCard>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseNetRVDialog} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Retain Reason</InputLabel>
                      <TextField required fullWidth value={retainReason} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Retain RV</InputLabel>
                      <TextField required fullWidth value={retainRV} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Hearing RV</InputLabel>
                      <TextField required fullWidth value={hearingRV} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Hearing Reason</InputLabel>
                      <TextField required fullWidth value={hearingReason} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>App Committee RV</InputLabel>
                      <TextField required fullWidth value={appealRV} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.7}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>App Committee Reason</InputLabel>
                      <TextField required fullWidth value={appealReason} />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Remission RV</InputLabel>
                      <TextField required fullWidth value={remissionRV} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Remission Reason</InputLabel>
                      <TextField required fullWidth value={remissionReason} />
                    </Stack>
                  </Grid>
                </Grid>
              )}
              {capitalValue && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old CV</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old ALV</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Old Tax</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>New ALV</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Net CV</InputLabel>
                      <TextField required fullWidth onClick={handleButtonNetCVClick} />
                    </Stack>
                  </Grid>
                  <Dialog open={openDialogCV} onClose={handleCloseNetCVDialog}>
                    <DialogTitle
                      sx={{
                        fontSize: '1rem', // Adjust font size
                        color: '#d32f2f' // Set text color (error red in Material-UI)
                      }}
                    >
                      CV Calculations:
                    </DialogTitle>
                    <DialogContent>
                      {/* Input box */}
                      <MainCard>
                        <Grid container spacing={2} mb={1} justifyContent="center">
                          {/* First Label and TextField */}
                          <Grid item xs={12} sm={3} mt={1}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <InputLabel sx={{ minWidth: '10px', fontWeight: 'bolder' }}>CV Calculations:</InputLabel>
                            </Stack>
                          </Grid>

                          {/* Second Label and TextField */}
                          <Grid item xs={12} sm={4}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <InputLabel sx={{ minWidth: '30px', fontWeight: 'bolder' }}>CV</InputLabel>
                              <TextField required fullWidth autoComplete="family-name" value="179096.23" />
                            </Stack>
                          </Grid>
                        </Grid>

                        {/* Table to display data */}
                        <TableContainer sx={{ marginTop: 1, height: 220 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Floor ID</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Const Year</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Const Type</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Type Of Use</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>NET ALV</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>NET CV</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>NET PERCENTAGE</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>CALCULATED ALV</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>CALCULATED CV</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>CALC percentage</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {/* Sample data rows */}
                              <TableRow>

                              </TableRow>
                              <TableRow>

                              </TableRow>
                              <TableRow>

                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </MainCard>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseNetRVDialog} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Retain Reason</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Retain CV</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Hearing CV</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Hearing Reason</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>App Committee CV</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.7}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>App Committee Reason</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Remission CV</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={1.6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ fontWeight: 'bolder', fontSize: '13px' }}>Remission Reason</InputLabel>
                      <TextField required fullWidth />
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </MainCard>
          </Grid>
          <Grid>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Taxes</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Education</TableCell>
                    <TableCell>Sp.Edu.</TableCell>
                    <TableCell>Employment</TableCell>
                    <TableCell>Tree</TableCell>
                    <TableCell>Fire</TableCell>
                    <TableCell>Light</TableCell>
                    <TableCell>Drain</TableCell>
                    <TableCell>Road</TableCell>
                    <TableCell>Sanitation</TableCell>
                    <TableCell>W.Cess</TableCell>
                    <TableCell>W.benefit</TableCell>
                    <TableCell>Water Bill</TableCell>
                    <TableCell>Major Build</TableCell>
                    <TableCell>Sewage</TableCell>
                    <TableCell>Tax1</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Net</TableCell>
                    {Object.values(netTaxes).map((value, index) => (
                      <TableCell alignItems='Centre' key={index}>{Number(value).toFixed(2)}</TableCell>
                    ))}
                  </TableRow>

                  <TableRow hover>
                    <TableCell>Retain</TableCell>

                    {netTaxes.Total < oldDetails.OldTotalTax ? <TableCell colSpan={18} sx={{ pl: 3, color: 'blue', textTransform: 'none', backgroundColor: 'white' }}>
                      <Typography>Applicable : As per Old</Typography>
                    </TableCell> : retainOwnerID === '' ? (
                      <TableCell colSpan={18} sx={{ pl: 3, color: 'blue', textTransform: 'none', backgroundColor: 'white' }}>Applicable for : does not set policies</TableCell>
                    ) : Object.values(retainTaxes).map((value, index) => (
                      <TableCell alignItems='Centre' key={index}>{isNaN(Number(value)) ? "" : Number(value).toFixed(2)}</TableCell>
                    ))}
                  </TableRow>

                  <TableRow hover>
                    <TableCell>Hearing</TableCell>
                    {Object.values(hearingTaxes).map((value, index) => (
                      <TableCell alignItems='Centre' key={index}> {isNaN(Number(value)) ? "" : Number(value).toFixed(2)}</TableCell>
                    ))}
                  </TableRow>

                  <TableRow hover>
                    <TableCell>App. Comi.</TableCell>
                    {Object.values(appealTaxes).map((value, index) => (
                      <TableCell alignItems='Centre' key={index}> {isNaN(Number(value)) ? "" : Number(value).toFixed(2)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Remission</TableCell>
                    {Object.values(remissionTaxes).map((value, index) => (
                      <TableCell alignItems='Centre' key={index}> {isNaN(Number(value)) ? "" : Number(value).toFixed(2)}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>

        </MainCard>
      )}
      {/* footer */}
      {showPropertyButtons && (
        <Grid container spacing={1} marginTop={5} display="flex" justifyContent="center" alignItems="center">
          <Grid item xs={12} sm="auto">
            <Button variant="contained" color="success" sx={{ padding: '4px' }} onClick={() => {
              setProp(propertyList[0])
              setNewDetails(pre => ({ ...pre, propertyNo: propertyList[0] }))
            }}>
              First
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button variant="contained" color="warning" sx={{ padding: '4px' }} onClick={() => {
              const currentIndex = propertyList?.indexOf(newDetails.propertyNo) ?? -1;
              const previousProperty = propertyList?.[currentIndex - 1] ?? propertyList?.[0];
              if (previousProperty) {
                setProp(previousProperty)
                setNewDetails((pre) => ({ ...pre, propertyNo: previousProperty }));
              }
            }}>
              &lt;&lt; Previous
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <TextField
              type="number"
              value={newDetails.propertyNo}
              onChange={(e) =>
                setNewDetails((prev) => ({
                  ...prev,
                  propertyNo: e.target.value,
                }))
              }
              sx={{
                width: '70px',
                '& .MuiInputBase-input': { padding: '7px 0' },
              }}
              inputProps={{
                min: propertyList?.[0] ?? 0,
                max: propertyList?.[propertyList.length - 1] ?? 9999,
                step: 1
              }}
            />

          </Grid>

          <Grid item xs={12} sm="auto">
            <Button variant="outlined" color="secondary" sx={{ padding: '4px' }}>
              {propertyList[propertyList.length - 1] || 0}
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button variant="contained" color="warning" sx={{ padding: '4px' }} onClick={() => {
              const currentIndex = propertyList?.indexOf(newDetails.propertyNo) ?? -1;
              const nextProperty = propertyList?.[currentIndex + 1] ?? propertyList?.[0];
              if (nextProperty) {
                setProp(nextProperty)
                setNewDetails((pre) => ({ ...pre, propertyNo: nextProperty }));
              }
            }}>
              Next &gt;&gt;
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              variant="contained"
              color="success"
              sx={{ padding: '4px' }}
              onClick={() => {
                const lastProperty = propertyList[propertyList.length - 1];

                setProp(lastProperty);
                setNewDetails(prev => ({
                  ...prev,
                  propertyNo: lastProperty,
                }));
              }}
            >
              Last
            </Button>

          </Grid>
          <Grid item xs={12} sm="auto">
            <Button variant="contained" color="success" sx={{ padding: '4px' }} onClick={handleEditButtonForDataEnterClick}>
              Edit Details
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
          </Grid>

          <Grid item xs={12} sm="auto">
            <Stack direction="row" spacing={1} alignItems="center">
              <InputLabel>Report</InputLabel>
              <Select variant="outlined" sx={{ minWidth: '80px', '& .MuiInputBase-input': { padding: '7px 0' } }}>
                <MenuItem value={1}>119 Notice</MenuItem>
                <MenuItem value={2}>Kar Akarani</MenuItem>
                <MenuItem value={3}>Kar Akarani with Non Tax Type</MenuItem>
                <MenuItem value={4}>Assessment Nakkal</MenuItem>
                <MenuItem value={5}>Bill</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Stack direction="row" spacing={1} alignItems="center">
              <InputLabel>Policy</InputLabel>
              <Select sx={{ minWidth: '80px', '& .MuiInputBase-input': { padding: '7px 0' } }} value={applicalePolicy} onChange={handleApplicablePolicyChange}>
                <MenuItem value={"As Per Old"}>As Per Old</MenuItem>
                <MenuItem value={"Minimum RV"}>Minimum RV</MenuItem>
                <MenuItem value={"Mix Assessment"}>Mix Assessment</MenuItem>
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl sx={{ minWidth: '120px' }}>
                <InputLabel id="action-label">Action</InputLabel>
                <Select
                  labelId="action-label"
                  value={action}
                  onChange={handleActionChange}
                  sx={{ minWidth: '80px', '& .MuiInputBase-input': { padding: '7px 0' } }}
                >
                  <MenuItem value={1}>Apply</MenuItem>
                  <MenuItem value={2}>Remove Retention</MenuItem>
                  <MenuItem value={6}>Remove Hearing</MenuItem>
                  <MenuItem value={3}>Remove Appeal Committee</MenuItem>
                  <MenuItem value={4}>Remove Remission</MenuItem>
                  <MenuItem value={5}>Remove All Appeals</MenuItem>

                </Select>
              </FormControl>
            </Stack>
          </Grid>

          <Grid item xs={12} sm="auto">
            <Stack direction="row" spacing={1} alignItems="center">
              <Checkbox color="primary" checked={isChecked} onChange={handleCheckboxChange} />
              <Button variant="contained" color="error" sx={{ padding: '5.7px' }} onClick={handleButtonClick}>
                Save Last Row
              </Button>
            </Stack>
          </Grid>

          {/* Validation dialog if checkbox is not checked */}
          <Dialog open={openValidationDialog} onClose={handleCloseValidationDialog}>
            <DialogTitle>Validation Error</DialogTitle>
            <DialogContent>Please select the checkbox before saving.</DialogContent>
            <DialogActions>
              <Button onClick={handleCloseValidationDialog} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Confirmation dialog for saving */}
          {/* Confirmation dialog for saving */}
          <Dialog open={openConfirmationDialog} onClose={() => handleCloseConfirmationDialog(false)}>
            <DialogTitle>Total Valuation</DialogTitle>
            <DialogContent>
              <div>Please Select Year</div>
              <Stack spacing={1} marginTop={2}>
                <InputLabel>Select Year</InputLabel>
                <Select value={selectedYear} onChange={handleYearChange} fullWidth>
                  {financeYearList.map((year) => (
                    <MenuItem key={year.FinanceYear} value={year.FinanceYear}>
                      {year.FinanceYear}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleCloseConfirmationDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleCloseConfirmationDialog(true)} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success dialog after saving */}
          <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
            <DialogTitle>Success</DialogTitle>
            <DialogContent>Successfully saved the last row for the year {selectedYear}.</DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSuccessDialog} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Grid >
      )
      }
      {/* Social Details */}

      <Dialog open={openSocialDetails} onClose={handleSocialDetails} maxWidth="xl">
        <Grid container>
          <Grid item xs={12} md={6} lg={6}>
            <DialogTitle>Social Details</DialogTitle>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DialogActions style={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={handleSocialDetails} color="error">
                <CloseOutlined />
              </IconButton>
            </DialogActions>
          </Grid>
        </Grid>
        <DialogContent>
          <MainCard sx={{ background: '#e3f2fd' }}>
            <Grid container spacing={0} mt={1}>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', minWidth: '90px' }}>Road Width </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>R.Toliet </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>C.Toliet </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '120px' }}>No.Connection: </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={0} mt={1}>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', minWidth: '90px' }}>No.of Trees </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 0.2, minWidth: '98px' }}>No. of Borwell </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>No. of Well </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '120px' }}>No.of HandPump </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={0} mt={1}>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', minWidth: '90px' }}>No.of Solar </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>No.of Lift </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>Size" </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 0.4, minWidth: '190px' }}>No. of RainWater Harvesting </InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={0} mt={1}>
              {/* Title Heading */}
              <Grid item xs={12} mb={2}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: 'blue'
                  }}
                >
                  चतुर्थसीमा:
                </Typography>
              </Grid>

              {/* Fields Start Here */}
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', minWidth: '90px' }}>पूर्व</InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>पश्चिम</InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>उत्तर</InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>दक्षिण</InputLabel>
                  <TextField required fullWidth />
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </DialogContent>
      </Dialog>

      {/* Old Information */}

      <Dialog open={openOldInformation} onClose={handleOldInformation} maxWidth="xl">
        <Grid container>
          <Grid item xs={12} md={6} lg={6}>
            <DialogTitle>Old Information</DialogTitle>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DialogActions style={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={handleOldInformation} color="error">
                <CloseOutlined />
              </IconButton>
            </DialogActions>
          </Grid>
        </Grid>
        <DialogContent>
          <MainCard sx={{ background: '#e3f2fd' }}>
            <Grid container spacing={0} justifyContent="center" mb={1}>
              <Grid item xs={12} sm={3}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', minWidth: '90px' }}>Owner ID</InputLabel>
                  <TextField required fullWidth value={ownerId} />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0} direction="row" alignItems="center">
                  <InputLabel sx={{ fontWeight: 'bolder', ml: 5, minWidth: '100px' }}>Owner Name</InputLabel>
                  <TextField required fullWidth value={ownerRenterDetails?.ownerName} />
                </Stack>
              </Grid>
            </Grid>
            <MainCard title=" Old Taxation Details:">
              <Grid container spacing={0} mt={1} mb={1} justifyContent="center">
                <Grid item xs={12} sm={3}>
                  <Stack spacing={0} direction="row" alignItems="center">
                    <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>RV </InputLabel>
                    <TextField required fullWidth value={oldPropertyMast?.OldRV} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={0} direction="row" alignItems="center">
                    <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>Old Alv </InputLabel>
                    <TextField required fullWidth value={oldPropertyMast?.OldALV} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={0} direction="row" alignItems="center">
                    <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>Prop.Tax </InputLabel>
                    <TextField required fullWidth value={oldPropertyMast?.OldPropertyTax} />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Stack spacing={0} direction="row" alignItems="center">
                    <InputLabel sx={{ fontWeight: 'bolder', ml: 0.7, minWidth: '109px' }}>Plot Area Sq.Ft </InputLabel>
                    <TextField required fullWidth value={oldPropertyMast?.OldPlotArea} />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={0} mt={1} mb={2} justifyContent="center">
                <Grid item xs={12} sm={3}>
                  <Stack spacing={0} direction="row" alignItems="center">
                    <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>Tot.Tax </InputLabel>
                    <TextField required fullWidth value={oldPropertyMast?.OldTotalTax} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={0} direction="row" alignItems="center">
                    <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>Rooms </InputLabel>
                    <TextField required fullWidth value={oldPropertyMast?.OldTotalRooms} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={0} direction="row" alignItems="center">
                    <InputLabel sx={{ fontWeight: 'bolder', ml: 1, minWidth: '90px' }}>Toilet No.</InputLabel>
                    <TextField required fullWidth value={oldPropertyMast?.OldToiletNo} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={0} direction="row" alignItems="center">
                    <InputLabel sx={{ fontWeight: 'bolder', minWidth: '117px' }}>Const.Area Sq.Ft </InputLabel>
                    <TextField required fullWidth value={oldPropertyMast?.ConstAreaSqFt} />
                  </Stack>
                </Grid>
              </Grid>

              {/* table */}
              <Grid item xs={12} mb={1} mt={1}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: 'blue'
                  }}
                >
                  Old Property Deatils
                </Typography>
              </Grid>
              <TableContainer sx={{ marginTop: 1, height: 150 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Floor</TableCell>
                      <TableCell>Const.Year</TableCell>
                      <TableCell>Const.Type</TableCell>
                      <TableCell>Type Of Use</TableCell>
                      <TableCell>Carepet Area(ft)</TableCell>
                      <TableCell>Carepet Area(mtr)</TableCell>
                      {/* <TableCell>Registration</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {oldFloorData && oldFloorData.length > 0 ? (
                      oldFloorData.map((floor, index) => (
                        <TableRow key={index}>
                          <TableCell>{floor.FloorID}</TableCell>
                          <TableCell>{floor.ConstructionYear}</TableCell>
                          <TableCell>{floor.ConstructionType}</TableCell>
                          <TableCell>{floor.TypeOFUse}</TableCell>
                          <TableCell>{floor.CarpetAreaSqFeet}</TableCell>
                          <TableCell>{floor.CarpetAreaSqMeter}</TableCell>
                          {/* <TableCell>{floor.registration}</TableCell> */}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* 2nd Table */}
              <Grid item xs={12} mb={1} mt={1}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: 'blue'
                  }}
                >
                  Old Property Deatils
                </Typography>
              </Grid>
              <TableContainer sx={{ marginTop: 1, height: 239 }}>
                <Table>
                  <TableHead>
                    <TableRow>

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
                    {oldPendingTaxes?.map((item, index) => {
                      return (
                        <TableRow key={index}>

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
            </MainCard>
          </MainCard>
        </DialogContent>
      </Dialog>

      {/* Apply Tax */}

      <Dialog open={openApplyTax} onClose={handleApplyTax} maxWidth="xl">
        <Grid container>
          <Grid item xs={12} md={6} lg={6}>
            <DialogTitle>Apply Taxes</DialogTitle>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DialogActions style={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={handleOldInformation} color="error">
                <CloseOutlined />
              </IconButton>
            </DialogActions>
          </Grid>
        </Grid>
        <DialogContent>
          <MainCard sx={{ background: '#e3f2fd' }}>
            <MainCard title="Apply Taxes">
              <Grid container spacing={0.2} mt={1} justifyContent="center">
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Property</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, PropertyTax: e.target.value }))} value={applyTaxes?.PropertyTax ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Education</InputLabel>
                    <TextField required fullWidthonChange={(e) => setApplyTaxes((p) => ({ ...p, EducationTax: e.target.value }))} value={applyTaxes?.EducationTax ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tree</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, TreeCess: e.target.value }))} value={applyTaxes?.TreeCess ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Employment</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, EmploymentTax: e.target.value }))} value={applyTaxes?.EmploymentTax ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sp.Edu</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, SpEducationTax: e.target.value }))} value={applyTaxes?.SpEducationTax ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Fire</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, FireCess: e.target.value }))} value={applyTaxes?.FireCess ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Road</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, RoadCess: e.target.value }))} value={applyTaxes?.RoadCess ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Light</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, LightCess: e.target.value }))} value={applyTaxes?.LightCess ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sewage</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, SewageDisposalCess: e.target.value }))} value={applyTaxes?.SewageDisposalCess ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Saniation</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, Sanitation: e.target.value }))} value={applyTaxes?.Sanitation ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Drain</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, DrainCess: e.target.value }))} value={applyTaxes?.DrainCess ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sp.W.Cess</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, SpWaterCess: e.target.value }))} value={applyTaxes?.SpWaterCess ? '1' : 0} />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={0.2} mt={1} justifyContent="center">
                {/* <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Cess</InputLabel>
                    <TextField required fullWidth value={applyTaxes?.WaterBenefit}/>
                  </Stack>
                </Grid> */}
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Benfits</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, WaterBenefit: e.target.value }))} value={applyTaxes?.WaterBenefit ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>M.Build</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, MajorBuilding: e.target.value }))} value={applyTaxes?.MajorBuilding ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Bill</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, WaterBill: e.target.value }))} value={applyTaxes?.WaterBill ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax1</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, Tax1: e.target.value }))} value={applyTaxes?.Tax1 ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax2</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, Tax2: e.target.value }))} value={applyTaxes?.Tax2 ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax3</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, Tax3: e.target.value }))} value={applyTaxes?.Tax3 ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax4</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, Tax4: e.target.value }))} value={applyTaxes?.Tax4 ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax5</InputLabel>
                    <TextField required onChange={(e) => setApplyTaxes((p) => ({ ...p, Tax5: e.target.value }))} fullWidth value={applyTaxes?.Tax5 ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Is Tax For Plot</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, IsTaxForPlot: e.target.value }))} value={applyTaxes?.IsTaxForPlot ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1.3}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Is Policy Applicable</InputLabel>
                    <TextField required fullWidth onChange={(e) => setApplyTaxes((p) => ({ ...p, IsPolicyApplicable: e.target.value }))} value={applyTaxes?.IsPolicyApplicable ? '1' : 0} />
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack spacing={1} mt={3.8}>
                    <Button variant="contained" color="success" sx={{ padding: '7px' }} onClick={handleChangeApplyTaxes}>
                      Ok
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
            <MainCard title="Taxes Percentage">
              <Grid container spacing={0.2} justifyContent="center">
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Property</InputLabel>
                    <TextField required fullWidth value={taxMaster?.PropertyTax} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Education</InputLabel>
                    <TextField required fullWidth value={eduAndEmp.EducationTax} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tree</InputLabel>
                    <TextField required fullWidth value={taxMaster?.TreeCess} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Employment</InputLabel>
                    <TextField required fullWidth value={eduAndEmp?.EmploymentTax} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sp.Edu</InputLabel>
                    <TextField required fullWidth value={eduAndEmp?.SpEducationTax} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Fire</InputLabel>
                    <TextField required fullWidth value={taxMaster?.FireCess} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Road</InputLabel>
                    <TextField required fullWidth value={taxMaster?.RoadCess} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Light</InputLabel>
                    <TextField required fullWidth value={taxMaster?.LightCess} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Sewage</InputLabel>
                    <TextField required fullWidth value={taxMaster?.SewageDispCess} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Saniation</InputLabel>
                    <TextField required fullWidth value={taxMaster?.SanitationCess} />
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={0.2} mt={1} justifyContent="center">
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Drain</InputLabel>
                    <TextField required fullWidth value={taxMaster?.DrainCess} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Cess</InputLabel>
                    <TextField required fullWidth value={taxMaster?.SpWaterCess} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Benfits</InputLabel>
                    <TextField required fullWidth value={taxMaster?.WaterBenefit} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>M.Build</InputLabel>
                    <TextField required fullWidth value={taxMaster?.MajorBuilding} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>W.Bill</InputLabel>
                    <TextField required fullWidth value={taxMaster?.WaterBill} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax1</InputLabel>
                    <TextField required fullWidth value={taxMaster?.Tax1} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax2</InputLabel>
                    <TextField required fullWidth value={taxMaster?.Tax2} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax3</InputLabel>
                    <TextField required fullWidth value={taxMaster?.Tax3} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax4</InputLabel>
                    <TextField required fullWidth value={taxMaster?.Tax4} />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Tax5</InputLabel>
                    <TextField required fullWidth value={taxMaster?.Tax5} />
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </MainCard>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TotalValuation;
