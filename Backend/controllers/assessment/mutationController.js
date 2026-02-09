import JoinOwnerDetails from "../../models/models/jointownerdetails.js";
import MutationDetails from "../../models/models/mutationdetails.js";
import MutationHistoryDetails from "../../models/models/mutationhistorydetails.js";
import PropertyMast from "../../models/models/propertymast.js";
import sequelize from '../../config/connectionDB.js';
import CombinedOwnerName from "../../models/models/combinedownerrenternames.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import AssessmentMaster from "../../models/models/assessmentmaster.js";
import { v4 as uuidv4 } from 'uuid';

const updVersionId = uuidv4(); // 🔑 ONE version for this mutation


export const postOwnerIdSelectionMutationHistory = async (req, res) => {
  const { OwnerID } = req.body;
  console.log(OwnerID);

  if (!OwnerID) {
    return res.status(400).json({ error: "Owner ID is required" });
  }
  try {
    const mutationProperties = await MutationHistoryDetails.findAll({
      where: {
        OwnerID: OwnerID,
      },
    });
    if (mutationProperties.length === 0) {
      return res
        .status(203)
        .json({
          message: "No mutationProperties found for the given Owner ID",
        });
    }
    return res
      .status(200)
      .json({ message: "mutationProperties found", mutationProperties });
  } catch (error) {
    console.error("Error querying database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// export const postMutationDetails = async (req, res) => {
//   try {
//     console.log("Parsing mutation data...");
//     // Parse the JSON string
//     const parsedData = JSON.parse(req.body.mutationData);

//     if (!Array.isArray(parsedData) || parsedData.length === 0) {
//       console.error(
//         "Invalid mutation data format: Not an array or empty array"
//       );
//       return res.status(400).json({ error: "Invalid mutation data format" });
//     }

//     // Destructure the first (and only) object in the array
//     const {
//       PurchaseDate,
//       SellingDate,
//       ReasonForSale,
//       OrderNo,
//       OrderTransferDate,
//       OwnerTitleMarathi,
//       OwnerNameMarathi,
//       OwnerTitle,
//       OwnerName,
//       isPrime,
//       receivedTransferPropertyList,
//     } = parsedData[0];

//     if (
//       !receivedTransferPropertyList ||
//       receivedTransferPropertyList.length === 0
//     ) {
//       console.error(
//         "Invalid receivedTransferPropertyList format: Not an array or empty array"
//       );
//       return res
//         .status(400)
//         .json({ error: "Invalid receivedTransferPropertyList format" });
//     }

//     console.log("Storing mutation details...");
//     try {
//       const newMutationDetail = await MutationDetails.create({
//         OwnerId: receivedTransferPropertyList[0].OwnerID,
//         PurchaseDate,
//         isPrime,
//         OwnerTitle,
//         OwnerName,
//         SellingDate,
//         ReasonForSale,
//         isSaler: false,
//         isActive: true,
//         OwnerTitleMarathi,
//         OwnerNameMarathi,
//         OrderNo,
//         OrderTransferDate,
//       });

//       console.log("First mutation detail stored:", newMutationDetail);

//       const newMutationDetailSeller = await MutationDetails.create({
//         OwnerId: receivedTransferPropertyList[0].OwnerID,
//         PurchaseDate,
//         isPrime,
//         OwnerTitle: receivedTransferPropertyList[0].OwnerTitle,
//         OwnerName: receivedTransferPropertyList[0].OwnerName,
//         SellingDate,
//         ReasonForSale,
//         TransferType: "whole",
//         isSaler: true,
//         isActive: true,
//         OwnerTitleMarathi: receivedTransferPropertyList[0].OwnerTitleMarathi,
//         OwnerNameMarathi: receivedTransferPropertyList[0].OwnerNameMarathi,
//         OrderNo,
//         OrderTransferDate,
//       });

//       console.log("Second mutation detail stored:", newMutationDetailSeller);

//       // Check if there is an existing entry in MutationHistoryDetails
//       const existingHistory = await MutationHistoryDetails.findOne({
//         where: { OwnerID: receivedTransferPropertyList[0].OwnerID },
//       });

//       if (existingHistory) {
//         console.log("Updating existing MutationHistoryDetails entry...");
//         // Update the existing entry with the new SellerName
//         existingHistory.SellerName += `, ${receivedTransferPropertyList[0].OwnerName}`;
//         existingHistory.BuyerName += `, ${OwnerName}`;

//         await existingHistory.save();
//         console.log("MutationHistoryDetails entry updated:", existingHistory);
//       } else {
//         console.log("Creating new MutationHistoryDetails entry...");
//         // Create a new entry in MutationHistoryDetails
//         const newHistoryDetail = await MutationHistoryDetails.create({
//           OwnerID: receivedTransferPropertyList[0].OwnerID,
//           SellerName: receivedTransferPropertyList[0].OwnerName,
//           BuyerName: OwnerName,
//           PurchaseDate,
//           SellingDate,
//           ReasonForSale,
//           OrderNo,
//           OrderTransferDate,
//         });
//         console.log(
//           "New MutationHistoryDetails entry created:",
//           newHistoryDetail
//         );
//       }

//       res.status(201).json({
//         message: "Mutation details saved successfully",
//         newMutationDetailSeller: {
//           MDId: newMutationDetail.MDId, // Include the MDId here
//           // Include other properties if needed
//         },
//       });
//     } catch (error) {
//       console.error("Error saving mutation details:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   } catch (error) {
//     console.error("Error parsing mutation data:", error);
//     res.status(400).json({ error: "Invalid mutation data format" });
//   }
// };

export const postUpdatedMutationData = async (req, res) => {
  const { fromData } = req.body;

  const {
    OwnerName,
    OccupierName,
    OccupierNameMarathi,
    ReasonForSale,
    OrderNo,
    isPrime,
    MDId,
    OwnerTitleMarathi,
    OwnerNameMarathi,
    OwnerTitle,
  } = fromData;

  try {
    const newMutationDetailSeller = await MutationDetails.update(
      {
        ReasonForSale,
        OrderNo,
        OwnerTitleMarathi,
        OwnerNameMarathi,
        OccupierName,
        OccupierNameMarathi,
        OwnerTitle,
        OwnerName,
        isPrime,
      },
      {
        where: {
          MDId: MDId,
        },
      }
    );
    console.log(ReasonForSale);

    return res
      .status(200)
      .json({ message: "UpdateMutationData updated", newMutationDetailSeller });
  } catch (error) {
    console.error("Error querying database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateJoinOwnerAndPropertyMastDetails = async (req, res) => {
  try {
    console.log("Parsing mutation data...");
    // Parse the JSON string
    const parsedData = JSON.parse(req.body.mutationData);

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.error(
        "Invalid mutation data format: Not an array or empty array"
      );
      return res.status(400).json({ error: "Invalid mutation data format" });
    }

    const {
      isPrime,
      OwnerTitle,
      OwnerName,
      OccupierName,
      OccupierNameMarathi,
      OwnerTitleMarathi,
      OwnerNameMarathi,
      receivedTransferPropertyList,
    } = parsedData[0];

    const OwnerID = receivedTransferPropertyList[0].OwnerID;

    try {
      console.log(
        "Deleting existing JoinOwnerDetails entries for OwnerID:",
        OwnerID
      );
      await JoinOwnerDetails.destroy({ where: { OwnerID: OwnerID } });

      console.log("Inserting new JoinOwnerDetails entry...");
      const newJoinOwnerDetail = await JoinOwnerDetails.create({
        OwnerID: OwnerID,
        isPrime,
        OwnerTitle,
        OwnerName,
        OccupierName,
        OccupierNameMarathi,
        Address: receivedTransferPropertyList[0].Address,
        BuildingOrShopName: receivedTransferPropertyList[0].BuildingOrShopName,
        BuildingORShopNumber:
          receivedTransferPropertyList[0].BuildingORShopNumber,
        OwnerTitleMarathi,
        OwnerNameMarathi,
        OwnerPatta: receivedTransferPropertyList[0].Address,
        BuildingOrShopNameMarathi:
          receivedTransferPropertyList[0].BuildingOrShopNameMarathi,
        BuildingOrShopNumberMarathi:
          receivedTransferPropertyList[0].BuildingOrShopNumberMarathi,
      });

      console.log("Inserted new JoinOwnerDetails entry:", newJoinOwnerDetail);

      console.log("Updating PropertyMast entries for OwnerID:", OwnerID);
      const updatedPropertyMast = await PropertyMast.update(
        {
          OwnerTitle,
          OwnerName,
          OccupierName,
    OccupierNameMarathi,
          OwnerTitleMarathi,
          OwnerNameMarathi,
          isPrime,
        },
        {
          where: { OwnerID: OwnerID },
        }
      );

      console.log("Updated PropertyMast entries:", updatedPropertyMast);

      res
        .status(201)
        .json({
          message: "JoinOwnerDetails and PropertyMast updated successfully",
          newJoinOwnerDetail,
        });
    } catch (error) {
      console.error("Error updating JoinOwnerDetails and PropertyMast:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("Error parsing mutation data:", error);
    res.status(400).json({ error: "Invalid mutation data format" });
  }
};


export const postMutationDetails = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log("📥 Received mutation data payload:", JSON.stringify(req.body, null, 2));

    const parsedData = req.body.mutationData; 
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return res.status(400).json({ error: "Invalid mutation data format" });
    }

    const {
      PurchaseDate,
      SellingDate,
      ReasonForSale,
      OrderNo,
      OrderTransferDate,
      isPrime,
      receivedTransferPropertyList,
    } = parsedData[0];

    if (!receivedTransferPropertyList || receivedTransferPropertyList.length === 0) {
      return res.status(400).json({ error: "Invalid receivedTransferPropertyList format" });
    }

    const ownerID = receivedTransferPropertyList[0].OwnerID;
    if (!ownerID) {
      return res.status(400).json({ error: "Missing OwnerID in request" });
    }

    // ✅ Extract NEW BUYER from list
    const newBuyer = receivedTransferPropertyList[0];

    // ================================
    // 1. Get Previous Owner (Seller) from CombinedOwnerName
    // ================================
    const sellerRecord = await CombinedOwnerName.findOne({ where: { OwnerID: ownerID }, transaction: t });
    if (!sellerRecord) {
      return res.status(404).json({ error: "Previous owner not found in CombinedOwnerName" });
    }
    const oldOwner = sellerRecord.toJSON();

    console.log("🔎 Previous Owner (Seller):", {
      OwnerID: ownerID,
      OwnerName: oldOwner.OwnerName,
      OwnerNameMarathi: oldOwner.MarathiOwnerName,
      OccupierName:oldOwner.OccupierName,
      OccupierNameMarathi:oldOwner.OccupierNameMarathi,
    });

    console.log("🆕 New Owner (Buyer):", {
      OwnerID: ownerID,
      OwnerName: newBuyer.OwnerName,
      OwnerNameMarathi: newBuyer.OwnerNameMarathi,
      OccupierName:newBuyer.OccupierName,
      OccupierNameMarathi:newBuyer.OccupierNameMarathi,
      OrderNo: newBuyer.OrderNo,
      OrderTransferDate: newBuyer.OrderTransferDate,
    });

    // ================================
    // 2. Refresh JoinOwnerDetails
    // ================================
    await JoinOwnerDetails.destroy({ where: { OwnerID: ownerID }, transaction: t });
    console.log(`🗑️ Deleted all old joint owners for OwnerID: ${ownerID}`);

    const newJointOwners = await JoinOwnerDetails.bulkCreate(receivedTransferPropertyList, {
      returning: true,
      transaction: t,
    });
    console.log("✅ Inserted new joint owners:", newJointOwners.map(j => j.toJSON()));

    // ================================
    // 3. Update PropertyMast with Buyer
    // ================================
    await PropertyMast.update(
      {
        OwnerTitle: newBuyer.OwnerTitle,
        OwnerName: newBuyer.OwnerName,
        OwnerTitleMarathi: newBuyer.OwnerTitleMarathi,
        OwnerNameMarathi: newBuyer.OwnerNameMarathi,
        OccupierName:newBuyer.OccupierName,
        OccupierNameMarathi:newBuyer.OccupierNameMarathi,
        isPrime: newBuyer.isPrime,
      },
      { where: { OwnerID: ownerID }, transaction: t }
    );
    console.log("🏠 PropertyMast updated with new buyer:", { OwnerID: ownerID, OwnerName: newBuyer.OwnerName });

    // ================================
    // 4. MutationDetails (Buyer + Seller)
    // ================================
    const mutationDetailBuyer = await MutationDetails.create({
      OwnerId: ownerID,
      PurchaseDate: newBuyer.PurchaseDate,
      SellingDate: newBuyer.SellingDate,
      ReasonForSale: newBuyer.ReasonForSale,
      OrderNo: newBuyer.OrderNo,
      OrderTransferDate: newBuyer.OrderTransferDate,
      isPrime: newBuyer.isPrime,
      OwnerTitle: newBuyer.OwnerTitle,
      OwnerName: newBuyer.OwnerName,
      OwnerTitleMarathi: newBuyer.OwnerTitleMarathi,
      OwnerNameMarathi: newBuyer.OwnerNameMarathi,
      OccupierName: newBuyer.OccupierName,
      OccupierNameMarathi: newBuyer.OccupierNameMarathi,
      isSaler: true,
      isActive: true,
      TransferType: "whole",
     CreatedDate: newBuyer.PurchaseDate || new Date(), // fallback to today if null
     UpdatedDate: newBuyer.OrderTransferDate || new Date(),
    UpdVersionID: updVersionId, // ✅ SAME ID


    }, { transaction: t });
    console.log("📝 MutationDetails (Buyer) created:", mutationDetailBuyer.toJSON());

    const mutationDetailSeller = await MutationDetails.create({
      OwnerId: ownerID,
      PurchaseDate,
      SellingDate,
      ReasonForSale,
      OrderNo,
      OrderTransferDate,
      isPrime: false,
      OwnerTitle: "", 
      OwnerName: oldOwner.OwnerName,
      OwnerTitleMarathi: "",
      OwnerNameMarathi: oldOwner.MarathiOwnerName,
      OccupierName: oldOwner.OccupierName,
      OccupierNameMarathi: oldOwner.OccupierNameMarathi,
      // TransferType: "whole",
      isSaler: false,
      isActive: false,
      UpdVersionID: updVersionId, // ✅ SAME ID

    }, { transaction: t });
    console.log("📝 MutationDetails (Seller) created:", mutationDetailSeller.toJSON());

    // ================================
    // 5. MutationHistoryDetails
    // ================================
    let mutationHistory;
    const existingHistory = await MutationHistoryDetails.findOne({
      where: { OwnerID: ownerID },
      transaction: t,
    });

    if (existingHistory) {
      console.log("🔄 Updating existing MutationHistoryDetails entry...");
      existingHistory.SellerName = oldOwner.OwnerName;   // overwrite
      existingHistory.BuyerName  = newBuyer.OwnerName; 
      await existingHistory.save({ transaction: t });
      mutationHistory = existingHistory;
      console.log("✅ MutationHistoryDetails updated:", mutationHistory.toJSON());
    } else {
      console.log("🆕 Creating new MutationHistoryDetails entry...");
      mutationHistory = await MutationHistoryDetails.create({
        OwnerID: ownerID,
        SellerName: oldOwner.OwnerName,
        BuyerName: newBuyer.OwnerName,
        PurchaseDate: newBuyer.PurchaseDate,
        SellingDate: newBuyer.SellingDate,
        ReasonForSale: newBuyer.ReasonForSale,
           //ReasonForSale: "",
        OrderNo: newBuyer.OrderNo,
        OrderTransferDate: newBuyer.OrderTransferDate,
      }, { transaction: t });
      console.log("✅ MutationHistoryDetails created:", mutationHistory.toJSON());
    }

    // ================================
    // 6. Update CombinedOwnerName → Buyer
    // ================================
    await CombinedOwnerName.update(
      { OwnerName: newBuyer.OwnerName, MarathiOwnerName: newBuyer.OwnerNameMarathi },
      { where: { OwnerID: ownerID }, transaction: t }
    );
    console.log("🏷️ CombinedOwnerName updated to new buyer:", { OwnerID: ownerID, OwnerName: newBuyer.OwnerName });

    // ================================
    // 7. Commit Transaction
    // ================================
    await t.commit();

    res.status(201).json({
      message: "Mutation details saved successfully",
      mutationDetailBuyer,
      mutationDetailSeller,
      mutationHistory,
      jointOwners: newJointOwners,
      UpdVersionID: updVersionId, // ✅ RETURN THIS
      OwnerID: ownerID,
    });

  } catch (error) {
    await t.rollback();
    console.error("❌ Error in postMutationDetails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getNpTitle = async (req, res) => {
  try {
    const assessment = await AssessmentMaster.findOne({
      where: { AssessmentID: 1 },
    });

    if (!assessment) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ NPTitle: assessment.NPTitle });
  } catch (err) {
    console.error("❌ Sequelize error in getNpTitle:", err); // <== full error
    res.status(500).json({ error: err.message });           // <== bubble up real cause
  }
};



// ======================
// Upload Controller
// ======================
export const uploadMutationDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      fileName: req.file.filename,
      filePath: req.file.path,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "File upload failed" });
  }
};
