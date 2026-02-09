import PropertyMast from "../../../models/models/propertymast.js";
import sequelize from "../../../config/connectionDB.js";
import { Op, fn,col } from "sequelize";
import TransMast from "../../../models/models/transmast.js";
import { QueryTypes } from "sequelize";
import { TaxPendingDetails } from "../../../models/models/taxpendingdetails.js";
import BillTransactionDetails from "../../../models/models/billtransactiondetails.js";
import BillTransactionDetailsAdvance from "../../../models/models/billtransactiondetailsadvance.js";

// export const getOwnersByWardAndPropertyDesc = async (req, res) => {
//   try {
//     const { wardNo, propertyTypeID, financialYear } = req.body;

//     if (!wardNo || !propertyTypeID) {
//       return res.status(400).json({ message: "wardNo and propertyTypeID are required" });
//     }

//     // Step 1: Filter PropertyMast by ward and property type
//     const propertyOwners = await PropertyMast.findAll({
//       attributes: [
//         "OwnerID",
//         "NewWardNo",
//         "NewPropertyNo",
//         "NewPartitionNo",
//         "PropertyTypeID",
//         "OwnerName",
//         "Address"
//       ],
//       where: {
//         NewWardNo: { [Op.in]: wardNo },
//         PropertyTypeID: { [Op.in]: propertyTypeID }
//       },
//       order: [["NewPropertyNo", "ASC"]],
//       raw: true
//     });

//     let ownerIds = propertyOwners.map(o => o.OwnerID);

//     // Step 2: Filter by financial year (single year or range)
//     if (financialYear) {
//       let financeYearCondition;
//       if (financialYear.includes('-')) {
//         const [fromYear, toYear] = financialYear.split('-').map(y => parseInt(y, 10));
//         financeYearCondition = { [Op.between]: [fromYear, toYear] };
//       } else {
//         financeYearCondition = parseInt(financialYear, 10);
//       }

//       const transOwners = await TransMast.findAll({
//         attributes: ['OwnerID'],
//         where: {
//           OwnerID: { [Op.in]: ownerIds },
//           FinanceYear: financeYearCondition
//         },
//         raw: true
//       });

//       ownerIds = transOwners.map(o => o.OwnerID);
//     }

//     // Step 3: Remove duplicates
//     ownerIds = [...new Set(ownerIds)];

//     res.json({
//       ownerIds,
//       details: propertyOwners.filter(o => ownerIds.includes(o.OwnerID))
//     });
//   } catch (error) {
//     console.error("Error fetching owners:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

//current demand

//sucee 
export const getOwnersByWardAndPropertyDesc = async (req, res) => {
  try {
    const { wardNo, propertyTypeID, financialYear } = req.body;

    if (!wardNo || !propertyTypeID) {
      return res.status(400).json({ message: "wardNo and propertyTypeID are required" });
    }

    // Step 1: Fetch full property details
    const propertyOwners = await PropertyMast.findAll({
      where: {
        NewWardNo: { [Op.in]: wardNo },
        PropertyTypeID: { [Op.in]: propertyTypeID }
      },
      order: [["NewPropertyNo", "ASC"]],
      raw: true
    });

    // Step 2: Filter by financial year (optional)
    let filteredOwnerIDs = propertyOwners.map(o => o.OwnerID);
    if (financialYear) {
      let financeYearCondition;
      if (financialYear.includes('-')) {
        const [fromYear, toYear] = financialYear.split('-').map(y => parseInt(y, 10));
        financeYearCondition = { [Op.between]: [fromYear, toYear] };
      } else {
        financeYearCondition = parseInt(financialYear, 10);
      }

      const transOwners = await TransMast.findAll({
        attributes: ['OwnerID'],
        where: {
          OwnerID: { [Op.in]: filteredOwnerIDs },
          FinanceYear: financeYearCondition
        },
        raw: true
      });

      filteredOwnerIDs = transOwners.map(o => o.OwnerID);
    }

    // Step 3: Return full property details for filtered OwnerIDs
    const details = propertyOwners.filter(o => filteredOwnerIDs.includes(o.OwnerID));

    res.json({ details });
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getCurrentDemandByOwner = async (req, res) => {
  try {
    let { OwnerID, p_Year } = req.body;

    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: "⚠️ OwnerID is required" });
    }

    // Convert array to comma-separated string for SP
    if (Array.isArray(OwnerID)) {
      OwnerID = OwnerID.join(",");
    }

    const replacements = {
      p_WardNo: "ALL",
      p_FromPropertyNo: null,
      p_ToPropertyNo: null,
      p_PartitionNo: null,
      p_Mode: "WithPartition",
      p_OwnerIDList: OwnerID,
      p_Year: p_Year || new Date().getFullYear(),
    };

    // Execute stored procedure
    const spResults = await sequelize.query(
      `CALL funAMCGetCurrentDemand(
        :p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo, 
        :p_PartitionNo, :p_Mode, :p_OwnerIDList, :p_Year
      );`,
      { replacements, type: sequelize.QueryTypes.SELECT }
    );

    console.log("Raw SP Results:", spResults);

    // Extract only the actual rows (first object) and ignore metadata
    const dataRows = spResults.length && typeof spResults[0] === "object" 
      ? Object.values(spResults[0]) 
      : [];

    if (!dataRows.length) {
      return res.status(404).json({
        message: "❌ No current demand found for this OwnerID",
        OwnerID: OwnerID.split(",").map((id) => Number(id)),
        Year: replacements.p_Year,
      });
    }

    // Success response: clean array of rows
    return res.status(200).json(dataRows);
  } catch (error) {
    console.error("Error fetching current demand:", error);
    return res.status(500).json({ message: "🔥 Server error", error: error.message });
  }
};
//pendingDemand
export const getPendingTaxByOwnerAndYear = async (req, res) => {
  try {
    let { ownerID, year } = req.body;

    if (!ownerID || !year) {
      return res.status(400).json({ message: "OwnerID and Year are required" });
    }

    // Ensure ownerID is an array
    if (!Array.isArray(ownerID)) {
      ownerID = [ownerID];
    }

    // Subtract 1 from year
    const queryYear = parseInt(year) - 1;

    // Fetch pending taxes for all OwnerIDs for previous year
    const pendingTaxes = await TaxPendingDetails.findAll({
      where: {
        OwnerID: { [Op.in]: ownerID },
        PendingYear: queryYear
      },
      order: [['TPDID', 'ASC']]
    });

    if (!pendingTaxes.length) {
      return res.status(404).json({ message: `No pending tax found for OwnerIDs in year ${queryYear}` });
    }

    res.json(pendingTaxes);

  } catch (error) {
    console.error("Error fetching pending tax:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// export const getPendingTaxByOwnerAndYear = async (req, res) => {
//   try {
//     let { OwnerID, year } = req.body;

//     if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
//       return res.status(400).json({ message: "⚠️ OwnerID is required" });
//     }

//     // Convert array to comma-separated string for SP
//     if (Array.isArray(OwnerID)) {
//       OwnerID = OwnerID.join(",");
//     }

//     // Subtract 1 year
//     const yearToQuery = year ? parseInt(year) : new Date().getFullYear();

//     const replacements = {
//       p_WardNo: "ALL",
//       p_FromPropertyNo: null,
//       p_ToPropertyNo: null,
//       p_PartitionNo: null,
//       p_Mode: "WithPartition",
//       p_OwnerIDList: OwnerID,
//       p_Year: yearToQuery,
//     };

//     // Execute stored procedure
//     const spResults = await sequelize.query(
//       `CALL funAMCGetPendingDemand(
//         :p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo, 
//         :p_PartitionNo, :p_Mode, :p_OwnerIDList, :p_Year
//       );`,
//       { replacements, type: sequelize.QueryTypes.SELECT }
//     );

//     console.log("Raw SP Results:", spResults);

//     // Extract only the actual rows (first object) and ignore metadata
//     const dataRows = spResults.length && typeof spResults[0] === "object" 
//       ? Object.values(spResults[0]) 
//       : [];

//     if (!dataRows.length) {
//       return res.status(404).json({
//         message: "❌ No Pending demand found for this OwnerID",
//         OwnerID: OwnerID.split(",").map((id) => Number(id)),
//         Year: yearToQuery,
//       });
//     }

//     // Success response: clean array of rows
//     return res.status(200).json(dataRows);
//   } catch (error) {
//     console.error("Error fetching Pending demand:", error);
//     return res.status(500).json({ message: "🔥 Server error", error: error.message });
//   }
// };

export const getCurrentCollectionByOwner = async (req, res) => {
  try {
    let { ownerID, year } = req.body;

    if (!ownerID || !year) {
      return res.status(400).json({ message: "OwnerID and Year are required" });
    }

    // Fetch records for multiple ownerIDs
    const collections = await BillTransactionDetails.findAll({
      where: {
        OwnerID: ownerID,
        [Op.or]: [
          { FinanceYear: year },
        ]
      }
    });

    if (!collections || collections.length === 0) {
      return res.status(404).json({ message: "No collection found for given OwnerIDs and Year" });
    }

    // Merge records by OwnerID
    const ownerTotals = ownerID.map(id => {
      const records = collections.filter(c => c.OwnerID === id);

      if (!records || records.length === 0) return null;

      const total = {};
      const numericFields = [
        "PropertyTax", "EducationTax", "EmploymentTax", "TreeCess", "SpWaterCess",
        "Sanitation", "DrainCess", "RoadCess", "FireCess", "LightCess", "WaterBenefit",
        "MajorBuilding", "SewageDisposalCess", "SpEducationTax", "WaterBill",
        "Tax1", "Tax2", "Tax3", "Tax4", "Tax5", "TaxTotal", "Interest",
        "Discount", "Noticefee", "WarrentFee", "MiscellaneousFee", "NetTotal",
        "GrpOneInterestDiscount"
      ];

      // Initialize totals
      numericFields.forEach(f => total[f] = 0);
      total.OwnerID = id;
      total.FinanceYear = year;

      // Sum up numeric fields
      for (let r of records) {
        numericFields.forEach(f => {
          if (r[f] != null) total[f] += parseFloat(r[f]);
        });
      }

      // Only return if total is non-zero
      const hasValue = Object.values(total).some(val => typeof val === "number" && val > 0);
      return hasValue ? total : null;
    });

    // Filter out nulls (OwnerIDs with all zero amounts)
    const filtered = ownerTotals.filter(o => o !== null);

    res.json(filtered);

  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//pending collection 

export const getPendingCollectionByOwner = async (req, res) => {
  try {
    let { ownerID, pendingYear } = req.body;

    if (!ownerID || !pendingYear) {
      return res.status(400).json({ message: "OwnerID and PendingYear are required" });
    }

    // Make sure ownerID is an array
    if (!Array.isArray(ownerID)) ownerID = [ownerID];
    const queryYear = parseInt(pendingYear) - 1;

    // Fetch records for multiple ownerIDs for the pending year
    const collections = await BillTransactionDetails.findAll({
      where: {
        OwnerID: { [Op.in]: ownerID },
        PendingYear: queryYear     
      },
      order: [['BTId', 'ASC']] 
    });

    if (!collections || collections.length === 0) {
      return res.status(404).json({ message: "No pending data found for given OwnerIDs and PendingYear" });
    }

    // Return all rows directly without merging
    res.json(collections);

  } catch (error) {
    console.error("Error fetching pending collection:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//OutStanding current Balance

export const getCurrentBalanceByOwner = async (req, res) => {
  try {
    let { OwnerID, p_Year, p_from_date, p_to_date } = req.body;

    // Validation
    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: "⚠️ OwnerID is required" });
    }

    // Convert array to comma-separated string for SP
    if (Array.isArray(OwnerID)) {
      OwnerID = OwnerID.join(",");
    }

    const replacements = {
      p_WardNo: "ALL",          
      p_FromPropertyNo: null,
      p_ToPropertyNo: null,
      p_PartitionNo: null,
      p_Mode: "WithPartition",
      p_OwnerIDList: OwnerID,
      p_Year: p_Year || new Date().getFullYear(),
      p_from_date: p_from_date || null,
      p_to_date: p_to_date || null,
    };

    // Call stored procedure
    const spResults = await sequelize.query(
      `CALL funAMCGetCurrentBalance(
        :p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo, 
        :p_PartitionNo, :p_Mode, :p_OwnerIDList, :p_Year, 
        :p_from_date, :p_to_date
      );`,
      { replacements, type: sequelize.QueryTypes.SELECT }
    );

    console.log("Raw SP Results:", spResults);

    // Extract actual rows (temp_currentBalance results are usually first element)
    const dataRows = spResults.length && typeof spResults[0] === "object"
      ? Object.values(spResults[0])
      : [];

    if (!dataRows.length) {
      return res.status(404).json({
        message: "❌ No current balance found for this OwnerID",
        OwnerID: OwnerID.split(",").map((id) => Number(id)),
        Year: replacements.p_Year,
      });
    }

    // Success response
    return res.status(200).json(dataRows);

  } catch (error) {
    console.error("Error fetching current balance:", error);
    return res.status(500).json({ message: "🔥 Server error", error: error.message });
  }
};


export const getPendingBalanceByOwner = async (req, res) => {
  try {
    let { ownerID, pendingYear } = req.body;

    if (!ownerID || !pendingYear) {
      return res.status(400).json({ message: "OwnerID and PendingYear are required" });
    }

    if (!Array.isArray(ownerID)) ownerID = [ownerID];
    ownerID = ownerID.map(Number);
    const queryYear = parseInt(pendingYear) - 1;

    const fetchOwnerPending = async (id) => {
      const result = await sequelize.query(
        `CALL funAMCGetPendingBalance(
          :p_WardNo,
          :p_FromPropertyNo,
          :p_ToPropertyNo,
          :p_PatiotionNo,
          :p_Mode,
          :p_OwnerID,
          :p_Year,
          :p_from_date,
          :p_to_date
        );`,
        {
          replacements: {
            p_WardNo: '',
            p_FromPropertyNo: null,
            p_ToPropertyNo: null,
            p_PatiotionNo: '',
            p_Mode: '',
            p_OwnerID: id,
            p_Year: parseInt(pendingYear),
            p_from_date: null,
            p_to_date: null
          },
          type: QueryTypes.RAW
        }
      );

      // result may be [ [rows], metadata ] or just [rows], handle both
      let rows = Array.isArray(result) ? result[0] : result;
      if (!rows || rows.length === 0) {
        return { OwnerID: id, message: `No pending balance for ${queryYear}` };
      }

      // Make sure rows is always an array
      if (!Array.isArray(rows)) rows = [rows];

      return rows.map(row => {
        const allZero = Object.keys(row).every(key => {
          if (['OwnerID', 'FinanceYear', 'PendingYear'].includes(key)) return true;
          return Number(row[key]) === 0;
        });

        if (allZero) {
          return { OwnerID: row.OwnerID, message: `No pending balance for ${queryYear}` };
        } else {
          return row;
        }
      });
    };

    const allResultsNested = await Promise.all(ownerID.map(fetchOwnerPending));
    const allResults = allResultsNested.flat();

    res.json(allResults);

  } catch (error) {
    console.error("Error fetching pending balance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



//miscellou

export const getMiscellaneousFeesByOwner = async (req, res) => {
  try {
    const { ownerID, year } = req.body;

    if (!ownerID || !year) {
      return res.status(400).json({ message: "OwnerID and Year are required" });
    }

    // Fetch all records for given owner(s) and year
    const records = await BillTransactionDetails.findAll({
      where: {
        OwnerID: ownerID,
        FinanceYear: year
      },
      attributes: ["OwnerID", "FinanceYear", "PendingYear", "MiscellaneousFee", "BTId"],
      order: [["BTId", "ASC"]]
    });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No records found for given OwnerIDs and Year" });
    }

    const ownerTotals = ownerID.map(id => {
      const ownerRecords = records.filter(r => r.OwnerID === id);
      if (!ownerRecords || ownerRecords.length === 0) return null;

      const result = [];

      // Current: PendingYear = FinanceYear
      const currentRecords = ownerRecords.filter(r => r.PendingYear === year);
      if (currentRecords.length > 0) {
        const currentTotal = { OwnerID: id, FinanceYear: year, Type: "Current", MiscellaneousFee: 0 };
        currentRecords.forEach(r => {
          if (r.MiscellaneousFee != null) currentTotal.MiscellaneousFee += parseFloat(r.MiscellaneousFee);
        });
        result.push(currentTotal);
      }

      // Pending: PendingYear < FinanceYear
      const pendingRecords = ownerRecords.filter(r => r.PendingYear < year);
      if (pendingRecords.length > 0) {
        // Group by PendingYear in case multiple years exist
        const pendingByYear = {};
        pendingRecords.forEach(r => {
          const py = r.PendingYear;
          if (!pendingByYear[py]) pendingByYear[py] = 0;
          if (r.MiscellaneousFee != null) pendingByYear[py] += parseFloat(r.MiscellaneousFee);
        });

        // Convert grouped totals to array
        for (const py in pendingByYear) {
          result.push({
            OwnerID: id,
            PendingYear: parseInt(py), 
            Type: "Pending",
            MiscellaneousFee: pendingByYear[py]
          });
        }
      }

      return result;
    });

    const flattened = ownerTotals.flat().filter(o => o !== null);

    res.json(flattened);

  } catch (error) {
    console.error("Error fetching miscellaneous fees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// //advance
export const getAdvanceCollectionByOwner = async (req, res) => {
  try {
    let { ownerID, FinanceYear } = req.body;

    if (!ownerID || !FinanceYear) {
      return res.status(400).json({ message: "OwnerID and PendingYear are required" });
    }

    // Make sure ownerID is an array
    if (!Array.isArray(ownerID)) ownerID = [ownerID];

    // Fetch records for multiple ownerIDs for the pending year
    const collections = await BillTransactionDetailsAdvance.findAll({
      where: {
        OwnerID: { [Op.in]: ownerID },
        FinanceYear: FinanceYear    
      },
      order: [['BTId', 'ASC']]
    });

    if (!collections || collections.length === 0) {
      return res.status(404).json({ message: "No Advance collection data found for given OwnerIDs and PendingYear" });
    }

    res.json(collections);

  } catch (error) {
    console.error("Error fetching Advance  collection:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const getAdvanceCollectionByOwner = async (req, res) => {
//   try {
//     let { ownerID, FinanceYear } = req.body;

//     if (!ownerID || !FinanceYear) {
//       return res.status(400).json({ message: "OwnerID and FinanceYear are required" });
//     }

//     // Ensure ownerID is an array
//     if (!Array.isArray(ownerID)) ownerID = [ownerID];

//     const year = Number(FinanceYear);

//     // Fetch all records for requested OwnerIDs
//     const collections = await BillTransactionDetailsAdvance.findAll({
//       where: {
//         OwnerID: { [Op.in]: ownerID },
//         FinanceYear: year
//       },
//       order: [['BTId', 'ASC']]
//     });

//     // Organize data per OwnerID
//     const result = ownerID.map(id => ({
//       OwnerID: id,
//       data: collections.filter(item => item.OwnerID === id)
//     }));

//     res.json(result);

//   } catch (error) {
//     console.error("Error fetching advance collection:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

