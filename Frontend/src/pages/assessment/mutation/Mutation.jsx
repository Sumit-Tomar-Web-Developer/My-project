import {
  Grid,
  InputLabel,
  Stack,
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Chip,
  Checkbox,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  SnackbarContent,
  Autocomplete
} from '@mui/material';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { format, parseISO } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// project import
import MainCard from 'components/MainCard';
import {
  fetchNpTitle,
  postJointOwnerPropertymastDetails,
  postMutationNewData,
  postMutationUpdatedData,
  uploadMutationDocument
} from 'services/mutation.services';
import { fetchWardNo, postWardSelection, getOwnerPropertyList } from 'services/wardnumber.services';
import { postOwnerID, getJointOwnerSelectedList, postMutationHistoryOwnerID } from 'services/mutation.services';
import { CloseCircleOutlined, EditTwoTone, SendOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';

import translateText from 'utils/translator';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { deleteDocumentFile, updateDocumentFile } from 'state/reducers/ExistingPropertySlice';
import { getRenterMutationDataByOwnerID } from 'services/renterMutaionService';
import { sendToApproval, uploadMutationFerfarDocument } from 'services/transaction/mutationHistoryApproval/mutationHistortyApprovalService';

function Mutation() {
  const [wardNo, setWardNo] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [receivedPropertyOwnerList, setReceivedPropertyOwnerList] = useState([]);

  const [selectedOwnerID, setSelectedOwnerID] = useState('');
  const [selectedPropertyNo, setSelectedPropertyNo] = useState('');
  const [selectedPartitionNo, setSelectedPartitionNo] = useState('');
  const [receivedTransferPropertyList, setReceivedTransferPropertyList] = useState([]);
  const [receivedMutationTransferPropertyList, setReceivedMutationTransferPropertyList] = useState([]);
  const [MDId, setMID] = useState('');

  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);


  const [accessLevel, setAccessLevel] = useState(null);
  // const {
  //   remark,
  //   documents,
  //   policy,
  //   action,
  //   financeYear,
  //   assessment   ,
  //   propertyMast       
  // } = useSelector((state) => state.combinedDataEntry);

  
  //get page id for current page
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Mutation';
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

 
 const userData = useSelector((state) => state.newUserDetails.initialUserData);

  useEffect(() => {
    console.log(userData, 'logged in user check mutation page');
  }, [userData]);

  //const isAmc = userData?.role === 'Amc Employee';


  const loggedInUserRole = useSelector(
    (state) => state.newUserDetails.initialUserData.role
  );
  // const isAMCUser = userData?.RoleName === 'Admin';
  const isAmc =loggedInUserRole?.startsWith('AMC');

  console.log(isAmc,"sss")


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
      console.log(access, 'assigned access to Mutation Page');
      setAccessLevel(access);

      if (access === 1 || access === 2) {
        setShowAccessDialog(true); // Show dialog for No Access or View Only
      } else {
        setShowAccessDialog(false);
      }
    }
  }, [permissionAccess]);

  
  // inside Mutation component
  const handleFileUpload = async (file) => {
    console.log(selectedOwnerID ,"DD" );
        console.log(selectedPropertyNo ,"PP" );

    const formData = new FormData();
    formData.append('NPTitle', npTitle);
    formData.append('WardNo', selectedWard);
    formData.append('PropertyNo', selectedPropertyNo);
    formData.append('PartitionNo', selectedPartitionNo || ''); // ✅ optional
    formData.append('file', file);

    try {
      const res = await uploadMutationDocument(formData);
      console.log('File uploaded:', res);

      setSnackbarMessage('File uploaded successfully.'||res.message);
      setSnackbarSeverity('success');
     setSnackbarOpen(true);

      // Preview uploaded file in new tab
      // const pdfURL = URL.createObjectURL(file);
      // window.open(pdfURL);
    } catch (err) {
      console.error(err);
    }
  };

  // Dropzone setup
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [selectedOwnerID, selectedPropertyNo, selectedPartitionNo]
  );
   
// const handleFileChange = (id, file) => {
//   if (!file) return;

//   console.log('Uploading file:', id, file);

//   setDocuments(prev =>
//     prev.map(doc =>
//       doc.id === id
//         ? { ...doc, file }
//         : doc
//     )
//   );
// };

// const handleFileChange = async (id, file) => {
//   if (!file) return;

//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('OwnerID', selectedOwnerID);

//   const res = await uploadMutationFerfarDocument(formData);

//   setDocuments(prev =>
//     prev.map(doc =>
//       doc.id === id
//         ? {
//             ...doc,
//             file,
//             uploadedFileName: res.fileName 
//           }
//         : doc
//     )
//   );
// };

// const handleFileChange = async (docId, selectedFile) => {
//   if (!selectedFile) return;

//   const formData = new FormData();
//   formData.append('file', selectedFile); // single file
//   formData.append('OwnerID', selectedOwnerID); // optional

//   try {
//     const res = await uploadMutationFerfarDocument(formData);

//     // ✅ Console the uploaded file info
//     console.log('Uploaded file name:', res.fileName);
//     console.log('Uploaded file path:', res.filePath);

//     // Update the document state
//     setDocuments(prev =>
//       prev.map(doc =>
//         doc.id === docId
//           ? { 
//               ...doc, 
//               file: res.filePath ? { fileName: res.fileName, filePath: res.filePath } : null 
//             }
//           : doc
//       )
//     );
//   } catch (err) {
//     console.error('File upload error:', err);
//   }
// };


// const handleFileChange = async (docId, file) => {
//   if (!file) return;

//   console.log('Uploading file for docId:', docId, file);

//   const formData = new FormData();
//   formData.append('file', file);                  // Must match multer.single('file')
//   formData.append('OwnerID', selectedOwnerID);    // Optional extra info

//   try {
//     const res = await uploadMutationFerfarDocument(formData); // your axios function
//     console.log('File uploaded:', res);

//     if (!res.filePath) throw new Error('Upload failed');

//     // Update document state with uploaded path
//     setDocuments(prev =>
//       prev.map(doc =>
//         doc.id === docId
//           ? { ...doc, file, uploadedFilePath: res.filePath } // mark uploaded
//           : doc
//       )
//     );

//     alert('File uploaded successfully!');
//   } catch (err) {
//     console.error('File upload error:', err);
//     alert('File upload failed. Please try again.');
//   }
// };

// const handleFileChange = async (docId, file) => {
//   if (!file) return;

//   console.log('Uploading file for docId:', docId, file);

//   const formData = new FormData();
//   formData.append('file', file);
//     formData.append('OwnerID', selectedOwnerID); // 🔥 IMPORTANT


//   try {
//     const data = await uploadMutationFerfarDocument(formData);

//     console.log('Upload response:', data);

//     if (!data.success || !data.files?.length) {
//       throw new Error('Upload failed');
//     }

//     const uploadedFilePath = data.files[0].filePath;

//     setDocuments(prev =>
//       prev.map(doc =>
//         doc.id === docId
//           ? {
//               ...doc,
//               file,
//               uploadedFilePath
//             }
//           : doc
//       )
//     );

//     alert('File uploaded successfully!');
//   } catch (err) {
//     console.error('File upload error:', err);
//     alert('File upload failed. Please try again.');
//   }
// };


// const handleFileChange = async (docId, file) => {
//   if (!file) return;

//   // Find document details
//   const doc = documents.find(d => d.id === docId);
//   if (!doc) return;

//   console.log('Uploading file for docId:', docId, 'Document Name:', doc.name, file);

//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('OwnerID', selectedOwnerID); 
//   formData.append('DocumentName', doc.name); // 🔥 send doc name

//   try {
//     const data = await uploadMutationFerfarDocument(formData);

//     console.log('Upload response:', data);

//     if (!data.success || !data.files?.length) {
//       throw new Error('Upload failed');
//     }

//     const uploadedFilePath = data.files[0].filePath;

//     setDocuments(prev =>
//       prev.map(d =>
//         d.id === docId
//           ? {
//               ...d,
//               file,
//               uploadedFilePath,
//             }
//           : d
//       )
//     );

//     alert(`File "${doc.name}" uploaded successfully!`);
//   } catch (err) {
//     console.error('File upload error:', err);
//     alert(`File upload failed for "${doc.name}". Please try again.`);
//   }
// };

// const handleFileChange = async (docId, file) => {
//   if (!file) return;

//   const doc = documents.find(d => d.id === docId);
//   if (!doc) return;

//   // Rename file: prefix with document name
//   const newFileName = `${doc.name}${Date.now()}-${file.name}`;
//   const renamedFile = new File([file], newFileName, { type: file.type });

//   const formData = new FormData();
//   formData.append('file', renamedFile);
//   formData.append('OwnerID', selectedOwnerID);
//   formData.append('DocumentName', doc.name); // still send doc name separately

//   try {
//     const data = await uploadMutationFerfarDocument(formData);

//     console.log('Upload response:', data);

//     if (!data.success || !data.files?.length) throw new Error('Upload failed');

//     const uploadedFilePath = data.files[0].filePath;

//     setDocuments(prev =>
//       prev.map(d =>
//         d.id === docId ? { ...d, file: renamedFile, uploadedFilePath } : d
//       )
//     );

//     alert(`File "${doc.name}" uploaded successfully!`);
//   } catch (err) {
//     console.error('File upload error:', err);
//     alert(`File upload failed for "${doc.name}". Please try again.`);
//   }
// };





  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'], 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] 
    },
    multiple: false 
  });

  const [npTitle, setNpTitle] = useState('');
  const[showFileUploadTable,setShowFileUploadTable]=useState(false);
  const[showRenterTable,setShowRenterTable]=useState(false);

  useEffect(() => {
    const fetchNpCouncilTitle = async () => {
      try {
        const res = await fetchNpTitle(); //
        console.log('Fetched NPTitle:', res);
        setNpTitle(res.NPTitle);
        console.log('NPTitle set to:', res.NPTitle);
      } catch (err) {
        console.error('Error fetching NPTitle:', err);
      }
    };
    fetchNpCouncilTitle();
  }, []);

  const navigate = useNavigate();
  const handleRedirect = () => {
    setShowAccessDialog(false);
    navigate('/payment/dashboard');
  };

  console.log(MDId);

  useEffect(() => {
    const loadWardNos = async () => {
      try {
        const wardNo = await fetchWardNo();
        // sort numerically by NewWardNo
        const sortedWard = [...wardNo].sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo));
        setWardNo(sortedWard);
      } catch (error) {
        console.error('Error fetching ward Number', error);
      }
    };

    loadWardNos();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedWard) {
        try {
          const response = await postWardSelection(selectedWard);
          setReceivedPropertyOwnerList(response.properties);
          console.log(response);
        } catch (error) {
          console.error('Error posting ward No.:', error);
        }
      }
    };
    fetchData();
  }, [selectedWard]);

  useEffect(() => {
    const fetchDataOwner = async () => {
      if (selectedOwnerID) {
        try {
          const response = await postOwnerID(selectedOwnerID);
          console.log(response, 'owner details');
          setReceivedTransferPropertyList(response.transferProperties);
        } catch (error) {
          console.error('Error posting Owner ID', error);
        }
      }
    };
    fetchDataOwner();
  }, [selectedOwnerID]);

  useEffect(() => {
    const fetchMutationDataOwner = async () => {
      if (selectedOwnerID) {
        try {
          const response = await postMutationHistoryOwnerID(selectedOwnerID);

          console.log(response,"response mutation details history")
          setReceivedMutationTransferPropertyList(response.mutationProperties || []);
        } catch (error) {
          console.error('Error posting Owner ID', error);
        }
      }
    };
    fetchMutationDataOwner();
  }, [selectedOwnerID]);

  const [snackbarSeverity, setSnackbarSeverity] = useState('');



  // const handleSaveMutationData = async () => {
  //   try {
  //     const payload = [
  //       {
  //         ...newOwnerDetails,
  //         receivedTransferPropertyList: mutationOwnerList.map((item) => ({
  //           ...item,
  //           OwnerID: selectedOwnerID
  //         }))
  //       }
  //     ];

  //     console.log(payload, 'data to be send to mutation');

  //     const response = await postMutationNewData(payload);

  //     console.log(response, 'response');
  //     // ✅ Success snackbar
  //     setSnackbarMessage('Mutation details saved successfully!');
  //     setSnackbarSeverity('success');
  //     setSnackbarOpen(true);
  //     console.log('Data posted successfully transferr..', response);

  //     if (response?.newMutationDetailSeller?.MDId) {
  //       setMID(response.newMutationDetailSeller.MDId, 'data');
  //        setIsSaved(true);

      
  //   }

  //   // 🔹 CHECK DOCUMENT CONDITION
  //   if (isAnyFirst9DocUploaded) {
  //     setCanPrint(true);
  //   } else {
  //     setCanPrint(false);
  //     setSnackbarMessage('किमान एक दस्तऐवज (1 ते 9) अपलोड करा');
  //     setSnackbarSeverity('warning');
  //     setSnackbarOpen(true);
  //   }

  //     // 🔥 refresh Owner Details (current owners)
  //     const ownerRes = await postOwnerID(selectedOwnerID);
  //     setReceivedTransferPropertyList(ownerRes.transferProperties);

  //     // 🔥 refresh Property Transfer Details (history)
  //     const mutationRes = await postMutationHistoryOwnerID(selectedOwnerID);
  //     setReceivedMutationTransferPropertyList(mutationRes.mutationProperties);
  //     setMutationOwnerList([]);
  //   } catch (error) {
  //     console.error('Error posting data', error);
  //     setSnackbarMessage('Failed to save mutation details');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //   }
  // };

  const [documents, setDocuments] = useState([
  { id: 1, name: 'स्थळपाहणी अहवाल', file: null },
  { id: 2, name: 'पावती पुस्तक', file: null },
  { id: 3, name: 'नोटशीट', file: null },
  { id: 4, name: 'अर्ज', file: null },
  { id: 5, name: 'सूचना पत्रक', file: null },
  { id: 6, name: 'जुनी टॅक्स पावती', file: null },
  { id: 7, name: 'जुने डिमांड बिल', file: null },
  { id: 8, name: 'रजिस्ट्री', file: null },
  { id: 9, name: 'दुरुस्ती पत्रक', file: null },
]);


const handleClear =()=>
{
setShowFileUploadTable(false);
setShowRenterTable(false);
setSelectedWard('');
setSelectedPropertyNo('');
setReceivedMutationTransferPropertyList([]);
setShowJointOwnerDialog(false);
}

 const handlePrint = async () => {
  // 🖨️ Your print logic
  window.print(); // or API print

  // ➕ Add document ID 10 AFTER print
  setDocuments(prev => {
    const exists = prev.some(d => d.id === 10);
    if (exists) return prev;

    return [
      ...prev,
      {
        id: 10,
        name: 'फेरफार कागदपत्र',
        file: null
      }
    ];
  });
};


const[versionID,setVersionID]=useState('');
const canPrint = documents.some(
  d => d.id >= 1 && d.id <= 9 && d.file
);


const isAnyFirst9DocUploaded = documents.some(
  d => d.id <= 9 && d.file
);



const isMutationDocsUploaded = documents.some(
  d => d.id === 10 && d.file
);


   const handleSaveMutationData = async () => {
    try {

  const isAnyFirst9DocUploaded = documents.some(
      d => d.id >= 1 && d.id <= 9 && d.file // ✅ check selected file
    );
if (!isAnyFirst9DocUploaded) {
  setSnackbarMessage('किमान एक दस्तऐवज (1 ते 9) अपलोड करा');
  setSnackbarSeverity('warning');
  setSnackbarOpen(true);
  return; // 🔥 VERY IMPORTANT
}
// collect only uploaded files
    // const uploadedFiles = documents
    //   .filter(doc => doc.uploadedFileName)
    //   .map(doc => doc.uploadedFileName);

    // if (uploadedFiles.length === 0) {
    //   alert('Please upload at least one document');
    //   return;
    // }
      const payload = [
        {
          ...newOwnerDetails,

          receivedTransferPropertyList: mutationOwnerList.map((item) => ({
            ...item,
            OwnerID: selectedOwnerID
          }))
        }
      ];

      console.log(payload, ' data to be send');

      const response = await postMutationNewData(payload);
      console.log(response, 'response mutaion done data');

    //  const { UpdVersionID, OwnerID } = response;
      setVersionID(response.UpdVersionID)

      // ✅ Success snackbar
      setSnackbarMessage('Mutation details saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      console.log('Data posted successfully transferr..', response);

      if (response?.newMutationDetailSeller?.MDId) {
        setMID(response.newMutationDetailSeller.MDId, 'data');
      }

      // 🔥 refresh Owner Details (current owners)
      const ownerRes = await postOwnerID(selectedOwnerID);
      setReceivedTransferPropertyList(ownerRes.transferProperties);

      // 🔥 refresh Property Transfer Details (history)
      const mutationRes = await postMutationHistoryOwnerID(selectedOwnerID);
      setReceivedMutationTransferPropertyList(mutationRes.mutationProperties);
      setMutationOwnerList([]);
      //setShowFileUploadTable(false);
    } catch (error) {
      console.error('Error posting data', error);
      setSnackbarMessage('Failed to save mutation details');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [errors, setErrors] = useState({});
  // the currently selected mutation owner index (for edit)
  const [selectedMutationOwner, setSelectedMutationOwner] = useState(null);

  const titleMap = {
    Mr: { en: 'Mr', mr: 'श्री' },
    Mrs: { en: 'Mrs', mr: 'श्रीमती.' },
    Miss: { en: 'Miss', mr: 'कुमारी' },
    Other: { en: 'Other', mr: 'इतर' }
  };
const handleDownload = (doc) => {
  if (!doc.file) return;

  const url = URL.createObjectURL(doc.file);

  const a = document.createElement('a');
  a.href = url;
  a.download = doc.file.name;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // ✅ Update local state immediately (smooth typing)
  //   setNewOwnerDetails((prevState) => ({
  //     ...prevState,
  //     [name]: value
  //   }));

  //   // ✅ Marathi auto-sync for title
  //   if (name === 'OwnerTitle') {
  //     setNewOwnerDetails((prevState) => ({
  //       ...prevState,
  //       OwnerTitle: value,
  //       OwnerTitleMarathi: titleMap[value]?.mr || ''
  //     }));
  //     return;
  //   }

  //   // ✅ Special case for OwnerName (with delete handling + translation)
  //   if (name === 'OwnerName') {
  //     if (value === '') {
  //       setNewOwnerDetails((prevState) => ({
  //         ...prevState,
  //         OwnerName: '',
  //         OwnerNameMarathi: ''
  //       }));
  //       return;
  //     }

  //     setNewOwnerDetails((prevState) => ({
  //       ...prevState,
  //       OwnerName: value
  //     }));

  //     translateText(value)
  //       .then((translated) => {
  //         setNewOwnerDetails((prevState) => ({
  //           ...prevState,
  //           OwnerNameMarathi: translated
  //         }));
  //       })
  //       .catch((err) => console.error(err));

  //     return;
  //   }

  //   // ✅ You can add more fields later (like Address → Patta, etc.)
  // };

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  // ✅ Smooth typing – update immediately
  setNewOwnerDetails((prev) => ({
    ...prev,
    [name]: value
  }));

  // ✅ Auto-sync Marathi title
  if (name === 'OwnerTitle') {
    setNewOwnerDetails((prev) => ({
      ...prev,
      OwnerTitleMarathi: titleMap[value]?.mr || ''
    }));
    return;
  }

  // ✅ Common translate handler
  const handleTranslate = (engKey, mrKey) => {
    if (value === '') {
      setNewOwnerDetails((prev) => ({
        ...prev,
        [engKey]: '',
        [mrKey]: ''
      }));
      return;
    }

    translateText(value)
      .then((translated) => {
        setNewOwnerDetails((prev) => ({
          ...prev,
          [mrKey]: translated
        }));
      })
      .catch((err) => console.error(err));
  };

  // ✅ Owner Name → Marathi
  if (name === 'OwnerName') {
    handleTranslate('OwnerName', 'OwnerNameMarathi');
    return;
  }

  // ✅ Occupier Name → Marathi
  if (name === 'OccupierName') {
    handleTranslate('OccupierName', 'OccupierNameMarathi');
    return;
  }

  // ➕ Add more mappings later if needed
};

  const handleDateChange = (name, date) => {
    setNewOwnerDetails({ ...newOwnerDetails, [name]: date });
  };

  const [mutationOwnerList, setMutationOwnerList] = useState([]);
  const [newOwnerDetails, setNewOwnerDetails] = useState({
    PurchaseDate: null,
    SellingDate: null,
    ReasonForSale: '',
    OrderNo: '',
    OrderTransferDate: null,
    OwnerTitleMarathi: '',
    OwnerNameMarathi: '',
    OccupierName:'',
    OccupierNameMarathi:'',
    OwnerTitle: '',
    OwnerName: '',
    isPrime: false
  });


  const [showJointOwnerDialog, setShowJointOwnerDialog] = useState(false);


  const handleRowClick = (index) => {
    const ownerObject = mutationOwnerList[index];
    if (!ownerObject) return;
    setNewOwnerDetails({
      OwnerTitle: ownerObject.OwnerTitle,
      OwnerTitleMarathi: ownerObject.OwnerTitleMarathi,
      OwnerName: ownerObject.OwnerName,
      OwnerNameMarathi: ownerObject.OwnerNameMarathi,
      OccupierName: ownerObject.OccupierName,
      OccupierNameMarathi: ownerObject.OccupierNameMarathi,
      isPrime: ownerObject.isPrime,
      PurchaseDate: ownerObject.PurchaseDate || null,
      SellingDate: ownerObject.SellingDate || null,
      ReasonForSale: ownerObject.ReasonForSale || '',
      OrderNo: ownerObject.OrderNo || null,
      OrderTransferDate: ownerObject.OrderTransferDate || null
    });
    setSelectedMutationOwner(index);
  };



//   const handleAddMutationOwner = () => {
//     let validationErrors = {};
//     if (!newOwnerDetails.OwnerTitle || !newOwnerDetails.OwnerName || !newOwnerDetails.SellingDate) {
//       setSnackbarMessage('⚠️ Please fill all mandatory fields before adding.');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     // --- validation checks ---
//     if (newOwnerDetails.PurchaseDate && newOwnerDetails.SellingDate) {
//       if (new Date(newOwnerDetails.SellingDate) <= new Date(newOwnerDetails.PurchaseDate)) {
//         setSnackbarMessage('New Owner Purchase Date must be greater than Old Owner Purchase Date');
//         setSnackbarSeverity('error');
//         setSnackbarOpen(true);
//         return;
//       }
//     }

//     if (newOwnerDetails.SellingDate && newOwnerDetails.OrderTransferDate) {
//       if (new Date(newOwnerDetails.OrderTransferDate) < new Date(newOwnerDetails.SellingDate)) {
//         setSnackbarMessage('Transfer Date must be greater than or equal to New Owner Purchase Date');
//         setSnackbarSeverity('error');
//         setSnackbarOpen(true);
//         return;
//       }
//     }

//     const isFutureDate = (date) => {
//       if (!date) return false;
//       const d = new Date(date);
//       const today = new Date();

//       const result =
//         d.getFullYear() > today.getFullYear() ||
//         (d.getFullYear() === today.getFullYear() && d.getMonth() > today.getMonth()) ||
//         (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() > today.getDate());

//       console.log('Is future:', result);
//       return result;
//     };

//     // inside handleAddMutationOwner
//     if (isFutureDate(newOwnerDetails.OrderTransferDate)) {
//       console.log('🚫 Transfer date is in the future');
//       setSnackbarMessage('Transfer Date cannot be in the future');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     } else {
//       console.log('✅ Transfer date is valid');
//     }
//     // First row must be isPrime
//     if (mutationOwnerList.length === 0 && !newOwnerDetails.isPrime) {
//       setSnackbarMessage('The first owner must be marked as Prime.');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//      // Only one prime allowed
//   if (newOwnerDetails.isPrime && mutationOwnerList.some(owner => owner.isPrime)) {
//     setSnackbarMessage('Only one owner can be marked as Prime.');
//     setSnackbarSeverity('error');
//     setSnackbarOpen(true);
//     return;
//   }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setErrors({});

//     // ✅ copy current list
//     let updatedList = [...mutationOwnerList];


// // Prime owner rule: if setting IsPrime = true, reset all others
//   let updatedOwners = [...mutationOwnerList];

//   if (newOwnerDetails.isPrime) {
//     updatedOwners = updatedOwners.map((owner, index) => ({
//       ...owner,
//       isPrime: selectedMutationOwner !== null && index === selectedMutationOwner
//         ? true 
//         : false, 
//     }));
//   }

//   if (selectedMutationOwner !== null) {   
//     updatedOwners[selectedMutationOwner] = {
//       ...updatedOwners[selectedMutationOwner],
//       ...newOwnerDetails,
//     };
//     setSelectedMutationOwner(null);
//   } else {
//     updatedOwners.push(newOwnerDetails);
//   }
//    setMutationOwnerList(updatedOwners);

//    // if (selectedMutationOwner !== null) {
//     //   // update selected row
//     //   updatedList[selectedMutationOwner] = { ...newOwnerDetails };
//     // } else {
//     //   // add new row
//     //   updatedList.push({ ...newOwnerDetails });
//     // }

//     //setMutationOwnerList(updatedList);

//     // ✅ Show joint owner dialog ONLY if first owner and isPrime
//     if (updatedList.length === 1 && updatedList[0].isPrime) {
//       setShowJointOwnerDialog(true);
//     }
//     // ✅ reset form
//     setNewOwnerDetails({
//       PurchaseDate: null,
//       SellingDate: null,
//       ReasonForSale: '',
//       OrderNo: '',
//       OrderTransferDate: null,
//       OwnerTitleMarathi: '',
//       OwnerNameMarathi: '',
//       OwnerTitle: '',
//       OwnerName: '',
//       isPrime: false
//     });

//     // ✅ clear selection (back to ADD mode)
//     setSelectedMutationOwner(null);
//   };



const handleAddMutationOwner = () => {
  if (!newOwnerDetails.OwnerTitle || !newOwnerDetails.OwnerName || !newOwnerDetails.SellingDate) {
    setSnackbarMessage('⚠️ Please fill all mandatory fields before adding.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }

  // --- date validations ---
  if (newOwnerDetails.PurchaseDate && newOwnerDetails.SellingDate) {
    if (new Date(newOwnerDetails.SellingDate) <= new Date(newOwnerDetails.PurchaseDate)) {
      setSnackbarMessage('New Owner Purchase Date must be greater than Old Owner Purchase Date');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  }

  if (newOwnerDetails.SellingDate && newOwnerDetails.OrderTransferDate) {
    if (new Date(newOwnerDetails.OrderTransferDate) < new Date(newOwnerDetails.SellingDate)) {
      setSnackbarMessage('Transfer Date must be greater than or equal to New Owner Purchase Date');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  }

  // No future transfer date allowed
  if (newOwnerDetails.OrderTransferDate && new Date(newOwnerDetails.OrderTransferDate) > new Date()) {
    setSnackbarMessage('Transfer Date cannot be in the future');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }

  // First row must be Prime
  if (mutationOwnerList.length === 0 && !newOwnerDetails.isPrime) {
    setSnackbarMessage('The first owner must be marked as Prime.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }

  // --- enforce single Prime ---
  let updatedOwners = [...mutationOwnerList];
  if (newOwnerDetails.isPrime) {
    // reset all to false first
    updatedOwners = updatedOwners.map(o => ({ ...o, isPrime: false }));
  }

  if (selectedMutationOwner !== null) {
    // editing existing
    updatedOwners[selectedMutationOwner] = {
      ...newOwnerDetails,
      isPrime: newOwnerDetails.isPrime
    };
  } else {
    // adding new
    updatedOwners.push({ ...newOwnerDetails });
  }

  setMutationOwnerList(updatedOwners);

  // reset form
  setNewOwnerDetails({
    PurchaseDate: null,
    SellingDate: null,
    ReasonForSale: '',
    OrderNo: '',
    OrderTransferDate: null,
    OwnerTitleMarathi: '',
    OwnerNameMarathi: '',
    OwnerTitle: '',
    OwnerName: '',
    OccupierName:'',
    OccupierNameMarathi:'',
    isPrime: false
  });
  setSelectedMutationOwner(null);

  if(isAmc)
  {
  setShowFileUploadTable(true);
  setShowRenterTable(true);
  }  
};


const handleAddRenter =()=>
{
    navigate('/assessment/renter-mutation');
}


  const [propList, setPropList] = useState([]);
  const [propNo, setPropNo] = useState('');
  const [partNo, setPartNo] = useState('');
  
const handleDelete = (id) => {
  setDocuments(prev =>
    prev.map(doc =>
      doc.id === id
        ? { ...doc, file: null }
        : doc
    )
  );
};

  const handleWardChange = async (event) => {
    const selectedWard = event.target.value;
    setSelectedWard(selectedWard);
    setPropNo('');
    setPartNo('');
    setSelectedOwnerID(null);

    try {
      const response = await fetchPropertyRangeByWard(selectedWard);
      const propertyRange = response.properties; 
      if (!Array.isArray(propertyRange)) throw new Error('Invalid property range');

      // Sort: main property first, then partitions
      const sortedProps = propertyRange.sort((a, b) => {
        const propA = parseInt(a.NewPropertyNo, 10);
        const propB = parseInt(b.NewPropertyNo, 10);

        if (propA !== propB) return propA - propB;

        const partA = a.NewPartitionNo ? parseInt(a.NewPartitionNo, 10) : 0;
        const partB = b.NewPartitionNo ? parseInt(b.NewPartitionNo, 10) : 0;
        return partA - partB;
      });

      setPropList(sortedProps);
    } catch (error) {
      console.error('Error fetching property range:', error);
    }

    setErrors((prevErrors) => ({ ...prevErrors, ward: undefined }));
  };

  const [transerDetailsList, setTranserDetailsList] = useState([]);

  const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success",
});


    useEffect(() => {
      const fetchRenterDetails = async () => {
        if (selectedOwnerID) {
          try {
            const response = await getRenterMutationDataByOwnerID(selectedOwnerID);
            const { jointOwnerInfo } = response.RenterInfo;
            const { propertyDetailsNew } = response.RenterInfo;
            const { prevRenterTransferDetails } = response.RenterInfo;
            //setJointOwnerList(jointOwnerInfo);
            //setRenterFloorList(propertyDetailsNew);
            setTranserDetailsList(prevRenterTransferDetails);
          } catch (error) {
            console.error('Error fetching info:', error);
          }
        }
      };
      fetchRenterDetails();
    }, [selectedOwnerID]);

const handleFileChange = async (docId, file) => {
  if (!file) return;

  const doc = documents.find(d => d.id === docId);
  if (!doc) return;

  // ✅ SAFE & TRACEABLE FILE NAME
  const newFileName = `${doc.id}__${selectedWard}_${selectedOwnerID}__${file.name}`;

  const renamedFile = new File([file], newFileName, {
    type: file.type,
  });
  console.log("📤 Uploading Document:", {
  docId: doc.id,
  docName: doc.name,
  originalFileName: file.name,
});
console.log("📝 Renamed File Name:", newFileName);

  const formData = new FormData();
  formData.append("file", renamedFile);
  formData.append("OwnerID", selectedOwnerID);
  formData.append("DocumentName", doc.name);

  try {
    const data = await uploadMutationFerfarDocument(formData);

    if (!data.success || !data.files?.length) {
      throw new Error("Upload failed");
    }

    const uploadedFilePath = data.files[0].filePath;

    setDocuments(prev =>
      prev.map(d =>
        d.id === docId
          ? { ...d, file: renamedFile, uploadedFilePath }
          : d
      )
    );


    alert(`"${doc.name}" uploaded successfully`);
  } catch (err) {
    console.error(err);
    alert(`Upload failed for "${doc.name}"`);
  }
};
const handleSendToApproval= async()=>
{

 try {
 const uploadedPaths = documents
      .filter(doc => doc.uploadedFilePath) 
      .map(doc => doc.uploadedFilePath);

    if (uploadedPaths.length === 0) {
      alert('Please upload at least one document');
      return;
    }

    const payload = {
      WardNo:selectedWard,
      UpdVersionID:versionID,
      OwnerID: selectedOwnerID,
      user: userData,
      FerfarDocument: uploadedPaths.join(','), // comma-separated paths for backend
    };
   const response= await sendToApproval(payload);

   const res = response;

setSnackbar({
  open: true,
  severity: "success",
  message: `${res.message})`,
});

   console.log(response,"appoval")
   handleClear();
 } catch (error) {
  throw error;
  console.log(error);
 }

}


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
        <MainCard title="Mutation">
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <SnackbarContent
              style={{
                backgroundColor:
                  snackbarSeverity === 'success'
                    ? 'green'
                    : snackbarSeverity === 'error'
                      ? 'red'
                      : snackbarSeverity === 'warning'
                        ? 'orange'
                        : 'blue'
              }}
              message={snackbarMessage}
              fontSize="large"
              action={
                <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
                  <CloseCircleOutlined fontSize="medium" />
                </IconButton>
              }
            />
          </Snackbar>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <MainCard>
                <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Search By:
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <Stack spacing={1}>
                      <InputLabel>Ward No.</InputLabel>
                      <Select
                        labelId="ward-no-label"
                        id="ward-no-select"
                        value={selectedWard}
                        onChange={handleWardChange}
                        displayEmpty
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
                        <MenuItem value="" disabled>
                          Select Ward No
                        </MenuItem>
                        {Array.isArray(wardNo) &&
                          wardNo.length > 0 &&
                          wardNo.map((ward, index) => (
                            <MenuItem key={index} value={Number(ward.NewWardNo)}>
                              {ward.NewWardNo}
                            </MenuItem>
                          ))}
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                      <InputLabel>Property No.</InputLabel>
                      <Autocomplete
                        options={propList}
                        value={propList.find((x) => x.OwnerID === selectedOwnerID) || null}
                        onChange={(_, selectedOption) => {
                          if (!selectedOption) {
                            setSelectedOwnerID(null);
                            setPropNo('');
                            setPartNo('');
                            return;
                          }

                          console.log('Selected raw option:', selectedOption);

                          // Set main property number
                          setPropNo(selectedOption.NewPropertyNo);

                          // Set partition number
                          setPartNo(selectedOption.NewPartitionNo || '');

                          // Set OwnerID
                          setSelectedOwnerID(selectedOption.OwnerID);

                          console.log(
                            'Splitting values -> Property No:',
                            selectedOption.NewPropertyNo,
                            'Partition No:',
                            selectedOption.NewPartitionNo
                          );
                        }}
                        inputValue={propNo} // ✅ controls what is displayed in the input
                        onInputChange={(_, newInput) => {
                          setPropNo(newInput);
                        }}
                        isOptionEqualToValue={(a, b) => a?.OwnerID === b?.OwnerID}
                        getOptionLabel={(o) =>
                          o.NewPartitionNo
                            ? `${o.NewPropertyNo}_${o.NewPartitionNo}` // show in dropdown
                            : o.NewPropertyNo
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option.OwnerID}>
                            {option.NewPartitionNo ? `${option.NewPropertyNo}_${option.NewPartitionNo}` : option.NewPropertyNo}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" placeholder="Property No" fullWidth disabled={accessLevel < 3} />
                        )}
                        ListboxProps={{ style: { maxHeight: 150, overflowY: 'auto' } }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                      <InputLabel>Partition No.</InputLabel>
                      <TextField
                        required
                        placeholder="Partition No."
                        fullWidth
                        value={partNo} // shows partition number
                        autoComplete="given-name"
                        disabled={accessLevel < 3}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Typography sx={{ mb: 2, mt: 1 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                  Property Details:
                </Typography>

                <Grid mt={2}>
                  <MainCard>
                    <Typography sx={{ mb: 2, mt: 1 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                      Owner Details:
                    </Typography>
                    <TableContainer style={{ marginTop: 20, height: '15vh' }}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell className="font-weight-bold">isPrime</TableCell>
                            <TableCell className="font-weight-bold">Title(Marathi)</TableCell>
                            <TableCell className="font-weight-bold">Full Name(Marathi)</TableCell>
                            <TableCell className="font-weight-bold">Title</TableCell>
                            <TableCell className="font-weight-bold">Full Name</TableCell>
                          </TableRow>
                        </TableHead>
                       <TableBody>
  {Array.isArray(receivedTransferPropertyList) &&
    [...receivedTransferPropertyList] 
      .sort((a, b) => (b.isPrime === true) - (a.isPrime === true)) 
      .map((item, index) => (
        <TableRow key={index}>
          <TableCell style={{ textAlign: 'center' }}>
            <FormControlLabel
              control={<Checkbox checked={item.isPrime} />}
            />
          </TableCell>
          <TableCell>{item.OwnerTitleMarathi}</TableCell>
          <TableCell>{item.OwnerNameMarathi}</TableCell>
          <TableCell>{item.OwnerTitle}</TableCell>
          <TableCell>{item.OwnerName}</TableCell>
        </TableRow>
      ))}
</TableBody>

                      </Table>
                    </TableContainer>
                  </MainCard>
                </Grid>
                <Grid mt={2}>
                  <MainCard>
                    <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                      Property Transfer Owner Details:
                    </Typography>
                    <TableContainer style={{ overflow: 'auto', marginTop: 20 }}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            {/* <TableCell>Transfer Date</TableCell> */}
                            <TableCell>Seller Name</TableCell>
                            <TableCell>Buyer Name</TableCell>
                            <TableCell>Remark</TableCell>
                            <TableCell>Order No.</TableCell>
                            <TableCell>Order Transfer Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(receivedMutationTransferPropertyList) &&
                            receivedMutationTransferPropertyList.map((item, index) => (
                              <TableRow key={index}>
                                {/* <TableCell>{item.CreationDate}</TableCell> */}
                                <TableCell>{item.SellerName}</TableCell>
                                <TableCell>{item.BuyerName}</TableCell>
                                <TableCell>{item.ReasonForSale}</TableCell>
                                <TableCell>{item.OrderNo}</TableCell>
                                <TableCell>{item.OrderTransferDate}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </MainCard>
                </Grid>
                                <Grid mt={2}>
  {showRenterTable && (
  <MainCard>
                  <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                    Property Transfer Renter Details :
                  </Typography>
                  <TableContainer style={{ height: '19.5vh', overflow: 'auto', marginTop: 20 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ pl: 3 }}>Floor</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Curr.Renter</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Curr.Renter (Marathi)</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Prev. Renter</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Prev. Renter (Marathi)</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Remark</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Mutation Date</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Order No</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Curr. Occupier</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Curr. Occupier (Marathi)</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Prev. Occupier</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Prev. Occupier (Marathi)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transerDetailsList &&
                          transerDetailsList.length > 0 &&
                          transerDetailsList.map((row, index) => (
                            <TableRow hover key={index}>
                              <TableCell align="right">{row.Floor || ''}</TableCell>
                              <TableCell align="right">{row.CurrentRenter || ''}</TableCell>
                              <TableCell align="right">{row.MCurrentRenter || ''}</TableCell>
                              <TableCell align="right">{row.PreviousRenter || ''}</TableCell>
                              <TableCell align="right">{row.MPreviousRenter || ''}</TableCell>
                              <TableCell align="right">{row.Remark || ''}</TableCell>
                              <TableCell align="right">
                                {row.MutationDate ? new Date(row.MutationDate).toLocaleDateString('en-GB') : ''}
                              </TableCell>
                              <TableCell align="right">{row.OrderNo || ''}</TableCell>
                              <TableCell align="right">{row.CurrentOccupier || ''}</TableCell>
                              <TableCell align="right">{row.MCurrentOccupier || ''}</TableCell>
                              <TableCell align="right">{row.PreviousOccupier || ''}</TableCell>
                              <TableCell align="right">{row.MPreviousOccupier || ''}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MainCard>
  )}
                                </Grid>
              </MainCard>
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
          <Grid sx={{ mt: 2 }}>
            <MainCard>
              <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                New Owner Details:
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel>Old Owner Purchase Date </InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <DatePicker
                          value={newOwnerDetails.PurchaseDate}
                          onChange={(date) => handleDateChange('PurchaseDate', date)}
                          renderInput={(params) => <TextField {...params} />}
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Stack spacing={1}>
                    <InputLabel>New Owner Purchase Date </InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <DatePicker
                          value={newOwnerDetails.SellingDate}
                          onChange={(date) => handleDateChange('SellingDate', date)}
                          renderInput={(params) => <TextField {...params} />}
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4} mt={4}>
                  <Stack direction="row" alignItems="center">
                    <label
                      style={{
                        fontSize: '18px',
                        color: 'Blue',
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      <input {...getInputProps()} disabled={accessLevel < 3} />
                      Attach Document
                    </label>
                    <Chip sx={{ ml: 1 }} label="1" color="error" size="small" />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={7.1}>
                  <Stack spacing={1}>
                    <InputLabel>Remark</InputLabel>
                    <TextField
                      required
                      value={newOwnerDetails.ReasonForSale}
                      onChange={handleInputChange}
                      name="ReasonForSale"
                      fullWidth
                      autoComplete="given-name"
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={1.5}>
                  <Stack spacing={1}>
                    <InputLabel>Order No:</InputLabel>
                    <TextField
                      required
                      value={newOwnerDetails.OrderNo}
                      onChange={handleInputChange}
                      name="OrderNo"
                      fullWidth
                      autoComplete="given-name"
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Stack spacing={1}>
                    <InputLabel>Transfer Date</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <DatePicker
                          value={newOwnerDetails.OrderTransferDate}
                          onChange={(date) => handleDateChange('OrderTransferDate', date)}
                          renderInput={(params) => <TextField {...params} />}
                          disabled={accessLevel < 3}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={3} mt={0.1}>
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel>Title</InputLabel>
                    <Select
                      value={newOwnerDetails.OwnerTitle}
                      onChange={handleInputChange}
                      required
                      name="OwnerTitle"
                      fullWidth
                      disabled={accessLevel < 3}
                    >
                      <MenuItem value="Mr">Mr.</MenuItem>
                      <MenuItem value="Mrs">Mrs.</MenuItem>
                      <MenuItem value="Miss">Miss</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel>Full Name </InputLabel>
                    <TextField
                      value={newOwnerDetails.OwnerName}
                      onChange={handleInputChange}
                      required
                      name="OwnerName"
                      fullWidth
                      autoComplete="given-name"
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>
                  <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel>Occupier Name </InputLabel>
                    <TextField
                      value={newOwnerDetails.OccupierName}
                      onChange={handleInputChange}
                      required
                      name="OccupierName"
                      fullWidth
                      autoComplete="given-name"
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>
               
</Grid>
              <Grid container spacing={3} mt={0.1}>
                 <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel>Title(Marathi)</InputLabel>
                    <Select value={newOwnerDetails.OwnerTitleMarathi} name="OwnerTitleMarathi" disabled fullWidth>
                      <MenuItem value="श्री">श्री</MenuItem>
                      <MenuItem value="श्रीमती.">श्रीमती.</MenuItem>
                      <MenuItem value="कुमारी">कुमारी</MenuItem>
                      <MenuItem value="इतर">इतर</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
                  <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel>Full Name(Marathi)</InputLabel>
                    <TextField
                      value={newOwnerDetails.OwnerNameMarathi}
                      onChange={handleInputChange}
                      required
                      name="OwnerNameMarathi"
                      fullWidth
                      autoComplete="given-name"
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1}>
                    <InputLabel>Occupier Name(Marathi)</InputLabel>
                    <TextField
                      value={newOwnerDetails.OccupierNameMarathi}
                      onChange={handleInputChange}
                      required
                      name="OccupierNameMarathi"
                      fullWidth
                      autoComplete="given-name"
                      disabled={accessLevel < 3}
                    />
                  </Stack>
                </Grid>
              
                <Grid item xs={12} sm={1}>
                  <Stack spacing={1}>
                    <InputLabel>IsPrime </InputLabel>
                    <Select
                      required
                      name="isPrime"
                      value={newOwnerDetails.isPrime ? 'true' : 'false'} // string for Select
                      onChange={(e) =>
                        setNewOwnerDetails((prev) => ({
                          ...prev,
                          isPrime: e.target.value === 'true' // convert string to boolean
                        }))
                      }
                      disabled={accessLevel < 3}
                    >
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>
                <Grid item>
                  <Button variant="contained" color="success" onClick={handleAddMutationOwner} disabled={accessLevel < 3}>
                    Add
                  </Button>
                
                  <Dialog open={showJointOwnerDialog} onClose={() => setShowJointOwnerDialog(false)}>
                    <DialogTitle>Joint Owner</DialogTitle>
                    <DialogContent>
                      <DialogContentText>Do you want to add a joint owner for this prime owner?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowJointOwnerDialog(false)}>No</Button>
                      <Button onClick={() => setShowJointOwnerDialog(false)}>Yes</Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item>

                  <Button variant="contained" color="success" onClick={handleAddRenter} disabled={accessLevel < 3}>
                    Add Renter
                  </Button>
</Grid>
{!isAmc && (
<Grid item>
   <Button variant="contained" color="success" onClick={handleSaveMutationData}   disabled={ accessLevel < 3}
 >
                    Save
                  </Button>
</Grid>
)}
             
              </Grid>
              <TableContainer style={{ height: '29.5vh', overflow: 'auto', marginTop: 20 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-weight-bold">Edit</TableCell>
                      <TableCell>Isprime</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Title(Marathi)</TableCell>
                      <TableCell>Full Name(Marathi)</TableCell>
                      <TableCell>Occupier Name</TableCell>
                      <TableCell>Occupier Name(Marathi)</TableCell>


                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(mutationOwnerList) &&
                      mutationOwnerList.map((owner, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <IconButton
                              color={selectedMutationOwner === index ? 'success' : 'primary'}
                              onClick={() => handleRowClick(index)}
                              disabled={accessLevel < 3}
                            >
                              {selectedMutationOwner === index ? <SendOutlined /> : <EditTwoTone />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={owner.isPrime} readOnly />
                          </TableCell>
                          <TableCell>{owner.OwnerTitle}</TableCell>
                          <TableCell>{owner.OwnerName}</TableCell>
                          <TableCell>{owner.OwnerTitleMarathi}</TableCell>
                          <TableCell>{owner.OwnerNameMarathi}</TableCell>
                            <TableCell>{owner.OccupierName}</TableCell>
                              <TableCell>{owner.OccupierNameMarathi}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>



            </MainCard>
<Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.severity}
    variant="filled"
    sx={{ width: "100%" }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

            <MainCard sx={{ mt: 2 }}>
                        {showFileUploadTable&& (
              <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
               <Box
                  sx={{
                    width: '80%',          
                    maxWidth: 1000,        
                    //height: 300,
                     overflowY: 'auto',
                    border: '1px solid #ccc'
                  }}
                >
                <TableContainer component={Paper} sx={{ maxHeight: 250 }}> 
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#64a8f5' }}>
                      <TableCell>No</TableCell>
                      <TableCell>Document Name</TableCell>
                      <TableCell>Upload Status</TableCell>
                      <TableCell>Delete</TableCell>
                      <TableCell>Upload</TableCell>
                      <TableCell>Download</TableCell>
                    </TableRow>
                  </TableHead>
              
                  <TableBody>
                    {documents.map((doc, index) => (
                      <TableRow key={doc.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.file ? 'Yes' : 'No'}</TableCell>
              
                        {/* DELETE */}
                        <TableCell>
                          {doc.file && (
                            <Button
                              color="error"
                              size="small"
                              onClick={() => handleDelete(doc.id)}
                            >
                              ❌
                            </Button>
                          )}
                        </TableCell>
              
                        {/* UPLOAD */}
                        <TableCell>
                          <input
                            type="file"
                            id={`file-${doc.id}`}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => document.getElementById(`file-${doc.id}`).click()}
                          >
                            📄
                          </Button>
                        </TableCell>
              
                        {/* DOWNLOAD */}
                        <TableCell>
                          {doc.file && (
                            <Button
                              size="small"
                              onClick={() => handleDownload(doc)}
                            >
                              ⬇️
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </Box>
              </Grid>

              
  )}
  {isAmc && (
                <Grid container justifyContent="center" spacing={1} style={{ marginTop: 10 }}>

<Grid item >
                  <Button variant="contained" color="success" onClick={handleSaveMutationData}   disabled={ accessLevel < 3}
 >
                    Save
                  </Button>
                </Grid>

                <Grid item >
                  <Button variant="contained" color="primary" onClick={handlePrint}    disabled={!canPrint || accessLevel < 3} 
>
                    Print
                  </Button>
                </Grid>

                <Grid item >
                  <Button variant="contained" color="warning" disabled={!isMutationDocsUploaded ||accessLevel < 3} onClick={handleSendToApproval}>
                    Send to approval
                  </Button>
                </Grid>
                </Grid>
  )}
            </MainCard>
          </Grid>
        </MainCard>
      )}
    </>
  );
}

export default Mutation;
