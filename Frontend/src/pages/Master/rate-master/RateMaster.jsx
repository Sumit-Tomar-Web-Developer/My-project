
import MainCard from 'components/MainCard';
import {
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Stack,
  Checkbox,
  Select,
  TextField,
  Box,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { saveAs } from 'file-saver';
import ExcelJS from "exceljs";
import { useEffect, useMemo, useState, useRef } from 'react';
import { fetchZoneSectionMasterList } from 'services/masterServices/zone-section-master-services/zone-section-master.services';
import { getZoneMasterList } from 'services/masterServices/zone-master-services.js/zone-master-services';
import { fetchConstructionType } from 'services/construction.services';
import {
  deleteRateMasterList,
  fetchRateMasterList,
  fetchRateRangeForType,
  fetchTypeOfUsePrime,
  getRateMasterInfo,
  postUpdateRateMasterList
} from 'services/masterServices/rate-master-services/rate-master.services';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPageIDByPageName } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService';
import { levelPassword } from 'services/CommonPasswordService/CommonPasswordService';


function RateMaster() {
  const [zoneSection, setZoneSection] = useState([]);
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [invalidYear, setInvalidYear] = useState();
  const [invalidYearMin, setInvalidYearMin] = useState();
  const [invalidYearMax, setInvalidYearMax] = useState();
  const [range, setRange] = useState([]);
  const [selectedRange, setSelectedRange] = useState('');
  const [selectedOption, setSelectedOption] = useState('multiplier');
  const [zoneList, setZoneList] = useState([]);
  // const [selectedZone,] = useState('');
  const [constructionTypeList, setConstructionTypeList] = useState([]);
  const [changedZoneSection, setChangedZoneSection] = useState('');
  const [postMinYear, setPostMinYear] = useState('');
  const [postMaxYear, setPostMaxYear] = useState('');
  const [rateInfo, setRateInfo] = useState({
    Year: '',
    IndustrialMultiplier: '',
    CommercialMultiplier: ''
  });
  const isUsingType = selectedOption === 'using-type';

  const [rates, setRates] = useState({});
  const [finalArray, setFinalArray] = useState([]);
  const [prevRateList, setPrevRateList] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [receivedStatus, setReceivedStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedZones, setSelectedZones] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  const [residentialChart, setResidentialChart] = useState([]);

  //set current page ID by oage name which is Active Taxes
  const [pageID, setPageID] = useState('');
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const [accessLevel, setAccessLevel] = useState(null);
  const [selectedType, setSelectedType] = useState('R');
  const [typeOptions, setTypeOptions] = useState([]);
  const [ratesByType, setRatesByType] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const [typeOfRate, setTypeOfRate] = useState('')


  const [rangeExists, setRangeExists] = useState('')
  const [loaderOpen, setLoaderOpen] = useState(false)


  //get page id for current pagea
  useEffect(() => {
    const getPageID = async () => {
      const pageName = 'Rate Master';
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
  const [zoneRows, setZoneRows] = useState([]);
  useEffect(() => {
    setZoneRows(
      zoneList.map(z => ({
        ZoneNo: z.ZoneNo,
        IndustrialMultiplier: z.IndustrialMultiplier ?? '', // from DB
        CommercialMultiplier: z.CommercialMultiplier ?? ''  // from DB
      }))
    );
  }, [zoneList]);
  const handleRowChange = (zoneNo, field, value) => {
    // optional: digits/decimal only
    // if (!/^\d*\.?\d*$/.test(value)) return;

    setZoneRows(prev =>
      prev.map(r => (r.ZoneNo === zoneNo ? { ...r, [field]: value } : r))
    );
  };


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

      console.log(access, 'assigned access to tax name Page');

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const handleSelectedRange = () => {
      const values = selectedRange.split('-');

      setPostMinYear(values[0]);
      setPostMaxYear(values[1]);

    };
    handleSelectedRange();
  }, [selectedRange]);

  const handleRateChange = (constructionId, zoneNo, rate) => {
    setRates((prevRates) => ({
      ...prevRates,
      [constructionId]: {
        ...prevRates[constructionId],
        [zoneNo]: rate || 0
      }
    }));
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceivedData((prevRateInfo) => ({
      ...prevRateInfo,
      [name]: value
    }));
    setRateInfo((prevRateInfo) => ({
      ...prevRateInfo,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchConstructionType().then((res) => setConstructionTypeList(res.data));

    getZoneMasterList().then((res) => {
      setZoneList(res.zoneList);
    });

    fetchZoneSectionMasterList().then((res) => setZoneSection(res.data));
  }, []);

  const handleMultiplierUsingTypeRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleAddButtonClick = () => {
    const minYearFloat = parseFloat(minYear);
    const maxYearFloat = parseFloat(maxYear);

    if (!isNaN(minYearFloat) && !isNaN(maxYearFloat)) {
      const newRange = `${minYearFloat} - ${maxYearFloat}`;
      setRange([...range, newRange]);
      setMinYear('');
      setMaxYear('');
    }
  };

  const handlePostRates = async () => {
    // throw to GUARANTEE we don't reach the POST on validation error
    const abort = (msg, status = 400) => {
      setReceivedStatus(status);
      setReceivedMessage(msg);
      setSnackbarOpen(true);
      throw new Error(`ABORT:${status}:${msg}`);
    };

    try {
      const zoneSectionNo = changedZoneSection;
      const yearStr = String(rateInfo?.Year ?? '').trim();
      const minYearNum = Number.parseInt(String(postMinYear ?? '').trim(), 10);
      const maxYearNum = Number.parseInt(String(postMaxYear ?? '').trim(), 10);
      const option = (selectedOption || '').toLowerCase(); // 'multiplier' | 'using-type'

      if (!typeOfRate) abort('Please select a Type of Rate.');
      if (!zoneSectionNo) abort('Please select a Zone Section.');
      if (!/^\d{4}$/.test(yearStr)) abort('Year must be exactly 4 digits.');
      if (!Number.isInteger(minYearNum) || !Number.isInteger(maxYearNum)) {
        abort('Min/Max Year must be numeric.');
      }
      if (minYearNum > maxYearNum) abort('Min Year cannot be greater than Max Year.');

      const allZoneNos = zoneRows.map(r => r.ZoneNo);

      if (option === 'multiplier') {
        if (!Array.isArray(selectedZones) || selectedZones.length === 0) {
          abort('Please select at least one Zone.');
        }
      } else if (option === 'using-type') {
        if (!selectedType) abort('Please select a Type of Use.');
      } else {
        abort('Invalid option. Choose "multiplier" or "using-type".');
      }

      const rowsByZone = new Map(zoneRows.map(r => [r.ZoneNo, r]));
      const zonesToProcess = option === 'multiplier' ? selectedZones : allZoneNos;

      const items = [];
      for (const zoneNo of zonesToProcess) {
        let ind = 1;
        let com = 1;

        if (option === 'multiplier') {
          const row = rowsByZone.get(zoneNo) || {};

          const hasInd =
            row.IndustrialMultiplier != null && row.IndustrialMultiplier !== '';
          const hasCom =
            row.CommercialMultiplier != null && row.CommercialMultiplier !== '';

          // If BOTH required, keep this:
          if (!hasInd || !hasCom) {
            abort(`Please enter valid multipliers for Zone ${zoneNo}.`);
          }

          ind = Number(row.IndustrialMultiplier);
          com = Number(row.CommercialMultiplier);

          if (!Number.isFinite(ind) || !Number.isFinite(com)) {
            abort(`Non-numeric multiplier for Zone ${zoneNo}.`);
          }
        }

        items.push({
          TypeOfRate: typeOfRate,                 // 'CV' | 'RV'
          ZoneSectionNo: zoneSectionNo,
          ZoneNo: zoneNo,
          Year: yearStr,
          MinYear: minYearNum,
          MaxYear: maxYearNum,
          IndustrialMultiplier: ind,
          CommercialMultiplier: com,
          ResidentialRateChart: Array.isArray(rates) ? rates : (rates ?? {}),
          TypeOfUseID: option === 'using-type' ? selectedType : null
        });
      }

      // Only runs if NO abort() happened above
      console.log('posting items:', items);
      setLoaderOpen(true)
      const { message, status } = await postUpdateRateMasterList(items);
      setLoaderOpen(false)
      setReceivedStatus(typeof status === 'number' ? status : 200);
      setReceivedMessage(message ?? 'Saved.');
      setSnackbarOpen(true);
      setChangedZoneSection('');
      setRange([]);
      setMinYear('');
      setMaxYear('');
      setSelectedZones([]);
      setRates([]);
      setPrevRateList([])
      setTypeOptions([]);

      setReceivedData({
        IndustrialMultiplier: '',
        CommercialMultiplier: ''
      });
      setRateInfo({
        Year: '',
        IndustrialMultiplier: '',
        CommercialMultiplier: '',
      });
      setZoneRows(
        zoneList.map(z => ({
          ZoneNo: z.ZoneNo,
          IndustrialMultiplier: '', // from DB
          CommercialMultiplier: ''  // from DB
        })))

      setRates({});
      setPrevRateList([])
    } catch (err) {
      const msg = String(err?.message ?? '');
      if (msg.startsWith('ABORT:')) return; // already showed snackbar
      console.error('Error In Posting', err);
      setReceivedStatus(500);
      setReceivedMessage('Something went wrong while posting rates.');
      setSnackbarOpen(true);
    }
  };


  // const handlePostRates = async () => {
  //   try {
  //     const { message, status } = await postUpdateRateMasterList({
  //       ZoneSectionNo: changedZoneSection,
  //       Year: rateInfo.Year,
  //       IndustrialMultiplier: rateInfo.IndustrialMultiplier,
  //       CommercialMultiplier: rateInfo.CommercialMultiplier,
  //       MinYear: parseInt(postMinYear),
  //       MaxYear: parseInt(postMaxYear),
  //       CommZone: selectedZones,
  //       ResidentialRateChart: rates
  //     });
  //     setReceivedStatus(status);
  //     setReceivedMessage(message);
  //     setSnackbarOpen(true);
  //   } catch (error) {
  //     console.error('Error In Posting');
  //   }
  // };




  const handleCancelButton = () => {
    setChangedZoneSection('');
    setRange([]);
    setMinYear('');
    setMaxYear('');
    setSelectedZones('');
    setRates([]);
    setTypeOptions([]);

    setReceivedData({
      IndustrialMultiplier: '',
      CommercialMultiplier: ''
    });
    setRateInfo({
      Year: '',
      IndustrialMultiplier: '',
      CommercialMultiplier: '',
    });
    setZoneRows(
      zoneList.map(z => ({
        ZoneNo: z.ZoneNo,
        IndustrialMultiplier: '', // from DB
        CommercialMultiplier: ''  // from DB
      })))

    setRates({});
    setPrevRateList([])
  };
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const handleExport = async () => {



    const workbook = new ExcelJS.Workbook();
    const sheetName = selectedTypeForRate === "R" ? "Editable Rates" : "Displayed Rates";
    const ws = workbook.addWorksheet(sheetName);

    // Zones to include (fallback to all if none selected)
    const zones = (selectedZones?.length
      ? zoneList.filter(z => selectedZones.includes(z.ZoneNo))
      : zoneList
    ) || [];

    // Define columns (first column is ConstructionId, then Zone columns)
    const columns = [
      { header: "ConstructionId", key: "ConstructionId", width: 16 },
      ...zones.map(z => ({
        header: `Zone ${z.ZoneNo}`,
        key: `Z_${z.ZoneNo}`,
        width: 12,
        style: { numFmt: "0.00" }, // numeric cells with 2 decimals
      })),
    ];
    ws.columns = columns;

    // Value getter based on current mode
    const getVal = (cid, zno) =>
      selectedTypeForRate === "R"
        ? getRateValue(cid, zno)
        : getDisplayedRate(cid, zno);

    // Add data rows
    for (const t of constructionTypeList) {
      const row = { ConstructionId: t.ConstructionId }; // (typo-safe alias)
      row.ConstructionId = t.ConstructionId;            // ensure key is set

      zones.forEach(z => {
        row[`Z_${z.ZoneNo}`] = toNumber(getVal(t.ConstructionId, z.ZoneNo));
      });

      ws.addRow(row);
    }

    // Header styling
    const headerRow = ws.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 20;
    ws.views = [{ state: "frozen", ySplit: 1 }];

    // Auto-fit columns (approximate)
    ws.columns.forEach((col) => {
      const headerLen = String(col.header ?? "").length;
      const maxCellLen = Math.max(
        ...ws.getColumn(col.key).values
          .filter(v => v != null)
          .map(v => String(v).length),
        headerLen
      );
      col.width = Math.min(Math.max(maxCellLen + 2, 10), 30);
    });


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName =
      selectedTypeForRate === "R"
        ? "ResidentialRates_Editable.xlsx"
        : "ResidentialRates_Displayed.xlsx";
    saveAs(blob, fileName);

  }

  useEffect(() => {
    if (rateInfo.Year.length !== 4 || !changedZoneSection) return;

    (async () => {
      try {
        const res = await fetchRateMasterList({
          TypeOfRate: typeOfRate,
          Year: rateInfo.Year,
          ZoneSectionNo: changedZoneSection
        });

        const d = res?.data ?? {};
        const chart = Array.isArray(d.ResidentialRateChart) ? d.ResidentialRateChart : [];
        const rci = Array.isArray(d.RateChartInfo) ? d.RateChartInfo : []; // <-- per-zone rows

        // 1) tables
        setPrevRateList(chart);
        setResidentialChart(chart);
        setReceivedData(d);

        // 2) build zone-wise multipliers from RateChartInfo
        // Ensure ZoneNo is a string so comparisons work with UI state
        const byZone = new Map(
          rci
            .filter((x) => x && x.CommMultiplierAppliedToZone != null)
            .map((x) => [
              String(x.CommMultiplierAppliedToZone),
              {
                IndustrialMultiplier: x.IndustrialMultiplier ?? '',
                CommercialMultiplier: x.CommercialMultiplier ?? '',
              }
            ])
        );

        // Use zoneList order if available; else derive from RateChartInfo
        const zonesOrder =
          (zoneList && zoneList.length
            ? zoneList.map(z => String(z.ZoneNo))
            : [...byZone.keys()]);

        setZoneRows(
          zonesOrder.map(zNo => ({
            ZoneNo: zNo,
            IndustrialMultiplier: byZone.get(zNo)?.IndustrialMultiplier ?? '',
            CommercialMultiplier: byZone.get(zNo)?.CommercialMultiplier ?? '',
          }))
        );

        // 3) (optional) global multipliers as fallback defaults
        // If your API returns top-level multipliers use them; else take from first RCI row
        const first = rci[0] || {};
        setRateInfo((prev) => ({
          ...prev,
          IndustrialMultiplier: d.IndustrialMultiplier ?? first.IndustrialMultiplier ?? '',
          CommercialMultiplier: d.CommercialMultiplier ?? first.CommercialMultiplier ?? '',
        }));

        // 4) selected zones (from server CommZone or from data)
        const commZones = Array.isArray(d.CommZone) ? d.CommZone.map(String) : zonesOrder;
        setSelectedZones(commZones);

        // 5) year ranges (if you use them)
        if (Array.isArray(d.YearRange) && d.YearRange.length > 0) {
          const yr = d.YearRange.map(x => x?.Year).filter(Boolean);
          setRange(yr);
          setSelectedRange(yr[0] ?? '');
        }
      } catch (e) {
        console.error('fetchRateMasterList failed:', e);
        setReceivedStatus(500);
        setReceivedMessage('Failed to fetch rate master.');
        setSnackbarOpen(true);
      }
    })();
  }, [rateInfo.Year, changedZoneSection, typeOfRate, zoneList]);

  const [rateRange, setRateRange] = useState({})
  useEffect(() => {
    const fetchRateRange = async () => {
      try {
        const res = await fetchRateRangeForType()
        console.log(res, 'fetchRateRange')
        setRateRange(res)
      } catch (error) {
        console.log(error, 'error in fetch range for rate')
      }
    }
    fetchRateRange()
  }, [])

  useEffect(() => {
    const allZoneNos = [...new Set(residentialChart.map((item) => item.ZoneNo))];
    let zoneArray = [];
    const zoneSelect = allZoneNos.map((zoneNo) => ({ ZoneNo: zoneNo }));
    zoneSelect.map((item) => zoneArray.push(item.ZoneNo));
    setSelectedZones(zoneArray);
  }, [receivedData]);

  const handleCheckboxChange = (zoneNo) => {
    if (selectedZones.includes(zoneNo)) {
      setSelectedZones(selectedZones.filter((zone) => zone !== zoneNo));
    } else {
      setSelectedZones([...selectedZones, zoneNo]);
    }
  };
  const handleSelectAll = () => {
    if (selectedZones.length === zoneList.length) {
      setSelectedZones([]);
    } else {
      const allZoneNos = zoneList.map((zone) => zone.ZoneNo);
      setSelectedZones(allZoneNos);
    }
  };

  useEffect(() => {
    if (receivedData.YearRange && receivedData.YearRange.length > 0) {
      setSelectedRange(receivedData.YearRange[0].Year);
      setRange([receivedData.YearRange[0].Year]);
    }
  }, [receivedData]);

  // console.log(receivedData)

  const handleDeleteRates = async () => {
    if (!rateInfo.Year || rateInfo.Year.length !== 4) {
      setReceivedStatus(status);
      setReceivedMessage('Please select a valid year');
      setSnackbarOpen(true);
      return
    } else if (!typeOfRate) {
      setReceivedStatus(500);
      setReceivedMessage('Please select a Type Of Rate');
      setSnackbarOpen(true);
      return
    } else if (!changedZoneSection) {
      setReceivedStatus(500);
      setReceivedMessage('Please select a Zone Section');
      setSnackbarOpen(true);
    }
    try {
      console.log('delete is running')
      const data = {
        Year: parseInt(rateInfo.Year),
        Type: typeOfRate,
        ZoneSection: changedZoneSection
      }
      const { message, status } = await deleteRateMasterList(data);
      if (status == 200 || status == 'Ok') {
        setReceivedStatus(status);
        setReceivedMessage('records deleted succesfully');
        setSnackbarOpen(true);
        handleCancelButton();
      }
      else {
        setReceivedStatus(status);
        setReceivedMessage('Year Not Exists to delete');
        setSnackbarOpen(true);
        handleCancelButton();
      }
    } catch (error) {
      console.error('Error In Deleting');
    }
  };
  //type
  useEffect(() => {
    const fetchTypeOfUse = async () => {
      try {
        const fetchedTypeOfUse = await fetchTypeOfUsePrime();
        const typeOnly = fetchedTypeOfUse.map(item => item.Type);
        setTypeOptions(typeOnly);
      } catch (error) {
        console.error('Error fetching type of use:', error);
        setTypeOptions([]);
      }
    };

    fetchTypeOfUse();
  }, []);

  // useEffect(() => {
  //   const fetchRateMasterByType = async () => {
  //     // only proceed if user selected "using-type" and all required fields are filled
  //     if (
  //       selectedOption === 'using-type' &&
  //       rateInfo.Year &&
  //       selectedType &&
  //       selectedZones.length > 0
  //     ) {
  //       try {
  //         const res = await getRateMasterInfo(
  //           parseInt(rateInfo.Year),
  //           selectedType,
  //           selectedZones
  //         );

  //         if (res?.data) {
  //           setRatesByType(res.data); // fill the rate list table
  //         } else {
  //           setRatesByType([]); // fallback if no data
  //         }
  //       } catch (error) {
  //         console.error('Error fetching rate master info by type:', error);
  //         setRatesByType([]);
  //       }
  //     }
  //   };

  //   fetchRateMasterByType();
  // }, [selectedOption, rateInfo.Year, selectedType, selectedZones]);


  //getting type of use


  // useEffect(() => {
  //   const fetchAllDataTypeOfUse = async () => {
  //     try {
  //       const fetchAllDataTypeOfUse = await getRateMasterInfo(rateInfo.Year, selectedType, selectedZones);
  //       console.log(fetchAllDataTypeOfUse, 'type list');
  //      // setTypeOptions(fetchedTypeOfUse);
  //     } catch (error) {
  //       console.error('Error fetching type of use:', error);
  //       setTypeOptions([]);
  //     }
  //   };

  //   fetchAllDataTypeOfUse();
  // }, [rateInfo.Year, selectedType, selectedZones]);

  // const handleTypeChange = async (type) => {
  //   setSelectedType(type);

  //   try {
  //     const payload = {
  //       Year: rateInfo.Year,
  //       TypeOfUseID: type,
  //       ZoneNos: zoneList.map((z) => z.ZoneNo) // send all zone numbers
  //     };

  //     const res = await fetchRateMasterList(payload); // ye API aapke controller me already hai

  //     if (res?.data?.data) {
  //       setRatesByType(res.data.data); // store rates separately
  //     }
  //   } catch (error) {
  //     console.error('Error fetching rates by type:', error);
  //   }
  // };
  const handleUpdateRateByType = (index, newRate) => {
    const updatedRates = [...ratesByType];
    updatedRates[index].RateSquareMeter = newRate;
    setRatesByType(updatedRates);
  };
  // useEffect(() => {
  //   if (rateInfo.Year.length === 4 && changedZoneSection != 0) {
  //     fetchRateMasterList({
  //       Year: rateInfo.Year,
  //       ZoneSectionNo: changedZoneSection
  //     }).then((res) => {
  //       setPrevRateList(res.data.ResidentialRateChart);
  //       setReceivedData(res.data);
  //       setResidentialChart(res.data.ResidentialRateChart);
  //     });
  //   }
  // }, [rateInfo.Year]);

  useEffect(() => {
    // guard: need valid numbers to compare
    if (!minYear || !maxYear) return;
    const newMin = Number(minYear);
    const newMax = Number(maxYear);
    if (Number.isNaN(newMin) || Number.isNaN(newMax)) return;

    const option = (selectedOption || '').toLowerCase();
    const rows = Object.values(rateRange || {});
    const sameSection = rows.filter(r => String(r.ZoneSectionNo) === String(changedZoneSection));

    // when using-type, also match TypeOfUseID
    const scope = option === 'using-type'
      ? sameSection.filter(r => String(r.TypeOfUseID) === String(selectedType))
      : sameSection;

    const overlaps = (aMin, aMax, bMin, bMax) => aMin <= bMax && bMin <= aMax;

    // any row whose [MinYear, MaxYear] overlaps with the new [minYear, maxYear]
    const conflict = scope.find(r => {
      const rMin = Number(r.MinYear);
      const rMax = Number(r.MaxYear);
      if (Number.isNaN(rMin) || Number.isNaN(rMax)) return false;
      return overlaps(rMin, rMax, newMin, newMax);
    });

    if (conflict) {
      setRangeExists(true);
      setReceivedMessage('Rate already exists or overlaps with the selected range.');
      setReceivedStatus(500);
      setSnackbarOpen(true);
    } else {
      setRangeExists(false);
    }
  }, [minYear, maxYear, selectedOption, rateRange, changedZoneSection, selectedType]);
  const [selectedTypeForRate, setSelectedTypeForRate] = useState('R')
  const toNum = (v) => Number(v ?? 0) || 0;
  const zoneMultByNo = useMemo(() => {
    const m = {};
    for (const r of zoneRows) {
      const zone = String(r.ZoneNo);
      m[zone] = {
        ind: toNum(r.IndustrialMultiplier) || toNum(rateInfo.IndustrialMultiplier) || 1,
        com: toNum(r.CommercialMultiplier) || toNum(rateInfo.CommercialMultiplier) || 1,
      };
    }
    return m;
  }, [zoneRows, rateInfo.IndustrialMultiplier, rateInfo.CommercialMultiplier]);
  const getBaseRate = (constructionId, zoneNo) => {
    const z = String(zoneNo);
    const base =
      rates?.[constructionId]?.[z] ??
      prevRateList.find(
        (r) => String(r.ConstructionID) === String(constructionId) && String(r.ZoneNo) === z
      )?.Rate ??
      '';
    return base;
  };
  const getDisplayedRate = (constructionId, zoneNo) => {
    const base = toNum(getBaseRate(constructionId, zoneNo));
    if (!base) return '';

    const mult =
      selectedTypeForRate === 'C'
        ? (zoneMultByNo[String(zoneNo)]?.com || 1)
        : selectedTypeForRate === 'I'
          ? (zoneMultByNo[String(zoneNo)]?.ind || 1)
          : 1; // 'R' or anything else → no multiplier

    // if (selectedTypeForRate !== 'R' && base > 0) {
    //   return `(${base} * ${mult}) = ${base * mult}`;
    // }
    if (selectedTypeForRate !== 'R' && base > 0) {
      return (base * mult).toFixed(2); // e.g. "150.00"
    }
    return '';
  };

  const getRateValue = (cId, zNo) => {
    const row = rates[cId];

    // If this zone key exists in local state, return it even if it's '' or 0
    if (row && Object.prototype.hasOwnProperty.call(row, zNo)) {
      return row[zNo];
    }

    // Otherwise fall back to server value (allow 0 with ??)
    const srv = prevRateList.find(r => r.ConstructionID === cId && r.ZoneNo === zNo);
    return srv?.Rate ?? '';
  };
  const serverRateIndex = useMemo(() => {
    const m = new Map();
    (prevRateList || []).forEach(r => {
      m.set(`${r.ConstructionID}|${r.ZoneNo}`, r.Rate);
    });
    return m;
  }, [prevRateList]);

  // resolve value for a cell: prefer local edit if the key exists, else server, else ''
  const getCellValue = (cId, zNo) => {
    const row = rates[cId];
    if (row && Object.prototype.hasOwnProperty.call(row, zNo)) {
      return row[zNo]; // keep as string while typing
    }
    const srv = serverRateIndex.get(`${cId}|${zNo}`);
    return srv ?? ''; // allow 0 from server
  };

  // (optional) seed local rates once from server so fields are controlled immediately
  useEffect(() => {
    setRates(prev => {
      const next = { ...prev };
      (prevRateList || []).forEach(r => {
        const c = r.ConstructionID, z = r.ZoneNo;
        if (!next[c] || !Object.prototype.hasOwnProperty.call(next[c], z)) {
          next[c] = { ...(next[c] || {}), [z]: String(r.Rate ?? '') };
        }
      });
      return next;
    });
  }, [prevRateList]);

  // useEffect(() => {
  //   setRates((prevRates) => ({
  //     ...prevRates,
  //     [constructionId]: {
  //       ...prevRates[constructionId],
  //       [zoneNo]: rate
  //     }
  //   }));
  // }, selectedTypeForRate)
  const [actionType, setActionType] = useState('')
  const [openDialog, setOpenDialog] = useState('')
  const [password, setLevelPassword] = useState('')
  const handleAction = async () => {


    try {
      console.log(password, 'password');
      const IsPasswordValid = await levelPassword('L2', password);
      if (IsPasswordValid.response.status === 200) {
        handleCloseDialog();
        setLevelPassword('');
        if (actionType === 'Save') {
          handlePostRates()
          setActionType('')
        }
        else {
          handleDeleteRates()
          setActionType('')
        }
      }

    } catch {
      setReceivedMessage('Incorrect password')
      setReceivedStatus(500)
      setSnackbarOpen(true)
    }
  }

  const handleClickDialog = (type) => {

    setActionType(type);
    setOpenDialog(true);

  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setLevelPassword('');
  };


  return (
    <>
      {' '}
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
        <MainCard title="Rate Master">
          <Box display="flex" justifyContent="center" mt={3}>
            <Box
              sx={{
                border: '0.5px solid lightgrey',
                backgroundColor: 'blu',
                maxWidth: '600px', // smaller container
                width: '100%',
                p: 2,
                borderRadius: 2,
                // backgroundColor: '#95c4ebec' // optional for visibility
              }}
            >
              {/* Type Of Rate + Zone Section */}
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={5}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Type Of Rate</InputLabel>
                  <Select
                    fullWidth
                    size="small"
                    value={typeOfRate}
                    onChange={(e) => setTypeOfRate(e.target.value)}
                    disabled={accessLevel < 3}
                  >
                    <MenuItem value="CV">CV</MenuItem>
                    <MenuItem value="RV">RV</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Zone Section</InputLabel>
                  <Select
                    fullWidth
                    size="small"
                    value={changedZoneSection}
                    onChange={(e) => setChangedZoneSection(e.target.value)}
                    disabled={accessLevel < 3}
                  >
                    {zoneSection.map((section) => (
                      <MenuItem key={section.ZoneSectionNo} value={section.ZoneSectionNo}>
                        {section.ZoneSectionNo}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              {/* Year, Min Year, Max Year */}
              <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2}>
                <Grid item xs={12} sm={4}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Year</InputLabel>
                  <TextField
                    size="small"
                    value={rateInfo.Year}
                    onChange={(e) => {
                      const value = e.target.value;
                      // allow only digits and max 4 digits
                      if (/^\d{0,4}$/.test(value)) {
                        handleInputChange({ target: { name: 'Year', value } });
                        setInvalidYear(value.length > 0 && value.length < 4);
                      }
                    }}
                    onBlur={() => setInvalidYear(rateInfo.Year.length > 0 && rateInfo.Year.length < 4)}
                    inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                    fullWidth
                    error={invalidYear}
                    helperText={invalidYear ? 'Year must be 4 digits' : ''}
                    disabled={accessLevel < 3}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Min Year</InputLabel>
                  <TextField
                    size="small"
                    value={minYear}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,4}$/.test(value)) {
                        setMinYear(value);
                        setInvalidYearMin(value.length > 0 && value.length < 4);
                      }
                    }}
                    onBlur={() => setInvalidYearMin(minYear.length > 0 && minYear.length < 4)}
                    inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                    fullWidth
                    error={invalidYearMin}
                    helperText={invalidYearMin ? 'Year must be 4 digits' : ''}
                    disabled={accessLevel < 3}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Max Year</InputLabel>
                  <TextField
                    size="small"
                    value={maxYear}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,4}$/.test(value)) {
                        setMaxYear(value);
                        setInvalidYearMax(value.length > 0 && value.length < 4);
                      }
                    }}
                    onBlur={() => setInvalidYearMax(maxYear.length > 0 && maxYear.length < 4)}
                    inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                    fullWidth
                    error={invalidYearMax}
                    helperText={invalidYearMax ? 'Year must be 4 digits' : ''}
                    disabled={accessLevel < 3}
                  />
                </Grid>
              </Grid>

              {/* Add Button */}
              <Grid container justifyContent="center" mt={2}>
                <Button variant="contained" color="primary" onClick={handleAddButtonClick} size="small" disabled={rangeExists || minYear === '' || maxYear === '' || minYear > maxYear}>
                  Add
                </Button>
              </Grid>

              {/* Range (after Add) */}
              <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2}>
                <Grid item xs={12} sm={5}>
                  <InputLabel sx={{ fontWeight: 'bolder' }}>Range</InputLabel>
                  <Select
                    fullWidth
                    size="small"
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value)}
                    disabled={accessLevel < 3}
                  >
                    {range.map((rangeItem, index) => (
                      <MenuItem key={index} value={rangeItem}>
                        {rangeItem}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                marginLeft: '5px',
                border: '0.5px solid lightgrey',
                backgroundColor: 'blu',
                maxWidth: '600px', // smaller container
                width: '100%',
                p: 2,
                borderRadius: 2,
                // backgroundColor: '#95c4ebec' // optional for visibility
              }}>
              <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
                Criteria :
              </Typography>
              <Grid>
                <RadioGroup value={selectedOption} aria-label="option" onChange={handleMultiplierUsingTypeRadioChange} row>
                  <FormControlLabel value="multiplier" control={<Radio />} label="Multiplier" />
                  <FormControlLabel value="using-type" control={<Radio />} label="Using Type" />
                </RadioGroup>
              </Grid>
              {selectedOption === 'multiplier' ? <TableContainer sx={{ mt: 3, height: '30vh' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '5vw' }}>
                        <Checkbox
                          indeterminate={selectedZones.length > 0 && selectedZones.length < zoneRows.length}
                          checked={zoneRows.length > 0 && selectedZones.length === zoneRows.length}
                          onChange={handleSelectAll}
                          disabled={accessLevel < 3}
                        />
                      </TableCell>
                      <TableCell>Zones</TableCell>
                      <TableCell>Industrial Multiplier</TableCell>
                      <TableCell>Commercial Multiplier</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {zoneRows.map((row) => (
                      <TableRow key={row.ZoneNo}>
                        <TableCell>
                          <Checkbox
                            checked={selectedZones.includes(row.ZoneNo)}
                            onChange={() => handleCheckboxChange(row.ZoneNo)}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>

                        <TableCell>{row.ZoneNo}</TableCell>

                        <TableCell>
                          <TextField
                            name="IndustrialMultiplier"
                            value={row.IndustrialMultiplier}
                            onChange={(e) => {
                              const val = e.target.value;

                              // Allow numbers with optional decimal part up to 2 digits
                              if (/^\d{0,1}(\.\d{0,2})?$/.test(val)) {
                                handleRowChange(row.ZoneNo, 'IndustrialMultiplier', val)
                              }
                            }}
                            inputProps={{
                              inputMode: "decimal",       // mobile numeric keyboard with decimal
                              pattern: "[0-9]*[.,]?[0-9]{0,2}" // HTML validation for 2 decimals
                            }}

                            disabled={selectedOption === 'using-type' || accessLevel < 3}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            name="CommercialMultiplier"
                            value={row.CommercialMultiplier}
                            onChange={(e) => {
                              const val = e.target.value;

                              // Allow numbers with optional decimal part up to 2 digits
                              if (/^\d{0,1}(\.\d{0,2})?$/.test(val)) {
                                handleRowChange(row.ZoneNo, 'CommercialMultiplier', val)
                              }
                            }}
                            inputProps={{
                              inputMode: "decimal",       // mobile numeric keyboard with decimal
                              pattern: "[0-9]*[.,]?[0-9]{0,2}" // HTML validation for 2 decimals
                            }}

                            disabled={selectedOption === 'using-type' || accessLevel < 3}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer> : <Stack item xs={2} spacing={4} direction={'row'} alignItems={'center'} mt={2} ml={12.5}>
                {/* {handleSelectAll()} */}
                <InputLabel sx={{ fontWeight: 'bolder' }} disabled={selectedOption === 'multiplier'}>
                  Type
                </InputLabel>
                <Select
                  sx={{ minWidth: '11vw' }}
                  displayEmpty
                  disabled={accessLevel < 3}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <MenuItem value="" disabled>Select Type</MenuItem>
                  {typeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>}
            </Box>
          </Box>







          <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}></Grid>
          {selectedOption === 'multiplier' && (<Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Rate List By Type:
            <Select
              sx={{ minWidth: '10vw', marginLeft: '5px', height: '2.5vw' }}
              displayEmpt
              disabled={accessLevel < 3}
              value={selectedTypeForRate}
              onChange={(e) => setSelectedTypeForRate(e.target.value)}
            >

              {typeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Typography>)}
          {selectedOption === 'using-type' && (<Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue', fontWeight: 'bold' }}>
            Rate List:

          </Typography>)}
          {selectedOption === 'multiplier' && (

            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Construction Type / Zone No</TableCell>
                    {zoneList.map((zones, index) => (
                      <TableCell key={index}>{zones.ZoneNo}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {constructionTypeList.map((type, index) => (
                    <TableRow key={index}>
                      <TableCell>{type.ConstructionId}</TableCell>
                      {zoneList.map((zones, idx) => (
                        <TableCell key={idx}>
                          <TextField
                            onChange={(e) => handleRateChange(type.ConstructionId, zones.ZoneNo, e.target.value)}
                            value={
                              selectedTypeForRate === 'R'
                                ? getRateValue(type.ConstructionId, zones.ZoneNo)
                                : getDisplayedRate(type.ConstructionId, zones.ZoneNo)
                            }
                            inputProps={{ readOnly: selectedTypeForRate !== "R" }}
                            disabled={accessLevel < 3 || !selectedZones.includes(zones.ZoneNo)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {selectedOption === 'using-type' && (
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Construction Type / Zone No</TableCell>
                    {zoneList.map((zones, index) => (
                      <TableCell key={index}>{zones.ZoneNo}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {constructionTypeList.map((type, index) => (
                    <TableRow key={index}>
                      <TableCell>{type.ConstructionId}</TableCell>
                      {zoneList.map((zones, idx) => (
                        <TableCell key={idx}>
                          <TextField
                            onChange={(e) => handleRateChange(type.ConstructionId, zones.ZoneNo, e.target.value)}
                            value={getCellValue(type.ConstructionId, zones.ZoneNo)}
                            disabled={accessLevel < 3}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}


          <Grid item xs={12} style={{ textAlign: 'center' }} mt={3}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <Button variant="contained" onClick={(e) => handleClickDialog('Save')} disabled={accessLevel < 3 || rangeExists}>
                Save Rates
              </Button>
              <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                <DialogTitle id="alert-dialog-title">L2</DialogTitle>
                <DialogContent>
                  <Stack marginBottom={2}>
                    <DialogContentText id="alert-dialog-description">Enter Security Password</DialogContentText>
                  </Stack>
                  <TextField
                    required
                    fullWidth
                    maxWidth="sm"
                    type="password"
                    value={password}
                    onChange={(e) => setLevelPassword(e.target.value)}
                    autoComplete="new-password"
                    inputProps={{
                      autoSave: 'off',
                      form: {
                        autoComplete: 'off',
                      },
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="success" onClick={handleAction} autoFocus>
                    Ok
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleCloseDialog} autoFocus>
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
              <Button variant="contained" color="error" onClick={handleClickDialog} disabled={accessLevel < 4}>
                Delete
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCancelButton} disabled={accessLevel < 3}>
                Clear
              </Button>
              <Button variant="contained" color="success" onClick={handleExport} disabled={accessLevel < 3}>
                Export Rates
              </Button>
            </Stack>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={receivedStatus == 200 || receivedStatus == 201 ? 'success' : receivedStatus == 202 ? 'info' : 'error'}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {receivedMessage}
            </Alert>
          </Snackbar>
          <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={loaderOpen}
          // onClick={handleCloseLoader}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </MainCard>
      )}
    </>
  );
}

export default RateMaster;
