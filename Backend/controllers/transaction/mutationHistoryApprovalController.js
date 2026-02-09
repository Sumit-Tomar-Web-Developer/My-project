import { where } from "sequelize";
import sequelize from "../../config/connectionDB.js";
import ChangeVersionMaster from "../../models/models/changeversionmaster.js";
import PropertyMast from "../../models/models/propertymast.js";
import MutationDetails from "../../models/models/mutationdetails.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

// import { v4 as uuidv4 } from 'uuid';


export const createSendToApproval = async (req, res) => {
  try {
    const { OwnerID, user,FerfarDocument,WardNo,UpdVersionID}=req.body;
   

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

    /* ---------------- Get last FR number ---------------- */
    const lastRecord = await ChangeVersionMaster.findOne({
      where: {
        FerfarNo: {
          [Op.like]: `%/${financialYear}/FR%`
        }
      },
  order: [['UpdatedDate', 'DESC']] 
    });


    let nextFRNo = 1;

    if (lastRecord?.FerfarNo) {
      const match = lastRecord.FerfarNo.match(/FR(\d+)$/);
      if (match) {
        nextFRNo = parseInt(match[1], 10) + 1;
      }
    }

    /* ---------------- Generate Ferfar No ---------------- */
    const ferfarDisplayNo = `W${WardNo}/${financialYear}/FR${nextFRNo}`;

    /* ---------------- Create Payload ---------------- */
    const payload = {
      UpdVersionID: UpdVersionID,
      OwnerID,
      ApplicationPageSource: 'OPMutation',
      FerfarDocument:FerfarDocument,
      UpdatedBy: user?.UserID,
      UpdatedName: user?.name,
      UpdatedDate: new Date(),
      UpdatedInitStatus: 'Created',

      ApprovalBy: null,
      ApprovalDate: null,
      ApprovalStatus: 'PENDING',
      ApprovalRemark: 'Sent to approval',

      // ⚠️ IMPORTANT: FerfarNo colu` is INT
      FerfarNo: ferfarDisplayNo,

      WadhghatNo: 0,
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
      ferfarDisplayNo,
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


export const uploadMutationApprovalFerFarDocuments = async (req, res) => {
  try {
    console.log('FILES:', req.files); // 🔍 MUST log array

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

// export const getMutationPendingRequests = async (req, res) => {
//   try {
//     // 1️⃣ Fetch all records for the three statuses
//     const records = await ChangeVersionMaster.findAll({
//       where: {
//         ApprovalStatus: ['PENDING', 'APPROVED', 'DISAPPROVED'] // fetch all statuses
//       },
//       order: [['UpdatedDate', 'DESC']],
//       attributes: [
//         'UpdVersionID',
//         'OwnerID',
//         'ApplicationPageSource',
//         'FerfarDocument',
//         'FerfarNo',
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
//         documents: recordJSON.FerfarDocument ? [recordJSON.FerfarDocument] : [],
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
//       message: 'Mutation requests fetched successfully',
//       pendingRecords,
//       approvedRecords,
//       disapprovedRecords,
//       pendingCount: pendingRecords.length,
//       approvedCount: approvedRecords.length,
//       disapprovedCount: disapprovedRecords.length
//     });

//   } catch (error) {
//     console.error('Get Mutation Requests Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

export const getMutationPendingRequests = async (req, res) => {
  try {
    // 1️⃣ Fetch ONLY OPMutation records
    const records = await ChangeVersionMaster.findAll({
      where: {
        ApplicationPageSource: 'OPMutation', // ✅ filter OP Mutation only
        ApprovalStatus: ['PENDING', 'APPROVED', 'DISAPPROVED']
      },
      order: [['UpdatedDate', 'DESC']],
      attributes: [
        'UpdVersionID',
        'OwnerID',
        'ApplicationPageSource',
        'FerfarDocument',
        'FerfarNo',
        'UpdatedBy',
        'UpdatedName',
        'UpdatedDate',
        'ApprovalStatus',
        "ApprovalBy", 
        "ApprovalDate",  
        "ApprovalRemark"
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
        UpdatedDate: recordJSON.UpdatedDate,
        UpdatedBy:recordJSON.UpdatedBy,
        FerfarNo:recordJSON.FerfarNo,
        ApprovalBy:recordJSON.ApprovalBy,
        ApprovalDate:recordJSON.ApprovalDate,
        ApprovalRemark:recordJSON.ApprovalRemark,
        documents: recordJSON.FerfarDocument
          ? recordJSON.FerfarDocument.split(',')
          : [],
        OwnerName: propertyInfo?.OwnerName || null,
        NewWardNo: propertyInfo?.NewWardNo || null,
        NewPropertyNo: propertyInfo?.NewPropertyNo || null
      };
    });

    // 5️⃣ Separate by status
    const pendingRecords = mergedRecords.filter(r => r.ApprovalStatus === 'PENDING');
    const approvedRecords = mergedRecords.filter(r => r.ApprovalStatus === 'APPROVED');
    const disapprovedRecords = mergedRecords.filter(r => r.ApprovalStatus === 'DISAPPROVED');

    // 6️⃣ Response
    return res.status(200).json({
      success: true,
      message: 'OP Mutation requests fetched successfully',
      pendingRecords,
      approvedRecords,
      disapprovedRecords,
      pendingCount: pendingRecords.length,
      approvedCount: approvedRecords.length,
      disapprovedCount: disapprovedRecords.length
    });

  } catch (error) {
    console.error('Get Mutation Requests Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


export const getMutationRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.body; // ⬅️ FROM BODY

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required (PENDING / APPROVED / DISAPPROVED)"
      });
    }

    // 1️⃣ Fetch records based on status
    const records = await ChangeVersionMaster.findAll({
      where: {
        ApplicationPageSource: 'OPMutation',
        ApprovalStatus: status
      },
      order: [['UpdatedDate', 'DESC']],
      attributes: [
        'UpdVersionID',
        'OwnerID',
        'ApplicationPageSource',
        'FerfarDocument',
        'FerfarNo',
        'UpdatedBy',
        'UpdatedName',
        'UpdatedDate',
        'ApprovalStatus',
        'ApprovalBy',
        'ApprovalDate',
        'ApprovalRemark'
      ]
    });

    // 2️⃣ Extract OwnerIDs
    const ownerIds = [...new Set(records.map(r => r.OwnerID))];

    // 3️⃣ Fetch property details
    const properties = await PropertyMast.findAll({
      where: { OwnerID: ownerIds },
      attributes: ['OwnerID', 'OwnerName', 'NewWardNo', 'NewPropertyNo']
    });

    // 4️⃣ Merge data
    const responseData = records.map(record => {
      const r = record.toJSON();
      const property = properties.find(p => p.OwnerID === r.OwnerID);

      return {
        UpdVersionID: r.UpdVersionID,
        OwnerID: r.OwnerID,
        ApprovalStatus: r.ApprovalStatus,
        UpdatedDate: r.UpdatedDate,
        UpdatedBy: r.UpdatedBy,
        FerfarNo: r.FerfarNo,
        ApprovalBy: r.ApprovalBy,
        ApprovalDate: r.ApprovalDate,
        ApprovalRemark: r.ApprovalRemark,
        documents: r.FerfarDocument ? r.FerfarDocument.split(',') : [],
        OwnerName: property?.OwnerName || null,
        NewWardNo: property?.NewWardNo || null,
        NewPropertyNo: property?.NewPropertyNo || null
      };
    });

    // 5️⃣ Response
    return res.status(200).json({
      success: true,
      message: `${status} OP Mutation requests fetched successfully`,
      data: responseData,
      count: responseData.length
    });

  } catch (error) {
    console.error('Get Mutation Requests Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


export const getMutationComparisonChanges = async (req, res) => {
  try {
    const { OwnerID } = req.body;

    if (!OwnerID) {
      return res.status(400).json({
        success: false,
        message: "OwnerID is required"
      });
    }

    const property = await PropertyMast.findOne({
      where: {
        OwnerId: OwnerID
      },
    });



    // 🔵 ORIGINAL (Previous Owner)
    const original = await MutationDetails.findOne({
      where: {
        OwnerId: OwnerID,
        isActive: 0
      },
      order: [["CreatedDate", "DESC"]]
    });

    // 🟢 CHANGED (New Owner)
    const changed = await MutationDetails.findOne({
      where: {
        OwnerId: OwnerID,
        isActive: 1
      },
      order: [["CreatedDate", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      PropertyInfo:property,

      original: original
        ? {
            // 🔑 Owner identity
            WardNo:property.NewWardNo,
            NewPropertyNo:property.NewPropertyNo,
            OwnerName: original.OwnerName,
            OwnerNameMarathi: original.OwnerNameMarathi,
            OccupierName: original.OccupierName,

            // 📄 Document fields
            OldOwnerPurchaseDate: original.PurchaseDate,
            TransferDate: original.OrderTransferDate,
            OrderNo: original.OrderNo,
            Remark: original.ReasonForSale,
            FerfarDocument: "अर्ज"
          }
        : {},

      changed: changed
        ? {
            OwnerName: changed.OwnerName,
            OwnerNameMarathi: changed.OwnerNameMarathi,
            OccupierName: changed.OccupierName,

            NewOwnerPurchaseDate: changed.PurchaseDate,
            TransferDate: changed.OrderTransferDate,
            OrderNo: changed.OrderNo,
            Remark: changed.ReasonForSale,
            FerfarDocument: "अर्ज"
          }
        : {}
    });

  } catch (error) {
    console.error("❌ Mutation Document Comparison Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


  export const getFerfarDocumentsByOwnerID = async (req, res) => {
    try {
      const { OwnerID,UpdVersionID } = req.body

      const record = await ChangeVersionMaster.findOne({
        where: { OwnerID,UpdVersionID },
        attributes: ['FerfarDocument']
      });

      if (!record || !record.FerfarDocument) {
        return res.json({ success: true, documents: [] });
      }

      const documents = record.FerfarDocument
        .split(',')
        .map(f => ({
          fileName: f,
          fileUrl: `/FerFar_Documents/ferfar-mutation/${f}`
        }));

      return res.json({ success: true, documents });

    } catch (err) {
      return res.status(500).json({ success: false });
    }
  };


export const saveApprovedRequest = async (req, res) => {
  try {
    console.log(req.body,"frontend req to be approve");
    const { OwnerID, selectedVersionID, remark, user } = req.body;

    if (!OwnerID || !selectedVersionID) {
      return res.status(400).json({
        success: false,
        message: 'OwnerID, UpdVersionID and status are required'
      });
    }

    // 🔎 Find EXACT mutation request
    const record = await ChangeVersionMaster.findOne({
      where: {
        OwnerID,
        UpdVersionID:selectedVersionID,
        ApplicationPageSource: 'OPMutation'
      }
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Mutation request not found'
      });
    }

    // 🔁 Update payload
    await record.update({
      ApprovalBy: user?.name || null,
      ApprovalStatus: "APPROVED",
      ApprovalRemark: remark || null,
      ApprovalDate: new Date(),
      UpdatedBy: user?.UserID || null,
      UpdatedName: user?.name || null,
      UpdatedDate: new Date()
    });

    return res.status(200).json({
      success: true,
      message: `Mutation request Approved successfully`
    });

  } catch (error) {
    console.error('Approval Decision Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
 
export const saveDisApprovedRequest = async (req, res) => {
  try {
    const { OwnerID, remark, user,selectedVersionID } = req.body; 

    console.log(req.body,"request body");

    if (!OwnerID || !selectedVersionID) {
      return res.status(400).json({
        success: false,
        message: 'OwnerID, UpdVersionID and status are required'
      });
    }

    // 🔎 Find the existing record for this OwnerID
    const record = await ChangeVersionMaster.findOne({
      where: { OwnerID },
      UpdVersionID:selectedVersionID,
      ApplicationPageSource: 'OPMutation' // optionally, you can also filter ApplicationPageSource: 'OPMutation'
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'ChangeVersionMaster record not found'
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
      ApprovalDate: new Date() // always set approval date when disapproved
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

export const searchMutationRequest = async (req, res) => {
  try {
    const {
      zoneNo,
      wardNo,
      propertyNo,
      ferfarNo,
      approvalStatus,
      taxPayerName,
      fromDate,
      toDate
    } = req.body;

    /* ------------------------------------
       STEP 1: PropertyMast filter (DYNAMIC)
    ------------------------------------ */

    const propertyWhere = {};
    let usePropertyFilter = false;

    // Zone → MANY wards
    if (zoneNo) {
      propertyWhere.NewZoneNo = zoneNo;
      usePropertyFilter = true;
    }

    // Ward → MANY properties
    if (wardNo) {
      propertyWhere.NewWardNo = wardNo;
      usePropertyFilter = true;
    }

    // Property → MAY have partitions
    if (propertyNo) {
      usePropertyFilter = true;

      if (propertyNo.includes('_')) {
        const [propNo, partNo] = propertyNo.split('_');
        propertyWhere.NewPropertyNo = propNo;
        propertyWhere.NewPartitionNo = partNo;
      } else {
        propertyWhere.NewPropertyNo = propertyNo;
        // include only MAIN property
        propertyWhere.NewPartitionNo = { [Op.or]: [null, ''] };
      }
    }

    if (taxPayerName) {
      propertyWhere.OwnerName = { [Op.like]: `%${taxPayerName}%` };
      usePropertyFilter = true;
    }

    /* ------------------------------------
       STEP 2: Get OwnerIDs (NO mutation yet)
    ------------------------------------ */

    let ownerIds = [];

    if (usePropertyFilter) {
      const properties = await PropertyMast.findAll({
        where: propertyWhere,
        attributes: ['OwnerID']
      });

      ownerIds = [...new Set(properties.map(p => p.OwnerID))];

      if (ownerIds.length === 0) {
        return res.status(200).json({ success: true, data: [] });
      }
    }

    /* ------------------------------------
       STEP 3: ChangeVersionMaster (TRUTH)
    ------------------------------------ */

    const cvmWhere = {
      ApplicationPageSource: 'OPMutation'
    };

    // 🔥 This line is WHY results are correct
    if (ownerIds.length > 0) {
      cvmWhere.OwnerID = { [Op.in]: ownerIds };
    }

    if (ferfarNo) {
      cvmWhere.FerfarNo = ferfarNo;
    }

    if (approvalStatus) {
      cvmWhere.ApprovalStatus = approvalStatus.toUpperCase();
    }

    if (fromDate && toDate) {
      cvmWhere.UpdatedDate = {
        [Op.between]: [
          new Date(`${fromDate}T00:00:00`),
          new Date(`${toDate}T23:59:59`)
        ]
      };
    }

    /* ------------------------------------
       STEP 4: Fetch ONLY valid mutations
    ------------------------------------ */

    const mutationRecords = await ChangeVersionMaster.findAll({
      where: cvmWhere,
      order: [['UpdatedDate', 'DESC']]
    });

    if (mutationRecords.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    /* ------------------------------------
       STEP 5: Attach property details
    ------------------------------------ */

    const mutationOwnerIds = [
      ...new Set(mutationRecords.map(r => r.OwnerID))
    ];

    const propertyDetails = await PropertyMast.findAll({
      where: { OwnerID: { [Op.in]: mutationOwnerIds } },
      attributes: [
        'OwnerID',
        'OwnerName',
        'NewZoneNo',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo'
      ]
    });

    const propertyMap = {};
    propertyDetails.forEach(p => {
      propertyMap[p.OwnerID] = p;
    });

    /* ------------------------------------
       STEP 6: Final response (UI-ready)
    ------------------------------------ */

    const result = mutationRecords.map(r => {
      const json = r.toJSON();
      const prop = propertyMap[json.OwnerID] || {};

      return {
        ...json,
        OwnerName: prop.OwnerName || '-',
        NewZoneNo: prop.NewZoneNo || '-',
        NewWardNo: prop.NewWardNo || '-',
        NewPropertyNo: prop.NewPartitionNo
          ? `${prop.NewPropertyNo}_${prop.NewPartitionNo}`
          : prop.NewPropertyNo || '-',
        documents: json.FerfarDocument
          ? json.FerfarDocument.split(',')
          : []
      };
    });

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Search Mutation Request Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



