
import ChangeVersionMaster from "../../../models/models/changeversionmaster.js";
import { v4 as uuidv4 } from 'uuid';
import TaxPendingDetailsVersionHistory from "../../../models/models/taxPendingHistory.js";
import TransMastVersionHistory from "../../../models/models/taxversionHistory.js";
import TransMast from "../../../models/models/transmast.js";
import { Op } from "sequelize";
import PropertyMast from "../../../models/models/propertymast.js";
import PropertyMastHistory from "../../../models/models/propertyMast_history_version.js";
import PropertyFullRowHistory from "../../../models/models/propertymastHistoryMaintain.js";
import { OldPropertyMastHistory } from "../../../models/models/oldPropertyMast_versionHistory.js";
import OldTaxesHistory from "../../../models/models/oldTax_historyVersion.js";
import PropertySocialDetailsHistory from "../../../models/models/proeprtySocailDetails_versionHistory.js";
import PropertyDetailsNewHistory from "../../../models/models/propertyDetailsNew_historyVersion.js";
import PropertyDetailsOldHistory from "../../../models/models/propertyDetailsOldVersionHistory.js";
import PropertyImageMast from "../../../models/models/propertyimagesmast.js";


// export const createDataEntrySendToApproval = async (req, res) => {
//   try {
//     // 1. Destructure correctly from req.body
//     const { OwnerID, user, WardNo, documentsArray } = req.body; 

//     // 2. Validations
//     if (!OwnerID || !WardNo) {
//       return res.status(400).json({
//         success: false,
//         message: 'OwnerID and WardNo are required'
//       });
//     }

//     if (!user || !user.UserID) {
//       return res.status(400).json({
//         success: false,
//         message: 'User details (UserID) are required'
//       });
//     }

//     /* ---------------- Financial Year Logic ---------------- */
//     const getFinancialYear = () => {
//       const now = new Date();
//       const year = now.getFullYear();
//       const month = now.getMonth() + 1;
//       return month >= 4
//         ? `${year}-${String(year + 1).slice(-2)}`
//         : `${year - 1}-${String(year).slice(-2)}`;
//     };

//     /* ---------------- Get last Wadhghat No ---------------- */
//     const lastRecord = await ChangeVersionMaster.findOne({
//       order: [['WadhghatNo', 'DESC']]
//     });
//     const nextWadhghatNo = (lastRecord?.WadhghatNo ? Number(lastRecord.WadhghatNo) : 0) + 1;

//     /* ---------------- Generate Display No ---------------- */
//     const financialYear = getFinancialYear();
//     const wadhGhatDisplayNo = `W${WardNo}/${financialYear}/WG${nextWadhghatNo}`;

//     /* ---------------- Create Payload for DB ---------------- */
//     const dbPayload = {
//       UpdVersionID: uuidv4(),
//       OwnerID,
//       ApplicationPageSource: 'OPDataEntry',
//       UpdatedBy: user.UserID,
//       UpdatedName: user.name || 'Unknown',
//       UpdatedDate: new Date(),
//       UpdatedInitStatus: 'Created',
//       ApprovalStatus: 'PENDING',
//       ApprovalRemark: 'Sent to approval',
//       FerfarNo: 0,
//       WadhghatNo: nextWadhghatNo,
//       WardghatDocument: Array.isArray(documentsArray) ? documentsArray.join(', ') : (documentsArray || ""),    
//         RecentApproved: false,
//       PublicIP: req.ip || null
//     };

//     const result = await ChangeVersionMaster.create(dbPayload);

//     return res.status(201).json({
//       success: true,
//       message: 'Sent to approval successfully',
//       wadhGhatDisplayNo:wadhGhatDisplayNo, // Frontend ko dikhane ke liye
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

//taxpending

export const createDataEntrySendToApproval = async (req, res) => {
  try {
    const { OwnerID, user,WardghatDocument,WardNo}=req.body;
   
    const transactionVersionID = uuidv4();
    console.log(req.body,"approval body");


    if (!OwnerID) {
      return res.status(400).json({
        success: false,
        message: 'OwnerID is required'
      });
    }

     /* ---------------- Financial Year ---------------- */
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
        WadhghatNo: {
          [Op.like]: `%/${financialYear}/WG%`
        }
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

    /* ---------------- Generate Ferfar No ---------------- */
    const wadhghatDisplayNo = `W${WardNo}/${financialYear}/WG${nextWGNo}`;

    /* ---------------- Create Payload ---------------- */
    const payload = {
      UpdVersionID: transactionVersionID,
      OwnerID,
      ApplicationPageSource: 'OPDataEntry',
      WardghatDocument:WardghatDocument,
      UpdatedBy: user?.UserID,
      UpdatedName: user?.name,
      UpdatedDate: new Date(),
      UpdatedInitStatus: 'Pending',

      ApprovalBy: null,
      ApprovalDate: null,
      ApprovalStatus: 'PENDING',
      ApprovalRemark: 'Sent to approval',

      WadhghatNo: 0,

      WadhghatNo: wadhghatDisplayNo,
      RecentApproved: false,

      // optional audit fields
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
      error: error.message
    });
  }
};
export const getOwnerTaxPendingBeforeAfter = async (req, res) => {
  try {
    const { OwnerID } = req.body; // frontend se OwnerID

    if (!OwnerID) {
      return res.status(400).json({
        success: false,
        message: 'OwnerID is required'
      });
    }

    // Fetch all version history for this OwnerID
    const taxRecords = await TaxPendingDetailsVersionHistory.findAll({
      where: { OwnerID },
      order: [['CreatedDate', 'ASC']] // Before should come first
    });

    if (!taxRecords || taxRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tax data found for this OwnerID'
      });
    }

    // Separate Before & After
    const beforeData = taxRecords.filter(r => r.AfterBefore === 'Before');
    const afterData = taxRecords.filter(r => r.AfterBefore === 'After');

    return res.status(200).json({
      success: true,
      message: 'Tax data fetched successfully',
      data: {
        ownerId: OwnerID,
        before: beforeData,
        after: afterData
      }
    });

  } catch (error) {
    console.error('Get Owner Tax Before/After Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
//tax Current

export const getOwnerTaxCurrentBeforeAfter = async (req, res) => {
  try {
    const { OwnerID } = req.body; // frontend se OwnerID

    if (!OwnerID) {
      return res.status(400).json({
        success: false,
        message: 'OwnerID is required'
      });
    }

    // Fetch all version history for this OwnerID
    const taxRecords = await TransMastVersionHistory.findAll({
      where: { OwnerID },
      order: [['CreatedDate', 'ASC']] // Before should come first
    });

    if (!taxRecords || taxRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tax data found for this OwnerID'
      });
    }

    // Separate Before & After
    const beforeData = taxRecords.filter(r => r.AfterBefore === 'Before');
    const afterData = taxRecords.filter(r => r.AfterBefore === 'After');

    return res.status(200).json({
      success: true,
      message: 'Tax data fetched successfully',
      data: {
        ownerId: OwnerID,
        before: beforeData,
        after: afterData
      }
    });

  } catch (error) {
    console.error('Get Owner Tax Before/After Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
//tax pending chnages year
export const copyTaxesToNextYear = async (req, res) => {
  try {
    const { OwnerID, SourceYear, FinanceYear, CreatedBy } = req.body;
    console.log("REQ BODY:", req.body);

    if (!OwnerID || !SourceYear || !FinanceYear) {
      return res.status(400).json({
        success: false,
        message: 'OwnerID, SourceYear and FinanceYear are required'
      });
    }

    // 1️⃣ Get source year record (ex: 2022)
    const sourceRecord = await TransMast.findOne({
      where: {
        OwnerID,
        FinanceYear: SourceYear
      }
    });

    if (!sourceRecord) {
      return res.status(404).json({
        success: false,
        message: `No tax record found for source year ${SourceYear}`
      });
    }

    // 2️⃣ Check if target year already exists (ex: 2025)
    const exists = await TransMast.findOne({
      where: {
        OwnerID,
        FinanceYear
      }
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: `Tax record already exists for year ${FinanceYear}`
      });
    }

    // 3️⃣ Create new record
    const data = sourceRecord.dataValues;
    delete data.TId; // remove primary key

    const newRecord = await TransMast.create({
      ...data,
      FinanceYear,
      AssesmentID: 1,
      CreatedBy,
      CreatedDate: new Date(),
      UpdatedDate: null,
      Remark: `Copied from year ${SourceYear}`
    });

    return res.json({
      success: true,
      message: `Taxes copied successfully from ${SourceYear} to ${FinanceYear}`,
      data: newRecord
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};
//update data entry status approval
export const uploadDataEntryApprovalDocuments = async (req, res) => {
  try {
    console.log('FILES:', req.files); 

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    return res.status(200).json({
      success: true,
      files: req.files.map(f => ({
        fileName: f.originalname,
        filePath: f.filename
      }))
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
};
//pending req - for approval
// export const getDataEntryApprovPendingRequests = async (req, res) => {
//   try {
//     // 1️⃣ Fetch all records for the three statuses
//     const records = await ChangeVersionMaster.findAll({
//       where: {
//         ApprovalStatus: ['PENDING', 'APPROVED', 'DISAPPROVED'] ,
//         ApplicationPageSource: 'OPDataEntry'// fetch all statuses
//       },
//       order: [['UpdatedDate', 'DESC']],
//       attributes: [
//         'UpdVersionID',
//         'OwnerID',
//         'ApplicationPageSource',
//         'WardghatDocument',
//         'WadhghatNo',
//         'UpdatedBy',
//         'UpdatedName',
//         'UpdatedDate',
//         'ApprovalStatus',
//       ]
//     });

//     // 2️⃣ Get all OwnerIDs
//     const ownerIds = records.map(r => r.OwnerID);

//     // 3️⃣ Fetch property info from PropertyMast
//     const properties = await PropertyMast.findAll({
//       where: { OwnerID: ownerIds },
//       attributes: ['OwnerID', 'OwnerName', 'NewWardNo', 'NewPropertyNo']
//     });

//     // 4️⃣ Merge property info into records
//     const mergedRecords = records.map(record => {
//       const recordJSON = record.toJSON();
//       const propertyInfo = properties.find(p => p.OwnerID === recordJSON.OwnerID);

//       return {
//         ...recordJSON,
//         documents: recordJSON.WardghatDocument ? [recordJSON.WardghatDocument] : [],
//         OwnerName: propertyInfo?.OwnerName || null,
//         NewWardNo: propertyInfo?.NewWardNo || null,
//         NewPropertyNo: propertyInfo?.NewPropertyNo || null,
//       };
//     });

//     // 5️⃣ Separate records by ApprovalStatus
//     const pendingRecords = mergedRecords.filter(r => r.ApprovalStatus === 'PENDING');
//     const approvedRecords = mergedRecords.filter(r => r.ApprovalStatus === 'APPROVED');
//     const disapprovedRecords = mergedRecords.filter(r => r.ApprovalStatus === 'DISAPPROVED');

//     // 6️⃣ Send response
//     return res.status(200).json({
//       success: true,
//       message: 'data Entry approval requests fetched successfully',
//       pendingRecords,
//       approvedRecords,
//       disapprovedRecords,
//       pendingCount: pendingRecords.length,
//       approvedCount: approvedRecords.length,
//       disapprovedCount: disapprovedRecords.length
//     });

//   } catch (error) {
//     console.error('Get dataEntry Approval Requests Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };
export const getDataEntryApprovPendingRequests = async (req, res) => {
  try {
    // 1️⃣ Fetch ONLY OPMutation records
    const records = await ChangeVersionMaster.findAll({
      where: {
        ApplicationPageSource: 'OPDataEntry', 
        ApprovalStatus: ['PENDING', 'APPROVED', 'DISAPPROVED']
      },
      order: [['UpdatedDate', 'DESC']],
      attributes: [
        'UpdVersionID',
        'OwnerID',
        'ApplicationPageSource',
        'WardghatDocument',
        'WadhghatNo',
        'UpdatedBy',
        'UpdatedName',
        'UpdatedDate',
        'ApprovalStatus',
        'ApprovalBy', 'ApprovalDate', 'ApprovalStatus', 'ApprovalRemark'
      ]
    });

    // 2️⃣ Extract OwnerIDs
    const ownerIds = [...new Set(records.map(r => r.OwnerID))];

    // 3️⃣ Fetch property info
    const properties = await PropertyMast.findAll({
      where: { OwnerID: ownerIds },
      attributes: ['OwnerID', 'OwnerName', 'NewWardNo', 'NewPropertyNo']
    });

    // 4️⃣ Merge property data
    const mergedRecords = records.map(record => {
      const recordJSON = record.toJSON();
      const propertyInfo = properties.find(
        p => p.OwnerID === recordJSON.OwnerID
      );

      return {
        UpdVersionID: recordJSON.UpdVersionID, 
        OwnerID: recordJSON.OwnerID,
        ApplicationPageSource: recordJSON.ApplicationPageSource,
        ApprovalStatus: recordJSON.ApprovalStatus,
        UpdatedBy: recordJSON.UpdatedBy,   
        UpdatedDate: recordJSON.UpdatedDate,
        UpdatedName: recordJSON.UpdatedName,
        WardghatDocument: recordJSON.WardghatDocument,
        WadhghatNo: recordJSON.WadhghatNo,
        documents: recordJSON.WardghatDocument 
        ? recordJSON.WardghatDocument.split(',')
        : [],
        OwnerName: propertyInfo?.OwnerName || null,
        NewWardNo: propertyInfo?.NewWardNo || null,
        NewPropertyNo: propertyInfo?.NewPropertyNo || null,
        ApprovalBy: recordJSON.ApprovalBy,
        ApprovalDate: recordJSON.ApprovalDate,
        ApprovalStatus: recordJSON.ApprovalStatus,
        ApprovalRemark: recordJSON.ApprovalRemark,
      };
    });

    // 5️⃣ Separate by status
    const pendingRecords = mergedRecords.filter(r => r.ApprovalStatus === 'PENDING');
    const approvedRecords = mergedRecords.filter(r => r.ApprovalStatus === 'APPROVED');
    const disapprovedRecords = mergedRecords.filter(r => r.ApprovalStatus === 'DISAPPROVED');

    // 6️⃣ Response
    return res.status(200).json({
      success: true,
      message: 'OP Data Entry requests fetched successfully',
      pendingRecords,
      approvedRecords,
      disapprovedRecords,
      pendingCount: pendingRecords.length,
      approvedCount: approvedRecords.length,
      disapprovedCount: disapprovedRecords.length
    });

  } catch (error) {
    console.error('Get Data Entry Requests Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
//wadhghatDocumnet
// export const getWadhghatDocumentsByOwnerID = async (req, res) => {
//   try {
//     const { OwnerID } = req.body

//     const record = await ChangeVersionMaster.findOne({
//       where: { OwnerID },
//       attributes: ['WardghatDocument']
//     });

//     if (!record || !record.WardghatDocument) {
//       return res.json({ success: true, documents: [] });
//     }

//     const documents = record.WardghatDocument
//       .split(',')
//       .map(f => ({
        
//         fileName: f,
//         fileUrl: `/uploadDataEntryApproval/wadhghat-dataEntryApproval/${f}`
        
//       }));

//     return res.json({ success: true, documents });

//   } catch (err) {
//     return res.status(500).json({ success: false });
//   }
// };
export const getWadhghatDocumentsByOwnerID = async (req, res) => {
  try {
    const { OwnerID ,selectedVersionID} = req.body;

    const record = await ChangeVersionMaster.findOne({
      where: { OwnerID , UpdVersionID:selectedVersionID},
      order: [['UpdatedDate', 'DESC']], 
      attributes: ['WardghatDocument']
    });

    if (!record || !record.WardghatDocument) {
      return res.json({ success: true, documents: [] });
    }

    const documents = record.WardghatDocument
      .split(',')
      .map(f => {
        const cleanName = f.trim(); 
        return {
          fileName: cleanName,
         
fileUrl: `/NTIS_Uploads_approval/wadhghat_dataEntryApproval/${cleanName}`
        };
      })
      .filter(doc => doc.fileName !== ""); 

    return res.json({ success: true, documents });

  } catch (err) {
    return res.status(500).json({ success: false });
  }
};
//approval
export const saveApprovedDataEntryRequest = async (req, res) => {
  try {
const { OwnerID, remark, user,selectedVersionID } = req.body;

    console.log(req.body,"save app req");
    if (!OwnerID || !selectedVersionID) {
      return res.status(400).json({
        success: false,
        message: 'ownerID is required'
      });
    }

    const record = await ChangeVersionMaster.findOne({
      where: { OwnerID: OwnerID,
        UpdVersionID:selectedVersionID,
        ApplicationPageSource: 'OPDataEntry'

      }
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'ChangeVersionMaster record not found'
      });
    }

    // 🔁 Build update payload dynamically
    const updatePayload = {
     
      ApprovalBy: user?.name,
      ApprovalStatus:"APPROVED",
      ApprovalRemark:remark,
      UpdatedBy: user?.UserID,
      UpdatedName: user?.name,
      UpdatedDate: new Date(),
      ApprovalDate: new Date() 

    };

    await record.update(updatePayload);

    return res.status(200).json({
      success: true,
      message: 'ChangeVersionMaster approved successfully',
      data: record
    });

  } catch (error) {
    console.error('Update ChangeVersionMaster Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
// export const saveApprovedDataEntryRequest = async (req, res) => {
//   try {
//     const { UpdVersionID, OwnerID, remark, user } = req.body; // 🔥 Added UpdVersionID

//     if (!UpdVersionID || !OwnerID) {
//       return res.status(400).json({
//         success: false,
//         message: 'UpdVersionID and OwnerID are required'
//       });
//     }

//     const record = await ChangeVersionMaster.findOne({
//       where: { 
//         UpdVersionID: UpdVersionID, // 🔥 Unique Identifier
//         OwnerID: OwnerID,
//         ApplicationPageSource: 'OPDataEntry' 
//       }
//     });

//     if (!record) {
//       return res.status(404).json({ success: false, message: 'Record not found' });
//     }

//     await record.update({
//       ApprovalBy: user?.name,
//       ApprovalStatus: "APPROVED",
//       ApprovalRemark: remark,
//       UpdatedBy: user?.UserID,
//       UpdatedName: user?.name,
//       UpdatedDate: new Date(),
//       ApprovalDate: new Date() 
//     });

//     return res.status(200).json({ success: true, message: 'Approved successfully', data: record });

//   } catch (error) {
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };
//disapproval
export const saveDisApprovedDataEntryRequest = async (req, res) => {
  try {
    const { OwnerID, remark, user, selectedVersionID } = req.body; 

    console.log(req.body, "request body");

    if (!OwnerID || !selectedVersionID) {
      return res.status(400).json({
        success: false,
        message: 'OwnerID and selectedVersionID are required'
      });
    }

    // 🔎 Find the existing record - WHERE clause fix
    const record = await ChangeVersionMaster.findOne({
      where: { 
        OwnerID: OwnerID,
        UpdVersionID: selectedVersionID, // Ye ab "where" ke andar hai
        ApplicationPageSource: 'OPDataEntry' // Ye bhi "where" ke andar hai
      }
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'ChangeVersionMaster record not found for this Version ID'
      });
    }

    // Pehle check karein ki kahin ye pehle se DISAPPROVED toh nahi hai?
    if (record.ApprovalStatus === "DISAPPROVED") {
        return res.status(400).json({
            success: false,
            message: 'This record is already disapproved.'
        });
    }

    // 🔁 Build update payload
    const updatePayload = {
      ApprovalBy: user?.name || '',
      ApprovalStatus: "DISAPPROVED",
      ApprovalRemark: remark || '',
      UpdatedBy: user?.UserID || null,
      UpdatedName: user?.name || '',
      UpdatedDate: new Date(),
      ApprovalDate: new Date() 
    };

    // ✅ Update the existing record
    await record.update(updatePayload);

    return res.status(200).json({
      success: true,
      message: 'ChangeVersionMaster disapproved successfully.',
    });

  } catch (error) {
    console.error('Update ChangeVersionMaster Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
// export const saveDisApprovedDataEntryRequest = async (req, res) => {
//   try {
//     const { UpdVersionID, OwnerID, remark, user } = req.body; 

//     if (!UpdVersionID || !OwnerID) {
//       return res.status(400).json({ success: false, message: 'UpdVersionID and OwnerID are required' });
//     }

//     const record = await ChangeVersionMaster.findOne({
//       where: { 
//         UpdVersionID: UpdVersionID, 
//         OwnerID: OwnerID,
//         ApplicationPageSource: 'OPDataEntry'
//       }
//     });

//     if (!record) {
//       return res.status(404).json({ success: false, message: 'Record not found' });
//     }

//     await record.update({
//       ApprovalBy: user?.name || '',
//       ApprovalStatus: "DISAPPROVED",
//       ApprovalRemark: remark || '',
//       UpdatedBy: user?.UserID || null,
//       UpdatedName: user?.name || '',
//       UpdatedDate: new Date(),
//       ApprovalDate: new Date()
//     });

//     return res.status(200).json({ success: true, message: 'Disapproved successfully.' });

//   } catch (error) {
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };
// //getZone
// const getOwnerIdsByZoneDB = async (zoneNo) => {
//   if (!zoneNo) return [];

//   // 1️⃣ Get all wards in this zone
//   const wardsInZone = await PropertyMast.findAll({
//     where: { NewZoneNo: zoneNo },
//     attributes: ['NewWardNo'],
//     group: ['NewWardNo']
//   });

//   const wardNumbers = wardsInZone.map(w => w.NewWardNo);
//   if (!wardNumbers.length) return [];

//   // 2️⃣ Get all properties in these wards → OwnerIDs
//   const properties = await PropertyMast.findAll({
//     where: { NewWardNo: { [Op.in]: wardNumbers } },
//     attributes: ['OwnerID']
//   });

//   const ownerIds = properties.map(p => p.OwnerID);
//   return ownerIds;
// };
//serch dataENtry approval diff way
const getOwnerIdsByZone = async (zoneNo) => {
  if (!zoneNo) return [];

  // 1️⃣ Get all wards in this zone
  const wardsInZone = await PropertyMast.findAll({
    where: { NewZoneNo: zoneNo },
    attributes: ['NewWardNo'],
    group: ['NewWardNo']
  });

  const wardNumbers = wardsInZone.map(w => w.NewWardNo);
  if (!wardNumbers.length) return [];

  // 2️⃣ Get all properties in these wards → OwnerIDs
  const properties = await PropertyMast.findAll({
    where: { NewWardNo: { [Op.in]: wardNumbers } },
    attributes: ['OwnerID']
  });

  const ownerIds = properties.map(p => p.OwnerID);
  return ownerIds;
};
export const searchDataEntryApprovalRequest = async (req, res) => {
  try {
    const {
      wardNo,
      propertyNo,
      zoneNo,
      WadhghatNo,
      approvalStatus,
      taxPayerName,
      fromDate,
      toDate
    } = req.body;

    console.log(req.body, "req.body");

    let ownerIds = [];

    // -----------------------------
    // Step 1: zone-wise owner IDs
    // -----------------------------
    if (zoneNo) {
      ownerIds = await getOwnerIdsByZone(zoneNo);
      if (!ownerIds.length) {
        return res.status(200).json({ success: true, data: [] });
      }
    }

    // -----------------------------
    // Step 2: Additional filters
    // -----------------------------
    if (wardNo || propertyNo || taxPayerName) {
      const propertyWhere = {};
      if (wardNo) propertyWhere.NewWardNo = wardNo;
      if (propertyNo) propertyWhere.NewPropertyNo = propertyNo;
      if (zoneNo) propertyWhere.NewZoneNo = zoneNo;
      if (taxPayerName) {
        propertyWhere.OwnerName = { [Op.like]: `%${taxPayerName}%` };
      }

      const properties = await PropertyMast.findAll({
        where: propertyWhere,
        attributes: ['OwnerID']
      });

      ownerIds = properties.map(p => p.OwnerID);

      if (!ownerIds.length) {
        return res.status(200).json({ success: true, data: [] });
      }
    }

    // -----------------------------
    // Step 3: fetch ChangeVersionMaster
    // ONLY validation added here
    // -----------------------------
    const cvmWhere = {
      ApplicationPageSource: 'OPDataEntry'   // ✅ validation
    };

    if (ownerIds.length) {
      cvmWhere.OwnerID = { [Op.in]: ownerIds };
    }

    if (WadhghatNo) {
      cvmWhere.WadhghatNo = WadhghatNo;
    }

    if (approvalStatus) {
      cvmWhere.ApprovalStatus = approvalStatus.toUpperCase();
    }

    if (fromDate && toDate) {
      cvmWhere.UpdatedDate = {
        [Op.between]: [
          new Date(fromDate + 'T00:00:00'),
          new Date(toDate + 'T23:59:59')
        ]
      };
    }

    const results = await ChangeVersionMaster.findAll({
      where: cvmWhere,
      order: [['UpdatedDate', 'DESC']]
    });

    // -----------------------------
    // Step 4: fetch property info
    // -----------------------------
    const properties = await PropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo']
    });

    const propertyMap = {};
    properties.forEach(p => {
      if (!propertyMap[p.OwnerID]) {
        propertyMap[p.OwnerID] = {
          NewWardNo: p.NewWardNo,
          NewPropertyNo: p.NewPropertyNo
        };
      }
    });

    // -----------------------------
    // Step 5: merge directly into results
    // -----------------------------
    const normalized = results.map(r => {
      const json = r.toJSON();
      const property = propertyMap[json.OwnerID] || {
        NewWardNo: null,
        NewPropertyNo: null
      };

      return {
        ...json,
        documents: json.WardghatDocument ? [json.WardghatDocument] : [],
        NewWardNo: property.NewWardNo,
        NewPropertyNo: property.NewPropertyNo
      };
    });

    return res.status(200).json({
      success: true,
      data: normalized
    });

  } catch (error) {
    console.error('Search ChangeVersionMaster error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// export const searchDataEntryApprovalRequest = async (req, res) => {
//   try {
//     const {
//       wardNo,
//       propertyNo,
//       zoneNo,
//       WadhghatNo,
//       approvalStatus,
//       taxPayerName,
//       fromDate,
//       toDate
//     } = req.body;

//     console.log(req.body, "req.body");

//     let ownerIds = [];

//     // -----------------------------
//     // Step 1: zone-wise owner IDs
//     // -----------------------------
//     if (zoneNo) {
//       ownerIds = await getOwnerIdsByZone(zoneNo);
//       if (!ownerIds.length) return res.status(200).json({ success: true, data: [] });
//     }

//     // -----------------------------
//     // Step 2: Additional filters
//     // -----------------------------
//     if (wardNo || propertyNo || taxPayerName) {
//       const propertyWhere = {};
//       if (wardNo) propertyWhere.NewWardNo = wardNo;
//       if (propertyNo) propertyWhere.NewPropertyNo = propertyNo;
//       if (zoneNo) propertyWhere.NewZoneNo = zoneNo;
//       if (taxPayerName) propertyWhere.OwnerName = { [Op.like]: `%${taxPayerName}%` };

//       const properties = await PropertyMast.findAll({
//         where: propertyWhere,
//         attributes: ['OwnerID']
//       });

//       ownerIds = properties.map(p => p.OwnerID);

//       if (!ownerIds.length) return res.status(200).json({ success: true, data: [] });
//     }

//     // -----------------------------
//     // Step 3: fetch ChangeVersionMaster
//     // -----------------------------
//     const cvmWhere = {};
//     if (ownerIds.length) cvmWhere.OwnerID = { [Op.in]: ownerIds };
//     if (WadhghatNo) cvmWhere.WadhghatNo = WadhghatNo;
//     if (approvalStatus) cvmWhere.ApprovalStatus = approvalStatus.toUpperCase();
//     if (fromDate && toDate) {
//       cvmWhere.UpdatedDate = {
//         [Op.between]: [
//           new Date(fromDate + 'T00:00:00'),
//           new Date(toDate + 'T23:59:59')
//         ]
//       };
//     }

//     const results = await ChangeVersionMaster.findAll({
//       where: cvmWhere,
//       order: [['UpdatedDate', 'DESC']]
//     });

//     // -----------------------------
//     // Step 4: fetch property info
//     // -----------------------------
//     const properties = await PropertyMast.findAll({
//       where: { OwnerID: { [Op.in]: ownerIds } },
//       attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo']
//     });

//     // map OwnerID -> single property (assume first match)
//     const propertyMap = {};
//     properties.forEach(p => {
//       if (!propertyMap[p.OwnerID]) {
//         propertyMap[p.OwnerID] = {
//           NewWardNo: p.NewWardNo,
//           NewPropertyNo: p.NewPropertyNo
//         };
//       }
//     });

//     // -----------------------------
//     // Step 5: merge directly into results
//     // -----------------------------
//     const normalized = results.map(r => {
//       const json = r.toJSON();
//       const property = propertyMap[json.OwnerID] || { NewWardNo: null, NewPropertyNo: null };
//       return {
//         ...json,
//         documents: json.WardghatDocument ? [json.WardghatDocument] : [],
//         NewWardNo: property.NewWardNo,
//         NewPropertyNo: property.NewPropertyNo
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       data: normalized
//     });

//   } catch (error) {
//     console.error('Search ChangeVersionMaster error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };
//property mast after before
export const getPropertyHistoryByOwner = async (req, res) => {
  try {
    const { OwnerID,versionId } = req.body;

    if (!OwnerID || !versionId) {
      return res.status(400).json({ success: false, message: "OwnerID is required" });
    }

    const historyRows = await PropertyMastHistory.findAll({
      where: { OwnerID: OwnerID ,
        UpdVersionID: versionId
      },
      order: [['ChangeDate', 'DESC'], ['RowHistoryID', 'ASC']],
      raw: true
    });

    const beforeList = [];
    const afterList = [];

    const grouped = historyRows.reduce((acc, row) => {
      const id = row.HistoryID;
      if (!acc[id]) acc[id] = { before: null, after: null };
      
      if (row.SnapshotType === 'BEFORE') acc[id].before = row;
      else acc[id].after = row;
      
      return acc;
    }, {});

    // Final Lists generate karna
    Object.values(grouped).forEach(item => {
      beforeList.push(item.before);
      afterList.push(item.after);
    });

    return res.status(200).json({
      success: true,
      count: beforeList.length,
      data: {
        before: beforeList,
        after: afterList
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//jion owner detils
// export const getFullRowHistoryByOwner = async (req, res) => {
//   try {
//     const { OwnerID } = req.body; // Request Body se OwnerID li

//     if (!OwnerID) {
//       return res.status(400).json({ success: false, message: "OwnerID is required" });
//     }

//     const historyRows = await PropertyFullRowHistory.findAll({
//       where: { OwnerID: OwnerID },
//       order: [
//         ['ChangeDate', 'DESC'],   
//         ['RowHistoryID', 'ASC']   
//       ],
//       raw: true
//     });

//     const grouped = historyRows.reduce((acc, row) => {
//       const hId = row.HistoryID;
      
//       if (!acc[hId]) {
//         acc[hId] = { before: null, after: null };
//       }

//       if (row.SnapshotType === 'BEFORE') {
//         acc[hId].before = row;
//       } else if (row.SnapshotType === 'AFTER') {
//         acc[hId].after = row;
//       }
//       return acc;
//     }, {});

//     const beforeList = [];
//     const afterList = [];

//     Object.values(grouped).forEach(item => {
//       beforeList.push(item.before);
//       afterList.push(item.after);
//     });

//     return res.status(200).json({
//       success: true,
//       count: beforeList.length,
//       data: {
//         before: beforeList,
//         after: afterList
//       }
//     });

//   } catch (error) {
//     console.error("Error in getFullRowHistoryByOwner:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// };
export const getFullRowHistoryByOwner = async (req, res) => {
  try {
    const { OwnerID,versionId } = req.body;

    // 1. Validation: Check if OwnerID is provided
    if (!OwnerID ||!versionId) {
      return res.status(400).json({ 
        success: false, 
        message: "OwnerID is required" 
      });
    }

    const historyRows = await PropertyFullRowHistory.findAll({
      where: { OwnerID: OwnerID ,
              UpdVersionID: versionId
},
      order: [['RowHistoryID', 'ASC']], 
      raw: true
    });

    const beforeList = [];
    const afterList = [];

    historyRows.forEach((row) => {
      if (row.SnapshotType === 'BEFORE') {
        beforeList.push(row); 
      } else if (row.SnapshotType === 'AFTER') {
        afterList.push(row);  
      }
    });

    return res.status(200).json({
      success: true,
      count: historyRows.length,
      data: {
        before: beforeList, 
        after: afterList    
      }
    });

  } catch (error) {
    console.error("Error in getFullRowHistoryByOwner:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
//oldProperty mast
export const getOldPropertyHistory = async (req, res) => {
  try {
    const { OwnerID, versionId} = req.body;

    if (!OwnerID || !versionId) {
      return res.status(400).json({ success: false, message: "OwnerID is required" });
    }

    const historyRows = await OldPropertyMastHistory.findAll({
      where: { OwnerID: OwnerID,
        UpdVersionID: versionId
      },
      order: [
        ['SnapshotCreatedAt', 'DESC'], 
        ['HistoryID', 'ASC']
      ],
      raw: true
    });

    const beforeList = [];
    const afterList = [];

   
    const grouped = historyRows.reduce((acc, row) => {
          const groupKey = `${row.SnapshotCreatedAt}_${row.SnapshotBy}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = { before: null, after: null };
      }

      if (row.SnapshotType === 'BEFORE') {
        acc[groupKey].before = row;
      } else {
        acc[groupKey].after = row;
      }
      return acc;
    }, {});

    Object.values(grouped).forEach(item => {
      beforeList.push(item.before);
      afterList.push(item.after);
    });

    return res.status(200).json({
      success: true,
      count: beforeList.length,
      data: {
        before: beforeList,
        after: afterList
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//old Tax 
export const getOldTaxesHistory = async (req, res) => {
  try {
    const { OwnerID ,versionId} = req.body;

    if (!OwnerID ||!versionId) {
      return res.status(400).json({ success: false, message: "OwnerID is required" });
    }

    const historyRows = await OldTaxesHistory.findAll({
      where: { OwnerID: OwnerID,
        UpdVersionID: versionId
      },
      order: [
        ['SnapshotCreatedAt', 'DESC'], 
        ['HistoryID', 'ASC']
      ],
      raw: true
    });

    const grouped = historyRows.reduce((acc, row) => {
      const groupKey = row.UpdVersionID || `${row.SnapshotCreatedAt}_${row.SnapshotBy}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = { before: null, after: null };
      }

      if (row.SnapshotType === 'BEFORE') {
        acc[groupKey].before = row;
      } else if (row.SnapshotType === 'AFTER') {
        acc[groupKey].after = row;
      }
      return acc;
    }, {});

    const beforeList = [];
    const afterList = [];

    // 3. Final arrays taiyar karein
    Object.values(grouped).forEach(item => {
      beforeList.push(item.before);
      afterList.push(item.after);
    });

    return res.status(200).json({
      success: true,
      data: {
        before: beforeList,
        after: afterList
      }
    });

  } catch (error) {
    console.error("Error in getOldTaxesHistory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
//social details
export const getSocialDetailsHistory = async (req, res) => {
  try {
    const { OwnerID ,versionId} = req.body;

    if (!OwnerID || !versionId) {
      return res.status(400).json({ success: false, message: "OwnerID is required" });
    }

    const historyRows = await PropertySocialDetailsHistory.findAll({
      where: { OwnerID: OwnerID ,
        UpdVersionID: versionId
      },
      order: [
        ['SnapshotCreatedAt', 'DESC'], 
        ['HistoryID', 'ASC']
      ],
      raw: true
    });

    const grouped = historyRows.reduce((acc, row) => {
      const groupKey = `${row.SnapshotCreatedAt}_${row.UserID}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = { before: null, after: null };
      }

      if (row.SnapshotType === 'BEFORE') {
        acc[groupKey].before = row;
      } else if (row.SnapshotType === 'AFTER') {
        acc[groupKey].after = row;
      }
      return acc;
    }, {});

    const beforeList = [];
    const afterList = [];

    Object.values(grouped).forEach(item => {
      beforeList.push(item.before);
      afterList.push(item.after);
    });

    return res.status(200).json({
      success: true,
      data: {
        before: beforeList,
        after: afterList
      }
    });

  } catch (error) {
    console.error("Error fetching social history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
//newFloor
export const getPropertyNewFloorDetailsHistory = async (req, res) => {
  try {
    const { OwnerID ,versionId} = req.body;

    if (!OwnerID || !versionId) {
      return res.status(400).json({ success: false, message: "OwnerID is required" });
    }

    const historyRows = await PropertyDetailsNewHistory.findAll({
      where: { OwnerID: OwnerID,
        UpdVersionID: versionId
      },
      order: [
        ['SnapshotCreatedAt', 'DESC'],
        ['PDNId', 'ASC'],             
        ['HistoryID', 'ASC']
      ],
      raw: true
    });

    const grouped = historyRows.reduce((acc, row) => {
      const groupKey = `${row.SnapshotCreatedAt}_${row.UserID}_${row.PDNId}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = { before: null, after: null };
      }

      if (row.SnapshotType === 'BEFORE') {
        acc[groupKey].before = row;
      } else if (row.SnapshotType === 'AFTER') {
        acc[groupKey].after = row;
      }
      return acc;
    }, {});

    const beforeList = [];
    const afterList = [];

    Object.values(grouped).forEach(item => {
      beforeList.push(item.before);
      afterList.push(item.after);
    });

    return res.status(200).json({
      success: true,
      data: {
        before: beforeList,
        after: afterList
      }
    });

  } catch (error) {
    console.error("Error fetching property details history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
//propertyDeatilsOldVersionhistory
export const getOldPropertyDetailsHistory = async (req, res) => {
  try {
    const { OwnerID,versionId } = req.body;

    if (!OwnerID || !versionId) {
      return res.status(400).json({ success: false, message: "OwnerID is required" });
    }

    const historyRows = await PropertyDetailsOldHistory.findAll({
      where: { OwnerID: OwnerID ,
        UpdVersionID: versionId
      },
      order: [
        ['SnapshotCreatedAt', 'DESC'], 
        ['PDOId', 'ASC'],              
        ['ID', 'ASC']
      ],
      raw: true
    });

    const grouped = historyRows.reduce((acc, row) => {
      const groupKey = `${row.UpdVersionID}_${row.PDOId}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = { before: null, after: null };
      }

      if (row.SnapshotType === 'BEFORE') {
        acc[groupKey].before = row;
      } else if (row.SnapshotType === 'AFTER') {
        acc[groupKey].after = row;
      }
      return acc;
    }, {});

    const beforeList = [];
    const afterList = [];

    // 3. Final arrays mein convert karein
    Object.values(grouped).forEach(item => {
      beforeList.push(item.before);
      afterList.push(item.after);
    });

    return res.status(200).json({
      success: true,
      data: {
        before: beforeList,
        after: afterList
      }
    });

  } catch (error) {
    console.error("Error in getOldPropertyDetailsHistory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
//trans mast currtent tax
export const getTransMastHistory = async (req, res) => {
  try {
    const { OwnerID ,versionId} = req.body;

    if (!OwnerID || !versionId) {
      return res.status(400).json({ success: false, message: "OwnerID is required" });
    }

    const historyRows = await TransMastVersionHistory.findAll({
      where: { OwnerID: OwnerID,
        UpdVersionID: versionId
       },
      order: [
        ['UpdatedDate', 'DESC'],
        ['CreatedDate', 'DESC']
      ],
      raw: true
    });

    const grouped = historyRows.reduce((acc, row) => {
      const groupKey = row.UpdVersionID || `${row.UpdatedDate}_${row.UpdatedBy}`;
      
      if (!acc[groupKey]) {
        acc[groupKey] = { before: null, after: null };
      }

      if (row.AfterBefore === 'BEFORE') {
        acc[groupKey].before = row;
      } else if (row.AfterBefore === 'AFTER') {
        acc[groupKey].after = row;
      }
      return acc;
    }, {});

    const beforeList = [];
    const afterList = [];

    Object.values(grouped).forEach(item => {
      beforeList.push(item.before);
      afterList.push(item.after);
    });

    return res.status(200).json({
      success: true,
      data: {
        before: beforeList,
        after: afterList
      }
    });

  } catch (error) {
    console.error("Error fetching TransMast history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
//tax pending
export const getTaxPendingHistory = async (req, res) => {
  try {
    const { OwnerID,versionId } = req.body;

    if (!OwnerID ||!versionId) {
      return res.status(400).json({
        success: false,
        message: "OwnerID and updid is required"
      });
    }

    // 1️⃣ Fetch history rows
    const historyRows = await TaxPendingDetailsVersionHistory.findAll({
      where: { OwnerID ,
        UpdVersionID: versionId
      },
      order: [
        ['UpdatedDate', 'DESC'],
        ['PendingYear', 'ASC'],
        ['ID', 'ASC']
      ],
      raw: true
    });

    if (!historyRows.length) {
      return res.status(200).json({
        success: true,
        data: {
          before: [],
          after: []
        }
      });
    }

    // 2️⃣ Group by UpdVersionID + OriginalID
    const grouped = historyRows.reduce((acc, row) => {
      const groupKey = `${row.UpdVersionID}_${row.OriginalID}`;

      if (!acc[groupKey]) {
        acc[groupKey] = { before: null, after: null };
      }

      if (row.AfterBefore === 'BEFORE') {
        acc[groupKey].before = row;
      }

      if (row.AfterBefore === 'AFTER') {
        acc[groupKey].after = row;
      }

      return acc;
    }, {});

    // 3️⃣ Build clean arrays (❌ no nulls)
    const before = [];
    const after = [];

    Object.values(grouped).forEach(item => {
      if (item.before) before.push(item.before);
      if (item.after) after.push(item.after);
    });

    // 4️⃣ Final response
    return res.status(200).json({
      success: true,
      data: {
        before,
        after
      }
    });

  } catch (error) {
    console.error("Error fetching TaxPending history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
//trans mast

export const getTaxVersionHistory = async (req, res) => {
  try {
    const { OwnerID,versionId } = req.body;

    if (!OwnerID || !versionId) {
      return res.status(400).json({
        success: false,
        message: "OwnerID and UpdVersionID are required."
      });
    }

    const historyData = await TransMastVersionHistory.findAll({
      where: {
        OwnerID: OwnerID,
        UpdVersionID: versionId
      },
      attributes: ['OwnerID', 'UpdVersionID', 'AfterBefore', 'RateableValue', 'PropertyTax', 'TaxTotal'],
      order: [['AfterBefore', 'DESC']] 
    });

    if (historyData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No history found for the provided OwnerID and VersionID."
      });
    }

    const formatRow = (row) => {
      if (!row) return null;
      
      const rateableValue = parseFloat(row.RateableValue || 0);
      
      return {
        OwnerID: row.OwnerID,
        UpdVersionID: row.UpdVersionID,
        RateableValue: rateableValue,
        // ALV Calculation: RateableValue / 0.9
        ALV: rateableValue > 0 ? (rateableValue / 0.9).toFixed(2) : 0,
        PropertyTax: row.PropertyTax,
        TaxTotal: row.TaxTotal,
        AfterBefore: row.AfterBefore
      };
    };

    const beforeRaw = historyData.find(row => row.AfterBefore === 'BEFORE');
    const afterRaw = historyData.find(row => row.AfterBefore === 'AFTER');

    const response = {
      before: formatRow(beforeRaw),
      after: formatRow(afterRaw),
    };

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching Version History:', error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

//image

export const getPropertyImagesByOwner = async (req, res) => {
  try {
    const { ownerid } = req.body; 

    if (!ownerid) {
      return res.status(400).json({ success: false, message: "OwnerID is missing in request" });
    }

    // 2. Database query
    const images = await PropertyImageMast.findOne({
      where: { ownerid: ownerid },
      raw: true 
    });

    if (!images) {
      return res.status(200).json({ 
        success: true,
        data: null,
        message: "No images found"
      });
    }

    return res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error); // Terminal mein check karein table exists or not
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

//status check
export const getQuickApprovalStatus = async (req, res) => {
  try {
    const { OwnerID, UpdVersionID } = req.body;

    if (!OwnerID) {
      return res.status(400).json({
        success: false,
        message: "OwnerID is required"
      });
    }

    const whereCond = { OwnerID };

    if (UpdVersionID) {
      whereCond.UpdVersionID = UpdVersionID;
    }

    const record = await ChangeVersionMaster.findOne({
      where: whereCond,
      order: [['UpdatedDate', 'DESC']],
      attributes: [
        'UpdVersionID',
        'OwnerID',
        'ApprovalStatus',
        'ApprovalRemark',
        'ApprovalDate',
        'UpdatedInitStatus',
        'RecentApproved',
        'ApplicationPageSource'
      ]
    });

    if (!record) {
      return res.json({
        success: true,
        status: "NO_RECORD",
        message: "No approval record found"
      });
    }

    return res.json({
      success: true,
      data: {
        UpdVersionID: record.UpdVersionID,
        Status: record.ApprovalStatus,  
        Remark: record.ApprovalRemark,
        ApprovalDate: record.ApprovalDate,
        InitStatus: record.UpdatedInitStatus,
        IsRecentlyApproved: record.RecentApproved
      }
    });

  } catch (error) {
    console.error("Quick Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch approval status"
    });
  }
};
