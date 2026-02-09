import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CSVExport } from 'components/third-party/react-table';
import { Formik } from 'formik';
import * as yup from 'yup';
import UploadSingleFile from 'components/third-party/dropzone/SingleFile';
import {
  Box,
  Tab,
  Tabs,
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  RadioGroup,
  Radio,
  FormGroup,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  LinearProgress,
  Snackbar,
  Alert,
  Autocomplete,
  TableContainer
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

// project import
import MainCard from 'components/MainCard';

// assets
import { BookOutlined } from '@ant-design/icons';

import { saveImageFromFolder, getImagesForRange, deleteSelectedImages } from 'services/utlilityService/uploadPhotoAndPlan/uploadPhotoAndPlan';
import { fetchWardList } from 'services/data-entry.services';
import { fetchPropertyRangeByWard } from 'services/utlilityService/dataEntrySameAsService/dataEntrySameAsServices';
import { convertWMFToSVG } from 'pages/assessment/data-entry/UploadPhotoAndPlan';

// ==============================|| TAB PANEL ||============================== //

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


const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

function UploadPlanAndPhoto() {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  useDropzone({ onDrop }); // not used for folder, but kept since you had it

  // CSV sample data (kept from your original)
  const headers = [
    { label: ' Ward No.', key: 'WardNo' },
    { label: 'Property No', key: 'PropertyNo' },
    { label: 'Partition No', key: 'PartitionNo' },
    { label: 'Image Name', key: 'ImageName' },
    { label: 'Description', key: 'Description' }
  ];
  const data = [{ WardNo: '1', PropertyNo: '5', PartitionNo: '1', ImageName: '1-5-1A.jpg', Description: 'Property Not Found' }];

  const [value, setValue] = useState(0);
  const handleChange = (_e, newValue) => setValue(newValue);

  // second tab demo state (kept from your original)
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const handleNumberChange = (event) => setSelectedNumbers(event.target.value);

  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const handleRadioChange = (e) => setSelectedOverlay(e.target.id);
  const [showSelect, setShowSelect] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Folder upload state
  const [selectedFolder, setSelectedFolder] = useState('');
  const [items, setItems] = useState([]); // [{file, name, type, size, relativePath, rootFolder, objectUrl}]

  const inputRef = useRef(null);
  const [errorList, setErrorList] = useState([]);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContentType, setSnackbarContentType] = useState('info');


  // Handle folder selection
  const onFolderChange = (e) => {
    const list = Array.from(e.target.files || []);
    if (!list.length) return;

    // derive root folder from first file’s relative path
    const rel0 = list[0].webkitRelativePath || list[0].name;
    const root = rel0.includes("/") ? rel0.split("/")[0] : rel0;

    // Keep only images (by MIME or extension fallback)
    const imageExt = /\.(jpe?g|png|gif|bmp|webp|tiff|svg|heic|heif|jfif|wmf)$/i;
    const images = list.filter(
      (f) => f.type.startsWith("image/") || imageExt.test(f.name)
    );

    setSelectedFolder(root);
    setItems(images);
  };
  const fileToDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // "data:<mime>;base64,...."
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** Read files in small batches to avoid freezing the UI on giant folders */
  async function filesToBase64WithBatches(files, batchSize = 10) {
    const result = [];
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      // Read a batch in parallel
      const readBatch = await Promise.all(
        batch.map(async (f) => {
          const base64 = await fileToDataURL(f);
          return { f, base64 };
        })
      );
      result.push(...readBatch);
    }
    return result;
  }
  const [wardList, setWardList] = useState([])
  const [propertyRangeList, setPropertyRangeList] = useState([])
  const [selectOneWard, setSelectOneWard] = useState('')
  const [fromProperty, setFromProperty] = useState('')
  const [toProperty, setToProperty] = useState('')
  const [rangeResults, setRangeResults] = useState([]);
  const [showRange, setShowRange] = useState(false);
  const [selectedRows, setSelectedRows] = useState([])
  const [propertyImage, setPropertyImage] = useState({})
  const keyOfRow = (r) => `${r.NewWardNo}-${r.NewPropertyNo}-${r.NewPartitionNo ?? 0}`;
  const allKeys = useMemo(() => rangeResults.map(keyOfRow), [rangeResults]);
  const [img, setImg] = useState({
    PropertyPathA: '',
    PropertyPathB: '',
    PropertyPathC: '',
    PropertyPathD: '',
    PlanPath: ''

  })
  const [idsToDelete, setIdsToDelete] = useState([])
  const initialImagesToDelete = {
    PropertyPathA: false,
    PropertyPathB: false,
    PropertyPathC: false,
    PropertyPathD: false,
    PlanPath: false,
  };



  const [imagesToDelete, setImagesToDelete] = useState(initialImagesToDelete)


  // header checkbox state
  const isAllSelected = allKeys.length > 0 && selectedRows.length === allKeys.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < allKeys.length;

  // helper to blank the preview
  const clearImg = () =>
    setImg({
      PropertyPathA: '',
      PropertyPathB: '',
      PropertyPathC: '',
      PropertyPathD: '',
      PlanPath: ''
    });
  const handleSelectAll = (e) => {
    const checkAll = e.target.checked;

    if (!checkAll) {
      // Deselect all
      setSelectedRows([]);
      setIdsToDelete([]);
      clearImg();
      return;
    }

    // Select all
    const allRowKeys = allKeys;                          // all row keys
    const allIds = Array.from(new Set(                   // unique OwnerIDs
      (rangeResults || []).map(r => r.OwnerID)
    ));

    setSelectedRows(allRowKeys);
    setIdsToDelete(allIds);

    // OPTIONAL: show the last row’s images (or clear to avoid confusion)
    const lastRow = rangeResults?.[rangeResults.length - 1];
    if (lastRow) {
      const im = (propertyImage?.data?.images || {})[lastRow.OwnerID] || {};
      setImg({
        PropertyPathA: im.PropertyPathA || '',
        PropertyPathB: im.PropertyPathB || '',
        PropertyPathC: im.PropertyPathC || '',
        PropertyPathD: im.PropertyPathD || '',
        PlanPath: im.PlanPath || ''
      });
    } else {
      clearImg();
    }
  };

  const handleToggleRow = (row) => {
    const k = keyOfRow(row);            // e.g. "1-23-0"
    const id = row.OwnerID;             // numeric/string id
    const imagesById = propertyImage?.data?.images || {};

    setSelectedRows((prevKeys) => {
      const wasSelected = prevKeys.includes(k);
      const nextKeys = wasSelected
        ? prevKeys.filter((x) => x !== k)
        : [...prevKeys, k];

      // toggle idsToDelete in lockstep with row selection
      setIdsToDelete((prevIds) => {
        const has = prevIds.includes(id);
        return wasSelected ? prevIds.filter((x) => x !== id) : [...prevIds, id];
      });

      // update the image panel
      if (!wasSelected) {
        // just selected this row -> show its images
        const im = imagesById[id] || {};
        setImg({
          PropertyPathA: im.PropertyPathA || '',
          PropertyPathB: im.PropertyPathB || '',
          PropertyPathC: im.PropertyPathC || '',
          PropertyPathD: im.PropertyPathD || '',
          PlanPath: im.PlanPath || ''
        });
      } else {
        // unselected this row
        if (nextKeys.length === 0) {
          // nothing selected -> clear
          clearImg();
        } else {
          // show the last-selected row’s images
          const lastKey = nextKeys[nextKeys.length - 1];
          const lastRow = rangeResults.find((r) => keyOfRow(r) === lastKey);
          if (lastRow) {
            const im = imagesById[lastRow.OwnerID] || {};
            setImg({
              PropertyPathA: im.PropertyPathA || '',
              PropertyPathB: im.PropertyPathB || '',
              PropertyPathC: im.PropertyPathC || '',
              PropertyPathD: im.PropertyPathD || '',
              PlanPath: im.PlanPath || ''
            });
          } else {
            clearImg();
          }
        }
      }

      return nextKeys;
    });
  };
  const handleClear = () => {
    setIdsToDelete([]);
    setSelectedRows([]);
    setPropertyRangeList([]);
    setImagesToDelete(initialImagesToDelete); // fresh object; fully controlled
    setFromProperty('');
    setToProperty('');
    setRangeResults([]);
    setSelectOneWard('');
  };

  useEffect(() => {
    console.log(imagesToDelete.PropertyPathC, 'imagesToDelete.PropertyPathC')

  }, [idsToDelete, propertyImage, img, selectedRows, propertyRangeList, imagesToDelete.PropertyPathA,
    imagesToDelete.PropertyPathB, imagesToDelete.PropertyPathC, imagesToDelete.PropertyPathD, imagesToDelete.PlanPath, fromProperty, toProperty,
    selectOneWard
  ])


  // keep selection in sync when data changes
  useEffect(() => {
    setSelectedRows((prev) => prev.filter((k) => allKeys.includes(k)));
  }, [allKeys]);


  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => items.forEach((p) => p.objectUrl && URL.revokeObjectURL(p.objectUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [preview, setPreview] = useState([{
    name: '',
    url: ''
  }]);

  useEffect(() => {
    const fetchWard = async () => {
      try {
        const res = await fetchWardList();

        // normalize response shape
        const rows =
          Array.isArray(res) ? res
            : Array.isArray(res?.data) ? res.data
              : Array.isArray(res?.rows) ? res.rows
                : [];

        // keep only numeric ward nos, dedupe, sort numerically
        const wards = [...new Set(
          rows
            .map(r => String(r?.NewWardNo ?? '').trim())
        )].sort((a, b) => a - b);

        setWardList(wards);
      } catch (err) {
        console.error('Failed to load ward list:', err);
        setWardList([]);
      }
    }
    fetchWard()
  }, [])
  useEffect(() => { }, [wardList])

  useEffect(() => {
    if (selectOneWard != '' && selectOneWard != null) {

      const propertyRange = async () => {
        const result = await fetchPropertyRangeByWard(selectOneWard)
        const sortedList = [...(result?.properties || [])].sort((a, b) => {
          const propA = parseInt(a.NewPropertyNo, 10) || 0;
          const propB = parseInt(b.NewPropertyNo, 10) || 0;

          if (propA !== propB) return propA - propB;

          const partA = parseInt(a.NewPartitionNo, 10) || 0;
          const partB = parseInt(b.NewPartitionNo, 10) || 0;

          return partA - partB;
        });

        setPropertyRangeList(sortedList)
      }
      propertyRange()
    }
    console.log(wardList, 'ward')
  }, [selectOneWard])


  const label = (o) => {
    const prop = parseInt(o?.NewPropertyNo, 10) || '';
    const part = parseInt(o?.NewPartitionNo || 0, 10);
    return part > 0 ? `${prop}-${part}` : `${prop}`;
  };


  const partAsNum = (x) => {
    const s = String(x ?? "").trim();
    return s === "" ? 0 : Number(s);
  };

  const getPropPart = (val) => {
    // Accept either an option object OR a "prop-part" string
    if (!val) return { prop: NaN, part: NaN };

    if (typeof val === "object") {
      return {
        prop: Number(val.NewPropertyNo),
        part: partAsNum(val.NewPartitionNo)
      };
    }

    // string like "12-3"
    const [p, t] = String(val).split("-");
    return { prop: Number(p), part: partAsNum(t) };
  };

  // Compare by (PropertyNo, PartitionNo)
  const cmpPropPart = (a, b) => {
    if (a.prop !== b.prop) return a.prop - b.prop;
    return a.part - b.part;
  };

  // In-range check inclusive
  const inRangePP = (x, lo, hi) =>
    cmpPropPart(lo, x) <= 0 && cmpPropPart(x, hi) <= 0;

  const handleShow = async () => {
    if (!selectOneWard || !fromProperty || !toProperty) {
      setSnackbarContent('Select Valid Range');
      setSnackbarContentType('error');
      setSnackbarOpen(true);
      return
    }



    const ward = String(selectOneWard);

    const a = getPropPart(fromProperty);
    const b = getPropPart(toProperty);
    setSnackbarOpen(false)
    if (!Number.isFinite(a.prop) || !Number.isFinite(b.prop)) return;
    if (!Number.isFinite(a.part) || !Number.isFinite(b.part)) return;

    if (Number(b.prop) < Number(a.prop)) {

      setSnackbarContent('From Property can not be less than To property');
      setSnackbarContentType('error');
      setSnackbarOpen(true);
      return
    }
    else if (Number(b.part) < Number(a.part)) {
      setSnackbarContent('From Property can not be less than To property');
      setSnackbarContentType('error');
      setSnackbarOpen(true);
      return
    }

    // Normalize start/end
    const start = cmpPropPart(a, b) <= 0 ? a : b;
    const end = cmpPropPart(a, b) <= 0 ? b : a;

    // Filter within ward and inclusive (prop,part) range
    const results = (propertyRangeList ?? [])
      .filter(o =>
        String(o?.NewWardNo) === ward &&
        inRangePP(
          { prop: Number(o?.NewPropertyNo), part: partAsNum(o?.NewPartitionNo) },
          start,
          end
        )
      )
      .sort((o1, o2) =>
        cmpPropPart(
          { prop: Number(o1.NewPropertyNo), part: partAsNum(o1.NewPartitionNo) },
          { prop: Number(o2.NewPropertyNo), part: partAsNum(o2.NewPartitionNo) }
        )
      );

    const ownerIDsToFetch = results.map((r) => r.OwnerID)
    const images = await getImagesForRange(ownerIDsToFetch)
    console.log(images, 'images')
    setPropertyImage(images)
    setRangeResults(results);
    setShowRange(true);
  };
  useEffect(() => {
    if (selectedRows.length <= 0) {
      setImg(pre => ({
        ...pre,
        PropertyPathA: '',
        PropertyPathB: '',
        PropertyPathC: '',
        PropertyPathD: '',
        PlanPath: ''
      }))

    }

  }, [selectedRows])
  useEffect(() => {

  }, [img])

  const handleSeletedRows = () => {

  }

  // Upload to backend
  const saveImage = async () => {
    if (!items.length) {
      setSnackbarContent('Please select a folder with images first');
      setSnackbarContentType('error');
      setSnackbarOpen(true);
      return;
    }
    try {
      // Convert to base64 in batches
      const base64Pairs = await filesToBase64WithBatches(items, 8);

      const payloadFiles = [];

      for (const { f, base64 } of base64Pairs) {

        // ✅ Skip non-files (restored previews)
        if (!(f instanceof File)) {
          console.warn("Skipping non-File:", f);
          continue;
        }

        // ✅ Handle WMF → SVG
        if (
          f.type === "image/x-wmf" ||
          f.type === "application/x-msmetafile"
        ) {
          await convertWMFToSVG(f);
        }

        // ✅ push payload item
        payloadFiles.push({
          name: f.name,
          mime: f.type || "application/octet-stream",
          size: f.size,
          relativePath: f.webkitRelativePath || f.name,
          base64,
        });

        // ✅ UI state updates
        setDataList((prev) => [...prev, f.name]);
        setPreview((prev) => [...prev, {
          name: f.name,
          url: URL.createObjectURL(f)
        }]);
      }

      const payload = {
        rootFolder: selectedFolder,
        files: payloadFiles,
      };



      // Build payload
      const payloadToSend = {
        rootFolder: selectedFolder,
        files: base64Pairs.map(({ f, base64 }) => ({
          name: f.name,
          mime: f.type || "application/octet-stream",
          size: f.size,
          relativePath: f.webkitRelativePath || f.name, // e.g. "Photo/1-1-1-A.jpg"
          base64, // e.g. "data:image/jpeg;base64,...."
        })),
      };
      const res = await saveImageFromFolder(payloadToSend);
      if (res.status === 200) {
        console.log("Upload response:", res);
        const errors = res?.data?.message?.errors?.map((error) => {
          return {
            ...error,
            Description: 'OwnerID Not Found'
          };
        }) || [];
        // SnackbarContent(res.message);
        setErrorList(errors || []);
        setSelectedFolder('');
        setSnackbarContent('Upload completed');
        setSnackbarContentType('success');
        setSnackbarOpen(true);
        setItems([]);

      }
      else {
        setSelectedFolder('');
        setSnackbarContent('Upload failed');
        setSnackbarContentType('error');
        setSnackbarOpen(true);
        setItems([]);

      }





      // POST JSON to backend



    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check console for details.");
    } finally {
    }
  };
  const [forImgPre, setForImgPre] = useState([{
    NewWardNo: '',
    NewPropertyNo: '',
    NewPartitionNo: '',
    PropertyPhotoA: '',
    PropertyPhotoB: '',
    PropertyPhotoC: '',
    PropertyPhotoD: '',
    PlanPhoto: '',
    imageUrl: ''
  }]);

  // helpers you can keep outside the component or inside (but outside useEffect)
  // ---- helpers (put outside component or above the effect) ----
  const isDigits = (s) => /^\d+$/.test(String(s ?? '').trim());
  const normalizePart = (p) => (isDigits(p) ? String(Number(p)) : '0');
  const keyOf = (w, p, part = '0') =>
    `${Number(w)}-${Number(p)}-${normalizePart(part)}`;

  const getNameLikeString = (item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      if (typeof item.name === 'string' && item.name) return item.name;
      if (typeof item.webkitRelativePath === 'string' && item.webkitRelativePath) {
        const parts = item.webkitRelativePath.split('/');
        return parts[parts.length - 1] || '';
      }
    }
    return '';
  };

  const parseName = (raw) => {
    const base = String(raw || '').trim();
    if (!base) return null;

    // strip last extension
    const nameNoExt = base.replace(/\.[^.]+$/, '');
    const parts = nameNoExt.split('-').map((s) => s.trim()).filter(Boolean);

    // need at least W and P
    if (parts.length < 2 || !isDigits(parts[0]) || !isDigits(parts[1])) return null;

    const ward = Number(parts[0]);
    const prop = Number(parts[1]);
    const last = (parts.at(-1) || '').toUpperCase();

    const slot = ['A', 'B', 'C', 'D'].includes(last) ? last : 'plan';

    // partition:
    //  W-P-PP-A  => PP
    //  W-P-A     => '0'
    //  W-P-PLAN or W-P => '0'
    let part = '';
    if (slot !== 'plan' && parts.length === 4 && isDigits(parts[2])) {
      part = String(Number(parts[2]));
    }

    return { ward, prop, part, slot };
  };

  const sortByWPP = (a, b) =>
    a.NewWardNo - b.NewWardNo ||
    a.NewPropertyNo - b.NewPropertyNo ||
    Number(normalizePart(a.NewPartitionNo)) - Number(normalizePart(b.NewPartitionNo));

  // ---- the fixed effect ----
  useEffect(() => {
    if (!Array.isArray(dataList) || dataList.length === 0) return;

    setForImgPre((prev) => {
      // Build a map keyed by normalized W-P-Partition
      const map = new Map();

      // seed with existing rows (normalize partition!)
      for (const r of prev) {
        if (!isDigits(r?.NewWardNo) || !isDigits(r?.NewPropertyNo)) continue;
        const key = keyOf(r.NewWardNo, r.NewPropertyNo, r.NewPartitionNo);
        map.set(key, {
          NewWardNo: Number(r.NewWardNo),
          NewPropertyNo: Number(r.NewPropertyNo),
          NewPartitionNo: normalizePart(r.NewPartitionNo),
          PropertyPhotoA: !!r.PropertyPhotoA,
          PropertyPhotoB: !!r.PropertyPhotoB,
          PropertyPhotoC: !!r.PropertyPhotoC,
          PropertyPhotoD: !!r.PropertyPhotoD,
          PlanPhoto: !!r.PlanPhoto,

        });
      }

      // fold in files
      for (const item of dataList) {
        const name = getNameLikeString(item);
        const parsed = parseName(name);
        if (!parsed) continue;

        const { ward, prop, part, slot } = parsed;
        const key = keyOf(ward, prop, part);

        const row = map.get(key) || {
          NewWardNo: ward,
          NewPropertyNo: prop,
          NewPartitionNo: part,
          PropertyPhotoA: false,
          PropertyPhotoB: false,
          PropertyPhotoC: false,
          PropertyPhotoD: false,
          PlanPhoto: false
        };

        // set the appropriate flag (merge with OR)
        if (slot === 'A') row.PropertyPhotoA = true;
        else if (slot === 'B') row.PropertyPhotoB = true;
        else if (slot === 'C') row.PropertyPhotoC = true;
        else if (slot === 'D') row.PropertyPhotoD = true;
        else row.PlanPhoto = true; // plan

        map.set(key, row);
      }

      // return unique, normalized, sorted rows
      return Array.from(map.values()).sort(sortByWPP);
    });
  }, [dataList]);
  const [showImgPre, setShowImgPre] = useState({
    PropertyPhotoA: '',
    PropertyPhotoB: '',
    PropertyPhotoC: '',
    PropertyPhotoD: '',
    PlanPhoto: ''
  });
  useEffect(() => {
    console.log('forImgPre', forImgPre);

  }, [forImgPre,]);
  const handleRowClick = (row) => {
    if (!Array.isArray(preview) || preview.length === 0) return;

    const W = Number(row.NewWardNo);
    const P = Number(row.NewPropertyNo);
    const part = row.NewPartitionNo && row.NewPartitionNo !== '0'
      ? String(row.NewPartitionNo).trim()
      : ''; // empty => filenames use a double dash

    // Build the middle piece: "PP-" or just "-" (to form W-P--A.jpg when partition is omitted)
    const partPiece = part ? `${part}-` : '-';

    const findSlotUrl = (slot) => {
      // Matches: W-P-PP-SLOT.ext  OR  W-P--SLOT.ext (when no partition)
      const re = new RegExp(
        `^${W}-${P}-${partPiece}${slot}\\.(jpg|jpeg|png|webp|bmp|gif)$`,
        'i'
      );
      const hit = preview.find((f) => re.test(String(f.name || '')));
      return hit?.url || '';
    };

    const findPlanUrl = () => {
      // Common plan filename styles seen in your data:
      //  W-P-PLAN.ext   or   W-P-Plan-.WMF
      const re1 = new RegExp(`^${W}-${P}-PLAN\\.(wmf|jpg|jpeg|png|webp)$`, 'i');
      const re2 = new RegExp(`^${W}-${P}-PLAN-\\.(wmf|jpg|jpeg|png|webp)$`, 'i');
      const hit = preview.find((f) => re1.test(f.name)) || preview.find((f) => re2.test(f.name));
      return hit?.url || '';
    };
    

    setShowImgPre({
      PropertyPhotoA: row.PropertyPhotoA ? findSlotUrl('A') : '',
      PropertyPhotoB: row.PropertyPhotoB ? findSlotUrl('B') : '',
      PropertyPhotoC: row.PropertyPhotoC ? findSlotUrl('C') : '',
      PropertyPhotoD: row.PropertyPhotoD ? findSlotUrl('D') : '',
      PlanPhoto: row.PlanPhoto ? findPlanUrl() : ''
    });
  };

  useEffect(() => {
    console.log('showImgPre', showImgPre);
    console.log('errorList', errorList);
  }, [showImgPre, errorList]);
  const IMG_MIN_H = 100;   // A/B/C/D
  const PLAN_MIN_H = 50;  // Plan
  useEffect(() => {
    setTimeout(() => {
      if (snackbarOpen) {
        setSnackbarOpen(false)
      }
    }, [3000])
  }, [snackbarOpen])

  const handleDeletePhotos = async () => {
    console.log('image to delete')
    if (selectedRows.length <= 0 || !selectedRows) {
      setSnackbarContent('Please select at least one row to delete');
      setSnackbarContentType('error');
      setSnackbarOpen(true);
      return
    }
    else if (
      imagesToDelete.PropertyPathA != true &&
      imagesToDelete.PropertyPathB != true &&
      imagesToDelete.PropertyPathC != true &&
      imagesToDelete.PropertyPathD != true &&
      imagesToDelete.PlanPath != true
    ) {
      setSnackbarContent('Please select at least one type of Image to delete');
      setSnackbarContentType('error');
      setSnackbarOpen(true);
      return
    }
    else {
      try {
        const response = await deleteSelectedImages(idsToDelete, imagesToDelete)
        if (response.status == 200) {
          setSnackbarContent('Images Deleted Succesully');
          setSnackbarContentType('success');
          setSnackbarOpen(true);
          handleClear()
        }
        else {
          setSnackbarContent('Failed to delete images');
          setSnackbarContentType('error');
          setSnackbarOpen(true);
          handleClear()
        }
      } catch (error) {

      }
    }
  }

  return (
    <MainCard>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarContentType}
          sx={{
            width: '100%',
            backgroundColor: snackbarContentType === 'success' ? 'green' : 'red',
            color: 'white',
            fontWeight: 500,
          }}
        >
          {snackbarContent}
        </Alert>
      </Snackbar>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Property Plan And Image Upload" icon={<BookOutlined />} iconPosition="start" {...a11yProps(0)} />
            <Tab label="Clear Property Plan And Images " icon={<BookOutlined />} iconPosition="start" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* TAB 1: Folder Upload */}
        <TabPanel value={value} index={0}>
          <Typography variant="h6">
            <MainCard title="Property Plan And Image Upload" sx={{ color: 'blue', fontWeight: 'bold' }}>
              <Grid
                container
                spacing={1}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
              >
                <Grid item xs={12} sm={5.2}>
                  <Stack spacing={1}>
                    <InputLabel>Select Image Folder:</InputLabel>
                    <TextField
                      required
                      fullWidth
                      placeholder="Choose a folder"
                      value={selectedFolder}
                      InputProps={{ readOnly: true }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={2} sx={{ mt: 3 }}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="info" onClick={() => inputRef.current?.click()}>
                      Browse
                    </Button>
                    <input
                      ref={inputRef}
                      type="file"
                      style={{ display: "none" }}
                      onChange={onFolderChange}
                      multiple
                      // Folder-selection (Chromium/Safari)
                      webkitdirectory="true"
                      directory="true"
                      // Firefox supports picking directories via a different UX; mozdirectory is harmless elsewhere
                      mozdirectory="true"
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={2} sx={{ mt: 3 }}>
                  <Stack spacing={1}>
                    <Button variant="contained" color="success" onClick={saveImage} >
                      {'Save Image'}
                    </Button>

                  </Stack>
                </Grid>

                <Grid item xs={12} sm={2} sx={{ mt: 3 }}>
                  <Stack spacing={1}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setSelectedFolder('');
                        setItems((prev) => {
                          prev.forEach((p) => p.objectUrl && URL.revokeObjectURL(p.objectUrl));
                          return [];
                        });


                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>



              {/* Your existing lower UI left intact */}
              <Grid item xs={12} md={12} mt={3}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={5} lg={6}>
                    <Box className="card" sx={{ mt: '6px' }} boxShadow={3} padding={1}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Upload Image:
                          </Typography>
                          <Box sx={{ overflowX: 'auto', height: 250 }}>
                            <Table>
                              <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>

                                  <TableCell>New Ward No.</TableCell>
                                  <TableCell>New Property No</TableCell>
                                  <TableCell>New Partition No</TableCell>
                                  <TableCell>Property Photo A</TableCell>
                                  <TableCell>Property Photo B</TableCell>
                                  <TableCell>Property Photo C</TableCell>
                                  <TableCell>Property Photo D</TableCell>
                                  <TableCell>Plan Photo</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>

                                {forImgPre.length > 0 ? forImgPre.map((row) => {console.log('row', row); return (
                                  <TableRow onClick={() => handleRowClick(row)} key={row.NewWardNo + row.NewPropertyNo + row.NewPartitionNo}>
                                    <TableCell>{row.NewWardNo}</TableCell>
                                    <TableCell>{row.NewPropertyNo}</TableCell>
                                    <TableCell>{row.NewPartitionNo === '0' ? '' : row.NewPartitionNo}</TableCell>
                                    <TableCell>{row.PropertyPhotoA ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{row.PropertyPhotoB ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{row.PropertyPhotoC ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{row.PropertyPhotoD ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{row.PlanPhoto ? 'Yes' : 'No'}</TableCell>
                                  </TableRow>
                                )}) : (
                                  <TableRow>
                                    <TableCell colSpan={8} align="center">No Data Available</TableCell>
                                  </TableRow>
                                )}

                              </TableBody>
                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={5} lg={6}>
                    <Box className="card" sx={{ mt: '6px' }} boxShadow={3} padding={1}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>
                            Error Record:
                          </Typography>
                          <Box sx={{ overflowX: 'auto', height: 250 }}>
                            <Grid sx={{ ml: '30vw' }}>
                              <CSVExport data={data} headers={headers} filename="ErrorRecord.csv" />
                            </Grid>
                            <Table>
                              <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                                <TableRow>
                                  <TableCell> Ward No.</TableCell>
                                  <TableCell> Property No</TableCell>
                                  <TableCell> Partition No</TableCell>
                                  <TableCell>Image Name</TableCell>
                                  <TableCell>Description</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {errorList && errorList.length > 0 ? errorList.map((error, index) => {
                                  console.log(error, 'error in map');
                                  console.log(index, 'index in map');
                                  return (<TableRow key={index} >
                                    <TableCell>{error.NewWardNo}</TableCell>
                                    <TableCell>{error.NewPropertyNo}</TableCell>
                                    <TableCell>{error.NewPartitionNo === '0' ? '' : error.NewPartitionNo}</TableCell>
                                    <TableCell>{error.Name}</TableCell>
                                    <TableCell>{error.Description}</TableCell>
                                  </TableRow>)
                                }
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={5} align="center">No Error Record</TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                </Grid>

                {/* kept your Formik examples below */}
                <Grid item xs={12} md={12} mt={3}>
                  <Formik
                    initialValues={{ files: null }}
                    onSubmit={(values) => console.log('dropzone upload - ', values)}
                    validationSchema={yup.object().shape({
                      files: yup.mixed().required('Avatar is required.')
                    })}
                  >
                    {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                      <form onSubmit={handleSubmit}>
                        <MainCard>
                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                            Upload Image:
                          </Typography>
                          <Accordion>
                            <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                              Upload Image
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <Grid container spacing={3}>
                                {[
                                  { key: 'PropertyPhotoA', label: 'Property Photo A' },
                                  { key: 'PropertyPhotoB', label: 'Property Photo B' },
                                  { key: 'PropertyPhotoC', label: 'Property Photo C' },
                                  { key: 'PropertyPhotoD', label: 'Property Photo D' }
                                ].map(({ key, label }) => {
                                  const url = showImgPre?.[key] || '';
                                  return (
                                    <Grid key={key} item xs={12} md={6} lg={3}>
                                      <Stack spacing={1.5} alignItems="center">
                                        <Typography variant="subtitle2" sx={{ width: '100%' }}>{label}</Typography>

                                        {url ? (
                                          <Box
                                            sx={{
                                              width: '100%',
                                              maxWidth: 240,
                                              aspectRatio: '4 / 3',
                                              borderRadius: 2,
                                              overflow: 'hidden',
                                              border: '1px solid',
                                              borderColor: 'divider',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              p: 0.5
                                            }}
                                          >
                                            <img
                                              src={url}
                                              alt={label}
                                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                              onError={(e) => {
                                                e.currentTarget.src =
                                                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="100%" height="100%" fill="%23f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="sans-serif" font-size="14">Preview not available</text></svg>';
                                              }}
                                            />
                                          </Box>
                                        ) : (
                                          <Box
                                            sx={{
                                              width: '100%',
                                              maxWidth: 240,
                                              aspectRatio: '4 / 3',
                                              borderRadius: 2,
                                              border: '1px dashed',
                                              borderColor: 'divider',
                                              color: 'text.secondary',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontSize: 13
                                            }}
                                          >
                                            No preview
                                          </Box>
                                        )}
                                      </Stack>
                                    </Grid>
                                  );
                                })}

                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                            Plan:
                          </Typography>
                          <Accordion>
                            <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                              Upload Plan
                            </AccordionSummary>
                            <AccordionDetails sx={{ flexDirection: 'column' }}>
                              <Grid container spacing={3} justifyContent="center">
                                {/* Make the preview row full width so it can grow */}
                                <Grid item xs={12} md={12} lg={12}>
                                  <Stack spacing={1.5} alignItems="center">
                                    <Typography variant="subtitle2" sx={{ width: '100%', textAlign: 'center' }}>
                                      PlanPhoto
                                    </Typography>

                                    {/* Center wrapper */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                      {showImgPre?.PlanPhoto ? (
                                        <Box
                                          sx={{
                                            // Wider, but fixed height so it won't grow taller
                                            width: { xs: '100%', sm: 640, md: 900 },   // increase width
                                            height: 320,                                // fixed height
                                            maxWidth: '100%',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            p: 0.5,
                                            mx: 'auto'                                  // hard center safeguard
                                          }}
                                        >
                                          <img
                                            src={showImgPre.PlanPhoto}
                                            alt="Plan"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                          />
                                        </Box>
                                      ) : (
                                        <Box
                                          sx={{
                                            width: { xs: '100%', sm: 640, md: 900 },   // same width as above
                                            height: 320,                                // same fixed height
                                            maxWidth: '100%',
                                            borderRadius: 2,
                                            border: '1px dashed',
                                            borderColor: 'divider',
                                            color: 'text.secondary',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 13,
                                            mx: 'auto'
                                          }}
                                        >
                                          No preview
                                        </Box>
                                      )}
                                    </Box>
                                  </Stack>
                                </Grid>
                              </Grid>
                            </AccordionDetails>

                          </Accordion>
                        </MainCard>
                      </form>
                    )}
                  </Formik>
                </Grid>
              </Grid>
            </MainCard>
          </Typography>
        </TabPanel>

        {/* TAB 2: left as-is from your original (UI only) */}
        <TabPanel value={value} index={1}>

          <MainCard>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert
                onClose={() => setSnackbarOpen(false)}
                severity={snackbarContentType}
                sx={{
                  width: '100%',
                  backgroundColor: snackbarContentType === 'success' ? 'green' : 'red',
                  color: 'white',
                  fontWeight: 500,
                }}
              >
                {snackbarContent}
              </Alert>
            </Snackbar>
            <Box mb={2}>
              <div className="subtitle" style={{ color: 'blue', fontWeight: 'bold' }}>
                Property Plan And Image Upload
              </div>
            </Box>
          </MainCard>

          <MainCard>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              columnGap={2}
              rowGap={2}
              sx={{ px: 2, py: 2 }}
            >
              {/* Ward */}
              <Grid item xs={12} md={3}>
                <Stack spacing={1}>
                  <InputLabel>Ward</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={selectOneWard}
                      onChange={(e) => setSelectOneWard(e.target.value)}
                      input={<OutlinedInput placeholder="Enter Number" />}
                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                    >
                      {wardList.map((ward) => (
                        <MenuItem key={ward} value={ward}>
                          {ward}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* From Property */}
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <InputLabel>From Property</InputLabel>
                  <FormControl fullWidth>
                    <Autocomplete
                      options={propertyRangeList ?? []}
                      value={fromProperty}
                      onChange={(_, v) => setFromProperty(v)}
                      getOptionLabel={label}

                      forcePopupIcon
                      openOnFocus
                      filterOptions={(options, state) => {
                        const q = String(state.inputValue ?? "").trim();
                        if (!q) return options;
                        return options.filter((o) =>
                          String(o?.NewPropertyNo ?? "").startsWith(q)
                        );
                      }}

                      renderOption={(props, option) => { props.key = option.NewWardNo; return (<li {...props}>{label(option)}</li>) }}
                      renderInput={(params) => <TextField {...params} variant="outlined" />}
                      ListboxProps={{ style: { maxHeight: 150, overflowY: "auto" } }}
                    />
                  </FormControl>
                </Stack>
              </Grid>

              {/* Till */}
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <InputLabel>To Property</InputLabel>
                  <FormControl fullWidth>
                    <Autocomplete
                      options={propertyRangeList ?? []}
                      value={toProperty}
                      onChange={(_, v) => setToProperty(v)}
                      getOptionLabel={label}

                      forcePopupIcon
                      openOnFocus
                      filterOptions={(options, state) => {
                        const q = String(state.inputValue ?? "").trim();
                        if (!q) return options;
                        return options.filter((o) =>
                          String(o?.NewPropertyNo ?? "").startsWith(q)
                        );
                      }}

                      renderOption={(props, option) => { props.key = option.NewWardNo; return (<li {...props}>{label(option)}</li>) }}
                      renderInput={(params) => <TextField {...params} variant="outlined" />}
                      ListboxProps={{ style: { maxHeight: 150, overflowY: "auto" } }}
                    />
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              columnGap={2}
              rowGap={2}
              sx={{ px: 2, py: 2 }}
            >
              <Button variant="contained" color="primary" onClick={handleShow}>
                Show
              </Button>
            </Grid>



            <Grid container spacing={2}>
              {/* LEFT: Range table */}
              <Grid item xs={12} md={5} lg={4}>
                <Box boxShadow={3} p={1} sx={{ height: '100%' }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                    Select Property Type & Range:
                  </Typography>

                  {showRange && (
                    <TableContainer
                      sx={{
                        maxHeight: 320,
                        width: '100%',
                        overflowY: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    >
                      <Table stickyHeader size="small" aria-label="range results">
                        <TableHead>
                          <TableRow sx={{
                            top: 0,
                            zIndex: 1,
                            bgcolor: 'background.paper',
                            position: 'sticky'
                          }}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isAllSelected}
                                indeterminate={isIndeterminate}
                                onChange={handleSelectAll}
                              />
                            </TableCell>
                            {['Ward No.', 'Property No.', 'Partition No.'].map((label) => (
                              <TableCell
                                key={label}

                              >
                                {label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {rangeResults.map((row) => (
                            <TableRow
                              key={`${row.NewWardNo}-${row.NewPropertyNo}-${row.NewPartitionNo ?? 0}`}
                              onClick={() => handleToggleRow(row)}
                              hover
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedRows.includes(keyOfRow(row))}
                                  onclick={() => handleToggleRow(row)}
                                />
                              </TableCell>

                              <TableCell>{row.NewWardNo}</TableCell>
                              <TableCell>{row.NewPropertyNo}</TableCell>
                              <TableCell>{row.NewPartitionNo === '0' ? '' : row.NewPartitionNo}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={7} lg={8}>
                <Grid container spacing={2}>
                  {/* Row 1: A, B */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>Photo A</Typography>
                      <Box
                        sx={{
                          height: IMG_MIN_H,                       // <-- fixed height
                          width: '100%',
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          backgroundColor: 'background.default'
                        }}
                      >
                        {img?.PropertyPathA ? (
                          <img
                            src={img.PropertyPathA}
                            alt="A"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">No preview</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>Photo B</Typography>
                      <Box
                        sx={{
                          height: IMG_MIN_H,                       // <-- fixed height
                          width: '100%',
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          backgroundColor: 'background.default'
                        }}
                      >

                        {img?.PropertyPathB ? (
                          <img
                            src={img.PropertyPathB}
                            alt="B"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">No preview</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Row 2: C, D */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>Photo C</Typography>
                      <Box
                        sx={{
                          height: IMG_MIN_H,                       // <-- fixed height
                          width: '100%',
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          backgroundColor: 'background.default'
                        }}
                      >
                        {img?.PropertyPathC ? (
                          <img
                            src={img.PropertyPathC}
                            alt="C"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">No preview</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>Photo D</Typography>
                      <Box
                        sx={{
                          height: IMG_MIN_H,                       // <-- fixed height
                          width: '100%',
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          backgroundColor: 'background.default'
                        }}
                      >
                        {img?.PropertyPathD ? (
                          <img
                            src={img.PropertyPathD}
                            alt="D"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">No preview</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Row 3: Plan (full width) */}
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>Plan Photo</Typography>
                      <Box
                        sx={{
                          height: IMG_MIN_H,                       // <-- fixed height
                          width: '100%',
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          backgroundColor: 'background.default'
                        }}
                      >
                        {img?.PlanPath ? (
                          <img
                            src={img.PlanPath}
                            alt="Plan"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">No preview</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>





          </MainCard>


          <MainCard>
            <Typography variant="h5" gutterBottom sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>
              Select Photo Or/And Plan To Set Clear:
            </Typography>
            <Grid container justifyContent="center" alignItems="center" mt={2}>
              <Grid
                item
                xs={12}
                mb={3}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
              >
                <FormGroup row alignItems="center" sx={{ gap: 6 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={imagesToDelete.PropertyPathA}
                        onChange={(e) =>
                          setImagesToDelete(p => ({ ...p, PropertyPathA: e.target.checked }))
                        }
                      />
                    }
                    label="Property Photo A"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={imagesToDelete.PropertyPathB}
                        onChange={(e) =>
                          setImagesToDelete(p => ({ ...p, PropertyPathB: e.target.checked }))
                        }
                      />
                    }
                    label="Property Photo B"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={imagesToDelete.PropertyPathC}
                        onChange={(e) =>
                          setImagesToDelete(p => ({ ...p, PropertyPathC: e.target.checked }))
                        }
                      />
                    }
                    label="Property Photo C"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={imagesToDelete.PropertyPathD}
                        onChange={(e) =>
                          setImagesToDelete(p => ({ ...p, PropertyPathD: e.target.checked }))
                        }
                      />
                    }
                    label="Property Photo D"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={imagesToDelete.PlanPath}
                        onChange={(e) =>
                          setImagesToDelete(p => ({ ...p, PlanPath: e.target.checked }))
                        }
                      />
                    }
                    label="Plan"
                  />
                </FormGroup>

              </Grid>

              <Grid
                container
                spacing={1}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}
              >


                <Button sx={{ marginRight: '5px' }} onClick={handleDeletePhotos} variant="contained" color="success">
                  Proceed
                </Button>
                <Button sx={{ marginLeft: '5px' }} onClick={handleClear} variant="contained" color="secondary">
                  Clear
                </Button>

              </Grid>

              {showSelect && (
                <Grid item xs={12} md={5} lg={12}>
                  <Box boxShadow={3} padding={1}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                      Properties Photo And Plan Details:
                    </Typography>
                    <Card>
                      <CardContent>
                        <Box sx={{ overflowX: 'auto', height: 350 }}>
                          <Table>
                            <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                              <TableRow>
                                <TableCell>Ward No.</TableCell>
                                <TableCell>Property No.</TableCell>
                                <TableCell>Partition No.</TableCell>
                                <TableCell>Property Photo A</TableCell>
                                <TableCell>Property Photo B</TableCell>
                                <TableCell>Property Photo C</TableCell>
                                <TableCell>Property Photo D</TableCell>
                                <TableCell>Plan Photo</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>27</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell>7</TableCell>
                                <TableCell>
                                  <Formik
                                    initialValues={{ files: null }}
                                    onSubmit={(values) => console.log('dropzone upload - ', values)}
                                    validationSchema={yup.object().shape({
                                      files: yup.mixed().required('Avatar is required.')
                                    })}
                                  >
                                    {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                                      <form onSubmit={handleSubmit}>
                                        <Grid container alignItems="center" spacing={1} justifyContent="center">
                                          <Grid item xs={12} md={2} lg={9}>
                                            <Stack spacing={1} alignItems="center">
                                              <UploadSingleFile
                                                setFieldValue={setFieldValue}
                                                file={values.files}
                                                error={touched.files && !!errors.files}
                                              />
                                            </Stack>
                                            {touched.files && errors.files && <FormHelperText error>{errors.files}</FormHelperText>}
                                          </Grid>
                                          <Grid item xs={12} md={10} lg={9}>
                                            {values.files && values.files.length > 0 && (
                                              <img src={URL.createObjectURL(values.files[0])} alt="Uploaded" />
                                            )}
                                          </Grid>
                                        </Grid>
                                      </form>
                                    )}
                                  </Formik>
                                </TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                              </TableRow>

                              <TableRow>
                                <TableCell>28</TableCell>
                                <TableCell>4</TableCell>
                                <TableCell>7</TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                              </TableRow>

                              <TableRow>
                                <TableCell>29</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>7</TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </CardContent>
                    </Card>

                    <Grid item xs={12} md={12} mt={3}>
                      <Formik
                        initialValues={{ files: null }}
                        onSubmit={(values) => console.log('dropzone upload - ', values)}
                        validationSchema={yup.object().shape({
                          files: yup.mixed().required('Avatar is required.')
                        })}
                      >
                        {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                          <form onSubmit={handleSubmit}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                              Upload Image:
                            </Typography>
                            <Accordion>
                              <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                                Upload Image
                              </AccordionSummary>
                              <AccordionDetails sx={{ flexDirection: 'column' }}>
                                <Grid container spacing={3}>
                                  {[0, 1, 2, 3].map((i) => (
                                    <Grid key={i} item xs={12} md={6} lg={3}>
                                      <Stack spacing={1.5} alignItems="center">
                                        <UploadSingleFile
                                          setFieldValue={setFieldValue}
                                          file={values.files}
                                          error={touched.files && !!errors.files}
                                        />
                                      </Stack>
                                      {touched.files && errors.files && <FormHelperText error>{errors.files}</FormHelperText>}
                                    </Grid>
                                  ))}
                                </Grid>
                              </AccordionDetails>
                            </Accordion>

                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
                              Plan:
                            </Typography>
                            <Accordion>
                              <AccordionSummary aria-controls="panel1-content" id="panel1-header" sx={{ fontWeight: 'bolder' }}>
                                Upload Plan
                              </AccordionSummary>
                              <AccordionDetails sx={{ flexDirection: 'column' }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} lg={12}>
                                    <Stack spacing={1.5} alignItems="center">
                                      <UploadSingleFile
                                        setFieldValue={setFieldValue}
                                        file={values.files}
                                        error={touched.files && !!errors.files}
                                        style={{ width: '100%', height: '100%' }}
                                      />
                                    </Stack>
                                    {touched.files && errors.files && <FormHelperText error>{errors.files}</FormHelperText>}
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          </form>
                        )}
                      </Formik>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          </MainCard>
        </TabPanel>
      </Box>
    </MainCard >
  );
}

export default UploadPlanAndPhoto;
