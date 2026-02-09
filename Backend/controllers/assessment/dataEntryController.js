import PropertyTypeMaster from '../../models/models/propertytypemaster.js';
import PropertyMast from '../../models/models/propertymast.js';
import JoinOwnerDetails from '../../models/models/jointownerdetails.js';
import PropertyDetailsNew from '../../models/models/propertydetailsnew.js';
import PropertySocialDetails from '../../models/models/propertysocialdetails.js';
import PropertyImageMast from '../../models/models/propertyimagesmast.js';
import propertydetailsold from '../../models/models/propertydetailsold.js';
import FloorSubmissionDetails from '../../models/models/floorsubmissiondetails.js';
import FloorSubmissionDetailsMinusData from '../../models/models/floorsubmissiondetailsminusdata.js';
import ApplyTaxesMaster from '../../models/models/applytaxesmaster.js';
import TapSizeMaster from '../../models/models/tapsixemaster.js';
import PropertyDetailsChangeHistory from '../../models/models/propertydetailschangehistory.js';
import { OldPropertyMast } from '../../models/models/oldpropertymast.js';
import { OldTaxes } from '../../models/models/oldtaxes.js';
import { TaxPendingDetails } from '../../models/models/taxpendingdetails.js';
import PropertyDetailsOld from '../../models/models/propertydetailsold.js';
import CombinedOwnerName from '../../models/models/combinedownerrenternames.js';
import { PolicyMast } from '../../models/models/policymast.js';
import TransMast from '../../models/models/transmast.js';
import AppealMast from '../../models/models/appealmast.js';
import MutationDetails from '../../models/models/mutationdetails.js';
import sequelize from '../../config/connectionDB.js';
import FloorSubmissionRoomNoDetails from '../../models/models/floorsubmissionroomnodetails.js';
import RoomShapeMaster from '../../models/models/roomshapemaster.js';
import TypeOfUseMasterNonTaxable from '../../models/models/typeofusemasternontaxable.js';
import tmp from 'tmp';
import fsExtra from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import gm from 'gm';
import { exec } from 'child_process';
import fs from 'fs';
import sharp from 'sharp';
import sizeOf from 'image-size';
import RoomTypeMaster from '../../models/models/roomTypemaster.js';
import TypeofUseMaster from '../../models/models/typeofusemaster.js';
import TypeOfUseGroupMaster from '../../models/models/typeofusegroupmaster.js';
import Retentiontaxmast from '../../models/models/retentiontaxmast.js';
import HearingMast from '../../models/models/hearingmast.js';
import AssessmentRulesMaster from '../../models/models/assessmentrulesmaster.js';
// import { GlobalUserID } from '../auth/authController.js'

import _ from 'lodash';
import TaxPendingDetailsVersionHistory from '../../models/models/taxPendingHistory.js';
import AppliedPolicyMast from '../../models/models/appliedPolicyMast.js';
import TransMastVersionHistory from '../../models/models/taxversionHistory.js';
export const getPropertyTypeMaster = async (req, res) => {
  try {
    const getproperties = await PropertyTypeMaster.findAll();
    console.log(getproperties, 'property Descriptionn');
    res.status(200).json(getproperties);
  } catch (error) {
    console.error('Error getting property types:', error);
    res.status(500).json({
      error: 'An error occurred while getting property types.',
    });
  }
};

export const getPropertyMast = async (req, res) => {
  try {
    const getpropertymast = await PropertyMast.findAll();
    res.status(200).json(getpropertymast);
  } catch (error) {
    console.error('Error getting property mast:', error);
    res.status(500).json({
      error: 'An error occurred while getting property mast.',
    });
  }
};

export const getJointOwnerList = async (req, res) => {
  try {
    const getownerlist = await JoinOwnerDetails.findAll({ limit: 5 });
    res.status(200).json(getownerlist);
  } catch (error) {
    console.error('Error getting property mast:', error);
    res.status(500).json({
      error: 'An error occurred while getting property mast.',
    });
  }
};

export const getFloorNoOfRoomList = async (req, res) => {
  try {
    const getFloorRoomslist = await FloorSubmissionRoomNoDetails.findAll();
    res.status(200).json(getFloorRoomslist);
  } catch (error) {
    console.error('Error getting Floor submission Rooms No :', error);
    res.status(500).json({
      error: 'An error occurred while getting floor rooms.',
    });
  }
};

export const getAllOwnerIDs = async (req, res) => {
  const { page = 1, limit = 1000 } = req.query;

  try {
    const offset = (page - 1) * limit;

    const owners = await PropertyMast.findAndCountAll({
      attributes: ['OwnerID'],
      order: [['OwnerID', 'ASC']], // ✅ ensures consistent ascending order
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
    });

    const totalOwnerIDs = owners.count;
    const ownerIDs = owners.rows.map((owner) => owner.OwnerID);

    // Optional: Debug logs
    console.log('📘 getAllOwnerIDs:');
    console.log(`   → page: ${page}, limit: ${limit}, offset: ${offset}`);
    console.log(`   → totalOwnerIDs: ${totalOwnerIDs}`);
    console.log(
      `   → first ID: ${ownerIDs[0]} | last ID: ${ownerIDs[ownerIDs.length - 1]
      }`
    );

    res.json({
      totalOwnerIDs,
      ownerIDs,
      totalPages: Math.ceil(totalOwnerIDs / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error('❌ Error fetching OwnerIDs:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching OwnerIDs.' });
  }
};

export const getAllTablesDataByOwnerID = async (req, res) => {
  const { OwnerID, PDNId, FSDId, FSDMDId } = req.body;

  try {
    // Fetch data from PropertyMast
    const propertyMast = await PropertyMast.findOne({
      where: { OwnerID: OwnerID },
    });

    // Fetch data from PropertyDetailsNew
    const propertyDetailsNew = await PropertyDetailsNew.findAll({
      where: { OwnerID: OwnerID },
    });

    // // Fetch data from PropertyImageMast
    const propertyImageMast = await PropertyImageMast.findOne({
      where: { ownerid: OwnerID },
    });

    // Fetch data from PropertySocialDetails
    const propertySocialDetails = await PropertySocialDetails.findOne({
      where: { OwnerID: OwnerID },
    });

    // Fetch data from JointOwnerDetails
    const jointOwnerDetails = await JoinOwnerDetails.findAll({
      where: { OwnerID: OwnerID },
    });
    console.log(JSON.stringify(jointOwnerDetails, null, 2, 'raammm'));

    const propertyDetailsOld = await propertydetailsold.findAll({
      where: { OwnerID: OwnerID },
    });

    const drainFlatRate = await ApplyTaxesMaster.findOne({
      attributes: ['DrainFlatRate', 'OwnerID'],
      where: { OwnerID: OwnerID },
    });

    const oldPropertyMast = await OldPropertyMast.findOne({
      where: { ownerid: OwnerID },
    });

    const oldTaxes = await OldTaxes.findOne({
      where: { OwnerID: OwnerID },
    });

    // 🔥 Floor submission fetch — OwnerID + optional PDNId
    let floorSubmissionDetails;
    if (PDNId && FSDId) {
      floorSubmissionDetails = await FloorSubmissionDetails.findAll({
        where: { OwnerID, PDNId, FSDId },
      });
    } else {
      floorSubmissionDetails = await FloorSubmissionDetails.findAll({
        where: { OwnerID },
      });
    }
    // 🔥 Floor submission fetch — OwnerID + optional FSDMDId
    let floorSubmissionDetailsMinusData;
    if (FSDId && FSDMDId) {
      floorSubmissionDetailsMinusData =
        await FloorSubmissionDetailsMinusData.findAll({
          where: { OwnerID, FSDMDId, FSDId },
        });
    } else {
      floorSubmissionDetailsMinusData =
        await FloorSubmissionDetailsMinusData.findAll({
          where: { OwnerID },
        });
    }
    // const floorSubmissionDetailsMinusData =
    //   await FloorSubmissionDetailsMinusData.findAll({
    //     where: { OwnerID: OwnerID },
    //   });

    const pendingTaxes = await TaxPendingDetails.findAll({
      where: { OwnerID: OwnerID },
    });
    const images = {};

    if (!propertyImageMast) {
      // return res.status(404).json({ message: 'Owner not found' });
      console.warn('⚠️ No propertyImageMast found for OwnerID:', OwnerID);
    }

    // List of image fields to check
    else {
      const imageFields = [
        'PropertyPathA',
        'PropertyPathB',
        'PropertyPathC',
        'PropertyPathD',
        'PlanPath',
      ];
      //const BASE_IMAGE_PATH = 'C:\\NTIS_New_Images';

       const BASE_IMAGE_PATH = '//192.168.5.244/e$/NTIS_New_Images';
      for (const field of imageFields) {
        const relativePath = propertyImageMast[field];

        if (relativePath) {
          const fullPath = path.join(BASE_IMAGE_PATH, relativePath);

          if (fs.existsSync(fullPath)) {
            const imageBuffer = fs.readFileSync(fullPath);
            const base64Image = imageBuffer.toString('base64');

            // Map field to base64
            images[field] = `data:image/jpeg;base64,${base64Image}`;
          } else {
            console.warn(` File not found for field: ${field}`);
            images[field] = null;
          }
        } else {
          images[field] = null;
        }
      }
    }

    // Combine all results into a single object
    const combinedData = {
      propertyMast: propertyMast?.dataValues || {},
      drainFlatRate,
      propertyDetailsNew: propertyDetailsNew.map((p) => p.dataValues),
      propertyImageMast: images,
      propertySocialDetails: propertySocialDetails?.dataValues || {},
      jointOwnerDetails: jointOwnerDetails.map((j) => j.dataValues),
      propertyDetailsOld: propertyDetailsOld.map((p) => p.dataValues),
      oldPropertyMast: oldPropertyMast?.dataValues || {},
      oldTaxes: oldTaxes?.dataValues || {},
      floorSubmissionDetails: floorSubmissionDetails.map((f) => f.dataValues),
      floorSubmissionDetailsMinusData: floorSubmissionDetailsMinusData.map(
        (f) => f.dataValues
      ),
      pendingTaxes: pendingTaxes.map((t) => t.dataValues),
    };
    console.log(combinedData.images, 'ccccddd');
    console.log(combinedData, 'combinedData');
    // Return combined data
    return res.status(200).json({ PropertyInfo: combinedData });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export async function logChanges(
  model,
  ownerID,
  oldData,
  newData,
  screenName,
  userID
) {
  if (!model || !newData) {
    console.warn('⚠️ logChanges: Missing model, oldData, or newData');
    return;
  }

  // Auto-detect screen/model name
  const modelName = model?.name || 'UnknownModel';
  const screen = screenName || model?.tableName || modelName;

  console.log(`🧾 Logging changes for model: ${screen}, OwnerID: ${ownerID}`);

  const excludedFields = [
    'CreatedDate',
    'UpdatedDate',
    'createdAt',
    'updatedAt',
    'LastModified',
  ];

  const cleanedOld = JSON.parse(JSON.stringify(oldData));
  const cleanedNew = JSON.parse(JSON.stringify(newData));

  let totalChanges = 0;

  for (const key of Object.keys(cleanedNew)) {
    if (excludedFields.includes(key)) continue;

    let oldVal = cleanedOld[key];
    let newVal = cleanedNew[key];

    // 🧹 Unwrap {"Field":"value"} → "value"
    if (oldVal && typeof oldVal === 'object' && !Array.isArray(oldVal)) {
      const keys = Object.keys(oldVal);
      if (keys.length === 1) oldVal = oldVal[keys[0]];
    }

    if (newVal && typeof newVal === 'object' && !Array.isArray(newVal)) {
      const keys = Object.keys(newVal);
      if (keys.length === 1) newVal = newVal[keys[0]];
    }

    // 🧠 Convert numeric booleans to true/false
    if (typeof oldVal === 'number' && (oldVal === 0 || oldVal === 1))
      oldVal = Boolean(oldVal);
    if (typeof newVal === 'number' && (newVal === 0 || newVal === 1))
      newVal = Boolean(newVal);

    // Skip if identical
    if (_.isEqual(oldVal, newVal)) continue;

    totalChanges++;

    const beforeVal = oldVal ?? null;
    const afterVal = newVal ?? null;

    const controlName = `${key}Existing`;

    const existingHistory = await PropertyDetailsChangeHistory.findOne({
      where: {
        OwnerID: ownerID,
        ScreenName: screen,
        ChangeOn: key,
        ChangeOnControl: controlName,
      },
    });

    if (existingHistory) {
      // Update history entry
      await PropertyDetailsChangeHistory.update(
        {
          ChangeDate: new Date(),
          BeforeChange: String(beforeVal),
          AfterChange: String(afterVal),
          EntryType: 'Update',
          UserID: userID,
        },
        { where: { HistoryID: existingHistory.HistoryID } }
      );
      console.log(
        `🔁 Updated history for ${screen}.${key} (OwnerID: ${ownerID})`
      );
    } else {
      // Insert new history entry
      await PropertyDetailsChangeHistory.create({
        OwnerID: ownerID,
        ChangeDate: new Date(),
        UserID: userID,
        ChangeOn: key,
        BeforeChange: String(beforeVal),
        AfterChange: String(afterVal),
        ScreenName: screen,
        ChangeOnControl: controlName,
        EntryType: 'Create',
      });
      console.log(
        `🆕 Created new history for ${screen}.${key} (OwnerID: ${ownerID})`
      );
    }
  }

  if (totalChanges === 0) {
    console.log(
      `✅ No real changes detected for ${screen} (OwnerID: ${ownerID})`
    );
  } else {
    console.log(
      `✅ Logged ${totalChanges} change(s) for ${screen} (OwnerID: ${ownerID})`
    );
  }
}
// ===============================
// FULL ROW SNAPSHOT HELPER
// ===============================

// export const createDataEntrySendToApproval = async (req, res) => {
//   try {
//     const { OwnerID, user,WardghatDocument,WardNo,UpdVersionID}=req.body;
   
//     console.log(req.body,"approval body");


//     if (!OwnerID) {
//       return res.status(400).json({
//         success: false,
//         message: 'OwnerID is required'
//       });
//     }

//      /* ---------------- Financial Year ---------------- */
//     const getFinancialYear = () => {
//       const now = new Date();
//       const year = now.getFullYear();
//       const month = now.getMonth() + 1;

//       return month >= 4
//         ? `${year}-${String(year + 1).slice(-2)}`
//         : `${year - 1}-${String(year).slice(-2)}`;
//     };

//     const financialYear = getFinancialYear();

//     /* ---------------- Get last WG number ---------------- */
//     const lastRecord = await ChangeVersionMaster.findOne({
//       where: {
//         WadhghatNo: {
//           [Op.like]: `%/${financialYear}/WG%`
//         }
//       },
//   order: [['UpdatedDate', 'DESC']] 
//     });


//     let nextWGNo = 1;

//     if (lastRecord?.WadhghatNo) {
//       const match = lastRecord.WadhghatNo.match(/WG(\d+)$/);
//       if (match) {
//         nextWGNo = parseInt(match[1], 10) + 1;
//       }
//     }

//     /* ---------------- Generate Ferfar No ---------------- */
//     const wadhghatDisplayNo = `W${WardNo}/${financialYear}/WG${nextWGNo}`;

//     /* ---------------- Create Payload ---------------- */
//     const payload = {
//       UpdVersionID: UpdVersionID,     
//        OwnerID,
//       ApplicationPageSource: 'OPDataEntry',
//       WardghatDocument:WardghatDocument,
//       UpdatedBy: user?.UserID,
//       UpdatedName: user?.name,
//       UpdatedDate: new Date(),
//       UpdatedInitStatus: 'Pending',

//       ApprovalBy: null,
//       ApprovalDate: null,
//       ApprovalStatus: 'PENDING',
//       ApprovalRemark: 'Sent to approval',

//       WadhghatNo: 0,

//       WadhghatNo: wadhghatDisplayNo,
//       RecentApproved: false,

//       // optional audit fields
//       PublicIP: req.ip || null,
//       LocalIP: null,
//       LocalMac: null,
//       ApprovedPublicIP: null
//     };

//     const result = await ChangeVersionMaster.create(payload);

//     return res.status(201).json({
//       success: true,
//       message: 'Sent to approval successfully',
//       wadhghatDisplayNo,
//       data: result
//     });

//   } catch (error) {
//     console.error('Create Send To Approval Error:', error);

//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };
export const createDataEntrySendToApproval = async (req, res) => {
  try {
    const { OwnerID, user, WardghatDocument, WardNo, UpdVersionID } = req.body;
    
    console.log(req.body, "approval body");

    if (!OwnerID) {
      return res.status(400).json({ success: false, message: 'OwnerID is required' });
    }

    // 2. Validate karein ki Version ID aaya hai ya nahi
    if (!UpdVersionID) {
        return res.status(400).json({ 
          success: false, 
          message: 'Transaction Version ID (UpdVersionID) is required for approval' 
        });
    }

    /* ---------------- Financial Year Logic ---------------- */
    const getFinancialYear = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      return month >= 4
        ? `${year}-${String(year + 1).slice(-2)}`
        : `${year - 1}-${String(year).slice(-2)}`;
    };

    const financialYear = getFinancialYear();

    /* ---------------- Get last WG number ---------------- */
    const lastRecord = await ChangeVersionMaster.findOne({
      where: {
        WadhghatNo: { [Op.like]: `%/${financialYear}/WG%` }
      },
      order: [['UpdatedDate', 'DESC']] 
    });

    let nextWGNo = 1;
    if (lastRecord?.WadhghatNo) {
      const match = lastRecord.WadhghatNo.match(/WG(\d+)$/);
      if (match) {
        nextWGNo = parseInt(match[1], 10) + 1;
      }
    }

    const wadhghatDisplayNo = `W${WardNo}/${financialYear}/WG${nextWGNo}`;

    /* ---------------- Create Payload ---------------- */
    const payload = {
      UpdVersionID: UpdVersionID, 
      OwnerID,
      ApplicationPageSource: 'OPDataEntry',
      WardghatDocument: WardghatDocument,
      UpdatedBy: user?.UserID,
      UpdatedName: user?.name,
      UpdatedDate: new Date(),
      UpdatedInitStatus: 'Pending',
      ApprovalBy: null,
      ApprovalDate: null,
      ApprovalStatus: 'PENDING',
      ApprovalRemark: 'Sent to approval',
      WadhghatNo: wadhghatDisplayNo, 
      RecentApproved: false,
      PublicIP: req.ip || null,
      LocalIP: null,
      LocalMac: null,
      ApprovedPublicIP: null
    };

    const result = await ChangeVersionMaster.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Sent to approval successfully',
      wadhghatDisplayNo,
      data: result
    });

  } catch (error) {
    console.error('Create Send To Approval Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message // Ab ye "UpdVersionID is not defined" nahi bolega
    });
  }
};
//join version history version
async function saveFullRowSnapshot({
  historyId,
  ownerId,
  snapshotType,   // 'BEFORE' | 'AFTER'
  data,
  screenName,    // 'PropertyMast' | 'JOD'
  userId,
  versionId
}) {
  try {
    if (!data) {
      console.warn('⚠️ No data provided for snapshot', {
        historyId,
        ownerId,
        snapshotType,
        screenName
      });
      return;
    }

    const payload = {
      HistoryID: historyId || null,
      OwnerID: ownerId || null,
      SnapshotType: snapshotType || null,

      // ---- Common Owner Fields ----
      OwnerTitle: data.OwnerTitle || null,
      OwnerName: data.OwnerName || null,
      Address: data.Address || null,
      OwnerTitleMarathi: data.OwnerTitleMarathi || null,
      OwnerNameMarathi: data.OwnerNameMarathi || null,
      OwnerPatta: data.OwnerPatta || null,
      isPrime: data.isPrime ?? null,
      // ---- Shop / Building ----
      ShopNo: data.ShopNo || null,
      DuakanNo: data.DuakanNo || null,
      BuildingOrShopName: data.BuildingOrShopName || null,
      BuildingOrShopNameMarathi: data.BuildingOrShopNameMarathi || null,
      BuildingOrFlatNo: data.BuildingOrFlatNo || null,
      BuildingOrFlatNoMarathi: data.BuildingOrFlatNoMarathi || null,

      // ---- Occupier ----
      OccupierName: data.OccupierName || null,
      OccupierNameMarathi: data.OccupierNameMarathi || null,

      // ---- JOD (Optional) ----
      JODId: data.JODId || data.id || null,
      IsPrime: data.isPrime ?? null,

      // ---- Meta ----
      ScreenName: screenName || null,
      ChangedBy: userId || null,
      ChangeDate: new Date(),
      UpdVersionID: versionId,
            EntryType: snapshotType === 'BEFORE' ? 'Update' : 'Insert'
    };

    await PropertyFullRowHistory.create(payload);

    console.log(
      `🧾 FULL ROW SNAPSHOT SAVED | ${snapshotType} | ${screenName} | OwnerID ${ownerId}`
    );
  } catch (err) {
    console.error('❌ Snapshot save failed:', err.message || err);
  }
}
//property mast history verion

// export async function savePropertyMastSnapshot({
//   historyId,
//   snapshotType,
//   data,
//   userId
// }) {
//   if (!data) return;

//   await PropertyMastHistory.create({
//     HistoryID: historyId,
//     OwnerID: data.OwnerID,
//     SnapshotType: snapshotType,

//     ScreenName: "PropertyMast",
//     EntryType: snapshotType === "BEFORE" ? "Update" : "Insert",
//     ChangedBy: userId,
//     ChangeDate: new Date(),

//     // COPY FIELDS
//     NewZoneNo: data.NewZoneNo,
//     NewWardNo: data.NewWardNo,
//     NewPropertyNo: data.NewPropertyNo,
//     NewPartitionNo: data.NewPartitionNo,
//     NewCityServeyNo: data.NewCityServeyNo,
//     NewPlotNo: data.NewPlotNo,
//     OpenPlot: data.OpenPlot,
//     PlotArea: data.PlotArea,
//     PropertyTypeID: data.PropertyTypeID,

//     OwnerTitle: data.OwnerTitle,
//     OwnerName: data.OwnerName,
//     OwnerTitleMarathi: data.OwnerTitleMarathi,
//     OwnerNameMarathi: data.OwnerNameMarathi,
//     OwnerPatta: data.OwnerPatta,

//     Address: data.Address,
//     BuildingOrShopName: data.BuildingOrShopName,
//     BuildingOrShopNameMarathi: data.BuildingOrShopNameMarathi,
//     BuildingOrFlatNo: data.BuildingOrFlatNo,
//     BuildingOrFlatNoMarathi: data.BuildingOrFlatNoMarathi,

//     MobileNo: data.MobileNo,
//     EmailID: data.EmailID,
//     Category: data.Category,
//     Type: data.Type,
//     Status: data.Status,
//     VersionNo: data.VersionNo,

//     ShopNo: data.ShopNo,
//     DuakanNo: data.DuakanNo,

//     PropertyRemark: data.PropertyRemark,
//     LoanRemark: data.LoanRemark,
//     FileNo: data.FileNo,
//   });
// }
export async function savePropertyMastSnapshot({
  historyId,
  snapshotType,
  data,
  userId,
  versionId
}) {
  if (!data) return;

  const safe = (val) =>
    val === undefined || val === "" ? null : val;

  await PropertyMastHistory.create({
    HistoryID: historyId,
    OwnerID: data.OwnerID,
    SnapshotType: snapshotType,

    ScreenName: "PropertyMast",
    EntryType: snapshotType === "BEFORE" ? "Update" : "Insert",
    ChangedBy: userId,
    ChangeDate: new Date(),

    // ==== BASIC FIELDS ====
    NewZoneNo: safe(data.NewZoneNo),
    NewWardNo: safe(data.NewWardNo),
    NewPropertyNo: safe(data.NewPropertyNo),
    NewPartitionNo: safe(data.NewPartitionNo),
    NewCityServeyNo: safe(data.NewCityServeyNo),
    NewPlotNo: safe(data.NewPlotNo),
    OpenPlot: safe(data.OpenPlot),
    PlotArea: safe(data.PlotArea),
    PlotAreaSqMtr :safe(data.PlotAreaSqMtr),
    PropertyTypeID: safe(data.PropertyTypeID),

    OwnerTitle: safe(data.OwnerTitle),
    OwnerName: safe(data.OwnerName),
    OwnerTitleMarathi: safe(data.OwnerTitleMarathi),
    OwnerNameMarathi: safe(data.OwnerNameMarathi),
    OwnerPatta: safe(data.OwnerPatta),

    Address: safe(data.Address),
    BuildingOrShopName: safe(data.BuildingOrShopName),
    BuildingOrShopNameMarathi: safe(data.BuildingOrShopNameMarathi),
    BuildingOrFlatNo: safe(data.BuildingOrFlatNo),
    BuildingOrFlatNoMarathi: safe(data.BuildingOrFlatNoMarathi),

    MobileNo: safe(data.MobileNo),
    EmailID: safe(data.EmailID),
    Category: safe(data.Category),
    Type: safe(data.Type),
    Status: safe(data.Status),
    VersionNo: safe(data.VersionNo),

    ShopNo: safe(data.ShopNo),
    DuakanNo: safe(data.DuakanNo),

    PropertyRemark: safe(data.PropertyRemark),
    LoanRemark: safe(data.LoanRemark),
    FileNo: safe(data.FileNo),

    // ==== EXTRA FIELDS ====
    OpenPlotRenterName: safe(data.OpenPlotRenterName),
    OpenPlotOccupierName: safe(data.OpenPlotOccupierName),
    OpenPlotOccupierMarathiName: safe(data.OpenPlotOccupierMarathiName),

    PlotTaxableAreaSqFt: safe(data.PlotTaxableAreaSqFt),
    PlotAreaSqMtr: safe(data.PlotAreaSqMtr),

    OpenPlotLength: safe(data.OpenPlotLength),
    OpenPlotWidth: safe(data.OpenPlotWidth),
    OpenPlotType: safe(data.OpenPlotType),

    Latitude: safe(data.Latitude),
    Longitude: safe(data.Longitude),

    ElectionCardNo: safe(data.ElectionCardNo),
    PanCardNo: safe(data.PanCardNo),
    AdharCardNo: safe(data.AdharCardNo),
    PinCode: safe(data.PinCode),

    SocietyNameMarathi: safe(data.SocietyNameMarathi),
    SocietyNameEnglish: safe(data.SocietyNameEnglish),

    ManagerNameMarathi: safe(data.ManagerNameMarathi),
    ManagerNameEnglish: safe(data.ManagerNameEnglish),
    ManagerMobileNo: safe(data.ManagerMobileNo),

    Wing: safe(data.Wing),
    BuildingPermissions: safe(data.BuildingPermissions),
    BuildingAdvertiseType: safe(data.BuildingAdvertiseType),

    LicenceNo: safe(data.LicenceNo),
    LicenceDate: safe(data.LicenceDate),
    YearOfPermission: safe(data.YearOfPermission),
    BuildCompletionDate: safe(data.BuildCompletionDate),

    AssessmentNo: safe(data.AssessmentNo),
    CouncilID: safe(data.CouncilID),
    NoOfPeople: safe(data.NoOfPeople),

    HearingObjNo: safe(data.HearingObjNo),
    AppealCommObjNo: safe(data.AppealCommObjNo),

    OccupierName: safe(data.OccupierName),
    OccupierNameMarathi: safe(data.OccupierNameMarathi),

    BuildingOrSocietyName: safe(data.BuildingOrSocietyName),
    BuildingOrSocietyNameMarathi: safe(data.BuildingOrSocietyNameMarathi),

    WadhGhatRemarkOne: safe(data.WadhGhatRemarkOne),
    WadhGhatRemarkTwo: safe(data.WadhGhatRemarkTwo),
    WadhGhatRemarkThree: safe(data.WadhGhatRemarkThree),
    CombPropRemark: safe(data.CombPropRemark),
    FlatSystemRemark: safe(data.FlatSystemRemark),
    SocietyNameMarathi: safe(data.SocietyNameMarathi),
    SocietyNameEnglish: safe(data.SocietyNameEnglish),
  

    UpdVersionID: versionId,




  });
}

//combined history version 
export async function saveCombinedOwnerSnapshot({
  historyId,
  snapshotType,
  data,
  userId
}) {
  if (!data) return;

  await CombinedOwnerNameHistory.create({
    HistoryID: historyId,
    OwnerID: data.OwnerID,
    SnapshotType: snapshotType,

    ScreenName: 'CombinedOwnerName',
    EntryType: snapshotType === 'BEFORE' ? 'Update' : 'Insert',
    ChangedBy: userId,
    ChangeDate: new Date(),

    OwnerName: data.OwnerName,
    MarathiOwnerName: data.MarathiOwnerName,
    RenterName: data.RenterName,
    MarathiRenterName: data.MarathiRenterName,
    OccupierName: data.OccupierName,
    MarathiOccupierName: data.MarathiOccupierName
  });
}
//propertyDeatilsNew history Version
export const savePropertyDetailsNewSnapshot = async ({
  historyId,
  snapshotType,
  data,
  userId,
  versionId
}) => {
  if (!data) return;

  const normalize = val => (val === null || val === undefined || val === '' ? null : Number(val));

  try {
    await PropertyDetailsNewHistory.create({
      PDNId: data.PDNId || null,
      OwnerID: data.OwnerID || null,
      FloorID: data.FloorID || null,
      ConstructionYear: data.ConstructionYear || null,
      ConstructionType: data.ConstructionType || null,
      GroupId: data.GroupId || null,
      TypeOFUse: data.TypeOFUse || null,
      CarpetAreaSqFeet: normalize(data.CarpetAreaSqFeet),
      CarpetAreaSqMeter: normalize(data.CarpetAreaSqMeter),
      BuildUpAreaSqFeet: normalize(data.BuildUpAreaSqFeet),
      BuildUpAreaSqMeter: normalize(data.BuildUpAreaSqMeter),
      NoOfRooms: normalize(data.NoOfRooms),
      Room: normalize(data.Room),
      Registration: normalize(data.Registration),
      RenterYesNO: normalize(data.RenterYesNO),
      RenterName: data.RenterName || null,
      RenterNameMarathi: data.RenterNameMarathi || null,
      Rent: normalize(data.Rent),
      NonCalculateRent: normalize(data.NonCalculateRent),
      OccupierYesNo: normalize(data.OccupierYesNo),
      OccupierName: data.OccupierName || null,
      OccupierNameMarathi: data.OccupierNameMarathi || null,
      Wing: data.Wing || null,
      IsAgreement: normalize(data.IsAgreement),
      AgreementDate: data.AgreementDate || null,
      AgreementToDate: data.AgreementToDate || null,
      CreatedBy: data.CreatedBy || null,
      CreatedDate: data.CreatedDate || null,
      UpdatedBy: data.UpdatedBy || null,
      UpdatedDate: data.UpdatedDate || null,
      SnapshotType: snapshotType, // 'BEFORE' or 'AFTER'
      UserID: userId,
      SnapshotCreatedAt: new Date(),
      UpdVersionID: versionId,
    });

    console.log(`✅ Saved ${snapshotType} snapshot for PDNId=${data.PDNId}, OwnerID=${data.OwnerID}`);
  } catch (err) {
    console.error('❌ Error saving PropertyDetailsNew snapshot:', err);
    throw err;
  }
};
//tax pending detils version
// dataEntryApprovalController.js

export const saveTaxPendingDetailsSnapshot = async ({ originalId, snapshotType, data, userId, entryType = null, versionId }) => {
  if (!data) return;

  const normalize = val => (val === null || val === undefined || val === '' ? null : Number(val));

  try {
    await TaxPendingDetailsVersionHistory.create({
      OriginalID: originalId || data.TPDID || null,
      OwnerID: data.OwnerID || null,
      PendingYear: data.PendingYear || null,
      PropertyTax: normalize(data.PropertyTax),
      EducationTax: normalize(data.EducationTax),
      TreeCess: normalize(data.TreeCess),
      Tax1: normalize(data.Tax1),
      Tax2: normalize(data.Tax2),
      Tax3: normalize(data.Tax3),
      Tax4: normalize(data.Tax4),
      Tax5: normalize(data.Tax5),
      EmploymentTax: normalize(data.EmploymentTax),
      FireCess: normalize(data.FireCess),
      SpEducationTax: normalize(data.SpEducationTax),
      MajorBuilding: normalize(data.MajorBuilding),
      LightCess: normalize(data.LightCess),
      RoadCess: normalize(data.RoadCess),
      DrainCess: normalize(data.DrainCess),
      SewageDisposalCess: normalize(data.SewageDisposalCess),
      Sanitation: normalize(data.Sanitation),
      SpWaterCess: normalize(data.SpWaterCess),
      WaterBenefit: normalize(data.WaterBenefit),
      WaterBill: normalize(data.WaterBill),
      TaxTotal: normalize(data.TaxTotal),
      Interest: normalize(data.Interest),
      NetTotal: normalize(data.NetTotal),
      Remark: data.Remark || null,
      UpdatedBy: userId || data.UpdatedBy || null,
      CreatedBy: data.CreatedBy || null,
      CreatedDate: data.CreatedDate || null,
      UpdatedDate: new Date(),
      ScreenName: 'TaxPendingDetails',
      ChangeOnControl: 'Upsert',
      EntryType: entryType || 'Update',
      UpdVersionID: versionId, // 🔥 Controller se aayi hui Unique ID
      AfterBefore: snapshotType, // 'BEFORE' or 'AFTER'
    });

    console.log(`✅ Saved ${snapshotType} snapshot for VersionID=${versionId}`);
  } catch (err) {
    console.error('❌ Error saving TaxPendingDetails snapshot:', err);
    throw err;
  }
};
//socail detisl version history
export const savePropertySocialSnapshot = async ({
  data,
  snapshotType,
  userId,versionId

}) => {
  if (!data) return;

  try {
    await PropertySocialDetailsHistory.create({
      ...data,                 // 👈 All fields auto-map
      SnapshotType: snapshotType,
      UserID: userId || null,
      SnapshotCreatedAt: new Date(),
      UpdVersionID: versionId,
    });

    console.log(
      `✅ Saved ${snapshotType} snapshot for OwnerID=${data.OwnerID}`
    );
  } catch (err) {
    console.error('❌ Error saving PropertySocial snapshot:', err);
    throw err;
  }
};
//old property Details
export const saveOldPropertyMastSnapshot = async ({
  data,
  snapshotType,
  userId,
  screenName,
  changeOnControl,
  entryType,
  versionId
}) => {
  if (!data) return;

  try {
    await OldPropertyMastHistory.create({
      OwnerID: data.OwnerID,

      SnapshotType: snapshotType,

      OldZoneNo: data.OldZoneNo,
      OldWardNo: data.OldWardNo,
      OldPropertyNo: data.OldPropertyNo,
      OldPartitionNo: data.OldPartitionNo,
      OldComputerNo: data.OldComputerNo,
      OldDescription: data.OldDescription,
      OldCityServeyNo: data.OldCityServeyNo,
      OldPlotNo: data.OldPlotNo,
      OldRV: data.OldRV,
      OldPropertyTax: data.OldPropertyTax,
      OldTotalTax: data.OldTotalTax,
      OldPlotArea: data.OldPlotArea,
      OldPropertyUse: data.OldPropertyUse,
      OldToiletNo: data.OldToiletNo,
      OldRentalValue: data.OldRentalValue,
      OldTotalRooms: data.OldTotalRooms,
      OldALV: data.OldALV,
      ConstAreaSqFt: data.ConstAreaSqFt,

      CreatedBy: data.CreatedBy || null,
      CreatedDate: data.CreatedDate || null,
      UpdatedBy: data.UpdatedBy || null,
      UpdatedDate: data.UpdatedDate || null,

      ScreenName: screenName || 'OldPropertyMast',
      ChangeOnControl: changeOnControl || 'Upsert',
      EntryType: entryType || 'Update',
      UpdVersionID: versionId,
      SnapshotBy: userId,
      SnapshotCreatedAt: new Date()
    });

    console.log(`✅ OldPropertyMast ${snapshotType} snapshot saved`);
  } catch (err) {
    console.error('❌ Snapshot error:', err);
    throw err;
  }
};
//old tax version history


export const saveOldTaxesSnapshot = async ({
  data,
  snapshotType, 
  userId,
  screenName = 'OldTaxes',
  changeOnControl = 'Upsert',
  entryType = 'Update',
  versionId 
}) => {
  if (!data) return null;

  try {
    // 👇 Same version id for BEFORE + AFTER

    await OldTaxesHistory.create({
      OwnerID: data.OwnerID || null,
      OriginalID: data.ID || null,

      PropertyTax: data.PropertyTax || null,
      EducationTax: data.EducationTax || null,
      EmploymentTax: data.EmploymentTax || null,
      TreeCess: data.TreeCess || null,
      FireCess: data.FireCess || null,
      SpEducationTax: data.SpEducationTax || null,
      MajorBuilding: data.MajorBuilding || null,
      LightCess: data.LightCess || null,
      RoadCess: data.RoadCess || null,
      DrainCess: data.DrainCess || null,
      SewageDisposalCess: data.SewageDisposalCess || null,
      Sanitation: data.Sanitation || null,
      SpWaterCess: data.SpWaterCess || null,
      WaterBenefit: data.WaterBenefit || null,
      WaterBill: data.WaterBill || null,
      Interest: data.Interest || null,
      TaxTotal: data.TaxTotal || null,

      OldTaxYear: data.OldTaxYear || null,

      Tax1: data.Tax1 || null,
      Tax2: data.Tax2 || null,
      Tax3: data.Tax3 || null,
      Tax4: data.Tax4 || null,
      Tax5: data.Tax5 || null,

      CreatedBy: data.CreatedBy || null,
      CreatedDate: data.CreatedDate || null,
      UpdatedBy: data.UpdatedBy || null,
      UpdatedDate: data.UpdatedDate || null,

      ScreenName: screenName,
      ChangeOnControl: changeOnControl,
      EntryType: entryType,

      UpdVersionID: versionId,    
       SnapshotType: snapshotType,
      SnapshotBy: userId,
      SnapshotCreatedAt: new Date()
    });

    console.log(`✅ OldTaxes ${snapshotType} snapshot saved for OwnerID=${data.OwnerID}`);
    return versionId; // 👈 IMPORTANT
  } catch (err) {
    console.error('❌ Error saving OldTaxes snapshot:', err);
    throw err;
  }
};
//propertyDeatilsOld Version History
export const savePropertyDetailsOldSnapshot = async ({
  data,
  snapshotType, // 'BEFORE' | 'AFTER'
  userId,
  screenName = 'propertyDetailsOld',
  changeOnControl = 'Upsert',
  entryType = 'Update',
  versionId
}) => {
  if (!data) return null;

  try {

    await PropertyDetailsOldHistory.create({
      PDOId: data.PDOId || null,
      OwnerID: data.OwnerID || null,

      OldFloorID: data.OldFloorID || null,
      OldConstructionYear: data.OldConstructionYear || null,
      OldConstructionType: data.OldConstructionType || null,
      OldTypeOFUse: data.OldTypeOFUse || null,
      OldCarpetAreaSqfeet: data.OldCarpetAreaSqfeet || null,
      OldCarpetAreaSqMeter: data.OldCarpetAreaSqMeter || null,

      CreatedBy: data.CreatedBy || null,
      CreatedDate: data.CreatedDate || null,
      UpdatedBy: data.UpdatedBy || null,
      UpdatedDate: data.UpdatedDate || null,

      ScreenName: screenName,
      ChangeOnControl: changeOnControl,
      EntryType: entryType,

      UpdVersionID: versionId,
      SnapshotType: snapshotType,
      SnapshotBy: userId,
      SnapshotCreatedAt: new Date()
    });

    console.log(
      `✅ PropertyDetailsOld ${snapshotType} snapshot saved for PDOId=${data.PDOId}`
    );

    return versionId;
  } catch (err) {
    console.error('❌ Error saving PropertyDetailsOld snapshot:', err);
    throw err;
  }
};
//current tax version history
// export const saveTransMastSnapshot = async ({
//   originalOwnerId,
//   snapshotType, // 'BEFORE' or 'AFTER'
//   data,
//   userId,
//   entryType = null
// }) => {
//   if (!data) return;

//   const normalize = val => (val === null || val === undefined || val === '' ? null : Number(val));

//   try {
//     await TransMastVersionHistory.create({
//       OriginalOwnerID: originalOwnerId || data.OwnerID || null,
//       OwnerID: data.OwnerID || null,
//       FinanceYear: data.FinanceYear || null,
//       RateableValue: normalize(data.RateableValue),
//       PropertyTax: normalize(data.PropertyTax),
//       Tax1: normalize(data.Tax1),
//       Tax2: normalize(data.Tax2),
//       Tax3: normalize(data.Tax3),
//       Tax4: normalize(data.Tax4),
//       Tax5: normalize(data.Tax5),
//       EducationTax: normalize(data.EducationTax),
//       EmploymentTax: normalize(data.EmploymentTax),
//       TreeCess: normalize(data.TreeCess),
//       FireCess: normalize(data.FireCess),
//       SpEducationTax: normalize(data.SpEducationTax),
//       MajorBuilding: normalize(data.MajorBuilding),
//       LightCess: normalize(data.LightCess),
//       RoadCess: normalize(data.RoadCess),
//       DrainCess: normalize(data.DrainCess),
//       SewageDisposalCess: normalize(data.SewageDisposalCess),
//       Sanitation: normalize(data.Sanitation),
//       SpWaterCess: normalize(data.SpWaterCess),
//       WaterBenefit: normalize(data.WaterBenefit),
//       WaterBill: normalize(data.WaterBill),
//       TaxTotal: normalize(data.TaxTotal),
//       Interest: normalize(data.Interest),
//       Remark: data.Remark || null,

//       // Optional R/C fields
//       RRateableValue: normalize(data.RRateableValue),
//       CRateableValue: normalize(data.CRateableValue),
//       RMaintenance: normalize(data.RMaintenance),
//       CMaintenance: normalize(data.CMaintenance),
//       RLettingValue: normalize(data.RLettingValue),
//       CLettingValue: normalize(data.CLettingValue),
//       REducationTax: normalize(data.REducationTax),
//       CEducationTax: normalize(data.CEducationTax),
//       REmploymentTax: normalize(data.REmploymentTax),
//       CEmploymentTax: normalize(data.CEmploymentTax),
//       AnnualRent: normalize(data.AnnualRent),
//       Maintenance: normalize(data.Maintenance),
//       LettingValue: normalize(data.LettingValue),
//       YearlyRentedAreaRent: normalize(data.YearlyRentedAreaRent),
//       YearlyNonRentedAreaRent: normalize(data.YearlyNonRentedAreaRent),

//       UpdatedBy: data.UpdatedBy || userId || null,
//       CreatedBy: data.CreatedBy || userId || null,
//       CreatedDate: data.CreatedDate || new Date(),
//       UpdatedDate: data.UpdatedDate || new Date(),
//       ScreenName: 'TransMast',
//       ChangeOnControl: 'Upsert',
//       EntryType: entryType || 'Update',
//       UpdVersionID: uuidv4(),
//       AfterBefore: snapshotType // 'BEFORE' or 'AFTER'
//     });

//     console.log(`✅ Saved ${snapshotType} snapshot for OwnerID=${data.OwnerID}`);
//   } catch (err) {
//     console.error('❌ Error saving TransMast snapshot:', err);
//     throw err;
//   }
// };
//amc login
export const savePropertyAmcInfo = async (req, res) => {
  console.log('req is coming');
  const transactionVersionID = uuidv4();
  const { PropertyInfo } = req.body;
  const userId = PropertyInfo.user?.UserID || 0;

  console.log(userId, 'id');
  const { DeletePropertyDetailsNew } = PropertyInfo;
  const { DeleteJointOwnerDetails } = PropertyInfo;

  const { DeleteFloorSubmissionDetails } = PropertyInfo;
  const { DeleteFloorSubmissionMinusDetails } = PropertyInfo;

  console.log(DeleteFloorSubmissionDetails, 'DeleteFloorSubmissionDetails');

  console.log(DeletePropertyDetailsNew, 'property info deleted pdnids');

  console.log(DeleteJointOwnerDetails, 'ids to be deleted');
  console.log(PropertyInfo, 'testttttt');

  console.log(PropertyInfo.user, 'user data entry');

  const responses = {
    created: false,
    updated: false,
    deleted: false,
  };

  try {
    // 🔍 Extract and separate isPrime owner

    let primaryOwner = null;
    primaryOwner = PropertyInfo.jointOwnerDetails.find(
      (entry) => entry.isPrime === true
    );
    if (!primaryOwner)
      console.warn('⚠️ No isPrime owner found in jointOwnerDetails');
    console.log(
      '💡 Final propertyMast after assigning isPrime owner:',
      primaryOwner
    );
    if (primaryOwner) {
      PropertyInfo.propertyMast = {
        ...PropertyInfo.propertyMast,
        OwnerTitle: primaryOwner.OwnerTitle,
        OwnerTitleMarathi: primaryOwner.OwnerTitleMarathi,
        OwnerName: primaryOwner.OwnerName,
        OccupierName: primaryOwner.OccupierName,
        OwnerNameMarathi: primaryOwner.OwnerNameMarathi,
        OccupierNameMarathi: primaryOwner.OccupierNameMarathi,
        Address: primaryOwner.Address,
        OwnerPatta: primaryOwner.OwnerPatta,
        BuildingOrShopName: primaryOwner.BuildingOrShopName ?? null,
        BuildingOrShopNameMarathi:
          primaryOwner.BuildingOrShopNameMarathi ?? null,
        BuildingOrFlatNo: primaryOwner.BuildingOrFlatNo ?? null,
        BuildingOrFlatNoMarathi: primaryOwner.BuildingOrFlatNoMarathi ?? null,
        BuildingOrSocietyName: primaryOwner.BuildingOrSocietyName ?? null,          
        BuildingOrSocietyNameMarathi: primaryOwner.BuildingOrSocietyNameMarathi ?? null, 

      };
    }
    console.log(primaryOwner, 'console primary owner');
    console.log(PropertyInfo.jointOwnerDetails, 'infooo pri');
///approval
const isAMC = PropertyInfo.user?.RoleName?.startsWith('AMC'); 
if (isAMC) {
  PropertyInfo.propertyMast.ApprovalStatus = 'APPROVED';
  PropertyInfo.propertyMast.ApprovedBy = PropertyInfo.user.UserID;
  PropertyInfo.propertyMast.ApprovedDate = new Date();
} else {
  PropertyInfo.propertyMast.ApprovalStatus = 'PENDING';
}
    //let remainingJointOwners = [];

    // Handle PropertyMast data
    let ownerID = PropertyInfo.propertyMast.OwnerID;
    let newOwnerID = 0;
    console.log(ownerID, 'ownerID');
    if (ownerID == 0) {
      console.log(
        'Data sent to PropertyMast.create:',
        PropertyInfo.propertyMast
      );

      const { rToilet, cToilet, ...rest } = PropertyInfo.propertyMast;
      const dataToCreate = {
        ...rest,
        CreatedBy: userId,
        NewToiletNo: rToilet || 0,
        commToiletNo: cToilet || 0,
      };
      const allowedFields = Object.keys(PropertyMast.getAttributes());

      console.log(allowedFields, 'allowedFields');

      console.log('Data sent to PropertyMast.create:', dataToCreate);
      var newPropertyMast = await PropertyMast.create(dataToCreate, {
        validate: true,
        fields: allowedFields,
      });

      console.log('Inserted newly', newPropertyMast);
      newOwnerID = newPropertyMast.OwnerID;
      responses.created = true;
    }
   

  // else {

  //   // 1️⃣ GET OLD PROPERTY (PRIME OWNER)
  //   const oldRecord = await PropertyMast.findOne({
  //     where: { OwnerID: ownerID },
  //     raw: true,
  //   });

  //   // 2️⃣ CREATE HISTORY MASTER
  //   const historyRow = await PropertyDetailsChangeHistory.create({
  //     OwnerID: ownerID,
  //     ChangeDate: new Date(),
  //     UserID: userId,
  //     ScreenName: 'PropertyMast',
  //     EntryType: 'Update',
      
  //   });
  //   const historyId = historyRow.HistoryID;

  //   // =========================
  //   // A) PROPERTY MAST HISTORY
  //   // =========================

  //   // BEFORE PROPERTY SNAPSHOT
  //   await savePropertyMastSnapshot({
  //     historyId,
  //     snapshotType: 'BEFORE',
  //     data: oldRecord,
  //     userId,
  //     versionId: transactionVersionID
  //   });

  //   // =========================
  //   // B) JOINT OWNER HISTORY
  //   // =========================

  //   // BEFORE — OLD OWNERS
  //   for (const owner of PropertyInfo.jointOwnerDetails) {
  //     if (owner.Insert !== true) {
  //       const ownerData = {
  //         ...oldRecord,
  //         OwnerTitle: owner.OwnerTitle,
  //         OwnerTitleMarathi: owner.OwnerTitleMarathi,
  //         OwnerName: owner.OwnerName,
  //         OwnerNameMarathi: owner.OwnerNameMarathi,
  //         OccupierName: owner.OccupierName,
  //         OccupierNameMarathi: owner.OccupierNameMarathi,
  //         Address: owner.Address,
  //         OwnerPatta: owner.OwnerPatta,
  //         BuildingOrShopName: owner.BuildingOrShopName,
  //         BuildingOrShopNameMarathi: owner.BuildingOrShopNameMarathi,
  //         BuildingOrFlatNo: owner.BuildingOrFlatNo || '',
  //         BuildingOrFlatNoMarathi: owner.BuildingOrFlatNoMarathi,
  //         JODId: owner.JODId || null,
  //         IsPrime: owner.isPrime ?? null,
  //       };

  //       await saveFullRowSnapshot({
  //         historyId,
  //         ownerId: owner.OwnerID,
  //         snapshotType: 'BEFORE',
  //         data: ownerData,
  //         screenName: 'PropertyMast',
  //         userId,
  //         versionId: transactionVersionID
  //       });
  //     }
  //   }

  //   // =========================
  //   // C) MAIN UPDATE
  //   // =========================
  //   await PropertyMast.update(
  //     { ...PropertyInfo.propertyMast, UpdatedBy: userId },
  //     { where: { OwnerID: ownerID } }
  //   );

  //   responses.updated = true;

  //   // =========================
  //   // D) PROPERTY AFTER SNAPSHOT
  //   // =========================
  //   const newRecord = await PropertyMast.findOne({
  //     where: { OwnerID: ownerID },
  //     raw: true,
  //   });

  //   await savePropertyMastSnapshot({
  //     historyId,
  //     snapshotType: 'AFTER',
  //     data: newRecord,
  //     userId,
  //     screenName: 'PropertyMast',

  //     versionId: transactionVersionID
  //   });

  //   // =========================
  //   // E) JOINT OWNER AFTER
  //   // =========================
  //   for (const owner of PropertyInfo.jointOwnerDetails) {
  //     if (owner.Insert === true) {
  //       const ownerData = {
  //         ...newRecord,
  //         OwnerTitle: owner.OwnerTitle,
  //         OwnerTitleMarathi: owner.OwnerTitleMarathi,
  //         OwnerName: owner.OwnerName,
  //         OwnerNameMarathi: owner.OwnerNameMarathi,
  //         OccupierName: owner.OccupierName,
  //         OccupierNameMarathi: owner.OccupierNameMarathi,
  //         Address: owner.Address,
  //         OwnerPatta: owner.OwnerPatta,
  //         BuildingOrShopName: owner.BuildingOrShopName,
  //         BuildingOrShopNameMarathi: owner.BuildingOrShopNameMarathi,
  //         BuildingOrFlatNo: owner.BuildingOrFlatNo || '',
  //         BuildingOrFlatNoMarathi: owner.BuildingOrFlatNoMarathi,
  //         JODId: owner.JODId || null,
  //         IsPrime: owner.isPrime ?? null,
  //       };

  //       await saveFullRowSnapshot({
  //         historyId,
  //         ownerId: owner.OwnerID,
  //         snapshotType: 'AFTER',
  //         data: ownerData,
  //         screenName: 'PropertyMast',
  //         userId,
  //         transactionVersionID        });
  //     }
  //   }

  //   // =========================
  //   // F) FIELD LEVEL LOG
  //   // =========================
  //   await logChanges(
  //     PropertyMast,
  //     ownerID,
  //     oldRecord,
  //     PropertyInfo.propertyMast,
  //     'PropertyMast',
  //     userId
  //   );
  // }
  else {
    // 1️⃣ GET OLD PROPERTY (PRIME OWNER)
    const oldRecord = await PropertyMast.findOne({
      where: { OwnerID: ownerID },
      raw: true,
    });

    // 2️⃣ CREATE HISTORY MASTER
    const historyRow = await PropertyDetailsChangeHistory.create({
      OwnerID: ownerID,
      ChangeDate: new Date(),
      UserID: userId,
      ScreenName: 'PropertyMast',
      EntryType: 'Update',
    });
    const historyId = historyRow.HistoryID;

    // ==========================================
    // A) BEFORE SNAPSHOT - Database का पुराना डेटा
    // ==========================================
    await savePropertyMastSnapshot({
      historyId,
      snapshotType: 'BEFORE',
      data: oldRecord,
      userId,
      versionId: transactionVersionID
    });

    const oldJointOwners = await JoinOwnerDetails.findAll({
      where: { OwnerID: ownerID },
      raw: true,
    });

    for (const oldOwner of oldJointOwners) {
      await saveFullRowSnapshot({
        historyId,
        ownerId: ownerID,
        snapshotType: 'BEFORE',
        data: { ...oldRecord, ...oldOwner },
        screenName: 'PropertyMast',
        userId,
        versionId: transactionVersionID
      });
    }

    // ==========================================
    // B) MAIN UPDATE / INSERT OPERATIONS
    // ==========================================
    await PropertyMast.update(
      { ...PropertyInfo.propertyMast, UpdatedBy: userId },
      { where: { OwnerID: ownerID } }
    );

    for (const owner of PropertyInfo.jointOwnerDetails) {
      if (owner.Insert === true) {
        await JoinOwnerDetails.create({ ...owner, OwnerID: ownerID, CreatedBy: userId });
      } else {
        await JoinOwnerDetails.update(
          { ...owner, UpdatedBy: userId },
          { where: { JODId: owner.JODId } }
        );
      }
    }

    responses.updated = true;

    // ==========================================
    // C) AFTER SNAPSHOT - (सिर्फ बदले हुए Records के लिए)
    // ==========================================
    const newRecord = await PropertyMast.findOne({ where: { OwnerID: ownerID }, raw: true });

    await savePropertyMastSnapshot({
      historyId, snapshotType: 'AFTER', data: newRecord, userId, versionId: transactionVersionID
    });

    const updatedJointOwners = await JoinOwnerDetails.findAll({
      where: { OwnerID: ownerID },
      raw: true,
    });

    for (const newOwner of updatedJointOwners) {
      const uiData = PropertyInfo.jointOwnerDetails.find(ui => 
        (ui.JODId && String(ui.JODId) === String(newOwner.JODId)) || 
        (ui.Insert === true && ui.OwnerName === newOwner.OwnerName)
      );

      const prevData = oldJointOwners.find(old => String(old.JODId) === String(newOwner.JODId));

      let hasChanged = false;
      if (!prevData) {
        hasChanged = true; 
      } else if (
        prevData.OwnerName !== newOwner.OwnerName || 
        prevData.OwnerNameMarathi !== newOwner.OwnerNameMarathi ||
        prevData.Address !== newOwner.Address
      ) {
        hasChanged = true; 
      }

      if (hasChanged) {
        await saveFullRowSnapshot({
          historyId,
          ownerId: ownerID,
          snapshotType: 'AFTER',
          data: { ...newRecord, ...newOwner },
          screenName: 'PropertyMast',
          userId,
          versionId: transactionVersionID
        });
      }
    }

    await logChanges(PropertyMast, ownerID, oldRecord, PropertyInfo.propertyMast, 'PropertyMast', userId);
  }
    

    // 🆕 After handling PropertyMast (create/update), sync CombinedOwnerName table
    try {
      if (primaryOwner) {
        const combinedData = {
          OwnerID: ownerID == 0 ? newOwnerID : ownerID,
          OwnerName: primaryOwner.OwnerName,
          MarathiOwnerName: primaryOwner.OwnerNameMarathi,
          OccupierName: primaryOwner.OccupierName,
          MarathiOccupierName: primaryOwner.OccupierNameMarathi,
        };

        if (ownerID == 0) {
          // Insert new record
          await CombinedOwnerName.create(combinedData);
          console.log('✅ Inserted CombinedOwnerName:', combinedData);
        } else {
          // Update existing record
          await CombinedOwnerName.update(
            {
              OwnerName: primaryOwner.OwnerName,
              MarathiOwnerName: primaryOwner.OwnerNameMarathi,
              OccupierName: primaryOwner.OccupierName,
              MarathiOccupierName: primaryOwner.OccupierNameMarathi,
            },
            { where: { OwnerID: ownerID } }
          );
          console.log('✅ Updated CombinedOwnerName:', combinedData);
        }
      }
    } catch (err) {
      console.error('❌ Error handling CombinedOwnerName:', err);
    }

    console.log(PropertyInfo.propertyMast.OpenPlot, 'property typeee');
    if (PropertyInfo.propertyMast.OpenPlot) {
      await FloorSubmissionDetailsMinusData.destroy({
        where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID },
      });
      await FloorSubmissionDetails.destroy({
        where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID },
      });
      await PropertyDetailsNew.destroy({
        where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID },
      });
      console.log(
        'open plot so deleted all floor and property details new records'
      );
    }

    console.log('🧪 propertyDetailsNewwwww:', PropertyInfo.propertyDetailsNew);

    // ===== PropertyDetailsNew ====

    // ===== 1️⃣ Delete PropertyDetailsNew (with cascade) first =====
    if (
      Array.isArray(DeletePropertyDetailsNew) &&
      DeletePropertyDetailsNew.length > 0
    ) {
      for (const PDNId of DeletePropertyDetailsNew) {
        try {
          console.log('❌ Deleting PropertyDetailsNew by PDNId:', PDNId);

          // 1️⃣ Find all floors linked to this PDNId
          const floors = await FloorSubmissionDetails.findAll({
            where: { PDNId },
          });

          // 2️⃣ Delete minus data for each floor
          for (const floor of floors) {
            await FloorSubmissionDetailsMinusData.destroy({
              where: { FSDId: floor.FSDId },
            });
            console.log(`🗑️ Deleted minus data linked to FSDId ${floor.FSDId}`);
          }

          // 3️⃣ Delete floors
          await FloorSubmissionDetails.destroy({ where: { PDNId } });
          console.log(`🗑️ Deleted FloorSubmissionDetails for PDNId ${PDNId}`);

          // 4️⃣ Delete parent PropertyDetailsNew
          console.log('delete property details new');
          await PropertyDetailsNew.destroy({ where: { PDNId } });
          console.log(`🗑️ Deleted PropertyDetailsNew for PDNId ${PDNId}`);

          responses.deleted = true;
        } catch (err) {
          console.error('❌ Error deleting PDNId:', PDNId, err);
          throw err;
        }
      }
    }

    
   
// ===== 2️⃣ Upsert PropertyDetailsNew with conditional AFTER snapshot =====
if (
  Array.isArray(PropertyInfo.propertyDetailsNew) &&
  PropertyInfo.propertyDetailsNew.length > 0 &&
  PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !== 'open plot'
) {
  for (const detail of PropertyInfo.propertyDetailsNew) {
    if (!detail || typeof detail !== 'object') continue;

    try {
      const validOwnerID = newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;
      if (!validOwnerID || validOwnerID === 0) continue;

      // Clean and normalize
      const cleanedDetail = Object.fromEntries(
        Object.entries(detail).map(([k, v]) => [k, v === '' ? null : v])
      );
      const normalize = val => (val === null || val === undefined || val === '' ? null : Number(val));
      cleanedDetail.BuildUpAreaSqFeet = normalize(cleanedDetail.BuildUpAreaSqFeet);
      cleanedDetail.BuildUpAreaSqMeter = normalize(cleanedDetail.BuildUpAreaSqMeter);
      cleanedDetail.NoOfRooms = normalize(cleanedDetail.NoOfRooms);
      cleanedDetail.Room = normalize(cleanedDetail.Room);
      cleanedDetail.Registration = normalize(cleanedDetail.Registration);
      cleanedDetail.RenterYesNO = normalize(cleanedDetail.RenterYesNO);
      cleanedDetail.Rent = normalize(cleanedDetail.Rent);
      cleanedDetail.NonCalculateRent = normalize(cleanedDetail.NonCalculateRent);
      cleanedDetail.OccupierYesNo = normalize(cleanedDetail.OccupierYesNo);
      cleanedDetail.IsAgreement = normalize(cleanedDetail.IsAgreement);

      // Check existing
      const existingRecord = detail.PDNId
        ? await PropertyDetailsNew.findOne({ where: { PDNId: detail.PDNId }, raw: true })
        : null;

      // Create history row
      const historyRow = await PropertyDetailsChangeHistory.create({
        OwnerID: validOwnerID,
        ChangeDate: new Date(),
        UserID: userId,
        ScreenName: 'PropertyDetailsNew',
        EntryType: existingRecord ? 'Update' : 'Insert',
      });
      const historyIdPDN = historyRow.HistoryID;

      if (existingRecord) {
        // BEFORE snapshot always
        await savePropertyDetailsNewSnapshot({
          historyId: historyIdPDN,
          snapshotType: 'BEFORE',
          data: existingRecord,
          userId,
          versionId: transactionVersionID,

        });

        // Prepare update data
        const { Insert, Update, Delete, PDNId, ...updateData } = cleanedDetail;

        // Check if there are actual changes (normalize both old and new for correct comparison)
        const hasChanges = Object.keys(updateData).some(key => {
          let oldVal = existingRecord[key];
          let newVal = updateData[key];

          // normalize old value from DB
          if (oldVal === '' || oldVal === undefined || oldVal === null) oldVal = null;
          if (!isNaN(oldVal) && oldVal !== null) oldVal = Number(oldVal);

          // normalize new value
          if (newVal === '' || newVal === undefined || newVal === null) newVal = null;
          if (!isNaN(newVal) && newVal !== null) newVal = Number(newVal);

          return oldVal != newVal; // loose comparison
        });

        if (hasChanges) {
          // UPDATE in DB
          await PropertyDetailsNew.update(updateData, { where: { PDNId: detail.PDNId } });

          // AFTER snapshot only if changes
          const updatedRecord = await PropertyDetailsNew.findOne({
            where: { PDNId: detail.PDNId },
            raw: true,
          });
          await savePropertyDetailsNewSnapshot({
            historyId: historyIdPDN,
            snapshotType: 'AFTER',
            data: updatedRecord,
            userId,
            versionId: transactionVersionID,


          });

          console.log(`✏️ Updated PDNId=${detail.PDNId}`, updateData);
        } else {
          // No changes, skip AFTER snapshot
          console.log(`ℹ️ No changes for PDNId=${detail.PDNId}, AFTER snapshot skipped`);
        }

      } else {
        // CREATE new record
        const { Insert, Update, Delete, ...newData } = cleanedDetail;
        const createdRecord = await PropertyDetailsNew.create({ ...newData, OwnerID: validOwnerID });

        // AFTER snapshot for new record (always save)
        const newRecord = await PropertyDetailsNew.findOne({
          where: { PDNId: createdRecord.PDNId },
          raw: true,
        });
        await savePropertyDetailsNewSnapshot({
          historyId: historyIdPDN,
          snapshotType: 'AFTER',
          data: newRecord,
          userId,
          versionId: transactionVersionID,

        });

        console.log(`🆕 Created PDNId=${createdRecord.PDNId}`, newData);
      }

    } catch (err) {
      console.error('❌ Error processing PropertyDetailsNew entry:', err, detail);
      throw err;
    }
  }
}


    // -------------------- FloorSubmissionDetails --------------------
    if (
      Array.isArray(PropertyInfo.floorSubmissionDetails) &&
      PropertyInfo.floorSubmissionDetails.length > 0 &&
      PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !==
        'open plot'
    ) {
      for (const detail of PropertyInfo.floorSubmissionDetails) {
        if (!detail || typeof detail !== 'object') continue;

        // 🚫 Skip floors linked to deleted PropertyDetailsNew
        if (
          Array.isArray(DeletePropertyDetailsNew) &&
          DeletePropertyDetailsNew.includes(detail.PDNId)
        ) {
          console.log(`⚠️ Skipping floor for deleted PDNId ${detail.PDNId}`);
          continue;
        }

        try {
          const validOwnerID =
            newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;

          if (!validOwnerID || validOwnerID === 0) {
            console.warn('⚠️ Skipping floor row — no valid OwnerID', detail);
            continue;
          }

          // 🔗 Assign PDNId automatically if missing
          if (!detail.PDNId) {
            let matchingProperty = PropertyInfo.propertyDetailsNew.find(
              (p) => p.OwnerID === validOwnerID
            );

            if (matchingProperty && matchingProperty.PDNId) {
              detail.PDNId = matchingProperty.PDNId;
            } else {
              // detail.PDNId
              console.warn('⚠️ No PDNId provided for floor detail:', detail);

              // Add temporary PropertyDetailsNew row to satisfy FK
              PropertyInfo.propertyDetailsNew.push({
                PDNId: detail.PDNId,
                OwnerID: validOwnerID,
                Insert: true,
              });

              // console.log(
              //   `🆕 Generated PDNId ${newPDNId} and added PropertyDetailsNew row`
              // );
            }
          }

          // 🧹 Clean data: empty string → null
          const cleanedDetail = Object.fromEntries(
            Object.entries(detail)
              .filter(([_, value]) => value !== undefined && value !== null)
              .map(([key, value]) => [key, value === '' ? null : value])
          );

          // 🔢 Convert numeric fields
          const numericFields = [
            'Length',
            'Width',
            'Height',
            'Area',
            'TotalArea',
            'SmallBase',
            'LargeBase',
            'Radius',
            'length_a',
            'length_b',
            'length_c',
          ];
          numericFields.forEach((field) => {
            if (
              cleanedDetail[field] !== undefined &&
              cleanedDetail[field] !== null
            ) {
              cleanedDetail[field] = Number(cleanedDetail[field]) || 0;
            }
          });

          // ❌ Delete rows in bulk (from DeletedFSDId array)
          if (
            Array.isArray(DeleteFloorSubmissionDetails) &&
            DeleteFloorSubmissionDetails.length > 0
          ) {
            for (const FSDId of DeleteFloorSubmissionDetails) {
              await FloorSubmissionDetails.destroy({ where: { FSDId } });
              console.log('❌ Deleted FloorSubmissionDetails by FSDId:', FSDId);
              responses.updated = true;
            }
          }

          // 🗑️ Delete if flagged
          if (detail.Delete) {
            if (detail.FSDId) {
              await FloorSubmissionDetails.destroy({
                where: { FSDId: Number(detail.FSDId) },
              });
              console.log(
                `🗑️ Deleted FloorSubmissionDetails by FSDId ${detail.FSDId}`
              );
            }
            responses.deleted = true;
            continue;
          }

          // ✏️ Update / Insert (UPSERT)
          if (detail.FSDId) {
            const existingFloor = await FloorSubmissionDetails.findOne({
              where: { FSDId: detail.FSDId },
            });
            // if (existingFloor) {
            //   const { Insert, Update, Delete, ...updateData } = cleanedDetail;
            //   updateData.OwnerID = validOwnerID; // ✅ force OwnerID
            //   await FloorSubmissionDetails.update(updateData, {
            //     where: { FSDId: detail.FSDId },
            //   });
            //   responses.updated = true;
            //   console.log(
            //     `✏️ Updated FloorSubmissionDetails FSDId=${detail.FSDId}`,
            //     updateData
            //   );
            // }
            if (existingFloor) {
              const { Insert, Update, Delete, ...updateData } = cleanedDetail;
              updateData.OwnerID = validOwnerID; // ✅ force OwnerID

              // 🕒 Fetch old record before update
              const oldRecord = await FloorSubmissionDetails.findOne({
                where: { FSDId: detail.FSDId },
                raw: true,
              });

              await FloorSubmissionDetails.update(updateData, {
                where: { FSDId: detail.FSDId },
              });

              responses.updated = true;
              console.log(
                `✏️ Updated FloorSubmissionDetails FSDId=${detail.FSDId}`,
                updateData
              );

              // 🧾 Log change history after successful update
              await logChanges(
                FloorSubmissionDetails, // Sequelize model
                validOwnerID,
                oldRecord,
                updateData,
                'FloorSubmissionDetails',
                userId
              );
            } else {
              const { Insert, Update, Delete, ...newData } = cleanedDetail;

              console.log(newData, 'floor id');
              await FloorSubmissionDetails.create({
                ...newData,
                OwnerID: validOwnerID,
              });
              responses.created = true;
              console.log(
                `🆕 Created FloorSubmissionDetails for OwnerID=${validOwnerID}`,
                newData
              );
            }
          } else if (detail.Insert) {
            const { Insert, Update, Delete, ...newData } = cleanedDetail;
            console.log(newData, 'insert');

            await FloorSubmissionDetails.create({
              ...newData,
              OwnerID: validOwnerID,
            });
            responses.created = true;
            console.log(
              `🆕 Created FloorSubmissionDetails for OwnerID=${validOwnerID}`,
              newData
            );
          }
        } catch (err) {
          console.error(
            '❌ Error processing floorSubmissionDetails:',
            err,
            detail
          );
          throw err;
        }
      }
    }

    console.log(
      PropertyInfo.floorSubmissionDetailsMinusData,
      'minusData from ui'
    );
    // -------------------- FloorSubmissionDetailsMinusData --------------------
    if (
      Array.isArray(PropertyInfo.floorSubmissionDetailsMinusData) &&
      PropertyInfo.floorSubmissionDetailsMinusData.length > 0 &&
      PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !==
        'open plot'
    ) {
      for (const detail of PropertyInfo.floorSubmissionDetailsMinusData) {
        if (!detail || typeof detail !== 'object') continue;

        // 🚫 Skip minus-data rows linked to deleted PropertyDetailsNew
        if (
          Array.isArray(DeletePropertyDetailsNew) &&
          DeletePropertyDetailsNew.includes(detail.PDNId)
        ) {
          console.log(
            `⚠️ Skipping minus-data for deleted PDNId ${detail.PDNId}`
          );
          continue;
        }

        const validOwnerID =
          newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;

        if (!validOwnerID || validOwnerID === 0) {
          console.warn('⚠️ Skipping minus row — no valid OwnerID', detail);
          continue;
        }

        // 🧹 Clean data
        const cleanedDetail = Object.fromEntries(
          Object.entries(detail)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, value === '' ? null : value])
        );

        // 🔢 Convert numeric fields
        const numericFields = [
          'Length',
          'Width',
          'Height',
          'Area',
          'TotalArea',
          'SmallBase',
          'LargeBase',
          'Radius',
          'length_a',
          'length_b',
          'length_c',
        ];
        numericFields.forEach((field) => {
          if (
            cleanedDetail[field] !== undefined &&
            cleanedDetail[field] !== null
          ) {
            cleanedDetail[field] = parseFloat(cleanedDetail[field]) || 0;
          }
        });

        // 🔗 Only check parent if FSDId exists
        if (cleanedDetail.FSDId && cleanedDetail.FSDId !== 0) {
          const parentFloor = await FloorSubmissionDetails.findOne({
            where: { FSDId: cleanedDetail.FSDId },
          });
          if (!parentFloor) {
            console.warn(
              `⚠️ Parent FloorSubmissionDetails not found for FSDId ${cleanedDetail.FSDId}, skipping minus data`
            );
            continue;
          }
        }

        // ❌ Delete rows in bulk (from DeletedFSDMDId array)
        if (
          Array.isArray(DeleteFloorSubmissionMinusDetails) &&
          DeleteFloorSubmissionMinusDetails.length > 0
        ) {
          for (const FSDMDId of DeleteFloorSubmissionMinusDetails) {
            await FloorSubmissionDetailsMinusData.destroy({
              where: { FSDMDId },
            });
            console.log(
              '❌ Deleted FloorSubmissionDetailsMinusData by FSDMDId:',
              FSDMDId
            );
            responses.updated = true;
          }
        }

        // 🗑️ Delete if flagged
        if (detail.Delete) {
          if (detail.FSDMDId) {
            await FloorSubmissionDetailsMinusData.destroy({
              where: { FSDMDId: Number(detail.FSDMDId) },
            });
            console.log(
              `🗑️ Deleted FloorSubmissionDetailsMinusData FSDMDId=${detail.FSDMDId}`
            );
          }
          responses.deleted = true;
          continue;
        }

        // ✏️ Update / Insert (UPSERT)
        if (detail.FSDMDId) {
          const existingMinus = await FloorSubmissionDetailsMinusData.findOne({
            where: { FSDMDId: detail.FSDMDId },
          });
          // if (existingMinus) {
          //   const { Insert, Update, Delete, ...updateData } = cleanedDetail;
          //   updateData.OwnerID = validOwnerID; // ✅ force OwnerID
          //   await FloorSubmissionDetailsMinusData.update(updateData, {
          //     where: { FSDMDId: detail.FSDMDId },
          //   });
          //   responses.updated = true;
          //   console.log(
          //     `✏️ Updated FloorSubmissionDetailsMinusData FSDMDId=${detail.FSDMDId}`,
          //     updateData
          //   );
          // }
          if (existingMinus) {
            const { Insert, Update, Delete, ...updateData } = cleanedDetail;
            updateData.OwnerID = validOwnerID; // ✅ force OwnerID

            // 🕒 Fetch old record before update
            const oldRecord = await FloorSubmissionDetailsMinusData.findOne({
              where: { FSDMDId: detail.FSDMDId },
              raw: true,
            });

            await FloorSubmissionDetailsMinusData.update(updateData, {
              where: { FSDMDId: detail.FSDMDId },
            });

            responses.updated = true;
            console.log(
              `✏️ Updated FloorSubmissionDetailsMinusData FSDMDId=${detail.FSDMDId}`,
              updateData
            );

            // 🧾 Log change history after successful update
            await logChanges(
              FloorSubmissionDetailsMinusData, 
              validOwnerID,
              oldRecord,
              updateData,
              'FloorSubmissionDetailsMinusData',
              userId
            );
          } else {
            const { Insert, Update, Delete, ...newData } = cleanedDetail;
            await FloorSubmissionDetailsMinusData.create({
              ...newData,
              OwnerID: validOwnerID,
            });
            responses.created = true;
            console.log(
              `🆕 Created FloorSubmissionDetailsMinusData for OwnerID=${validOwnerID}`,
              newData
            );
          }
        } else if (detail.Insert) {
          const { Insert, Update, Delete, ...newData } = cleanedDetail;
          await FloorSubmissionDetailsMinusData.create({
            ...newData,
            OwnerID: validOwnerID,
          });
          responses.created = true;
          console.log(
            `🆕 Created FloorSubmissionDetailsMinusData for OwnerID=${validOwnerID}`,
            newData
          );
        }
      }
    }

    // :x: Delete rows in bulk (from DeletedFSDId array)
    if (
      Array.isArray(DeleteFloorSubmissionDetails) &&
      DeleteFloorSubmissionDetails.length > 0
    ) {
      console.log('delete floor submission data');
      for (const FSDId of DeleteFloorSubmissionDetails) {
        try {
          console.log(':x: Deleting FloorSubmissionDetails by FSDId:', FSDId);
          // :white_check_mark: Delete children first
          await FloorSubmissionDetailsMinusData.destroy({ where: { FSDId } });
          // :white_check_mark: Then delete parent
          await FloorSubmissionDetails.destroy({ where: { FSDId } });
          responses.updated = true;
        } catch (err) {
          console.error(':x: Error deleting FSDId:', FSDId, err);
          throw err;
        }
      }
    }
    // :x: Delete rows in bulk (from DeletedFSDMDId array)
    if (
      Array.isArray(DeleteFloorSubmissionMinusDetails) &&
      DeleteFloorSubmissionMinusDetails.length > 0
    ) {
      for (const FSDMDId of DeleteFloorSubmissionMinusDetails) {
        try {
          console.log(
            ':x: Deleting FloorSubmissionMinusDetailsMinus by FSDMDId:',
            FSDMDId
          );
          await FloorSubmissionDetailsMinusData.destroy({ where: { FSDMDId } }); // :white_check_mark: Correct model
          responses.updated = true;
        } catch (err) {
          console.error(':x: Error deleting FSDMDId:', FSDMDId, err);
          throw err;
        }
      }
    }

    // ===== TaxPendingDetails =====

// tax pending
if (Array.isArray(PropertyInfo.pendingTaxes) && PropertyInfo.pendingTaxes.length > 0) {
  console.log('Processing pendingTaxes:', PropertyInfo.pendingTaxes);

  for (const raw of PropertyInfo.pendingTaxes) {
    if (!raw || typeof raw !== 'object') {
      console.warn('⚠️ Skipping invalid pendingTaxes entry:', raw);
      continue;
    }

    try {
      const { TPDID, Insert, Update, Delete, PendingYear, ...cleanedDetail } = raw;
      let OwnerID = ownerID || 0;

      /* ---------- New Owner or Insert ---------- */
      if (OwnerID === 0 || Insert) {
        OwnerID = OwnerID === 0 ? newOwnerID : OwnerID;

        const createdRecord = await TaxPendingDetails.create({
          ...cleanedDetail,
          PendingYear,
          OwnerID,
        });

        // AFTER snapshot for new/inserted record
        await saveTaxPendingDetailsSnapshot({
          originalId: createdRecord.TPDID,
          snapshotType: 'AFTER',
          data: createdRecord.get({ plain: true }),
          userId,
          entryType: 'Insert',
          versionId: transactionVersionID
        });

        console.log(`🆕 Created TPDID=${createdRecord.TPDID}`, cleanedDetail);
        responses.created = true;
        continue;
      }

      /* ---------- Update existing record ---------- */
      if (Update) {
        const oldRecord = await TaxPendingDetails.findOne({
          where: { TPDID, OwnerID },
          raw: true,
        });

        if (!oldRecord) {
          console.warn(`⚠️ No existing record found for TPDID=${TPDID}, skipping update`);
          continue;
        }

        // BEFORE snapshot
        await saveTaxPendingDetailsSnapshot({
          originalId: oldRecord.TPDID,
          snapshotType: 'BEFORE',
          data: oldRecord,
          userId,
          entryType: 'Update',
          versionId: transactionVersionID
        });

        // Update DB
        await TaxPendingDetails.update(cleanedDetail, {
          where: { TPDID, OwnerID },
        });
        responses.updated = true;

        // AFTER snapshot only if changes
        const updatedRecord = await TaxPendingDetails.findOne({
          where: { TPDID, OwnerID },
          raw: true,
        });

        const hasChanges = Object.keys(cleanedDetail).some(
          key => cleanedDetail[key] !== oldRecord[key]
        );

        if (hasChanges) {
          await saveTaxPendingDetailsSnapshot({
            originalId: updatedRecord.TPDID,
            snapshotType: 'AFTER',
            data: updatedRecord,
            userId,
            entryType: 'Update',
            versionId: transactionVersionID
          });
          console.log(`✏️ AFTER snapshot saved for TPDID=${TPDID}`);
        } else {
          console.log(`ℹ️ No changes for TPDID=${TPDID}, AFTER snapshot skipped`);
        }
      }

      /* ---------- Delete ---------- */
      if (Delete) {
        const oldRecord = await TaxPendingDetails.findOne({
          where: { TPDID, OwnerID },
          raw: true,
        });

        if (oldRecord) {
          // BEFORE snapshot
          await saveTaxPendingDetailsSnapshot({
            originalId: oldRecord.TPDID,
            snapshotType: 'BEFORE',
            data: oldRecord,
            userId,
            entryType: 'Delete',
            versionId: transactionVersionID
          });

          await TaxPendingDetails.destroy({ where: { TPDID, OwnerID } });
          responses.updated = true;
          console.log(`❌ Deleted TPDID=${TPDID}`);
        }
      }

      console.log('Processing pendingTaxes ended for TPDID:', TPDID);

    } catch (err) {
      console.error('❌ Error processing taxPendingDetails entry:', err, raw);
      throw err;
    }
  }
}



    // 🟢 Handle Joint Owner Details Data
    const primaryOwnerjoint = PropertyInfo.jointOwnerDetails.find(
      (entry) => entry.isPrime === true
    );

    if (primaryOwnerjoint) {
      // const userId = Number(req.user?.id) || 0;

      // Step 1️⃣ Clear isPrime for all existing joint owners of this property (only if property already exists)
      if (primaryOwnerjoint.OwnerID && primaryOwnerjoint.OwnerID !== 0) {
        const oldPrimeOwners = await JoinOwnerDetails.findAll({
          where: { OwnerID: primaryOwnerjoint.OwnerID },
          raw: true,
        });

        await JoinOwnerDetails.update(
          { isPrime: false },
          { where: { OwnerID: primaryOwnerjoint.OwnerID } }
        );

        // 🧾 Log all isPrime reset changes
        for (const oldRec of oldPrimeOwners) {
          const newRec = { ...oldRec, isPrime: false };
          await logChanges(
            JoinOwnerDetails,
            oldRec.OwnerID,
            oldRec,
            newRec,
            'JoinOwnerDetails',
            userId
          );
        }
      }

      // Step 2️⃣ Set the new prime owner (if existing JODId)
      if (primaryOwnerjoint.JODId) {
        const oldPrime = await JoinOwnerDetails.findOne({
          where: { JODId: primaryOwnerjoint.JODId },
          raw: true,
        });

        const primeUpdateData = { ...primaryOwnerjoint, isPrime: true };

        await JoinOwnerDetails.update(primeUpdateData, {
          where: { JODId: primaryOwnerjoint.JODId },
        });

        const newPrimeRec = await JoinOwnerDetails.findOne({
          where: { JODId: primaryOwnerjoint.JODId },
          raw: true,
        });

        await logChanges(
          JoinOwnerDetails,
          primaryOwnerjoint.OwnerID,
          oldPrime,
          newPrimeRec,
          'JoinOwnerDetails',
          userId
        );
      }

      // Step 3️⃣ Insert / Update Joint Owner Details
      for (let jointOwner of PropertyInfo.jointOwnerDetails) {
        if (!jointOwner || typeof jointOwner !== 'object') {
          console.warn('⚠️ Skipping invalid jointOwner entry:', jointOwner);
          continue;
        }

        try {
          let ownerID = jointOwner.OwnerID;

          // 🔹 New property (replace temporary OwnerID 0)
          if (ownerID == 0) {
            ownerID = newOwnerID;
          }

          // 🔹 INSERT new joint owner
          if (jointOwner.Insert) {
            const { Insert, Update, JODId, ...newDetails } = jointOwner;

            // Avoid duplicate entries
            const existingOwner = await JoinOwnerDetails.findOne({
              where: {
                OwnerID: ownerID,
                OwnerName: newDetails.OwnerName?.trim(),
                OwnerPatta: newDetails.OwnerPatta?.trim() || null,
                BuildingOrFlatNo: newDetails.BuildingOrFlatNo?.trim() || null,
                BuildingOrShopName:
                  newDetails.BuildingOrShopName?.trim() || null,
              },
            });

            if (existingOwner) {
              console.log(
                '⚠️ Duplicate owner entry detected, skipping insert:',
                newDetails.OwnerName
              );
              continue;
            }

            const createdRec = await JoinOwnerDetails.create({
              ...newDetails,
              OwnerID: ownerID,
            });
            await logChanges(
              JoinOwnerDetails,
              ownerID,
              null,
              createdRec,
              'JoinOwnerDetails',
              userId
            );

            responses.updated = true;
          }

          // 🔹 UPDATE existing joint owner
          if (jointOwner.Update) {
            const JODId = jointOwner.JODId;
            const { Insert, Update, Delete, ...updateData } = jointOwner;

            const oldRecord = await JoinOwnerDetails.findOne({
              where: { JODId },
              raw: true,
            });

            // Merge all new data (not just isPrime)
            const newData = {
              ...updateData,
              isPrime: jointOwner.isPrime ?? false,
            };

            await JoinOwnerDetails.update(newData, { where: { JODId } });

            const newRecord = await JoinOwnerDetails.findOne({
              where: { JODId },
              raw: true,
            });

            await logChanges(
              JoinOwnerDetails,
              ownerID,
              oldRecord,
              newRecord,
              'JoinOwnerDetails',
              userId
            );

            responses.updated = true;
          }
        } catch (err) {
          console.error(
            '❌ Error while processing jointOwnerDetails entry:',
            err,
            jointOwner
          );
          throw err;
        }
      }

      // Step 4️⃣ Handle deletions
      if (
        Array.isArray(DeleteJointOwnerDetails) &&
        DeleteJointOwnerDetails.length > 0
      ) {
        for (const JODId of DeleteJointOwnerDetails) {
          try {
            await JoinOwnerDetails.destroy({ where: { JODId } });
            responses.updated = true;
          } catch (err) {
            console.error('❌ Error deleting JODId:', JODId, err);
            throw err;
          }
        }
      }
    }


    if (PropertyInfo.propertySocialDetails) {
      let ownerID = PropertyInfo.propertySocialDetails.OwnerID;
    
      /* ---------------- INSERT CASE ---------------- */
      if (ownerID == 0) {
        PropertyInfo.propertySocialDetails.OwnerID = newOwnerID;
    
        console.log(
          '🧾 Final payload to insert social:',
          PropertyInfo.propertySocialDetails
        );
    
        // ✅ createdRecord define karo
        const createdRecord = await PropertySocialDetails.create(
          PropertyInfo.propertySocialDetails
        );
    
        responses.created = true;
    
        // 🧾 AFTER snapshot for INSERT
        await savePropertySocialSnapshot({
          data: createdRecord.get({ plain: true }),
          snapshotType: 'AFTER',
          userId
        });
    
      } else {
        /* ---------------- UPDATE CASE ---------------- */
    
        // 🕒 BEFORE snapshot
        const oldRecord = await PropertySocialDetails.findOne({
          where: { OwnerID: ownerID },
          raw: true
        });
    
        if (oldRecord) {
          await savePropertySocialSnapshot({
            data: oldRecord,
            snapshotType: 'BEFORE',
            userId,
            versionId: transactionVersionID
          });
        }
    
        // 🔄 Update
        await PropertySocialDetails.update(
          PropertyInfo.propertySocialDetails,
          { where: { OwnerID: ownerID } }
        );
    
        responses.updated = true;
    
        // 🕒 FETCH NEW RECORD AFTER UPDATE
        const newRecord = await PropertySocialDetails.findOne({
          where: { OwnerID: ownerID },
          raw: true
        });
    
        // 🧾 AFTER snapshot
        if (newRecord) {
          await savePropertySocialSnapshot({
            data: newRecord,
            snapshotType: 'AFTER',
            userId,
            versionId: transactionVersionID
          });
        }
    
        // optional change log
        await logChanges(
          PropertySocialDetails,
          ownerID,
          oldRecord,
          PropertyInfo.propertySocialDetails,
          'PropertySocialDetails',
          userId
        );
      }
    }
    

    
    if (PropertyInfo.drainFlatRate) {
      let OwnerID =
        PropertyInfo.drainFlatRate.OwnerID || PropertyInfo.propertyMast.OwnerID;

      console.log('ownerID:', OwnerID);

      if (OwnerID == 0) {
        PropertyInfo.drainFlatRate.OwnerID = newOwnerID;

        await ApplyTaxesMaster.create(PropertyInfo.drainFlatRate);
        responses.created = true;
      } else {
        // 1️⃣ FETCH OLD BEFORE UPDATE
        const oldDrain = await ApplyTaxesMaster.findOne({
          where: { OwnerID },
          raw: true,
        });

        // 2️⃣ UPDATE RECORD
        await ApplyTaxesMaster.update(PropertyInfo.drainFlatRate, {
          where: { OwnerID },
        });

        responses.updated = true;

        // 3️⃣ FETCH NEW AFTER UPDATE
        const newDrain = await ApplyTaxesMaster.findOne({
          where: { OwnerID },
          raw: true,
        });

        console.log('old:', oldDrain, 'new:', newDrain);

        // 4️⃣ LOG CHANGES PROPERLY
        await logChanges(
          ApplyTaxesMaster,
          OwnerID,
          oldDrain,
          newDrain,
          'ApplyTaxesMaster',
          userId
        );
      }
    }

    // Handle OldPropertyMast data sumit

    // if (PropertyInfo.oldPropertyMast) {
    //   let ownerID = PropertyInfo.oldPropertyMast.OwnerID || 0;
    //   console.log(ownerID, 'ownerID for oldPropertyMast');
    //   if (PropertyInfo.oldPropertyMast.OldRV === '') {
    //     PropertyInfo.oldPropertyMast.OldRV = null;
    //   }
    //   if (PropertyInfo.oldPropertyMast.OldPropertyTax === '') {
    //     PropertyInfo.oldPropertyMast.OldPropertyTax = null;
    //   }
    //   if (PropertyInfo.oldPropertyMast.OldTotalTax === '') {
    //     PropertyInfo.oldPropertyMast.OldTotalTax = null;
    //   }
    //   if (PropertyInfo.oldPropertyMast.OldALV === '') {
    //     PropertyInfo.oldPropertyMast.OldALV = null;
    //   }
    //   if (PropertyInfo.oldPropertyMast.OldPlotArea === '') {
    //     PropertyInfo.oldPropertyMast.OldPlotArea = null;
    //   }
    //   if (PropertyInfo.oldPropertyMast.OldToiletNo === '') {
    //     PropertyInfo.oldPropertyMast.OldToiletNo = null;
    //   }
    //   if (PropertyInfo.oldPropertyMast.OldTotalRooms === '') {
    //     PropertyInfo.oldPropertyMast.OldTotalRooms = null;
    //   }

    //   // If original OwnerID is 0, fallback to newOwnerID or propertyMast.OwnerID
    //   if (ownerID === 0) {
    //     console.log(newOwnerID, 'newOwnerID for oldPropertyMast');
    //     ownerID = newOwnerID || PropertyInfo.propertyMast.OwnerID;
    //     PropertyInfo.oldPropertyMast.OwnerID = ownerID;
    //   }

    //   // Check if a record with this OwnerID already exists
    //   const existingRecord = await OldPropertyMast.findOne({
    //     where: { OwnerID: ownerID },
    //   });

    //   if (existingRecord) {
    //     // Update existing record
    //     await OldPropertyMast.update(PropertyInfo.oldPropertyMast, {
    //       where: { OwnerID: ownerID },
    //     });
    //     console.log('✏️ Updated existing OldPropertyMast:', ownerID);
    //     responses.updated = true;
    //     await logChanges(
    //       OldPropertyMast,
    //       ownerID,
    //       existingRecord,
    //       PropertyInfo.oldPropertyMast,
    //       'OldPropertyMast',
    //       userId
    //     );
    //   } else {
    //     // Create new record
    //     await OldPropertyMast.create(PropertyInfo.oldPropertyMast);
    //     console.log('✅ Created new OldPropertyMast:', ownerID);

    //     // Count it as update if newOwnerID is 0, else it's a creation
    //     if (newOwnerID === 0) {
    //       responses.updated = true;
    //     } else {
    //       responses.created = true;
    //     }
    //   }
    // }
    if (PropertyInfo.oldPropertyMast) {
      let ownerID = PropertyInfo.oldPropertyMast.OwnerID || 0;
    
      /* ---------- CLEAN EMPTY STRINGS ---------- */
      const nullFields = [
        'OldRV',
        'OldPropertyTax',
        'OldTotalTax',
        'OldALV',
        'OldPlotArea',
        'OldToiletNo',
        'OldTotalRooms'
      ];
    
      nullFields.forEach(f => {
        if (PropertyInfo.oldPropertyMast[f] === '') {
          PropertyInfo.oldPropertyMast[f] = null;
        }
      });
    
      if (ownerID === 0) {
        ownerID = newOwnerID || PropertyInfo.propertyMast.OwnerID;
        PropertyInfo.oldPropertyMast.OwnerID = ownerID;
      }
    
      /* ---------- CHECK EXISTING ---------- */
      const existingRecord = await OldPropertyMast.findOne({
        where: { OwnerID: ownerID },
        raw: true
      });
    
      /* ---------- BEFORE SNAPSHOT ---------- */
      if (existingRecord) {
        await saveOldPropertyMastSnapshot({
          data: existingRecord,
          snapshotType: 'BEFORE',
          userId,
          screenName: 'OldPropertyMast',
          changeOnControl: 'Upsert',
          entryType: 'Update',
          versionId: transactionVersionID
        
        });
      }
    
      if (existingRecord) {
        /* ---------- UPDATE ---------- */
        await OldPropertyMast.update(
          PropertyInfo.oldPropertyMast,
          { where: { OwnerID: ownerID } }
        );
        responses.updated = true;
        console.log('✏️ Updated OldPropertyMast:', ownerID);
      } else {
        /* ---------- INSERT ---------- */
        const created = await OldPropertyMast.create(
          PropertyInfo.oldPropertyMast
        );
        responses.created = true;
        console.log('✅ Created OldPropertyMast:', ownerID);
    
        // AFTER for insert
        await saveOldPropertyMastSnapshot({
          data: created.get({ plain: true }),
          snapshotType: 'AFTER',
          userId,
          screenName: 'OldPropertyMast',
          changeOnControl: 'Insert',
          entryType: 'Insert',
          versionId: transactionVersionID
        
        });
        return;
      }
    
      /* ---------- AFTER SNAPSHOT ---------- */
      const newRecord = await OldPropertyMast.findOne({
        where: { OwnerID: ownerID },
        raw: true
      });
    
      if (newRecord) {
        await saveOldPropertyMastSnapshot({
          data: newRecord,
          snapshotType: 'AFTER',
          userId,
            screenName: 'OldPropertyMast',
  changeOnControl: 'Insert',
  entryType: 'Insert',
  versionId: transactionVersionID

        });
      }
    
      /* ---------- OPTIONAL CHANGE LOG ---------- */
      await logChanges(
        OldPropertyMast,
        ownerID,
        existingRecord,
        PropertyInfo.oldPropertyMast,
        'OldPropertyMast',
        userId
      );
    }
    if (PropertyInfo.oldTaxes) {
      let ownerID = PropertyInfo.propertyMast.OwnerID || 0;
      console.log(ownerID, 'ownerID from propertyMast');
    
      // 🔍 Find existing record
      const existingOldTaxes = await OldTaxes.findOne({
        where: { OwnerID: ownerID }
      });
    
      if (existingOldTaxes) {
        console.log(PropertyInfo.oldTaxes, 'executing update for old taxes');
    
        // 🧾 BEFORE SNAPSHOT
        const versionId = await saveOldTaxesSnapshot({
          data: existingOldTaxes.get({ plain: true }),
          snapshotType: 'BEFORE',
          userId,
          entryType: 'Update',
          versionId: transactionVersionID          
        });
    
        // ✏️ UPDATE MAIN TABLE
        await OldTaxes.update(
          {
            PropertyTax: PropertyInfo.oldTaxes.PropertyTax,
            EducationTax: PropertyInfo.oldTaxes.EducationTax,
            EmploymentTax: PropertyInfo.oldTaxes.EmploymentTax,
            TreeCess: PropertyInfo.oldTaxes.TreeCess,
            FireCess: PropertyInfo.oldTaxes.FireCess,
            SpEducationTax: PropertyInfo.oldTaxes.SpEducationTax,
            MajorBuilding: PropertyInfo.oldTaxes.MajorBuilding,
            LightCess: PropertyInfo.oldTaxes.LightCess,
            RoadCess: PropertyInfo.oldTaxes.RoadCess,
            DrainCess: PropertyInfo.oldTaxes.DrainCess,
            SewageDisposalCess: PropertyInfo.oldTaxes.SewageDisposalCess,
            Sanitation: PropertyInfo.oldTaxes.Sanitation,
            SpWaterCess: PropertyInfo.oldTaxes.SpWaterCess,
            WaterBenefit: PropertyInfo.oldTaxes.WaterBenefit,
            WaterBill: PropertyInfo.oldTaxes.WaterBill,
            Interest: PropertyInfo.oldTaxes.Interest,
            TaxTotal: PropertyInfo.oldTaxes.TaxTotal,
            OldTaxYear: PropertyInfo.oldTaxes.OldTaxYear,
            Tax1: PropertyInfo.oldTaxes.Tax1,
            Tax2: PropertyInfo.oldTaxes.Tax2,
            Tax3: PropertyInfo.oldTaxes.Tax3,
            Tax4: PropertyInfo.oldTaxes.Tax4,
            Tax5: PropertyInfo.oldTaxes.Tax5,
            UpdatedBy: userId,
            UpdatedDate: new Date()
          },
          { where: { OwnerID: ownerID } }
        );
    
        console.log('✏️ Updated existing oldTaxes:', ownerID);
        responses.updated = true;
    
        // 🔄 Fetch updated row
        const newRecord = await OldTaxes.findOne({
          where: { OwnerID: ownerID },
          raw: true
        });
    
        // 🧾 AFTER SNAPSHOT
        await saveOldTaxesSnapshot({
          data: newRecord,
          snapshotType: 'AFTER',
          userId,
          entryType: 'Update',
          versionId: transactionVersionID        });
    
        // 🧾 Normal change log (optional)
        await logChanges(
          OldTaxes,
          ownerID,
          existingOldTaxes,
          PropertyInfo.oldTaxes,
          'OldTaxes',
          userId
        );
    
      } else {
        // 🆕 CREATE FLOW
        if (ownerID === 0 && newOwnerID !== 0) {
          PropertyInfo.oldTaxes.OwnerID = newOwnerID;
          ownerID = newOwnerID;
          console.log(newOwnerID, 'Using newOwnerID for creation');
        } else {
          PropertyInfo.oldTaxes.OwnerID = ownerID;
          console.log(ownerID, 'Using OwnerID (even if 0) for creation');
        }
    
        // 🧾 CREATE MAIN RECORD
        const createdRecord = await OldTaxes.create(PropertyInfo.oldTaxes);
        console.log('📌 Created new oldTaxes:', ownerID);
    
        // 🧾 AFTER SNAPSHOT FOR INSERT
        await saveOldTaxesSnapshot({
          data: createdRecord.get({ plain: true }),
          snapshotType: 'AFTER',
          userId,
          entryType: 'Insert',
          versionId: transactionVersionID        });
    
        if (newOwnerID === 0) {
          responses.updated = true;
        } else {
          responses.created = true;
        }
      }
    }
    
    // //Handle OldTaxes data sumit
    // if (PropertyInfo.oldTaxes) {
    //   let ownerID = PropertyInfo.propertyMast.OwnerID || 0;
    //   console.log(ownerID, 'ownerID from propertyMast');

    //   // First check if there's an existing oldTaxes record for this ownerID
    //   const existingOldTaxes = await OldTaxes.findOne({
    //     where: { OwnerID: ownerID },
    //   });

    //   if (existingOldTaxes) {
    //     console.log(PropertyInfo.oldTaxes, 'executing update for old taxes');
    //     await OldTaxes.update(
    //       {
    //         PropertyTax: PropertyInfo.oldTaxes.PropertyTax,
    //         EducationTax: PropertyInfo.oldTaxes.EducationTax,
    //         EmploymentTax: PropertyInfo.oldTaxes.EmploymentTax,
    //         TreeCess: PropertyInfo.oldTaxes.TreeCess,
    //         FireCess: PropertyInfo.oldTaxes.FireCess,
    //         SpEducationTax: PropertyInfo.oldTaxes.SpEducationTax,
    //         MajorBuilding: PropertyInfo.oldTaxes.MajorBuilding,
    //         LightCess: PropertyInfo.oldTaxes.LightCess,
    //         RoadCess: PropertyInfo.oldTaxes.RoadCess,
    //         DrainCess: PropertyInfo.oldTaxes.DrainCess,
    //         SewageDisposalCess: PropertyInfo.oldTaxes.SewageDisposalCess,
    //         Sanitation: PropertyInfo.oldTaxes.Sanitation,
    //         SpWaterCess: PropertyInfo.oldTaxes.SpWaterCess,
    //         WaterBenefit: PropertyInfo.oldTaxes.WaterBenefit,
    //         WaterBill: PropertyInfo.oldTaxes.WaterBill,
    //         Interest: PropertyInfo.oldTaxes.Interest,
    //         TaxTotal: PropertyInfo.oldTaxes.TaxTotal,
    //         OldTaxYear: PropertyInfo.oldTaxes.OldTaxYear,
    //         Tax1: PropertyInfo.oldTaxes.Tax1,
    //       },
    //       { where: { OwnerID: ownerID } }
    //     );
    //     console.log('✏️ Updated existing oldTaxes:', ownerID);
    //     responses.updated = true;
    //     await logChanges(
    //       OldTaxes,
    //       ownerID,
    //       existingOldTaxes,
    //       PropertyInfo.oldTaxes,
    //       'OldTaxes',
    //       userId
    //     );
    //   } else {
    //     // No existing record, need to create one
    //     if (ownerID === 0 && newOwnerID !== 0) {
    //       PropertyInfo.oldTaxes.OwnerID = newOwnerID;
    //       console.log(newOwnerID, 'Using newOwnerID for creation');
    //     } else {
    //       PropertyInfo.oldTaxes.OwnerID = ownerID;
    //       console.log(ownerID, 'Using OwnerID (even if 0) for creation');
    //     }

    //     await OldTaxes.create(PropertyInfo.oldTaxes);
    //     console.log('📌 Created new oldTaxes:', PropertyInfo.oldTaxes.OwnerID);
    //     if (newOwnerID === 0) {
    //       responses.updated = true;
    //     } else {
    //       responses.created = true;
    //     }
    //   }
    // }

    // image property
    //   // image property
    // Check if ownerID is provided

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // if (!ownerID) {
    //   return res.status(400).json({ message: ':x: OwnerID is required' });
    // }

    let WardNo = PropertyInfo.propertyMast.NewWardNo;

    let PropertyNo = PropertyInfo.propertyMast.NewPropertyNo;

    let PartitionNo = PropertyInfo.propertyMast.NewPartitionNo;

    // :white_check_mark: Define paths
   // const BASE_IMAGE_PATH = 'C:\\NTIS_New_Images';

   const BASE_IMAGE_PATH = '//192.168.5.244/e$/NTIS_New_Images'; // Change base path
    const COMMON_IMAGE_PATH = path.join(BASE_IMAGE_PATH, 'Image/Photo');
    const PLAN_IMAGE_PATH = path.join(BASE_IMAGE_PATH, 'Image/Plan');
    // Check directory access
    fs.access(
      COMMON_IMAGE_PATH,
      fs.constants.R_OK | fs.constants.W_OK,
      (err) => {
        if (err) {
          console.error(':x: No access to:', COMMON_IMAGE_PATH);
          console.error(err.message);
        } else {
          console.log(
            ':white_check_mark: Controller has read/write access to:',
            COMMON_IMAGE_PATH
          );
        }
      }
    );
    // :white_check_mark: Define file mappings
    const fileMappings = {
      PropertyPathA: {
        suffix: 'A',
        blobField: 'PropertyPhotoA',
        pathField: 'PropertyPathA',
      },
      PropertyPathB: {
        suffix: 'B',
        blobField: 'PropertyPhotoB',
        pathField: 'PropertyPathB',
      },
      PropertyPathC: {
        suffix: 'C',
        blobField: 'PropertyPhotoC',
        pathField: 'PropertyPathC',
      },
      PropertyPathD: {
        suffix: 'D',
        blobField: 'PropertyPhotoD',
        pathField: 'PropertyPathD',
      },
      PlanPath: {
        suffix: `${WardNo}-${PropertyNo}`,
        blobField: 'PlanPhoto',
        pathField: 'PlanPath',
        isPlan: true,
      },
    };
    let updateData = {};
    console.log('--------------------------------------------before object');
    // Loop over the uploaded files

    if (req.body.uploadedFiles) {
      for (const [key, fileArray] of Object.entries(req.body.uploadedFiles)) {
        const mapping = fileMappings[key];
        if (!mapping) {
          console.warn(`⚠️ Skipping unknown file key: ${key}`);
          continue;
        }

        const { suffix, pathField, isPlan } = mapping;
        const fileExt = isPlan ? '.WMF' : '.jpg';
        console.log(isPlan, 'isPlan');

        const existingData = await PropertyImageMast.findOne({
          where: { ownerid: ownerID },
        });

        if (!fileArray || Object.keys(fileArray).length === 0) {
          const currentPath = existingData?.[pathField];
          if (currentPath) {
            const fullPath = path.join(BASE_IMAGE_PATH, currentPath);
            if (fs.existsSync(fullPath)) {
              try {
                fs.unlinkSync(fullPath);
                console.log(`🗑️ Deleted existing file: ${fullPath}`);
              } catch (error) {
                console.error(`❌ Failed to delete file ${fullPath}:`, error);
              }
            }
          }

          updateData[pathField] = null;
          continue;
        }
        // console.log(fileArray, 'fileArray')

        try {
          if (
            typeof fileArray === 'string' &&
            fileArray.startsWith('data:image')
          ) {
            console.log('✅ Base64 image detected, processing...');

            const matches = fileArray.match(
              /^data:([A-Za-z-+/]+);base64,(.+)$/
            );
            if (!matches || matches.length !== 3) {
              console.warn('⚠️ Invalid base64 format');
              continue;
            }

            const decodedBuffer = Buffer.from(matches[2], 'base64');

            // 🛠 Filename setup
            const fileExt = isPlan ? '.wmf' : '.jpg';
            const newFilename = isPlan
              ? `${WardNo}-${PropertyNo}-Plan${fileExt}`
              : `${WardNo}-${PropertyNo}-${PartitionNo}-${suffix}${fileExt}`;

            const targetDir = isPlan ? PLAN_IMAGE_PATH : COMMON_IMAGE_PATH;
            const newFilePath = path.join(targetDir, newFilename);
            fs.mkdirSync(targetDir, { recursive: true });

            // 🔍 File size check
            const fileSizeMB = decodedBuffer.length / 1024 / 1024;

            if (isPlan) {
              if (fileSizeMB > 5) {
                console.error(
                  `❌ WMF file too large (${fileSizeMB.toFixed(
                    2
                  )} MB). Skipping.`
                );
                continue;
              }
              fs.writeFileSync(newFilePath, decodedBuffer);
              console.log(`✅ WMF file saved: ${newFilePath}`);
            } else {
              if (fileSizeMB <= 5) {
                fs.writeFileSync(newFilePath, decodedBuffer);
                console.log(`✅ JPEG saved (no compression): ${newFilePath}`);
              } else {
                let dimensions;
                try {
                  dimensions = sizeOf(decodedBuffer);
                } catch (dimErr) {
                  console.error('❌ Could not read image dimensions:', dimErr);
                  continue;
                }

                const { width, height } = dimensions;
                const scaledWidth = Math.round(width * 0.15);
                const scaledHeight = Math.round(height * 0.15);

                let finalBuffer = await sharp(decodedBuffer)
                  .resize(scaledWidth, scaledHeight)
                  .jpeg({ quality: 75 })
                  .toBuffer();

                if (finalBuffer.length > 5 * 1024 * 1024) {
                  console.warn(
                    `⚠️ Still too large (${(
                      finalBuffer.length /
                      1024 /
                      1024
                    ).toFixed(2)} MB), retrying...`
                  );
                  finalBuffer = await sharp(finalBuffer)
                    .jpeg({ quality: 60 })
                    .toBuffer();
                }

                if (finalBuffer.length > 5 * 1024 * 1024) {
                  console.error(
                    `❌ Still too large after compression. Skipping.`
                  );
                  continue;
                }

                fs.writeFileSync(newFilePath, finalBuffer);
                console.log(`✅ JPEG saved after compression: ${newFilePath}`);
              }
            }

            const relativePath = path
              .relative(BASE_IMAGE_PATH, newFilePath)
              .replace(/\\/g, '/');
            updateData[pathField] = relativePath;
            console.log(`📝 Saved relative path: ${relativePath}`);
          } else {
            console.warn(`⚠️ Skipping non-base64 item: ${key} `);
          }
        } catch (error) {
          console.error(`❌ Error processing file ${key}:`, error);
        }
      }
    }
    const imageRecord = await PropertyImageMast.findOne({
      where: { ownerid: ownerID },
    });
    console.log('Updated data:', updateData);
    if (imageRecord) {
      // :white_check_mark: Update existing record
      const [rowsUpdated] = await PropertyImageMast.update(updateData, {
        where: { ownerid: ownerID },
      });
      if (rowsUpdated === 0) {
        console.error(':x: No rows updated. Possible constraints issue.');
      }
      console.log(
        ':white_check_mark: Database updated successfully:',
        rowsUpdated,
        'row(s) affected'
      );
      responses.updated = true;
    } else {
      newOwnerID === 0
        ? (newOwnerID = PropertyInfo.propertyMast.OwnerID)
        : newOwnerID;
      const newImageEntry = await PropertyImageMast.create({
        ownerid: newOwnerID,
        ...updateData,
        CreatedBy: ownerID,
        CreatedDate: new Date(),
        UpdatedBy: ownerID,
        UpdatedDate: new Date(),
      });

      console.log(
        ':white_check_mark: New record created successfully:',
        newImageEntry
      );
      newOwnerID === 0
        ? (responses.created = true)
        : (responses.updated = true);
    }

    //  Handle typeOfUseNonTaxable insert (Capital Value: Yes)

    if (PropertyInfo.typeOfUseNonTaxableList) {
      try {
        const { TypeOfUseID, Type, Description } =
          PropertyInfo.typeOfUseNonTaxableList;

        await TypeOfUseMasterNonTaxable.create({
          TypeOfUseID,
          Type,
          Description,
        });
       
        console.log(`✅ Non-taxable use type inserted: ${TypeOfUseID}`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.warn(`⚠️ TypeOfUseID already exists: ${error.message}`);
        } else {
          console.error(`❌ Error inserting TypeOfUse:`, error.message);
        }
      }
    }
    // Handle PropertyDetailsOld data
    // if (
    //   Array.isArray(PropertyInfo.propertyDetailsOld) &&
    //   PropertyInfo.propertyDetailsOld.length > 0
    // ) {
    //   for (const oldDetail of PropertyInfo.propertyDetailsOld) {
    //     if (!oldDetail || typeof oldDetail !== 'object') {
    //       console.warn(
    //         '⚠️ Skipping invalid propertyDetailsOld entry:',
    //         oldDetail
    //       );
    //       continue;
    //     }

    //     try {
    //       const PDOId = oldDetail.PDOId;
    //       const incomingOwnerID =
    //         oldDetail.OwnerID || PropertyInfo.propertyMast.OwnerID;
    //       const actualOwnerID =
    //         incomingOwnerID === 0 ? newOwnerID : incomingOwnerID;

    //       // ❌ DELETE if flag is set
    //       if (Array.isArray(oldDetail)) {
    //         for (const pdoId of oldDetail) {
    //           console.log('❌ Deleting propertyDetailsOld with PDOId:', pdoId);

    //           await propertydetailsold.destroy({
    //             where: { PDOId: pdoId },
    //           });
    //         }
    //         responses.updated = true;
    //         continue;
    //       }

    //       // 🔍 Check if record exists
    //       const existing = await propertydetailsold.findOne({
    //         where: { PDOId },
    //       });

    //       if (existing) {
    //         // ✏️ UPDATE
    //         const { Insert, Update, Delete, ...updateDetails } = oldDetail;

    //         console.log(
    //           '✏️ Updating propertyDetailsOld:',
    //           PDOId,
    //           updateDetails
    //         );

    //         await propertydetailsold.update(
    //           {
    //             ...updateDetails,
    //             OwnerID: actualOwnerID,
    //           },
    //           { where: { PDOId } }
    //         );

    //         responses.updated = true;

    //          await logChanges(
    //       propertydetailsold,
    //       ownerID,
    //       updateDetails,
    //       PropertyInfo.propertyDetailsOld,
    //       'propertyDetailsOld',
    //       userId
    //     );
    //       } else {
    //         // 🆕 INSERT
    //         const { Insert, Update, Delete, ...insertDetails } = oldDetail;

    //         console.log(
    //           '➕ Inserting new propertyDetailsOld:',
    //           PDOId,
    //           insertDetails
    //         );

    //         await propertydetailsold.create({
    //           ...insertDetails,
    //           PDOId,
    //           OwnerID: actualOwnerID,
    //         });

    //         incomingOwnerID === 0
    //           ? (responses.created = true)
    //           : (responses.updated = true);
    //       }
    //     } catch (err) {
    //       console.error(
    //         '❌ Error while processing propertyDetailsOld entry:',
    //         err,
    //         oldDetail
    //       );
    //       throw err;
    //     }
    //   }
    // }
    if (Array.isArray(PropertyInfo.propertyDetailsOld) && PropertyInfo.propertyDetailsOld.length > 0) {
      for (const oldDetail of PropertyInfo.propertyDetailsOld) {
        if (!oldDetail) continue;
    
        // -----------------------
        // 1️⃣ Handle array of PDOIds (old format)
        // -----------------------
        if (Array.isArray(oldDetail)) {
          for (const pdoId of oldDetail) {
            const existingRecord = await propertydetailsold.findOne({ where: { PDOId: pdoId } });
            if (existingRecord) {
              // BEFORE snapshot
              await savePropertyDetailsOldSnapshot({
                data: existingRecord.dataValues,
                snapshotType: 'BEFORE',
                userId,
                          versionId: transactionVersionID          

              });
    
              console.log('❌ Deleting propertyDetailsOld with PDOId:', pdoId);
              await propertydetailsold.destroy({ where: { PDOId: pdoId } });
    
              // AFTER snapshot
              await savePropertyDetailsOldSnapshot({
                data: { PDOId: pdoId, OwnerID: existingRecord.OwnerID, Delete: true },
                snapshotType: 'AFTER',
                userId,
                          versionId: transactionVersionID          

              });
    
              responses.updated = true;
            } else {
              console.warn('⚠️ Cannot delete non-existing PDOId:', pdoId);
            }
          }
          continue; // skip update/insert for arrays
        }
    
        // -----------------------
        // 2️⃣ Normal object format
        // -----------------------
        const PDOId = oldDetail.PDOId;
        if (!PDOId) continue;
    
        const incomingOwnerID = oldDetail.OwnerID || PropertyInfo.propertyMast.OwnerID;
        const actualOwnerID = incomingOwnerID === 0 ? newOwnerID : incomingOwnerID;
    
        const existing = await propertydetailsold.findOne({ where: { PDOId } });
    
        // -----------------------
        // 3️⃣ DELETE if Delete flag is set
        // -----------------------
        if (oldDetail.Delete && existing) {
          await savePropertyDetailsOldSnapshot({
            data: existing.dataValues,
            snapshotType: 'BEFORE',
            userId,
            versionId: transactionVersionID
          });
    
          console.log('❌ Deleting propertyDetailsOld with PDOId:', PDOId);
          await propertydetailsold.destroy({ where: { PDOId } });
    
          await savePropertyDetailsOldSnapshot({
            data: { PDOId, OwnerID: actualOwnerID, Delete: true },
            snapshotType: 'AFTER',
            userId,
            versionId: transactionVersionID
          });
    
          responses.updated = true;
          continue; // skip update/insert
        }
    
        // -----------------------
        // 4️⃣ UPDATE logic
        // -----------------------
        if (existing) {
          // Only save BEFORE snapshot if something changed
          const hasChanges = Object.keys(oldDetail).some(key => {
            if (['Insert', 'Update', 'Delete'].includes(key)) return false;
            return oldDetail[key] != existing[key]; // != allows number/string comparison
          });
    
          if (hasChanges) {
            await savePropertyDetailsOldSnapshot({
              data: existing.dataValues,
              snapshotType: 'BEFORE',
              userId,
              versionId: transactionVersionID
            });
          }
    
          const { Insert, Update, Delete, ...updateDetails } = oldDetail;
          await propertydetailsold.update(
            { ...updateDetails, OwnerID: actualOwnerID },
            { where: { PDOId } }
          );
    
          const updatedRecord = await propertydetailsold.findOne({ where: { PDOId } });
          await savePropertyDetailsOldSnapshot({
            data: updatedRecord.dataValues,
            snapshotType: 'AFTER',
            userId,
            versionId: transactionVersionID
          });
    
          responses.updated = true;
          await logChanges(
            propertydetailsold,
            ownerID,
            updateDetails,
            PropertyInfo.propertyDetailsOld,
            'propertyDetailsOld',
            userId
          );
        } else {
          // -----------------------
          // 5️⃣ INSERT logic
          // -----------------------
          // Minimal BEFORE snapshot for new insert
          await savePropertyDetailsOldSnapshot({
            data: { PDOId, OwnerID: actualOwnerID },
            snapshotType: 'BEFORE',
            userId,
          });
    
          const { Insert, Update, Delete, ...insertDetails } = oldDetail;
          const createdRecord = await propertydetailsold.create({
            ...insertDetails,
            PDOId,
            OwnerID: actualOwnerID,
          });
    
          // AFTER snapshot
          await savePropertyDetailsOldSnapshot({
            data: createdRecord.dataValues,
            snapshotType: 'AFTER',
            userId,
          });
    
          incomingOwnerID === 0 ? (responses.created = true) : (responses.updated = true);
        }
      }
    }
    
    //Determine response status
    
    
    
    console.log(
      '📤 Final Responses:PropertyInfo.retentionTaxData',
      PropertyInfo.retentionTaxData
    );
    if (PropertyInfo.retentionTaxData) {
      let ownerID = PropertyInfo.retentionTaxData.OwnerID;

      // Clone and clean data — convert empty strings to null
      const cleanedRetentionData = Object.fromEntries(
        Object.entries(PropertyInfo.retentionTaxData)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, value === '' ? null : value])
      );

      try {
        // Check if record exists first
        const existing = await Retentiontaxmast.findOne({
          where: { OwnerID: ownerID },
        });

        if (existing) {
          const updateData = Object.fromEntries(
            Object.entries(cleanedRetentionData).filter(
              ([key]) => key !== 'OwnerID'
            )
          );

          if (Object.keys(updateData).length > 0) {
            await Retentiontaxmast.update(updateData, {
              where: { OwnerID: ownerID },
            });
            console.log(
              `Retentiontaxmast updated for OwnerID ${ownerID}`,
              updateData
            );
            responses.updated = true;
            // 🔹 Log history
            await logChanges(
              Retentiontaxmast,
              ownerID,
              existing,
              updateData,
              'RetentionTax',
              userId
            );
          }
        } else {
          // Insert new record
          if (ownerID) {
            await Retentiontaxmast.create({
              ...cleanedRetentionData,
              OwnerID: ownerID,
            });
            console.log(
              `Retentiontaxmast created for OwnerID ${ownerID}`,
              cleanedRetentionData
            );
            responses.created = true;
          }
        }
      } catch (error) {
        console.error('Error saving Retentiontaxmast:', error);
      }
    }

    const statusCode = responses.created ? 200 : responses.updated ? 201 : 200;

    const message = responses.created
      ? 'Property information created successfully'
      : 'Property information updated successfully';

    // ✅ Determine finalOwnerID (new or existing)
    const finalOwnerID =
      newOwnerID !== 0 ? newOwnerID : PropertyInfo.propertyMast.OwnerID;

    console.log('Final OwnerID to return:', finalOwnerID);
   return res.status(statusCode).json({
      message,
      OwnerID: finalOwnerID, 
      versionId: transactionVersionID,
      
    }); 
  } catch (error) {
    console.error('Error saving property information:', error.message);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};

//orgin
export const savePropertyInfo = async (req, res) => {
  console.log('req is coming');
  const { PropertyInfo } = req.body;
  const userId = PropertyInfo.user?.UserID || 0;

  console.log(userId, 'id');
  const { DeletePropertyDetailsNew } = PropertyInfo;
  const { DeleteJointOwnerDetails } = PropertyInfo;

  const { DeleteFloorSubmissionDetails } = PropertyInfo;
  const { DeleteFloorSubmissionMinusDetails } = PropertyInfo;

  console.log(DeleteFloorSubmissionDetails, 'DeleteFloorSubmissionDetails');

  console.log(DeletePropertyDetailsNew, 'property info deleted pdnids');

  console.log(DeleteJointOwnerDetails, 'ids to be deleted');
  console.log(PropertyInfo, 'testttttt');

  console.log(PropertyInfo.user, 'user data entry');

  const responses = {
    created: false,
    updated: false,
    deleted: false,
  };

  try {
    // 🔍 Extract and separate isPrime owner

    let primaryOwner = null;
    primaryOwner = PropertyInfo.jointOwnerDetails.find(
      (entry) => entry.isPrime === true
    );
    if (!primaryOwner)
      console.warn('⚠️ No isPrime owner found in jointOwnerDetails');
    console.log(
      '💡 Final propertyMast after assigning isPrime owner:',
      primaryOwner
    );
    if (primaryOwner) {
      PropertyInfo.propertyMast = {
        ...PropertyInfo.propertyMast,
        OwnerTitle: primaryOwner.OwnerTitle,
        OwnerTitleMarathi: primaryOwner.OwnerTitleMarathi,
        OwnerName: primaryOwner.OwnerName,
        OccupierName: primaryOwner.OccupierName,
        OwnerNameMarathi: primaryOwner.OwnerNameMarathi,
        OccupierNameMarathi: primaryOwner.OccupierNameMarathi,
        Address: primaryOwner.Address,
        OwnerPatta: primaryOwner.OwnerPatta,
        BuildingOrShopName: primaryOwner.BuildingOrShopName ?? null,
        BuildingOrShopNameMarathi:
        primaryOwner.BuildingOrShopNameMarathi ?? null,
        BuildingOrFlatNo: primaryOwner.BuildingOrFlatNo ?? null,
        BuildingOrFlatNoMarathi: primaryOwner.BuildingOrFlatNoMarathi ?? null,
      };
    }
   
    console.log(primaryOwner, 'console primary owner');
    console.log(PropertyInfo.jointOwnerDetails, 'infooo pri');
///approval
const isAMC = PropertyInfo.user?.RoleName === 'AMC';

if (isAMC) {
  PropertyInfo.propertyMast.ApprovalStatus = 'APPROVED';
  PropertyInfo.propertyMast.ApprovedBy = PropertyInfo.user.UserID;
  PropertyInfo.propertyMast.ApprovedDate = new Date();
} else {
  PropertyInfo.propertyMast.ApprovalStatus = 'PENDING';
}
    //let remainingJointOwners = [];

    // Handle PropertyMast data
    let ownerID = PropertyInfo.propertyMast.OwnerID;
    let newOwnerID = 0;
    console.log(ownerID, 'ownerID');
    if (ownerID == 0) {
      console.log(
        'Data sent to PropertyMast.create:',
        PropertyInfo.propertyMast
      );

      const { rToilet, cToilet, ...rest } = PropertyInfo.propertyMast;
      
      const dataToCreate = {
        ...rest,
        CreatedBy: userId,
        CreatedDate: new Date(),
        NewToiletNo: rToilet || 0,
        commToiletNo: cToilet || 0,
      };

      // ✅ CONDITIONAL MAPPING
if (PropertyInfo.propertyMast.OpenPlot) {
  // OPEN PLOT → PlotTaxableAreaSqFt
  dataToCreate.PlotTaxableAreaSqFt = plotTaxableAreaSqFt || 0;
  dataToCreate.PlotArea = null;
} else {
  // NOT OPEN PLOT → PlotArea
  dataToCreate.PlotArea = plotTaxableAreaSqFt || 0;
  dataToCreate.PlotTaxableAreaSqFt = null;
}
      const allowedFields = Object.keys(PropertyMast.getAttributes());

      console.log(allowedFields, 'allowedFields');

      console.log('Data sent to PropertyMast.create:', dataToCreate);
      var newPropertyMast = await PropertyMast.create(dataToCreate, {
        validate: true,
        fields: allowedFields,
      });

      console.log('Inserted newly', newPropertyMast);
      newOwnerID = newPropertyMast.OwnerID;
      responses.created = true;
    }
    //else {
    //   // Update existing record
    //   await PropertyMast.update(PropertyInfo.propertyMast, {
    //     where: { OwnerID: ownerID },
    //   });
    //   responses.updated = true;
    // }
    else {
      // Update existing record
      const oldRecord = await PropertyMast.findOne({
        where: { OwnerID: ownerID },
        raw: true,
      });
      await PropertyMast.update(
        { ...PropertyInfo.propertyMast, UpdatedBy: userId,UpdatedDate:new Date() },
        {
          where: { OwnerID: ownerID },
        }
      );
      responses.updated = true;

      // 🕒 Add change history
      await logChanges(
        PropertyMast, // Sequelize model
        ownerID, // Owner ID
        oldRecord, // Old data before update
        PropertyInfo.propertyMast,
        'PropertyMast', // New data after update
        userId // User ID
      );
    }

    // 🆕 After handling PropertyMast (create/update), sync CombinedOwnerName table
    try {
      if (primaryOwner) {
        const combinedData = {
          OwnerID: ownerID == 0 ? newOwnerID : ownerID, // new or existing OwnerID
          OwnerName: primaryOwner.OwnerName,
          MarathiOwnerName: primaryOwner.OwnerNameMarathi,
          OccupierName: primaryOwner.OccupierName,
          MarathiOccupierName: primaryOwner.OccupierNameMarathi,
        };

        if (ownerID == 0) {
          // Insert new record
          await CombinedOwnerName.create(combinedData);
          console.log('✅ Inserted CombinedOwnerName:', combinedData);
        } else {
          // Update existing record
          await CombinedOwnerName.update(
            {
              OwnerName: primaryOwner.OwnerName,
              MarathiOwnerName: primaryOwner.OwnerNameMarathi,
              OccupierName: primaryOwner.OccupierName,
              MarathiOccupierName: primaryOwner.OccupierNameMarathi,
            },
            { where: { OwnerID: ownerID } }
          );
          console.log('✅ Updated CombinedOwnerName:', combinedData);
        }
      }
    } catch (err) {
      console.error('❌ Error handling CombinedOwnerName:', err);
    }

    console.log(PropertyInfo.propertyMast.OpenPlot, 'property typeee');
    if (PropertyInfo.propertyMast.OpenPlot) {
      await FloorSubmissionDetailsMinusData.destroy({
        where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID },
      });
      await FloorSubmissionDetails.destroy({
        where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID },
      });
      await PropertyDetailsNew.destroy({
        where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID },
      });
      console.log(
        'open plot so deleted all floor and property details new records'
      );
    }

    console.log('🧪 propertyDetailsNewwwww:', PropertyInfo.propertyDetailsNew);

    // ===== PropertyDetailsNew ====

    // ===== 1️⃣ Delete PropertyDetailsNew (with cascade) first =====
    if (
      Array.isArray(DeletePropertyDetailsNew) &&
      DeletePropertyDetailsNew.length > 0
    ) {
      for (const PDNId of DeletePropertyDetailsNew) {
        try {
          console.log('❌ Deleting PropertyDetailsNew by PDNId:', PDNId);

          // 1️⃣ Find all floors linked to this PDNId
          const floors = await FloorSubmissionDetails.findAll({
            where: { PDNId },
          });

          // 2️⃣ Delete minus data for each floor
          for (const floor of floors) {
            await FloorSubmissionDetailsMinusData.destroy({
              where: { FSDId: floor.FSDId },
            });
            console.log(`🗑️ Deleted minus data linked to FSDId ${floor.FSDId}`);
          }

          // 3️⃣ Delete floors
          await FloorSubmissionDetails.destroy({ where: { PDNId } });
          console.log(`🗑️ Deleted FloorSubmissionDetails for PDNId ${PDNId}`);

          // 4️⃣ Delete parent PropertyDetailsNew
          console.log('delete property details new');
          await PropertyDetailsNew.destroy({ where: { PDNId } });
          console.log(`🗑️ Deleted PropertyDetailsNew for PDNId ${PDNId}`);

          responses.deleted = true;
        } catch (err) {
          console.error('❌ Error deleting PDNId:', PDNId, err);
          throw err;
        }
      }
    }

    // // ===== 2️⃣ Upsert PropertyDetailsNew =====
    // if (
    //   Array.isArray(PropertyInfo.propertyDetailsNew) &&
    //   PropertyInfo.propertyDetailsNew.length > 0 &&
    //   PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !==
    //     'open plot'
    // ) {
    //   for (const detail of PropertyInfo.propertyDetailsNew) {
    //     console.log(detail, 'new object to be send');

    //     if (!detail || typeof detail !== 'object') continue;

    //     try {
    //       // Determine valid OwnerID
    //       const validOwnerID =
    //         newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;
    //       if (!validOwnerID || validOwnerID === 0) {
    //         console.warn(
    //           '⚠️ Skipping insert — no valid OwnerID for detail:',
    //           detail
    //         );
    //         continue;
    //       }

    //       // Clean detail: empty strings → null
    //       const cleanedDetail = Object.fromEntries(
    //         Object.entries(detail)
    //           .filter(([_, value]) => value !== undefined && value !== null)
    //           .map(([key, value]) => [key, value === '' ? null : value])
    //       );

    //       // UPSERT: check if the PDNId exists
    //       let existingRecord = null;
    //       if (detail.PDNId) {
    //         existingRecord = await PropertyDetailsNew.findOne({
    //           where: { PDNId: detail.PDNId },
    //         });
    //       }

    //       // if (existingRecord) {
    //       //   const { Insert, Update, Delete, ...updateData } = cleanedDetail;
    //       //   const { PDNId, ...updateDataWithoutPDNId } = updateData;

    //       //   const normalize = (val) => {
    //       //     if (val === '' || val === undefined || val === null) return null;
    //       //     return Number(val.toString().replace(/,/g, ''));
    //       //   };

    //       //   updateDataWithoutPDNId.BuildUpAreaSqFeet = normalize(
    //       //     updateDataWithoutPDNId.BuildUpAreaSqFeet
    //       //   );
    //       //   updateDataWithoutPDNId.BuildUpAreaSqMeter = normalize(
    //       //     updateDataWithoutPDNId.BuildUpAreaSqMeter
    //       //   );
    //       //   console.log(updateDataWithoutPDNId, 'updateDataWithoutPDNId');
    //       //   const result = await PropertyDetailsNew.update(
    //       //     updateDataWithoutPDNId,
    //       //     {
    //       //       where: { PDNId: detail.PDNId },
    //       //     }
    //       //   );

    //       //   console.log(result, 'updateDataWithoutPDNId');
    //       //   responses.updated = true;
    //       // }

    //       if (existingFloor) {
    //         const { Insert, Update, Delete, ...updateData } = cleanedFloor;
    //         const { FSDId, ...updateDataWithoutFSDId } = updateData;

    //         const normalize = (val) => {
    //           if (val === '' || val === undefined || val === null) return null;
    //           return Number(val.toString().replace(/,/g, ''));
    //         };

    //         updateDataWithoutFSDId.BuiltUpAreaSqFeet = normalize(
    //           updateDataWithoutFSDId.BuiltUpAreaSqFeet
    //         );
    //         updateDataWithoutFSDId.BuiltUpAreaSqMeter = normalize(
    //           updateDataWithoutFSDId.BuiltUpAreaSqMeter
    //         );

    //         console.log(updateDataWithoutFSDId, 'updateDataWithoutFSDId');

    //         // ✅ fetch record before update
    //         const oldRecord = await FloorSubmissionDetails.findOne({
    //           where: { FSDId: floor.FSDId },
    //           raw: true,
    //         });

    //         const result = await FloorSubmissionDetails.update(
    //           updateDataWithoutFSDId,
    //           {
    //             where: { FSDId: floor.FSDId },
    //           }
    //         );

    //         console.log(result, 'Floor update result');
    //         responses.updated = true;

    //         // 🕒 Add change history after update
    //         await logChanges(
    //           'FloorSubmissionDetails',
    //           existingFloor.OwnerID,
    //           oldRecord,
    //           updateDataWithoutFSDId,
    //           'FloorSubmissionDetails',
    //           req.user?.id || 0
    //         );
    //       } else {
    //         // Create new record
    //         const { Insert, Update, Delete, ...newData } = cleanedDetail;
    //         await PropertyDetailsNew.create({
    //           ...newData,
    //           OwnerID: validOwnerID,
    //         });
    //         responses.created = true;
    //         console.log(
    //           `🆕 Created PropertyDetailsNew for OwnerID ${validOwnerID}`,
    //           newData
    //         );
    //       }
    //     } catch (err) {
    //       console.error(
    //         '❌ Error processing PropertyDetailsNew entry:',
    //         err,
    //         detail
    //       );
    //       throw err;
    //     }
    //   }
    // }
    // ===== 2️⃣ Upsert PropertyDetailsNew =====
    if (
      Array.isArray(PropertyInfo.propertyDetailsNew) &&
      PropertyInfo.propertyDetailsNew.length > 0 &&
      PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !==
      'open plot'
    ) {
      for (const detail of PropertyInfo.propertyDetailsNew) {
        console.log(detail, 'new object to be sent');

        if (!detail || typeof detail !== 'object') continue;

        try {
          // ✅ Determine valid OwnerID
          const validOwnerID =
            newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;
          if (!validOwnerID || validOwnerID === 0) {
            console.warn(
              '⚠️ Skipping insert — no valid OwnerID for detail:',
              detail
            );
            continue;
          }

          // ✅ Clean detail: empty strings → null
          const cleanedDetail = Object.fromEntries(
            Object.entries(detail)
              .filter(([_, value]) => value !== undefined && value !== null)
              .map(([key, value]) => [key, value === '' ? null : value])
          );

          // ✅ Normalize numeric fields
          const normalize = (val) => {
            if (val === '' || val === undefined || val === null) return null;
            return Number(val.toString().replace(/,/g, ''));
          };
          cleanedDetail.BuildUpAreaSqFeet = normalize(
            cleanedDetail.BuildUpAreaSqFeet
          );
          cleanedDetail.BuildUpAreaSqMeter = normalize(
            cleanedDetail.BuildUpAreaSqMeter
          );

          // ✅ UPSERT: check if PDNId exists
          let existingRecord = null;
          if (detail.PDNId) {
            existingRecord = await PropertyDetailsNew.findOne({
              where: { PDNId: detail.PDNId },
              raw: true,
            });
          }

          if (existingRecord) {
            // ✏️ UPDATE existing record
            const { Insert, Update, Delete, ...updateData } = cleanedDetail;
            const { PDNId, ...updateDataWithoutPDNId } = updateData;

             updateDataWithoutPDNId.UpdatedBy = userId
            updateDataWithoutPDNId.UpdatedDate = new Date()
            // 🕒 Store old record before update
            const oldRecord = { ...existingRecord };

            await PropertyDetailsNew.update(updateDataWithoutPDNId, {
              where: { PDNId: detail.PDNId },
            });
            responses.updated = true;

            // 🧾 Log only updates (not inserts)
            await logChanges(
              PropertyDetailsNew, // Sequelize model
              validOwnerID, // OwnerID
              oldRecord, // Old data
              updateDataWithoutPDNId,
              'PropertyDetailsNew', // New data
              userId
            );

            console.log(
              `✏️ Updated PropertyDetailsNew PDNId=${detail.PDNId}`,
              updateDataWithoutPDNId
            );
          } else {
            // 🆕 CREATE new record (no logging)
            const { Insert, Update, Delete, ...newData } = cleanedDetail;
             cleanedDetail.CreatedBy = userId
            cleanedDetail.CreatedDate = new Date()
             cleanedDetail.UpdatedBy = userId
            cleanedDetail.UpdatedDate = new Date()

            await PropertyDetailsNew.create({
              ...newData,
              OwnerID: validOwnerID,
            });
            responses.created = true;

            console.log(
              `🆕 Created PropertyDetailsNew for OwnerID ${validOwnerID}`,
              newData
            );
          }
        } catch (err) {
          console.error(
            '❌ Error processing PropertyDetailsNew entry:',
            err,
            detail
          );
          throw err;
        }
      }
    }

    // -------------------- FloorSubmissionDetails --------------------
    if (
      Array.isArray(PropertyInfo.floorSubmissionDetails) &&
      PropertyInfo.floorSubmissionDetails.length > 0 &&
      PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !==
      'open plot'
    ) {
      for (const detail of PropertyInfo.floorSubmissionDetails) {
        if (!detail || typeof detail !== 'object') continue;

        // 🚫 Skip floors linked to deleted PropertyDetailsNew
        if (
          Array.isArray(DeletePropertyDetailsNew) &&
          DeletePropertyDetailsNew.includes(detail.PDNId)
        ) {
          console.log(`⚠️ Skipping floor for deleted PDNId ${detail.PDNId}`);
          continue;
        }

        try {
          const validOwnerID =
            newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;

          if (!validOwnerID || validOwnerID === 0) {
            console.warn('⚠️ Skipping floor row — no valid OwnerID', detail);
            continue;
          }

          // 🔗 Assign PDNId automatically if missing
          if (!detail.PDNId) {
            let matchingProperty = PropertyInfo.propertyDetailsNew.find(
              (p) => p.OwnerID === validOwnerID
            );

            if (matchingProperty && matchingProperty.PDNId) {
              detail.PDNId = matchingProperty.PDNId;
            } else {
              // detail.PDNId
              console.warn('⚠️ No PDNId provided for floor detail:', detail);

              // Add temporary PropertyDetailsNew row to satisfy FK
              PropertyInfo.propertyDetailsNew.push({
                PDNId: detail.PDNId,
                OwnerID: validOwnerID,
                Insert: true,
              });

              // console.log(
              //   `🆕 Generated PDNId ${newPDNId} and added PropertyDetailsNew row`
              // );
            }
          }

          // 🧹 Clean data: empty string → null
          const cleanedDetail = Object.fromEntries(
            Object.entries(detail)
              .filter(([_, value]) => value !== undefined && value !== null)
              .map(([key, value]) => [key, value === '' ? null : value])
          );

          // 🔢 Convert numeric fields
          const numericFields = [
            'Length',
            'Width',
            'Height',
            'Area',
            'TotalArea',
            'SmallBase',
            'LargeBase',
            'Radius',
            'length_a',
            'length_b',
            'length_c',
          ];
          numericFields.forEach((field) => {
            if (
              cleanedDetail[field] !== undefined &&
              cleanedDetail[field] !== null
            ) {
              cleanedDetail[field] = Number(cleanedDetail[field]) || 0;
            }
          });

          // ❌ Delete rows in bulk (from DeletedFSDId array)
          if (
            Array.isArray(DeleteFloorSubmissionDetails) &&
            DeleteFloorSubmissionDetails.length > 0
          ) {
            for (const FSDId of DeleteFloorSubmissionDetails) {
              await FloorSubmissionDetails.destroy({ where: { FSDId } });
              console.log('❌ Deleted FloorSubmissionDetails by FSDId:', FSDId);
              responses.updated = true;
            }
          }

          // 🗑️ Delete if flagged
          if (detail.Delete) {
            if (detail.FSDId) {
              await FloorSubmissionDetails.destroy({
                where: { FSDId: Number(detail.FSDId) },
              });
              console.log(
                `🗑️ Deleted FloorSubmissionDetails by FSDId ${detail.FSDId}`
              );
            }
            responses.deleted = true;
            continue;
          }

          // ✏️ Update / Insert (UPSERT)
          if (detail.FSDId) {
            const existingFloor = await FloorSubmissionDetails.findOne({
              where: { FSDId: detail.FSDId },
            });
            // if (existingFloor) {
            //   const { Insert, Update, Delete, ...updateData } = cleanedDetail;
            //   updateData.OwnerID = validOwnerID; // ✅ force OwnerID
            //   await FloorSubmissionDetails.update(updateData, {
            //     where: { FSDId: detail.FSDId },
            //   });
            //   responses.updated = true;
            //   console.log(
            //     `✏️ Updated FloorSubmissionDetails FSDId=${detail.FSDId}`,
            //     updateData
            //   );
            // }
            if (existingFloor) {
              const { Insert, Update, Delete, ...updateData } = cleanedDetail;
              updateData.OwnerID = validOwnerID; // ✅ force OwnerID
               updateData.UpdatedBy = userId;
              updateData.UpdatedDate = new Date();

              // 🕒 Fetch old record before update
              const oldRecord = await FloorSubmissionDetails.findOne({
                where: { FSDId: detail.FSDId },
                raw: true,
              });

              await FloorSubmissionDetails.update(updateData, {
                where: { FSDId: detail.FSDId },
              });

              responses.updated = true;
              console.log(
                `✏️ Updated FloorSubmissionDetails FSDId=${detail.FSDId}`,
                updateData
              );

              // 🧾 Log change history after successful update
              await logChanges(
                FloorSubmissionDetails, // Sequelize model
                validOwnerID,
                oldRecord,
                updateData,
                'FloorSubmissionDetails',
                userId
              );
            } else {
              const { Insert, Update, Delete, ...newData } = cleanedDetail;

              // newData.CreatedBy = GlobalUserID;
              newData.CreatedDate = new Date()
              console.log(newData, 'floor id');
              await FloorSubmissionDetails.create({
                ...newData,
                OwnerID: validOwnerID,
              });
              responses.created = true;
              console.log(
                `🆕 Created FloorSubmissionDetails for OwnerID=${validOwnerID}`,
                newData
              );
            }
          } else if (detail.Insert) {
            const { Insert, Update, Delete, ...newData } = cleanedDetail;
            console.log(newData, 'insert');
            // newData.CreatedBy = GlobalUserID;
            newData.CreatedDate = new Date()

            await FloorSubmissionDetails.create({
              ...newData,
              OwnerID: validOwnerID,
            });
            responses.created = true;
            console.log(
              `🆕 Created FloorSubmissionDetails for OwnerID=${validOwnerID}`,
              newData
            );
          }
        } catch (err) {
          console.error(
            '❌ Error processing floorSubmissionDetails:',
            err,
            detail
          );
          throw err;
        }
      }
    }

    console.log(
      PropertyInfo.floorSubmissionDetailsMinusData,
      'minusData from ui'
    );
    // -------------------- FloorSubmissionDetailsMinusData --------------------
    if (
      Array.isArray(PropertyInfo.floorSubmissionDetailsMinusData) &&
      PropertyInfo.floorSubmissionDetailsMinusData.length > 0 &&
      PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !==
      'open plot'
    ) {
      for (const detail of PropertyInfo.floorSubmissionDetailsMinusData) {
        if (!detail || typeof detail !== 'object') continue;

        // 🚫 Skip minus-data rows linked to deleted PropertyDetailsNew
        if (
          Array.isArray(DeletePropertyDetailsNew) &&
          DeletePropertyDetailsNew.includes(detail.PDNId)
        ) {
          console.log(
            `⚠️ Skipping minus-data for deleted PDNId ${detail.PDNId}`
          );
          continue;
        }

        const validOwnerID =
          newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;

        if (!validOwnerID || validOwnerID === 0) {
          console.warn('⚠️ Skipping minus row — no valid OwnerID', detail);
          continue;
        }

        // 🧹 Clean data
        const cleanedDetail = Object.fromEntries(
          Object.entries(detail)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, value === '' ? null : value])
        );

        // 🔢 Convert numeric fields
        const numericFields = [
          'Length',
          'Width',
          'Height',
          'Area',
          'TotalArea',
          'SmallBase',
          'LargeBase',
          'Radius',
          'length_a',
          'length_b',
          'length_c',
        ];
        numericFields.forEach((field) => {
          if (
            cleanedDetail[field] !== undefined &&
            cleanedDetail[field] !== null
          ) {
            cleanedDetail[field] = parseFloat(cleanedDetail[field]) || 0;
          }
        });

        // 🔗 Only check parent if FSDId exists
        if (cleanedDetail.FSDId && cleanedDetail.FSDId !== 0) {
          const parentFloor = await FloorSubmissionDetails.findOne({
            where: { FSDId: cleanedDetail.FSDId },
          });
          if (!parentFloor) {
            console.warn(
              `⚠️ Parent FloorSubmissionDetails not found for FSDId ${cleanedDetail.FSDId}, skipping minus data`
            );
            continue;
          }
        }

        // ❌ Delete rows in bulk (from DeletedFSDMDId array)
        if (
          Array.isArray(DeleteFloorSubmissionMinusDetails) &&
          DeleteFloorSubmissionMinusDetails.length > 0
        ) {
          for (const FSDMDId of DeleteFloorSubmissionMinusDetails) {
            await FloorSubmissionDetailsMinusData.destroy({
              where: { FSDMDId },
            });
            console.log(
              '❌ Deleted FloorSubmissionDetailsMinusData by FSDMDId:',
              FSDMDId
            );
            responses.updated = true;
          }
        }

        // 🗑️ Delete if flagged
        if (detail.Delete) {
          if (detail.FSDMDId) {
            await FloorSubmissionDetailsMinusData.destroy({
              where: { FSDMDId: Number(detail.FSDMDId) },
            });
            console.log(
              `🗑️ Deleted FloorSubmissionDetailsMinusData FSDMDId=${detail.FSDMDId}`
            );
          }
          responses.deleted = true;
          continue;
        }

        // ✏️ Update / Insert (UPSERT)
        if (detail.FSDMDId) {
          const existingMinus = await FloorSubmissionDetailsMinusData.findOne({
            where: { FSDMDId: detail.FSDMDId },
          });
          // if (existingMinus) {
          //   const { Insert, Update, Delete, ...updateData } = cleanedDetail;
          //   updateData.OwnerID = validOwnerID; // ✅ force OwnerID
          //   await FloorSubmissionDetailsMinusData.update(updateData, {
          //     where: { FSDMDId: detail.FSDMDId },
          //   });
          //   responses.updated = true;
          //   console.log(
          //     `✏️ Updated FloorSubmissionDetailsMinusData FSDMDId=${detail.FSDMDId}`,
          //     updateData
          //   );
          // }
          if (existingMinus) {
            const { Insert, Update, Delete, ...updateData } = cleanedDetail;
            updateData.OwnerID = validOwnerID; // ✅ force OwnerID

             updateData.UpdatedBy = userId;
            updateData.UpdatedDate = new Date();
            // 🕒 Fetch old record before update
            const oldRecord = await FloorSubmissionDetailsMinusData.findOne({
              where: { FSDMDId: detail.FSDMDId },
              raw: true,
            });

            await FloorSubmissionDetailsMinusData.update(updateData, {
              where: { FSDMDId: detail.FSDMDId },
            });

            responses.updated = true;
            console.log(
              `✏️ Updated FloorSubmissionDetailsMinusData FSDMDId=${detail.FSDMDId}`,
              updateData
            );

            // 🧾 Log change history after successful update
            await logChanges(
              FloorSubmissionDetailsMinusData,
              validOwnerID,
              oldRecord,
              updateData,
              'FloorSubmissionDetailsMinusData',
              userId
            );
          } else {
            const { Insert, Update, Delete, ...newData } = cleanedDetail;
            // newData.CreatedBy = GlobalUserID;
            newData.CreatedDate = new Date();
            await FloorSubmissionDetailsMinusData.create({
              ...newData,
              OwnerID: validOwnerID,
            });
            responses.created = true;
            console.log(
              `🆕 Created FloorSubmissionDetailsMinusData for OwnerID=${validOwnerID}`,
              newData
            );
          }
        } else if (detail.Insert) {
          const { Insert, Update, Delete, ...newData } = cleanedDetail;
          // newData.CreatedBy = GlobalUserID;
          newData.CreatedDate = new Date();
          await FloorSubmissionDetailsMinusData.create({
            ...newData,
            OwnerID: validOwnerID,
          });
          responses.created = true;
          console.log(
            `🆕 Created FloorSubmissionDetailsMinusData for OwnerID=${validOwnerID}`,
            newData
          );
        }
      }
    }

    // :x: Delete rows in bulk (from DeletedFSDId array)
    if (
      Array.isArray(DeleteFloorSubmissionDetails) &&
      DeleteFloorSubmissionDetails.length > 0
    ) {
      console.log('delete floor submission data');
      for (const FSDId of DeleteFloorSubmissionDetails) {
        try {
          console.log(':x: Deleting FloorSubmissionDetails by FSDId:', FSDId);
          // :white_check_mark: Delete children first
          await FloorSubmissionDetailsMinusData.destroy({ where: { FSDId } });
          // :white_check_mark: Then delete parent
          await FloorSubmissionDetails.destroy({ where: { FSDId } });
          responses.updated = true;
        } catch (err) {
          console.error(':x: Error deleting FSDId:', FSDId, err);
          throw err;
        }
      }
    }
    // :x: Delete rows in bulk (from DeletedFSDMDId array)
    if (
      Array.isArray(DeleteFloorSubmissionMinusDetails) &&
      DeleteFloorSubmissionMinusDetails.length > 0
    ) {
      for (const FSDMDId of DeleteFloorSubmissionMinusDetails) {
        try {
          console.log(
            ':x: Deleting FloorSubmissionMinusDetailsMinus by FSDMDId:',
            FSDMDId
          );
          await FloorSubmissionDetailsMinusData.destroy({ where: { FSDMDId } }); // :white_check_mark: Correct model
          responses.updated = true;
        } catch (err) {
          console.error(':x: Error deleting FSDMDId:', FSDMDId, err);
          throw err;
        }
      }
    }

    // ===== TaxPendingDetails =====

    // tax pending
    if (
      Array.isArray(PropertyInfo.pendingTaxes) &&
      PropertyInfo.pendingTaxes.length > 0
    ) {
      console.log('Processing pendingTaxes:', PropertyInfo.pendingTaxes);
      for (const raw of PropertyInfo.pendingTaxes) {
        if (!raw || typeof raw !== 'object') {
          console.warn('⚠️ Skipping invalid pendingTaxes entry:', raw);
          continue;
        }

        console.log('Processing pendingTaxes 2:', PropertyInfo.pendingTaxes);

        try {
          const {
            TPDID,
            Insert,
            Update,
            Delete,
            PendingYear,
            ...cleanedDetail
          } = raw;

          let OwnerID = ownerID || 0;
          console.log('cleanedDetail:', ownerID);
          /* ---------- New Owner: insert with new OwnerID ---------- */
          if (OwnerID === 0) {
            OwnerID = newOwnerID;
            // cleanedDetail.CreatedBy = GlobalUserID;
            cleanedDetail.CreatedDate = new Date()
            const taxpending = await TaxPendingDetails.create({
              ...cleanedDetail,
              PendingYear,
              OwnerID: OwnerID,
            });
            if (newOwnerID !== 0) {
              responses.created = true;
            } else {
              responses.updated = true;
            }

            continue;
          } else if (Insert) {
            /* ---------- Existing Owner ---------- */
            console.log('----insert is running 2');
            // cleanedDetail.CreatedBy = GlobalUserID;
            cleanedDetail.CreatedDate = new Date()
            PropertyInfo.pendingTaxes[0].OwnerID = OwnerID;
            await TaxPendingDetails.create({
              ...cleanedDetail,
              PendingYear,
              OwnerID: PropertyInfo.propertyMast.OwnerID,
            });

            responses.updated = true;
          }

          // if (Update) {
          //   console.log(cleanedDetail, 'Processing  Tax pending details');
          //   await TaxPendingDetails.update(
          //     { ...cleanedDetail }, // PendingYear excluded
          //     {
          //       where: {
          //         TPDID: TPDID,
          //         OwnerID: OwnerID,
          //       },
          //     }
          //   );

          //   responses.updated = true;
          // }
          if (Update) {
            console.log(cleanedDetail, 'Processing  Tax pending details');


            // 🕒 Fetch old record before update
            const oldRecord = await TaxPendingDetails.findOne({
              where: {
                TPDID: TPDID,
                OwnerID: OwnerID,
              },
              raw: true,
            });
            cleanedDetail.UpdatedBy = userId;
            cleanedDetail.UpdatedDate = new Date()

            await TaxPendingDetails.update(
              { ...cleanedDetail }, // PendingYear excluded
              {
                where: {
                  TPDID: TPDID,
                  OwnerID: OwnerID,
                },
              }
            );

            responses.updated = true;

            // 🧾 Log change history after update
            await logChanges(
              TaxPendingDetails,
              OwnerID,
              oldRecord,
              cleanedDetail,
              'TaxPendingDetails',
              userId
            );
          }

          if (Delete) {
            await TaxPendingDetails.destroy({
              where: {
                TPDID: TPDID,
                OwnerID: OwnerID,
              },
            });

            responses.updated = true;
          }
          console.log(
            'Processing pendingTaxes Ended:',
            PropertyInfo.pendingTaxes
          );
        } catch (err) {
          console.error(
            '❌ Error processing taxPendingDetails entry:',
            err,
            raw
          );
          throw err;
        }
      }
    }

    // 🟢 Handle Joint Owner Details Data
    const primaryOwnerjoint = PropertyInfo.jointOwnerDetails.find(
      (entry) => entry.isPrime === true
    );

    if (primaryOwnerjoint) {
      // const userId = Number(req.user?.id) || 0;

      // Step 1️⃣ Clear isPrime for all existing joint owners of this property (only if property already exists)
      if (primaryOwnerjoint.OwnerID && primaryOwnerjoint.OwnerID !== 0) {
        const oldPrimeOwners = await JoinOwnerDetails.findAll({
          where: { OwnerID: primaryOwnerjoint.OwnerID },
          raw: true,
        });

        await JoinOwnerDetails.update(
          { isPrime: false },
          { where: { OwnerID: primaryOwnerjoint.OwnerID } }
        );

        // 🧾 Log all isPrime reset changes
        for (const oldRec of oldPrimeOwners) {
          const newRec = { ...oldRec, isPrime: false };
          await logChanges(
            JoinOwnerDetails,
            oldRec.OwnerID,
            oldRec,
            newRec,
            'JoinOwnerDetails',
            userId
          );
        }
      }

      // Step 2️⃣ Set the new prime owner (if existing JODId)
      if (primaryOwnerjoint.JODId) {
        const oldPrime = await JoinOwnerDetails.findOne({
          where: { JODId: primaryOwnerjoint.JODId },
          raw: true,
        });

        const primeUpdateData = { ...primaryOwnerjoint, isPrime: true };

        await JoinOwnerDetails.update(primeUpdateData, {
          where: { JODId: primaryOwnerjoint.JODId },
        });

        const newPrimeRec = await JoinOwnerDetails.findOne({
          where: { JODId: primaryOwnerjoint.JODId },
          raw: true,
        });

        await logChanges(
          JoinOwnerDetails,
          primaryOwnerjoint.OwnerID,
          oldPrime,
          newPrimeRec,
          'JoinOwnerDetails',
          userId
        );
      }

      // Step 3️⃣ Insert / Update Joint Owner Details
      for (let jointOwner of PropertyInfo.jointOwnerDetails) {
        if (!jointOwner || typeof jointOwner !== 'object') {
          console.warn('⚠️ Skipping invalid jointOwner entry:', jointOwner);
          continue;
        }

        try {
          let ownerID = jointOwner.OwnerID;

          // 🔹 New property (replace temporary OwnerID 0)
          if (ownerID == 0) {
            ownerID = newOwnerID;
          }

          // 🔹 INSERT new joint owner
          if (jointOwner.Insert) {
            const { Insert, Update, JODId, ...newDetails } = jointOwner;

            // Avoid duplicate entries
            const existingOwner = await JoinOwnerDetails.findOne({
              where: {
                OwnerID: ownerID,
                OwnerName: newDetails.OwnerName?.trim(),
                OwnerPatta: newDetails.OwnerPatta?.trim() || null,
                BuildingOrFlatNo: newDetails.BuildingOrFlatNo?.trim() || null,
                BuildingOrShopName:
                  newDetails.BuildingOrShopName?.trim() || null,
              },
            });

            if (existingOwner) {
              console.log(
                '⚠️ Duplicate owner entry detected, skipping insert:',
                newDetails.OwnerName
              );
              continue;
            }

            const createdRec = await JoinOwnerDetails.create({
              ...newDetails,
              OwnerID: ownerID,
              CreatedBy: userId,              
              CreatedDate: new Date(), 
            });
            await logChanges(
              JoinOwnerDetails,
              ownerID,
              null,
              createdRec,
              'JoinOwnerDetails',
              userId
            );

            responses.updated = true;
          }

          // 🔹 UPDATE existing joint owner
          if (jointOwner.Update) {
            const JODId = jointOwner.JODId;
            const { Insert, Update, Delete, ...updateData } = jointOwner;

            const oldRecord = await JoinOwnerDetails.findOne({
              where: { JODId },
              raw: true,
            });

            // Merge all new data (not just isPrime)
            const newData = {
              ...updateData,
              isPrime: jointOwner.isPrime ?? false,
               UpdatedBy: userId,              
               UpdatedDate: new Date(), 
            };

            await JoinOwnerDetails.update(newData, { where: { JODId } });

            const newRecord = await JoinOwnerDetails.findOne({
              where: { JODId },
              raw: true,
            });

            await logChanges(
              JoinOwnerDetails,
              ownerID,
              oldRecord,
              newRecord,
              'JoinOwnerDetails',
              userId
            );

            responses.updated = true;
          }
        } catch (err) {
          console.error(
            '❌ Error while processing jointOwnerDetails entry:',
            err,
            jointOwner
          );
          throw err;
        }
      }

      // Step 4️⃣ Handle deletions
      if (
        Array.isArray(DeleteJointOwnerDetails) &&
        DeleteJointOwnerDetails.length > 0
      ) {
        for (const JODId of DeleteJointOwnerDetails) {
          try {
            await JoinOwnerDetails.destroy({ where: { JODId } });
            responses.updated = true;
          } catch (err) {
            console.error('❌ Error deleting JODId:', JODId, err);
            throw err;
          }
        }
      }
    }

    // Handle PropertySocialDetails data
    // if (PropertyInfo.propertySocialDetails) {
    //   let ownerID = PropertyInfo.propertySocialDetails.OwnerID;
    //   if (ownerID == 0) {
    //     PropertyInfo.propertySocialDetails.OwnerID = newOwnerID;
    //     console.log(
    //       '🧾 Final payload to insert socila lll:',
    //       PropertyInfo.propertySocialDetails
    //     );
    //     await PropertySocialDetails.create(PropertyInfo.propertySocialDetails);
    //     responses.created = true;
    //   } else {
    //     await PropertySocialDetails.update(PropertyInfo.propertySocialDetails, {
    //       where: { OwnerID: ownerID },
    //     });
    //     responses.updated = true;
    //   }
    // }

    if (PropertyInfo.propertySocialDetails) {
      let ownerID = PropertyInfo.propertySocialDetails.OwnerID;

      if (ownerID == 0) {
        PropertyInfo.propertySocialDetails.OwnerID = newOwnerID;
        console.log(
          '🧾 Final payload to insert socila lll:',
          PropertyInfo.propertySocialDetails
        );

 const createPayload = {
      ...PropertyInfo.propertySocialDetails,
      CreatedBy: userId,           // ✅ added
      CreatedDate: new Date(),     // ✅ added
    };


    console.log('🧾 Final payload to insert social:', createPayload);



        await PropertySocialDetails.create(createPayload);
        responses.created = true;
      } else {
        // 🕒 Fetch old record before update
        const oldRecord = await PropertySocialDetails.findOne({
          where: { OwnerID: ownerID },
          raw: true,
        });

         const updatePayload = {
      ...PropertyInfo.propertySocialDetails,
      UpdatedBy: userId,         
      UpdatedDate: new Date(),    
    };
        await PropertySocialDetails.update(updatePayload, {
          where: { OwnerID: ownerID },
        });
        responses.updated = true;

        // 🧾 Log change history after update
        await logChanges(
          PropertySocialDetails, // ✅ pass model, not string
          ownerID,
          oldRecord,
          PropertyInfo.propertySocialDetails,
          'PropertySocialDetails',
          userId
        );
      }
    }

    // Handle DrainFlatRate data
    // if (PropertyInfo.drainFlatRate) {
    //   let OwnerID =
    //     PropertyInfo.drainFlatRate.OwnerID || PropertyInfo.propertyMast.OwnerID; // Derive OwnerID
    //   console.log(OwnerID, 'new rate id');

    //   if (OwnerID == 0) {
    //     PropertyInfo.drainFlatRate.OwnerID = newOwnerID;

    //     console.log(
    //       '🧾 Final payload to insert drain:',
    //       PropertyInfo.drainFlatRate
    //     );
    //     await ApplyTaxesMaster.create(PropertyInfo.drainFlatRate);
    //     responses.created = true;
    //   } else {
    //     await ApplyTaxesMaster.update(PropertyInfo.drainFlatRate, {
    //       where: { OwnerID: OwnerID },
    //     });

    //     responses.updated = true;
    //     const oldDrain = await ApplyTaxesMaster.findOne({
    //       where: { OwnerID },
    //       raw: true,
    //     });
    //     console.log(oldDrain, PropertyInfo.drainFlatRate, 'drain data');
    //     await logChanges(
    //       ApplyTaxesMaster,
    //       OwnerID,
    //       oldDrain,
    //       PropertyInfo.drainFlatRate,
    //       'ApplyTaxesMaster',
    //       userId
    //     );
    //   }
    // }
    if (PropertyInfo.drainFlatRate) {
      let OwnerID =
        PropertyInfo.drainFlatRate.OwnerID || PropertyInfo.propertyMast.OwnerID;

      console.log('ownerID:', OwnerID);

      if (OwnerID == 0) {
        PropertyInfo.drainFlatRate.OwnerID = newOwnerID;

        await ApplyTaxesMaster.create(PropertyInfo.drainFlatRate);
        responses.created = true;
      } else {
        // 1️⃣ FETCH OLD BEFORE UPDATE
        const oldDrain = await ApplyTaxesMaster.findOne({
          where: { OwnerID },
          raw: true,
        });

        // 2️⃣ UPDATE RECORD
        await ApplyTaxesMaster.update(PropertyInfo.drainFlatRate, {
          where: { OwnerID },
        });

        responses.updated = true;

        // 3️⃣ FETCH NEW AFTER UPDATE
        const newDrain = await ApplyTaxesMaster.findOne({
          where: { OwnerID },
          raw: true,
        });

        console.log('old:', oldDrain, 'new:', newDrain);

        // 4️⃣ LOG CHANGES PROPERLY
        await logChanges(
          ApplyTaxesMaster,
          OwnerID,
          oldDrain,
          newDrain,
          'ApplyTaxesMaster',
          userId
        );
      }
    }

    // Handle OldPropertyMast data

    if (PropertyInfo.oldPropertyMast) {
      let ownerID = PropertyInfo.oldPropertyMast.OwnerID || 0;
      console.log(ownerID, 'ownerID for oldPropertyMast');
      if (PropertyInfo.oldPropertyMast.OldRV === '') {
        PropertyInfo.oldPropertyMast.OldRV = null;
      }
      if (PropertyInfo.oldPropertyMast.OldPropertyTax === '') {
        PropertyInfo.oldPropertyMast.OldPropertyTax = null;
      }
      if (PropertyInfo.oldPropertyMast.OldTotalTax === '') {
        PropertyInfo.oldPropertyMast.OldTotalTax = null;
      }
      if (PropertyInfo.oldPropertyMast.OldALV === '') {
        PropertyInfo.oldPropertyMast.OldALV = null;
      }
      if (PropertyInfo.oldPropertyMast.OldPlotArea === '') {
        PropertyInfo.oldPropertyMast.OldPlotArea = null;
      }
      if (PropertyInfo.oldPropertyMast.OldToiletNo === '') {
        PropertyInfo.oldPropertyMast.OldToiletNo = null;
      }
      if (PropertyInfo.oldPropertyMast.OldTotalRooms === '') {
        PropertyInfo.oldPropertyMast.OldTotalRooms = null;
      }

      // If original OwnerID is 0, fallback to newOwnerID or propertyMast.OwnerID
      if (ownerID === 0) {
        console.log(newOwnerID, 'newOwnerID for oldPropertyMast');
        ownerID = newOwnerID || PropertyInfo.propertyMast.OwnerID;
        PropertyInfo.oldPropertyMast.OwnerID = ownerID;
      }

      // Check if a record with this OwnerID already exists
      const existingRecord = await OldPropertyMast.findOne({
        where: { OwnerID: ownerID },
      });


      if (existingRecord) {
        // Update existing record
         PropertyInfo.oldPropertyMast.UpdatedBy = userId;
        PropertyInfo.oldPropertyMast.UpdatedDate = new Date()
        await OldPropertyMast.update(PropertyInfo.oldPropertyMast, {
          where: { OwnerID: ownerID },
        });
        console.log('✏️ Updated existing OldPropertyMast:', ownerID);
        responses.updated = true;
        await logChanges(
          OldPropertyMast,
          ownerID,
          existingRecord,
          PropertyInfo.oldPropertyMast,
          'OldPropertyMast',
          userId
        );
      } else {
        // Create new record
        // PropertyInfo.oldPropertyMast.CreatedBy = GlobalUserID;
        PropertyInfo.oldPropertyMast.CreatedDate = new Date()
        await OldPropertyMast.create(PropertyInfo.oldPropertyMast);
        console.log('✅ Created new OldPropertyMast:', ownerID);

        // Count it as update if newOwnerID is 0, else it's a creation
        if (newOwnerID === 0) {
          responses.updated = true;
        } else {
          responses.created = true;
        }
      }
    }

    //Handle OldTaxes data
    if (PropertyInfo.oldTaxes) {
      let ownerID = PropertyInfo.propertyMast.OwnerID || 0;
      console.log(ownerID, 'ownerID from propertyMast');

      // First check if there's an existing oldTaxes record for this ownerID
      const existingOldTaxes = await OldTaxes.findOne({
        where: { OwnerID: ownerID },
      });

      if (existingOldTaxes) {
         PropertyInfo.oldTaxes.UpdatedBy = userId;
        PropertyInfo.oldTaxes.UpdatedDate = new Date()
        await OldTaxes.update(
          {
            PropertyTax: PropertyInfo.oldTaxes.PropertyTax,
            EducationTax: PropertyInfo.oldTaxes.EducationTax,
            EmploymentTax: PropertyInfo.oldTaxes.EmploymentTax,
            TreeCess: PropertyInfo.oldTaxes.TreeCess,
            FireCess: PropertyInfo.oldTaxes.FireCess,
            SpEducationTax: PropertyInfo.oldTaxes.SpEducationTax,
            MajorBuilding: PropertyInfo.oldTaxes.MajorBuilding,
            LightCess: PropertyInfo.oldTaxes.LightCess,
            RoadCess: PropertyInfo.oldTaxes.RoadCess,
            DrainCess: PropertyInfo.oldTaxes.DrainCess,
            SewageDisposalCess: PropertyInfo.oldTaxes.SewageDisposalCess,
            Sanitation: PropertyInfo.oldTaxes.Sanitation,
            SpWaterCess: PropertyInfo.oldTaxes.SpWaterCess,
            WaterBenefit: PropertyInfo.oldTaxes.WaterBenefit,
            WaterBill: PropertyInfo.oldTaxes.WaterBill,
            Interest: PropertyInfo.oldTaxes.Interest,
            TaxTotal: PropertyInfo.oldTaxes.TaxTotal,
            OldTaxYear: PropertyInfo.oldTaxes.OldTaxYear,
            Tax1: PropertyInfo.oldTaxes.Tax1,
          },
          { where: { OwnerID: ownerID } }
        );
        console.log('✏️ Updated existing oldTaxes:', ownerID);
        responses.updated = true;
        await logChanges(
          OldTaxes,
          ownerID,
          existingOldTaxes,
          PropertyInfo.oldTaxes,
          'OldTaxes',
          userId
        );
      } else {
        // No existing record, need to create one
        if (ownerID === 0 && newOwnerID !== 0) {
          PropertyInfo.oldTaxes.OwnerID = newOwnerID;
          console.log(newOwnerID, 'Using newOwnerID for creation');
        } else {
          PropertyInfo.oldTaxes.OwnerID = ownerID;
          console.log(ownerID, 'Using OwnerID (even if 0) for creation');
        }
        // PropertyInfo.oldTaxes.CreatedBy = GlobalUserID;
        PropertyInfo.oldTaxes.CreatedDate = new Date();
        await OldTaxes.create(PropertyInfo.oldTaxes);
        console.log('📌 Created new oldTaxes:', PropertyInfo.oldTaxes.OwnerID);
        if (newOwnerID === 0) {
          responses.updated = true;
        } else {
          responses.created = true;
        }
      }
    }

    // image property
    //   // image property
    // Check if ownerID is provided

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // if (!ownerID) {
    //   return res.status(400).json({ message: ':x: OwnerID is required' });
    // }

    let WardNo = PropertyInfo.propertyMast.NewWardNo;

    let PropertyNo = PropertyInfo.propertyMast.NewPropertyNo;

    let PartitionNo = PropertyInfo.propertyMast.NewPartitionNo;

    // :white_check_mark: Define paths
    const BASE_IMAGE_PATH = '//192.168.5.244/e$/NTIS_New_Images'; // Change base path
    const COMMON_IMAGE_PATH = path.join(BASE_IMAGE_PATH, 'Image/Photo');
    const PLAN_IMAGE_PATH = path.join(BASE_IMAGE_PATH, 'Image/Plan');
    // Check directory access
    fs.access(
      COMMON_IMAGE_PATH,
      fs.constants.R_OK | fs.constants.W_OK,
      (err) => {
        if (err) {
          console.error(':x: No access to:', COMMON_IMAGE_PATH);
          console.error(err.message);
        } else {
          console.log(
            ':white_check_mark: Controller has read/write access to:',
            COMMON_IMAGE_PATH
          );
        }
      }
    );
    // :white_check_mark: Define file mappings
    const fileMappings = {
      PropertyPathA: {
        suffix: 'A',
        blobField: 'PropertyPhotoA',
        pathField: 'PropertyPathA',
      },
      PropertyPathB: {
        suffix: 'B',
        blobField: 'PropertyPhotoB',
        pathField: 'PropertyPathB',
      },
      PropertyPathC: {
        suffix: 'C',
        blobField: 'PropertyPhotoC',
        pathField: 'PropertyPathC',
      },
      PropertyPathD: {
        suffix: 'D',
        blobField: 'PropertyPhotoD',
        pathField: 'PropertyPathD',
      },
      PlanPath: {
        suffix: `${WardNo}-${PropertyNo}`,
        blobField: 'PlanPhoto',
        pathField: 'PlanPath',
        isPlan: true,
      },
    };
    let updateData = {};
    console.log('--------------------------------------------before object');
    // Loop over the uploaded files

    if (req.body.uploadedFiles) {
      for (const [key, fileArray] of Object.entries(req.body.uploadedFiles)) {
        const mapping = fileMappings[key];
        if (!mapping) {
          console.warn(`⚠️ Skipping unknown file key: ${key}`);
          continue;
        }

        const { suffix, pathField, isPlan } = mapping;
        const fileExt = isPlan ? '.WMF' : '.jpg';
        console.log(isPlan, 'isPlan');

        const existingData = await PropertyImageMast.findOne({
          where: { ownerid: ownerID },
        });

        if (!fileArray || Object.keys(fileArray).length === 0) {
          const currentPath = existingData?.[pathField];
          if (currentPath) {
            const fullPath = path.join(BASE_IMAGE_PATH, currentPath);
            if (fs.existsSync(fullPath)) {
              try {
                fs.unlinkSync(fullPath);
                console.log(`🗑️ Deleted existing file: ${fullPath}`);
              } catch (error) {
                console.error(`❌ Failed to delete file ${fullPath}:`, error);
              }
            }
          }

          updateData[pathField] = null;
          continue;
        }
        // console.log(fileArray, 'fileArray')

        try {
          if (
            typeof fileArray === 'string' &&
            fileArray.startsWith('data:image')
          ) {
            console.log('✅ Base64 image detected, processing...');

            const matches = fileArray.match(
              /^data:([A-Za-z-+/]+);base64,(.+)$/
            );
            if (!matches || matches.length !== 3) {
              console.warn('⚠️ Invalid base64 format');
              continue;
            }

            const decodedBuffer = Buffer.from(matches[2], 'base64');

            // 🛠 Filename setup
            const fileExt = isPlan ? '.wmf' : '.jpg';
            const newFilename = isPlan
              ? `${WardNo}-${PropertyNo}-Plan${fileExt}`
              : `${WardNo}-${PropertyNo}-${PartitionNo}-${suffix}${fileExt}`;

            const targetDir = isPlan ? PLAN_IMAGE_PATH : COMMON_IMAGE_PATH;
            const newFilePath = path.join(targetDir, newFilename);
            fs.mkdirSync(targetDir, { recursive: true });

            // 🔍 File size check
            const fileSizeMB = decodedBuffer.length / 1024 / 1024;

            if (isPlan) {
              if (fileSizeMB > 5) {
                console.error(
                  `❌ WMF file too large (${fileSizeMB.toFixed(
                    2
                  )} MB). Skipping.`
                );
                continue;
              }
              fs.writeFileSync(newFilePath, decodedBuffer);
              console.log(`✅ WMF file saved: ${newFilePath}`);
            } else {
              if (fileSizeMB <= 5) {
                fs.writeFileSync(newFilePath, decodedBuffer);
                console.log(`✅ JPEG saved (no compression): ${newFilePath}`);
              } else {
                let dimensions;
                try {
                  dimensions = sizeOf(decodedBuffer);
                } catch (dimErr) {
                  console.error('❌ Could not read image dimensions:', dimErr);
                  continue;
                }

                const { width, height } = dimensions;
                const scaledWidth = Math.round(width * 0.15);
                const scaledHeight = Math.round(height * 0.15);

                let finalBuffer = await sharp(decodedBuffer)
                  .resize(scaledWidth, scaledHeight)
                  .jpeg({ quality: 75 })
                  .toBuffer();

                if (finalBuffer.length > 5 * 1024 * 1024) {
                  console.warn(
                    `⚠️ Still too large (${(
                      finalBuffer.length /
                      1024 /
                      1024
                    ).toFixed(2)} MB), retrying...`
                  );
                  finalBuffer = await sharp(finalBuffer)
                    .jpeg({ quality: 60 })
                    .toBuffer();
                }

                if (finalBuffer.length > 5 * 1024 * 1024) {
                  console.error(
                    `❌ Still too large after compression. Skipping.`
                  );
                  continue;
                }

                fs.writeFileSync(newFilePath, finalBuffer);
                console.log(`✅ JPEG saved after compression: ${newFilePath}`);
              }
            }

            const relativePath = path
              .relative(BASE_IMAGE_PATH, newFilePath)
              .replace(/\\/g, '/');
            updateData[pathField] = relativePath;
            console.log(`📝 Saved relative path: ${relativePath}`);
          } else {
            console.warn(`⚠️ Skipping non-base64 item: ${key} `);
          }
        } catch (error) {
          console.error(`❌ Error processing file ${key}:`, error);
        }
      }
    }
    const imageRecord = await PropertyImageMast.findOne({
      where: { ownerid: ownerID },
    });
    console.log('Updated data:', updateData);
    if (imageRecord) {
      // :white_check_mark: Update existing record
       updateData.UpdatedBy = userId;
      updateData.UpdatedDate = new Date()
      const [rowsUpdated] = await PropertyImageMast.update(updateData, {
        where: { ownerid: ownerID },
      });
      if (rowsUpdated === 0) {
        console.error(':x: No rows updated. Possible constraints issue.');
      }
      console.log(
        ':white_check_mark: Database updated successfully:',
        rowsUpdated,
        'row(s) affected'
      );
      responses.updated = true;
    } else {
      newOwnerID === 0
        ? (newOwnerID = PropertyInfo.propertyMast.OwnerID)
        : newOwnerID;
      // updateData.CreatedBy = GlobalUserID;
      updateData.CreatedDate = new Date()
      const newImageEntry = await PropertyImageMast.create({
        ownerid: newOwnerID,
        ...updateData,
        CreatedBy: userId,
        CreatedDate: new Date(),
        UpdatedBy: userId,
        UpdatedDate: new Date(),
      });

      console.log(
        ':white_check_mark: New record created successfully:',
        newImageEntry
      );
      newOwnerID === 0
        ? (responses.created = true)
        : (responses.updated = true);
    }

    //  Handle typeOfUseNonTaxable insert (Capital Value: Yes)

    if (PropertyInfo.typeOfUseNonTaxableList) {
      try {
        const { TypeOfUseID, Type, Description } =
          PropertyInfo.typeOfUseNonTaxableList;

        await TypeOfUseMasterNonTaxable.create({
          TypeOfUseID,
          Type,
          Description,
        });

        console.log(`✅ Non-taxable use type inserted: ${TypeOfUseID}`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.warn(`⚠️ TypeOfUseID already exists: ${error.message}`);
        } else {
          console.error(`❌ Error inserting TypeOfUse:`, error.message);
        }
      }
    }
    // Handle PropertyDetailsOld data
    if (
      Array.isArray(PropertyInfo.propertyDetailsOld) &&
      PropertyInfo.propertyDetailsOld.length > 0
    ) {
      for (const oldDetail of PropertyInfo.propertyDetailsOld) {
        if (!oldDetail || typeof oldDetail !== 'object') {
          console.warn(
            '⚠️ Skipping invalid propertyDetailsOld entry:',
            oldDetail
          );
          continue;
        }

        try {
          const PDOId = oldDetail.PDOId;
          const incomingOwnerID =
            oldDetail.OwnerID || PropertyInfo.propertyMast.OwnerID;
          const actualOwnerID =
            incomingOwnerID === 0 ? newOwnerID : incomingOwnerID;

          // ❌ DELETE if flag is set
          if (Array.isArray(oldDetail)) {
            for (const pdoId of oldDetail) {
              console.log('❌ Deleting propertyDetailsOld with PDOId:', pdoId);

              await propertydetailsold.destroy({
                where: { PDOId: pdoId },
              });
            }
            responses.updated = true;
            continue;
          }

          // 🔍 Check if record exists
          const existing = await propertydetailsold.findOne({
            where: { PDOId },
          });

          if (existing) {
            // ✏️ UPDATE
            const { Insert, Update, Delete, ...updateDetails } = oldDetail;

            console.log(
              '✏️ Updating propertyDetailsOld:',
              PDOId,
              updateDetails
            );
             updateDetails.UpdatedBy = userId;
            updateDetails.UpdatedDate = new Date()
            await propertydetailsold.update(
              {
                ...updateDetails,
                OwnerID: actualOwnerID,
              },
              { where: { PDOId } }
            );

            responses.updated = true;

            await logChanges(
              propertydetailsold,
              ownerID,
              updateDetails,
              PropertyInfo.propertyDetailsOld,
              'propertyDetailsOld',
              userId
            );
          } else {
            // 🆕 INSERT
            const { Insert, Update, Delete, ...insertDetails } = oldDetail;

            console.log(
              '➕ Inserting new propertyDetailsOld:',
              PDOId,
              insertDetails
            );
            // insertDetails.CreatedBy = GlobalUserID;
            insertDetails.CreatedDate = new Date()
            await propertydetailsold.create({
              ...insertDetails,
              PDOId,
              OwnerID: actualOwnerID,
            });

            incomingOwnerID === 0
              ? (responses.created = true)
              : (responses.updated = true);
          }
        } catch (err) {
          console.error(
            '❌ Error while processing propertyDetailsOld entry:',
            err,
            oldDetail
          );
          throw err;
        }
      }
    }

    // Determine response status
    console.log(
      '📤 Final Responses:PropertyInfo.retentionTaxData',
      PropertyInfo.retentionTaxData
    );
    if (PropertyInfo.retentionTaxData) {
      let ownerID = PropertyInfo.retentionTaxData.OwnerID;

      // Clone and clean data — convert empty strings to null
      const cleanedRetentionData = Object.fromEntries(
        Object.entries(PropertyInfo.retentionTaxData)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, value === '' ? null : value])
      );

      try {
        // Check if record exists first
        const existing = await Retentiontaxmast.findOne({
          where: { OwnerID: ownerID },
        });

        if (existing) {
        const updateData = {
  ...Object.fromEntries(
    Object.entries(cleanedRetentionData).filter(
      ([key]) => key !== 'OwnerID'
    )
  ),
  UpdatedBy: userId,        
  UpdatedDate: new Date(), 
};

          

          if (Object.keys(updateData).length > 0) {
            await Retentiontaxmast.update(updateData, {
              where: { OwnerID: ownerID },
            });
            console.log(
              `Retentiontaxmast updated for OwnerID ${ownerID}`,
              updateData
            );
            responses.updated = true;
            // 🔹 Log history
            await logChanges(
              Retentiontaxmast,
              ownerID,
              existing,
              updateData,
              'RetentionTax',
              userId
            );
          }
        } else {
          // Insert new record
          if (ownerID) {
            await Retentiontaxmast.create({
              ...cleanedRetentionData,
              OwnerID: ownerID,
                CreatedBy: userId,        
                CreatedDate: new Date(),  

            });
            console.log(
              `Retentiontaxmast created for OwnerID ${ownerID}`,
              cleanedRetentionData
            );
            responses.created = true;
          }
        }
      } catch (error) {
        console.error('Error saving Retentiontaxmast:', error);
      }
    }

    const statusCode = responses.created ? 200 : responses.updated ? 201 : 200;

    const message = responses.created
      ? 'Property information created successfully'
      : 'Property information updated successfully';

    // ✅ Determine finalOwnerID (new or existing)
    const finalOwnerID =
      newOwnerID !== 0 ? newOwnerID : PropertyInfo.propertyMast.OwnerID;

    console.log('Final OwnerID to return:', finalOwnerID);
    return res.status(statusCode).json({
      message,
      OwnerID: finalOwnerID, // <-- return it here
    });
  } catch (error) {
    console.error('Error saving property information:', error.message);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
//dd
// export const savePropertyInfo = async (req, res) => {

//   console.log('req is coming')
//   const { PropertyInfo } = req.body;
//   const { DeletePropertyDetailsNew } = PropertyInfo;
//   const { DeleteJointOwnerDetails } = PropertyInfo;

//   const { DeleteFloorSubmissionDetails } = PropertyInfo;
//   const { DeleteFloorSubmissionMinusDetails } = PropertyInfo;

//   console.log(DeleteFloorSubmissionDetails, 'DeleteFloorSubmissionDetails')

//   console.log(DeletePropertyDetailsNew, 'property info deleted pdnids');

//   console.log(DeleteJointOwnerDetails, 'ids to be deleted');
//   console.log(PropertyInfo, 'testttttt');
//   const responses = {
//     created: false,
//     updated: false,
//     deleted: false,
//   };

//   try {
//     // 🔍 Extract and separate isPrime owner

//     let primaryOwner = null;
//     primaryOwner = PropertyInfo.jointOwnerDetails.find(
//       (entry) => entry.isPrime === true
//     );
//     if (!primaryOwner)
//       console.warn('⚠️ No isPrime owner found in jointOwnerDetails');
//     console.log(
//       '💡 Final propertyMast after assigning isPrime owner:',
//       primaryOwner
//     );
//     if (primaryOwner) {
//       PropertyInfo.propertyMast = {
//         ...PropertyInfo.propertyMast,
//         OwnerTitle: primaryOwner.OwnerTitle,
//         OwnerTitleMarathi: primaryOwner.OwnerTitleMarathi,
//         OwnerName: primaryOwner.OwnerName,
//         OccupierName: primaryOwner.OccupierName,
//         OwnerNameMarathi: primaryOwner.OwnerNameMarathi,
//         OccupierNameMarathi: primaryOwner.OccupierNameMarathi,
//         Address: primaryOwner.Address,
//         OwnerPatta: primaryOwner.OwnerPatta,
//         BuildingOrShopName: primaryOwner.BuildingOrShopName ?? null,
//         BuildingOrShopNameMarathi:
//           primaryOwner.BuildingOrShopNameMarathi ?? null,

//         BuildingOrFlatNo: primaryOwner.BuildingOrFlatNo ?? null,
//         BuildingOrFlatNoMarathi: primaryOwner.BuildingOrFlatNoMarathi ?? null,
//       };
//     }
//     console.log(primaryOwner, 'console primary owner');
//     console.log(PropertyInfo.jointOwnerDetails, 'infooo pri');

//     //let remainingJointOwners = [];

//     // Handle PropertyMast data
//     let ownerID = PropertyInfo.propertyMast.OwnerID;
//     let newOwnerID = 0;
//     console.log(ownerID, 'ownerID');
//     if (ownerID == 0) {
//       console.log(
//         'Data sent to PropertyMast.create:',
//         PropertyInfo.propertyMast
//       );

//       const { rToilet, cToilet, ...rest } = PropertyInfo.propertyMast;
//       const dataToCreate = {
//         ...rest,
//         NewToiletNo: rToilet || 0,
//         commToiletNo: cToilet || 0,
//       };
//       const allowedFields = Object.keys(PropertyMast.getAttributes());

//       console.log(allowedFields, 'allowedFields');

//       console.log('Data sent to PropertyMast.create:', dataToCreate);
//       var newPropertyMast = await PropertyMast.create(dataToCreate, {
//         validate: true,
//         fields: allowedFields,
//       });

//       console.log('Inserted newly', newPropertyMast);
//       newOwnerID = newPropertyMast.OwnerID;
//       responses.created = true;
//     } else {
//       // Update existing record
//       await PropertyMast.update(PropertyInfo.propertyMast, {
//         where: { OwnerID: ownerID },
//       });
//       responses.updated = true;
//     }

//     // 🆕 After handling PropertyMast (create/update), sync CombinedOwnerName table
//     try {
//       if (primaryOwner) {
//         const combinedData = {
//           OwnerID: ownerID == 0 ? newOwnerID : ownerID, // new or existing OwnerID
//           OwnerName: primaryOwner.OwnerName,
//           MarathiOwnerName: primaryOwner.OwnerNameMarathi,
//           OccupierName: primaryOwner.OccupierName,
//           MarathiOccupierName: primaryOwner.OccupierNameMarathi,
//         };

//         if (ownerID == 0) {
//           // Insert new record
//           await CombinedOwnerName.create(combinedData);
//           console.log("✅ Inserted CombinedOwnerName:", combinedData);
//         } else {
//           // Update existing record
//           await CombinedOwnerName.update(
//             {
//               OwnerName: primaryOwner.OwnerName,
//               MarathiOwnerName: primaryOwner.OwnerNameMarathi,
//               OccupierName: primaryOwner.OccupierName,
//               MarathiOccupierName: primaryOwner.OccupierNameMarathi,
//             },
//             { where: { OwnerID: ownerID } }
//           );
//           console.log("✅ Updated CombinedOwnerName:", combinedData);
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error handling CombinedOwnerName:", err);
//     }

//     console.log(PropertyInfo.propertyMast.OpenPlot, 'property typeee')
//     if (PropertyInfo.propertyMast.OpenPlot) {
//       await FloorSubmissionDetailsMinusData.destroy({ where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID } });
//       await FloorSubmissionDetails.destroy({ where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID } });
//       await PropertyDetailsNew.destroy({ where: { OwnerID: ownerID == 0 ? newOwnerID : ownerID } });
//       console.log('open plot so deleted all floor and property details new records');
//     }

//     console.log('🧪 propertyDetailsNewwwww:', PropertyInfo.propertyDetailsNew);

//     // ===== PropertyDetailsNew ====

//     // ===== 1️⃣ Delete PropertyDetailsNew (with cascade) first =====
//     if (
//       Array.isArray(DeletePropertyDetailsNew) &&
//       DeletePropertyDetailsNew.length > 0
//     ) {
//       for (const PDNId of DeletePropertyDetailsNew) {
//         try {
//           console.log('❌ Deleting PropertyDetailsNew by PDNId:', PDNId);

//           // 1️⃣ Find all floors linked to this PDNId
//           const floors = await FloorSubmissionDetails.findAll({ where: { PDNId } });

//           // 2️⃣ Delete minus data for each floor
//           for (const floor of floors) {
//             await FloorSubmissionDetailsMinusData.destroy({
//               where: { FSDId: floor.FSDId },
//             });
//             console.log(`🗑️ Deleted minus data linked to FSDId ${floor.FSDId}`);
//           }

//           // 3️⃣ Delete floors
//           await FloorSubmissionDetails.destroy({ where: { PDNId } });
//           console.log(`🗑️ Deleted FloorSubmissionDetails for PDNId ${PDNId}`);

//           // 4️⃣ Delete parent PropertyDetailsNew
//           console.log('delete property details new')
//           await PropertyDetailsNew.destroy({ where: { PDNId } });
//           console.log(`🗑️ Deleted PropertyDetailsNew for PDNId ${PDNId}`);

//           responses.deleted = true;
//         } catch (err) {
//           console.error('❌ Error deleting PDNId:', PDNId, err);
//           throw err;
//         }
//       }
//     }

//     // ===== 2️⃣ Upsert PropertyDetailsNew =====
//     if (
//       Array.isArray(PropertyInfo.propertyDetailsNew) &&
//       PropertyInfo.propertyDetailsNew.length > 0 &&
//       PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !== 'open plot'
//     ) {
//       for (const detail of PropertyInfo.propertyDetailsNew) {
//         console.log(detail, "new object to be send")

//         if (!detail || typeof detail !== 'object') continue;

//         try {
//           // Determine valid OwnerID
//           const validOwnerID =
//             newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;
//           if (!validOwnerID || validOwnerID === 0) {
//             console.warn('⚠️ Skipping insert — no valid OwnerID for detail:', detail);
//             continue;
//           }

//           // Clean detail: empty strings → null
//           const
//             cleanedDetail = Object.fromEntries(
//               Object.entries(detail)
//                 .filter(([_, value]) => value !== undefined && value !== null)
//                 .map(([key, value]) => [key, value === '' ? null : value])
//             );

//           // UPSERT: check if the PDNId exists
//           let existingRecord = null;
//           if (detail.PDNId) {
//             existingRecord = await PropertyDetailsNew.findOne({
//               where: { PDNId: detail.PDNId },
//             });
//           }

//           if (existingRecord) {
//             const { Insert, Update, Delete, ...updateData } = cleanedDetail;
//             const { PDNId, ...updateDataWithoutPDNId } = updateData;

//             const normalize = (val) => {
//               if (val === "" || val === undefined || val === null) return null;
//               return Number(val.toString().replace(/,/g, ""));
//             };

//             updateDataWithoutPDNId.BuildUpAreaSqFeet = normalize(updateDataWithoutPDNId.BuildUpAreaSqFeet);
//             updateDataWithoutPDNId.BuildUpAreaSqMeter = normalize(updateDataWithoutPDNId.BuildUpAreaSqMeter);
//             console.log(updateDataWithoutPDNId, 'updateDataWithoutPDNId')
//             const result = await PropertyDetailsNew.update(updateDataWithoutPDNId, {
//               where: { PDNId: detail.PDNId },
//             });

//             console.log(result, 'updateDataWithoutPDNId');
//             responses.updated = true;

//           } else {
//             // Create new record
//             const { Insert, Update, Delete, ...newData } = cleanedDetail;
//             await PropertyDetailsNew.create({ ...newData, OwnerID: validOwnerID });
//             responses.created = true;
//             console.log(
//               `🆕 Created PropertyDetailsNew for OwnerID ${validOwnerID}`,
//               newData
//             );
//           }
//         } catch (err) {
//           console.error('❌ Error processing PropertyDetailsNew entry:', err, detail);
//           throw err;
//         }
//       }
//     }

//     // -------------------- FloorSubmissionDetails --------------------
//     if (
//       Array.isArray(PropertyInfo.floorSubmissionDetails) &&
//       PropertyInfo.floorSubmissionDetails.length > 0 &&
//       PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !== 'open plot'
//     ) {
//       for (const detail of PropertyInfo.floorSubmissionDetails) {
//         if (!detail || typeof detail !== 'object') continue;

//         // 🚫 Skip floors linked to deleted PropertyDetailsNew
//         if (
//           Array.isArray(DeletePropertyDetailsNew) &&
//           DeletePropertyDetailsNew.includes(detail.PDNId)
//         ) {
//           console.log(`⚠️ Skipping floor for deleted PDNId ${detail.PDNId}`);
//           continue;
//         }

//         try {
//           const validOwnerID =
//             newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;

//           if (!validOwnerID || validOwnerID === 0) {
//             console.warn("⚠️ Skipping floor row — no valid OwnerID", detail);
//             continue;
//           }

//           // 🔗 Assign PDNId automatically if missing
//           if (!detail.PDNId) {
//             let matchingProperty = PropertyInfo.propertyDetailsNew.find(
//               (p) => p.OwnerID === validOwnerID
//             );

//             if (matchingProperty && matchingProperty.PDNId) {
//               detail.PDNId = matchingProperty.PDNId;
//             } else {
//               // detail.PDNId
//               console.warn("⚠️ No PDNId provided for floor detail:", detail);

//               // Add temporary PropertyDetailsNew row to satisfy FK
//               PropertyInfo.propertyDetailsNew.push({
//                 PDNId: detail.PDNId,
//                 OwnerID: validOwnerID,
//                 Insert: true,
//               });

//               // console.log(
//               //   `🆕 Generated PDNId ${newPDNId} and added PropertyDetailsNew row`
//               // );
//             }
//           }

//           // 🧹 Clean data: empty string → null
//           const cleanedDetail = Object.fromEntries(
//             Object.entries(detail)
//               .filter(([_, value]) => value !== undefined && value !== null)
//               .map(([key, value]) => [key, value === "" ? null : value])
//           );

//           // 🔢 Convert numeric fields
//           const numericFields = [
//             "Length", "Width", "Height", "Area", "TotalArea",
//             "SmallBase", "LargeBase", "Radius", "length_a", "length_b", "length_c",
//           ];
//           numericFields.forEach((field) => {
//             if (cleanedDetail[field] !== undefined && cleanedDetail[field] !== null) {
//               cleanedDetail[field] = Number(cleanedDetail[field]) || 0;
//             }
//           });

//           // ❌ Delete rows in bulk (from DeletedFSDId array)
//           if (
//             Array.isArray(DeleteFloorSubmissionDetails) &&
//             DeleteFloorSubmissionDetails.length > 0
//           ) {
//             for (const FSDId of DeleteFloorSubmissionDetails) {
//               await FloorSubmissionDetails.destroy({ where: { FSDId } });
//               console.log("❌ Deleted FloorSubmissionDetails by FSDId:", FSDId);
//               responses.updated = true;
//             }
//           }

//           // 🗑️ Delete if flagged
//           if (detail.Delete) {
//             if (detail.FSDId) {
//               await FloorSubmissionDetails.destroy({ where: { FSDId: Number(detail.FSDId) } });
//               console.log(`🗑️ Deleted FloorSubmissionDetails by FSDId ${detail.FSDId}`);
//             }
//             responses.deleted = true;
//             continue;
//           }

//           // ✏️ Update / Insert (UPSERT)
//           if (detail.FSDId) {
//             const existingFloor = await FloorSubmissionDetails.findOne({
//               where: { FSDId: detail.FSDId },
//             });
//             if (existingFloor) {
//               const { Insert, Update, Delete, ...updateData } = cleanedDetail;
//               updateData.OwnerID = validOwnerID; // ✅ force OwnerID
//               await FloorSubmissionDetails.update(updateData, {
//                 where: { FSDId: detail.FSDId },
//               });
//               responses.updated = true;
//               console.log(`✏️ Updated FloorSubmissionDetails FSDId=${detail.FSDId}`, updateData);
//             } else {
//               const { Insert, Update, Delete, ...newData } = cleanedDetail;

//               console.log(newData, "floor id")
//               await FloorSubmissionDetails.create({
//                 ...newData,
//                 OwnerID: validOwnerID,
//               });
//               responses.created = true;
//               console.log(`🆕 Created FloorSubmissionDetails for OwnerID=${validOwnerID}`, newData);
//             }
//           } else if (detail.Insert) {
//             const { Insert, Update, Delete, ...newData } = cleanedDetail;
//             console.log(newData, "insert")

//             await FloorSubmissionDetails.create({
//               ...newData,
//               OwnerID: validOwnerID,
//             });
//             responses.created = true;
//             console.log(`🆕 Created FloorSubmissionDetails for OwnerID=${validOwnerID}`, newData);
//           }
//         } catch (err) {
//           console.error("❌ Error processing floorSubmissionDetails:", err, detail);
//           throw err;
//         }
//       }
//     }

//     console.log(PropertyInfo.floorSubmissionDetailsMinusData, "minusData from ui")
//     // -------------------- FloorSubmissionDetailsMinusData --------------------
//     if (
//       Array.isArray(PropertyInfo.floorSubmissionDetailsMinusData) &&
//       PropertyInfo.floorSubmissionDetailsMinusData.length > 0 &&
//       PropertyInfo?.propertyMast?.PropertyType?.toLowerCase().trim() !== "open plot"
//     ) {
//       for (const detail of PropertyInfo.floorSubmissionDetailsMinusData) {

//         if (!detail || typeof detail !== "object") continue;

//         // 🚫 Skip minus-data rows linked to deleted PropertyDetailsNew
//         if (
//           Array.isArray(DeletePropertyDetailsNew) &&
//           DeletePropertyDetailsNew.includes(detail.PDNId)
//         ) {
//           console.log(`⚠️ Skipping minus-data for deleted PDNId ${detail.PDNId}`);
//           continue;
//         }

//         const validOwnerID =
//           newOwnerID || detail.OwnerID || PropertyInfo.propertyMast.OwnerID;

//         if (!validOwnerID || validOwnerID === 0) {
//           console.warn("⚠️ Skipping minus row — no valid OwnerID", detail);
//           continue;
//         }

//         // 🧹 Clean data
//         const cleanedDetail = Object.fromEntries(
//           Object.entries(detail)
//             .filter(([_, value]) => value !== undefined && value !== null)
//             .map(([key, value]) => [key, value === "" ? null : value])
//         );

//         // 🔢 Convert numeric fields
//         const numericFields = [
//           "Length", "Width", "Height", "Area", "TotalArea",
//           "SmallBase", "LargeBase", "Radius", "length_a", "length_b", "length_c",
//         ];
//         numericFields.forEach((field) => {
//           if (cleanedDetail[field] !== undefined && cleanedDetail[field] !== null) {
//             cleanedDetail[field] = parseFloat(cleanedDetail[field]) || 0;
//           }
//         });

//         // 🔗 Only check parent if FSDId exists
//         if (cleanedDetail.FSDId && cleanedDetail.FSDId !== 0) {
//           const parentFloor = await FloorSubmissionDetails.findOne({
//             where: { FSDId: cleanedDetail.FSDId },
//           });
//           if (!parentFloor) {
//             console.warn(
//               `⚠️ Parent FloorSubmissionDetails not found for FSDId ${cleanedDetail.FSDId}, skipping minus data`
//             );
//             continue;
//           }
//         }

//         // ❌ Delete rows in bulk (from DeletedFSDMDId array)
//         if (
//           Array.isArray(DeleteFloorSubmissionMinusDetails) &&
//           DeleteFloorSubmissionMinusDetails.length > 0
//         ) {
//           for (const FSDMDId of DeleteFloorSubmissionMinusDetails) {
//             await FloorSubmissionDetailsMinusData.destroy({ where: { FSDMDId } });
//             console.log("❌ Deleted FloorSubmissionDetailsMinusData by FSDMDId:", FSDMDId);
//             responses.updated = true;
//           }
//         }

//         // 🗑️ Delete if flagged
//         if (detail.Delete) {
//           if (detail.FSDMDId) {
//             await FloorSubmissionDetailsMinusData.destroy({
//               where: { FSDMDId: Number(detail.FSDMDId) },
//             });
//             console.log(`🗑️ Deleted FloorSubmissionDetailsMinusData FSDMDId=${detail.FSDMDId}`);
//           }
//           responses.deleted = true;
//           continue;
//         }

//         // ✏️ Update / Insert (UPSERT)
//         if (detail.FSDMDId) {
//           const existingMinus = await FloorSubmissionDetailsMinusData.findOne({
//             where: { FSDMDId: detail.FSDMDId },
//           });
//           if (existingMinus) {
//             const { Insert, Update, Delete, ...updateData } = cleanedDetail;
//             updateData.OwnerID = validOwnerID; // ✅ force OwnerID
//             await FloorSubmissionDetailsMinusData.update(updateData, {
//               where: { FSDMDId: detail.FSDMDId },
//             });
//             responses.updated = true;
//             console.log(`✏️ Updated FloorSubmissionDetailsMinusData FSDMDId=${detail.FSDMDId}`, updateData);
//           } else {
//             const { Insert, Update, Delete, ...newData } = cleanedDetail;
//             await FloorSubmissionDetailsMinusData.create({
//               ...newData,
//               OwnerID: validOwnerID,
//             });
//             responses.created = true;
//             console.log(`🆕 Created FloorSubmissionDetailsMinusData for OwnerID=${validOwnerID}`, newData);
//           }
//         } else if (detail.Insert) {
//           const { Insert, Update, Delete, ...newData } = cleanedDetail;
//           await FloorSubmissionDetailsMinusData.create({
//             ...newData,
//             OwnerID: validOwnerID,
//           });
//           responses.created = true;
//           console.log(`🆕 Created FloorSubmissionDetailsMinusData for OwnerID=${validOwnerID}`, newData);
//         }
//       }
//     }

//     // :x: Delete rows in bulk (from DeletedFSDId array)
//     if (
//       Array.isArray(DeleteFloorSubmissionDetails) &&
//       DeleteFloorSubmissionDetails.length > 0
//     ) {
//       console.log('delete floor submission data')
//       for (const FSDId of DeleteFloorSubmissionDetails) {
//         try {
//           console.log(":x: Deleting FloorSubmissionDetails by FSDId:", FSDId);
//           // :white_check_mark: Delete children first
//           await FloorSubmissionDetailsMinusData.destroy({ where: { FSDId } });
//           // :white_check_mark: Then delete parent
//           await FloorSubmissionDetails.destroy({ where: { FSDId } });
//           responses.updated = true;
//         } catch (err) {
//           console.error(":x: Error deleting FSDId:", FSDId, err);
//           throw err;
//         }
//       }
//     }
//     // :x: Delete rows in bulk (from DeletedFSDMDId array)
//     if (
//       Array.isArray(DeleteFloorSubmissionMinusDetails) &&
//       DeleteFloorSubmissionMinusDetails.length > 0
//     ) {
//       for (const FSDMDId of DeleteFloorSubmissionMinusDetails) {
//         try {
//           console.log(':x: Deleting FloorSubmissionMinusDetailsMinus by FSDMDId:', FSDMDId);
//           await FloorSubmissionDetailsMinusData.destroy({ where: { FSDMDId } }); // :white_check_mark: Correct model
//           responses.updated = true;
//         } catch (err) {
//           console.error(':x: Error deleting FSDMDId:', FSDMDId, err);
//           throw err;
//         }
//       }
//     }

//     // ===== TaxPendingDetails =====

//     // tax pending
//     if (
//       Array.isArray(PropertyInfo.pendingTaxes) &&
//       PropertyInfo.pendingTaxes.length > 0
//     ) {
//       console.log('Processing pendingTaxes:', PropertyInfo.pendingTaxes);
//       for (const raw of PropertyInfo.pendingTaxes) {

//         if (!raw || typeof raw !== 'object') {
//           console.warn('⚠️ Skipping invalid pendingTaxes entry:', raw);
//           continue;
//         }

//         console.log('Processing pendingTaxes 2:', PropertyInfo.pendingTaxes);

//         try {

//           const {

//             TPDID,
//             Insert,
//             Update,
//             Delete,
//             PendingYear,
//             ...cleanedDetail
//           } = raw;

//           let OwnerID = ownerID || 0
//           console.log('cleanedDetail:', ownerID);
//           /* ---------- New Owner: insert with new OwnerID ---------- */
//           if (OwnerID === 0) {
//             OwnerID = newOwnerID
//             console.log('----insert is running')
//             console.log('newOwnerID:', newOwnerID);
//             const taxpending = await TaxPendingDetails.create({
//               ...cleanedDetail,
//               PendingYear,
//               OwnerID: OwnerID,
//             });
//             if (newOwnerID !== 0) {
//               responses.created = true;
//             } else {
//               responses.updated = true;
//             }

//             continue;
//           }

//           /* ---------- Existing Owner ---------- */
//           else if (Insert) {
//             console.log('----insert is running 2')
//             PropertyInfo.pendingTaxes[0].OwnerID = OwnerID
//             await TaxPendingDetails.create({
//               ...cleanedDetail,
//               PendingYear,
//               OwnerID: PropertyInfo.propertyMast.OwnerID,

//             });

//             responses.updated = true;
//           }

//           if (Update) {
//             console.log(cleanedDetail, 'Processing  Tax pending details')
//             await TaxPendingDetails.update(
//               { ...cleanedDetail }, // PendingYear excluded
//               {
//                 where: {

//                   TPDID: TPDID,
//                   OwnerID: OwnerID
//                 }

//               }
//             );

//             responses.updated = true;
//           }

//           if (Delete) {
//             await TaxPendingDetails.destroy({
//               where: {

//                 TPDID: TPDID,
//                 OwnerID: OwnerID
//               }

//             });

//             responses.updated = true;
//           }
//           console.log(
//             'Processing pendingTaxes Ended:',
//             PropertyInfo.pendingTaxes
//           );
//         } catch (err) {
//           console.error(
//             '❌ Error processing taxPendingDetails entry:',
//             err,
//             raw
//           );
//           throw err;
//         }

//       }
//     }

//     //handle joint owner details data
//     // 1️⃣ Find the new prime owner from request
//     const primaryOwnerjoint = PropertyInfo.jointOwnerDetails.find(
//       (entry) => entry.isPrime === true
//     );
//     if (primaryOwnerjoint) {
//       // 2️⃣ Clear isPrime for all rows in jointownerdetails for this property
//       await JoinOwnerDetails.update(
//         { isPrime: false },
//         { where: { OwnerID: primaryOwnerjoint.OwnerID } }
//       );

//       // 3️⃣ Set isPrime true for the new prime
//       await JoinOwnerDetails.update(
//         { isPrime: true },
//         { where: { JODId: primaryOwnerjoint.JODId } }
//       );
//       console.log("PropertyInfo.jointOwnerDetails:", PropertyInfo.jointOwnerDetails);
//       for (let jointOwner of PropertyInfo.jointOwnerDetails) {
//         if (!jointOwner || typeof jointOwner !== 'object') {
//           console.warn('⚠️ Skipping invalid jointOwner entry:', jointOwner);
//           continue;
//         }

//         try {
//           const ownerID = jointOwner.OwnerID;

//           // 👉 If OwnerID = 0 => inserting entire property, insert all joint owners
//           if (ownerID == 0) {
//             const OwnerID = newOwnerID;
//             const { Insert, Update, ...cleanedJointOwner } = jointOwner;

//             console.log('🆕 Creating new JointOwnerDetails record:', {
//               ...cleanedJointOwner,
//               OwnerID,
//             });

//             await JoinOwnerDetails.create({
//               ...cleanedJointOwner,
//               OwnerID,
//             });

//             responses.created = true;
//           } else {
//             const JODId = jointOwner.JODId;
//             console.log(JODId, 'new jdoid owner');
//             console.log(jointOwner, 'new whole joint owner');

//             // ✅ Insert new row in update mode
//            // ✅ Prevent duplicate JointOwnerDetails insertion
// if (jointOwner.Insert) {
//   const { Insert, Update, JODId, ...newDetails } = jointOwner;

//   // 🔎 Check if same record already exists
//   const existingOwner = await JoinOwnerDetails.findOne({
//     where: {
//       OwnerID: ownerID,
//       OwnerName: newDetails.OwnerName?.trim(),
//       OwnerPatta: newDetails.OwnerPatta?.trim() || null,
//       BuildingOrFlatNo: newDetails.BuildingOrFlatNo?.trim() || null,
//       BuildingOrShopName: newDetails.BuildingOrShopName?.trim() || null,
//     },
//   });

//   if (existingOwner) {
//     console.log('⚠️ Duplicate owner entry detected, skipping insert:', newDetails.OwnerName);
//     continue; // 🔥 Skip inserting duplicate
//   }

//   console.log('➕ Inserting new JointOwnerDetails with Insert flag:', newDetails);
//   await JoinOwnerDetails.create({
//     ...newDetails,
//     OwnerID: ownerID,
//   });
//   responses.updated = true;
// }

//           }
//         } catch (err) {
//           console.error(
//             '❌ Error while processing jointOwnerDetails entry:',
//             err,
//             jointOwner
//           );
//           throw err;
//         }
//       }

//       // ✅ Handle deletion from array
//       if (
//         Array.isArray(DeleteJointOwnerDetails) &&
//         DeleteJointOwnerDetails.length > 0
//       ) {
//         for (const JODId of DeleteJointOwnerDetails) {
//           try {
//             console.log('❌ Deleting JointOwnerDetails by JODId:', JODId);
//             await JoinOwnerDetails.destroy({ where: { JODId } });
//             responses.updated = true;
//           } catch (err) {
//             console.error('❌ Error deleting JODId:', JODId, err);
//             throw err;
//           }
//         }
//       }
//     }

//     // Handle PropertySocialDetails data
//     if (PropertyInfo.propertySocialDetails) {
//       let ownerID = PropertyInfo.propertySocialDetails.OwnerID;
//       if (ownerID == 0) {
//         PropertyInfo.propertySocialDetails.OwnerID = newOwnerID;
//         console.log(
//           '🧾 Final payload to insert socila lll:',
//           PropertyInfo.propertySocialDetails
//         );
//         await PropertySocialDetails.create(PropertyInfo.propertySocialDetails);
//         responses.created = true;
//       } else {
//         await PropertySocialDetails.update(PropertyInfo.propertySocialDetails, {
//           where: { OwnerID: ownerID },
//         });
//         responses.updated = true;
//       }
//     }

//     // Handle DrainFlatRate data
//     if (PropertyInfo.drainFlatRate) {
//       let OwnerID =
//         PropertyInfo.drainFlatRate.OwnerID || PropertyInfo.propertyMast.OwnerID; // Derive OwnerID
//       console.log(OwnerID, 'new rate id');

//       if (OwnerID == 0) {
//         PropertyInfo.drainFlatRate.OwnerID = newOwnerID;

//         console.log(
//           '🧾 Final payload to insert drain:',
//           PropertyInfo.drainFlatRate
//         );
//         await ApplyTaxesMaster.create(PropertyInfo.drainFlatRate);
//         responses.created = true;
//       } else {
//         await ApplyTaxesMaster.update(PropertyInfo.drainFlatRate, {
//           where: { OwnerID: OwnerID },
//         });

//         responses.updated = true;
//       }
//     }

//     // Handle OldPropertyMast data

//     if (PropertyInfo.oldPropertyMast) {
//       let ownerID = PropertyInfo.oldPropertyMast.OwnerID || 0;
//       console.log(ownerID, 'ownerID for oldPropertyMast');
//       if (PropertyInfo.oldPropertyMast.OldRV === '') {
//         PropertyInfo.oldPropertyMast.OldRV = null
//       }
//       if (PropertyInfo.oldPropertyMast.OldPropertyTax === '') {
//         PropertyInfo.oldPropertyMast.OldPropertyTax = null
//       }
//       if (PropertyInfo.oldPropertyMast.OldTotalTax === '') {
//         PropertyInfo.oldPropertyMast.OldTotalTax = null
//       }
//       if (PropertyInfo.oldPropertyMast.OldALV === '') {
//         PropertyInfo.oldPropertyMast.OldALV = null
//       }
//       if (PropertyInfo.oldPropertyMast.OldPlotArea === '') {
//         PropertyInfo.oldPropertyMast.OldPlotArea = null
//       }
//       if (PropertyInfo.oldPropertyMast.OldToiletNo === '') {
//         PropertyInfo.oldPropertyMast.OldToiletNo = null
//       }
//       if (PropertyInfo.oldPropertyMast.OldTotalRooms === '') {
//         PropertyInfo.oldPropertyMast.OldTotalRooms = null
//       }

//       // If original OwnerID is 0, fallback to newOwnerID or propertyMast.OwnerID
//       if (ownerID === 0) {
//         console.log(newOwnerID, 'newOwnerID for oldPropertyMast');
//         ownerID = newOwnerID || PropertyInfo.propertyMast.OwnerID;
//         PropertyInfo.oldPropertyMast.OwnerID = ownerID;
//       }

//       // Check if a record with this OwnerID already exists
//       const existingRecord = await OldPropertyMast.findOne({ where: { OwnerID: ownerID } });

//       if (existingRecord) {
//         // Update existing record
//         await OldPropertyMast.update(PropertyInfo.oldPropertyMast, {
//           where: { OwnerID: ownerID },
//         });
//         console.log('✏️ Updated existing OldPropertyMast:', ownerID);
//         responses.updated = true;
//       } else {
//         // Create new record
//         await OldPropertyMast.create(PropertyInfo.oldPropertyMast);
//         console.log('✅ Created new OldPropertyMast:', ownerID);

//         // Count it as update if newOwnerID is 0, else it's a creation
//         if (newOwnerID === 0) {
//           responses.updated = true;
//         } else {
//           responses.created = true;
//         }
//       }
//     }

//     //Handle OldTaxes data
//     if (PropertyInfo.oldTaxes) {
//       let ownerID = PropertyInfo.propertyMast.OwnerID || 0;
//       console.log(ownerID, 'ownerID from propertyMast');

//       // First check if there's an existing oldTaxes record for this ownerID
//       const existingOldTaxes = await OldTaxes.findOne({ where: { OwnerID: ownerID } });

//       if (existingOldTaxes) {
//         console.log(PropertyInfo.oldTaxes, 'executing update for old taxes');
//         await OldTaxes.update({
//           PropertyTax: PropertyInfo.oldTaxes.PropertyTax,
//           EducationTax: PropertyInfo.oldTaxes.EducationTax,
//           EmploymentTax: PropertyInfo.oldTaxes.EmploymentTax,
//           TreeCess: PropertyInfo.oldTaxes.TreeCess,
//           FireCess: PropertyInfo.oldTaxes.FireCess,
//           SpEducationTax: PropertyInfo.oldTaxes.SpEducationTax,
//           MajorBuilding: PropertyInfo.oldTaxes.MajorBuilding,
//           LightCess: PropertyInfo.oldTaxes.LightCess,
//           RoadCess: PropertyInfo.oldTaxes.RoadCess,
//           DrainCess: PropertyInfo.oldTaxes.DrainCess,
//           SewageDisposalCess: PropertyInfo.oldTaxes.SewageDisposalCess,
//           Sanitation: PropertyInfo.oldTaxes.Sanitation,
//           SpWaterCess: PropertyInfo.oldTaxes.SpWaterCess,
//           WaterBenefit: PropertyInfo.oldTaxes.WaterBenefit,
//           WaterBill: PropertyInfo.oldTaxes.WaterBill,
//           Interest: PropertyInfo.oldTaxes.Interest,
//           TaxTotal: PropertyInfo.oldTaxes.TaxTotal,
//           OldTaxYear: PropertyInfo.oldTaxes.OldTaxYear,
//           Tax1: PropertyInfo.oldTaxes.Tax1,
//         }, { where: { OwnerID: ownerID } });
//         console.log('✏️ Updated existing oldTaxes:', ownerID);
//         responses.updated = true;
//       } else {
//         // No existing record, need to create one
//         if (ownerID === 0 && newOwnerID !== 0) {
//           PropertyInfo.oldTaxes.OwnerID = newOwnerID;
//           console.log(newOwnerID, 'Using newOwnerID for creation');
//         } else {
//           PropertyInfo.oldTaxes.OwnerID = ownerID;
//           console.log(ownerID, 'Using OwnerID (even if 0) for creation');
//         }

//         await OldTaxes.create(PropertyInfo.oldTaxes);
//         console.log('📌 Created new oldTaxes:', PropertyInfo.oldTaxes.OwnerID);
//         if (newOwnerID === 0) {
//           responses.updated = true;
//         } else {
//           responses.created = true;
//         }
//       }
//     }

//     // image property
//     //   // image property
//     // Check if ownerID is provided

//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);

//     // if (!ownerID) {
//     //   return res.status(400).json({ message: ':x: OwnerID is required' });
//     // }

//     let WardNo = PropertyInfo.propertyMast.NewWardNo;

//     let PropertyNo = PropertyInfo.propertyMast.NewPropertyNo;

//     let PartitionNo = PropertyInfo.propertyMast.NewPartitionNo;

//     // :white_check_mark: Define paths
//     const BASE_IMAGE_PATH = '//192.168.5.104/d$/NTIS_New_Images'; // Change base path
//     const COMMON_IMAGE_PATH = path.join(BASE_IMAGE_PATH, 'Image/Photo');
//     const PLAN_IMAGE_PATH = path.join(BASE_IMAGE_PATH, 'Image/Plan');
//     // Check directory access
//     fs.access(
//       COMMON_IMAGE_PATH,
//       fs.constants.R_OK | fs.constants.W_OK,
//       (err) => {
//         if (err) {
//           console.error(':x: No access to:', COMMON_IMAGE_PATH);
//           console.error(err.message);
//         } else {
//           console.log(
//             ':white_check_mark: Controller has read/write access to:',
//             COMMON_IMAGE_PATH
//           );
//         }
//       }
//     );
//     // :white_check_mark: Define file mappings
//     const fileMappings = {
//       PropertyPathA: {
//         suffix: 'A',
//         blobField: 'PropertyPhotoA',
//         pathField: 'PropertyPathA',
//       },
//       PropertyPathB: {
//         suffix: 'B',
//         blobField: 'PropertyPhotoB',
//         pathField: 'PropertyPathB',
//       },
//       PropertyPathC: {
//         suffix: 'C',
//         blobField: 'PropertyPhotoC',
//         pathField: 'PropertyPathC',
//       },
//       PropertyPathD: {
//         suffix: 'D',
//         blobField: 'PropertyPhotoD',
//         pathField: 'PropertyPathD',
//       },
//       PlanPath: {
//         suffix: `${WardNo}-${PropertyNo}`,
//         blobField: 'PlanPhoto',
//         pathField: 'PlanPath',
//         isPlan: true,
//       },
//     };
//     let updateData = {};
//     console.log('--------------------------------------------before object');
//     // Loop over the uploaded files

//     if (req.body.uploadedFiles) {
//       for (const [key, fileArray] of Object.entries(req.body.uploadedFiles)) {
//         const mapping = fileMappings[key];
//         if (!mapping) {
//           console.warn(`⚠️ Skipping unknown file key: ${key}`);
//           continue;
//         }

//         const { suffix, pathField, isPlan } = mapping;
//         const fileExt = isPlan ? '.WMF' : '.jpg';
//         console.log(isPlan, 'isPlan');

//         const existingData = await PropertyImageMast.findOne({
//           where: { ownerid: ownerID },
//         });

//         if (!fileArray || Object.keys(fileArray).length === 0) {
//           const currentPath = existingData?.[pathField];
//           if (currentPath) {
//             const fullPath = path.join(BASE_IMAGE_PATH, currentPath);
//             if (fs.existsSync(fullPath)) {
//               try {
//                 fs.unlinkSync(fullPath);
//                 console.log(`🗑️ Deleted existing file: ${fullPath}`);
//               } catch (error) {
//                 console.error(`❌ Failed to delete file ${fullPath}:`, error);
//               }
//             }
//           }

//           updateData[pathField] = null;
//           continue;
//         }
//         // console.log(fileArray, 'fileArray')

//         try {
//           if (
//             typeof fileArray === 'string' &&
//             fileArray.startsWith('data:image')
//           ) {
//             console.log('✅ Base64 image detected, processing...');

//             const matches = fileArray.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
//             if (!matches || matches.length !== 3) {
//               console.warn('⚠️ Invalid base64 format');
//               continue;
//             }

//             const decodedBuffer = Buffer.from(matches[2], 'base64');

//             // 🛠 Filename setup
//             const fileExt = isPlan ? '.wmf' : '.jpg';
//             const newFilename = isPlan
//               ? `${WardNo}-${PropertyNo}-Plan${fileExt}`
//               : `${WardNo}-${PropertyNo}-${PartitionNo}-${suffix}${fileExt}`;

//             const targetDir = isPlan ? PLAN_IMAGE_PATH : COMMON_IMAGE_PATH;
//             const newFilePath = path.join(targetDir, newFilename);
//             fs.mkdirSync(targetDir, { recursive: true });

//             // 🔍 File size check
//             const fileSizeMB = decodedBuffer.length / 1024 / 1024;

//             if (isPlan) {
//               if (fileSizeMB > 5) {
//                 console.error(
//                   `❌ WMF file too large (${fileSizeMB.toFixed(2)} MB). Skipping.`
//                 );
//                 continue;
//               }
//               fs.writeFileSync(newFilePath, decodedBuffer);
//               console.log(`✅ WMF file saved: ${newFilePath}`);
//             } else {
//               if (fileSizeMB <= 5) {
//                 fs.writeFileSync(newFilePath, decodedBuffer);
//                 console.log(`✅ JPEG saved (no compression): ${newFilePath}`);
//               } else {
//                 let dimensions;
//                 try {
//                   dimensions = sizeOf(decodedBuffer);
//                 } catch (dimErr) {
//                   console.error('❌ Could not read image dimensions:', dimErr);
//                   continue;
//                 }

//                 const { width, height } = dimensions;
//                 const scaledWidth = Math.round(width * 0.15);
//                 const scaledHeight = Math.round(height * 0.15);

//                 let finalBuffer = await sharp(decodedBuffer)
//                   .resize(scaledWidth, scaledHeight)
//                   .jpeg({ quality: 75 })
//                   .toBuffer();

//                 if (finalBuffer.length > 5 * 1024 * 1024) {
//                   console.warn(
//                     `⚠️ Still too large (${(
//                       finalBuffer.length /
//                       1024 /
//                       1024
//                     ).toFixed(2)} MB), retrying...`
//                   );
//                   finalBuffer = await sharp(finalBuffer)
//                     .jpeg({ quality: 60 })
//                     .toBuffer();
//                 }

//                 if (finalBuffer.length > 5 * 1024 * 1024) {
//                   console.error(
//                     `❌ Still too large after compression. Skipping.`
//                   );
//                   continue;
//                 }

//                 fs.writeFileSync(newFilePath, finalBuffer);
//                 console.log(`✅ JPEG saved after compression: ${newFilePath}`);
//               }
//             }

//             const relativePath = path
//               .relative(BASE_IMAGE_PATH, newFilePath)
//               .replace(/\\/g, '/');
//             updateData[pathField] = relativePath;
//             console.log(`📝 Saved relative path: ${relativePath}`);
//           } else {
//             console.warn(`⚠️ Skipping non-base64 item: ${key} `);
//           }
//         } catch (error) {
//           console.error(`❌ Error processing file ${key}:`, error);
//         }
//       }
//     }
//     const imageRecord = await PropertyImageMast.findOne({
//       where: { ownerid: ownerID },
//     });
//     console.log('Updated data:', updateData);
//     if (imageRecord) {
//       // :white_check_mark: Update existing record
//       const [rowsUpdated] = await PropertyImageMast.update(updateData, {
//         where: { ownerid: ownerID },
//       });
//       if (rowsUpdated === 0) {
//         console.error(':x: No rows updated. Possible constraints issue.');
//       }
//       console.log(
//         ':white_check_mark: Database updated successfully:',
//         rowsUpdated,
//         'row(s) affected'
//       );
//       responses.updated = true

//     } else {
//       newOwnerID === 0 ? newOwnerID = PropertyInfo.propertyMast.OwnerID : newOwnerID
//       const newImageEntry = await PropertyImageMast.create({
//         ownerid: newOwnerID,
//         ...updateData,
//         CreatedBy: ownerID,
//         CreatedDate: new Date(),
//         UpdatedBy: ownerID,
//         UpdatedDate: new Date(),
//       });

//       console.log(
//         ':white_check_mark: New record created successfully:',
//         newImageEntry
//       );
//       newOwnerID === 0 ? responses.created = true : responses.updated = true
//     }

//     //  Handle typeOfUseNonTaxable insert (Capital Value: Yes)

//     if (PropertyInfo.typeOfUseNonTaxableList) {
//       try {
//         const { TypeOfUseID, Type, Description } =
//           PropertyInfo.typeOfUseNonTaxableList;

//         await TypeOfUseMasterNonTaxable.create({
//           TypeOfUseID,
//           Type,
//           Description,
//         });

//         console.log(`✅ Non-taxable use type inserted: ${TypeOfUseID}`);
//       } catch (error) {
//         if (error.name === 'SequelizeUniqueConstraintError') {
//           console.warn(`⚠️ TypeOfUseID already exists: ${error.message}`);
//         } else {
//           console.error(`❌ Error inserting TypeOfUse:`, error.message);
//         }
//       }
//     }
//     // Handle PropertyDetailsOld data
//     if (
//       Array.isArray(PropertyInfo.propertyDetailsOld) &&
//       PropertyInfo.propertyDetailsOld.length > 0
//     ) {
//       for (const oldDetail of PropertyInfo.propertyDetailsOld) {
//         if (!oldDetail || typeof oldDetail !== 'object') {
//           console.warn('⚠️ Skipping invalid propertyDetailsOld entry:', oldDetail);
//           continue;
//         }

//         try {
//           const PDOId = oldDetail.PDOId;
//           const incomingOwnerID = oldDetail.OwnerID || PropertyInfo.propertyMast.OwnerID;
//           const actualOwnerID = incomingOwnerID === 0 ? newOwnerID : incomingOwnerID;

//           // ❌ DELETE if flag is set
//           if (Array.isArray(oldDetail)) {
//             for (const pdoId of oldDetail) {
//               console.log('❌ Deleting propertyDetailsOld with PDOId:', pdoId);

//               await propertydetailsold.destroy({
//                 where: { PDOId: pdoId }
//               });
//             }
//             responses.updated = true;
//             continue;
//           }

//           // 🔍 Check if record exists
//           const existing = await propertydetailsold.findOne({
//             where: { PDOId }
//           });

//           if (existing) {
//             // ✏️ UPDATE
//             const { Insert, Update, Delete, ...updateDetails } = oldDetail;

//             console.log('✏️ Updating propertyDetailsOld:', PDOId, updateDetails);

//             await propertydetailsold.update(
//               {
//                 ...updateDetails,
//                 OwnerID: actualOwnerID
//               },
//               { where: { PDOId } }
//             );

//             responses.updated = true;
//           } else {
//             // 🆕 INSERT
//             const { Insert, Update, Delete, ...insertDetails } = oldDetail;

//             console.log('➕ Inserting new propertyDetailsOld:', PDOId, insertDetails);

//             await propertydetailsold.create({
//               ...insertDetails,
//               PDOId,
//               OwnerID: actualOwnerID
//             });

//             incomingOwnerID === 0 ? responses.created = true : responses.updated = true
//           }
//         } catch (err) {
//           console.error(
//             '❌ Error while processing propertyDetailsOld entry:',
//             err,
//             oldDetail
//           );
//           throw err;
//         }
//       }
//     }

//     // Determine response status
//     console.log('📤 Final Responses:PropertyInfo.retentionTaxData', PropertyInfo.retentionTaxData);
//     if (PropertyInfo.retentionTaxData) {
//       let ownerID = PropertyInfo.retentionTaxData.OwnerID;

//       // Clone and clean data — convert empty strings to null
//       const cleanedRetentionData = Object.fromEntries(
//         Object.entries(PropertyInfo.retentionTaxData)
//           .filter(([_, value]) => value !== undefined && value !== null)
//           .map(([key, value]) => [key, value === '' ? null : value])
//       );

//       try {
//         // Check if record exists first
//         const existing = await Retentiontaxmast.findOne({
//           where: { OwnerID: ownerID }
//         });

//         if (existing) {
//           const updateData = Object.fromEntries(
//             Object.entries(cleanedRetentionData).filter(([key]) => key !== 'OwnerID')
//           );

//           if (Object.keys(updateData).length > 0) {
//             await Retentiontaxmast.update(updateData, {
//               where: { OwnerID: ownerID }
//             });
//             console.log(`Retentiontaxmast updated for OwnerID ${ownerID}`, updateData);
//             responses.updated = true;
//           }
//         } else {
//           // Insert new record
//           if (ownerID) {
//             await Retentiontaxmast.create({
//               ...cleanedRetentionData,
//               OwnerID: ownerID
//             });
//             console.log(`Retentiontaxmast created for OwnerID ${ownerID}`, cleanedRetentionData);
//             responses.created = true;
//           }
//         }
//       } catch (error) {
//         console.error("Error saving Retentiontaxmast:", error);
//       }
//     }

//     const statusCode = responses.created
//       ? 200
//       : responses.updated
//         ? 201
//         : 200;

//     const message = responses.created
//       ? 'Property information created successfully'
//       : 'Property information updated successfully';

//       // ✅ Determine finalOwnerID (new or existing)
// const finalOwnerID = newOwnerID !== 0 ? newOwnerID : PropertyInfo.propertyMast.OwnerID;

// console.log('Final OwnerID to return:', finalOwnerID);
// return res.status(statusCode).json({
//   message,
//   OwnerID: finalOwnerID, // <-- return it here
// });

//   } catch (error) {
//     console.error('Error saving property information:', error.message);
//     return res
//       .status(500)
//       .json({ message: 'Internal server error', error: error.message });
//   }
// };

export const deletePropertyDetails = async (req, res) => {
  const { OwnerID } = req.body;

  try {
    await sequelize.query('CALL prcDeleteEntryFromDatabase(:OwnerID)', {
      replacements: { OwnerID: OwnerID },
    });

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the entry' });
  }
};

// Fetch all room shape names
// export const getAllRoomShapeNames = async (req, res) => {
//   try {
//     // Fetch all RoomShapeMaster records, but only the RoomShapeName field
//     const roomShapes = await RoomShapeMaster.findAll({
//       attributes: ['ShapeID', 'RoomShapeName'],
//     });

//     // Check if any data was found
//     if (roomShapes.length > 0) {
//       res.status(200).json({
//         success: true,
//         data: roomShapes,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: 'No room shapes found',
//       });
//     }
//   } catch (error) {
//     // Handle any error
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while fetching room shapes',
//       error: error.message,
//     });
//   }
// };
export const getAllRoomShapeNames = async (req, res) => {
  try {
    const roomShapes = await RoomShapeMaster.findAll({
      attributes: ['ShapeID', 'RoomShapeName'],
    });

    const shapesWithFormula = roomShapes.map((shape) => {
      const name = shape.RoomShapeName?.trim().toLowerCase();

      switch (name) {
        case 'rectangle':
          return {
            ...shape.dataValues,
            Fields: ['Length', 'Width'],
            Formula: 'Length * Width',
          };

        case 'circle':
          return {
            ...shape.dataValues,
            Fields: ['Radius'],
            Formula: 'Math.PI * Math.pow(Radius, 2)',
          };

        case 'semi-circle':
          return {
            ...shape.dataValues,
            Fields: ['Radius'],
            Formula: '(Math.PI * Math.pow(Radius, 2)) / 2',
          };

        case 'hexagon':
          return {
            ...shape.dataValues,
            Fields: ['Length'],
            Formula: '((3 * Math.sqrt(3)) / 2) * Math.pow(Length, 2)',
          };

        case 'pentagon':
          return {
            ...shape.dataValues,
            Fields: ['Radius'],
            Formula:
              '(Math.sqrt(5 * (5 + 2 * Math.sqrt(5))) / 4) * Math.pow(Radius * 2, 2)',
          };

        case 'equilateral triangle':
          return {
            ...shape.dataValues,
            Fields: ['Length'],
            Formula: '(Math.sqrt(3) / 4) * Math.pow(Length, 2)',
          };

        case 'non-equilateral triangle':
          return {
            ...shape.dataValues,
            Fields: ['length_a', 'length_b', 'length_c'],
            Formula: 'heron(length_a, length_b, length_c)', // Heron’s formula handle karna padega frontend me
          };

        case 'right angle triangle':
          return {
            ...shape.dataValues,
            Fields: ['Base', 'Height'],
            Formula: '(Base * Height) / 2',
          };

        case 'trapezoid':
        case 'trapezoidal':
          return {
            ...shape.dataValues,
            Fields: ['SmallBase', 'LargeBase', 'Height'],
            Formula: '((SmallBase + LargeBase) * Height) / 2',
          };

        case 'octagon':
          return {
            ...shape.dataValues,
            Fields: ['Length'],
            Formula: '2 * (1 + Math.sqrt(2)) * Math.pow(Length, 2)',
          };

        default:
          return {
            ...shape.dataValues,
            Fields: [],
            Formula: null,
          };
      }
    });

    res.status(200).json({
      success: true,
      data: shapesWithFormula,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching room shapes',
      error: error.message,
    });
  }
};

export const getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomTypeMaster.findAll();
    res.status(200).json(roomTypes);
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({ message: 'Failed to fetch room types.' });
  }
};
// type based Description fatch
export const getTypeOfUseByGroup = async (req, res) => {
  try {
    const data = await TypeofUseMaster.findAll();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching type of use by group:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
export const getAllUseGroups = async (req, res) => {
  try {
    const result = await TypeOfUseGroupMaster.findAll({
      attributes: ['GroupID', 'GroupDescription'],
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching group list:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTapSizes = async (req, res) => {
  try {
    const result = await TapSizeMaster.findAll({
      attributes: ['TapSizeId', 'SizeAlias'],
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching tap sizes:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getValuationData = async (req, res) => {
  const { OwnerID } = req.body;
  let prcCalculateRCWiseNewNOldValuationNew = [];
  try {
    const netTaxes = await sequelize.query(
      'call prcOverAllNetTaxes (:ownerId)',
      {
        replacements: {
          ownerId: OwnerID,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const retain = await Retentiontaxmast.findAll({
      where: { OwnerID: OwnerID },
      raw: true,
    });
    const hearing = await HearingMast.findAll({
      where: { OwnerID: OwnerID },
      raw: true,
    });
    const appeal = await AppealMast.findAll({
      where: { OwnerID: OwnerID },
      raw: true,
    });
    const oldDetail = await OldPropertyMast.findAll({
      where: { OwnerID: OwnerID },
      raw: true,
    });
    prcCalculateRCWiseNewNOldValuationNew = await sequelize.query(
      'call prcCalculateRCWiseNewNOldValuationNew ( :ownerId)',
      {
        replacements: {
          ownerId: OwnerID,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const transformedData =
      Object.values(prcCalculateRCWiseNewNOldValuationNew[4]) || [];
    console.log(transformedData, 'transformedData');
    const funGetAllNETTaxes = transformedData;
    let result = [];
    result.push(netTaxes);
    result.push(retain);
    result.push(hearing);
    result.push(appeal);
    result.push(oldDetail);
    result.push(funGetAllNETTaxes);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching valuation data:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getRetainData = async (req, res) => {
  const { OwnerID } = req.body;

  if (!OwnerID) {
    return res.status(400).json({ message: 'OwnerID is required' });
  }

  try {
    const retain = await Retentiontaxmast.findOne({
      where: { OwnerID: OwnerID },
      raw: true,
    });

    if (!retain || retain.length === 0) {
      return res.status(204).json({ message: 'No retention data found' });
    }

    res.status(200).json({ retain });
  } catch (error) {
    console.error('Error fetching retention data:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
export const addCombinedProperties = async (req, res) => {
  const { IDs, selectedOwnerID } = req.body;
  console.log(IDs, 'IDs');
  console.log(selectedOwnerID, 'selectedOwnerID');

  try {
    let updatedCount = 0;

    for (const id of IDs) {
      // Check if the OwnerID exists in at least one table
      const existsForPropertyDetails = await PropertyDetailsNew.findOne({
        where: { OwnerID: id },
      });
      const existsForFloorSubmissionDetails =
        await FloorSubmissionDetails.findOne({ where: { OwnerID: id } });
      const existsForFloorSubmissionDetailsMinus =
        await FloorSubmissionDetailsMinusData.findOne({
          where: { OwnerID: id },
        });

      if (existsForPropertyDetails) {
        await PropertyDetailsNew.update(
          { OwnerID: selectedOwnerID, UpdatedDate: new Date() },
          { where: { OwnerID: id } }
        );
        updatedCount++;
      }

      if (existsForFloorSubmissionDetails) {
        await FloorSubmissionDetails.update(
          { OwnerID: selectedOwnerID,  UpdatedDate: new Date() },
          { where: { OwnerID: id } }
        );
        updatedCount++;
      }
      if (existsForFloorSubmissionDetailsMinus) {
        await FloorSubmissionDetailsMinusData.update(
          { OwnerID: selectedOwnerID,  UpdatedDate: new Date() },
          { where: { OwnerID: id } }
        );
        updatedCount++;
      }
    }

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ message: 'No matching OwnerIDs found in any table.' });
    }

    return res.status(200).json({
      message: 'Combined properties added successfully.',
      updatedRecords: updatedCount,
    });
  } catch (error) {
    console.error('Error adding combined properties:', error);
    res
      .status(500)
      .json({ message: 'Error adding combined properties', error });
  }
};

export const checkPDNIdForGeneratingNew = async (req, res) => {
  const { newId } = req.body;
  console.log(newId, 'newId for pdnid');
  try {
    const exists = await PropertyDetailsNew.findAll({
      where: { PDNId: newId },
    });
    if (exists && exists.length > 0) {
      // Already exists
      return res.status(200).json({ message: 'Already Exists' });
    } else {
      // Not found
      return res.status(200).json({ message: 'Available' });
    }
  } catch (error) {
    console.log(error, 'error in generating pdnID');
  }
};

export const checkFSDIdForGeneratingNew = async (req, res) => {
  const { newId } = req.body;
  console.log(newId, 'newId for fsdid');
  try {
    const exists = await FloorSubmissionDetails.findAll({
      where: { FSDId: newId },
    });
    if (exists && exists.length > 0) {
      // Already exists
      return res.status(200).json({ message: 'Already Exists' });
    } else {
      // Not found
      return res.status(200).json({ message: 'Available' });
    }
  } catch (error) {
    console.log(error, 'error in generating FSDID');
  }
};
export const checkFSDMDIdForGeneratingNew = async (req, res) => {
  const { newId } = req.body;
  console.log(newId, 'newId for fsdmdid');
  try {
    const exists = await FloorSubmissionDetailsMinusData.findAll({
      where: { FSDMDId: newId },
    });
    if (exists && exists.length > 0) {
      // Already exists
      return res.status(200).json({ message: 'Already Exists' });
    } else {
      // Not found
      return res.status(200).json({ message: 'Available' });
    }
  } catch (error) {
    console.log(error, 'error in generating fsdmdid');
  }
};
export const permissionForSubmission = async (req, res) => {
  try {
    const rule = await AssessmentRulesMaster.findOne();

    if (!rule) {
      return res.status(404).json({ message: 'No rules found' });
    }

    // assuming your model has IsSubOnDataEntry column:
    res.status(200).json({
      permission: rule, // true/false
    });
  } catch (error) {
    console.error('error in permission for submission', error);
    res.status(500).json({
      message: 'Error checking permission for submission',
      error: error.message,
    });
  }
};
export const getConvertedImg = async (req, res) => {
  try {
    const base64WMF = req.body.base64Image;
    if (!base64WMF) return res.status(400).json({ error: 'Missing image' });

    // Decode base64
    const wmfBuffer = Buffer.from(
      base64WMF.replace(/^data:.*;base64,/, ''),
      'base64'
    );

    // Save WMF to a specific folder
    const outputDir = path.join(process.cwd(), 'converted_files'); // Change as needed
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const wmfFilePath = path.join(outputDir, `input_${Date.now()}.wmf`);
    fs.writeFileSync(wmfFilePath, wmfBuffer);

    // PNG output path
    const pngFilePath = path.join(outputDir, `output_${Date.now()}.png`);

    // Use ImageMagick to convert
    exec(
      `magick "${wmfFilePath}" "${pngFilePath}"`,
      (error, stdout, stderr) => {
        // Delete the WMF file immediately after conversion attempt
        fs.unlinkSync(wmfFilePath);

        if (error) {
          console.error('Conversion error:', stderr || error);
          // If PNG was created partially, delete it
          if (fs.existsSync(pngFilePath)) fs.unlinkSync(pngFilePath);
          return res.status(500).json({
            error: 'Conversion failed',
            details: stderr || error.message,
          });
        }

        const pngBase64 =
          'data:image/png;base64,' +
          fs.readFileSync(pngFilePath).toString('base64');

        // Delete the PNG file after reading
        fs.unlinkSync(pngFilePath);

        return res.json({ png: pngBase64 });
      }
    );
  } catch (err) {
    console.error('Conversion failed:', err);
    res.status(500).json({ error: err.toString() });
  }
};
///amc(data enrty approval)


// export const insertOwnerTaxChange = async (req, res) => {
//   const { OwnerID, Year, CreatedBy } = req.body;

//   try {
//     // 1️⃣ Last appeal mast row for this owner & year
//     const lastAppeal = await AppealMast.findOne({
//       where: { OwnerID, Year },
//       order: [['CreatedDate', 'DESC']]
//     });

//     if (!lastAppeal) {
//       return res.status(404).json({ message: 'No appeal record found for this owner and year' });
//     }

//     // 2️⃣ Check if TaxPendingDetails exists for this owner & year
//     const existingTaxPending = await TaxPendingDetails.findOne({
//       where: { OwnerID, PendingYear: Year }
//     });

//     let beforeTaxRow = null;
//     let afterTaxRow = null;

//     if (existingTaxPending) {
//       // 3️⃣ Last TaxPendingDetailsVersionHistory row (previous state)
//       const lastTaxPendingVersion = await TaxPendingDetailsVersionHistory.findOne({
//         where: { OwnerID, PendingYear: Year },
//         order: [['CreatedDate', 'DESC']]
//       });

//       const beforeTaxData = lastTaxPendingVersion
//         ? {
//             ...lastTaxPendingVersion.toJSON(),
//             TPDID: undefined,
//             CreatedDate: new Date(),
//             UpdatedDate: new Date(),
//             AfterBefore: 'Before',
//             UpdatedBy: CreatedBy,
//             CreatedBy
//           }
//         : {
//             OwnerID,
//             PendingYear: Year,
//             PropertyTax: lastAppeal?.PropertyTax || 0,
//             EducationTax: lastAppeal?.EducationTax || 0,
//             TreeCess: lastAppeal?.TreeCess || 0,
//             EmploymentTax: lastAppeal?.EmploymentTax || 0,
//             SpEducationTax: lastAppeal?.SpEducationTax || 0,
//             FireCess: lastAppeal?.FireCess || 0,
//             MajorBuilding: lastAppeal?.MajorBuilding || 0,
//             LightCess: lastAppeal?.LightCess || 0,
//             RoadCess: lastAppeal?.RoadCess || 0,
//             DrainCess: lastAppeal?.DrainCess || 0,
//             SewageDisposalCess: lastAppeal?.SewageDisposalCess || 0,
//             Sanitation: lastAppeal?.Sanitation || 0,
//             SpWaterCess: lastAppeal?.SpWaterCess || 0,
//             WaterBenefit: lastAppeal?.WaterBenefit || 0,
//             WaterBill: lastAppeal?.WaterBill || 0,
//             TaxTotal: lastAppeal?.TaxTotal || 0,
//             Interest: lastAppeal?.Interest || 0,
//             NetTotal: lastAppeal?.NetTotal || 0,
//             Remark: lastAppeal?.Reason || '',
//             Tax2: lastAppeal?.Tax2 || 0,
//             Tax3: lastAppeal?.Tax3 || 0,
//             Tax4: lastAppeal?.Tax4 || 0,
//             Tax5: lastAppeal?.Tax5 || 0,
//             UpdatedBy: CreatedBy,
//             CreatedBy,
//             OriginalID: lastAppeal?.appealmastID || null,
//             ScreenName: 'Data Entry',
//             ChangeOnControl: 0,
//             EntryType: 'Insert',
//             UpdVersionID: 1,
//             AfterBefore: 'Before'
//           };

//       beforeTaxRow = await TaxPendingDetailsVersionHistory.create(beforeTaxData);

//       const taxFields = [
//         'PropertyTax','EducationTax','TreeCess','EmploymentTax','SpEducationTax',
//         'FireCess','MajorBuilding','LightCess','RoadCess','DrainCess',
//         'SewageDisposalCess','Sanitation','SpWaterCess','WaterBenefit','WaterBill',
//         'Tax2','Tax3','Tax4','Tax5'
//       ];

//       const afterTaxData = { ...beforeTaxData, OriginalID: lastAppeal.appealmastID || null, AfterBefore: 'After' };

//       taxFields.forEach(field => {
//         afterTaxData[field] = lastAppeal[field];
//       });

//       afterTaxRow = await TaxPendingDetailsVersionHistory.create(afterTaxData);
//     }

//     // 4️⃣ Check if TransMast exists for this owner & year
//     const existingTransRow = await TransMast.findOne({
//       where: { OwnerID, FinanceYear: Year }
//     });

//     let beforeTransRow = null;
//     let afterTransRow = null;

//     if (existingTransRow) {
//       // 5️⃣ Last TransMastVersionHistory row (previous state)
//       const lastTransVersion = await TransMastVersionHistory.findOne({
//         where: { OwnerID, FinanceYear: Year },
//         order: [['CreatedDate', 'DESC']]
//       });

//       const beforeTransData = lastTransVersion
//         ? { ...lastTransVersion.toJSON(), CreatedDate: new Date(), UpdatedDate: new Date(), AfterBefore: 'Before', UpdatedBy: CreatedBy, CreatedBy }
//         : {
//             OwnerID,
//             FinanceYear: Year,
//             PropertyTax: lastAppeal?.PropertyTax || 0,
//             EducationTax: lastAppeal?.EducationTax || 0,
//             EmploymentTax: lastAppeal?.EmploymentTax || 0,
//             TreeCess: lastAppeal?.TreeCess || 0,
//             SpEducationTax: lastAppeal?.SpEducationTax || 0,
//             FireCess: lastAppeal?.FireCess || 0,
//             MajorBuilding: lastAppeal?.MajorBuilding || 0,
//             LightCess: lastAppeal?.LightCess || 0,
//             RoadCess: lastAppeal?.RoadCess || 0,
//             DrainCess: lastAppeal?.DrainCess || 0,
//             SewageDisposalCess: lastAppeal?.SewageDisposalCess || 0,
//             Sanitation: lastAppeal?.Sanitation || 0,
//             SpWaterCess: lastAppeal?.SpWaterCess || 0,
//             WaterBenefit: lastAppeal?.WaterBenefit || 0,
//             WaterBill: lastAppeal?.WaterBill || 0,
//             TaxTotal: lastAppeal?.TaxTotal || 0,
//             Interest: lastAppeal?.Interest || 0,
//             UpdatedBy: CreatedBy,
//             CreatedBy,
//             OriginalOwnerID: lastAppeal?.appealmastID || null,
//             ScreenName: 'Data Entry',
//             ChangeOnControl: 0,
//             EntryType: 'Insert',
//             UpdVersionID: 1,
//             AfterBefore: 'Before',
//             CreatedDate: new Date(),
//             UpdatedDate: new Date()
//           };

//       beforeTransRow = await TransMastVersionHistory.create(beforeTransData);

//       const transFields = [
//         'PropertyTax','EducationTax','TreeCess','EmploymentTax','SpEducationTax',
//         'FireCess','MajorBuilding','LightCess','RoadCess','DrainCess',
//         'SewageDisposalCess','Sanitation','SpWaterCess','WaterBenefit','WaterBill',
//         'Tax1','Tax2','Tax3','Tax4','Tax5'
//       ];

//       const afterTransData = { ...beforeTransData, OriginalOwnerID: lastAppeal?.appealmastID || null, AfterBefore: 'After' };

//       transFields.forEach(field => {
//         afterTransData[field] = lastAppeal[field];
//       });

//       afterTransRow = await TransMastVersionHistory.create(afterTransData);
//     }

//     res.status(200).json({ 
//       message: 'Owner tax change inserted in both tables (conditional version history)', 
//       taxPending: { before: beforeTaxRow, after: afterTaxRow },
//       transMast: { before: beforeTransRow, after: afterTransRow }
//     });

//   } catch (error) {
//     console.error('Insert Owner Tax Change Error:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };
//sucess
// export const insertOwnerTaxChange = async (req, res) => {
//   const { OwnerID, Year, CreatedBy } = req.body;

//   try {
//     // ================= YEAR LOGIC =================
//     // "2024-2025" -> startYear = 2024
//     const startYear = Number(String(Year).split('-')[0]);

//     const searchYear = startYear;       // 👈 DB search year (OLD DATA)
//     const currentYear = startYear + 1; // 👈 INSERT / CURRENT YEAR

//     console.log("UI Finance Year:", Year);
//     console.log("Search Year (OLD):", searchYear);
//     console.log("Current Year (INSERT):", currentYear);

//     // ================= 1️⃣ LAST APPEAL (OLD YEAR) =================
//     const lastAppeal = await AppealMast.findOne({
//       where: { OwnerID, Year: searchYear },
//       order: [['CreatedDate', 'DESC']]
//     });

//     if (!lastAppeal) {
//       return res.status(404).json({
//         message: `No appeal record found for owner ${OwnerID} for year ${searchYear}`
//       });
//     }

//     // ================= 2️⃣ TAX PENDING EXISTS (OLD YEAR) =================
//     const existingTaxPending = await TaxPendingDetails.findOne({
//       where: { OwnerID, PendingYear: searchYear }
//     });

//     let beforeTaxRow = null;
//     let afterTaxRow = null;

//     if (existingTaxPending) {
//       // ================= 3️⃣ LAST TAX PENDING VERSION (OLD YEAR) =================
//       const lastTaxPendingVersion =
//         await TaxPendingDetailsVersionHistory.findOne({
//           where: { OwnerID, PendingYear: searchYear },
//           order: [['CreatedDate', 'DESC']]
//         });

//       const beforeTaxData = lastTaxPendingVersion
//         ? {
//             ...lastTaxPendingVersion.toJSON(),
//             TPDID: undefined,
//             CreatedDate: new Date(),
//             UpdatedDate: new Date(),
//             PendingYear: currentYear, // 👈 INSERT AS CURRENT YEAR
//             AfterBefore: 'Before',
//             UpdatedBy: CreatedBy,
//             CreatedBy
//           }
//         : {
//             OwnerID,
//             PendingYear: currentYear, // 👈 CURRENT YEAR
//             PropertyTax: lastAppeal?.PropertyTax || 0,
//             EducationTax: lastAppeal?.EducationTax || 0,
//             TreeCess: lastAppeal?.TreeCess || 0,
//             EmploymentTax: lastAppeal?.EmploymentTax || 0,
//             SpEducationTax: lastAppeal?.SpEducationTax || 0,
//             FireCess: lastAppeal?.FireCess || 0,
//             MajorBuilding: lastAppeal?.MajorBuilding || 0,
//             LightCess: lastAppeal?.LightCess || 0,
//             RoadCess: lastAppeal?.RoadCess || 0,
//             DrainCess: lastAppeal?.DrainCess || 0,
//             SewageDisposalCess: lastAppeal?.SewageDisposalCess || 0,
//             Sanitation: lastAppeal?.Sanitation || 0,
//             SpWaterCess: lastAppeal?.SpWaterCess || 0,
//             WaterBenefit: lastAppeal?.WaterBenefit || 0,
//             WaterBill: lastAppeal?.WaterBill || 0,
//             TaxTotal: lastAppeal?.TaxTotal || 0,
//             Interest: lastAppeal?.Interest || 0,
//             NetTotal: lastAppeal?.NetTotal || 0,
//             Remark: lastAppeal?.Reason || '',
//             Tax2: lastAppeal?.Tax2 || 0,
//             Tax3: lastAppeal?.Tax3 || 0,
//             Tax4: lastAppeal?.Tax4 || 0,
//             Tax5: lastAppeal?.Tax5 || 0,
//             UpdatedBy: CreatedBy,
//             CreatedBy,
//             OriginalID: lastAppeal?.appealmastID || null,
//             ScreenName: 'Data Entry',
//             ChangeOnControl: 0,
//             EntryType: 'Insert',
//             UpdVersionID: 1,
//             AfterBefore: 'Before'
//           };

//       beforeTaxRow =
//         await TaxPendingDetailsVersionHistory.create(beforeTaxData);

//       const taxFields = [
//         'PropertyTax',
//         'EducationTax',
//         'TreeCess',
//         'EmploymentTax',
//         'SpEducationTax',
//         'FireCess',
//         'MajorBuilding',
//         'LightCess',
//         'RoadCess',
//         'DrainCess',
//         'SewageDisposalCess',
//         'Sanitation',
//         'SpWaterCess',
//         'WaterBenefit',
//         'WaterBill',
//         'Tax2',
//         'Tax3',
//         'Tax4',
//         'Tax5'
//       ];

//       const afterTaxData = {
//         ...beforeTaxData,
//         OriginalID: lastAppeal?.appealmastID || null,
//         AfterBefore: 'After'
//       };

//       taxFields.forEach((field) => {
//         afterTaxData[field] = lastAppeal[field];
//       });

//       afterTaxRow =
//         await TaxPendingDetailsVersionHistory.create(afterTaxData);
//     }

//     // ================= 4️⃣ TRANSMast EXISTS (OLD YEAR) =================
//     const existingTransRow = await TransMast.findOne({
//       where: { OwnerID, FinanceYear: searchYear }
//     });

//     let beforeTransRow = null;
//     let afterTransRow = null;

//     if (existingTransRow) {
//       // ================= 5️⃣ LAST TRANSMast VERSION (OLD YEAR) =================
//       const lastTransVersion = await TransMastVersionHistory.findOne({
//         where: { OwnerID, FinanceYear: searchYear },
//         order: [['CreatedDate', 'DESC']]
//       });

//       const beforeTransData = lastTransVersion
//         ? {
//             ...lastTransVersion.toJSON(),
//             CreatedDate: new Date(),
//             UpdatedDate: new Date(),
//             FinanceYear: currentYear, // 👈 CURRENT YEAR
//             AfterBefore: 'Before',
//             UpdatedBy: CreatedBy,
//             CreatedBy
//           }
//         : {
//             OwnerID,
//             FinanceYear: currentYear, // 👈 CURRENT YEAR
//             PropertyTax: lastAppeal?.PropertyTax || 0,
//             EducationTax: lastAppeal?.EducationTax || 0,
//             EmploymentTax: lastAppeal?.EmploymentTax || 0,
//             TreeCess: lastAppeal?.TreeCess || 0,
//             SpEducationTax: lastAppeal?.SpEducationTax || 0,
//             FireCess: lastAppeal?.FireCess || 0,
//             MajorBuilding: lastAppeal?.MajorBuilding || 0,
//             LightCess: lastAppeal?.LightCess || 0,
//             RoadCess: lastAppeal?.RoadCess || 0,
//             DrainCess: lastAppeal?.DrainCess || 0,
//             SewageDisposalCess: lastAppeal?.SewageDisposalCess || 0,
//             Sanitation: lastAppeal?.Sanitation || 0,
//             SpWaterCess: lastAppeal?.SpWaterCess || 0,
//             WaterBenefit: lastAppeal?.WaterBenefit || 0,
//             WaterBill: lastAppeal?.WaterBill || 0,
//             TaxTotal: lastAppeal?.TaxTotal || 0,
//             Interest: lastAppeal?.Interest || 0,
//             UpdatedBy: CreatedBy,
//             CreatedBy,
//             OriginalOwnerID: lastAppeal?.appealmastID || null,
//             ScreenName: 'Data Entry',
//             ChangeOnControl: 0,
//             EntryType: 'Insert',
//             UpdVersionID: 1,
//             AfterBefore: 'Before',
//             CreatedDate: new Date(),
//             UpdatedDate: new Date()
//           };

//       beforeTransRow =
//         await TransMastVersionHistory.create(beforeTransData);

//       const transFields = [
//         'PropertyTax',
//         'EducationTax',
//         'TreeCess',
//         'EmploymentTax',
//         'SpEducationTax',
//         'FireCess',
//         'MajorBuilding',
//         'LightCess',
//         'RoadCess',
//         'DrainCess',
//         'SewageDisposalCess',
//         'Sanitation',
//         'SpWaterCess',
//         'WaterBenefit',
//         'WaterBill',
//         'Tax1',
//         'Tax2',
//         'Tax3',
//         'Tax4',
//         'Tax5'
//       ];

//       const afterTransData = {
//         ...beforeTransData,
//         OriginalOwnerID: lastAppeal?.appealmastID || null,
//         AfterBefore: 'After'
//       };

//       transFields.forEach((field) => {
//         afterTransData[field] = lastAppeal[field];
//       });

//       afterTransRow =
//         await TransMastVersionHistory.create(afterTransData);
//     }

//     // ================= RESPONSE =================
//     res.status(200).json({
//       message: 'Owner tax change inserted successfully (search OLD year, insert CURRENT year)',
//       years: {
//         uiYear: Year,
//         searchYear,
//         currentYear
//       },
//       taxPending: {
//         before: beforeTaxRow,
//         after: afterTaxRow
//       },
//       transMast: {
//         before: beforeTransRow,
//         after: afterTransRow
//       }
//     });
//   } catch (error) {
//     console.error('Insert Owner Tax Change Error:', error);
//     res.status(500).json({
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };
import { v4 as uuidv4 } from 'uuid';
import PropertyFullRowHistory from '../../models/models/propertymastHistoryMaintain.js';
import PropertyMastHistory from '../../models/models/propertyMast_history_version.js';
import CombinedOwnerNameHistory from '../../models/models/combinedOwnerRenterNamesHistory.js';
import PropertyDetailsNewHistory from '../../models/models/propertyDetailsNew_historyVersion.js';
import PropertySocialDetailsHistory from '../../models/models/proeprtySocailDetails_versionHistory.js';
import { OldPropertyMastHistory } from '../../models/models/oldPropertyMast_versionHistory.js';
import OldTaxesHistory from '../../models/models/oldTax_historyVersion.js';
import PropertyDetailsOldHistory from '../../models/models/propertyDetailsOldVersionHistory.js';
import ChangeVersionMaster from '../../models/models/changeversionmaster.js';
import { Op } from 'sequelize';


// export const insertOwnerTaxChange = async (req, res) => {
//   let { OwnerID, Year, CreatedBy } = req.body;

//   if (!OwnerID || !CreatedBy) {
//     return res.status(400).json({
//       success: false,
//       message: 'OwnerID and CreatedBy are required'
//     });
//   }

//   // 🔥 Reason → AppliedPolicyMast column mapping (case-insensitive)
//   const normalizeReason = (val) =>
//     String(val || '').trim().toLowerCase();

//   const reasonToColumnMap = {
//     appeal: 'Appeal',
//     hearing: 'Hearing',
//     retention: 'Retaintion',
//     retaintion: 'Retaintion',
//     courtresult: 'CourtResult'
//   };

//   const t = await sequelize.transaction();

//   try {
//     /* ======================================================
//        1️⃣ FIND YEAR IF NOT PROVIDED (LATEST FROM TRANSMAST)
//     ====================================================== */
//     if (!Year) {
//       const latestTrans = await TransMast.findOne({
//         where: { OwnerID },
//         order: [['FinanceYear', 'DESC']],
//         transaction: t
//       });

//       if (!latestTrans) {
//         await t.rollback();
//         return res.status(404).json({
//           success: false,
//           message: 'No tax data found in TransMast for this owner'
//         });
//       }

//       Year = latestTrans.FinanceYear;
//     }

//     /* ======================================================
//        2️⃣ GET LATEST APPEAL (Owner + Year)
//     ====================================================== */
//     const latestAppeal = await AppealMast.findOne({
//       where: { OwnerID, Year },
//       order: [['UpdatedDate', 'DESC']],
//       transaction: t
//     });

//     if (!latestAppeal) {
//       await t.rollback();
//       return res.status(404).json({
//         success: false,
//         message: `No appeal record found for Owner ${OwnerID} and Year ${Year}`
//       });
//     }

//     /* ======================================================
//        3️⃣ CHECK APPLIED POLICY (DYNAMIC COLUMN)
//     ====================================================== */
//     const normalizedReason = normalizeReason(latestAppeal.Reason);
//     const reasonColumn = reasonToColumnMap[normalizedReason];

//     if (!reasonColumn) {
//       await t.rollback();
//       return res.status(400).json({
//         success: false,
//         message: `Invalid Reason: ${latestAppeal.Reason}`
//       });
//     }

//     const appliedPolicy = await AppliedPolicyMast.findOne({
//       where: {
//         OwnerID,
//         [reasonColumn]: 1
//       },
//       transaction: t
//     });

//     if (!appliedPolicy) {
//       await t.rollback();
//       return res.status(404).json({
//         success: false,
//         message: `No applied policy found for reason: ${latestAppeal.Reason}`
//       });
//     }

//     const versionID = uuidv4();

//     /* ======================================================
//        4️⃣ BEFORE → FULL TRANSMAST COPY
//     ====================================================== */
//     const beforeTax = await TransMast.findOne({
//       where: { OwnerID, FinanceYear: Year },
//       transaction: t
//     });

//     if (!beforeTax) {
//       await t.rollback();
//       return res.status(404).json({
//         success: false,
//         message: `No tax data found in TransMast for year ${Year}`
//       });
//     }

//     const beforePlain = beforeTax.get({ plain: true });

//     await TransMastVersionHistory.create({
//       ...beforePlain,
//       OwnerID,
//       FinanceYear: Year,

//       ScreenName: 'TransMast',
//       EntryType: 'Update',
//       ChangeOnControl: 'Upsert',
//       Remark: latestAppeal.Reason || '',

//       CreatedBy,
//       UpdatedBy: CreatedBy,

//       UpdVersionID: versionID,
//       AfterBefore: 'BEFORE'
//     }, { transaction: t });

//     /* ======================================================
//        5️⃣ AFTER → FULL APPEALMAST COPY
//     ====================================================== */
//     const afterPlain = latestAppeal.get({ plain: true });

//     await TransMastVersionHistory.create({
//       ...afterPlain,
//       OwnerID,
//       FinanceYear: Year,

//       ScreenName: 'AppealMast',
//       EntryType: 'Update',
//       ChangeOnControl: 'Upsert',
//       Remark: latestAppeal.Reason || '',

//       CreatedBy,
//       UpdatedBy: CreatedBy,

//       UpdVersionID: versionID,
//       AfterBefore: 'AFTER'
//     }, { transaction: t });

//     /* ======================================================
//        6️⃣ COMMIT
//     ====================================================== */
//     await t.commit();

//     /* ======================================================
//        7️⃣ FETCH FULL BEFORE / AFTER ROWS
//     ====================================================== */
//     const historyRows = await TransMastVersionHistory.findAll({
//       where: {
//         OwnerID,
//         FinanceYear: Year,
//         UpdVersionID: versionID
//       },
//       order: [['AfterBefore', 'ASC']]
//     });

//     const beforeRow = historyRows.find(r => r.AfterBefore === 'BEFORE') || null;
//     const afterRow  = historyRows.find(r => r.AfterBefore === 'AFTER') || null;

//     /* ======================================================
//        8️⃣ RESPONSE
//     ====================================================== */
//     return res.status(200).json({
//       success: true,
//       message: 'Owner tax change captured successfully (Before / After)',
//       data: {
//         OwnerID,
//         Year,
//         Reason: latestAppeal.Reason,
//         AppliedPolicyColumn: reasonColumn,
//         UpdVersionID: versionID,
//         before: beforeRow,
//         after: afterRow
//       }
//     });

//   } catch (error) {
//     await t.rollback();
//     console.error('Insert Owner Tax Change Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };
export const insertOwnerTaxChange = async (req, res) => {
  let { OwnerID, Year, CreatedBy } = req.body;

  if (!OwnerID || !CreatedBy) {
    return res.status(400).json({
      success: false,
      message: 'OwnerID and CreatedBy are required'
    });
  }

  const normalizeReason = (val) => String(val || '').trim().toLowerCase();

  const reasonToColumnMap = {
    appeal: 'Appeal',
    hearing: 'Hearing',
    retention: 'Retaintion',
    retaintion: 'Retaintion',
    courtresult: 'CourtResult'
  };

  const t = await sequelize.transaction();

  try {
    /* ======================================================
       1️⃣ FIND YEAR IF NOT PROVIDED
    ====================================================== */
    if (!Year) {
      const latestTrans = await TransMast.findOne({
        where: { OwnerID },
        order: [['FinanceYear', 'DESC']],
        transaction: t
      });

      if (!latestTrans) {
        await t.rollback();
        return res.status(404).json({ success: false, message: 'No tax data found' });
      }
      Year = latestTrans.FinanceYear;
    }

    /* ======================================================
       2️⃣ GET LATEST APPEAL
    ====================================================== */
    const latestAppeal = await AppealMast.findOne({
      where: { OwnerID, Year },
      order: [['UpdatedDate', 'DESC']],
      transaction: t
    });

    if (!latestAppeal) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'No appeal record found' });
    }

    const normalizedReason = normalizeReason(latestAppeal.Reason);
    const reasonColumn = reasonToColumnMap[normalizedReason];

    const appliedPolicy = await AppliedPolicyMast.findOne({
      where: { OwnerID, [reasonColumn]: 1 },
      transaction: t
    });

    if (!appliedPolicy) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'No applied policy found' });
    }

    const versionID = uuidv4();

    /* ======================================================
       4️⃣ BEFORE → FROM TRANSMAST
    ====================================================== */
    const beforeTax = await TransMast.findOne({
      where: { OwnerID, FinanceYear: Year },
      transaction: t
    });

    const beforePlain = beforeTax ? beforeTax.get({ plain: true }) : {};

    await TransMastVersionHistory.create({
      ...beforePlain,
      OwnerID,
      FinanceYear: Year,
      ScreenName: 'TransMast',
      EntryType: 'Update',
      ChangeOnControl: 'Upsert',
      Remark: latestAppeal.Reason || '',
      CreatedBy,
      UpdatedBy: CreatedBy,
      UpdVersionID: transactionVersionID,
      AfterBefore: 'BEFORE'
    }, { transaction: t });

    /* ======================================================
       5️⃣ AFTER → FROM APPEALMAST (FIXED MAPPING)
    ====================================================== */
    const afterPlain = latestAppeal.get({ plain: true });

    await TransMastVersionHistory.create({
      ...beforePlain, // Pehle base values (taaki baaki columns NULL na ho)
      ...afterPlain,  // Fir Appeal ki values override karein
      
      // Mapping: AppealMast ka RentalValue -> History ka RateableValue
      RateableValue: afterPlain.RentalValue || beforePlain.RateableValue,
      
      // Optional: Agar TaxTotal bhi NULL aa raha hai toh usey calculate kar sakte hain
      TaxTotal: afterPlain.TaxTotal || (
        parseFloat(afterPlain.PropertyTax || 0) + 
        parseFloat(afterPlain.EducationTax || 0) + 
        parseFloat(afterPlain.EmploymentTax || 0)
      ),

      OwnerID,
      FinanceYear: Year,
      ScreenName: 'AppealMast',
      EntryType: 'Update',
      ChangeOnControl: 'Upsert',
      Remark: latestAppeal.Reason || '',
      CreatedBy,
      UpdatedBy: CreatedBy,
      UpdVersionID: transactionVersionID,
      AfterBefore: 'AFTER'
    }, { transaction: t });

    await t.commit();

    /* ======================================================
       7️⃣ FETCH FULL DATA
    ====================================================== */
    const historyRows = await TransMastVersionHistory.findAll({
      where: { OwnerID, FinanceYear: Year, UpdVersionID: transactionVersionID },
      order: [['AfterBefore', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Owner tax change captured successfully',
      data: {
        before: historyRows.find(r => r.AfterBefore === 'BEFORE'),
        after: historyRows.find(r => r.AfterBefore === 'AFTER')
      }
    });

  } catch (error) {
    if (t) await t.rollback();
    return res.status(500).json({ success: false, error: error.message });
  }
};
// export const insertOwnerTaxChange = async (req, res) => {
//   const { OwnerID, Year, CreatedBy } = req.body;

//   if (!OwnerID || !Year || !CreatedBy) {
//     return res.status(400).json({
//       success: false,
//       message: 'OwnerID, Year and CreatedBy are required'
//     });
//   }

//   const taxFields = [
//     'PropertyTax','EducationTax','TreeCess','EmploymentTax','SpEducationTax',
//     'FireCess','MajorBuilding','LightCess','RoadCess','DrainCess',
//     'SewageDisposalCess','Sanitation','SpWaterCess','WaterBenefit','WaterBill',
//     'Tax1','Tax2','Tax3','Tax4','Tax5','TaxTotal','Interest','NetTotal'
//   ];

//   // 🔥 Reason → AppliedPolicyMast column mapping
//   const reasonToColumnMap = {
//     appeal: 'Appeal',
//     hearing: 'Hearing',
//     retention: 'Retaintion',  
//     retaintion: 'Retaintion', 
//     courtresult: 'CourtResult'
//   };

//   const t = await sequelize.transaction();

//   try {
//     /* ======================================================
//        1️⃣ GET LATEST APPEAL (Owner + Year)
//     ====================================================== */
//     const latestAppeal = await AppealMast.findOne({
//       where: { OwnerID, Year },
//       order: [['UpdatedDate', 'DESC']],
//       transaction: t
//     });

//     if (!latestAppeal) {
//       await t.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'No appeal record found for given Owner and Year'
//       });
//     }

//     /* ======================================================
//        2️⃣ CHECK APPLIED POLICY (DYNAMIC COLUMN)
//     ====================================================== */
//     const reasonColumn = reasonToColumnMap[latestAppeal.Reason];

//     if (!reasonColumn) {
//       await t.rollback();
//       return res.status(400).json({
//         success: false,
//         message: `Invalid Reason: ${latestAppeal.Reason}`
//       });
//     }

//     const appliedPolicy = await AppliedPolicyMast.findOne({
//       where: {
//         OwnerID,
//         [reasonColumn]: 1 // 🔥 dynamic check
//       },
//       transaction: t
//     });

//     if (!appliedPolicy) {
//       await t.rollback();
//       return res.status(404).json({
//         success: false,
//         message: `No applied policy found for reason: ${latestAppeal.Reason}`
//       });
//     }

//     const versionID = uuidv4();

//     /* ======================================================
//        3️⃣ BEFORE → TRANSMAST DATA
//     ====================================================== */
//     const beforeTax = await TransMast.findOne({
//       where: { OwnerID, FinanceYear: Year },
//       transaction: t
//     });

//     if (!beforeTax) {
//       await t.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'No tax data found in TransMast for this year'
//       });
//     }

//     const beforeData = {
//       OwnerID,
//       FinanceYear: Year,
//       ScreenName: 'TransMast',
//       EntryType: 'Update',
//       ChangeOnControl: 'Upsert',
//       Remark: latestAppeal.Reason || '',
//       CreatedBy,
//       UpdatedBy: CreatedBy
//     };

//     taxFields.forEach(f => {
//       beforeData[f] = Number(beforeTax[f]) || 0;
//     });

//     await TransMastVersionHistory.create({
//       ...beforeData,
//       UpdVersionID: versionID,
//       AfterBefore: 'BEFORE'
//     }, { transaction: t });

//     /* ======================================================
//        4️⃣ AFTER → APPEALMAST DATA
//     ====================================================== */
//     const afterData = {
//       OwnerID,
//       FinanceYear: Year,
//       ScreenName: 'AppealMast',
//       EntryType: 'Update',
//       ChangeOnControl: 'Upsert',
//       Remark: latestAppeal.Reason || '',
//       CreatedBy,
//       UpdatedBy: CreatedBy
//     };

//     taxFields.forEach(f => {
//       afterData[f] = Number(latestAppeal[f]) || 0;
//     });

//     await TransMastVersionHistory.create({
//       ...afterData,
//       UpdVersionID: versionID,
//       AfterBefore: 'AFTER'
//     }, { transaction: t });

//     /* ======================================================
//        5️⃣ COMMIT
//     ====================================================== */
//     await t.commit();

//     /* ======================================================
//        6️⃣ FETCH FULL BEFORE / AFTER ROWS
//     ====================================================== */
//     const historyRows = await TransMastVersionHistory.findAll({
//       where: {
//         OwnerID,
//         FinanceYear: Year,
//         UpdVersionID: versionID
//       },
//       order: [['AfterBefore', 'ASC']]
//     });

//     const beforeRow = historyRows.find(r => r.AfterBefore === 'BEFORE') || null;
//     const afterRow  = historyRows.find(r => r.AfterBefore === 'AFTER') || null;

//     /* ======================================================
//        7️⃣ RESPONSE
//     ====================================================== */
//     return res.status(200).json({
//       success: true,
//       message: 'Owner tax change captured successfully (Before / After)',
//       data: {
//         OwnerID,
//         Year,
//         Reason: latestAppeal.Reason,
//         AppliedPolicyColumn: reasonColumn,
//         UpdVersionID: versionID,
//         before: beforeRow,
//         after: afterRow
//       }
//     });

//   } catch (error) {
//     await t.rollback();
//     console.error('Insert Owner Tax Change Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };





