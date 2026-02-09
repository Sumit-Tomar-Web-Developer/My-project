// material-ui
import {
  Grid,
  Box,
  InputLabel,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Table,
  Chip,
  Button,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  SnackbarContent
} from '@mui/material';
import Footer from 'components/footer/footer.jsx';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

// project import
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// eslint-disable-next-line no-restricted-imports
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fetchWardList } from 'services/data-entry.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { getBillBookList } from 'services/Amc/bill-book-entry-services/transYearMasterService';
import { fetchOwnerDetails } from 'services/appeal.services';
import { getCurrentTaxes, saveAdvancePayment } from 'services/Amc/advancePayment/advancePayment';
import dayjs from 'dayjs';
import { getFinanceYear } from 'services/utlilityService/AddTaxService/AddTaxService';





// ==============================|| AdvancePayment PAGE ||============================== //

function AdvancePayment() {
  const [wardList, setWardList] = useState([]);
  const [wardNo, setWardNo] = useState('');
  const [propertyList, setPropertyList] = useState([]);
  const [property, setProperty] = useState('');
  const [partitionList, setPartitionList] = useState([]);
  const [partition, setPartition] = useState('');
  const [financeyearList, setFinanceYearList] = useState([]);
  const [year, setFinanceYear] = useState('');
  const [billBookNoList, setBillBookNoList] = useState([]);
  const [billBookNo, setBillBookNo] = useState('');
  const [invoiceNoList, setInvoiceNoList] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [empName, setEmpName] = useState('');
  const [value, setValue] = useState(dayjs());
  const [ownerName, setOwnerName] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [empID, setEmpID] = useState('');
  const [displayGrid, setDisplayGrid] = useState(false)
  const [currentTaxes, setCurrentTaxes] = useState({
    Property: 0,
    Education: 0,
    'Sp.Educ': 0,
    Emp: 0,
    Tree: 0,
    Fire: 0,
    Light: 0,
    //Drain: 0,
    Road: 0,
    Sanitation: 0,
    'W.Cess': 0,
    'W.Benifit': 0,
    'W.Bill': 0,
    // 'M.Build': 0,
    Sewage: 0,
    Tax1: 0,
    Interest: 0,
    'Total Tax': 0,

  });
  const [formValues, setFormValues] = useState({
    Property: 0,
    Education: 0,
    'Sp.Educ': 0,
    Emp: 0,
    Tree: 0,
    Fire: 0,
    Light: 0,
    Drain: 0,
    Road: 0,
    Sanitation: 0,
    'W.Cess': 0,
    'W.Benifit': 0,
    'W.Bill': 0,
    'M.Build': 0,
    Sewage: 0,
    Tax1: 0,
    Interest: 0,
    'Extra Charges': 0,
    'Notice Fee': 0,
    Discount: 0,
    'Total Tax': 0,
    Total: 0
  });

  const [allBillBookData, setAllBillBookData] = useState({})
  const [paymentMode, setPaymentMode] = useState('');
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState(dayjs());
  const [remark, setRemark] = useState('');
  const [checkFormData, setFormData] = useState({
    chequeNo: '',
    name: '',
    bankName: '',
    branchName: '',
    ifsc: '',
    amount: '',
    date: null,
    expiryDate: null
  });
  const
    isFormValid = () => {
      const {
        chequeNo,
        name,
        bankName,
        branchName,
        ifsc,
        amount,
        date,
        expiryDate,
      } = checkFormData;

      return (
        chequeNo.trim() !== '' &&
        name.trim() !== '' &&
        bankName.trim() !== '' &&
        branchName.trim() !== '' &&
        ifsc.trim() !== '' &&
        amount !== '' &&
        date !== null &&
        expiryDate !== null &&
        billNo !== '' &&
        billBookNo !== '' &&
        invoiceNo !== ''


      );
    };

  const [combinedData, setCombinedData] = useState({

    ...formValues,
    ...checkFormData,
    wardNo: wardNo,
    propertyNo: property,
    ownerId: ownerId,
    BillBookNo: billBookNo,
    year: year,
    paymentMode: paymentMode,
    billNo: billNo,
    remark: remark,
    billDate: billDate,
    invoiceNo: invoiceNo,
    empID: empID,
    pendingYear: year - 1

  })

  const [currentDemand, setCurrentDemand] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [receivedMessage, setReceivedMessage] = useState('');

  const isDisabled = paymentMode === 1 || paymentMode === 4 || paymentMode === '';
  useEffect(() => {
    setDisplayGrid(false)

    setCurrentTaxes({
      Property: 0,
      Education: 0,
      'Sp.Educ': 0,
      Emp: 0,
      Tree: 0,
      Fire: 0,
      Light: 0,
      //Drain: 0,
      Road: 0,
      Sanitation: 0,
      'W.Cess': 0,
      'W.Benifit': 0,
      'W.Bill': 0,
      // 'M.Build': 0,
      Sewage: 0,
      Tax1: 0,
      Interest: 0,
      'Total Tax': 0,
    });
    setFormValues({
      Property: 0,
      Education: 0,
      'Sp.Educ': 0,
      Emp: 0,
      Tree: 0,
      Fire: 0,
      Light: 0,
      Drain: 0,
      Road: 0,
      Sanitation: 0,
      'W.Cess': 0,
      'W.Benifit': 0,
      'W.Bill': 0,
      'M.Build': 0,
      Sewage: 0,
      Tax1: 0,
      Interest: 0,
      'Extra Charges': 0,
      'Notice Fee': 0,
      Discount: 0,
      'Total Tax': 0,
      Total: 0
    });
    setFormData({
      chequeNo: '',
      name: '',
      bankName: '',
      branchName: '',
      ifsc: '',
      amount: '',
      date: null,
      expiryDate: null
    });
    setPaymentMode('');
    setBillNo('');
    setBillDate(dayjs());
    setRemark('');
    setCurrentDemand(false);



  }, [property])

  useEffect(() => {
    const fetchWardNoList = async () => {
      try {
        const wardList = await fetchWardList();
        console.log('wardList', wardList);
        const wards = Array.from(
          new Set(
            wardList?.map(x => x?.NewWardNo).filter(v => v != null)?.map(v => String(v).trim())?.filter(v => v.length > 0)
          )
        );

        // Natural, locale-aware sort (handles "2" < "10", "A2" < "A10", Marathi, etc.)
        const collator = new Intl.Collator('mr-IN', { numeric: true, sensitivity: 'base' });
        const wardNumbers = wards.sort(collator.compare);
        setWardList(wardNumbers);
      } catch (error) {
        console.error('Error in fetching ward list:', error);
      }
    };
    fetchWardNoList();
  }, []);

  const handleWardChange = async (e) => {
    setWardNo(e.target.value);
  };
  const [allProperties, setAllProperties] = useState([])
  useEffect(() => {

  }, [allProperties])
  useEffect(() => {
    console.log(wardNo);
    if (wardNo != '') {
      const propertyRange = async () => {
        try {
          const propertyRange = await fetchPropertyRangeByWard(wardNo);
          console.log('propertyRange:', propertyRange.properties);
          setAllProperties(propertyRange?.properties)
          const sorted = Array.from(new Set(propertyRange?.properties?.map((item) => Number(item?.NewPropertyNo)).sort((a, b) => a - b)));
          console.log(sorted, 'sorted')
          if (propertyRange?.properties.length > 0) {
            setPropertyList(sorted);
          }

        } catch (error) {
          console.error('Failed to fetch propertyRange:', error);
        }
      };

      propertyRange();
    }
  }, [wardNo]);




  const handlePropertyChange = async (ev) => {
    const propertyNo = ev.target.value;
    setProperty(propertyNo);
    console.log('Selected PropertyNo:', propertyNo);

    console.log(allProperties, 'allProperties')
    const filteredPartitions = allProperties?.filter((property) => property.NewPropertyNo == propertyNo && property.NewWardNo == wardNo)?.map((partition) => partition.NewPartitionNo);

    console.log('Filtered Partitions:', filteredPartitions);

    // Update state
    setPartitionList(filteredPartitions);
  };
  const handlePartitionChange = (ev) => {
    const partitionNo = ev.target.value;
    console.log(partitionNo);
    setPartition(partitionNo);
    console.log('partitionNo', partition);
  };

  const handleFinanceYearChange = (ev) => {
    setFinanceYear(ev.target.value);
  };
  useEffect(() => {
    const financeYear = async () => {
      const result = await getFinanceYear()

      console.log(result, 'financeYearList')
      setFinanceYearList(result)
    }
    financeYear()
  }, [])

useEffect(() => {
  if (!year || !Array.isArray(allBillBookData)) return;

  const filteredBillBooks = allBillBookData
    .filter(entry => entry?.Year === year)
    .map(entry => entry?.BillBookNo);

  if (filteredBillBooks.length > 0) {
    setBillBookNoList([...new Set(filteredBillBooks)]);
  }
}, [year, allBillBookData]);


  useEffect(() => {
    if (!billBookNo || !year || allBillBookData.length === 0) return;

    const filteredEntries = allBillBookData?.filter(
      entry => entry.Year === year && entry.BillBookNo === billBookNo
    );

    if (filteredEntries.length > 0) {
      const { ReceiptNoFrom, ReceiptNoTo, EmpName, UserID } = filteredEntries[0];
      const numberRange = Array.from({ length: ReceiptNoTo - ReceiptNoFrom + 1 }, (_, i) => ReceiptNoFrom + i);
      setInvoiceNoList(numberRange);
      setEmpName(EmpName);
      setEmpID(UserID)
    } else {
      setInvoiceNoList([]);
      setEmpName("");
      setEmpID('')
    }
  }, [billBookNo, year, allBillBookData]);

  const handleBillBookNo = (e) => {
    setBillBookNo(e.target.value);
  };
  const handleInvoiceNo = (e) => {
    console.log(e.target.value)
    setInvoiceNo(e.target.value);
  };
  useEffect(() => {
    return setOwnerName(''), setProperty(''), setPartition(''), setOwnerId(''), setPropertyList([]), setPartitionList([]);
  }, [wardNo]);
  useEffect(() => {
    const getOwnerName = async () => {
      try {
        const owner = await fetchOwnerDetails(wardNo, property);
        const byPartition = owner?.filter(o => o.NewPartitionNo == partition) ?? [];

        // If none, fall back to "no-partition" records when pn is empty
        const fallback =
          !partition
            ? owner?.filter(o => !o.NewPartitionNo) ?? []
            : [];

        // Final pick
        const target = (byPartition.length ? byPartition : fallback)[0] ?? {};

        const name = target.OwnerName ?? "";
        const Id = target.OwnerID ?? "";
        setOwnerName(name);
        setOwnerId((prevId) => {
          console.log('Previous OwnerID:', prevId);
          return Id; // New OwnerID
        });
      } catch (error) {
        console.error('Error fetching owner details:', error);
      }
    };

    getOwnerName();
    return () => {
      setOwnerName(null); // Reset state on unmount if needed
      setOwnerId(null); // Reset state on unmount if needed
    };
  }, [property, partition]);

  useEffect(() => {
    if (year != '') {
      const getCurrentTaxesData = async () => {
        try {
          if (ownerId) {

            const taxes = await getCurrentTaxes(ownerId, year);
            console.log('Current Taxes:', taxes);
            setCurrentTaxes({
              Property: taxes[0]?.PropertyTax || 0,
              Education: taxes[0]?.EducationTax || 0,
              'Sp.Educ': taxes[0]?.SpEducationTax || 0,
              Emp: taxes[0]?.EmploymentTax || 0,
              Tree: taxes[0]?.TreeCess || 0,
              Fire: taxes[0]?.FireCess || 0,
              Light: taxes[0]?.LightCess || 0,
              // Drain: taxes[0]?.DrainCess || 0,
              Road: taxes[0]?.RoadCess || 0,
              Sanitation: taxes[0]?.Sanitation || 0,
              'W.Cess': taxes[0]?.SpWaterCess || 0,
              'W.Benifit': taxes[0]?.WaterBenefit || 0,
              'W.Bill': taxes[0]?.WaterBill || 0,
              // 'M.Build': taxes[0]?.MajorBuilding || 0,
              Sewage: taxes[0]?.SewageDisposalCess || 0,
              Tax1: taxes[0]?.Tax1 || 0,
              Interest: taxes[0]?.Interest || 0,
              //'Extra Charges': taxes[0].,
              //'Notice Fee': taxes[0].,
              // Discount: taxes[0].,
              'Total Tax': taxes[0]?.TaxTotal || 0


            });
            console.log(taxes.length, 'taxes length');
            if (taxes.length === 2) {
              if (taxes[1]?.[0].NetTotal === 0) {
                setCurrentDemand(true)
              }
            } else {

              if (taxes[0]?.[0].NetTotal === 0) {
                setCurrentDemand(true)
              }
            }
          }
        } catch (error) {
          console.error('Error fetching current taxes data:', error);
        }
      };
      getCurrentTaxesData();
    }
    else {
      if (ownerId) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please Select The Finance Year')
      }
    }
  }, [ownerId, year]);
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);

  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Advance Payment';
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
      console.log(access, 'assigned access to Advance Payment Page');
      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true); // Show dialog for No Access or View Only
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
    console.log(currentTaxes, 'CurrentTaxes')
  }, [currentTaxes]);

  const handleInputChange = (e, key) => {
    const value = e.target.value;

    setFormValues((prev) => {
      // Prevent direct editing of 'Total Tax'
      if (key === 'Total Tax' || key === 'Total') {
        return prev;
      }

      // If value hasn't changed, return previous state
      if (prev[key] === value) {
        return prev;
      }

      // Update the changed field
      const updated = {
        ...prev,
        [key]: value,
      };

      // Recalculate Total Tax only if contributing values changed
      const taxFields = [
        'Property',
        'Education',
        'Sp.Educ',
        'Drain',
        'Emp',
        'Tree',
        'Fire',
        'Light',
        'Road',
        'Sanitation',
        'W.Cess',
        'W.Benifit',
        'W.Bill',
        'Sewage',
        'Tax1',
      ];

      // Calculate total tax sum
      const totalTax = taxFields.reduce((sum, field) => {
        const fieldVal = parseFloat(updated[field]) || 0;
        return sum + fieldVal;
      }, 0);

      // Only update if Total Tax actually changes
      if (parseFloat(prev['Total Tax']) !== parseFloat(totalTax.toFixed(2))) {
        updated['Total Tax'] = totalTax.toFixed(2);
      }
      const extraCharges = parseFloat(updated['Extra Charges']) || 0;
      const interest = parseFloat(updated['Interest']) || 0;
      const noticeFee = parseFloat(updated['Notice Fee']) || 0;
      const discount = parseFloat(updated['Discount'] || 0);

      // Calculate Total
      const total = totalTax + extraCharges + interest + noticeFee - discount;
      updated['Total'] = total.toFixed(2);

      return updated;
    });
  };

  const handleCheckData = (e) => {
    const { name, value } = e.target;

    // Fields that should only allow alphabets
    const alphabetOnlyFields = ['name', 'branchName', 'bankName'];

    if (alphabetOnlyFields.includes(name)) {
      // Allow only letters and spaces
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return; // Don't update state if invalid
      }
    }
    console.log(name, 'name')

    if (name === 'chequeNo' && !/^\d{0,6}$/.test(value)) return;

    setFormData({ ...checkFormData, [name]: value });



  };

  useEffect(() => {
    console.log(paymentMode, 'paymentMode')

  }, [checkFormData.date, checkFormData.expiryDate, empID, paymentMode])

  useEffect(() => {
    console.log(combinedData)
  }, [combinedData.date])

  const handleAddToGrid = () => {
    console.log()
    if (!property || !year) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please fill the required fields');
      return;
    }

    if (!paymentMode) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please select payment mode');
      return;
    }
    console.log(checkFormData, 'checkFormData')
    console.log(isFormValid())
    if ((paymentMode === 2 || paymentMode === 3) && !isFormValid()) {
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setReceivedMessage('Please fill the Cheque/DD required fields');
      return;
    }
    if (paymentMode === 1 || paymentMode === 4) {
      setFormData(pre => ({
        ...pre,
        date: null,
        expiryDate: null

      }))
    }

    setCombinedData({
      ...formValues,
      ...checkFormData,
      wardNo: wardNo,
      propertyNo: property,
      ownerId: ownerId,
      BillBookNo: billBookNo,
      year: year,
      paymentMode: paymentMode,
      billNo: billNo,
      remark: remark,
      billDate: billDate,
      value: value,
      invoiceNo: invoiceNo,
      empID: empID,
      pendingYear: year - 1


    }
    )

    // setGridData((prev) => [...prev, newRow]);
    setDisplayGrid(true);
    console.log(combinedData, 'combinedData');

  };

  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  // getRootProps
  const { getInputProps } = useDropzone({ onDrop });

  const handleSaveAdvancePayment = async () => {
    console.log('payment Data before saving:', paymentMode);

    try {
      console.log(paymentMode, 'paymentMode')
      if (!property && !year) {
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
        setReceivedMessage('Please fill the required fields');
        return
      }
      else {
        console.log((paymentMode === 2 || paymentMode === 3) && !isFormValid())
        if (paymentMode == '') {
          setSnackbarOpen(true);
          setSnackbarSeverity('Error');
          setReceivedMessage('Please select payment mode');

          console.log(isFormValid, 'isFormValid')
        }
        else if ((paymentMode === 2 || paymentMode === 3) && isFormValid) {

          const response = await saveAdvancePayment(combinedData);
          console.log('Response from saveAdvancePayment:', response);
          if (response.status === 200) {
            setSnackbarOpen(true);
            setSnackbarSeverity('success');
            setReceivedMessage('Advance payment saved successfully!');

            setFormValues(() => ({
              Property: 0,
              Education: 0,
              'Sp.Educ': 0,
              Emp: 0,
              Tree: 0,
              Fire: 0,
              Light: 0,
              Drain: 0,
              Road: 0,
              Sanitation: 0,
              'W.Cess': 0,
              'W.Benifit': 0,
              'W.Bill': 0,
              'M.Build': 0,
              Sewage: 0,
              Tax1: 0,
              Interest: 0,
              'Extra Charges': 0,
              'Notice Fee': 0,
              Discount: 0,
              'Total Tax': 0,
              Total: 0
            }));
            setFormData(() => ({
              chequeNo: '',
              name: '',
              bankName: '',
              branchName: '',
              ifsc: '',
              amount: '',
              date: dayjs(),
              expiryDate: dayjs()
            }));
            setCombinedData({

              ...formValues,
              ...checkFormData,
              wardNo: wardNo,
              propertyNo: property,
              ownerId: ownerId,
              BillBookNo: billBookNo,
              year: year,
              paymentMode: paymentMode,
              billNo: billNo,
              remark: remark,
              billDate: billDate,
              invoiceNo: invoiceNo,
              empID: empID,
              pendingYear: year - 1

            });
            setFinanceYear('');
            setEmpID('');
            setEmpName('');
            setBillBookNo('');
            setBillBookNoList([])
            setOwnerId('');
            setOwnerName('');
            setWardNo('');
            setProperty('');
            setPartition('');
            setPartitionList([])
            setInvoiceNoList([]);
            setInvoiceNo('');
          }
        } else if (paymentMode === 1 || paymentMode === 4) {
          const response = await saveAdvancePayment(combinedData);
          console.log('Response from saveAdvancePayment:', response);
          if (response.status === 200) {
            setSnackbarOpen(true);
            setSnackbarSeverity('success');
            setReceivedMessage('Advance payment saved successfully!');

            setFormValues(() => ({
              Property: 0,
              Education: 0,
              'Sp.Educ': 0,
              Emp: 0,
              Tree: 0,
              Fire: 0,
              Light: 0,
              Drain: 0,
              Road: 0,
              Sanitation: 0,
              'W.Cess': 0,
              'W.Benifit': 0,
              'W.Bill': 0,
              'M.Build': 0,
              Sewage: 0,
              Tax1: 0,
              Interest: 0,
              'Extra Charges': 0,
              'Notice Fee': 0,
              Discount: 0,
              'Total Tax': 0,
              Total: 0
            }));
            setFormData(() => ({
              chequeNo: '',
              name: '',
              bankName: '',
              branchName: '',
              ifsc: '',
              amount: '',
              date: dayjs(),
              expiryDate: dayjs()
            }));
            setCombinedData({

              ...formValues,
              ...checkFormData,
              wardNo: wardNo,
              propertyNo: property,
              ownerId: ownerId,
              BillBookNo: billBookNo,
              year: year,
              paymentMode: paymentMode,
              billNo: billNo,
              remark: remark,
              billDate: billDate,
              invoiceNo: invoiceNo,
              empID: empID,
              pendingYear: year - 1

            });
            setFinanceYear('');
            setEmpID('');
            setEmpName('');
            setBillBookNo('');
            setBillBookNoList([])
            setOwnerId('');
            setOwnerName('');
            setWardNo('');
            setProperty('');
            setPartition('');
            setPartitionList([])
            setInvoiceNoList([]);
            setInvoiceNo('');
          }
        }
        else {
          setSnackbarOpen(true);
          setSnackbarSeverity('error');
          setReceivedMessage('Please fill the Cheque/DD required fields');
        }

      }
    } catch (error) {
      console.error('Error in saving advance payment:', error);
    }

  }
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }
  const handlePageChange = (property) => {
    setProperty(property);
  }
  const deletePropertybyOwnerId = async () => {
  }
  useEffect(() => {
    if (property) {
      console.log(property, 'property')
      setProperty(property);
    }
  }, [year])

  const isEditable = (property !== '' && currentDemand !== false);
  useEffect(() => {
    console.log(isEditable, 'isEditable')
  }, [isEditable])
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
        <MainCard title="Advance Payment">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3.5}>
                    <Stack spacing={1}>
                      <InputLabel>Select Ward</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          id="ward-select"
                          value={wardNo}
                          placeholder="ward no"
                          onChange={handleWardChange}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          {wardList?.map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Property No</InputLabel>
                      <Select
                        id="property-select"
                        value={property}
                        onChange={handlePropertyChange}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: 'auto'
                            }
                          }
                        }}
                      >
                        {propertyList?.map((propertyNo, index) => (
                          <MenuItem key={index} value={propertyNo}>
                            {propertyNo}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Partition No:</InputLabel>
                      <Select
                        id="partition-select"
                        value={partition}
                        onChange={handlePartitionChange}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: 'auto'
                            }
                          }
                        }}
                      >
                        {partitionList?.map((partitionNo, index) => (
                          <MenuItem key={index} value={partitionNo}>
                            {partitionNo}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2} marginTop={1}>
                  <Grid item xs={12} sm={7.5}>
                    <Stack spacing={1}>
                      <InputLabel>Owner Name</InputLabel>
                      <TextField value={ownerName} required></TextField>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Stack spacing={1}>
                      <InputLabel>Owner Id </InputLabel>
                      <TextField value={ownerId} required></TextField>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MainCard>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Finacial Year:</InputLabel>
                      <Select
                        id="year-select"
                        value={year}
                        onChange={handleFinanceYearChange}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: 'auto'
                            }
                          }
                        }}
                      >
                        {financeyearList?.map((year, index) => (
                          <MenuItem key={index} value={year.FinanceYear}>
                            {year.FinanceYear}-{year.FinanceYear + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Stack spacing={1}>
                      <InputLabel>Bill Book No</InputLabel>
                      <Select
                        id="billBook-select"
                        value={billBookNo}
                        onChange={handleBillBookNo}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: 'auto'
                            }
                          }
                        }}
                      >
                        {billBookNoList?.map((billBookNo, index) => (
                          <MenuItem key={index} value={billBookNo}>
                            {billBookNo}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Stack spacing={1}>
                      <InputLabel>Invoice No</InputLabel>
                      <Select
                        id="invoce-select"
                        value={invoiceNo}
                        onChange={handleInvoiceNo}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflowY: 'auto'
                            }
                          }
                        }}
                      >
                        {invoiceNoList?.map((invoiceNo, index) => (
                          <MenuItem key={index} value={invoiceNo}>
                            {invoiceNo}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid container spacing={2} marginTop={1}>
                  <Grid item xs={12} sm={7}>
                    <Stack spacing={1}>
                      <InputLabel>Employee Name </InputLabel>
                      <TextField required
                        value={empName}></TextField>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Stack spacing={1}>
                      <InputLabel > Transaction Date</InputLabel>
                    </Stack>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard title="Current Tax">
                <Box sx={{ height: '150px', overflow: 'auto' }}>
                  <Table style={{ width: '100%', height: '150px', overflowX: 'auto' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '300px' }}>Property</TableCell>
                        <TableCell sx={{ width: '300px' }}>Edcation</TableCell>
                        <TableCell sx={{ width: '300px' }}>Sp Edu. </TableCell>
                        <TableCell sx={{ width: '300px' }}>Employee</TableCell>
                        <TableCell sx={{ width: '300px' }}>Tree</TableCell>
                        <TableCell>Fire</TableCell>
                        <TableCell>Light</TableCell>
                        <TableCell>Road</TableCell>
                        <TableCell>Sanitation </TableCell>
                        <TableCell>W.Cess </TableCell>
                        <TableCell>Wbenfit</TableCell>
                        {/* <TableCell>Water Fit </TableCell> */}
                        <TableCell>Water Bill</TableCell>
                        <TableCell>Sewage</TableCell>
                        <TableCell>Tax1</TableCell>
                        <TableCell>Interest </TableCell>
                        <TableCell>Total Tax</TableCell>
                      </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                      <TableRow >
                        {Object.values(currentTaxes)?.map((value, index) => (
                          <TableCell align="center" key={index}>{value}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard>
                <Grid container spacing={2}>
                  {Object.keys(formValues)?.slice(0, 16)?.map((label, index) => (
                      <Grid item xs={12} sm={1.5} key={index}>
                        <Stack spacing={1}>
                          <InputLabel>{label}</InputLabel>
                          <TextField
                            required
                            type='number'
                            value={formValues[label]}
                            disabled={!isEditable}
                            onChange={(e) => handleInputChange(e, label)}
                            onFocus={(e) => {
                              if (e.target.value === '0') {
                                handleInputChange({ target: { value: '' } }, label);
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                handleInputChange({ target: { value: '0' } }, label);
                              }
                            }}
                            inputProps={{
                              min: 0,
                              pattern: '[0-9]*',
                              inputMode: 'numeric',
                            }}
                          />
                        </Stack>
                      </Grid>
                    ))}
                </Grid>
              </MainCard>
            </Grid>

            {/* Other Expenses Section */}
            <Grid item xs={12}>
              <MainCard title="Other Expenses">
                <Grid container spacing={2}>
                  {Object.keys(formValues)?.slice(16)?.map((label, index) => (
                      <Grid item xs={12} sm={2} key={index}>
                        <Stack spacing={1}>
                          <InputLabel>{label}</InputLabel>
                          <TextField
                            required
                            type='number'
                            value={formValues[label]}
                            disabled={!isEditable}
                            onChange={(e) => handleInputChange(e, label)}
                            onFocus={(e) => {
                              if (e.target.value === '0') {
                                handleInputChange({ target: { value: '' } }, label);
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                handleInputChange({ target: { value: '0' } }, label);
                              }
                            }}
                            inputProps={{
                              min: 0,
                              pattern: '[0-9]*',
                              inputMode: 'number',
                            }}
                          />
                        </Stack>
                      </Grid>
                    ))}
                </Grid>
              </MainCard>
            </Grid>

            <Grid item xs={12}>
              <MainCard title="Payment Details">
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {/* Payment Mode */}
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel>Payment Mode</InputLabel>
                        <Select
                          id="payment-select"
                          value={paymentMode}
                          onChange={handlePaymentModeChange}
                          disabled={!isEditable} // Disable if property number is not selected
                        >
                          <MenuItem value={1}>Cash</MenuItem>
                          <MenuItem value={2}>Cheque</MenuItem>
                          <MenuItem value={3}>DD</MenuItem>
                          <MenuItem value={4}>Online</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>

                    {/* Bill No */}
                    <Grid item xs={12} sm={1.5}>
                      <Stack spacing={1}>
                        <InputLabel>Bill No:</InputLabel>
                        <TextField
                          required
                          value={billNo}
                          disabled={!isEditable} // Disable if property number is not selected
                          onChange={(e) => setBillNo(e.target.value)}
                          onFocus={(e) => {
                            if (e.target.value === '0') {
                              handleInputChange({ target: { value: '' } }, 'billNo');
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              handleInputChange({ target: { value: '0' } }, 'billNo');
                            }
                          }}
                        />
                      </Stack>
                    </Grid>

                    {/* Bill Date */}
                    <Grid item xs={12} sm={2.5}>
                      <Stack spacing={1}>
                        <InputLabel>Bill Date</InputLabel>
                      </Stack>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            value={billDate}
                            onChange={(newValue) => setBillDate(newValue)}
                            disabled={!isEditable} // Disable if property number is not selected
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Grid>

                    {/* Remark */}
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel>Remark</InputLabel>
                        <TextField
                          required
                          value={remark}
                          disabled={!isEditable} // Disable if property number is not selected
                          onChange={(e) => setRemark(e.target.value)}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard title="DD/Checks Details">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>DD/Cheque No:</InputLabel>
                      <TextField
                        required
                        type='number'
                        name="chequeNo"
                        value={checkFormData.chequeNo}
                        onChange={handleCheckData}
                        disabled={isDisabled || !isEditable}
                        inputProps={{
                          min: 0,
                          pattern: '[0-9]*',
                          inputMode: 'numeric',
                          maxLength: 6,
                        }}
                      />

                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Name:</InputLabel>
                      <TextField required name="name" value={checkFormData.name} onChange={handleCheckData} disabled={isDisabled || !isEditable}
                        inputProps={{
                          pattern: '[a-zA-Z\s]*',
                        }} />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Bank Name:</InputLabel>
                      <TextField required
                        name="bankName"
                        value={checkFormData.bankName}
                        onChange={handleCheckData}
                        disabled={isDisabled || !isEditable}
                        inputProps={{
                          pattern: '[a-zA-Z\s]*',
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Branch Name:</InputLabel>
                      <TextField required name="branchName" value={checkFormData.branchName} onChange={handleCheckData} disabled={isDisabled || !isEditable} inputProps={{
                        pattern: '[a-zA-Z\s]*',
                      }} />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Bank IFSC No:</InputLabel>
                      <TextField required name="ifsc" value={checkFormData.ifsc} onChange={handleCheckData} disabled={isDisabled || !isEditable} />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Amount:</InputLabel>
                      <TextField required name="amount" value={checkFormData.amount} onChange={handleCheckData} disabled={isDisabled || !isEditable} type='number' inputProps={{
                        min: 0,
                        pattern: '[0-9]*',
                        inputMode: 'numeric',
                      }} />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Date:</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={checkFormData.date}
                          onChange={(newValue) => setFormData({ ...checkFormData, date: newValue })}
                          disabled={isDisabled || !isEditable}
                        />
                      </LocalizationProvider>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Stack spacing={1}>
                      <InputLabel>Expiry Date:</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={checkFormData.expiryDate}
                          onChange={(newValue) => setFormData({ ...checkFormData, expiryDate: newValue })}
                          disabled={isDisabled || !isEditable}
                        />
                      </LocalizationProvider>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
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
            >
              <Grid item xs={12} sm={2}>
                <Stack spacing={1}>
                  <Button variant="contained" color="info" onClick={handleAddToGrid}>
                    Add to Grid
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            {displayGrid && (<Grid item xs={12}>
              <MainCard>
                <Box sx={{ height: '150px', overflow: 'auto' }} >
                  <Table style={{ width: '100%', height: '150px', overflowX: 'auto' }}>
                    <TableHead>
                      <TableRow>
                        {[
                          'Owner ID', 'Payment Type', 'Finance Year', 'Emp Id',
                          'Bill Book No', 'Invoice No', 'Bill No', 'Trans.Date',
                          'Bill Date', 'Prop', 'Edu', 'Emp', 'Tree', 'Sp Water',
                          'Sanitation', 'Drain', 'Road', 'Fire', 'Light',
                          'Wat Benifits', 'Major Build', 'Sew Disp', 'Sp Edu',
                          'Water Bill', 'Tax1', 'Tax Total', 'Interest',
                          'Notice Fee', 'Net Total', 'Payment Mode',
                          'DD/Cheque No.', 'Payee Name', 'Bank Name', 'Branch Name', 'IFSC Code',
                          'DD/Cheque Date', 'Expire Date', 'IFSC No.', 'Amount',
                          'Pending Year', 'Remark',
                        ]?.map((title) => (
                          <TableCell key={title} sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                            {title}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                      <TableRow>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.ownerId}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>Advance</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.year}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.empID}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.BillBookNo}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.invoiceNo}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.billNo}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                          {combinedData.value
                            ? dayjs(combinedData.value).format('DD-MM-YYYY')
                            : ''}
                        </TableCell>

                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>
                          {combinedData.billDate
                            ? dayjs(combinedData.billDate).format('DD-MM-YYYY')
                            : ''}
                        </TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Property}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Education}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Emp}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Tree}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData['W.Cess']}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Sanitation}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Drain}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Road}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Fire}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Light}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData['W.Benifit']}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData['M.Build']}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Sewage}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData['Sp.Educ']}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData['W.Bill']}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Tax1}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData['Total Tax']}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Interest}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData['Notice Fee']}</TableCell>
                        {/* <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.WarrentFee}</TableCell> */}
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.Total}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.paymentMode}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.chequeNo}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.name}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.bankName}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.branchName}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.ifsc}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.date ? dayjs(combinedData.chequeDate).format('DD-MM-YYYY') : ''}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.expiryDate ? dayjs(combinedData.expiryDate).format('DD-MM-YYYY') : ''}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.ifsc}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.amount}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.pendingYear}</TableCell>
                        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{combinedData.remark}</TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </Box>
              </MainCard>
            </Grid>
            )}


            <Grid
              container
              justifyContent="center"
              alignItems="center"

            >
              <Grid item>
                <MainCard sx={{ width: '100%', maxWidth: 1500, padding: 2 }}>
                  <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={1}>
                      <Button variant="contained" color="success" onClick={() => handlePageChange(propertyList[0])} sx={{ mx: 0.5 }}>
                        First
                      </Button>
                    </Grid>
                    <Grid item sx={{ whiteSpace: 'nowrap' }} xs={12} sm={1.5}>
                      <Button variant="contained" color="warning" onClick={() => handlePageChange(Number(property) - 1)} sx={{ mx: 1 }}>
                        &lt;&lt; Previous
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={1.5} sx={{ mx: 1 }}>
                      <TextField
                        type="number"
                        value={property}
                        onChange={(e) => setProperty(Number(e.target.value))}
                        inputProps={{ min: 1, max: propertyList.length }}
                        sx={{ mx: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ mx: 1 }}>
                      <Button variant="outlined" color="secondary" sx={{ mx: 1 }}>
                        {propertyList.length}
                      </Button>
                    </Grid>
                    <Grid item sx={{ whiteSpace: 'nowrap' }} xs={12} sm={1.3}>
                      <Button variant="contained" color="warning" onClick={() => handlePageChange(Number(property) + 1)} sx={{ mx: 1 }}>
                        Next &gt;&gt;
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ mx: 1 }}>
                      <Button variant="contained" color="success" onClick={() => handlePageChange(propertyList[propertyList.length - 1])} sx={{ mx: 1 }}>
                        Last
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ mx: 1 }}>
                      <Stack spacing={1}>
                        <Button variant="contained" color="success" onClick={handleSaveAdvancePayment} sx={{ mx: 1 }}>
                          Save
                        </Button>
                        <Snackbar
                          open={snackbarOpen}
                          autoHideDuration={6000}
                          onClose={handleCloseSnackbar}
                          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                          <SnackbarContent
                            sx={{
                              backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
                            }}
                            message={receivedMessage}
                          />
                        </Snackbar>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Button variant="contained" color="error" onClick={deletePropertybyOwnerId} sx={{ mx: 1 }}>
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </MainCard>

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
            >
              <Grid item xs={12} sm={4} marginBottom={1}>
                <Stack spacing={2} direction="row" alignItems="center">
                  <label
                    style={{
                      fontSize: '18px',
                      color: 'Blue',
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      marginTop: 16
                    }}
                  >
                    <input {...getInputProps()} />
                    Attach Document
                  </label>
                  <Chip
                    sx={{
                      mt: 2,
                      ml: 1,
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    label="1"
                    color="error"
                    size="small"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      )
      }
    </>
  )

}

export default AdvancePayment;