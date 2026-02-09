import sequelize from "../../config/connectionDB.js";
import AppealMast from "../../models/models/appealmast.js";
import AppliedPolicyMast from "../../models/models/appliedPolicyMast.js";
import ApplyTaxesMaster from "../../models/models/applytaxesmaster.js";
import Assessmentrulemaster from "../../models/models/assessmentrulesmaster.js";
import CombinedOwnerName from "../../models/models/combinedownerrenternames.js";
import CourtResultMast from "../../models/models/courtresultmast.js";
import HearingMast from "../../models/models/hearingmast.js";
import { OldPropertyMast } from "../../models/models/oldpropertymast.js";
import PropertyMast from "../../models/models/propertymast.js";
import Retaintionfactmaster from "../../models/models/retaintionfactmaster.js";
import retentiontaxmast from "../../models/models/retentiontaxmast.js";
import TaxMaster from "../../models/models/taxmaster.js";
import TaxNameMaster from "../../models/models/taxnamemaster.js";
import TransMast from "../../models/models/transmast.js";
import { Op, QueryTypes } from "sequelize";

export const getPoliciesInfo = async (req, res) => {
  try {
    const getPoliciesInfo = await Assessmentrulemaster.findAll();
    res.status(200).json(getPoliciesInfo);
  } catch (error) {
    console.error("Error getting policies:", error);
    res.status(500).json({
      error: "An error occurred while getting policies.",
    });
  }
};

export const getFinancialYear = async (req, res) => {
  try {
    const getFinancialYear = await TransMast.findAll({
      attributes: [
        [
          sequelize.fn(
            "concat",
            sequelize.col("FinanceYear"),
            "-",
            sequelize.literal("FinanceYear + 1")
          ),
          "FinanceYearRange",
        ],
      ],
      group: [sequelize.col("FinanceYear")],
      order: [[sequelize.col("FinanceYear"), "DESC"]],
    });
    res.status(200).json(getFinancialYear);
  } catch (error) {
    console.error("Error getting Financial Year:", error);
    res.status(500).json({
      error: "An error occurred while getting Financial Year.",
    });
  }
};

export const getRetaintionFactor = async (req, res) => {
  try {
    const getFactorList = await Retaintionfactmaster.findAll({
      attributes: [sequelize.col("FactorValue"), "FactorValue"],
    });
    res.status(200).json(getFactorList);
  } catch (error) {
    console.error("Error getting factors list:", error);
    res.status(500).json({
      error: "An error occurred while getting factors list.",
    });
  }
};

export const getTaxName = async (req, res) => {
  try {
    const getTaxName = await TaxNameMaster.findAll({
      attributes: [[sequelize.col("TaxName"), "TaxName"], "AliseName"],
      where: { Status: true },
    });
    res.status(200).json(getTaxName);
  } catch (error) {
    console.error("Error getting tax name list:", error);
    res.status(500).json({
      error: "An error occurred while getting tax name list.",
    });
  }
};


//succecs
export const getAppealInfoAll = async (req, res) => {
  try {
    const { OwnerId } = req.params;

    // 1️⃣ Main property + related data (without OldPropertyMast include)
    const getFactorList = await PropertyMast.findOne({
      include: [
        {
          model: CombinedOwnerName,
          required: true,
        },
        {
          model: AppealMast,
          required: false,
        },
        {
          model: CourtResultMast,
          required: false,
        },
        {
          model: HearingMast,
          required: false,
        },
        {
          model: retentiontaxmast,
          required: false,
        },
      ],
      where: { OwnerID: OwnerId },
    });

    // 2️⃣ Call NetRV / NetTaxes SP
    const [netRV] = await sequelize.query(
      "CALL prcOverAllNetTaxes(:OwnerId)",
      { replacements: { OwnerId } }
    );

    // 3️⃣ Old details separately
    const oldDetail = await OldPropertyMast.findAll({
      where: { OwnerID: OwnerId },
      raw: true,
    });

    // 4️⃣ Final response
    const response = {
      ...getFactorList?.toJSON(),
      
      netRV: netRV || [],
      oldDetail, 
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting appeal info:", error);
    res.status(500).json({
      error: "An error occurred while getting factors list.",
    });
  }
};

//sucess

  // export const postAppealInfoAll = async (req, res) => {
  //   try {
  //     const appealInfo = req.body;

  //     if (!appealInfo.AppealReason && !appealInfo.AppealReasons)
  //       return res.status(402).json({ message: "Appeal Reason Required." });

  //     if (!appealInfo.OwnerID)
  //       return res.status(402).json({ message: "OwnerID required." });

  //     // Support multiple reasons
  //     const reasons = appealInfo.AppealReasons || [appealInfo.AppealReason];

  //     // Map for Mast data and their actual tables
  //     const mastMap = {
  //       retention: appealInfo.RetaintionMast || [],
  //       hearing: appealInfo.HearingMast || [],
  //       "appeal committee": appealInfo.AppealMast || [],
  //       remission: appealInfo.CourtResultMast || [],
  //     };

  //     const tableMap = {
  //       retention: "retentiontaxmast",
  //       hearing: "hearingmast",
  //       "appeal committee": "appealmast",
  //       remission: "courtresultmast",
  //     };

  //     const expandYears = (yr) => {
  //       if (!yr) return [new Date().getFullYear()];
  //       if (typeof yr === "string" && yr.includes("-")) {
  //         const [start, end] = yr.split("-").map((y) => parseInt(y.trim()));
  //         const years = [];
  //         for (let y = start; y <= end; y++) years.push(y);
  //         return years;
  //       }
  //       return [parseInt(yr)];
  //     };

  //     const insertOrUpdateAppealMast = async (defaults) => {
  //       const existing = await sequelize.query(
  //         `SELECT * FROM appealmast
  //         WHERE OwnerID = :OwnerID
  //           AND WardNo = :WardNo
  //           AND PropertyNo = :PropertyNo
  //           AND Reason = :Reason
  //           `,
  //         { replacements: defaults }
  //       );

  //       defaults.UpdatedDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  //       if (existing[0].length > 0) {
  //         await sequelize.query(
  //           `UPDATE appealmast SET
  //             Date = :Date,
  //             EmpID = :EmpID,
  //             Reason = :Reason,
  //             PartitionNo = :PartitionNo,
  //             RentalValue = :RentalValue,
  //             PropertyTax = :PropertyTax,
  //             Tax1 = :Tax1,
  //             Tax2 = :Tax2,
  //             Tax3 = :Tax3,
  //             Tax4 = :Tax4,
  //             Tax5 = :Tax5,
  //             TreeCess = :TreeCess,
  //             EducationTax = :EducationTax,
  //             EmploymentTax = :EmploymentTax,
  //             SpEducationTax = :SpEducationTax,
  //             Sanitation = :Sanitation,
  //             DrainCess = :DrainCess,
  //             SpWaterCess = :SpWaterCess,
  //             RoadCess = :RoadCess,
  //             FireCess = :FireCess,
  //             LightCess = :LightCess,
  //             WaterBenefit = :WaterBenefit,
  //             MajorBuilding = :MajorBuilding,
  //             SewageDisposalCess = :SewageDisposalCess,
  //             WaterBill = :WaterBill,
  //             AssessmentId = :AssessmentId, 
  //             UpdatedBy = :UpdatedBy,
  //             UpdatedDate = :UpdatedDate
  //           WHERE OwnerID = :OwnerID AND WardNo = :WardNo AND PropertyNo = :PropertyNo AND Reason = :Reason`,
  //           { replacements: defaults }
  //         );
  //       } else {
  //         await sequelize.query(
  //           `INSERT INTO appealmast
  //           (OwnerID, Date, EmpID, Year, Reason, WardNo, PropertyNo, PartitionNo,
  //             RentalValue, PropertyTax, Tax1,Tax2,Tax3,Tax4,Tax5, TreeCess, EducationTax, EmploymentTax,
  //             SpEducationTax, Sanitation, DrainCess, SpWaterCess, RoadCess, FireCess,
  //             LightCess, WaterBenefit, MajorBuilding, SewageDisposalCess, WaterBill,
  //             AssessmentId,  CreatedBy, CreatedDate, UpdatedBy, UpdatedDate)
  //           VALUES
  //           (:OwnerID, :Date, :EmpID, :Year, :Reason, :WardNo, :PropertyNo, :PartitionNo,
  //             :RentalValue, :PropertyTax, :Tax1,:Tax2,:Tax3,:Tax4,:Tax5, :TreeCess, :EducationTax, :EmploymentTax,
  //             :SpEducationTax, :Sanitation, :DrainCess, :SpWaterCess, :RoadCess, :FireCess,
  //             :LightCess, :WaterBenefit, :MajorBuilding, :SewageDisposalCess, :WaterBill,  :AssessmentId,
  //             :CreatedBy, :CreatedDate, :UpdatedBy, :UpdatedDate)`,
  //           { replacements: defaults }
  //         );
  //       }
  //     };

  //     for (const reason of reasons) {
  //       const reasonKey = reason.toLowerCase();
  //       const dataArray = Array.isArray(mastMap[reasonKey])
  //         ? mastMap[reasonKey]
  //         : mastMap[reasonKey]
  //         ? [mastMap[reasonKey]]
  //         : [];

  //       if (!dataArray.length) dataArray.push({}); // default row if empty

  //       for (const item of dataArray) {
  //         const years = expandYears(item.Year || appealInfo.Year);
  //         for (const yr of years) {
  //           const defaults = {
  //             OwnerID: appealInfo.OwnerID,
  //             Date: item.Date
  //               ? new Date(item.Date).toISOString().slice(0, 10)
  //               : new Date().toISOString().slice(0, 10),
  //             WardNo: item.WardNo ?? appealInfo.WardNo ?? null,
  //             PropertyNo: item.PropertyNo ?? appealInfo.PropertyNo ?? null,
  //             PartitionNo: item.PartitionNo ?? appealInfo.PartitionNo ?? null,
  //             Year: yr,
  //             EmpID: item.EmpID ?? appealInfo.EmpID ?? null,
  //             AssessmentId: 1,
  //             Reason: reason,
  //             RentalValue: item.RentalValue ?? 0,
  //             PropertyTax: item.PropertyTax ?? 0,
  //             Tax1: item.Tax1 ?? 0,
  //             Tax2: item.Tax2 ?? 0,
  //             Tax3: item.Tax3 ?? 0,
  //             Tax4: item.Tax4 ?? 0,
  //             Tax5: item.Tax5 ?? 0,
  //             TreeCess: item.TreeCess ?? 0,
  //             EducationTax: item.EducationTax ?? 0,
  //             EmploymentTax: item.EmploymentTax ?? 0,
  //             SpEducationTax: item.SpEducationTax ?? 0,
  //             Sanitation: item.Sanitation ?? 0,
  //             DrainCess: item.DrainCess ?? 0,
  //             SpWaterCess: item.SpWaterCess ?? 0,
  //             RoadCess: item.RoadCess ?? 0,
  //             FireCess: item.FireCess ?? 0,
  //             LightCess: item.LightCess ?? 0,
  //             WaterBenefit: item.WaterBenefit ?? 0,
  //             MajorBuilding: item.MajorBuilding ?? 0,
  //             SewageDisposalCess: item.SewageDisposalCess ?? 0,
  //             WaterBill: item.WaterBill ?? 0,
  //             CreatedBy: appealInfo.CreatedBy ?? null,
  //             UpdatedBy: appealInfo.UpdatedBy ?? null,
  //             CreatedDate: new Date().toISOString().slice(0, 19).replace("T", " "),
  //             UpdatedDate: null,
  //           };

  //           if (dataArray.length && item !== {}) {
  //             const originalTable = tableMap[reasonKey];
  //             const existing = await sequelize.query(
  //               `SELECT * FROM ${originalTable}
  //                WHERE OwnerID = :OwnerID
  //                  AND WardNo = :WardNo
  //                  AND PropertyNo = :PropertyNo
                  
  //                  AND Reason = :Reason`,
  //               { replacements: defaults }
  //             );

  //             if (existing[0].length > 0) {
  //               defaults.UpdatedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  //               await sequelize.query(
  //                 `UPDATE ${originalTable} SET
  //                   Date = :Date, EmpID = :EmpID, Reason = :Reason, PartitionNo = :PartitionNo,
  //                   RentalValue = :RentalValue, PropertyTax = :PropertyTax, Tax1 = :Tax1,
  //                   TreeCess = :TreeCess, EducationTax = :EducationTax, EmploymentTax = :EmploymentTax,
  //                   SpEducationTax = :SpEducationTax, Sanitation = :Sanitation, DrainCess = :DrainCess,
  //                   SpWaterCess = :SpWaterCess, RoadCess = :RoadCess, FireCess = :FireCess,
  //                   LightCess = :LightCess, WaterBenefit = :WaterBenefit, MajorBuilding = :MajorBuilding,
  //                   SewageDisposalCess = :SewageDisposalCess, WaterBill = :WaterBill,
  //                   UpdatedBy = :UpdatedBy, UpdatedDate = :UpdatedDate
  //                 WHERE OwnerID = :OwnerID AND WardNo = :WardNo AND PropertyNo = :PropertyNo AND Reason = :Reason`,
  //                 { replacements: defaults }
  //               );
  //             } else {
  //               await sequelize.query(
  //                 `INSERT INTO ${originalTable}
  //                 (OwnerID, Date, EmpID, Year, Reason, WardNo, PropertyNo, PartitionNo,
  //                   RentalValue, PropertyTax, Tax1, TreeCess, EducationTax, EmploymentTax,
  //                   SpEducationTax, Sanitation, DrainCess, SpWaterCess, RoadCess, FireCess,
  //                   LightCess, WaterBenefit, MajorBuilding, SewageDisposalCess, WaterBill,
  //                   CreatedBy, CreatedDate, UpdatedBy, UpdatedDate)
  //                 VALUES
  //                 (:OwnerID, :Date, :EmpID, :Year, :Reason, :WardNo, :PropertyNo, :PartitionNo,
  //                   :RentalValue, :PropertyTax, :Tax1, :TreeCess, :EducationTax, :EmploymentTax,
  //                   :SpEducationTax, :Sanitation, :DrainCess, :SpWaterCess, :RoadCess, :FireCess,
  //                   :LightCess, :WaterBenefit, :MajorBuilding, :SewageDisposalCess, :WaterBill,
  //                   :CreatedBy, :CreatedDate, :UpdatedBy, :UpdatedDate)`,
  //                 { replacements: defaults }
  //               );
  //             }
  //           }

  //           await insertOrUpdateAppealMast(defaults);
            
  //         }
  //       }
  //     }

  //     res.status(200).json({ message: "All AppealReason rows processed successfully." });
  //   } catch (error) {
  //     console.error("Error storing appeal info:", error);
  //     res.status(500).json({ error: "An error occurred while storing appeal info." });
  //   }
  // };




export const getValuationData = async (req, res) => {
  const { OwnerID } = req.body;

  if (!OwnerID) {
    return res.status(400).json({ message: "OwnerID is required" });
  }

  try {
    // 🔹 Step 1: Call net taxes SP
    const netTaxesResult = await sequelize.query(
      "CALL prcOverAllNetTaxes(:ownerId)",
      {
        replacements: { ownerId: OwnerID },
        type: sequelize.QueryTypes.RAW,
      }
    );

    // 🔹 Step 2: Fetch each category with proper reason filtering
    const retain = await retentiontaxmast.findOne({ 
      where: { OwnerID }, 
      order: [['Date', 'DESC']],
      raw: true 
    });

    const hearing = await HearingMast.findOne({ 
      where: { OwnerID }, 
      order: [['Date', 'DESC']],
      raw: true 
    });

    const appeal = await AppealMast.findOne({ 
      where: { 
        OwnerID,
        Reason: 'appeal committee'   // <-- correct reason filter
      },
      order: [['Date', 'DESC']],
      raw: true 
    });

    const court = await CourtResultMast.findOne({ 
      where: { OwnerID }, 
      order: [['Date', 'DESC']],
      raw: true 
    });

    const oldDetail = await OldPropertyMast.findAll({ where: { OwnerID }, raw: true });

    // 🔹 Step 3: Structure response
    const result = {
      OwnerID,
      net: netTaxesResult[0] || {},
      retain: retain || {},
      hearing: hearing || {},
      appeal: appeal || {},
      court: court || {},
      oldDetail
    };

    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching valuation data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getInitialInfo = async (req, res) => {
  const { OwnerID, RetainRV, WithRV, SelectOne } = req.body; // 👈 4 params body se

  try {
    let finalResult = {};

    // 1️⃣ OldRV Values
    const oldRV = await sequelize.query(
      "SELECT pm.OldRV FROM PropertyMast pm WHERE pm.OwnerID = :ownerId",
      {
        replacements: { ownerId: OwnerID },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    finalResult.OldRV = oldRV?.[0]?.OldRV || null;

    // 2️⃣ Taxes + NetRV (SP call with 4 params)
    const taxes = await sequelize.query(
      "CALL prcCalculateTaxesFromRV(:ownerId, :retainRv, :withRv, :selectOne)",
      {
        replacements: {
          ownerId: OwnerID,
          retainRv: RetainRV || null,
          withRv: WithRV ?? 1,        // default 1
          selectOne: SelectOne ?? 1,  // default 1
        },
      }
    );
    finalResult.CalculateAllTaxesForOwnerID = taxes;

    // 3️⃣ AppliedPolicyMast (Appeal / Hearing Info)
    const appeal = await sequelize.query(
      "SELECT * FROM AppliedPolicyMast WHERE OwnerID = :ownerId",
      {
        replacements: { ownerId: OwnerID },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    finalResult.Check_Appeal_Hearing = appeal;

    // ✅ Final response
    res.status(200).json(finalResult);
  } catch (err) {
    console.error("❌ Error in getInitialInfo:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//total Netrv
export const getOwnerRateableSum = async (req, res) => {
  const { OwnerID } = req.body; // Using body instead of params

  if (!OwnerID) {
    return res.status(400).json({ message: "OwnerID is required" });
  }

  try {
    // 🔹 Step 1: Call the stored procedure funGetAllNETTaxes
    await sequelize.query(
      "CALL funGetAllNETTaxes('', NULL, NULL, '', '', :ownerId)",
      {
        replacements: { ownerId: OwnerID },
        type: sequelize.QueryTypes.RAW,
      }
    );

    // 🔹 Step 2: Fetch sum of RateableValue from the temp table
    const [sumResult] = await sequelize.query(
      "SELECT SUM(RateableValue) AS totalRateableValue FROM tmp_funTblNETTaxes WHERE OwnerID = :ownerId",
      {
        replacements: { ownerId: OwnerID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 🔹 Step 3: Build final response
    const result = {
      OwnerID,
      totalRateableValue: sumResult.totalRateableValue
      ? Number(sumResult.totalRateableValue).toFixed(2)
      : "0.00",    };

    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching Owner Rateable Sum:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//rv with between amount
export const getTaxRateByRV = async (req, res) => {
  try {
    const { amount, taxNameType } = req.body;  

    if (!amount || !taxNameType) {
      return res.status(400).json({ message: "amount and taxNameType are required" });
    }

    const amt = parseFloat(amount);

    // Slab + TaxNameType match
    const taxRow = await TaxMaster.findOne({
      where: {
        Taxnametype: taxNameType,  
        MinAmount: { [Op.lte]: amt },
        MaxAmount: { [Op.gte]: amt },
      },
    });

    if (!taxRow) {
      return res.status(404).json({ message: `No rate found for ${taxNameType} with amount ${amt}` });
    }

    return res.json({ rate: taxRow.Rate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};


//apply tax for taxes

export const getOwnerTaxes = async (req, res) => {
  try {
    const { ownerId } = req.body; // ✅ get from body
    if (!ownerId) {
      return res.status(400).json({ message: "OwnerID is required" });
    }

    const taxes = await ApplyTaxesMaster.findAll({
      where: { OwnerID: ownerId },
      order: [['CreatedDate', 'DESC']]
    });

    if (!taxes || taxes.length === 0) {
      return res.status(404).json({ message: "No tax records found for this OwnerID" });
    }

    const result = taxes.map(item => {
      const obj = item.toJSON();
      for (const key in obj) {
        if (typeof obj[key] === 'boolean') obj[key] = obj[key] ? 1 : 0;
        else if (obj[key] === null) obj[key] = 0;
      }
      return obj;
    });

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
//delete 
// export const resetAppealMast = async (req, res) => {
//   try {
//     const {
//       OwnerID,
//       SelectOne = 5,
//       EmpID = null,
//       WardNo = '',
//       FromPropertyNo = null,
//       ToPropertyNo = null,
//       PartitionNo = '',
//       Mode = '',
//       OwnerIDList = ''
//     } = req.body;

//     if (!OwnerID) {
//       return res.status(400).json({ message: "OwnerID is required" });
//     }

//     await sequelize.query(
//       `CALL PrcResetAppealMast(
//         :OwnerID, :SelectOne, :EmpID, :WardNo, :FromPropertyNo, 
//         :ToPropertyNo, :PartitionNo, :Mode, :OwnerIDList
//       )`,
//       {
//         replacements: {
//           OwnerID,
//           SelectOne,
//           EmpID,
//           WardNo,
//           FromPropertyNo,
//           ToPropertyNo,
//           PartitionNo,
//           Mode,
//           OwnerIDList
//         }
//       }
//     );

//     return res.status(200).json({
//       message: `Appeal data reset successfully for OwnerID ${OwnerID}.`,
//     });
//   } catch (error) {
//     console.error("Error resetting AppealMast:", error);
//     return res.status(500).json({
//       message: "An error occurred while resetting AppealMast.",
//       error: error.message,
//     });
//   }
// };


export const resetAppealMast = async (req, res) => {
  try {
    const appealInfo = req.body;

    if (!appealInfo.OwnerID)
      return res.status(402).json({ message: "OwnerID required." });

    if (!appealInfo.AppealReason && !appealInfo.AppealReasons)
      return res.status(402).json({ message: "Appeal Reason Required." });

    // Support multiple reasons
    const reasons = appealInfo.AppealReasons || [appealInfo.AppealReason];

    // Map table names for each reason
    const tableMap = {
      retention: "retentiontaxmast",
      hearing: "hearingmast",
      "appeal committee": "appealmast",
      remission: "courtresultmast",
    };

    for (const reason of reasons) {
      const reasonKey = reason.toLowerCase();
      const targetTable = tableMap[reasonKey];

      if (!targetTable) continue; // skip if invalid reason

      // 🔹 Delete from the related reason table
      await sequelize.query(
        `DELETE FROM ${targetTable}
         WHERE OwnerID = :OwnerID
           AND Reason = :Reason`,
        {
          replacements: {
            OwnerID: appealInfo.OwnerID,
            Reason: reason,
          },
        }
      );

      // 🔹 Always delete from AppealMast for this reason
      await sequelize.query(
        `DELETE FROM appealmast
         WHERE OwnerID = :OwnerID
           AND Reason = :Reason`,
        {
          replacements: {
            OwnerID: appealInfo.OwnerID,
            Reason: reason,
          },
        }
      );
    }

    return res
      .status(200)
      .json({ message: "Appeal records deleted successfully." });
  } catch (error) {
    console.error("Error deleting appeal info:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting appeal info." });
  }
};

//herning rv
export const getOwnerHearingRentalSum = async (req, res) => {
  const { OwnerID } = req.body; // using body

  if (!OwnerID) {
    return res.status(400).json({ message: "OwnerID is required" });
  }

  try {
    const [sumResult] = await sequelize.query(
      `SELECT SUM(RentalValue) AS totalRentalValue
       FROM hearingmast
       WHERE OwnerID = :ownerId`,
      {
        replacements: { ownerId: OwnerID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 🔹 Step 2: Build final response
    const result = {
      OwnerID,
      totalRentalValue: sumResult.totalRentalValue
        ? Number(sumResult.totalRentalValue).toFixed(2)
        : "0.00",
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Owner Hearing Rental Value:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//court rv
export const getOwnerCourtRentalSum = async (req, res) => {
  const { OwnerID } = req.body; // using body

  if (!OwnerID) {
    return res.status(400).json({ message: "OwnerID is required" });
  }

  try {
    const [sumResult] = await sequelize.query(
      `SELECT SUM(RentalValue) AS totalCourtRentalValue
       FROM CourtResultMast
       WHERE OwnerID = :ownerId`,
      {
        replacements: { ownerId: OwnerID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 🔹 Step 2: Build final response
    const result = {
      OwnerID,
      totalCourtRentalValue: sumResult.totalCourtRentalValue
        ? Number(sumResult.totalCourtRentalValue).toFixed(2)
        : "0.00",
    };

    res.status(200).json(result); 
  } catch (error) {
    console.error("Error fetching Owner Court Rental Value:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
  }
//retain rv
export const getOwnerRetainRentalSum = async (req, res) => {
  const { OwnerID } = req.body;

  if (!OwnerID) {
    return res.status(400).json({ message: "OwnerID is required" });
  }

  try {
    const [sumResult] = await sequelize.query(
      `SELECT SUM(RentalValue) AS totalRetainRentalValue
       FROM retentiontaxmast
       WHERE OwnerID = :ownerId`,
      {
        replacements: { ownerId: OwnerID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 🔹 Step 2: Build final response
    const result = {
      OwnerID,
      totalRetainRentalValue: sumResult.totalRetainRentalValue
        ? Number(sumResult.totalRetainRentalValue).toFixed(2)
        : "0.00",
    };

    res.status(200).json(result); 
  } catch (error) {
    console.error("Error fetching Owner Retain Rental Value:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
  }
  //appeal
  export const getOwnerAppealRentalSum = async (req, res) => {
    const { OwnerID } = req.body;
  
    if (!OwnerID) {
      return res.status(400).json({ message: "OwnerID is required" });
    }
  
    try {
      const [sumResult] = await sequelize.query(
        `SELECT SUM(RentalValue) AS totalAppealRentalValue
         FROM appealmast
         WHERE OwnerID = :ownerId`,
        {
          replacements: { ownerId: OwnerID },
          type: sequelize.QueryTypes.SELECT,
        }
      );
  
      // 🔹 Step 2: Build final response
      const result = {
        OwnerID,
        totalAppealRentalValue: sumResult.totalAppealRentalValue
          ? Number(sumResult.totalAppealRentalValue).toFixed(2)
          : "0.00",
      };
  
      res.status(200).json(result); 
    } catch (error) {
      console.error("Error fetching Owner Appeal Rental Value:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
    }


    export const postAppealInfoAll = async (req, res) => {
      try {
        const appealInfo = req.body;
    
        if (!appealInfo.AppealReason && !appealInfo.AppealReasons)
          return res.status(402).json({ message: "Appeal Reason Required." });
    
        if (!appealInfo.OwnerID)
          return res.status(402).json({ message: "OwnerID required." });
    
        const reasons = appealInfo.AppealReasons || [appealInfo.AppealReason];
    
        const mastMap = {
          retention: appealInfo.RetaintionMast || [],
          hearing: appealInfo.HearingMast || [],
          "appeal committee": appealInfo.AppealMast || [],
          remission: appealInfo.CourtResultMast || [],
        };
    
        const tableMap = {
          retention: "retentiontaxmast",
          hearing: "hearingmast",
          "appeal committee": "appealmast",
          remission: "courtresultmast",
        };
    
        const expandYears = (yr) => {
          if (!yr) return [new Date().getFullYear()];
          if (typeof yr === "string" && yr.includes("-")) {
            const [start, end] = yr.split("-").map((y) => parseInt(y.trim()));
            const years = [];
            for (let y = start; y <= end; y++) years.push(y);
            return years;
          }
          return [parseInt(yr)];
        };
    
        const insertOrUpdateAppealMast = async (defaults) => {
          const existing = await sequelize.query(
            `SELECT * FROM appealmast
             WHERE OwnerID = :OwnerID AND WardNo = :WardNo AND PropertyNo = :PropertyNo AND Reason = :Reason`,
            { replacements: defaults }
          );
    
          defaults.UpdatedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    
          if (existing[0].length > 0) {
            await sequelize.query(
              `UPDATE appealmast SET
                 Date = :Date,
                 EmpID = :EmpID,
                 Reason = :Reason,
                 PartitionNo = :PartitionNo,
                 RentalValue = :RentalValue,
                 PropertyTax = :PropertyTax,
                 Tax1 = :Tax1,
                 Tax2 = :Tax2,
                 Tax3 = :Tax3,
                 Tax4 = :Tax4,
                 Tax5 = :Tax5,
                 TreeCess = :TreeCess,
                 EducationTax = :EducationTax,
                 EmploymentTax = :EmploymentTax,
                 SpEducationTax = :SpEducationTax,
                 Sanitation = :Sanitation,
                 DrainCess = :DrainCess,
                 SpWaterCess = :SpWaterCess,
                 RoadCess = :RoadCess,
                 FireCess = :FireCess,
                 LightCess = :LightCess,
                 WaterBenefit = :WaterBenefit,
                 MajorBuilding = :MajorBuilding,
                 SewageDisposalCess = :SewageDisposalCess,
                 WaterBill = :WaterBill,
                 AssessmentId = :AssessmentId, 
                 UpdatedBy = :UpdatedBy,
                 UpdatedDate = :UpdatedDate
               WHERE OwnerID = :OwnerID AND WardNo = :WardNo AND PropertyNo = :PropertyNo AND Reason = :Reason`,
              { replacements: defaults }
            );
          } else {
            await sequelize.query(
              `INSERT INTO appealmast
               (OwnerID, Date, EmpID, Year, Reason, WardNo, PropertyNo, PartitionNo,
                RentalValue, PropertyTax, Tax1,Tax2,Tax3,Tax4,Tax5, TreeCess, EducationTax, EmploymentTax,
                SpEducationTax, Sanitation, DrainCess, SpWaterCess, RoadCess, FireCess,
                LightCess, WaterBenefit, MajorBuilding, SewageDisposalCess, WaterBill,
                AssessmentId, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate)
               VALUES
               (:OwnerID, :Date, :EmpID, :Year, :Reason, :WardNo, :PropertyNo, :PartitionNo,
                :RentalValue, :PropertyTax, :Tax1,:Tax2,:Tax3,:Tax4,:Tax5, :TreeCess, :EducationTax, :EmploymentTax,
                :SpEducationTax, :Sanitation, :DrainCess, :SpWaterCess, :RoadCess, :FireCess,
                :LightCess, :WaterBenefit, :MajorBuilding, :SewageDisposalCess, :WaterBill,
                :AssessmentId, :CreatedBy, :CreatedDate, :UpdatedBy, :UpdatedDate)`,
              { replacements: defaults }
            );
          }
        };
    
        for (const reason of reasons) {
          const reasonKey = reason.toLowerCase();
          const dataArray = Array.isArray(mastMap[reasonKey])
            ? mastMap[reasonKey]
            : mastMap[reasonKey]
            ? [mastMap[reasonKey]]
            : [];
    
          if (!dataArray.length) dataArray.push({});
    
          for (const item of dataArray) {
            const years = expandYears(item.Year || appealInfo.Year);
            for (const yr of years) {
              const defaults = {
                OwnerID: appealInfo.OwnerID,
                Date: item.Date
                  ? new Date(item.Date).toISOString().slice(0, 10)
                  : new Date().toISOString().slice(0, 10),
                WardNo: item.WardNo ?? appealInfo.WardNo ?? null,
                PropertyNo: item.PropertyNo ?? appealInfo.PropertyNo ?? null,
                PartitionNo: item.PartitionNo ?? appealInfo.PartitionNo ?? null,
                Year: yr,
                EmpID: item.EmpID ?? appealInfo.EmpID ?? null,
                AssessmentId: 1,
                Reason: reason,
                RentalValue: item.RentalValue ?? 0,
                PropertyTax: item.PropertyTax ?? 0,
                Tax1: item.Tax1 ?? 0,
                Tax2: item.Tax2 ?? 0,
                Tax3: item.Tax3 ?? 0,
                Tax4: item.Tax4 ?? 0,
                Tax5: item.Tax5 ?? 0,
                TreeCess: item.TreeCess ?? 0,
                EducationTax: item.EducationTax ?? 0,
                EmploymentTax: item.EmploymentTax ?? 0,
                SpEducationTax: item.SpEducationTax ?? 0,
                Sanitation: item.Sanitation ?? 0,
                DrainCess: item.DrainCess ?? 0,
                SpWaterCess: item.SpWaterCess ?? 0,
                RoadCess: item.RoadCess ?? 0,
                FireCess: item.FireCess ?? 0,
                LightCess: item.LightCess ?? 0,
                WaterBenefit: item.WaterBenefit ?? 0,
                MajorBuilding: item.MajorBuilding ?? 0,
                SewageDisposalCess: item.SewageDisposalCess ?? 0,
                WaterBill: item.WaterBill ?? 0,
                CreatedBy: appealInfo.CreatedBy ?? null,
                UpdatedBy: appealInfo.UpdatedBy ?? null,
                CreatedDate: new Date(),
                UpdatedDate: null,
              };
    
              const originalTable = tableMap[reasonKey];
              if (dataArray.length && item !== {}) {
                const existing = await sequelize.query(
                  `SELECT * FROM ${originalTable}
                   WHERE OwnerID = :OwnerID AND WardNo = :WardNo AND PropertyNo = :PropertyNo AND Reason = :Reason`,
                  { replacements: defaults }
                );
    
                if (existing[0].length > 0) {
                  defaults.UpdatedDate = new Date();
                  await sequelize.query(
                    `UPDATE ${originalTable} SET
                       Date = :Date, EmpID = :EmpID, Reason = :Reason, PartitionNo = :PartitionNo,
                       RentalValue = :RentalValue, PropertyTax = :PropertyTax, Tax1 = :Tax1,
                       TreeCess = :TreeCess, EducationTax = :EducationTax, EmploymentTax = :EmploymentTax,
                       SpEducationTax = :SpEducationTax, Sanitation = :Sanitation, DrainCess = :DrainCess,
                       SpWaterCess = :SpWaterCess, RoadCess = :RoadCess, FireCess = :FireCess,
                       LightCess = :LightCess, WaterBenefit = :WaterBenefit, MajorBuilding = :MajorBuilding,
                       SewageDisposalCess = :SewageDisposalCess, WaterBill = :WaterBill,
                       UpdatedBy = :UpdatedBy, UpdatedDate = :UpdatedDate
                     WHERE OwnerID = :OwnerID AND WardNo = :WardNo AND PropertyNo = :PropertyNo AND Reason = :Reason`,
                    { replacements: defaults }
                  );
                } else {
                  await sequelize.query(
                    `INSERT INTO ${originalTable}
                     (OwnerID, Date, EmpID, Year, Reason, WardNo, PropertyNo, PartitionNo,
                      RentalValue, PropertyTax, Tax1, TreeCess, EducationTax, EmploymentTax,
                      SpEducationTax, Sanitation, DrainCess, SpWaterCess, RoadCess, FireCess,
                      LightCess, WaterBenefit, MajorBuilding, SewageDisposalCess, WaterBill,
                      CreatedBy, CreatedDate, UpdatedBy, UpdatedDate)
                     VALUES
                     (:OwnerID, :Date, :EmpID, :Year, :Reason, :WardNo, :PropertyNo, :PartitionNo,
                      :RentalValue, :PropertyTax, :Tax1, :TreeCess, :EducationTax, :EmploymentTax,
                      :SpEducationTax, :Sanitation, :DrainCess, :SpWaterCess, :RoadCess, :FireCess,
                      :LightCess, :WaterBenefit, :MajorBuilding, :SewageDisposalCess, :WaterBill,
                      :CreatedBy, :CreatedDate, :UpdatedBy, :UpdatedDate)`,
                    { replacements: defaults }
                  );
                }
              }
    
              // ✅ Update AppliedPolicyMast flags
              const flagMap = {
                retention: "Retaintion",
                hearing: "Hearing",
                "appeal committee": "Appeal",
                remission: "CourtResult",
              };
              const flagToUpdate = flagMap[reasonKey];
    
              if (flagToUpdate) {
                await AppliedPolicyMast.upsert({
                  OwnerID: appealInfo.OwnerID,
                  [flagToUpdate]: 1,
                  UpdatedBy: appealInfo.UpdatedBy ?? appealInfo.CreatedBy,
                  UpdatedDate: new Date(),
                  CreatedBy: appealInfo.CreatedBy,
                  CreatedDate: new Date(),
                });
              }
    
              await insertOrUpdateAppealMast(defaults);
            }
          }
        }
    
        res.status(200).json({ message: "All AppealReason rows processed successfully." });
      } catch (error) {
        console.error("Error storing appeal info:", error);
        res.status(500).json({ error: "An error occurred while storing appeal info." });
      }
    };