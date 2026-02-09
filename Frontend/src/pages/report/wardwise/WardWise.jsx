// material-ui
import dayjs from "dayjs";

import {
  Grid,
  Checkbox,
  FormLabel,
  Box,
  InputLabel,
  Stack,
  Select,
  MenuItem,
  FormControlLabel,
  FormControl,
  Typography,
  ListItemText,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { useState } from 'react';
import * as XLSX from "xlsx";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fetchPropertyDescription } from 'services/data-entry.services';
import { useEffect } from 'react';
import {  fetchAdvanceCollection, fetchCurrentOutstanding, fetchMiscellaneousFee, fetchTransByOwnerId, getCurrentCollection, getOwnersByWardAndPropertyDesc, getPendingCollection, getPendingOutstanding, getPendingTaxByOwnerAndYear } from 'services/report/wardWiseService/wardWsieService.js';
import { fetchFinancialYear, fetchWardList } from 'services/appeal.services';

// ==============================|| SAMPLE PAGE ||============================== //

function WardWise() {
  const [selectDemand, setSelectDemand] = useState('');

  const [financeYear, setFinanceYear] = useState('');
  const [selectDate, setSelectDate] = useState('');
  const [propertyDesc, setPropertyDesc] = useState([]);

  const [allWard, setAllWard] = useState([]);
  const [selectField, setSelectField] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  const [selectedWard, setSelectedWard] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [srNo, setSrNo] = useState(false);
const [ward, setWard] = useState(false);        
const [noOfProperty, setNoOfProperty] = useState(false);
const [year, setYear] = useState(false);
const [oldRv, setOldRv] = useState(false);
const [oldTax, setOldTax] = useState(false);
const [oldPropTax, setOldPropTax] = useState(false);
const [newRv, setNewRv] = useState(false);
const [newTax, setNewTax] = useState(false);

const [newPropTax, setNewPropTax] = useState(false);
const [propertyTax, setPropertyTax] = useState(false);
const [employmentTax, setEmploymentTax] = useState(false);
const [spEducationTax, setSpEducationTax] = useState(false);
const [treeCess, setTreeCess] = useState(false);
const [fireCess, setFireCess] = useState(false);
const [drainCess, setDrainCess] = useState(false);
const [roadTax, setRoadTax] = useState(false);
const [lightTax, setLightTax] = useState(false);
const [sanitationTax, setSanitationTax] = useState(false);
const [spWater, setSpWater] = useState(false);
const [waterBill, setWaterBill] = useState(false);
const [spEducationBill, setSpEducationBill] = useState(false);
const [sewageDisp, setSewageDisp] = useState(false);
const [majorBuilding, setMajorBuilding] = useState(false);
const [tax1, setTax1] = useState(false);
const [tax2, setTax2] = useState(false);
const [tax3, setTax3] = useState(false);
const [tax4, setTax4] = useState(false);
const [tax5, setTax5] = useState(false);
const [miscFee, setMiscFee] = useState(false);
const [interest, setInterest] = useState(false);
const [noticeFee, setNoticeFee] = useState(false);
const [warrentFee, setWarrentFee] = useState(false);
const [netTotal, setNetTotal] = useState(false)
//Datepicker state
  const [value, setValue] = useState(null);

  //ward number array
  const [wardList, setWardList] = useState([]);
  const [financialYearList, setFinancialYearList] = useState([]);
  const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);

  useEffect(() => {
    fetchFinancialYear()
      .then((finList) => {
        setFinancialYearList(finList);
      })
      .catch((error) => {
        console.error('Error fetching financial list:', error);
    });

  }, []);
  useEffect(() => {
    fetchWardList()
      .then((finList) => setWardList(finList))
      .catch((error) => console.error('Error fetching wards:', error));
  }, []);

  //property description array
  const [propertyDescArray, setpropertyDescArray] = useState([]);
//get property description
useEffect(() => {
  fetchPropertyDescription()
    .then((fetchproperty) => {
      console.log(fetchproperty, 'fetchproperty');
      setpropertyDescArray(fetchproperty);
    })
    .catch((error) => {
      console.error('Error fetching property description:', error);
    });
}, []);
 
const handleFinanceYearChange = (value) => {
  setFinanceYear(value);

  if (value) {
    const [startYear, endYear] = value.split("-");

    // From Date = 1st April of startYear
    setFromDate(dayjs(`${startYear}-04-01`));

    // To Date = 31st March of endYear
    setToDate(dayjs(`${endYear}-03-31`));
  } else {
    setFromDate(null);
    setToDate(null);
  }
};


  const handleCheckboxChange = (value) => {
    if (selectedWard.includes(value)) {
      setSelectedWard(selectedWard.filter((ward) => ward !== value));
    } else {
      setSelectedWard([...selectedWard, value]);
    }
  };

  
const handleWardChange = (event) => {
  const value = event.target.value;

  if (value.includes("ALL")) {
    if (allWard.length === wardList.length) {
      setAllWard([]); 
      setSelectAll(false);
    } else {
      setAllWard(wardList.map((w) => w.NewWardNo));
      setSelectAll(true);
    }
  } else {
    setAllWard(value);
    setSelectAll(value.length === wardList.length);
  }
};

  const handleAllWardsChange = (event) => {
    const { checked } = event.target;
    setSelectAll(checked);
    if (checked) {
      setAllWard(wardList.map((wd) => wd.NewWardNo));
    } else {
      setAllWard([]);
    }
  };

  //for property description select
  const HandlePropertyDescChange = (propertyindex) => {
    const updatedSelectedDesc = [...propertyDesc];

    // Check if the clicked checkbox is already selected
    const currentIndex = updatedSelectedDesc.indexOf(propertyindex);

    // If it's not selected, add it to the selected checkboxes array
    // If it's already selected, remove it from the selected checkboxes array
    if (currentIndex === -1) {
      updatedSelectedDesc.push(propertyindex);
    } else {
      updatedSelectedDesc.splice(currentIndex, 1);
    }

    setPropertyDesc(updatedSelectedDesc);
  };
  const [showTable, setShowTable] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [actualCollectionData, setactualCollectionData] = useState([]);
  const [preAdvanceCollectionData, setPreAdvanceCollectionData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [pendingTotalData, setPendingTotalData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
const [currentCollectionData, setCurrentCollectionData] = useState([]);
const [totalCurrentCollection, setTotalCurrentCollection] = useState([]);
const [PendingCollectionData, setPendingCollectionData] = useState([]);
const [totalPendingCollection, setTotalPendingCollection] = useState([]);
const [currentOutstandingData, setCurrentOutstandingData] = useState([]);
const [totalCurrentOutstanding, setTotalCurrentOutstanding] = useState([]);
const [pendingOutstandingData, setPendingOutstandingData] = useState([]);
const [totalPendingOutstanding, setTotalPendingOutstanding] = useState([]);
const [advanceCollectionData, setAdvanceCollectionData] = useState([]);
const [totalAdvanceCollection, setTotalAdvanceCollection] = useState([]);

const [miscTableData, setMiscTableData] = useState([]);
// Totals for Collections
const [collectionTotalData, setCollectionTotalData] = useState([]);
const [pendingCollectionTotalData, setPendingCollectionTotalData] = useState([]);
const [combinedData, setCombinedData] = useState([]);  
const [combinedCollectionData, setCombinedCollectionData] = useState([]);  
const [loading, setLoading] = useState(false);
  const [isMisc, setIsMisc] = useState(false);
  const [combinedGhoshwaraData, setCombinedGhoshwaraData] = useState([]);  
  const [showGhoshwaraTable, setShowGhoshwaraTable] = useState(false);
  const [combinedOutstandingData, setCombinedOutstandingData] = useState([]);  
  const [totalOutstandingData, setTotalOutstandingData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const handleShowClick = async () => {
    // 1️⃣ Validation: at least one ward and one property
    if (allWard.length === 0 || propertyDesc.length === 0 || selectDemand.length ===0 || financeYear.length ===0) {
      setOpenDialog(true);
      return;
    }
    setLoading(true);
    try {
      // 2️⃣ Fetch owners for selected wards & property types
      const ownersResponse = await getOwnersByWardAndPropertyDesc({
        wardNo: allWard.map(Number),       // convert strings to numbers
        propertyTypeID: propertyDesc.map(Number),
        financialYear: financeYear, 
      });
      console.log("allWard:", allWard);
      console.log("propertyDesc:", propertyDesc);
      console.log("financeYear:", financeYear);
      console.log("ownersResponse:", ownersResponse);
      // 3️⃣ Normalize owners array
      const ownersArray = Array.isArray(ownersResponse.details)
        ? ownersResponse.details
        : Array.isArray(ownersResponse.ownerIds)
          ? ownersResponse.ownerIds.map(id => ({ OwnerID: id }))
          : [];
  
      if (ownersArray.length === 0) {
        console.warn("No owners found for selection");
        setCurrentData([]);
        setTotalData([]);
        setPendingData([]);
        setPendingTotalData([]);
        setCurrentCollectionData([]);
        setTotalCurrentCollection([]);
        return;
      }
  
      // 4️⃣ Determine finance year start
      let startYear;
      if (financeYear && financeYear.includes("-")) {
        [startYear] = financeYear.split("-");
        startYear = parseInt(startYear);
      } else {
        const today = new Date();
        startYear = today.getMonth() + 1 >= 4 ? today.getFullYear() : today.getFullYear() - 1;
      }
        // 🔹 Step : Prepare ownerIDs

      const ownerIDs = ownersArray.map(o => o.OwnerID);
  
      // 5️⃣  Fetch Current Demand
      if (selectDemand === "Current Demand" ) {
        const transactions = await fetchTransByOwnerId(ownerIDs, startYear);
  
        // 🟩 Merge owner details into transactions
        const mergedData = transactions.map((item) => {
          const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);
          return {
            ...item,
            OwnerName: owner?.OwnerName || "",
            NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
            NewWardNo: owner?.NewWardNo || item.WardNo,
            Year: financeYear,
          };
        });
  
        // 🟦 Handle multiple ward selection properly
        const splitCurrentDemand = mergedData.flatMap((row) => {
          if (row.NewWardNo && row.NewWardNo.includes(",")) {
            return row.NewWardNo.split(",").map((ward) => ({
              ...row,
              NewWardNo: ward.trim(),
            }));
          }
          return row;
        });
  
        // 🟨 Group data ward-wise
        const currentGrouped = splitCurrentDemand.reduce((acc, row) => {
          if (!acc[row.NewWardNo]) acc[row.NewWardNo] = [];
          acc[row.NewWardNo].push(row);
          return acc;
        }, {});
  
        // 🧾 Merge data & count total properties per ward
        const finalCurrent = [];
        Object.values(currentGrouped).forEach((rows) => {
          const totalProp = rows.length;
          rows.forEach((row, index) => {
            finalCurrent.push({
              ...row,
              TotalProperty: index === 0 ? totalProp : "",
            });
          });
        });
  
        // 🧮 Calculate grand totals (one single “Total” row)
        const uniqueProperties = new Set(
          finalCurrent.map((i) => (i.NewPropertyNo ?? i.PropertyNo ?? "").toString().trim())
        );
        const totalPropertyCount = uniqueProperties.size;
  
        const totalRow = finalCurrent.reduce(
          (acc, item) => {
            acc.PropertyTax += Number(item.PropertyTax) || 0;
            acc.EducationTax += Number(item.EducationTax) || 0;
            acc.EmploymentTax += Number(item.EmploymentTax) || 0;
            acc.SpEducationTax += Number(item.SpEducationTax) || 0;
            acc.TreeCess += Number(item.TreeCess) || 0;
            acc.Sanitation += Number(item.Sanitation) || 0;
            acc.DrainCess += Number(item.DrainCess) || 0;
            acc.SpWaterCess += Number(item.SpWaterCess) || 0;
            acc.RoadCess += Number(item.RoadCess) || 0;
            acc.FireCess += Number(item.FireCess) || 0;
            acc.LightCess += Number(item.LightCess) || 0;
            acc.WaterBill += Number(item.WaterBill) || 0;
            acc.MajorBuilding += Number(item.MajorBuilding) || 0;
            acc.SewageDispCess += Number(item.SewageDispCess) || 0;
            acc.Tax1 += Number(item.Tax1) || 0;
            acc.Tax2 += Number(item.Tax2) || 0;
            acc.Tax3 += Number(item.Tax3) || 0;
            acc.Tax4 += Number(item.Tax4) || 0;
            acc.Tax5 += Number(item.Tax5) || 0;
            acc.MiscellaneousFee += Number(item.MiscellaneousFee) || 0;
            acc.Interest += Number(item.Interest) || 0;
            acc.NoticeFee += Number(item.NoticeFee) || 0;
            acc.WarrentFee += Number(item.WarrentFee) || 0;
            acc.NetTotal += Number(item.NetTotal) || 0;
            return acc;
          },
          {
            SrNo: "Total",
            WardNo: "All Wards",
            TotalProperty: totalPropertyCount,
            PropertyTax: 0,
            EducationTax: 0,
            EmploymentTax: 0,
            SpEducationTax: 0,
            TreeCess: 0,
            Sanitation: 0,
            DrainCess: 0,
            SpWaterCess: 0,
            RoadCess: 0,
            FireCess: 0,
            LightCess: 0,
            WaterBill: 0,
            MajorBuilding: 0,
            SewageDispCess: 0,
            Tax1: 0,
            Tax2: 0,
            Tax3: 0,
            Tax4: 0,
            Tax5: 0,
            MiscellaneousFee: 0,
            Interest: 0,
            NoticeFee: 0,
            WarrentFee: 0,
            NetTotal: 0,
            Year: financeYear,
          }
        );
  
        // 🧾 Recalculate final NetTotal (safety)
        totalRow.NetTotal =
          totalRow.PropertyTax +
          totalRow.EducationTax +
          totalRow.EmploymentTax +
          totalRow.SpEducationTax +
          totalRow.TreeCess +
          totalRow.Sanitation +
          totalRow.DrainCess +
          totalRow.SpWaterCess +
          totalRow.RoadCess +
          totalRow.FireCess +
          totalRow.LightCess +
          totalRow.WaterBill +
          totalRow.MajorBuilding +
          totalRow.SewageDispCess +
          totalRow.Tax1 +
          totalRow.Tax2 +
          totalRow.Tax3 +
          totalRow.Tax4 +
          totalRow.Tax5 +
          totalRow.MiscellaneousFee +
          totalRow.Interest +
          totalRow.NoticeFee +
          totalRow.WarrentFee;
  
        // ✅ Add total row at bottom
        const finalWithTotal = [...finalCurrent, totalRow];
        setCurrentData(finalWithTotal);
        setShowTable(true);
        setLoading(false);
        return;
      }
   // 🔹 Step : Fetch Pending Demand
if (selectDemand === "Pending Demand") {
  const pending = await getPendingTaxByOwnerAndYear(ownerIDs, startYear);

  // 🟩 Merge owner details + calculate NetTotal
  const finalPending = pending.map((item) => {
    const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);

    // 🧮 Calculate NetTotal (include all possible fields)
    const netTotal =
      (Number(item.PropertyTax) || 0) +
      (Number(item.EducationTax) || 0) +
      (Number(item.EmploymentTax) || 0) +
      (Number(item.SpEducationTax) || 0) +
      (Number(item.TreeCess) || 0) +
      (Number(item.Sanitation) || 0) +
      (Number(item.DrainCess) || 0) +
      (Number(item.SpWaterCess) || 0) +
      (Number(item.RoadCess) || 0) +
      (Number(item.FireCess) || 0) +
      (Number(item.LightCess) || 0) +
      (Number(item.WaterBill) || 0) +
      (Number(item.MajorBuilding) || 0) +
      (Number(item.SewageDispCess) || 0) +
      (Number(item.Tax1) || 0) +
      (Number(item.Tax2) || 0) +
      (Number(item.Tax3) || 0) +
      (Number(item.Tax4) || 0) +
      (Number(item.Tax5) || 0) +
      (Number(item.MiscellaneousFee) || 0) +
      (Number(item.Interest) || 0) +
      (Number(item.NoticeFee) || 0) +
      (Number(item.WarrentFee) || 0);

    return {
      ...item,
      OwnerName: owner?.OwnerName || "",
      NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
      NewWardNo: owner?.NewWardNo || item.WardNo,
      Year: item.PendingYear || financeYear,
      PropertyTax: Number(item.PropertyTax) || 0,
      EducationTax: Number(item.EducationTax) || 0,
      EmploymentTax: Number(item.EmploymentTax) || 0,
      SpEducationTax: Number(item.SpEducationTax) || 0,
      TreeCess: Number(item.TreeCess) || 0,
      Sanitation: Number(item.Sanitation) || 0,
      DrainCess: Number(item.DrainCess) || 0,
      SpWaterCess: Number(item.SpWaterCess) || 0,
      RoadCess: Number(item.RoadCess) || 0,
      FireCess: Number(item.FireCess) || 0,
      LightCess: Number(item.LightCess) || 0,
      WaterBill: Number(item.WaterBill) || 0,
      MajorBuilding: Number(item.MajorBuilding) || 0,
      SewageDispCess: Number(item.SewageDispCess) || 0,
      Tax1: Number(item.Tax1) || 0,
      Tax2: Number(item.Tax2) || 0,
      Tax3: Number(item.Tax3) || 0,
      Tax4: Number(item.Tax4) || 0,
      Tax5: Number(item.Tax5) || 0,
      MiscellaneousFee: Number(item.MiscellaneousFee) || 0,
      Interest: Number(item.Interest) || 0,
      NoticeFee: Number(item.NoticeFee) || 0,
      WarrentFee: Number(item.WarrentFee) || 0,
      NetTotal: netTotal,
    };
  });

  // 🟦 Count unique properties
  const uniqueProps = new Set(
    finalPending.map((i) =>
      (i.NewPropertyNo ?? i.PropertyNo ?? "").toString().trim()
    )
  );
  const totalPropertyCount = uniqueProps.size;

  // 🟨 Calculate grand total
  const totalRow = finalPending.reduce(
    (acc, item) => {
      acc.PropertyTax += item.PropertyTax;
      acc.EducationTax += item.EducationTax;
      acc.EmploymentTax += item.EmploymentTax;
      acc.SpEducationTax += item.SpEducationTax;
      acc.TreeCess += item.TreeCess;
      acc.Sanitation += item.Sanitation;
      acc.DrainCess += item.DrainCess;
      acc.SpWaterCess += item.SpWaterCess;
      acc.RoadCess += item.RoadCess;
      acc.FireCess += item.FireCess;
      acc.LightCess += item.LightCess;
      acc.WaterBill += item.WaterBill;
      acc.MajorBuilding += item.MajorBuilding;
      acc.SewageDispCess += item.SewageDispCess;
      acc.Tax1 += item.Tax1;
      acc.Tax2 += item.Tax2;
      acc.Tax3 += item.Tax3;
      acc.Tax4 += item.Tax4;
      acc.Tax5 += item.Tax5;
      acc.MiscellaneousFee += item.MiscellaneousFee;
      acc.Interest += item.Interest;
      acc.NoticeFee += item.NoticeFee;
      acc.WarrentFee += item.WarrentFee;
      acc.NetTotal += item.NetTotal;
      return acc;
    },
    {
      SrNo: "Total",
      WardNo: "All Wards",
      TotalProperty: totalPropertyCount,
      PropertyTax: 0,
      EducationTax: 0,
      EmploymentTax: 0,
      SpEducationTax: 0,
      TreeCess: 0,
      Sanitation: 0,
      DrainCess: 0,
      SpWaterCess: 0,
      RoadCess: 0,
      FireCess: 0,
      LightCess: 0,
      WaterBill: 0,
      MajorBuilding: 0,
      SewageDispCess: 0,
      Tax1: 0,
      Tax2: 0,
      Tax3: 0,
      Tax4: 0,
      Tax5: 0,
      MiscellaneousFee: 0,
      Interest: 0,
      NoticeFee: 0,
      WarrentFee: 0,
      NetTotal: 0,
      Year:  financeYear,
    }
  );

  const finalWithTotal = [...finalPending, totalRow];

  setPendingData(finalWithTotal);
  setShowTable(true);
  setLoading(false);
  return;
}
// 🟢 Handle Total Demand Display (Current + Pending Combined)
if (selectDemand === "Total Demand") {
  try {
    setLoading(true);

    // 1️⃣ Fetch both current and pending data
    const current = await fetchTransByOwnerId(ownerIDs, startYear);
    const pending = await getPendingTaxByOwnerAndYear(ownerIDs, startYear);

    // 2️⃣ Merge owner info & calculate NetTotal
    const finalCurrent = current.map((item) => {
      const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);

      const netTotal =
        (Number(item.PropertyTax) || 0) +
        (Number(item.EducationTax) || 0) +
        (Number(item.EmploymentTax) || 0) +
        (Number(item.SpEducationTax) || 0) +
        (Number(item.TreeCess) || 0) +
        (Number(item.Sanitation) || 0) +
        (Number(item.DrainCess) || 0) +
        (Number(item.SpWaterCess) || 0) +
        (Number(item.RoadCess) || 0) +
        (Number(item.FireCess) || 0) +
        (Number(item.LightCess) || 0) +
        (Number(item.WaterBill) || 0) +
        (Number(item.MajorBuilding) || 0) +
        (Number(item.SewageDispCess) || 0) +
        (Number(item.Tax1) || 0) +
        (Number(item.Tax2) || 0) +
        (Number(item.Tax3) || 0) +
        (Number(item.Tax4) || 0) +
        (Number(item.Tax5) || 0) +
        (Number(item.MiscellaneousFee) || 0) +
        (Number(item.Interest) || 0) +
        (Number(item.NoticeFee) || 0) +
        (Number(item.WarrentFee) || 0);

      return {
        ...item,
        OwnerName: owner?.OwnerName || "",
        NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
        NewWardNo: owner?.NewWardNo || item.WardNo,
        Type: "Current Demand",
        Year: financeYear,
        NetTotal: netTotal,
      };
    });

    const finalPending = pending.map((item) => {
      const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);

      const netTotal =
        (Number(item.PropertyTax) || 0) +
        (Number(item.EducationTax) || 0) +
        (Number(item.EmploymentTax) || 0) +
        (Number(item.SpEducationTax) || 0) +
        (Number(item.TreeCess) || 0) +
        (Number(item.Sanitation) || 0) +
        (Number(item.DrainCess) || 0) +
        (Number(item.SpWaterCess) || 0) +
        (Number(item.RoadCess) || 0) +
        (Number(item.FireCess) || 0) +
        (Number(item.LightCess) || 0) +
        (Number(item.WaterBill) || 0) +
        (Number(item.MajorBuilding) || 0) +
        (Number(item.SewageDispCess) || 0) +
        (Number(item.Tax1) || 0) +
        (Number(item.Tax2) || 0) +
        (Number(item.Tax3) || 0) +
        (Number(item.Tax4) || 0) +
        (Number(item.Tax5) || 0) +
        (Number(item.MiscellaneousFee) || 0) +
        (Number(item.Interest) || 0) +
        (Number(item.NoticeFee) || 0) +
        (Number(item.WarrentFee) || 0);

      return {
        ...item,
        OwnerName: owner?.OwnerName || "",
        NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
        NewWardNo: owner?.NewWardNo || item.WardNo,
        Type: "Pending Demand",
        Year: item.PendingYear || financeYear,
        NetTotal: netTotal,
      };
    });

    // 3️⃣ Combine all wards
    const allWardNos = [
      ...new Set([
        ...finalCurrent.map((x) => x.NewWardNo),
        ...finalPending.map((x) => x.NewWardNo),
      ]),
    ];

    const combinedWardData = [];

    allWardNos.forEach((ward) => {
      const cur = finalCurrent.filter((x) => x.NewWardNo === ward);
      const pend = finalPending.filter((x) => x.NewWardNo === ward);

      const sum = (arr, key) =>
        arr.reduce((a, b) => a + (Number(b[key]) || 0), 0);

      const uniqueProps = new Set([
        ...cur.map((r) => r.NewPropertyNo),
        ...pend.map((r) => r.NewPropertyNo),
      ]);

      // 🟨 Total per ward
      const total = {
        SrNo: "Total",
        WardNo: ward,
        TotalProperty: uniqueProps.size,
        PropertyTax: sum(cur, "PropertyTax") + sum(pend, "PropertyTax"),
        EducationTax: sum(cur, "EducationTax") + sum(pend, "EducationTax"),
        EmploymentTax: sum(cur, "EmploymentTax") + sum(pend, "EmploymentTax"),
        SpEducationTax: sum(cur, "SpEducationTax") + sum(pend, "SpEducationTax"),
        TreeCess: sum(cur, "TreeCess") + sum(pend, "TreeCess"),
        Sanitation: sum(cur, "Sanitation") + sum(pend, "Sanitation"),
        DrainCess: sum(cur, "DrainCess") + sum(pend, "DrainCess"),
        SpWaterCess: sum(cur, "SpWaterCess") + sum(pend, "SpWaterCess"),
        RoadCess: sum(cur, "RoadCess") + sum(pend, "RoadCess"),
        FireCess: sum(cur, "FireCess") + sum(pend, "FireCess"),
        LightCess: sum(cur, "LightCess") + sum(pend, "LightCess"),
        WaterBill: sum(cur, "WaterBill") + sum(pend, "WaterBill"),
        MajorBuilding: sum(cur, "MajorBuilding") + sum(pend, "MajorBuilding"),
        SewageDispCess:
          sum(cur, "SewageDispCess") + sum(pend, "SewageDispCess"),
        Tax1: sum(cur, "Tax1") + sum(pend, "Tax1"),
        Tax2: sum(cur, "Tax2") + sum(pend, "Tax2"),
        Tax3: sum(cur, "Tax3") + sum(pend, "Tax3"),
        Tax4: sum(cur, "Tax4") + sum(pend, "Tax4"),
        Tax5: sum(cur, "Tax5") + sum(pend, "Tax5"),
        MiscellaneousFee:
          sum(cur, "MiscellaneousFee") + sum(pend, "MiscellaneousFee"),
        Interest: sum(cur, "Interest") + sum(pend, "Interest"),
        NoticeFee: sum(cur, "NoticeFee") + sum(pend, "NoticeFee"),
        WarrentFee: sum(cur, "WarrentFee") + sum(pend, "WarrentFee"),
        NetTotal: sum(cur, "NetTotal") + sum(pend, "NetTotal"),
        Year: financeYear,
      };

      // 4️⃣ Push rows
      if (cur.length > 0)
        combinedWardData.push({
          ...cur[0],
          SrNo: "Current Demand",
          WardNo: ward,
        });

      combinedWardData.push({
        ...(pend[0] || {}),
        SrNo: "Pending Demand",
        WardNo: ward,
      });

      combinedWardData.push(total);
    });

    // 5️⃣ Done
    setCombinedData(combinedWardData);
    setShowTable(true);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching Total Demand:", err);
    setLoading(false);
  }
}

      // 6️⃣ Fetch Bill Collection for all owners
      let collectionYear;
if (financeYear && financeYear.includes("-")) {
  const [, endYear] = financeYear.split("-");
  collectionYear = parseInt(endYear); // use ending year
} else {
  const today = new Date();
  collectionYear = today.getMonth() + 1 >= 4 ? today.getFullYear() : today.getFullYear() - 1;
}

if (selectDemand === "Current Collection") {
  try {
    setLoading(true);

    // 🟩 1️⃣ Fetch data safely
    let billCollection = [];
    try {
      billCollection = await getCurrentCollection(ownerIDs, startYear);
      console.log("Bill collection fetched:", billCollection);
    } catch (err) {
      console.warn("No bill collection found for selected owners", err);
      billCollection = [];
    }

    // 🟩 2️⃣ Merge owner details
    const mergedData = billCollection.map((item) => {
      const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);

      const netTotal =
        (Number(item.PropertyTax) || 0) +
        (Number(item.EducationTax) || 0) +
        (Number(item.EmploymentTax) || 0) +
        (Number(item.SpEducationTax) || 0) +
        (Number(item.TreeCess) || 0) +
        (Number(item.Sanitation) || 0) +
        (Number(item.DrainCess) || 0) +
        (Number(item.SpWaterCess) || 0) +
        (Number(item.RoadCess) || 0) +
        (Number(item.FireCess) || 0) +
        (Number(item.LightCess) || 0) +
        (Number(item.WaterBill) || 0) +
        (Number(item.MajorBuilding) || 0) +
        (Number(item.SewageDispCess) || 0) +
        (Number(item.Tax1) || 0) +
        (Number(item.Tax2) || 0) +
        (Number(item.Tax3) || 0) +
        (Number(item.Tax4) || 0) +
        (Number(item.Tax5) || 0) +
        (Number(item.MiscellaneousFee) || 0) +
        (Number(item.Interest) || 0) +
        (Number(item.NoticeFee) || 0) +
        (Number(item.WarrentFee) || 0);

      return {
        ...item,
        OwnerName: owner?.OwnerName || "",
        NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
        NewWardNo: owner?.NewWardNo || item.WardNo,
        NetTotal: netTotal,
        Year: financeYear,
      };
    });

    // 🟦 3️⃣ Handle multi-ward cases
    const splitCollection = mergedData.flatMap((row) => {
      if (row.NewWardNo && row.NewWardNo.includes(",")) {
        return row.NewWardNo.split(",").map((ward) => ({
          ...row,
          NewWardNo: ward.trim(),
        }));
      }
      return row;
    });

    // 🟨 4️⃣ Group by ward
    const groupedCollection = splitCollection.reduce((acc, row) => {
      if (!acc[row.NewWardNo]) acc[row.NewWardNo] = [];
      acc[row.NewWardNo].push(row);
      return acc;
    }, {});

    // 🧾 5️⃣ Add TotalProperty count
    const finalCollection = [];
    Object.values(groupedCollection).forEach((rows) => {
      const totalProp = rows.length;
      rows.forEach((row, index) => {
        finalCollection.push({
          ...row,
          TotalProperty: index === 0 ? totalProp : "",
        });
      });
    });

    // 🧮 6️⃣ Grand Total row
    const uniqueProperties = new Set(
      finalCollection.map((i) =>
        (i.NewPropertyNo ?? i.PropertyNo ?? "").toString().trim()
      )
    );
    const totalPropertyCount = uniqueProperties.size;

    const totalRow = finalCollection.reduce(
      (acc, item) => {
        acc.PropertyTax += Number(item.PropertyTax) || 0;
        acc.EducationTax += Number(item.EducationTax) || 0;
        acc.EmploymentTax += Number(item.EmploymentTax) || 0;
        acc.SpEducationTax += Number(item.SpEducationTax) || 0;
        acc.TreeCess += Number(item.TreeCess) || 0;
        acc.Sanitation += Number(item.Sanitation) || 0;
        acc.DrainCess += Number(item.DrainCess) || 0;
        acc.SpWaterCess += Number(item.SpWaterCess) || 0;
        acc.RoadCess += Number(item.RoadCess) || 0;
        acc.FireCess += Number(item.FireCess) || 0;
        acc.LightCess += Number(item.LightCess) || 0;
        acc.WaterBill += Number(item.WaterBill) || 0;
        acc.MajorBuilding += Number(item.MajorBuilding) || 0;
        acc.SewageDispCess += Number(item.SewageDispCess) || 0;
        acc.Tax1 += Number(item.Tax1) || 0;
        acc.Tax2 += Number(item.Tax2) || 0;
        acc.Tax3 += Number(item.Tax3) || 0;
        acc.Tax4 += Number(item.Tax4) || 0;
        acc.Tax5 += Number(item.Tax5) || 0;
        acc.MiscellaneousFee += Number(item.MiscellaneousFee) || 0;
        acc.Interest += Number(item.Interest) || 0;
        acc.NoticeFee += Number(item.NoticeFee) || 0;
        acc.WarrentFee += Number(item.WarrentFee) || 0;
        acc.NetTotal += Number(item.NetTotal) || 0;
        return acc;
      },
      {
        SrNo: "Total",
        WardNo: "All Wards",
        TotalProperty: totalPropertyCount,
        PropertyTax: 0,
        EducationTax: 0,
        EmploymentTax: 0,
        SpEducationTax: 0,
        TreeCess: 0,
        Sanitation: 0,
        DrainCess: 0,
        SpWaterCess: 0,
        RoadCess: 0,
        FireCess: 0,
        LightCess: 0,
        WaterBill: 0,
        MajorBuilding: 0,
        SewageDispCess: 0,
        Tax1: 0,
        Tax2: 0,
        Tax3: 0,
        Tax4: 0,
        Tax5: 0,
        MiscellaneousFee: 0,
        Interest: 0,
        NoticeFee: 0,
        WarrentFee: 0,
        NetTotal: 0,
        Year: financeYear,
      }
    );

    // 🧾 Final net total recompute
    totalRow.NetTotal =
      totalRow.PropertyTax +
      totalRow.EducationTax +
      totalRow.EmploymentTax +
      totalRow.SpEducationTax +
      totalRow.TreeCess +
      totalRow.Sanitation +
      totalRow.DrainCess +
      totalRow.SpWaterCess +
      totalRow.RoadCess +
      totalRow.FireCess +
      totalRow.LightCess +
      totalRow.WaterBill +
      totalRow.MajorBuilding +
      totalRow.SewageDispCess +
      totalRow.Tax1 +
      totalRow.Tax2 +
      totalRow.Tax3 +
      totalRow.Tax4 +
      totalRow.Tax5 +
      totalRow.MiscellaneousFee +
      totalRow.Interest +
      totalRow.NoticeFee +
      totalRow.WarrentFee;

    // ✅ Combine data + total
    const finalWithTotal = [...finalCollection, totalRow];

    setCurrentCollectionData(finalWithTotal);
    setShowTable(true);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching Current Collection:", err);
    setLoading(false);
  }
}


//pending collection
if (selectDemand === "Pending Collection") {
  try {
    setLoading(true);

    // 🔹 1️⃣ Fetch data
    let billPendingCollection = [];
    try {
      billPendingCollection = await getPendingCollection(ownerIDs, startYear);
      console.log("Pending Collection fetched:", billPendingCollection);
    } catch (err) {
      console.warn("No Pending Collection found for selected owners", err);
      billPendingCollection = [];
    }

    // 🔹 2️⃣ Merge owner details + calculate NetTotal
    const mergedPendingCollection = billPendingCollection.map((item) => {
      const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);

      const netTotal =
        (Number(item.PropertyTax) || 0) +
        (Number(item.EducationTax) || 0) +
        (Number(item.EmploymentTax) || 0) +
        (Number(item.SpEducationTax) || 0) +
        (Number(item.TreeCess) || 0) +
        (Number(item.Sanitation) || 0) +
        (Number(item.DrainCess) || 0) +
        (Number(item.SpWaterCess) || 0) +
        (Number(item.RoadCess) || 0) +
        (Number(item.FireCess) || 0) +
        (Number(item.LightCess) || 0) +
        (Number(item.WaterBill) || 0) +
        (Number(item.MajorBuilding) || 0) +
        (Number(item.SewageDispCess) || 0) +
        (Number(item.Tax1) || 0) +
        (Number(item.Tax2) || 0) +
        (Number(item.Tax3) || 0) +
        (Number(item.Tax4) || 0) +
        (Number(item.Tax5) || 0) +
        (Number(item.MiscellaneousFee) || 0) +
        (Number(item.Interest) || 0) +
        (Number(item.NoticeFee) || 0) +
        (Number(item.WarrentFee) || 0);

      return {
        ...item,
        OwnerName: owner?.OwnerName || "",
        NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
        NewWardNo: owner?.NewWardNo || item.WardNo,
        Year: item.PendingYear ? String(item.PendingYear) : financeYear,
        PropertyTax: Number(item.PropertyTax) || 0,
        EducationTax: Number(item.EducationTax) || 0,
        EmploymentTax: Number(item.EmploymentTax) || 0,
        SpEducationTax: Number(item.SpEducationTax) || 0,
        TreeCess: Number(item.TreeCess) || 0,
        Sanitation: Number(item.Sanitation) || 0,
        DrainCess: Number(item.DrainCess) || 0,
        SpWaterCess: Number(item.SpWaterCess) || 0,
        RoadCess: Number(item.RoadCess) || 0,
        FireCess: Number(item.FireCess) || 0,
        LightCess: Number(item.LightCess) || 0,
        WaterBill: Number(item.WaterBill) || 0,
        MajorBuilding: Number(item.MajorBuilding) || 0,
        SewageDispCess: Number(item.SewageDispCess) || 0,
        Tax1: Number(item.Tax1) || 0,
        Tax2: Number(item.Tax2) || 0,
        Tax3: Number(item.Tax3) || 0,
        Tax4: Number(item.Tax4) || 0,
        Tax5: Number(item.Tax5) || 0,
        MiscellaneousFee: Number(item.MiscellaneousFee) || 0,
        Interest: Number(item.Interest) || 0,
        NoticeFee: Number(item.NoticeFee) || 0,
        WarrentFee: Number(item.WarrentFee) || 0,
        NetTotal: netTotal,
      };
    });

    // 🔹 3️⃣ Handle multiple wards properly
    const splitPendingCollection = mergedPendingCollection.flatMap((row) => {
      if (row.NewWardNo && row.NewWardNo.includes(",")) {
        return row.NewWardNo.split(",").map((ward) => ({
          ...row,
          NewWardNo: ward.trim(),
        }));
      }
      return row;
    });

    // 🔹 4️⃣ Group ward-wise
    const groupedPendingCollection = splitPendingCollection.reduce((acc, row) => {
      if (!acc[row.NewWardNo]) acc[row.NewWardNo] = [];
      acc[row.NewWardNo].push(row);
      return acc;
    }, {});

    // 🔹 5️⃣ Add TotalProperty per ward
    const finalPendingCollection = [];
    Object.values(groupedPendingCollection).forEach((rows) => {
      const totalProp = rows.length;
      rows.forEach((row, index) => {
        finalPendingCollection.push({
          ...row,
          TotalProperty: index === 0 ? totalProp : "",
        });
      });
    });

    // 🔹 6️⃣ Calculate grand total row (✅ Fixed for Ward + Property)
    const uniqueProperties = new Set(
      finalPendingCollection.map((i) =>
        (i.NewPropertyNo ?? i.PropertyNo ?? "").toString().trim()
      )
    );
    const totalPropertyCount = uniqueProperties.size;

    // ✅ Collect all ward numbers for display
    const allWards = [
      ...new Set(finalPendingCollection.map((r) => r.NewWardNo).filter(Boolean)),
    ].join(", ");

    // 🧮 Calculate totals
    const totalRow = finalPendingCollection.reduce(
      (acc, item) => {
        acc.PropertyTax += item.PropertyTax;
        acc.EducationTax += item.EducationTax;
        acc.EmploymentTax += item.EmploymentTax;
        acc.SpEducationTax += item.SpEducationTax;
        acc.TreeCess += item.TreeCess;
        acc.Sanitation += item.Sanitation;
        acc.DrainCess += item.DrainCess;
        acc.SpWaterCess += item.SpWaterCess;
        acc.RoadCess += item.RoadCess;
        acc.FireCess += item.FireCess;
        acc.LightCess += item.LightCess;
        acc.WaterBill += item.WaterBill;
        acc.MajorBuilding += item.MajorBuilding;
        acc.SewageDispCess += item.SewageDispCess;
        acc.Tax1 += item.Tax1;
        acc.Tax2 += item.Tax2;
        acc.Tax3 += item.Tax3;
        acc.Tax4 += item.Tax4;
        acc.Tax5 += item.Tax5;
        acc.MiscellaneousFee += item.MiscellaneousFee;
        acc.Interest += item.Interest;
        acc.NoticeFee += item.NoticeFee;
        acc.WarrentFee += item.WarrentFee;
        acc.NetTotal += item.NetTotal;
        return acc;
      },
      {
        SrNo: "Total",
        WardNo:"All Wards",
        TotalProperty: totalPropertyCount,
        PropertyTax: 0,
        EducationTax: 0,
        EmploymentTax: 0,
        SpEducationTax: 0,
        TreeCess: 0,
        Sanitation: 0,
        DrainCess: 0,
        SpWaterCess: 0,
        RoadCess: 0,
        FireCess: 0,
        LightCess: 0,
        WaterBill: 0,
        MajorBuilding: 0,
        SewageDispCess: 0,
        Tax1: 0,
        Tax2: 0,
        Tax3: 0,
        Tax4: 0,
        Tax5: 0,
        MiscellaneousFee: 0,
        Interest: 0,
        NoticeFee: 0,
        WarrentFee: 0,
        NetTotal: 0,
        Year: financeYear,
      }
    );

    totalRow.NetTotal =
      totalRow.PropertyTax +
      totalRow.EducationTax +
      totalRow.EmploymentTax +
      totalRow.SpEducationTax +
      totalRow.TreeCess +
      totalRow.Sanitation +
      totalRow.DrainCess +
      totalRow.SpWaterCess +
      totalRow.RoadCess +
      totalRow.FireCess +
      totalRow.LightCess +
      totalRow.WaterBill +
      totalRow.MajorBuilding +
      totalRow.SewageDispCess +
      totalRow.Tax1 +
      totalRow.Tax2 +
      totalRow.Tax3 +
      totalRow.Tax4 +
      totalRow.Tax5 +
      totalRow.MiscellaneousFee +
      totalRow.Interest +
      totalRow.NoticeFee +
      totalRow.WarrentFee;

      const finalWithTotal = [...finalPendingCollection];

      setTotalPendingCollection(totalRow);
      setPendingCollectionData(finalWithTotal);
    setShowTable(true);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching Pending Collection:", err);
    setLoading(false);
  }
}
if (selectDemand === "Total Collection") {
  try {
    setLoading(true);

    // 1️⃣ Fetch both current & pending collection data
    const currentCollection = await getCurrentCollection(ownerIDs, startYear);
    const pendingCollection = await getPendingCollection(ownerIDs, startYear);

    // 2️⃣ Merge owner details + calculate NetTotal
    const mergeData = (arr, type) =>
      arr.map((item) => {
        const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);

        const netTotal =
          (Number(item.PropertyTax) || 0) +
          (Number(item.EducationTax) || 0) +
          (Number(item.EmploymentTax) || 0) +
          (Number(item.SpEducationTax) || 0) +
          (Number(item.TreeCess) || 0) +
          (Number(item.Sanitation) || 0) +
          (Number(item.DrainCess) || 0) +
          (Number(item.SpWaterCess) || 0) +
          (Number(item.RoadCess) || 0) +
          (Number(item.FireCess) || 0) +
          (Number(item.LightCess) || 0) +
          (Number(item.WaterBill) || 0) +
          (Number(item.MajorBuilding) || 0) +
          (Number(item.SewageDispCess) || 0) +
          (Number(item.Tax1) || 0) +
          (Number(item.Tax2) || 0) +
          (Number(item.Tax3) || 0) +
          (Number(item.Tax4) || 0) +
          (Number(item.Tax5) || 0) +
          (Number(item.MiscellaneousFee) || 0) +
          (Number(item.Interest) || 0) +
          (Number(item.NoticeFee) || 0) +
          (Number(item.WarrentFee) || 0);

        return {
          ...item,
          OwnerName: owner?.OwnerName || "",
          NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
          NewWardNo: owner?.NewWardNo || item.WardNo,
          Type: type,
          Year: item.FinanceYear || item.PendingYear || financeYear,
          NetTotal: netTotal,
        };
      });

    const finalCurrent = mergeData(currentCollection, "Current Collection");
    const finalPending = mergeData(pendingCollection, "Pending Collection");

    // 3️⃣ Get all wards
    const allWardNos = [
      ...new Set([
        ...finalCurrent.map((x) => x.NewWardNo),
        ...finalPending.map((x) => x.NewWardNo),
      ]),
    ];

    // 4️⃣ Combine per ward (current + pending + total)
    const combinedWardCollectionData = [];

    allWardNos.forEach((ward) => {
      const curCol = finalCurrent.filter((x) => x.NewWardNo === ward);
      const pendCol = finalPending.filter((x) => x.NewWardNo === ward);

      const sum = (arr, key) => arr.reduce((a, b) => a + (Number(b[key]) || 0), 0);

      const uniqueProps = new Set([
        ...curCol.map((r) => r.NewPropertyNo),
        ...pendCol.map((r) => r.NewPropertyNo),
      ]);

     

      // Push rows
      if (curCol.length > 0)
        combinedWardCollectionData.push({
          ...curCol[0],
          SrNo: "Current Collection",
          WardNo: ward,
        });

      if (pendCol.length > 0)
        combinedWardCollectionData.push({
          ...pendCol[0],
          SrNo: "Pending Collection",
          WardNo: ward,
        });

    });

    // 5️⃣ Grand total across all wards
    const grandTotal = combinedWardCollectionData
    .filter(
      (r) => r.SrNo === "Current Collection" || r.SrNo === "Pending Collection"
    )
    .reduce(
      (acc, row) => {
        acc.TotalProperty += Number(row.TotalProperty) || 0;
        acc.PropertyTax += Number(row.PropertyTax) || 0;
        acc.EducationTax += Number(row.EducationTax) || 0;
        acc.EmploymentTax += Number(row.EmploymentTax) || 0;
        acc.SpEducationTax += Number(row.SpEducationTax) || 0;
        acc.TreeCess += Number(row.TreeCess) || 0;
        acc.Sanitation += Number(row.Sanitation) || 0;
        acc.DrainCess += Number(row.DrainCess) || 0;
        acc.SpWaterCess += Number(row.SpWaterCess) || 0;
        acc.RoadCess += Number(row.RoadCess) || 0;
        acc.FireCess += Number(row.FireCess) || 0;
        acc.LightCess += Number(row.LightCess) || 0;
        acc.WaterBill += Number(row.WaterBill) || 0;
        acc.MajorBuilding += Number(row.MajorBuilding) || 0;
        acc.SewageDispCess += Number(row.SewageDispCess) || 0;
        acc.Tax1 += Number(row.Tax1) || 0;
        acc.Tax2 += Number(row.Tax2) || 0;
        acc.Tax3 += Number(row.Tax3) || 0;
        acc.Tax4 += Number(row.Tax4) || 0;
        acc.Tax5 += Number(row.Tax5) || 0;
        acc.MiscellaneousFee += Number(row.MiscellaneousFee) || 0;
        acc.Interest += Number(row.Interest) || 0;
        acc.NoticeFee += Number(row.NoticeFee) || 0;
        acc.WarrentFee += Number(row.WarrentFee) || 0;
        acc.NetTotal += Number(row.NetTotal) || 0;
        return acc;
      },
      {
        SrNo: "Grand Total",
        WardNo: "All Wards",
        FinanceYear: `${startYear}-${startYear + 1}`,
        TotalProperty: 0,
        PropertyTax: 0,
        EducationTax: 0,
        EmploymentTax: 0,
        SpEducationTax: 0,
        TreeCess: 0,
        Sanitation: 0,
        DrainCess: 0,
        SpWaterCess: 0,
        RoadCess: 0,
        FireCess: 0,
        LightCess: 0,
        WaterBill: 0,
        MajorBuilding: 0,
        SewageDispCess: 0,
        Tax1: 0,
        Tax2: 0,
        Tax3: 0,
        Tax4: 0,
        Tax5: 0,
        MiscellaneousFee: 0,
        Interest: 0,
        NoticeFee: 0,
        WarrentFee: 0,
        NetTotal: 0,
      }
    );
  
  // ✅ Add Grand Total row
  combinedWardCollectionData.push(grandTotal);


    // ✅ Final set
    setCombinedCollectionData(combinedWardCollectionData);
    setShowTable(true);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching Total Collection:", err);
    setLoading(false);
  }
}


//current collection
if (selectDemand === "Out Standing Current Balance") {
  try {
    setLoading(true);

    // 1️⃣ Fetch current outstanding data
    let currentOutstanding = [];
    try {
      const response = await fetchCurrentOutstanding({
        OwnerID: ownerIDs,
        p_Year: startYear,
        p_from_date: null,
        p_to_date: null,
      });
      currentOutstanding = response || [];
      console.log("✅ Current Outstanding fetched:", currentOutstanding);
    } catch (err) {
      console.warn("⚠️ No current outstanding found for selected owners", err);
      currentOutstanding = [];
    }

    // 2️⃣ Merge with owner details
    const mergedCurrentOutstanding = currentOutstanding.map((item) => {
      const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);
      return {
        ...item,
        OwnerName: owner?.OwnerName || "",
        NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
        NewWardNo: owner?.NewWardNo || item.WardNo,
      };
    });

    // 3️⃣ Split multi-ward rows
    const splitCurrentOutstanding = mergedCurrentOutstanding.flatMap((row) => {
      if (row.NewWardNo && row.NewWardNo.includes(",")) {
        return row.NewWardNo.split(",").map((ward) => ({
          ...row,
          NewWardNo: ward.trim(),
        }));
      }
      return row;
    });

    // 4️⃣ Show each owner/property row
    const wardWiseOutstanding = splitCurrentOutstanding.map((item) => {
      return {
        SrNo: "Current Outstanding",
        WardNo: item.NewWardNo,
        TotalProperty: item.NewPropertyNo || "", // show property numbers
        FinanceYear: financeYear,
        PropertyTax: Number(item.PropertyTax) || 0,
        EducationTax: Number(item.EducationTax) || 0,
        EmploymentTax: Number(item.EmploymentTax) || 0,
        SpEducationTax: Number(item.SpEducationTax) || 0,
        TreeCess: Number(item.TreeCess) || 0,
        Sanitation: Number(item.Sanitation) || 0,
        DrainCess: Number(item.DrainCess) || 0,
        SpWaterCess: Number(item.SpWaterCess) || 0,
        RoadCess: Number(item.RoadCess) || 0,
        FireCess: Number(item.FireCess) || 0,
        LightCess: Number(item.LightCess) || 0,
        WaterBill: Number(item.WaterBill) || 0,
        MajorBuilding: Number(item.MajorBuilding) || 0,
        SewageDispCess: Number(item.SewageDisposalCess) || 0,
        Tax1: Number(item.Tax1) || 0,
        Tax2: Number(item.Tax2) || 0,
        Tax3: Number(item.Tax3) || 0,
        Tax4: Number(item.Tax4) || 0,
        Tax5: Number(item.Tax5) || 0,
        MiscellaneousFee: Number(item.MiscellaneousFee) || 0,
        Interest: Number(item.Interest) || 0,
        NoticeFee: Number(item.NoticeFee) || 0,
        WarrentFee: Number(item.WarrentFee) || 0,
        NetTotal: Number(item.NetTotal) || 0,
      };
    });

    // 5️⃣ Calculate Grand Total
    const grandTotal = wardWiseOutstanding.reduce(
      (acc, row) => {
        Object.keys(row).forEach((key) => {
          if (typeof row[key] === "number") {
            acc[key] = (acc[key] || 0) + row[key];
          } else if (key === "TotalProperty") {
            // count properties by splitting comma
            const count = row[key] ? row[key].split(",").length : 0;
            acc[key] = (acc[key] || 0) + count;
          }
        });
        return acc;
      },
      {
        SrNo: "Grand Total",
        WardNo: "All Wards",
        FinanceYear: financeYear,
        TotalProperty: 0, // numeric count
      }
    );

    // 6️⃣ Combine rows + grand total
    const finalData = [...wardWiseOutstanding, grandTotal];

    // 7️⃣ Set state
    setCurrentOutstandingData(finalData);
    setShowTable(true);
    setLoading(false);
  } catch (err) {
    console.error("❌ Error fetching Current Outstanding:", err);
    setLoading(false);
  }
}
if (selectDemand === "Out Standing Pending Balance") {
  try {
    setLoading(true);

    // 1️⃣ Fetch Pending Outstanding
    let PendingOutstanding = [];
    try {
      PendingOutstanding = await getPendingOutstanding(ownerIDs, startYear);
      console.log("✅ Pending Outstanding fetched:", PendingOutstanding);
    } catch (err) {
      console.warn("⚠️ No Pending outstanding found for selected owners", err);
      PendingOutstanding = [];
    }

    // 2️⃣ Merge with owner details
    const mergedPendingOutstanding = PendingOutstanding.map((item) => {
      const owner = ownersArray.find((o) => o.OwnerID === item.OwnerID);
      return {
        ...item,
        OwnerName: owner?.OwnerName || "",
        NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
        NewWardNo: owner?.NewWardNo || item.WardNo,
      };
    });

    // 3️⃣ Split multi-ward rows
    const splitPendingOutstanding = mergedPendingOutstanding.flatMap((row) => {
      if (row.NewWardNo && row.NewWardNo.includes(",")) {
        return row.NewWardNo.split(",").map((ward) => ({
          ...row,
          NewWardNo: ward.trim(),
        }));
      }
      return row;
    });

    // 4️⃣ Prepare rows with property numbers (show only on first row per ward)
    const pendingOutstandingRows = [];
    const wardsMap = {};

    splitPendingOutstanding.forEach((item) => {
      if (!wardsMap[item.NewWardNo]) {
        wardsMap[item.NewWardNo] = true;
        pendingOutstandingRows.push({
          SrNo: "Pending Outstanding",
          WardNo: item.NewWardNo,
          TotalProperty: item.NewPropertyNo || "",
          FinanceYear: financeYear,
          PropertyTax: Number(item.PropertyTax) || 0,
          EducationTax: Number(item.EducationTax) || 0,
          EmploymentTax: Number(item.EmploymentTax) || 0,
          SpEducationTax: Number(item.SpEducationTax) || 0,
          TreeCess: Number(item.TreeCess) || 0,
          Sanitation: Number(item.Sanitation) || 0,
          DrainCess: Number(item.DrainCess) || 0,
          SpWaterCess: Number(item.SpWaterCess) || 0,
          RoadCess: Number(item.RoadCess) || 0,
          FireCess: Number(item.FireCess) || 0,
          LightCess: Number(item.LightCess) || 0,
          WaterBill: Number(item.WaterBill) || 0,
          MajorBuilding: Number(item.MajorBuilding) || 0,
          SewageDispCess: Number(item.SewageDispCess) || 0,
          Tax1: Number(item.Tax1) || 0,
          Tax2: Number(item.Tax2) || 0,
          Tax3: Number(item.Tax3) || 0,
          Tax4: Number(item.Tax4) || 0,
          Tax5: Number(item.Tax5) || 0,
          MiscellaneousFee: Number(item.MiscellaneousFee) || 0,
          Interest: Number(item.Interest) || 0,
          NoticeFee: Number(item.NoticeFee) || 0,
          WarrentFee: Number(item.WarrentFee) || 0,
          NetTotal: Number(item.NetTotal) || 0,
        });
      } else {
        // Subsequent rows of same ward: show empty property column
        pendingOutstandingRows.push({
          ...item,
          SrNo: "Pending Outstanding",
          WardNo: item.NewWardNo,
          TotalProperty: "",
          FinanceYear: financeYear,
          PropertyTax: Number(item.PropertyTax) || 0,
          EducationTax: Number(item.EducationTax) || 0,
          EmploymentTax: Number(item.EmploymentTax) || 0,
          SpEducationTax: Number(item.SpEducationTax) || 0,
          TreeCess: Number(item.TreeCess) || 0,
          Sanitation: Number(item.Sanitation) || 0,
          DrainCess: Number(item.DrainCess) || 0,
          SpWaterCess: Number(item.SpWaterCess) || 0,
          RoadCess: Number(item.RoadCess) || 0,
          FireCess: Number(item.FireCess) || 0,
          LightCess: Number(item.LightCess) || 0,
          WaterBill: Number(item.WaterBill) || 0,
          MajorBuilding: Number(item.MajorBuilding) || 0,
          SewageDispCess: Number(item.SewageDispCess) || 0,
          Tax1: Number(item.Tax1) || 0,
          Tax2: Number(item.Tax2) || 0,
          Tax3: Number(item.Tax3) || 0,
          Tax4: Number(item.Tax4) || 0,
          Tax5: Number(item.Tax5) || 0,
          MiscellaneousFee: Number(item.MiscellaneousFee) || 0,
          Interest: Number(item.Interest) || 0,
          NoticeFee: Number(item.NoticeFee) || 0,
          WarrentFee: Number(item.WarrentFee) || 0,
          NetTotal: Number(item.NetTotal) || 0,
        });
      }
    });

    // 5️⃣ Calculate Grand Total
    const grandTotalPending = pendingOutstandingRows.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        if (typeof row[key] === "number") {
          acc[key] = (acc[key] || 0) + row[key];
        } else if (key === "TotalProperty") {
          const count = row.TotalProperty ? row.TotalProperty.split(",").length : 0;
          acc[key] = (acc[key] || 0) + count;
        }
      });
      return acc;
    }, {
      SrNo: " Total",
      WardNo: "All Wards",
      FinanceYear: financeYear,
      TotalProperty: 0,
    });

    // 6️⃣ Combine rows + Grand Total
    const finalPendingData = [...pendingOutstandingRows, grandTotalPending];

    // 7️⃣ Set state
    setPendingOutstandingData(finalPendingData);
    setShowTable(true);
    setLoading(false);

  } catch (err) {
    console.error("❌ Error fetching Pending Outstanding:", err);
    setLoading(false);
  }
}

if (selectDemand === "Out Standing Total Balance") {
  try {
    setLoading(true);

    const combinedWardOutstandingData = [];
    const sum = (arr, key) =>
      arr.reduce((a, b) => a + (Number(b[key]) || 0), 0);

    allWard.forEach((ward) => {
      const curBal = currentOutstandingData.filter((x) => x.WardNo === ward);
      const pendBal = pendingOutstandingData.filter((x) => x.WardNo === ward);

      // 1️⃣ Out Standing Current Balance
      combinedWardOutstandingData.push({
        SrNo: "Out Standing Current Balance",
        WardNo: ward,
        FinanceYear: financeYear,
        TotalProperty: curBal[0]?.TotalProperty || 0,
        PropertyTax: sum(curBal, "PropertyTax"),
        EducationTax: sum(curBal, "EducationTax"),
        EmploymentTax: sum(curBal, "EmploymentTax"),
        SpEducationTax: sum(curBal, "SpEducationTax"),
        TreeCess: sum(curBal, "TreeCess"),
        Sanitation: sum(curBal, "Sanitation"),
        DrainCess: sum(curBal, "DrainCess"),
        SpWaterCess: sum(curBal, "SpWaterCess"),
        RoadCess: sum(curBal, "RoadCess"),
        FireCess: sum(curBal, "FireCess"),
        LightCess: sum(curBal, "LightCess"),
        WaterBill: sum(curBal, "WaterBill"),
        MajorBuilding: sum(curBal, "MajorBuilding"),
        SewageDispCess: sum(curBal, "SewageDispCess"),
        Tax1: sum(curBal, "Tax1"),
        Tax2: sum(curBal, "Tax2"),
        Tax3: sum(curBal, "Tax3"),
        Tax4: sum(curBal, "Tax4"),
        Tax5: sum(curBal, "Tax5"),
        MiscellaneousFee: sum(curBal, "MiscellaneousFee"),
        Interest: sum(curBal, "Interest"),
        NoticeFee: sum(curBal, "NoticeFee"),
        WarrentFee: sum(curBal, "WarrentFee"),
        NetTotal: sum(curBal, "NetTotal"),
      });

      // 2️⃣ Out Standing Pending Balance
      combinedWardOutstandingData.push({
        SrNo: "Out Standing Pending Balance",
        WardNo: ward,
        FinanceYear: financeYear,
        TotalProperty: pendBal[0]?.TotalProperty || 0,
        PropertyTax: sum(pendBal, "PropertyTax"),
        EducationTax: sum(pendBal, "EducationTax"),
        EmploymentTax: sum(pendBal, "EmploymentTax"),
        SpEducationTax: sum(pendBal, "SpEducationTax"),
        TreeCess: sum(pendBal, "TreeCess"),
        Sanitation: sum(pendBal, "Sanitation"),
        DrainCess: sum(pendBal, "DrainCess"),
        SpWaterCess: sum(pendBal, "SpWaterCess"),
        RoadCess: sum(pendBal, "RoadCess"),
        FireCess: sum(pendBal, "FireCess"),
        LightCess: sum(pendBal, "LightCess"),
        WaterBill: sum(pendBal, "WaterBill"),
        MajorBuilding: sum(pendBal, "MajorBuilding"),
        SewageDispCess: sum(pendBal, "SewageDispCess"),
        Tax1: sum(pendBal, "Tax1"),
        Tax2: sum(pendBal, "Tax2"),
        Tax3: sum(pendBal, "Tax3"),
        Tax4: sum(pendBal, "Tax4"),
        Tax5: sum(pendBal, "Tax5"),
        MiscellaneousFee: sum(pendBal, "MiscellaneousFee"),
        Interest: sum(pendBal, "Interest"),
        NoticeFee: sum(pendBal, "NoticeFee"),
        WarrentFee: sum(pendBal, "WarrentFee"),
        NetTotal: sum(pendBal, "NetTotal"),
      });

      // 3️⃣ Total (Current + Pending)
      combinedWardOutstandingData.push({
        SrNo: "Total",
        WardNo: ward,
        FinanceYear: financeYear,
        TotalProperty: curBal.length + pendBal.length,
 PropertyTax: sum([...curBal, ...pendBal], "PropertyTax"),
        EducationTax: sum([...curBal, ...pendBal], "EducationTax"),
        EmploymentTax: sum([...curBal, ...pendBal], "EmploymentTax"),
        SpEducationTax: sum([...curBal, ...pendBal], "SpEducationTax"),
        TreeCess: sum([...curBal, ...pendBal], "TreeCess"),
        Sanitation: sum([...curBal, ...pendBal], "Sanitation"),
        DrainCess: sum([...curBal, ...pendBal], "DrainCess"),
        SpWaterCess: sum([...curBal, ...pendBal], "SpWaterCess"),
        RoadCess: sum([...curBal, ...pendBal], "RoadCess"),
        FireCess: sum([...curBal, ...pendBal], "FireCess"),
        LightCess: sum([...curBal, ...pendBal], "LightCess"),
        WaterBill: sum([...curBal, ...pendBal], "WaterBill"),
        MajorBuilding: sum([...curBal, ...pendBal], "MajorBuilding"),
        SewageDispCess: sum([...curBal, ...pendBal], "SewageDispCess"),
        Tax1: sum([...curBal, ...pendBal], "Tax1"),
        Tax2: sum([...curBal, ...pendBal], "Tax2"),
        Tax3: sum([...curBal, ...pendBal], "Tax3"),
        Tax4: sum([...curBal, ...pendBal], "Tax4"),
        Tax5: sum([...curBal, ...pendBal], "Tax5"),
        MiscellaneousFee: sum([...curBal, ...pendBal], "MiscellaneousFee"),
        Interest: sum([...curBal, ...pendBal], "Interest"),
        NoticeFee: sum([...curBal, ...pendBal], "NoticeFee"),
        WarrentFee: sum([...curBal, ...pendBal], "WarrentFee"),
        NetTotal: sum([...curBal, ...pendBal], "NetTotal"),
      });
    });

    setTotalOutstandingData(combinedWardOutstandingData);
    setShowTable(true);
    setLoading(false);
  } catch (err) {
    console.error("❌ Error calculating Total Outstanding:", err);
    setLoading(false);
  }
}
if (selectDemand === "Ghoshwara") {
  try {
    setLoading(true);

    const finalCurrent = currentData || [];
    const finalPending = pendingData || [];
    const finalCurrentCollection = currentCollectionData || [];
    const finalPendingCollection = PendingCollectionData || [];
    const finalAdvanceCollection = advanceCollectionData || [];
    const finalPreAdvanceCollection = preAdvanceCollectionData || [];
    const finalActualCollection = actualCollectionData || [];
    const finalTotalCurrentBalance = totalCurrentOutstanding || [];
    const finalTotalPendingBalance = totalPendingOutstanding || [];
    const finalTotalBalance = totalOutstandingData || [];

    const combinedGhoshwaraData = [];
    const sum = (arr, key) => arr.reduce((a, b) => a + (Number(b[key]) || 0), 0);

    allWard.forEach((ward) => {
      // ========================
      // FILTER ALL ARR DATA
      // ========================
      const curDem = finalCurrent.filter((x) => x.NewWardNo === ward);
      const pendDem = finalPending.filter((x) => x.NewWardNo === ward);

      const curCol = finalCurrentCollection.filter((x) => x.NewWardNo === ward);
      const pendCol = finalPendingCollection.filter((x) => x.NewWardNo === ward);

      const advCol = finalAdvanceCollection.filter((x) => x.NewWardNo === ward);
      const preAdvCol = finalPreAdvanceCollection.filter((x) => x.NewWardNo === ward);
      const actCol = finalActualCollection.filter((x) => x.NewWardNo === ward);

      const curBal = finalTotalCurrentBalance.filter((x) => x.NewWardNo === ward);
      const pendBal = finalTotalPendingBalance.filter((x) => x.NewWardNo === ward);
      const totBal = finalTotalBalance.filter((x) => x.NewWardNo === ward);

      const totalProp = curDem.length + pendDem.length;

      const build = (label, arr) => ({
        SrNo: label,
        WardNo: ward,
        FinanceYear: financeYear,
        TotalProperty: arr.length,
        PropertyTax: sum(arr, "PropertyTax"),
        EducationTax: sum(arr, "EducationTax"),
        EmploymentTax: sum(arr, "EmploymentTax"),
        SpEducationTax: sum(arr, "SpEducationTax"),
        TreeCess: sum(arr, "TreeCess"),
        Sanitation: sum(arr, "Sanitation"),
        DrainCess: sum(arr, "DrainCess"),
        SpWaterCess: sum(arr, "SpWaterCess"),
        RoadCess: sum(arr, "RoadCess"),
        FireCess: sum(arr, "FireCess"),
        LightCess: sum(arr, "LightCess"),
        WaterBill: sum(arr, "WaterBill"),
        WaterBenefit: sum(arr, "WaterBenefit"),
        MajorBuilding: sum(arr, "MajorBuilding"),
        SewageDisp: sum(arr, "SewageDisp"),
        Tax1: sum(arr, "Tax1"),
        Tax2: sum(arr, "Tax2"),
        Tax3: sum(arr, "Tax3"),
        Tax4: sum(arr, "Tax4"),
        Tax5: sum(arr, "Tax5"),
        MiscellaneousFee: sum(arr, "MiscellaneousFee"),
        Interest: sum(arr, "Interest"),
        NoticeFee: sum(arr, "NoticeFee"),
        WarrentFee: sum(arr, "WarrentFee"),
        NetTotal: sum(arr, "NetTotal"),
      });

      // =======================
      // DEMAND
      // =======================
      combinedGhoshwaraData.push(build("Current Demand", curDem));
      combinedGhoshwaraData.push(build("Pending Demand", pendDem));
      combinedGhoshwaraData.push(build("Total Demand", [...curDem, ...pendDem]));

      // =======================
      // COLLECTION
      // =======================
      combinedGhoshwaraData.push(build("Current Collection", curCol));
      combinedGhoshwaraData.push(build("Pending Collection", pendCol));
      combinedGhoshwaraData.push(build("Total Collection", [...curCol, ...pendCol]));

      // =======================
      // ADVANCE / Pre-Advance / Actual
      // =======================
      combinedGhoshwaraData.push(build("Advance Collection", advCol));
      combinedGhoshwaraData.push(build("PreAdvance Collection", preAdvCol));
      combinedGhoshwaraData.push(build("Actual Collection", actCol));

      // =======================
      // BALANCES
      // =======================
      combinedGhoshwaraData.push(build("Total Current Balance", curBal));
      combinedGhoshwaraData.push(build("Total Pending Balance", pendBal));
      combinedGhoshwaraData.push(build("Total Balance", totBal));
    });

    setCombinedGhoshwaraData(combinedGhoshwaraData);
    setShowGhoshwaraTable(true);
    setLoading(false);

  } catch (err) {
    console.error("❌ Error calculating Ghoshwara:", err);
    setLoading(false);
  }
}

if (selectDemand === "Advance Collection") {
  let AdvanceCollection = [];
  try {
    AdvanceCollection = await fetchAdvanceCollection(ownerIDs, startYear);
    console.log("Advance Collection fetched:", AdvanceCollection);
  } catch (err) {
    console.warn("No Advance Collection found for selected owners", err);
    AdvanceCollection = [];
  }

  const mergedAdvanceCollection = AdvanceCollection.map(item => {
    const owner = ownersArray.find(o => o.OwnerID === item.OwnerID);
    return {
      ...item,
      OwnerName: owner?.OwnerName || "",
      NewPropertyNo: owner?.NewPropertyNo || item.PropertyNo,
      NewWardNo: owner?.NewWardNo || item.WardNo,
    };
  });

  const splitAdvanceCollection = mergedAdvanceCollection.flatMap(row => {
    if (row.NewWardNo && row.NewWardNo.includes(",")) {
      return row.NewWardNo.split(",").map(ward => ({
        ...row,
        NewWardNo: ward.trim(),
      }));
    }
    return row;
  });

  const OutstandingAdvanceCollection = splitAdvanceCollection.reduce((acc, row) => {
    if (!acc[row.NewWardNo]) acc[row.NewWardNo] = [];
    acc[row.NewWardNo].push(row);
    return acc;
  }, {});

  const finalAdvanceCollection = [];
  Object.values(OutstandingAdvanceCollection).forEach(rows => {
    const totalProp = rows.length;
    rows.forEach((row, index) => {
      finalAdvanceCollection.push({
        ...row,
        TotalProperty: index === 0 ? totalProp : "",
      });
    });
  });

  const totalAdvanceCollection = finalAdvanceCollection.reduce((acc, item) => {
    const totalAdvanceCollectionTax =
      (Number(item.PropertyTax) || 0) +
      (Number(item.EducationTax) || 0) +
      (Number(item.EmploymentTax) || 0) +
      (Number(item.SpEducationTax) || 0) +
      (Number(item.TreeCess) || 0) +
      (Number(item.Sanitation) || 0) +
      (Number(item.DrainCess) || 0) +
      (Number(item.SpWaterCess) || 0) +
      (Number(item.RoadCess) || 0) +
      (Number(item.FireCess) || 0) +
      (Number(item.LightCess) || 0) +
      (Number(item.WaterBill) || 0) +
      (Number(item.WaterBenefit) || 0) +
      (Number(item.MajorBuilding) || 0) +
      (Number(item.SewageDispCess) || 0) +
      (Number(item.Tax1) || 0) +
      (Number(item.Tax2) || 0) +
      (Number(item.Tax3) || 0) +
      (Number(item.Tax4) || 0) +
      (Number(item.Tax5) || 0) +
      (Number(item.MiscellaneousFee) || 0) +
      (Number(item.Interest) || 0) +
      (Number(item.NoticeFee) || 0) +
      (Number(item.WarrentFee) || 0) +
      (Number(item.NetTotal) || 0);

    if (totalAdvanceCollectionTax > 0) {
      acc.TotalProperty += 1;
      acc.Property += Number(item.PropertyTax) || 0;
      acc.Education += Number(item.EducationTax) || 0;
      acc.Employment += Number(item.EmploymentTax) || 0;
      acc.TreeCess += Number(item.TreeCess) || 0;
      acc.SpEducation += Number(item.SpEducationTax) || 0;
      acc.Sanitation += Number(item.Sanitation) || 0;
      acc.DrainCess += Number(item.DrainCess) || 0;
      acc.RoadCess += Number(item.RoadCess) || 0;
      acc.FireCess += Number(item.FireCess) || 0;
      acc.LightCess += Number(item.LightCess) || 0;
      acc.SpWaterCess += Number(item.SpWaterCess) || 0;
      acc.WaterBill += Number(item.WaterBill) || 0;
      acc.WaterBenefit += Number(item.WaterBenefit) || 0;
      acc.MajorBuilding += Number(item.MajorBuilding) || 0;
      acc.SewageDisp += Number(item.SewageDispCess) || 0;
      acc.Tax1 += Number(item.Tax1) || 0;
      acc.Tax2 += Number(item.Tax2) || 0;
      acc.Tax3 += Number(item.Tax3) || 0;
      acc.Tax4 += Number(item.Tax4) || 0;
      acc.Tax5 += Number(item.Tax5) || 0;
      acc.MiscFee += Number(item.MiscellaneousFee) || 0;
      acc.Interest += Number(item.Interest) || 0;
      acc.NoticeFee += Number(item.NoticeFee) || 0;
      acc.WarrentFee += Number(item.WarrentFee) || 0;
      acc.NetTotal += Number(item.NetTotal) || 0;
    }

    return acc;
  }, {
    SrNo: "Total",
    WardNo: "All",
    TotalProperty: 0,
    Property: 0,
    Education: 0,
    Employment: 0,
    TreeCess: 0,
    SpEducation: 0,
    Sanitation: 0,
    DrainCess: 0,
    RoadCess: 0,
    FireCess: 0,
    LightCess: 0,
    SpWaterCess: 0,
    WaterBill: 0,
    WaterBenefit: 0,
    MajorBuilding: 0,
    SewageDisp: 0,
    Tax1: 0,
    Tax2: 0,
    Tax3: 0,
    Tax4: 0,
    Tax5: 0,
    MiscFee: 0,
    Interest: 0,
    NoticeFee: 0,
    WarrentFee: 0,
    NetTotal: 0,
  });

  // ✅ Only set state if there’s actual data
  setTotalAdvanceCollection(
    Object.values(totalAdvanceCollection).some(v => typeof v === "number" && v > 0)
      ? [totalAdvanceCollection]
      : []
  );

  // ✅ Optionally, also set your table data for UI
  setShowTable(true);
  setAdvanceCollectionData(finalAdvanceCollection);
}

//miscellaneous
if (selectDemand === "Miscellaneous Collection") {
  setIsMisc(true);

  let miscData = [];
  try {
    const res = await fetchMiscellaneousFee(ownerIDs, startYear);
    miscData = Array.isArray(res) ? res : [];
  } catch (err) {
    console.warn("❌ Error fetching miscellaneous fee:", err);
    miscData = []; // ✅ fallback so UI still renders
  }

  // 🟦 Merge owner details
  const mergedMisc = miscData.map(item => {
    const owner = ownersArray.find(o => o.OwnerID === item.OwnerID);
    return {
      SrNo: "Miscellaneous Collection",
      WardNo: owner?.NewWardNo || item.WardNo || "-",
      TotalProperty: owner?.TotalProperty || "",
      Year: item.FinanceYear || financeYear || "-",
      Type: item.Type || "-", 
      MiscellaneousFee: Number(item.MiscellaneousFee) || 0,
    };
  });

  // ✅ Even if no data, create 1 dummy row so the table shows like old file
  if (mergedMisc.length === 0) {
    mergedMisc.push({
      SrNo: "Miscellaneous Collection",
      WardNo: allWard?.join(", ") || "-",
      TotalProperty: ownersArray?.length || 0,
      Year: financeYear || "-",
      Type: "Pending",
      MiscellaneousFee: 0,
    });
  }

  setMiscTableData(mergedMisc);
  setShowTable(true);
  setLoading(false);
} else {
  setIsMisc(false);
}




setTotalAdvanceCollection([totalAdvanceCollection])



setShowTable(true);


    } catch (err) {
      console.error("Error fetching data:", err);
      setCurrentData([]);
      setTotalData([]);
      setPendingTotalData([]);
      setTotalCurrentCollection([]);
      setTotalPendingCollection([]);
    } finally {
      setLoading(false); 
    }
  };
  

  
  const currentDataArray = Object.values(currentData);

//excel
const handleExportToExcel = () => {
  let dataToExport = [];
  let TotalToExport = [];
  const fileName = `${selectDemand.replace(/\s/g, "_")}.xlsx`;

  switch (selectDemand) {
    case "Current Demand":
      dataToExport = currentDataArray.length > 0 ? currentDataArray : [];
      break;

    case "Pending Demand":
      dataToExport = pendingData.length > 0 ? pendingData : [];
      break;

    case "Total Demand":
      dataToExport = combinedData.length > 0 ? combinedData : [];
      break;

    case "Current Collection":
      dataToExport = currentCollectionData.length > 0 ? currentCollectionData : [];
      break;

    case "Pending Collection":
      dataToExport = PendingCollectionData.length > 0 ? PendingCollectionData : [];
      break;

    case "Out Standing Current Balance":
      dataToExport = currentOutstandingData.length > 0 ? currentOutstandingData : [];
      break;

    case "Total Collection":
      dataToExport = combinedCollectionData.length > 0 ? combinedCollectionData : [];
      break;

    case "Out Standing Total Balance":
      dataToExport = combinedOutstandingData.length > 0 ? combinedOutstandingData : [];
      break;

    case "Advance Collection":
      dataToExport = advanceCollectionData.length > 0 ? advanceCollectionData : [];
      TotalToExport = totalAdvanceCollection.length > 0 ? totalAdvanceCollection : [];
      break;

    default:
      dataToExport = [];
      break;
  }

  if (dataToExport.length === 0) {
    alert("No data available to export!");
    return;
  }

  // ✅ Combine rows to match desired Excel format
  // Add one blank row between data and total
  let finalExportData = [...dataToExport];

  if (TotalToExport.length > 0) {
    // Push a blank row (for visual separation)
    finalExportData.push({});
    // Push the total row(s)
    TotalToExport.forEach(total => {
      finalExportData.push({
        WardNo: total.WardNo || "Total",
        NewPropertyNo: "All",
        PropertyTax: total.Property || 0,
        NetTotal: total.NetTotal || 0,
      });
    });
  }

  // ✅ Convert data to Excel sheet
  const ws = XLSX.utils.json_to_sheet(finalExportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // ✅ Export the Excel file
  XLSX.writeFile(wb, fileName);
};



  
  
  
  return (
    <MainCard title="Ward Wise" style={{ color: '#1677ff' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={1.4} >
  <Stack spacing={1}>
  <Box mb={1}>
    <Typography variant="body1">
    Select Ward    </Typography>
  </Box>
    <FormControl fullWidth>
      <Select
        multiple
        value={allWard}
        onChange={handleWardChange}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 150,
              overflowY: 'auto'
            }
          }
        }}
      >
        <MenuItem value="ALL">
          <Checkbox checked={selectAll} />
          <ListItemText primary="All" />
        </MenuItem>

        {[...wardList]
  .sort((a, b) => Number(a.NewWardNo) - Number(b.NewWardNo))
  .map((wd) => (
    <MenuItem key={wd.NewWardNo} value={wd.NewWardNo}>
      <Checkbox checked={allWard.indexOf(wd.NewWardNo) > -1} />
      <ListItemText primary={wd.NewWardNo} />
    </MenuItem>
  ))}
      </Select>
    </FormControl>
  </Stack>
</Grid>
            <Grid item xs={12} sm={2.4}>
  <Box mb={1}>
    <Typography variant="body1">
      Select Demand Type
    </Typography>
  </Box>
  <FormControl fullWidth>
    <Select
      id="select-demand-type"
      value={selectDemand}
      onChange={(e) => setSelectDemand(e.target.value)}
    >
      <MenuItem value="Current Demand">Current Demand</MenuItem>
      <MenuItem value="Pending Demand">Pending Demand</MenuItem>
      <MenuItem value="Total Demand">Total Demand</MenuItem>
      <MenuItem value="Current Collection">Current Collection</MenuItem>
      <MenuItem value="Pending Collection">Pending Collection</MenuItem>
      <MenuItem value="Total Collection">Total Collection</MenuItem>
      <MenuItem value="Out Standing Current Balance">Out Standing Current Balance</MenuItem>
      <MenuItem value="Out Standing Pending Balance">Out Standing Pending Balance</MenuItem>
      <MenuItem value="Out Standing Total Balance">Out Standing Total Balance</MenuItem>
      <MenuItem value="Ghoshwara">Ghoshwara</MenuItem>
      <MenuItem value="Advance Collection">Advance Collection</MenuItem>
      <MenuItem value="Miscellaneous Collection">Miscellaneous Collection</MenuItem>
      


    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} sm={2}>
  <Box mb={1}>
    <Typography variant="body1" >
      Finance Year
    </Typography>
  </Box>
  <FormControl fullWidth>
    <Select
      id="finance-year"
      value={financeYear}
      style={{ height: '35px' }}
      onChange={(e) => handleFinanceYearChange(e.target.value)}
    >
        <MenuItem value="" disabled>
                          Select Option
                        </MenuItem>
                        {financialYearList.map((fin) => (
                          <MenuItem key={fin.FinanceYearRange} value={fin.FinanceYearRange}>
                            {fin.FinanceYearRange}
                          </MenuItem>
                        ))}  </Select>
  </FormControl>
</Grid>

              <Grid item xs={12} sm={2} >
              <Stack spacing={1}>
  <InputLabel>Property Description</InputLabel>
  <FormControl fullWidth>
    <Select
      multiple
      value={propertyDesc}
      onChange={(e) => setPropertyDesc(e.target.value)}
      renderValue={(selected) =>
        propertyDescArray
          .filter((item) => selected.includes(item.PropertyTypeID))
          .map((item) => item.PropertyDescription)
          .join(", ")
      }
      style={{ height: '40px' }}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 48 * 5, 
          },
        },
      }}  
    >
      {propertyDescArray.map((item) => (
        <MenuItem key={item.PropertyTypeID} value={item.PropertyTypeID}>
          <Checkbox checked={propertyDesc.includes(item.PropertyTypeID)} />
          <ListItemText primary={item.PropertyDescription} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Stack>

              </Grid>
              <Grid item xs={12} sm={2} marginTop={1}>
                <Stack spacing={1}>
                  <InputLabel>From Date</InputLabel>
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={fromDate} 
      onChange={(newValue) => setFromDate(newValue)} 
      disabled={
        !["Current Collection", "Pending Collection", "Total Collection"].includes(selectDemand)
      }/>
    </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={2} marginTop={1}>
                <Stack spacing={1}>
                  <InputLabel>To Date</InputLabel>
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={toDate} 
      onChange={(newValue) => setToDate(newValue)} 
      disabled={
        !["Current Collection", "Pending Collection", "Total Collection"].includes(selectDemand)
      }/>
    </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center" marginTop={1}>
        

            </Grid>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          
 

            <MainCard  >
  <Typography sx={{ mb: 2 }} variant="h5" style={{ color: 'blue' }}>
    Select Field
  </Typography>

  {[
    // Row 1
    [
      { key: 'SrNo', label: 'Sr.No', checked: srNo, set: setSrNo },
      { key: 'Ward', label: 'Ward', checked: ward, set: setWard },
      { key: 'NoOfProperty', label: 'No. of Property', checked: noOfProperty, set: setNoOfProperty },
      { key: 'Year', label: 'Year', checked: year, set: setYear },
      { key: 'OldRv', label: 'Old Rv', checked: oldRv, set: setOldRv },
      { key: 'OldTax', label: 'Old Tax', checked: oldTax, set: setOldTax },
    ],
    // Row 2
    [
      { key: 'OldPropTax', label: 'Old Prop.Tax', checked: oldPropTax, set: setOldPropTax },
      { key: 'NewRv', label: 'New Rv', checked: newRv, set: setNewRv },
      { key: 'NewTax', label: 'New Tax', checked: newTax, set: setNewTax },

      { key: 'NewPropTax', label: 'New Prop. Tax', checked: newPropTax, set: setNewPropTax },
      { key: 'PropertyTax', label: 'Property Tax', checked: propertyTax, set: setPropertyTax },
      { key: 'EmploymentTax', label: 'Employment Tax', checked: employmentTax, set: setEmploymentTax },
    ],
    // Row 3
    [
      { key: 'SpEduTax', label: 'Sp.Edu. Tax', checked: spEducationTax, set: setSpEducationTax },

      { key: 'Tree', label: 'Tree', checked: treeCess, set: setTreeCess },
      { key: 'Fire', label: 'Fire', checked: fireCess, set: setFireCess },
      { key: 'Drain', label: 'Drain', checked: drainCess, set: setDrainCess },
      { key: 'Road', label: 'Road', checked: roadTax, set: setRoadTax },
      { key: 'Light', label: 'Light', checked: lightTax, set: setLightTax },
    ],
    // Row 4
    [
      { key: 'Sanitation', label: 'Sanitation', checked: sanitationTax, set: setSanitationTax },

      { key: 'SpWater', label: 'Sp.Water', checked: spWater, set: setSpWater },
      { key: 'WaterBill', label: 'Water Bill', checked: waterBill, set: setWaterBill },
      { key: 'SpEducationBill', label: 'Sp.Education Bill', checked: spEducationBill, set: setSpEducationBill },
      { key: 'SewageDisp', label: 'Sewage Disp', checked: sewageDisp, set: setSewageDisp },
      { key: 'MajorBuilding', label: 'Major Building', checked: majorBuilding, set: setMajorBuilding },
    ],
    // Row 5
    [
      { key: 'Tax1', label: 'Tax1', checked: tax1, set: setTax1 },

      { key: 'Tax2', label: 'Tax2', checked: tax2, set: setTax2 },
      { key: 'Tax3', label: 'Tax3', checked: tax3, set: setTax3 },
      { key: 'Tax4', label: 'Tax4', checked: tax4, set: setTax4 },
      { key: 'Tax5', label: 'Tax5', checked: tax5, set: setTax5 },
      { key: 'MiscFee', label: 'Miscellaneous Fee', checked: miscFee, set: setMiscFee },
    ],
    // Row 6
    [
            { key: 'Interest', label: 'Interest', checked: interest, set: setInterest },

      { key: 'NoticeFee', label: 'Notice Fee', checked: noticeFee, set: setNoticeFee },
      { key: 'WarrentFee', label: 'Warrent Fee', checked: warrentFee, set: setWarrentFee },
      { key: 'NetTotal', label: 'Net Total', checked: netTotal, set: setNetTotal },
    ],
  ].map((row, rowIndex) => (
    <Grid container spacing={1} key={rowIndex} sx={{ mb: 1 }}>
      {row.map(({ key, label, checked, set }) => (
        <Grid item xs={12} sm={6} md={2} key={key} sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={<Checkbox checked={key === 'SrNo'|| key === 'Ward'|| key === 'NoOfProperty'|| key === 'Year'|| key === 'PropertyTax'|| key === 'EmploymentTax'
            || key === 'SpEduTax'|| key === 'Tree'|| key === 'Fire'|| key === 'Drain'|| key === 'Road'|| key === 'Light'|| key === 'Sanitation'|| key === 'EmploymentTax'|| key === 'EmploymentTax'|| key === 'EmploymentTax'
            || key === 'SpWater'|| key === 'WaterBill'|| key === 'SpEducationBill'|| key === 'SewageDisp'|| key === 'MajorBuilding'
            || key === 'Tax1'|| key === 'Tax2'|| key === 'Tax3'|| key === 'Tax4'|| key === 'Tax5'
            || key === 'MiscFee'|| key === 'Interest'|| key === 'NoticeFee'|| key === 'WarrentFee'|| key === 'NetTotal'
             ? true : checked}  onChange={(e) => set(e.target.checked)} />}
            label={label}
            labelPlacement="end"
            sx={{ ml: 0.5, width: '100%' }}
            disabled={key === 'SrNo'} 
          />
        </Grid>
      ))}
    </Grid>
  ))}
 <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',  
    alignItems: 'center',     
    gap: 2,                     
    my: 3                      
  }}
>
<Button
  variant="contained"
  color="primary"
  onClick={handleShowClick}
  disabled={loading} 
  startIcon={loading && <CircularProgress size={20} color="inherit" />}
>
  {loading ? "Please wait..." : "Show"}
</Button>

  <Button
    variant="contained"
    color="primary"
    onClick={handleExportToExcel}
    >
    Export To Excel
  </Button>
</Box>

{showTable && (
  <Box sx={{ overflowX: 'auto', maxHeight: 4000, width: '100%' }}>
    <Table>
    <TableHead>
  <TableRow className="text-center">
    <TableCell className="font-weight-bold">Sr.No</TableCell>
    <TableCell className="font-weight-bold">Ward No.</TableCell>
    <TableCell className="font-weight-bold">Total Property</TableCell>
    <TableCell className="font-weight-bold">Year</TableCell>
    {oldRv && <TableCell className="font-weight-bold">Old Rv</TableCell>}
        {oldTax && <TableCell className="font-weight-bold">Old Tax</TableCell>}
        {oldPropTax && <TableCell className="font-weight-bold">Old Prop.Tax</TableCell>}
        {newRv && <TableCell className="font-weight-bold">New Rv</TableCell>}
        {newPropTax && <TableCell className="font-weight-bold">New Prop. Tax</TableCell>}
        {newTax && <TableCell className="font-weight-bold">New Tax</TableCell>}

    {selectDemand === "Miscellaneous Collection" ? (
      <>
        <TableCell className="font-weight-bold">Type</TableCell>
        <TableCell className="font-weight-bold">Miscellaneous Fee</TableCell>
      </>
    ) : (
      <>
        <TableCell className="font-weight-bold">Property Tax</TableCell>
        <TableCell className="font-weight-bold">Education Tax</TableCell>
        <TableCell className="font-weight-bold">Employment</TableCell>
        <TableCell className="font-weight-bold">Sp Education</TableCell>
        <TableCell className="font-weight-bold">TreeCess</TableCell>
        <TableCell className="font-weight-bold">Sanitation</TableCell>
        <TableCell className="font-weight-bold">Drain Cess</TableCell>
        <TableCell className="font-weight-bold">Sp Water Cess</TableCell>
        <TableCell className="font-weight-bold">Road Cess</TableCell>
        <TableCell className="font-weight-bold">Fire Cess</TableCell>
        <TableCell className="font-weight-bold">Light Cess</TableCell>
        <TableCell className="font-weight-bold">Water Bill</TableCell>
        <TableCell className="font-weight-bold">Major Building</TableCell>
        <TableCell className="font-weight-bold">Sewage DispCess</TableCell>
        <TableCell className="font-weight-bold">Tax1</TableCell>
        <TableCell className="font-weight-bold">Tax2</TableCell>
        <TableCell className="font-weight-bold">Tax3</TableCell>
        <TableCell className="font-weight-bold">Tax4</TableCell>
        <TableCell className="font-weight-bold">Tax5</TableCell>
        <TableCell className="font-weight-bold">Misc Fee</TableCell>
        <TableCell className="font-weight-bold">Interest</TableCell>
        <TableCell className="font-weight-bold">Notice Fee</TableCell>
        <TableCell className="font-weight-bold">Warrent Fee</TableCell>
        <TableCell className="font-weight-bold">Net Total</TableCell>
      </>
    )}
  </TableRow>
</TableHead>

      <TableBody>
     
      {selectDemand === "Current Demand" && (
  <>
    {currentDataArray.length > 0 &&
    currentDataArray.some(row =>
      
      row.PropertyTax > 0 ||
      row.EducationTax > 0 ||
      row.EmploymentTax > 0 ||
      row.SpEducationTax > 0 ||
      row.TreeCess > 0 ||
      row.Sanitation > 0 ||
      row.DrainCess > 0 ||
      row.RoadCess > 0 ||
      row.FireCess > 0 ||
      row.LightCess > 0 ||
      row.SpWaterCess > 0 ||
      row.WaterBill > 0 ||
      row.MajorBuilding > 0 ||
      row.SewageDisposalCess > 0 ||
      row.Tax1 > 0 ||
      row.Tax2 > 0 ||
      row.Tax3 > 0 ||
      row.Tax4 > 0 ||
      row.Tax5 > 0 ||
      row.MiscellaneousFee > 0 ||
      row.Interest > 0 ||
      row.NoticeFee > 0 ||
      row.WarrentFee > 0 ||
      row.NetTotal > 0
    ) ? (
      <>
        {/* 🟢 Normal Rows */}
        {currentDataArray
          .filter(row => row.SrNo !== "Total")
          .map((row, index) => (
            <TableRow
              key={row.OwnerID || index}
              style={{ backgroundColor: "#E0FFFF" }}
            >
              <TableCell>{selectDemand}</TableCell>
              <TableCell>{row.NewWardNo}</TableCell>
              <TableCell>{row.NewPropertyNo}</TableCell>
              <TableCell>{row.FinanceYear || row.Year || financeYear}</TableCell>
              {oldRv && <TableCell>{row.OldRv}</TableCell>}
          {oldTax && <TableCell>{row.OldTax}</TableCell>}
          {oldPropTax && <TableCell>{row.OldPropTax}</TableCell>}
          {newRv && <TableCell>{row.NewRv}</TableCell>}
          {newTax && <TableCell>{row.NewTax}</TableCell>}
          {newPropTax && <TableCell>{row.NewPropTax}</TableCell>}

              <TableCell>{row.PropertyTax}</TableCell>
              <TableCell>{row.EducationTax}</TableCell>
              <TableCell>{row.EmploymentTax}</TableCell>
              <TableCell>{row.SpEducationTax}</TableCell>
              <TableCell>{row.TreeCess}</TableCell>
              <TableCell>{row.Sanitation}</TableCell>
              <TableCell>{row.DrainCess}</TableCell>
              <TableCell>{row.SpWaterCess}</TableCell>
              <TableCell>{row.RoadCess}</TableCell>
              <TableCell>{row.FireCess}</TableCell>
              <TableCell>{row.LightCess}</TableCell>
              <TableCell>{row.WaterBill}</TableCell>
              <TableCell>{row.MajorBuilding}</TableCell>
              <TableCell>{row.SewageDisposalCess}</TableCell>
              <TableCell>{row.Tax1}</TableCell>
              <TableCell>{row.Tax2}</TableCell>
              <TableCell>{row.Tax3}</TableCell>
              <TableCell>{row.Tax4}</TableCell>
              <TableCell>{row.Tax5}</TableCell>
              <TableCell>{row.MiscellaneousFee}</TableCell>
              <TableCell>{row.Interest}</TableCell>
              <TableCell>{row.NoticeFee}</TableCell>
              <TableCell>{row.WarrentFee}</TableCell>
              <TableCell>{row.NetTotal}</TableCell>
            </TableRow>
        ))}

        {/* 🟣 Single Total Row */}
        {currentDataArray
          .filter(row => row.SrNo === "Total")
          .map((total, index) => (
            <TableRow
              key={`total-${index}`}
              style={{ backgroundColor: "#00FFFF", fontWeight: "bold" }}
            >
              <TableCell>{total.SrNo}</TableCell>
              <TableCell>{total.WardNo}</TableCell>
              <TableCell>{total.TotalProperty}</TableCell>
              <TableCell>{total.Year || financeYear}</TableCell>
              {oldRv && <TableCell>{total.oldRv}</TableCell>}
        {oldTax && <TableCell>{total.oldTax}</TableCell>}
        {oldPropTax && <TableCell>{total.oldPropTax}</TableCell>}
        {newRv && <TableCell>{total.newRv}</TableCell>}
        {newTax && <TableCell>{total.newTax}</TableCell>}
        {newPropTax && <TableCell>{total.newPropTax}</TableCell>}

              <TableCell>{total.PropertyTax}</TableCell>
              <TableCell>{total.EducationTax}</TableCell>
              <TableCell>{total.EmploymentTax}</TableCell>
              <TableCell>{total.SpEducationTax}</TableCell>
              <TableCell>{total.TreeCess}</TableCell>
              <TableCell>{total.Sanitation}</TableCell>
              <TableCell>{total.DrainCess}</TableCell>
              <TableCell>{total.SpWaterCess}</TableCell>
              <TableCell>{total.RoadCess}</TableCell>
              <TableCell>{total.FireCess}</TableCell>
              <TableCell>{total.LightCess}</TableCell>
              <TableCell>{total.WaterBill}</TableCell>
              <TableCell>{total.MajorBuilding}</TableCell>
              <TableCell>{total.SewageDispCess || total.SewageDisposalCess}</TableCell>
              <TableCell>{total.Tax1}</TableCell>
              <TableCell>{total.Tax2}</TableCell>
              <TableCell>{total.Tax3}</TableCell>
              <TableCell>{total.Tax4}</TableCell>
              <TableCell>{total.Tax5}</TableCell>
              <TableCell>{total.MiscellaneousFee}</TableCell>
              <TableCell>{total.Interest}</TableCell>
              <TableCell>{total.NoticeFee}</TableCell>
              <TableCell>{total.WarrentFee}</TableCell>
              <TableCell>{total.NetTotal}</TableCell>
            </TableRow>
        ))}
      </>
    ) : (
      <TableRow>
        <TableCell colSpan={30} style={{ textAlign: "center", color: "red" }}>
          No data available
        </TableCell>
      </TableRow>
    )}
  </>
)}

{/* Pending Demand Rows */}
{selectDemand === "Pending Demand" && (
  <>
    {pendingData.length > 0 &&
    pendingData.some(
      (row) =>
        row.PropertyTax > 0 ||
        row.EducationTax > 0 ||
        row.EmploymentTax > 0 ||
        row.SpEducationTax > 0 ||
        row.TreeCess > 0 ||
        row.Sanitation > 0 ||
        row.DrainCess > 0 ||
        row.RoadCess > 0 ||
        row.FireCess > 0 ||
        row.LightCess > 0 ||
        row.SpWaterCess > 0 ||
        row.WaterBill > 0 ||
        row.MajorBuilding > 0 ||
        row.SewageDisposalCess > 0 ||
        row.Tax1 > 0 ||
        row.Tax2 > 0 ||
        row.Tax3 > 0 ||
        row.Tax4 > 0 ||
        row.Tax5 > 0 ||
        row.MiscellaneousFee > 0 ||
        row.Interest > 0 ||
        row.NoticeFee > 0 ||
        row.WarrentFee > 0 ||
        row.NetTotal > 0
    ) ? (
      <>
        {/* 🟡 Regular Rows */}
        {pendingData
          .filter((row) => row.SrNo !== "Total")
          .map((row, index) => (
            <TableRow
              key={row.OwnerID || index}
              style={{ backgroundColor: "#FFFACD" }}
            >
              <TableCell>{selectDemand}</TableCell>
              <TableCell>{row.NewWardNo}</TableCell>
              <TableCell>{row.NewPropertyNo}</TableCell>
              <TableCell>{row.FinanceYear || row.Year || financeYear}</TableCell>

              {oldRv && <TableCell>{row.OldRv}</TableCell>}
              {oldTax && <TableCell>{row.OldTax}</TableCell>}
              {oldPropTax && <TableCell>{row.OldPropTax}</TableCell>}
              {newRv && <TableCell>{row.NewRv}</TableCell>}
              {newTax && <TableCell>{row.NewTax}</TableCell>}
              {newPropTax && <TableCell>{row.NewPropTax}</TableCell>}

              <TableCell>{row.PropertyTax}</TableCell>
              <TableCell>{row.EducationTax}</TableCell>
              <TableCell>{row.EmploymentTax}</TableCell>
              <TableCell>{row.SpEducationTax}</TableCell>
              <TableCell>{row.TreeCess}</TableCell>
              <TableCell>{row.Sanitation}</TableCell>
              <TableCell>{row.DrainCess}</TableCell>
              <TableCell>{row.SpWaterCess}</TableCell>
              <TableCell>{row.RoadCess}</TableCell>
              <TableCell>{row.FireCess}</TableCell>
              <TableCell>{row.LightCess}</TableCell>
              <TableCell>{row.WaterBill}</TableCell>
              <TableCell>{row.MajorBuilding}</TableCell>
              <TableCell>{row.SewageDisposalCess || row.SewageDispCess}</TableCell>
              <TableCell>{row.Tax1}</TableCell>
              <TableCell>{row.Tax2}</TableCell>
              <TableCell>{row.Tax3}</TableCell>
              <TableCell>{row.Tax4}</TableCell>
              <TableCell>{row.Tax5}</TableCell>
              <TableCell>{row.MiscellaneousFee}</TableCell>
              <TableCell>{row.Interest}</TableCell>
              <TableCell>{row.NoticeFee}</TableCell>
              <TableCell>{row.WarrentFee}</TableCell>
              <TableCell>{row.NetTotal}</TableCell>
            </TableRow>
          ))}

        {/* 🔴 Total Row */}
        {pendingData
          .filter((row) => row.SrNo === "Total")
          .map((total, index) => (
            <TableRow
              key={`total-${index}`}
              style={{ backgroundColor: "#FFD700", fontWeight: "bold" }}
            >
              <TableCell>{total.SrNo}</TableCell>
              <TableCell>{total.WardNo}</TableCell>
              <TableCell>{total.TotalProperty}</TableCell>
              <TableCell>{total.Year || financeYear}</TableCell>

              {oldRv && <TableCell>{total.oldRv}</TableCell>}
              {oldTax && <TableCell>{total.oldTax}</TableCell>}
              {oldPropTax && <TableCell>{total.oldPropTax}</TableCell>}
              {newRv && <TableCell>{total.newRv}</TableCell>}
              {newTax && <TableCell>{total.newTax}</TableCell>}
              {newPropTax && <TableCell>{total.newPropTax}</TableCell>}

              <TableCell>{total.PropertyTax}</TableCell>
              <TableCell>{total.EducationTax}</TableCell>
              <TableCell>{total.EmploymentTax}</TableCell>
              <TableCell>{total.SpEducationTax}</TableCell>
              <TableCell>{total.TreeCess}</TableCell>
              <TableCell>{total.Sanitation}</TableCell>
              <TableCell>{total.DrainCess}</TableCell>
              <TableCell>{total.SpWaterCess}</TableCell>
              <TableCell>{total.RoadCess}</TableCell>
              <TableCell>{total.FireCess}</TableCell>
              <TableCell>{total.LightCess}</TableCell>
              <TableCell>{total.WaterBill}</TableCell>
              <TableCell>{total.MajorBuilding}</TableCell>
              <TableCell>{total.SewageDispCess || total.SewageDisposalCess}</TableCell>
              <TableCell>{total.Tax1}</TableCell>
              <TableCell>{total.Tax2}</TableCell>
              <TableCell>{total.Tax3}</TableCell>
              <TableCell>{total.Tax4}</TableCell>
              <TableCell>{total.Tax5}</TableCell>
              <TableCell>{total.MiscellaneousFee}</TableCell>
              <TableCell>{total.Interest}</TableCell>
              <TableCell>{total.NoticeFee}</TableCell>
              <TableCell>{total.WarrentFee}</TableCell>
              <TableCell>{total.NetTotal}</TableCell>
            </TableRow>
          ))}
      </>
    ) : (
      <TableRow>
        <TableCell colSpan={30} style={{ textAlign: "center", color: "red" }}>
          No pending data available
        </TableCell>
      </TableRow>
    )}
  </>
)}

{/* total demand */}
{selectDemand === "Total Demand" && (
  <>
    {combinedData.length > 0 ? (
      combinedData.map((row, i) => (
        <TableRow
          key={i}
          style={{
            backgroundColor:
              row.SrNo === "Total"
                ? "#00FFFF"
                : row.SrNo === "Pending Demand"
                ? "#FFFACD"
                : "#E0FFFF",
            fontWeight: row.SrNo === "Total" ? "bold" : "normal",
          }}
        >
          <TableCell>{row.SrNo}</TableCell>
          <TableCell>{row.WardNo}</TableCell>
          <TableCell>{row.TotalProperty ||0}</TableCell>
        <TableCell>{row.FinanceYear || financeYear ||row.Year }</TableCell>

          <TableCell>{row.PropertyTax ||0}</TableCell>
          <TableCell>{row.EducationTax ||0}</TableCell>
          <TableCell>{row.EmploymentTax ||0}</TableCell>
          <TableCell>{row.SpEducationTax ||0}</TableCell>
          <TableCell>{row.TreeCess ||0}</TableCell>
          <TableCell>{row.Sanitation ||0}</TableCell>
          <TableCell>{row.DrainCess ||0}</TableCell>
          <TableCell>{row.SpWaterCess ||0}</TableCell>
          <TableCell>{row.RoadCess ||0}</TableCell>
          <TableCell>{row.FireCess ||0}</TableCell>
          <TableCell>{row.LightCess ||0}</TableCell>
          <TableCell>{row.WaterBill ||0}</TableCell>
          <TableCell>{row.MajorBuilding ||0}</TableCell>
          <TableCell>{row.SewageDispCess ||0}</TableCell>
          <TableCell>{row.Tax1 ||0}</TableCell>
          <TableCell>{row.Tax2 ||0}</TableCell>
          <TableCell>{row.Tax3 ||0}</TableCell>
          <TableCell>{row.Tax4 ||0}</TableCell>
          <TableCell>{row.Tax5 ||0}</TableCell>
          <TableCell>{row.MiscellaneousFee ||0}</TableCell>
          <TableCell>{row.Interest ||0}</TableCell>
          <TableCell>{row.NoticeFee ||0}</TableCell>
          <TableCell>{row.WarrentFee ||0}</TableCell>
          <TableCell>{row.NetTotal ||0}</TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={27} style={{ textAlign: "center", color: "red" }}>
          No data available
        </TableCell>
      </TableRow>
    )}

    
  </>
)}

       {/* Current Collection Rows */}
       {selectDemand === "Current Collection" && (
  <>
    {currentCollectionData.length > 0 ? (
      <>
        {/* 🟢 Regular Rows */}
        {currentCollectionData
          .filter(row => row.SrNo !== "Total")
          .map((row, index) => (
            <TableRow
              key={row.OwnerID || index}
              style={{ backgroundColor: "#E6E6FA" }}
            >
              <TableCell>{selectDemand}</TableCell>
              <TableCell>{row.NewWardNo || row.WardNo || "-"}</TableCell>
              <TableCell>{row.TotalProperty || row.NewPropertyNo || "-"}</TableCell>
              <TableCell>{row.Year || financeYear}</TableCell>

              <TableCell>{row.PropertyTax || 0}</TableCell>
              <TableCell>{row.EducationTax || 0}</TableCell>
              <TableCell>{row.EmploymentTax || 0}</TableCell>
              <TableCell>{row.SpEducationTax || 0}</TableCell>
              <TableCell>{row.TreeCess || 0}</TableCell>
              <TableCell>{row.Sanitation || 0}</TableCell>
              <TableCell>{row.DrainCess || 0}</TableCell>
              <TableCell>{row.SpWaterCess || 0}</TableCell>
              <TableCell>{row.RoadCess || 0}</TableCell>
              <TableCell>{row.FireCess || 0}</TableCell>
              <TableCell>{row.LightCess || 0}</TableCell>
              <TableCell>{row.WaterBill || 0}</TableCell>
              <TableCell>{row.MajorBuilding || 0}</TableCell>
              <TableCell>{row.SewageDispCess || 0}</TableCell>
              <TableCell>{row.Tax1 || 0}</TableCell>
              <TableCell>{row.Tax2 || 0}</TableCell>
              <TableCell>{row.Tax3 || 0}</TableCell>
              <TableCell>{row.Tax4 || 0}</TableCell>
              <TableCell>{row.Tax5 || 0}</TableCell>
              <TableCell>{row.MiscellaneousFee || 0}</TableCell>
              <TableCell>{row.Interest || 0}</TableCell>
              <TableCell>{row.NoticeFee || 0}</TableCell>
              <TableCell>{row.WarrentFee || 0}</TableCell>
              <TableCell>{row.NetTotal || 0}</TableCell>
            </TableRow>
          ))}

        {/* 🟣 Single Total Row */}
        {currentCollectionData
          .filter(row => row.SrNo === "Total")
          .map((total, index) => (
            <TableRow
              key={`total-${index}`}
              style={{ backgroundColor: "#FFDAB9", fontWeight: "bold" }}
            >
              <TableCell>{total.SrNo}</TableCell>
              <TableCell>{total.WardNo}</TableCell>
              <TableCell>{total.TotalProperty}</TableCell>
              <TableCell>{total.Year || financeYear}</TableCell>

              <TableCell>{total.PropertyTax}</TableCell>
              <TableCell>{total.EducationTax}</TableCell>
              <TableCell>{total.EmploymentTax}</TableCell>
              <TableCell>{total.SpEducationTax}</TableCell>
              <TableCell>{total.TreeCess}</TableCell>
              <TableCell>{total.Sanitation}</TableCell>
              <TableCell>{total.DrainCess}</TableCell>
              <TableCell>{total.SpWaterCess}</TableCell>
              <TableCell>{total.RoadCess}</TableCell>
              <TableCell>{total.FireCess}</TableCell>
              <TableCell>{total.LightCess}</TableCell>
              <TableCell>{total.WaterBill}</TableCell>
              <TableCell>{total.MajorBuilding}</TableCell>
              <TableCell>{total.SewageDispCess}</TableCell>
              <TableCell>{total.Tax1}</TableCell>
              <TableCell>{total.Tax2}</TableCell>
              <TableCell>{total.Tax3}</TableCell>
              <TableCell>{total.Tax4}</TableCell>
              <TableCell>{total.Tax5}</TableCell>
              <TableCell>{total.MiscellaneousFee}</TableCell>
              <TableCell>{total.Interest}</TableCell>
              <TableCell>{total.NoticeFee}</TableCell>
              <TableCell>{total.WarrentFee}</TableCell>
              <TableCell>{total.NetTotal}</TableCell>
            </TableRow>
          ))}
      </>
    ) : (
      <TableRow>
        <TableCell colSpan={30} style={{ textAlign: "center", color: "red" }}>
          No current collection data available
        </TableCell>
      </TableRow>
    )}
  </>
)}

       {/* Pending Collection Rows */}
       {selectDemand === "Pending Collection" && (
  <>
    {PendingCollectionData.length > 0 &&
    PendingCollectionData.some(row =>
      row.PropertyTax > 0 ||
      row.EducationTax > 0 ||
      row.EmploymentTax > 0 ||
      row.spEducationTax > 0 ||
      row.TreeCess > 0 ||
      row.Sanitation > 0 ||
      row.DrainCess > 0 ||
      row.SpWaterCess > 0 ||
      row.RoadCess > 0 ||
      row.FireCess > 0 ||
      row.LightCess > 0 ||
      row.WaterBill > 0 ||
      row.MajorBuilding > 0 ||
      row.SewageDisp > 0 ||
      row.MiscellaneousFee > 0 ||
      row.Interest > 0 ||
      row.NoticeFee > 0 ||
      row.WarrentFee > 0 ||
      row.NetTotal > 0
    ) ? (
      // Show Current Collection Rows
      PendingCollectionData.map((row, index) => (
        <TableRow key={row.OwnerID || index} style={{ backgroundColor: "#E6E6FA" }}>
          <TableCell>{selectDemand}</TableCell>
          <TableCell>{row.NewWardNo}</TableCell>
          <TableCell>{row.NewPropertyNo}</TableCell>
          <TableCell>{row.Year || financeYear}</TableCell>
          <TableCell>{row.PropertyTax || 0}</TableCell>
          <TableCell>{row.EducationTax || 0}</TableCell>
          <TableCell>{row.EmploymentTax || 0}</TableCell>
          <TableCell>{row.spEducationTax}</TableCell>
          <TableCell>{row.TreeCess || 0}</TableCell>
          <TableCell>{row.Sanitation || 0}</TableCell>
          <TableCell>{row.DrainCess || 0}</TableCell>
          <TableCell>{row.SpWaterCess || 0}</TableCell>
          <TableCell>{row.RoadCess || 0}</TableCell>
          <TableCell>{row.FireCess || 0}</TableCell>
          <TableCell>{row.LightCess || 0}</TableCell>
          <TableCell>{row.WaterBill || 0}</TableCell>
          <TableCell>{row.MajorBuilding || 0}</TableCell>
          <TableCell>{row.SewageDisp || 0}</TableCell>
          <TableCell>{row.Tax1 || 0}</TableCell>
          <TableCell>{row.Tax2 || 0}</TableCell>
          <TableCell>{row.Tax3 || 0}</TableCell>
          <TableCell>{row.Tax4 || 0}</TableCell>
          <TableCell>{row.Tax5 || 0}</TableCell>

          <TableCell>{row.MiscellaneousFee || 0}</TableCell>
          <TableCell>{row.Interest || 0}</TableCell>
          <TableCell>{row.NoticeFee || 0}</TableCell>
          <TableCell>{row.WarrentFee || 0}</TableCell>
          <TableCell>{row.NetTotal || 0}</TableCell>
        </TableRow>
      ))
    ) : (
      // No Current Collection Data
      <TableRow>
        <TableCell colSpan={22} style={{ textAlign: "center", color: "red" }}>
          No current collection data available
        </TableCell>
      </TableRow>
    )}

    {/* Current Collection Total Row */}
    {totalPendingCollection && PendingCollectionData.length > 0 && (
  <TableRow style={{ backgroundColor: "#FFDAB9", fontWeight: "bold" }}>
    <TableCell>{totalPendingCollection.SrNo}</TableCell>
    <TableCell>{totalPendingCollection.WardNo || "All Wards"}</TableCell>
    <TableCell>{totalPendingCollection.TotalProperty || 0}</TableCell>
    <TableCell>{totalPendingCollection.Year}</TableCell>

    <TableCell>{totalPendingCollection.PropertyTax}</TableCell>
    <TableCell>{totalPendingCollection.EducationTax}</TableCell>
    <TableCell>{totalPendingCollection.EmploymentTax}</TableCell>
    <TableCell>{totalPendingCollection.SpEducationTax}</TableCell>
    <TableCell>{totalPendingCollection.TreeCess}</TableCell>
    <TableCell>{totalPendingCollection.Sanitation}</TableCell>
    <TableCell>{totalPendingCollection.DrainCess}</TableCell>
    <TableCell>{totalPendingCollection.SpWaterCess}</TableCell>
    <TableCell>{totalPendingCollection.RoadCess}</TableCell>
    <TableCell>{totalPendingCollection.FireCess}</TableCell>
    <TableCell>{totalPendingCollection.LightCess}</TableCell>
    <TableCell>{totalPendingCollection.WaterBill}</TableCell>
    <TableCell>{totalPendingCollection.MajorBuilding}</TableCell>
    <TableCell>{totalPendingCollection.SewageDispCess}</TableCell>
    <TableCell>{totalPendingCollection.Tax1}</TableCell>
    <TableCell>{totalPendingCollection.Tax2}</TableCell>
    <TableCell>{totalPendingCollection.Tax3}</TableCell>
    <TableCell>{totalPendingCollection.Tax4}</TableCell>
    <TableCell>{totalPendingCollection.Tax5}</TableCell>
    <TableCell>{totalPendingCollection.MiscellaneousFee}</TableCell>
    <TableCell>{totalPendingCollection.Interest}</TableCell>
    <TableCell>{totalPendingCollection.NoticeFee}</TableCell>
    <TableCell>{totalPendingCollection.WarrentFee}</TableCell>
    <TableCell>{totalPendingCollection.NetTotal}</TableCell>
  </TableRow>
)}

  </>
)}

{/* 🟩 Out Standing Current Balance Table */}
{selectDemand === "Out Standing Current Balance" && (
  <>
    {currentOutstandingData.length > 0 ? (
      currentOutstandingData.map((row, index) => (
        <TableRow
          key={index}
          style={{
            backgroundColor:
              row.SrNo === "Grand Total" ? "#00FFFF" : "#E1F5FE",
            fontWeight: row.SrNo === "Grand Total" ? "bold" : "normal",
          }}
        >
          <TableCell>{row.SrNo}</TableCell>
          <TableCell>{row.WardNo}</TableCell>
          <TableCell>{row.TotalProperty}</TableCell>
          <TableCell>{row.FinanceYear}</TableCell>
          <TableCell>{row.PropertyTax || 0}</TableCell>
          <TableCell>{row.EducationTax || 0}</TableCell>
          <TableCell>{row.EmploymentTax || 0}</TableCell>
          <TableCell>{row.SpEducationTax || 0}</TableCell>
          <TableCell>{row.TreeCess || 0}</TableCell>
          <TableCell>{row.Sanitation || 0}</TableCell>
          <TableCell>{row.DrainCess || 0}</TableCell>
          <TableCell>{row.SpWaterCess || 0}</TableCell>
          <TableCell>{row.RoadCess || 0}</TableCell>
          <TableCell>{row.FireCess || 0}</TableCell>
          <TableCell>{row.LightCess || 0}</TableCell>
          <TableCell>{row.WaterBill || 0}</TableCell>
          <TableCell>{row.MajorBuilding || 0}</TableCell>
          <TableCell>{row.SewageDispCess || 0}</TableCell>
          <TableCell>{row.Tax1 || 0}</TableCell>
          <TableCell>{row.Tax2 || 0}</TableCell>
          <TableCell>{row.Tax3 || 0}</TableCell>
          <TableCell>{row.Tax4 || 0}</TableCell>
          <TableCell>{row.Tax5 || 0}</TableCell>
          <TableCell>{row.MiscellaneousFee || 0}</TableCell>
          <TableCell>{row.Interest || 0}</TableCell>
          <TableCell>{row.NoticeFee || 0}</TableCell>
          <TableCell>{row.WarrentFee || 0}</TableCell>
          <TableCell>{row.NetTotal || 0}</TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={27} style={{ textAlign: "center", color: "red" }}>
          No Current Outstanding Data
        </TableCell>
      </TableRow>
    )}
  </>
)}

{/* total collection */}
  {selectDemand === "Total Collection" && (
    <>
      {combinedCollectionData.length > 0 ? (
        combinedCollectionData.map((row, i) => (
          <TableRow
            key={i}
            style={{
              backgroundColor:
                row.SrNo === "Total"
                  ? "#00FFFF"
                  : row.SrNo === "Pending Collection"
                  ? "#FFFACD"
                  : "#E0FFFF",
              fontWeight: row.SrNo === "Total" ? "bold" : "normal",
            }}
          >
            <TableCell>{row.SrNo}</TableCell>
            <TableCell>{row.WardNo}</TableCell>
            <TableCell>{row.TotalProperty ||0}</TableCell>
                      <TableCell>{row.FinanceYear || financeYear}</TableCell>

            <TableCell>{row.PropertyTax ||0}</TableCell>
            <TableCell>{row.EducationTax ||0}</TableCell>
            <TableCell>{row.EmploymentTax ||0}</TableCell>
            <TableCell>{row.SpEducationTax ||0}</TableCell>
            <TableCell>{row.TreeCess ||0}</TableCell>
            <TableCell>{row.Sanitation ||0}</TableCell>
            <TableCell>{row.DrainCess ||0}</TableCell>
            <TableCell>{row.SpWaterCess ||0}</TableCell>
            <TableCell>{row.RoadCess ||0}</TableCell>
            <TableCell>{row.FireCess ||0}</TableCell>
            <TableCell>{row.LightCess ||0}</TableCell>
            <TableCell>{row.WaterBill ||0}</TableCell>
            <TableCell>{row.MajorBuilding ||0}</TableCell>
            <TableCell>{row.SewageDispCess ||0}</TableCell>
            <TableCell>{row.Tax1 ||0}</TableCell>
            <TableCell>{row.Tax2 ||0}</TableCell>
            <TableCell>{row.Tax3 ||0}</TableCell>
            <TableCell>{row.Tax4 ||0}</TableCell>
            <TableCell>{row.Tax5 ||0}</TableCell>
            <TableCell>{row.MiscellaneousFee ||0}</TableCell>
            <TableCell>{row.Interest ||0}</TableCell>
            <TableCell>{row.NoticeFee ||0}</TableCell>
            <TableCell>{row.WarrentFee ||0}</TableCell>
            <TableCell>{row.NetTotal ||0}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={27} style={{ textAlign: "center", color: "red" }}>
            No data available
          </TableCell>
        </TableRow>
      )}


    </>
  )}
{/* Pending Outstanding */}
{selectDemand === "Out Standing Pending Balance" && (
  <>
    {pendingOutstandingData.length > 0 &&
    pendingOutstandingData.some(row =>
      row.PropertyTax > 0 ||
      row.EducationTax > 0 ||
      row.EmploymentTax > 0 ||
      row.SpEducationTax > 0 ||
      row.TreeCess > 0 ||
      row.Sanitation > 0 ||
      row.DrainCess > 0 ||
      row.SpWaterCess > 0 ||
      row.RoadCess > 0 ||
      row.FireCess > 0 ||
      row.LightCess > 0 ||
      row.WaterBill > 0 ||
      row.MajorBuilding > 0 ||
      row.SewageDispCess > 0 ||
      row.Tax1 > 0 ||
      row.Tax2 > 0 ||
      row.Tax3 > 0 ||
      row.Tax4 > 0 ||
      row.Tax5 > 0 ||
      row.MiscellaneousFee > 0 ||
      row.Interest > 0 ||
      row.NoticeFee > 0 ||
      row.WarrentFee > 0 ||
      row.NetTotal > 0
    ) ? (
      // Show Pending Outstanding Rows
      pendingOutstandingData.map((row, index) => {
        const isGrandTotal = row.SrNo === " Total";
        return (
          <TableRow
            key={row.OwnerID || index}
            style={{ backgroundColor: isGrandTotal ? "#FFDAB1" : "#E1F5FE", fontWeight: isGrandTotal ? "bold" : "normal" }}
          >
            <TableCell>{row.SrNo}</TableCell>
            <TableCell>{row.WardNo}</TableCell>
            <TableCell>{row.TotalProperty}</TableCell>
            <TableCell>{row.FinanceYear || financeYear}</TableCell>
            <TableCell>{row.PropertyTax || 0}</TableCell>
            <TableCell>{row.EducationTax || 0}</TableCell>
            <TableCell>{row.EmploymentTax || 0}</TableCell>
            <TableCell>{row.SpEducationTax || 0}</TableCell>
            <TableCell>{row.TreeCess || 0}</TableCell>
            <TableCell>{row.Sanitation || 0}</TableCell>
            <TableCell>{row.DrainCess || 0}</TableCell>
            <TableCell>{row.SpWaterCess || 0}</TableCell>
            <TableCell>{row.RoadCess || 0}</TableCell>
            <TableCell>{row.FireCess || 0}</TableCell>
            <TableCell>{row.LightCess || 0}</TableCell>
            <TableCell>{row.WaterBill || 0}</TableCell>
            <TableCell>{row.MajorBuilding || 0}</TableCell>
            <TableCell>{row.SewageDispCess || 0}</TableCell>
            <TableCell>{row.Tax1 || 0}</TableCell>
            <TableCell>{row.Tax2 || 0}</TableCell>
            <TableCell>{row.Tax3 || 0}</TableCell>
            <TableCell>{row.Tax4 || 0}</TableCell>
            <TableCell>{row.Tax5 || 0}</TableCell>
            <TableCell>{row.MiscellaneousFee || 0}</TableCell>
            <TableCell>{row.Interest || 0}</TableCell>
            <TableCell>{row.NoticeFee || 0}</TableCell>
            <TableCell>{row.WarrentFee || 0}</TableCell>
            <TableCell>{row.NetTotal || 0}</TableCell>

            {/* Optional Columns */}
            {oldTax && <TableCell>{row.oldTax || 0}</TableCell>}
            {oldPropTax && <TableCell>{row.oldPropTax || 0}</TableCell>}
            {newRv && <TableCell>{row.newRv || 0}</TableCell>}
            {newPropTax && <TableCell>{row.newPropTax || 0}</TableCell>}
            {newTax && <TableCell>{row.newTax || 0}</TableCell>}
          </TableRow>
        );
      })
    ) : (
      // No data
      <TableRow>
        <TableCell colSpan={30} style={{ textAlign: "center", color: "red" }}>
          No pending outstanding data available
        </TableCell>
      </TableRow>
    )}
  </>
)}

{/* total demand */}
{selectDemand === "Out Standing Total Balance" && (
  <>
    {totalOutstandingData.length > 0 ? (
      totalOutstandingData.map((row, i) => (
        <TableRow
          key={i}
          style={{
            backgroundColor:
              row.SrNo === "Total"
                ? "#00FFFF"
                : row.SrNo === "Out Standing Pending Balance"
                ? "#FFFACD"
                : "#E0FFFF",
            fontWeight: row.SrNo === "Total" ? "bold" : "normal",
          }}
        >
          <TableCell>{row.SrNo}</TableCell>
          <TableCell>{row.WardNo}</TableCell>
          <TableCell>{row.TotalProperty || 0}</TableCell>
          <TableCell>{row.FinanceYear || financeYear}</TableCell>

          <TableCell>{row.PropertyTax || 0}</TableCell>
          <TableCell>{row.EducationTax || 0}</TableCell>
          <TableCell>{row.EmploymentTax || 0}</TableCell>
          <TableCell>{row.SpEducationTax || 0}</TableCell>
          <TableCell>{row.TreeCess || 0}</TableCell>
          <TableCell>{row.Sanitation || 0}</TableCell>
          <TableCell>{row.DrainCess || 0}</TableCell>
          <TableCell>{row.SpWaterCess || 0}</TableCell>
          <TableCell>{row.RoadCess || 0}</TableCell>
          <TableCell>{row.FireCess || 0}</TableCell>
          <TableCell>{row.LightCess || 0}</TableCell>
          <TableCell>{row.WaterBill || 0}</TableCell>
          <TableCell>{row.MajorBuilding || 0}</TableCell>
          <TableCell>{row.SewageDispCess || 0}</TableCell>
          <TableCell>{row.Tax1 || 0}</TableCell>
          <TableCell>{row.Tax2 || 0}</TableCell>
          <TableCell>{row.Tax3 || 0}</TableCell>
          <TableCell>{row.Tax4 || 0}</TableCell>
          <TableCell>{row.Tax5 || 0}</TableCell>
          <TableCell>{row.MiscellaneousFee || 0}</TableCell>
          <TableCell>{row.Interest || 0}</TableCell>
          <TableCell>{row.NoticeFee || 0}</TableCell>
          <TableCell>{row.WarrentFee || 0}</TableCell>
          <TableCell>{row.NetTotal || 0}</TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={27} style={{ textAlign: "center", color: "red" }}>
          No data available
        </TableCell>
      </TableRow>
    )}
  </>
)}

{/* Advance Collection */}
{selectDemand === "Advance Collection" && (
  <>
    {advanceCollectionData.length > 0 &&
    advanceCollectionData.some(row =>
      row.PropertyTax > 0 ||
      row.EducationTax > 0 ||
      row.EmploymentTax > 0 ||
      row.TreeCess > 0 ||
      row.Sanitation > 0 ||
      row.DrainCess > 0 ||
      row.SpWaterCess > 0 ||
      row.RoadCess > 0 ||
      row.FireCess > 0 ||
      row.LightCess > 0 ||
      row.WaterBill > 0 ||
      row.WaterBenefit > 0 ||
      row.MajorBuilding > 0 ||
      row.SewageDisp > 0 ||
      row.MiscellaneousFee > 0 ||
      row.Interest > 0 ||
      row.NoticeFee > 0 ||
      row.WarrentFee > 0 ||
      row.NetTotal > 0
    ) ? (
      // Show Current Collection Rows
      advanceCollectionData.map((row, index) => (
        <TableRow key={row.OwnerID || index} style={{ backgroundColor: "#E1F5FE" }}>
          <TableCell>{selectDemand}</TableCell>
          <TableCell>{row.NewWardNo}</TableCell>
          <TableCell>{row.NewPropertyNo}</TableCell>
          <TableCell>{row.FinanceYear || financeYear}</TableCell>
           {oldRv && <TableCell>{row.OldRv || 0}</TableCell>}
          {oldTax && <TableCell>{row.OldTax || 0}</TableCell>}
          {oldPropTax && <TableCell>{row.OldPropTax || 0}</TableCell>}
          {newRv && <TableCell>{row.NewRv || 0}</TableCell>}
          {newTax && <TableCell>{row.NewTax || 0}</TableCell>}
          {newPropTax && <TableCell>{row.NewPropTax || 0}</TableCell>}
         
          <TableCell>{row.PropertyTax || 0}</TableCell>
          <TableCell>{row.EducationTax || 0}</TableCell>
          <TableCell>{row.EmploymentTax || 0}</TableCell>
           <TableCell>{row.TreeCess || 0}</TableCell>
          <TableCell>{row.Sanitation || 0}</TableCell>
          <TableCell>{row.DrainCess || 0}</TableCell>
          <TableCell>{row.SpWaterCess || 0}</TableCell>
          <TableCell>{row.RoadCess || 0}</TableCell>
          <TableCell>{row.FireCess || 0}</TableCell>
          <TableCell>{row.LightCess || 0}</TableCell>
          <TableCell>{row.WaterBill || 0}</TableCell>
          <TableCell>{row.WaterBenefit || 0}</TableCell>

          <TableCell>{row.MajorBuilding || 0}</TableCell>
          <TableCell>{row.SewageDisp || 0}</TableCell>
          <TableCell>{row.Tax1 || 0}</TableCell>
          <TableCell>{row.Tax2 || 0}</TableCell>
          <TableCell>{row.Tax3 || 0}</TableCell>
          <TableCell>{row.Tax4 || 0}</TableCell>
          <TableCell>{row.Tax5 || 0}</TableCell>

          <TableCell>{row.MiscellaneousFee || 0}</TableCell>
          <TableCell>{row.Interest || 0}</TableCell>
          <TableCell>{row.NoticeFee || 0}</TableCell>
          <TableCell>{row.WarrentFee || 0}</TableCell>
          <TableCell>{row.NetTotal || 0}</TableCell>
        </TableRow>
      ))
    ) : (
      // No Current Collection Data
      <TableRow>
        <TableCell colSpan={22} style={{ textAlign: "center", color: "red" }}>
          No current collection data available
        </TableCell>
      </TableRow>
    )}

    {/* Current Collection Total Row */}
    {totalAdvanceCollection.length > 0 && (
      <TableRow style={{ backgroundColor: "#FFDAB1", fontWeight: "bold" }}>
        <TableCell>{totalAdvanceCollection[0].SrNo}</TableCell>
        <TableCell>{totalAdvanceCollection[0].WardNo}</TableCell>
        <TableCell>{totalAdvanceCollection[0].TotalProperty}</TableCell>
        <TableCell>{financeYear}</TableCell>
        {oldRv && <TableCell>{totalAdvanceCollection[0].oldRv}</TableCell>}
        {oldTax && <TableCell>{totalAdvanceCollection[0].oldTax}</TableCell>}
        {oldPropTax && <TableCell>{totalAdvanceCollection[0].oldPropTax}</TableCell>}
        {newRv && <TableCell>{totalAdvanceCollection[0].newRv}</TableCell>}
        {newTax && <TableCell>{totalAdvanceCollection[0].newTax}</TableCell>}
        {newPropTax && <TableCell>{totalAdvanceCollection[0].newPropTax}</TableCell>}

        <TableCell>{totalAdvanceCollection[0].Property}</TableCell>
        <TableCell>{totalAdvanceCollection[0].Education}</TableCell>
        <TableCell>{totalAdvanceCollection[0].Employment}</TableCell>
        <TableCell>{totalAdvanceCollection[0].TreeCess}</TableCell>
        <TableCell>{totalAdvanceCollection[0].Sanitation}</TableCell>
        <TableCell>{totalAdvanceCollection[0].DrainCess}</TableCell>
        <TableCell>{totalAdvanceCollection[0].SpWaterCess}</TableCell>
        <TableCell>{totalAdvanceCollection[0].RoadCess}</TableCell>
        <TableCell>{totalAdvanceCollection[0].FireCess}</TableCell>
        <TableCell>{totalAdvanceCollection[0].LightCess}</TableCell>
        <TableCell>{totalAdvanceCollection[0].WaterBill}</TableCell>
        <TableCell>{totalAdvanceCollection[0].WaterBenefit}</TableCell>

        <TableCell>{totalAdvanceCollection[0].MajorBuilding}</TableCell>
        <TableCell>{totalAdvanceCollection[0].SewageDisp}</TableCell>
        <TableCell>{totalAdvanceCollection[0].Tax1}</TableCell>
        <TableCell>{totalAdvanceCollection[0].Tax2}</TableCell>
        <TableCell>{totalAdvanceCollection[0].Tax3}</TableCell>
        <TableCell>{totalAdvanceCollection[0].Tax4}</TableCell>
        <TableCell>{totalAdvanceCollection[0].Tax5}</TableCell>
        
        <TableCell>{totalAdvanceCollection[0].MiscFee}</TableCell>
<TableCell>{totalAdvanceCollection[0].Interest}</TableCell>
<TableCell>{totalAdvanceCollection[0].NoticeFee}</TableCell>
<TableCell>{totalAdvanceCollection[0].WarrentFee}</TableCell>
<TableCell>{totalAdvanceCollection[0].NetTotal}</TableCell>   </TableRow>
    )}
  </>
)}

{/* misc fee */}
{isMisc && miscTableData.length > 0 && (
  <>
    {miscTableData.map((row, index) => (
      <TableRow key={index}>
        <TableCell>{selectDemand}</TableCell>
        <TableCell>{row.NewWardNo}</TableCell>
        <TableCell>{row.TotalProperty}</TableCell>
        <TableCell>{row.FinanceYear || financeYear}</TableCell>
        <TableCell>{row.Type}</TableCell>
        <TableCell>{row.MiscellaneousFee ||0 }</TableCell>
      </TableRow>
    ))}
  </>
)}

{selectDemand === "Ghoshwara" && showGhoshwaraTable && (
  <>
    {combinedGhoshwaraData && combinedGhoshwaraData.length > 0 ? (
      combinedGhoshwaraData.map((row, index) => (
        <TableRow
          key={index}
          sx={{
            backgroundColor: row?.SrNo?.includes("Total") ? "#9bf6ff" : "white",
            fontWeight: row?.SrNo?.includes("Total") ? "bold" : "normal",
          }}
        >
          <TableCell>{row?.SrNo || "-"}</TableCell>
          <TableCell>{row?.WardNo || "-"}</TableCell>
          <TableCell>{row.TotalProperty || "-"}</TableCell>
          <TableCell>{row.FinanceYear || financeYear || year}</TableCell>
          <TableCell>{row?.PropertyTax || 0}</TableCell>
          <TableCell>{row?.EducationTax || 0}</TableCell>
          <TableCell>{row?.EmploymentTax || 0}</TableCell>
          <TableCell>{row?.TreeCess || 0}</TableCell>
          <TableCell>{row?.DrainCess || 0}</TableCell>
          <TableCell>{row?.Sanitation || 0}</TableCell>
          <TableCell>{row?.SpWaterCess || 0}</TableCell>
          <TableCell>{row?.RoadCess || 0}</TableCell>
          <TableCell>{row?.FireCess || 0}</TableCell>
          <TableCell>{row?.LightCess || 0}</TableCell>
          <TableCell>{row?.WaterBill || 0}</TableCell>
          <TableCell>{row?.WaterBenefit || 0}</TableCell>
          <TableCell>{row?.MajorBuilding || 0}</TableCell>
          <TableCell>{row?.SewageDisp || 0}</TableCell>
          <TableCell>{row?.Tax1 || 0}</TableCell>
          <TableCell>{row?.Tax2 || 0}</TableCell>
          <TableCell>{row?.Tax3 || 0}</TableCell>
          <TableCell>{row?.Tax4 || 0}</TableCell>
          <TableCell>{row?.Tax5 || 0}</TableCell>
          <TableCell>{row?.MiscellaneousFee || 0}</TableCell>
          <TableCell>{row?.Interest || 0}</TableCell>
          <TableCell>{row?.NoticeFee || 0}</TableCell>
          <TableCell>{row?.WarrentFee || 0}</TableCell>
          <TableCell>{row?.NetTotal || 0}</TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={28} align="center">
          Sorry, no data available
        </TableCell>
      </TableRow>
    )}
  </>
)}



      </TableBody>
    </Table>
  </Box>
)}



          </MainCard>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>AMC Calculations</DialogTitle>
  <DialogContent>
    <Typography>Please select at least one Ward , Property Description , Select Demand and Year </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} color="primary">
      OK
    </Button>
  </DialogActions>
</Dialog>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default WardWise;
