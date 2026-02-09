import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Grid,
  InputLabel,
  Chip,
  Stack,
  TextField,
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  SnackbarContent
} from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';


// project import
import MainCard from 'components/MainCard';


//services function import
import { fetchWardList } from 'services/data-entry.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { fetchPropertyImages } from 'services/utlilityService/ImageDownloader/ImageDownloader';


//reducer import
import { setPropertyImages } from '../../../state/reducers/imageDownloaderSlice';
// ==============================|| SAMPLE PAGE ||============================== //
//manage pagelevel access
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';


function ImageDownloader() {
  //ward,FromProperty and ToProperty stats
  const [wardList, setWardList] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedPropertyNoFrom, setSelectedPropertyNoFrom] = useState('');
  const [propertyNoListFrom, setpropertyNoListFrom] = useState([]);
  const [selectedPropertyNoTo, setSelectedPropertyNoTo] = useState('');
  //folder
  const [dirHandle, setDirHandle] = useState(null);
  const [folderName, setFolderName] = useState('');
  //snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showError, setShowError] = useState(false);


  //image
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });


  //Reducer function imageDownloaderSlice
  const dispatch = useDispatch();
  const propertyImages = useSelector((state) => state.imageDownloader.propertyImages);


  //Snackbar
  useEffect(() => {
    if (!showError) {
      if (snackbarOpen) {
        const timer = setTimeout(() => {
          setSnackbarOpen(false);
        }, 3000); // Close snackbar after 3 seconds


        return () => clearTimeout(timer); // Cleanup the timer on component unmount or when snackbaropen changes
      }
    }
  }, [snackbarOpen]);


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  //fetch ward list
  useEffect(() => {
    const fetchWardNoList = async () => {
      try {
        const wardList = await fetchWardList();
        console.log('wardList', wardList);


        const wardNumbers = wardList
          .map((item) => Number(item.NewWardNo))
          .filter((num) => !isNaN(num)) // optional: filter out non-numbers
          .sort((a, b) => a - b);


        setWardList(wardNumbers);
      } catch (error) {
        console.error('Error in fetching ward list:', error);
      }
    };


    fetchWardNoList();
  }, []);


  //ward changes handler
  const handleWardChanges = async (event) => {
    const ward = event.target.value;
    setSelectedWard(ward);
    setSelectedPropertyNoFrom('');
    setSelectedPropertyNoTo('');


    try {
      const propertyRange = await fetchPropertyRangeByWard(ward);
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
        // if (!propertyMap.has(baseNo)) {
        //   propertyMap.set(baseNo, new Set()); // ✅ use Set instead of array
        // }


        // if (partition) {
        //   propertyMap.get(baseNo).add(partition); // ✅ add ensures uniqueness
        // }
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


      console.log(sortedList, 'Final Sorted Properties');
      setpropertyNoListFrom(sortedList);
    } catch (error) {
      console.error('Failed to fetch propertyRange:', error);
    }
  };


  //fromProperty handler
  const handlePropertyChangeFrom = (e) => {
    const selectedValue = e.target.value;
    console.log(selectedValue);
    setSelectedPropertyNoFrom(selectedValue);
    console.log(selectedPropertyNoFrom);
  };


  //toProperty handler
  const handlePropertyChangeTo = (e) => {
    const selectedValue = e.target.value;
    setSelectedPropertyNoTo(selectedValue);
    console.log(selectedPropertyNoTo);
  };


  // validation helper (returns true if valid)
  const isValidCondition = () => {
    if (selectedPropertyNoTo !== '' && selectedPropertyNoFrom !== '') {
      const [ToBase, ToPartRaw] = selectedPropertyNoTo.split('-');
      const [fromBase, fromPartRaw] = selectedPropertyNoFrom.split('-');


      const ToPart = ToPartRaw || '0';
      const fromPart = fromPartRaw || '0';


      if (Number(ToBase) < Number(fromBase)) {
        setShowError(true);
        return false;
      } else if (Number(ToBase) === Number(fromBase)) {
        const isToPartNumeric = !isNaN(ToPart);
        const isFromPartNumeric = !isNaN(fromPart);


        if (isToPartNumeric && isFromPartNumeric) {
          const invalid = Number(ToPart) < Number(fromPart);
          setShowError(invalid);
          return !invalid;
        } else {
          const invalid = ToPart < fromPart;
          setShowError(invalid);
          return !invalid;
        }
      } else {
        setShowError(false);
        return true;
      }
    }
    return false; // if one of the fields is empty
  };


  //useEffct for handling condition fromProperty<=toProperty
  // useEffect(() => {
  //   if (selectedPropertyNoTo !== '' && selectedPropertyNoFrom !== '') {
  //     const [ToBase, ToPartRaw] = selectedPropertyNoTo.split('-');
  //     const [fromBase, fromPartRaw] = selectedPropertyNoFrom.split('-');


  //     const ToPart = ToPartRaw || '0';
  //     const fromPart = fromPartRaw || '0';


  //     if (Number(ToBase) < Number(fromBase)) {
  //       setShowError(true);
  //     } else if (Number(ToBase) === Number(fromBase)) {
  //       const isToPartNumeric = !isNaN(ToPart);
  //       const isFromPartNumeric = !isNaN(fromPart);


  //       if (isToPartNumeric && isFromPartNumeric) {
  //         setShowError(Number(ToPart) < Number(fromPart));
  //       } else {
  //         // Fallback to string comparison
  //         setShowError(ToPart < fromPart);
  //       }
  //     } else {
  //       setShowError(false);
  //     }
  //   }
  // }, [selectedPropertyNoFrom, selectedPropertyNoTo]);


  //Folder selection
  const handleSelectFolder = async () => {
    try {
      //supported only in Chromium-based browsers like Chrome, Edge, Opera and
      //  Not supported in Firefox or Safari.
      const handle = await window.showDirectoryPicker();
      setDirHandle(handle);
      setFolderName(handle.name);
    } catch (error) {
      console.error('Folder selection cancelled:', error);
    }
  };


//   // 🔍 Detect Chromium support
// const isChromiumBased = () => "showDirectoryPicker" in window;


// const handleSelectFolder = async () => {
//   try {
//     if (isChromiumBased()) {
//       // Chromium → user picks folder
//       const handle = await window.showDirectoryPicker();
//       setDirHandle(handle);
//       setFolderName(handle.name);
//       setIsZipFallback(false);
//     } else {
//       // Non-Chromium → no folder selection
//       setDirHandle(null);
//       setFolderName("downloads");
//       setIsZipFallback(true);
//     }
//   } catch (error) {
//     console.error("Folder selection cancelled:", error);
//     setDirHandle(null);
//     setIsZipFallback(!isChromiumBased()); // if not Chromium, always fallback
//   }
// };


  // const handleAttachmentClick = () => {
  //   const folderInput = document.createElement('input');
  //   folderInput.type = 'file';
  //   folderInput.webkitdirectory = true;
  //   folderInput.directory = true;
  //   folderInput.multiple = false; // only one folder selection


  //   folderInput.addEventListener('change', (event) => {
  //     // Get the folder name from the first file's relative path
  //     const folderPath = event.target.files[0].webkitRelativePath.split('/')[0];
  //     setSelectedFolderPath(folderPath); // update state to display in TextField
  //   });


  //   folderInput.click();
  // };


  //fetch images based on the given range (FromPropertyNo to ToPropertyNo) and wardNo
  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (selectedWard && selectedPropertyNoFrom && selectedPropertyNoTo && isValidCondition()) {
          setLoading(true);


          const response = await fetchPropertyImages(selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo);
          // Property images exist for selected property range!
          if (response.status === 200 && response.data.inRangeImages?.length > 0) {
            console.log('fetch images', response.data.inRangeImages);
            // Flatten all image fields (A/B/C/D/PlanPath...) dynamically
            const allImages = response.data.inRangeImages.flatMap((item) => Object.values(item.images || {}));
            dispatch(setPropertyImages(allImages));
            console.log('redux propertyimages', propertyImages);
            setSnackbarSeverity('success');
            setSnackbarMessage('Property images exist for selected property range!');
            setSnackbarOpen(true);
          }
          //No ownerid found or Property images not exist  for selected property range
          else if (response.status === 404) {
            dispatch(setPropertyImages({}));
            setSnackbarSeverity('error');
            setSnackbarMessage(response.data.message || 'No images found.');
            setSnackbarOpen(true);
          } else {
            dispatch(setPropertyImages({}));
            setSnackbarSeverity('error');
            setSnackbarMessage('No images found at folder');
            setSnackbarOpen(true);
          }
        }
      } catch (error) {
        // Handle network/server errors
        console.error('something is wrong', error);
        // setSnackbarSeverity('error');
        // setSnackbarMessage(error.response?.data?.message || error.response?.data?.error || 'Server error while fetching images.');
        // setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };


    fetchImages();
  }, [selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo, dispatch]);


  //Redux state check for imageDownloaderSlice
  useEffect(() => {
    console.log('redux propertyImages updated:', propertyImages);
  }, [propertyImages]);


  //Handling download images logic
  const handleDownloadImages = async (type) => {
    // Flatten all image fields (A/B/C/D/PlanPath...) dynamically
    let allImages = propertyImages;
    console.log('allImages', allImages);
   


    if (!allImages.length || allImages.length === 0) {
      setSnackbarSeverity('error');
      setSnackbarMessage('No images found to download in this range!');
      setSnackbarOpen(true);
      return;
    }


    if (!dirHandle) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Please select folder to download images!');
      setSnackbarOpen(true);
      return;
    }


    // Filtering images
    if (type === 'propertyImages') {
      // only jpg
      allImages = allImages.filter((img) => img.fileName.toLowerCase().endsWith('.jpg'));
    }


    // Save images with subfolder handling
    for (let image of allImages) {
      try {
        let subFolder = 'Others'; // default
        if (image.fileName.toLowerCase().endsWith('.jpg')) subFolder = 'Photo';
        else if (image.fileName.toLowerCase().endsWith('.wmf')) subFolder = 'Plan';


        // get or create subfolder
        const subDir = await dirHandle.getDirectoryHandle(subFolder, { create: true });


        const fileHandle = await subDir.getFileHandle(image.fileName, { create: true });
        const writable = await fileHandle.createWritable();


        // Convert base64 → blob
        const response = await fetch(image.data);
        const blob = await response.blob();


        await writable.write(blob);
        await writable.close();
      } catch (error) {
        console.error('Error saving:', image.fileName, error);
      }
    }


    setSnackbarSeverity('success');
    setSnackbarMessage(`Saved ${allImages.length} image(s) into subfolders inside ${folderName}`);
    setSnackbarOpen(true);
  };


//   const handleDownloadImages = async (type) => {
//   let allImages = propertyImages;


//   if (!allImages?.length) {
//     setSnackbarSeverity("error");
//     setSnackbarMessage("No images found to download in this range!");
//     setSnackbarOpen(true);
//     return;
//   }


//   if (type === "propertyImages") {
//     allImages = allImages.filter((img) =>
//       img.fileName.toLowerCase().endsWith(".jpg")
//     );
//   }


//   // ✅ Case 1: Chromium + folder selected
//   if (isChromiumBased() && dirHandle) {
//     for (let image of allImages) {
//       try {
//         let subFolder = "Others";
//         if (image.fileName.toLowerCase().endsWith(".jpg")) subFolder = "Photo";
//         else if (image.fileName.toLowerCase().endsWith(".wmf")) subFolder = "Plan";


//         const subDir = await dirHandle.getDirectoryHandle(subFolder, { create: true });
//         const fileHandle = await subDir.getFileHandle(image.fileName, { create: true });
//         const writable = await fileHandle.createWritable();


//         const response = await fetch(image.data);
//         const blob = await response.blob();


//         await writable.write(blob);
//         await writable.close();
//       } catch (error) {
//         console.error("Error saving:", image.fileName, error);
//       }
//     }


//     setSnackbarSeverity("success");
//     setSnackbarMessage(`Saved ${allImages.length} image(s) into subfolders inside ${folderName}`);
//     setSnackbarOpen(true);
//   }
//   // ✅ Case 2: Non-Chromium OR Chromium but no folder → fallback to ZIP
//   else {
//     const zip = new JSZip();


//     for (let image of allImages) {
//       let subFolder = "Others";
//       if (image.fileName.toLowerCase().endsWith(".jpg")) subFolder = "Photo";
//       else if (image.fileName.toLowerCase().endsWith(".wmf")) subFolder = "Plan";


//       const response = await fetch(image.data);
//       const blob = await response.blob();


//       zip.folder(subFolder).file(image.fileName, blob);
//     }


//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     saveAs(zipBlob, `${folderName || "property_images"}.zip`);


//     setSnackbarSeverity("success");
//     setSnackbarMessage(
//       `Downloaded ${allImages.length} image(s) as ZIP (check your Downloads folder)`
//     );
//     setSnackbarOpen(true);
//   }
// };


  //clear handling
  const handleClear = async () => {
    setSelectedWard('');
    setSelectedPropertyNoFrom('');
    setSelectedPropertyNoTo('');
    setFolderName('');
    setDirHandle('');
  };


  return (
    <MainCard title="Image Downloader">
      <Box mb={2}>
        <Grid
          container
          spacing={7}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Grid item xs={12} sm={2.2}>
            <Stack spacing={1}>
              <InputLabel id="demo-number-select-label">Ward</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="ward-select"
                  placeholder="ward no"
                  value={selectedWard}
                  onChange={handleWardChanges}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                        overflowY: 'auto'
                      }
                    }
                  }}
                >
                  {wardList.map((wardNo, index) => (
                    <MenuItem key={index} value={wardNo}>
                      {wardNo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2.2}>
            <Stack spacing={1}>
              <InputLabel id="property-no-from-label">From Property No</InputLabel>
              <Select
                labelId="property-no-from-label"
                id="property-no-from-select"
                placeholder="Select Property No"
                value={selectedPropertyNoFrom}
                onChange={handlePropertyChangeFrom}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      overflowY: 'auto'
                    }
                  }
                }}
                fullWidth
              >
                {propertyNoListFrom?.length > 0 ? (
                  propertyNoListFrom.map((property, index) => (
                    <MenuItem key={index} value={property}>
                      {property}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No properties available</MenuItem>
                )}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2.2}>
            <Stack spacing={1}>
              <InputLabel>To Property No</InputLabel>
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
                value={selectedPropertyNoTo}
                onChange={handlePropertyChangeTo}
                error={showError}
              >
                {propertyNoListFrom.map((property, index) => (
                  <MenuItem key={index} value={property}>
                    {' '}
                    {/* Use the correct property name */}
                    {property}
                  </MenuItem>
                ))}
              </Select>
              <Snackbar open={showError} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                  severity="error"
                  s
                  sx={{
                    width: '100%',
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: 500
                  }}
                >
                  To Property cannot be less than From Property.
                </Alert>
              </Snackbar>
            </Stack>
          </Grid>
        </Grid>
      </Box>{' '}
      <Box marginTop={2}>
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
          <Grid item xs={12} sm={3.2}>
            <Stack spacing={2}>
              <InputLabel>Locate Folder </InputLabel>
              <TextField
                required
                fullWidth
                placeholder="Enter Folder Location"
                type="text"
                value={folderName}
                InputProps={{ readOnly: true }}
              />
            </Stack>
          </Grid>


          <Grid item xs={12} sm={2} sx={{ mt: 4 }}>
            <Stack spacing={1}>
              <Button variant="contained" color="info" onClick={handleSelectFolder}>
                Local Folder
              </Button>
            </Stack>
          </Grid>


          {/* <Grid item xs={12} sm={2} sx={{ mt: 4 }}>
            <Stack spacing={1}>
              <Button variant="contained" color="info" component="label" {...getRootProps()}>
                Local Folder
                <input type="file" style={{ display: 'none' }} {...getInputProps()} />
              </Button>
            </Stack>
          </Grid> */}


          <Grid item xs={12} sm={2} sx={{ mt: 4 }}>
            <Stack spacing={1}>
              <Button variant="contained" color="secondary" onClick={handleClear}>
                Clear
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ mt: 4 }}>
            <Stack spacing={1}>
              <Button variant="contained" color="primary" onClick={() => handleDownloadImages('propertyAndPlanImages')}>
                All Image
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ mt: 4 }}>
            <Stack spacing={1}>
              <Button variant="contained" color="success" onClick={() => handleDownloadImages('propertyImages')}>
                Downloade Image
              </Button>
            </Stack>
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
        </Grid>
      </Box>
    </MainCard>
  );
}

export default ImageDownloader;


