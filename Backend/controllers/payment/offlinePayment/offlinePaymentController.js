

import sequelize from '../../../config/connectionDB.js'
import { Op } from 'sequelize';

import PropertyMast from '../../../models/models/propertymast.js';
import { OldPropertyMast } from '../../../models/models/oldpropertymast.js';
import PropertySocialDetails from '../../../models/models/propertysocialdetails.js';
import ActiveTaxesMaster from '../../../models/models/activetaxesmaster.js';
import CombinedOwnerName from '../../../models/models/combinedownerrenternames.js';
import BillTransactionDetails from '../../../models/models/billtransactiondetails.js';
import { distributeTaxPayment } from '../../../utils/offlinePymentCal.js';
import BillBookEntry from '../../../models/models/billbookentry.js';
import DiscountSlabMaster from '../../../models/models/discountslabmaster.js';
import ZoneSectionDetails from '../../../models/models/zonesectiondetails.js';
import PaymentModeMaster from '../../../models/models/paymentModeMaster .js';
import BankMaster from '../../../models/models/bankmaster.js';


export const fetchOldWardNumbers = async (req, res) => {
  try {
    const wards = await OldPropertyMast.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('OldWardNo')), 'OldWardNo'],
      ],
      where: {
        OldWardNo: {
          [Op.and]: [
            { [Op.ne]: null },         // not NULL
            { [Op.ne]: '' },           // not empty
            sequelize.where(
              sequelize.col('OldWardNo'),
              { [Op.regexp]: '^[0-9]+$' } // ONLY numbers
            ),
          ],
        },
      },
      order: [[sequelize.literal('CAST(OldWardNo AS UNSIGNED)'), 'ASC']],
      raw: true,
    });

    return res.status(200).json({
      message: 'Old ward numbers fetched successfully',
      wards,
    });
  } catch (error) {
    console.error('Error fetching old ward numbers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const fetchOldOwnerIdsAndDetails = async (req, res) => {
  const { wardNo } = req.body;

  if (!wardNo) {
    return res.status(400).json({ error: 'Old ward number is required' });
  }

  try {
    const properties = await OldPropertyMast.findAll({
      attributes: [
        'OwnerID',
        'OldWardNo',
        'OldPropertyNo',
        'OldPartitionNo',
      ],
      where: {
        OldWardNo: wardNo,

        // ✅ FILTER ONLY VALID NUMERIC PROPERTY NOS
        [Op.and]: [
          { OldPropertyNo: { [Op.ne]: null } },     // not NULL
          { OldPropertyNo: { [Op.ne]: '' } },       // not empty
          sequelize.where(
            sequelize.fn('TRIM', sequelize.col('OldPropertyNo')),
            {
              [Op.regexp]: '^[0-9]+$'               // ONLY numbers
            }
          )
        ],
      },
      order: [
        [sequelize.cast(sequelize.col('OldPropertyNo'), 'UNSIGNED'), 'ASC'],
        ['OldPartitionNo', 'ASC'],
      ],
    });

    if (!properties.length) {
      return res.status(203).json({
        message: 'No valid old properties found for given ward',
      });
    }

    return res.status(200).json({
      message: 'Old properties found',
      properties,
    });
  } catch (error) {
    console.error('Error fetching old properties:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




export const fetchOldWardBasedProperties = async (req,res) => {
const {oldWardNo}=req.body;

  if (!oldWardNo) return { error: 'Old ward number is required' };

  const oldOwners = await OldPropertyMast.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('OwnerID')), 'OwnerID']],
    where: {
      OldWardNo: oldWardNo,
      OwnerID: { [Op.ne]: null }
    },
    raw: true
  });

  const ownerIds = oldOwners.map(o => Number(o.OwnerID)).filter(Boolean);

  if (!ownerIds.length) {
    return { message: 'No owner IDs found for given old ward', data: [] };
  }

  const properties = await PropertyMast.findAll({
    attributes: [
      'OwnerID',
      'OwnerName',
      'OwnerNameMarathi',
      'NewWardNo',
      'NewPropertyNo',
      'NewPartitionNo'
    ],
    where: { OwnerID: { [Op.in]: ownerIds } },
    order: [
      ['NewWardNo', 'ASC'],
      ['NewPropertyNo', 'ASC'],
      ['NewPartitionNo', 'ASC']
    ],
    raw: true
  });

  if (!properties.length) {
    return { message: 'No matching properties found in PropertyMast', data: [] };
  }

  const result = [];

  for (const prop of properties) {
    const renterRow = await CombinedOwnerName.findOne({
      attributes: ['RenterName'],
      where: { OwnerID: prop.OwnerID },
      raw: true
    });

    result.push({ ...prop, renterName: renterRow?.RenterName || null });
  }

  return { message: 'Mapped properties fetched successfully', data: result };
};


// export const getPropertyInfo = async (req, res) => {
//   try {
//     const {
//       OwnerID,
//       primaryOwnerEng,
//       primaryOwnerMar,
//       occupierEng,
//       occupierMar,
//       computerNo,
//       mobileNo,
//     } = req.body;

//     console.log("REQ BODY 👉", req.body);

//     // ======================================================
//     // 1️⃣ OwnerID (Highest Priority)
//     // ======================================================
//     if (OwnerID) {
//       const property = await PropertyMast.findOne({ where: { OwnerID } });

//       if (!property) {
//         return res.status(404).json({ message: "Property not found" });
//       }

//       const renter = await CombinedOwnerName.findOne({ where: { OwnerID } });

//       return res.status(200).json({
//         data: { ...property.dataValues, renterName: renter?.RenterName || null },
//       });
//     }

    

// // ======================================================
// // 2️⃣ Computer No (Search in OldPropertyMast → OwnerID)
// // ======================================================
// if (computerNo) {

//   // 1️⃣ Find in OldPropertyMast
//   const oldRecord = await OldPropertyMast.findOne({
//     where: { OldComputerNo: computerNo }
//   });

//   if (!oldRecord) {
//     return res.status(404).json({
//       message: "Computer No not found"
//     });
//   }

//   // 2️⃣ Get matching PropertyMast
//   const property = await PropertyMast.findOne({
//     where: { OwnerID: oldRecord.OwnerID }
//   });

//   if (!property) {
//     return res.status(404).json({
//       message: "Property not found"
//     });
//   }

//   // 3️⃣ Get renter if exists
//   const renter = await CombinedOwnerName.findOne({
//     where: { OwnerID: property.OwnerID }
//   });

//   // 4️⃣ ⭐ ALWAYS RETURN ARRAY ⭐
//   return res.status(200).json({
//     data: [
//       {
//         ...property.dataValues,
//         renterName: renter?.RenterName || null
//       }
//     ]
//   });
// }



//   // 3️⃣ Get renter if exists
//   const renter = await CombinedOwnerName.findOne({
//     where: { OwnerID: property.OwnerID }
//   });

//   // 4️⃣ Return full result
//   return res.status(200).json({
//     data: {
//       ...property.dataValues,
//       renterName: renter?.RenterName || null
//     }
//   });



//     // ======================================================
//     // 3️⃣ Mobile No
//     // ======================================================
//     if (mobileNo) {
//       const list = await PropertyMast.findAll({ where: { MobileNo: mobileNo } });

//       if (!list.length) {
//         return res.status(404).json({ message: "No properties found" });
//       }

//       const result = await Promise.all(
//         list.map(async (p) => {
//           const renter = await CombinedOwnerName.findOne({
//             where: { OwnerID: p.OwnerID },
//           });
//           return { ...p.dataValues, renterName: renter?.RenterName || null };
//         })
//       );

//       return res.status(200).json({ data: result });
//     }

//     // ======================================================
//     // 4️⃣ Name Search
//     // ======================================================
//     if (primaryOwnerEng || primaryOwnerMar || occupierEng || occupierMar) {
//       const list = await PropertyMast.findAll({
//         where: {
//           [Op.or]: [
//             primaryOwnerEng && { OwnerName: { [Op.like]: `%${primaryOwnerEng}%` } },
//             primaryOwnerMar && { OwnerNameMarathi: { [Op.like]: `%${primaryOwnerMar}%` } },
//             occupierEng && { OccupierName: { [Op.like]: `%${occupierEng}%` } },
//             occupierMar && { OccupierNameMarathi: { [Op.like]: `%${occupierMar}%` } },
//           ].filter(Boolean),
//         },
//         limit: 50,
//       });

//       const result = await Promise.all(
//         list.map(async (p) => {
//           const renter = await CombinedOwnerName.findOne({
//             where: { OwnerID: p.OwnerID },
//           });
//           return { ...p.dataValues, renterName: renter?.RenterName || null };
//         })
//       );

//       return res.status(200).json({ data: result });
//     }

//     // ======================================================
//     // 5️⃣ Nothing entered
//     // ======================================================
//     return res.status(400).json({
//       message: "Enter OwnerID OR Old City Survey No OR Mobile No OR Name",
//     });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
export const getPropertyInfo = async (req, res) => {
  try {
    const {
      OwnerID,
      primaryOwnerEng,
      primaryOwnerMar,
      occupierEng,
      occupierMar,
      computerNo,
      mobileNo,
    } = req.body;

    console.log("REQ BODY 👉", req.body);

    let property = null;

    // 1️⃣ OwnerID
    if (OwnerID) {
      property = await PropertyMast.findOne({ where: { OwnerID } });

      if (!property) return res.status(404).json({ message: "Property not found" });

      const renter = await CombinedOwnerName.findOne({ where: { OwnerID } });

      return res.status(200).json({
        data: { ...property.dataValues, renterName: renter?.RenterName || null },
      });
    }


    // 2️⃣ Computer No
    if (computerNo) {

      const oldRecord = await OldPropertyMast.findOne({
        where: { OldComputerNo: computerNo }
      });

      if (!oldRecord)
        return res.status(404).json({ message: "Computer No not found" });

      property = await PropertyMast.findOne({
        where: { OwnerID: oldRecord.OwnerID }
      });

      if (!property)
        return res.status(404).json({ message: "Property not found" });

      const renter = await CombinedOwnerName.findOne({
        where: { OwnerID: property.OwnerID }
      });

      return res.status(200).json({
        data: [
          {
            ...property.dataValues,
            renterName: renter?.RenterName || null
          }
        ]
      });
    }


    // 3️⃣ Mobile No
    if (mobileNo) {
      const list = await PropertyMast.findAll({ where: { MobileNo: mobileNo } });

      if (!list.length)
        return res.status(404).json({ message: "No properties found" });

      const result = await Promise.all(
        list.map(async (p) => {
          const renter = await CombinedOwnerName.findOne({
            where: { OwnerID: p.OwnerID },
          });
          return { ...p.dataValues, renterName: renter?.RenterName || null };
        })
      );

      return res.status(200).json({ data: result });
    }


    // 4️⃣ Name Search
    if (primaryOwnerEng || primaryOwnerMar || occupierEng || occupierMar) {
      const list = await PropertyMast.findAll({
        where: {
          [Op.or]: [
            primaryOwnerEng && { OwnerName: { [Op.like]: `%${primaryOwnerEng}%` } },
            primaryOwnerMar && { OwnerNameMarathi: { [Op.like]: `%${primaryOwnerMar}%` } },
            occupierEng && { OccupierName: { [Op.like]: `%${occupierEng}%` } },
            occupierMar && { OccupierNameMarathi: { [Op.like]: `%${occupierMar}%` } },
          ].filter(Boolean),
        },
        limit: 50,
      });

      const result = await Promise.all(
        list.map(async (p) => {
          const renter = await CombinedOwnerName.findOne({
            where: { OwnerID: p.OwnerID },
          });
          return { ...p.dataValues, renterName: renter?.RenterName || null };
        })
      );

      return res.status(200).json({ data: result });
    }


    // 5️⃣ Nothing entered
    return res.status(400).json({
      message: "Enter OwnerID OR Old City Survey No OR Mobile No OR Name",
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const wardBasedProperties= async (req, res) => {
  const { wardNo } = req.body;

  if (!wardNo) {
    return res.status(400).json({ error: 'Ward number is required' });
  }

  try {
    const properties = await PropertyMast.findAll({
      attributes: [
        "NewWardNo",
        "OwnerName",
        "NewPropertyNo",
        "OwnerID",
        "NewPartitionNo",
        "OccupierName"
      ],
      where: { NewWardNo: wardNo },
      raw: true
    });

    if (properties.length === 0) {
      return res.status(203).json({
        message: "No properties found for the given ward number"
      });
    }

    // 🔹 Get renter name for each OwnerID
    const result = [];

    for (const prop of properties) {
      const renterRow = await CombinedOwnerName.findOne({
        attributes: ["RenterName"],
        where: { OwnerID: prop.OwnerID },
        raw: true
      });

      result.push({
        ...prop,
        renterName: renterRow?.RenterName || null
      });
    }

    return res.status(200).json({
      message: "Properties found",
      properties: result
    });

  } catch (error) {
    console.error("Error querying database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMinorInfo = async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({
        message: 'OwnerID is required.',
      });
    }

    // ----------------------------
    // 1️⃣ Fetch main property data
    // ----------------------------
    const property = await PropertyMast.findOne({
      where: { OwnerID: ownerId },
      raw: true,
    });

    if (!property) {
      return res.status(404).json({
        message: 'No property found for given OwnerID.',
      });
    }

    // ----------------------------
    // 2️⃣ Fetch Old Property Details
    // ----------------------------
    const oldProperty = await OldPropertyMast.findOne({
      where: { OwnerID: ownerId },
      raw: true,
    });

    // ----------------------------
    // 3️⃣ Fetch Social Details (R-Toilet / C-Toilet)
    // ----------------------------
    const social = await PropertySocialDetails.findOne({
      where: { OwnerID: ownerId },
      raw: true,
    });

 // 👍 Fetch renter only after property found
      const renterData = await CombinedOwnerName.findOne({
        where: { OwnerID: ownerId},
      });

      const renterName = renterData ? renterData.RenterName : null;


    // ----------------------------
    // 4️⃣ Prepare Final Combined Response
    // ----------------------------
    const minorInfo = {
      ...property,
      addressMarathi: property.Address || '',
      addressEnglish: property.Address || '',

      shopNameMarathi: property.BuildingOrShopNameMarathi || '',
      shopNameEnglish: property.BuildingOrShopName || '',

      flatNo: property.BuildingOrFlatNo || '',
      mobileNo: property.MobileNo || '',

      rToilet: social?.RToilet || 0,
      cToilet: social?.CToilet || 0,

      oldPropertyNo: oldProperty?.OldPropertyNo || '',
      newPlotNo: property.NewPlotNo || '',
      newCityServeyNo: property.NewCityServeyNo || '',

      loanRemark: property.PropertyRemark || '',
      fileNo: property.PropertyRemarkTwo || '',

      length: property.OpenPlotLength || '',
      width: property.OpenPlotWidth || '',
      renterName: renterName || '',
    };

    return res.status(200).json({
      message: 'Minor Info fetched successfully.',
      data: minorInfo
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
};


export const saveMinorInfo = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // ✅ EXTRACT minorData FIRST
    const { minorData } = req.body;

    console.log(minorData, "minor data to be saved");

    if (!minorData || !minorData.OwnerID) {
      return res.status(400).json({ message: "OwnerID is required." });
    }

    const {
      OwnerID,
      addressEnglish,
      addressMarathi,
      shopNameEnglish,
      shopNameMarathi,
      flatNo,
      mobileNo,
      newPlotNo,
      newCityServeyNo,
      loanRemark,
      fileNo,
      length,
      width,
      rToilet,
      cToilet,
      oldPropertyNo,
      renterName
    } = minorData;

    // 1️⃣ PropertyMast
    await PropertyMast.update(
      {
        Address: addressEnglish,
        AddressMarathi: addressMarathi,
        BuildingOrShopName: shopNameEnglish,
        BuildingOrShopNameMarathi: shopNameMarathi,
        BuildingOrFlatNo: flatNo,
        MobileNo: mobileNo,
        NewPlotNo: newPlotNo,
        NewCityServeyNo: newCityServeyNo,
        LoanRemark: loanRemark,
        FileNo: fileNo,
        OpenPlotLength: length,
        OpenPlotWidth: width,
      },
      { where: { OwnerID }, transaction }
    );

    // 2️⃣ OldPropertyMast
    await OldPropertyMast.update(
      { OldPropertyNo: oldPropertyNo },
      { where: { OwnerID }, transaction }
    );

    // 3️⃣ Social Details
    await PropertySocialDetails.update(
      {
        RToilet: rToilet,
        CToilet: cToilet,
      },
      { where: { OwnerID }, transaction }
    );

    // 4️⃣ Renter
    await CombinedOwnerName.update(
      { RenterName: renterName },
      { where: { OwnerID }, transaction }
    );

    await transaction.commit();

    return res.status(200).json({
      message: "Minor Info saved successfully.",
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getBillBookNumbers = async (req, res) => {
  try {
    const { UserID } = req.body;

    console.log("🔍 Filtering with UserID:", UserID);

    const result = await BillBookEntry.findAll({
      attributes: ["BillBookNo", "Status"],
      where: { UserID }
    });

    console.log("📦 Result:", result);

    return res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Error fetching BillBookNo:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getOutstandingCurrentBalancePaymentDetails = async (req, res) => {
  try {
    let { OwnerID, p_Year } = req.body;

    console.log(OwnerID, p_Year ,"current balance")

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
        ? Object.values(spResults[2])
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

export const getOutstandingPendingBalancePaymentDetails = async (req, res) => {
  try {
    let { OwnerID, p_Year } = req.body;

    console.log("Pending balance request:", OwnerID, p_Year);

    if (!OwnerID) {
      return res.status(400).json({ message: "⚠️ OwnerID is required" });
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

    console.log("➡️ Executing SP funAMCGetPendingBalance…");

    const spResult = await sequelize.query(
      `CALL funAMCGetPendingBalance(
        :p_WardNo, :p_FromPropertyNo, :p_ToPropertyNo,
        :p_PartitionNo, :p_Mode, :p_OwnerIDList,
        :p_Year, :p_from_date, :p_to_date
      );`,
{ replacements, type: sequelize.QueryTypes.SELECT }
    );

    console.log('Raw SP Results pending balance:', spResult);

    // Extract actual rows (temp_currentBalance results are usually first element)
    const dataRows =
      spResult.length && typeof spResult[0] === 'object'
        ? Object.values(spResult[2])
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

export const getOrderedTaxAliases = async (req, res) => {
  try {
    // 1️⃣ Fetch only ACTIVE taxes
    const taxes = await ActiveTaxesMaster.findAll({
      where: { Status: 1 },
      attributes: ['TaxName', 'TaxNameAlias', 'TaxNameOrder'],
      order: [['TaxNameOrder', 'ASC']], // Sort by order
    });

    // 2️⃣ Map to { key, label } format
    const sortedTaxes = taxes.map((t) => ({
      key: t.TaxName,       // Matches SP data keys
      label: t.TaxNameAlias // Marathi display name
    }));

    res.status(200).json({
      success: true,
      count: sortedTaxes.length,
      data: sortedTaxes,
    });

  } catch (error) {
    console.error('Error fetching ordered tax aliases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tax aliases.',
    });
  }
};

export const saveBillTransactionDetails = async (req, res) => {
  try {
    const {
      OwnerID,
      WardNo,
      PropertyNo,
      FinanceYear,
      PendingYear,
      paymentMode,
      billBookNo,
      invoiceNo,
      email,
      mobile,
      totalPaid,
      PartitionNo,
      partialAmount,
      extraAmount,
      noticeFee,
      pendingBalanceObj,
      currentBalanceObj,
      paymentDetails
    } = req.body;

    console.log("🔵 Full Incoming Payload:", req.body);
    const message = `This is a system generated mail. Please do not reply to this email ID.

If you have a query or need any clarification you may:
(1) Call our 24-hour Customer Care, or
(2) Email Us at helpdesk.mangaonnp@gmail.com
`;

      // const options = {
      //       from: process.env.EMAIL_ID,
      //       to: email,
      //       subject: 'Payment Receipt',
      //       text: message
      //     }
    
      //     await SENDMAIL(options);``

//merchant number
// 🔹 Generate MerchantTaxRefNumber (INLINE)
const random6 = Math.floor(100000 + Math.random() * 900000);

let MerchantTaxRefNumber = `${random6}W${WardNo}`;

if (PropertyNo) {
  MerchantTaxRefNumber += `P${PropertyNo}`;
}

if (PartitionNo) {
  MerchantTaxRefNumber += `D${PartitionNo}`;
}


console.log("🧾 MerchantTaxRefNumber:", MerchantTaxRefNumber);




    // Build Only Allowed DB Fields
    const createObj = {
      OwnerID,
      BillBookNo: billBookNo,
      InvoiceNo: invoiceNo,
      FinanceYear,
      PendingYear,
      MerchantTxnRefNumber:MerchantTaxRefNumber,
      // Tax breakdown (pull from current & pending objects)
      PropertyTax: pendingBalanceObj?.PropertyTax || currentBalanceObj?.PropertyTax || 0,
      EducationTax: pendingBalanceObj?.EducationTax || currentBalanceObj?.EducationTax || 0,
      EmploymentTax: pendingBalanceObj?.EmploymentTax || currentBalanceObj?.EmploymentTax || 0,
      TreeCess: pendingBalanceObj?.TreeCess || currentBalanceObj?.TreeCess || 0,
      SpWaterCess: pendingBalanceObj?.SpWaterCess || currentBalanceObj?.SpWaterCess || 0,
      Sanitation: pendingBalanceObj?.Sanitation || currentBalanceObj?.Sanitation || 0,
      DrainCess: pendingBalanceObj?.DrainCess || currentBalanceObj?.DrainCess || 0,
      RoadCess: pendingBalanceObj?.RoadCess || currentBalanceObj?.RoadCess || 0,
      FireCess: pendingBalanceObj?.FireCess || currentBalanceObj?.FireCess || 0,
      LightCess: pendingBalanceObj?.LightCess || currentBalanceObj?.LightCess || 0,
      WaterBenefit: pendingBalanceObj?.WaterBenefit || currentBalanceObj?.WaterBenefit || 0,
      MajorBuilding: pendingBalanceObj?.MajorBuilding || currentBalanceObj?.MajorBuilding || 0,
      SewageDisposalCess: pendingBalanceObj?.SewageDisposalCess || currentBalanceObj?.SewageDisposalCess || 0,
      SpEducationTax: pendingBalanceObj?.SpEducationTax || currentBalanceObj?.SpEducationTax || 0,
      WaterBill: pendingBalanceObj?.WaterBill || currentBalanceObj?.WaterBill || 0,

      Tax1: pendingBalanceObj?.Tax1 || currentBalanceObj?.Tax1 || 0,
      Tax2: pendingBalanceObj?.Tax2 || currentBalanceObj?.Tax2 || 0,
      Tax3: pendingBalanceObj?.Tax3 || currentBalanceObj?.Tax3 || 0,
      Tax4: pendingBalanceObj?.Tax4 || currentBalanceObj?.Tax4 || 0,
      Tax5: pendingBalanceObj?.Tax5 || currentBalanceObj?.Tax5 || 0,

      // Sum of taxes
      TaxTotal:
        Number(pendingBalanceObj?.Total || 0) +
        Number(currentBalanceObj?.Total || 0),

      // Additional fields
      Noticefee: noticeFee || 0,
      NetTotal: Number(totalPaid || 0),
      Amount: Number(totalPaid || 0),
      // PartialAmount: partialAmount || 0,
      //ExtraAmount: extraAmount || 0,

      // Payment Mode Details
      PaymentMode: paymentMode,
      DDChequeNo: paymentDetails?.chequeNo || null,
      DDChequeDate: paymentDetails?.chequeDate || null,
      PayeeName: paymentDetails?.behalfPayer || null,
      BankName: paymentDetails?.bank || null,
      BranchName: null, // optional
      ChequeStatus: null,
      ExpiryDate: null,
      IFSCNo: null,

      // Misc fields
      EmailId: email,
      MobileNumber: mobile,
      Remark: null,
      PaymentType: "OFFLINE",
      TransactionId: null,
      PaymentResource: null,
      BillDate: new Date(),
      TransactionDate: new Date(),

      // Save JSON objects
      PendingData: JSON.stringify(pendingBalanceObj || {}),
      CurrentData: JSON.stringify(currentBalanceObj || {}),

      CreatedDate: new Date(),
      CreatedBy: 1
    };

    console.log("🟢 FINAL OBJECT INSERTED INTO DB:", createObj);

    const savedRecord = await BillTransactionDetails.create(createObj);

    res.status(200).json({
      message: "Bill transaction saved successfully.",
      data: savedRecord
    });

  } catch (error) {
    console.error("❌ Error saving bill transaction:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message
    });
  }
};





const TAX_KEYS = [
  'PropertyTax','EducationTax','EmploymentTax','TreeCess','SpWaterCess','Sanitation',
  'DrainCess','RoadCess','FireCess','LightCess','WaterBenefit','MajorBuilding',
  'SewageDisposalCess','SpEducationTax','WaterBill','Tax1','Tax2','Tax3','Tax4','Tax5'
];

export const processPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      OwnerID,
      FinanceYear,         
      PendingYear,      
      totalPaid,           
      pendingBalanceObj,   
      currentBalanceObj,   
      billBookNo,
      invoiceNo,
      paymentMode,
      email,
      mobile,
      paymentDetails = {}

    } = req.body;

    if (!OwnerID) return res.status(400).json({ message: 'OwnerID required' });
    if (!totalPaid || Number(totalPaid) <= 0)
      return res.status(400).json({ message: 'Amount required' });

    // Ensure we always pass actual objects (if frontend omitted selected rows, keep empty)
    const pendingObj = (pendingBalanceObj && Number(pendingBalanceObj.TaxTotal) > 0) ? pendingBalanceObj : {};
    const currentObj = (currentBalanceObj && Number(currentBalanceObj.TaxTotal) > 0) ? currentBalanceObj : {};



    // 1) Calculate distribution (pending + current)
    const dist = distributeTaxPayment(pendingObj, currentObj, Number(totalPaid));
    if (dist.error) {
      await t.rollback();
      return res.status(400).json({ message: dist.error });
    }

    // 2) Build receipt (transaction) entry
    const receipt = {
      OwnerID,
      BillBookNo: billBookNo ?? null,
      InvoiceNo: invoiceNo ?? null,
      FinanceYear: FinanceYear ?? null,
      PendingYear: PendingYear ?? null,
      TransactionDate: new Date(),
      BillDate: new Date(),
      PaymentMode: paymentMode ?? null,
      EmailId: email ?? null,
      MobileNumber: mobile ?? null,
      Amount: Number(totalPaid),
      MiscellaneousFee: Number(dist.misc || 0),
      Noticefee: 0,
      Remark: dist.message,
      PaymentResource: 'offline',
      CreatedDate: new Date()
    };

    // Put tax values (sum of pendingPaid + currentPaid where applicable)
    TAX_KEYS.forEach(key => {
      const pendingVal = Number(dist.pendingPaid?.[key] ?? 0);
      const currentVal = Number(dist.currentPaid?.[key] ?? 0);
      receipt[key] = parseFloat((pendingVal + currentVal).toFixed(2));
    });

    receipt.TaxTotal = parseFloat(((dist.pendingPaid?.TaxTotal || 0) + (dist.currentPaid?.TaxTotal || 0)).toFixed(2));
    receipt.NetTotal = parseFloat(((dist.pendingPaid?.NetTotal || 0) + (dist.currentPaid?.NetTotal || 0)).toFixed(2));

    // 3) Save receipt (a new billtransactiondetails record representing payment)
    const savedReceipt = await BillTransactionDetails.create(receipt, { transaction: t });

    // 4) Update existing pending and current rows in DB
    // We will find the latest pending/current row for the Owner (ordered by BTId desc)
    // const existingPending = pendingObj && pendingObj?.TaxTotal > 0
    //   ? await BillTransactionDetails.findOne({ where: { OwnerID, PendingYear }, order: [['BTId','DESC']], transaction: t })
    //   : null;
const existingPending = pendingObj && pendingObj?.TaxTotal > 0
  ? await BillTransactionDetails.findOne({
      where: {
        OwnerID,
        PendingYear,
        TaxType: 'pending'   // ❤️ Only pick actual pending row
      },
      order: [['BTId', 'DESC']],
      transaction: t
    })
  : null;

    const existingCurrent = currentObj && currentObj?.TaxTotal > 0
      ? await BillTransactionDetails.findOne({ where: { OwnerID, FinanceYear }, order: [['BTId','DESC']], transaction: t })
      : null;

    // Update pending row if exists
    if (existingPending) {
      const updatePending = {};
      TAX_KEYS.forEach(k => {
        const prev = Number(existingPending[k] ?? 0);
        const paid = Number(dist.pendingPaid?.[k] ?? 0);
        updatePending[k] = parseFloat(Math.max(0, prev - paid).toFixed(2));
      });
      updatePending.TaxTotal = parseFloat(Math.max(0, (Number(existingPending.TaxTotal ?? 0) - (dist.pendingPaid?.TaxTotal ?? 0))).toFixed(2));
      updatePending.NetTotal = parseFloat(Math.max(0, (Number(existingPending.NetTotal ?? 0) - (dist.pendingPaid?.NetTotal ?? 0))).toFixed(2));
      const updatedPending = await existingPending.update(updatePending, { transaction: t });

      // If fully cleared (all tax fields 0 + TaxTotal/NetTotal 0) -> DELETE row
      const allZeroPending =
        Number(updatedPending.TaxTotal ?? 0) === 0 &&
        Number(updatedPending.NetTotal ?? 0) === 0 &&
        TAX_KEYS.every(k => Number(updatedPending[k] ?? 0) === 0);

      if (allZeroPending) {
        await updatedPending.destroy({ transaction: t });
      }
    }

    // Update current row if exists
    if (existingCurrent) {
      const updateCurrent = {};
      TAX_KEYS.forEach(k => {
        const prev = Number(existingCurrent[k] ?? 0);
        const paid = Number(dist.currentPaid?.[k] ?? 0);
        updateCurrent[k] = parseFloat(Math.max(0, prev - paid).toFixed(2));
      });
      updateCurrent.TaxTotal = parseFloat(Math.max(0, (Number(existingCurrent.TaxTotal ?? 0) - (dist.currentPaid?.TaxTotal ?? 0))).toFixed(2));
      updateCurrent.NetTotal = parseFloat(Math.max(0, (Number(existingCurrent.NetTotal ?? 0) - (dist.currentPaid?.NetTotal ?? 0))).toFixed(2));
      const updatedCurrent = await existingCurrent.update(updateCurrent, { transaction: t });

      const allZeroCurrent =
        Number(updatedCurrent.TaxTotal ?? 0) === 0 &&
        Number(updatedCurrent.NetTotal ?? 0) === 0 &&
        TAX_KEYS.every(k => Number(updatedCurrent[k] ?? 0) === 0);

      if (allZeroCurrent) {
        await updatedCurrent.destroy({ transaction: t });
      }
    }

    // Commit transaction
    await t.commit();

    return res.status(200).json({
      message: 'Payment processed successfully',
      receipt: savedReceipt,
      distribution: dist
    });
  } catch (err) {
    await t.rollback();
    console.error("processPayment error:", err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};


export const calculateCurrentPenalty = async (req, res) => {
  try {
    let { OwnerID, Year } = req.body;

    if (!OwnerID) {
      return res.status(400).json({ message: "⚠️ OwnerID is required" });
    }

    // Call the stored procedure
    const results = await sequelize.query(
      `CALL funAMCcalculateCurrentPenalty(:OwnerID, :Year, null, null, null, null, null);`,
      {
        replacements: { OwnerID, Year: Year || new Date().getFullYear() },
      
      }
    );

    console.log("Penalty results:", results);

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error calling SP:", error);
    return res.status(500).json({ message: "🔥 Server error", error: error.message });
  }
};

export const calculatePendingPenalty = async (req, res) => {
  try {
    let { OwnerID, Year } = req.body;

    if (!OwnerID) {
      return res.status(400).json({ message: "⚠️ OwnerID is required" });
    }

    // Call the stored procedure
   const results = await sequelize.query(

      `CALL funAMCcalculatePendingPenalty(:OwnerID, :Year, null, null, null);`,
      {
        replacements: { OwnerID, Year: Year || new Date().getFullYear() },
        // type: sequelize.QueryTypes.RAW,
      }
    );

    console.log("Penalty results:", results);

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error calling SP:", error);
    return res.status(500).json({ message: "🔥 Server error", error: error.message });
  }
};


export const getNextInvoiceController = async (req, res) => {
  const { userID, status, year } = req.body;
  console.log("🚀 INPUTS:", { userID, status, year });

  try {
   // Call the stored procedure
    const results = await sequelize.query(
      `CALL sp_GetNextInvoiceForBillBook(:UserID,:Status,:Year);`,
      {
        replacements: { UserID:userID, Status:status,Year: year},
        type: sequelize.QueryTypes.RAW,
      }
    );

    console.log("invoice result:", results);
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error calling SP:", error);
    return res.status(500).json({ message: "🔥 Server error", error: error.message });
  }
};


export const getReceiptByOwner = async (req, res) => {
  try {
    const { OwnerID } = req.body;

    const receipt = await BillTransactionDetails.findOne({
      where: { OwnerID },
      // order: [['CreatedDate', 'DESC']], 
    });

    if (!receipt) {
      return res.status(404).json({ found: false });
    }

    res.status(200).json({
      found: true,
      data: receipt,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const getDiscountPercentage = async (req, res) => {
  try {
    const {
      OwnerID,
      DiscountFinanceYear,
      DiscountPendingYear,
      PaymentType,
      PaymentMode
    } = req.body;

    // 1️⃣ Fetch property ward
    const property = await PropertyMast.findOne({
      attributes: ["NewWardNo"],
      where: { OwnerID }
    });

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // 2️⃣ Fetch ZoneSection
    const zoneSection = await ZoneSectionDetails.findOne({
      attributes: ["ZoneSectionNo"],
      where: { Ward: property.NewWardNo }
    });

    if (!zoneSection) {
      return res.status(404).json({ success: false, message: "Zone Section not found" });
    }

    // 3️⃣ Fetch discount slab (🚀 TaxName dynamic)
    const discountSlab = await DiscountSlabMaster.findOne({
      attributes: ["DiscountPercentage", "TaxName"],
      where: {
        ZoneSectionNo: zoneSection.ZoneSectionNo,
        DiscountFinanceYear,
        DiscountPendingYear,
        PaymentType,
        PaymentResource:PaymentMode
      }
    });

    if (!discountSlab) {
      return res.status(200).json({
        success: true,
        discountPercentage: 0,
        taxName: null
      });
    }

    res.status(200).json({
      success: true,
      discountPercentage: Number(discountSlab.DiscountPercentage),
      taxName: discountSlab.TaxName
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const GetPaymentModes=async (req,res)=>{
try {
    const modes = await PaymentModeMaster.findAll({
      attributes: ['Mode'],
      order: [['Mode', 'ASC']]
    });
    res.json({ 
      success: true, 
      paymentModes: modes.map(m => m.Mode) 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch payment modes' });
  }
}



export const GetBankList = async (req, res) => {
  try {
    const banks = await BankMaster.findAll({
      attributes: ['BankName'],
      order: [['BankName', 'ASC']]
    });

    res.json({
      success: true,
      banks: banks.map(b => b.BankName)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch banks' });
  }
};

