import sequelize from '../../config/connectionDB.js';
import AppealMast from '../../models/models/appealmast.js';
import BillBookEntry from '../../models/models/billbookentry.js';
import BillTransactionDetails from '../../models/models/billtransactiondetails.js';
import BillTransactionDetailsAdvance from '../../models/models/billtransactiondetailsadvance.js';
import { OldPropertyMast } from '../../models/models/oldpropertymast.js';
import PropertyDetailsNew from '../../models/models/propertydetailsnew.js';
import PropertyMast from '../../models/models/propertymast.js';
import { TaxPendingDetails } from '../../models/models/taxpendingdetails.js';
import TransMast from '../../models/models/transmast.js';
import { Op } from 'sequelize';

// Helper function to fetch column names from a Sequelize model
const getColumnNames = async (model) => {
  try {
    const tableDefinition = await model.describe();
    const columnNames = Object.keys(tableDefinition);
    console.log(`Column names for ${model.name}:`, columnNames);
    return columnNames;
  } catch (error) {
    console.error(`Error fetching column names for ${model.name}:`, error);
    throw error;
  }
};

export const fetchPropertyMastColumns = async (req, res) => {
  try {
    const columns = await getColumnNames(PropertyMast);
    res.json(columns); // send array to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const fetchOldPropertyMastColumns = async (req, res) => {
  try {
    const columns = await getColumnNames(OldPropertyMast);
    res.json(columns); // send array to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchPropertyDetailsNewColumns = async (req, res) => {
  try {
    const columns = await getColumnNames(PropertyDetailsNew);
    res.json(columns); // send array to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchAppealPropertyMastColumns = async (req, res) => {
  try {
    const columns = await getColumnNames(AppealMast);
    res.json(columns); // send array to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchTransMastColumns = async (req, res) => {
  try {
    const columns = await getColumnNames(TransMast);
    res.json(columns); // send array to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchTaxPendingColumns = async (req, res) => {
  try {
    const columns = await getColumnNames(TaxPendingDetails);
    res.json(columns); // send array to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchBillBookColumns = async (req, res) => {
  try {
    const columns = await getColumnNames(BillTransactionDetails);
    res.json(columns); // send array to frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOwnerIDsByWardAndPropertyType = async (req, res) => {
  try {
    console.log('💡 Request Body:', req.body);
    let { wardNo, propertyTypeID, fromProperty, toProperty, financialYear } =
      req.body;

    // Validate required fields
    if (!wardNo || !propertyTypeID || !financialYear) {
      return res.status(400).json({
        message: 'wardNo, propertyTypeID and financialYear are required',
      });
    }

    const finYearStart = parseInt(financialYear.split('-')[0], 10);
    console.log('📅 Financial Year Start:', finYearStart);

    // 1️⃣ Handle "ALL" wards: fetch all distinct ward numbers
    if (wardNo.includes('ALL')) {
      const allWards = await PropertyMast.findAll({
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('NewWardNo')), 'NewWardNo'],
        ],
        raw: true,
      });
      wardNo = allWards.map((w) => w.NewWardNo);
      console.log('🌐 ALL wards selected, wards list:', wardNo);
    }

    // 2️⃣ Build property number filter (only for single ward)
    let propertyNoCondition = {};
    if (wardNo.length === 1 && fromProperty != null && toProperty != null) {
      propertyNoCondition = {
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            fromProperty
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            toProperty
          ),
        ],
      };
      console.log(
        '🔢 Single ward property range filter applied:',
        propertyNoCondition
      );
    }

    // 3️⃣ Ward filter
    const wardCondition = { NewWardNo: { [Op.in]: wardNo } };

    // 4️⃣ Fetch PropertyMast records matching ward(s) + propertyTypeID + propertyNoCondition
    const propertyOwners = await PropertyMast.findAll({
      attributes: [
        'OwnerID',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'PropertyTypeID',
      ],
      where: {
        ...wardCondition,
        PropertyTypeID: { [Op.in]: propertyTypeID },
        ...propertyNoCondition,
      },
      order: [
        [sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'), 'ASC'],
        ['NewPartitionNo', 'ASC'],
      ],
      raw: true,
    });

    console.log(
      `🏠 Found ${propertyOwners.length} properties matching criteria`
    );

    if (!propertyOwners.length) {
      return res.json({ ownerIds: [], details: [] });
    }

    // 5️⃣ Collect OwnerIDs
    const ownerIds = propertyOwners.map((p) => p.OwnerID);

    // 6️⃣ Filter owners based on financial year in TransMast
    const ownersWithFinYear = await TransMast.findAll({
      attributes: ['OwnerID'],
      where: {
        OwnerID: { [Op.in]: ownerIds },
        FinanceYear: finYearStart,
      },
      raw: true,
    });

    const finalOwnerIds = ownersWithFinYear.map((o) => o.OwnerID);

    // 7️⃣ Return details for owners matching both property and transaction year
    const details = propertyOwners.filter((p) =>
      finalOwnerIds.includes(p.OwnerID)
    );

    console.log(`✅ Returning ${finalOwnerIds.length} owner IDs with details`);

    res.json({ ownerIds: finalOwnerIds, details });
  } catch (error) {
    console.error('❌ Error fetching owners:', error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

export const getPropertyMastColumnsByOwner = async (req, res) => {
  try {
    const { ownerIDs, columns } = req.body;

    console.log('Fetching PropertyMast columns for OwnerIDs:', req.body);

    if (!ownerIDs || ownerIDs.length === 0) {
      return res.status(400).json({ message: 'OwnerIDs required' });
    }

    if (!columns || columns.length === 0) {
      return res.status(400).json({ message: 'Columns required' });
    }

    // Map friendly names to actual DB column names
    const columnMap = {
      WardNo: 'NewWardNo',
      PropNo: 'NewPropertyNo',
      PartiNo: 'NewPartitionNo',
    };

    const dbColumns = columns.map((col) => columnMap[col] || col);

    // Fetch from PropertyMast table
    const results = await PropertyMast.findAll({
      attributes: ['OwnerID', ...dbColumns],
      where: { OwnerID: ownerIDs },
    });

    // Return as-is (with DB column names)
    const mappedResults = results.map((row) => row.toJSON());

    return res.status(200).json(mappedResults);
  } catch (error) {
    console.error('Error fetching property mast columns:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

export const getAppealDataByColumns = async (req, res) => {
  try {
    const { ownerIDs, columns } = req.body;

    console.log('Fetching Appeal Data for OwnerIDs:', req.body);

    if (!ownerIDs?.length) {
      return res.status(400).json({ message: 'Owner IDs are required' });
    }

    if (!columns?.length) {
      return res.status(400).json({ message: 'Columns are required' });
    }

    // Fetch only selected columns
    const data = await AppealMast.findAll({
      attributes: columns, // dynamic column selection
      where: {
        OwnerID: ownerIDs,
      },
      order: [['OwnerID', 'ASC']],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching appeal data:', error);
    res.status(500).json({ message: 'Server error fetching appeal data' });
  }
};

export const getOldPropertyDataByColumns = async (req, res) => {
  try {
    const { ownerIDs, columns } = req.body;

    if (!ownerIDs?.length)
      return res.status(400).json({ message: 'Owner IDs required' });
    if (!columns?.length)
      return res.status(400).json({ message: 'Columns required' });

    const data = await OldPropertyMast.findAll({
      attributes: columns, // dynamic columns
      where: { OwnerID: ownerIDs },
      order: [['OwnerID', 'ASC']],
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching old property data:', error);
    res
      .status(500)
      .json({ message: 'Server error fetching old property data' });
  }
};

export const getNewFloorDataByColumns = async (req, res) => {
  try {
    const { ownerIDs, columns } = req.body;

    if (!ownerIDs?.length)
      return res.status(400).json({ message: 'Owner IDs required' });
    if (!columns?.length)
      return res.status(400).json({ message: 'Columns required' });

    const data = await PropertyDetailsNew.findAll({
      attributes: columns,
      where: { OwnerID: { [Op.in]: ownerIDs } },
      order: [['OwnerID', 'ASC']],
    });

    const ownerMap = {};

    const skipMerge = ['OwnerID', 'CreatedDate', 'UpdatedDate', 'UpdatedBy'];

    data.forEach((row) => {
      const rowData = row.get();
      const ownerId = rowData.OwnerID;

      if (!ownerMap[ownerId]) {
        ownerMap[ownerId] = { ...rowData };
      } else {
        columns.forEach((col) => {
          if (skipMerge.includes(col)) return; // ❌ skip merging these fields

          const existing = ownerMap[ownerId][col];
          const current = rowData[col];

          // Only merge non-empty, non-null values
          if (current !== null && current !== undefined && current !== '') {
            if (
              existing !== null &&
              existing !== undefined &&
              existing !== ''
            ) {
              // Avoid duplicates
              const existingParts = existing
                .toString()
                .split(',')
                .map((v) => v.trim());
              if (!existingParts.includes(current.toString().trim())) {
                ownerMap[ownerId][col] = `${existing}, ${current}`;
              }
            } else {
              ownerMap[ownerId][col] = current;
            }
          }
        });
      }
    });

    const finalData = Object.values(ownerMap);
    res.status(200).json(finalData);
  } catch (error) {
    console.error('Error fetching new floor data:', error);
    res.status(500).json({ message: 'Server error fetching new floor data' });
  }
};

export const executeSP = async (spName, OwnerID, year) => {
  try {
    // Ensure OwnerID is a comma-separated string only if array
    const ownerIDList = Array.isArray(OwnerID) ? OwnerID.join(',') : OwnerID;

    // Ensure year is a number
    const spYear = Number(year) || new Date().getFullYear();

    const replacements = {
      p_WardNo: null,
      p_FromPropertyNo: null,
      p_ToPropertyNo: null,
      p_PartitionNo: null,
      p_Mode: null,
      p_OwnerIDList: ownerIDList,
      p_Year: spYear,
    };

    console.log('📤 SP Call:', { spName, replacements });

    const spResults = await sequelize.query(
      `CALL ${spName}(:p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo, 
        :p_PartitionNo, :p_Mode, :p_OwnerIDList, :p_Year);`,
      { replacements, type: sequelize.QueryTypes.SELECT }
    );

    // Return actual rows only
    return spResults.length && typeof spResults[0] === 'object'
      ? Object.values(spResults[0])
      : [];
  } catch (error) {
    console.error(`🔥 Error executing SP "${spName}":`, error);
    throw error;
  }
};

export const getCurrentDemandByOwner = async (req, res) => {
  try {
    let { OwnerID, p_Year } = req.body;

    console.log(req.body, 'data from current demand');

    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: '⚠️ OwnerID is required' });
    }

    // Use the common function with the correct SP name
    const dataRows = await executeSP('funAMCGetCurrentDemand', OwnerID, p_Year);

    if (!dataRows.length) {
      return res.status(404).json({
        message: '❌ No current collection found',
        OwnerID,
        Year: p_Year,
      });
    }

    return res.status(200).json(dataRows);
  } catch (error) {
    console.error('Error fetching current collection:', error);
    return res
      .status(500)
      .json({ message: '🔥 Server error', error: error.message });
  }
};

// 🟢 Pending Demand
export const getPendingDemandByOwner = async (req, res) => {
  try {
    let { OwnerID, p_Year } = req.body;

    console.log('💡 Request Body:', req.body);

    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: '⚠️ OwnerID is required' });
    }

    // Call SP
    const dataRows = await executeSP('funAMCGetPendingDemand', OwnerID, p_Year);

    if (!dataRows.length) {
      return res.status(404).json({
        message: '❌ No pending demand found',
        OwnerID,
        Year: p_Year,
      });
    }

    return res.status(200).json(dataRows);
  } catch (error) {
    console.error('🔥 Error fetching pending demand:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

export const getTotalDemandByOwner = async (req, res) => {
  try {
    const { OwnerID, p_Year } = req.body;

    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: '⚠️ OwnerID is required' });
    }

    // Normalize rows coming from SPs
    const normalizeRow = (row) => {
      const newRow = {};

      // Fix mismatched column names
      if ('Net Total' in row) {
        row.NetTotal = row['Net Total'];
        delete row['Net Total'];
      }

      // Convert all numeric strings to actual numbers
      for (let key in row) {
        const value = row[key];

        if (['OwnerID', 'FinanceYear', 'PendingYear'].includes(key)) {
          newRow[key] = Number(value);
        } else if (!isNaN(value) && value !== null && value !== '') {
          newRow[key] = Number(value);
        } else {
          newRow[key] = value;
        }
      }

      return newRow;
    };

    // Fetch both datasets
    let currentDemand = await executeSP(
      'funAMCGetCurrentDemand',
      OwnerID,
      p_Year
    );

    let pendingDemand = await executeSP(
      'funAMCGetPendingDemand',
      OwnerID,
      p_Year
    );

    // Normalize
    currentDemand = currentDemand.map(normalizeRow);
    pendingDemand = pendingDemand.map(normalizeRow);

    const allRows = [...currentDemand, ...pendingDemand];

    // Group + Sum
    const grouped = allRows.reduce((acc, row) => {
      const owner = row.OwnerID;

      if (!acc[owner]) {
        acc[owner] = { ...row };
      } else {
        for (let key in row) {
          // Sum only numeric values & avoid ID/year fields
          if (
            typeof row[key] === 'number' &&
            !['OwnerID', 'FinanceYear', 'PendingYear'].includes(key)
          ) {
            acc[owner][key] += row[key];
          }
        }
      }

      return acc;
    }, {});

    return res.status(200).json(Object.values(grouped));
  } catch (error) {
    console.error('🔥 Error fetching total demand:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// export const getCurrentCollectionByOwner = async (req, res) => {
//   try {
//     const { OwnerID, p_Year, p_from_date, p_to_date } = req.body;

//     console.log('💡 Request Body bill entry 1:', req.body);

//     if (!OwnerID || OwnerID.length === 0) {
//       return res.status(400).json({ message: '⚠️ OwnerID is required' });
//     }

//     const owners = Array.isArray(OwnerID) ? OwnerID : [OwnerID];
//     const fromDate = p_from_date
//       ? new Date(p_from_date)
//       : new Date('1970-01-01');
//     const toDate = p_to_date ? new Date(p_to_date) : new Date();

//     const rows = await BillTransactionDetails.findAll({
//       where: {
//         FinanceYear: p_Year || new Date().getFullYear(),
//         OwnerID: { [Op.in]: owners },
//         TransactionDate: { [Op.between]: [fromDate, toDate] },
//       },
//       order: [['TransactionDate', 'ASC']],
//     });

//     if (!rows.length) {
//       return res.status(404).json({
//         message: '❌ No current collection found',
//         OwnerID,
//         Year: p_Year,
//       });
//     }

//     return res.status(200).json(rows);
//   } catch (error) {
//     console.error('🔥 Error fetching current collection:', error);
//     return res
//       .status(500)
//       .json({ message: 'Server error', error: error.message });
//   }
// };

// export const getCurrentCollectionByOwner = async (req, res) => {
//   try {
//     const { OwnerIDList, p_Year, p_from_date, p_to_date } = req.body;

//     if (!OwnerIDList || OwnerIDList.length === 0) {
//       return res.status(400).json({ message: 'OwnerIDList is required' });
//     }

//     console.log('🔍 Calling SP funAMCGetCurrentCollection with:', {
//       OwnerIDList,
//       p_Year,
//       p_from_date,
//       p_to_date,
//     });

//     const result = await sequelize.sequelize.query(
//       'CALL funAMCGetCurrentCollection(:WardNo, :FromProp, :ToProp, :PartitionNo, :Mode, :OwnerIDs, :Year, :FromDate, :ToDate)',
//       {
//         replacements: {
//           WardNo: '',
//           FromProp: null,
//           ToProp: null,
//           PartitionNo: '',
//           Mode: '',
//           OwnerIDs: OwnerIDList.join(','), // convert array to CSV
//           Year: p_Year || null,
//           FromDate: p_from_date || null,
//           ToDate: p_to_date || null,
//         },
//       }
//     );

//     return res.status(200).json(result);
//   } catch (error) {
//     console.error('🔥 Error calling SP funAMCGetCurrentCollection:', error);
//     res.status(500).json({
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// };

export const getCurrentCollectionByOwner = async (req, res) => {
  try {
    const { OwnerIDList, p_Year, p_from_date, p_to_date } = req.body;

    if (!OwnerIDList || OwnerIDList.length === 0) {
      return res.status(400).json({ message: 'OwnerIDList is required' });
    }

    console.log('🔍 Calling SP funAMCGetCurrentCollection with:', {
      OwnerIDList,
      p_Year,
      p_from_date,
      p_to_date,
    });

    const result = await sequelize.query(
      `CALL funAMCGetCurrentCollection(
        :WardNo, :FromProp, :ToProp, :PartitionNo,
        :Mode, :OwnerIDs, :Year, :FromDate, :ToDate
      )`,
      {
        replacements: {
          WardNo: '',
          FromProp: null,
          ToProp: null,
          PartitionNo: '',
          Mode: '',
          OwnerIDs: OwnerIDList.join(','),
          Year: p_Year || null,
          FromDate: p_from_date || null,
          ToDate: p_to_date || null,
        },
      }
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('🔥 Error calling SP funAMCGetCurrentCollection:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
export const getPendingCollectionByOwner = async (req, res) => {
  try {
    const { OwnerIDList, p_Year, p_from_date, p_to_date } = req.body;

    if (!OwnerIDList || OwnerIDList.length === 0) {
      return res.status(400).json({ message: 'OwnerIDList is required' });
    }

    console.log('📌 Calling SP funAMCGetPendingCollection with:', {
      OwnerIDList,
      p_Year,
      p_from_date,
      p_to_date,
    });

    const result = await sequelize.query(
      `CALL funAMCGetPendingCollection(
        :WardNo,
        :FromProp,
        :ToProp,
        :PartitionNo,
        :Mode,
        :OwnerIDs,
        :Year,
        :FromDate,
        :ToDate
      )`,
      {
        replacements: {
          WardNo: '',
          FromProp: null,
          ToProp: null,
          PartitionNo: '',
          Mode: '',
          OwnerIDs: OwnerIDList.join(','),
          Year: p_Year || null,
          FromDate: p_from_date || null,
          ToDate: p_to_date || null,
        },
      }
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('🔥 Error calling SP funAMCGetPendingCollection:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// export const getPendingCollectionByOwner = async (req, res) => {
//   try {
//     const { OwnerID, p_Year, p_from_date, p_to_date } = req.body;

//     if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
//       return res.status(400).json({ message: '⚠️ OwnerID is required' });
//     }

//     const ownerIDList = Array.isArray(OwnerID) ? OwnerID : [OwnerID];
//     const fYear = Number(p_Year) || new Date().getFullYear();
//     const pendingYear = fYear - 1;

//     // Fetch pending collection using the model
//     const pendingCollection = await BillTransactionDetails.findAll({
//       where: {
//         FinanceYear: fYear,
//         PendingYear: pendingYear,
//         OwnerID: ownerIDList,
//         TransactionDate: {
//           [Op.between]: [p_from_date, p_to_date], // Sequelize Op
//         },
//       },
//       order: [['TransactionDate', 'ASC']], // optional: order by date
//     });

//     if (!pendingCollection.length) {
//       return res.status(404).json({
//         message: '❌ No pending collection found',
//         OwnerID: ownerIDList,
//         Year: fYear,
//         PendingYear: pendingYear,
//       });
//     }

//     return res.status(200).json(pendingCollection);
//   } catch (error) {
//     console.error('🔥 Error fetching pending collection:', error);
//     return res
//       .status(500)
//       .json({ message: 'Server error', error: error.message });
//   }
// };

// export const getTotalCollectionByOwner = async (req, res) => {
//   try {
//     const { OwnerID, p_Year, p_from_date, p_to_date } = req.body;

//     if (!OwnerID || OwnerID.length === 0) {
//       return res.status(400).json({ message: "OwnerID is required" });
//     }

//     const ownerIDList = Array.isArray(OwnerID) ? OwnerID : [OwnerID];
//     const fYear = Number(p_Year) || new Date().getFullYear();

//     // Fetch all current + pending collections for the same FinanceYear
//     const collections = await BillTransactionDetails.findAll({
//       where: {
//         OwnerID: ownerIDList,
//         FinanceYear: fYear,
//         TransactionDate: { [Op.between]: [p_from_date, p_to_date] }
//       }
//     });

//     if (!collections.length) {
//       return res.status(404).json({
//         message: "No collection found",
//         OwnerID: ownerIDList
//       });
//     }

//     // Initialize all fields you want to sum
//     const totals = collections.reduce((acc, row) => {
//       acc.PropertyTax += Number(row.PropertyTax || 0);
//       acc.EducationTax += Number(row.EducationTax || 0);
//       acc.EmploymentTax += Number(row.EmploymentTax || 0);
//       acc.TreeCess += Number(row.TreeCess || 0);
//       acc.SpWaterCess += Number(row.SpWaterCess || 0);
//       acc.Sanitation += Number(row.Sanitation || 0);
//       acc.DrainCess += Number(row.DrainCess || 0);
//       acc.RoadCess += Number(row.RoadCess || 0);
//       acc.FireCess += Number(row.FireCess || 0);
//       acc.LightCess += Number(row.LightCess || 0);
//       acc.WaterBenefit += Number(row.WaterBenefit || 0);
//       acc.MajorBuilding += Number(row.MajorBuilding || 0);
//       acc.SewageDisposalCess += Number(row.SewageDisposalCess || 0);
//       acc.SpEducationTax += Number(row.SpEducationTax || 0);
//       acc.WaterBill += Number(row.WaterBill || 0);
//       acc.Tax1 += Number(row.Tax1 || 0);
//       acc.Tax2 += Number(row.Tax2 || 0);
//       acc.Tax3 += Number(row.Tax3 || 0);
//       acc.Tax4 += Number(row.Tax4 || 0);
//       acc.Tax5 += Number(row.Tax5 || 0);
//       acc.TaxTotal += Number(row.TaxTotal || 0);
//       acc.Interest += Number(row.Interest || 0);
//       acc.Discount += Number(row.Discount || 0);
//       acc.Noticefee += Number(row.Noticefee || 0);
//       acc.WarrentFee += Number(row.WarrentFee || 0);
//       acc.MiscellaneousFee += Number(row.MiscellaneousFee || 0);
//       acc.NetTotal += Number(row.NetTotal || 0);
//       acc.Amount += Number(row.Amount || 0);
//       return acc;
//     }, {
//       PropertyTax:0, EducationTax:0, EmploymentTax:0, TreeCess:0, SpWaterCess:0, Sanitation:0,
//       DrainCess:0, RoadCess:0, FireCess:0, LightCess:0, WaterBenefit:0, MajorBuilding:0,
//       SewageDisposalCess:0, SpEducationTax:0, WaterBill:0, Tax1:0, Tax2:0, Tax3:0, Tax4:0, Tax5:0,
//       TaxTotal:0, Interest:0, Discount:0, Noticefee:0, WarrentFee:0, MiscellaneousFee:0, NetTotal:0, Amount:0
//     });

//     return res.status(200).json({
//       OwnerID: ownerIDList,
//       FinanceYear: fYear,
//       Totals: totals,
//       RecordsCount: collections.length
//     });

//   } catch (error) {
//     console.error("Error fetching total collection:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getTotalCollectionByOwner = async (req, res) => {
//   try {
//     const { OwnerID, p_Year, p_from_date, p_to_date } = req.body;

//     if (!OwnerID || OwnerID.length === 0) {
//       return res.status(400).json({ message: 'OwnerID is required' });
//     }

//     const ownerIDList = Array.isArray(OwnerID) ? OwnerID : [OwnerID];
//     const fYear = Number(p_Year) || new Date().getFullYear();

//     const fromDate = p_from_date
//       ? new Date(p_from_date)
//       : new Date('1970-01-01');
//     const toDate = p_to_date ? new Date(p_to_date) : new Date();

//     // Fetch all matching collection records
//     const collections = await BillTransactionDetails.findAll({
//       where: {
//         OwnerID: ownerIDList,
//         FinanceYear: fYear,
//         TransactionDate: { [Op.between]: [fromDate, toDate] },
//       },
//     });

//     if (!collections.length) {
//       return res.status(404).json({
//         message: 'No collection found',
//         FinanceYear: fYear,
//       });
//     }

//     // Fields to total
//     const totalFields = [
//       'PropertyTax',
//       'EducationTax',
//       'EmploymentTax',
//       'TreeCess',
//       'SpWaterCess',
//       'Sanitation',
//       'DrainCess',
//       'RoadCess',
//       'FireCess',
//       'LightCess',
//       'WaterBenefit',
//       'MajorBuilding',
//       'SewageDisposalCess',
//       'SpEducationTax',
//       'WaterBill',
//       'Tax1',
//       'Tax2',
//       'Tax3',
//       'Tax4',
//       'Tax5',
//       'TaxTotal',
//       'Interest',
//       'Discount',
//       'Noticefee',
//       'WarrentFee',
//       'MiscellaneousFee',
//       'NetTotal',
//       'Amount',
//     ];

//     // Initialize accumulator
//     const totals = totalFields.reduce((acc, field) => {
//       acc[field] = 0;
//       return acc;
//     }, {});

//     // Sum all selected owners together
//     collections.forEach((row) => {
//       totalFields.forEach((field) => {
//         totals[field] += Number(row[field] || 0);
//       });
//     });

//     const response = [
//       {
//         FinanceYear: fYear,
//         RecordsCount: collections.length,
//         ...totals,
//       },
//     ];

//     console.log('✅ Total collection (combined):', response);

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error('❌ Error fetching total collection:', error);
//     return res
//       .status(500)
//       .json({ message: 'Server error', error: error.message });
//   }
// };

// export const getTotalCollectionByOwner = async (req, res) => {
//   try {
//     const { OwnerID, p_Year, p_from_date, p_to_date } = req.body;

//     if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
//       return res.status(400).json({ message: '⚠️ OwnerID is required' });
//     }

//     // Helper → Convert SP row to clean numeric object
//     const normalizeRow = (row) => {
//       const newRow = {};

//       // Fix SP returning "Net Total" with space
//       if ('Net Total' in row) {
//         row.NetTotal = row['Net Total'];
//         delete row['Net Total'];
//       }

//       for (let key in row) {
//         const value = row[key];

//         // Convert ID & years to numbers
//         if (['OwnerID', 'FinanceYear', 'PendingYear'].includes(key)) {
//           newRow[key] = Number(value);
//         }
//         // Convert numeric strings to numbers
//         else if (!isNaN(value) && value !== null && value !== '') {
//           newRow[key] = Number(value);
//         }
//         // Keep strings as they are
//         else {
//           newRow[key] = value;
//         }
//       }

//       return newRow;
//     };

//     // ----------- 1. CURRENT COLLECTION -----------
//     let current = await executeSP(
//       'funAMCGetCurrentCollection',
//       OwnerID,
//       p_Year,
//       p_from_date,
//       p_to_date
//     );
//     current = current.map(normalizeRow);

//     // ----------- 2. PENDING COLLECTION -----------
//     let pending = await executeSP(
//       'funAMCGetPendingCollection',
//       OwnerID,
//       p_Year,
//       p_from_date,
//       p_to_date
//     );
//     pending = pending.map(normalizeRow);

//     // Merge both into one list
//     const allRows = [...current, ...pending];

//     // ----------- 3. GROUP + SUM OWNER-WISE -----------
//     const grouped = allRows.reduce((acc, row) => {
//       const owner = row.OwnerID;

//       if (!acc[owner]) {
//         acc[owner] = { ...row };
//       } else {
//         for (let key in row) {
//           if (
//             typeof row[key] === 'number' &&
//             !['OwnerID', 'FinanceYear', 'PendingYear'].includes(key)
//           ) {
//             acc[owner][key] += row[key];
//           }
//         }
//       }

//       return acc;
//     }, {});

//     return res.status(200).json(Object.values(grouped));
//   } catch (error) {
//     console.error('🔥 Error fetching total collection:', error);
//     return res.status(500).json({
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// };

export const getTotalCollectionByOwner = async (req, res) => {
  try {
    const { OwnerID, p_Year, p_from_date, p_to_date } = req.body;

    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: '⚠️ OwnerID is required' });
    }

    // Build parameter object (same structure as your other APIs)
    const spParams = {
      WardNo: '',
      FromProp: null,
      ToProp: null,
      PartitionNo: '',
      Mode: '',
      OwnerIDs: Array.isArray(OwnerID) ? OwnerID.join(',') : OwnerID,
      Year: p_Year || null,
      FromDate: p_from_date || null,
      ToDate: p_to_date || null,
    };

    // ----------- 1. CALL CURRENT COLLECTION SP -----------
    let current = await sequelize.query(
      `CALL funAMCGetCurrentCollection(
        :WardNo,
        :FromProp,
        :ToProp,
        :PartitionNo,
        :Mode,
        :OwnerIDs,
        :Year,
        :FromDate,
        :ToDate
      )`,
      { replacements: spParams }
    );

    // ----------- 2. CALL PENDING COLLECTION SP -----------
    let pending = await sequelize.query(
      `CALL funAMCGetPendingCollection(
        :WardNo,
        :FromProp,
        :ToProp,
        :PartitionNo,
        :Mode,
        :OwnerIDs,
        :Year,
        :FromDate,
        :ToDate
      )`,
      { replacements: spParams }
    );

    // ----------- NORMALIZE SP RESULTS -----------
    const normalizeRow = (row) => {
      const newRow = {};

      if ('Net Total' in row) {
        row.NetTotal = row['Net Total'];
        delete row['Net Total'];
      }

      for (let key in row) {
        const val = row[key];

        if (['OwnerID', 'FinanceYear', 'PendingYear'].includes(key)) {
          newRow[key] = Number(val);
        } else if (!isNaN(val) && val !== null && val !== '') {
          newRow[key] = Number(val);
        } else {
          newRow[key] = val;
        }
      }
      return newRow;
    };

    current = current.map(normalizeRow);
    pending = pending.map(normalizeRow);

    const allRows = [...current, ...pending];

    // ----------- 3. GROUP + SUM OWNER-WISE -----------
    const grouped = allRows.reduce((acc, row) => {
      const owner = row.OwnerID;

      if (!acc[owner]) {
        acc[owner] = { ...row };
      } else {
        for (let key in row) {
          if (
            typeof row[key] === 'number' &&
            !['OwnerID', 'FinanceYear', 'PendingYear'].includes(key)
          ) {
            acc[owner][key] += row[key];
          }
        }
      }
      return acc;
    }, {});

    // Final owner-wise merged result
    return res.status(200).json(Object.values(grouped));
  } catch (error) {
    console.error('🔥 Error fetching total collection:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getOutstandingCurrentBalanceByOwner = async (req, res) => {
  try {
    let { OwnerID, p_Year } = req.body;

    // Validation
    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: '⚠️ OwnerID is required' });
    }

    // Convert array to comma-separated string for SP
    if (Array.isArray(OwnerID)) {
      OwnerID = OwnerID.join(',');
    }

    const replacements = {
      p_WardNo: null,
      p_FromPropertyNo: null,
      p_ToPropertyNo: null,
      p_PartitionNo: null,
      p_Mode: null,
      p_OwnerIDList: OwnerID,
      p_Year: p_Year || new Date().getFullYear(),
      p_from_date: null,
      p_to_date: null,
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

    console.log('Raw SP Results:', spResults);

    // Extract actual rows (temp_currentBalance results are usually first element)
    const dataRows =
      spResults.length && typeof spResults[0] === 'object'
        ? Object.values(spResults[0])
        : [];

    if (!dataRows.length) {
      return res.status(404).json({
        message: '❌ No current balance found for this OwnerID',
        OwnerID: OwnerID.split(',').map((id) => Number(id)),
        Year: replacements.p_Year,
      });
    }

    // Success response
    return res.status(200).json(dataRows);
  } catch (error) {
    console.error('Error fetching current balance:', error);
    return res
      .status(500)
      .json({ message: '🔥 Server error', error: error.message });
  }
};

export const getOutstandingPendingBalanceByOwner = async (req, res) => {
  try {
    let { OwnerID, p_Year } = req.body;

    // 🧾 Validate input
    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: '⚠️ OwnerID is required' });
    }

    // Ensure OwnerID is always an array
    const ownerList = Array.isArray(OwnerID) ? OwnerID : [OwnerID];
    const year = p_Year || new Date().getFullYear();
    const allResults = [];

    console.log('📢 Starting SP calls for OwnerIDs:', ownerList, 'Year:', year);

    // 🚀 Loop through each OwnerID and call SP separately
    for (const id of ownerList) {
      console.log(`➡️ Executing SP for OwnerID: ${id}`);

      const spResult = await sequelize.query(
        `CALL funAMCGetPendingBalance(
          :p_WardNo,
          :p_FromPropertyNo,
          :p_ToPropertyNo,
          :p_PartitionNo,
          :p_Mode,
          :p_OwnerIDList,
          :p_Year,
          :p_from_date,
          :p_to_date
        );`,
        {
          replacements: {
            p_WardNo: null,
            p_FromPropertyNo: null,
            p_ToPropertyNo: null,
            p_PartitionNo: null,
            p_Mode: null,
            p_OwnerIDList: id, // 👈 pass one ID at a time
            p_Year: year,
            p_from_date: null,
            p_to_date: null,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      console.log(`📦 SP Result for Owner ${id}:`, spResult);

      // Handle nested result structure
      const rows = Array.isArray(spResult[0]) ? spResult[0] : spResult;
      if (rows?.length) {
        allResults.push(...rows);
      } else {
        console.warn(`⚠️ No records found for OwnerID: ${id}`);
      }
    }

    if (allResults.length === 0) {
      return res.status(404).json({
        message:
          '❌ No pending outstanding balance found for provided OwnerIDs',
        OwnerIDs: ownerList,
        Year: year,
      });
    }

    console.log(
      `✅ Total ${allResults.length} records found for ${ownerList.length} owners.`
    );
    return res.status(200).json(allResults);
  } catch (error) {
    console.error('🔥 Error in getOutstandingPendingBalanceByOwner:', error);
    return res.status(500).json({
      message: 'Server error while fetching pending outstanding balance',
      error: error.message,
    });
  }
};

export const getOutstandingTotalBalance = async (req, res) => {
  try {
    const { OwnerID, p_Year } = req.body;

    console.log('➡️ Incoming Request Body:', req.body);

    if (!OwnerID || OwnerID.length === 0) {
      return res.status(400).json({ message: 'OwnerID is required' });
    }

    console.log('📌 OwnerIDs:', OwnerID.join(','));
    console.log('📌 Year:', p_Year);

    // ----- CURRENT -----
    console.log('⏳ Calling funAMCGetCurrentBalance...');
    const currentData = await sequelize.query(
      `CALL funAMCGetCurrentBalance("", NULL, NULL, "", "", :OwnerIDs, :Year, NULL, NULL)`,
      {
        replacements: {
          OwnerIDs: OwnerID.join(','),
          Year: p_Year,
        },
      }
    );

    console.log('📥 CURRENT RAW DATA:', JSON.stringify(currentData, null, 2));

    // ----- PENDING -----
    console.log('⏳ Calling funAMCGetPendingBalance...');
    const pendingRaw = await sequelize.query(
      `CALL funAMCGetPendingBalance("", NULL, NULL, "", "", :OwnerIDs, :Year, NULL, NULL)`,
      {
        replacements: {
          OwnerIDs: OwnerID.join(','),
          Year: p_Year,
        },
      }
    );

    console.log('📥 PENDING RAW DATA:', JSON.stringify(pendingRaw, null, 2));

    const pendingData = pendingRaw
      .map((r) => r['0'])
      .filter((r) => r && r.OwnerID);

    console.log(
      '📦 FILTERED PENDING DATA:',
      JSON.stringify(pendingData, null, 2)
    );

    // GROUP PENDING
    const pendingGrouped = {};

    for (const row of pendingData) {
      console.log('🔄 Processing Pending Row:', row);

      if (!pendingGrouped[row.OwnerID]) {
        pendingGrouped[row.OwnerID] = { ...row };
      } else {
        console.log(
          '⚠️ DUPLICATE FOUND — ADDING PENDING VALUES for OwnerID:',
          row.OwnerID
        );
        Object.keys(row).forEach((key) => {
          if (typeof row[key] === 'number') {
            pendingGrouped[row.OwnerID][key] += row[key];
          }
        });
      }
    }

    console.log(
      '📦 GROUPED PENDING DATA:',
      JSON.stringify(pendingGrouped, null, 2)
    );

    // Dynamic column extraction
    const allCols = new Set();

    currentData?.forEach((r) => Object.keys(r).forEach((c) => allCols.add(c)));
    Object.values(pendingGrouped)?.forEach((r) =>
      Object.keys(r).forEach((c) => allCols.add(c))
    );

    const skip = new Set(['OwnerID', 'FinanceYear']);
    const taxCols = [...allCols].filter((c) => !skip.has(c));

    console.log('🧮 TAX COLUMNS:', taxCols);

    const final = {};

    // Insert current
    console.log('🔧 Merging CURRENT data...');
    currentData.forEach((row) => {
      console.log('➡️ CURRENT ROW:', row);

      final[row.OwnerID] = {
        OwnerID: row.OwnerID,
        FinanceYear: row.FinanceYear || p_Year,
        PendingYear: null,
        Current: {},
        Pending: {},
        Total: {},
      };

      taxCols.forEach((c) => {
        final[row.OwnerID].Current[c] = row[c] || 0;
      });
    });

    // Insert pending
    console.log('🔧 Merging PENDING data...');
    Object.values(pendingGrouped).forEach((row) => {
      console.log('➡️ PENDING ROW:', row);

      if (!final[row.OwnerID]) {
        console.log(
          '⚠️ Owner not in CURRENT, creating fresh entry:',
          row.OwnerID
        );

        final[row.OwnerID] = {
          OwnerID: row.OwnerID,
          FinanceYear: p_Year,
          PendingYear: row.PendingYear,
          Current: {},
          Pending: {},
          Total: {},
        };
        taxCols.forEach((c) => (final[row.OwnerID].Current[c] = 0));
      }

      final[row.OwnerID].PendingYear = row.PendingYear;

      taxCols.forEach((c) => {
        final[row.OwnerID].Pending[c] = row[c] || 0;
      });
    });

    console.log(
      '📦 FINAL MERGED BEFORE TOTAL:',
      JSON.stringify(final, null, 2)
    );

    // total
    console.log('🧮 Calculating TOTAL...');
    Object.values(final).forEach((item) => {
      taxCols.forEach((c) => {
        item.Total[c] = (item.Current[c] || 0) + (item.Pending[c] || 0);
      });
    });

    console.log('📊 FINAL WITH TOTAL:', JSON.stringify(final, null, 2));

    // Only TOTAL rows
    const output = Object.values(final).map((item) => {
      const row = {
        OwnerID: item.OwnerID,
        FinanceYear: item.FinanceYear,
        PendingYear: item.PendingYear,
      };

      taxCols.forEach((c) => {
        row[c] = item.Total[c];
      });

      return row;
    });

    console.log('📤 FINAL API OUTPUT:', JSON.stringify(output, null, 2));

    res.status(200).json(output);
  } catch (error) {
    console.error('🔥 ERROR BLOCK:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdvanceCollectionByOwner = async (req, res) => {
  try {
    let { ownerID, FinanceYear } = req.body;
    if (!ownerID || !FinanceYear) {
      return res.status(400).json({ message: 'OwnerID and Year are required' });
    }
    // Make sure ownerID is an array
    if (!Array.isArray(ownerID)) ownerID = [ownerID];
    // Fetch records for multiple ownerIDs for the pending year
    const collections = await BillTransactionDetailsAdvance.findAll({
      where: {
        OwnerID: { [Op.in]: ownerID },
        FinanceYear: FinanceYear,
      },
      order: [['BTId', 'ASC']],
    });
    if (!collections || collections.length === 0) {
      return res.status(404).json({
        message: 'No Advance collection data found for given OwnerIDs and Year',
      });
    }
    res.json(collections);
  } catch (error) {
    console.error('Error fetching Advance  collection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 💵 Miscellaneous Fee
export const getMiscellaneousFeeByOwner = async (req, res) => {
  try {
    const { ownerIDList, year } = req.body;

    console.log('📩 Incoming Request:', req.body);

    if (!ownerIDList?.length || !year) {
      return res
        .status(400)
        .json({ message: 'Owner IDs and year are required' });
    }

    const records = await BillTransactionDetails.findAll({
      attributes: ['MiscellaneousFee'],
      where: {
        OwnerID: { [Op.in]: ownerIDList },
        FinanceYear: year,
      },
      raw: true,
    });

    if (!records.length) {
      return res.status(200).json([]);
    }

    // ✅ Return only array of fee objects
    return res.status(200).json(records);
  } catch (error) {
    console.error('❌ Error fetching MiscellaneousFee:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};

// export const getGhoshwaraOwnerwiseFull = async (req, res) => {
//   try {
//     const { OwnerID, p_Year } = req.body;
//     if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0))
//       return res.status(400).json({ message: "⚠️ OwnerID is required" });

//     const year = Number(p_Year) || new Date().getFullYear();
//     const owners = Array.isArray(OwnerID) ? OwnerID : [OwnerID];

//     const taxHeads = [
//       "PropertyTax", "EducationTax", "EmploymentTax", "TreeCess", "DrainCess",
//       "Sanitation", "SpWaterCess", "RoadCess", "FireCess", "LightCess",
//       "WaterBill", "WaterBenefit", "MajorBuilding", "SewageDisp",
//       "Tax1", "Tax2", "Tax3", "Tax4", "Tax5",
//       "MiscellaneousFee", "Interest", "NoticeFee", "WarrentFee"
//     ];

//     const finalRows = [];

//     for (const owner of owners) {
//       const prop = await PropertyMast.findOne({
//         attributes: ["OwnerID", "NewWardNo", "NewPropertyNo", "NewPartitionNo"],
//         where: { OwnerID: owner },
//         raw: true
//       });

//       const makeRow = (SrNo, data = {}) => {
//         const row = {
//           SrNo,
//           OwnerID: owner,
//           WardNo: prop?.NewWardNo || null,
//           PropertyNo: prop?.NewPropertyNo || null,
//           PartitionNo: prop?.NewPartitionNo || null,
//           FinanceYear: year,
//           ...Object.fromEntries(taxHeads.map(h => [h, data[h] || 0])),
//           NetTotal: data.NetTotal || 0
//         };
//         return row;
//       };

//       // Helper to sum numeric fields
//       const sumFields = (rows) => {
//         if (!rows?.length) return {};
//         return rows.reduce((acc, r) => {
//           for (let k in r)
//             if (typeof r[k] === "number")
//               acc[k] = (acc[k] || 0) + r[k];
//           return acc;
//         }, {});
//       };

//       // 🔹 Fetch Data
//       const currentDemand = sumFields(await executeSP("funAMCGetCurrentDemand", owner, year));
//       const pendingDemand = sumFields(await executeSP("funAMCGetPendingDemand", owner, year));
//       const currentCollection = sumFields(await BillTransactionDetails.findAll({
//         where: { OwnerID: owner, FinanceYear: year }, raw: true
//       }));
//       const pendingCollection = {}; // add logic if available
//       const adv = sumFields(await BillTransactionDetailsAdvance.findAll({
//         where: { OwnerID: owner, FinanceYear: year }, raw: true
//       }));

//       const totalDemand = {};
//       for (const k in currentDemand)
//         totalDemand[k] = (currentDemand[k] || 0) + (pendingDemand[k] || 0);

//       const totalCollection = {};
//       for (const k in currentCollection)
//         totalCollection[k] = (currentCollection[k] || 0) + (pendingCollection[k] || 0);

//       // Balances (Outstanding)
//       const curOut = {};
//       for (const k in currentDemand)
//         curOut[k] = (currentDemand[k] || 0) - (currentCollection[k] || 0);
//       const pendOut = {};
//       for (const k in pendingDemand)
//         pendOut[k] = (pendingDemand[k] || 0) - (pendingCollection[k] || 0);
//       const totalOut = {};
//       for (const k in totalDemand)
//         totalOut[k] = (totalDemand[k] || 0) - (totalCollection[k] || 0);

//       // 🔹 Build all rows for this OwnerID (1–11)
//       const ownerRows = [
//         makeRow("Current Demand", currentDemand),
//         makeRow("Pending Demand", pendingDemand),
//         makeRow("Total Demand", totalDemand),
//         makeRow("Current Collection", currentCollection),
//         makeRow("Pending Collection", pendingCollection),
//         makeRow("Total Collection", totalCollection),
//         makeRow("Current Outstanding Balance", curOut),
//         makeRow("Pending Outstanding Balance", pendOut),
//         makeRow("Total Outstanding Balance", totalOut),
//         makeRow("Total Advance Collection", adv),
//         makeRow("Total Miscellaneous", { MiscellaneousFee: currentCollection.MiscellaneousFee || 0 })
//       ];

//       // Add these 11 rows per owner
//       finalRows.push(...ownerRows);
//     }

//     return res.status(200).json(finalRows);
//   } catch (error) {
//     console.error("🔥 Error in getGhoshwaraOwnerwiseFull:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getGhoshwaraOwnerwiseFull = async (req, res) => {
//   try {
//     const { OwnerID, p_Year } = req.body;
//     if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0))
//       return res.status(400).json({ message: "⚠️ OwnerID is required" });

//     const year = Number(p_Year) || new Date().getFullYear();
//     const owners = Array.isArray(OwnerID) ? OwnerID : [OwnerID];

//     const taxHeads = [
//       "PropertyTax", "EducationTax", "EmploymentTax", "TreeCess", "DrainCess",
//       "Sanitation", "SpWaterCess", "RoadCess", "FireCess", "LightCess",
//       "WaterBill", "WaterBenefit", "MajorBuilding", "SewageDisp",
//       "Tax1", "Tax2", "Tax3", "Tax4", "Tax5",
//       "MiscellaneousFee", "Interest", "NoticeFee", "WarrentFee"
//     ];

//     const finalRows = [];

//     for (const owner of owners) {
//       const prop = await PropertyMast.findOne({
//         attributes: ["OwnerID", "NewWardNo", "NewPropertyNo", "NewPartitionNo"],
//         where: { OwnerID: owner },
//         raw: true
//       });

//       // Helper to sum numeric fields from multiple records
//       const sumFields = (rows) => {
//         if (!rows?.length) return {};
//         return rows.reduce((acc, r) => {
//           for (const k in r)
//             if (typeof r[k] === "number") acc[k] = (acc[k] || 0) + r[k];
//           return acc;
//         }, {});
//       };

//       // 🧮 Always include all tax heads in every row
//       const makeRow = (SrNo, data = {}) => ({
//         SrNo,
//         OwnerID: owner,
//         WardNo: prop?.NewWardNo || null,
//         PropertyNo: prop?.NewPropertyNo || null,
//         PartitionNo: prop?.NewPartitionNo || null,
//         FinanceYear: year,
//         ...Object.fromEntries(taxHeads.map(h => [h, data[h] ?? 0])),
//         NetTotal: data.NetTotal || 0
//       });

//       // 🔹 DEMANDS
//       const currentDemand = sumFields(await executeSP("funAMCGetCurrentDemand", owner, year));
//       const pendingDemand = sumFields(await executeSP("funAMCGetPendingDemand", owner, year));

//       const totalDemand = {};
//       for (const k in currentDemand)
//         totalDemand[k] = (currentDemand[k] || 0) + (pendingDemand[k] || 0);

//       // 🔹 COLLECTIONS
//       const collections = await BillTransactionDetails.findAll({
//         where: { OwnerID: owner, FinanceYear: year },
//         raw: true
//       });
//       const currentCollection = sumFields(collections); // sums all collection rows
//       const pendingCollection = {}; // optional
//       const totalCollection = {};
//       for (const k in currentCollection)
//         totalCollection[k] = (currentCollection[k] || 0) + (pendingCollection[k] || 0);

//       // 🔹 ADVANCE & MISC
//       const advances = await BillTransactionDetailsAdvance.findAll({
//         where: { OwnerID: owner, FinanceYear: year },
//         raw: true
//       });
//       const adv = sumFields(advances);

//       // 🔹 BALANCES (Outstanding)
//       const curOut = {};
//       for (const k in currentDemand)
//         curOut[k] = (currentDemand[k] || 0) - (currentCollection[k] || 0);
//       const pendOut = {};
//       for (const k in pendingDemand)
//         pendOut[k] = (pendingDemand[k] || 0) - (pendingCollection[k] || 0);
//       const totalOut = {};
//       for (const k in totalDemand)
//         totalOut[k] = (totalDemand[k] || 0) - (totalCollection[k] || 0);

//       // 🔹 BUILD ROWS (1–11)
//       const ownerRows = [
//         makeRow("Current Demand", currentDemand),
//         makeRow("Pending Demand", pendingDemand),
//         makeRow("Total Demand", totalDemand),
//         makeRow("Current Collection", currentCollection),
//         makeRow("Pending Collection", pendingCollection),
//         makeRow("Total Collection", totalCollection),
//         makeRow("Current Outstanding Balance", curOut),
//         makeRow("Pending Outstanding Balance", pendOut),
//         makeRow("Total Outstanding Balance", totalOut),
//         makeRow("Total Advance Collection", adv),
//         makeRow("Total Miscellaneous", { MiscellaneousFee: currentCollection.MiscellaneousFee || 0 })
//       ];

//       finalRows.push(...ownerRows);
//     }

//     // Normalize all rows so every one has all tax heads and numeric values
//     const normalizedRows = finalRows.map(row => {
//       taxHeads.forEach(h => {
//         if (typeof row[h] !== "number") row[h] = 0;
//       });
//       if (typeof row.NetTotal !== "number") row.NetTotal = 0;
//       return row;
//     });

//     return res.status(200).json(normalizedRows);
//   } catch (error) {
//     console.error("🔥 Error in getGhoshwaraOwnerwiseFull:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getGhoshwaraOwnerwiseFull = async (req, res) => {
//   try {
//     const { OwnerID, p_Year } = req.body;
//     if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0))
//       return res.status(400).json({ message: "⚠️ OwnerID is required" });

//     const year = Number(p_Year) || new Date().getFullYear();
//     const owners = Array.isArray(OwnerID) ? OwnerID : [OwnerID];

//     const taxHeads = [
//       "PropertyTax", "EducationTax", "EmploymentTax", "TreeCess", "DrainCess",
//       "Sanitation", "SpWaterCess", "RoadCess", "FireCess", "LightCess",
//       "WaterBill", "WaterBenefit", "MajorBuilding", "SewageDisp",
//       "Tax1", "Tax2", "Tax3", "Tax4", "Tax5",
//       "MiscellaneousFee", "Interest", "NoticeFee", "WarrentFee"
//     ];

//     const finalRows = [];

//     // Helper: sum numeric fields
//     const sumFields = (rows) => {
//       if (!rows?.length) return {};
//       return rows.reduce((acc, r) => {
//         for (const k in r)
//           if (typeof r[k] === "number") acc[k] = (acc[k] || 0) + r[k];
//         return acc;
//       }, {});
//     };

//     // Helper: map DB field names to taxHeads if different
//     const normalizeCollection = (rows) => rows.map(r => ({
//       PropertyTax: r.PropertyTax || r.PropTax || 0,
//       EducationTax: r.EducationTax || r.EduTax || 0,
//       EmploymentTax: r.EmploymentTax || 0,
//       TreeCess: r.TreeCess || 0,
//       DrainCess: r.DrainCess || 0,
//       Sanitation: r.Sanitation || 0,
//       SpWaterCess: r.SpWaterCess || 0,
//       RoadCess: r.RoadCess || 0,
//       FireCess: r.FireCess || 0,
//       LightCess: r.LightCess || 0,
//       WaterBill: r.WaterBill || 0,
//       WaterBenefit: r.WaterBenefit || 0,
//       MajorBuilding: r.MajorBuilding || 0,
//       SewageDisp: r.SewageDisp || 0,
//       MiscellaneousFee: r.MiscellaneousFee || 0,
//       Interest: r.Interest || 0,
//       NoticeFee: r.NoticeFee || 0,
//       WarrentFee: r.WarrentFee || 0,
//       NetTotal: r.NetTotal || r.TotalAmount || 0,
//     }));

//     for (const owner of owners) {
//       const prop = await PropertyMast.findOne({
//         attributes: ["OwnerID", "NewWardNo", "NewPropertyNo", "NewPartitionNo"],
//         where: { OwnerID: owner },
//         raw: true
//       });

//       const makeRow = (SrNo, data = {}) => ({
//   SrNo,
//   OwnerID: Number.isInteger(owner) ? owner : (Array.isArray(owner) ? owner[0] : owner),
//   WardNo: prop?.NewWardNo ?? "-",
//   PropertyNo: prop?.NewPropertyNo ?? "-",
//   PartitionNo: prop?.NewPartitionNo ?? "-",
//   FinanceYear: year,
//   ...Object.fromEntries(taxHeads.map(h => [h, data[h] ?? 0])),
//   NetTotal: data.NetTotal ?? 0,
// });

//       console.log("👉 Fetching data for Owner:", owner);

//       // DEMANDS
//       const currentDemand = sumFields(await executeSP("funAMCGetCurrentDemand", owner, year));
//       const pendingDemand = sumFields(await executeSP("funAMCGetPendingDemand", owner, year));

//       const totalDemand = {};
//       for (const k in currentDemand)
//         totalDemand[k] = (currentDemand[k] || 0) + (pendingDemand[k] || 0);

//       // COLLECTIONS
//       const collections = await BillTransactionDetails.findAll({
//         where: { OwnerID: owner, FinanceYear: year },
//         raw: true
//       });
//       const currentCollection = sumFields(normalizeCollection(collections));
//       const pendingCollection = {};
//       const totalCollection = {};
//       for (const k in currentCollection)
//         totalCollection[k] = (currentCollection[k] || 0) + (pendingCollection[k] || 0);

//       // ADVANCE & MISC
//       const advances = await BillTransactionDetailsAdvance.findAll({
//         where: { OwnerID: owner, FinanceYear: year },
//         raw: true
//       });
//       const adv = sumFields(advances);

//       // BALANCES
//       const curOut = {};
//       for (const k in currentDemand)
//         curOut[k] = (currentDemand[k] || 0) - (currentCollection[k] || 0);
//       const pendOut = {};
//       for (const k in pendingDemand)
//         pendOut[k] = (pendingDemand[k] || 0) - (pendingCollection[k] || 0);
//       const totalOut = {};
//       for (const k in totalDemand)
//         totalOut[k] = (totalDemand[k] || 0) - (totalCollection[k] || 0);

//       // BUILD 1–11 ROWS
//       finalRows.push(
//         makeRow("Current Demand", currentDemand),
//         makeRow("Pending Demand", pendingDemand),
//         makeRow("Total Demand", totalDemand),
//         makeRow("Current Collection", currentCollection),
//         makeRow("Pending Collection", pendingCollection),
//         makeRow("Total Collection", totalCollection),
//         makeRow("Current Outstanding Balance", curOut),
//         makeRow("Pending Outstanding Balance", pendOut),
//         makeRow("Total Outstanding Balance", totalOut),
//         makeRow("Total Advance Collection", adv),
//         makeRow("Total Miscellaneous", { MiscellaneousFee: currentCollection.MiscellaneousFee || 0 })
//       );
//     }

//     // Normalize final output
//     const normalizedRows = finalRows.map(row => {
//       taxHeads.forEach(h => {
//         if (typeof row[h] !== "number") row[h] = 0;
//       });
//       if (typeof row.NetTotal !== "number") row.NetTotal = 0;
//       return row;
//     });

//     return res.status(200).json(normalizedRows);
//   } catch (error) {
//     console.error("🔥 Error in getGhoshwaraOwnerwiseFull:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getGhoshwaraOwnerwiseFull = async (req, res) => {
//   try {
//     const { OwnerID, p_Year } = req.body;
//     if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0))
//       return res.status(400).json({ message: '⚠️ OwnerID is required' });

//     const year = Number(p_Year) || new Date().getFullYear();
//     const owners = Array.isArray(OwnerID) ? OwnerID : [OwnerID];

//     const taxHeads = [
//       'PropertyTax',
//       'EducationTax',
//       'EmploymentTax',
//       'TreeCess',
//       'DrainCess',
//       'Sanitation',
//       'SpWaterCess',
//       'RoadCess',
//       'FireCess',
//       'LightCess',
//       'WaterBill',
//       'WaterBenefit',
//       'MajorBuilding',
//       'SewageDisposalCess',
//       'SpEducationTax',
//       'Tax1',
//       'Tax2',
//       'Tax3',
//       'Tax4',
//       'Tax5',
//       'MiscellaneousFee',
//       'Interest',
//       'NoticeFee',
//       'WarrentFee',
//     ];

//     const finalRows = [];

//     const sumFields = (rows) => {
//       if (!rows?.length) return {};
//       return rows.reduce((acc, r) => {
//         for (const k in r)
//           if (typeof r[k] === 'number') acc[k] = (acc[k] || 0) + r[k];
//         return acc;
//       }, {});
//     };

//     // Helper to flatten deeply nested SQL results (e.g., [{0:{}}])
//     const flattenResult = (data) => {
//       const flat = [];
//       const recurse = (item) => {
//         if (!item) return;
//         if (Array.isArray(item)) item.forEach(recurse);
//         else if (item['0']) recurse(item['0']);
//         else if (typeof item === 'object' && item.OwnerID) flat.push(item);
//       };
//       recurse(data);
//       return flat;
//     };

//     for (const owner of owners) {
//       const prop = await PropertyMast.findOne({
//         attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo'],
//         where: { OwnerID: owner },
//         raw: true,
//       });

//       const makeRow = (SrNo, data = {}) => ({
//         SrNo,
//         OwnerID: owner,
//         WardNo: prop?.NewWardNo ?? '-',
//         PropertyNo: prop?.NewPropertyNo ?? '-',
//         PartitionNo: prop?.NewPartitionNo ?? '-',
//         FinanceYear: year,
//         ...Object.fromEntries(taxHeads.map((h) => [h, data[h] ?? 0])),
//         NetTotal: data.NetTotal ?? 0,
//       });

//       console.log('👉 Fetching data for Owner:', owner);

//       // DEMANDS
//       const currentDemand = sumFields(
//         await executeSP('funAMCGetCurrentDemand', owner, year)
//       );
//       const pendingDemand = sumFields(
//         await executeSP('funAMCGetPendingDemand', owner, year)
//       );
//       const totalDemand = {};
//       for (const k in currentDemand)
//         totalDemand[k] = (currentDemand[k] || 0) + (pendingDemand[k] || 0);

//       // COLLECTIONS
//       const collections = await BillTransactionDetails.findAll({
//         where: { OwnerID: owner, FinanceYear: year },
//         raw: true,
//       });
//       const normalizeCollection = (rows) =>
//         rows.map((r) => ({
//           PropertyTax: r.PropertyTax || 0,
//           EducationTax: r.EducationTax || 0,
//           EmploymentTax: r.EmploymentTax || 0,
//           TreeCess: r.TreeCess || 0,
//           DrainCess: r.DrainCess || 0,
//           Sanitation: r.Sanitation || 0,
//           SpWaterCess: r.SpWaterCess || 0,
//           RoadCess: r.RoadCess || 0,
//           FireCess: r.FireCess || 0,
//           LightCess: r.LightCess || 0,
//           WaterBill: r.WaterBill || 0,
//           WaterBenefit: r.WaterBenefit || 0,
//           MajorBuilding: r.MajorBuilding || 0,
//           SewageDisposalCess: r.SewageDisposalCess || 0,
//           MiscellaneousFee: r.MiscellaneousFee || 0,
//           Interest: r.Interest || 0,
//           NoticeFee: r.NoticeFee || 0,
//           WarrentFee: r.WarrentFee || 0,
//           NetTotal: r.NetTotal || 0,
//         }));

//       const currentCollection = sumFields(normalizeCollection(collections));
//       const pendingCollection = {};
//       const totalCollection = {};
//       for (const k in currentCollection)
//         totalCollection[k] =
//           (currentCollection[k] || 0) + (pendingCollection[k] || 0);

//       // ADVANCE
//       const advances = await BillTransactionDetailsAdvance.findAll({
//         where: { OwnerID: owner, FinanceYear: year },
//         raw: true,
//       });
//       const adv = sumFields(advances);

//       // OUTSTANDING BALANCES
//       const currentOutRaw = await executeSP(
//         'funAMCGetCurrentBalance',
//         owner,
//         year,
//         null,
//         null,
//         null,
//         null,
//         null,
//         null,
//         null
//       );
//       const currentOutstanding = sumFields(flattenResult(currentOutRaw));

//       const pendingOutRaw = await executeSP(
//         'funAMCGetPendingBalance',
//         owner,
//         year,
//         null,
//         null,
//         null,
//         null,
//         null,
//         null,
//         null
//       );
//       const pendingOutstandingFlat = flattenResult(pendingOutRaw);
//       const pendingOutstanding = sumFields(pendingOutstandingFlat); // ✅ SUM all rows per OwnerID

//       // Total outstanding balance = current + pending
//       const totalOutstanding = {};
//       for (const k in currentOutstanding)
//         totalOutstanding[k] =
//           (currentOutstanding[k] || 0) + (pendingOutstanding[k] || 0);

//       // PUSH FINAL ROWS
//       finalRows.push(
//         makeRow('Current Demand', currentDemand),
//         makeRow('Pending Demand', pendingDemand),
//         makeRow('Total Demand', totalDemand),
//         makeRow('Current Collection', currentCollection),
//         makeRow('Pending Collection', pendingCollection),
//         makeRow('Total Collection', totalCollection),
//         makeRow('Current Outstanding Balance', currentOutstanding),
//         makeRow('Pending Outstanding Balance', pendingOutstanding), // ✅ FIXED HERE
//         makeRow('Total Outstanding Balance', totalOutstanding),
//         makeRow('Total Advance Collection', adv),
//         makeRow('Total Miscellaneous', {
//           MiscellaneousFee: currentCollection.MiscellaneousFee || 0,
//         })
//       );
//     }

//     // normalize numeric values
//     const normalizedRows = finalRows.map((row) => {
//       taxHeads.forEach((h) => {
//         if (typeof row[h] !== 'number') row[h] = 0;
//       });
//       if (typeof row.NetTotal !== 'number') row.NetTotal = 0;
//       return row;
//     });

//     return res.status(200).json(normalizedRows);
//   } catch (error) {
//     console.error('🔥 Error in getGhoshwaraOwnerwiseFull:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

export const getGhoshwaraOwnerwiseFull = async (req, res) => {
  try {
    const { OwnerID, p_Year } = req.body;

    if (!OwnerID || (Array.isArray(OwnerID) && OwnerID.length === 0)) {
      return res.status(400).json({ message: '⚠️ OwnerID is required' });
    }

    const year = Number(p_Year) || new Date().getFullYear();
    const owners = Array.isArray(OwnerID) ? OwnerID : [OwnerID];

    const taxHeads = [
      'PropertyTax',
      'EducationTax',
      'EmploymentTax',
      'TreeCess',
      'DrainCess',
      'Sanitation',
      'SpWaterCess',
      'RoadCess',
      'FireCess',
      'LightCess',
      'WaterBill',
      'WaterBenefit',
      'MajorBuilding',
      'SewageDisposalCess',
      'SpEducationTax',
      'Tax1',
      'Tax2',
      'Tax3',
      'Tax4',
      'Tax5',
      'MiscellaneousFee',
      'Interest',
      'NoticeFee',
      'WarrentFee',
    ];

    const finalRows = [];

    const sumFields = (rows) => {
      if (!rows?.length) return {};
      return rows.reduce((acc, r) => {
        for (const k in r)
          if (typeof r[k] === 'number') acc[k] = (acc[k] || 0) + r[k];
        return acc;
      }, {});
    };

    const flatten = (data) => {
      const out = [];
      const walk = (x) => {
        if (!x) return;
        if (Array.isArray(x)) x.forEach(walk);
        else if (x['0']) walk(x['0']);
        else if (typeof x === 'object' && x.OwnerID) out.push(x);
      };
      walk(data);
      return out;
    };

    for (const owner of owners) {
      const prop = await PropertyMast.findOne({
        attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo'],
        where: { OwnerID: owner },
        raw: true,
      });

      const makeRow = (SrNo, data = {}) => ({
        SrNo,
        OwnerID: owner,
        WardNo: prop?.NewWardNo ?? '-',
        PropertyNo: prop?.NewPropertyNo ?? '-',
        PartitionNo: prop?.NewPartitionNo ?? '-',
        FinanceYear: year,
        ...Object.fromEntries(taxHeads.map((h) => [h, data[h] ?? 0])),
        NetTotal: data.NetTotal ?? 0,
      });

      console.log('🔍 OWNER:', owner);

      // -------------------------------------------------------
      // 1️⃣ CURRENT DEMAND  (kept using executeSP as requested)
      // -------------------------------------------------------
      const currDemandRaw = await executeSP(
        'funAMCGetCurrentDemand',
        owner,
        year
      );
      const currentDemand = sumFields(flatten(currDemandRaw));

      // 2️⃣ PENDING DEMAND
      const pendDemandRaw = await executeSP(
        'funAMCGetPendingDemand',
        owner,
        year
      );
      const pendingDemand = sumFields(flatten(pendDemandRaw));

      const totalDemand = {};
      for (const k in currentDemand)
        totalDemand[k] = (currentDemand[k] || 0) + (pendingDemand[k] || 0);

      // -------------------------------------------------------
      // 3️⃣ CURRENT COLLECTION — Direct SP Call
      // -------------------------------------------------------
      const currCollRaw = await sequelize.query(
        `CALL funAMCGetCurrentCollection(
            :p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo,
            :p_PartitionNo, :p_Mode, :p_OwnerIDList,
            :p_Year, :p_from_date, :p_to_date
        );`,
        {
          replacements: {
            p_WardNo: '',
            p_FromPropertyNo: null,
            p_ToPropertyNo: null,
            p_PartitionNo: '',
            p_Mode: '',
            p_OwnerIDList: String(owner), // MUST be string
            p_Year: Number(year),
            p_from_date: null,
            p_to_date: null,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const currentCollection = sumFields(flatten(currCollRaw));

      // -------------------------------------------------------
      // 4️⃣ PENDING COLLECTION — Direct SP Call
      // -------------------------------------------------------
      const pendCollRaw = await sequelize.query(
        `CALL funAMCGetPendingCollection(
            :p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo,
            :p_PartitionNo, :p_Mode, :p_OwnerIDList,
            :p_Year, :p_from_date, :p_to_date
        );`,
        {
          replacements: {
            p_WardNo: '',
            p_FromPropertyNo: null,
            p_ToPropertyNo: null,
            p_PartitionNo: '',
            p_Mode: '',
            p_OwnerIDList: String(owner), // MUST be string
            p_Year: Number(year),
            p_from_date: null,
            p_to_date: null,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const pendingCollection = sumFields(flatten(pendCollRaw));

      const totalCollection = {};
      for (const k in currentCollection)
        totalCollection[k] =
          (currentCollection[k] || 0) + (pendingCollection[k] || 0);

      // -------------------------------------------------------
      // 5️⃣ ADVANCE (table)
      // -------------------------------------------------------
      const advRows = await BillTransactionDetailsAdvance.findAll({
        where: { OwnerID: owner, FinanceYear: year },
        raw: true,
      });
      const adv = sumFields(advRows);

      // -------------------------------------------------------
      // 6️⃣ CURRENT OUTSTANDING BALANCE — Direct SP Call
      // -------------------------------------------------------
      const currOutRaw = await sequelize.query(
        `CALL funAMCGetCurrentBalance(
            :p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo,
            :p_PartitionNo, :p_Mode, :p_OwnerIDList,
            :p_Year, :p_from_date, :p_to_date
        );`,
        {
          replacements: {
            p_WardNo: '',
            p_FromPropertyNo: null,
            p_ToPropertyNo: null,
            p_PartitionNo: '',
            p_Mode: '',
            p_OwnerIDList: String(owner), // MUST be string
            p_Year: Number(year),
            p_from_date: null,
            p_to_date: null,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const currentOutstanding = sumFields(flatten(currOutRaw));

      // -------------------------------------------------------
      // 7️⃣ PENDING OUTSTANDING BALANCE — Direct SP Call
      // -------------------------------------------------------
      const pendOutRaw = await sequelize.query(
        `CALL funAMCGetPendingBalance(
            :p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo,
            :p_PartitionNo, :p_Mode, :p_OwnerIDList,
            :p_Year, :p_from_date, :p_to_date
        );`,
        {
          replacements: {
            p_WardNo: '',
            p_FromPropertyNo: null,
            p_ToPropertyNo: null,
            p_PartitionNo: '',
            p_Mode: '',
            p_OwnerIDList: String(owner), // MUST be string
            p_Year: Number(year),
            p_from_date: null,
            p_to_date: null,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const pendingOutstanding = sumFields(flatten(pendOutRaw));

      const totalOutstanding = {};
      for (const k in currentOutstanding)
        totalOutstanding[k] =
          (currentOutstanding[k] || 0) + (pendingOutstanding[k] || 0);

      // -------------------------------------------------------
      // 8️⃣ MISC (collection only)
      // -------------------------------------------------------
      const miscFee = {
        MiscellaneousFee: currentCollection.MiscellaneousFee || 0,
      };

      // -------------------------------------------------------
      // PUSH FINAL 11 ROWS
      // -------------------------------------------------------
      finalRows.push(
        makeRow('Current Demand', currentDemand),
        makeRow('Pending Demand', pendingDemand),
        makeRow('Total Demand', totalDemand),

        makeRow('Current Collection', currentCollection),
        makeRow('Pending Collection', pendingCollection),
        makeRow('Total Collection', totalCollection),

        makeRow('Current Outstanding Balance', currentOutstanding),
        makeRow('Pending Outstanding Balance', pendingOutstanding),
        makeRow('Total Outstanding Balance', totalOutstanding),

        makeRow('Total Advance Collection', adv),
        makeRow('Total Miscellaneous', miscFee)
      );
    }

    return res.status(200).json(finalRows);
  } catch (error) {
    console.error('🔥 ERROR IN GHOSHWARA:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};
